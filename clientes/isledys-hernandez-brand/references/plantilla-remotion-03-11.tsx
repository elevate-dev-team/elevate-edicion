// ISM 03-11 PAUTA "Solo para Realtors" — ACABADO.
// Sistema de Isledys (skill isledys-hernandez-brand §4): golpes crema con glow y barra dorada, subtítulos chicos en pastilla navy
// arriba de la cabeza (selfie con la cara abajo, pared gris clara), azul Pioneer / celeste / dorado / crema, Bodoni URW + Montserrat.
// Motion: M1 casa PENDING + chat sin respuesta (azul), M2 ¿el cierre VA o NO VA? (su plano desenfocado), M3 celular con notificaciones (celeste).
// Audio: se mezcla aparte (mezcla.py) y se muxea.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import data from './data.json';
import SUBS from './subs.json';
import {Logos} from '../ism/Logos';
import {TituloBarra} from '../ism/TituloBarra';

export const FPS = 30;
export const ISM0311_FRAMES = 763; // v4: CTA nuevo (RECURSOS/nuevo CTA.mov, solo audio)
const f = (s: number) => Math.round(s * FPS);
const AZUL = '#073FA7', CELESTE = '#CDE5F4', DORADO = '#E2A407', CREMA = '#F3E3A9', HUESO = '#F5F5F0';
const MON = 'Montserrat', BOD = 'Bodoni URW';
const GLOW = '0 0 6px rgba(226,164,7,0.95), 0 0 18px rgba(226,164,7,0.75), 0 0 34px rgba(226,164,7,0.4)';
const SOMBRA = '0 2px 10px rgba(0,10,40,0.65), 0 0 2px rgba(0,10,40,0.6)';
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const FONTS: [string, string, string, string][] = [
  [MON, 'Montserrat-Medium.ttf', '500', 'normal'], [MON, 'Montserrat-SemiBold.ttf', '600', 'normal'],
  [MON, 'Montserrat-Bold.ttf', '700', 'normal'], [MON, 'Montserrat-Black.ttf', '900', 'normal'],
  [MON, 'Montserrat-BlackItalic.ttf', '900', 'italic'], [MON, 'Montserrat-BoldItalic.ttf', '700', 'italic'],
  [BOD, 'BodoniURW-BolObl.otf', '700', 'italic'], [BOD, 'BodoniURW-Bol.otf', '700', 'normal'], [BOD, 'BodoniURW-Med.otf', '500', 'normal'],
  [BOD, 'BodoniURW-RegObl.otf', '400', 'italic'],
];
const fontHandle = delayRender('fuentes');
Promise.all(FONTS.map(([fam, file, weight, style]) =>
  new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight, style}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fontHandle));

// ---------- tiempos (s de salida) ----------
const M1 = [2.9667, 5.7], M2 = [12.55, 13.95], M3 = [16.07, 19.0667];
const BR1 = [7.0333, 8.45], BR2 = [8.45, 10.1];
const CORTES = [7.0333, 8.45, 10.1, 11.6, 19.0667, 22.0333]; // zoom-blur
const LEAKS = [2.9667, 7.0333];
const CTA0 = 22.40;
const CTA_PLANO = 22.0333; // v3: desde acá solo audio + texto, sin ella (corrección del editor 19-11)
const DY = 428;          // bloque del CTA centrado en y ≈ 960

type Seg = {a: number; b: number; o: number};
const SEGS = data.segs as Seg[];
const OJOS = data.ojos as number[][];
const PLANOS = data.planos as number[][];
const ojo = (t: number): [number, number] => {
  const v = OJOS.filter((r) => Math.abs(r[0] - t) <= 0.3);
  if (!v.length) return [540, 1160];
  return [v.reduce((s, r) => s + r[1], 0) / v.length, v.reduce((s, r) => s + r[2], 0) / v.length];
};
const srcDe = (s: number) => {
  const seg = SEGS.find((x) => s >= x.o && s < x.o + (x.b - x.a)) ?? SEGS[SEGS.length - 1];
  return {seg, src: seg.a + (s - seg.o)};
};
const encuadre = (s: number) => {
  const p = PLANOS.find(([a, b]) => s >= a && s < b) ?? PLANOS[PLANOS.length - 1];
  const k = interpolate(s, [p[0], p[1]], [p[2], p[3]], {...CL, easing: Easing.inOut(Easing.sin)});
  const [ex, ey] = ojo(srcDe(s).src);
  return {k, ex, ey};
};

