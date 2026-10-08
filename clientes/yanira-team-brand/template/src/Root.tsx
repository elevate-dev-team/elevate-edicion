import React from 'react';
import {Composition} from 'remotion';
import {Main, TOTAL} from './Main';
import {FPS, H, W, f} from './brand';

export const Root: React.FC = () => (
	<Composition id="Main" component={Main} durationInFrames={f(TOTAL)} fps={FPS} width={W} height={H} defaultProps={{guides: false}} />
);
