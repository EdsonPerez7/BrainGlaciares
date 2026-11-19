/**
 * Informe corporativo ARQEN en PDF.
 * - Se genera en el navegador: sin servidor y sin tokens (funciona aunque la IA esté caída).
 * - Gráficos dibujados en vector: nítidos al imprimir.
 * - Tipografías de marca embebidas (licencia OFL): Aldrich, Space Grotesk, IBM Plex.
 * - Este módulo se carga solo al pedir un informe (import dinámico).
 */
import { jsPDF } from 'jspdf';
import { LAGUNAS_DESTACADAS, DEPARTAMENTOS_RIESGO, METRICAS_PAIS, type LagunaCatalogo } from '../config/metrics.data';
import { piscinasOlimpicas, formatoMiles } from '../config/recorrido.data';
import { SITE_CONFIG } from '../config/site.config';

// ---------- Paleta ----------
type RGB = [number, number, number];
const C: Record<string, RGB> = {
  noche: [11, 24, 56], noche2: [19, 37, 79], laguna: [13, 148, 136], lagunaClaro: [204, 245, 236],
  hielo: [14, 165, 233], hieloClaro: [224, 242, 254], cochinilla: [190, 24, 93], cochinillaClaro: [252, 231, 243],
  ocre: [217, 119, 6], ocreClaro: [254, 243, 199], texto: [15, 23, 42], suave: [71, 85, 105], tenue: [148, 163, 184],
  linea: [226, 232, 240], fondo: [247, 249, 252], blanco: [255, 255, 255],
  rMuyAlto: [225, 29, 72], rAlto: [249, 115, 22], rMedio: [234, 179, 8], rBajo: [22, 163, 74], rSin: [148, 163, 184],
};
const colorRiesgo = (r: string): RGB => (r === 'Muy alto' ? C.rMuyAlto : r === 'Alto' ? C.rAlto : r === 'Medio' ? C.rMedio : r === 'Bajo' ? C.rBajo : C.rSin);
const ORDEN: Record<string, number> = { 'Muy alto': 4, Alto: 3, Medio: 2, Bajo: 1, 'Sin evaluar': 0 };
const nombreL = (l: LagunaCatalogo) => (l.nombre.startsWith('Laguna') ? l.nombre : `Laguna ${l.nombre}`);

const W = 210, H = 297, M = 18; // A4 en mm, margen

// ---------- Fuentes ----------
let fuentesCargadas: Record<string, string> | null = null;
async function cargarFuentes(): Promise<Record<string, string>> {
  if (fuentesCargadas) return fuentesCargadas;
  const archivos = ['Aldrich-Regular', 'SpaceGrotesk-Bold', 'IBMPlexSans-Regular', 'IBMPlexSans-SemiBold', 'IBMPlexMono-Regular'];
  const res: Record<string, string> = {};
  await Promise.all(archivos.map(async (a) => {
    const buf = await (await fetch(`/fuentes-pdf/${a}.ttf`)).arrayBuffer();
    let bin = '';
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    res[a] = btoa(bin);
  }));
  fuentesCargadas = res;
  return res;
}
async function nuevoDoc() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const f = await cargarFuentes();
  const reg = (archivo: string, familia: string, estilo: string) => {
    doc.addFileToVFS(`${archivo}.ttf`, f[archivo]);
    doc.addFont(`${archivo}.ttf`, familia, estilo);
  };
  reg('Aldrich-Regular', 'Aldrich', 'normal');
  reg('SpaceGrotesk-Bold', 'Grotesk', 'bold');
  reg('IBMPlexSans-Regular', 'Plex', 'normal');
  reg('IBMPlexSans-SemiBold', 'Plex', 'bold');
  reg('IBMPlexMono-Regular', 'PlexMono', 'normal');
  doc.setFont('Plex', 'normal');
  return doc;
}

