import React from 'react';
// Plantilla de referencia del reel DAE 15-10 (aprobado 2026-10-26). Media en public/dae1510/ del proyecto Remotion del editor; mix.wav sale de la mezcla en ffmpeg.
// PlacaLogo quedó sin usar (el logo de SIMPLE no va).
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, getInputProps, interpolate, spring,
  staticFile, useCurrentFrame,
} from 'remotion';

// DAE 15-10 "Alquilar por días sin vivir en" — asesora de SIMPLE a cámara + lista sobre B-roll
export const FPS = 30;
export const DAE1510_FRAMES = 1019;
const f = (s: number) => Math.round(s * FPS);
const GUIAS = Boolean((getInputProps() as {guias?: boolean}).guias);

const NAVY = '#0A1D38', CELESTE = '#349FE2';
const OW = 'Owners Text';
const REG = 400, MED = 500, BLACK = 900;
const SOMBRA = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5)) drop-shadow(0 6px 18px rgba(0,0,0,0.35))';

const FONTS: [string, number][] = [['OwnersText-Regular.ttf', REG], ['OwnersText-Medium.ttf', MED], ['OwnersText-Black.ttf', BLACK]];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([file, weight]) =>
  new FontFace(OW, `url(${staticFile('fonts/' + file)})`, {weight: String(weight)}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

// ---------- planos ----------
// [archivo, desde, hasta (frames), entrada en la fuente (s), zoom inicial, zoom final, ojoX, ojoY (px del cuadro a 1×)]
type Clip = [string, number, number, number, number, number, number, number];
const CLIPS: Clip[] = [
  ['t1949b', 0, 163, 2.0, 1, 1, 540, 960],
  ['t1949b', 163, 202, 7.4333, 1.18, 1.22, 450, 632],      // punch en "Es quién se ocupa"
  ['t1961', 202, 253, 0.62, 1, 1.05, 566, 668],
  ['agendar', 253, 292, 2.2, 1, 1.06, 540, 960],
  ['telefono', 292, 317, 26.0, 1.05, 1.1, 540, 960],
  ['celu', 317, 364, 2.0, 1, 1.06, 540, 960],
  ['llaves', 364, 417, 0.0, 1, 1.06, 540, 960],
  ['limpieza', 417, 506, 0.3, 1, 1.07, 540, 960],
  ['canilla', 506, 558, 2.0, 1.04, 1.1, 540, 960],
  ['dron', 558, 595, 16.0, 1, 1.05, 540, 960],
  ['t1973', 595, 654, 1.2333, 1, 1.05, 522, 650],
  ['t1983', 654, 699, 0.91, 1, 1.04, 595, 800],
  ['compu', 699, 752, 0.0, 1, 1.07, 540, 960],
  ['david2', 752, 812, 0.5, 1, 1.05, 595, 605],
  ['t1983', 812, 880, 6.5467, 1.08, 1.12, 575, 740],
  ['t1992', 880, 1019, 0.92, 1, 1, 540, 960],
];
const LEAKS = [202, 558, 654, 880];
const ZBLUR = [163, 253, 292, 317, 364, 417, 506, 595, 699, 752, 812];
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
      <OffthreadVideo src={staticFile(`dae1510/${name}.mp4`)} startFrom={Math.round(srcIn * FPS)} muted
        style={name === 'david2' ? {filter: 'contrast(1.08) saturate(1.05) brightness(0.97)'} : undefined} />
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
const YB = 960; // sobre B-roll
const SUBS: Sub[] = [
  [1.93, 3.38, 'y vivís *afuera*,', 950],
  [3.38, 4.33, 'lo primero *no* es', 945],
  [4.33, 5.40, '*cuánto renta*.', 960],
  [6.76, 7.86, 'Un alquiler *temporario*', 820],
  [7.86, 8.43, 'es *trabajo*', 820],
  [9.79, 10.57, '*publicar*', YB],
  [10.62, 12.13, 'responder *mensajes*', YB],
  [12.18, 13.10, 'recibir a cada', YB],
  [13.10, 13.90, '*huésped*', YB],
  [13.94, 14.97, 'coordinar la *limpieza*', YB],
  [14.97, 16.05, 'entre una estadía', YB],
  [16.05, 16.87, 'y *otra*', YB],
  [16.91, 17.65, 'y *resolver*', YB],
  [17.65, 18.60, 'lo que se *rompe*', YB],
  [18.60, 19.30, 'Si no estás', YB],
  [19.30, 19.86, 'en el *país*,', YB],
  [21.84, 22.75, 'En *Simple* también', 950],
  [22.75, 23.33, 'nos *ocupamos*', 950],
  [29.35, 30.19, 'Si estás *pensando*', 830],
  [30.19, 30.62, 'en *comprar*', 820],
  [30.62, 31.45, 'para *renta*,', 760],
  [32.22, 32.92, 'y te *cuento*', 735],
  [32.92, 33.967, 'cómo *trabajamos*.', 765],
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
    ...(contorno ? {WebkitTextStroke: `${Math.round(size / 11)}px ${NAVY}`, paintOrder: 'stroke fill'} : {})};
  return <>{lines.map((l, i) => <div key={i} style={st}>{l}</div>)}</>;
};

