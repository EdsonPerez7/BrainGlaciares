# Reporte del agente · semana 10

- Evaluado en: http://127.0.0.1:8080
- Preguntas de competencia respondidas: 2/3 · con citas: 3/3
- Modos: agente: 3, evidencia: 1, graphrag: 2
- Tiempo promedio: 7.9 s

| id | tipo | herramientas | modo | modelo | responde | citas (grafo) | s | avisos |
|---|---|---|---|---|---|---|---|---|
| P2 | competencia | consulta_verificada | agente | groq · openai/gpt-oss-120b | ✅ | 5 (5) | 2.93 |  |
| P4 | competencia | consulta_verificada | agente | groq · openai/gpt-oss-20b | ✅ | 19 (19) | 5.1 |  |
| P10 | competencia | P10 | evidencia | — | ❌ | 24 (20) | 6.21 | El LLM no respondió (groq · openai/gpt-oss-20b: RateLimitError): se muestra la evidencia. |
| D1 | descriptiva | buscar_entidad > texto | graphrag | groq · openai/gpt-oss-120b | ✅ | 4 (0) | 16.65 |  |
| D3 | histórica | buscar_documentos | agente | groq · openai/gpt-oss-20b | ✅ | 3 (0) | 2.29 |  |
| D5 | fuera del corpus | texto | graphrag | groq · openai/gpt-oss-120b | ❌ | 0 (0) | 14.24 |  |
