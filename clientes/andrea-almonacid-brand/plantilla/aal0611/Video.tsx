import React from 'react';
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, getInputProps, interpolate, spring,
  staticFile, useCurrentFrame,
} from 'remotion';
import data from './data.json';

// AAL 06-11 propiedad en Av. Las Victorias (Bariloche) — hook a cámara frente a la casa, cuerpo en off sobre el recorrido,
// CTA a cámara adentro. Zona segura de pauta: contenido hasta y = 1250. Cortes del cuerpo en la grilla de Funkee Monkeee (0,6 s).
export const FPS = 30;
export const AAL0611_FRAMES = data.total;
const f = (s: number) => Math.round(s * FPS);
const GUIAS = Boolean((getInputProps() as {guias?: boolean}).guias);
const SIN_AUDIO = Boolean((getInputProps() as {mudo?: boolean}).mudo);

const ROJO = '#DB1B2E', ROJO_P = '#D21824', AZUL = '#335CA9';
const AC = 'acumin-pro', BS = 'Brittany Signature';
const MED = 500, BLACK = 800, ULTRA = 900;
const SOMBRA = 'drop-shadow(0 2px 4px rgba(0,0,0,0.55)) drop-shadow(0 6px 20px rgba(0,0,0,0.45))';
const SOMBRA_SUB = 'drop-shadow(0 0 3px rgba(0,0,0,0.7)) drop-shadow(0 2px 4px rgba(0,0,0,0.55)) drop-shadow(0 6px 20px rgba(0,0,0,0.45))';

// ---------- fuentes ----------
const FONTS: [string, string, number][] = [
  [AC, 'AcuminPro-Medium.otf', MED], [AC, 'AcuminPro-Black.otf', BLACK], [AC, 'AcuminPro-UltraBlack.otf', ULTRA],
  [BS, 'BrittanySignature.ttf', 400],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([fam, file, weight]) =>
  new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight: String(weight)}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

// ---------- planos ----------
// [archivo, desde, hasta (frames), entrada en el archivo (s), tipo h/c/b, escala inicial, escala final]
type Clip = [string, number, number, number, string, number, number];
const CLIPS = data.clips as unknown as Clip[];
const EYES = data.eyes as unknown as Record<string, [number, number][]>;

// ---------- transiciones ----------
// whip + light leak en los cambios de bloque: hook→cuerpo, 1ª construcción, 2ª construcción, renta, ubicación, estilo, CTA
export const WHIPS = [252, 864, 1170, 1404, 1584, 1872, 2232];
const SIN = [0, 43, 89, 151, 204, 2304]; // arranque (whip propio) y punch-ins del hook y del CTA
export const ZBLUR = CLIPS.map((c) => c[1]).filter((c) => !WHIPS.includes(c) && !SIN.includes(c));
const LEAKS = WHIPS;
const pulso = (fr: number, c: number) => Math.max(0, 1 - Math.abs(fr - c + 0.5) / 3.5);

