import React from 'react';
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring,
  staticFile, useCurrentFrame,
} from 'remotion';
import data from './data.json';

// ROC 02-11 — pauta Grace Townhomes (Homestead). Hook y CTA a cámara, voz en off sobre el recorrido.
export const FPS = 25;
export const ROC0211_FRAMES = data.total;

const SALVIA = '#397B69', MENTA = '#94D0C0', PIEDRA = '#D2CFC8';
const OS = 'Open Sauce One', BS = 'Birthstone';
const SOMBRA = 'drop-shadow(0 2px 3px rgba(0,0,0,0.7)) drop-shadow(0 4px 12px rgba(0,0,0,0.55)) drop-shadow(0 10px 34px rgba(0,0,0,0.5))';
const SOMBRA2 = 'drop-shadow(0 2px 3px rgba(0,0,0,0.75)) drop-shadow(0 4px 12px rgba(0,0,0,0.6)) drop-shadow(0 10px 30px rgba(0,0,0,0.45))';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const FONTS: [string, string, string, string][] = [
  [OS, 'OpenSauceOne-Medium.ttf', '500', 'normal'], [OS, 'OpenSauceOne-ExtraBoldItalic.ttf', '800', 'italic'],
  [OS, 'OpenSauceOne-Black.ttf', '900', 'normal'], [OS, 'OpenSauceOne-BlackItalic.ttf', '900', 'italic'],
  [BS, 'Birthstone-Regular.ttf', '400', 'normal'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([fam, file, weight, style]) =>
  new FontFace(fam, `url(${staticFile('roc0211/fonts/' + file)})`, {weight, style}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

type Clip = [string, number, number, number, string, number, number];
const CLIPS = data.clips as unknown as Clip[];
const EYES = data.eyes as unknown as Record<string, [number, number]>;
const EV = data.ev as unknown as Record<string, number>;
const HEAD = data.head as unknown as Record<string, number>;
const LEAKS = data.leaks as number[];
const CORTES = data.cortes as number[];
const transE = (fr: number) => {
  let e = 0;
  for (const c of CORTES) e = Math.max(e, 1 - Math.abs(fr - c + 0.5) / 3);
  return Math.max(0, e);
};

// ---------- planos ----------
const Plano: React.FC<{clip: Clip}> = ({clip}) => {
  const frame = useCurrentFrame();
  const [name, a, b, srcIn, kind, s0, s1] = clip;
  const fr = a + frame;
  const e = transE(fr);
  const src = staticFile(`roc0211/${name}.mp4`);
  const blur = e > 0.05 ? `blur(${14 * e}px)` : undefined;
  if (kind === 'card') {
    return (
      <AbsoluteFill style={{filter: blur}}>
        <AbsoluteFill style={{transform: `scale(${1.12 + 0.04 * frame / (b - a)})`, filter: 'blur(7px) saturate(0.95)'}}>
          <OffthreadVideo src={src} startFrom={Math.round(srcIn * FPS)} muted playbackRate={0.6} />
        </AbsoluteFill>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(10,50,38,0.55), rgba(0,46,32,0.82) 100%)'}} />
      </AbsoluteFill>
    );
  }
  let transform: string, origin: string;
  if (kind === 'cam') {
    const [ex, ey] = EYES[String(fr)] ?? [540, 900];
    const s = interpolate(frame, [0, b - a - 1], [s0, s1], clamp) * (1 + 0.2 * e);
    transform = `scale(${s})`; origin = `${ex}px ${ey}px`;
  } else {
    const z = interpolate(frame, [0, b - a], kind === 'placa' ? [1.0, 1.04] : [1.04, 1.12]) * (1 + 0.2 * e);
    transform = `scale(${z})`; origin = '540px 960px';
  }
  return (
    <AbsoluteFill style={{transform, transformOrigin: origin, filter: blur}}>
      <OffthreadVideo src={src} startFrom={Math.round(srcIn * FPS)} muted playbackRate={kind === 'placa' ? 0.7 : 1} />
      {kind === 'placa' && <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,46,32,0.5) 100%)'}} />}
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
            <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 55% at ${10 + 80 * p}% ${30 + 25 * p}%, rgba(255,150,60,0.95), rgba(255,90,60,0.55) 45%, rgba(0,0,0,0) 75%)`}} />
            <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 45% at ${90 - 70 * p}% ${75 - 30 * p}%, rgba(255,120,170,0.8), rgba(0,0,0,0) 70%)`}} />
            <AbsoluteFill style={{backgroundColor: `rgba(255,220,180,${0.35 * k})`}} />
          </AbsoluteFill>
        );
      })}
    </>
  );
};

