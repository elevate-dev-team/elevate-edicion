import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {FPS, H, TOTAL, W} from './brand';

export const Root: React.FC = () => (
	<Composition id="Main" component={Main} durationInFrames={Math.round(TOTAL * FPS)} fps={FPS} width={W} height={H} defaultProps={{guides: false}} />
);
