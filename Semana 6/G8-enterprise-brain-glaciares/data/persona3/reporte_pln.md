# Reporte de extracción de entidades y relaciones (Persona 3 · Glaciares)

Generado: 2026-10-07T22:31:08+00:00 · versión 2.2-glaciares

Fragmentos procesados: reglas 27416 · GLiNER 12011 · LLM 72 (gemini-flash-latest, groq:openai/gpt-oss-120b)

| Estado | Verificación |
|---|---|
| ✅ | Documentos con al menos una relación extraída: 359/398 |
| ✅ | Entidades distintas: 11343 |
| ✅ | Hechos distintos (sin contar menciones): 13256 |
| ✅ | Hechos confirmados por 2 o más documentos: 2502 |
| ✅ | Tripletas del LLM con evidencia verificada en el texto: 261/267 |

## Entidades por tipo

- Laguna: 2100
- Glaciar: 1606
- Rio: 1339
- Cuenca: 1110
- CentroPoblado: 959
- Institucion: 879
- Nevado: 577
- Bofedal: 536
- Especie: 528
- Quebrada: 378
- Cordillera: 355
- Distrito: 317
- Evento: 204
- Provincia: 200
- Inventario: 160
- Departamento: 26
- ObraSeguridad: 25
- MetodoMonitoreo: 20
- Fenomeno: 9
- ServicioEcosistemico: 9
- Ecosistema: 6

Más mencionadas (Laguna): Dirección (127 docs), Palcacocha (69 docs), Vertiente (46 docs), Parón (34 docs), 513 (26 docs), Llaca (25 docs), Cuchillacocha (23 docs), Llanganuco (22 docs), Tullparaju (22 docs), Forma (22 docs)

Más mencionadas (Glaciar): Instituto (129 docs), Bolivia (98 docs), Región (84 docs), Global (82 docs), Ecuador (76 docs), Sobre (69 docs), Kaser (57 docs), Considerando (55 docs), Colombia (53 docs), Punto (45 docs)

Más mencionadas (Nevado): Huascarán (46 docs), Hualcán (23 docs), Coropuna (22 docs), Ausangate (21 docs), Palcaraju (21 docs), Pucaranra (20 docs), Huaytapallana (19 docs), Salkantay (18 docs), Huascarán Sur (16 docs), Pastoruri (15 docs)

Más mencionadas (CentroPoblado): Huaraz (222 docs), Urubamba (91 docs), Lima (88 docs), Cusco (64 docs), Yungay (63 docs), Carhuaz (63 docs), Recuay (62 docs), Cátac (54 docs), Huallanca (49 docs), Caraz (46 docs)

Más mencionadas (Cordillera): Blanca (250 docs), Vilcanota (81 docs), Central (56 docs), Vilcabamba (48 docs), Huaytapallana (45 docs), Negra (44 docs), Huayhuash (43 docs), Urubamba (43 docs), Ampato (38 docs), Apolobamba (38 docs)

## Tripletas por predicado

- mencionaA: 27106
- ubicadaEn: 9946
- tieneObraSeguridad: 2020
- relacionadoCon: 1790
- presentaFenomeno: 1444
- intervieneEn: 1315
- monitoreadoCon: 1175
- tieneEcosistema: 910
- tieneAltitud: 901
- tieneArea: 726
- usaMetodo: 687
- albergaEspecie: 606
- tieneSuperficieGlaciar: 436
- registraSuperficieGlaciar: 433
- ocurrioEnAnio: 424
- anioInventario: 408
- inventarioDe: 389
- tieneVolumen: 290
- amenazaA: 262
- ocurrioEn: 257
- afectoA: 248
- alimentadaPor: 227
- proveeServicio: 221
- estadoObra: 175
- tieneProfundidadMax: 98
- registraGlaciares: 78
- tieneNivelRiesgo: 77
- drenaHacia: 45
- tienePoblacion: 45
- registraLagunas: 29
- causoVictimas: 8
- abasteceA: 5
- formadaEnAnio: 4

## Tripletas por método

- agregado: 27793
- reglas: 10725
- gliner+reglas: 7163
- tabla: 2658
- spacy: 2292
- diccionario: 1919
- llm: 200
- referencia: 29
- llm_sin_verificar: 6

## Cobertura de las 10 preguntas de competencia

| pregunta                                              | estado   | hechos                                                           |
|:------------------------------------------------------|:---------|:-----------------------------------------------------------------|
| P1 Lagunas formadas en la Cordillera Blanca           | ✅       | inventarioDe: 152, registraLagunas: 23                           |
| P2 Lagunas con riesgo muy alto en Áncash              | ✅       | tieneNivelRiesgo: 45, ubicadaEn: 5006                            |
| P3 Centros poblados aguas abajo y estudios            | ✅       | amenazaA: 156, ubicadaEn: 5006, mencionaA: 23533                 |
| P4 Eventos de desborde → glaciar → poblados           | ✅       | ocurrioEn: 139, alimentadaPor: 139, afectoA: 171                 |
| P5 Glaciares con balance de masa → lagunas en riesgo  | ✅       | monitoreadoCon: 456, alimentadaPor: 139, tieneNivelRiesgo: 45    |
| P6 Métodos de monitoreo e institución                 | ✅       | monitoreadoCon: 456, intervieneEn: 646, usaMetodo: 687           |
| P7 Subcuencas con riesgo + drenaje ácido de roca      | ✅       | presentaFenomeno: 583, tieneNivelRiesgo: 45, ubicadaEn: 5006     |
| P8 Bofedales en subcuencas con retroceso + servicios  | ✅       | tieneEcosistema: 391, presentaFenomeno: 583, proveeServicio: 109 |
| P9 Superficie glaciar 2018 vs 2023                    | ✅       | registraSuperficieGlaciar: 258, anioInventario: 160              |
| P10 Lagunas con obras de seguridad, estado y poblados | ✅       | tieneObraSeguridad: 530, estadoObra: 94, amenazaA: 156           |

