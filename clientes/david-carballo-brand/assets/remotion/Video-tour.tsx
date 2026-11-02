// DC 14-10 "Título pendiente" — David Carballo (david-carballo-brand + edicion-reels-base)
// TOUR HOUSE en Tampa: 3 hab / 2 baños remodelada, 1,150 pies², lote 0.19 acres, sin HOA ni zona de inundación, USD 319,000.
// Hook frente a la casa → selfie entrando (cocina, electrodomésticos, baños) → David en la cocina (datos) → selfie (HOA, techo y aire, patio, precio)
// → CTA en el patio. Estructura aprobada (v2, 2026-11-02). Voz: AUDIO MEJORADO del usuario + voz_cadena.py … mejorada.
// Pedido del usuario: SIN motion graphics (mostrar la propiedad) y solo el logo Home Prime arriba a la derecha (sin marca de agua).
// Plantilla: dc1010/Video.tsx. El audio (voz + música + SFX) se mezcla aparte (PROYECTO/mix.py).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing, delayRender, continueRender, getInputProps} from 'remotion';
import {FACES, SEGS} from './face';
import {SUBS} from './subs';

const FPS = 30;
export const DC1410_FRAMES = Math.round(68.4 * FPS);
const W = 1080;
const MAXW = 720; // centrado en x=540 → x 180–900
const NAVY = '#263142';
const GOLD_BLOCK = '#D2B759';
const GOLD_GRAD = 'linear-gradient(180deg, #D8C080 0%, #DFC87F 30%, #F0E5C5 78%, #FFF3C9 100%)';
const PROPS = getInputProps() as {guides?: boolean; voz?: boolean};
const fr = (t: number) => Math.round(t * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- planos (estructura aprobada v2) ----------
// david: toma con cara (zoom anclado a los ojos) · own: toma de la casa (B-roll propio)
type Kind = 'david' | 'own';
type Clip = {a: number; b: number; kind: Kind; z?: [number, number]; src?: string; from?: number; logo: 'b' | 'n'};
const DUR: Record<string, number> = {b0912: 4.72, b0918: 2.47, b0919: 2.78, b0920: 9.12, b0921: 9.16, b0922: 2.08, b0924: 14.6, b0927: 4.85, b0928: 5.82, b0929: 3.82, b0936: 5.12, b0937: 3.95};
const CLIPS: Clip[] = [
  {a: 0, b: 3.533, kind: 'david', z: [1.0, 1.08], logo: 'n'},                       // ¿Estás buscando comprar casa en Tampa… demasiado caro?
  {a: 3.533, b: 5.133, kind: 'own', src: 'b0912', from: 1.4, logo: 'n'},            // Espera entonces a conocer esta propiedad (fachada)
  {a: 5.133, b: 5.9, kind: 'own', src: 'b0922', from: 0.2, logo: 'n'},              // Tres habitaciones
  {a: 5.9, b: 7.067, kind: 'own', src: 'b0924', from: 2.6, logo: 'n'},              // dos baños, completamente
  {a: 7.067, b: 8.467, kind: 'own', src: 'b0918', from: 0.0, logo: 'n'},            // remodelada y con varias ventajas
  {a: 8.467, b: 9.667, kind: 'own', src: 'b0921', from: 6.0, logo: 'n'},            // que te van a sorprender
  {a: 9.667, b: 10.533, kind: 'david', z: [1.14, 1.17], logo: 'n'},                 // Ven, vamos a conocer
  {a: 10.533, b: 13.533, kind: 'david', z: [1.0, 1.05], logo: 'n'},                 // Lo primero… lista para mudarte (selfie entrando)
  {a: 13.533, b: 16.433, kind: 'own', src: 'b0919', from: 0.0, logo: 'n'},          // sin tener que comenzar a gastar dinero en remodelaciones
  {a: 16.433, b: 18.667, kind: 'own', src: 'b0921', from: 0.0, logo: 'n'},          // Cuenta con una cocina completamente renovada
  {a: 18.667, b: 20.267, kind: 'own', src: 'b0927', from: 1.0, logo: 'n'},          // electrodomésticos nuevos
  {a: 20.267, b: 21.2, kind: 'own', src: 'b0924', from: 4.6, logo: 'n'},            // baños modernos
  {a: 21.2, b: 23.4, kind: 'own', src: 'b0920', from: 0.0, logo: 'n'},              // y acabados que le dan un toque espectacular
  {a: 23.4, b: 26.233, kind: 'david', z: [1.0, 1.06], logo: 'n'},                   // Encimeras de cuarzo blanco con partículas grises
  {a: 26.233, b: 29.333, kind: 'own', src: 'b0918', from: 0.6, logo: 'n'},          // 1,150 pies cuadrados bajo aire acondicionado
  {a: 29.333, b: 31.9, kind: 'own', src: 'b0929', from: 0.3, logo: 'n'},            // y un lote de 0.19 acres
  {a: 31.9, b: 39.4, kind: 'david', z: [1.0, 1.06], logo: 'n'},                     // Pero aquí viene algo… zona de inundación
  {a: 39.4, b: 40.6, kind: 'own', src: 'b0937', from: 0.0, logo: 'n'},              // Además, cuenta con un techo
  {a: 40.6, b: 42.433, kind: 'own', src: 'b0936', from: 0.0, logo: 'b'},            // y un aire acondicionado reciente (equipos al costado de la casa)
  {a: 42.433, b: 45.667, kind: 'david', z: [1.1, 1.15], logo: 'n'},                 // lo que puede ayudarte a evitar gastos importantes en el futuro
  {a: 45.667, b: 48.4, kind: 'own', src: 'b0928', from: 0.0, logo: 'b'},            // Si te gusta disfrutar del aire libre de un patio espacioso
  {a: 48.4, b: 50.8, kind: 'own', src: 'b0936', from: 3.0, logo: 'b'},              // completamente cercado, pues mira el que tendrías acá
  {a: 50.8, b: 54.833, kind: 'david', z: [1.0, 1.07], logo: 'n'},                   // Y ahora viene la pregunta… ¿Cuánto cuesta esta casa?
  {a: 54.833, b: 57.1, kind: 'own', src: 'b0912', from: 2.45, logo: 'n'},           // Solamente 319 mil. Entonces, (fachada: el precio)
  {a: 57.1, b: 58.533, kind: 'david', z: [1.0, 1.04], logo: 'b'},                   // ¿te ves viviendo en esta propiedad?
  {a: 58.533, b: 68.4, kind: 'david', z: [1.3, 1.38], logo: 'b'},                   // punch: Déjamelo saber en los comentarios… en la Florida.
];
export const clipAt = (t: number) => CLIPS.find((c) => t >= c.a && t < c.b) ?? CLIPS[CLIPS.length - 1];
// transición en cada corte: zoom-blur entre dos planos de la misma toma (punch del CTA), whip en el resto
const sameTake = (x: Clip, y: Clip) => x.kind === 'david' && y.kind === 'david' && segAt(x.a).toma === segAt(y.a).toma;
export const CUTS: [number, 'whip' | 'zoom'][] = CLIPS.slice(1).map((c, i) => [c.a, sameTake(CLIPS[i], c) ? 'zoom' : 'whip']);
const LEAKS = [10.533, 31.9, 54.833]; // light leak cálido al entrar a la casa, al "Pero aquí viene algo" y en el precio

// ---------- David: fuente y cara ----------
function segAt(t: number) { return SEGS.find((s) => t >= s.t0 && t < s.t1) ?? SEGS[SEGS.length - 1]; }
const srcTime = (t: number) => { const s = segAt(t); return {toma: s.toma, st: s.in + (t - s.t0)}; };
const faceAt = (toma: number, st: number) => { const F = FACES[toma]; return F.f[Math.max(0, Math.min(F.f.length - 1, Math.round((st - F.off) * FPS)))]; };
export const davidState = (t: number) => {
  const c = clipAt(t);
  if (c.kind !== 'david') return null;
  const s = interpolate(t, [c.a, c.b], c.z!, clamp);
  const {toma, st} = srcTime(t);
  const fc = faceAt(toma, st);
  return {s, fc, toma, st, y: (y: number) => fc.ey + (y - fc.ey) * s};
};
// tope del pelo en pantalla, estimado desde la caja de la cara (frente − 0,35·ancho)
const hairY = (t: number) => {
  const st = davidState(t);
  return st ? st.y(st.fc.top - 0.35 * st.fc.w) : null;
};
const chinY = (t: number) => {
  const st = davidState(t);
  return st ? st.y(st.fc.bot) : null;
};

const davidPieces = (c: Clip) =>
  SEGS.filter((s) => s.t1 > c.a && s.t0 < c.b).map((s) => ({a: Math.max(c.a, s.t0), b: Math.min(c.b, s.t1), seg: s})).filter((p) => fr(p.b) - fr(p.a) > 0);

const David: React.FC<{a: number; seg: (typeof SEGS)[number]}> = ({a, seg}) => {
  const f = useCurrentFrame();
  const st = davidState(a + f / FPS)!;
  return (
    <AbsoluteFill style={{transform: `scale(${st.s})`, transformOrigin: `${st.fc.ex}px ${st.fc.ey}px`}}>
      <OffthreadVideo src={staticFile(`dc1410/t${seg.toma}.mp4`)} startFrom={fr(seg.in + (a - seg.t0))} muted />
    </AbsoluteFill>
  );
};
// toma de la casa: zoom lento; si no alcanza el largo, cámara lenta (fuente a 60 fps)
const rateOf = (c: Clip) => Math.min(1, (DUR[c.src!] - c.from! - 0.05) / (c.b - c.a));
const Own: React.FC<{c: Clip}> = ({c}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, fr(c.b) - fr(c.a)], c.z ?? [1.0, 1.06], clamp);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: '540px 960px'}}>
      <OffthreadVideo src={staticFile(`dc1410/${c.src}.mp4`)} startFrom={fr(c.from!)} playbackRate={rateOf(c)} muted />
    </AbsoluteFill>
  );
};

