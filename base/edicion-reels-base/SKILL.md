---
name: edicion-reels-base
description: Reglas base obligatorias para editar cualquier video vertical (reels, TikTok, Shorts, pauta) de cualquier cliente de Elevate — márgenes de seguridad de redes, no tapar nunca la cara del speaker, voz siempre presente, terminar cuando termina de hablar, legibilidad, subtítulos sincronizados por alineación forzada y centrados sobre B-roll, hook desde la primera sílaba, cortes con motivo, audio (cadena de voz calibrada por toma, música según la densidad del tema, SFX con el pico alineado, master -11 LUFS con aac_at), cortes al ritmo con la grilla de beats medida, zooms anclados a los ojos, transiciones y SFX en el acabado, stock sin audio ni marcas de agua, tramos en off con la información centrada, portada hecha con la skill portadas-reels y puesta como primer frame del video, y revisión antes de entregar. Solo reglas, no estética. Usar SIEMPRE que el usuario pida editar, montar, subtitular o animar un video, aunque no lo mencione; si existe una skill de marca del cliente (ej. yanira-team-brand), aplicar ambas, y para la portada cargar portadas-reels.
---

# Reglas base de edición de video (todos los clientes)

Estas reglas **no son decisiones estéticas**: se cumplen siempre. Cómo se cumplen (layout, estilo, animaciones, formas de evitar la cara, paleta, tipografía) se decide en cada video según el contenido, la marca del cliente y lo que pida el usuario. No repetir por defecto las soluciones visuales de videos anteriores.

## 0. Rutas de cada máquina
Las skills se comparten entre editores (repo `elevate-edicion`) y cada uno guarda su material en lugares distintos y no tiene los mismos archivos. Por eso las rutas se escriben con **marcadores** que se resuelven con `~/.claude/elevate/config.json` (lo crea la skill `configuracion-inicial`):

| Marcador | Qué es | Clave en `config.json` |
|---|---|---|
| `{CARPETA_CLIENTE}` | carpeta del cliente del video | `clientes.<skill>.carpeta` |
| `{CLIENTES}` | carpeta que contiene a todos los clientes | `rutas.CLIENTES` |
| `{HERRAMIENTAS}` | biblioteca de edición (música, stock, catálogos `_INDICE/`) | `rutas.HERRAMIENTAS` |
| `{SFX}` / `{SFX_ENVATO}` | bibliotecas de efectos de sonido | `rutas.SFX` / `rutas.SFX_ENVATO` |
| `{MUSICA}` / `{STOCK}` | música y stock si están fuera de `{HERRAMIENTAS}` | `rutas.MUSICA` / `rutas.STOCK` |

- **Al empezar cualquier tarea, leer `config.json`.** Si no existe, cargar la skill `configuracion-inicial` antes de seguir.
- Una clave en `null` o una ruta que no existe significa que **ese editor no tiene ese recurso**. No es un error: avisarle y usar una alternativa (otra biblioteca configurada, material propio del cliente, motion en lugar de stock), nunca inventar una ruta. Si una skill de cliente menciona un archivo puntual (una canción, una pieza de referencia) que el editor no tiene, decírselo y pedirle algo equivalente.
- Las skills se referencian como `~/.claude/skills/<skill>/`. Nunca escribir en una skill rutas absolutas de una máquina puntual: siempre marcadores.

## 1. Márgenes de seguridad de redes sociales
En 1080×1920, todo texto, subtítulo, gráfico, logo o dato va dentro de la zona segura:

| Borde | Margen libre | Qué lo tapa |
|---|---|---|
| Arriba | 270 px | nombre de cuenta, "Reels", cámara, barra de estado |
| Abajo | 480 px (contenido hasta y = 1440) | caption, usuario, audio, CTA de anuncios, barra de progreso |
| Izquierda | 70 px | bordes y gestos |
| Derecha | 180 px (contenido hasta x = 900) | like, comentar, compartir, guardar |

