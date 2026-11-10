// terrainGenerator.ts: Generador procedural de cordilleras andinas jerárquicas continuas
import * as THREE from 'three';
import { FractalNoise } from './noise';
import { type MountainConfig } from './config';
import { setupBarycentricCoordinates } from './mountainMaterials';
import { LANDMARK_PAIRS, calculateProportional3DElevation } from '../../config/landmarks.data';

export interface GlacialBasin {
  id: string;
  name: string;
  centerX: number;
  centerZ: number; // En rango [-5600, 0]
  radiusX: number;
  radiusZ: number;
  waterLevel: number;
  depth: number;
  peakSourceX: number;
  peakSourceZ: number;
  peakElevation: number;
  type: 'high_cirque' | 'valley_lake' | 'moraine_tarn';
  waterColor: string;
  deepWaterColor: string;
  // Metadatos científicos del RAG y etiquetado 3D
  landmarkId?: string;
  peakName?: string;
  peakRealAltitude?: number;
  cordillera?: string;
  departamento?: string;
  colosoRank?: string;
  lagoonRealAltitude?: number;
  lagoonRisk?: string;
  lagoonVolumeTexto?: string;
  connectionDescription?: string;
}

export interface MountainTerrainSystem {
  mesh1: THREE.Mesh;
  mesh2: THREE.Mesh;
  getTerrainHeight: (x: number, z: number) => number;
  getTerrainNormal: (x: number, z: number) => THREE.Vector3;
  getElevationAt: (x: number, z: number) => number;
  getBasins: () => GlacialBasin[];
  totalLength: number;
  totalWidth: number;
}

export class TerrainGenerator {
  private config: MountainConfig;
  private noise: FractalNoise;
  private detailNoise: FractalNoise;
  private basins: GlacialBasin[] = [];

  constructor(config: MountainConfig) {
    this.config = config;
    this.noise = new FractalNoise(config.seed);
    this.detailNoise = new FractalNoise(config.seed + 104729);
    this.initBasins();
  }

  /**
   * Inicializa las cuencas glaciares distribuidas estratégicamente a lo largo del ciclo toroidal de 5600m
   * usando los datos oficiales de nevados y lagunas del RAG
   */
  private initBasins() {
    this.basins = LANDMARK_PAIRS.map(lp => ({
      id: lp.lagoon.id,
      name: lp.lagoon.nombre,
      centerX: lp.lagoon.centerX,
      centerZ: lp.lagoon.centerZ,
      radiusX: lp.lagoon.radiusX,
      radiusZ: lp.lagoon.radiusZ,
      waterLevel: lp.lagoon.waterLevel,
      depth: lp.lagoon.depth,
      peakSourceX: lp.peak.worldX,
      peakSourceZ: lp.peak.worldZ,
      peakElevation: calculateProportional3DElevation(lp.peak.altitudMsnm, this.config.maxAltitude),
      type: lp.lagoon.type,
      waterColor: lp.lagoon.waterColor,
      deepWaterColor: lp.lagoon.deepWaterColor,
      landmarkId: lp.id,
      peakName: lp.peak.nombre,
      peakRealAltitude: lp.peak.altitudMsnm,
      cordillera: lp.peak.cordillera,
      departamento: lp.peak.departamento,
      colosoRank: lp.peak.colosoRank,
      lagoonRealAltitude: lp.lagoon.altitudMsnm,
      lagoonRisk: lp.lagoon.riesgo,
      lagoonVolumeTexto: lp.lagoon.volumenTexto,
      connectionDescription: lp.connection.descripcion
    }));
  }

  public getBasins(): GlacialBasin[] {
    return this.basins;
  }

  public updateConfig(newConfig: Partial<MountainConfig>) {
    Object.assign(this.config, newConfig);
    if (newConfig.seed !== undefined) {
      this.noise.reseed(this.config.seed);
      this.detailNoise.reseed(this.config.seed + 104729);
    }
    if (newConfig.maxAltitude !== undefined) {
      this.initBasins();
    }
  }

