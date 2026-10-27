// Plantilla de referencia DC 04-10 (Enmienda 3): a cámara en la oficina + motion de marca A–E sobre fondo navy (data: face.ts, subs.ts, hair.ts del proyecto remotion-elevate/src/dc0410/).
// DC 04-10 "Título pendiente" — David Carballo (david-carballo-brand + edicion-reels-base)
// Enmienda 3 / Homestead Exemption: dos compradores en 2027. Un solo set (oficina, pared de listones negra con el neón).
// Voz: hook + cuerpo 1 (Dos-personas), cuerpo 2 (Ahora-imagina, 2.ª toma de la primera frase), CTA (ya-vives); cadena de voz propia.
// Estructura aprobada (v1). Acabado: subtítulos, títulos (2 con rotoscopia), motion A–E de marca, logo, transiciones.
// El audio (voz + música + SFX) se mezcla aparte; con --props='{"voz":true}' suena la voz sola para revisar.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing, delayRender, continueRender, getInputProps} from 'remotion';
import {FACES, SEGS} from './face';
import {SUBS} from './subs';
import {HAIR1, HAIR2} from './hair';

const FPS = 30;
export const DC0410_FRAMES = Math.round(74.77 * FPS);
const W = 1080;
const MAXW = 720; // centrado en x=540 → x 180–900
const NAVY = '#263142';
const CREMA = '#FFF3C9';
const GOLD_BLOCK = '#D2B759';
const GOLD_GRAD = 'linear-gradient(180deg, #D8C080 0%, #DFC87F 30%, #F0E5C5 78%, #FFF3C9 100%)';
const PROPS = getInputProps() as {guides?: boolean; voz?: boolean};
const fr = (t: number) => Math.round(t * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- planos ----------
type Kind = 'david' | 'stock' | 'motion';
type Clip = {a: number; b: number; kind: Kind; z?: 'wide' | 'punch'; src?: string; from?: number; m?: 'A' | 'B' | 'C' | 'D' | 'E'; logo: 'b' | 'n'; subY?: number};
const CLIPS: Clip[] = [
  {a: 0, b: 3.2, kind: 'david', z: 'wide', logo: 'b'},                                   // Dos personas compran una casa en Florida en el 2027
  {a: 3.2, b: 9.35, kind: 'motion', m: 'A', logo: 'b'},                                  // las dos compran $350.000… mucho mayor que la otra
  {a: 9.35, b: 10.6, kind: 'david', z: 'punch', logo: 'b'},                              // ¿Cómo es posible? Te explico.
  {a: 10.6, b: 13.56, kind: 'motion', m: 'B', logo: 'b'},                                // la Enmienda 3 · 3 de noviembre
  {a: 13.56, b: 16.18, kind: 'david', z: 'wide', logo: 'b'},                             // propone aumentar el Homestead Exemption
  {a: 16.18, b: 18.9, kind: 'david', z: 'punch', logo: 'b'},                             // pero hay un detalle…
  {a: 18.9, b: 22.22, kind: 'stock', src: 'tampabeach', from: 1.0, logo: 'n'},          // imagina que tú ya vives en Florida en el 2026
  {a: 22.22, b: 23.82, kind: 'stock', src: 'pareja', from: 1.5, logo: 'n', subY: 1030},             // pero todavía estás rentando
  {a: 23.82, b: 26.68, kind: 'stock', src: 'cartel2', from: 2.5, logo: 'b'},            // en el 2027 decides comprar tu primera casa
  {a: 26.68, b: 32.08, kind: 'david', z: 'wide', logo: 'b'},                             // aunque nunca hayas tenido… requisitos
  {a: 32.08, b: 34.04, kind: 'david', z: 'punch', logo: 'b'},                            // ahora imagina que tu amigo se muda por primera vez
  {a: 34.04, b: 36.68, kind: 'stock', src: 'autopista', from: 4.0, logo: 'b'},          // desde otro estado a Florida en el 2027
  {a: 36.68, b: 38.48, kind: 'stock', src: 'llaves2', from: 2.0, logo: 'n'},            // y también compra su primera casa
  {a: 38.48, b: 42.1, kind: 'david', z: 'wide', logo: 'b'},                              // la propuesta establece… exención tradicional
  {a: 42.1, b: 46.74, kind: 'motion', m: 'C', logo: 'b'},                                // tendría que esperar hasta su quinto año…
  {a: 46.74, b: 47.77, kind: 'david', z: 'punch', logo: 'b'},                            // ¿Ves la diferencia?
  {a: 47.77, b: 52.9, kind: 'motion', m: 'D', logo: 'b'},                                // dos compradores, el mismo año…
  {a: 52.9, b: 56.49, kind: 'david', z: 'wide', logo: 'b'},                              // y recuerda: solo si los votantes aprueban
  {a: 56.49, b: 58.42, kind: 'david', z: 'punch', logo: 'b'},                            // por eso, antes de comprar una casa
  {a: 58.42, b: 61.85, kind: 'stock', src: 'calc2', from: 1.0, logo: 'n'},              // precio y mensualidad de tu hipoteca
  {a: 61.85, b: 66.79, kind: 'motion', m: 'E', logo: 'b'},                               // impuestos / exenciones / gastos reales
  {a: 66.79, b: 69.23, kind: 'david', z: 'wide', logo: 'b'},                             // ¿Ya vives en Florida o estás pensando en mudarte?
  {a: 69.23, b: 71.49, kind: 'stock', src: 'agente3', from: 2.0, logo: 'n', subY: 1090},            // si estás pensando en comprar tu primera casa
  {a: 71.49, b: 74.77, kind: 'david', z: 'punch', logo: 'b'},                            // escríbeme y te ayudo…
];
export const clipAt = (t: number) => CLIPS.find((c) => t >= c.a && t < c.b) ?? CLIPS[CLIPS.length - 1];
// transición en cada corte: zoom-blur entre dos planos de David (punch), whip en los cambios de bloque
export const CUTS: [number, 'whip' | 'zoom'][] = CLIPS.slice(1).map((c, i) => [c.a, c.kind === 'david' && CLIPS[i].kind === 'david' ? 'zoom' : 'whip']);
const LEAKS = [18.9, 32.08, 66.79]; // light leak cálido al entrar a cada ejemplo y al CTA

// ---------- David: fuente y cara ----------
const SRC: Record<number, string> = {1: 'd_Dos-personas', 2: 'd_Ahora-imagina', 3: 'd_ya-vives'};
const segAt = (t: number) => SEGS.find((s) => t >= s.t0 && t < s.t1) ?? SEGS[SEGS.length - 1];
const srcTime = (t: number) => { const s = segAt(t); return {toma: s.toma, st: s.in + (t - s.t0)}; };
const faceAt = (toma: number, st: number) => { const F = FACES[toma]; return F.f[Math.max(0, Math.min(F.f.length - 1, Math.round((st - F.off) * FPS)))]; };
// escala del plano: wide = zoom lento 1,00→1,06; punch = hasta 1,23, recortado para que el subtítulo entre debajo del mentón (y ≤ 1440)
const zoomCache = new Map<number, [number, number]>();
const zoomRange = (c: Clip): [number, number] => {
  if (c.z === 'wide') return [1.0, 1.06];
  if (zoomCache.has(c.a)) return zoomCache.get(c.a)!;
  let lim = 1.23;
  for (let f = fr(c.a); f < fr(c.b); f++) {
    const {toma, st} = srcTime(f / FPS); const fc = faceAt(toma, st);
    lim = Math.min(lim, (1440 - 90 - fc.ey) / (fc.bot - fc.ey));
  }
  const r: [number, number] = [Math.max(1.08, lim - 0.03), lim];
  zoomCache.set(c.a, r);
  return r;
};
export const davidState = (t: number) => {
  const c = clipAt(t);
  if (c.kind !== 'david') return null;
  const [z0, z1] = zoomRange(c);
  const s = interpolate(fr(t) - fr(c.a), [0, fr(c.b) - fr(c.a)], [z0, z1], clamp);
  const {toma, st} = srcTime(t);
  const fc = faceAt(toma, st);
  return {s, fc, toma, st, y: (y: number) => fc.ey + (y - fc.ey) * s};
};
// tope del pelo en pantalla: medido en la máscara (rotoscopia) o estimado desde la cara (frente − 0,3·ancho)
const ROTO = [
  {a: 13.66, b: 16.1, toma: 1, src: 'fg1', start: 15.3, hair: HAIR1},
  {a: 54.93, b: 56.42, toma: 2, src: 'fg2', start: 30.6, hair: HAIR2},
];
const hairY = (t: number) => {
  const st = davidState(t);
  if (!st) return null;
  for (const r of ROTO) if (t >= r.a - 0.5 && t < r.b + 0.5 && st.toma === r.toma) {
    const i = Math.round((st.st - r.start) * FPS);
    if (i >= 0 && i < r.hair.length) return st.y(r.hair[i]);
  }
  return st.y(st.fc.top - 0.3 * st.fc.w);
};

const davidPieces = (c: Clip) =>
  SEGS.filter((s) => s.t1 > c.a && s.t0 < c.b).map((s) => ({a: Math.max(c.a, s.t0), b: Math.min(c.b, s.t1), seg: s})).filter((p) => fr(p.b) - fr(p.a) > 0);

const David: React.FC<{a: number; seg: (typeof SEGS)[number]}> = ({a, seg}) => {
  const f = useCurrentFrame();
  const st = davidState(a + f / FPS)!;
  return (
    <AbsoluteFill style={{transform: `scale(${st.s})`, transformOrigin: `${st.fc.ex}px ${st.fc.ey}px`}}>
      <OffthreadVideo src={staticFile(`dc0410/${SRC[seg.toma]}.mp4`)} startFrom={fr(seg.in + (a - seg.t0))} muted />
    </AbsoluteFill>
  );
};
const Stock: React.FC<{c: Clip}> = ({c}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, fr(c.b) - fr(c.a)], [1.0, 1.06], clamp);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`}}>
      <OffthreadVideo src={staticFile(`dc0410/${c.src}.mp4`)} startFrom={fr(c.from!)} muted />
    </AbsoluteFill>
  );
};

// ---------- transiciones ----------
const transition = (frame: number) => {
  for (const [t, kind] of CUTS) {
    const d = frame - fr(t);
    if (d < -3 || d > 2) continue;
    const p = d < 0 ? (d + 4) / 3 : (3 - d) / 3;
    const e = Easing.in(Easing.quad)(Math.max(0, Math.min(1, p)));
    if (kind === 'whip') return {tx: (d < 0 ? -1 : 1) * 260 * e, hblur: 45 * e, scale: 1 + 0.5 * e, blur: 0, ox: 540, oy: 960}; // escala ≥ 1 + 2·260/1080: el barrido no deja ver el borde
    const st = davidState(frame / FPS);
    return {tx: 0, hblur: 0, scale: 1 + 0.3 * e, blur: 14 * e, ox: st?.fc.ex ?? 540, oy: st?.fc.ey ?? 960}; // zoom-blur anclado a los ojos
  }
  return {tx: 0, hblur: 0, scale: 1, blur: 0, ox: 540, oy: 960};
};
const LightLeak: React.FC = () => {
  const f = useCurrentFrame();
  let k = 0;
  for (const t of LEAKS) k = Math.max(k, interpolate(f, [fr(t) - 6, fr(t), fr(t) + 12], [0, 1, 0], clamp));
  if (k <= 0) return null;
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', opacity: k}}>
      <AbsoluteFill style={{background: 'radial-gradient(60% 45% at 85% 20%, rgba(255,150,60,0.95) 0%, rgba(255,110,90,0.5) 40%, rgba(255,110,90,0) 75%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(55% 40% at 10% 80%, rgba(255,120,150,0.7) 0%, rgba(255,170,90,0) 70%)'}} />
    </AbsoluteFill>
  );
};

// ---------- motion de marca ----------
// fondo de marca (06-10): radial navy → carbón con líneas doradas finas a 135° que se desplazan y dos brillos dorados
const BrandBG: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(85% 60% at 50% 45%, #33415A 0%, #263142 45%, #232529 100%)'}}>
      <AbsoluteFill style={{opacity: 0.07, backgroundImage: 'repeating-linear-gradient(135deg, #D2B759 0px, #D2B759 2px, transparent 2px, transparent 46px)', backgroundPosition: `${f * 0.6}px 0px`}} />
      <AbsoluteFill style={{background: `radial-gradient(30% 18% at ${20 + Math.sin(f / 50) * 6}% 22%, rgba(210,183,89,0.16) 0%, rgba(210,183,89,0) 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(28% 16% at ${80 + Math.cos(f / 60) * 6}% 82%, rgba(210,183,89,0.12) 0%, rgba(210,183,89,0) 100%)`}} />
    </AbsoluteFill>
  );
};
// pop con overshoot desde el segundo `at` (tiempo absoluto); a = inicio del Sequence
const usePop = (a: number) => {
  const f = useCurrentFrame();
  return (at: number, dur = 9) => {
    const l = f - fr(at - a);
    return {
      o: interpolate(l, [0, 3], [0, 1], clamp),
      s: interpolate(l, [0, dur], [0.6, 1], {...clamp, easing: Easing.out(Easing.back(2.2))}),
      y: interpolate(l, [0, dur], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)}),
      on: l >= 0,
    };
  };
};
type Pop = ReturnType<ReturnType<typeof usePop>>;
const T: React.FC<{w?: number; size: number; color?: string; gold?: boolean; track?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({w = 500, size, color = '#fff', gold, track = -0.04, style, children}) => (
  <span style={{fontFamily: 'OSO', fontWeight: w, fontSize: size, letterSpacing: `${track}em`, lineHeight: 0.95, color: gold ? 'transparent' : color, whiteSpace: 'pre',
    ...(gold ? {backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', paddingTop: '0.2em', marginTop: '-0.2em', paddingBottom: '0.1em', marginBottom: '-0.1em'} : {}), ...style}}>{children}</span>
);
const abs = (x: number, y: number, w: number, h: number, extra: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: w, height: h, ...extra});
const center: React.CSSProperties = {display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'};
const House: React.FC<{size: number; color?: string}> = ({size, color = GOLD_BLOCK}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
    <path d="M12 48 L50 16 L88 48" /><path d="M22 40 V86 H78 V40" /><path d="M42 86 V62 H58 V86" /><path d="M68 28 V18 H76 V34" />
  </svg>
);
const Disclaimer: React.FC<{y: number; o: number}> = ({y, o}) => (
  <div style={{...abs(180, y, 720, 40), ...center, opacity: o * 0.8}}><T size={30} color={CREMA} track={0}>*Propuesta sujeta a la aprobación de la Enmienda 3</T></div>
);
const card = (x: number, y: number, w: number, h: number, p: Pop): React.CSSProperties => ({
  ...abs(x, y, w, h), opacity: p.o, transform: `translateY(${p.y}px) scale(${p.s})`, borderRadius: 28,
  background: 'linear-gradient(180deg, rgba(51,65,90,0.92) 0%, rgba(38,49,66,0.95) 100%)', border: '3px solid rgba(210,183,89,0.75)', boxShadow: '0 24px 50px rgba(8,10,16,0.5)'});

// A · dos casas iguales de $350.000; la barra de exención de una crece mucho más
const MotionA: React.FC<{a: number}> = ({a}) => {
  const pop = usePop(a);
  const f = useCurrentFrame();
  const t = f / FPS + a;
  const c1 = pop(a + 0.04), c2 = pop(a + 0.2), p1 = pop(4.66), p2 = pop(4.76), bars = pop(7.32);
  const hL = interpolate(t, [7.32, 7.8], [0, 70], {...clamp, easing: Easing.out(Easing.cubic)});
  const hR = interpolate(t, [7.32, 7.8, 8.3, 8.9], [0, 70, 70, 230], {...clamp, easing: Easing.out(Easing.back(1.3))});
  const Card = ({x, cc, pp, n, h, gold}: {x: number; cc: Pop; pp: Pop; n: number; h: number; gold: boolean}) => (
    <div style={card(x, 520, 330, 600, cc)}>
      <div style={{...abs(0, 34, 330, 110), ...center}}><House size={104} /></div>
      <div style={{...abs(0, 150, 330, 40), ...center}}><T w={800} size={30} color={CREMA} track={0.08}>{`COMPRADOR ${n}`}</T></div>
      <div style={{...abs(0, 196, 330, 80), ...center, opacity: pp.o, transform: `scale(${pp.s})`}}><T w={900} size={66} gold>$350.000</T></div>
      <div style={{...abs(40, 300, 250, 3), background: 'rgba(255,243,201,0.18)'}} />
      <div style={{...abs(105, 520 - h, 120, h), opacity: bars.o, borderRadius: '14px 14px 4px 4px',
        background: gold ? 'linear-gradient(180deg, #F0E5C5 0%, #D2B759 100%)' : 'rgba(255,243,201,0.55)', boxShadow: gold ? '0 0 30px rgba(210,183,89,0.45)' : 'none'}} />
      <div style={{...abs(0, 532, 330, 40), ...center, opacity: bars.o}}><T w={800} size={30} color={CREMA} track={0.08}>EXENCIÓN</T></div>
    </div>
  );
  return (
    <AbsoluteFill>
      <BrandBG />
      <Card x={195} cc={c1} pp={p1} n={1} h={hL} gold={false} />
      <Card x={555} cc={c2} pp={p2} n={2} h={hR} gold />
      <Disclaimer y={1140} o={bars.o} />
    </AbsoluteFill>
  );
};

// B · boleta de la Enmienda 3 + fecha de la votación
const MotionB: React.FC<{a: number}> = ({a}) => {
  const pop = usePop(a);
  const f = useCurrentFrame();
  const c = pop(a + 0.03, 12), num = pop(11.4), date = pop(12.69);
  const rot = interpolate(f, [0, 12], [-7, -2], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <BrandBG />
      <div style={{...abs(250, 470, 580, 560), opacity: c.o, transform: `translateY(${c.y * 3}px) rotate(${rot}deg)`, background: '#FBF8F0', borderRadius: 18, boxShadow: '0 30px 60px rgba(5,8,14,0.55)'}}>
        <div style={{...abs(0, 0, 580, 70), background: NAVY, borderRadius: '18px 18px 0 0', ...center}}><T w={800} size={30} color={CREMA} track={0.16}>FLORIDA · BOLETA</T></div>
        <div style={{...abs(0, 110, 580, 120), ...center}}><T w={900} size={96} color={NAVY} track={-0.05}>ENMIENDA</T></div>
        <div style={{...abs(190, 228, 200, 130), ...center, background: NAVY, borderRadius: 16, opacity: num.o, transform: `scale(${num.s})`}}><T w={900} size={110} color="#fff">3</T></div>
        {[0, 1, 2].map((i) => <div key={i} style={{...abs(70, 400 + i * 34, i === 2 ? 300 : 440, 12), background: 'rgba(38,49,66,0.16)', borderRadius: 6}} />)}
      </div>
      <div style={{...abs(180, 1000, 720, 120), ...center, opacity: date.o, transform: `scale(${date.s})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 34px', borderRadius: 20, background: NAVY, border: `3px solid ${GOLD_BLOCK}`, boxShadow: '0 18px 40px rgba(5,8,14,0.5)'}}>
          <svg width={58} height={58} viewBox="0 0 100 100" fill="none" stroke={GOLD_BLOCK} strokeWidth={7} strokeLinecap="round"><rect x="12" y="20" width="76" height="68" rx="10" /><path d="M12 42 H88 M32 10 V28 M68 10 V28" /></svg>
          <T w={900} size={62} gold>3 DE NOVIEMBRE</T>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// C · línea de tiempo del amigo: exención tradicional años 1–4, beneficio aumentado en el año 5
const MotionC: React.FC<{a: number}> = ({a}) => {
  const pop = usePop(a);
  const f = useCurrentFrame();
  const t = f / FPS + a;
  const head = pop(a + 0.03), trad = pop(42.13), five = pop(43.83, 12), ben = pop(45.89, 10);
  const X = [230, 385, 540, 695, 850];
  const fill = interpolate(t, [42.63, 43.83], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const Y = 790;
  return (
    <AbsoluteFill>
      <BrandBG />
      <div style={{...abs(180, 470, 720, 150), ...center, opacity: head.o, transform: `translateY(${head.y}px)`}}>
        <T size={50}>el caso de</T><T w={900} size={112}>TU AMIGO</T>
      </div>
      <div style={{...abs(X[0], Y - 4, X[4] - X[0], 8), background: 'rgba(255,243,201,0.25)', borderRadius: 4}} />
      <div style={{...abs(X[0], Y - 4, (X[4] - X[0]) * fill, 8), background: GOLD_BLOCK, borderRadius: 4, boxShadow: '0 0 18px rgba(210,183,89,0.6)'}} />
      {X.map((x, i) => {
        const lit = fill >= i / 4 - 0.001;
        const big = i === 4;
        const sc = big && five.on ? five.s * 1.35 : 1;
        return (
          <React.Fragment key={i}>
            <div style={{...abs(x - 22, Y - 22, 44, 44), borderRadius: 22, transform: `scale(${sc})`, background: lit ? (big && five.on ? 'linear-gradient(180deg,#F0E5C5,#D2B759)' : CREMA) : NAVY,
              border: `4px solid ${lit ? GOLD_BLOCK : 'rgba(255,243,201,0.4)'}`, boxShadow: big && five.on ? '0 0 34px rgba(210,183,89,0.8)' : 'none', boxSizing: 'border-box'}} />
            <div style={{...abs(x - 70, Y + 44, 140, 40), ...center}}><T w={big ? 900 : 800} size={big ? 34 : 30} color={big && five.on ? CREMA : 'rgba(255,255,255,0.85)'} track={0.04}>{`AÑO ${i + 1}`}</T></div>
          </React.Fragment>
        );
      })}
      <div style={{...abs(X[0] - 20, Y - 100, X[3] - X[0] + 40, 60), ...center, opacity: trad.o, transform: `translateY(${trad.y * 0.5}px)`}}>
        <div style={{padding: '8px 22px', borderRadius: 30, border: '2px solid rgba(255,243,201,0.6)'}}><T w={800} size={32} color={CREMA} track={0.02}>exención tradicional</T></div>
      </div>
      <div style={{...abs(180, 950, 720, 190), ...center, opacity: ben.o, transform: `scale(${ben.s})`}}>
        <T size={56}>beneficio</T><T w={900} size={112} gold>AUMENTADO</T>
      </div>
    </AbsoluteFill>
  );
};

// D · comparación: tú vs. tu amigo, mismo año, beneficios diferentes
const MotionD: React.FC<{a: number}> = ({a}) => {
  const pop = usePop(a);
  const f = useCurrentFrame();
  const t = f / FPS + a;
  const c1 = pop(a + 0.03), c2 = pop(a + 0.2), year = pop(48.88), b1 = pop(50.3), b2 = pop(50.5), neq = pop(52.05, 10);
  const pulse = 1 + 0.06 * Math.sin(Math.min(1, Math.max(0, (t - 52.05) / 0.4)) * Math.PI);
  const Col = ({x, cc, bb, who, l1, l2, badge, sub, gold}: {x: number; cc: Pop; bb: Pop; who: string; l1: string; l2: string; badge: string; sub: string; gold: boolean}) => (
    <div style={card(x, 600, 330, 500, cc)}>
      <div style={{...abs(0, 40, 330, 100), ...center}}><T w={900} size={who.length > 3 ? 56 : 96}>{who}</T></div>
      <div style={{...abs(0, 150, 330, 100), ...center}}><T size={34} color={CREMA}>{l1}</T><T w={800} size={40} color="#fff" style={{marginTop: 6}}>{l2}</T></div>
      <div style={{...abs(20, 290, 290, 170), ...center, opacity: bb.o, transform: `scale(${bb.s * pulse})`}}>
        <div style={{width: 290, padding: '18px 0', borderRadius: 18, ...center, ...(gold ? {background: 'linear-gradient(180deg,#F0E5C5 0%,#D2B759 100%)', boxShadow: '0 0 30px rgba(210,183,89,0.5)'} : {border: '3px solid rgba(255,243,201,0.7)'})}}>
          <T w={900} size={38} color={gold ? NAVY : '#fff'} track={-0.02}>{badge}</T>
          <T w={500} size={30} color={gold ? NAVY : CREMA} track={0} style={{marginTop: 8, lineHeight: 1.05}}>{sub}</T>
        </div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <BrandBG />
      <div style={{...abs(180, 450, 720, 110), ...center, opacity: year.o, transform: `scale(${year.s})`}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 16}}><T size={52}>compran en</T><T w={900} size={92} gold>2027</T></div>
      </div>
      <Col x={195} cc={c1} bb={b1} who="TÚ" l1="en Florida" l2="desde 2026" badge="AUMENTADA" sub={"si cumples los\nrequisitos"} gold />
      <Col x={555} cc={c2} bb={b2} who="TU AMIGO" l1="llega a Florida" l2="en 2027" badge="TRADICIONAL" sub={"aumentada\nen el año 5"} gold={false} />
      <div style={{...abs(490, 800, 100, 100), ...center, opacity: neq.o, transform: `scale(${neq.s})`}}>
        <div style={{width: 84, height: 84, borderRadius: 42, background: NAVY, border: `3px solid ${GOLD_BLOCK}`, ...center}}><T w={900} size={60} gold>≠</T></div>
      </div>
      <Disclaimer y={1130} o={c1.o} />
    </AbsoluteFill>
  );
};

// E · checklist: impuestos, exenciones y gastos reales
const MotionE: React.FC<{a: number}> = ({a}) => {
  const pop = usePop(a);
  const head = pop(a + 0.03), h2 = pop(62.58);
  const ROWS: [string, number, number][] = [['Impuestos', 62.9, 63.12], ['Exenciones', 63.6, 63.84], ['Gastos reales', 64.9, 65.13]];
  return (
    <AbsoluteFill>
      <BrandBG />
      <div style={{...abs(180, 500, 720, 200), ...center}}>
        <div style={{opacity: head.o, transform: `translateY(${head.y}px)`}}><T size={54}>antes de comprar,</T></div>
        <div style={{opacity: h2.o, transform: `scale(${h2.s})`}}><T w={900} size={118} gold>ENTIENDE</T></div>
      </div>
      {ROWS.map(([txt, at, chk], i) => {
        const r = pop(at), c = pop(chk, 8);
        return (
          <div key={i} style={{...abs(230, 760 + i * 120, 620, 96), opacity: r.o, transform: `translateX(${(1 - r.o) * 60}px)`, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 28, padding: '0 30px',
            background: 'rgba(51,65,90,0.9)', border: `2px solid ${c.on ? GOLD_BLOCK : 'rgba(255,243,201,0.3)'}`, boxSizing: 'border-box'}}>
            <div style={{width: 56, height: 56, borderRadius: 28, ...center, border: `4px solid ${GOLD_BLOCK}`, background: c.on ? GOLD_BLOCK : 'transparent', transform: `scale(${c.on ? c.s : 1})`, boxSizing: 'border-box'}}>
              {c.on && <svg width={34} height={34} viewBox="0 0 100 100" fill="none" stroke={NAVY} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round"><path d="M18 52 L42 74 L84 28" /></svg>}
            </div>
            <T w={800} size={54}>{txt}</T>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
const MOTION = {A: MotionA, B: MotionB, C: MotionC, D: MotionD, E: MotionE};

const ImageLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const tr = transition(frame);
  const filter = [tr.hblur > 0.5 ? 'url(#hblur)' : '', tr.blur > 0.3 ? `blur(${tr.blur}px)` : ''].join(' ').trim();
  return (
    <AbsoluteFill style={{transform: `translateX(${tr.tx}px) scale(${tr.scale})`, transformOrigin: `${tr.ox}px ${tr.oy}px`, filter: filter || undefined}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="hblur" x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${Math.max(0, tr.hblur)} 0`} /></filter>
      </svg>
      {CLIPS.map((c, i) => {
        if (c.kind === 'david')
          return davidPieces(c).map((p, j) => (
            <Sequence key={`${i}-${j}`} from={fr(p.a)} durationInFrames={fr(p.b) - fr(p.a)}><David a={p.a} seg={p.seg} /></Sequence>
          ));
        const M = c.m ? MOTION[c.m] : null;
        return (
          <Sequence key={i} from={fr(c.a)} durationInFrames={fr(c.b) - fr(c.a)}>
            {c.kind === 'stock' ? <Stock c={c} /> : M && <M a={c.a} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// recorte de David (rotoscopia) por encima del título que va detrás de su cabeza, con la misma escala del plano
const RotoFG: React.FC<{r: (typeof ROTO)[number]}> = ({r}) => {
  const f = useCurrentFrame();
  const st = davidState(r.a + f / FPS)!;
  return (
    <AbsoluteFill style={{transform: `scale(${st.s})`, transformOrigin: `${st.fc.ex}px ${st.fc.ey}px`}}>
      <OffthreadVideo src={staticFile(`dc0410/${r.src}.mov`)} startFrom={fr(srcTime(r.a).st - r.start)} muted transparent />
    </AbsoluteFill>
  );
};

// ---------- textos ----------
let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, weight: number, size: number, track: number) => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `${weight} ${size}px OSO`;
  (ctx as any).letterSpacing = `${track * size}px`;
  return ctx!.measureText(txt).width;
};
type Part = {t: string; w: 500 | 800 | 900; size: number; gold?: boolean};
type Line = {parts: Part[]; at: number};
type Pos = 'head' | 'roto' | 'top';
type Title = {a: number; b: number; pos: Pos; lines: Line[]; overlap?: number};
const P = (t: string, w: 500 | 800 | 900, size: number, gold = false): Part => ({t, w, size, gold});
export const TITLES: Title[] = [
  {a: 0.11, b: 3.2, pos: 'head', lines: [
    {at: 0.11, parts: [P('Dos personas compran una casa', 500, 54)]},
    {at: 1.41, parts: [P('en ', 500, 70), P('FLORIDA', 900, 124, true)]},
    {at: 2.1, parts: [P('en el ', 500, 62), P('2027', 800, 78)]}]},
  {a: 13.66, b: 16.1, pos: 'roto', overlap: 40, lines: [
    {at: 13.66, parts: [P('propone aumentar el', 500, 56)]},
    {at: 14.81, parts: [P('HOMESTEAD', 900, 146, true)]},
    {at: 15.41, parts: [P('EXEMPTION', 800, 96)]}]},
  {a: 18.98, b: 22.18, pos: 'top', lines: [
    {at: 18.98, parts: [P('TÚ', 900, 170)]},
    {at: 19.72, parts: [P('ya vives en Florida', 500, 60)]},
    {at: 21.43, parts: [P('desde ', 500, 60), P('2026', 800, 84)]}]},
  {a: 24.05, b: 26.64, pos: 'top', lines: [
    {at: 24.05, parts: [P('2027', 900, 190)]},
    {at: 24.95, parts: [P('decides comprar', 500, 58)]},
    {at: 25.77, parts: [P('tu ', 500, 62), P('primera casa', 800, 74)]}]},
  {a: 29.6, b: 32.04, pos: 'head', lines: [
    {at: 29.6, parts: [P('exención', 500, 70)]},
    {at: 30.24, parts: [P('AUMENTADA', 900, 128, true)]},
    {at: 30.78, parts: [P('si cumples con los requisitos', 500, 44)]}]},
  {a: 34.07, b: 36.64, pos: 'top', lines: [
    {at: 34.07, parts: [P('TU AMIGO', 900, 140)]},
    {at: 34.41, parts: [P('llega desde otro estado', 500, 54)]},
    {at: 35.79, parts: [P('a Florida en ', 500, 58), P('2027', 800, 74, true)]}]},
  {a: 40.95, b: 42.06, pos: 'head', lines: [
    {at: 40.95, parts: [P('exención', 500, 70)]},
    {at: 41.39, parts: [P('TRADICIONAL', 900, 118)]}]},
  {a: 54.93, b: 56.42, pos: 'roto', overlap: 18, lines: [
    {at: 54.93, parts: [P('solo si los votantes', 500, 56)]},
    {at: 55.75, parts: [P('APRUEBAN', 900, 150, true)]},
    {at: 56.09, parts: [P('la enmienda', 500, 60)]}]},
  {a: 71.52, b: 74.77, pos: 'head', lines: [
    {at: 71.52, parts: [P('ESCRÍBEME', 900, 140, true)]},
    {at: 72.08, parts: [P('y te ayudo a entender el proceso', 500, 44)]},
    {at: 73.44, parts: [P('de principio a fin', 800, 60)]}]},
];
// tramos donde el gráfico ya dice lo que se escucha: sin subtítulo
const HIDE: [number, number][] = [...TITLES.map((t): [number, number] => [t.a, t.b]), [45.89, 46.74], [62.58, 66.79]];
const MOTION_SUB_TOP = 1200; // subtítulos fijos debajo del gráfico en los tramos de motion (regla 4.2)

const parseSub = (txt: string) =>
  txt.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((p) => (p.startsWith('**') ? {t: p.slice(2, -2), w: 800} : {t: p, w: 500}));
const SUB_SIZE = 58;
const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + 0.04;
  let idx = -1;
  for (let i = 0; i < SUBS.length; i++) if (SUBS[i][0] <= t) idx = i;
  if (idx < 0) return null;
  const a = fr(Math.max(0, SUBS[idx][0] - 0.04));
  const nextA = idx + 1 < SUBS.length ? fr(SUBS[idx + 1][0] - 0.04) : DC0410_FRAMES;
  const b = Math.min(nextA, fr(SUBS[idx][2] + 0.6));
  if (frame >= b) return null;
  if (HIDE.some(([h0, h1]) => frame >= fr(h0) && frame < fr(h1))) return null;
  const parts = parseSub(SUBS[idx][1]);
  const width = parts.reduce((acc, p) => acc + measure(p.t, p.w, SUB_SIZE, -0.03), 0);
  const k = Math.min(1, MAXW / width);
  const h = SUB_SIZE * 1.15 * k;
  // plano que ocupa la mayor parte del bloque
  const count = new Map<Clip, number>();
  for (let f = a; f < b; f++) { const c = clipAt(f / FPS); count.set(c, (count.get(c) ?? 0) + 1); }
  const c = [...count.entries()].sort((x, y) => y[1] - x[1])[0][0];
  let top: number;
  if (c.kind === 'motion') top = MOTION_SUB_TOP;
  else if (c.kind === 'stock') top = (c.subY ?? 960) - h / 2;
  else {
    let chin = 0;
    for (let f = a; f < b; f++) { const st = davidState(f / FPS); if (st) chin = Math.max(chin, st.y(st.fc.bot)); }
    top = Math.min(chin + 20, 1440 - h);
  }
  const pop = interpolate(frame - a, [0, 4], [0.9, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  return (
    <div style={{position: 'absolute', left: 0, width: W, top, textAlign: 'center', lineHeight: 1.15,
      fontFamily: 'OSO', fontSize: SUB_SIZE * k, letterSpacing: '-0.03em', color: '#fff', whiteSpace: 'nowrap',
      transform: `scale(${pop})`, textShadow: '0 3px 14px rgba(20,24,32,0.8), 0 1px 3px rgba(20,24,32,0.65)'}}>
      {parts.map((p, i) => <span key={i} style={{fontWeight: p.w}}>{p.t}</span>)}
    </div>
  );
};

const TitleView: React.FC<{ti: Title}> = ({ti}) => {
  const frame = useCurrentFrame();
  const a = fr(ti.a), b = fr(ti.b);
  if (frame < a || frame >= b) return null;
  const widths = ti.lines.map((l) => l.parts.reduce((acc, p) => acc + measure(p.t, p.w, p.size, -0.06), 0));
  const k = Math.min(1, MAXW / Math.max(...widths));
  const lh = ti.lines.map((l) => Math.max(...l.parts.map((p) => p.size)) * 0.88 * k);
  const H = lh.reduce((x, y) => x + y, 0);
  let top: number;
  if (ti.pos === 'top') top = Math.max(330, 540 - H / 2);
  else {
    let hair = 9999;
    for (let f = a; f < b; f++) { const y = hairY(f / FPS); if (y !== null) hair = Math.min(hair, y); }
    // roto: el pie de la última línea pasa detrás de la cabeza; head: el título queda ~26 px sobre el pelo
    top = ti.pos === 'roto' ? hair + (ti.overlap ?? 40) - H : hair - 26 - H;
    top = Math.max(318, top);
  }
  const out = interpolate(frame, [b - 4, b - 1], [1, 0], clamp);
  let y = top;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: out, transform: `translateY(${(1 - out) * -12}px)`}}>
      {ti.lines.map((l, i) => {
        const yy = y;
        y += lh[i];
        return <TitleLine key={i} line={l} k={k} top={yy} h={lh[i]} local={frame - fr(l.at)} width={widths[i] * k} />;
      })}
    </div>
  );
};
const TitleLine: React.FC<{line: Line; k: number; top: number; h: number; local: number; width: number}> = ({line, k, top, h, local, width}) => {
  if (local < 0) return null;
  const grow = interpolate(local, [0, 5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const retract = interpolate(local, [5, 10], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const lift = interpolate(local, [0, 8], [14, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const x0 = 540 - width / 2 - 14, bw = width + 28;
  const content = (
    <div style={{position: 'absolute', left: 0, width: W, top: 0, height: h, display: 'flex', justifyContent: 'center', alignItems: 'baseline',
      transform: `translateY(${lift}px)`, filter: 'drop-shadow(0 5px 12px rgba(20,24,32,0.6))'}}>
      {line.parts.map((p, j) => (
        <span key={j} style={{fontFamily: 'OSO', fontWeight: p.w, fontSize: p.size * k, letterSpacing: '-0.06em', lineHeight: 0.95,
          whiteSpace: 'pre', color: p.gold ? 'transparent' : '#fff', paddingRight: p.gold ? '0.08em' : 0,
          ...(p.gold ? {backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', paddingTop: '0.3em', marginTop: '-0.3em', paddingBottom: '0.15em', marginBottom: '-0.15em'} : {})}}>{p.t}</span>
      ))}
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 0, width: W, top, height: h}}>
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(-60px ${W - (x0 + bw * grow)}px -60px 0px)`}}>{content}</div>
      {retract < 1 && <div style={{position: 'absolute', top: h * 0.08, height: h * 0.84, left: x0 + bw * retract, width: Math.max(0, bw * (grow - retract)), background: GOLD_BLOCK}} />}
    </div>
  );
};
// oscurece el stock mientras hay un título encima (texto claro sobre fondos claros: cielo, interiores)
const TitleDim: React.FC = () => {
  const frame = useCurrentFrame();
  let k = 0;
  for (const ti of TITLES) if (ti.pos === 'top') k = Math.max(k, interpolate(frame, [fr(ti.a), fr(ti.a) + 5, fr(ti.b) - 4, fr(ti.b)], [0, 1, 1, 0], clamp));
  return k > 0 ? <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(15,18,24,0.65) 0%, rgba(15,18,24,0.5) 40%, rgba(15,18,24,0.15) 75%)', opacity: k}} /> : null;
};
// oscurece apenas el stock bajo el subtítulo centrado (fondos claros)
const SubDim: React.FC = () => {
  const frame = useCurrentFrame();
  const c = clipAt(frame / FPS);
  if (c.kind !== 'stock') return null;
  const k = interpolate(frame, [fr(c.a), fr(c.a) + 4, fr(c.b) - 3, fr(c.b)], [0, 1, 1, 0], clamp);
  const y = c.subY ?? 960;
  return <AbsoluteFill style={{background: `radial-gradient(60% 9% at 50% ${(y / 1920) * 100}%, rgba(15,18,24,0.45) 0%, rgba(15,18,24,0) 100%)`, opacity: k}} />;
};

// ---------- logo (siempre arriba a la derecha, pisando todo) ----------
const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const c = clipAt(frame / FPS);
  return <Img src={staticFile(c.logo === 'b' ? 'dc0410/logo_blanco.png' : 'dc0410/logo_negro.png')} style={{position: 'absolute', left: 735, top: 75, width: 240}} />;
};

const Guides: React.FC = () => {
  const frame = useCurrentFrame();
  const st = davidState(frame / FPS);
  const hy = hairY(frame / FPS);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid rgba(0,255,0,.8)'}} />
      <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'rgba(0,255,255,.6)'}} />
      {st && hy !== null && <div style={{position: 'absolute', left: 250, width: 580, top: hy, height: st.y(st.fc.bot) - hy, background: 'rgba(255,0,0,.25)'}} />}
    </AbsoluteFill>
  );
};

export const DC0410: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const fonts: [string, string][] = [['OpenSauceOne-Medium.ttf', '500'], ['OpenSauceOne-Bold.ttf', '800'], ['OpenSauceOne-Black.ttf', '900']];
    Promise.all(fonts.map(([f, w]) => new FontFace('OSO', `url(${staticFile('fonts/' + f)})`, {weight: w}).load().then((x) => document.fonts.add(x))))
      .then(() => { setReady(true); continueRender(handle); });
  }, [handle]);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <ImageLayer />
      <LightLeak />
      <TitleDim />
      <SubDim />
      {ready && TITLES.filter((t) => t.pos === 'roto').map((ti, i) => <TitleView key={i} ti={ti} />)}
      {ROTO.map((r, i) => (
        <Sequence key={i} from={fr(r.a)} durationInFrames={fr(r.b) - fr(r.a)}><RotoFG r={r} /></Sequence>
      ))}
      {ready && <Subtitles />}
      {ready && TITLES.filter((t) => t.pos !== 'roto').map((ti, i) => <TitleView key={i} ti={ti} />)}
      <Logo />
      {PROPS.voz && <Audio src={staticFile('dc0410/voz.wav')} />}
      {PROPS.guides && <Guides />}
    </AbsoluteFill>
  );
};
