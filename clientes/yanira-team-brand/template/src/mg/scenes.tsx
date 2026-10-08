import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, EASE_IN, EASE_INOUT, EASE_OUT, FONT, SAFE, TRACK, TRACK_TIGHT, W, clamp, f, goldText, pop, prog} from '../brand';
import {Counter, DrawIcon, Eyebrow, FullPlate, ICON, Reveal, SlashReveal, Words} from './primitives';

const BOX_W = SAFE.right - SAFE.left; // 830
const gold = (extra: React.CSSProperties = {}): React.CSSProperties => ({...goldText, ...extra});
const H1: React.CSSProperties = {fontWeight: 800, fontSize: 54, letterSpacing: TRACK_TIGHT, lineHeight: 1};

/* ============ B-ROLL a pantalla completa ============ */
const BRollInner: React.FC<{src: string; dur: number; zoomFrom: number; zoomTo: number; wipeOut: boolean}> = ({src, dur, zoomFrom, zoomTo, wipeOut}) => {
	const frame = useCurrentFrame();
	const z = interpolate(frame, [0, dur], [zoomFrom, zoomTo], clamp);
	return (
		<SlashReveal inAt={0} outAt={wipeOut ? dur : dur + 999}>
			<AbsoluteFill style={{transform: `scale(${z})`}}>
				<OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)'}} />
		</SlashReveal>
	);
};
export const BRoll: React.FC<{src: string; inAt: number; outAt: number; zoomFrom?: number; zoomTo?: number; wipeOut?: boolean}> = ({src, inAt, outAt, zoomFrom = 1.12, zoomTo = 1.0, wipeOut = true}) => {
	const dur = f(outAt) - f(inAt);
	return (
		<Sequence from={f(inAt)} durationInFrames={dur + 2} layout="none">
			<BRollInner src={src} dur={dur} zoomFrom={zoomFrom} zoomTo={zoomTo} wipeOut={wipeOut} />
		</Sequence>
	);
};

/* ============ Medio dentro del panel (fondo de video) ============ */
export const PanelVideo: React.FC<{src: string; inAt: number; outAt: number}> = ({src, inAt, outAt}) => {
	const frame = useCurrentFrame();
	if (frame < f(inAt) - 1 || frame > f(outAt)) return null;
	const o = prog(frame, f(inAt), f(inAt) + 12, EASE_INOUT) * (1 - prog(frame, f(outAt) - 8, f(outAt)));
	const z = interpolate(frame, [f(inAt), f(outAt)], [1.15, 1.02], clamp);
	return (
		<Sequence from={f(inAt)} layout="none">
			<AbsoluteFill style={{opacity: o, clipPath: `inset(0 ${(1 - o) * 100}% 0 0)`}}>
				<AbsoluteFill style={{transform: `scale(${z})`}}>
					<OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: 1100, objectFit: 'cover'}} />
				</AbsoluteFill>
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(21,18,15,0.55) 0%, rgba(21,18,15,0.25) 40%, rgba(21,18,15,0.75) 100%)'}} />
			</AbsoluteFill>
		</Sequence>
	);
};

