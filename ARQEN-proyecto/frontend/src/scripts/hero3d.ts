/**
 * Escena 3D real de la Cordillera Blanca con Cesium.
 * - Relieve real (Cesium World Terrain) + imagen satelital.
 * - Luz según la hora local de Huaraz (día, hora azul o noche con estrellas).
 * - Se carga SOLO cuando se pide (import dinámico): no pesa en la carga inicial.
 * - Si algo falla (sin token, sin red, sin WebGL) devuelve null y la portada
 *   se queda con su póster ilustrado: nunca se rompe.
 */
import type { ParadaRecorrido, MarcaMapa } from '../config/recorrido.data';

export type FaseLuz = 'dia' | 'hora-azul' | 'noche';

export interface Escena3D {
  volarA(p: ParadaRecorrido, segundos?: number): void;
  /** Alturas reales del terreno a lo largo de una ruta (para el perfil de caída) */
  perfilTerreno(ruta: { lat: number; lng: number }[], muestras: number): Promise<number[] | null>;
  alInteractuar(cb: () => void): void;
  destruir(): void;
}

export function faseDeLuz(fecha = new Date()): FaseLuz {
  // Hora de Huaraz (UTC-5, sin horario de verano)
  const h = (fecha.getUTCHours() - 5 + 24) % 24 + fecha.getUTCMinutes() / 60;
  if (h >= 6.5 && h < 17.5) return 'dia';
  if ((h >= 17.5 && h < 19) || (h >= 5.5 && h < 6.5)) return 'hora-azul';
  return 'noche';
}

