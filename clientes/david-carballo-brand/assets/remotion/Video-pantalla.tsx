// DC 06-10 "Busca a tu realtor antes de man" — plantilla de reel con GRABACIÓN DE PANTALLA en ventana sobre fondo de marca (cámara virtual, resaltados, tarjeta de David). Aprobado 2026-10-20. FACE sale de track_cara.swift (edicion-reels-base); clips en public/dc0610/.
// Corte entregado por el usuario (EXPORT). Tramo de pantalla rearmado con la grabación original en alta,
// dentro de una ventana sobre fondo de la paleta de David, con cámara virtual y resaltados.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing, delayRender, continueRender, getInputProps} from 'remotion';
import {FACE} from './data';

export const DC0610_FRAMES = 559;
const FPS = 25;
const W = 1080;
const MAXW = 720; // centrado en x=540 → x 180–900
const NAVY = '#263142';
const CARBON = '#232529';
const GOLD_BLOCK = '#D2B759';
const GOLD_GRAD = 'linear-gradient(180deg, #D7BC68 0%, #DFC87F 30%, #F0E5C5 78%, #FFF3C9 100%)';
const GUIDES = !!getInputProps().guides;

const fr = (t: number) => Math.round(t * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);

// ---------- escenas ----------
type Kind = 'seat' | 'docs' | 'screen' | 'selfie';
const SCENES: [number, number, Kind][] = [
  [0, 0.86, 'seat'], [0.86, 2.7, 'docs'], [2.7, 3.52, 'seat'], [3.52, 18.0, 'screen'], [18.0, 19.64, 'selfie'], [19.64, 22.36, 'seat'],
];
const sceneAt = (t: number): Kind => (SCENES.find(([a, b]) => t >= a && t < b) ?? SCENES[SCENES.length - 1])[2];
// zoom continuo anclado a los ojos (planos de David)
const ZOOM: [number, number, number, number][] = [
  [0, 0.86, 1.0, 1.05], [2.7, 3.52, 1.1, 1.14], [18.0, 19.64, 1.0, 1.04], [19.64, 22.36, 1.04, 1.12],
];
const CUTS: [number, 'whip' | 'zoom'][] = [[0.86, 'zoom'], [2.7, 'zoom'], [3.52, 'whip'], [18.0, 'whip'], [19.64, 'whip']];

// ---------- pantalla (coordenadas de la grabación 1320×2868) ----------
const SRC_W = 1320, SRC_H = 2868;
const WIN = {x: 180, y: 290, w: 720, h: 900};
// [t, cx, cy, ancho visible]
const CAM: [number, number, number, number][] = [
  [3.52, 660, 1500, 1320], [4.3, 580, 1790, 1000], [5.62, 560, 1816, 880],
  [5.64, 660, 1500, 1320], [6.1, 660, 1274, 1320], [6.8, 660, 1274, 1320],
  [6.84, 660, 900, 1320], [7.52, 660, 900, 1320], [7.9, 450, 860, 900], [8.95, 450, 860, 900], [9.3, 660, 825, 1320], [9.9, 660, 825, 1320],
  [10.15, 1010, 855, 620], [10.6, 1010, 855, 620], [10.8, 560, 855, 720], [11.9, 560, 855, 720],
  [12.15, 490, 684, 840], [13.4, 490, 684, 840], [13.6, 660, 825, 1320], [15.0, 660, 825, 1320],
  [15.3, 700, 855, 820], [18.0, 700, 855, 820],
];
const HARD = [5.64, 6.84]; // cambios de plano dentro de la ventana: la cámara salta
const camAt = (t: number) => {
  let i = 0;
  while (i < CAM.length - 1 && CAM[i + 1][0] <= t) i++;
  const a = CAM[i], b = CAM[Math.min(i + 1, CAM.length - 1)];
  const crossesHard = HARD.some((h) => h > a[0] && h <= b[0] && b[0] - a[0] < 0.05);
  const p = b[0] === a[0] || crossesHard ? 0 : ease(Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0]))));
  let [cx, cy, w] = [a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p, a[3] + (b[3] - a[3]) * p];
  const h = (w * WIN.h) / WIN.w;
  cx = Math.max(w / 2, Math.min(SRC_W - w / 2, cx));
  cy = Math.max(h / 2, Math.min(SRC_H - h / 2, cy));
  return {cx, cy, w, s: WIN.w / w};
};
// resaltados: [desde, hasta, x0, y0, x1, y1] en la grabación
const MARKS: [number, number, number, number, number, number, string][] = [
  [6.1, 6.8, 112, 1170, 1208, 1378, '#FFFFFF'], // VERIFY A LICENSE
  [7.62, 9.0, 40, 800, 880, 918, GOLD_BLOCK], // campo License Number
  [10.16, 10.66, 1030, 818, 1192, 892, GOLD_BLOCK], // Current, Active
  [10.71, 11.9, 412, 822, 616, 884, GOLD_BLOCK], // CARBALLO, DAVID (al tocar el nombre muestra la compañía)
  [12.11, 13.44, 88, 658, 886, 708, GOLD_BLOCK], // complaints or discipline
  [15.3, 16.05, 822, 818, 966, 900, GOLD_BLOCK], // SL3630377
];