// ---------- utilidades ----------
const useIO = (dur: number, inF = 6, outF = 4) => {
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

const Bloque: React.FC<{y: number; dur: number; anchor?: 'top' | 'mid' | 'bottom'; children: React.ReactNode}> = ({y, dur, anchor = 'mid', children}) => {
  const {op, sc, blur} = useIO(dur);
  const ty = anchor === 'top' ? 0 : anchor === 'bottom' ? -100 : -50;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, width: 840, top: y, transform: `translateY(${ty}%) scale(${sc})`,
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
  check: 'M12 25l8 8 16-18',
  pin: 'M24 44s-14-14-14-24a14 14 0 0 1 28 0c0 10-14 24-14 24z M24 25a5 5 0 1 0 0-10a5 5 0 0 0 0 10z',
  box: 'M6 15l18-9 18 9v18l-18 9-18-9z M6 15l18 9 18-9 M24 24v18',
  truck: 'M4 12h24v20H4z M28 18h9l7 8v6H28z M8 36a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M32 36a4 4 0 1 0 8 0a4 4 0 1 0-8 0',
  school: 'M4 18l20-9 20 9-20 9z M12 22v10c0 3 6 6 12 6s12-3 12-6V22 M44 18v12',
  train: 'M14 6h20a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V12a6 6 0 0 1 6-6z M8 21h32 M16 29h1 M31 29h1 M15 43l5-7 M33 43l-5-7',
};
const Icono: React.FC<{k: string; size: number; draw?: number; stroke?: string; w?: number}> = ({k, size, draw = 1, stroke = 'white', w = 3}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{display: 'block'}}>
    <path d={ICON[k]} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
  </svg>
);

