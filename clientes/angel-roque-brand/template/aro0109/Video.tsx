import React from 'react';
import {
  AbsoluteFill, Easing, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import timeline from './timeline.json';

// ARO 01-09 PAUTA — casa terminada en Mango Hills, San Antonio FL (el audio se mezcla aparte y se pega con ffmpeg)
export const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
export const ARO0109_FRAMES = timeline.frames;

export const NAVY = '#2A3C54', AZUL = '#2D508F', DORADO = '#CD9C38', BEIGE = '#E0C8A8';
export const MS = 'Montserrat', TS = 'The Seasons';

// ---------- fuentes ----------
const FONTS: [string, string, string, string][] = [
  [MS, 'Montserrat-Medium.ttf', '500', 'normal'], [MS, 'Montserrat-SemiBold.ttf', '600', 'normal'],
  [MS, 'Montserrat-Bold.ttf', '700', 'normal'], [MS, 'Montserrat-BoldItalic.ttf', '700', 'italic'],
  [MS, 'Montserrat-ExtraBold.ttf', '800', 'normal'], [MS, 'Montserrat-Black.ttf', '900', 'normal'],
  [MS, 'Montserrat-BlackItalic.ttf', '900', 'italic'], [MS, 'Montserrat-Light.ttf', '300', 'normal'],
  [TS, 'TheSeasons-Bold.otf', '700', 'normal'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([fam, file, weight, style]) =>
  new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight, style}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

// ---------- planos ----------
// [archivo, inicio en el archivo, a, b, tipo, tracking]
export type Plano = [string, number, number, number, string, string];
export const PLANOS = timeline.planos as unknown as Plano[];

const Video: React.FC<{p: Plano}> = ({p}) => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile(`aro0109/${p[0]}.mp4`)} startFrom={f(p[1])} muted />
  </AbsoluteFill>
);
export const PLANO_AT = (t: number) => PLANOS.find((p) => t >= p[2] && t < p[3]) ?? PLANOS[PLANOS.length - 1];

// ---------- mapa de la zona (lat/lon reales proyectados; centro en x = 540) ----------
const LON0 = -82.40, LAT0 = 28.12, KLAT = 1250, KLON = 1250 * Math.cos(28.15 * Math.PI / 180);
const P = (lat: number, lon: number): [number, number] => [540 + (lon - LON0) * KLON, 960 - (lat - LAT0) * KLAT];
const I75: [number, number][] = [[28.62, -82.22], [28.50, -82.24], [28.40, -82.27], [28.335, -82.30], [28.27, -82.33], [28.217, -82.355],
  [28.13, -82.37], [28.06, -82.37], [27.98, -82.34], [27.90, -82.33], [27.78, -82.33]].map(([a, b]) => P(a, b));
const COSTA: [number, number][] = [[29.0, -82.70], [28.70, -82.66], [28.45, -82.68], [28.25, -82.74], [28.08, -82.77], [28.02, -82.70],
  [28.03, -82.62], [27.97, -82.56], [27.93, -82.48], [27.87, -82.47], [27.80, -82.42], [27.70, -82.50], [27.62, -82.62], [27.55, -82.75], [27.40, -82.90]]
  .map(([a, b]) => P(a, b));
const LUGARES = {
  mango: P(28.335, -82.30), dade: P(28.364, -82.196), wesley: P(28.239, -82.328), outlets: P(28.217, -82.357), tampa: P(27.951, -82.458),
};
const ruta = (pts: [number, number][]) => 'M' + pts.map((q) => q.map((v) => v.toFixed(1)).join(' ')).join(' L');

