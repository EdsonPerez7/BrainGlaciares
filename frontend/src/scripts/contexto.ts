/**
 * Contexto compartido de la página para el asistente único.
 * Cualquier componente informa dónde está la persona (sección, laguna, gráfico)
 * y el asistente adapta sus sugerencias. Sin dependencias, solo eventos del navegador.
 */
export interface Contexto {
  seccion?: string;
  laguna?: string;
  lagunaId?: string;
  departamento?: string;
  comparacion?: [string, string];
  grafico?: string;
  valor?: string;
}

const estado: Contexto = {};

export function obtenerContexto(): Contexto {
  return { ...estado };
}

export function fijarContexto(parcial: Contexto, reemplazar = false) {
  if (reemplazar) for (const k of Object.keys(estado)) delete (estado as any)[k];
  Object.assign(estado, parcial);
  window.dispatchEvent(new CustomEvent('arqen:contexto', { detail: obtenerContexto() }));
}

/** Abre el asistente (con contexto opcional y, si se quiere, una pregunta ya escrita). */
export function abrirAsistente(ctx?: Contexto, pregunta?: string, enviar = false) {
  if (ctx) fijarContexto(ctx, true);
  window.dispatchEvent(new CustomEvent('arqen:abrir', { detail: { pregunta, enviar } }));
}
