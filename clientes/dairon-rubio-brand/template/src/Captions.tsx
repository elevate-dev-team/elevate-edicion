import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {SUB_Y} from './BlackScenes';
import {C, CAJA, CX, EASE_OUT, F, SHADOW, clamp} from './brand';

/* Subtítulos DAI: bloque entero (sin karaoke), 1–3 palabras, minúscula tipo oración.
   r = Regular (relleno) · h = Heavy (palabra clave) · i = Extrabold Italic (emoción, nunca con dígitos) */
type Part = [string, 'r' | 'h' | 'i'];
type Cap = {s: number; e: number; p: Part[]; box?: boolean};
const c = (s: number, e: number, txt: string, box = false): Cap => ({
	s,
	e,
	box,
	p: txt.split(' ').map((w) => (w.startsWith('*') ? [w.slice(1), 'h'] : w.startsWith('_') ? [w.slice(1), 'i'] : [w, 'r'])) as Part[],
});

// los tramos que dice un título/gráfico en pantalla no llevan subtítulo (MIRAMAR, 32 AÑOS, checklist, net sheet, "con números", WhatsApp)
export const CAPS: Cap[] = [
	c(0.05, 0.96, 'Vender la *casa'),
	c(0.96, 1.92, 'donde _criaste'),
	c(1.92, 2.7, 'a tus *hijos'),
	c(3.59, 4.24, '_duele.'),
	c(4.24, 4.97, 'Lo *sé porque'),
	c(4.97, 5.94, 'llevo viviendo'),
	c(6.69, 7.62, 'en la *zona.'),
	c(7.74, 8.29, 'Y ese _cariño'),
	c(8.29, 8.93, 'es *justo lo que'),
	c(8.93, 9.38, 'hace que'),
	c(9.38, 10.07, 'muchas *casas'),
	c(10.07, 10.58, 'se queden'),
	c(10.58, 11.5, '*sin *vender.', true),
	c(11.62, 12.21, 'El *comprador'),
	c(12.21, 12.69, 'no paga'),
	c(12.69, 13.68, 'los _recuerdos,'),
	c(13.68, 14.52, 'paga el *techo,'),
	c(14.52, 15.29, 'las *ventanas'),
	c(15.29, 15.92, 'de *impacto'),
	c(15.92, 16.88, 'y la *cocina.'),
	c(16.96, 17.55, 'Así decides'),
	c(17.55, 18.48, 'con *números,'),
	c(18.48, 19.95, 'no con _nostalgia.', true),
	c(20.08, 20.44, 'Por eso antes'),
	c(20.44, 21.46, 'de ponerle *precio,'),
	c(21.46, 22.42, 'buscamos las *casas'),
	c(22.42, 23.26, 'que se *vendieron'),
	c(23.26, 24.04, 'en tu *comunidad'),
	c(24.04, 24.34, 'en los'),
	c(25.3, 25.94, 'Y te mostramos'),
	c(25.94, 27.2, 'en cuánto *cerraron.'),
	c(27.27, 27.79, 'Después'),
	c(27.79, 28.59, '*recorremos'),
	c(28.59, 29.63, 'tu casa _contigo'),
	c(29.63, 30.43, 'y te decimos'),
	c(31.95, 33.07, 'antes de ponerla'),
	c(33.07, 34.0, 'en *venta.'),
	c(34.1, 34.43, 'Y te damos'),
	c(34.43, 35.0, 'por *escrito'),
	c(35.0, 35.72, 'cuánto te queda'),
	c(35.72, 36.18, 'en la *mano'),
	c(36.18, 37.06, 'después de pagar'),
	c(44.26, 45.02, 'y te decimos'),
	c(45.02, 46.25, 'cuánto *recibirías'),
	c(46.25, 47.44, 'por tu *casa.'),
];

// altura (centro de la línea) según el plano: siempre debajo del mentón medido; en el CTA arriba de las cabezas
export const capY = (t: number) => {
	if (t < 4.2) return 1050;
	if (t < 11.56) return 1010;
	if (t < 16.88) return 1160;
	if (t < 20.0) return 1195;
	if (t < 43.28) return SUB_Y; // bloque en negro: pegado debajo del gráfico centrado
	return 615;
};

const FAM = {r: F.reg, h: F.heavy, i: F.xi};

export const Captions: React.FC = () => {
	const {fps} = useVideoConfig();
	const t = useCurrentFrame() / fps;
	const cap = CAPS.find((k) => t >= k.s && t < k.e);
	if (!cap) return null;
	const k = interpolate(t, [cap.s, cap.s + 0.12], [0, 1], {...clamp, easing: EASE_OUT});
	const y = capY(t);
	return (
		<div
			style={{
				position: 'absolute',
				left: CX,
				top: y,
				transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * k})`,
				opacity: k,
				whiteSpace: 'nowrap',
				fontSize: 82,
				lineHeight: 1,
				color: C.blanco,
				textShadow: cap.box ? 'none' : SHADOW,
				background: cap.box ? CAJA : 'none',
				padding: cap.box ? '12px 24px 16px' : 0,
				borderRadius: 12,
			}}
		>
			{cap.p.map(([w, s], i) => (
				<span key={i} style={{fontFamily: FAM[s], letterSpacing: s === 'r' ? '-0.01em' : '-0.02em'}}>
					{w}
					{i < cap.p.length - 1 ? ' ' : ''}
				</span>
			))}
		</div>
	);
};
