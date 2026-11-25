// LUL 01-11 (aprobado 2026-11-25): acabado con motion de marca (pin, ruta, lote, ambientes, pasos, ampliar, plano, precio + sello).
// Usa ./fonts (Montserrat local + Begum por el kit del editor, ver plantilla-remotion-14-10.tsx) y eyes.json (track_cara.swift de la base). Referencia, no plantilla cerrada.
import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BG, MS} from './fonts';
import EYES from './eyes.json';

// LUL 01-11 — acabado sobre la estructura aprobada (2026-11-25). El audio se mezcla aparte (mezcla.py) y se pega con ffmpeg.
export const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
export const FRAMES = 1448;
const ROJO = '#ED2738', INDIGO = '#2D2A78', AZUL = '#3A35E7';

// ---------- montaje: cortes del B-roll en la grilla de Funkee Monkeee (120 BPM, un tiempo cada 0,5 s desde t = 0) ----------
type Eyes = {t0: number; ex: number[]; ey: number[]; chin: number[]; top: number[]};
type Spk = {src: string; a: number; b: number; off: number; eyes: Eyes; zoom: number[][]};
// off = segundo de la toma − segundo del video
const HOOK: Spk = {src: 'IMG_9386', a: 0, b: 5.0, off: 0.92, eyes: EYES.hook as Eyes, zoom: [[0, 1.0], [2.45, 1.07], [2.47, 1.18], [5.0, 1.26]]};
const CTA1: Spk = {src: 'IMG_9390', a: 44.5, b: 46.4, off: 0.39 - 44.3667, eyes: EYES.cta as Eyes, zoom: [[44.5, 1.06], [46.4, 1.16]]};
const CTA2: Spk = {src: 'IMG_9390', a: 46.4, b: 48.2667, off: 2.71 - 46.4, eyes: EYES.cta as Eyes, zoom: [[46.4, 1.3], [48.27, 1.38]]};
type Clip = [string, number, number, number, number, number]; // archivo, desde, hasta, inicio en la toma, zoom inicial → final
const BROLL: Clip[] = [
  ['IMG_9300', 5.0, 7.5, 1.0, 1.0, 1.07], // Estamos en La Rosa al 1400
  ['IMG_9301', 7.5, 11.5, 0.3, 1.06, 1.0], // tranquila zona residencial, a pocas cuadras del centro
  ['IMG_9296', 11.5, 14.5, 0.4, 1.0, 1.07], // lote de 204 m²
  ['IMG_9293', 14.5, 17.0, 0.2, 1.0, 1.08], // casa de construcción tradicional
  ['IMG_9293', 17.0, 18.0, 3.6, 1.08, 1.02], // living
  ['IMG_9293', 18.0, 19.0, 14.2, 1.0, 1.06], // cocina
  ['IMG_9294', 19.0, 19.75, 0.5, 1.07, 1.02], // comedor
  ['IMG_9293', 19.75, 20.5, 23.4, 1.0, 1.06], // dormitorio
  ['IMG_9293', 20.5, 21.5, 32.0, 1.06, 1.0], // baño completo
  ['IMG_9295', 21.5, 23.0, 2.6, 1.0, 1.06], // espacios exteriores
  ['IMG_9299', 23.0, 25.5, 2.2, 1.08, 1.0], // necesita una refacción integral
  ['IMG_9296', 25.5, 27.5, 3.3, 1.0, 1.06], // ofrece distintas posibilidades
  ['IMG_9301', 27.5, 29.5, 9.8, 1.06, 1.0], // 1 recuperar la vivienda
  ['IMG_9293', 29.5, 31.0, 6.2, 1.0, 1.06], // 2 reorganizar sus ambientes
  ['IMG_9295', 31.0, 32.5, 14.2, 1.0, 1.08], // 3 ampliarla
  ['IMG_9297', 32.5, 34.0, 0.0, 1.06, 1.0], // 4 proyecto nuevo
  ['IMG_9300', 34.0, 37.0, 4.3, 1.0, 1.06], // una alternativa interesante para quienes buscan comprar
  ['IMG_9294', 37.0, 39.0, 2.0, 1.06, 1.0], // y transformarla a su gusto
  ['IMG_9297', 39.0, 41.5, 2.2, 1.0, 1.06], // y un dato importante, su valor es de
  ['IMG_9295', 41.5, 44.5, 9.0, 1.06, 1.0], // USD 85.000, se escuchan ofertas
];
const CORTES = [5.0, ...BROLL.slice(1).map((c) => c[1]), 44.5];
const ZOOMBLUR = [5.0, 44.5];
const LEAKS = [5.0, 23.0, 39.0, 44.5];

