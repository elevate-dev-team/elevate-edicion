// Referencia ISM 04-10 PAUTA (aprobada por el editor 2026-10-28): primer video con el sistema nuevo. Copiar a remotion-elevate/src/ismDDMM/Video.tsx,
// con Logos.tsx y TituloBarra.tsx en src/ism/ y cara.ts generado con track_cara.swift (10 fps). Rehacer TRAMOS, BROLL, SUBS y TITULOS para cada video.
import React from 'react';
import {
  AbsoluteFill, Easing, OffthreadVideo, Sequence, continueRender, delayRender, getInputProps, interpolate, spring,
  staticFile, useCurrentFrame,
} from 'remotion';
import {Logos} from '../ism/Logos';
import {TituloBarra} from '../ism/TituloBarra';
import {CARA} from './cara';

// ISM 04-10 PAUTA "¿Tu lender te contesta?" — Isledys sentada en el sillón blanco del living (crudo 576×1024 ya montado), blusa azul satinada
// Sistema nuevo del editor (28-10): golpe crema con glow + barra dorada, subtítulos chicos sin caja, recursos de AP 21-11 / ARO 01-09
export const FPS = 30;
export const ISM0410_FRAMES = 664;
const f = (s: number) => Math.round(s * FPS);
const GUIAS = Boolean((getInputProps() as {guias?: boolean}).guias);

const AZUL = '#073FA7', CELESTE = '#CDE5F4', DORADO = '#E2A407', HUESO = '#F5F5F0', CREMA = '#F3E3A9';
const BOD = 'Bodoni URW', MON = 'Montserrat';
const SOMBRA = 'drop-shadow(0 2px 4px rgba(0,0,0,0.55)) drop-shadow(0 6px 18px rgba(0,0,0,0.35))';
const GLOW = '0 0 6px rgba(226,164,7,0.95), 0 0 18px rgba(226,164,7,0.75), 0 0 34px rgba(226,164,7,0.4)';

