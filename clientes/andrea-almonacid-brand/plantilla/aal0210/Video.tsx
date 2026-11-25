import React from 'react';
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, getInputProps, interpolate, spring,
  staticFile, useCurrentFrame,
} from 'remotion';
import data from './data.json';

// AAL 02-10 pauta Gaviotas (Barrio Pájaro Azul, Bariloche) — acabado (pauta: contenido hasta y = 1250)
export const FPS = 30;
export const AAL0210_FRAMES = data.total;
const f = (s: number) => Math.round(s * FPS);
const GUIAS = Boolean((getInputProps() as {guias?: boolean}).guias);

const ROJO = '#DB1B2E', ROJO_P = '#D21824', AZUL = '#335CA9';
const AC = 'acumin-pro', BS = 'Brittany Signature';
const MED = 500, BLACK = 800, ULTRA = 900;
const SOMBRA = 'drop-shadow(0 2px 4px rgba(0,0,0,0.55)) drop-shadow(0 6px 20px rgba(0,0,0,0.45))';

// ---------- fuentes: Acumin Pro (copiada de la sincronización de Creative Cloud) + Brittany ----------
const FONTS: [string, string, number][] = [
  [AC, 'AcuminPro-Medium.otf', MED], [AC, 'AcuminPro-Black.otf', BLACK], [AC, 'AcuminPro-UltraBlack.otf', ULTRA],
  [BS, 'BrittanySignature.ttf', 400],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([fam, file, weight]) =>
  new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight: String(weight)}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

// ---------- planos ----------
// [toma, desde, hasta (frames), entrada en la fuente (s), escala, x0a, y0a, x0b, y0b]
type Clip = [string, number, number, number, number, ...number[]];
const CLIPS = data.clips as unknown as Clip[];
// ojos (px del cuadro a 1×) por plano del speaker: ancla del zoom lento (así el punch-in sigue calzando)
const OJOS: Record<number, [number, number]> = {0: [577, 839], 129: [591, 816], 273: [503, 836], 1868: [527, 786]};

// ---------- transiciones ----------
const WHIPS = [50, 129, 299, 894, 1260, 1588, 1868];
const SIN = [0, 195, 273]; // arranque (tiene su propio whip de entrada) y los punch del hook
const ZBLUR = CLIPS.map((c) => c[1]).filter((c) => !WHIPS.includes(c) && !SIN.includes(c));
const LEAKS = [299, 642, 894, 1260, 1588, 1868];
const pulso = (fr: number, c: number) => Math.max(0, 1 - Math.abs(fr - c + 0.5) / 3.5);

