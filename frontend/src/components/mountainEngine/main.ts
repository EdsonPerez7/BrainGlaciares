import * as THREE from 'three';
import { DEFAULT_CONFIG, type MountainConfig } from './config';
import { TerrainGenerator, type MountainTerrainSystem } from './terrainGenerator';
import { createPolygonalMountainShader } from './mountainMaterials';
import { AtmosphereSystem } from './atmosphere';
import { DroneCameraController } from './cameraController';
import { GlacialLakeGenerator, type GlacialLakeSystem } from './glacialLakeGenerator';
import { GlacierGenerator, type GlacierSystem } from './glacierGenerator';
import { StreamGenerator, type StreamSystem } from './streamGenerator';
import { validateSceneGeometry } from './geometryValidator';
import { AnnotationSystem } from './annotationSystem';

export interface MountainStudioInstance {
  destroy: () => void;
  updateParam: <K extends keyof MountainConfig>(key: K, value: MountainConfig[K]) => void;
  getConfig: () => MountainConfig;
  regenerateTerrain: () => void;
  toggleAnnotations: (show?: boolean) => boolean;
}

export function initMountainEngine(
  canvas: HTMLCanvasElement,
  hudElement: HTMLElement | null,
  heroSectionEl: HTMLElement | null,
  customConfig?: Partial<MountainConfig>,
  annotationContainer?: HTMLElement | null
): MountainStudioInstance {
  const config: MountainConfig = { ...DEFAULT_CONFIG, ...customConfig };

  // 1. Renderizador WebGL
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;

  // 2. Escena y Atmósfera
  const scene = new THREE.Scene();
  const atmosphere = new AtmosphereSystem(scene, config);

  // 3. Generador de Terreno y Shader Baricéntrico
  const terrainShader = createPolygonalMountainShader(config);
  const generator = new TerrainGenerator(config);
  let terrainSystem: MountainTerrainSystem = generator.generate(terrainShader);

  scene.add(terrainSystem.mesh1);
  scene.add(terrainSystem.mesh2);

  // 4. Ecosistema Glaciar: Lagunas, Lenguas Glaciares y Red Hídrica de Deshielo
  // Todos acoplados milimétricamente al sistema centralizado getTerrainHeight
  let lakeGenerator = new GlacialLakeGenerator(config, terrainSystem.getBasins());
  let lakeSystem: GlacialLakeSystem = lakeGenerator.generate(terrainSystem.totalLength);
  scene.add(lakeSystem.mesh1);
  scene.add(lakeSystem.mesh2);

  let glacierGenerator = new GlacierGenerator(config, terrainSystem.getBasins(), terrainSystem.getTerrainHeight);
  let glacierSystem: GlacierSystem = glacierGenerator.generate(terrainSystem.totalLength);
  scene.add(glacierSystem.mesh1);
  scene.add(glacierSystem.mesh2);

  let streamGenerator = new StreamGenerator(config, terrainSystem.getBasins(), terrainSystem.getTerrainHeight);
  let streamSystem: StreamSystem = streamGenerator.generate(terrainSystem.totalLength);
  scene.add(streamSystem.mesh1);
  scene.add(streamSystem.mesh2);

  // 4.5. Sistema de Etiquetas Cartográficas 3D y Conexiones Hidrológicas Oficiales
  let annotationSystem: AnnotationSystem | null = null;
  if (annotationContainer) {
    annotationSystem = new AnnotationSystem(
      annotationContainer,
      terrainSystem.getBasins(),
      terrainSystem.totalLength,
      terrainSystem.getTerrainHeight
    );
    scene.add(annotationSystem.getConnectionGroup());
  }

  // Auditoría geométrica inicial
  validateSceneGeometry(terrainSystem, lakeSystem, glacierSystem, streamSystem);

  // 5. Controlador de Cámara Cinemática estilo Dron con Perspectiva Configurable
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const cameraController = new DroneCameraController(aspect, terrainSystem.totalLength, config);

  // 6. Bucle de Animación Continuo
  const clock = new THREE.Clock();
  let animationFrameId: number | null = null;
  let isTabVisible = !document.hidden;
  let isSectionInViewport = true;

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      cameraController.resize(w, h);
    }
  }

  function tick() {
    animationFrameId = requestAnimationFrame(tick);
    resize();

    const delta = Math.min(clock.getDelta(), 0.1);
    const elapsedTime = clock.getElapsedTime();

    // Actualizar animación de agua en lagunas y torrentes de deshielo
    lakeSystem.waterMaterial.uniforms.uTime.value = elapsedTime;
    streamSystem.streamMaterial.uniforms.uTime.value = elapsedTime;

    // Actualizar cámara
    cameraController.update(delta, terrainSystem.getElevationAt);

    // Reciclaje toroidal infinito sincronizado (Terreno + Lagunas + Glaciares + Red Hídrica)
    const currentZ = cameraController.getFlightZ();
    const L = terrainSystem.totalLength;
    const cycleCount = Math.floor((-currentZ) / L);
    const offsetZ = -cycleCount * L;

    terrainSystem.mesh1.position.z = -L / 2 + offsetZ;
    terrainSystem.mesh2.position.z = -L / 2 + offsetZ - L;

    lakeSystem.mesh1.position.z = -L / 2 + offsetZ;
    lakeSystem.mesh2.position.z = -L / 2 + offsetZ - L;

    glacierSystem.mesh1.position.z = -L / 2 + offsetZ;
    glacierSystem.mesh2.position.z = -L / 2 + offsetZ - L;

    streamSystem.mesh1.position.z = -L / 2 + offsetZ;
    streamSystem.mesh2.position.z = -L / 2 + offsetZ - L;

    // Actualizar etiquetas cartográficas y trazado hidrológico proyectado en tiempo real
    if (annotationSystem) {
      annotationSystem.getConnectionGroup().position.z = offsetZ;
      annotationSystem.update(cameraController.camera, canvas.clientWidth, canvas.clientHeight);
    }

    // Acompañar la bóveda celeste a la cámara y actualizar nubes dinámicas
    atmosphere.updateSkyPosition(cameraController.camera.position);
    atmosphere.updateTime(elapsedTime);

    // Actualizar HUD de telemetría de vuelo con escala altimétrica andina realista (5,400 - 5,900 m)
    if (hudElement) {
      const altitudAprox = Math.round(5100 + (cameraController.camera.position.y - 200) * 4.2);
      hudElement.textContent = `Vuelo en Rumbo Andino · Cota dinámica ${altitudAprox} m`;
    }

    renderer.render(scene, cameraController.camera);
  }

  function updateRunningState() {
    const shouldRun = isTabVisible && isSectionInViewport;
    if (shouldRun && animationFrameId === null) {
      clock.start();
      tick();
    } else if (!shouldRun && animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  const onVisibilityChange = () => {
    isTabVisible = !document.hidden;
    updateRunningState();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  let sectionObserver: IntersectionObserver | null = null;
  if (heroSectionEl && window.IntersectionObserver) {
    sectionObserver = new IntersectionObserver((entries) => {
      isSectionInViewport = entries[0].isIntersecting;
      updateRunningState();
    }, { threshold: 0.05 });
    sectionObserver.observe(heroSectionEl);
  }

  window.addEventListener('resize', resize);
  updateRunningState();

  // Función para regenerar el ecosistema completo (relieve + cuencas + lagunas + glaciares + ríos)
  function regenerate() {
    // 1. Limpieza de terreno anterior
    scene.remove(terrainSystem.mesh1);
    scene.remove(terrainSystem.mesh2);
    terrainSystem.mesh1.geometry.dispose();
    terrainSystem.mesh2.geometry.dispose();

    // 2. Limpieza de lagunas
    scene.remove(lakeSystem.mesh1);
    scene.remove(lakeSystem.mesh2);
    lakeSystem.mesh1.geometry.dispose();
    lakeSystem.mesh2.geometry.dispose();

    // 3. Limpieza de glaciares
    scene.remove(glacierSystem.mesh1);
    scene.remove(glacierSystem.mesh2);
    glacierSystem.mesh1.geometry.dispose();
    glacierSystem.mesh2.geometry.dispose();

    // 4. Limpieza de ríos y cauces
    scene.remove(streamSystem.mesh1);
    scene.remove(streamSystem.mesh2);
    streamSystem.mesh1.geometry.dispose();
    streamSystem.mesh2.geometry.dispose();

    // 5. Regeneración sincronizada
    generator.updateConfig(config);
    terrainSystem = generator.generate(terrainShader);
    scene.add(terrainSystem.mesh1);
    scene.add(terrainSystem.mesh2);

    lakeGenerator = new GlacialLakeGenerator(config, terrainSystem.getBasins());
    lakeSystem = lakeGenerator.generate(terrainSystem.totalLength);
    scene.add(lakeSystem.mesh1);
    scene.add(lakeSystem.mesh2);

    glacierGenerator = new GlacierGenerator(config, terrainSystem.getBasins(), terrainSystem.getTerrainHeight);
    glacierSystem = glacierGenerator.generate(terrainSystem.totalLength);
    scene.add(glacierSystem.mesh1);
    scene.add(glacierSystem.mesh2);

    streamGenerator = new StreamGenerator(config, terrainSystem.getBasins(), terrainSystem.getTerrainHeight);
    streamSystem = streamGenerator.generate(terrainSystem.totalLength);
    scene.add(streamSystem.mesh1);
    scene.add(streamSystem.mesh2);

    // 4.5. Regeneración del sistema de anotaciones y conexiones 3D
    if (annotationSystem) {
      scene.remove(annotationSystem.getConnectionGroup());
      annotationSystem.destroy();
      if (annotationContainer) {
        annotationSystem = new AnnotationSystem(
          annotationContainer,
          terrainSystem.getBasins(),
          terrainSystem.totalLength,
          terrainSystem.getTerrainHeight
        );
        scene.add(annotationSystem.getConnectionGroup());
      }
    }

    // Auditoría geométrica tras regeneración
    validateSceneGeometry(terrainSystem, lakeSystem, glacierSystem, streamSystem);
  }

  return {
    destroy: () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (sectionObserver) {
        sectionObserver.disconnect();
      }
      if (annotationSystem) {
        annotationSystem.destroy();
      }
      renderer.dispose();
    },
    updateParam: <K extends keyof MountainConfig>(key: K, value: MountainConfig[K]) => {
      config[key] = value;

      // Parámetros de Cámara y Perspectiva en tiempo real (cero lag)
      if (key === 'cameraFov') {
        cameraController.updateFov(value as number);
      } else if (
        key === 'cameraPitch' ||
        key === 'cameraYaw' ||
        key === 'cameraXOffset' ||
        key === 'flightAltitude' ||
        key === 'mouseParallax' ||
        key === 'flightSpeed'
      ) {
        // Se actualizan automáticamente en el siguiente tick a través de config
      }
      // Modos Visuales (Híbrido / Natural / Wireframe)
      else if (key === 'visualMode') {
        const modeInt = value === 'natural' ? 1 : value === 'wireframe' ? 2 : 0;
        terrainShader.uniforms.uVisualMode.value = modeInt;
        lakeSystem.waterMaterial.uniforms.uVisualMode.value = modeInt;
        glacierSystem.iceMaterial.uniforms.uVisualMode.value = modeInt;
        streamSystem.streamMaterial.uniforms.uVisualMode.value = modeInt;
      }
      // Modo Diagnóstico (Validación de acoplamiento topográfico)
      else if (key === 'diagnosticMode') {
        const diagInt = value ? 1 : 0;
        terrainShader.uniforms.uDiagnosticMode.value = diagInt;
        lakeSystem.waterMaterial.uniforms.uDiagnosticMode.value = diagInt;
        glacierSystem.iceMaterial.uniforms.uDiagnosticMode.value = diagInt;
        streamSystem.streamMaterial.uniforms.uDiagnosticMode.value = diagInt;
      }
      // Parámetros de Shader en tiempo real
      else if (key === 'normalSmoothness') {
        terrainShader.uniforms.uNormalSmoothness.value = value as number;
      } else if (key === 'snowCoverage') {
        terrainShader.uniforms.uSnowCoverage.value = value as number;
      } else if (key === 'rockExposure') {
        terrainShader.uniforms.uRockExposure.value = value as number;
      } else if (key === 'wireframeIntensity') {
        terrainShader.uniforms.uWireframeIntensity.value = value as number;
        lakeSystem.waterMaterial.uniforms.uWireframeIntensity.value = (value as number) * 0.45;
        glacierSystem.iceMaterial.uniforms.uWireframeIntensity.value = (value as number) * 0.7;
        streamSystem.streamMaterial.uniforms.uWireframeIntensity.value = (value as number) * 0.4;
      } else if (key === 'wireframeLineWidth') {
        terrainShader.uniforms.uWireframeWidth.value = value as number;
        lakeSystem.waterMaterial.uniforms.uWireframeWidth.value = value as number;
        glacierSystem.iceMaterial.uniforms.uWireframeWidth.value = value as number;
        streamSystem.streamMaterial.uniforms.uWireframeWidth.value = value as number;
      } else if (key === 'wireframeColor') {
        terrainShader.uniforms.uWireframeColor.value.set(value as string);
        lakeSystem.waterMaterial.uniforms.uWireframeColor.value.set(value as string);
        glacierSystem.iceMaterial.uniforms.uWireframeColor.value.set(value as string);
        streamSystem.streamMaterial.uniforms.uWireframeColor.value.set(value as string);
      } else if (key === 'sunIntensity') {
        terrainShader.uniforms.uSunIntensity.value = value as number;
        lakeSystem.waterMaterial.uniforms.uSunIntensity.value = value as number;
        glacierSystem.iceMaterial.uniforms.uSunIntensity.value = value as number;
        streamSystem.streamMaterial.uniforms.uSunIntensity.value = value as number;
        atmosphere.updateConfig(scene, config);
      } else if (key === 'fogDensity') {
        terrainShader.uniforms.fogDensity.value = value as number;
        lakeSystem.waterMaterial.uniforms.fogDensity.value = value as number;
        glacierSystem.iceMaterial.uniforms.fogDensity.value = value as number;
        streamSystem.streamMaterial.uniforms.fogDensity.value = value as number;
        atmosphere.updateConfig(scene, config);
      } else if (
        key === 'cloudCoverage' ||
        key === 'cloudSpeed' ||
        key === 'fogColor' ||
        key === 'skyTopColor' ||
        key === 'skyBottomColor'
      ) {
        atmosphere.updateConfig(scene, config);
      } else if (key === 'snowColor') {
        terrainShader.uniforms.uSnowColor.value.set(value as string);
      } else if (key === 'rockColor') {
        terrainShader.uniforms.uRockColor.value.set(value as string);
      } else if (key === 'talusColor') {
        terrainShader.uniforms.uTalusColor.value.set(value as string);
      } else if (key === 'lakeWaterColor') {
        lakeSystem.waterMaterial.uniforms.uWaterColor.value.set(value as string);
        streamSystem.streamMaterial.uniforms.uDeepStreamColor.value.set(value as string);
      } else if (key === 'lakeDeepWaterColor') {
        lakeSystem.waterMaterial.uniforms.uDeepWaterColor.value.set(value as string);
      } else if (key === 'glacierIceColor') {
        glacierSystem.iceMaterial.uniforms.uIceColor.value.set(value as string);
      }
      // Parámetros morfológicos que requieren regenerar geometría
      else if (key === 'maxAltitude') {
        terrainShader.uniforms.uMaxAltitude.value = value as number;
        regenerate();
      } else if (
        key === 'mountainDensity' ||
        key === 'ridgeIntensity' ||
        key === 'roughness' ||
        key === 'domainWarp' ||
        key === 'seed'
      ) {
        regenerate();
      }
    },
    getConfig: () => ({ ...config }),
    regenerateTerrain: regenerate,
    toggleAnnotations: (show?: boolean) => {
      if (!annotationSystem) return false;
      if (show !== undefined) {
        annotationSystem.setEnabled(show);
        return show;
      }
      return annotationSystem.toggle();
    }
  };
}
