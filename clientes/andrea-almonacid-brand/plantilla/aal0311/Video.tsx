import React from 'react';
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, getInputProps, interpolate, spring,
  staticFile, useCurrentFrame,
} from 'remotion';
import data from './data.json';

// AAL 03-11 casa en Lomas del Cauquén (Bariloche) — hook a cámara, cuerpo en off sobre el recorrido, CTA a cámara.
// Zona segura de pauta: contenido hasta y = 1250.
export const FPS = 30;
export const AAL0311_FRAMES = data.total;
const f = (s: number) => Math.round(s * FPS);
const GUIAS = Boolean((getInputProps() as {guias?: boolean}).guias);

const ROJO = '#DB1B2E', ROJO_P = '#D21824', AZUL = '#335CA9';
const AC = 'acumin-pro', BS = 'Brittany Signature';
const MED = 500, BLACK = 800, ULTRA = 900;
const SOMBRA = 'drop-shadow(0 2px 4px rgba(0,0,0,0.55)) drop-shadow(0 6px 20px rgba(0,0,0,0.45))';
// subtítulos sobre fondos claros (ventanas, cielo): un contorno oscuro corto más
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
// [toma, desde, hasta (frames), entrada en la fuente (s), tipo h/c/b, escala inicial, escala final]
type Clip = [string, number, number, number, string, number, number];
const CLIPS = data.clips as unknown as Clip[];
const EYES = data.eyes as unknown as Record<string, [number, number][]>;
const SUBY = data.suby as Record<string, number>; // bajo el mentón medido en cada bloque a cámara

// ---------- transiciones ----------
const WHIPS = [f(6.98), f(24.52), f(29.13), f(33.28), f(45.28)];
const SIN = [0, f(2.32), f(5.83)]; // arranque (whip propio) y el punch-in / punch-out del hook
const ZBLUR = CLIPS.map((c) => c[1]).filter((c) => !WHIPS.includes(c) && !SIN.includes(c));
const LEAKS = [f(6.98), f(24.52), f(33.28), f(45.28)];
const pulso = (fr: number, c: number) => Math.max(0, 1 - Math.abs(fr - c + 0.5) / 3.5);

