---
name: "andrea-almonacid-brand"
description: "Marca y estilo de edición de Andrea (Andy) Almonacid (AAL), asesora inmobiliaria de María Neme Inmobiliaria en Bariloche: paleta rojo/azul, Acumin Pro (Medium + Black/UltraBlack en la palabra clave) y Brittany Signature para lugares, subtítulos blancos con palabra clave en MAYÚSCULAS roja o azul con borde blanco, títulos grandes en degradé rojo que entran con barrido de bloque rojo, pastilla azul para precio de alquiler, pin de ubicación, light leaks cálidos y whip con desenfoque, stock solo argentino, más la referencia de seis piezas aprobadas (captación de PH, alquiler, venta de monoambiente, venta de PH, orgánico educativo de crédito e historia personal). Usar al editar, subtitular o animar cualquier video de Andrea / AAL, junto con edicion-reels-base."
---

# Andrea Almonacid (AAL) — marca para video

Se aplica **junto con `edicion-reels-base`**. Las reglas de la base mandan (zonas seguras, subtítulos pegados a la cara, audio, stock sin audio, cierre). Esta skill suma lo propio de Andrea. Si algo de acá contradice la base, gana la base, salvo que el usuario diga lo contrario para este cliente.

Fuentes: manual de marca en `{CARPETA_CLIENTE}/00 IMAGEN DE MARCA/` (`ANDY ALMONACID PALETA.png` y `ANDY ALMONACID FUENTES.pdf`) y los videos aprobados que se usaron de referencia (ver sección 10).

## 1. Quién es y a quién le habla
- **Andrea "Andy" Almonacid**, asesora inmobiliaria de **María Neme Inmobiliaria**. Sigla en carpetas y archivos: **AAL** (ej. `24-08 AAL PAUTA ...`).
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM AAL Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/ EXPORT/`.
- **Mercado: Bariloche** (centro, barrio Belgrano, calles como Mitre, 9 de Julio, Campichuelo) y alrededores (Dina Huapi). Argentina.
- **Público:** gente que quiere comprar (muchos con crédito hipotecario / UVA), alquilar o vender en Bariloche, y quien piensa comprar en Bariloche desde otra ciudad.
- Formatos:
  - **Pauta de propiedad** (venta o alquiler): recorrido de la propiedad con datos.
  - **Captación**: le habla al dueño que quiere vender ("Si tenés un PH en Bariloche y estás pensando en venderlo...").
  - **Orgánico educativo**: crédito, documentación, qué preguntar antes de comprar.
  - **Historia personal**: algo de su vida (ej. una carrera de trail) que conecta con su forma de trabajar.
- Posicionamiento: asesora cercana y clara, que explica lo que "nadie te dice". Habla a cámara, con energía, en la calle o en su escritorio con papeles.

## 2. Idioma y textos en pantalla
- **Español rioplatense** (mercado argentino): voseo como lo dice ella ("tenés", "comprás", "preguntá", "Guardá este video", "Quedate", "Escribinos", "Escribime").
- Términos locales: PH, monoambiente, m² cubiertos / construidos, terreno, cochera (cubierta / descubierta), escritura, planos aprobados, inhibiciones, apto crédito, alquiler permanente, renta turística.
- Precios de venta en **dólares**: `USD 95.000` (punto de miles). Alquileres en **pesos**: `1.600.000 Pesos`.
- Superficies con superíndice: `89 m²`, `200 m²`.
- **María Neme** se escribe así (Whisper la transcribe "Marianeme").
- **Cero datos inventados.** Ninguna cifra, tasa o dato que no esté en el guion o en lo que dice ella.

## 3. Paleta
| Nombre | HEX | Uso en video |
|---|---|---|
| Rojo | `#DB1B2E` | **Acento principal**: títulos grandes (en degradé), palabra clave, cifras clave, pin de ubicación, logo de María Neme, overlay de alerta |
| Azul | `#335CA9` | Acento secundario: palabra clave en azul con borde blanco, títulos azules (ej. "MONOAMBIENTE") |
| Azul oscuro (pastilla) | `#1E428A` aprox. (medido) | Pastilla del precio de alquiler |
| Gris azulado | `#A4B0B7` | Detalles, líneas, fondos suaves |
| Beige / champagne | `#DCCCBF` | Cifras grandes cálidas (precio, "200 m²") con sombra |
| Gris claro | `#E6E5E5` | Fondos claros, placas |
| Blanco | `#FFFFFF` | Subtítulos, bordes de las palabras de color, bajadas |