// ---------- transiciones ----------
const transition = (frame: number) => {
  for (const [t, kind] of CUTS) {
    const d = frame - fr(t);
    if (d < -3 || d > 2) continue;
    const p = d < 0 ? (d + 4) / 3 : (3 - d) / 3;
    const e = Easing.in(Easing.quad)(Math.max(0, Math.min(1, p)));
    if (kind === 'whip') return {tx: (d < 0 ? -1 : 1) * 260 * e, hblur: 45 * e, scale: 1 + 0.5 * e, blur: 0, ox: 540, oy: 960}; // escala ≥ 1 + 2·260/1080: el barrido no deja ver el borde
    const st = davidState(frame / FPS);
    return {tx: 0, hblur: 0, scale: 1 + 0.3 * e, blur: 14 * e, ox: st?.fc.ex ?? 540, oy: st?.fc.ey ?? 960}; // zoom-blur anclado a los ojos
  }
  return {tx: 0, hblur: 0, scale: 1, blur: 0, ox: 540, oy: 960};
};
const LightLeak: React.FC = () => {
  const f = useCurrentFrame();
  let k = 0;
  for (const t of LEAKS) k = Math.max(k, interpolate(f, [fr(t) - 6, fr(t), fr(t) + 12], [0, 1, 0], clamp));
  if (k <= 0) return null;
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', opacity: k}}>
      <AbsoluteFill style={{background: 'radial-gradient(60% 45% at 85% 20%, rgba(255,150,60,0.95) 0%, rgba(255,110,90,0.5) 40%, rgba(255,110,90,0) 75%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(55% 40% at 10% 80%, rgba(255,120,150,0.7) 0%, rgba(255,170,90,0) 70%)'}} />
    </AbsoluteFill>
  );
};

const ImageLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const tr = transition(frame);
  const filter = [tr.hblur > 0.5 ? 'url(#hblur)' : '', tr.blur > 0.3 ? `blur(${tr.blur}px)` : ''].join(' ').trim();
  return (
    <AbsoluteFill style={{transform: `translateX(${tr.tx}px) scale(${tr.scale})`, transformOrigin: `${tr.ox}px ${tr.oy}px`, filter: filter || undefined}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="hblur" x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${Math.max(0, tr.hblur)} 0`} /></filter>
      </svg>
      {CLIPS.map((c, i) => {
        if (c.kind === 'david')
          return davidPieces(c).map((p, j) => (
            <Sequence key={`${i}-${j}`} from={fr(p.a)} durationInFrames={fr(p.b) - fr(p.a)}><David a={p.a} seg={p.seg} /></Sequence>
          ));
        return (
          <Sequence key={i} from={fr(c.a)} durationInFrames={fr(c.b) - fr(c.a)}><Own c={c} /></Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- textos ----------
let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, weight: number, size: number, track: number) => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `${weight} ${size}px OSO`;
  (ctx as any).letterSpacing = `${track * size}px`;
  return ctx!.measureText(txt).width;
};
// box: palabra clave en blanco dentro de una caja navy (fondos claros: el dorado no se lee, 05-10)
// price: caja navy con "USD" blanco + cifra en degradé dorado (el dorado se lee sobre el navy)
type Part = {t: string; w: 500 | 800 | 900; size: number; gold?: boolean; box?: boolean; price?: boolean};
type Line = {parts: Part[]; at: number};
type Pos = 'head' | 'top' | 'chin';
type Title = {a: number; b: number; pos: Pos; lines: Line[]; y?: number; dim?: boolean}; // y: tope fijo · dim: oscurecido suave detrás (fondos claros)
const P = (t: string, w: 500 | 800 | 900, size: number, gold = false): Part => ({t, w, size, gold});
const BX = (t: string, size: number): Part => ({t, w: 900, size, box: true});
const PR = (t: string, size: number): Part => ({t, w: 900, size, price: true});
const BOXPAD = 0.16; // relleno horizontal de la caja, en em
const USD_K = 0.42;  // "USD" a 42 % del cuerpo de la cifra
export const TITLES: Title[] = [
  {a: 0.04, b: 3.533, pos: 'head', dim: true, lines: [          // frente a la casa, sobre el cielo: caja navy
    {at: 0.04, parts: [P('¿Estás buscando', 500, 62)]},
    {at: 0.84, parts: [P('casa en ', 500, 62), BX('TAMPA', 110)]},
    {at: 1.54, parts: [P('pero todo está ', 500, 50), P('DEMASIADO CARO?', 800, 56)]}]},
  {a: 5.15, b: 7.95, pos: 'top', dim: true, lines: [            // dormitorio y baño blancos: caja navy
    {at: 5.15, parts: [BX('3', 116), P(' HABITACIONES', 800, 74)]},
    {at: 5.93, parts: [BX('2', 116), P(' BAÑOS', 800, 74)]},
    {at: 6.45, parts: [P('completamente ', 500, 48), P('REMODELADA', 800, 58)]}]},
  {a: 26.29, b: 29.333, pos: 'top', dim: true, lines: [         // living blanco
    {at: 26.29, parts: [BX('1,150', 118)]},
    {at: 27.45, parts: [P('PIES CUADRADOS', 800, 68)]},
    {at: 28.19, parts: [P('bajo aire acondicionado', 500, 48)]}]},
  {a: 29.37, b: 31.9, pos: 'top', dim: true, lines: [           // patio con cielo nublado
    {at: 29.37, parts: [P('un lote de', 500, 58)]},
    {at: 29.91, parts: [BX('0.19', 116), P(' ACRES', 900, 92)]}]},
  {a: 36.1, b: 39.4, pos: 'chin', dim: true, lines: [           // selfie con techo blanco: debajo del mentón (arriba no hay lugar)
    {at: 36.1, parts: [P('Sin ', 800, 72), BX('HOA', 84)]},
    {at: 37.57, parts: [P('ni zona de ', 500, 46), BX('INUNDACIÓN', 64)]}]},
  {a: 40.27, b: 42.433, pos: 'top', dim: true, lines: [         // pared exterior blanca y cielo
    {at: 40.27, parts: [BX('TECHO', 104)]},
    {at: 40.79, parts: [P('y ', 500, 60), BX('AIRE', 104), P(' recientes', 500, 56)]}]},
  {a: 54.86, b: 57.1, pos: 'top', dim: true, lines: [           // fachada: el precio
    {at: 54.86, parts: [P('Solamente', 500, 64)]},
    {at: 55.5, parts: [PR('319,000', 128)]}]},
  {a: 57.13, b: 58.533, pos: 'head', lines: [                   // CTA en el patio, árboles oscuros: dorado
    {at: 57.13, parts: [P('¿Te ves', 500, 64)]},
    {at: 57.39, parts: [P('VIVIENDO', 900, 128, true)]},
    {at: 57.6, parts: [P('en esta propiedad?', 500, 52)]}]},
  {a: 58.59, b: 60.5, pos: 'head', lines: [
    {at: 58.59, parts: [P('Déjamelo saber en los', 500, 56)]},
    {at: 59.57, parts: [P('COMENTARIOS', 900, 112, true)]}]},
  {a: 64.1, b: 66.2, pos: 'head', lines: [
    {at: 64.1, parts: [P('te recomiendo que me', 500, 54)]},
    {at: 64.96, parts: [P('SIGAS', 900, 132, true)]}]},
];
const partW = (p: Part) =>
  p.price ? measure('USD ', 800, p.size * USD_K, -0.02) + measure(p.t, p.w, p.size, -0.06) + 2 * BOXPAD * p.size
  : measure(p.t, p.w, p.size, -0.06) + (p.box ? 2 * BOXPAD * p.size : 0);
// tramos donde el título ya dice lo que se escucha: sin subtítulo
const HIDE: [number, number][] = TITLES.map((t): [number, number] => [t.a, t.b]);

const parseSub = (txt: string) =>
  txt.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((p) => (p.startsWith('**') ? {t: p.slice(2, -2), w: 800} : {t: p, w: 500}));
const SUB_SIZE = 58;
const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + 0.04;
  let idx = -1;
  for (let i = 0; i < SUBS.length; i++) if (SUBS[i][0] <= t) idx = i;
  if (idx < 0) return null;
  const a = fr(Math.max(0, SUBS[idx][0] - 0.04));
  const nextA = idx + 1 < SUBS.length ? fr(SUBS[idx + 1][0] - 0.04) : DC1410_FRAMES;
  const b = Math.min(nextA, fr(SUBS[idx][2] + 0.6));
  if (frame >= b) return null;
  if (HIDE.some(([h0, h1]) => frame >= fr(h0) && frame < fr(h1))) return null;
  const parts = parseSub(SUBS[idx][1]);
  const width = parts.reduce((acc, p) => acc + measure(p.t, p.w, SUB_SIZE, -0.03), 0);
  const k = Math.min(1, MAXW / width);
  const h = SUB_SIZE * 1.15 * k;
  // plano que ocupa la mayor parte del bloque
  const count = new Map<Clip, number>();
  for (let f = a; f < b; f++) { const c = clipAt(f / FPS); count.set(c, (count.get(c) ?? 0) + 1); }
  const c = [...count.entries()].sort((x, y) => y[1] - x[1])[0][0];
  let top: number;
  let cx = 540;
  if (c.kind !== 'david') top = 960 - h / 2; // sobre la casa: al centro del cuadro
  else {
    // con David en cuadro: pegado debajo del mentón y centrado en su cara (13-10); si no entra antes de y = 1440, pegado ARRIBA de la cabeza
    let chin = 0, hair = 9999, sx = 0, n = 0;
    for (let f = a; f < b; f++) {
      const st = davidState(f / FPS);
      if (st && clipAt(f / FPS) === c) { chin = Math.max(chin, st.y(st.fc.bot)); hair = Math.min(hair, hairY(f / FPS)!); sx += st.fc.ex; n++; }
    }
    top = chin + 20 + h <= 1440 ? chin + 20 : Math.max(270, hair - 24 - h);
    const bw = width * k;
    if (n) cx = Math.max(70 + bw / 2, Math.min(900 - bw / 2, sx / n));
  }
  const pop = interpolate(frame - a, [0, 4], [0.9, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  return (
    <div style={{position: 'absolute', left: cx - W / 2, width: W, top, textAlign: 'center', lineHeight: 1.15,
      fontFamily: 'OSO', fontSize: SUB_SIZE * k, letterSpacing: '-0.03em', color: '#fff', whiteSpace: 'nowrap',
      transform: `scale(${pop})`, textShadow: '0 3px 14px rgba(20,24,32,0.8), 0 1px 3px rgba(20,24,32,0.65)'}}>
      {parts.map((p, i) => <span key={i} style={{fontWeight: p.w}}>{p.t}</span>)}
    </div>
  );
};

const TitleView: React.FC<{ti: Title}> = ({ti}) => {
  const frame = useCurrentFrame();
  const a = fr(ti.a), b = fr(ti.b);
  if (frame < a || frame >= b) return null;
  // escala por línea: una línea larga no achica a las demás
  const widths = ti.lines.map((l) => l.parts.reduce((acc, p) => acc + partW(p), 0));
  const ks = widths.map((w) => Math.min(1, MAXW / w));
  const lh = ti.lines.map((l, i) => Math.max(...l.parts.map((p) => p.size * (p.box || p.price ? 1.3 : 0.88))) * ks[i]); // la caja navy no pisa las líneas vecinas
  const H = lh.reduce((x, y) => x + y, 0);
  let top: number;
  if (ti.y !== undefined) top = ti.y;
  else if (ti.pos === 'top') top = Math.max(330, 640 - H / 2);
  else if (ti.pos === 'chin') {
    let chin = 0;
    for (let f = a; f < b; f++) { const y = chinY(f / FPS); if (y !== null) chin = Math.max(chin, y); }
    top = Math.min(1440 - H, chin + 30);
  } else {
    let hair = 9999;
    for (let f = a; f < b; f++) { const y = hairY(f / FPS); if (y !== null) hair = Math.min(hair, y); }
    top = Math.max(318, hair - 26 - H); // ~26 px sobre el pelo
  }
  const out = interpolate(frame, [b - 4, b - 1], [1, 0], clamp);
  let y = top;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: out, transform: `translateY(${(1 - out) * -12}px)`}}>
      {ti.dim && <div style={{position: 'absolute', left: 90, width: 900, top: top - 70, height: H + 140, opacity: interpolate(frame - a, [0, 5], [0, 1], clamp),
        background: 'radial-gradient(50% 50% at 50% 50%, rgba(15,18,24,0.55) 0%, rgba(15,18,24,0.3) 55%, rgba(15,18,24,0) 100%)'}} />}
      {ti.lines.map((l, i) => {
        const yy = y;
        y += lh[i];
        return <TitleLine key={i} line={l} k={ks[i]} top={yy} h={lh[i]} local={frame - fr(l.at)} width={widths[i] * ks[i]} />;
      })}
    </div>
  );
};
const goldText = (p: Part, k: number): React.CSSProperties => ({fontFamily: 'OSO', fontWeight: p.w, fontSize: p.size * k, letterSpacing: '-0.06em', lineHeight: 0.95, whiteSpace: 'pre',
  color: 'transparent', paddingRight: '0.08em', backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text',
  paddingTop: '0.3em', marginTop: '-0.3em', paddingBottom: '0.15em', marginBottom: '-0.15em'});
const TitleLine: React.FC<{line: Line; k: number; top: number; h: number; local: number; width: number}> = ({line, k, top, h, local, width}) => {
  if (local < 0) return null;
  const grow = interpolate(local, [0, 5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const retract = interpolate(local, [5, 10], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const lift = interpolate(local, [0, 8], [14, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const x0 = 540 - width / 2 - 14, bw = width + 28;
  const content = (
    <div style={{position: 'absolute', left: 0, width: W, top: 0, height: h, display: 'flex', justifyContent: 'center', alignItems: 'center',
      transform: `translateY(${lift}px)`, filter: 'drop-shadow(0 5px 12px rgba(20,24,32,0.6))'}}>
      {line.parts.map((p, j) => p.price ? (
        <span key={j} style={{display: 'inline-flex', alignItems: 'baseline', background: NAVY, borderRadius: 12, padding: `0.04em ${BOXPAD}em 0.08em`,
          boxShadow: '0 8px 22px rgba(10,12,18,0.45)', fontSize: p.size * k}}>
          <span style={{fontFamily: 'OSO', fontWeight: 800, fontSize: p.size * k * USD_K, letterSpacing: '-0.02em', color: '#fff', whiteSpace: 'pre'}}>USD </span>
          <span style={goldText(p, k)}>{p.t}</span>
        </span>
      ) : p.box ? (
        <span key={j} style={{fontFamily: 'OSO', fontWeight: 900, fontSize: p.size * k, letterSpacing: '-0.06em', lineHeight: 1, whiteSpace: 'pre', color: '#fff',
          background: NAVY, borderRadius: 10, padding: `0.06em ${BOXPAD}em 0.1em`, boxShadow: '0 8px 22px rgba(10,12,18,0.45)'}}>{p.t}</span>
      ) : p.gold ? (
        <span key={j} style={goldText(p, k)}>{p.t}</span>
      ) : (
        <span key={j} style={{fontFamily: 'OSO', fontWeight: p.w, fontSize: p.size * k, letterSpacing: '-0.06em', lineHeight: 0.95, whiteSpace: 'pre', color: '#fff'}}>{p.t}</span>
      ))}
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 0, width: W, top, height: h}}>
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(-60px ${W - (x0 + bw * grow)}px -60px 0px)`}}>{content}</div>
      {retract < 1 && <div style={{position: 'absolute', top: h * 0.08, height: h * 0.84, left: x0 + bw * retract, width: Math.max(0, bw * (grow - retract)), background: GOLD_BLOCK}} />}
    </div>
  );
};
// oscurece apenas el plano bajo el subtítulo centrado (tomas de la casa: paredes blancas)
const SubDim: React.FC = () => {
  const frame = useCurrentFrame();
  const c = clipAt(frame / FPS);
  if (c.kind !== 'own') return null;
  const k = interpolate(frame, [fr(c.a), fr(c.a) + 4, fr(c.b) - 3, fr(c.b)], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{background: 'radial-gradient(60% 9% at 50% 50%, rgba(15,18,24,0.5) 0%, rgba(15,18,24,0) 100%)', opacity: k}} />;
};

