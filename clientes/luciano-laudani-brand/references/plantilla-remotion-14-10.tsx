import React from 'react';
// Plantilla de LUL 14-10 (aprobada 2026-10-29). Usa ./eyes.json (tracking de ojos de hook y CTA, track_cara.swift suavizado) y los clips en public/lul1410/.
import {
  AbsoluteFill, Easing, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import EYES from './eyes.json';

// LUL 14-10 "Lo que más me consultan" — acabado (el audio se mezcla aparte y se pega con ffmpeg)
export const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
export const LUL1410_FRAMES = f(25.75);

const ROJO = '#ED2738', INDIGO = '#2D2A78';
const MS = 'Montserrat', BG = 'begum';

// ---------- fuentes: Montserrat local + Begum desde el kit de Adobe Fonts del editor (config.json → fuentes.begum_kit) ----------
const FONTS: [string, string, string?][] = [
  ['Montserrat-Light.ttf', '300'], ['Montserrat-Regular.ttf', '400'], ['Montserrat-Medium.ttf', '500'],
  ['Montserrat-ExtraBold.ttf', '800'], ['Montserrat-ExtraBoldItalic.ttf', '800', 'italic'], ['Montserrat-Black.ttf', '900'],
];
const fontHandle = delayRender('fuentes');
const kit = document.createElement('link');
kit.rel = 'stylesheet'; kit.href = 'https://use.typekit.net/hhg4yzn.css';
document.head.appendChild(kit);
const kitListo = new Promise<void>((res) => { kit.onload = () => res(); kit.onerror = () => res(); });
Promise.all([
  ...FONTS.map(([file, weight, style]) =>
    new FontFace(MS, `url(${staticFile('fonts/' + file)})`, {weight, style: style ?? 'normal'}).load().then((ff) => document.fonts.add(ff))),
  kitListo.then(() => Promise.all([document.fonts.load(`400 80px ${BG}`), document.fonts.load(`700 80px ${BG}`)])),
]).then(() => continueRender(fontHandle));

// ---------- montaje (tiempos del video) ----------
type Eyes = {t0: number; ex: number[]; ey: number[]; chin: number[]};
// speaker: [archivo 4K, desde (video), hasta (video), inicio en la toma, ojos, zoom [t, s][]]
const HOOK = {src: 'hook4k', a: 0, b: 2.75, off: 1.10, eyes: EYES.hook as Eyes,
  zoom: [[0, 1.06], [0.88, 1.10], [0.89, 1.2], [2.75, 1.23]] as number[][]};
const CTA = {src: 'cta4k', a: 21.30, b: 25.75, off: 1.82 - 20.89, eyes: EYES.cta as Eyes,
  zoom: [[21.30, 1.3], [25.75, 1.6]] as number[][]};
// B-roll: [archivo, desde, hasta, inicio en el clip, zoom inicial→final]
type Clip = [string, number, number, number, number, number];
const BROLL: Clip[] = [
  ['casas1', 2.75, 6.47, 0, 1.0, 1.06],
  ['pareja', 6.47, 9.20, 0, 1.04, 1.12],
  ['llaves', 9.20, 11.23, 0.5, 1.12, 1.02],
  ['mayores', 11.23, 14.20, 1.0, 1.0, 1.08],
  ['cuentas', 14.20, 16.47, 2.0, 1.1, 1.02],
  ['dolares', 16.47, 18.85, 1.0, 1.0, 1.1],
  ['casas2', 18.85, 21.30, 0, 1.0, 1.05],
];
const CORTES = [2.75, 6.47, 9.20, 11.23, 14.20, 16.47, 18.85, 21.30];
const ZOOMBLUR = [2.75, 21.30]; // al salir/entrar del speaker; el resto, whip
const LEAKS = [2.75, 21.30];

const zoomAt = (Z: number[][], t: number) => {
  if (t <= Z[0][0]) return Z[0][1];
  for (let i = 0; i < Z.length - 1; i++) {
    const [a, sa] = Z[i], [b, sb] = Z[i + 1];
    if (t <= b) return sa + (sb - sa) * Easing.inOut(Easing.sin)((t - a) / Math.max(1e-6, b - a));
  }
  return Z[Z.length - 1][1];
};
const eyeAt = (E: Eyes, srcT: number) => {
  const i = Math.max(0, Math.min(E.ex.length - 1, Math.round((srcT - E.t0) * FPS)));
  return [E.ex[i], E.ey[i], E.chin[i]];
};

// ---------- transiciones: zoom-blur (anclado a los ojos) o whip horizontal ----------
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

const Speaker: React.FC<{s: typeof HOOK}> = ({s}) => {
  const frame = useCurrentFrame();
  const t = s.a + frame / FPS;
  const [ex, ey] = eyeAt(s.eyes, t + s.off);
  const z = zoomAt(s.zoom, t);
  return (
    <AbsoluteFill style={transStyle(t, ex, ey)}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${ex}px ${ey}px`}}>
        <OffthreadVideo src={staticFile(`lul1410/${s.src}.mp4`)} startFrom={Math.round((s.a + s.off) * FPS)} muted
          style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Broll: React.FC<{clip: Clip}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [name, a, b, srcIn, z0, z1] = clip;
  const t = a + frame / FPS;
  const s = interpolate(t, [a, b], [z0, z1]);
  return (
    <AbsoluteFill style={transStyle(t, 540, 960)}>
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        <OffthreadVideo src={staticFile(`lul1410/${name}.mp4`)} startFrom={Math.round(srcIn * FPS)} muted />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 26% at 50% 50%, rgba(10,10,30,0.42), rgba(0,0,0,0) 100%)'}} />
    </AbsoluteFill>
  );
};

// light leak cálido en los cambios de tema
const Leak: React.FC<{at: number}> = ({at}) => {
  const t = useCurrentFrame() / FPS;
  const o = interpolate(t, [at - 0.2, at, at + 0.45], [0, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  const x = interpolate(t, [at - 0.2, at + 0.45], [-100, 1180]);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', opacity: o,
      background: `radial-gradient(circle 760px at ${x}px 520px, rgba(255,120,90,0.95), rgba(237,39,56,0.45) 45%, rgba(237,39,56,0) 75%)`}} />
  );
};

// ---------- tipografía ----------
const SOMBRA = '0 2px 4px rgba(0,0,0,0.55), 0 3px 18px rgba(0,0,0,0.6), 0 0 34px rgba(0,0,0,0.35)';
const fina = (size: number, weight = 300): React.CSSProperties => ({fontFamily: MS, fontWeight: weight, fontSize: size, color: 'white',
  textShadow: SOMBRA, lineHeight: 1, letterSpacing: -size * 0.02});
const DEG_PAD: React.CSSProperties = {padding: '0.3em 0.08em 0.2em', margin: '-0.3em -0.08em -0.2em', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'};
// línea 1 del título-golpe: Begum Regular en degradé plateado
const plata = (size: number): React.CSSProperties => ({fontFamily: BG, fontWeight: 400, fontSize: size, lineHeight: 0.85, letterSpacing: -size * 0.02,
  backgroundImage: 'linear-gradient(180deg, #FFFFFF 15%, #D8D8D8 55%, #9A9A9A 100%)', ...DEG_PAD,
  filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.6)) drop-shadow(0 0 18px rgba(0,0,0,0.35))'});
// golpe: Montserrat Black en degradé rojo + glow
const rojo = (size: number): React.CSSProperties => ({fontFamily: MS, fontWeight: 900, fontSize: size, lineHeight: 0.85, letterSpacing: -size * 0.03, display: 'inline-block', marginTop: -size * 0.12,
  backgroundImage: 'linear-gradient(180deg, #F16275 0%, #ED2738 50%, #D61E28 100%)', ...DEG_PAD,
  filter: 'drop-shadow(0 0 14px rgba(237,39,56,0.75)) drop-shadow(0 0 34px rgba(237,39,56,0.45)) drop-shadow(0 4px 6px rgba(0,0,0,0.5))'});

const useIn = (at: number, out: number, kind: 'pop' | 'up' | 'slam') => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  const p = spring({frame: frame - f(at), fps, config: {damping: kind === 'up' ? 16 : 11, stiffness: kind === 'slam' ? 260 : 180, mass: 0.7}});
  const o = interpolate(t, [out - 0.15, out], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const vis = t >= at - 0.001 && t < out;
  const blur = Math.max(0, interpolate(p, [0, 1], [10, 0], {extrapolateRight: 'clamp'})) +
    interpolate(t, [out - 0.15, out], [0, 8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const transform = kind === 'up' ? `translateY(${interpolate(p, [0, 1], [30, 0])}px)`
    : `scale(${interpolate(p, [0, 1], [kind === 'slam' ? 1.6 : 0.5, 1])})`;
  return {opacity: vis ? Math.min(1, p * 1.6) * o : 0, transform, filter: blur > 0.05 ? `blur(${blur}px)` : undefined} as React.CSSProperties;
};
const Line: React.FC<{at: number; out: number; kind?: 'pop' | 'up' | 'slam'; style?: React.CSSProperties; children: React.ReactNode}> = ({at, out, kind = 'up', style, children}) => {
  const st = useIn(at, out, kind);
  return <div style={{...st, textAlign: 'center', whiteSpace: 'nowrap', ...style}}>{children}</div>;
};
const Bloque: React.FC<{top?: number; center?: number; gap?: number; children: React.ReactNode}> = ({top, center, gap = 0, children}) => (
  <div style={{position: 'absolute', left: 0, width: 1080, top: center ?? top, transform: center !== undefined ? 'translateY(-50%)' : undefined,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>{children}</div>
);
// "80" y, cuando dice "ciento cincuenta", pasa a "80-150" con un pop (el bloque final queda centrado en x = 540)
const Rango: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  const p = spring({frame: frame - f(4.78), fps, config: {damping: 10, stiffness: 240, mass: 0.6}});
  const k = t >= 4.78 ? interpolate(p, [0, 1], [1.12, 1]) : 1;
  return <span style={{...rojo(178), display: 'inline-block', transform: `scale(${k})`}}>{t >= 4.78 ? <>80<span style={{fontWeight: 300, WebkitTextFillColor: 'white', color: 'white'}}> y </span>150</> : '80'}</span>;
};
const Pin: React.FC<{size: number}> = ({size}) => (
  <svg width={size * 0.72} height={size} viewBox="0 0 24 34" style={{marginRight: 12, filter: 'drop-shadow(0 0 10px rgba(237,39,56,0.7))'}}>
    <path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 34 12 34s12-13.2 12-22.1C24 5.3 18.6 0 12 0z" fill={ROJO} />
    <circle cx="12" cy="11.8" r="4.6" fill="white" />
  </svg>
);

const HOOK_TOP = 1186; // mentón con el punch 1,2× (1158) + aire

const Titulos: React.FC = () => (
  <>
    {/* HOOK: debajo del mentón */}
    <Bloque top={HOOK_TOP}>
      <Line at={0.89} out={2.75}><span style={plata(66)}>lo que más</span></Line>
      <Line at={1.41} out={2.75} kind="slam"><span style={rojo(104)}>ME CONSULTAN</span></Line>
      <Line at={2.19} out={2.75} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 14}}>
        <Pin size={50} /><span style={fina(52, 800)}>en Adrogué</span>
      </Line>
    </Bloque>
    {/* CASAS ENTRE 80 Y 150 MIL sobre las casas */}
    <Bloque center={960}>
      <Line at={2.79} out={6.58}><span style={plata(84)}>casas entre</span></Line>
      <Line at={3.84} out={6.58} kind="slam">
        <Rango />
      </Line>
      <Line at={5.72} out={6.58} style={{marginTop: 6}}><span style={fina(58, 500)}>mil <b style={{fontWeight: 800}}>dólares</b></span></Line>
    </Bloque>
    {/* SU PRIMERA VIVIENDA sobre las llaves */}
    <Bloque center={960}>
      <Line at={10.08} out={11.5}><span style={plata(84)}>su primera</span></Line>
      <Line at={10.6} out={11.5} kind="slam"><span style={rojo(128)}>VIVIENDA</span></Line>
    </Bloque>
    {/* CON PLATA PROPIA sobre las cuentas */}
    <Bloque center={960}>
      <Line at={15.48} out={16.55}><span style={plata(88)}>con plata</span></Line>
      <Line at={15.98} out={16.55} kind="slam"><span style={rojo(140)}>PROPIA</span></Line>
    </Bloque>
    {/* LO QUE MÁS ME PIDEN: CASAS */}
    <Bloque center={960}>
      <Line at={18.96} out={21.3}><span style={plata(78)}>lo que más me piden</span></Line>
      <Line at={20.40} out={21.3} kind="slam"><span style={rojo(220)}>CASAS</span></Line>
    </Bloque>
    {/* CTA: debajo del mentón */}
    <Bloque top={1150}>
      <Line at={24.95} out={25.8} kind="slam"><span style={rojo(132)}>ESCRIBINOS</span></Line>
    </Bloque>
  </>
);

// ---------- subtítulos: 1–4 palabras, Light/Regular + palabra clave (caja roja / índigo con borde / ExtraBold) ----------
type K = 'caja' | 'indigo' | 'bold' | undefined;
type Sub = [number, number, number, string, string?, K?]; // inicio, fin, y (centro), antes, clave, recurso
const SUBS: Sub[] = [
  [0.0, 0.62, 1146, 'Te cuento'],
  [0.65, 0.89, 1146, 'qué es'],
  // cuerpo (B-roll): centrado, o bajo el mentón si hay caras al centro
  [6.58, 7.33, 1180, 'por un lado'],
  [7.33, 8.38, 1180, 'parejas', 'JÓVENES', 'caja'],
  [8.38, 9.24, 1180, 'que con', 'CRÉDITO', 'indigo'],
  [9.26, 10.06, 960, 'pueden', 'comprar', 'bold'],
  [11.5, 12.17, 1250, 'por otro'],
  [12.19, 13.16, 1250, 'gente', 'MÁS GRANDE', 'indigo'],
  [13.18, 14.26, 1250, 'que', 'vende', 'caja', ],
  [14.28, 15.46, 960, 'y sale a buscar', 'otra', 'bold'],
  [16.55, 17.42, 960, 'esos', 'valores', 'bold'],
  [17.44, 18.13, 960, 'son los que más'],
  [18.13, 18.94, 960, 'se', 'MUEVEN', 'caja'],
  // CTA: bajo el mentón
  [21.3, 21.86, 1132, 'si tenés una', 'casa', 'bold'],
  [21.86, 23.09, 1132, 'dentro de esos', 'valores', 'caja'],
  [23.09, 23.86, 1132, 'en', 'ADROGUÉ', 'indigo'],
  [23.86, 24.93, 1132, 'o', 'alrededores', 'bold'],
];
const Clave: React.FC<{k: K; children: string}> = ({k, children}) => {
  if (k === 'caja') return (
    <span style={{fontFamily: MS, fontWeight: 800, color: 'white', background: 'rgba(237,39,56,0.86)', padding: '2px 14px 6px',
      borderRadius: 4, boxDecorationBreak: 'clone', marginLeft: 4}}>{children}</span>);
  if (k === 'indigo') return (
    <span style={{fontFamily: MS, fontWeight: 900, color: INDIGO, WebkitTextStroke: '9px white', paintOrder: 'stroke fill',
      filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.45))'}}>{children}</span>);
  return <span style={{fontWeight: 800, textShadow: SOMBRA}}>{children}</span>;
};
const Subs: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  const b = SUBS.find((s) => t >= s[0] && t < s[1]);
  if (!b) return null;
  const [a, , y, txt, clave, k] = b;
  const p = spring({frame: frame - f(a), fps, config: {damping: 13, stiffness: 220, mass: 0.6}});
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: y, transform: `translateY(-50%) scale(${interpolate(p, [0, 1], [0.82, 1])})`,
      textAlign: 'center', whiteSpace: 'nowrap', opacity: Math.min(1, p * 2), fontFamily: MS, fontSize: 58, fontWeight: 300, color: 'white',
      letterSpacing: -1.2, lineHeight: 1, textShadow: SOMBRA}}>
      {txt}{clave ? ' ' : ''}{clave && <Clave k={k}>{clave}</Clave>}
    </div>
  );
};

export const LUL1410: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    <WhipFilters />
    <Sequence from={f(HOOK.a)} durationInFrames={f(HOOK.b) - f(HOOK.a)}><Speaker s={HOOK} /></Sequence>
    {BROLL.map((c, i) => (
      <Sequence key={i} from={f(c[1])} durationInFrames={f(c[2]) - f(c[1])}><Broll clip={c} /></Sequence>
    ))}
    <Sequence from={f(CTA.a)} durationInFrames={f(CTA.b) - f(CTA.a)}><Speaker s={CTA} /></Sequence>
    {LEAKS.map((l) => <Leak key={l} at={l} />)}
    <Titulos />
    <Subs />
    {guias && (
      <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid lime', boxSizing: 'border-box'}} />
    )}
  </AbsoluteFill>
);
