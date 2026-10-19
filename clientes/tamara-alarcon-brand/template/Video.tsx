// TA 05-10 "Así es una mañana viviendo en Canning" — Tamara Alarcón (tamara-alarcon-brand + edicion-reels-base)
// Plantilla de referencia (05-10, aprobada 2026-10-19). Necesita ./data.ts con FACE (por cuadro: cx, top, bot, w, ex, ey) generado con
// track_cara.swift de edicion-reels-base y suavizado por toma (mediana 3 + media 5, sin cruzar los cortes), y en public/ta0510/:
// base.mp4 (export del usuario), los B-roll a 1080x1920/25 fps sin audio y fonts/500.otf, 700.otf, 800.otf (Gibson, de Adobe Fonts, no se suben al repo).
// Render: npx remotion render src/index.ts TA0510 out.mp4 --muted (el audio se mezcla aparte); revisión: --props={"guides":true}.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing, delayRender, continueRender, getInputProps} from 'remotion';
import {FACE} from './data';

const FPS = 25;
export const TA0510_FRAMES = 1026;
const W = 1080;
const CHOC = '#462F22';
const GRAD = 'linear-gradient(0deg, #9A886F 0%, #B5A48F 45%, #D2C3B7 100%)'; // taupe → arena, de abajo hacia arriba
const HAIR_PAD = 70; // Vision corta la cara en la frente: el pelo queda ~70 px más arriba
const GUIDES = !!getInputProps().guides;

// ---------- planos ----------
// zoom continuo anclado a los ojos: [desde, hasta, escala inicial, escala final]
const ZOOM: [number, number, number, number][] = [
  [0, 1.44, 1.0, 1.05],
  [5.78, 8.84, 1.1, 1.16],
  [8.84, 10.08, 1.0, 1.04],
  [19.6, 21.41, 1.0, 1.05],
  [21.41, 23.64, 1.15, 1.19], // punch "para el día a día"
  [23.64, 25.4, 1.08, 1.12],
  [28.5, 29.96, 1.0, 1.04],
  [29.96, 32.43, 1.12, 1.16],
  [32.43, 34.27, 1.0, 1.05],
  [37.56, 38.69, 1.0, 1.04],
  [38.69, 41.04, 1.12, 1.18], // punch "mandame un mensaje"
];
// subY: centro del subtítulo sobre ese B-roll (default 960); box: caja negra 45 % (fondos claros)
type Clip = {src: string; a: number; b: number; subY?: number; box?: boolean};
const BROLL: Clip[] = [
  {src: 'hijos', a: 1.44, b: 3.94, subY: 790, box: true},
  {src: 'cafe', a: 3.94, b: 5.78, box: true},
  {src: 'familia', a: 10.08, b: 11.7, subY: 1060},
  {src: 'trafico', a: 11.7, b: 14.53},
  {src: 'nena_bici', a: 14.53, b: 16.42},
  {src: 'sendero', a: 16.42, b: 17.7},
  {src: 'bici', a: 17.7, b: 19.6, box: true},
  {src: 'familia2', a: 25.4, b: 26.48},
  {src: 'mochila', a: 26.48, b: 28.5, subY: 1170, box: true},
  {src: 'llaves', a: 34.27, b: 36.04},
  {src: 'ninos', a: 36.04, b: 37.56},
];
type Kind = 'leak' | 'zoom' | 'whip';
export const CUTS: [number, Kind][] = [
  [1.44, 'leak'], [3.94, 'zoom'], [5.78, 'leak'], [8.84, 'zoom'], [10.08, 'leak'], [11.7, 'whip'], [14.53, 'whip'],
  [16.42, 'zoom'], [17.7, 'whip'], [19.6, 'leak'], [23.64, 'zoom'], [25.4, 'leak'], [26.48, 'whip'], [28.5, 'zoom'],
  [29.96, 'whip'], [34.27, 'leak'], [36.04, 'zoom'], [37.56, 'leak'],
];

