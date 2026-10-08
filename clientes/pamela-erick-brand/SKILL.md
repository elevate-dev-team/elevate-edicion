---
name: pamela-erick-brand
description: Identidad visual y estilo de edición de los reels de Pamela y Erick (PYE), pareja de realtors en Orlando / Centro de la Florida (Haines City, Kissimmee, Tampa Bay). Son los clientes que mejor se graban, así que NO se usa stock. Los videos se hacen minimalistas, atrapantes y muy profesionales con lo que se agrega en edición: zoom-ins y zoom-outs, títulos animados, rotoscopia (títulos detrás del speaker, con un script de máscara de video incluido), efectos de sonido y transiciones. Tipografía Capitana con contraste fuerte de pesos (Light + Extrabold/Black), subtítulos blancos chicos a media altura sin caja, títulos y CTA en Capitana Black MAYÚSCULA blanca, más la referencia de cuatro formatos aprobados (reel a cámara de uno o de los dos, pauta recorriendo propiedad y "Ping Pong" de preguntas). Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Pamela y Erick / PYE / EYP (reels, pauta de propiedades, ping pong, portadas), o cuando el usuario diga "editá el video de Pamela", "video de Erick", "video de PYE", "con la marca de Pamela y Erick", aunque no mencione la skill.
---

# Pamela y Erick (PYE) — Marca y estilo de edición

Reglas obligatorias (márgenes, cara, voz, niveles, fin al terminar de hablar, ojos fijos en los punch-ins, título O subtítulo, SFX en cada evento, revisión): skill **`edicion-reels-base`**, siempre. Esta skill suma lo propio del cliente y **sube la vara del acabado**.