// ---------- Utilidades de dibujo ----------
const fill = (d: jsPDF, c: RGB) => d.setFillColor(c[0], c[1], c[2]);
const stroke = (d: jsPDF, c: RGB) => d.setDrawColor(c[0], c[1], c[2]);
const color = (d: jsPDF, c: RGB) => d.setTextColor(c[0], c[1], c[2]);
function texto(d: jsPDF, t: string, x: number, y: number, o: { f?: string; e?: string; s?: number; c?: RGB; w?: number; a?: 'left' | 'center' | 'right'; lh?: number } = {}) {
  d.setFont(o.f || 'Plex', o.e || 'normal');
  d.setFontSize(o.s || 10);
  color(d, o.c || C.texto);
  const lineas = o.w ? d.splitTextToSize(t, o.w) : [t];
  d.text(lineas, x, y, { align: o.a || 'left', lineHeightFactor: o.lh || 1.4 });
  return y + lineas.length * (o.s || 10) * 0.3528 * (o.lh || 1.4);
}

function logo(d: jsPDF, x: number, y: number, s = 10) {
  fill(d, C.noche); d.roundedRect(x, y, s, s, s * 0.22, s * 0.22, 'F');
  const k = s / 32;
  fill(d, [56, 189, 248]);
  d.triangle(x + 5 * k, y + 25 * k, x + 13.5 * k, y + 9 * k, x + 22 * k, y + 25 * k, 'F');
  d.triangle(x + 15 * k, y + 25 * k, x + 20.5 * k, y + 13 * k, x + 27 * k, y + 25 * k, 'F');
  fill(d, C.blanco); d.triangle(x + 13.5 * k, y + 9 * k, x + 16.2 * k, y + 14.1 * k, x + 10.6 * k, y + 14.4 * k, 'F');
}

/** Franja tejida: guarda andina en vector (triángulos alternos + puntos) */
function franja(d: jsPDF, x: number, y: number, ancho: number, alto = 4) {
  fill(d, C.noche); d.rect(x, y, ancho, alto, 'F');
  fill(d, C.ocre); d.rect(x, y, ancho, alto * 0.17, 'F');
  const paso = alto * 2;
  for (let i = 0, px = x; px < x + ancho; i++, px += paso) {
    fill(d, i % 2 ? C.laguna : C.cochinilla);
    d.triangle(px, y + alto, px + paso / 2, y + alto * 0.33, Math.min(px + paso, x + ancho), y + alto, 'F');
  }
}

function cabecera(d: jsPDF, titulo: string, codigo: string) {
  logo(d, M, 12, 8);
  texto(d, 'ARQEN', M + 11, 17.6, { f: 'Aldrich', s: 12, c: C.noche });
  texto(d, titulo, M + 31, 17.6, { s: 8.5, c: C.suave });
  texto(d, codigo, W - M, 17.6, { f: 'PlexMono', s: 7.5, c: C.tenue, a: 'right' });
  stroke(d, C.linea); d.setLineWidth(0.3); d.line(M, 23, W - M, 23);
}
function pie(d: jsPDF, n: number, total: number) {
  franja(d, 0, H - 12, W, 3);
  texto(d, `${SITE_CONFIG.domain} · cada dato con su fuente`, M, H - 4.5, { s: 7.5, c: C.suave });
  texto(d, 'Emergencias: 115 (INDECI)', W / 2, H - 4.5, { s: 7.5, c: C.cochinilla, a: 'center', e: 'bold' });
  texto(d, `${n} / ${total}`, W - M, H - 4.5, { f: 'PlexMono', s: 7.5, c: C.suave, a: 'right' });
}
function tituloSeccion(d: jsPDF, t: string, y: number, acento: RGB = C.cochinilla) {
  fill(d, acento); d.rect(M, y - 4, 1.4, 5.4, 'F');
  return texto(d, t, M + 4, y, { f: 'Grotesk', e: 'bold', s: 13, c: C.noche }) + 1.5;
}

