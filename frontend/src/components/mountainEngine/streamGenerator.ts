// streamGenerator.ts: Generador procedural de cauces de deshielo y ríos emisarios con descenso físico estrictamente por gravedad
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { type GlacialBasin } from './terrainGenerator';
import { type MountainConfig } from './config';
import { createStreamWaterShader, setupBarycentricCoordinates } from './mountainMaterials';

export interface StreamSystem {
  mesh1: THREE.Mesh;
  mesh2: THREE.Mesh;
  streamMaterial: THREE.ShaderMaterial;
}

export class StreamGenerator {
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
   * Genera una cinta fluvial fluida que desciende estrictamente por gravedad (Yi <= Yi-1)
   * siguiendo la vaguada orográfica natural hacia la laguna o fondo del valle
   */
  private createStreamRibbon(
    startX: number,
    startZ: number,
    endX: number,
    endZ: number,
    baseWidth: number,
    steps: number,
    meanderAmp: number,
    totalLength: number,
    targetEndElevation?: number
  ): THREE.BufferGeometry {
    const vertices: number[] = [];
    const flowCoords: number[] = [];
    const indices: number[] = [];

    const dirX = endX - startX;
    const dirZ = endZ - startZ;
    const totalDist = Math.hypot(dirX, dirZ) || 1.0;

    const perpX = -dirZ / totalDist;
    const perpZ = dirX / totalDist;

    let prevElevation = Infinity;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;

      // Meandro armónico suave natural que no se desvía bruscamente
      const meander = Math.sin(t * Math.PI) * meanderAmp * (1.0 - t * 0.25);

      const spineX = startX + dirX * t + perpX * meander;
      const spineZ = startZ + dirZ * t + perpZ * meander;

      // Cota del terreno en el eje central de la vaguada
      const groundY = this.getElevation(spineX, spineZ);

      // Descenso estrictamente monótono: el agua NUNCA sube montañas
      let currentElevation: number;
      if (i === 0) {
        currentElevation = groundY + 0.12;
      } else {
        // Cada paso desciende como mínimo 0.08m y como máximo acompaña la pendiente del terreno
        currentElevation = Math.min(prevElevation - 0.06, groundY + 0.12);
      }

      // Si se especificó una cota meta (ej: nivel de agua de laguna), converger suavemente
      if (targetEndElevation !== undefined) {
        const blendToTarget = Math.pow(t, 2.0);
        currentElevation = THREE.MathUtils.lerp(currentElevation, targetEndElevation + 0.05, blendToTarget);
      }

      prevElevation = currentElevation;

      // Ancho variable: torrente angosto al nacer en el glaciar, ensanchado en el lecho
      const width = baseWidth * (0.80 + 0.45 * Math.sin(t * Math.PI));
      const halfW = width * 0.5;

      // Puntos transversales a lo largo del perfil del cauce
      const uSteps = 4;
      for (let j = 0; j <= uSteps; j++) {
        const u = j / uSteps;
        const sideOffset = (u - 0.5) * 2.0; // -1.0 a +1.0

        const vx = spineX + perpX * (sideOffset * halfW);
        const vz = spineZ + perpZ * (sideOffset * halfW);

        // Nivel horizontal plano transversal en el lecho con leve curvatura cóncava
        const concavity = (1.0 - Math.abs(sideOffset) * Math.abs(sideOffset)) * 0.04;
        const vy = currentElevation - concavity;

        // Transformación al sistema local de la malla
        const localZ = vz + totalLength / 2;

        vertices.push(vx, vy, localZ);
        flowCoords.push(t);
      }
    }

    const uSteps = 4;
    for (let i = 0; i < steps; i++) {
      for (let j = 0; j < uSteps; j++) {
        const row1 = i * (uSteps + 1);
        const row2 = (i + 1) * (uSteps + 1);

        const i0 = row1 + j;
        const i1 = row1 + j + 1;
        const i2 = row2 + j + 1;
        const i3 = row2 + j;

        indices.push(i0, i3, i2);
        indices.push(i0, i2, i1);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('aFlowCoord', new THREE.Float32BufferAttribute(flowCoords, 1));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    return geom;
  }

  /**
   * Genera la red hídrica completa para todas las cuencas del ciclo
   */
  public generate(totalLength: number = 5600): StreamSystem {
    const streamGeometries: THREE.BufferGeometry[] = [];

    for (let i = 0; i < this.basins.length; i++) {
      const basin = this.basins[i];

      // 1. Torrente de deshielo: comunica el frente del glaciar con la orilla de la laguna
      const glacierSnoutX = (basin.peakSourceX + basin.centerX) * 0.5;
      const glacierSnoutZ = (basin.peakSourceZ + basin.centerZ) * 0.5;
      const inletX = basin.centerX + (glacierSnoutX - basin.centerX) * 0.60;
      const inletZ = basin.centerZ + (glacierSnoutZ - basin.centerZ) * 0.60;

      const meltStream = this.createStreamRibbon(
        glacierSnoutX,
        glacierSnoutZ,
        inletX,
        inletZ,
        4.8,
        20,
        4.5,
        totalLength,
        basin.waterLevel
      );
      streamGeometries.push(meltStream);

      // 2. Río emisario de salida: desborda de la morrena hacia el valle inferior
      // Dirección opuesta al pico dominante (hacia el valle abierto)
      const outDirX = -(basin.peakSourceX - basin.centerX);
      const outDirZ = -(basin.peakSourceZ - basin.centerZ);
      const lenOut = Math.hypot(outDirX, outDirZ) || 1.0;

      const outletStartX = basin.centerX + (outDirX / lenOut) * (basin.radiusX * 0.88);
      const outletStartZ = basin.centerZ + (outDirZ / lenOut) * (basin.radiusZ * 0.88);

      const outletEndX = outletStartX + (outDirX / lenOut) * 280.0;
      const outletEndZ = outletStartZ + (outDirZ / lenOut) * 280.0;

      const emissaryRiver = this.createStreamRibbon(
        outletStartX,
        outletStartZ,
        outletEndX,
        outletEndZ,
        6.5,
        26,
        8.0,
        totalLength
      );
      streamGeometries.push(emissaryRiver);
    }

    let combinedGeometry: THREE.BufferGeometry;
    if (streamGeometries.length > 0) {
      combinedGeometry = BufferGeometryUtils.mergeGeometries(streamGeometries, false);
    } else {
      combinedGeometry = new THREE.BufferGeometry();
    }

    const barycentricGeometry = setupBarycentricCoordinates(combinedGeometry);
    const streamMaterial = createStreamWaterShader(this.config);

    const mesh1 = new THREE.Mesh(barycentricGeometry, streamMaterial);
    mesh1.position.set(0, 0, -totalLength / 2);
    mesh1.frustumCulled = true;

    const mesh2 = new THREE.Mesh(barycentricGeometry, streamMaterial);
    mesh2.position.set(0, 0, -totalLength / 2 - totalLength);
    mesh2.frustumCulled = true;

    return {
      mesh1,
      mesh2,
      streamMaterial
    };
  }
}
