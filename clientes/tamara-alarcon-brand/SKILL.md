---
name: "tamara-alarcon-brand"
description: "Marca y estilo de edición de Tamara Alarcón (TA), AP Propiedades en Canning–San Vicente–Guernica: Gibson (subtítulos y rótulos) + Amandine (portadas y resaltados) de Adobe Fonts, subtítulos palabra por palabra en un renglón, títulos café con glow y barra café, rótulos de nombre y rol del equipo, paleta café/beige, música corporate, portadas con el texto arriba de la cabeza y golpe café con contorno blanco. Usar junto con edicion-reels-base."
---

# Tamara Alarcón (TA) — Marca para video

Reglas obligatorias (márgenes, cara, audio, música, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 5 de esta skill. Acá va solo lo propio de Tamara.

- Cliente: **Tamara Alarcón Patek**, martillera, **AP Propiedades** ("Alarcón Patek Propiedades"). Barrios cerrados de gama media en el corredor **Canning – San Vicente – Guernica** (Horizontes al Sur, Terralagos). Vive en San Martín de los Andes (Patagonia); graba en Buenos Aires o en la Patagonia. Siglas de archivos: **TA**.
- Vocera: Tamara sola, a cámara (interior con madera y plantas, o exterior/galería). A veces **no se graba** y manda solo la voz en off (`VOZ/`, ya limpiada con Adobe): ver la referencia C.
- **Equipo** (13-10): Noa (portales y contenido), Gise, Vale, Paz, Estefi, Joha (Johanna) y Ro (asesoras comerciales / visitas). Tamara lidera la negociación y la documentación. Sus clips llegan en `VIDEOS/` con el nombre de cada una (horizontales y en HDR casi todos; Ro todavía no tiene clip).
- Tono: cercano, didáctico, nada de hype. **Rioplatense con voseo** ("querés", "contactame", "pedime"). Respetarlo tal cual en los subtítulos.
- Moneda: **USD** para propiedades (`USD 199.000`). Nada de cifras inventadas: si dice un monto sin cifra, no se muestra.
- CTA habitual: "contactame y charlamos" / "pedime asesoramiento". A veces sin CTA.
- Carpeta: `{CARPETA_CLIENTE}/01 REELS/<MES>/<DD-MM TA Título>/` con `VIDEOS/ VOZ/ RECURSOS/ MUSICA/ PROYECTO/ PORTADA/ LISTOS/`. El final va en `LISTOS/` con el nombre de la carpeta `.mp4`.
- Formato: 1080×1920, **30 fps**, 20–55 s.
- Logo: no se usa. Placa final: no.
- **Videos simples**: a cámara (o voz en off) + B-roll de apoyo. Nada de motion recargado.

## 1. El manual vs. los videos
Del manual hay **paleta** (`00 IMAGEN DE MARCA/Tamara alarcon paleta.png`, Coolors) y **fuentes** (`00 IMAGEN DE MARCA/FUENTES TAMARA ALCON.docx`). La identidad para video sale de las piezas aprobadas (sección 6).

## 2. Tipografía — Gibson + Amandine (Adobe Fonts)
Corrección del usuario (2026-10-22, TA 13-10): **Tamara NO usa Montserrat** (la versión anterior de esta skill lo decía y estaba mal). El documento de fuentes de la marca dice:
- **Gibson** (<https://fonts.adobe.com/fonts/gibson>): subtítulos, rótulos, bajadas de títulos.
- **Amandine** (<https://fonts.adobe.com/fonts/amandine>): portadas y resaltados.

Las dos son de **Adobe Fonts**: cada editor las activa con su cuenta de Creative Cloud. **No se copian al repo.** Activadas, quedan en `~/Library/Application Support/Adobe/CoreSync/plugins/livetype/.r/` con nombre numérico (buscar el archivo por su nombre interno, ej. con CoreText `CTFontManagerCopyAvailablePostScriptNames`). En Remotion se cargan desde el sistema, sin copiar el archivo: `new FontFace('Gib', "local('Gibson-SemiBold')", {weight: '600'})`; en PIL, con la ruta del `.otf` de `livetype/.r/`. Si una no está activada, avisar al editor antes de reemplazarla.

| Uso | Fuente / peso |
|---|---|
| Subtítulo | Gibson **SemiBold** (600) |
| Línea de contexto de un título, rol del rótulo | Gibson **Light** (300) |
| Título-golpe, nombre del rótulo | Gibson **Heavy** (800) — o Amandine para resaltados cuando esté activada |
| Bajadas de portada | Gibson **Bold** (700) |

Interletrado apenas negativo en títulos (−0,02 em) e interlineado ~0,98 en las líneas Heavy apiladas.

> Amandine todavía no se probó en un video (en 13-10 no estaba sincronizada y todo quedó en Gibson; el usuario aprobó así). Al usarla, mostrar una prueba antes de renderizar.

## 3. Color
| Nombre | HEX | Uso en video |
|---|---|---|
| Café | `#462F22` | Color de marca oscuro. Títulos-golpe, nombres de los rótulos, barras de revelado |
| Café grisáceo | `#3A332E` | Contorno de subtítulos; golpe de portada con contorno blanco |
| Arena | `#9A886F` | Acentos secundarios, íconos |
| Beige | `#D2C3B7` | Círculos de íconos (check), palabra destacada clara en títulos |
| Lino | `#E8E0D9` | Fondos claros, placas suaves |
| Blanco | `#FFFFFF` | Subtítulos, glow de títulos, bajadas |

Nada fuera de la paleta (ni amarillos ni azules de acento).

## 4. Sistema de texto y acabado

### Subtítulos (el sello de Tamara) — renglón que se arma palabra por palabra
- **Un solo renglón** por frase corta (1–5 palabras, ≤ ~26 caracteres, ≤ ~720 px de ancho). El renglón se corta en pausas y puntuación.
- Las palabras **aparecen a medida que se pronuncian**, sumándose al renglón: "Cuando" → "Cuando una" → "Cuando una publicidad". Aparición **en corte seco** (un frame, sin pop ni fade), clavada al arranque de cada palabra con la alineación forzada de la base.
- **El renglón se centra con su ancho FINAL** en x = 540 y las palabras se van revelando de izquierda a derecha desde ese punto. No se re-centra mientras crece.
- Cuando arranca la frase siguiente, el renglón anterior desaparece entero (corte seco).
- Estilo: Gibson SemiBold **~58 px**, blanco, en minúscula como se habla, **contorno fino café `#3A332E` ~3 px** + sombra suave (negro 60 %, desplazada ~3/4 px, desenfoque ~4 px). Sin caja.
- Posición: la de la base (pegado debajo de la cara; sobre B-roll, centrado y corrido lo mínimo para no tapar caras, medidas con Vision por plano).

### Títulos
Se usan 1–3 por video para el concepto clave. Título **o** subtítulo, nunca los dos.
- **Título-golpe:** Gibson Heavy en MAYÚSCULAS, color café, con **glow blanco difuso**. Encima y debajo, líneas de contexto en Gibson Light blanca que entran palabra por palabra (ej. "hay un / **EQUIPO** / humano / comprometido con tu sueño").
- **Entrada de la casa:** una **barra café** sólida barre de izquierda a derecha y va descubriendo el golpe (~0,25 s).
- **Variante frase + palabra fuerte:** contexto en Light blanca, palabra clave en Heavy beige `#D2C3B7` con sombra café ("se trata del / *estilo de vida* / que vas a empezar a construir"), que cae a su lugar con un leve desplazamiento vertical.
- Sobre B-roll con personas, el título va arriba de las cabezas (medidas), no encima.

### Rótulos de nombre y rol (videos del equipo, 13-10)
- Nombre en Gibson Heavy 120 px café con glow blanco y barra café; debajo, el rol en Gibson Light 50 px blanco que entra palabra por palabra. Bloque centrado en x = 540, **abajo, con el borde inferior en y ≈ 1420–1440** (límite de la zona segura).
- **Separado de los subtítulos**: el rótulo abajo y los subtítulos de ese plano subidos (corrección del usuario, 2026-10-22: el nombre de NOA "se confunde con los subtítulos"; se bajó el rótulo a 1440 y se subieron los subtítulos de 818 a 690). Un rótulo convive con los subtítulos (es un tag informativo).
- Si se nombra a alguien que no tiene clip, **igual va en el rótulo** con quien comparte el plano: "**JOHA Y RO** / Asesoras comerciales" (corrección del usuario, 2026-10-22).
- Rol de Tamara: el rótulo cubre lo que dice ("yo, / **TAMARA** / lidero la negociación"), arriba de su cabeza.

### Íconos y listas
- **Check**: círculo beige `#D2C3B7` con tilde blanca redondeada y sombra café; entra con pop. Para requisitos o confirmaciones.
- **Checklist**: ✅ + texto Gibson Bold blanco, alineado a la izquierda, ítems que entran uno por uno sobre B-roll suave.

### Transiciones y look
- Transición de la casa: **light leak / destello cálido** (naranja–rosado, quema a blanco) en los cambios de bloque; en el resto de los cortes, zoom-blur o whip cortos.
- Recurso de énfasis: un tramo corto de Tamara en **blanco y negro** para una frase de giro. **Corto** (corrección TA 06-10, 2026-10-20: tenía que terminar en 00:11, no estirarse hasta el giro del guion).
- Punch-ins suaves en los planos a cámara; zoom lento hacia adelante en cada B-roll.
- Look natural, cálido; no exagerar el color.

### Música y SFX
- **Música corporate para redes**, nunca infantil (corrección TA 06-10, 2026-10-20: "Happy Home" de Mixkit fue "MUY INFANTIL"). Aprobadas: *Uplifting Bass* (Mixkit 726, 06-10), *Talent in the Air* (Mixkit 473, 13-10, a −16 dB bajo la voz con hueco de EQ suave), *Motivating Mornings* (Mixkit 33, 05-10). No repetir el mismo tema en videos consecutivos.
- Niveles: **todo según `edicion-reels-base`** (densidad del tema, master −11 LUFS). Las referencias viejas están en −23 LUFS: no copiar ese volumen.
- SFX discretos: whoosh en los cortes, efecto cinemático en los light leaks, pop en cada título y rótulo (~30 en 53 s en 13-10, aprobado).

### Stock / B-roll
- Primero material propio (barrios, casas, lagunas, clips del equipo). **Nunca** stock o IA para representar un barrio o propiedad real de Tamara: pedir material del desarrollador.
- Stock de apoyo conceptual sí: manos firmando, documentos, llaves, apretón de manos, reunión de asesoramiento, vida en jardín/parrilla. Personas que se lean argentinas/latinas, ambientes cálidos; nada de casas americanas.
- Para "horarios / organización": **agenda o calendario**, no rompecabezas (corrección TA 06-10: "queda raro").
- No repetir stock entre videos consecutivos.

### Tamara sin grabarse (voz en off)
- Si el video necesita a Tamara y no se grabó, usar sus tomas a cámara de otros videos **en un momento en que no habla** (buscar silencios largos en el audio de cada toma, ~1–2 s al final) en cámara lenta (0,5–0,7× con interpolación), y pasar rápido al B-roll: su boca no coincide con la voz.
- En el cierre, mejor B-roll que Tamara (corrección del usuario, 2026-10-22: "lo mejor es utilizar otro B-ROLL para no mostrar a Tamara").

### Rotoscopia (ocasional)
- **Solo cuando suma**: un título-golpe **detrás de Tamara** en el gancho o el concepto clave. Máximo 1–2 por video. Sigue la regla de no tapar la cara.

## 5. Portadas
Analizadas (2026-10-22) en `{CARPETA_CLIENTE}/01 REELS/*/PORTADA/`: 05-10 "Así es una mañana VIVIENDO en CANNING", 10-09 "¿Qué PREGUNTAR sobre LA SEGURIDAD?", 08-09 "Los PAPELES se JUNTAN antes de FIRMAR", 17-08 "¿Por qué vivir de playa solo 15 DÍAS?", 12-07 "30 SEGUNDOS…".
- **Texto ARRIBA de la cabeza**, centrado, sobre el fondo; la persona debajo, dentro del cuadrado 1080×1080.
- Lockup de 2–4 líneas muy apretadas, pesos mezclados: palabras de relleno en Bold (a veces Bold Italic) blanco y **una palabra-golpe en Heavy MAYÚSCULA**.
- Golpe: o en degradé blanco→beige/plateado, o **café oscuro `#3A332E` con contorno blanco grueso** (CANNING). El usuario pidió este último para 13-10 ("el DETRÁS colocalo como acá está escrito CANNING").
- A veces el texto va en una caja café semitransparente (17-08, 12-07).
- Foto cálida; sujeto con más luz que el fondo (§4 de `portadas-reels`).
- Ejemplo aprobado: 13-10 "El equipo / **DETRÁS** / de cada casa" — Johanna cruzando la puerta (cuadro del video con zoom 1,35), Gibson Bold 80 blanco + Gibson Heavy 156 café con contorno blanco de 11 px; las colas de "equipo" quedan 6 px sobre el contorno y "de cada casa" 8 px debajo; texto en y 520–798, a 31 px del pelo.

## 6. Referencias aprobadas (REFERENCIA, no fórmula)

### A. Educativo corto — `11-10 TA Qué es la financiación directa` (22 s)
- Gancho a cámara con el renglón que se arma y título **FINANCIACIÓN DIRECTA** revelado con barra café.
- B-roll conceptual cada ~2 s con checks beige; light leak al cambiar de bloque.

### B. Educativo con objeción — `07-09 TA No querés bajar el precio. Hay` (30 s)
- Exterior en galería; título "**algo** en **parte de pago**" con barra café; tramo en blanco y negro; checklist ✅.

### C. Voz en off presentando al equipo — `13-10 TA El equipo detrás de cada casa` (53 s)
- Tamara no se grabó: voz en off (`VOZ/`) + clips de cada persona del equipo + tour de propiedad + stock conceptual.
- **Enumeración de nombres** ("Gise, Vale, Paz, Estefi, Joha y Ro"): pausa natural de **~0,3 s** entre nombres y **cada clip entra justo en su nombre** (0,6–0,9 s cada uno, con su nombre sobreimpreso); después, en la frase que describe lo que hacen, cada una **vuelve ~2 s** con nombre y rol. Correcciones del usuario: primero pidió ≥2 s por clip; estirar la voz con silencios de 1,6 s entre nombres quedó "RARÍSIMO"; la solución aprobada es la de acá.
- Rótulos de nombre/rol (sección 4), títulos "EQUIPO" y "estilo de vida", cierre con B-roll del equipo (sin Tamara).

## 7. Ideas que pueden sumar (opcionales)
- Rotoscopia en el gancho cuando el fondo lo permita.
- Prueba social: material de firmas o entregas reales antes que stock.
- Pedir un clip de Ro para los próximos videos del equipo.

## 8. Correcciones del cliente
- 2026-10-20 — Skill creada.
- 2026-10-20 (06-10) — Música corporate, no infantil; blanco y negro corto; agenda en vez de rompecabezas; no repetir stock entre videos consecutivos.
- 2026-10-22 (13-10) — Fuentes: **Gibson + Amandine**, no Montserrat. Nombres en enumeración sin silencios largos. Rótulo de nombre separado de los subtítulos. Nombrar a quien no tiene clip ("JOHA Y RO"). Cierre con B-roll y no con Tamara. Portada con golpe café de contorno blanco (como CANNING).
