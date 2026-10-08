import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, random, staticFile} from 'remotion';
import {C, CX, EASE_IN, EASE_INOUT, EASE_OUT, F, SHADOW, clamp, fr, p01} from './brand';
import {outlined} from './Titles';

/* Tramo de voz en off (20.0–43.28).
   Regla de este bloque: cada gráfico va centrado y el subtítulo queda pegado debajo, siempre en SUB_Y. */
export const SUB_Y = 1100;
const GRAPH_BOTTOM = 1050; // borde inferior de los gráficos (50 px sobre el subtítulo)

/* ---------- piezas base ---------- */
const Vid: React.FC<{src: string; a: number; b: number; style?: React.CSSProperties; pos?: string; rate?: number}> = ({src, a, b, style, pos = 'center', rate = 1}) => (
	<Sequence from={fr(a)} durationInFrames={fr(b - a) + 1} layout="none">
		<OffthreadVideo src={staticFile(`stock/${src}`)} muted playbackRate={rate} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, ...style}} />
	</Sequence>
);

// fondo: el mismo clip, desenfocado y teñido chocolate (profundidad sin competir con la tarjeta)
const BgBlur: React.FC<{src: string; a: number; b: number; t: number}> = ({src, a, b, t}) => {
	if (t < a || t >= b) return null;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `scale(${1.18 + 0.05 * p01(t, a, b, EASE_INOUT)})`, filter: 'blur(26px) brightness(0.6) saturate(0.8)'}}>
				<Vid src={src} a={a} b={b} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'rgba(52,21,15,0.5)'}} />
		</AbsoluteFill>
	);
};

// tarjeta con el stock enmarcado en crema
const Framed: React.FC<{src: string; a: number; b: number; t: number; top: number; w: number; h: number; pos?: string; tilt?: number; enter?: number; exit?: number}> = ({src, a, b, t, top, w, h, pos, tilt = -1.5, enter = a, exit}) => {
	if (t < a || t >= b) return null;
	const e = p01(t, enter, enter + 0.45);
	const o = exit ? p01(t, exit, exit + 0.35, EASE_IN) : 0;
	const float = Math.sin((t - a) * 1.6) * 5;
	return (
		<div
			style={{
				position: 'absolute',
				left: CX - w / 2,
				top,
				width: w,
				height: h,
				padding: 12,
				background: C.crema,
				borderRadius: 28,
				boxShadow: '0 30px 60px rgba(20,14,11,0.55), 0 6px 16px rgba(20,14,11,0.35)',
				opacity: e * (1 - o),
				transform: `translateY(${(1 - e) * 60 + float}px) rotate(${tilt + (1 - e) * -4 + o * -6}deg) scale(${(0.9 + 0.1 * e) * (1 - 0.35 * o)})`,
			}}
		>
			<div style={{width: '100%', height: '100%', borderRadius: 18, overflow: 'hidden', position: 'relative'}}>
				<div style={{position: 'absolute', inset: 0, transform: `scale(${1.02 + 0.06 * p01(t, a, b, EASE_INOUT)})`}}>
					<Vid src={src} a={a} b={b} pos={pos} />
				</div>
			</div>
		</div>
	);
};

// marcador de paso 01 / 02 / 03
const Step: React.FC<{n: string; t: number; at: number; x?: number; y: number; out?: number}> = ({n, t, at, x = CX, y, out}) => {
	const e = p01(t, at, at + 0.35);
	const o = out ? p01(t, out, out + 0.2, EASE_IN) : 0;
	if (e <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x - 40,
				top: y - 40,
				width: 80,
				height: 80,
				borderRadius: 40,
				background: C.oxido,
				border: `3px solid ${C.arena}`,
				boxShadow: '0 8px 20px rgba(20,14,11,0.5)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: F.black,
				fontSize: 34,
				color: C.crema,
				paddingTop: 3,
				opacity: e * (1 - o),
				transform: `scale(${0.4 + 0.6 * e}) rotate(${(1 - e) * -90}deg)`,
			}}
		>
			{n}
		</div>
	);
};

