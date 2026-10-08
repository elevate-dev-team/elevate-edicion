import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {C, EASE_IN, EASE_INOUT, EASE_OUT, FONT, H, LH, SAFE, TRACK, TRACK_TIGHT, W, clamp, goldText, pop, prog, textShadow} from '../brand';
import {camera, panelBox, splitAt} from '../layout';

/* ================= Íconos de línea (viewBox 0 0 100 100) ================= */
export const ICON = {
	house: 'M14 50 L50 18 L86 50 M24 42 L24 84 L76 84 L76 42 M42 84 L42 60 L58 60 L58 84',
	key: 'M30 58 m-16 0 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0 M46 58 L88 58 M76 58 L76 72 M86 58 L86 68',
	check: 'M22 52 L42 72 L80 30',
	x: 'M30 30 L70 70 M70 30 L30 70',
	pin: 'M50 90 C50 90 20 58 20 40 A30 30 0 0 1 80 40 C80 58 50 90 50 90 Z M50 30 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0',
	arrowUp: 'M50 86 L50 18 M28 40 L50 18 L72 40',
};

export const DrawIcon: React.FC<{d: string; size: number; color?: string; stroke?: number; start: number; dur?: number; style?: React.CSSProperties}> = ({
	d,
	size,
	color = C.oroClaro,
	stroke = 7,
	start,
	dur = 16,
	style,
}) => {
	const frame = useCurrentFrame();
	const p = prog(frame, start, start + dur, EASE_INOUT);
	const parts = d.split(/(?=M)/).filter(Boolean);
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', ...style}}>
			{parts.map((sub, i) => {
				const local = interpolate(p, [i / (parts.length + 1), Math.min(1, (i + 2) / (parts.length + 1))], [0, 1], clamp);
				let ev = {strokeDasharray: 'none', strokeDashoffset: 0} as {strokeDasharray: string; strokeDashoffset: number};
				try {
					ev = evolvePath(local, sub);
				} catch {
					/* subpath relativo */
				}
				return (
					<path key={i} d={sub} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} opacity={local > 0 ? 1 : 0} />
				);
			})}
		</svg>
	);
};

/* ================= Revelado con máscara (el texto sube desde una ranura) ================= */
export const Reveal: React.FC<{at: number; out?: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, out, dur = 16, children, style}) => {
	const frame = useCurrentFrame();
	const pin = prog(frame, at, at + dur, EASE_OUT);
	const pout = out ? prog(frame, out - 10, out, EASE_IN) : 0;
	return (
		<div style={{overflow: 'hidden', padding: '0.1em 0.05em 0.16em', margin: '-0.1em -0.05em -0.16em', ...style}}>
			<div
				style={{
					transform: `translateY(${(1 - pin) * 115 - pout * 115}%) rotate(${(1 - pin) * 3}deg)`,
					transformOrigin: '0% 100%',
					filter: `blur(${(1 - pin) * 6 + pout * 6}px)`,
					visibility: frame < at ? 'hidden' : 'visible',
				}}
			>
				{children}
			</div>
		</div>
	);
};

/** Palabra por palabra, escalonado */
export const Words: React.FC<{text: string; at: number; out?: number; stagger?: number; style?: React.CSSProperties; wordStyle?: (i: number) => React.CSSProperties}> = ({
	text,
	at,
	out,
	stagger = 3,
	style,
	wordStyle,
}) => (
	<div style={{display: 'flex', flexWrap: 'wrap', gap: '0 0.24em', ...style}}>
		{text.split(' ').map((w, i) => (
			<Reveal key={i} at={at + i * stagger} out={out}>
				<span style={wordStyle?.(i)}>{w}</span>
			</Reveal>
		))}
	</div>
);

