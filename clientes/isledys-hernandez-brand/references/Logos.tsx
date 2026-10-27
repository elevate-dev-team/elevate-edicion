import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

// Logos obligatorios de Isledys (pedido del editor 2026-10-27, como el logo de DC): Equal Housing Opportunity arriba a la derecha
// y Pioneer Mortgage Funding abajo al centro, ambos al 50 %, todo el video, por encima de todo. Los títulos de arriba empiezan en y ≥ 300.
// `oscuros`: tramos [desde, hasta) en frames con fondo oscuro, donde el Equal Housing va en blanco (cambia solo en los cortes).
export const Logos: React.FC<{oscuros?: [number, number][]}> = ({oscuros = []}) => {
  const g = useCurrentFrame();
  const blanco = oscuros.some(([a, b]) => g >= a && g < b);
  return (
    <AbsoluteFill style={{opacity: 0.5}}>
      <Img src={staticFile(blanco ? 'ism/eho_blanco.png' : 'ism/eho_negro.png')} style={{position: 'absolute', left: 735, top: 90, width: 200}} />
      <Img src={staticFile('ism/pioneer_color.png')} style={{position: 'absolute', left: 540 - 230, top: 1600, width: 460}} />
    </AbsoluteFill>
  );
};