// ---------- textos ----------
type Part = {t: string; w: 500 | 800; size: number; gold?: boolean};
type Line = {parts: Part[]; at?: number};
type Title = {a: number; b: number; pos: 'below' | 'window'; lines: Line[]};
const TITLES: Title[] = [
  {a: 2.7, b: 3.52, pos: 'below', lines: [
    {parts: [{t: 'búscalo', w: 500, size: 90}]},
    {parts: [{t: 'AQUÍ', w: 800, size: 170, gold: true}]}]},
  {a: 13.5, b: 15.02, pos: 'window', lines: [
    {parts: [{t: 'es PÚBLICO', w: 500, size: 96}]},
    {at: 14.16, parts: [{t: 'y ', w: 500, size: 110}, {t: 'GRATIS', w: 800, size: 160, gold: true}]}]},
  {a: 20.43, b: 21.57, pos: 'below', lines: [
    {parts: [{t: 'antes de la', w: 500, size: 80}]},
    {at: 20.79, parts: [{t: 'PRIMERA', w: 800, size: 150, gold: true}]},
    {at: 21.07, parts: [{t: 'reunión', w: 500, size: 84}]}]},
];
// [inicio de la primera palabra, texto] — '' oculta; **x** = ExtraBold
const SUBS: [number, string][] = [
  [0.06, 'Antes de **enviar**'], [0.66, 'tus **W-2**'], [1.03, 'y tus **estados**'], [1.6, 'de **cuenta**'], [2.1, 'a un **REALTOR,**'], [2.7, ''],
  [3.6, 'Entra en'], [4.06, '**myfloridalicense.com**'], [5.62, 'toca **Verify a License**'], [7.09, 'y escribe su **nombre**'],
  [8.1, 'o su **número**'], [8.64, 'de **licencia.**'],
  [9.24, 'Te dice si'], [9.66, 'la licencia'], [10.02, 'está **ACTIVA,**'], [10.71, 'con qué **compañía**'], [11.47, 'trabaja'],
  [12.05, 'y si tiene'], [12.47, '**acciones**'], [12.79, '**disciplinarias.**'], [13.5, ''],
  [15.02, 'cuando alguien'], [15.46, 'me **escribe,**'], [16.1, 'le mando mi **tarjeta**'],
  [17.12, 'con mi **número**'], [17.61, 'de **licencia.**'],
  [18.15, 'Aquí estoy **yo**'], [18.81, 'con **HOME PRIME** Realty'],
  [19.66, 'Haz esta **BÚSQUEDA**'], [20.43, ''], [21.61, 'con **cualquier** realtor.'],
];

