import React from 'react';
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring,
  staticFile, useCurrentFrame, Easing,
} from 'remotion';
import data from './data.json';
import subs from './subs.json';

// PCO 05-11 "El centro de Dade City tiene 100 años" — reel de zona a cámara (6 tomas) + motion de marca
export const FPS = 30;
export const PCO0511_FRAMES = data.total;

const NAVY_N = '#05005C', NAVY = '#0B0284';
const MS = 'Montserrat';
const SOMBRA = 'drop-shadow(0 2px 4px rgba(0,0,0,0.45)) drop-shadow(0 6px 14px rgba(0,0,0,0.4))';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const FONTS: [string, string, string][] = [
  ['Montserrat-Light.ttf', '300', 'normal'], ['Montserrat-Medium.ttf', '500', 'normal'], ['Montserrat-Bold.ttf', '700', 'normal'],
  ['Montserrat-BoldItalic.ttf', '700', 'italic'], ['Montserrat-ExtraBold.ttf', '800', 'normal'], ['Montserrat-Black.ttf', '900', 'normal'],
  ['Montserrat-BlackItalic.ttf', '900', 'italic'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([file, weight, style]) =>
  new FontFace(MS, `url(${staticFile('pco0511/fonts/' + file)})`, {weight, style}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

const B = data.B as number[];
const EYES = data.eyes as [number, number][];
const S = data.s as number[];
const HT = data.headtop as unknown as Record<string, number>;
const PELO = data.pelo0 as number[];

// ---------- transiciones ----------
const LEAKS = [234, 641, 910, 1287, 1397];
const CORTES = [234, 252, 405, 641, 910, 1287, 1316, 1397];
const transE = (fr: number) => {
  let e = 0;
  for (const c of CORTES) e = Math.max(e, 1 - Math.abs(fr - c + 0.5) / 3.5);
  return Math.max(0, e);
};
const camStyle = (fr: number): React.CSSProperties => {
  const e = transE(fr);
  const [ex, ey] = EYES[Math.min(fr, EYES.length - 1)];
  return {transform: `scale(${S[fr] * (1 + 0.25 * e)})`, transformOrigin: `${ex}px ${ey}px`, filter: e > 0.05 ? `blur(${16 * e}px)` : undefined};
};

const Toma: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const fr = B[i] + frame;
  return (
    <AbsoluteFill style={camStyle(fr)}>
      <OffthreadVideo src={staticFile(`pco0511/t${i}.mp4`)} muted />
    </AbsoluteFill>
  );
};
// recorte de Patricia (hook) por encima del "1909", con el mismo zoom y la misma transición
const Recorte: React.FC<{desde: number}> = ({desde}) => {
  const fr = desde + useCurrentFrame();
  return (
    <AbsoluteFill style={camStyle(fr)}>
      <OffthreadVideo src={staticFile('pco0511/fg0.mov')} startFrom={desde} transparent muted />
    </AbsoluteFill>
  );
};

const LightLeak: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      {LEAKS.map((c) => {
        const k = interpolate(fr, [c - 11, c, c + 12], [0, 1, 0], clamp);
        if (k <= 0) return null;
        const p = (fr - c + 11) / 23;
        return (
          <AbsoluteFill key={c} style={{mixBlendMode: 'screen', opacity: k}}>
            <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 55% at ${10 + 80 * p}% ${30 + 25 * p}%, rgba(255,150,70,0.95), rgba(255,95,80,0.55) 45%, rgba(0,0,0,0) 75%)`}} />
            <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 45% at ${90 - 70 * p}% ${75 - 30 * p}%, rgba(255,120,180,0.85), rgba(0,0,0,0) 70%)`}} />
            <AbsoluteFill style={{backgroundColor: `rgba(255,225,200,${0.3 * k})`}} />
          </AbsoluteFill>
        );
      })}
    </>
  );
};
// flash de cámara en "fotografiado"
const Flash: React.FC = () => {
  const fr = useCurrentFrame();
  const k = interpolate(fr, [0, 1, 7], [0, 0.75, 0], clamp);
  return <AbsoluteFill style={{backgroundColor: 'white', opacity: k}} />;
};

