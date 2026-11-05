---
name: "reji-bracco-brand"
description: "Identidad visual para video de Reji Bracco (REB), inmobiliaria en Montevideo, Uruguay (habla Reji o alguien de su equipo). Montserrat con mezcla de pesos (SemiBold en subtítulos, Light de bajada, Black en golpes), subtítulos karaoke con la palabra activa en verde salvia con contorno blanco, golpes en degradé mostaza→crema o en verde MAYÚSCULA con contorno blanco, destello cálido y whip como transición, drone propio de Montevideo antes que stock, motion de marca (mapa real de los barrios de Montevideo con límites del INE, panel de lista, sello giratorio, arco del sol, medidor de ruido, manzana con pines), voseo uruguayo, más la referencia de seis piezas aprobadas (pauta de edificio en Cordón, reel a cámara con drones: 200 apartamentos en venta, reel educativo a cámara con pasos numerados: cómo se paga en pozo, reel a cámara con mapa de barrios: por qué construimos en estos barrios, reel con motion sobre B-roll: en la visita no mires solo el apartamento, y loop sin voz de obra con el logo de Site al cierre) y portadas (2 frames para el editor, o diseñada si la encarga). Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Reji Bracco / REB (reels, pauta, portadas), o cuando el usuario diga \"editá el video de Reji\", \"video de REB\", \"con la marca de Reji Bracco\", aunque no mencione la skill."
---

# Reji Bracco (REB) — marca para video

Se aplica **junto con `edicion-reels-base`**. Las reglas de la base mandan (zonas seguras, subtítulos pegados a la cara, audio, stock sin audio, cierre). Esta skill suma lo propio de Reji. Si algo de acá contradice la base, gana la base, salvo que el usuario diga lo contrario para este cliente.

Fuentes: paleta del manual (Coolors, en la carpeta de marca del cliente) y los videos aprobados de referencia (ver sección 10).

## 1. Quién es y a quién le habla
- **Reji Bracco**, inmobiliaria / agente inmobiliario. Sigla en carpetas y archivos: **REB** (ej. `01-10 REB PAUTA ...`).
- **Mercado: Montevideo, Uruguay** (en la referencia: edificio terminado en Cordón, a pasos de Tristán Narvaja, Facultad de Psicología y Arquitectura, Biblioteca Nacional y Parque Rodó). Vende desarrollos y departamentos.
- **Público:** compradores para vivir e inversores que buscan renta ("zona con alta demanda de alquiler").
- Tono: cercano y directo. **Vocero: Reji o alguien de su equipo** (en 12-10 habla una asesora: hook y CTA a cámara, sentada en la oficina). No asumir el género del vocero: mirar el crudo.
- Carpeta: `{CARPETA_CLIENTE}/01 REELS/<NN Mes>/<DD-MM REB Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/ EXPORT/`. El final va en `EXPORT/`. En `RECURSOS/` suelen venir tomas de drone propias (ver sección 8).
- Formato: 1080×1920, **30 fps**. Pautas ~40 s; reels a cámara ~20 s; **loops** (sin cara ni voz, solo música) de **15 s como máximo** (16-10).
- **Logo: no se usa en reels ni pautas** (decisión del usuario, 2026-10-16). Sin placa final. **Excepción, los loops:** cierran con el logo de **Site Desarrollo** (la marca de Reji) armado sobre blanco (16-10, aprobado 2026-10-29). Logo en `assets/logo-site-desarrollo.png` (también en `{CARPETA_CLIENTE}/00 IMAGEN DE MARCA/1.png`).

## 2. Idioma y textos en pantalla
- **Voseo uruguayo, como habla quien está a cámara** ("Acabás de encontrar", "Escribime", "te paso"). Va así en subtítulos **y también en los títulos y textos que escribimos nosotros** (decisión del usuario, 2026-10-16). No pasar a neutro.
- Términos locales tal cual: IRPF, ITP, vivienda promovida, parrillero, azotea, placard, monoambiente, **apartamento** (no "departamento"), **en pozo**.
- Cuando habla el equipo, el CTA va en plural: "**Escribinos**", "te contamos".
- **Los subtítulos y títulos siguen lo que se dice, no el guion** (en 12-10 el guion decía "Contanos qué estás buscando" y se dijo "Escribinos para saber qué necesitás": va lo dicho).
- Precios en **dólares**, escritos `USD 128.000` ("USD" adelante, punto de miles, sin `$`).
- Errores típicos de la transcripción: "Cordón" sin tilde, "Narvaja" como "Narbaja", "128.000 $" en vez de `USD 128.000`. Revisarlos.
- **Cero datos inventados:** cifras, precios o beneficios fiscales solo si los dice él o están en el guion (regla 6 de la base).

