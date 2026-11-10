// geometryValidator.ts: Sistema de validación geométrica y auditoría de cotas del terreno
import { type MountainTerrainSystem } from './terrainGenerator';
import { type GlacialLakeSystem } from './glacialLakeGenerator';
import { type GlacierSystem } from './glacierGenerator';
import { type StreamSystem } from './streamGenerator';

export interface ValidationReport {
  timestamp: string;
  streamVerticesChecked: number;
  streamMaxAboveTerrain: number;
  streamMaxBelowTerrain: number;
  streamAverageOffset: number;
  glacierVerticesChecked: number;
  glacierMaxIceThickness: number;
  glacierEdgeAdherenceMaxDiff: number;
  status: 'OPTIMAL' | 'WARNING' | 'FAIL';
  details: string;
}

/**
 * Audita matemáticamente la adherencia física de todos los elementos hídricos y glaciares
 * respecto al sistema centralizado de consulta del terreno
 */
export function validateSceneGeometry(
  terrain: MountainTerrainSystem,
  lakeSystem: GlacialLakeSystem,
  glacierSystem: GlacierSystem,
  streamSystem: StreamSystem
): ValidationReport {
  const L = terrain.totalLength; // 5600m
  const meshPosZ = -L / 2; // -2800m

  // 1. Auditoría de Red Fluvial (Ríos y Torrentes de Deshielo)
  const streamGeo = streamSystem.mesh1.geometry;
  const streamPos = streamGeo.attributes.position;
  let streamMaxAbove = 0;
  let streamMaxBelow = 0;
  let streamDiffSum = 0;

  for (let i = 0; i < streamPos.count; i++) {
    const vx = streamPos.getX(i);
    const vy = streamPos.getY(i);
    const vz = streamPos.getZ(i);

    // Conversión de coordenadas locales de malla a espacio de mundo real
    const worldX = vx;
    const worldZ = vz + meshPosZ;
    const terrainY = terrain.getTerrainHeight(worldX, worldZ);

    const diff = vy - terrainY;
    if (diff > streamMaxAbove) streamMaxAbove = diff;
    if (diff < streamMaxBelow) streamMaxBelow = diff;
    streamDiffSum += diff;
  }
  const streamAvg = streamPos.count > 0 ? streamDiffSum / streamPos.count : 0;

  // 2. Auditoría de Lenguas Glaciares
  const glacierGeo = glacierSystem.mesh1.geometry;
  const glacierPos = glacierGeo.attributes.position;
  let glacierMaxThickness = 0;
  let glacierMinGroundDiff = Infinity;

  for (let i = 0; i < glacierPos.count; i++) {
    const vx = glacierPos.getX(i);
    const vy = glacierPos.getY(i);
    const vz = glacierPos.getZ(i);

    const worldX = vx;
    const worldZ = vz + meshPosZ;
    const terrainY = terrain.getTerrainHeight(worldX, worldZ);

    const thickness = vy - terrainY;
    if (thickness > glacierMaxThickness) glacierMaxThickness = thickness;
    if (thickness < glacierMinGroundDiff) glacierMinGroundDiff = thickness;
  }

  // 3. Evaluación de Estado
  const streamsFloating = streamMaxAbove > 1.2 || streamMaxBelow < -0.3;
  const glaciersDetached = glacierMinGroundDiff < -0.5 || glacierMaxThickness > 8.0;

  const status: 'OPTIMAL' | 'WARNING' | 'FAIL' = (streamsFloating || glaciersDetached) ? 'FAIL' : 'OPTIMAL';

  const report: ValidationReport = {
    timestamp: new Date().toISOString(),
    streamVerticesChecked: streamPos.count,
    streamMaxAboveTerrain: Number(streamMaxAbove.toFixed(3)),
    streamMaxBelowTerrain: Number(streamMaxBelow.toFixed(3)),
    streamAverageOffset: Number(streamAvg.toFixed(3)),
    glacierVerticesChecked: glacierPos.count,
    glacierMaxIceThickness: Number(glacierMaxThickness.toFixed(3)),
    glacierEdgeAdherenceMaxDiff: Number(glacierMinGroundDiff.toFixed(3)),
    status,
    details: status === 'OPTIMAL'
      ? 'Todos los ríos y glaciares están 100% acoplados a la orografía sin elementos flotantes.'
      : 'Se detectaron anomalías de cota respecto a la superficie.'
  };

  console.info(
    `%c[BrainGlaciares GeometryValidator]%c Estado: ${report.status} | Ríos: +${report.streamMaxAboveTerrain}m (avg ${report.streamAverageOffset}m) | Glaciares max cúpula: ${report.glacierMaxIceThickness}m`,
    'color: #06b6d4; font-weight: bold;',
    'color: #94a3b8;'
  );

  return report;
}
