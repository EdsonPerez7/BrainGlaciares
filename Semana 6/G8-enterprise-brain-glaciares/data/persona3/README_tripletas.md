# Entidades y tripletas del corpus Glaciares (Persona 3)

Entrada: `texto_glaciares/chunks.jsonl` (Persona 2). Cada hecho guarda su procedencia:
`paper_id` (handle del repositorio), `chunk_id`, páginas y la oración de evidencia.

| Archivo | Contenido |
|---|---|
| `entidades.csv` | Una fila por entidad (laguna, glaciar, nevado, cordillera, cuenca, centro poblado, institución, método, obra…) con nº de documentos y variantes |
| `menciones.csv` | Cada mención de una entidad en un fragmento |
| `tripletas_contenido.csv` | Una fila por evidencia: sujeto, predicado, objeto, documento, páginas, oración, método (reglas, gliner+reglas, llm), confianza |
| `tripletas_consolidadas.csv` | Una fila por hecho único con nº de evidencias y de documentos (lo que se carga al grafo) |
| `tripletas_todas.csv` | Metadatos (Persona 1) + contenido, en el mismo formato |
| `tripletas_descartadas.csv` | Hechos rechazados por las reglas de sentido común, con el motivo |
| `alias_entidades.csv` | Variantes unificadas (p. ej. Palcaccocha → Palcacocha) |
| `reporte_pln.md` | Verificaciones, estadísticas y cobertura de las 10 preguntas de competencia |
| `respuestas/P1.csv … P10.csv` | Respuesta a cada pregunta de competencia, con documento, página y evidencia |
| `cache_*.jsonl` | Caché para continuar sin repetir (no se suben a GitHub si pesan mucho) |

## Tipos de entidad
`Laguna, Glaciar, Nevado, Cordillera, Cuenca, Rio, Quebrada, Departamento, Provincia, Distrito, CentroPoblado,
Evento, Institucion, MetodoMonitoreo, ObraSeguridad, Ecosistema, Bofedal, Fenomeno, Especie, ServicioEcosistemico,
Inventario` (+ `Documento` de la Persona 1). `Inventario` = una ficha por cordillera y año (p. ej. *Inventario Blanca 2023*).

## Predicados
`ubicadaEn, alimentadaPor, tieneNivelRiesgo, amenazaA, ocurrioEn, afectoA, ocurrioEnAnio, tieneObraSeguridad,
monitoreadoCon, intervieneEn, tieneVolumen, tieneArea, tieneAltitud, tieneProfundidadMax, tieneSuperficieGlaciar,
estadoObra, formadaEnAnio, causoVictimas, tienePoblacion, tieneEcosistema, presentaFenomeno, albergaEspecie,
proveeServicio, abasteceA, drenaHacia, relacionadoCon (+ verbo),
inventarioDe, anioInventario, registraGlaciares, registraLagunas, registraLagunasNuevas, registraSuperficieGlaciar,
mencionaA (Documento→entidad), usaMetodo (Documento→método)` + los de metadatos de la Persona 1.

## Métodos de extracción
- `reglas`: patrones y diccionarios del dominio sobre cada oración (todo el corpus).
- `tabla`: fichas y tablas de inventarios (área, volumen, altitud, ubicación).
- `diccionario`: nombres conocidos (vistos en ≥2 documentos) encontrados sueltos en el texto.
- `spacy`: análisis gramatical sujeto → verbo → objeto; si el verbo no está en la ontología queda `relacionadoCon` + `verb`.
- `gliner+reglas`: GLiNER multilingüe detecta nombres que las reglas no ven; la relación la decide la regla.
- `llm`: Gemini sobre una muestra; solo se aceptan predicados de la lista y se verifica que la evidencia esté en el texto
  (`llm_sin_verificar` si no se encontró).
- `curado`: hechos verificados a mano por el equipo (`curaduria/hechos_verificados.csv`), con documento y página; reemplazan a los automáticos.
- `referencia`: pocos hechos geográficos fijos (cordillera → departamento) para las consultas de varios saltos.
- `agregado`: Documento —mencionaA→ entidad.

`confianza` (0–1) sube cuando el hecho aparece en varios documentos y cuando lo encuentran varias técnicas distintas
(`n_metodos`, votación). `value_std` y `unit_std` traen los valores en unidades comunes (m³, km², m).
