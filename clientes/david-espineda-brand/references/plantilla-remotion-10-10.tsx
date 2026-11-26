import React from 'react';
import {K2441} from './zoom2441';
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, getInputProps, interpolate, spring,
  staticFile, useCurrentFrame, Easing,
} from 'remotion';

// DAE 10-10 "Tu precio en dólares no se mueve con el guaraní" — asesora de SIMPLE sentada en la terraza + CTA de pie
// + motion de marca: gráfico del tipo de cambio (guaraní que se mueve vs. precio en USD plano)
export const FPS = 30;
export const DAE1010_FRAMES = 750;
const f = (s: number) => Math.round(s * FPS);
const GUIAS = Boolean((getInputProps() as {guias?: boolean}).guias);

const NAVY = '#0A1D38', CELESTE = '#349FE2';
const OW = 'Owners Text';
const REG = 400, MED = 500, BLACK = 900;
const SOMBRA = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5)) drop-shadow(0 6px 18px rgba(0,0,0,0.35))';
const CONTORNO = (px: number): React.CSSProperties => ({WebkitTextStroke: `${px}px ${NAVY}`, paintOrder: 'stroke fill'});

const FONTS: [string, number][] = [['OwnersText-Regular.ttf', REG], ['OwnersText-Medium.ttf', MED], ['OwnersText-Black.ttf', BLACK]];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([file, weight]) =>
  new FontFace(OW, `url(${staticFile('fonts/' + file)})`, {weight: String(weight)}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

// ---------- planos ----------
// [archivo, desde, hasta (frames), entrada en la fuente (s), zoom inicial, zoom final, ojoX, ojoY (px del cuadro a 1×)]
// t2428 / t2433 ya vienen recortados 1,4× del 4K con los ojos en el mismo punto (PROYECTO/clips)
type Clip = [string, number, number, number, number, number, number, number];
const MG: [number, number] = [417, 629]; // motion del tipo de cambio (13,90–20,96 s)
const CLIPS: Clip[] = [
  ['t2428', 0, 56, 1.26, 1.0, 1.03, 620, 875],
  ['t2428', 56, 100, 1.26 + 56 / 30, 1.15, 1.18, 620, 875],   // punch en "y eso significa"
  ['contrato', 100, 203, 0.4, 1.0, 1.08, 540, 960],
  ['t2433', 203, 257, 4.06, 1.1, 1.14, 584, 1009],
  ['obra3', 257, 365, 0.5, 1.0, 1.08, 540, 960],
  ['t2433', 365, 417, 9.99, 1.0, 1.04, 566, 1016],
];
// CTA: el celular hace zoom-out a mitad de toma (2,75–3,3 s de la fuente): se compensa con el zoom inverso medido
// (ancho de la cara) alrededor del centro del cuadro, sobre el 4K, para que el encuadre no cambie
const CTA: [number, number, number] = [629, 750, 0.22];
const PlanoCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const k = K2441[Math.min(K2441.length - 1, frame)];
  const lento = interpolate(frame, [0, CTA[1] - CTA[0]], [1.0, 1.05]);
  let zb = pulso(CTA[0] + frame, CTA[0]);
  return (
    <AbsoluteFill style={{transform: `scale(${k * lento * (1 + 0.16 * zb)})`, transformOrigin: '540px 960px'}}>
      <OffthreadVideo src={staticFile('dae1010/t2441_4k.mp4')} startFrom={Math.round(CTA[2] * FPS)} muted style={{width: 1080, height: 1920}} />
    </AbsoluteFill>
  );
};
const LEAKS = [100, 417, 629];
const ZBLUR = [56, 203, 257, 365];
const pulso = (fr: number, c: number) => Math.max(0, 1 - Math.abs(fr - c + 0.5) / 3.5);

