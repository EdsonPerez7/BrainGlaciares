# Reporte del grafo (semana 7)

Versión 1.0-grafo

- Nodos: 13,829 · relaciones: 37,264
- Ontología: 30 clases · 22 propiedades de objeto · 9 de datos
- RDF: 183,189 triples

## 10 preguntas (Cypher)

| pregunta   | enunciado                                                                                            | estado   |   filas |   segundos |
|:-----------|:-----------------------------------------------------------------------------------------------------|:---------|--------:|-----------:|
| P1         | ¿Cuántas lagunas de origen glaciar se formaron en la Cordillera Blanca según el inventario de 2023?  | ✅       |       5 |       0.09 |
| P2         | ¿Qué lagunas glaciares de Áncash tienen riesgo muy alto de desborde?                                 | ✅       |       5 |       0.09 |
| P3         | ¿Qué centros poblados están aguas abajo de lagunas con riesgo alto y qué estudios los evaluaron?     | ✅       |      75 |       0.2  |
| P4         | ¿Qué lagunas tuvieron eventos de desborde, de qué glaciar provienen y qué poblados afectaron?        | ✅       |      83 |       0.14 |
| P5         | ¿Qué glaciares con retroceso medido (balance de masa) alimentan lagunas que hoy están en riesgo?     | ✅       |      19 |       0.15 |
| P6         | ¿Qué métodos de monitoreo se aplicaron a lagunas en riesgo y qué institución realizó cada estudio?   | ✅       |      37 |       0.2  |
| P7         | ¿En qué subcuencas coinciden lagunas en riesgo y contaminación por drenaje ácido de roca?            | ✅       |      19 |       0.15 |
| P8         | ¿Qué bofedales están en subcuencas con glaciares en retroceso y qué servicios ecosistémicos brindan? | ✅       |       5 |       0.24 |
| P9         | ¿Cómo cambió la superficie glaciar de una cordillera entre los inventarios de 2018 y 2023?           | ✅       |      19 |       0.11 |
| P10        | ¿Qué lagunas en riesgo cuentan con obras de seguridad, en qué estado están y qué poblados protegen?  | ✅       |      66 |       0.13 |

## Preguntas extra (Cypher)

| pregunta                  | enunciado                                                                                     | estado   |   filas |   segundos |
|:--------------------------|:----------------------------------------------------------------------------------------------|:---------|--------:|-----------:|
| E1_negacion_sin_obras     | Negación · ¿Qué lagunas en riesgo (alto o muy alto) NO tienen obras de seguridad registradas? | ✅       |       6 |       0.1  |
| E2_negacion_sin_monitoreo | Negación · ¿Qué lagunas en riesgo no tienen ningún método de monitoreo registrado?            | ✅       |      10 |       0.08 |
| E3_conteo_departamento    | Conteo · ¿Cuántas lagunas en riesgo hay por departamento?                                     | ✅       |       7 |       0.08 |
| E4_conteo_cordillera      | Conteo con varios saltos · ¿Qué cordillera tiene más lagunas en riesgo?                       | ✅       |      13 |       0.09 |
| E5_ranking_volumen        | Ranking · Las 5 lagunas de Áncash con mayor volumen                                           | ✅       |       5 |       0.1  |
| E6_linea_tiempo           | Línea de tiempo · Eventos registrados antes de 1980                                           | ✅       |      71 |       0.11 |
| E7_instituciones          | Conteo · Instituciones que intervienen en más lagunas                                         | ✅       |      10 |       0.09 |
| E8_ficha                  | Ficha · Todo lo que se sabe de la laguna Palcacocha (con fuente)                              | ✅       |      40 |       0.09 |
| E9_comencion              | Co-mención · Documentos que hablan a la vez de Palcacocha y Huaraz                            | ✅       |      65 |       0.1  |
| E10_camino                | Camino · ¿Cómo se conecta el nevado Huascarán con Yungay? (sin pasar por documentos)          | ✅       |       3 |       0.1  |

## Validación (SPARQL)

| regla                                                                           |   violaciones |
|:--------------------------------------------------------------------------------|--------------:|
| amenazaA hacia algo que no es unidad territorial                                |             0 |
| ubicadaEn hacia algo que no es un lugar (geo:Feature)                           |             0 |
| nivel de riesgo en algo que no es laguna                                        |             0 |
| individuos en clases disjuntas (rasgo geográfico y unidad territorial a la vez) |             0 |
| hechos sin documento de origen                                                  |             0 |