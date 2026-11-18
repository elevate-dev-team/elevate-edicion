// Plantilla RSU 01-11 (aprobada 18-11-2026): tomas a cámara con zoom anclado a los ojos, B-roll, whip/zoom-blur, mapa esquemático lavanda, placa con puntos, lista con checks, pastillas Bootzy, subs Anton+Montserrat. data.json sale de build_data_01-11.py.
import React from 'react';
import {
  AbsoluteFill, Easing, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame,
} from 'remotion';
import data from './data.json';

// RSU 01-11 PAUTA Alquiler Dpto a estrenar (Ramiro Suran, Neuquén) — ACABADO (el audio se mezcla aparte y se pega con ffmpeg)
export const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
export const RSU0111_FRAMES = f(data.dur);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const LAV = '#AFA4CF', LILA = '#9E93C3', LILA_C = '#E1DDED', BLANCO_L = '#F9F8FE', LILA_D = '#3B3160';
const AN = 'Anton', MO = 'Montserrat', BZ = 'Bootzy';
const w = (i: number) => (data.w as Record<string, number>)[String(i)];
const MOT = data.mot as unknown as Record<string, [number, number]>;
const TIT = data.tit as unknown as Record<string, [number, number]>;

const FONTS: [string, string, string][] = [
  [AN, 'Anton-Regular.ttf', '400'], [MO, 'Montserrat-Regular.ttf', '400'], [MO, 'Montserrat-Medium.ttf', '500'],
  [MO, 'Montserrat-SemiBold.ttf', '600'], [MO, 'Montserrat-Bold.ttf', '700'], [BZ, 'BootzyTM.ttf', '400'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([fam, file, weight]) =>
  new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

type Toma = [string, number, number, number, number[][], boolean];
type Clip = [string, number, number, number, number];
type Tr = {t0: number; dt: number; ex: number[]; ey: number[]; top: number[]; bot: number[]};
const TOMAS = data.tomas as unknown as Toma[];
const BROLL = data.broll as unknown as Clip[];
const TR = data.track as unknown as Record<string, Tr>;

const zoomAt = (keys: number[][], t: number) => {
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, sa] = keys[i], [b, sb] = keys[i + 1];
    if (t >= a && t <= b && b > a) return sa + (sb - sa) * (0.5 - 0.5 * Math.cos(Math.PI * (t - a) / (b - a)));
  }
  return t >= keys[keys.length - 1][0] ? keys[keys.length - 1][1] : keys[0][1];
};
const trAt = (name: string, srcT: number) => {
  const tr = TR[name];
  const i = Math.max(0, Math.min(tr.ey.length - 1, Math.round((srcT - tr.t0) / tr.dt)));
  return {ex: tr.ex[i], ey: tr.ey[i], top: tr.top[i], bot: tr.bot[i]};
};
// tope de la cabeza en pantalla (con el zoom anclado a los ojos) para la toma activa
const headTop = (t: number) => {
  const tm = TOMAS.find((x) => t >= x[2] && t < x[3]);
  if (!tm) return 600;
  const {ex: _x, ey, top} = trAt(tm[0], tm[1] + t - tm[2]);
  const s = zoomAt(tm[4], t);
  return ey + (top - 18 - ey) * s;
};

// ---------- transiciones: whip en cada cambio de toma de voz, zoom-blur en los cortes de B-roll ----------
const WHIPS = [7.82, 12.93, 16.69, 22.33, 30.60];
const ZBS = [3.95, 5.75, 9.72, 18.10, 19.24, 24.18, 25.75, 27.60, 29.10];
export const CORTES = [...WHIPS, ...ZBS].sort((a, b) => a - b);
const HALF = 3.5;
const whipE = (t: number) => {
  for (let k = 0; k < WHIPS.length; k++) {
    const d = (t - WHIPS[k]) * FPS;
    if (Math.abs(d) < HALF) return {e: 1 - Math.abs(d) / HALF, side: (k % 2 ? -1 : 1) * (d < 0 ? -1 : 1)};
  }
  return {e: 0, side: 0};
};
const zbE = (t: number) => {
  let e = 0;
  for (const c of ZBS) e = Math.max(e, 1 - Math.abs(t - c) * FPS / 3);
  return Math.max(0, e);
};

