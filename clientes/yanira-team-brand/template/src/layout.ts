import {interpolate} from 'remotion';
import {EASE_INOUT, EASE_OUT, H, SAFE, W, clamp} from './brand';
import faces from './data/faces.json';
import edit from './data/edit.json';

/* ================= Cara (seguimiento con Vision) =================
   faces.json: [t, cx, cy, w, h] normalizados sobre el cuadro 9:16 sin zoom. */
const F = faces as number[][];
export const faceAt = (t: number) => {
	let i = 0;
	while (i < F.length - 2 && F[i + 1][0] <= t) i++;
	const a = F[i];
	const b = F[Math.min(i + 1, F.length - 1)];
	const k = b[0] === a[0] ? 0 : Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0])));
	const L = (j: number) => a[j] + (b[j] - a[j]) * k;
	return {fx: L(1) * W, fy: L(2) * H, fw: L(3) * W, fh: L(4) * H};
};

/* ================= Pantalla dividida =================
   El speaker baja y arriba se abre un panel con el gráfico.
   edge = y del borde inferior del panel (lado izquierdo; baja 60 px hacia la derecha: la "\" del logo). */
export type Split = {a: number; b: number; edge: number};
export const SPLITS: Split[] = [
	{a: 0, b: 3.95, edge: 900},
	{a: 6.9, b: 16.45, edge: 900},
	{a: 21.0, b: 33.1, edge: 830},
	{a: 48.85, b: 52.5, edge: 860},
	{a: 59.6, b: 64.35, edge: 880},
];
const RAMP = 0.5;
export const splitAt = (t: number) => {
	let s = 0;
	let edge = 900;
	for (const w of SPLITS) {
		const v =
			w.a === 0
				? interpolate(t, [w.b, w.b + RAMP], [1, 0], {...clamp, easing: EASE_INOUT})
				: interpolate(t, [w.a - RAMP, w.a, w.b, w.b + RAMP], [0, 1, 1, 0], {...clamp, easing: EASE_INOUT});
		if (v > s) {
			s = v;
			edge = w.edge;
		}
	}
	return {s, edge};
};
/** Caja donde viven los gráficos del panel (dentro del margen seguro y por encima de la fila de subtítulos) */
export const panelBox = (edge: number) => ({left: SAFE.left, top: SAFE.top + 20, width: SAFE.right - SAFE.left, height: edge - 130 - (SAFE.top + 20)});
export const captionRowTop = (edge: number) => edge - 118;

/* ================= Cámara ================= */
// cortes reales (duros) + reencuadres virtuales (animados, más fluidos)
export const HARD_CUTS: number[] = edit.cuts;
export const SOFT_CUTS: number[] = [9.88, 20.38, 24.36, 36.12, 43.4, 50.1, 57.54, 64.2];
const BOUNDS = [...HARD_CUTS.map((t) => ({t, soft: false})), ...SOFT_CUTS.map((t) => ({t, soft: true}))].sort((a, b) => a.t - b.t);
// ancho objetivo de la cara (fracción del ancho) por plano: alterna abierto / cerrado
const TARGET_W = [0.17, 0.25, 0.2, 0.28, 0.18, 0.24, 0.21, 0.29, 0.19, 0.26];

export type Punch = {at: number; add: number; dur?: number; hold?: number};
export const PUNCHES: Punch[] = [
	{at: 8.94, add: 0.08, hold: 0.6},
	{at: 17.54, add: 0.1, hold: 0.5},
	{at: 65.24, add: 0.12, dur: 0.14, hold: 0.45},
];

const shotIndex = (t: number) => {
	let k = 0;
	while (k < BOUNDS.length && t >= BOUNDS[k].t) k++;
	return k;
};
const shotStart = (k: number) => (k === 0 ? 0 : BOUNDS[k - 1].t);
const shotEnd = (k: number) => (k < BOUNDS.length ? BOUNDS[k].t : shotStart(k) + 6);
const fullScaleForShot = (k: number) => {
	const fw = faceAt(shotStart(k) + 0.15).fw;
	return Math.max(1, Math.min(1.65, (TARGET_W[k % TARGET_W.length] * W) / fw));
};

export const camera = (t: number) => {
	const face = faceAt(t);
	const {s, edge} = splitAt(t);
	const k = shotIndex(t);
	const st = shotStart(k);
	// escala del modo completo
	let Sf = fullScaleForShot(k);
	const prevBound = BOUNDS[k - 1];
	if (prevBound?.soft) {
		const p = interpolate(t, [st, st + 0.45], [0, 1], {...clamp, easing: EASE_INOUT});
		Sf = fullScaleForShot(k - 1) + (Sf - fullScaleForShot(k - 1)) * p;
	}
	Sf += interpolate(t, [st, shotEnd(k)], [0, 0.035], clamp); // push-in continuo
	for (const p of PUNCHES) {
		const dur = p.dur ?? 0.2;
		const hold = p.hold ?? 0.8;
		const inP = interpolate(t, [p.at, p.at + dur], [0, 1], {...clamp, easing: EASE_OUT});
		const outP = interpolate(t, [p.at + dur + hold, p.at + dur + hold + 0.4], [0, 1], {...clamp, easing: EASE_INOUT});
		Sf += p.add * inP * (1 - outP);
	}
	const cover = (S: number, x: number, y: number, maxY = 0) => ({
		x: Math.min(0, Math.max(W - W * S, x)),
		y: Math.min(maxY, Math.max(H - H * S, y)),
	});
	// modo completo: cara cerca del centro y en el tercio superior
	const Xf = W / 2 + (face.fx - W / 2) * 0.35;
	const Yf = Math.max(600, 310 + 1.05 * face.fh * Sf, Math.min(760, face.fy)); // la cabeza nunca sube al margen superior
	const Tf = cover(Sf, Xf - Sf * face.fx, Yf - Sf * face.fy);
	// modo dividido: la cabeza entera queda debajo del borde del panel
	const room = 1440 - (edge + 70);
	const Ss = Math.max(1, Math.min(1.75, (0.24 * W) / face.fw, room / (1.8 * face.fh)));
	const Ys = edge + 70 + 1.05 * face.fh * Ss;
	const Ts = cover(Ss, W / 2 - Ss * face.fx, Ys - Ss * face.fy, edge - 40);
	const S = Sf + (Ss - Sf) * s;
	const T = {x: Tf.x + (Ts.x - Tf.x) * s, y: Tf.y + (Ts.y - Tf.y) * s};
	// caja de la cabeza en pantalla (cara + pelo + mentón): zona prohibida para gráficos
	const head = {
		left: T.x + S * (face.fx - 0.85 * face.fw),
		right: T.x + S * (face.fx + 0.85 * face.fw),
		top: T.y + S * (face.fy - 1.05 * face.fh),
		bottom: T.y + S * (face.fy + 0.75 * face.fh),
	};
	return {S, T, s, edge, head};
};