// ---------- utilidades ----------
const face = (f: number) => FACE[Math.max(0, Math.min(FACE.length - 1, f))];
const zoomAt = (t: number) => {
  for (const [a, b, s0, s1] of ZOOM) if (t >= a && t < b) return s0 + (s1 - s0) * ((t - a) / (b - a));
  return 1;
};
const screenY = (f: number, y: number) => {
  const fc = face(f);
  return fc.ey + (y - fc.ey) * zoomAt(f / FPS);
};
const hairY = (f: number) => screenY(f, face(f).top - 0.3 * face(f).w);

let ctx: CanvasRenderingContext2D | null = null;
const measure = (txt: string, weight: number, size: number, track: number) => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  ctx!.font = `${weight} ${size}px OS`;
  (ctx as any).letterSpacing = `${track * size}px`;
  return ctx!.measureText(txt).width;
};

const transition = (frame: number) => {
  for (const [t, kind] of CUTS) {
    const d = frame - fr(t);
    if (d < -3 || d > 2) continue;
    const p = d < 0 ? (d + 4) / 3 : (3 - d) / 3;
    const e = Easing.in(Easing.quad)(Math.min(1, p));
    if (kind === 'whip') return {tx: (d < 0 ? -1 : 1) * 260 * e, hblur: 45 * e, scale: 1 + 0.5 * e, blur: 0};
    return {tx: 0, hblur: 0, scale: 1 + 0.3 * e, blur: 14 * e};
  }
  return {tx: 0, hblur: 0, scale: 1, blur: 0};
};

// ---------- fondo de marca ----------
const BrandBG: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 38%, #33415A 0%, ${NAVY} 45%, ${CARBON} 100%)`}}>
      <AbsoluteFill style={{opacity: 0.07, backgroundImage: 'repeating-linear-gradient(135deg, #DFC87F 0px, #DFC87F 2px, transparent 2px, transparent 46px)',
        backgroundPosition: `${t * 12}px 0px`}} />
      <div style={{position: 'absolute', left: 560 + 60 * Math.sin(t * 0.6), top: 120, width: 760, height: 760, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(223,200,127,0.22) 0%, rgba(223,200,127,0) 65%)'}} />
      <div style={{position: 'absolute', left: -260, top: 1250 + 40 * Math.cos(t * 0.5), width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(223,200,127,0.12) 0%, rgba(223,200,127,0) 65%)'}} />
    </AbsoluteFill>
  );
};

