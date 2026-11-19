// ISM 02-11 PAUTA "Realtor: este cierre es tu próximo negocio" — ACABADO.
// Sistema de Isledys (skill isledys-hernandez-brand §4): golpes crema con glow y barra dorada, subtítulos chicos en pastilla navy
// arriba de la cabeza (selfie con la cara abajo, pared gris clara), azul Pioneer / celeste / dorado / crema, Bodoni URW + Montserrat.
// Motion: M1 cierre CANCELADO por financiamiento (azul), M2 red de referidos del cliente (su plano desenfocado), M3 línea de tiempo REALTOR → LENDER (celeste).
// Audio: se mezcla aparte (mezcla.py) y se muxea.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import data from './data.json';
import SUBS from './subs.json';
import {Logos} from '../ism/Logos';
import {TituloBarra} from '../ism/TituloBarra';

export const FPS = 30;
export const ISM0211_FRAMES = 706;
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
const M1 = [0.93, 2.62], M2 = [5.30, 9.1333], M3 = [11.8667, 13.95];
const BR1 = [10.55, 11.8667], BR2 = [16.66, 18.3667];
const CORTES = [2.62, 4.9, 9.1333, 10.55, 13.95, 15.2, 16.66, 18.3667, 21.8667]; // zoom-blur
const LEAKS = [4.9, 18.3667];
const CTA0 = 19.16;

type Seg = {a: number; b: number; o: number};
const SEGS = data.segs as Seg[];
const OJOS = data.ojos as number[][];
const PLANOS = data.planos as number[][];
const ojo = (t: number): [number, number] => {
  const v = OJOS.filter((r) => Math.abs(r[0] - t) <= 0.3);
  if (!v.length) return [540, 1160];
  return [v.reduce((s, r) => s + r[1], 0) / v.length, v.reduce((s, r) => s + r[2], 0) / v.length];
};
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
  const bl = s >= M2[0] && s < M2[1] ? interpolate(s, [M2[0], M2[0] + 0.2], [0, 1], CL) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: 'black'}}>
      {SEGS.map((x, i) => (
        <Sequence key={i} from={f(x.o)} durationInFrames={f(x.o + x.b - x.a) - f(x.o)}>
          <AbsoluteFill style={{transform: `scale(${k * (1 + 0.08 * bl)})`, transformOrigin: `${ex}px ${ey}px`,
            filter: bl > 0 ? `blur(${16 * bl}px) brightness(${1 - 0.2 * bl})` : undefined}}>
            <OffthreadVideo src={staticFile('ism0211/base1080.mp4')} startFrom={f(x.a)} muted />
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
      <OffthreadVideo src={staticFile('ism0211/' + src)} muted />
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
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: b.y != null ? b.y : 960 - 40, display: 'flex', justifyContent: 'center',
      opacity: op, transform: `translateY(${dy}px)`}}>
      <div style={{fontFamily: MON, fontSize: 52, fontWeight: 500, color: 'white', lineHeight: 1.15, padding: '6px 20px 9px',
        borderRadius: 14, background: 'rgba(7,24,70,0.62)', textShadow: '0 1px 6px rgba(0,0,0,0.35)', whiteSpace: 'nowrap', maxWidth: 720}}>
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
const pop = (g: number, d: number, damping = 12, stiffness = 160) => (g >= d ? spring({frame: g - d, fps: FPS, config: {damping, stiffness}}) : 0);
const Bod: React.FC<{size: number; children: React.ReactNode; color?: string; glow?: boolean}> = ({size, children, color = CREMA, glow = true}) => (
  <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: size, color, textShadow: glow ? GLOW : undefined, display: 'inline-block',
    transform: 'scaleX(0.88)', letterSpacing: '-0.02em'}}>{children}</span>
);
const Fuerte: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <span style={{fontFamily: MON, fontWeight: 900, fontSize: size, color: AZUL, WebkitTextStroke: `${Math.round(size / 12)}px white`, paintOrder: 'stroke fill',
    filter: 'drop-shadow(0 4px 10px rgba(0,10,40,0.45))', lineHeight: 1}}>{children}</span>
);
// velo suave detrás de los textos que van sobre la pared clara
const Velo: React.FC<{top: number; h: number}> = ({top, h}) => {
  const g = useCurrentFrame();
  return <div style={{position: 'absolute', left: 0, right: 0, top, height: h, opacity: interpolate(g, [0, 6], [0, 1], CL),
    background: 'radial-gradient(ellipse 62% 50% at 50% 50%, rgba(4,22,64,0.42), rgba(4,22,64,0) 100%)'}} />;
};

