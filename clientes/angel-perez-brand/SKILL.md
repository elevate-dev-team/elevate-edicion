---
name: angel-perez-brand
description: Identidad visual para video de Ángel Pérez (AP), Realtor en Tampa / Tampa Bay, Florida (no confundir con Ángel Roque). Montserrat (Light/Regular de base + Bold/Black en la palabra clave, Bold/ExtraBold Italic de acento), subtítulos blancos chicos que nunca tapan la cara, titulares y precios resaltados en amarillo crema con glow amarillo efecto neón, rotoscopia para poner los títulos por detrás de Ángel o de la casa (solo cuando queda limpia), wink o swoosh en las palabras importantes, placas de fondo khaki texturado con círculos numerados en los educativos de listas, light leaks y zoom-blur como transición, paleta negro azulado + dorado + crema, música de Motion Array y stock ocasional, más la referencia de siete piezas aprobadas (tres pautas de propiedad: casa en Lutz, dúplex y apartamento frente al río; y cuatro reels educativos a cámara: alquilar vs. comprar, 3 errores, mitos de comprar casa, pronóstico del mercado en Tampa) y la guía de portadas (la portada la arma el editor: se le pasan 2 frames). Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Ángel Pérez / AP (reels, pauta de propiedades, portadas), o cuando el usuario diga "editá el video de Ángel", "video de AP", "con la marca de Ángel Pérez", aunque no mencione la skill.
---

# Ángel Pérez (AP) — Marca para video