- **Degradé de los títulos rojos:** horizontal, de rojo de marca (`#D21824` medido en pantalla) a rosado claro casi blanco en un tramo de la palabra, como un brillo.
- Rojo para el dato que tiene que saltar; azul para el segundo dato o el nombre propio (ej. "NAHUEL HUAPI", "2 BAÑOS").
- Máximo **dos colores de marca a la vez** además del blanco.
- En los elementos gráficos (íconos, mapas, trazos) usar colores de la paleta.

## 4. Tipografías
Según el manual y lo que usan los proyectos aprobados:
| Rol | Fuente |
|---|---|
| Subtítulos (relleno) | **Acumin Pro Medium** |
| Palabra clave del subtítulo | **Acumin Pro Black** (o Bold), en MAYÚSCULAS |
| Títulos grandes, precios, CTA | **Acumin Pro UltraBlack**, en MAYÚSCULAS |
| Lugares y resaltados emocionales | **Brittany Signature** (script, dafont.com/es/brittany-signature.font) |

- Acumin Pro está en fonts.adobe.com/fonts/acumin. Para Remotion: si el editor la tiene activada en Creative Cloud, copiar Medium, Black y Ultra Black con `edicion-reels-base/scripts/fuentes_adobe.py "Acumin Pro" <proyecto>/public/fonts "Medium,Black,Ultra Black"` y cargarlas con `FontFace` (Medium 500, Black 800, Ultra Black 900 dentro de la composición). En AAL 02-10 el kit web de Adobe no se actualizó en 20 min; desde Creative Cloud fue inmediato.
- **Brittany** solo para nombres de lugares o frases cortas y emocionales: "centro de *Bariloche*", "en *Dina Huapi*", "antes de enamorarte". Rojo/rosado con borde o brillo blanco, o blanco. Nunca para cifras ni frases largas. Una o dos veces por video.
- En 24-08 hay un tramo con subtítulos serif sobre caja violeta oscura ("con portón", "caldera"): **no es el estándar**, no repetirlo salvo que lo pidan.
- En 05-09 la palabra clave iba en bold italic; en las piezas más nuevas (agosto–septiembre) va en **Black MAYÚSCULAS**. Usar lo nuevo.
- Si alguna fuente no está en el editor, avisar antes de reemplazarla. No cambiarla en silencio.
- Brittany Signature está en `{CARPETA_CLIENTE}/00 IMAGEN DE MARCA/drive-download-…/00. FUENTES/brittany_signature/`. Es fina: sobre fondos con detalle (la casa, el jardín) va a ~100 px y con un halo oscuro suave para que se lea.
- Con UltraBlack, calcular el ancho con ~0,74 × cuerpo por letra (es ancha) y `white-space: nowrap` en las líneas grandes: con 0,64 "+2 DEPARTAMENTOS" se partía en dos líneas. El "²" de UltraBlack casi no se ve: armar `m²` con un "2" en superíndice (0,46 em) dentro del mismo título.

## 5. Estilo de subtítulos (visto en los aprobados)
- Blanco, **Acumin Pro Medium**, sin caja, con sombra suave para leerse sobre exteriores luminosos. Unos **55–65 px** de alto de línea en 1080×1920.
- **Una a tres palabras por bloque**, como se habla (minúscula salvo inicio de oración), aparición por bloque corto.
- **Palabra clave en Acumin Pro Black MAYÚSCULAS** dentro de la frase: "con **COCHERA**", "los **INVERSORES**", "Un **DESAFÍO** más", "Está **AMOBLADO**". La palabra clave puede ir:
  - **blanca** sola, con la sombra suave;
  - **roja con borde blanco** (ej. "BALCÓN PRIVADO", "ENTRENAMIENTO", "COCHERA DESCUBIERTA", "64 METROS");
  - **azul con borde blanco** (ej. "2 BAÑOS", "NAHUEL HUAPI", "LLEGADA", "BAÑO COMPLETO", "DEPARTAMENTO");
  - **blanca con una sombra de color corrida** (rojo y azul desplazados, ej. "PATIO PROPIO") o con borde negro (ej. "CASA", "CUBIERTOS").
