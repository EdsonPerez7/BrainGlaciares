// noise.ts: Motor determinista de ruido fractal, Ridged Multifractal y Domain Warping

export function createPRNG(seed: number) {
  let s = seed | 0;
  return function (): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class FractalNoise {
  private perm: Uint8Array = new Uint8Array(512);

  constructor(seed: number = 1337) {
    this.reseed(seed);
  }

  public reseed(seed: number) {
    const rng = createPRNG(seed);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = p[i];
      p[i] = p[j];
      p[j] = tmp;
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  /**
   * Ruido base 2D continuo en rango [-1, 1]
   */
  public noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = this.fade(xf);
    const v = this.fade(yf);

    const p = this.perm;
    const aa = p[p[X] + Y];
    const ab = p[p[X] + Y + 1];
    const ba = p[p[X + 1] + Y];
    const bb = p[p[X + 1] + Y + 1];

    const x1 = this.lerp(this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf), u);
    const x2 = this.lerp(this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1), u);

    return this.lerp(x1, x2, v);
  }

  /**
   * Fractal Brownian Motion (FBM) para detalle multicapa
   */
  public fbm(x: number, y: number, octaves = 5, lacunarity = 2.05, gain = 0.5): number {
    let sum = 0;
    let amp = 1.0;
    let freq = 1.0;
    let max = 0;

    for (let i = 0; i < octaves; i++) {
      sum += this.noise2D(x * freq, y * freq) * amp;
      max += amp;
      freq *= lacunarity;
      amp *= gain;
    }
    return sum / max;
  }

  /**
   * Ridged Multifractal Noise:
   * Afila las crestas orográficas mediante 1.0 - abs(noise) con exponente
   */
  public ridgedMF(x: number, y: number, octaves = 5, lacunarity = 2.15, gain = 0.52): number {
    let sum = 0;
    let freq = 1.0;
    let amp = 1.0;
    let weight = 1.0;
    let max = 0;

    for (let i = 0; i < octaves; i++) {
      let n = 1.0 - Math.abs(this.noise2D(x * freq, y * freq));
      n = n * n; // Afilado cuadrático de aristas
      n *= weight;
      weight = Math.min(1.0, Math.max(0.0, n * 2.0)); // Auto-modulación natural

      sum += n * amp;
      max += amp;
      freq *= lacunarity;
      amp *= gain;
    }
    return sum / max;
  }

  /**
   * Domain Warping:
   * Deforma las coordenadas mediante vectores de ruido previos para simular
   * plegamientos tectónicos reales
   */
  public warpedRidged(
    x: number,
    y: number,
    warpFreq = 0.0025,
    warpAmp = 45.0,
    ridgeFreq = 0.0055
  ): number {
    const qx = this.fbm(x * warpFreq, y * warpFreq, 3);
    const qy = this.fbm((x + 7.3) * warpFreq, (y + 2.8) * warpFreq, 3);

    const rx = this.fbm((x + warpAmp * qx + 1.7) * warpFreq, (y + warpAmp * qy + 9.2) * warpFreq, 3);
    const ry = this.fbm((x + warpAmp * qx + 8.3) * warpFreq, (y + warpAmp * qy + 2.8) * warpFreq, 3);

    const finalX = x + warpAmp * rx;
    const finalY = y + warpAmp * ry;

    return this.ridgedMF(finalX * ridgeFreq, finalY * ridgeFreq, 5);
  }
}