## Votación

- Hechos confirmados por 2+ técnicas distintas: 1,674

## Respuestas a las 10 preguntas (v2.1)

| pregunta   | enunciado                                                                                           | estado   |   filas | como_responde     |
|:-----------|:----------------------------------------------------------------------------------------------------|:---------|--------:|:------------------|
| P1         | ¿Cuántas lagunas de origen glaciar se formaron en la Cordillera Blanca según el inventario de 2023? | ✅       |       4 | grafo (tripletas) |
| P2         | ¿Qué lagunas glaciares de Áncash tienen riesgo muy alto de desborde?                                | ✅       |       5 | grafo (tripletas) |
| P3         | ¿Qué centros poblados están aguas abajo de lagunas con riesgo alto y qué estudios los evaluaron?    | ✅       |      61 | grafo (tripletas) |
| P4         | ¿Qué lagunas tuvieron eventos de desborde, de qué glaciar provienen y qué poblados afectaron?       | ✅       |      84 | grafo (tripletas) |
| P5         | ¿Qué glaciares con retroceso medido alimentan lagunas en riesgo?                                    | ✅       |      19 | grafo (tripletas) |
| P6         | ¿Qué métodos de monitoreo se aplicaron a lagunas en riesgo y qué institución hizo cada estudio?     | ✅       |      37 | grafo (tripletas) |
| P7         | ¿En qué subcuencas coinciden lagunas en riesgo y drenaje ácido de roca?                             | ✅       |      22 | grafo (tripletas) |
| P8         | ¿Qué bofedales están en subcuencas con glaciares en retroceso y qué servicios brindan?              | ✅       |      27 | grafo (tripletas) |
| P9         | ¿Cómo cambió la superficie glaciar de una cordillera entre los inventarios de 2018 y 2023?          | ✅       |       1 | grafo (tripletas) |
| P10        | ¿Qué lagunas en riesgo tienen obras de seguridad, en qué estado y qué poblados protegen?            | ✅       |      67 | grafo (tripletas) |

## Banco de preguntas difíciles

| pregunta                                                         | estado   |   filas | como                     |
|:-----------------------------------------------------------------|:---------|--------:|:-------------------------|
| ¿Cuál es la laguna con mayor volumen de Áncash?                  | ✅       |       5 | grafo                    |
| ¿Cuáles son las 5 lagunas más altas (altitud)?                   | ✅       |       5 | grafo                    |
| ¿Qué eventos ocurrieron antes de 1980 y a quién afectaron?       | ✅       |      73 | grafo                    |
| ¿Qué eventos se registraron en la laguna Palcacocha?             | ✅       |       9 | grafo                    |
| ¿Cuántas lagunas con riesgo muy alto hay por departamento?       | ✅       |       2 | grafo                    |
| ¿Qué instituciones han trabajado en la laguna Parón?             | ✅       |       7 | grafo                    |
| ¿Cómo se relacionan Palcacocha y Huaraz?                         | ✅       |       1 | grafo                    |
| ¿Qué relación hay entre el nevado Huascarán y Yungay?            | ✅       |       1 | grafo                    |
| Compara Palcacocha y Parón                                       | ✅       |      16 | grafo                    |
| ¿Qué lagunas tienen dique y además riesgo muy alto?              | ✅       |       8 | grafo                    |
| ¿Qué lagunas en riesgo se monitorean con drones?                 | ✅       |       4 | grafo                    |
| ¿Qué lagunas en riesgo se estudiaron con DInSAR o satélite?      | ✅       |       3 | grafo                    |
| ¿Qué especies viven en los bofedales?                            | ✅       |      30 | grafo                    |
| ¿Qué cuencas presentan drenaje ácido de roca?                    | ✅       |      18 | grafo                    |
| ¿Qué glaciares alimentan la laguna Palcacocha?                   | ✅       |       5 | grafo                    |
| ¿Qué documentos del SENAMHI hablan de retroceso glaciar?         | ✅       |       5 | grafo                    |
| ¿Qué obras de seguridad están deterioradas o colapsadas?         | ✅       |      53 | grafo                    |
| ¿Qué poblados fueron afectados por más de un evento?             | ✅       |      14 | grafo                    |
| Todo lo que se sabe de la laguna Llaca                           | ✅       |      40 | grafo                    |
| ¿Qué dice el corpus sobre turismo en Pastoruri? (pregunta libre) | 🟡       |       3 | texto (red de seguridad) |