- Zona segura: **x 70–900, y 270–1440** (830×1170).
- **Centrar SIEMPRE respecto del cuadro completo (1080×1920): centro horizontal x = 540, centro vertical y = 960. NUNCA respecto de la zona segura** (x = 485 deja todo corrido a la izquierda y "se nota", corrección del usuario, 2026-10-04, reel MH 11-10). La zona segura solo limita hasta dónde puede llegar cada elemento: un bloque centrado en x = 540 tiene que entrar en x 180–900 (ancho máx. 720 px); si es más ancho, se achica o se parte en líneas, no se corre el centro.
- El centrado vale también para el **reel completo**, no solo para los títulos: tarjetas, paneles, checklists, subtítulos sobre B-roll y cualquier gráfico centrado van en x = 540 (y = 960 cuando el bloque va centrado en vertical) — confirmado por el usuario 2026-10-04, reel PAO 09-09.
- **La alineación se calcula sobre el ESTADO FINAL de la animación, no sobre el inicial** (corrección del usuario, 2026-10-04, reel PAO 09-09: "muchas veces hacés animaciones que van creciendo y empiezan alineadas pero terminan muy abajo, muy arriba o muy a la derecha"). Un panel que crece ítem por ítem, una lista que se va armando, un texto que entra deslizándose, un contador que cambia de ancho: se mide la caja del **último frame visible** (tamaño completo, todos los ítems, sin offset de entrada ni rebote) y esa caja es la que queda centrada / pegada a la cara / dentro de la zona segura. El arranque puede no estar alineado; el resultado sí. Para calcularlo, componer primero el estado final, medir su bbox, fijar el ancla (centro o borde que corresponda) y animar hacia esa posición. Verificarlo en el render con una captura del final de cada animación, no del principio.
- Fondos, video y texturas pueden ocupar todo el cuadro; la información no.
- Ningún elemento puede salirse ni siquiera durante su animación de entrada o salida en el estado final.
- **Pauta (anuncios de Meta):** el margen inferior sube a **670 px (35 %, recomendación de Meta para anuncios)** → contenido hasta **y = 1250**; zona segura de pauta **x 70–900, y 270–1250**. En anuncios la franja de abajo la tapan el texto principal, el nombre y el botón de CTA.

## 2. Nunca tapar la cara del speaker
- Ningún gráfico, título, subtítulo, logo ni transición puede cubrir la cabeza (pelo, cara, mentón).
- Vale también **durante los movimientos**: si la cámara o el encuadre cambian, los elementos no pueden cruzar la cara mientras se mueven (sacar el título antes de que arranque el movimiento).
- Tener en cuenta los zooms: con más zoom la cara crece y se mueve.
- Verificarlo con datos reales de la posición de la cara (detección facial) cuando haya animaciones cerca de ella, no a ojo. La caja de la cabeza incluye un margen debajo del mentón. Descartar detecciones falsas aisladas (un solo cuadro que toma un objeto del fondo como cara) antes de sacar conclusiones.
- Tampoco se tapan las caras de la gente que aparece en el stock o B-roll: si un subtítulo cae sobre una cara, se reencuadra el clip o se mueve el texto.

## 3. Audio: voz siempre presente
El audio es la mitad del video (palabras del usuario). Cada corrección nueva de audio se suma a esta sección.

### 3.1 Música vs. voz — depende de la DENSIDAD del tema
La voz manda, pero la música **se tiene que escuchar**. No hay un número fijo: el enmascaramiento depende de cuánta energía tiene el tema en la banda de la voz (1–4 kHz).
- **Tema suave / instrumental liviano** (lounge, house suave, piano): música **~12 dB por debajo de la voz** (LUFS integrados de cada una, medidos por tramo). Con 18–20 dB "prácticamente no se escucha" (corrección del usuario, 2026-09-30).
- **Tema denso** (pop comercial, EDM, mucho medio, voces/sintes al frente): a −12 dB "está muy fuerte, tapando prácticamente la voz" (corrección del usuario, 2026-10-02, reel LIU 03-10). Aprobado: **−20 dB debajo de la voz + hueco de EQ en la música mientras se habla** (`equalizer=f=2200:t=o:w=1.6:g=-6,equalizer=f=350:t=o:w=1:g=-2`).
- Cómo hacerlo: dos copias de la música (con hueco de EQ para los tramos hablados y limpia para los tramos solo música), cruzadas con `volume=...:eval=frame` en los cambios de sección. En un **tramo solo música** (cuerpo musical sin voz) la música va al frente, al nivel de la voz.
- Ante la duda con un tema nuevo, empezar en −16 dB y escuchar/medir; avisar al usuario qué nivel quedó.

### 3.2 Cadena de voz (orden y por qué)
Corrección del usuario (2026-10-02): "las voces se sienten muy enterradas todo el tiempo". La causa era la **cadena**, no el nivel:
- Un micrófono corbatero (lav) de celular puede llegar **muy bajo (−40/−43 LUFS, picos −20 dBFS)**. Con un compresor con umbral −24/−26 dB, **el compresor no actúa** y la voz sale sin comprimir (el rango dinámico hasta sube).
- `afftdn=nf=-25` (piso de ruido fijo) **se come la voz** cuando la voz está cerca o debajo de ese nivel: le saca cuerpo y presencia → suena "enterrada".

