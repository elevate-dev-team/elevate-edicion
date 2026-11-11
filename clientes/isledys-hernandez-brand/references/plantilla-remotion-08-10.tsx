// ISM 08-10 "Esperar a que bajen las tasas" — ACABADO.
// Sistema de Isledys (skill isledys-hernandez-brand §4): golpes crema con glow y barra dorada, subtítulos chicos en pastilla navy
// (vestido azul con lunares blancos), azul Pioneer / celeste / dorado / crema, Bodoni URW + Montserrat.
// Motion: M1 "no solo la tasa" (azul), M2 balanza de factores (su plano desenfocado), M3 interruptor COMPRAR AHORA / ESPERAR (celeste).
// Audio: se mezcla aparte (mezcla.py) y se muxea.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import data from './data.json';
import SUBS from './subs.json';
import {Logos} from '../ism/Logos';
import {TituloBarra} from '../ism/TituloBarra';

export const FPS = 30;
export const ISM0810_FRAMES = 784;
const f = (s: number) => Math.round(s * FPS);
const AZUL = '#073FA7', CELESTE = '#CDE5F4', DORADO = '#E2A407', CREMA = '#F3E3A9', HUESO = '#F5F5F0';
const MON = 'Montserrat', BOD = 'Bodoni URW';
const GLOW = '0 0 6px rgba(226,164,7,0.95), 0 0 18px rgba(226,164,7,0.75), 0 0 34px rgba(226,164,7,0.4)';
const SOMBRA = '0 2px 10px rgba(0,10,40,0.65), 0 0 2px rgba(0,10,40,0.6)';
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
const M1 = [3.82, 6.85], M2 = [6.85, 10.98], M3 = [13.22, 17.80];
const BR1 = [10.98, 13.22], BR2 = [18.89, 21.25], BR3 = [21.25, 23.80];
const CORTES = [10.98, 17.80, 18.89, 21.25, 23.80]; // zoom-blur
const LEAKS = [3.86, 13.22];

type Seg = {a: number; b: number; o: number};
const SEGS = data.segs as Seg[];
const OJOS = data.ojos as number[][];
const ojo = (t: number): [number, number] => {
  const v = OJOS.filter((r) => Math.abs(r[0] - t) <= 0.3);
  if (!v.length) return [520, 800];
  return [v.reduce((s, r) => s + r[1], 0) / v.length, v.reduce((s, r) => s + r[2], 0) / v.length];
};
const PLANOS: [number, number, number, number][] = [
  [0, 3.82, 1.0, 1.04], [3.82, 8.94, 1.0, 1.03], [8.94, 13.22, 1.0, 1.03],
  [13.22, 18.89, 1.0, 1.05], [18.89, 21.02, 1.0, 1.0], [21.02, 23.80, 1.0, 1.0], [23.80, 26.2, 1.0, 1.0],
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
            <OffthreadVideo src={staticFile('ism0810/base1080.mp4')} startFrom={f(x.a)} muted />
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const Broll: React.FC<{src: string; dur: number; zoom?: [number, number]}> = ({src, dur, zoom = [1.0, 1.08]}) => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill style={{transform: `scale(${interpolate(g, [0, f(dur)], zoom)})`}}>
      <OffthreadVideo src={staticFile('ism0810/' + src)} muted />
    </AbsoluteFill>
  );
};

