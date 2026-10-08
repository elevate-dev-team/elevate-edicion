---
name: yanira-team-brand
description: Identidad visual y sistema de edición de video de Yanira Team (realtor en Orlando / Centro de la Florida, "YES WE CAN"). Marca (paleta, Montserrat con interletrado/interlineado bajos, logo YA\IRA), preferencias del cliente, recursos del disco y herramientas probadas (HDR→SDR, corte de silencios, Whisper, seguimiento facial con Vision, Remotion, mezcla -13 LUFS) más una plantilla de referencia del video 24-09. Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, anime, subtitule o diseñe cualquier pieza de Yanira Team (reels, pauta, YT, portadas, placas), o cuando el usuario diga "editá el video de Yanira", "con la marca de Yanira", "estilo Yanira Team", aunque no mencione la skill. 
---

# Yanira Team — Marca y edición de video

## 0. Reglas
Las reglas obligatorias (márgenes seguros, no tapar la cara, voz presente, fin al terminar de hablar, revisión) están en la skill **`edicion-reels-base`**: cargarla siempre. Resumen y detalles específicos de este cliente:

### 0.1 Márgenes de seguridad de redes sociales — SIEMPRE
Todo texto, gráfico, logo, subtítulo o dato va **dentro de la zona segura** (1080×1920):

| Borde | Margen | Qué lo tapa |
|---|---|---|
| Arriba | **270 px** | nombre de cuenta, "Reels", cámara, barra de estado |
| Abajo | **480 px** (contenido hasta y = 1440) | caption, usuario, audio, barra de progreso, CTA de anuncios |
| Izquierda | **70 px** | bordes y gestos |
| Derecha | **180 px** (contenido hasta x = 900) | like, comentar, compartir, guardar, audio |

- Zona segura: `x 70–900, y 270–1440` (830×1170, **centro x = 485**, no 540). En código: `SAFE` en `brand.ts`.
- Los fondos, videos y texturas decorativas pueden ocupar el cuadro completo; **la información no**.
- Todo título grande se autoajusta al ancho seguro (`KeywordTitle` ya lo hace). Números largos: bajar la tipografía antes que salirse del margen.
- Verificar SIEMPRE con un render de revisión con guías (`--props='{"guides":true}'`: rectángulo cian = zona segura).

### 0.2 Nunca tapar la cara
- Se detecta la cara cuadro a cuadro (`scripts/track_face.py`, Vision de macOS) y se calcula su **caja de cabeza** (pelo + cara + mentón) después del zoom (`camera()` en `layout.ts`; en las guías se ve en rojo).
- Ningún gráfico, título, subtítulo ni logo puede cruzar esa caja, **tampoco durante las transiciones** (un título que sigue en pantalla mientras la cámara se mueve es el error típico: sacarlo antes de que arranque el movimiento).
- Validar numéricamente con `check_safe.ts` (ver pipeline): todos los valores deben dar ≤ 0 px de solapamiento. Si una zona choca: bajar el título, quitar el punch de zoom o reprogramar la transición.
- Cuidado con pósters/cuadros con caras en el fondo: el seguimiento debe quedarse con la trayectoria continua del speaker.

### 0.3 Otras reglas del cliente
- **El video termina cuando ella termina de hablar** (sin placa de cierre / end card).
- **Interletrado e interlineado bajos** siempre.
- **Voz bien presente**: música ~0.085 (≈ -30 LUFS) bajo la voz, SFX al 80 %, master **-13 LUFS / -1 dBTP**.

- **Portadas:** Formato, márgenes (cuadrado 1080×1080), sujeto aislado, interlineado y portada como primer frame del video: skill `portadas-reels`. Estética: Montserrat y paleta de esta skill; todavía sin guía de portadas → armarla según `portadas-reels` §0 la primera vez.

## 1. Identidad (manual 2026) y reinterpretación para video