const FONTS: [string, string, number, string][] = [
  [BOD, 'BodoniURW-Bol.otf', 700, 'normal'], [BOD, 'BodoniURW-BolObl.otf', 700, 'italic'],
  [BOD, 'BodoniURW-Med.otf', 500, 'normal'], [BOD, 'BodoniURW-MedObl.otf', 500, 'italic'],
  [BOD, 'BodoniURW-RegObl.otf', 400, 'italic'],
  [MON, 'Montserrat-Medium.ttf', 500, 'normal'], [MON, 'Montserrat-SemiBold.ttf', 600, 'normal'], [MON, 'Montserrat-Bold.ttf', 700, 'normal'],
  [MON, 'Montserrat-Black.ttf', 900, 'normal'], [MON, 'Montserrat-BlackItalic.ttf', 900, 'italic'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([fam, file, weight, style]) =>
  new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight: String(weight), style}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

// ---------- tramos del speaker (frames del timeline → frame de entrada en isle.mp4) ----------
// se sacan las pausas entre frases; los punch-ins (z0 > 1) caen en cortes de pausa, anclados a los ojos
type Tramo = {a: number; b: number; src: number; z0: number; z1: number};
const TRAMOS: Tramo[] = [
  {a: 0, b: 34, src: 19, z0: 1.0, z1: 1.03},
  {a: 34, b: 69, src: 76, z0: 1.08, z1: 1.11},
  {a: 69, b: 125, src: 125, z0: 1.0, z1: 1.03},
  {a: 125, b: 172, src: 189, z0: 1.0, z1: 1.04},
  {a: 172, b: 234, src: 263, z0: 1.0, z1: 1.04},
  {a: 234, b: 261, src: 325, z0: 1.12, z1: 1.15},
  {a: 261, b: 331, src: 397, z0: 1.0, z1: 1.04},
  {a: 331, b: 395, src: 467, z0: 1.0, z1: 1.02},
  {a: 395, b: 553, src: 575, z0: 1.0, z1: 1.04},
  {a: 553, b: 572, src: 733, z0: 1.12, z1: 1.14},
  {a: 572, b: 629, src: 790, z0: 1.0, z1: 1.04},
  {a: 629, b: 664, src: 847, z0: 1.1, z1: 1.13},
];
const tramoDe = (g: number) => TRAMOS.find((t) => g >= t.a && g < t.b) ?? TRAMOS[TRAMOS.length - 1];
const zoomEn = (g: number) => { const t = tramoDe(g); return interpolate(g, [t.a, t.b], [t.z0, t.z1]); };
// cara en el frame global g (px del cuadro a 1×), interpolada del tracking a 10 fps
const caraEn = (g: number) => {
  const t = tramoDe(g);
  const k = ((t.src + (g - t.a)) / FPS) * 10;
  const i = Math.max(0, Math.min(CARA.length - 2, Math.floor(k))), u = Math.min(1, Math.max(0, k - i));
  const [ex, ey, top, menton, w] = CARA[i].map((v, j) => v + (CARA[i + 1][j] - v) * u);
  const s = zoomEn(g);
  const y = (v: number) => ey + (v - ey) * s;
  return {ex, ey, pelo: y(top - 0.4 * w), menton: y(menton)};
};

// ---------- B-roll y pantalla celeste: [desde, hasta (frames), archivo, frame de entrada] ----------
type BRoll = [number, number, string, number];
const BROLL: BRoll[] = [
  [69, 125, 'oferta', 0],
  [331, 395, 'equipo', 0],
];
const CELESTE_TR: [number, number] = [395, 553];
const enBroll = (g: number) => BROLL.some(([a, b]) => g >= a && g < b) || (g >= CELESTE_TR[0] && g < CELESTE_TR[1]);

// zoom-blur en cada corte y light leak cálido al pasar del hook al cuerpo y al CTA
const CORTES = [34, 69, 125, 172, 234, 261, 331, 395, 553, 572, 629];
const LEAKS: number[] = [172, 572];
const pulso = (g: number, c: number) => Math.max(0, 1 - Math.abs(g - c + 0.5) / 3.5);
const zbEn = (g: number) => CORTES.reduce((m, c) => Math.max(m, pulso(g, c)), 0);

const Plano: React.FC<{t: Tramo}> = ({t}) => {
  const g = t.a + useCurrentFrame();
  const {ex, ey} = caraEn(g);
  const zb = zbEn(g);
  return (
    <AbsoluteFill style={{transform: `scale(${zoomEn(g) * (1 + 0.14 * zb)})`, transformOrigin: `${ex}px ${ey}px`, filter: zb > 0.05 ? `blur(${11 * zb}px)` : undefined}}>
      <OffthreadVideo src={staticFile('ism0410/isle.mp4')} startFrom={t.src} muted />
    </AbsoluteFill>
  );
};
const Stock: React.FC<{b: BRoll}> = ({b}) => {
  const [a, z, name, src] = b;
  const g = a + useCurrentFrame();
  const zb = zbEn(g);
  const s = interpolate(g, [a, z], [1.0, 1.08]) * (1 + 0.14 * zb);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, filter: zb > 0.05 ? `blur(${11 * zb}px)` : undefined}}>
      <OffthreadVideo src={staticFile(`ism0410/${name}.mp4`)} startFrom={src} muted />
    </AbsoluteFill>
  );
};

const LightLeak: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      {LEAKS.map((c) => {
        const k = interpolate(fr, [c - 8, c, c + 12], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        if (k <= 0) return null;
        const p = (fr - c + 8) / 20;
        return (
          <AbsoluteFill key={c} style={{mixBlendMode: 'screen', opacity: k}}>
            <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 55% at ${8 + 84 * p}% ${28 + 24 * p}%, rgba(255,205,90,0.95), rgba(226,164,7,0.5) 45%, rgba(0,0,0,0) 75%)`}} />
            <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 45% at ${92 - 70 * p}% ${78 - 30 * p}%, rgba(255,226,170,0.8), rgba(0,0,0,0) 70%)`}} />
            <AbsoluteFill style={{backgroundColor: `rgba(255,240,205,${0.3 * k})`}} />
          </AbsoluteFill>
        );
      })}
    </>
  );
};