// ---------- íconos ----------
const st = {stroke: 'white', strokeWidth: 4.5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
const Ico: React.FC<{tipo: string; s?: number; c?: string}> = ({tipo, s = 54, c = 'white'}) => {
  const k = {...st, stroke: c};
  return (
    <svg width={s} height={s} viewBox="0 0 48 48">
      {tipo === 'casa' && <><path d="M6 22 L24 7 L42 22" {...k} /><path d="M11 19 v22 h26 v-22" {...k} /><rect x="20" y="28" width="8" height="13" {...k} /></>}
      {tipo === 'persona' && <><circle cx="24" cy="17" r="8" {...k} /><path d="M9 41 c2 -9 8 -13 15 -13 c7 0 13 4 15 13" {...k} /></>}
      {tipo === 'comentario' && <><path d="M8 9 h32 a4 4 0 0 1 4 4 v18 a4 4 0 0 1 -4 4 h-18 l-9 8 v-8 h-5 a4 4 0 0 1 -4 -4 v-18 a4 4 0 0 1 4 -4 z" {...k} /><path d="M15 20 h18 M15 27 h11" {...k} /></>}
      {tipo === 'doc' && <><path d="M12 5 h17 l9 9 v29 h-26 z" {...k} /><path d="M29 5 v9 h9 M18 24 h13 M18 31 h13" {...k} /></>}
      {tipo === 'lupa' && <><circle cx="21" cy="21" r="12" {...k} /><path d="M30 30 L41 41" {...k} /></>}
      {tipo === 'sello' && <><path d="M24 5 l16 6 v12 c0 10 -7 17 -16 20 c-9 -3 -16 -10 -16 -20 v-12 z" {...k} /><path d="M17 24 l5 5 l9 -10" {...k} /></>}
      {tipo === 'llave' && <><circle cx="15" cy="24" r="8" {...k} /><path d="M23 24 h19 M36 24 v7 M42 24 v5" {...k} /></>}
      {tipo === 'maletin' && <><rect x="6" y="15" width="36" height="25" rx="4" {...k} /><path d="M17 15 v-5 h14 v5 M6 26 h36" {...k} /></>}
      {tipo === 'reloj' && <><circle cx="24" cy="25" r="17" {...k} /><path d="M24 15 v11 l7 5" {...k} /></>}
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

// ---------- hook: REALTOR ----------
const Hook: React.FC = () => (
  <>
    <Velo top={470} h={260} />
    <TituloBarra d={0} top={590} size={132}>REALTOR</TituloBarra>
  </>
);

// ---------- M1 (azul): el cierre se cae por financiamiento ----------
const MotionCierre: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M1[0]);
  const rel = (s: number) => f(s) - base;
  const ent = interpolate(g, [0, 7], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const sal = interpolate(g, [f(M1[1]) - base - 5, f(M1[1]) - base], [0, 1], CL);
  const card = pop(g, rel(0.95) - 2, 13, 140);
  const barra = interpolate(g, [rel(0.98), rel(1.30)], [0, 0.86], {...CL, easing: Easing.out(Easing.cubic)});
  const tc = rel(1.39) - 1;
  const cae = g >= tc ? spring({frame: g - tc, fps: FPS, config: {damping: 9, stiffness: 120}}) : 0;
  const sl = g >= tc ? interpolate(g - tc, [0, 6], [2.3, 1], {...CL, easing: Easing.in(Easing.cubic)}) : 0;
  const shake = g >= tc + 6 && g < tc + 14 ? Math.sin((g - tc - 6) * 2.6) * (14 - (g - tc)) * 1.3 : 0;
  return (
    <AbsoluteFill style={{transform: `scale(${(1.12 - 0.12 * ent) * (1 + 0.15 * sal)})`, filter: `blur(${(1 - ent) * 10 + sal * 12}px)`, opacity: Math.min(ent * 1.5, 1 - sal)}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 48%, #0E55D0 0%, #073FA7 45%, #04245F 100%)'}} />
      <AbsoluteFill style={{opacity: 0.07, background: 'repeating-linear-gradient(135deg, white 0 2px, transparent 2px 26px)'}} />
      <Linea d={0} top={352} size={50} color={HUESO}>cuando un <Bod size={70} color={HUESO} glow={false}>cierre</Bod></Linea>
      {/* tarjeta del cierre */}
      <div style={{position: 'absolute', left: 540 - 330, top: 480, width: 660, height: 280, borderRadius: 26, background: 'white',
        borderBottom: `7px solid ${DORADO}`, boxShadow: '0 16px 36px rgba(0,0,0,0.35)', overflow: 'hidden',
        transform: `translateY(${70 * cae}px) rotate(${7 * cae}deg) scale(${card})`, filter: cae > 0 ? `saturate(${1 - 0.7 * cae})` : undefined}}>
        <div style={{position: 'absolute', left: 36, top: 36, width: 136, height: 136, borderRadius: 68, background: AZUL, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Ico tipo="casa" s={80} />
        </div>
        <div style={{position: 'absolute', left: 200, top: 46, fontFamily: MON, fontWeight: 700, fontSize: 28, letterSpacing: '0.2em', color: '#5d7390'}}>TU CLIENTE</div>
        <div style={{position: 'absolute', left: 200, top: 90, fontFamily: MON, fontWeight: 900, fontSize: 44, color: AZUL}}>CIERRE</div>
        <div style={{position: 'absolute', left: 200, top: 160, width: 400, height: 20, borderRadius: 10, background: '#dbe5f0', overflow: 'hidden'}}>
          <div style={{width: `${barra * 100}%`, height: '100%', background: `linear-gradient(90deg, ${AZUL}, #0E55D0)`, borderRadius: 10}} />
        </div>
        <div style={{position: 'absolute', left: 200, top: 196, fontFamily: MON, fontWeight: 600, fontSize: 24, color: '#5d7390'}}>Clear to close…</div>
      </div>
      {/* sello CANCELADO */}
      {g >= tc && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center',
          transform: `translate(${shake}px, 0) rotate(-9deg) scale(${sl})`}}>
          <div style={{padding: '6px 26px 10px', borderRadius: 14, background: 'rgba(4,36,95,0.94)', border: `5px solid ${DORADO}`, boxShadow: '0 10px 24px rgba(0,0,0,0.45)'}}>
            <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 92, color: CREMA, textShadow: GLOW, display: 'inline-block',
              transform: 'scaleX(0.88)', letterSpacing: '0.01em', lineHeight: 1}}>SE CAYÓ</span>
          </div>
        </div>
      )}
      <Linea d={rel(1.57)} top={930} size={48} color={HUESO}>por</Linea>
      <Linea d={rel(1.73)} top={990} size={60}><Bod size={92}>financiamiento</Bod></Linea>
    </AbsoluteFill>
  );
};

