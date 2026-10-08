---
name: liubel-perez-brand
description: Identidad visual para video de Liubel Pérez (LIU), realtor en Tampa, Florida. Tipografías Capitana (títulos y subtítulos) + Blauer Nue (palabras resaltadas), interletrado e interlineado muy bajos (líneas casi tocándose), detección y corrección de la "niebla" de lente sucia (scripts/niebla.py), subtítulos blancos a media altura con palabras clave en bold, azul de marca #2D6191 como único acento, títulos gigantes extra bold detrás del speaker por rotoscopia (scripts incluidos), CTA en Black sólido gigante (nunca outline), precio con elipse verde dibujada y precio anterior tachado en rojo, zooms marcados (mínimo 1.5x) con ojos clavados, flashes blancos y SFX en transiciones, más la referencia de cuatro piezas aprobadas (dos pautas de propiedad, un reel de talking head en set y un reel de propiedad con hook a cámara + cuerpo musical cortado al beat), y una plantilla del pipeline de acabado (zooms anclados a los ojos, títulos animados, rotoscopia, transiciones, mezcla). Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Liubel Pérez / LIU (reels, pauta de propiedades, YouTube, portadas), o cuando el usuario diga "editá el video de Liubel", "video de LIU", "con la marca de Liubel Pérez", aunque no mencione la skill.
---

# Liubel Pérez (LIU) — Marca para video

Reglas obligatorias (márgenes, cara, voz, niveles, fin al terminar de hablar, stock mudo, revisión): skill **`edicion-reels-base`**, siempre. Esta skill solo agrega lo propio del cliente.