export function soportaWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export async function iniciarEscena3D(
  contenedor: HTMLElement,
  capaMarcas: HTMLElement,
  marcas: MarcaMapa[],
  alEstarLista: () => void,
): Promise<Escena3D | null> {
  const token = import.meta.env.PUBLIC_CESIUM_TOKEN;
  if (!token || !soportaWebGL()) return null;

  (window as any).CESIUM_BASE_URL = '/cesium/';
  const Cesium = await import('cesium');
  await import('cesium/Build/Cesium/Widgets/widgets.css');

  Cesium.Ion.defaultAccessToken = token;

  // Créditos de datos visibles pero discretos (obligatorio por licencia)
  const creditos = document.createElement('div');
  creditos.className = 'arqen-creditos-3d';

  let viewer: InstanceType<typeof Cesium.Viewer>;
  try {
    viewer = new Cesium.Viewer(contenedor, {
      terrain: Cesium.Terrain.fromWorldTerrain({ requestWaterMask: false, requestVertexNormals: true }),
      baseLayer: Cesium.ImageryLayer.fromWorldImagery({}),
      animation: false, timeline: false, baseLayerPicker: false, geocoder: false,
      homeButton: false, sceneModePicker: false, navigationHelpButton: false,
      fullscreenButton: false, infoBox: false, selectionIndicator: false,
      vrButton: false, projectionPicker: false, creditContainer: creditos,
      requestRenderMode: true, maximumRenderTimeChange: Infinity,
      msaaSamples: 4,
    });
  } catch {
    return null;
  }

  contenedor.appendChild(creditos);

  const scene = viewer.scene;
  const globe = scene.globe;

  // ---------- Luz según la hora local ----------
  const fase = faseDeLuz();
  viewer.clock.currentTime = Cesium.JulianDate.now();
  viewer.clock.shouldAnimate = false;
  globe.enableLighting = true;
  globe.depthTestAgainstTerrain = true;
  globe.maximumScreenSpaceError = 1.6;
  scene.fog.enabled = true;
  scene.fog.density = 0.00012;

  const centro = Cesium.Cartesian3.fromDegrees(-77.55, -9.2, 4500);
  const enu = Cesium.Transforms.eastNorthUpToFixedFrame(centro);
  const rot = Cesium.Matrix4.getMatrix3(enu, new Cesium.Matrix3());
  const dirLocal = new Cesium.Cartesian3(0.78, -0.25, -0.55); // luz rasante desde el oeste: realza el relieve
  const dir = Cesium.Cartesian3.normalize(Cesium.Matrix3.multiplyByVector(rot, dirLocal, new Cesium.Cartesian3()), new Cesium.Cartesian3());

  const capa = viewer.imageryLayers.get(0);
  if (fase === 'noche') {
    scene.light = new Cesium.DirectionalLight({ direction: dir, color: Cesium.Color.fromCssColorString('#9cc3ff'), intensity: 1.6 });
    capa.brightness = 0.62; capa.contrast = 1.25; capa.saturation = 0.45; capa.hue = 0.04; capa.gamma = 1.1;
  } else if (fase === 'hora-azul') {
    scene.light = new Cesium.DirectionalLight({ direction: dir, color: Cesium.Color.fromCssColorString('#ffc9a8'), intensity: 2.0 });
    capa.brightness = 0.82; capa.contrast = 1.15; capa.saturation = 0.8;
  } else {
    scene.light = new Cesium.DirectionalLight({ direction: dir, color: Cesium.Color.WHITE, intensity: 2.6 });
    capa.brightness = 1.02; capa.contrast = 1.08; capa.saturation = 1.05;
  }

  // ---------- Marcas HTML de cristal sobre el relieve ----------
  const posiciones = marcas.map((m) => Cesium.Cartesian3.fromDegrees(m.lng, m.lat, m.alt + 40));
  const elementos = marcas.map((m) => {
    const el = document.createElement('div');
    el.className = `arqen-marca arqen-marca-${m.tipo}`;
    el.innerHTML = `<i></i><b></b>${m.riesgo || m.dato ? '<span></span>' : ''}`;
    (el.querySelector('b') as HTMLElement).textContent = m.nombre;
    const extra = el.querySelector('span');
    if (extra) extra.textContent = m.riesgo ? `Riesgo ${m.riesgo.toLowerCase()}` : (m.dato || '');
    capaMarcas.appendChild(el);
    return el;
  });

  const escratch = new Cesium.Cartesian2();
  function actualizarMarcas() {
    const cam = scene.camera.positionWC;
    const ancho = contenedor.clientWidth, alto = contenedor.clientHeight;
    posiciones.forEach((pos, i) => {
      const el = elementos[i];
      const dist = Cesium.Cartesian3.distance(cam, pos);
      const pantalla = Cesium.SceneTransforms.worldToWindowCoordinates(scene, pos, escratch);
      const visible = !!pantalla && dist < 42000 && pantalla.x > 40 && pantalla.x < ancho - 40 && pantalla.y > 60 && pantalla.y < alto - 90
        && Cesium.Cartesian3.dot(Cesium.Cartesian3.subtract(pos, cam, new Cesium.Cartesian3()), scene.camera.directionWC) > 0;
      el.style.opacity = visible ? '1' : '0';
      if (visible && pantalla) el.style.transform = `translate(${pantalla.x}px, ${pantalla.y}px) translate(-50%, -100%)`;
    });
  }
  scene.postRender.addEventListener(actualizarMarcas);

  // ---------- Aparición suave cuando el relieve terminó de cargar ----------
  let listo = false;
  globe.tileLoadProgressEvent.addEventListener((pendientes: number) => {
    if (!listo && pendientes === 0 && globe.tilesLoaded) {
      listo = true;
      alEstarLista();
    }
  });
  // Si a los 20 s no cargó (red lenta o token inválido), se queda el póster
  setTimeout(() => { if (!listo) contenedor.dataset.lento = 'true'; }, 20000);

  // ---------- Interacción del usuario ----------
  const callbacks: Array<() => void> = [];
  const avisar = () => callbacks.forEach((cb) => cb());
  viewer.canvas.addEventListener('pointerdown', avisar);
  viewer.canvas.addEventListener('wheel', avisar, { passive: true });

  return {
    volarA(p, segundos = 5) {
      const objetivo = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(p.lng, p.lat, p.alt), 400);
      viewer.camera.flyToBoundingSphere(objetivo, {
        offset: new Cesium.HeadingPitchRange(
          Cesium.Math.toRadians(p.rumbo), Cesium.Math.toRadians(p.inclinacion), p.distancia),
        duration: segundos,
        easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
      });
      scene.requestRender();
    },
    alInteractuar(cb) { callbacks.push(cb); },
    async perfilTerreno(ruta, muestras) {
      try {
        // Puntos repartidos a lo largo de la ruta, proporcionales a la distancia de cada tramo
        const tramos = ruta.slice(1).map((p, i) => Cesium.Cartesian3.distance(
          Cesium.Cartesian3.fromDegrees(ruta[i].lng, ruta[i].lat), Cesium.Cartesian3.fromDegrees(p.lng, p.lat)));
        const total = tramos.reduce((a, b) => a + b, 0);
        const puntos: InstanceType<typeof Cesium.Cartographic>[] = [];
        for (let k = 0; k < muestras; k++) {
          let d = (k / (muestras - 1)) * total, i = 0;
          while (i < tramos.length - 1 && d > tramos[i]) { d -= tramos[i]; i++; }
          const t = tramos[i] ? d / tramos[i] : 0;
          puntos.push(Cesium.Cartographic.fromDegrees(
            ruta[i].lng + (ruta[i + 1].lng - ruta[i].lng) * t, ruta[i].lat + (ruta[i + 1].lat - ruta[i].lat) * t));
        }
        const res = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, puntos);
        return res.map((c) => c.height ?? 0);
      } catch {
        return null;
      }
    },
    destruir() { viewer.destroy(); elementos.forEach((e) => e.remove()); },
  };
}
