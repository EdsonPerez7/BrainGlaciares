#!/usr/bin/env node
/**
 * Genera frontend/public/data/corpus_indicadores.json y grafo_indicadores.json
 * a partir de los archivos reales del repo (no se inventa ningún número).
 *
 * Fuentes leídas:
 *   - Semana 6/G8-enterprise-brain-glaciares/data/persona1/papers.csv
 *   - Semana 7/grafo_glaciares/nodos.csv
 *   - Semana 7/grafo_glaciares/relaciones.csv
 *   - Semana 7/grafo_glaciares/glaciares.owl (clases y propiedades, conteo directo)
 *   - Semana 7/grafo_glaciares/revision_ontologia.md (categorías de pitfalls OOPS!)
 *
 * Reejecutar cuando esos archivos cambien:
 *   cd frontend && node scripts/generar_indicadores.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAIZ_REPO = resolve(__dirname, '..', '..');
const CARPETA_SALIDA = resolve(__dirname, '..', 'public', 'data');

const RUTA_PAPERS = resolve(RAIZ_REPO, 'Semana 6/G8-enterprise-brain-glaciares/data/persona1/papers.csv');
const RUTA_NODOS = resolve(RAIZ_REPO, 'Semana 7/grafo_glaciares/nodos.csv');
const RUTA_RELACIONES = resolve(RAIZ_REPO, 'Semana 7/grafo_glaciares/relaciones.csv');
const RUTA_OWL = resolve(RAIZ_REPO, 'Semana 7/grafo_glaciares/glaciares.owl');
const RUTA_REVISION_OWL = resolve(RAIZ_REPO, 'Semana 7/grafo_glaciares/revision_ontologia.md');

/** Parser CSV mínimo (RFC4180): comillas dobles, comas y saltos de línea dentro de campos. */
function parseCSV(texto) {
  const filas = [];
  let fila = [];
  let campo = '';
  let enComillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (enComillas) {
      if (c === '"') {
        if (texto[i + 1] === '"') { campo += '"'; i++; }
        else enComillas = false;
      } else {
        campo += c;
      }
    } else if (c === '"') {
      enComillas = true;
    } else if (c === ',') {
      fila.push(campo); campo = '';
    } else if (c === '\n') {
      fila.push(campo); filas.push(fila); fila = []; campo = '';
    } else if (c === '\r') {
      // el \n que sigue cierra la fila
    } else {
      campo += c;
    }
  }
  if (campo.length > 0 || fila.length > 0) { fila.push(campo); filas.push(fila); }
  return filas.filter((f) => !(f.length === 1 && f[0] === ''));
}

function leerRegistros(ruta) {
  const texto = readFileSync(ruta, 'utf-8');
  const filas = parseCSV(texto);
  const encabezado = filas[0];
  return filas.slice(1).map((f) => {
    const obj = {};
    encabezado.forEach((col, i) => { obj[col] = (f[i] ?? '').trim(); });
    return obj;
  });
}

function contarPor(lista, campo, normalizar = (v) => v || 'Sin dato') {
  const conteo = {};
  for (const item of lista) {
    const clave = normalizar(item[campo] ?? '');
    conteo[clave] = (conteo[clave] || 0) + 1;
  }
  return conteo;
}

/** Cuenta ocurrencias de un patrón, sumando ambos estilos RDF/XML que usan los .owl del repo:
 *  <owl:Class rdf:about="..."> (estilo directo) y <rdf:type rdf:resource=".../owl#Class"/> (estilo rdf:Description). */
function contarOwl(texto, tipo) {
  const estiloDirecto = (texto.match(new RegExp(`<owl:${tipo}[\\s/>]`, 'g')) || []).length;
  const estiloDescripcion = (texto.match(new RegExp(`owl#${tipo}"`, 'g')) || []).length;
  return estiloDirecto + estiloDescripcion;
}

