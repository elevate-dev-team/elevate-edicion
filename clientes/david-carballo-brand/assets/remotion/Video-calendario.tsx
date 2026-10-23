// DC 05-10 "Título pendiente" — David Carballo (david-carballo-brand + edicion-reels-base)
// Plantilla de referencia (copia de remotion-elevate/src/dc0510/Video.tsx). Necesita ./data (F0, FACE: ojos de David por frame,
// de track_cara.swift) y en public/dc0510/ los clips convertidos, logo_blanco/negro.png y las fuentes Open Sauce One.
// Voz: hook de IMG_0845 + cuerpo de IMG_0846 (calendario, voz en off) + toma B a cámara (090747), limpiada por el editor.
// Estructura aprobada (v2). Acabado: subtítulos, títulos, logo, transiciones. El audio (voz + música + SFX) se mezcla aparte.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing, delayRender, continueRender, getInputProps} from 'remotion';
import {F0, FACE} from './data';

export const DC0510_FRAMES = 914;
const FPS = 30;
const W = 1080;
const MAXW = 720; // centrado en x=540 → x 180–900
const NAVY = '#263142';
const DESK = '#34322D';
const GOLD_BLOCK = '#D2B759';
const GOLD_GRAD = 'linear-gradient(180deg, #D8C080 0%, #DFC87F 30%, #F0E5C5 78%, #FFF3C9 100%)';
const GUIDES = !!getInputProps().guides;