const Ella: React.FC = () => {
  const s = useCurrentFrame() / FPS;
  const {k, ex, ey} = encuadre(s);
  const desenf = s >= M2[0] && s < M2[1];
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: 'black'}}>
      {SEGS.map((x, i) => (
        <Sequence key={i} from={f(x.o)} durationInFrames={f(x.o + x.b - x.a) - f(x.o)}>
          <AbsoluteFill style={{transform: `scale(${desenf ? k * 1.08 : k})`, transformOrigin: `${ex}px ${ey}px`,
            filter: desenf ? 'blur(16px) brightness(0.8)' : undefined}}>
            <OffthreadVideo src={staticFile('ism0311/base1080.mp4')} startFrom={f(x.a)} muted />
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const Broll: React.FC<{src: string; dur: number; zoom?: [number, number]}> = ({src, dur, zoom = [1.0, 1.08]}) => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill style={{transform: `scale(${interpolate(g, [0, f(dur)], zoom)})`}}>
      <OffthreadVideo src={staticFile('ism0311/' + src)} muted />
    </AbsoluteFill>
  );
};

const FX: React.FC<{children: React.ReactNode}> = ({children}) => {
  const g = useCurrentFrame();
  let e = 0;
  for (const c of CORTES) e = Math.max(e, 1 - Math.abs(g - f(c) + 0.5) / 3.5);
  e = Math.max(0, e);
  const [ex, ey] = ojo(srcDe(g / FPS).src);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + 0.14 * e})`, transformOrigin: `${ex}px ${ey}px`, filter: e > 0 ? `blur(${9 * e}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

const Leak: React.FC = () => {
  const g = useCurrentFrame();
  const o = interpolate(g, [0, 4, 12], [0, 0.85, 0], CL);
  const x = interpolate(g, [0, 12], [20, 80]);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', opacity: o,
      background: `radial-gradient(ellipse 70% 55% at ${x}% 40%, rgba(255,190,90,0.95), rgba(226,140,20,0.5) 45%, rgba(0,0,0,0) 75%)`}} />
  );
};

// ---------- subtítulos ----------
type Sub = {s: number; e: number; w: string[]; k: string[]; m: string; y: number | null};
const Subtitulos: React.FC = () => {
  const g = useCurrentFrame();
  const t = g / FPS;
  const b = (SUBS as Sub[]).find((x) => t >= x.s && t < x.e);
  if (!b) return null;
  const d = g - f(b.s);
  const op = interpolate(d, [0, 4], [0, 1], CL), dy = interpolate(d, [0, 4], [14, 0], {...CL, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: b.y != null ? b.y : 960 - 40, display: 'flex', justifyContent: 'center',
      opacity: op, transform: `translateY(${dy}px)`}}>
      <div style={{fontFamily: MON, fontSize: 52, fontWeight: 500, color: 'white', lineHeight: 1.15, padding: '6px 20px 9px',
        borderRadius: 14, background: 'rgba(7,24,70,0.62)', textShadow: '0 1px 6px rgba(0,0,0,0.35)', whiteSpace: 'nowrap', maxWidth: 720}}>
        {b.w.map((w, i) => (
          <span key={i} style={b.k.includes(w) ? {fontWeight: 900, fontStyle: 'italic'} : undefined}>{w}{i < b.w.length - 1 ? ' ' : ''}</span>
        ))}
      </div>
    </div>
  );
};

const Linea: React.FC<{d: number; top: number; size?: number; children: React.ReactNode; color?: string; sombra?: boolean}> = ({d, top, size = 50, children, color = 'white', sombra = true}) => {
  const g = useCurrentFrame();
  const t = g - d;
  if (t < 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center', opacity: interpolate(t, [0, 5], [0, 1], CL),
      transform: `translateY(${interpolate(t, [0, 6], [16, 0], {...CL, easing: Easing.out(Easing.cubic)})}px)`,
      fontFamily: MON, fontWeight: 600, fontSize: size, color, textShadow: sombra ? SOMBRA : undefined, lineHeight: 1}}>
      {children}
    </div>
  );
};
const pop = (g: number, d: number, damping = 12, stiffness = 160) => (g >= d ? spring({frame: g - d, fps: FPS, config: {damping, stiffness}}) : 0);
const Bod: React.FC<{size: number; children: React.ReactNode; color?: string; glow?: boolean}> = ({size, children, color = CREMA, glow = true}) => (
  <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: size, color, textShadow: glow ? GLOW : undefined, display: 'inline-block',
    transform: 'scaleX(0.88)', letterSpacing: '-0.02em'}}>{children}</span>
);
const Fuerte: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <span style={{fontFamily: MON, fontWeight: 900, fontSize: size, color: AZUL, WebkitTextStroke: `${Math.round(size / 12)}px white`, paintOrder: 'stroke fill',
    filter: 'drop-shadow(0 4px 10px rgba(0,10,40,0.45))', lineHeight: 1}}>{children}</span>
);
// velo suave detrás de los textos que van sobre la pared clara
const Velo: React.FC<{top: number; h: number}> = ({top, h}) => {
  const g = useCurrentFrame();
  return <div style={{position: 'absolute', left: 0, right: 0, top, height: h, opacity: interpolate(g, [0, 6], [0, 1], CL),
    background: 'radial-gradient(ellipse 62% 50% at 50% 50%, rgba(4,22,64,0.42), rgba(4,22,64,0) 100%)'}} />;
};

