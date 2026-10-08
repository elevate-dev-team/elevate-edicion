# Recursos del disco para DAI (sugerencias, no obligatorias)

Raíz: `{HERRAMIENTAS}/`

## Música (`MUSICA/`)
Algo moderno, con pulso, estilo "Miami": house suave, lounge, groove, sin voces. **Escuchar antes de elegir.** En pauta, nunca temas comerciales con derechos (Michael Jackson, Maroon 5, etc.).
- `MA_608_EMPTY_CITY_STREETS_MAIN.wav`: la usada en la pauta de referencia (13-07 RENTA).
- `Luxury Living.wav`: ya probada en otro cliente inmobiliario; entra fuerte en el seg. 10.
- `Deep House Trend.wav`, `Kind_Of_House_source_3266052.wav`: recorridos con más ritmo.
- `MA_E2YOU_SunnyGrooveDetonation_Main.wav`, `MA_RomanSenykMusic_FeeltheGroove_Main.wav`: groove luminoso, estilo de vida.
- `MA_DaniilDavydov_FamiliarPlaces_Main.wav`, `1406325/Urban City Sunrise.mp3`, `4206364/Clarity.mp3`: más sobrios, para reels a cámara o entrevistas.
- **Ya usadas en DAI (no repetir seguido):** `MA_608_EMPTY_CITY_STREETS_MAIN.wav` (13-07 RENTA PAUTA), `MA_DaniilDavydov_FamiliarPlaces_Main.wav` (13-09 PAUTA VENDER LA CASA DONDE; arranca a −15 y crece hacia el seg. 15).

## SFX (`SFX/`)
Los que se usaron en la referencia:
- `VARIOS/DINERO.mp3`: en el precio.
- `VARIOS/CLICK.mp3` y `SONIDOS/check mark.mp3`: en la ráfaga de amenidades.
- `VARIOS/EFECTO DE SONIDO GOLF PARA TEXTOS_(MP3_320K).mp3`: entrada de textos/títulos.
- `SONIDOS/glitch.mp3`: con las transiciones glitch.

Otros que encajan: `SONIDOS/whoosh slide.mp3`, `SONIDOS/swipe swoosh.mp3`, `SONIDOS/pop.mp3` (cifras, muy bajo), `SFX COMICOS/SFX COMICOS/Cinematic whoosh.wav` (paso a dron). Evitar los cómicos (`cartoon stretch`, `casino`, `love harp`…).

## Transiciones y overlays
- **Glitch RGB** (la transición más usada en DAI): en Premiere se hizo con *Mettle SkyBox Digital Glitch*. Fuera de Premiere: `Premiere/OVERLAYS/thinkmakepush_glitchoverlay/tmp_glitch_01…10.mp4` en modo Screen/Add, o un split RGB propio de 3–6 cuadros.
- **Flash / light leak**: `Recursos/Overlays/FREE-Light-Leak-Transitions-Pack-4K-_ULTRA-HD_.mp4` (Screen/Add). Los usados en la referencia son los *Hst - Flr Light Leaks* de Motion Bro (`~/Documents/Motion Bro/Free Motion Bro Presets for Premiere Pro (Legacy)_for_PP_by_videolancer/01. Transitions/(Footage)/`, con `Flares_01.mp3`).
- `Recursos/Overlays/Film Grain.mp4` (1280×720, 12 min, polvo y grano sobre negro): en *screen* al ~45 % unifica stock de distintas cámaras y da textura a los fondos de motion. Escalar/recortar a 1080×1920.
- `Recursos/Overlays/Paper Background.mp4` (papel arrugado blanco): un cuadro como textura en *multiply* al 30–45 % sobre tarjetas, hojas y polaroids crema.
- `Recursos/Overlays/Topography_gold_and_black.mp4` (líneas de topografía doradas): en *screen* al ~10 % y desaturado sobre chocolate, como fondo de escenas solo de motion (sensación de "mapa / comunidad").

## Stock revisado
Raíz: `Stock Footage/`. Los nombres numéricos son stock con licencia (Pexels, Envato, AdobeStock, Mister Horse). Los que tienen título de YouTube se pueden usar si la marca de agua queda fuera del recorte final (ver `edicion-reels-base` §9).
- Sin marca de agua (revisados 2026-09-29): `Realtor Mostrando propiedad.mov` (realtor con pareja mayor frente a una casa, horizontal 4K), `Firma propiedad realtor inmobiliaria.mp4`, `Familia 3.mp4`, `Reparacion casa.mov`, `remodelacion construccion pared.mp4`. También hay `Entrega llaves 2.mp4` (cartel FOR SALE/SOLD), `Tasacion.mov`, `Plano de casa.mp4` y `Dinero.mp4` / `dinero 2-4.mp4`.
- Con logo: `Miami Pinecrest in 4K ｜ Florida ｜ Neighborhood Tour.mp4` lleva "All In Miami" abajo a la derecha, y la placa final es del canal. Al recortar a vertical por el centro el logo queda afuera; evitar la intro y la placa final.
- `Realtor Mostrando propiedad.mov` y `Reparacion casa.mov` traen audio: quitarlo.

## Material del cliente
- Cada proyecto trae el suyo en `VIDEOS/` y `RECURSOS/` (ej. `13-07 DAI RENTA PAUTA/RECURSOS/Miami Beach video.mov`, dron de Miami Beach).
- Revisar las tomas crudas de `VIDEOS/` aunque el video venga montado: suele haber B-roll sin usar del lugar (en 13-09 la vereda de la comunidad, `IMG_6322`). Son iPhone HLG: pasar a SDR con `avconvert` antes de usarlas.
- Fotos de perfil (fondos chocolate/cognac): `85 Dairon Rubio/00 IMAGEN DE MARCA/01 Foto de perfil/DAI_Foto1-3.png`.

## Fuentes
Originales en `{CARPETA_CLIENTE}/00 IMAGEN DE MARCA/03 Tipografía/` (incluye las variables). Copia completa en `assets/fonts/` de la skill.