const Toma: React.FC<{toma: Toma}> = ({toma}) => {
  const frame = useCurrentFrame();
  const [name, srcIn, a, , keys] = toma;
  const t = a + frame / FPS;
  const {ex, ey} = trAt(name, srcIn + frame / FPS);
  const e = zbE(t);
  const s = zoomAt(keys, t) * (1 + 0.22 * e);
  // el hook está a contraluz (ventanal): se levanta la exposición
  const look = name === 'h1263' ? 'brightness(1.16) contrast(1.05) saturate(1.06)' : 'brightness(1.03) saturate(1.04)';
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${ex}px ${ey}px`, filter: `${look}${e > 0 ? ` blur(${10 * e}px)` : ''}`}}>
      <OffthreadVideo src={staticFile(`rsu0111/${name}.mp4`)} startFrom={Math.round(srcIn * FPS)} muted style={{width: 1080, height: 1920}} />
    </AbsoluteFill>
  );
};

const Broll: React.FC<{clip: Clip}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [name, a, b, from, rate] = clip;
  const t = a + frame / FPS;
  const e = zbE(t);
  const s = (1.02 + 0.07 * Math.min(1, (t - a) / (b - a))) * (1 + 0.22 * e);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, filter: `brightness(1.04) saturate(1.05)${e > 0 ? ` blur(${10 * e}px)` : ''}`}}>
      <OffthreadVideo src={staticFile(`rsu0111/${name}.mp4`)} startFrom={Math.round(from * FPS)} playbackRate={rate} muted style={{width: 1080, height: 1920}} />
    </AbsoluteFill>
  );
};

// ---------- estilos ----------
const SOMBRA = '0 2px 3px rgba(40,30,70,0.75), 0 5px 14px rgba(40,30,70,0.55), 0 0 34px rgba(40,30,70,0.4)';
const SOMBRA_F = 'drop-shadow(0 2px 2px rgba(40,30,70,0.7)) drop-shadow(0 6px 14px rgba(40,30,70,0.55)) drop-shadow(0 0 30px rgba(40,30,70,0.4))';
const bz = (size: number, color = 'white'): React.CSSProperties => ({fontFamily: BZ, fontSize: size, color, letterSpacing: '-0.025em', lineHeight: 0.85,
  textTransform: 'uppercase', whiteSpace: 'nowrap'});
const mo = (size: number, weight = 500, color = 'white'): React.CSSProperties => ({fontFamily: MO, fontWeight: weight, fontSize: size, color,
  letterSpacing: '-0.01em', lineHeight: 1, whiteSpace: 'nowrap'});
const centerCol: React.CSSProperties = {display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'};

const useT = () => useCurrentFrame() / FPS;
const popSt = (t: number, at: number, out: number, dy = 26, back = false): React.CSSProperties => {
  const p = interpolate(t, [at, at + 0.24], [0, 1], {...clamp, easing: back ? Easing.out(Easing.back(1.7)) : Easing.out(Easing.cubic)});
  const o = interpolate(t, [out - 0.17, out], [1, 0], clamp);
  if (t < at - 0.001 || t >= out) return {opacity: 0};
  return {opacity: Math.min(1, p * 1.6) * o, transform: `translateY(${(1 - p) * dy}px) scale(${0.92 + 0.08 * p})`};
};
const Pill: React.FC<{children: React.ReactNode; size?: number; bg?: string; color?: string; style?: React.CSSProperties}> = ({children, size = 64, bg = LAV, color = 'white', style}) => (
  <div style={{background: bg, borderRadius: 999, padding: `${size * 0.26}px ${size * 0.55}px ${size * 0.2}px`, boxShadow: '0 10px 26px rgba(40,30,70,0.35)',
    display: 'flex', alignItems: 'center', gap: size * 0.25, ...bz(size, color), ...style}}>{children}</div>
);

// ---------- íconos ----------
const PinIc: React.FC<{s: number; c?: string; c2?: string}> = ({s, c = LAV, c2 = 'white'}) => (
  <svg width={s} height={s * 1.3} viewBox="0 0 40 52"><path d="M20 50 C20 50 4 30 4 18 A16 16 0 0 1 36 18 C36 30 20 50 20 50 Z" fill={c} stroke={c2} strokeWidth={3} />
    <path d="M12 21 L20 14 L28 21 M14 19 V28 H26 V19" fill="none" stroke={c2} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" /></svg>
);
const Sol: React.FC<{s: number; k: number}> = ({s, k}) => (
  <svg width={s} height={s} viewBox="0 0 48 48" style={{transform: `rotate(${40 * k}deg)`}}>
    <circle cx="24" cy="24" r="9" fill="#FFE7A8" />
    {Array.from({length: 8}).map((_, i) => <line key={i} x1="24" y1="5" x2="24" y2="10" stroke="#FFE7A8" strokeWidth={3.5} strokeLinecap="round" transform={`rotate(${i * 45} 24 24)`} />)}
  </svg>
);
const Check: React.FC<{p: number; s?: number}> = ({p, s = 66}) => (
  <div style={{width: s, height: s, borderRadius: 999, flex: 'none', background: `rgba(175,164,207,${0.35 + 0.65 * p})`, border: '3px solid white',
    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(40,30,70,0.35)'}}>
    <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 44 44"><path d="M9 23 L19 32 L35 13" fill="none" stroke="white" strokeWidth={6} strokeLinecap="round"
      strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - p)} /></svg>
  </div>
);
const WhatsApp: React.FC<{s: number}> = ({s}) => (
  <svg width={s} height={s} viewBox="0 0 48 48"><path d="M24 4 A20 20 0 0 0 6.6 33.8 L4 44 L14.5 41.4 A20 20 0 1 0 24 4 Z" fill="white" />
    <path d="M17 14 Q15 14 14.5 16 Q13.5 20 17 25 Q21.5 31 27 33 Q31 34.5 33 32.5 Q34 31 33.5 30 L29.5 28 Q28.5 27.6 28 28.4 L26.6 30 Q22 28 19.8 23.4 L21.3 21.8 Q22 21 21.6 20.2 L19.7 15 Q19.3 14 18.3 14 Z" fill={LAV} /></svg>
);
const Puntos: React.FC<{op?: number; color?: string}> = ({op = 0.22, color = 'white'}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', opacity: op}}>
    <defs><pattern id={`dots${color}`} width="34" height="34" patternUnits="userSpaceOnUse"><circle cx="17" cy="17" r="2.6" fill={color} /></pattern></defs>
    <rect width={1080} height={1920} fill={`url(#dots${color})`} />
  </svg>
);

// ---------- títulos ----------
// tag de ciudad sobre la cabeza en el arranque del hook (convive con los subtítulos)
const TagCiudad: React.FC = () => {
  const t = useT();
  const [a, b] = [0.1, 3.9];
  if (t < a || t >= b) return null;
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, bottom: 1920 - (headTop(t) - 26), display: 'flex', justifyContent: 'center'}}>
      <div style={{...popSt(t, a, b, 18, true)}}>
        <Pill size={44} style={{fontFamily: MO, fontWeight: 700, letterSpacing: '0.04em', fontSize: 34, padding: '12px 26px 12px 18px'}}><PinIc s={30} c="white" c2={LAV} />NEUQUÉN CAPITAL</Pill>
      </div>
    </div>
  );
};
// B-roll del living en el hook: 1 dormitorio · balcón · a estrenar
const Pills: React.FC = () => {
  const t = useT();
  const [a, b] = TIT.pills;
  if (t < a || t >= b) return null;
  const items: [string, number][] = [['1 dormitorio', a], ['con balcón', w(11) - 0.04], ['a estrenar', w(14) - 0.04]];
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: 560, ...centerCol, gap: 22}}>
      {items.map(([txt, at]) => <div key={txt} style={popSt(t, at, b, 30, true)}><Pill size={84}>{txt}</Pill></div>)}
    </div>
  );
};
// precio sobre la cabeza
const Precio: React.FC = () => {
  const t = useT();
  const [a, b] = TIT.precio;
  if (t < a || t >= b) return null;
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, bottom: 1920 - (headTop(t) - 30), ...centerCol, gap: 10}}>
      <div style={{...popSt(t, a, b, 20), ...bz(54), filter: SOMBRA_F}}>alquilalo en</div>
      <div style={popSt(t, w(16) - 0.04, b, 30, true)}><Pill size={118} style={{padding: '30px 58px 22px', letterSpacing: '0.01em'}}>$1.200.000</Pill></div>
    </div>
  );
};
const Edificio: React.FC = () => {
  const t = useT();
  const [a, b] = TIT.edificio;
  if (t < a || t >= b) return null;
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: 640, ...centerCol, gap: 6, filter: SOMBRA_F}}>
      <div style={{...popSt(t, a, b), ...bz(64)}}>un edificio</div>
      <div style={{...popSt(t, w(31) - 0.04, b, 30, true), ...bz(190)}}>nuevo</div>
    </div>
  );
};
const Trio: React.FC = () => {
  const t = useT();
  const [a, b] = TIT.trio;
  if (t < a || t >= b) return null;
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: 470, ...centerCol, gap: 8, filter: SOMBRA_F}}>
      <div style={{...popSt(t, a, b), ...bz(130)}}>moderno</div>
      <div style={{...popSt(t, w(54) - 0.04, b), ...bz(130)}}>cómodo</div>
      <div style={{...popSt(t, w(55) - 0.04, b), display: 'flex', alignItems: 'center', gap: 14}}>
        <span style={bz(62, LILA_C)}>y</span><span style={bz(78)}>bien ubicado</span>
      </div>
    </div>
  );
};
// lista de lo que tiene, se va tildando a medida que lo nombra
const Lista: React.FC = () => {
  const t = useT();
  const [a, b] = TIT.lista;
  if (t < a || t >= b) return null;
  const k = (at: number) => interpolate(t, [at, at + 0.3], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const rows: [string, number][] = [['1 dormitorio', w(60) - 0.04], ['ambiente integrado', w(62) - 0.04], ['balcón', w(66) - 0.04]];
  const out = interpolate(t, [b - 0.17, b], [1, 0], clamp);
  const sol = k(w(69) - 0.04);
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: 420, display: 'flex', justifyContent: 'center', opacity: out}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
        {rows.map(([txt, at], i) => (
          <div key={txt} style={{display: 'flex', alignItems: 'center', gap: 26, ...popSt(t, at, b + 1, 24)}}>
            <Check p={k(at + 0.1)} />
            <span style={{...bz(i === 1 ? 70 : 84), filter: SOMBRA_F}}>{txt}</span>
          </div>
        ))}
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginLeft: 92, ...popSt(t, w(69) - 0.04, b + 1, 20)}}>
          <div style={{filter: 'drop-shadow(0 0 14px rgba(255,220,140,0.8))'}}><Sol s={64} k={sol} /></div>
          <span style={{...mo(46, 600), textShadow: SOMBRA}}>+ luz</span>
          <span style={{...mo(46, 600), textShadow: SOMBRA, ...popSt(t, w(72) - 0.04, b + 1, 16)}}>+ espacio exterior</span>
        </div>
      </div>
    </div>
  );
};
const Centro: React.FC = () => {
  const t = useT();
  const [a, b] = TIT.centro;
  if (t < a || t >= b) return null;
  const pin = interpolate(t, [a, a + 0.35], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.8))});
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: 430, ...centerCol, gap: 10}}>
      <div style={{opacity: Math.min(1, pin * 2), transform: `translateY(${(1 - pin) * -60}px)`, filter: SOMBRA_F}}><PinIc s={84} /></div>
      <div style={{...popSt(t, a + 0.05, b), ...bz(66), filter: SOMBRA_F}}>en pleno</div>
      <div style={{...popSt(t, w(91) - 0.04, b, 30, true), ...bz(150), filter: SOMBRA_F}}>centro</div>
      <div style={{...popSt(t, w(93) - 0.04, b), ...mo(54, 600), textShadow: SOMBRA}}>de Neuquén</div>
    </div>
  );
};
const CTA: React.FC = () => {
  const t = useT();
  const [a] = TIT.cta;
  if (t < a) return null;
  const p = interpolate(t, [a, a + 0.24], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.7))});
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, bottom: 1920 - (headTop(t) - 28), display: 'flex', justifyContent: 'center'}}>
      <div style={{opacity: Math.min(1, p * 1.6), transform: `scale(${0.85 + 0.15 * p})`}}>
        <Pill size={64} style={{padding: '18px 40px 14px 24px'}}><WhatsApp s={62} />escribime</Pill>
      </div>
    </div>
  );
};

