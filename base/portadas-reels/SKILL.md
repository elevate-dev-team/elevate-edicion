---
name: portadas-reels
description: Portadas (covers / miniaturas) 9:16 para reels de cualquier cliente de Elevate — cuadrado central 1080×1080 como margen de seguridad del feed, texto pegado al sujeto (debajo del mentón) con ≥100 px de aire, sujeto aislado con rotoscopia (Vision) y MÁS exposición que el fondo, degradés arriba/abajo, interlineado muy apretado, portada insertada como PRIMER FRAME del video final, si la skill del cliente no tiene guía de portadas, analizar 4–5 portadas suyas en su carpeta y escribir la guía en esa skill, verificación midiendo la caja real del texto. Incluye scripts (recorte de personas, fondo limpio sin halo, portada en PIL, inserción como primer frame, medición de márgenes) y una plantilla de Remotion neutra de marca. Usar SIEMPRE que el usuario pida una portada, cover, miniatura o thumbnail de un reel/video, aunque no lo diga así ("hacé la portada", "armá el cover", "la miniatura del reel"), y también al cerrar CUALQUIER edición de reel con edicion-reels-base (todo reel se entrega con su portada como primer frame); la estética (tipografías, colores, sistema de títulos) sale de la skill de marca del cliente (ej. dairon-rubio-brand, yanira-team-brand) y las reglas generales de edicion-reels-base.
---

# Portadas de reels (todos los clientes)

Reglas de formato y de proceso. **La estética es de cada cliente**: tipografías, colores y sistema de títulos salen de su skill de marca (ej. en DAI: palabra-golpe en Black MAYÚSCULAS arena + Heavy minúscula blanca, sombra suave, sin cajas).

El usuario es exigente con el diseño: mostrar la portada y aceptar correcciones. La portada tiene que ser **bonita y llamativa como una buena miniatura** (sujeto que salta del fondo), sin efectos que se noten artificiales (halos, recortes duros). Todo se verifica midiendo, no a ojo.

**Toda edición de reel termina con su portada** (se hace con esta skill aunque el usuario no la pida aparte) **y la portada va como primer frame del video final** (§5).

## 0. Antes de diseñar: la guía de portadas del cliente
Pedido del usuario (2026-10-05): la portada tiene que parecerse a las que ya publica el cliente.
1. Buscar en la **skill de marca del cliente** su sección de portadas (sistema de título, colores, ejemplos aprobados con ruta).
2. **Si no existe o no tiene ejemplos concretos**, investigar antes de diseñar:
   - Listar las portadas finales del cliente: `find "{CARPETA_CLIENTE}/01 REELS" -path "*PORTADA/*" -iname "*.jpg" ! -iname "Frame*"` (las que llevan el nombre del video; `Frame_00.jpg` es solo el cuadro base). Si no hay, buscar en otras carpetas del cliente (pauta, YouTube) o preguntar.
   - Elegir **4 o 5**, las más recientes y de formatos distintos (a cámara, con clientes, propiedad, celebración), y armar una hoja de contacto para verlas juntas.
   - Analizarlas y anotar: dónde va el texto respecto del sujeto (debajo del mentón, sobre el pecho, arriba de la cabeza) y si respeta el cuadrado 1080×1080; estructura del lockup (cuántas líneas, qué línea es el golpe); tipografías y pesos (comparar con las fuentes de la marca); colores de cada línea; tamaños relativos; interlineado y tracking; mayúsculas o minúsculas; sombra, contorno o caja; tratamiento de la foto (encuadre, exposición del sujeto, degradés, fondo); si es el primer frame del video o una foto aparte.
3. **Escribir la guía en la skill de marca del cliente** (sección "Portadas"): el sistema en pocas líneas, los valores medidos, y las 4–5 portadas analizadas con su ruta y su título como ejemplo. Hacer copia de respaldo de la skill antes de editarla.
4. Diseñar con esa guía y con las reglas de formato de esta skill. Si la guía contradice algo de acá (ej. texto fuera del cuadrado), manda esta skill y se le avisa al usuario.