const zoomAt = (Z: number[][], t: number) => {
  if (t <= Z[0][0]) return Z[0][1];
  for (let i = 0; i < Z.length - 1; i++) {
    const [a, sa] = Z[i], [b, sb] = Z[i + 1];
    if (t <= b) return sa + (sb - sa) * Easing.inOut(Easing.sin)((t - a) / Math.max(1e-6, b - a));
  }
  return Z[Z.length - 1][1];
};
const idx = (E: Eyes, srcT: number) => Math.max(0, Math.min(E.ex.length - 1, Math.round((srcT - E.t0) * FPS)));
// posición en pantalla de mentón y pelo con el zoom anclado a los ojos (los ojos no se mueven)
const chinAt = (s: Spk, t: number) => { const i = idx(s.eyes, t + s.off); return s.eyes.ey[i] + (s.eyes.chin[i] + 18 - s.eyes.ey[i]) * zoomAt(s.zoom, t); };
const topAt = (s: Spk, t: number) => { const i = idx(s.eyes, t + s.off); return s.eyes.ey[i] - (s.eyes.ey[i] - s.eyes.top[i] + 40) * zoomAt(s.zoom, t); };
const spkAt = (t: number) => [HOOK, CTA1, CTA2].find((s) => t >= s.a && t < s.b);
const range = (a: number, b: number) => Array.from({length: Math.max(1, f(b) - f(a))}, (_, i) => a + i / FPS);
const bajoMenton = (a: number, b: number, aire = 24) => Math.max(...range(a, b).map((t) => { const s = spkAt(t); return s ? chinAt(s, t) : 0; })) + aire;
const sobrePelo = (a: number, b: number, aire = 26) => Math.min(...range(a, b).map((t) => { const s = spkAt(t); return s ? topAt(s, t) : 1920; })) - aire;

