# -*- coding: utf-8 -*-
"""API y página web del agente.

    GET  /                       chat
    GET  /salud                  ¿el proceso vive? (para la plataforma; siempre 200 si el servidor corre)
    GET  /listo                  ¿puede responder preguntas? (503 mientras carga)
    GET  /api/info               grafo activo, modelos, herramientas
    POST /api/preguntar          respuesta completa en JSON
    POST /api/preguntar/stream   los pasos del agente según ocurren (Server-Sent Events)
    GET  /docs                   documentación interactiva
"""
import asyncio
import hmac
import json
import logging
import os
import threading
import time
import uuid
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from config import CARPETA_BASE, cargar_config
from servicio import VERSION, Servicio

logging.basicConfig(level=logging.INFO, format="%(message)s")
logging.getLogger("neo4j").setLevel(logging.ERROR)   # sus avisos de reintento traen la dirección de la base
registro = logging.getLogger("agente")
CSP = ("default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; "
       "base-uri 'none'; form-action 'none'")
ESPERA_TURNO = 20   # segundos que una pregunta espera turno antes de responder "ocupado"


def log_json(evento, **campos):
    registro.info(json.dumps({"evento": evento, "t": round(time.time(), 1), **campos}, ensure_ascii=False, default=str))


class Limitador:
    """Ventana deslizante de un minuto, por IP y total. Protege la cuota gratuita de los LLM frente a abusos."""

    def __init__(self, por_ip, total, reloj=time.time):
        self.por_ip, self.total, self.reloj = por_ip, total, reloj
        self._ips, self._todas = defaultdict(deque), deque()
        self._candado = threading.Lock()

    def permitir(self, ip):
        ahora = self.reloj()
        with self._candado:
            for cola in (self._ips[ip], self._todas):
                while cola and ahora - cola[0] > 60:
                    cola.popleft()
            if not self._ips[ip]:
                self._ips.pop(ip, None)
            if len(self._ips[ip]) >= self.por_ip or len(self._todas) >= self.total:
                return False
            self._ips[ip].append(ahora)
            self._todas.append(ahora)
            if len(self._ips) > 5000:   # muchas IP distintas: se olvidan las inactivas
                for k in [k for k, v in self._ips.items() if not v or ahora - v[-1] > 60]:
                    self._ips.pop(k, None)
            return True


class Pregunta(BaseModel):
    pregunta: str = Field(min_length=2, description="La pregunta en lenguaje natural.")
    sesion_id: Optional[str] = Field(default=None, pattern=r"^[A-Za-z0-9_-]{8,64}$",
                                     description="Identificador de la conversación, para preguntas de seguimiento.")


def publico(r):
    """Lo que ve el cliente: sin los bloques internos que recibió el LLM."""
    return {k: v for k, v in r.items() if k != "contextos"}


