---
name: luciano-laudani-brand
description: Identidad visual para video de Luciano Laudani (LUL, "Lucho"), inmobiliario en zona sur del Gran Buenos Aires, Argentina (Adrogué, José Mármol, Almirante Brown, Canning, Monte Grande, Lomas de Zamora). Montserrat con mezcla de pesos (Light/Regular de base + ExtraBold / Black en la palabra clave) y Begum (serif de Adobe Fonts) para resaltar, subtítulos blancos de 1–4 palabras a media altura que nunca tapan la cara, palabra clave con caja roja semitransparente o en Montserrat Black índigo con borde blanco, títulos-golpe que combinan Begum en degradé plateado + Montserrat Black en degradé rojo con glow montados uno sobre otro, precios en USD en rojo y metros/distancias en azul eléctrico, B-roll y drone del barrio en los momentos importantes, whips/zoom con desenfoque de Animation Composer y light leaks como transición, SFX de swoosh + CashMoney en el precio + click/wink en palabras clave, música funk para redes o corporate, paleta noche / índigo / rojo / blanco, más la referencia de seis piezas aprobadas (cuatro tour house de pauta y dos reels de barrio: Adrogué y José Mármol) y la guía de portadas con caja índigo. Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Luciano Laudani / LUL / Lucho (reels, tour house, pauta de propiedades, videos de barrio, portadas), o cuando el usuario diga "editá el video de Luciano", "video de LUL", "con la marca de Luciano Laudani", aunque no mencione la skill.
---

# Luciano Laudani (LUL) — Marca para video

