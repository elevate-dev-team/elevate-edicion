import {interpolate} from 'remotion';
import {EASE_OUT, H, W, clamp} from './brand';
import faces from './data/faces.json' // copiar faces.example.json o generar con faces.swift;

/* Cámara virtual sobre el video ya montado.
   Cada plano: zoom lento alrededor de un ancla fija (A).
   Punch: zoom rápido alrededor de los ojos medidos con eyes.swift en ese instante,
   así los ojos quedan en el mismo punto de pantalla antes y después (x e y). */
type Punch = {at: number; eye: [number, number]; to: number; drift: number};
type Shot = {a: number; b: number; A: [number, number]; s0: number; s1: number; punch?: Punch};

export const SHOTS: Shot[] = [
	{a: 0, b: 4.2, A: [470, 780], s0: 1.0, s1: 1.1},
	{a: 4.2, b: 7.72, A: [600, 785], s0: 1.22, s1: 1.28},
	{a: 7.72, b: 9.44, A: [515, 742], s0: 1.12, s1: 1.22},
	{a: 9.44, b: 11.56, A: [540, 900], s0: 1.04, s1: 1.08},
	{a: 11.56, b: 16.88, A: [485, 840], s0: 1.0, s1: 1.02, punch: {at: 13.68, eye: [476.3, 850.5], to: 1.2, drift: 0.03}},
	{a: 16.88, b: 20.0, A: [549, 878], s0: 1.0, s1: 1.01},
	{a: 43.28, b: 47.44, A: [600, 900], s0: 1.0, s1: 1.02, punch: {at: 44.26, eye: [841.8, 996.3], to: 1.2, drift: 0.03}},
];
const PUNCH_DUR = 0.12; // 3 cuadros

const fit = (S: number, x: number, y: number) => ({x: Math.min(0, Math.max(W - W * S, x)), y: Math.min(0, Math.max(H - H * S, y))});

export const camera = (t: number) => {
	const sh = SHOTS.find((s) => t >= s.a && t < s.b) ?? SHOTS[SHOTS.length - 1];
	const baseS = (tt: number) => interpolate(tt, [sh.a, sh.b], [sh.s0, sh.s1], clamp);
	const [ax, ay] = sh.A;
	if (!sh.punch || t < sh.punch.at) {
		const S = baseS(t);
		return {S, T: fit(S, ax * (1 - S), ay * (1 - S))};
	}
	const p = sh.punch;
	const Sp = baseS(p.at);
	const P = {x: ax + Sp * (p.eye[0] - ax), y: ay + Sp * (p.eye[1] - ay)}; // ojos en pantalla antes del punch
	const k = interpolate(t, [p.at, p.at + PUNCH_DUR], [0, 1], {...clamp, easing: EASE_OUT});
	const S = Sp + (p.to - Sp) * k + interpolate(t, [p.at + PUNCH_DUR, sh.b], [0, p.drift], clamp);
	return {S, T: fit(S, P.x - S * p.eye[0], P.y - S * p.eye[1])};
};

// caras detectadas (Vision) -> cajas de cabeza en pantalla, para las guías
const FR = faces as number[][];
export const headsAt = (t: number) => {
	let best = FR[0];
	for (const r of FR) if (Math.abs(r[0] - t) < Math.abs(best[0] - t)) best = r;
	const {S, T} = camera(t);
	const out: {l: number; r: number; t: number; b: number}[] = [];
	for (let i = 1; i + 3 < best.length; i += 4) {
		const [cx, cy, w, h] = [best[i] * W, best[i + 1] * H, best[i + 2] * W, best[i + 3] * H];
		out.push({l: T.x + S * (cx - 0.85 * w), r: T.x + S * (cx + 0.85 * w), t: T.y + S * (cy - 1.05 * h), b: T.y + S * (cy + 0.75 * h)});
	}
	return out;
};
