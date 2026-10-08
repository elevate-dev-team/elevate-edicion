import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import {clamp} from './brand';

// Glitch RGB: la escena se dibuja 3 veces (un canal por copia) y se suma en "screen";
// las copias se desplazan y se cortan en franjas unos cuadros alrededor del corte.
export const GLITCHES = [20.0, 39.95, 43.28];
export const GLITCH_HALF = 0.14;
export const glitchAmt = (t: number) => {
	for (const g of GLITCHES) {
		const a = interpolate(t, [g - GLITCH_HALF, g, g + GLITCH_HALF], [0, 1, 0], clamp);
		if (a > 0) return {a, seed: Math.round(t * 25)};
	}
	return null;
};

export const ChannelDefs: React.FC = () => (
	<svg width="0" height="0" style={{position: 'absolute'}}>
		<filter id="chR" colorInterpolationFilters="sRGB">
			<feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
		</filter>
		<filter id="chG" colorInterpolationFilters="sRGB">
			<feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
		</filter>
		<filter id="chB" colorInterpolationFilters="sRGB">
			<feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
		</filter>
	</svg>
);

export const Glitch: React.FC<{a: number; seed: number; render: () => React.ReactNode}> = ({a, seed, render}) => {
	const off = 26 * a;
	const r = (k: number) => random(`g${seed}-${k}`);
	const bands = [0, 1].map((k) => ({y: r(k) * 1800, h: 60 + r(k + 10) * 220, dx: (r(k + 20) - 0.5) * 140 * a}));
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{filter: 'url(#chR)', transform: `translateX(${-off}px)`}}>{render()}</AbsoluteFill>
			<AbsoluteFill style={{filter: 'url(#chG)', mixBlendMode: 'screen'}}>{render()}</AbsoluteFill>
			<AbsoluteFill style={{filter: 'url(#chB)', mixBlendMode: 'screen', transform: `translateX(${off}px)`}}>{render()}</AbsoluteFill>
			{bands.map((b, i) => (
				<AbsoluteFill key={i} style={{clipPath: `inset(${b.y}px 0 ${Math.max(0, 1920 - b.y - b.h)}px 0)`, transform: `translateX(${b.dx}px)`}}>
					{render()}
				</AbsoluteFill>
			))}
			<AbsoluteFill style={{background: `repeating-linear-gradient(0deg, rgba(255,255,255,${0.05 * a}) 0 2px, transparent 2px 6px)`}} />
		</AbsoluteFill>
	);
};

// Flash cálido (light leak) — arena/cognac en "screen"
export const FLASHES = [27.25, 29.63, 31.9, 34.05];
export const Flash: React.FC<{t: number}> = ({t}) => {
	let a = 0;
	for (const g of FLASHES) a = Math.max(a, interpolate(t, [g - 0.12, g, g + 0.3], [0, 1, 0], clamp));
	if (a <= 0) return null;
	return (
		<AbsoluteFill
			style={{
				mixBlendMode: 'screen',
				opacity: a,
				background: 'radial-gradient(120% 70% at 20% 40%, rgba(255,236,205,0.95) 0%, rgba(234,205,169,0.7) 35%, rgba(134,69,30,0.35) 65%, rgba(0,0,0,0) 90%)',
			}}
		/>
	);
};