## 3. Paleta
El manual es una paleta de Coolors sin nombres; los nombres son de referencia interna.
| Nombre | HEX | Uso en video |
|---|---|---|
| **Verde salvia** | `#5D8776` | **Palabra activa del karaoke** y golpes en MAYÚSCULAS con contorno blanco ("CORDON", "NARVAJA") |
| **Mostaza** | `#CDBC31` | Arranque (izquierda) del degradé de los títulos |
| Crema | `#F2EBC7` | Final (derecha) del degradé. Medido en el video, no está en el manual |
| Blanco | `#FFFFFF` | Subtítulos, bajadas, contorno de los golpes verdes |
| Verde oscuro | `#3A5248` | Solo apoyo: cajas o tinte de placas. No para texto sobre video |
| Gris | `#969997` | No se usa |

- **Degradé de la casa:** lineal **horizontal**, mostaza a la izquierda → crema casi blanco a la derecha, aplicado al bloque de texto entero (no letra por letra), con sombra suave negra.
- Máximo **dos colores de marca a la vez** (verde + degradé) además del blanco.

## 4. Tipografía — Montserrat
El manual dice **Gibson**, pero **se usa Montserrat** (decisión del usuario, 2026-10-16). Interletrado apretado en los golpes (≈ −5 %), interlineado de los lockups ≈0,82: las líneas casi se tocan.
| Uso | Peso |
|---|---|
| Subtítulos | **SemiBold** |
| Bajada / línea de contexto ("desde", "para entrar", "por WhatsApp") | **Light** |
| Palabra o cifra destacada dentro de la bajada ("**39** departamentos", "la **primera** compra") | **Bold** |
| Golpe en degradé (precio, dato, "YA") | **Black** |
| Golpe verde en MAYÚSCULAS (barrio, palabra clave del CTA) | **Black** + contorno blanco (~9 px) |

Si Montserrat no está disponible en el editor, avisar antes de reemplazarla.

## 5. Subtítulos — estilo karaoke
- Montserrat **SemiBold blanco**, **2–4 palabras por bloque**, ~58 px (≈42 px de alto), sin caja, con sombra suave y marcada (las oficinas de Reji son blancas: sin sombra fuerte el blanco se pierde contra la pared).
- **La palabra que se está pronunciando se resalta en verde `#5D8776` con contorno blanco de ~9 px** (`-webkit-text-stroke: 9px white; paint-order: stroke fill` + sombra), sincronizada palabra por palabra. Es el sello de la marca: no se omite. El contorno se sumó en 12-10 (aprobado 2026-10-29): sin él el verde no se leía sobre la pared blanca ni sobre la camisa a rayas.
- Se respeta puntuación y mayúsculas de nombres ("Tristán Narvaja", "Parque Rodó").
- En **Vyra**: `addCaptions` / `editAllCaptionStyles` con modo **`highlight`**, `highlightColor: "#5D8776"`, texto `#FFFFFF`, fuente Montserrat SemiBold, máximo 4 palabras, sombra suave, sin fondo.
- Posición: la de la base (debajo del mentón medido con detección facial, ~y 900–990 con la vocera sentada; centrado sobre B-roll). Cuando hay título en pantalla, se oculta el subtítulo.
- **Fondos blancos** (11-10, aprobado 2026-11-03): la oficina tiene pared y pizarra blancas y la vocera usa saco blanco; con la sombra sola el texto blanco se pierde. Se suman (no son cajas):
  - **halo oscuro** detrás del subtítulo: elipse radial `rgba(0,0,0,0.42)` → 0, ~760×170 px, centrada en el renglón; lo mismo detrás del CTA (900×300, 0,5) mientras está el título;
  - sombra más marcada: `0 0 3px rgba(0,0,0,.75), 0 2px 6px rgba(0,0,0,.7), 0 3px 20px rgba(0,0,0,.65), 0 0 40px rgba(0,0,0,.45)`;
  - si el título va arriba de la cabeza sobre la pizarra, **velo verde oscuro `#3A5248`** desde arriba (0,88 → 0,8 hasta y 560, se apaga en y 840): apaga lo escrito en la pizarra y deja leer el título.