/** Cuenta las filas de datos de la tabla markdown bajo el encabezado "## Antes (v1.0)"
 *  de revision_ontologia.md (una fila = una categoría de pitfall OOPS! detectada). */
function contarFilasTablaMarkdown(texto, encabezado) {
  const inicio = texto.indexOf(encabezado);
  if (inicio === -1) return 0;
  const siguienteEncabezado = texto.indexOf('\n## ', inicio + encabezado.length);
  const bloque = texto.slice(inicio, siguienteEncabezado === -1 ? undefined : siguienteEncabezado);
  const lineas = bloque.split('\n').filter((l) => l.trim().startsWith('|'));
  // La primera línea "|" es el encabezado de columnas y la segunda es el separador "---"; el resto son filas de datos.
  return Math.max(0, lineas.length - 2);
}

function fechaLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const hoy = fechaLocal();
const GENERADO_POR = 'frontend/scripts/generar_indicadores.mjs';

// ───────────────────────────── 1) corpus_indicadores.json ─────────────────────────────

const papers = leerRegistros(RUTA_PAPERS);

const normalizarIdioma = (v) => {
  const l = v.trim().toLowerCase();
  if (l.startsWith('spa') || l.startsWith('esp')) return 'Español';
  if (l.startsWith('eng') || l.startsWith('en_')) return 'Inglés';
  return v.trim() ? 'Otro' : 'Sin dato';
};

const anios = papers.map((p) => parseInt(p.year, 10)).filter((n) => Number.isFinite(n));
const porDecada = {};
for (const a of anios) {
  const d = `${Math.floor(a / 10) * 10}s`;
  porDecada[d] = (porDecada[d] || 0) + 1;
}

const corpusIndicadores = {
  fecha_corte: hoy,
  generado_por: GENERADO_POR,
  archivos_origen: ['Semana 6/G8-enterprise-brain-glaciares/data/persona1/papers.csv'],
  calculado: {
    total_documentos: papers.length,
    por_institucion: contarPor(papers, 'fuente'),
    por_eje_principal: contarPor(papers, 'eje_principal'),
    por_idioma: contarPor(papers, 'language', normalizarIdioma),
    rango_anios: anios.length ? { desde: Math.min(...anios), hasta: Math.max(...anios) } : null,
    por_decada: porDecada
  },
  citado_de_docs: {
    nota: 'Lo siguiente no es calculable desde papers.csv (no tiene esa columna); se cita tal como aparece en la documentación del proyecto.',
    porcentaje_ocr: {
      aproximado: '≈180 de 398 documentos necesitaron OCR (Tesseract)',
      motivo: 'papers.csv no registra si un documento necesitó OCR; ese dato vive en el campo fuente_texto, fuera del alcance de este script.',
      fuente: 'Semana 6/G8-enterprise-brain-glaciares/data/persona2/chunks.jsonl.gz (campo fuente_texto)'
    }
  }
};

writeFileSync(resolve(CARPETA_SALIDA, 'corpus_indicadores.json'), JSON.stringify(corpusIndicadores, null, 2) + '\n', 'utf-8');

// ───────────────────────────── 2) grafo_indicadores.json ─────────────────────────────

const nodos = leerRegistros(RUTA_NODOS);
const relaciones = leerRegistros(RUTA_RELACIONES);

const lagunas = nodos.filter((n) => n.tipo === 'Laguna');
const lagunasPorNivel = {};
for (const l of lagunas) {
  const nivel = l.nivel_max && l.nivel_max.trim() ? l.nivel_max.trim() : 'Sin clasificar';
  lagunasPorNivel[nivel] = (lagunasPorNivel[nivel] || 0) + 1;
}

const textoOwl = readFileSync(RUTA_OWL, 'utf-8');
const owlClases = contarOwl(textoOwl, 'Class');
const owlPropiedadesObjeto = contarOwl(textoOwl, 'ObjectProperty');
const owlPropiedadesDato = contarOwl(textoOwl, 'DatatypeProperty');

