// PLANTILLA (ISM 02-10, 2026-10-26). Va en remotion-elevate/src/<id>/Video.tsx; espera en public/: fonts/ (Bodoni URW desde Creative Cloud + Montserrat de assets/), ism/ (logos de assets/logos/) y <id>/ (isle.mp4 escalado, stock, roto_hook.mov). cara.ts sale de track_cara.swift.
import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, getInputProps, interpolate, spring,
  staticFile, useCurrentFrame,
} from 'remotion';
import {Logos} from '../ism/Logos';
import {CARA} from './cara';

// ISM 02-10 PAUTA "El lender le cambió los números" — Isledys de pie a cámara (crudo 576×1024 ya montado) + primer B-roll de stock
export const FPS = 30;
export const ISM0210_FRAMES = 781;
const f = (s: number) => Math.round(s * FPS);
const GUIAS = Boolean((getInputProps() as {guias?: boolean}).guias);

const AZUL = '#073FA7', CELESTE = '#CDE5F4', DORADO = '#E2A407', HUESO = '#F5F5F0';
const BOD = 'Bodoni URW', MON = 'Montserrat';
const SOMBRA = 'drop-shadow(0 2px 4px rgba(0,0,0,0.55)) drop-shadow(0 6px 18px rgba(0,0,0,0.35))';

