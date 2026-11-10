// glacialLakeGenerator.ts: Generador procedural de lagunas glaciares en cuencas naturales
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { type GlacialBasin } from './terrainGenerator';
import { type MountainConfig } from './config';
import { createGlacialWaterShader, setupBarycentricCoordinates } from './mountainMaterials';

export interface GlacialLakeSystem {
  mesh1: THREE.Mesh;
  mesh2: THREE.Mesh;
  waterMaterial: THREE.ShaderMaterial;
}

export class GlacialLakeGenerator {
  private config: MountainConfig;
  private basins: GlacialBasin[];

  constructor(config: MountainConfig, basins: GlacialBasin[]) {
    this.config = config;
    this.basins = basins;
  }

  /**
   * Genera la geometría de una laguna glaciar con contorno orgánico y morfología diferenciada según su tipo
   */
  private createSingleLakeGeometry(basin: GlacialBasin, totalLength: number): THREE.BufferGeometry {
    const radialSegments = 48;
    const rings = 18;

    const vertices: number[] = [];
    const depthFactors: number[] = [];
    const indices: number[] = [];

    // Vértice central en coordenadas locales de la malla
    vertices.push(basin.centerX, basin.waterLevel, basin.centerZ + totalLength / 2);
    depthFactors.push(1.0); // Máxima profundidad en la fosa central

    // Proporciones morfológicas según el tipo geológico de cuenca
    let stretchX = 1.0;
    let stretchZ = 1.0;
    let cirqueDent = 0.0;

    if (basin.type === 'valley_lake') {
      // Lagunas de artesa glaciar (tipo Parón / Huayhuash): alargadas a lo largo del valle
      stretchX = 0.78;
      stretchZ = 1.45;
    } else if (basin.type === 'high_cirque') {
      // Circos glaciares de anfiteatro (tipo Condoriri / Alpamayo): indentación en forma de herradura
      stretchX = 1.08;
      stretchZ = 0.92;
      cirqueDent = 0.16;
    } else {
      // Lagunas morrénicas escalonadas (tipo 513): lóbulos irregulares
      stretchX = 0.90;
      stretchZ = 1.15;
    }

    // Anillos concéntricos hacia la orilla
    for (let r = 1; r <= rings; r++) {
      const normR = r / rings;
      // Perfil de profundidad no lineal (orilla suave translúcida, fosa profunda abisal)
      const depthVal = Math.pow(Math.max(0.0, 1.0 - normR), 1.6);

      for (let s = 0; s < radialSegments; s++) {
        const theta = (s / radialSegments) * Math.PI * 2.0;

        // Deformación orográfica armónica multi-frecuencia (ensenadas, cabos y meandros naturales)
        const harm1 = Math.sin(theta * 2.0 + basin.centerX * 0.04) * 0.14;
        const harm2 = Math.cos(theta * 3.0 - basin.centerZ * 0.03) * 0.09;
        const harm3 = Math.sin(theta * 5.0 + 1.8) * 0.05;
        const harm4 = Math.cos(theta * 7.0 - 0.7) * 0.03;

        // Indentación en la cabecera del circo hacia el pico alimentador
        const headwallFactor = Math.sin(theta) > 0.4 ? -cirqueDent * Math.sin(theta) : 0.0;

        const organicRadius = 1.0 + harm1 + harm2 + harm3 + harm4 + headwallFactor;

        const vx = basin.centerX + Math.cos(theta) * (basin.radiusX * stretchX) * normR * organicRadius;
        const vz = basin.centerZ + Math.sin(theta) * (basin.radiusZ * stretchZ) * normR * organicRadius;
        
        // Cota de agua: fija a waterLevel para un espejo cristalino plano
        const vy = basin.waterLevel;

        // Transformación al sistema local de la malla
        const localZ = vz + totalLength / 2;

        vertices.push(vx, vy, localZ);
        depthFactors.push(depthVal);
      }
    }

    // Caras triangulares del espejo de agua
    for (let s = 0; s < radialSegments; s++) {
      const nextS = (s + 1) % radialSegments;
      indices.push(0, 1 + s, 1 + nextS);
    }

    for (let r = 1; r < rings; r++) {
      const ringStart = 1 + (r - 1) * radialSegments;
      const nextRingStart = 1 + r * radialSegments;

      for (let s = 0; s < radialSegments; s++) {
        const nextS = (s + 1) % radialSegments;

        const i0 = ringStart + s;
        const i1 = ringStart + nextS;
        const i2 = nextRingStart + nextS;
        const i3 = nextRingStart + s;

        indices.push(i0, i3, i2);
        indices.push(i0, i2, i1);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('aDepthFactor', new THREE.Float32BufferAttribute(depthFactors, 1));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }

  /**
   * Genera el sistema de lagunas gemelas para el loop infinito del sobrevuelo
   */
  public generate(totalLength: number = 5600): GlacialLakeSystem {
    const lakeGeometries: THREE.BufferGeometry[] = [];

    // Construir la geometría de cada una de las lagunas del ciclo
    for (let i = 0; i < this.basins.length; i++) {
      const basin = this.basins[i];
      const geom = this.createSingleLakeGeometry(basin, totalLength);
      lakeGeometries.push(geom);
    }

    // Combinar todas las lagunas en una sola geometría para máximo rendimiento (1 Draw Call)
    let combinedGeometry: THREE.BufferGeometry;
    if (lakeGeometries.length > 0) {
      combinedGeometry = BufferGeometryUtils.mergeGeometries(lakeGeometries, false);
    } else {
      combinedGeometry = new THREE.BufferGeometry();
    }

    // Configurar coordenadas baricéntricas para wireframe sutil sobre el agua
    const barycentricGeometry = setupBarycentricCoordinates(combinedGeometry);

    const waterMaterial = createGlacialWaterShader(this.config);

    const mesh1 = new THREE.Mesh(barycentricGeometry, waterMaterial);
    mesh1.position.set(0, 0, -totalLength / 2);
    mesh1.frustumCulled = true;

    const mesh2 = new THREE.Mesh(barycentricGeometry, waterMaterial);
    mesh2.position.set(0, 0, -totalLength / 2 - totalLength);
    mesh2.frustumCulled = true;

    return {
      mesh1,
      mesh2,
      waterMaterial
    };
  }
}