// ---------- motion de pantalla completa ----------
// MAPA esquemático: calle Santa María entre Roca y Carlos H. Rodríguez (se dibuja cada calle cuando la nombra)
const Mapa: React.FC = () => {
  const fr = useCurrentFrame();
  const [a, b] = MOT.mapa;
  const t = a + fr / FPS;
  const k = (at: number, d = 0.45) => interpolate(t, [at, at + d], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const sm = k(w(34) - 0.1), ro = k(w(37) - 0.08), ch = k(w(39) - 0.08);
  const pin = interpolate(t, [w(40) - 0.1, w(40) + 0.25], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.8))});
  const ring = interpolate(t, [w(40) + 0.2, w(40) + 0.9], [0, 1], clamp);
  const X = 540, R1 = 520, R2 = 900, PY = 710;
  const road = (x1: number, y1: number, x2: number, y2: number, p: number, wd = 22) => {
    const L = Math.hypot(x2 - x1, y2 - y1);
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={wd} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />;
  };
  const z = 1 + 0.06 * (t - a) / (b - a);
  const lab = (at: number) => popSt(t, at, b + 1, 14);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(80% 60% at 50% 42%, #BFB5DC 0%, ${LAV} 55%, #9A8FC2 100%)`}} />
      <Puntos op={0.18} />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${X}px ${PY}px`}}>
        <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.35}}>
          {[300, 420, 660, 780, 1020].map((y) => <line key={y} x1={60} x2={1020} y1={y} y2={y} stroke="white" strokeWidth={6} />)}
          {[180, 300, 780, 900].map((x) => <line key={x} y1={250} y2={1060} x1={x} x2={x} stroke="white" strokeWidth={6} />)}
        </svg>
        <svg width={1080} height={1920} style={{position: 'absolute'}}>
          <rect x={X - 120} y={R1 + 24} width={240} height={R2 - R1 - 48} rx={22} fill="rgba(255,255,255,0.16)" stroke="white" strokeWidth={3} strokeDasharray="12 10" opacity={pin} />
          {road(X, 250, X, 1060, sm)}
          {road(60, R1, 1020, R1, ro)}
          {road(60, R2, 1020, R2, ch)}
        </svg>
        <div style={{position: 'absolute', left: X + 26, top: 238, ...lab(w(34) - 0.04)}}>
          <span style={{...bz(40, 'white'), display: 'block', transform: 'rotate(90deg)', transformOrigin: 'left top', marginLeft: 40, filter: 'drop-shadow(0 2px 6px rgba(40,30,70,0.4))'}}>santa maría</span>
        </div>
        <div style={{position: 'absolute', left: 90, top: R1 - 70, ...lab(w(37) - 0.04), ...bz(46), filter: 'drop-shadow(0 2px 6px rgba(40,30,70,0.4))'}}>roca</div>
        <div style={{position: 'absolute', left: 90, top: R2 + 30, ...lab(w(39) - 0.04), ...bz(46), filter: 'drop-shadow(0 2px 6px rgba(40,30,70,0.4))'}}>carlos h. rodríguez</div>
        <div style={{position: 'absolute', left: X - 90, top: PY - 90, width: 180, height: 180, borderRadius: 999, border: '4px solid white', opacity: (1 - ring) * (pin > 0 ? 1 : 0),
          transform: `scale(${0.4 + 1.3 * ring})`}} />
        <div style={{position: 'absolute', left: X - 52, top: PY - 132, opacity: Math.min(1, pin * 2), transform: `translateY(${(1 - pin) * -90}px)`,
          filter: 'drop-shadow(0 10px 16px rgba(40,30,70,0.45))'}}><PinIc s={104} c={LILA_D} c2="white" /></div>
      </AbsoluteFill>
      <div style={{position: 'absolute', right: 190, top: 1040, ...mo(24, 500, 'rgba(255,255,255,0.75)')}}>mapa ilustrativo</div>
    </AbsoluteFill>
  );
};
// PLACA: lo estrenás vos
const Placa: React.FC = () => {
  const fr = useCurrentFrame();
  const [a, b] = MOT.placa;
  const t = a + fr / FPS;
  const z = 1 + 0.04 * (t - a) / (b - a);
  const sello = interpolate(t, [w(86) + 0.15, w(86) + 0.4], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(80% 60% at 50% 45%, #BFB5DC 0%, ${LAV} 60%, #9A8FC2 100%)`}} />
      <Puntos op={0.2} />
      <div style={{position: 'absolute', left: 0, width: 1080, top: 690, ...centerCol, gap: 4, transform: `scale(${z})`}}>
        <div style={{...popSt(t, w(84) - 0.04, b + 1), ...bz(100)}}>lo estrenás</div>
        <div style={{...popSt(t, w(86) - 0.04, b + 1, 40, true), ...bz(300), filter: 'drop-shadow(0 10px 24px rgba(40,30,70,0.35))'}}>vos</div>
        <div style={{marginTop: 26, opacity: sello, transform: `scale(${1.6 - 0.6 * sello}) rotate(-6deg)`}}>
          <div style={{border: '5px solid white', borderRadius: 18, padding: '12px 28px 6px', ...bz(52)}}>a estrenar</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