/* ============ A. Gancho: ALQUILAR vs COMPRAR ============ */
export const HookPage: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const vs = pop(frame, fps, f(0.62), 12, 0.5, 220);
	const out = f(1.62);
	const underline = prog(frame, f(1.25), f(1.6), EASE_INOUT);
	return (
		<div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 22}}>
			<Eyebrow at={2} out={out}>Orlando · Florida Central</Eyebrow>
			<Reveal at={f(0.12)} out={out} dur={14}>
				<div style={{fontWeight: 900, fontSize: 128, letterSpacing: TRACK_TIGHT, lineHeight: 0.9}}>ALQUILAR</div>
			</Reveal>
			<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
				<div
					style={{
						width: 104,
						height: 104,
						borderRadius: 52,
						border: `4px solid ${C.oroClaro}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontWeight: 800,
						fontSize: 44,
						color: C.oroClaro,
						transform: `scale(${vs * (1 - prog(frame, out - 10, out, EASE_IN))}) rotate(${(1 - vs) * -180}deg)`,
					}}
				>
					vs
				</div>
				<div style={{position: 'relative'}}>
					<Reveal at={f(1.1)} out={out} dur={14}>
						<div style={gold({fontWeight: 900, fontSize: 128, letterSpacing: TRACK_TIGHT, lineHeight: 0.9})}>COMPRAR</div>
					</Reveal>
					<div style={{position: 'absolute', left: 0, bottom: -16, height: 8, borderRadius: 4, width: `${underline * 100}%`, background: 'linear-gradient(90deg,#866C4A,#F1DDB6)', opacity: 1 - prog(frame, out - 8, out)}} />
				</div>
			</div>
		</div>
	);
};

export const FloridaPage: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const pin = pop(frame, fps, f(1.75), 11, 0.6, 180);
	const out = f(3.9);
	return (
		<div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
				<svg width={78} height={78} viewBox="0 0 100 100" style={{transform: `translateY(${(1 - pin) * -120}px)`, opacity: pin > 0.02 ? 1 : 0, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))'}}>
					<path d={ICON.pin} fill={C.oroClaro} fillRule="evenodd" />
				</svg>
				<Reveal at={f(2.3)} out={out}>
					<div style={{fontWeight: 800, fontSize: 52, letterSpacing: TRACK_TIGHT}}>Centro de la</div>
				</Reveal>
			</div>
			<Reveal at={f(3.0)} out={out} dur={14}>
				<div style={{fontWeight: 900, fontSize: 170, letterSpacing: '-0.05em', lineHeight: 0.88}}>FLORIDA</div>
			</Reveal>
			<div style={{display: 'flex', gap: 16, alignItems: 'center', marginTop: 8}}>
				<Reveal at={f(3.2)} out={out}>
					<div style={{fontWeight: 700, fontSize: 30, color: C.oroClaro, fontVariantNumeric: 'tabular-nums'}}>
						28.54° N · 81.38° O
					</div>
				</Reveal>
				<Reveal at={f(3.3)} out={out}>
					<div style={{fontWeight: 700, fontSize: 30, color: C.humo}}>· ORLANDO</div>
				</Reveal>
			</div>
		</div>
	);
};

/* ============ B. Cuando rentas: contador de 5 años ============ */
export const RentPage: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = f(7.35);
	const b = f(8.85);
	const fill = interpolate(frame, [a, b], [0, 60], {...clamp, easing: EASE_INOUT});
	const stamp = pop(frame, fps, f(8.94), 10, 0.5, 260);
	const shake = frame >= f(8.94) && frame < f(8.94) + 8 ? Math.sin((frame - f(8.94)) * 2.5) * (8 - (frame - f(8.94))) * 1.5 : 0;
	const out = f(9.78);
	return (
		<div style={{transform: `translateX(${shake}px)`}}>
			<Eyebrow at={f(6.95)} out={out}>Ejemplo · renta de $2,000/mes</Eyebrow>
			<Words text="En 5 años de renta pagas" at={f(7.05)} out={out} style={{...H1, marginTop: 20}} />
			<div style={gold({fontWeight: 900, fontSize: 150, letterSpacing: '-0.05em', lineHeight: 0.95, marginTop: 8})}>
				<Counter to={120000} a={a} b={b} prefix="$" />
			</div>
			{/* 60 meses */}
			<div style={{display: 'flex', gap: 5, marginTop: 14, height: 38, alignItems: 'flex-end'}}>
				{Array.from({length: 60}, (_, i) => {
					const on = Math.max(0, Math.min(1, fill - i));
					const yr = i % 12 === 11;
					return <div key={i} style={{width: 8.8, height: yr ? 38 : 26, borderRadius: 3, background: on > 0 ? (yr ? C.oroClaro : C.dorado) : 'rgba(255,255,255,0.12)', transform: `scaleY(${0.4 + 0.6 * on})`, transformOrigin: 'bottom'}} />;
				})}
			</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 26}}>
				<Reveal at={f(8.7)} out={out}>
					<div style={{fontWeight: 800, fontSize: 50, letterSpacing: TRACK_TIGHT}}>Para ti:</div>
				</Reveal>
				{frame >= f(8.94) && (
					<div
						style={{
							padding: '4px 26px 8px',
							border: `6px solid ${C.oroClaro}`,
							borderRadius: 18,
							fontWeight: 900,
							fontSize: 78,
							letterSpacing: '-0.05em',
							lineHeight: 1,
							color: C.oroClaro,
							transform: `rotate(-6deg) scale(${2.2 - 1.2 * stamp})`,
							opacity: Math.min(1, stamp * 1.5) * (1 - prog(frame, out - 8, out)),
							boxShadow: '0 0 40px rgba(217,191,148,0.25)',
						}}
					>
						$0
					</div>
				)}
			</div>
		</div>
	);
};

/* ============ C. Cuando compras: patrimonio ============ */
export const BuyPage: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const out = f(16.4);
	const lineP = prog(frame, f(11.2), f(13.9), EASE_INOUT);
	const pts = [
		[0, 170],
		[110, 150],
		[200, 156],
		[330, 118],
		[440, 124],
		[560, 80],
		[690, 52],
		[830, 14],
	];
	const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
	const len = 980;
	// punto que viaja sobre la curva
	const seg = lineP * (pts.length - 1);
	const si = Math.min(pts.length - 2, Math.floor(seg));
	const sk = seg - si;
	const dot = [pts[si][0] + (pts[si + 1][0] - pts[si][0]) * sk, pts[si][1] + (pts[si + 1][1] - pts[si][1]) * sk];
	const chips: [string, number][] = [
		['VALOR', 12.02],
		['LEGADO', 12.56],
		['PLUSVALÍA', 13.17],
	];
	return (
		<div>
			<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
				<Eyebrow at={f(9.9)} out={out}>Cuando compras</Eyebrow>
				<DrawIcon d={ICON.house} size={48} start={f(10.0)} dur={14} stroke={8} />
			</div>
			<Words text="Tu dinero se queda contigo" at={f(10.05)} out={out} style={{...H1, marginTop: 18}} wordStyle={(i) => (i >= 3 ? gold() : {})} />
			<svg width={BOX_W} height={190} viewBox={`0 0 ${BOX_W} 190`} style={{marginTop: 16, overflow: 'visible', opacity: 1 - prog(frame, out - 8, out)}}>
				<defs>
					<linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={C.oroClaro} stopOpacity={0.45} />
						<stop offset="100%" stopColor={C.oroClaro} stopOpacity={0} />
					</linearGradient>
					<clipPath id="rv">
						<rect x={0} y={-30} width={dot[0] + 2} height={260} />
					</clipPath>
				</defs>
				{[1, 2, 3, 4].map((i) => (
					<line key={i} x1={(BOX_W / 5) * i} x2={(BOX_W / 5) * i} y1={0} y2={180} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
				))}
				<path d={`${d} L${BOX_W} 190 L0 190 Z`} fill="url(#area)" clipPath="url(#rv)" />
				<path d={d} fill="none" stroke="url(#area)" strokeWidth={0} />
				<path d={d} fill="none" stroke={C.oroClaro} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - lineP)} />
				{lineP > 0 && (
					<>
						<circle cx={dot[0]} cy={dot[1]} r={22 + Math.sin(frame / 3) * 4} fill={C.oroClaro} opacity={0.25} />
						<circle cx={dot[0]} cy={dot[1]} r={11} fill={C.oroClaro} />
					</>
				)}
				{['AÑO 1', 'AÑO 2', 'AÑO 3', 'AÑO 4', 'AÑO 5'].map((y, i) => (
					<text key={y} x={(BOX_W / 5) * i + 8} y={186} fill="rgba(255,255,255,0.45)" fontFamily={FONT} fontWeight={700} fontSize={20} opacity={prog(frame, f(11.2) + i * 12, f(11.2) + i * 12 + 8)}>
						{y}
					</text>
				))}
			</svg>
			<div style={{display: 'flex', gap: 14, marginTop: 16}}>
				{chips.map(([t, at]) => {
					const s = pop(frame, fps, f(at), 14, 0.5, 240);
					return (
						<div
							key={t}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 10,
								padding: '12px 20px 12px 14px',
								borderRadius: 40,
								background: 'linear-gradient(180deg, #A2845A 0%, #866C4A 100%)',
								fontWeight: 800,
								fontSize: 34,
								letterSpacing: TRACK,
								transform: `translateY(${(1 - s) * 40}px) scale(${0.7 + 0.3 * s})`,
								opacity: Math.min(1, s * 1.5) * (1 - prog(frame, out - 8, out)),
							}}
						>
							<DrawIcon d={ICON.check} size={30} color={C.blanco} stroke={12} start={f(at) + 3} dur={8} />
							{t}
						</div>
					);
				})}
			</div>
			<Reveal at={f(14.45)} out={out} style={{marginTop: 14}}>
				<div style={{fontWeight: 700, fontSize: 36, color: C.humo}}>
					para ti y <span style={{color: C.oroClaro}}>tu familia</span>
				</div>
			</Reveal>
		</div>
	);
};

/* ============ D. Placa: COMPRAR > RENTAR con tabla ============ */
export const BetterPlate: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const inAt = f(18.1);
	const outAt = f(20.4);
	const ck = pop(frame, fps, f(18.22), 12, 0.5, 220);
	const strike = prog(frame, f(20.0), f(20.2), EASE_INOUT);
	const rows = ['Patrimonio', 'Plusvalía', 'Legado'];
	return (
		<FullPlate inAt={inAt} outAt={outAt}>
			<div style={{width: 130, height: 130, borderRadius: 65, background: 'linear-gradient(180deg,#B89A6C,#866C4A)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ck})`, boxShadow: '0 0 60px rgba(217,191,148,0.35)'}}>
				<DrawIcon d={ICON.check} size={92} color={C.blanco} stroke={11} start={f(18.3)} dur={9} />
			</div>
			<Reveal at={f(18.3)} dur={14} style={{marginTop: 26}}>
				<div style={gold({fontWeight: 900, fontSize: 160, letterSpacing: '-0.05em', lineHeight: 0.9})}>COMPRAR</div>
			</Reveal>
			<Words text="es mucho mejor que" at={f(18.76)} stagger={4} style={{fontWeight: 700, fontSize: 56, letterSpacing: TRACK_TIGHT, justifyContent: 'center', marginTop: 14}} wordStyle={(i) => (i === 1 || i === 2 ? {color: C.oroClaro} : {})} />
			<div style={{position: 'relative', marginTop: 16}}>
				<Reveal at={f(19.88)} dur={10}>
					<div style={{fontWeight: 900, fontSize: 104, letterSpacing: '-0.05em', lineHeight: 0.95, color: '#7D746A'}}>RENTAR</div>
				</Reveal>
				<div style={{position: 'absolute', left: -16, top: '50%', height: 12, borderRadius: 6, width: `calc(${strike * 100}% + ${strike * 32}px)`, background: C.oroClaro}} />
			</div>
			{/* tabla comparativa */}
			<div style={{width: 700, marginTop: 44, fontWeight: 800, fontSize: 36, letterSpacing: TRACK}}>
				<div style={{display: 'flex', padding: '0 10px 12px', color: C.humo, fontSize: 24, opacity: prog(frame, f(18.9), f(19.1))}}>
					<div style={{flex: 1, textAlign: 'left'}} />
					<div style={{width: 170}}>COMPRAR</div>
					<div style={{width: 170}}>RENTAR</div>
				</div>
				{rows.map((r, i) => {
					const at = f(19.0) + i * 5;
					const s = pop(frame, fps, at, 18, 0.5, 220);
					return (
						<div key={r} style={{display: 'flex', alignItems: 'center', padding: '14px 10px', borderTop: '2px solid rgba(217,191,148,0.25)', transform: `translateX(${(1 - s) * 60}px)`, opacity: Math.min(1, s * 1.5)}}>
							<div style={{flex: 1, textAlign: 'left'}}>{r}</div>
							<div style={{width: 170, display: 'flex', justifyContent: 'center'}}>
								<DrawIcon d={ICON.check} size={44} color={C.oroClaro} stroke={12} start={at + 3} dur={7} />
							</div>
							<div style={{width: 170, display: 'flex', justifyContent: 'center'}}>
								<DrawIcon d={ICON.x} size={40} color="#7D746A" stroke={11} start={at + 6} dur={7} />
							</div>
						</div>
					);
				})}
			</div>
		</FullPlate>
	);
};