function portada(d: jsPDF, tipo: string, titulo: string, subtitulo: string, codigo: string, fecha: string) {
  fill(d, C.noche); d.rect(0, 0, W, H, 'F');
  // cielo: degradado por bandas + estrellas
  for (let i = 0; i < 40; i++) {
    const t = i / 40;
    d.setFillColor(11 + t * 24, 24 + t * 40, 56 + t * 60);
    d.rect(0, i * 4.2, W, 4.3, 'F');
  }
  let semilla = 7;
  const azar = () => ((semilla = (semilla * 9301 + 49297) % 233280) / 233280);
  fill(d, C.blanco);
  for (let i = 0; i < 140; i++) d.circle(azar() * W, azar() * 140, azar() * 0.35 + 0.08, 'F');
  // cordillera en capas
  d.setFillColor(58, 86, 128); d.triangle(-10, 205, 60, 120, 130, 205, 'F'); d.triangle(90, 205, 160, 135, 230, 205, 'F');
  d.setFillColor(160, 186, 220); d.triangle(55, 205, 105, 98, 160, 205, 'F');
  d.setFillColor(232, 242, 255); d.triangle(105, 98, 114, 118, 96, 117, 'F');
  d.setFillColor(98, 128, 168); d.triangle(105, 98, 160, 205, 118, 205, 'F');
  fill(d, C.noche); d.rect(0, 205, W, H - 205, 'F');
  d.setFillColor(20, 90, 120); d.rect(0, 205, W, 10, 'F');
  franja(d, 0, 215, W, 5);
  // marca y título
  logo(d, M, 22, 14);
  texto(d, 'ARQEN', M + 18, 32, { f: 'Aldrich', s: 22, c: C.blanco });
  texto(d, SITE_CONFIG.tagline, M + 18, 38, { s: 9, c: [186, 230, 253] });
  texto(d, tipo.toUpperCase(), M, 238, { e: 'bold', s: 9, c: [251, 191, 36] });
  let y = texto(d, titulo, M, 250, { f: 'Grotesk', e: 'bold', s: 30, c: C.blanco, w: W - 2 * M, lh: 1.1 });
  texto(d, subtitulo, M, y + 2, { s: 11, c: [203, 213, 225], w: W - 2 * M });
  texto(d, `Emitido: ${fecha}`, M, H - 14, { f: 'PlexMono', s: 8, c: [148, 163, 184] });
  texto(d, `Código: ${codigo}`, W - M, H - 14, { f: 'PlexMono', s: 8, c: [148, 163, 184], a: 'right' });
}

function tarjetaKpi(d: jsPDF, x: number, y: number, w: number, h: number, etiqueta: string, valor: string, nota: string, fondo: RGB, acento: RGB) {
  fill(d, fondo); d.roundedRect(x, y, w, h, 3, 3, 'F');
  fill(d, acento); d.roundedRect(x, y, w, 1.6, 0.8, 0.8, 'F');
  texto(d, etiqueta, x + 4, y + 7.5, { s: 8, c: C.suave });
  texto(d, valor, x + 4, y + 16, { f: 'Grotesk', e: 'bold', s: 15, c: C.noche, w: w - 8, lh: 1.05 });
  d.setFont('Plex', 'normal'); d.setFontSize(7.2);
  const lineasNota = (d.splitTextToSize(nota, w - 8) as string[]).slice(0, 2);
  texto(d, lineasNota.join(' '), x + 4, y + h - (lineasNota.length > 1 ? 6.5 : 3.5), { s: 7.2, c: C.suave, w: w - 8 });
}

function barrasHorizontales(d: jsPDF, x: number, y: number, w: number, filas: { etiqueta: string; valor: number; color: RGB; resaltar?: boolean }[], unidad: string) {
  const max = Math.max(...filas.map((f) => f.valor), 1);
  const anchoEtq = 34, anchoBar = w - anchoEtq - 24, alto = 6, sep = 3.2;
  filas.forEach((f, i) => {
    const yy = y + i * (alto + sep);
    texto(d, f.etiqueta, x, yy + 4.4, { s: 8.5, c: f.resaltar ? C.noche : C.suave, e: f.resaltar ? 'bold' : 'normal' });
    fill(d, C.fondo); d.roundedRect(x + anchoEtq, yy, anchoBar, alto, 1.5, 1.5, 'F');
    fill(d, f.color); d.roundedRect(x + anchoEtq, yy, Math.max(2, (f.valor / max) * anchoBar), alto, 1.5, 1.5, 'F');
    texto(d, `${f.valor} ${unidad}`, x + anchoEtq + (f.valor / max) * anchoBar + 2, yy + 4.4, { f: 'PlexMono', s: 7.5, c: C.texto });
  });
  return y + filas.length * (alto + sep);
}

