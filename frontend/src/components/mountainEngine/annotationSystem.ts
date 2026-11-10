import * as THREE from 'three';
import { type GlacialBasin } from './terrainGenerator';

interface PinElement {
  id: string;
  type: 'peak' | 'lagoon';
  basin: GlacialBasin;
  element: HTMLElement;
  pos3D: THREE.Vector3;
  screenPos: THREE.Vector2;
  visible: boolean;
}

export class AnnotationSystem {
  private container: HTMLElement;
  private basins: GlacialBasin[];
  private totalLength: number;
  private pins: PinElement[] = [];
  private svgLinesLayer: SVGSVGElement | null = null;
  private connectionLinesGroup: THREE.Group;
  private isEnabled: boolean = true;
  private tempVec = new THREE.Vector3();

  constructor(
    container: HTMLElement,
    basins: GlacialBasin[],
    totalLength: number,
    getTerrainHeight: (x: number, z: number) => number
  ) {
    this.container = container;
    this.basins = basins;
    this.totalLength = totalLength;
    this.connectionLinesGroup = new THREE.Group();

    this.initDOM(getTerrainHeight);
    this.init3DConnectionLines(getTerrainHeight);
  }

  public getConnectionGroup(): THREE.Group {
    return this.connectionLinesGroup;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    this.container.style.display = enabled ? 'block' : 'none';
    this.connectionLinesGroup.visible = enabled;
  }

  public toggle(): boolean {
    this.setEnabled(!this.isEnabled);
    return this.isEnabled;
  }

  private initDOM(getTerrainHeight?: (x: number, z: number) => number) {
    this.container.innerHTML = '';

    // Capa SVG para las líneas conectoras 2D (Nevado -> Laguna)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'absolute inset-0 w-full h-full pointer-events-none');
    svg.style.zIndex = '5';
    this.container.appendChild(svg);
    this.svgLinesLayer = svg;

    // Crear elementos de pin para cada cuenca (Nevado y Laguna)
    this.basins.forEach((basin) => {
      // 1. Pin para el Nevado (Cumbre)
      const peakEl = document.createElement('div');
      peakEl.className = 'landmark-pin landmark-pin-peak absolute top-0 left-0 transition-opacity duration-300 pointer-events-auto cursor-pointer select-none';
      peakEl.style.transform = 'translate(-50%, -100%)';
      peakEl.style.zIndex = '15';
      peakEl.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="group relative flex items-center gap-2 bg-slate-950/90 hover:bg-slate-900 border border-sky-400/40 hover:border-sky-300/90 px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md transition-all scale-95 hover:scale-105 ring-1 ring-white/10">
            <div class="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0">
              <svg class="w-3.5 h-3.5 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 22h20L12 2zm0 6l4 8H8l4-8z" />
              </svg>
            </div>
            <div class="flex flex-col text-left whitespace-nowrap">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-white tracking-tight">${basin.peakName || 'Nevado'}</span>
                <span class="text-[10px] font-mono font-bold bg-sky-500/25 text-sky-300 border border-sky-400/30 px-1.5 py-0.2 rounded">${basin.peakRealAltitude?.toLocaleString() || '6,000'} m</span>
              </div>
              <div class="flex items-center gap-1.5 text-[9px] text-slate-400">
                <span class="text-amber-300 font-semibold">${basin.colosoRank || basin.cordillera}</span>
                <span>·</span>
                <span class="text-slate-300">${basin.departamento || 'Andes'}</span>
              </div>
            </div>
          </div>
          <div class="w-0.5 h-3 bg-gradient-to-b from-sky-400/80 to-transparent"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-sky-300 ring-2 ring-sky-400/40 shadow-xs"></div>
        </div>
      `;

      peakEl.addEventListener('click', () => {
        window.location.href = `/buscar?q=${encodeURIComponent(basin.peakName || basin.name)}`;
      });

      this.container.appendChild(peakEl);

      const peakActualY = getTerrainHeight ? getTerrainHeight(basin.peakSourceX, basin.peakSourceZ) + 8.0 : basin.peakElevation + 8.0;
      this.pins.push({
        id: `peak-${basin.id}`,
        type: 'peak',
        basin,
        element: peakEl,
        pos3D: new THREE.Vector3(basin.peakSourceX, peakActualY, basin.peakSourceZ),
        screenPos: new THREE.Vector2(),
        visible: false
      });

      // 2. Pin para la Laguna (Cuenca de Deshielo)
      const lagoonEl = document.createElement('div');
      lagoonEl.className = 'landmark-pin landmark-pin-lagoon absolute top-0 left-0 transition-opacity duration-300 pointer-events-auto cursor-pointer select-none';
      lagoonEl.style.transform = 'translate(-50%, -100%)';
      lagoonEl.style.zIndex = '14';
      
      const isHighRisk = basin.lagoonRisk === 'Muy alto';
      const riskClass = isHighRisk 
        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
        : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

      lagoonEl.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="group relative flex items-center gap-2 bg-slate-950/90 hover:bg-slate-900 border border-cyan-400/40 hover:border-cyan-300/90 px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md transition-all scale-95 hover:scale-105 ring-1 ring-white/10">
            <div class="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
              <svg class="w-3.5 h-3.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
              </svg>
            </div>
            <div class="flex flex-col text-left whitespace-nowrap">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-white tracking-tight">${basin.name}</span>
                <span class="text-[10px] font-mono font-bold bg-cyan-500/25 text-cyan-300 border border-cyan-400/30 px-1.5 py-0.2 rounded">${basin.lagoonRealAltitude?.toLocaleString() || '4,500'} m</span>
                <span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${riskClass}">
                  ${basin.lagoonRisk || 'Alerta'}
                </span>
              </div>
              <div class="text-[9px] text-slate-400 flex items-center gap-1">
                <span class="text-sky-300 font-medium">Alimentada por ${basin.peakName}</span>
                ${basin.lagoonVolumeTexto ? `<span class="text-slate-400">· ${basin.lagoonVolumeTexto.split('(')[0]}</span>` : ''}
              </div>
            </div>
          </div>
          <div class="w-0.5 h-3 bg-gradient-to-b from-cyan-400/80 to-transparent"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-cyan-300 ring-2 ring-cyan-400/40 shadow-xs"></div>
        </div>
      `;

      lagoonEl.addEventListener('click', () => {
        window.location.href = `/buscar?q=${encodeURIComponent(basin.name)}`;
      });

      this.container.appendChild(lagoonEl);

      this.pins.push({
        id: `lagoon-${basin.id}`,
        type: 'lagoon',
        basin,
        element: lagoonEl,
        pos3D: new THREE.Vector3(basin.centerX, basin.waterLevel + 4.0, basin.centerZ),
        screenPos: new THREE.Vector2(),
        visible: false
      });
    });
  }