// ---------- íconos ----------
const st = {stroke: 'white', strokeWidth: 4.5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
const Ico: React.FC<{tipo: string; s?: number; c?: string}> = ({tipo, s = 54, c = 'white'}) => {
  const k = {...st, stroke: c};
  return (
    <svg width={s} height={s} viewBox="0 0 48 48">
      {tipo === 'casa' && <><path d="M6 22 L24 7 L42 22" {...k} /><path d="M11 19 v22 h26 v-22" {...k} /><rect x="20" y="28" width="8" height="13" {...k} /></>}
      {tipo === 'persona' && <><circle cx="24" cy="17" r="8" {...k} /><path d="M9 41 c2 -9 8 -13 15 -13 c7 0 13 4 15 13" {...k} /></>}
      {tipo === 'comentario' && <><path d="M8 9 h32 a4 4 0 0 1 4 4 v18 a4 4 0 0 1 -4 4 h-18 l-9 8 v-8 h-5 a4 4 0 0 1 -4 -4 v-18 a4 4 0 0 1 4 -4 z" {...k} /><path d="M15 20 h18 M15 27 h11" {...k} /></>}
      {tipo === 'doc' && <><path d="M12 5 h17 l9 9 v29 h-26 z" {...k} /><path d="M29 5 v9 h9 M18 24 h13 M18 31 h13" {...k} /></>}
      {tipo === 'lupa' && <><circle cx="21" cy="21" r="12" {...k} /><path d="M30 30 L41 41" {...k} /></>}
      {tipo === 'sello' && <><path d="M24 5 l16 6 v12 c0 10 -7 17 -16 20 c-9 -3 -16 -10 -16 -20 v-12 z" {...k} /><path d="M17 24 l5 5 l9 -10" {...k} /></>}
      {tipo === 'llave' && <><circle cx="15" cy="24" r="8" {...k} /><path d="M23 24 h19 M36 24 v7 M42 24 v5" {...k} /></>}
      {tipo === 'reloj' && <><circle cx="24" cy="25" r="17" {...k} /><path d="M24 15 v11 l7 5" {...k} /></>}
    </svg>
  );
};
const Check: React.FC<{t: number; s?: number}> = ({t, s = 58}) => {
  const k = spring({frame: t, fps: FPS, config: {damping: 11, stiffness: 160}});
  return (
    <div style={{width: s, height: s, borderRadius: s / 2, background: DORADO, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k})`, flexShrink: 0}}>
      <svg width={s * 0.58} height={s * 0.58} viewBox="0 0 34 34"><path d="M7 18 l7 7 l13 -15" stroke="white" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
};

// ---------- hook: "Si eres agente de / REAL ESTATE / seguramente esto ya lo viviste" ----------
const Hook: React.FC = () => (
  <>
    <Velo top={420} h={360} />
    <Linea d={f(0.04)} top={470} size={48}>Si eres agente de</Linea>
    <TituloBarra d={f(0.96) - 5} top={592} size={118}>REAL ESTATE</TituloBarra>
    <Linea d={f(1.61)} top={650} size={46}>
      <span style={{fontWeight: 500}}>seguramente esto </span><Bod size={58} color={HUESO} glow={false}><span style={{textShadow: SOMBRA}}>ya lo viviste</span></Bod>
    </Linea>
  </>
);

// ---------- M1 (azul): casa PENDING + chat con "tu lender" sin respuesta ----------
const MotionPending: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M1[0]);
  const rel = (s: number) => f(s) - base;
  const ent = interpolate(g, [0, 7], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const sal = interpolate(g, [f(M1[1]) - base - 5, f(M1[1]) - base], [0, 1], CL);
  const card = pop(g, rel(3.07), 13, 140);
  const ts = rel(3.63) - 2;
  const sl = g >= ts ? interpolate(g - ts, [0, 6], [2.3, 1], {...CL, easing: Easing.in(Easing.cubic)}) : 0;
  const shake = g >= ts + 6 && g < ts + 14 ? Math.sin((g - ts - 6) * 2.6) * (14 - (g - ts)) * 1.3 : 0;
  const chat = pop(g, rel(4.0), 14, 150);
  const msg = pop(g, rel(4.24), 11, 180);
  const visto = interpolate(g, [rel(4.62), rel(4.62) + 5], [0, 1], CL);
  const escribe = g >= rel(4.72) && g < rel(5.12);
  return (
    <AbsoluteFill style={{transform: `scale(${(1.12 - 0.12 * ent) * (1 + 0.15 * sal)})`, filter: `blur(${(1 - ent) * 10 + sal * 12}px)`, opacity: 1 - sal}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 48%, #0E55D0 0%, #073FA7 45%, #04245F 100%)'}} />
      <AbsoluteFill style={{opacity: 0.07, background: 'repeating-linear-gradient(135deg, white 0 2px, transparent 2px 26px)'}} />
      <Linea d={rel(2.99)} top={352} size={50} color={HUESO}>la propiedad <Bod size={64} color={HUESO} glow={false}>está</Bod></Linea>
      {/* tarjeta de la propiedad */}
      <div style={{position: 'absolute', left: 540 - 330, top: 440, width: 660, height: 280, borderRadius: 26, background: 'white',
        borderBottom: `7px solid ${DORADO}`, boxShadow: '0 16px 36px rgba(0,0,0,0.35)', transform: `scale(${card})`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 36, top: 36, width: 136, height: 136, borderRadius: 68, background: AZUL, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Ico tipo="casa" s={80} />
        </div>
        <div style={{position: 'absolute', left: 200, top: 46, fontFamily: MON, fontWeight: 700, fontSize: 28, letterSpacing: '0.2em', color: '#5d7390'}}>TU CLIENTE</div>
        <div style={{position: 'absolute', left: 200, top: 88, width: 380, height: 22, borderRadius: 11, background: '#dbe5f0'}} />
        <div style={{position: 'absolute', left: 200, top: 126, width: 280, height: 22, borderRadius: 11, background: '#e6edf5'}} />
      </div>
      {/* sello PENDING */}
      {g >= ts && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center',
          transform: `translate(${shake + 120}px, 0) rotate(-9deg) scale(${sl})`}}>
          <div style={{padding: '6px 26px 10px', borderRadius: 14, background: 'rgba(4,36,95,0.94)', border: `5px solid ${DORADO}`, boxShadow: '0 10px 24px rgba(0,0,0,0.45)'}}>
            <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 92, color: CREMA, textShadow: GLOW, display: 'inline-block',
              transform: 'scaleX(0.88)', letterSpacing: '0.01em', lineHeight: 1}}>PENDING</span>
          </div>
        </div>
      )}
      {/* chat con el lender */}
      <div style={{position: 'absolute', left: 540 - 330, top: 770, width: 660, height: 340, borderRadius: 26, background: 'rgba(255,255,255,0.10)',
        border: '2px solid rgba(255,255,255,0.22)', transform: `scale(${chat})`, opacity: Math.min(1, chat * 1.4), overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 92, background: 'rgba(4,30,80,0.55)', display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px'}}>
          <div style={{width: 60, height: 60, borderRadius: 30, background: '#8298AC', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico tipo="persona" s={40} /></div>
          <div style={{fontFamily: MON, fontWeight: 700, fontSize: 36, color: 'white'}}>Tu lender</div>
        </div>
        {g >= rel(4.24) && (
          <div style={{position: 'absolute', right: 26, top: 122, transform: `scale(${msg})`, transformOrigin: 'right bottom'}}>
            <div style={{background: CELESTE, borderRadius: '24px 24px 6px 24px', padding: '16px 24px', fontFamily: MON, fontWeight: 600, fontSize: 36, color: AZUL, whiteSpace: 'nowrap'}}>
              ¿Hay novedades del préstamo?
            </div>
            <div style={{textAlign: 'right', marginTop: 8, fontFamily: MON, fontWeight: 600, fontSize: 24, color: CELESTE, opacity: visto}}>Visto ✓✓</div>
          </div>
        )}
        {escribe && (
          <div style={{position: 'absolute', left: 26, top: 250, background: 'rgba(255,255,255,0.9)', borderRadius: '24px 24px 24px 6px', padding: '14px 22px', display: 'flex', gap: 10}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: '#8298AC', opacity: 0.4 + 0.6 * Math.abs(Math.sin((g + i * 3) / 3))}} />
            ))}
          </div>
        )}
      </div>
      <Linea d={rel(4.88)} top={1140} size={50} color={HUESO}>no te da <Bod size={86}>noticias</Bod></Linea>
    </AbsoluteFill>
  );
};

// ---------- "Yo también estuve / DE ESE LADO" ----------
const EseLado: React.FC = () => {
  const base = f(5.7);
  return (
    <>
      <Velo top={470} h={320} />
      <Linea d={f(5.78) - base} top={530} size={48}>Yo también <b style={{fontWeight: 900, fontStyle: 'italic'}}>estuve</b></Linea>
      <TituloBarra d={f(6.44) - base - 5} top={652} size={118}>DE ESE LADO</TituloBarra>
    </>
  );
};

// ---------- B-roll HOME FOR SALE: "Tuve mi licencia de / REALTOR" ----------
const Licencia: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(BR1[0]);
  const p = pop(g, f(7.89) - base - 1, 10, 190);
  return (
    <>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,22,64,0.55) 0%, rgba(4,22,64,0.35) 30%, rgba(4,22,64,0) 45%)', opacity: interpolate(g, [0, 5], [0, 1], CL)}} />
      <Linea d={f(7.05) - base} top={350} size={50}>Tuve mi <b style={{fontWeight: 900, fontStyle: 'italic'}}>licencia</b> de</Linea>
      {g >= f(7.89) - base - 1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 424, textAlign: 'center', transform: `scale(${0.8 + 0.2 * p})`, opacity: Math.min(1, p * 1.5)}}>
          <Fuerte size={124}>REALTOR</Fuerte>
        </div>
      )}
    </>
  );
};

// ---------- "REALTOR (tachado) / Hoy soy / LENDER" ----------
const HoyLender: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(10.1);
  const tach = interpolate(g, [f(10.30) - base, f(10.30) - base + 7], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  return (
    <>
      <Velo top={420} h={380} />
      <Linea d={0} top={462} size={34}>
        <span style={{position: 'relative', display: 'inline-block', fontWeight: 700, letterSpacing: '0.24em', color: HUESO, opacity: 0.9}}>
          REALTOR
          <span style={{position: 'absolute', left: -6, top: '50%', height: 5, width: `calc(${tach * 100}% + 4px)`, background: DORADO, borderRadius: 3}} />
        </span>
      </Linea>
      <Linea d={f(10.16) - base} top={530} size={48}>Hoy soy</Linea>
      <TituloBarra d={f(10.56) - base - 5} top={656} size={132}>LENDER</TituloBarra>
    </>
  );
};

// ---------- M2 (su plano desenfocado): "saber si el cierre ¿VA o NO VA?" ----------
const MotionVaNoVa: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M2[0]);
  const rel = (s: number) => f(s) - base;
  const ent = interpolate(g, [0, 7], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const sw = pop(g, rel(12.95), 13, 150);
  // la perilla oscila sin decidirse; en "va" se va a VA y en "no va" a NO VA
  const tNo = rel(13.60);
  // un solo movimiento: arranca en ¿VA? y en "o no va" pasa a ¿NO VA? y se queda (corrección del editor: oscilando iba demasiado rápido)
  const x = g >= tNo - 2 ? spring({frame: g - (tNo - 2), fps: FPS, config: {damping: 15, stiffness: 120}}) : 0; // 0 = VA, 1 = NO VA
  const W = 640;
  return (
    <AbsoluteFill style={{opacity: ent}}>
      <AbsoluteFill style={{background: 'rgba(4,22,64,0.72)'}} />
      <Linea d={rel(12.58)} top={560} size={48} color={HUESO}>saber si el</Linea>
      <Linea d={rel(13.12)} top={624} size={60}><Bod size={104}>cierre</Bod></Linea>
      <div style={{position: 'absolute', left: 540 - W / 2, top: 790, width: W, height: 142, borderRadius: 71, background: 'rgba(255,255,255,0.12)',
        border: `3px solid ${DORADO}`, transform: `scale(${sw})`, boxShadow: '0 12px 30px rgba(0,0,0,0.35)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: 10, bottom: 10, left: 10 + x * (W / 2 - 14), width: W / 2 - 6, borderRadius: 60,
          background: `linear-gradient(180deg, ${CREMA}, ${DORADO})`, boxShadow: '0 4px 12px rgba(0,0,0,0.35)'}} />
        {[['¿VA?', 1 - x], ['¿NO VA?', x]].map(([t, a], i) => (
          <div key={i} style={{position: 'absolute', left: i ? W / 2 : 0, width: W / 2, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: MON, fontWeight: 900, fontSize: 56, color: (a as number) > 0.5 ? AZUL : 'rgba(255,255,255,0.75)'}}>{t}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- "Por eso con mis Realtors / NO HAY SILENCIO" ----------
const Silencio: React.FC = () => {
  const base = f(14.0);
  return (
    <>
      <Velo top={470} h={320} />
      <Linea d={f(14.02) - base} top={530} size={48}>Por eso con mis <b style={{fontWeight: 900, fontStyle: 'italic'}}>Realtors</b></Linea>
      <TituloBarra d={f(15.23) - base - 5} top={652} size={92}>NO HAY SILENCIO</TituloBarra>
    </>
  );
};

// ---------- M3 (celeste): celular con las novedades del préstamo ----------
const NOTIS: {t: number; ico: string; tit: string}[] = [
  {t: 16.19, ico: 'doc', tit: 'Pre-aprobación'},
  {t: 16.85, ico: 'lupa', tit: 'Tasación'},
  {t: 17.29, ico: 'sello', tit: 'Underwriting'},
  {t: 17.87, ico: 'llave', tit: 'Clear to close'},
];
const MotionNotis: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(M3[0]);
  const rel = (s: number) => f(s) - base;
  const cort = interpolate(g, [0, 7], [1920, 0], {...CL, easing: Easing.out(Easing.cubic)});
  const sal = interpolate(g, [f(M3[1]) - base - 5, f(M3[1]) - base], [0, 1], CL);
  const tel = pop(g, rel(16.10), 14, 140);
  const PH = {x: 540 - 240, y: 500, w: 480, h: 640};
  const vis = NOTIS.filter((n) => g >= rel(n.t) - 1);
  return (
    <AbsoluteFill style={{transform: `translateY(${cort}px) scale(${1 + 0.15 * sal})`, filter: sal > 0 ? `blur(${sal * 12}px)` : undefined, opacity: 1 - sal}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #E6F2FB 0%, #CDE5F4 55%, #A8CAE3 100%)'}} />
      <AbsoluteFill style={{opacity: 0.07, background: `repeating-linear-gradient(135deg, ${AZUL} 0 2px, transparent 2px 28px)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 290, height: 6, background: DORADO}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1470, height: 6, background: DORADO}} />
      <Linea d={rel(16.05)} top={330} size={46} color={AZUL} sombra={false}>
        Les informo en <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 64}}>cada momento</span>
      </Linea>
      <Linea d={rel(17.19)} top={412} size={42} color={AZUL} sombra={false}>
        el estado del <b style={{fontWeight: 900}}>préstamo</b>
      </Linea>
      {/* celular */}
      <div style={{position: 'absolute', left: PH.x, top: PH.y, width: PH.w, height: PH.h, borderRadius: 58, background: '#0b1630', padding: 14, boxSizing: 'border-box',
        transform: `scale(${tel})`, boxShadow: '0 24px 50px rgba(7,40,100,0.35)'}}>
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 46, overflow: 'hidden',
          background: 'linear-gradient(180deg, #0E55D0 0%, #073FA7 55%, #04245F 100%)'}}>
          <div style={{position: 'absolute', left: '50%', top: 12, width: 120, height: 32, marginLeft: -60, borderRadius: 16, background: '#0b1630'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 62, textAlign: 'center', fontFamily: MON, fontWeight: 600, fontSize: 84, color: 'white', lineHeight: 1}}>9:41</div>
          {vis.map((n, j) => {
            const i = vis.length - 1 - j; // la más nueva arriba
            const d = g - (rel(n.t) - 1);
            const p = spring({frame: d, fps: FPS, config: {damping: 14, stiffness: 170}});
            const y = 180 + i * 104;
            return (
              <div key={n.tit} style={{position: 'absolute', left: 16, right: 16, top: y - (1 - p) * 60, height: 92, borderRadius: 22, background: 'rgba(255,255,255,0.94)',
                opacity: Math.min(1, p * 1.6), display: 'flex', alignItems: 'center', gap: 14, padding: '0 14px', boxSizing: 'border-box',
                transition: 'none', boxShadow: '0 6px 14px rgba(0,0,0,0.2)'}}>
                <div style={{width: 60, height: 60, borderRadius: 30, background: AZUL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  <Ico tipo={n.ico} s={36} />
                </div>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontFamily: MON, fontWeight: 800, fontSize: 27, color: AZUL, whiteSpace: 'nowrap', lineHeight: 1.1}}>{n.tit}</div>
                  <div style={{fontFamily: MON, fontWeight: 500, fontSize: 20, color: '#5d7390', whiteSpace: 'nowrap', marginTop: 3}}>préstamo de tu cliente</div>
                </div>
                <div style={{flexShrink: 0}}><Check t={d - 3} s={44} /></div>
              </div>
            );
          })}
        </div>
      </div>
      <Linea d={rel(18.33)} top={1170} size={56} color={AZUL} sombra={false}>
        <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 400}}>de sus </span>
        <span style={{fontFamily: BOD, fontStyle: 'italic', fontWeight: 700, fontSize: 66}}>clientes</span>
      </Linea>
    </AbsoluteFill>
  );
};