const textoRevisionOwl = readFileSync(RUTA_REVISION_OWL, 'utf-8');
const owlPitfallsV10 = contarFilasTablaMarkdown(textoRevisionOwl, '## Antes (v1.0)');
const owlPitfallsV11 = contarFilasTablaMarkdown(textoRevisionOwl, '## Después (v1.1)');

const grafoIndicadores = {
  fecha_corte: hoy,
  generado_por: GENERADO_POR,
  archivos_origen: [
    'Semana 7/grafo_glaciares/nodos.csv',
    'Semana 7/grafo_glaciares/relaciones.csv',
    'Semana 7/grafo_glaciares/glaciares.owl',
    'Semana 7/grafo_glaciares/revision_ontologia.md'
  ],
  calculado: {
    nodos_total: nodos.length,
    nodos_por_tipo: contarPor(nodos, 'tipo'),
    relaciones_total: relaciones.length,
    relaciones_por_tipo: contarPor(relaciones, 'tipo'),
    lagunas_catalogo_por_nivel_riesgo: lagunasPorNivel,
    owl_clases: owlClases,
    owl_propiedades_objeto: owlPropiedadesObjeto,
    owl_propiedades_dato: owlPropiedadesDato,
    owl_propiedades_total: owlPropiedadesObjeto + owlPropiedadesDato,
    owl_categorias_pitfalls_v1_0: owlPitfallsV10,
    owl_categorias_pitfalls_v1_1: owlPitfallsV11
  },
  nota_discrepancia_relaciones: {
    nota: 'Tres fuentes distintas dan un número distinto de relaciones del grafo. Este script calcula la primera; las otras dos se citan porque no hay un CSV de Aura en el repo.',
    este_csv_semana_7: relaciones.length,
    readme_presentacion: { valor: 37264, fuente: 'README.md (raíz del repositorio)' },
    neo4j_aura_produccion: { valor: 35374, fuente: 'consola de Neo4j Aura (verificado por el equipo)' }
  },
  citado_de_docs: {
    nota: 'Cifras del reporte de PLN (persona 3). El CSV tripletas_consolidadas.csv se actualizó después del reporte, por eso un recálculo hoy da valores cercanos pero no idénticos.',
    hechos_tripletas: { valor: 13256, fuente: 'Semana 6/G8-enterprise-brain-glaciares/data/persona3/reporte_pln.md (línea 11)' },
    entidades_unicas: { valor: 11343, fuente: 'Semana 6/G8-enterprise-brain-glaciares/data/persona3/reporte_pln.md (línea 10)' },
    hechos_confirmados_2_o_mas_documentos: { valor: 2502, fuente: 'Semana 6/G8-enterprise-brain-glaciares/data/persona3/reporte_pln.md (línea 12)' }
  }
};

writeFileSync(resolve(CARPETA_SALIDA, 'grafo_indicadores.json'), JSON.stringify(grafoIndicadores, null, 2) + '\n', 'utf-8');

// ───────────────────────────── resumen en consola ─────────────────────────────

console.log('corpus_indicadores.json ->', corpusIndicadores.calculado.total_documentos, 'documentos');
console.log('  por_institucion:', corpusIndicadores.calculado.por_institucion);
console.log('  por_idioma:', corpusIndicadores.calculado.por_idioma);
console.log('grafo_indicadores.json ->', grafoIndicadores.calculado.nodos_total, 'nodos,', grafoIndicadores.calculado.relaciones_total, 'relaciones');
console.log('  lagunas_catalogo_por_nivel_riesgo:', grafoIndicadores.calculado.lagunas_catalogo_por_nivel_riesgo);
console.log('  OWL ->', owlClases, 'clases,', owlPropiedadesObjeto, '+', owlPropiedadesDato, 'propiedades; pitfalls v1.0:', owlPitfallsV10, 'v1.1:', owlPitfallsV11);
console.log('Escrito en', CARPETA_SALIDA);
