import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BlackScenes} from './BlackScenes';
import {BLACK_A, BLACK_B, C, SAFE} from './brand';
import {camera, headsAt} from './camera';
import {Captions} from './Captions';
import {ChannelDefs, Flash, Glitch, glitchAmt} from './FX';
import {loadFonts} from './fonts';
import {Titles} from './Titles';

loadFonts();

const Speaker: React.FC<{t: number}> = ({t}) => {
	const {S, T} = camera(t);
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: C.casiNegro}}>
			<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${T.x}px, ${T.y}px) scale(${S})`}}>
				<OffthreadVideo src={staticFile('base.mp4')} muted style={{width: '100%', height: '100%'}} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const Scene: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill style={{background: C.casiNegro}}>
		{(t < BLACK_A || t >= BLACK_B) && <Speaker t={t} />}
		{t >= BLACK_B && (
			// sombra cálida arriba para que el CTA se lea sobre el cielo
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,14,11,0.55) 0%, rgba(20,14,11,0.3) 30%, rgba(20,14,11,0) 42%)'}} />
		)}
		<BlackScenes t={t} />
		<Flash t={t} />
		<Titles />
		<Captions />
	</AbsoluteFill>
);

const Guides: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<div style={{position: 'absolute', left: SAFE.left, top: SAFE.top, width: SAFE.right - SAFE.left, height: SAFE.bottom - SAFE.top, border: '3px dashed #00FF66'}} />
		{(t < BLACK_A || t >= BLACK_B) &&
			headsAt(t).map((h, i) => <div key={i} style={{position: 'absolute', left: h.l, top: h.t, width: h.r - h.l, height: h.b - h.t, border: '4px solid #FF2D2D', background: 'rgba(255,45,45,0.12)'}} />)}
	</AbsoluteFill>
);

export const Main: React.FC<{guides: boolean}> = ({guides}) => {
	const {fps} = useVideoConfig();
	const t = useCurrentFrame() / fps;
	const g = glitchAmt(t);
	return (
		<AbsoluteFill style={{background: C.casiNegro}}>
			<ChannelDefs />
			{g ? <Glitch a={g.a} seed={g.seed} render={() => <Scene t={t} />} /> : <Scene t={t} />}
			{guides && <Guides t={t} />}
		</AbsoluteFill>
	);
};
