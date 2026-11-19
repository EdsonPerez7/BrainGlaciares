import { SITE_CONFIG } from '../config/site.config';
import { acotar } from '../utils/seguridad';
import { METRICAS_PAIS, DEPARTAMENTOS_RIESGO, LAGUNAS_DESTACADAS } from '../config/metrics.data';
import type { MetricasPaisResponse, DepartamentoRiesgo, LagunaItem, ComparacionResponse, CordilleraGlaciar, SaludResponse, CatalogoResponse } from '../models/types';

let BASE_URL = SITE_CONFIG.apiBaseUrl;

let _memoriaCatalogo: CatalogoResponse | null = null;
let _memoriaDeptos: DepartamentoRiesgo[] | null = null;

export const ApiService = {
  getBaseUrl(): string {
    return BASE_URL;
  },
  async getCatalogo(limite: number = 80, q: string = '', forzarRecarga = false): Promise<CatalogoResponse> {
    if (!q && !forzarRecarga && _memoriaCatalogo) {
      return _memoriaCatalogo;
    }
    try {
      const url = `${BASE_URL}/api/catalogo?limite=${acotar(limite, 1, 200)}${q ? `&q=${encodeURIComponent(q.slice(0, 120))}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (!q && data && data.lagunas && data.lagunas.length > 0) {
          _memoriaCatalogo = data;
        }
        return data;
      }
    } catch {
      // Fallback local enriquecido
    }
    return {
      lagunas: LAGUNAS_DESTACADAS.map(l => ({
        id: l.id,
        nombre: l.nombre,
        departamento: l.departamento,
        cordillera: l.cordillera,
        riesgo: l.riesgo,
        n_docs: l.total_documentos,
        lat: l.lat,
        lng: l.lng,
        volumen_hm3: l.volumen_hm3,
        altitud_msnm: l.altitud_msnm,
        poblado_amenazado: l.poblado_amenazado,
        tiene_obras: l.tiene_obras,
        obras_detalle: l.obras_detalle,
        glaciar_origen: l.glaciar_origen,
        confianza: l.confianza,
        fecha_actualizacion: l.fecha_actualizacion,
        url: `/buscar?id=${l.id}`
      })),
      departamentos: DEPARTAMENTOS_RIESGO.map(d => ({
        id: d.departamento.toLowerCase(),
        nombre: d.departamento,
        n_docs: d.total * 8,
        url: `/buscar?dept=${encodeURIComponent(d.departamento.toLowerCase())}`
      })),
      total_lagunas: 2038,
      total_departamentos: 24,
      total_documentos: 398
    };
  },

  async buscar(query: string, limite: number = 20): Promise<{ consulta: string; entidades: any[]; documentos: any[]; fromApi: boolean }> {
    try {
      const res = await fetch(`${BASE_URL}/api/buscar?q=${encodeURIComponent(query.slice(0, 120))}&limite=${acotar(limite, 1, 50)}`);
      if (res.ok) {
        const data = await res.json();
        return { ...data, fromApi: true };
      }
    } catch {
      // Fallback local
    }

    const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const qNorm = norm(query);

    const lagunasMatch = LAGUNAS_DESTACADAS
      .filter(l => norm(l.nombre).includes(qNorm) || norm(l.departamento).includes(qNorm) || norm(l.poblado_amenazado).includes(qNorm))
      .map(l => ({
        id: l.id,
        nombre: l.nombre,
        tipo: 'Laguna',
        departamento: l.departamento,
        nivel_riesgo: l.riesgo,
        n_documentos: l.total_documentos,
        url: `/buscar?id=${l.id}`
      }));

    const deptosMatch = DEPARTAMENTOS_RIESGO
      .filter(d => norm(d.departamento).includes(qNorm))
      .map(d => ({
        id: norm(d.departamento),
        nombre: d.departamento,
        tipo: 'Departamento',
        departamento: '',
        nivel_riesgo: 'Oficial',
        n_documentos: d.total * 8,
        url: `/buscar?dept=${encodeURIComponent(norm(d.departamento))}`
      }));

    return {
      consulta: query,
      entidades: [...deptosMatch, ...lagunasMatch].slice(0, limite),
      documentos: [],
      fromApi: false
    };
  },

  async getSalud(): Promise<SaludResponse | null> {
    const candidatos: string[] = [BASE_URL];
    if (typeof window !== 'undefined') {
      const h = window.location.hostname;
      if (h === 'localhost' || h === '127.0.0.1') {
        if (!candidatos.includes('http://127.0.0.1:8080')) candidatos.unshift('http://127.0.0.1:8080');
        if (!candidatos.includes('http://localhost:8080')) candidatos.unshift('http://localhost:8080');
      }
    }

    for (const host of candidatos) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(`${host}/salud`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          BASE_URL = host;
          return await res.json();
        }
      } catch {
        // Probar siguiente host
      }
    }
    return null;
  },

  async getCordilleras(): Promise<CordilleraGlaciar[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/cordilleras`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return [
      { nombre: "Cordillera Blanca", departamento: "Áncash", superficie_1962_km2: 723.4, superficie_actual_km2: 448.8, perdida_pct: 38.0, lagunas_total: 830, lagunas_peligrosas: 12 },
      { nombre: "Cordillera Vilcanota", departamento: "Cusco / Puno", superficie_1962_km2: 418.4, superficie_actual_km2: 255.4, perdida_pct: 39.0, lagunas_total: 474, lagunas_peligrosas: 4 },
      { nombre: "Cordillera Central", departamento: "Lima / Junín", superficie_1962_km2: 146.7, superficie_actual_km2: 58.1, perdida_pct: 60.4, lagunas_total: 215, lagunas_peligrosas: 2 },
      { nombre: "Cordillera Huayhuash", departamento: "Áncash / Huánuco / Lima", superficie_1962_km2: 85.0, superficie_actual_km2: 52.4, perdida_pct: 38.4, lagunas_total: 142, lagunas_peligrosas: 3 },
      { nombre: "Cordillera Ampato", departamento: "Arequipa", superficie_1962_km2: 146.8, superficie_actual_km2: 61.2, perdida_pct: 58.3, lagunas_total: 98, lagunas_peligrosas: 1 }
    ];
  },
  async getMetricasPais(): Promise<MetricasPaisResponse> {
    try {
      const res = await fetch(`${BASE_URL}/api/metricas/pais`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback seguro usando el Archivo de la Verdad local
    }
    return {
      hielo_perdido: {
        porcentaje: METRICAS_PAIS.hielo_perdido.porcentaje,
        superficie_historica_km2: METRICAS_PAIS.hielo_perdido.superficie_1962_km2,
        superficie_actual_km2: METRICAS_PAIS.hielo_perdido.superficie_2016_km2,
        periodo: METRICAS_PAIS.hielo_perdido.periodo,
        fuente: METRICAS_PAIS.hielo_perdido.fuente,
        pagina: METRICAS_PAIS.hielo_perdido.pagina
      },
      lagunas_riesgo: {
        total: METRICAS_PAIS.lagunas_riesgo.total,
        muy_alto: METRICAS_PAIS.lagunas_riesgo.muy_alto,
        alto: METRICAS_PAIS.lagunas_riesgo.alto,
        sin_obra: METRICAS_PAIS.lagunas_riesgo.sin_obras_seguridad,
        fuente: METRICAS_PAIS.lagunas_riesgo.fuente
      },
      aluviones_historicos: {
        total_registrados: METRICAS_PAIS.aluviones_historicos.total_registrados,
        primer_ano: METRICAS_PAIS.aluviones_historicos.primer_registro_ano,
        periodo: METRICAS_PAIS.aluviones_historicos.periodo,
        por_decada: [
          { decada: "1868-1920", eventos: 8 },
          { decada: "1920-1940", eventos: 12 },
          { decada: "1940-1960", eventos: 24 },
          { decada: "1960-1980", eventos: 27 },
          { decada: "1980-2000", eventos: 15 },
          { decada: "2000-2020", eventos: 11 },
          { decada: "2020s", eventos: 3 }
        ],
        fuente: METRICAS_PAIS.aluviones_historicos.fuente
      }
    };
  },

  async getDepartamentosRiesgo(forzarRecarga = false): Promise<DepartamentoRiesgo[]> {
    if (!forzarRecarga && _memoriaDeptos) {
      return _memoriaDeptos;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/departamentos/riesgo`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          _memoriaDeptos = data;
        }
        return data;
      }
    } catch {
      // Fallback local
    }
    return DEPARTAMENTOS_RIESGO;
  },

  async getLagunaFicha(id: string): Promise<any> {
    const cleanId = (id || "").replace(/^Laguna:/i, "").trim();
    try {
      const res = await fetch(`${BASE_URL}/api/lagunas/${encodeURIComponent(cleanId)}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  },

  async getLagunasLista(): Promise<LagunaItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/lagunas/lista`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback local
    }
    return LAGUNAS_DESTACADAS.map(l => ({
      id: l.id,
      nombre: l.nombre,
      departamento: l.departamento,
      cordillera: l.cordillera,
      riesgo: l.riesgo,
      poblado_amenazado: l.poblado_amenazado,
      tiene_obras: l.tiene_obras,
      volumen_hm3: l.volumen_hm3,
      altitud_msnm: l.altitud_msnm
    }));
  },

  async getComparacion(l1: string, l2: string): Promise<ComparacionResponse | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${BASE_URL}/api/lagunas/comparar?l1=${encodeURIComponent(l1)}&l2=${encodeURIComponent(l2)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) return await res.json();
    } catch {
      // Fallback local instantáneo y enriquecido
    }

    const item1 = LAGUNAS_DESTACADAS.find(l => l.id === l1) || LAGUNAS_DESTACADAS[1];
    const item2 = LAGUNAS_DESTACADAS.find(l => l.id === l2) || LAGUNAS_DESTACADAS[2];

    const nodos: Array<{ id: string; label: string; tipo: string; grupo: string }> = [
      { id: "l1", label: item1.nombre, tipo: "laguna", grupo: "propio_l1" },
      { id: "l2", label: item2.nombre, tipo: "laguna", grupo: "propio_l2" }
    ];
    const enlaces: Array<{ origen: string; destino: string; rel: string }> = [];

    // Departamento
    if (item1.departamento === item2.departamento) {
      nodos.push({ id: "dep_c", label: item1.departamento, tipo: "departamento", grupo: "compartido" });
      enlaces.push({ origen: "l1", destino: "dep_c", rel: "UBICADA_EN" }, { origen: "l2", destino: "dep_c", rel: "UBICADA_EN" });
    } else {
      nodos.push({ id: "dep1", label: item1.departamento, tipo: "departamento", grupo: "propio_l1" });
      nodos.push({ id: "dep2", label: item2.departamento, tipo: "departamento", grupo: "propio_l2" });
      enlaces.push({ origen: "l1", destino: "dep1", rel: "UBICADA_EN" }, { origen: "l2", destino: "dep2", rel: "UBICADA_EN" });
    }

    // Cordillera
    if (item1.cordillera === item2.cordillera) {
      nodos.push({ id: "cord_c", label: `C. ${item1.cordillera}`, tipo: "cordillera", grupo: "compartido" });
      enlaces.push({ origen: "l1", destino: "cord_c", rel: "CORDILLERA" }, { origen: "l2", destino: "cord_c", rel: "CORDILLERA" });
    } else {
      nodos.push({ id: "cord1", label: `C. ${item1.cordillera}`, tipo: "cordillera", grupo: "propio_l1" });
      nodos.push({ id: "cord2", label: `C. ${item2.cordillera}`, tipo: "cordillera", grupo: "propio_l2" });
      enlaces.push({ origen: "l1", destino: "cord1", rel: "CORDILLERA" }, { origen: "l2", destino: "cord2", rel: "CORDILLERA" });
    }

    // Nivel de riesgo
    if (item1.riesgo === item2.riesgo) {
      nodos.push({ id: "riesgo_c", label: `Riesgo ${item1.riesgo}`, tipo: "riesgo", grupo: "compartido" });
      enlaces.push({ origen: "l1", destino: "riesgo_c", rel: "NIVEL_RIESGO" }, { origen: "l2", destino: "riesgo_c", rel: "NIVEL_RIESGO" });
    } else {
      nodos.push({ id: "riesgo1", label: `Riesgo ${item1.riesgo}`, tipo: "riesgo", grupo: "propio_l1" });
      nodos.push({ id: "riesgo2", label: `Riesgo ${item2.riesgo}`, tipo: "riesgo", grupo: "propio_l2" });
      enlaces.push({ origen: "l1", destino: "riesgo1", rel: "NIVEL_RIESGO" }, { origen: "l2", destino: "riesgo2", rel: "NIVEL_RIESGO" });
    }

    // Glaciar de origen
    if (item1.glaciar_origen === item2.glaciar_origen) {
      nodos.push({ id: "glac_c", label: item1.glaciar_origen, tipo: "glaciar", grupo: "compartido" });
      enlaces.push({ origen: "l1", destino: "glac_c", rel: "ORIGEN_GLACIAR" }, { origen: "l2", destino: "glac_c", rel: "ORIGEN_GLACIAR" });
    } else {
      nodos.push({ id: "glac1", label: item1.glaciar_origen.split('/')[0].trim(), tipo: "glaciar", grupo: "propio_l1" });
      nodos.push({ id: "glac2", label: item2.glaciar_origen.split('/')[0].trim(), tipo: "glaciar", grupo: "propio_l2" });
      enlaces.push({ origen: "l1", destino: "glac1", rel: "ORIGEN_GLACIAR" }, { origen: "l2", destino: "glac2", rel: "ORIGEN_GLACIAR" });
    }

    // Poblado amenazado
    const p1 = item1.poblado_amenazado.split(',')[0].trim();
    const p2 = item2.poblado_amenazado.split(',')[0].trim();
    if (p1 === p2 && p1 !== 'Nadie registrado abajo') {
      nodos.push({ id: "pob_c", label: p1, tipo: "poblado", grupo: "compartido" });
      enlaces.push({ origen: "l1", destino: "pob_c", rel: "AMENAZA_A" }, { origen: "l2", destino: "pob_c", rel: "AMENAZA_A" });
    } else {
      if (p1) nodos.push({ id: "pob1", label: p1, tipo: "poblado", grupo: "propio_l1" });
      if (p2) nodos.push({ id: "pob2", label: p2, tipo: "poblado", grupo: "propio_l2" });
      if (p1) enlaces.push({ origen: "l1", destino: "pob1", rel: "AMENAZA_A" });
      if (p2) enlaces.push({ origen: "l2", destino: "pob2", rel: "AMENAZA_A" });
    }

    return {
      laguna1: {
        id: item1.id,
        nombre: item1.nombre,
        departamento: item1.departamento,
        cordillera: item1.cordillera,
        riesgo: item1.riesgo,
        pueblos_abajo_total: item1.pueblos_aguas_abajo_num,
        pueblos_lista: [item1.poblado_amenazado],
        obras: item1.obras_detalle,
        eventos_historicos: item1.eventos_historicos_num,
        volumen_hm3: item1.volumen_hm3,
        altitud_msnm: item1.altitud_msnm,
        primer_estudio_ano: item1.primer_estudio_ano,
        total_estudios: item1.total_estudios,
        glaciar_origen: item1.glaciar_origen
      },
      laguna2: {
        id: item2.id,
        nombre: item2.nombre,
        departamento: item2.departamento,
        cordillera: item2.cordillera,
        riesgo: item2.riesgo,
        pueblos_abajo_total: item2.pueblos_aguas_abajo_num,
        pueblos_lista: [item2.poblado_amenazado],
        obras: item2.obras_detalle,
        eventos_historicos: item2.eventos_historicos_num,
        volumen_hm3: item2.volumen_hm3,
        altitud_msnm: item2.altitud_msnm,
        primer_estudio_ano: item2.primer_estudio_ano,
        total_estudios: item2.total_estudios,
        glaciar_origen: item2.glaciar_origen
      },
      elementos_compartidos: nodos.filter(n => n.grupo === 'compartido').length,
      serie_temporal: [
        { ano: 1970, [item1.nombre]: 5, [item2.nombre]: 8 },
        { ano: 1990, [item1.nombre]: 25, [item2.nombre]: 18 },
        { ano: 2010, [item1.nombre]: 45, [item2.nombre]: 26 },
        { ano: 2026, [item1.nombre]: item1.total_estudios, [item2.nombre]: item2.total_estudios }
      ],
      red_relaciones: {
        nodos,
        enlaces
      }
    };
  }
};