const useIO = (dur: number, outF = 3) => {
  const fr = useCurrentFrame();
  const sp = spring({frame: fr, fps: FPS, config: {damping: 13, stiffness: 190}});
  const op = interpolate(fr, [0, 1, Math.max(2, dur - outF), Math.max(3, dur)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return {fr, sp, op};
};
// límites del bloque según la cabeza medida en todos sus frames (solo los frames con speaker)
const limites = (g0: number, dur: number) => {
  let pelo = 1920, menton = 0;
  for (let g = g0; g < g0 + dur; g++) {
    if (enBroll(g)) continue;
    const c = caraEn(g); pelo = Math.min(pelo, c.pelo); menton = Math.max(menton, c.menton);
  }
  return {pelo, menton};
};

// ---------- subtítulos: chicos, sin caja, Montserrat Medium + palabra clave Black Italic (como AP y ARO) ----------
type Sub = [number, number, string];
const Subtitulo: React.FC<{txt: string; g0: number; dur: number}> = ({txt, g0, dur}) => {
  const {fr, op} = useIO(dur, 2);
  // sobre B-roll: centrado en el cuadro; con ella: pegado debajo del mentón (blusa azul → contraste)
  let broll = 0;
  for (let g = g0; g < g0 + dur; g++) if (enBroll(g)) broll++;
  const pos: React.CSSProperties = broll * 2 > dur ? {top: 960 - 30} : {top: Math.round(limites(g0, dur).menton + 22)};
  const sp = spring({frame: fr, fps: FPS, config: {damping: 14, stiffness: 220}});
  const parts = txt.split(/(\*[^*]+\*)/).filter(Boolean);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, ...pos, opacity: op * Math.min(1, sp * 1.5),
        transform: `translateY(${interpolate(sp, [0, 1], [14, 0])}px)`, textAlign: 'center', whiteSpace: 'nowrap', lineHeight: 1,
        textShadow: '0 2px 5px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3)', color: 'white', letterSpacing: '-0.01em'}}>
        {parts.map((p, i) => p.startsWith('*')
          ? <span key={i} style={{fontFamily: MON, fontWeight: 900, fontStyle: 'italic', fontSize: 56}}>{p.slice(1, -1)}</span>
          : <span key={i} style={{fontFamily: MON, fontWeight: 500, fontSize: 54}}>{p}</span>)}
      </div>
    </AbsoluteFill>
  );
};
const SUBS: Sub[] = [
  [5.76, 6.57, 'En este *mercado*'],
  [8.73, 9.25, 'Yo sé que'],
  [9.25, 9.85, 'tu *negocio*'],
  [11.03, 11.95, 'por eso *trabajo* con'],
  [19.067, 19.44, 'Si quieres'],
  [19.44, 19.95, 'un *lender*'],
];