Manual: Dorado `#866C4A` (principal), Arena `#C1AA8C`, Gris `#DDDDDD`, Blanco `#FFFFFF`, Negro `#000000`; Montserrat; logo "YA\IRA" (la N es una diagonal "\"); tagline YANIRA TEAM — YES WE CAN.

**El cliente pidió NO copiar el PDF literal** (placas blancas vacías se veían pobres). Lenguaje que se usó y aprobó en 24-09 (referencia, se puede variar):
- **Oscuro premium**: fondos `#15120F`→`#211B16` con brillo dorado radial que se mueve, curvas topográficas arena al 14 % y retícula de puntos que se desplaza (`DarkBg`).
- **Oro metálico** para números y palabras clave: `GOLD_GRAD` (`#F1DDB6 → #D2B282 → #A98A5C → #866C4A`) con `background-clip: text`. Oro claro `#D9BF94` para íconos y acentos. Logo en `assets/logo_oro_claro.png` sobre oscuro.
- **Tipografía**: Montserrat ExtraBold/Black para titulares y números (tracking -0.04/-0.06em, line-height 0.85–0.95); Bold 700 para subtítulos; eyebrows en píldora (Bold 26, mayúsculas).
- **Densidad de información**: cada gráfico cuenta algo concreto (contadores, barras, tablas, chips, gráficos de línea) con etiqueta "EJEMPLO" cuando hay cifras ilustrativas. Nada de tarjetas con un solo título perdido.
- Placas a pantalla completa oscuras con contenido centrado en la zona segura; el golpe de marca (¡SÍ SE PUEDE!) sobre dorado.
- Transición de marca: barrido diagonal "\" con franja dorada (`SlashReveal`).

## 2. Referencia: soluciones del video 24-09 (NO es fórmula)
> Lo que sigue es cómo se resolvió "Alquilar vs comprar" (aprobado por el cliente). Son **decisiones estéticas de ese video**: no repetirlas por defecto. Cada video nuevo decide su propio layout, estilo y forma de evitar la cara según su contenido; se pueden reutilizar piezas si encajan.

Layout usado: pantalla dividida + cámara que sigue la cara
- **Modo completo**: speaker a pantalla completa, cabeza en el tercio superior (nunca por encima de y≈300), subtítulos en y≈1296, títulos de palabra clave en y≈1090–1410.
- **Modo dividido** (cuando hay gráfico): la cámara baja al speaker con un movimiento suave (0.5 s) y desde arriba entra un **panel oscuro** con borde diagonal "\" y filete dorado con brillo. El gráfico vive en el panel (dentro del margen); los **subtítulos se deslizan a la fila inferior del panel**, lejos de la cara; la cabeza queda completa debajo del borde.
- Zoom calculado por **tamaño real de la cara** (objetivo 17–29 % del ancho según el plano), cortes duros en los silencios y **reencuadres animados** en cambios de idea; push-in continuo; punches cortos en palabras clave (solo si no chocan con un título).
- Intermedio a 2160×3840 para poder acercar hasta ×1.75 sin perder calidad.

## 3. Movimiento que gustó (fluido y moderno)
- Nada aparece "de golpe": textos con **máscara** que suben desde una ranura con leve desenfoque (`Reveal`, `Words`), títulos letra por letra, páginas del panel que entran por la derecha y salen por la izquierda con blur, contadores con easing, íconos de línea que se dibujan.
- Springs sedosos (damping 16–20); easing expo-out en entradas, in-out en cámara y páginas.
- **Movimiento continuo** en todo lo que está en pantalla: brillo del fondo, retícula, curvas, ícono gigante tenue que gira detrás del panel (`PanelDeco`), carruseles (`ProgramsPage`), push-in de cámara.
- Continuidad narrativa: transformar en vez de cortar (tachar "MORTGAGE" → "INVERSIÓN", contador que termina en un sello "$0").

## 4. Pipeline
1. `python3 scripts/prep_video.py <crudo.mov> <trabajo>` → SDR, silencios, intermedio 2160×3840, voz procesada, transcripción por palabra → `cut.mp4` + `edit.json`. Revisar nombres ("Yanira Team").
2. `python3 scripts/track_face.py <trabajo>/cut.mp4 <trabajo>/faces.json`.
3. Copiar `template/` a una carpeta local (no al disco externo), `npm i`; `public/`: `cut.mp4`, `assets/logo_*.png`, `assets/fonts/*`, música, SFX, B-roll; `src/data/`: `edit.json`, `faces.json`.
4. Diseñar la historia de ESE video (layout y estilo propios; la plantilla es solo un punto de partida opcional): leer la transcripción, definir, si se usa panel, `SPLITS` (ventanas de panel y altura del borde) en `layout.ts`, escribir las páginas en `mg/scenes.tsx` y la línea de tiempo en `Main.tsx` (páginas, placas, B-roll, títulos, `HIDE_CAPTIONS`, SFX sincronizados a la palabra).
5. **Verificación obligatoria**:
   - `npx esbuild check_safe.ts --bundle --platform=node --format=cjs --outfile=check.cjs && node check.cjs` → todo ≤ 0 (ajustar las zonas de títulos del script a las del video).
   - Render de revisión con guías a media resolución + hojas de contacto con ffmpeg: nada fuera del cian, nada sobre el rojo, textos legibles en celular.
6. Render final `--crf=16 --audio-bitrate=320k` → `scripts/finalize.sh render.mp4 "<proyecto>/<nombre>.mp4"`. `.srt` en `VOZ/`. Guardar el proyecto Remotion (sin node_modules) en `PROYECTO/remotion/`.

Componentes y escenas: `references/motion.md`. Recursos del disco: `references/biblioteca.md`.