/* ============ E. Mismo pago: RENTA = MORTGAGE → INVERSIÓN ============ */
export const MortgagePage: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const out = f(29.7);
	const grow = prog(frame, f(21.3), f(22.2), EASE_INOUT);
	const eq = pop(frame, fps, f(21.99), 12, 0.5, 240);
	const strike = prog(frame, f(24.8), f(25.1), EASE_INOUT);
	const inv = prog(frame, f(26.04), f(26.45), EASE_OUT);
	const fut = prog(frame, f(27.18), f(27.5), EASE_OUT);
	const sheen = ((frame * 18) % 900) - 300;
	const row = (label: React.ReactNode, barBg: string, valueOpacity: number, tag: React.ReactNode, dim = 0) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 22, height: 84}}>
			<div style={{width: 250, position: 'relative', height: 50}}>{label}</div>
			<div style={{flex: 1, height: 70, borderRadius: 18, background: 'rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${grow * 100}%`, borderRadius: 18, background: barBg, opacity: 1 - dim * 0.55, overflow: 'hidden'}}>
					{inv > 0 && barBg !== '#5E554B' && <div style={{position: 'absolute', top: 0, bottom: 0, width: 120, left: sheen, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)', transform: 'skewX(-20deg)'}} />}
				</div>
				<div style={{position: 'absolute', left: 22, top: 12, fontWeight: 800, fontSize: 38, opacity: valueOpacity * grow}}>$2,000 /mes</div>
				<div style={{position: 'absolute', right: 18, top: 16}}>{tag}</div>
			</div>
		</div>
	);
	return (
		<div>
			<Eyebrow at={f(21.05)} out={out}>Ejemplo · mismo pago mensual</Eyebrow>
			<div style={{position: 'relative', height: 64, marginTop: 16}}>
				<div style={{position: 'absolute', inset: 0, opacity: 1 - fut}}>
					<Words text="Pagas lo mismo…" at={f(21.3)} style={H1} wordStyle={(i) => (i === 2 ? gold() : {})} />
				</div>
				<div style={{position: 'absolute', inset: 0, opacity: fut, transform: `translateY(${(1 - fut) * 30}px)`}}>
					<div style={H1}>
						…e inviertes en tu <span style={gold()}>futuro</span>
					</div>
				</div>
			</div>
			<div style={{marginTop: 14, position: 'relative'}}>
				{row(<div style={{fontWeight: 800, fontSize: 40, color: inv > 0.5 ? '#8F867B' : C.blanco}}>RENTA</div>, inv > 0.5 ? '#5E554B' : 'linear-gradient(90deg,#6F6559,#8F8374)', 1, <div style={{fontWeight: 800, fontSize: 26, color: C.blanco, opacity: inv, padding: '6px 12px', borderRadius: 12, background: 'rgba(0,0,0,0.35)'}}>0% tuyo</div>, inv)}
				<div style={{height: 20}} />
				{row(
					<>
						<div style={{position: 'absolute', inset: 0, fontWeight: 800, fontSize: 40, opacity: 1 - inv}}>
							MORTGAGE
							<div style={{position: 'absolute', left: -6, top: '46%', height: 7, borderRadius: 4, width: `${strike * 104}%`, background: C.oroClaro}} />
						</div>
						<div style={gold({position: 'absolute', inset: 0, fontWeight: 900, fontSize: 42, letterSpacing: TRACK_TIGHT, opacity: inv, transform: `translateY(${(1 - inv) * 20}px)`})}>INVERSIÓN</div>
					</>,
					inv > 0 ? 'linear-gradient(90deg,#866C4A,#D9BF94)' : 'linear-gradient(90deg,#6F6559,#8F8374)',
					1,
					<div style={{display: 'flex', alignItems: 'center', gap: 6, opacity: inv, fontWeight: 800, fontSize: 26, color: C.tinta, padding: '6px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.8)'}}>
						<DrawIcon d={ICON.arrowUp} size={24} color={C.tinta} stroke={14} start={f(26.2)} dur={8} />
						patrimonio
					</div>,
				)}
				<div
					style={{
						position: 'absolute',
						left: 94,
						top: 64,
						width: 62,
						height: 62,
						borderRadius: 31,
						background: C.oroClaro,
						color: C.tinta,
						fontWeight: 900,
						fontSize: 44,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transform: `scale(${eq * (1 - inv)})`,
						boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
					}}
				>
					=
				</div>
			</div>
		</div>
	);
};

/* ============ F. Logo + cientos de programas ============ */
export const LogoPage: React.FC = () => {
	const frame = useCurrentFrame();
	const out = f(31.05);
	const reveal = prog(frame, f(29.9), f(30.55), EASE_INOUT);
	const sweep = prog(frame, f(30.3), f(30.9), EASE_INOUT);
	return (
		<div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
			<div style={{position: 'relative', width: 720, height: 144, overflow: 'hidden'}}>
				<Img src={staticFile('logo_oro_claro.png')} style={{width: 720, clipPath: `inset(0 ${100 - reveal * 100}% 0 0)`, transform: `scale(${1.08 - 0.08 * reveal})`}} />
				<div style={{position: 'absolute', top: 0, bottom: 0, width: 140, left: -160 + sweep * 900, background: 'linear-gradient(90deg, transparent, rgba(255,245,225,0.7), transparent)', transform: 'skewX(-24deg)', mixBlendMode: 'overlay'}} />
				{reveal > 0 && reveal < 1 && <div style={{position: 'absolute', top: 0, height: 144, width: 12, left: 720 * reveal - 6, background: C.oroClaro, transform: 'skewX(-28deg)'}} />}
			</div>
			<Reveal at={f(30.5)} out={out} style={{marginTop: 28}}>
				<div style={{fontWeight: 800, fontSize: 38, letterSpacing: TRACK}}>
					YANIRA TEAM <span style={{color: C.oroClaro}}>— YES WE CAN</span>
				</div>
			</Reveal>
		</div>
	);
};

const PROGRAMS = ['Primera vivienda', 'FHA', 'VA', 'USDA', 'Convencional', 'Asistencia para down payment', 'Crédito ITIN'];
export const ProgramsPage: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = f(31.1);
	const lab = pop(frame, fps, f(31.64), 16, 0.5, 220);
	const scroll = (frame - a) * 4.5;
	return (
		<div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
			<div style={{display: 'flex', alignItems: 'flex-end', gap: 22, width: BOX_W, overflow: 'hidden'}}>
				<div style={gold({fontWeight: 900, fontSize: 150, letterSpacing: '-0.06em', lineHeight: 0.85})}>
					<Counter to={100} a={a} b={f(31.95)} prefix="+" />
				</div>
				<div style={{paddingBottom: 10, transform: `translateX(${(1 - lab) * 40}px)`, opacity: lab}}>
					<div style={{fontWeight: 900, fontSize: 56, letterSpacing: TRACK_TIGHT, lineHeight: 0.9}}>PROGRAMAS</div>
					<div style={{fontWeight: 700, fontSize: 32, color: C.humo, marginTop: 8}}>para comprar tu casa</div>
				</div>
			</div>
			{/* carrusel continuo de programas */}
			<div style={{marginTop: 30, overflow: 'hidden', width: BOX_W, maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)'}}>
				<div style={{display: 'flex', gap: 14, transform: `translateX(${-scroll + 40}px)`, opacity: prog(frame, a + 4, a + 14)}}>
					{[...PROGRAMS, ...PROGRAMS].map((p, i) => (
						<div key={i} style={{flex: 'none', padding: '14px 24px', borderRadius: 40, border: '2px solid rgba(217,191,148,0.6)', background: 'rgba(134,108,74,0.22)', fontWeight: 800, fontSize: 30, color: C.blanco, whiteSpace: 'nowrap'}}>
							{p}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

/* ============ G. Placa: $0 down payment / $0 gastos de cierre ============ */
export const ZeroPlate: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const inAt = f(37.25);
	const outAt = f(40.45);
	const reel = prog(frame, f(37.3), f(37.66), EASE_OUT); // tragamonedas que desacelera
	const land = pop(frame, fps, f(37.66), 10, 0.5, 260);
	const row2 = pop(frame, fps, f(39.04), 16, 0.6, 200);
	const digits = [9, 5, 3, 8, 1, 7, 4, 2, 6, 0];
	return (
		<FullPlate inAt={inAt} outAt={outAt}>
			<Eyebrow at={inAt + 4}>Programas disponibles</Eyebrow>
			<Reveal at={inAt + 6} style={{marginTop: 22}}>
				<div style={{fontWeight: 700, fontSize: 52, color: C.humo}}>quizás con</div>
			</Reveal>
			<div style={{display: 'flex', fontWeight: 900, fontSize: 330, letterSpacing: '-0.06em', lineHeight: 1, transform: `scale(${1.15 - 0.15 * land})`}}>
				<span style={gold()}>$</span>
				<div style={{height: 330, overflow: 'hidden'}}>
					<div style={{transform: `translateY(${-reel * (digits.length - 1) * 330}px)`, filter: `blur(${Math.sin(reel * Math.PI) * 6}px)`}}>
						{digits.map((d, i) => (
							<div key={i} style={gold({height: 330})}>
								{d}
							</div>
						))}
					</div>
				</div>
			</div>
			<Reveal at={f(38.08)} dur={14}>
				<div style={{fontWeight: 900, fontSize: 86, letterSpacing: TRACK_TIGHT, lineHeight: 1}}>DOWN PAYMENT</div>
			</Reveal>
			<div style={{height: 6, borderRadius: 3, width: 420 * prog(frame, f(38.8), f(39.1), EASE_INOUT), background: 'linear-gradient(90deg,#866C4A,#F1DDB6,#866C4A)', margin: '40px 0'}} />
			<div style={{display: 'flex', alignItems: 'center', gap: 24, transform: `translateY(${(1 - row2) * 50}px)`, opacity: Math.min(1, row2 * 1.5)}}>
				<div style={gold({fontWeight: 900, fontSize: 150, letterSpacing: '-0.06em', lineHeight: 0.9})}>$0</div>
				<div style={{textAlign: 'left', fontWeight: 900, fontSize: 58, letterSpacing: TRACK_TIGHT, lineHeight: 0.95}}>
					GASTOS DE
					<br />
					CIERRE
				</div>
			</div>
			<div style={{marginTop: 56, fontWeight: 500, fontSize: 26, color: C.humo, opacity: prog(frame, f(38.4), f(38.8))}}>*Sujeto a calificación y programas disponibles.</div>
		</FullPlate>
	);
};

/* ============ I. Dinero a la basura ============ */
export const TrashPage: React.FC = () => {
	const frame = useCurrentFrame();
	const out = f(52.45);
	const lidOpen = prog(frame, f(50.1), f(50.35));
	const lidClose = prog(frame, f(51.62), f(51.78), EASE_IN);
	const lid = -48 * lidOpen * (1 - lidClose);
	const slam = f(51.78);
	const shake = frame >= slam && frame < slam + 8 ? Math.sin((frame - slam) * 2.6) * (8 - (frame - slam)) * 1.6 : 0;
	const canX = 170;
	const mouthY = 160;
	const bills = [0, 1, 2, 3, 4, 5, 6];
	return (
		<div>
			<Eyebrow at={f(48.8)} out={out}>Ejemplo · renta de $2,000/mes</Eyebrow>
			<Words text="No sigas rentando" at={f(48.85)} out={out} style={{fontWeight: 900, fontSize: 70, letterSpacing: TRACK_TIGHT, lineHeight: 1, marginTop: 16}} wordStyle={(i) => (i === 2 ? gold() : {})} />
			<div style={{position: 'relative', height: 280, marginTop: 20, transform: `translateX(${shake}px)`}}>
				{bills.map((i) => {
					const st = f(50.3) + i * 4;
					const p = interpolate(frame, [st, st + 14], [0, 1], {...clamp, easing: EASE_IN});
					if (frame < st || p >= 1) return null;
					const x0 = canX - 150 + (i % 4) * 100;
					const x = x0 + (canX - x0) * p;
					const y = -10 + (mouthY + 30 + 10) * p;
					return (
						<div key={i} style={{position: 'absolute', left: x - 60, top: y - 30, width: 120, height: 60, borderRadius: 8, background: 'linear-gradient(180deg,#D9BF94,#A98A5C)', border: '3px solid #F1DDB6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 34, color: C.tinta, transform: `rotate(${(i % 2 ? 1 : -1) * (15 + p * 200)}deg) scale(${1 - p * 0.35})`, opacity: 1 - Math.max(0, p - 0.8) * 5}}>
							$
						</div>
					);
				})}
				<div style={{position: 'absolute', left: canX - 100, top: mouthY - 10}}>
					<svg width={200} height={130} viewBox="0 0 200 130">
						<path d="M20 10 L36 124 L164 124 L180 10 Z" fill="#2C2620" stroke={C.oroClaro} strokeWidth={7} strokeLinejoin="round" />
						<path d="M72 34 L78 104 M100 34 L100 104 M128 34 L122 104" stroke="rgba(217,191,148,0.6)" strokeWidth={7} strokeLinecap="round" />
					</svg>
					<div style={{position: 'absolute', left: 4, top: -14, width: 192, height: 20, borderRadius: 8, background: C.oroClaro, transformOrigin: '0% 100%', transform: `rotate(${lid}deg)`}} />
				</div>
				<div style={{position: 'absolute', left: 350, top: 10, width: 480}}>
					<Reveal at={f(50.2)} out={out}>
						<div style={{fontWeight: 700, fontSize: 34, color: C.humo}}>cada año se van</div>
					</Reveal>
					<div style={gold({fontWeight: 900, fontSize: 104, letterSpacing: '-0.05em', lineHeight: 1, marginTop: 4, opacity: prog(frame, f(50.25), f(50.45))})}>
						<Counter to={24000} a={f(50.3)} b={f(51.75)} prefix="$" />
					</div>
					<Reveal at={f(51.73)} out={out} dur={10}>
						<div style={{fontWeight: 900, fontSize: 46, letterSpacing: TRACK_TIGHT, marginTop: 6}}>a la basura</div>
					</Reveal>
				</div>
			</div>
		</div>
	);
};

/* ============ J. Logo pill + ¡SÍ SE PUEDE! ============ */
export const LogoBug: React.FC<{inAt: number; outAt: number}> = ({inAt, outAt}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < f(inAt) || frame > f(outAt)) return null;
	const s = pop(frame, fps, f(inAt), 18, 0.6, 200);
	const out = prog(frame, f(outAt) - 8, f(outAt), EASE_IN);
	const reveal = prog(frame, f(inAt) + 4, f(inAt) + 18, EASE_INOUT);
	return (
		<div style={{position: 'absolute', left: SAFE.left + BOX_W / 2 - 200, top: SAFE.top + 6, width: 400, height: 92, borderRadius: 46, background: 'rgba(21,18,15,0.78)', border: '2px solid rgba(217,191,148,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translateY(${(1 - s) * -30}px) scale(${1 - out * 0.1})`, opacity: Math.min(1, s * 1.5) * (1 - out), boxShadow: '0 10px 30px rgba(0,0,0,0.35)'}}>
			<Img src={staticFile('logo_oro_claro.png')} style={{width: 290, clipPath: `inset(0 ${100 - reveal * 100}% 0 0)`}} />
		</div>
	);
};

export const YesWeCanPlate: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const words: [string, number][] = [
		['¡SÍ', 58.26],
		['SE', 58.42],
		['PUEDE!', 58.58],
	];
	const last = [...words].reverse().find(([, t]) => frame >= f(t));
	const k = last ? frame - f(last[1]) : 99;
	const shake = k < 7 ? Math.sin(k * 2.8) * (7 - k) * 2.2 : 0;
	const ywc = prog(frame, f(58.9), f(59.15));
	const bg = (
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 44%, #B39469 0%, ${C.dorado} 45%, #4E3E2A 100%)`}}>
			{words.map(([, t], i) => {
				const p = prog(frame, f(t), f(t) + 20);
				if (frame < f(t)) return null;
				return <div key={i} style={{position: 'absolute', left: SAFE.left + BOX_W / 2 - 380, top: 820 - 380, width: 760, height: 760, borderRadius: 380, border: `${6 * (1 - p) + 1}px solid ${C.oroClaro}`, transform: `scale(${0.3 + p * 1.1})`, opacity: 1 - p}} />;
			})}
		</AbsoluteFill>
	);
	return (
		<FullPlate inAt={f(58.12)} outAt={f(59.55)} bg={bg}>
			<div style={{transform: `translate(${shake}px, ${shake * 0.6}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				{words.map(([w, t]) => {
					const s = pop(frame, fps, f(t), 12, 0.45, 260);
					return (
						<div key={w} style={{fontWeight: 900, fontSize: 176, letterSpacing: '-0.05em', lineHeight: 0.95, color: C.blanco, transform: `scale(${1.7 - 0.7 * s})`, opacity: frame < f(t) ? 0 : Math.min(1, s * 1.6), filter: `blur(${(1 - s) * 14}px)`, textShadow: '0 12px 34px rgba(0,0,0,0.3)'}}>
							{w}
						</div>
					);
				})}
				<div style={{marginTop: 30, fontWeight: 800, fontSize: 44, letterSpacing: TRACK, color: 'rgba(255,255,255,0.92)', opacity: ywc, transform: `translateY(${(1 - ywc) * 20}px)`}}>YES WE CAN</div>
				<Img src={staticFile('logo_blanco.png')} style={{width: 280, marginTop: 50, opacity: ywc}} />
			</div>
		</FullPlate>
	);
};

/* ============ K. WhatsApp + poder de compra ============ */
const Bubble: React.FC<{side: 'l' | 'r'; at: number; children: React.ReactNode}> = ({side, at, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = pop(frame, fps, at, 16, 0.5, 240);
	if (frame < at) return null;
	return (
		<div style={{display: 'flex', justifyContent: side === 'r' ? 'flex-end' : 'flex-start'}}>
			<div
				style={{
					maxWidth: 600,
					padding: '18px 24px',
					borderRadius: side === 'r' ? '26px 26px 6px 26px' : '26px 26px 26px 6px',
					background: side === 'r' ? 'linear-gradient(180deg,#A2845A,#866C4A)' : '#2E2822',
					fontWeight: 700,
					fontSize: 36,
					letterSpacing: TRACK,
					lineHeight: 1.12,
					color: C.blanco,
					transformOrigin: side === 'r' ? '100% 100%' : '0% 100%',
					transform: `scale(${0.4 + 0.6 * s}) translateY(${(1 - s) * 30}px)`,
					opacity: Math.min(1, s * 1.5),
				}}
			>
				{children}
			</div>
		</div>
	);
};
const WaIcon: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={50} cy={50} r={50} fill={C.whatsapp} />
		<path d="M50 20 A30 30 0 1 1 27 70 L22 82 L35 77 A30 30 0 0 0 50 80" fill="none" stroke={C.blanco} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
		<path d="M40 38 C40 52 48 60 62 62 L66 56 L58 52 L55 55 C50 53 47 50 45 45 L48 42 L44 34 Z" fill={C.blanco} />
	</svg>
);
export const WhatsAppPage: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const badge = pop(frame, fps, f(61.1), 10, 0.5, 240);
	const ticks = prog(frame, f(60.9), f(61.1));
	return (
		<div style={{height: '100%', borderRadius: 30, background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(217,191,148,0.3)', overflow: 'hidden'}}>
			<div style={{height: 104, display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px', borderBottom: '2px solid rgba(217,191,148,0.2)'}}>
				<div style={{width: 70, height: 70, borderRadius: 35, background: 'linear-gradient(180deg,#B89A6C,#866C4A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 30, letterSpacing: TRACK_TIGHT}}>YT</div>
				<div style={{flex: 1}}>
					<div style={{fontWeight: 800, fontSize: 40, lineHeight: 1}}>Yanira Team</div>
					<div style={{fontWeight: 600, fontSize: 26, color: C.whatsapp, marginTop: 6}}>en línea</div>
				</div>
				<div style={{transform: `scale(${badge}) rotate(${(1 - badge) * -90}deg)`}}>
					<WaIcon size={70} />
				</div>
			</div>
			<div style={{padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16}}>
				<Bubble side="r" at={f(60.4)}>
					¡Hola Yanira! Quiero dejar de rentar <span style={{fontSize: 26, color: '#BFE3FF', opacity: ticks}}>✓✓</span>
				</Bubble>
				{frame >= f(61.3) && frame < f(61.95) && (
					<div style={{display: 'flex'}}>
						<div style={{padding: '20px 26px', borderRadius: '26px 26px 26px 6px', background: '#2E2822', display: 'flex', gap: 10}}>
							{[0, 1, 2].map((i) => (
								<div key={i} style={{width: 14, height: 14, borderRadius: 7, background: C.oroClaro, transform: `translateY(${Math.sin((frame - f(61.3)) / 2.2 - i) * 6}px)`}} />
							))}
						</div>
					</div>
				)}
				<Bubble side="l" at={f(61.95)}>
					¡Claro! Analicemos tu <span style={{color: C.oroClaro}}>poder de compra</span>
				</Bubble>
			</div>
		</div>
	);
};

export const PowerPage: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = prog(frame, f(63.2), f(63.95), EASE_OUT);
	const val = 0.1 + 0.78 * p;
	const R = 150;
	const cx = 180;
	const cy = 190;
	const ang = Math.PI * (1 - val);
	const arc = (a: number, b: number) => {
		const a0 = Math.PI * (1 - a);
		const a1 = Math.PI * (1 - b);
		return `M ${cx + R * Math.cos(a0)} ${cy - R * Math.sin(a0)} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(a1)} ${cy - R * Math.sin(a1)}`;
	};
	const items: [string, number][] = [
		['Ingresos', 63.3],
		['Crédito', 63.5],
		['Programas', 63.7],
	];
	return (
		<div>
			<Eyebrow at={f(62.65)}>Por WhatsApp</Eyebrow>
			<Words text="Tu poder de compra" at={f(62.7)} style={{...H1, fontWeight: 900, fontSize: 64, marginTop: 16}} wordStyle={(i) => (i >= 1 ? gold() : {})} />
			<div style={{display: 'flex', alignItems: 'center', marginTop: 20}}>
				<svg width={360} height={220}>
					<defs>
						<linearGradient id="gg" x1="0" x2="1">
							<stop offset="0" stopColor="#866C4A" />
							<stop offset="1" stopColor="#F1DDB6" />
						</linearGradient>
					</defs>
					<path d={arc(0, 1)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={30} strokeLinecap="round" />
					<path d={arc(0, val)} fill="none" stroke="url(#gg)" strokeWidth={30} strokeLinecap="round" />
					<line x1={cx} y1={cy} x2={cx + (R - 50) * Math.cos(ang)} y2={cy - (R - 50) * Math.sin(ang)} stroke={C.blanco} strokeWidth={9} strokeLinecap="round" />
					<circle cx={cx} cy={cy} r={16} fill={C.blanco} />
					<text x={cx - R - 10} y={cy + 30} fill={C.humo} fontFamily={FONT} fontWeight={700} fontSize={22}>
						BAJO
					</text>
					<text x={cx + R - 40} y={cy + 30} fill={C.oroClaro} fontFamily={FONT} fontWeight={800} fontSize={22} opacity={p}>
						ALTO
					</text>
				</svg>
				<div style={{display: 'flex', flexDirection: 'column', gap: 14, marginLeft: 20}}>
					{items.map(([t, at]) => {
						const s = pop(frame, fps, f(at), 16, 0.5, 240);
						return (
							<div key={t} style={{display: 'flex', alignItems: 'center', gap: 12, fontWeight: 800, fontSize: 38, transform: `translateX(${(1 - s) * 50}px)`, opacity: Math.min(1, s * 1.5)}}>
								<div style={{width: 46, height: 46, borderRadius: 23, background: 'linear-gradient(180deg,#B89A6C,#866C4A)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<DrawIcon d={ICON.check} size={30} color={C.blanco} stroke={13} start={f(at) + 3} dur={7} />
								</div>
								{t}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

/* ============ Ícono gigante de fondo del panel (profundidad + movimiento continuo) ============ */
const DECOS: [number, number, string][] = [
	[0, 1.62, ICON.key],
	[6.9, 9.8, ICON.key],
	[9.8, 16.45, ICON.house],
	[21.0, 29.7, ICON.arrowUp],
	[31.05, 33.1, ICON.house],
	[48.85, 52.5, 'M50 12 L50 88 M68 28 C60 18 32 18 32 34 C32 52 68 46 68 66 C68 82 40 84 30 72'],
	[59.6, 64.35, ICON.check],
];
export const PanelDeco: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / 30;
	const d = DECOS.find(([a, b]) => t >= a && t < b);
	if (!d) return null;
	const [a, b, path] = d;
	const o = interpolate(t, [a, a + 0.5, b - 0.4, b], [0, 1, 1, 0], clamp);
	return (
		<svg width={560} height={560} viewBox="0 0 100 100" style={{position: 'absolute', left: 600, top: 230, opacity: 0.09 * o, transform: `rotate(${-8 + (frame - f(a)) * 0.12}deg) scale(${0.9 + 0.1 * o})`}}>
			<path d={path} fill="none" stroke={C.oroClaro} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

export const _unused = {W, FONT};
