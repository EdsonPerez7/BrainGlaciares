// mountainMaterials.ts: Shader GLSL con sombreado de alta montaña y Wireframe topográfico baricéntrico integrado
import * as THREE from 'three';
import { type MountainConfig } from './config';

/**
 * Prepara una geometría BufferGeometry no indexada con coordenadas baricéntricas
 * para el trazado de wireframe fino de 1px en el fragment shader sin z-fighting
 */
export function setupBarycentricCoordinates(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  // Asegurar que las normales suaves continuas estén calculadas mientras la geometría está indexada
  if (!geometry.attributes.normal) {
    geometry.computeVertexNormals();
  }
  const nonIndexed = geometry.toNonIndexed();
  const count = nonIndexed.attributes.position.count;
  const barycentrics = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 3) {
    barycentrics[i * 3 + 0] = 1;
    barycentrics[i * 3 + 1] = 0;
    barycentrics[i * 3 + 2] = 0;

    barycentrics[(i + 1) * 3 + 0] = 0;
    barycentrics[(i + 1) * 3 + 1] = 1;
    barycentrics[(i + 1) * 3 + 2] = 0;

    barycentrics[(i + 2) * 3 + 0] = 0;
    barycentrics[(i + 2) * 3 + 1] = 0;
    barycentrics[(i + 2) * 3 + 2] = 1;
  }

  nonIndexed.setAttribute('aBarycentric', new THREE.BufferAttribute(barycentrics, 3));
  // NO llamar a nonIndexed.computeVertexNormals() aquí, porque destruiría las normales suaves continuas
  return nonIndexed;
}

/**
 * Crea el ShaderMaterial de cordillera poligonal con wireframe estilizado
 */
