// Plantilla del 07-10 (motion de marca de Isledys, aprobado 2026-11-10). data.json = {segs, ojos} y subs.json salen de los scripts del PROYECTO/ del video.
// ISM 07-10 "No existe un salario mínimo para comprar casa" — ACABADO.
// Sistema de Isledys (skill isledys-hernandez-brand §4): golpes crema con glow y barra dorada, subtítulos chicos, pantalla celeste,
// azul Pioneer / celeste / dorado / crema, Bodoni URW + Montserrat. Motion: M1 contador de sueldo + NO EXISTE, M2 tablero de 5 factores,
// M3 persona A / B con el mismo sueldo y montos ocultos (EJEMPLO). Audio: se mezcla aparte (mezcla.py) y se muxea.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import data from './data.json';
import SUBS from './subs.json';
import {Logos} from '../ism/Logos';
import {TituloBarra} from '../ism/TituloBarra';

export const FPS = 30;
export const ISM0710_FRAMES = 899;
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
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([fam, file, weight, style]) =>
  new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight, style}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

// ---------- tiempos (s de salida) ----------
const M1 = [5.31, 7.95], M2 = [14.65, 21.24], M3 = [21.24, 25.50];
const BR1 = [10.60, 12.72], BR2 = [28.05, 29.29];
const CORTES = [7.95, 9.30, 10.60, 12.72, 25.50, 26.84, 28.05, 29.29]; // zoom-blur
const LEAKS = [5.31, 14.65];

type Seg = {a: number; b: number; o: number};
const SEGS = data.segs as Seg[];
const OJOS = data.ojos as number[][];
const ojo = (t: number): [number, number] => {
  const v = OJOS.filter((r) => Math.abs(r[0] - t) <= 0.3);
  if (!v.length) return [540, 720];
  return [v.reduce((s, r) => s + r[1], 0) / v.length, v.reduce((s, r) => s + r[2], 0) / v.length];
};
const PLANOS: [number, number, number, number][] = [
  [0, 5.31, 1.0, 1.06], [5.31, 9.30, 1.16, 1.18], [9.30, 10.60, 1.0, 1.03], [10.60, 16.99, 1.14, 1.17],
  [16.99, 21.24, 1.0, 1.02], [21.24, 26.84, 1.0, 1.04], [26.84, 29.97, 1.16, 1.2],
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
            <OffthreadVideo src={staticFile('ism0710/base1080.mp4')} startFrom={f(x.a)} muted />
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// recorte con alfa del hook (rotoscopia), con el mismo encuadre que el plano
const RotoHook: React.FC = () => {
  const s = useCurrentFrame() / FPS;
  const {k, ex, ey} = encuadre(s);
  return (
    <AbsoluteFill style={{transform: `scale(${k})`, transformOrigin: `${ex}px ${ey}px`}}>
      <OffthreadVideo src={staticFile('ism0710/fg_hook.mov')} transparent startFrom={0} muted />
    </AbsoluteFill>
  );
};

const Broll: React.FC<{src: string; dur: number; zoom?: [number, number]; desde?: number}> = ({src, dur, zoom = [1.0, 1.08], desde = 0}) => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill style={{transform: `scale(${interpolate(g, [0, f(dur)], zoom)})`}}>
      <OffthreadVideo src={staticFile('ism0710/' + src)} startFrom={f(desde)} muted />
    </AbsoluteFill>
  );
};

