---
name: gentile-inmuebles-brand
description: Identidad visual para video de Gentile Inmuebles (GIN), inmobiliaria en Capital Federal, Buenos Aires (Villa Luro, Ramos Mejía; pozo, departamentos a estrenar). Montserrat con contraste de pesos (Medium/Regular de base + Black en la palabra clave, Black Italic MAYÚSCULA en los hooks; The Seasons Bold como acento ocasional), subtítulos blancos de 1–3 palabras al pecho con la palabra clave en Black MAYÚSCULA roja con borde blanco o sobre caja roja semitransparente, precios y datos en Black rojo con contorno blanco + bajada blanca, hooks blancos en itálica arriba, listas con el número en rojo, whip/zoom-blur como transición, B-roll de la propiedad y renders del emprendimiento, sin logo, paleta negro / carbón / rojo `#E10E1C` / gris claro, más la referencia de once piezas aprobadas (tres pautas de propiedad, cinco reels a cámara: pozo, vivir en Capital, 5 razones, "En Capital no me alcanza", "Podríamos construir", un loop sin voz de obra → render del depto con música funk, y un reel a cámara + voz en off sobre el recorrido en realidad virtual de un depto en pozo con motion de ruta de ambientes y contadores, y una pauta de monoambiente con hook a cámara + voz en off sobre el depto con motion de datos: cota de m², checklist, pin de ubicación y colectivo) y la guía de portadas con degradé negro→rojo. Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Gentile Inmuebles / GIN (reels, pauta de propiedades, pozo, portadas), o cuando el usuario diga "editá el video de Gentile", "video de GIN", "con la marca de Gentile", aunque no mencione la skill.
---

# Gentile Inmuebles (GIN) — Marca para video

