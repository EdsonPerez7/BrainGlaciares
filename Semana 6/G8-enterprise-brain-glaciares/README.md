# Enterprise Brain Glaciares — Grupo G8

**Curso:** Gestión del Conocimiento (UNMSM, FISI) · 2026-II
**Caso:** riesgo glaciar en el Perú (lagunas, glaciares, poblados expuestos)
**Fuentes:** INAIGEM, ANA y SENAMHI (repositorios institucionales)

Sistema que lee informes técnicos sobre glaciares y lagunas, extrae sus datos con procesamiento de lenguaje
natural y los organiza en un grafo de conocimiento que responde preguntas citando documento y página.

## Avance

| Semana | Hito | Estado |
|---|---|---|
| 5 | Ficha: grupo, caso, 10 preguntas de competencia y fuentes | ✅ |
| 6 | Captura con PLN: corpus procesado y tripletas extraídas | ✅ |
| 7 | Ontología (OWL) y grafo (Neo4j) con consultas Cypher | ⏳ |
| 8 | Flujo completo documento → grafo | ⏳ |

## Cómo está organizado

```
notebooks/
  1_persona1_corpus.ipynb               Persona 1: selección del corpus (398 documentos) y metadatos
  2_persona2_texto.ipynb                Persona 2: PDF → texto, secciones, tablas y fragmentos (OCR en escaneados)
  2b_persona2_reparar_escaneados.ipynb  Persona 2: reprocesa con OCR los escaneados que no se leyeron bien
  3_persona3_tripletas.ipynb            Persona 3: entidades y relaciones (tripletas) + respuestas a las 10 preguntas
  demo_hito_pln.ipynb                   Demo corta (2-3 min) para la exposición del hito de PLN
data/
  curaduria/hechos_verificados.csv      Datos verificados a mano por el equipo (INGLOG 2023), con documento y página
  persona1/  persona2/  persona3/       Salidas de cada persona (ver "Datos")
docs/
  G8_Enterprise_Brain_Glaciares.pdf     Presentación de la idea
```

Los notebooks se ejecutan **en orden** (1 → 2 → 2b → 3) en Google Colab. Cada uno lee lo que dejó el anterior en
Google Drive (`proyecto_gc/`).

## Resultados de la captura con PLN (semana 6)

| Indicador | Valor |
|---|---|
| Documentos en el corpus | 398 (INAIGEM 175 · ANA 171 · SENAMHI 52) |
| Fragmentos de texto con documento y página | 27 416 |
| Tablas extraídas | 4 195 |
| Entidades (lagunas, glaciares, poblados, instituciones…) | 11 343 |
| Hechos (tripletas) con evidencia | 13 256 + 329 verificados por el equipo |
| Hechos confirmados por 2 o más documentos | 2 502 |
| Preguntas de competencia respondidas con el grafo | **10 / 10** |
| Banco de 20 preguntas difíciles respondidas | 19 con el grafo + 1 con búsqueda en texto |

**Técnicas de extracción (combinadas):** reglas del dominio, lectura de tablas, diccionario de nombres del corpus,
GLiNER (entidades), spaCy (sujeto → verbo → objeto) y LLM sobre una muestra con evidencia verificada.
Luego: unificación de nombres, normalización de unidades, reglas de sentido común y votación entre técnicas.

**Curaduría:** algunos datos clave están en tablas complejas o gráficos que la máquina no lee bien
(INGLOG 2023, tablas 5 y 8, figura 31, anexo 1). El equipo los copió a mano en
`data/curaduria/hechos_verificados.csv` con documento y página; reemplazan a los extraídos automáticamente.

## Datos

Los archivos de datos se generan en Google Drive (`proyecto_gc/`). En el repositorio se suben los livianos:

| Carpeta del repositorio | Copiar desde Drive |
|---|---|
| `data/persona1/` | `corpus_glaciares/papers.csv`, `metadata_triples.csv` |
| `data/persona2/` | `texto_glaciares/chunks.jsonl.gz`, `tables.jsonl`, `sections.csv`, `documentos_procesados.csv`, `README_texto.md` |
| `data/persona3/` | `tripletas_glaciares_v22/`: `tripletas_consolidadas.csv`, `entidades.csv`, `alias_entidades.csv`, `tripletas_descartadas.csv`, `reporte_pln.md`, `README_tripletas.md` |
| `data/persona3/respuestas/` | `tripletas_glaciares_v22/respuestas/P1.csv … P10.csv` |

**No se suben:** los PDF (`pdfs/`), los cachés (`cache/`, `cache_*.jsonl`), `.venv/` ni archivos de más de 25 MB
(se dejan en Drive). **Nunca** se suben claves de API: se guardan en los *Secrets* de Colab.

## Uso de herramientas de IA (declaración exigida por la guía)

| Herramienta | Para qué se usó |
|---|---|
| Claude (Anthropic) | Asistencia en el diseño y la programación de los notebooks, depuración y redacción de la documentación |
| Gemini (Google) y Groq (modelo gpt-oss-120b) | Extracción de relaciones en una muestra de 72 fragmentos; cada hecho se verificó contra el texto original |
| GLiNER (urchade/gliner_multi-v2.1) | Reconocimiento de entidades (nombres de lagunas, glaciares, poblados…) |
| spaCy (es_core_news_md) | Análisis gramatical para relaciones sujeto → verbo → objeto |

Las decisiones sobre el corpus, las preguntas de competencia y la curaduría de datos fueron revisadas por el equipo.
