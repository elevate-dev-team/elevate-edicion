/* Plantilla de portada 9:16 (Remotion <Still>), neutra de marca.
   Copiar a src/ del proyecto de Remotion del video y registrar en Root.tsx:

   <Still id="Portada" component={Portada} width={1080} height={1920} defaultProps={{
     foto: 'portada/foto.jpg', posX: 50, lineas: ['TITULAR'], sub: 'bajada corta', textTop: 1115, titleSize: 118,
     recorte: 'portada/foto_personas.png', fondo: 'portada/foto_fondo.jpg', paredHasta: 56.5, glow: {x: 52, y: 42},
     marca: {tituloFont: 'X-Black', subFont: 'X-Heavy', tituloColor: '#EACDA9', subColor: '#FFFFFF', sombra: 'rgba(20,14,11,0.55)', calido: '134,69,30'},
     guides: false}} />

   Las fuentes se cargan como en el video (FontFace con staticFile). Los colores/pesos salen de la skill de marca del cliente. */
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type Marca = {tituloFont: string; subFont: string; tituloColor: string; subColor: string; sombra: string; calido: string /* 'r,g,b' */};
export type PortadaProps = {
	foto: string; posX: number; lineas: string[]; sub: string; textTop: number; titleSize: number; marca: Marca;
	recorte?: string; fondo?: string; paredHasta?: number; glow?: {x: number; y: number};
	guides?: boolean; soloTexto?: boolean;
};

const SQ = {top: 420, bottom: 1500}; // cuadrado central 1080x1080 = lo que se ve en el feed

const Foto: React.FC<{src: string; posX: number; filter: string; extra?: number}> = ({src, posX, filter, extra = 1}) => (
	<AbsoluteFill style={{transform: `scale(${extra})`, transformOrigin: `${posX}% 40%`}}>
		<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${posX}% 50%`, filter}} />
	</AbsoluteFill>
);

export const Portada: React.FC<PortadaProps> = ({foto, posX, lineas, sub, textTop, titleSize, marca, recorte, fondo, paredHasta = 56.5, glow, guides, soloTexto}) => {
	const sombra = `0 6px 24px ${marca.sombra}, 0 2px 6px ${marca.sombra}`;
	const soloPared = `linear-gradient(180deg, #000 0%, #000 ${paredHasta - 2}%, transparent ${paredHasta}%)`;
	return (
		<AbsoluteFill style={{background: soloTexto ? '#000' : '#140E0B'}}>
			{!soloTexto && (
				<>
					{/* 1 · foto nítida, tal cual (todo lo de adelante queda así) */}
					<Foto src={foto} posX={posX} filter="saturate(1.06) contrast(1.04)" />
					{/* 2 · SOLO la pared de atrás: fondo limpio (sin personas) con desenfoque MUY sutil */}
					{recorte && fondo && (
						<AbsoluteFill style={{WebkitMaskImage: soloPared, maskImage: soloPared}}>
							<Foto src={fondo} posX={posX} filter="blur(3px) brightness(0.95) saturate(1.02) contrast(1.02)" extra={1.005} />
						</AbsoluteFill>
					)}
					{/* 3 · degradé inferior para leer el texto */}
					<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(${marca.calido},0.10) 0%, rgba(0,0,0,0) 30%)`}} />
					<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,14,11,0) 48%, rgba(20,14,11,0.55) 62%, rgba(20,14,11,0.82) 78%, rgba(20,14,11,0.9) 100%)'}} />
					{/* 4 · luz suave detrás del sujeto (opcional, sutil) */}
					{recorte && glow && (
						<AbsoluteFill style={{
							background: `radial-gradient(78% 36% at ${glow.x}% ${glow.y}%, rgba(255,240,220,0.22) 0%, rgba(${marca.calido},0.08) 45%, rgba(0,0,0,0) 90%)`,
							WebkitMaskImage: soloPared, maskImage: soloPared,
						}} />
					)}
					{/* 5 · sujeto recortado, apenas más expuesto */}
					{recorte && <Foto src={recorte} posX={posX} filter="brightness(1.08) contrast(1.05) saturate(1.05)" />}
				</>
			)}
			{/* 6 · texto: pegado al sujeto, dentro del cuadrado con ≥100 px de aire */}
			<div style={{position: 'absolute', left: 0, right: 0, top: textTop, textAlign: 'center'}}>
				{lineas.map((l, i) => (
					<div key={i} style={{fontFamily: marca.tituloFont, fontSize: titleSize, lineHeight: 0.86, letterSpacing: '0.01em', color: marca.tituloColor, textShadow: sombra}}>{l}</div>
				))}
				{sub && <div style={{fontFamily: marca.subFont, fontSize: 64, lineHeight: 1, marginTop: -6, color: marca.subColor, textShadow: sombra}}>{sub}</div>}
			</div>
			{guides && (
				<AbsoluteFill>
					<div style={{position: 'absolute', left: 0, top: SQ.top, width: 1080, height: 1080, border: '4px dashed #00FF66'}} />
					<div style={{position: 'absolute', left: 100, top: SQ.top + 100, width: 880, height: 880, border: '3px dotted #FFD400'}} />
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};