## 6. Títulos y datos en pantalla
Lockups centrados de 2–3 líneas muy apretadas, con entrada pop/escala línea por línea al ritmo de la voz.
- **Bajada + golpe en degradé** (default para precio y datos):
  - "desde" (Light blanco) / "**USD 128.000**" (Black degradé)
  - "**10 niveles**" (degradé) / "**39** departamentos" (Bold + Light blanco)
  - "**IRPF y el ITP**" (degradé) / "en la **primera** compra"
- **Golpe verde en MAYÚSCULAS con contorno blanco** para el barrio o la palabra clave:
  - "**CORDON**" / "para entrar" / "**YA**" (la última en degradé)
  - CTA: "Escribime" / "**\"NARVAJA\"**" / "por WhatsApp"
- **Stickers de lugar:** foto chica cuadrada (~240 px) del lugar que nombra (feria de Tristán Narvaja, Facultad, Biblioteca Nacional, Parque Rodó) sobre el subtítulo, cambiando con cada nombre.
- **Lockups de 12-10** (reel a cámara, 5 títulos en 18 s, aprobados):
  - Hook debajo del mentón: "Hoy tenemos" (Light) / "**200**" (Black degradé, 250 px, con destello cálido) / "**apartamentos**" (Bold).
  - Sobre stock y drone, centrados en y ≈ 930: "algunos" / "**EN POZO**" (verde) / "para quienes **prefieren**"; "y otros **ya**" / "**terminados**" (degradé); "con una **cartera**" / "**así de grande**" (degradé).
  - CTA debajo del mentón: "**ESCRIBINOS**" (verde) / "para saber qué **necesitás**".
  - Tamaños que entran en el ancho seguro (720 px): golpe verde de 10 letras ≈ 96–98 px; "EN POZO" 130 px; degradé de 10–13 letras 92–112 px. Medirlo en el render con guías.
  - Un título tiene que durar ≥ 1 s: "EN POZO" con 0,4 s no se leía; se estiró hasta el cambio de plano sumando la frase que sigue como bajada.
- **Pasos numerados** (11-10, reel educativo, aprobado 2026-11-03): círculo verde salvia con borde blanco de 6 px y el número en Montserrat Bold blanco (≈0,95 del cuerpo de la palabra) + la palabra en verde MAYÚSCULA con contorno blanco (96–110 px), en una fila centrada; la bajada en Light 48–52 con la palabra clave en Bold. Un solo golpe pesado por título (la palabra verde; el círculo no cuenta).
  - "reservás la **unidad**" / ① **ANTICIPO** (sobre la vocera señalando la pizarra) · ② **CUOTAS** / "mientras está **en obra**" (sobre la obra) · "coordinamos una" / ③ **ENTREGA** / "así lo podés **disfrutar**" (sobre el drone de las torres terminadas).
  - Hook: "Comprar **en pozo**" / "**3**" (degradé 230, destello cálido) / "momentos" (Bold); cierre de idea: "y un esquema de **cuotas**" / "**propio**" (degradé 150); CTA "**ESCRIBINOS**" / "contanos qué **apartamento**" / "te interesa".
- **Motion de marca** (08-10, aprobado 2026-11-04; plantilla `plantillas/Video-0810-barrios.tsx`):
  - **Mapa real de Montevideo** cuando nombra barrios: límites oficiales de los 62 barrios del INE (`assets/mapa-montevideo/`, UTM 21S) proyectados con `scripts/mapa_barrios.py` (escala uniforme, norte arriba; la costa sale del borde de los barrios). Todos los barrios en verde oscuro `#3A5248` con líneas crema finas sobre el río oscuro; cada barrio nombrado se enciende en verde salvia con borde blanco + destello mostaza, con su nombre (Montserrat Bold 42 blanco con sombra). Encabezado "siempre los mismos" (Light) / "**5 barrios**" (degradé 150). **Nunca un mapa dibujado a mano**: Tomi preguntó "¿es acertado con las dimensiones?" y no lo era. "Cordón Sur" no es barrio oficial: Cordón recortado al sur de Av. 18 de Julio (traza de OSM en `av18.json`, línea punteada crema). OSM no tiene Buceo ni La Blanqueada y el WFS de la Intendencia no respondía: usar el INE.
  - **Panel de lista** sobre B-roll ("LO QUE BUSCAMOS"): caja `rgba(30,45,40,0.84)` con borde crema fino, radio 34, 720 px de ancho centrada en x = 540; filas con círculo numerado verde + texto SemiBold 50 con la palabra clave en Bold crema, entrando a medida que se dicen (el alto final se reserva desde el principio para que quede centrado). Cuando retoma un ítem ("la primera…") ese ítem se resalta en mostaza y los otros bajan a 0,38.
  - **Sello giratorio** para un beneficio o régimen ("VIVIENDA PROMOVIDA"): disco verde oscuro con borde blanco, anillo de texto crema girando, ícono de casa con check mostaza, "vivienda" Light / "PROMOVIDA" Black 47; entra con slam (escala 1,7 → 1 con giro) y stamp.
