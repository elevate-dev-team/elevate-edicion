import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import WJ from './words.json';

// REB 07-11 "En la visita, no mires solo el apartamento" — acabado (el audio se mezcla aparte y se pega con ffmpeg)
export const FPS = 30;
export const REB0711_FRAMES = 511;
const DUR = REB0711_FRAMES / FPS;
const VERDE = '#5D8776', MOSTAZA = '#CDBC31', CREMA = '#F2EBC7';
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

// ---------- tramos (s) ----------
const T_SOL = 112 / FPS, T_VEN = 199 / FPS, T_AVE = 228 / FPS, T_MAN = 288 / FPS, T_CTA = 459 / FPS;
const CLIPS: [string, number, number, number][] = [ // archivo, entrada, salida, zoom final
  ['02_sol', T_SOL, T_VEN, 1.08], ['03_ventana', T_VEN, T_AVE, 1.06], ['04_avenida', T_AVE, T_MAN, 1.07], ['05_manzana', T_MAN, T_CTA, 1.1],
];
const OJOS_CTA: [number, number] = [445, 690];

// ---------- transiciones: whip en B-roll, zoom-blur anclado a los ojos al volver a cámara ----------
const CORTES: [number, 'zoom' | 'whip', number, number][] = [
  [T_SOL, 'whip', 540, 960], [T_VEN, 'whip', 540, 960], [T_AVE, 'whip', 540, 960], [T_MAN, 'whip', 540, 960], [T_CTA, 'zoom', ...OJOS_CTA],
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

const Speaker: React.FC<{src: string; t0: number; t1: number; z: [number, number]; o: [number, number]}> = ({src, t0, t1, z, o}) => {
  const frame = useCurrentFrame();
  const t = t0 + frame / FPS;
  const s = interpolate(t, [t0, t1], z, {easing: Easing.inOut(Easing.sin)});
  return (
    <AbsoluteFill style={transStyle(t)}>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${o[0]}px ${o[1]}px`}}>
        <OffthreadVideo src={staticFile(`reb0711/${src}.mp4`)} muted style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Broll: React.FC<{clip: [string, number, number, number]}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [name, a, b, z] = clip;
  const t = a + frame / FPS;
  const s = interpolate(t, [a, b], [1.0, z]);
  return (
    <AbsoluteFill style={transStyle(t)}>
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        <OffthreadVideo src={staticFile(`reb0711/${name}.mp4`)} muted />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- tipografía ----------
const SOMBRA = '0 0 3px rgba(0,0,0,.75), 0 2px 6px rgba(0,0,0,.7), 0 3px 20px rgba(0,0,0,.65), 0 0 40px rgba(0,0,0,.45)';
const verde = (size: number): React.CSSProperties => ({
  fontFamily: MS, fontWeight: 900, fontSize: size, color: VERDE, letterSpacing: '-0.05em', lineHeight: 0.95,
  WebkitTextStroke: '9px white', paintOrder: 'stroke fill', textShadow: '0 4px 18px rgba(0,0,0,.45)',
});
const light = (size: number): React.CSSProperties => ({fontFamily: MS, fontWeight: 300, fontSize: size, color: 'white', textShadow: SOMBRA, lineHeight: 1});

const Halo: React.FC<{y: number; w?: number; h?: number; a?: number; o?: number}> = ({y, w = 760, h = 170, a = 0.42, o = 1}) => (
  <div style={{position: 'absolute', left: 540 - w / 2, top: y - h / 2, width: w, height: h, opacity: o,
    background: `radial-gradient(ellipse at center, rgba(0,0,0,${a}) 0%, rgba(0,0,0,0) 70%)`}} />
);

// ---------- subtítulos karaoke ----------
type Chunk = {a: number; b: number; y: number};
const CHUNKS: Chunk[] = [
  {a: 0, b: 3, y: 850}, {a: 4, b: 5, y: 850},
  {a: 11, b: 14, y: 1200}, {a: 15, b: 18, y: 1200}, {a: 19, b: 22, y: 1200},
  {a: 23, b: 25, y: 1200}, {a: 26, b: 29, y: 1200}, {a: 30, b: 33, y: 1200},
  {a: 34, b: 37, y: 1235}, {a: 38, b: 39, y: 1235}, {a: 40, b: 42, y: 1235}, {a: 43, b: 46, y: 1235}, {a: 47, b: 50, y: 1235},
  {a: 51, b: 52, y: 1235}, {a: 53, b: 55, y: 1235},
];
const SECC = [T_SOL, T_VEN, T_AVE, T_MAN, T_CTA, DUR];
const chunkEnd = (i: number) => {
  const c = CHUNKS[i];
  const next = i + 1 < CHUNKS.length ? ws(CHUNKS[i + 1].a) - 0.04 : 99;
  const sec = SECC.find((s) => s > ws(c.a) + 0.01)!;
  return Math.min(next, we(c.b) + 0.45, c.b === 5 ? ws(6) - 0.06 : sec);
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
      <Halo y={c.y} />
      <div style={{position: 'absolute', left: 180, width: 720, top: c.y - 40, textAlign: 'center',
        fontFamily: MS, fontWeight: 600, fontSize: 54, lineHeight: '76px', whiteSpace: 'nowrap', textShadow: SOMBRA,
        opacity: p, transform: `translateY(${(1 - p) * 14}px)`}}>
        {words}
      </div>
    </AbsoluteFill>
  );
};

// entrada pop / up de una línea de título
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

// destello cálido
const Destello: React.FC<{at: number; y: number}> = ({at, y}) => {
  const t = useCurrentFrame() / FPS;
  const o = interpolate(t, [at - 0.1, at + 0.08, at + 0.6], [0, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  const x = interpolate(t, [at - 0.1, at + 0.6], [1150, 650]);
  return <AbsoluteFill style={{mixBlendMode: 'screen', opacity: o,
    background: `radial-gradient(circle 700px at ${x}px ${y}px, rgba(255,190,110,0.95), rgba(255,140,60,0.45) 45%, rgba(255,120,40,0) 75%)`}} />;
};

// ---------- hook: "no mires solo el / APARTAMENTO" ----------
const HookTitle: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < ws(6) - 0.08 || t >= T_SOL) return null;
  return (
    <AbsoluteFill>
      <Halo y={950} w={900} h={300} a={0.45} />
      <Line at={ws(6) - 0.06} y={850}><span style={light(56)}>no mires <b style={{fontWeight: 700}}>solo</b> el</span></Line>
      <Line at={ws(10) - 0.04} kind="pop" y={918}><span style={verde(86)}>APARTAMENTO</span></Line>
    </AbsoluteFill>
  );
};

// ---------- motion 1: el sol recorriendo el día ----------
const Sol: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < T_SOL || t >= T_VEN) return null;
  const CX = 540, CY = 700, R = 300;
  const ent = interpolate(t, [T_SOL + 0.05, T_SOL + 0.55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const p = interpolate(t, [ws(11), we(22)], [0.06, 0.9], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const ang = Math.PI * (1 - p);
  const sx = CX + R * Math.cos(ang), sy = CY - R * Math.sin(ang);
  const min = Math.round((7 + p * 12) * 2) * 30;
  const hora = `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
  const big = interpolate(t, [ws(20), ws(20) + 0.18], [1, 1.25], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const arcLen = Math.PI * R;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,30,26,0.55) 0%, rgba(20,30,26,0.25) 45%, rgba(0,0,0,0) 60%)', opacity: ent}} />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="sun"><stop offset="0%" stopColor={CREMA} /><stop offset="70%" stopColor={MOSTAZA} /><stop offset="100%" stopColor={MOSTAZA} stopOpacity={0.9} /></radialGradient>
          <radialGradient id="glow"><stop offset="0%" stopColor="#FFD98A" stopOpacity={0.8} /><stop offset="100%" stopColor="#FFD98A" stopOpacity={0} /></radialGradient>
        </defs>
        <line x1={CX - R - 60} y1={CY} x2={CX + R + 60} y2={CY} stroke={CREMA} strokeWidth={3} opacity={0.8 * ent} />
        <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke={CREMA} strokeWidth={5}
          strokeDasharray="4 16" strokeLinecap="round" opacity={0.95}
          style={{strokeDashoffset: 0}} />
        <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke={MOSTAZA} strokeWidth={7}
          strokeLinecap="round" strokeDasharray={`${arcLen * p} ${arcLen}`} opacity={ent} />
        <circle cx={sx} cy={sy} r={120 * ent} fill="url(#glow)" />
        <g transform={`translate(${sx} ${sy}) rotate(${t * 60}) scale(${ent})`}>
          {Array.from({length: 10}, (_, i) => (
            <line key={i} x1={0} y1={-58} x2={0} y2={-74} stroke={CREMA} strokeWidth={6} strokeLinecap="round" transform={`rotate(${i * 36})`} />
          ))}
          <circle r={44} fill="url(#sun)" stroke="white" strokeWidth={4} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: CX - 140, width: 280, top: CY + 30, textAlign: 'center', opacity: ent}}>
        <span style={{display: 'inline-block', transform: `scale(${big})`, background: 'rgba(30,45,40,0.88)', border: `2px solid ${CREMA}`,
          borderRadius: 40, padding: '10px 30px', fontFamily: MS, fontWeight: 700, fontSize: 52, color: 'white', letterSpacing: '0.02em',
          fontVariantNumeric: 'tabular-nums'}}>{hora}</span>
      </div>
      <div style={{position: 'absolute', left: CX - R - 90, top: CY + 14, width: 180, textAlign: 'center', ...light(32), opacity: ent}}>mañana</div>
      <div style={{position: 'absolute', left: CX + R - 90, top: CY + 14, width: 180, textAlign: 'center', ...light(32), opacity: ent}}>tarde</div>
    </AbsoluteFill>
  );
};