Reglas obligatorias (márgenes, cara, audio, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 5 de esta skill. Acá va solo lo propio del cliente.

- Cliente: **Luciano "Lucho" Laudani**, inmobiliario en **zona sur del GBA** (Adrogué, José Mármol, Almirante Brown, Canning, Monte Grande). Siglas de archivos: **LUL** (las piezas viejas dicen LL).
- Vocero: él solo, a cámara frente a la propiedad o en una plaza/calle del barrio; a veces caminando hacia cámara.
- Público y lugar: familias que compran o se mudan dentro del conurbano sur. **El B-roll tiene que parecer de ahí**: casas bajas con tejas, calles arboladas y empedradas, plazas con monumento, estación y tren del **Roca**, barrios cerrados de Canning. Moneda: **USD** (`USD 199.000`, punto de miles).
- Tono: rioplatense, cercano, voseo ("tenés", "escribime", "mirá"). Respetar lo que dice en los subtítulos.
- CTA habitual: **ESCRIBIME** (por WhatsApp / para coordinar una VISITA / si estás pensando en mudarte).
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM LUL Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/ EXPORT/`.
- Formato de las referencias: 1080×1920, **25 o 30 fps** (respetar el del material), 36–56 s.
- **Logo: no se usa**, salvo que Luciano lo pida (el editor pasa la marca y avisa). Placa final: no.

## 1. El manual vs. los videos
El manual es una paleta (coolors) y un docx de fuentes ("Montserrat: subs y portadas; Begum: resaltar palabras"). Pasa todo, pero **encendido**: el rojo y el índigo se usan en degradé con brillo, no planos, y el índigo sube a un azul eléctrico para cifras. El `#1D1F37` casi no aparece salvo en sombras.

## 2. Tipografía — Montserrat + Begum
- `assets/fonts/montserrat/` (OFL): Light, Regular, Medium, ExtraBold, ExtraBold Italic, Black, Black Italic.
- **Begum** (Indian Type Foundry, pesos Regular/Bold + itálicas) es de **Adobe Fonts**: **cada editor la activa con su propia cuenta de Creative Cloud** (<https://fonts.adobe.com/fonts/begum>). **No se copia al repo** ni se extrae de kits web (la licencia no lo permite). Activada, queda en `~/Library/Application Support/Adobe/CoreSync/plugins/livetype/.r/` con nombre numérico: buscarla por su nombre interno para usarla en PIL/Remotion. Si el editor tiene un kit web propio de Adobe Fonts, va en su `~/.claude/elevate/config.json` → `fuentes.begum_kit`, nunca en la skill. Si no está activada, avisar al editor antes de reemplazarla por otra serif.
- Interletrado apretado (≈ −2 %) e interlineado ≈ 1,0 en subtítulos y 0,85 en títulos: las líneas casi se tocan y en los títulos dobles se **montan**.

| Uso | Fuente / peso |
|---|---|
| Subtítulo base | Montserrat **Light / Regular** |
| Palabra clave del subtítulo | Montserrat **ExtraBold** (a veces ExtraBold Italic), MAYÚSCULA si es la idea fuerte |
| Ambiente / dato en tour house | Montserrat **Black** MAYÚSCULA ("LIVING COMEDOR", "TOILETTE", "3 DORMITORIOS") |
| Primera línea del título-golpe | **Begum Regular**, minúscula, degradé plateado |
| Golpe del título, precio, CTA | Montserrat **Black**, degradé rojo + glow |
| Barrio / dato elegante | **Begum** (Regular o Bold) MAYÚSCULA ("CANNING CHICO", "BARRIO SAN FELIPE", "2 baños completos") |

## 3. Color
| Nombre | HEX | Uso en video |
|---|---|---|
| Rojo | `#ED2738` | Degradé vertical `#F16275` → `#ED2738` → `#D61E28` + glow rojo: precios, golpes, CTA, pin de ubicación |
| Rojo caja | `#ED2738` al ~85 % (se ve `#CE384D`) | Caja rectangular detrás de la palabra clave del subtítulo |
| Índigo | `#2D2A78` | Relleno de la palabra en Black con borde blanco; caja de portadas (~80 %) |
| Azul eléctrico | `#3A35E7` → `#5F5EC9` | Degradé de metros y distancias ("400 m", "120 m2 cubiertos") |
| Plateado | blanco → gris `#9A9A9A` | Degradé de Begum en la primera línea del título |
| Noche | `#1D1F37` | Sombras, reserva |
| Blanco | `#FFFFFF` | Subtítulos, bordes |

## 4. Sistema de texto y acabado
Ver `assets/sistema-texto.jpg` (recortes de las piezas) y `assets/prueba-sistema.jpg` (render de prueba con Begum Regular + Montserrat).
- En los proyectos de Premiere los subtítulos se generan sobre **fondo verde** (`RECURSOS/<pieza>.mp4`) y se integran con Ultra Key; si se hacen en Remotion/PIL, exportar con alfa y respetar el mismo look.
- **Subtítulos:** 1–4 palabras, máx. 2 renglones, Montserrat **~58 px** (cap ≈ 41 px), blancos con sombra suave, sin caja. Base en minúscula Light/Regular, palabra clave en ExtraBold. Centro de la frase a y ≈ 1150 (60 %); con plano cerrado baja al pecho. **Nunca sobre la cara.** Entrada corta (pop/escala).
- **Palabra clave (alternar, 1 recurso por frase):** (a) caja roja semitransparente detrás ("bajar", "y los ACCESOS"); (b) Montserrat Black MAYÚSCULA rellena índigo con borde blanco ~4 px y sombra; (c) Black en degradé rojo.
- **Título-golpe (la firma):** línea 1 en Begum Regular plateada + línea 2 en Montserrat Black roja con glow, montada sobre la primera ("hace más de / **150 años**", "tenés la Estación / **del Roca**", "patio cubierto con / **parrilla y jacuzzi**"). Título *o* subtítulo, no los dos.
- **Barrio al inicio:** pin rojo + nombre en Montserrat Black rojo ("📍Adrogué"), o Begum MAYÚSCULA roja ("EN / CANNING CHICO").
- **Precio:** Montserrat Black, degradé rojo + glow, con SFX CashMoney. **Metros/distancias:** Black en azul eléctrico con bajada en Montserrat plateada.
- **Placa blanca:** fondo blanco plano con texto Montserrat Black negro, para un giro del guion ("Y NO SIEMPRE").
- **CTA final:** "ESCRIBIME" en Black rojo grande + bajada en ExtraBold blanca ("por Whatsapp", "para coordinar una VISITA"), al pecho.
- **Transición de la casa:** whips/slides de **Animation Composer** con desenfoque de movimiento y bordes espejados, zoom con desenfoque radial y distorsión de lente; **light leaks** (MOGRT "Generated Light Leak 1/2/9") en cambios de tema. Cada transición lleva su swoosh.
- **Ritmo:** tour house con un plano por ambiente cada 1,5–2 s; punch-ins en las palabras fuertes.
- **B-roll en los momentos importantes:** cada dato del barrio se ilustra (drone, tren, plaza, gastronomía, dólares cuando dice "el dato"). Foto-tarjeta con marco blanco para lugares que no se filmaron.
- **Música:** **funk / groove para redes** o **corporate** (Motion Array). Ver `references/biblioteca.md`. Niveles: los de la base (las piezas viejas están entre −20 y −24 LUFS; no copiar eso).

## 5. Portadas
**Normalmente la portada la entrega el editor**: usar la que pasa y solo insertarla como primer frame (base). Esta guía es para cuando haya que hacerla o retocarla.
Analizadas diez (`assets/portadas.jpg`, en `01 REELS/<mes>/<pieza>/PORTADA/`) + `assets/portada-ejemplo.jpg` (06-07 José Mármol, aprobada).
- Fondo: frame de la propiedad o del barrio con **degradé índigo arriba** (`#2C3381` en el borde, se disuelve hacia el centro). Cielo limpio en exteriores.
- **Caja índigo** semitransparente (~80 %) con esquinas redondeadas detrás del lockup, pegada al borde izquierdo o derecho, encima de la cabeza de Luciano.
- Lockup: **Begum Bold** MAYÚSCULA muy apretada para dirección/barrio (blanca o en degradé rosa→rojo) + **Montserrat Black** con degradé rosa→rojo para la palabra fuerte ("ALMIRANTE BROWN", "COMERCIAL", "ADROGUÉ"). Mezcla de pesos con Montserrat Light ("Casa a **ESTRENAR**").
- Precio en caja **roja** redondeada con Montserrat Black blanca o plateada: `USD 235.000`.
- Luciano de cuerpo entero o medio cuerpo debajo del lockup, sonriendo a cámara; en tours sin él, la fachada.

## 6. Referencias aprobadas (REFERENCIA, no fórmula)
Detalle por pieza en `references/piezas.md`. Rutas relativas a `{CARPETA_CLIENTE}/01 REELS/`.
- **A. Barrio "Vivir en Adrogué"** — `06 JUNIO/05-06 LUL Vivir en Adrogué lo que tenés` (49 s, 30 fps).
- **B. Tour house casa con jacuzzi, Adrogué** — `10 OCTUBRE/02-10 LUL PAUTA Título pendiente` (56 s, 30 fps).
- **C. Tour house Canning Chico** — `10 OCTUBRE/01-10 LUL PAUTA Título pendiente` (55 s, 25 fps).
- **D. Tour depto a estrenar USD 65.000** — `09 SEPTIEMBRE/01-09 LUL PAUTA Título pendiente` (37 s, 30 fps).
- **E. Tour casa Barrio San Felipe, Canning** — `09 SEPTIEMBRE/02-08 LUL PAUTA EL DESLINDE SN, Canning,` (44 s, 25 fps).
- **F. Barrio "José Mármol, el vecino tranquilo"** — `09 SEPTIEMBRE/06-07 LUL José Mármol el vecino tranquil` (36 s, 25 fps).

## 7. Ideas que pueden sumar (opcionales, a criterio)
- Mapa simple del conurbano sur con pin rojo cuando compara localidades (Adrogué vs. Mármol vs. Lomas).
- Contador animado en el precio o en los metros.

## 8. Correcciones del cliente
(Vacío por ahora. Sumar con fecha y pieza de origen.)
