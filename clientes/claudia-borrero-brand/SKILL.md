---
name: claudia-borrero-brand
description: Identidad visual para video de Claudia Borrero (CBC), asesora inmobiliaria en Cali, Colombia (Pance, Alfaguara, sur de Cali). Tipografía Articulat CF con mezcla de pesos en la misma línea (Light / Light Oblique de relleno, Bold en la palabra clave, Bold Oblique de acento, Heavy MAYÚSCULA en los golpes), subtítulos blancos de 1–3 palabras con sombra suave al pecho, CTA en Heavy MAYÚSCULA con contorno negro, placas de título con velo taupe de la paleta sobre el video desenfocado y una línea en contorno hueco, precios en pesos colombianos (`$1.590M`) en Heavy con brillo, light leak cálido como transición de la casa, portadas con lockup apilado arriba de la cabeza, más la referencia de cuatro piezas aprobadas (dos pautas, dos reels a cámara). Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Claudia Borrero / CBC / Clau Borrero / Biznes (reels, pauta de propiedades, captación, portadas), o cuando el usuario diga "editá el video de Claudia", "video de CBC", "con la marca de Claudia Borrero", aunque no mencione la skill.
---

# Claudia Borrero (CBC): marca para video

Reglas obligatorias (márgenes, cara, audio, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 5 de esta skill. Acá va solo lo propio de la clienta.

- Clienta: **Claudia Borrero** ("Clau"), asesora inmobiliaria en **Cali, Colombia**: sur de Cali, Pance, Alfaguara, Av. Cañasgordas, condominios campestres. Siglas de archivos: **CBC**. Marca personal secundaria: "BIZNES by Clau Borrero".
- Vocera: Claudia, sola, con **mic de solapa en la mano** a la altura del mentón. Graba sentada en su oficina (pared clara, silla negra), en interiores de casa o de pie en la propiedad que muestra.
- Público y lugar: propietarios y compradores en Cali. **El stock tiene que parecer Cali / Colombia**: drone de Pance y el sur (techos de teja, palmas, verde), conjuntos cerrados, unidades campestres. Nada que parezca EE. UU. Moneda **pesos colombianos**: en el video `$1.590M` (millones con M, punto de miles); en portada el número completo `$1.590.000.000`. Datos locales que usa: "estrato 6", "conjunto", "unidad", "sala-comedor", "family room", "oficios", "de servicio".
- Tono: cercano, didáctico y seguro; **tuteo colombiano** ("¿Tienes…?", "escríbeme", "conversamos", "me gustaría"). Respetarlo en los subtítulos (nada de voseo). Whisper suele errar: Pance, Alfaguara, Cañasgordas, Bello Horizonte, estrato, sismorresistente.
- CTA habitual: "**ESCRÍBEME / COORDINAMOS / TU VISITA**", "**POR WHATSAPP / Y CONVERSAMOS / TU PROPIEDAD**". Sin placa final.
- Carpeta: `{CARPETA_CLIENTE}/01 REELS/<NN Mes>/<DD-MM CBC Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/` (plantilla vacía en `01 REELS/000/`). Las pautas llevan **PAUTA** en el título. El final va en la carpeta con su nombre `.mp4`, la portada como `.png` al lado.
- Formato de las referencias: 1080×1920, **30 fps**, 30–60 s. Masters entre −9,5 y −11 LUFS (la entrega sigue el estándar de la base; la de Fisuras salió en −19,6: no copiar).
- **Logo: no se usa** en los reels (ninguna referencia lo lleva), ni el "BIZNES by Clau Borrero".

## 1. El manual vs. los videos
El manual es mínimo: paleta Coolors de grises cálidos, un doc de fuentes (**Articulat CF** para títulos y subtítulos, **Source Serif Italic** para resaltar), el logo BIZNES y los banners.
- **Articulat CF pasa tal cual** y es la única familia de los reels.
- **Source Serif no se usa en los reels.** El resaltado se hace con la itálica (Oblique) de Articulat.
- **La paleta casi no aparece.** Su único uso es el **velo taupe** de las placas de título. Todo el texto es **blanco**. No hay color de acento.

## 2. Tipografía: Articulat CF
**Adobe Fonts (licencia comercial): no se suben los `.otf` al repo.** Cada editor activa la familia en Creative Cloud (fonts.adobe.com/fonts/articulat-cf) para Premiere. Para renderizar con PIL / Remotion se corre `python scripts/fuentes.py`: busca la familia en la caché de Adobe y la deja en `~/.claude/elevate/fonts/articulat-cf/ArticulatCF-<Estilo>.otf`. En código se usa `from fuentes import ruta; ruta('Heavy')`.
- Interletrado: **−2 %** del cuerpo en subtítulos y **−4 %** en golpes y títulos (Premiere ≈ −20 / −40).
- Interlineado de bloques apilados ≈ **0,8**: las líneas casi se tocan (medido: 9–14 px entre líneas de 85 px de cap).

| Uso | Estilo de Articulat CF |
|---|---|
| Subtítulo de relleno | **Light** (sobre B-roll a menudo **Light Oblique**) |
| Palabra clave del subtítulo, cifras, lugares | **Bold** |
| Acento / intención ("*paredes*", "*cotidianas*", "*decidir*") | **Bold Oblique** |
| Golpe (1–2 palabras dichas) | **Heavy** MAYÚSCULA ("FISURAS", "ESTRUCTURALES", "NO VENGO") |
| CTA final | **Heavy** MAYÚSCULA blanca con **contorno negro 4 px** |
| Placa de título | **Heavy** MAYÚSCULA, una línea sólida y otra en **contorno hueco** blanco |
| Precio | **Heavy** (`$1.590M`), bajada en Light Oblique |
| Portada | Heavy / HeavyOblique MAYÚSCULA + Light chica + contorno hueco + Light espaciada (ver §5) |

## 3. Color
| Nombre | HEX | Uso en video |
|---|---|---|
| Blanco | `#FFFFFF` | Todo el texto (subtítulos, golpes, precios, títulos) |
| Negro | `#000000` | Contorno 4 px del CTA; sombra suave de todo el texto |
| Taupe (velo) | `#918E89` / `#BCB7B1` | **Velo de las placas de título** sobre el video desenfocado (medido `#AB9F98` ≈ capa `#A69C95` al 85–90 %) |
| Arena | `#D4D0C9` | Libre (fondos de tarjeta, si hiciera falta) |
| Carbón | `#363432` | Libre; no aparece en las referencias |

## 4. Sistema de texto y acabado
Ver `assets/CBC_subtitulos_referencia.jpg` y `assets/CBC_titulos_referencia.jpg`.
- **Subtítulos:**
  - **1–3 palabras**, blancos con sombra suave negra, sin caja, centrados en x.
  - **Mezcla de pesos dentro del mismo bloque:** relleno **Light ~66 px** + palabra clave **Bold** o **Bold Oblique** ("una **estrategia**", "o son ***normales***", "duda **real**").
  - Cada 3–5 bloques, una palabra en **Heavy MAYÚSCULA ~90–100 px** ("tienen **FISURAS**", "**COSMÉTICAS** son").
  - A veces el bloque se apila en **escalera** de 2–3 líneas con tamaños distintos ("Todas las / *paredes* / tienen FISURAS").
  - Posición: a cámara, **al pecho, justo debajo del mic** (y ≈ 1080–1400 según el encuadre); sobre B-roll, **al centro** (y ≈ 960). Siempre respetando la cara (base).
- **CTA:** las últimas frases van palabra por palabra en **Heavy MAYÚSCULA ~75 px** con **contorno negro 4 px** ("ESCRÍBEME" → "COORDINAMOS" → "TU VISITA."), en el mismo lugar del subtítulo.
- **Placas de título** (1–2 por reel, en cambios de bloque):
  - Video desenfocado + **velo taupe** al 85–90 %, con Claudia apenas visible detrás.
  - Encima, el título en **Heavy MAYÚSCULA ~115 px**, centrado (y ≈ 800–1000), interlineado 0,8.
  - Variante: una línea en **contorno hueco** y la siguiente sólida ("PREVENIR NO ES / **TENER MIEDO**"; "ES CUIDARNOS / CON ANTICIPACIÓN" con la 2.ª más chica).
  - La placa también sirve para un título suelto ("CÓMO PREVENIR").
- **Tarjeta de captura:** imagen de un post / dato con **esquinas redondeadas (radio ~60 px)** y ~85 % del ancho sobre el video desenfocado y oscurecido. Encima va un título Heavy blanco apretado ("GENERÓ MUCHO DEBATE").
- **Precio:**
  - Encima, la bajada en **Light Oblique ~70 px** ("La mayoría pagan"). El precio en **Heavy ~180 px** (`$1.590M`) con un **brillo / halo blanco suave** debajo. Abajo, la frase en Bold ("un apartamento").
  - Entra con SFX de dinero.
- **Datos de propiedad:** van de a uno como subtítulo, con el dato en Bold ("**5 habitaciones**", "**4 garajes**", "*family room*") y el metraje / estrato en Light Oblique ("*386 metros*", "*Estrato 6*").
- **Transición de la casa: light leak cálido** (amarillo, naranja o rosado) en los cambios de tramo: de Claudia al B-roll, de un ambiente a otro y al cerrar el gancho. Es `leak` de `edicion-reels-base/scripts/transiciones.py`. En Premiere, los `Hst - Flr Light Leaks` del pack de Motion Bro, con `Flares_01.mp3`. Sobre ráfagas de drone, cortes secos.
- **Zooms y ritmo:**
  - Un cambio de plano cada 2–5 s.
  - En los tramos a cámara, **punch-in / punch-out** entre tomas.
  - En la pauta de captación, ráfaga de drone de la zona con cortes cada ~0,3 s.
- **Música:** de fondo, liviana y constante, por debajo de la voz. Ver `references/biblioteca.md`.
- **Stock / B-roll:**
  - Material propio de la propiedad primero.
  - Si se nombra Cali o un barrio, drone real de la zona.
  - Para temas generales, stock latinoamericano (en el sísmico se usaron imágenes de noticias de edificios colapsados y calles de Colombia).

## 5. Portadas
Analizadas las 4 de las referencias (`<pieza>/<pieza>.png`). Ver `assets/CBC_portadas_referencia.jpg`. Van como **primer frame** del video (`portadas-reels`).
- **Lockup apilado arriba de la cabeza** (y ≈ 380–760), centrado o corrido a la derecha. Blanco con sombra suave, interlineado ≈ 0,8. Mezcla:
  - **Heavy / Heavy Oblique MAYÚSCULA grande** en las palabras clave ("¿TIENES", "PROPIEDAD", "FISURAS:", "PREVENIR").
  - Palabras puente en **Light MAYÚSCULA chica**, pegadas a la grande ("UNA", "EN", "CUANDO").
  - Una palabra en **contorno hueco** ("CONDOMINIO", "DEBATIR").
  - Opcional: una línea en **Light MAYÚSCULA muy espaciada** ("ES MEJOR QUE").
- Fondo: Claudia sonriendo con el mic, de la cintura o el pecho para arriba, en la mitad de abajo. El fondo es el de la toma, apenas oscurecido.
- **Pauta de propiedad:** lockup + **precio completo** en Heavy (`$1.590.000.000`) + **tarjeta redondeada** con la mejor foto (piscina, fachada) sobre el torso.

## 6. Referencias aprobadas (REFERENCIA, no fórmula)
Mirar antes de editar. Sirven para entender el criterio, no para copiarlas. Detalle en `references/piezas.md`. Ruta: `{CARPETA_CLIENTE}/01 REELS/Skill/<pieza>/<pieza>.mp4`.

| Pieza | Tipo |
|---|---|
| A. `06-09 CBC PAUTA Tienes una propiedad en` (30 s) | Pauta de captación: gancho a cámara + ráfaga de drone del sur de Cali + CTA |
| B. `17-09 CBC PAUTA Casa campestre en Condom` (45 s) | Pauta de propiedad: precio-gancho a cámara, recorrido en off, CTA a cámara |
| C. `14-09 CBC Fisuras cuándo preocuparse y c` (36 s) | Reel educativo a cámara + B-roll ilustrativo |
| D. `18-09 CBC Prevenir es mejor que debatir` (61 s) | Reel de opinión: tarjeta de captura, placas de título, stock de noticias |

## 7. Ideas que pueden sumar (opcionales, a criterio)
- Usar el velo taupe también como fondo de tarjetas de datos en las pautas (hoy solo está en las placas).
- Un mapa simple del sur de Cali con el punto del condominio cuando se habla de ubicación.

## 8. Correcciones del cliente
(Vacío. Cada corrección que valga solo para Claudia se anota acá con fecha y pieza, reescribiendo la regla si contradice algo anterior.)