// ---------- "el cliente no se acuerda / del LENDER" → "se acuerda de / TI" ----------
const NoSeAcuerda: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M1[1]);
  const tach = interpolate(g, [f(4.02) - base, f(4.02) - base + 7], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const pl = pop(g, f(3.80) - base, 11, 180);
  return (
    <>
      <Velo top={420} h={260} />
      <Linea d={f(2.67) - base} top={462} size={48}>el cliente <b style={{fontWeight: 900, fontStyle: 'italic'}}>no</b> se acuerda</Linea>
      <Linea d={f(3.71) - base} top={528} size={46}>
        <span style={{verticalAlign: 'middle', marginRight: 14}}>del</span>
        <span style={{position: 'relative', display: 'inline-block', verticalAlign: 'middle', transform: `scale(${0.8 + 0.2 * pl})`}}>
          <span style={{fontFamily: MON, fontWeight: 900, fontSize: 74, color: HUESO, lineHeight: 1}}>LENDER</span>
          <span style={{position: 'absolute', left: -8, top: '52%', height: 8, width: `calc(${tach * 100}% + 16px)`, background: DORADO, borderRadius: 4,
            boxShadow: '0 2px 6px rgba(0,0,0,0.35)'}} />
        </span>
      </Linea>
    </>
  );
};
const DeTi: React.FC = () => {
  const base = f(4.21);
  return (
    <>
      <Velo top={400} h={280} />
      <Linea d={0} top={425} size={48}>se acuerda <b style={{fontWeight: 900, fontStyle: 'italic'}}>de</b></Linea>
      <TituloBarra d={f(4.66) - base - 5} top={566} size={140}>TI</TituloBarra>
    </>
  );
};