const fr = (t: number) => Math.round(t * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- planos ----------
type Kind = 'cal' | 'full' | 'david';
type Clip = {src: string; a: number; b: number; from: number; kind: Kind; w?: number; h?: number; z?: [number, number]; o?: [number, number]; logo: 'b' | 'n'};
// [a, b) en la línea de tiempo; from = segundo de la fuente en a; logo: b = blanco (fondo oscuro), n = negro
const CLIPS: Clip[] = [
  {src: 'cal45', a: 0, b: 3.5333, from: 2.5, kind: 'cal', w: 1078, h: 1216, z: [1.0, 1.16], o: [560, 0], logo: 'b'}, // hook: zoom in lento hacia el 25
  {src: 'tasador', a: 3.5333, b: 6.4, from: 2.0, kind: 'full', logo: 'n'},            // un cierre con financiamiento…
  {src: 'agendar', a: 6.4, b: 8.9667, from: 2.9, kind: 'full', logo: 'n'},            // 30 a 45 días desde que se acepta la oferta
  {src: 'llaves', a: 8.9667, b: 10.4, from: 1.8, kind: 'full', logo: 'n'},            // si quieres tener las llaves
  {src: 'cal46', a: 10.4, b: 11.6333, from: 4.3, kind: 'cal', w: 1078, h: 1094, logo: 'b'},     // antes del 25 de diciembre
  {src: 'cal45', a: 11.6333, b: 12.8333, from: 6.0, kind: 'cal', w: 1078, h: 1216, logo: 'b'},  // pasa a noviembre
  {src: 'cal45', a: 12.8333, b: 14.5333, from: 10.6, kind: 'cal', w: 1078, h: 1216, logo: 'b'}, // rodea mediados de noviembre
  {src: 'escribir', a: 14.5333, b: 16.95, from: 2.0, kind: 'full', logo: 'n'},        // necesitas la precalificación
  {src: 'casa', a: 16.95, b: 18.55, from: 1.0, kind: 'full', logo: 'b'},              // y encontrar la casa
  {src: 'cal46', a: 18.55, b: 21.1667, from: 30.4, kind: 'cal', w: 1078, h: 1094, logo: 'b'},   // ahora, en octubre
  {src: 'david', a: 21.1667, b: 23.6, from: 0.5333, kind: 'david', z: [1.0, 1.05], logo: 'n'},  // si miras casas nuevas…
  {src: 'obra', a: 23.6, b: 26.45, from: 3.0, kind: 'full', logo: 'n'},               // en construcción / el builder
  {src: 'david', a: 26.45, b: 26.8333, from: 5.8167, kind: 'david', z: [1.22, 1.24], logo: 'n'}, // no tú (punch-in)
  {src: 'david', a: 26.8333, b: 30.4667, from: 6.5667, kind: 'david', z: [1.0, 1.08], logo: 'n'}, // CTA
];
const clipAt = (t: number) => CLIPS.find((c) => t >= c.a && t < c.b) ?? CLIPS[CLIPS.length - 1];
// transición en cada corte: whip entre bloques, zoom-blur dentro del calendario / punch
const CUTS: [number, 'whip' | 'zoom'][] = [
  [3.5333, 'whip'], [6.4, 'zoom'], [8.9667, 'whip'], [10.4, 'whip'], [11.6333, 'zoom'], [12.8333, 'zoom'], [14.5333, 'whip'],
  [16.95, 'zoom'], [18.55, 'whip'], [21.1667, 'whip'], [23.6, 'whip'], [26.45, 'whip'],
];
const LEAKS = [3.5333, 21.1667]; // light leak cálido en los cambios de bloque

// calendario: centrado más abajo para dejar la franja de arriba (y 280–490) a títulos y subtítulos
const CAL_CY = 1150;

// ---------- cara de David ----------
const faceAtSrc = (srcT: number) => FACE[Math.max(0, Math.min(FACE.length - 1, Math.round(srcT * FPS) - F0))];
const davidState = (t: number) => {
  const c = clipAt(t);
  if (c.kind !== 'david') return null;
  const n = fr(c.b) - fr(c.a);
  const [z0, z1] = c.z!;
  const s = interpolate(fr(t) - fr(c.a), [0, n], [z0, z1], clamp);
  const fc = faceAtSrc(c.from + (t - c.a));
  return {s, fc, y: (y: number) => fc.ey + (y - fc.ey) * s};
};

// ---------- textos ----------
type Part = {t: string; w: 400 | 500 | 800 | 900; size: number; gold?: boolean; box?: boolean};
type Line = {parts: Part[]; at?: number; fx?: 'flip'};
type Pos = 'top' | 'center' | 'head';
type Title = {a: number; b: number; pos: Pos; lines: Line[]};
const TITLES: Title[] = [
  {a: 0, b: 1.84, pos: 'top', lines: [
    {at: 0, parts: [{t: '¿Quieres pasar', w: 500, size: 60}]},
    {at: 0.5, parts: [{t: 'NAVIDAD', w: 900, size: 132}]},
    {at: 1.07, parts: [{t: 'en tu casa nueva?', w: 800, size: 62, gold: true}]}]},
  {a: 1.84, b: 3.5333, pos: 'top', lines: [
    {at: 1.82, parts: [{t: 'entonces la cuenta se hace', w: 500, size: 58}]},
    {at: 3.12, fx: 'flip', parts: [{t: 'AL REVÉS', w: 900, size: 132}]}]},
  // 'días' en caja navy (en dorado no se leía sobre la hoja clara); el título se queda hasta el corte y suma la bajada
  {a: 6.44, b: 8.9667, pos: 'center', lines: [
    {at: 6.44, parts: [{t: '30', w: 900, size: 210}, {t: ' a ', w: 500, size: 90}, {t: '45', w: 900, size: 210}]},
    {at: 7.55, parts: [{t: 'DÍAS', w: 900, size: 92, box: true}]},
    {at: 7.82, parts: [{t: 'desde que se acepta la oferta', w: 500, size: 52}]}]},
  {a: 10.4, b: 11.6333, pos: 'top', lines: [
    {at: 10.4, parts: [{t: 'antes del', w: 500, size: 58}]},
    {at: 10.45, parts: [{t: '25', w: 900, size: 140}, {t: ' de diciembre', w: 800, size: 64, gold: true}]}]},
  {a: 13.08, b: 14.5333, pos: 'top', lines: [
    {at: 13.08, parts: [{t: 'a mediados de', w: 500, size: 58}]},
    {at: 13.97, parts: [{t: 'NOVIEMBRE', w: 900, size: 124}]}]},
  {a: 15.54, b: 16.95, pos: 'center', lines: [
    {at: 15.54, parts: [{t: 'necesitas la', w: 500, size: 66}]},
    {at: 16.14, parts: [{t: 'PRECALIFICACIÓN', w: 900, size: 104}]}]},
  {a: 18.55, b: 21.1667, pos: 'top', lines: [
    {at: 18.55, parts: [{t: 'la precalificación es', w: 500, size: 58}]},
    {at: 19.99, parts: [{t: 'AHORA', w: 900, size: 140}]},
    {at: 20.43, parts: [{t: 'en octubre', w: 800, size: 66, gold: true}]}]},
  {a: 25.1, b: 26.45, pos: 'center', lines: [
    {at: 25.1, parts: [{t: 'la fecha la pone', w: 500, size: 66}]},
    {at: 25.82, parts: [{t: 'EL BUILDER', w: 900, size: 124}]}]},
  {a: 26.45, b: 26.8667, pos: 'head', lines: [
    {at: 26.45, parts: [{t: 'NO TÚ', w: 900, size: 150, gold: true}]}]},
];
// [inicio de la primera palabra, texto] — '' oculta; **x** = Bold
const SUBS: [number, string][] = [
  [3.56, 'Un **cierre**'], [4.0, 'con **financiamiento**'], [5.02, 'tarda en **promedio**'], [5.96, '**entre**'], [6.44, ''],
  [9.0, 'Si quieres **tener**'], [9.56, 'las **llaves**'], [10.1, 'antes del'], [10.4, ''],
  [11.64, 'la **oferta** tiene que'], [12.28, 'estar **aceptada**'], [13.08, ''],
  [14.58, 'y antes de **ofertar**'], [15.54, ''],
  [17.08, 'y encontrar'], [17.58, 'la **casa.**'], [18.04, 'O sea:'], [18.55, ''],
  [21.17, 'Si miras'], [21.53, 'casas **nuevas,**'], [22.17, 'pregunta si ya'], [22.87, 'está **terminada.**'],
  [23.6, 'Si todavía está'], [24.27, 'en **construcción,**'], [25.1, ''],
  [26.88, 'Si quieres **intentarlo,**'], [27.74, '**escríbeme**'], [28.14, 'esta **semana**'],
  [28.76, 'y **armamos**'], [29.18, 'tu **calendario**'], [29.84, 'con tus **fechas.**'],
];

let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, weight: number, size: number, track: number) => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `${weight} ${size}px OSO`;
  (ctx as any).letterSpacing = `${track * size}px`;
  return ctx!.measureText(txt).width;
};

