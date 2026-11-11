// Plantilla del ISM 06-10 (aprobado 2026-11-11). Necesita data.json (segs + ojos) y subs.json; ver SKILL §4 y referencia H.
// ISM 06-10 "El gasto que nadie te explica" — ACABADO.
// Sistema de Isledys (skill isledys-hernandez-brand §4): golpes crema con glow y barra dorada, subtítulos chicos en pastilla navy
// (blusa pied-de-poule), azul Pioneer / celeste / dorado / crema, Bodoni URW + Montserrat.
// Motion: M1 down payment + gastos de cierre (azul), M2 rango 2 %–5 % del precio (su plano desenfocado), M3 recibo de gastos de cierre (celeste).
// Audio: se mezcla aparte (mezcla.py) y se muxea.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import data from './data.json';
import SUBS from './subs.json';
import {Logos} from '../ism/Logos';
import {TituloBarra} from '../ism/TituloBarra';

export const FPS = 30;
export const ISM0610_FRAMES = 821;
const f = (s: number) => Math.round(s * FPS);
const AZUL = '#073FA7', CELESTE = '#CDE5F4', DORADO = '#E2A407', CREMA = '#F3E3A9', HUESO = '#F5F5F0';
const MON = 'Montserrat', BOD = 'Bodoni URW';
const GLOW = '0 0 6px rgba(226,164,7,0.95), 0 0 18px rgba(226,164,7,0.75), 0 0 34px rgba(226,164,7,0.4)';
const SOMBRA = '0 2px 10px rgba(0,10,40,0.65), 0 0 2px rgba(0,10,40,0.6)';
const ORO = `linear-gradient(180deg, ${CREMA} 0%, ${DORADO} 55%, #B07D05 100%)`;
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const FONTS: [string, string, string, string][] = [
  [MON, 'Montserrat-Medium.ttf', '500', 'normal'], [MON, 'Montserrat-SemiBold.ttf', '600', 'normal'],
  [MON, 'Montserrat-Bold.ttf', '700', 'normal'], [MON, 'Montserrat-Black.ttf', '900', 'normal'],
  [MON, 'Montserrat-BlackItalic.ttf', '900', 'italic'], [MON, 'Montserrat-BoldItalic.ttf', '700', 'italic'],
  [BOD, 'BodoniURW-BolObl.otf', '700', 'italic'], [BOD, 'BodoniURW-Bol.otf', '700', 'normal'], [BOD, 'BodoniURW-Med.otf', '500', 'normal'],
  [BOD, 'BodoniURW-RegObl.otf', '400', 'italic'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([fam, file, weight, style]) =>
  new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight, style}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

// ---------- tiempos (s de salida) ----------
const M1 = [4.54, 8.45], M2 = [8.45, 11.20], M3 = [11.20, 15.78];
const BR1 = [17.03, 19.25], BR2 = [20.55, 22.43], BR3 = [22.43, 24.48];
const CORTES = [2.88, 15.78, 17.03, 19.25, 20.55, 22.43, 24.48]; // zoom-blur
const LEAKS = [4.54, 8.45];

type Seg = {a: number; b: number; o: number};
const SEGS = data.segs as Seg[];
const OJOS = data.ojos as number[][];
const ojo = (t: number): [number, number] => {
  const v = OJOS.filter((r) => Math.abs(r[0] - t) <= 0.3);
  if (!v.length) return [440, 790];
  return [v.reduce((s, r) => s + r[1], 0) / v.length, v.reduce((s, r) => s + r[2], 0) / v.length];
};
const PLANOS: [number, number, number, number][] = [
  [0, 2.88, 1.0, 1.04], [2.88, 4.54, 1.12, 1.14], [4.54, 15.78, 1.0, 1.04],
  [15.78, 19.25, 1.0, 1.03], [19.25, 20.55, 1.12, 1.14], [20.55, 24.48, 1.0, 1.0], [24.48, 27.37, 1.0, 1.05],
];
const srcDe = (s: number) => {
  const seg = SEGS.find((x) => s >= x.o && s < x.o + (x.b - x.a)) ?? SEGS[SEGS.length - 1];
  return {seg, src: seg.a + (s - seg.o)};
};
const encuadre = (s: number) => {
  const p = PLANOS.find(([a, b]) => s >= a && s < b) ?? PLANOS[PLANOS.length - 1];
  const k = interpolate(s, [p[0], p[1]], [p[2], p[3]], {...CL, easing: Easing.inOut(Easing.sin)});
  const [ex, ey] = ojo(srcDe(s).src);
  return {k, ex, ey};
};

const Ella: React.FC = () => {
  const s = useCurrentFrame() / FPS;
  const {k, ex, ey} = encuadre(s);
  const desenf = s >= M2[0] && s < M2[1];
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: 'black'}}>
      {SEGS.map((x, i) => (
        <Sequence key={i} from={f(x.o)} durationInFrames={f(x.o + x.b - x.a) - f(x.o)}>
          <AbsoluteFill style={{transform: `scale(${desenf ? k * 1.08 : k})`, transformOrigin: `${ex}px ${ey}px`,
            filter: desenf ? 'blur(16px) brightness(0.8)' : undefined}}>
            <OffthreadVideo src={staticFile('ism0610/base1080.mp4')} startFrom={f(x.a)} muted />
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const RotoHook: React.FC = () => {
  const s = useCurrentFrame() / FPS;
  const {k, ex, ey} = encuadre(s);
  return (
    <AbsoluteFill style={{transform: `scale(${k})`, transformOrigin: `${ex}px ${ey}px`}}>
      <OffthreadVideo src={staticFile('ism0610/fg_hook.mov')} transparent startFrom={0} muted />
    </AbsoluteFill>
  );
};

const Broll: React.FC<{src: string; dur: number; zoom?: [number, number]}> = ({src, dur, zoom = [1.0, 1.08]}) => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill style={{transform: `scale(${interpolate(g, [0, f(dur)], zoom)})`}}>
      <OffthreadVideo src={staticFile('ism0610/' + src)} muted />
    </AbsoluteFill>
  );
};

const FX: React.FC<{children: React.ReactNode}> = ({children}) => {
  const g = useCurrentFrame();
  let e = 0;
  for (const c of CORTES) e = Math.max(e, 1 - Math.abs(g - f(c) + 0.5) / 3.5);
  e = Math.max(0, e);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + 0.14 * e})`, transformOrigin: '440px 800px', filter: e > 0 ? `blur(${9 * e}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

const Leak: React.FC = () => {
  const g = useCurrentFrame();
  const o = interpolate(g, [0, 4, 12], [0, 0.85, 0], CL);
  const x = interpolate(g, [0, 12], [20, 80]);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', opacity: o,
      background: `radial-gradient(ellipse 70% 55% at ${x}% 40%, rgba(255,190,90,0.95), rgba(226,140,20,0.5) 45%, rgba(0,0,0,0) 75%)`}} />
  );
};

