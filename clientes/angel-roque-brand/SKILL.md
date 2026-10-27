---
name: angel-roque-brand
description: Identidad visual para video de Ángel Roque (ARO), realtor en Tampa Bay, Florida (Dade City, Tampa) — no confundir con Ángel Pérez. Montserrat con contraste de pesos (Medium de base + Black / Black Italic en la palabra clave, interlineado muy apretado) y The Seasons Bold (serif de Adobe Fonts) como acento en datos y portadas, subtítulos blancos de 1–3 palabras a media altura que nunca tapan la cara, palabra clave en Montserrat Black MAYÚSCULA azul con borde blanco o con caja dorada detrás, precios en degradé dorado o azul, metros con número calado, CTA "ESCRIBEME" en degradé blanco→beige, B-roll y drone en los momentos importantes, light leaks y zoom in/out con desenfoque (Animation Composer) como transición, SFX de swoosh + CashMoney en el precio + wink/click en palabras clave, música funk para redes o corporate (Motion Array), paleta navy / azul / dorado / blanco, más la referencia de seis piezas aprobadas (tres tour house de pauta, una en inglés, y tres reels a cámara con stock) y la guía de portadas con degradé navy. Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Ángel Roque / ARO / ANR (reels, tour house, pauta de propiedades, portadas), o cuando el usuario diga "editá el video de Ángel Roque", "video de ARO", "con la marca de Ángel Roque", aunque no mencione la skill.
---

# Ángel Roque (ARO) — Marca para video