Reglas obligatorias (márgenes, cara, audio, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 5 de esta skill. Acá va solo lo propio del cliente.

- Cliente: **Ángel Pérez**, Realtor en **Tampa / Tampa Bay, Florida** (en las referencias: Lutz, zona de la USF / Fletcher Ave., frente al río Hillsborough cerca de Armature Works). Siglas de archivos: **AP**. Ojo: **Ángel Roque** es otro cliente, con otra carpeta.
- Vocero: Ángel, solo, a cámara. Joven, pelo rizado, a veces con anteojos. En pauta recorre la propiedad caminando (camisa y pantalón de vestir, o ropa casual); en educativo habla sentado en plano medio (camisa y corbata en oficina, o casual en la vereda de un café).
- Público y lugar: latinos de habla hispana en el área de Tampa que quieren comprar casa (muchos hoy alquilan o no tienen residencia). **El stock tiene que parecer de ahí**: casas de una planta de Florida central, robles con musgo español, lagos y ríos, cielos de Florida. Moneda: **USD con coma de miles, formato EE. UU.** (`$520,000`, `$435,000`), como en las piezas aprobadas más recientes (las dos primeras, A y B, usaban punto: `$525.900`; ya no).
- Tono: cercano, entusiasta, directo; preguntas gancho ("¿Quieres vivir frente al río…?", "Te cuento una forma fácil de…"). **Español neutro con tuteo** ("puedes", "comenta", "mira"): nunca voseo. Términos de EE. UU. como los usa él: HOA, casero, renta, hipoteca, preaprobación, crédito, countertop, walk-in closet, REALTOR.
- CTA habitual: **"Comenta «palabra»"** (lago, río, dúplex, número…) + lo que ofrece ("y agendamos tu visita", "y calificamos tu perfil para esta propiedad"). En educativos también: "Guarda este video y envíaselo a quien está por comprar" / "Sígueme para más". Se dice a cámara y se pone en pantalla (ver 4).
- Carpeta: `{CARPETA_CLIENTE}/01 REELS/<MM MES>/<DD-MM AP Título>/` con `VOZ/ PROYECTO/ PORTADA/ RECURSOS/ EXPORT/ MUSICA/` (plantilla vacía en `01 REELS/000/`, que además trae `VIDEOS/` para los crudos). El final va en `EXPORT/` con el nombre de la carpeta (`<carpeta>.mp4` o `<carpeta>_1.mp4`); la voz tratada queda en `VOZ/AUDIO MEJORADO.wav`; la portada en `PORTADA/`. Marca: `{CARPETA_CLIENTE}/00 IMAGEN DE MARCA/`.
- Formato de las referencias: 1080×1920, 25 o 30 fps (las de octubre en 25), 33–47 s.
- **Sin logo** (no tiene). Sin placa final: termina cuando termina de hablar.

## 1. El manual vs. los videos
El único material de marca es la paleta (`assets/paleta-angel-perez.png`, de coolors) y la fuente Montserrat. En los videos la paleta casi no aparece como fondo: lo que manda es **blanco para el subtítulo y amarillo crema con glow para lo resaltado**. Los oscuros sirven para círculos numerados, sombras o fondos; el khaki aparece oscurecido y texturado en las placas de los educativos (ver 4).

## 2. Tipografía — Montserrat
Archivos en `assets/fonts/montserrat/` (licencia OFL, libre; incluye las itálicas). Interletrado apretado (≈ −2/−3 %), interlineado de los títulos ≈ 0,85: las líneas casi se tocan.

| Uso | Peso |
|---|---|
| Subtítulo base | Light / Regular |
| Palabra clave del subtítulo, cifras, nombres ("**vivir**", "**HOA?**", "**apartamento**", "**casero**") | Bold / ExtraBold |
| Palabra suelta de acento en el subtítulo ("*están*", "*completamente*", "*actualizadas*") | **Bold / ExtraBold Italic** |
| Titulares resaltados y precios (amarillo con glow) | **ExtraBold / Black** |
| Frases en MAYÚSCULA blancas ("SIN CONTRATO / SIN HEREDAR INQUILINO", "PREAPROBACIÓN") | ExtraBold / Black |
| Línea chica de apoyo debajo del titular ("con vista al lago", "a tu casero") | Regular + Bold en la palabra clave, blanco |
| Texto de placa educativa ("**CAMBIAR** de trabajo / en el medio del **PROCESO**") | Light/Regular Italic + ExtraBold Italic MAYÚSCULA en la clave |
| Datos apilados ("**3** cuartos / **2** baños") | número Bold + palabra Light |
| Lugar en contorno ("EN LUTZ") | Black MAYÚSCULA, solo contorno blanco (~3 px), relleno transparente |

## 3. Color
| Nombre | HEX | Uso en video |
|---|---|---|
| Negro | `#151519` | Sombras de texto |
| Negro azulado | `#201F2A` | Círculos numerados (medido `#1C1B25`), fondos de placa, contraste |
| Dorado | `#BEA04C` | Acentos sobrios, borde/base del glow cuando el fondo es claro |
| Khaki | `#CEBF78` | Glow amarillo, detalles |
| Khaki oscuro texturado | ≈ `#7B7144` (rango `#6B643B`–`#8A814C`) | Fondo de las placas educativas, con rayones y viñeta |
| Crema | `#EFEBD4` | Texto sobre oscuro, alternativa al blanco |
| Blanco | `#FFFFFF` | Subtítulos, línea de apoyo, "Comenta", íconos de línea |

**El amarillo de los titulares** (medido en las seis referencias): relleno crema-amarillo **≈ `#EFDD9B`**, con **glow exterior amarillo** (khaki `#CEBF78` → dorado `#BEA04C`, más saturado hacia el borde del brillo) que le da el efecto de neón. No usar otros colores de acento (ni rojos, ni azules, ni verdes en textos), aunque el stock los traiga. Sobre una pared clara (su oficina) el glow solo no despega: sumarle una sombra oscura corta debajo (`0 2px 2px` y `0 5px 16px` en `#151519` al 45 %), como en 09-09.

## 4. Sistema de texto y acabado
- **Subtítulos:** blancos, Montserrat Light/Regular con la palabra clave en Bold, **sin caja**, con sombra suave apenas visible. **1–3 palabras por bloque** (a veces 2 líneas cortas), minúscula tipo oración como se habla; signos de pregunta y punto final cuando cierran frase. Una palabra sola en Bold/ExtraBold Italic sirve de acento sobre B-roll. Tamaño ≈ 55–65 px en plano medio a cámara, ≈ 40–50 px en planos abiertos y recorridas. Entran por bloque con un fundido/desenfoque muy corto.
  - **Nunca tapan la cara.** A cámara en plano medio: sobre el pecho, debajo del mentón (y ≈ 1100–1250, según dónde quede la cara). En plano abierto con Ángel chico: a su lado o a la altura del torso, nunca cruzando la cabeza. Sobre B-roll: centrados.
  - Cuando hay titular amarillo en pantalla, el subtítulo se oculta o se convierte en la línea de apoyo blanca del titular.
- **Titulares resaltados (la firma):** precio, cifra o frase clave en Montserrat ExtraBold/Black amarillo con glow neón, grandes (≈ 150–190 px; el precio ocupa casi todo el ancho seguro), con una línea de apoyo blanca más chica arriba o debajo ("por **menos** de / **$520,000**", "**8910** / pies cuadrados", "**3 ERRORES**", "**HERMOSA VISTA**", "**ÁNGEL PÉREZ**" / "y soy **REALTOR** en…"). Entran con fundido + desenfoque que se asienta; el glow puede entrar más fuerte y asentarse.
- **Rotoscopia (muy usada):** los titulares van **por detrás de Ángel** (de su cabeza y pelo) o **por detrás de elementos de la casa / del paisaje** (árbol, techo, columna). Varios por video, no uno solo. Que siempre se lea: solo una parte chica del texto queda detrás (pie de la cifra, una letra del medio), nunca la mitad de la palabra; si tapa demasiado, mover el texto. Máscara con seguimiento cuadro a cuadro, bordes del pelo suaves (pelo rizado: cuidar el contorno), sin halo ni saltos; revisar todo el tramo en el render.
  - **Si no queda limpia, sin rotoscopia** (corrección del editor, 2026-10-27, 09-09: "si no podés hacerla bien prefiero que la dejes como estaba y que no se note"). En sus **selfies de oficina** la cara queda muy alta (tope del pelo en y ≈ 220–480): un titular detrás del pelo se sale de la zona segura o queda casi entero tapado cuando sube la cabeza. Ahí los titulares van **al pecho, debajo del mentón** (con la línea de apoyo en el lugar del subtítulo) o **enteros por encima de la cabeza** si sentado deja lugar (en 09-09: "a finales de / NOV · DIC").
  - También se usa para **reemplazar el fondo** detrás de Ángel con stock (ej. gráfico de bolsa verde subiendo cuando habla de que el pago no sube). Recorte limpio; lo de adelante es él.
- **Placas educativas (listas "número uno, dos…"):** pantalla completa de **khaki oscuro texturado** (rayones finos, viñeta suave; ≈ `#7B7144`) en lugar de Ángel. **Círculo negro azulado** (Ø ≈ 240 px) con el número blanco Montserrat Bold (≈ 110 px), centrado; entra primero y después aparece el texto debajo, centrado, en blanco Light/Regular Italic + ExtraBold Italic MAYÚSCULA en la clave (≈ 60–75 px, 1–2 líneas). Pueden llevar un **ícono** chico centrado debajo: de línea blanca (casa con $) o circular a color (bandera de EE. UU., casa en círculo blanco). La frase destacada de cierre puede ir en amarillo con glow sobre la placa ("y esto es **MÁS COMÚN / DE LO QUE CREES**").
- **Preguntas gancho**: la frase del hook aparece en blanco ("¿Quieres vivir **frente** / al **RÍO**?") y la siguiente idea puede aparecer translúcida/desenfocada por detrás de él antes de asentarse.
- **Lugar:** nombre de la zona en MAYÚSCULA Black solo con contorno blanco ("EN LUTZ"), sobre la fachada.
- **Datos de la casa:** apilados centrados, número Bold + palabra Light, blanco ("3 cuartos / 2 baños").
- **CTA:** "Comenta" blanco Bold + la palabra entre comillas grandes en amarillo con glow ("Comenta / **“RÍO”**", "Comenta / **“DÚPLEX”**"), con la segunda frase en blanco MAYÚSCULA o amarillo debajo ("y **CALIFICAMOS**" → "**TU PERFIL** para / **ESTA PROPIEDAD**"), a la altura del pecho o arriba de la cabeza, nunca sobre la cara. En educativos: "**GUARDA ESTE VIDEO**" amarillo + "y envíaselo a quien…" blanco.
- **SFX en las palabras importantes: wink o swoosh** (pedido del editor, 2026-10-27, 09-09: "en los momentos de las palabras importantes UTILIZA WINK o SWOOSH"). Cada titular amarillo entra con *Eye Wink Sound Effect* (solo el primer guiño, ~0,7 s del archivo) en lugar del pop, y las palabras clave en Bold del subtítulo alternan *wink* y *whoosh slide*, con el pico en el arranque de la palabra y ~3 dB por debajo de los de los titulares. En 09-09 quedaron 61 SFX en 48,7 s.
- **Transiciones:** el video arranca con un **zoom-blur / whip** que entra al primer plano. Entre ambientes y al pasar de exterior a interior, zoom-blur / whip con desenfoque de movimiento (la de la casa). **Light leaks cálidos** (naranja/ámbar) para entrar a una placa o a un ambiente luminoso. SFX de Animation Composer: *Swoosh 04-02*, *Swoosh Transition 28*, *Transition Complex 14*.
- **Ritmo:** pauta de propiedad 39–46 s, B-roll de cada ambiente cada ~1,5–2,5 s sobre su voz, con Ángel a cámara en el hook, en algún dato fuerte y en el CTA. Educativo a cámara 34–47 s: punch-ins y reencuadres seguidos, placas para cada punto de la lista, insertos de stock cortos.
- **Música:** aprobado en 09-09: *Gimme that Groove!* (Mixkit, instrumental) a **−16 dB de la voz con el hueco de EQ** de la base. Con movimiento pero por debajo de la voz; en las referencias, temas de Motion Array (*Summer Waves*, *Models*, *Break Down The Silos*, *Evergreen*), y funk / groove de `{MUSICA}`. Niveles: los de la base (las referencias van de −22 a −15 LUFS: **no copiar ese volumen**).
- **Stock / B-roll:** de vez en cuando, no en todo el video. Primero el material del rodaje (la casa, el edificio, el barrio, el río). Stock útil para educativos: llaves de casa, billetes, firma de papeles, pareja recorriendo una casa, tablero de auto (financiar un carro), apretón de manos; en pauta, para servicios incluidos (agua, enchufe/cable). Si falta algo de lugar: Tampa Bay / Florida central (lagos, robles, casas de una planta). Nada que se lea europeo o argentino.

## 5. Portadas
**La portada la arma el editor** (09-09, 2026-10-27: "de la portada me encargo yo"): no se diseña. Se le pasan **2 frames** del video con Ángel mirando a cámara, sonriendo o con la boca cerrada (`portadas-reels` §7), y cuando deja la portada en `PORTADA/` se inserta como frame 0. La guía de abajo sirve para elegir frames que le dejen lugar al texto arriba de la cabeza y por si algún día la pide.
Guía sacada de las cuatro portadas de octubre (`assets/ref-portadas.jpg`; archivos en `PORTADA/` de cada pieza). Se arma con `portadas-reels`, con estas particularidades:
- **Frame del propio video**, con Ángel centrado (de cuerpo entero en la fachada o de medio cuerpo / pecho para arriba), mirando a cámara. Parte de arriba oscurecida con degradé para que el texto se lea.
- **Texto arriba de la cabeza**, centrado, dentro del cuadrado central (y ≈ 470–900), con aire sobre el pelo: en AP el texto no va debajo del mentón.
- Dos niveles: el **golpe** en Montserrat Black/ExtraBold amarillo `#EFDD9B` con glow (precio "$435,000", "3 ERRORES", "APRENDER ESTO"), muy grande, y la **bajada** blanca Bold/ExtraBold (o Bold Italic) con la palabra clave en Black/MAYÚSCULA ("3 habitaciones **frente al RÍO** en **Tampa**", "Me tomó **+ de 3 AÑOS**"). La bajada puede ir arriba o abajo del golpe.
- Interlineado muy apretado, como en los titulares del video.

## 6. Referencias aprobadas (REFERENCIA, no fórmula)
Mirar antes de editar. Sirven para entender el criterio, no para copiarlas. Capturas en `assets/ref-*.jpg`. Las piezas A y B están en el otro equipo (no en `{CARPETA_CLIENTE}`); las demás, en `{CARPETA_CLIENTE}/01 REELS/10 OCTUBRE/<carpeta>/EXPORT/`.

### A. Pauta de propiedad — `01-10 AP TAMPA 519,999` (39 s) · `ref-pauta.jpg`
- Hook a cámara en el living (plano abierto, techo con claraboyas): "¿Sabías que podrías **vivir** frente a un lago…" → **$525.900** amarillo con glow **detrás de Ángel** + "y sin pagar **HOA?**".
- Fachada con "esta **casa**" y **EN LUTZ** en contorno; "remodelada", "solo **piso.**".
- Ambientes con datos apilados ("3 cuartos / 2 baños / 1 oficina"), subtítulos chicos de 1–3 palabras, zoom-blur entre ambientes.
- Patio: **"terraza techada / con vista al lago"** detrás del árbol (rotoscopia).
- CTA sentado en el sillón: "Comenta **“lago”** y coordinamos para que veas esta hermosa casa antes…".

### B. Reel educativo a cámara — `21-09 AP Título pendiente` (34 s) · `ref-educativo.jpg`
- Alquilar vs. comprar. Hook: "Si pagas **$2.000** de renta…" con la cifra blanca entrando desenfocada **detrás de su cabeza**.
- "después **de 5 años** le habrás dejado" → **+$120.000** amarillo con glow detrás de la cabeza + "a tu **casero**".
- Stock corto con subtítulos centrados: llaves, billetes y maqueta de casa.
- Fondo reemplazado por gráfico de bolsa verde con Ángel recortado ("tu pago no sube…").
- CTA: "Comenta **“número”** y te digo de acuerdo a tu situación si puedes comprar o seguir…".

### C. Pauta de dúplex (inversión) — `02-10 AP TAMPA 550` (41 s, 25 fps) · `ref-pauta-tampa.jpg`
- Hook a cámara frente a la fachada, plano entero: "Te cuento una forma fácil de **comprarte tu casa** / y **ganar dinero rápido**" → "mira este **dúplex**" → "por **menos** de / **$520,000**" amarillo con glow por encima de su cabeza.
- Recorrida: "cada uno cuenta con" (dos habitaciones), "**8910** / pies cuadrados" (cifra amarilla + línea blanca), patios cercados, palabra suelta Bold Italic sobre cada ambiente ("*están*", "*actualizadas*", "*ventanas*"), ubicación ("cerca de / la **USF**", "**I-275**").
- Remate a cámara: "**SIN CONTRATO / SIN HEREDAR INQUILINO**" blanco MAYÚSCULA arriba de él (puedes comprar una unidad y rentar la otra).
- CTA: zoom-blur → "Comenta / **“DÚPLEX”**" + "y **CALIFICAMOS**" → "**TU PERFIL** para / **ESTA PROPIEDAD**" amarillo. Ojo: en el export quedó "TÚ PERFIL" con tilde; lo correcto es **"TU PERFIL"**.

### D. Pauta de apartamento frente al río — `03-10 AP TAMPA 435` (46 s, 25 fps) · `ref-pauta-tampa.jpg`
- Hook a cámara en el balcón con el río detrás: "¿Quieres vivir **frente** / al **RÍO**?" → "y **Armature Works**" → "mira este **apartamento**" (con light leak) → **$435,000** amarillo con glow sobre el cielo, detrás de él.
- Recorrida con datos apilados ("3 cuartos / 2 baños"), balcón, suite con oficina, walk-in closet, cocina ("un **counter top**", "**piedra hermosa**"), "**SE VENDE** amueblado".
- Amenities del edificio con planos de drone/altura: piscina frente al río, muelles, kayak, canchas de tenis, acceso controlado. Stock corto para servicios incluidos (agua, cable).
- Cierre: "Si quieres **despertar** / todas las **mañanas**…" → "**HERMOSA VISTA**" amarillo sobre el río → CTA en el balcón "Comenta / **“RÍO”**" + "y **agendamos tu visita**".

### E. Educativo de lista con placas — `22-09 AP Título pendiente` (40 s, 25 fps) · `ref-educativo-placas.jpg`
- Sentado en oficina, camisa y corbata. Hook: "**3 ERRORES**" amarillo con glow **detrás del pelo** + "pueden hacer que **pierdas** / la **compra de tu casa**".
- Cada error abre con **placa khaki + círculo numerado** (1, 2, 3) y el texto debajo ("**CAMBIAR** de trabajo / en el medio del **PROCESO**", "Mover dinero grande / **SIN EXPLICACIONES**"); entre placas, stock corto (tablero de auto, pareja comprando muebles, billetes, firma, tarjeta, apretón de manos).
- "y la regla **de oro**" a cámara → "**PREAPROBACIÓN**" sobre stock → placa con "y esto es **MÁS COMÚN / DE LO QUE CREES**" amarillo.
- Presentación: "**ÁNGEL PÉREZ**" amarillo detrás de la cabeza + "y soy **REALTOR** en…". CTA: "**GUARDA ESTE VIDEO**" amarillo + "y envíaselo a quien…", "Sígueme para más".

### F. Educativo de mitos — `21-11 AP Título pendiente` (47 s, 25 fps) · `ref-educativo-placas.jpg`
- Sentado en la vereda de un café, casual. Hook: "Me tomó más de tres años **aprender esto**… y te lo voy a **ENSEÑAR**" → "en solo / **60 SEGUNDOS**" amarillo, con light leak.
- Los cuatro mitos ("seguir pagando renta", "decenas de miles ahorrados", "ser ciudadano o tener residencia", "finanzas perfectas") van **todos en placa khaki**, texto en Italic + MAYÚSCULA, con íconos (casa con $, casa en círculo, bandera de EE. UU.) y el círculo "4"; light leak cálido entre placas; "Mis finanzas perfectas para / **COMENZAR**" con la clave más grande.
- Giro a cámara: "Pero **existen** opciones…", con stock de parejas, papeles y llaves.
- Cierre sin CTA de comentario: frase reflexiva por encima de él, "A veces lo que te impide / **comprar tu casa**" → "**NO** es la **FALTA DE DINERO**" → "**ES CREER QUE / NO LO PUEDES LOGRAR**" amarillo.

### G. Educativo selfie de oficina — `09-09 AP Pronóstico del mercado en Tampa` (48,7 s, 30 fps) · aprobado 2026-10-27
- Seis tomas de iPhone (HDR → SDR con `avconvert`), traje gris en una oficina: hook y CTA de pie en selfie, cuerpo sentado. Improvisa sobre el guion: los subtítulos van con lo que dice, no con el guion.
- Hook: "**PRONÓSTICO**" amarillo al pecho + "para **Tampa**" con un ícono de sol y nube (juego con el "pronóstico del tiempo") → "un **frente** de / **BUENAS NOTICIAS**" sobre el cielo de Tampa Bay (stock).
- "**TAMPA**" al pecho; placa khaki con una curva amarilla que baja ("donde **MÁS BAJÓ** / la **COMPETENCIA**"); "a finales de / **NOV · DIC**" por encima de su cabeza.
- Los tres pronósticos en **placas khaki con círculo 1-2-3** e ícono de línea (casa con $, precio bajando, calendario con reloj), con light leak al entrar.
- "si ya tienes tu / **PREAPROBACIÓN**" al pecho; stock de pareja con planos y apretón de manos con "y **negociar** un mejor / **PRECIO**".
- CTA: "antes de que se acabe / **EL AÑO**" → "Escríbeme / **“DM”**" → "gran / **OPORTUNIDAD**". Proyecto de Remotion: `remotion-elevate/src/ap0909`.

## 7. Ideas que pueden sumar (opcionales, a criterio)
- Pulso sutil del glow en la cifra clave mientras él la dice.
- Cifras que cuentan hasta el valor final (contador) cuando habla de montos acumulados.

## 8. Correcciones del cliente
Cada corrección que vale solo para Ángel, con fecha y pieza de origen.
- **2026-10-27, 09-09:** rotoscopia solo si queda limpia; en sus selfies, titulares al pecho (§4).
- **2026-10-27, 09-09:** wink o swoosh en las palabras importantes (§4).
- **2026-10-27, 09-09:** la portada la arma el editor; se le pasan 2 frames (§5).
- (Del mismo video, a la base: montar la voz con `atrim` y verificar huecos con `silencedetect`; el primer export salió con 7 huecos de voz.)