const T1: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={885} dur={dur}>
    <Maquina size={74} words={[['Si', 0.10, 0.2], ['comprás', 0.22, 0.6], ['para', 0.6, 0.74], ['\n', 0, 0], ['alquilar', 0.76, 1.14], ['por', 1.18, 1.35], ['días', 1.36, 1.79]]} />
  </Bloque>
);
const T2: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={1000} dur={dur}>
    <Sube d={0}><div style={{fontWeight: REG, fontSize: 64, lineHeight: 1}}>Es</div></Sube>
    <Pop d={f(5.72 - 5.40)}><div style={{fontWeight: BLACK, fontSize: 150, lineHeight: 0.9, color: CELESTE, WebkitTextStroke: `8px ${NAVY}`, paintOrder: 'stroke fill'}}>QUIÉN</div></Pop>
    <Sube d={f(6.14 - 5.40)}><div style={{fontWeight: REG, fontSize: 64, lineHeight: 1.05}}>se ocupa...</div></Sube>
  </Bloque>
);
const T3: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={850} dur={dur}>
    <Sube d={0}><div style={{fontWeight: REG, fontSize: 70, lineHeight: 1}}>todas las</div></Sube>
    <Pop d={f(8.91 - 8.43)}><div style={{fontWeight: BLACK, fontSize: 150, lineHeight: 0.92}}>SEMANAS</div></Pop>
  </Bloque>
);
// cuadrado celeste numerado de la lista
const Numero: React.FC<{n: number; dur: number}> = ({n, dur}) => {
  const {fr, sp, op} = useIO(dur, 2);
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
const T4: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={865} dur={dur}>
    <Sube d={0}><div style={{fontWeight: REG, fontSize: 66, lineHeight: 1}}>todo eso depende</div></Sube>
    <Pop d={f(21.14 - 19.86)}><div style={{fontWeight: BLACK, fontSize: 124, lineHeight: 1.0}}>de <span style={{color: CELESTE, WebkitTextStroke: `7px ${NAVY}`, paintOrder: 'stroke fill'}}>alguien.</span></div></Pop>
  </Bloque>
);
// placa del logo de SIMPLE (logo blanco sobre navy) arriba de la cabeza
const PlacaLogo: React.FC<{dur: number}> = ({dur}) => {
  const {fr, op} = useIO(dur);
  const w = interpolate(fr, [0, 6], [0, 100], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 540 - 200, top: 470, width: 400, height: 150, opacity: op, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w}%`, backgroundColor: NAVY, opacity: 0.92}} />
        <Img src={staticFile('dae1510/logo_blanco.png')} style={{position: 'absolute', left: 40, top: 33, width: 320, opacity: fr > 4 ? 1 : 0}} />
      </div>
    </AbsoluteFill>
  );
};
const T5: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={870} dur={dur}>
    <Maquina size={92} words={[['administración', 0.02, 0.82], ['\n', 0, 0], ['en', 0.88, 0.95], ['Airbnb', 0.98, 1.4]]} />
  </Bloque>
);
// placa de David bajo el mentón
const PlacaDavid: React.FC<{dur: number}> = ({dur}) => {
  const {fr, op} = useIO(dur);
  const w = interpolate(fr, [0, 6], [0, 100], {extrapolateRight: 'clamp'});
  const k = interpolate(fr, [4, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 540 - 300, top: 800, width: 600, height: 190, opacity: op, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w}%`, backgroundColor: NAVY, opacity: 0.92}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 10, height: 190, backgroundColor: CELESTE, opacity: w > 2 ? 1 : 0}} />
        <div style={{position: 'absolute', left: 0, width: 600, top: 26, textAlign: 'center', fontFamily: OW, color: 'white', opacity: k, transform: `translateY(${(1 - k) * 12}px)`}}>
          <div style={{fontWeight: BLACK, fontSize: 64, lineHeight: 1, letterSpacing: '-0.02em'}}>David Espineda</div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: 18}}>
            <span style={{fontWeight: REG, fontSize: 40}}>al frente de <span style={{fontWeight: BLACK}}>Simple</span></span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
