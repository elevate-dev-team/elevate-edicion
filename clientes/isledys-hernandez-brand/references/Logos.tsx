import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

// Logos obligatorios de Isledys (pedido del editor 2026-10-27, como el logo de DC): Equal Housing Opportunity arriba a la derecha
// y Pioneer Mortgage Funding abajo al centro, todo el video, por encima de todo. Opacidad 90 % desde el 04-10 (la clienta no los veía bien al 50 %). Los títulos de arriba empiezan en y ≥ 300.
// Abajo, desde el 2026-10-28 (editor): placa Pioneer + NMLS #1924019 (`pioneer_nmls.png`, recortada del verde de "LOGO ELEGIDO .png"), siempre al 100 %
// porque trae su propia placa. `pioneerViejo`: el Pioneer color sin placa, solo para re-renderizar el 01-10 y el 03-10 tal como se aprobaron.
// `oscuros`: tramos [desde, hasta) en frames con fondo oscuro, donde el Equal Housing va en blanco (cambia solo en los cortes).
// `fondo`: opción B del 04-10 con el Equal Housing sobre placa blanca, bordes redondeados al 20 % del lado corto (va siempre en negro).
const PLACA = (x: number, y: number, w: number, h: number, pad: number): React.CSSProperties => ({
  position: 'absolute', left: x - pad, top: y - pad, width: w + 2 * pad, height: h + 2 * pad,
  borderRadius: Math.round(0.2 * (Math.min(w, h) + 2 * pad)), backgroundColor: 'white', boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
});
export const Logos: React.FC<{oscuros?: [number, number][]; opacidad?: number; fondo?: boolean; pioneerViejo?: boolean}> = ({
  oscuros = [], opacidad = 0.9, fondo = false, pioneerViejo = false,
}) => {
  const g = useCurrentFrame();
  const blanco = !fondo && oscuros.some(([a, b]) => g >= a && g < b);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: opacidad}}>
        {fondo && <div style={PLACA(735, 90, 200, 192, 16)} />}
        <Img src={staticFile(blanco ? 'ism/eho_blanco.png' : 'ism/eho_negro.png')} style={{position: 'absolute', left: 735, top: 90, width: 200}} />
        {pioneerViejo && <Img src={staticFile('ism/pioneer_color.png')} style={{position: 'absolute', left: 540 - 230, top: 1600, width: 460}} />}
      </AbsoluteFill>
      {/* placa 686×272 → 460×182, centrada donde estaba el Pioneer viejo (centro y ≈ 1683) */}
      {!pioneerViejo && (
        <Img src={staticFile('ism/pioneer_nmls.png')}
          style={{position: 'absolute', left: 540 - 230, top: 1592, width: 460, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.28))'}} />
      )}
    </AbsoluteFill>
  );
};
