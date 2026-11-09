import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import data from './data.json';
import MAPAJ from './mapa.json';

// REB 08-10 "Por qué construimos en estos barrios" — acabado (el audio se mezcla aparte y se pega con ffmpeg)
export const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
export const REB0810_FRAMES = data.frames;
const DUR = data.frames / FPS;

const VERDE = '#5D8776', MOSTAZA = '#CDBC31', CREMA = '#F2EBC7', VERDE_OSC = '58,82,72';
const MS = 'Montserrat';

const FONTS: [string, string, string?][] = [
  ['Montserrat-Light.ttf', '300'], ['Montserrat-Medium.ttf', '500'], ['Montserrat-SemiBold.ttf', '600'],
  ['Montserrat-Bold.ttf', '700'], ['Montserrat-Black.ttf', '900'], ['Montserrat-BlackItalic.ttf', '900', 'italic'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([file, weight, style]) =>
  new FontFace(MS, `url(${staticFile('fonts/' + file)})`, {weight, style: style ?? 'normal'}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

type Spk = {src: string; v0: number; v1: number; cam0: number; z: number[][]; e: number[]; E: number[]};
const SPK = data.spk as Spk[];
const P = data.pisos;
const WORDS = data.words as [string, number, number][];
const wAt = (w: string, desde = 0) => WORDS.find((x) => x[0].replace(/[,.?¿]/g, '') === w && x[1] >= desde - 0.05)![1];

// B-roll: [archivo, entrada, salida]
const BROLL: [string, number, number][] = [
  ['drParque', 0.567, 2.6], ['drArbolado', 15.867, 17.4], ['drAvenida', 17.4, 18.733], ['llaves', 18.733, 21.067],
  ['puerta', 21.067, 23.333], ['drRio', 28.333, 30.467], ['banderas', 32.033, 34.1],
];
const MAPA: [number, number] = [7.467, 12.0];

const encuadre = (sp: Spk, t: number) => {
  const [[a, sa], [b, sb]] = sp.z;
  const u = Math.min(1, Math.max(0, (t - a) / (b - a)));
  const s = sa + (sb - sa) * (0.5 - 0.5 * Math.cos(Math.PI * u));
  const ox = Math.min(Math.max(sp.e[0] - sp.E[0] / s, 0), 1080 - 1080 / s);
  const oy = Math.min(Math.max(sp.e[1] - sp.E[1] / s, 0), 1920 - 1920 / s);
  return {s, ox, oy};
};
const ojos = (i: number) => SPK[i].E as [number, number];

// ---------- transiciones: whip en B-roll y mapa, zoom-blur anclado a los ojos en la vocera ----------
const CORTES: [number, 'zoom' | 'whip', number, number][] = [
  [0.567, 'whip', 540, 960], [2.6, 'whip', 540, 960], [5.22, 'zoom', ...ojos(2)], [7.467, 'whip', 540, 960], [12.0, 'whip', 540, 960],
  [15.867, 'whip', 540, 960], [17.4, 'whip', 540, 960], [18.733, 'whip', 540, 960], [21.067, 'whip', 540, 960],
  [23.333, 'zoom', ...ojos(4)], [25.567, 'zoom', ...ojos(5)], [28.333, 'whip', 540, 960], [30.467, 'zoom', ...ojos(6)],
  [32.033, 'whip', 540, 960], [34.1, 'zoom', ...ojos(7)],
];
const RADIO = 3.5;
const trans = (t: number) => {
  let e = 0, c: (typeof CORTES)[number] = CORTES[0];
  for (const k of CORTES) {
    const v = 1 - Math.abs(t - k[0]) * FPS / RADIO;
    if (v > e) { e = v; c = k; }
  }
  return {e: Math.max(0, e), side: t < c[0] ? -1 : 1, c};
};
const transStyle = (t: number): React.CSSProperties => {
  const {e, side, c} = trans(t);
  if (e <= 0) return {};
  if (c[1] === 'whip') return {transform: `translateX(${-side * 150 * e}px) scale(${1 + 0.32 * e})`, filter: `url(#whip${Math.round(e * 10)})`};
  return {transform: `scale(${1 + 0.22 * e})`, transformOrigin: `${c[2]}px ${c[3]}px`, filter: `blur(${12 * e}px)`};
};
const WhipFilters: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    {Array.from({length: 11}, (_, i) => (
      <filter key={i} id={`whip${i}`} x="-10%" y="0" width="120%" height="100%">
        <feGaussianBlur stdDeviation={`${i * 4} 0`} edgeMode="duplicate" />
      </filter>
    ))}
  </svg>
);

const Speaker: React.FC<{sp: Spk}> = ({sp}) => {
  const frame = useCurrentFrame();
  const t = sp.v0 + frame / FPS;
  const {s, ox, oy} = encuadre(sp, t);
  return (
    <AbsoluteFill style={transStyle(t)}>
      <AbsoluteFill style={{transform: `scale(${s}) translate(${-ox}px, ${-oy}px)`, transformOrigin: '0 0'}}>
        <OffthreadVideo src={staticFile(`reb0810/${sp.src}.mp4`)} startFrom={f(sp.cam0)} muted />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Broll: React.FC<{clip: [string, number, number]}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [name, a, b] = clip;
  const t = a + frame / FPS;
  const s = interpolate(t, [a, b], [1.0, 1.07]);
  return (
    <AbsoluteFill style={transStyle(t)}>
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        <OffthreadVideo src={staticFile(`reb0810/${name}.mp4`)} muted />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 30% at 50% 50%, rgba(0,0,0,0.38), rgba(0,0,0,0) 100%)'}} />
    </AbsoluteFill>
  );
};

// destello cálido (light leak) en las cifras
const Destello: React.FC<{at: number; y: number}> = ({at, y}) => {
  const t = useCurrentFrame() / FPS;
  const o = interpolate(t, [at - 0.1, at + 0.08, at + 0.6], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  const x = interpolate(t, [at - 0.1, at + 0.6], [1150, 650]);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', opacity: o,
      background: `radial-gradient(circle 700px at ${x}px ${y}px, rgba(255,190,110,0.95), rgba(255,140,60,0.45) 45%, rgba(255,120,40,0) 75%)`}} />
  );
};