- Rojo y azul se alternan a lo largo del video; no todas las palabras clave van de color: la mayoría es blanca y el color se guarda para el dato fuerte.
- Puede ir en dos líneas cuando la segunda remata ("del LAGO / **NAHUEL HUAPI**", "un ALQUILER / **PERMANENTE**").
- Posición: la de la base. Con ella a cámara, a la altura del pecho (≈ 55–65 % de la altura del cuadro, debajo de la cara). Sobre B-roll, centrado (≈ 50 %).

## 6. Titulares, datos y elementos gráficos
- **Título grande rojo (el recurso más reconocible):** Acumin Pro UltraBlack MAYÚSCULAS, ancho casi completo de la zona segura, en **degradé rojo → rosado claro**, con una frase chica blanca arriba que lo introduce. Entra con un **bloque rojo que barre y revela el texto** (o un corte con desplazamiento tipo glitch). Se usa en:
  - el **lugar del hook**: "Si tenés un PH en / **BARILOCHE**", "¿Buscás tu primera PROPIEDAD EN / **BARILOCHE?**";
  - el **remate del hook**: "Esto TENÉS que / **SABERLO**", "Y estás pensando en / **VENDERLO**";
  - el **precio**: "POR" blanco arriba + **`USD 95.000`** grande;
  - la **dirección**: "**MITRE AL 700**";
  - el **CTA**: **ESCRIBINOS** / **ESCRIBIME** + bajada blanca en mayúscula debajo ("por WHATSAPP", "y te ASESORAMOS", "COORDINAMOS UNA VISITA").
- **Título grande azul:** misma construcción en azul con borde/volumen blanco, para el tipo de propiedad ("**MONOAMBIENTE**").
- **Precio de alquiler:** pastilla azul oscura con esquinas redondeadas arriba del cuadro, texto blanco "**1.600.000** *Pesos*" (cifra en Black, "Pesos" en italic). Queda fija durante el hook.
- **Precio de venta:** "POR" + `USD 95.000` en el título rojo grande. Variante anterior (24-08): "Por" + `USD 230.000` blanco/beige con sombra o volumen.
- **Ubicación:** pin + calle. Pin blanco de línea grande sobre el plano con la calle en el título rojo ("MITRE AL 700"), o pin rojo relleno chico con la calle en blanco al lado ("9 de Julio / y Mitre"). En 24-08, mapa con pin sobre la calle real ("**Campichuelo** y **24** de...").
- **Superficies:** "TIENE" blanco + cifra roja en degradé ("**89 m²**") + ícono de línea blanco de plano con flechas de medida + "CUBIERTOS" debajo. O en subtítulo: "Son / **27 METROS** / CUBIERTOS". Variante anterior: "90 m²" en rojo o "200 m²" en beige/blanco con la unidad debajo.
- **Ambientes:** "**3** / **DORMITORIOS**" (número blanco grande + palabra roja con borde blanco), "**2 BAÑOS**" en azul. Variante anterior: caja roja cuadrada con número blanco.
- **Marca de la inmobiliaria:** cuando nombra a María Neme, aparece el logo en texto rojo grande "**MARÍA NEME**" con "INMOBILIARIA" y la matrícula debajo en chico, a la altura del pecho, mientras el subtítulo sigue debajo.
- **Momento de alerta** (orgánico): overlay rojo de marca sobre la imagen + titular blanco en MAYÚSCULAS bold (ej. "NO / CALIFICA").
- **Remate en B/N** (orgánico): el plano pasa a blanco y negro y el titular termina con la palabra clave en rojo ("El crédito **estaba bien** / la casa **NO**").
- **Elementos gráficos sutiles:** pin, ícono de plano, contorno del lote, casa, llave, documento. Sutiles, cortos y animados; no en cada plano.
- **Rotoscopia:**
  - **Cambio de fondo en el hook:** Andrea recortada sobre una postal de Bariloche (lago y cerro nevado) mientras dice el lugar (02-08, "BARILOCHE"). Vuelve a la toma real después.
  - **Texto detrás de ella:** palabra o frase clave grande en Acumin UltraBlack o Brittany, en blanco o rojo, parcialmente tapada por su cuerpo. En momentos de énfasis, 1–2 veces por video, sin tapar nunca la cara.