function lineaTiempo(d: jsPDF, x: number, y: number, w: number, hitos: { ano: number; texto: string; color: RGB }[]) {
  const hs = [...hitos].sort((a, b) => a.ano - b.ano);
  const min = Math.min(...hs.map((h) => h.ano)) - 3, max = Math.max(...hs.map((h) => h.ano), new Date().getFullYear()) + 2;
  stroke(d, C.linea); d.setLineWidth(1.2); d.line(x, y, x + w, y);
  hs.forEach((h, i) => {
    const px = x + ((h.ano - min) / (max - min)) * w;
    fill(d, h.color); d.circle(px, y, 2.2, 'F');
    fill(d, C.blanco); d.circle(px, y, 0.9, 'F');
    const arriba = i % 2 === 0;
    texto(d, String(h.ano), px, arriba ? y - 6 : y + 8.5, { f: 'PlexMono', s: 8.5, c: C.noche, a: 'center' });
    texto(d, h.texto, px, arriba ? y - 11 : y + 13, { s: 7.3, c: C.suave, a: 'center', w: 44 });
  });
}

function bloqueAluvion(d: jsPDF, y: number) {
  y = tituloSeccion(d, 'Qué hacer ante un aluvión', y, C.cochinilla);
  fill(d, C.cochinillaClaro); d.roundedRect(M, y, W - 2 * M, 40, 3, 3, 'F');
  const pasos = [
    ['1', 'Conoce hoy tu ruta de evacuación hacia zonas altas, lejos del cauce.'],
    ['2', 'Si oyes un ruido fuerte que baja por la quebrada o suena la alerta, sube de inmediato.'],
    ['3', 'No cruces ríos ni quebradas y aléjate de los puentes.'],
    ['4', 'Sigue solo los avisos de INDECI y el COEN. Emergencias: 115.'],
  ];
  pasos.forEach(([n, t], i) => {
    const yy = y + 7 + i * 8.4;
    fill(d, C.cochinilla); d.circle(M + 7, yy - 1.2, 2.8, 'F');
    texto(d, n, M + 7, yy, { e: 'bold', s: 8, c: C.blanco, a: 'center' });
    texto(d, t, M + 13, yy, { s: 9, c: C.texto, w: W - 2 * M - 18 });
  });
  return y + 46;
}

function fuentes(d: jsPDF, y: number, lista: string[]) {
  y = tituloSeccion(d, 'Fuentes citadas', y, C.laguna);
  lista.forEach((f, i) => { y = texto(d, `[${i + 1}] ${f}`, M, y + 1, { f: 'PlexMono', s: 7.8, c: C.suave, w: W - 2 * M }); });
  return y + 3;
}

function notaMetodologica(d: jsPDF, y: number) {
  fill(d, C.fondo); d.roundedRect(M, y, W - 2 * M, 22, 3, 3, 'F');
  texto(d, 'Cómo se elaboró este informe', M + 4, y + 6.5, { e: 'bold', s: 8.5, c: C.noche });
  texto(d, `Datos del catálogo oficial integrado en ARQEN a partir de ${SITE_CONFIG.corpus.documentos_totales} informes técnicos del INAIGEM, la ANA y el SENAMHI. Generado automáticamente, sin IA. Es material de consulta: no reemplaza las alertas oficiales.`, M + 4, y + 11.5, { s: 7.8, c: C.suave, w: W - 2 * M - 8 });
}

