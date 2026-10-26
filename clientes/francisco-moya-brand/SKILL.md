---
name: francisco-moya-brand
description: Identidad visual y estilo de edición de Francisco "Fran" Moya (FM), argentino, coach y líder de un equipo de agentes inmobiliarios en Florida. Montserrat con interletrado e interlineado muy bajos y contraste de pesos (Medium + ExtraBold/Black, Bold Italic de acento), subtítulos blancos chicos de 1–3 palabras al pecho, placas blancas/negras con texto gris carbón, fotos-tarjeta sobre fondo blanco, títulos apilados, amarillo #FFC324 en portadas. Regla: nada de stock que no sea real; el B-roll sale de MATERIAL VIAJES (catálogo clip por clip de Florida Octubre 2026 incluido). Zooms, rotoscopia, animación de texto, música y transiciones. Se usa con edicion-reels-base y portadas-reels. Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Fran Moya / FM (reels, YouTube, entrevistas al equipo, portadas), al buscar B-roll de sus viajes, o cuando digan "video de Fran", "video de FM", "marca de Francisco Moya".
---

# Francisco Moya (FM) — Marca y estilo de edición

Reglas obligatorias (márgenes, cara, voz, niveles, fin al terminar de hablar, ojos fijos en los punch-ins, SFX, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 9 de esta skill. Esta skill suma lo propio del cliente.

- Cliente: **Francisco "Fran" Moya**, argentino, coach de negocio inmobiliario y líder de un equipo de agentes en Florida (Miami, Tampa, Orlando). Habla de crecimiento de agentes, sistemas, medir el negocio, prospectar, captaciones, equipo. Siglas: **FM**.
- Tono: directo, de mentor, con humor y referencias pop/fútbol ("*anulo mufa*", Netflix, Argentina campeón). Habla con **voseo argentino** ("medís", "tenés", "vos") y los subtítulos respetan lo que dice; las placas de CTA escritas usaron neutro ("Comenta… si quieres"): ante la duda, preguntar. Fran es la cara; a veces entrevista a alguien del equipo (ej. Aleja).
- **La carpeta `00 IMAGEN DE MARCA` NO vale** (identidad vieja: Monument Extended, manchas, texturas, degradés Elevate). La marca actual sale de los videos de 2026 que se analizaron acá (sección 10).
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/2026/<NN Mes>/<DD-MM FM Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/` (plantilla `000/`). YouTube: `03 YOUTUBE/2026/<NN Mes>/`. Final en la raíz de la carpeta del proyecto con el nombre de la carpeta + `.mp4`; portada `.jpg` en `PORTADA/`.
- Los proyectos que dicen **"Clip"** vienen de **Opus** (recortes automáticos de podcasts/charlas, edición simple): **no son referencia de marca**.
- Formato: 1080×1920, **25 fps**. Duración típica 60–75 s (los trends tipo meme, ~10 s). **Horizontal 1920×1080** (YouTube, VSL, landing de webinar): sección 11.
- Sin logo, sin watermark, sin end card.

## 0. La idea del cliente: material real, acabado de edición
- **Nunca stock que no sea real.** Nada de bancos de imágenes con gente/oficinas/casas genéricas. El B-roll sale de **`MATERIAL VIAJES/`** (viajes de Fran con el equipo: Florida, Miami, Tampa, Mendoza, Libertad Digital, etc.) y de `VIDEOS/` del proyecto.
  - **Catálogo del último viaje (Florida Octubre 2026): `references/material-florida-oct-2026.md`**, clip por clip y foto por foto (qué se ve, quién, dónde, para qué sirve). Leerlo ANTES de buscar B-roll y elegir desde ahí; las miniaturas de cada archivo están en `MATERIAL VIAJES/Florida Octubre 2026/_catalogo/thumbs/<id>.jpg` (copia del catálogo en `_catalogo/CATALOGO.md`, datos técnicos en `_catalogo/manifest.csv`). En este viaje **Fran está afeitado** (sin bigote): no descartar tomas por eso para mirar sin abrir los originales.
  - Otras carpetas de viajes sin catalogar todavía: si se usan mucho, catalogarlas igual (mismo formato) y sumar el archivo a `references/`.
- **Excepción aceptada: clips de cultura pop / memes reconocibles** como chiste o metáfora (gol de Argentina para "otra final", un mago con la soga para "Super Hack"), siempre cortos (1–3 s), sin audio original y sin marcas de agua (`edicion-reels-base` regla 9). No reemplazan B-roll real: lo condimentan.
- Si una frase pide una imagen que no está en el material, se resuelve con **edición**: placa blanca/negra con texto, foto-tarjeta, título animado, zoom, rotoscopia. Si de verdad hace falta otra imagen, avisar al usuario.
- El valor está en el acabado: **tipografía, animaciones, diseño, rotoscopia, zoom-ins/outs, música y transiciones**, con la dosis según el estilo del video (sección 8).

## 1. Tipografía — Montserrat
Archivos en `assets/fonts/` (Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black). **Faltan las itálicas** (Bold Italic, ExtraBold Italic): si no están instaladas, pedirlas al usuario o bajarlas de Google Fonts con su OK; no simularlas con oblicua falsa.
- **Interletrado muy bajo** (tracking −20 a −40, ~−2 a −4 % del cuerpo) e **interlineado muy bajo** (0,80–0,90 del cuerpo; en títulos apilados las líneas casi se tocan o se pisan apenas).
- Otras tipografías aparecen solo como acento puntual en portadas (una condensada tipo Bebas/Anton en golpes como "3 RAZONES", "VENDER"). En video, Montserrat.

| Uso | Peso |
|---|---|
| Relleno de subtítulo | **Medium** / Regular |
| Palabra clave del subtítulo | **ExtraBold** |
| Acento (palabra emocional, giro) | **Bold Italic** / ExtraBold Italic ("*completo*", "el *momento*", "de *negocio*", "*realmente*") |
| Títulos-golpe, nombres, cifras | **Black** MAYÚSCULA ("PROPIEDAD", "ALEJA") |
| Encabezado en caja | ExtraBold MAYÚSCULA chica |

## 2. Color
- **Blanco** `#FFFFFF` para subtítulos y títulos sobre video (sombra suave, sin caja).
- **Gris carbón `#2C2C2C`** para texto sobre fondos claros (placas blancas, títulos sobre el blanco quemado del fondo).
- Placa blanca **`#FDFDFD`**, placa negra **`#222222`** (no negro puro).
- **Amarillo `#FFC324`**: color de acento de las **portadas** (palabra-golpe). En el video no se usa salvo pedido.
- Sin degradés de marca, sin texturas, sin manchas (eso era la identidad vieja).

## 3. Subtítulos
- Blancos, **Montserrat Medium + clave en ExtraBold** (+ acento Bold Italic), sombra suave (blur ~10–15 px, 30–40 %), **sin caja**.
- **1–3 palabras por bloque**, una línea, centrados en x = 540. Minúscula tipo oración; mayúscula solo al arrancar una frase ("Bueno", "Entonces", "Porque").
- **Chicos: ~55–60 px de cuerpo.**
- A cámara: a la altura del pecho, pegados debajo de la caja de la cabeza (`edicion-reels-base` regla 5; en los aprobados quedaron en y ≈ 1370–1400 con Fran sentado/selfie).
- Dos personas en plano general (entrevista de pie): centrados entre los dos, a la altura del torso (y ≈ 880), sin tapar caras.
- Sobre placa blanca o negra: el subtítulo pasa a ser el texto de la placa (gris carbón sobre blanco, blanco sobre negro), centrado en y = 960, mismo sistema de pesos.
- Bajo una foto-tarjeta: gris carbón, ~50 px debajo de la foto (sección 4).

## 4. Sistema gráfico (lo que hace reconocible la marca)
Referencia visual: `assets/ref/sistema_grafico.jpg`.

1. **Título apilado del gancho** (15-08): "te va hacer / **vender una** / **PROPIEDAD** / extra por mes" — 4 líneas centradas, tamaños mezclados (Regular chico → ExtraBold mediano → **Black MAYÚSCULA grande** → Regular chico), interlineado negativo (las líneas se pisan), gris carbón sobre la parte de arriba del plano **llevada a blanco con un degradé** (el fondo se funde a blanco detrás del título). Entra palabra por palabra con desenfoque + escala, siguiendo la voz.
2. **Placas blancas / negras a pantalla completa** (15-08): cortes secos de la cámara a una placa `#FDFDFD` (o `#222`) con la frase en subtítulo gris carbón (o blanco) al centro, 2–4 bloques seguidos ("estás **haciendo**" / "**acciones**" / "que *realmente*" / negro: "son a **ciegas**"). Funcionan como respiro y como énfasis; 1–3 por video.
3. **Fotos-tarjeta sobre fondo blanco** (35-08): foto o clip del material real en un recuadro (≈ 820×1100, 3:4 o 9:16, sombra suave, sin borde redondeado) sobre fondo blanco, centrado; el subtítulo va debajo en gris carbón. Se encadenan varias seguidas, una por bloque de subtítulo (montaje rápido "el equipo / que está / **detrás** de mí / haciendo / **todo**…"). Es la forma de usar **MATERIAL VIAJES**.
4. **Nombre / dato golpe sobre el plano**: "nuestra querida / **ALEJA**" — línea chica Medium + nombre en **Black MAYÚSCULA grande blanco**, sobre la foto-tarjeta o el video.
5. **Encabezado fijo en caja blanca** (35-08, entrevistas): caja blanca con esquinas apenas redondeadas arriba del cuadro (y ≈ 280–430, ancho ~850), texto gris carbón **ExtraBold MAYÚSCULA** en 2 líneas apretadas ("DE 1 PROPIEDAD CADA 2 MESES, / A 3 PROPIEDADES POR MES"). Se queda todo el video o todo el bloque, es el "titular" de la entrevista.
6. **Acotación tipo meme** (11-07): texto blanco Bold, inclinado (~−8°), arriba de la cabeza, entre asteriscos: "*anulo mufa*". Uno por video, como remate.
7. **CTA final en placa negra** (15-08): "Comenta / **"AGENTE"** / *si quieres ver la explicación completa*" — blanco, Medium chico + Black MAYÚSCULA entre comillas + ExtraBold Italic chico, apilado apretado, centrado, 3–4 s al final (excepción a "sin end card" cuando el video pide comentario).
8. **Trend de texto fijo** (10-07 Netflix): bloque de 4–5 líneas Montserrat SemiBold blanco con sombra/contorno fino, centrado sobre el plano, todo el video; sin subtítulos aparte.

## 5. Animación y transiciones
- **Texto**: entrada con **desenfoque + opacidad + leve escala** (4–6 cuadros), palabra por palabra en los títulos apilados; salida rápida con desenfoque.
- **Zoom-ins / zoom-outs** con el efecto Transformar y **desenfoque de movimiento** (ángulo de obturación), anclados a los ojos (`edicion-reels-base`). Punch-ins de corte en los planos largos a cámara; zoom-golpe con overshoot en frases clave.
- **Rotoscopia**: título **detrás de Fran** (portadas de mayo: "3 RAZONES", "UN CAMBIO?", "VENDER"); en video, en el gancho o en una cifra. Máscara de video con Vision (ver `pamela-erick-brand/scripts/roto_video.swift`, mismo proceso).
- Transiciones: zoom con blur (presets Motion Bro "Zoom IN/OUT"), glitch/distorsión corta, corte seco a placa blanca/negra, flash. Siempre con su SFX (whoosh, pop, hit), sutil.
- Usadas en Premiere: subtítulos con la herramienta de subtítulos (SyntheticCaption), presets Motion Bro (`~/Documents/Motion Bro/…`), SFX en `Herramientas Edicion/SFX`.

## 6. Música y audio
- Cama musical continua, moderna, con energía media (ej. "On a Mission", "Cafe Doorway" en `Herramientas Edicion/MUSICA`), más SFX en cada evento.
- Los entregados midieron −8,9 a −10,7 LUFS; mandan los niveles de `edicion-reels-base` (−11 LUFS, ≤ −1 dBTP).

## 7. Color de imagen
Natural, sin looks marcados. Fran graba mucho en exteriores luminosos (cielo azul, parque) e interiores claros: cuidar que el cielo y las paredes blancas no se quemen y emparejar tomas. Material de iPhone en HDR → pasar a SDR (`edicion-reels-base` regla 9).

## 8. Dosis según el estilo del video
| Estilo | Qué lleva |
|---|---|
| **Reel educativo a cámara** (15-08) | Título apilado de gancho, subtítulos, punch-ins, 1–3 placas blancas/negras, meme pop corto, B-roll real del material, música + SFX. El más "diseñado". |
| **Entrevista / testimonio del equipo** (35-08) | Encabezado en caja blanca fijo, subtítulos centrados entre los dos, presentación del nombre en Black, montaje de fotos-tarjeta con material de viajes y celebraciones. |
| **Selfie / opinión caminando** (11-07) | Casi solo subtítulos + 1 clip pop del tema + acotación meme. Liviano. |
| **Trend / meme** (10-07) | Texto fijo de trend, plano único, música del trend. Sin subtítulos. |
| **YouTube / VSL / charla (horizontal)** | Mismo sistema tipográfico en 1920×1080: títulos en la pared libre al costado de Fran, placas, fotos-tarjeta con el material vertical, botón animado si hay CTA. Detalle en la sección 11. |

## 9. Portadas
Analizadas 2026-10-07 sobre `11-07 FM Argentina` y 5 portadas de mayo (`assets/ref/portadas_mayo.jpg`):
- Foto: cuadro del video o del material (Fran en la locación, de cuerpo entero o medio cuerpo; o una imagen pop del tema, ej. Messi) con degradé oscuro arriba/abajo.
- Lockup de 2–3 líneas **MAYÚSCULAS**: línea blanca **Montserrat ExtraBold/Bold** + palabra-golpe en **amarillo `#FFC324`** Montserrat Black (o una condensada tipo Bebas/Anton en golpes de una palabra), interlineado muy apretado, sin caja.
- Muchas veces **con rotoscopia**: el golpe amarillo detrás de Fran ("3 RAZONES", "UN CAMBIO?", "VENDER").
- Ejemplos: "LOS AGENTES / PUEDEN APRENDER / **DE ARGENTINA**"; "FANÁTICOS DEL / **MULTITASKING**"; "¿HACE CUANTO NO HACES / **UN CAMBIO?**"; "ESTO TE HACE / **VENDER**"; "**COMPETIR** / POR QUIEN SOS".
- Proceso y verificación: `portadas-reels` (cuadrado central, primer frame). Portada horizontal (YouTube / VSL): sección 11.

## 10. Referencias analizadas
`references/piezas.md`: los 4 reels de julio/agosto 2026 que definen esta skill (10-07 Netflix, 11-07 Argentina, 15-08 propiedad extra, 35-08 Entrevista Aleja), con rutas, tiempos y qué recurso aparece en cada uno, más el primer horizontal aprobado (24-10 VSL webinar 2).

## 11. Video horizontal 1920×1080 (YouTube, VSL, landing de webinar)
Aprobado en **24-10 FM VSL webinar 2** (2026-10-23): VSL de 92 s para la página de gracias del webinar, Fran sentado a cámara frente a una pared gris con viga de madera. El editor entregó la base ya montada en `EXPORT/` (no se corta nada, regla de `edicion-reels-base`) y se sumó el acabado. Cambiar a horizontal **no cambia la identidad**: mismas fuentes, pesos, colores, placas y animaciones de las secciones 1–5; cambia la puesta en el cuadro.
- **Formato**: 1920×1080, 25 fps. Los márgenes de redes de `edicion-reels-base` (regla 1) son para vertical: en horizontal se usa una zona de títulos de ~96 px a los lados y ~54 px arriba/abajo, y nada importante en los ~100 px de abajo (controles del reproductor).
- **Títulos al costado de Fran, en la pared libre**: Fran suele quedar al centro-derecha (ojos en x ≈ 1040). Los títulos van centrados en **x ≈ 480, ancho máx. 700 px** (x 130–830), con el centro del bloque **a la altura de los ojos**, pegados a la cabeza sin tocarla, también con el punch-in (con 1,12× el borde de la cara llega a x ≈ 860). Mismo sistema: línea Medium + **un solo golpe Black MAYÚSCULA** + línea ExtraBold, palabra por palabra con desenfoque. Ejemplos aprobados: "¡FELICITACIONES! / estás a punto de / RESERVAR TU LUGAR", "REGALO #1 / **PROCESO DE LEADS** / compradores / Top Producer", "**ASESORÍA GRATIS** / con todo el equipo de / ELEVATE".
- **Subtítulos**: 54 px, pegados debajo del mentón (≈ y 690 con Fran sentado) y **centrados bajo la cara** (x de los ojos), no en x = 960. Se ocultan mientras hay título.
- **Placas a pantalla completa** con el título al centro (960, 540): negra `#222` ("por entrar al grupo / **3 REGALOS** / para darte") y blanca `#FDFDFD` con gris carbón ("clase en vivo · 7 PM / **MARTES 3** / DE NOVIEMBRE"). Sirven de respiro y tapan cortes.
- **El material de viajes es vertical: NUNCA agrandarlo para llenar el 16:9** (corrección del editor, 24-10: el skyline de Miami recortado y escalado "se nota que la agrandaste"; se reemplazó por placa blanca con el título). Se usa como **foto-tarjeta vertical** (450×800, sombra suave, entra subiendo 24 px) centrada sobre fondo blanco, con el subtítulo gris carbón ~34 px debajo. Dos tarjetas seguidas se encadenan con barrido. Si una frase pide pantalla completa y no hay material horizontal real, va placa con título.
- **Botón animado** cuando el texto pide una acción ("dale clic al botón, entrá al grupo"): píldora blanca con "INGRESAR AL GRUPO" en ExtraBold gris carbón, al costado de Fran, a la altura de los ojos. Entra con rebote, un cursor llega y hace clic en la palabra "clic", y al decir "reservado" pasa a píldora negra "✓ LUGAR RESERVADO". Es un elemento de interfaz: convive con los subtítulos.
- **Transiciones**: zoom con desenfoque (Fran ↔ tarjeta o placa) y barrido (tarjeta → tarjeta), 2–3 cuadros a cada lado, en cada entrada y salida de insert o placa (23 en 92 s). En este VSL el editor pidió **transiciones sin sonido**; quedaron solo un pop suave en cada título (−24 dB de pico) y el clic del botón.
- **Música**: cama corporativa / chill. Si la biblioteca no tiene una, se puede **generar** con `scripts/musica_corporativa.py` (92 BPM, Rhodes + pad + sub + batería suave, sin derechos): aprobada a ~12 dB bajo la voz (voz −12,7 / música −25 LUFS, master −11).
- **Portada / miniatura horizontal** (aprobada 2026-10-26, `PORTADA/24-10 FM VSL webinar 2.jpg`): 1920×1080 JPG con el frame que elige el editor, sacado del **material original a resolución completa** (`VIDEOS/`), con el color igualado a la captura del editor (la base trae corrección de Premiere). Es el sistema de la sección 9 en horizontal: lockup **alineado a la izquierda** en la pared libre, a la altura de la cara (bloque en x 120–877, y 369–629 con Fran sentado y la cara en x ≈ 950–1170): "ESTÁS A PUNTO DE" ExtraBold blanco / "**RESERVAR**" Black amarillo `#FFC324` (ancho del bloque, 770 px) / "TU LUGAR" ExtraBold blanco (~62 % del ancho), por línea de base y muy apretado, con sombra suave. El golpe termina **≥ 60 px antes de la oreja**. Sujeto recortado con Vision y más luminoso que el fondo (`portadas-reels` §4); degradé oscuro desde la izquierda detrás del texto (alfa 0,72) + suaves arriba y abajo. Nada en el rincón de abajo a la derecha (ahí YouTube pone la duración). No se inserta como primer frame: la miniatura se sube aparte. Script: `scripts/portada_horizontal.py`.
- Proyecto de Remotion de referencia: `remotion-elevate/src/fm2410/` (en la máquina de Tomi), con estas medidas.