const Plano: React.FC<{clip: Clip}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [name, a, b, srcIn, tipo, s0, s1] = clip;
  const g = a + frame, dur = b - a;
  let tx = 0, hblur = 0, zb = 0;
  // whip: el plano que sale se va a la izquierda, el que entra llega desde la derecha
  for (const c of [...WHIPS, 0]) {
    const e = c === 0 ? Math.max(0, 1 - (g + 0.5) / 4.5) : pulso(g, c);
    if (e > 0) { tx += (g < c ? -1 : 1) * 200 * e * e; hblur = Math.max(hblur, 46 * e); }
  }
  for (const c of ZBLUR) zb = Math.max(zb, pulso(g, c));
  const sw = 1 + (2 * Math.abs(tx) + 3 * hblur) / 1080;
  const p = interpolate(frame, [0, Math.max(1, dur - 1)], [0, 1], {extrapolateRight: 'clamp'});
  // ease in-out para que el zoom lento se note sin arrancar de golpe
  const pe = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  const s = (s0 + (s1 - s0) * (tipo === 'b' ? pe : p)) * (1 + 0.22 * zb);
  let origin = '540px 960px';
  if (tipo !== 'b') {
    const ey = EYES[String(a)];
    const [ex, eyy] = ey[Math.min(ey.length - 1, frame)];
    origin = `${ex}px ${eyy}px`; // zoom anclado a los ojos: quedan en el mismo punto a cualquier escala
  }
  const fid = `wb${a}`;
  return (
    <AbsoluteFill style={{transform: `translateX(${tx}px) scale(${sw})`, transformOrigin: '540px 960px', filter: hblur > 0.5 ? `url(#${fid})` : undefined}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id={fid} x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${hblur} 0`} edgeMode="duplicate" /></filter>
      </svg>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: origin, filter: zb > 0.05 ? `blur(${14 * zb}px)` : undefined}}>
        <OffthreadVideo src={staticFile(`aal0311/v${name}.mp4`)} startFrom={Math.round(srcIn * FPS)} muted />
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
const YB = 960, YV = 1022; // centro sobre B-roll / debajo de la cara de Andrea en 131552
const SUBS: Sub[] = [
  // hook (bajo el mentón medido en cada plano)
  [0.00, 0.96, '¿Buscás una CASA/b'], [0.96, 1.34, 'que puedas'], [1.34, 1.78, 'TERMINAR/r'], [1.78, 2.32, 'a tu GUSTO?/b'],
  [2.34, 2.74, 'Mirá esta'], [2.74, 3.46, 'OPORTUNIDAD/b'],
  [5.85, 6.35, '¡Vamos,'], [6.35, 6.98, 'ACOMPAÑAME!/r'],
  // cuerpo en off
  [7.03, 8.11, 'Estamos hablando'], [8.11, 8.47, 'de una'],
  [10.75, 11.39, 'distribuida'],
  [12.34, 12.66, 'sobre un'],
  [15.68, 16.01, 'Tiene un'],
  [18.06, 18.70, 'y eso te da'], [18.70, 19.34, 'la POSIBILIDAD/b'], [19.34, 19.90, 'de COMPLETAR/b'], [19.90, 21.02, 'las TERMINACIONES/r'],
  [21.02, 21.50, 'y darle'],
  // Andrea en la ventana: la cara llega a y ≈ 960 con el zoom → los subtítulos bajan lo mínimo
  [22.44, 23.10, 'Se utilizaron', YV], [23.10, 23.72, 'materiales de', YV], [23.72, 24.52, 'PRIMERA/r CALIDAD/r', YV],
  [33.25, 34.21, 'Todo esto en'],
  [35.25, 35.92, 'en un entorno'], [35.92, 36.34, 'NATURAL/b'], [36.34, 37.11, 'y TRANQUILO/a'],
  [37.11, 37.93, 'con una hermosa'], [37.93, 38.94, 'VISTA/b a los CERROS/a'],
  [41.16, 42.04, 'Una OPORTUNIDAD/b'], [42.04, 42.80, 'para PROYECTAR/r'], [42.80, 43.60, 'tu CASA/b'],
  [43.60, 44.28, 'y adaptarla'], [44.28, 45.28, 'a tus NECESIDADES/b'],
  // CTA
  [45.36, 45.76, 'Si querés'], [45.76, 46.44, 'CONOCERLA/b'], [46.44, 46.94, 'y evaluar'],
  [46.94, 47.98, 'todo su POTENCIAL/r'],
];

// ---------- títulos ----------
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
const M2: React.FC = () => <span style={{fontSize: '0.46em', verticalAlign: '0.95em', marginLeft: '0.04em'}}>2</span>;
const Script: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <div style={{fontFamily: BS, fontSize: size, lineHeight: 1.15, whiteSpace: 'nowrap', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.75))'}}>{children}</div>
);

// T1 hook sobre la cabeza: el barrio
const T1: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={385} dur={dur}>
    <div style={{fontWeight: MED, fontSize: 50, lineHeight: 1}}>en</div>
    <Script size={112}>Lomas del Cauquén</Script>
  </Bloque>
);
// T2 hook sobre la cabeza: precio
const T2: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={378} dur={dur}>
    <div style={{fontWeight: BLACK, fontSize: 62, lineHeight: 1.0, marginBottom: 6}}>POR</div>
    <Barrido d={4} size={fit('USD 125.000', 140, 0.7)}>USD 125.000</Barrido>
  </Bloque>
);
// ícono de plano con flechas de medida
const PlanoIcono: React.FC = () => {
  const k = interpolate(useCurrentFrame(), [0, 16], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <svg width="132" height="112" viewBox="0 0 132 112" style={{display: 'block', margin: '0 auto 12px'}} fill="none" stroke="white" strokeWidth="5" strokeLinejoin="round">
      <path d="M14 14 H118 V98 H14 Z M14 58 H62 M62 14 V42 M86 58 V98" strokeDasharray="420" strokeDashoffset={420 * (1 - k)} />
    </svg>
  );
};
// T3 superficie de la casa
const T3: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={950} dur={dur}>
    <PlanoIcono />
    <div style={{fontWeight: BLACK, fontSize: 64, lineHeight: 0.95}}>UNA CASA DE</div>
    <Barrido d={f(8.89 - 8.47)} size={170}>71 m<M2 /></Barrido>
  </Bloque>
);
// T4 dos plantas
const T4: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={950} dur={dur}>
    <div style={{fontWeight: MED, fontSize: 56, lineHeight: 1}}>en</div>
    <div style={{fontWeight: ULTRA, fontSize: fit('2 PLANTAS', 128), lineHeight: 1.0, whiteSpace: 'nowrap', ...conBorde(AZUL, 10)}}>2 PLANTAS</div>
  </Bloque>
);
// contorno del lote que se dibuja
const Lote: React.FC = () => {
  const k = interpolate(useCurrentFrame(), [0, 18], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <svg width="150" height="104" viewBox="0 0 150 104" style={{display: 'block', margin: '0 auto 14px'}}>
      <path d="M12 14 L138 6 L144 92 L6 98 Z" fill="none" stroke="white" strokeWidth="5" strokeLinejoin="round" strokeDasharray="480" strokeDashoffset={480 * (1 - k)} />
      <rect x="52" y="38" width="36" height="30" fill="none" stroke="white" strokeWidth="4" opacity={k} />
      <path d="M48 40 L70 24 L92 40" fill="none" stroke="white" strokeWidth="4" opacity={k} />
    </svg>
  );
};
// T5 lote en PH
const T5: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={950} dur={dur}>
    <Lote />
    <div style={{fontWeight: BLACK, fontSize: 64, lineHeight: 0.95}}>LOTE EN <span style={{color: ROJO, WebkitTextStroke: '5px white', paintOrder: 'stroke fill'}}>PH</span></div>
    <Barrido d={f(13.54 - 12.66)} size={160}>628 m<M2 /></Barrido>
  </Bloque>
);
// T6 avance de obra: barra que se llena hasta 70 %
const T6: React.FC<{dur: number}> = ({dur}) => {
  const fr = useCurrentFrame();
  const k = interpolate(fr, [f(16.45 - 16.01), f(17.0 - 16.01)], [0, 70], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)});
  return (
    <Bloque y={950} dur={dur}>
      <div style={{fontWeight: BLACK, fontSize: 64, lineHeight: 0.95, marginBottom: 18}}>AVANCE DE OBRA</div>
      <div style={{fontWeight: ULTRA, fontSize: 150, lineHeight: 0.86, ...rojoBrillo(interpolate(fr, [f(1.0), f(1.7)], [-20, 130], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}))}}>{Math.round(k)}%</div>
      <div style={{width: 560, height: 34, margin: '22px auto 0', borderRadius: 17, border: '4px solid white', backgroundColor: 'rgba(0,0,0,0.25)', overflow: 'hidden'}}>
        <div style={{width: `${k / 0.7 * 0.7}%`, height: '100%', backgroundColor: ROJO}} />
      </div>
    </Bloque>
  );
};
// T7 tu propio estilo
const T7: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={950} dur={dur}>
    <Script size={124}>tu propio estilo</Script>
  </Bloque>
);
// listas de ambientes por planta: cada ítem entra con su palabra
const Item: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 12, stiffness: 200}});
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 14, opacity: fr < 0 ? 0 : 1,
      transform: `scale(${fr < 0 ? 0.6 : interpolate(sp, [0, 1], [0.6, 1])})`}}>
      <div style={{width: 46, height: 46, borderRadius: 23, backgroundColor: ROJO, boxShadow: '0 0 0 4px white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 L10 17 L19 7" /></svg>
      </div>
      <div style={{fontWeight: BLACK, fontSize: 60, lineHeight: 1, whiteSpace: 'nowrap'}}>{children}</div>
    </div>
  );
};
const Planta: React.FC<{dur: number; titulo: string; items: [number, React.ReactNode][]}> = ({dur, titulo, items}) => (
  <Bloque y={955} dur={dur}>
    <div style={{fontWeight: ULTRA, fontSize: fit(titulo, 112), lineHeight: 1.0, whiteSpace: 'nowrap', marginBottom: 8, ...conBorde(AZUL, 10)}}>{titulo}</div>
    {items.map(([d, txt], i) => <Item key={i} d={d}>{txt}</Item>)}
  </Bloque>
);
const T8: React.FC<{dur: number}> = ({dur}) => (
  <Planta dur={dur} titulo="PLANTA BAJA" items={[[f(26.44 - 24.62), 'COCINA'], [f(27.20 - 24.62), 'LIVING COMEDOR'], [f(28.68 - 24.62), 'TOILETTE']]} />
);
const T9: React.FC<{dur: number}> = ({dur}) => (
  <Planta dur={dur} titulo="PLANTA ALTA" items={[[f(30.33 - 29.18), 'BAÑO COMPLETO'], [f(31.95 - 29.18), <>1 <span style={{fontWeight: MED}}>o</span> 2 DORMITORIOS</>]]} />
);
// T10 el barrio
const T10: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={950} dur={dur}>
    <Script size={124}>Lomas del Cauquén</Script>
  </Bloque>
);
const Pin: React.FC = () => {
  const k = interpolate(useCurrentFrame(), [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <svg width="96" height="124" viewBox="0 0 24 31" style={{display: 'block', margin: '0 auto 12px', transform: `translateY(${(1 - k) * -30}px)`, opacity: k}}>
      <path d="M12 1.2C6 1.2 1.2 6 1.2 11.8 1.2 19.8 12 29.8 12 29.8s10.8-10 10.8-18C22.8 6 18 1.2 12 1.2z" fill="none" stroke="white" strokeWidth="1.9"
        strokeDasharray="80" strokeDashoffset={80 * (1 - k)} />
      <circle cx="12" cy="11.8" r="3.8" fill={ROJO} opacity={k} />
    </svg>
  );
};
// T11 a una cuadra de Av. de la Virreina
const T11: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={930} dur={dur}>
    <Pin />
    <Barrido d={4} size={fit('A 1 CUADRA', 136, 0.72)}>A 1 CUADRA</Barrido>
    <Tarde d={f(39.80 - 38.94)}><Script size={92}>de Av. de la Virreina</Script></Tarde>
  </Bloque>
);
// T12 CTA debajo de la cara (arriba no hay lugar: el pelo llega a la zona segura)
const T12: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={1112} dur={dur}>
    <Barrido size={fit('ESCRIBINOS', 132, 0.76)}>ESCRIBINOS</Barrido>
    <Tarde d={f(48.46 - 47.98)}><div style={{fontWeight: MED, fontSize: 56, marginTop: 8}}>por <span style={{fontWeight: BLACK}}>WHATSAPP</span></div></Tarde>
    <Tarde d={f(49.14 - 47.98)}><div style={{fontWeight: BLACK, fontSize: 46, marginTop: 4}}><span style={{fontWeight: MED}}>y</span> COORDINAMOS UNA VISITA</div></Tarde>
  </Bloque>
);

export const TITULOS: [number, number, (d: number) => React.ReactNode][] = [
  [3.46, 4.45, (d) => <T1 dur={d} />],
  [4.45, 5.83, (d) => <T2 dur={d} />],
  [8.47, 10.67, (d) => <T3 dur={d} />],
  [11.39, 12.52, (d) => <T4 dur={d} />],
  [12.66, 15.62, (d) => <T5 dur={d} />],
  [16.01, 18.05, (d) => <T6 dur={d} />],
  [21.50, 22.21, (d) => <T7 dur={d} />],
  [24.62, 29.13, (d) => <T8 dur={d} />],
  [29.18, 33.25, (d) => <T9 dur={d} />],
  [34.21, 35.25, (d) => <T10 dur={d} />],
  [38.94, 41.13, (d) => <T11 dur={d} />],
  [47.98, 50.233, (d) => <T12 dur={d} />],
];

// degradé oscuro arriba mientras hay un título sobre la cabeza (fachada clara detrás)
const ARRIBA: [number, number][] = [[3.46, 5.83]];
const SombraArriba: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let k = 0;
  for (const [a, b] of ARRIBA) k = Math.max(k, Math.min(1, (t - a) / 0.2, (b - t) / 0.15));
  if (k <= 0) return null;
  return <AbsoluteFill style={{opacity: k * 0.85, background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 22%, rgba(0,0,0,0) 38%)'}} />;
};
// leve oscurecido al centro detrás de los títulos sobre B-roll claro
const CENTRO: [number, number][] = [[8.47, 10.67], [11.39, 18.05], [21.50, 22.21], [24.62, 35.25], [38.94, 41.13]];
const SombraCentro: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let k = 0;
  for (const [a, b] of CENTRO) k = Math.max(k, Math.min(1, (t - a) / 0.2, (b - t) / 0.15));
  if (k <= 0) return null;
  return <AbsoluteFill style={{opacity: k, background: 'radial-gradient(ellipse 70% 32% at 50% 49%, rgba(0,0,0,0.38), rgba(0,0,0,0) 100%)'}} />;
};

const Guias: React.FC = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 980, border: '3px dashed #00ff66'}} />
    <div style={{position: 'absolute', left: 0, top: 1250, width: 1080, height: 2, backgroundColor: '#ff3355'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, backgroundColor: 'rgba(0,255,255,0.5)'}} />
  </AbsoluteFill>
);

export const AAL0311: React.FC = () => (
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
      <Sequence key={'s' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        <Subtitulo txt={txt} y={y ?? SUBY[a.toFixed(2)] ?? YB} dur={f(b) - f(a)} />
      </Sequence>
    ))}
    {TITULOS.map(([a, b, el], i) => (
      <Sequence key={'t' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        {el(f(b) - f(a))}
      </Sequence>
    ))}
    {GUIAS && <Guias />}
    <Audio src={staticFile('aal0311/mix.wav')} />
  </AbsoluteFill>
);
