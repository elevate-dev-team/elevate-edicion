import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import WJ from './words.json';

// REB 11-11 "La pregunta que más nos hacen: ¿cuándo me mudo?" — acabado (el audio se mezcla aparte y se pega con ffmpeg)
export const FPS = 30;
export const REB1111_FRAMES = 766;
const DUR = REB1111_FRAMES / FPS;
const VERDE = '#5D8776', MOSTAZA = '#CDBC31', CREMA = '#F2EBC7', OSCURO = 'rgba(30,45,40,0.88)';
const MS = 'Montserrat';

const FONTS: [string, string][] = [
  ['Montserrat-Light.ttf', '300'], ['Montserrat-SemiBold.ttf', '600'], ['Montserrat-Bold.ttf', '700'], ['Montserrat-Black.ttf', '900'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([file, weight]) =>
  new FontFace(MS, `url(${staticFile('fonts/' + file)})`, {weight}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

const WORDS = WJ as [string, number, number][];
const ws = (i: number) => WORDS[i][1];
const we = (i: number) => WORDS[i][2];

// ---------- tramos ----------
const F = [136, 186, 269, 336, 392, 478, 566, 651];
const T = F.map((f) => f / FPS);
const [T1, T2, T3, T4, T5, T6, T7, T8] = T;
const CLIPS: [string, number, number, number][] = [
  ['02_ciudad', F[0], F[1], 1.07], ['03_planos', F[1], F[2], 1.06], ['04_fundacion', F[2], F[3], 1.07], ['05_torre', F[3], F[4], 1.08],
  ['06_celular', F[4], F[5], 1.07], ['07_avenida', F[5], F[6], 1.07], ['08_torres', F[6], F[7], 1.07],
];
const OJOS_CTA: [number, number] = [595, 574];
const T_PUNCH = 24.07;

// ---------- transiciones ----------
const CORTES: [number, 'zoom' | 'whip', number, number][] = [
  [T1, 'whip', 540, 960], [T2, 'whip', 540, 960], [T3, 'whip', 540, 960], [T4, 'whip', 540, 960],
  [T5, 'whip', 540, 960], [T6, 'whip', 540, 960], [T7, 'whip', 540, 960], [T8, 'zoom', ...OJOS_CTA],
];
const RADIO = 3.5;
const trans = (t: number) => {
  let e = 0, c = CORTES[0];
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

const Hook: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={transStyle(t)}>
      <OffthreadVideo src={staticFile('reb1111/01_hook.mp4')} muted style={{width: 1080, height: 1920}} />
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const t = T8 + frame / FPS;
  const s = t < T_PUNCH
    ? interpolate(t, [T8, T_PUNCH], [1.0, 1.05])
    : interpolate(t, [T_PUNCH, DUR], [1.12, 1.16]);
  return (
    <AbsoluteFill style={transStyle(t)}>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${OJOS_CTA[0]}px ${OJOS_CTA[1]}px`}}>
        <OffthreadVideo src={staticFile('reb1111/09_cta.mp4')} muted style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Broll: React.FC<{clip: [string, number, number, number]}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [name, a, b, z] = clip;
  const t = a / FPS + frame / FPS;
  const s = interpolate(frame, [0, b - a], [1.0, z]);
  return (
    <AbsoluteFill style={transStyle(t)}>
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        <OffthreadVideo src={staticFile(`reb1111/${name}.mp4`)} muted style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- tipografía ----------
const SOMBRA = '0 0 3px rgba(0,0,0,.75), 0 2px 6px rgba(0,0,0,.7), 0 3px 20px rgba(0,0,0,.65), 0 0 40px rgba(0,0,0,.45)';
const verde = (size: number): React.CSSProperties => ({
  fontFamily: MS, fontWeight: 900, fontSize: size, color: VERDE, letterSpacing: '-0.05em', lineHeight: 0.98,
  WebkitTextStroke: '9px white', paintOrder: 'stroke fill', textShadow: '0 4px 18px rgba(0,0,0,.45)',
});
const light = (size: number): React.CSSProperties => ({fontFamily: MS, fontWeight: 300, fontSize: size, color: 'white', textShadow: SOMBRA, lineHeight: 1});
const bold = (size: number): React.CSSProperties => ({fontFamily: MS, fontWeight: 700, fontSize: size, color: 'white', textShadow: SOMBRA, lineHeight: 1});
const degrade = (size: number): React.CSSProperties => ({
  fontFamily: MS, fontWeight: 900, fontSize: size, letterSpacing: '-0.05em', lineHeight: 1,
  background: `linear-gradient(90deg, ${MOSTAZA}, ${CREMA})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
  paddingTop: '0.3em', marginTop: '-0.3em', paddingBottom: '0.15em', marginBottom: '-0.15em', paddingLeft: 8, paddingRight: 8,
  filter: 'drop-shadow(0 3px 10px rgba(0,0,0,.6))', display: 'inline-block',
});

const Halo: React.FC<{y: number; w?: number; h?: number; a?: number}> = ({y, w = 760, h = 170, a = 0.42}) => (
  <div style={{position: 'absolute', left: 540 - w / 2, top: y - h / 2, width: w, height: h,
    background: `radial-gradient(ellipse at center, rgba(0,0,0,${a}) 0%, rgba(0,0,0,0) 70%)`}} />
);

// ---------- subtítulos karaoke ----------
type Chunk = {a: number; b: number; y: number; hasta?: number};
const CHUNKS: Chunk[] = [
  {a: 0, b: 1, y: 630}, {a: 2, b: 5, y: 630, hasta: 6},
  {a: 20, b: 22, y: 1130}, {a: 23, b: 26, y: 1130}, {a: 27, b: 28, y: 1130},
  {a: 29, b: 32, y: 1130}, {a: 33, b: 36, y: 1130}, {a: 37, b: 41, y: 1130}, {a: 42, b: 44, y: 1130},
  {a: 45, b: 46, y: 1010}, {a: 47, b: 49, y: 1010}, {a: 50, b: 52, y: 1010},
  {a: 55, b: 57, y: 1130}, {a: 58, b: 62, y: 1130},
  {a: 63, b: 66, y: 1205, hasta: 67},
  {a: 79, b: 81, y: 905}, {a: 82, b: 84, y: 905},
];
const SECC = [...T, DUR];
const chunkEnd = (i: number) => {
  const c = CHUNKS[i];
  const next = i + 1 < CHUNKS.length ? ws(CHUNKS[i + 1].a) - 0.04 : 99;
  const sec = SECC.find((s) => s > ws(c.a) + 0.01)!;
  return Math.min(next, we(c.b) + 0.45, c.hasta !== undefined ? ws(c.hasta) - 0.05 : 99, sec);
};
const Subs: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const i = CHUNKS.findIndex((c, k) => t >= ws(c.a) - 0.05 && t < chunkEnd(k));
  if (i < 0) return null;
  const c = CHUNKS[i];
  const p = Math.min(1, (t - (ws(c.a) - 0.05)) * FPS / 3);
  const words = [];
  for (let k = c.a; k <= c.b; k++) {
    const on = t >= ws(k) - 0.02 && (k === c.b || t < ws(k + 1) - 0.02);
    words.push(
      <span key={k} style={{display: 'inline-block', margin: '0 13px',
        ...(on ? {color: VERDE, WebkitTextStroke: '9px white', paintOrder: 'stroke fill', transform: 'scale(1.06)', textShadow: '0 2px 4px rgba(0,0,0,.35), 0 4px 16px rgba(0,0,0,.35)'} : {color: 'white'})}}>
        {WORDS[k][0]}
      </span>,
    );
  }
  return (
    <AbsoluteFill>
      <Halo y={c.y} a={0.5} />
      <div style={{position: 'absolute', left: 90, width: 900, top: c.y - 40, textAlign: 'center',
        fontFamily: MS, fontWeight: 600, fontSize: 52, lineHeight: '76px', whiteSpace: 'nowrap', textShadow: SOMBRA,
        opacity: p, transform: `translateY(${(1 - p) * 14}px)`}}>
        {words}
      </div>
    </AbsoluteFill>
  );
};

// ---------- entrada de líneas ----------
const useIn = (at: number, kind: 'pop' | 'up') => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const p = spring({frame: frame - Math.round(at * fps), fps, config: {damping: 13, stiffness: 190}});
  return {opacity: Math.min(1, Math.max(0, p * 1.6)),
    transform: kind === 'pop' ? `scale(${interpolate(p, [0, 1], [0.5, 1])})` : `translateY(${interpolate(p, [0, 1], [40, 0])}px)`};
};
const Line: React.FC<{at: number; kind?: 'pop' | 'up'; y: number; children: React.ReactNode}> = ({at, kind = 'up', y, children}) => {
  const st = useIn(at, kind);
  const t = useCurrentFrame() / FPS;
  if (t < at - 0.01) return null;
  return <div style={{position: 'absolute', left: 0, width: 1080, top: y, textAlign: 'center', ...st}}>{children}</div>;
};

const Destello: React.FC<{at: number; y: number}> = ({at, y}) => {
  const t = useCurrentFrame() / FPS;
  const o = interpolate(t, [at - 0.1, at + 0.08, at + 0.6], [0, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  const x = interpolate(t, [at - 0.1, at + 0.6], [1150, 650]);
  return <AbsoluteFill style={{mixBlendMode: 'screen', opacity: o,
    background: `radial-gradient(circle 700px at ${x}px ${y}px, rgba(255,190,110,0.95), rgba(255,140,60,0.45) 45%, rgba(255,120,40,0) 75%)`}} />;
};

// ---------- hook ----------
const HookTitles: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < ws(6) - 0.08 || t >= T1) return null;
  const uno = t < ws(10) - 0.03;
  const strike = interpolate(t, [ws(9) + 0.1, ws(9) + 0.34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      {uno ? (
        <>
          <Halo y={760} w={940} h={300} a={0.55} />
          <Line at={ws(6) - 0.05} y={665}><span style={light(58)}>no es</span></Line>
          <Line at={ws(8) - 0.05} kind="pop" y={738}>
            <span style={{...verde(84), position: 'relative', display: 'inline-block'}}>
              CUÁNTO SALE
              <span style={{position: 'absolute', left: -14, top: '48%', height: 14, borderRadius: 7, width: `calc(${strike * 100}% + 28px)`,
                background: MOSTAZA, boxShadow: '0 0 0 4px white', opacity: strike > 0 ? 1 : 0}} />
            </span>
          </Line>
        </>
      ) : (
        <>
          <Halo y={880} w={980} h={440} a={0.55} />
          <Line at={ws(10) - 0.04} y={722}><span style={light(54)}>sino</span></Line>
          <Line at={ws(11) - 0.05} kind="pop" y={790}><span style={verde(108)}>¿CUÁNDO</span></Line>
          <Line at={ws(11) + 0.03} kind="pop" y={905}><span style={verde(108)}>ME MUDO?</span></Line>
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------- "no hay una sola respuesta" ----------
const UnaSola: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < T1 || t >= T2) return null;
  return (
    <AbsoluteFill>
      <Halo y={950} w={960} h={420} a={0.5} />
      <Line at={ws(15) - 0.05} y={800}><span style={light(62)}>no hay</span></Line>
      <Line at={ws(17) - 0.25} kind="pop" y={875}><span style={verde(124)}>UNA SOLA</span></Line>
      <Line at={ws(17) - 0.02} y={1012}><span style={bold(66)}>respuesta</span></Line>
    </AbsoluteFill>
  );
};

// ---------- línea de etapas ----------
const PW = 720, PH = 290, PY = 762, TY = 158;
const NODOS = [110, 360, 610];
const Icono: React.FC<{n: number; on: number; g: number}> = ({n, on, g}) => {
  const col = on > 0.5 ? CREMA : 'rgba(242,235,199,0.42)';
  const acc = on > 0.5 ? MOSTAZA : 'rgba(205,188,49,0.42)';
  if (n === 0) return ( // fundación con hierros
    <g transform={`scale(${g})`}>
      <rect x={-52} y={22} width={104} height={12} rx={3} fill={col} />
      {[-40, -14, 14, 40].map((x) => (
        <g key={x}><rect x={x - 5} y={-8} width={10} height={32} fill={acc} /><line x1={x - 3} y1={-20} x2={x - 3} y2={-8} stroke={col} strokeWidth={3} /><line x1={x + 3} y1={-20} x2={x + 3} y2={-8} stroke={col} strokeWidth={3} /></g>
      ))}
    </g>
  );
  if (n === 1) return ( // obra con grúa
    <g transform={`scale(${g})`}>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-34} y={20 - i * 16} width={68} height={12} rx={2} fill={col} />)}
      {[-28, 0, 28].map((x) => <rect key={x} x={x - 3} y={-28} width={6} height={60} fill={col} opacity={0.75} />)}
      <rect x={38} y={-44} width={6} height={78} fill={acc} />
      <rect x={-8} y={-46} width={78} height={6} fill={acc} />
      <line x1={8} y1={-40} x2={8} y2={-24} stroke={acc} strokeWidth={3} />
    </g>
  );
  return ( // edificio terminado con tilde
    <g transform={`scale(${g})`}>
      <rect x={-34} y={-44} width={68} height={78} rx={4} fill={col} />
      {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-26 + c * 20} y={-36 + r * 17} width={12} height={10} fill="#2E443B" />))}
      <circle cx={36} cy={-40} r={19} fill={acc} stroke="white" strokeWidth={3} />
      <path d="M 27 -40 L 34 -33 L 46 -48" stroke="#22322B" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};
