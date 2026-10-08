---
name: federico-hernandez-brand
description: Identidad visual para video de Federico Hernández (FHE), corredor público inmobiliario en Mendoza, Argentina. Tipografía TT Firs Neue con mezcla de pesos (Light/Regular + ExtraBold/Black, itálica y Bold Outline como acentos), subtítulos blancos a media altura, paleta sobria azul pizarra / beige, más la referencia de dos piezas aprobadas (pauta mostrando propiedad y reel común a cámara con B-roll). Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Federico Hernández / FHE (reels, pauta de propiedades, YouTube, portadas), o cuando el usuario diga "editá el video de Federico", "video de FHE", "con la marca de Federico Hernández", aunque no mencione la skill.
---

# Federico Hernández (FHE) — Marca para video

Reglas obligatorias (márgenes, cara, voz, niveles, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Esta skill solo agrega lo propio del cliente.

- Cliente: **Federico Hernández**, "Corredor Público Inmobiliario", Mendoza (Maipú, Godoy Cruz…). Siglas de archivos: **FHE**.
- Tono: sobrio, profesional, didáctico, confiable. Habla en rioplatense ("mirá", "escribime", "terminás vos"). Nada estridente ni "comic": la energía sale del ritmo y de la tipografía, no de colores chillones ni emojis.
- Carpeta del cliente: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM FHE Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/`. El final va en la raíz del proyecto con el nombre de la carpeta + `.mp4`, y la portada `.jpg` al lado.
- **No se usa el logo en los videos** (decisión del usuario). Tampoco placas de marca ni end card.
- **Sin carteles de otras inmobiliarias a la vista** (pedido de Federico, 2026-10-07, 04-10 DEPTO GUAYMALLEN): si un plano muestra carteles de "VENDE" de colegas (frecuente en tomas de dron de complejos), se elige el tramo del clip donde ya salieron de cuadro, se reencuadra o se cambia el plano. Revisarlo con capturas en todo el tramo usado, sobre todo en el cierre.

## 1. Lo que sí se usa de la marca

### Tipografía — TT Firs Neue (el elemento de marca principal)
Archivos en `assets/fonts/` (versión **Trial**; los nombres internos son `TT Firs Neue Trl` y los Outline `TT Firs Neue`):

| Uso | Archivo | PostScript |
|---|---|---|
| Palabras "de relleno" del subtítulo, líneas secundarias | Regular / Light (a veces Medium) | `TTFirsNeueTrl-Regular`, `-Light`, `-Medium` |
| Palabra destacada, titulares | ExtraBold / Black | `TTFirsNeueTrl-ExtraBold`, `-Black` |
| Acento de énfasis (adjetivo, idea) | ExtraBold Italic / Black Italic | `TTFirsNeueTrl-ExtraBoldIt`, `-BlackIt` |
| Precios, cifras, CTA ("ESCRIBIME"), palabras-concepto | **Bold Outline** | `TTFirsNeue-BoldOutline` |

La firma visual es el **contraste de pesos dentro de la misma frase**: fino + negrita, minúscula + MAYÚSCULA, sólido + outline. Mejor eso que agregar colores o cajas.
Si hace falta un glifo raro que la Trial no tenga, avisar; la licencia comercial está pendiente de confirmar con el cliente.

### Color
Paleta oficial (de `00 IMAGEN DE MARCA/FHE-PALETA.png`):

| Nombre | HEX |
|---|---|
| Azul pizarra (principal) | `#323D4F` |
| Casi negro azulado | `#192027` |
| Beige / arena | `#EADBD0` |
| Gris perla | `#D0D3D5` |
| Blanco | `#FFFFFF` |

En video manda el **blanco**: subtítulos y títulos van blancos con sombra suave. El **beige `#EADBD0`** es el acento de marca que ya se usa en las portadas ("OJO CON ESO"); vale para una palabra-golpe o un precio, con moderación. Azul y casi negro sirven (opcional) para teñir el oscurecido del B-roll o para fondos de placas si alguna vez hacen falta, en vez de negro neutro. El degradé azul→gris perla (`#323D4F → #D0D3D5`, horizontal) es el recurso gráfico de los íconos y portadas; usarlo solo si suma.

## 2. Referencias aprobadas (NO son fórmula)
> Así se resolvieron dos videos de septiembre 2026. Sirven para entender el gusto del cliente; cada video nuevo decide su propia estructura, ritmo y tratamiento según su contenido.

### A. Pauta mostrando propiedad — `09 Septiembre/01-09 FHE PAUTA Casa en Barrio Privado V/` (44 s, 25 fps)
- **Guion tipo**: gancho con precio + ubicación en los primeros 5 s ("Mirá esta casa por 175 mil dólares en el barrio privado…"), datos (terreno, cubiertos, seguridad), recorrido ambiente por ambiente en voz en off, argumento de venta (precio accesible, terminarla a tu gusto, toma vehículo), CTA "Escribime por WhatsApp y coordinamos una visita".
- **Imagen**: abre con él caminando hacia cámara frente a la casa (0–10 s, 2 cortes) → dron del barrio (10–15 s) → transición de **zoom con desenfoque radial** hacia adentro → **recorrido en planos largos con gimbal** (planta baja, planta alta), casi sin cortes: el ritmo lo da el movimiento de cámara → exterior, jardín, órbita de dron → cierra él en la puerta diciendo el CTA.
- **Textos**: subtítulos palabra a palabra; ubicación como título de 2 líneas ("Viñas del" Medium + "TORREÓN" Black, mayúsculas) arriba del subtítulo; el precio "USD 175.000" en Bold Outline.
- Sin placa de datos, sin logo, sin end card.

### B. Reel común a cámara — `09 Septiembre/19-09 FHE Tasaron tu propiedad por Whats/` (40 s, 30 fps)
- Él en su oficina (TV con mapa de Mendoza, mesa redonda), sentado para el gancho y de pie después. **Cortes de salto + punch-ins** de zoom cada 2–4 s.
- **Golpe del gancho**: el plano pasa a **blanco y negro** con un título apilado de pesos mezclados: "ESO / **NO ES** / UNA **TASACIÓN**".
- **B-roll de stock** en bloques que ilustran literalmente lo que dice (relevamos, inspeccionamos documentación, analizamos comparables, dinero, firma/certificación). Siempre **oscurecido y algo desaturado**; sobre B-roll los subtítulos pasan a MAYÚSCULAS, un poco más grandes.
- Transiciones: light leak cálido, flash claro, barridos con desenfoque; textos que entran con blur.
- Cierra con "ESCRIBIME." en Bold Outline sobre él.

### Subtítulos en ambos
- Blancos, sombra suave, **sin caja ni color**. 1–3 palabras por bloque, centrados, a **media altura (y ≈ 960–1070)**: sobre el speaker quedan a la altura del pecho/torso, sobre B-roll en el centro.
- ~65–70 px de cuerpo; palabra clave en ExtraBold/Black, resto en Regular/Light; énfasis ocasional en itálica u outline. Es énfasis por palabra clave (sustantivos, cifras, verbos fuertes), no un karaoke mecánico.
- Mayúsculas sobre B-roll / minúscula tipo oración sobre el speaker.

### Audio de las referencias
Cama musical continua bajo la voz y SFX discretos (whooshes/pings en transiciones). Los masters de referencia salieron bajos (−22 y −18 LUFS): para los niveles valen los de `edicion-reels-base`, no los de la referencia.

### Portadas
Sistema (medido en sus portadas de lotes, 2026-10-07): **2–3 líneas centradas en x = 540**, posicionadas por línea de base y muy apretadas:
- Línea chica arriba en **beige `#EADBD0`**, mezcla Regular + Black ("Lote **CACIQUE**", "Lote **CARRIL**"), ~75–90 px.
- **Golpe** en **TT Firs Neue Black Italic MAYÚSCULA blanco**, el más grande (~190–210 px, ancho ≤ 800 px).
- Opcional una línea de dato abajo (precio) en Regular + ExtraBold blanco (~70 px).
- Sombra suave `#192027`, sin cajas ni contornos. Con Federico en cuadro, el bloque va sobre el pecho, pegado debajo del mentón.
- Sin Federico (pieza de dron/barrio): cuadro base = primer frame del video, la franja del barrio con más luz y el cielo/bordes bajados, degradés `#192027` arriba y abajo, el texto sobre el cielo/horizonte dentro del cuadrado.

Ejemplos:
- `01 REELS/09 Septiembre/01-10 FHE PAUTA LOTE CARRIL GODOY CRUZ/PORTADA/…jpg`: "LOTE CARRIL" / ***GODOY CRUZ*** sobre el pecho de Federico.
- `01 REELS/09 Septiembre/02-10 FHE PAUTA LOTE CACIQUE SAYANCA/PORTADA/…jpg`: "Lote **CACIQUE**" beige / ***SAYANCA*** blanco.
- `01 REELS/10 Octubre/03-10 FHE LOTES VISTALBA/PORTADA/03-10 FHE LOTES VISTALBA.jpg` (sin speaker, dron): "Lotes en **BARRIO PRIVADO**" / ***VISTALBA*** / "desde **USD 50.000**". Script: `PROYECTO/portada.py`.

Formato, márgenes (cuadrado 1080×1080 con 100 px), interlineado y portada como primer frame del video: skill `portadas-reels`.

**Guía de portadas (medida sobre las publicadas, 2026-10-07):**
- Sistema: él de cuerpo entero (o casi) en el lugar, texto **centrado en x = 540, debajo del mentón, cruzando el pecho**. Dos líneas apretadas: **bajada chica en beige `#EADBD0`** mezclando Regular + ExtraBold/Black ("Lote **CACIQUE**", "Depto **USD 65.000**") y **golpe en Black Italic MAYÚSCULA blanco** ocupando casi todo el ancho útil (~850 px). Sombra suave, sin cajas.
- Ejemplos: `09 Septiembre/01-10 FHE PAUTA LOTE CARRIL GODOY CRUZ/PORTADA/…jpg` ("LOTE CARRIL / *GODOY CRUZ*"), `09 Septiembre/02-10 FHE PAUTA LOTE CACIQUE SAYANCA/PORTADA/…jpg` ("Lote CACIQUE / *SAYANCA*"), `10 Octubre/04-10 FHE DEPTO GUAYMALLEN/PORTADA/…jpg` ("Depto USD 65.000 / *GUAYMALLÉN*", hecha con `portada_pil.py`, script en `PROYECTO/work/portada/portada.py`).
- Con acentos en el golpe (É, Á) la bajada se apoya sobre el tope real del acento (6 px), no sobre las mayúsculas, o se pisan.

## 3. Ideas que pueden sumar (opcionales, a criterio)
- Teñir el oscurecido del B-roll con `#192027` / `#323D4F` en vez de negro puro: queda más "de marca" sin que se note.
- Usar el beige en la palabra-golpe del gancho o en el precio de la pauta.
- En pautas, una línea de datos breve (m² terreno · m² cubiertos · dormitorios) con Light + Black si la voz los dice rápido.
- Diagonales a 45° (geometría del isotipo y de las portadas) como máscara de transición o barrido.

Recursos del disco sugeridos para este estilo: `references/biblioteca.md`.