// ---------- "un lender que hable / TU IDIOMA" ----------
const Idioma: React.FC = () => {
  const base = f(20.53);
  return (
    <>
      <Velo top={470} h={320} />
      <Linea d={f(20.55) - base} top={530} size={48}>un <b style={{fontWeight: 900, fontStyle: 'italic'}}>lender</b> que hable</Linea>
      <TituloBarra d={f(21.40) - base - 5} top={652} size={124}>TU IDIOMA</TituloBarra>
    </>
  );
};

// fondo azul Pioneer del CTA (entra con zoom-blur en el corte)
const FondoCTA: React.FC = () => {
  const g = useCurrentFrame();
  const ent = interpolate(g, [0, 8], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  const lin = interpolate(g, [4, 16], [0, 1], {...CL, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{transform: `scale(${1.12 - 0.12 * ent + 0.03 * (g / 90)})`, filter: `blur(${(1 - ent) * 10}px)`}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #0E55D0 0%, #073FA7 45%, #04245F 100%)'}} />
      <AbsoluteFill style={{opacity: 0.07, background: 'repeating-linear-gradient(135deg, white 0 2px, transparent 2px 26px)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 48% 22% at 50% 50%, rgba(243,227,169,0.16), rgba(243,227,169,0) 100%)'}} />
      <div style={{position: 'absolute', left: 540 - 260 * lin, width: 520 * lin, top: 664, height: 4, background: DORADO, borderRadius: 2}} />
      <div style={{position: 'absolute', left: 540 - 260 * lin, width: 520 * lin, top: 1240, height: 4, background: DORADO, borderRadius: 2}} />
    </AbsoluteFill>
  );
};

// ---------- CTA nuevo (v4, solo audio de RECURSOS/nuevo CTA.mov): ESCRÍBEME / por [WhatsApp] / y te ayudo a cerrar / las VENTAS / con tus clientes ----------
// tiempos de salida de cada palabra (CTA src 26,77 s → salida 22,06 s)
const T_ESC = 22.09, T_WA = 22.62, T_AYUDO = 23.22, T_VENTAS = 23.98, T_CLIENTES = 24.47;
const WhatsApp: React.FC<{s: number}> = ({s}) => (
  <svg width={s} height={s} viewBox="0 0 48 48">
    <path d="M24 5 a19 19 0 0 1 0 38 a19 19 0 0 1 -9.5 -2.6 L6 43 l2.7 -8.2 A19 19 0 0 1 24 5 z" fill="none" stroke="white" strokeWidth={3.6} strokeLinejoin="round" />
    <path d="M17.5 14.5 c1 -0.6 2 -0.4 2.5 0.6 l1.6 3.6 c0.3 0.7 0.1 1.4 -0.4 1.9 l-1.2 1.2 c1.2 2.6 3.4 4.8 6 6 l1.2 -1.2 c0.5 -0.5 1.3 -0.7 1.9 -0.4 l3.6 1.6 c1 0.5 1.2 1.6 0.6 2.5 c-1.4 2.1 -3.4 3 -5.6 2.3 c-5.2 -1.7 -9.6 -6.1 -11.3 -11.3 c-0.7 -2.2 0.2 -4.2 2.3 -5.6 z" fill="white" />
  </svg>
);
const CTA: React.FC = () => {
  const g = useCurrentFrame();
  const base = f(CTA_PLANO);
  const r = (t: number) => f(t) - base;
  const p = pop(g, r(T_ESC) - 1, 10, 180);
  const pc = pop(g, r(T_WA) - 1, 10, 190);
  const pv = pop(g, r(T_VENTAS) - 1, 16, 210);
  const brillo = interpolate(g - (r(T_WA) + 6), [0, 16], [-30, 130], CL);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', transform: `scale(${p})`}}>
        <span style={{fontFamily: MON, fontWeight: 900, fontSize: 112, lineHeight: 1.25, background: `linear-gradient(180deg, #FFFFFF 0%, ${HUESO} 60%, #DCD8C8 100%)`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 4px 10px rgba(0,10,40,0.55))'}}>ESCRÍBEME</span>
      </div>
      {g >= r(T_WA) - 1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 846, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20}}>
          <span style={{fontFamily: MON, fontWeight: 600, fontSize: 48, color: HUESO, textShadow: SOMBRA, opacity: Math.min(1, pc * 1.5)}}>por</span>
          <div style={{position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 16, padding: '10px 34px 12px 24px', borderRadius: 48,
            background: AZUL, border: `4px solid ${DORADO}`, boxShadow: '0 10px 24px rgba(0,10,40,0.45)', transform: `scale(${pc})`}}>
            <WhatsApp s={58} />
            <span style={{fontFamily: MON, fontWeight: 900, fontSize: 58, color: 'white', letterSpacing: '0.01em', lineHeight: 1.1}}>WhatsApp</span>
            <div style={{position: 'absolute', top: 0, bottom: 0, left: `${brillo}%`, width: '22%', transform: 'skewX(-20deg)',
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))'}} />
          </div>
        </div>
      )}
      <Linea d={r(T_AYUDO)} top={970} size={46}>y te <b style={{fontWeight: 900, fontStyle: 'italic'}}>ayudo</b> a cerrar</Linea>
      {g >= r(T_VENTAS) - 1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1030, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14, lineHeight: 1,
          transform: `scale(${pv})`, transformOrigin: '540px 80%'}}>
          <span style={{fontFamily: MON, fontWeight: 600, fontSize: 46, color: 'white', textShadow: SOMBRA}}>las</span>
          <Bod size={92}>VENTAS</Bod>
        </div>
      )}
      <Linea d={r(T_CLIENTES)} top={1124} size={44}>con tus <b style={{fontWeight: 900, fontStyle: 'italic'}}>clientes</b></Linea>
    </AbsoluteFill>
  );
};

