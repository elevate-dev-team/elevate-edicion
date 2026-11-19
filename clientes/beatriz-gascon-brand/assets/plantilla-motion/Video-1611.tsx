import React from 'react';
// Plantilla de motion BGR (aprobada 16-11, 2026-11-19): Panel compacto, Chip, Sello giratorio, Trazo, Subs con cifras (2 = Inter ExtraBold), barrido.
// Lee data.json (build_data.py del reel); copiar y adaptar, no importar directo.
import {
  AbsoluteFill, Easing, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame,
} from 'remotion';
import data from './data.json';

// BGR 16-11 "La Enmienda 3 si tienes casa en renta" — ACABADO (el audio se mezcla aparte y se pega con ffmpeg)
export const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
export const BGR1611_FRAMES = f(data.dur);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const NAVY = '#062A3A', CELESTE = '#85D3ED', CREMA = '#F1DBA3', DORADO = '#D5A23C';
const IN = 'Inter', FR = 'Fraunces';
const w = (i: number) => (data.w as Record<string, number>)[String(i)];
const MOT = data.mot as unknown as Record<string, [number, number]>;
const TIT = data.tit as unknown as Record<string, [number, number]>;
const CHIN = data.chin as Record<string, number>;

const FONTS: [string, string, string, string][] = [
  [IN, 'Inter_24pt-Medium.ttf', '500', 'normal'], [IN, 'Inter_24pt-SemiBold.ttf', '600', 'normal'],
  [IN, 'Inter_24pt-Bold.ttf', '700', 'normal'], [IN, 'Inter_24pt-ExtraBold.ttf', '800', 'normal'],
  [FR, 'Fraunces_72pt_Soft-Bold.ttf', '700', 'normal'], [FR, 'Fraunces_72pt_Soft-SemiBoldItalic.ttf', '600', 'italic'],
  [FR, 'Fraunces_72pt_Soft-Black.ttf', '900', 'normal'], [FR, 'Fraunces_72pt_Soft-BlackItalic.ttf', '900', 'italic'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([fam, file, weight, style]) =>
  new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight, style}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

type Toma = [string, number, number, number, number[][]];
type Clip = [string, number, number, number, number];
type Tr = {t0: number; dt: number; ex: number[]; ey: number[]; top: number[]; bot: number[]};
const TOMAS = data.tomas as unknown as Toma[];
const BROLL = data.broll as unknown as Clip[];
const TR = data.track as unknown as Record<string, Tr>;

const zoomAt = (keys: number[][], t: number) => {
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, sa] = keys[i], [b, sb] = keys[i + 1];
    if (t >= a && t <= b && b > a) return sa + (sb - sa) * (0.5 - 0.5 * Math.cos(Math.PI * (t - a) / (b - a)));
  }
  return t >= keys[keys.length - 1][0] ? keys[keys.length - 1][1] : keys[0][1];
};
const ojosAt = (name: string, srcT: number) => {
  const tr = TR[name];
  const i = Math.max(0, Math.min(tr.ey.length - 1, Math.round((srcT - tr.t0) / tr.dt)));
  return [tr.ex[i], tr.ey[i]];
};

// ---------- transiciones ----------
// barrido lateral con desenfoque + destello crema en los cambios de bloque; zoom-blur suave al salir del B-roll
const V = TOMAS.map((t) => t[2]);
const WHIPS = [V[1], V[5], V[6], V[8]];
const ZBS = [BROLL[0][2], BROLL[1][2]];
export const CORTES = [...WHIPS, ...ZBS].sort((a, b) => a - b);
const HALF = 3.5;
const whipE = (t: number) => {
  for (const c of WHIPS) {
    const d = (t - c) * FPS;
    if (Math.abs(d) < HALF) return {e: 1 - Math.abs(d) / HALF, side: d < 0 ? -1 : 1};
  }
  return {e: 0, side: 0};
};
const zbE = (t: number) => {
  let e = 0;
  for (const c of ZBS) e = Math.max(e, 1 - Math.abs(t - c) * FPS / 3);
  return Math.max(0, e);
};