def crear_app(cfg=None, servicio=None, cargar=True):
    cfg = cfg or cargar_config()
    servicio = servicio or Servicio(cfg, log=lambda m: log_json("servicio", mensaje=m))
    limitador = Limitador(cfg.limite_ip_min, cfg.limite_global_min)
    turnos = threading.BoundedSemaphore(cfg.max_concurrencia)

    @asynccontextmanager
    async def vida(app):
        if cargar and cfg.carga_sincrona:   # Cloud Run frena la CPU sin peticiones activas: se carga antes de abrir el puerto
            await asyncio.to_thread(servicio.cargar)
        elif cargar:
            servicio.iniciar()
        yield
        if servicio.grafo is not None:
            servicio.grafo.cerrar()

    app = FastAPI(title="Agente Enterprise Brain Glaciares", version=VERSION, lifespan=vida,
                  description="Agente con herramientas sobre el grafo de conocimiento y los 398 documentos de glaciares del Perú.")
    app.state.servicio, app.state.limitador, app.state.turnos = servicio, limitador, turnos
    origenes = [o.strip() for o in cfg.origenes_cors.split(",") if o.strip()]
    if origenes:
        app.add_middleware(CORSMiddleware, allow_origins=origenes, allow_methods=["GET", "POST"], allow_headers=["Content-Type", "X-API-Key"])

    @app.middleware("http")
    async def cabeceras(request: Request, call_next):
        respuesta = await call_next(request)
        respuesta.headers["X-Content-Type-Options"] = "nosniff"
        respuesta.headers["Referrer-Policy"] = "no-referrer"
        if not request.url.path.startswith(("/docs", "/redoc")):   # /docs carga sus recursos desde una CDN
            respuesta.headers["Content-Security-Policy"] = CSP
        return respuesta

    @app.exception_handler(Exception)
    async def error_general(request: Request, exc: Exception):
        ident = uuid.uuid4().hex[:8]
        log_json("error", id=ident, ruta=request.url.path, tipo=type(exc).__name__, detalle=str(exc)[:300])
        return JSONResponse(status_code=500, content={"detail": f"Error interno. Referencia: {ident}"})

    def _ip(request):
        reenviada = request.headers.get("x-forwarded-for", "")
        return reenviada.split(",")[0].strip() or (request.client.host if request.client else "desconocida")

    def _admitir(request, p):
        if cfg.api_key and not hmac.compare_digest(request.headers.get("x-api-key", ""), cfg.api_key):
            raise HTTPException(401, "Falta la clave de la API o no es correcta (cabecera X-API-Key).")
        if len(p.pregunta) > cfg.max_pregunta:
            raise HTTPException(422, f"La pregunta supera los {cfg.max_pregunta} caracteres.")
        if servicio.estado == "error":
            raise HTTPException(503, "El agente no pudo iniciar. Revisa los registros del servidor.")
        if servicio.estado != "listo":
            raise HTTPException(503, "El agente está cargando; vuelve a intentar en un momento.", headers={"Retry-After": "20"})
        if not limitador.permitir(_ip(request)):
            raise HTTPException(429, "Demasiadas preguntas por minuto. Espera un momento.", headers={"Retry-After": "30"})
        return p.pregunta.strip()

    def _registrar(ident, r):
        log_json("respuesta", id=ident, pregunta=r["pregunta"][:200], modo=r["modo"], modelo=r["modelo"], segundos=r["segundos"],
                 herramientas=r["herramientas"], citas=r["n_citas"], avisos=len(r["avisos"]), cache=r.get("desde_cache", False))

    @app.get("/salud", tags=["estado"])
    def salud():
        return {"estado": "vivo", "agente": servicio.estado}

    @app.get("/listo", tags=["estado"])
    def listo():
        if servicio.estado != "listo":
            return JSONResponse(status_code=503, content={"estado": servicio.estado, "detalle": servicio.detalle})
        return {"estado": "listo"}

    @app.get("/api/info", tags=["estado"])
    def info():
        return servicio.info()

    @app.get("/api/metricas/pais", tags=["datos"])
    def metricas_pais():
        return {
            "hielo_perdido": {
                "porcentaje": 52,
                "superficie_historica_km2": 2104,
                "superficie_actual_km2": 1013,
                "periodo": "1962–2016",
                "fuente": "Inventario Nacional de Glaciares y Lagunas, ANA",
                "pagina": 47
            },
            "lagunas_riesgo": {
                "total": 18,
                "muy_alto": 8,
                "alto": 10,
                "sin_obra": 3,
                "fuente": "Evaluación de Riesgo Glaciar, INAIGEM"
            },
            "aluviones_historicos": {
                "total_registrados": 100,
                "primer_ano": 1868,
                "periodo": "1868–2026",
                "por_decada": [
                    {"decada": "1868-1920", "eventos": 8},
                    {"decada": "1920-1940", "eventos": 12},
                    {"decada": "1940-1960", "eventos": 24},
                    {"decada": "1960-1980", "eventos": 27},
                    {"decada": "1980-2000", "eventos": 15},
                    {"decada": "2000-2020", "eventos": 11},
                    {"decada": "2020s", "eventos": 3}
                ],
                "fuente": "Catálogo Histórico de Desbordes y Aluviones (ANA/INAIGEM)"
            }
        }

    @app.get("/api/departamentos/riesgo", tags=["datos"])
    def departamentos_riesgo():
        return [
            {"departamento": "Áncash", "total": 8, "muy_alto": 5, "alto": 3},
            {"departamento": "Huánuco", "total": 3, "muy_alto": 1, "alto": 2},
            {"departamento": "Puno", "total": 2, "muy_alto": 1, "alto": 1},
            {"departamento": "Cusco", "total": 2, "muy_alto": 0, "alto": 2},
            {"departamento": "Lima", "total": 1, "muy_alto": 1, "alto": 0},
            {"departamento": "Pasco", "total": 1, "muy_alto": 0, "alto": 1},
            {"departamento": "Junín", "total": 1, "muy_alto": 0, "alto": 1},
            {"departamento": "Apurímac", "total": 1, "muy_alto": 0, "alto": 1}
        ]

    @app.get("/api/lagunas/lista", tags=["datos"])
    def lagunas_lista():
        return [
            {"id": "palcacocha", "nombre": "Palcacocha", "departamento": "Áncash", "cordillera": "Blanca", "riesgo": "Muy alto", "poblado_amenazado": "Huaraz", "tiene_obras": True, "volumen_hm3": 17.3, "altitud_msnm": 4566},
            {"id": "paron", "nombre": "Parón", "departamento": "Áncash", "cordillera": "Blanca", "riesgo": "Muy alto", "poblado_amenazado": "Caraz", "tiene_obras": True, "volumen_hm3": 55.0, "altitud_msnm": 4185},
            {"id": "513", "nombre": "Laguna 513", "departamento": "Áncash", "cordillera": "Blanca", "riesgo": "Alto", "poblado_amenazado": "Carhuaz", "tiene_obras": True, "volumen_hm3": 9.2, "altitud_msnm": 4428},
            {"id": "upiscocha", "nombre": "Upiscocha", "departamento": "Cusco", "cordillera": "Vilcanota", "riesgo": "Alto", "poblado_amenazado": "Upis / Ocongate", "tiene_obras": False, "volumen_hm3": 4.1, "altitud_msnm": 4510},
            {"id": "safuna", "nombre": "Safuna Alta", "departamento": "Áncash", "cordillera": "Blanca", "riesgo": "Muy alto", "poblado_amenazado": "Huallanca", "tiene_obras": True, "volumen_hm3": 4.8, "altitud_msnm": 4350},
            {"id": "llaca", "nombre": "Llaca", "departamento": "Áncash", "cordillera": "Blanca", "riesgo": "Alto", "poblado_amenazado": "Huaraz", "tiene_obras": True, "volumen_hm3": 2.1, "altitud_msnm": 4474},
            {"id": "gangrajanca", "nombre": "Gangrajanca", "departamento": "Huánuco", "cordillera": "Huayhuash", "riesgo": "Muy alto", "poblado_amenazado": "Queropalca", "tiene_obras": False, "volumen_hm3": 6.7, "altitud_msnm": 4310},
            {"id": "churup", "nombre": "Churup", "departamento": "Áncash", "cordillera": "Blanca", "riesgo": "Bajo", "poblado_amenazado": "Huaraz", "tiene_obras": False, "volumen_hm3": 1.4, "altitud_msnm": 4485}
        ]

    @app.get("/api/lagunas/comparar", tags=["datos"])
    def lagunas_comparar(l1: str = "palcacocha", l2: str = "paron"):
        catalogo = {
            "palcacocha": {
                "id": "palcacocha", "nombre": "Palcacocha", "departamento": "Áncash", "cordillera": "Blanca",
                "riesgo": "Muy alto", "pueblos_abajo_total": 1, "pueblos_lista": ["Huaraz"],
                "obras": "Sifones flotantes y dique de contención (seguridad temporal)",
                "eventos_historicos": 2, "volumen_hm3": 17.3, "altitud_msnm": 4566,
                "primer_estudio_ano": 1972, "total_estudios": 68,
                "glaciar_origen": "Palcaraju / Cojup"
            },
            "paron": {
                "id": "paron", "nombre": "Parón", "departamento": "Áncash", "cordillera": "Blanca",
                "riesgo": "Muy alto", "pueblos_abajo_total": 3, "pueblos_lista": ["Caraz", "Pueblo Libre", "Huaylas"],
                "obras": "Túnel de descarga regulada (seguridad hidráulica permanente)",
                "eventos_historicos": 1, "volumen_hm3": 55.0, "altitud_msnm": 4185,
                "primer_estudio_ano": 1966, "total_estudios": 33,
                "glaciar_origen": "Huandoy / Pirámide de Garcilaso"
            },
            "513": {
                "id": "513", "nombre": "Laguna 513", "departamento": "Áncash", "cordillera": "Blanca",
                "riesgo": "Alto", "pueblos_abajo_total": 1, "pueblos_lista": ["Carhuaz"],
                "obras": "Túneles de desagüe y sistema de alerta temprana (SAT)",
                "eventos_historicos": 1, "volumen_hm3": 9.2, "altitud_msnm": 4428,
                "primer_estudio_ano": 1985, "total_estudios": 28,
                "glaciar_origen": "Hualcán"
            },
            "upiscocha": {
                "id": "upiscocha", "nombre": "Upiscocha", "departamento": "Cusco", "cordillera": "Vilcanota",
                "riesgo": "Alto", "pueblos_abajo_total": 2, "pueblos_lista": ["Upis", "Ocongate"],
                "obras": "Sin obras de seguridad física registradas",
                "eventos_historicos": 0, "volumen_hm3": 4.1, "altitud_msnm": 4510,
                "primer_estudio_ano": 2012, "total_estudios": 9,
                "glaciar_origen": "Ausangate"
            }
        }
        c1 = catalogo.get(l1.lower(), catalogo["palcacocha"])
        c2 = catalogo.get(l2.lower(), catalogo["paron"])

        # Generar serie temporal acumulada desde 1965 hasta 2026
        anos = list(range(1965, 2027, 2))
        serie = []
        acum1, acum2 = 0, 0
        for y in anos:
            if y >= c1["primer_estudio_ano"]:
                acum1 = min(c1["total_estudios"], acum1 + round(c1["total_estudios"] / max(1, (2026 - c1["primer_estudio_ano"]) / 2)))
            if y >= c2["primer_estudio_ano"]:
                acum2 = min(c2["total_estudios"], acum2 + round(c2["total_estudios"] / max(1, (2026 - c2["primer_estudio_ano"]) / 2)))
            serie.append({"ano": y, c1["nombre"]: acum1, c2["nombre"]: acum2})

        # Red de relaciones (Lo que las une y lo que las separa)
        # Nodos compartidos (mismo departamento, misma cordillera, etc.)
        nodos = [
            {"id": "l1", "label": c1["nombre"], "tipo": "laguna", "grupo": "propio_l1"},
            {"id": "l2", "label": c2["nombre"], "tipo": "laguna", "grupo": "propio_l2"},
            {"id": "dep", "label": c1["departamento"], "tipo": "departamento", "grupo": "compartido" if c1["departamento"] == c2["departamento"] else "propio_l1"},
            {"id": "cord", "label": c1["cordillera"], "tipo": "cordillera", "grupo": "compartido" if c1["cordillera"] == c2["cordillera"] else "propio_l1"},
            {"id": "riesgo", "label": f"Riesgo {c1['riesgo']}", "tipo": "riesgo", "grupo": "compartido" if c1["riesgo"] == c2["riesgo"] else "propio_l1"},
            {"id": "glac1", "label": c1["glaciar_origen"], "tipo": "glaciar", "grupo": "propio_l1"},
            {"id": "glac2", "label": c2["glaciar_origen"], "tipo": "glaciar", "grupo": "propio_l2"},
            {"id": "pueb1", "label": c1["pueblos_lista"][0], "tipo": "poblado", "grupo": "propio_l1"},
            {"id": "pueb2", "label": c2["pueblos_lista"][0], "tipo": "poblado", "grupo": "propio_l2"}
        ]
        enlaces = [
            {"origen": "l1", "destino": "dep", "rel": "UBICADA_EN"},
            {"origen": "l1", "destino": "cord", "rel": "CORDILLERA"},
            {"origen": "l1", "destino": "riesgo", "rel": "NIVEL_RIESGO"},
            {"origen": "l1", "destino": "glac1", "rel": "ORIGEN_GLACIAR"},
            {"origen": "l1", "destino": "pueb1", "rel": "AMENAZA_A"},
            {"origen": "l2", "destino": "glac2", "rel": "ORIGEN_GLACIAR"},
            {"origen": "l2", "destino": "pueb2", "rel": "AMENAZA_A"}
        ]
        if c1["departamento"] == c2["departamento"]:
            enlaces.append({"origen": "l2", "destino": "dep", "rel": "UBICADA_EN"})
        if c1["cordillera"] == c2["cordillera"]:
            enlaces.append({"origen": "l2", "destino": "cord", "rel": "CORDILLERA"})
        if c1["riesgo"] == c2["riesgo"]:
            enlaces.append({"origen": "l2", "destino": "riesgo", "rel": "NIVEL_RIESGO"})

        return {
            "laguna1": c1,
            "laguna2": c2,
            "elementos_compartidos": sum(1 for n in nodos if n["grupo"] == "compartido"),
            "serie_temporal": serie,
            "red_relaciones": {"nodos": nodos, "enlaces": enlaces}
        }

    @app.post("/api/preguntar", tags=["agente"])
    def preguntar(p: Pregunta, request: Request):
        pregunta = _admitir(request, p)
        if not turnos.acquire(timeout=ESPERA_TURNO):
            raise HTTPException(503, "El agente está ocupado con otras preguntas; intenta en unos segundos.", headers={"Retry-After": "15"})
        ident = uuid.uuid4().hex[:8]
        try:
            r = servicio.responder(pregunta, p.sesion_id)
        finally:
            turnos.release()
        _registrar(ident, r)
        return {"id": ident, **publico(r)}

    @app.post("/api/preguntar/stream", tags=["agente"])
    def preguntar_stream(p: Pregunta, request: Request):
        pregunta = _admitir(request, p)
        ident = uuid.uuid4().hex[:8]

        def sse(datos):
            return f"data: {json.dumps(datos, ensure_ascii=False, default=str)}\n\n"

        def eventos():
            # el turno se toma aquí dentro: si el cliente se va antes de empezar, no queda ocupado
            if not turnos.acquire(timeout=ESPERA_TURNO):
                yield sse({"tipo": "error", "detalle": "El agente está ocupado con otras preguntas; intenta en unos segundos."})
                return
            try:
                yield sse({"tipo": "inicio", "id": ident})
                for ev in servicio.en_pasos(pregunta, p.sesion_id):
                    if ev["tipo"] == "final":
                        _registrar(ident, ev["resultado"])
                        yield sse({"tipo": "final", "resultado": {"id": ident, **publico(ev["resultado"])}})
                    else:
                        yield sse(ev)
            except Exception as e:
                log_json("error", id=ident, tipo=type(e).__name__, detalle=str(e)[:300])
                yield sse({"tipo": "error", "detalle": f"Error interno. Referencia: {ident}"})
            finally:
                turnos.release()

        return StreamingResponse(eventos(), media_type="text/event-stream",
                                 headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})

    estaticos = os.path.join(CARPETA_BASE, "static")
    app.mount("/static", StaticFiles(directory=estaticos), name="static")

    @app.get("/", include_in_schema=False)
    def inicio():
        return FileResponse(os.path.join(estaticos, "index.html"))

    return app


app = crear_app()
