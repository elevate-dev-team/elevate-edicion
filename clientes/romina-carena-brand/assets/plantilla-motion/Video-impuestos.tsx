import React from 'react';
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring,
  staticFile, useCurrentFrame, Easing,
} from 'remotion';
import data from './data.json';
import subs from './subs.json';

// ROC 21-11 "Florida baja los impuestos de tu casa" — reel orgánico a cámara (selfie en el auto) + motion
export const FPS = 30;
export const ROC2111_FRAMES = data.total;

const SALVIA = '#397B69', MENTA = '#94D0C0', PIEDRA = '#D2CFC8', BOSQUE = '#002E20';
const OS = 'Open Sauce One', BS = 'Birthstone';
const SOMBRA = 'drop-shadow(0 2px 5px rgba(0,0,0,0.6)) drop-shadow(0 6px 22px rgba(0,0,0,0.55))';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- fuentes ----------
const FONTS: [string, string, string, string][] = [
  [OS, 'OpenSauceOne-Medium.ttf', '500', 'normal'], [OS, 'OpenSauceOne-ExtraBoldItalic.ttf', '800', 'italic'],
  [OS, 'OpenSauceOne-Black.ttf', '900', 'normal'], [OS, 'OpenSauceOne-BlackItalic.ttf', '900', 'italic'],
  [BS, 'Birthstone-Regular.ttf', '400', 'normal'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([fam, file, weight, style]) =>
  new FontFace(fam, `url(${staticFile('roc2111/fonts/' + file)})`, {weight, style}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

// ---------- planos ----------
type Clip = [string, number, number, number, string, number, number];
const CLIPS = data.clips as unknown as Clip[];
const EYES = data.eyes as unknown as Record<string, [number, number]>;
const CHIN = data.chin as unknown as Record<string, number>;
// v2: los frames se escriben en la línea de tiempo v1 y se pasan a la v2 con la tabla remap (silencios recortados)
const REMAP = (data as unknown as {remap: number[]}).remap;
const R = (f: number) => REMAP[f];
const LEAKS = [172, 655, 1085, 1328].map(R);
const CORTES = [35, 88, 192, 241, 259, 325, 435, 812, 896, 930, 1228, 1290].map(R);
const transE = (fr: number) => {
  let e = 0;
  for (const c of CORTES) e = Math.max(e, 1 - Math.abs(fr - c + 0.5) / 3.5);
  return Math.max(0, e);
};

const Plano: React.FC<{clip: Clip}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [name, a, b, srcIn, kind, s0, s1] = clip;
  const fr = a + frame;
  const e = transE(fr);
  const isCam = /^[0-9A-F]{8}$/.test(name);
  const src = `roc2111/${isCam ? 'v' + name : name}.mp4`;
  if (kind === 'card') {
    // fondo del motion: su propio plano desenfocado y teñido de verde (ella sigue "presente")
    return (
      <AbsoluteFill style={{filter: e > 0.05 ? `blur(${16 * e}px)` : undefined}}>
        <AbsoluteFill style={{transform: `scale(${1.15 * (1 + 0.25 * e)})`, filter: 'blur(28px) saturate(0.8)'}}>
          <OffthreadVideo src={staticFile(src)} startFrom={Math.round(srcIn * FPS)} muted />
        </AbsoluteFill>
        <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 70% at 50% 45%, rgba(28,110,80,0.72), rgba(0,46,32,0.9) 100%)`}} />
      </AbsoluteFill>
    );
  }
  let transform: string, origin: string;
  if (kind === 'cam') {
    const [ex, ey] = EYES[String(fr)] ?? [540, 880];
    const s = interpolate(frame, [0, b - a - 1], [s0, s1], clamp) * (1 + 0.25 * e);
    transform = `scale(${s})`; origin = `${ex}px ${ey}px`;
  } else {
    const z = interpolate(frame, [0, b - a], kind === 'placa' ? [1.0, 1.04] : [1.03, 1.1]) * (1 + 0.25 * e);
    transform = `scale(${z})`; origin = '540px 960px';
  }
  return (
    <AbsoluteFill style={{transform, transformOrigin: origin, filter: e > 0.05 ? `blur(${16 * e}px)` : undefined}}>
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(srcIn * FPS)} muted playbackRate={kind === 'placa' ? 0.7 : 1} />
      {kind === 'broll' && <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 32% at 50% 50%, rgba(0,0,0,0.45), rgba(0,0,0,0) 100%)'}} />}
      {kind === 'placa' && <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,46,32,0.5) 100%)'}} />}
    </AbsoluteFill>
  );
};

const LightLeak: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      {LEAKS.map((c) => {
        const k = interpolate(fr, [c - 13, c, c + 14], [0, 1, 0], clamp);
        if (k <= 0) return null;
        const p = (fr - c + 13) / 27;
        return (
          <AbsoluteFill key={c} style={{mixBlendMode: 'screen', opacity: k}}>
            <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 55% at ${10 + 80 * p}% ${30 + 25 * p}%, rgba(255,150,60,0.95), rgba(255,90,60,0.55) 45%, rgba(0,0,0,0) 75%)`}} />
            <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 45% at ${90 - 70 * p}% ${75 - 30 * p}%, rgba(255,120,170,0.8), rgba(0,0,0,0) 70%)`}} />
            <AbsoluteFill style={{backgroundColor: `rgba(255,220,180,${0.35 * k})`}} />
          </AbsoluteFill>
        );
      })}
    </>
  );
};

// ---------- utilidades de animación ----------
const useIO = (dur: number, inF = 7, outF = 4) => {
  const fr = useCurrentFrame();
  const sp = spring({frame: fr, fps: FPS, config: {damping: 13, stiffness: 170}});
  const o = Math.min(outF, Math.max(1, dur - 4));
  const op = interpolate(fr, [0, 3, Math.max(4, dur - o), Math.max(5, dur)], [0, 1, 1, 0], clamp);
  return {fr, sp, op, sc: interpolate(sp, [0, 1], [0.82, 1]), blur: Math.max(0, interpolate(fr, [0, inF], [8, 0], clamp))};
};
const pop = (fr: number, d: number, damping = 12) => spring({frame: Math.max(0, fr - d), fps: FPS, config: {damping, stiffness: 180}}) * (fr >= d ? 1 : 0);
const grad: React.CSSProperties = {
  background: `linear-gradient(180deg, #FFFFFF 25%, ${PIEDRA} 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
  paddingTop: '0.3em', marginTop: '-0.3em', paddingBottom: '0.1em', marginBottom: '-0.1em',
};
const fuerte: React.CSSProperties = {color: SALVIA, WebkitTextStroke: '8px white', paintOrder: 'stroke fill'};

// bloque de título; y = centro (o borde de abajo con bottom / de arriba con top)
const Bloque: React.FC<{y: number; dur: number; anchor?: 'top' | 'mid' | 'bottom'; children: React.ReactNode}> = ({y, dur, anchor = 'mid', children}) => {
  const {op, sc, blur} = useIO(dur);
  const ty = anchor === 'top' ? 0 : anchor === 'bottom' ? -100 : -50;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 180, width: 720, top: y, transform: `translateY(${ty}%) scale(${sc})`,
        transformOrigin: anchor === 'top' ? '50% 0%' : anchor === 'bottom' ? '50% 100%' : '50% 50%', opacity: op,
        filter: `${SOMBRA}${blur > 0.05 ? ` blur(${blur}px)` : ''}`, textAlign: 'center', fontFamily: OS, color: 'white', letterSpacing: '-0.02em'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
const Tarde: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 13, stiffness: 170}});
  return <div style={{opacity: fr < 0 ? 0 : Math.min(1, sp * 1.4), transform: `translateY(${interpolate(sp, [0, 1], [24, 0])}px)`}}>{children}</div>;
};
const salida = (fr: number, dur: number, n = 5) => interpolate(fr, [0, 3, dur - n, dur], [0, 1, 1, 0], clamp);