const Pin: React.FC<{x: number; y: number; at: number; color?: string; r?: number}> = ({x, y, at, color = DORADO, r = 20}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - f(at), fps, config: {damping: 10, stiffness: 180, mass: 0.6}});
  const pulse = (frame - f(at)) / FPS;
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.max(0, p)})`}>
      {pulse > 0 && <circle r={r + 40 * ((pulse % 1.2) / 1.2)} fill="none" stroke={color} strokeWidth={3} opacity={1 - (pulse % 1.2) / 1.2} />}
      <circle r={r + 7} fill="white" />
      <circle r={r} fill={color} />
    </g>
  );
};
const Etiqueta: React.FC<{x: number; y: number; at: number; align?: 'left' | 'right'; children: React.ReactNode}> = ({x, y, at, align = 'left', children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - f(at), fps, config: {damping: 16, stiffness: 160, mass: 0.7}});
  const dx = interpolate(p, [0, 1], [align === 'left' ? -24 : 24, 0]);
  return (
    <div style={{position: 'absolute', top: y, left: align === 'left' ? x : undefined, right: align === 'right' ? 1080 - x : undefined,
      transform: `translate(${dx}px, -50%)`, opacity: Math.min(1, Math.max(0, p) * 1.5), textAlign: align, filter: `blur(${(1 - Math.min(1, p)) * 6}px)`}}>
      {children}
    </div>
  );
};
const lbl = (size: number, weight = 900, color = 'white'): React.CSSProperties => ({fontFamily: MS, fontWeight: weight, fontSize: size, color, lineHeight: 0.9,
  letterSpacing: -0.02 * size, whiteSpace: 'nowrap', textShadow: '0 2px 10px rgba(16,24,38,0.6)'});

// mapa: v = 1 (zona: Mango Hills en San Antonio), v = 2 (I-75 hasta Wesley Chapel y los outlets)
export const Mapa: React.FC<{v: 1 | 2; dur: number}> = ({v, dur}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // zoom lento hacia la zona; el v2 arranca un poco más abierto para mostrar el recorrido
  const s = v === 1 ? interpolate(t, [0, dur], [1.18, 1.3]) : interpolate(t, [0, dur], [1.08, 1.14]);
  const [ax, ay] = v === 1 ? LUGARES.mango : [(LUGARES.mango[0] + LUGARES.outlets[0]) / 2, (LUGARES.mango[1] + LUGARES.outlets[1]) / 2];
  const dibuja = v === 1 ? 1 : interpolate(t, [0.05, 0.9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const tramo = interpolate(t, [0.5, 1.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const largo = 2400, largoTramo = 230;
  const tramoPts = [LUGARES.mango, P(28.27, -82.33), LUGARES.outlets];
  // el mapa escala alrededor del punto de interés y lo deja en x = 540, y = 820 (centro de la zona segura de pauta)
  const tx = 540 - ax * s, ty = 820 - ay * s;
  const sp = (q: [number, number]): [number, number] => [q[0] * s + tx, q[1] * s + ty];
  const [mx, my] = sp(LUGARES.mango), [dx, dy] = sp(LUGARES.dade), [wx, wy] = sp(LUGARES.wesley), [ox, oy] = sp(LUGARES.outlets), [tpx, tpy] = sp(LUGARES.tampa);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #22324A 0%, ${NAVY} 45%, #1E2C40 100%)`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="grilla" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" /></pattern>
          <filter id="brillo"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <g transform={`translate(${tx} ${ty}) scale(${s})`}>
          <rect x={-800} y={-800} width={2800} height={3600} fill="url(#grilla)" />
          {/* agua: golfo y bahía de Tampa */}
          <path d={ruta(COSTA) + ' L -900 2400 L -900 -900 Z'} fill="#16233A" stroke="rgba(224,200,168,0.35)" strokeWidth={3 / s} />
          {/* I-75 */}
          <path d={ruta(I75)} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={22 / s} strokeLinecap="round" strokeLinejoin="round" />
          <path d={ruta(I75)} fill="none" stroke="white" strokeWidth={8 / s} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={largo} strokeDashoffset={largo * (1 - dibuja)} opacity={0.9} />
          {v === 2 && (
            <path d={ruta(tramoPts)} fill="none" stroke={DORADO} strokeWidth={14 / s} strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={largoTramo} strokeDashoffset={largoTramo * (1 - tramo)} />
          )}
        </g>
        <circle cx={tpx} cy={tpy} r={9} fill="rgba(255,255,255,0.55)" />
        <circle cx={dx} cy={dy} r={8} fill="rgba(255,255,255,0.45)" />
        {v === 2 && <Pin x={wx} y={wy} at={0.75} color={AZUL} r={15} />}
        {v === 2 && <Pin x={ox} y={oy} at={1.0} color={AZUL} r={15} />}
        <Pin x={mx} y={my} at={v === 1 ? 0.15 : 0} />
      </svg>
      {/* etiquetas (HTML para usar las fuentes de la marca) */}
      <div style={{position: 'absolute', left: tpx + 22, top: tpy, transform: 'translateY(-50%)', ...lbl(34, 600, 'rgba(255,255,255,0.6)')}}>Tampa</div>
      <div style={{position: 'absolute', left: dx + 20, top: dy, transform: 'translateY(-50%)', ...lbl(30, 600, 'rgba(255,255,255,0.55)')}}>Dade City</div>
      <I75Escudo x={sp(P(28.45, -82.255))[0]} y={sp(P(28.45, -82.255))[1]} at={v === 1 ? 0.6 : 0.1} />
      {v === 1 ? (
        <Etiqueta x={mx + 40} y={my} at={0.35}>
          <div style={lbl(70, 900)}>MANGO</div>
          <div style={lbl(70, 900)}>HILLS</div>
          <div style={{...lbl(38, 500, BEIGE), marginTop: 10}}>San Antonio, FL</div>
        </Etiqueta>
      ) : (
        <>
          <Etiqueta x={mx + 36} y={my} at={0}><div style={lbl(40, 800)}>Mango Hills</div></Etiqueta>
          <Etiqueta x={wx + 30} y={wy} at={0.8}><div style={lbl(42, 800)}>Wesley Chapel</div></Etiqueta>
          <Etiqueta x={(mx + ox) / 2 - 34} y={(my + oy) / 2 - 6} at={1.25} align="right">
            <div style={{...lbl(40, 900), background: DORADO, padding: '10px 16px 8px', borderRadius: 10, textShadow: 'none', color: NAVY}}>15 MIN</div>
          </Etiqueta>
          <Etiqueta x={ox - 30} y={oy + 46} at={1.05} align="right">
            <div style={lbl(36, 700)}>Tampa Premium</div><div style={lbl(36, 700)}>Outlets</div>
          </Etiqueta>
        </>
      )}
    </AbsoluteFill>
  );
};
const I75Escudo: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - f(at), fps, config: {damping: 12, stiffness: 170, mass: 0.6}});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${Math.max(0, p)})`}}>
      <svg width="92" height="96" viewBox="0 0 92 96">
        <path d="M6 14 Q46 -2 86 14 L84 50 Q80 80 46 94 Q12 80 8 50 Z" fill={AZUL} stroke="white" strokeWidth="5" />
        <text x="46" y="66" textAnchor="middle" fontFamily={MS} fontWeight={900} fontSize="38" fill="white">75</text>
      </svg>
    </div>
  );
};

// ---------- gráfico: lavadora y secadora incluidas ----------
const IcoLavadora: React.FC<{seca?: boolean}> = ({seca}) => (
  <svg width="230" height="260" viewBox="0 0 230 260" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="14" y="10" width="202" height="240" rx="22" />
    <path d="M14 66h202" />
    <circle cx="48" cy="38" r="7" fill="white" /><path d="M140 38h46" />
    <circle cx="115" cy="155" r="62" />
    {seca ? <path d="M84 150c10-14 20-14 30 0s20 14 32 0" /> : <path d="M80 165c12 8 24 8 35 0s23-8 35 0" stroke={DORADO} />}
  </svg>
);
export const Lavadora: React.FC<{dur: number; tLav: number; tSec: number}> = ({tLav, tSec}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = (at: number) => spring({frame: frame - f(at), fps, config: {damping: 11, stiffness: 170, mass: 0.7}});
  const a = pop(tLav), b = pop(tSec);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: 'blur(22px) brightness(0.55)', transform: 'scale(1.15)'}}>
        <OffthreadVideo src={staticFile('aro0109/athena.mp4')} startFrom={f(88.4)} muted />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(42,60,84,0.55), rgba(42,60,84,0.85))`}} />
      {/* bloque centrado en x = 540 sobre su estado final */}
      <div style={{position: 'absolute', left: 0, width: 1080, top: 780, transform: 'translateY(-50%) scale(1.3)', display: 'flex', justifyContent: 'center', gap: 60}}>
        <div style={{transform: `scale(${Math.max(0, a)})`, opacity: Math.min(1, a * 2), filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.35))'}}><IcoLavadora /></div>
        <div style={{transform: `scale(${Math.max(0, b)})`, opacity: Math.min(1, b * 2), filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.35))'}}><IcoLavadora seca /></div>
      </div>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 500, display: 'flex', justifyContent: 'center'}}>
        <div style={{opacity: Math.min(1, Math.max(0, pop(0.04)) * 1.6), transform: `translateY(${(1 - Math.min(1, pop(0.04))) * 20}px)`, ...lbl(58, 500)}}>también incluye</div>
      </div>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 990, display: 'flex', justifyContent: 'center', gap: 138}}>
        <div style={{width: 230, textAlign: 'center', opacity: Math.min(1, Math.max(0, a) * 1.6), ...lbl(64, 700), fontFamily: TS}}>lavadora</div>
        <div style={{width: 230, textAlign: 'center', opacity: Math.min(1, Math.max(0, b) * 1.6), ...lbl(64, 700), fontFamily: TS}}>secadora</div>
      </div>
    </AbsoluteFill>
  );
};

export const PLANO_COMP = (p: Plano) => {
  const dur = p[3] - p[2];
  if (p[0] === 'mapa') return <Mapa v={1} dur={dur} />;
  if (p[0] === 'mapa2') return <Mapa v={2} dur={dur} />;
  if (p[0] === 'lavadora') return <Lavadora dur={dur} tLav={0.85} tSec={1.59} />;
  return <Video p={p} />;
};

// estructura: solo cortes (sin subtítulos, títulos, transiciones ni zooms)
export const ARO0109E: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    {PLANOS.map((p, i) => (
      <Sequence key={i} from={f(p[2])} durationInFrames={f(p[3]) - f(p[2])}>{PLANO_COMP(p)}</Sequence>
    ))}
  </AbsoluteFill>
);