Cadena aprobada, **por tramo/toma** (cada toma tiene su nivel y su ruido):
1. **Ganancia previa** hasta ~**−20 LUFS** (medir el LUFS de la voz cruda del tramo).
2. `highpass=f=90`.
3. **Reductor de ruido con el piso REAL**: medir el ruido en una pausa (`volumedetect` de 0,3–1 s sin voz, después del highpass), sumarle la ganancia previa y usar ese valor: `afftdn=nr=10:nf=<piso medido>:tn=1`. Nunca un `nf` fijo.
4. EQ de presencia: `equalizer=f=250:t=o:w=1.2:g=-2.5,equalizer=f=3200:t=o:w=1.4:g=3,highshelf=f=9000:g=1.5`.
5. Compresión en dos etapas: `acompressor=threshold=-24dB:ratio=3.5:attack=5:release=90:makeup=4,acompressor=threshold=-14dB:ratio=2.5:attack=3:release=60:makeup=1` + `alimiter=limit=0.5:level=disabled`.
6. Ganancia final para dejar la voz en **−12 LUFS** en cada tramo (así hook, cuerpo hablado y CTA suenan parejos aunque vengan de tomas distintas).
- **Tomas saturadas / clipeadas** (corrección del usuario, 2026-10-02, RIS 05-09: "el hook está muy saturado"; la vocera grabó con ganancia alta, fuerte y cerca del mic): contar muestras en 0 dBFS de la voz cruda de cada toma. Si hay: (a) decodificar el AAC del video en **coma flotante** (`-c:a pcm_f32le`, recupera picos > 0 dB que el WAV de 16 bits corta), (b) `adeclip` para reconstruir los picos, (c) en esa toma **sin realce de presencia** (al revés: bajar ~3 dB en 3 kHz y ~2 dB en 5,5 kHz) y **una sola compresión suave** (ratio 2), porque ya viene comprimida.
- **Toda la cadena en float (`pcm_f32le`) y el limitador DESPUÉS de la ganancia final**: subir la voz a −12 LUFS después de un limitador y guardar en WAV de 16 bits recorta los picos de nuevo y suena saturado. Verificar en la voz procesada: 0 muestras en ≥ 0,999 y pico ≤ −1 dB.
- **La cadena retrasa la voz ~27 ms** (afftdn + limitador; medido por correlación de envolventes en las 5 tomas del reel PYE 11-09, idéntico en todas). Al cortar la voz procesada con los tiempos del video, leerla desde `inicio + 0,027` s, o la boca queda adelantada y los cortes caen corridos. Medirlo si cambia la cadena.
- **Montar la voz por tramos sin perder audio** (corrección del usuario, 2026-10-27, AP 09-09: "hay muchos momentos donde el audio no está" — 7 huecos de 1 a 4 s al final de los tramos): cortar cada tramo de la voz procesada con `atrim=start=<s>:duration=<d>,asetpts=PTS-STARTPTS` (o con `-ss` ANTES de `-i`) y recién después aplicar los fundidos. Con `-ss` como opción de salida, `afade=t=out:st=<d−0,012>` toma el tiempo de la toma original: silencia el final del tramo, o el tramo entero si arranca después de `st`.
  - **Verificación obligatoria:** `ffmpeg -i voz_montada.wav -af silencedetect=n=-45dB:d=0.35 -f null -` → solo pueden aparecer las pausas dejadas a propósito. No medir los huecos con un piso por percentil: en una voz ya comprimida el percentil 10 es habla y los silencios pasan como "pausas normales" (así se escapó en 09-09).
- **Verificación obligatoria:** el **LRA de la voz tiene que BAJAR** después de la cadena (03-10: 3,9 → 2,0 LU y 4,1 → 1,2 LU). Si sube o queda igual, el compresor no está trabajando: revisar la ganancia previa.
- Si dos tomas tienen distinto ruido de fondo (exterior vs. interior), cada una lleva su propio piso; avisar si el timbre no se empareja.

### 3.3 SFX
- Por debajo de la voz, nunca encima de una palabra importante; alinear el **pico** del archivo con el evento visual (medirlo). Los mp3 de la biblioteca tienen colas rotas: convertir a WAV antes de mezclar.
- Densidad aprobada en reels con mucho movimiento: ~**35 SFX en 57 s** (whoosh/swipe en cada corte y transición, pop en cifras y títulos, "check" en listas, riser que llega con su pico al drop). Con 18 dijo "faltan sfx" (2026-10-02).