export function createPolygonalMountainShader(config: MountainConfig): THREE.ShaderMaterial {
  const uniforms = {
    uSunDirection: { value: new THREE.Vector3(-0.55, 0.65, -0.45).normalize() },
    uSunColor: { value: new THREE.Color('#fff7ed') },
    uSunIntensity: { value: config.sunIntensity },
    
    // Paleta glaciar cinematográfica (cero negros)
    uSnowColor: { value: new THREE.Color(config.snowColor) },
    uIceColor: { value: new THREE.Color(config.iceColor) },
    uRockColor: { value: new THREE.Color(config.rockColor) },
    uTalusColor: { value: new THREE.Color(config.talusColor) },
    uShadowColor: { value: new THREE.Color(config.shadowColor) },
    
    // Controles de Superficie y Normales
    uNormalSmoothness: { value: config.normalSmoothness },
    uSnowCoverage: { value: config.snowCoverage },
    uRockExposure: { value: config.rockExposure },

    // Wireframe y Modos Visuales
    uWireframeColor: { value: new THREE.Color(config.wireframeColor) },
    uWireframeIntensity: { value: config.wireframeIntensity },
    uWireframeWidth: { value: config.wireframeLineWidth },
    uVisualMode: { value: config.visualMode === 'natural' ? 1 : config.visualMode === 'wireframe' ? 2 : 0 },
    uDiagnosticMode: { value: config.diagnosticMode ? 1 : 0 },
    
    // Cotas
    uMaxAltitude: { value: config.maxAltitude },
    
    // Niebla
    fogColor: { value: new THREE.Color(config.fogColor) },
    fogDensity: { value: config.fogDensity }
  };

  const vertexShader = `
    attribute vec3 aBarycentric;
    varying vec3 vBarycentric;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vElevation;

    void main() {
      vBarycentric = aBarycentric;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vElevation = position.y;
      
      // Normal transformada en espacio de mundo
      vNormal = normalize(mat3(modelMatrix) * normal);
      
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const fragmentShader = `
    uniform vec3 uSunDirection;
    uniform vec3 uSunColor;
    uniform float uSunIntensity;
    
    uniform vec3 uSnowColor;
    uniform vec3 uIceColor;
    uniform vec3 uRockColor;
    uniform vec3 uTalusColor;
    uniform vec3 uShadowColor;
    
    uniform float uNormalSmoothness;
    uniform float uSnowCoverage;
    uniform float uRockExposure;

    uniform vec3 uWireframeColor;
    uniform float uWireframeIntensity;
    uniform float uWireframeWidth;
    uniform int uVisualMode;
    uniform int uDiagnosticMode;
    uniform float uMaxAltitude;
    
    uniform vec3 fogColor;
    uniform float fogDensity;

    varying vec3 vBarycentric;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vElevation;

    // Generador de ruido procedural continuo en GLSL
    float hash2D(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise2D(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash2D(i + vec2(0.0, 0.0)), hash2D(i + vec2(1.0, 0.0)), u.x),
        mix(hash2D(i + vec2(0.0, 1.0)), hash2D(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    float fbm2D(vec2 p) {
      return noise2D(p) * 0.55 + noise2D(p * 2.04) * 0.28 + noise2D(p * 4.12) * 0.17;
    }

    // Cálculo analítico de línea wireframe anti-aliased de grosor constante
    float edgeFactor() {
      vec3 d = fwidth(vBarycentric);
      vec3 a3 = smoothstep(vec3(0.0), d * uWireframeWidth, vBarycentric);
      return min(min(a3.x, a3.y), a3.z);
    }

    void main() {
      // 1. Normal híbrida: balance continuo entre faceta poligonal y normal suave calculada
      vec3 fdx = dFdx(vWorldPosition);
      vec3 fdy = dFdy(vWorldPosition);
      vec3 faceNormal = normalize(cross(fdx, fdy));
      vec3 N = normalize(mix(faceNormal, vNormal, clamp(uNormalSmoothness, 0.0, 1.0)));
      vec3 L = normalize(uSunDirection);
      vec3 V = normalize(cameraPosition - vWorldPosition);

      float nDotL = max(dot(N, L), 0.0);
      float slope = clamp(N.y, 0.0, 1.0); // 1.0 = plano horizontal, 0.0 = acantilado vertical
      float normElev = clamp(vElevation / uMaxAltitude, 0.0, 1.0);

      // 2. Ruido geológico a macro-escala (evita parches de triángulos aislados)
      float macroSnowDrift = fbm2D(vWorldPosition.xz * 0.0045);
      float rockNoise = fbm2D(vWorldPosition.xz * 0.016);

      // 3. Sistema Geológico Realista de Manto Nival Continuo
      // Cumbres altas (>0.58): Nieve continua dominante, sólo cede en acantilados verticales escarpados
      float cliffThreshold = mix(0.42, 0.24, normElev) * uRockExposure;
      float canHoldSnow = smoothstep(cliffThreshold, cliffThreshold + 0.14, slope);

      // Cota de nieve andina continua: arriba es manto puro; abajo transiciona a couloirs
      float snowAltBase = 0.38 / max(0.2, uSnowCoverage);
      float snowAltFactor = smoothstep(snowAltBase - 0.12, snowAltBase + 0.16, normElev + (macroSnowDrift - 0.5) * 0.15);

      // Laderas en sombra (umbría) retienen mayor nieve en cotas medias
      float shadeRetention = (1.0 - nDotL) * 0.16 * smoothstep(0.25, 0.60, normElev);
      float snowMask = clamp(canHoldSnow * (snowAltFactor + shadeRetention), 0.0, 1.0);

      // Refuerzo en las altas cumbres para evitar cualquier aspecto desértico o parcheado
      if (normElev > 0.68 && slope > 0.28) {
        snowMask = max(snowMask, smoothstep(0.68, 0.85, normElev));
      }

      // Morrenas y taludes de pedregal intermedios
      float talusMask = smoothstep(0.18, 0.42, slope) * (1.0 - snowMask) * smoothstep(0.12, 0.52, normElev);

      // 4. Paleta Cromática Mineral y Glaciar Andina ("marroncito con blanco", cero negros)
      // Roca andina: estratos cálidos terracota, ocre mineral, marrón cobrizo y pizarra
      vec3 earthBrown = vec3(0.48, 0.29, 0.18);
      vec3 warmOchre = vec3(0.58, 0.38, 0.24);
      vec3 mineralSlate = vec3(0.32, 0.34, 0.38);
      vec3 baseRock = mix(uRockColor, earthBrown, smoothstep(0.25, 0.70, rockNoise));
      vec3 stratifiedRock = mix(baseRock, warmOchre, smoothstep(0.45, 0.80, macroSnowDrift) * 0.55);
      vec3 geologicalRock = mix(stratifiedRock, mineralSlate, (1.0 - slope) * 0.45);
      vec3 rockSurface = mix(geologicalRock, uTalusColor, talusMask * 0.60);

      // Nieve con blanco puro brillante en cumbres y reflejo celeste en sombras frías
      vec3 snowShadow = mix(vec3(0.84, 0.91, 0.98), uSnowColor, nDotL * 0.65 + 0.35);
      vec3 snowSurface = mix(snowShadow, uSnowColor, smoothstep(0.38, 0.82, normElev));

      vec3 baseAlbedo = mix(rockSurface, snowSurface, snowMask);

      // 5. Iluminación Cinematográfica Andina Diurna
      // Luz cenital alpina indirecta (skylight difuso): baña con celeste diurno las caras en sombra (cero negros)
      vec3 ambientSky = mix(uShadowColor * 0.85, vec3(0.46, 0.62, 0.78), max(0.0, N.y) * 0.55 + 0.35);

      // Envoltura de luz directa (wrap lighting) con balance de exposición cinematográfica
      float wrapDiff = max(0.0, (dot(N, L) + 0.22) / 1.22);
      vec3 directLight = uSunColor * (wrapDiff * (uSunIntensity * 0.55));

      // Destello especular de hielo/nieve congelada en crestas iluminadas
      vec3 H = normalize(L + V);
      float nDotH = max(dot(N, H), 0.0);
      float snowSpec = pow(nDotH, 24.0) * snowMask * 0.32 * (uSunIntensity * 0.55);

      vec3 litColor = baseAlbedo * (ambientSky + directLight) + uSunColor * snowSpec;

      // 6. Wireframe Topográfico Sutil y Elegante
      float edge = edgeFactor();
      float depth = length(vWorldPosition - cameraPosition);
      // Desvanecer wireframe gradualmente en horizontes lejanos (>1,000m) para evitar moiré
      float distAtten = clamp(1.0 - smoothstep(1000.0, 2800.0, depth), 0.0, 1.0);
      float wire = (1.0 - edge) * uWireframeIntensity * distAtten;

      vec3 finalColor;
      if (uVisualMode == 1) {
        // Modo Natural: fotorrealista puro sin wireframe
        finalColor = litColor;
      } else if (uVisualMode == 2) {
        // Modo Topográfico: malla técnica destacada con fondo contrastado
        finalColor = mix(litColor * 0.40, uWireframeColor, wire * 1.35);
      } else {
        // Modo Híbrido (predeterminado): sombreado natural con wireframe sutil y elegante
        finalColor = mix(litColor, uWireframeColor, wire * 0.75);
      }

      // Modo Diagnóstico: resalta la orientación de normales y el acoplamiento topográfico
      if (uDiagnosticMode == 1) {
        vec3 diagColor = vec3(0.1, 0.8, 0.4) * (N.y * 0.5 + 0.5);
        if (slope < 0.3) diagColor = vec3(0.9, 0.5, 0.1);
        finalColor = mix(finalColor, diagColor, 0.65);
      }

      // 7. Niebla atmosférica alpina de perspectiva aérea
      float fogFactor = 1.0 - exp(-fogDensity * fogDensity * depth * depth);
      finalColor = mix(finalColor, fogColor, clamp(fogFactor, 0.0, 1.0));

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    wireframe: false,
    side: THREE.DoubleSide
  });
}

/**
 * Crea el ShaderMaterial para agua glaciar con dispersión turquesa (glacial flour),
 * reflejo Fresnel de la bóveda celeste, brillo especular del sol andino y sutil wireframe
 */
export function createGlacialWaterShader(config: MountainConfig): THREE.ShaderMaterial {
  const uniforms = {
    uTime: { value: 0.0 },
    uSunDirection: { value: new THREE.Vector3(-0.55, 0.65, -0.45).normalize() },
    uSunColor: { value: new THREE.Color('#fff7ed') },
    uSunIntensity: { value: config.sunIntensity },

    uWaterColor: { value: new THREE.Color(config.lakeWaterColor) },
    uDeepWaterColor: { value: new THREE.Color(config.lakeDeepWaterColor) },

    uWireframeColor: { value: new THREE.Color(config.wireframeColor) },
    uWireframeIntensity: { value: config.wireframeIntensity * 0.45 },
    uWireframeWidth: { value: config.wireframeLineWidth },
    uVisualMode: { value: config.visualMode === 'natural' ? 1 : config.visualMode === 'wireframe' ? 2 : 0 },
    uDiagnosticMode: { value: config.diagnosticMode ? 1 : 0 },

    fogColor: { value: new THREE.Color(config.fogColor) },
    fogDensity: { value: config.fogDensity }
  };

  const vertexShader = `
    attribute vec3 aBarycentric;
    attribute float aDepthFactor;
    varying vec3 vBarycentric;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vDepthFactor;

    void main() {
      vBarycentric = aBarycentric;
      vDepthFactor = aDepthFactor;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vNormal = normalize(mat3(modelMatrix) * normal);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uSunDirection;
    uniform vec3 uSunColor;
    uniform float uSunIntensity;

    uniform vec3 uWaterColor;
    uniform vec3 uDeepWaterColor;

    uniform vec3 uWireframeColor;
    uniform float uWireframeIntensity;
    uniform float uWireframeWidth;
    uniform int uVisualMode;
    uniform int uDiagnosticMode;

    uniform vec3 fogColor;
    uniform float fogDensity;

    varying vec3 vBarycentric;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vDepthFactor;

    float edgeFactor() {
      vec3 d = fwidth(vBarycentric);
      vec3 a3 = smoothstep(vec3(0.0), d * uWireframeWidth, vBarycentric);
      return min(min(a3.x, a3.y), a3.z);
    }

    void main() {
      // 1. Ondas sutiles y micro-oleaje en la superficie del lago glaciar
      float wave1 = sin(vWorldPosition.x * 0.08 + uTime * 1.6 + vWorldPosition.z * 0.05) * 0.04;
      float wave2 = cos(vWorldPosition.z * 0.07 - uTime * 1.3 + vWorldPosition.x * 0.03) * 0.04;
      vec3 N = normalize(vec3(wave1, 1.0, wave2));

      vec3 V = normalize(cameraPosition - vWorldPosition);
      vec3 L = normalize(uSunDirection);
      vec3 H = normalize(L + V);

      // 2. Coloración bicromática de agua andina:
      // Orilla poco profunda: turquesa lechoso brillante (harina glaciar en suspensión)
      // Centro profundo: azul petróleo abisal
      float depthMix = smoothstep(0.08, 0.85, vDepthFactor);
      vec3 waterBase = mix(uWaterColor, uDeepWaterColor, depthMix);

      // 3. Efecto Fresnel físico: a ángulos rasantes refleja la bóveda celeste alpina
      float nDotV = max(dot(N, V), 0.0);
      float fresnel = 0.03 + 0.97 * pow(1.0 - nDotV, 4.0);
      vec3 skyReflection = mix(vec3(0.55, 0.72, 0.90), vec3(0.88, 0.94, 1.0), fresnel);

      // 4. Destello especular del sol sobre el agua
      float nDotH = max(dot(N, H), 0.0);
      float specular = pow(nDotH, 56.0) * uSunIntensity * 1.5;

      vec3 litWater = mix(waterBase, skyReflection, fresnel * 0.65) + uSunColor * specular;

      // 5. Wireframe discreto en la malla de agua con atenuación por distancia
      float edge = edgeFactor();
      float depth = length(vWorldPosition - cameraPosition);
      float distAtten = clamp(1.0 - smoothstep(1000.0, 2800.0, depth), 0.0, 1.0);
      float wire = (1.0 - edge) * uWireframeIntensity * distAtten;
      if (uVisualMode == 1) wire = 0.0; // Modo natural: agua pura

      vec3 finalColor = mix(litWater, uWireframeColor, wire);

      if (uDiagnosticMode == 1) {
        finalColor = mix(finalColor, vec3(0.0, 0.85, 1.0), 0.60);
      }

      // 6. Niebla atmosférica
      float fogFactor = 1.0 - exp(-fogDensity * fogDensity * depth * depth);
      finalColor = mix(finalColor, fogColor, clamp(fogFactor, 0.0, 1.0));

      // Opacidad con suave transparencia en los bordes
      float opacity = mix(0.88, 0.98, smoothstep(0.0, 0.22, vDepthFactor));
      gl_FragColor = vec4(finalColor, opacity);
    }
  `;

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    wireframe: false,
    side: THREE.DoubleSide
  });
}

