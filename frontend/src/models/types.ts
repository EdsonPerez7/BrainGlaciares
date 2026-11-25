/**
 * Modelos e Interfaces TypeScript para el Frontend
 */
import type { PreguntaEvaluacion } from '../config/evaluacion.data';

export interface MetricasPaisResponse {
  hielo_perdido: {
    porcentaje: number;
    superficie_historica_km2: number;
    superficie_actual_km2: number;
    periodo: string;
    fuente: string;
    pagina: number | string;
  };
  lagunas_riesgo: {
    total: number;
    muy_alto: number;
    alto: number;
    sin_obra: number;
    fuente: string;
  };
  aluviones_historicos: {
    total_registrados: number;
    primer_ano: number;
    periodo: string;
    por_decada: Array<{ decada: string; eventos: number }>;
    fuente: string;
  };
}

export interface DepartamentoRiesgo {
  departamento: string;
  total: number;
  muy_alto: number;
  alto: number;
}

export interface CordilleraGlaciar {
  nombre: string;
  departamento: string;
  superficie_1962_km2: number;
  superficie_actual_km2: number;
  perdida_pct: number;
  lagunas_total: number;
  lagunas_peligrosas: number;
}

export interface SaludResponse {
  estado: string;
  agente: string;
  grafo_listo: boolean;
  documentos_rag: number;
}

export interface CatalogoItem {
  id: string;
  nombre: string;
  departamento?: string;
  riesgo?: string;
  n_docs?: number;
  url: string;
}

export interface CatalogoResponse {
  lagunas: CatalogoItem[];
  departamentos: CatalogoItem[];
  total_lagunas: number;
  total_departamentos: number;
  total_documentos: number;
}

export interface LagunaItem {
  id: string;
  nombre: string;
  departamento: string;
  cordillera: string;
  riesgo: string;
  poblado_amenazado: string;
  tiene_obras: boolean;
  volumen_hm3: number;
  altitud_msnm: number;
}

export interface ComparacionResponse {
  laguna1: {
    id: string;
    nombre: string;
    departamento: string;
    cordillera: string;
    riesgo: string;
    pueblos_abajo_total: number;
    pueblos_lista: string[];
    obras: string;
    eventos_historicos: number;
    volumen_hm3: number;
    altitud_msnm: number;
    primer_estudio_ano: number;
    total_estudios: number;
    glaciar_origen: string;
  };
  laguna2: {
    id: string;
    nombre: string;
    departamento: string;
    cordillera: string;
    riesgo: string;
    pueblos_abajo_total: number;
    pueblos_lista: string[];
    obras: string;
    eventos_historicos: number;
    volumen_hm3: number;
    altitud_msnm: number;
    primer_estudio_ano: number;
    total_estudios: number;
    glaciar_origen: string;
  };
  elementos_compartidos: number;
  serie_temporal: Array<{ ano: number; [key: string]: number }>;
  red_relaciones: {
    nodos: Array<{ id: string; label: string; tipo: string; grupo: string }>;
    enlaces: Array<{ origen: string; destino: string; rel: string }>;
  };
}

export interface InfoResponse {
  estado: string;
  detalle: string | null;
  version: string;
  activo_hace_s: number;
  preguntas: number;
  aciertos_cache: number;
  grafo?: {
    activo: string;
    neo4j_configurado: boolean;
    neo4j_conectado: boolean;
    ultimo_error: string | null;
  };
  texto?: {
    fragmentos: number;
    busqueda: string;
  };
  modelos?: Array<{ modelo: string; disponible: boolean; usos: number; errores: number }>;
  herramientas?: Array<{ nombre: string; descripcion: string }>;
}

export interface RagasResumen {
  total_banco: number;
  validadas_evidencia?: number;
  validadas_exito: number;
  observadas: number;
  evaluadas_ragas: number;
  cobertura_pct: number;
  faithfulness_avg?: number;
  answer_relevancy_avg?: number;
  context_precision_avg?: number;
  fidelidad_promedio: number;
  relevancia_promedio: number;
  precision_contexto_promedio: number;
}

export interface RagasResponse {
  resumen: RagasResumen;
  preguntas: PreguntaEvaluacion[];
}

export interface ChatPaso {
  tipo: "paso" | "cita" | "inicio" | "final" | "error";
  herramienta?: string;
  argumentos?: any;
  cita?: {
    numero: number;
    documento: string;
    pagina: number;
    texto: string;
  };
  resultado?: {
    respuesta: string;
    citas: Array<{ numero: number; doc: string; pag: number; texto: string }>;
    herramientas: string[];
    segundos: number;
    modelo: string;
  };
  detalle?: string;
}
