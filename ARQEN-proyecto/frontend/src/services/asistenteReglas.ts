/**
 * Asistente por reglas: responde SIN IA y SIN servidor, usando solo los datos
 * oficiales que ya vienen en la página. Es la última capa: si fallan los tokens
 * o se cae el backend, ARQEN sigue respondiendo con datos verificables.
 * Regla de oro: si no sabe, lo dice y ofrece preguntas que sí puede contestar.
 */
import { LAGUNAS_DESTACADAS, DEPARTAMENTOS_RIESGO, METRICAS_PAIS, type LagunaCatalogo } from '../config/metrics.data';
import { piscinasOlimpicas, formatoMiles } from '../config/recorrido.data';
import type { Contexto } from '../scripts/contexto';

export interface RespuestaReglas {
  respuesta: string;          // markdown simple (**negrita**, - viñetas, [n])
  fuentes: { n: number; referencia: string; evidencia?: string }[];
  sugerencias: string[];
  reconocida: boolean;
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:()]/g, ' ');
const nombreLaguna = (l: LagunaCatalogo) => (l.nombre.startsWith('Laguna') ? l.nombre : `Laguna ${l.nombre}`);
const RIESGO_ORDEN: Record<string, number> = { 'Muy alto': 4, Alto: 3, Medio: 2, Bajo: 1, 'Sin evaluar': 0 };

function buscarLagunas(q: string): LagunaCatalogo[] {
  const nq = ` ${norm(q)} `;
  return LAGUNAS_DESTACADAS.filter((l) => {
    const n = norm(l.nombre).trim();
    return nq.includes(` ${n} `) || (n.length > 4 && nq.includes(n));
  });
}
function buscarDepartamento(q: string): string | null {
  const nq = norm(q);
  const d = DEPARTAMENTOS_RIESGO.find((x) => nq.includes(norm(x.departamento).trim()));
  return d ? d.departamento : null;
}
function buscarPoblado(q: string): LagunaCatalogo[] {
  const nq = ` ${norm(q)} `;
  return LAGUNAS_DESTACADAS.filter((l) => {
    const p = norm(l.poblado_amenazado).trim();
    return p.length > 3 && !p.startsWith('nadie') && nq.includes(` ${p} `);
  });
}

function fichaLaguna(l: LagunaCatalogo, n = 1) {
  const obras = l.tiene_obras ? `Sí: ${l.obras_detalle.toLowerCase()}` : 'No registra obras de seguridad';
  return {
    texto:
      `**${nombreLaguna(l)}** (${l.departamento}, Cordillera ${l.cordillera})\n` +
      `- Riesgo: **${l.riesgo.toLowerCase()}** [${n}]\n` +
      `- Volumen: **${l.volumen_hm3} hm³**, unas ${formatoMiles(piscinasOlimpicas(l.volumen_hm3))} piscinas olímpicas\n` +
      `- Aguas abajo: **${l.poblado_amenazado}**\n` +
      `- Obras de seguridad: ${obras}\n` +
      `- Altitud: ${formatoMiles(l.altitud_msnm)} m · glaciar ${l.glaciar_origen}\n` +
      `- Estudiada desde ${l.primer_estudio_ano} (${l.total_estudios} estudios)` +
      (l.alerta_especifica ? `\n\nOjo: ${l.alerta_especifica}` : ''),
    fuente: { n, referencia: l.documento_superficie || 'Catálogo de lagunas INAIGEM / ANA', evidencia: `Ficha de ${nombreLaguna(l)} en el catálogo oficial` },
  };
}

const SUGERENCIAS_BASE = [
  '¿Qué lagunas de Áncash tienen riesgo muy alto?',
  '¿Qué lagunas no tienen obras de seguridad?',
  '¿Qué hago si ocurre un aluvión?',
];