/**
 * Crea el ShaderMaterial para las lenguas glaciares (hielo azulado, seracs y fracturas)
 */
export function createGlacierIceShader(config: MountainConfig): THREE.ShaderMaterial {
  const uniforms = {
    uSunDirection: { value: new THREE.Vector3(-0.55, 0.65, -0.45).normalize() },
    uSunColor: { value: new THREE.Color('#fff7ed') },
    uSunIntensity: { value: config.sunIntensity },

    uIceColor: { value: new THREE.Color(config.glacierIceColor) },
    uSnowColor: { value: new THREE.Color(config.glacierSnowColor) },
    uDeepIceColor: { value: new THREE.Color('#0369a1') },

    uWireframeColor: { value: new THREE.Color(config.wireframeColor) },
    uWireframeIntensity: { value: config.wireframeIntensity * 0.7 },
    uWireframeWidth: { value: config.wireframeLineWidth },
    uVisualMode: { value: config.visualMode === 'natural' ? 1 : config.visualMode === 'wireframe' ? 2 : 0 },
    uDiagnosticMode: { value: config.diagnosticMode ? 1 : 0 },

    fogColor: { value: new THREE.Color(config.fogColor) },
    fogDensity: { value: config.fogDensity }
  };

  const vertexShader = `
    attribute vec3 aBarycentric;
    attribute float aFlowCoord;
    varying vec3 vBarycentric;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vFlowCoord;

    void main() {
      vBarycentric = aBarycentric;
      vFlowCoord = aFlowCoord;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vNormal = normalize(mat3(modelMatrix) * normal);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const fragmentShader = `
    uniform vec3 uSunDirection;
    uniform vec3 uSunColor;
    uniform float uSunIntensity;

    uniform vec3 uIceColor;
    uniform vec3 uSnowColor;
    uniform vec3 uDeepIceColor;

    uniform vec3 uWireframeColor;
    uniform float uWireframeIntensity;
    uniform float uWireframeWidth;
    uniform int uVisualMode;
    uniform int uDiagnosticMode;

    uniform vec3 fogColor;
    uniform float fogDensity;

    varying vec3 vBarycentric;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vFlowCoord;

    float edgeFactor() {
      vec3 d = fwidth(vBarycentric);
      vec3 a3 = smoothstep(vec3(0.0), d * uWireframeWidth, vBarycentric);
      return min(min(a3.x, a3.y), a3.z);
    }

    void main() {
      vec3 fdx = dFdx(vWorldPosition);
      vec3 fdy = dFdy(vWorldPosition);
      vec3 faceNormal = normalize(cross(fdx, fdy));
      vec3 N = normalize(mix(vNormal, faceNormal, 0.45));

      vec3 L = normalize(uSunDirection);
      vec3 V = normalize(cameraPosition - vWorldPosition);
      float nDotL = max(dot(N, L), 0.0);

      // Bandas longitudinales de flujo y grietas transversales (seracs)
      float bands = sin(vFlowCoord * 32.0 + sin(vWorldPosition.x * 0.15) * 4.0) * 0.5 + 0.5;
      float crevasses = smoothstep(0.72, 0.88, bands);

      // Color base del hielo: zona alta con nieve virgen blanca, lengua media azul hielo, grietas azul profundo
      vec3 iceTone = mix(uDeepIceColor, uIceColor, nDotL * 0.6 + 0.4);
      vec3 surfaceTone = mix(iceTone, uSnowColor, smoothstep(0.1, 0.85, 1.0 - vFlowCoord) * 0.65);
      vec3 baseColor = mix(surfaceTone, uDeepIceColor, crevasses * 0.5);

      // Subsurface scattering del hielo glaciar translúcido y luz ambiente alpina fría
      float sss = pow(max(0.0, dot(V, -L)), 3.0) * 0.45;
      vec3 ambientSky = vec3(0.48, 0.58, 0.70);
      vec3 litColor = baseColor * (ambientSky + uSunColor * (nDotL * uSunIntensity + sss));

      // Wireframe con atenuación por distancia
      float edge = edgeFactor();
      float depth = length(vWorldPosition - cameraPosition);
      float distAtten = clamp(1.0 - smoothstep(1000.0, 2800.0, depth), 0.0, 1.0);
      float wire = (1.0 - edge) * uWireframeIntensity * distAtten;
      if (uVisualMode == 1) wire = 0.0;

      vec3 finalColor = mix(litColor, uWireframeColor, wire);

      if (uDiagnosticMode == 1) {
        finalColor = mix(finalColor, vec3(0.15, 0.55, 1.0), 0.65);
      }

      // Niebla
      float fogFactor = 1.0 - exp(-fogDensity * fogDensity * depth * depth);
      finalColor = mix(finalColor, fogColor, clamp(fogFactor, 0.0, 1.0));

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    wireframe: false,
    side: THREE.DoubleSide
  });
}