// ---------- textos ----------
// golpe: degradé taupe→arena (sobre Tamara) · outline: blanco con contorno chocolate (sobre B-roll)
type Part = {t: string; w: 500 | 700 | 800; size: number; golpe?: boolean; outline?: boolean};
type Line = {parts: Part[]; at: number};
type Title = {a: number; b: number; pos: 'above' | 'center'; lines: Line[]};
export const TITLES: Title[] = [
  {a: 0.06, b: 1.44, pos: 'above', lines: [
    {at: 0.06, parts: [{t: 'Imaginate la', w: 500, size: 92}]},
    {at: 0.9, parts: [{t: 'MAÑANA', w: 800, size: 165, golpe: true}]}]},
  {a: 5.81, b: 8.84, pos: 'above', lines: [
    {at: 5.81, parts: [{t: 'todo lo ', w: 500, size: 80}, {t: 'IMPORTANTE', w: 800, size: 80}]},
    {at: 7.32, parts: [{t: 'a pocos', w: 500, size: 92}]},
    {at: 7.76, parts: [{t: 'MINUTOS', w: 800, size: 165, golpe: true}]}]},
  {a: 11.73, b: 15.16, pos: 'center', lines: [
    {at: 11.73, parts: [{t: 'Menos tiempo', w: 500, size: 78}]},
    {at: 12.41, parts: [{t: 'ARRIBA DEL AUTO', w: 800, size: 92}]},
    {at: 13.6, parts: [{t: 'MENOS ESTRÉS', w: 800, size: 92}]},
    {at: 14.57, parts: [{t: 'MÁS VIDA', w: 800, size: 150, outline: true}]}]},
  {a: 22.7, b: 23.64, pos: 'above', lines: [
    {at: 22.7, parts: [{t: 'bien', w: 500, size: 92}]},
    {at: 23.1, parts: [{t: 'CERCA', w: 800, size: 165, golpe: true}]}]},
  {a: 28.55, b: 29.96, pos: 'above', lines: [
    {at: 28.55, parts: [{t: 'Podés tener las', w: 500, size: 88}]},
    {at: 29.27, parts: [{t: 'DOS COSAS', w: 800, size: 150, golpe: true}]}]},
  {a: 37.57, b: 38.69, pos: 'above', lines: [
    {at: 37.57, parts: [{t: 'Si querés dar', w: 500, size: 92}]},
    {at: 38.03, parts: [{t: 'EL PASO', w: 800, size: 165, golpe: true}]}]},
  {a: 38.69, b: 41.04, pos: 'above', lines: [
    {at: 38.69, parts: [{t: 'MANDAME', w: 800, size: 96}, {t: ' un', w: 500, size: 96}]},
    {at: 39.17, parts: [{t: 'MENSAJE', w: 800, size: 165, golpe: true}]},
    {at: 40.0, parts: [{t: 'y lo vemos juntos', w: 500, size: 76}]}]},
];
// [inicio de la primera palabra, texto] — '' oculta (entra un título); **x** = Heavy
const SUBS: [number, string][] = [
  [1.48, 'los **CHICOS**'], [2.19, '**TRANQUILOS**'], [3.19, 'sin **CORRER**'], [3.97, 'vos tomándote'], [5.13, 'un **CAFÉ**'], [5.81, ''],
  [8.91, 'Esto es lo que'], [9.67, 'me **DICEN**'], [10.12, 'las **FAMILIAS**'], [10.68, 'que ya se **MUDARON**'], [11.73, ''],
  [15.2, 'Hoy en **CANNING**'], [15.96, 'tenés la'], [16.62, '**NATURALEZA**'], [17.75, 'la **SEGURIDAD**'], [18.39, 'del **BARRIO CERRADO**'],
  [19.65, 'y todo lo que'], [20.21, 'tu **FAMILIA** necesita'], [21.41, 'para el **día a día**'], [22.7, ''],
  [23.67, 'Ya **NO** tenés'], [24.31, 'que **DECIDIR** entre'], [25.44, 'vivir **TRANQUILO**'], [26.52, 'y **RESOLVER**'], [27.08, 'la **LOGÍSTICA**'],
  [27.78, 'de tus **HIJOS**'], [28.55, ''],
  [29.98, 'Yo **CONOZCO**'], [30.46, 'esta **ZONA**'], [31.22, 'como la **PALMA**'], [31.89, 'de mi **MANO**'], [32.43, 'y mi **TRABAJO**'],
  [33.35, 'es **AYUDARTE**'], [34.31, 'a **ENCONTRAR**'], [34.91, 'el lugar **EXACTO**'], [36.08, 'para que todo'], [36.8, 'te quede **CÓMODO**'], [37.57, ''],
];

