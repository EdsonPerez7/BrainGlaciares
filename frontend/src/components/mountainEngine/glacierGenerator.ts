// glacierGenerator.ts: Generador procedural de lenguas glaciares que descienden desde las cumbres
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { type GlacialBasin } from './terrainGenerator';
import { type MountainConfig } from './config';
import { createGlacierIceShader, setupBarycentricCoordinates } from './mountainMaterials';

export interface GlacierSystem {
  mesh1: THREE.Mesh;
  mesh2: THREE.Mesh;
  iceMaterial: THREE.ShaderMaterial;
}

export class GlacierGenerator {
  private config: MountainConfig;
  private basins: GlacialBasin[];
  private getElevation: (x: number, z: number) => number;

  constructor(
    config: MountainConfig,
    basins: GlacialBasin[],
    getElevation: (x: number, z: number) => number
  ) {
    this.config = config;
    this.basins = basins;
    this.getElevation = getElevation;
  }

  /**
   * Genera una lengua glaciar fluida que desciende desde la cumbre hasta la orilla de la cuenca
   * abrazando la topografía de la montaña
   */
  private createSingleGlacierGeometry(basin: GlacialBasin, totalLength: number): THREE.BufferGeometry {
    const lengthSteps = 28;
    const widthSteps = 8;

    const vertices: number[] = [];
    const flowCoords: number[] = [];
    const indices: number[] = [];

    // Vector directriz desde la cumbre hasta la orilla de la laguna
    const toLakeX = basin.centerX - basin.peakSourceX;
    const toLakeZ = basin.centerZ - basin.peakSourceZ;
    const totalDist = Math.hypot(toLakeX, toLakeZ) || 1.0;

    // Normal lateral horizontal perpendicular a la dirección del flujo
    const perpX = -toLakeZ / totalDist;
    const perpZ = toLakeX / totalDist;

    // Curvatura sinuosa natural del circo glaciar
    const meanderAmp = 14.0 * (basin.centerX > 0 ? 1 : -1);

    for (let i = 0; i <= lengthSteps; i++) {
      const t = i / lengthSteps; // 0.0 en la cumbre, 1.0 en el frente glaciar

      // Posición central de la espina dorsal del glaciar en coordenadas de mundo
      const meander = Math.sin(t * Math.PI) * meanderAmp;
      const spineX = basin.peakSourceX + toLakeX * t + perpX * meander;
      const spineZ = basin.peakSourceZ + toLakeZ * t + perpZ * meander;

      // Ancho morfológico de la lengua (amplio en acumulación alta, estrecho en canal, abanico terminal)
      const baseWidth = (basin.radiusX + basin.radiusZ) * 0.22;
      const widthFactor = 1.20 - 0.45 * Math.sin(t * Math.PI) + 0.30 * Math.pow(t, 2.0);
      const halfWidth = (baseWidth * widthFactor) / 2.0;

      // Espesor del bloque de hielo: se anula en la cumbre (t=0) y en el frente (t=1),
      // alcanzando 3.5 a 4.5m en el cuerpo medio de la lengua
      const iceThickness = Math.sin(t * Math.PI) * 4.2;

      for (let j = 0; j <= widthSteps; j++) {
        const u = j / widthSteps; // 0.0 borde izq, 0.5 centro, 1.0 borde der
        const sideOffset = (u - 0.5) * 2.0; // -1.0 a +1.0

        const vx = spineX + perpX * (sideOffset * halfWidth);
        const vz = spineZ + perpZ * (sideOffset * halfWidth);

        // Altura real del terreno subyacente mediante el sistema centralizado
        const groundY = this.getElevation(vx, vz);

        // Perfil transversal parabólico convexo del glaciar:
        // En los bordes laterales (sideOffset = ±1.0) el perfil es 0.0 y se fusiona a ras de la roca
        const domeProfile = Math.max(0.0, 1.0 - sideOffset * sideOffset);
        const vy = groundY + iceThickness * domeProfile + 0.08;

        // Transformación al sistema local de la malla (para coincidir 1:1 con mesh.position.z = -totalLength / 2)
        const localZ = vz + totalLength / 2;

        vertices.push(vx, vy, localZ);
        flowCoords.push(t); // Coordenada longitudinal para el shader de flujo
      }
    }

    // Índices de malla cuadrangular triangulada
    for (let i = 0; i < lengthSteps; i++) {
      for (let j = 0; j < widthSteps; j++) {
        const row1 = i * (widthSteps + 1);
        const row2 = (i + 1) * (widthSteps + 1);

        const i0 = row1 + j;
        const i1 = row1 + j + 1;
        const i2 = row2 + j + 1;
        const i3 = row2 + j;

        indices.push(i0, i3, i2);
        indices.push(i0, i2, i1);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('aFlowCoord', new THREE.Float32BufferAttribute(flowCoords, 1));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }

  /**
   * Genera el sistema de lenguas glaciares gemelas para el ciclo infinito
   */
  public generate(totalLength: number = 5600): GlacierSystem {
    const glacierGeometries: THREE.BufferGeometry[] = [];

    // Construir la lengua glaciar de cada cuenca
    for (let i = 0; i < this.basins.length; i++) {
      const basin = this.basins[i];
      const geom = this.createSingleGlacierGeometry(basin, totalLength);
      glacierGeometries.push(geom);
    }

    let combinedGeometry: THREE.BufferGeometry;
    if (glacierGeometries.length > 0) {
      combinedGeometry = BufferGeometryUtils.mergeGeometries(glacierGeometries, false);
    } else {
      combinedGeometry = new THREE.BufferGeometry();
    }

    const barycentricGeometry = setupBarycentricCoordinates(combinedGeometry);
    const iceMaterial = createGlacierIceShader(this.config);

    const mesh1 = new THREE.Mesh(barycentricGeometry, iceMaterial);
    mesh1.position.set(0, 0, -totalLength / 2);
    mesh1.frustumCulled = true;

    const mesh2 = new THREE.Mesh(barycentricGeometry, iceMaterial);
    mesh2.position.set(0, 0, -totalLength / 2 - totalLength);
    mesh2.frustumCulled = true;

    return {
      mesh1,
      mesh2,
      iceMaterial
    };
  }
}