- Cliente: **Liubel Pérez**, "Realtor", Tampa, Florida (Carrollwood, Hyde Park, zips 336xx). Siglas de archivos: **LIU**.
- Tono: cercano, directo, aspiracional-accesible. Habla a hispanos de Tampa en español neutro-caribeño ("Tú que me ves", "Contáctame"). Limpio y premium sin ser frío: la energía sale del ritmo, la mezcla de pesos y los datos duros bien grandes.
- Carpeta del cliente: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM LIU Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/`. El final va en la raíz del proyecto con el nombre de la carpeta + `.mp4`, y la portada al lado.
- **Montos siempre en dólares** (vende en USA). Whisper suele entender "pesos" (y a veces él lo dice así, en personaje de cliente): en pantalla va siempre `$`/dólares; avisar si el audio dice otra cosa. Whisper escribe su nombre como "Gilbert" / "Lieubert": es **Liubel**.
- **No se usa el logo en los videos** (decisión del usuario). El wordmark "LIUBEL PEREZ / REALTOR" vive solo en portadas de redes; nada de watermarks, placas de marca ni end cards.

## 1. Lo que sí se usa de la marca

### Tipografías (el elemento de marca principal)
Dos familias con roles fijos (de `00 IMAGEN DE MARCA/LIU_Tipografias.docx`), copiadas en `assets/fonts/`:

| Uso | Familia | Pesos típicos |
|---|---|---|
| Subtítulos y títulos (base) | **Capitana** (`capitana/`, 18 OTF, también instalada en `~/Library/Fonts/`) | Regular/Medium para relleno; Bold/ExtraBold/Black para palabra clave y títulos |
| Palabras resaltadas / golpes | **Blauer Nue** (`blauer-nue/`, 18 TTF, original en `00 IMAGEN DE MARCA/03 Tipografia/`) | Heavy/ExtraBold (+ itálicas como acento) |

**Firma tipográfica — no negociable:**
- **Interletrado (tracking) MUY bajo** e **interlineado (leading) MUY bajo** en TODO el trabajo (títulos, subtítulos, portada): **las líneas prácticamente se tocan** (corrección del usuario, 2026-10-08, reel 21-09: "los textos deben tener un interletrado más bajo en general… las líneas prácticamente se deben tocar"). Un título apilado de LIU se lee como un bloque compacto, nunca aireado.
- **Cómo apilar** (`scripts/plantilla_acabado/texts_apilado.py`): cada línea se renderiza aparte con `render_text` + una sonda "H" en las mismas fuentes → línea de base y tope de mayúsculas reales; el tope de mayúsculas de cada línea va **5 px bajo la base de la anterior**, y si una cola (g, p, y, ¿, ?) choca con la línea de abajo se baja de a 1 px hasta que no se toquen (±2 px). La sombra se agrega después en PIL. Nunca posicionar líneas con `yCenter` a ojo: queda aireado.
- **Tracking vigente** (`render_text.swift`, unidades relativas a cuerpo 58; aprobado-en-curso 21-09): **subtítulos −3,2**; **líneas chicas Capitana en minúscula −4,2**; **Capitana Black CAPS −5**; **Blauer Heavy CAPS −8**. Excepciones: en Blauer Heavy la **I** se funde con T/E con tracking fuerte ("TIEMPO" se leía "TEMPO") → palabras con I van en **Capitana Black −5**; entre palabras en CAPS apretadas poner **doble espacio** ("CONTÁCTAME  YA", con uno se leía pegado). Historial: −1,5 en minúscula = "interletrado muy grande" (03-10); −3,2 ya quedó grande (21-09).
- **Contraste de pesos dentro de la misma frase**: "El **error** es / **NO CALCULARLO** / bien en tu **pago mensual**" — relleno en Regular, golpe en Extra Bold/Heavy, a veces más grande y en MAYÚSCULAS.
- CTA en MAYÚSCULAS **en Capitana Black SÓLIDA blanca, nunca en contorno sin relleno** + bajada en bold sólido bien pegada debajo (gap ~20 px). El outline de la referencia de enero quedó descartado: en la pauta 05-10 el usuario lo rechazó dos veces ("se ve horrible"). La palabra va **gigante, al límite del ancho seguro** (iterar cuerpo/tracking midiendo la caja real con `convert -trim` hasta rozar x 180–900).

### Rotoscopia con título gigante detrás (recurso estrella)
Para los títulos más importantes del video, **siempre que el plano lo permita**: título bien grande en una fuente de la familia bien gruesa (Extra Bold / Heavy / Black), colocado **detrás del speaker** por rotoscopia (máscara del cuerpo por encima del texto). El texto ocupa buena parte del ancho, con el tracking/leading apretados de la marca. Usarlo en el gancho, el dato clave o el CTA — los momentos que merecen jerarquía máxima.
- En video se hace con `scripts/roto_batch.swift` (máscara de persona por frame + composición; probado en la pauta 05-10 con "33610 TAMPA" detrás de él caminando) o, si el título se anima, con `scripts/person_mask.swift` (solo las máscaras, calidad alta) y el recorte en el compositor (ver plantilla).
- **El título no puede quedar tapado** (reel 03-10, "33614 TAMPA tapado casi completamente"): con el speaker centrado y plano abierto, el cuerpo cubre el centro de la palabra. Solución aprobada: el bloque arriba, con **solo el pie de "TAMPA" detrás de la cabeza** (fondo del bloque ≈ tope del pelo + 55 px, medido con `track_cara.swift`). Ojo: **no usarlo con cifras que deben leerse completas** (el precio no se rotoscopia: si el cuerpo tapa dígitos, el número queda ilegible — el precio va delante, arriba de la cabeza).

### Textos sobre video (pipeline probado)
El ffmpeg local no tiene `drawtext` ni libass: **todos los textos (subtítulos y títulos) se renderizan como PNGs con `scripts/render_text.swift`** (CoreText: runs con mezcla de pesos, tracking de marca, sombra suave real) y se montan como overlays con `enable='between(t,a,b)'`. **Centrado horizontal en x=540** (centro real de pantalla — centrarlos en el centro de la zona segura, 485, se ve "tirado a la izquierda"; corrección del usuario, pauta 05-10). Si un bloque centrado en 540 se pasa de x=900, se achica o se parte en dos bloques sucesivos; verificar siempre la caja real con `convert -trim`. Para títulos animados (pop, slam, rise) y subtítulos que siguen la cara frame a frame, usar la **plantilla del reel 03-10** en `scripts/plantilla_acabado/` (ver referencia D). La elipse verde del precio se dibuja con ImageMagick (`/opt/ImageMagick/bin/convert`, dos elipses desfasadas con leve rotación) y se usa como `background` del PNG del precio.

### Niebla de lente sucia — detectar y corregir SIEMPRE
Liubel últimamente graba con la cámara del iPhone **muy sucia**: queda un "efecto niebla" (negros lavados, bajo contraste, destellos que se estiran horizontalmente alrededor de las luces). Pedido del usuario (2026-10-08, reel 21-09): aprender a identificarlo y corregirlo.
- **Detectar** con datos, toma por toma: `~/venvs/align/bin/python scripts/niebla.py medir VIDEOS/*.MOV` → velo = percentil 0,5 del canal mínimo. **≤ 8 limpio · 9–14 leve · ≥ 15 niebla.** Medidos: 21-09 IMG_2018 (CTA de pie) 29; 03-10 IMG_2122 24, 2123 20, 2126 22. A ojo: luces con estela horizontal, negros grises (pantalón negro que se ve gris oscuro), la cara "lavada".
- **Corregir**: en el pase de imagen, por frame y ya escalado, `deniebla(img, velo)` (modelo de neblina: resta el velo como luz difusa, limitado al canal mínimo local, sin aplastar lo oscuro) solo en las tomas con velo > 8; y a TODO el material de Liubel el grade de neblina (`colorlevels` 0,03 + `eq=contrast=1.06:saturation=1.15` + `unsharp=lx=13:ly=13:la=0.35`). El stock va sin `deniebla`.
- La estela alrededor de las luces no se va del todo: avisar si en un plano se nota mucho.

### Color
Paleta oficial (de `00 IMAGEN DE MARCA/LIU_Paleta.png`):

| Nombre | HEX |
|---|---|
| Azul marino (principal) | `#0A3A67` |
| Azul medio (acento en video) | `#2D6191` |
| Blanco | `#FFFFFF` |
| Gris claro | `#BDC0C6` |
| Gris oscuro | `#4F5257` |
| Negro | `#09090A` |

En video manda el **blanco**: subtítulos y títulos blancos con sombra suave. El **azul `#2D6191`** es el único acento de marca: una palabra-concepto del título en azul bold **con contorno blanco** ("áreas comunes"). Fuera de la paleta pero aprobados para la pauta: **elipse verde dibujada a mano** alrededor del precio nuevo y **tachado/cruz rojos** sobre el precio anterior (recursos de "oferta", solo para precios).

### Precio y datos duros (pautas)
- Precio de cierre: blanco Extra Bold **gigante** (media pantalla de ancho), elipse verde garabateada alrededor; si hubo rebaja, el precio anterior debajo más chico, tachado con cruz roja.
- Sqft, ubicación, zip: como título grande en bold dentro del subtítulo ("y **1445sqft**", "**33624 Tampa**"), no como placa de datos.

## 2. Referencias aprobadas (NO son fórmula)
> Así se resolvieron tres videos reales. Sirven para entender el gusto del cliente; cada video nuevo decide su propia estructura, ritmo y tratamiento según su contenido. Ante contradicciones, manda la más nueva (D).

### A. Pauta mostrando propiedad — `09 Septiembre/04-09 LIU PAUTA 497/` (58 s, 1080×1920, 25 fps)
- **Guion tipo**: gancho hablado desde el primer frame ("Tú que me ves…") con él caminando en la propiedad → recorrido hablando a cámara por ambientes → drone → cierre frente a la casa con zip + precio.
- **Imagen**: todo footage propio, nada de fotos ni stock. Caminatas a cámara (piscina, entrada), B-roll de interiores en gimbal, drone cenital y orbital. ~18 cortes, uno cada **2–4 s**, siempre motivado por el guion (nombra la cocina → corte a cocina).
- **Textos**: subtítulos blancos de 2–4 palabras a media altura; datos duros agrandados en bold; placa final de precio con elipse verde + tachado rojo.
- **Audio**: canción pop comercial de fondo bien abajo de la voz (elección puntual de ese video — para música de pauta preguntar o usar stock del disco) + SFX discretos (`Flares_01`, `Simple_SFX_2`) en placas y transiciones.

### B. Reel común talking head — `01 Enero/09-01 LIU HOA/` (32 s, 1080×1920, 25 fps)
- Él **sentado en set fijo**: pared gris azulada con molduras chevron, espejo redondo de ratán, planta, banqueta gris — el set ya es "de marca" (combina con la paleta). Camisa blanca + pantalón azul marino.
- ~13 cortes, uno cada **2–3 s**: talking head alternado con **B-roll que ilustra literalmente lo que dice** (drone de ciudad, barrio con tilt-shift/blur, stock de manos con calculadora — stock siempre mudo).
- **Títulos sobre B-roll**: línea blanca regular + concepto en **azul `#2D6191` bold con contorno blanco**, o bloque apilado en CAPS blancas con pesos mezclados, todo con tracking/leading apretados.
- **Énfasis**: flash rojo de 1–2 frames en la palabra negativa ("NO es el HOA"), flash blanco como transición, punch-ins entre frases.
- **CTA**: "CONTÁCTAME" CAPS + "y evitemos esa sorpresa" en bold sólido, sin tapar la cara. (En esta pieza fue outline, pero el outline quedó **descartado** después — ver la regla de CTA arriba y la referencia C.)
- **Audio**: música stock suave (`Kind_Of_House`) + `Simple_SFX_2`.

### C. Pauta de venta con VO — `09 Septiembre/05-10 LIU PAUTA Casa en Tampa renovada/` (42,7 s, 1080×1920, 30 fps)
Cuatro rondas de corrección del usuario; lo que quedó aprobado define el gusto actual:
- **Estructura**: hook a cámara caminando frente a la casa (15 s) → cuerpo en voz en off (nota de voz de WhatsApp) sobre B-roll (18 s) → CTA a cámara (11 s). Sin placa final.
- **Hook sin B-roll**: el dinamismo sale de un **juego de zooms cortados en las palabras fuertes** (1× → 1,5× en el precio → 1,2× en "techo nuevo" → 1,5× en "contáctame ya"), ojos clavados en ambos ejes en cada corte (±5 px, medido). **Los punch-ins tímidos no funcionan: mínimo 1,5×** (el 1,12× lo rechazó). Encima del hook van los títulos: "33610 TAMPA" en Blauer Heavy **detrás de él por rotoscopia** y el precio gigante con elipse verde **delante, arriba de la cabeza** (en el hook, no solo como placa de cierre).
- **Cuerpo**: cada corte de B-roll cae en el arranque de la frase que ilustra, aunque el plano quede corto (dijo "dos baños" → baño 0,9 s). Frases sobre el mismo tema pueden compartir un plano continuo (todo el lote/patio en una sola caminata de 7 s). **Si un paneo termina fuera de lo nombrado, va en reversa** (aprobado: el paneo de calle invertido termina clavado en la casa cuando dice "techo nuevo"; vale en paneos sin gente ni autos en movimiento).
- **CTA**: punch a 1,5× en "contáctame igual" + bloque "CONTÁCTAME" Black sólido gigante con bajada pegada, **arriba de la cabeza** (abajo no entra con el punch sin salir de la zona segura de pauta, y≤1250).
- **Dinamismo**: **flashes blancos de ~4 frames** en cada cambio de sección + **8 SFX** (whoosh slide en títulos/flashes, pop en cifras). Con 3 SFX sutiles dijo "faltan efectos"; sin silencios muertos entre bloques hablados (cortar apenas termina la última palabra, medida por alineación).
- **Color**: material de iPhone nublado "con neblina" (lente sucia, ver §1 "Niebla") → grade aprobado: `colorlevels=rimin=0.030:gimin=0.030:bimin=0.030,eq=contrast=1.05:saturation=1.15,unsharp=lx=13:ly=13:la=0.35` (baja el punto negro, contraste local, +saturación).
- **Audio**: voz con highpass 90 + denoise + compresión de referencia; VO de WhatsApp nivelada con las tomas de cámara (+EQ, el timbre no se empareja del todo — avisar). Música `Deep House Trend` (Lujo y elegante) a −12 dB de la voz; master −11,4 LUFS.

### D. Reel de propiedad: hook a cámara + cuerpo musical + CTA — `10 Octubre/03-10 LIU $389k Tampa/` (57 s, 1080×1920, 30 fps)
Sin guion: él grabó hook y CTA caminando (iPhone 4K, gran angular, lente sucia "con neblina", lentes de sol en el hook), y el resto son tomas de la casa. Dos rondas de corrección; quedó "tremendo trabajo":
- **Estructura**: hook a cámara (19 s, él hace también la voz del cliente: "Liubel, el banco me presta menos de 400 mil…") → **cuerpo solo música** (18 s, 10 tomas de la casa en recorrido: frente → puerta → cocina → living → pasillo → baño → cuarto → ventana → patio) → CTA a cámara saliendo de la cocina al patio (20 s). La música explota (drop) justo después de "ven que te la muestro" y ese es el primer corte del cuerpo.
- **Cuerpo**: cortes cada 4 tiempos (2 en acentos) sobre la **grilla medida** (`edicion-reels-base/scripts/grilla_beats.py`): "Drive Me Crazy" (Onaldin, Pop alegre) es **118,0 BPM, drop en 65,104 s** del tema (el catálogo dice 120 → los cortes se corrían). Zoom suave 1→1,05 en cada toma.
- **Hook**: con un solo plano largo "se siente muy largo". Aprobado: **zooms constantes in/out + punch-ins** por frase, anclados a los ojos (1,35→1,8 / 2,45→2,75 / 2,0→1,7 / 1,2→1,38 / 2,2→2,45 / 1,6→2,5 hacia el drop), y sobre la enumeración **B-roll de la casa con títulos tipo checklist** ("3 HABITACIONES", "2 BAÑOS totalmente remodelados", "TECHO NUEVO" con NUEVO en azul + contorno, "baños y cocinas REMODELADOS"), cada uno con pop + "check".
- **Títulos**: "MENOS DE $400K" sobre la pregunta; "33614 TAMPA" detrás de él (solo el pie tras la cabeza); "MENOS DE / $390K" y "esta opción por / $389K" con elipse verde **arriba de la cabeza**; "LIUBEL PÉREZ / agente de Real Estate"; "CONTÁCTAME" Black sólido + bajada de dos líneas. Animaciones pop (overshoot), slam (1,45→1) y rise; los títulos arriba de la cabeza se posicionan con el punto más alto del pelo en todo el tramo (tracking por frame).
- **Subtítulos**: Capitana Medium 60 + ExtraBold en la palabra clave, debajo del mentón medido (mentón + 70 px), pop corto de entrada, ocultos mientras hay título.
- **Transiciones en TODOS los cortes** (26): zoom-blur anclado a los ojos y whips con desenfoque de movimiento, alternados en el cuerpo; flashes blancos de 4 frames en el drop y la entrada al CTA. **37 SFX** (whoosh/swipe en cada corte, pop en cifras/títulos, check en el checklist, riser Bass Riser 1 con pico en el drop).
- **Audio**: corbatero muy bajo (crudo −43 LUFS hook / −40,5 CTA; ruido −75 / −62,5 dB) → cadena de `edicion-reels-base` regla 3.2 (ganancia previa, denoise con piso medido, presencia, 2 compresores) → voz −12 LUFS. Tema pop denso → **música −20 dB bajo la voz + hueco de EQ** en hook/CTA; en el cuerpo al nivel de la voz. Master −11,0 LUFS / −1,4 dBTP (aac_at).
- **Grade**: el mismo de la referencia C (neblina). Zoom de hasta 2,75× sobre 4K (aceptable).

### Subtítulos en ambos
- **Capitana**, blancos, sombra suave, sin caja ni karaoke de color. Frases cortas (2–4 palabras), 1 línea (máx. 2), centrados, a **media altura** (sobre el speaker quedan a la altura del pecho; sobre B-roll, centro).
- Sentence case (arrancan en minúscula si la frase sigue). Palabra clave en **bold** — sustantivos, cifras, verbos fuertes — no un resaltado mecánico.
- Los golpes fuertes suben a MAYÚSCULAS y crecen de cuerpo.

### Audio de las referencias
Las referencias A y B salieron fuertes (−9 LUFS integrado, LRA ~1.5). Para los niveles de entrega valen los de `edicion-reels-base`, no los de la referencia; lo que sí es de marca: voz siempre protagonista, música bien abajo, SFX en transiciones y placas. **Lo vigente es la referencia D**: la voz se trabaja con la cadena de `edicion-reels-base` 3.2 (el corbatero de Liubel llega muy bajo y con un denoise mal calibrado suena "enterrado"), y el nivel de la música depende del tema (pop denso → −20 dB + EQ; suave → −12 dB). Con él, el usuario siempre pidió **más** SFX, no menos.

## 3. Ideas que pueden sumar (opcionales, a criterio)
- Teñir el oscurecido del B-roll con `#0A3A67` en vez de negro puro.
- Tilt-shift/blur en drones de barrio (ya aprobado en la referencia B).
- ~~Rotoscopia para el precio~~ — descartado: las cifras tienen que leerse completas; el precio siempre va delante (ver sección de rotoscopia).
- Portadas: ver **§5** (el azul en la palabra-golpe quedó descartado: sus portadas publicadas van todas en blanco).

Recursos del disco sugeridos para este estilo: `references/biblioteca.md`.

## 4. Plantilla del pipeline de acabado (`scripts/plantilla_acabado/`)
Copia del reel 03-10, para arrancar uno nuevo editando solo `timeline.py`. Se copia la carpeta a `PROYECTO/acabado/` del video (las rutas salen de ahí: `../../VIDEOS`).
1. `timeline.py`: segmentos (talk con zoom s0→s1 / broll / body en tiempos de la grilla), títulos (pop/slam/rise; head/center/roto), subtítulos (de la alineación forzada), transiciones y SFX (con el pico).
2. Tracking: `swiftc -O edicion-reels-base/scripts/track_cara.swift -o track_face3` → `./track_face3 <clip> <t0> <t1> 30 > f3_<clip>.txt` por cada clip a cámara.
3. `texts.py` (sprites con `render_text.swift` compilado como `./render_text`) → `pass1.py` (base con zooms anclados a los ojos + grade) → máscaras con `person_mask.swift` para los frames del título rotoscopiado (`roto_mask/NNNN.png`) → `pass2.py --guias` (revisión) / `pass2.py` (final) → `mix.py` (voz por tramo, música en dos copias, SFX, master).
4. Mux: `ffmpeg -i video_final.mov -i mix.wav -c:v libx264 -crf 17 -c:a aac_at -b:a 320k`.
Corre con `~/venvs/align/bin/python` (tiene numpy + PIL).

## 5. Portadas
Formato, cuadrado 1080×1080, márgenes medidos, sujeto aislado con más luz que el fondo y portada como primer frame del video: skill **`portadas-reels`**. Acá va solo el sistema de LIU, sacado de 5 portadas publicadas (análisis 2026-10-05, reel 20-09):

**Sistema**
- **Foto:** cuadro del video en **plano medio o entero** (sentado en el sillón o de pie en la propiedad), nunca primer plano. La cabeza queda en el tercio superior del cuadrado (ojos y ≈ 520–600 en 1080×1920). Degradés oscuros arriba y abajo, fondo bajado y Liubel más luminoso que el fondo (look "cinemático").
- **Texto TODO BLANCO**, con sombra suave, sin contorno, caja ni azul. Centrado en x = 540, **sobre el pecho, pegado debajo del mentón**, encima de la camisa (la sombra lo hace legible sobre el celeste o el blanco).
- **Lockup de 2–3 líneas en Capitana:** línea chica en **Regular/Light** (oración, a veces en itálica: "mira mucho más") + golpe en **Black/ExtraBold**, que puede ir en MAYÚSCULAS ("DEL HOA", "PREPARANDO"), Title Case ("Redes Sociales") o minúscula ("sueldo", "tienen miedo"). A veces los dos tamaños van en la misma línea, apoyados en la misma línea de base ("que tu **sueldo**", "un **20%**").
- **Tamaños:** línea chica ~56–66 px y golpe ~100–130 px (≈2×); una cifra-golpe puede ir más grande (~230 px).
- **Interlineado casi tocándose** (la línea chica apoya sobre las mayúsculas del golpe) y tracking apretado. Texto sacado de lo que dice el video, a veces en forma de pregunta.
- ⚠️ **Portada 21-09 rechazada** (2026-10-08: "quedó muy mal", la hizo el usuario): plano medio con niebla corregida, fondo muy bajado (0,72) y desenfocado (7 px), viñeta lateral, claridad en el sujeto y lockup "¿Es realmente / **buen momento** / para **comprar?**" con tracking −0,075. No repetir ese tratamiento; ante la duda mostrar opciones antes de entregar.
- Sin logo ni wordmark en las portadas recientes.
- **El cuadro, con intención** (corrección del usuario, 2026-10-05, reel 20-09): un cuadro neutral, con él quieto y serio, "no gustó". Elegido: **gesto hacia el espectador** (señala a cámara), boca y ojos libres, mirada directa. Ante la duda, mostrar 3–4 opciones de cuadro en hoja de contacto y que elija el usuario. Si una mano gesticula bajo el mentón, el texto va debajo de la mano, nunca encima del gesto.

**Ejemplos analizados** (`01 REELS/…/PORTADA/`):
- `09 Septiembre/19-09 LIU El banco mira mucho más`: "El banco / *mira mucho más* / que tu **sueldo**", sentado en una isla de cocina, texto sobre el pecho.
- `01 Enero/09-01 LIU HOA`: "Tienes que **entender esto** / **DEL HOA**", sentado en el set gris, golpe en Black MAYÚSCULAS.
- `01 Enero/03-01 LIU MIEDO`: "Mientras unos / **tienen miedo** … otros se están / **PREPARANDO**", de pie señalando; dos bloques al costado del cuerpo.
- `09 Septiembre/02-08 LIU POSICIONAMIENTO LIBRE`: "No busques propiedades en / **Redes Sociales**", de pie en la cocina, de cuerpo entero.
- `10 Octubre/04-10 LIU $400k Tampa`: "Casa en Tampa / **USD400.000**", de pie en la entrada de la casa, de cuerpo entero.
- `10 Octubre/20-09 LIU Deja de perder el tiempo repit`: "¿Necesitas / un **20%** / para comprar **tu propiedad?**", sentado **señalando a cámara** (IMG_1999 a los 11,6 s, zoom 1,25×). La mano que señala ocupa justo el lugar bajo el mentón, así que el bloque va pegado debajo de la mano.

**Script:** `scripts/portada_liu.py` (adaptación de `portadas-reels/scripts/portada_pil.py` con Capitana, blanco, negro de marca `#09090A` en los degradés y `TEXT_TOP` = mentón medido + margen + 20 px).