// ---------- utilidades ----------
const fr = (t: number) => Math.round(t * FPS);
const face = (f: number) => FACE[Math.max(0, Math.min(FACE.length - 1, f))];
const zoomAt = (t: number) => {
  for (const [a, b, s0, s1] of ZOOM) if (t >= a && t < b) return s0 + (s1 - s0) * ((t - a) / (b - a));
  return 1;
};
const brollAt = (t: number) => BROLL.find((c) => t >= c.a && t < c.b);
const screenY = (f: number, y: number) => {
  const fc = face(f);
  return fc.ey + (y - fc.ey) * zoomAt(f / FPS);
};

let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, weight: number, size: number, track: number) => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `${weight} ${size}px GB`;
  (ctx as any).letterSpacing = `${track * size}px`;
  return ctx!.measureText(txt).width;
};

// ---------- capa de imagen ----------
const transition = (frame: number) => {
  for (const [t, kind] of CUTS) {
    if (kind === 'leak') continue;
    const d = frame - fr(t);
    if (d < -3 || d > 2) continue;
    const p = d < 0 ? (d + 4) / 3 : (3 - d) / 3;
    const e = Easing.in(Easing.quad)(Math.min(1, p));
    if (kind === 'whip') return {tx: (d < 0 ? -1 : 1) * 260 * e, hblur: 45 * e, scale: 1 + 0.5 * e, blur: 0}; // escala para que el barrido no muestre bordes negros
    return {tx: 0, hblur: 0, scale: 1 + 0.3 * e, blur: 14 * e};
  }
  return {tx: 0, hblur: 0, scale: 1, blur: 0};
};

const ImageLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fc = face(frame);
  const s = zoomAt(t);
  const tr = transition(frame);
  // zoom-blur anclado a los ojos en planos de Tamara, al centro en B-roll
  const origin = brollAt(t) ? '540px 960px' : `${fc.ex}px ${fc.ey}px`;
  const filter = [tr.hblur > 0.5 ? 'url(#hblur)' : '', tr.blur > 0.3 ? `blur(${tr.blur}px)` : ''].join(' ').trim();
  return (
    <AbsoluteFill style={{transform: `translateX(${tr.tx}px) scale(${tr.scale})`, transformOrigin: origin, filter: filter || undefined}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="hblur" x="-20%" y="0" width="140%" height="100%">
          <feGaussianBlur stdDeviation={`${tr.hblur} 0`} />
        </filter>
      </svg>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${fc.ex}px ${fc.ey}px`}}>
        <OffthreadVideo src={staticFile('ta0510/base.mp4')} muted />
      </AbsoluteFill>
      {BROLL.map((c) => (
        <Sequence key={c.src} from={fr(c.a)} durationInFrames={fr(c.b) - fr(c.a)}>
          <BRoll src={c.src} len={fr(c.b) - fr(c.a)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
const BRoll: React.FC<{src: string; len: number}> = ({src, len}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, len], [1.02, 1.1]);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile(`ta0510/${src}.mp4`)} muted />
    </AbsoluteFill>
  );
};

// light leak cálido (ámbar/dorado) que barre el cuadro en el corte
const LightLeak: React.FC = () => {
  const frame = useCurrentFrame();
  let best: number | null = null;
  for (const [t, kind] of CUTS) if (kind === 'leak' && Math.abs(frame - fr(t)) <= 7) best = frame - fr(t);
  if (best === null) return null;
  const d = best;
  const op = interpolate(d, [-7, -1, 1, 7], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const x = interpolate(d, [-7, 7], [-20, 120]);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', opacity: op, pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 55% at ${x}% 40%, rgba(255,190,110,0.95) 0%, rgba(255,140,60,0.55) 35%, rgba(180,70,20,0) 75%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 45% 35% at ${100 - x * 0.6}% 75%, rgba(255,220,160,0.7) 0%, rgba(230,120,50,0.3) 45%, rgba(0,0,0,0) 80%)`}} />
      <AbsoluteFill style={{background: 'rgba(255,170,90,0.18)'}} />
    </AbsoluteFill>
  );
};

