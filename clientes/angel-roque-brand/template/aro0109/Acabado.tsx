import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import track from './track.json';
import {AZUL, BEIGE, DORADO, FPS, MS, NAVY, PLANOS, PLANO_AT, PLANO_COMP, Plano, TS} from './Video';

// ARO 01-09 — acabado: zooms anclados a los ojos, transiciones, light leaks, subtítulos y títulos
const f = (s: number) => Math.round(s * FPS);

// ---------- tracking ----------
type Tr = {t0: number; ex: number[]; ey: number[]; chin: number[]; top: number[]};
const TR = track as unknown as Record<string, Tr>;
const cara = (p: Plano, t: number) => {
  const tr = TR[p[5]];
  const src = p[1] + t - p[2];
  const i = Math.max(0, Math.min(tr.ey.length - 1, Math.round((src - tr.t0) * FPS)));
  return {ex: tr.ex[i], ey: tr.ey[i], chin: tr.chin[i]};
};

// ---------- zoom de los planos de Ángel ([t, escala]; t repetida = punch-in tapado por un zoom-blur) ----------
const ZOOM: number[][] = [
  [0, 1.0], [4.39, 1.05], [4.39, 1.15], [8.33, 1.19], [8.33, 1.0], [12.2, 1.06],
  [24.07, 1.0], [25.96, 1.04], [25.96, 1.14], [30.81, 1.18], [30.81, 1.02], [33.37, 1.07],
  [59.8, 1.0], [62.83, 1.06], [62.83, 1.16], [65.2, 1.2],
];
const zoomAt = (t: number) => {
  for (let i = ZOOM.length - 1; i >= 0; i--) {
    if (t >= ZOOM[i][0]) {
      if (i === ZOOM.length - 1) return ZOOM[i][1];
      const [a, sa] = ZOOM[i], [b, sb] = ZOOM[i + 1];
      return b === a ? sa : sa + (sb - sa) * Easing.inOut(Easing.sin)((t - a) / (b - a));
    }
  }
  return 1;
};

// ---------- transiciones ----------
export const CORTES = [4.39, 8.33, 14.667, 17.633, 21.267, 24.067, 25.96, 30.81, 33.367, 36.767, 39.767, 42.267, 44.633,
  47.033, 50.2, 52.5, 54.4, 56.6, 59.8, 62.83];
export const WHIP = 12.2; // whip con desenfoque al entrar a la casa
export const LEAKS = [17.633, 33.367, 47.033, 59.8];
const zoomBlur = (t: number) => {
  let e = Math.max(0, 1 - t * FPS / 5);
  for (const c of CORTES) e = Math.max(e, 1 - Math.abs(t - c) * FPS / 3.5);
  return Math.max(0, e);
};
const whip = (t: number) => {
  const d = (t - WHIP) * FPS; // frames desde el corte
  if (d < -3.5 || d > 3.5) return {x: 0, b: 0};
  const k = 1 - Math.abs(d) / 3.5;
  return {x: (d < 0 ? -300 : 300) * k, b: 26 * k}; // sale hacia la izquierda, entra desde la derecha
};

const Capa: React.FC<{p: Plano}> = ({p}) => {
  const frame = useCurrentFrame();
  const t = p[2] + frame / FPS;
  const e = zoomBlur(t);
  const w = whip(t);
  let ox = 540, oy = 960, s = 1;
  if (p[4] === 'ang') {
    const c = cara(p, t); ox = c.ex; oy = c.ey; s = zoomAt(t);
  } else if (p[4] === 'broll') {
    s = interpolate(t, [p[2], p[3]], [1.0, 1.07]);
  }
  // el whip se agranda mientras se desplaza para que nunca se vea el borde del cuadro
  s *= (1 + 0.26 * e) * (1 + 0.6 * w.b / 26);
  const blur = 14 * e + w.b;
  return (
    <AbsoluteFill style={{transform: `translateX(${w.x}px) scale(${s})`, transformOrigin: `${ox}px ${oy}px`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined}}>
      {PLANO_COMP(p)}
    </AbsoluteFill>
  );
};

