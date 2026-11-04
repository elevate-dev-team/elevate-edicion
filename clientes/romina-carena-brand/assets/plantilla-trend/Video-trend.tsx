import React from 'react';
import {AbsoluteFill, OffthreadVideo, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';

// ROC 04-11 — trend "Yo cuando mi cliente me necesita" (sin voz). Base de imagen armada con PROYECTO/base.py.
export const FPS = 30;
export const ROC0411_FRAMES = 398;
const P = 0.4918;
const fb = (k: number) => Math.round(k * P * FPS);  // frame del beat k
export const PING = 174;          // llega el mensaje (≈5,8 s)
const CUT2 = fb(22);              // corte a la toma 2 (whip ya en la base)
const SALVIA = 'rgba(60,123,101,0.77)';
const OS = 'Open Sauce One';

const FONTS: [string, string, string][] = [
  ['OpenSauceOne-Medium.ttf', '500', 'normal'], ['OpenSauceOne-SemiBold.ttf', '600', 'normal'],
  ['OpenSauceOne-Bold.ttf', '700', 'normal'], ['OpenSauceOne-BlackItalic.ttf', '900', 'italic'],
];
const fh = delayRender('fuentes');
Promise.all(FONTS.map(([file, weight, style]) =>
  new FontFace(OS, `url(${staticFile('fonts/' + file)})`, {weight, style}).load().then((ff) => document.fonts.add(ff))))
  .then(() => continueRender(fh));

const Titulo: React.FC = () => {
  const frame = useCurrentFrame();
  const s = spring({frame: frame - 1, fps: FPS, config: {damping: 11, stiffness: 160}});
  const s2 = spring({frame: frame - 6, fps: FPS, config: {damping: 10, stiffness: 170}});
  return (
    <div style={{position: 'absolute', top: 1125, left: 0, width: 1080, display: 'flex', justifyContent: 'center'}}>
      <div style={{background: SALVIA, borderRadius: 28, padding: "18px 40px 16px", textAlign: 'center',
        transform: `scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 1.5), transformOrigin: '540px 50%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)'}}>
        <div style={{fontFamily: OS, fontWeight: 500, fontSize: 50, color: 'white', letterSpacing: '-0.02em', lineHeight: 1,
          textShadow: '0 2px 8px rgba(0,0,0,0.35)'}}>Yo cuando mi cliente</div>
        <div style={{fontFamily: OS, fontWeight: 900, fontStyle: 'italic', fontSize: 94, color: 'white', letterSpacing: '-0.025em',
          lineHeight: 0.92, marginTop: 4, transform: `scale(${0.7 + 0.3 * s2})`, opacity: Math.min(1, s2 * 1.5),
          textShadow: '0 0 18px rgba(255,255,255,0.75), 0 0 6px rgba(255,255,255,0.5)'}}>ME NECESITA</div>
      </div>
    </div>
  );
};

const IconoWA: React.FC = () => (
  <svg width={78} height={78} viewBox="0 0 78 78">
    <rect width={78} height={78} rx={18} fill="#25D366" />
    <path d="M39 15c-13.3 0-24 10.4-24 23.3 0 4.4 1.3 8.6 3.6 12.1L15.5 62l12-3.1c3.4 1.8 7.4 2.9 11.5 2.9 13.3 0 24-10.4 24-23.3S52.3 15 39 15z"
      fill="none" stroke="white" strokeWidth={4.2} strokeLinejoin="round" />
    <path d="M30.2 27.5c.6-.1 1.4 0 1.8.9l2.1 4.9c.2.6.1 1.2-.3 1.7l-1.6 1.8c1.6 3.2 4.2 5.8 7.5 7.4l1.8-1.7c.5-.4 1.1-.5 1.7-.3l4.9 2.1c.8.4 1.1 1.2.9 1.9-.6 2.4-2.8 4.1-5.3 3.8-8.7-1-15.6-7.9-16.6-16.6-.3-2.5 1.4-4.7 3.1-5.9z" fill="white" />
  </svg>
);

const Notificacion: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < PING || frame >= CUT2) return null;
  const s = spring({frame: frame - PING, fps: FPS, config: {damping: 13, stiffness: 190}});
  const y = interpolate(s, [0, 1], [-260, 0]);
  return (
    <div style={{position: 'absolute', top: 285 + y, left: 180, width: 720, opacity: Math.min(1, s * 2),
      transform: `scale(${0.92 + 0.08 * s})`, transformOrigin: '50% 0%'}}>
      <div style={{display: 'flex', gap: 20, padding: '20px 22px', borderRadius: 34, background: 'rgba(246,246,248,0.86)',
        backdropFilter: 'blur(28px)', boxShadow: '0 12px 40px rgba(0,0,0,0.28)', alignItems: 'flex-start'}}>
        <IconoWA />
        <div style={{flex: 1, fontFamily: 'system-ui, -apple-system, ' + OS, color: '#111'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <span style={{fontWeight: 700, fontSize: 31}}>Cliente</span>
            <span style={{fontSize: 25, color: '#6b6b70'}}>ahora</span>
          </div>
          <div style={{fontSize: 29, lineHeight: 1.22, marginTop: 4, color: '#1c1c1e'}}>
            Hola Romi, tengo unas dudas con respecto al proceso, ¿podemos vernos ahora?
          </div>
        </div>
      </div>
    </div>
  );
};

export const ROC0411: React.FC<{guias?: boolean}> = ({guias}) => {
  const frame = useCurrentFrame();
  // zoom lento mientras lee el mensaje (anclado a la cara, ojos ≈ 430,740); se suelta en el whip
  const z = frame >= fb(11) && frame < CUT2
    ? interpolate(frame, [fb(11), PING, CUT2], [1, 1.02, 1.12], {easing: Easing.inOut(Easing.quad)}) : 1;
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '430px 740px'}}>
        <OffthreadVideo src={staticFile('roc0411/base.mp4')} muted />
      </AbsoluteFill>
      <Notificacion />
      <Titulo />
      {guias && <div style={{position: 'absolute', left: 70, top: 270, width: 830, height: 1170, border: '3px solid lime'}} />}
    </AbsoluteFill>
  );
};
