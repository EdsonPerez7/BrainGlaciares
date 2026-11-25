export interface Contexto {
  seccion?: string;
  laguna?: string;
  lagunaId?: string;
  departamento?: string;
  riesgo?: string;
  volumen?: number;
  tieneObras?: boolean;
  obrasDetalle?: string;
  pobladoAmenazado?: string;
  glaciarOrigen?: string;
  comparacion?: [string, string];
  grafico?: string;
  valor?: string;
}

const estado: Contexto = {};

export function obtenerContexto(): Contexto {
  return { ...estado };
}

export function fijarContexto(parcial: Contexto, reemplazar = false) {
  const lagunaAnterior = estado.lagunaId;
  if (reemplazar) {
    for (const k of Object.keys(estado)) delete (estado as any)[k];
  }
  Object.assign(estado, parcial);
  const actual = obtenerContexto();
  (window as any).__ARQEN_CTX__ = actual;
  window.dispatchEvent(
    new CustomEvent('arqen:contexto', {
      detail: { ...actual, cambioLaguna: Boolean(actual.lagunaId && actual.lagunaId !== lagunaAnterior) },
    })
  );
}

export function limpiarLagunaContexto() {
  delete estado.laguna;
  delete estado.lagunaId;
  delete estado.riesgo;
  delete estado.volumen;
  delete estado.tieneObras;
  delete estado.obrasDetalle;
  delete estado.pobladoAmenazado;
  delete estado.glaciarOrigen;
  const actual = obtenerContexto();
  (window as any).__ARQEN_CTX__ = actual;
  window.dispatchEvent(new CustomEvent('arqen:contexto', { detail: actual }));
}

export function abrirAsistente(ctx?: Contexto, pregunta?: string, enviar = false) {
  if (ctx) fijarContexto(ctx, true);
  window.dispatchEvent(new CustomEvent('arqen:abrir', { detail: { pregunta, enviar } }));
}