// ---------- transiciones: zoom-blur (anclado a los ojos) al entrar/salir del speaker, whip en el B-roll ----------
const RADIO = 3.5;
const trans = (t: number) => {
  let e = 0, c0 = 0;
  for (const c of CORTES) {
    const v = 1 - Math.abs(t - c) * FPS / RADIO;
    if (v > e) { e = v; c0 = c; }
  }
  return {e: Math.max(0, e), side: t < c0 ? -1 : 1, zb: ZOOMBLUR.some((z) => Math.abs(z - c0) < 0.02), dir: CORTES.indexOf(c0) % 2 ? 1 : -1};
};
const transStyle = (t: number, ox: number, oy: number): React.CSSProperties => {
  const {e, side, zb, dir} = trans(t);
  if (e <= 0) return {};
  if (!zb) return {transform: `translateX(${dir * -side * 170 * e}px) scale(${1 + 0.45 * e})`, filter: `url(#whip${Math.round(e * 10)})`};
  return {transform: `scale(${1 + 0.3 * e})`, transformOrigin: `${ox}px ${oy}px`, filter: `blur(${16 * e}px)`};
};
const WhipFilters: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    {Array.from({length: 11}, (_, i) => (
      <filter key={i} id={`whip${i}`} x="-10%" y="0" width="120%" height="100%">
        <feGaussianBlur stdDeviation={`${i * 5} 0`} edgeMode="duplicate" />
      </filter>
    ))}
  </svg>
);
const Speaker: React.FC<{s: Spk}> = ({s}) => {
  const t = s.a + useCurrentFrame() / FPS;
  const i = idx(s.eyes, t + s.off);
  const ex = s.eyes.ex[i], ey = s.eyes.ey[i];
  return (
    <AbsoluteFill style={transStyle(t, ex, ey)}>
      <AbsoluteFill style={{transform: `scale(${zoomAt(s.zoom, t)})`, transformOrigin: `${ex}px ${ey}px`}}>
        <OffthreadVideo src={staticFile(`lul0111/${s.src}.mp4`)} startFrom={Math.round((s.a + s.off) * FPS)} muted style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Broll: React.FC<{clip: Clip}> = ({clip}) => {
  const [name, a, b, srcIn, z0, z1] = clip;
  const t = a + useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={transStyle(t, 540, 960)}>
      <AbsoluteFill style={{transform: `scale(${interpolate(t, [a, b], [z0, z1])})`}}>
        <OffthreadVideo src={staticFile(`lul0111/${name}.mp4`)} startFrom={Math.round(srcIn * FPS)} muted style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Leak: React.FC<{at: number}> = ({at}) => {
  const t = useCurrentFrame() / FPS;
  const o = interpolate(t, [at - 0.2, at, at + 0.45], [0, 0.75, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  const x = interpolate(t, [at - 0.2, at + 0.45], [-100, 1180]);
  return <AbsoluteFill style={{mixBlendMode: 'screen', opacity: o,
    background: `radial-gradient(circle 760px at ${x}px 520px, rgba(255,120,90,0.95), rgba(237,39,56,0.45) 45%, rgba(237,39,56,0) 75%)`}} />;
};
// velo suave detrás de un texto (fondos claros: cielo, paredes blancas)
const Velo: React.FC<{a: number; b: number; y: number; h?: number; k?: number}> = ({a, b, y, h = 13, k = 0.45}) => {
  const t = useCurrentFrame() / FPS;
  const o = interpolate(t, [a - 0.12, a + 0.12, b - 0.15, b], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  return <AbsoluteFill style={{opacity: o, background: `radial-gradient(ellipse 78% ${h}% at 50% ${y}px, rgba(14,14,40,${k}), rgba(0,0,0,0) 100%)`}} />;
};

// ---------- tipografía (skill LUL §2–4) ----------
const SOMBRA = '0 2px 4px rgba(0,0,0,0.55), 0 3px 18px rgba(0,0,0,0.6), 0 0 34px rgba(0,0,0,0.35)';
const fina = (size: number, weight = 300): React.CSSProperties => ({fontFamily: MS, fontWeight: weight, fontSize: size, color: 'white',
  textShadow: SOMBRA, lineHeight: 1, letterSpacing: -size * 0.02});
const DEG: React.CSSProperties = {padding: '0.3em 0.08em 0.2em', margin: '-0.3em -0.08em -0.2em', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'};
const plata = (size: number): React.CSSProperties => ({fontFamily: BG, fontWeight: 400, fontSize: size, lineHeight: 0.85, letterSpacing: -size * 0.02,
  backgroundImage: 'linear-gradient(180deg, #FFFFFF 15%, #D8D8D8 55%, #9A9A9A 100%)', ...DEG,
  filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.6)) drop-shadow(0 0 18px rgba(0,0,0,0.35))'});
const rojo = (size: number): React.CSSProperties => ({fontFamily: MS, fontWeight: 900, fontSize: size, lineHeight: 0.85, letterSpacing: -size * 0.03, display: 'inline-block', marginTop: -size * 0.12,
  backgroundImage: 'linear-gradient(180deg, #F16275 0%, #ED2738 50%, #D61E28 100%)', ...DEG,
  filter: 'drop-shadow(0 0 14px rgba(237,39,56,0.75)) drop-shadow(0 0 34px rgba(237,39,56,0.45)) drop-shadow(0 4px 6px rgba(0,0,0,0.5))'});
const azul = (size: number): React.CSSProperties => ({...rojo(size), backgroundImage: 'linear-gradient(180deg, #7C7BFF 0%, #3A35E7 55%, #5F5EC9 100%)',
  filter: 'drop-shadow(0 0 14px rgba(58,53,231,0.8)) drop-shadow(0 0 30px rgba(58,53,231,0.45)) drop-shadow(0 4px 6px rgba(0,0,0,0.5))'});
const indigoBorde = (size: number): React.CSSProperties => ({fontFamily: MS, fontWeight: 900, fontSize: size, lineHeight: 0.9, letterSpacing: -size * 0.03,
  color: INDIGO, WebkitTextStroke: `${Math.round(size * 0.14)}px white`, paintOrder: 'stroke fill', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.45))'});

const useIn = (at: number, out: number, kind: 'pop' | 'up' | 'slam') => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  const p = spring({frame: frame - f(at), fps, config: {damping: kind === 'up' ? 16 : 11, stiffness: kind === 'slam' ? 260 : 180, mass: 0.7}});
  const o = interpolate(t, [out - 0.15, out], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const vis = t >= at - 0.001 && t < out;
  const blur = Math.max(0, interpolate(p, [0, 1], [10, 0], {extrapolateRight: 'clamp'})) + interpolate(t, [out - 0.15, out], [0, 8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const transform = kind === 'up' ? `translateY(${interpolate(p, [0, 1], [30, 0])}px)` : `scale(${interpolate(p, [0, 1], [kind === 'slam' ? 1.6 : 0.5, 1])})`;
  return {opacity: vis ? Math.min(1, p * 1.6) * o : 0, transform, filter: blur > 0.05 ? `blur(${blur}px)` : undefined} as React.CSSProperties;
};
const Line: React.FC<{at: number; out: number; kind?: 'pop' | 'up' | 'slam'; style?: React.CSSProperties; children: React.ReactNode}> = ({at, out, kind = 'up', style, children}) => {
  const st = useIn(at, out, kind);
  return <div style={{...st, textAlign: 'center', whiteSpace: 'nowrap', ...style}}>{children}</div>;
};
// bloque centrado en x = 540; top, centro o base (bottom) en y
const Bloque: React.FC<{top?: number; center?: number; bottom?: number; gap?: number; children: React.ReactNode}> = ({top, center, bottom, gap = 0, children}) => (
  <div style={{position: 'absolute', left: 0, width: 1080, top: bottom !== undefined ? undefined : center ?? top, bottom: bottom !== undefined ? 1920 - bottom : undefined,
    transform: center !== undefined ? 'translateY(-50%)' : undefined, display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>{children}</div>
);
const prog = (t: number, a: number, b: number, ease = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
const salida = (t: number, out: number) => interpolate(t, [out - 0.16, out], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const PinSvg: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
  <svg width={size * 0.8} height={size} viewBox="0 0 100 125" style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5)) drop-shadow(0 0 12px rgba(237,39,56,0.55))', ...style}}>
    <path d="M50 4 C24 4 6 23 6 48 C6 82 50 121 50 121 C50 121 94 82 94 48 C94 23 76 4 50 4 Z" fill={ROJO} stroke="white" strokeWidth={7} />
    <circle cx={50} cy={48} r={16} fill="white" />
  </svg>
);
const Paso: React.FC<{n: number}> = ({n}) => (
  <div style={{width: 104, height: 104, borderRadius: 52, background: 'linear-gradient(180deg, #F16275, #ED2738 50%, #D61E28)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 26px rgba(237,39,56,0.7), 0 6px 14px rgba(0,0,0,0.45)', margin: '0 auto 20px', border: '5px solid white'}}>
    <span style={{fontFamily: MS, fontWeight: 900, fontSize: 64, color: 'white', lineHeight: 1, marginTop: -4}}>{n}</span>
  </div>
);

// ---------- MOTION 1: pin que cae sobre la casa (La Rosa al 1400) ----------
const PinCasa: React.FC<{at: number; out: number; x: number; y: number}> = ({at, out, x, y}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t < at || t >= out) return null;
  const p = spring({frame: frame - f(at), fps, config: {damping: 9, stiffness: 160, mass: 0.8}});
  const ring = ((t - at) % 1.1) / 1.1;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: salida(t, out) * Math.min(1, p * 2)}}>
      <ellipse cx={x} cy={y + 4} rx={80 * ring + 20} ry={(80 * ring + 20) * 0.3} fill="none" stroke="white" strokeWidth={5} opacity={1 - ring} />
      <ellipse cx={x} cy={y + 4} rx={26} ry={8} fill="rgba(0,0,0,0.45)" />
      <g transform={`translate(${x - 46} ${y - 116 + interpolate(p, [0, 1], [-170, 0])}) scale(0.92)`} style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5)) drop-shadow(0 0 14px rgba(237,39,56,0.6))'}}>
        <path d="M50 4 C24 4 6 23 6 48 C6 82 50 124 50 124 C50 124 94 82 94 48 C94 23 76 4 50 4 Z" fill={ROJO} stroke="white" strokeWidth={7} />
        <circle cx={50} cy={48} r={16} fill="white" />
      </g>
    </svg>
  );
};

// ---------- MOTION 2: ruta casa → centro de Adrogué ("a pocas cuadras") ----------
const Ruta: React.FC<{at: number; out: number; y: number}> = ({at, out, y}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t < at || t >= out) return null;
  const X0 = 250, X1 = 830;
  const pc = spring({frame: frame - f(at), fps, config: {damping: 12, stiffness: 200, mass: 0.6}});
  const u = prog(t, at + 0.2, at + 1.0, Easing.inOut(Easing.cubic));
  const pp = spring({frame: frame - f(at + 0.95), fps, config: {damping: 9, stiffness: 170, mass: 0.7}});
  const xe = X0 + (X1 - X0) * u;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: salida(t, out), filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.55))'}}>
      <line x1={X0 + 50} y1={y} x2={Math.max(X0 + 50, xe - 30)} y2={y} stroke="white" strokeWidth={9} strokeLinecap="round" strokeDasharray="4 26" />
      {/* casa */}
      <g transform={`translate(${X0} ${y}) scale(${pc})`}>
        <circle r={52} fill={INDIGO} stroke="white" strokeWidth={6} />
        <path d="M -24 6 L 0 -18 L 24 6 M -16 0 L -16 22 L 16 22 L 16 0" fill="none" stroke="white" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* centro */}
      {t >= at + 0.95 && <g transform={`translate(${X1 - 40} ${y - 110 + interpolate(pp, [0, 1], [-60, 0])})`}>
        <path d="M40 3 C19 3 5 18 5 38 C5 65 40 98 40 98 C40 98 75 65 75 38 C75 18 61 3 40 3 Z" fill={ROJO} stroke="white" strokeWidth={6} />
        <circle cx={40} cy={38} r={13} fill="white" />
      </g>}
    </svg>
  );
};

