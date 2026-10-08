import {continueRender, delayRender, staticFile} from 'remotion';
import {F} from './brand';

const FILES: [string, string][] = [
	[F.reg, 'Regular'],
	[F.heavy, 'Heavy'],
	[F.black, 'Black'],
	[F.xi, 'Extrabold-Italic'],
	[F.hi, 'Heavy-Italic'],
];
let loaded = false;
export const loadFonts = () => {
	if (loaded || typeof document === 'undefined') return;
	loaded = true;
	const h = delayRender('Blacker Sans');
	Promise.all(FILES.map(([fam, n]) => new FontFace(fam, `url(${staticFile(`fonts/Blacker-Sans-Text-${n}-TRIAL.ttf`)})`).load().then((ff) => document.fonts.add(ff))))
		.then(() => continueRender(h))
		.catch((e) => {
			console.error(e);
			continueRender(h);
		});
};
