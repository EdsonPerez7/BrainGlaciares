/**
 * Red de relaciones dinámica (simulación de fuerzas con d3-force).
 * - Los nodos se acomodan solos, se pueden arrastrar y vuelven a equilibrarse.
 * - Al pasar el mouse se resaltan sus conexiones; al tocar uno, el asistente sugiere preguntas.
 * - Las etiquetas van completas debajo de cada nodo y nada sale del lienzo.
 */
import { forceSimulation, forceLink, forceManyBody, forceCollide, forceX, forceY, type Simulation, type SimulationNodeDatum } from 'd3-force';

export interface NodoRed { id: string; label: string; grupo: 'l1' | 'l2' | 'compartido' | 'propio_l1' | 'propio_l2' }
interface Nodo extends SimulationNodeDatum, NodoRed { r: number }
interface Enlace { source: string | Nodo; target: string | Nodo; grupo: string }

const COLOR: Record<string, { fill: string; stroke: string; texto: string }> = {
  l1: { fill: '#0ea5e9', stroke: '#7dd3fc', texto: '#e0f2fe' },
  l2: { fill: '#d97706', stroke: '#fcd34d', texto: '#fef3c7' },
  compartido: { fill: '#0d9488', stroke: '#5eead4', texto: '#ccfbf1' },
  propio_l1: { fill: '#0369a1', stroke: '#38bdf8', texto: '#bae6fd' },
  propio_l2: { fill: '#b45309', stroke: '#fbbf24', texto: '#fde68a' },
};
const NS = 'http://www.w3.org/2000/svg';
const el = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
};

let simulacionActual: Simulation<Nodo, undefined> | null = null;

