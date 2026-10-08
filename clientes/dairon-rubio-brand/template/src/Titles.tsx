import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, CX, EASE_IN, EASE_OUT, F, SHADOW, clamp, p01} from './brand';

// Texto crema con contorno óxido grueso (ubicación, cifras, CTA)
export const outlined = (size: number, stroke = 9): React.CSSProperties => ({
	fontFamily: F.black,
	fontSize: size,
	lineHeight: 1,
	color: C.crema,
	WebkitTextStroke: `${stroke}px ${C.oxidoLinea}`,
	paintOrder: 'stroke fill',
	letterSpacing: '0.01em',
	textShadow: '0 8px 22px rgba(20,14,11,0.45)',
});

const inOut = (t: number, a: number, b: number) => {
	const i = p01(t, a, a + 0.22);
	const o = interpolate(t, [b - 0.1, b], [1, 0], {...clamp, easing: EASE_IN});
	return {i, o: Math.min(i, o)};
};

export const Titles: React.FC = () => {
	const {fps} = useVideoConfig();
	const t = useCurrentFrame() / fps;
	return (
		<>
			{/* "en MIRAMAR" — la ubicación, debajo de la cara */}
			{t >= 2.7 && t < 3.59 && (() => {
				const {i, o} = inOut(t, 2.7, 3.59);
				return (
					<div style={{position: 'absolute', left: CX, top: 1060, transform: `translate(-50%,-50%)`, opacity: o, textAlign: 'center'}}>
						<div style={{fontFamily: F.reg, fontSize: 60, color: C.blanco, textShadow: SHADOW, lineHeight: 0.85, marginBottom: 10, transform: `translateY(${(1 - i) * 18}px)`}}>en</div>
						<div style={{...outlined(122), lineHeight: 0.85, transform: `scale(${0.8 + 0.2 * i})`}}>MIRAMAR</div>
					</div>
				);
			})()}
			{/* "32 AÑOS" */}
			{t >= 5.94 && t < 6.69 && (() => {
				const {i, o} = inOut(t, 5.94, 6.69);
				return (
					<div style={{position: 'absolute', left: CX, top: 1010, transform: `translate(-50%,-50%) scale(${0.75 + 0.25 * i})`, opacity: o, whiteSpace: 'nowrap', fontFamily: F.black, fontSize: 150, lineHeight: 1, color: C.blanco, textShadow: SHADOW}}>
						32 <span style={{fontSize: 96}}>AÑOS</span>
					</div>
				);
			})()}
			{/* CTA — arriba de las cabezas */}
			{t >= 43.36 && (() => {
				const a = p01(t, 43.36, 43.6);
				const b = p01(t, 43.78, 44.05);
				return (
					<div style={{position: 'absolute', left: CX, top: 350, transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap'}}>
						<div style={{fontFamily: F.reg, fontSize: 62, color: C.blanco, textShadow: SHADOW, lineHeight: 0.85, opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>
							Escríbenos por
						</div>
						<div style={{...outlined(116, 10), lineHeight: 0.85, marginTop: 12, opacity: b, transform: `scale(${0.7 + 0.3 * b})`}}>WHATSAPP</div>
					</div>
				);
			})()}
		</>
	);
};