// ---------- subtítulos ----------
type Sub = {s: number; e: number; w: string[]; k: string[]; m: string; y: number | null};
const Subtitulos: React.FC = () => {
  const g = useCurrentFrame();
  const t = g / FPS;
  const b = (SUBS as Sub[]).find((x) => t >= x.s && t < x.e);
  if (!b) return null;
  const d = g - f(b.s);
  const op = interpolate(d, [0, 4], [0, 1], CL), dy = interpolate(d, [0, 4], [14, 0], {...CL, easing: Easing.out(Easing.cubic)});
  const centro = b.m === 'b';
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: centro ? 960 - 40 : (b.y as number), display: 'flex', justifyContent: 'center',
      opacity: op, transform: `translateY(${dy}px)`}}>
      <div style={{fontFamily: MON, fontSize: 52, fontWeight: 500, color: 'white', lineHeight: 1.15, padding: '6px 20px 9px',
        borderRadius: 14, background: 'rgba(7,24,70,0.58)', textShadow: '0 1px 6px rgba(0,0,0,0.35)', whiteSpace: 'nowrap', maxWidth: 720}}>
        {b.w.map((w, i) => (
          <span key={i} style={b.k.includes(w) ? {fontWeight: 900, fontStyle: 'italic'} : undefined}>{w}{i < b.w.length - 1 ? ' ' : ''}</span>
        ))}
      </div>
    </div>
  );
};

