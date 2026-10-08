---
name: iniesta-maglio-brand
description: Identidad visual para reels de Iniesta Maglio (INE), inmobiliaria / desarrollos inmobiliarios en CABA, Buenos Aires (Versalles, oficina en Av. Ramón Falcón). En los reels NO se usa la Gotham del manual sino Montserrat con mezcla de pesos (Light/Medium Italic de relleno + ExtraBold/Black en la palabra clave, ExtraBold Italic de acento), subtítulos blancos de 1–3 palabras, caja-marcador naranja semitransparente detrás de frases clave, títulos-golpe en Montserrat Black MAYÚSCULA naranja #E2791D con contorno blanco, precio en Black Italic con degradé naranja, flashes de luz de color como transición, más la referencia de cuatro pautas aprobadas (recorrido de PH, educativa de captación, institucional a cámara y tasación con dramatización) y la guía de portadas. Se usa junto con edicion-reels-base (reglas obligatorias) y portadas-reels. Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Iniesta Maglio / INE (reels, pautas de propiedad, captación, portadas), o cuando el usuario diga "editá el video de Iniesta", "video de INE", "con la marca de Iniesta Maglio", aunque no mencione la skill.
---

# Iniesta Maglio (INE) — Marca para reels

Reglas obligatorias (márgenes, cara, voz, niveles, fin al terminar de hablar, subtítulo pegado bajo la cara, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 5 de esta skill. Acá va solo lo propio del cliente.

- Cliente: **Iniesta Maglio — Desarrollos Inmobiliarios**, inmobiliaria en **CABA** (oficina en Av. Ramón Falcón 5605, piso 1; zona Versalles / Floresta / Villa Luro). Siglas de archivos: **INE**.
- Voceros: varios integrantes del equipo (hombres de 30 y pico y una mujer), no una sola cara. Hablan en **plural de equipo** ("te mostramos", "trabajamos nosotros", "Escribinos").
- Tono: porteño, cercano, directo, con voseo ("¿Estás buscando…?", "Vení que te mostramos", "hablanos"). Respetar lo que dicen en los subtítulos. Ojo con Whisper: "Escribinos" sale como "Escribimos" y "tasan" como "tazan": corregir a mano.
- CTA siempre a **escribir**: "Escribinos por WhatsApp y coordinamos la visita", "Escribinos ahora", "hablanos".
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM INE Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/` (plantilla `01 REELS/000/`). Las pautas llevan **PAUTA** en el nombre (`14-09 INE PAUTA PH de 4 ambientes, coche`). El final va en la raíz de la carpeta del proyecto con el nombre de la carpeta `.mp4`, y la portada como `.png` 1080×1920 con el mismo nombre al lado.
- Formato de las referencias: **1080×1920, 30 fps**, 25–42 s.
- **Stock / B-roll**: tiene que parecer **Buenos Aires** (edificios de departamentos porteños, PH, veredas con árboles, adoquines, murales; nada de suburbio americano). Priorizar siempre material real del cliente.

## 1. El manual vs. los reels (importante)

El manual (`assets/marca/MANUAL DE MARCA.pdf`, 2019) define: logo "im" + INIESTA MAGLIO en **Gotham Book**, negro `#1D1D1B` + naranja `#E2791D` (Pantone 158C), logo siempre en sus colores sobre blanco, área de reserva = ancho del isotipo. **De eso, en los reels solo pasa el naranja.**

- **Tipografía de los reels: Montserrat**, no Gotham. Gotham (`assets/fonts/gotham/`) queda solo para piezas institucionales (placa con logo, banner) si se piden.
- **No se usa logo** en los reels (ninguna referencia lo tiene; tampoco end card). Si se pide, respetar el manual: colores originales sobre blanco, o blanco sobre foto. No hay PNG del logo suelto: sale del PDF del manual (vectorial) o de `assets/marca/FB.png`. `ICONOS INIESTA MAGLIO.png` es un ícono de redes (abrazo negro sobre naranja), no el isotipo.
- El negro `#1D1D1B` aparece solo como fondo de placas.

## 2. Tipografía — Montserrat

Archivos en `assets/fonts/montserrat/` (familia completa con itálicas, OFL). Interletrado apretado (~−2 % del cuerpo), interlineado de títulos ~0,85 (las líneas casi se tocan).

| Uso | Peso |
|---|---|
| Relleno del subtítulo, frases de transición ("¿Estás buscando", "donde vas", "Todos tenemos un", "un familiar") | **Light Italic / Medium Italic** |
| Palabra clave del subtítulo ("**vale tu casa**", "**4 ambientes**", "**hermoso**", "**Santo Tomé**") | **ExtraBold / Black** |
| Acento ("*orientación*", "*3 dormitorios*", "*Es una opinión*", "*no un dato.*") | **ExtraBold Italic / Black Italic** |
| Golpes, CTA ("SI ESTÁS", "EN VENDER.", "ESCRIBINOS", "POR WHATSAPP Y") | **Black MAYÚSCULA** |
| Precio | **Black Italic** |

La firma es el contraste **itálica fina ↔ Black recta** de una pantalla a la otra (o dentro de la misma).

## 3. Color

| Nombre | HEX | Uso en reels |
|---|---|---|
| **Naranja Iniesta** | `#E2791D` (render ≈ `#E8780F`) | Títulos-golpe, caja-marcador, precio, barras de portada |
| Durazno | `#FCCA8C` | Parte clara del degradé del precio y de los golpes de portada |
| Negro | `#1D1D1B` | Fondo de placas |
| Blanco | `#FFFFFF` | Subtítulos, contornos |

Degradé de marca (precio y portadas): vertical, **`#FCCA8C` arriba → `#E98834`/`#E2791D` abajo**.

## 4. Sistema de texto en video

**Subtítulos**
- **1–3 palabras por pantalla**, blancos, Montserrat ~60 px, sombra paralela oscura suave, centrados en x. En las referencias quedaron a y ≈ 960–1050; la posición la manda `edicion-reels-base` (pegado bajo la cara a cámara, centrado sobre B-roll).
- **Caja-marcador naranja**: rectángulo `#E2791D` al ~85 % pegado al texto (sin redondear, padding ~8 px) detrás de la frase del gancho y de 3–6 frases clave por video ("¿Estás buscando", "4 ambientes", "con cochera", "Tenés 10 segundos", "scrolleando", "es el problema?", "la cercanía", "AHORA.", "LA VISITA."). Variante vista en 16-08: dentro de la caja, Black Italic con relleno marrón oscuro y contorno blanco ("*tu propiedad*"): usarla poco.

**Títulos-golpe** (reemplazan al subtítulo mientras están)
- **Montserrat Black MAYÚSCULA naranja con contorno blanco fino (~4–6 px) y sombra**, 1–2 líneas apretadas, ~60–70 % del ancho: "¿SABES QUÉ / VE PRIMERO?", "ES UNA / OPINIÓN", "TRABAJAMOS", "UN BALCÓN.".
- Variante blanca grande sin caja: "EN ESE / ORDEN".
- **Encabezado fijo + subtítulo**: cuando un concepto se desarrolla varios segundos, el golpe queda arriba (blanco con contorno naranja: "PUBLICAR BIEN") y debajo corren subtítulos chicos en Bold Italic ("solamente", "subir fotos", "en un portal.").
- **Placa negra**: fondo `#1D1D1B` con texto Black MAYÚSCULA blanco **en contorno** (relleno negro, trazo blanco), entrando palabra a palabra ("UNO DE LOS / BARRIOS MÁS / TRANQUILOS DE…"). Corta un recorrido para remarcar un dato de zona.
- **Precio**: línea chica "es de" en blanco + "**$259.000**" en Black Italic con el degradé naranja, grande y centrado, entra con flash de luz.

**Transiciones y acabado**
- **Flash / light leak de color** (naranja, rosa, violeta, cálido) con un desenfoque corto, en los cambios de bloque y para presentar el precio o un golpe ("y el precio", "EN ESE ORDEN", "Una tasación").
- **Punch-ins** alternados en tomas fijas a cámara (16-08 es una sola toma sostenida solo con zooms).
- Corte limpio en el resto; recorridos con planos de 1–2 s.
- Música de fondo continua bajo la voz. Referencias entre −10 y −14,8 LUFS: **para niveles vale `edicion-reels-base` (−11)**.

## 5. Las 4 referencias aprobadas (mirar antes de editar)

Todas en `01 REELS/10 Octubre/`. Las cuatro son PAUTA.

### A. Pauta de propiedad — `14-09 INE PAUTA PH de 4 ambientes, coche/` (41,9 s)
- Vocero en la vereda, café en mano, gancho con pregunta ("¿Estás buscando un PH de 4 ambientes en Versalles?") con caja-marcador; "Vení que te mostramos" y entra caminando (cámara detrás, sube la escalera).
- Recorrido ambiente por ambiente al ritmo de lo que nombra (dormitorios, cocina, baño, lavadero, terraza con parrilla), subtítulo centrado; placa negra "UNO DE LOS BARRIOS MÁS TRANQUILOS…"; golpe "UN BALCÓN."; precio con flash; CTA "POR WHATSAPP Y / LA VISITA." en Black con caja.

### B. Pauta educativa de captación — `15-09 INE PAUTA Lo que mira un comprador/` (28,8 s)
- Vocera caminando y hablando en varias locaciones de la ciudad (vereda junto a auto, avenida, mural del sol), después sentada en una oficina.
- Gancho "Tenés **10 segundos**" con caja + golpe "¿SABES QUÉ VE PRIMERO?"; flashes de color en "y el precio" / "EN ESE ORDEN"; encabezado fijo "PUBLICAR BIEN" con subtítulos debajo; cierre "AHORA." con caja.

### C. Pauta institucional a cámara — `16-08 INE PAUTA Quién vende tu casa cuan/` (25,2 s)
- Una sola toma en escritorio (plano medio, buzo claro, fondo blanco), sin B-roll: el ritmo lo dan los punch-ins y el texto.
- Subtítulos con mucha variación de peso y cajas ("tu propiedad", "inmobiliaria?", "que pocos", "la cercanía"), golpe "TRABAJAMOS", cierre "SI ESTÁS… EN VENDER." en Black blanco.

### D. Pauta de captación (tasación) — `16-09 INE La diferencia entre _tasar_ y/` (24,6 s)
- Vocero en exterior apoyado en un auto + **dramatización** en un bar (dos personas con cerveza) para "todos tenemos un conocido que te tira un número".
- Golpe "ES UNA / OPINIÓN" naranja, contraste "*Es una opinión* / **no un dato.**", flash cálido en "Una tasación", CTA "ESCRIBINOS" Black blanco con contorno oscuro.

## 6. Portadas

Analizadas las 4 portadas de las referencias (`.png` al lado de cada `.mp4`). Formato, cuadrado 1080×1080, sujeto aislado y primer frame: skill `portadas-reels`.

- Lockup de 2 niveles en Montserrat: **bajada** ExtraBold blanca en sentence case (a veces itálica: "¿Quién vende / tu casa…", "cuando elegís", "Lo que mira un / comprador", "La **diferencia** entre") + **golpe** Black MAYÚSCULA con **degradé `#FCCA8C` → `#E98834`** ("EN LOS PRIMEROS / 10 SEGUNDOS", "UNA INMOBILIARIA?", "\"TASAR\" Y / \"OPINAR\"").
- Interlineado pegado, sombra suave, sin contorno. Texto sobre el pecho, debajo del mentón (bajada puede ir arriba de la cabeza y el golpe en el pecho, como en 15-09).
- Fondo: la foto del video con **degradé naranja `#E27F29` desde arriba** (16-08) o el fondo natural más cálido; sujeto más iluminado que el fondo.
- **Portada de propiedad** (14-09): foto del mejor ambiente, bloque alineado a la izquierda con **barra vertical naranja sólida `#E2791D`** en el borde, "PH DE 4 AMBIENTES / COCHERA Y TERRAZA" ExtraBold MAYÚSCULA blanca + "en *Versalles*" (Medium + ExtraBold Italic) y el **precio "USD 259.000" blanco en caja naranja sólida** abajo.

## 7. Ideas opcionales (a criterio)
- En pautas de propiedad, una placa breve de datos (ambientes · m² · cochera · precio) con el sistema de golpes naranjas si la voz los enumera rápido.
- La dramatización (D) funciona bien para captación: si hay material, usar escenas cortas de "situación" en lugar de stock.
