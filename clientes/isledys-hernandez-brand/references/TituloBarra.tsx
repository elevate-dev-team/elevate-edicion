// Golpe con barra dorada (ref. del editor: 00 IMAGEN DE MARCA/03-10 ISM PAUTA Título pendiente.mp4, 2026-10-28).
// La barra entra desde el borde izquierdo de la pantalla, tapa la frase y sigue de largo hacia la derecha destapándola.
// Medido a 30 fps: borde derecho 0 → fin del texto en 5 frames, borde izquierdo sale en 5 frames más; el texto queda quieto, sin salida.
// Uso: <TituloBarra d={f(3.2 - o)}>3 PREGUNTAS</TituloBarra> dentro de un AbsoluteFill; top = centro del golpe.
import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';

const CREMA = '#F3E3A9', DORADO = '#E2A407';
const BOD = 'Bodoni URW';

export const TituloBarra: React.FC<{d: number; top?: number; size?: number; children: React.ReactNode}> = ({d, top = 1060, size = 112, children}) => {
  const t = useCurrentFrame() - d;
  if (t < 0) return null;
  // borde derecho de la barra (en % del ancho de pantalla) y borde izquierdo
  const der = interpolate(t, [0, 5], [0, 100], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const izq = interpolate(t, [5, 10], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const alto = size * 1.25;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: top - alto / 2, height: alto}}>
      {t >= 5 && (
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: BOD, fontWeight: 700, fontStyle: 'italic', fontSize: size, lineHeight: 1, color: CREMA,
            letterSpacing: '-0.03em', transform: 'scaleX(0.85)', whiteSpace: 'nowrap',
            textShadow: `0 0 6px rgba(226,164,7,0.95), 0 0 18px rgba(226,164,7,0.75), 0 0 34px rgba(226,164,7,0.4)`}}>
            {children}
          </div>
        </div>
      )}
      {izq < 100 && (
        <div style={{position: 'absolute', top: 0, bottom: 0, left: `${izq}%`, width: `${Math.max(0, der - izq)}%`, background: DORADO}} />
      )}
    </div>
  );
};