  /**
   * Mapeo toroidal continuo para el ciclo infinito a lo largo de Z
   */
  private wrapZ(z: number, length: number): number {
    const m = z % length;
    return m <= 0 ? m : m - length;
  }

  /**
   * Función matemática de elevación con jerarquía de 4 niveles:
   * - 10% Colosos principales dominantes
   * - 25% Crestas secundarias altas
   * - 40% Cadenas terciarias y contrafuertes
   * - 25% Valles profundos y laderas basales
   */
  public getElevation(worldX: number, worldZ: number, totalLength = 5600): number {
    const cycleZ = this.wrapZ(worldZ, totalLength);

    // 1. Dominio orográfico deformado (Domain Warping para pliegues geológicos naturales)
    const warpAmp = this.config.domainWarp;
    const warpX = this.noise.noise2D(worldX * 0.0018, cycleZ * 0.0018) * warpAmp;
    const warpZ = this.noise.noise2D((worldX + 50) * 0.0018, (cycleZ + 50) * 0.0018) * warpAmp;

    const px = worldX + warpX;
    const pz = cycleZ + warpZ;

    // 2. Jerarquía Nivel 1: Macizo Base Tectónico y Crestas Primarias Continuas
    // Orografía andina con masas geológicas amplias (eliminando púas y arrugas triangulares)
    const baseOrografica = this.noise.fbm(px * 0.0016, pz * 0.0011, 3) * 0.40 + 0.35;
    
    // Crestas de montaña amplias y fluidas
    const r1 = this.noise.ridgedMF(px * 0.0026, pz * 0.0015, 3);
    const r2 = this.noise.ridgedMF(px * 0.0050 - 12.0, pz * 0.0032 + 20.0, 3);
    const cresta1 = Math.pow(r1, 1.15) * 0.65;
    const cresta2 = Math.pow(r2, 1.10) * 0.35;
    const crestaPrimaria = (cresta1 + cresta2) * baseOrografica;

    // 3. Jerarquía Nivel 2: Colosos y Cumbres Dominantes (~10% del territorio)
    // Macizos andinos imponentes (estilo Huascarán / Yerupajá / Ausangate)
    const ruidoPicos = this.noise.fbm(px * 0.0022, pz * 0.0013, 3);
    const tPicos = Math.max(0.0, (ruidoPicos - 0.22) / 0.78);
    const mascaraPicos = tPicos * tPicos * (3.0 - 2.0 * tPicos); // Smoothstep suave
    const boostColosos = mascaraPicos * 1.30 * (0.58 + cresta1 * 0.42);

    // 4. Jerarquía Nivel 3: Contrafuertes, Aristas Laterales y Laderas Suaves
    const laderaSuave = this.detailNoise.fbm(px * 0.0042, pz * 0.0036, 3) * 0.24;
    const contrafuertes = laderaSuave * 0.65;

    // 5. Micro-Relieve Geológico Natural Suave (amplitud sutil, elimina dientes de sierra de 22m)
    const microRelieve = this.detailNoise.fbm(worldX * 0.006, cycleZ * 0.006, 2) * 0.06 * this.config.roughness;

    // Asimetría tectónica natural
    const asimetria = this.noise.noise2D(px * 0.0030, pz * 0.0030) * 0.28 + 0.72;

    // Elevación orográfica base
    let elevacionRelativa = (crestaPrimaria + boostColosos + contrafuertes) * this.config.ridgeIntensity;
    elevacionRelativa *= (0.78 + asimetria * 0.32);

    let alturaFinal = 36 + elevacionRelativa * this.config.maxAltitude + microRelieve * 4.0;

    // 5.5. Anclaje Orográfico Proporcional de Cumbres Oficiales del RAG
    // Garantiza que la altura 3D del pico sea estrictamente proporcional a su cota real en m s.n.m.
    for (let b = 0; b < this.basins.length; b++) {
      const basin = this.basins[b];
      const dpx = worldX - basin.peakSourceX;
      const dpz = cycleZ - basin.peakSourceZ;
      const distPeakSq = dpx * dpx + dpz * dpz;
      
      // Radio de influencia del macizo de la cumbre (~240m)
      if (distPeakSq < 57600) { // 240^2
        const distPeak = Math.sqrt(distPeakSq);
        const normDist = distPeak / 240.0;
        // Perfil piramidal alpino suave y armónico
        const bell = Math.exp(-normDist * normDist * 3.2);
        const crestDetalle = Math.pow(r1, 1.15) * 16.0 * (1.0 - normDist);
        const targetPeakElevation = basin.peakElevation + crestDetalle;
        alturaFinal = Math.max(alturaFinal, THREE.MathUtils.lerp(alturaFinal, targetPeakElevation, bell * 0.95));
      }
    }

    // 6. Modelado y Tallado Geológico de Cuencas, Circos y Valles de Desagüe Descendentes
    for (let b = 0; b < this.basins.length; b++) {
      const basin = this.basins[b];
      const vx = worldX - basin.centerX;
      const vz = cycleZ - basin.centerZ;

      const toPeakX = basin.peakSourceX - basin.centerX;
      const toPeakZ = basin.peakSourceZ - basin.centerZ;
      const lenPeak = Math.hypot(toPeakX, toPeakZ) || 1.0;
      const dirPeakX = toPeakX / lenPeak;
      const dirPeakZ = toPeakZ / lenPeak;

      const outDirX = -dirPeakX;
      const outDirZ = -dirPeakZ;

      // A. Canal Glaciar en Artesa (Desde la cumbre hacia la laguna: pendiente descendente continua)
      const tAlongPeak = (vx * dirPeakX + vz * dirPeakZ) / lenPeak;
      const distPerpPeak = Math.abs(-vx * dirPeakZ + vz * dirPeakX);
      if (tAlongPeak > 0.0 && tAlongPeak < 1.35 && distPerpPeak < 80.0) {
        const widthProf = Math.max(0.0, 1.0 - (distPerpPeak / 80.0) * (distPerpPeak / 80.0));
        const troughY = THREE.MathUtils.lerp(basin.waterLevel + 1.5, basin.peakElevation - 22.0, Math.min(1.0, tAlongPeak));
        alturaFinal = Math.min(alturaFinal, THREE.MathUtils.lerp(alturaFinal, troughY, widthProf * 0.85));
      }

      // B. Cuenca y Cubeta Lacustre con riberas morrénicas naturales y suaves
      const dx = vx / basin.radiusX;
      const dz = vz / basin.radiusZ;
      const r = Math.sqrt(dx * dx + dz * dz);

      if (r < 1.65) {
        if (r < 1.0) {
          // Fondo cóncavo del lago glaciar
          const tBowl = Math.pow(r, 1.4);
          const bedElevation = basin.waterLevel - basin.depth * (1.0 - tBowl);
          const blendToShore = Math.min(1.0, r / 0.90);
          const lakeBed = THREE.MathUtils.lerp(bedElevation, basin.waterLevel + 0.8, blendToShore * blendToShore);
          alturaFinal = Math.min(alturaFinal, lakeBed);
        } else {
          // Ribera morrénica que asciende suave y orgánicamente hacia la falda de la montaña
          const tShore = (r - 1.0) / 0.65;
          const shoreSlopeY = basin.waterLevel + 0.8 + Math.pow(tShore, 1.35) * 28.0;
          alturaFinal = Math.min(alturaFinal, THREE.MathUtils.lerp(shoreSlopeY, alturaFinal, tShore));
        }
      }

      // C. Valle de Desagüe Descendente (Valle en U por donde el río emisario sale y BAJA hacia cotas menores)
      const tOut = (vx * outDirX + vz * outDirZ);
      const distPerpOut = Math.abs(-vx * outDirZ + vz * outDirX);
      if (tOut > basin.radiusX * 0.65 && tOut < 420.0 && distPerpOut < 70.0) {
        const normOut = (tOut - basin.radiusX * 0.65) / (420.0 - basin.radiusX * 0.65);
        const outValleyFloor = THREE.MathUtils.lerp(basin.waterLevel - 0.5, 38.0, Math.pow(normOut, 1.15));
        const valleyProfile = Math.max(0.0, 1.0 - (distPerpOut / 70.0) * (distPerpOut / 70.0));
        const outValleyY = outValleyFloor + (distPerpOut / 70.0) * 16.0;
        alturaFinal = Math.min(alturaFinal, THREE.MathUtils.lerp(alturaFinal, outValleyY, valleyProfile * 0.92));
      }
    }

    // Desvanecimiento suave únicamente en los bordes extremos laterales lejanos
    const limiteX = 850;
    const bordeX = Math.abs(worldX);
    if (bordeX > limiteX - 180) {
      const tFade = Math.max(0, (limiteX - bordeX) / 180);
      alturaFinal = 32 + (alturaFinal - 32) * tFade;
    }

    return Math.max(12, alturaFinal);
  }