const Linea: React.FC<{d: number; top: number; size?: number; children: React.ReactNode; color?: string; sombra?: boolean}> = ({d, top, size = 50, children, color = 'white', sombra = true}) => {
  const g = useCurrentFrame();
  const t = g - d;
  if (t < 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center', opacity: interpolate(t, [0, 5], [0, 1], CL),
      transform: `translateY(${interpolate(t, [0, 6], [16, 0], {...CL, easing: Easing.out(Easing.cubic)})}px)`,
      fontFamily: MON, fontWeight: 600, fontSize: size, color, textShadow: sombra ? SOMBRA : undefined, lineHeight: 1}}>
      {children}
    </div>
  );
};
const Salida: React.FC<{hasta: number; children: React.ReactNode}> = ({hasta, children}) => {
  const g = useCurrentFrame();
  return <AbsoluteFill style={{opacity: interpolate(g, [hasta - 4, hasta], [1, 0], CL)}}>{children}</AbsoluteFill>;
};
const pop = (g: number, d: number, damping = 12, stiffness = 160) => (g >= d ? spring({frame: g - d, fps: FPS, config: {damping, stiffness}}) : 0);

// ---------- hook 1: "cuánto necesitas / para comprar casa" ----------
const Hook1: React.FC = () => {
  const g = useCurrentFrame();
  const d2 = f(1.79);
  const p = pop(g, d2, 13, 150);
  return (
    <Salida hasta={f(2.88)}>
      <Linea d={f(1.06)} top={462} size={50}>cuánto necesitas</Linea>
      {g >= d2 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 528, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.5),
          transform: `scale(${0.85 + 0.15 * p})`}}>
          <div style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 78, color: CREMA, textShadow: GLOW, transform: 'scaleX(0.88)',
            whiteSpace: 'nowrap', lineHeight: 1.05, letterSpacing: '-0.02em'}}>
            para comprar <span style={{fontFamily: MON, fontStyle: 'normal', fontWeight: 900, fontSize: 86, color: AZUL,
              WebkitTextStroke: '8px white', paintOrder: 'stroke fill', textShadow: 'none', letterSpacing: '0'}}>CASA</span>
          </div>
        </div>
      )}
    </Salida>
  );
};