const Speaker: React.FC<{toma: Toma}> = ({toma}) => {
  const frame = useCurrentFrame();
  const [name, srcIn, a, , keys] = toma;
  const t = a + frame / FPS;
  const [ex, ey] = ojosAt(name, srcIn + frame / FPS);
  const e = zbE(t);
  const s = zoomAt(keys, t) * (1 + 0.22 * e);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${ex}px ${ey}px`, filter: e > 0 ? `blur(${10 * e}px)` : undefined}}>
      <OffthreadVideo src={staticFile(`bgr1611/${name}.mp4`)} startFrom={Math.round(srcIn * FPS)} muted style={{width: 1080, height: 1920}} />
    </AbsoluteFill>
  );
};

const Broll: React.FC<{clip: Clip}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [name, a, b, from, rate] = clip;
  const t = a + frame / FPS;
  const e = zbE(t);
  const s = (1.0 + 0.07 * Math.min(1, (t - a) / (b - a))) * (1 + 0.22 * e);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, filter: e > 0 ? `blur(${10 * e}px)` : undefined}}>
      <OffthreadVideo src={staticFile(`bgr1611/${name}.mp4`)} startFrom={Math.round(from * FPS)} playbackRate={rate} muted style={{width: 1080, height: 1920}} />
    </AbsoluteFill>
  );
};

// ---------- tipografía ----------
const SOMBRA = '0 4px 10px rgba(0,0,0,0.6), 0 2px 3px rgba(0,0,0,0.55), 0 0 26px rgba(0,0,0,0.35)';
const SOMBRA_F = 'drop-shadow(0 4px 10px rgba(0,0,0,0.55)) drop-shadow(0 0 24px rgba(6,42,58,0.5))';
const bajada = (size = 50): React.CSSProperties => ({fontFamily: IN, fontWeight: 600, fontSize: size, color: CELESTE, letterSpacing: '-0.02em',
  lineHeight: 1.05, textShadow: SOMBRA});
const golpe = (size = 130, italic = false): React.CSSProperties => ({fontFamily: FR, fontWeight: 900, fontStyle: italic ? 'italic' : 'normal', fontSize: size,
  color: CREMA, letterSpacing: '-0.03em', lineHeight: 0.86, filter: SOMBRA_F});

const useLine = (at: number, out: number, dy = 26) => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const p = interpolate(fr, [f(at), f(at) + 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const o = interpolate(t, [out - 0.17, out], [1, 0], clamp);
  return {opacity: t >= at - 0.001 && t < out ? p * o : 0, transform: `translateY(${(1 - p) * dy}px)`} as React.CSSProperties;
};
const Line: React.FC<{at: number; out: number; style?: React.CSSProperties; children: React.ReactNode}> = ({at, out, style, children}) => {
  const st = useLine(at, out);
  return <div style={{...st, textAlign: 'center', whiteSpace: 'nowrap', ...style}}>{children}</div>;
};
const Bloque: React.FC<{top?: number; bottom?: number; gap?: number; children: React.ReactNode}> = ({top, bottom, gap = 10, children}) => (
  <div style={{position: 'absolute', left: 0, width: 1080, ...(bottom !== undefined ? {bottom: 1920 - bottom} : {top}),
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>{children}</div>
);
const Trazo: React.FC<{at: number; out: number; width: number; dy?: number}> = ({at, out, width, dy = 0}) => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const k = interpolate(fr, [f(at), f(at) + 8], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const o = interpolate(t, [out - 0.17, out], [1, 0], clamp);
  if (t < at || t >= out) return null;
  const L = width * 1.08;
  return (
    <svg width={width + 30} height={40} viewBox={`0 0 ${width + 30} 40`} style={{display: 'block', margin: `${dy}px auto 0`, opacity: o, overflow: 'visible',
      filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))'}}>
      <path d={`M 12 24 C ${width * 0.3} 12, ${width * 0.65} 32, ${width + 18} 14`} fill="none" stroke={DORADO} strokeWidth={11}
        strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - k)} />
    </svg>
  );
};

const Titulos: React.FC = () => {
  const [ra, rb] = TIT.renta, [na, nb] = TIT.noaplica, [ca, cb] = TIT.cta;
  return (
    <>
      {/* "si tienes casa / en renta" + trazo, debajo del mentón (anclado abajo a la zona segura) */}
      <Bloque bottom={1436} gap={8}>
        <Line at={ra} out={rb} style={bajada(46)}>si tienes casa</Line>
        <Line at={w(17) - 0.04} out={rb} style={golpe(112, true)}>en renta</Line>
        <div style={{width: 1080, display: 'flex', justifyContent: 'center', paddingLeft: 40}}>
          <Trazo at={w(17) + 0.2} out={rb} width={330} dy={-8} />
        </div>
      </Bloque>
      {/* "en tu casa en renta / no aplica" */}
      <Bloque top={CHIN.noaplica + 26}>
        <Line at={na} out={nb} style={bajada(48)}>en tu casa en renta</Line>
        <Line at={w(90) - 0.04} out={nb} style={golpe(128, true)}>no aplica</Line>
      </Bloque>
      <CTA at={ca} out={cb} />
    </>
  );
};
const CTA: React.FC<{at: number; out: number}> = ({at, out}) => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const k = interpolate(fr, [f(at), f(at) + 4], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  if (t < at || t > out + 1) return null;
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: CHIN.cta + 26, display: 'flex', justifyContent: 'center'}}>
      <div style={{opacity: k, transform: `scale(${0.9 + 0.1 * k})`, background: CREMA, borderRadius: 999, padding: '16px 50px 18px',
        boxShadow: '0 10px 28px rgba(0,0,0,0.35)', fontFamily: IN, fontWeight: 800, fontSize: 60, color: NAVY, letterSpacing: '0.01em'}}>ESCRÍBEME</div>
    </div>
  );
};

// ---------- motion (sobre el torso, nunca sobre la cara) ----------
const useAt = (base: number) => {
  const fr = useCurrentFrame();
  const t = base + fr / FPS;
  return {
    t,
    pop: (at: number, dur = 8) => {
      const p = interpolate(t, [at, at + dur / FPS], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
      return {opacity: p, transform: `translateY(${(1 - p) * 24}px) scale(${0.94 + 0.06 * p})`} as React.CSSProperties;
    },
  };
};
const salida = (t: number, b: number) => interpolate(t, [b - 0.2, b], [1, 0], clamp);
const swap = (t: number, at: number) => interpolate(t, [at - 0.04, at + 0.16], [0, 1], clamp);
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

// sello giratorio ENMIENDA 3 + "no es solo para / quien vive en su casa"
const Sello: React.FC = () => {
  const [a, b] = MOT.sello;
  const {t, pop} = useAt(a);
  const k = interpolate(t, [a + 0.03, a + 0.3], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.8))});
  const o = salida(t, b);
  const R = 92;
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: CHIN.sello + 24, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, opacity: o}}>
      <div style={{width: 2 * R + 8, height: 2 * R + 8, position: 'relative', transform: `scale(${0.4 + 0.6 * k}) rotate(${(1 - k) * -25}deg)`, opacity: Math.min(1, k * 2),
        filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.45))'}}>
        <svg width={2 * R + 8} height={2 * R + 8} viewBox={`${-R - 4} ${-R - 4} ${2 * R + 8} ${2 * R + 8}`}>
          <circle r={R} fill={NAVY} fillOpacity={0.92} stroke={CREMA} strokeWidth={4} />
          <circle r={R - 34} fill="none" stroke={DORADO} strokeWidth={2.5} />
          <defs><path id="arc" d={`M ${-(R - 18)} 0 A ${R - 18} ${R - 18} 0 1 1 ${R - 18} 0 A ${R - 18} ${R - 18} 0 1 1 ${-(R - 18)} 0`} /></defs>
          <g transform={`rotate(${t * 40})`}>
            <text fontFamily={IN} fontWeight={800} fontSize={19} letterSpacing={4.2} fill={CELESTE}>
              <textPath href="#arc">ENMIENDA · FLORIDA · ENMIENDA · FLORIDA ·</textPath>
            </text>
          </g>
          <text y={30} textAnchor="middle" fontFamily={FR} fontWeight={900} fontSize={92} fill={CREMA}>3</text>
        </svg>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4}}>
        <div style={{...pop(w(3) - 0.04), ...bajada(46), whiteSpace: 'nowrap'}}>no es solo para</div>
        <div style={{...pop(w(7) - 0.04), fontFamily: FR, fontWeight: 600, fontStyle: 'italic', fontSize: 60, color: CREMA, letterSpacing: '-0.02em',
          lineHeight: 1.0, filter: SOMBRA_F, whiteSpace: 'nowrap'}}>quien vive en</div>
        <div style={{...pop(w(10) - 0.04), fontFamily: FR, fontWeight: 600, fontStyle: 'italic', fontSize: 60, color: CREMA, letterSpacing: '-0.02em',
          lineHeight: 1.0, filter: SOMBRA_F, whiteSpace: 'nowrap'}}>su casa</div>
      </div>
    </div>
  );
};

// panel compacto: rótulo + chip a la derecha, barra, cifra grande
const Panel: React.FC<{top: number; o: number; rotulo: React.ReactNode; chip: React.ReactNode; fill: number; fillColor?: string; ghost?: number;
  cifra: React.ReactNode; nota: React.ReactNode; enter: React.CSSProperties}> = ({top, o, rotulo, chip, fill, fillColor, ghost = 0, cifra, nota, enter}) => (
  <div style={{position: 'absolute', left: 180, width: 720, top, opacity: o, ...enter}}>
    <div style={{borderRadius: 28, background: 'rgba(6,42,58,0.80)', border: '2px solid rgba(133,211,237,0.35)', backdropFilter: 'blur(10px)',
      boxShadow: '0 16px 34px rgba(0,0,0,0.35)', padding: '16px 28px 14px', boxSizing: 'border-box'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 40}}>
        <div style={{fontFamily: IN, fontWeight: 800, fontSize: 28, letterSpacing: '0.05em', color: CELESTE, whiteSpace: 'nowrap', position: 'relative', height: 30, flex: 1}}>{rotulo}</div>
        {chip}
      </div>
      <div style={{position: 'relative', height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.14)', marginTop: 10}}>
        {ghost > 0 && <div style={{position: 'absolute', left: 0, top: 0, height: 16, width: `${ghost * 100}%`, borderRadius: 8, border: '2px dashed rgba(241,219,163,0.55)', boxSizing: 'border-box'}} />}
        <div style={{position: 'absolute', left: 0, top: 0, height: 16, width: `${fill * 100}%`, borderRadius: 8,
          background: fillColor ?? `linear-gradient(90deg, ${CREMA}, ${DORADO})`, boxShadow: fill > 0 ? '0 0 16px rgba(213,162,60,0.5)' : 'none'}} />
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8, height: 64}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>{cifra}</div>
        <div style={{fontFamily: IN, fontWeight: 500, fontSize: 30, color: 'rgba(255,255,255,0.88)', textAlign: 'right', lineHeight: 1.1, paddingBottom: 8}}>{nota}</div>
      </div>
    </div>
  </div>
);
const Chip: React.FC<{children: React.ReactNode; k: number}> = ({children, k}) => (
  <div style={{background: CREMA, color: NAVY, fontFamily: IN, fontWeight: 800, fontSize: 28, borderRadius: 999, padding: '4px 18px', opacity: k,
    transform: `scale(${0.85 + 0.15 * k})`, whiteSpace: 'nowrap'}}>{children}</div>
);
const Cruz: React.FC<{a: string; b: string; k: number}> = ({a, b, k}) => (
  <>
    <span style={{position: 'absolute', left: 0, opacity: 1 - k}}>{a}</span>
    <span style={{position: 'absolute', left: 0, opacity: k}}>{b}</span>
  </>
);

const Home: React.FC = () => {
  const [a, b] = MOT.home;
  const {t, pop} = useAt(a);
  const e1 = interpolate(t, [w(53) - 0.04, w(56)], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const e2 = interpolate(t, [w(73) - 0.04, w(76)], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const val = 150000 * e1 + 100000 * e2;
  const y28 = swap(t, w(65));
  return (
    <Panel top={CHIN.panel_home} o={salida(t, b)} enter={pop(a, 9)}
      rotulo={<Cruz a="HOMESTEAD · TU CASA" b="SIN IMPUESTO NO ESCOLAR" k={swap(t, w(44))} />}
      chip={<div style={{position: 'relative'}}><Chip k={1 - y28}>DESDE 2027</Chip><div style={{position: 'absolute', right: 0, top: 0}}><Chip k={y28}>DESDE 2028</Chip></div></div>}
      fill={0.6 * e1 + 0.4 * e2}
      cifra={<div style={{...pop(w(53) - 0.04), display: 'flex', alignItems: 'baseline', gap: 12}}>
        <span style={{fontFamily: IN, fontWeight: 600, fontSize: 34, color: CELESTE}}>USD</span>
        <span style={{fontFamily: FR, fontWeight: 700, fontSize: 66, color: DORADO, letterSpacing: '-0.02em', lineHeight: 1}}>{fmt(val)}</span>
      </div>}
      nota={<div style={pop(w(57) - 0.04)}>del valor de<br />tu propiedad</div>} />
  );
};

const Tope: React.FC = () => {
  const [a, b] = MOT.tope;
  const {t, pop} = useAt(a);
  const e1 = interpolate(t, [w(119) - 0.04, w(121) + 0.1], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const e2 = interpolate(t, [w(141) - 0.04, w(143) + 0.1], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const pct = 10 * e1 - 5 * e2;
  const k27 = swap(t, w(127));
  return (
    <Panel top={CHIN.panel_tope} o={salida(t, b)} enter={pop(a, 9)}
      rotulo={<Cruz a="SUBA DEL VALOR · POR AÑO" b="TOPE DE SUBA · POR AÑO" k={swap(t, w(135))} />}
      chip={<div style={{position: 'relative', opacity: interpolate(t, [w(100) - 0.04, w(100) + 0.2], [0, 1], clamp)}}>
        <Chip k={1 - k27}>HASTA HOY</Chip><div style={{position: 'absolute', right: 0, top: 0}}><Chip k={k27}>DESDE 2027</Chip></div></div>}
      fill={pct / 10} ghost={e2 > 0 ? 1 : 0}
      fillColor={e2 > 0.5 ? `linear-gradient(90deg, ${CELESTE}, #CDEFFA)` : undefined}
      cifra={<div style={{...pop(w(119) - 0.04), display: 'flex', alignItems: 'baseline', gap: 10}}>
        <span style={{fontFamily: IN, fontWeight: 600, fontSize: 34, color: CELESTE}}>hasta</span>
        <span style={{fontFamily: FR, fontWeight: 700, fontSize: 66, color: e2 > 0.5 ? CREMA : DORADO, letterSpacing: '-0.02em', lineHeight: 1}}>{Math.round(pct)} %</span>
      </div>}
      nota={<div style={{...pop(w(116) - 0.04), position: 'relative', width: 280, height: 60}}>
        <div style={{position: 'absolute', right: 0, bottom: 0, opacity: 1 - swap(t, w(132))}}>cada año<br />en estas casas</div>
        <div style={{position: 'absolute', right: 0, bottom: 0, opacity: swap(t, w(132))}}>con la<br />Enmienda 3</div>
      </div>} />
  );
};

