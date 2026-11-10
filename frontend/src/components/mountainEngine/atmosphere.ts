// atmosphere.ts: Iluminación diurna alpina, cielo celeste andino y nubes procedurales dinámicas
import * as THREE from 'three';
import { type MountainConfig } from './config';

export class AtmosphereSystem {
  public skyMesh: THREE.Mesh;
  public sunLight: THREE.DirectionalLight;
  public fillLight: THREE.DirectionalLight;
  public hemiLight: THREE.HemisphereLight;
  private skyMaterial: THREE.ShaderMaterial;

  constructor(scene: THREE.Scene, config: MountainConfig) {
    // 1. Niebla Atmosférica Diurna de Profundidad
    const fogColor = new THREE.Color(config.fogColor);
    scene.background = fogColor;
    scene.fog = new THREE.FogExp2(fogColor, config.fogDensity);

    // 2. Bóveda Celeste con degradado andino diurno y nubes procedurales en movimiento
    const vertexSky = `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentSky = `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      uniform float uTime;
      uniform float uCloudCoverage;
      uniform float uCloudSpeed;
      varying vec3 vWorldPosition;

      // Generador de ruido pseudo-aleatorio para nubes andinas
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      // FBM de 5 octavas para volumen y esponjosidad de cúmulos
      float cloudFBM(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.52), sin(0.52), -sin(0.52), cos(0.52));
        for (int i = 0; i < 5; ++i) {
          v += a * noise(p);
          p = rot * p * 2.05 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec3 dir = normalize(vWorldPosition);
        float h = max(dir.y + offset * 0.001, 0.0);
        
        // Degradado de cielo andino diurno: celeste horizonte hacia azul cobalto cenital
        vec3 skyGradient = mix(bottomColor, topColor, pow(h, exponent));

        // Proyección planar de nubes sobre el hemisferio superior
        vec3 finalColor = skyGradient;

        if (dir.y > 0.02) {
          // Coordenadas proyectadas en plano de nubes a gran altitud
          vec2 windOffset = vec2(uTime * uCloudSpeed * 0.12, uTime * uCloudSpeed * 0.04);
          vec2 cloudUV = (dir.xz / max(dir.y, 0.08)) * 0.55 + windOffset;

          // Dos capas de ruido: macro cúmulos y micro filamentos cirros
          float macro = cloudFBM(cloudUV * 0.7);
          float micro = cloudFBM(cloudUV * 1.8 + vec2(12.4, -8.7));
          float cloudDensity = macro * 0.75 + micro * 0.25;

          // Umbral de cobertura ("en unas zonas nubes y en otras no")
          float threshold = 1.0 - uCloudCoverage;
          float cloudMask = smoothstep(threshold, threshold + 0.28, cloudDensity);

          // Atenuación suave en el horizonte para fundir con la niebla lejana
          float horizonFade = smoothstep(0.04, 0.32, dir.y);
          cloudMask *= horizonFade;

          // Iluminación de nubes: borde superior blanco brillante con base azulada suave
          vec3 cloudSun = vec3(1.0, 1.0, 0.98);
          vec3 cloudShadow = mix(vec3(0.72, 0.82, 0.92), bottomColor, 0.40);
          vec3 cloudColor = mix(cloudShadow, cloudSun, smoothstep(threshold + 0.05, threshold + 0.32, cloudDensity));

          finalColor = mix(finalColor, cloudColor, cloudMask * 0.88);
        }

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const skyGeo = new THREE.SphereGeometry(3400, 32, 16);
    this.skyMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexSky,
      fragmentShader: fragmentSky,
      uniforms: {
        topColor: { value: new THREE.Color(config.skyTopColor) },
        bottomColor: { value: new THREE.Color(config.skyBottomColor) },
        offset: { value: 18.0 },
        exponent: { value: 0.65 },
        uTime: { value: 0.0 },
        uCloudCoverage: { value: config.cloudCoverage },
        uCloudSpeed: { value: config.cloudSpeed }
      },
      side: THREE.BackSide,
      depthWrite: false
    });

    this.skyMesh = new THREE.Mesh(skyGeo, this.skyMaterial);
    scene.add(this.skyMesh);

    // 3. Iluminación Diurna Andina
    // Luz hemisférica: cielo celeste radiante arriba y reflejo cálido de la roca marrón abajo
    this.hemiLight = new THREE.HemisphereLight('#bae6fd', '#78350f', 1.85);
    scene.add(this.hemiLight);

    // Sol alpino diurno de alta montaña (luz cálida potente)
    this.sunLight = new THREE.DirectionalLight('#fffbeb', config.sunIntensity);
    this.sunLight.position.set(-380, 520, -260);
    scene.add(this.sunLight);

    // Luz secundaria fría difusa reflejada por los neveros y la atmósfera
    this.fillLight = new THREE.DirectionalLight('#93c5fd', 1.35);
    this.fillLight.position.set(300, 240, 260);
    scene.add(this.fillLight);
  }

  public updateTime(elapsedTime: number) {
    this.skyMaterial.uniforms.uTime.value = elapsedTime;
  }

  public updateSkyPosition(camPos: THREE.Vector3) {
    this.skyMesh.position.copy(camPos);
  }

  public updateConfig(scene: THREE.Scene, config: MountainConfig) {
    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      scene.fog.density = config.fogDensity;
      scene.fog.color.set(config.fogColor);
      scene.background = scene.fog.color;
    }
    this.sunLight.intensity = config.sunIntensity;
    this.skyMaterial.uniforms.topColor.value.set(config.skyTopColor);
    this.skyMaterial.uniforms.bottomColor.value.set(config.skyBottomColor);
    this.skyMaterial.uniforms.uCloudCoverage.value = config.cloudCoverage;
    this.skyMaterial.uniforms.uCloudSpeed.value = config.cloudSpeed;
  }
}