export function dibujarRed(
  svg: SVGSVGElement,
  nombres: [string, string],
  nodosEntrada: NodoRed[],
  alTocar?: (n: NodoRed) => void,
) {
  simulacionActual?.stop();
  const ancho = svg.clientWidth || 900;
  const alto = svg.clientHeight || 420;
  svg.setAttribute('viewBox', `0 0 ${ancho} ${alto}`);
  svg.replaceChildren();

  const nodos: Nodo[] = [
    { id: '__l1', label: nombres[0], grupo: 'l1', r: 34, x: ancho * 0.22, y: alto / 2 },
    { id: '__l2', label: nombres[1], grupo: 'l2', r: 34, x: ancho * 0.78, y: alto / 2 },
    ...nodosEntrada.map((n, i) => ({ ...n, r: n.grupo === 'compartido' ? 20 : 16, x: ancho / 2 + Math.cos(i) * 60, y: alto / 2 + Math.sin(i) * 60 })),
  ];
  const enlaces: Enlace[] = [];
  for (const n of nodos) {
    if (n.grupo === 'compartido') enlaces.push({ source: '__l1', target: n.id, grupo: 'compartido' }, { source: '__l2', target: n.id, grupo: 'compartido' });
    if (n.grupo === 'propio_l1') enlaces.push({ source: '__l1', target: n.id, grupo: 'propio_l1' });
    if (n.grupo === 'propio_l2') enlaces.push({ source: '__l2', target: n.id, grupo: 'propio_l2' });
  }

  // Capas
  const defs = el('defs');
  defs.innerHTML = '<filter id="brillo-red" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  const gEnlaces = el('g');
  const gNodos = el('g');
  svg.append(defs, gEnlaces, gNodos);

  const lineas = enlaces.map((e) => {
    const l = el('line', { stroke: e.grupo === 'compartido' ? '#2dd4bf' : e.grupo === 'propio_l1' ? '#38bdf8' : '#fbbf24', 'stroke-width': e.grupo === 'compartido' ? 1.6 : 1.2, 'stroke-opacity': 0.55, 'stroke-dasharray': e.grupo === 'compartido' ? '5 5' : '' });
    gEnlaces.append(l);
    return l;
  });

  const vecinos = new Map<string, Set<string>>();
  enlaces.forEach((e) => {
    const s = String(e.source), t = String(e.target);
    if (!vecinos.has(s)) vecinos.set(s, new Set()); if (!vecinos.has(t)) vecinos.set(t, new Set());
    vecinos.get(s)!.add(t); vecinos.get(t)!.add(s);
  });

  const grupos = nodos.map((n) => {
    const c = COLOR[n.grupo];
    const g = el('g', { tabindex: 0, role: 'button', 'aria-label': n.label, style: 'cursor:grab;outline:none' });
    const halo = el('circle', { r: n.r + 6, fill: c.fill, opacity: 0.18 });
    const circulo = el('circle', { r: n.r, fill: c.fill, stroke: c.stroke, 'stroke-width': n.grupo.length === 2 ? 3 : 1.5, filter: n.grupo.length === 2 ? 'url(#brillo-red)' : '' });
    g.append(halo, circulo);
    // Etiqueta completa: dentro si es laguna principal, debajo si es dato
    const palabras = n.label.length > 18 ? n.label.replace(/(.{1,18})(\s|$)/g, '$1\n').trim().split('\n').slice(0, 2) : [n.label];
    if (n.grupo.length === 2) {
      const t = el('text', { 'text-anchor': 'middle', dy: 4, fill: '#fff', 'font-size': 12.5, 'font-weight': 700 });
      t.textContent = n.label.length > 12 ? `${n.label.slice(0, 11)}…` : n.label;
      g.append(t);
    } else {
      const fondo = el('rect', { rx: 6, fill: '#0b1838', opacity: 0.85 });
      g.append(fondo);
      palabras.forEach((p, i) => {
        const t = el('text', { 'text-anchor': 'middle', y: n.r + 15 + i * 13, fill: c.texto, 'font-size': 11.5, 'font-weight': 500 });
        t.textContent = p;
        g.append(t);
      });
      requestAnimationFrame(() => {
        const textos = Array.from(g.querySelectorAll('text'));
        const anchoMax = Math.max(...textos.map((t) => (t as SVGTextElement).getComputedTextLength?.() || 60));
        Object.entries({ x: -anchoMax / 2 - 6, y: n.r + 4, width: anchoMax + 12, height: palabras.length * 13 + 6 }).forEach(([k, v]) => fondo.setAttribute(k, String(v)));
      });
    }
    // Interacción: resaltar vecinos
    const resaltar = (on: boolean) => {
      const v = vecinos.get(n.id) || new Set();
      grupos.forEach((gg, i) => { gg.style.opacity = !on || nodos[i].id === n.id || v.has(nodos[i].id) ? '1' : '0.25'; });
      lineas.forEach((l, i) => {
        const e = enlaces[i] as any;
        const toca = e.source.id === n.id || e.target.id === n.id;
        l.setAttribute('stroke-opacity', !on ? '0.55' : toca ? '1' : '0.08');
        l.setAttribute('stroke-width', on && toca ? '2.4' : e.grupo === 'compartido' ? '1.6' : '1.2');
      });
    };
    g.addEventListener('pointerenter', () => resaltar(true));
    g.addEventListener('pointerleave', () => resaltar(false));
    g.addEventListener('focus', () => resaltar(true));
    g.addEventListener('blur', () => resaltar(false));
    g.addEventListener('keydown', (ev) => { if ((ev as KeyboardEvent).key === 'Enter') alTocar?.(n); });
    gNodos.append(g);
    return g;
  });

  // Arrastre con puntero
  let arrastrado: Nodo | null = null, movio = false;
  const puntoSvg = (ev: PointerEvent) => {
    const r = svg.getBoundingClientRect();
    return { x: ((ev.clientX - r.left) / r.width) * ancho, y: ((ev.clientY - r.top) / r.height) * alto };
  };
  grupos.forEach((g, i) => g.addEventListener('pointerdown', (ev) => {
    arrastrado = nodos[i]; movio = false;
    g.setPointerCapture(ev.pointerId); g.style.cursor = 'grabbing';
    simulacion.alphaTarget(0.3).restart();
  }));
  grupos.forEach((g, i) => g.addEventListener('pointermove', (ev) => {
    if (arrastrado !== nodos[i]) return;
    const p = puntoSvg(ev); movio = true;
    arrastrado.fx = limitarX(p.x, arrastrado.r); arrastrado.fy = limitarY(p.y, arrastrado.r);
  }));
  grupos.forEach((g, i) => g.addEventListener('pointerup', () => {
    if (arrastrado !== nodos[i]) return;
    g.style.cursor = 'grab';
    if (!movio) alTocar?.(nodos[i]);
    // Las lagunas principales se quedan donde las sueltas; los datos vuelven a acomodarse
    if (nodos[i].grupo.length !== 2) { arrastrado.fx = null; arrastrado.fy = null; }
    arrastrado = null;
    simulacion.alphaTarget(0);
  }));

  const margen = 18;
  const limitarX = (x: number, r: number) => Math.max(r + margen + 40, Math.min(ancho - r - margen - 40, x));
  const limitarY = (y: number, r: number) => Math.max(r + margen, Math.min(alto - r - margen - 30, y));

  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const simulacion = forceSimulation<Nodo>(nodos)
    .force('enlace', forceLink<Nodo, any>(enlaces as any).id((d: any) => d.id).distance((e: any) => (e.grupo === 'compartido' ? ancho * 0.24 : 95)).strength(0.6))
    .force('carga', forceManyBody<Nodo>().strength((d) => (d.grupo.length === 2 ? -600 : -260)))
    .force('choque', forceCollide<Nodo>().radius((d) => d.r + (d.grupo.length === 2 ? 26 : 38)))
    .force('x', forceX<Nodo>((d) => (d.grupo === 'l1' || d.grupo === 'propio_l1' ? ancho * 0.24 : d.grupo === 'l2' || d.grupo === 'propio_l2' ? ancho * 0.76 : ancho / 2)).strength((d) => (d.grupo.length === 2 ? 0.5 : 0.12)))
    .force('y', forceY<Nodo>(alto / 2).strength(0.08))
    .on('tick', () => {
      nodos.forEach((n) => { n.x = limitarX(n.x!, n.r); n.y = limitarY(n.y!, n.r); });
      lineas.forEach((l, i) => {
        const e = enlaces[i] as any;
        l.setAttribute('x1', e.source.x); l.setAttribute('y1', e.source.y);
        l.setAttribute('x2', e.target.x); l.setAttribute('y2', e.target.y);
      });
      grupos.forEach((g, i) => g.setAttribute('transform', `translate(${nodos[i].x},${nodos[i].y})`));
    });
  if (reducido) { simulacion.stop(); for (let i = 0; i < 300; i++) simulacion.tick(); simulacion.on('tick')?.call(simulacion as any); }
  simulacionActual = simulacion;
}
