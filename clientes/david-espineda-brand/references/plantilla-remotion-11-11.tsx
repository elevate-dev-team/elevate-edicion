import React from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, continueRender, delayRender, getInputProps, interpolate,
  spring, staticFile, useCurrentFrame,
} from 'remotion';

// DAE 11-11 "Lo que anoto todos los días en la obra" — David en su oficina (4 tomas, una por frase)
// + B-roll nuevo de Pexels + motion de marca: bitácora de obra y el cronograma real de lluvias de Premier Yacht.
export const FPS = 30;
export const DAE1111_FRAMES = 578;
const f = (s: number) => Math.round(s * FPS);
const props = getInputProps() as {guias?: boolean};
const GUIAS = Boolean(props.guias);

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
// tramos de voz (edl.json): [desde, hasta, toma, entrada en la fuente (s)]; tomas con exposición subida (_exp)
type Seg = [number, number, string, number];
const SEGS: Seg[] = [
  [0, 26, 'C1674', 0.983],
  [26, 82, 'C1674', 2.025],
  [82, 107, 'C1674', 4.271],
  [107, 134, 'C1674', 5.414],
  [134, 279, 'C1676', 1.283],
  [279, 318, 'C1676', 6.474],
  [318, 331, 'C1680', 2.224],
  [331, 378, 'C1680', 2.926],
  [378, 426, 'C1680', 4.769],
  [426, 483, 'C1680', 6.813],
  [483, 578, 'C1681', 1.846],
];
// zoom base por tramo (punch en "lo hago para vos" y "no te respondo"), anclado a los ojos (~570, 790)
const ZOOM: Record<number, number> = {0: 1.12, 26: 1.12, 82: 1.12, 107: 1.26, 134: 1.12, 279: 1.26, 318: 1.12, 331: 1.12, 378: 1.26, 426: 1.12, 483: 1.12};
const OJO: [number, number] = [570, 790];

// B-roll encima de la voz: [desde, hasta, archivo, entrada (s), zoom extra, origen]
type B = [number, number, string, number, number, string];
const BROLL: B[] = [
  [26, 58, 'px_7872723', 3.0, 1, '50% 50%'],     // llevo un registro → mano anotando
  [58, 82, 'px_39664848', 2.0, 1, '50% 50%'],    // qué pasó en la obra → albañiles
  [168, 203, 'px_39356771', 1.0, 1, '50% 50%'],  // distinto a lo planeado → paredes de ladrillo
  [203, 228, 'px_27047752', 1.0, 1, '50% 50%'],  // por el clima → lluvia
  [228, 256, 'px_8830592', 1.5, 1.7, '78% 100%'], // por un feriado → fecha marcada (zoom abajo: deja afuera los remedios y el "2021")
];
const MA: [number, number] = [256, 318]; // motion bitácora (8,55–10,60)
const MB: [number, number] = [400, 483]; // motion registro real (13,32–16,09)
const LEAKS = [82, 256, 318, 400, 483];
const ZBLUR = [26, 58, 107, 134, 168, 203, 228, 331, 378];
const pulso = (fr: number, c: number) => Math.max(0, 1 - Math.abs(fr - c + 0.5) / 3.5);
const zbAt = (g: number) => ZBLUR.reduce((m, c) => Math.max(m, pulso(g, c)), 0);