const hoy = () => new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'America/Lima' }).format(new Date());
const codigoDe = (pref: string, id: string) => `ARQ-${pref}-${id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
function guardar(d: jsPDF, nombre: string) {
  const total = d.getNumberOfPages();
  for (let i = 2; i <= total; i++) { d.setPage(i); pie(d, i, total); }
  d.setProperties({ title: nombre, author: 'ARQEN', subject: 'Informe de riesgo glaciar', creator: 'ARQEN' });
  d.save(`${nombre.replace(/[^A-Za-z0-9áéíóúñÁÉÍÓÚÑ -]/g, '').replace(/\s+/g, '_')}.pdf`);
}

function resumenLaguna(l: LagunaCatalogo): string {
  const obras = l.tiene_obras
    ? `Cuenta con obras de seguridad (${l.obras_detalle.toLowerCase()}).`
    : 'No registra obras de seguridad, por lo que es prioritaria para el monitoreo.';
  return `${nombreL(l)} es una laguna de riesgo ${l.riesgo.toLowerCase()} ubicada a ${formatoMiles(l.altitud_msnm)} m de altitud en la Cordillera ${l.cordillera} (${l.departamento}). ` +
    `Almacena ${l.volumen_hm3} hm³ de agua, el equivalente a unas ${formatoMiles(piscinasOlimpicas(l.volumen_hm3))} piscinas olímpicas, y aguas abajo se encuentra ${l.poblado_amenazado}. ${obras} ` +
    `Ha sido estudiada desde ${l.primer_estudio_ano} en ${l.total_estudios} estudios oficiales.` + (l.alerta_especifica ? ` Alerta: ${l.alerta_especifica}` : '');
}

// =====================================================================
// Informe de una laguna
// =====================================================================
export async function generarInformeLaguna(id: string) {
  const l = LAGUNAS_DESTACADAS.find((x) => x.id.toLowerCase() === id.toLowerCase());
  if (!l) return;
  const d = await nuevoDoc();
  const codigo = codigoDe('LAG', l.id);
  portada(d, 'Informe de riesgo glaciar', nombreL(l), `${l.departamento} · Cordillera ${l.cordillera} · ${formatoMiles(l.altitud_msnm)} m s.n.m.`, codigo, hoy());

  // ---- Página 2: resumen e indicadores ----
  d.addPage(); cabecera(d, 'Informe de riesgo glaciar', codigo);
  let y = tituloSeccion(d, 'Resumen ejecutivo', 36);
  d.setFont('Plex', 'normal'); d.setFontSize(9.6);
  fill(d, C.hieloClaro); const altoRes = 9 + d.splitTextToSize(resumenLaguna(l), W - 2 * M - 10).length * 4.75;
  d.roundedRect(M, y, W - 2 * M, altoRes, 3, 3, 'F');
  texto(d, resumenLaguna(l), M + 5, y + 7, { s: 9.6, c: C.texto, w: W - 2 * M - 10, lh: 1.5 });
  y += altoRes + 10;

  y = tituloSeccion(d, 'Indicadores clave', y, C.laguna);
  const cw = (W - 2 * M - 8) / 3, ch = 29;
  const kpis: [string, string, string, RGB, RGB][] = [
    ['Nivel de riesgo', l.riesgo, 'Evaluación INAIGEM', C.cochinillaClaro, colorRiesgo(l.riesgo)],
    ['Volumen', `${l.volumen_hm3} hm³`, `≈ ${formatoMiles(piscinasOlimpicas(l.volumen_hm3))} piscinas olímpicas`, C.hieloClaro, C.hielo],
    ['Aguas abajo', l.poblado_amenazado, `${l.pueblos_aguas_abajo_num} poblado(s) registrados`, C.ocreClaro, C.ocre],
    ['Obras de seguridad', l.tiene_obras ? 'Sí' : 'No', l.tiene_obras ? l.obras_detalle : 'Sin obras registradas', C.lagunaClaro, C.laguna],
    ['Glaciar de origen', l.glaciar_origen, `Altitud ${formatoMiles(l.altitud_msnm)} m`, C.hieloClaro, C.hielo],
    ['Estudios oficiales', String(l.total_estudios), `Desde ${l.primer_estudio_ano} · ${l.total_documentos} informes en ARQEN`, C.ocreClaro, C.ocre],
  ];
  kpis.forEach((k, i) => tarjetaKpi(d, M + (i % 3) * (cw + 4), y + Math.floor(i / 3) * (ch + 4), cw, ch, ...k));
  y += 2 * (ch + 4) + 8;

  y = tituloSeccion(d, '¿Cuánta agua es?', y, C.hielo);
  const pisc = piscinasOlimpicas(l.volumen_hm3);
  fill(d, C.fondo); d.roundedRect(M, y, W - 2 * M, 26, 3, 3, 'F');
  const iconos = Math.min(60, Math.max(1, Math.round(pisc / 250)));
  for (let i = 0; i < iconos; i++) { fill(d, C.hielo); d.roundedRect(M + 5 + (i % 30) * 5.6, y + 5 + Math.floor(i / 30) * 6, 4.6, 3.6, 0.6, 0.6, 'F'); }
  texto(d, `Cada rectángulo ≈ 250 piscinas olímpicas. Total: ${formatoMiles(pisc)} piscinas (${formatoMiles(l.volumen_hm3 * 1_000_000)} m³).`, M + 5, y + 22, { s: 8, c: C.suave });

  y += 34;
  y = tituloSeccion(d, 'Línea de tiempo', y, C.ocre);
  const hitos = [{ ano: l.primer_estudio_ano, texto: 'Primer estudio oficial', color: C.laguna }];
  if (l.ano_evento_critico) hitos.push({ ano: l.ano_evento_critico, texto: 'Evento crítico registrado', color: C.cochinilla });
  const anoAct = parseInt(l.fecha_actualizacion, 10);
  if (anoAct) hitos.push({ ano: anoAct, texto: 'Última actualización del dato', color: C.hielo });
  lineaTiempo(d, M + 10, y + 24, W - 2 * M - 16, hitos);


  // ---- Página 3: gráficos, preparación y fuentes ----
  d.addPage(); cabecera(d, 'Informe de riesgo glaciar', codigo);
  y = tituloSeccion(d, 'Volumen frente a otras lagunas críticas', 36, C.hielo);
  const comparables = [...LAGUNAS_DESTACADAS].filter((x) => ORDEN[x.riesgo] >= 3 || x.id === l.id).sort((a, b) => b.volumen_hm3 - a.volumen_hm3);
  let filas = comparables.slice(0, 8);
  if (!filas.includes(l)) filas = [...filas.slice(0, 7), l];
  y = barrasHorizontales(d, M, y + 2, W - 2 * M, filas.map((x) => ({ etiqueta: x.nombre, valor: x.volumen_hm3, color: x.id === l.id ? C.laguna : colorRiesgo(x.riesgo), resaltar: x.id === l.id })), 'hm³');
  texto(d, 'Color: nivel de riesgo · en verde agua, la laguna de este informe.', M, y + 3, { s: 7.5, c: C.tenue });
  y += 14;

  y = tituloSeccion(d, `Riesgo en ${l.departamento}`, y, C.cochinilla);
  const enDepto = LAGUNAS_DESTACADAS.filter((x) => x.departamento === l.departamento);
  const grupos = ['Muy alto', 'Alto', 'Medio', 'Bajo', 'Sin evaluar'].map((r) => ({ r, n: enDepto.filter((x) => x.riesgo === r).length })).filter((g) => g.n);
  let px = M; const anchoTotal = W - 2 * M;
  grupos.forEach((g) => { const w = (g.n / enDepto.length) * anchoTotal; fill(d, colorRiesgo(g.r)); d.rect(px, y + 2, w, 8, 'F'); px += w; });
  px = M;
  grupos.forEach((g) => { texto(d, `● ${g.n} ${g.r.toLowerCase()}`, px, y + 16, { s: 8, c: colorRiesgo(g.r), e: 'bold' }); px += 34; });
  texto(d, `${enDepto.length} lagunas del catálogo en ${l.departamento}.`, M, y + 22, { s: 7.5, c: C.tenue });
  y += 34;

  y = bloqueAluvion(d, y);
  y = fuentes(d, y + 2, [
    l.documento_superficie || 'Catálogo de lagunas INAIGEM / ANA',
    `${METRICAS_PAIS.lagunas_riesgo.fuente} · ${METRICAS_PAIS.lagunas_riesgo.pagina}`,
    `${METRICAS_PAIS.hielo_perdido.fuente} · ${METRICAS_PAIS.hielo_perdido.pagina}`,
    'INDECI · Recomendaciones ante huaicos y aluviones',
  ]);
  notaMetodologica(d, y + 2);

  guardar(d, `ARQEN_Informe_${l.nombre}`);
}

// =====================================================================
// Informe comparativo de dos lagunas
// =====================================================================
export async function generarInformeComparacion(a: string, b: string) {
  const buscar = (q: string) => LAGUNAS_DESTACADAS.find((x) => x.id.toLowerCase() === q.toLowerCase() || x.nombre.toLowerCase() === q.toLowerCase().replace(/^laguna\s+/, ''));
  const l1 = buscar(a), l2 = buscar(b);
  if (!l1 || !l2) return;
  const d = await nuevoDoc();
  const codigo = codigoDe('CMP', `${l1.id}${l2.id}`);
  portada(d, 'Informe comparativo', `${l1.nombre} frente a ${l2.nombre}`, 'Riesgo, volumen, obras y poblaciones expuestas', codigo, hoy());

  d.addPage(); cabecera(d, 'Informe comparativo', codigo);
  let y = tituloSeccion(d, 'Resumen', 36);
  const masRiesgo = ORDEN[l1.riesgo] === ORDEN[l2.riesgo] ? null : ORDEN[l1.riesgo] > ORDEN[l2.riesgo] ? l1 : l2;
  const mayor = l1.volumen_hm3 >= l2.volumen_hm3 ? l1 : l2, menor = mayor === l1 ? l2 : l1;
  const resumen = `${masRiesgo ? `${nombreL(masRiesgo)} tiene el nivel de riesgo más alto (${masRiesgo.riesgo.toLowerCase()}).` : `Ambas lagunas tienen riesgo ${l1.riesgo.toLowerCase()}.`} ` +
    `${nombreL(mayor)} almacena ${(mayor.volumen_hm3 / Math.max(menor.volumen_hm3, 0.1)).toFixed(1)} veces más agua (${mayor.volumen_hm3} frente a ${menor.volumen_hm3} hm³). ` +
    `Aguas abajo: ${l1.poblado_amenazado} y ${l2.poblado_amenazado}, respectivamente.`;
  fill(d, C.hieloClaro); d.roundedRect(M, y, W - 2 * M, 26, 3, 3, 'F');
  texto(d, resumen, M + 5, y + 7, { s: 9.6, w: W - 2 * M - 10, lh: 1.5 });
  y += 34;

  y = tituloSeccion(d, 'Cara a cara', y, C.laguna);
  const filasTabla: [string, string, string][] = [
    ['Riesgo', l1.riesgo, l2.riesgo], ['Volumen', `${l1.volumen_hm3} hm³`, `${l2.volumen_hm3} hm³`],
    ['Altitud', `${formatoMiles(l1.altitud_msnm)} m`, `${formatoMiles(l2.altitud_msnm)} m`], ['Aguas abajo', l1.poblado_amenazado, l2.poblado_amenazado],
    ['Obras de seguridad', l1.tiene_obras ? 'Sí' : 'No', l2.tiene_obras ? 'Sí' : 'No'], ['Glaciar de origen', l1.glaciar_origen, l2.glaciar_origen],
    ['Estudios', `${l1.total_estudios} (desde ${l1.primer_estudio_ano})`, `${l2.total_estudios} (desde ${l2.primer_estudio_ano})`],
  ];
  const c1 = M, c2 = M + 52, c3 = M + 52 + (W - 2 * M - 52) / 2;
  fill(d, C.noche); d.roundedRect(M, y, W - 2 * M, 9, 2, 2, 'F');
  texto(d, l1.nombre, c2 + 2, y + 6, { e: 'bold', s: 9, c: C.blanco }); texto(d, l2.nombre, c3 + 2, y + 6, { e: 'bold', s: 9, c: C.blanco });
  y += 9;
  filasTabla.forEach(([k, v1, v2], i) => {
    if (i % 2 === 0) { fill(d, C.fondo); d.rect(M, y, W - 2 * M, 9, 'F'); }
    texto(d, k, c1 + 3, y + 6, { s: 8.5, c: C.suave });
    texto(d, v1, c2 + 2, y + 6, { s: 8.8, w: c3 - c2 - 4 }); texto(d, v2, c3 + 2, y + 6, { s: 8.8, w: W - M - c3 - 4 });
    y += 9;
  });
  y += 10;
  y = tituloSeccion(d, 'Volumen', y, C.hielo);
  barrasHorizontales(d, M, y + 2, W - 2 * M, [l1, l2].map((x) => ({ etiqueta: x.nombre, valor: x.volumen_hm3, color: colorRiesgo(x.riesgo), resaltar: true })), 'hm³');

  d.addPage(); cabecera(d, 'Informe comparativo', codigo);
  y = bloqueAluvion(d, 36);
  y = fuentes(d, y + 4, [l1.documento_superficie || 'Catálogo INAIGEM / ANA', l2.documento_superficie || 'Catálogo INAIGEM / ANA', METRICAS_PAIS.lagunas_riesgo.fuente]);
  notaMetodologica(d, y + 4);
  guardar(d, `ARQEN_Comparacion_${l1.nombre}_${l2.nombre}`);
}

// =====================================================================
// Informe de un departamento
// =====================================================================
export async function generarInformeDepartamento(nombre: string) {
  const dep = DEPARTAMENTOS_RIESGO.find((x) => x.departamento.toLowerCase() === nombre.toLowerCase());
  if (!dep) return;
  const lagunas = LAGUNAS_DESTACADAS.filter((x) => x.departamento === dep.departamento).sort((a, b) => ORDEN[b.riesgo] - ORDEN[a.riesgo] || b.volumen_hm3 - a.volumen_hm3);
  const d = await nuevoDoc();
  const codigo = codigoDe('DEP', dep.departamento);
  portada(d, 'Informe departamental', dep.departamento, `${dep.total} lagunas críticas · ${dep.muy_alto} de riesgo muy alto`, codigo, hoy());

  d.addPage(); cabecera(d, 'Informe departamental', codigo);
  let y = tituloSeccion(d, 'Indicadores', 36);
  const cw = (W - 2 * M - 8) / 3;
  const sinObras = lagunas.filter((x) => !x.tiene_obras).length;
  const vol = lagunas.reduce((s, x) => s + x.volumen_hm3, 0);
  tarjetaKpi(d, M, y, cw, 26, 'Lagunas críticas', String(dep.total), `${dep.muy_alto} muy alto · ${dep.alto} alto`, C.cochinillaClaro, C.cochinilla);
  tarjetaKpi(d, M + cw + 4, y, cw, 26, 'Agua almacenada', `${vol.toFixed(1)} hm³`, `≈ ${formatoMiles(piscinasOlimpicas(vol))} piscinas olímpicas`, C.hieloClaro, C.hielo);
  tarjetaKpi(d, M + 2 * (cw + 4), y, cw, 26, 'Sin obras de seguridad', String(sinObras), 'Lagunas del catálogo', C.ocreClaro, C.ocre);
  y += 36;
  if (lagunas.length) {
    y = tituloSeccion(d, 'Volumen por laguna', y, C.hielo);
    y = barrasHorizontales(d, M, y + 2, W - 2 * M, lagunas.slice(0, 10).map((x) => ({ etiqueta: x.nombre, valor: x.volumen_hm3, color: colorRiesgo(x.riesgo) })), 'hm³');
    y += 10;
    y = tituloSeccion(d, 'Detalle', y, C.laguna);
    fill(d, C.noche); d.roundedRect(M, y, W - 2 * M, 8, 2, 2, 'F');
    const cols = [M + 3, M + 46, M + 76, M + 106, M + 150];
    ['Laguna', 'Riesgo', 'Volumen', 'Aguas abajo', 'Obras'].forEach((t, i) => texto(d, t, cols[i], y + 5.4, { e: 'bold', s: 8, c: C.blanco }));
    y += 8;
    lagunas.slice(0, 14).forEach((x, i) => {
      if (i % 2 === 0) { fill(d, C.fondo); d.rect(M, y, W - 2 * M, 7.5, 'F'); }
      texto(d, x.nombre, cols[0], y + 5, { s: 8 }); texto(d, x.riesgo, cols[1], y + 5, { s: 8, c: colorRiesgo(x.riesgo), e: 'bold' });
      texto(d, `${x.volumen_hm3} hm³`, cols[2], y + 5, { f: 'PlexMono', s: 7.8 }); texto(d, x.poblado_amenazado, cols[3], y + 5, { s: 8, w: 42 });
      texto(d, x.tiene_obras ? 'Sí' : 'No', cols[4], y + 5, { s: 8 });
      y += 7.5;
    });
  }
  d.addPage(); cabecera(d, 'Informe departamental', codigo);
  y = bloqueAluvion(d, 36);
  y = fuentes(d, y + 4, [METRICAS_PAIS.lagunas_riesgo.fuente, 'Catálogo de lagunas INAIGEM / ANA']);
  notaMetodologica(d, y + 4);
  guardar(d, `ARQEN_Informe_${dep.departamento}`);
}
