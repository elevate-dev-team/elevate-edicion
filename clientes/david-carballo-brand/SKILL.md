---
name: david-carballo-brand
description: Identidad visual para video de David Carballo (DC), Realtor en Tampa / Brandon, Florida (Home Prime Realty). Tipografía Open Sans con mezcla de pesos (Medium de base + ExtraBold / ExtraBold Italic en la palabra importante, en MAYÚSCULA si es la idea fuerte; Open Sauce One como variante permitida), subtítulos blancos con borde navy al pecho que nunca tapan la cara, títulos y precios con la última palabra en degradé dorado y entrada con bloque dorado, B-roll en los momentos importantes, marca de agua Home Prime al 40 % solo en tours de casa, música funk para redes, paleta carbón / navy / crema / blanco + dorado, más la referencia de ocho piezas aprobadas (tours de propiedad en Tampa y Brandon, reel "Soy Realtor", reel a cámara con B-roll sobre Citizens, reel de representación con croma, reel educativo con rotoscopia, reel con grabación de pantalla en ventana sobre fondo de marca reel en off sobre un calendario filmado por David y reel educativo a cámara con motion de marca sobre la Enmienda 3) y la guía de portadas con caja navy. Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de David Carballo / DC (reels, tour house, pauta de propiedades, portadas), o cuando el usuario diga "editá el video de David", "video de DC", "con la marca de David Carballo", aunque no mencione la skill.
---

# David Carballo (DC) — Marca para video