const Plano: React.FC<{clip: Clip}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [name, a, b, srcIn, s, ...rc] = clip;
  const g = a + frame, dur = b - a;
  let tx = 0, hblur = 0, zb = 0;
  // whip: el plano que sale se va a la izquierda, el que entra llega desde la derecha
  for (const c of [...WHIPS, 0]) {
    const e = c === 0 ? Math.max(0, 1 - (g + 0.5) / 4.5) : pulso(g, c);
    if (e > 0) { tx += (g < c ? -1 : 1) * 200 * e * e; hblur = Math.max(hblur, 46 * e); }
  }
  for (const c of ZBLUR) zb = Math.max(zb, pulso(g, c));
  // el whip va en un envoltorio aparte que se agranda lo justo para que el corrimiento y el desenfoque no muestren bordes negros
  const sw = 1 + (2 * Math.abs(tx) + 3 * hblur) / 1080;
  let transform: string, origin = '0px 0px';
  if (s !== 1) {
    const [x0a, y0a, x0b, y0b] = rc;
    const p = interpolate(frame, [0, dur - 1], [0, 1], {extrapolateRight: 'clamp'});
    const x0 = x0a + (x0b - x0a) * p, y0 = y0a + (y0b - y0a) * p;
    transform = `translate(${-x0 * s}px, ${-y0 * s}px) scale(${s})`;
  } else if (OJOS[a]) {
    const [ex, ey] = OJOS[a];
    transform = `scale(${interpolate(frame, [0, dur], [1, 1.06])})`;
    origin = `${ex}px ${ey}px`;
  } else {
    transform = `scale(${interpolate(frame, [0, dur], [1, 1.07]) * (1 + 0.22 * zb)})`;
    origin = '540px 960px';
  }
  const fid = `wb${a}`;
  return (
    <AbsoluteFill style={{transform: `translateX(${tx}px) scale(${sw})`, transformOrigin: '540px 960px', filter: hblur > 0.5 ? `url(#${fid})` : undefined}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id={fid} x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${hblur} 0`} edgeMode="duplicate" /></filter>
      </svg>
      <AbsoluteFill style={{transform, transformOrigin: origin, filter: zb > 0.05 ? `blur(${14 * zb}px)` : undefined}}>
        <OffthreadVideo src={staticFile(`aal0210/v${name}.mp4`)} startFrom={Math.round(srcIn * FPS)} muted />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// light leak cálido (amarillo / naranja / rosa) en modo screen, ~0,8 s centrado en el corte
const LightLeak: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      {LEAKS.map((c) => {
        const k = interpolate(fr, [c - 10, c, c + 14], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        if (k <= 0) return null;
        const p = (fr - c + 10) / 24;
        return (
          <AbsoluteFill key={c} style={{mixBlendMode: 'screen', opacity: k}}>
            <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 55% at ${8 + 84 * p}% ${25 + 30 * p}%, rgba(255,190,70,0.95), rgba(255,110,50,0.55) 45%, rgba(0,0,0,0) 75%)`}} />
            <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 45% at ${92 - 70 * p}% ${78 - 35 * p}%, rgba(255,110,160,0.8), rgba(0,0,0,0) 70%)`}} />
            <AbsoluteFill style={{backgroundColor: `rgba(255,225,185,${0.3 * k})`}} />
          </AbsoluteFill>
        );
      })}
    </>
  );
};

// ---------- entrada / salida ----------
const useIO = (dur: number, outF = 4) => {
  const fr = useCurrentFrame();
  const sp = spring({frame: fr, fps: FPS, config: {damping: 13, stiffness: 180}});
  const o = Math.min(outF, Math.max(1, dur - 4));
  const op = interpolate(fr, [0, 2, Math.max(3, dur - o), Math.max(4, dur)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return {fr, sp, op, sc: interpolate(sp, [0, 1], [0.84, 1])};
};

// ---------- subtítulos ----------
// estilos: m = Medium blanco · b = Black MAYÚSCULA blanco · r = Black rojo con borde blanco · a = Black azul con borde blanco
type Sub = [number, number, string, number?];
const Palabra: React.FC<{w: string; st: string}> = ({w, st}) => {
  const base: React.CSSProperties = {display: 'inline-block', margin: '0 0.11em', letterSpacing: '-0.01em'};
  if (st === 'm') return <span style={{...base, fontWeight: MED, color: 'white'}}>{w}</span>;
  if (st === 'b') return <span style={{...base, fontWeight: BLACK, color: 'white'}}>{w}</span>;
  const col = st === 'r' ? ROJO : AZUL;
  return <span style={{...base, fontWeight: BLACK, fontSize: '1.12em', color: col, WebkitTextStroke: '7px white', paintOrder: 'stroke fill'}}>{w}</span>;
};
const Subtitulo: React.FC<{txt: string; y: number; dur: number}> = ({txt, y, dur}) => {
  const {op, sc} = useIO(dur, 2);
  // "palabra/estilo palabra/estilo ..." (sin estilo = m)
  const ws = txt.split(' ').map((t) => t.split('/'));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 180, width: 720, top: y, transform: `translateY(-50%) scale(${sc})`, opacity: op,
        textAlign: 'center', fontFamily: AC, fontSize: 62, lineHeight: 1.0, filter: SOMBRA}}>
        {ws.map(([w, st], i) => <Palabra key={i} w={w} st={st ?? 'm'} />)}
      </div>
    </AbsoluteFill>
  );
};
const YH = 1120, YB = 960, YC = 1035; // bajo la cara medida en el hook / centro sobre B-roll / bajo la cara en el CTA
const SUBS: Sub[] = [
  [0.03, 0.96, 'Esta OPORTUNIDAD/b', YH], [0.96, 1.69, 'es para VOS/b', YH],
  [9.11, 9.97, 'Vení que te MUESTRO/b', 1085],
  [10.22, 10.82, 'En una calle'], [10.82, 11.62, 'TRANQUILA/r'],
  [14.25, 14.86, 'en la zona'], [14.86, 15.58, 'más TURÍSTICA/b'], [15.58, 17.03, 'del KM/a 12/a'],
  [17.03, 17.74, 'esta propiedad'], [17.74, 18.31, 'combina'], [18.31, 19.50, 'NATURALEZA/r'],
  [19.50, 20.09, 'y múltiples'], [20.09, 20.62, 'posibilidades'], [20.62, 21.45, 'de USO/b'],
  [21.62, 22.27, 'Su orientación'], [22.27, 22.88, 'NOROESTE/a'], [22.88, 23.40, 'te permite'], [23.40, 23.86, 'disfrutar'],
  [23.86, 24.52, 'de los mejores'], [24.52, 25.15, 'ATARDECERES/r'], [25.15, 25.53, 'que entran'], [25.53, 26.45, 'por el JARDÍN/b'],
  [29.90, 30.64, 'encontramos la', 1110], [30.64, 31.49, 'CASA/b PRINCIPAL/b', 1110],
  [33.87, 34.72, 'COCINA/b ABIERTA/b'], [34.72, 35.28, 'integrada al'], [35.28, 36.40, 'LIVING/b COMEDOR/b'],
  [36.40, 37.10, 'y una ESCALERA/b'], [37.10, 37.68, 'interna'], [37.68, 38.22, 'que nos lleva'], [38.22, 39.36, 'a la PLANTA/a ALTA/a'],
  [39.36, 39.99, 'que funciona'], [39.99, 40.71, 'como OFICINA/r'], [40.71, 41.21, 'o segundo'], [41.21, 42.02, 'DORMITORIO/b'],
  [42.02, 42.66, 'En el segundo'], [42.66, 43.16, 'BLOQUE/b'],
  [44.66, 45.44, 'cada uno con'], [45.44, 46.28, 'un DORMITORIO/b'], [46.28, 46.62, 'BAÑO/a'], [46.62, 47.14, 'y cocina'],
  [47.14, 47.52, 'COMEDOR/b'], [47.52, 48.63, 'integrada'],
  [48.63, 49.10, 'ambos con'], [49.10, 50.38, 'ENTRADA/r INDEPENDIENTE/r'],
  [50.38, 51.23, 'ideales para'], [51.23, 51.99, 'RENTA/a TURÍSTICA/a'], [51.99, 52.92, 'o PERMANENTE/a'],
  [52.92, 53.65, 'Todo esto'], [53.65, 54.49, 'se complementa'], [54.49, 55.15, 'con un amplio'], [55.15, 55.52, 'JARDÍN/r'],
  [55.52, 56.00, 'con plantas'], [56.00, 56.95, 'NATIVAS/b'],
  [57.01, 57.83, 'GARAGE/a', 1085],
  [62.21, 62.49, 'Si querés', YC], [62.49, 62.85, 'COORDINAR/b', YC], [62.85, 63.52, 'una VISITA/r', YC],
];

// ---------- títulos ----------
const fit = (txt: string, base: number, k = 0.64) => Math.min(base, Math.floor(700 / (txt.length * k)));
// rojo de marca con un tramo rosado claro que pasa como brillo
const rojoBrillo = (p: number): React.CSSProperties => ({
  backgroundImage: `linear-gradient(100deg, ${ROJO_P} ${p - 30}%, #FFD6DC ${p}%, ${ROJO_P} ${p + 22}%)`,
  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
});
const Bloque: React.FC<{y: number; dur: number; children: React.ReactNode}> = ({y, dur, children}) => {
  const {op, sc} = useIO(dur);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 180, width: 720, top: y, transform: `translateY(-50%) scale(${sc})`, opacity: op,
        filter: SOMBRA, textAlign: 'center', fontFamily: AC, color: 'white', letterSpacing: '-0.015em'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
// línea que entra d frames después que el título
const Tarde: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 13, stiffness: 180}});
  return <div style={{opacity: fr < 0 ? 0 : Math.min(1, sp * 1.4), transform: `translateY(${interpolate(sp, [0, 1], [22, 0])}px)`}}>{children}</div>;
};
// palabra grande roja: un bloque rojo barre y la revela, después pasa el brillo
const Barrido: React.FC<{d?: number; size: number; children: React.ReactNode}> = ({d = 0, size, children}) => {
  const fr = useCurrentFrame() - d;
  if (fr < 0) return <div style={{height: size * 0.86}} />;
  const w = interpolate(fr, [0, 5], [0, 100], {extrapolateRight: 'clamp'});
  const l = interpolate(fr, [5, 10], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const p = interpolate(fr, [6, 26], [-20, 130], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'relative', display: 'inline-block'}}>
      <div style={{fontWeight: ULTRA, fontSize: size, lineHeight: 0.86, whiteSpace: 'nowrap', opacity: fr >= 5 ? 1 : 0, ...rojoBrillo(p)}}>{children}</div>
      <div style={{position: 'absolute', top: '4%', bottom: '4%', left: `${l}%`, width: `${Math.max(0, w - l)}%`, backgroundColor: ROJO}} />
    </div>
  );
};
const conBorde = (col: string, px = 9): React.CSSProperties => ({color: col, WebkitTextStroke: `${px}px white`, paintOrder: 'stroke fill'});