const FX: React.FC<{children: React.ReactNode}> = ({children}) => {
  const g = useCurrentFrame();
  let e = 0;
  for (const c of CORTES) e = Math.max(e, 1 - Math.abs(g - f(c) + 0.5) / 3.5);
  e = Math.max(0, e);
  const [ex, ey] = ojo(srcDe(g / FPS).src);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + 0.14 * e})`, transformOrigin: `${ex}px ${ey}px`, filter: e > 0 ? `blur(${9 * e}px)` : undefined}}>
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
    <div style={{position: 'absolute', left: 0, right: 0, top: b.y != null ? b.y : 960 - 40, display: 'flex', justifyContent: 'center',
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
const Bod: React.FC<{size: number; children: React.ReactNode; color?: string; glow?: boolean}> = ({size, children, color = CREMA, glow = true}) => (
  <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: size, color, textShadow: glow ? GLOW : undefined, display: 'inline-block',
    transform: 'scaleX(0.88)', letterSpacing: '-0.02em'}}>{children}</span>
);
const Fuerte: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <span style={{fontFamily: MON, fontWeight: 900, fontSize: size, color: AZUL, WebkitTextStroke: `${Math.round(size / 12)}px white`, paintOrder: 'stroke fill',
    filter: 'drop-shadow(0 4px 10px rgba(0,10,40,0.45))', lineHeight: 1}}>{children}</span>
);

// ---------- hook: "¿espero que bajen / LAS TASAS / o compro ahora?" ----------
const Hook: React.FC = () => {
  const g = useCurrentFrame();
  const B0 = f(1.45);
  const dC = f(3.17) - B0;
  const p = pop(g, dC, 10, 190);
  return (
    <>
      <Linea d={f(1.50) - B0} top={404} size={48}>¿espero que bajen</Linea>
      <TituloBarra d={f(2.27) - B0 - 5} top={538} size={126}>LAS TASAS</TituloBarra>
      {g >= dC && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 628, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16,
          opacity: Math.min(1, p * 1.5), transform: `scale(${0.85 + 0.15 * p})`}}>
          <Bod size={64} color={HUESO} glow={false}><span style={{textShadow: SOMBRA}}>o</span></Bod>
          <Fuerte size={72}>COMPRO</Fuerte>
          <Bod size={64} color={HUESO} glow={false}><span style={{textShadow: SOMBRA}}>ahora?</span></Bod>
        </div>
      )}
    </>
  );
};

// ---------- íconos ----------
const st = {stroke: 'white', strokeWidth: 4.5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
const Ico: React.FC<{tipo: string; s?: number; c?: string}> = ({tipo, s = 54, c = 'white'}) => {
  const k = {...st, stroke: c};
  return (
    <svg width={s} height={s} viewBox="0 0 48 48">
      {tipo === 'escudo' && <><path d="M24 5 l16 6 v12 c0 10 -7 17 -16 20 c-9 -3 -16 -10 -16 -20 v-12 z" {...k} /><path d="M17 24 l5 5 l9 -10" {...k} /></>}
      {tipo === 'diana' && <><circle cx="22" cy="26" r="16" {...k} /><circle cx="22" cy="26" r="8" {...k} /><path d="M22 26 L40 8 M34 8 h6 v6" {...k} /></>}
      {tipo === 'calendario' && <><rect x="7" y="10" width="34" height="31" rx="4" {...k} /><path d="M7 19 h34 M16 6 v8 M32 6 v8" {...k} /><path d="M24 24 v13 M20 27 c0 -3 8 -3 8 0 c0 3 -8 3 -8 6 c0 3 8 3 8 0" {...k} strokeWidth={3.5} /></>}
      {tipo === 'casa' && <><path d="M6 22 L24 7 L42 22" {...k} /><path d="M11 19 v22 h26 v-22" {...k} /><rect x="20" y="28" width="8" height="13" {...k} /></>}
      {tipo === 'reloj' && <><circle cx="24" cy="25" r="17" {...k} /><path d="M24 15 v11 l7 5" {...k} /></>}
      {tipo === 'comentario' && <><path d="M8 9 h32 a4 4 0 0 1 4 4 v18 a4 4 0 0 1 -4 4 h-18 l-9 8 v-8 h-5 a4 4 0 0 1 -4 -4 v-18 a4 4 0 0 1 4 -4 z" {...k} /><path d="M15 20 h18 M15 27 h11" {...k} /></>}
    </svg>
  );
};
const Check: React.FC<{t: number; s?: number}> = ({t, s = 58}) => {
  const k = spring({frame: t, fps: FPS, config: {damping: 11, stiffness: 160}});
  return (
    <div style={{width: s, height: s, borderRadius: s / 2, background: DORADO, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`, flexShrink: 0}}>
      <svg width={s * 0.58} height={s * 0.58} viewBox="0 0 34 34"><path d="M7 18 l7 7 l13 -15" stroke="white" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
};