- Cliente: **Pamela y Erick**, pareja y socios, realtors en Orlando y alrededores (Haines City, Kissimmee, Tampa Bay). Pamela es la cara de la mayoría de los videos; Erick aparece en los de pareja y en los "Ping Pong". Siglas de archivos: **PYE** (las primeras pautas de junio usaron **EYP**; usar PYE).
- Tono: cercano, cálido, didáctico, de confianza ("Escríbenos", "tú"). Español neutro latino.
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM PYE Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/` (plantilla vacía en `01 REELS/000/`). El final va en la raíz del proyecto con el nombre de la carpeta + `.mp4`; la portada `.jpg` en `PORTADA/`.
- **Sin logo, sin watermark, sin end card ni placas de marca.**
- Formato: 1080×1920, **25 fps**. Duración típica 25–40 s orgánicos, 45–80 s pautas.

## 0. La idea del cliente (lo más importante)
Pamela y Erick son **los clientes que mejor se graban**: buena luz, casas nuevas y luminosas, varias locaciones por video, planos estables y buena dicción. Por eso:

- **No se usa stock.** Nada de bancos de imágenes ni YouTube. Todo lo que se ve es material de ellos (`VIDEOS/` del proyecto: tomas a cámara, recorridos, B-roll de su vida y de las zonas).
- Si una frase "pide" una imagen que no está en el material, **se resuelve con edición**, no con stock: un título animado, un zoom, una rotoscopia o un cambio de plano. Si de verdad hace falta una imagen, avisar al usuario para que consiga material real (no buscar stock por cuenta propia).
- El valor del video está en el **acabado**: zoom-ins y zoom-outs, títulos, animaciones, rotoscopia y SFX. Objetivo: **minimalista, atrapante y muy profesional**.
  - *Minimalista*: un solo elemento gráfico protagonista a la vez (más el subtítulo), mucho aire, todo blanco, nada de emojis, stickers, flechas, cajas de colores ni plantillas "de CapCut".
  - *Atrapante*: algo cambia cada ~2–3 s (encuadre, título, transición o sonido), y el gancho tiene movimiento, título y sonido en el primer segundo.
  - *Profesional*: todos los movimientos con easing y motion blur, ojos anclados en cada zoom, SFX sincronizados al pico, color parejo entre locaciones, tipografía bien espaciada y alineada.

## 1. Zoom-ins y zoom-outs (el motor del ritmo)
Siempre anclados a los ojos en los dos ejes (`edicion-reels-base` regla 4; landmarks con `eyes.swift`).

| Recurso | Cuándo | Cómo |
|---|---|---|
| **Punch-in de corte** (salto seco) | Corte dentro del mismo plano, frase clave, remate | Escala 1.0 → 1.25–1.5 en un corte, sin animación. Alternar: abierto → cerrado → abierto. No repetir la misma escala dos cortes seguidos. |
| **Zoom-in lento** (push-in) | Explicaciones de más de ~3 s, frases emotivas o de tensión | 1.00 → 1.06–1.10 durante todo el bloque, ease-in-out. Que no se note como efecto, que se sienta como cámara. |
| **Zoom-out** (pull-out / reveal) | Cambio de idea, mostrar el lugar, respiro después de un golpe | Arranca cerrado (1.2–1.3) y abre a 1.0 en 0,5–1 s con ease-out. Ideal al arrancar una locación nueva. |
| **Zoom-golpe animado** (snap) | Cifra, palabra-golpe, CTA | 1.0 → 1.15 en 4–6 cuadros con overshoot y asentamiento, + motion blur + SFX (hit / whoosh corto). Máximo 2–3 por video. |
| **Zoom de transición** | Cambio de locación (cocina → sillón) | Zoom-in rápido con desenfoque radial al final del plano A + zoom-out del mismo tipo al inicio del B (6–8 cuadros cada uno) + whoosh. |

- Cuidar la calidad: los originales son 1080 (o 4K si los entregan en 4K). Con material 1080, no pasar de 1.5× y mirar el detalle de la cara en el render.
- La caja de la cabeza manda: con zoom la cara crece, así que subtítulos y títulos se recalculan para ese encuadre.

## 2. Títulos y animaciones
Tipografía Capitana (sección 5). Siempre blancos, composiciones diseñadas (no palabra suelta estática).

- **Entrada estándar** (4–6 cuadros): escala 0.92 → 1.0 + desenfoque 8 px → 0 + opacidad 0 → 1, con ease-out. **Salida** más rápida (3–4 cuadros), desenfoque + opacidad.
- **Palabra por palabra** en títulos apilados: cada línea entra con un desfase de 2–3 cuadros siguiendo la voz.
- **Cifras que cuentan**: precios, años, metros ("$0 → $380.000", "0 → 10 AÑOS") en 12–18 cuadros con ease-out, terminando justo cuando la voz dice la cifra.
- **Golpe de mayúscula**: la palabra clave en Black entra 10–15 % más grande y se asienta (overshoot), con un hit suave.
- **Subrayado o trazo dibujado** blanco (2–4 px) bajo una palabra, en 8–10 cuadros. Como mucho una vez por video.
- **Título de gancho** en el primer cuadro (sirve de portada): "Ser pareja y socios al / **MISMO TIEMPO**".
- Título **O** subtítulo, nunca los dos (`edicion-reels-base` regla 10).
- Los fondos de ellos son **blancos y claros** (cocinas, paredes): un título blanco necesita **sombra suave más marcada** (blur 12–20 px, 35–50 %) y, si hace falta, un oscurecido sutil del plano detrás del título (viñeta o degradé al 15–25 %). Nunca caja.

## 3. Rotoscopia (títulos detrás del speaker)
El recurso más "premium" de la marca. Usarlo en el **gancho, una cifra-golpe o el CTA**, cuando el plano tiene aire arriba de la cabeza (planos medios en la isla de cocina, frente a la casa, de pie en el living). 1–3 veces por video, no más.

- Máscara del speaker cuadro a cuadro con Vision:
  `swift ~/.claude/skills/pamela-erick-brand/scripts/roto_video.swift <clip_1080x1920.mp4> <mascara.mov> [inicio_s] [dur_s] [suavizado]`
  (probado en el 17-08 de pareja: 3 s en ~7 s, bordes limpios con el pelo, máscara de los dos a la vez). Correrlo sobre el clip **ya recortado/zoomeado** tal como va en la composición.
- Componer: fondo → título → speaker recortado encima (`[clip][mascara]alphamerge` en ffmpeg, o el `.mov` como `<OffthreadVideo>` con `mix-blend`/máscara en Remotion).
- Título grande (Black MAYÚSCULA, 180–260 px) apoyado sobre la cabeza: **la persona tapa como mucho ~¼ de la palabra**; la palabra tiene que leerse completa. Si la tapa más, subir el título, achicarlo o cambiar de plano.
- Revisar el borde cuadro a cuadro en el render (manos que pasan por delante, vasos, reflejos en la mesada). Si el borde tiembla o "come" una mano, subir el suavizado (0.5) o no usar rotoscopia en ese plano.
- Variantes: el título entra desde atrás del speaker (escala + desenfoque), o el speaker "pasa por delante" de un dato en un plano caminando.

## 4. SFX y transiciones
Cada evento visual tiene su sonido (`edicion-reels-base` regla 10), **sutil**, por debajo de la voz y con el pico alineado al evento. Lista de archivos sugeridos: `references/biblioteca.md`.

| Evento | Sonido |
|---|---|
| Zoom de transición / cambio de locación | whoosh corto |
| Título que entra | pop o click suave (bajo) |
| Zoom-golpe, cifra, CTA | hit grave corto / bass suave |
| Antes del reveal del gancho | riser corto (≤ 1 s) |
| Glitch RGB | glitch corto o whoosh digital |
| Pasaje a blanco y negro | click / shutter de cámara |

- Transiciones propias de la marca: **glitch RGB** (3–6 cuadros), **zoom con desenfoque radial**, **flash blanco** (exterior → interior), **pasaje momentáneo a B/N** en el speaker para remarcar una frase.
- Nada de SFX cómicos (cartoon, bocinas, risas).

## 5. Tipografía — Capitana
18 OTF en `assets/fonts/` (también en `~/Library/Fonts/`, PostScript `Capitana-<Peso>`). Uso medido en los 40+ proyectos de Premiere:

| Uso | Peso |
|---|---|
| Relleno del subtítulo | **Light** (≈ 60 % del texto) |
| Palabra clave del subtítulo | **Extrabold** o **Black** |
| Acento (adjetivo, palabra emocional) | **Extrabold Italic** / Bold Italic / Semibold Italic |
| Títulos, cifras, precios, CTA | **Black**, MAYÚSCULAS |

La firma es el **contraste Light ↔ Black dentro de la misma línea** ("te hayas **movido**", "tu **salario**", "*descalificados*"). Interlineado apretado en los títulos apilados.

## 6. Color
Paleta oficial (`assets/PYE_Paleta.png`): dorado `#E6B56B`, marrón `#865D1F`, negro `#000000`, blanco `#FFFFFF`.
En los reels manda el **blanco** (subtítulos, títulos, precios, CTA). El dorado/marrón no se usa en video (vive en portadas de FB/WhatsApp y carruseles); como acento, solo el dorado en una palabra-golpe y consultando antes. La única caja es la **blanca** de las preguntas del Ping Pong (texto negro).
Corrección de color: piel natural, blancos limpios sin quemar (paredes y mesadas blancas), y el mismo look en todas las locaciones del video.

