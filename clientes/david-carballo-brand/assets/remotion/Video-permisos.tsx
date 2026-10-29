// DC 10-10 "En una casa remodelada, busco e…" — David Carballo (david-carballo-brand + edicion-reels-base)
// Permisos en una casa remodelada: hook en el closet del aire → "Son los permisos" (dedo sobre el BUILDING PERMIT) → selfies de techo / aire /
// plomería / electricidad → cocina (Hillsborough) → motion del portal → stock (obra, cartel For Sale) → puerta (CTA) → primer plano del permiso.
// Estructura aprobada (v1, 2026-10-29). Voz: AUDIO MEJORADO del usuario + cadena sin reductor (PROYECTO/voz_cadena_mejorada.py).
// Acabado sobre la plantilla de 13-10: subtítulos pegados a la cara, 4 títulos, UN solo motion (pedido del usuario), logo, transiciones.
// El audio (voz + música + SFX) se mezcla aparte (PROYECTO/mix.py).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing, delayRender, continueRender, getInputProps} from 'remotion';
import {FACES, SEGS} from './face';
import {SUBS} from './subs';

const FPS = 30;
export const DC1010_FRAMES = Math.round(30.8 * FPS);
const W = 1080;
const MAXW = 720; // centrado en x=540 → x 180–900
const NAVY = '#263142';
const CREMA = '#FFF3C9';
const GOLD_BLOCK = '#D2B759';
const GOLD_GRAD = 'linear-gradient(180deg, #D8C080 0%, #DFC87F 30%, #F0E5C5 78%, #FFF3C9 100%)';
const PROPS = getInputProps() as {guides?: boolean; voz?: boolean};
const fr = (t: number) => Math.round(t * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- planos (estructura aprobada) ----------
// david: toma con cara (zoom anclado a los ojos) · own: toma propia sin cara · stock · motion
type Kind = 'david' | 'own' | 'stock' | 'motion';
type Clip = {a: number; b: number; kind: Kind; z?: [number, number]; src?: string; from?: number; logo: 'b' | 'n'; subY?: number; oy?: number};
const CLIPS: Clip[] = [
  {a: 0, b: 2.45, kind: 'david', z: [1.0, 1.06], logo: 'b'},                      // Esta casa está remodelada, y lo primero que reviso
  {a: 2.45, b: 3.2, kind: 'david', z: [1.24, 1.27], logo: 'b'},                   // no es la cocina…
  {a: 3.2, b: 4.267, kind: 'own', src: 't4', from: 4.28, logo: 'b'},              // Son los permisos (dedo sobre el BUILDING PERMIT)
  {a: 4.267, b: 5.033, kind: 'david', z: [1.0, 1.03], logo: 'n'},                 // un techo
  {a: 5.033, b: 6.2, kind: 'david', z: [1.0, 1.03], logo: 'b'},                   // un aire acondicionado
  {a: 6.2, b: 7.067, kind: 'david', z: [1.0, 1.03], logo: 'n'},                   // la plomería
  {a: 7.067, b: 8.7, kind: 'david', z: [1.0, 1.03], logo: 'n'},                   // o la electricidad nuevos
  {a: 8.7, b: 10.367, kind: 'david', z: [1.16, 1.19], logo: 'n'},                 // en general, llevan permiso
  {a: 10.367, b: 12.7, kind: 'david', z: [1.0, 1.1], logo: 'n'},                  // En Hillsborough se buscan gratis por la dirección
  {a: 12.7, b: 21.5, kind: 'motion', logo: 'b'},                                  // en el portal del condado… quedó cerrado
  {a: 21.5, b: 23.233, kind: 'stock', src: 'inspeccion', from: 0.3, logo: 'n'},   // Si un trabajo se hizo sin permiso
  {a: 23.233, b: 25.233, kind: 'stock', src: 'cartel3', from: 1.0, logo: 'b', subY: 1060}, // el problema no se va con el dueño anterior
  {a: 25.233, b: 27.2, kind: 'david', z: [1.0, 1.06], logo: 'n'},                 // se queda con la casa. Entonces,
  {a: 27.2, b: 28.9, kind: 'david', z: [1.3, 1.34], logo: 'n'},                   // pide el año de cada arreglo
  {a: 28.9, b: 30.8, kind: 'own', src: 'permiso_lento', from: 0.76, logo: 'b', z: [1.2, 1.26], oy: 1920}, // zoom desde abajo: el papel blanco de arriba sale de cuadro (logo legible)   // y compáralo con lo que dice el permiso
];
export const clipAt = (t: number) => CLIPS.find((c) => t >= c.a && t < c.b) ?? CLIPS[CLIPS.length - 1];
// transición en cada corte: zoom-blur entre dos planos de la misma toma, whip en el resto
const sameTake = (x: Clip, y: Clip) => x.kind === 'david' && y.kind === 'david' && segAt(x.a).toma === segAt(y.a).toma;
export const CUTS: [number, 'whip' | 'zoom'][] = CLIPS.slice(1).map((c, i) => [c.a, sameTake(CLIPS[i], c) ? 'zoom' : 'whip']);
const LEAKS = [3.2, 10.367, 25.233]; // light leak cálido al entrar a "son los permisos", a la cocina y a la puerta

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

const davidPieces = (c: Clip) =>
  SEGS.filter((s) => s.t1 > c.a && s.t0 < c.b).map((s) => ({a: Math.max(c.a, s.t0), b: Math.min(c.b, s.t1), seg: s})).filter((p) => fr(p.b) - fr(p.a) > 0);

const David: React.FC<{a: number; seg: (typeof SEGS)[number]}> = ({a, seg}) => {
  const f = useCurrentFrame();
  const st = davidState(a + f / FPS)!;
  return (
    <AbsoluteFill style={{transform: `scale(${st.s})`, transformOrigin: `${st.fc.ex}px ${st.fc.ey}px`}}>
      <OffthreadVideo src={staticFile(`dc1010/t${seg.toma}.mp4`)} startFrom={fr(seg.in + (a - seg.t0))} muted />
    </AbsoluteFill>
  );
};
const Stock: React.FC<{c: Clip}> = ({c}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, fr(c.b) - fr(c.a)], c.z ?? [1.0, 1.06], clamp);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `540px ${c.oy ?? 960}px`}}>
      <OffthreadVideo src={staticFile(`dc1010/${c.src}.mp4`)} startFrom={fr(c.from!)} muted />
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