// ---------- M1 (azul): "La respuesta no solo depende de la TASA DE INTERÉS, también depende…" ----------
const MotionTasa: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M1[0]);
  const rel = (s: number) => f(s) - base;
  const ent = interpolate(g, [0, 7], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const card = pop(g, rel(5.55), 13, 140);
  const linea = interpolate(g, [rel(5.75), rel(6.35)], [0, 1], {...CL, easing: Easing.inOut(Easing.cubic)});
  const tach = interpolate(g, [rel(4.62), rel(4.62) + 7], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const mas = pop(g, rel(6.25), 10, 200);
  const sal = interpolate(g, [f(M1[1]) - base - 5, f(M1[1]) - base], [0, 1], CL);
  // línea de la tasa que baja (en la tarjeta)
  const pts = [[0, 20], [60, 30], [120, 24], [180, 48], [240, 44], [300, 70], [360, 66], [420, 92]];
  const n = Math.max(2, Math.ceil(linea * pts.length));
  const path = pts.slice(0, n).map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
  return (
    <AbsoluteFill style={{transform: `scale(${(1.12 - 0.12 * ent) * (1 + 0.15 * sal)})`, filter: `blur(${(1 - ent) * 10 + sal * 12}px)`, opacity: 1 - sal}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 48%, #0E55D0 0%, #073FA7 45%, #04245F 100%)'}} />
      <AbsoluteFill style={{opacity: 0.07, background: 'repeating-linear-gradient(135deg, white 0 2px, transparent 2px 26px)'}} />
      <Linea d={2} top={470} size={60}><Bod size={70} color={HUESO} glow={false}>La respuesta</Bod></Linea>
      <Linea d={rel(4.44)} top={566} size={48} color={HUESO}>
        no{' '}
        <span style={{position: 'relative', display: 'inline-block', fontWeight: 900, fontStyle: 'italic', color: CREMA}}>
          solo
          <span style={{position: 'absolute', left: -4, bottom: -8, height: 5, width: `calc(${tach * 100}% + 8px)`, background: DORADO, borderRadius: 3}} />
        </span>{' '}
        depende de la
      </Linea>
      {/* tarjeta TASA DE INTERÉS */}
      <div style={{position: 'absolute', left: 540 - 340, top: 650, width: 680, height: 290, borderRadius: 26, background: 'white',
        borderBottom: `7px solid ${DORADO}`, boxShadow: '0 16px 36px rgba(0,0,0,0.35)', transform: `scale(${card})`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 34, top: 34, width: 120, height: 120, borderRadius: 60, background: AZUL, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: MON, fontWeight: 900, fontSize: 74, color: 'white', lineHeight: 1}}>%</div>
        <div style={{position: 'absolute', left: 182, top: 44}}>
          <div style={{fontFamily: MON, fontWeight: 700, fontSize: 32, letterSpacing: '0.22em', color: '#5d7390'}}>TASA DE</div>
          <div style={{fontFamily: MON, fontWeight: 900, fontSize: 78, color: AZUL, lineHeight: 1.05, letterSpacing: '-0.01em'}}>INTERÉS</div>
        </div>
        <svg width={460} height={110} viewBox="-10 0 450 110" style={{position: 'absolute', left: 110, top: 168}}>
          <path d="M0 104 H430" stroke="#cfdbe8" strokeWidth={3} />
          <path d={path} stroke={DORADO} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {linea > 0.98 && <path d="M404 78 L422 94 L398 100" stroke={DORADO} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </div>
      {/* + también depende */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 990, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, transform: `scale(${mas})`}}>
        <div style={{width: 74, height: 74, borderRadius: 37, border: `5px solid ${DORADO}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: MON, fontWeight: 900, fontSize: 62, color: CREMA, lineHeight: 1}}>+</div>
        <Bod size={74}>también depende</Bod>
      </div>
    </AbsoluteFill>
  );
};

// ---------- M2 (su plano desenfocado): balanza de factores ----------
const FACTORES: {ico: string; t: number; txt: React.ReactNode}[] = [
  {ico: 'escudo', t: 7.07, txt: <>estabilidad <b style={{fontStyle: 'normal'}}>financiera</b></>},
  {ico: 'diana', t: 8.40, txt: <>tus <b style={{fontStyle: 'normal'}}>objetivos</b></>},
  {ico: 'calendario', t: 9.60, txt: <>el <b style={{fontStyle: 'normal'}}>pago mensual</b></>},
];
const MotionBalanza: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M2[0]);
  const rel = (s: number) => f(s) - base;
  const ent = interpolate(g, [0, 8], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  // ángulo: la TASA sola pesa a la izquierda (−10°); cada factor inclina hacia la derecha
  const ANG = [-10, -3, 4, 11];
  let ang = ANG[0];
  FACTORES.forEach((x, i) => {
    const d = rel(x.t) + 4;
    if (g >= d) ang = ANG[i] + (ANG[i + 1] - ANG[i]) * spring({frame: g - d, fps: FPS, config: {damping: 9, stiffness: 120}});
  });
  const PX = 540, PY = 820, L = 440, CU = 400; // pivote, largo del brazo, largo de las cuerdas
  const rad = (ang * Math.PI) / 180;
  const lx = PX - (L / 2) * Math.cos(rad), ly = PY - (L / 2) * Math.sin(rad);
  const rx = PX + (L / 2) * Math.cos(rad), ry = PY + (L / 2) * Math.sin(rad);
  const PW = 210; // ancho del platillo
  const actual = [...FACTORES].reverse().find((x) => g >= rel(x.t) - 2);
  const iAct = actual ? FACTORES.indexOf(actual) : -1;
  const dAct = actual ? g - (rel(actual.t) - 2) : 0;
  const mon = iAct === 2 ? interpolate(g - rel(10.35), [0, 6], [0, 1], CL) : 0;
  const Platillo: React.FC<{x: number; y: number}> = ({x, y}) => (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <path d={`M${x} ${y - CU} L${x - PW / 2 + 8} ${y} M${x} ${y - CU} L${x + PW / 2 - 8} ${y}`} stroke={CREMA} strokeWidth={3} opacity={0.85} />
      </svg>
      <div style={{position: 'absolute', left: x - PW / 2, top: y, width: PW, height: 22, borderRadius: '0 0 110px 110px / 0 0 22px 22px',
        background: `linear-gradient(180deg, ${CREMA}, ${DORADO})`, boxShadow: '0 8px 18px rgba(0,0,0,0.4)'}} />
    </>
  );
  return (
    <AbsoluteFill style={{opacity: ent}}>
      <AbsoluteFill style={{background: 'rgba(4,22,64,0.72)'}} />
      <Linea d={1} top={372} size={46} color={HUESO}>también depende de</Linea>
      {/* factor actual en grande */}
      {actual && (
        <div key={iAct} style={{position: 'absolute', left: 0, right: 0, top: 440, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 18,
          opacity: interpolate(dAct, [0, 4], [0, 1], CL), transform: `translateY(${interpolate(dAct, [0, 6], [18, 0], {...CL, easing: Easing.out(Easing.cubic)})}px)`}}>
          <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 80, color: CREMA, textShadow: GLOW, whiteSpace: 'nowrap',
            display: 'inline-block', transform: 'scaleX(0.88)', letterSpacing: '-0.02em'}}>{actual.txt}</span>
        </div>
      )}
      {iAct === 2 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 548, textAlign: 'center', opacity: mon, fontFamily: MON, fontWeight: 600, fontSize: 40, color: HUESO, textShadow: SOMBRA}}>
          que puedes manejar · <b style={{fontWeight: 900}}>$ <span style={{filter: 'blur(9px)'}}>2,450</span></b>/mes
        </div>
      )}
      {/* poste y base */}
      <div style={{position: 'absolute', left: PX - 9, top: PY, width: 18, height: 1300 - PY, background: `linear-gradient(90deg, ${DORADO}, ${CREMA}, ${DORADO})`, borderRadius: 9}} />
      <div style={{position: 'absolute', left: PX - 140, top: 1296, width: 280, height: 26, borderRadius: 13, background: `linear-gradient(180deg, ${CREMA}, ${DORADO})`,
        boxShadow: '0 10px 20px rgba(0,0,0,0.4)'}} />
      {/* brazo */}
      <div style={{position: 'absolute', left: PX - L / 2 - 10, top: PY - 8, width: L + 20, height: 16, borderRadius: 8, background: `linear-gradient(180deg, ${CREMA}, ${DORADO})`,
        transform: `rotate(${ang}deg)`, transformOrigin: `${L / 2 + 10}px 8px`, boxShadow: '0 6px 14px rgba(0,0,0,0.35)'}} />
      <div style={{position: 'absolute', left: PX - 24, top: PY - 24, width: 48, height: 48, borderRadius: 24, background: DORADO, border: `5px solid ${CREMA}`}} />
      {/* platillo izquierdo: TASA */}
      <Platillo x={lx} y={ly + CU} />
      <div style={{position: 'absolute', left: lx - 85, top: ly + CU - 128, width: 170, height: 124, borderRadius: 18, background: CELESTE, borderBottom: `6px solid ${DORADO}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.35)'}}>
        <div style={{fontFamily: MON, fontWeight: 900, fontSize: 58, color: AZUL, lineHeight: 1}}>%</div>
        <div style={{fontFamily: MON, fontWeight: 800, fontSize: 26, color: AZUL, letterSpacing: '0.14em', marginTop: 4}}>TASA</div>
      </div>
      {/* platillo derecho: pesas que caen */}
      <Platillo x={rx} y={ry + CU} />
      {FACTORES.map((x, i) => {
        const d = rel(x.t) - 2;
        if (g < d) return null;
        const caida = spring({frame: g - d, fps: FPS, config: {damping: 11, stiffness: 170}});
        const H = 104, y0 = ry + CU - (i + 1) * (H + 6);
        return (
          <div key={i} style={{position: 'absolute', left: rx - 62, top: y0 - (1 - caida) * 360, width: 124, height: H, borderRadius: 18, background: 'white',
            borderBottom: `6px solid ${DORADO}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.35)', opacity: Math.min(1, caida * 3)}}>
            <div style={{width: 76, height: 76, borderRadius: 38, background: AZUL, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Ico tipo={x.ico} s={48} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- M3 (celeste): interruptor COMPRAR AHORA / ESPERAR ----------
const Opcion: React.FC<{top: number; chico: string; grande: string; ico: string; act: number; dEnt: number; dCheck: number}> = ({top, chico, grande, ico, act, dEnt, dCheck}) => {
  const g = useCurrentFrame();
  const p = pop(g, dEnt, 13, 150);
  return (
    <div style={{position: 'absolute', left: 540 - 360, top, width: 720, height: 200, borderRadius: 26, background: 'white', borderBottom: `7px solid ${DORADO}`,
      boxShadow: `0 16px 36px rgba(7,40,100,${0.12 + 0.2 * act})`, transform: `scale(${p * (0.95 + 0.05 * act)})`, opacity: p * (0.42 + 0.58 * act),
      display: 'flex', alignItems: 'center', padding: '0 34px', boxSizing: 'border-box', gap: 26}}>
      <div style={{width: 112, height: 112, borderRadius: 56, background: AZUL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <Ico tipo={ico} s={64} />
      </div>
      <div style={{flex: 1}}>
        <div style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 400, fontSize: 44, color: '#4a6688', lineHeight: 1}}>{chico}</div>
        <div style={{fontFamily: MON, fontWeight: 900, fontSize: 52, color: AZUL, lineHeight: 1.08, letterSpacing: '-0.015em', whiteSpace: 'nowrap'}}>{grande}</div>
      </div>
      {/* check como sello en la esquina de la tarjeta: así el texto usa todo el ancho y no se sale */}
      {g >= dCheck && <div style={{position: 'absolute', right: 16, top: -26}}><Check t={g - dCheck} s={68} /></div>}
    </div>
  );
};
const MotionInterruptor: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M3[0]);
  const rel = (s: number) => f(s) - base;
  const cort = interpolate(g, [0, 7], [1920, 0], {...CL, easing: Easing.out(Easing.cubic)});
  const sw = pop(g, rel(13.60), 13, 150);
  const baja = g >= rel(15.47) ? spring({frame: g - rel(15.47), fps: FPS, config: {damping: 12, stiffness: 170}}) : 0;
  const act1 = 1 - baja, act2 = baja;
  const KY = 742 + 22 + baja * 120; // centro de la perilla: arriba → abajo
  const correcta = pop(g, rel(16.97), 10, 190);
  const sal = interpolate(g, [f(M3[1]) - base - 5, f(M3[1]) - base], [0, 1], CL);
  return (
    <AbsoluteFill style={{transform: `translateY(${cort}px) scale(${1 + 0.15 * sal})`, filter: sal > 0 ? `blur(${sal * 12}px)` : undefined, opacity: 1 - sal}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #E6F2FB 0%, #CDE5F4 55%, #A8CAE3 100%)'}} />
      <AbsoluteFill style={{opacity: 0.07, background: `repeating-linear-gradient(135deg, ${AZUL} 0 2px, transparent 2px 28px)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, height: 6, background: DORADO}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1470, height: 6, background: DORADO}} />
      <Opcion top={480} chico="a veces" grande="COMPRAR AHORA" ico="casa" act={act1} dEnt={rel(13.30)} dCheck={rel(14.98)} />
      {/* interruptor vertical */}
      <div style={{position: 'absolute', left: 540 - 56, top: 712, width: 112, height: 236, borderRadius: 56, background: AZUL, transform: `scale(${sw})`,
        boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.35), 0 8px 18px rgba(7,40,100,0.25)'}}>
        <div style={{position: 'absolute', left: 9, top: KY - 712 - 47, width: 94, height: 94, borderRadius: 47,
          background: `radial-gradient(circle at 40% 35%, ${CREMA}, ${DORADO})`, boxShadow: '0 4px 10px rgba(0,0,0,0.4)'}} />
      </div>
      <Opcion top={980} chico="otras veces" grande="ESPERAR" ico="reloj" act={act2} dEnt={rel(15.58)} dCheck={rel(16.97)} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1214, textAlign: 'center', transform: `scale(${correcta})`}}>
        <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 400, fontSize: 56, color: AZUL}}>es la </span>
        <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 66, color: AZUL}}>jugada correcta</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- "lo que NO tiene sentido" ----------
const NoSentido: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M3[1]);
  const tc = f(18.07) - base - 2;
  const sl = g >= tc ? interpolate(g - tc, [0, 6], [2.0, 1], {...CL, easing: Easing.in(Easing.cubic)}) : 0;
  const shake = g >= tc + 6 && g < tc + 13 ? Math.sin((g - tc - 6) * 2.6) * (13 - (g - tc)) * 1.4 : 0;
  return (
    <>
      <Linea d={f(17.85) - base} top={330} size={48}>lo que</Linea>
      {g >= tc && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 384, textAlign: 'center', transform: `translate(${shake}px, 0) scale(${sl})`}}>
          <Fuerte size={140}>NO</Fuerte>
        </div>
      )}
      <Linea d={f(18.19) - base} top={540} size={60}><span style={{filter: 'drop-shadow(0 2px 6px rgba(0,10,40,0.7))'}}><Bod size={70}>tiene sentido</Bod></span></Linea>
    </>
  );
};

