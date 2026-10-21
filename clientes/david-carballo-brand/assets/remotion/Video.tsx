// Plantilla del reel DC 07-10 (Remotion 4). Datos por video en ./data.ts: FACE (track_cara.swift suavizado), HAIR (limpiar_mascara.py), WORDS (alinear.py).
// Medios en public/<video>/: base.mp4, fg.mov (recorte con alfa para la rotoscopia), B-roll. Render en Mac: --browser-executable con el Chrome del sistema.
// DC 07-10 "Por qué te pido firmar antes de" — David Carballo (david-carballo-brand + edicion-reels-base)
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing, delayRender, continueRender, getInputProps} from 'remotion';
import {FACE, HAIR} from './data';

const FPS = 25;
const W = 1080;
const MAXW = 720; // centrado en x=540 → x 180–900
const NAVY = '#263142';
const GOLD_BLOCK = '#D2B759';
const GOLD_GRAD = 'linear-gradient(180deg, #D7BC68 0%, #DFC87F 30%, #F0E5C5 78%, #FFF3C9 100%)';
const ROTO_OVERLAP = 55; // px del pie de la última línea que pasan detrás de la cabeza
const GUIDES = !!getInputProps().guides; // render de revisión: --props='{"guides":true}'

// ---------- planos ----------
// zoom continuo anclado a los ojos: [desde, hasta, escala inicial, escala final]
const ZOOM: [number, number, number, number][] = [
  [0, 4.28, 1.0, 1.1],
  [4.28, 8.24, 1.04, 1.14],
  [14.88, 17.2, 1.0, 1.06],
  [18.1, 21.57, 1.06, 1.12],
  [21.57, 24.84, 1.2, 1.26], // punch en "Mi consejo"
];
const BROLL = [
  {src: 'realtor.mp4', a: 8.24, b: 10.2},
  {src: 'propio_papel.mp4', a: 10.2, b: 11.66},
  {src: 'casa.mp4', a: 11.66, b: 13.13},
  {src: 'telefono.mp4', a: 13.13, b: 14.88},
  {src: 'dolares.mp4', a: 17.2, b: 18.1},
];
const CUTS: [number, 'whip' | 'zoom'][] = [
  [4.28, 'whip'], [8.24, 'zoom'], [10.2, 'zoom'], [11.66, 'zoom'], [13.13, 'zoom'],
  [14.88, 'whip'], [17.2, 'zoom'], [18.1, 'zoom'],
];