- **Motion sobre B-roll** (07-11, aprobado 2026-11-05; plantilla `plantillas/Video-0711-visita.tsx`), cuando el vocero lee y hay que taparlo entero; cada pieza va sincronizada con las palabras alineadas:
  - **Arco del sol** sobre el timelapse de la ventana ("por qué ventanas entra el sol y a qué hora"): arco punteado crema de 300 px de radio con el recorrido en mostaza, sol mostaza→crema con rayos girando, píldora verde oscuro con la hora (07:00 → 18:00) que se agranda en "a qué hora", "mañana" / "tarde" en Light a los costados.
  - **Medidor de ruido** sobre el drone de la avenida ("escuchá cuánto ruido llega de la calle"): panel `rgba(30,45,40,0.80)` con borde crema y 25 barras redondeadas en degradé mostaza→crema que crecen hasta "ruido", más una barra de nivel "silencio → ruido".
  - **Manzana con pines** sobre el drone de la cuadra ("dar una vuelta a la manzana", "parada, almacén, farmacia"): panel cuadrado de 660 px con 9 cuadras (la del centro en mostaza con una casa crema), un punto verde que da la vuelta dejando el recorrido, y pines verdes con borde blanco que caen en cada palabra (colectivo, canasta, cruz) con el nombre en Black 30 MAYÚSCULA. Un solo panel (sin tracking sobre el drone): no flota cuando el drone se mueve.
- Frecuencia: 4–5 títulos en ~40 s (hook con barrio y precio, datos del edificio, beneficio fiscal, CTA); en reels cortos a cámara, uno por idea (6 en 20 s).

## 7. Ritmo, look y acabado
- Estructura de pauta: hook a cámara (barrio + precio) → B-roll de la unidad cada ~1,5–2 s con voz en off → amenities y beneficios con stock → CTA a cámara.
- Estructura de reel a cámara (12-10): una sola toma hablando, con drone o stock **por encima de la voz** en cada idea que se pueda mostrar (ciudad, obra, edificios terminados, zonas). Las pausas largas de la toma se cortan debajo del B-roll o con un punch-in anclado a los ojos.
- Estructura de reel educativo a cámara (11-10): varias tomas; hook y cuerpo en la que tiene la pizarra con los pasos escritos (ella señala cada uno), B-roll por encima de la voz en cada paso que se puede mostrar (obra en "cuotas", torres terminadas en "entrega", la ciudad en "cada unidad") y cierre + CTA en una toma más cerrada. Elegir la toma que dice lo del guion (en 11-10 una toma decía "contanos qué **unidad**" en vez de "qué **apartamento**").
- Estructura de reel a cámara con **una toma por frase** (08-10): cada cambio de toma va debajo de un B-roll o del motion cuando se puede (tapa el salto de fondo: pared, pizarra, cuadros).
- **Velo verde oscuro desde arriba** (`#3A5248`, 0,86 → 0,78 hasta el pie del título, se apaga ~150 px más abajo) siempre que haya un título arriba de la cabeza sobre la pared blanca (hook, CTA). Con halo solo, el Light blanco no se leía (08-10).
- **Punch dentro de una toma solo en un silencio**: en 08-10 el punch con zoom-blur estaba en 5,0 s y "barrios" terminaba en 4,95 → "no termina de decir la frase porque justo se corta". El corte (y los 3 cuadros de blur antes) va después de la cola de la palabra, y el título que la acompaña se queda hasta que termina.
- Tomas en la oficina con **tinte verde** (luz de ventana + tubos): corregir antes de montar (`colorchannelmixer=rr=1.22:gg=1.07:bb=1.17,eq=gamma=0.97:saturation=1.05` en IMG_5499 del 11-10) para que empareje con las otras tomas.
- **Punch en el CTA cuando la vocera se acerca entre tomas** (11-10): si en la toma siguiente los ojos quedan mucho más arriba, el punch-in anclado a los ojos saca el recorte del cuadro. Se invierte: el tramo anterior va cerrado (1,10→1,15) y el CTA abre a 1×, con los ojos en el mismo punto. Además deja lugar debajo del mentón para el CTA dentro de y ≤ 1440.
- Transiciones: corte directo de base; **destello cálido (light leak)** al entrar el precio; **whip con motion blur** en planos de cielo o ciudad (los textos pueden entrar con desenfoque de movimiento).
- Look natural y luminoso, interiores blancos con piso de madera.
- Audio: master de la base (-11 LUFS). La referencia 01-10 está en −21,7 LUFS: **no copiar ese volumen**.
- Música de loops: ***Rising Forest*** (Mixkit 471, Demucs −44 dB en el tramo usado), 124,0 BPM medidos; tramo estable desde 47,928 s (drop) hasta ~78 s. El loop dura un número entero de compases (48 tiempos en 16-10) para que la música empalme al repetirse.
- Música aprobada: ***Motivating Mornings*** (Mixkit 33, instrumental: Demucs p90 −54 dB), 121,0 BPM medidos; el drop (12,16 s del tema) cae cuando entra el primer drone. Uplifting/corporativo liviano, ~15 dB por debajo de la voz con hueco de EQ.
- CTA de pauta: "Escribime \"PALABRA\" por WhatsApp y te paso…" con una palabra clave del proyecto. CTA de reel con el equipo: "Escribinos…" sin palabra clave.