// ---------- gancho: documentos ----------
const Bar: React.FC<{w: number; h?: number; c?: string}> = ({w, h = 12, c = '#D9DDE3'}) => (
  <div style={{width: w, height: h, borderRadius: h / 2, background: c}} />
);
const W2Card: React.FC = () => (
  <div style={{width: 400, height: 520, background: '#FBFBF8', borderRadius: 18, padding: 26, boxSizing: 'border-box', fontFamily: 'OS', color: '#2A2F38',
    boxShadow: '0 30px 60px rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', gap: 14}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '3px solid #2A2F38', paddingBottom: 10}}>
      <div style={{fontWeight: 800, fontSize: 52, letterSpacing: '-0.05em', lineHeight: 1}}>W-2</div>
      <div style={{fontWeight: 500, fontSize: 17, textAlign: 'right', lineHeight: 1.15}}>Wage and Tax<br />Statement</div>
    </div>
    {[['Employer', 260], ['Employee', 220], ['1 Wages, tips', 150], ['2 Federal income tax', 120], ['16 State wages', 140]].map(([l, w], i) => (
      <div key={i} style={{border: '2px solid #C9CED6', borderRadius: 8, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6}}>
        <div style={{fontSize: 15, fontWeight: 500, color: '#6B7380'}}>{l}</div>
        <div style={{filter: 'blur(3px)'}}><Bar w={w as number} h={14} c="#8A93A0" /></div>
      </div>
    ))}
  </div>
);
const StatementCard: React.FC = () => (
  <div style={{width: 400, height: 520, background: '#FFFFFF', borderRadius: 18, overflow: 'hidden', fontFamily: 'OS', color: '#2A2F38',
    boxShadow: '0 30px 60px rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column'}}>
    <div style={{background: NAVY, padding: '22px 26px', color: '#fff'}}>
      <div style={{fontWeight: 800, fontSize: 34, letterSpacing: '-0.04em', lineHeight: 1}}>Estado de cuenta</div>
      <div style={{fontWeight: 500, fontSize: 17, opacity: 0.75, marginTop: 6}}>Cuenta •••• ••••</div>
    </div>
    <div style={{padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 17}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 17, fontWeight: 500, color: '#6B7380'}}>Saldo</div>
        <div style={{fontSize: 34, fontWeight: 800, filter: 'blur(7px)'}}>$ 00,000</div>
      </div>
      {[180, 140, 200, 120, 160, 150].map((w, i) => (
        <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E6E8EC', paddingTop: 14}}>
          <Bar w={w} h={12} />
          <div style={{filter: 'blur(3px)'}}><Bar w={70} h={14} c="#8A93A0" /></div>
        </div>
      ))}
    </div>
  </div>
);
const DocsScene: React.FC = () => {
  const f = useCurrentFrame(); // local desde 0.86 s
  const pop = (start: number) => interpolate(f, [start, start + 8], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  const a = pop(0), b = pop(fr(1.34 - 0.86));
  const toward = interpolate(f, [fr(2.1 - 0.86), fr(2.1 - 0.86) + 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const badge = interpolate(f, [fr(2.1 - 0.86), fr(2.1 - 0.86) + 9], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.8))});
  const drift = f * 0.6;
  return (
    <AbsoluteFill>
      <BrandBG />
      {/* bloque centrado: insignia (arriba) + documentos + subtítulo a 1230 */}
      <div style={{position: 'absolute', left: 540 - 95, top: 330, width: 190, height: 190, borderRadius: '50%', background: NAVY,
        border: `6px solid ${GOLD_BLOCK}`, boxShadow: '0 20px 40px rgba(0,0,0,0.45)', transform: `scale(${badge})`, opacity: badge,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <svg width="78" height="78" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.2" fill="#fff" /><path d="M3.5 21c0-4.4 3.8-7.2 8.5-7.2s8.5 2.8 8.5 7.2" fill="#fff" /></svg>
        <div style={{position: 'absolute', right: -6, top: -6, width: 62, height: 62, borderRadius: '50%', background: GOLD_BLOCK, color: NAVY,
          fontFamily: 'OS', fontWeight: 800, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>?</div>
      </div>
      <div style={{position: 'absolute', left: 240 - 200, top: 600, width: 400, height: 520,
        transform: `translate(${200 + toward * 30}px, ${40 * (1 - a) - toward * 30 - drift}px) rotate(${-7 + 2 * toward}deg) scale(${(0.6 + 0.4 * a) * (1 - 0.08 * toward)})`, opacity: a}}>
        <W2Card />
      </div>
      <div style={{position: 'absolute', left: 450, top: 640, width: 400, height: 520,
        transform: `translate(${-toward * 30}px, ${40 * (1 - b) - toward * 30 - drift * 0.7}px) rotate(${6 - 2 * toward}deg) scale(${(0.6 + 0.4 * b) * (1 - 0.08 * toward)})`, opacity: b}}>
        <StatementCard />
      </div>
    </AbsoluteFill>
  );
};

// ---------- pantalla ----------
const Mark: React.FC<{m: (typeof MARKS)[number]; t: number; cam: ReturnType<typeof camAt>}> = ({m, t, cam}) => {
  const [a, b, x0, y0, x1, y1, color] = m;
  if (t < a - 0.01 || t > b) return null;
  const k = interpolate(t, [a, a + 0.24], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.7))});
  const out = interpolate(t, [b - 0.12, b], [1, 0], clamp);
  const pad = 10;
  const L = (x0 - cam.cx) * cam.s + WIN.w / 2 - pad, T = (y0 - cam.cy) * cam.s + WIN.h / 2 - pad;
  const Wd = (x1 - x0) * cam.s + 2 * pad, H = (y1 - y0) * cam.s + 2 * pad;
  const pulse = 1 + 0.02 * Math.sin(t * 9);
  return (
    <div style={{position: 'absolute', left: L, top: T, width: Wd, height: H, borderRadius: 14, border: `6px solid ${color}`,
      background: color === '#FFFFFF' ? 'rgba(255,255,255,0.08)' : 'rgba(210,183,89,0.14)',
      boxShadow: `0 0 0 4px rgba(38,49,66,0.35), 0 0 28px ${color}`, opacity: k * out, transform: `scale(${(0.85 + 0.15 * k) * pulse})`}} />
  );
};
const ScreenSource: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={fr(5.64) - fr(3.52)} layout="none"><OffthreadVideo src={staticFile('dc0610/s1.mp4')} muted style={{width: '100%', height: '100%'}} /></Sequence>
    <Sequence from={fr(5.64) - fr(3.52)} durationInFrames={fr(6.84) - fr(5.64)} layout="none"><OffthreadVideo src={staticFile('dc0610/s2.mp4')} muted style={{width: '100%', height: '100%'}} /></Sequence>
    {/* la grabación carga en blanco ~0,5 s: se pasa antes al formulario */}
    <Sequence from={fr(6.84) - fr(3.52)} durationInFrames={fr(7.52) - fr(6.84)} layout="none"><Img src={staticFile('dc0610/form.png')} style={{width: '100%', height: '100%'}} /></Sequence>
    <Sequence from={fr(7.52) - fr(3.52)} durationInFrames={fr(10.4) - fr(7.52)} layout="none"><OffthreadVideo src={staticFile('dc0610/s3r.mp4')} muted style={{width: '100%', height: '100%'}} /></Sequence>
    <Sequence from={fr(10.4) - fr(3.52)} layout="none"><Img src={staticFile('dc0610/results.png')} style={{width: '100%', height: '100%'}} /></Sequence>
  </>
);
const ScreenScene: React.FC = () => {
  const lf = useCurrentFrame(); // local desde 3.52 s
  const t = 3.52 + lf / FPS;
  const cam = camAt(t);
  const enter = interpolate(lf, [0, 10], [0.92, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  // golpe de zoom-blur dentro de la ventana en los cambios de página
  let wblur = 0, wscale = 1;
  for (const h of HARD) {
    const d = lf - (fr(h) - fr(3.52));
    if (d >= -2 && d <= 2) { const e = 1 - Math.abs(d) / 3; wblur = 10 * e; wscale = 1 + 0.12 * e; }
  }
  const dim = Math.max(
    interpolate(t, [13.45, 13.6, 14.95, 15.1], [0, 1, 1, 0], clamp),
    interpolate(t, [16.0, 16.2], [0, 1], clamp),
  );
  return (
    <AbsoluteFill>
      <BrandBG />
      <div style={{position: 'absolute', left: WIN.x - 5, top: WIN.y - 5, width: WIN.w + 10, height: WIN.h + 10, borderRadius: 46,
        background: GOLD_GRAD, boxShadow: '0 40px 90px rgba(0,0,0,0.55)', transform: `scale(${enter})`}}>
        <div style={{position: 'absolute', left: 5, top: 5, width: WIN.w, height: WIN.h, borderRadius: 41, overflow: 'hidden', background: '#fff'}}>
          <div style={{position: 'absolute', inset: 0, transform: `scale(${wscale})`, filter: wblur > 0.3 ? `blur(${wblur}px)` : undefined}}>
            <div style={{position: 'absolute', left: WIN.w / 2 - cam.cx * cam.s, top: WIN.h / 2 - cam.cy * cam.s, width: SRC_W * cam.s, height: SRC_H * cam.s}}>
              <ScreenSource />
            </div>
            {MARKS.map((m, i) => <Mark key={i} m={m} t={t} cam={cam} />)}
          </div>
          <AbsoluteFill style={{background: 'rgba(20,24,32,0.62)', opacity: dim}} />
        </div>
      </div>
      <Sequence from={fr(16.05) - fr(3.52)} layout="none"><BusinessCard /></Sequence>
    </AbsoluteFill>
  );
};

// ---------- tarjeta de David ----------
const BusinessCard: React.FC = () => {
  const f = useCurrentFrame(); // local desde 16.05
  const k = interpolate(f, [0, 12], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.3))});
  const num = interpolate(f, [fr(17.37 - 16.05), fr(17.37 - 16.05) + 6], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  const line = interpolate(f, [fr(17.37 - 16.05), fr(17.37 - 16.05) + 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const CW = 680, CH = 400;
  return (
    <div style={{position: 'absolute', left: 540 - CW / 2, top: 740 - CH / 2, width: CW, height: CH, borderRadius: 30,
      background: 'linear-gradient(135deg, #2F3D56 0%, #263142 50%, #1C2230 100%)', border: '2px solid rgba(223,200,127,0.65)',
      boxShadow: '0 40px 90px rgba(0,0,0,0.6)', boxSizing: 'border-box', padding: '34px 40px', fontFamily: 'OS', color: '#fff',
      transform: `translateY(${(1 - k) * 380}px) rotate(${(1 - k) * 6}deg)`, opacity: Math.min(1, k * 1.5), overflow: 'hidden'}}>
      <div style={{position: 'absolute', right: -120, top: -160, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(223,200,127,0.25), rgba(223,200,127,0) 65%)'}} />
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <Img src={staticFile('dc0610/logo.png')} style={{height: 92}} />
        <div style={{fontWeight: 500, fontSize: 24, letterSpacing: '0.22em', color: '#DFC87F', marginTop: 8}}>REALTOR®</div>
      </div>
      <div style={{fontWeight: 800, fontSize: 60, letterSpacing: '-0.05em', lineHeight: 1, marginTop: 28}}>DAVID CARBALLO</div>
      <div style={{fontWeight: 500, fontSize: 28, letterSpacing: '-0.02em', color: '#FFF3C9', opacity: 0.85, marginTop: 8}}>Home Prime Realty · Tampa, FL</div>
      <div style={{height: 3, width: 600 * line, background: GOLD_BLOCK, marginTop: 22, borderRadius: 2}} />
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 14}}>
        <div style={{fontWeight: 500, fontSize: 22, letterSpacing: '0.24em', opacity: 0.8}}>LICENCIA</div>
        <div style={{fontWeight: 800, fontSize: 58, letterSpacing: '-0.04em', lineHeight: 1.1, color: 'transparent', backgroundImage: GOLD_GRAD,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', paddingTop: '0.1em', transform: `scale(${1 + 0.1 * num * (1 - Math.min(1, Math.max(0, (f - fr(17.37 - 16.05) - 6) / 8)))})`,
          transformOrigin: 'left center', display: 'inline-block'}}>SL3630377</div>
      </div>
    </div>
  );
};

// ---------- capa de imagen ----------
const ImageLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fc = face(frame);
  const s = zoomAt(t);
  const tr = transition(frame);
  const kind = sceneAt(t);
  const filter = [tr.hblur > 0.5 ? 'url(#hblur)' : '', tr.blur > 0.3 ? `blur(${tr.blur}px)` : ''].join(' ').trim();
  return (
    <AbsoluteFill style={{transform: `translateX(${tr.tx}px) scale(${tr.scale})`, filter: filter || undefined}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="hblur" x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${tr.hblur} 0`} /></filter>
      </svg>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${fc.ex}px ${fc.ey}px`, opacity: kind === 'seat' || kind === 'selfie' ? 1 : 0}}>
        <OffthreadVideo src={staticFile('dc0610/base.mp4')} muted />
      </AbsoluteFill>
      <Sequence from={fr(0.86)} durationInFrames={fr(2.7) - fr(0.86)}><DocsScene /></Sequence>
      <Sequence from={fr(3.52)} durationInFrames={fr(18.0) - fr(3.52)}><ScreenScene /></Sequence>
    </AbsoluteFill>
  );
};

