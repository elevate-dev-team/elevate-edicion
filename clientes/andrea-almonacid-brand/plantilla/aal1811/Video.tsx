import React from 'react';
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, getInputProps, interpolate, spring,
  staticFile, useCurrentFrame,
} from 'remotion';
import data from './data.json';

// AAL 18-11 — 3 PH en el mismo complejo, Km 13 de Bustillo (Bariloche). Hook a cámara frente a la casa (con la fachada de
// B-roll en "kilómetro 13"), cuerpo en off sobre el recorrido de las 3 opciones, CTA a cámara. Zona segura de pauta: hasta y = 1250.
// Cortes del cuerpo en la grilla de Funkee Monkeee (120 BPM medidos → 15 frames). Motion: chips con ícono, plano, lote con
// contador, pin, casitas 1·2·3 y marcador de opción arriba.
export const FPS = 30;
export const AAL1811_FRAMES = data.total;
const f = (s: number) => Math.round(s * FPS);
const IP = getInputProps() as {guias?: boolean; mudo?: boolean};
const GUIAS = Boolean(IP.guias), SIN_AUDIO = Boolean(IP.mudo);

const ROJO = '#DB1B2E', ROJO_P = '#D21824', AZUL = '#335CA9';
const AC = 'acumin-pro', BS = 'Brittany Signature';
const MED = 500, BLACK = 800, ULTRA = 900;
const SOMBRA = 'drop-shadow(0 0 3px rgba(0,0,0,0.55)) drop-shadow(0 2px 5px rgba(0,0,0,0.55)) drop-shadow(0 8px 24px rgba(0,0,0,0.5))';
const SOMBRA_SUB = 'drop-shadow(0 0 3px rgba(0,0,0,0.7)) drop-shadow(0 2px 4px rgba(0,0,0,0.55)) drop-shadow(0 6px 20px rgba(0,0,0,0.45))';

const FONTS: [string, string, number][] = [
  [AC, 'AcuminPro-Medium.otf', MED], [AC, 'AcuminPro-Black.otf', BLACK], [AC, 'AcuminPro-UltraBlack.otf', ULTRA],
  [BS, 'BrittanySignature.ttf', 400],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([fam, file, weight]) =>
  new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight: String(weight)}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

// ---------- planos ----------
type Clip = [string, number, number, number, string, number, number];
const CLIPS = data.clips as unknown as Clip[];
const EYES = data.eyes as unknown as Record<string, [number, number][]>;
export const WHIPS = data.whips as number[];
const SIN = data.sin as number[];
export const ZBLUR = CLIPS.map((c) => c[1]).filter((c) => !WHIPS.includes(c) && !SIN.includes(c));
const pulso = (fr: number, c: number) => Math.max(0, 1 - Math.abs(fr - c + 0.5) / 3.5);