const LightLeak: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let e = 0, c0 = 0;
  for (const c of LEAKS) { const v = 1 - Math.abs(t - c) / 0.5; if (v > e) { e = v; c0 = c; } }
  if (e <= 0) return null;
  const x = interpolate(t - c0, [-0.5, 0.5], [-20, 120]);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', opacity: Math.min(1, e * 1.3),
      background: `radial-gradient(ellipse 55% 70% at ${x}% 35%, rgba(255,186,96,0.95) 0%, rgba(255,140,60,0.5) 35%, rgba(255,110,40,0) 70%),
        radial-gradient(ellipse 40% 50% at ${100 - x * 0.6}% 75%, rgba(255,220,150,0.7) 0%, rgba(255,160,70,0) 70%)`}} />
  );
};

// ---------- posiciones medidas ----------
const chinMax = (a: number, b: number) => {
  let m = 0;
  for (let fr = f(a); fr < f(b); fr++) {
    const t = fr / FPS; const p = PLANO_AT(t);
    if (p[4] !== 'ang') continue;
    const {ey, chin} = cara(p, t);
    m = Math.max(m, ey + (chin - ey) * zoomAt(t));
  }
  return m;
};

// ---------- tipografía ----------
const SOMBRA = '0 2px 10px rgba(16,24,38,0.6), 0 1px 3px rgba(16,24,38,0.55)';
// sobre las paredes blancas de la casa la sombra corta no despega: halo oscuro más ancho
const SOMBRA_CLARO = '0 0 22px rgba(16,24,38,0.7), 0 0 8px rgba(16,24,38,0.6), 0 2px 4px rgba(16,24,38,0.7)';
const SOMBRA_F = 'drop-shadow(0 3px 8px rgba(16,24,38,0.55)) drop-shadow(0 1px 2px rgba(16,24,38,0.5))';
const base = (size: number, weight = 500, italic = false, fam = MS): React.CSSProperties => ({fontFamily: fam, fontWeight: weight,
  fontStyle: italic ? 'italic' : 'normal', fontSize: size, color: 'white', lineHeight: 0.92, letterSpacing: -0.02 * size, whiteSpace: 'nowrap', textShadow: SOMBRA});