// ---------- piezas de títulos ----------
// "arriba": el borde inferior del estado final queda ~25 px sobre el pelo; "abajo": el borde superior ~40 px bajo el mentón; "centro": sobre B-roll
const Bloque: React.FC<{g0: number; dur: number; donde: 'arriba' | 'abajo' | 'centro'; children: React.ReactNode; sombra?: boolean}> = ({g0, dur, donde, children, sombra = true}) => {
  const {op} = useIO(dur);
  const {pelo, menton} = limites(g0, dur);
  const pos: React.CSSProperties = donde === 'arriba' ? {bottom: 1920 - Math.round(pelo - 25)} : donde === 'abajo' ? {top: Math.round(menton + 40)} : {top: 0, height: 1920, justifyContent: 'center'};
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, ...pos, opacity: op, filter: sombra ? SOMBRA : undefined,
        textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
// oscurece el centro del B-roll para que el título se lea
const Velo: React.FC<{dur: number}> = ({dur}) => {
  const {op} = useIO(dur, 3);
  return <AbsoluteFill style={{opacity: op, background: 'radial-gradient(ellipse 75% 32% at 50% 50%, rgba(3,18,52,0.62), rgba(3,18,52,0.25) 70%, rgba(0,0,0,0) 100%)'}} />;
};
const Pop: React.FC<{d: number; children: React.ReactNode; from?: number}> = ({d, children, from = 0.55}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 10, stiffness: 210}});
  return <div style={{opacity: fr < 0 ? 0 : Math.min(1, sp * 1.6), transform: `scale(${fr < 0 ? from : interpolate(sp, [0, 1], [from, 1])})`}}>{children}</div>;
};
const Sube: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 14, stiffness: 180}});
  return <div style={{opacity: fr < 0 ? 0 : Math.min(1, sp * 1.4), transform: `translateY(${interpolate(sp, [0, 1], [22, 0])}px)`}}>{children}</div>;
};
// slam: entra grande y con desenfoque, golpea y tiembla un instante
const Slam: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 9, stiffness: 260}});
  const temblor = fr >= 0 && fr < 8 ? Math.sin(fr * 2.6) * (8 - fr) * 0.9 : 0;
  return <div style={{opacity: fr < 0 ? 0 : Math.min(1, sp * 2), transform: `translateX(${temblor}px) scale(${fr < 0 ? 2 : interpolate(sp, [0, 1], [2, 1])})`,
    filter: `blur(${fr < 0 ? 8 : interpolate(sp, [0, 0.6], [8, 0], {extrapolateRight: 'clamp'})}px)`}}>{children}</div>;
};
const Filete: React.FC<{d: number; w: number; m?: string}> = ({d, w, m = '12px auto 14px'}) => {
  const fr = useCurrentFrame();
  const k = interpolate(fr, [d, d + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)});
  return <div style={{width: w * k, height: 3, backgroundColor: DORADO, margin: m}} />;
};
// tachado dorado que se dibuja de izquierda a derecha
const Tachado: React.FC<{d: number; children: React.ReactNode; grosor?: number}> = ({d, children, grosor = 9}) => {
  const fr = useCurrentFrame();
  const k = interpolate(fr, [d, d + 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'relative', display: 'inline-block'}}>
      {children}
      <div style={{position: 'absolute', left: -12, top: '54%', height: grosor, width: `calc((100% + 24px) * ${k})`, backgroundColor: DORADO, borderRadius: grosor,
        transform: 'rotate(-3deg)', transformOrigin: 'left center', boxShadow: '0 2px 8px rgba(0,0,0,0.35)'}} />
    </div>
  );
};
// palabra fuerte en MAYÚSCULA: Montserrat Black azul Pioneer con borde blanco (como "TERMINADA" de ARO)
const fuerte = (size: number): React.CSSProperties => ({fontFamily: MON, fontWeight: 900, fontSize: size, lineHeight: 0.9, color: AZUL, whiteSpace: 'nowrap',
  WebkitTextStroke: `${Math.round(size / 12)}px white`, paintOrder: 'stroke fill', letterSpacing: '-0.01em'});
const chico = (size = 44): React.CSSProperties => ({fontFamily: MON, fontWeight: 600, fontSize: size, lineHeight: 1, whiteSpace: 'nowrap'});
const italica = (size: number, color = HUESO): React.CSSProperties => ({fontFamily: BOD, fontWeight: 700, fontStyle: 'italic', fontSize: size, lineHeight: 0.9, color, whiteSpace: 'nowrap'});