// ---------- MOTION 3: plano del lote (rectángulo con cotas) + contador 204 m² ----------
const Lote: React.FC<{at: number; out: number; cy: number; c0: number; c1: number}> = ({at, out, cy, c0, c1}) => {
  const t = useCurrentFrame() / FPS;
  if (t < at || t >= out) return null;
  const W = 520, H = 300, x0 = 540 - W / 2, y0 = cy - H / 2;
  const u = prog(t, at, at + 0.7, Easing.inOut(Easing.cubic));
  const v = Math.round(interpolate(t, [c0, c1], [0, 204], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const cot = prog(t, at + 0.5, at + 0.9);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: salida(t, out)}}>
      <svg width={1080} height={1920} style={{position: 'absolute', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))'}}>
        <rect x={x0} y={y0} width={W} height={H} fill={`rgba(18,18,45,${0.62 * u})`} stroke="white" strokeWidth={7} strokeDasharray="22 14"
          pathLength={1000} style={{strokeDasharray: `${1000 * u} 1000`}} />
        {[[x0, y0], [x0 + W, y0], [x0, y0 + H], [x0 + W, y0 + H]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={11 * u} fill={ROJO} stroke="white" strokeWidth={4} />
        ))}
        <g opacity={cot}>
          <line x1={x0} y1={y0 + H + 44} x2={x0 + W} y2={y0 + H + 44} stroke="white" strokeWidth={4} />
          <line x1={x0} y1={y0 + H + 28} x2={x0} y2={y0 + H + 60} stroke="white" strokeWidth={4} />
          <line x1={x0 + W} y1={y0 + H + 28} x2={x0 + W} y2={y0 + H + 60} stroke="white" strokeWidth={4} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, width: 1080, top: cy, transform: 'translateY(-50%)', textAlign: 'center', opacity: t >= c0 ? 1 : 0}}>
        <span style={azul(136)}>{v} m²</span>
      </div>
    </div>
  );
};