// ---------- subtítulos ----------
const parseSub = (txt: string) =>
  txt.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((p) => (p.startsWith('**') ? {t: p.slice(2, -2), w: 800} : {t: p, w: 500}));
const SUB_SIZE = 64;
const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS + 0.04;
  let idx = -1;
  for (let i = 0; i < SUBS.length; i++) if (SUBS[i][0] <= t) idx = i;
  if (idx < 0 || !SUBS[idx][1]) return null;
  const a = fr(Math.max(0, SUBS[idx][0] - 0.04));
  const b = idx + 1 < SUBS.length ? fr(SUBS[idx + 1][0] - 0.04) : DC0610_FRAMES;
  const parts = parseSub(SUBS[idx][1]);
  const width = parts.reduce((acc, p) => acc + measure(p.t, p.w, SUB_SIZE, -0.04), 0);
  const k = Math.min(1, MAXW / width);
  const h = SUB_SIZE * 1.15 * k;
  // plano que ocupa la mayor parte del bloque
  const count: Record<Kind, number> = {seat: 0, docs: 0, screen: 0, selfie: 0};
  for (let f = a; f < b; f++) count[sceneAt(f / FPS)]++;
  const kind = (Object.keys(count) as Kind[]).sort((x, y) => count[y] - count[x])[0];
  let top: number;
  if (kind === 'screen') top = WIN.y + WIN.h + 44;
  else if (kind === 'docs') top = 1222;
  else {
    let chin = 0, hair = 9999;
    for (let f = a; f < b; f++) { if (sceneAt(f / FPS) !== kind) continue; chin = Math.max(chin, screenY(f, face(f).bot)); hair = Math.min(hair, hairY(f)); }
    top = chin + 30;
    if (top + h > 1440) top = Math.max(270, hair - 26 - h); // la cara llega muy abajo (selfie): arriba de la cabeza
  }
  return (
    <div style={{position: 'absolute', left: 0, width: W, top, textAlign: 'center', lineHeight: 1.15,
      fontFamily: 'OS', fontSize: SUB_SIZE * k, letterSpacing: '-0.04em', color: '#fff', whiteSpace: 'nowrap',
      WebkitTextStroke: `${8 * k}px ${NAVY}`, paintOrder: 'stroke fill', textShadow: '0 4px 10px rgba(20,24,32,0.45)'}}>
      {parts.map((p, i) => <span key={i} style={{fontWeight: p.w}}>{p.t}</span>)}
    </div>
  );
};