### 3.4 Master y export
- Master final **−11 LUFS integrados, pico ≤ −1 dBTP**. Nunca entregar masters sobrecomprimidos (ej. −7 LUFS).
- Con la voz ya comprimida y nivelada, llegar al master con **ganancia lineal + limitador suave** (`volume=<dB>,alimiter=limit=0.84:attack=1:release=80:level=disabled`). `loudnorm` con picos sin controlar cae a modo dinámico o aplasta la voz contra la música: no usarlo como "arreglo" de una voz mal comprimida.
- **True peak de notas de voz / audios de WhatsApp** (RIS 03-09, 2026-10-07): el AAC del teléfono trae agudos que dan sobrepicos entre muestras (+0,2 dBTP con el pico de muestra en −1,9 dB). Arreglo: `lowpass=f=8000` en esa voz y el limitador del master sobremuestreado (`aresample=192000,alimiter=…,aresample=48000`) → −1,8 dBTP en el mp4.
- **Encoder AAC: `aac_at` (Apple, en Mac)**, no el `aac` nativo de ffmpeg: el nativo genera sobrepicos de hasta +2 dB (mezcla en −1,8 dBTP → +0,3 dBTP en el mp4). En Windows `aac_at` no existe: con el `aac` nativo, dejar la mezcla con más margen (limitador más bajo) hasta que el mp4 mida ≤ −1 dBTP. Medir siempre el true peak del **mp4 final** (`ebur128=peak=true`), no solo del WAV.
- Medir cada tramo por separado (hook / cuerpo / CTA) e informar los números al entregar; decir que no se pudo escuchar en tiempo real.

## 4. Estructura
- **El video termina cuando el speaker termina de hablar**: sin placa final ni end card, salvo que el usuario la pida.
- **Portada en el primer frame** (pedido del usuario, 2026-10-05, PAO 10-09): todo reel se entrega con su portada, hecha con la skill **`portadas-reels`** (cargarla aunque el usuario no pida la portada aparte; la estética sale de la skill de marca). En el export final la portada **reemplaza el frame 0** (no se agrega un frame: misma duración, mismos frames, mismo audio) con `portadas-reels/scripts/portada_primer_frame.sh`. El cuadro base de la portada sale del arranque del video para que el paso al frame 1 no salte. **Excepción:** si la skill de marca dice que la portada la hace el usuario (hoy `matias-heras-brand`, `pamela-erick-brand` y `angel-perez-brand`), no se genera salvo que la pida: se le pasan 2 frames del video para armarla (`portadas-reels` §7) y, cuando la deja en `PORTADA/`, se inserta igual como frame 0.
- **El hook arranca en la primera sílaba** (nada del arranque de la grabación antes de hablar). Ubicar ese arranque con la energía de la voz, no con Whisper (puede estar ~1 s corrido).
- **Cortes de cada toma precisos al habla** (corrección del usuario, 2026-10-04, reel MH 11-10: "hay muchos segundos detrás o delante"): cada toma entra **~0,03–0,05 s antes de la primera sílaba** y sale **~0,05 s después de la cola de la última palabra**; en la unión entre tomas el silencio total queda en **~0,05–0,15 s**. Cómo medirlo:
  - La energía sola engaña: en selfies, el ruido de agarrar/mover el celular al empezar y terminar la toma supera el umbral de voz (en 11-10 hubo hasta 1,3 s de ruido "como voz" antes de la primera palabra y 0,75 s después de la última).
  - Usar la **alineación forzada** (`alinear.py`) del texto de cada toma para saber dónde está la primera y la última palabra, y la **energía** para ajustar el borde fino (el ataque de la primera sílaba y la cola de la última; MMS suele cerrar la última palabra antes de tiempo).
  - Ante la duda, transcribir aislado el pedazo dudoso: si Whisper devuelve "Gracias por ver el video", "Suscríbete" o "¡Hola!", ahí **no hay voz** (alucinación sobre ruido).
  - Verificar después del montaje: medir el silencio en cada unión de la voz montada y que ninguna unión arranque con la voz ya encendida (eso es una sílaba comida).
