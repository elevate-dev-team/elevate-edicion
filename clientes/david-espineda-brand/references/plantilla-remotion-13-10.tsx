import React from 'react';
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, getInputProps, interpolate, spring,
  staticFile, useCurrentFrame,
} from 'remotion';

// DAE 13-10 "Cómo leer una proforma en pozo" — asesora de SIMPLE a cámara en la mesa + lista 1–4 sobre B-roll
export const FPS = 30;
export const DAE1310_FRAMES = 1015;
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
// [archivo, desde, hasta (frames), entrada en la fuente (s), zoom inicial, zoom final, ojoX, ojoY (px del cuadro a 1×)]
type Clip = [string, number, number, number, number, number, number, number];
const CLIPS: Clip[] = [
  ['t1', 0, 92, 0.4333, 1, 1.05, 573, 373],
  ['t1', 92, 169, 3.5, 1.15, 1.19, 573, 373],           // punch en "pero lo que te dice"
  ['t2', 169, 252, 0.6333, 1, 1.05, 563, 402],
  ['t2', 252, 292, 3.4, 1.16, 1.2, 563, 402],            // punch en "miro cuatro cosas"
  ['dolares', 292, 382, 0.0, 1, 1.07, 540, 960],
  ['calcu', 382, 472, 0.0, 1.04, 1.1, 540, 960],
  ['t3', 472, 554, 3.6333, 1.08, 1.12, 531, 364],
  ['agenda', 554, 627, 0.3, 1, 1.06, 540, 960],
  ['edificio', 627, 716, 0.0, 1, 1.07, 540, 960],
  ['planos', 716, 775, 0.0, 1.03, 1.08, 540, 960],
  ['t5', 775, 877, 2.5667, 1, 1.05, 542, 545],
  ['t6', 877, 1015, 0.5333, 1, 1.06, 572, 489],
];
const LEAKS = [169, 292, 877];
const ZBLUR = [92, 252, 382, 472, 554, 627, 716, 775];
const pulso = (fr: number, c: number) => Math.max(0, 1 - Math.abs(fr - c + 0.5) / 3.5);

