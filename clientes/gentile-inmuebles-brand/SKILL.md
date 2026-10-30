---
name: gentile-inmuebles-brand
description: Identidad visual para video de Gentile Inmuebles (GIN), inmobiliaria en Capital Federal, Buenos Aires (Villa Luro, Ramos Mejía; pozo, departamentos a estrenar). Montserrat con contraste de pesos (Medium/Regular de base + Black en la palabra clave, Black Italic MAYÚSCULA en los hooks; The Seasons Bold como acento ocasional), subtítulos blancos de 1–3 palabras al pecho con la palabra clave en Black MAYÚSCULA roja con borde blanco o sobre caja roja semitransparente, precios y datos en Black rojo con contorno blanco + bajada blanca, hooks blancos en itálica arriba, listas con el número en rojo, whip/zoom-blur como transición, B-roll de la propiedad y renders del emprendimiento, sin logo, paleta negro / carbón / rojo `#E10E1C` / gris claro, más la referencia de ocho piezas aprobadas (tres pautas de propiedad y cinco reels a cámara: pozo, vivir en Capital, 5 razones, "En Capital no me alcanza", "Podríamos construir") y la guía de portadas con degradé negro→rojo. Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Gentile Inmuebles / GIN (reels, pauta de propiedades, pozo, portadas), o cuando el usuario diga "editá el video de Gentile", "video de GIN", "con la marca de Gentile", aunque no mencione la skill.
---

# Gentile Inmuebles (GIN) — Marca para video