const House: React.FC<{size: number; color: string; sw?: number}> = ({size, color, sw = 5}) => (
	<svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round">
		<polyline points="10,50 50,15 90,50" />
		<polyline points="22,42 22,88 78,88 78,42" />
		<rect x="42" y="62" width="16" height="26" />
		<rect x="29" y="52" width="10" height="10" />
		<rect x="61" y="52" width="10" height="10" />
	</svg>
);

// cifra oculta: dígitos que giran MUY desenfocados (ilegibles) — no mostramos precios reales ni inventados
const Hidden: React.FC<{color: string; size: number; minus?: boolean; t: number; roll?: number}> = ({color, size, minus, t, roll = -1}) => {
	const rolling = roll >= 0 && t >= roll && t < roll + 0.7;
	const k = Math.floor(t * 25);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: size * 0.08}}>
			<span style={{fontFamily: F.black, fontSize: size, color, lineHeight: 1}}>{minus ? '−$' : '$'}</span>
			{[0, 1, 2].map((i) => (
				<div key={i} style={{position: 'relative', width: size * 0.56, height: size * 0.8, overflow: 'hidden', borderRadius: size * 0.1}}>
					<div style={{position: 'absolute', inset: 0, background: color, opacity: 0.35}} />
					<div
						style={{
							position: 'absolute',
							inset: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: F.black,
							fontSize: size * 0.8,
							color,
							filter: `blur(${size * (rolling ? 0.22 : 0.18)}px)`,
							transform: rolling ? `translateY(${((k * 7 + i * 3) % 5) * 6 - 12}px)` : 'none',
						}}
					>
						{Math.floor(random(`d${i}-${rolling ? k : 0}`) * 10)}
					</div>
				</div>
			))}
		</div>
	);
};

/* ---------- A · paso 01: antes de ponerle precio → casas vendidas → en cuánto cerraron ---------- */
const PriceTag: React.FC<{t: number}> = ({t}) => {
	if (t < 20.1 || t >= 22.0) return null;
	const e = p01(t, 20.15, 20.6);
	const o = p01(t, 21.7, 21.95, EASE_IN);
	const dt = Math.max(0, t - 20.15);
	const swing = 14 * Math.exp(-2.2 * dt) * Math.sin(dt * 7);
	return (
		<div style={{position: 'absolute', left: CX - 140, top: 720, width: 280, height: 320, opacity: e * (1 - o), transform: `translateY(${(1 - e) * -260}px) scale(${1 - 0.3 * o})`}}>
			{/* hilo */}
			<div style={{position: 'absolute', left: 139, top: -70, width: 2, height: 96, background: C.arena, transformOrigin: '50% 100%', transform: `rotate(${swing}deg)`}} />
			<div style={{position: 'absolute', inset: 0, transformOrigin: '50% 8%', transform: `rotate(${swing}deg)`}}>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: C.crema,
						borderRadius: 26,
						clipPath: 'polygon(28% 0, 72% 0, 100% 16%, 100% 100%, 0 100%, 0 16%)',
						boxShadow: '0 20px 40px rgba(20,14,11,0.5)',
					}}
				/>
				<div style={{position: 'absolute', left: 124, top: 22, width: 32, height: 32, borderRadius: 16, border: `5px solid ${C.cognac}`, background: 'rgba(52,21,15,0.25)'}} />
				<div style={{position: 'absolute', left: 30, right: 30, top: 78, height: 3, background: C.arena}} />
				<div style={{position: 'absolute', left: 0, right: 0, top: 104, display: 'flex', justifyContent: 'center'}}>
					<House size={78} color={C.cognac} sw={6} />
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: 206, display: 'flex', justifyContent: 'center'}}>
					<Hidden color={C.chocolate} size={62} t={t} roll={20.6} />
				</div>
			</div>
		</div>
	);
};

const CARD = {w: 250, h: 310, gap: 22, top: 740};
const cardX = (i: number) => CX - (3 * CARD.w + 2 * CARD.gap) / 2 + i * (CARD.w + CARD.gap);
const ENTER = [21.9, 22.05, 22.2];
const STAMP = [22.78, 23.0, 23.22];
const FLIP = [26.11, 26.29, 26.46];