// ---------- M2 (su plano desenfocado): la red de referidos del cliente ----------
const REFS: {t: number; x: number; ico: string; l: string[]}[] = [
  {t: 6.97, x: 250, ico: 'persona', l: ['HERMANO']},
  {t: 7.51, x: 540, ico: 'maletin', l: ['COMPAÑERO', 'DE TRABAJO']},
  {t: 8.67, x: 830, ico: 'casa', l: ['VECINO']},
];
const MotionReferidos: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M2[0]);
  const rel = (s: number) => f(s) - base;
  const ent = interpolate(g, [0, 7], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const card = pop(g, rel(5.33) - 1, 13, 150);
  const CY = 900, R = 78;
  return (
    <AbsoluteFill style={{opacity: ent}}>
      <AbsoluteFill style={{background: 'rgba(4,22,64,0.72)'}} />
      <Linea d={rel(5.31)} top={330} size={46} color={HUESO}>Y si este cliente era</Linea>
      <Linea d={rel(6.07)} top={398} size={46}>el que te iba a <Bod size={74}>referir</Bod></Linea>
      {/* líneas que salen de la tarjeta */}
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {REFS.map((r) => {
          const p = interpolate(g, [rel(r.t) - 3, rel(r.t) + 3], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
          const x0 = 540, y0 = 676, x1 = r.x, y1 = CY - R;
          return <line key={r.x} x1={x0} y1={y0} x2={x0 + (x1 - x0) * p} y2={y0 + (y1 - y0) * p} stroke={DORADO} strokeWidth={5} strokeLinecap="round" strokeDasharray="2 14" opacity={p > 0 ? 1 : 0} />;
        })}
      </svg>
      {/* tarjeta TU CLIENTE */}
      <div style={{position: 'absolute', left: 540 - 250, top: 530, width: 500, height: 146, borderRadius: 24, background: CELESTE, borderBottom: `6px solid ${DORADO}`,
        boxShadow: '0 12px 30px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px', boxSizing: 'border-box', transform: `scale(${card})`}}>
        <div style={{width: 96, height: 96, borderRadius: 48, background: AZUL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Ico tipo="persona" s={60} /></div>
        <div style={{fontFamily: MON, fontWeight: 900, fontSize: 46, color: AZUL, lineHeight: 1, whiteSpace: 'nowrap'}}>TU CLIENTE</div>
      </div>
      {REFS.map((r) => {
        const p = pop(g, rel(r.t), 11, 170);
        if (g < rel(r.t)) return null;
        return (
          <div key={r.x} style={{position: 'absolute', left: r.x - 130, width: 260, top: CY - R, display: 'flex', flexDirection: 'column', alignItems: 'center',
            transform: `scale(${p})`, transformOrigin: '50% 30%'}}>
            <div style={{width: 2 * R, height: 2 * R, borderRadius: R, background: AZUL, border: `5px solid ${DORADO}`, boxSizing: 'border-box',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.4)'}}><Ico tipo={r.ico} s={74} /></div>
            <div style={{marginTop: 16, textAlign: 'center', fontFamily: MON, fontWeight: 900, fontSize: 32, color: 'white', lineHeight: 1.08, textShadow: SOMBRA,
              letterSpacing: '0.02em'}}>{r.l.map((x) => <div key={x}>{x}</div>)}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- "Tu próximo / NEGOCIO / depende de" ----------
const Negocio: React.FC = () => {
  const base = f(M2[1]);
  return (
    <>
      <Velo top={360} h={300} />
      <Linea d={f(9.15) - base} top={385} size={48}>Tu <b style={{fontWeight: 900, fontStyle: 'italic'}}>próximo</b></Linea>
      <TituloBarra d={f(9.65) - base - 5} top={500} size={124}>NEGOCIO</TituloBarra>
      <Linea d={f(10.05) - base} top={574} size={40}><span style={{fontWeight: 500}}>depende de</span></Linea>
    </>
  );
};

// ---------- B-roll llaves: "que este cierre / salga bien" ----------
const SalgaBien: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(BR1[0]);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 780, height: 300, opacity: interpolate(g, [0, 5], [0, 1], CL),
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(4,22,64,0.5), rgba(4,22,64,0) 100%)'}} />
      <Linea d={0} top={840} size={50}>que este <b style={{fontWeight: 900, fontStyle: 'italic'}}>cierre</b></Linea>
      <Linea d={f(11.29) - base} top={906} size={60}><Bod size={104}>salga bien</Bod></Linea>
    </>
  );
};

// ---------- M3 (celeste): línea de tiempo REALTOR → LENDER ----------
const MotionAntesHoy: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M3[0]);
  const rel = (s: number) => f(s) - base;
  const cort = interpolate(g, [0, 7], [1920, 0], {...CL, easing: Easing.out(Easing.cubic)});
  const sal = interpolate(g, [f(M3[1]) - base - 5, f(M3[1]) - base], [0, 1], CL);
  const X1 = 300, X2 = 765, Y = 800, R = 92;
  const linea = interpolate(g, [rel(12.10), rel(12.40)], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const viaje = interpolate(g, [rel(12.74), rel(13.22)], [0, 1], {...CL, easing: Easing.inOut(Easing.cubic)});
  const n1 = pop(g, rel(12.22) - 1, 11, 170), n2 = pop(g, rel(13.26) - 1, 10, 180);
  const Nodo: React.FC<{x: number; p: number; ico: string; fondo: string; arriba: string; abajo: string}> = ({x, p, ico, fondo, arriba, abajo}) => (
    <div style={{position: 'absolute', left: x - 170, width: 340, top: Y - R - 64, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${p})`}}>
      <div style={{fontFamily: MON, fontWeight: 700, fontSize: 30, letterSpacing: '0.22em', color: '#5d7390', marginBottom: 18}}>{arriba}</div>
      <div style={{width: 2 * R, height: 2 * R, borderRadius: R, background: fondo, border: '6px solid white', boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 26px rgba(7,40,100,0.3)'}}><Ico tipo={ico} s={86} /></div>
      <div style={{marginTop: 18, fontFamily: MON, fontWeight: 900, fontSize: 54, color: AZUL, lineHeight: 1}}>{abajo}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{transform: `translateY(${cort}px) scale(${1 + 0.15 * sal})`, filter: sal > 0 ? `blur(${sal * 12}px)` : undefined, opacity: 1 - sal}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #E6F2FB 0%, #CDE5F4 55%, #A8CAE3 100%)'}} />
      <AbsoluteFill style={{opacity: 0.07, background: `repeating-linear-gradient(135deg, ${AZUL} 0 2px, transparent 2px 28px)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 290, height: 6, background: DORADO}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1470, height: 6, background: DORADO}} />
      <Linea d={rel(11.94)} top={420} size={52} color={AZUL} sombra={false}>
        Yo <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 80}}>fui</span>
      </Linea>
      {/* línea */}
      <div style={{position: 'absolute', left: X1, top: Y - 4, width: (X2 - X1) * linea, height: 8, borderRadius: 4, background: 'rgba(7,63,167,0.25)'}} />
      <div style={{position: 'absolute', left: X1, top: Y - 4, width: (X2 - X1) * viaje, height: 8, borderRadius: 4, background: DORADO}} />
      <Nodo x={X1} p={n1} ico="casa" fondo={AZUL} arriba="ANTES" abajo="REALTOR" />
      <Nodo x={X2} p={n2} ico="doc" fondo={DORADO} arriba="HOY" abajo="LENDER" />
      {g >= rel(12.74) && g < rel(13.26) + 2 && (
        <div style={{position: 'absolute', left: X1 + (X2 - X1) * viaje - 18, top: Y - 18, width: 36, height: 36, borderRadius: 18, background: DORADO,
          border: '5px solid white', boxSizing: 'border-box', boxShadow: '0 4px 10px rgba(0,0,0,0.25)'}} />
      )}
      <Linea d={rel(12.74)} top={1060} size={60} color={AZUL} sombra={false}>
        <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 400}}>antes de </span>
        <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 72}}>ser</span>
      </Linea>
    </AbsoluteFill>
  );
};