## 8. Stock y B-roll
- Primero el material del rodaje (la unidad, el edificio, la azotea).
- **Drone propio de Montevideo**: el cliente manda tomas de drone en `RECURSOS/` (en 12-10: Rambla y el río, Parque Central / Gran Parque Central, torres, panorámicas con el parque y la ciudad). **Vienen verticales** (1920×1080 con rotación 90 → 1080×1920 al convertir): no hace falta recortar. Hacer hoja de contacto de cada toma y asignar cada una a la frase que mejor ilustra (torres en "terminados", panorámica en "cartera así de grande", barrios en "la zona"). Se convierten a 30 fps sin audio.
- Si se habla de obra / **en pozo** y el drone no muestra una obra de cerca, sirve `{STOCK}/CONSTRUCCION.mp4` (estructura de hormigón con grúa y obreros: se lee rioplatense).
- Stock que **parezca Montevideo**: vista de la ciudad desde altura, Rambla, Parque Rodó, feria de Tristán Narvaja, edificios montevideanos. Nada que se lea Buenos Aires, Miami ni Europa.
- Temático: asado en parrillero (azotea), firma de escritura, maqueta de casa con billetes (impuestos, inversión).
- **Stock de obra** (16-10): Pexels vertical 4K (`pexels.com/download/video/<id>/` baja el archivo; buscar con `?orientation=portrait`). Mixkit solo da 720p horizontal: recortado a vertical queda blando. Aprobados: columnas con hierros (34521512), losa con grúas (34764180), ladrillero (39356774), fundaciones (34199756), malla desde arriba (35631524); del banco, `PLANOS.mp4` y `CONSTRUCCION.mp4` (este es el mismo clip que Pexels 26563090: no usar los dos). Ladrillo y hormigón se leen rioplatenses; evitar obreros que se lean de otro país.
- **Stock de obra del banco** (11-10): `{STOCK}/en obra 2.mp4` (columnas con hierros y obreros, vertical 4K) y `en obra 5.mp4` (ladrillero) se leen rioplatenses; `en obra 1/3/4` son obras grandes en campo abierto, menos creíbles para Montevideo.
- **Drones del 12-10 reutilizables** (en `RECURSOS/` del 12-10): el 1 (30 s) termina en dos torres blancas terminadas → "entrega", "terminados"; el 6 (15 s) barre la ciudad hasta el río → "cada proyecto", "cartera"; el 3 es el Parque Central y el 5 la Rambla fija.
- **Uso de los drones del 12-10 hasta 08-10** (Tomi pidió no repetir B-roll): ya usados 10-51-26 (0,5 s y 21–23 s: torres), 09-57-10 (2 s: ciudad al río), 10-52-24 (5 s: Parque Central). En 08-10: 10-53-04 desde 1 s (parque y ciudad), 10-51-26 desde 1 s (barrio arbolado), 10-52-02 desde 1 s (avenida con tránsito → "conectividad"), 09-57-00 desde 1 s (edificios con el río). En 07-11: 10-52-02 de 4,5 a 6,5 s (avenida → "ruido de la calle") y 10-51-26 de 8,5 a 14,2 s (cuadra arbolada desde arriba → "la manzana"). Llevar la cuenta acá.
- **Stock de Pexels aprobado** (08-10): llaves colgando de la puerta (7986204, "alquiler"), mano que abre la puerta con llave (7646797, "ir a vivir"), banderas de Uruguay frente a un edificio (38864209, geolocalizado en Uruguay, "vivienda promovida"). Pexels bloquea `curl` a `/download/`: sacar la URL `videos.pexels.com/video-files/…` desde el navegador (la página trae también el campo `location`: filtrar por Uruguay).
- **Stock de Pexels aprobado** (07-11): ventana con persiana y timelapse de nubes (4386106, 2560×1440 recortado a vertical, "el sol y a qué hora"), cortina volando en una ventana abierta (13554476, "abrí una ventana"). De repuesto, sin usar: puerta de balcón abierta (35836247) y cortinas finas al sol (38675645). **Calles de Montevideo en Pexels no hay** (lo etiquetado así es Buenos Aires, Los Ángeles o Skopje): para la calle, el drone del cliente.
- **Fotos del cliente** (en 16-10, de Regina: la obra en excavación): siempre con zoom in/out leve, alternando el sentido de una foto a la otra.