const MOTS: [string, React.FC][] = [['sello', Sello], ['home', Home], ['tope', Tope]];

// ---------- subtítulos ----------
type Sub = {start: number; end: number; y: number; modo: string; words: [string, number][]};
const Subs: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const b = (data.subs as unknown as Sub[]).find((s) => t >= s.start && t < s.end);
  if (!b) return null;
  const p = interpolate(frame - f(b.start), [0, 3], [0, 1], clamp);
  const y = b.modo === 'cta' ? CHIN.cta + 26 + 120 : b.y;
  const SH = b.modo === 'centro' ? `${SOMBRA}, 0 0 18px rgba(6,42,58,0.9), 0 0 40px rgba(6,42,58,0.7)` : SOMBRA;
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: y, textAlign: 'center', whiteSpace: 'nowrap', opacity: p, transform: `translateY(${(1 - p) * 12}px)`}}>
      {b.words.map(([wd, key], i) => (
        <span key={i} style={key === 1
          ? {fontFamily: FR, fontWeight: 600, fontStyle: 'italic', fontSize: 74, color: CREMA, textShadow: SH, letterSpacing: '-0.02em'}
          : {fontFamily: IN, fontWeight: key === 2 ? 800 : 600, fontSize: 64, color: 'white', textShadow: SH, letterSpacing: '-0.02em'}}>
          {(i ? ' ' : '') + (key === 2 ? wd : wd.toLowerCase())}
        </span>
      ))}
    </div>
  );
};