## 7. Subtítulos
- Blancos, sombra suave, **sin caja**. **1–3 palabras por bloque**, una línea, centrados en x = 540.
- **Chicos**: ~55–65 px de cuerpo. Discretos: el protagonista es el título.
- A la altura del pecho/hombros del speaker (y ≈ 850–900 sin zoom; recalcular con zoom); en planos de propiedad, al centro (y ≈ 900–960).
- Minúscula tipo oración, clave en Extrabold/Black, resto Light, acento ocasional en Extrabold Italic.
- Datos sueltos de pauta ("2.5 BAÑOS", "2072sqft", "$380.000") suben a Black, 100–140 px, con su animación de título.

## 8. CTA
"**ESCRÍBENOS**" en Black MAYÚSCULA **sólido** (nunca outline), ~150 px, arriba del speaker (o detrás por rotoscopia), con zoom-golpe + hit; bajada en subtítulo normal ("y **podemos** revisar").

## 9. Referencias aprobadas (NO son fórmula)
`references/piezas.md`: reel de Pamela sola, reel de pareja, pauta recorriendo propiedad y Ping Pong, con rutas y tiempos. Son lo ya entregado; la vara de acabado de las secciones 0–4 está por encima de esas piezas.

## 10. Audio
Cama musical continua (moderna, cálida, sin voces) + SFX de la sección 4. Masters entregados: −9 a −11 LUFS; mandan los niveles de `edicion-reels-base`. Música: catálogos CSV en `Herramientas Edicion/_INDICE`.

## 11. Portadas
Por defecto las hace el usuario; si las pide, se hacen con `portadas-reels` y este sistema (analizado 2026-10-06 sobre 5 portadas publicadas):
- **Foto:** cuadro del video (o foto del rodaje) en la locación del reel, luz natural, sujeto entero o de medio cuerpo; con `portadas-reels` §4 se aísla y se le da más luz que al fondo (degradé marrón casi negro `(22,15,9)`).
- **Lockup de 2–3 líneas, todo blanco, Capitana, sombra suave, sin caja:** bajada chica arriba (Semibold/Light, a veces Italic, ~55–65 px) **alineada a la izquierda del golpe** → golpe en **Black MAYÚSCULA** (2–4× más grande) → a veces una línea chica en **Extrabold/Bold Italic** **alineada a la derecha del golpe**. Interlineado muy apretado (las líneas casi se tocan).
- **Ubicación:** sobre el pecho, debajo del mentón, centrado en el sujeto y dentro del cuadrado 1080; nunca sobre caras.
- Ejemplos (`01 REELS/…/PORTADA/`): 17-09 "No todos los / **CRÉDITOS** / *son iguales*" (pareja en sillón); 20-09 "*El mejor* / momento para / **COMPRAR**" (escalera); 19-09 "*¿Cambiaste de trabajo?* / Esto es lo que el banco / **quiere ver.**"; 04-13 "Señales de que / ya estás listo para / **COMPRAR** / *tu nuevo hogar*" (casa); 17-08 "Ser pareja y socios al / **MISMO TIEMPO**" (isla de cocina).
- Hecha por Claude: 11-09 "*¿Cuánto es el* / **PAGO** / *mensual?*" (Semibold Italic 52 / Black 190 / Extrabold Italic 68) sobre la foto que **eligió el usuario**: Pamela de cuerpo entero en el pasillo con las manos en corazón (cuadro del final de una toma, fuera del montaje). El texto entra justo entre el mentón y el gesto de las manos; zoom 1,35 sobre el 4K. Script en `11-09 …/PROYECTO/claude/portada/portada.py`.