## 1. Formato y márgenes de seguridad
- **1080×1920 JPG** (9:16), en `PORTADA/` del proyecto, con el nombre de la carpeta: `PORTADA/<DD-MM CLIENTE Título>.jpg`.
- **Cuadrado central 1080×1080 (y 420–1500) = zona segura del feed — es la regla principal.** Es lo que se ve en el perfil de cualquier red. Todo lo importante va adentro: **caras del sujeto y todo el texto** (reiterado por el usuario, 2026-10-05, PAO 10-09).
- **Margen interior:** el texto queda a **≥100 px de cada borde del cuadrado** (zona útil x 100–980, y 520–1400). Adentro del cuadrado pero pegado al borde **no cumple**: fue la corrección del usuario.
- Fuera del cuadrado va solo foto o degradé, que se ve únicamente en pantalla completa.

## 2. Imagen
- Preferir las **fotos que manda el cliente** (mejor calidad y expresión); si no hay, un cuadro nítido del video en la resolución original, pasado a SDR si es HDR.
- Fotos de iPhone vienen 3:4 con rotación EXIF: aplicarla (`ffmpeg -i foto.jpg -q:v 2 salida.jpg` la aplica). Para 9:16 se usa toda la altura y se recortan los costados; elegir el desplazamiento horizontal (`posX`) para que las personas queden enteras y dentro del cuadrado.

## 3. Texto
- **Pegado al sujeto, cerca de la cara**: el bloque arranca **~20 px debajo del mentón** (caja de la cabeza medida con detección facial, con margen bajo el mentón), sobre el pecho. Si el texto queda abajo en el cuadrado, lejos de la cara, se ve desconectado (corrección del usuario, 2026-10-05, PAO 10-09: "los textos muy abajo, deben ir más cerca de su cara"). Si hay manos gesticulando, el bloque va entre el mentón y las manos.
- **Nunca sobre caras ni sobre manos o gestos clave** (la firma, la llave, el apretón de manos).
- **Interlineado MUY apretado** (corrección del usuario, 2026-10-05, PAO 10-09: el interlineado entre el golpe y la línea de abajo "es muy amplio… se ve bastante feo"): las líneas se ubican por **línea de base**, no por caja. La bajada de arriba apoya ~8 px sobre el tope de las mayúsculas del golpe; la línea de abajo arranca ~6 px bajo la **línea de base** del golpe, o sea **a la altura de la cola de la "y"/"g"/"p"**. Si una cola cae sobre una palabra de abajo, se parte esa línea alrededor de la cola (la cola cae en el espacio entre palabras: "no son **y** lo mismo"); nunca una cola encima de una letra.
- Legibilidad con sombra suave en el texto y los degradés de §4; sin cajas salvo que la marca las use.
- Textos que no dice el video → avisar para aprobación (regla de `edicion-reels-base` §6).

## 4. Sujeto aislado y con más luz que el fondo
Pedido del usuario (2026-10-05, PAO 10-09): "aislar al sujeto y darle un poco más de exposición para que quede separado del fondo… degradados desde abajo hacia arriba, desde arriba hacia abajo… que sea bonita y llamativa como una buena miniatura". Reemplaza a la regla vieja de "desenfoque MUY sutil", que dejaba la portada plana. Valores aprobados (`scripts/portada_pil.py`):
1. **Fondo** (todo lo que no es el sujeto): fondo limpio (`fondo_limpio.swift`), brillo **0,80**, saturación 0,92, desenfoque **~4 px**. Pegado al borde del sujeto va el original bajado igual (no el relleno), así no aparece el "fantasma" del sujeto.
2. **Luz cálida** muy suave detrás de la cabeza (alfa ≤0,22), solo sobre el fondo.
3. **Degradés** de color oscuro de marca (ej. ciruela casi negro): **arriba** (0 → ~560 px, alfa 0,6) y **abajo** (desde ~1150 px, alfa 0,8). **No pasan por encima del sujeto dentro del cuadrado**: con ropa oscura lo apagan (corrección 2026-10-05: "Paola queda muy oscura"); como mucho oscurecen las piernas fuera del cuadrado.
4. **Sujeto**: levantar sombras (curva gamma ~0,82, clave con ropa negra) + brillo **1,14**, contraste 1,08, saturación 1,06, un toque cálido. Tiene que leerse claramente más luminoso que el fondo.
5. **Borde**: la exposición del sujeto entra ~3 px hacia adentro de la máscara (si no, el borde de pared que quedó en la máscara brilla como un halo). Nada de drop-shadow alrededor del recorte.
6. Revisar la máscara de Vision: si deja afuera una mano o un brazo, completarlo (en `portada_pil.py`, píxeles de piel dentro de una elipse sobre la mano); si no, esa parte queda oscura con el fondo.

