---
name: yamilet-garcia-brand
description: Identidad visual para video de Yamilet García (YGM), realtor cubana en Tampa Bay, Florida (brokered by JPT Realty). Look "champagne editorial" — Playfair Display con degradé dorado para los golpes + Montserrat Medium MAYÚSCULAS espaciada con filetes dorados para las bajadas, subtítulos Montserrat SemiBold blancos con la palabra clave en Playfair Display Italic champagne, paleta crema / arena / taupe / oro / espresso, fotos de su vida como "álbum" de tarjetas sobre papel crema con el monograma Y, destellos cálidos y transiciones suaves, y la referencia del primer video (orgánico de presentación "Antes de mostrarte casas") con su pipeline de acabado reutilizable y la reducción de ruido con perfil para sus tomas caseras. Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Yamilet García / YGM (reels, pauta, portadas), o cuando el usuario diga "editá el video de Yamilet", "video de YGM", "con la marca de Yamilet García", aunque no mencione la skill.
---

# Yamilet García (YGM) — Marca para video

> ⚠️ **Propuesta en revisión** (2026-10-08): el sistema lo propuso Claude en el primer video (06-09) y todavía no lo aprobó el usuario. Lo que el usuario corrija pisa esta guía; al aprobarse, sacar este aviso.

Reglas obligatorias (márgenes, cara, voz, niveles, fin al terminar de hablar, portada como primer frame, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`**. Esta skill solo agrega lo propio del cliente.

- Cliente: **Yamilet García**, REALTOR®, Tampa Bay, Florida · Brokered by JPT Realty. Siglas de archivos: **YGM** (carpeta `110 Yamilet García`).
- Cubana, hace 13 años en Florida, familia como motor; ayuda a familias hispanas a **dejar de alquilar y comprar su primera propiedad**. Tono cálido, cercano, emotivo, premium sin ser frío.
- Se nombra "Yamilé" al hablar (pronunciación cubana): en pantalla siempre **Yamilet**. Whisper la escribe "Yamilé".
- Carpeta: `01 REELS/<NN Mes>/<DD-MM YGM Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/`. Final en la raíz del proyecto con el nombre de la carpeta + `.mp4`; portada en `PORTADA/`.
- Montos en dólares (vende en EE. UU.). Stock de Tampa / Florida (palmeras, bahía, puentes, casas de una planta con estilo de Florida), con gente latina.
- Material típico: graba sola con el celular en su living (luz cálida de noche, paredes claras, panel de madera, mesa redonda) y manda **fotos de su vida** (viajes, familia, cierres con el cartel "CLOSED on my new home"). El video puede venir **reenviado/comprimido (720×1280, HEVC HLG)**: pasar a SDR con `avconvert` y no pasar de ~1,9× de zoom.

## 1. Marca (de `00 IMAGEN DE MARCA/`)
- **Tipografías** (`FONTS Yamilet.docx`): **Playfair Display** (títulos) + **Montserrat** (subtítulos). Copiadas en `assets/fonts/` (Playfair estática 400–900 normal/itálica, de Google Fonts vía fontsource; Montserrat Light→Black).
- **Paleta** (`Paleta Yamilet García.png`): crema `#F8F6F1` · arena `#D8C6AA` · taupe `#AA967B` · oro `#B79A63` · espresso `#3E3933`.
- **Portadas de redes** (Facebook/WhatsApp): wordmark "Yamilet García" en serif alta con **dorado metálico**, "— REALTOR® —" en sans espaciada con filetes, pin + "Tampa, Florida", destellos de luz, curvas doradas finas, skyline de Tampa en tonos champagne. Moodboard de referencia (`image.png`): fondos crema/beige, fotos-tarjeta, serif grande, palabras en itálica.

## 2. Sistema para video (propuesto en 06-09)

### Subtítulos (replicables)
- **Montserrat SemiBold 56**, blanco, sentence case, 1 línea de 2–3 palabras, interletrado −0,6.
- **Palabra clave en Playfair Display SemiBold Italic 70 (1,25×), color champagne `#EBD9B6`** (más claro que el arena para leerse sobre su ropa beige). Un acento por bloque como máximo; sustantivos/verbos con carga ("**capuchino**", "**familias**", "**alquilar**", "**significa**").
- Doble sombra espresso casi negro (`#1E1A16`): amplia (blur 16, α 0,68) + corta (blur 3, α 0,5). Necesaria: sus fondos son claros (pared blanca, ropa beige).
- Entrada: sube 12 px + fundido en 0,14 s (sin pop con rebote: no va con la marca). Pegados debajo de la caja de la cabeza (+18 px), sobre fotos centrados sin tapar caras.
- Pipeline: `texts.py` (sprites `subNN`), posiciones en `pass2.py`.

### Títulos
- **Golpe**: Playfair Display Regular o Italic, grande (100–240 px), con **degradé dorado** vertical `#EFDDB6 → #D4B47E → #A8854C` y un **brillo** que lo recorre al entrar (como la luz de sus portadas). Un solo golpe por título.
- **Bajada**: Montserrat Medium MAYÚSCULAS 27–34 px, interletrado ancho (+6), crema, con **filetes dorados** de 64 px a los lados ("— SOY CUBANA —", eco de "— REALTOR —"). O Montserrat Regular en minúscula como línea chica de arriba ("Antes de mostrarte casas,").
- Apilado por línea de base (gap 8–26 px según la línea), sombra espresso suave.
- Animación: sube 34 px + fundido + escala 0,965→1 (0,34 s, ease-out cubic); las líneas entran **cuando se dicen** (`TITLE_PARTS`). Salida: fundido de 0,16 s, o se va con el corte.
- Sobre ella: **arriba de la cabeza** (punto más alto del pelo del tramo − 28 px), centrado en x = 540. Viñeta espresso suave arriba del cuadro (α 0,30) para que el dorado se lea sobre la pared blanca.
- Sobre fotos: tercio inferior con degradé espresso (desde y≈880, α 0,70 abajo), debajo de las caras.
- **Tag de ubicación**: pin dorado + "TAMPA BAY, FLORIDA" Montserrat SemiBold MAYÚSCULAS espaciada, arriba (y≈310). Convive con subtítulos.

### Fotos de su vida = "álbum"
- Fotos-tarjeta con **borde crema de 14 px**, sombra cálida suave y leve rotación (±3–6°), que **aterrizan** (escala 1,22→1 con rebote suave, rotación que se asienta, 0,38 s) cada una en la palabra que la nombra, con zoom interno lento.
- Fondo: **papel crema** (degradé crema→arena, grano leve) con el **monograma "Y" de Playfair** gigante en oro al 13 %. El bloque de tarjetas se centra por su estado final (x = 540, y≈760) y el título va pegado debajo, en colores invertidos: Montserrat espresso + Playfair con dorado oscuro `#C2A36B → #7E6036`.
- Las fotos de crucero (MSC) traen marca de agua del fotógrafo abajo: **recortar** (`ALBUMS` en `timeline.py`).
- Fotos verticales de cierres (cartel "CLOSED") van a pantalla completa con Ken Burns anclado a las caras.

### Movimiento, transiciones y SFX
- Zooms anclados a los ojos (1,42–1,92× sobre 720p), push-in lento en los tramos emotivos, punch en las frases cortas ("soy cubana").
- Transiciones suaves: zoom-blur (0,26) anclado a los ojos y whip; **destello cálido champagne** (screen, 9 frames) al entrar a cada bloque de fotos. Nada de glitch.
- SFX elegantes: whoosh suave en cortes, **arpa corta ("shimmer")** en títulos dorados, **obturador de cámara** en cada foto que aterriza, pop en cifras, "wink" en gestos (la taza). Rutas en `mix.py`.
- Música: aprobar con el usuario. En 06-09: **"Smooth Cuban"** (Envato, 116 BPM, `Pre Libertad Digital/SFX/envato-2PCSXJ7-01 Smooth Cuban.mp3`) como guiño a su origen; tema liviano en la banda de la voz (1 % de energía en 1–4 kHz) → −12/−13 dB bajo la voz con hueco de EQ.

## 3. Audio de sus tomas caseras
- 06-09: voz cruda −39,4 LUFS con **ruido de ambiente estable −50 dB con tonos en 157–372 Hz** (aire acondicionado/heladera). `afftdn` casi no lo baja (≤ 5 dB aun con nr 97) y la compresión lo levantaba en las pausas (voz/ruido 13 → 5 dB).
- Solución: highpass 110 Hz ×2 → **`scripts/plantilla_acabado/denoise_perfil.py`** (reducción espectral con perfil medido en las pausas de la toma, −18 dB) → expansor suave (`agate` threshold 0,014, ratio 2,5, range 0,2) → EQ + 2 compresores → ganancia a −12 LUFS → limitador −1 dBFS sobremuestreado. Resultado: pausas 26–30 dB bajo la voz, LRA 4,4 → 1,1 LU. Latencia de esa cadena: **2 ms** (medida; sin afftdn ya no son 27).

## 4. Referencia aprobada-en-curso
### A. Orgánico de presentación — `10 Octubre/06-09 YGM Antes de mostrarte casas/` (25,6 s, 1080×1920, 30 fps)
Una sola toma a cámara (sentada en su living) + 6 fotos. Estructura: hook titulado ("Antes de mostrarte casas, / quiero que me / *conozcas*") → nombre ("Yamilet — SOY CUBANA —") → "13 *años* — EN FLORIDA —" → capuchino (levanta la taza: esa pausa se deja) → álbum de viajes (París, Roma, Granada, Sevilla) "viajar y conocer / *lugares nuevos*" → push-in "pero mi motor de todos los días es" → álbum familia "*mi familia* — POR ESO HAGO LO QUE HAGO —" → "Ayudo a familias" → foto de cierre con tag Tampa Bay → foto de cierre "y comprar su / *primera* / propiedad" → push-in emotivo "porque sé lo que significa no tener" + "*un lugar seguro* — PARA LOS TUYOS —" → CTA "CUÉNTAME EN LOS COMENTARIOS / *¿de dónde eres?*". Se cortaron 5 pausas largas (30,8 → 25,6 s).

## 5. Pipeline (`scripts/plantilla_acabado/`)
Copiar a `PROYECTO/acabado/`. Corre con `~/venvs/align/bin/python` (numpy + PIL).
1. `avconvert -s <crudo.MOV> -p PresetHighestQuality -o ../sdr.mov` (HDR→SDR; el ffmpeg local no tiene zscale ni drawtext).
2. Whisper (`whisper-cli … large-v3-turbo`) para el texto → `alinear.py` (edicion-reels-base) por tramos → `align.json`.
3. `swiftc -O edicion-reels-base/scripts/track_cara.swift -o track_cara && ./track_cara ../sdr.mov 0 <fin> 30 > f3_yg.txt`; fotos: `swiftc -O caras_foto.swift -o caras_foto && ./caras_foto fotos/*.jpg > caras_fotos.txt` (fotos con la rotación EXIF ya aplicada: `ffmpeg -i foto.jpeg -q:v 2 fotos/foto.jpg`).
4. `timeline.py` (CUTS, SCENES, ALBUMS, TITLES/TITLE_PARTS, SUBS_W, TRANS, LEAKS, SFX) → `swiftc -O render_text.swift -o render_text` → `texts.py` → `pass1.py` → `pass2.py --guias` (revisión) / `pass2.py` → `mix.py`.
5. Portada: `scripts/portada_ygm.py` (sprite `c_portada` de `texts.py`) + `portadas-reels/scripts/portada_primer_frame.sh video_final.mov <portada.jpg> mix.wav <final.mp4> 30`.

## 6. Portadas
Sin portadas de reels publicadas todavía (2026-10-08): la primera es la de 06-09. Sistema propuesto: cuadro del arranque del video con ella **sonriendo**, sujeto más luminoso que el fondo, degradés espresso arriba/abajo, lockup del sistema de títulos (Montserrat crema chica + Playfair "quiero que me" + Playfair Italic grande "*conozcas*" con degradé dorado) pegado bajo el mentón, con un **velo espresso muy suave detrás del bloque** (α 0,42, blur 55) porque cae sobre su ropa beige. Cuando haya 4–5 portadas aprobadas, completar esta sección según `portadas-reels` §0.