type Estilo = 'azul' | 'dorado' | 'blancoAzul' | 'beige' | 'blanco' | 'calado';
const golpe = (size: number, estilo: Estilo, italic = false): React.CSSProperties => {
  const st: React.CSSProperties = {...base(size, 900, italic), lineHeight: 0.85, letterSpacing: -0.03 * size, textShadow: 'none', filter: SOMBRA_F};
  const grad = (g: string): React.CSSProperties => ({backgroundImage: g, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', padding: '0 0.06em'});
  if (estilo === 'azul') return {...st, color: AZUL, WebkitTextStroke: `${Math.max(2, size * 0.025)}px white`, paintOrder: 'stroke fill'};
  if (estilo === 'dorado') return {...st, ...grad('linear-gradient(180deg, #E6BA5C 0%, #D8A848 40%, #B08838 100%)')};
  if (estilo === 'blancoAzul') return {...st, ...grad('linear-gradient(180deg, #FFFFFF 30%, #B9CBEB 70%, #6E8FCB 100%)')};
  if (estilo === 'beige') return {...st, ...grad(`linear-gradient(180deg, #FFFFFF 25%, ${BEIGE} 100%)`)};
  if (estilo === 'calado') return {...st, color: 'transparent', WebkitTextStroke: '5px white'};
  return st;
};

// el ancho final de cada línea se limita a 720 px (bloque centrado en x = 540 dentro de x 180–900)
const medir = (() => {
  let ctx: CanvasRenderingContext2D | null = null;
  return (txt: string, st: React.CSSProperties) => {
    if (!ctx) ctx = document.createElement('canvas').getContext('2d');
    const size = Number(st.fontSize);
    ctx!.font = `${st.fontStyle ?? 'normal'} ${st.fontWeight} ${size}px "${st.fontFamily}"`;
    return ctx!.measureText(txt).width + Math.abs(Number(st.letterSpacing ?? 0)) * 0 + size * 0.15;
  };
})();
const Fit: React.FC<{txt: string; st: React.CSSProperties; max?: number}> = ({txt, st, max = 720}) => {
  const w = medir(txt, st);
  const k = Math.min(1, max / w);
  return <div style={{...st, fontSize: Number(st.fontSize) * k, letterSpacing: Number(st.letterSpacing ?? 0) * k}}>{txt}</div>;
};

const useIn = (at: number, out: number, kind: 'pop' | 'up' | 'zoom') => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  const p = spring({frame: frame - f(at), fps, config: {damping: kind === 'up' ? 18 : 11, stiffness: 170, mass: 0.7}});
  const o = interpolate(t, [out - 0.15, out], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const blur = Math.max(0, interpolate(p, [0, 1], [kind === 'zoom' ? 18 : 10, 0])) + interpolate(t, [out - 0.15, out], [0, 8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tr = kind === 'up' ? `translateY(${interpolate(p, [0, 1], [24, 0])}px)` : `scale(${interpolate(p, [0, 1], [kind === 'zoom' ? 1.6 : 0.7, 1])})`;
  return {opacity: t >= at - 0.001 && t < out ? Math.min(1, p * 1.6) * o : 0, transform: tr, filter: `blur(${blur}px)`} as React.CSSProperties;
};
const L: React.FC<{at: number; out: number; kind?: 'pop' | 'up' | 'zoom'; children: React.ReactNode}> = ({at, out, kind = 'up', children}) => (
  <div style={{...useIn(at, out, kind), textAlign: 'center'}}>{children}</div>
);
// bloque de título: arriba en `top` (al pecho) o centrado en y = 960 (sobre B-roll)
const Bloque: React.FC<{a: number; b: number; top?: number; gap?: number; children: React.ReactNode}> = ({a, b, top, gap = 6, children}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < a - 0.05 || t > b + 0.05) return null;
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: top ?? 960, transform: top === undefined ? 'translateY(-50%)' : undefined,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>{children}</div>
  );
};

// ---------- títulos ----------
export const TITULOS: [number, number][] = [];
const T = (a: number, b: number) => { TITULOS.push([a, b]); return {a, b}; };
const t1 = T(0.9, 2.33), t2 = T(4.39, 5.87), t3 = T(6.85, 8.33), t4 = T(8.33, 11.04), t5 = T(17.67, 19.52), t6 = T(19.52, 21.267),
  t7 = T(24.08, 25.96), t8 = T(25.96, 28.59), t9 = T(28.59, 30.81), t10 = T(31.75, 33.367), t11 = T(36.8, 38.57), t12 = T(39.77, 41.02),
  t13 = T(49.17, 50.2), t14 = T(54.39, 56.6), t15 = T(59.82, 61.33), t16 = T(63.35, 65.2);
const pecho = (x: {a: number; b: number}, aire = 30) => chinMax(x.a, x.b) + aire;

const Titulos: React.FC = () => (
  <>
    <Bloque {...t1} top={pecho(t1)}>
      <L at={t1.a} out={t1.b}><div style={base(58, 500)}>lista para</div></L>
      <L at={1.48} out={t1.b} kind="pop"><Fit txt="ESTRENAR" st={golpe(120, 'azul')} /></L>
    </Bloque>
    <Bloque {...t2} top={pecho(t2)}>
      <L at={4.69} out={t2.b} kind="pop"><div style={base(104, 700, false, TS)}>3 habitaciones</div></L>
    </Bloque>
    <Bloque {...t3} top={pecho(t3)}>
      <L at={t3.a} out={t3.b}><div style={base(56, 500)}>en San Antonio,</div></L>
      <L at={7.53} out={t3.b} kind="zoom"><Fit txt="FLORIDA" st={golpe(140, 'blancoAzul')} /></L>
    </Bloque>
    <Bloque {...t4} top={pecho(t4)}>
      <L at={t4.a} out={t4.b}><div style={base(56, 500)}>y solamente</div></L>
      <L at={9.11} out={t4.b} kind="zoom"><Fit txt="$339.640" st={golpe(150, 'dorado')} /></L>
    </Bloque>
    <Bloque {...t5}>
      <L at={t5.a} out={t5.b}><div style={base(58, 500)}>cerca de la</div></L>
      <L at={18.31} out={t5.b} kind="pop"><Fit txt="I-75" st={golpe(170, 'blancoAzul')} /></L>
    </Bloque>
    <Bloque {...t6}>
      <L at={t6.a} out={t6.b}><div style={base(58, 500)}>a unos</div></L>
      <L at={20.02} out={t6.b} kind="pop"><Fit txt="15 MINUTOS" st={golpe(120, 'azul')} /></L>
    </Bloque>
    <Bloque {...t7} top={pecho(t7)}>
      <L at={t7.a} out={t7.b}><div style={base(56, 500)}>la casa está</div></L>
      <L at={25.12} out={t7.b} kind="pop"><Fit txt="TERMINADA" st={golpe(118, 'azul')} /></L>
    </Bloque>
    <Bloque {...t8} top={pecho(t8)} gap={10}>
      <L at={26.3} out={t8.b} kind="pop"><div style={base(96, 700, false, TS)}>3 habitaciones</div></L>
      <L at={27.51} out={t8.b} kind="pop"><div style={base(96, 700, false, TS)}>2 baños</div></L>
    </Bloque>
    <Bloque {...t9} top={pecho(t9)} gap={0}>
      <L at={28.75} out={t9.b} kind="zoom"><div style={golpe(210, 'calado')}>1.522</div></L>
      <L at={29.63} out={t9.b}><div style={base(64, 700, false, TS)}>pies cuadrados</div></L>
    </Bloque>
    <Bloque {...t10} top={pecho(t10)}>
      <L at={t10.a} out={t10.b}><div style={base(58, 500)}>garaje para</div></L>
      <L at={32.48} out={t10.b} kind="pop"><Fit txt="dos autos." st={golpe(124, 'blanco', true)} /></L>
    </Bloque>
    <Bloque {...t11}>
      <L at={t11.a} out={t11.b}><div style={base(56, 500)}>viene con topes de</div></L>
      <L at={37.79} out={t11.b} kind="pop"><Fit txt="GRANITO" st={golpe(140, 'dorado')} /></L>
    </Bloque>
    <Bloque {...t12}>
      <L at={t12.a} out={t12.b}><div style={base(60, 500)}>la habitación</div></L>
      <L at={40.38} out={t12.b} kind="pop"><Fit txt="PRINCIPAL" st={golpe(124, 'dorado')} /></L>
    </Bloque>
    <Bloque {...t13}>
      <L at={t13.a} out={t13.b}><div style={base(58, 500)}>a ahorrar</div></L>
      <L at={49.67} out={t13.b} kind="pop"><Fit txt="ENERGÍA" st={golpe(140, 'blancoAzul')} /></L>
    </Bloque>
    <Bloque {...t14}>
      <L at={t14.a} out={t14.b}><div style={base(58, 500)}>tasas de interés</div></L>
      <L at={55.71} out={t14.b} kind="pop"><Fit txt="promocionales" st={golpe(100, 'dorado', true)} /></L>
    </Bloque>
    <Bloque {...t15} top={pecho(t15)} gap={10}>
      <L at={t15.a} out={t15.b} kind="zoom"><Fit txt="ESCRIBEME" st={golpe(130, 'beige')} /></L>
      <L at={60.38} out={t15.b}><div style={base(54, 700)}>por WhatsApp</div></L>
    </Bloque>
    <Bloque {...t16} top={pecho(t16)}>
      <L at={t16.a} out={t16.b}><div style={base(54, 500)}>terminar el año en tu</div></L>
      <L at={64.52} out={t16.b} kind="pop"><Fit txt="nuevo hogar." st={golpe(116, 'azul', true)} /></L>
    </Bloque>
  </>
);

// ---------- subtítulos ----------
type Sub = [number, string, number?];
export const SUBS: Sub[] = [
  [0.0, 'Esta casa', 0.9],
  [2.33, 'no tienes que'], [2.87, '*esperar*'], [3.31, 'que la *construyan*', 4.39],
  [5.87, 'y está *ubicada*', 6.85],
  [11.04, 'ven que te la'], [11.54, 'voy a *enseñar*', 12.2],
  [12.33, 'Esta casa está'], [13.5, 'en *Mango Hills*', 14.667],
  [30.81, 'también tiene un', 31.75],
  [33.37, 'La *cocina*'], [33.93, 'es *abierta*'], [34.79, 'y conecta'], [35.35, 'con la *sala*'], [36.09, 'y el *comedor*', 36.8],
  [38.57, 'y *electrodomésticos*', 39.77],
  [41.02, 'tiene su'], [41.42, 'propio *baño*'], [42.3, 'y un *clóset*'], [42.95, 'bastante'], [43.91, '*espacioso*', 44.633],
  [47.2, 'y varias'], [47.62, '*características*'], [48.59, 'que ayudan', 49.17],
  [50.26, 'y si estás'], [50.88, 'pensando'], [51.4, '*comprar casa*'], [52.62, 'hay opciones de'], [53.43, '*financiamiento*', 54.39],
  [56.63, 'que podrían'], [57.37, '*ayudarte,*'], [58.22, 'dependiendo'], [58.84, 'de tu *aprobación*', 59.8],
  [61.33, 'revisamos'], [61.91, 'los *números*'], [62.83, 'para poder', 63.35],
];
const Subs: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const i = SUBS.findIndex((s, k) => t >= s[0] && t < (s[2] ?? SUBS[k + 1]?.[0] ?? 99));
  if (i < 0) return null;
  const [a, txt, fin] = SUBS[i];
  const b = fin ?? SUBS[i + 1][0];
  const p = PLANO_AT((a + b) / 2);
  const size = 64;
  // a cámara: pegado debajo del mentón; sobre B-roll: centrado en el cuadro
  const y = p[4] === 'ang' ? Math.min(1250 - size, chinMax(a, b) + 22) : 960 - size / 2;
  const k = frame - f(a);
  const op = interpolate(k, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sc = interpolate(k, [0, 4], [0.88, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
  const parts = txt.split('*');
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: y, textAlign: 'center', opacity: op, transform: `scale(${sc})`, transformOrigin: `540px ${size / 2}px`}}>
      <span style={{...base(size, 500), textShadow: p[4] === 'ang' ? SOMBRA : SOMBRA_CLARO}}>{parts.map((q, j) => (j % 2 ? <span key={j} style={{fontWeight: 900}}>{q}</span> : <span key={j}>{q}</span>))}</span>
    </div>
  );
};

export const ARO0109: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{backgroundColor: NAVY}}>
    {PLANOS.map((p, i) => (
      <Sequence key={i} from={f(p[2])} durationInFrames={f(p[3]) - f(p[2])}><Capa p={p} /></Sequence>
    ))}
    <LightLeak />
    <Titulos />
    <Subs />
    {guias && (
      <>
        <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 980, border: '3px solid lime', boxSizing: 'border-box'}} />
        <div style={{position: 'absolute', left: 70, top: 1250, width: 830, height: 190, border: '2px dashed rgba(0,255,0,0.5)', boxSizing: 'border-box'}} />
        <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'rgba(255,0,255,0.5)'}} />
        <CaraGuia />
      </>
    )}
  </AbsoluteFill>
);
const CaraGuia: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS; const p = PLANO_AT(t);
  if (p[4] !== 'ang') return null;
  const tr = TR[p[5]]; const src = p[1] + t - p[2];
  const i = Math.max(0, Math.min(tr.ey.length - 1, Math.round((src - tr.t0) * FPS)));
  const s = zoomAt(t), ex = tr.ex[i], ey = tr.ey[i];
  const top = ey + (tr.top[i] - ey) * s, chin = ey + (tr.chin[i] - ey) * s;
  return <div style={{position: 'absolute', left: ex - 130 * s, width: 260 * s, top, height: chin - top, border: '3px solid red', boxSizing: 'border-box'}} />;
};
