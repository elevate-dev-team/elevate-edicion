import React from 'react';
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, getInputProps, interpolate, spring,
  staticFile, useCurrentFrame,
} from 'remotion';
import {SUBS, TOPS} from './datos';

// DAE 01-12 PAUTA casa de 3 niveles en Ciudad Nueva (Asunción), 800 millones — asesora a cámara recorriendo la casa
export const FPS = 30;
export const DAE0112_FRAMES = 1415;
const f = (s: number) => Math.round(s * FPS);
const GUIAS = Boolean((getInputProps() as {guias?: boolean}).guias);

const NAVY = '#0A1D38', CELESTE = '#349FE2';
const OW = 'Owners Text';
const REG = 400, MED = 500, BLACK = 900;
const SOMBRA = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5)) drop-shadow(0 6px 18px rgba(0,0,0,0.35))';
const CONTORNO = (px: number): React.CSSProperties => ({WebkitTextStroke: `${px}px ${NAVY}`, paintOrder: 'stroke fill'});

const FONTS: [string, number][] = [['OwnersText-Regular.ttf', REG], ['OwnersText-Medium.ttf', MED], ['OwnersText-Black.ttf', BLACK]];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([file, weight]) =>
  new FontFace(OW, `url(${staticFile('fonts/' + file)})`, {weight: String(weight)}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

// ---------- planos ----------
// [archivo, desde (s del video), hasta, entrada en la fuente (s), zoom inicial, zoom final, anclaX, anclaY (px del cuadro a 1×)]
// los planos a cámara anclan el zoom en los ojos (track_cara); la entrada en la fuente = corte de la voz (timeline.json)
type Clip = [string, number, number, number, number, number, number, number];
const CLIPS: Clip[] = [
  ['hook', 0, 2.0667, 0, 1.12, 1.2, 530, 625],             // puerta: "Casa de tres niveles en Ciudad Nueva"
  ['hook', 2.0667, 7.0667, 2.0667, 1.2, 1.26, 540, 900],   // pasillo (fundido ya en el archivo)
  ['IMG_3402', 7.0667, 11.4, 1.5333, 1.15, 1.25, 410, 645], // 197 m² / 800 millones
  ['IMG_3406', 11.4, 14.5333, 2.7667, 1.0, 1.08, 540, 815], // planta baja
  ['IMG_3406', 14.5333, 16.4333, 15.6, 1.02, 1.08, 540, 960], // cocina
  ['IMG_3406', 16.4333, 17.5667, 10.0, 1.0, 1.05, 540, 960],  // hall (ambientes amplios)
  ['IMG_3402', 17.5667, 19.1, 10.9, 1.03, 1.08, 540, 960],   // escalera (planta alta)
  ['IMG_3409', 19.1, 28.5667, 2.8, 1.0, 1.08, 530, 820],    // sala grande
  ['IMG_3410', 28.5667, 35.1333, 0.2, 1.0, 1.08, 540, 960], // caracol al 3.er nivel (off)
  ['IMG_3420', 35.1333, 44.7, 0.4333, 1.0, 1.08, 540, 690], // 197 m² / zona comercial
  ['IMG_3421', 44.7, 47.1667, 2.2667, 1.0, 1.06, 550, 855], // CTA
];
const LEAKS = [2.0667, 11.4, 17.5667, 28.5667, 35.1333, 44.7].map(f);
const ZBLUR = [7.0667, 14.5333, 16.4333, 19.1].map(f);
const pulso = (fr: number, c: number) => Math.max(0, 1 - Math.abs(fr - c + 0.5) / 3.5);

const Plano: React.FC<{clip: Clip}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [name, a, b, srcIn, s0, s1, ex, ey] = clip;
  const g = f(a) + frame;
  let zb = 0;
  for (const c of ZBLUR) zb = Math.max(zb, pulso(g, c));
  const s = interpolate(frame, [0, f(b) - f(a)], [s0, s1]) * (1 + 0.16 * zb);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${ex}px ${ey}px`, filter: zb > 0.05 ? `blur(${12 * zb}px)` : undefined}}>
      <OffthreadVideo src={staticFile(`dae0112/${name}.mp4`)} startFrom={Math.round(srcIn * FPS)} muted style={{width: 1080, height: 1920}} />
    </AbsoluteFill>
  );
};

// destello naranja/rosa en modo screen, centrado en el corte
const LightLeak: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      {LEAKS.map((c) => {
        const k = interpolate(fr, [c - 9, c, c + 13], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        if (k <= 0) return null;
        const p = (fr - c + 9) / 22;
        return (
          <AbsoluteFill key={c} style={{mixBlendMode: 'screen', opacity: k}}>
            <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 55% at ${10 + 80 * p}% ${30 + 25 * p}%, rgba(255,170,70,0.95), rgba(255,100,60,0.5) 45%, rgba(0,0,0,0) 75%)`}} />
            <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 45% at ${90 - 65 * p}% ${75 - 30 * p}%, rgba(255,105,170,0.8), rgba(0,0,0,0) 70%)`}} />
            <AbsoluteFill style={{backgroundColor: `rgba(255,228,200,${0.3 * k})`}} />
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

// ---------- íconos en cuadrado celeste ----------
type IconoN = 'pin' | 'auto' | 'copo' | 'caja' | 'laptop' | 'reunion' | 'parrilla' | 'check';
const Glifo: React.FC<{n: IconoN}> = ({n}) => (
  <>
    {n === 'pin' && <><path d="M24 44C24 44 38 30 38 19A14 14 0 0 0 10 19C10 30 24 44 24 44Z" fill="white" stroke="none" /><circle cx={24} cy={19} r={5} fill={CELESTE} stroke="none" /></>}
    {n === 'auto' && <><path d="M7 30L11 18Q12 15 15 15H33Q36 15 37 18L41 30" /><rect x={5} y={29} width={38} height={9} fill="white" stroke="none" /><circle cx={14} cy={40} r={3.5} fill="white" stroke="none" /><circle cx={34} cy={40} r={3.5} fill="white" stroke="none" /></>}
    {n === 'copo' && <path d="M24 4V44M6.7 14L41.3 34M6.7 34L41.3 14M18 7L24 12L30 7M18 41L24 36L30 41M6 21L13 22L10 28M42 27L35 26L38 20M6 27L13 26L10 20M42 21L35 22L38 28" strokeWidth={3.6} />}
    {n === 'caja' && <><path d="M6 15L24 7L42 15V35L24 43L6 35Z" /><path d="M6 15L24 23L42 15M24 23V43" /></>}
    {n === 'laptop' && <><rect x={9} y={10} width={30} height={20} /><path d="M3 38H45L41 31H7Z" fill="white" stroke="none" /></>}
    {n === 'reunion' && <><circle cx={14} cy={14} r={5} fill="white" stroke="none" /><circle cx={34} cy={14} r={5} fill="white" stroke="none" /><path d="M5 30Q14 20 23 30M25 30Q34 20 43 30" /><rect x={5} y={33} width={38} height={6} fill="white" stroke="none" /></>}
    {n === 'parrilla' && <><path d="M7 20H41Q41 34 24 34Q7 34 7 20Z" fill="white" stroke="none" /><path d="M24 34V44M14 44L20 34M34 44L28 34M16 14Q14 10 17 6M24 14Q22 10 25 6M32 14Q30 10 33 6" strokeWidth={3.6} /></>}
    {n === 'check' && <path d="M9 25 L20 36 L40 13" strokeWidth={7} />}
  </>
);
const Icono: React.FC<{n: IconoN; size?: number}> = ({n, size = 84}) => (
  <div style={{width: size, height: size, backgroundColor: CELESTE, display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.35)', flexShrink: 0}}>
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth={4.5} strokeLinecap="square" strokeLinejoin="round">
      <Glifo n={n} />
    </svg>
  </div>
);

// ---------- subtítulos: Owners Regular + palabra clave en Black, caja navy que entra como resaltador ----------
const Subtitulo: React.FC<{txt: string; y: number; dur: number}> = ({txt, y, dur}) => {
  const {fr, op} = useIO(dur, 2);
  const w = interpolate(fr, [0, 4], [0, 100], {extrapolateRight: 'clamp'});
  const parts = txt.split(/(\*[^*]+\*)/).filter(Boolean);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: y, transform: 'translateY(-50%)', opacity: op, display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'relative', padding: '4px 14px 8px', fontFamily: OW, fontSize: 60, lineHeight: 1.0, color: 'white', letterSpacing: '-0.02em', whiteSpace: 'nowrap'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w}%`, backgroundColor: NAVY, opacity: 0.85}} />
          <span style={{position: 'relative'}}>
            {parts.map((p, i) => p.startsWith('*')
              ? <span key={i} style={{fontWeight: BLACK}}>{p.slice(1, -1)}</span>
              : <span key={i} style={{fontWeight: REG}}>{p}</span>)}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- piezas de títulos ----------