// T1 hook sobre la casa: casa principal + 2 departamentos
const T1: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={930} dur={dur}>
    <div style={{fontWeight: ULTRA, fontSize: fit('CASA PRINCIPAL', 104, 0.74), lineHeight: 0.9, whiteSpace: 'nowrap'}}>CASA PRINCIPAL</div>
    <Tarde d={31}><div style={{fontWeight: ULTRA, fontSize: fit('+2 DEPARTAMENTOS', 92, 0.74), lineHeight: 1.0, marginTop: 6, whiteSpace: 'nowrap', ...conBorde(AZUL)}}>+2 DEPARTAMENTOS</div></Tarde>
    <Tarde d={56}><div style={{fontWeight: MED, fontSize: 54, marginTop: 4}}>independientes</div></Tarde>
  </Bloque>
);
// T2 hook sobre la cabeza: lugar
const T2: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={455} dur={dur}>
    <div style={{fontFamily: BS, fontSize: 104, lineHeight: 1.1, whiteSpace: 'nowrap', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.7))'}}>Barrio Pájaro Azul</div>
    <Barrido d={46} size={fit('BARILOCHE', 150, 0.76)}>BARILOCHE</Barrido>
  </Bloque>
);
// T3 hook sobre la cabeza: precio
const T3: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={415} dur={dur}>
    <div style={{fontWeight: BLACK, fontSize: 66, lineHeight: 0.95}}>3 UNIDADES <span style={{fontWeight: MED, fontSize: 52}}>por</span></div>
    <Barrido d={33} size={fit('USD 289.000', 150, 0.7)}>USD 289.000</Barrido>
  </Bloque>
);
const Pin: React.FC<{d?: number}> = ({d = 0}) => {
  const fr = useCurrentFrame() - d;
  const k = interpolate(fr, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <svg width="96" height="124" viewBox="0 0 24 31" style={{display: 'block', margin: '0 auto 12px', transform: `translateY(${(1 - k) * -30}px)`, opacity: k}}>
      <path d="M12 1.2C6 1.2 1.2 6 1.2 11.8 1.2 19.8 12 29.8 12 29.8s10.8-10 10.8-18C22.8 6 18 1.2 12 1.2z" fill="none" stroke="white" strokeWidth="1.9"
        strokeDasharray="80" strokeDashoffset={80 * (1 - k)} />
      <circle cx="12" cy="11.8" r="3.8" fill={ROJO} opacity={k} />
    </svg>
  );
};
// T4 distancia a Bustillo
const T4: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={940} dur={dur}>
    <Pin />
    <Barrido d={4} size={fit('A 120 METROS', 132, 0.72)}>A 120 METROS</Barrido>
    <Tarde d={40}><div style={{fontFamily: BS, fontSize: 96, lineHeight: 1.0, marginTop: 6}}>de Av. Bustillo</div></Tarde>
  </Bloque>
);
// contorno del lote que se dibuja
const Lote: React.FC = () => {
  const fr = useCurrentFrame();
  const k = interpolate(fr, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <svg width="150" height="104" viewBox="0 0 150 104" style={{display: 'block', margin: '0 auto 14px'}}>
      <path d="M12 14 L138 6 L144 92 L6 98 Z" fill="none" stroke="white" strokeWidth="5" strokeLinejoin="round" strokeDasharray="480" strokeDashoffset={480 * (1 - k)} />
      <rect x="52" y="38" width="36" height="30" fill="none" stroke="white" strokeWidth="4" opacity={k} />
      <path d="M48 40 L70 24 L92 40" fill="none" stroke="white" strokeWidth="4" opacity={k} />
    </svg>
  );
};
// T5 terreno
const T5: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={950} dur={dur}>
    <Lote />
    <div style={{fontWeight: BLACK, fontSize: 64, lineHeight: 0.95}}>TERRENO DE</div>
    <Barrido d={26} size={160}>1.137 m<span style={{fontSize: '0.46em', verticalAlign: '0.95em', marginLeft: '0.04em'}}>2</span></Barrido>
  </Bloque>
);
// T6 casa principal: dormitorio y baño en PB
const T6: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={950} dur={dur}>
    <div style={{fontWeight: ULTRA, fontSize: 92, lineHeight: 0.95}}>1 <span style={conBorde(ROJO)}>DORMITORIO</span></div>
    <Tarde d={28}><div style={{fontWeight: ULTRA, fontSize: 92, lineHeight: 1.0, marginTop: 4, ...conBorde(AZUL)}}>+ BAÑO</div></Tarde>
    <Tarde d={36}><div style={{fontWeight: MED, fontSize: 52, marginTop: 6}}>en planta baja</div></Tarde>
  </Bloque>
);
// T7 segundo bloque
const T7: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={940} dur={dur}>
    <div style={{fontWeight: ULTRA, fontSize: 200, lineHeight: 0.85}}>2</div>
    <div style={{fontWeight: ULTRA, fontSize: fit('DEPARTAMENTOS', 104, 0.74), lineHeight: 1.0, whiteSpace: 'nowrap', ...conBorde(AZUL, 10)}}>DEPARTAMENTOS</div>
  </Bloque>
);
// T8 servicios: íconos de línea que entran con cada palabra
const ICONOS: Record<string, React.ReactNode> = {
  agua: <path d="M32 10 C32 10 16 30 16 40 a16 16 0 0 0 32 0 C48 30 32 10 32 10z" />,
  gas: <g><path d="M32 6 C35 18 47 24 47 40 C47 51 40 58 32 58 C24 58 17 51 17 42 C17 34 23 29 25 21 C29 27 30 31 33 33 C35 25 34 15 32 6 Z" /><path d="M32 56 C27 56 25 51 26 47 C27 43 31 41 32 37 C35 42 38 45 38 49 C38 53 36 56 32 56 Z" /></g>,
  luz: <path d="M36 6 L18 36 H31 L27 58 L46 26 H33 Z" />,
  wifi: <g><path d="M10 26 a32 32 0 0 1 44 0" /><path d="M18 34 a20 20 0 0 1 28 0" /><path d="M26 42 a8 8 0 0 1 12 0" /><circle cx="32" cy="50" r="2.5" fill="white" /></g>,
};
const Servicio: React.FC<{d: number; ic: string; label: string}> = ({d, ic, label}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 11, stiffness: 200}});
  return (
    <div style={{width: 300, opacity: fr < 0 ? 0 : 1, transform: `scale(${fr < 0 ? 0.5 : interpolate(sp, [0, 1], [0.5, 1])})`}}>
      <div style={{width: 128, height: 128, borderRadius: 64, backgroundColor: ROJO, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 5px white'}}>
        <svg width="78" height="78" viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">{ICONOS[ic]}</svg>
      </div>
      <div style={{fontWeight: BLACK, fontSize: 34, marginTop: 14, lineHeight: 0.95, whiteSpace: 'nowrap'}}>{label}</div>
    </div>
  );
};
const T8: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={985} dur={dur}>
    <div style={{fontWeight: BLACK, fontSize: 68, lineHeight: 1, marginBottom: 26}}>SERVICIOS</div>
    <div style={{display: 'flex', justifyContent: 'center', gap: 60}}>
      <Servicio d={f(58.51 - 57.83)} ic="agua" label="AGUA CORRIENTE" />
      <Servicio d={f(59.37 - 57.83)} ic="gas" label="GAS NATURAL" />
    </div>
    <div style={{display: 'flex', justifyContent: 'center', gap: 60, marginTop: 30}}>
      <Servicio d={f(60.24 - 57.83)} ic="luz" label="ELECTRICIDAD" />
      <Servicio d={f(61.42 - 57.83)} ic="wifi" label="INTERNET" />
    </div>
  </Bloque>
);
// T9 CTA sobre la cabeza
const T9: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={450} dur={dur}>
    <Barrido size={fit('ESCRIBIME', 150, 0.76)}>ESCRIBIME</Barrido>
    <Tarde d={14}><div style={{fontWeight: MED, fontSize: 62, marginTop: 8}}>por <span style={{fontWeight: BLACK}}>WHATSAPP</span></div></Tarde>
  </Bloque>
);