// ---------- íconos de línea ----------
const ICON: Record<string, string> = {
  cal: 'M8 12h32v28H8z M8 20h32 M16 8v8 M32 8v8',
  check: 'M12 25l8 8 16-18',
  casa: 'M5 23L24 8l19 15 M10 19v22h28V19 M20 41V29h8v12',
};
const Icono: React.FC<{k: string; size: number; draw?: number; stroke?: string; w?: number}> = ({k, size, draw = 1, stroke = 'white', w = 3}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{display: 'block'}}>
    <path d={ICON[k]} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
  </svg>
);

// ---------- títulos ----------
// hook: arriba de la cabeza (debajo del mentón no entra)
const Hook: React.FC<{dur: number; t0: number}> = ({dur, t0}) => {
  const fr = useCurrentFrame();
  const d = R(133) - t0;
  return (
    <Bloque y={580} anchor="bottom" dur={dur}>
      <div style={{fontFamily: BS, fontSize: 82, lineHeight: 0.7}}>esta noticia</div>
      <div style={{fontWeight: 900, fontSize: 104, lineHeight: 0.92, ...grad}}>TE INTERESA</div>
      <Tarde d={d}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 14, padding: '10px 22px 10px 16px', borderRadius: 18,
          background: 'rgba(57,123,105,0.88)', border: '3px solid white'}}>
          <Icono k="cal" size={44} draw={interpolate(fr - d, [0, 12], [0, 1], clamp)} />
          <span style={{fontWeight: 900, fontStyle: 'italic', fontSize: 34, whiteSpace: 'nowrap'}}>FECHA LÍMITE: 31 DE DICIEMBRE</span>
        </div>
      </Tarde>
    </Bloque>
  );
};