// ---------- M1: no solo es el down payment ----------
const IconoLlave: React.FC<{c?: string; s?: number}> = ({c = 'white', s = 56}) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22 L24 7 L42 22" /><path d="M11 19 v22 h26 v-22" /><rect x="20" y="28" width="8" height="13" />
  </svg>
);
const IconoDoc: React.FC<{c?: string; s?: number}> = ({c = 'white', s = 56}) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5 h17 l8 8 v30 h-25 z" /><path d="M17 21 h14 M17 28 h14 M17 35 h8" />
  </svg>
);
const Check: React.FC<{t: number; s?: number}> = ({t, s = 58}) => {
  const k = spring({frame: t, fps: FPS, config: {damping: 11, stiffness: 160}});
  return (
    <div style={{width: s, height: s, borderRadius: s / 2, background: DORADO, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`, flexShrink: 0}}>
      <svg width={s * 0.58} height={s * 0.58} viewBox="0 0 34 34"><path d="M7 18 l7 7 l13 -15" stroke="white" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
};
const MotionDown: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M1[0]);
  const rel = (s: number) => f(s) - base;
  const ent = interpolate(g, [0, 7], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const c1 = pop(g, rel(5.08) - 2, 13, 140);
  const mas = pop(g, rel(6.17), 10, 200);
  const tc = rel(6.95) - 2;
  const st = g >= tc ? interpolate(g - tc, [0, 6], [1.9, 1], {...CL, easing: Easing.in(Easing.cubic)}) : 0;
  const shake = g >= tc + 6 && g < tc + 14 ? Math.sin((g - tc - 6) * 2.6) * (14 - (g - tc)) * 1.5 : 0;
  const brillo = interpolate(g - tc, [8, 26], [-30, 130], CL);
  const sal = interpolate(g, [f(M1[1]) - base - 5, f(M1[1]) - base], [0, 1], CL);
  return (
    <AbsoluteFill style={{transform: `scale(${(1.12 - 0.12 * ent) * (1 + 0.15 * sal)})`, filter: `blur(${(1 - ent) * 10 + sal * 12}px)`, opacity: 1 - sal}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 48%, #0E55D0 0%, #073FA7 45%, #04245F 100%)'}} />
      <AbsoluteFill style={{opacity: 0.07, background: 'repeating-linear-gradient(135deg, white 0 2px, transparent 2px 26px)'}} />
      <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.4}px)`}}>
        <Linea d={1} top={550} size={50} color={HUESO}>No solo es el</Linea>
        {/* tarjeta 1: down payment */}
        <div style={{position: 'absolute', left: 540 - 320, top: 640, width: 640, height: 170, borderRadius: 24, background: 'white',
          borderBottom: `7px solid ${DORADO}`, boxShadow: '0 16px 36px rgba(0,0,0,0.35)', transform: `scale(${c1})`,
          display: 'flex', alignItems: 'center', padding: '0 30px', boxSizing: 'border-box', gap: 26}}>
          <div style={{width: 96, height: 96, borderRadius: 48, background: AZUL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
            <IconoLlave />
          </div>
          <div style={{flex: 1}}>
            <div style={{fontFamily: MON, fontWeight: 900, fontSize: 58, color: AZUL, lineHeight: 1, letterSpacing: '-0.01em'}}>DOWN PAYMENT</div>
            <div style={{fontFamily: MON, fontWeight: 600, fontSize: 28, color: '#5d7390', marginTop: 8, letterSpacing: '0.04em'}}>el pago inicial</div>
          </div>
          {g >= rel(5.6) && <Check t={g - rel(5.6)} s={60} />}
        </div>
        {/* + también */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 832, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18,
          transform: `scale(${mas})`}}>
          <div style={{width: 74, height: 74, borderRadius: 37, border: `5px solid ${DORADO}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: MON, fontWeight: 900, fontSize: 62, color: CREMA, lineHeight: 1}}>+</div>
          <div style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 400, fontSize: 64, color: HUESO, textShadow: SOMBRA}}>también</div>
        </div>
        {/* tarjeta 2: gastos de cierre (slam) */}
        {g >= tc && (
          <div style={{position: 'absolute', left: 540 - 360, top: 950, width: 720, height: 250, borderRadius: 26, overflow: 'hidden',
            background: 'linear-gradient(180deg, #0A2D78, #04245F)', border: `6px solid ${DORADO}`, boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(226,164,7,0.35)',
            transform: `scale(${st})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: MON, fontWeight: 700, fontSize: 30, letterSpacing: '0.26em', color: CELESTE, marginBottom: 6}}>LOS GASTOS DE</div>
            <div style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 132, color: CREMA, textShadow: GLOW, lineHeight: 1,
              transform: 'scaleX(0.85)', letterSpacing: '-0.03em'}}>CIERRE</div>
            <div style={{position: 'absolute', top: 0, bottom: 0, left: `${brillo}%`, width: '20%', transform: 'skewX(-20deg)',
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.28), rgba(255,255,255,0))'}} />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- M2: entre el 2 % y el 5 % del precio ----------
const Pct: React.FC<{n: string; g: number; d: number}> = ({n, g, d}) => {
  const p = pop(g, d, 9, 200);
  return (
    <div style={{transform: `scale(${p})`, display: 'flex', alignItems: 'baseline'}}>
      <span style={{fontFamily: MON, fontWeight: 900, fontSize: 168, lineHeight: 1.2, background: ORO, WebkitBackgroundClip: 'text', backgroundClip: 'text',
        color: 'transparent', filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.45))', paddingTop: '0.1em', marginTop: '-0.1em'}}>{n}</span>
      <span style={{fontFamily: MON, fontWeight: 900, fontSize: 96, lineHeight: 1.2, background: ORO, WebkitBackgroundClip: 'text', backgroundClip: 'text',
        color: 'transparent', filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.45))'}}>%</span>
    </div>
  );
};
const MotionRango: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M2[0]);
  const rel = (s: number) => f(s) - base;
  const d2 = rel(8.84), d5 = rel(9.20);
  const guion = interpolate(g - d2, [2, 8], [0, 1], CL);
  const track = interpolate(g, [2, 10], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  // relleno del rango: 0 → 2 % (al decir 2) → 5 % (al decir 5); escala 0–10 %
  const v = g < d2 ? 0 : g < d5 ? interpolate(g - d2, [0, 6], [0, 2], CL) : interpolate(g - d5, [0, 8], [2, 5], {...CL, easing: Easing.out(Easing.cubic)});
  const lo = g < d5 ? 0 : interpolate(g - d5, [0, 8], [0, 2], {...CL, easing: Easing.out(Easing.cubic)});
  const W = 640, X0 = 540 - W / 2;
  const casa = pop(g, rel(9.98) - 2, 13, 140);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(4,22,64,0.72)', opacity: interpolate(g, [0, 6], [0, 1], CL)}} />
      <Linea d={1} top={540} size={48} color={HUESO}>que representan entre el</Linea>
      <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
        <Pct n="2" g={g} d={d2} />
        <div style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 400, fontSize: 76, color: HUESO, opacity: guion, textShadow: SOMBRA, margin: '0 6px'}}>y el</div>
        <Pct n="5" g={g} d={d5} />
      </div>
      {/* barra de rango */}
      <div style={{position: 'absolute', left: X0, top: 858, width: W * track, height: 26, borderRadius: 13, background: 'rgba(205,229,244,0.25)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: (lo / 10) * W, width: ((v - lo) / 10) * W, top: 0, bottom: 0, borderRadius: 13,
          background: `linear-gradient(90deg, ${CREMA}, ${DORADO})`, boxShadow: '0 0 18px rgba(226,164,7,0.7)'}} />
      </div>
      {track > 0.99 && [0, 2, 5, 10].map((n) => (
        <div key={n} style={{position: 'absolute', left: X0 + (n / 10) * W - 40, top: 898, width: 80, textAlign: 'center', fontFamily: MON, fontWeight: 600, fontSize: 26,
          color: n === 2 || n === 5 ? CREMA : 'rgba(245,245,240,0.6)', opacity: interpolate(g - 10, [0, 5], [0, 1], CL)}}>{n}%</div>
      ))}
      {/* del precio de la propiedad */}
      <div style={{position: 'absolute', left: 540 - 320, top: 990, width: 640, height: 200, borderRadius: 24, background: CELESTE,
        borderBottom: `7px solid ${DORADO}`, boxShadow: '0 16px 36px rgba(0,0,0,0.4)', transform: `scale(${casa})`,
        display: 'flex', alignItems: 'center', padding: '0 30px', boxSizing: 'border-box', gap: 26}}>
        <div style={{width: 110, height: 110, borderRadius: 55, background: AZUL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          <IconoLlave s={62} />
        </div>
        <div>
          <div style={{fontFamily: MON, fontWeight: 600, fontSize: 36, color: AZUL, lineHeight: 1.1}}>del precio de la</div>
          <div style={{fontFamily: MON, fontWeight: 900, fontStyle: 'italic', fontSize: 54, color: AZUL, lineHeight: 1.05}}>propiedad</div>
          <div style={{fontFamily: MON, fontWeight: 900, fontSize: 40, color: AZUL, marginTop: 4}}>$ <span style={{filter: 'blur(9px)'}}>385,000</span></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- M3: recibo de gastos de cierre ----------
const IcoRecibo: React.FC<{tipo: string}> = ({tipo}) => {
  const st = {stroke: 'white', strokeWidth: 4.5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={40} height={40} viewBox="0 0 48 48">
      {tipo === 'titulo' && <><path d="M12 5 h17 l8 8 v30 h-25 z" {...st} /><circle cx="24" cy="27" r="6" {...st} /><path d="M21 33 l-2 8 l5 -3 l5 3 l-2 -8" {...st} /></>}
      {tipo === 'tasacion' && <><path d="M5 22 L20 9 L35 22" {...st} /><path d="M9 19 v17 h14" {...st} /><circle cx="33" cy="33" r="7" {...st} /><path d="M38 38 l6 6" {...st} /></>}
      {tipo === 'impuestos' && <><path d="M12 5 h24 v38 h-24 z" {...st} /><path d="M18 34 l12 -16" {...st} /><circle cx="19" cy="20" r="3" {...st} /><circle cx="29" cy="32" r="3" {...st} /></>}
      {tipo === 'seguro' && <><path d="M24 5 l16 6 v12 c0 10 -7 17 -16 20 c-9 -3 -16 -10 -16 -20 v-12 z" {...st} /><path d="M17 24 l5 5 l9 -10" {...st} /></>}
      {tipo === 'otros' && <><circle cx="12" cy="24" r="3.5" fill="white" /><circle cx="24" cy="24" r="3.5" fill="white" /><circle cx="36" cy="24" r="3.5" fill="white" /></>}
    </svg>
  );
};
const ITEMS: {tipo: string; txt: string; t: number; m: string}[] = [
  {tipo: 'titulo', txt: 'Título', t: 11.81, m: '1,250'},
  {tipo: 'tasacion', txt: 'Tasación', t: 12.23, m: '650'},
  {tipo: 'impuestos', txt: 'Impuestos', t: 13.43, m: '2,400'},
  {tipo: 'seguro', txt: 'Seguro', t: 13.97, m: '1,800'},
  {tipo: 'otros', txt: 'Otros cargos', t: 14.76, m: '900'},
];
const MotionRecibo: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M3[0]);
  const rel = (s: number) => f(s) - base;
  const cort = interpolate(g, [0, 7], [1920, 0], {...CL, easing: Easing.out(Easing.cubic)});
  const TOP = 620, HEAD = 128, ROW = 92, TOT = 120;
  const papel = pop(g, 3, 14, 150);
  const nRows = ITEMS.filter((x) => g >= rel(x.t) - 2).length;
  const tTot = rel(15.02);
  const conTot = g >= tTot;
  const altoObj = HEAD + nRows * ROW + (conTot ? TOT : 0) + 34;
  // el papel crece suave hacia abajo a medida que se "imprime" cada línea
  let alto = HEAD + 34;
  ITEMS.forEach((x, i) => { alto += interpolate(g, [rel(x.t) - 2, rel(x.t) + 4], [0, ROW], {...CL, easing: Easing.out(Easing.cubic)}); });
  alto += interpolate(g, [tTot, tTot + 6], [0, TOT], {...CL, easing: Easing.out(Easing.cubic)});
  void altoObj;
  const totPop = pop(g, tTot + 3, 9, 200);
  return (
    <AbsoluteFill style={{transform: `translateY(${cort}px)`}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #E6F2FB 0%, #CDE5F4 55%, #A8CAE3 100%)'}} />
      <AbsoluteFill style={{opacity: 0.07, background: `repeating-linear-gradient(135deg, ${AZUL} 0 2px, transparent 2px 28px)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, height: 6, background: DORADO}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1470, height: 6, background: DORADO}} />
      <Linea d={rel(11.26) - 1} top={502} size={46} color={AZUL} sombra={false}>Ahí <b style={{fontWeight: 900, fontStyle: 'italic'}}>entran</b></Linea>
      {/* ranura de la "impresora" */}
      <div style={{position: 'absolute', left: 540 - 360, top: TOP - 18, width: 720, height: 22, borderRadius: 11, background: AZUL, boxShadow: '0 6px 14px rgba(4,36,95,0.35)'}} />
      {/* papel */}
      <div style={{position: 'absolute', left: 540 - 320, top: TOP, width: 640, height: alto * papel, overflow: 'hidden',
        background: 'white', boxShadow: '0 18px 40px rgba(7,40,100,0.28)',
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), 96% 100%, 92% calc(100% - 14px), 88% 100%, 84% calc(100% - 14px), 80% 100%, 76% calc(100% - 14px), 72% 100%, 68% calc(100% - 14px), 64% 100%, 60% calc(100% - 14px), 56% 100%, 52% calc(100% - 14px), 48% 100%, 44% calc(100% - 14px), 40% 100%, 36% calc(100% - 14px), 32% 100%, 28% calc(100% - 14px), 24% 100%, 20% calc(100% - 14px), 16% 100%, 12% calc(100% - 14px), 8% 100%, 4% calc(100% - 14px), 0 100%)'}}>
        <div style={{height: 8, background: DORADO}} />
        <div style={{height: HEAD - 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '3px dashed #9fb4c8', margin: '0 26px'}}>
          <div style={{fontFamily: MON, fontWeight: 700, fontSize: 24, letterSpacing: '0.3em', color: '#5d7390'}}>CLOSING COSTS</div>
          <div style={{fontFamily: MON, fontWeight: 900, fontSize: 48, color: AZUL, lineHeight: 1.1}}>GASTOS DE CIERRE</div>
        </div>
        {ITEMS.map((x, i) => {
          const d = g - (rel(x.t) - 2);
          if (d < 0) return null;
          return (
            <div key={i} style={{height: ROW, display: 'flex', alignItems: 'center', padding: '0 30px', gap: 20, opacity: interpolate(d, [0, 5], [0, 1], CL),
              transform: `translateX(${interpolate(d, [0, 7], [-40, 0], {...CL, easing: Easing.out(Easing.cubic)})}px)`}}>
              <div style={{width: 62, height: 62, borderRadius: 31, background: AZUL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                <IcoRecibo tipo={x.tipo} />
              </div>
              <div style={{fontFamily: MON, fontWeight: 700, fontSize: 40, color: AZUL, whiteSpace: 'nowrap'}}>{x.txt}</div>
              <div style={{flex: 1, borderBottom: '3px dotted #9fb4c8', margin: '0 6px', alignSelf: 'center', transform: 'translateY(10px)'}} />
              <div style={{fontFamily: MON, fontWeight: 900, fontSize: 36, color: AZUL, whiteSpace: 'nowrap'}}>$ <span style={{filter: 'blur(8px)'}}>{x.m}</span></div>
            </div>
          );
        })}
        {conTot && (
          <div style={{height: TOT, margin: '0 26px', borderTop: `4px solid ${AZUL}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontFamily: MON, fontWeight: 900, fontSize: 40, color: AZUL, letterSpacing: '0.06em'}}>TOTAL</div>
            <div style={{transform: `scale(${totPop})`, transformOrigin: 'right center', fontFamily: MON, fontWeight: 900, fontSize: 64, lineHeight: 1.2,
              background: ORO, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 2px 3px rgba(120,80,0,0.35))'}}>
              2% – 5%
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- "el número EXACTO cambia" ----------
const Exacto: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(15.78);
  const p = pop(g, f(16.15) - base, 9, 200);
  return (
    <Salida hasta={f(17.03) - base}>
      <Linea d={1} top={362} size={48}>el número</Linea>
      <div style={{position: 'absolute', left: 0, right: 0, top: 414, textAlign: 'center', transform: `scale(${p})`,
        fontFamily: MON, fontWeight: 900, fontSize: 122, lineHeight: 1, color: AZUL, WebkitTextStroke: '10px white', paintOrder: 'stroke fill',
        filter: 'drop-shadow(0 4px 10px rgba(0,10,40,0.45))'}}>EXACTO</div>
      <Linea d={f(16.53) - base} top={548} size={60}><span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, color: CREMA, textShadow: GLOW, fontSize: 70}}>cambia</span></Linea>
    </Salida>
  );
};

// ---------- "el día DEL CIERRE" sobre la firma ----------
const DelCierre: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 22% at 50% 50%, rgba(4,22,64,0.72), rgba(4,22,64,0) 100%)', opacity: interpolate(g, [0, 5], [0, 1], CL)}} />
      <Linea d={2} top={842} size={50}>el día</Linea>
      <TituloBarra d={f(23.80) - f(23.45) - 5} top={962} size={124}>DEL CIERRE</TituloBarra>
    </AbsoluteFill>
  );
};