Reglas obligatorias (márgenes, cara, audio, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 5 de esta skill. Acá va solo lo propio del cliente.

- Cliente: **Gentile Inmuebles**, inmobiliaria en **Capital Federal** (Villa Luro, Floresta, Ramos Mejía como contraste). Venden pozo, emprendimientos propios y departamentos a estrenar. Siglas de archivos: **GIN**.
- Voceros: el dueño (señor pelado, de barba canosa) en casi todo; un asesor joven en algunas pautas (Dante 156). Los nombres no hacen falta; si se necesitan, los pasa el editor.
- Público y lugar: compradores e inversores porteños. **El stock tiene que parecer de Buenos Aires**: edificios de departamentos, obra en altura, calles arboladas de Capital. Moneda **USD** ("USD 212,000", "USD 300.000").
- Tono: cercano, rioplatense, voseo ("querés", "mandame", "calificás"). Hablan rápido: revisar en Whisper "en pozo", "anticipo", "cuotas", nombres de calles y barrios.
- CTA habitual: "Mandame un WhatsApp", "¿Querés ver lo que tenemos en pozo?", "una reunión esta semana".
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM GIN Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/ EXPORT/`. El final va en `EXPORT/` con el nombre de la carpeta `.mp4` (`_2` si es versión).
- Formato de las referencias: 1080×1920, **25 fps**, 22–40 s (pautas largas hasta 68 s).
- Logo: **no va logo en los videos**. Sin placa final.

## 1. Marca vs. videos
No hay manual: solo la paleta (`assets/paleta.png`). La identidad sale de las piezas aprobadas (julio–septiembre 2026, editadas en Premiere con Animation Composer y Motion Array).

## 2. Tipografía — Montserrat
Archivos en `assets/fonts/montserrat/` (OFL). Interletrado apretado (≈ −2 %), interlineado de títulos ≈ 0,85: las líneas casi se tocan.

| Uso | Peso |
|---|---|
| Subtítulo base | Medium (Regular en las piezas de julio) |
| Palabra clave del subtítulo, cifras, barrios | Black, muchas veces en MAYÚSCULA |
| Hooks / títulos de apertura | Black Italic MAYÚSCULA, blanca con sombra |
| Precio y datos fuertes | Black MAYÚSCULA |
| Acento serif (ocasional) | The Seasons Bold (Adobe Fonts, no está en el repo; si no la tenés, se hace sin serif) |

## 3. Color
| Nombre | HEX | Uso en video |
|---|---|---|
| Rojo Gentile | `#E10E1C` | Palabra clave, precios, números de lista, cajas |
| Negro | `#0F0F0F` | Degradés de portada, sombras |
| Carbón | `#454243` | Secundario (placas si hacen falta) |
| Gris claro | `#CDCCCB` | Secundario |
| Blanco | `#FFFFFF` | Subtítulos, hooks, contornos del rojo |

## 4. Sistema de texto y acabado
Ver `assets/sistema-texto.png` (subtítulo, precio, B-roll, hook).
- **Subtítulos:** 1–3 palabras, una o dos líneas, centrados al pecho (y ≈ 930–1000 px con el speaker sentado o de pie). Base Medium blanca ~60–70 px con sombra suave; la palabra clave en **Black**. Dos variantes de énfasis, una por pantalla:
  - **Black MAYÚSCULA roja con borde blanco** ("y **NOSOTROS**", "de **RAMOS**").
  - **Caja roja semitransparente** detrás de la frase con el texto blanco ("en **Capital**", "**MAESTRO MAYOR DE OBRA**").
  Sobre B-roll, la misma altura y tamaño, y la palabra clave en rojo ("**77 METROS**", "piso **siete**").
- **Hooks:** Montserrat Black Italic MAYÚSCULA blanca, grande (ancho ≈ 85–90 % del cuadro), con sombra, **arriba de la cabeza**, una o dos palabras por golpe que se van sumando ("HAY GENTE / QUE PASÓ…", "ESTAS SON LAS RAZONES"). Entran con escala + desenfoque corto. A veces una palabra del hook en rojo itálica ("MÁS", "EN").
- **Precio y datos:** Black MAYÚSCULA roja con contorno blanco, en 2 líneas apretadas, y bajada blanca en Bold/Medium debajo ("**40% DE ANTICIPO** / y 24 cuotas", "**CRÉDITO HIPOTECARIO**", "**USD 300.000**").
- **Listas:** número en rojo Black + título en MAYÚSCULA blanca con contorno ("**1** LA SEGURIDAD", "**4** LOS AMENITIES").
- **Transición de la casa:** whip / zoom-blur (Animation Composer) en los cambios de bloque y al entrar al B-roll; el texto grande también puede entrar con zoom-blur.
- **Ritmo:** cortes cada 1,5–3 s; en pautas, un plano por ambiente con su dato. Zooms suaves a cámara.
- **Música y SFX:** música funk/house liviana para redes, siempre instrumental; swoosh en whips y en hooks. Niveles: los de la base.
- **Stock / B-roll:** primero material propio (recorrido del depto, renders y obra del emprendimiento). Stock de obra, contratos, billetes y calculadora para los reels educativos; que se vea de Buenos Aires.

## 5. Portadas
Ver `assets/portadas.png` (las 8 publicadas, en `01 REELS/*/*/PORTADA/<nombre de carpeta>.png`).
- **Degradé arriba de negro a rojo** (rojo Gentile difuminado sobre la imagen) y oscurecido general; el sujeto bien expuesto.
- Texto arriba del sujeto o al costado de la cabeza, interlineado muy apretado: **Montserrat Black Italic MAYÚSCULA** para el golpe (blanca o roja) mezclada con Regular/Medium para el resto ("¿Por qué *tanta gente* compra en / **EN POZO?**", "EN CAPITAL / NO ME ALCANZA").
- Palabra clave en rojo `#E10E1C`, o blanca dentro de una **caja roja** ("**CAPITAL**", "**AMENITIS**").
- Pautas: dirección en blanco Black + **precio en caja roja** ("MARCOS PAZ 4000 / CAPITAL FEDERAL / **USD 212,000**"); se puede usar el render del edificio en vez del speaker.

## 6. Referencias aprobadas (REFERENCIA, no fórmula)
Rutas relativas a `{CARPETA_CLIENTE}/01 REELS/`, final en `EXPORT/`.

- **A. Pauta de pozo a cámara + renders** — `09 SEPTIEMBRE/02-09 GIN PAUTA Marcos Paz 4000, Capital` (68 s): el dueño parado frente al cartel de obra; "¿Si querés comprar a **ESTRENAR**…", "y **NO** calificás en un **CRÉDITO HIPOTECARIO**", "**40% DE ANTICIPO** / y 24 cuotas". Después renders del edificio y de cada ambiente con un dato por plano ("**77 METROS**", "**70 CUBIERTOS**", "en **MARCOS PAZ 4053**").
- **B. Pauta de recorrido** — `07 JULIO/01-08 GIN PAUTA Dante 156, Villa Luro, D HOOK 1` (34 s, dos hooks): el asesor joven camina el depto vacío; hook "UN **3** DORMITORIOS / CUESTA **USD 300.000** / CON COCHERA"; ambientes con dato en Black ("**110** metros cuadrados", "COCINA / bien resuelta", "**2 baños** completos"); cierra a cámara "MANDAME UN WHATSAPP", "una **REUNIÓN** esta semana".
- **C. Reel a cámara con caja roja** — `09 SEPTIEMBRE/06-09 GIN En Capital no me alcanza` (23 s): sentado en la oficina; subtítulos con caja roja y Black rojo; B-roll de obra al decir "Soy **MAESTRO MAYOR DE OBRA**"; whips con zoom-blur; cierre "**POR EL MISMO DINERO**".
- **D. Reel de lista** — `07 JULIO/16-07 GIN 5 razones para dejar la casa y` (41 s): hook itálico arriba en la cocina ("HAY GENTE QUE PASÓ…", "ESTAS SON LAS RAZONES"), después recorrido de un depto con "**1** LA SEGURIDAD" … "**5** LA COMODIDAD DE" y subtítulos chicos.
- **E. Reel educativo con stock** — `07 JULIO/15-07 GIN Por qué tanta gente compra en` (32 s): hook con palabras rojas itálicas arriba ("MÁS", "EN"), stock de obra/dinero con subtítulos y palabra clave en caja roja; cierre a cámara "¿Querés ver lo que tenemos en pozo?".
- También aprobadas: `07 JULIO/04-07 GIN PAUTA NO ESPERES MAS`, `07 JULIO/13-07 GIN Para vivir bien en Capital no`, `09 SEPTIEMBRE/17-08 GIN Podríamos construir en cualqui`.

## 7. Ideas que pueden sumar (opcionales)
- Drone o tomas de calle del barrio (Villa Luro, Floresta) para ubicar la propiedad.
- Contador animado en el precio con SFX de caja registradora.

## 8. Correcciones del cliente
(Vacío por ahora. Indicación inicial, 2026-10-30: basarse en los videos aprobados; sin logo.)
