import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {clamp, f} from './brand';
import {loadBrandFonts} from './fonts';
import edit from './data/edit.json';
import {Captions, Word} from './Captions';
import {Speaker} from './Speaker';
import {KeywordTitle, Page, SafeGuides, TopPanel} from './mg/primitives';
import {
	BRoll,
	BetterPlate,
	BuyPage,
	FloridaPage,
	HookPage,
	LogoBug,
	LogoPage,
	MortgagePage,
	PanelDeco,
	PanelVideo,
	PowerPage,
	ProgramsPage,
	RentPage,
	TrashPage,
	WhatsAppPage,
	YesWeCanPlate,
	ZeroPlate,
} from './mg/scenes';

loadBrandFonts();

// El video termina cuando ella termina de hablar
export const TOTAL = 68.6;

// Momentos donde un título/placa ya dice lo mismo → sin subtítulo
const HIDE_CAPTIONS: [number, number][] = [
	[0, 1.62],
	[18.1, 20.4],
	[37.25, 40.45],
	[43.35, 46.95],
	[47.15, 48.4],
	[53.25, 55.45],
	[58.12, 59.55],
	[66.75, 80],
];

type Sfx = [number, string, number, number?]; // seg, archivo, volumen, desde(seg)
const SFX: Sfx[] = [
	[0.1, 'whoosh2', 0.45],
	[0.6, 'pop', 0.5],
	[1.08, 'whoosh2', 0.45],
	[1.6, 'whoosh', 0.35],
	[1.75, 'ding', 0.25],
	[2.98, 'pop', 0.3],
	[3.92, 'swoosh', 0.3],
	[5.02, 'swoosh', 0.32],
	[6.5, 'whoosh', 0.35],
	[7.35, 'money', 0.28],
	[8.92, 'stamp', 0.6],
	[9.8, 'whoosh2', 0.38],
	[12.0, 'pop', 0.4],
	[12.54, 'pop', 0.4],
	[13.15, 'pop', 0.4],
	[13.9, 'ding', 0.25],
	[16.45, 'swoosh', 0.28],
	[18.06, 'whoosh', 0.4],
	[18.28, 'check', 0.42],
	[19.0, 'pop', 0.25],
	[19.96, 'swoosh', 0.35],
	[20.6, 'whoosh', 0.32],
	[21.97, 'pop', 0.45],
	[24.78, 'swoosh', 0.32],
	[26.02, 'whoosh2', 0.4],
	[27.16, 'ding', 0.32],
	[29.7, 'whoosh2', 0.35],
	[29.9, 'magic', 0.28],
	[31.05, 'whoosh2', 0.35],
	[31.62, 'pop', 0.38],
	[33.08, 'whoosh', 0.38],
	[35.9, 'swoosh', 0.28],
	[37.22, 'whoosh', 0.4],
	[37.64, 'cash', 0.5],
	[38.08, 'pop', 0.35],
	[39.02, 'cash', 0.32],
	[40.35, 'swoosh', 0.28],
	[43.36, 'pop', 0.32],
	[44.05, 'whoosh2', 0.4],
	[45.36, 'whoosh2', 0.38],
	[47.15, 'pop', 0.3],
	[47.7, 'whoosh', 0.35],
	[48.3, 'whoosh', 0.32],
	[50.25, 'papers', 0.4],
	[51.76, 'stamp', 0.48],
	[53.25, 'pop', 0.3],
	[54.02, 'whoosh2', 0.4],
	[55.8, 'pop', 0.35],
	[55.86, 'riser', 0.36, 4.6],
	[58.24, 'success', 0.5],
	[58.24, 'stamp', 0.42],
	[58.4, 'pop', 0.28],
	[58.56, 'pop', 0.28],
	[59.2, 'whoosh', 0.3],
	[60.38, 'bubbles', 0.42],
	[61.1, 'pop', 0.38],
	[61.3, 'typing', 0.22],
	[61.95, 'bubbles', 0.32],
	[62.6, 'whoosh2', 0.35],
	[63.2, 'swoosh', 0.25],
	[63.3, 'pop', 0.25],
	[63.5, 'pop', 0.25],
	[63.7, 'pop', 0.25],
	[65.22, 'whoosh2', 0.3],
	[66.28, 'whoosh', 0.38],
	[66.75, 'pop', 0.3],
	[67.4, 'whoosh2', 0.35],
];
const SFX_GAIN = 0.8; // efectos un poco más bajos para que la voz mande
const SFX_MAX: Record<string, number> = {magic: 1.2, riser: 2.45, typing: 0.6, papers: 1.8, whoosh: 1.6, money: 1.4};

