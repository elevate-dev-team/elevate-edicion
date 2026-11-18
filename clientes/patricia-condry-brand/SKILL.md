---
name: patricia-condry-brand
description: Identidad visual para video de Patricia Condry (PCO), Realtor en la zona de Tampa / Pasco County, Florida (Zephyrhills, Dade City, Wesley Chapel, San Antonio; casas nuevas, USD, español neutro con tuteo). Montserrat con mezcla de pesos (Light + Medium + Bold/ExtraBold, Bold Italic de acento; el manual dice Gotham pero en video va Montserrat), subtítulos blancos Montserrat Bold de 1–3 palabras en minúscula al pecho con sombra suave y entrada pop desenfocada, título de apertura arriba a la izquierda con pesos mezclados ("casa **nueva** en" + ciudad con pin), precio gigante en Montserrat ExtraBold blanco sobre la cabeza, golpes en MAYÚSCULA apretada, light leaks rosa/naranja y zoom-blur como transición, texto blanco (la paleta navy `#05005C` / `#0B0284` vive en el degradé de las portadas), motion de marca en blanco + navy (mapas de Florida/Pasco con pin, línea de tiempo, sello giratorio, tachón, pastilla CTA), más la referencia de ocho piezas aprobadas (cinco pautas de casa nueva y tres reels de zona: el condado que supera a Miami-Dade, los 53 negocios de Dade City y el centro de Dade City tiene 100 años, con motion) y la guía de portadas con degradé navy (2 frames de Patricia sonriendo, portada A/B). Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Patricia Condry / Patricia / PCO (reels, pauta de propiedades, videos de zona, portadas), o cuando el usuario diga "editá el video de Patricia", "video de PCO", "con la marca de Patricia Condry", aunque no mencione la skill.
---

# Patricia Condry (PCO) — Marca para video