// placa: "FLORIDA APROBÓ / ENMIENDA 3" + sello APROBADA
const Enmienda: React.FC<{dur: number; t0: number}> = ({dur, t0}) => {
  const fr = useCurrentFrame();
  const op = salida(fr, dur);
  const sp1 = pop(fr, 0), sp3 = pop(fr, R(231) - t0 - 2, 9), sello = pop(fr, R(216) - t0 + 6, 10);
  return (
    <AbsoluteFill style={{opacity: op, fontFamily: OS, color: 'white', textAlign: 'center', letterSpacing: '-0.02em', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.35))'}}>
      <div style={{position: 'absolute', left: 180, width: 720, top: 560, opacity: sp1, transform: `translateY(${interpolate(sp1, [0, 1], [30, 0])}px)`}}>
        <div style={{fontWeight: 500, fontSize: 52}}>Florida aprobó la</div>
      </div>
      <div style={{position: 'absolute', left: 180, width: 720, top: 640, transform: `scale(${interpolate(sp1, [0, 1], [0.8, 1])})`, opacity: sp1}}>
        <div style={{fontWeight: 900, fontSize: 132, lineHeight: 1, ...grad}}>ENMIENDA</div>
        <span style={{display: 'inline-block', fontWeight: 900, fontSize: 340, lineHeight: 0.8, marginTop: 10, color: MENTA, WebkitTextStroke: '6px white', paintOrder: 'stroke fill',
          transform: `scale(${interpolate(sp3, [0, 1], [2.2, 1])})`, opacity: Math.min(1, sp3 * 2)}}>3</span>
      </div>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 1110, display: 'flex', justifyContent: 'center', opacity: Math.min(1, sello * 2)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 34px 14px 22px', border: '6px solid white', borderRadius: 22,
          background: SALVIA, transform: `rotate(-6deg) scale(${interpolate(sello, [0, 1], [1.8, 1])})`}}>
          <Icono k="check" size={70} w={5} draw={interpolate(fr - (R(216) - t0 + 6), [2, 12], [0, 1], clamp)} />
          <span style={{fontWeight: 900, fontStyle: 'italic', fontSize: 76}}>APROBADA</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// placa: barras del descuento $50K → $150K (2027) → $250K (2028)