// ---------- textos ----------
type Part = {t: string; w: 500 | 800; size: number; gold?: boolean};
type Line = {parts: Part[]; at?: number};
// roto: el título va DETRÁS de David (rotoscopia); solo el pie de la última línea pasa detrás de la cabeza
type Title = {a: number; b: number; pos: 'above' | 'below' | 'center'; roto?: boolean; lines: Line[]};
const TITLES: Title[] = [
  {a: 3.03, b: 4.28, pos: 'below', lines: [
    {parts: [{t: 'no es una', w: 500, size: 84}]},
    {parts: [{t: 'TRAMPA', w: 800, size: 150, gold: true}]}]},
  {a: 4.4, b: 5.95, pos: 'above', roto: true, lines: [
    {parts: [{t: 'Desde agosto', w: 500, size: 84}]},
    {parts: [{t: '2024', w: 800, size: 170, gold: true}]}]},
  {a: 6.57, b: 8.22, pos: 'above', roto: true, lines: [
    {parts: [{t: 'Asociación Nacional', w: 500, size: 70}]},
    {parts: [{t: 'de ', w: 500, size: 84}, {t: 'REALTORS', w: 800, size: 120, gold: true}]}]},
  {a: 15.79, b: 17.18, pos: 'above', roto: true, lines: [
    {parts: [{t: 'qué ', w: 500, size: 84}, {t: 'SERVICIOS', w: 800, size: 120, gold: true}]},
    {parts: [{t: 'te voy a dar', w: 500, size: 76}]}]},
  {a: 17.21, b: 18.08, pos: 'center', lines: [
    {parts: [{t: 'cómo me van', w: 500, size: 84}]},
    {parts: [{t: 'a ', w: 500, size: 96}, {t: 'PAGAR', w: 800, size: 160, gold: true}]}]},
  {a: 20.17, b: 21.53, pos: 'above', roto: true, lines: [
    {parts: [{t: 'al ', w: 500, size: 84}, {t: 'PRINCIPIO', w: 800, size: 130, gold: true}]},
    {parts: [{t: 'no en el cierre', w: 500, size: 72}]}]},
  {a: 22.11, b: 23.02, pos: 'above', roto: true, lines: [
    {parts: [{t: 'léelo', w: 500, size: 90}]},
    {parts: [{t: 'CONMIGO', w: 800, size: 140, gold: true}]}]},
  {a: 23.03, b: 24.84, pos: 'above', roto: true, lines: [
    {parts: [{t: 'y pregunta todo', w: 500, size: 80}]},
    {at: 24.08, parts: [{t: 'antes de ', w: 500, size: 80}, {t: 'FIRMAR', w: 800, size: 130, gold: true}]}]},
];
// [inicio de la primera palabra, texto] — '' oculta (entra un título o termina el tramo); **x** = ExtraBold
const SUBS: [number, string][] = [
  [0.02, 'Si un **REALTOR**'], [0.623, 'te pide **FIRMAR**'], [1.125, 'un **acuerdo**'], [1.668, 'antes de mostrarte'],
  [2.391, 'una **casa,**'], [3.03, ''],
  [5.969, 'por un **acuerdo**'], [6.57, ''],
  [8.24, 'el **agente**'], [8.721, 'que trabaja'], [9.102, 'con **COMPRADORES**'], [9.923, 'tiene que **FIRMAR**'],
  [10.605, '**POR ESCRITO**'], [11.146, 'un **ACUERDO**'], [11.707, 'antes de mostrarte'], [12.649, 'una **PROPIEDAD,**'],
  [13.17, 'aunque la visita'], [13.955, 'sea solo'], [14.357, 'por **VIDEO.**'], [14.88, ''],
  [14.92, 'Ese **PAPEL** dice'], [15.79, ''],
  [18.14, 'O sea,'], [18.561, 'la conversación'], [19.203, 'del **DINERO**'], [19.825, 'pasa'], [20.17, ''],
  [21.57, 'Mi **consejo:**'], [22.11, ''],
];

// ---------- utilidades ----------
const fr = (t: number) => Math.round(t * FPS);
const face = (f: number) => FACE[Math.max(0, Math.min(FACE.length - 1, f))];
const zoomAt = (t: number) => {
  for (const [a, b, s0, s1] of ZOOM) if (t >= a && t < b) return s0 + (s1 - s0) * ((t - a) / (b - a));
  return 1;
};
const brollAt = (t: number) => BROLL.find((c) => t >= c.a && t < c.b);
// posición en pantalla de un punto del video (zoom anclado en los ojos)
const screenY = (f: number, y: number) => {
  const fc = face(f);
  return fc.ey + (y - fc.ey) * zoomAt(f / FPS);
};

let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, weight: number, size: number, track: number) => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `${weight} ${size}px OS`;
  (ctx as any).letterSpacing = `${track * size}px`;
  return ctx!.measureText(txt).width;
};

// ---------- capa de imagen ----------
const transition = (frame: number) => {
  for (const [t, kind] of CUTS) {
    const d = frame - fr(t);
    if (d < -3 || d > 2) continue;
    const p = d < 0 ? (d + 4) / 3 : (3 - d) / 3; // 1/3..1 → corte → 1..1/3
    const e = Easing.in(Easing.quad)(Math.min(1, p));
    if (kind === 'whip') return {tx: (d < 0 ? -1 : 1) * 260 * e, hblur: 45 * e, scale: 1, blur: 0};
    return {tx: 0, hblur: 0, scale: 1 + 0.3 * e, blur: 14 * e};
  }
  return {tx: 0, hblur: 0, scale: 1, blur: 0};
};

