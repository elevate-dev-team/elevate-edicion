---
name: "reji-bracco-brand"
description: "Identidad visual para video de Reji Bracco (REB), inmobiliaria en Montevideo, Uruguay (habla Reji o alguien de su equipo). Montserrat con mezcla de pesos (SemiBold en subtítulos, Light de bajada, Black en golpes), subtítulos karaoke con la palabra activa en verde salvia con contorno blanco, golpes en degradé mostaza→crema o en verde MAYÚSCULA con contorno blanco, destello cálido y whip como transición, drone propio de Montevideo antes que stock, voseo uruguayo, más la referencia de tres piezas aprobadas (pauta de edificio en Cordón, reel a cámara con drones: 200 apartamentos en venta, y loop sin voz de obra con el logo de Site al cierre) y portadas (2 frames para el editor, o diseñada si la encarga). Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Reji Bracco / REB (reels, pauta, portadas), o cuando el usuario diga \"editá el video de Reji\", \"video de REB\", \"con la marca de Reji Bracco\", aunque no mencione la skill."
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
- **Lockups de 12-10** (reel a cámara, 6 títulos en 20 s, aprobados):
  - Hook debajo del mentón: "Hoy tenemos" (Light) / "**200**" (Black degradé, 250 px, con destello cálido) / "**apartamentos**" (Bold).
  - Sobre drone, centrados en y ≈ 930: "en venta en" / "**MONTEVIDEO**" (verde con contorno); "algunos" / "**EN POZO**" (verde) / "para quienes **prefieren**"; "y otros **ya**" / "**terminados**" (degradé); "con una **cartera**" / "**así de grande**" (degradé).
  - CTA debajo del mentón: "**ESCRIBINOS**" (verde) / "para saber qué **necesitás**".
  - Tamaños que entran en el ancho seguro (720 px): golpe verde de 10 letras ≈ 96–98 px; "EN POZO" 130 px; degradé de 10–13 letras 92–112 px. Medirlo en el render con guías.
  - Un título tiene que durar ≥ 1 s: "EN POZO" con 0,4 s no se leía; se estiró hasta el cambio de plano sumando la frase que sigue como bajada.
- Frecuencia: 4–5 títulos en ~40 s (hook con barrio y precio, datos del edificio, beneficio fiscal, CTA); en reels cortos a cámara, uno por idea (6 en 20 s).

## 7. Ritmo, look y acabado
- Estructura de pauta: hook a cámara (barrio + precio) → B-roll de la unidad cada ~1,5–2 s con voz en off → amenities y beneficios con stock → CTA a cámara.
- Estructura de reel a cámara (12-10): una sola toma hablando, con drone o stock **por encima de la voz** en cada idea que se pueda mostrar (ciudad, obra, edificios terminados, zonas). Las pausas largas de la toma se cortan debajo del B-roll o con un punch-in anclado a los ojos.
- Transiciones: corte directo de base; **destello cálido (light leak)** al entrar el precio; **whip con motion blur** en planos de cielo o ciudad (los textos pueden entrar con desenfoque de movimiento).
- Look natural y luminoso, interiores blancos con piso de madera.
- Audio: master de la base (-11 LUFS). La referencia 01-10 está en −21,7 LUFS: **no copiar ese volumen**.
- Música de loops: ***Rising Forest*** (Mixkit 471, Demucs −44 dB en el tramo usado), 124,0 BPM medidos; tramo estable desde 47,928 s (drop) hasta ~78 s. El loop dura un número entero de compases (48 tiempos en 16-10) para que la música empalme al repetirse.
- Música aprobada: ***Motivating Mornings*** (Mixkit 33, instrumental: Demucs p90 −54 dB), 121,0 BPM medidos; el drop (12,16 s del tema) cae cuando entra el primer drone. Uplifting/corporativo liviano, ~15 dB por debajo de la voz con hueco de EQ.
- CTA de pauta: "Escribime \"PALABRA\" por WhatsApp y te paso…" con una palabra clave del proyecto. CTA de reel con el equipo: "Escribinos…" sin palabra clave.

## 8. Stock y B-roll
- Primero el material del rodaje (la unidad, el edificio, la azotea).
- **Drone propio de Montevideo**: el cliente manda tomas de drone en `RECURSOS/` (en 12-10: Rambla y el río, Parque Central / Gran Parque Central, torres, panorámicas con el parque y la ciudad). **Vienen verticales** (1920×1080 con rotación 90 → 1080×1920 al convertir): no hace falta recortar. Hacer hoja de contacto de cada toma y asignar cada una a la frase que mejor ilustra (Rambla en "Montevideo", panorámica en "cartera así de grande", barrios en "la zona"). Se convierten a 30 fps sin audio.
- Si se habla de obra / **en pozo** y el drone no muestra una obra de cerca, sirve `{STOCK}/CONSTRUCCION.mp4` (estructura de hormigón con grúa y obreros: se lee rioplatense).
- Stock que **parezca Montevideo**: vista de la ciudad desde altura, Rambla, Parque Rodó, feria de Tristán Narvaja, edificios montevideanos. Nada que se lea Buenos Aires, Miami ni Europa.
- Temático: asado en parrillero (azotea), firma de escritura, maqueta de casa con billetes (impuestos, inversión).
- **Stock de obra** (16-10): Pexels vertical 4K (`pexels.com/download/video/<id>/` baja el archivo; buscar con `?orientation=portrait`). Mixkit solo da 720p horizontal: recortado a vertical queda blando. Aprobados: columnas con hierros (34521512), losa con grúas (34764180), ladrillero (39356774), fundaciones (34199756), malla desde arriba (35631524); del banco, `PLANOS.mp4` y `CONSTRUCCION.mp4` (este es el mismo clip que Pexels 26563090: no usar los dos). Ladrillo y hormigón se leen rioplatenses; evitar obreros que se lean de otro país.
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