export function sugerenciasPara(ctx: Contexto): string[] {
  if (ctx.comparacion) {
    const [a, b] = ctx.comparacion;
    if (ctx.valor) return [`¿Qué relación tiene «${ctx.valor}» con ${a} y ${b}?`, `¿Cuál es más peligrosa, ${a} o ${b}?`, `¿Qué obras de seguridad tienen ${a} y ${b}?`];
    return [`¿Cuál es más peligrosa, ${a} o ${b}?`, `¿Cuánta agua tiene ${a} comparada con ${b}?`, `¿Qué obras de seguridad tienen ${a} y ${b}?`];
  }
  if (ctx.grafico) {
    const v = ctx.valor ? ` (${ctx.valor})` : '';
    switch (ctx.grafico) {
      case 'hielo': return ['¿Cuánto hielo perdió el Perú?', '¿Por qué retroceden los glaciares?', '¿Qué lagunas nacieron por el deshielo?'];
      case 'riesgo-pais': return [`¿Cuáles son las lagunas de riesgo ${ctx.valor?.toLowerCase() || 'muy alto'}?`, '¿Qué lagunas no tienen obras de seguridad?', '¿Qué departamento tiene más lagunas en riesgo?'];
      case 'aluviones': return [`¿Qué aluviones ocurrieron${v}?`, '¿Cuál fue el aluvión más grave del Perú?', '¿Qué hago si ocurre un aluvión?'];
      case 'volumen': return [`¿Por qué importa el volumen de ${ctx.valor || 'una laguna'}?`, `¿Qué poblado está debajo de ${ctx.valor || 'esta laguna'}?`, '¿Cuál es la laguna con más agua?'];
      case 'departamento': return [`¿Qué lagunas de ${ctx.valor} tienen riesgo muy alto?`, `¿Cuántas lagunas críticas hay en ${ctx.valor}?`, `¿Qué lagunas de ${ctx.valor} no tienen obras?`];
      case 'perfil': return [`¿Por qué el agua baja tan rápido desde ${ctx.laguna || 'la laguna'}?`, `¿Qué poblados hay aguas abajo de ${ctx.laguna || 'la laguna'}?`, '¿Qué hago si ocurre un aluvión?'];
      case 'altitud-volumen': return [`¿Qué tan peligrosa es ${ctx.valor || 'esta laguna'}?`, '¿Cuál es la laguna con más agua?', '¿Qué lagunas no tienen obras de seguridad?'];
      case 'obras': return ['¿Qué lagunas no tienen obras de seguridad?', '¿Qué tipo de obras protegen a las lagunas?', '¿Qué lagunas de Áncash tienen riesgo muy alto?'];
      case 'fuentes': return ['¿De dónde salen los 398 informes?', '¿Cómo se validan las respuestas?', '¿Qué significa fidelidad en la evaluación?'];
      case 'ragas': return ['¿Cómo se validan las respuestas?', '¿Qué significa fidelidad en la evaluación?', '¿De dónde salen los 398 informes?'];
    }
  }
  if (ctx.laguna) {
    const n = ctx.laguna.startsWith('Laguna') ? ctx.laguna : `la laguna ${ctx.laguna}`;
    return [`¿Por qué ${n} es peligrosa?`, `¿Qué poblados amenaza ${n}?`, `¿Qué obras de seguridad tiene ${n}?`];
  }
  if (ctx.departamento) return [`¿Qué lagunas de ${ctx.departamento} tienen riesgo muy alto?`, `¿Qué lagunas de ${ctx.departamento} no tienen obras?`, '¿Qué hago si ocurre un aluvión?'];
  if (ctx.seccion === 'El camino de un aluvión' || ctx.seccion === 'Así ocurre un aluvión') return ['¿Qué pasó en la Laguna 513 en 2010?', '¿Cómo se forma un aluvión?', '¿Qué es un sistema de alerta temprana?'];
  if (ctx.seccion === 'Metodología') return ['¿Cómo se validan las respuestas?', '¿De dónde salen los 398 informes?', '¿Qué significa fidelidad en la evaluación?'];
  return SUGERENCIAS_BASE;
}

