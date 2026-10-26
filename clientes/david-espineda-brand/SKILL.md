---
name: "david-espineda-brand"
description: "Marca y estilo de edición de David Espineda (DAE), SIMPLE Desarrollos / Premier Yacht en Asunción: Owners, subtítulos con resaltado navy, títulos celestes máquina de escribir, sin logo de SIMPLE (se nombra en texto), listas con cuadrado celeste y número solo. Usar junto con edicion-reels-base."
---

# David Espineda (DAE) — Marca para video

Reglas obligatorias (márgenes, cara, audio, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`**. Acá va solo lo propio del cliente. Assets (fuentes, logo, paleta, frames de referencia) en el repo `elevate-edicion/clientes/david-espineda-brand/assets/`.

- Cliente: **David Espineda**, desarrollador inmobiliario de **SIMPLE Desarrollos** en **Asunción, Paraguay**. Proyecto estrella: **Premier Yacht** (torre de balcones curvos, zona Mburicaó). Sigla de archivos: **DAE**.
- Voceros: David (a cámara, al aire libre, con micrófono de mano) y asesoras de SIMPLE (en la oficina, frente a la pared con el logo o recorriendo un depto vacío). Una de ellas es **Romina** (pelo recogido, aros dorados, remera negra con mangas bordadas; reel 15-10). En los subtítulos no hace falta nombrarlas.
- **Material propio para B-roll** (antes que el stock): `{CARPETA_CLIENTE}/01 REELS/10 OCTUBRE/08-10 DAE No te vendo la zona. Te cuento/VIDEOS/`. Ahí están los drones verticales de Asunción y el río (`DJI_…_0531_D.MP4`, 1080×1920; `DJI_…_0354/0359`, 4K vertical) y David sentado en un restaurante con remera amarilla (`08/20261008_14*.mp4`). En `{CARPETA_CLIENTE}/PARAGUAY /` hay dos drones de YouTube en 720p horizontal: recortados a vertical quedan pixelados, mejor no usarlos.
- Público y lugar: compradores e inversores de Paraguay y de Argentina que invierten en Asunción. **El stock tiene que parecer Asunción**: drones de la ciudad y del río Paraguay, barrios residenciales con mucho verde, renders del proyecto, obra en construcción. Nada que se lea Miami, Europa ni Buenos Aires.
- **Moneda: USD** (`USD 200.000` o "doscientos mil dólares", como lo diga el vocero).
- Tono: cercano, **voseo** ("querés", "escribís", "contame", "escribime"). Va así en subtítulos **y en los títulos que escribimos nosotros**. Errores típicos de Whisper: "Premier Yacht" (sale "Premier Yat" / "Primer Yacht"), "Mburicaó", "SIMPLE" en minúscula, "Lambaré" (sale "Lambarí"), "¿Solicitaste…?" (sale "Solicitó esta…"). Las preguntas que hace la asesora a un lead llevan los dos signos (¿…?) aunque Whisper las devuelva como afirmación.
- CTA habitual: "escribime / contame qué estás buscando" por WhatsApp o DM, a cámara.
- Carpeta: `{CARPETA_CLIENTE}/01 REELS/<MES>/<DD-MM DAE Título>/`. Las de octubre traen `VIDEOS/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/ EXPORT/ VOZ/`; las anteriores, `CRUDOS/ … LISTOS/`. El final va en `EXPORT/` (o `LISTOS/` si existe) con el nombre de la carpeta `.mp4`. Marca en `00 MARCA/` (paleta, `FUENTES/`, `LOGO/`). A veces el editor deja en `LISTOS/` una **base sin subs** ya montada (`<nombre>_BASE SIN SUBS.mp4`): se respetan sus cortes y solo se hace el acabado.
- **Portada: la hace el usuario** (2026-10-26, reel 15-10). No se genera. Le pasamos **2 frames del vocero sonriendo o con la boca cerrada**, en PNG a resolución completa y sacados del crudo (sin textos), en `PORTADA/`. Cuando la deja (`PORTADA/PORTADA OK/<nombre>.png` o `<nombre de la carpeta>.png` en la raíz, 1080×1920), va como **primer frame** con `portadas-reels/scripts/portada_primer_frame.sh` (misma cantidad de frames y mismo audio).
- Formato de las referencias: 1080×1920, **30 fps**, 31–46 s.
- **Logo de SIMPLE: no usarlo** (corrección del usuario, 2026-10-26, reel 15-10: "queda cortado, con solo mencionarlo está bien"). El PNG de la carpeta de marca (`00 IMAGEN DE MARCA/Simple Logo Principal Fondo oscuro.png`, navy + celeste sobre transparente) pasado a blanco sobre una placa navy se lee mal y parece recortado. Cuando se dice "Simple", va en el subtítulo en Black (`En *Simple* también`) o como texto en una placa ("al frente de **Simple**"). Esto reemplaza la regla del 2026-10-19 (placa del logo al mencionarlo). Sin placa final.

## 1. El manual vs. los videos
El manual es una paleta de Coolors, la familia Owners y el logo de SIMPLE. En los videos pasan el **navy** (caja de los subtítulos) y Owners. El **celeste de los títulos no está en la paleta**: sale del logo de SIMPLE. El azul eléctrico, la arena y el hueso quedan como secundarios: **se pueden usar, pero poco** (decisión del usuario, 2026-10-19).

## 2. Tipografía — Owners (+ The Seasons de acento)
- **Owners** es la que usan los proyectos (`Owners-Regular`, `Owners-Black`): Adobe Fonts, https://fonts.adobe.com/fonts/owners. Si no está activa, usar **Owners Text** (versión completa de Adobe Fonts, con tildes, ñ y ¿¡; Regular/Medium/Black en `assets/fonts/owners-text/`). El reel 15-10 se aprobó con Owners Text.
- ⚠️ En `00 MARCA/FUENTES/` está **OwnersTRIAL** (befonts): **no usarla**. Es de uso personal y **no tiene tildes, ñ ni ¿¡**.
- **The Seasons Bold** (serif, Adobe Fonts: https://fonts.adobe.com/fonts/the-seasons): solo para una palabra de acento. Puede haber una copia en la carpeta de marca de David Carballo (`00 MARCA/FUENTES/The Seasons/`), pero no todos los editores la tienen. Si no está, se avisa y el acento se hace sin serif. En el 15-10 se reemplazó por Black celeste con contorno navy ("de **alguien.**") y se aprobó.
- Interletrado apretado (≈ −2 %), interlineado de títulos ≈ 0,85–1,0: las líneas casi se tocan, pero sin pisarse (con Owners Text Black a 80 px hizo falta 1,0).
- En subtítulos, si la palabra clave lleva signo de apertura (¿, ¡), el signo va **en el mismo peso** que la palabra (`*¿Solicitaste*`): suelto en Regular queda fuera de la caja navy.

| Uso | Fuente / peso |
|---|---|
| Subtítulo base | Owners Regular |
| Palabra clave del subtítulo (verbo fuerte, cifra, "no", nombre del proyecto) | Owners **Black** |
| Palabra de acento en 2.ª línea ("vivir.", "inicial", "departamento", "Premier Yacht", "prefieras.") | The Seasons Bold, un poco más grande, blanca |
| Títulos-golpe, números de lista, "PREMIER YACHT" | Owners Black |
| Línea chica bajo un título ("que normalmente / van separadas") | Owners Regular + Black en la palabra clave |

## 3. Color
| Nombre | HEX | Uso en video |
|---|---|---|
| **Navy profundo** | `#0A1D38` | **Caja de resaltado de los subtítulos** al ~85 % de opacidad (en el frame se mide `#0C2B51`–`#162F54`). Barra de "PREMIER YACHT", placa del logo, tarjetas |
| Azul petróleo | `#003766` | Variante de la caja, fondos de placa |
| **Celeste SIMPLE** | `#349FE2` (del logo `#009EE2`) | **Títulos máquina de escribir**, "en Premier Yacht", cuadrados de numeración e íconos (medido `#2989C8`) |
| Blanco | `#FFFFFF` | Texto de subtítulos, números dentro de los cuadrados, títulos-golpe |
| Azul eléctrico | `#302FBA` | Secundario, poco uso |
| Arena dorada | `#D7B478` | Secundario, poco uso (algún detalle de lujo) |
| Hueso | `#E8E0D9` | Secundario, poco uso |

## 4. Sistema de texto y acabado
- **Subtítulos (el sello del cliente):** blanco, Owners Regular **~60 px** (altura de mayúscula ≈ 43 px), **1–3 palabras por bloque**, minúscula tipo oración, con la palabra clave en Black. Detrás, una **caja navy semitransparente pegada al texto** (alto ≈ 55–70 px, ~10 px de aire a los costados, esquinas rectas) que **entra como un resaltador de izquierda a derecha** en 3–5 frames. Si el bloque tiene 2 líneas, la caja puede ir solo en una (ej. "estás **mirando**" sin caja + "Premier Yacht" en serif con caja). Sin sombra fuerte. La posición la manda la base.
- **Títulos máquina de escribir:** celeste `#349FE2`, Owners Black, centrados, ~80–90 px; las letras aparecen una a una al ritmo de la voz (SFX de tecleo suave). Típicos en preguntas y en el nombre del proyecto: "¿Querés para vivir / o para invertir?", "¿Qué hago cuando / me escribís…?", "en Premier / Yacht". Mientras está el título, no hay subtítulo. Sobre ropa a rayas o fondos cargados, darle un **contorno navy** (~7 px, por detrás del relleno) para que se lea.
- **Rotoscopia (de vez en cuando):** el título-golpe pasa **por detrás** del vocero (mano, micrófono, hombros) o de un elemento del edificio. Ej.: "4 COSAS" en Owners Black blanco (con relleno de textura/brillo) detrás de la mano de David, con "que normalmente / van **separadas**" abajo. Que siempre se lea y nunca tape la cara.
- **Listas numeradas:** cuadrado celeste (~120 px) con **solo el número** en blanco Owners Black (sin "/5" ni total al lado: corrección del usuario, 2026-10-26), arriba del centro sobre el B-roll de cada punto, y el subtítulo pegado debajo. Entra con escala y un giro corto, con pop.
- **Opciones / contrapuntos** ("si me pedís que te llame, te llamo; si preferís que te escriba, te escribo"): tarjetas navy con ícono en cuadrado celeste, pregunta chica en Regular y respuesta en Black con la palabra clave en celeste, que se completan al decirse (aprobado en 09-10).
- **Nombre del proyecto:** "PREMIER YACHT" en Owners Black MAYÚSCULAS, blanco con contorno navy sobre barra navy; o "Premier Yacht" celeste pegado/trackeado al render del edificio.
- **Frase de cierre o golpe a cámara:** Owners Black blanco grande sin caja ("Forma parte de eso", "en **tus** tiempos,").
- **Animaciones simples (a veces):** pop o deslizamiento corto de títulos, cuadrados que entran con escala, el resaltado que se dibuja. Nada recargado.
- **Transición de la casa:** destello de luz (light leak naranja/rosa) entre bloques; en los cortes internos, un punch corto (zoom + leve desenfoque) anclado a los ojos.
- **Zooms y ritmo:** a cámara con punch-ins leves; B-roll cada ~1–2 s sobre la voz.
- **Escenas actuadas / agregadas por la vocera** (ej. 09-10: la asesora graba un audio de WhatsApp antes del guion): se separan visualmente del resto. Aprobado: **blanco y negro + viñeta + grano**, con una interfaz estilo WhatsApp (barra de "grabando audio" con punto rojo, contador y onda que sigue la voz, botón verde de micrófono) que al final se convierte en un audio enviado con doble check azul, y destello de luz que devuelve el color al entrar el hook. Esa parte también lleva subtítulos y **sin música** (solo voz, como un audio real).
- **Música y SFX:** fondo suave, corporativo/inspiracional; tecleo en la máquina de escribir y whoosh en los light leaks. Nivel: con un tema suave (ej. "Inspiration Is Inside You 2"), **~15 dB por debajo de la voz** — a −12 dB el usuario la pidió "un poco más baja" (2026-10-23, reel 09-10). El resto de los niveles, los de la base (las referencias están en −18/−19 LUFS: no copiar). La carpeta `MUSICA/` de los videos de DAE suele venir vacía: elegir de los temas de otros clientes y avisar cuál quedó.
- **Stock / B-roll:** primero los renders y las fotos de obra de Premier Yacht y los drones de Asunción del cliente; después stock genérico de negocios (llaves, dinero en USD, reuniones, firma) con gente latina. Si una frase lleva solo manos u objetos (llavero, celular, canilla, calendario), se evita el problema de que la gente no parezca local.
- **Cuando se nombra a David y se muestra un plano suyo, que hable mirando a cámara** (corrección del usuario, 2026-10-26: mirando al costado "queda raro"). Vale aunque se escuche la voz de otra persona: el tramo callado pero de perfil se descartó. Aprobado: `08/20261008_143048.mp4` desde 0,5 s. Debajo del mentón, **la tarjeta de su perfil de Airbnb** (captura que pasó el usuario: David Superanfitrión, 56 reseñas, 4,89 ★, 11 años como anfitrión; recortada con esquinas redondeadas, 690 px de ancho, top 860, pop desde abajo + zoom lento, sombra suave). Va cuando se habla de su experiencia como anfitrión o de la administración en Airbnb (corrección del usuario, 2026-10-26). Si no se habla de eso, placa navy "**David Espineda**" / "al frente de **Simple**".
- **Exposición:** las tomas con ventana al fondo (pasillo del depto del 15-10) dejan a la vocera oscura. "Subile un poco la exposición" quedó aprobado con `curves=all='0/0 0.15/0.22 0.4/0.52 0.75/0.84 1/1',eq=saturation=1.05` al convertir la toma: levanta sombras y medios sin quemar las paredes blancas.

## 5. Portadas
Las hace el usuario (ver arriba): nosotros le pasamos 2 frames y la ponemos como primer frame. Si alguna vez la pide hecha, analizar antes 4–5 publicadas según `portadas-reels` §0 y completar esta sección. Referencias:
- 09-10 (la mandó el usuario): título en 2 líneas centrado arriba de la cabeza, "Por qué te **mando** un **audio**" en celeste + "y no un **catálogo**" en blanco, Owners con palabras clave en Black, foto de la asesora con un degradé azul arriba.
- 15-10 (la hizo el usuario): Romina sonriendo frente a la pared, "**Alquilar** por días sin / vivir en **PARAGUAY**" en blanco y celeste, Owners con Black itálica en las palabras clave, degradé azul arriba.

## 6. Referencias aprobadas (REFERENCIA, no fórmula)
B y D usan la placa del logo de SIMPLE: desde el 2026-10-26 ya no va (ver arriba).
- **A. Reel institucional a cámara** — `09-09 DAE Formá parte de lo extraordinar/LISTOS/` (33 s): David al aire libre; hook con renders de la torre; "4 COSAS" con rotoscopia detrás de su mano; lista 1–4 con cuadrados celestes (seguridad, zona, todo resuelto, el río); "Eso **no** existía en esta **zona**"; "PREMIER YACHT" en barra navy sobre obra; drones del lote; cierre "Forma parte de eso".
- **B. Reel de asesora frente al logo** — `09-08 DAE Cuando escribís a Premier Yach/LISTOS/` (46 s): hook "alguna vez **consultaste**…" con stock de call center; placa del logo SIMPLE al decir "En Simple eso **no** pasa"; "Premier Yacht" celeste trackeado al edificio; preguntas en celeste máquina de escribir sobre renders; light leak; CTA "estás **mirando** *Premier Yacht* y **contame** qué estás **buscando**".
- **C. Reel de asesora en oficina (financiación)** — `05-08 DAE "Se puede financiar" — la preg/LISTOS/` (44 s): "¿Se puede i…" tipeado; "en Premier Yacht" celeste grande; "una **entrega** *inicial*", "pagando **en cuotas**" con B-roll de dinero, llaves y maqueta; grúas de obra al atardecer; CTA "escribime y te **paso**…".
- **D. Reel de asesora en oficina con intro actuada** — `09-10 DAE Por qué te mando un audio y no/LISTOS/` (31,7 s, Remotion, aprobado 2026-10-23): portada en el primer frame; intro de WhatsApp en B/N (ver §4) con placa del logo al decir "SIMPLE"; hook celeste máquina de escribir debajo de la cara; burbuja de audio arriba de la cabeza + burbuja de texto (líneas grises, sin texto inventado) que se tacha en "mensaje armado"; tarjetas "Te **llamo**." / "Te **escribo**."; golpe "en **tus** tiempos, / y **no** en los míos."; CTA con "como vos / *prefieras.*" en The Seasons. Música −15 dB bajo la voz, entra con el hook y la batería cae al arrancar el cuerpo.

- **E. Reel de asesora recorriendo un depto vacío (orgánico, a cámara + lista)**: `15-10 DAE Alquilar por días sin vivir en/EXPORT/` (34 s, 1019 frames, Remotion, aprobado 2026-10-26). Plantilla en `references/plantilla-remotion-15-10.tsx`. 9 tomas de Romina; se eligieron por texto exacto (la que dice "compraste al gilar" o "pensando comprar" sin "en", afuera) y por continuidad de lugar.
  - Hook: entra por la puerta 4B caminando hacia cámara (el arranque de la toma, la puerta abriéndose en silencio, se corta en la primera sílaba), "Si comprás para / alquilar por días" en celeste máquina de escribir, subtítulos navy y punch-in 1,18× anclado a los ojos en "Es **QUIÉN** / se ocupa...".
  - Cuerpo: "todas las / **SEMANAS**" sobre un calendario que pasa hojas. Lista 1–5 sobre B-roll de ~0,9–3 s por ítem (celular con publicaciones, celular con mensajes, llavero sin caras, ama de llaves con un almohadón, canilla). Dron propio del río en "si no estás en el país". "todo eso depende / de **alguien.**" bajo el mentón. "administración / en Airbnb" a máquina de escribir sobre una laptop. Placa de David. "más de / **10 AÑOS** / como anfitrión" con contador 1→10.
  - CTA: subtítulos bajo el mentón mientras camina hacia cámara y muestra las llaves; "Escribime" a máquina de escribir.
  - Acabado: light leak + whoosh en los 4 cambios de bloque, zoom con desenfoque + swipe en cada corte de B-roll, pop en títulos y números, tecleo (`SFX - Keyboard - 01`, una tecla cada 2 letras), sonido de mensaje en "responder mensajes". 58 SFX.
  - Audio: voz −12,5 LUFS por tramo; música "Talent in the Air" (Mixkit 473) **desde 77,5 s** para que termine sola con el video, −15,5 dB de ganancia (≈ 14–18 dB debajo de la voz) con hueco de −3 dB en 2,2 kHz; master −11,0 LUFS, −2,3 dBTP con `aac_at`.

## 7. Ideas que pueden sumar (opcionales, a criterio)
- Arena `#D7B478` en un detalle fino (línea, precio) en piezas de lujo, sin competir con el celeste.
- Mapa o pin animado simple para ubicar el proyecto en Asunción.

## 8. Correcciones del cliente
- 2026-10-19 (creación): logo de SIMPLE solo cuando se menciona a SIMPLE; voseo también en títulos; colores secundarios con poco uso; usar Owners completa, nunca la TRIAL.
- 2026-10-23 (reel 09-10): "¿Solicitaste información…" y "…Lambaré?" con signos de pregunta (Whisper lo daba como afirmación); música más baja (−12 → −15 dB bajo la voz con tema suave); la portada de la carpeta va en el primer frame. Aprobado el tratamiento B/N + interfaz de WhatsApp para la escena actuada.
- 2026-10-26 (reel 15-10): exposición del hook más alta (toma a contraluz); números de la lista solos, sin "/5"; sin logo de SIMPLE, solo nombrarlo; el plano de David tiene que ser hablando a cámara; la portada la hace el usuario (le pasamos 2 frames sonriendo o con la boca cerrada).