const BARRAS: {v: number; año: string; t: number; ty: number}[] = [
  {v: 50, año: 'HOY', t: R(440), ty: R(440)},
  {v: 150, año: '2027', t: R(489), ty: R(530)},
  {v: 250, año: '2028', t: R(569), ty: R(630)},
];
const Cifras: React.FC<{dur: number; t0: number}> = ({dur, t0}) => {
  const fr = useCurrentFrame();
  const op = salida(fr, dur, 6);
  const h = useIO(dur);
  const BASE = 1230, MAXH = 520, COLW = 190, GAP = 50;
  const x0 = 540 - (3 * COLW + 2 * GAP) / 2;
  return (
    <AbsoluteFill style={{opacity: op, fontFamily: OS, color: 'white', letterSpacing: '-0.02em', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.35))'}}>
      <div style={{position: 'absolute', left: 180, width: 720, top: 345, textAlign: 'center', transform: `scale(${h.sc})`, opacity: h.sp}}>
        <div style={{fontWeight: 500, fontSize: 46, lineHeight: 1}}>el descuento de tu</div>
        <div style={{fontWeight: 900, fontStyle: 'italic', fontSize: 64, lineHeight: 1.05, color: MENTA}}>RESIDENCIA PRINCIPAL</div>
        <div style={{fontFamily: BS, fontSize: 78, lineHeight: 0.8}}>sube</div>
      </div>
      {/* línea base */}
      <div style={{position: 'absolute', left: x0 - 20, top: BASE, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.85)',
        width: interpolate(fr, [2, 14], [0, 3 * COLW + 2 * GAP + 40], {...clamp, easing: Easing.out(Easing.cubic)})}} />
      {BARRAS.map((b, i) => {
        const d = b.t - t0;
        const g = spring({frame: Math.max(0, fr - d), fps: FPS, config: {damping: 15, stiffness: 120}}) * (fr >= d ? 1 : 0);
        const hh = (b.v / 250) * MAXH * g;
        const val = Math.round(b.v * Math.min(1, g));
        const ya = pop(fr, b.ty - t0);
        const last = i === 2;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: x0 + i * (COLW + GAP), width: COLW, top: BASE - hh, height: hh, borderRadius: '18px 18px 0 0',
              background: last ? `linear-gradient(180deg, ${MENTA}, ${SALVIA})` : `linear-gradient(180deg, ${SALVIA}, #2a5c4e)`,
              border: hh > 4 ? '4px solid white' : 'none', borderBottom: 'none', boxSizing: 'border-box'}} />
            <div style={{position: 'absolute', left: x0 + i * (COLW + GAP) - 30, width: COLW + 60, top: BASE - hh - 86, textAlign: 'center',
              opacity: Math.min(1, g * 3), fontWeight: 900, fontSize: 70, lineHeight: 1}}>
              <span style={grad}>${val}K</span>
            </div>
            <div style={{position: 'absolute', left: x0 + i * (COLW + GAP), width: COLW, top: BASE + 18, textAlign: 'center',
              opacity: ya, transform: `translateY(${interpolate(ya, [0, 1], [16, 0])}px)`,
              fontWeight: i === 0 ? 500 : 900, fontSize: 46, color: last ? MENTA : 'white'}}>{b.año}</div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: 180, width: 720, top: 1335, textAlign: 'center', opacity: pop(fr, R(600) - t0)}}>
        <span style={{fontWeight: 500, fontSize: 38}}>pagás impuestos sobre <span style={{fontWeight: 900, fontStyle: 'italic'}}>mucho menos</span> del valor de tu casa</span>
      </div>
    </AbsoluteFill>
  );
};