export const TITULOS: [number, number, (d: number) => React.ReactNode][] = [
  [1.69, 4.31, (d) => <T1 dur={d} />],
  [4.33, 6.48, (d) => <T2 dur={d} />],
  [6.50, 9.10, (d) => <T3 dur={d} />],
  [11.62, 14.22, (d) => <T4 dur={d} />],
  [26.76, 29.90, (d) => <T5 dur={d} />],
  [31.49, 33.87, (d) => <T6 dur={d} />],
  [43.16, 44.66, (d) => <T7 dur={d} />],
  [57.83, 62.0, (d) => <T8 dur={d} />],
  [63.52, 65.933, (d) => <T9 dur={d} />],
];

// degradé oscuro arriba mientras hay un título sobre la cabeza
const ARRIBA: [number, number][] = [[4.33, 6.48], [6.50, 9.10], [63.52, 65.933]];
const SombraArriba: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let k = 0;
  for (const [a, b] of ARRIBA) k = Math.max(k, Math.min(1, (t - a) / 0.2, (b - t) / 0.15));
  if (k <= 0) return null;
  return <AbsoluteFill style={{opacity: k * 0.85, background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 22%, rgba(0,0,0,0) 38%)'}} />;
};

// guías de revisión: zona segura de pauta y zona de la cara medida
const Guias: React.FC = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 980, border: '3px dashed #00ff66'}} />
    <div style={{position: 'absolute', left: 0, top: 1250, width: 1080, height: 2, backgroundColor: '#ff3355'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, backgroundColor: 'rgba(0,255,255,0.5)'}} />
  </AbsoluteFill>
);

export const AAL0210: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    {CLIPS.map((c, i) => (
      <Sequence key={i} from={c[1]} durationInFrames={c[2] - c[1]}>
        <Plano clip={c} />
      </Sequence>
    ))}
    <LightLeak />
    <SombraArriba />
    {SUBS.map(([a, b, txt, y], i) => (
      <Sequence key={'s' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        <Subtitulo txt={txt} y={y ?? YB} dur={f(b) - f(a)} />
      </Sequence>
    ))}
    {TITULOS.map(([a, b, el], i) => (
      <Sequence key={'t' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        {el(f(b) - f(a))}
      </Sequence>
    ))}
    {GUIAS && <Guias />}
    <Audio src={staticFile('aal0210/mix.wav')} />
  </AbsoluteFill>
);