Reglas obligatorias (márgenes, cara, audio, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 5 de esta skill. Acá va solo lo propio del cliente.

- Cliente: **Ángel Roque**, realtor en **Tampa Bay, Florida** (Dade City, Tampa, casas nuevas de constructora). Siglas de archivos: **ARO** (en carpetas viejas también aparece **ANR**: es el mismo cliente). **No es Ángel Pérez** (`angel-perez-brand`), que también es realtor en Tampa.
- Vocero: él solo, a cámara o recorriendo la casa. De traje (gris, azul o negro), a veces con lentes de sol en exteriores.
- Público y lugar: hispanos en Tampa Bay que quieren comprar o vender. **El stock tiene que parecer de Florida**: casas de una planta de constructora, barrios con lagos, downtown de Tampa, palmeras. Moneda **USD** (en pantalla "$399.000" o "USD 330.000", con punto de miles).
- Tono: español neutro caribeño, con tuteo ("escríbeme", "si gustas", "carros", "pago inicial", "gastos de cierre", "habitaciones"/"cuartos"). Algunas pautas son **en inglés** (15-08): el sistema de texto es el mismo. Respetar sus palabras en los subtítulos (no pasar a voseo).
- CTA habitual: "Escríbeme" + lo que ofrece (agendar visita, información, asesoría).
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM ARO Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/ EXPORT/`.
- Formato de las referencias: 1080×1920, 30 fps (las de agosto, 25 fps), tour house 60–72 s, reels a cámara 27–58 s.
- Logo: no se usa en los videos. Sin placa final.

## 1. El manual vs. los videos
El manual (`00 IMAGEN DE MARCA/`) es una paleta de 4 colores + "Montserrat / The Seasons". **Se traslada casi entero**: la paleta se usa tal cual (azul y dorado en el texto, navy en portadas) y las dos familias son las de los proyectos de Premiere. Lo que el manual no dice y sale de las piezas: el contraste Medium/Black, el número calado, el degradé blanco→beige y el uso de The Seasons solo como acento.

## 2. Tipografía — Montserrat + The Seasons
- Montserrat en `assets/fonts/montserrat/` (OFL). Pesos medidos en los proyectos: **Medium** (base, el más usado), **Black** (clave), Bold (poco). Black Italic / Medium Italic para el acento.
- **The Seasons** (Adobe Fonts, licencia de la cuenta Creative Cloud: **no se sube al repo**). En Premiere se activa desde fonts.adobe.com. Para renderizar con PIL/Remotion: `python3 ~/.claude/skills/angel-roque-brand/scripts/the_seasons.py Bold` devuelve la ruta del `.otf` sincronizado.
- Interletrado 0 a −2 %. Interlineado **muy apretado**: subtítulos a 0,85 (64 px de cuerpo → 54 px entre líneas); títulos apilados aún más (las líneas se tocan).

| Uso | Fuente y peso |
|---|---|
| Subtítulo base | Montserrat Medium |
| Palabra clave del subtítulo, cifras | Montserrat Black (o Black Italic: "*familia*", "*negociar.*") |
| Palabra clave en MAYÚSCULA de color | Montserrat Black MAYÚSCULA azul `#2D508F` con borde blanco fino |
| Datos de la casa (cuartos, baños, "pies cuadrados") | The Seasons Bold, blanco o dorado |
| Precio, lugar, golpe | Montserrat Black |
| Metros (número) | Montserrat Black **calado** (solo contorno blanco ~4 px) |
| CTA | Montserrat Black MAYÚSCULA ("ESCRIBEME") + Medium/Bold chico debajo |

## 3. Color
`assets/paleta.png`

| Nombre | HEX | Uso en video |
|---|---|---|
| Navy | `#2A3C54` | Degradé de arriba en portadas, cajas de portada |
| Azul | `#2D508F` | Palabra clave MAYÚSCULA, precio en degradé azul (`#385898`→`#2D508F`), cajas de portada |
| Dorado | `#CD9C38` | Precio en degradé (`#D8A848` arriba → `#B08838` abajo), "PRINCIPAL", caja-marcador detrás de una frase (al ~85 %) |
| Blanco | `#FFFFFF` | Subtítulos, casi todo el texto |
| Beige | `#E0C8A8` | Degradé blanco→beige de "USD 330.000" y del CTA |

## 4. Sistema de texto y acabado
`assets/sistema-texto.jpg` (frames reales a 40 % + recortes de subtítulos a tamaño real).
- **Subtítulos:** 1–3 palabras, blancos, **Montserrat Medium ~64 px** con una palabra en Black; 1 o 2 líneas apiladas, centradas, con **sombra suave** (sin caja). Línea de base en **y ≈ 950–1050** (media altura, por debajo de la cara: si la cara baja, se baja el texto, nunca encima). Entran con pop corto o desenfoque.
- **Palabra clave de color:** cada 3–5 s, no en todos. Variantes: Black MAYÚSCULA azul con borde blanco ("The **KITCHEN**", "**DECISIÓN**"), Black blanco MAYÚSCULA ("el **MERCADO**", "las **REGLAS**"), dorado ("**GREAT LAYOUT**") o caja dorada detrás de la frase ("you have **3** additional").
- **Precio:** Montserrat Black 120–150 px con degradé dorado o azul + sombra, entra con zoom/desenfoque y **CashMoney**. En pautas en inglés, "USD 330.000" en degradé blanco→beige. Debajo, la bajada chica ("de pago inicial", "tasa de interés de **4.99%**").
- **Datos de la casa:** "4 habitaciones / 3 baños completos" en The Seasons Bold (blanco o dorado), apilado. Metros: número Black calado gigante ("1850", "2200") + "pies cuadrados" en The Seasons debajo.
- **Lugar / pregunta gancho:** Montserrat Black MAYÚSCULA blanca con degradé azul suave, 2 líneas apiladas ("DADE / CITY?").
- **CTA final:** "ESCRIBEME" Black MAYÚSCULA ~170 px en degradé blanco→beige + bajada en Bold chica, sobre él a cámara.
- **Transiciones de la casa** (Animation Composer / Mister Horse): **Light Leak** (Generated Light Leak 1) entre ambientes y al entrar a B-roll; **Zoom IN / Zoom OUT** con espejo y motion blur en los cambios de bloque; Impact Dissolve y Lens Distortion ocasionales. Whip con desenfoque al entrar al primer interior.
- **SFX** (`{SFX}/` y packs de Animation Composer): *Swoosh Transition 28*, *Transition Complex 14*, *Swoosh 04 - 02* en transiciones; `Eye Wink Sound Effect.mp3` y `CLICK.mp3` en títulos y palabras clave; `CashMoney Sound Effect.mp3` en el precio. Detalle en `references/biblioteca.md`.
- **Música:** **funk / groove** para pauta y redes, **corporate** inspiracional para los reels de consejo serios. Motion Array, siempre instrumental.
- **B-roll / stock:** en los **momentos importantes** (cuando nombra un concepto, cifra o emoción) se tapa la toma a cámara con B-roll: llaves, apretón de manos, firma, Tampa desde el aire, gráficos de mercado animados, familia. En tour house, drone del barrio y amenities (pickleball, parque) cerca del cierre.
- **Zooms:** punch-in leves en las tomas a cámara; en tour house el movimiento lo da el gimbal.

## 5. Portadas
`assets/portadas.jpg` (12 publicadas, `01 REELS/*/PORTADA/` o raíz de cada reel).
- **Degradé navy `#2A3C54`** desde arriba (~40 % del alto), sujeto con más exposición.
- Texto en el **tercio superior**, de 2–4 líneas con interlineado tocándose, mezclando **Montserrat Light/Medium + Black / Black Italic** ("Hay **dinero esperando** para **ayudarte** a comprar").
- Una palabra protagonista grande en **The Seasons** (blanco, crema o dorado): "4 PAREDES", "TASA", "DEBT TO INCOME?", "Primera casa", "$14.000".
- Variante con **caja azul `#2D508F`** detrás del bloque (pautas en inglés: "A BRAND NEW HOME UNDER" + precio en degradé blanco→beige).
- Acento de color: palabra en dorado o azul ("ARREPIENTES", "PROFESIONAL DETRÁS", "TU CASA?").
- A veces la palabra grande queda **detrás de la cabeza** (rotoscopia), solo si el recorte queda limpio.
- Pautas de propiedad: fachada o interior, sin Ángel, con el precio o la zona como protagonista.
- **En las pautas la portada la hace el editor** (01-09, 2026-10-27): no se genera. Se le pasan **2 frames de la propiedad sin Ángel** (2160×3840, el más nítido de ±0,3 s medido con la varianza del laplaciano) en `PORTADA/` y, cuando la deja ahí, se pone como frame 0 con `portadas-reels/scripts/portada_primer_frame.sh`. La de 01-09: sala vacía con luz, "**San Antonio**, *Florida*" (Montserrat Black Italic + Medium Italic) y "por **$339,000**" con el precio gigante en The Seasons blanco, en el tercio superior. El precio va con coma de miles y redondeado, distinto del video.

## 6. Referencias aprobadas (REFERENCIA, no fórmula)
Detalle en `references/piezas.md`. Rutas relativas a `{CARPETA_CLIENTE}/01 REELS/`.
- **A. Tour house (pauta)**: `07 JULIO/01-05 ARO PAUTA 14 DE INICIAL` (73 s, Dade City, $14.000 de inicial), `08 AGOSTO/01-08 ANR PAUTA Título pendiente` (71 s, $357.000, tasa 4.99 %), `08 AGOSTO/15-08 ANR POSIBLE PAUTA $330,000` (61 s, **en inglés**).
- **A2. Tour house con voz en off** (`10 OCTUBRE/01-09 ARO PAUTA Título pendiente`, 65 s, aprobado el 2026-10-27): hook y CTA a cámara, cuerpo en off (grabado aparte con la pantalla en negro) sobre tomas de la casa, un mapa animado de la zona y stock. Detalle en `references/piezas.md`; el código de Remotion está en `template/aro0109/`.
- **B. Reel a cámara con stock**: `07 JULIO/12-07 ANR Sabías que antes de vender tu` (27 s, arranca en B/N), `08 AGOSTO/02-08 ANR Es el mejor momento para compr` (58 s, mercado de Tampa con gráficos), `08 AGOSTO/14-07 ARO La decisión más grande de tu v` (33 s, CTA "ESCRIBEME").

## 7. Ideas que pueden sumar (opcionales, a criterio)
- Mapa simple de Tampa Bay marcando la zona de la casa (navy + punto dorado) cuando dice dónde queda. Se hizo en 01-09: lat/lon reales proyectadas, I-75 dibujándose, pin dorado de la comunidad y ruta dorada con "15 MIN" hasta Wesley Chapel / outlets (`template/aro0109/Video.tsx`, `Mapa`). Los nombres que no dice (Tampa, Dade City) quedaron aprobados.
- Ficha final de la casa (precio + cuartos + baños + pies²) en The Seasons sobre un plano limpio, antes del CTA.

## 8. Correcciones del cliente
(Vacío por ahora: sumar con fecha y pieza de origen. Si contradice algo de arriba, reescribir la regla.)
- Niveles: las referencias quedaron entre −20 y −25 LUFS; no copiar eso, se masteriza como pide la base.
- **Sin avisos legales en pantalla** (01-09, 2026-10-27: "Ese texto… sacalo. No lo quiero ahí"): nada de "Sujeto a aprobación de crédito…" aunque hable de financiamiento o tasas. Para ARO esto reemplaza el disclaimer de la regla 6 de la base.
- **CashMoney bien audible en el precio** (01-09): colocado con el pico a −19 dBFS no se escuchaba, porque el archivo tiene un golpe corto y el cuerpo ~26 dB más abajo. Quedó aprobado con el pico a **−8 dBFS**. Medirlo por loudness contra la voz, no por el pico.
- **Música funk/groove liviana a −12 dB bajo la voz** (01-09, *Evergreen*: 1,5 % de la energía en 1–4 kHz). A −16 dB "está algo baja".