Reglas obligatorias (márgenes, cara, audio, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 5 de esta skill. Acá va solo lo propio del cliente.

- Cliente: **Gentile Inmuebles**, inmobiliaria en **Capital Federal** (Villa Luro, Floresta, Ramos Mejía como contraste). Venden pozo, emprendimientos propios y departamentos a estrenar. Siglas de archivos: **GIN**.
- Voceros: el dueño (señor pelado, de barba canosa) en casi todo; un asesor joven en algunas pautas (Dante 156); **Martín** (joven, remera negra) en la oficina de Villa Luro con el visor de realidad virtual (23-10). Los nombres no hacen falta; si se necesitan, los pasa el editor.
- Público y lugar: compradores e inversores porteños. **El stock tiene que parecer de Buenos Aires**: edificios de departamentos, obra en altura, calles arboladas de Capital. Moneda **USD** ("USD 212,000", "USD 300.000").
- Tono: cercano, rioplatense, voseo ("querés", "mandame", "calificás"). Hablan rápido: revisar en Whisper "en pozo", "anticipo", "cuotas", nombres de calles y barrios.
- CTA habitual: "Mandame un WhatsApp", "¿Querés ver lo que tenemos en pozo?", "una reunión esta semana".
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM GIN Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/ EXPORT/`. El final va en `EXPORT/` con el nombre de la carpeta `.mp4` (`_2` si es versión).
- Formato de las referencias: 1080×1920, **25 fps**, 22–40 s (pautas largas hasta 68 s). **Loops** (sin voz, solo música funk + sobreimpreso animado): ~10 s, en `{CARPETA_CLIENTE}/04 LOOPS/<DD-MM GIN LOOP GENTILE Título>/` (ref. G).
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
- **Loops: la portada la diseño yo** (03-11, pedido del editor): solo el edificio en construcción (el mismo cuadro con el que arranca el loop), degradé negro→rojo arriba y abajo a negro, "Caminá tu depto" Medium blanca + "**ANTES DE QUE**" Black Italic blanca + "**EXISTA**" Black Italic blanca en caja roja, centrado en el cuadrado. Una primera versión con la obra arriba y el render abajo partidos por una diagonal roja se descartó: "que solamente sea el edificio en construcción".
- **Portada con el vocero diseñada por mí** (23-10, aprobada 2026-11-05): Martín con el visor mirando a cámara (boca cerrada; recorte 1,3× para bajar la cabeza al cuadrado), sujeto aislado y más expuesto, degradé negro→rojo arriba, lockup **arriba de la cabeza** (~35 px sobre el visor): "Este departamento **todavía**" Medium/Bold blanca 58 + "**NO** EXISTE" Black Italic 156 (NO rojo con borde blanco, EXISTE blanca) + "Y ya lo podés **recorrer**" blanca dentro de una **caja roja**. Corrección: la caja se montaba sobre el golpe → el tope de la caja va **~22 px debajo de la línea de base** del golpe, nunca pisándolo. Script en `assets/portada-2310.py`.
- **Pauta con portada solo de la propiedad** (01-11, 2026-11-12): con el vocero recortado sobre el living, Tomi pidió otro cuadro: **la cocina integrada sola, sin el vocero** (IMG_4779 a 1,0 s, plano abierto con la puerta y la cocina). La final la terminó Tomi: misma imagen bien luminosa, degradé negro arriba, lockup **arriba de la cocina** (sobre la viga y las alacenas): "Monoambiente a estrenar en" Medium blanca + "**MATADEROS**" Black Italic blanca + "**USD 58.000** · apto crédito" en caja roja. En pautas de monoambientes/deptos chicos, proponer primero la propiedad (el ambiente que más vende) antes que el vocero. Mi versión previa (texto sobre el piso) en `assets/portada-0111-propiedad.py`.
- **El editor puede hacer la portada él mismo** (GIN 21-10, 2026-10-30): pasarle **2 frames de la propiedad + 2 del vocero con la boca cerrada o sonriendo** (en 4K, en `PORTADA/`) y **3 títulos** propuestos, y después insertar su PNG como frame 0 (25 fps). La de 21-10 fue sobre el living: "Villa Luro" en serif fina + "PH con patio y cochera" en Montserrat Bold blanca + **USD 210.000** en caja roja.

## 6. Referencias aprobadas (REFERENCIA, no fórmula)
Rutas relativas a `{CARPETA_CLIENTE}/01 REELS/`, final en `EXPORT/`.

- **A. Pauta de pozo a cámara + renders** — `09 SEPTIEMBRE/02-09 GIN PAUTA Marcos Paz 4000, Capital` (68 s): el dueño parado frente al cartel de obra; "¿Si querés comprar a **ESTRENAR**…", "y **NO** calificás en un **CRÉDITO HIPOTECARIO**", "**40% DE ANTICIPO** / y 24 cuotas". Después renders del edificio y de cada ambiente con un dato por plano ("**77 METROS**", "**70 CUBIERTOS**", "en **MARCOS PAZ 4053**").
- **B. Pauta de recorrido** — `07 JULIO/01-08 GIN PAUTA Dante 156, Villa Luro, D HOOK 1` (34 s, dos hooks): el asesor joven camina el depto vacío; hook "UN **3** DORMITORIOS / CUESTA **USD 300.000** / CON COCHERA"; ambientes con dato en Black ("**110** metros cuadrados", "COCINA / bien resuelta", "**2 baños** completos"); cierra a cámara "MANDAME UN WHATSAPP", "una **REUNIÓN** esta semana".
- **C. Reel a cámara con caja roja** — `09 SEPTIEMBRE/06-09 GIN En Capital no me alcanza` (23 s): sentado en la oficina; subtítulos con caja roja y Black rojo; B-roll de obra al decir "Soy **MAESTRO MAYOR DE OBRA**"; whips con zoom-blur; cierre "**POR EL MISMO DINERO**".
- **D. Reel de lista** — `07 JULIO/16-07 GIN 5 razones para dejar la casa y` (41 s): hook itálico arriba en la cocina ("HAY GENTE QUE PASÓ…", "ESTAS SON LAS RAZONES"), después recorrido de un depto con "**1** LA SEGURIDAD" … "**5** LA COMODIDAD DE" y subtítulos chicos.
- **E. Reel educativo con stock** — `07 JULIO/15-07 GIN Por qué tanta gente compra en` (32 s): hook con palabras rojas itálicas arriba ("MÁS", "EN"), stock de obra/dinero con subtítulos y palabra clave en caja roja; cierre a cámara "¿Querés ver lo que tenemos en pozo?".
- **F. Pauta de recorrido con voz en off** — `10 OCTUBRE/21-10 GIN PAUTA Título pendiente` (62 s): hook a cámara en 3 tomas del asesor joven (living, cocina, patio) con títulos arriba de la cabeza ("¿SOÑÁS CON UN **PATIO**?", "**VILLA LURO** / 4 AMBIENTES", precio que cuenta hasta "**USD 210.000**" + caja "APTO CRÉDITO") y punch-in en "frená un segundo". Después voz en off (notas de voz del celular) sobre un plano por ambiente con su dato centrado ("**PLANTA BAJA**", "**3** DORMITORIOS", "**43 M²** DE PATIO", "**25 AÑOS**"), aéreo de barrio porteño del stock y CTA "ESCRIBINOS / WHATSAPP" sobre la cocina. Música *Groove Tonic* −16 dB bajo la voz.
- **G. Loop sin voz** — `../04 LOOPS/03-11 GIN LOOP GENTILE Antes de que exista` (9,6 s = 16 tiempos, aprobado 2026-11-03): música *Funkee Monkeee* (Mixkit, instrumental, **100,0 BPM medidos**, tramo 81,864 s + 16 tiempos; empalma al repetirse). 0–3,6 s: obra en altura del stock (torre de hormigón desde abajo, grúa, pared de ladrillo con columnas), corte cada 2 tiempos con whip, "Antes de que **exista**" + "**EL EDIFICIO,**" en Black rojo con borde blanco. 3,6 s: zoom-blur + destello blanco al depto terminado = **un solo render publicado por Gentile** (comedor/living) con zoom out 1,3→1,0 + paneo lateral que se frena al final (como los renders de la ref. A). "ya podés" + "**CAMINAR**" en Black Italic letra por letra + "tu depto." en caja roja; CTA "Leé la" + "**DESCRIPCIÓN**" en caja roja + flecha blanca que rebota con el tiempo. Whip de salida que empalma con el arranque. Portada diseñada (sección 5).
- **H. Reel a cámara + recorrido VR** — `11 NOVIEMBRE/23-10 GIN Este departamento todavía no e` (37,8 s, aprobado 2026-11-05 sin correcciones de video): Martín en la oficina con el visor; el material del departamento es la **grabación del recorrido virtual** (render en el visor, 538×962, baja resolución). Hook: plano con el visor + "estoy parado en este **LIVING**" Black Italic arriba de la cabeza → whip al living del VR con **medida animada** (línea de cota blanca con topes rojos) "casi **9 METROS** de largo" → vuelve con "todavía **no** está **TERMINADO**" y punch-in. "Estos anteojos": anillo rojo que gira sobre el visor; tag con pin "**GUARDIA NACIONAL 210** · Unidad 2 · Villa Luro" en caja roja (datos del guion, aprobados aunque no los dice). Entrada al VR: empuje hacia los anteojos + zoom-blur + destello blanco. Voz en off (nota de voz) sobre una **ventana "RECORRIDO VR"** (760×880, esquinas redondeadas, borde blanco) encima del mismo clip desenfocado y oscuro con degradé rojo abajo, y una **ruta de 4 paradas** (LIVING · COCINA · 3 DORM. · BALCÓN) cuyos puntos se encienden en rojo y la línea se llena con cada ambiente que nombra; subtítulos debajo de la ruta. En "son casi 195 metros" la ventana se **expande a pantalla completa** con contador "casi **195 M²**" → "y los caminás / **ANTES** (caja roja itálica) / de que estén terminados". Cierre a cámara: contador "**20 AÑOS** / que construimos en Villa Luro", "queremos que lo **VEAS**" (caja roja), "**ESCRIBINOS**". Música *Light it Up Boy* (Mixkit 849, instrumental, 119,0 BPM) −16 dB bajo la voz, 29 SFX. Plantilla en `assets/Video-2310-recorrido-vr.tsx`.
- **I. Pauta a cámara + voz en off sobre el depto** — `11 NOVIEMBRE/01-11 GIN PAUTA Título pendiente` (43,4 s, aprobado 2026-11-12, v3 con la portada de Tomi): monoambiente en Mataderos. Hook de Martín caminando hacia la cámara en el depto vacío (2 tomas, zoom 1,45→1,55 anclado a los ojos): "si hoy pagás **ALQUILER**" → "y querés tu primer departamento propio en **MATADEROS**" (rojo itálica) → punch-in 1,55→1,95 en "**FRENÁ ACÁ**" → "**MONOAMBIENTE** / A ESTRENAR" (caja). En el precio, **B-roll del depto** (pedido de Tomi, "para darle más ritmo": 2 planos de ~1,2 s) con contador "**USD 58.000**" + caja "**APTO CRÉDITO**". Después la nota de voz en off sobre un plano por frase (cocina, living con ventanal, terraza con parrilla, aéreo porteño `CIUDAD BS AS 2`, `TRAFICO` para los colectivos, `LLAVES 8` para invertir), sin velo y con sombra en los textos. Motion: cota con contador "**30 M²**" + caja "1° PISO" + "AL CONTRAFRENTE"; **checklist** de 3 ítems con círculo rojo y tilde que se dibuja (COCINA INTEGRADA · ACEPTA MASCOTAS · APTO PROFESIONAL); "**TERRAZA** / CON PARRILLA" con destello blanco al entrar; **pin** que cae con onda (MATADEROS / a una cuadra de **ALBERDI**); **ícono de colectivo** + "**COLECTIVOS** en la esquina"; línea de tendencia que se dibuja bajo "**INVERTIR**"; CTA en texto (ver §8) con flecha que rebota. Whip / zoom-blur en los 14 cortes, 38 SFX. Música *Groove Tonic* (Motion Array) desde 2,0 s, 15,5 dB bajo la voz. Plantilla en `assets/Video-0111-pauta-off.tsx`.
- También aprobadas: `07 JULIO/04-07 GIN PAUTA NO ESPERES MAS`, `07 JULIO/13-07 GIN Para vivir bien en Capital no`, `09 SEPTIEMBRE/17-08 GIN Podríamos construir en cualqui`.

## 7. Ideas que pueden sumar (opcionales)
- Drone o tomas de calle del barrio (Villa Luro, Floresta) para ubicar la propiedad.
- Contador animado en el precio con SFX de caja registradora.

## 8. Correcciones del cliente
Indicación inicial, 2026-10-30: basarse en los videos aprobados; sin logo.
- **Punch-in en la frase de freno del hook** (GIN 21-10, 2026-10-30): en "frená un segundo" pidió un zoom in de énfasis (1× → 1,26× en 0,12 s, anclado a los ojos, con whoosh suave). Repetirlo en las frases que cortan el scroll.
- **Ortografía en los datos**: "semi-integrada", con guion (no "semiintegrada").
- **CTA en off**: no va sobre el vocero callado (se lee como desfasado); va sobre la propiedad.
- **B-roll también en el hook** (01-11): cuando el vocero dice el precio, poner planos del depto debajo del precio "para darle más ritmo; no importa si después los repetís".
- **CTA no grabado** (01-11): si la nota de voz termina sin CTA, va **en texto al final**, sobre la última frase y la propiedad ("tocá el botón y" + **ESCRIBINOS** rojo + caja **POR WHATSAPP** + flecha hacia el botón del anuncio), sin alargar el video. Avisar siempre que falta.
- **Hook directo** (01-11, pedido de la clienta Julia, 2026-11-13): se sacó la condición inicial "Si hoy pagás alquiler y…" y el hook arranca en "querés tu primer departamento propio en Mataderos, frená acá: monoambiente a estrenar, US$58.000 y apto crédito" (−1,2 s). Preferir hooks que arranquen en el deseo + el dato, sin preámbulos.
- **Audio original, no el mejorado** (01-11, 2026-11-13): con la voz de Adobe Podcast aprobada, Tomi pidió volver al **audio original del video** (voz cruda + `adeclip` en la nota de voz saturada + cadena estándar con reductor), y bajar la voz del hook a cámara **~1,5 dB respecto del off** (final: hook −12 LUFS, off −10,8, master −11). En GIN, usar el audio original salvo que pidan el mejorado.
- **Calles y barrios que Whisper confunde** (01-11): oía "a una cuadra **del Verde**" y era **Alberdi** (Av. Juan Bautista Alberdi, Mataderos). Con nombres de calles raros, preguntar antes de subtitular.
- **Precio**: el que dice el vocero manda sobre el guion (21-10: dijo 210.000 y el guion decía 200 mil; quedó 210.000). Avisar siempre la diferencia.
- **Interiores: los renders que publica Gentile antes que el stock** (03-11, loop): el stock de deptos de Pexels se reemplazó por sus renders. Usarlos como en la ref. A: **una sola imagen** sostenida con zoom out + paneo suave hasta ver casi toda la imagen, no varios renders cortados al ritmo. Los renders traen la marca de la desarrolladora ("Desarrolla y proyecta · Espacios Humanos") abajo al centro y a veces "Piso 4°" arriba a la derecha: recortar para que no entren.
- **Grabación del recorrido VR en baja resolución** (23-10): no se pasa entera a pantalla completa; va dentro de una ventana sobre su propia copia desenfocada (escalado ~1,4× en vez de 2×) y solo se abre a pantalla completa en un golpe corto con texto encima y oscurecido. Cortar un clip por ambiente nombrado.
- **El guion puede traer párrafos que no se grabaron** (23-10: faltaba "Comprar en pozo tiene una parte difícil…") y cifras distintas (dijo "20 años", el guion decía 25): se edita lo grabado y se avisa. Datos del guion que no se dicen (dirección exacta, número de unidad) van en un tag chico y se piden aprobar.
- **Stock de obra que se vea de Buenos Aires**: del banco de stock sirven `EDIFICIO`, `CONSTRUCCION` (grúa) y `en obra 5` (ladrillo y columnas); `en obra 1–4` muestran obreros asiáticos y `CONSTRUCCION 2` se ve de Brasil.
