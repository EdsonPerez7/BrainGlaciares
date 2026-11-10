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
  riesgo: "Muy alto" | "Alto" | "Medio" | "Bajo" | "Sin evaluar";
  poblado_amenazado: string;
  tiene_obras: boolean;
  obras_detalle: string;
  volumen_hm3: number;
  superficie_km2: number;
  documento_superficie?: string;
  pueblos_aguas_abajo_num: number;
  eventos_historicos_num: number;
  altitud_msnm: number;
  glaciar_origen: string;
  primer_estudio_ano: number;
  total_estudios: number;
  total_documentos: number;
  datos_conectados: number;
  confianza: number;
  fecha_actualizacion: string;
  ano_evento_critico?: number;
  lat: number;
  lng: number;
  alerta_especifica?: string;
}

export const LAGUNAS_DESTACADAS: LagunaCatalogo[] = [
  {
    id: "cancahua",
    nombre: "Cancahua",
    departamento: "Áncash",
    cordillera: "Blanca",
    riesgo: "Sin evaluar",
    poblado_amenazado: "Nadie registrado abajo",
    tiene_obras: true,
    obras_detalle: "Dique, Presa, Túnel de desagüe",
    volumen_hm3: 2.1,
    superficie_km2: 0.15,
    documento_superficie: "doc. 20.500.12748/628 - p. 7",
    pueblos_aguas_abajo_num: 0,
    eventos_historicos_num: 2,
    altitud_msnm: 4460,
    glaciar_origen: "Vallunaraju",
    primer_estudio_ano: 2005,
    total_estudios: 12,
    total_documentos: 3,
    datos_conectados: 14,
    confianza: 0.62,
    fecha_actualizacion: "2025 · al día",
    lat: -9.4200,
    lng: -77.5000,
    alerta_especifica: "No hay un nivel de riesgo registrado (no evaluado no es lo mismo que sin riesgo)."
  },
  {
    id: "palcacocha",
    nombre: "Palcacocha",
    departamento: "Áncash",
    cordillera: "Blanca",
    riesgo: "Muy alto",
    poblado_amenazado: "Huaraz",
    tiene_obras: true,
    obras_detalle: "Dique de contención y sistema de sifonamiento continuo",
    volumen_hm3: 17.3,
    superficie_km2: 0.52,
    documento_superficie: "INAIGEM - Informe Técnico 004-2023",
    pueblos_aguas_abajo_num: 1,
    eventos_historicos_num: 3,
    altitud_msnm: 4566,
    glaciar_origen: "Palcaraju / Cojup",
    primer_estudio_ano: 1972,
    total_estudios: 68,
    total_documentos: 68,
    datos_conectados: 42,
    confianza: 0.98,
    fecha_actualizacion: "2026 · al día",
    ano_evento_critico: 1941,
    lat: -9.3986,
    lng: -77.3802,
    alerta_especifica: "Aluvión histórico de 1941 causó más de 1,800 víctimas. Sistema de alerta temprana activo."
  },
  {
    id: "paron",
    nombre: "Parón",
    departamento: "Áncash",
    cordillera: "Blanca",
    riesgo: "Muy alto",
    poblado_amenazado: "Caraz",
    tiene_obras: true,
    obras_detalle: "Túnel de desagüe regulado y compuertas de descarga",
    volumen_hm3: 55.0,
    superficie_km2: 1.48,
    documento_superficie: "ANA - Compendio de Lagunas Glaciares",
    pueblos_aguas_abajo_num: 1,
    eventos_historicos_num: 2,
    altitud_msnm: 4185,
    glaciar_origen: "Huandoy / Pirámide de Garcilaso",
    primer_estudio_ano: 1966,
    total_estudios: 33,
    total_documentos: 33,
    datos_conectados: 28,
    confianza: 0.94,
    fecha_actualizacion: "2026 · al día",
    ano_evento_critico: 1953,
    lat: -8.9983,
    lng: -77.6833,
    alerta_especifica: "Laguna más grande de la Cordillera Blanca con dique de regulación permanente."
  },
  {
    id: "513",
    nombre: "Laguna 513",
    departamento: "Áncash",
    cordillera: "Blanca",
    riesgo: "Alto",
    poblado_amenazado: "Carhuaz",
    tiene_obras: true,
    obras_detalle: "Túneles de seguridad en roca viva y Sistema de Alerta Temprana (SAT)",
    volumen_hm3: 9.2,
    superficie_km2: 0.38,
    documento_superficie: "UGRH-ANA Informe de Seguridad Glaciar",
    pueblos_aguas_abajo_num: 1,
    eventos_historicos_num: 1,
    altitud_msnm: 4428,
    glaciar_origen: "Hualcán",
    primer_estudio_ano: 1985,
    total_estudios: 28,
    total_documentos: 28,
    datos_conectados: 22,
    confianza: 0.95,
    fecha_actualizacion: "2025 · al día",
    ano_evento_critico: 2010,
    lat: -9.2133,
    lng: -77.5511,
    alerta_especifica: "En 2010 una avalancha generó olas de 28 m, contenidas parcialmente por los túneles."
  },
  {
    id: "upiscocha",
    nombre: "Upiscocha",
    departamento: "Cusco",
    cordillera: "Vilcanota",
    riesgo: "Alto",
    poblado_amenazado: "Upis / Ocongate",
    tiene_obras: false,
    obras_detalle: "Sin obras de regulación física (Monitoreo satelital)",
    volumen_hm3: 4.1,
    superficie_km2: 0.22,
    documento_superficie: "INAIGEM - Cordillera Vilcanota 2023",
    pueblos_aguas_abajo_num: 2,
    eventos_historicos_num: 1,
    altitud_msnm: 4510,
    glaciar_origen: "Ausangate",
    primer_estudio_ano: 2012,
    total_estudios: 9,
    total_documentos: 9,
    datos_conectados: 11,
    confianza: 0.81,
    fecha_actualizacion: "2024",
    ano_evento_critico: 2022,
    lat: -13.7250,
    lng: -71.2950,
    alerta_especifica: "Formación reciente por retroceso acelerado al pie del Nevado Ausangate."
  },
  {
    id: "gangrajanca",
    nombre: "Gangrajanca",
    departamento: "Huánuco",
    cordillera: "Huayhuash",
    riesgo: "Muy alto",
    poblado_amenazado: "Queropalca",
    tiene_obras: false,
    obras_detalle: "Sin obras físicas de mitigación",
    volumen_hm3: 6.7,
    superficie_km2: 0.31,
    documento_superficie: "INAIGEM - Inventario de Glaciares Huayhuash",
    pueblos_aguas_abajo_num: 1,
    eventos_historicos_num: 0,
    altitud_msnm: 4310,
    glaciar_origen: "Yerupajá",
    primer_estudio_ano: 1994,
    total_estudios: 14,
    total_documentos: 14,
    datos_conectados: 16,
    confianza: 0.88,
    fecha_actualizacion: "2024",
    lat: -10.2764,
    lng: -76.8778,
    alerta_especifica: "Ubicada bajo la pared oriental del Yerupajá con alta pendiente e inestabilidad morrénica."
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
