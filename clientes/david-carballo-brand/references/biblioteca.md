# Recursos del disco para DC (sugerencias, no obligatorias)

## Música — funk para redes
Lo que se usó en las referencias (Motion Array, descargado dentro de cada `PROYECTO/Motion Array Library/Music/`):
- *Jukebox Jams*, *Blink Blink* (08-09): funk/groove con bajo marcado. **La dirección de DC.**
- *Moonlight Magic* (04-09, 06-09), *Models* (14-09): groove pop con pulso.
- *Reaching For The Stars*, *Rising Together* (02-10, 05-08, 15-09): más inspiracional; solo para piezas de tono "representación / confianza".

- *Lost In The Fire* (Gesaffelstein & The Weeknd, instrumental), en `{MUSICA}/`: sintes oscuros y graves, casi sin energía en la banda de la voz. Elegida por el usuario para el reel educativo 07-10, desde 0:11.
- *Timeless (Instrumental)*, en `{MUSICA}/`: trap oscuro, banda de la voz 9,6 dB bajo el total, BPM medido 150 (golpes fuertes cada 0,75 s en la intro). Usada en 06-10 desde 22,73 s (drop en 26,25 s); aprobada a −16 dB bajo la voz (a −13 dB era "demasiado fuerte").

- *Gimme that Groove!* (Michael Ramir C., Mixkit, gratis), en `{CLIENTES}/FRANCHU/…/16-10 FM Pauta webinar 5/MUSICA/` y en el `MUSICA/` de 05-10: funk con groove, banda de la voz ≤ 3 % de la energía. Usada en 05-10 desde el seg. 8, a −13 dB bajo la voz (aprobada).

Para los próximos: buscar en Motion Array / Envato "funk", "funky groove", "nu disco", "funk social media": guitarra rítmica, bajo slap, 100–120 BPM, sin voces. Escuchar antes de elegir y medir el BPM con `grilla_beats.py`.
En `{MUSICA}/` lo más cercano es `Bounce Me Brother (With a Solid Four).mp3`. El resto de esa carpeta (cinemático, trap, clásica) no va con DC.

## SFX (`{SFX}/`)
- `CashMoney Sound Effect.mp3`: precios (está en 04-09, 02-10 y 08-09).
- `Eye Wink Sound Effect.mp3`, `Mouse Click Sound Effect.mp3`: entrada de títulos y palabras clave.
- Animation Composer (pack de Premiere): *Swoosh 04 - 02*, *Swoosh 04 - Double 02*, *Swoosh Transition 28*, *Transition Complex 14* para los whips con desenfoque.
- `SFX - Keyboard - 01.wav`: cuando habla de emails o escribe.

## Stock (`{STOCK}/`)
Sirven para DC: `TAMPA 2.mp4`, `TAMPA BEACH.mp4`, `TAMPA MIAMI.mp4`, `FLORIDA.mp4`, `FLORIDA CASA.mp4`, `autopista florida.mp4`, `MIAMI.mp4` (solo si habla de Florida en general), `FIRMA*.mp4`, `FIRMA CONTRATOS.mp4`, `documentos.mp4`, `LLAVES*.mp4`, `CALCULADORA*.mp4`, `DOLARES.mp4`, `TELEFONO 2.mp4`, `INSPECCION CASA.mp4`.
**No usar:** `CALLE FLORIDA*.mp4` (es la calle Florida de Buenos Aires), nada de Argentina / Mendoza / pesos.

## Material propio
Tomas de cada casa en `VIDEOS/` y `RECURSOS/` de cada reel; se reutilizan entre reels de la misma propiedad (04-09 usa tomas de 06-09; 08-09 usa tomas de 07-09). Revisarlas antes de ir a stock.
Logos de entidades (Citizens, etc.) en el `RECURSOS/` de la pieza donde se usaron.

## Stock ya usado con David (no repetir)
El usuario pide no repetir stock entre videos de DC (06-10 y 05-10). Antes de elegir, sacar la lista de todo lo usado:
- Premiere: `for p in {CARPETA_CLIENTE}/01\ REELS/*/*/PROYECTO/*.prproj; do gunzip -c "$p" | grep -o '<ActualMediaFilePath>[^<]*'; done | sed 's#.*/##' | sort -u`
- Remotion: los archivos de `public/dc*/` del proyecto.

Usado hasta 05-10 (2026-10-23): `AGENTE BIENES RAICES 2`, `CALCULADORA`, `CLIENTE REAL STATE 6`, `CONTRACT`, `Copia de documentos` (= `documentos`), `DASD`, `FIRMA 3`, `FIRMA CONTRATOS`, `FLORIDA CASA`, `FLORIDA`, `GAS`, `INSPECCION 3`, `MIAMI`, `REALTOR 8`, `TAMPA`, `SHED` (propio), clips de Motion Array (manos con llaves de pareja, firma con abogado, tarjeta de crédito, dinero pasado de mano, teléfono, skyline de Tampa, llamada al 911, hornalla) y en 05-10: `TASADOR`, `AGENDAR`, `LLAVES 3`, `escribir`, `PAREJA 8`, `PAREJA 2`.
Descartado por temblor: `CALCULADORA 3` (1,37 px con `temblor.py`), `DOLARES` (3,1 px).