const Plano: React.FC<{clip: Clip}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [file, a, b, srcIn, tipo, s0, s1] = clip;
  const g = a + frame, dur = b - a;
  let tx = 0, hblur = 0, zb = 0;
  for (const c of [...WHIPS, 0]) {
    const e = c === 0 ? Math.max(0, 1 - (g + 0.5) / 4.5) : pulso(g, c);
    if (e > 0) { tx += (g < c ? -1 : 1) * 220 * e * e; hblur = Math.max(hblur, 46 * e); }
  }
  for (const c of ZBLUR) zb = Math.max(zb, pulso(g, c));
  const sw = 1 + (2 * Math.abs(tx) + 3 * hblur) / 1080 + 0.5 * Math.min(1, Math.abs(tx) / 220) * 0.2;
  const p = interpolate(frame, [0, Math.max(1, dur - 1)], [0, 1], {extrapolateRight: 'clamp'});
  const pe = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  const s = (s0 + (s1 - s0) * (tipo === 'b' ? pe : p)) * (1 + 0.22 * zb);
  let origin = '540px 960px';
  if (tipo !== 'b') {
    const ey = EYES[String(a)];
    const [ex, eyy] = ey[Math.min(ey.length - 1, frame)];
    origin = `${ex}px ${eyy}px`;
  }
  const fid = `wb${a}`;
  return (
    <AbsoluteFill style={{transform: `translateX(${tx}px) scale(${sw})`, transformOrigin: '540px 960px', filter: hblur > 0.5 ? `url(#${fid})` : undefined}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id={fid} x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${hblur} 0`} edgeMode="duplicate" /></filter>
      </svg>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: origin, filter: zb > 0.05 ? `blur(${14 * zb}px)` : undefined}}>
        <OffthreadVideo src={staticFile(`aal1811/${file}`)} startFrom={Math.round(srcIn * FPS)} muted />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const LightLeak: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      {WHIPS.map((c) => {
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

// ---------- animación ----------
const useIO = (dur: number, outF = 4) => {
  const fr = useCurrentFrame();
  const sp = spring({frame: fr, fps: FPS, config: {damping: 13, stiffness: 180}});
  const o = Math.min(outF, Math.max(1, dur - 4));
  const op = interpolate(fr, [0, 2, Math.max(3, dur - o), Math.max(4, dur)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return {fr, sp, op, sc: interpolate(sp, [0, 1], [0.84, 1])};
};

// ---------- subtítulos ----------
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
const SUBS = data.subs as unknown as Sub[];

// ---------- piezas de los títulos ----------
type Tit = {a: number; b: number; w: number[]};
const TT = data.titles as unknown as Record<string, Tit>;
const fit = (txt: string, base: number, k = 0.74) => Math.min(base, Math.floor(700 / (txt.length * k)));
const rojoBrillo = (p: number): React.CSSProperties => ({
  backgroundImage: `linear-gradient(100deg, ${ROJO_P} ${p - 30}%, #FFD6DC ${p}%, ${ROJO_P} ${p + 22}%)`,
  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
  paddingTop: '0.12em', marginTop: '-0.12em',
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
const w = (t: Tit, i: number) => f(t.w[i]);
const dibujo = (d = 0, n = 16) => interpolate(useCurrentFrame() - d, [0, n], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const PlanoIcono: React.FC = () => {
  const k = dibujo();
  return (
    <svg width="132" height="112" viewBox="0 0 132 112" style={{display: 'block', margin: '0 auto 12px'}} fill="none" stroke="white" strokeWidth="5" strokeLinejoin="round">
      <path d="M14 14 H118 V98 H14 Z M14 58 H62 M62 14 V42 M86 58 V98" strokeDasharray="420" strokeDashoffset={420 * (1 - k)} />
    </svg>
  );
};
const Lote: React.FC<{grande?: boolean}> = ({grande}) => {
  const k = dibujo(0, 18);
  const W0 = grande ? 220 : 150;
  return (
    <svg width={W0} height={W0 * 0.69} viewBox="0 0 150 104" style={{display: 'block', margin: '0 auto 14px'}}>
      <path d="M12 14 L138 6 L144 92 L6 98 Z" fill="rgba(219,27,46,0.18)" stroke="white" strokeWidth={grande ? 4 : 5} strokeLinejoin="round" strokeDasharray="480" strokeDashoffset={480 * (1 - k)} fillOpacity={k} />
      {/* casita dentro del lote */}
      <path d="M28 76 V58 L44 46 L60 58 V76 Z" fill="white" opacity={k} />
    </svg>
  );
};
const Pin: React.FC<{size?: number}> = ({size = 96}) => {
  const k = dibujo(0, 14);
  return (
    <svg width={size} height={size * 1.29} viewBox="0 0 24 31" style={{display: 'block', margin: '0 auto 10px', transform: `translateY(${(1 - k) * -30}px)`, opacity: k}}>
      <path d="M12 1.2C6 1.2 1.2 6 1.2 11.8 1.2 19.8 12 29.8 12 29.8s10.8-10 10.8-18C22.8 6 18 1.2 12 1.2z" fill="none" stroke="white" strokeWidth="1.9"
        strokeDasharray="80" strokeDashoffset={80 * (1 - k)} />
      <circle cx="12" cy="11.8" r="3.8" fill={ROJO} opacity={k} />
    </svg>
  );
};
const PinChico: React.FC = () => {
  const k = dibujo(0, 10);
  return (
    <svg width="34" height="44" viewBox="0 0 24 31" style={{transform: `translateY(${(1 - k) * -16}px)`, opacity: k}}>
      <path d="M12 1.2C6 1.2 1.2 6 1.2 11.8 1.2 19.8 12 29.8 12 29.8s10.8-10 10.8-18C22.8 6 18 1.2 12 1.2z" fill={ROJO} stroke="white" strokeWidth="2.2" />
      <circle cx="12" cy="11.8" r="3.6" fill="white" />
    </svg>
  );
};
// contador que sube hasta la cifra mientras la dice
const Contador: React.FC<{d: number; hasta: number; size: number}> = ({d, hasta, size}) => {
  const fr = useCurrentFrame() - d;
  const k = interpolate(fr, [0, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const e = 1 - Math.pow(1 - k, 3);
  const p = interpolate(fr, [12, 32], [-20, 130], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{fontWeight: ULTRA, fontSize: size, lineHeight: 0.86, whiteSpace: 'nowrap', opacity: fr < 0 ? 0 : 1, ...rojoBrillo(p)}}>
      {Math.round(hasta * e)} m<M2 />
    </div>
  );
};

// íconos de línea para los chips
const ICONOS: Record<string, React.ReactNode> = {
  cama: <><path d="M6 34 V16 M6 26 H42 V34 M42 26 V22 C42 19 40 18 37 18 H22 V26" /><rect x="10" y="18" width="9" height="6" rx="2" /></>,
  ducha: <><path d="M10 40 V12 C10 8 13 6 17 6 C21 6 24 8 24 12" /><path d="M18 14 H30 L27 19 H21 Z" /><path d="M21 24 L20 28 M24 24 V29 M27 24 L28 28 M22.5 32 L22 35 M25.5 32 L26 35" /></>,
  llama: <><path d="M24 42 C14 42 10 34 12 27 C14 21 19 19 19 12 C25 16 27 21 26 26 C29 24 30 21 30 19 C35 24 37 29 36 33 C35 39 30 42 24 42 Z" /><path d="M24 42 C20 42 18 39 19 36 C20 33 23 32 23 29 C26 31 28 34 27 37 C27 40 26 42 24 42 Z" /></>,
  credito: <><path d="M8 24 L24 10 L40 24 M12 21 V40 H36 V21" /><path d="M18 30 L22.5 34.5 L31 26" /></>,
};
const Chip: React.FC<{t: Tit; dur: number; icono: string; linea: React.ReactNode; bajada?: React.ReactNode; dBajada?: number}> = ({t, dur, icono, linea, bajada, dBajada}) => {
  const fr = useCurrentFrame();
  const sp = spring({frame: fr, fps: FPS, config: {damping: 11, stiffness: 190}});
  const k = interpolate(fr, [3, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Bloque y={930} dur={dur}>
      <div style={{width: 168, height: 168, borderRadius: 84, margin: '0 auto 18px', backgroundColor: ROJO, boxShadow: '0 0 0 6px white',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${interpolate(sp, [0, 1], [0.3, 1])}) rotate(${interpolate(sp, [0, 1], [-25, 0])}deg)`}}>
        <svg width="104" height="104" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="160" strokeDashoffset={160 * (1 - k)}>{ICONOS[icono]}</svg>
      </div>
      <div style={{fontWeight: BLACK, fontSize: 70, lineHeight: 0.95, whiteSpace: 'nowrap'}}>{linea}</div>
      {bajada && <Tarde d={dBajada ?? w(t, 1)}><div style={{fontWeight: MED, fontSize: 50, lineHeight: 1.05, marginTop: 6}}>{bajada}</div></Tarde>}
    </Bloque>
  );
};

// ---------- títulos ----------
const YH = 410; // hook, sobre la cabeza (fachada detrás)
const T3PH: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={YH} dur={dur}>
    <Barrido size={168}>3 PH</Barrido>
    <Tarde d={w(t, 3)}><div style={{fontWeight: BLACK, fontSize: 66, lineHeight: 1, marginTop: 8}}>EN VENTA</div></Tarde>
    <Tarde d={w(t, 5)}><div style={{fontWeight: MED, fontSize: 46, lineHeight: 1.05, marginTop: 4}}>en el <span style={{fontWeight: BLACK}}>MISMO COMPLEJO</span></div></Tarde>
  </Bloque>
);
const TKM: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={800} dur={dur}>
    <div style={{fontWeight: BLACK, fontSize: 60, lineHeight: 1, marginBottom: 6}}>KILÓMETRO</div>
    <Barrido size={210}>13</Barrido>
    <Tarde d={w(t, 2)}><Script size={120}>Bariloche</Script></Tarde>
  </Bloque>
);
const TPRECIO: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={YH + 30} dur={dur}>
    <div style={{fontWeight: BLACK, fontSize: 60, lineHeight: 1.0, marginBottom: 6}}>DESDE</div>
    <Barrido d={w(t, 1)} size={fit('USD 89.000', 140, 0.7)}>USD 89.000</Barrido>
  </Bloque>
);
// casitas 1·2·3: entran con "los tres" y una se marca en "elegís el tuyo"
const Casita: React.FC<{n: number; d: number; marcada: number}> = ({n, d, marcada}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 10, stiffness: 200}});
  const m = interpolate(useCurrentFrame() - marcada, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sel = n === 2;
  return (
    <div style={{opacity: fr < 0 ? 0 : 1, transform: `scale(${(fr < 0 ? 0.3 : interpolate(sp, [0, 1], [0.3, 1])) * (sel ? 1 + 0.18 * m : 1 - 0.1 * m)})`, margin: '0 14px'}}>
      <svg width="132" height="124" viewBox="0 0 66 62">
        <path d="M6 30 L33 6 L60 30 V58 H6 Z" fill={sel && m > 0 ? ROJO : 'rgba(255,255,255,0.08)'} stroke="white" strokeWidth="4" strokeLinejoin="round" />
        <text x="33" y="51" textAnchor="middle" fontFamily={AC} fontWeight={ULTRA} fontSize="26" fill="white">{n}</text>
      </svg>
    </div>
  );
};
const T123: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={YH} dur={dur}>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      {[1, 2, 3].map((n, i) => <Casita key={n} n={n} d={w(t, 2) + i * 4} marcada={w(t, 5)} />)}
    </div>
    <Tarde d={w(t, 5)}><div style={{fontWeight: MED, fontSize: 60, lineHeight: 1, marginTop: 12}}>elegís el <span style={{fontWeight: ULTRA, ...conBorde(ROJO, 7)}}>TUYO</span></div></Tarde>
  </Bloque>
);
// cuerpo
const TBUST: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  // arriba de la cabeza de Andrea (camina de espaldas por el centro; el pelo llega a y≈460)
  <Bloque y={352} dur={dur}>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 4}}>
      <PinChico /><div style={{fontWeight: BLACK, fontSize: 46, lineHeight: 1}}>AVENIDA</div>
    </div>
    <Barrido d={w(t, 2)} size={112}>BUSTILLO</Barrido>
  </Bloque>
);
const TPH: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={930} dur={dur}>
    <div style={{fontWeight: BLACK, fontSize: 58, lineHeight: 1, marginBottom: 6}}>LOS 3 SON</div>
    <Barrido d={w(t, 3)} size={180}>PH</Barrido>
    <Tarde d={w(t, 4)}><div style={{fontWeight: ULTRA, fontSize: 86, lineHeight: 1, marginTop: 10, ...conBorde(AZUL, 9)}}>DE 2 PLANTAS</div></Tarde>
  </Bloque>
);
const CDORM: React.FC<{t: Tit; dur: number}> = ({t, dur}) => <Chip t={t} dur={dur} icono="cama" linea={<>2 DORMITORIOS</>} />;
const CBANO: React.FC<{t: Tit; dur: number}> = ({t, dur}) => <Chip t={t} dur={dur} icono="ducha" linea={<>BAÑO COMPLETO</>} bajada={<>en planta baja</>} dBajada={w(t, 2)} />;
const CGAS: React.FC<{t: Tit; dur: number}> = ({t, dur}) => <Chip t={t} dur={dur} icono="llama" linea={<>GAS NATURAL</>} />;
const CCRED: React.FC<{t: Tit; dur: number}> = ({t, dur}) => <Chip t={t} dur={dur} icono="credito" linea={<>APTO CRÉDITO</>} bajada={<>hipotecario</>} dBajada={w(t, 3)} />;
const Opcion: React.FC<{t: Tit; dur: number; n: number; precio: string; y: number; k?: number}> = ({t, dur, n, precio, y, k = 1}) => (
  <Bloque y={y} dur={dur}>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 * k}}>
      <div style={{fontWeight: BLACK, fontSize: 76 * k, lineHeight: 1}}>OPCIÓN</div>
      <Tarde d={w(t, 1)}><div style={{fontWeight: ULTRA, fontSize: 150 * k, lineHeight: 0.85, ...conBorde(AZUL, 10 * k)}}>{n}</div></Tarde>
    </div>
    <div style={{marginTop: 10 * k}}><Barrido d={w(t, 2)} size={fit(precio, 136, 0.7) * k}>{precio}</Barrido></div>
  </Bloque>
);
const TOP1: React.FC<{t: Tit; dur: number}> = (p) => <Opcion {...p} n={1} precio="USD 89.000" y={470} />;
// Andrea entra y se acerca: el pelo sube hasta y≈480 → título compacto arriba
const TOP2: React.FC<{t: Tit; dur: number}> = (p) => <Opcion {...p} n={2} precio="USD 109.000" y={362} k={0.8} />;
const TOP3: React.FC<{t: Tit; dur: number}> = (p) => <Opcion {...p} n={3} precio="USD 109.000" y={900} />;
const Cubiertos: React.FC<{t: Tit; dur: number; m: string; dm: number}> = ({t, dur, m, dm}) => (
  <Bloque y={930} dur={dur}>
    <PlanoIcono />
    <Barrido d={dm} size={176}>{m} m<M2 /></Barrido>
    <Tarde d={w(t, t.w.length - 1)}><div style={{fontWeight: BLACK, fontSize: 66, lineHeight: 1, marginTop: 12}}>CUBIERTOS</div></Tarde>
  </Bloque>
);
const T40A: React.FC<{t: Tit; dur: number}> = (p) => <Cubiertos {...p} m="40" dm={w(p.t, 1)} />;
const T54: React.FC<{t: Tit; dur: number}> = (p) => <Cubiertos {...p} m="54" dm={w(p.t, 1)} />;
const T40B: React.FC<{t: Tit; dur: number}> = (p) => <Cubiertos {...p} m="40" dm={w(p.t, 1)} />;
const Patio: React.FC<{t: Tit; dur: number; m: number; dm: number; grande?: boolean}> = ({t, dur, m, dm, grande}) => (
  <Bloque y={930} dur={dur}>
    <Lote grande={grande} />
    <div style={{fontWeight: BLACK, fontSize: 62, lineHeight: 0.95}}>PATIO <span style={{color: 'white'}}>PRIVADO</span></div>
    <div style={{marginTop: 10}}><Contador d={dm} hasta={m} size={grande ? 196 : 176} /></div>
  </Bloque>
);
const TP10: React.FC<{t: Tit; dur: number}> = (p) => <Patio {...p} m={10} dm={w(p.t, 3)} />;
const TP186: React.FC<{t: Tit; dur: number}> = (p) => <Patio {...p} m={186} dm={w(p.t, 5)} />;
const TP322: React.FC<{t: Tit; dur: number}> = (p) => <Patio {...p} m={322} dm={w(p.t, 1)} grande />;
const Acceso: React.FC<{t: Tit; dur: number; pre: string; lugar: string; dl: number}> = ({t, dur, pre, lugar, dl}) => (
  <Bloque y={930} dur={dur}>
    <Pin size={80} />
    <div style={{fontWeight: ULTRA, fontSize: 92, lineHeight: 0.95, whiteSpace: 'nowrap', ...conBorde(AZUL, 9)}}>ACCESO DIRECTO</div>
    <Tarde d={dl}><div style={{fontWeight: MED, fontSize: 50, lineHeight: 1, marginTop: 14}}>{pre}</div><Script size={112}>{lugar}</Script></Tarde>
  </Bloque>
);
const TACC1: React.FC<{t: Tit; dur: number}> = (p) => <Acceso {...p} pre="desde" lugar="Bustillo" dl={w(p.t, 3)} />;
const TACC2: React.FC<{t: Tit; dur: number}> = (p) => <Acceso {...p} pre="por" lugar="Brazo Machete" dl={w(p.t, 3)} />;
// CTA debajo de la cara (toma 150447: el mentón llega a y≈970)
const TCTA: React.FC<{t: Tit; dur: number}> = ({t, dur}) => (
  <Bloque y={1070} dur={dur}>
    <Barrido size={fit('ESCRIBIME', 124, 0.76)}>ESCRIBIME</Barrido>
    <Tarde d={w(t, 1)}><div style={{fontWeight: MED, fontSize: 50, lineHeight: 1.05, marginTop: 8}}>con el <span style={{fontWeight: BLACK}}>N° DE OPCIÓN</span></div></Tarde>
    <Tarde d={w(t, 9)}><div style={{fontWeight: MED, fontSize: 46, lineHeight: 1.05, marginTop: 2}}>y <span style={{fontWeight: BLACK}}>COORDINAMOS LA VISITA</span></div></Tarde>
  </Bloque>
);
const COMP: Record<string, React.FC<{t: Tit; dur: number}>> = {
  T3PH, TKM, TPRECIO, T123, TBUST, TPH, CDORM, CBANO, CGAS, CCRED, TOP1, T40A, TP10, TOP2, T54, TP186, TACC1, TOP3, T40B, TP322, TACC2, TCTA,
};
const ARRIBA = ['T3PH', 'TPRECIO', 'T123'];

// marcador de opción arriba (1·2·3) durante el recorrido de cada opción
const OP = data.op as unknown as Record<string, [number, number]>;
const Marcador: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const ent = Object.entries(OP).find(([, [a, b]]) => t >= a - 0.1 && t < b);
  if (!ent) return null;
  const [n, [a, b]] = ent;
  const cur = Number(n.slice(-1));
  const k = Math.min(1, (t - a) / 0.25, (b - t) / 0.2);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14,
        opacity: Math.max(0, k), transform: `translateY(${(1 - Math.max(0, k)) * -20}px)`, filter: SOMBRA, fontFamily: AC}}>
        <div style={{fontWeight: BLACK, fontSize: 40, color: 'white', letterSpacing: '0.02em', marginRight: 6}}>OPCIÓN</div>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{width: 58, height: 58, borderRadius: 29, display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: i === cur ? ROJO : 'rgba(255,255,255,0.12)', boxShadow: `0 0 0 ${i === cur ? 4 : 3}px white`,
            fontWeight: ULTRA, fontSize: 34, color: 'white', transform: `scale(${i === cur ? 1.12 : 0.9})`}}>{i}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const SombraArriba: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let k = 0;
  for (const n of ARRIBA) k = Math.max(k, Math.min(1, (t - TT[n].a) / 0.2 + (n === 'T3PH' ? 1 : 0), (TT[n].b - t) / 0.15));
  if (k <= 0) return null;
  return <AbsoluteFill style={{opacity: k * 0.8, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 22%, rgba(0,0,0,0) 36%)'}} />;
};

const Guias: React.FC = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 980, border: '3px dashed #00ff66'}} />
    <div style={{position: 'absolute', left: 0, top: 1250, width: 1080, height: 2, backgroundColor: '#ff3355'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, backgroundColor: 'rgba(0,255,255,0.5)'}} />
  </AbsoluteFill>
);

export const AAL1811: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    {CLIPS.map((c, i) => (
      <Sequence key={i} from={c[1]} durationInFrames={c[2] - c[1]}>
        <Plano clip={c} />
      </Sequence>
    ))}
    <LightLeak />
    <SombraArriba />
    <Marcador />
    {SUBS.map(([a, b, txt, y], i) => (
      <Sequence key={'s' + i} from={f(a)} durationInFrames={Math.max(1, f(b) - f(a))}>
        <Subtitulo txt={txt} y={y} dur={f(b) - f(a)} />
      </Sequence>
    ))}
    {Object.entries(TT).map(([n, t]) => {
      const El = COMP[n];
      return (
        <Sequence key={n} from={f(t.a)} durationInFrames={Math.max(1, f(t.b) - f(t.a))}>
          <El t={t} dur={f(t.b) - f(t.a)} />
        </Sequence>
      );
    })}
    {GUIAS && <Guias />}
    {!SIN_AUDIO && <Audio src={staticFile('aal1811/mix.wav')} />}
  </AbsoluteFill>
);
