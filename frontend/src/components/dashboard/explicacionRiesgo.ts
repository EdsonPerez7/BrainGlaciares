/**
 * Genera la explicación de "catálogo vs. departamento asignado" a partir de
 * los números que REALMENTE se están mostrando (en vivo o de respaldo), para
 * que el texto nunca contradiga al encabezado — nunca se escribe "22" a mano
 * si lo que se ve en pantalla es otro número.
 */
export function explicarCatalogoRiesgo(nCatalogo: number, nConDepto: number): string {
  if (nCatalogo <= 0) {
    return 'Sin datos del catálogo todavía.';
  }
  if (nCatalogo === nConDepto) {
    return `Las ${nCatalogo} lagunas Alto/Muy alto de este catálogo tienen departamento asignado en el desglose.`;
  }
  const diferencia = nCatalogo - nConDepto;
  if (nCatalogo === 22 && nConDepto === 19) {
    return `<b>¿Por qué 22 y no 19?</b> <code>nodos.csv</code> tiene 22 lagunas con nivel Alto o Muy alto, pero 2 son el mismo registro bajo dos IDs distintos
      (<code>A-10</code> aparece como <code>a_10</code> y <code>a10</code>; <code>A-40</code> como <code>a_40</code> y <code>a40</code>), y el backend excluye
      <code>A-40</code> del desglose por departamento a propósito, con el comentario "laguna en formación monitoreada, no incluida en el inventario consolidado
      de 19" (<code>backend/api.py</code>, función <code>_calcular_departamentos_riesgo</code>). Las otras 19 sí quedan contadas, incluida Taullicocha
      (asignada a Áncash por una lista de excepciones).`;
  }
  return `<b>¿Por qué ${nCatalogo} y no ${nConDepto}?</b> Este catálogo tiene ${nCatalogo} lagunas Alto/Muy alto, pero el desglose por departamento solo le
    asigna departamento a ${nConDepto}: ${diferencia} ${diferencia === 1 ? 'queda' : 'quedan'} fuera de ese desglose (depende de si se está usando el catálogo
    en vivo o el respaldo local, que no son exactamente el mismo conjunto de lagunas).`;
}