- **Hook quirúrgico:** se deja todo lo que dice, incluida la frase final completa (no cortarla de golpe), y se sacan solo silencios largos y muletillas ("nada", "bueno", "ok"…), cortando al final de una frase. Cada corte en el mismo plano se disimula con un punch (ver abajo). Nunca cortes que dejen el hook incomprensible.
- **Cada corte tiene un motivo** (cambio de idea, de persona, un B-roll que ilustra lo que se dice). Cortes rápidos sin motivo "se sienten ruido", aunque la referencia corte rápido. No usar recorte automático de silencios dentro de una respuesta: todo corte de audio cae en un cambio de plano o debajo de un B-roll. Planos de B-roll de ~2 s o más.
- **Cortes al ritmo de la música (tramos musicales):** cada corte cae EXACTO en un tiempo (cada 2 o 4 tiempos; el primer corte del tramo en el drop). **Nunca usar el BPM del catálogo de música: medir la grilla real** con `<python del entorno align> scripts/grilla_beats.py <tema> <desde> <hasta>` (tempo + fase sobre el bombo, error ±10 ms). En el reel LIU 03-10 el catálogo decía 120 BPM y era 118,0: los cortes se corrieron ½ tiempo en 19 s y el usuario dijo "cortás en cualquier lugar". Después del render, verificar con detección de escena (`select='gt(scene,0.15)'`) que cada corte cae a < ½ frame de la grilla.
- **Hook largo de un solo plano a cámara** (más de ~10 s): "se siente muy largo" (2026-10-02). Romperlo con **zooms constantes in/out + punch-ins** entre frases (regla de los ojos abajo) y, si enumera cosas que se pueden mostrar (ambientes, características), **B-roll de esas cosas por encima de la voz continua**, cada uno con su título animado. Usar primero las tomas que no entran en el cuerpo.
- **Fotos:** evitarlas; si no queda otra, siempre con movimiento (zoom in/out o paneo suave), nunca estáticas.
- Cortar silencios y respiraciones largas sin que se noten los saltos, **salvo que el usuario entregue el video ya montado**: en ese caso se respetan el orden y la duración, y no se corta nada que no pida.
- **Zoom / punch-in en el speaker (cambio de encuadre del mismo plano): los ojos quedan en el mismo punto de la pantalla antes y después del corte, en los DOS ejes (x e y)**, para que el salto se sienta limpio (el zoom "crece" desde los ojos). Tolerancia ±5 px.
  - Se mide con landmarks, no a ojo: `python scripts/ojos.py <video> <t1,t2,…>` (Windows y Mac; OpenCV) o, solo en Mac, `swift scripts/eyes.swift <video> <t1,t2,…>` (Apple Vision) dan la posición de los ojos. Rutas relativas a la carpeta de esta skill. El recorte del plano cerrado se calcula despejando x0/y0 para que los ojos caigan en el mismo (x, y) que en el plano anterior, y se verifica en el export.
  - **Cara chica, a contraluz o con lentes/anteojos de sol** (speaker lejos, gran angular): `eyes.swift` y `ojos.py` fallan casi siempre. Usar `scripts/track_cara.swift` (solo Mac; persona → recorte de la cabeza ampliado → cara + ojos; 100 % de frames detectados en el reel LIU 03-10, donde eyes.swift no detectó ninguno). Corre por frame (`<video> <t0> <t1> 30`), sirve para el tracking y para verificar el export.
  - **Zoom continuo anclado a los ojos** (speaker que camina, zoom in/out constante): con el ojo del frame en (ex, ey) de la fuente y escala s, recorte `x0 = ex·(1−1/s)`, `y0 = ey·(1−1/s)`, ancho `W/s`. Los ojos quedan en pantalla en el mismo punto que a 1× para CUALQUIER s → los punch-ins y los zooms continuos cumplen la regla solos, y el recorte nunca se sale del cuadro. Suavizar el tracking poco (mediana 3 + media 5 frames): más suavizado se atrasa cuando se mueve rápido y descalza los cortes. Al verificar un corte, descontar el movimiento propio del speaker entre dos frames consecutivos (caminando lateral, ~7 px en pantalla).
  - Material 4K vertical (2160×3840) → 1080×1920: hasta 2× de zoom sin perder definición; 2,5–2,75× todavía aceptable en celular.
  - Si mantener el punto exacto haría que el recorte se salga del cuadro, corte la cara o la saque de la zona segura (a lo largo de todo el plano, ya que el speaker puede moverse), se usa **la posición válida más cercana** a ese punto, priorizando la altura de los ojos.
  - Si con el punch la cabeza crece tanto que el subtítulo ya no entra debajo del mentón sin salirse de la zona segura (pasa sobre todo en pauta, con el límite en y = 1250), se achica o se saca el punch. La otra salida es subir los subtítulos por encima de las cabezas, si el plano tiene lugar.