const FONTS: [string, string, number, string][] = [
  [BOD, 'BodoniURW-Bol.otf', 700, 'normal'], [BOD, 'BodoniURW-BolObl.otf', 700, 'italic'],
  [BOD, 'BodoniURW-Med.otf', 500, 'normal'], [BOD, 'BodoniURW-MedObl.otf', 500, 'italic'],
  [BOD, 'BodoniURW-RegObl.otf', 400, 'italic'],
  [MON, 'Montserrat-Medium.ttf', 500, 'normal'], [MON, 'Montserrat-SemiBold.ttf', 600, 'normal'], [MON, 'Montserrat-Bold.ttf', 700, 'normal'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([fam, file, weight, style]) =>
  new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight: String(weight), style}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

// ---------- tramos del speaker (frames del timeline → frame de entrada en isle.mp4) ----------
type Tramo = {a: number; b: number; src: number; z0: number; z1: number};
const TRAMOS: Tramo[] = [
  {a: 0, b: 90, src: 28, z0: 1.0, z1: 1.05},
  {a: 90, b: 183, src: 148, z0: 1.0, z1: 1.04},
  {a: 183, b: 273, src: 304, z0: 1.02, z1: 1.07},
  {a: 273, b: 358, src: 414, z0: 1.0, z1: 1.04},
  {a: 358, b: 477, src: 530, z0: 1.0, z1: 1.04},
  {a: 477, b: 620, src: 681, z0: 1.0, z1: 1.05},
  {a: 620, b: 687, src: 858, z0: 1.02, z1: 1.06},
  {a: 687, b: 781, src: 954, z0: 1.0, z1: 1.06},
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

// ---------- B-roll: [desde, hasta (frames), archivo, frame de entrada] ----------
type BRoll = [number, number, string, number];
const BROLL: BRoll[] = [
  [90, 143, 'sold', 0],
  [273, 358, 'docs', 0],
  [358, 412, 'pareja', 0],
  [412, 446, 'agenda', 30],
  [563, 620, 'firma', 0],
];
const enBroll = (g: number) => BROLL.some(([a, b]) => g >= a && g < b);

// zoom-blur en cada corte y destello dorado al pasar a "Por eso yo reviso"
const CORTES = [90, 143, 183, 273, 358, 412, 446, 477, 563, 620, 687];
const LEAKS: number[] = [];
const pulso = (g: number, c: number) => Math.max(0, 1 - Math.abs(g - c + 0.5) / 3.5);
const zbEn = (g: number) => CORTES.reduce((m, c) => Math.max(m, pulso(g, c)), 0);

const Plano: React.FC<{t: Tramo}> = ({t}) => {
  const g = t.a + useCurrentFrame();
  const {ex, ey} = caraEn(g);
  const zb = zbEn(g);
  return (
    <AbsoluteFill style={{transform: `scale(${zoomEn(g) * (1 + 0.14 * zb)})`, transformOrigin: `${ex}px ${ey}px`, filter: zb > 0.05 ? `blur(${11 * zb}px)` : undefined}}>
      <OffthreadVideo src={staticFile('ism0210/isle.mp4')} startFrom={t.src} muted />
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
      <OffthreadVideo src={staticFile(`ism0210/${name}.mp4`)} startFrom={src} muted />
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
            <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 45% at ${92 - 70 * p}% ${78 - 30 * p}%, rgba(205,229,244,0.85), rgba(0,0,0,0) 70%)`}} />
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

// ---------- subtítulos: Montserrat SemiBold + palabra clave Bodoni Bold Italic en marcador azul con filete dorado ----------
type Sub = [number, number, string];
const Subtitulo: React.FC<{txt: string; g0: number; dur: number}> = ({txt, g0, dur}) => {
  const {fr, op} = useIO(dur, 2);
  // sobre B-roll: centrado en el cuadro; con el speaker: pegado sobre el pelo (debajo del mentón está el saco amarillo claro)
  let broll = 0;
  for (let g = g0; g < g0 + dur; g++) if (enBroll(g)) broll++;
  const sobreBroll = broll * 2 > dur;
  const pos: React.CSSProperties = sobreBroll ? {top: 960 - 38} : {bottom: 1920 - Math.round(limites(g0, dur).pelo - 22)};
  const sp = spring({frame: fr, fps: FPS, config: {damping: 14, stiffness: 220}});
  const parts = txt.split(/(\*[^*]+\*)/).filter(Boolean);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, ...pos, opacity: op * Math.min(1, sp * 1.5), filter: SOMBRA,
        transform: `translateY(${interpolate(sp, [0, 1], [14, 0])}px)`, textAlign: 'center', whiteSpace: 'nowrap', lineHeight: 1}}>
        {parts.map((p, i) => p.startsWith('*')
          ? <span key={i} style={{fontFamily: BOD, fontWeight: 700, fontStyle: 'italic', fontSize: 66, color: 'white', display: 'inline-block', padding: '2px 14px 6px',
              margin: '0 4px', backgroundColor: 'rgba(7,63,167,0.88)', borderBottom: `4px solid ${DORADO}`, borderRadius: 6, transform: `scaleX(${Math.min(1, sp * 1.3)})`, transformOrigin: 'left center'}}>{p.slice(1, -1)}</span>
          : <span key={i} style={{fontFamily: MON, fontWeight: 600, fontSize: 54, color: 'white', letterSpacing: '-0.01em', textShadow: '0 2px 6px rgba(0,0,0,0.6)'}}>{p}</span>)}
      </div>
    </AbsoluteFill>
  );
};
const SUBS: Sub[] = [
  [1.75, 2.25, 'estás en el'],
  [2.25, 3.0, '*lugar correcto*'],
  [3.0, 3.95, '¿Tu cliente ya tenía'],
  [3.95, 4.77, 'la oferta *aceptada*'],
  [7.40, 8.11, 'que le puede pasar'],
  [8.11, 9.10, 'a una *transacción*'],
  [9.10, 9.95, 'Una *preaprobación*'],
  [9.95, 10.70, 'hecha *rápida*'],
  [10.70, 11.30, 'y sin revisar'],
  [11.30, 11.933, '*documentos*'],
  [11.933, 12.70, 'El cliente ya'],
  [12.70, 13.12, 'se *enamoró*'],
  [13.12, 13.733, 'de la casa,'],
  [13.733, 14.32, 'tú invertiste'],
  [14.32, 14.867, '*semanas*'],
  [18.767, 19.45, 'antes de *emitir*'],
  [19.45, 19.95, 'la carta'],
  [19.95, 20.667, 'de *pre-aprobación*'],
];

// ---------- piezas de títulos ----------
// "arriba": el borde inferior del estado final queda ~25 px sobre el pelo; "abajo": el borde superior ~40 px bajo el mentón
const Bloque: React.FC<{g0: number; dur: number; donde: 'arriba' | 'abajo'; children: React.ReactNode; sombra?: boolean}> = ({g0, dur, donde, children, sombra = true}) => {
  const {op} = useIO(dur);
  const {pelo, menton} = limites(g0, dur);
  const pos: React.CSSProperties = donde === 'arriba' ? {bottom: 1920 - Math.round(pelo - 25)} : {top: Math.round(menton + 40)};
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, ...pos, opacity: op, filter: sombra ? SOMBRA : undefined,
        textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
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
// entra con pop y a los ~6 frames "se cae": se inclina sobre su esquina izquierda y baja un poco (no cruza las otras líneas)
const Cae: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 16, stiffness: 230}});
  const k = spring({frame: Math.max(0, fr - 7), fps: FPS, config: {damping: 9, stiffness: 160}});
  return (
    <div style={{opacity: fr < 0 ? 0 : Math.min(1, sp * 1.6), transform: `scale(${interpolate(sp, [0, 1], [0.55, 1])})`}}>
      <div style={{transform: `translateY(${6 * k}px) rotate(${4 * k}deg)`, transformOrigin: '8% 90%'}}>{children}</div>
    </div>
  );
};
// números que tiemblan al entrar (el lender los "movió")
const Tiembla: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const fr = useCurrentFrame() - d;
  const k = fr < 0 ? 0 : Math.max(0, 1 - fr / 12);
  const dx = Math.sin(fr * 2.7) * 10 * k, rot = Math.sin(fr * 3.3) * 3 * k;
  return <div style={{transform: `translateX(${dx}px) rotate(${rot}deg)`}}>{children}</div>;
};
const Crece: React.FC<{d: number; h: number; children: React.ReactNode}> = ({d, h, children}) => {
  const fr = useCurrentFrame() - d;
  const k = interpolate(fr, [0, 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)});
  return <div style={{height: h * k, overflow: 'visible', opacity: Math.min(1, k * 1.4)}}>{children}</div>;
};
const CHECK = (s: number) => (
  <svg width={s} height={s} viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill={DORADO} /><path d="M13 25 L21 33 L36 16" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const CASA = (s: number) => (
  <svg width={s} height={s} viewBox="0 0 48 48"><path d="M6 23 L24 8 L42 23" stroke={DORADO} strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 20 V40 H36 V20" stroke="white" strokeWidth="4" fill="none" strokeLinejoin="round" /><rect x="20.5" y="28" width="7" height="12" fill="white" /></svg>
);

type TP = {g0: number; dur: number};
// HOOK — "Si eres realtor y te pasó esto": REALTOR grande DETRÁS de la cabeza (rotoscopia); arriba se reemplaza "Si eres" → "y te pasó esto"
const REALTOR_BASE = 655; // base de las mayúsculas: ~55 px bajo el tope del pelo en su punto más alto (máscara: 600–638 px)
const T1: React.FC<TP> = ({dur}) => {
  const fr = useCurrentFrame();
  const {op} = useIO(dur);
  const sp = spring({frame: Math.max(0, fr - f(0.34)), fps: FPS, config: {damping: 14, stiffness: 170}});
  const sale = interpolate(fr, [f(0.84), f(0.89)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: op}}>
      <div style={{position: 'absolute', left: 0, width: 1080, top: REALTOR_BASE - 112, height: 112, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', filter: SOMBRA}}>
        <div style={{fontFamily: BOD, fontWeight: 700, fontSize: 152, lineHeight: 0.66, color: DORADO, letterSpacing: '0.01em', whiteSpace: 'nowrap',
          opacity: fr < f(0.34) ? 0 : Math.min(1, sp * 1.5), transform: `scale(${interpolate(sp, [0, 1], [1.25, 1])})`, transformOrigin: 'center bottom',
          filter: `blur(${interpolate(sp, [0, 0.6], [10, 0], {extrapolateRight: 'clamp'})}px)`}}>REALTOR</div>
      </div>
      <div style={{position: 'absolute', left: 0, width: 1080, bottom: 1920 - (REALTOR_BASE - 134), textAlign: 'center', color: 'white', filter: SOMBRA}}>
        <div style={{position: 'relative', height: 70}}>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, opacity: sale}}><Sube d={0}><div style={{fontFamily: MON, fontWeight: 600, fontSize: 50, lineHeight: 1}}>Si eres</div></Sube></div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0}}><Sube d={f(0.89)}><div style={{fontFamily: BOD, fontWeight: 400, fontStyle: 'italic', fontSize: 66, lineHeight: 1}}>y te pasó esto</div></Sube></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
// recorte de Isledys (máscara de Vision sobre isle.mp4 desde el frame 28) con el mismo zoom que el plano
const Roto: React.FC = () => {
  const g = useCurrentFrame(); // la Sequence empieza en 0, así que g también es el frame global
  const {ex, ey} = caraEn(g);
  const zb = zbEn(g);
  return (
    <AbsoluteFill style={{transform: `scale(${zoomEn(g) * (1 + 0.14 * zb)})`, transformOrigin: `${ex}px ${ey}px`}}>
      <OffthreadVideo src={staticFile('ism0210/roto_hook.mov')} startFrom={0} transparent muted />
    </AbsoluteFill>
  );
};
// "y el lender le cambió los números?"
const T2: React.FC<TP> = ({g0, dur}) => {
  const o = 4.767;
  return (
    <Bloque g0={g0} dur={dur} donde="arriba">
      <Sube d={1}><div style={{fontFamily: MON, fontWeight: 600, fontSize: 46, lineHeight: 1}}>y el <span style={{fontFamily: BOD, fontWeight: 700, fontStyle: 'italic', fontSize: 60}}>lender</span> le cambió</div></Sube>
      <Pop d={f(5.50 - o)}><Tiembla d={f(5.50 - o)}><div style={{fontFamily: BOD, fontWeight: 700, fontSize: 86, lineHeight: 1, marginTop: 8}}>los <span style={{color: DORADO}}>NÚMEROS?</span></div></Tiembla></Pop>
    </Bloque>
  );
};
// "Esa es una de las peores cosas que le puede pasar a una transacción"
const T3: React.FC<TP> = ({g0, dur}) => {
  const o = 6.10;
  return (
    <Bloque g0={g0} dur={dur} donde="arriba">
      <Sube d={1}><div style={{fontFamily: MON, fontWeight: 600, fontSize: 42, lineHeight: 1}}>Esa es una de las</div></Sube>
      <Pop d={f(6.74 - o)}><div style={{fontFamily: BOD, fontWeight: 700, fontSize: 128, lineHeight: 0.85, marginTop: 20}}>PEORES</div></Pop>
      <Sube d={f(7.07 - o)}><div style={{fontFamily: BOD, fontWeight: 400, fontStyle: 'italic', fontSize: 62, lineHeight: 1, marginTop: 8, color: 'white'}}>cosas</div></Sube>
    </Bloque>
  );
};
// "y se cae todo al final"
const T4: React.FC<TP> = ({g0, dur}) => {
  const o = 14.867;
  return (
    <Bloque g0={g0} dur={dur} donde="arriba">
      <Sube d={1}><div style={{fontFamily: MON, fontWeight: 600, fontSize: 44, lineHeight: 1}}>y se cae</div></Sube>
      <Cae d={f(15.26 - o)}><div style={{fontFamily: BOD, fontWeight: 700, fontSize: 140, lineHeight: 0.85, marginTop: 26, marginBottom: 34}}>TODO</div></Cae>
      <Sube d={f(15.50 - o)}><div style={{fontFamily: BOD, fontWeight: 400, fontStyle: 'italic', fontSize: 60, lineHeight: 1, marginTop: 8, color: 'white'}}>al final</div></Sube>
    </Bloque>
  );
};
// placa: "Por eso yo reviso ingresos, deudas, cuentas de ahorro"
const Fila: React.FC<{d: number; txt: string}> = ({d, txt}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 11, stiffness: 210}});
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 12}}>
      <div style={{transform: `scale(${fr < 0 ? 0 : interpolate(sp, [0, 1], [0.2, 1])})`, display: 'flex'}}>{CHECK(50)}</div>
      <div style={{fontFamily: BOD, fontWeight: 700, fontStyle: 'italic', fontSize: 56, color: AZUL, lineHeight: 1, whiteSpace: 'nowrap',
        opacity: fr < 0 ? 0 : Math.min(1, sp * 1.5), transform: `translateX(${fr < 0 ? 30 : interpolate(sp, [0, 1], [30, 0])}px)`}}>{txt}</div>
    </div>
  );
};
const T5: React.FC<TP> = ({g0, dur}) => {
  const o = 15.9;
  const {sp, op} = useIO(dur, 2);
  const {menton} = limites(g0, dur);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 540 - 340, width: 680, top: Math.round(menton + 40), opacity: op, filter: 'drop-shadow(0 10px 26px rgba(0,0,0,0.35))'}}>
        <div style={{backgroundColor: CELESTE, borderRadius: 26, padding: '22px 40px 26px', transform: `scale(${interpolate(sp, [0, 1], [0.7, 1])})`, transformOrigin: 'top center',
          borderBottom: `6px solid ${DORADO}`}}>
          <div style={{fontFamily: MON, fontWeight: 600, fontSize: 40, color: AZUL, textAlign: 'center', lineHeight: 1}}>Por eso yo reviso</div>
          <Crece d={f(16.72 - o)} h={74}><Fila d={f(16.76 - o)} txt="ingresos" /></Crece>
          <Crece d={f(17.36 - o)} h={74}><Fila d={f(17.40 - o)} txt="deudas" /></Crece>
          <Crece d={f(17.84 - o)} h={74}><Fila d={f(17.88 - o)} txt="cuentas de ahorro" /></Crece>
        </div>
      </div>
    </AbsoluteFill>
  );
};
// pantalla CELESTE (15.9–18.77): fondo de marca a pantalla completa y el texto que dice entra palabra por palabra
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
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 26, opacity: fr < 0 ? 0 : Math.min(1, sp * 1.5),
      transform: `translateX(${fr < 0 ? -80 : interpolate(sp, [0, 1], [-80, 0])}px)`}}>
      <div style={{transform: `scale(${fr < 0 ? 0 : interpolate(sp, [0, 1], [0.3, 1])})`, display: 'flex'}}>{CHECK(62)}</div>
      <div style={{fontFamily: BOD, fontWeight: 700, fontStyle: 'italic', fontSize: 74, color: AZUL, lineHeight: 1, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
};
const Celeste: React.FC<TP> = ({dur}) => {
  const fr = useCurrentFrame();
  const o = 15.9;
  // entra como cortina desde abajo y sale con un corte al B-roll de la firma
  const k = interpolate(fr, [0, 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)});
  const deriva = interpolate(fr, [0, dur], [0, -40]);
  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - k) * 100}% 0 0 0)`}}>
      <AbsoluteFill style={{backgroundImage: `radial-gradient(ellipse 90% 60% at 50% 45%, #E9F4FB 0%, ${CELESTE} 55%, #B7D6EC 100%)`}} />
      <AbsoluteFill style={{transform: `translateY(${deriva}px)`, opacity: 0.35,
        backgroundImage: `repeating-linear-gradient(115deg, rgba(7,63,167,0.07) 0 2px, rgba(0,0,0,0) 2px 46px)`}} />
      <div style={{position: 'absolute', left: 540 - 260, top: 716, width: 520, height: 4, backgroundColor: DORADO, transform: `scaleX(${k})`}} />
      <div style={{position: 'absolute', left: 0, width: 1080, top: 780, textAlign: 'center', color: AZUL}}>
        <div style={{fontFamily: MON, fontWeight: 600, fontSize: 60, lineHeight: 1, whiteSpace: 'nowrap'}}>
          <Palabra d={f(15.94 - o)}>Por</Palabra><Palabra d={f(16.08 - o)}>eso</Palabra><Palabra d={f(16.26 - o)}>yo</Palabra>
          <Palabra d={f(16.36 - o)}><span style={{fontFamily: BOD, fontWeight: 700, fontStyle: 'italic', fontSize: 74}}>reviso</span></Palabra>
        </div>
        <Item d={f(16.74 - o)} txt="ingresos" />
        <Item d={f(17.38 - o)} txt="deudas" />
        <Item d={f(17.86 - o)} txt="cuentas de ahorro" />
      </div>
      <div style={{position: 'absolute', left: 540 - 260, top: 1200, width: 520, height: 4, backgroundColor: DORADO, transform: `scaleX(${k})`}} />
    </AbsoluteFill>
  );
};
// "Lo que te digo al principio es lo que llega al cierre"
const T6: React.FC<TP> = ({g0, dur}) => {
  const o = 20.667;
  const fr = useCurrentFrame();
  const w = interpolate(fr, [f(21.75 - o), f(22.2 - o)], [0, 420], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Bloque g0={g0} dur={dur} donde="arriba">
      <Sube d={1}><div style={{fontFamily: MON, fontWeight: 600, fontSize: 40, lineHeight: 1}}>Lo que te digo <span style={{fontFamily: BOD, fontWeight: 400, fontStyle: 'italic', fontSize: 56}}>al principio</span></div></Sube>
      <div style={{width: w, height: 3, backgroundColor: DORADO, margin: '12px auto 14px'}} />
      <Sube d={f(21.89 - o)}><div style={{fontFamily: MON, fontWeight: 600, fontSize: 40, lineHeight: 1}}>es lo que llega</div></Sube>
      <Pop d={f(22.38 - o)}><div style={{fontFamily: BOD, fontWeight: 700, fontSize: 112, lineHeight: 0.85, marginTop: 22, color: DORADO}}>AL CIERRE</div></Pop>
    </Bloque>
  );
};
// CTA — "Mándame a tu próximo comprador antes de que empiece a ver casas"
const CTA: React.FC<TP> = ({g0, dur}) => {
  const o = 22.9;
  return (
    <Bloque g0={g0} dur={dur} donde="arriba">
      <Sube d={2}><div style={{fontFamily: BOD, fontWeight: 400, fontStyle: 'italic', fontSize: 70, lineHeight: 1}}>Mándame a tu próximo</div></Sube>
      <Pop d={f(23.82 - o)}><div style={{fontFamily: BOD, fontWeight: 700, fontSize: 108, lineHeight: 0.85, marginTop: 20}}>COMPRADOR</div></Pop>
    </Bloque>
  );
};
const Pastilla: React.FC<TP> = ({g0, dur}) => {
  const fr = useCurrentFrame();
  const sp = spring({frame: fr, fps: FPS, config: {damping: 11, stiffness: 200}});
  const {menton} = limites(g0, dur);
  const brillo = interpolate(fr, [8, 30], [-40, 140], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: Math.round(menton + 45), display: 'flex', justifyContent: 'center',
        opacity: Math.min(1, sp * 1.6), transform: `scale(${interpolate(sp, [0, 1], [0.5, 1])})`}}>
        <div style={{position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 16, padding: '16px 34px 16px 24px', borderRadius: 999,
          backgroundColor: AZUL, border: `4px solid ${DORADO}`, boxShadow: '0 10px 28px rgba(0,0,0,0.4)'}}>
          {CASA(58)}
          <span style={{fontFamily: MON, fontWeight: 600, fontSize: 38, color: 'white', lineHeight: 1, whiteSpace: 'nowrap'}}>antes de que empiece <span style={{fontFamily: BOD, fontWeight: 700, fontStyle: 'italic', fontSize: 48}}>a ver casas</span></span>
          <div style={{position: 'absolute', top: 0, bottom: 0, left: `${brillo}%`, width: 90, transform: 'skewX(-20deg)',
            backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
const Pie: React.FC<{dur: number; txt: string}> = ({dur, txt}) => {
  const {op} = useIO(dur, 1);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 1200, textAlign: 'center', opacity: op * 0.95,
        fontFamily: MON, fontWeight: 500, fontSize: 28, color: 'white', letterSpacing: '0.04em'}}><span style={{backgroundColor: 'rgba(7,30,80,0.6)', padding: '6px 16px', borderRadius: 8}}>{txt}</span></div>
    </AbsoluteFill>
  );
};