// ---------- utilidades ----------
const sp = (fr: number, d = 0, damping = 13, stiffness = 170) =>
  fr < d ? 0 : spring({frame: fr - d, fps: FPS, config: {damping, stiffness}});
const salida = (fr: number, dur: number, n = 5) => interpolate(fr, [0, 2, dur - n, dur], [0, 1, 1, 0], clamp);
const Entra: React.FC<{fr: number; d: number; dy?: number; children: React.ReactNode}> = ({fr, d, dy = 26, children}) => {
  const s = sp(fr, d);
  const blur = fr < d ? 8 : Math.max(0, interpolate(fr - d, [0, 4], [8, 0], clamp));
  return (
    <div style={{opacity: fr < d ? 0 : Math.min(1, s * 1.5), transform: `translateY(${interpolate(s, [0, 1], [dy, 0])}px) scale(${interpolate(s, [0, 1], [0.9, 1])})`,
      filter: blur > 0.05 ? `blur(${blur}px)` : undefined}}>{children}</div>
  );
};
const txt: React.CSSProperties = {fontFamily: MS, color: 'white', letterSpacing: '-0.02em', textAlign: 'center'};

// bloque de título anclado por la base (pegado arriba de la cabeza)
const SobreCabeza: React.FC<{bottom: number; dur: number; children: React.ReactNode}> = ({bottom, dur, children}) => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: salida(fr, dur)}}>
      <div style={{...txt, position: 'absolute', left: 180, width: 720, top: bottom, transform: 'translateY(-100%)', filter: SOMBRA}}>{children}</div>
    </AbsoluteFill>
  );
};

// ---------- títulos ----------
// H1: el edificio más / fotografiado / de Dade City
const H1: React.FC<{dur: number}> = ({dur}) => {
  const fr = useCurrentFrame();
  return (
    <SobreCabeza bottom={PELO[0] - 34} dur={dur}>
      <Entra fr={fr} d={0}><div style={{fontWeight: 500, fontSize: 58, lineHeight: 0.95}}>el edificio más</div></Entra>
      <Entra fr={fr} d={40}><div style={{fontWeight: 900, fontStyle: 'italic', fontSize: 104, lineHeight: 0.95}}>fotografiado</div></Entra>
      <Entra fr={fr} d={66}><div style={{fontWeight: 500, fontSize: 58, lineHeight: 1.0}}>de <span style={{fontWeight: 800}}>Dade City</span></div></Entra>
    </SobreCabeza>
  );
};
// H2: es el juzgado de / 1909 (detrás de Patricia)
const ANIO_BOTTOM = Math.min(...PELO.slice(151, 234)) + 70;
const H2a: React.FC<{dur: number; t0: number}> = ({dur, t0}) => {
  const fr = useCurrentFrame();
  const s = sp(fr, 190 - t0, 11, 190);
  const blur = fr < 190 - t0 ? 0 : Math.max(0, interpolate(fr - (190 - t0), [0, 5], [14, 0], clamp));
  return (
    <AbsoluteFill style={{opacity: salida(fr, dur)}}>
      <div style={{...txt, position: 'absolute', left: 0, width: 1080, top: ANIO_BOTTOM, transform: `translateY(-100%)`, filter: SOMBRA}}>
        <div style={{fontWeight: 900, fontSize: 270, lineHeight: 0.74, paddingTop: 30, opacity: fr < 190 - t0 ? 0 : Math.min(1, s * 2),
          transform: `scale(${interpolate(s, [0, 1], [1.45, 1])})`, transformOrigin: '50% 100%', filter: blur > 0.05 ? `blur(${blur}px)` : undefined}}>1909</div>
      </div>
    </AbsoluteFill>
  );
};
const H2b: React.FC<{dur: number}> = ({dur}) => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: salida(fr, dur)}}>
      <div style={{...txt, position: 'absolute', left: 180, width: 720, top: ANIO_BOTTOM - 232, transform: 'translateY(-100%)', filter: SOMBRA}}>
        <Entra fr={fr} d={0}><div style={{fontWeight: 500, fontSize: 56, lineHeight: 1}}>es el <span style={{fontWeight: 800}}>juzgado</span> de</div></Entra>
      </div>
    </AbsoluteFill>
  );
};