const CHECK = (s: number) => (
  <svg width={s} height={s} viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill={DORADO} /><path d="M13 25 L21 33 L36 16" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const RELOJ = (s: number) => (
  <svg width={s} height={s} viewBox="0 0 48 48"><circle cx="24" cy="24" r="21.5" fill="none" stroke={DORADO} strokeWidth="3.5" /><path d="M24 12 V25 L32 30" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const LUNA = (s: number) => (
  <svg width={s} height={s} viewBox="0 0 48 48"><path d="M30 6 A19 19 0 1 0 42 32 A15 15 0 0 1 30 6 Z" fill={DORADO} /><circle cx="38" cy="12" r="2" fill={CREMA} /><circle cx="43" cy="20" r="1.4" fill={CREMA} /></svg>
);

type TP = {g0: number; dur: number};
// HOOK — "¿Tu lender te contesta?": golpe con barra dorada DETRÁS de la cabeza (rotoscopia)
// base de las mayúsculas ~55 px bajo el tope del pelo (máscara: 722–734 px a 1×)
const H1_CENTRO = 742;
const H1: React.FC<TP> = ({dur}) => {
  const {op} = useIO(dur, 1);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <div style={{position: 'absolute', left: 0, width: 1080, bottom: 1920 - (H1_CENTRO - 76), textAlign: 'center', color: 'white', filter: SOMBRA}}>
        <Sube d={0}><div style={chico(50)}>¿Tu <span style={{fontWeight: 900, fontStyle: 'italic'}}>lender</span></div></Sube>
      </div>
      <TituloBarra d={f(0.40)} top={H1_CENTRO} size={118}>TE CONTESTA?</TituloBarra>
    </AbsoluteFill>
  );
};
// recorte de Isledys (máscara de Vision sobre isle.mp4 desde el frame 15) con el mismo zoom que el plano
const Roto: React.FC = () => {
  const g = useCurrentFrame();
  const t = tramoDe(g);
  const {ex, ey} = caraEn(g);
  const zb = zbEn(g);
  return (
    <AbsoluteFill style={{transform: `scale(${zoomEn(g) * (1 + 0.14 * zb)})`, transformOrigin: `${ex}px ${ey}px`, filter: zb > 0.05 ? `blur(${11 * zb}px)` : undefined}}>
      <OffthreadVideo src={staticFile('ism0410/roto_hook.mov')} startFrom={t.src - 15} transparent muted />
    </AbsoluteFill>
  );
};
// "si es viernes en la noche"
const H2: React.FC<TP> = ({g0, dur}) => {
  const o = 1.133;
  return (
    <Bloque g0={g0} dur={dur} donde="arriba">
      <Sube d={0}><div style={chico(44)}>si es</div></Sube>
      <Pop d={f(1.33 - o)}><div style={{...italica(124, CREMA), textShadow: GLOW, marginTop: 14}}>viernes</div></Pop>
      <Sube d={f(1.65 - o)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 16}}>{LUNA(50)}<span style={chico(46)}>en la noche</span></div>
      </Sube>
    </Bloque>
  );
};
// "tu cliente necesita enviar una oferta" (sobre la firma)
const O1: React.FC<TP> = ({g0, dur}) => {
  const o = 2.30;
  return (
    <Bloque g0={g0} dur={dur} donde="centro">
      <Sube d={1}><div style={chico(46)}>tu cliente necesita enviar</div></Sube>
      <Pop d={f(3.53 - o)}><div style={{...italica(116), marginTop: 22}}>una oferta</div></Pop>
      <Filete d={f(3.75 - o)} w={380} m="20px auto 0" />
    </Bloque>
  );
};
// "y necesitas la pre-aprobación ya"
const P1: React.FC<TP> = ({g0, dur}) => {
  const o = 4.167;
  return (
    <Bloque g0={g0} dur={dur} donde="arriba">
      <Sube d={1}><div style={chico(44)}>y necesitas la</div></Sube>
      <Sube d={f(4.90 - o)}><div style={{...italica(96, CREMA), textShadow: GLOW, marginTop: 16}}>pre-aprobación</div></Sube>
      <Slam d={f(5.48 - o)}><div style={{...fuerte(150), marginTop: 18}}>YA</div></Slam>
    </Bloque>
  );
};
// "una oferta que sale tarde"
const M1: React.FC<TP> = ({g0, dur}) => {
  const o = 6.567;
  return (
    <Bloque g0={g0} dur={dur} donde="arriba">
      <Sube d={1}><div style={chico(44)}>una oferta que sale</div></Sube>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 14}}>
        <Pop d={f(7.36 - o)} from={0.2}>{RELOJ(84)}</Pop>
        <Pop d={f(7.40 - o)}><div style={italica(128)}>tarde</div></Pop>
      </div>
    </Bloque>
  );
};
// "es una oferta perdida"
const M2: React.FC<TP> = ({g0, dur}) => {
  const o = 7.80;
  return (
    <Bloque g0={g0} dur={dur} donde="arriba">
      <Sube d={0}><div style={chico(44)}>es una oferta</div></Sube>
      <Slam d={f(8.26 - o)}><div style={{...fuerte(124), marginTop: 18}}>PERDIDA</div></Slam>
    </Bloque>
  );
};
// "no tiene horario de oficina" con tachado dorado
const N1: React.FC<TP> = ({g0, dur}) => {
  const o = 9.833;
  return (
    <Bloque g0={g0} dur={dur} donde="arriba">
      <Sube d={1}><div style={chico(44)}>no tiene</div></Sube>
      <Sube d={f(10.15 - o)}><div style={{marginTop: 16}}><Tachado d={f(10.70 - o)}><div style={italica(92)}>horario de oficina</div></Tachado></div></Sube>
    </Bloque>
  );
};
// "con mis Realtors en equipo" (sobre el apretón de manos): golpe con barra dorada centrado
const E1: React.FC<TP> = ({dur}) => {
  const {op} = useIO(dur, 2);
  const o = 11.95;
  return (
    <AbsoluteFill style={{opacity: op}}>
      <div style={{position: 'absolute', left: 0, width: 1080, bottom: 1920 - (960 - 80), textAlign: 'center', color: 'white', filter: SOMBRA}}>
        <Sube d={0}><div style={chico(46)}>con mis</div></Sube>
      </div>
      <TituloBarra d={f(12.10 - o)} top={960} size={124}>REALTORS</TituloBarra>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 960 + 86, textAlign: 'center', filter: SOMBRA}}>
        <Sube d={f(12.72 - o)}><div style={italica(74)}>en equipo</div></Sube>
      </div>
    </AbsoluteFill>
  );
};
// pantalla CELESTE: "te actualizo en cada etapa, te aviso antes de que haya un problema y te respondo cuando me necesitas"
const Palabra: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 13, stiffness: 220}});
  return <span style={{display: 'inline-block', margin: '0 0.13em', opacity: fr < 0 ? 0 : Math.min(1, sp * 1.6),
    transform: `translateY(${fr < 0 ? 40 : interpolate(sp, [0, 1], [40, 0])}px)`, filter: `blur(${fr < 0 ? 6 : interpolate(sp, [0, 0.7], [6, 0], {extrapolateRight: 'clamp'})}px)`}}>{children}</span>;
};
const Item: React.FC<{d: number; txt: string}> = ({d, txt}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 12, stiffness: 200}});
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 12, opacity: fr < 0 ? 0 : Math.min(1, sp * 1.5),
      transform: `translateX(${fr < 0 ? -80 : interpolate(sp, [0, 1], [-80, 0])}px)`}}>
      <div style={{transform: `scale(${fr < 0 ? 0 : interpolate(sp, [0, 1], [0.3, 1])})`, display: 'flex', flexShrink: 0}}>{CHECK(54)}</div>
      <div style={{fontFamily: BOD, fontWeight: 700, fontStyle: 'italic', fontSize: 62, color: AZUL, lineHeight: 1, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
};
const Linea: React.FC<{palabras: [number, string][]; o: number}> = ({palabras, o}) => (
  <div style={{fontFamily: MON, fontWeight: 600, fontSize: 44, lineHeight: 1, whiteSpace: 'nowrap', color: AZUL, textAlign: 'center'}}>
    {palabras.map(([t, w], i) => <Palabra key={i} d={f(t - o)}>{w}</Palabra>)}
  </div>
);
const Celeste: React.FC<TP> = ({dur}) => {
  const fr = useCurrentFrame();
  const o = 13.167;
  // entra como cortina desde abajo; sale con zoom-blur al volver a ella
  const k = interpolate(fr, [0, 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)});
  const deriva = interpolate(fr, [0, dur], [0, -40]);
  const zb = pulso(o * FPS + fr, CELESTE_TR[1]);
  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - k) * 100}% 0 0 0)`, transform: `scale(${1 + 0.14 * zb})`, filter: zb > 0.05 ? `blur(${11 * zb}px)` : undefined}}>
      <AbsoluteFill style={{backgroundImage: `radial-gradient(ellipse 90% 60% at 50% 45%, #E9F4FB 0%, ${CELESTE} 55%, #B7D6EC 100%)`}} />
      <AbsoluteFill style={{transform: `translateY(${deriva}px)`, opacity: 0.35,
        backgroundImage: `repeating-linear-gradient(115deg, rgba(7,63,167,0.07) 0 2px, rgba(0,0,0,0) 2px 46px)`}} />
      <div style={{position: 'absolute', left: 540 - 260, top: 676, width: 520, height: 4, backgroundColor: DORADO, transform: `scaleX(${k})`}} />
      <div style={{position: 'absolute', left: 0, width: 1080, top: 0, height: 1920, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 46}}>
        <div style={{width: 1080}}>
          <Linea o={o} palabras={[[13.16, 'te'], [13.26, 'actualizo']]} />
          <Item d={f(13.78 - o)} txt="en cada etapa" />
        </div>
        <div style={{width: 1080}}>
          <Linea o={o} palabras={[[14.57, 'te'], [14.69, 'aviso'], [15.19, 'antes'], [15.45, 'de'], [15.55, 'que'], [15.65, 'haya']]} />
          <Item d={f(15.81 - o)} txt="un problema" />
        </div>
        <div style={{width: 1080}}>
          <Linea o={o} palabras={[[16.49, 'y'], [16.55, 'te'], [16.69, 'respondo']]} />
          <Item d={f(17.43 - o)} txt="cuando me necesitas" />
        </div>
      </div>
      <div style={{position: 'absolute', left: 540 - 260, top: 1240, width: 520, height: 4, backgroundColor: DORADO, transform: `scaleX(${k})`}} />
    </AbsoluteFill>
  );
};
// "no el lunes": LUNES tachado
const L1: React.FC<TP> = ({g0, dur}) => {
  const o = 18.433;
  return (
    <Bloque g0={g0} dur={dur} donde="arriba">
      <Sube d={0}><div style={italica(74)}>no el</div></Sube>
      <Slam d={f(18.72 - o)}><div style={{marginTop: 16}}><Tachado d={f(18.86 - o)} grosor={12}><div style={fuerte(132)}>LUNES</div></Tachado></div></Slam>
    </Bloque>
  );
};
// CTA — "que juegue EN TU EQUIPO": golpe con barra dorada arriba de la cabeza
const C1: React.FC<TP> = ({g0, dur}) => {
  const {op} = useIO(dur, 1);
  const o = 19.95;
  const {pelo} = limites(g0, dur);
  const centro = Math.round(pelo - 25 - (118 * 1.25) / 2);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <div style={{position: 'absolute', left: 0, width: 1080, bottom: 1920 - (centro - 82), textAlign: 'center', color: 'white', filter: SOMBRA}}>
        <Sube d={0}><div style={chico(46)}>un lender que juegue</div></Sube>
      </div>
      <TituloBarra d={f(20.24 - o)} top={centro} size={118}>EN TU EQUIPO</TituloBarra>
    </AbsoluteFill>
  );
};
// "escríbeme y hablamos" (como el CTA de ARO), al pecho
const C2: React.FC<TP> = ({g0, dur}) => {
  const o = 20.967;
  return (
    <Bloque g0={g0} dur={dur} donde="abajo">
      <Pop d={f(21.0 - o)} from={0.6}>
        <div style={{fontFamily: MON, fontWeight: 900, fontSize: 112, lineHeight: 1.2, marginTop: -14, whiteSpace: 'nowrap', letterSpacing: '-0.01em',
          backgroundImage: `linear-gradient(180deg, #FFFFFF 0%, ${HUESO} 55%, #E6DCC2 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>ESCRÍBEME</div>
      </Pop>
      <Sube d={f(21.63 - o)}><div style={{...italica(70), marginTop: 14}}>y hablamos</div></Sube>
    </Bloque>
  );
};

// cierre con nombre + NMLS (como el 01-10 y 02-10; el editor lo pidió de nuevo en el 04-10)
const Pie: React.FC<{dur: number; txt: string}> = ({dur, txt}) => {
  const {op} = useIO(dur, 1);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 1212, textAlign: 'center', opacity: op * 0.95,
        fontFamily: MON, fontWeight: 500, fontSize: 28, color: 'white', letterSpacing: '0.04em'}}><span style={{backgroundColor: 'rgba(7,30,80,0.6)', padding: '6px 16px', borderRadius: 8}}>{txt}</span></div>
    </AbsoluteFill>
  );
};

export const TITULOS: [number, number, (p: TP) => React.ReactNode][] = [
  [1.133, 2.30, (p) => <H2 {...p} />],
  [2.30, 4.167, (p) => <Velo dur={p.dur} />],
  [2.30, 4.167, (p) => <O1 {...p} />],
  [4.167, 5.733, (p) => <P1 {...p} />],
  [6.567, 7.80, (p) => <M1 {...p} />],
  [7.80, 8.70, (p) => <M2 {...p} />],
  [9.833, 11.033, (p) => <N1 {...p} />],
  [11.033, 13.167, (p) => <Velo dur={p.dur} />],
  [11.95, 13.167, (p) => <E1 {...p} />],
  [13.167, 18.433, (p) => <Celeste {...p} />],
  [18.433, 19.067, (p) => <L1 {...p} />],
  [19.95, 20.967, (p) => <C1 {...p} />],
  [20.967, 22.133, (p) => <C2 {...p} />],
  [20.967, 22.133, (p) => <Pie dur={p.dur} txt="Mortgage Loan Originator NMLS# 1924019" />],
];

const Guias: React.FC = () => {
  const g = useCurrentFrame();
  const c = caraEn(g);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 980, border: '3px dashed #00ff66'}} />
      <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, backgroundColor: 'rgba(0,255,255,0.5)'}} />
      {!enBroll(g) && <div style={{position: 'absolute', left: 0, width: 1080, top: c.pelo, height: c.menton - c.pelo, backgroundColor: 'rgba(255,0,0,0.18)', borderTop: '2px solid red', borderBottom: '2px solid red'}} />}
    </AbsoluteFill>
  );
};

export const ISM0410: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    {TRAMOS.map((t, i) => (
      <Sequence key={i} from={t.a} durationInFrames={t.b - t.a}>
        <Plano t={t} />
      </Sequence>
    ))}
    {BROLL.map((b, i) => (
      <Sequence key={'b' + i} from={b[0]} durationInFrames={b[1] - b[0]}>
        <Stock b={b} />
      </Sequence>
    ))}
    <LightLeak />
    <Sequence from={0} durationInFrames={34}><H1 g0={0} dur={34} /></Sequence>
    <Sequence from={0} durationInFrames={34}><Roto /></Sequence>
    {SUBS.map(([a, b, txt], i) => (
      <Sequence key={'s' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        <Subtitulo txt={txt} g0={f(a)} dur={f(b) - f(a)} />
      </Sequence>
    ))}
    {TITULOS.map(([a, b, el], i) => (
      <Sequence key={'t' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        {el({g0: f(a), dur: f(b) - f(a)})}
      </Sequence>
    ))}
    <Logos />
    {GUIAS && <Guias />}
  </AbsoluteFill>
);