// ---------- MOTION 4: ícono de cada ambiente (círculo rojo + dibujo de línea) ----------
const ICON: Record<string, string> = {
  living: 'M -30 8 L -30 -6 Q -30 -14 -22 -14 L 22 -14 Q 30 -14 30 -6 L 30 8 M -36 8 L 36 8 L 36 22 L -36 22 Z M -30 22 L -30 30 M 30 22 L 30 30',
  cocina: 'M -30 -6 L 30 -6 L 26 26 L -26 26 Z M -38 -6 L 38 -6 M -10 -20 Q -6 -26 -10 -32 M 6 -20 Q 10 -26 6 -32',
  comedor: 'M -36 -8 L 36 -8 M -28 -8 L -28 26 M 28 -8 L 28 26 M -8 -24 L -8 -8 M 8 -24 L 8 -8 M -14 -24 L 14 -24',
  dormitorio: 'M -36 -20 L -36 26 M -36 10 L 36 10 L 36 26 M -36 -2 L 36 -2 L 36 10 M -28 -2 L -28 -14 L -6 -14 L -6 -2',
  bano: 'M -34 0 L 34 0 L 28 22 L -28 22 Z M -24 0 L -24 -26 Q -24 -32 -16 -32 Q -8 -32 -8 -24 M -20 22 L -24 30 M 20 22 L 24 30',
  exterior: 'M 0 -32 L 22 0 L 10 0 L 26 20 L -26 20 L -10 0 L -22 0 Z M 0 20 L 0 32',
};
const Icono: React.FC<{k: string; at: number}> = ({k, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - f(at), fps, config: {damping: 10, stiffness: 200, mass: 0.6}});
  const d = prog(frame / FPS, at + 0.05, at + 0.4);
  return (
    <svg width={120} height={120} viewBox="-60 -60 120 120" style={{display: 'block', margin: '0 auto 18px', transform: `scale(${p})`, filter: 'drop-shadow(0 0 16px rgba(237,39,56,0.55)) drop-shadow(0 4px 8px rgba(0,0,0,0.45))'}}>
      <circle r={54} fill="url(#gRojo)" stroke="white" strokeWidth={5} />
      <defs><linearGradient id="gRojo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F16275" /><stop offset="0.5" stopColor="#ED2738" /><stop offset="1" stopColor="#D61E28" /></linearGradient></defs>
      <path d={ICON[k]} fill="none" stroke="white" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
    </svg>
  );
};
const Ambiente: React.FC<{k: string; at: number; out: number; label: string; estilo: 'rojo' | 'indigo'; size?: number; pre?: string}> = ({k, at, out, label, estilo, size = 104, pre}) => {
  const t = useCurrentFrame() / FPS;
  if (t < at - 0.01 || t >= out) return null;
  return (
    <Bloque center={930}>
      <Line at={at} out={out} kind="pop"><Icono k={k} at={at} /></Line>
      {pre && <Line at={at + 0.03} out={out} style={{marginBottom: 8}}><span style={plata(62)}>{pre}</span></Line>}
      <Line at={at + 0.06} out={out} kind="slam">
        <span style={estilo === 'rojo' ? rojo(size) : indigoBorde(size)}>{label}</span>
      </Line>
    </Bloque>
  );
};

// ---------- MOTION 5: ampliar (el contorno crece con flechas a las esquinas) ----------
const Ampliar: React.FC<{at: number; out: number; cy: number}> = ({at, out, cy}) => {
  const t = useCurrentFrame() / FPS;
  if (t < at || t >= out) return null;
  const u = prog(t, at + 0.1, at + 0.75, Easing.inOut(Easing.cubic));
  const w0 = 260, h0 = 180, w = w0 + 280 * u, h = h0 + 170 * u;
  const a = 26;
  const corners = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: salida(t, out) * prog(t, at, at + 0.15), filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.55))'}}>
      <rect x={540 - w0 / 2} y={cy - h0 / 2} width={w0} height={h0} fill="rgba(45,42,120,0.4)" stroke="white" strokeWidth={5} />
      <rect x={540 - w / 2} y={cy - h / 2} width={w} height={h} fill="none" stroke={ROJO} strokeWidth={7} strokeDasharray="20 14" />
      {corners.map(([sx, sy], i) => {
        const x1 = 540 + sx * (w0 / 2 + 12), y1 = cy + sy * (h0 / 2 + 12), x2 = 540 + sx * (w / 2 - 14), y2 = cy + sy * (h / 2 - 14);
        return u > 0.15 ? (<g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={7} strokeLinecap="round" />
          <path d={`M ${x2 - sx * a} ${y2} L ${x2} ${y2} L ${x2} ${y2 - sy * a}`} fill="none" stroke="white" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </g>) : null;
      })}
    </svg>
  );
};

// ---------- MOTION 6: casa nueva dibujada en línea de plano (proyecto nuevo) ----------
const Plano: React.FC<{at: number; out: number; cy: number}> = ({at, out, cy}) => {
  const t = useCurrentFrame() / FPS;
  if (t < at || t >= out) return null;
  const u = prog(t, at + 0.05, at + 1.0, Easing.inOut(Easing.cubic));
  const g = prog(t, at, at + 0.3);
  const x = 540, W = 480, H = 260, y0 = cy - H / 2 + 60;
  const d = `M ${x - W / 2} ${y0} L ${x} ${y0 - 150} L ${x + W / 2} ${y0} M ${x - W / 2 + 30} ${y0 - 14} L ${x - W / 2 + 30} ${y0 + H - 60} L ${x + W / 2 - 30} ${y0 + H - 60} L ${x + W / 2 - 30} ${y0 - 14}`
    + ` M ${x - 40} ${y0 + H - 60} L ${x - 40} ${y0 + 80} L ${x + 40} ${y0 + 80} L ${x + 40} ${y0 + H - 60}`
    + ` M ${x - 170} ${y0 + 40} L ${x - 90} ${y0 + 40} L ${x - 90} ${y0 + 110} L ${x - 170} ${y0 + 110} Z M ${x - 130} ${y0 + 40} L ${x - 130} ${y0 + 110}`
    + ` M ${x + 90} ${y0 + 40} L ${x + 170} ${y0 + 40} L ${x + 170} ${y0 + 110} L ${x + 90} ${y0 + 110} Z M ${x + 130} ${y0 + 40} L ${x + 130} ${y0 + 110}`;
  const grid = Array.from({length: 9}, (_, i) => i);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: salida(t, out)}}>
      <g opacity={0.28 * g}>
        {grid.map((i) => <line key={`v${i}`} x1={x - 280 + i * 70} y1={cy - 230} x2={x - 280 + i * 70} y2={cy + 230} stroke="#BFD4FF" strokeWidth={2} />)}
        {grid.slice(0, 7).map((i) => <line key={`h${i}`} x1={x - 280} y1={cy - 210 + i * 70} x2={x + 280} y2={cy - 210 + i * 70} stroke="#BFD4FF" strokeWidth={2} />)}
      </g>
      <path d={d} fill="none" stroke="white" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u}
        style={{filter: 'drop-shadow(0 0 10px rgba(120,150,255,0.9)) drop-shadow(0 3px 6px rgba(0,0,0,0.5))'}} />
    </svg>
  );
};