/* ================= Etiqueta "eyebrow" ================= */
export const Eyebrow: React.FC<{at: number; out?: number; children: React.ReactNode}> = ({at, out, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = pop(frame, fps, at, 20, 0.6, 200);
	const o = out ? prog(frame, out - 8, out, EASE_IN) : 0;
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 12,
				padding: '10px 20px 11px',
				borderRadius: 40,
				border: '2px solid rgba(217,191,148,0.55)',
				background: 'rgba(134,108,74,0.2)',
				fontFamily: FONT,
				fontWeight: 700,
				fontSize: 26,
				letterSpacing: '0em',
				lineHeight: 1,
				color: C.oroClaro,
				textTransform: 'uppercase',
				opacity: Math.min(1, s * 1.4) * (1 - o),
				clipPath: `inset(0 ${(1 - s) * 100}% 0 0 round 40px)`,
			}}
		>
			<span style={{width: 10, height: 10, borderRadius: 5, background: C.oroClaro, boxShadow: `0 0 12px ${C.oroClaro}`, opacity: 0.55 + 0.45 * Math.sin(frame / 5)}} />
			{children}
		</div>
	);
};

/* ================= Contador ================= */
export const Counter: React.FC<{from?: number; to: number; a: number; b: number; prefix?: string; suffix?: string; style?: React.CSSProperties}> = ({
	from = 0,
	to,
	a,
	b,
	prefix = '',
	suffix = '',
	style,
}) => {
	const frame = useCurrentFrame();
	const v = interpolate(frame, [a, b], [from, to], {...clamp, easing: EASE_INOUT});
	return <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>{prefix + Math.round(v).toLocaleString('en-US') + suffix}</span>;
};

/* ================= Fondo oscuro de marca ================= */
export const DarkBg: React.FC<{seed?: number}> = ({seed = 0}) => {
	const frame = useCurrentFrame();
	const gx = 72 + Math.sin((frame + seed) / 45) * 16;
	const gy = 20 + Math.cos((frame + seed) / 60) * 10;
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse at ${gx}% ${gy}%, rgba(170,138,92,0.42) 0%, rgba(40,33,26,0) 55%), linear-gradient(180deg, #211B16 0%, ${C.tinta} 100%)`}}>
			<Topo color={C.arena} opacity={0.14} drift={Math.sin((frame + seed) / 90)} />
			<AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(217,191,148,0.16) 1.4px, transparent 1.6px)', backgroundSize: '34px 34px', backgroundPosition: `${(frame * 0.4) % 34}px 0px`, opacity: 0.5}} />
		</AbsoluteFill>
	);
};

/* ================= Panel superior (pantalla dividida) ================= */
export const TopPanel: React.FC<{children?: React.ReactNode}> = ({children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {s, edge} = splitAt(frame / fps);
	if (s <= 0.001) return null;
	const drop = 60;
	const y = -(edge + drop + 40) * (1 - s);
	const shimmer = ((frame * 16) % (W + 800)) - 400;
	return (
		<AbsoluteFill style={{transform: `translateY(${y}px)`}}>
			<AbsoluteFill style={{clipPath: `polygon(0 ${edge}px, ${W}px ${edge + drop}px, ${W}px ${edge + drop + 110}px, 0 ${edge + 110}px)`, background: 'linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0))'}} />
			<AbsoluteFill style={{clipPath: `polygon(0 0, ${W}px 0, ${W}px ${edge + drop}px, 0 ${edge}px)`}}>
				<DarkBg />
				{children}
			</AbsoluteFill>
			<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
				<defs>
					<linearGradient id="edgeG" x1={shimmer - 260} x2={shimmer + 260} y1="0" y2="0" gradientUnits="userSpaceOnUse">
						<stop offset="0" stopColor={C.dorado} />
						<stop offset="0.5" stopColor="#F6E6C6" />
						<stop offset="1" stopColor={C.dorado} />
					</linearGradient>
				</defs>
				<line x1={-10} y1={edge - 0.55} x2={W + 10} y2={edge + drop + 0.55} stroke="url(#edgeG)" strokeWidth={6} />
			</svg>
		</AbsoluteFill>
	);
};

/* ================= Página del panel ================= */
export const Page: React.FC<{inAt: number; outAt: number; children: React.ReactNode; enter?: 'right' | 'up'; exit?: 'left' | 'up'}> = ({inAt, outAt, children, enter = 'right', exit = 'left'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < inAt - 1 || frame > outAt) return null;
	const {edge, s} = splitAt(frame / fps);
	const box = panelBox(edge);
	const pin = prog(frame, inAt, inAt + 15, EASE_OUT);
	const pout = prog(frame, outAt - 10, outAt, EASE_IN);
	const ex = enter === 'right' ? (1 - pin) * 150 : 0;
	const ey = enter === 'up' ? (1 - pin) * 70 : 0;
	const ox = exit === 'left' ? -pout * 170 : 0;
	const oy = exit === 'up' ? -pout * 80 : 0;
	const panelY = -(edge + 100) * (1 - s); // viaja con el panel
	return (
		<div
			style={{
				position: 'absolute',
				...box,
				transform: `translate(${ex + ox}px, ${ey + oy + panelY}px)`,
				opacity: pin * (1 - pout),
				filter: `blur(${(1 - pin) * 8 + pout * 8}px)`,
				fontFamily: FONT,
				letterSpacing: TRACK,
				lineHeight: LH,
				color: C.blanco,
			}}
		>
			{children}
		</div>
	);
};

/* ================= Transición diagonal "\" ================= */
export const SlashReveal: React.FC<{children: React.ReactNode; inAt: number; outAt: number; dur?: number; bar?: string}> = ({children, inAt, outAt, dur = 12, bar = C.dorado}) => {
	const frame = useCurrentFrame();
	if (frame < inAt || frame > outAt + 1) return null;
	const slant = 520;
	const span = W + slant + 320;
	const pin = prog(frame, inAt, inAt + dur, EASE_INOUT);
	const pout = prog(frame, outAt - dur, outAt, EASE_INOUT);
	const eIn = -slant - 160 + span * pin;
	const eOut = -slant - 160 + span * pout;
	const poly = (a: number, b: number) => `polygon(${a}px 0px, ${b}px 0px, ${b + slant}px ${H}px, ${a + slant}px ${H}px)`;
	const left = frame >= outAt - dur ? eOut : -slant - 400;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{clipPath: poly(left, eIn)}}>{children}</AbsoluteFill>
			{pin > 0 && pin < 1 && <AbsoluteFill style={{background: bar, clipPath: poly(eIn, eIn + 90)}} />}
			{pin > 0 && pin < 1 && <AbsoluteFill style={{background: C.oroClaro, clipPath: poly(eIn + 90, eIn + 110)}} />}
			{pout > 0 && pout < 1 && <AbsoluteFill style={{background: bar, clipPath: poly(eOut - 90, eOut)}} />}
		</AbsoluteFill>
	);
};

