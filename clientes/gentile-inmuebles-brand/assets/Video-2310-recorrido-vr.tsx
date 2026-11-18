// Plantilla GIN 23-10 (aprobada 2026-11-05): reel a cámara + recorrido VR. Hook con medida animada (9 METROS), anillo y empuje a los anteojos,
// ventana "RECORRIDO VR" con ruta de ambientes que se encienden con la palabra, expansión a pantalla completa con contador (195 M²),
// contadores en títulos, subtítulos con *ROJO* y [caja]. Datos (data.json) generados por un script como acabado.py del proyecto: tomas con
// tracking de cara (track_cara.swift), zooms anclados a los ojos, palabras de alinear.py y bloques de subtítulos. Audio aparte (mezcla.py).
import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, Easing,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import data from './data.json';

// GIN 23-10 "Este departamento todavía no existe" — acabado (el audio se mezcla aparte y se pega con ffmpeg)
export const FPS = 25;
const f = (s: number) => Math.round(s * FPS);
export const GIN2310_FRAMES = data.frames;
const DUR = data.frames / FPS;

const ROJO = '#E10E1C', NEGRO = '#0F0F0F';
const MS = 'Montserrat';
const FONTS: [string, string, string?][] = [
  ['Montserrat-Regular.ttf', '400'], ['Montserrat-Medium.ttf', '500'], ['Montserrat-SemiBold.ttf', '600'],
  ['Montserrat-Bold.ttf', '700'], ['Montserrat-Black.ttf', '900'], ['Montserrat-BlackItalic.ttf', '900', 'italic'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([file, weight, style]) =>
  new FontFace(MS, `url(${staticFile('fonts/' + file)})`, {weight, style: style ?? 'normal'}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

type Spk = {i: number; src: string; v0: number; v1: number; cam0: number; z: number[][]; ex: number[]; ey: number[]; hair: number; chin: number; cx: number};
const SPK = data.spk as Spk[];
const S = (i: number) => SPK.find((s) => s.i === i)!;
const WORDS = data.words as [string, number, number][];
const wAt = (w: string, desde = 0) => WORDS.find((x) => x[0].replace(/[,.?¿]/g, '').toLowerCase() === w.toLowerCase() && x[1] >= desde - 0.05)![1];

const escala = (z: number[][], t: number) => {
  if (t <= z[0][0]) return z[0][1];
  for (let k = 0; k < z.length - 1; k++) {
    const [a, sa] = z[k], [b, sb] = z[k + 1];
    if (t >= a && t <= b) {
      if (b - a < 1e-6) return sb;
      const u = (t - a) / (b - a);
      return b - a <= 0.15 ? sa + (sb - sa) * Easing.out(Easing.cubic)(u) : sa + (sb - sa) * (0.5 - 0.5 * Math.cos(Math.PI * u));
    }
  }
  return z[z.length - 1][1];
};
const ojo = (sp: Spk, t: number) => {
  const k = Math.max(0, Math.min(sp.ex.length - 1, Math.round((t - sp.v0) * FPS)));
  return [sp.ex[k], sp.ey[k]] as [number, number];
};

// ---------- tramos ----------
const HOOK_VR: [number, number] = [1.3, 2.8];          // living (medida de 9 m)
const REC: [number, number] = [13.2, 24.88];           // recorrido VR (ventana + ruta) y 195 m²
const EXPANDE = 20.28;                                  // la ventana pasa a pantalla completa
const GAFAS: [number, number] = [12.6, 13.2];           // empuje hacia los anteojos
const GAFAS_SRC: [number, number] = [722, 1368];        // anteojos en la toma 1862 (px de fuente, medido en el cuadro de 8,3 s)
// clips del recorrido dentro de la ventana: [archivo, desde (video), hasta, entrada en el clip]
const CLIPS: [string, number, number, number][] = [
  ['vr_med', 13.2, 15.15, 0], ['vr_coc', 15.15, 16.25, 0], ['vr_dor', 16.25, 17.85, 0.4], ['vr_bal', 17.85, 20.28, 0.3], ['vr_gran', 20.28, 24.88, 0],
];

// ---------- transiciones ----------
const e0 = (i: number) => ojo(S(i), S(i).v0);
const CORTES: [number, 'zoom' | 'whip', number, number][] = [
  [1.3, 'whip', 540, 960], [2.8, 'zoom', ...e0(1)], [5.36, 'whip', 540, 960], [7.25, 'zoom', ...ojo(S(2), 7.25)],
  [13.2, 'zoom', 540, 960], [24.88, 'zoom', ...e0(5)], [30.24, 'zoom', ...e0(6)], [32.96, 'whip', 540, 960],
];
const RADIO = 3.5;
const transOf = (t: number, cortes: (typeof CORTES)) => {
  let e = 0, c = cortes[0];
  for (const k of cortes) {
    const v = 1 - Math.abs(t - k[0]) * FPS / RADIO;
    if (v > e) { e = v; c = k; }
  }
  return {e: Math.max(0, e), side: t < c[0] ? -1 : 1, c};
};
const transStyle = (t: number, cortes = CORTES): React.CSSProperties => {
  const {e, side, c} = transOf(t, cortes);
  if (e <= 0) return {};
  if (c[1] === 'whip') return {transform: `translateX(${-side * 160 * e}px) scale(${1 + 0.34 * e})`, filter: `url(#whip${Math.round(e * 10)})`};
  return {transform: `scale(${1 + 0.24 * e})`, transformOrigin: `${c[2]}px ${c[3]}px`, filter: `blur(${12 * e}px)`};
};
const WhipFilters: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    {Array.from({length: 11}, (_, i) => (
      <filter key={i} id={`whip${i}`} x="-10%" y="0" width="120%" height="100%">
        <feGaussianBlur stdDeviation={`${i * 4} 0`} edgeMode="duplicate" />
      </filter>
    ))}
  </svg>
);

const Speaker: React.FC<{sp: Spk}> = ({sp}) => {
  const frame = useCurrentFrame();
  const t = sp.v0 + frame / FPS;
  const s = escala(sp.z, t);
  const [ex, ey] = ojo(sp, t);
  const ox = Math.min(Math.max(ex * (1 - 1 / s), 0), 1080 - 1080 / s);
  const oy = Math.min(Math.max(ey * (1 - 1 / s), 0), 1920 - 1920 / s);
  // empuje a los anteojos al final de la toma 1862 (entrada al recorrido)
  let push: React.CSSProperties = {};
  if (sp.i === 2 && t > GAFAS[0]) {
    const u = interpolate(t, GAFAS, [0, 1], {extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
    const gx = (GAFAS_SRC[0] - ox) * s, gy = (GAFAS_SRC[1] - oy) * s;
    push = {transform: `scale(${1 + 1.6 * u})`, transformOrigin: `${gx}px ${gy}px`};
  }
  return (
    <AbsoluteFill style={transStyle(t)}>
      <AbsoluteFill style={push}>
        <AbsoluteFill style={{transform: `scale(${s}) translate(${-ox}px, ${-oy}px)`, transformOrigin: '0 0'}}>
          <OffthreadVideo src={staticFile(`gin2310/${sp.src}.mp4`)} startFrom={f(sp.cam0)} muted />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- tipografía ----------
const SOMBRA = '0 0 3px rgba(0,0,0,0.75), 0 2px 6px rgba(0,0,0,0.7), 0 3px 20px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.4)';
const med = (size: number, weight = 500): React.CSSProperties => ({fontFamily: MS, fontWeight: weight, fontSize: size, color: 'white',
  textShadow: SOMBRA, lineHeight: 1, letterSpacing: -size * 0.02});
const hook = (size: number, c = 'white'): React.CSSProperties => ({fontFamily: MS, fontWeight: 900, fontStyle: 'italic', fontSize: size, color: c,
  lineHeight: 0.9, letterSpacing: -size * 0.03, textShadow: '0 4px 14px rgba(0,0,0,0.55), 0 0 30px rgba(0,0,0,0.35)'});
const rojo = (size: number, stroke = 14): React.CSSProperties => ({fontFamily: MS, fontWeight: 900, fontSize: size, color: ROJO, lineHeight: 0.9,
  letterSpacing: -size * 0.03, WebkitTextStroke: `${stroke}px white`, paintOrder: 'stroke fill', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.45))'});
const Caja: React.FC<{children: React.ReactNode; size: number; italic?: boolean; a?: number}> = ({children, size, italic, a = 0.88}) => (
  <span style={{display: 'inline-block', background: `rgba(225,14,28,${a})`, padding: `${size * 0.1}px ${size * 0.2}px ${size * 0.06}px`, borderRadius: size * 0.08,
    fontFamily: MS, fontWeight: 900, fontStyle: italic ? 'italic' : 'normal', fontSize: size, color: 'white', lineHeight: 1, letterSpacing: -size * 0.02,
    boxShadow: '0 6px 18px rgba(0,0,0,0.35)'}}>{children}</span>
);
const B: React.FC<{children: React.ReactNode; c?: string}> = ({children, c}) => <b style={{fontWeight: 800, color: c}}>{children}</b>;

const useIn = (at: number, out: number, kind: 'pop' | 'up' | 'zoom') => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  const p = spring({frame: frame - f(at), fps, config: {damping: kind === 'up' ? 16 : 11, stiffness: kind === 'zoom' ? 240 : 180, mass: 0.7}});
  const o = interpolate(t, [out - 0.16, out], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const vis = t >= at - 0.001 && t < out;
  const blur = Math.max(0, interpolate(p, [0, 1], [kind === 'zoom' ? 16 : 10, 0], {extrapolateRight: 'clamp'})) +
    interpolate(t, [out - 0.16, out], [0, 8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const transform = kind === 'pop' ? `scale(${interpolate(p, [0, 1], [0.5, 1])})`
    : kind === 'zoom' ? `scale(${interpolate(p, [0, 1], [1.8, 1])})`
    : `translateY(${interpolate(p, [0, 1], [30, 0])}px)`;
  return {opacity: vis ? Math.min(1, p * 1.6) * o : 0, transform, filter: blur > 0.05 ? `blur(${blur}px)` : undefined} as React.CSSProperties;
};
const Line: React.FC<{at: number; out: number; kind?: 'pop' | 'up' | 'zoom'; children: React.ReactNode}> = ({at, out, kind = 'up', children}) => {
  const st = useIn(at, out, kind);
  return <div style={{...st, textAlign: 'center', whiteSpace: 'nowrap'}}>{children}</div>;
};
const Bloque: React.FC<{top?: number; center?: number; bottom?: number; x?: number; gap?: number; children: React.ReactNode}> = ({top, center, bottom, x = 540, gap = 6, children}) => (
  <div style={{position: 'absolute', left: x - 540, width: 1080, top: bottom === undefined ? center ?? top : undefined,
    bottom: bottom !== undefined ? 1920 - bottom : undefined, transform: center !== undefined ? 'translateY(-50%)' : undefined,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>{children}</div>
);
// velo negro→rojo desde arriba (pared blanca de la oficina / renders claros)
const Velo: React.FC<{at: number; out: number; y: number}> = ({at, out, y}) => {
  const t = useCurrentFrame() / FPS;
  const o = interpolate(t, [at - 0.12, at + 0.1, out - 0.15, out], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  return <AbsoluteFill style={{opacity: o, background: `linear-gradient(180deg, rgba(15,15,15,0.82) 0px, rgba(60,8,12,0.62) ${y - 160}px, rgba(120,10,18,0.28) ${y + 10}px, rgba(0,0,0,0) ${y + 140}px)`}} />;
};
const Contador: React.FC<{a: number; b: number; hasta: number}> = ({a, b, hasta}) => {
  const t = useCurrentFrame() / FPS;
  return <>{Math.round(interpolate(t, [a, b], [0, hasta], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}))}</>;
};

// ---------- MOTION 1: medida del living (hook) ----------
const Medida: React.FC = () => {
  const frame = useCurrentFrame();
  const t = HOOK_VR[0] + frame / FPS;
  const casi = wAt('casi'), nueve = wAt('nueve');
  const u = interpolate(t, [casi - 0.05, nueve + 0.1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const out = interpolate(t, [HOOK_VR[1] - 0.15, HOOK_VR[1]], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const Y = 1110, X0 = 190, X1 = 890, half = (X1 - X0) / 2 * u, cx = (X0 + X1) / 2;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <svg width={1080} height={1920} style={{position: 'absolute', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))'}}>
        <line x1={cx - half} y1={Y} x2={cx + half} y2={Y} stroke="white" strokeWidth={7} strokeLinecap="round" />
        {u > 0.02 && <>
          <path d={`M ${cx - half + 26} ${Y - 18} L ${cx - half} ${Y} L ${cx - half + 26} ${Y + 18}`} fill="none" stroke="white" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M ${cx + half - 26} ${Y - 18} L ${cx + half} ${Y} L ${cx + half - 26} ${Y + 18}`} fill="none" stroke="white" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          <line x1={cx - half} y1={Y - 40} x2={cx - half} y2={Y + 40} stroke={ROJO} strokeWidth={8} strokeLinecap="round" />
          <line x1={cx + half} y1={Y - 40} x2={cx + half} y2={Y + 40} stroke={ROJO} strokeWidth={8} strokeLinecap="round" />
        </>}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- MOTION 2: recorrido VR (ventana + ruta de ambientes) y 195 m² ----------
const WIN = {x: 160, y: 300, w: 760, h: 880};
const PARADAS: [string, string, number][] = [['LIVING', 'living', 13], ['COCINA', 'cocina', 14.5], ['3 DORM.', 'tres', 16], ['BALCÓN', 'balcón', 17.5]];
const NX = [255, 445, 635, 825], NY = 1236;
const ClipVR: React.FC<{clip: (typeof CLIPS)[number]; dentro: boolean}> = ({clip, dentro}) => {
  const frame = useCurrentFrame();
  const [name, a, b, c0] = clip;
  const t = a + frame / FPS;
  const z = interpolate(t, [a, b], [1.0, 1.06]);
  // whip dentro de la ventana entre ambientes (no en la entrada ni en la expansión)
  const cortes = CLIPS.slice(1, 4).map((c) => [c[1], 'whip', 540, 960] as (typeof CORTES)[number]);
  return (
    <AbsoluteFill style={dentro ? transStyle(t, cortes) : {}}>
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <OffthreadVideo src={staticFile(`gin2310/${name}.mp4`)} startFrom={f(c0)} muted />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Recorrido: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = REC[0] + frame / FPS;
  const ent = spring({frame, fps, config: {damping: 15, stiffness: 150, mass: 0.8}});
  const ex = interpolate(t, [EXPANDE, EXPANDE + 0.42], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const sc = interpolate(ent, [0, 1], [0.86, 1]) * (1 - ex) + ex;
  const r = {x: WIN.x * (1 - ex), y: WIN.y * (1 - ex), w: WIN.w + (1080 - WIN.w) * ex, h: WIN.h + (1920 - WIN.h) * ex};
  const ui = interpolate(t, [EXPANDE - 0.05, EXPANDE + 0.2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * Math.min(1, ent * 1.4);
  const act = PARADAS.map((p) => wAt(p[1], p[2]));
  const lleno = act.reduce((k, a, i) => (t >= a - 0.04 ? i : k), -1);
  // escala del video para cubrir la ventana
  const vs = Math.max(r.w / 1080, r.h / 1920);
  const clip = CLIPS.find((c) => t >= c[1] && t < c[2]) ?? CLIPS[CLIPS.length - 1];
  return (
    <AbsoluteFill style={{background: NEGRO}}>
      {/* fondo: el mismo clip desenfocado y oscuro, con degradé rojo abajo */}
      {CLIPS.slice(0, 4).map((c) => (
        <Sequence key={c[0]} from={f(c[1] - REC[0])} durationInFrames={f(c[2]) - f(c[1])}>
          <AbsoluteFill style={{filter: 'blur(28px) brightness(0.45) saturate(0.8)', transform: 'scale(1.15)'}}><ClipVR clip={c} dentro={false} /></AbsoluteFill>
        </Sequence>
      ))}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(15,15,15,0.55) 0%, rgba(15,15,15,0.15) 45%, rgba(110,6,14,0.55) 85%, rgba(150,8,18,0.7) 100%)', opacity: 1 - ex}} />
      {/* ventana */}
      <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, overflow: 'hidden', borderRadius: 36 * (1 - ex),
        transform: `scale(${sc})`, transformOrigin: `${WIN.x + WIN.w / 2}px ${WIN.y + WIN.h / 2}px`,
        boxShadow: `0 24px 60px rgba(0,0,0,${0.55 * (1 - ex)})`, border: `${4 * (1 - ex)}px solid rgba(255,255,255,0.9)`, boxSizing: 'border-box'}}>
        {CLIPS.map((c) => (
          <Sequence key={c[0]} from={f(c[1] - REC[0])} durationInFrames={f(c[2]) - f(c[1])}>
            <div style={{position: 'absolute', left: (r.w - 1080 * vs) / 2, top: (r.h - 1920 * vs) / 2, width: 1080, height: 1920,
              transform: `scale(${vs})`, transformOrigin: '0 0'}}>
              <ClipVR clip={c} dentro />
            </div>
          </Sequence>
        ))}
        {/* viñeta suave: los renders son muy claros */}
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)'}} />
        {/* etiqueta de visor */}
        <div style={{position: 'absolute', left: 26, top: 26, opacity: ui, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(15,15,15,0.72)',
          padding: '10px 18px 10px 14px', borderRadius: 40}}>
          <div style={{width: 16, height: 16, borderRadius: 16, background: ROJO, opacity: 0.55 + 0.45 * Math.abs(Math.sin(t * 4))}} />
          <span style={{fontFamily: MS, fontWeight: 700, fontSize: 28, color: 'white', letterSpacing: 1.5}}>RECORRIDO VR</span>
        </div>
      </div>
      {/* ruta de ambientes */}
      <div style={{position: 'absolute', inset: 0, opacity: ui}}>
        <svg width={1080} height={1920} style={{position: 'absolute'}}>
          <line x1={NX[0]} y1={NY} x2={NX[3]} y2={NY} stroke="rgba(255,255,255,0.35)" strokeWidth={6} strokeLinecap="round" />
          {lleno > 0 && (() => {
            const i = lleno; const p = interpolate(t, [act[i] - 0.04, act[i] + 0.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
            const x = NX[i - 1] + (NX[i] - NX[i - 1]) * p;
            return <line x1={NX[0]} y1={NY} x2={x} y2={NY} stroke={ROJO} strokeWidth={8} strokeLinecap="round" />;
          })()}
        </svg>
        {PARADAS.map(([lab], i) => {
          const on = t >= act[i] - 0.04;
          const q = on ? spring({frame: frame - f(act[i] - 0.04 - REC[0]), fps, config: {damping: 10, stiffness: 220, mass: 0.6}}) : 0;
          const D = 40 + 10 * q;
          return (
            <React.Fragment key={lab}>
              <div style={{position: 'absolute', left: NX[i] - D / 2, top: NY - D / 2, width: D, height: D, borderRadius: D, boxSizing: 'border-box',
                background: on ? ROJO : 'rgba(15,15,15,0.8)', border: `5px solid ${on ? 'white' : 'rgba(255,255,255,0.55)'}`,
                boxShadow: on ? '0 0 22px rgba(225,14,28,0.7)' : 'none'}} />
              <div style={{position: 'absolute', left: NX[i] - 100, width: 200, top: NY + 38, textAlign: 'center', fontFamily: MS, fontWeight: on ? 800 : 600,
                fontSize: 30, letterSpacing: 0.3, color: on ? 'white' : 'rgba(255,255,255,0.6)', textShadow: '0 2px 6px rgba(0,0,0,0.6)'}}>{lab}</div>
            </React.Fragment>
          );
        })}
      </div>
      {/* 195 m²: oscurecido para el texto sobre el render claro */}
      <AbsoluteFill style={{opacity: ex, background: 'radial-gradient(ellipse 85% 42% at 50% 50%, rgba(15,15,15,0.62), rgba(15,15,15,0.28) 100%)'}} />
    </AbsoluteFill>
  );
};

// destello blanco al entrar al recorrido
const Flash: React.FC<{at: number}> = ({at}) => {
  const t = useCurrentFrame() / FPS;
  const o = interpolate(t, [at - 0.12, at, at + 0.28], [0, 0.95, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return o > 0 ? <AbsoluteFill style={{background: 'white', opacity: o}} /> : null;
};

// anillo que marca los anteojos en "estos anteojos"
const Anillo: React.FC<{at: number; out: number}> = ({at, out}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  if (t < at || t >= out) return null;
  const sp = S(2);
  const s = escala(sp.z, t); const [ex, ey] = ojo(sp, t);
  const ox = Math.min(Math.max(ex * (1 - 1 / s), 0), 1080 - 1080 / s), oy = Math.min(Math.max(ey * (1 - 1 / s), 0), 1920 - 1920 / s);
  const gx = (GAFAS_SRC[0] - ox) * s, gy = (GAFAS_SRC[1] - oy) * s;
  const p = spring({frame: frame - f(at), fps, config: {damping: 10, stiffness: 200, mass: 0.6}});
  const o = interpolate(t, [out - 0.15, out], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const R = 120 * interpolate(p, [0, 1], [0.6, 1]);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: Math.min(1, p * 1.5) * o, filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.45))'}}>
      <circle cx={gx} cy={gy} r={R} fill="none" stroke={ROJO} strokeWidth={9} />
      <circle cx={gx} cy={gy} r={R + 10} fill="none" stroke="white" strokeWidth={3} strokeDasharray="14 10" transform={`rotate(${t * 60} ${gx} ${gy})`} />
    </svg>
  );
};

// ---------- títulos ----------
const AIRE = 25;
const Titulos: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const living = wAt('living'), casi = wAt('casi'), nueve = wAt('nueve'), largo = wAt('largo');
  const y = wAt('y', 2.8), todavia = wAt('todavía'), terminado = wAt('terminado');
  const recorres = wAt('recorrés', 9);
  const son = wAt('son', 20), ciento = wAt('ciento'), cinco = wAt('cinco'), cuadrados = wAt('cuadrados'), y2 = wAt('y', 22.5), antes = wAt('antes', 23);
  const hace = wAt('hace'), veinte = wAt('veinte'), construimos = wAt('construimos');
  const antes2 = wAt('antes', 30.5), queremos = wAt('queremos'), esc = wAt('escribinos'), coord = wAt('coordinamos');
  const T2B = Math.min(S(1).hair, S(2).hair) - AIRE;
  return (
    <>
      {/* HOOK 1: arriba de la cabeza (con el visor) y sigue sobre el living */}
      <Velo at={0} out={1.95} y={S(0).hair - AIRE} />
      <Bloque bottom={S(0).hair - AIRE}>
        <Line at={0} out={1.95}><span style={med(58)}>estoy parado en este</span></Line>
        <Line at={living - 0.06} out={1.95} kind="zoom"><span style={hook(128)}>LIVING</span></Line>
      </Bloque>
      {/* medida: casi 9 METROS de largo */}
      <Bloque bottom={1110 - 34} gap={2}>
        <Line at={casi - 0.04} out={HOOK_VR[1]}><span style={med(56)}>casi</span></Line>
        <Line at={nueve - 0.04} out={HOOK_VR[1]} kind="pop"><span style={rojo(170, 16)}><Contador a={nueve - 0.04} b={nueve + 0.25} hasta={9} /> METROS</span></Line>
      </Bloque>
      <Bloque top={1110 + 40}>
        <Line at={largo - 0.04} out={HOOK_VR[1]}><span style={med(56)}>de largo</span></Line>
      </Bloque>
      {/* HOOK 2: todavía no está TERMINADO */}
      <Velo at={y - 0.04} out={5.5} y={T2B} />
      <Bloque bottom={T2B}>
        <Line at={y - 0.04} out={5.5}><span style={med(56)}>y este departamento</span></Line>
        <Line at={todavia - 0.04} out={5.5}><span style={med(56)}>todavía <B c={ROJO}>no</B> está</span></Line>
        <Line at={terminado - 0.06} out={5.5} kind="zoom"><span style={hook(124)}>TERMINADO</span></Line>
      </Bloque>
      {/* tag de la unidad (convive con subtítulos) */}
      <Velo at={recorres - 0.04} out={12.6} y={S(2).hair - AIRE} />
      <Bloque bottom={S(2).hair - AIRE}>
        <Line at={recorres - 0.04} out={12.6} kind="pop">
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <svg width={50} height={64} viewBox="0 0 50 64" style={{filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))'}}>
              <path d="M25 2 C12 2 3 11.5 3 24 C3 41 25 62 25 62 C25 62 47 41 47 24 C47 11.5 38 2 25 2 Z" fill={ROJO} stroke="white" strokeWidth={4} />
              <circle cx={25} cy={24} r={8} fill="white" />
            </svg>
            <Caja size={54}>GUARDIA NACIONAL 210</Caja>
          </div>
        </Line>
        <Line at={recorres + 0.2} out={12.6}><span style={med(44, 600)}>Unidad 2 · Villa Luro</span></Line>
      </Bloque>
      {/* 195 m² sobre el recorrido en pantalla completa */}
      <Bloque center={940} gap={4}>
        <Line at={son - 0.04} out={y2 - 0.05}><span style={med(58)}>casi</span></Line>
        <Line at={ciento - 0.04} out={y2 - 0.05} kind="pop"><span style={rojo(230, 18)}><Contador a={ciento - 0.04} b={cuadrados} hasta={195} /> M²</span></Line>
      </Bloque>
      <Bloque center={950} gap={10}>
        <Line at={y2 - 0.04} out={REC[1]}><span style={med(60)}>y los caminás</span></Line>
        <Line at={antes - 0.06} out={REC[1]} kind="zoom"><Caja size={118} italic>ANTES</Caja></Line>
        <Line at={antes + 0.25} out={REC[1]}><span style={med(54)}>de que estén <B>terminados</B></span></Line>
      </Bloque>
      {/* 20 AÑOS en Villa Luro */}
      <Velo at={hace - 0.04} out={27.62} y={S(5).hair - AIRE} />
      <Bloque bottom={S(5).hair - AIRE} gap={4}>
        <Line at={hace - 0.04} out={27.62}><span style={med(56)}>hace más de</span></Line>
        <Line at={veinte - 0.04} out={27.62} kind="pop"><span style={rojo(160, 16)}><Contador a={veinte - 0.04} b={veinte + 0.4} hasta={20} /> AÑOS</span></Line>
        <Line at={construimos - 0.1} out={27.62}><span style={med(48)}>que construimos en <B>Villa Luro</B></span></Line>
      </Bloque>
      {/* antes de que firmes, queremos que lo VEAS */}
      <Velo at={antes2 - 0.04} out={32.96} y={S(6).hair - AIRE} />
      <Velo at={esc - 0.04} out={DUR + 1} y={S(7).hair - AIRE} />
      <Bloque bottom={S(6).hair - AIRE} gap={8}>
        <Line at={antes2 - 0.04} out={32.96}><span style={med(56)}>antes de que <B>firmes</B>,</span></Line>
        <Line at={queremos - 0.06} out={32.96}><span style={med(56)}>queremos que lo</span></Line>
        <Line at={queremos + 0.05} out={32.96} kind="zoom"><Caja size={124} italic>VEAS</Caja></Line>
      </Bloque>
      {/* CTA */}
      <Bloque bottom={S(7).hair - AIRE} x={470} gap={6}>
        <Line at={esc - 0.04} out={DUR + 1} kind="pop"><span style={rojo(92, 13)}>ESCRIBINOS</span></Line>
        <Line at={coord - 0.06} out={DUR + 1}><span style={med(50)}>y coordinamos</span></Line>
        <Line at={coord + 0.3} out={DUR + 1}><span style={med(50)}>para que lo <B>veas</B></span></Line>
      </Bloque>
    </>
  );
};

// ---------- subtítulos ----------
type Sub = {t: string; s: number; e: number};
const posSub = (t: number) => {
  if (t >= REC[0] && t < REC[1]) return {y: 1338, x: 540};
  const sp = SPK.find((s) => t >= s.v0 && t < s.v1)!;
  return {y: sp.chin + 22, x: sp.i === 7 ? 400 : 540};
};
const Pieza: React.FC<{p: string}> = ({p}) => {
  if (p.startsWith('*')) return <span style={{fontFamily: MS, fontWeight: 900, fontSize: 70, color: ROJO, WebkitTextStroke: '10px white', paintOrder: 'stroke fill',
    letterSpacing: -1.5, filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.45))'}}>{p.replace(/\*/g, '')}</span>;
  if (p.startsWith('[')) return <span style={{background: 'rgba(225,14,28,0.82)', padding: '4px 14px 2px', borderRadius: 6, fontFamily: MS, fontWeight: 900, fontSize: 62,
    color: 'white', letterSpacing: -1}}>{p.replace(/[[\]]/g, '')}</span>;
  return <span style={{fontFamily: MS, fontWeight: 500, fontSize: 62, color: 'white', letterSpacing: -1, textShadow: SOMBRA}}>{p}</span>;
};
const Subs: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const b = (data.subs as Sub[]).find((s) => t >= s.s && t < s.e);
  if (!b) return null;
  const k = frame - f(b.s);
  const op = interpolate(k, [0, 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sc = interpolate(k, [0, 3], [0.9, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const {x, y} = posSub(b.s + 0.01);
  // partes: *ROJO*, [caja] y texto normal
  const partes = b.t.match(/\*[^*]+\*|\[[^\]]+\]|[^*[]+/g)!.map((p) => p.trim()).filter(Boolean);
  return (
    <div style={{position: 'absolute', left: x - 540, width: 1080, top: y, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16,
      whiteSpace: 'nowrap', opacity: op, transform: `scale(${sc})`, transformOrigin: `540px 40px`}}>
      {partes.map((p, i) => <Pieza key={i} p={p} />)}
    </div>
  );
};

export const GIN2310: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    <WhipFilters />
    {SPK.map((s) => (
      <Sequence key={s.i} from={f(s.v0)} durationInFrames={f(s.v1) - f(s.v0)}><Speaker sp={s} /></Sequence>
    ))}
    {/* B-roll del hook: el living que ve en el visor */}
    <Sequence from={f(HOOK_VR[0])} durationInFrames={f(HOOK_VR[1]) - f(HOOK_VR[0])}>
      <HookVR />
    </Sequence>
    <Sequence from={f(REC[0])} durationInFrames={f(REC[1]) - f(REC[0])}>
      <AbsoluteFillTrans t0={REC[0]}><Recorrido /></AbsoluteFillTrans>
    </Sequence>
    <Flash at={REC[0]} />
    <Anillo at={wAt('estos') - 0.04} out={wAt('y', 10) - 0.1} />
    <Titulos />
    <Subs />
    {guias && (
      <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid lime', boxSizing: 'border-box'}} />
    )}
  </AbsoluteFill>
);

// transición aplicada a todo el bloque del recorrido (entrada con zoom-blur y salida a la toma 1864)
const AbsoluteFillTrans: React.FC<{t0: number; children: React.ReactNode}> = ({t0, children}) => {
  const t = t0 + useCurrentFrame() / FPS;
  return <AbsoluteFill style={transStyle(t)}>{children}</AbsoluteFill>;
};
const HookVR: React.FC = () => {
  const t = HOOK_VR[0] + useCurrentFrame() / FPS;
  const z = interpolate(t, HOOK_VR, [1.0, 1.08]);
  return (
    <AbsoluteFill style={transStyle(t)}>
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <OffthreadVideo src={staticFile('gin2310/vr_liv.mp4')} muted />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 40% at 50% 52%, rgba(15,15,15,0.5), rgba(15,15,15,0.18) 100%)'}} />
      <Medida />
    </AbsoluteFill>
  );
};
