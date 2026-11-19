/**
 * "El camino de un aluvión": puntos clave para el recorrido 3D real y el perfil de caída.
 * Lagunas: coordenadas del catálogo. Cumbres y poblados: ubicación aproximada (centro).
 */
export interface PuntoClave { nombre: string; lat: number; lng: number; alt: number }
export interface Camino { lagunaId: string; cumbre?: PuntoClave; pueblo?: PuntoClave }

export const CAMINOS: Record<string, Camino> = {
  '513': {
    lagunaId: '513',
    cumbre: { nombre: 'Nevado Hualcán', lat: -9.214, lng: -77.517, alt: 6122 },
    pueblo: { nombre: 'Carhuaz', lat: -9.282, lng: -77.645, alt: 2645 },
  },
  palcacocha: {
    lagunaId: 'palcacocha',
    cumbre: { nombre: 'Nevado Palcaraju', lat: -9.367, lng: -77.356, alt: 6274 },
    pueblo: { nombre: 'Huaraz', lat: -9.527, lng: -77.528, alt: 3052 },
  },
  paron: {
    lagunaId: 'paron',
    cumbre: { nombre: 'Nevado Huandoy', lat: -9.03, lng: -77.66, alt: 6395 },
    pueblo: { nombre: 'Caraz', lat: -9.048, lng: -77.81, alt: 2256 },
  },
};

/** Distancia en km entre dos puntos (fórmula del haversine) */
export function distanciaKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Rumbo en grados desde a hacia b (0 = norte) */
export function rumbo(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = Math.PI / 180;
  const y = Math.sin((b.lng - a.lng) * rad) * Math.cos(b.lat * rad);
  const x = Math.cos(a.lat * rad) * Math.sin(b.lat * rad) - Math.sin(a.lat * rad) * Math.cos(b.lat * rad) * Math.cos((b.lng - a.lng) * rad);
  return (Math.atan2(y, x) / rad + 360) % 360;
}
