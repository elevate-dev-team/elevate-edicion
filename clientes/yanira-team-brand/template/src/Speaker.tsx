import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {camera} from './layout';

// Cámara virtual: sigue la cara, alterna encuadres, y baja al speaker cuando se abre el panel.
export const Speaker: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {S, T} = camera(frame / fps);
	return (
		<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#15120F'}}>
			<AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${T.x}px, ${T.y}px) scale(${S})`}}>
				<OffthreadVideo src={staticFile('cut.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
