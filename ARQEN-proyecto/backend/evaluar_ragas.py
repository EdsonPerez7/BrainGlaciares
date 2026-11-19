# -*- coding: utf-8 -*-
"""Evalúa con RAGAS (0 a 1) las respuestas y contextos generados por evaluar_agente.py.

Métricas:
  - faithfulness: ¿La respuesta se basa únicamente en los documentos recuperados (sin inventar)?
  - answer_relevancy: ¿Respondió directamente lo que preguntó el usuario?
  - llm_context_precision_without_reference: ¿Los contextos recuperados fueron útiles para la pregunta?

Uso:
    python evaluar_ragas.py --entrada resultados/ragas_agente.jsonl --salida resultados
"""
import argparse
import json
import os
import sys
from typing import List

from dotenv import load_dotenv
from fastembed import TextEmbedding
from langchain_core.embeddings import Embeddings
from langchain_groq import ChatGroq
from ragas import EvaluationDataset, RunConfig, SingleTurnSample, evaluate
from ragas.embeddings import LangchainEmbeddingsWrapper
from ragas.llms import LangchainLLMWrapper
from ragas.metrics import (
    Faithfulness,
    LLMContextPrecisionWithoutReference,
    ResponseRelevancy,
)

AQUI = os.path.dirname(os.path.abspath(__file__))


class FastEmbedMultilingual(Embeddings):
    """Wrapper ligero para usar FastEmbed local (ONNX) con LangChain y RAGAS sin GPU ni PyTorch."""

    def __init__(self, model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"):
        self.model = model_name
        self._embedder = TextEmbedding(model_name=model_name)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return [vec.tolist() for vec in self._embedder.embed(texts)]

    def embed_query(self, text: str) -> List[float]:
        return next(self._embedder.embed([text])).tolist()


def cargar_muestras(ruta_jsonl: str):
    filas_raw = []
    muestras = []
    with open(ruta_jsonl, encoding="utf-8") as f:
        for linea in f:
            if not linea.strip():
                continue
            item = json.loads(linea)
            filas_raw.append(item)
            ctx = item.get("contexts") or []
            # RAGAS requiere al menos un string no vacío en retrieved_contexts
            if not ctx:
                ctx = ["Sin contextos recuperados en el corpus oficial."]
            muestras.append(
                SingleTurnSample(
                    user_input=item["question"],
                    response=item["answer"],
                    retrieved_contexts=[str(c)[:800] for c in ctx[:5]],
                )
            )
    return filas_raw, EvaluationDataset(samples=muestras)


def generar_reporte(filas_raw, df_scores, modelo_juez: str) -> str:
    f_col = "faithfulness"
    r_col = "answer_relevancy"
    c_col = "llm_context_precision_without_reference"

    f_avg = df_scores[f_col].mean(skipna=True)
    r_avg = df_scores[r_col].mean(skipna=True)
    c_avg = df_scores[c_col].mean(skipna=True)

    lineas = [
        "# Evaluación RAGAS — BrainGlaciares",
        "",
        f"- **Juez Evaluador (LLM):** `{modelo_juez}`",
        f"- **Preguntas evaluadas:** {len(df_scores)}",
        f"- **Faithfulness promedio (No alucinación):** `{f_avg:.3f}`" if f_avg == f_avg else "- **Faithfulness:** N/A",
        f"- **Answer Relevancy promedio (Pertinencia):** `{r_avg:.3f}`" if r_avg == r_avg else "- **Answer Relevancy:** N/A",
        f"- **Context Precision promedio (Utilidad búsqueda):** `{c_avg:.3f}`" if c_avg == c_avg else "- **Context Precision:** N/A",
        "",
        "| ID | Pregunta | Faithfulness | Answer Relevancy | Context Precision |",
        "|---|---|---:|---:|---:|",
    ]

    for idx, raw in enumerate(filas_raw):
        row = df_scores.iloc[idx]
        f_val = f"{row[f_col]:.2f}" if row[f_col] == row[f_col] else "—"
        r_val = f"{row[r_col]:.2f}" if row[r_col] == row[r_col] else "—"
        c_val = f"{row[c_col]:.2f}" if row[c_col] == row[c_col] else "—"
        q_short = raw["question"][:65] + ("..." if len(raw["question"]) > 65 else "")
        lineas.append(f"| {raw.get('id', idx+1)} | {q_short} | {f_val} | {r_val} | {c_val} |")

    return "\n".join(lineas) + "\n"


def main():
    load_dotenv(os.path.join(AQUI, ".env"))
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--entrada", default=os.path.join(AQUI, "resultados", "ragas_agente.jsonl"))
    p.add_argument("--salida", default=os.path.join(AQUI, "resultados"))
    p.add_argument("--modelo", default="openai/gpt-oss-120b", help="Modelo juez de Groq")
    args = p.parse_args()

    if not os.environ.get("GROQ_API_KEY"):
        sys.exit("Falta GROQ_API_KEY en el entorno o en backend/.env")

    print(f"Cargando muestras desde: {args.entrada}", flush=True)
    filas_raw, dataset = cargar_muestras(args.entrada)

    print("Inicializando embeddings multilingües locales (FastEmbed)...", flush=True)
    emb_local = FastEmbedMultilingual()
    ragas_emb = LangchainEmbeddingsWrapper(emb_local)

    print(f"Inicializando LLM Juez (Groq: {args.modelo})...", flush=True)
    llm_groq = ChatGroq(model=args.modelo, temperature=0, max_retries=5)
    ragas_llm = LangchainLLMWrapper(llm_groq)

    metricas = [
        Faithfulness(llm=ragas_llm),
        ResponseRelevancy(llm=ragas_llm, embeddings=ragas_emb, strictness=1),
        LLMContextPrecisionWithoutReference(llm=ragas_llm),
    ]

    print(f"Ejecutando RAGAS sobre {len(filas_raw)} muestras...", flush=True)
    run_cfg = RunConfig(max_workers=1, max_retries=5, timeout=120)
    resultado = evaluate(
        dataset=dataset,
        metrics=metricas,
        llm=ragas_llm,
        embeddings=ragas_emb,
        run_config=run_cfg,
        raise_exceptions=False,
    )

    df = resultado.to_pandas()
    os.makedirs(args.salida, exist_ok=True)
    csv_path = os.path.join(args.salida, "ragas_scores.csv")
    md_path = os.path.join(args.salida, "reporte_ragas.md")

    df.insert(0, "id", [r.get("id", i + 1) for i, r in enumerate(filas_raw)])
    df.to_csv(csv_path, index=False, encoding="utf-8")

    reporte_md = generar_reporte(filas_raw, df, args.modelo)
    with open(md_path, "w", encoding="utf-8") as h:
        h.write(reporte_md)

    print("\n" + reporte_md, flush=True)
    print(f"Guardado en:\n  - {csv_path}\n  - {md_path}", flush=True)


if __name__ == "__main__":
    main()

