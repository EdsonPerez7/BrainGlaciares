import { SITE_CONFIG } from '../config/site.config';
import { METRICAS_PAIS, DEPARTAMENTOS_RIESGO, LAGUNAS_DESTACADAS } from '../config/metrics.data';
import type { MetricasPaisResponse, DepartamentoRiesgo, LagunaItem, ComparacionResponse } from '../models/types';

const BASE_URL = SITE_CONFIG.apiBaseUrl;

export const ApiService = {
  async getMetricasPais(): Promise<MetricasPaisResponse> {
    try {
      const res = await fetch(`${BASE_URL}/api/metricas/pais`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback seguro usando el Archivo de la Verdad local
    }
    return {
      hielo_perdido: {
        porcentaje: METRICAS_PAIS.hielo_perdido.porcentaje,
        superficie_historica_km2: METRICAS_PAIS.hielo_perdido.superficie_1962_km2,
        superficie_actual_km2: METRICAS_PAIS.hielo_perdido.superficie_2016_km2,
        periodo: METRICAS_PAIS.hielo_perdido.periodo,
        fuente: METRICAS_PAIS.hielo_perdido.fuente,
        pagina: METRICAS_PAIS.hielo_perdido.pagina
      },
      lagunas_riesgo: {
        total: METRICAS_PAIS.lagunas_riesgo.total,
        muy_alto: METRICAS_PAIS.lagunas_riesgo.muy_alto,
        alto: METRICAS_PAIS.lagunas_riesgo.alto,
        sin_obra: METRICAS_PAIS.lagunas_riesgo.sin_obras_seguridad,
        fuente: METRICAS_PAIS.lagunas_riesgo.fuente
      },
      aluviones_historicos: {
        total_registrados: METRICAS_PAIS.aluviones_historicos.total_registrados,
        primer_ano: METRICAS_PAIS.aluviones_historicos.primer_registro_ano,
        periodo: METRICAS_PAIS.aluviones_historicos.periodo,
        por_decada: [
          { decada: "1868-1920", eventos: 8 },
          { decada: "1920-1940", eventos: 12 },
          { decada: "1940-1960", eventos: 24 },
          { decada: "1960-1980", eventos: 27 },
          { decada: "1980-2000", eventos: 15 },
          { decada: "2000-2020", eventos: 11 },
          { decada: "2020s", eventos: 3 }
        ],
        fuente: METRICAS_PAIS.aluviones_historicos.fuente
      }
    };
  },

  async getDepartamentosRiesgo(): Promise<DepartamentoRiesgo[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/departamentos/riesgo`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback local
    }
    return DEPARTAMENTOS_RIESGO;
  },

  async getLagunasLista(): Promise<LagunaItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/lagunas/lista`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback local
    }
    return LAGUNAS_DESTACADAS.map(l => ({
      id: l.id,
      nombre: l.nombre,
      departamento: l.departamento,
      cordillera: l.cordillera,
      riesgo: l.riesgo,
      poblado_amenazado: l.poblado_amenazado,
      tiene_obras: l.tiene_obras,
      volumen_hm3: l.volumen_hm3,
      altitud_msnm: l.altitud_msnm
    }));
  },

  async getComparacion(l1: string, l2: string): Promise<ComparacionResponse | null> {
    try {
      const res = await fetch(`${BASE_URL}/api/lagunas/comparar?l1=${encodeURIComponent(l1)}&l2=${encodeURIComponent(l2)}`);
      if (res.ok) return await res.json();
    } catch {
      // Manejar error o fallback
    }
    return null;
  }
};