## 9. Reglas editoriales de Reji
- No cambiar el copy ni la estructura del guion sin que lo pidan.
- Sin logo hasta nuevo aviso.

## 10. Referencias aprobadas
- `01-10 REB PAUTA Título pendiente` (39 s) — edificio en Cordón desde USD 128.000:
  - 0–5 s: Reji a cámara, "Acabás de encontrar el mejor departamento en **CORDON** para entrar **YA** desde **USD 128.000**", destello cálido en el precio.
  - 5–15 s: B-roll de la unidad con stickers de Tristán Narvaja, Facultad, Biblioteca Nacional y Parque Rodó; "zona con alta demanda de alquiler".
  - 15–24 s: "**10 niveles** / **39** departamentos", terraza o balcón, cocina, placard, doble vidrio.
  - 24–33 s: azotea con parrillero (stock de asado), terraza con vistas (whip sobre el cielo), vivienda promovida: "exonerado del **IRPF y el ITP** en la **primera** compra".
  - 33–39 s: CTA a cámara con el celular, "Escribime **\"NARVAJA\"** por WhatsApp y te paso las últimas unidades disponibles con piso, metros y precio".

- `12-10 REB Hoy tenemos 200 apartamentos` (18,4 s, aprobado 2026-10-29) — reel a cámara de una asesora del equipo, una toma, con drones del cliente. En la v2 Tomi pidió **sacar "en venta en Montevideo"**: el hook pasa directo de "200 apartamentos" a "algunos en pozo" (se fue el drone de la Rambla, que sin esa frase duraba 0,4 s).
  - 0–1,77 s: a cámara caminando hacia el celular, "Hoy tenemos **200** apartamentos", destello cálido en el 200.
  - 1,77–3,9 s: stock de obra (whip + drop de la música), "algunos **EN POZO** para quienes **prefieren**".
  - 3,9–6,1 s: a cámara, "pagarlo en cuotas mientras se va construyendo" (karaoke).
  - 6,1–7,6 s: drone de torres, "y otros **ya terminados**"; vuelve a cámara en "para quienes necesitan mudarse ya".
  - 8,8–10,1 s: panorámica de drone, "con una **cartera así de grande**"; a cámara "lo más probable es que encontremos la unidad que necesitás".
  - 12,6–14,1 s: drone del Parque Central, "y en la zona de tu preferencia".
  - 14,1–18,4 s: CTA a cámara, "**ESCRIBINOS** para saber qué **necesitás** y te contamos qué tenemos disponible", punch-in anclado a los ojos en la última frase.
  - Transiciones en cada corte (whip en los drones, zoom-blur en la vocera) con whoosh; pop/stamp/wink en los títulos. Master −11,0 LUFS / −1,4 dBTP.