### 4.1 Trabajo por etapas cuando armo la estructura
Aplica **solo cuando yo tengo que armar la estructura** del video: varias tomas crudas, elegir entre tomas, voz en off más B-roll, reordenar o armar un hook/CTA con material suelto. Pasar a cada etapa solo con el OK del usuario:
1. **Guion de edición**: qué tomas elegí y por qué (con alternativas), qué descarté (errores, repeticiones, arranques en falso), qué clip va sobre cada frase.
2. **Estructura**: el video solo con los cortes (tomas elegidas, voz limpia, B-roll en su lugar), **sin** subtítulos, títulos, música, SFX ni motion. Exportarlo (puede ser en baja calidad) para revisión.
3. **Acabado**: con la estructura aprobada, sumar subtítulos, títulos, motion, zooms, música, SFX y mezcla. No cambiar los cortes aprobados sin avisar.

Si el usuario pasa **un solo video ya cortado** o con la estructura resuelta (solo hay que limpiar silencios y hacer el acabado), no hacen falta estas etapas: se edita directo.

### 4.2 Tramos de voz en off o pantalla en negro (motion, stock)
- Antes de renderizar, mandar una **propuesta corta**: qué va sobre cada frase (animación, stock o combinación). Esperar el OK.
- **La información va centrada** (en el cuadro completo, x = 540; ver regla 1). Gráfico y subtítulo forman **un bloque centrado**, con el subtítulo **pegado debajo del gráfico** (~50 px) y **a la misma altura en todo el tramo** para que no salte. Nunca el gráfico arriba y el subtítulo lejos abajo.

## 5. Legibilidad
- Subtítulos: bloques cortos (2–3 palabras), dentro del ancho seguro, siempre legibles sobre el fondo.
- **Sincronía exacta**: cada bloque aparece cuando empieza a decirse su primera palabra (con ~0,04 s de adelanto), no antes ni después. **Whisper sirve para saber QUÉ se dice, no CUÁNDO** (sus tiempos por palabra se corren 0,3–1,4 s). Los tiempos salen de una **alineación forzada** del texto conocido contra la voz final, cruzada con los **arranques reales de voz** (energía):
  - `<python del entorno align> scripts/alinear.py <voz16k.wav> <tramos.json> <salida.json>` (Mac: `~/venvs/align/bin/python`; Windows: `%USERPROFILE%\venvs\align\Scripts\python.exe`; instalación en el encabezado del script) (torchaudio MMS_FA, español + inglés, CPU). Se alinea tramo por tramo; donde el puntaje sale bajo (<0,5: ruido, idioma mezclado, texto dudoso), se decide con los arranques de `scripts/onsets.py` y transcribiendo cada bloque de voz aislado.
  - Si un arranque real de voz cae a < 0,2 s del tiempo alineado, el bloque se clava a ese arranque.
- **Posición de los subtítulos:**
  - Con el que habla **a cámara**: **SIEMPRE lo más cerca posible de la cara, sin taparla** (corrección del usuario, 2026-10-02 — vale para todos los clientes y pisa la altura fija que diga una skill de marca): el subtítulo va pegado debajo de la caja de la cabeza medida con detección facial (caja con margen bajo el mentón + ~15–20 px de aire), tomando el punto más bajo que alcanza la cabeza durante todo el bloque (zooms y punches incluidos), dentro de la zona segura. Nunca a una altura fija lejos de la cara.
  - Sobre **B-roll / imágenes superpuestas** mientras alguien habla: **lo más centrado posible** (x = 540, y ≈ 960, centro del cuadro completo) sin tapar ninguna cara; si hay una cara en el centro, correrlo lo mínimo hacia arriba o abajo (buscar desde el centro hacia afuera). Si un bloque cruza un corte, manda el plano que ocupa la mayor parte del bloque.
- Tamaños mínimos en 1080×1920: ~30 px datos secundarios, ~36 px texto, ~54 px titulares.
- Si un título dice lo mismo que el subtítulo, se oculta el subtítulo en ese momento.
- **Interlineado apretado** en títulos y bloques de varias líneas (~0,85 del cuerpo), sin que los contornos o trazos de una línea toquen la otra.

## 6. Contenido y veracidad
- Cifras ilustrativas se marcan como "Ejemplo"; promesas financieras o de programas llevan disclaimer ("Sujeto a calificación…").
- Si la voz habla de precios o montos sin decir la cifra, **se muestran ocultos** (desenfocados, en barras o con "$" y dígitos ilegibles). No se inventan números.
- Todo dato, texto o claim que no dijo el speaker (programas, montos, mensajes simulados) se **informa al usuario para que lo apruebe** al entregar.