- **Selfie en recuadro** (historia personal): el clip de selfie de ella en un recuadro con esquinas redondeadas arriba a la derecha, sobre un plano general de la misma escena (21-09, mientras corre).
- **Servicios** (agua, gas, luz, internet): "SERVICIOS" en Black + grilla 2×2 de círculos rojos con borde blanco y el ícono de línea blanco adentro, la etiqueta en Black MAYÚSCULA debajo; cada ícono entra con su palabra y un "pop" (02-10).
- **Títulos sobre la cabeza con fondo claro o naranja** (la casa de madera detrás): el rojo en degradé pierde contraste. Sumar un degradé oscuro arriba (negro 60 % → 0 al 38 % de la altura) solo mientras está el título (02-10).
- Cuando el titular dice lo mismo que la voz, se oculta el subtítulo (regla de la base).

## 7. Ritmo, look y acabado
- **Pauta de propiedad (~40–50 s):** abre con ella a cámara (en la terraza, el balcón o la calle) con la pregunta gancho y el lugar en título rojo, pasa al precio y la ubicación, recorre (living → cocina → dormitorios → baños → balcón/terraza → cochera) cambiando plano cada **~1–2 s**, con ella entrando o señalando dentro del plano, y cierra a cámara con el CTA rojo.
- **Captación (~40 s):** ella a cámara en la calle, caminando hacia la cámara. Drone y stock de Bariloche mientras explica (catedral, centro, lago, cerros), un PH real para mostrar el producto, stock neutro de llaves/manos para "el público que busca", logo de María Neme cuando la nombra, CTA rojo.
- **Orgánico educativo (~45 s):** hook a cámara en la calle con movimiento, desarrollo en escritorio con papeles (títulos, planos, escrituras) en planos cenitales y medios, stock en la parte de "historia", vuelve a la calle para el CTA ("Guardá este video si estás...").
- **Historia personal (~50 s):** solo material de ella (fotos y videos del evento, selfies, la medalla, la llegada), cortes al ritmo de la música, tramo de puente con ella en una propiedad vacía cuando conecta con su trabajo, cierre con pregunta en título rojo ("¿VAMOS POR / **EL PRÓXIMO?**").
- **Apertura:** todos los videos arrancan con un **whip con desenfoque de movimiento** que entra al primer plano.
- **Transiciones:** whip/zoom con desenfoque entre planos y **light leaks cálidos** (amarillo, naranja, rosa; en los proyectos: "Generated Light Leak 1" de Premiere) en muchos cortes. A veces un **destello de color** rosa/naranja que tiñe el plano medio segundo al cambiar de tema.
- **SFX:** swooshes en los whips y en la entrada de los títulos (en los proyectos: Animation Composer "Swoosh 04 - 02", "Swoosh Transition 03" y "28", "Transition Complex 14").
- **Música en pauta de propiedad: funk** (pedido del usuario, 2026-10-26, AAL 02-10). Un funk **genérico**, sin buscar demasiado (2026-10-27, AAL 03-11: "elegí la música más genérica de funk, no le des tantas vueltas"). Si el editor no tiene Motion Array, bajar de Mixkit (tag funk); en 02-10 quedó "Gimme that Groove" (Michael Ramir C.) desde 0:04, 120 BPM, 16 dB debajo de la voz con hueco de EQ.
- **Música (piezas anteriores):** alegre y con ritmo, de Motion Array. Usadas: "Reaching For The Stars" (captación), "Vlog Happy Hiphop" (alquiler), "Sax On The Beach" (monoambiente), "Closer To The Edge" (historia personal).
- Look natural y luminoso, colores reales. B/N y overlay rojo solo como recurso puntual de énfasis (1–2 por video).
- Audio: master de la base (-11 LUFS). Los exports de agosto–septiembre quedaron entre -15,5 y -18,6 LUFS: no tomarlos como modelo de nivel.