/** Placa a pantalla completa: fondo oscuro + contenido SIEMPRE dentro del margen seguro */
export const FullPlate: React.FC<{inAt: number; outAt: number; children: React.ReactNode; bg?: React.ReactNode}> = ({inAt, outAt, children, bg}) => {
	const frame = useCurrentFrame();
	const push = interpolate(frame, [inAt, outAt], [1.04, 1], clamp);
	return (
		<SlashReveal inAt={inAt} outAt={outAt}>
			{bg ?? <DarkBg seed={inAt} />}
			<div
				style={{
					position: 'absolute',
					left: SAFE.left,
					top: SAFE.top,
					width: SAFE.right - SAFE.left,
					height: SAFE.bottom - SAFE.top,
					transform: `scale(${push})`,
					fontFamily: FONT,
					color: C.blanco,
					letterSpacing: TRACK,
					lineHeight: LH,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
				}}
			>
				{children}
			</div>
		</SlashReveal>
	);
};

/* ================= Título de palabra clave sobre el video ================= */
export const KeywordTitle: React.FC<{small: string; big: string; inAt: number; outAt: number; bigAt?: number; top?: number; bigSize?: number; swapTo?: {big: string; at: number}}> = ({
	small,
	big,
	inAt,
	outAt,
	bigAt,
	top = 1090,
	bigSize = 118,
	swapTo,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < inAt || frame > outAt) return null;
	const bAt = bigAt ?? inAt + 4;
	const pill = pop(frame, fps, inAt, 18, 0.6, 200);
	const out = prog(frame, outAt - 8, outAt, EASE_IN);
	const renderBig = (text: string, at: number, leaveAt?: number) => {
		if (frame < at) return null;
		const leave = leaveAt ? prog(frame, leaveAt, leaveAt + 8, EASE_IN) : 0;
		let idx = 0;
		return (
			<div key={text} style={{position: 'absolute', left: 0, right: 0, top: 0}}>
				{text.split('\n').map((line, li) => (
					<div key={li} style={{display: 'flex', justifyContent: 'center', overflow: 'hidden', padding: '0.06em 0 0.1em', marginBottom: '-0.14em'}}>
						{line.split('').map((ch) => {
							const i = idx++;
							const p = prog(frame, at + i * 1.2, at + i * 1.2 + 13, EASE_OUT);
							return (
								<span key={i} style={{display: 'inline-block', whiteSpace: 'pre', transform: `translateY(${(1 - p) * 110 - leave * 115}%)`, filter: `blur(${(1 - p) * 4}px)`}}>
									{ch}
								</span>
							);
						})}
					</div>
				))}
			</div>
		);
	};
	const nLines = Math.max(big.split('\n').length, swapTo ? swapTo.big.split('\n').length : 1);
	const maxLen = Math.max(...[big, swapTo?.big ?? ''].flatMap((b) => b.split('\n').map((l) => l.length)));
	bigSize = Math.min(bigSize, (SAFE.right - SAFE.left) / (maxLen * 0.76)); // nunca sale del margen seguro
	const barP = prog(frame, bAt + 8, bAt + 22, EASE_INOUT);
	return (
		<div style={{position: 'absolute', left: SAFE.left, width: SAFE.right - SAFE.left, top, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT, color: C.blanco, opacity: 1 - out, transform: `translateY(${-out * 30}px)`}}>
			<div
				style={{
					padding: '10px 24px 12px',
					borderRadius: 40,
					background: 'linear-gradient(180deg, #A2845A 0%, #866C4A 100%)',
					fontWeight: 700,
					fontSize: 40,
					letterSpacing: TRACK,
					lineHeight: 1,
					transform: `scale(${0.6 + 0.4 * pill})`,
					opacity: Math.min(1, pill * 1.5),
					boxShadow: '0 10px 26px rgba(0,0,0,0.3)',
				}}
			>
				{small}
			</div>
			<div style={{position: 'relative', width: '100%', height: bigSize * 0.96 * nLines + 14, marginTop: 10, fontWeight: 900, fontSize: bigSize, letterSpacing: TRACK_TIGHT, lineHeight: 0.98, textShadow, textTransform: 'uppercase'}}>
				{renderBig(big, bAt, swapTo?.at)}
				{swapTo && renderBig(swapTo.big, swapTo.at + 4)}
			</div>
			<div style={{height: 8, width: 260 * barP, borderRadius: 4, background: 'linear-gradient(90deg, #866C4A, #F1DDB6, #866C4A)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'}} />
		</div>
	);
};