- `11-10 REB Así se paga un apartamento en` (25,3 s, aprobado 2026-11-03) — reel educativo a cámara de la asesora con la pizarra "ANTICIPO / CUOTAS / ENTREGA":
  - 0–1,8 s: hook junto a la pizarra (s 1,15, ella a la izquierda), "Comprar en pozo tiene **3** momentos", velo verde arriba y destello en el 3.
  - 1,8–4,7 s: punch-in anclado a los ojos, "reservás la unidad" / ① ANTICIPO mientras señala la pizarra.
  - 4,7–9,8 s: obra (whip + drop de *Motivating Mornings*), ② CUOTAS; ladrillero en "se va construyendo".
  - 9,8–13,7 s: drone de las torres, ③ ENTREGA.
  - 13,7–17,1 s: drone de la ciudad, "Cada unidad tiene un anticipo" → "y un esquema de cuotas / **propio**".
  - 17,1–25,3 s: toma cerrada, "te lo confirmamos una vez que elijas la unidad" y CTA "**ESCRIBINOS** / contanos qué apartamento te interesa" (punch invertido, sección 7).
  - Voz: Adobe Podcast de Tomi (0 ms de desfase) + cadena modo `mejorada`; música −16/−17 dB bajo la voz; 19 SFX; master −10,9 LUFS / −1,5 dBTP.

- `16-10 REB Título pendiente` (loop de 23,25 s, aprobado 2026-10-29) — sin voz ni cara, solo música (*Rising Forest*), un corte cada 2 tiempos:
  - 0–1,9 s: folleto de Site con lapicera (IMG_5554), "de la / **IDEA**" (degradé) con destello cálido.
  - 1,9–14,5 s: planos → 6 fotos de la obra con zoom alternado ("a la / **OBRA**" en verde) intercaladas con stock de obra.
  - 14,5–16,5 s: drones del cliente (torres terminadas, barrio) con whip.
  - 16,5–20,3 s: pared de la oficina "convertimos / proyectos" → folleto IMG_5561 → "en ideas / sólidas". **No poner transiciones dentro de un mismo plano** (corrección: un zoom-blur en mitad de la pared "parece una transición al mismo plano").
  - 20,3–23,25 s: logo de Site sobre blanco armado pieza por pieza (`scripts/logo_piezas.py`): baldosas del arco de abajo hacia arriba, letras de "site" que suben, acento mostaza de la i que cae, DESARROLLO que se cierra; 640 px de ancho centrado; whip de salida que empalma con el arranque del loop.
  - **Versión corta (pedido del usuario, 2026-10-29: "15 s máximo, misma estructura")**: 28 tiempos = 13,55 s, la entregada. Folleto + IDEA (2 unidades de 2 tiempos), 4 fotos + 1 stock con OBRA en las dos primeras, 1 drone, paredA / folleto 5561 / paredB (una unidad cada uno), logo (3 unidades). **Los loops de REB van de ≤15 s**: con este tema, 28 tiempos (32 tiempos daría 15,5 s).

- `08-10 REB Por qué construimos en estos b` (36,9 s, aprobado 2026-11-04) — reel a cámara de la asesora, 6 tomas (una por frase) con drones, stock y motion:
  - 0–7,5 s: hook ("Si mirás dónde desarrollamos…" con drone del parque), "se repiten siempre / **5** / barrios" (destello) y "¿por qué siempre desarrollamos en / **LOS MISMOS?**" (verde) arriba de la cabeza con velo verde; punch en el silencio después de "barrios".
  - 7,5–12 s: mapa real con Cordón, Cordón Sur, Buceo, La Blanqueada y Parque Rodó encendiéndose (whip + drop de *Motivating Mornings*).
  - 12–15,9 s: pizarra, "nos enfocamos en / **3 cosas**" (degradé) debajo del mentón con halo.
  - 15,9–21 s: panel "LO QUE BUSCAMOS" sobre drone arbolado → avenida → llaves; se resalta el 1 en "la primera".
  - 21–23,3 s: puerta, "a quien va a ir a / **VIVIR**" (verde). 25,6–28,6 s: "y **la última** / a quien va a / **INVERTIR**" (degradé) arriba de la cabeza, sigue sobre el drone del río.
  - 30,5–34,1 s: banderas de Uruguay + sello "VIVIENDA PROMOVIDA". 34,1 s: CTA "**ESCRIBINOS** / y te contamos qué tenemos / hoy en cada **barrio**" arriba de la cabeza con velo.
  - Voz: audio mejorado de Tomi (0 ms) + cadena `mejorada`; música −16 dB bajo la voz; ~45 SFX; master −10,8 LUFS / −1,5 dBTP.