const Pie: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1184, display: 'flex', justifyContent: 'center', opacity: interpolate(g, [0, 6], [0, 1], CL)}}>
      <div style={{fontFamily: MON, fontWeight: 500, fontSize: 28, color: 'white', letterSpacing: '0.04em', background: 'rgba(7,30,80,0.6)', borderRadius: 8, padding: '6px 16px'}}>
        Mortgage Loan Originator NMLS# 1924019
      </div>
    </div>
    </AbsoluteFill>
  );
};

const Q = (a: number, b: number, el: React.ReactNode, k?: string) => <Sequence key={k} from={f(a)} durationInFrames={f(b) - f(a)}>{el}</Sequence>;
const FIN = ISM0311_FRAMES / FPS;

export const ISM0311: React.FC<{guias?: boolean}> = ({guias}) => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    <FX>
      <Ella />
      {Q(BR1[0], BR1[1], <Broll src="br_sale.mp4" dur={BR1[1] - BR1[0]} zoom={[1.0, 1.06]} />)}
      {Q(BR2[0], BR2[1], <Broll src="br_firma.mp4" dur={BR2[1] - BR2[0]} zoom={[1.02, 1.1]} />)}
      {Q(CTA_PLANO, FIN, <FondoCTA />)}
    </FX>
    {Q(0, M1[0], <Hook />)}
    {Q(5.7, BR1[0], <EseLado />)}
    {Q(BR1[0], BR1[1], <Licencia />)}
    {Q(10.1, 11.6, <HoyLender />)}
    {Q(M2[0], M2[1], <MotionVaNoVa />)}
    {Q(14.0, M3[0], <Silencio />)}
    {Q(20.53, CTA_PLANO, <Idioma />)}
    {Q(CTA_PLANO, FIN, <CTA />)}
    {Q(M1[0], M1[1] + 0.17, <MotionPending />)}
    {Q(M3[0], M3[1] + 0.17, <MotionNotis />)}
    <Subtitulos />
    {Q(FIN - 1.0, FIN, <Pie />)}
    {LEAKS.map((l, i) => Q(l - 0.13, l + 0.3, <Leak />, 'lk' + i))}
    <Logos oscuros={[[f(M1[0]), f(M1[1])], [f(M2[0]), f(M2[1])], [f(CTA_PLANO), ISM0311_FRAMES]]} />
    {guias && (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 980, border: '3px solid lime'}} />
        <div style={{position: 'absolute', left: 539, top: 0, width: 2, height: 1920, background: 'red', opacity: 0.6}} />
      </AbsoluteFill>
    )}
  </AbsoluteFill>
);