/* ================= Motivo topográfico ================= */
export const Topo: React.FC<{color?: string; opacity?: number; drift?: number}> = ({color = C.arena, opacity = 0.55, drift = 0}) => {
	const lines = Array.from({length: 9}, (_, i) => i);
	return (
		<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, opacity}}>
			<g transform={`translate(${-60 + drift * 40}, -40)`}>
				{lines.map((i) => (
					<path key={`a${i}`} d={`M -100 ${220 + i * 26} C 220 ${60 + i * 30}, 420 ${420 + i * 18}, ${760 + i * 10} ${160 + i * 24}`} fill="none" stroke={color} strokeWidth={2} />
				))}
			</g>
			<g transform={`translate(${40 - drift * 40}, 1260)`}>
				{lines.map((i) => (
					<path key={`b${i}`} d={`M 1200 ${60 + i * 28} C 900 ${-80 + i * 26}, 640 ${380 + i * 20}, ${240 - i * 12} ${120 + i * 30}`} fill="none" stroke={color} strokeWidth={2} />
				))}
			</g>
		</svg>
	);
};

/* ================= Guías de revisión (inputProps.guides) ================= */
export const SafeGuides: React.FC<{cover?: [number, number][]}> = ({cover = []}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {head} = camera(frame / fps);
	const covered = cover.some(([a, b]) => frame / fps >= a && frame / fps < b);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', left: SAFE.left, top: SAFE.top, width: SAFE.right - SAFE.left, height: SAFE.bottom - SAFE.top, border: '4px dashed #00E5FF'}} />
			{!covered && <div style={{position: 'absolute', left: head.left, top: head.top, width: head.right - head.left, height: head.bottom - head.top, border: '5px solid #FF2D55', background: 'rgba(255,45,85,0.12)'}} />}
		</AbsoluteFill>
	);
};

export {goldText};