const Imagen: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const {e, side} = whipE(t);
  const ee = Easing.in(Easing.quad)(e);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{position: 'absolute'}}><filter id="mb"><feGaussianBlur stdDeviation={`${60 * ee} 0`} /></filter></svg>
      <AbsoluteFill style={{transform: `translateX(${side * 300 * ee}px) scale(${1 + 0.6 * ee})`, filter: ee > 0.01 ? 'url(#mb)' : undefined}}>
        {TOMAS.map((tm, i) => (
          <Sequence key={i} from={f(tm[2])} durationInFrames={f(tm[3]) - f(tm[2])}><Speaker toma={tm} /></Sequence>
        ))}
        {BROLL.map((c) => (
          <Sequence key={c[0]} from={f(c[1])} durationInFrames={f(c[2]) - f(c[1])}><Broll clip={c} /></Sequence>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: 0.25 * e, background: `radial-gradient(80% 60% at ${50 - side * 20}% 45%, ${CREMA} 0%, rgba(241,219,163,0) 100%)`}} />
    </AbsoluteFill>
  );
};

export const BGR1611: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{backgroundColor: NAVY}}>
    <Imagen />
    {MOTS.map(([k, C]) => (
      <Sequence key={k} from={f(MOT[k][0])} durationInFrames={f(MOT[k][1]) - f(MOT[k][0])}><C /></Sequence>
    ))}
    <Titulos />
    <Subs />
    {guias && <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid lime', boxSizing: 'border-box'}} />}
  </AbsoluteFill>
);