// ---------- "y sé qué es lo que está / EN JUEGO / para ti" ----------
const EnJuego: React.FC = () => {
  const base = f(M3[1]);
  return (
    <>
      <Velo top={350} h={290} />
      <Linea d={f(14.10) - base} top={380} size={46}>y sé qué es lo que <b style={{fontWeight: 900, fontStyle: 'italic'}}>está</b></Linea>
      <TituloBarra d={f(14.56) - base - 5} top={494} size={124}>EN JUEGO</TituloBarra>
      <Linea d={f(14.84) - base} top={560} size={46}><Bod size={58} color={HUESO} glow={false}><span style={{textShadow: SOMBRA}}>para ti</span></Bod></Linea>
    </>
  );
};

// ---------- B-roll agente + pareja: "cuidando tu / RELACIÓN / con el cliente" ----------
const Relacion: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(BR2[0]);
  const p = pop(g, f(17.22) - base - 1, 10, 190);
  return (
    <>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,22,64,0.62) 0%, rgba(4,22,64,0.4) 24%, rgba(4,22,64,0) 36%)', opacity: interpolate(g, [0, 5], [0, 1], CL)}} />
      <Linea d={f(16.68) - base} top={300} size={48}>cuidando <b style={{fontWeight: 900, fontStyle: 'italic'}}>tu</b></Linea>
      {g >= f(17.22) - base - 1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', transform: `scale(${0.8 + 0.2 * p})`, opacity: Math.min(1, p * 1.5)}}>
          <Fuerte size={104}>RELACIÓN</Fuerte>
        </div>
      )}
      <Linea d={f(17.64) - base} top={482} size={44}>con el <b style={{fontWeight: 900, fontStyle: 'italic'}}>cliente</b></Linea>
    </>
  );
};