// ---------- CTA: GUARDA este video ----------
const Guarda: React.FC = () => {
  const g = useCurrentFrame();
  const p = pop(g, 1, 10, 180);
  const lleno = interpolate(g, [8, 14], [0, 1], CL);
  return (
    <Salida hasta={f(25.37) - f(24.48)}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 418, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, transform: `scale(${p})`}}>
        <svg width={80} height={98} viewBox="0 0 46 56" style={{filter: 'drop-shadow(0 4px 10px rgba(0,10,40,0.5))'}}>
          <path d="M5 4 h36 v48 l-18 -13 l-18 13 z" fill={lleno > 0 ? DORADO : 'none'} fillOpacity={lleno} stroke="white" strokeWidth={4.5} strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: MON, fontWeight: 900, fontSize: 108, lineHeight: 1.2, background: `linear-gradient(180deg, #FFFFFF 0%, ${HUESO} 60%, #DCD8C8 100%)`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 4px 10px rgba(0,10,40,0.55))'}}>GUARDA</div>
      </div>
      <Linea d={f(24.84) - f(24.48)} top={578} size={50}>este <b style={{fontWeight: 900, fontStyle: 'italic'}}>video</b></Linea>
    </Salida>
  );
};

const Pie: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1212, display: 'flex', justifyContent: 'center', opacity: interpolate(g, [0, 6], [0, 1], CL)}}>
      <div style={{fontFamily: MON, fontWeight: 500, fontSize: 28, color: 'white', letterSpacing: '0.04em', background: 'rgba(7,30,80,0.6)', borderRadius: 8, padding: '6px 16px'}}>
        Mortgage Loan Originator NMLS# 1924019
      </div>
    </div>
  );
};