const Speaker: React.FC<{seg: Seg}> = ({seg}) => {
  const fr = useCurrentFrame();
  const [a, b, toma, src] = seg;
  const zb = zbAt(a + fr);
  const z = ZOOM[a] * interpolate(fr, [0, b - a], [1, 1.03]) * (1 + 0.16 * zb);
  return (
    <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${OJO[0]}px ${OJO[1]}px`, filter: zb > 0.05 ? `blur(${12 * zb}px)` : undefined}}>
      <OffthreadVideo src={staticFile(`dae1111/${toma}_exp.mp4`)} startFrom={Math.round(src * FPS)} muted />
    </AbsoluteFill>
  );
};
const Broll: React.FC<{b: B}> = ({b}) => {
  const fr = useCurrentFrame();
  const [a, e, file, src, zx, org] = b;
  const zb = zbAt(a + fr);
  const z = zx * interpolate(fr, [0, e - a], [1.0, 1.08]) * (1 + 0.16 * zb);
  return (
    <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: org, filter: zb > 0.05 ? `blur(${12 * zb}px)` : undefined}}>
      <OffthreadVideo src={staticFile(`dae1111/${file}.mp4`)} startFrom={Math.round(src * FPS)} muted />
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
  const op = interpolate(fr, [0, 1, Math.max(2, dur - outF), Math.max(3, dur)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return {fr, op};
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
// alturas: pegado bajo la caja de la cabeza medida (track_cara: fondo de la caja ≤ 977 px a 1×; con 1,12×1,03 → ~1005,
// con el punch 1,26×1,03 → ~1033); sobre B-roll, centro del cuadro; en los motion, pegado debajo del gráfico
const YD = 1068, YB = 960, YMA = 1060, YMB = 1150;
const SUBS: Sub[] = [
  [2.22, 2.80, 'en la *obra*.', YB],
  [2.80, 3.22, 'No lo *hago*', YD],
  [3.22, 3.66, 'para *mí*,', YD],
  [5.05, 5.61, 'se *construye*', YD],
  [5.61, 6.21, '*distinto*', YB],
  [6.21, 6.77, 'a lo *planeado*,', YB],
  [6.77, 7.61, 'por el *clima*,', YB],
  [7.61, 8.53, 'por un *feriado*', YB],
  [8.55, 9.29, 'o por lo que *sea*,', YMA],
  [9.29, 10.16, 'todo queda *anotado*', YMA],
  [10.16, 10.60, 'con *fecha*.', YMA],
  [10.60, 11.11, '*Así*,', YD],
  [11.11, 11.71, 'cuando *preguntás*', YD],
  [14.28, 14.94, 'Te *respondo*', YMB],
  [14.94, 15.62, 'con el *registro real*', YMB],
  [15.62, 16.09, 'de la *obra*.', YMB],
  [16.09, 17.01, 'Si tenés una *unidad*', YD],
  [17.01, 17.87, 'con *nosotros*,', YD],
];

// ---------- títulos ----------
const Bloque: React.FC<{y: number; dur: number; children: React.ReactNode}> = ({y, dur, children}) => {
  const {op} = useIO(dur);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: y, opacity: op, filter: SOMBRA,
        textAlign: 'center', fontFamily: OW, color: 'white', letterSpacing: '-0.02em'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};
const Pop: React.FC<{d: number; children: React.ReactNode; from?: number}> = ({d, children, from = 0.6}) => {
  const fr = useCurrentFrame() - d;
  const s = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 10, stiffness: 210}});
  return <div style={{opacity: fr < 0 ? 0 : Math.min(1, s * 1.6), transform: `scale(${fr < 0 ? from : interpolate(s, [0, 1], [from, 1])})`}}>{children}</div>;
};
const Sube: React.FC<{d: number; children: React.ReactNode}> = ({d, children}) => {
  const fr = useCurrentFrame() - d;
  const s = spring({frame: Math.max(0, fr), fps: FPS, config: {damping: 14, stiffness: 180}});
  return <div style={{opacity: fr < 0 ? 0 : Math.min(1, s * 1.4), transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`}}>{children}</div>;
};
// máquina de escribir celeste: cada palabra se tipea mientras se dice (tiempos relativos al inicio del bloque, en s)
type Tipo = [string, number, number][];
const Maquina: React.FC<{words: Tipo; size: number}> = ({words, size}) => {
  const t = useCurrentFrame() / FPS;
  const lines: React.ReactNode[][] = [[]];
  words.forEach(([w, a, b], i) => {
    if (w === '\n') { lines.push([]); return; }
    const n = Math.round(interpolate(t, [a, a + Math.min(0.32, Math.max(0.1, b - a))], [0, w.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
    lines[lines.length - 1].push(
      <span key={i} style={{display: 'inline-block', margin: '0 0.12em'}}>
        <span>{w.slice(0, n)}</span><span style={{opacity: 0}}>{w.slice(n)}</span>
      </span>);
  });
  const st: React.CSSProperties = {fontWeight: BLACK, fontSize: size, lineHeight: 1.0, color: CELESTE, whiteSpace: 'nowrap', ...CONTORNO(Math.round(size / 11))};
  return <>{lines.map((l, i) => <div key={i} style={st}>{l}</div>)}</>;
};
const Caja: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 60}) => (
  <div style={{display: 'inline-block', backgroundColor: 'rgba(10,29,56,0.85)', padding: '4px 14px 8px', fontWeight: REG, fontSize: size, lineHeight: 1, whiteSpace: 'nowrap'}}>{children}</div>
);

// ícono en cuadrado celeste (entra con escala y un giro corto)
const Icono: React.FC<{d: number; size?: number; children: React.ReactNode}> = ({d, size = 120, children}) => {
  const fr = useCurrentFrame() - d;
  if (fr < 0) return <div style={{width: size, height: size}} />;
  const s = spring({frame: fr, fps: FPS, config: {damping: 11, stiffness: 210}});
  return (
    <div style={{width: size, height: size, backgroundColor: CELESTE, opacity: Math.min(1, s * 1.5), boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      transform: `scale(${interpolate(s, [0, 1], [0.4, 1])}) rotate(${interpolate(s, [0, 1], [-12, 0])}deg)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 60 60">{children}</svg>
    </div>
  );
};
const Lluvia: React.FC<{fr: number}> = ({fr}) => (
  <>
    <path d="M17 32 a10 10 0 0 1 2-19.6 a13 13 0 0 1 24.5 3.4 a8.2 8.2 0 0 1 -0.5 16.2 Z" fill="white" />
    {[18, 30, 42].map((x, i) => {
      const ph = (fr * 1.4 + i * 6) % 16;
      return <line key={x} x1={x} x2={x - 3} y1={38 + ph} y2={45 + ph} stroke="white" strokeWidth={4} strokeLinecap="round" opacity={Math.max(0, 1 - ph / 18)} />;
    })}
  </>
);
const Calendario: React.FC = () => (
  <>
    <rect x={9} y={13} width={42} height={38} rx={4} fill="none" stroke="white" strokeWidth={5} />
    <rect x={9} y={13} width={42} height={11} fill="white" />
    <line x1={20} x2={20} y1={7} y2={17} stroke="white" strokeWidth={5} strokeLinecap="round" />
    <line x1={40} x2={40} y1={7} y2={17} stroke="white" strokeWidth={5} strokeLinecap="round" />
    <text x={30} y={46} textAnchor="middle" fontFamily={OW} fontWeight={BLACK} fontSize={19} fill="white">F</text>
  </>
);
// ícono arriba del subtítulo centrado (bloque ícono + subtítulo con ~50 px entre ambos)
const ICO_TOP = 960 - 38 - 50 - 120;
const IconoClima: React.FC<{dur: number}> = ({dur}) => {
  const {fr, op} = useIO(dur, 2);
  return <AbsoluteFill><div style={{position: 'absolute', left: 480, top: ICO_TOP, opacity: op}}><Icono d={0}><Lluvia fr={fr} /></Icono></div></AbsoluteFill>;
};
const IconoFeriado: React.FC<{dur: number}> = ({dur}) => {
  const {op} = useIO(dur, 2);
  return <AbsoluteFill><div style={{position: 'absolute', left: 480, top: ICO_TOP, opacity: op}}><Icono d={0}><Calendario /></Icono></div></AbsoluteFill>;
};

// hook: "Todos los días" a máquina de escribir + "llevo un / REGISTRO" (bajo el mentón; sigue sobre la mano que anota)
const T1: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={1050} dur={dur}>
    <Maquina size={90} words={[['Todos', 0.02, 0.26], ['los', 0.28, 0.4], ['días', 0.42, 0.62]]} />
    <div style={{height: 14}} />
    <Sube d={f(0.94)}><Caja>llevo un</Caja></Sube>
    <Pop d={f(1.28)}>
      <div style={{fontWeight: BLACK, fontSize: 128, lineHeight: 1.0, whiteSpace: 'nowrap', color: 'white', ...CONTORNO(8)}}>REGISTRO</div>
    </Pop>
  </Bloque>
);
// "lo hago para / VOS." (golpe a cámara con el punch)
const T2: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={1062} dur={dur}>
    <Sube d={0}><Caja>lo <span style={{fontWeight: BLACK}}>hago</span> para</Caja></Sube>
    <Pop d={f(4.22 - 3.64)}>
      <div style={{fontWeight: BLACK, fontSize: 150, lineHeight: 1.0, whiteSpace: 'nowrap', color: CELESTE, ...CONTORNO(9)}}>VOS.</div>
    </Pop>
  </Bloque>
);
// "por el plazo / de entrega," a máquina de escribir + "no te respondo" en caja (se arma al decirse)
const T3: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={1064} dur={dur}>
    <Maquina size={84} words={[['por', 0.0, 0.1], ['el', 0.1, 0.2], ['plazo', 0.2, 0.42], ['\n', 0, 0], ['de', 0.44, 0.5], ['entrega,', 0.5, 0.8]]} />
    <div style={{height: 16}} />
    <Sube d={f(12.66 - 11.69)}><Caja>no te <span style={{fontWeight: BLACK}}>respondo</span></Caja></Sube>
  </Bloque>
);
// CTA: "pedime la / bitácora / de tu obra." a máquina de escribir (rápida: queda entera ~0,7 s antes del final)
const T4: React.FC<{dur: number}> = ({dur}) => (
  <Bloque y={1046} dur={dur}>
    <Maquina size={92} words={[['pedime', 0.02, 0.22], ['la', 0.24, 0.32], ['\n', 0, 0], ['bitácora', 0.34, 0.56], ['\n', 0, 0], ['de', 0.58, 0.64], ['tu', 0.64, 0.7], ['obra.', 0.7, 0.82]]} />
  </Bloque>
);

const TITULOS: [number, number, (d: number) => React.ReactNode][] = [
  [0.0, 2.22, (d) => <T1 dur={d} />],
  [3.64, 5.05, (d) => <T2 dur={d} />],
  [11.69, 13.32, (d) => <T3 dur={d} />],
  [17.87, 19.27, (d) => <T4 dur={d} />],
  [6.77, 7.61, (d) => <IconoClima dur={d} />],
  [7.61, 8.53, (d) => <IconoFeriado dur={d} />],
];

// ---------- fondo de los motion: navy con grilla celeste que se desliza ----------
const FondoMarca: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 70% at 50% 42%, #143562 0%, #0A1D38 58%, #050f20 100%)'}}>
      <AbsoluteFill style={{opacity: 0.5, backgroundImage: 'linear-gradient(rgba(52,159,226,0.10) 2px, transparent 2px), linear-gradient(90deg, rgba(52,159,226,0.10) 2px, transparent 2px)',
        backgroundSize: '90px 90px', backgroundPosition: `${-frame * 0.6}px ${frame * 0.3}px`}} />
    </AbsoluteFill>
  );
};
const sp = (fr: number, d = 14, s = 190) => (fr < 0 ? 0 : spring({frame: fr, fps: FPS, config: {damping: d, stiffness: s}}));

// ---------- MOTION A: bitácora de obra (8,55–10,60) — filas reales del cronograma de lluvias ----------
// lun 16/03/2026: 216,6 mm (mayor lluvia diaria); jue 02/04/2026: feriado nacional; mar 14/04/2026: 73,0 mm
const FILAS: [string, string, string, 'lluvia' | 'feriado', number][] = [
  ['lun', '16/03', 'Lluvia · 216,6 mm', 'lluvia', 8.62],
  ['jue', '02/04', 'Feriado nacional', 'feriado', 9.02],
  ['mar', '14/04', 'Lluvia · 73,0 mm', 'lluvia', 9.40],
];
const CW = 720, CH = 470, CT = YMA - 38 - 50 - CH; // la tarjeta termina ~50 px arriba del subtítulo
const MotionA: React.FC = () => {
  const frame = useCurrentFrame();
  const t = MA[0] / FPS + frame / FPS;
  const ent = sp(frame - 1, 14, 170);
  const out = interpolate(t, [10.46, 10.60], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fecha = f(10.16) - MA[0];
  return (
    <AbsoluteFill>
      <FondoMarca />
      <div style={{position: 'absolute', left: 540 - CW / 2, top: CT, width: CW, height: CH, opacity: Math.min(1, ent * 1.5) * out,
        transform: `scale(${interpolate(ent, [0, 1], [0.85, 1])})`, backgroundColor: 'rgba(6,18,38,0.85)', border: '2px solid rgba(52,159,226,0.4)',
        boxShadow: '0 24px 70px rgba(0,0,0,0.5)', boxSizing: 'border-box', fontFamily: OW, color: 'white', letterSpacing: '-0.01em'}}>
        <div style={{position: 'absolute', left: 40, top: 30, fontSize: 36, fontWeight: REG, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.85)'}}>
          BITÁCORA DE <span style={{fontWeight: BLACK, color: 'white'}}>OBRA</span>
        </div>
        <div style={{position: 'absolute', right: 40, top: 36, fontSize: 26, fontWeight: MED, color: CELESTE}}>Premier Yacht</div>
        <div style={{position: 'absolute', left: 40, right: 40, top: 92, height: 2, backgroundColor: 'rgba(255,255,255,0.18)'}} />
        {FILAS.map(([dia, fe, txt, tipo, at], i) => {
          const k = sp(frame - (f(at) - MA[0]), 13, 200);
          const hl = sp(frame - fecha - i * 2, 12, 220);
          const top = 122 + i * 112;
          return (
            <div key={i} style={{position: 'absolute', left: 40, right: 40, top, height: 92, display: 'flex', alignItems: 'center', gap: 22,
              opacity: Math.min(1, k * 1.5), transform: `translateX(${(1 - k) * 40}px)`, borderBottom: '2px dashed rgba(255,255,255,0.10)'}}>
              <div style={{position: 'relative', width: 180, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{position: 'absolute', inset: 0, backgroundColor: CELESTE, transform: `scaleX(${hl})`, transformOrigin: 'left'}} />
                <div style={{position: 'relative', fontSize: 40, whiteSpace: 'nowrap'}}>
                  <span style={{fontWeight: REG, fontSize: 30, color: hl > 0.5 ? 'white' : 'rgba(255,255,255,0.7)'}}>{dia} </span>
                  <span style={{fontWeight: BLACK}}>{fe}</span>
                </div>
              </div>
              <div style={{width: 64, height: 64, backgroundColor: tipo === 'lluvia' ? 'rgba(52,159,226,0.25)' : 'rgba(215,180,120,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width={44} height={44} viewBox="0 0 60 60">{tipo === 'lluvia' ? <Lluvia fr={frame} /> : <Calendario />}</svg>
              </div>
              <div style={{fontSize: 40, fontWeight: MED, whiteSpace: 'nowrap'}}>
                {txt.split(' · ').map((p, j) => j === 0 ? <span key={j}>{p}</span> : <span key={j} style={{fontWeight: BLACK}}> · {p}</span>)}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- MOTION B: "con una sensación" → el registro real (13,32–16,09) ----------
// documento: anexo LL-01 del cronograma de obra de Premier Yacht (lluvias y feriados, oct 2025 – oct 2026)
const DW = 660, DH = Math.round(660 * 1838 / 2600), DT = 380;
const STATS: [string, number, number, string, number][] = [
  ['mm', 1482.3, 1, 'de lluvia', 14.94],
  ['', 53, 0, 'jornadas|por lluvia', 15.18],
  ['', 15, 0, 'feriados', 15.42],
];
const fmt = (v: number, dec: number) => {
  const [e, d] = v.toFixed(dec).split('.');
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (d ? ',' + d : '');
};
const MotionB: React.FC = () => {
  const frame = useCurrentFrame();
  const t = MB[0] / FPS + frame / FPS;
  // fase 1: "con una / sensación." borrosa que se tacha
  const k1 = sp(frame - 1, 13, 190);
  const o1 = interpolate(t, [14.12, 14.28], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const blur = 3.5 + 2.5 * Math.sin(frame * 0.7);
  const tacha = interpolate(t, [13.92, 14.08], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  // fase 2: documento
  const d0 = f(14.26) - MB[0];
  const kd = sp(frame - d0, 15, 160);
  const zoomDoc = interpolate(t, [14.5, 16.09], [1, 1.03], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sello = sp(frame - (f(15.36) - MB[0]), 9, 260);
  const out = interpolate(t, [15.98, 16.09], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <FondoMarca />
      {t < 14.3 && (
        <div style={{position: 'absolute', left: 0, width: 1080, top: 700, textAlign: 'center', fontFamily: OW, color: 'white', letterSpacing: '-0.02em',
          opacity: Math.min(1, k1 * 1.5) * o1, transform: `scale(${interpolate(k1, [0, 1], [0.9, 1])})`, filter: SOMBRA}}>
          <Caja>con una</Caja>
          <div style={{position: 'relative', width: 'fit-content', margin: '10px auto 0'}}>
            <div style={{fontWeight: BLACK, fontSize: 140, lineHeight: 1.0, whiteSpace: 'nowrap', filter: `blur(${blur}px)`, opacity: 0.9}}>sensación.</div>
            <div style={{position: 'absolute', left: -10, top: '52%', height: 14, width: `${tacha * 104}%`, backgroundColor: CELESTE, boxShadow: '0 4px 12px rgba(0,0,0,0.4)'}} />
          </div>
        </div>
      )}
      {frame >= d0 && (
        <div style={{opacity: out}}>
          <div style={{position: 'absolute', left: 540 - DW / 2, top: DT, width: DW, height: DH, opacity: Math.min(1, kd * 1.6),
            transform: `translateY(${(1 - kd) * 120}px) rotate(${interpolate(kd, [0, 1], [-6, -1.5])}deg) scale(${zoomDoc})`, transformOrigin: '50% 30%',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)', backgroundColor: 'white'}}>
            <Img src={staticFile('dae1111/registro.png')} style={{width: DW, height: DH, display: 'block'}} />
            {/* sello "REGISTRO REAL" en "real" */}
            <div style={{position: 'absolute', right: 26, bottom: 30, opacity: sello > 0 ? Math.min(1, sello * 2) : 0,
              transform: `rotate(-9deg) scale(${interpolate(sello, [0, 1], [1.8, 1])})`, transformOrigin: 'center',
              border: `6px solid ${CELESTE}`, padding: '6px 16px 10px', fontFamily: OW, fontWeight: BLACK, fontSize: 42, color: CELESTE,
              backgroundColor: 'rgba(255,255,255,0.88)', letterSpacing: '0.02em', whiteSpace: 'nowrap'}}>REGISTRO REAL</div>
          </div>
          {/* cifras del anexo */}
          <div style={{position: 'absolute', left: 540 - 360, width: 720, top: DT + DH + 42, display: 'flex', gap: 15}}>
            {STATS.map(([u, v, dec, txt, at], i) => {
              const k = sp(frame - (f(at) - MB[0]), 11, 210);
              const cnt = interpolate(frame - (f(at) - MB[0]), [0, 14], [0, v], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
              return (
                <div key={i} style={{flex: 1, height: 168, backgroundColor: 'rgba(6,18,38,0.9)', border: '2px solid rgba(52,159,226,0.45)', boxSizing: 'border-box',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: OW, color: 'white',
                  opacity: Math.min(1, k * 1.5), transform: `scale(${interpolate(k, [0, 1], [0.6, 1])})`, boxShadow: '0 12px 30px rgba(0,0,0,0.4)'}}>
                  <div style={{fontWeight: BLACK, fontSize: 48, lineHeight: 1, color: CELESTE, whiteSpace: 'nowrap'}}>
                    {fmt(cnt, dec)}{u && <span style={{fontSize: 28, fontWeight: MED, color: 'white'}}> {u}</span>}
                  </div>
                  <div style={{fontWeight: REG, fontSize: 30, lineHeight: 1.0, marginTop: 8, whiteSpace: 'nowrap', textAlign: 'center', color: 'rgba(255,255,255,0.88)'}}>{txt.split('|').map((l, j) => <div key={j}>{l}</div>)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Guias: React.FC = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px dashed #00ff66'}} />
    <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, backgroundColor: 'rgba(0,255,255,0.5)'}} />
  </AbsoluteFill>
);

export const DAE1111: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    {SEGS.map((s) => <Sequence key={'v' + s[0]} from={s[0]} durationInFrames={s[1] - s[0]}><Speaker seg={s} /></Sequence>)}
    {BROLL.map((b) => <Sequence key={'b' + b[0]} from={b[0]} durationInFrames={b[1] - b[0]}><Broll b={b} /></Sequence>)}
    <Sequence from={MA[0]} durationInFrames={MA[1] - MA[0]}><MotionA /></Sequence>
    <Sequence from={MB[0]} durationInFrames={MB[1] - MB[0]}><MotionB /></Sequence>
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
    {!GUIAS && <Audio src={staticFile('dae1111/mix.wav')} />}
  </AbsoluteFill>
);
