import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, Easing,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import data from './data.json';

// GIN 01-11 PAUTA monoambiente en Mataderos — acabado (el audio se mezcla aparte y se pega con ffmpeg)
export const FPS = 25;
const f = (s: number) => Math.round(s * FPS);
export const GIN0111_FRAMES = data.frames;
const DUR = data.frames / FPS;

const ROJO = '#E10E1C';
const MS = 'Montserrat';
const FONTS: [string, string, string?][] = [
  ['Montserrat-Regular.ttf', '400'], ['Montserrat-Medium.ttf', '500'], ['Montserrat-SemiBold.ttf', '600'],
  ['Montserrat-Bold.ttf', '700'], ['Montserrat-ExtraBold.ttf', '800'], ['Montserrat-Black.ttf', '900'], ['Montserrat-BlackItalic.ttf', '900', 'italic'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([file, weight, style]) =>
  new FontFace(MS, `url(${staticFile('fonts/' + file)})`, {weight, style: style ?? 'normal'}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

type Spk = {i: number; src: string; v0: number; v1: number; cam0: number; z: number[][]; ex: number[]; ey: number[]; hair: number; chin: number};
const SPK = data.spk as Spk[];
const BR = data.broll as [string, number, number, number, number][];
const WORDS = data.words as [string, number, number][];
const wAt = (w: string, desde = 0) => WORDS.find((x) => x[0].replace(/[,.?¿]/g, '').toLowerCase() === w.toLowerCase() && x[1] >= desde - 0.05)![1];

const escala = (z: number[][], t: number) => {
  if (t <= z[0][0]) return z[0][1];
  for (let k = 0; k < z.length - 1; k++) {
    const [a, sa] = z[k], [b, sb] = z[k + 1];
    if (t >= a && t <= b) {
      if (b - a < 1e-6) return sb;
      const u = (t - a) / (b - a);
      return b - a <= 0.15 ? sa + (sb - sa) * Easing.out(Easing.cubic)(u) : sa + (sb - sa) * (0.5 - 0.5 * Math.cos(Math.PI * u));
    }
  }
  return z[z.length - 1][1];
};
const ojo = (sp: Spk, t: number) => {
  const k = Math.max(0, Math.min(sp.ex.length - 1, Math.round((t - sp.v0) * FPS)));
  return [sp.ex[k], sp.ey[k]] as [number, number];
};

// ---------- transiciones (2–3 cuadros a cada lado del corte) ----------
type Corte = [number, 'zoom' | 'whip', number, number];
const e0 = (i: number) => ojo(SPK[i], SPK[i].v0);
const CORTES: Corte[] = [
  [4.4, 'zoom', ...e0(1)], [5.84, 'whip', 540, 960], [7.16, 'whip', 540, 960], [8.32, 'zoom', 540, 960], [12.0, 'whip', 540, 960],
  [15.32, 'whip', 540, 960], [19.36, 'whip', 540, 960], [21.12, 'zoom', 540, 960], [25.2, 'whip', 540, 960], [29.32, 'zoom', 540, 960],
  [31.8, 'whip', 540, 960], [35.24, 'whip', 540, 960], [37.24, 'whip', 540, 960], [39.2, 'whip', 540, 960],
];
const RADIO = 3.5;
const transStyle = (t: number): React.CSSProperties => {
  let e = 0, c = CORTES[0];
  for (const k of CORTES) {
    const v = 1 - Math.abs(t - k[0]) * FPS / RADIO;
    if (v > e) { e = v; c = k; }
  }
  if (e <= 0) return {};
  const side = t < c[0] ? -1 : 1;
  if (c[1] === 'whip') return {transform: `translateX(${-side * 160 * e}px) scale(${1 + 0.34 * e})`, filter: `url(#whip${Math.round(e * 10)})`};
  return {transform: `scale(${1 + 0.24 * e})`, transformOrigin: `${c[2]}px ${c[3]}px`, filter: `blur(${12 * e}px)`};
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
  const s = escala(sp.z, t);
  const [ex, ey] = ojo(sp, t);
  const ox = Math.min(Math.max(ex * (1 - 1 / s), 0), 1080 - 1080 / s);
  const oy = Math.min(Math.max(ey * (1 - 1 / s), 0), 1920 - 1920 / s);
  return (
    <AbsoluteFill style={transStyle(t)}>
      <AbsoluteFill style={{transform: `scale(${s}) translate(${-ox}px, ${-oy}px)`, transformOrigin: '0 0'}}>
        <OffthreadVideo src={staticFile(`gin0111/${sp.src}.mp4`)} startFrom={f(sp.cam0)} muted style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Broll: React.FC<{b: (typeof BR)[number]}> = ({b}) => {
  const frame = useCurrentFrame();
  const [src, v0, v1, desde, vel] = b;
  const t = v0 + frame / FPS;
  const z = interpolate(t, [v0, v1], [1.0, 1.07]);
  return (
    <AbsoluteFill style={transStyle(t)}>
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <OffthreadVideo src={staticFile(`gin0111/${src}.mp4`)} startFrom={f(desde)} playbackRate={vel} muted />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- tipografía ----------
const SOMBRA = '0 0 3px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.7), 0 3px 20px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.45)';
const med = (size: number, weight = 500): React.CSSProperties => ({fontFamily: MS, fontWeight: weight, fontSize: size, color: 'white',
  textShadow: SOMBRA, lineHeight: 1, letterSpacing: -size * 0.02});
const hook = (size: number, c = 'white'): React.CSSProperties => ({fontFamily: MS, fontWeight: 900, fontStyle: 'italic', fontSize: size, color: c,
  lineHeight: 0.9, letterSpacing: -size * 0.03, textShadow: '0 4px 14px rgba(0,0,0,0.6), 0 0 30px rgba(0,0,0,0.4)'});
const rojo = (size: number, stroke = 14, italic = false): React.CSSProperties => ({fontFamily: MS, fontWeight: 900, fontStyle: italic ? 'italic' : 'normal',
  fontSize: size, color: ROJO, lineHeight: 0.9, letterSpacing: -size * 0.03, WebkitTextStroke: `${stroke}px white`, paintOrder: 'stroke fill',
  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))'});
const Caja: React.FC<{children: React.ReactNode; size: number; italic?: boolean; a?: number}> = ({children, size, italic, a = 0.9}) => (
  <span style={{display: 'inline-block', background: `rgba(225,14,28,${a})`, padding: `${size * 0.1}px ${size * 0.2}px ${size * 0.06}px`, borderRadius: size * 0.08,
    fontFamily: MS, fontWeight: 900, fontStyle: italic ? 'italic' : 'normal', fontSize: size, color: 'white', lineHeight: 1, letterSpacing: -size * 0.02,
    boxShadow: '0 6px 18px rgba(0,0,0,0.35)'}}>{children}</span>
);
const B: React.FC<{children: React.ReactNode; c?: string}> = ({children, c}) => <b style={{fontWeight: 800, color: c}}>{children}</b>;

const useIn = (at: number, out: number, kind: 'pop' | 'up' | 'zoom') => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  const p = spring({frame: frame - f(at), fps, config: {damping: kind === 'up' ? 16 : 11, stiffness: kind === 'zoom' ? 240 : 180, mass: 0.7}});
  const o = interpolate(t, [out - 0.16, out], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const vis = t >= at - 0.001 && t < out;
  const blur = Math.max(0, interpolate(p, [0, 1], [kind === 'zoom' ? 16 : 10, 0], {extrapolateRight: 'clamp'})) +
    interpolate(t, [out - 0.16, out], [0, 8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const transform = kind === 'pop' ? `scale(${interpolate(p, [0, 1], [0.5, 1])})`
    : kind === 'zoom' ? `scale(${interpolate(p, [0, 1], [1.8, 1])})`
    : `translateY(${interpolate(p, [0, 1], [30, 0])}px)`;
  return {opacity: vis ? Math.min(1, p * 1.6) * o : 0, transform, filter: blur > 0.05 ? `blur(${blur}px)` : undefined} as React.CSSProperties;
};
const Line: React.FC<{at: number; out: number; kind?: 'pop' | 'up' | 'zoom'; children: React.ReactNode}> = ({at, out, kind = 'up', children}) => {
  const st = useIn(at, out, kind);
  return <div style={{...st, textAlign: 'center', whiteSpace: 'nowrap'}}>{children}</div>;
};
const Bloque: React.FC<{top?: number; center?: number; bottom?: number; x?: number; gap?: number; children: React.ReactNode}> = ({top, center, bottom, x = 540, gap = 6, children}) => (
  <div style={{position: 'absolute', left: x - 540, width: 1080, top: bottom === undefined ? center ?? top : undefined,
    bottom: bottom !== undefined ? 1920 - bottom : undefined, transform: center !== undefined ? 'translateY(-50%)' : undefined,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>{children}</div>
);
// velo negro→rojo desde arriba, solo sobre las tomas a cámara (pared blanca); el B-roll va sin velo
const Velo: React.FC<{at: number; out: number; y: number}> = ({at, out, y}) => {
  const t = useCurrentFrame() / FPS;
  const o = interpolate(t, [at - 0.12, at + 0.1, out - 0.15, out], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  return <AbsoluteFill style={{opacity: o, background: `linear-gradient(180deg, rgba(15,15,15,0.8) 0px, rgba(60,8,12,0.6) ${y - 200}px, rgba(120,10,18,0.26) ${y}px, rgba(0,0,0,0) ${y + 140}px)`}} />;
};
const Contador: React.FC<{a: number; b: number; hasta: number; miles?: boolean}> = ({a, b, hasta, miles}) => {
  const t = useCurrentFrame() / FPS;
  const v = Math.round(interpolate(t, [a, b], [0, hasta], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  return <>{miles ? v.toLocaleString('es-AR') : v}</>;
};
const prog = (t: number, a: number, b: number, ease = Easing.out(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
const salida = (t: number, out: number) => interpolate(t, [out - 0.16, out], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ---------- MOTION 1: cota de 30 m² ----------
const Cota: React.FC<{at: number; out: number; y: number}> = ({at, out, y}) => {
  const t = useCurrentFrame() / FPS;
  if (t < at || t >= out) return null;
  const u = prog(t, at, at + 0.45);
  const X0 = 190, X1 = 890, cx = 540, half = (X1 - X0) / 2 * u;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: salida(t, out), filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.55))'}}>
      <line x1={cx - half} y1={y} x2={cx + half} y2={y} stroke="white" strokeWidth={7} strokeLinecap="round" />
      {u > 0.02 && <>
        <path d={`M ${cx - half + 26} ${y - 18} L ${cx - half} ${y} L ${cx - half + 26} ${y + 18}`} fill="none" stroke="white" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${cx + half - 26} ${y - 18} L ${cx + half} ${y} L ${cx + half - 26} ${y + 18}`} fill="none" stroke="white" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        <line x1={cx - half} y1={y - 40} x2={cx - half} y2={y + 40} stroke={ROJO} strokeWidth={8} strokeLinecap="round" />
        <line x1={cx + half} y1={y - 40} x2={cx + half} y2={y + 40} stroke={ROJO} strokeWidth={8} strokeLinecap="round" />
      </>}
    </svg>
  );
};

// ---------- MOTION 2: checklist de características ----------
const ITEMS: [string, string, number][] = [['COCINA INTEGRADA', 'cocina', 15], ['ACEPTA MASCOTAS', 'acepta', 16], ['APTO PROFESIONAL', 'apto', 18]];
const Checklist: React.FC<{at: number; out: number}> = ({at, out}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t < at - 0.1 || t >= out) return null;
  const o = salida(t, out);
  // bloque final de 3 filas centrado en x = 540 / y = 940 (ancho fijo del estado final)
  const W = 700, RH = 128, top = 940 - (RH * 3) / 2;
  return (
    <div style={{position: 'absolute', left: 540 - W / 2, top, width: W, opacity: o}}>
      {ITEMS.map(([lab, w, d], i) => {
        const a = wAt(w, d) - 0.06;
        const p = spring({frame: frame - f(a), fps, config: {damping: 12, stiffness: 200, mass: 0.6}});
        const tick = prog(t, a + 0.08, a + 0.32);
        return (
          <div key={lab} style={{position: 'absolute', top: i * RH, left: 0, width: W, height: RH, display: 'flex', alignItems: 'center', gap: 26,
            opacity: t >= a ? Math.min(1, p * 1.6) : 0, transform: `translateX(${interpolate(p, [0, 1], [-40, 0])}px)`}}>
            <svg width={92} height={92} viewBox="0 0 92 92" style={{flex: 'none', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))'}}>
              <circle cx={46} cy={46} r={40 * Math.min(1, p)} fill={ROJO} stroke="white" strokeWidth={5} />
              <path d="M 27 47 L 40 60 L 66 33" fill="none" stroke="white" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={60} strokeDashoffset={60 * (1 - tick)} />
            </svg>
            <span style={{...med(54, 900), letterSpacing: -1.4, whiteSpace: 'nowrap'}}>{lab}</span>
          </div>
        );
      })}
    </div>
  );
};

// ---------- MOTION 3: pin de ubicación + colectivo ----------
const Pin: React.FC<{at: number; out: number; cy: number}> = ({at, out, cy}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t < at || t >= out) return null;
  const p = spring({frame: frame - f(at), fps, config: {damping: 9, stiffness: 160, mass: 0.8}});
  const dy = interpolate(p, [0, 1], [-160, 0]);
  const ring = (t - at) % 1.1 / 1.1;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: salida(t, out) * Math.min(1, p * 2)}}>
      <ellipse cx={540} cy={cy + 6} rx={70 * ring + 20} ry={(70 * ring + 20) * 0.32} fill="none" stroke="white" strokeWidth={5} opacity={1 - ring} />
      <ellipse cx={540} cy={cy + 6} rx={26} ry={8} fill="rgba(0,0,0,0.45)" />
      <g transform={`translate(${540 - 50} ${cy - 128 + dy})`} style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))'}}>
        <path d="M50 4 C24 4 6 23 6 48 C6 82 50 124 50 124 C50 124 94 82 94 48 C94 23 76 4 50 4 Z" fill={ROJO} stroke="white" strokeWidth={7} />
        <circle cx={50} cy={48} r={16} fill="white" />
      </g>
    </svg>
  );
};
const Colectivo: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))'}}>
    <circle cx={50} cy={50} r={46} fill={ROJO} stroke="white" strokeWidth={6} />
    <rect x={27} y={24} width={46} height={46} rx={8} fill="white" />
    <rect x={32} y={30} width={36} height={18} rx={3} fill={ROJO} />
    <circle cx={36} cy={60} r={4} fill={ROJO} /><circle cx={64} cy={60} r={4} fill={ROJO} />
    <rect x={30} y={68} width={9} height={9} rx={2} fill="white" /><rect x={61} y={68} width={9} height={9} rx={2} fill="white" />
  </svg>
);

// ---------- MOTION 4: flecha de inversión ----------
const Tendencia: React.FC<{at: number; out: number; y: number}> = ({at, out, y}) => {
  const t = useCurrentFrame() / FPS;
  if (t < at || t >= out) return null;
  const u = prog(t, at, at + 0.6, Easing.inOut(Easing.cubic));
  const pts = [[250, y + 60], [400, y - 10], [520, y + 30], [700, y - 110], [830, y - 150]];
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: salida(t, out), filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.55))'}}>
      <path d={d} fill="none" stroke="white" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
      {u > 0.96 && <path d={`M 790 ${y - 166} L 836 ${y - 153} L 818 ${y - 108}`} fill="none" stroke="white" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

// ---------- MOTION 5: flecha del CTA (hacia el botón del anuncio) ----------
const FlechaCTA: React.FC<{at: number; y: number}> = ({at, y}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t < at) return null;
  const p = spring({frame: frame - f(at), fps, config: {damping: 12, stiffness: 180, mass: 0.6}});
  const b = Math.abs(Math.sin((t - at) * Math.PI * 2.2)) * 18;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: Math.min(1, p * 1.5), filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.55))'}}>
      <g transform={`translate(0 ${b})`}>
        <path d={`M 540 ${y} L 540 ${y + 70}`} stroke="white" strokeWidth={12} strokeLinecap="round" />
        <path d={`M 505 ${y + 40} L 540 ${y + 76} L 575 ${y + 40}`} fill="none" stroke="white" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

// destello blanco (entrada a la terraza)
const Flash: React.FC<{at: number}> = ({at}) => {
  const t = useCurrentFrame() / FPS;
  const o = interpolate(t, [at - 0.1, at, at + 0.26], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return o > 0 ? <AbsoluteFill style={{background: 'white', opacity: o}} /> : null;
};

// ---------- títulos ----------
const AIRE = 25;
const Titulos: React.FC = () => {
  const pagas = wAt('pagás'), alquiler = wAt('alquiler'), queres = wAt('querés'), departamento = wAt('departamento'), mataderos = wAt('mataderos');
  const frena = wAt('frená'), aca = wAt('acá'), mono = wAt('monoambiente'), estrenar = wAt('estrenar');
  const n58 = wAt('58'), mil = wAt('mil'), apto = wAt('apto'), credito = wAt('crédito');
  const son = wAt('son'), m30 = wAt('30'), cuadrados = wAt('cuadrados'), primer = wAt('primer', 10), contra = wAt('contrafrente');
  const tiene = wAt('tiene'), cuenta = wAt('cuenta'), terraza = wAt('terraza'), parrilla = wAt('parrilla');
  const ademas = wAt('además'), cuadra = wAt('una', 30.5), alberdi = wAt('alberdi'), colectivos = wAt('colectivos'), esquina = wAt('esquina');
  const si = wAt('si', 35), invertir = wAt('invertir'), conCar = wAt('con', 41);
  const T1 = 815, T3 = SPK[0].hair - AIRE, T4 = SPK[1].hair - AIRE;
  return (
    <>
      {/* HOOK 1: si hoy pagás ALQUILER → tu primer departamento propio en MATADEROS → FRENÁ ACÁ (arriba de la cabeza) */}
      <Velo at={0} out={4.4} y={T1} />
      <Bloque bottom={T1} gap={4}>
        <Line at={0} out={queres - 0.06}><span style={med(60)}>si hoy pagás</span></Line>
        <Line at={alquiler - 0.06} out={queres - 0.06} kind="zoom"><span style={hook(150)}>ALQUILER</span></Line>
      </Bloque>
      <Bloque bottom={T1} gap={6}>
        <Line at={queres - 0.06} out={frena - 0.08}><span style={med(54)}>y querés tu <B>primer</B></span></Line>
        <Line at={departamento - 0.06} out={frena - 0.08}><span style={med(54)}>departamento propio en</span></Line>
        <Line at={mataderos - 0.06} out={frena - 0.08} kind="zoom"><span style={hook(100, ROJO)}>MATADEROS</span></Line>
      </Bloque>
      <Bloque bottom={T3} gap={4}>
        <Line at={frena - 0.08} out={4.42} kind="zoom"><span style={hook(124)}>FRENÁ <span style={{color: ROJO}}>ACÁ</span></span></Line>
      </Bloque>
      {/* HOOK 2: MONOAMBIENTE a estrenar */}
      <Velo at={4.4} out={5.84} y={T4} />
      <Bloque bottom={T4} gap={10}>
        <Line at={mono - 0.06} out={5.86} kind="zoom"><span style={hook(88)}>MONOAMBIENTE</span></Line>
        <Line at={estrenar - 0.04} out={5.86} kind="pop"><Caja size={70} italic>A ESTRENAR</Caja></Line>
      </Bloque>
      {/* precio sobre el depto: USD 58.000 + APTO CRÉDITO */}
      <Bloque center={900} gap={14}>
        <Line at={n58 - 0.06} out={8.34} kind="pop"><span style={rojo(140, 14)}><span style={{fontSize: 76}}>USD </span><Contador a={n58 - 0.06} b={mil + 0.25} hasta={58000} miles /></span></Line>
        <Line at={apto - 0.06} out={8.34} kind="zoom"><Caja size={86} italic>APTO CRÉDITO</Caja></Line>
      </Bloque>
      {/* 30 m² · 1° piso · contrafrente */}
      <Cota at={son - 0.04} out={12.0} y={1000} />
      <Bloque bottom={1000 - 40} gap={4}>
        <Line at={m30 - 0.06} out={12.0} kind="pop"><span style={rojo(210, 18)}><Contador a={m30 - 0.06} b={cuadrados} hasta={30} /> M²</span></Line>
      </Bloque>
      <Bloque top={1000 + 50} gap={14}>
        <Line at={primer - 0.06} out={12.0} kind="pop"><Caja size={66}>1° PISO</Caja></Line>
        <Line at={contra - 0.06} out={12.0}><span style={med(56, 800)}>AL CONTRAFRENTE</span></Line>
      </Bloque>
      {/* checklist */}
      <Bloque bottom={940 - 192 - 20}>
        <Line at={tiene - 0.04} out={19.36}><span style={med(56)}>tiene</span></Line>
      </Bloque>
      <Checklist at={tiene} out={19.36} />
      {/* TERRAZA con parrilla */}
      <Bloque center={900} gap={10}>
        <Line at={cuenta - 0.04} out={wAt('ideal') - 0.04}><span style={med(58)}>cuenta con una</span></Line>
        <Line at={terraza - 0.06} out={wAt('ideal') - 0.04} kind="zoom"><span style={hook(142)}>TERRAZA</span></Line>
        <Line at={parrilla - 0.1} out={wAt('ideal') - 0.04} kind="pop"><Caja size={80} italic>CON PARRILLA</Caja></Line>
      </Bloque>
      {/* ubicación: pin + a una cuadra de ALBERDI */}
      <Pin at={ademas - 0.04} out={31.8} cy={860} />
      <Bloque top={900} gap={12}>
        <Line at={ademas - 0.04} out={31.8}><span style={med(58, 800)}>MATADEROS</span></Line>
        <Line at={cuadra - 0.06} out={31.8}><span style={med(54)}>a una cuadra de</span></Line>
        <Line at={alberdi - 0.06} out={31.8} kind="zoom"><Caja size={96} italic>ALBERDI</Caja></Line>
      </Bloque>
      {/* colectivos en la esquina */}
      <Bloque center={940} gap={14}>
        <Line at={colectivos - 0.08} out={wAt('cómodamente') - 0.04} kind="pop"><Colectivo size={150} /></Line>
        <Line at={colectivos - 0.06} out={wAt('cómodamente') - 0.04} kind="zoom"><span style={rojo(104, 13)}>COLECTIVOS</span></Line>
        <Line at={esquina - 0.2} out={wAt('cómodamente') - 0.04}><span style={med(56)}>en la <B>esquina</B></span></Line>
      </Bloque>
      {/* invertir */}
      <Tendencia at={si - 0.04} out={wAt('también', 36.5) - 0.04} y={1120} />
      <Bloque center={900} gap={8}>
        <Line at={si - 0.04} out={wAt('también', 36.5) - 0.04}><span style={med(58)}>si estás pensando en</span></Line>
        <Line at={invertir - 0.06} out={wAt('también', 36.5) - 0.04} kind="zoom"><span style={rojo(140, 15, true)}>INVERTIR</span></Line>
      </Bloque>
      {/* CTA en texto (no está grabado) */}
      <Bloque center={880} gap={10}>
        <Line at={conCar - 0.04} out={DUR + 1}><span style={med(58)}>tocá el botón y</span></Line>
        <Line at={conCar + 0.1} out={DUR + 1} kind="zoom"><span style={rojo(120, 14)}>ESCRIBINOS</span></Line>
        <Line at={conCar + 0.3} out={DUR + 1} kind="pop"><Caja size={74} italic>POR WHATSAPP</Caja></Line>
      </Bloque>
      <FlechaCTA at={conCar + 0.5} y={1120} />
    </>
  );
};

// ---------- subtítulos (sobre B-roll, centrados) ----------
type Sub = {t: string; s: number; e: number};
const Pieza: React.FC<{p: string}> = ({p}) => {
  if (p.startsWith('*')) return <span style={{fontFamily: MS, fontWeight: 900, fontSize: 74, color: ROJO, WebkitTextStroke: '11px white', paintOrder: 'stroke fill',
    letterSpacing: -1.6, filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))'}}>{p.replace(/\*/g, '')}</span>;
  if (p.startsWith('[')) return <span style={{background: 'rgba(225,14,28,0.85)', padding: '4px 14px 2px', borderRadius: 6, fontFamily: MS, fontWeight: 900, fontSize: 66,
    color: 'white', letterSpacing: -1, boxShadow: '0 4px 14px rgba(0,0,0,0.3)'}}>{p.replace(/[[\]]/g, '')}</span>;
  return <span style={{fontFamily: MS, fontWeight: 500, fontSize: 66, color: 'white', letterSpacing: -1, textShadow: SOMBRA}}>{p}</span>;
};
const Subs: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const b = (data.subs as Sub[]).find((s) => t >= s.s && t < s.e);
  if (!b) return null;
  const k = frame - f(b.s);
  const op = interpolate(k, [0, 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sc = interpolate(k, [0, 3], [0.9, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const partes = b.t.match(/\*[^*]+\*|\[[^\]]+\]|[^*[]+/g)!.map((p) => p.trim()).filter(Boolean);
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: 960 - 40, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16,
      whiteSpace: 'nowrap', opacity: op, transform: `scale(${sc})`, transformOrigin: '540px 40px'}}>
      {partes.map((p, i) => <Pieza key={i} p={p} />)}
    </div>
  );
};

export const GIN0111: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    <WhipFilters />
    {SPK.map((s) => (
      <Sequence key={s.i} from={f(s.v0)} durationInFrames={f(s.v1) - f(s.v0)}><Speaker sp={s} /></Sequence>
    ))}
    {BR.map((b, i) => (
      <Sequence key={i} from={f(b[1])} durationInFrames={f(b[2]) - f(b[1])}><Broll b={b} /></Sequence>
    ))}
    <Flash at={21.12} />
    <Titulos />
    <Subs />
    {guias && <>
      <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 980, border: '3px solid lime', boxSizing: 'border-box'}} />
      <div style={{position: 'absolute', left: 180, top: 270, width: 720, height: 980, border: '2px dashed yellow', boxSizing: 'border-box'}} />
    </>}
  </AbsoluteFill>
);