const Plano: React.FC<{clip: Clip}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [file, a, b, srcIn, tipo, s0, s1] = clip;
  const g = a + frame, dur = b - a;
  let tx = 0, hblur = 0, zb = 0;
  for (const c of [...WHIPS, 0]) {
    const e = c === 0 ? Math.max(0, 1 - (g + 0.5) / 4.5) : pulso(g, c);
    if (e > 0) { tx += (g < c ? -1 : 1) * 200 * e * e; hblur = Math.max(hblur, 46 * e); }
  }
  for (const c of ZBLUR) zb = Math.max(zb, pulso(g, c));
  const sw = 1 + (2 * Math.abs(tx) + 3 * hblur) / 1080;
  const p = interpolate(frame, [0, Math.max(1, dur - 1)], [0, 1], {extrapolateRight: 'clamp'});
  const pe = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  const s = (s0 + (s1 - s0) * (tipo === 'b' ? pe : p)) * (1 + 0.22 * zb);
  let origin = '540px 960px';
  if (tipo !== 'b') {
    const ey = EYES[String(a)];
    const [ex, eyy] = ey[Math.min(ey.length - 1, frame)];
    origin = `${ex}px ${eyy}px`; // zoom anclado a los ojos
  }
  const fid = `wb${a}`;
  return (
    <AbsoluteFill style={{transform: `translateX(${tx}px) scale(${sw})`, transformOrigin: '540px 960px', filter: hblur > 0.5 ? `url(#${fid})` : undefined}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id={fid} x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${hblur} 0`} edgeMode="duplicate" /></filter>
      </svg>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: origin, filter: zb > 0.05 ? `blur(${14 * zb}px)` : undefined}}>
        <OffthreadVideo src={staticFile(`aal0611/${file}`)} startFrom={Math.round(srcIn * FPS)} muted />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

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
type Sub = [number, number, string, number];
const Palabra: React.FC<{w: string; st: string}> = ({w, st}) => {
  const base: React.CSSProperties = {display: 'inline-block', margin: '0 0.11em', letterSpacing: '-0.01em'};
  if (st === 'm') return <span style={{...base, fontWeight: MED, color: 'white'}}>{w}</span>;
  if (st === 'b') return <span style={{...base, fontWeight: BLACK, color: 'white'}}>{w}</span>;
  const col = st === 'r' ? ROJO : AZUL;
  return <span style={{...base, fontWeight: BLACK, fontSize: '1.12em', color: col, WebkitTextStroke: '7px white', paintOrder: 'stroke fill'}}>{w}</span>;
};
const Subtitulo: React.FC<{txt: string; y: number; dur: number}> = ({txt, y, dur}) => {
  const {op, sc} = useIO(dur, 2);
  const ws = txt.split(' ').map((t) => t.split('/'));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 180, width: 720, top: y, transform: `translateY(-50%) scale(${sc})`, opacity: op,
        textAlign: 'center', fontFamily: AC, fontSize: 62, lineHeight: 1.0, filter: SOMBRA_SUB}}>
        {ws.map(([w, st], i) => <Palabra key={i} w={w} st={st ?? 'm'} />)}
      </div>
    </AbsoluteFill>
  );
};
// sobre B-roll con Andrea en cuadro: el subtítulo se corre lo mínimo para no taparle la cara (medido en el render)
const SUBY_B: Record<string, number> = (data as unknown as {suby_b?: Record<string, number>}).suby_b ?? {};
const SUBS = (data.subs as unknown as Sub[]).map(([a, b, t, y]) => [a, b, t, SUBY_B[a.toFixed(3)] ?? y] as Sub);

// ---------- títulos ----------
type Tit = {a: number; b: number; w: number[]};
const TT = data.titles as unknown as Record<string, Tit>;
const fit = (txt: string, base: number, k = 0.74) => Math.min(base, Math.floor(700 / (txt.length * k)));
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
const Tarde: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 13, stiffness: 180}});
  return <div style={{opacity: fr < 0 ? 0 : Math.min(1, sp * 1.4), transform: `translateY(${interpolate(sp, [0, 1], [22, 0])}px)`}}>{children}</div>;
};
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
const M2: React.FC = () => <span style={{fontSize: '0.46em', verticalAlign: '0.95em', marginLeft: '0.04em'}}>2</span>;
const Script: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <div style={{fontFamily: BS, fontSize: size, lineHeight: 1.15, whiteSpace: 'nowrap', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.75))'}}>{children}</div>
);
// frame (relativo al título) en que se dice la palabra i del título
const w = (t: Tit, i: number) => f(t.w[i]);

const PlanoIcono: React.FC = () => {
  const k = interpolate(useCurrentFrame(), [0, 16], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <svg width="132" height="112" viewBox="0 0 132 112" style={{display: 'block', margin: '0 auto 12px'}} fill="none" stroke="white" strokeWidth="5" strokeLinejoin="round">
      <path d="M14 14 H118 V98 H14 Z M14 58 H62 M62 14 V42 M86 58 V98" strokeDasharray="420" strokeDashoffset={420 * (1 - k)} />
    </svg>
  );
};
const Lote: React.FC = () => {
  const k = interpolate(useCurrentFrame(), [0, 18], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <svg width="150" height="104" viewBox="0 0 150 104" style={{display: 'block', margin: '0 auto 14px'}}>
      <path d="M12 14 L138 6 L144 92 L6 98 Z" fill="none" stroke="white" strokeWidth="5" strokeLinejoin="round" strokeDasharray="480" strokeDashoffset={480 * (1 - k)} />
      {/* esquina marcada */}
      <circle cx="144" cy="92" r="9" fill={ROJO} stroke="white" strokeWidth="3" opacity={k} />
    </svg>
  );
};
const Pin: React.FC<{size?: number}> = ({size = 96}) => {
  const k = interpolate(useCurrentFrame(), [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <svg width={size} height={size * 1.29} viewBox="0 0 24 31" style={{display: 'block', margin: '0 auto 12px', transform: `translateY(${(1 - k) * -30}px)`, opacity: k}}>
      <path d="M12 1.2C6 1.2 1.2 6 1.2 11.8 1.2 19.8 12 29.8 12 29.8s10.8-10 10.8-18C22.8 6 18 1.2 12 1.2z" fill="none" stroke="white" strokeWidth="1.9"
        strokeDasharray="80" strokeDashoffset={80 * (1 - k)} />
      <circle cx="12" cy="11.8" r="3.8" fill={ROJO} opacity={k} />
    </svg>
  );
};

// hook, sobre la cabeza (fachada detrás)
const YH = 470;
const T500: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={YH} dur={dur}>
    <Barrido size={190}>500 m<M2 /></Barrido>
    <Tarde d={w(t, 2)}><div style={{fontWeight: BLACK, fontSize: 70, lineHeight: 1, marginTop: 10}}>EN ESQUINA</div></Tarde>
  </Bloque>
);
const TLV: React.FC<{t: Tit; dur: number}> = ({dur}) => (
  <Bloque y={YH} dur={dur}>
    <div style={{fontWeight: MED, fontSize: 50, lineHeight: 1}}>en</div>
    <Script size={124}>Las Victorias</Script>
  </Bloque>
);
const TPRECIO: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={YH} dur={dur}>
    <div style={{fontWeight: BLACK, fontSize: 62, lineHeight: 1.0, marginBottom: 6}}>POR</div>
    <Barrido d={w(t, 1)} size={fit('USD 185.000', 140, 0.7)}>USD 185.000</Barrido>
  </Bloque>
);
// cuerpo, centrados sobre el B-roll
const TUBIC: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={925} dur={dur}>
    <Pin />
    <div style={{fontWeight: BLACK, fontSize: 52, lineHeight: 1, marginBottom: 8}}>AVENIDA</div>
    <Barrido d={2} size={fit('LAS VICTORIAS', 128, 0.72)}>LAS VICTORIAS</Barrido>
    <Tarde d={w(t, 3)}><div style={{fontWeight: MED, fontSize: 56, lineHeight: 1, marginTop: 22}}>a <span style={{fontWeight: BLACK}}>10 MINUTOS</span> del centro de</div></Tarde>
    <Tarde d={w(t, 10)}><Script size={108}>Bariloche</Script></Tarde>
  </Bloque>
);
const TLOTE: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={950} dur={dur}>
    <Lote />
    <div style={{fontWeight: BLACK, fontSize: 64, lineHeight: 0.95}}>LOTE DE</div>
    <Barrido d={w(t, 2)} size={170}>500 m<M2 /></Barrido>
    <Tarde d={w(t, 6)}><div style={{fontWeight: ULTRA, fontSize: 84, lineHeight: 1, marginTop: 12, ...conBorde(AZUL, 9)}}>EN ESQUINA</div></Tarde>
  </Bloque>
);
const TDOS: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={950} dur={dur}>
    <div style={{fontWeight: ULTRA, fontSize: 200, lineHeight: 0.9, ...conBorde(AZUL, 11)}}>2</div>
    <div style={{fontWeight: ULTRA, fontSize: fit('CONSTRUCCIONES', 100, 0.74), lineHeight: 1.0, whiteSpace: 'nowrap', ...conBorde(AZUL, 9)}}>CONSTRUCCIONES</div>
    <Tarde d={w(t, 2)}><Script size={112}>independientes</Script></Tarde>
  </Bloque>
);
// arriba: Andrea entra abajo al centro del plano (142927)
const T218: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={680} dur={dur}>
    <PlanoIcono />
    <div style={{fontWeight: BLACK, fontSize: 60, lineHeight: 0.95}}>SUMAN</div>
    <Barrido d={2} size={170}>218 m<M2 /></Barrido>
    <Tarde d={w(t, 4)}><div style={{fontWeight: BLACK, fontSize: 64, lineHeight: 1, marginTop: 12}}>CUBIERTOS</div></Tarde>
  </Bloque>
);
// listas con tilde rojo: cada ítem entra con su palabra
const Item: React.FC<{d: number; main: React.ReactNode; sub?: string}> = ({d, main, sub}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 12, stiffness: 200}});
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 20, marginTop: 18, opacity: fr < 0 ? 0 : 1,
      transform: `scale(${fr < 0 ? 0.6 : interpolate(sp, [0, 1], [0.6, 1])})`, transformOrigin: '40px 50%'}}>
      <div style={{flex: 'none', width: 50, height: 50, borderRadius: 25, backgroundColor: ROJO, boxShadow: '0 0 0 4px white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 L10 17 L19 7" /></svg>
      </div>
      <div style={{textAlign: 'left'}}>
        <div style={{fontWeight: BLACK, fontSize: 58, lineHeight: 1, whiteSpace: 'nowrap'}}>{main}</div>
        {sub && <div style={{fontWeight: MED, fontSize: 40, lineHeight: 1.05, marginTop: 2}}>{sub}</div>}
      </div>
    </div>
  );
};
// listas arriba del cuadro: en esos planos Andrea camina de espaldas por el centro
const YL = 560;
const Lista: React.FC<{dur: number; titulo: string; items: [number, React.ReactNode, string?][]}> = ({dur, titulo, items}) => (
  <Bloque y={YL} dur={dur}>
    <div style={{fontWeight: ULTRA, fontSize: fit(titulo, 104), lineHeight: 1.0, whiteSpace: 'nowrap', marginBottom: 10, ...conBorde(AZUL, 10)}}>{titulo}</div>
    <div style={{display: 'inline-block'}}>
      {items.map(([d, main, sub], i) => <Item key={i} d={d} main={main} sub={sub} />)}
    </div>
  </Bloque>
);
const TC1: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Lista dur={dur} titulo="1ª CONSTRUCCIÓN" items={[[w(t, 6), 'LOCAL COMERCIAL', 'en planta baja'], [w(t, 13), 'VIVIENDA', 'en planta alta']]} />
);
const TVIV: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Lista dur={dur} titulo="VIVIENDA" items={[[w(t, 1), 'LIVING COMEDOR'], [w(t, 3), 'COCINA INTEGRADA'], [w(t, 5), '2 DORMITORIOS'], [w(t, 8), 'COCHERA']]} />
);
const TC2: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Lista dur={dur} titulo="2ª CONSTRUCCIÓN" items={[[w(t, 6), 'ESPACIO COMERCIAL', 'en planta baja'], [w(t, 13), 'DEPARTAMENTO', 'en planta alta'], [w(t, 18), 'ENTRADA VEHICULAR', 'independiente']]} />
);
const TRENTA: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={950} dur={dur}>
    <div style={{fontWeight: BLACK, fontSize: 64, lineHeight: 0.95, marginBottom: 6}}>HASTA</div>
    <Barrido d={w(t, 1)} size={fit('4 UNIDADES', 150, 0.72)}>4 UNIDADES</Barrido>
    <Tarde d={w(t, 3)}><div style={{fontWeight: ULTRA, fontSize: 92, lineHeight: 1, marginTop: 12, ...conBorde(AZUL, 9)}}>DE RENTA</div></Tarde>
  </Bloque>
);
// distancias: cifra roja + destino, cada fila con su palabra
const Fila: React.FC<{d: number; min: string; children: React.ReactNode}> = ({d, min, children}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 12, stiffness: 200}});
  const p = interpolate(fr, [4, 24], [-20, 130], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 26, opacity: fr < 0 ? 0 : 1,
      transform: `translateX(${fr < 0 ? -40 : interpolate(sp, [0, 1], [-40, 0])}px)`}}>
      <div style={{flex: 'none', minWidth: 270, textAlign: 'right', fontWeight: ULTRA, fontSize: 80, lineHeight: 0.86, whiteSpace: 'nowrap', ...rojoBrillo(p)}}>{min}</div>
      <div style={{textAlign: 'left', fontWeight: BLACK, fontSize: 44, lineHeight: 1.0}}>{children}</div>
    </div>
  );
};
const TDIST: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={945} dur={dur}>
    <Pin size={80} />
    <div style={{display: 'inline-block', textAlign: 'left'}}>
      <Fila d={w(t, 2)} min="5 MIN">TERMINAL<br /><span style={{fontWeight: MED}}>de ómnibus</span></Fila>
      <Fila d={w(t, 11)} min="5 MIN">CAMPUS<br /><span style={{fontWeight: MED}}>universitario e </span>INVAP</Fila>
      <Fila d={w(t, 17)} min="15 MIN">AEROPUERTO</Fila>
    </div>
  </Bloque>
);
// CTA debajo de la cara (toma 145157, cortada en "escribinos por WhatsApp")
const TCTA: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={1105} dur={dur}>
    <Barrido size={fit('ESCRIBINOS', 132, 0.76)}>ESCRIBINOS</Barrido>
    <Tarde d={w(t, 1)}><div style={{fontWeight: MED, fontSize: 56, marginTop: 8}}>por <span style={{fontWeight: BLACK}}>WHATSAPP</span></div></Tarde>
  </Bloque>
);

const COMP: Record<string, React.FC<{t: Tit; dur: number}>> = {T500, TLV, TPRECIO, TUBIC, TLOTE, TDOS, T218, TC1, TVIV, TC2, TRENTA, TDIST, TCTA};
const ARRIBA = ['T500', 'TLV', 'TPRECIO', 'T218', 'TC1', 'TVIV', 'TC2'];

// degradé oscuro arriba mientras hay un título sobre la cabeza (fachada luminosa detrás)
const SombraArriba: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let k = 0;
  for (const n of ARRIBA) k = Math.max(k, Math.min(1, (t - TT[n].a) / 0.2 + (n === 'T500' ? 1 : 0), (TT[n].b - t) / 0.15));
  if (k <= 0) return null;
  return <AbsoluteFill style={{opacity: k * 0.9, background: 'linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.4) 22%, rgba(0,0,0,0) 42%)'}} />;
};
// leve oscurecido al centro detrás de los títulos sobre B-roll
const SombraCentro: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let k = 0;
  for (const [n, v] of Object.entries(TT)) if (!ARRIBA.includes(n) && n !== 'TCTA') k = Math.max(k, Math.min(1, (t - v.a) / 0.2, (v.b - t) / 0.15));
  if (k <= 0) return null;
  return <AbsoluteFill style={{opacity: k, background: 'radial-gradient(ellipse 80% 38% at 50% 49%, rgba(0,0,0,0.42), rgba(0,0,0,0) 100%)'}} />;
};

const Guias: React.FC = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 980, border: '3px dashed #00ff66'}} />
    <div style={{position: 'absolute', left: 0, top: 1250, width: 1080, height: 2, backgroundColor: '#ff3355'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, backgroundColor: 'rgba(0,255,255,0.5)'}} />
  </AbsoluteFill>
);

export const AAL0611: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    {CLIPS.map((c, i) => (
      <Sequence key={i} from={c[1]} durationInFrames={c[2] - c[1]}>
        <Plano clip={c} />
      </Sequence>
    ))}
    <LightLeak />
    <SombraArriba />
    <SombraCentro />
    {SUBS.map(([a, b, txt, y], i) => (
      <Sequence key={'s' + i} from={f(a)} durationInFrames={Math.max(1, f(b) - f(a))}>
        <Subtitulo txt={txt} y={y} dur={f(b) - f(a)} />
      </Sequence>
    ))}
    {Object.entries(TT).map(([n, t]) => {
      const El = COMP[n];
      return (
        <Sequence key={n} from={f(t.a)} durationInFrames={f(t.b) - f(t.a)}>
          <El t={t} dur={f(t.b) - f(t.a)} />
        </Sequence>
      );
    })}
    {GUIAS && <Guias />}
    {!SIN_AUDIO && <Audio src={staticFile('aal0611/mix.wav')} />}
  </AbsoluteFill>
);