// zoom-blur en los cortes: pulso de escala ×1,14 + desenfoque, 3 cuadros a cada lado (se aplica a la imagen, no a los textos)
const FX: React.FC<{children: React.ReactNode}> = ({children}) => {
  const g = useCurrentFrame();
  let e = 0;
  for (const c of CORTES) e = Math.max(e, 1 - Math.abs(g - f(c) + 0.5) / 3.5);
  e = Math.max(0, e);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + 0.14 * e})`, transformOrigin: '540px 780px', filter: e > 0 ? `blur(${9 * e}px)` : undefined}}>
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
        {b.w.map((w, i) => {
          const clave = b.k.includes(w);
          return (
            <span key={i} style={clave ? {fontWeight: 900, fontStyle: 'italic'} : undefined}>{w}{i < b.w.length - 1 ? ' ' : ''}</span>
          );
        })}
      </div>
    </div>
  );
};

// línea chica de un título (entra subiendo)
const Linea: React.FC<{d: number; top: number; size?: number; children: React.ReactNode; color?: string; sal?: number}> = ({d, top, size = 50, children, color = 'white', sal}) => {
  const g = useCurrentFrame();
  const t = g - d;
  if (t < 0) return null;
  const op = interpolate(t, [0, 5], [0, 1], CL) * (sal ? interpolate(g, [sal - 4, sal], [1, 0], CL) : 1);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center', opacity: op, transform: `translateY(${interpolate(t, [0, 6], [16, 0], {...CL, easing: Easing.out(Easing.cubic)})}px)`,
      fontFamily: MON, fontWeight: 600, fontSize: size, color, textShadow: SOMBRA, lineHeight: 1}}>
      {children}
    </div>
  );
};
const Salida: React.FC<{hasta: number; children: React.ReactNode}> = ({hasta, children}) => {
  const g = useCurrentFrame();
  return <AbsoluteFill style={{opacity: interpolate(g, [hasta - 4, hasta], [1, 0], CL)}}>{children}</AbsoluteFill>;
};

// ---------- M1: no hay un salario único ----------
const Rodillo: React.FC<{g: number; vel: number; fase: number}> = ({g, vel, fase}) => {
  const pos = (g * vel + fase) % 10;
  const H = 120;
  return (
    <div style={{width: 72, height: H, overflow: 'hidden', position: 'relative'}}>
      <div style={{position: 'absolute', top: -pos * H, left: 0, right: 0, filter: 'blur(1.6px)'}}>
        {[...Array(11)].map((_, i) => (
          <div key={i} style={{height: H, lineHeight: `${H}px`, textAlign: 'center', fontFamily: MON, fontWeight: 900, fontSize: 104, color: AZUL}}>{i % 10}</div>
        ))}
      </div>
    </div>
  );
};
const MotionSueldo: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M1[0]);
  const ent = interpolate(g, [0, 7], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const card = spring({frame: g - 4, fps: FPS, config: {damping: 13, stiffness: 140}});
  const pill = g >= f(6.55) - base ? spring({frame: g - (f(6.55) - base), fps: FPS, config: {damping: 12}}) : 0;
  const ts = f(7.12) - base;
  const st = g >= ts ? interpolate(g - ts, [0, 6], [2.3, 1], {...CL, easing: Easing.in(Easing.cubic)}) : 0;
  const shake = g >= ts && g < ts + 8 ? Math.sin((g - ts) * 2.6) * (8 - (g - ts)) * 1.6 : 0;
  return (
    <AbsoluteFill style={{transform: `scale(${1.12 - 0.12 * ent})`, filter: `blur(${(1 - ent) * 10}px)`}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 48%, #0E55D0 0%, #073FA7 45%, #04245F 100%)'}} />
      <AbsoluteFill style={{opacity: 0.07, background: 'repeating-linear-gradient(135deg, white 0 2px, transparent 2px 26px)'}} />
      <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.4}px)`}}>
        <Linea d={2} top={455} size={50} color={HUESO}>No hay un</Linea>
        <TituloBarra d={f(5.67) - base - 5} top={590} size={118}>SALARIO ÚNICO</TituloBarra>
        {/* tarjeta del sueldo con dígitos que no paran de girar */}
        <div style={{position: 'absolute', left: 540 - 320, top: 720, width: 640, height: 270, borderRadius: 26, background: 'white',
          borderBottom: `8px solid ${DORADO}`, boxShadow: '0 18px 40px rgba(0,0,0,0.35)', transform: `scale(${card})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: MON, fontWeight: 700, fontSize: 30, letterSpacing: '0.22em', color: '#5d7390', marginBottom: 8}}>TU SUELDO ANUAL</div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{fontFamily: MON, fontWeight: 900, fontSize: 104, color: AZUL, marginRight: 8}}>$</div>
            <Rodillo g={g} vel={0.9} fase={3} /><Rodillo g={g} vel={0.55} fase={7} />
            <div style={{fontFamily: MON, fontWeight: 900, fontSize: 104, color: AZUL}}>,</div>
            <Rodillo g={g} vel={1.1} fase={1} /><Rodillo g={g} vel={0.7} fase={5} /><Rodillo g={g} vel={1.3} fase={8} />
          </div>
        </div>
        {/* ¿calificas? */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1040, display: 'flex', justifyContent: 'center', transform: `scale(${pill})`}}>
          <div style={{fontFamily: MON, fontWeight: 700, fontSize: 44, color: AZUL, background: CELESTE, borderRadius: 999, padding: '12px 34px',
            borderBottom: `5px solid ${DORADO}`}}>¿con cuánto <span style={{fontWeight: 900, fontStyle: 'italic'}}>calificas?</span></div>
        </div>
        {/* sello NO EXISTE */}
        {g >= ts && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center'}}>
            <div style={{transform: `rotate(-9deg) scale(${st})`, border: `9px solid ${DORADO}`, borderRadius: 18, padding: '10px 34px 14px',
              background: 'rgba(4,36,95,0.88)', boxShadow: '0 10px 30px rgba(0,0,0,0.45)'}}>
              <div style={{fontFamily: MON, fontWeight: 900, fontSize: 112, color: CREMA, lineHeight: 1, letterSpacing: '0.02em', textShadow: GLOW}}>NO EXISTE</div>
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- M2: los factores ----------
const Icono: React.FC<{tipo: string}> = ({tipo}) => {
  const st = {stroke: 'white', strokeWidth: 5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={46} height={46} viewBox="0 0 48 48">
      {tipo === 'ingresos' && <text x="24" y="37" textAnchor="middle" fontFamily={MON} fontWeight={900} fontSize={36} fill="white">$</text>}
      {tipo === 'deudas' && <><rect x="5" y="11" width="38" height="26" rx="4" {...st} /><line x1="5" y1="19" x2="43" y2="19" {...st} /><line x1="11" y1="29" x2="21" y2="29" {...st} /></>}
      {tipo === 'credito' && <><path d="M7 33 A17 17 0 0 1 41 33" {...st} /><line x1="24" y1="33" x2="33" y2="20" {...st} /></>}
      {tipo === 'ahorros' && <><path d="M12 14 h24 v24 a4 4 0 0 1 -4 4 h-16 a4 4 0 0 1 -4 -4 z" {...st} /><line x1="10" y1="10" x2="38" y2="10" {...st} /><circle cx="24" cy="28" r="5" {...st} /></>}
      {tipo === 'prestamo' && <><path d="M13 5 h16 l8 8 v30 h-24 z" {...st} /><line x1="18" y1="22" x2="31" y2="22" {...st} /><line x1="18" y1="30" x2="31" y2="30" {...st} /></>}
    </svg>
  );
};
const Mini: React.FC<{tipo: string; t: number}> = ({tipo, t}) => {
  // t = cuadros desde que entró la tarjeta
  if (tipo === 'ingresos') return <Check t={t} />;
  if (tipo === 'deudas') {
    const w = interpolate(t, [4, 26], [100, 38], {...CL, easing: Easing.out(Easing.cubic)});
    return (<div style={{width: 110, height: 16, borderRadius: 8, background: 'rgba(7,63,167,0.18)'}}><div style={{width: `${w}%`, height: '100%', borderRadius: 8, background: AZUL}} /></div>);
  }
  if (tipo === 'credito') {
    const a = interpolate(t, [4, 34], [-80, 48], {...CL, easing: Easing.out(Easing.back(1.4))});
    return (
      <svg width={110} height={64} viewBox="0 0 110 64">
        <defs><linearGradient id="gc" x1="0" x2="1"><stop offset="0" stopColor="#8298AC" /><stop offset="1" stopColor={DORADO} /></linearGradient></defs>
        <path d="M10 58 A45 45 0 0 1 100 58" stroke="url(#gc)" strokeWidth={12} fill="none" strokeLinecap="round" />
        <g transform={`rotate(${a} 55 58)`}><line x1="55" y1="58" x2="55" y2="22" stroke={AZUL} strokeWidth={6} strokeLinecap="round" /></g>
        <circle cx="55" cy="58" r="7" fill={AZUL} />
      </svg>
    );
  }
  if (tipo === 'ahorros') {
    const h = interpolate(t, [4, 60], [0, 0.85], {...CL, easing: Easing.inOut(Easing.cubic)});
    return (
      <div style={{width: 56, height: 72, border: `5px solid ${AZUL}`, borderTop: 'none', borderRadius: '0 0 14px 14px', position: 'relative', overflow: 'hidden', marginRight: 26}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${h * 100}%`, background: `linear-gradient(${CREMA}, ${DORADO})`}} />
      </div>
    );
  }
  // préstamo: tres pestañas que se van marcando
  const sel = Math.floor(interpolate(t, [0, 22], [0, 2.99], CL));
  return (
    <div style={{display: 'flex', gap: 8}}>
      {[0, 1, 2].map((i) => <div key={i} style={{width: 30, height: 40, borderRadius: 7, background: i === sel ? AZUL : 'rgba(7,63,167,0.2)'}} />)}
    </div>
  );
};
const Check: React.FC<{t: number}> = ({t}) => {
  const s = spring({frame: t, fps: FPS, config: {damping: 11, stiffness: 160}});
  return (
    <div style={{width: 58, height: 58, borderRadius: 29, background: DORADO, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`}}>
      <svg width={34} height={34} viewBox="0 0 34 34"><path d="M7 18 l7 7 l13 -15" stroke="white" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
};
const FACTORES: {tipo: string; txt: React.ReactNode; t: number}[] = [
  {tipo: 'ingresos', txt: <>tus <b style={{fontWeight: 900}}>ingresos</b></>, t: 14.70},
  {tipo: 'deudas', txt: <><b style={{fontWeight: 900}}>deudas</b> mensuales</>, t: 14.93},
  {tipo: 'credito', txt: <>historial de <b style={{fontWeight: 900}}>crédito</b></>, t: 15.83},
  {tipo: 'ahorros', txt: <>dinero <b style={{fontWeight: 900}}>ahorrado</b></>, t: 17.09},
  {tipo: 'prestamo', txt: <>tipo de <b style={{fontWeight: 900}}>préstamo</b></>, t: 20.06},
];
const MotionFactores: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M2[0]);
  const tp = f(20.82) - base;
  const pill = g >= tp ? spring({frame: g - tp, fps: FPS, config: {damping: 12, stiffness: 150}}) : 0;
  const brillo = g >= tp ? interpolate(g - tp, [4, 22], [-30, 130], CL) : -30;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(4,22,64,0.72)', opacity: interpolate(g, [0, 6], [0, 1], CL)}} />
      <Linea d={2} top={420} size={46} color={HUESO}>necesitamos también</Linea>
      <div style={{position: 'absolute', left: 0, right: 0, top: 476, textAlign: 'center', opacity: interpolate(g, [4, 10], [0, 1], CL),
        fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 84, color: CREMA, textShadow: GLOW, transform: 'scaleX(0.88)', lineHeight: 1}}>
        analizar
      </div>
      {FACTORES.map((x, i) => {
        const d = g - (f(x.t) - base);
        if (d < 0) return null;
        const e = interpolate(d, [0, 8], [0, 1], {...CL, easing: Easing.out(Easing.back(1.3))});
        return (
          <div key={i} style={{position: 'absolute', left: 540 - 360, top: 600 + i * 128, width: 720, height: 108, borderRadius: 22,
            background: CELESTE, borderBottom: `6px solid ${DORADO}`, boxShadow: '0 10px 26px rgba(0,0,0,0.3)',
            opacity: interpolate(d, [0, 4], [0, 1], CL), transform: `translateX(${(1 - e) * -90}px)`,
            display: 'flex', alignItems: 'center', padding: '0 26px 0 20px', boxSizing: 'border-box'}}>
            <div style={{width: 74, height: 74, borderRadius: 37, background: AZUL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <Icono tipo={x.tipo} />
            </div>
            <div style={{fontFamily: MON, fontWeight: 600, fontSize: 42, color: AZUL, marginLeft: 22, flex: 1, whiteSpace: 'nowrap'}}>{x.txt}</div>
            <div style={{width: 120, display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
              {g >= tp + 4 + i * 2 && x.tipo !== 'ingresos' ? <Check t={g - tp - 4 - i * 2} /> : <Mini tipo={x.tipo} t={d} />}
            </div>
          </div>
        );
      })}
      {/* resultado */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1250, display: 'flex', justifyContent: 'center', transform: `scale(${pill})`}}>
        <div style={{position: 'relative', overflow: 'hidden', fontFamily: MON, fontWeight: 900, fontSize: 50, color: 'white', letterSpacing: '0.02em',
          background: AZUL, border: `4px solid ${DORADO}`, borderRadius: 999, padding: '16px 44px', boxShadow: '0 12px 30px rgba(0,0,0,0.4)'}}>
          = TU APROBACIÓN
          <div style={{position: 'absolute', top: 0, bottom: 0, left: `${brillo}%`, width: '22%', transform: 'skewX(-20deg)',
            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- M3: mismo sueldo, otro monto ----------
const Persona: React.FC<{x: number; letra: string; d: number}> = ({x, letra, d}) => {
  const g = useCurrentFrame();
  const s = g >= d ? spring({frame: g - d, fps: FPS, config: {damping: 12, stiffness: 150}}) : 0;
  return (
    <div style={{position: 'absolute', left: x - 120, top: 540, width: 240, textAlign: 'center', transform: `scale(${s})`}}>
      <svg width={150} height={150} viewBox="0 0 150 150">
        <circle cx="75" cy="75" r="72" fill="white" stroke={AZUL} strokeWidth="5" />
        <circle cx="75" cy="58" r="24" fill={AZUL} />
        <path d="M30 128 a45 40 0 0 1 90 0 z" fill={AZUL} />
      </svg>
      <div style={{fontFamily: MON, fontWeight: 700, fontSize: 30, letterSpacing: '0.2em', color: AZUL, marginTop: 6}}>PERSONA {letra}</div>
    </div>
  );
};
const Oculto: React.FC<{txt: string; size: number; color?: string}> = ({txt, size, color = AZUL}) => (
  <span style={{fontFamily: MON, fontWeight: 900, fontSize: size, color}}>
    $ <span style={{filter: 'blur(9px)'}}>{txt}</span>
  </span>
);
const MotionMontos: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M3[0]);
  const cort = interpolate(g, [0, 7], [1920, 0], {...CL, easing: Easing.out(Easing.cubic)});
  const tS = f(22.22) - base, tC = f(23.22) - base, tD = f(24.12) - base;
  const sueldo = g >= tS ? spring({frame: g - tS, fps: FPS, config: {damping: 13}}) : 0;
  const grow = (alto: number, delay: number) => (g >= tC + delay ? interpolate(g - tC - delay, [0, 20], [0, alto], {...CL, easing: Easing.out(Easing.back(1.2))}) : 0);
  const hA = grow(190, 0), hB = grow(330, 3);
  const neq = g >= tD;
  const sPop = neq ? spring({frame: g - tD, fps: FPS, config: {damping: 9, stiffness: 200}}) : 1;
  const XA = 380, XB = 700, BASE = 1300;
  return (
    <AbsoluteFill style={{transform: `translateY(${cort}px)`}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #E6F2FB 0%, #CDE5F4 55%, #A8CAE3 100%)'}} />
      <AbsoluteFill style={{opacity: 0.07, background: `repeating-linear-gradient(135deg, ${AZUL} 0 2px, transparent 2px 28px)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, height: 6, background: DORADO}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1470, height: 6, background: DORADO}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 92,
        color: AZUL, lineHeight: 1, opacity: interpolate(g, [3, 9], [0, 1], CL), transform: 'scaleX(0.88)'}}>Dos personas</div>
      <Linea d={tS - 2} top={462} size={46} color={AZUL}>con el <b style={{fontWeight: 900, fontStyle: 'italic'}}>mismo sueldo</b></Linea>
      <Persona x={XA} letra="A" d={2} />
      <Persona x={XB} letra="B" d={6} />
      {/* sueldos iguales */}
      {[XA, XB].map((x, i) => (
        <div key={i} style={{position: 'absolute', left: x - 110, top: 800, width: 220, height: 74, borderRadius: 16, background: 'white',
          border: `3px solid ${AZUL}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${sueldo})`}}>
          <Oculto txt="48,000" size={36} />
        </div>
      ))}
      {/* = / ≠ */}
      <div style={{position: 'absolute', left: 540 - 50, top: 790, width: 100, textAlign: 'center', fontFamily: MON, fontWeight: 900, fontSize: 84,
        color: neq ? DORADO : AZUL, lineHeight: 1, transform: `scale(${sueldo * sPop})`, textShadow: neq ? '0 2px 8px rgba(0,0,0,0.25)' : undefined}}>
        =
      </div>
      {/* barras de lo que pueden calificar */}
      {[[XA, hA, '210,000'], [XB, hB, '360,000']].map(([x, h, txt], i) => (
        <React.Fragment key={i}>
          <div style={{position: 'absolute', left: (x as number) - 85, top: BASE - (h as number), width: 170, height: h as number, borderRadius: '18px 18px 0 0',
            background: i === 0 ? `linear-gradient(#5E86C9, ${AZUL})` : `linear-gradient(${CREMA}, ${DORADO} 60%, #B07D05)`,
            boxShadow: '0 8px 20px rgba(7,40,100,0.25)'}} />
          {(h as number) > 60 && (
            <div style={{position: 'absolute', left: (x as number) - 150, top: BASE - (h as number) - 62, width: 300, textAlign: 'center',
              opacity: interpolate(h as number, [60, 140], [0, 1], CL)}}>
              <Oculto txt={txt as string} size={42} />
            </div>
          )}
        </React.Fragment>
      ))}
      <div style={{position: 'absolute', left: 150, right: 150, top: BASE, height: 5, background: AZUL, borderRadius: 3}} />
      {neq && (
        <div style={{position: 'absolute', left: 0, right: 0, top: BASE + 24, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16,
          transform: `scale(${sPop})`}}>
          <div style={{fontFamily: MON, fontWeight: 600, fontSize: 40, color: AZUL}}>montos <b style={{fontWeight: 900, fontStyle: 'italic'}}>diferentes</b></div>
          <div style={{fontFamily: MON, fontWeight: 700, fontSize: 22, letterSpacing: '0.18em', color: '#5d7390', border: '2px solid #5d7390', borderRadius: 8, padding: '4px 10px'}}>EJEMPLO</div>
        </div>
      )}
      {/* el "=" se tacha cuando dice "totalmente diferentes" */}
      {neq && (
        <div style={{position: 'absolute', left: 540 - 46, top: 832, width: 92 * interpolate(g - tD, [0, 5], [0, 1], CL), height: 9, background: DORADO,
          transform: 'rotate(-58deg)', transformOrigin: '46px 4px', borderRadius: 5}} />
      )}
    </AbsoluteFill>
  );
};