const Bloque: React.FC<{y: number; dur: number; children: React.ReactNode; sombra?: boolean}> = ({y, dur, children, sombra = true}) => {
  const {op} = useIO(dur);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: y, opacity: op, filter: sombra ? SOMBRA : undefined,
        display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: OW, color: 'white', letterSpacing: '-0.02em'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
const Pop: React.FC<{d: number; children: React.ReactNode; from?: number}> = ({d, children, from = 0.6}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 10, stiffness: 210}});
  return <div style={{opacity: fr < 0 ? 0 : Math.min(1, sp * 1.6), transform: `scale(${fr < 0 ? from : interpolate(sp, [0, 1], [from, 1])})`}}>{children}</div>;
};
const Sube: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 14, stiffness: 180}});
  return <div style={{opacity: fr < 0 ? 0 : Math.min(1, sp * 1.4), transform: `translateY(${interpolate(sp, [0, 1], [24, 0])}px)`}}>{children}</div>;
};
// máquina de escribir celeste: cada palabra se tipea mientras se dice (tiempos relativos al bloque, en s)
type Tipo = [string, number, number][];
const Maquina: React.FC<{words: Tipo; size: number}> = ({words, size}) => {
  const t = useCurrentFrame() / FPS;
  const lines: React.ReactNode[][] = [[]];
  words.forEach(([w, a, b], i) => {
    if (w === '\n') { lines.push([]); return; }
    const n = Math.round(interpolate(t, [a, a + Math.min(0.32, Math.max(0.12, b - a))], [0, w.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
    lines[lines.length - 1].push(
      <span key={i} style={{display: 'inline-block', margin: '0 0.12em'}}>
        <span>{w.slice(0, n)}</span><span style={{opacity: 0}}>{w.slice(n)}</span>
      </span>);
  });
  const st: React.CSSProperties = {fontWeight: BLACK, fontSize: size, lineHeight: 1.0, color: CELESTE, whiteSpace: 'nowrap', ...CONTORNO(Math.round(size / 11))};
  return <>{lines.map((l, i) => <div key={i} style={st}>{l}</div>)}</>;
};
const Caja: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 58}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', backgroundColor: 'rgba(10,29,56,0.85)', padding: '4px 14px 8px',
    fontWeight: REG, fontSize: size, lineHeight: 1, whiteSpace: 'nowrap'}}>{children}</div>
);
// cifra-golpe con contador: número en Black celeste + unidad en Medium blanca
const Cifra: React.FC<{n: number; u: string; size?: number; d?: number; cuenta?: number}> = ({n, u, size = 130, d = 0, cuenta = 0.5}) => {
  const fr = useCurrentFrame() - d;
  const k = interpolate(fr, [0, cuenta * FPS], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const v = Math.round(n * (1 - Math.pow(1 - k, 3)));
  return (
    <div style={{whiteSpace: 'nowrap', lineHeight: 1.0, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16}}>
      <span style={{fontWeight: BLACK, fontSize: size, color: CELESTE, ...CONTORNO(8), fontVariantNumeric: 'tabular-nums'}}>{v}</span>
      <span style={{fontWeight: MED, fontSize: size * 0.5, ...CONTORNO(5)}}>{u}</span>
    </div>
  );
};
// tarjeta navy con ícono que se completa al decirse
const Tarjeta: React.FC<{d: number; icono: IconoN; children: React.ReactNode; w?: number; h?: number; fs?: number}> = ({d, icono, children, w: ancho = 620, h = 112, fs = 54}) => {
  const fr = useCurrentFrame() - d;
  if (fr < 0) return <div style={{height: h, marginTop: 14}} />;
  const w = interpolate(fr, [0, 6], [0, 100], {extrapolateRight: 'clamp'});
  const sp = spring({frame: Math.max(0, fr - 3), fps: FPS, config: {damping: 11, stiffness: 210}});
  const k = interpolate(fr, [4, 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const isz = h - 32;
  return (
    <div style={{position: 'relative', width: ancho, height: h, marginTop: 14}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w}%`, backgroundColor: NAVY, opacity: 0.92}} />
      <div style={{position: 'absolute', left: 16, top: 16, transform: `scale(${interpolate(sp, [0, 1], [0.3, 1])})`}}>
        <Icono n={icono} size={isz} />
      </div>
      <div style={{position: 'absolute', left: isz + 36, right: 10, top: 0, bottom: 0, display: 'flex', alignItems: 'center',
        fontSize: fs, lineHeight: 1, whiteSpace: 'nowrap', opacity: k, transform: `translateX(${(1 - k) * 16}px)`}}>
        {children}
      </div>
    </div>
  );
};
// chip: ícono chico + nombre en caja navy, entra deslizando
const Chip: React.FC<{d: number; icono: IconoN; children: React.ReactNode; h?: number; fs?: number}> = ({d, icono, children, h = 72, fs = 46}) => {
  const fr = useCurrentFrame() - d;
  if (fr < 0) return <div style={{height: h, marginTop: 10}} />;
  const sp = spring({frame: fr, fps: FPS, config: {damping: 12, stiffness: 200}});
  const w = interpolate(fr, [2, 8], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{display: 'flex', alignItems: 'center', height: h, marginTop: 10, opacity: Math.min(1, sp * 1.5),
      transform: `translateX(${interpolate(sp, [0, 1], [-30, 0])}px)`}}>
      <div style={{transform: `scale(${interpolate(sp, [0, 1], [0.4, 1])})`}}><Icono n={icono} size={h} /></div>
      <div style={{backgroundColor: 'rgba(10,29,56,0.9)', height: h, display: 'flex', alignItems: 'center', padding: '0 20px 4px',
        fontSize: fs, fontWeight: BLACK, whiteSpace: 'nowrap', clipPath: `inset(0 ${100 - w}% 0 0)`}}>{children}</div>
    </div>
  );
};
// pin de ubicación con una o dos líneas
const PinFila: React.FC<{d: number; l1: string; l2?: string; size?: number}> = ({d, l1, l2, size = 96}) => {
  const fr = useCurrentFrame() - d;
  if (fr < 0) return <div style={{height: size, marginTop: 16}} />;
  const sp = spring({frame: fr, fps: FPS, config: {damping: 12, stiffness: 200}});
  const w = interpolate(fr, [3, 10], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{display: 'flex', alignItems: 'center', marginTop: 16, transform: `translateY(${interpolate(sp, [0, 1], [24, 0])}px)`, opacity: Math.min(1, sp * 1.5)}}>
      <div style={{transform: `scale(${interpolate(sp, [0, 1], [0.4, 1])})`}}><Icono n="pin" size={size} /></div>
      <div style={{backgroundColor: 'rgba(10,29,56,0.9)', height: size, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 24px 4px', whiteSpace: 'nowrap', clipPath: `inset(0 ${100 - w}% 0 0)`}}>
        <div style={{fontWeight: BLACK, fontSize: l2 ? 48 : 52, lineHeight: 1}}>{l1}</div>
        {l2 && <div style={{fontWeight: REG, fontSize: 36, lineHeight: 1.05}}>{l2}</div>}
      </div>
    </div>
  );
};
const dd = (s: number) => Math.round(s * FPS);

// ---------- títulos ----------
// hook: "Casa de / 3 niveles" a máquina de escribir bajo el mentón + pin "Ciudad Nueva"
const THook: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={TOPS.hook1} dur={dur}>
    <Maquina size={84} words={[['Casa', 0.06, 0.40], ['de', 0.42, 0.54], ['\n', 0, 0], ['3', 0.56, 0.74], ['niveles', 0.76, 1.22]]} />
    <PinFila d={dd(1.30)} l1="Ciudad Nueva" l2="Asunción" />
  </Bloque>
);
// "a solo / 2 cuadras / de" + Galería Bonanza · San Miguel · Santo Domingo (sobre el pasillo, en el piso)
const TCuadras: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={800} dur={dur}>
    <Sube d={dd(0.03)}><Caja>a solo</Caja></Sube>
    <Pop d={dd(0.69)}><Cifra n={2} u="cuadras de" size={120} d={dd(0.69)} cuenta={0.01} /></Pop>
    <Chip d={dd(1.77)} icono="pin">Galería Bonanza</Chip>
    <Chip d={dd(3.26)} icono="pin">San Miguel</Chip>
    <Chip d={dd(4.12)} icono="pin">Santo Domingo</Chip>
  </Bloque>
);
// "197 m² / construidos / 800 millones / de guaraníes"
const TPrecio: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={TOPS.precio} dur={dur}>
    <Pop d={dd(0.04)}><Cifra n={197} u="m²" size={125} d={dd(0.04)} cuenta={0.7} /></Pop>
    <Sube d={dd(1.68)}><Caja><span style={{fontWeight: BLACK}}>construidos</span>&nbsp;por</Caja></Sube>
    <div style={{height: 10}} />
    <Pop d={dd(2.72)}><Cifra n={800} u="millones" size={125} d={dd(2.72)} cuenta={0.7} /></Pop>
    <Sube d={dd(3.75)}><Caja>de&nbsp;<span style={{fontWeight: BLACK}}>guaraníes</span></Caja></Sube>
  </Bloque>
);
// estacionamiento para 2 vehículos
const TAutos: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={TOPS.autos} dur={dur} sombra={false}>
    <Tarjeta d={dd(0.04)} icono="auto"><span style={{fontWeight: BLACK}}>estacionamiento</span></Tarjeta>
    <Tarjeta d={dd(0.68)} icono="auto"><span style={{fontWeight: REG}}>para&nbsp;</span><span style={{fontWeight: BLACK, color: CELESTE}}>2</span><span style={{fontWeight: BLACK}}>&nbsp;vehículos</span></Tarjeta>
  </Bloque>
);
// 3 habitaciones / en suite / con aire acondicionado
const TSuites: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={TOPS.suites} dur={dur}>
    <Pop d={dd(0.03)}><Cifra n={3} u="habitaciones" size={96} d={dd(0.03)} cuenta={0.01} /></Pop>
    <div style={{height: 8}} />
    <Sube d={dd(0.83)}><Caja size={54}>en&nbsp;<span style={{fontWeight: BLACK}}>suite</span></Caja></Sube>
    <Tarjeta d={dd(1.77)} icono="copo" w={700} h={100} fs={48}><span style={{fontWeight: REG}}>con&nbsp;</span><span style={{fontWeight: BLACK}}>aire acondicionado</span></Tarjeta>
  </Bloque>
);
// "Sirve como" + depósito · oficina · sala de reuniones · quincho
const TUsos: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={880} dur={dur}>
    <Sube d={dd(0.03)}><Caja size={54}>sirve como</Caja></Sube>
    <div style={{height: 4}} />
    <Chip d={dd(0.67)} icono="caja" h={64} fs={44}>depósito</Chip>
    <Chip d={dd(1.53)} icono="laptop" h={64} fs={44}>oficina</Chip>
    <Chip d={dd(2.27)} icono="reunion" h={64} fs={44}>sala de reuniones</Chip>
    <Chip d={dd(3.17)} icono="parrilla" h={64} fs={44}>quincho</Chip>
  </Bloque>
);
const TM2: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={TOPS.m2b} dur={dur}>
    <Pop d={dd(0.0)}><Cifra n={197} u="m²" size={140} d={0} cuenta={0.7} /></Pop>
    <Sube d={dd(1.96)}><Caja><span style={{fontWeight: BLACK}}>construidos</span></Caja></Sube>
  </Bloque>
);
const TZona: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={TOPS.zona} dur={dur}>
    <PinFila d={0} l1="zona comercial" l2="de Asunción" />
  </Bloque>
);
// CTA arriba de la cabeza (bajo el mentón no entra en la zona de pauta): "Escribime / al WhatsApp" + "y coordinamos una visita"
const CTA_TOP = 505;
const TCta: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={CTA_TOP} dur={dur}>
    <Maquina size={78} words={[['Escribime', 0.04, 0.48], ['\n', 0, 0], ['al', 0.48, 0.58], ['WhatsApp', 0.58, 1.0]]} />
    <div style={{height: 14}} />
    <Sube d={dd(1.14)}><Caja size={54}>y coordinamos una&nbsp;<span style={{fontWeight: BLACK}}>visita</span></Caja></Sube>
  </Bloque>
);

// ---------- indicador de nivel (planta baja / alta / 3.er nivel), arriba al centro ----------
const NIVELES: [number, string][] = [[11.45, 'Planta baja'], [17.65, 'Planta alta'], [28.63, '3.er nivel']];
const NIVEL_FIN = 35.30;
const Nivel: React.FC = () => {
  const fr = useCurrentFrame();
  const g = f(NIVELES[0][0]) + fr;
  const dur = f(NIVEL_FIN) - f(NIVELES[0][0]);
  const {sp, op} = useIO(dur, 6);
  let idx = 0;
  NIVELES.forEach(([t], i) => { if (g >= f(t)) idx = i; });
  const tc = f(NIVELES[idx][0]);
  const k = spring({frame: g - tc, fps: FPS, config: {damping: 12, stiffness: 200}});
  const prev = Math.max(0, idx - 1);
  const pos = idx === 0 ? 0 : interpolate(k, [0, 1], [prev, idx]);
  const wipe = interpolate(g - tc, [0, 7], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const S = 110, bh = 18, gap = 7, bw = 62;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 300, display: 'flex', justifyContent: 'center', opacity: op, filter: SOMBRA,
        transform: `translateY(${interpolate(sp, [0, 1], [-30, 0])}px)`}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{width: S, height: S, backgroundColor: CELESTE, position: 'relative', transform: `scale(${interpolate(sp, [0, 1], [0.5, 1])})`}}>
            {/* techo */}
            <svg width={S} height={S} style={{position: 'absolute', left: 0, top: 0}} viewBox="0 0 110 110">
              <path d="M24 30L55 12L86 30" fill="none" stroke="white" strokeWidth={6} strokeLinecap="square" />
            </svg>
            {[0, 1, 2].map((i) => {
              const yb = 86 - i * (bh + gap);
              return <div key={i} style={{position: 'absolute', left: (S - bw) / 2, top: yb - bh, width: bw, height: bh, border: '4px solid white', boxSizing: 'border-box'}} />;
            })}
            <div style={{position: 'absolute', left: (S - bw) / 2, top: 86 - pos * (bh + gap) - bh, width: bw, height: bh, backgroundColor: 'white'}} />
          </div>
          <div style={{backgroundColor: 'rgba(10,29,56,0.9)', height: S, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 26px 4px',
            fontFamily: OW, color: 'white', letterSpacing: '-0.02em', whiteSpace: 'nowrap', minWidth: 330}}>
            <div style={{fontWeight: REG, fontSize: 32, lineHeight: 1, opacity: 0.85}}>nivel {idx + 1} de 3</div>
            <div style={{fontWeight: BLACK, fontSize: 56, lineHeight: 1.05, clipPath: idx === 0 ? undefined : `inset(0 ${100 - wipe}% 0 0)`}}>{NIVELES[idx][1]}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TITULOS: [number, number, (d: number) => React.ReactNode][] = [
  [0.0, 2.10, (d) => <THook dur={d} />],
  [2.10, 7.0667, (d) => <TCuadras dur={d} />],
  [7.0667, 11.75, (d) => <TPrecio dur={d} />],
  [12.72, 14.55, (d) => <TAutos dur={d} />],
  [25.72, 28.80, (d) => <TSuites dur={d} />],
  [31.38, 35.35, (d) => <TUsos dur={d} />],
  [35.35, 38.36, (d) => <TM2 dur={d} />],
  [43.20, 44.70, (d) => <TZona dur={d} />],
  [44.72, 47.1667, (d) => <TCta dur={d} />],
];

const Guias: React.FC = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 980, border: '3px dashed #00ff66'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, backgroundColor: 'rgba(0,255,255,0.5)'}} />
  </AbsoluteFill>
);

export const DAE0112: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    {CLIPS.map((c, i) => (
      <Sequence key={i} from={f(c[1])} durationInFrames={f(c[2]) - f(c[1])}>
        <Plano clip={c} />
      </Sequence>
    ))}
    <LightLeak />
    <Sequence from={f(NIVELES[0][0])} durationInFrames={f(NIVEL_FIN) - f(NIVELES[0][0])}><Nivel /></Sequence>
    {SUBS.map(([a, b, txt, y], i) => (
      <Sequence key={'s' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        <Subtitulo txt={txt} y={y} dur={f(b) - f(a)} />
      </Sequence>
    ))}
    {TITULOS.map(([a, b, el], i) => (
      <Sequence key={'t' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        {el(f(b) - f(a))}
      </Sequence>
    ))}
    {GUIAS && <Guias />}
    {!GUIAS && <Audio src={staticFile('dae0112/mix.wav')} />}
  </AbsoluteFill>
);