- `12-10 REB Hoy tenemos 200 apartamentos` (19,6 s, aprobado 2026-10-29, "quedó excelente") — reel a cámara de una asesora del equipo, una toma, con drones del cliente:
  - 0–1,8 s: a cámara caminando hacia el celular, "Hoy tenemos **200** apartamentos", destello cálido en el 200.
  - 1,8–3,3 s: drone de la Rambla (whip + drop de la música), "en venta en **MONTEVIDEO**".
  - 3,3–5 s: stock de obra, "algunos **EN POZO** para quienes **prefieren**".
  - 5–7,3 s: a cámara, "pagarlo en cuotas mientras se va construyendo" (karaoke).
  - 7,3–8,7 s: drone de torres, "y otros **ya terminados**"; vuelve a cámara en "para quienes necesitan mudarse ya".
  - 9,9–11,2 s: panorámica de drone, "con una **cartera así de grande**"; a cámara "lo más probable es que encontremos la unidad que necesitás".
  - 13,7–15,2 s: drone del Parque Central, "y en la zona de tu preferencia".
  - 15,2–19,6 s: CTA a cámara, "**ESCRIBINOS** para saber qué **necesitás** y te contamos qué tenemos disponible", punch-in anclado a los ojos en la última frase.
  - Transiciones en cada corte (whip en los drones, zoom-blur en la vocera) con whoosh; pop/stamp/wink en los títulos. Master −10,9 LUFS / −1,5 dBTP.

- `16-10 REB Título pendiente` (loop de 23,25 s, aprobado 2026-10-29) — sin voz ni cara, solo música (*Rising Forest*), un corte cada 2 tiempos:
  - 0–1,9 s: folleto de Site con lapicera (IMG_5554), "de la / **IDEA**" (degradé) con destello cálido.
  - 1,9–14,5 s: planos → 6 fotos de la obra con zoom alternado ("a la / **OBRA**" en verde) intercaladas con stock de obra.
  - 14,5–16,5 s: drones del cliente (torres terminadas, barrio) con whip.
  - 16,5–20,3 s: pared de la oficina "convertimos / proyectos" → folleto IMG_5561 → "en ideas / sólidas". **No poner transiciones dentro de un mismo plano** (corrección: un zoom-blur en mitad de la pared "parece una transición al mismo plano").
  - 20,3–23,25 s: logo de Site sobre blanco armado pieza por pieza (`scripts/logo_piezas.py`): baldosas del arco de abajo hacia arriba, letras de "site" que suben, acento mostaza de la i que cae, DESARROLLO que se cierra; 640 px de ancho centrado; whip de salida que empalma con el arranque del loop.
  - **Versión corta (pedido del usuario, 2026-10-29: "15 s máximo, misma estructura")**: 28 tiempos = 13,55 s, la entregada. Folleto + IDEA (2 unidades de 2 tiempos), 4 fotos + 1 stock con OBRA en las dos primeras, 1 drone, paredA / folleto 5561 / paredB (una unidad cada uno), logo (3 unidades). **Los loops de REB van de ≤15 s**: con este tema, 28 tiempos (32 tiempos daría 15,5 s).

## 11. Portadas
- **Por defecto la portada la hace el editor (Tomi)**; si la encarga, se diseña (ver 16-10 abajo). Al terminar el video se le pasan **2 frames** del crudo en `PORTADA/` (1080×1920, PNG): uno **sonriendo** y uno con la **boca cerrada**, con los ojos abiertos y la cara nítida. Buscarlos en las pausas y después de la última palabra (ahí suele sonreír).
- Estilo de su portada en 12-10 (`assets/portada-1210.jpg`): velo verde salvia arriba, título de dos líneas en Montserrat ("Hoy tenemos **200** / apartamentos ***EN VENTA***") con la cifra en el degradé mostaza→crema, sobre el frame sonriendo.
- Portada diseñada (16-10, aprobada 2026-10-29, `assets/portada-1610.jpg`): foto de la obra del cliente (excavadora) con velo verde oscuro `#3A5248` arriba (0,9 → 0,62 hasta y 900, se apaga en y 1130) y degradé oscuro abajo; "De la **idea** / a la ***OBRA***" centrado en y ≈ 580–840: "De la" / "a la" en Light blanco 104 px, "idea" en Black degradé mostaza→crema 150 px, "OBRA" en Black Italic verde salvia con contorno blanco. Hecha en PIL (`PROYECTO/portada.py` del 16-10).
- Cuando la deja, se inserta como **frame 0** con `portada_primer_frame.sh` de la skill `portadas-reels` (30 fps), sin cambiar la cantidad de cuadros.

## 12. Al cerrar cada video
Seguir la regla 11 de la base: las correcciones que sean gusto de Reji se agregan acá (con fecha y video de origen); las que valen para todos van al coordinador.