const Plano: React.FC<{clip: Clip}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [name, a, b, srcIn, s0, s1, ex, ey] = clip;
  const g = a + frame;
  let zb = 0;
  for (const c of ZBLUR) zb = Math.max(zb, pulso(g, c));
  const s = interpolate(frame, [0, b - a], [s0, s1]) * (1 + 0.16 * zb);
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${ex}px ${ey}px`, filter: zb > 0.05 ? `blur(${12 * zb}px)` : undefined}}>
      <OffthreadVideo src={staticFile(`dae1010/${name}.mp4`)} startFrom={Math.round(srcIn * FPS)} muted />
    </AbsoluteFill>
  );
};

// destello naranja/rosa en modo screen, centrado en el corte
const LightLeak: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      {LEAKS.map((c) => {
        const k = interpolate(fr, [c - 9, c, c + 13], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        if (k <= 0) return null;
        const p = (fr - c + 9) / 22;
        return (
          <AbsoluteFill key={c} style={{mixBlendMode: 'screen', opacity: k}}>
            <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 55% at ${10 + 80 * p}% ${30 + 25 * p}%, rgba(255,170,70,0.95), rgba(255,100,60,0.5) 45%, rgba(0,0,0,0) 75%)`}} />
            <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 45% at ${90 - 65 * p}% ${75 - 30 * p}%, rgba(255,105,170,0.8), rgba(0,0,0,0) 70%)`}} />
            <AbsoluteFill style={{backgroundColor: `rgba(255,228,200,${0.3 * k})`}} />
          </AbsoluteFill>
        );
      })}
    </>
  );
};

const useIO = (dur: number, outF = 3) => {
  const fr = useCurrentFrame();
  const sp = spring({frame: fr, fps: FPS, config: {damping: 13, stiffness: 190}});
  const op = interpolate(fr, [0, 1, Math.max(2, dur - outF), Math.max(3, dur)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return {fr, sp, op};
};

// ---------- subtítulos: Owners Regular + palabra clave en Black, caja navy que entra como resaltador ----------
type Sub = [number, number, string, number];
const Subtitulo: React.FC<{txt: string; y: number; dur: number}> = ({txt, y, dur}) => {
  const {fr, op} = useIO(dur, 2);
  const w = interpolate(fr, [0, 4], [0, 100], {extrapolateRight: 'clamp'});
  const parts = txt.split(/(\*[^*]+\*)/).filter(Boolean);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: y, transform: 'translateY(-50%)', opacity: op, display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'relative', padding: '4px 14px 8px', fontFamily: OW, fontSize: 60, lineHeight: 1.0, color: 'white', letterSpacing: '-0.02em', whiteSpace: 'nowrap'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w}%`, backgroundColor: NAVY, opacity: 0.85}} />
          <span style={{position: 'relative'}}>
            {parts.map((p, i) => p.startsWith('*')
              ? <span key={i} style={{fontWeight: BLACK}}>{p.slice(1, -1)}</span>
              : <span key={i} style={{fontWeight: REG}}>{p}</span>)}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
// alturas: pegado bajo la caja de la cara medida (track_cara, contando el recorte 1,4× y el zoom de cada plano);
// sobre B-roll, centro del cuadro; en el motion, pegado debajo del gráfico
const Y3 = 1276, YB = 960, YMG = 1178, YC = 1064;
const SUBS: Sub[] = [
  [3.33, 4.47, 'El precio de *tu unidad*', YB],
  [6.83, 7.83, 'Lo que se *mueve*', Y3],
  [7.83, 8.57, 'es el *guaraní*,', Y3],
  [8.65, 9.53, 'y ese *movimiento*', YB],
  [13.90, 14.58, 'Por *eso*,', YMG],
  [14.58, 15.60, 'aunque el tipo de *cambio*', YMG],
  [15.60, 16.66, 'se mueva *fuerte*,', YMG],
  [16.66, 18.04, 'como pasó *este año*,', YMG],
  [18.04, 19.30, 'tu número en *dólares*', YMG],
  [19.30, 20.29, 'sigue siendo *el mismo*', YMG],
  [20.29, 20.96, 'que *firmaste*.', YMG],
  [20.96, 21.92, 'Si tenés *duda*', YC],
  [21.92, 22.76, 'de cómo *funciona*', YC],
  [22.76, 23.33, 'tu *contrato*', YC],
  [23.33, 24.13, 'en *moneda*,', YC],
];