const Cards: React.FC<{t: number}> = ({t}) => {
	if (t < 21.85 || t >= 27.25) return null;
	return (
		<>
			{[0, 1, 2].map((i) => {
				const e = p01(t, ENTER[i], ENTER[i] + 0.4);
				const st = p01(t, STAMP[i], STAMP[i] + 0.16, EASE_IN);
				const fl = p01(t, FLIP[i], FLIP[i] + 0.4, EASE_INOUT);
				const out = p01(t, 27.0, 27.25, EASE_IN);
				const lift = Math.sin(fl * Math.PI) * -30;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: cardX(i),
							top: CARD.top,
							width: CARD.w,
							height: CARD.h,
							perspective: 1100,
							opacity: e * (1 - out),
							transform: `translateY(${(1 - e) * 90 + lift}px) rotate(${(i - 1) * 2.5 * (1 - fl)}deg) scale(${0.85 + 0.15 * e})`,
						}}
					>
						<div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${180 * fl}deg)`}}>
							<div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: C.crema, borderRadius: 20, boxShadow: '0 22px 44px rgba(20,14,11,0.5)', overflow: 'hidden'}}>
								<Img src={staticFile('stock/paper.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.35}} />
								<div style={{position: 'absolute', left: 0, right: 0, top: 34, display: 'flex', justifyContent: 'center'}}>
									<House size={128} color={C.chocolate} />
								</div>
								<div style={{position: 'absolute', left: 44, top: 210, width: 162, height: 14, borderRadius: 7, background: C.arena}} />
								<div style={{position: 'absolute', left: 44, top: 236, width: 100, height: 14, borderRadius: 7, background: C.arena, opacity: 0.7}} />
								{t >= STAMP[i] && (
									<div
										style={{
											position: 'absolute',
											left: '50%',
											top: 158,
											transform: `translate(-50%,-50%) rotate(-13deg) scale(${1.8 - 0.8 * st})`,
											opacity: st,
											border: `5px solid ${C.oxidoLinea}`,
											borderRadius: 8,
											padding: '6px 12px 3px',
											fontFamily: F.black,
											fontSize: 36,
											letterSpacing: '0.06em',
											color: C.oxidoLinea,
											background: 'rgba(255,248,240,0.6)',
										}}
									>
										VENDIDA
									</div>
								)}
							</div>
							<div
								style={{
									position: 'absolute',
									inset: 0,
									backfaceVisibility: 'hidden',
									transform: 'rotateY(180deg)',
									background: `linear-gradient(160deg, ${C.oxido} 0%, ${C.chocolate} 70%)`,
									border: `3px solid ${C.arena}`,
									borderRadius: 20,
									boxShadow: '0 22px 44px rgba(20,14,11,0.5)',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 12,
								}}
							>
								<House size={60} color={C.arena} sw={6} />
								<div style={{fontFamily: F.heavy, fontSize: 28, letterSpacing: '0.12em', color: C.arena, lineHeight: 1}}>CERRÓ EN</div>
								<Hidden color={C.crema} size={46} t={t} roll={FLIP[i] + 0.2} />
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
};

const Label: React.FC<{t: number}> = ({t}) => {
	if (t < 24.34 || t >= 25.3) return null;
	const e = p01(t, 24.34, 24.6);
	const o = p01(t, 25.1, 25.3, EASE_IN);
	return (
		<div
			style={{
				position: 'absolute',
				left: CX,
				top: SUB_Y,
				transform: `translate(-50%,-50%) translateY(${(1 - e) * 20}px)`,
				opacity: e * (1 - o),
				background: 'rgba(52,21,15,0.92)',
				border: `2px solid ${C.arena}`,
				borderRadius: 999,
				padding: '16px 34px 12px',
				fontFamily: F.heavy,
				fontSize: 44,
				lineHeight: 1,
				letterSpacing: '0.1em',
				color: C.arena,
				whiteSpace: 'nowrap',
			}}
		>
			ÚLTIMOS MESES
		</div>
	);
};

/* ---------- D · checklist ---------- */
const ITEMS: [string, number][] = [
	['Techo', 31.0],
	['Ventanas de impacto', 31.45],
	['Cocina', 31.9],
];
const Checklist: React.FC<{t: number}> = ({t}) => {
	if (t < 30.3 || t >= 34.0) return null;
	const e = p01(t, 30.3, 30.65);
	const o = p01(t, 33.75, 33.98, EASE_IN);
	return (
		<div
			style={{
				position: 'absolute',
				left: CX - 340,
				top: 752,
				width: 680,
				height: 298,
				padding: '28px 40px 0',
				boxSizing: 'border-box',
				background: C.crema,
				borderRadius: 24,
				boxShadow: '0 26px 56px rgba(20,14,11,0.55)',
				overflow: 'hidden',
				opacity: e * (1 - o),
				transform: `translateY(${(1 - e) * 70}px) rotate(${1 - e}deg)`,
			}}
		>
			<Img src={staticFile('stock/paper.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.3}} />
			<div style={{position: 'relative', fontSize: 50, lineHeight: 0.95, color: C.chocolate, marginBottom: 12, whiteSpace: 'nowrap'}}>
				<span style={{fontFamily: F.reg}}>¿Qué conviene </span>
				<span style={{fontFamily: F.heavy, color: C.oxido}}>arreglar?</span>
			</div>
			{ITEMS.map(([label, at], i) => {
				const r = p01(t, 30.55 + i * 0.1, 30.85 + i * 0.1);
				const ck = p01(t, at, at + 0.22);
				return (
					<div key={label} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 22, height: 64, opacity: r, transform: `translateX(${(1 - r) * -30}px)`, borderTop: `2px solid ${C.arena}`}}>
						<div style={{width: 44, height: 44, borderRadius: 10, border: `4px solid ${C.chocolate}`, background: ck > 0 ? C.oxido : 'transparent', position: 'relative', flexShrink: 0, transform: `scale(${1 + 0.18 * Math.sin(ck * Math.PI)})`}}>
							<svg width="44" height="44" viewBox="0 0 50 50" style={{position: 'absolute', left: -4, top: -4}}>
								<path d="M12 26 L21 35 L39 15" fill="none" stroke={C.crema} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={45} strokeDashoffset={45 * (1 - ck)} />
							</svg>
						</div>
						<div style={{fontFamily: F.heavy, fontSize: 44, lineHeight: 1, color: C.chocolate, whiteSpace: 'nowrap'}}>{label}</div>
					</div>
				);
			})}
		</div>
	);
};

/* ---------- F · paso 03: la hoja "por escrito" ---------- */
const ROWS: [string, number, boolean][] = [
	['Precio de venta', 36.3, false],
	['Hipoteca', 37.06, true],
	['Costos de cierre', 37.91, true],
	['Comisiones', 39.02, true],
];
const PAPER = {w: 720, h: 620, top: GRAPH_BOTTOM - 620};
const NetSheet: React.FC<{t: number}> = ({t}) => {
	if (t < 36.0 || t >= 40.1) return null;
	const e = p01(t, 36.0, 36.5);
	return (
		<div
			style={{
				position: 'absolute',
				left: CX - PAPER.w / 2,
				top: PAPER.top,
				width: PAPER.w,
				height: PAPER.h,
				background: C.crema,
				borderRadius: 18,
				boxShadow: '0 34px 70px rgba(20,14,11,0.65)',
				transform: `translateY(${(1 - e) * -1250}px) rotate(${4 - 5.2 * e}deg)`,
			}}
		>
			<div style={{position: 'absolute', inset: 0, borderRadius: 18, overflow: 'hidden'}}>
				<Img src={staticFile('stock/paper.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.4}} />
			</div>
			<div style={{position: 'absolute', left: 44, top: 36, fontFamily: F.heavy, fontSize: 28, lineHeight: 1, letterSpacing: '0.16em', color: C.cognac}}>POR ESCRITO</div>
			<div style={{position: 'absolute', right: 44, top: 30}}>
				<House size={40} color={C.cognac} sw={7} />
			</div>
			<div style={{position: 'absolute', left: 44, right: 44, top: 82, height: 2, background: C.arena}} />
			{ROWS.map(([label, at, minus], i) => {
				const r = p01(t, at, at + 0.22);
				return (
					<div key={label} style={{position: 'absolute', left: 44, right: 44, top: 100 + i * 82, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: r, transform: `translateX(${(1 - r) * -34}px)`}}>
						<div style={{fontSize: 42, lineHeight: 1, color: C.chocolate, whiteSpace: 'nowrap'}}>
							{minus && <span style={{fontFamily: F.heavy, color: C.oxido}}>− </span>}
							<span style={{fontFamily: minus ? F.reg : F.heavy}}>{label}</span>
						</div>
						<Hidden color={minus ? C.oxido : C.chocolate} size={38} minus={minus} t={t} roll={at} />
					</div>
				);
			})}
			<div style={{position: 'absolute', left: 44, top: 436, height: 4, width: (PAPER.w - 88) * p01(t, 39.25, 39.45), background: C.chocolate, borderRadius: 2}} />
			{t >= 39.42 && (
				<div
					style={{
						position: 'absolute',
						left: 30,
						right: 30,
						top: 458,
						height: 130,
						background: `linear-gradient(120deg, ${C.oxido} 0%, #8A3A1E 100%)`,
						borderRadius: 16,
						padding: '0 30px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						boxShadow: '0 10px 24px rgba(110,44,22,0.45)',
						opacity: p01(t, 39.42, 39.6),
						transform: `scale(${0.88 + 0.12 * p01(t, 39.42, 39.64)})`,
					}}
				>
					<div style={{fontSize: 44, lineHeight: 0.95, color: C.crema}}>
						<div style={{fontFamily: F.reg}}>Lo que te queda</div>
						<div style={{fontFamily: F.hi, color: C.arena}}>en la mano</div>
					</div>
					<Hidden color={C.crema} size={46} t={t} roll={39.42} />
				</div>
			)}
			<Step n="03" t={t} at={36.3} x={PAPER.w / 2} y={0} />
		</div>
	);
};