const Q = (a: number, b: number, el: React.ReactNode, k?: string) => <Sequence key={k} from={f(a)} durationInFrames={f(b) - f(a)}>{el}</Sequence>;

export const ISM0610: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    <FX>
      <Ella />
      {Q(BR1[0], BR1[1], <Broll src="br_calc.mp4" dur={BR1[1] - BR1[0]} />)}
      {Q(BR2[0], BR2[1], <Broll src="br_preoc.mp4" dur={BR2[1] - BR2[0]} zoom={[1.04, 1.1]} />)}
      {Q(BR3[0], BR3[1], <Broll src="br_firma.mp4" dur={BR3[1] - BR3[0]} />)}
    </FX>
    {Q(0, 2.88, <Hook1 />)}
    {/* hook 2: "hay un gasto que casi siempre / SE OLVIDA" arriba de la cabeza (sin roto: el editor pidió no tocar la cabeza, 11-11) */}
    {Q(2.88, 4.54, <>
      <Linea d={f(2.93) - f(2.88)} top={484} size={46}>hay un gasto que casi siempre</Linea>
      <TituloBarra d={f(3.50) - f(2.88)} top={608} size={124}>SE OLVIDA</TituloBarra>
    </>)}
    {Q(M2[0], M2[1], <MotionRango />)}
    {Q(M1[0], M1[1] + 0.17, <MotionDown />)}
    {Q(M3[0], M3[1], <MotionRecibo />)}
    {Q(15.78, 17.03, <Exacto />)}
    {Q(23.45, BR3[1], <DelCierre />)}
    {Q(24.48, 25.37, <Guarda />)}
    <Subtitulos />
    {Q(26.37, 27.37, <Pie />)}
    {LEAKS.map((l, i) => Q(l - 0.13, l + 0.3, <Leak />, 'lk' + i))}
    <Logos oscuros={[[f(M1[0]), f(M1[1])], [f(M2[0]), f(M2[1])], [f(BR1[0]), f(BR1[1])]]} />
    {guias && (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid lime'}} />
        <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'red', opacity: 0.6}} />
      </AbsoluteFill>
    )}
  </AbsoluteFill>
);