// ---------- títulos ----------
type T = {dur: number; t0: number};
// hook: arriba de la cabeza
const Hook: React.FC<T> = ({dur}) => (
  <Bloque y={HEAD.hook - 60} anchor="bottom" dur={dur}>
    <div style={{fontFamily: BS, fontSize: 96, lineHeight: 0.7}}>townhouses de</div>
    <div style={{fontWeight: 900, fontStyle: 'italic', fontSize: 132, lineHeight: 0.95, whiteSpace: 'nowrap', ...grad}}>4 CUARTOS</div>
    <div style={{fontWeight: 900, fontSize: 44, lineHeight: 1.1, color: MENTA, marginTop: 6}}>EN MIAMI-DADE</div>
  </Bloque>
);
// precio sobre la fachada (lo dice en off)
const Precio: React.FC<T> = ({dur, t0}) => {
  const fr = useCurrentFrame();
  const sp = pop(fr, EV.precio - t0 - 1, 10);
  return (
    <Bloque y={960} dur={dur}>
      <div style={{fontFamily: BS, fontSize: 110, lineHeight: 0.7}}>desde</div>
      <div style={{fontWeight: 900, fontSize: 168, lineHeight: 1, whiteSpace: 'nowrap', transform: `scale(${interpolate(sp, [0, 1], [1.5, 1])})`, opacity: Math.min(1, sp * 2)}}>
        <span style={grad}>$374,990</span>
      </div>
    </Bloque>
  );
};
// el dato clave, arriba de la cabeza
const Dato: React.FC<T> = ({dur, t0}) => (
  <Bloque y={HEAD.dato - 50} anchor="bottom" dur={dur}>
    <div style={{fontWeight: 900, fontStyle: 'italic', fontSize: 84, lineHeight: 0.95}}>GASTOS DE CIERRE</div>
    <div style={{fontFamily: BS, fontSize: 84, lineHeight: 0.8}}>incluidos</div>
    <Tarde d={EV.anios1 - t0}>
      <div style={{fontWeight: 900, fontSize: 130, lineHeight: 0.95, marginTop: 8, ...grad}}>2 AÑOS</div>
      <div style={{fontWeight: 500, fontSize: 46, lineHeight: 1.05}}>de asociación <span style={{fontWeight: 900, fontStyle: 'italic', color: MENTA}}>GRATIS</span></div>
    </Tarde>
  </Bloque>
);
// ubicación con pin
const Ubicacion: React.FC<T> = ({dur, t0}) => {
  const fr = useCurrentFrame();
  return (
    <Bloque y={960} dur={dur}>
      <div style={{display: 'flex', justifyContent: 'center', opacity: 0.85, marginBottom: 6}}><Icono k="pin" size={92} w={3} draw={interpolate(fr, [0, 14], [0, 1], clamp)} /></div>
      <div style={{fontWeight: 900, fontSize: 150, lineHeight: 0.85}}>GRACE</div>
      <div style={{fontWeight: 900, fontSize: 104, lineHeight: 0.95}}>TOWNHOMES</div>
      <div style={{fontWeight: 900, fontStyle: 'italic', fontSize: 46, lineHeight: 1.2, color: MENTA, marginTop: 8}}>HOMESTEAD · SUR DE MIAMI-DADE</div>
      <Tarde d={EV.turnpike - t0 - 14}>
        <div style={{fontWeight: 500, fontSize: 40, lineHeight: 1.1, marginTop: 4}}>salida <span style={{fontWeight: 900}}>6</span> del Turnpike</div>
      </Tarde>
    </Bloque>
  );
};
// cifra + bajada en Birthstone
const Cifra: React.FC<{dur: number; n: string; bajada: string; size?: number}> = ({dur, n, bajada, size = 240}) => (
  <Bloque y={960} dur={dur}>
    <div style={{fontWeight: 900, fontSize: size, lineHeight: 0.95, whiteSpace: 'nowrap', ...grad}}>{n}</div>
    <div style={{fontFamily: BS, fontSize: 100, lineHeight: 0.75}}>{bajada}</div>
  </Bloque>
);
const Golpe: React.FC<{dur: number; arriba: string; abajo: string; bajo?: React.ReactNode; d?: number}> = ({dur, arriba, abajo, bajo, d = 20}) => (
  <Bloque y={960} dur={dur}>
    <div style={{fontFamily: BS, fontSize: 104, lineHeight: 0.75}}>{arriba}</div>
    <div style={{fontWeight: 900, fontSize: 124, lineHeight: 1.0, whiteSpace: 'nowrap', ...fuerte}}>{abajo}</div>
    {bajo && <Tarde d={d}><div style={{fontWeight: 500, fontSize: 48, lineHeight: 1.1, marginTop: 6}}>{bajo}</div></Tarde>}
  </Bloque>
);
// placa verde: tasa 4.99 % FHA / VA + lo que paga el constructor
const Placa: React.FC<T> = ({dur, t0}) => {
  const fr = useCurrentFrame();
  const op = salida(fr, dur);
  const a0 = pop(fr, 0), pct = pop(fr, EV.pct - t0 - 2, 10), fha = pop(fr, 14), va = pop(fr, EV.va - t0);
  const c1 = pop(fr, EV.gastos2 - t0 - 2), c2 = pop(fr, EV.asoc2 - t0 - 2);
  const Chip: React.FC<{t: string; k: number}> = ({t, k}) => (
    <div style={{padding: '8px 26px', borderRadius: 16, border: '4px solid white', background: SALVIA, fontWeight: 900, fontStyle: 'italic', fontSize: 54,
      opacity: k, transform: `scale(${interpolate(k, [0, 1], [1.5, 1])})`}}>{t}</div>
  );
  const Item: React.FC<{k: number; d: number; a: string; b: string}> = ({k, d, a, b}) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: k, transform: `translateX(${interpolate(k, [0, 1], [40, 0])}px)`, marginTop: 22}}>
      <div style={{width: 74, height: 74, borderRadius: 40, background: SALVIA, border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <Icono k="check" size={54} w={5} draw={interpolate(fr - d, [2, 12], [0, 1], clamp)} />
      </div>
      <div style={{textAlign: 'left', lineHeight: 1, whiteSpace: 'nowrap'}}>
        <span style={{fontWeight: 900, fontSize: 56}}>{a}</span> <span style={{fontFamily: BS, fontSize: 72, marginLeft: 8}}>{b}</span>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{opacity: op, fontFamily: OS, color: 'white', letterSpacing: '-0.02em', filter: SOMBRA}}>
      <div style={{position: 'absolute', left: 120, width: 840, top: 470, textAlign: 'center', opacity: a0}}>
        <div style={{fontFamily: BS, fontSize: 100, lineHeight: 0.8}}>tasa de</div>
        <div style={{fontWeight: 900, fontSize: 230, lineHeight: 0.95, transform: `scale(${interpolate(pct, [0, 1], [1.6, 1])})`, opacity: Math.min(1, pct * 2)}}><span style={grad}>4.99%</span></div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 24, marginTop: 14}}><Chip t="FHA" k={fha} /><Chip t="VA" k={va} /></div>
      </div>
      <div style={{position: 'absolute', left: 150, width: 800, top: 960}}>
        <Item k={c1} d={EV.gastos2 - t0 - 2} a="GASTOS DE CIERRE" b="pagos" />
        <Item k={c2} d={EV.asoc2 - t0 - 2} a="2 AÑOS DE HOA" b="pagos" />
      </div>
    </AbsoluteFill>
  );
};
// lo que hay cerca: lista con íconos sobre la comunidad desenfocada
const CERCA: {k: string; a: string; b: string; ev: string}[] = [
  {k: 'box', a: 'Centro de distribución', b: 'AMAZON', ev: 'amazon'},
  {k: 'truck', a: 'Centro de', b: 'FEDEX', ev: 'fedex'},
  {k: 'school', a: 'Escuelas', b: 'CHARTER', ev: 'escuelas'},
  {k: 'train', a: 'Transporte rápido', b: 'PLAN SMART', ev: 'extension'},
];
const Cerca: React.FC<T> = ({dur, t0}) => {
  const fr = useCurrentFrame();
  const op = salida(fr, dur, 6);
  const h = pop(fr, 0);
  return (
    <AbsoluteFill style={{opacity: op, fontFamily: OS, color: 'white', letterSpacing: '-0.02em', filter: SOMBRA}}>
      <div style={{position: 'absolute', left: 120, width: 840, top: 450, textAlign: 'center', opacity: h, transform: `scale(${interpolate(h, [0, 1], [0.85, 1])})`}}>
        <div style={{fontFamily: BS, fontSize: 104, lineHeight: 0.8}}>a pocos minutos</div>
      </div>
      {CERCA.map((c, i) => {
        const d = EV[c.ev] - t0 - 3; const k = pop(fr, d);
        return (
          <div key={i} style={{position: 'absolute', left: 170, top: 610 + i * 152, display: 'flex', alignItems: 'center', gap: 28, opacity: k,
            transform: `translateX(${interpolate(k, [0, 1], [50, 0])}px)`}}>
            <div style={{width: 120, height: 120, borderRadius: 30, background: 'rgba(57,123,105,0.92)', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icono k={c.k} size={78} w={3} draw={interpolate(fr - d, [2, 16], [0, 1], clamp)} />
            </div>
            <div style={{lineHeight: 0.98}}>
              <div style={{fontWeight: 500, fontSize: 42}}>{c.a}</div>
              <div style={{fontWeight: 900, fontStyle: 'italic', fontSize: 74, color: i === 3 ? MENTA : 'white'}}>{c.b}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
// CTA bajo el mentón
const Cta: React.FC<T> = ({dur, t0}) => (
  <Bloque y={HEAD.cta_chin + 40} anchor="top" dur={dur}>
    <div style={{fontWeight: 900, fontSize: 116, lineHeight: 0.9, ...grad}}>ESCRÍBEME</div>
    <div style={{fontWeight: 900, fontStyle: 'italic', fontSize: 72, lineHeight: 1.0, color: MENTA}}>POR WHATSAPP</div>
    <Tarde d={EV.coordinamos - t0 - 4}>
      <div style={{fontWeight: 500, fontSize: 46, lineHeight: 1.05, marginTop: 10}}>y coordinamos <span style={{fontWeight: 900}}>los pasos a seguir</span></div>
    </Tarde>
  </Bloque>
);

const COMP: Record<string, (d: number, t0: number) => React.ReactNode> = {
  Hook: (d, t0) => <Hook dur={d} t0={t0} />,
  Precio: (d, t0) => <Precio dur={d} t0={t0} />,
  Dato: (d, t0) => <Dato dur={d} t0={t0} />,
  Ubicacion: (d, t0) => <Ubicacion dur={d} t0={t0} />,
  D_niveles: (d) => <Cifra dur={d} n="3" bajada="niveles" />,
  D_habit: (d) => <Cifra dur={d} n="4" bajada="habitaciones" />,
  D_banos: (d) => <Cifra dur={d} n="3.5" bajada="baños" />,
  D_sqft1: (d) => <Cifra dur={d} n="1,418" bajada="pies² con A/C" size={210} />,
  D_sqft2: (d) => <Cifra dur={d} n="2,100" bajada="pies² en total" size={210} />,
  D_puestos: (d) => <Cifra dur={d} n="2" bajada="estacionamientos" />,
  Terraza: (d) => <Golpe dur={d} arriba="espectacular" abajo="TERRAZA" bajo={<>en la <span style={{fontWeight: 900}}>AZOTEA</span></>} d={12} />,
  Listos: (d) => <Golpe dur={d} arriba="listos para" abajo="MUDARSE" />,
  Paquete: (d) => <Golpe dur={d} arriba="un paquete" abajo="COMPLETO" bajo={<>para quienes compran <span style={{fontWeight: 900, fontStyle: 'italic', color: MENTA}}>PARA VIVIR</span></>} d={22} />,
  Placa: (d, t0) => <Placa dur={d} t0={t0} />,
  Zona: (d) => <Golpe dur={d} arriba="la zona está" abajo="CRECIENDO" />,
  Cerca: (d, t0) => <Cerca dur={d} t0={t0} />,
  Cta: (d, t0) => <Cta dur={d} t0={t0} />,
};
const TIT = data.tit as unknown as [number, number, string][];

// ---------- subtítulos ----------
type Sub = {a: number; b: number; ws: [string, string][]; y: number; cam: boolean};
const palabra = (w: string, st: string, i: number) => {
  const base: React.CSSProperties = {display: 'inline-block', margin: '0 0.12em', letterSpacing: '-0.02em'};
  if (st === 'm') return <span key={i} style={{...base, fontWeight: 500, color: 'white'}}>{w}</span>;
  if (st === 'b') return <span key={i} style={{...base, fontWeight: 900, fontStyle: 'italic', color: 'white'}}>{w}</span>;
  if (st === 't') return <span key={i} style={{...base, fontWeight: 900, fontStyle: 'italic', color: MENTA}}>{w}</span>;
  return <span key={i} style={{...base, fontWeight: 900, fontSize: '1.2em', ...fuerte}}>{w}</span>;
};
const Subtitulo: React.FC<{s: Sub}> = ({s}) => {
  const {op, sc} = useIO(s.b - s.a, 5, 2);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 150, width: 780, top: s.y, transform: `translateY(${s.cam ? 0 : -50}%) scale(${sc})`,
        transformOrigin: s.cam ? '50% 0%' : '50% 50%', opacity: op, textAlign: 'center', fontFamily: OS, fontSize: 68, lineHeight: 1.0, filter: s.cam ? SOMBRA2 : SOMBRA}}>
        {s.ws.map(([w, st], i) => palabra(w, st, i))}
      </div>
    </AbsoluteFill>
  );
};
const SUBS = data.subs as unknown as Sub[];

const Guias: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 980, border: '3px solid rgba(255,0,0,0.8)'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'rgba(0,200,255,0.6)'}} />
  </AbsoluteFill>
);

export const ROC0211: React.FC<{guias?: boolean; audio?: boolean}> = ({guias, audio = true}) => (
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
    {TIT.map(([a, b, k], i) => (
      <Sequence key={'t' + i} from={a} durationInFrames={b - a}>
        {COMP[k](b - a, a)}
      </Sequence>
    ))}
    {guias && <Guias />}
    {audio && <Audio src={staticFile('roc0211/mix.wav')} />}
  </AbsoluteFill>
);
