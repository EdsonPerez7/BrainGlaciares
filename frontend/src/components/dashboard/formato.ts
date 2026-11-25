/**
 * toLocaleString('es-PE') en Node (small-icu, sin datos completos de ICU) da
 * "13,829" en vez de "13 829": no es confiable en el build de Cloudflare Pages.
 * Por eso este dashboard usa un formateador propio con separador de espacio.
 */
export function formatoEs(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  const negativo = n < 0;
  const entero = Math.trunc(Math.abs(n)).toString();
  const conEspacios = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (negativo ? '-' : '') + conEspacios;
}