## 7. Revisión antes de entregar
- Render de revisión con guías (zona segura + zona de la cara) y hojas de contacto a lo largo de todo el video.
- Chequear: nada fuera de la zona segura, nada sobre la cara (incluidas transiciones), textos legibles, duración = fin del habla.
- Audio (regla 3): voz montada sin huecos (`silencedetect`, regla 3.2), LUFS de la voz por tramo, LRA de la voz antes/después (tiene que bajar), música vs. voz por tramo, true peak del **mp4** final. Cortes musicales contra la grilla de beats (detección de escena).
- Portada (skill `portadas-reels`): cuadrado 1080×1080 y márgenes medidos con `medir_texto.py`, y en el mp4 final frame 0 = portada, frame 1 = video, misma cantidad de frames.
- Al entregar, informar qué se verificó y cómo; si algo no se pudo verificar (ej. escuchar en tiempo real), decirlo.

## 8. Marca del cliente
- Usar el manual de marca del cliente como guía (colores, tipografías, logo), reinterpretado para video. No como plantilla literal.
- Si el cliente tiene su propia skill de marca, sus reglas se suman a estas.
- Portadas: reglas de formato y proceso en `portadas-reels`; tipografías, colores y sistema de títulos de la portada, en la skill de marca.

## 9. Stock y B-roll
- **El stock va siempre sin audio**: se le quita al convertirlo, se silencia en la composición y no entra en la mezcla. En el video solo suenan la voz, la música y los SFX elegidos.
- **Sin marcas de agua ni logos a la vista.** Se puede usar material de YouTube u otras fuentes, siempre que en el encuadre final no se vean marcas de agua, logos del canal ni placas. Al escalar o recortar (ej. un dron horizontal pasado a vertical), la marca de las esquinas suele quedar afuera. Verificarlo con capturas del recorte final a lo largo de todo el tramo usado: a veces el logo cambia de lugar o aparece en la intro, la placa de cierre o en carteles del video.
- **Primero el material propio.** Si en `VIDEOS/` del proyecto hay tomas del rodaje que acompañan la frase (el barrio, la casa, el lugar), van antes que el stock genérico.
- **El stock tiene que parecer del lugar del cliente** (corrección del usuario, 2026-10-02). Antes de elegir stock, tener claro de qué ciudad/país es el cliente y a qué público le habla (sale de su skill de marca; **si no se sabe, preguntar** antes de elegir). Se nota y queda falso si no coincide:
  - **Arquitectura, calles, construcción y paisaje** coherentes con esa ciudad (ej. un cliente de Rosario no lleva suburbios de EE. UU. con casas de madera, nieve o calles anchas americanas).
  - **Personas** que el público local reconozca como propias: rasgos, vestimenta y estética coherentes con la gente de ese mercado. Si el clip muestra gente que se lee claramente de otro país o cultura, se descarta.
  - **Moneda** de uso real en ese mercado (ej. Argentina: dólares o pesos sí, euros no; EE. UU.: dólares).
  - Ante la duda, mejor stock sin personas ni fachadas reconocibles (manos, llaves, papeles, detalles) o una animación.
- **Mismo formato del video**: convertir a 1080×1920 y a los fps del proyecto. Si viene en HDR (HLG de iPhone), pasarlo a SDR antes.

## 10. Títulos, transiciones y SFX (obligatorio en el acabado)
Corrección del usuario (2026-09-30, pauta RIS 20-09): un acabado sin esto está "muy verde".

- **Título O subtítulo, nunca los dos a la vez.** Si un título ocupa la pantalla, el subtítulo se oculta en ese tramo (el título debe cubrir lo que se está diciendo). Excepción: un tag chico informativo (ej. la dirección) puede convivir con subtítulos.
- **Los títulos son composiciones diseñadas y animadas, no una palabra suelta estática**: jerarquía de 2+ niveles (dato grande + contexto chico), mezcla de pesos — **un solo golpe pesado por título**: nunca apilar 2–3 líneas en el peso más pesado (corrección del usuario, 2026-10-07, RIS 03-09: "textos principales muy pesados juntos, queda horrible"); el resto en pesos livianos/medios, animación de entrada con easing (pop con overshoot, slide, slam según el peso del dato) y salida. Cada aparición de título lleva su SFX.
- **Transiciones en los cambios de bloque**: cada cambio de bloque/escena lleva una transición con intención (glitch, whip, disolvencia, corte en beat) según la marca del cliente. Un corte seco entre bloques distintos sin transición ni motivo se siente incompleto.
  - En reels con ritmo, el usuario pidió transición **en todos los cortes** (2026-10-02, "faltan transiciones"): 26 en 57 s quedó aprobado. Recetas probadas (2–3 frames a cada lado del corte, el corte sigue en el beat): **zoom-blur** = promedio de ~11 escalas de 1 a 1,3×, anclado a los ojos en planos del speaker (así no rompe la regla de los ojos) y al centro en B-roll; **whip** = desplazamiento de ~260 px + desenfoque de movimiento (promedio de ~16 copias corridas), sale hacia un lado y entra desde el otro. Con pocas muestras se ven "escalones" fantasma. Aplicarlas a la imagen ANTES de los textos (los títulos no se barren) y cada una con su whoosh/swipe.