// ---------- tipografía ----------
const SOMBRA = '0 0 3px rgba(0,0,0,0.75), 0 2px 6px rgba(0,0,0,0.7), 0 3px 20px rgba(0,0,0,0.65), 0 0 40px rgba(0,0,0,0.45)';
const halo = (w: number, h: number, a = 0.42): React.CSSProperties => ({position: 'absolute', left: 540 - w / 2, width: w, height: h,
  background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,0,0,${a}), rgba(0,0,0,0) 100%)`});
const fina = (size: number, weight = 300): React.CSSProperties => ({fontFamily: MS, fontWeight: weight, fontSize: size, color: 'white',
  textShadow: SOMBRA, lineHeight: 1, letterSpacing: -0.5});
const B: React.FC<{children: React.ReactNode; c?: string}> = ({children, c}) => <b style={{fontWeight: 700, color: c}}>{children}</b>;
const degrade = (size: number): React.CSSProperties => ({fontFamily: MS, fontWeight: 900, fontSize: size, lineHeight: 0.92,
  letterSpacing: -size * 0.05, backgroundImage: `linear-gradient(90deg, ${MOSTAZA} 0%, ${CREMA} 92%)`,
  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
  padding: '0.3em 0.06em 0.1em', margin: '-0.3em -0.06em -0.1em',
  filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.55)) drop-shadow(0 0 20px rgba(0,0,0,0.35))'});
const verde = (size: number, stroke = 18): React.CSSProperties => ({fontFamily: MS, fontWeight: 900, fontSize: size, color: VERDE, lineHeight: 0.92,
  letterSpacing: -size * 0.05, WebkitTextStroke: `${stroke}px white`, paintOrder: 'stroke fill',
  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'});
const Num: React.FC<{n: number; size: number; style?: React.CSSProperties}> = ({n, size, style}) => (
  <div style={{width: size, height: size, borderRadius: size, background: VERDE, border: `${Math.round(size * 0.08)}px solid white`, boxSizing: 'border-box',
    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.35)', flexShrink: 0,
    fontFamily: MS, fontWeight: 700, fontSize: size * 0.54, color: 'white', lineHeight: 1, ...style}}>{n}</div>
);

const useIn = (at: number, out: number, kind: 'pop' | 'up' | 'slam') => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  const p = spring({frame: frame - f(at), fps, config: {damping: kind === 'up' ? 16 : 11, stiffness: kind === 'slam' ? 260 : 180, mass: 0.7}});
  const o = interpolate(t, [out - 0.17, out], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const vis = t >= at - 0.001 && t < out;
  const blur = Math.max(0, interpolate(p, [0, 1], [10, 0], {extrapolateRight: 'clamp'})) +
    interpolate(t, [out - 0.17, out], [0, 8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const transform = kind === 'pop' ? `scale(${interpolate(p, [0, 1], [0.5, 1])})`
    : kind === 'slam' ? `scale(${interpolate(p, [0, 1], [1.7, 1])}) rotate(${interpolate(p, [0, 1], [-10, -4])}deg)`
    : `translateY(${interpolate(p, [0, 1], [30, 0])}px)`;
  return {opacity: vis ? Math.min(1, p * 1.6) * o : 0, transform, filter: blur > 0.05 ? `blur(${blur}px)` : undefined} as React.CSSProperties;
};
const Line: React.FC<{at: number; out: number; kind?: 'pop' | 'up' | 'slam'; children: React.ReactNode}> = ({at, out, kind = 'up', children}) => {
  const st = useIn(at, out, kind);
  return <div style={{...st, textAlign: 'center', whiteSpace: 'nowrap'}}>{children}</div>;
};
const Bloque: React.FC<{top?: number; center?: number; bottom?: number; gap?: number; children: React.ReactNode}> = ({top, center, bottom, gap = 6, children}) => (
  <div style={{position: 'absolute', left: 0, width: 1080, top: bottom === undefined ? center ?? top : undefined,
    bottom: bottom !== undefined ? 1920 - bottom : undefined, transform: center !== undefined ? 'translateY(-50%)' : undefined,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>{children}</div>
);
const HaloEn: React.FC<{at: number; out: number; top: number; h: number; w?: number}> = ({at, out, top, h, w = 900}) => {
  const t = useCurrentFrame() / FPS;
  const o = interpolate(t, [at - 0.05, at + 0.15, out - 0.17, out], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{...halo(w, h, 0.5), top, opacity: o}} />;
};

// ---------- MOTION 1: mapa real de Montevideo con los 5 barrios ----------
// límites oficiales de barrios del INE (2011) proyectados en PROYECTO/mapa_barrios.py; "Cordón Sur" = Cordón al sur de Av. 18 de Julio (OSM)
type Clave = {d: string; c: number[]; bb: number[]};
const MJ = MAPAJ as unknown as {contexto: {n: string; d: string}[]; clave: Record<string, Clave>; av18: string; sur: string; norte: string};
// barrio que se enciende: [nombre en pantalla, palabra que lo dispara, polígono, recorte, posición de la etiqueta]
const BARRIOS: [string, string, string, 'norte' | 'sur' | null, number, number][] = [
  ['Cordón', 'Cordón', 'Cordón', 'norte', 300, 968],
  ['Cordón Sur', 'Sur', 'Cordón', 'sur', 232, 1066],
  ['Buceo', 'Buceo', 'Buceo', null, 752, 960],
  ['La Blanqueada', 'Blanqueada', 'La Blanqueada', null, 524, 740],
  ['Parque Rodó', 'Parque', 'Parque Rodó', null, 380, 1295],
];
const Mapa: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = MAPA[0] + frame / FPS;
  const cam = interpolate(t, [MAPA[0], MAPA[1]], [1.0, 1.04]);
  const entra = interpolate(t, [MAPA[0], MAPA[0] + 0.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const activos = BARRIOS.map((b) => wAt(b[1], MAPA[0]));
  return (
    <AbsoluteFill style={{...transStyle(t), background: 'linear-gradient(180deg, #1f2e29 0%, #172520 100%)'}}>
      <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: '530px 1010px'}}>
        <svg width={1080} height={1920}>
          <defs>
            <clipPath id="cNorte"><path d={MJ.norte} /></clipPath>
            <clipPath id="cSur"><path d={MJ.sur} /></clipPath>
            <clipPath id="cCordon"><path d={MJ.clave['Cordón'].d} /></clipPath>
          </defs>
          {/* tierra: todos los barrios (fuera de ellos, el río) */}
          <g opacity={entra}>
            {MJ.contexto.map((b) => (
              <path key={b.n} d={b.d} fill={`rgb(${VERDE_OSC})`} stroke="rgba(242,235,199,0.22)" strokeWidth={1.6} strokeLinejoin="round" />
            ))}
          </g>
          <text x={250} y={1420} textAnchor="middle" fontFamily={MS} fontWeight={300} fontStyle="italic" fontSize={32} fill="rgba(242,235,199,0.5)" letterSpacing={6} opacity={entra}>RÍO DE LA PLATA</text>
          {BARRIOS.map(([n, , pol, clip], i) => {
            if (t < activos[i] - 0.02) return null;
            const p = spring({frame: frame - f(activos[i] - MAPA[0]), fps, config: {damping: 12, stiffness: 190, mass: 0.6}});
            const brillo = interpolate(frame - f(activos[i] - MAPA[0]), [0, 4, 16], [0, 1, 0.55], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            const cp = clip === 'norte' ? 'url(#cNorte)' : clip === 'sur' ? 'url(#cSur)' : undefined;
            return (
              <g key={n} clipPath={cp} opacity={Math.min(1, p * 1.4)}>
                <path d={MJ.clave[pol].d} fill={VERDE} stroke="white" strokeWidth={5} strokeLinejoin="round" />
                <path d={MJ.clave[pol].d} fill={MOSTAZA} opacity={brillo * 0.6} />
              </g>
            );
          })}
          {/* Av. 18 de Julio: aparece con Cordón Sur (es el límite entre los dos) */}
          {t >= activos[1] - 0.02 && (
            <path d={MJ.av18} clipPath="url(#cCordon)" fill="none" stroke={CREMA} strokeWidth={4} strokeDasharray="10 8" opacity={0.9} />
          )}
        </svg>
      </AbsoluteFill>
      {/* etiquetas fuera de la cámara del mapa (no crecen) pero siguiendo su escala */}
      {BARRIOS.map(([n, , , , x, y], i) => {
        if (t < activos[i] - 0.02) return null;
        const p = spring({frame: frame - f(activos[i] - MAPA[0]), fps, config: {damping: 11, stiffness: 200, mass: 0.6}});
        const X = 530 + (x - 530) * cam, Y = 1010 + (y - 1010) * cam;
        return (
          <div key={n} style={{position: 'absolute', left: X, top: Y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
            opacity: Math.min(1, p * 1.5), fontFamily: MS, fontWeight: 700, fontSize: 42, color: 'white', whiteSpace: 'nowrap', letterSpacing: -0.5,
            textShadow: '0 0 3px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.85), 0 0 22px rgba(0,0,0,0.6)'}}>{n}</div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- MOTION 2: panel de las 3 cosas (sobre los drones y las llaves) ----------
const PANEL: [number, number] = [15.867, 21.067];
const ITEMS: [number, string, string][] = [[1, 'Zona ', 'consolidada'], [2, 'Buena ', 'conectividad'], [3, 'Demanda de ', 'alquiler']];
const Panel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t < PANEL[0] - 0.02 || t >= PANEL[1]) return null;
  const ent = [wAt('Una', 15), wAt('buena', 15), wAt('demanda', 15)];
  const primera = wAt('primera', 19);
  const p0 = spring({frame: frame - f(PANEL[0]), fps, config: {damping: 14, stiffness: 170, mass: 0.7}});
  const out = interpolate(t, [PANEL[1] - 0.17, PANEL[1]], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 180, width: 720, top: 960, transform: `translateY(-50%) scale(${interpolate(p0, [0, 1], [0.85, 1])})`,
      opacity: Math.min(1, p0 * 1.5) * out, background: 'rgba(30,45,40,0.84)', borderRadius: 34, padding: '40px 40px 44px',
      boxSizing: 'border-box', border: '2px solid rgba(242,235,199,0.35)', boxShadow: '0 20px 60px rgba(0,0,0,0.45)'}}>
      <div style={{...fina(42), textShadow: 'none', color: CREMA, marginBottom: 26, letterSpacing: 1}}>LO QUE <B>BUSCAMOS</B></div>
      {ITEMS.map(([n, a, b], i) => {
        const q = spring({frame: frame - f(ent[i] - 0.04), fps, config: {damping: 12, stiffness: 190, mass: 0.6}});
        const foco = t >= primera - 0.04 ? (i === 0 ? 1 : 0.38) : 1;
        const res = t >= primera - 0.04 && i === 0;
        return (
          <div key={n} style={{display: 'flex', alignItems: 'center', gap: 22, height: 92, opacity: Math.min(1, q * 1.5) * foco,
            transform: `translateX(${interpolate(q, [0, 1], [-60, 0])}px)`}}>
            <Num n={n} size={68} style={res ? {background: MOSTAZA} : undefined} />
            <span style={{fontFamily: MS, fontWeight: 600, fontSize: 50, color: 'white', letterSpacing: -0.5, whiteSpace: 'nowrap'}}>
              {a}<B c={res ? MOSTAZA : CREMA}>{b}</B>
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ---------- MOTION 3: sello de vivienda promovida (sobre las banderas) ----------
const Sello: React.FC<{at: number; out: number}> = ({at, out}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const st = useIn(at, out, 'slam');
  const rot = (t - at) * 18;
  const D = 470;
  const anillo = 'VIVIENDA PROMOVIDA · VIVIENDA PROMOVIDA · ';
  return (
    <div style={{position: 'absolute', left: 540 - D / 2, top: 1010 - D / 2, width: D, height: D, ...st}}>
      <svg width={D} height={D} style={{position: 'absolute', filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.5))'}}>
        <circle cx={D / 2} cy={D / 2} r={D / 2 - 6} fill={`rgb(${VERDE_OSC})`} stroke="white" strokeWidth={8} />
        <circle cx={D / 2} cy={D / 2} r={D / 2 - 68} fill={VERDE} stroke={CREMA} strokeWidth={3} strokeDasharray="10 9" />
        <defs><path id="aro" d={`M ${D / 2},${D / 2} m -${D / 2 - 38},0 a ${D / 2 - 38},${D / 2 - 38} 0 1,1 ${2 * (D / 2 - 38)},0 a ${D / 2 - 38},${D / 2 - 38} 0 1,1 -${2 * (D / 2 - 38)},0`} /></defs>
        <g transform={`rotate(${rot} ${D / 2} ${D / 2})`}>
          <text fontFamily={MS} fontWeight={700} fontSize={25} fill={CREMA} letterSpacing={5.2}><textPath href="#aro">{anillo}</textPath></text>
        </g>
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2}}>
        <svg width={64} height={56} viewBox="0 0 64 56" style={{marginBottom: 8}}>
          <path d="M6 28 L32 6 L58 28 M14 22 V50 H50 V22" fill="none" stroke="white" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
          <path d="M24 34 l6 7 l12 -13" fill="none" stroke={MOSTAZA} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{fontFamily: MS, fontWeight: 300, fontSize: 42, color: 'white', lineHeight: 1}}>vivienda</span>
        <span style={{fontFamily: MS, fontWeight: 900, fontSize: 47, color: 'white', lineHeight: 1, letterSpacing: -1.5}}>PROMOVIDA</span>
      </div>
    </div>
  );
};

// velo verde oscuro desde arriba (pared blanca: sin velo el texto blanco no se lee), como en 11-10
const Velo: React.FC<{at: number; out: number; y: number}> = ({at, out, y}) => {
  const t = useCurrentFrame() / FPS;
  const o = interpolate(t, [at - 0.1, at + 0.12, out - 0.15, out], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  return <AbsoluteFill style={{opacity: o, background: `linear-gradient(180deg, rgba(${VERDE_OSC},0.86) 0px, rgba(${VERDE_OSC},0.78) ${y - 120}px, rgba(${VERDE_OSC},0.3) ${y + 20}px, rgba(${VERDE_OSC},0) ${y + 150}px)`}} />;
};

// ---------- títulos ----------
const AIRE = 25;
const Titulos: React.FC = () => {
  const cinco = wAt('cinco'), barrios = wAt('barrios'), porque = wAt('porque', 5), desa2 = wAt('desarrollamos', 5.5), mismos = wAt('mismos');
  const nos = wAt('nos', 13), tres = wAt('tres'), vivir = wAt('vivir'), quien = wAt('quien', 20.5), Y = wAt('Y', 25), quien2 = wAt('quien', 26.5);
  const invertir = wAt('invertir'), dentro = wAt('dentro'), regimen = wAt('régimen'), esc = wAt('Escribinos'), cont = wAt('contamos'), hoy = wAt('hoy');
  return (
    <>
      {/* HOOK: arriba de la cabeza */}
      <Velo at={2.6} out={7.5} y={Math.max(P.hook, P.porque) - AIRE} />
      <Velo at={Y - 0.04} out={28.62} y={P.ultima - AIRE} />
      <Velo at={esc - 0.04} out={DUR + 1} y={P.cta - AIRE} />
      <HaloEn at={dentro - 0.04} out={34.1} top={1010 - 235 - 130} h={150} w={820} />
      <Bloque bottom={P.hook - AIRE}>
        <Line at={2.6} out={5.3}><span style={fina(54)}>se repiten siempre</span></Line>
        <Line at={cinco - 0.03} out={5.3} kind="pop"><span style={degrade(230)}>5</span></Line>
        <Line at={barrios - 0.03} out={5.3}><span style={fina(64, 700)}>barrios</span></Line>
      </Bloque>
      <Bloque bottom={P.porque - AIRE}>
        <Line at={porque - 0.04} out={7.7}><span style={fina(54)}>¿por qué siempre</span></Line>
        <Line at={desa2 - 0.04} out={7.7}><span style={fina(54)}>desarrollamos en</span></Line>
        <Line at={mismos - 0.12} out={7.7} kind="pop"><span style={verde(92)}>LOS MISMOS?</span></Line>
      </Bloque>
      {/* 3 COSAS debajo del mentón (en la pizarra la cabeza queda alta) */}
      <HaloEn at={nos} out={15.867} top={P.cosas + 10} h={260} w={820} />
      <Bloque top={P.cosas + AIRE}>
        <Line at={nos - 0.04} out={15.867}><span style={fina(52)}>nos enfocamos en</span></Line>
        <Line at={tres - 0.03} out={15.867} kind="pop"><span style={degrade(150)}>3 cosas</span></Line>
      </Bloque>
      {/* VIVIR sobre la puerta */}
      <Bloque center={960}>
        <Line at={Math.max(21.067, quien - 0.04)} out={22.78}><span style={fina(52)}>a quien va a ir a</span></Line>
        <Line at={vivir - 0.03} out={22.78} kind="pop"><span style={verde(150)}>VIVIR</span></Line>
      </Bloque>
      {/* INVERTIR arriba de la cabeza (punch) y sigue sobre el drone */}
      <Bloque bottom={P.ultima - AIRE}>
        <Line at={Y - 0.04} out={28.62}><span style={fina(52)}>y <B>la última</B></span></Line>
        <Line at={quien2 - 0.04} out={28.62}><span style={fina(52)}>a quien va a</span></Line>
        <Line at={invertir - 0.03} out={28.62} kind="pop"><span style={degrade(116)}>INVERTIR</span></Line>
      </Bloque>
      {/* vivienda promovida: sello sobre las banderas */}
      <Bloque bottom={1010 - 235 - 30}>
        <Line at={dentro - 0.04} out={34.1}><span style={fina(48, 500)}>dentro del <B>régimen</B> de</span></Line>
      </Bloque>
      <Sello at={regimen + 0.15} out={34.1} />
      {/* CTA arriba de la cabeza, con halo (pared blanca) */}
      <Bloque bottom={P.cta - AIRE}>
        <Line at={esc - 0.04} out={DUR + 1} kind="pop"><span style={verde(98)}>ESCRIBINOS</span></Line>
        <Line at={cont - 0.2} out={DUR + 1}><span style={fina(46)}>y te contamos qué tenemos</span></Line>
        <Line at={hoy - 0.04} out={DUR + 1}><span style={fina(46)}>hoy en cada <B>barrio</B></span></Line>
      </Bloque>
    </>
  );
};

// ---------- subtítulos karaoke ----------
type Sub = {start: number; end: number; y: number; words: [string, number, number][]};
const Subs: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const b = (data.subs as unknown as Sub[]).find((s) => t >= s.start && t < s.end);
  if (!b) return null;
  const op = interpolate(frame - f(b.start), [0, 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const act = b.words.reduce((k, w, i) => (t >= w[1] - 0.04 ? i : k), 0);
  return (
    <>
      <div style={{...halo(760, 170), top: b.y - 55, opacity: op}} />
      <div style={{position: 'absolute', left: 0, width: 1080, top: b.y, textAlign: 'center', whiteSpace: 'nowrap', opacity: op}}>
        {b.words.map(([w], i) => (
          <span key={i} style={{fontFamily: MS, fontWeight: 600, fontSize: 58, color: i === act ? VERDE : 'white', letterSpacing: -0.5,
            ...(i === act ? {WebkitTextStroke: '9px white', paintOrder: 'stroke fill', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.45))'} : {textShadow: SOMBRA})}}>
            {(i ? ' ' : '') + w}
          </span>
        ))}
      </div>
    </>
  );
};

export const REB0810: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    <WhipFilters />
    {SPK.map((s, i) => (
      <Sequence key={i} from={f(s.v0)} durationInFrames={f(s.v1) - f(s.v0)}><Speaker sp={s} /></Sequence>
    ))}
    {BROLL.map((c, i) => (
      <Sequence key={i} from={f(c[1])} durationInFrames={f(c[2]) - f(c[1])}><Broll clip={c} /></Sequence>
    ))}
    <Sequence from={f(MAPA[0])} durationInFrames={f(MAPA[1]) - f(MAPA[0])}><Mapa /></Sequence>
    <Destello at={wAt('cinco') - 0.03} y={520} />
    <Destello at={wAt('tres') - 0.03} y={P.cosas + 160} />
    <Panel />
    {/* encabezado: fuera de la cámara del mapa para que no crezca */}
      <Bloque top={330} gap={4}>
        <Line at={MAPA[0] + 0.12} out={MAPA[1]}><span style={fina(52)}>siempre los mismos</span></Line>
        <Line at={MAPA[0] + 0.3} out={MAPA[1]} kind="pop"><span style={degrade(150)}>5 barrios</span></Line>
      </Bloque>
    <Titulos />
    <Subs />
    {guias && (
      <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid lime', boxSizing: 'border-box'}} />
    )}
  </AbsoluteFill>
);