Reglas obligatorias (márgenes, cara, audio, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 5 de esta skill. Acá va solo lo propio del cliente.

- Cliente: **Patricia Condry**, Realtor en **Tampa / Pasco County, Florida** (Zephyrhills, Dade City, Wesley Chapel, San Antonio). Mucha casa nueva de constructora. Siglas de archivos: **PCO**.
- Vocera: Patricia, sola, a cámara con un micrófono de solapa en la mano (se ve: es parte de su estilo, no se tapa).
- Público y lugar: hispanos que compran en Florida. **El stock tiene que parecer de Florida**: casas de una planta con siding, barrios nuevos, palmeras, cielo con nubes, downtowns chicos. Moneda **USD**.
- Tono: español neutro con **tuteo** ("Acompáñame", "Escribe", "¿Te quieres…?"). Usa términos en inglés del rubro (HOA, CDD, FHA, down payment, walk-in): se dejan como los dice.
- CTA habitual: "escríbeme / agenda una visita y revisamos tus opciones de financiamiento", a cámara.
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM PCO Título>/` (plantilla en `01 REELS/000/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/ EXPORT/`). El final va en la carpeta de la pieza con el nombre de la carpeta `.mp4`, y la portada al lado (`.png` / `.jpg`).
- Formato de las referencias: 1080×1920, **25 o 30 fps** (mantener el del crudo), 40–83 s. Las pautas de casa suelen durar 60–80 s y los reels de zona, 40–45 s.
- Logo: no se usa. Sin placa final.

## 1. El manual vs. los videos
El manual es solo la paleta de Coolors (`assets/paleta.png`) y la familia Gotham.
- **Tipografía:** las piezas publicadas usan **Montserrat**, no Gotham. Se comparó el precio renderizado en las dos: la coma larga y el "9" son de Montserrat. La Gotham de `00 IMAGEN DE MARCA/` viene de freefontsfamily (**sin licencia comercial**): no usarla.
- **Color:** en los videos el texto es **blanco con sombra**. El navy aparece solo en el **degradé de las portadas**. El amarillo `#F4FF48` no aparece en ninguna pieza aprobada: no usarlo salvo pedido.

## 2. Tipografía — Montserrat
Archivos en `assets/fonts/montserrat/` (licencia OFL, `LICENSE.txt`). Interletrado 0 a −2 %, interlineado de títulos 0,85–0,9: las líneas casi se tocan.

| Uso | Peso |
|---|---|
| Subtítulo | Bold, minúscula |
| Título de apertura, palabra común | Medium o Light ("casa", "en") |
| Título de apertura, palabra clave | Bold ("**nueva**") |
| Ciudad / barrio | Bold o **Bold Italic**, a veces en MAYÚSCULA |
| Golpes de texto | Bold/ExtraBold en MAYÚSCULA, centrados, o Light + Bold mezclados ("un estilo / **DE VIDA**") |
| Precio | ExtraBold |
| Números gigantes (calles, cifras) | Black ("5th", "7th") |

## 3. Color
| Nombre | HEX | Uso en video |
|---|---|---|
| Blanco | `#FFFFFF` | Todo el texto en video, con sombra suave negra (~40 %, desenfoque 8–12 px) |
| Navy noche | `#05005C` | Degradé superior de las portadas (opaco arriba → transparente a mitad del cuadro) |
| Navy | `#0B0284` | Segundo tono del degradé de portada; placas si alguna vez hacen falta |
| Gris claro | `#E4E4E4` | Reserva (barra de revelado, placas claras) |
| Amarillo | `#F4FF48` | Está en el manual pero **no se usa** en las piezas aprobadas |

## 4. Sistema de texto y acabado
- **Subtítulos:** Montserrat Bold blanco, **1–3 palabras en minúscula**, de 44 a 60 px, con sombra suave y sin caja. Van centrados a la altura del pecho (y ≈ 1085–1240 sobre 1920, según el encuadre; la base manda si tapa la cara). Entran con un **pop corto con desenfoque** (escala 90→100 % y desenfoque 8→0 px en 3–4 frames). Las cifras pueden ir un paso más grandes ("del **5.25%**"). Llevan puntuación ("habitaciones,", "techado.").
- **Título de apertura (pautas):** primeros 2–4 s, arriba a la izquierda (x ≈ 100–130, y ≈ 450–600). Línea 1 en minúscula con pesos mezclados, "casa **nueva** en" (~85 px). Línea 2 la ciudad en Bold / Bold Italic, más grande y con **pin** ("📍Dade City", "Wesley Chapel" con el pin arriba). Entra palabra por palabra. Título *o* subtítulo, no los dos.
- **Precio:** Montserrat ExtraBold blanco de ~150 px, centrado arriba de la cabeza (y ≈ 450–580), solo o con "desde". Formato **`$294,990`** (coma de miles, sin decimales). En el hook puede revelarse con una barra blanca que barre (Hook 2 de Wesley Chapel). Cuotas y datos ("$2,600", "4 cuartos") en el mismo sistema, más chicos, sobre el B-roll.
- **Golpes de texto (reels de zona):** MAYÚSCULA Bold centrada, de 2–3 líneas pegadas ("TODO ESTO / ESTÁ ENTRE / DOS CALLES"), o números Black gigantes que salen por detrás de Patricia ("5th 7th").
- **Transiciones:** **light leak** rosa/naranja (la "de la casa", 8–12 frames) y **zoom con desenfoque** entre planos de B-roll. El resto, corte seco.
- **Ritmo:** pauta = hook a cámara frente a la casa → recorrida en B-roll (fachada, cocina, cuartos, baños, garage, amenities) con Patricia volviendo a cámara cada 10–15 s → números (tasa, cuota, HOA/CDD) → CTA a cámara. Planos de B-roll de 1,5–3 s.
- **Música y SFX:** fondo suave y positivo bajo la voz; swoosh en las transiciones y en la entrada del precio. Niveles: los de la base (las piezas viejas estaban entre −16 y −22 LUFS; las nuevas van a −11).
- **Stock / B-roll:** primero el material de la propiedad y los drones del barrio. En los reels de zona, stock de parejas, llaves y maqueta (casas de Florida, gente hispana o diversa).

## 5. Portadas
Analizadas las 6 publicadas (`assets/portadas-referencia.jpg`; originales en `{CARPETA_CLIENTE}/01 REELS/11 NOVIEMBRE/*/` como `.png` o `.jpg`).
- **Fondo:** frame del video con un **degradé navy desde arriba** (`#05005C` → `#0B0284` → transparente hacia la mitad) que oscurece el cielo y hace leer el texto. Patricia más expuesta que el fondo.
- **Lockup:** texto blanco, interlineado muy apretado (las líneas se tocan), mezclando Light / Medium + Bold / ExtraBold + Bold Italic de acento. Ejemplos:
  - "Casa **Nueva** en / **ZEPHYRHILLS** / por **U$D 361K**" (pauta; la ciudad en MAYÚSCULA ExtraBold).
  - "*Casa* en ***DADE CITY*** / *4 cuartos* **$280K**" (Italic Light + Bold Italic).
  - "El **condado** / que **supera** a / **Miami-Dade** / *en ventas*" (reel de zona, alineado a la derecha).
  - "**53** negocios, / dos calles, / *un solo* / **estacionamiento**" (número gigante + bloque).
- **Posición:** el bloque de texto arriba de Patricia, pegado a su cabeza o hombros, centrado o alineado a un lado. Patricia abajo, al centro o desplazada.
- **Precio en portada:** formato corto con `USD` ("USD 361K", "$280K"). En las viejas aparece "U$D": de ahora en más va `USD`.
- Va como primer frame del video (base + `portadas-reels`).
- **Frames:** Tomi pide al menos **2 frames de Patricia sonriendo o con la boca cerrada** (18-11). Elegirlos midiendo la apertura de la boca (`portadas-reels/scripts/boca.swift`) en los finales de toma (antes de hablar / después de la última palabra suelen ser sonrisas), armar portada A y B y entregar las dos; la elegida va al frame 0 y la otra se saca de `PORTADA/`.
- Aprobada (G): "El **centro** de / **Dade City** / *tiene* **100** *años*" (Light + Bold / ExtraBold 134 / Bold Italic 70 + Black 196), base del "100" 30 px arriba del pelo, frame con zoom 1,2× anclado arriba para bajar la cabeza y dar lugar al texto; degradé navy desde arriba hasta y ≈ 1000. Script: `scripts/portada_pco.py`.

## 6. Referencias aprobadas (REFERENCIA, no fórmula)
Mirar antes de editar. Detalle de cada una en `references/piezas.md`. Hojas de los sistemas en `assets/sistema-video.jpg`.

| | Pieza (carpeta en `01 REELS/11 NOVIEMBRE/`) | Tipo | Dur. |
|---|---|---|---|
| A | `09-09 PCO PAUTA CASA EN DADE CITY 280K 4` | Pauta, casa amoblada | 68 s |
| B | `Hook 1` y `Hook 2` (01-09 Wesley Chapel $294,990) | Pauta con 2 hooks | 60–62 s |
| C | `13-10 PCO PAUTA San Antonio USD 319.340` | Pauta con tasa fija | 83 s |
| D | `01-10 PCO PAUTA CASA DE 4 HABITACIONES E` (Zephyrhills) | Pauta con números FHA | 74 s |
| E | `06-09 PCO El condado que le está ganando` | Reel de zona a cámara + stock | 44 s |
| F | `16-09 PCO 53 negocios. Dos calles. Un so` | Reel de zona selfie caminando | 40 s |
| G | `05-11 PCO El centro de Dade City tiene 1` | Reel de zona a cámara con motion de marca (mapas, línea de tiempo, sello) | 51 s |

## 6.1 Motion de marca (reels de zona y educativos)
Tomi lo pide "como en DC, ISM, AR y REB" (18-11, pieza G), **después** del OK a la estructura. Sistema aprobado en G (código en `assets/remotion/pco0511_Video.tsx`):
- Todo en **blanco + navy**, Montserrat, sombra suave; nada de amarillo.
- Placas a pantalla completa = su propio plano desenfocado (28 px) + degradé `#05005C`→`#0B0284` + textura de puntos; el subtítulo pegado debajo del gráfico.
- Mapas de Florida → Pasco → barrios con pin blanco (punto navy) y casitas navy con borde blanco; rótulo chico "mapa ilustrativo". Si los barrios no los dice Patricia, informarlos para aprobación.
- Línea de tiempo con marcas (punto blanco = la nueva, navy = la anterior), sello circular navy giratorio con texto en anillo, tachón navy con borde blanco, pastilla blanca con texto navy para el CTA.
- Cifras/años en Black gigantes detrás de Patricia (rotoscopia) como en F.

## 7. Ideas que pueden sumar (opcionales, a criterio)
- Un mapa simple del condado en navy para los reels de zona.
- Tarjeta de números (precio / cuota / tasa / HOA) en blanco sobre un degradé navy, cuando la pauta tenga muchos datos.

## 8. Correcciones del cliente
- 18-11 (pieza G, primer video): aprobado sin correcciones con Montserrat, sin amarillo y −11 LUFS: las decisiones por defecto de la creación quedan confirmadas.
- 18-11 (creación de la skill): precio con coma (`$294,990`) y `USD` en las portadas; los subtítulos viejos tenían `$360.000` y las portadas `U$D`.