// ---------- MOTION 7: precio con contador + sello giratorio "se escuchan ofertas" ----------
const Precio: React.FC<{at: number; c0: number; c1: number; out: number; cy: number}> = ({at, c0, c1, out, cy}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t < at || t >= out) return null;
  const v = Math.round(interpolate(t, [c0, c1], [0, 85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const golpe = spring({frame: frame - f(c1), fps, config: {damping: 8, stiffness: 240, mass: 0.6}});
  const s = t >= c1 ? interpolate(golpe, [0, 1], [1.18, 1]) : 1;
  return (
    <Bloque center={cy}>
      <Line at={at} out={out}><span style={plata(74)}>su valor es de</span></Line>
      <Line at={c0} out={out} kind="pop" style={{transform: `scale(${s})`, marginTop: 14}}>
        <span style={{...fina(62, 800), marginRight: 16, verticalAlign: 'baseline'}}>USD</span>
        <span style={rojo(148)}>{v}.000</span>
      </Line>
    </Bloque>
  );
};
const Sello: React.FC<{at: number; out: number; cy: number}> = ({at, out, cy}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t < at || t >= out) return null;
  const p = spring({frame: frame - f(at), fps, config: {damping: 10, stiffness: 230, mass: 0.7}});
  const rot = (t - at) * 40;
  const R = 122, txt = 'SE ESCUCHAN OFERTAS • SE ESCUCHAN OFERTAS • ';
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: salida(t, out) * Math.min(1, p * 1.5)}}>
      <g transform={`translate(540 ${cy}) scale(${interpolate(p, [0, 1], [1.7, 1])})`} style={{filter: 'drop-shadow(0 0 16px rgba(237,39,56,0.5)) drop-shadow(0 4px 10px rgba(0,0,0,0.5))'}}>
        <circle r={R + 34} fill={INDIGO} fillOpacity={0.88} stroke="white" strokeWidth={5} />
        <circle r={R - 30} fill="none" stroke="white" strokeWidth={3} />
        <defs><path id="anillo" d={`M 0 ${-R + 8} A ${R - 8} ${R - 8} 0 1 1 -0.01 ${-R + 8}`} /></defs>
        <g transform={`rotate(${rot})`}>
          <text style={{fontFamily: MS, fontWeight: 800, fontSize: 21}} fill="white"><textPath href="#anillo" textLength={2 * Math.PI * (R - 8) - 6} lengthAdjust="spacing">{txt}</textPath></text>
        </g>
        <path d="M -30 2 L -8 24 L 32 -22" fill="none" stroke={ROJO} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

