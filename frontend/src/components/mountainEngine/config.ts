// config.ts: Configuración centralizada reactiva del motor de cordilleras procedurales

export interface MountainConfig {
  // Geometría y relieve
  seed: number;
  maxAltitude: number; // Altura de los picos dominantes
  mountainDensity: number; // Frecuencia espacial de elevaciones
  ridgeIntensity: number; // Afilado y presencia de crestas ridged
  roughness: number; // FBM y detalle fino de rugosidad
  domainWarp: number; // Distorsión orográfica y pliegues geológicos
  
  // Refinamiento de Superficie y Normales
  normalSmoothness: number; // Mezcla entre normales suaves y facetas (0.0 = faceteado, 1.0 = suave, default 0.76)
  snowCoverage: number; // Cobertura y cota de nieve (0.5 a 1.5, default 1.0)
  rockExposure: number; // Umbral de afloramiento rocoso en laderas escarpadas (0.5 a 1.5, default 1.0)

  // Wireframe poligonal estilizado (Referencia visual)
  wireframeIntensity: number; // Opacidad del trazado wireframe (0.0 a 1.0)
  wireframeColor: string; // Color de las aristas poligonales
  wireframeLineWidth: number; // Grosor relativo
  
  // Paleta de color y sombreado GLSL
  snowColor: string; // Blanco nieve puro en cumbres iluminadas
  iceColor: string; // Azul acero / gris glaciar
  rockColor: string; // Gris roca mineral en pendientes pronunciadas
  talusColor: string; // Morrena y talud pedregoso intermedio
  shadowColor: string; // Sombra azul fría (sin negros absolutos)
  
  // Atmósfera e Iluminación
  fogDensity: number; // Densidad de niebla de profundidad
  fogColor: string; // Tono de la bruma diurna
  skyTopColor: string; // Azul cenital andino
  skyBottomColor: string; // Celeste horizonte
  sunIntensity: number; // Potencia del sol lateral
  cloudCoverage: number; // Cobertura de nubes en el cielo (0.0 a 1.0)
  cloudSpeed: number; // Velocidad de deriva de las nubes
  
  // Cinemática de vuelo sobre el macizo
  flightSpeed: number; // Velocidad de avance continuo
  flightAltitude: number; // Altura de crucero siempre por encima de los nevados
  flightAngle: number; // Inclinación diagonal del recorrido
  lookAheadDist: number; // Distancia de punto focal hacia adelante
  
  // Controles de Perspectiva de la Vista
  cameraPitch: number; // Inclinación vertical en grados
  cameraYaw: number; // Rotación horizontal en grados
  cameraFov: number; // Campo de visión angular
  cameraXOffset: number; // Posición lateral de la trayectoria
  mouseParallax: number; // Desactivado (0)

  // Ecosistema Glaciar (Lagunas y Glaciares de Ladera)
  lakeCount: number; // Número de cuencas de lagunas principales en el ciclo
  lakeWaterColor: string; // Tono turquesa glaciar lechoso en orillas
  lakeDeepWaterColor: string; // Azul petróleo profundo en fosas
  glacierIceColor: string; // Tono azul hielo de los glaciares
  glacierSnowColor: string; // Nieve virgen de acumulación

  // Modos Visuales (Híbrido / Natural / Wireframe)
  visualMode: 'hybrid' | 'natural' | 'wireframe';
  diagnosticMode: boolean;
}

export const DEFAULT_CONFIG: MountainConfig = {
  seed: 48921,
  maxAltitude: 350.0,
  mountainDensity: 0.0032,
  ridgeIntensity: 2.4,
  roughness: 0.1,
  domainWarp: 45.0,

  // Refinamiento de Superficie y Normales
  normalSmoothness: 1.0, // Suavizado continuo total (eliminando facetas triangulares)
  snowCoverage: 0.8,
  rockExposure: 1.8,
  
  // Wireframe sutil y elegante
  wireframeIntensity: 0.34,
  wireframeColor: '#5eead4',
  wireframeLineWidth: 1.0,
  
  // Paleta mineral andina auténtica ("marroncito con blanco", cero negros)
  snowColor: '#ffffff',
  iceColor: '#93c5fd',
  rockColor: '#6c432b',
  talusColor: '#523c2e',
  shadowColor: '#364d63',
  
  // Atmósfera diurna andina con cielo celeste y nubes
  fogDensity: 0.00096,
  fogColor: '#93c5fd',
  skyTopColor: '#1d4ed8',
  skyBottomColor: '#7dd3fc',
  sunIntensity: 2.6,
  cloudCoverage: 0.46,
  cloudSpeed: 0.06,
  
  // Vuelo Estable calibrado por el usuario
  flightSpeed: 80.0,
  flightAltitude: 340.0,
  flightAngle: 0.38,
  lookAheadDist: 340.0,
  
  // Perspectiva calibrada por el usuario
  cameraPitch: 30.0,
  cameraYaw: -30.0,
  cameraFov: 95.0,
  cameraXOffset: 64.0,
  mouseParallax: 0.0,

  // Ecosistema Glaciar
  lakeCount: 7,
  lakeWaterColor: '#06b6d4',
  lakeDeepWaterColor: '#041e2b',
  glacierIceColor: '#38bdf8',
  glacierSnowColor: '#f0f9ff',

  // Modo visual predeterminado y diagnóstico
  visualMode: 'natural',
  diagnosticMode: false
};