- **SFX obligatorios**: whoosh/transición en cada cambio de bloque, pop/hit en cada título, riser o whoosh-hit en reveals (densidad y niveles en la regla 3.3). Siempre por debajo de la voz; alinear el PICO del SFX con el evento visual (medir dónde cae el pico del archivo, no asumir que es el inicio). Biblioteca: `{SFX_ENVATO}/` (Envato) y `{SFX}/` (`SONIDOS/` whoosh slide, swipe swoosh, pop, check mark; `VARIOS/` Epic Cinematic Bass Riser 1–3: el 1 sube 2,75 s hasta su pico).
- **Título detrás del speaker (rotoscopia) no puede quedar tapado**: si el cuerpo o la cabeza cubren el centro de la palabra, no se lee (reel LIU 03-10, "tapado casi completamente"). Ubicarlo según la cabeza medida: solo el **pie de la última línea** pasa detrás de la cabeza (~55 px por debajo del tope del pelo); el resto queda libre sobre el fondo.
- **Si la rotoscopia no queda limpia, mejor sin rotoscopia** (corrección del usuario, 2026-10-27, AP 09-09: "si no podés hacerla bien prefiero que la dejes como estaba y que no se note"). Si en algún cuadro del tramo se nota el recorte o el título queda casi entero detrás de la cabeza, el título va entero por encima de la cabeza (o al pecho), sin máscara. Revisar el tramo completo en el render, no un solo cuadro: el speaker sube y baja la cabeza mientras habla.
  - En **selfies con la cara alta** (tope del pelo por encima de y ≈ 400), un título detrás del pelo no entra en la zona segura (arriba hasta y = 270): ir directo al pecho, debajo del mentón.
- **Clips acelerados con curva, no velocidad constante**: al acelerar un clip largo (ej. video generado por IA), usar rampa que arranca rápido y desacelera al final para que el remate se lea; entrar con disolvencia o transición, no con corte seco.
- **Zooms suaves en tramos largos a cámara**: si el speaker habla a cámara más de ~3 s, sumar zoom in/out lento anclado a los ojos en los DOS ejes (regla 4). Verificar el anclaje con landmarks.
- **La posición del título se interpreta según el plano, no "arriba" por defecto**: sobre un speaker va en el tercio que la cara deja libre; sobre B-roll, stock o una imagen generada suele quedar mejor **centrado en el espacio visual** del plano. Decidirlo mirando el plano y justificarlo.
- **La voz en off no se corta para meter un clip**: si un clip (ej. video generado por IA) necesita tiempo en pantalla, pasa POR ENCIMA de la voz continua como B-roll; no se abre un hueco de silencio en la voz.
- **Títulos y subtítulos cerca del sujeto** (corrección del usuario, 2026-09-30): cuando hay alguien hablando en cuadro, el título va pegado a su cabeza (sin taparla, regla 2, ~25 px sobre el pelo medido con detección facial y contando el zoom) y los subtítulos cerca de la cara; el espectador no tiene que repartir la mirada entre puntas opuestas del cuadro. Un título flotando lejos del sujeto está mal puesto.

## 11. Cierre de cada video: actualizar las skills
Cuando el usuario aprueba un video (o cierra una ronda con correcciones), antes de terminar:
1. **Repasar las correcciones de la sesión** y separar: ¿es una regla para todos los clientes (va acá, en la sección que corresponda, con fecha y video de origen), es de portadas (va a `portadas-reels`) o es gusto de un cliente (va a su skill de marca)?
2. **Audio siempre**: todo lo aprendido de voz, música, SFX o master se suma a la regla 3, con los números medidos (LUFS, LRA, dB) — no solo "quedó mejor".
3. **Herramientas**: si se escribió un script que resolvió algo y sirve de nuevo, copiarlo a `scripts/` de la skill que corresponda (general acá, de marca en la del cliente) con un encabezado que diga uso y caso real.
4. **Reemplazar, no apilar**: si una corrección nueva contradice una regla vieja, se reescribe la regla (dejando el porqué) en vez de sumar una línea que la contradiga.
5. Antes de editar una skill, leerla completa y hacer copia de respaldo; al final, contarle al usuario qué se cambió en cada skill.
