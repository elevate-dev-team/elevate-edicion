import {continueRender, delayRender, staticFile} from 'remotion';

const WEIGHTS: [number, string][] = [
	[300, 'Light'],
	[400, 'Regular'],
	[500, 'Medium'],
	[600, 'SemiBold'],
	[700, 'Bold'],
	[800, 'ExtraBold'],
	[900, 'Black'],
];

let loaded = false;
export const loadBrandFonts = () => {
	if (loaded || typeof document === 'undefined') return;
	loaded = true;
	const handle = delayRender('Cargando Montserrat');
	Promise.all(
		WEIGHTS.map(([w, name]) => {
			const face = new FontFace('Montserrat', `url(${staticFile(`fonts/Montserrat-${name}.ttf`)})`, {weight: String(w)});
			return face.load().then((ff) => document.fonts.add(ff));
		}),
	)
		.then(() => continueRender(handle))
		.catch((e) => {
			console.error(e);
			continueRender(handle);
		});
};