// placa: calendario que llega al 31 de diciembre de 2026
const Calendario: React.FC<{dur: number; t0: number}> = ({dur, t0}) => {
  const fr = useCurrentFrame();
  const op = salida(fr, dur);
  const card = pop(fr, 0, 13);
  const n = Math.round(interpolate(fr, [R(827) - t0 - 6, R(827) - t0 + 8], [1, 31], {...clamp, easing: Easing.out(Easing.quad)}));
  const mes = pop(fr, R(845) - t0 - 1), año = pop(fr, R(867) - t0 - 1), sello = pop(fr, R(872) - t0, 10);
  const W = 460, H = 470;
  return (
    <AbsoluteFill style={{opacity: op, fontFamily: OS, color: 'white', letterSpacing: '-0.02em'}}>
      <div style={{position: 'absolute', left: 180, width: 720, top: 470, textAlign: 'center', opacity: card, filter: SOMBRA}}>
        <span style={{fontFamily: BS, fontSize: 92, lineHeight: 0.8}}>antes del</span>
      </div>
      <div style={{position: 'absolute', left: 540 - W / 2, top: 600, width: W, height: H, borderRadius: 34, overflow: 'hidden', background: '#F7F5F0',
        boxShadow: '0 20px 50px rgba(0,0,0,0.45)', transform: `translateY(${interpolate(card, [0, 1], [80, 0])}px) rotate(${interpolate(card, [0, 1], [-8, -2])}deg)`, opacity: card}}>
        <div style={{height: 120, background: SALVIA, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16}}>
          <span style={{fontWeight: 900, fontSize: 52, opacity: mes, transform: `translateY(${interpolate(mes, [0, 1], [20, 0])}px)`}}>DICIEMBRE</span>
          <span style={{fontWeight: 900, fontStyle: 'italic', fontSize: 52, color: MENTA, opacity: año}}>2026</span>
        </div>
        <div style={{position: 'absolute', left: 0, width: W, top: 140, textAlign: 'center', fontWeight: 900, fontSize: 280, lineHeight: 1, color: BOSQUE}}>{n}</div>
        {[0, 1, 2, 3, 4, 5, 6].map((k) => (
          <div key={k} style={{position: 'absolute', left: 40 + k * 56, top: 26, width: 18, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.35)', display: 'none'}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 1095, display: 'flex', justifyContent: 'center', opacity: Math.min(1, sello * 2)}}>
        <div style={{padding: '12px 30px', border: '5px solid white', borderRadius: 20, background: 'rgba(0,46,32,0.85)',
          transform: `rotate(4deg) scale(${interpolate(sello, [0, 1], [1.8, 1])})`, fontWeight: 900, fontStyle: 'italic', fontSize: 62, color: MENTA}}>FECHA LÍMITE</div>
      </div>
    </AbsoluteFill>
  );
};

// fondo de ella desenfocado: línea de tiempo vertical de 5 años
const Linea: React.FC<{dur: number; t0: number}> = ({dur, t0}) => {
  const fr = useCurrentFrame();
  const op = salida(fr, dur, 6);
  const h = useIO(dur);
  const X = 270, Y0 = 640, STEP = 165;
  const prog = interpolate(fr, [R(989) - t0, R(1030) - t0], [0, 4], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const chico = pop(fr, R(960) - t0), grande = pop(fr, R(1068) - t0, 10), linea = interpolate(fr, [4, 18], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: op, fontFamily: OS, color: 'white', letterSpacing: '-0.02em', filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.3))'}}>
      <div style={{position: 'absolute', left: 180, width: 720, top: 330, textAlign: 'center', transform: `scale(${h.sc})`, opacity: h.sp}}>
        <div style={{fontWeight: 900, fontSize: 84, lineHeight: 0.95}}>SI TE MUDÁS</div>
        <div style={{fontFamily: BS, fontSize: 84, lineHeight: 0.85}}>después</div>
      </div>
      {/* riel */}
      <div style={{position: 'absolute', left: X - 3, top: Y0, width: 6, height: 4 * STEP * linea, background: 'rgba(255,255,255,0.35)', borderRadius: 3}} />
      <div style={{position: 'absolute', left: X - 3, top: Y0, width: 6, height: STEP * prog, background: MENTA, borderRadius: 3}} />
      {[0, 1, 2, 3, 4].map((k) => {
        const on = prog >= k - 0.02 || k === 0;
        const ap = pop(fr, 6 + k * 3);
        const big = k === 4;
        return (
          <React.Fragment key={k}>
            <div style={{position: 'absolute', left: X - (big ? 26 : 18), top: Y0 + k * STEP - (big ? 26 : 18), width: big ? 52 : 36, height: big ? 52 : 36, borderRadius: 30,
              background: on ? (big && prog > 3.95 ? MENTA : 'white') : 'rgba(255,255,255,0.25)', border: '4px solid white', boxSizing: 'border-box',
              transform: `scale(${ap})`}} />
            <div style={{position: 'absolute', left: X + 50, top: Y0 + k * STEP - 30, fontWeight: big ? 900 : 500, fontSize: big ? 52 : 44,
              opacity: ap * (on ? 1 : 0.5), color: big && prog > 3.95 ? MENTA : 'white'}}>AÑO {k + 1}</div>
          </React.Fragment>
        );
      })}
      {/* descuento actual en el año 1 */}
      <div style={{position: 'absolute', left: X + 250, top: Y0 - 34, opacity: chico, transform: `translateX(${interpolate(chico, [0, 1], [30, 0])}px)`}}>
        <div style={{padding: '8px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.16)', border: '3px solid white', fontSize: 34}}>
          descuento <span style={{fontWeight: 900}}>ACTUAL</span>
        </div>
      </div>
      {/* descuento grande en el año 5 */}
      <div style={{position: 'absolute', left: X + 250, top: Y0 + 4 * STEP - 52, opacity: Math.min(1, grande * 2),
        transform: `scale(${interpolate(grande, [0, 1], [1.6, 1])})`, transformOrigin: '0% 50%'}}>
        <div style={{padding: '10px 22px', borderRadius: 18, background: SALVIA, border: '4px solid white', textAlign: 'center', lineHeight: 0.95}}>
          <div style={{fontWeight: 500, fontSize: 34}}>descuento</div>
          <div style={{fontWeight: 900, fontStyle: 'italic', fontSize: 58}}>GRANDE</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// golpes sobre B-roll, centrados
const Golpe: React.FC<{dur: number; arriba: string; abajo: string; cursiva?: boolean}> = ({dur, arriba, abajo}) => (
  <Bloque y={960} dur={dur}>
    <div style={{fontFamily: BS, fontSize: 96, lineHeight: 0.75}}>{arriba}</div>
    <div style={{fontWeight: 900, fontSize: 118, lineHeight: 1.0, whiteSpace: 'nowrap', ...fuerte}}>{abajo}</div>
  </Bloque>
);

// CTA arriba de la cabeza
const Cta: React.FC<{dur: number; t0: number}> = ({dur, t0}) => (
  <Bloque y={572} anchor="bottom" dur={dur}>
    <div style={{fontWeight: 900, fontSize: 112, lineHeight: 0.9, ...grad}}>ESCRIBIME</div>
    <Tarde d={R(1476) - t0}>
      <div style={{fontWeight: 500, fontSize: 46, lineHeight: 1.05, marginTop: 10}}>y te ayudo a encontrar <span style={{fontWeight: 900}}>TU CASA</span></div>
    </Tarde>
    <Tarde d={R(1519) - t0}>
      <div style={{fontWeight: 500, fontSize: 46, lineHeight: 1.05}}>y planear <span style={{fontWeight: 900, fontStyle: 'italic', color: MENTA}}>TUS TIEMPOS</span></div>
    </Tarde>
  </Bloque>
);

const TITULOS: [number, number, (d: number, t0: number) => React.ReactNode][] = [
  [R(104), R(172), (d, t0) => <Hook dur={d} t0={t0} />],
  [R(192), R(241), (d, t0) => <Enmienda dur={d} t0={t0} />],
  [R(435), R(655), (d, t0) => <Cifras dur={d} t0={t0} />],
  [R(812), R(896), (d, t0) => <Calendario dur={d} t0={t0} />],
  [R(930), R(1085), (d, t0) => <Linea dur={d} t0={t0} />],
  [R(1143), R(1174), (d) => <Golpe dur={d} arriba="vas a pagar" abajo="MENOS" />],
  [R(1231), R(1265), (d) => <Golpe dur={d} arriba="el momento" abajo="ES AHORA" />],
  [R(1447), R(1548), (d, t0) => <Cta dur={d} t0={t0} />],
];

// ---------- subtítulos ----------
type Sub = {a: number; b: number; ws: [string, string][]; y: number; cam: boolean};
const palabra = (w: string, st: string, i: number) => {
  const base: React.CSSProperties = {display: 'inline-block', margin: '0 0.12em', letterSpacing: '-0.02em'};
  if (st === 'm') return <span key={i} style={{...base, fontWeight: 500, color: 'white'}}>{w}</span>;
  if (st === 'b') return <span key={i} style={{...base, fontWeight: 900, fontStyle: 'italic', color: 'white'}}>{w}</span>;
  if (st === 't') return <span key={i} style={{...base, fontWeight: 900, fontStyle: 'italic', color: MENTA}}>{w}</span>;
  return <span key={i} style={{...base, fontWeight: 900, fontSize: '1.25em', ...fuerte}}>{w}</span>;
};
const Subtitulo: React.FC<{s: Sub}> = ({s}) => {
  const {op, sc} = useIO(s.b - s.a, 5, 2);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 180, width: 720, top: s.y, transform: `translateY(${s.cam ? 0 : -50}%) scale(${sc})`,
        transformOrigin: s.cam ? '50% 0%' : '50% 50%', opacity: op, textAlign: 'center', fontFamily: OS, fontSize: 66, lineHeight: 1.0, filter: SOMBRA}}>
        {s.ws.map(([w, st], i) => palabra(w, st, i))}
      </div>
    </AbsoluteFill>
  );
};
const SUBS = (subs as unknown as Sub[]).map((s) => {
  let b = s.b;
  for (const [ta] of TITULOS) if (ta > s.a && ta < b) b = ta;
  return {...s, b};
}).filter((s) => s.b - s.a >= 4 && !TITULOS.some(([ta, tb]) => s.a >= ta - 2 && s.a < tb));

const Guias: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid rgba(255,0,0,0.8)'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'rgba(0,200,255,0.6)'}} />
  </AbsoluteFill>
);

export const ROC2111: React.FC<{guias?: boolean; audio?: boolean}> = ({guias, audio = true}) => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    {CLIPS.map((c, i) => (
      <Sequence key={i} from={c[1]} durationInFrames={c[2] - c[1]}>
        <Plano clip={c} />
      </Sequence>
    ))}
    <LightLeak />
    {SUBS.map((s, i) => (
      <Sequence key={'s' + i} from={s.a} durationInFrames={s.b - s.a}>
        <Subtitulo s={s} />
      </Sequence>
    ))}
    {TITULOS.map(([a, b, el], i) => (
      <Sequence key={'t' + i} from={a} durationInFrames={b - a}>
        {el(b - a, a)}
      </Sequence>
    ))}
    {guias && <Guias />}
    {audio && <Audio src={staticFile('roc2111/mix.wav')} />}
  </AbsoluteFill>
);