// ---------- motion de marca (el único del video) ----------
const BrandBG: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(85% 60% at 50% 45%, #33415A 0%, #263142 45%, #232529 100%)'}}>
      <AbsoluteFill style={{opacity: 0.07, backgroundImage: 'repeating-linear-gradient(135deg, #D2B759 0px, #D2B759 2px, transparent 2px, transparent 46px)', backgroundPosition: `${f * 0.6}px 0px`}} />
      <AbsoluteFill style={{background: `radial-gradient(30% 18% at ${20 + Math.sin(f / 50) * 6}% 22%, rgba(210,183,89,0.16) 0%, rgba(210,183,89,0) 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(28% 16% at ${80 + Math.cos(f / 60) * 6}% 82%, rgba(210,183,89,0.12) 0%, rgba(210,183,89,0) 100%)`}} />
    </AbsoluteFill>
  );
};
// pop con overshoot desde el segundo `at` (tiempo absoluto); a = inicio del Sequence
const usePop = (a: number) => {
  const f = useCurrentFrame();
  return (at: number, dur = 9) => {
    const l = f - fr(at - a);
    return {
      o: interpolate(l, [0, 3], [0, 1], clamp),
      s: interpolate(l, [0, dur], [0.6, 1], {...clamp, easing: Easing.out(Easing.back(2.2))}),
      y: interpolate(l, [0, dur], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)}),
      on: l >= 0,
    };
  };
};
const T: React.FC<{w?: number; size: number; color?: string; gold?: boolean; track?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({w = 500, size, color = '#fff', gold, track = -0.04, style, children}) => (
  <span style={{fontFamily: 'OSO', fontWeight: w, fontSize: size, letterSpacing: `${track}em`, lineHeight: 0.95, color: gold ? 'transparent' : color, whiteSpace: 'pre',
    ...(gold ? {backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', paddingTop: '0.2em', marginTop: '-0.2em', paddingBottom: '0.1em', marginBottom: '-0.1em'} : {}), ...style}}>{children}</span>
);
const abs = (x: number, y: number, w: number, h: number, extra: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w, height: h, ...extra});
const center: React.CSSProperties = {display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'};
const Lupa: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={GOLD_BLOCK} strokeWidth={10} strokeLinecap="round"><circle cx="42" cy="42" r="28" /><path d="M63 63 L88 88" /></svg>
);
const Pin: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={GOLD_BLOCK}><path d="M50 6 C30 6 16 21 16 40 C16 64 50 94 50 94 C50 94 84 64 84 40 C84 21 70 6 50 6 Z M50 54 A14 14 0 1 1 50 26 A14 14 0 1 1 50 54 Z" /></svg>
);

// "en el portal del condado, o en el de la ciudad si la casa está dentro de Tampa. Ahí ves qué se hizo, cuándo y si el permiso quedó cerrado."
// Ventana de búsqueda (dirección de ejemplo) → condado de Hillsborough / ciudad de Tampa → ficha del permiso con QUÉ / CUÁNDO / ESTADO y sello CERRADO.
const ADDR = '1234 Ejemplo St, Tampa, FL';
const MotionPortal: React.FC<{a: number}> = ({a}) => {
  const pop = usePop(a);
  const f = useCurrentFrame();
  const t = f / FPS + a;
  const win = pop(a + 0.03, 12);
  const typed = Math.round(interpolate(t, [12.78, 13.7], [0, ADDR.length], clamp));
  const caret = Math.floor(f / 8) % 2 === 0 || (t > 12.78 && t < 13.7);
  const cond = pop(13.29), city = pop(14.55), dentro = pop(16.29);
  const sel = interpolate(t, [14.55, 14.85], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}); // el resaltado pasa del condado a la ciudad
  const swap = interpolate(t, [17.3, 17.6], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});  // "Ahí ves": las opciones salen, entra la ficha
  const ficha = pop(17.44, 12), r1 = pop(18.04), r2 = pop(19.0), r3 = pop(19.76);
  const stamp = interpolate(f - fr(20.72 - a), [0, 6], [2.2, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  const stampO = interpolate(f - fr(20.72 - a), [0, 2], [0, 1], clamp);
  const X = 180, Y = 400, WW = 720;
  const pill = (y: number, p: ReturnType<typeof pop>, label: string, sub: string, on: number) => (
    <div style={{...abs(40, y, WW - 80, 140), opacity: p.o * (1 - swap), transform: `translateY(${p.y - swap * 60}px) scale(${p.s})`, borderRadius: 22,
      background: on > 0.5 ? 'rgba(210,183,89,0.16)' : 'rgba(255,255,255,0.06)', border: `3px solid rgba(210,183,89,${0.25 + 0.75 * on})`, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', padding: '0 34px', gap: 26}}>
      <div style={{width: 30, height: 30, borderRadius: 15, border: `4px solid ${GOLD_BLOCK}`, background: on > 0.5 ? GOLD_BLOCK : 'transparent', flexShrink: 0}} />
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <T size={30} color={CREMA} track={0.1} w={800}>{sub}</T>
        <T size={60} w={800} style={{marginTop: 4}}>{label}</T>
      </div>
    </div>
  );
  const row = (y: number, p: ReturnType<typeof pop>, k: string, v: string) => (
    <div style={{...abs(40, y, WW - 80, 112), opacity: p.o, transform: `translateY(${p.y * 0.6}px)`, borderBottom: '2px solid rgba(255,243,201,0.18)', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <T size={30} color={GOLD_BLOCK} track={0.12} w={800}>{k}</T>
      <T size={44} w={800} style={{marginTop: 6}}>{v}</T>
    </div>
  );
  return (
    <AbsoluteFill>
      <BrandBG />
      <div style={{...abs(X, Y, WW, 640), opacity: win.o, transform: `translateY(${win.y}px) scale(${0.94 + 0.06 * win.s})`, borderRadius: 32, overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(51,65,90,0.95) 0%, rgba(38,49,66,0.97) 100%)', border: '3px solid rgba(210,183,89,0.75)', boxShadow: '0 30px 70px rgba(8,10,16,0.55)'}}>
        {/* barra de la ventana */}
        <div style={{...abs(0, 0, WW, 64), background: 'rgba(15,18,24,0.35)', display: 'flex', alignItems: 'center', padding: '0 26px', gap: 12}}>
          {[0, 1, 2].map((i) => <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: i === 0 ? GOLD_BLOCK : 'rgba(255,243,201,0.35)'}} />)}
          <T size={26} color={CREMA} track={0.16} w={800} style={{marginLeft: 18}}>PERMISOS · BÚSQUEDA</T>
        </div>
        {/* buscador */}
        <div style={{...abs(40, 88, WW - 80, 104), borderRadius: 52, background: '#FBF8F0', display: 'flex', alignItems: 'center', padding: '0 30px', gap: 20, boxSizing: 'border-box'}}>
          <Lupa size={46} />
          <T size={40} color={NAVY} w={800} track={-0.02}>{ADDR.slice(0, typed)}</T>
          <div style={{width: 4, height: 50, background: NAVY, opacity: caret && t < 17.3 ? 1 : 0, marginLeft: -14}} />
        </div>
        {/* opciones: condado / ciudad */}
        {pill(222, cond, 'Hillsborough', 'CONDADO', 1 - sel)}
        {pill(380, city, 'Tampa', 'CIUDAD', sel)}
        <div style={{...abs(40, 540, WW - 80, 80), ...center, flexDirection: 'row', gap: 14, opacity: dentro.o * (1 - swap), transform: `scale(${dentro.s})`}}>
          <Pin size={46} /><T size={42} color={CREMA}>si la casa está </T><T size={42} w={800}>dentro de Tampa</T>
        </div>
        {/* ficha del permiso */}
        <div style={{...abs(0, 212, WW, 420), opacity: ficha.o * swap, transform: `translateY(${(1 - swap) * 80}px)`}}>
          <div style={{...abs(40, 0, WW - 80, 70), display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <T size={60} w={900} gold>PERMISO</T>
            <div style={{padding: '8px 16px', borderRadius: 10, border: '2px solid rgba(255,243,201,0.5)'}}><T size={24} color={CREMA} track={0.14} w={800}>EJEMPLO</T></div>
          </div>
          {row(76, r1, 'QUÉ SE HIZO', 'Cambio de aire acondicionado')}
          {row(190, r2, 'CUÁNDO', 'Febrero 2023')}
          {row(304, r3, 'ESTADO', '')}
          {/* sello CERRADO */}
          <div style={{...abs(270, 312, 400, 104), ...center, opacity: stampO, transform: `rotate(-7deg) scale(${stamp})`, borderRadius: 18, border: `6px solid ${GOLD_BLOCK}`,
            background: 'rgba(210,183,89,0.14)', boxShadow: `0 0 ${40 * stampO}px rgba(210,183,89,0.45)`}}>
            <T size={70} w={900} gold track={0.02}>CERRADO ✓</T>
          </div>
        </div>
      </div>
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
          <Sequence key={i} from={fr(c.a)} durationInFrames={fr(c.b) - fr(c.a)}>
            {c.kind === 'motion' ? <MotionPortal a={c.a} /> : <Stock c={c} />}
          </Sequence>
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
type Part = {t: string; w: 500 | 800 | 900; size: number; gold?: boolean; box?: boolean};
type Line = {parts: Part[]; at: number};
type Pos = 'head' | 'top';
type Title = {a: number; b: number; pos: Pos; lines: Line[]; y?: number; dim?: boolean}; // y: tope fijo · dim: oscurecido suave detrás (fondos claros)
const P = (t: string, w: 500 | 800 | 900, size: number, gold = false): Part => ({t, w, size, gold});
const BX = (t: string, size: number): Part => ({t, w: 900, size, box: true});
const BOXPAD = 0.16; // relleno horizontal de la caja, en em
export const TITLES: Title[] = [
  {a: 0.06, b: 2.45, pos: 'head', lines: [            // closet del aire (oscuro): dorado
    {at: 0.06, parts: [P('Esta casa está', 500, 64)]},
    {at: 0.62, parts: [P('REMODELADA', 900, 132, true)]},
    {at: 1.33, parts: [P('y lo primero que reviso…', 500, 52)]}]},
  {a: 3.22, b: 4.47, pos: 'top', y: 1170, dim: true, lines: [ // primer plano del permiso: abajo del papel, sin tapar el dedo ni el encabezado BUILDING PERMIT
    {at: 3.22, parts: [P('son los', 500, 66)]},
    {at: 3.6, parts: [BX('PERMISOS', 128)]}]},
  {a: 10.43, b: 12.7, pos: 'head', dim: true, lines: [ // cocina blanca: caja navy
    {at: 10.43, parts: [P('en ', 500, 64), BX('HILLSBOROUGH', 96)]},
    {at: 11.23, parts: [P('se buscan ', 500, 60), P('GRATIS', 800, 78)]},
    {at: 11.87, parts: [P('por la dirección', 500, 54)]}]},
  {a: 27.27, b: 28.9, pos: 'head', dim: true, lines: [ // puerta con pared blanca: caja navy
    {at: 27.27, parts: [P('pide el', 500, 64)]},
    {at: 27.65, parts: [BX('AÑO', 140)]},
    {at: 27.93, parts: [P('de cada arreglo', 500, 60)]}]},
];
const partW = (p: Part) => measure(p.t, p.w, p.size, -0.06) + (p.box ? 2 * BOXPAD * p.size : 0);
// tramos donde el título ya dice lo que se escucha: sin subtítulo
const HIDE: [number, number][] = TITLES.map((t): [number, number] => [t.a, t.b]);
const MOTION_SUB_TOP = 1090; // subtítulos fijos debajo del gráfico en el motion (regla 4.3)

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
  const nextA = idx + 1 < SUBS.length ? fr(SUBS[idx + 1][0] - 0.04) : DC1010_FRAMES;
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
  if (c.kind === 'motion') top = MOTION_SUB_TOP;
  else if (c.kind !== 'david') top = (c.subY ?? 960) - h / 2;
  else {
    // con David en cuadro: pegado debajo del mentón y centrado en su cara (13-10); si no entra antes de y = 1440 (selfies con la cara
    // grande y abajo), va pegado ARRIBA de la cabeza
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
  // escala por línea: una línea larga (HILLSBOROUGH) no achica a las demás
  const widths = ti.lines.map((l) => l.parts.reduce((acc, p) => acc + partW(p), 0));
  const ks = widths.map((w) => Math.min(1, MAXW / w));
  const lh = ti.lines.map((l, i) => Math.max(...l.parts.map((p) => p.size * (p.box ? 1.3 : 0.88))) * ks[i]); // la caja navy no pisa las líneas vecinas
  const H = lh.reduce((x, y) => x + y, 0);
  let top: number;
  if (ti.y !== undefined) top = ti.y;
  else if (ti.pos === 'top') top = Math.max(330, 600 - H / 2);
  else {
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
const TitleLine: React.FC<{line: Line; k: number; top: number; h: number; local: number; width: number}> = ({line, k, top, h, local, width}) => {
  if (local < 0) return null;
  const grow = interpolate(local, [0, 5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const retract = interpolate(local, [5, 10], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const lift = interpolate(local, [0, 8], [14, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const x0 = 540 - width / 2 - 14, bw = width + 28;
  const content = (
    <div style={{position: 'absolute', left: 0, width: W, top: 0, height: h, display: 'flex', justifyContent: 'center', alignItems: 'center',
      transform: `translateY(${lift}px)`, filter: 'drop-shadow(0 5px 12px rgba(20,24,32,0.6))'}}>
      {line.parts.map((p, j) => p.box ? (
        <span key={j} style={{fontFamily: 'OSO', fontWeight: 900, fontSize: p.size * k, letterSpacing: '-0.06em', lineHeight: 1, whiteSpace: 'pre', color: '#fff',
          background: NAVY, borderRadius: 10, padding: `0.06em ${BOXPAD}em 0.1em`, boxShadow: '0 8px 22px rgba(10,12,18,0.45)'}}>{p.t}</span>
      ) : (
        <span key={j} style={{fontFamily: 'OSO', fontWeight: p.w, fontSize: p.size * k, letterSpacing: '-0.06em', lineHeight: 0.95,
          whiteSpace: 'pre', color: p.gold ? 'transparent' : '#fff', paddingRight: p.gold ? '0.08em' : 0,
          ...(p.gold ? {backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', paddingTop: '0.3em', marginTop: '-0.3em', paddingBottom: '0.15em', marginBottom: '-0.15em'} : {})}}>{p.t}</span>
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
// oscurece el plano mientras hay un título 'top' encima (papel claro)
const TitleDim: React.FC = () => {
  const frame = useCurrentFrame();
  let k = 0;
  for (const ti of TITLES) if (ti.pos === 'top' && ti.y === undefined) k = Math.max(k, interpolate(frame, [fr(ti.a), fr(ti.a) + 5, fr(ti.b) - 4, fr(ti.b)], [0, 1, 1, 0], clamp));
  return k > 0 ? <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(15,18,24,0.6) 0%, rgba(15,18,24,0.45) 45%, rgba(15,18,24,0.1) 80%)', opacity: k}} /> : null;
};
// oscurece apenas el plano bajo el subtítulo centrado (stock y tomas sin cara, fondos claros)
const SubDim: React.FC = () => {
  const frame = useCurrentFrame();
  const c = clipAt(frame / FPS);
  if (c.kind !== 'stock' && c.kind !== 'own') return null;
  const k = interpolate(frame, [fr(c.a), fr(c.a) + 4, fr(c.b) - 3, fr(c.b)], [0, 1, 1, 0], clamp);
  const y = c.subY ?? 960;
  return <AbsoluteFill style={{background: `radial-gradient(60% 9% at 50% ${(y / 1920) * 100}%, rgba(15,18,24,0.5) 0%, rgba(15,18,24,0) 100%)`, opacity: k}} />;
};

// ---------- logo (siempre arriba a la derecha, pisando todo) ----------
const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const c = clipAt(frame / FPS);
  return <Img src={staticFile(c.logo === 'b' ? 'dc1010/logo_blanco.png' : 'dc1010/logo_negro.png')} style={{position: 'absolute', left: 735, top: 75, width: 240}} />;
};

const Guides: React.FC = () => {
  const frame = useCurrentFrame();
  const st = davidState(frame / FPS);
  const hy = hairY(frame / FPS);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid rgba(0,255,0,.8)'}} />
      <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'rgba(0,255,255,.6)'}} />
      {st && hy !== null && <div style={{position: 'absolute', left: st.fc.ex - 300, width: 600, top: hy, height: st.y(st.fc.bot) - hy, background: 'rgba(255,0,0,.25)'}} />}
    </AbsoluteFill>
  );
};

export const DC1010: React.FC = () => {
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
      <SubDim />
      {ready && <Subtitles />}
      {ready && TITLES.map((ti, i) => <TitleView key={i} ti={ti} />)}
      <Logo />
      {PROPS.voz && <Audio src={staticFile('dc1010/voz.wav')} />}
      {PROPS.guides && <Guides />}
    </AbsoluteFill>
  );
};
