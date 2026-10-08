import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SAFE, SAFE_CX, TRACK, clamp, pop, textShadow} from './brand';
import {captionRowTop, splitAt} from './layout';

export type Word = {t: string; s: number; e: number};

const KEEP_CASE = /^(Florida|Yanira|Team|WhatsApp)$/;
const clean = (t: string) => {
	const bare = t.replace(/[.,!?¡¿;:]/g, '');
	return KEEP_CASE.test(bare) ? bare : bare.toLowerCase();
};

/** Bloques de máx. 3 palabras, cortando en puntuación o pausas */
export const chunkWords = (words: Word[], maxWords = 3, maxChars = 15) => {
	const chunks: Word[][] = [];
	let cur: Word[] = [];
	words.forEach((w, i) => {
		const prev = words[i - 1];
		const gap = prev ? w.s - prev.e : 0;
		const chars = cur.map((x) => x.t).join(' ').length + w.t.length;
		if (cur.length && (cur.length >= maxWords || chars > maxChars || gap > 0.35 || /[.,!?]$/.test(prev?.t ?? ''))) {
			chunks.push(cur);
			cur = [];
		}
		cur.push(w);
	});
	if (cur.length) chunks.push(cur);
	return chunks;
};

// Posición: modo completo y≈1300 (dentro del margen inferior de 480 px);
// con panel abierto se desliza a la fila inferior del panel, lejos de la cara.
const FULL_TOP = 1296;

export const Captions: React.FC<{words: Word[]; hide: [number, number][]}> = ({words, hide}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	if (hide.some(([a, b]) => t >= a && t < b)) return null;
	const chunks = chunkWords(words);
	const idx = chunks.findIndex((c, i) => {
		const next = chunks[i + 1];
		const end = next ? Math.min(next[0].s, c[c.length - 1].e + 0.6) : c[c.length - 1].e + 0.6;
		return t >= c[0].s - 0.05 && t < end;
	});
	if (idx < 0) return null;
	const chunk = chunks[idx];
	const {s, edge} = splitAt(t);
	const top = interpolate(s, [0, 1], [FULL_TOP, captionRowTop(edge)]);
	const size = interpolate(s, [0, 1], [74, 62]);
	const chunkStart = Math.round((chunk[0].s - 0.05) * fps);
	const enter = pop(frame, fps, chunkStart, 18, 0.5, 220);
	return (
		<div
			style={{
				position: 'absolute',
				left: SAFE.left,
				width: SAFE.right - SAFE.left,
				top,
				display: 'flex',
				justifyContent: 'center',
				flexWrap: 'nowrap',
				gap: 2,
				fontFamily: FONT,
				fontWeight: 700,
				fontSize: size,
				letterSpacing: TRACK,
				lineHeight: 1,
				color: C.blanco,
				textShadow,
				transform: `translateY(${(1 - enter) * 26}px) scale(${0.94 + 0.06 * enter})`,
				opacity: Math.min(1, enter * 1.6),
				transformOrigin: `${SAFE_CX - SAFE.left}px 50%`,
			}}
		>
			{chunk.map((w, i) => {
				const active = t >= w.s - 0.03 && (i === chunk.length - 1 ? true : t < chunk[i + 1].s - 0.03);
				const hp = pop(frame, fps, Math.round((w.s - 0.03) * fps), 16, 0.4, 260);
				return (
					<span key={i} style={{position: 'relative', padding: '8px 12px 12px', whiteSpace: 'nowrap'}}>
						{active && (
							<span
								style={{
									position: 'absolute',
									inset: 0,
									background: 'linear-gradient(180deg, #A2845A 0%, #866C4A 100%)',
									borderRadius: 14,
									transform: `scale(${interpolate(hp, [0, 1], [0.7, 1], clamp)})`,
									boxShadow: '0 8px 22px rgba(0,0,0,0.3)',
								}}
							/>
						)}
						<span style={{position: 'relative'}}>{clean(w.t)}</span>
					</span>
				);
			})}
		</div>
	);
};
