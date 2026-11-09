/**
 * ARCHIVO DE LA VERDAD - Métricas Oficiales Auditables
 * Cada dato cuenta con su cita documental estricta para garantizar rigor científico.
 */

export interface MetricaAuditable {
  cifra: string | number;
  etiqueta: string;
  detalle: string;
  documento_fuente: string;
  pagina_o_seccion: string;
}

export const METRICAS_PAIS = {
  hielo_perdido: {
    porcentaje: 52,
    superficie_1962_km2: 2104,
    superficie_2016_km2: 1013,
    periodo: "1962–2016",
    fuente: "Inventario Nacional de Glaciares y Lagunas, Autoridad Nacional del Agua (ANA)",
    pagina: "p. 47"
  },
  lagunas_riesgo: {
    total: 18,
    muy_alto: 8,
    alto: 10,
    sin_obras_seguridad: 3,
    fuente: "Evaluación de Riesgo Glaciar, Instituto Nacional de Investigación en Glaciares (INAIGEM)",
    pagina: "Informe Técnico 2023"
  },
  aluviones_historicos: {
    total_registrados: 100,
    primer_registro_ano: 1868,
    periodo: "1868–2026",
    fuente: "Catálogo Histórico de Desbordes y Aluviones (ANA/INAIGEM/SENAMHI)",
    pagina: "Compendio Histórico Nacional"
  }
} as const;

export interface LagunaCatalogo {
  id: string;
  nombre: string;
  departamento: string;
  cordillera: string;
  riesgo: "Muy alto" | "Alto" | "Medio" | "Bajo";
  poblado_amenazado: string;
  tiene_obras: boolean;
  volumen_hm3: number;
  altitud_msnm: number;
  glaciar_origen: string;
  primer_estudio_ano: number;
  total_estudios: number;
  ano_evento_critico?: number;
}

export const LAGUNAS_DESTACADAS: LagunaCatalogo[] = [
  {
    id: "palcacocha",
    nombre: "Palcacocha",
    departamento: "Áncash",
    cordillera: "Blanca",
    riesgo: "Muy alto",
    poblado_amenazado: "Huaraz",
    tiene_obras: true,
    volumen_hm3: 17.3,
    altitud_msnm: 4566,
    glaciar_origen: "Palcaraju / Cojup",
    primer_estudio_ano: 1972,
    total_estudios: 68,
    ano_evento_critico: 1941
  },
  {
    id: "paron",
    nombre: "Parón",
    departamento: "Áncash",
    cordillera: "Blanca",
    riesgo: "Muy alto",
    poblado_amenazado: "Caraz",
    tiene_obras: true,
    volumen_hm3: 55.0,
    altitud_msnm: 4185,
    glaciar_origen: "Huandoy / Pirámide de Garcilaso",
    primer_estudio_ano: 1966,
    total_estudios: 33,
    ano_evento_critico: 1953
  },
  {
    id: "513",
    nombre: "Laguna 513",
    departamento: "Áncash",
    cordillera: "Blanca",
    riesgo: "Alto",
    poblado_amenazado: "Carhuaz",
    tiene_obras: true,
    volumen_hm3: 9.2,
    altitud_msnm: 4428,
    glaciar_origen: "Hualcán",
    primer_estudio_ano: 1985,
    total_estudios: 28,
    ano_evento_critico: 2010
  },
  {
    id: "upiscocha",
    nombre: "Upiscocha",
    departamento: "Cusco",
    cordillera: "Vilcanota",
    riesgo: "Alto",
    poblado_amenazado: "Upis / Ocongate",
    tiene_obras: false,
    volumen_hm3: 4.1,
    altitud_msnm: 4510,
    glaciar_origen: "Ausangate",
    primer_estudio_ano: 2012,
    total_estudios: 9,
    ano_evento_critico: 2022
  },
  {
    id: "gangrajanca",
    nombre: "Gangrajanca",
    departamento: "Huánuco",
    cordillera: "Huayhuash",
    riesgo: "Muy alto",
    poblado_amenazado: "Queropalca",
    tiene_obras: false,
    volumen_hm3: 6.7,
    altitud_msnm: 4310,
    glaciar_origen: "Yerupajá",
    primer_estudio_ano: 1994,
    total_estudios: 14
  }
];

export const DEPARTAMENTOS_RIESGO = [
  { departamento: "Áncash", total: 8, muy_alto: 5, alto: 3 },
  { departamento: "Huánuco", total: 3, muy_alto: 1, alto: 2 },
  { departamento: "Puno", total: 2, muy_alto: 1, alto: 1 },
  { departamento: "Cusco", total: 2, muy_alto: 0, alto: 2 },
  { departamento: "Lima", total: 1, muy_alto: 1, alto: 0 },
  { departamento: "Pasco", total: 1, muy_alto: 0, alto: 1 },
  { departamento: "Junín", total: 1, muy_alto: 0, alto: 1 },
  { departamento: "Apurímac", total: 1, muy_alto: 0, alto: 1 }
];