// ---------- transiciones ----------
const transition = (frame: number) => {
  for (const [t, kind] of CUTS) {
    const d = frame - fr(t);
    if (d < -3 || d > 2) continue;
    const p = d < 0 ? (d + 4) / 3 : (3 - d) / 3;
    const e = Easing.in(Easing.quad)(Math.max(0, Math.min(1, p)));
    if (kind === 'whip') return {tx: (d < 0 ? -1 : 1) * 260 * e, hblur: 45 * e, scale: 1 + 0.5 * e, blur: 0}; // escala ≥ 1 + 2·260/1080: el barrido nunca deja ver el borde
    return {tx: 0, hblur: 0, scale: 1 + 0.3 * e, blur: 14 * e};
  }
  return {tx: 0, hblur: 0, scale: 1, blur: 0};
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

// ---------- planos ----------
const Cal: React.FC<{c: Clip}> = ({c}) => {
  const f = useCurrentFrame();
  const n = fr(c.b) - fr(c.a);
  const [z0, z1] = c.z ?? [1.0, 1.04];
  const s = interpolate(f, [0, n], [z0, z1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const h = (1080 / c.w!) * c.h!;
  const top = CAL_CY - h / 2;
  const [ox, oy] = c.o ?? [540, h / 2];
  const fade = 'linear-gradient(180deg, transparent 0px, #000 70px, #000 calc(100% - 70px), transparent 100%)';
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 60% at 50% 55%, ${DESK} 0%, #23221F 70%, #161513 100%)`}}>
      <div style={{position: 'absolute', left: 0, top, width: 1080, height: h, transform: `scale(${s})`, transformOrigin: `${ox}px ${oy}px`,
        WebkitMaskImage: fade, maskImage: fade}}>
        <OffthreadVideo src={staticFile(`dc0510/${c.src}.mp4`)} startFrom={fr(c.from)} muted style={{width: '100%', height: '100%'}} />
      </div>
      {/* franja superior más oscura para los textos */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.35) 25%, rgba(10,10,10,0) 34%)'}} />
    </AbsoluteFill>
  );
};
const Full: React.FC<{c: Clip}> = ({c}) => {
  const f = useCurrentFrame();
  const n = fr(c.b) - fr(c.a);
  const s = interpolate(f, [0, n], [1.0, 1.05], clamp);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`}}>
      <OffthreadVideo src={staticFile(`dc0510/${c.src}.mp4`)} startFrom={fr(c.from)} muted />
    </AbsoluteFill>
  );
};
const David: React.FC<{c: Clip}> = ({c}) => {
  const f = useCurrentFrame();
  const st = davidState(c.a + f / FPS)!;
  return (
    <AbsoluteFill style={{transform: `scale(${st.s})`, transformOrigin: `${st.fc.ex}px ${st.fc.ey}px`}}>
      <OffthreadVideo src={staticFile('dc0510/david.mp4')} startFrom={fr(c.from)} muted />
    </AbsoluteFill>
  );
};

const ImageLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const tr = transition(frame);
  const filter = [tr.hblur > 0.5 ? 'url(#hblur)' : '', tr.blur > 0.3 ? `blur(${tr.blur}px)` : ''].join(' ').trim();
  return (
    <AbsoluteFill style={{transform: `translateX(${tr.tx}px) scale(${tr.scale})`, filter: filter || undefined}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="hblur" x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${Math.max(0, tr.hblur)} 0`} /></filter>
      </svg>
      {CLIPS.map((c, i) => (
        <Sequence key={i} from={fr(c.a)} durationInFrames={fr(c.b) - fr(c.a)}>
          {c.kind === 'cal' ? <Cal c={c} /> : c.kind === 'full' ? <Full c={c} /> : <David c={c} />}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ---------- subtítulos ----------
const parseSub = (txt: string) =>
  txt.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((p) => (p.startsWith('**') ? {t: p.slice(2, -2), w: 800} : {t: p, w: 500}));
const SUB_SIZE = 58;
const TOP_BAND = 430; // centro de la franja superior en los planos del calendario (debajo del logo, que llega a y=303)
const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + 0.04;
  let idx = -1;
  for (let i = 0; i < SUBS.length; i++) if (SUBS[i][0] <= t) idx = i;
  if (idx < 0 || !SUBS[idx][1]) return null;
  const a = fr(Math.max(0, SUBS[idx][0] - 0.04));
  const b = idx + 1 < SUBS.length ? fr(SUBS[idx + 1][0] - 0.04) : DC0510_FRAMES;
  const parts = parseSub(SUBS[idx][1]);
  const width = parts.reduce((acc, p) => acc + measure(p.t, p.w, SUB_SIZE, -0.03), 0);
  const k = Math.min(1, MAXW / width);
  const h = SUB_SIZE * 1.15 * k;
  // plano que ocupa la mayor parte del bloque
  const count: Record<Kind, number> = {cal: 0, full: 0, david: 0};
  for (let f = a; f < b; f++) count[clipAt(f / FPS).kind]++;
  const kind = (Object.keys(count) as Kind[]).sort((x, y) => count[y] - count[x])[0];
  let top: number;
  if (kind === 'cal') top = TOP_BAND - h / 2;
  else if (kind === 'full') top = 960 - h / 2;
  else {
    let chin = 0;
    for (let f = a; f < b; f++) { const st = davidState(f / FPS); if (st) chin = Math.max(chin, st.y(st.fc.bot)); }
    top = Math.min(chin + 34, 1440 - h);
  }
  const pop = interpolate(frame - a, [0, 4], [0.9, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  return (
    <div style={{position: 'absolute', left: 0, width: W, top, textAlign: 'center', lineHeight: 1.15,
      fontFamily: 'OSO', fontSize: SUB_SIZE * k, letterSpacing: '-0.03em', color: '#fff', whiteSpace: 'nowrap',
      transform: `scale(${pop})`, textShadow: '0 3px 14px rgba(20,24,32,0.75), 0 1px 3px rgba(20,24,32,0.6)'}}>
      {parts.map((p, i) => <span key={i} style={{fontWeight: p.w}}>{p.t}</span>)}
    </div>
  );
};

// ---------- títulos ----------
const TitleView: React.FC<{ti: Title}> = ({ti}) => {
  const frame = useCurrentFrame();
  const a = fr(ti.a), b = fr(ti.b);
  if (frame < a || frame >= b) return null;
  const widths = ti.lines.map((l) => l.parts.reduce((acc, p) => acc + measure(p.t, p.w, p.size, -0.06) + (p.box ? 0.64 * p.size : 0), 0));
  const k = Math.min(1, MAXW / Math.max(...widths));
  const lh = ti.lines.map((l) => Math.max(...l.parts.map((p) => p.size * (p.box ? 1.45 : 1))) * 0.88 * k);
  const H = lh.reduce((x, y) => x + y, 0);
  let top: number;
  if (ti.pos === 'top') top = Math.max(318, TOP_BAND - H / 2);
  else if (ti.pos === 'center') top = 960 - H / 2;
  else {
    let hair = 9999;
    for (let f = a; f < b; f++) { const st = davidState(f / FPS); if (st) hair = Math.min(hair, st.y(st.fc.top - 0.45 * st.fc.w)); }
    top = Math.max(282, hair - 26 - H);
  }
  const out = interpolate(frame, [b - 4, b - 1], [1, 0], clamp);
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
  const grow = interpolate(local, [0, 5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const retract = interpolate(local, [5, 10], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const lift = interpolate(local, [0, 8], [14, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const flip = line.fx === 'flip' ? interpolate(local, [0, 9], [180, 0], {...clamp, easing: Easing.out(Easing.back(1.4))}) : 0;
  const x0 = 540 - width / 2 - 14, bw = width + 28;
  const content = (
    <div style={{position: 'absolute', left: 0, width: W, top: 0, height: h, display: 'flex', justifyContent: 'center', alignItems: 'baseline',
      transform: `translateY(${lift}px) perspective(900px) rotateX(${flip}deg)`, backfaceVisibility: 'hidden',
      filter: 'drop-shadow(0 5px 12px rgba(20,24,32,0.6))'}}>
      {line.parts.map((p, j) => (
        <span key={j} style={{fontFamily: 'OSO', fontWeight: p.w, fontSize: p.size * k, letterSpacing: '-0.06em', lineHeight: 0.95,
          whiteSpace: 'pre', color: p.gold ? 'transparent' : '#fff', paddingRight: p.gold ? '0.08em' : 0,
          ...(p.box ? {background: NAVY, padding: '0.12em 0.32em 0.06em', borderRadius: 10, letterSpacing: '-0.03em', boxShadow: '0 10px 24px rgba(10,14,22,0.45)'} : {}),
          ...(p.gold ? {backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', paddingTop: '0.3em', marginTop: '-0.3em', paddingBottom: '0.15em', marginBottom: '-0.15em'} : {})}}>{p.t}</span>
      ))}
    </div>
  );
  if (line.fx === 'flip') return <div style={{position: 'absolute', left: 0, width: W, top, height: h}}>{content}</div>;
  return (
    <div style={{position: 'absolute', left: 0, width: W, top, height: h}}>
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(-60px ${W - (x0 + bw * grow)}px -60px 0px)`}}>{content}</div>
      {retract < 1 && (
        <div style={{position: 'absolute', top: h * 0.08, height: h * 0.84, left: x0 + bw * retract, width: Math.max(0, bw * (grow - retract)), background: GOLD_BLOCK}} />
      )}
    </div>
  );
};

// oscurece un poco el stock mientras hay un título centrado encima (se lee mejor sobre fondos claros)
const TitleDim: React.FC = () => {
  const frame = useCurrentFrame();
  let k = 0;
  for (const ti of TITLES) if (ti.pos === 'center') k = Math.max(k, interpolate(frame, [fr(ti.a), fr(ti.a) + 5, fr(ti.b) - 4, fr(ti.b)], [0, 1, 1, 0], clamp));
  return k > 0 ? <AbsoluteFill style={{background: 'radial-gradient(70% 40% at 50% 50%, rgba(15,18,24,0.62) 0%, rgba(15,18,24,0.25) 100%)', opacity: k}} /> : null;
};

// ---------- logo (siempre arriba a la derecha, pisando todo) ----------
const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const c = clipAt(frame / FPS);
  return <Img src={staticFile(c.logo === 'b' ? 'dc0510/logo_blanco.png' : 'dc0510/logo_negro.png')} style={{position: 'absolute', left: 735, top: 75, width: 240}} />;
};

// ---------- guías ----------
const Guides: React.FC = () => {
  const frame = useCurrentFrame();
  const st = davidState(frame / FPS);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid rgba(0,255,0,.8)'}} />
      <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'rgba(0,255,255,.6)'}} />
      {st && <div style={{position: 'absolute', left: 300, width: 480, top: st.y(st.fc.top - 0.45 * st.fc.w), height: st.y(st.fc.bot) - st.y(st.fc.top - 0.45 * st.fc.w), background: 'rgba(255,0,0,.25)'}} />}
    </AbsoluteFill>
  );
};

export const DC0510: React.FC = () => {
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
      <TitleDim />
      {ready && <Subtitles />}
      {ready && TITLES.map((ti, i) => <TitleView key={i} ti={ti} />)}
      <Logo />
      {GUIDES && <Guides />}
    </AbsoluteFill>
  );
};
