# Reporte GraphRAG · semana 10

- Grafo: Neo4j · texto: RAG semana 9 (bge-m3 + Chroma + BM25) · LLM: groq · openai/gpt-oss-120b → groq · openai/gpt-oss-20b → gemini · gemini-flash-lite-latest → groq · qwen/qwen3.8-27b → groq · allam-2-7b → gemini · gemini-2.5-pro → gemini · gemini-pro-latest → gemini · gemini-2.5-flash-lite → gemini · gemini-3.1-flash-lite → gemini · gemini-3.5-flash → gemini · gemini-3.5-flash-lite → local · Qwen2.5-7B-Instruct
- Herramientas: consultas verificadas P1–P10 y E1–E11, ficha (local), camino, Text2Cypher validado, solo texto
- LLM en cadena con caché y autocorrección · llamadas por modelo: {'caché': 35, 'groq · openai/gpt-oss-120b': 1}
- Preguntas de competencia respondidas: 10/10 · con citas: 10/10 · con hechos del grafo: 9/10

- RAG semana 9 (mismas preguntas): respondidas 9/10 · citas promedio 2.7 → GraphRAG: citas promedio 9.0

| id | tipo | herramienta | modelo | filas del grafo | responde | citas (grafo) | avisos |
|---|---|---|---|---|---|---|---|
| P1 | competencia | P1 | caché · groq · openai/gpt-oss-20b | 5 | ✅ | 1 (1) |  |
| P2 | competencia | P2 | caché · groq · openai/gpt-oss-20b | 5 | ✅ | 5 (5) |  |
| P3 | competencia | P3 | caché · gemini · gemini-flash-lite-latest | 72 | ✅ | 16 (16) |  |
| P4 | competencia | P4 | caché · gemini · gemini-flash-lite-latest | 82 | ✅ | 20 (20) |  |
| P5 | competencia | P5 | caché · gemini · gemini-flash-lite-latest | 15 | ✅ | 2 (2) |  |
| P6 | competencia | P6 | caché · gemini · gemini-flash-lite-latest | 37 | ✅ | 20 (20) |  |
| P7 | competencia | P7 | caché · gemini · gemini-flash-lite-latest | 18 | ✅ | 4 (4) |  |
| P8 | competencia | P8 | caché · groq · openai/gpt-oss-20b | 5 | ✅ | 1 (0) |  |
| P9 | competencia | P9 | caché · groq · openai/gpt-oss-20b | 19 | ✅ | 2 (2) |  |
| P10 | competencia | P10 | caché · gemini · gemini-flash-lite-latest | 66 | ✅ | 19 (18) |  |
| D1 | descriptiva | texto | caché · groq · openai/gpt-oss-20b | 0 | ✅ | 3 (0) |  |
| D2 | multilingüe | texto | caché · groq · openai/gpt-oss-20b | 0 | ✅ | 4 (0) |  |
| D3 | histórica | ficha | caché · gemini · gemini-flash-lite-latest | 60 | ✅ | 6 (2) |  |
| D4 | conteo | E3_conteo_departamento | groq · openai/gpt-oss-120b | 2 | ✅ | 1 (0) |  |
| D5 | fuera del corpus | texto | — | 0 | ❌ | 0 (0) | La pregunta no se parece a nada del corpus ni a ninguna entidad del grafo (no se llamó al LLM). |
| G1 | negación | E1_negacion_sin_obras | caché · groq · openai/gpt-oss-20b | 6 | ✅ | 1 (0) |  |
| G2 | conteo varios saltos | E4_conteo_cordillera | caché · groq · openai/gpt-oss-20b | 13 | ✅ | 1 (1) |  |
| G3 | camino | camino | caché · groq · openai/gpt-oss-20b | 2 | ✅ | 3 (2) |  |