/**
 * Crea el ShaderMaterial para cauces y torrentes de agua rápida de deshielo
 */
export function createStreamWaterShader(config: MountainConfig): THREE.ShaderMaterial {
  const uniforms = {
    uTime: { value: 0.0 },
    uSunDirection: { value: new THREE.Vector3(-0.55, 0.65, -0.45).normalize() },
    uSunColor: { value: new THREE.Color('#fff7ed') },
    uSunIntensity: { value: config.sunIntensity },

    uStreamColor: { value: new THREE.Color('#38bdf8') },
    uFoamColor: { value: new THREE.Color('#ffffff') },
    uDeepStreamColor: { value: new THREE.Color(config.lakeWaterColor) },

    uWireframeColor: { value: new THREE.Color(config.wireframeColor) },
    uWireframeIntensity: { value: config.wireframeIntensity * 0.4 },
    uWireframeWidth: { value: config.wireframeLineWidth },
    uVisualMode: { value: config.visualMode === 'natural' ? 1 : config.visualMode === 'wireframe' ? 2 : 0 },
    uDiagnosticMode: { value: config.diagnosticMode ? 1 : 0 },

    fogColor: { value: new THREE.Color(config.fogColor) },
    fogDensity: { value: config.fogDensity }
  };

  const vertexShader = `
    attribute vec3 aBarycentric;
    attribute float aFlowCoord;
    varying vec3 vBarycentric;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vFlowCoord;

    void main() {
      vBarycentric = aBarycentric;
      vFlowCoord = aFlowCoord;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vNormal = normalize(mat3(modelMatrix) * normal);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uSunDirection;
    uniform vec3 uSunColor;
    uniform float uSunIntensity;

    uniform vec3 uStreamColor;
    uniform vec3 uFoamColor;
    uniform vec3 uDeepStreamColor;

    uniform vec3 uWireframeColor;
    uniform float uWireframeIntensity;
    uniform float uWireframeWidth;
    uniform int uVisualMode;
    uniform int uDiagnosticMode;

    uniform vec3 fogColor;
    uniform float fogDensity;

    varying vec3 vBarycentric;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vFlowCoord;

    float edgeFactor() {
      vec3 d = fwidth(vBarycentric);
      vec3 a3 = smoothstep(vec3(0.0), d * uWireframeWidth, vBarycentric);
      return min(min(a3.x, a3.y), a3.z);
    }

    void main() {
      // Flujo de agua rápida animado a lo largo del cauce
      float speed = uTime * 4.5;
      float foam1 = sin(vFlowCoord * 48.0 - speed + vWorldPosition.x * 0.2) * 0.5 + 0.5;
      float foam2 = cos(vFlowCoord * 32.0 - speed * 1.3) * 0.5 + 0.5;
      float foam = smoothstep(0.65, 0.90, foam1 * foam2);

      vec3 waterColor = mix(uDeepStreamColor, uStreamColor, 0.6);
      vec3 finalStream = mix(waterColor, uFoamColor, foam * 0.75);

      vec3 L = normalize(uSunDirection);
      vec3 V = normalize(cameraPosition - vWorldPosition);
      vec3 H = normalize(L + V);
      float spec = pow(max(0.0, dot(vec3(0.0, 1.0, 0.0), H)), 32.0) * uSunIntensity;

      vec3 lit = finalStream + uSunColor * spec * 0.8;

      float edge = edgeFactor();
      float depth = length(vWorldPosition - cameraPosition);
      float distAtten = clamp(1.0 - smoothstep(900.0, 2600.0, depth), 0.0, 1.0);
      float wire = (1.0 - edge) * uWireframeIntensity * distAtten;
      if (uVisualMode == 1) wire = 0.0;

      vec3 finalColor = mix(lit, uWireframeColor, wire);

      if (uDiagnosticMode == 1) {
        finalColor = mix(finalColor, vec3(1.0, 0.85, 0.1), 0.70);
      }

      float fogFactor = 1.0 - exp(-fogDensity * fogDensity * depth * depth);
      finalColor = mix(finalColor, fogColor, clamp(fogFactor, 0.0, 1.0));

      gl_FragColor = vec4(finalColor, 0.94);
    }
  `;

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    wireframe: false,
    side: THREE.DoubleSide
  });
}
