// DC 13-10 "Título pendiente" — David Carballo (david-carballo-brand + edicion-reels-base)
// Enmienda 3 / Homestead Exemption: "¿Sabías que podrías pagar mucho menos en impuestos?". Un set (oficina, pared de listones negra con el neón), David parado.
// Voz: toma 1 (hook + cuerpo 1), toma 2 (cuerpo 2, 3.ª repetición de "Eso sí…"), toma 3 (firma + CTA); cadena de voz propia (PROYECTO/voz.py, cortes.py).
// Estructura aprobada (v1, 2026-10-28). Acabado: subtítulos, títulos (2 con rotoscopia), motion A–D de marca, tarjeta de David, logo, transiciones.
// Sistema de texto, transiciones y fondo de marca tomados de DC 04-10. El audio (voz + música + SFX) se mezcla aparte (PROYECTO/mix.py).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing, delayRender, continueRender, getInputProps} from 'remotion';
// Plantilla de referencia (DC 13-10, aprobada 2026-10-28). Datos (face.ts, subs.ts, hair.ts) y medios: ver references/piezas.md, pieza J.
import {FACES, SEGS} from './face';
import {SUBS} from './subs';
import {HAIR1, HAIR2} from './hair';

const FPS = 30;
export const DC1310_FRAMES = Math.round(65.87 * FPS);
const W = 1080;
const MAXW = 720; // centrado en x=540 → x 180–900
const NAVY = '#263142';
const CREMA = '#FFF3C9';
const GOLD_BLOCK = '#D2B759';
const GOLD_GRAD = 'linear-gradient(180deg, #D8C080 0%, #DFC87F 30%, #F0E5C5 78%, #FFF3C9 100%)';
const PROPS = getInputProps() as {guides?: boolean; voz?: boolean};
const fr = (t: number) => Math.round(t * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- planos (estructura aprobada) ----------
type Kind = 'david' | 'stock' | 'motion';
type Clip = {a: number; b: number; kind: Kind; z?: 'wide' | 'punch'; src?: string; from?: number; m?: 'A' | 'B' | 'C' | 'D'; logo: 'b' | 'n'; subY?: number};
const CLIPS: Clip[] = [
  {a: 0, b: 4.11, kind: 'david', z: 'wide', logo: 'b'},                                    // ¿Sabías que podrías pagar mucho menos…? Te explico por qué.
  {a: 4.11, b: 8.19, kind: 'stock', src: 'familia', from: 0.5, logo: 'b'},     // Cada año, si eres dueño de una casa en Florida…
  {a: 8.19, b: 12.99, kind: 'david', z: 'punch', logo: 'b'},                                // …donde tú vives… Homestead Exemption
  {a: 12.99, b: 14.3, kind: 'david', z: 'wide', logo: 'b'},                                 // Ahora mismo ese beneficio
  {a: 14.3, b: 18.37, kind: 'motion', m: 'A', logo: 'b'},                                   // puede descontar hasta $50.000…
  {a: 18.37, b: 21.64, kind: 'motion', m: 'B', logo: 'b'},                                  // el próximo 3 de noviembre se votará la enmienda número 3
  {a: 21.64, b: 22.74, kind: 'david', z: 'punch', logo: 'b'},                               // ¿Y qué quiere cambiar?
  {a: 22.74, b: 29.41, kind: 'motion', m: 'C', logo: 'b'},                                  // $150.000 en 2027, $250.000 en 2028
  {a: 29.41, b: 30.44, kind: 'david', z: 'wide', logo: 'b'},                                // Imagínate la diferencia.
  {a: 30.44, b: 31.2, kind: 'david', z: 'punch', logo: 'b'},                                // Pero atención:
  {a: 31.2, b: 34.44, kind: 'stock', src: 'dinero6', from: 0.3, logo: 'b'},                 // no significa que el gobierno te va a regalar $250.000
  {a: 34.44, b: 38.97, kind: 'motion', m: 'D', logo: 'b'},                                  // impuestos sobre una parte mucho menor del valor de tu casa
  {a: 38.97, b: 41.45, kind: 'david', z: 'wide', logo: 'b'},                                // Eso sí, no todos los impuestos desaparecerían
  {a: 41.45, b: 44.44, kind: 'stock', src: 'profesor', from: 0.5, logo: 'n'},   // los que ayudan a financiar las escuelas…
  {a: 44.44, b: 45.6, kind: 'david', z: 'punch', logo: 'b'},                                // Y hay otro detalle:
  {a: 45.6, b: 48.35, kind: 'stock', src: 'palmeras', from: 2.0, logo: 'n'},                // si las ciudades y los condados recaudan menos dinero
  {a: 48.35, b: 51.03, kind: 'stock', src: 'aerea', from: 4.0, logo: 'n'},       // también podrían haberse afectado sus presupuestos
  {a: 51.03, b: 53.31, kind: 'david', z: 'wide', logo: 'b'},                                // Por eso es importante conocer bien esta propuesta.
  {a: 53.31, b: 56.77, kind: 'david', z: 'punch', logo: 'b'},                               // Ahora dime, ¿tú sabías…?
  {a: 56.77, b: 59.34, kind: 'david', z: 'wide', logo: 'b'},                                // Soy David Carballo, Realtor con Home Prime Realty
  {a: 59.34, b: 62.27, kind: 'david', z: 'punch', logo: 'b'},                               // Sígueme para aprender…
  {a: 62.27, b: 64.4, kind: 'stock', src: 'cartel', from: 1.0, logo: 'n'},      // si estás pensando en comprar o vender una casa
  {a: 64.4, b: 65.87, kind: 'david', z: 'wide', logo: 'b'},                                 // escríbeme: estoy aquí para ayudarte
];
export const clipAt = (t: number) => CLIPS.find((c) => t >= c.a && t < c.b) ?? CLIPS[CLIPS.length - 1];
// transición en cada corte: zoom-blur entre dos planos de David, whip en los cambios de bloque
export const CUTS: [number, 'whip' | 'zoom'][] = CLIPS.slice(1).map((c, i) => [c.a, c.kind === 'david' && CLIPS[i].kind === 'david' ? 'zoom' : 'whip']);
const LEAKS = [21.64, 38.97, 56.77]; // light leak cálido al entrar a "qué quiere cambiar", a "eso sí" y a la firma

// ---------- David: fuente y cara ----------
const segAt = (t: number) => SEGS.find((s) => t >= s.t0 && t < s.t1) ?? SEGS[SEGS.length - 1];
const srcTime = (t: number) => { const s = segAt(t); return {toma: s.toma, st: s.in + (t - s.t0)}; };
const faceAt = (toma: number, st: number) => { const F = FACES[toma]; return F.f[Math.max(0, Math.min(F.f.length - 1, Math.round((st - F.off) * FPS)))]; };
// escala: wide = zoom lento 1,00→1,06; punch = 1,36→1,42 (fuente 1080: no pasar de ~1,45). Anclado a los ojos.
export const davidState = (t: number) => {
  const c = clipAt(t);
  if (c.kind !== 'david') return null;
  const [z0, z1] = c.z === 'wide' ? [1.0, 1.06] : [1.36, 1.42];
  const s = interpolate(t, [c.a, c.b], [z0, z1], clamp);
  const {toma, st} = srcTime(t);
  const fc = faceAt(toma, st);
  return {s, fc, toma, st, y: (y: number) => fc.ey + (y - fc.ey) * s};
};
// tope del pelo en pantalla: medido en la máscara (rotoscopia) o estimado desde la cara (frente − 0,5·ancho; cara chica, el pelo sube)
const ROTO = [
  {a: 0.06, b: 4.08, toma: 1, src: 'fg1', start: 0.5, hair: HAIR1},
  {a: 10.45, b: 12.95, toma: 1, src: 'fg2', start: 11.4, hair: HAIR2},
];
const hairY = (t: number) => {
  const st = davidState(t);
  if (!st) return null;
  for (const r of ROTO) if (t >= r.a - 0.5 && t < r.b + 0.5 && st.toma === r.toma) {
    const i = Math.round((st.st - r.start) * FPS);
    if (i >= 0 && i < r.hair.length) return st.y(r.hair[i]);
  }
  return st.y(st.fc.top - 0.5 * st.fc.w);
};

const davidPieces = (c: Clip) =>
  SEGS.filter((s) => s.t1 > c.a && s.t0 < c.b).map((s) => ({a: Math.max(c.a, s.t0), b: Math.min(c.b, s.t1), seg: s})).filter((p) => fr(p.b) - fr(p.a) > 0);

const David: React.FC<{a: number; seg: (typeof SEGS)[number]}> = ({a, seg}) => {
  const f = useCurrentFrame();
  const st = davidState(a + f / FPS)!;
  return (
    <AbsoluteFill style={{transform: `scale(${st.s})`, transformOrigin: `${st.fc.ex}px ${st.fc.ey}px`}}>
      <OffthreadVideo src={staticFile(`dc1310/t${seg.toma}.mp4`)} startFrom={fr(seg.in + (a - seg.t0))} muted />
    </AbsoluteFill>
  );
};
const Stock: React.FC<{c: Clip}> = ({c}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, fr(c.b) - fr(c.a)], [1.0, 1.06], clamp);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`}}>
      <OffthreadVideo src={staticFile(`dc1310/${c.src}.mp4`)} startFrom={fr(c.from!)} muted />
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

// contador que rueda de v0 a v1 entre t0 y t1 (tiempo absoluto), con punto de miles
const money = (v: number) => '$' + Math.round(v / 1000).toLocaleString('de-DE') + '.000';
const roll = (t: number, t0: number, t1: number, v0: number, v1: number) => interpolate(t, [t0, t1], [v0, v1], {...clamp, easing: Easing.out(Easing.cubic)});

// A · el valor de tu casa: el Homestead descuenta hasta $50.000 del valor que se usa para calcular impuestos
const MotionA: React.FC<{a: number}> = ({a}) => {
  const pop = usePop(a);
  const f = useCurrentFrame();
  const t = f / FPS + a;
  const c = pop(a + 0.04, 12), lab = pop(14.98), rest = pop(17.51);
  const cut = interpolate(t, [14.98, 15.5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const drop = interpolate(t, [15.64, 16.1], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const BW = 560, CUTW = 150;
  return (
    <AbsoluteFill>
      <BrandBG />
      <div style={card(200, 430, 680, 700, c)}>
        <div style={{...abs(0, 40, 680, 130), ...center}}><House size={128} /></div>
        <div style={{...abs(0, 186, 680, 40), ...center}}><T w={800} size={32} color={CREMA} track={0.12}>VALOR DE TU CASA</T></div>
        {/* barra del valor: la parte dorada es lo que descuenta el Homestead */}
        <div style={{...abs(60, 250, BW - CUTW, 90), borderRadius: '16px 0 0 16px', background: 'rgba(255,243,201,0.55)'}} />
        <div style={{...abs(60 + BW - CUTW, 250, CUTW, 90), borderRadius: '0 16px 16px 0', transform: `translate(${drop * 10}px, ${drop * 120}px) rotate(${drop * 6}deg)`,
          background: cut > 0 ? 'linear-gradient(180deg, #F0E5C5 0%, #D2B759 100%)' : 'rgba(255,243,201,0.55)', boxShadow: cut > 0 ? `0 0 ${30 * cut}px rgba(210,183,89,0.6)` : 'none'}} />
        <div style={{...abs(60 + BW - CUTW - 3, 236, 6, 118), background: GOLD_BLOCK, opacity: cut, transform: `scaleY(${cut})`}} />
        <div style={{...abs(330, 400 + drop * 70, 330, 150), ...center, opacity: lab.o, transform: `scale(${lab.s})`}}>
          <T size={40} color={CREMA}>hasta</T><T w={900} size={92} gold>−$50.000</T>
        </div>
        <div style={{...abs(30, 380, 330, 160), ...center, opacity: rest.o, transform: `translateY(${rest.y}px)`}}>
          <T size={36} color={CREMA}>impuestos sobre</T><T w={800} size={52}>el resto</T>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// B · hoja de calendario del 3 de noviembre + "se votará la ENMIENDA 3"
const MotionB: React.FC<{a: number}> = ({a}) => {
  const pop = usePop(a);
  const f = useCurrentFrame();
  const t = f / FPS + a;
  const cal = pop(a + 0.03, 12), day = pop(19.13, 10), vota = pop(19.91), enm = pop(20.44), tres = pop(21.32, 9);
  const flip = interpolate(t, [19.0, 19.35], [90, 0], {...clamp, easing: Easing.out(Easing.back(1.4))});
  const rot = interpolate(f, [0, 12], [-8, -3], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <BrandBG />
      <div style={{...abs(330, 400, 420, 450), opacity: cal.o, transform: `translateY(${cal.y * 3}px) rotate(${rot}deg)`, perspective: 900}}>
        <div style={{...abs(0, 0, 420, 450), background: '#FBF8F0', borderRadius: 22, boxShadow: '0 30px 60px rgba(5,8,14,0.55)', overflow: 'hidden'}}>
          <div style={{...abs(0, 0, 420, 96), background: NAVY, ...center}}><T w={800} size={38} color={CREMA} track={0.14}>NOVIEMBRE</T></div>
          <div style={{...abs(0, 96, 420, 354), ...center, transform: `rotateX(${flip}deg)`, transformOrigin: '50% 0%'}}>
            <T w={900} size={260} color={NAVY} track={-0.04}>3</T>
          </div>
          {/* círculo dorado alrededor del 3, como marcado a mano */}
          <svg style={{...abs(60, 130, 300, 300), opacity: day.o}} viewBox="0 0 100 100" fill="none" stroke={GOLD_BLOCK} strokeWidth={4} strokeLinecap="round">
            <path d="M50 8 C78 8 92 28 90 52 C88 78 66 92 46 90 C22 88 8 70 10 48 C12 26 30 10 56 12" strokeDasharray={300} strokeDashoffset={300 * (1 - interpolate(t, [19.13, 19.6], [0, 1], clamp))} />
          </svg>
        </div>
        {[90, 330].map((x) => <div key={x} style={{...abs(x - 10, -22, 20, 52), borderRadius: 10, background: '#BFC5CF', boxShadow: '0 4px 8px rgba(0,0,0,0.4)'}} />)}
      </div>
      <div style={{...abs(180, 900, 720, 70), ...center, opacity: vota.o, transform: `translateY(${vota.y * 0.5}px)`}}><T size={58}>se votará la</T></div>
      <div style={{...abs(180, 975, 720, 140), ...center, flexDirection: 'row', gap: 26, opacity: enm.o, transform: `scale(${enm.s})`}}>
        <T w={900} size={112}>ENMIENDA</T>
        <div style={{width: 128, height: 128, borderRadius: 24, background: NAVY, border: `4px solid ${GOLD_BLOCK}`, ...center, opacity: tres.o, transform: `scale(${tres.on ? tres.s : 0.6})`}}>
          <T w={900} size={104} gold>3</T>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// C · el descuento crece: hoy $50.000 → 2027 $150.000 → 2028 $250.000
const MotionC: React.FC<{a: number}> = ({a}) => {
  const pop = usePop(a);
  const f = useCurrentFrame();
  const t = f / FPS + a;
  const head = pop(a + 0.03), b0 = pop(22.88), y27 = pop(25.75), y28 = pop(28.63), dis = pop(24.33);
  const v27 = roll(t, 24.33, 25.4, 50000, 150000), v28 = roll(t, 27.14, 28.3, 150000, 250000);
  const BASE = 1000, MAXH = 440, k = MAXH / 250000;
  const COLS = [
    {x: 270, v: 50000, show: b0, year: 'HOY', yp: b0, gold: false, start: 22.88},
    {x: 540, v: t >= 24.33 ? v27 : 0, show: pop(24.01), year: '2027', yp: y27, gold: true, start: 24.01},
    {x: 810, v: t >= 27.14 ? v28 : 0, show: pop(26.8), year: '2028', yp: y28, gold: true, start: 26.8},
  ];
  return (
    <AbsoluteFill>
      <BrandBG />
      <div style={{...abs(180, 340, 720, 130), ...center, opacity: head.o, transform: `translateY(${head.y}px)`}}>
        <T size={48} color={CREMA}>el descuento del</T><T w={900} size={84}>HOMESTEAD</T>
      </div>
      <div style={{...abs(150, BASE, 780, 4), background: 'rgba(255,243,201,0.35)', borderRadius: 2}} />
      {COLS.map((c, i) => {
        const h = Math.max(c.v * k, c.show.on ? 14 : 0);
        return (
          <React.Fragment key={i}>
            <div style={{...abs(c.x - 75, BASE - h, 150, h), opacity: c.show.o, borderRadius: '16px 16px 4px 4px',
              background: c.gold ? 'linear-gradient(180deg, #F0E5C5 0%, #D2B759 100%)' : 'rgba(255,243,201,0.55)', boxShadow: c.gold ? '0 0 30px rgba(210,183,89,0.45)' : 'none'}} />
            <div style={{...abs(c.x - 130, BASE - h - 78, 260, 70), ...center, opacity: c.v > 0 ? c.show.o : 0}}>
              <T w={900} size={c.gold ? 58 : 50} gold={c.gold}>{money(c.v)}</T>
            </div>
            <div style={{...abs(c.x - 100, BASE + 14, 200, 50), ...center, opacity: c.yp.o, transform: `scale(${c.yp.s})`}}>
              <T w={800} size={42} color={c.gold ? CREMA : 'rgba(255,255,255,0.85)'} track={0.04}>{c.year}</T>
            </div>
          </React.Fragment>
        );
      })}
      <Disclaimer y={1090} o={dis.o} />
    </AbsoluteFill>
  );
};

// D · pagas impuestos sobre una parte mucho menor del valor de tu casa
const MotionD: React.FC<{a: number}> = ({a}) => {
  const pop = usePop(a);
  const f = useCurrentFrame();
  const t = f / FPS + a;
  const head = pop(a + 0.03), bar = pop(a + 0.25, 12), menor = pop(37.35, 10), lbl = pop(35.94);
  const ex = interpolate(t, [36.74, 37.85], [0.14, 0.62], {...clamp, easing: Easing.inOut(Easing.cubic)}); // parte exenta
  const BW = 640, X = 220, Y = 700, H = 120;
  const tx = BW * ex;
  return (
    <AbsoluteFill>
      <BrandBG />
      <div style={{...abs(180, 400, 720, 220), ...center, opacity: head.o, transform: `translateY(${head.y}px)`}}>
        <House size={110} />
        <T w={800} size={34} color={CREMA} track={0.12} style={{marginTop: 18}}>VALOR DE TU CASA</T>
      </div>
      <div style={{...abs(X, Y, BW, H), opacity: bar.o, transform: `scaleX(${0.6 + 0.4 * bar.o})`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(5,8,14,0.45)'}}>
        <div style={{...abs(0, 0, tx, H), background: 'repeating-linear-gradient(135deg, rgba(210,183,89,0.85) 0px, rgba(210,183,89,0.85) 14px, rgba(240,229,197,0.85) 14px, rgba(240,229,197,0.85) 28px)'}} />
        <div style={{...abs(tx, 0, BW - tx, H), background: '#FBF8F0', ...center}}>
          <T w={900} size={Math.min(40, (BW - tx - 24) / 5.6)} color={NAVY} track={-0.02}>{t >= 35.94 ? 'IMPUESTOS' : ''}</T>
        </div>
        <div style={{...abs(tx - 3, 0, 6, H), background: NAVY}} />
      </div>
      <div style={{...abs(X, Y + H + 18, Math.max(160, tx), 60), ...center, opacity: bar.o}}>
        <T w={800} size={34} color={CREMA} track={0.06}>EXENTO</T>
      </div>
      {/* llave que marca la parte que paga impuestos */}
      <div style={{...abs(X + tx, Y + H + 18, BW - tx, 26), opacity: lbl.o, borderLeft: `4px solid ${GOLD_BLOCK}`, borderRight: `4px solid ${GOLD_BLOCK}`, borderBottom: `4px solid ${GOLD_BLOCK}`, borderRadius: '0 0 12px 12px', boxSizing: 'border-box'}} />
      <div style={{...abs(180, 900, 720, 170), ...center, opacity: menor.o, transform: `scale(${menor.s})`}}>
        <T size={52}>una parte</T><T w={900} size={112} gold>MUCHO MENOR</T>
      </div>
      <Disclaimer y={1100} o={head.o} />
    </AbsoluteFill>
  );
};

// ---------- tarjeta de David (firma: "Soy David Carballo, Realtor con Home Prime Realty") ----------
const BusinessCard: React.FC<{a: number}> = ({a}) => {
  const f = useCurrentFrame(); // local desde a
  const k = interpolate(f, [0, 12], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.3))});
  const lineAt = fr(58.34 - a);
  const line = interpolate(f, [lineAt, lineAt + 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const out = interpolate(f, [fr(59.34 - a) - 6, fr(59.34 - a) - 1], [1, 0], clamp);
  const CW = 680, CH = 360;
  return (
    <div style={{position: 'absolute', left: 540 - CW / 2, top: 1060, width: CW, height: CH, borderRadius: 30,
      background: 'linear-gradient(135deg, #2F3D56 0%, #263142 50%, #1C2230 100%)', border: '2px solid rgba(223,200,127,0.65)',
      boxShadow: '0 40px 90px rgba(0,0,0,0.6)', boxSizing: 'border-box', padding: '30px 40px', fontFamily: 'OSO', color: '#fff',
      transform: `translateY(${(1 - k) * 380}px) rotate(${(1 - k) * 6}deg)`, opacity: Math.min(1, k * 1.5) * out, overflow: 'hidden'}}>
      <div style={{position: 'absolute', right: -120, top: -160, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(223,200,127,0.25), rgba(223,200,127,0) 65%)'}} />
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <Img src={staticFile('dc1310/logo_blanco.png')} style={{height: 84}} />
        <div style={{fontWeight: 500, fontSize: 24, letterSpacing: '0.22em', color: '#DFC87F', marginTop: 8}}>REALTOR®</div>
      </div>
      <div style={{fontWeight: 900, fontSize: 64, letterSpacing: '-0.05em', lineHeight: 1, marginTop: 26}}>DAVID CARBALLO</div>
      <div style={{height: 3, width: 600 * line, background: GOLD_BLOCK, marginTop: 20, borderRadius: 2}} />
      <div style={{fontWeight: 800, fontSize: 40, letterSpacing: '-0.04em', marginTop: 14, color: 'transparent', backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', opacity: line, display: 'inline-block', paddingTop: '0.1em'}}>
        Home Prime Realty · Tampa, FL
      </div>
    </div>
  );
};
const CARD = {a: 56.83, b: 59.34};

const MOTION = {A: MotionA, B: MotionB, C: MotionC, D: MotionD};

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
      <OffthreadVideo src={staticFile(`dc1310/${r.src}.mov`)} startFrom={fr(srcTime(r.a).st - r.start)} muted transparent />
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
  {a: 0, b: 4.08, pos: 'head', lines: [
    {at: 0.06, parts: [P('¿Sabías que podrías pagar', 500, 54)]},
    {at: 0.98, parts: [P('MUCHO MENOS', 900, 140, true)]},
    {at: 1.48, parts: [P('dinero en impuestos?', 500, 62)]}]},
  {a: 6.62, b: 8.16, pos: 'top', lines: [
    {at: 6.62, parts: [P('tienes que pagar', 500, 60)]},
    {at: 6.98, parts: [P('IMPUESTOS', 900, 150, true)]},
    {at: 7.51, parts: [P('por esa ', 500, 58), P('propiedad', 800, 70)]}]},
  {a: 10.45, b: 12.95, pos: 'head', lines: [
    {at: 10.45, parts: [P('un beneficio llamado', 500, 56)]},
    {at: 10.86, parts: [P('HOMESTEAD', 900, 146, true)]},
    {at: 11.38, parts: [P('EXEMPTION', 800, 96)]}]},
  {a: 21.72, b: 22.72, pos: 'head', lines: [
    {at: 21.72, parts: [P('¿y qué quiere', 500, 62)]},
    {at: 22.29, parts: [P('CAMBIAR?', 900, 132, true)]}]},
  {a: 29.47, b: 30.42, pos: 'head', lines: [
    {at: 29.47, parts: [P('imagínate la', 500, 62)]},
    {at: 29.89, parts: [P('DIFERENCIA', 900, 124, true)]}]},
  {a: 31.22, b: 34.42, pos: 'top', lines: [
    {at: 31.22, parts: [P('NO', 900, 170)]},
    {at: 32.39, parts: [P('te va a regalar', 500, 60)]},
    {at: 32.97, parts: [P('$250.000', 900, 140, true)]}]},
  {a: 39.5, b: 41.43, pos: 'head', lines: [
    {at: 39.5, parts: [P('no todos los impuestos', 500, 54)]},
    {at: 40.41, parts: [P('DESAPARECERÍAN', 900, 110, true)]}]},
  {a: 42.58, b: 44.42, pos: 'top', lines: [
    {at: 42.58, parts: [P('las', 500, 60)]},
    {at: 42.72, parts: [P('ESCUELAS', 900, 150, true)]},
    {at: 43.44, parts: [P('seguirían existiendo', 500, 56)]}]},
  {a: 44.52, b: 45.58, pos: 'head', lines: [
    {at: 44.52, parts: [P('y hay otro', 500, 62)]},
    {at: 44.9, parts: [P('DETALLE', 900, 132, true)]}]},
  {a: 53.95, b: 55.55, pos: 'head', lines: [
    {at: 53.95, parts: [P('¿', 900, 120), P('TÚ', 900, 140, true)]},
    {at: 54.13, parts: [P('sabías que existía', 500, 54)]},
    {at: 54.88, parts: [P('este ', 500, 62), P('BENEFICIO?', 800, 80)]}]},
  {a: 59.36, b: 62.25, pos: 'head', lines: [
    {at: 59.36, parts: [P('SÍGUEME', 900, 140, true)]},
    {at: 59.72, parts: [P('para aprender', 500, 58)]},
    {at: 60.4, parts: [P('bienes raíces', 800, 72)]}]},
  {a: 64.24, b: 65.87, pos: 'head', lines: [
    {at: 64.24, parts: [P('ESCRÍBEME', 900, 140, true)]},
    {at: 65.0, parts: [P('estoy aquí para ayudarte', 500, 50)]}]},
];
// tramos donde el gráfico ya dice lo que se escucha: sin subtítulo
const HIDE: [number, number][] = [...TITLES.map((t): [number, number] => [t.a, t.b]), [CARD.a, CARD.b]];
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
  const nextA = idx + 1 < SUBS.length ? fr(SUBS[idx + 1][0] - 0.04) : DC1310_FRAMES;
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
  let cx = 540;
  if (c.kind === 'motion') top = MOTION_SUB_TOP;
  else if (c.kind === 'stock') top = (c.subY ?? 960) - h / 2;
  else {
    // corrección del usuario (13-10): con David en cuadro el subtítulo va DEBAJO DE ÉL — pegado al mentón y centrado en su cara
    // (los ojos quedan fijos en pantalla con el zoom anclado), sin salirse de x 70–900
    let chin = 0, sx = 0, n = 0;
    for (let f = a; f < b; f++) { const st = davidState(f / FPS); if (st) { chin = Math.max(chin, st.y(st.fc.bot)); sx += st.fc.ex; n++; } }
    top = Math.min(chin + 20, 1440 - h);
    const bw = width * k;
    if (n) cx = Math.max(70 + bw / 2, Math.min(900 - bw / 2, sx / n));
  }
  const pop = interpolate(frame - a, [0, 4], [0.9, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  return (
    <div style={{position: 'absolute', left: cx - W / 2, width: W, top, textAlign: 'center', lineHeight: 1.15,
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
  return <Img src={staticFile(c.logo === 'b' ? 'dc1310/logo_blanco.png' : 'dc1310/logo_negro.png')} style={{position: 'absolute', left: 735, top: 75, width: 240}} />;
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

export const DC1310: React.FC = () => {
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
      {ready && <Subtitles />}
      {ready && TITLES.filter((t) => t.pos !== 'roto').map((ti, i) => <TitleView key={i} ti={ti} />)}
      <Sequence from={fr(CARD.a)} durationInFrames={fr(CARD.b) - fr(CARD.a)}><BusinessCard a={CARD.a} /></Sequence>
      <Logo />
      {PROPS.voz && <Audio src={staticFile('dc1310/voz.wav')} />}
      {PROPS.guides && <Guides />}
    </AbsoluteFill>
  );
};