- `07-11 REB En la visita, no mires solo el` (17,0 s, aprobado 2026-11-05) — habla **Reji** (no la asesora), 3 tomas: hook en la terraza caminando hacia cámara, cuerpo leyendo del celular (tapado entero con B-roll + motion) y CTA en la oficina:
  - 0–3,7 s: hook "Cuando venís a ver nuestros apartamentos" (karaoke debajo del mentón) → "no mires **solo** el / **APARTAMENTO**" (verde 86 px, destello). De 5 tomas del hook se eligió la que decía el guion en voseo y sin anteojos ("cuando vengas", "no mire solamente" descartadas).
  - 3,7–6,6 s: timelapse de la ventana + arco del sol (whip + drop de *Motivating Mornings*).
  - 6,6–9,6 s: cortina → drone de la avenida con el medidor de ruido.
  - 9,6–15,3 s: drone de la cuadra con el panel de la manzana: vuelta + pines PARADA / ALMACÉN / FARMACIA.
  - 15,3–17,0 s: CTA "**ESCRIBINOS** / y coordinamos la **visita**" debajo del mentón, zoom-blur al entrar.
  - Subtítulos en una línea (SemiBold 54, palabras separadas 13 px: con 7 px el contorno de la palabra activa se pegaba a la anterior). Voz: audio mejorado de Tomi (0 ms) + cadena `mejorada` y −2,5 dB desde 4 kHz en el CTA (agudos +4,2 dB); música −16 dB; 13 SFX; master −10,8 LUFS / −2,0 dBTP.

## 11. Portadas
- **Por defecto la portada la hace el editor (Tomi)**; si la encarga, se diseña (ver 16-10 abajo). Al terminar el video se le pasan **2 frames** del crudo en `PORTADA/` (1080×1920, PNG): uno **sonriendo** y uno con la **boca cerrada**, con los ojos abiertos y la cara nítida. Buscarlos en las pausas y después de la última palabra (ahí suele sonreír).
- Estilo de su portada en 12-10 (`assets/portada-1210.jpg`): velo verde salvia arriba, título de dos líneas en Montserrat ("Hoy tenemos **200** / apartamentos ***EN VENTA***") con la cifra en el degradé mostaza→crema, sobre el frame sonriendo.
- Portada diseñada (16-10, aprobada 2026-10-29, `assets/portada-1610.jpg`): foto de la obra del cliente (excavadora) con velo verde oscuro `#3A5248` arriba (0,9 → 0,62 hasta y 900, se apaga en y 1130) y degradé oscuro abajo; "De la **idea** / a la ***OBRA***" centrado en y ≈ 580–840: "De la" / "a la" en Light blanco 104 px, "idea" en Black degradé mostaza→crema 150 px, "OBRA" en Black Italic verde salvia con contorno blanco. Hecha en PIL (`PROYECTO/portada.py` del 16-10).
- Portada de Tomi en 11-10 (`assets/portada-1110.jpg`): frame sonriendo con degradé mostaza → verde salvia de arriba hacia abajo, "Así se paga un / departamento en ***POZO***" en blanco con "POZO" en Black Italic, arriba a la izquierda. Usa "departamento" aunque los textos del video digan "apartamento": es decisión de Tomi, no corregirla.
- Portada de Tomi en 08-10 (`assets/portada-0810.jpg`): frame de la pizarra (no el del arranque del video), velo verde arriba, "¿Por qué / construimos / en estos / ***BARRIOS?***" alineado a la izquierda, "BARRIOS?" en Black Italic con degradé mostaza.
- Portada diseñada en 07-11 (aprobada 2026-11-05, `assets/portada-0711.jpg`, `scripts/portada_0711.py`): Reji recortado y más luminoso en la terraza (frame del final del hook, boca cerrada; corrido 40 px hacia abajo para que el pelo entre en el cuadrado), degradés verde oscuro arriba y abajo, "En la visita, / no mires **solo** el" en Medium/Black blanco 78 + "**APARTAMENTO**" verde con contorno blanco 102 px, debajo del mentón. Sobre la camisa celeste el texto blanco no se leía: halo verde oscuro detrás del bloque (0,55). **El golpe va 42 px debajo de la línea de base de arriba**: con 10 px el contorno blanco tocaba "solo el" (corrección de Tomi: "bajalo más").
- Cuando la deja, se inserta como **frame 0** con `portada_primer_frame.sh` de la skill `portadas-reels` (30 fps), sin cambiar la cantidad de cuadros.

## 12. Al cerrar cada video
Seguir la regla 11 de la base: las correcciones que sean gusto de Reji se agregan acá (con fecha y video de origen); las que valen para todos van al coordinador.