// ---------- "es decidir sin analizar / los NÚMEROS completos" sobre la planilla ----------
const Numeros: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(BR2[0]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 26% at 50% 51%, rgba(4,22,64,0.78), rgba(4,22,64,0) 100%)', opacity: interpolate(g, [0, 5], [0, 1], CL)}} />
      <Linea d={f(18.93) - base} top={800} size={50}>es decidir <b style={{fontWeight: 900, fontStyle: 'italic'}}>sin analizar</b></Linea>
      <Linea d={f(20.18) - base} top={890} size={46}>los</Linea>
      <TituloBarra d={f(20.32) - base - 5} top={1010} size={128}>NÚMEROS</TituloBarra>
      <Linea d={f(20.58) - base} top={1092} size={60}><Bod size={72} color={HUESO}>completos</Bod></Linea>
    </AbsoluteFill>
  );
};

// ---------- CTA: ESCRÍBEME / o comenta la palabra [COMPRAR] ----------
const CTA: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(BR3[1]);
  const p = pop(g, f(23.93) - base - 1, 10, 180);
  const pc = pop(g, f(25.46) - base - 1, 10, 190);
  const brillo = interpolate(g - (f(25.46) - base + 6), [0, 16], [-30, 130], CL);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', transform: `scale(${p})`}}>
        <span style={{fontFamily: MON, fontWeight: 900, fontSize: 92, lineHeight: 1.25, background: `linear-gradient(180deg, #FFFFFF 0%, ${HUESO} 60%, #DCD8C8 100%)`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 4px 10px rgba(0,10,40,0.55))'}}>ESCRÍBEME</span>
      </div>
      <Linea d={f(24.51) - base} top={428} size={44}>o comenta la palabra</Linea>
      {g >= f(25.46) - base - 1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 486, display: 'flex', justifyContent: 'center', transform: `scale(${pc})`}}>
          <div style={{position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 16, padding: '8px 34px 10px 24px', borderRadius: 44,
            background: AZUL, border: `4px solid ${DORADO}`, boxShadow: '0 10px 24px rgba(0,10,40,0.45)'}}>
            <Ico tipo="comentario" s={52} />
            <span style={{fontFamily: MON, fontWeight: 900, fontSize: 52, color: 'white', letterSpacing: '0.02em', lineHeight: 1.1}}>COMPRAR</span>
            <div style={{position: 'absolute', top: 0, bottom: 0, left: `${brillo}%`, width: '22%', transform: 'skewX(-20deg)',
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))'}} />
          </div>
        </div>
      )}
    </>
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
const FIN = ISM0810_FRAMES / FPS;

export const ISM0810: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    <FX>
      <Ella />
      {Q(BR1[0], BR1[1], <Broll src="br_forsale.mp4" dur={BR1[1] - BR1[0]} zoom={[1.0, 1.06]} />)}
      {Q(BR2[0], BR2[1], <Broll src="br_numeros.mp4" dur={BR2[1] - BR2[0]} zoom={[1.02, 1.1]} />)}
      {Q(BR3[0], BR3[1], <Broll src="br_juntos.mp4" dur={BR3[1] - BR3[0]} />)}
    </FX>
    {Q(1.45, M1[0], <Hook />)}
    {Q(M2[0], M2[1], <MotionBalanza />)}
    {Q(M1[0], M1[1] + 0.17, <MotionTasa />)}
    {Q(M3[0], M3[1] + 0.17, <MotionInterruptor />)}
    {Q(M3[1], BR2[0], <NoSentido />)}
    {Q(BR2[0], BR2[1], <Numeros />)}
    {Q(BR3[1], FIN, <CTA />)}
    <Subtitulos />
    {Q(FIN - 1.0, FIN, <Pie />)}
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