// ---------- subtítulos ----------
const parseSub = (txt: string) =>
  txt.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((p) => (p.startsWith('**') ? {t: p.slice(2, -2), w: 800} : {t: p, w: 500}));

const SUB_SIZE = 58;
const SUB_TRACK = -0.01;
const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + 0.04;
  let idx = -1;
  for (let i = 0; i < SUBS.length; i++) if (SUBS[i][0] <= t) idx = i;
  if (idx < 0 || !SUBS[idx][1]) return null;
  const a = fr(Math.max(0, SUBS[idx][0] - 0.04));
  const b = idx + 1 < SUBS.length ? fr(SUBS[idx + 1][0] - 0.04) : TA0510_FRAMES;
  const parts = parseSub(SUBS[idx][1]);
  const width = parts.reduce((acc, p) => acc + measure(p.t, p.w, SUB_SIZE, SUB_TRACK), 0);
  const k = Math.min(1, 720 / width);
  // plano que ocupa la mayor parte del bloque
  const counts = new Map<Clip | undefined, number>();
  for (let f = a; f < b; f++) {
    const c = brollAt(f / FPS);
    counts.set(c, (counts.get(c) || 0) + 1);
  }
  let clip: Clip | undefined;
  let max = -1;
  counts.forEach((n, c) => { if (n > max) { max = n; clip = c; } });
  const h = SUB_SIZE * 1.12 * k;
  let top: number;
  if (clip) top = (clip.subY ?? 960) - h / 2;
  else {
    let chin = 0;
    for (let f = a; f < b; f++) chin = Math.max(chin, screenY(f, face(f).bot));
    top = Math.min(chin + 22, 1440 - h);
  }
  const box = clip?.box;
  return (
    <div style={{position: 'absolute', left: 0, width: W, top, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: 'GB', fontSize: SUB_SIZE * k, lineHeight: 1.12, letterSpacing: `${SUB_TRACK}em`, color: '#fff', whiteSpace: 'nowrap',
        padding: box ? '4px 18px 8px' : 0, borderRadius: 10, background: box ? 'rgba(0,0,0,0.45)' : 'transparent',
        textShadow: '0 3px 10px rgba(30,20,14,0.55), 0 1px 3px rgba(30,20,14,0.5)'}}>
        {parts.map((p, i) => <span key={i} style={{fontWeight: p.w}}>{p.t}</span>)}
      </div>
    </div>
  );
};

