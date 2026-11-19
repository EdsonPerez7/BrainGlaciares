// cameraController.ts: Cinemática cinematográfica estilo dron en sobrevuelo continuo
import * as THREE from 'three';
import { type MountainConfig } from './config';

export class DroneCameraController {
  public camera: THREE.PerspectiveCamera;
  private config: MountainConfig;
  private flightZ: number = 0;
  private currentLookY: number = 352.0;
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

    // En móvil/portrait (aspect < 1.0) centrar la cámara sobre el eje de los nevados (X ~ 85, yaw ~ -4°)
    // En escritorio mantener el encuadre panorámico lateral calibrado (X ~ 64, yaw = -30°)
    const isPortrait = aspect < 1.0;
    const baseCamX = isPortrait ? 85.0 : this.config.cameraXOffset;
    const currentYaw = isPortrait ? -4.0 : this.config.cameraYaw;
    const currentPitch = isPortrait ? 24.0 : this.config.cameraPitch;

    // Inicializar cota focal al objetivo exacto para evitar el cabeceo o efecto de "caída" al entrar
    const pitchRad = (currentPitch * Math.PI) / 180;
    this.currentLookY = this.config.maxAltitude * 0.52 + Math.sin(pitchRad) * this.config.lookAheadDist;

    // Inicializar posición y orientación inicial de la cámara de inmediato en lugar de esperar al frame 1
    const safeAltitude = Math.max(this.config.flightAltitude, this.config.maxAltitude + 30.0);
    this.camera.position.set(baseCamX, safeAltitude + (isPortrait ? 15.0 : 0.0), 0);

    const yawRad = (currentYaw * Math.PI) / 180;
    const dirX = Math.sin(yawRad);
    const dirZ = -Math.cos(yawRad);
    const focalX = baseCamX + dirX * this.config.lookAheadDist;
    const focalZ = dirZ * this.config.lookAheadDist;
    this.camera.lookAt(focalX, this.currentLookY, focalZ);
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
    const isPortrait = this.camera.aspect < 1.0;

    // 1. Avance continuo suave a lo largo del macizo
    this.flightZ -= this.config.flightSpeed * delta;

    // 2. Trayectoria y posición de la aeronave en alta cota
    const curvePhase = this.flightZ * 0.0012;
    
    // Posición lateral: en móvil centrar en X=85 (eje de los nevados), en escritorio X=64
    const baseCamX = isPortrait ? 85.0 : this.config.cameraXOffset;
    const camX = baseCamX + Math.sin(curvePhase) * (isPortrait ? 5.0 : 10.0);

    // Altura de vuelo de crucero: siempre por encima de la cota máxima de los nevados
    const safeAltitude = Math.max(this.config.flightAltitude, this.config.maxAltitude + 30.0);
    const camY = safeAltitude + (isPortrait ? 15.0 : 0.0) + Math.sin(curvePhase * 0.6) * 1.5;

    this.camera.position.set(camX, camY, this.flightZ);

    // 3. Vector de orientación / LookAt estable con Pitch y Yaw configurables
    const lookAhead = this.config.lookAheadDist;
    const currentYaw = isPortrait ? -4.0 : this.config.cameraYaw;
    const currentPitch = isPortrait ? 24.0 : this.config.cameraPitch;

    // Convertir ángulos de configuración a radianes
    const yawRad = (currentYaw * Math.PI) / 180;
    const pitchRad = (currentPitch * Math.PI) / 180;

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
    this.camera.rotation.z = -Math.cos(curvePhase) * (isPortrait ? 0.006 : 0.012);
  }
}
