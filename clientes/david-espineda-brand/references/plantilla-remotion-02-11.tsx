import React from 'react';
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, getInputProps, interpolate, spring,
  staticFile, useCurrentFrame,
} from 'remotion';

// DAE 02-11 PAUTA casa de campo en Ypacaraí (Cerro Güi) — asesora a cámara en el hook y el CTA, off sobre B-roll de la casa
export const FPS = 30;
export const DAE0211_FRAMES = 1640;
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
// [archivo, desde (s del video), hasta, entrada en la fuente (s), zoom inicial, zoom final, ojoX, ojoY (px del cuadro a 1×)]
type Clip = [string, number, number, number, number, number, number, number];
const CLIPS: Clip[] = [
  // hook a cámara (la voz sale de la misma toma: entrada en la fuente = corte de la voz)
  ['2264', 0, 4.84, 1.15, 1, 1.04, 525, 560],
  ['2267', 4.84, 9.38, 0.37, 1, 1.04, 535, 640],
  ['2275', 9.38, 13.94, 0.56, 1.02, 1.08, 548, 840],
  // cuerpo en off sobre la casa
  ['2311', 13.94, 17.14, 0.3, 1, 1.06, 540, 960],      // 2.000 m² de terreno
  ['2315', 17.14, 19.45, 5.0, 1.03, 1.08, 540, 960],   // 120 m² construidos
  ['2282', 19.45, 21.81, 1.0, 1, 1.05, 540, 960],      // dormitorios con aire
  ['2285', 21.81, 23.39, 14.4, 1.02, 1.07, 540, 960],  // living comedor
  ['2285', 23.39, 25.68, 19.4, 1, 1.05, 540, 960],     // cocina
  ['2243', 25.68, 28.12, 0.2, 1.03, 1.08, 540, 960],   // techo de tejas
  ['2285', 28.12, 31.37, 0.3, 1, 1.05, 540, 960],      // galería techada
  ['2318', 31.37, 32.65, 0.8, 1.02, 1.07, 540, 960],   // fogón de piedra
  ['2239', 32.65, 33.85, 0.5, 1, 1.05, 540, 960],      // árboles frutales
  ['2316', 33.85, 35.16, 5.0, 1.02, 1.07, 540, 960],   // muro perimetral
  ['2253', 35.16, 38.28, 0.5, 1, 1.06, 540, 960],      // depósito techado
  ['2300', 38.28, 41.87, 0.22, 1, 1.05, 540, 960],     // fin de semana en familia (toma propia)
  ['2285', 41.87, 43.47, 5.0, 1.02, 1.07, 540, 960],   // la mañana en la galería
  ['2302', 43.47, 46.15, 2.14, 1, 1.05, 540, 960],     // la tarde en el lago (toma propia)
  ['2248', 46.15, 48.51, 3.0, 1.02, 1.08, 540, 960],   // la noche alrededor del fogón
  // a cámara
  ['2304', 48.51, 51.27, 0.0, 1, 1.05, 500, 420],
  ['2305', 51.27, 54.67, 0.26, 1, 1.05, 560, 400],
];
const LEAKS = [13.94, 38.28, 48.51].map(f);
const ZBLUR = [4.84, 9.38, 17.14, 19.45, 21.81, 23.39, 25.68, 28.12, 31.37, 32.65, 33.85, 35.16, 41.87, 43.47, 46.15, 51.27].map(f);
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
      <OffthreadVideo src={staticFile(`dae0211/${name}.mp4`)} startFrom={Math.round(srcIn * FPS)} muted />
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
type IconoN = 'sol' | 'tarde' | 'luna' | 'check' | 'pin';
const Icono: React.FC<{n: IconoN; size?: number}> = ({n, size = 84}) => (
  <div style={{width: size, height: size, backgroundColor: CELESTE, display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.35)'}}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth={5} strokeLinecap="square">
      {n === 'sol' && <><circle cx={24} cy={24} r={8} /><path d="M24 4V10M24 38V44M4 24H10M38 24H44M10 10L14 14M34 34L38 38M38 10L34 14M14 34L10 38" /></>}
      {n === 'tarde' && <><path d="M12 32A12 12 0 0 1 36 32" /><path d="M4 32H44M24 8V14M8 18L12 22M40 18L36 22M10 40H38" /></>}
      {n === 'luna' && <path d="M32 6A18 18 0 1 0 42 32A14 14 0 0 1 32 6Z" fill="white" stroke="none" />}
      {n === 'check' && <path d="M9 25 L20 36 L40 13" strokeWidth={7} />}
      {n === 'pin' && <><path d="M24 44C24 44 38 30 38 19A14 14 0 0 0 10 19C10 30 24 44 24 44Z" fill="white" stroke="none" /><circle cx={24} cy={19} r={5} fill={CELESTE} stroke="none" /></>}
    </svg>
  </div>
);

// ---------- subtítulos: Owners Regular + palabra clave en Black, caja navy que entra como resaltador ----------
type Sub = [number, number, string, number, IconoN?];
const Subtitulo: React.FC<{txt: string; y: number; dur: number; icono?: IconoN}> = ({txt, y, dur, icono}) => {
  const {fr, op, sp} = useIO(dur, 2);
  const w = interpolate(fr, [0, 4], [0, 100], {extrapolateRight: 'clamp'});
  const parts = txt.split(/(\*[^*]+\*)/).filter(Boolean);
  return (
    <AbsoluteFill>
      {icono && (
        <div style={{position: 'absolute', left: 540 - 42, top: y - 48 - 18 - 84, opacity: op,
          transform: `scale(${interpolate(sp, [0, 1], [0.4, 1])}) rotate(${interpolate(sp, [0, 1], [-12, 0])}deg)`}}>
          <Icono n={icono} />
        </div>
      )}
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
// alturas: bajo la caja de la cara medida (track_cara, con margen bajo el mentón); sobre B-roll, centro del cuadro
const Y0 = 770, Y2 = 800, Y8 = 815, YB = 960;
const SUBS: Sub[] = [
  [0.05, 0.85, 'No *necesitás*', Y0],
  [7.12, 7.92, 'ya *accedés*', Y2],
  [7.92, 8.66, 'a esta *casa*', Y2],
  [14.30, 15.10, 'la propiedad *cuenta con*', YB],
  [21.81, 22.63, 'living *comedor*', YB],
  [22.63, 23.39, '*integrado*', YB],
  [23.39, 24.31, 'cocina *Achon*', YB],
  [24.31, 24.87, 'con *mesada*', YB],
  [24.87, 25.68, 'de *granito*', YB],
  [25.68, 26.88, 'y *techo de tejas*', YB],
  [26.88, 27.38, 'con *vigas*', YB],
  [27.38, 28.12, 'de *madera*', YB],
  [28.12, 29.05, 'En el *exterior*', YB],
  [29.05, 29.80, 'hay *galería*', YB],
  [29.80, 30.42, '*techada*', YB],
  [30.42, 31.37, 'e *iluminada*,', YB],
  [31.37, 32.65, '*fogón* de piedra,', YB],
  [32.65, 33.85, '*árboles* frutales,', YB],
  [33.85, 35.16, '*muro* perimetral', YB],
  [35.16, 36.06, 'y un *depósito*', YB],
  [36.06, 36.60, '*techado*', YB],
  [36.60, 37.42, 'para *vehículos*', YB],
  [37.42, 38.28, 'o *maquinarias*.', YB],
  [38.32, 39.58, 'Es un lugar *ideal*', YB],
  [39.58, 40.22, 'para *disfrutar*', YB],
  [40.22, 40.90, 'el *fin de semana*', YB],
  [40.90, 41.87, 'con la *familia*.', YB],
  [41.87, 43.47, 'La *mañana* en la galería,', YB, 'sol'],
  [43.47, 44.81, 'la *tarde* en el lago', YB, 'tarde'],
  [44.81, 46.46, 'y la *playa municipal*', YB, 'tarde'],
  [46.46, 47.30, 'y la *noche*', YB, 'luna'],
  [47.30, 48.51, 'alrededor del *fogón*.', YB, 'luna'],
  [48.55, 49.34, '*Además*,', Y8],
  [49.34, 49.78, 'cuenta con', Y8],
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

// línea chica sobre caja navy (como los subtítulos)
const Caja: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 60}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', backgroundColor: 'rgba(10,29,56,0.85)', padding: '4px 14px 8px',
    fontWeight: REG, fontSize: size, lineHeight: 1, whiteSpace: 'nowrap'}}>{children}</div>
);
// cifra-golpe: número en Black celeste grande + unidad en Medium blanca (un solo golpe pesado por título)
const Cifra: React.FC<{n: string; u: string; size?: number}> = ({n, u, size = 170}) => (
  <div style={{whiteSpace: 'nowrap', lineHeight: 1.0, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 18}}>
    <span style={{fontWeight: BLACK, fontSize: size, color: CELESTE, ...CONTORNO(8)}}>{n}</span>
    <span style={{fontWeight: MED, fontSize: size * 0.5, ...CONTORNO(5)}}>{u}</span>
  </div>
);
// tarjeta navy con ícono en cuadrado celeste que se completa al decirse
const Tarjeta: React.FC<{d: number; icono: IconoN; children: React.ReactNode; w?: number}> = ({d, icono, children, w: ancho = 560}) => {
  const fr = useCurrentFrame() - d;
  if (fr < 0) return <div style={{height: 116, marginTop: 18}} />;
  const w = interpolate(fr, [0, 6], [0, 100], {extrapolateRight: 'clamp'});
  const sp = spring({frame: Math.max(0, fr - 3), fps: FPS, config: {damping: 11, stiffness: 210}});
  const k = interpolate(fr, [4, 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'relative', width: ancho, height: 116, margin: '18px auto 0'}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w}%`, backgroundColor: NAVY, opacity: 0.92}} />
      <div style={{position: 'absolute', left: 18, top: 18, transform: `scale(${interpolate(sp, [0, 1], [0.3, 1])})`}}>
        <Icono n={icono} size={80} />
      </div>
      <div style={{position: 'absolute', left: 118, right: 10, top: 0, bottom: 0, display: 'flex', alignItems: 'center',
        fontSize: 56, lineHeight: 1, whiteSpace: 'nowrap', opacity: k, transform: `translateX(${(1 - k) * 16}px)`}}>
        {children}
      </div>
    </div>
  );
};

// hook: "tener los / 600 millones / juntos para comprarte"
const T1: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={715} dur={dur}>
    <Sube d={0}><Caja>tener los</Caja></Sube>
    <Pop d={f(1.35 - 0.85)}><Cifra n="600" u="millones" /></Pop>
    <Sube d={f(2.12 - 0.85)}><Caja>juntos para&nbsp;<span style={{fontWeight: BLACK}}>comprarte</span></Caja></Sube>
  </Bloque>
);
// "tu casa de campo / en Ypacaraí" a máquina de escribir
const T2: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={825} dur={dur}>
    <Maquina size={74} words={[['tu', 0.02, 0.14], ['casa', 0.14, 0.36], ['de', 0.36, 0.46], ['campo', 0.46, 0.84], ['\n', 0, 0],
      ['en', 0.84, 0.96], ['Ypacaraí', 0.96, 1.36]]} />
  </Bloque>
);
// "entrega inicial / 180 millones"
const T3: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={750} dur={dur}>
    <Sube d={0}><Caja>con una entrega&nbsp;<span style={{fontWeight: BLACK}}>inicial</span>&nbsp;de</Caja></Sube>
    <Pop d={f(6.01 - 5.15)}><Cifra n="180" u="millones" /></Pop>
  </Bloque>
);
// ubicación: pin + "Cerro Güi · Ypacaraí"
const Pin: React.FC<{dur: number}> = ({dur}) => {
  const {sp, op} = useIO(dur);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 930, opacity: op, display: 'flex', justifyContent: 'center', filter: SOMBRA}}>
        <div style={{display: 'flex', alignItems: 'center', transform: `translateY(${interpolate(sp, [0, 1], [24, 0])}px)`}}>
          <div style={{transform: `scale(${interpolate(sp, [0, 1], [0.4, 1])})`}}><Icono n="pin" size={96} /></div>
          <div style={{backgroundColor: 'rgba(10,29,56,0.9)', height: 96, display: 'flex', alignItems: 'center', padding: '0 24px 4px',
            fontFamily: OW, color: 'white', fontSize: 56, letterSpacing: '-0.02em', whiteSpace: 'nowrap',
            clipPath: `inset(0 ${100 - interpolate(useCurrentFrame(), [3, 10], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}% 0 0)`}}>
            <span style={{fontWeight: BLACK}}>Cerro Güi</span><span style={{fontWeight: REG}}>&nbsp;· Ypacaraí</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
// "el saldo en / 24 meses"
const T4: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={925} dur={dur}>
    <Sube d={0}><Caja>el&nbsp;<span style={{fontWeight: BLACK}}>saldo</span>&nbsp;en</Caja></Sube>
    <Pop d={f(10.50 - 9.90)}><Cifra n="24" u="meses" /></Pop>
  </Bloque>
);
// "amoblada" / "y equipada" con check
const T5: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={920} dur={dur} sombra={false}>
    <Tarjeta d={f(12.50 - 11.72)} icono="check"><span style={{fontWeight: BLACK}}>amoblada</span></Tarjeta>
    <Tarjeta d={f(13.30 - 11.72)} icono="check"><span style={{fontWeight: REG}}>y&nbsp;</span><span style={{fontWeight: BLACK}}>equipada</span></Tarjeta>
  </Bloque>
);
// cifras de la propiedad sobre el B-roll, centradas en el cuadro
const T6: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={860} dur={dur}>
    <Pop d={0}><Cifra n="2.000" u="m²" /></Pop>
    <Sube d={f(16.32 - 15.10)}><Caja>de&nbsp;<span style={{fontWeight: BLACK}}>terreno</span></Caja></Sube>
  </Bloque>
);
const T7: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={860} dur={dur}>
    <Pop d={f(17.28 - 17.14)}><Cifra n="120" u="m²" /></Pop>
    <Sube d={f(18.74 - 17.14)}><Caja><span style={{fontWeight: BLACK}}>construidos</span></Caja></Sube>
  </Bloque>
);
const T8: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={850} dur={dur}>
    <Pop d={f(19.87 - 19.45)}><Cifra n="2" u="dormitorios" /></Pop>
    <Sube d={f(20.57 - 19.45)}><Caja>con&nbsp;<span style={{fontWeight: BLACK}}>aire acondicionado</span></Caja></Sube>
  </Bloque>
);
// "TÍTULO / listo para transferir" bajo el mentón
const T10: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={790} dur={dur}>
    <Pop d={f(49.82 - 49.78)}><div style={{fontWeight: BLACK, fontSize: 130, lineHeight: 1.0, whiteSpace: 'nowrap', ...CONTORNO(8)}}>título</div></Pop>
    <Tarjeta d={f(50.22 - 49.78)} icono="check" w={720}><span style={{fontWeight: REG}}>listo para&nbsp;</span><span style={{fontWeight: BLACK, color: CELESTE}}>transferir</span></Tarjeta>
  </Bloque>
);
// CTA: "Escribinos / por WhatsApp" a máquina de escribir + "y coordinamos una visita"
const T11: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={745} dur={dur}>
    <Maquina size={96} words={[['Escribinos', 0.05, 0.5], ['\n', 0, 0], ['por', 0.76, 0.9], ['WhatsApp', 0.92, 1.3]]} />
    <div style={{height: 16}} />
    <Sube d={f(52.93 - 51.30)}><Caja size={56}>y coordinamos una&nbsp;<span style={{fontWeight: BLACK}}>visita</span></Caja></Sube>
  </Bloque>
);

export const TITULOS: [number, number, (d: number) => React.ReactNode][] = [
  [0.85, 3.40, (d) => <T1 dur={d} />],
  [3.40, 5.15, (d) => <T2 dur={d} />],
  [5.15, 7.12, (d) => <T3 dur={d} />],
  [8.66, 9.90, (d) => <Pin dur={d} />],
  [9.90, 11.72, (d) => <T4 dur={d} />],
  [11.72, 14.30, (d) => <T5 dur={d} />],
  [15.10, 17.14, (d) => <T6 dur={d} />],
  [17.14, 19.45, (d) => <T7 dur={d} />],
  [19.45, 21.81, (d) => <T8 dur={d} />],
  [49.78, 51.27, (d) => <T10 dur={d} />],
  [51.30, 54.667, (d) => <T11 dur={d} />],
];

const Guias: React.FC = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 980, border: '3px dashed #00ff66'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, backgroundColor: 'rgba(0,255,255,0.5)'}} />
  </AbsoluteFill>
);

export const DAE0211: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    {CLIPS.map((c, i) => (
      <Sequence key={i} from={f(c[1])} durationInFrames={f(c[2]) - f(c[1])}>
        <Plano clip={c} />
      </Sequence>
    ))}
    <LightLeak />
    {SUBS.map(([a, b, txt, y, ic], i) => (
      <Sequence key={'s' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        <Subtitulo txt={txt} y={y} dur={f(b) - f(a)} icono={ic} />
      </Sequence>
    ))}
    {TITULOS.map(([a, b, el], i) => (
      <Sequence key={'t' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        {el(f(b) - f(a))}
      </Sequence>
    ))}
    {GUIAS && <Guias />}
    {!GUIAS && <Audio src={staticFile('dae0211/mix.wav')} />}
  </AbsoluteFill>
);