const ImageLayer: React.FC<{fg?: boolean}> = ({fg}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fc = face(frame);
  const s = zoomAt(t);
  const tr = transition(frame);
  const filter = [tr.hblur > 0.5 ? `url(#${fg ? 'hblur-fg' : 'hblur'})` : '', tr.blur > 0.3 ? `blur(${tr.blur}px)` : ''].join(' ').trim();
  return (
    <AbsoluteFill style={{transform: `translateX(${tr.tx}px) scale(${tr.scale})`, filter: filter || undefined}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id={fg ? 'hblur-fg' : 'hblur'} x="-20%" y="0" width="140%" height="100%">
          <feGaussianBlur stdDeviation={`${tr.hblur} 0`} />
        </filter>
      </svg>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${fc.ex}px ${fc.ey}px`}}>
        {fg ? <OffthreadVideo src={staticFile('dc0710/fg.mov')} muted transparent /> : <OffthreadVideo src={staticFile('dc0710/base.mp4')} muted />}
      </AbsoluteFill>
      {!fg && BROLL.map((c) => (
        <Sequence key={c.src} from={fr(c.a)} durationInFrames={fr(c.b) - fr(c.a)}>
          <BRoll src={c.src} len={fr(c.b) - fr(c.a)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
const BRoll: React.FC<{src: string; len: number}> = ({src, len}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, len], [1.0, 1.08]);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('dc0710/' + src)} muted />
    </AbsoluteFill>
  );
};

// ---------- subtítulos ----------
const parseSub = (txt: string) =>
  txt.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((p) => (p.startsWith('**') ? {t: p.slice(2, -2), w: 800} : {t: p, w: 500}));

const SUB_SIZE = 64;
const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + 0.04;
  let idx = -1;
  for (let i = 0; i < SUBS.length; i++) if (SUBS[i][0] <= t) idx = i;
  if (idx < 0 || !SUBS[idx][1]) return null;
  const a = fr(Math.max(0, SUBS[idx][0] - 0.04));
  const b = idx + 1 < SUBS.length ? fr(SUBS[idx + 1][0] - 0.04) : 621;
  const parts = parseSub(SUBS[idx][1]);
  const width = parts.reduce((acc, p) => acc + measure(p.t, p.w, SUB_SIZE, -0.04), 0);
  const k = Math.min(1, MAXW / width);
  // plano que ocupa la mayor parte del bloque
  let brollFrames = 0;
  for (let f = a; f < b; f++) if (brollAt(f / FPS)) brollFrames++;
  const onBroll = brollFrames > (b - a) / 2;
  const h = SUB_SIZE * 1.15 * k;
  let top: number;
  if (onBroll) top = 960 - h / 2;
  else {
    let chin = 0;
    for (let f = a; f < b; f++) chin = Math.max(chin, screenY(f, face(f).bot));
    top = Math.min(chin + 34, 1440 - h);
  }
  return (
    <div style={{position: 'absolute', left: 0, width: W, top, textAlign: 'center', lineHeight: 1.15,
      fontFamily: 'OS', fontSize: SUB_SIZE * k, letterSpacing: '-0.04em', color: '#fff', whiteSpace: 'nowrap',
      WebkitTextStroke: `${8 * k}px ${NAVY}`, paintOrder: 'stroke fill', textShadow: '0 4px 10px rgba(20,24,32,0.45)'}}>
      {parts.map((p, i) => <span key={i} style={{fontWeight: p.w}}>{p.t}</span>)}
    </div>
  );
};

// ---------- títulos ----------
const TitleView: React.FC<{ti: Title}> = ({ti}) => {
  const frame = useCurrentFrame();
  const a = fr(ti.a), b = fr(ti.b);
  if (frame < a || frame >= b) return null;
  // ajuste al ancho seguro
  const widths = ti.lines.map((l) => l.parts.reduce((acc, p) => acc + measure(p.t, p.w, p.size, -0.1), 0));
  const k = Math.min(1, MAXW / Math.max(...widths));
  const lh = ti.lines.map((l) => Math.max(...l.parts.map((p) => p.size)) * 0.9 * k);
  const H = lh.reduce((x, y) => x + y, 0);
  let top: number;
  if (ti.pos === 'center') top = 960 - H / 2;
  else if (ti.roto) {
    let hair = 9999;
    for (let f = a; f < b; f++) hair = Math.min(hair, screenY(f, HAIR[Math.min(f, HAIR.length - 1)]));
    // línea final chica (bajada) → se mete menos detrás, para que la frase se lea entera
    const overlap = Math.min(ROTO_OVERLAP, 0.3 * lh[lh.length - 1]);
    top = Math.max(270, hair + overlap - H);
  } else if (ti.pos === 'above') {
    let head = 9999;
    for (let f = a; f < b; f++) head = Math.min(head, screenY(f, face(f).top));
    top = Math.max(270, head - 30 - H);
  } else {
    let chin = 0;
    for (let f = a; f < b; f++) chin = Math.max(chin, screenY(f, face(f).bot));
    top = Math.min(chin + 36, 1440 - H);
  }
  const out = interpolate(frame, [b - 4, b - 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  let y = top;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: out, transform: `translateY(${(1 - out) * -12}px)`}}>
      {ti.lines.map((l, i) => {
        const start = l.at !== undefined ? fr(l.at) : a + i * 3;
        const yy = y;
        y += lh[i];
        return <TitleLine key={i} line={l} k={k} top={yy} h={lh[i]} local={frame - start} width={widths[i] * k} />;
      })}
    </div>
  );
};
const TitleLine: React.FC<{line: Line; k: number; top: number; h: number; local: number; width: number}> = ({line, k, top, h, local, width}) => {
  if (local < 0) return null;
  const grow = interpolate(local, [0, 5], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const retract = interpolate(local, [5, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const lift = interpolate(local, [0, 8], [14, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const x0 = 540 - width / 2 - 14, bw = width + 28;
  return (
    <div style={{position: 'absolute', left: 0, width: W, top, height: h}}>
      <div style={{position: 'absolute', left: 0, width: W, top: 0, height: h, display: 'flex', justifyContent: 'center', alignItems: 'center',
        clipPath: `inset(-40px ${W - (x0 + bw * grow)}px -40px 0px)`, transform: `translateY(${lift}px)`,
        filter: 'drop-shadow(0 5px 12px rgba(20,24,32,0.55))'}}>
        {line.parts.map((p, j) => (
          <span key={j} style={{fontFamily: 'OS', fontWeight: p.w, fontSize: p.size * line_k(k), letterSpacing: '-0.1em', lineHeight: 1,
            whiteSpace: 'pre', color: p.gold ? 'transparent' : '#fff', paddingRight: p.gold ? '0.1em' : 0,
            ...(p.gold ? {backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text'} : {})}}>{p.t}</span>
        ))}
      </div>
      {retract < 1 && (
        <div style={{position: 'absolute', top: h * 0.08, height: h * 0.84, left: x0 + bw * retract, width: Math.max(0, bw * (grow - retract)), background: GOLD_BLOCK}} />
      )}
    </div>
  );
};
const line_k = (k: number) => k;

// recorte de David por encima de los títulos con rotoscopia (mismo zoom/transición que la imagen)
const FgAt: React.FC<{from: number}> = ({from}) => (
  <Sequence from={-from} layout="none">
    <ImageLayer fg />
  </Sequence>
);

// ---------- guías ----------
const Guides: React.FC = () => {
  const frame = useCurrentFrame();
  const fc = face(frame);
  const top = screenY(frame, fc.top), bot = screenY(frame, fc.bot);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid rgba(0,255,0,.8)'}} />
      <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'rgba(0,255,255,.6)'}} />
      {!brollAt(frame / FPS) && <div style={{position: 'absolute', left: 140, width: 800, top, height: bot - top, background: 'rgba(255,0,0,.25)'}} />}
    </AbsoluteFill>
  );
};

export const DC0710: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const fonts: [string, string, string][] = [
      ['OpenSans-Medium.ttf', '500', 'normal'], ['OpenSans-ExtraBold.ttf', '800', 'normal'], ['OpenSans-ExtraBoldItalic.ttf', '800', 'italic']];
    Promise.all(fonts.map(([f, w, s]) => new FontFace('OS', `url(${staticFile('fonts/' + f)})`, {weight: w, style: s}).load().then((x) => document.fonts.add(x))))
      .then(() => { setReady(true); continueRender(handle); });
  }, [handle]);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <ImageLayer />
      {ready && TITLES.filter((ti) => ti.roto).map((ti, i) => <TitleView key={'r' + i} ti={ti} />)}
      {TITLES.filter((ti) => ti.roto).map((ti, i) => (
        <Sequence key={'fg' + i} from={fr(ti.a)} durationInFrames={fr(ti.b) - fr(ti.a)} layout="none">
          <FgAt from={fr(ti.a)} />
        </Sequence>
      ))}
      {ready && <Subtitles />}
      {ready && TITLES.filter((ti) => !ti.roto).map((ti, i) => <TitleView key={i} ti={ti} />)}
      {GUIDES && <Guides />}
    </AbsoluteFill>
  );
};