const Plano: React.FC<{clip: Clip}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [name, a, b, srcIn, s0, s1, ex, ey] = clip;
  const g = a + frame;
  let zb = 0;
  for (const c of ZBLUR) zb = Math.max(zb, pulso(g, c));
  const s = interpolate(frame, [0, b - a], [s0, s1]) * (1 + 0.16 * zb);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${ex}px ${ey}px`, filter: zb > 0.05 ? `blur(${12 * zb}px)` : undefined}}>
      <OffthreadVideo src={staticFile(`dae1310/${name}.mp4`)} startFrom={Math.round(srcIn * FPS)} muted />
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

// ---------- subtítulos: Owners Regular + palabra clave en Black, caja navy que entra como resaltador ----------
type Sub = [number, number, string, number];
const Subtitulo: React.FC<{txt: string; y: number; dur: number}> = ({txt, y, dur}) => {
  const {fr, op} = useIO(dur, 2);
  const w = interpolate(fr, [0, 4], [0, 100], {extrapolateRight: 'clamp'});
  // "*palabra*" = Black
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
// alturas: pegado bajo la caja de la cara medida (contando el zoom de cada plano); sobre B-roll, bajo el número
const Y1 = 705, Y2 = 757, Y3 = 720, Y6 = 787, YB = 960;
const SUBS: Sub[] = [
  [0.04, 0.94, 'En una *proforma*', Y1],
  [0.94, 2.06, 'la cifra más *grande*', Y1],
  [2.06, 3.05, 'está *arriba*.', Y1],
  [5.65, 6.43, 'Vengo de la parte', Y2],
  [6.43, 7.20, '*administrativa*', Y2],
  [7.20, 8.06, 'y en una *proforma*', Y2],
  [9.76, 10.60, 'en qué *moneda*', YB],
  [10.60, 11.73, 'está *todo*,', YB],
  [11.73, 12.73, 'no solo el *precio*.', YB],
  [12.75, 13.43, '*Cuánto* ponés', YB],
  [13.43, 14.33, 'al *principio*', YB],
  [14.33, 14.93, 'y cuánto *queda*', YB],
  [14.93, 15.73, 'para la *entrega*,', YB],
  [15.96, 17.40, 'porque de ese *reparto*', Y3],
  [17.40, 18.467, 'depende si *llegás*.', Y3],
  [18.50, 19.55, '*Cuántas* cuotas', YB],
  [19.55, 20.38, 'son y hasta', YB],
  [20.38, 20.90, '*cuándo*:', YB],
  [21.16, 21.85, 'si *terminan*', YB],
  [21.85, 22.85, 'antes de la *obra*', YB],
  [22.85, 23.867, 'o con la *entrega*.', YB],
  [23.95, 25.0, 'Y qué *incluye*', YB],
  [25.0, 25.833, 'la *unidad*:', YB],
  [29.25, 30.45, 'Si tenés una *proforma*', Y6],
  [30.45, 30.96, '*nuestra*', Y6],
  [30.96, 31.82, 'y querés *repasarla*', Y6],
  [31.82, 32.50, '*conmigo*,', Y6],
];

// ---------- títulos ----------
const Bloque: React.FC<{y: number; dur: number; children: React.ReactNode; sombra?: boolean}> = ({y, dur, children, sombra = true}) => {
  const {op} = useIO(dur);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: y, opacity: op, filter: sombra ? SOMBRA : undefined,
        textAlign: 'center', fontFamily: OW, color: 'white', letterSpacing: '-0.02em'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
// pop con rebote que entra d frames después del inicio del bloque
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

// máquina de escribir celeste: cada palabra se tipea mientras se dice (tiempos relativos al inicio del bloque, en s)
type Tipo = [string, number, number][]; // [palabra, inicio, fin]; "\n" como palabra = salto de línea
const Maquina: React.FC<{words: Tipo; size: number; contorno?: boolean}> = ({words, size, contorno = true}) => {
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
  const st: React.CSSProperties = {fontWeight: BLACK, fontSize: size, lineHeight: 1.0, color: CELESTE, whiteSpace: 'nowrap',
    ...(contorno ? CONTORNO(Math.round(size / 11)) : {})};
  return <>{lines.map((l, i) => <div key={i} style={st}>{l}</div>)}</>;
};

// línea chica sobre caja navy (como los subtítulos): sobre la remera a rayas el blanco solo no se lee
const Caja: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 60}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', backgroundColor: 'rgba(10,29,56,0.85)', padding: '4px 14px 8px',
    fontWeight: REG, fontSize: size, lineHeight: 1, whiteSpace: 'nowrap'}}>{children}</div>
);

// flecha hacia abajo que rebota
const Flecha: React.FC<{d: number}> = ({d}) => {
  const fr = useCurrentFrame() - d;
  if (fr < 0) return null;
  const sp = spring({frame: fr, fps: FPS, config: {damping: 12, stiffness: 200}});
  const bob = Math.sin(fr / 4) * 6;
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" style={{display: 'inline-block', verticalAlign: 'middle', marginLeft: 14,
      opacity: Math.min(1, sp * 1.5), transform: `translateY(${interpolate(sp, [0, 1], [-20, 0]) + bob}px)`}}>
      <rect x={0} y={0} width={64} height={64} fill={CELESTE} />
      <path d="M32 14 V46 M18 34 L32 48 L46 34" stroke="white" strokeWidth={8} fill="none" strokeLinecap="square" />
    </svg>
  );
};

// "pero lo que te dice / si te ALCANZA / está abajo ↓" bajo el mentón (plano con punch)
const T1: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={722} dur={dur}>
    <Sube d={0}><Caja>pero lo que te dice</Caja></Sube>
    <Pop d={f(3.91 - 3.05)}>
      <div style={{fontWeight: BLACK, fontSize: 118, lineHeight: 1.0, whiteSpace: 'nowrap'}}>
        <span style={{fontWeight: BLACK, fontSize: 80, ...CONTORNO(7)}}>si te </span><span style={{color: CELESTE, ...CONTORNO(7)}}>ALCANZA</span>
      </div>
    </Pop>
    <Sube d={f(4.81 - 3.05)}>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 6}}>
        <Caja>está&nbsp;<span style={{fontWeight: BLACK}}>abajo</span></Caja><Flecha d={f(5.13 - 4.81)} />
      </div>
    </Sube>
  </Bloque>
);
// "miro / 4 COSAS"
const T2: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={772} dur={dur}>
    <Sube d={0}><Caja size={64}>miro</Caja></Sube>
    <Pop d={f(8.46 - 8.06)}>
      <div style={{fontWeight: BLACK, fontSize: 150, lineHeight: 0.95, whiteSpace: 'nowrap', ...CONTORNO(8)}}>
        <span style={{color: CELESTE}}>4</span> COSAS
      </div>
    </Pop>
  </Bloque>
);
// cuadrado celeste numerado de la lista (solo el número)
const Numero: React.FC<{n: number; dur: number}> = ({n, dur}) => {
  const {sp, op} = useIO(dur, 2);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 540 - 60, top: 760, width: 120, height: 120, backgroundColor: CELESTE, opacity: op,
        transform: `scale(${interpolate(sp, [0, 1], [0.4, 1])}) rotate(${interpolate(sp, [0, 1], [-12, 0])}deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.35)'}}>
        <span style={{fontFamily: OW, fontWeight: BLACK, fontSize: 82, color: 'white', lineHeight: 1, marginTop: 6}}>{n}</span>
      </div>
    </AbsoluteFill>
  );
};
// tarjeta navy con ícono en cuadrado celeste que se completa al decirse
const Tarjeta: React.FC<{d: number; icono: 'check' | 'mas'; children: React.ReactNode}> = ({d, icono, children}) => {
  const fr = useCurrentFrame() - d;
  if (fr < 0) return <div style={{height: 116, marginTop: 18}} />;
  const w = interpolate(fr, [0, 6], [0, 100], {extrapolateRight: 'clamp'});
  const sp = spring({frame: Math.max(0, fr - 3), fps: FPS, config: {damping: 11, stiffness: 210}});
  const k = interpolate(fr, [4, 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'relative', width: 720, height: 116, margin: '18px auto 0'}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w}%`, backgroundColor: NAVY, opacity: 0.92}} />
      <div style={{position: 'absolute', left: 18, top: 18, width: 80, height: 80, backgroundColor: CELESTE,
        transform: `scale(${interpolate(sp, [0, 1], [0.3, 1])})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={48} height={48} viewBox="0 0 48 48">
          {icono === 'check'
            ? <path d="M9 25 L20 36 L40 13" stroke="white" strokeWidth={7} fill="none" strokeLinecap="square" />
            : <path d="M24 8 V40 M8 24 H40" stroke="white" strokeWidth={7} fill="none" strokeLinecap="square" />}
        </svg>
      </div>
      <div style={{position: 'absolute', left: 118, right: 10, top: 0, bottom: 0, display: 'flex', alignItems: 'center',
        fontSize: 54, lineHeight: 1, whiteSpace: 'nowrap', opacity: k, transform: `translateX(${(1 - k) * 16}px)`}}>
        {children}
      </div>
    </div>
  );
};
// "la cochera" + "¿adentro del precio?" / "¿o va aparte?" bajo el mentón
const T4: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={838} dur={dur} sombra={false}>
    <Sube d={f(26.10 - 25.833)}>
      <Caja>la&nbsp;<span style={{fontWeight: BLACK}}>cochera</span>,</Caja>
    </Sube>
    <Tarjeta d={f(26.84 - 25.833)} icono="check">
      <span style={{fontWeight: BLACK, color: CELESTE}}>¿adentro</span><span style={{fontWeight: REG}}>&nbsp;del precio?</span>
    </Tarjeta>
    <Tarjeta d={f(28.15 - 25.833)} icono="mas">
      <span style={{fontWeight: REG}}>¿o va&nbsp;</span><span style={{fontWeight: BLACK, color: CELESTE}}>aparte?</span>
    </Tarjeta>
  </Bloque>
);
// "Escribime / por DM" a máquina de escribir (se completa antes para quedar ~0,8 s entero)
const T7: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={772} dur={dur}>
    <Maquina size={104} words={[['Escribime', 0.04, 0.3], ['\n', 0, 0], ['por', 0.4, 0.46], ['DM', 0.5, 0.56]]} />
  </Bloque>
);

export const TITULOS: [number, number, (d: number) => React.ReactNode][] = [
  [3.05, 5.633, (d) => <T1 dur={d} />],
  [8.06, 9.733, (d) => <T2 dur={d} />],
  [9.733, 12.733, (d) => <Numero n={1} dur={d} />],
  [12.733, 15.733, (d) => <Numero n={2} dur={d} />],
  [18.467, 23.867, (d) => <Numero n={3} dur={d} />],
  [23.867, 25.833, (d) => <Numero n={4} dur={d} />],
  [25.833, 29.233, (d) => <T4 dur={d} />],
  [32.50, 33.833, (d) => <T7 dur={d} />],
];

const Guias: React.FC = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px dashed #00ff66'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, backgroundColor: 'rgba(0,255,255,0.5)'}} />
  </AbsoluteFill>
);

export const DAE1310: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    {CLIPS.map((c, i) => (
      <Sequence key={i} from={c[1]} durationInFrames={c[2] - c[1]}>
        <Plano clip={c} />
      </Sequence>
    ))}
    <LightLeak />
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
    {!GUIAS && <Audio src={staticFile('dae1310/mix.wav')} />}
  </AbsoluteFill>
);
