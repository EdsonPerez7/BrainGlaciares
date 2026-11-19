/**
 * Utilidades de seguridad para el renderizado en el navegador.
 *
 * Regla del proyecto: TODO dato que venga del backend, del LLM, de la URL
 * o del usuario pasa por `esc()` antes de interpolarse en un template HTML,
 * y toda URL dinámica pasa por `urlSegura()` antes de ir a un href.
 */

const MAPA_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;',
};

/** Escapa texto para insertarlo de forma segura dentro de HTML o atributos. */
export function esc(valor: unknown): string {
  if (valor === null || valor === undefined) return '';
  return String(valor).replace(/[&<>"'`]/g, (c) => MAPA_ESCAPE[c]);
}

/**
 * Devuelve la URL solo si es relativa al sitio o http(s).
 * Bloquea `javascript:`, `data:`, `vbscript:` y similares.
 */
export function urlSegura(url: unknown, respaldo = '#'): string {
  if (typeof url !== 'string' || !url.trim()) return respaldo;
  const limpia = url.trim();
  // Rutas internas: /buscar?id=..., #ancla, ?q=...
  if (/^(\/(?!\/)|#|\?)/.test(limpia)) return esc(limpia);
  try {
    const u = new URL(limpia, window.location.origin);
    if (u.protocol === 'http:' || u.protocol === 'https:') return esc(u.href);
  } catch {
    /* URL inválida */
  }
  return respaldo;
}

/** Limita un número a un rango (para parámetros que viajan al backend). */
export function acotar(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

/**
 * Markdown mínimo y SEGURO para respuestas del asistente:
 * primero escapa todo y luego aplica negritas, cursivas, viñetas y citas [n].
 * Así, aunque un documento del corpus contenga HTML malicioso
 * (inyección indirecta vía RAG), nunca se ejecuta.
 */
export function markdownSeguro(texto: string): string {
  return esc(texto)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-slate-700">$1</em>')
    .replace(
      /\[(\d{1,3})\]/g,
      '<button type="button" class="btn-cita-pill inline-flex items-center justify-center font-bold text-[11px] bg-sky-100 text-sky-800 rounded px-1.5 py-0.5 mx-0.5 hover:bg-sky-200 transition" data-cita="$1" aria-label="Ver fuente $1">[$1]</button>'
    )
    .split('\n')
    .map((l) => {
      const t = l.trim();
      if (t.startsWith('- ')) {
        return `<div class="flex items-start gap-2 my-1"><span class="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" aria-hidden="true"></span><span>${t.slice(2)}</span></div>`;
      }
      return t ? `<p class="my-1">${t}</p>` : '';
    })
    .join('');
}
