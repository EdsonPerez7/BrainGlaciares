/**
 * Recorrido 3D de la portada: tres paradas que cuentan una historia
 * (lo que protegemos → lo que ya ocurrió → quiénes viven aguas abajo).
 * Coordenadas de las lagunas: catálogo de metrics.data.ts. Cumbres: aproximadas.
 */

export interface ParadaRecorrido {
  id: string;            // id de la laguna en LAGUNAS_DESTACADAS
  titulo: string;        // corto, para la barra del recorrido
  mensaje: string;       // una frase, para la tarjeta
  lat: number;
  lng: number;
  alt: number;           // m s.n.m. del objetivo
  rumbo: number;         // grados, hacia dónde mira la cámara (0 = norte)
  inclinacion: number;   // grados, negativo = mirando hacia abajo
  distancia: number;     // metros desde el objetivo
}

export const PARADAS: ParadaRecorrido[] = [
  {
    id: 'paron', titulo: 'Parón: lo que protegemos',
    mensaje: 'La laguna más grande de la Cordillera Blanca, a los pies del Artesonraju.',
    lat: -8.9983, lng: -77.6833, alt: 4185, rumbo: 78, inclinacion: -16, distancia: 9500,
  },
  {
    id: '513', titulo: 'Laguna 513: ya ocurrió',
    mensaje: 'En 2010 un bloque de hielo del Hualcán cayó aquí y provocó un aluvión.',
    lat: -9.2133, lng: -77.5511, alt: 4428, rumbo: 72, inclinacion: -20, distancia: 8500,
  },
  {
    id: 'palcacocha', titulo: 'Palcacocha: sobre Huaraz',
    mensaje: 'Aguas abajo está Huaraz. En 1941 un aluvión de esta laguna arrasó la ciudad.',
    lat: -9.3986, lng: -77.3802, alt: 4566, rumbo: 228, inclinacion: -18, distancia: 11000,
  },
];

export interface MarcaMapa {
  nombre: string;
  tipo: 'cumbre' | 'laguna' | 'ciudad';
  lat: number;
  lng: number;
  alt: number;
  dato?: string;
  riesgo?: string;
}

export const MARCAS: MarcaMapa[] = [
  { nombre: 'Huascarán', tipo: 'cumbre', lat: -9.1217, lng: -77.6042, alt: 6768, dato: '6 768 m' },
  { nombre: 'Artesonraju', tipo: 'cumbre', lat: -8.958, lng: -77.635, alt: 6025, dato: '6 025 m' },
  { nombre: 'Hualcán', tipo: 'cumbre', lat: -9.214, lng: -77.517, alt: 6122, dato: '6 122 m' },
  { nombre: 'Laguna Parón', tipo: 'laguna', lat: -8.9983, lng: -77.6833, alt: 4185, riesgo: 'Muy alto' },
  { nombre: 'Laguna 513', tipo: 'laguna', lat: -9.2133, lng: -77.5511, alt: 4428, riesgo: 'Alto' },
  { nombre: 'Palcacocha', tipo: 'laguna', lat: -9.3986, lng: -77.3802, alt: 4566, riesgo: 'Muy alto' },
  { nombre: 'Huaraz', tipo: 'ciudad', lat: -9.527, lng: -77.528, alt: 3052, dato: 'ciudad' },
  { nombre: 'Carhuaz', tipo: 'ciudad', lat: -9.282, lng: -77.645, alt: 2645, dato: 'ciudad' },
  { nombre: 'Caraz', tipo: 'ciudad', lat: -9.048, lng: -77.81, alt: 2256, dato: 'ciudad' },
];

/** Piscina olímpica: 50 × 25 × 2 m = 2 500 m³ */
export function piscinasOlimpicas(volumenHm3: number): number {
  return Math.round((volumenHm3 * 1_000_000) / 2500);
}

export function formatoMiles(n: number): string {
  return n.toLocaleString('es-PE');
}