// línea de tiempo 1909 → 1921
const Linea: React.FC<{dur: number; t0: number; etapa: 1 | 2; bottom: number}> = ({dur, t0, etapa, bottom}) => {
  const fr = useCurrentFrame();
  const Y = bottom - 120; // y de la línea
  const X0 = 210, X1 = 870;
  const MK = [{x: 330, anio: '1909', lab: 'juzgado', d: etapa === 1 ? 469 - t0 : -99}, {x: 640, anio: '1921', lab: 'concha acústica', d: 778 - t0}];
  const largo = etapa === 1 ? interpolate(fr, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) * (440 - X0)
    : (440 - X0) + interpolate(fr, [2, 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) * (X1 - 440);
  const n = etapa === 1 ? 1 : 2;
  return (
    <AbsoluteFill style={{opacity: salida(fr, dur), filter: SOMBRA}}>
      <div style={{position: 'absolute', left: X0, top: Y - 3, width: largo, height: 6, borderRadius: 3, background: 'white'}} />
      {etapa === 2 && <div style={{position: 'absolute', left: X0 + largo - 4, top: Y - 13, width: 0, height: 0, borderTop: '13px solid transparent',
        borderBottom: '13px solid transparent', borderLeft: '20px solid white', opacity: largo > X1 - X0 - 30 ? 1 : 0}} />}
      {MK.slice(0, n).map((m, i) => {
        const g = m.d < -50 ? 1 : sp(fr, m.d, 11, 200);
        const nuevo = (etapa === 1 && i === 0) || (etapa === 2 && i === 1);
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: m.x - 17, top: Y - 17, width: 34, height: 34, borderRadius: 17, background: nuevo ? 'white' : NAVY,
              border: '6px solid white', boxSizing: 'border-box', transform: `scale(${g})`}} />
            <div style={{...txt, position: 'absolute', left: m.x - 200, width: 400, top: Y - 30, transform: `translateY(-100%) translateY(${(1 - g) * 20}px)`, opacity: Math.min(1, g * 1.6)}}>
              <span style={{fontWeight: nuevo ? 900 : 700, fontSize: nuevo ? 104 : 66, lineHeight: 1, opacity: nuevo ? 1 : 0.85}}>{m.anio}</span>
            </div>
            <div style={{...txt, position: 'absolute', left: m.x - 200, width: 400, top: Y + 26, opacity: Math.min(1, g * 1.6)}}>
              <span style={{fontWeight: nuevo ? 700 : 500, fontStyle: nuevo ? 'italic' : 'normal', fontSize: nuevo ? 44 : 34, lineHeight: 1, opacity: nuevo ? 1 : 0.85}}>{m.lab}</span>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// sello: Registro Nacional de Sitios Históricos
const Sello: React.FC<{dur: number; bottom: number}> = ({dur, bottom}) => {
  const fr = useCurrentFrame();
  const g = sp(fr, 3, 10, 210);
  const R = 175, cy = bottom - R;
  const ring = 'REGISTRO NACIONAL • SITIOS HISTÓRICOS • ';
  return (
    <AbsoluteFill style={{opacity: salida(fr, dur) * Math.min(1, g * 2), filter: SOMBRA}}>
      <div style={{position: 'absolute', left: 540 - R, top: cy - R, width: 2 * R, height: 2 * R,
        transform: `scale(${interpolate(g, [0, 1], [1.7, 1])}) rotate(${interpolate(g, [0, 1], [-16, 0])}deg)`}}>
        <svg width={2 * R} height={2 * R} viewBox="0 0 350 350" style={{position: 'absolute', inset: 0}}>
          <defs><path id="anillo" d="M175,175 m-128,0 a128,128 0 1,1 256,0 a128,128 0 1,1 -256,0" /></defs>
          <circle cx={175} cy={175} r={171} fill="rgba(11,2,132,0.88)" stroke="white" strokeWidth={6} />
          <circle cx={175} cy={175} r={104} fill="none" stroke="white" strokeWidth={3} />
          <g transform={`rotate(${fr * 0.9} 175 175)`}>
            <text fontFamily={MS} fontWeight={800} fontSize={31} fill="white" letterSpacing={2.4}>
              <textPath href="#anillo" startOffset="0">{ring}</textPath>
            </text>
          </g>
          {/* fachada con columnas */}
          <g fill="none" stroke="white" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
            <path d="M132 136 L175 110 L218 136 Z" />
            <path d="M136 144 H214 M140 196 H210 M132 204 H218" />
            <path d="M148 150 V190 M164 150 V190 M186 150 V190 M202 150 V190" />
          </g>
        </svg>
        <div style={{...txt, position: 'absolute', left: 0, width: 2 * R, top: 218, fontWeight: 900, fontSize: 56, lineHeight: 1}}>1909</div>
      </div>
    </AbsoluteFill>
  );
};

// un centro / DE VERDAD / downtown
const DeVerdad: React.FC<{dur: number; t0: number; bottom: number}> = ({dur, t0, bottom}) => {
  const fr = useCurrentFrame();
  return (
    <SobreCabeza bottom={bottom} dur={dur}>
      <Entra fr={fr} d={0}><div style={{fontWeight: 500, fontSize: 58, lineHeight: 0.95}}>un centro</div></Entra>
      <Entra fr={fr} d={1132 - t0}><div style={{fontWeight: 800, fontSize: 106, lineHeight: 0.95}}>DE VERDAD</div></Entra>
      <Entra fr={fr} d={1155 - t0}>
        <div style={{display: 'inline-block', marginTop: 14, padding: '6px 26px 10px', borderRadius: 40, border: '4px solid white',
          fontWeight: 700, fontStyle: 'italic', fontSize: 50, lineHeight: 1}}>downtown</div>
      </Entra>
    </SobreCabeza>
  );
};
// no solamente una / avenida / con locales (tachado)
const Avenida: React.FC<{dur: number; t0: number; bottom: number}> = ({dur, t0, bottom}) => {
  const fr = useCurrentFrame();
  const t = interpolate(fr, [1247 - t0, 1255 - t0], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <SobreCabeza bottom={bottom} dur={dur}>
      <Entra fr={fr} d={0}><div style={{fontWeight: 500, fontSize: 54, lineHeight: 1}}>no solamente una</div></Entra>
      <div style={{position: 'relative', display: 'inline-block'}}>
        <Entra fr={fr} d={1220 - t0}><div style={{fontWeight: 800, fontSize: 104, lineHeight: 0.95}}>avenida</div></Entra>
        <Entra fr={fr} d={1239 - t0}><div style={{fontWeight: 500, fontSize: 60, lineHeight: 1.0}}>con <span style={{fontWeight: 800}}>locales</span></div></Entra>
        <div style={{position: 'absolute', left: -24, top: '46%', height: 16, borderRadius: 8, background: NAVY, border: '4px solid white',
          width: `calc(${t * 100}% + ${48 * t}px)`, transform: 'rotate(-9deg)', transformOrigin: '0% 50%', opacity: t > 0 ? 1 : 0}} />
      </div>
    </SobreCabeza>
  );
};
// CTA
const Cta: React.FC<{dur: number; t0: number; bottom: number}> = ({dur, t0, bottom}) => {
  const fr = useCurrentFrame();
  const g = sp(fr, 1, 10, 200);
  return (
    <SobreCabeza bottom={bottom} dur={dur}>
      <div style={{display: 'inline-block', padding: '12px 40px 16px', borderRadius: 26, background: 'white', color: NAVY_N, fontWeight: 900, fontSize: 82, lineHeight: 1,
        transform: `scale(${interpolate(g, [0, 1], [1.5, 1])}) rotate(${interpolate(g, [0, 1], [-6, -2])}deg)`, opacity: Math.min(1, g * 2), marginBottom: 18}}>ESCRÍBEME</div>
      <Entra fr={fr} d={1422 - t0}><div style={{fontWeight: 500, fontSize: 52, lineHeight: 1}}>y te cuento qué hay</div></Entra>
      <Entra fr={fr} d={1459 - t0}><div style={{fontWeight: 800, fontSize: 64, lineHeight: 1}}>para comprar</div></Entra>
      <Entra fr={fr} d={1487 - t0}><div style={{fontWeight: 700, fontStyle: 'italic', fontSize: 56, lineHeight: 1.05}}>cerca de este centro</div></Entra>
    </SobreCabeza>
  );
};

// ---------- mapas ----------
const FL: [number, number][] = [[-87.6, 31.0], [-85.0, 31.0], [-84.87, 30.71], [-82.2, 30.57], [-82.0, 30.79], [-81.45, 30.71], [-81.4, 30.35], [-81.25, 29.8],
  [-81.0, 29.2], [-80.75, 28.8], [-80.55, 28.45], [-80.6, 28.1], [-80.38, 27.6], [-80.15, 27.1], [-80.03, 26.6], [-80.1, 25.95], [-80.25, 25.55], [-80.45, 25.2],
  [-80.8, 25.15], [-81.1, 25.13], [-81.2, 25.4], [-81.4, 25.8], [-81.75, 26.05], [-81.95, 26.45], [-82.2, 26.75], [-82.35, 27.0], [-82.6, 27.35], [-82.56, 27.62],
  [-82.45, 27.88], [-82.62, 27.82], [-82.72, 27.68], [-82.85, 27.9], [-82.8, 28.2], [-82.72, 28.6], [-82.75, 28.95], [-83.05, 29.15], [-83.4, 29.55], [-83.7, 29.95],
  [-84.1, 30.07], [-84.4, 29.95], [-84.85, 29.75], [-85.2, 29.7], [-85.4, 29.7], [-85.4, 29.95], [-85.7, 30.12], [-86.2, 30.35], [-86.8, 30.4], [-87.2, 30.33], [-87.45, 30.3]];
const PASCO: [number, number][] = [[-82.75, 28.48], [-82.06, 28.48], [-82.05, 28.17], [-82.8, 28.17], [-82.8, 28.2]];
const P = (lon: number, lat: number): [number, number] => [(lon + 88) * 0.88, 31.2 - lat];
const poly = (pts: [number, number][]) => 'M' + pts.map(([lo, la]) => P(lo, la).join(',')).join(' L') + ' Z';
type VB = {x: number; y: number; w: number; h: number};
const BOX = {x: 180, y: 340, w: 720, h: 645};
const vbAt = (cx: number, cy: number, h: number): VB => ({x: cx - (h * BOX.w / BOX.h) / 2, y: cy - h / 2, w: h * BOX.w / BOX.h, h});
const VB_FL = vbAt(3.7, 3.6, 6.45);
const VB_PASCO = vbAt(...P(-82.42, 28.22), 0.8);
const VB_CERCA = vbAt(...P(-82.255, 28.3), 0.27);
const lerpVB = (a: VB, b: VB, t: number): VB => {
  // zoom geométrico (el alto se interpola en log) y centro siguiendo
  const h = Math.exp(Math.log(a.h) + (Math.log(b.h) - Math.log(a.h)) * t);
  const cx = a.x + a.w / 2 + ((b.x + b.w / 2) - (a.x + a.w / 2)) * t, cy = a.y + a.h / 2 + ((b.y + b.h / 2) - (a.y + a.h / 2)) * t;
  return vbAt(cx, cy, h);
};
const scr = (vb: VB, lon: number, lat: number) => {
  const [x, y] = P(lon, lat);
  return [BOX.x + (x - vb.x) / vb.w * BOX.w, BOX.y + (y - vb.y) / vb.h * BOX.h];
};
const Pin: React.FC<{x: number; y: number; g: number; size?: number}> = ({x, y, g, size = 70}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 40 52" style={{position: 'absolute', left: x - size / 2, top: y - size * 1.3, transform: `scale(${g})`, transformOrigin: '50% 100%'}}>
    <path d="M20 50 C20 50 4 30 4 18 A16 16 0 0 1 36 18 C36 30 20 50 20 50 Z" fill="white" stroke={NAVY} strokeWidth={2} />
    <circle cx={20} cy={18} r={7} fill={NAVY} />
  </svg>
);
const Casa: React.FC<{x: number; y: number; g: number}> = ({x, y, g}) => (
  <div style={{position: 'absolute', left: x - 30, top: y - 30, width: 60, height: 60, borderRadius: 30, background: NAVY, border: '4px solid white', boxSizing: 'border-box',
    transform: `scale(${g})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <svg width={34} height={34} viewBox="0 0 48 48"><path d="M6 23L24 8l18 15 M11 19v21h26V19 M20 40V29h8v11" fill="none" stroke="white" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);
const FondoPlaca: React.FC<{i: number; desde: number}> = ({i, desde}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{transform: 'scale(1.15)', filter: 'blur(28px) saturate(0.7)'}}>
      <OffthreadVideo src={staticFile(`pco0511/t${i}.mp4`)} startFrom={desde} muted />
    </AbsoluteFill>
    <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(5,0,92,0.93) 0%, rgba(11,2,132,0.82) 55%, rgba(5,0,92,0.93) 100%)`}} />
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px)', backgroundSize: '26px 26px'}} />
  </AbsoluteFill>
);
const placaIO = (fr: number, dur: number, a: number) => {
  const e = transE(a + fr);
  return {opacity: interpolate(fr, [0, 3, dur - 3, dur], [0, 1, 1, 0], clamp), transform: `scale(${1 + 0.2 * e})`, filter: e > 0.05 ? `blur(${14 * e}px)` : undefined};
};

const Mapa1: React.FC<{dur: number; a: number}> = ({dur, a}) => {
  const fr = useCurrentFrame();
  const z = interpolate(fr, [368 - a, 392 - a], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const vb = lerpVB(VB_FL, VB_PASCO, z);
  const draw = interpolate(fr, [2, 24], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const pin = sp(fr, 286 - a, 10, 200);
  const pas = interpolate(fr, [372 - a, 386 - a], [0, 1], clamp);
  const [dx, dy] = scr(vb, -82.196, 28.365);
  const [px, py] = scr(vb, -82.43, 28.53);
  const [fx, fy] = scr(vb, -81.55, 28.3);
  const [tx, ty] = scr(vb, -82.46, 27.95);
  return (
    <AbsoluteFill style={placaIO(fr, dur, a)}>
      <FondoPlaca i={1} desde={a - B[1]} />
      <svg width={BOX.w} height={BOX.h} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{position: 'absolute', left: BOX.x, top: BOX.y, overflow: 'visible', filter: SOMBRA,
        WebkitMaskImage: `radial-gradient(ellipse 72% 72% at 50% 50%, black 70%, rgba(0,0,0,${1 - z}) 100%)`, WebkitMaskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat'}}>
        <path d={poly(FL)} fill={`rgba(255,255,255,${0.14 * draw})`} stroke="white" strokeWidth={4 * vb.h / BOX.h} strokeLinejoin="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <path d={poly(PASCO)} fill={`rgba(255,255,255,${0.12 + 0.3 * pas})`} stroke="white" strokeWidth={2 + 3 * pas} vectorEffect="non-scaling-stroke"
          strokeDasharray={pas > 0 ? undefined : '6 6'} opacity={draw} />
        <circle cx={P(-82.46, 27.95)[0]} cy={P(-82.46, 27.95)[1]} r={vb.h * 0.012} fill="white" opacity={pas} />
      </svg>
      <div style={{...txt, position: 'absolute', left: fx - 150, width: 300, top: fy - 20, fontWeight: 300, fontSize: 40, letterSpacing: '0.3em', opacity: draw * (1 - z), filter: SOMBRA}}>FLORIDA</div>
      <div style={{...txt, position: 'absolute', left: tx + 18, top: ty - 20, fontWeight: 500, fontSize: 34, textAlign: 'left', opacity: pas, filter: SOMBRA}}>Tampa</div>
      <div style={{...txt, position: 'absolute', left: px - 300, width: 600, top: py - 16, transform: 'translateY(-100%)', fontWeight: 800, fontSize: 60, lineHeight: 1,
        opacity: pas, filter: SOMBRA}}>PASCO COUNTY</div>
      <div style={{filter: SOMBRA}}><Pin x={dx} y={dy} g={pin} size={z > 0.5 ? 78 : 62} /></div>
      <div style={{...txt, position: 'absolute', left: dx + 34, top: dy - 82, textAlign: 'left', fontWeight: 700, fontStyle: 'italic', fontSize: 46, whiteSpace: 'nowrap',
        opacity: Math.min(1, pin * 1.5), transform: `translateX(${(1 - pin) * -16}px)`, filter: SOMBRA}}>Dade City</div>
    </AbsoluteFill>
  );
};

const LUG: [string, number, number, number, 'izq' | 'der' | 'abajo'][] = [
  ['San Antonio', -82.275, 28.336, 1336, 'izq'], ['Wesley Chapel', -82.327, 28.239, 1348, 'abajo'], ['Zephyrhills', -82.181, 28.234, 1358, 'der'],
];
const Mapa2: React.FC<{dur: number; a: number}> = ({dur, a}) => {
  const fr = useCurrentFrame();
  const vb = lerpVB(VB_PASCO, VB_CERCA, interpolate(fr, [0, 16], [0.55, 1], {...clamp, easing: Easing.out(Easing.cubic)}));
  const [dx, dy] = scr(vb, -82.196, 28.365);
  const pin = sp(fr, 3, 10, 200);
  return (
    <AbsoluteFill style={placaIO(fr, dur, a)}>
      <FondoPlaca i={4} desde={a - B[4]} />
      <svg width={BOX.w} height={BOX.h} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{position: 'absolute', left: BOX.x, top: BOX.y, overflow: 'hidden'}}>
        <path d={poly(PASCO)} fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.75)" strokeWidth={3} strokeDasharray="10 8" vectorEffect="non-scaling-stroke" />
      </svg>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: SOMBRA}}>
        {LUG.map(([n, lo, la, d]) => {
          const [x, y] = scr(vb, lo, la);
          const t = interpolate(fr, [d - a - 12, d - a], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
          return <line key={n} x1={dx} y1={dy} x2={dx + (x - dx) * t} y2={dy + (y - dy) * t} stroke="white" strokeWidth={5} strokeDasharray="4 12" strokeLinecap="round" opacity={t > 0 ? 1 : 0} />;
        })}
      </svg>
      {LUG.map(([n, lo, la, d, pos]) => {
        const [x, y] = scr(vb, lo, la);
        const g = sp(fr, d - a, 10, 200);
        const lab: React.CSSProperties = pos === 'izq' ? {left: x - 46 - 300, width: 300, top: y - 20, textAlign: 'right'} : pos === 'der' ? {left: x + 46, width: 300, top: y - 20, textAlign: 'left'} : {left: x - 200, width: 400, top: y + 40, textAlign: 'center'};
        return (
          <React.Fragment key={n}>
            <div style={{filter: SOMBRA}}><Casa x={x} y={y} g={g} /></div>
            <div style={{...txt, position: 'absolute', ...lab, fontWeight: 700, fontSize: 38, lineHeight: 1, opacity: Math.min(1, g * 1.5), filter: SOMBRA}}>{n}</div>
          </React.Fragment>
        );
      })}
      <div style={{filter: SOMBRA}}><Pin x={dx} y={dy} g={pin} size={80} /></div>
      <div style={{...txt, position: 'absolute', left: dx + 40, top: dy - 96, textAlign: 'left', lineHeight: 0.95, opacity: Math.min(1, pin * 1.5), filter: SOMBRA}}>
        <div style={{fontWeight: 500, fontSize: 36}}>centro de</div>
        <div style={{fontWeight: 700, fontStyle: 'italic', fontSize: 50, whiteSpace: 'nowrap'}}>Dade City</div>
      </div>
      <div style={{...txt, position: 'absolute', left: 200, width: 340, top: BOX.y + BOX.h - 62, textAlign: 'left', fontWeight: 500, fontSize: 30, opacity: 0.6}}>mapa ilustrativo</div>
    </AbsoluteFill>
  );
};

// [desde, hasta, elemento, ¿oculta subtítulos?]
const ITEMS: [number, number, (d: number, a: number) => React.ReactNode, boolean][] = [
  [1, 99, (d) => <H1 dur={d} />, true],
  [151, 234, (d) => <H2b dur={d} />, true],
  [252, 405, (d, a) => <Mapa1 dur={d} a={a} />, false],
  [436, 514, (d, a) => <Linea dur={d} t0={a} etapa={1} bottom={HT['1'] - 10} />, true],
  [558, 641, (d) => <Sello dur={d} bottom={HT['1'] - 16} />, true],
  [717, 818, (d, a) => <Linea dur={d} t0={a} etapa={2} bottom={HT['2'] - 10} />, true],
  [1109, 1190, (d, a) => <DeVerdad dur={d} t0={a} bottom={HT['3'] - 24} />, true],
  [1190, 1287, (d, a) => <Avenida dur={d} t0={a} bottom={HT['3'] - 24} />, true],
  [1316, 1397, (d, a) => <Mapa2 dur={d} a={a} />, false],
  [1397, 1528, (d, a) => <Cta dur={d} t0={a} bottom={HT['5'] - 24} />, true],
];

// ---------- subtítulos ----------
type Sub = {t: string; a: number; b: number; y: number; card: boolean};
const OCULTA = ITEMS.filter((x) => x[3]).map(([a, b]) => [a, b]);
const SUBS = (subs as unknown as Sub[]).map((s) => {
  let b = s.b;
  for (const [ta] of OCULTA) if (ta > s.a && ta < b) b = ta;
  return {...s, b};
}).filter((s) => s.b - s.a >= 4 && !OCULTA.some(([ta, tb]) => s.a >= ta - 2 && s.a < tb));
const Subtitulo: React.FC<{s: Sub}> = ({s}) => {
  const fr = useCurrentFrame();
  const k = interpolate(fr, [0, 4], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const op = interpolate(fr, [0, 2, s.b - s.a - 2, s.b - s.a], [0, 1, 1, 0], clamp);
  const parts = s.t.split(/(\b19\d\d\b)/);
  return (
    <AbsoluteFill>
      <div style={{...txt, position: 'absolute', left: 180, width: 720, top: s.y, transform: `scale(${0.9 + 0.1 * k})`, transformOrigin: '50% 0%', opacity: op,
        fontWeight: 700, fontSize: 54, lineHeight: 1.05, filter: `${SOMBRA}${k < 1 ? ` blur(${8 * (1 - k)}px)` : ''}`}}>
        {parts.map((p, i) => /^19\d\d$/.test(p) ? <span key={i} style={{fontWeight: 800, fontSize: '1.2em'}}>{p}</span> : <span key={i}>{p}</span>)}
      </div>
    </AbsoluteFill>
  );
};

const Guias: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid rgba(255,0,0,0.8)'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'rgba(0,200,255,0.6)'}} />
  </AbsoluteFill>
);

export const PCO0511: React.FC<{guias?: boolean; audio?: boolean}> = ({guias, audio = true}) => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    {B.slice(0, -1).map((a, i) => (
      <Sequence key={i} from={a} durationInFrames={B[i + 1] - a}>
        <Toma i={i} />
      </Sequence>
    ))}
    {/* 1909 detrás de Patricia */}
    <Sequence from={151} durationInFrames={83}><H2a dur={83} t0={151} /></Sequence>
    <Sequence from={151} durationInFrames={83}><Recorte desde={151} /></Sequence>
    <Sequence from={41} durationInFrames={8}><Flash /></Sequence>
    <LightLeak />
    {ITEMS.map(([a, b, el], i) => (
      <Sequence key={'t' + i} from={a} durationInFrames={b - a}>
        {el(b - a, a)}
      </Sequence>
    ))}
    {SUBS.map((s, i) => (
      <Sequence key={'s' + i} from={s.a} durationInFrames={s.b - s.a}>
        <Subtitulo s={s} />
      </Sequence>
    ))}
    {guias && <Guias />}
    {audio && <Audio src={staticFile('pco0511/mix.wav')} />}
  </AbsoluteFill>
);
