# Biblioteca de recursos (disco "MAC EDICION 2TB")

Raíz: `{HERRAMIENTAS}/`

## Estructura de un proyecto Yanira Team
`{CARPETA_CLIENTE}/01 REELS/<NN Mes>/<DD-MM YT Título>/`
con `VIDEOS/` (crudo, suele ser iPhone HEVC 4K HLG rotado), `VOZ/` (.srt), `MUSICA/`, `PORTADA/`, `PROYECTO/`, `RECURSOS/`.
El video final va en la raíz del proyecto con el mismo nombre de la carpeta + `.mp4`.
Manual de marca: `{CARPETA_CLIENTE}/00 IMAGEN DE MARCA/Yanira_Team_Imagen_de_Marca.pdf`.

## Música (`MUSICA/`)
- Usada: **`Luxury Living.wav`** (100 s, -10.8 LUFS, entra fuerte en el seg. 10 → arrancar en offset 6 s para que el drop caiga al final del gancho).
- Alternativas en tono: `1406325/Urban City Sunrise.mp3`, `2497745/Miami Nights.mp3`, `3887330/Radiant Smiles.mp3`, `4062317/Feel Good Groove.mp3`, `MA_DaniilDavydov_FamiliarPlaces_Main.wav`.

## SFX (`SFX/`) — mapa usado
| Nombre en public/sfx | Archivo original | Cuándo | Vol |
|---|---|---|---|
| whoosh | `SFX COMICOS/SFX COMICOS/Cinematic whoosh.wav` | barridos diagonales / B-roll | 0.4 |
| whoosh2 | `SONIDOS/whoosh slide.mp3` | tarjetas que entran/giran, títulos | 0.4–0.5 |
| swoosh | `SONIDOS/swipe swoosh.mp3` | salidas, tachados | 0.3–0.4 |
| pop | `SONIDOS/pop.mp3` | chips, checks, palabras | 0.35–0.55 |
| check | `SONIDOS/check mark.mp3` | ✓ | 0.45 |
| stamp | `SONIDOS/stamp.mp3` | sellos, golpes, tapa de papelera | 0.5–0.65 |
| cash | `SFX COMICOS/SFX COMICOS/Cash Register.mp3` | $0 | 0.35–0.55 |
| money | `VARIOS/DINERO.mp3` | pagos | 0.3 |
| papers | `SONIDOS/falling papers.mp3` | billetes cayendo | 0.42 |
| ding | `Multimedia/Multimedia Internet CD-Rom Flash Ding 26.wav` | llegada de un gráfico | 0.3–0.4 |
| magic | `SONIDOS/magic sound.mp3` (solo 1.2 s) | revelado del logo | 0.3 |
| riser | `VARIOS/Epic Cinematic Bass Riser 1.wav` (desde 4.6 s) | antes de ¡SÍ SE PUEDE! | 0.4 |
| success | `SONIDOS/success.mp3` | golpe de marca, cierre | 0.3–0.55 |
| bubbles | `SONIDOS/bubbles.mp3` | mensaje enviado/recibido | 0.35–0.45 |
| typing | `SONIDOS/typing.mp3` (0.6 s) | "escribiendo…" | 0.25 |
Convertir a WAV 48 kHz estéreo (`ffmpeg -i in -ac 2 -ar 48000 out.wav`); algunos mp3 tiran "Invalid data" al final: es inofensivo.

## Stock (`Stock Footage/`)
- Orlando: `Orlando Downtown Florida.mov` (4K atardecer, ideal gancho), `Orlando drone.mov` (lago Eola, 1080p), `Orlando drone 2.mov` (4K skyline día), `Orlando _City Beautiful_ 2022 _ 4K-(1080p).mp4`, `Lake Nona Public Art   Visit Orlando.mp4`, `Orlando, Osceola - Drone.mp4`.
- Compraventa: `Entrega llaves.mp4` (vertical), `Entrega llaves 2.mp4` (vertical 4K, cartel SOLD), `Rent house.mp4` (vertical, HOUSE FOR RENT), `Firma propiedad realtor inmobiliaria.mp4`, `2706697/Realtor Giving Keys To Happy Couple (HD).mov`, `1209673/Happy Family Having Fun In New House (HD).mov`, `Plano de casa.mp4`, `Mapa Florida.mp4`.
- Celular/WhatsApp: `Celular.mp4` (vertical), `Mujer texteando con celular.mov`.
Horizontal → vertical: `crop=ih*9/16:ih,scale=1080:1920` (solo si es 4K; en 1080p queda blando).

## Fuentes
`FONTS/Montserrat.zip` (static/ Light…Black). Copias en `assets/fonts/` de esta skill.
Las plantillas SubMachine (Premiere) están en `SubMachine Mogrts 2.3 - Gumroad/` (la referencia usó "Karaoke V2.3").

## Herramientas instaladas
ffmpeg (sin zscale: para HDR usar `avconvert -p PresetHighestQuality`), whisper-cli + `~/.cache/whisper/ggml-large-v3-turbo.bin`, Node 24 (Remotion 4).