// ---------- motion 2: el ruido de la calle ----------
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const Ruido: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const a0 = ws(26) - 0.1;
  if (t < a0 || t >= T_MAN) return null;
  const ent = interpolate(t, [a0, a0 + 0.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const A = interpolate(t, [a0, ws(29), we(29), ws(33)], [0.2, 0.45, 1, 0.85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const N = 25, BW = 16, GAP = 11, CY = 640, total = N * BW + (N - 1) * GAP;
  const x0 = 540 - total / 2;
  const lvl = interpolate(t, [a0, we(29)], [0.15, 0.92], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{opacity: ent}}>
      <div style={{position: 'absolute', left: 540 - 380, top: CY - 230, width: 760, height: 460, borderRadius: 40,
        background: 'rgba(30,45,40,0.80)', border: `2px solid ${CREMA}`}} />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="bar" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor={MOSTAZA} /><stop offset="100%" stopColor={CREMA} /></linearGradient>
        </defs>
        {Array.from({length: N}, (_, i) => {
          const env = 0.35 + 0.65 * Math.sin(Math.PI * (i + 0.5) / N);
          const osc = 0.5 + 0.5 * Math.sin(t * (9 + rnd(i) * 9) + rnd(i + 50) * 6.28);
          const h = 14 + A * env * (60 + 200 * osc);
          return <rect key={i} x={x0 + i * (BW + GAP)} y={CY - 40 - h / 2} width={BW} height={h} rx={BW / 2} fill="url(#bar)" />;
        })}
        {/* medidor */}
        <rect x={x0} y={CY + 130} width={total} height={22} rx={11} fill="rgba(255,255,255,0.18)" />
        <rect x={x0} y={CY + 130} width={total * lvl} height={22} rx={11} fill="url(#bar)" transform="" />
      </svg>
      <div style={{position: 'absolute', left: x0, top: CY + 162, width: total, display: 'flex', justifyContent: 'space-between', ...light(30)}}>
        <span>silencio</span><span style={{fontWeight: 700}}>ruido</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- motion 3: la vuelta a la manzana y lo que tenés cerca ----------
const PS = 660, PX = 540 - PS / 2, PY = 430; // panel
const ST = 54; // ancho de calle
const BL = (PS - 4 * ST) / 3; // bloque
const bx = (c: number) => ST + c * (BL + ST);
const PINES: [number, string, string, number, number][] = [ // palabra, ícono, texto, x, y (en el panel)
  [48, 'bus', 'PARADA', bx(0) + BL - 10, ST / 2 + 0], [52, 'almacen', 'ALMACÉN', bx(2) + BL / 2, bx(1) + BL / 2], [55, 'farmacia', 'FARMACIA', bx(0) + BL / 2, bx(2) + BL / 2 + 10],
];
const Icono: React.FC<{k: string}> = ({k}) => {
  if (k === 'bus') return (<g fill="white"><rect x={-16} y={-17} width={32} height={28} rx={6} /><rect x={-11} y={-12} width={22} height={10} rx={2} fill={VERDE} /><circle cx={-9} cy={14} r={4} /><circle cx={9} cy={14} r={4} /></g>);
  if (k === 'almacen') return (<g fill="none" stroke="white" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round"><path d="M -18 -8 L 18 -8 L 13 14 L -13 14 Z" fill="white" /><path d="M -9 -8 L -3 -20 M 9 -8 L 3 -20" /></g>);
  return (<g fill="white"><rect x={-6} y={-18} width={12} height={36} rx={2} /><rect x={-18} y={-6} width={36} height={12} rx={2} /></g>);
};
const Manzana: React.FC = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t < T_MAN || t >= T_CTA) return null;
  const pin = spring({frame: frame - Math.round((T_MAN + 0.05) * fps), fps, config: {damping: 14, stiffness: 160}});
  // recorrido alrededor del bloque central, por el medio de la calle
  const c0 = bx(1) - ST / 2, c1 = bx(1) + BL + ST / 2;
  const per = 4 * (c1 - c0);
  const p = interpolate(t, [ws(35), we(42)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const d = p * per, L = c1 - c0;
  const [wx, wy] = d < L ? [c0 + d, c0] : d < 2 * L ? [c1, c0 + d - L] : d < 3 * L ? [c1 - (d - 2 * L), c1] : [c0, c1 - (d - 3 * L)];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(0,0,0,0.22)'}} />
      <div style={{position: 'absolute', left: PX, top: PY, width: PS, height: PS, transform: `scale(${interpolate(pin, [0, 1], [0.85, 1])})`,
        opacity: Math.min(1, pin * 1.5), transformOrigin: '50% 50%'}}>
        <svg width={PS} height={PS} style={{position: 'absolute', overflow: 'visible'}}>
          <rect x={0} y={0} width={PS} height={PS} rx={34} fill="rgba(30,45,40,0.86)" stroke={CREMA} strokeWidth={2} />
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
            <rect key={`${r}${c}`} x={bx(c)} y={bx(r)} width={BL} height={BL} rx={12}
              fill={r === 1 && c === 1 ? 'rgba(205,188,49,0.28)' : 'rgba(242,235,199,0.13)'}
              stroke={r === 1 && c === 1 ? MOSTAZA : 'rgba(242,235,199,0.35)'} strokeWidth={r === 1 && c === 1 ? 4 : 1.5} />
          )))}
          {/* casa en el bloque central */}
          <g transform={`translate(${PS / 2} ${PS / 2}) scale(1.5)`}>
            <path d="M -30 2 L 0 -26 L 30 2 L 30 30 L -30 30 Z" fill={CREMA} transform="translate(0 -4)" />
            <rect x={-8} y={8} width={16} height={18} fill={VERDE} />
          </g>
          {/* recorrido */}
          <rect x={c0} y={c0} width={L} height={L} rx={8} fill="none" stroke={MOSTAZA} strokeWidth={6} strokeDasharray="2 14" strokeLinecap="round"
            pathLength={per} style={{strokeDasharray: `${d} ${per}`}} opacity={0.95} />
          {p > 0 && p < 1.001 && <circle cx={wx} cy={wy} r={13} fill={VERDE} stroke="white" strokeWidth={5} />}
          {/* pines */}
          {PINES.map(([wi, ic, txt, x, y]) => {
            const q = spring({frame: frame - Math.round((ws(wi) - 0.06) * fps), fps, config: {damping: 10, stiffness: 200}});
            if (q <= 0.001) return null;
            return (
              <g key={txt} transform={`translate(${x} ${y}) scale(${q})`}>
                <path d="M 0 0 C -10 -18 -36 -34 -36 -62 A 36 36 0 1 1 36 -62 C 36 -34 10 -18 0 0 Z" fill={VERDE} stroke="white" strokeWidth={5} />
                <g transform="translate(0 -62)"><Icono k={ic} /></g>
              </g>
            );
          })}
        </svg>
        {PINES.map(([wi, , txt, x, y]) => {
          const q = interpolate(t, [ws(wi) + 0.05, ws(wi) + 0.25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return <div key={txt} style={{position: 'absolute', left: x - 120, width: 240, top: y + 6, textAlign: 'center', opacity: q,
            fontFamily: MS, fontWeight: 900, fontSize: 30, color: 'white', letterSpacing: '0.02em', textShadow: SOMBRA}}>{txt}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA ----------
const CtaTitle: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < T_CTA) return null;
  return (
    <AbsoluteFill>
      <Halo y={1050} w={900} h={300} a={0.5} />
      <Line at={ws(56) - 0.04} kind="pop" y={958}><span style={verde(98)}>ESCRIBINOS</span></Line>
      <Line at={ws(57) - 0.04} y={1070}><span style={light(54)}>y coordinamos la <b style={{fontWeight: 700}}>visita</b></span></Line>
    </AbsoluteFill>
  );
};

const Guias: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, outline: '3px dashed rgba(255,0,0,.8)'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'rgba(0,255,255,.6)'}} />
  </AbsoluteFill>
);

export const REB0711: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{background: 'black'}}>
    <WhipFilters />
    <Sequence durationInFrames={112}><Speaker src="hook4k" t0={0} t1={T_SOL} z={[1.0, 1.05]} o={[540, 700]} /></Sequence>
    {CLIPS.map((c) => (
      <Sequence key={c[0]} from={Math.round(c[1] * FPS)} durationInFrames={Math.round((c[2] - c[1]) * FPS)}><Broll clip={c} /></Sequence>
    ))}
    <Sequence from={459}><Speaker src="cta4k" t0={T_CTA} t1={DUR} z={[1.0, 1.06]} o={OJOS_CTA} /></Sequence>
    <Sol />
    <Ruido />
    <Manzana />
    <Subs />
    <HookTitle />
    <CtaTitle />
    <Destello at={ws(10)} y={960} />
    {guias && <Guias />}
  </AbsoluteFill>
);
