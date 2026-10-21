# Ontología y grafo de conocimiento · Glaciares (semana 7)

| Archivo | Qué es |
|---|---|
| `glaciares.owl` | Ontología OWL (abrir en Protégé): clases, jerarquía, propiedades con dominio y rango, alineada a GeoSPARQL, SOSA/SSN y PROV-O |
| `grafo_glaciares.ttl.gz` | Grafo RDF completo (ontología + datos + procedencia de cada hecho) en Turtle comprimido |
| `consultas.cypher` | Las 10 preguntas de competencia y 10 consultas extra en Cypher (Neo4j) |
| `consultas.sparql` | Consultas SPARQL: deducción, jerarquía, procedencia, negación y reglas de validación |
| `nodos.csv`, `relaciones.csv` | El grafo en CSV (importador de Neo4j Aura y respaldo) |
| `vista_*.html` | Vistas interactivas del grafo (abrir en el navegador; funcionan sin internet) |
| `respuestas_cypher/` | Resultado de cada consulta, con documento, página y evidencia |
| `reporte_grafo.md` | Conteos, evaluación de las preguntas y validación |

## Modelo (grafo de propiedades en Neo4j)
- Cada nodo tiene la etiqueta `:Entidad` y la de su tipo (`:Laguna`, `:Glaciar`, `:CentroPoblado`, `:Documento`, `:Medicion`…),
  con `id`, `nombre` y `k` (nombre sin tildes ni mayúsculas, para buscar).
- Cada relación guarda su **procedencia**: `documento`, `pagina`, `evidencia`, `confianza`, `n_docs`, `metodos`.
- Los valores numéricos (volumen, área, altitud, superficie, conteos de inventario) son nodos `:Medicion` (sosa:Observation)
  con valor, unidad, año y fuente.
- Propiedades derivadas (explicadas): `departamentos` (el que dice el texto manda; si no hay, se deduce por la jerarquía),
  `nivel_max` y `en_riesgo` (nivel de riesgo más alto citado), `hidro`/`grande`/`n_poblados` (subcuencas), `dudoso`
  (nombres que GLiNER marcó como poblado o bofedal pero son nevados, lagunas o departamentos).