⚠️ **Lo que salió mal y NO se repite:** desenfoque de 14 px + oscurecer al 68 % todo el fondo = "muuuuy exagerado"; desenfoque de 3 px sin bajar el fondo ni subir al sujeto = plano, sin separación; degradé inferior sobre el sujeto = sujeto oscuro; halo claro alrededor de la cabeza por usar el fondo rellenado pegado al borde.

### Scripts
- **Recorte de personas** (Vision, macOS; calidad alta; PNG con alfa + máscara):
  `swift scripts/recorte_personas.swift <foto.jpg> <salida_personas.png> <mascara.png> [corte]`
  - `corte` (opcional) = fracción de la altura desde arriba por debajo de la cual se descarta la máscara, con borde suave. Sirve para **mesas de vidrio y reflejos**, que Vision toma parcialmente. Poner el corte justo debajo de las manos.
  - Revisar la máscara (`ffmpeg -i mascara.png -vf scale=540:-1 prev.png`) antes de seguir.
- **Fondo limpio** (sin las personas; rellena con los colores de alrededor para que al desenfocar no quede el "fantasma" o halo del sujeto):
  `swift scripts/fondo_limpio.swift <foto.jpg> <mascara.png> <salida_fondo.jpg>`
- **Medir márgenes:** renderizar la portada con `soloTexto: true` (solo el texto sobre negro) y correr
  `python3 scripts/medir_texto.py <portada_solo_texto.png> 100` → márgenes reales (letras + sombra) a cada borde del cuadrado, OK/NO.
- **Portada en PIL** (sin Remotion), con todo lo de §3–§4 resuelto: `scripts/portada_pil.py` (copiar al proyecto y ajustar rutas, recorte, texto y `TEXT_TOP`; modos `guias` y `solotexto`).

### Plantilla
⚠️ La plantilla de Remotion tiene los valores viejos (desenfoque sutil, sin subir al sujeto, bajada por caja): si se usa, ajustarla a §3–§4; si no, usar `scripts/portada_pil.py`.

`template/Portada.tsx`: `<Still>` de Remotion, neutra de marca (fuentes y colores por props `marca`). Se copia al proyecto de Remotion del video, que ya tiene las fuentes cargadas; las imágenes van en `public/portada/`. Props clave:
- `posX`: desplazamiento horizontal del recorte 9:16.
- `textTop` y `titleSize`: posición y tamaño del texto.
- `paredHasta`: % de la altura hasta donde llega la pared, que es la única zona que se desenfoca.
- `glow`: centro de la luz detrás del sujeto.
- `guides`: dibuja el cuadrado central (verde) y el margen interior de 100 px (amarillo).
- `soloTexto`: renderiza solo el texto, para medirlo.

## 5. Portada como primer frame del video
Pedido del usuario (2026-10-05, PAO 10-09): la portada **se pone en el primer frame del video final**, así queda como miniatura por defecto al subir el reel. Se reemplaza el frame 0 (no se agrega un frame): la duración, la cantidad de frames y el audio no cambian.
- `bash scripts/portada_primer_frame.sh <video.mov> <portada.jpg> <master.wav> <final.mp4> [fps]` — verifica que la cantidad de frames sea la misma que la del video de entrada (con `-loop 1` + `-shortest` se perdía el último frame).
- Por eso el cuadro base de la portada sale del arranque del video (`PORTADA/Frame_00.jpg`), para que el paso al frame 1 no salte de lugar; se puede usar con zoom.
- Revisar en el mp4 final: frame 0 = portada, frame 1 = video, mismo total de frames.

## 6. Revisión antes de entregar
1. Render con `guides: true`: caras dentro del cuadrado; texto dentro del margen amarillo, pegado al sujeto y sin tapar caras ni manos.
2. `medir_texto.py` → OK con ≥100 px en los cuatro lados.
3. Zoom a los bordes del recorte (pelo, hombros, manos): sin halo, sin restos del fondo, sin reflejos.
4. Comparar lado a lado con la foto original: el sujeto se tiene que ver **más luminoso y separado del fondo**, sin halos ni recorte duro.
5. Portada insertada como primer frame del video final (§5).
6. Entregar **una** portada final (si hubo opciones descartadas, sacarlas de `PORTADA/`) y decir qué se midió.