## 8. Stock y B-roll — **MUY IMPORTANTE**
- Primero el material de ella: la propiedad, la calle, el barrio, su escritorio con documentación.
- Se usa stock, pero **tiene que adecuarse a la realidad argentina**. Antes de poner un clip, preguntarse: "¿esto se podría haber filmado en Argentina / Bariloche?". Si no, no va.
- **Paisajes y casas:** Bariloche y Patagonia (casas de madera y piedra, techos a dos aguas, pinos, montaña, lago, catedral, centro cívico, calles de barrio, cielos limpios) o ciudades argentinas. Drone del centro de Bariloche y del lago funciona muy bien (02-08). **Nunca** barrios suburbanos de Estados Unidos (casas de bloque con jardín delantero abierto, garajes dobles, buzones en la vereda, calles anchas de suburbio), palmeras, skylines de EE. UU. ni carteles en inglés.
- **Personas:** solo clips donde la gente se vea como la gente de Argentina, coherente con su público. No usar clips con personas de etnias que no se correspondan con la población argentina.
- Interiores, oficinas, firmas, llaves: que no tengan detalles que delaten otro país (enchufes, carteles, papeles o pantallas en inglés, autos o marcas extranjeras). Un plano cerrado de manos con llaves (02-08) sirve porque no muestra nada de otro país.
- Si no hay stock que cumpla, usar material de ella o un plano de detalle neutro antes que un clip que no encaje.
- **Sus crudos traen mucho "detrás de escena"**: ella charlando con quien filma, señalando "acá", pidiendo repetir, y audio de indicaciones en casi todos los clips de recorrido. Esos planos no van (02-10: el usuario pidió cambiar uno, "que se vea más profesional"); el B-roll siempre sin su audio. Whisper alucina "Gracias por ver el video" / "Suscríbete" en los clips sin voz.
- **Planos de ella caminando: arrancan cuando ya camina** (corrección del usuario, 2026-10-27, AAL 03-11: "se ve cómo Andrea se prepara para caminar, tomá el video desde que camina"). En sus tomas de seguimiento queda parada ~1 s acomodándose antes del primer paso; ubicar el primer paso en una tira de frames a 10 fps (en 03-11, 1,1 s) y entrar ahí.
- **Precio distinto entre tomas del hook:** en 03-11 dijo "125 mil" en dos tomas y "115 mil" en otra. Preguntar cuál es el correcto antes de elegir la toma (era USD 125.000).

## 9. Reglas editoriales de Andrea
- Respetar su voseo y su forma de hablar; no neutralizar el texto.
- No cambiar el copy ni la estructura del guion sin que lo pidan.
- CTA final: WhatsApp / coordinar visita / asesoramiento / guardar el video, como lo diga ella. No pedir comentar palabras clave salvo que lo diga.
- **El guion es guía; en pantalla va lo que ella dice.** En 02-10 la voz decía "kilómetro 12" y el guion "km 5", y nombró un dato que el guion no tenía (terreno de 1.137 m²): se puso lo dicho y se avisó la diferencia. Datos del guion que ella no dice no van como títulos salvo que el usuario los pida.
- **Portada: la hace el usuario.** Pide 2 frames para armarla. En pauta de propiedad terminó usando la **fachada de la casa** en vez de Andrea (02-10): ofrecer de entrada frames de Andrea sonriendo (boca cerrada) y de la fachada, los más nítidos (varianza del laplaciano), en 4K a `PORTADA/`. Al recibirla, insertarla como frame 0 con `portadas-reels/scripts/portada_primer_frame.sh` (o el mismo filtro con `-maxrate 20M`).
- Sumar acá las correcciones de gusto que vaya marcando (con fecha y video de origen).

## 10. Referencias aprobadas
Videos que el usuario marcó como modelo del estilo. Usarlos como referencia al editar los próximos.

**Agosto–septiembre** (`{CARPETA_CLIENTE}/01 REELS/09 SEPTIEMBRE/`, export en `EXPORT/`; son las más nuevas y mandan si hay diferencias con las anteriores):
- `02-08 AAL PAUTA Captacion ph` (42,7 s): **captación** para dueños de PH. Hook con rotoscopia sobre postal de Bariloche + "BARILOCHE" y "SABERLO" en título rojo, "DEPARTAMENTO" azul / "CASA" con borde, drone del centro y del lago, stock de llaves, logo de María Neme, CTA "ESCRIBINOS / y te ASESORAMOS". Música "Reaching For The Stars".
- `03-08 AAL Título pendiente` (41 s, export bueno en `EXPORT/NUEVO/`): **pauta de alquiler**, departamento en Mitre 700. Pastilla azul "1.600.000 Pesos", pin blanco + "MITRE AL 700" en rojo, "centro de *Bariloche*" en Brittany, "TIENE 89 m² CUBIERTOS" con ícono de plano, "3 DORMITORIOS", "2 BAÑOS" azul, "NAHUEL HUAPI" azul, CTA "ESCRIBIME / COORDINAMOS UNA VISITA". Música "Vlog Happy Hiphop".
- `04-08 AAL Título pendiente` (42,6 s): **pauta de venta**, monoambiente en 9 de Julio y Mitre. "MONOAMBIENTE" en título azul, pin rojo con la calle, "POR / USD 95.000" en rojo, "27 METROS / CUBIERTOS", "BAÑO COMPLETO" azul, "64 METROS DE TERRAZA", "COCHERA DESCUBIERTA", CTA "ESCRIBINOS / por WHATSAPP". Música "Sax On The Beach".
- `21-09 AAL Título pendiente` (52,6 s, export en `EXPORT/PORTADA 1/` y `PORTADA 2/`, mismo video con dos portadas): **historia personal**, los 21 km del Trail del Fuego en Dina Huapi. Solo material de ella, selfie en recuadro, "en *Dina Huapi*" en Brittany, "21 KILÓMETROS" y "ENTRENAMIENTO" en rojo, "LLEGADA" azul, cierre "¿VAMOS POR / EL PRÓXIMO?". Música "Closer To The Edge".