// ---------- títulos y motion (título O subtítulo, nunca los dos) ----------
const T_HOOK = sobrePelo(2.47, 5.0);
const T_CTA = bajoMenton(46.42, 48.27, 30);
const Titulos: React.FC = () => (
  <>
    {/* HOOK: puede transformarse en / MUCHO MÁS / de lo que ves — arriba de la cabeza (bajo el alero) */}
    <Velo a={2.47} b={5.1} y={T_HOOK - 120} h={11} k={0.5} />
    <Bloque bottom={T_HOOK}>
      <Line at={2.47} out={5.1}><span style={plata(70)}>puede transformarse en</span></Line>
      <Line at={3.61} out={5.1} kind="slam" style={{marginTop: 6}}><span style={rojo(106)}>MUCHO MÁS</span></Line>
      <Line at={4.13} out={5.1} style={{marginTop: 4}}><span style={fina(54, 400)}>de lo que <b style={{fontWeight: 800}}>ves</b></span></Line>
    </Bloque>
    {/* M1 · Estamos en / LA ROSA AL 1400 + pin sobre la casa */}
    <Velo a={4.97} b={7.5} y={600} h={12} k={0.4} />
    <Bloque center={600}>
      <Line at={4.97} out={7.5}><span style={plata(76)}>estamos en</span></Line>
      <Line at={5.59} out={7.5} kind="slam" style={{marginTop: 6}}><span style={rojo(118)}>LA ROSA</span></Line>
      <Line at={6.29} out={7.5} kind="pop" style={{marginTop: 2}}><span style={{...fina(66, 300)}}>al <b style={{fontWeight: 900}}>1400</b></span></Line>
    </Bloque>
    <PinCasa at={5.2} out={7.5} x={560} y={905} />
    {/* M2 · ruta: a pocas cuadras / DEL CENTRO de Adrogué */}
    <Velo a={9.62} b={11.5} y={560} h={16} k={0.42} />
    <Ruta at={9.62} out={11.5} y={700} />
    <Bloque center={455}>
      <Line at={9.74} out={11.5}><span style={plata(76)}>a pocas cuadras</span></Line>
      <Line at={10.58} out={11.5} kind="slam" style={{marginTop: 6}}><span style={rojo(102)}>DEL CENTRO</span></Line>
    </Bloque>
    {/* M3 · lote de 204 m² dibujado en el cielo, arriba de la casa */}
    <Velo a={11.6} b={14.5} y={560} h={17} k={0.4} />
    <Bloque center={345}>
      <Line at={11.88} out={14.5}><span style={plata(70)}>un lote de</span></Line>
    </Bloque>
    <Lote at={11.88} out={14.5} cy={600} c0={12.42} c1={13.95} />
    {/* M4 · ambientes: ícono + nombre por plano */}
    <Ambiente k="living" at={17.55} out={18.0} label="LIVING" estilo="indigo" />
    <Ambiente k="cocina" at={18.06} out={19.0} label="COCINA" estilo="rojo" />
    <Ambiente k="comedor" at={19.0} out={19.75} label="COMEDOR" estilo="indigo" />
    <Ambiente k="dormitorio" at={19.75} out={20.5} label="DORMITORIO" estilo="rojo" size={96} pre="un" />
    <Ambiente k="bano" at={20.62} out={21.5} label="BAÑO" estilo="indigo" />
    <Bloque center={1080}><Line at={20.98} out={21.5}><span style={fina(62, 800)}>completo</span></Line></Bloque>
    <Ambiente k="exterior" at={21.78} out={23.06} label="EXTERIORES" estilo="rojo" size={92} pre="espacios" />
    {/* necesita una / REFACCIÓN / integral */}
    <Velo a={23.15} b={25.5} y={960} h={14} k={0.45} />
    <Bloque center={960}>
      <Line at={23.15} out={25.5}><span style={plata(70)}>necesita una</span></Line>
      <Line at={24.36} out={25.5} kind="slam" style={{marginTop: 6}}><span style={rojo(114)}>REFACCIÓN</span></Line>
      <Line at={24.88} out={25.5} style={{marginTop: 4}}><span style={fina(62, 400)}>integral</span></Line>
    </Bloque>
    {/* pasos 1–4 */}
    <Velo a={27.5} b={29.5} y={1180} h={14} k={0.45} />
    <Bloque center={1170}>
      <Line at={27.5} out={29.5} kind="pop"><Paso n={1} /></Line>
      <Line at={27.68} out={29.5}><span style={plata(74)}>recuperar la</span></Line>
      <Line at={28.3} out={29.5} kind="slam" style={{marginTop: 6}}><span style={rojo(124)}>VIVIENDA</span></Line>
    </Bloque>
    <Velo a={29.45} b={31.0} y={960} h={14} k={0.45} />
    <Bloque center={950}>
      <Line at={29.45} out={31.0} kind="pop"><Paso n={2} /></Line>
      <Line at={29.45} out={31.0}><span style={plata(74)}>reorganizar sus</span></Line>
      <Line at={30.23} out={31.0} kind="slam" style={{marginTop: 6}}><span style={rojo(110)}>AMBIENTES</span></Line>
    </Bloque>
    <Velo a={31.0} b={32.5} y={700} h={12} k={0.4} />
    <Bloque center={640}>
      <Line at={31.0} out={32.5} kind="pop"><Paso n={3} /></Line>
      <Line at={31.0} out={32.5} kind="slam"><span style={rojo(112)}>AMPLIARLA</span></Line>
    </Bloque>
    <Ampliar at={31.05} out={32.5} cy={1110} />
    <Velo a={32.5} b={34.35} y={560} h={12} k={0.45} />
    <Bloque center={520}>
      <Line at={32.5} out={34.35} kind="pop"><Paso n={4} /></Line>
      <Line at={32.5} out={34.35}><span style={plata(66)}>pensar en un proyecto</span></Line>
      <Line at={33.47} out={34.35} kind="slam" style={{marginTop: 6}}><span style={rojo(140)}>NUEVO</span></Line>
    </Bloque>
    <Plano at={32.55} out={34.05} cy={1060} />
    {/* y transformarla / A SU GUSTO */}
    <Velo a={37.53} b={39.1} y={960} h={12} k={0.45} />
    <Bloque center={960}>
      <Line at={37.53} out={39.1}><span style={plata(76)}>y transformarla</span></Line>
      <Line at={38.27} out={39.1} kind="slam" style={{marginTop: 6}}><span style={rojo(108)}>A SU GUSTO</span></Line>
    </Bloque>
    {/* M7 · precio + sello */}
    <Velo a={40.55} b={44.5} y={700} h={14} k={0.42} />
    <Precio at={40.55} c0={41.38} c1={42.42} out={44.5} cy={690} />
    <Sello at={43.08} out={44.5} cy={1110} />
    {/* CTA: ESCRIBINOS / y vení a conocerla, bajo el mentón */}
    <Bloque top={T_CTA}>
      <Line at={46.45} out={48.4} kind="slam"><span style={rojo(108)}>ESCRIBINOS</span></Line>
      <Line at={47.27} out={48.4} style={{marginTop: 10}}><span style={fina(56, 800)}>y vení a <span style={{fontWeight: 900, fontStyle: 'normal'}}>CONOCERLA</span></span></Line>
    </Bloque>
  </>
);