// ---------- títulos ----------
const TRACK = -0.01;
const LH = 0.87;
const TitleView: React.FC<{ti: Title}> = ({ti}) => {
  const frame = useCurrentFrame();
  const a = fr(ti.a), b = fr(ti.b);
  if (frame < a || frame >= b) return null;
  const center = ti.pos === 'center';
  const maxW = center ? 720 : 790; // centrado: x 180–900 · a la izquierda: x 110–900
  const widths = ti.lines.map((l) => l.parts.reduce((acc, p) => acc + measure(p.t, p.w, p.size, TRACK), 0));
  const k = Math.min(1, maxW / Math.max(...widths));
  const lh = ti.lines.map((l) => Math.max(...l.parts.map((p) => p.size * (p.w === 800 && p.t === p.t.toUpperCase() ? 0.98 : LH))) * k);
  const H = lh.reduce((x, y) => x + y, 0);
  let top: number;
  if (center) top = 960 - H / 2; // estado final (todas las líneas) centrado en el cuadro
  else {
    let head = 9999;
    for (let f = a; f < b; f++) head = Math.min(head, screenY(f, face(f).top - HAIR_PAD));
    top = Math.max(270, head - 30 - H);
  }
  const out = interpolate(frame, [b - 4, b - 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  let y = top;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: out}}>
      {!center && <AbsoluteFill style={{opacity: interpolate(frame - a, [0, 6], [0, 1], {extrapolateRight: 'clamp'}),
        background: `linear-gradient(180deg, rgba(28,18,12,0.5) 0%, rgba(28,18,12,0.42) ${(top + H) / 19.2 - 4}%, rgba(28,18,12,0) ${(top + H) / 19.2 + 10}%)`}} />}
      {ti.lines.map((l, i) => {
        const yy = y;
        y += lh[i];
        return <TitleLine key={i} line={l} k={k} top={yy} h={lh[i]} local={frame - fr(l.at)} center={center} />;
      })}
    </div>
  );
};
const TitleLine: React.FC<{line: Line; k: number; top: number; h: number; local: number; center: boolean}> = ({line, k, top, h, local, center}) => {
  if (local < 0) return null;
  const big = line.parts.some((p) => p.golpe || p.outline);
  const op = interpolate(local, [0, 4], [0, 1], {extrapolateRight: 'clamp'});
  const lift = interpolate(local, [0, 7], [26, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const blur = interpolate(local, [0, 5], [10, 0], {extrapolateRight: 'clamp'});
  const pop = big ? interpolate(local, [0, 5, 9], [1.35, 0.96, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)}) : 1;
  return (
    <div style={{position: 'absolute', left: center ? 0 : 110, width: center ? W : 790, top, height: h, display: 'flex',
      justifyContent: center ? 'center' : 'flex-start', alignItems: 'flex-end', opacity: op, filter: `blur(${blur}px)`,
      transform: `translateY(${big ? 0 : lift}px) scale(${pop})`, transformOrigin: center ? '50% 60%' : '0% 60%'}}>
      {line.parts.map((p, j) => <Word key={j} p={p} k={k} />)}
    </div>
  );
};
const Word: React.FC<{p: Part; k: number}> = ({p, k}) => {
  const base: React.CSSProperties = {fontFamily: 'GB', fontWeight: p.w, fontSize: p.size * k, letterSpacing: `${TRACK}em`, lineHeight: LH, whiteSpace: 'pre'};
  if (p.golpe)
    return (
      <span style={{...base, color: 'transparent', backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text',
        filter: 'drop-shadow(0 4px 6px rgba(40,26,18,0.7)) drop-shadow(0 8px 20px rgba(40,26,18,0.5))', paddingBottom: '0.12em', marginBottom: '-0.12em', paddingTop: '0.3em', marginTop: '-0.3em'}}>{p.t}</span>
    );
  if (p.outline)
    return (
      <span style={{position: 'relative', display: 'inline-block', filter: 'drop-shadow(0 6px 14px rgba(30,20,14,0.55))'}}>
        <span style={{...base, color: '#fff', WebkitTextStroke: `${22 * k}px #fff`, position: 'absolute', left: 0, top: 0}}>{p.t}</span>
        <span style={{...base, color: '#fff', WebkitTextStroke: `${12 * k}px ${CHOC}`, paintOrder: 'stroke fill', position: 'relative'}}>{p.t}</span>
      </span>
    );
  return <span style={{...base, color: '#fff', textShadow: '0 4px 12px rgba(30,20,14,0.6)'}}>{p.t}</span>;
};

// ---------- guías ----------
const Guides: React.FC = () => {
  const frame = useCurrentFrame();
  const fc = face(frame);
  const top = screenY(frame, fc.top - HAIR_PAD), bot = screenY(frame, fc.bot);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid rgba(0,255,0,.8)'}} />
      <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'rgba(0,255,255,.6)'}} />
      {!brollAt(frame / FPS) && <div style={{position: 'absolute', left: fc.cx - fc.w * 0.8, width: fc.w * 1.6, top, height: bot - top, background: 'rgba(255,0,0,.25)'}} />}
    </AbsoluteFill>
  );
};

export const TA0510: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all(['500', '700', '800'].map((w) => new FontFace('GB', `url(${staticFile(`ta0510/fonts/${w}.otf`)})`, {weight: w}).load().then((x) => document.fonts.add(x))))
      .then(() => { setReady(true); continueRender(handle); });
  }, [handle]);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <ImageLayer />
      <LightLeak />
      {ready && <Subtitles />}
      {ready && TITLES.map((ti, i) => <TitleView key={i} ti={ti} />)}
      {GUIDES && <Guides />}
    </AbsoluteFill>
  );
};