// ---------- tachado: "no es adivinar un número" ----------
const Tachado: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(26.84);
  const t1 = f(27.13) - base, t2 = f(27.67) - base;
  const pop = g >= t1 ? spring({frame: g - t1, fps: FPS, config: {damping: 12, stiffness: 160}}) : 0;
  const raya = interpolate(g - t2, [0, 8], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Linea d={1} top={400} size={50}>no es</Linea>
      <div style={{position: 'absolute', left: 0, right: 0, top: 462, display: 'flex', justifyContent: 'center', opacity: Math.min(1, pop * 1.4)}}>
        <div style={{position: 'relative', transform: `scale(${0.8 + 0.2 * pop})`}}>
          <div style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 96, color: CREMA, textShadow: GLOW, transform: 'scaleX(0.86)', letterSpacing: '-0.02em', whiteSpace: 'nowrap', lineHeight: 1.1}}>
            adivinar un número
          </div>
          <div style={{position: 'absolute', left: '4%', top: '52%', height: 9, width: `${92 * raya}%`, background: DORADO, borderRadius: 5,
            boxShadow: '0 0 12px rgba(226,164,7,0.8)', transform: 'rotate(-3deg)'}} />
        </div>
      </div>
    </AbsoluteFill>
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

export const ISM0710: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    <FX>
      <Ella />
      {Q(BR1[0], BR1[1], <Broll src="br_ingresos.mp4" dur={BR1[1] - BR1[0]} />)}
      {Q(BR2[0], BR2[1], <Broll src="br_caso.mp4" dur={BR2[1] - BR2[0]} zoom={[1.04, 1.1]} desde={0.15} />)}
    </FX>
    {/* hook: "¿cuánto tienes que / GANAR?" con el golpe detrás de ella */}
    {Q(0, 3.3, <Salida hasta={f(3.25)}>
      <Linea d={f(1.36)} top={548} size={50}>¿cuánto tienes que</Linea>
      <TituloBarra d={f(2.04) - 5} top={668} size={132}>GANAR?</TituloBarra>
      <RotoHook />
    </Salida>)}
    {/* VARIOS FACTORES */}
    {Q(9.30, 10.60, <>
      <Linea d={0} top={418} size={46}>tu aprobación depende de</Linea>
      <TituloBarra d={f(9.44) - f(9.30) - 5} top={532} size={100}>VARIOS FACTORES</TituloBarra>
    </>)}
    {Q(M1[0], M1[1], <MotionSueldo />)}
    {Q(M2[0], M2[1], <MotionFactores />)}
    {Q(M3[0], M3[1], <MotionMontos />)}
    {Q(26.84, 28.05, <Tachado />)}
    <Subtitulos />
    {Q(28.97, 29.97, <Pie />)}
    {LEAKS.map((l, i) => Q(l - 0.13, l + 0.3, <Leak />, 'lk' + i))}
    <Logos oscuros={[[f(M1[0]), f(M1[1])], [f(BR1[0]), f(BR1[1])], [f(M2[0]), f(M2[1])]]} />
    {guias && (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid lime'}} />
        <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'red', opacity: 0.6}} />
      </AbsoluteFill>
    )}
  </AbsoluteFill>
);
