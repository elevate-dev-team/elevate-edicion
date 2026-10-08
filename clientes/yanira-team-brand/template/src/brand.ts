import type React from 'react';
import {Easing, interpolate, spring} from 'remotion';

// Yanira Team — paleta del manual + extensión para video (oscuro premium + oro metálico)
export const C = {
	dorado: '#866C4A',
	arena: '#C1AA8C',
	gris: '#DDDDDD',
	blanco: '#FFFFFF',
	negro: '#000000',
	oroClaro: '#D9BF94',
	tinta: '#15120F', // fondo oscuro cálido de paneles
	tinta2: '#221D18',
	humo: 'rgba(255,255,255,0.62)', // texto secundario sobre oscuro
	whatsapp: '#25D366',
};

// Oro metálico para números y palabras clave (usar con goldText)
export const GOLD_GRAD = 'linear-gradient(180deg, #F1DDB6 0%, #D2B282 38%, #A98A5C 70%, #866C4A 100%)';
export const goldText: React.CSSProperties = {
	backgroundImage: GOLD_GRAD,
	WebkitBackgroundClip: 'text',
	backgroundClip: 'text',
	color: 'transparent',
};

export const FONT = 'Montserrat';
// Interletrado e interlineado BAJOS (regla de marca)
export const TRACK = '-0.02em';
export const TRACK_TIGHT = '-0.04em';
export const LH = 0.92;

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const f = (sec: number) => Math.round(sec * FPS);

/* ---------- MÁRGENES SEGUROS (IG Reels / TikTok / YT Shorts) ----------
   Nada de texto, gráfico o logo fuera de este rectángulo.
   arriba 270 · abajo 480 · izquierda 70 · derecha 180 (botones de like/comentar/compartir) */
export const SAFE = {top: 270, bottom: 1440, left: 70, right: 900};
export const SAFE_W = SAFE.right - SAFE.left; // 830
export const SAFE_CX = (SAFE.left + SAFE.right) / 2; // 485

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1); // expo-out: entradas
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0); // salidas
export const EASE_INOUT = Easing.bezier(0.65, 0, 0.35, 1); // movimientos de cámara / páginas
export const EASE_SMOOTH = Easing.bezier(0.33, 1, 0.68, 1);

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const prog = (frame: number, a: number, b: number, ease = EASE_OUT) =>
	interpolate(frame, [a, b], [0, 1], {...clamp, easing: ease});

/** spring fluido (sin rebote brusco). damping alto = más sedoso */
export const pop = (frame: number, fps: number, delay = 0, damping = 20, mass = 0.8, stiffness = 140) =>
	spring({frame: frame - delay, fps, config: {damping, mass, stiffness}});

export const textShadow = '0 6px 24px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.4)';