const FULLSCREEN: [number, number][] = [
	[18.1, 20.4],
	[37.25, 40.45],
	[58.12, 59.55],
];
const musicVolume = (fr: number) => {
	const t = fr / 30;
	let v = 0.085;
	for (const [a, b] of FULLSCREEN) v = Math.max(v, interpolate(t, [a - 0.2, a, b, b + 0.3], [0.085, 0.14, 0.14, 0.085], clamp));
	const fadeIn = interpolate(t, [0, 0.4], [0.3, 1], clamp);
	const fadeOut = interpolate(t, [TOTAL - 0.9, TOTAL], [1, 0], clamp);
	return v * fadeIn * fadeOut;
};

export const Main: React.FC<{guides?: boolean}> = ({guides}) => {
	const words = edit.words as Word[];
	return (
		<AbsoluteFill style={{backgroundColor: '#15120F'}}>
			<Speaker />

			{/* Panel superior (pantalla dividida) con fondo de video opcional */}
			<TopPanel>
				<PanelDeco />
				<PanelVideo src="broll/orlando.mp4" inAt={1.62} outAt={3.95} />
			</TopPanel>
			<Page inAt={0} outAt={f(1.62)} enter="up">
				<HookPage />
			</Page>
			<Page inAt={f(1.62)} outAt={f(3.92)}>
				<FloridaPage />
			</Page>
			<Page inAt={f(6.92)} outAt={f(9.8)}>
				<RentPage />
			</Page>
			<Page inAt={f(9.8)} outAt={f(16.42)}>
				<BuyPage />
			</Page>
			<Page inAt={f(21.0)} outAt={f(29.7)}>
				<MortgagePage />
			</Page>
			<Page inAt={f(29.7)} outAt={f(31.05)}>
				<LogoPage />
			</Page>
			<Page inAt={f(31.05)} outAt={f(33.1)}>
				<ProgramsPage />
			</Page>
			<Page inAt={f(48.86)} outAt={f(52.45)}>
				<TrashPage />
			</Page>
			<Page inAt={f(59.62)} outAt={f(62.6)}>
				<WhatsAppPage />
			</Page>
			<Page inAt={f(62.6)} outAt={f(64.32)}>
				<PowerPage />
			</Page>

			{/* B-roll y placas a pantalla completa */}
			<BRoll src="broll/rent.mp4" inAt={5.02} outAt={6.92} />
			<BetterPlate />
			<BRoll src="broll/sold.mp4" inAt={33.08} outAt={35.98} zoomFrom={1.0} zoomTo={1.12} />
			<ZeroPlate />
			<YesWeCanPlate />
			<BRoll src="broll/keys.mp4" inAt={66.28} outAt={TOTAL + 0.2} zoomFrom={1.04} zoomTo={1.14} wipeOut={false} />

			{/* Títulos de palabra clave (modo completo, zona inferior segura) */}
			<KeywordTitle small="negociar los mejores" big="INCENTIVOS" inAt={f(43.35)} bigAt={f(44.07)} outAt={f(46.95)} swapTo={{big: 'PROGRAMAS', at: f(45.37)}} />
			<KeywordTitle small="esta es tu" big="OPORTUNIDAD" inAt={f(47.15)} bigAt={f(47.72)} outAt={f(48.33)} top={1170} />
			<KeywordTitle small="este es el tiempo de" big={'COMPRAR\nTU CASA'} inAt={f(53.25)} bigAt={f(54.04)} outAt={f(55.45)} />
			<LogoBug inAt={55.8} outAt={58.12} />
			<KeywordTitle small="dueño de tu" big={'PROPIO\nHOGAR'} inAt={f(66.75)} bigAt={f(67.4)} outAt={f(TOTAL) + 5} />

			<Captions words={words} hide={HIDE_CAPTIONS} />
			{guides && <SafeGuides cover={[[5.02, 6.92], [18.1, 20.4], [33.08, 35.98], [37.25, 40.45], [58.12, 59.55], [66.28, 99]]} />}

			{/* Audio */}
			<Audio src={staticFile('music.wav')} startFrom={f(6.0)} volume={musicVolume} />
			{SFX.map(([t, name, vol, from], i) => (
				<Sequence key={i} from={f(t)} durationInFrames={f(SFX_MAX[name] ?? 2.2)}>
					<Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * SFX_GAIN} startFrom={from ? f(from) : 0} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