export const TITULOS: [number, number, (p: TP) => React.ReactNode][] = [
  [4.767, 6.10, (p) => <T2 {...p} />],
  [6.10, 7.40, (p) => <T3 {...p} />],
  [14.867, 15.90, (p) => <T4 {...p} />],

  [15.90, 18.767, (p) => <Celeste {...p} />],
  [20.667, 22.90, (p) => <T6 {...p} />],
  [20.667, 22.90, (p) => <Pie dur={p.dur} txt="*Sujeto a calificación y aprobación de crédito." />],
  [22.90, 26.033, (p) => <CTA {...p} />],
  [24.43, 26.033, (p) => <Pastilla {...p} />],
  [25.0, 26.033, (p) => <Pie dur={p.dur} txt="Isledys Hernandez · NMLS #1924019" />],
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

export const ISM0210: React.FC = () => (
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
    {SUBS.map(([a, b, txt], i) => (
      <Sequence key={'s' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        <Subtitulo txt={txt} g0={f(a)} dur={f(b) - f(a)} />
      </Sequence>
    ))}
    <Sequence from={0} durationInFrames={f(1.75)}><T1 g0={0} dur={f(1.75)} /></Sequence>
    <Sequence from={0} durationInFrames={f(1.75)}><Roto /></Sequence>
    {TITULOS.map(([a, b, el], i) => (
      <Sequence key={'t' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        {el({g0: f(a), dur: f(b) - f(a)})}
      </Sequence>
    ))}
    <Logos oscuros={[[90, 143]]} />
    {GUIAS && <Guias />}
  </AbsoluteFill>
);