**Octubre** (`{CARPETA_CLIENTE}/01 REELS/10 OCTUBRE/`):
- `02-10 AAL PAUTA GAVIOTAS 200` (65,9 s, export en `EXPORT/`): **pauta de propiedad con voz en off**, casa + 2 departamentos en Barrio Pájaro Azul (km 12 de Bustillo). Hook a cámara reordenado según el guion con punch-ins anclados a los ojos e insertos de las dos casas; cuerpo con voz en off sobre su recorrido (34 planos); CTA a cámara. Títulos: "CASA PRINCIPAL / +2 DEPARTAMENTOS", "*Barrio Pájaro Azul* / BARILOCHE" y "3 UNIDADES por / USD 289.000" sobre la cabeza con barrido rojo, pin + "A 120 METROS / *de Av. Bustillo*", "TERRENO DE 1.137 m²" con el contorno del lote, "1 DORMITORIO + BAÑO", "2 DEPARTAMENTOS" azul, grilla de servicios, "ESCRIBIME / por WHATSAPP". Whip + light leak en los cambios de bloque, zoom-blur en el resto, 55 SFX, funk de Mixkit. Composición de Remotion de referencia en `plantilla/aal0210/` de esta skill (los videos y la mezcla no están: cambiar rutas y tiempos).
- `03-11 AAL Título pendiente` (50,2 s, export en `EXPORT/`, aprobado 2026-10-27): **pauta de propiedad con voz en off**, casa de 71 m² a terminar en Lomas del Cauquén. Hook a cámara frente a la casa (una sola toma con punch-in anclado a los ojos), "en *Lomas del Cauquén*" y "POR / USD 125.000" sobre la cabeza; la sigue entrando a la casa ("acompañame") y el cuerpo en off va sobre el recorrido (20 planos al ritmo del funk, pausas de la voz a 0,12 s); CTA a cámara adentro con "ESCRIBINOS / por WHATSAPP / y COORDINAMOS UNA VISITA" **debajo de la cara** (arriba no había lugar). Títulos: "UNA CASA DE 71 m²" con ícono de plano, "2 PLANTAS" azul, "LOTE EN PH 628 m²", barra de "AVANCE DE OBRA" que sube a 70 %, "*tu propio estilo*", listas "PLANTA BAJA" / "PLANTA ALTA" con tildes rojos que entran con cada ambiente, pin + "A 1 CUADRA / *de Av. de la Virreina*". Funk genérico de Mixkit ("Keep the Funk ON", 130 BPM medidos) a ~15 dB bajo la voz con hueco de EQ; 42 SFX. Plantilla en `plantilla/aal0311/`.

**Anteriores** (carpeta `LISTOS` de cada uno):
- `05-09 AAL "Apto crédito" no lo decide el`: orgánico educativo, con titular de hook grande, overlay rojo "NO CALIFICA", remate en B/N con "NO" rojo, script "antes de enamorarte" y subtítulos con bold italic.
- `24-08 AAL Título pendiente`: pauta de propiedad (PH en barrio Belgrano), con precio USD grande, cajas rojas de ambientes, m² en rojo/beige, pin y mapa de ubicación, script en rojo y blanco y recorrido rápido.

## 11. Al cerrar cada video
Seguir la regla 11 de la base: las correcciones que sean gusto de Andrea se agregan acá (con fecha y video de origen); las que valen para todos van al coordinador.