  public getTerrainHeight(worldX: number, worldZ: number, totalLength = 5600): number {
    return this.getElevation(worldX, worldZ, totalLength);
  }

  public getTerrainNormal(worldX: number, worldZ: number, totalLength = 5600): THREE.Vector3 {
    const eps = 0.8;
    const hL = this.getElevation(worldX - eps, worldZ, totalLength);
    const hR = this.getElevation(worldX + eps, worldZ, totalLength);
    const hD = this.getElevation(worldX, worldZ - eps, totalLength);
    const hU = this.getElevation(worldX, worldZ + eps, totalLength);
    return new THREE.Vector3(hL - hR, 2.0 * eps, hD - hU).normalize();
  }

  /**
   * Genera el sistema de dos mallas gemelas toroidales para vuelo continuo sin interrupciones
   */
  public generate(material: THREE.Material): MountainTerrainSystem {
    const totalWidth = 1700;
    const totalLength = 5600;
    // Resolución de malla óptima: alta fidelidad poligonal refinada con fluidez de 60 FPS
    const segX = 220;
    const segZ = 520;

    const baseGeometry = new THREE.PlaneGeometry(totalWidth, totalLength, segX, segZ);
    baseGeometry.rotateX(-Math.PI / 2);

    const posAttr = baseGeometry.attributes.position;

    // Asignar elevaciones matemáticas calculadas analíticamente
    for (let i = 0; i < posAttr.count; i++) {
      const lx = posAttr.getX(i);
      const lz = posAttr.getZ(i);
      const worldZ = lz - totalLength / 2;
      const y = this.getElevation(lx, worldZ, totalLength);
      posAttr.setY(i, y);
    }

    // Calcular las normales continuas y suaves mientras la geometría conserva sus índices compartidos
    baseGeometry.computeVertexNormals();

    // Configurar coordenadas baricéntricas para wireframe de alta precisión
    const barycentricGeometry = setupBarycentricCoordinates(baseGeometry);

    const mesh1 = new THREE.Mesh(barycentricGeometry, material);
    mesh1.position.set(0, 0, -totalLength / 2);
    mesh1.frustumCulled = true;

    // Malla gemela para el bucle continuo sin fin
    const mesh2 = new THREE.Mesh(barycentricGeometry, material);
    mesh2.position.set(0, 0, -totalLength / 2 - totalLength);
    mesh2.frustumCulled = true;

    return {
      mesh1,
      mesh2,
      getTerrainHeight: (x: number, z: number) => this.getElevation(x, z, totalLength),
      getTerrainNormal: (x: number, z: number) => this.getTerrainNormal(x, z, totalLength),
      getElevationAt: (x: number, z: number) => this.getElevation(x, z, totalLength),
      getBasins: () => this.basins,
      totalLength,
      totalWidth
    };
  }
}