// ---------- títulos ----------
const TitleView: React.FC<{ti: Title}> = ({ti}) => {
  const frame = useCurrentFrame();
  const a = fr(ti.a), b = fr(ti.b);
  if (frame < a || frame >= b) return null;
  const widths = ti.lines.map((l) => l.parts.reduce((acc, p) => acc + measure(p.t, p.w, p.size, -0.1), 0));
  const k = Math.min(1, MAXW / Math.max(...widths));
  const lh = ti.lines.map((l) => Math.max(...l.parts.map((p) => p.size)) * 0.9 * k);
  const H = lh.reduce((x, y) => x + y, 0);
  let top: number;
  if (ti.pos === 'window') top = WIN.y + WIN.h / 2 - H / 2;
  else {
    let chin = 0;
    for (let f = a; f < b; f++) chin = Math.max(chin, screenY(f, face(f).bot));
    top = Math.min(chin + 36, 1440 - H);
  }
  const out = interpolate(frame, [b - 4, b - 1], [1, 0], clamp);
  let y = top;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: out, transform: `translateY(${(1 - out) * -12}px)`}}>
      {ti.lines.map((l, i) => {
        const start = l.at !== undefined ? fr(l.at) : a + i * 3;
        const yy = y;
        y += lh[i];
        return <TitleLine key={i} line={l} k={k} top={yy} h={lh[i]} local={frame - start} width={widths[i] * k} />;
      })}
    </div>
  );
};
const TitleLine: React.FC<{line: Line; k: number; top: number; h: number; local: number; width: number}> = ({line, k, top, h, local, width}) => {
  if (local < 0) return null;
  const grow = interpolate(local, [0, 5], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const retract = interpolate(local, [5, 10], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const lift = interpolate(local, [0, 8], [14, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const x0 = 540 - width / 2 - 14, bw = width + 28;
  return (
    <div style={{position: 'absolute', left: 0, width: W, top, height: h}}>
      <div style={{position: 'absolute', left: 0, width: W, top: 0, height: h, display: 'flex', justifyContent: 'center', alignItems: 'center',
        clipPath: `inset(-40px ${W - (x0 + bw * grow)}px -40px 0px)`, transform: `translateY(${lift}px)`,
        filter: 'drop-shadow(0 5px 12px rgba(20,24,32,0.55))'}}>
        {line.parts.map((p, j) => (
          <span key={j} style={{fontFamily: 'OS', fontWeight: p.w, fontSize: p.size * k, letterSpacing: '-0.1em', lineHeight: 1,
            whiteSpace: 'pre', color: p.gold ? 'transparent' : '#fff', paddingRight: p.gold ? '0.1em' : 0,
            ...(p.gold ? {backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', paddingTop: '0.3em', marginTop: '-0.3em', paddingBottom: '0.15em', marginBottom: '-0.15em'} : {})}}>{p.t}</span>
        ))}
      </div>
      {retract < 1 && (
        <div style={{position: 'absolute', top: h * 0.08, height: h * 0.84, left: x0 + bw * retract, width: Math.max(0, bw * (grow - retract)), background: GOLD_BLOCK}} />
      )}
    </div>
  );
};

// ---------- guías ----------
const Guides: React.FC = () => {
  const frame = useCurrentFrame();
  const kind = sceneAt(frame / FPS);
  const fc = face(frame);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid rgba(0,255,0,.8)'}} />
      <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'rgba(0,255,255,.6)'}} />
      {(kind === 'seat' || kind === 'selfie') && (
        <div style={{position: 'absolute', left: 140, width: 800, top: hairY(frame), height: screenY(frame, fc.bot) - hairY(frame), background: 'rgba(255,0,0,.25)'}} />
      )}
    </AbsoluteFill>
  );
};

export const DC0610: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const fonts: [string, string, string][] = [
      ['OpenSans-Medium.ttf', '500', 'normal'], ['OpenSans-ExtraBold.ttf', '800', 'normal'], ['OpenSans-ExtraBoldItalic.ttf', '800', 'italic']];
    Promise.all(fonts.map(([f, w, s]) => new FontFace('OS', `url(${staticFile('fonts/' + f)})`, {weight: w, style: s}).load().then((x) => document.fonts.add(x))))
      .then(() => { setReady(true); continueRender(handle); });
  }, [handle]);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <ImageLayer />
      {ready && <Subtitles />}
      {ready && TITLES.map((ti, i) => <TitleView key={i} ti={ti} />)}
      {GUIDES && <Guides />}
    </AbsoluteFill>
  );
};