// ---------- CTA: ESCRIBE / la palabra [REALTOR] / y el nombre de tu brokerage ----------
const CTA: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(CTA0);
  const p = pop(g, 0, 10, 180);
  const pc = pop(g, f(20.14) - base - 1, 10, 190);
  const brillo = interpolate(g - (f(20.14) - base + 6), [0, 16], [-30, 130], CL);
  return (
    <>
      <Velo top={300} h={480} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 318, textAlign: 'center', transform: `scale(${p})`}}>
        <span style={{fontFamily: MON, fontWeight: 900, fontSize: 96, lineHeight: 1.25, background: `linear-gradient(180deg, #FFFFFF 0%, ${HUESO} 60%, #DCD8C8 100%)`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 4px 10px rgba(0,10,40,0.55))'}}>ESCRIBE</span>
      </div>
      <Linea d={f(19.50) - base} top={448} size={44}>la palabra</Linea>
      {g >= f(20.14) - base - 1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 506, display: 'flex', justifyContent: 'center', transform: `scale(${pc})`}}>
          <div style={{position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 16, padding: '8px 34px 10px 24px', borderRadius: 44,
            background: AZUL, border: `4px solid ${DORADO}`, boxShadow: '0 10px 24px rgba(0,10,40,0.45)'}}>
            <Ico tipo="comentario" s={52} />
            <span style={{fontFamily: MON, fontWeight: 900, fontSize: 54, color: 'white', letterSpacing: '0.02em', lineHeight: 1.1}}>REALTOR</span>
            <div style={{position: 'absolute', top: 0, bottom: 0, left: `${brillo}%`, width: '22%', transform: 'skewX(-20deg)',
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))'}} />
          </div>
        </div>
      )}
      <Linea d={f(20.68) - base} top={622} size={42}>
        y el nombre de tu <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 58, color: CREMA, textShadow: GLOW}}>brokerage</span>
      </Linea>
    </>
  );
};