const MOTS: [string, React.FC][] = [['mapa', Mapa], ['placa', Placa]];
const MotionLayer: React.FC<{k: string; C: React.FC}> = ({k, C}) => {
  const fr = useCurrentFrame();
  const t = MOT[k][0] + fr / FPS;
  const e = zbE(t);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + 0.15 * e})`, filter: e > 0 ? `blur(${8 * e}px)` : undefined}}><C /></AbsoluteFill>
  );
};

// ---------- subtítulos: Anton MAYÚSCULA (primera palabra) + Montserrat Regular; entran palabra por palabra ----------
type Sub = {start: number; end: number; y: number; modo: string; words: [string, boolean, number][]};
const Subs: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const b = (data.subs as unknown as Sub[]).find((s) => t >= s.start && t < s.end);
  if (!b) return null;
  const out = interpolate(t, [b.end - 0.11, b.end], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: b.y, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14, opacity: out}}>
      {b.words.map(([wd, anton, at], i) => {
        const p = interpolate(t, [Math.max(at, b.start), Math.max(at, b.start) + 0.07], [0, 1], clamp);
        return (
          <span key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 8}px)`, display: 'inline-block', whiteSpace: 'nowrap',
            ...(anton
              ? {fontFamily: AN, fontSize: 68, color: 'white', letterSpacing: '0.005em', textShadow: `0 0 12px rgba(255,255,255,0.35), ${SOMBRA}`}
              : {fontFamily: MO, fontWeight: 400, fontSize: 48, color: 'white', textShadow: SOMBRA})}}>{wd}</span>
        );
      })}
    </div>
  );
};