export function responderPorReglas(pregunta: string, ctx: Contexto = {}): RespuestaReglas {
  const q = norm(pregunta);
  const tiene = (...p: string[]) => p.some((x) => q.includes(x));
  let lagunas = buscarLagunas(pregunta);
  if (!lagunas.length && ctx.lagunaId && tiene('esta laguna', 'la laguna', 'peligros', 'poblado', 'obra', 'volumen', 'agua')) {
    const l = LAGUNAS_DESTACADAS.find((x) => x.id === ctx.lagunaId);
    if (l) lagunas = [l];
  }
  const depto = buscarDepartamento(pregunta);
  const sug = sugerenciasPara(ctx);

  // 1. Qué hacer ante un aluvión (prioridad: es seguridad de personas)
  if (tiene('que hago', 'que hacer', 'evacu', 'emergencia', 'como me protejo', 'protegerme', 'alerta')) {
    return {
      reconocida: true, sugerencias: sug,
      respuesta:
        'Ante un aluvión, cada minuto cuenta:\n' +
        '- **Conoce hoy tu ruta de evacuación** hacia zonas altas, lejos del cauce del río.\n' +
        '- Si escuchas un ruido fuerte que baja por la quebrada o suena la alerta, **sube de inmediato**; no esperes a ver el agua.\n' +
        '- **No cruces ríos ni quebradas** y aléjate de los puentes.\n' +
        '- Sigue solo los avisos oficiales de INDECI y el COEN. Emergencias: **115**.',
      fuentes: [{ n: 1, referencia: 'INDECI · Recomendaciones ante huaicos y aluviones' }],
    };
  }

  // 2. Comparar dos lagunas
  if (lagunas.length >= 2 && tiene('compar', ' vs ', 'diferencia', 'cual es mas', 'o ')) {
    const [a, b] = lagunas;
    const masRiesgo = RIESGO_ORDEN[a.riesgo] === RIESGO_ORDEN[b.riesgo] ? null : (RIESGO_ORDEN[a.riesgo] > RIESGO_ORDEN[b.riesgo] ? a : b);
    const mayor = a.volumen_hm3 >= b.volumen_hm3 ? a : b, menor = mayor === a ? b : a;
    return {
      reconocida: true, sugerencias: sug,
      respuesta:
        `**${nombreLaguna(a)}** frente a **${nombreLaguna(b)}**:\n` +
        `- Riesgo: ${a.riesgo.toLowerCase()} vs ${b.riesgo.toLowerCase()}${masRiesgo ? ` → más alto en **${masRiesgo.nombre}**` : ' → mismo nivel'} [1]\n` +
        `- Volumen: **${mayor.nombre}** tiene ${(mayor.volumen_hm3 / Math.max(menor.volumen_hm3, 0.1)).toFixed(1)} veces más agua (${mayor.volumen_hm3} vs ${menor.volumen_hm3} hm³)\n` +
        `- Aguas abajo: ${a.poblado_amenazado} vs ${b.poblado_amenazado}\n` +
        `- Obras: ${a.tiene_obras ? 'sí' : 'no'} vs ${b.tiene_obras ? 'sí' : 'no'}`,
      fuentes: [{ n: 1, referencia: 'Catálogo de lagunas INAIGEM / ANA' }],
    };
  }

  // 3. Ficha de una laguna
  if (lagunas.length >= 1) {
    const f = fichaLaguna(lagunas[0]);
    return { reconocida: true, sugerencias: sugerenciasPara({ laguna: lagunas[0].nombre }), respuesta: f.texto, fuentes: [f.fuente] };
  }

  // 4. "Vivo en X" → lagunas que amenazan ese poblado
  const porPoblado = buscarPoblado(pregunta);
  if (porPoblado.length) {
    const lista = porPoblado.sort((a, b) => RIESGO_ORDEN[b.riesgo] - RIESGO_ORDEN[a.riesgo])
      .map((l) => `- **${nombreLaguna(l)}**: riesgo ${l.riesgo.toLowerCase()}, ${l.volumen_hm3} hm³, ${l.tiene_obras ? 'con obras' : 'sin obras'}`).join('\n');
    return { reconocida: true, sugerencias: sug, respuesta: `Aguas arriba de **${porPoblado[0].poblado_amenazado}** el catálogo registra [1]:\n${lista}`, fuentes: [{ n: 1, referencia: 'Catálogo de lagunas INAIGEM / ANA' }] };
  }

  // 5. Sin obras de seguridad
  if (tiene('sin obra', 'no tienen obra', 'no tiene obra', 'sin seguridad', 'sin proteccion')) {
    const lista = LAGUNAS_DESTACADAS.filter((l) => !l.tiene_obras && (!depto || l.departamento === depto))
      .sort((a, b) => RIESGO_ORDEN[b.riesgo] - RIESGO_ORDEN[a.riesgo]);
    return {
      reconocida: true, sugerencias: sug,
      respuesta: lista.length
        ? `Lagunas${depto ? ` de ${depto}` : ''} **sin obras de seguridad** registradas [1]:\n` + lista.map((l) => `- **${nombreLaguna(l)}** (${l.departamento}): riesgo ${l.riesgo.toLowerCase()}, amenaza a ${l.poblado_amenazado}`).join('\n')
        : `No encontré lagunas sin obras${depto ? ` en ${depto}` : ''} en el catálogo cargado.`,
      fuentes: [{ n: 1, referencia: METRICAS_PAIS.lagunas_riesgo.fuente }],
    };
  }

  // 6. Lagunas por nivel de riesgo (y departamento)
  if (tiene('riesgo', 'peligros', 'critic')) {
    const nivel = tiene('muy alto') ? 'Muy alto' : tiene(' alto') ? 'Alto' : null;
    const lista = LAGUNAS_DESTACADAS.filter((l) => (!depto || l.departamento === depto) && (nivel ? l.riesgo === nivel : RIESGO_ORDEN[l.riesgo] >= 3))
      .sort((a, b) => RIESGO_ORDEN[b.riesgo] - RIESGO_ORDEN[a.riesgo] || b.volumen_hm3 - a.volumen_hm3);
    if (lista.length) {
      return {
        reconocida: true, sugerencias: sug,
        respuesta: `Lagunas${depto ? ` de **${depto}**` : ''} con riesgo **${nivel ? nivel.toLowerCase() : 'alto o muy alto'}** (${lista.length}) [1]:\n` +
          lista.slice(0, 10).map((l) => `- **${nombreLaguna(l)}**${depto ? '' : ` (${l.departamento})`}: ${l.volumen_hm3} hm³, amenaza a ${l.poblado_amenazado}`).join('\n') +
          (lista.length > 10 ? `\n- …y ${lista.length - 10} más.` : ''),
        fuentes: [{ n: 1, referencia: METRICAS_PAIS.lagunas_riesgo.fuente, evidencia: METRICAS_PAIS.lagunas_riesgo.pagina }],
      };
    }
  }

  // 7. Departamento
  if (depto) {
    const d = DEPARTAMENTOS_RIESGO.find((x) => x.departamento === depto)!;
    return {
      reconocida: true, sugerencias: sugerenciasPara({ departamento: depto }),
      respuesta: d.total
        ? `**${depto}** tiene **${d.total} lagunas críticas**: ${d.muy_alto} de riesgo muy alto y ${d.alto} de riesgo alto [1].`
        : `El catálogo no registra lagunas críticas en **${depto}**. Eso no significa riesgo cero: puede no estar evaluado [1].`,
      fuentes: [{ n: 1, referencia: METRICAS_PAIS.lagunas_riesgo.fuente }],
    };
  }

  // 8. Cifras del país
  if (tiene('hielo', 'glaciar', 'deshielo', 'retroce')) {
    const h = METRICAS_PAIS.hielo_perdido;
    return {
      reconocida: true, sugerencias: sug,
      respuesta: `El Perú perdió el **${h.porcentaje} %** de su superficie glaciar entre ${h.periodo}: de ${formatoMiles(h.superficie_1962_km2)} km² a ${formatoMiles(h.superficie_2016_km2)} km² [1]. Al retroceder, el hielo deja nuevas lagunas que pueden desbordarse.`,
      fuentes: [{ n: 1, referencia: h.fuente, evidencia: h.pagina }],
    };
  }
  if (tiene('aluvion', 'desborde', 'historia', 'histor')) {
    const a = METRICAS_PAIS.aluviones_historicos;
    return {
      reconocida: true, sugerencias: sug,
      respuesta: `Desde ${a.primer_registro_ano} hay **${a.total_registrados} aluviones y desbordes** registrados en el Perú [1]. Entre los más graves: Huaraz en 1941 (laguna Palcacocha) y Yungay en 1970 (Huascarán).`,
      fuentes: [{ n: 1, referencia: a.fuente, evidencia: a.pagina }],
    };
  }
  if (tiene('mas agua', 'mas grande', 'mayor volumen')) {
    const l = [...LAGUNAS_DESTACADAS].sort((a, b) => b.volumen_hm3 - a.volumen_hm3)[0];
    const f = fichaLaguna(l);
    return { reconocida: true, sugerencias: sug, respuesta: `La laguna con más agua del catálogo es:\n\n${f.texto}`, fuentes: [f.fuente] };
  }
  if (tiene('valida', 'metodolog', 'ragas', 'fidelidad', 'informes', 'fuente')) {
    return {
      reconocida: true, sugerencias: sug,
      respuesta: 'ARQEN responde solo con lo que dicen **398 informes oficiales** del INAIGEM, la ANA y el SENAMHI. Cada respuesta se evalúa con RAGAS: **fidelidad** (no inventa), **relevancia** (responde lo pedido) y **precisión del contexto** (usa los fragmentos correctos). Los resultados están en la sección Metodología.',
      fuentes: [],
    };
  }

  // 9. No reconocida: honestidad + caminos útiles
  return {
    reconocida: false, sugerencias: sug.length ? sug : SUGERENCIAS_BASE,
    respuesta: 'Ahora mismo respondo **sin IA**, solo con los datos oficiales cargados, y esa pregunta no la puedo contestar con seguridad. Prueba preguntando por una laguna, un departamento o tu pueblo, o elige una sugerencia.',
    fuentes: [],
  };
}