// ---------- "y hablamos de cómo / TRABAJAR JUNTOS" ----------
const Juntos: React.FC = () => {
  const base = f(21.8667);
  return (
    <>
      <Velo top={360} h={300} />
      <Linea d={f(21.95) - base} top={398} size={46}>y hablamos de <b style={{fontWeight: 900, fontStyle: 'italic'}}>cómo</b></Linea>
      <TituloBarra d={f(22.69) - base - 5} top={510} size={100}>TRABAJAR JUNTOS</TituloBarra>
    </>
  );
};

const Pie: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', opacity: interpolate(g, [0, 6], [0, 1], CL)}}>
      <div style={{fontFamily: MON, fontWeight: 500, fontSize: 28, color: 'white', letterSpacing: '0.04em', background: 'rgba(7,30,80,0.6)', borderRadius: 8, padding: '6px 16px'}}>
        Mortgage Loan Originator NMLS# 1924019
      </div>
    </div>
  );
};


const Q = (a: number, b: number, el: React.ReactNode, k?: string) => <Sequence key={k} from={f(a)} durationInFrames={f(b) - f(a)}>{el}</Sequence>;
const FIN = ISM0211_FRAMES / FPS;

export const ISM0211: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    <FX>
      <Ella />
      {Q(BR1[0], BR1[1], <Broll src="br_llaves.mp4" dur={BR1[1] - BR1[0]} zoom={[1.0, 1.06]} />)}
      {Q(BR2[0], BR2[1], <Broll src="br_agente.mp4" dur={BR2[1] - BR2[0]} zoom={[1.02, 1.08]} />)}
    </FX>
    {Q(0, M1[0], <Hook />)}
    {Q(M1[1], 4.21, <NoSeAcuerda />)}
    {Q(4.21, M2[0], <DeTi />)}
    {Q(M2[0], M2[1], <MotionReferidos />)}
    {Q(M2[1], BR1[0], <Negocio />)}
    {Q(BR1[0], BR1[1], <SalgaBien />)}
    {Q(M3[1], 15.50, <EnJuego />)}
    {Q(BR2[0], BR2[1], <Relacion />)}
    {Q(CTA0, 21.8667, <CTA />)}
    {Q(21.8667, FIN, <Juntos />)}
    {Q(M1[0], M1[1] + 0.17, <MotionCierre />)}
    {Q(M3[0], M3[1] + 0.17, <MotionAntesHoy />)}
    <Subtitulos />
    {Q(FIN - 1.0, FIN, <Pie />)}
    {LEAKS.map((l, i) => Q(l - 0.13, l + 0.3, <Leak />, 'lk' + i))}
    <Logos oscuros={[[f(M1[0]), f(M1[1])], [f(M2[0]), f(M2[1])]]} />
    {guias && (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 980, border: '3px solid lime'}} />
        <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'red', opacity: 0.6}} />
      </AbsoluteFill>
    )}
  </AbsoluteFill>
);