const LABELS = [['RECIÉN', 'ARRANCA'], ['OBRA', 'AVANZADA'], ['ENTREGA', '']];

const Etapas: React.FC<{a: number; b: number; pops: number; prog: (t: number) => number; on: (t: number) => number[]}> = ({a, b, pops, prog, on}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t < a || t >= b) return null;
  const ent = spring({frame: frame - Math.round(a * fps), fps, config: {damping: 15, stiffness: 170}});
  const sal = interpolate(t, [b - 0.14, b], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const p = prog(t);
  const act = on(t);
  const x0 = NODOS[0], x2 = NODOS[2];
  return (
    <div style={{position: 'absolute', left: 540 - PW / 2, top: PY, width: PW, height: PH, opacity: Math.min(1, ent * 1.5) * sal,
      transform: `translateY(${(1 - ent) * 46}px) scale(${interpolate(ent, [0, 1], [0.92, 1])})`, transformOrigin: '50% 50%'}}>
      <svg width={PW} height={PH} style={{position: 'absolute', overflow: 'visible'}}>
        <rect x={0} y={0} width={PW} height={PH} rx={34} fill={OSCURO} stroke={CREMA} strokeWidth={2} />
        <line x1={x0} y1={TY} x2={x2} y2={TY} stroke="rgba(242,235,199,0.3)" strokeWidth={8} strokeLinecap="round" />
        {p > 0 && <line x1={x0} y1={TY} x2={x0 + (x2 - x0) * p} y2={TY} stroke={MOSTAZA} strokeWidth={8} strokeLinecap="round" />}
        {NODOS.map((x, i) => {
          const q = spring({frame: frame - Math.round((pops + i * 0.18) * fps), fps, config: {damping: 11, stiffness: 210}});
          const hit = act[i] > 0.5 ? 1 : 0;
          return (
            <g key={i} opacity={Math.min(1, q * 1.6)}>
              <g transform={`translate(${x} 78)`}><Icono n={i} on={act[i]} g={q} /></g>
              <circle cx={x} cy={TY} r={(hit ? 19 : 14) * q} fill={hit ? MOSTAZA : '#3A5248'} stroke="white" strokeWidth={5} />
            </g>
          );
        })}
      </svg>
      {NODOS.map((x, i) => {
        const q = interpolate(t, [pops + i * 0.18 + 0.05, pops + i * 0.18 + 0.25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div key={i} style={{position: 'absolute', left: x - 115, width: 230, top: 192, textAlign: 'center', opacity: q,
            fontFamily: MS, fontWeight: act[i] > 0.5 ? 900 : 600, fontSize: 31, lineHeight: '36px', letterSpacing: '-0.01em', color: act[i] > 0.5 ? CREMA : 'rgba(255,255,255,0.72)'}}>
            {LABELS[i][0]}<br />{LABELS[i][1]}
          </div>
        );
      })}
    </div>
  );
};

const ramp = (t: number, a: number, b: number, v0: number, v1: number) =>
  interpolate(t, [a, b], [v0, v1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

const EtapasObra: React.FC = () => (
  <Etapas a={ws(20) - 0.05} b={T5} pops={ws(23) - 0.05}
    prog={(t) => ramp(t, ws(40), ws(43) + 0.1, 0, 0.5)}
    on={(t) => [t >= ws(33) - 0.05 && t < ws(43) ? 1 : 0, t >= ws(43) ? 1 : 0, 0]} />
);
const scan = (t: number) => ramp(t, ws(58), we(62) - 0.05, 0, 1);
const EtapasRespuesta: React.FC = () => (
  <Etapas a={ws(53) + 0.2} b={T7} pops={ws(53) + 0.25}
    prog={scan}
    on={(t) => { const s = scan(t); return t < ws(58) ? [0, 0, 0] : [s < 0.25 ? 1 : 0, s >= 0.25 && s < 0.75 ? 1 : 0, s >= 0.75 ? 1 : 0]; }} />
);
const LoPrimero: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < T6 || t >= T7) return null;
  return (
    <AbsoluteFill>
      <Halo y={680} w={900} h={270} a={0.5} />
      <Line at={ws(53) - 0.05} kind="pop" y={620}><span style={degrade(122)}>lo primero</span></Line>
    </AbsoluteFill>
  );
};

// ---------- chat: la pregunta del hook ----------
const Chat: React.FC = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t < ws(47) - 0.1 || t >= T6) return null;
  const a0 = ws(47) - 0.08;
  const p = spring({frame: frame - Math.round(a0 * fps), fps, config: {damping: 12, stiffness: 200}});
  const texto = t >= ws(49) - 0.05;
  const q = spring({frame: frame - Math.round((ws(49) - 0.05) * fps), fps, config: {damping: 12, stiffness: 220}});
  const W = 640, H = 142;
  return (
    <div style={{position: 'absolute', left: 540 - W / 2, top: 780, width: W, height: H, opacity: Math.min(1, p * 1.6),
      transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`, transformOrigin: '90% 100%'}}>
      <svg width={W} height={H + 26} style={{position: 'absolute', overflow: 'visible'}}>
        <path d={`M 40 0 H ${W - 40} A 40 40 0 0 1 ${W} 40 V ${H - 40} A 40 40 0 0 1 ${W - 40} ${H} H ${W - 8} L ${W + 2} ${H + 24} L ${W - 74} ${H} H 40 A 40 40 0 0 1 0 ${H - 40} V 40 A 40 40 0 0 1 40 0 Z`}
          fill={CREMA} stroke="white" strokeWidth={4} />
      </svg>
      {!texto ? (
        <div style={{position: 'absolute', left: 0, width: W, top: 0, height: H, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 26, height: 26, borderRadius: 13, background: '#3A5248',
              transform: `translateY(${Math.sin(t * 13 - i * 0.9) * -9}px)`}} />
          ))}
        </div>
      ) : (
        <div style={{position: 'absolute', left: 0, width: W, top: 0, height: H, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: MS, fontWeight: 700, fontSize: 57, letterSpacing: '-0.03em', color: '#22322B', opacity: Math.min(1, q * 1.6),
          transform: `scale(${interpolate(q, [0, 1], [0.8, 1])})`}}>
          ¿Cuándo me mudo?
        </div>
      )}
    </div>
  );
};

// ---------- calendario: fecha estimada de entrega ----------
const CW = 640, CH = 640, CY = 545, COLS = 7, ROWS = 4;
const Calendario: React.FC = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t < T7 || t >= T8) return null;
  const a0 = ws(63) - 0.05;
  const p = spring({frame: frame - Math.round(a0 * fps), fps, config: {damping: 13, stiffness: 180}});
  const tHit = ws(70) - 0.04;
  const sal = interpolate(t, [T8 - 0.12, T8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const CELL = 62, GAP = 11, GW = COLS * CELL + (COLS - 1) * GAP, gx = (CW - GW) / 2, gy = 104;
  const TR = 2, TC = 4; // casillero destino (sin número: no decimos ninguna fecha)
  const total = TR * COLS + TC;
  const barrido = ramp(t, ws(67), tHit, 0, total + 0.999);
  const hit = spring({frame: frame - Math.round(tHit * fps), fps, config: {damping: 10, stiffness: 220}});
  const tx = gx + TC * (CELL + GAP) + CELL / 2, ty = gy + TR * (CELL + GAP) + CELL / 2;
  const R = 48, L = 2 * Math.PI * R;
  const draw = ramp(t, tHit, tHit + 0.3, 0, 1);
  return (
    <div style={{position: 'absolute', left: 540 - CW / 2, top: CY, width: CW, height: CH, opacity: Math.min(1, p * 1.5) * sal,
      transform: `translateY(${(1 - p) * 60}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`, transformOrigin: '50% 50%'}}>
      <svg width={CW} height={CH} style={{position: 'absolute', overflow: 'visible'}}>
        <rect x={0} y={0} width={CW} height={CH} rx={34} fill={OSCURO} stroke={CREMA} strokeWidth={2} />
        <path d={`M 2 72 V 34 A 32 32 0 0 1 34 2 H ${CW - 34} A 32 32 0 0 1 ${CW - 2} 34 V 72 Z`} fill={VERDE} />
        {[150, CW - 150].map((x) => <rect key={x} x={x - 9} y={-16} width={18} height={50} rx={9} fill={CREMA} stroke="#22322B" strokeWidth={3} />)}
        {Array.from({length: ROWS}, (_, r) => Array.from({length: COLS}, (_, c) => {
          const i = r * COLS + c;
          const pasado = barrido > 0 && i < barrido && i < total;
          const destino = i === total;
          return <rect key={i} x={gx + c * (CELL + GAP)} y={gy + r * (CELL + GAP)} width={CELL} height={CELL} rx={12}
            fill={destino && t >= tHit ? MOSTAZA : pasado ? 'rgba(242,235,199,0.48)' : 'rgba(242,235,199,0.14)'} />;
        }))}
        {t >= tHit && <g transform={`translate(${tx} ${ty}) scale(${hit})`}>
          <circle r={R} fill="none" stroke="white" strokeWidth={7} strokeDasharray={`${L * draw} ${L}`} strokeLinecap="round" transform="rotate(-90)" />
          <path d="M -15 2 L -4 13 L 17 -12" stroke="#22322B" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>}
      </svg>
      <div style={{position: 'absolute', left: 0, width: CW, top: 432, textAlign: 'center'}}>
        {t >= ws(67) - 0.05 && <div style={{...useInStyle(frame, ws(67) - 0.05, fps), ...light(52)}}>fecha <b style={{fontWeight: 700}}>estimada</b></div>}
      </div>
      <div style={{position: 'absolute', left: 0, width: CW, top: 490, textAlign: 'center'}}>
        {t >= tHit && <div style={useInStyle(frame, tHit, fps, true)}><span style={{...degrade(82), whiteSpace: 'nowrap'}}>DE ENTREGA</span></div>}
      </div>
      <div style={{position: 'absolute', left: 0, width: CW, top: 588, textAlign: 'center'}}>
        {t >= ws(71) - 0.05 && <div style={{...useInStyle(frame, ws(71) - 0.05, fps), ...light(40)}}>de ese proyecto</div>}
      </div>
    </div>
  );
};
function useInStyle(frame: number, at: number, fps: number, pop = false): React.CSSProperties {
  const p = spring({frame: frame - Math.round(at * fps), fps, config: {damping: 13, stiffness: 190}});
  return {opacity: Math.min(1, Math.max(0, p * 1.6)), transform: pop ? `scale(${interpolate(p, [0, 1], [0.5, 1])})` : `translateY(${interpolate(p, [0, 1], [30, 0])}px)`};
}

// ---------- CTA ----------
const CtaTitle: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < T8 || t >= T_PUNCH) return null;
  return (
    <AbsoluteFill>
      <Halo y={1000} w={940} h={360} a={0.55} />
      <Line at={ws(74) - 0.04} kind="pop" y={884}><span style={verde(104)}>CONTANOS</span></Line>
      <Line at={ws(75) - 0.05} y={1006}><span style={light(50)}>para cuándo necesitás</span></Line>
      <Line at={ws(77) - 0.05} y={1066}><span style={bold(58)}>mudarte</span></Line>
    </AbsoluteFill>
  );
};

const Guias: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, outline: '3px dashed rgba(255,0,0,.8)'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'rgba(0,255,255,.6)'}} />
  </AbsoluteFill>
);

export const REB1111: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{background: 'black'}}>
    <WhipFilters />
    <Sequence durationInFrames={F[0]}><Hook /></Sequence>
    {CLIPS.map((c) => (
      <Sequence key={c[0]} from={c[1]} durationInFrames={c[2] - c[1]}><Broll clip={c} /></Sequence>
    ))}
    <Sequence from={F[7]}><Cta /></Sequence>
    <EtapasObra />
    <EtapasRespuesta />
    <LoPrimero />
    <Chat />
    <Calendario />
    <UnaSola />
    <Subs />
    <HookTitles />
    <CtaTitle />
    <Destello at={ws(11)} y={880} />
    <Destello at={ws(17)} y={930} />
    <Destello at={ws(70)} y={1080} />
    {guias && <Guias />}
  </AbsoluteFill>
);