// ---------- logo (siempre arriba a la derecha, pisando todo) ----------
const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const c = clipAt(frame / FPS);
  return <Img src={staticFile(c.logo === 'b' ? 'dc1410/logo_blanco.png' : 'dc1410/logo_negro.png')} style={{position: 'absolute', left: 735, top: 75, width: 240}} />;
};

const Guides: React.FC = () => {
  const frame = useCurrentFrame();
  const st = davidState(frame / FPS);
  const hy = hairY(frame / FPS);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid rgba(0,255,0,.8)'}} />
      <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'rgba(0,255,255,.6)'}} />
      {st && hy !== null && <div style={{position: 'absolute', left: st.fc.ex - st.fc.w * st.s * 0.7, width: st.fc.w * st.s * 1.4, top: hy, height: st.y(st.fc.bot) - hy, background: 'rgba(255,0,0,.25)'}} />}
    </AbsoluteFill>
  );
};

export const DC1410: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const fonts: [string, string][] = [['OpenSauceOne-Medium.ttf', '500'], ['OpenSauceOne-Bold.ttf', '800'], ['OpenSauceOne-Black.ttf', '900']];
    Promise.all(fonts.map(([f, w]) => new FontFace('OSO', `url(${staticFile('fonts/' + f)})`, {weight: w}).load().then((x) => document.fonts.add(x))))
      .then(() => { setReady(true); continueRender(handle); });
  }, [handle]);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <ImageLayer />
      <LightLeak />
      <SubDim />
      {ready && <Subtitles />}
      {ready && TITLES.map((ti, i) => <TitleView key={i} ti={ti} />)}
      <Logo />
      {PROPS.voz && <Audio src={staticFile('dc1410/voz.wav')} />}
      {PROPS.guides && <Guides />}
    </AbsoluteFill>
  );
};
