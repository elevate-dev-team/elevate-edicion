# Recursos del disco para FHE (sugerencias, no obligatorias)

Raíz: `{HERRAMIENTAS}/`

## Música (`Stock Musica/`, catalogada por estilo; índice en `_INDICE/musica_catalogo.csv`)
La carpeta `MUSICA/` ya no existe (reorganizada, 2026-10): los temas se renombraron `<Estilo>_<Título>_<duración>`.
Buscar algo sobrio, moderno, con pulso (house suave / corporate / lounge), sin voces (**escuchar antes de elegir**; el BPM del catálogo puede estar mal, medirlo con `grilla_beats.py`):
- `Lujo y elegante/Lujo_Kind-Of-House_3m43s.wav`: **usado en 04-10 FHE DEPTO GUAYMALLEN**. Intro suave hasta 15,9 s; desde ahí bombo estable (121,0 BPM medido, primer tiempo 13,919 s). Cama a −13 dB de la voz + hueco de EQ.
- `Lujo y elegante/Lujo_Luxury-Living_1m41s.wav`: entra fuerte en el seg. 10.
- `Lujo y elegante/Lujo_Deep-House-Trend_2m43s.wav`: pautas de recorrido con más ritmo.
- `Corporativo y motivacional/Corporativo_Modern-Ideas_1m49s.mp3`, `Corporativo_A-New-Reference_2m00s.mp3`.
- `Emotiva y cinematica/Emotiva_Clarity_Roie-Shpigler_2m17s.mp3`.

## SFX (`SFX/`)
Discretos, solo en transiciones y en la entrada de títulos:
- `SFX COMICOS/SFX COMICOS/Cinematic whoosh.wav` para el zoom/desenfoque y el paso a dron.
- `SONIDOS/whoosh slide.mp3` y `SONIDOS/swipe swoosh.mp3` para barridos y títulos.
- `SONIDOS/pop.mp3` para cifras y precio (muy bajo).
- `VARIOS/Epic Cinematic Bass Riser 1.wav` antes de un golpe del gancho (ej. el paso a B/N).
- Evitar los SFX cómicos (`cartoon stretch`, `casino`, `love harp`…): no van con el tono.

## Overlays y texturas (`Recursos/Overlays/`)
- `FREE-Light-Leak-Transitions-Pack-4K-_ULTRA-HD_.mp4` (20 s, varias fugas): el light leak cálido de la referencia común. Aplicar en modo Screen/Add.
- `Film Grain.mp4`: grano sutil para unificar el stock con el material del cliente.
- `Topography_white.mp4`: curvas de nivel, opcionales como fondo de una placa (en baja opacidad sobre `#192027`).

## Stock (`Stock Footage/`)
Hay mucho stock de negocios, firmas, reuniones y dinero (AdobeStock_*, Pexels numerados, `Abogado.mp4`…). No está catalogado por nombre: revisar con hojas de contacto antes de elegir. En la referencia común el stock se usó oscurecido y desaturado.

## Fuentes
Originales en `{CARPETA_CLIENTE}/00 IMAGEN DE MARCA/04. Tipografía/` (también Thin, ExtraLight y variables). La skill copia en `assets/fonts/` los pesos útiles para video.