// ---------- títulos ----------
const Bloque: React.FC<{y: number; dur: number; children: React.ReactNode; sombra?: boolean}> = ({y, dur, children, sombra = true}) => {
  const {op} = useIO(dur);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: y, opacity: op, filter: sombra ? SOMBRA : undefined,
        textAlign: 'center', fontFamily: OW, color: 'white', letterSpacing: '-0.02em'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
const Pop: React.FC<{d: number; children: React.ReactNode; from?: number}> = ({d, children, from = 0.6}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 10, stiffness: 210}});
  return <div style={{opacity: fr < 0 ? 0 : Math.min(1, sp * 1.6), transform: `scale(${fr < 0 ? from : interpolate(sp, [0, 1], [from, 1])})`}}>{children}</div>;
};
const Sube: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const fr = useCurrentFrame() - d;
  const sp = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 14, stiffness: 180}});
  return <div style={{opacity: fr < 0 ? 0 : Math.min(1, sp * 1.4), transform: `translateY(${interpolate(sp, [0, 1], [24, 0])}px)`}}>{children}</div>;
};

// máquina de escribir celeste: cada palabra se tipea mientras se dice (tiempos relativos al inicio del bloque, en s)
type Tipo = [string, number, number][];
const Maquina: React.FC<{words: Tipo; size: number; contorno?: boolean}> = ({words, size, contorno = true}) => {
  const t = useCurrentFrame() / FPS;
  const lines: React.ReactNode[][] = [[]];
  words.forEach(([w, a, b], i) => {
    if (w === '\n') { lines.push([]); return; }
    const n = Math.round(interpolate(t, [a, a + Math.min(0.32, Math.max(0.12, b - a))], [0, w.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
    lines[lines.length - 1].push(
      <span key={i} style={{display: 'inline-block', margin: '0 0.12em'}}>
        <span>{w.slice(0, n)}</span><span style={{opacity: 0}}>{w.slice(n)}</span>
      </span>);
  });
  const st: React.CSSProperties = {fontWeight: BLACK, fontSize: size, lineHeight: 1.0, color: CELESTE, whiteSpace: 'nowrap',
    ...(contorno ? CONTORNO(Math.round(size / 11)) : {})};
  return <>{lines.map((l, i) => <div key={i} style={st}>{l}</div>)}</>;
};

// línea chica sobre caja navy (sobre la remera a rayas el blanco solo no se lee)
const Caja: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 60}) => (
  <div style={{display: 'inline-block', backgroundColor: 'rgba(10,29,56,0.85)', padding: '4px 14px 8px',
    fontWeight: REG, fontSize: size, lineHeight: 1, whiteSpace: 'nowrap'}}>{children}</div>
);

// candado en cuadrado celeste: el arco baja y cierra al decir "fijado"
const Candado: React.FC<{d: number; size?: number}> = ({d, size = 110}) => {
  const fr = useCurrentFrame() - d;
  if (fr < 0) return <div style={{width: size, height: size}} />;
  const sp = spring({frame: fr, fps: FPS, config: {damping: 11, stiffness: 210}});
  const cierra = interpolate(fr, [5, 10], [-14, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
  return (
    <div style={{width: size, height: size, backgroundColor: CELESTE, opacity: Math.min(1, sp * 1.5), boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      transform: `scale(${interpolate(sp, [0, 1], [0.4, 1])}) rotate(${interpolate(sp, [0, 1], [-12, 0])}deg)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 60 60">
        <path d={`M19 ${30 + cierra} V20 a11 11 0 0 1 22 0 V${30 + cierra}`} stroke="white" strokeWidth={6} fill="none" transform={`translate(0 ${cierra})`} />
        <rect x={12} y={28} width={36} height={26} fill="white" />
        <rect x={27.5} y={35} width={5} height={11} fill={CELESTE} />
      </svg>
    </div>
  );
};

// hook 1: "Firmás en / dólares." a máquina de escribir bajo el mentón
const T1: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={1076} dur={dur}>
    <Maquina size={92} words={[['Firmás', 0.0, 0.48], ['en', 0.48, 0.62], ['\n', 0, 0], ['dólares.', 0.62, 1.0]]} />
  </Bloque>
);
// hook 2: "y eso significa / MÁS / de lo que parece." (con el punch)
const T2: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={1094} dur={dur}>
    <Sube d={0}><Caja>y eso <span style={{fontWeight: BLACK}}>significa</span></Caja></Sube>
    <Pop d={f(2.36 - 1.85)}>
      <div style={{fontWeight: BLACK, fontSize: 132, lineHeight: 1.0, whiteSpace: 'nowrap', color: 'white', ...CONTORNO(8)}}>MÁS</div>
    </Pop>
    <Sube d={f(2.65 - 1.85)}><Caja>de lo que parece.</Caja></Sube>
  </Bloque>
);
// "queda fijado / DÓLARES / desde el contrato." con candado (sobre el contrato)
const T3: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={770} dur={dur}>
    <div style={{display: 'flex', justifyContent: 'center', marginBottom: 18}}><Candado d={f(4.75 - 4.47)} /></div>
    <Sube d={0}><Caja>queda <span style={{fontWeight: BLACK}}>fijado</span> en</Caja></Sube>
    <Pop d={f(5.39 - 4.47)}>
      <div style={{fontWeight: BLACK, fontSize: 126, lineHeight: 1.0, whiteSpace: 'nowrap', color: CELESTE, ...CONTORNO(8)}}>DÓLARES</div>
    </Pop>
    <Sube d={f(5.87 - 4.47)}><Caja>desde el <span style={{fontWeight: BLACK}}>contrato</span>.</Caja></Sube>
  </Bloque>
);
// "lo absorbemos / NOSOTROS / del lado del costo de obra," (sobre la obra)
const T4: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={836} dur={dur}>
    <Sube d={0}><Caja>lo <span style={{fontWeight: BLACK}}>absorbemos</span></Caja></Sube>
    <Pop d={f(10.21 - 9.53)}>
      <div style={{fontWeight: BLACK, fontSize: 126, lineHeight: 1.0, whiteSpace: 'nowrap', color: 'white', ...CONTORNO(8)}}>NOSOTROS</div>
    </Pop>
    <Sube d={f(10.77 - 9.53)}><Caja size={56}>del lado del <span style={{fontWeight: BLACK}}>costo de obra</span>,</Caja></Sube>
  </Bloque>
);
// "no VOS / del lado del precio." arriba de la cabeza (bajo el mentón no entra en la zona segura)
const T5: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={612} dur={dur}>
    <Pop d={f(12.34 - 12.18)}>
      <div style={{fontWeight: BLACK, fontSize: 126, lineHeight: 1.0, whiteSpace: 'nowrap', ...CONTORNO(8)}}>
        <span style={{fontWeight: MED, fontSize: 84}}>no </span><span style={{color: CELESTE}}>VOS</span>
      </div>
    </Pop>
    <Sube d={f(12.98 - 12.18)}><Caja>del lado del <span style={{fontWeight: BLACK}}>precio</span>.</Caja></Sube>
  </Bloque>
);
// CTA: "preguntame." a máquina de escribir (rápida: se completa apenas se dice)
const T6: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={1046} dur={dur}>
    <Maquina size={100} words={[['preguntame.', 0.04, 0.2]]} />
  </Bloque>
);

export const TITULOS: [number, number, (d: number) => React.ReactNode][] = [
  [0.0, 1.85, (d) => <T1 dur={d} />],
  [1.85, 3.43, (d) => <T2 dur={d} />],
  [4.47, 6.75, (d) => <T3 dur={d} />],
  [9.53, 12.18, (d) => <T4 dur={d} />],
  [12.18, 13.90, (d) => <T5 dur={d} />],
  [24.13, 25.0, (d) => <T6 dur={d} />],
];

// ---------- MOTION: tipo de cambio (guaraní) vs. tu precio en USD ----------
const W = 720, Hc = 560; // tarjeta centrada en x = 540
const PX0 = 54, PX1 = 666, PY0 = 120, PY1 = 440;
// recorrido del guaraní: pseudoaleatorio fijo con un sacudón fuerte cerca del 45 % ("se mueva fuerte")
const PUNTOS: [number, number][] = (() => {
  const n = 64; const out: [number, number][] = [];
  let s = 7;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const base = 0.55 - 0.25 * Math.sin(u * Math.PI * 1.3) + 0.32 * Math.exp(-((u - 0.47) ** 2) / 0.004) - 0.28 * Math.exp(-((u - 0.6) ** 2) / 0.003) - 0.22 * Math.exp(-((u - 1) ** 2) / 0.02);
    const ruido = (rnd() - 0.5) * 0.16;
    const v = Math.min(0.97, Math.max(0.03, base + ruido));
    out.push([PX0 + u * (PX1 - PX0), PY1 - v * (PY1 - PY0)]);
  }
  return out;
})();
const YUSD = 282;
const Motion: React.FC = () => {
  const frame = useCurrentFrame();
  const t = MG[0] / FPS + frame / FPS;
  const fr0 = frame;
  const ent = spring({frame: fr0 - 1, fps: FPS, config: {damping: 14, stiffness: 170, mass: 0.7}});
  const out = interpolate(t, [20.80, 20.96], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // guaraní: se dibuja de 14,9 a 17,9 s
  const pg = interpolate(t, [14.9, 17.9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const nVis = pg * (PUNTOS.length - 1);
  const k = Math.floor(nVis), fr = nVis - k;
  const pts = PUNTOS.slice(0, k + 1);
  if (k < PUNTOS.length - 1) {
    const [x0, y0] = PUNTOS[k], [x1, y1] = PUNTOS[k + 1];
    pts.push([x0 + (x1 - x0) * fr, y0 + (y1 - y0) * fr]);
  }
  const head = pts[pts.length - 1];
  const dGs = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = pts.length > 1 ? `${dGs} L${head[0].toFixed(1)} ${PY1} L${PX0} ${PY1} Z` : '';
  const atenua = interpolate(t, [18.0, 18.4], [1, 0.32], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // USD: línea plana que se dibuja de 18,08 a 18,75 s
  const pu = interpolate(t, [18.08, 18.75], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const xu = PX0 + pu * (PX1 - PX0);
  const brillo = t > 19.34 ? Math.max(0, Math.sin((t - 19.34) * Math.PI / 0.7)) * (t < 20.04 ? 1 : 0) : 0;
  const lbl = (at: number) => spring({frame: f(t - at), fps: FPS, config: {damping: 12, stiffness: 200}}) * (t >= at ? 1 : 0);
  const sTit = lbl(14.92), sAno = lbl(17.28), sUsd = lbl(18.08), sGs = lbl(15.0);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 70% at 50% 42%, #143562 0%, #0A1D38 58%, #050f20 100%)'}}>
      {/* grilla de fondo que se desliza lenta */}
      <AbsoluteFill style={{opacity: 0.5, backgroundImage: 'linear-gradient(rgba(52,159,226,0.10) 2px, transparent 2px), linear-gradient(90deg, rgba(52,159,226,0.10) 2px, transparent 2px)',
        backgroundSize: '90px 90px', backgroundPosition: `${-frame * 0.6}px ${frame * 0.3}px`}} />
      <div style={{position: 'absolute', left: 540 - W / 2, top: 640 - Hc / 2 + 30, width: W, height: Hc, opacity: Math.min(1, ent * 1.5) * out,
        transform: `scale(${interpolate(ent, [0, 1], [0.85, 1])})`, backgroundColor: 'rgba(6,18,38,0.82)', border: '2px solid rgba(52,159,226,0.4)',
        boxShadow: '0 24px 70px rgba(0,0,0,0.5)', boxSizing: 'border-box'}}>
        {/* encabezado */}
        <div style={{position: 'absolute', left: PX0, top: 34, fontFamily: OW, fontWeight: REG, fontSize: 36, color: 'rgba(255,255,255,0.85)',
          letterSpacing: '0.04em', opacity: sTit, transform: `translateY(${(1 - sTit) * 14}px)`}}>
          TIPO DE <span style={{fontWeight: BLACK, color: 'white'}}>CAMBIO</span>
        </div>
        <svg width={W} height={Hc} style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="white" stopOpacity={0.18} />
              <stop offset="1" stopColor="white" stopOpacity={0} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1={PX0} x2={PX1} y1={PY1 - g * (PY1 - PY0)} y2={PY1 - g * (PY1 - PY0)} stroke="rgba(255,255,255,0.10)" strokeWidth={2} strokeDasharray="6 10" />
          ))}
          <line x1={PX0} x2={PX1} y1={PY1 + 2} y2={PY1 + 2} stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
          {Array.from({length: 12}, (_, i) => (
            <line key={i} x1={PX0 + (i + 0.5) * (PX1 - PX0) / 12} x2={PX0 + (i + 0.5) * (PX1 - PX0) / 12} y1={PY1 + 2} y2={PY1 + 14}
              stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
          ))}
          {/* guaraní */}
          <g opacity={atenua}>
            {area && <path d={area} fill="url(#gArea)" />}
            {pts.length > 1 && <path d={dGs} fill="none" stroke="white" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />}
            {pts.length > 1 && pg < 1 && <circle cx={head[0]} cy={head[1]} r={11} fill="white" />}
            {pts.length > 1 && pg < 1 && <circle cx={head[0]} cy={head[1]} r={22} fill="white" opacity={0.25} />}
          </g>
          {/* USD plano */}
          {pu > 0 && (
            <>
              <line x1={PX0} x2={xu} y1={YUSD} y2={YUSD} stroke={CELESTE} strokeWidth={16} filter="url(#glow)" opacity={0.6 + 0.4 * brillo} />
              <line x1={PX0} x2={xu} y1={YUSD} y2={YUSD} stroke={CELESTE} strokeWidth={9} strokeLinecap="square" />
            </>
          )}
        </svg>
        {/* etiqueta del guaraní que sigue la punta de la línea */}
        {pts.length > 1 && pg < 1 && (
          <div style={{position: 'absolute', left: head[0], top: head[1] - 64, transform: `translate(-50%, 0) scale(${sGs})`, fontFamily: OW, fontWeight: BLACK,
            fontSize: 30, color: NAVY, backgroundColor: 'white', padding: '3px 10px 6px', whiteSpace: 'nowrap'}}>guaraní</div>
        )}
        {pg >= 1 && (
          <div style={{position: 'absolute', left: PX1 - 4, top: PUNTOS[PUNTOS.length - 1][1] - 58, transform: 'translateX(-100%)', fontFamily: OW, fontWeight: BLACK,
            fontSize: 30, color: NAVY, backgroundColor: 'white', padding: '3px 10px 6px', whiteSpace: 'nowrap', opacity: interpolate(t, [18.0, 18.3], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>guaraní</div>
        )}
        {/* "USD" al arrancar la línea y candado al final */}
        <div style={{position: 'absolute', left: PX0 - 6, top: YUSD - 92, fontFamily: OW, fontWeight: BLACK, fontSize: 44, color: 'white',
          backgroundColor: CELESTE, padding: '4px 14px 8px', opacity: Math.min(1, sUsd * 1.5), transform: `scale(${interpolate(sUsd, [0, 1], [0.5, 1])})`,
          transformOrigin: 'left bottom', boxShadow: '0 6px 18px rgba(0,0,0,0.35)'}}>USD</div>
        <div style={{position: 'absolute', left: PX1 - 46, top: YUSD - 46}}>
          <Candado d={f(20.02) - MG[0]} size={92} />
        </div>
        {/* eje: "este año" */}
        <div style={{position: 'absolute', left: PX0, top: PY1 + 26, width: PX1 - PX0, display: 'flex', justifyContent: 'space-between',
          fontFamily: OW, fontWeight: REG, fontSize: 26, color: 'rgba(255,255,255,0.6)', opacity: sTit}}>
          <span>enero</span><span>hoy</span>
        </div>
        <div style={{position: 'absolute', left: 0, width: W, top: PY1 + 20, display: 'flex', justifyContent: 'center'}}>
          <div style={{fontFamily: OW, fontWeight: BLACK, fontSize: 34, color: 'white', backgroundColor: CELESTE, padding: '5px 16px 9px',
            opacity: Math.min(1, sAno * 1.5), transform: `scale(${interpolate(sAno, [0, 1], [0.5, 1])})`}}>este año</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Guias: React.FC = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px dashed #00ff66'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, backgroundColor: 'rgba(0,255,255,0.5)'}} />
  </AbsoluteFill>
);

export const DAE1010: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    {CLIPS.map((c, i) => (
      <Sequence key={i} from={c[1]} durationInFrames={c[2] - c[1]}>
        <Plano clip={c} />
      </Sequence>
    ))}
    <Sequence from={CTA[0]} durationInFrames={CTA[1] - CTA[0]}><PlanoCTA /></Sequence>
    <Sequence from={MG[0]} durationInFrames={MG[1] - MG[0]}><Motion /></Sequence>
    <LightLeak />
    {SUBS.map(([a, b, txt, y], i) => (
      <Sequence key={'s' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        <Subtitulo txt={txt} y={y} dur={f(b) - f(a)} />
      </Sequence>
    ))}
    {TITULOS.map(([a, b, el], i) => (
      <Sequence key={'t' + i} from={f(a)} durationInFrames={f(b) - f(a)}>
        {el(f(b) - f(a))}
      </Sequence>
    ))}
    {GUIAS && <Guias />}
    {!GUIAS && <Audio src={staticFile('dae1010/mix.wav')} />}
  </AbsoluteFill>
);
