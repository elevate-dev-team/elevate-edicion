# Recursos del disco para LIU (sugerencias, no obligatorias)

Raíz: `{HERRAMIENTAS}/`
**Buscar primero en los catálogos CSV de `_INDICE/`** (stock de video y música ya están indexados).

## Música (`MUSICA/`)
El estilo LIU pide algo moderno y liviano con pulso (pop/house suave, chill beat), nunca épico ni tenso. **Escuchar antes de elegir.** Ojo: la pauta de referencia usó una canción pop comercial (Maroon 5) — eso fue una elección puntual, probablemente desde la plataforma; para masters propios usar stock del disco o preguntar.
- `Deep House Trend.wav` (`Stock Musica/Lujo y elegante/Lujo_Deep-House-Trend_2m43s.wav`): **aprobada en la pauta 05-10** — primera opción para pautas de recorrido con ritmo (usada desde el seg. 15 del tema, a −12 dB de la voz).
- `Drive Me Crazy` (Onaldin, `Stock Musica/Pop alegre/Pop-alegre_Drive-Me-Crazy_Onaldin_3m00s.wav`): **aprobada en el reel 03-10** para cuerpo musical cortado al beat. **118,0 BPM reales** (el catálogo dice 120), drops en 8,1 s y 65,104 s; el tramo 46–65 s (cierre + break suave) sirve de fondo para un hook de ~19 s que desemboca en el drop. Es pop denso: bajo la voz va a −20 dB + EQ.
- **BPM del catálogo: no confiar**, medir con `edicion-reels-base/scripts/grilla_beats.py`.
- `Luxury Living.wav`: probada en otros clientes inmobiliarios.
- La referencia común usó `Kind_Of_House` (`Lujo_Kind-Of-House_3m43s.wav`, suave, amable): alternativa más tranquila.

## SFX (`SFX/`)
En transiciones, placas y cifras (SFX aún sin catálogo en _INDICE). Ojo con pasarse de discreto: en la pauta 05-10, con 3 SFX a −14/−16 dB el usuario dijo "faltan efectos"; quedó aprobado con **8 SFX a −10/−14 dB + flashes blancos** en cada cambio de sección.
- `SONIDOS/whoosh slide.mp3` / `SONIDOS/swipe swoosh.mp3` para flashes, punch-ins y entrada de títulos (**whoosh slide aprobado en 05-10**).
- `SONIDOS/pop.mp3` para cifras y el precio (**aprobado en 05-10**).
- `SONIDOS/check mark.mp3` para listas/checklist de características (**aprobado en 03-10**, pico a 0,38 s).
- `VARIOS/Epic Cinematic Bass Riser 1.wav` para llegar a un drop (sube 2,75 s hasta el pico; aprobado en 03-10 a −17 dB).
- Picos medidos: pop 0,15 s · whoosh slide 0,34 s · swipe swoosh 0,68 s (alinear el pico con el corte).
- En el reel 03-10 quedaron **37 SFX en 57 s** con transiciones en todos los cortes (con 18 dijo "faltan sfx").
- Los mp3 de `SONIDOS/` tienen colas que hacen fallar el decoder en filter_complex: **convertirlos a WAV antes de mezclar**.
- Las referencias usaron `Simple_SFX_2.wav` y `Flares_01.mp3` (viven en los proyectos Premiere de LIU).
- Evitar SFX cómicos: no van con el tono.

## Stock (`Stock Footage/`)
Para reels comunes tipo referencia B: manos con calculadora/documentos, gráficos, ciudad. Siempre **mudo** y sin marcas de agua (regla de `edicion-reels-base`). El tilt-shift/blur sobre drone de barrio ya está aprobado.

## Fuentes
- **Capitana**: instalada en `~/Library/Fonts/` (18 OTF) y copiada en `assets/fonts/capitana/`. Origen: Adobe Fonts (no redistribuir fuera de esta Mac).
- **Blauer Nue**: original en `{CARPETA_CLIENTE}/00 IMAGEN DE MARCA/03 Tipografia/`, copiada en `assets/fonts/blauer-nue/`.
