// cameraController.ts: Cinemática cinematográfica estilo dron en sobrevuelo continuo
import * as THREE from 'three';
import { type MountainConfig } from './config';

export class DroneCameraController {
  public camera: THREE.PerspectiveCamera;
  private config: MountainConfig;
  private flightZ: number = 0;
  private currentLookY: number = 100.0;
  private totalLength: number;

  // Interacción suave con el ratón
  private mouseX: number = 0;
  private mouseY: number = 0;
  private smoothMouseX: number = 0;
  private smoothMouseY: number = 0;

  constructor(aspect: number, totalLength: number, config: MountainConfig) {
    this.config = config;
    this.totalLength = totalLength;
    this.camera = new THREE.PerspectiveCamera(config.cameraFov, aspect, 2.0, 4800.0);
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public updateFov(fov: number) {
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
  }

  public setMousePosition(normX: number, normY: number) {
    this.mouseX = normX; // -1 (izq) a +1 (der)
    this.mouseY = normY; // -1 (arriba) a +1 (abajo)
  }

  public getFlightZ(): number {
    return this.flightZ;
  }

  /**
   * Actualiza el sobrevuelo continuo con cinemática estilo dron estable y perspectiva configurable.
   * Vuelo siempre por encima de las cumbres de los nevados sin oscilaciones ni saltos bruscos.
   */
  public update(delta: number, _getTerrainElevation?: (x: number, z: number) => number) {
    // 1. Avance continuo suave a lo largo del macizo
    this.flightZ -= this.config.flightSpeed * delta;

    // 2. Trayectoria y posición de la aeronave en alta cota
    const curvePhase = this.flightZ * 0.0012;
    
    // Posición lateral: offset base calibrado + leve curva panorámica
    const camX = this.config.cameraXOffset + Math.sin(curvePhase) * 10.0;

    // Altura de vuelo de crucero: siempre por encima de la cota máxima de los nevados
    const safeAltitude = Math.max(this.config.flightAltitude, this.config.maxAltitude + 30.0);
    const camY = safeAltitude + Math.sin(curvePhase * 0.6) * 1.5;

    this.camera.position.set(camX, camY, this.flightZ);

    // 3. Vector de orientación / LookAt estable con Pitch y Yaw configurables
    const lookAhead = this.config.lookAheadDist;
    
    // Convertir ángulos de configuración a radianes
    const yawRad = (this.config.cameraYaw * Math.PI) / 180;
    const pitchRad = (this.config.cameraPitch * Math.PI) / 180;

    // Dirección hacia adelante proyectada con yaw
    const dirX = Math.sin(yawRad);
    const dirZ = -Math.cos(yawRad);

    // Cota focal objetivo: horizonte estable referenciado a la morfología general,
    // eliminando rebotes o tirones causados por picos o valles individuales bajo el punto focal
    const baseTargetLookY = this.config.maxAltitude * 0.52 + Math.sin(pitchRad) * lookAhead;

    this.currentLookY = THREE.MathUtils.lerp(this.currentLookY, baseTargetLookY, delta * 3.0);

    const focalX = camX + dirX * lookAhead;
    const focalZ = this.flightZ + dirZ * lookAhead;

    this.camera.lookAt(focalX, this.currentLookY, focalZ);

    // 4. Inclinación alar aerodinámica muy sutil durante las suaves curvas
    this.camera.rotation.z = -Math.cos(curvePhase) * 0.012;
  }
}