  /**
   * Genera líneas 3D sutiles y luminosas en Three.js que conectan la cumbre con la laguna
   */
  private init3DConnectionLines(getTerrainHeight: (x: number, z: number) => number) {
    this.connectionLinesGroup.clear();

    const lineMaterial = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      linewidth: 1,
      scale: 1,
      dashSize: 12,
      gapSize: 6,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.basins.forEach(basin => {
      for (let cycle = 0; cycle <= 1; cycle++) {
        const offsetZ = -cycle * this.totalLength;
        const points: THREE.Vector3[] = [];
        const numSteps = 16;
        for (let i = 0; i <= numSteps; i++) {
          const t = i / numSteps;
          const x = THREE.MathUtils.lerp(basin.peakSourceX, basin.centerX, t);
          const z = THREE.MathUtils.lerp(basin.peakSourceZ, basin.centerZ, t);
          const terrainY = getTerrainHeight(x, z, this.totalLength);
          const y = Math.max(terrainY + 2.5, THREE.MathUtils.lerp(basin.peakElevation, basin.waterLevel, t) + 2.0);
          points.push(new THREE.Vector3(x, y, z + offsetZ));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const curvePoints = curve.getPoints(32);
        const geom = new THREE.BufferGeometry().setFromPoints(curvePoints);
        
        const line = new THREE.Line(geom, lineMaterial);
        line.computeLineDistances();
        this.connectionLinesGroup.add(line);
      }
    });
  }

  /**
   * Actualización por frame proyectando las coordenadas 3D a la pantalla 2D
   */
  public update(camera: THREE.PerspectiveCamera, canvasWidth: number, canvasHeight: number) {
    if (!this.isEnabled) return;

    const camPos = camera.position;
    const L = this.totalLength;

    // Matriz de vista-proyección
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();

    // Actualizar posición de cada pin
    for (let i = 0; i < this.pins.length; i++) {
      const pin = this.pins[i];

      // Calcular la instancia Z más cercana al vuelo de la cámara (ciclo toroidal [-5600, 0])
      let bestZ = pin.pos3D.z;
      let minDeltaZ = Math.abs(bestZ - camPos.z);
      
      for (let offset = -L; offset <= L; offset += L) {
        const testZ = pin.pos3D.z + offset;
        const deltaZ = Math.abs(testZ - camPos.z);
        if (deltaZ < minDeltaZ) {
          minDeltaZ = deltaZ;
          bestZ = testZ;
        }
      }

      this.tempVec.set(pin.pos3D.x, pin.pos3D.y, bestZ);
      const distToCam = this.tempVec.distanceTo(camPos);

      // Distancia de corte: demasiado cerca (< 140m) o demasiado lejos (> 1350m en la niebla)
      if (distToCam < 140 || distToCam > 1350) {
        if (pin.visible) {
          pin.element.style.opacity = '0';
          pin.element.style.pointerEvents = 'none';
          pin.visible = false;
        }
        continue;
      }

      // Proyectar al espacio normalizado [-1, 1]
      this.tempVec.project(camera);

      // Si el punto está detrás del plano de la cámara (z > 1.0) o fuera de los márgenes
      if (
        this.tempVec.z > 1.0 || 
        this.tempVec.x < -1.1 || this.tempVec.x > 1.1 || 
        this.tempVec.y < -1.1 || this.tempVec.y > 1.1
      ) {
        if (pin.visible) {
          pin.element.style.opacity = '0';
          pin.element.style.pointerEvents = 'none';
          pin.visible = false;
        }
        continue;
      }

      // Convertir a coordenadas de pantalla (px)
      const screenX = (this.tempVec.x * 0.5 + 0.5) * canvasWidth;
      const screenY = (-this.tempVec.y * 0.5 + 0.5) * canvasHeight;

      pin.screenPos.set(screenX, screenY);

      // Escala y opacidad suaves según distancia
      const scale = THREE.MathUtils.lerp(1.0, 0.75, (distToCam - 200) / 1000);
      const opacity = THREE.MathUtils.clamp((1350 - distToCam) / 350, 0, 1) * THREE.MathUtils.clamp((distToCam - 140) / 100, 0, 1);

      pin.element.style.transform = `translate(${screenX}px, ${screenY}px) translate(-50%, -100%) scale(${scale.toFixed(3)})`;
      pin.element.style.opacity = opacity.toFixed(3);
      pin.element.style.pointerEvents = opacity > 0.4 ? 'auto' : 'none';
      pin.visible = true;
    }

    // Dibujar líneas conectoras SVG en pantalla entre Nevado y Laguna cuando ambos son visibles
    this.updateSVGLines();
  }

  private updateSVGLines() {
    if (!this.svgLinesLayer) return;

    let svgContent = '';
    const numPairs = this.basins.length;

    for (let b = 0; b < numPairs; b++) {
      const peakPin = this.pins[b * 2];
      const lagoonPin = this.pins[b * 2 + 1];

      if (peakPin && lagoonPin && peakPin.visible && lagoonPin.visible) {
        const x1 = peakPin.screenPos.x;
        const y1 = peakPin.screenPos.y;
        const x2 = lagoonPin.screenPos.x;
        const y2 = lagoonPin.screenPos.y;

        // Curva Bézier sutil que evoca el flujo de deshielo
        const dx = x2 - x1;
        const dy = y2 - y1;
        const cx1 = x1 + dx * 0.3;
        const cy1 = y1 + dy * 0.1 - 25;
        const cx2 = x1 + dx * 0.7;
        const cy2 = y2 - 15;

        svgContent += `
          <path d="M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}" 
                fill="none" 
                stroke="#38bdf8" 
                stroke-width="1.8" 
                stroke-dasharray="6,4" 
                stroke-opacity="0.55" 
                class="animate-pulse" />
        `;
      }
    }

    this.svgLinesLayer.innerHTML = svgContent;
  }

  public destroy() {
    this.container.innerHTML = '';
    this.connectionLinesGroup.clear();
  }
}