/* ---------- G · con números, no con nostalgia ---------- */
const Nostalgia: React.FC<{t: number}> = ({t}) => {
	if (t < 39.95) return null;
	const pe = p01(t, 39.95, 40.35);
	const fall = p01(t, 40.35, 40.7, EASE_IN);
	const a = p01(t, 39.98, 40.2);
	const up = p01(t, 40.55, 40.85, EASE_INOUT);
	const b = p01(t, 40.9, 41.15);
	const c = p01(t, 41.66, 41.9);
	// polaroid: foto familiar en sepia (la nostalgia) que se cae cuando entran los números
	const PW = 500;
	const PH = 590;
	return (
		<>
			{fall < 1 && (
				<div
					style={{
						position: 'absolute',
						left: CX - PW / 2,
						top: GRAPH_BOTTOM - PH,
						width: PW,
						height: PH,
						background: C.crema,
						borderRadius: 6,
						boxShadow: '0 30px 60px rgba(20,14,11,0.6)',
						opacity: pe,
						transform: `translate(${fall * 420}px, ${(1 - pe) * 50 + fall * 1300}px) rotate(${3 + fall * 34}deg) scale(${0.94 + 0.06 * pe})`,
					}}
				>
					<div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 6}}>
						<Img src={staticFile('stock/paper.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.45}} />
					</div>
					<div style={{position: 'absolute', left: 22, right: 22, top: 22, height: PH - 110, overflow: 'hidden'}}>
						<div style={{position: 'absolute', inset: 0, filter: 'sepia(0.8) saturate(0.55) contrast(0.95) brightness(0.9)'}}>
							<Vid src="familia.mp4" a={39.95} b={43.28} pos="center 35%" />
						</div>
						<div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 60px rgba(52,21,15,0.55)'}} />
					</div>
				</div>
			)}
			<div style={{position: 'absolute', left: CX, top: 0, width: 0}}>
				<div
					style={{
						position: 'absolute',
						top: interpolate(up, [0, 1], [SUB_Y, 705]),
						left: 0,
						transform: `translate(-50%,-50%) translateY(${(1 - a) * 18}px)`,
						opacity: a,
						whiteSpace: 'nowrap',
						fontFamily: F.reg,
						fontSize: up > 0 ? 68 : 82,
						lineHeight: 1,
						color: C.blanco,
						textShadow: SHADOW,
					}}
				>
					Así decides con
				</div>
				<div style={{position: 'absolute', top: 815, left: 0, transform: `translate(-50%,-50%) scale(${0.55 + 0.45 * b})`, opacity: b, whiteSpace: 'nowrap', ...outlined(150, 11)}}>números</div>
				<div
					style={{
						position: 'absolute',
						top: 930,
						left: 0,
						transform: `translate(-50%,-50%) translateY(${(1 - c) * 18}px)`,
						opacity: c,
						whiteSpace: 'nowrap',
						fontSize: 74,
						lineHeight: 1,
						color: C.arena,
						textShadow: SHADOW,
					}}
				>
					<span style={{fontFamily: F.reg, color: C.blanco}}>no con </span>
					<span style={{fontFamily: F.xi}}>nostalgia.</span>
				</div>
			</div>
		</>
	);
};