const Leak: React.FC = () => {
  const t = useT();
  const c = 30.6;
  const o = interpolate(t, [c - 0.2, c, c + 0.45], [0, 0.55, 0], clamp);
  if (o <= 0) return null;
  return <AbsoluteFill style={{mixBlendMode: 'screen', opacity: o, background: 'radial-gradient(70% 50% at 85% 30%, rgba(255,190,120,1) 0%, rgba(255,140,90,0.5) 40%, rgba(0,0,0,0) 75%)'}} />;
};

const Imagen: React.FC = () => {
  const t = useT();
  const {e, side} = whipE(t);
  const ee = Easing.in(Easing.quad)(e);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{position: 'absolute'}}><filter id="mb"><feGaussianBlur stdDeviation={`${60 * ee} 0`} /></filter></svg>
      <AbsoluteFill style={{transform: `translateX(${side * 300 * ee}px) scale(${1 + 0.6 * ee})`, filter: ee > 0.01 ? 'url(#mb)' : undefined}}>
        {TOMAS.map((tm, i) => (
          <Sequence key={i} from={f(tm[2])} durationInFrames={f(tm[3]) - f(tm[2])}><Toma toma={tm} /></Sequence>
        ))}
        {BROLL.map((c, i) => (
          <Sequence key={i} from={f(c[1])} durationInFrames={f(c[2]) - f(c[1])}><Broll clip={c} /></Sequence>
        ))}
        {MOTS.map(([k, C]) => (
          <Sequence key={k} from={f(MOT[k][0])} durationInFrames={f(MOT[k][1]) - f(MOT[k][0])}><MotionLayer k={k} C={C} /></Sequence>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: 0.22 * e, background: `radial-gradient(80% 60% at ${50 - side * 20}% 45%, ${BLANCO_L} 0%, rgba(249,248,254,0) 100%)`}} />
    </AbsoluteFill>
  );
};

export const RSU0111: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{backgroundColor: LILA_D}}>
    <Imagen />
    <Leak />
    <TagCiudad />
    <Pills />
    <Precio />
    <Edificio />
    <Trio />
    <Lista />
    <Centro />
    <CTA />
    <Subs />
    {guias && <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 980, border: '3px solid lime', boxSizing: 'border-box'}} />}
  </AbsoluteFill>
);
