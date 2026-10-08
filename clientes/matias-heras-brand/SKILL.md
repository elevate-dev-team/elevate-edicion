---
name: matias-heras-brand
description: Identidad visual para reels de Matías Heras (MH), inmobiliario en Luján de Cuyo, Mendoza, Argentina. Tipografía Owners Text con mezcla de pesos (Regular de base + Black en la palabra clave, itálicas Medium/Bold/Black como acento), subtítulos blancos a media altura que entran con un desenfoque corto, títulos y precios en Owners Black MAYÚSCULA naranja con contorno blanco, paleta naranja `#EE8E04` + grises, glitch RGB como transición, portada como primer frame del video, más la referencia de cuatro piezas aprobadas (dos reels orgánicos y dos pautas de propiedad). Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier reel o pauta de Matías Heras / MH (orgánicos, pauta de propiedades, portadas), o cuando el usuario diga "editá el video de Matías", "video de MH", "con la marca de Matías Heras", aunque no mencione la skill.
---

# Matías Heras (MH) — Marca para reels

Reglas obligatorias (márgenes, cara, voz, niveles, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Esta skill solo agrega lo propio del cliente.

- Cliente: **Matías Heras**, inmobiliario en **Luján de Cuyo, Mendoza** (también habla de Mendoza en general: historia local, mercado, crédito hipotecario, barrios, complejos). Siglas de archivos: **MH**.
- Tono: cercano, didáctico y local, de vecino que sabe ("Sabías que…", "dejame en comentarios"). Rioplatense mendocino con voseo ("sos", "podés", "escribime", "ordená"): respetar lo que dice, no corregirlo en los subtítulos.
- Carpeta del cliente: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM MH Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/` (plantilla vacía en `01 REELS/000/`). Las pautas llevan **PAUTA** en el título (`19-08 MH PAUTA Nueva prop 75k`). El final va en la raíz de esa carpeta con el nombre de la carpeta `.mp4`; la portada `.jpg` (y su `.psd`) en `PORTADA/`.
- Formato de las referencias: 1080×1920, **25 fps**, 38–46 s.
- **B-roll de lugares puntuales (importante):** Matías suele nombrar lugares o hechos muy específicos (una basílica, una plaza, unos viñedos, una ruta, la historia de un distrito). El B-roll tiene que mostrar **ese** lugar, no stock genérico. Por cada lugar nombrado: buscar primero en los crudos del proyecto y en el disco (catálogos de `Herramientas Edicion/_INDICE/`, otros proyectos de MH); si existe, usarlo. Si no existe, **avisar al usuario con la lista de lugares/frases sin material** para que él consiga algo real (YouTube u otra fuente, sin marcas de agua en el recorte). Imágenes con IA solo cuando no existe material real (ej. la fundación de Luján).
- **No se usa logo** en los videos (la carpeta de marca no tiene logo y las referencias no lo usan). Tampoco placa final ni end card.

## 1. Lo que se usa de la marca

### Tipografía — Owners Text (el elemento de marca principal)
Archivos en `assets/fonts/` (versión completa, de Adobe Fonts: https://fonts.adobe.com/fonts/owners-text). En la carpeta de marca también hay una familia `OwnersTRIAL` (Narrow/Wide/etc.) de befonts, **solo uso personal: no usarla**.

| Uso | Peso | PostScript |
|---|---|---|
| Palabras "de relleno" del subtítulo | Regular | `OwnersText-Regular` |
| Palabra clave del subtítulo, cifras, nombres propios, lugares | **Black** | `OwnersText-Black` |
| Acento emotivo o de matiz ("*declaró*", "*magnífica*", "*invertir*") | Medium Italic / Bold Italic / Black Italic | `OwnersText-MediumItalic`, `-BoldItalic`, `-BlackItalic` |
| Énfasis intermedio (cuando Black es demasiado) | Bold | `OwnersText-Bold` |
| Línea chica de los títulos ("No se venden porque", "¿Viste este") | Medium | `OwnersText-Medium` |

- **Interletrado apretado** en todo (≈ −3 % del cuerpo; −30 de tracking en Premiere), sobre todo en los títulos en MAYÚSCULA, donde las letras casi se tocan. Interlineado de los títulos ≈ 0,9.
- La versión completa sí tiene cifras en las itálicas (probado): "*1964*" se puede poner en itálica.

La firma es el **contraste de pesos dentro del mismo bloque**: Regular fino + una palabra en Black, o una palabra en itálica. Uso medido en las 4 referencias: Regular ≈ 45 %, Black ≈ 35 %, itálicas ≈ 15 %, Bold/Medium el resto.

### Color
Paleta oficial (`assets/MH_Paleta.png`):

| Nombre | HEX |
|---|---|
| Naranja (principal) | `#EE8E04` |
| Gris medio | `#808080` |
| Gris perla | `#C3C8CF` |
| Blanco | `#FEFEFE` |
| Gris carbón | `#464B4C` |

**Cómo se aplica en los reels:**
- Subtítulos: **blanco** con sombra suave oscura. Sin cajas.
- Títulos-golpe y precios: **naranja `#EC8C00`–`#EE8E04`** con **contorno blanco fino (~4–6 px)** y sombra suave.
- Portadas: el naranja va en **degradé vertical** de `#F38602` (arriba) a `#FEC693` (abajo, durazno).
- Los grises casi no aparecen en video; sirven para fondos o placas si hacen falta (`#464B4C` en vez de negro puro).
- Fondo de los tramos con imágenes "enmarcadas": **blanco `#FEFEFE`** (ver 2.A).

## 2. Referencias aprobadas (NO son fórmula)
> Así se resolvieron cuatro reels de 2026 (julio a septiembre). Sirven para entender el gusto del cliente; cada video nuevo decide su propia estructura según su contenido. Detalle plano por plano en `references/piezas.md`.

### Común a las cuatro
- **El primer frame es la portada** en las referencias, pero **la portada la hace el usuario**: no generarla ni meterla en el video salvo que la pida (corrección 2026-10-01).
- **Subtítulos**: Owners Text **~70 px** (altura de mayúscula ≈ 50 px), blanco, sombra suave, **1–3 palabras por bloque**, minúscula tipo oración, centrados en x = 540. **El bloque entra entero** con un desenfoque/fundido de 1–2 frames (no karaoke, no pop de escala).
  - Speaker a cámara en primer plano: a la altura del pecho, **y ≈ 1500–1560**.
  - Speaker en plano medio o cuerpo entero: debajo de la cara, sobre el pecho, **y ≈ 1030–1130**.
  - B-roll o tramo sin cara: **centro, y ≈ 900–960**.
- **Títulos-golpe** (2–3 por video): línea Medium blanca en minúscula arriba + **Owners Black MAYÚSCULA naranja con contorno blanco** abajo, interlineado muy apretado (las líneas casi se tocan). **Proporción (corrección del usuario, 2026-10-01): la línea chica va a ~60–65 % del cuerpo de la grande (ej. 66 px sobre 106 px), nunca diminuta, y el aire entre líneas se mide borde de letra a borde de letra (~6 px), no por la caja de la sombra.** Si no entra bajo el mentón, se achica el título entero manteniendo la proporción. Ej.: "No se venden porque / **NO SON APTAS CRÉDITOS**", "¿Viste este / **DEPARTAMENTO?**". Mientras está el título, no hay subtítulo.
- **Transición de la casa: glitch RGB** (Premiere: *Glitch digital de VR*, Mettle SkyBox) en 18–28 cortes por video, con el SFX `Simple_SFX_2.wav`. El resto, corte limpio.
- **Música**: cama continua del disco, una por video, elegida en `Herramientas Edicion/_INDICE/musica_catalogo.csv`; las de las referencias van de emotiva/cinemática (orgánico de historia) a funk/energética (educativo y pauta). Las referencias salieron entre −8,6 y −11 LUFS: **para los niveles valen los de `edicion-reels-base`**, no los de la referencia.

### A. Orgánico de historia local — `09 Septiembre/17-09 MH Luján no siempre se llamó así/` (38,6 s)
- Selfie a cámara frente a la iglesia de Luján (primer plano, subtítulo abajo en el pecho) intercalado con **imágenes generadas con IA** (ChatGPT, estilo pintura histórica realista: Luján colonial, la ciudad en los 50, viñedos con la cordillera, la capilla con la Virgen).
- Las imágenes van **en tarjeta vertical con esquinas redondeadas (~24 px) y sombra suave, centradas sobre fondo blanco**, ocupando ~70 % del ancho; el subtítulo va en el centro de la tarjeta. Entre tarjetas, glitch RGB.
- Fechas y cifras en Black ("nació en **1855**", "del **1964**"), datos de matiz en itálica ("El *departamento*", "*más atrás*").
- Cierre con CTA a comentar: "Si sos de **Luján**, dejame en *comentarios* otro dato que nadie **sepa**".

### B. Orgánico educativo a cámara — `09 Septiembre/14-09 MH "Apto crédito" no es un detalle/` (41,7 s)
- Plano fijo en su oficina (escritorio, notebook, globo terráqueo), plano medio; subtítulo sobre el pecho.
- Stock de papeles, planos, obra y gente reunida para lo que nombra, con la palabra sola en Black al centro ("**Título**", "**Planos**", "**Lo construido**", "**Impuestos**"): lista enumerada = un plano de stock por ítem.
- Título-golpe naranja en el gancho: "No se venden porque / **NO SON APTAS CRÉDITOS**".

### C. Pauta de propiedad (terreno) — `09 Septiembre/19-08 MH PAUTA Nueva prop 75k/` (46 s)
- Matías de cuerpo entero en el jardín (con el árbol en flor) hablando a cámara + recorrido de la casa en gran angular.
- **Precio en el gancho**: "**USD75.000**" en Owners Black naranja con contorno blanco, grande (~ancho completo), **arriba de la cabeza (y ≈ 735)**, entra con desenfoque de movimiento.
- Medidas como títulos naranjas en MAYÚSCULA ("**565 METROS** / de terreno", "**11 METROS** / de frente"); el resto de los datos (calle, distancias, centro comercial) como subtítulo con la parte importante en Black.
- CTA: "Escribime al / **WHATSAPP**".

### D. Pauta de propiedad (departamento) — `07 Julio/01-07 MH PAUTA MORENO PARK/` (41,7 s)
- Gancho: Matías de cuerpo entero en la oficina con una **tarjeta redondeada con foto del depto detrás de él** (recortado con máscara, él queda delante) + "¿Viste este / **DEPARTAMENTO?**".
- Recorrido del complejo y del depto con fotos/videos del cliente (WhatsApp); subtítulos centrados en los tramos sin cara. Precio "**USD93.000**" blanco en Black al centro.
- Gancho de oportunidad ("Te gustó pero no te *cerró* **el precio**… acaba *de bajar*"), argumentos (apto crédito, 2 dormitorios, cochera, seguridad 24 h, amenities, renta temporaria por turismo del vino) y CTA "**escribime** antes de que se lo **lleve otro**".

### Portadas
Imagen del video (o la imagen IA más fuerte) con viñeta oscura suave arriba y abajo. Título en dos niveles, centrado, en el tercio superior (o inferior si arriba está la cara):
- Palabra-golpe en **Owners Black MAYÚSCULA con degradé naranja `#F38602` → `#FEC693`** ("LUJÁN NO SIEMPRE", "\"APTO CRÉDITO\"", "USD75.000", "MORENO PARK").
- Complemento en **Owners Bold/Medium blanco**, más chico, en minúscula ("se llamó así", "no es un detalle…", "Nueva propiedad", "3 AMBIENTES en / por $93.000").
- Sombra suave; sin cajas ni contorno. Para lo técnico de la portada: skill `portadas-reels`.

## 3. Ideas que pueden sumar (opcionales, a criterio)
- En pauta, una placa de datos breve (ambientes · m² · precio) con el sistema de títulos naranja, si la voz los dice rápido.
- Alternar el glitch con algún corte con desenfoque direccional para que no se gaste.
- Para orgánicos de historia o datos de Mendoza, el recurso de imágenes IA en tarjeta sobre blanco funciona bien y es reconocible: reutilizarlo cuando no haya material real.

Recursos del disco usados y sugeridos: `references/biblioteca.md`.