// ---------- subtítulos: 1–4 palabras, Light + palabra clave (caja roja / índigo con borde / ExtraBold) ----------
type K = 'caja' | 'indigo' | 'bold' | undefined;
type Sub = [number, number, string, string?, K?]; // inicio, fin, antes, clave, recurso — la altura sale del plano
const SUBS: Sub[] = [
  [0.02, 0.86, '¿Y si te', 'dijera', 'bold'],
  [0.86, 1.64, 'que esta', 'CASA', 'caja'],
  [1.64, 2.47, 'en', 'ADROGUÉ', 'indigo'],
  [7.55, 8.38, 'en una', 'tranquila', 'bold'],
  [8.38, 9.62, 'zona', 'RESIDENCIAL', 'caja'],
  [14.31, 15.47, 'encontramos esta', 'CASA', 'caja'],
  [15.47, 16.23, 'de', 'construcción', 'bold'],
  [16.23, 17.3, '', 'TRADICIONAL', 'indigo'],
  [17.3, 17.55, 'con', undefined, undefined],
  [25.5, 26.1, 'pero', 'ofrece', 'bold'],
  [26.1, 26.62, 'distintas', undefined, undefined],
  [26.62, 27.5, '', 'POSIBILIDADES', 'caja'],
  [34.35, 34.76, 'una', 'alternativa', 'bold'],
  [34.76, 35.48, '', 'INTERESANTE', 'caja'],
  [35.48, 36.28, 'para quienes', 'buscan', 'bold'],
  [36.28, 36.82, 'comprar', 'una', 'bold'],
  [36.82, 37.5, '', 'PROPIEDAD', 'indigo'],
  [39.1, 39.72, 'y un', 'dato', 'bold'],
  [39.72, 40.55, '', 'IMPORTANTE', 'caja'],
  [44.38, 45.2, '¿Te', 'imaginás', 'bold'],
  [45.2, 45.96, 'lo que', 'podrías', 'bold'],
  [45.96, 46.45, 'hacer', 'ACÁ?', 'caja'],
];
const subY = (a: number, b: number) => {
  const s = spkAt((a + b) / 2);
  return s ? bajoMenton(a, b, 22) + 32 : 960; // centro del renglón: bajo el mentón con el speaker; centrado sobre el B-roll
};
const Clave: React.FC<{k: K; children: string}> = ({k, children}) => {
  if (k === 'caja') return (
    <span style={{fontFamily: MS, fontWeight: 800, color: 'white', background: 'rgba(237,39,56,0.86)', padding: '2px 14px 6px', borderRadius: 4, marginLeft: 4, textShadow: 'none'}}>{children}</span>);
  if (k === 'indigo') return (
    <span style={{fontFamily: MS, fontWeight: 900, color: INDIGO, WebkitTextStroke: '9px white', paintOrder: 'stroke fill', textShadow: 'none', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.45))'}}>{children}</span>);
  return <span style={{fontWeight: 800, textShadow: SOMBRA}}>{children}</span>;
};
const SUB_Y = SUBS.map(([a, b]) => subY(a, b));
const Subs: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  const i = SUBS.findIndex((s) => t >= s[0] && t < s[1]);
  if (i < 0) return null;
  const [a, , txt, clave, k] = SUBS[i];
  const p = spring({frame: frame - f(a), fps, config: {damping: 13, stiffness: 220, mass: 0.6}});
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: SUB_Y[i], transform: `translateY(-50%) scale(${interpolate(p, [0, 1], [0.82, 1])})`,
      textAlign: 'center', whiteSpace: 'nowrap', opacity: Math.min(1, p * 2), fontFamily: MS, fontSize: 58, fontWeight: 300, color: 'white',
      letterSpacing: -1.2, lineHeight: 1, textShadow: SOMBRA}}>
      {txt}{txt && clave ? ' ' : ''}{clave && <Clave k={k}>{clave}</Clave>}
    </div>
  );
};

export const LUL0111: React.FC<{guias?: boolean; portada?: string}> = ({guias, portada}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <WhipFilters />
      {[HOOK, CTA1, CTA2].map((s, i) => (
        <Sequence key={`s${i}`} from={f(s.a)} durationInFrames={f(s.b) - f(s.a)}><Speaker s={s} /></Sequence>
      ))}
      {BROLL.map((c, i) => (
        <Sequence key={i} from={f(c[1])} durationInFrames={f(c[2]) - f(c[1])}><Broll clip={c} /></Sequence>
      ))}
      {LEAKS.map((l) => <Leak key={l} at={l} />)}
      <Titulos />
      <Subs />
      {guias && (<>
        <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid lime', boxSizing: 'border-box'}} />
        <div style={{position: 'absolute', left: 538, top: 0, width: 4, height: 1920, background: 'rgba(255,0,255,0.5)'}} />
      </>)}
      {portada && frame === 0 && <Img src={staticFile(`lul0111/${portada}`)} style={{position: 'absolute', width: 1080, height: 1920}} />}
    </AbsoluteFill>
  );
};