const T6: React.FC<{dur: number}> = ({dur}) => {
  const fr = useCurrentFrame();
  const n = Math.round(interpolate(fr, [f(27.71 - 27.067), f(28.0 - 27.067)], [1, 10], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <Bloque y={955} dur={dur}>
      <Sube d={f(27.37 - 27.067)}><div style={{fontWeight: REG, fontSize: 60, lineHeight: 1}}>más de</div></Sube>
      <Pop d={f(27.71 - 27.067)}>
        <div style={{fontWeight: BLACK, fontSize: 160, lineHeight: 0.92, whiteSpace: 'nowrap'}}>
          <span style={{color: CELESTE, WebkitTextStroke: `8px ${NAVY}`, paintOrder: 'stroke fill'}}>{n}</span>
          <span style={{opacity: fr >= f(28.11 - 27.067) ? 1 : 0}}> AÑOS</span>
        </div>
      </Pop>
      <Sube d={f(28.49 - 27.067)}><div style={{fontWeight: REG, fontSize: 60, lineHeight: 1.05}}>como anfitrión</div></Sube>
    </Bloque>
  );
};
const T7: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={735} dur={dur}>
    <Maquina size={104} words={[['Escribime', 0.03, 0.6]]} />
  </Bloque>
);

export const TITULOS: [number, number, (d: number) => React.ReactNode][] = [
  [0.0, 1.93, (d) => <T1 dur={d} />],
  [5.40, 6.733, (d) => <T2 dur={d} />],
  [8.43, 9.733, (d) => <T3 dur={d} />],
  [9.733, 10.567, (d) => <Numero n={1} dur={d} />],
  [10.567, 12.133, (d) => <Numero n={2} dur={d} />],
  [12.133, 13.9, (d) => <Numero n={3} dur={d} />],
  [13.9, 16.867, (d) => <Numero n={4} dur={d} />],
  [16.867, 18.6, (d) => <Numero n={5} dur={d} />],
  [19.86, 21.8, (d) => <T4 dur={d} />],
  [23.333, 25.067, (d) => <T5 dur={d} />],
  [25.067, 27.067, (d) => <PlacaDavid dur={d} />],
  [27.067, 29.333, (d) => <T6 dur={d} />],
  [31.45, 32.22, (d) => <T7 dur={d} />],
];

const Guias: React.FC = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px dashed #00ff66'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, backgroundColor: 'rgba(0,255,255,0.5)'}} />
  </AbsoluteFill>
);

export const DAE1510: React.FC = () => (
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
    {!GUIAS && <Audio src={staticFile('dae1510/mix.wav')} />}
  </AbsoluteFill>
);
