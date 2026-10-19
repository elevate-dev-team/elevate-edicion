---
name: tamara-alarcon-brand
description: Identidad visual para video de Tamara Alarcón (TA), inmobiliaria en zona sur del Gran Buenos Aires (barrios cerrados, Canning / Terralagos), Argentina. Tipografía Gibson (Medium + Heavy en la misma frase, MAYÚSCULA en la palabra clave) para subtítulos y títulos, Amandine solo en portadas y resaltados, palabra-golpe en Gibson Heavy con degradé taupe/arena o blanca con contorno chocolate, subtítulos blancos al pecho que nunca tapan la cara, mucho B-roll en los momentos importantes, light leak cálido como transición, música funk para redes, paleta chocolate / taupe / arena / crema, más la referencia de tres reels aprobados (documentación para vender, seguridad en barrios cerrados, vivir en Terralagos) y la guía de portadas. Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Tamara Alarcón / TA (reels, pauta de propiedades, carruseles en video, portadas), o cuando el usuario diga "editá el video de Tamara", "video de TA", "con la marca de Tamara Alarcón", aunque no mencione la skill.
---

# Tamara Alarcón (TA) — Marca para video

Reglas obligatorias (márgenes, cara, audio, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 5 de esta skill. Acá va solo lo propio del cliente.

- Cliente: **Tamara Alarcón**, inmobiliaria en **zona sur del GBA**: barrios cerrados y Terralagos (Canning). Siglas de archivos: **TA**.
- Voceros: **Tamara** (la mayoría, sentada en sillón de mimbre, plano medio) y **una vocera joven del equipo** en algunos reels de Terralagos (17-08, 10-07). *Nombre a confirmar.*
- Público y lugar: familias de AMBA que quieren mudarse a barrio cerrado o vender su casa. **El stock tiene que parecer de Buenos Aires / barrio cerrado argentino**: casas bajas con jardín, garitas, lagunas, nada de skyline de Miami ni suburbios yanquis evidentes. Moneda: **USD** para propiedades (lo normal en Argentina), ARS solo para expensas o gastos chicos.
- Tono: cercano, didáctico, **voseo rioplatense** ("usás", "querés", "comentame", "empezá por ahí"). Términos locales que Whisper suele romper: *libre deuda*, *expensas*, *sucesión*, *escritura*, *boleto*, *Terralagos*.
- CTA habitual: "Comentame…", "Empezá por ahí", pregunta a la audiencia.
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM TA Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/ EXPORT/`. El final va en `EXPORT/` con el nombre de la carpeta `.mp4`.
- Formato de las referencias: 1080×1920, **25 fps**, 25–35 s.
- Logo: **no se usa** en los reels. Sin placa final.

## 1. El manual vs. los videos
La "imagen de marca" es solo la paleta (`assets/paleta.png`, de Coolors) y un doc con las dos fuentes. Del manual pasa todo: Gibson es la tipografía de trabajo y la paleta tiñe los acentos (contorno chocolate, degradé taupe/arena, caja oscura). El blanco puro manda en los subtítulos: los tonos crema solos no se leen sobre exteriores claros.

## 2. Tipografía — Gibson + Amandine
**Adobe Fonts** (licencia de Creative Cloud): **no se copian al repo** ni se reparten. Activarlas en Creative Cloud → Fuentes (*Gibson* y *Amandine*). Para renderizar fuera de Premiere (PIL, Remotion) `scripts/fuentes_adobe.py` encuentra los archivos activados en esta Mac (`python scripts/fuentes_adobe.py` → imprime la ruta de cada peso). Si no aparecen, la fuente no está activada.

Interletrado: 0 a −1 %. Interlineado de títulos **0,85–0,9** (las líneas casi se tocan); en el bloque apilado de B-roll, ~0,8.

| Uso | Peso |
|---|---|
| Subtítulo: palabras de relleno | Gibson **Medium** |
| Subtítulo: palabra clave (en MAYÚSCULA si es la idea fuerte) | Gibson **Heavy** |
| Títulos del gancho y del cierre | Gibson **Heavy** (Bold en líneas secundarias) |
| Palabra-golpe (FRENA, VENTA, VISITA, 15 DÍAS) | Gibson **Heavy** grande, con degradé o contorno (§4) |
| Portadas y resaltados especiales | **Amandine Bold** (con moderación; nunca en subtítulos) |

## 3. Color
| Nombre | HEX | Uso en video |
|---|---|---|
| Chocolate | `#462F22` | contorno de la palabra-golpe sobre B-roll, sombra, caja de portada (≈60 %) |
| Taupe | `#9A886F` | inicio del degradé de la palabra-golpe |
| Arena | `#D2C3B7` | final del degradé (taupe → arena, de abajo hacia arriba) |
| Crema | `#E8E0D9` | fondos de placa, palabras secundarias en portada |
| Blanco | `#FFFFFF` | subtítulos y títulos base |

## 4. Sistema de texto y acabado
Ver `assets/sistema-texto.jpg` (frames de la referencia + paleta) y `assets/prueba-sistema.jpg` (título + palabra-golpe + subtítulo armados con Gibson real; título y subtítulo juntos solo para la prueba).
- **Subtítulos:** 1–3 palabras por pantalla, **~58 px** de cuerpo (bloque de ~52 px de alto con descendentes), centrados. Mezcla Medium + Heavy en cada pantalla ("a **publicar**", "**NO** se **ENFRÍA**"). Blancos con sombra suave oscura; sobre B-roll muy claro (cielo, arena) llevan **caja negra al ~45 %** ajustada al texto. Sobre Tamara van **al pecho (y ≈ 1230–1280)**, debajo del mentón: **nunca le tapan la cara**. Sobre B-roll, al centro (y ≈ 960–1000). Entran por corte, sin animación rara.
- **Títulos (gancho y cierre):** arriba de la cabeza (y ≈ 360–620), **alineados a la izquierda (x ≈ 110)**, Gibson Heavy ~105 px, blanco, 2–3 líneas en mayúscula/minúscula mezclada con la palabra clave en MAYÚSCULA ("**APARECE** un comprador", "Por una carpeta que **NUNCA** se"). Se escriben de a una línea al ritmo de la voz. Título *o* subtítulo, no los dos.
- **Palabra-golpe:** la última palabra del título, sola en su línea, **~160 px** Gibson Heavy, **degradé taupe `#9A886F` → arena `#D2C3B7`** con sombra (sobre Tamara) — "se **FRENA**", "en **VENTA**", "**VISITA**", "**COMPRAR**". Sobre B-roll, la versión **blanca con contorno chocolate `#462F22` + filete blanco exterior + sombra**, en bloque apilado ("es **JUNTAR** / **TODA** la / **DOCUMENTACIÓN**").
- **B-roll en los momentos importantes:** cada vez que nombra algo concreto (documentos, libre deuda, expensas, inspección, firma, garita, visitas, laguna, náutica) se corta a B-roll a pantalla completa. En las referencias, **40–55 % del tiempo** es B-roll en los reels a cámara y hasta ~85 % en el de lugar. Tamara vuelve a cámara para el gancho, los giros y el CTA.
- **Transición de la casa:** **light leak cálido** (ámbar/dorado, `Generated Light Leak 1` de Premiere) al pasar de cámara a B-roll o entre bloques, y un **desenfoque/zoom rápido** en el corte al título-golpe. Whoosh en cada uno.
- **Zooms y ritmo:** punch-in suave entre frases sobre la toma a cámara (2 escalas alternadas). Planos de B-roll de 1–2 s.
- **Música:** **funk para redes** (groove, bajo marcado, sin voces), bajo la voz. En las referencias se usaron temas de Motion Array más corporate-groove (*Business Corporate Theme*, *Blink Blink*, *Explore Together*); para los próximos, ir a funk. Ideas en `references/biblioteca.md`. Niveles: los de la base (las referencias quedaron entre −25 y −15 LUFS, **por debajo** del master de la base: no copiar eso).
- **SFX:** whoosh/swoosh en transiciones, "Eye Wink" / click en la entrada de títulos (es el SFX que se repite en las tres referencias).
- **Stock:** `{STOCK}/` (documentos, firma, calculadora, inspección, ama de llaves…) + Motion Array. Material propio primero: tomas del barrio, garita, laguna, amenities.

## 5. Portadas
Analizadas (`assets/portadas.jpg`): `01 REELS/09 SEPTIEMBRE/<08-09, 10-09, 17-08>/PORTADA/`, `08 AGOSTO/05-08 TA Hace años que querés mudarte… y/PORTADA/`, `07 JULIO/10-07 TA Lo que cambia cuando tus hijos/PORTADA/`.
- Vocera en el tercio inferior, mirando a cámara; **el fondo se oscurece/desatura** y ella queda más expuesta.
- Texto **arriba de la cabeza**, alineado a la izquierda o centrado, 3–4 líneas muy apretadas (interlineado ~0,85), pegado a la cabeza.
- Lockup: Gibson Medium/Bold blanco + palabras clave en **Gibson Heavy MAYÚSCULA con degradé taupe → arena** ("Los **PAPELES** se **JUNTAN** antes de **FIRMAR**"). Las cifras van gigantes ("**15 DÍAS?**").
- Variante con **caja chocolate translúcida** (`#462F22` ~60 %, esquinas redondeadas) detrás del texto cuando el fondo es claro o con mucho detalle.
- Amandine puede usarse en una palabra de resalte, nunca en todo el bloque.

## 6. Referencias aprobadas (REFERENCIA, no fórmula)
Mirar antes de editar. Detalle plano a plano en `references/piezas.md`.

### A. Reel educativo a cámara + B-roll — `01 REELS/09 SEPTIEMBRE/08-09 TA Los papeles se juntan antes de/` (27,8 s)
- Gancho en títulos arriba: "APARECE un comprador / Quiere AVANZAR… / La operación se **FRENA** / Por una carpeta que NUNCA se **ARMÓ**".
- Mitad central casi toda en B-roll (documentos, calculadora, inspección, firma) con subtítulos al centro y bloque apilado en DOCUMENTACIÓN.
- Cierre a cámara: "Si vas a publicar TU PROPIEDAD en **VENTA** / EMPEZÁ por AHÍ".

### B. Reel de preguntas — `01 REELS/09 SEPTIEMBRE/10-09 TA Qué preguntar de verdad sobre l/` (25,3 s)
- Gancho: "¿Qué PREGUNTAR sobre LA **SEGURIDAD**?" con la palabra-golpe en degradé.
- Cada pregunta ("¿CÓMO INGRESAN LAS VISITAS?", "¿CÓMO FUNCIONA…?") sobre su B-roll (garita, dron de barrio, portero). Transición con zoom-blur.
- Cierre: "Todas estas PREGUNTAS / se hacen durante la **VISITA** / NO después de **COMPRAR**".

### C. Reel de lugar con vocera joven — `01 REELS/09 SEPTIEMBRE/17-08 TA Esto lo usás quince días al año/` (35,4 s)
- Abre en la playa de Terralagos con un objeto (ojota) y "ESTO / 15 días". Stock del "verano típico" (calendario, calculadora, ruta, sombrilla, valija) y después todo material propio del lugar.
- Palabra clave en contorno chocolate sobre exteriores ("LAGUNA CRISTALINA", "365 DÍAS"), caja negra en los subs sobre cielo.
- CTA a cámara: "**COMENTAME** ¿cuántos días de verano…?".

## 7. Ideas que pueden sumar (opcionales, a criterio)
- Contador o cifra grande animada cuando hay números (15 vs 365 días, cantidad de papeles).
- Checklist con tilde (SFX `check mark`) cuando enumera documentos o preguntas.

## 8. Correcciones del cliente
*(vacío — sumar con fecha y pieza de origen)*
