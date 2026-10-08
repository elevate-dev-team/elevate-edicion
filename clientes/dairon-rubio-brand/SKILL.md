---
name: dairon-rubio-brand
description: Identidad visual para video de Dairon Rubio (DAI), realtor en Miami (Miami Beach, Brickell, Hialeah, Homestead) — "Invierte mejor. Vive Miami." Tipografía Blacker Sans Text con mezcla de pesos (Regular + Heavy/Black, itálicas de acento), subtítulos blancos a media altura, acentos óxido/crema (caja semitransparente, contornos en CTA y precios), paleta cálida chocolate / cognac / arena / crema, más la referencia de tres piezas aprobadas (pauta mostrando propiedad en renta, reel común de visita/entrevista en un desarrollo y pauta de venta a cámara con tramo en off animado) y una plantilla de Remotion reutilizable. Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Dairon Rubio / DAI (reels, pauta de propiedades, renta, preconstrucción, YouTube, portadas), o cuando el usuario diga "editá el video de Dairon", "video de DAI", "con la marca de Dairon Rubio", aunque no mencione la skill.
---

# Dairon Rubio (DAI) — Marca para video

Reglas obligatorias (márgenes, cara, voz, niveles, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Esta skill solo agrega lo propio del cliente.

- Cliente: **Dairon Rubio Castro**, Realtor en Miami (Miami Beach, Brickell, Hialeah, Homestead). Renta, preconstrucción y venta. Tagline: **"Invierte mejor. Vive Miami."** Siglas de archivos: **DAI**.
- Tono: premium cálido, "lujo accesible" de Miami, cercano. Español caribeño neutro; mezcla tú y usted ("¿Y sabe por qué?", "Si quieres conocerla, escríbeme"): respetar lo que dice, no corregirlo en los subtítulos.
- Carpeta del cliente: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM DAI Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/`. El final va en la raíz de esa carpeta con el nombre de la carpeta (+ ` V1`, ` V2`… si hay versiones) `.mp4`; la portada `.jpg` va en `PORTADA/`.
- **No se usa logo en los videos** (no hay archivo de logo; las referencias no lo usan). Tampoco placas de marca ni end card.

## 1. Lo que se usa de la marca

### Tipografía — Blacker Sans Text (el elemento de marca principal)
Archivos en `assets/fonts/` (versión **Trial**, familia interna `Blacker Sans Text Trial`; ya instaladas en `~/Library/Fonts`):

| Uso | Peso | PostScript |
|---|---|---|
| Palabras "de relleno" del subtítulo | Regular (a veces Book) | `BlackerSansTextTrial-Regular` |
| Palabra clave del subtítulo | Heavy (a veces Extrabold) | `BlackerSansTextTrial-Heavy` |
| Precios, títulos, CTA | Black | `BlackerSansTextTrial-Black` |
| Acento emotivo (adjetivos, frases de estilo de vida) | Extrabold Italic / Heavy Italic | `BlackerSansTextTrial-ExtraboldItalic`, `-HeavyItalic` |

- ⚠️ **En las itálicas Trial los números no existen**: salen como un glifo "TRIAL FONT". Cifras, precios, horarios y m² van **siempre en pesos rectos** (Regular → Black), que sí tienen los números. Revisar cualquier texto en itálica que lleve dígitos.
- La firma es el **contraste de pesos dentro de la misma frase** (fino + negrita, recto + itálica), no el color.
- Licencia: son Trial; si hace falta confirmar uso comercial, avisar al usuario.

### Color
Paleta oficial (`assets/DAI_PALETA.png`):

| Nombre | HEX |
|---|---|
| Chocolate | `#34150F` |
| Cognac | `#86451E` |
| Arena | `#EACDA9` |
| Crema | `#FFF8F0` |
| Casi negro | `#140E0B` |

**Cómo se aplica en los reels (esto es lo que manda en video):**
- Subtítulos y títulos base: **blanco `#FFFFFF`** con sombra suave oscura.
- **Óxido de los reels**, más oscuro y rojizo que el cognac de la paleta:
  - Caja de resaltado: **`#6E2C16` semitransparente (~70–80 %)** detrás de la frase.
  - Contorno de CTA y precios: **`#78301A`**, grueso.
- Relleno de CTA / precio / título destacado con contorno: **crema `#FFF8F0`**.
- **Arena `#EACDA9`**: títulos de portada (y placas si alguna vez hacen falta). Chocolate `#34150F` para fondos o barras de placas y `#140E0B` para sombras.

## 2. Referencias aprobadas (NO son fórmula)
> Así se resolvieron tres videos de 2026. Sirven para entender el gusto del cliente; cada video nuevo decide su propia estructura, ritmo y tratamiento según su contenido.

### A. Pauta mostrando propiedad — `06 Junio/13-07 DAI RENTA PAUTA/` (52 s, 25 fps)
- **Guion tipo**: gancho con ubicación + precio en los primeros 5 s ("…rentar en Miami Beach con un presupuesto de $3500 al mes, este sería uno de los primeros apartamentos que iría a ver. ¿Y sabe por qué?"), argumento (ubicación privilegiada, edificio con amenidades tipo resort, renovado), momento de estilo de vida (balcón, café, trabajar desde casa), amenidades, precio de nuevo, CTA "Si quieres conocerla, escríbeme y coordinamos una visita".
- **Imagen**: todo en **voz en off**; Dairon aparece en cuadro caminando, abriendo la puerta o sentado, sin hablar a cámara.
  - POV manejando → ascensor → él abre la puerta → recorrido en gran angular con gimbal → dron del edificio y la playa → balcón.
  - Amenidades en ráfaga: **una palabra por plano de ~1 s** (Piscina, Infinity, gimnasio, jacuzzi, sauna, concierge 24 horas, valet parking).
  - ~24 cortes, un plano cada ~2,2 s.
- **Textos**:
  - Ubicación como título "MIAMI BEACH" (Black mayúsculas, crema con contorno óxido, ~115 px) debajo del subtítulo "rentar en".
  - Primer precio "$3500" en Black blanco ~140 px.
  - Precio final "$3.500" crema con contorno óxido y "al mes" chico debajo.
  - CTA "ESCRIBEME" en Black ~125 px, crema + contorno óxido grueso + sombra.
  - 2 frases con caja óxido ("está rentando", "envolvente").
- **Transiciones**: flash / light leak, **glitch RGB digital** (el recurso más repetido), barrido, distorsión de lente, blur.
- **SFX**: dinero en el precio, click / check en las amenidades, golpe suave en textos, hiss en el glitch.

### B. Reel común — `09 Septiembre/10-09 DAI the standard residences/` (65 s, 25 fps)
- **Visita a un desarrollo con entrevista a varios speakers** (Dairon + dos representantes), a cámara, todo material propio (sin stock).
- Gancho: Dairon en la cocina modelo con un objeto de la marca del proyecto (botella de agua) → presentación afuera del edificio → recorrido/charla adentro.
- Planos de ~4 s + **punch-ins** dentro del mismo plano; tomas cercanas tipo selfie para mostrar objetos (gorra con el logo del proyecto).
- Título "EN MIAMI" en Black blanco ~150 px en el tercio superior (y ≈ 580), por encima de la cabeza.
- Transiciones: glitch RGB y distorsión de lente.

### C. Pauta de venta a cámara + tramo en off animado — `09 Septiembre/13-09 DAI PAUTA VENDER LA CASA DONDE/` (V2 aprobada, 47 s, 25 fps)
- **Guion**: dos speakers a cámara, **Martha** (vecina de Miramar, 32 años en la zona) y Dairon, alternando.
  - Hook emocional ("Vender la casa donde criaste a tus hijos en Miramar duele").
  - Argumento ("El comprador no paga los recuerdos…").
  - **Tramo de 23 s con pantalla en negro y voz en off**, que explica el proceso en 3 pasos.
  - CTA de los dos juntos ("Escríbenos por WhatsApp…").
- **Material**: rodaje propio en la comunidad (parque, cancha, lago) + stock enmarcado. El video vino ya montado por el editor: no se tocó orden ni duración.
- **Cámara**: push lento en cada plano y 2 punches con los ojos fijos. En el plano cerrado del lago se sacó el punch porque el subtítulo ya no entraba debajo del mentón dentro del límite de pauta.
- **Textos a cámara**:
  - "en / MIRAMAR" (Regular + Black crema con contorno óxido).
  - "32 AÑOS" en Black blanco.
  - CTA "Escríbenos por / WHATSAPP" **arriba de las cabezas** (los dos speakers llenan la mitad de abajo), con una sombra cálida `#140E0B` degradada arriba para leerse sobre el cielo. En ese plano los subtítulos también van arriba (y ≈ 615).
  - 2 cajas óxido: "sin vender." y "no con nostalgia."
- **Tramo en off (lo que más gustó; es referencia, no fórmula)**:
  - Cada gráfico centrado, con el subtítulo pegado debajo a altura fija (y ≈ 1100).
  - Fondo: el mismo clip de stock desenfocado y teñido chocolate, más grano de película, viñeta y topografía sutil (screen ~10 %) en las escenas solo de motion.
  - Stock **enmarcado en tarjetas crema** (borde 12 px, radio 28, sombra, leve inclinación y flotación).
  - Marcadores de paso **01 / 02 / 03** en círculo óxido con borde arena.
  - Etiqueta de precio colgante; tarjetas de casa con sello **"VENDIDA"** que se dan vuelta a "CERRÓ EN".
  - **Cifras ocultas**: "$" + dígitos que giran muy desenfocados (nunca legibles).
  - Checklist en papel crema ("¿Qué conviene *arreglar*?").
  - Hoja "POR ESCRITO" (precio de venta − hipoteca − costos de cierre − comisiones = "Lo que te queda *en la mano*" en caja óxido).
  - Cierre: foto familiar sepia en **polaroid que se cae** y entra "Así decides con / **números** / no con *nostalgia*".
- **Transiciones**: glitch RGB al entrar y salir del negro y en el cambio al cierre; flash cálido entre planos de stock.
- **Audio**: `MA_DaniilDavydov_FamiliarPlaces_Main.wav` a ~−31 LUFS. SFX: sellos (`stamp`), giros (`flip`), checks, clicks por línea de la hoja, `DINERO` en el total, whoosh en la caída de la polaroid, glitch.
- **Correcciones del usuario en V1 → V2**: interlineado más apretado, información del tramo en off centrada (en V1 los gráficos estaban arriba y los subtítulos abajo) y un tratamiento más trabajado.

### Subtítulos en todos
- Blacker Sans Text **blanco, sombra suave, sin caja** (salvo la caja óxido ocasional). **~80–85 px** de cuerpo.
- **1–3 palabras por bloque**, centrados, en minúscula tipo oración (mayúscula solo al iniciar frase).
- **El bloque entra entero, no hay karaoke palabra por palabra.** El énfasis es por peso: relleno en Regular + palabra clave en **Heavy** ("tipo **resort**", "fue este **balcón**"); adjetivos con emoción en **Extrabold/Heavy Italic** ("una ubicación *privilegiada*", "*se disfruta*", "*vista bonita*"). Palabras sueltas fuertes (amenidades, "coordinamos") van todas en Heavy.
- **Caja óxido semitransparente** detrás de la frase: como máximo 1–2 veces por video, para la idea central ("está rentando").
- Posición:
  - Sin speaker hablando (pauta en off): **centro, y ≈ 960**. Si hay gráficos, el subtítulo va pegado debajo del gráfico centrado (ver C).
  - Con speaker a cámara: **a la altura del pecho, debajo de la cara (y ≈ 840–1215 según el plano)**. En pauta el límite es y = 1250; si no entra, arriba de las cabezas.

### Audio de las referencias
Cama musical continua (en la pauta, `MA_608_EMPTY_CITY_STREETS_MAIN.wav`) y SFX puntuales en precio, amenidades y transiciones. Las dos salieron en −10 LUFS y la pauta clipea (+0,2 dBFS): **para los niveles valen los de `edicion-reels-base`, no los de la referencia.** La del reel común usó un tema comercial ("Chicago", Michael Jackson): en pauta nunca música con derechos.

### Portadas (referencia)
Cuadro del video + título en Blacker Sans: **Black mayúsculas en arena `#EACDA9`** para la palabra-golpe o el precio ("$3.500/MES", "THE STANDARD") combinado con **Heavy minúscula en blanco** ("Apartamento por solo", "residences"), sombra suave, sin cajas. Los carruseles usan el mismo sistema en plano: fondo crema, barras chocolate. Formato, márgenes (cuadrado 1080×1080), sujeto aislado, interlineado y portada como primer frame del video: skill `portadas-reels`.

## 3. Ideas que pueden sumar (opcionales, a criterio)
- Placa de datos breve en pauta (dormitorios · baños · precio) con Regular + Black, sobre barra chocolate o crema como en los carruseles, si la voz los dice rápido.
- Teñir sombras u oscurecidos con `#140E0B` en vez de negro puro.
- El glitch RGB es la transición de la casa, pero no hace falta en cada corte: alternarlo con flash/light leak y cortes limpios.

Recursos del disco sugeridos para este estilo: `references/biblioteca.md`.

## 4. Plantilla de Remotion (`template/`)
Código del video C, para no arrancar de cero. **Es infraestructura, no una estética a repetir**: lo visual se decide en cada video.
- **Reutilizable tal cual**:
  - `brand.ts`: paleta, óxidos, zona segura de pauta y easings.
  - `fonts.ts`: Blacker Sans, una familia por peso (`BS-Regular`, `BS-Heavy`, `BS-Black`, `BS-ExtraboldItalic`, `BS-HeavyItalic`), cargada desde `public/fonts/Blacker-Sans-Text-*-TRIAL.ttf`.
  - `Titles.tsx → outlined()`: texto crema con contorno óxido `#78301A` (`WebkitTextStroke` + `paintOrder: 'stroke fill'`).
  - `FX.tsx`: glitch RGB (la escena se dibuja por canal con `feColorMatrix` y se suma en *screen*, más franjas desplazadas) y flash cálido.
- **A adaptar en cada video**:
  - `camera.ts` (`SHOTS`): push por plano y punches alrededor de los ojos medidos con `eyes.swift`, más las cajas de cabeza para las guías.
  - `Captions.tsx` (`CAPS`): bloques con `*palabra` = Heavy y `_palabra` = Extrabold Italic, y `capY()` por plano.
  - `BlackScenes.tsx`: escenas del tramo en off (solo como ejemplo de piezas: `Framed`, `BgBlur`, `Step`, `Hidden`, tarjetas, checklist, hoja, polaroid).
- **Uso**:
  1. Copiar `template/` a `PROYECTO/claude/remotion/` y correr `npm install`.
  2. Poner el video en `public/base.mp4`, las fuentes en `public/fonts/` y el stock (sin audio) en `public/stock/`.
  3. Generar `src/data/faces.json` con `faces.swift`.
  4. Render de revisión: `npx remotion render Main out.mp4 --props='{"guides":true}' --scale=0.5 --muted`.
  5. Render final `--muted`. El audio se mezcla aparte con ffmpeg y se masteriza con `yanira-team-brand/scripts/finalize.sh`.