Reglas obligatorias (márgenes, cara, audio, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 5 de esta skill. Acá va solo lo propio del cliente.

- Cliente: **David Carballo**, Realtor en **Tampa / Brandon (Tampa Bay, Florida)**, broker **Home Prime Realty**. Siglas de archivos: **DC**.
- Vocero: David solo, a cámara (caminando en la propiedad, sentado, o frente a fondo neutro / croma).
- Público y lugar: hispanos en Tampa Bay que compran su casa. **El stock tiene que parecer de Tampa / Florida**: casas bajas de una planta, palmeras, robles, downtown de Tampa y el río Hillsborough. Moneda: **USD**, superficie en **pies cuadrados**.
- Tono: cercano y directo. **Tú o voseo según el audio**: a veces tutea ("quieres", "escríbeme", "pregúntame") y a veces vosea. Los subtítulos dicen exactamente lo que se escucha en ese video, sin cambiar de uno a otro. Spanglish inmobiliario que Whisper rompe: *listing, in-law suite, shed, HOA, deed restriction, countertops, backsplash, closing, Citizens, FHA*.
- CTA habitual: "¿La visitarías? en los comentarios", "Escríbeme por DM y te paso todo", "Pregúntame".
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM DC Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/ EXPORT/`. El final va en `EXPORT/` con el nombre de la carpeta `.mp4`. La voz limpia está en `VOZ/AUDIO MEJORADO.wav`.
- Formato de las referencias: 1080×1920, **25 fps**, 19–64 s (tours 35–65 s, reels a cámara 20–50 s). 05-10 se hizo a **30 fps** (crudos del iPhone a 60 fps en HDR → SDR con `avconvert`).
- **Marca de agua (solo TOUR HOUSE, donde se muestran propiedades):** `{CARPETA_CLIENTE}/00 IMAGEN DE MARCA/MARCA DE AGUA DAVID.mp4` (logo Home Prime sobre verde; el repo no guarda .mp4). Quitar el verde con croma, dejarla centrada como viene, **opacidad 40 %**, todo el video. Si se renderiza fuera de Premiere: `assets/logo-home-prime-blanco.png` al 40 %. En reels a cámara sin propiedad **no va**. Sin placa final.
- **Logo Home Prime arriba a la derecha** (05-10, aprobado; pedido del usuario del 2026-10-21): `assets/logo-home-prime-*.png`, 240 px de ancho, caja x 735–975 / y 75–303, opacidad 100 %, sin animación, por encima de todo. Va en **blanco sobre fondos oscuros** (el escritorio negro del calendario, la casa con sombra) y en **negro sobre fondos claros** (la pared del living de David, la mayoría del stock). Se cambia solo en los cortes. Los títulos de la franja de arriba empiezan en y ≥ 318 para no tocarlo.

## 1. El manual vs. los videos
La imagen de marca es una paleta de Coolors (`assets/paleta.png`), el logo de Home Prime Realty (`assets/logo-home-prime-*.png`) y la marca de agua. De la paleta pasan el **navy** (borde de subtítulos, caja de portadas) y el **crema** (final del degradé dorado). El **dorado** no está en la paleta pero es la firma de los videos: sale de los títulos aprobados y se mantiene.

## 2. Tipografía — Open Sans
Archivos en `assets/fonts/open-sans/` (licencia **OFL**, libre). Premiere la toma de Adobe Fonts o de estos archivos. Medium se generó desde la variable oficial de Google Fonts (wght 500). Open Sans no tiene "Black": **ExtraBold es el Black de David**.
Interletrado medido: **subtítulos −4 %**, **títulos y precios −10 %** (en Premiere, tracking ≈ −40 y ≈ −100). Interlineado de títulos **~0,85** (las líneas casi se tocan).

| Uso | Peso |
|---|---|
| Subtítulo base | Open Sans **Medium** |
| Palabra importante, cifras, nombres de lugar | Open Sans **ExtraBold** (MAYÚSCULA si es la idea fuerte: Soy **REALTOR**, Sin **HOA**) |
| Acento / énfasis emocional | Open Sans **ExtraBold Italic** (*ser representado*, *POR LÍNEA*) |
| Títulos del gancho y CTA | Medium + ExtraBold en la misma frase, última palabra en dorado |
| Precio | **ExtraBold** grande: `USD` blanco + cifra dorada |

**Variante permitida — Open Sauce One** (Medium + Black Italic): se usó en 02-10 (reel de representación, look más "editorial", con interletrado muy negativo y sombra suave en vez de borde). Usarla solo si la pieza pide ese tono; no mezclarla con Open Sans en el mismo video. No está en `assets/`: instalarla aparte (Open Sauce Fonts, OFL).

## 3. Color
| Nombre | HEX | Uso en video |
|---|---|---|
| Carbón | `#232529` | sombras, fondos de placa |
| Navy | `#263142` | **borde/sombra de los subtítulos**, caja de portada (≈85 %) |
| Crema | `#FFF3C9` | final claro del degradé dorado |
| Blanco | `#FFFFFF` | subtítulos, títulos base, `USD` |
| Dorado (degradé) | `#DFC87F` → `#F0E5C5` | última palabra del título, cifra del precio, palabra clave de portada (oscuro arriba, claro abajo) |
| Dorado bloque | `#D2B759` | bloque que barre y revela los títulos |

## 4. Sistema de texto y acabado
Ver `assets/sistema-texto.jpg` (frames de las referencias) y `assets/prueba-sistema.jpg` (subtítulo + título + precio armados con las fuentes de `assets/`). Los títulos de las referencias se renderizaron sobre verde y están en el `RECURSOS/` de cada pieza (ej. `08-09 …/RECURSOS/SHED.mp4`): sirven para comparar medidas.
- **Subtítulos:** 1–3 palabras por pantalla, **64 px** de cuerpo (mayúscula 46 px), interletrado −4 %, centrados. Mezcla Medium + ExtraBold ("respondo **EMAILS**", "mis **clientes**", "en **LAKEMONT HILLS**"). Blancos con **borde navy `#263142` (~4 px) + sombra corta**. Al **pecho / debajo del mentón** (y ≈ 1000–1150 según el encuadre): **nunca tapan la cara**. Sobre B-roll, al centro. Entran por corte.
- **Títulos (gancho, datos, CTA):** 2–3 líneas apiladas, Open Sans **~110 px** en la línea blanca y **~140 px** en la palabra dorada (mayúscula ~100 px), interletrado −10 %, interlineado ~0,85, centrados o al centro del plano debajo de la cara. Estructura: línea en Medium/ExtraBold blanco + **última palabra o lugar en ExtraBold con degradé dorado** ("¿Necesitás una **casa** / con 4 HABITACIONES / **en TAMPA?**", "hay un SHED / **INDEPENDIENTE**"). Entrada: un **bloque dorado `#D2B759` barre** y revela el texto (o escritura palabra por palabra al ritmo de la voz). Título *o* subtítulo, no los dos.
- **Rotoscopia en los títulos con palabra dorada** (pedido del usuario, 2026-10-19, 07-10: "para que quede más profesional"): cuando el título está sobre David a cámara, va **detrás de él**, apoyado sobre la cabeza (solo el pie de la última línea pasa detrás; si esa línea es una bajada chica, ~30 % de su alto). Proceso y medidas: regla 10 de `edicion-reels-base` (`roto_video.swift` + `limpiar_mascara.py`). Sobre B-roll (ej. "a **PAGAR**" sobre dólares) no hace falta. Si arriba de la cabeza está el logo de Home Prime en la pared (oficina), no taparlo: ese título va debajo del mentón, sin rotoscopia ("no es una **TRAMPA**", 07-10).
- **El dorado solo sobre fondos oscuros** (05-10: "días" en dorado sobre la hoja clara de una agenda "no se alcanza a leer"). Sobre un fondo claro, la palabra va en **blanco dentro de una caja navy `#263142`** (esquinas de 10 px, sombra suave), como en "30 a 45 / **DÍAS**".
- **Precio y datos:** "**USD** 374,900" (USD blanco, cifra dorada, ~140 px, interletrado −10 %, sombra suave). Datos sueltos grandes ("**4** HABITACIONES", "**1400 pies** cuadrados", "8600 PIES") al nombrarlos. SFX *CashMoney* en el precio.
- **B-roll en los momentos importantes:** en reels a cámara, cada concepto concreto (firma, contrato, teléfono, seguro, préstamo, aseguradora, la ciudad) se corta a B-roll a pantalla completa; logos reales cuando nombra una entidad (ej. Citizens en tarjeta blanca redondeada). En tours, cada ambiente es su plano, con una palabra que lo nombra (BACKSPLASH, Y GRIFERÍA, countertops).
- **Transición de la casa:** **zoom / whip con desenfoque de movimiento** entre bloques (Transform con ángulo de obturación). Swoosh en cada una.
- **Zooms y ritmo:** tours con plano cada **1–2 s**; reels a cámara con punch-in entre frases y cambios de locación (calle, cocina, escritorio, sillón) para sostener el ritmo. Arranque opcional en blanco y negro que pasa a color en el giro (02-10).
- **Música:** **funk para redes** (groove, bajo marcado, sin voces) bajo la voz. En reels educativos/serios a cámara (contratos, trámites) el usuario eligió *Lost In The Fire* (Gesaffelstein & The Weeknd, instrumental, `{MUSICA}/`) **desde 0:11**, a ~13 dB bajo la voz (07-10). En 06-10 (tutorial de verificar la licencia) se usó *Timeless (Instrumental)* (`{MUSICA}/`) con el drop (26,25 s del tema) en la entrada a la pantalla: a −13 dB quedó "demasiado FUERTE" y se aprobó a **−16 dB bajo la voz** (voz −12 / música −28 LUFS). Para DC empezar en −16 dB con temas densos (trap, oscuros). Con funk liviano (poca energía en 1–4 kHz) se aprobó −13 dB: *Gimme that Groove!* (Mixkit) en 05-10, desde el seg. 8 del tema, y *Funkee Monkeee* (Mixkit) en 04-10, desde el inicio. **Siempre instrumental, sin voz cantada** (04-10: *Keep the Funk ON* tenía voz de cantante y se cambió; verificar con `vocales.py` de la base). Ver `references/biblioteca.md`. Niveles: los de la base (las referencias quedaron entre −24 y −19 LUFS, **por debajo** del master de la base: no copiar eso).
- **SFX:** Swoosh 04, Transition Complex 14 (transiciones), Eye Wink / Mouse Click (entrada de títulos y palabras clave), CashMoney (precios).
- **Grabaciones de pantalla** (06-10, aprobado "Excelente"): la grabación del celular de David va en una **ventana de 720×900 (x 180–900, y 290–1190) con esquinas de 41 px y borde de 5 px en degradé dorado**, sobre un fondo **degradé radial navy `#33415A` → `#263142` → carbón `#232529`**, con **líneas doradas finas a 135° al 7 %** que se desplazan lento y dos brillos dorados suaves. Adentro, cámara virtual que se acerca a cada dato que nombra, **recuadros dorados `#D2B759`** con pop sobre el dato (blanco sobre botones amarillos de la web), y la página se oscurece cuando entra un título encima. Subtítulos fijos debajo de la ventana. Plantilla: `assets/remotion/Video-pantalla.tsx`. Proceso general: regla 4.2 de `edicion-reels-base`.
- **Tarjeta de David** (cuando dice "le mando mi tarjeta" o se presenta como agente): tarjeta navy en degradé con borde dorado fino, logo Home Prime blanco, "REALTOR®" espaciado en dorado, **DAVID CARBALLO** ExtraBold, "Home Prime Realty · Tampa, FL" en crema y **LICENCIA SL3630377** con el número en degradé dorado (número de licencia público del DBPR: Sales Associate, activa hasta 09/30/2028). Entra deslizando desde abajo y el número hace pop cuando lo nombra.
- **Conceptos sin stock propio → motion de marca antes que stock genérico** (pedido del usuario en 06-10: "intentemos no utilizar mismo stock de video que usamos con anterioridad"). Ej.: "tu W-2 y tus estados de cuenta" se resolvió con un W-2 y un estado de cuenta dibujados (montos desenfocados) que entran con pop sobre el fondo de marca. En 04-10 (Enmienda 3, 75 s, un solo set) el 30 % del video fue motion de marca: dos casas de $350.000 con la barra de exención, boleta de la Enmienda 3 con la fecha, línea de tiempo año 1→5, comparación TÚ vs. TU AMIGO y checklist; fondo navy de 06-10, tarjetas navy con borde dorado, subtítulos fijos debajo del gráfico (`assets/remotion/Video-motion.tsx`). Antes de elegir stock, revisar qué clips se usaron en los reels anteriores de DC (`public/dc*/` del proyecto de Remotion y `RECURSOS/` de cada pieza) y no repetirlos.
- **Stock:** material propio primero (tomas de la casa, de David en la propiedad). Stock de Tampa/Florida y de trámites (firma, documentos, teléfono, dólares). Lista de lo ya usado y cómo sacarla de los `.prproj`: `references/biblioteca.md`.
- **Tomas cenitales propias de David (calendario, papeles):** vienen casi cuadradas (1078×1216 / 1078×1094). En 05-10 se centraron más abajo (centro y = 1150) sobre un degradé del color del escritorio `#34322D`, con los bordes del video difuminados (70 px) y una franja oscura arriba: ahí van títulos y subtítulos, y el logo blanco. Las tomas se usan como B-roll de lo que dice (rodea el 25 → "antes del 25 de diciembre"), no en el orden en que se grabaron.

## 5. Portadas
Analizadas (`assets/portadas.jpg`), en `01 REELS/`: `10 OCTUBRE/04-09 …/PORTADA/`, `10 OCTUBRE/02-10 …/PORTADA/`, `09 SEPTIEMBRE/11-08 …/PORTADA/`, `09 SEPTIEMBRE/14-09 …/PORTADA/`, `09 SEPTIEMBRE/07-09 DC Sin HOA y sin deed restriction/PORTADA/`.
- **Caja navy `#263142` (~85 %) con esquinas redondeadas** detrás del texto, pegada a un borde lateral o centrada en la parte alta.
- Lockup Open Sans muy apretado (interlineado ~0,85): Medium/ExtraBold blanco + **palabra clave o precio en ExtraBold con degradé dorado**, grande ("**$400,000**", "**TRABAJO**", "**SEGURO EN CITIZENS?**", "**$389,900**"). En portada el precio va con `$`.
- Tour house: fachada de la casa con cielo; reel a cámara: David sonriendo, más expuesto que el fondo, con el texto arriba o al costado de la cabeza.
- Variante 02-10: sin caja, texto blanco + *ExtraBold Italic dorado* sobre fondo claro.
- Variante 07-10 (hecha por el usuario): sin caja, texto blanco Medium + **ExtraBold Italic** en la palabra clave y la frase final en *ExtraBold Italic dorado* ("¿Por qué te pido **FIRMAR** / antes de ver *una CASA?*"), arriba de la cabeza, David sonriendo en la mesa.
- Variante 06-10 (hecha por el usuario): sin caja, ExtraBold Italic blanco con las palabras clave en dorado ("Busca a tu **REALTOR** / antes de mandarle tus **PAPELES**"), sobre el plano abierto de David sentado frente al muro verde, a la altura del logo.
- Variante 04-10 (hecha por el usuario): sin caja, "¿Comprar casa en Florida?" en Medium blanco + "*CUIDADO*" ExtraBold Italic blanco + "con esto en **2027**" en dorado, apretado arriba de la cabeza, David sonriendo en el sillón frente a la pared de listones.
- **A veces la portada la hace el usuario** ("de la portada me encargo yo", 07-10, 06-10, 05-10 y 04-10): no generarla. Lo que pide es **2 frames de David** para armarla, **sonriendo o con la boca cerrada** ("para que quede más profesional"): buscarlos en las pausas y en el cierre del CTA, revisarlos recortados a la cara (con la sonrisa achina los ojos: elegir el frame con los ojos más abiertos) y dejarlos en `PORTADA/` en PNG 1080×1920. Cuando deja la portada en `PORTADA/`, insertarla como frame 0 con `portadas-reels/scripts/portada_primer_frame.sh` (con los fps del video).

## 6. Referencias aprobadas (REFERENCIA, no fórmula)
Mirar antes de editar. Detalle en `references/piezas.md`.

### A. Tour house — `01 REELS/10 OCTUBRE/04-09 DC Título pendiente/` (63,9 s)
Casa remodelada de 4 habitaciones en Tampa, USD 374,900, sin HOA. Gancho con David en la entrada y título dorado, datos grandes sobre cada ambiente, a cámara en el patio para lo importante (fuera de zona de inundación), cierre "¿LA VISITARÍAS? en los comentarios".

### B. Tour house — `01 REELS/09 SEPTIEMBRE/08-09 DC Cuatro cuartos, sin HOA y un sh/` (36,6 s)
Brandon, 4 cuartos, shed independiente, USD 389,900. Ritmo más rápido, palabra por ambiente, CTA "ESCRÍBEME por DM y te paso TODO".

### C. Reel a cámara "Soy Realtor" — `01 REELS/09 SEPTIEMBRE/11-08 DC Soy Realtor, obvio que voy a es/` (18,8 s)
Trend corto: David cambia de locación cada frase (calle, cocina, escritorio, sillón), solo subtítulos con borde navy.

### D. Reel educativo + B-roll — `01 REELS/09 SEPTIEMBRE/14-09 DC Por qué algunas casas en Florid/` (27,2 s)
Citizens / seguros: sentado en living, B-roll de Florida y logo de Citizens, cierre selfie con títulos dorados ("PREGÚNTAME", "PARA AYUDARTE").

### E. Reel de representación (variante Open Sauce One) — `01 REELS/10 OCTUBRE/02-10 DC Título pendiente/` (51,6 s)
Arranca en B/N, fondo de follaje por croma, mucho B-roll de firmas y llamadas, Tampa aérea, cierre frente a puertas de granero.

### F. Reel educativo a cámara con rotoscopia — `01 REELS/10 OCTUBRE/07-10 DC Por qué te pido firmar antes de/` (24,8 s)
Acuerdo de representación de compradores (NAR, agosto 2024). El usuario entregó el corte hecho (3 locaciones: oficina con logo Home Prime → lobby caminando → mesa de café). Acabado en Remotion (plantilla en `assets/remotion/Video.tsx`): zoom continuo anclado a los ojos, whip en los cambios de locación, B-roll sobre la voz continua (agente con compradores, toma propia de David mostrando el acuerdo, casa de Florida desde dron, teléfono, dólares), títulos con rotoscopia, *Lost In The Fire* desde 0:11, portada del usuario en el frame 0.

### H. Reel en off sobre un calendario — `01 REELS/10 OCTUBRE/05-10 DC Título pendiente/` (30,5 s, 30 fps)
"¿Quieres pasar Navidad en tu casa nueva?": hook y cuerpo en off sobre tomas cenitales del calendario que filmó David (dic → nov → oct, rodeando fechas) más stock no repetido (formulario, agenda, llaves, casa, obra), y cierre a cámara con el CTA. Acabado en Remotion (`assets/remotion/Video-calendario.tsx`). Detalle en `references/piezas.md`.

### I. Reel educativo a cámara con motion de marca — `01 REELS/10 OCTUBRE/04-10 DC Título pendiente/` (74,8 s, 30 fps)
Enmienda 3 / Homestead Exemption: "dos compradores en 2027". Tres tomas en la oficina (pared de listones negra con el neón), estructura por etapas, voz procesada por nosotros, *Funkee Monkeee* a −13 dB, 2 títulos con rotoscopia (HOMESTEAD, APRUEBAN), 5 motion de marca, stock no repetido y portada del usuario. Acabado en Remotion (`assets/remotion/Video-motion.tsx`). Detalle en `references/piezas.md`.

### G. Reel educativo con grabación de pantalla — `01 REELS/10 OCTUBRE/06-10 DC Busca a tu realtor antes de man/` (22,4 s)
Cómo verificar la licencia de un realtor en myfloridalicense.com. El usuario entregó el corte (plano abierto sentado frente al muro verde con el logo → grabación de pantalla → selfie frente al logo → plano abierto). Acabado en Remotion (`assets/remotion/Video-pantalla.tsx`): motion de W-2 y estado de cuenta en el gancho, título "búscalo **AQUÍ**", grabación rearmada en alta en ventana sobre fondo de marca con cámara virtual y recuadros dorados, título "es PÚBLICO / y **GRATIS**", tarjeta de David con la licencia, título "antes de la / **PRIMERA** / reunión", *Timeless (Instrumental)* a −16 dB bajo la voz, portada del usuario en el frame 0.

## 7. Ideas que pueden sumar (opcionales, a criterio)
- Mapa simple de Tampa Bay marcando la zona de la casa (Brandon, Riverview, Tampa).
- Checklist de datos de la casa (habitaciones, baños, pies², HOA) que se completa durante el tour.

## 8. Correcciones del cliente
- **2026-10-19 · 07-10:** música cambiada de funk (*Bounce Me Brother*) a *Lost In The Fire* instrumental desde 0:11 para este tono. Rotoscopia en los momentos con palabra resaltada (títulos dorados sobre David). El resto aprobado sin cambios ("excelente").
- **2026-10-27 · 04-10:** estructura aprobada sin cambios. Acabado: la música (*Keep the Funk ON*) "está buena pero se escucha la voz de la cantante" → *Funkee Monkeee* (instrumental, medido con `vocales.py`). Portada del usuario como frame 0; para la portada pidió 2 frames de David sonriendo o con la boca cerrada. Aprobado.
- **2026-10-23 · 05-10:** estructura: zoom in lento en el primer plano (1,00→1,16 en 3,5 s, "para darle mayor profesionalismo"); el clip de la calculadora "se ve muy movido" y se cambió por TASADOR (temblor medido, regla 9 de la base); la agenda arranca con las hojas ya moviéndose. La voz la limpió el usuario. Acabado: "días" en dorado no se leía sobre la agenda y pasó a blanco en caja navy, dejando el título hasta el corte. Portada del usuario como frame 0. Música funk liviana (*Gimme that Groove!*) a −13 dB bajo la voz, aprobada (ver sección 4, música). Aprobado.
- **2026-10-20 · 06-10:** "y GRATIS" no se alcanzaba a leer (estaba 0,3 s): cada línea de título queda ≥ ~0,8 s completa (regla 10 de la base). Música *Timeless* bajada 3 dB (de −13 a −16 dB bajo la voz). Portada del usuario como frame 0. El resto aprobado ("Excelente").