/* ---------- fondos de marca ---------- */
const Texture: React.FC<{t: number; topo: boolean}> = ({t, topo}) => (
	<>
		{topo && (
			<AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.1}}>
				<Vid src="topo.mp4" a={20.0} b={43.28} />
			</AbsoluteFill>
		)}
		<AbsoluteFill style={{background: 'radial-gradient(75% 55% at 50% 45%, rgba(0,0,0,0) 40%, rgba(20,14,11,0.7) 100%)'}} />
		<AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.45}}>
			<Vid src="grain.mp4" a={20.0} b={43.28} />
		</AbsoluteFill>
	</>
);

export const BlackScenes: React.FC<{t: number}> = ({t}) => {
	if (t < 20.0 || t >= 43.28) return null;
	const toChoc = p01(t, 25.25, 25.75, EASE_INOUT);
	const mgOnly = t >= 36.0 || (t >= 25.25 && t < 27.25);
	return (
		<AbsoluteFill style={{background: `radial-gradient(90% 70% at 50% 42%, #4A2016 0%, ${C.chocolate} 55%, ${C.casiNegro} 100%)`}}>
			{/* A · 01 — la comunidad (material propio del rodaje) */}
			{t < 27.25 && (
				<>
					<AbsoluteFill style={{transform: `scale(${1.04 + 0.06 * p01(t, 20, 27.25, EASE_INOUT)})`}}>
						<Vid src="comunidad.mp4" a={20.0} b={27.25} />
					</AbsoluteFill>
					<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,14,11,0.5) 0%, rgba(52,21,15,0.45) 50%, rgba(20,14,11,0.65) 100%)'}} />
					<AbsoluteFill style={{background: C.chocolate, opacity: 0.8 * toChoc}} />
				</>
			)}
			{/* C · 02 — recorrido */}
			<BgBlur src="recorrido.mp4" a={27.25} b={29.63} t={t} />
			{/* D · 02 — qué conviene arreglar */}
			<BgBlur src="pintura.mp4" a={29.63} b={31.9} t={t} />
			<BgBlur src="pared.mp4" a={31.9} b={34.05} t={t} />
			{/* E · 03 — por escrito */}
			<BgBlur src="firma.mp4" a={34.05} b={36.37} t={t} />
			{t >= 35.9 && t < 39.95 && <AbsoluteFill style={{background: C.chocolate, opacity: p01(t, 35.9, 36.35, EASE_INOUT)}} />}

			<Texture t={t} topo={mgOnly} />

			<PriceTag t={t} />
			<Cards t={t} />
			<Step n="01" t={t} at={20.08} y={655} out={27.0} />
			<Label t={t} />

			<Framed src="recorrido.mp4" a={27.25} b={29.63} t={t} top={GRAPH_BOTTOM - 600} w={600} h={600} pos="center 20%" />
			{t >= 27.25 && t < 29.63 && <Step n="02" t={t} at={27.3} y={GRAPH_BOTTOM - 600} />}

			<Framed src="pintura.mp4" a={29.63} b={31.9} t={t} top={412} w={600} h={380} pos="center 24%" tilt={-2} />
			<Framed src="pared.mp4" a={31.9} b={34.05} t={t} top={412} w={600} h={380} pos="center 18%" tilt={-2} enter={31.6} />
			{t >= 29.63 && t < 34.05 && <Step n="02" t={t} at={29.63} y={412} />}
			<Checklist t={t} />

			<Framed src="firma.mp4" a={34.05} b={36.4} t={t} top={GRAPH_BOTTOM - 600} w={600} h={600} pos="center 56%" tilt={1.5} exit={35.95} />
			{t >= 34.05 && t < 36.0 && <Step n="03" t={t} at={34.12} y={GRAPH_BOTTOM - 600} />}
			<NetSheet t={t} />

			<Nostalgia t={t} />
		</AbsoluteFill>
	);
};
