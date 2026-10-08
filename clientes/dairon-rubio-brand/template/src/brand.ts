import {Easing, interpolate} from 'remotion';

// DAI — paleta oficial + óxido de los reels
export const C = {
	chocolate: '#34150F',
	cognac: '#86451E',
	arena: '#EACDA9',
	crema: '#FFF8F0',
	casiNegro: '#140E0B',
	oxido: '#6E2C16', // caja de resaltado
	oxidoLinea: '#78301A', // contornos de CTA / cifras
	blanco: '#FFFFFF',
};
export const CAJA = 'rgba(110,44,22,0.78)';

// Blacker Sans Text (Trial): una familia por peso. Itálicas SIN dígitos.
export const F = {
	reg: 'BS-Regular',
	heavy: 'BS-Heavy',
	black: 'BS-Black',
	xi: 'BS-ExtraboldItalic',
	hi: 'BS-HeavyItalic',
};

export const FPS = 25;
export const W = 1080;
export const H = 1920;
export const TOTAL = 47.44;
export const fr = (s: number) => Math.round(s * FPS);

// Zona segura de PAUTA (Meta): x 70–900, y 270–1250
export const SAFE = {top: 270, bottom: 1250, left: 70, right: 900};
export const CX = (SAFE.left + SAFE.right) / 2; // 485

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const EASE_INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const p01 = (t: number, a: number, b: number, ease = EASE_OUT) => interpolate(t, [a, b], [0, 1], {...clamp, easing: ease});

export const SHADOW = '0 4px 18px rgba(20,14,11,0.55), 0 2px 5px rgba(20,14,11,0.45)';

// Cortes duros del montaje (detectados) y bloque en negro
export const BLACK_A = 20.0;
export const BLACK_B = 43.28;
