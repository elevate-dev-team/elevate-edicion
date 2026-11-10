---
name: beatriz-gascon-brand
description: Identidad visual para video de Beatriz Gascón (BGR), Realtor en Tampa, Florida (Home Prime Realty; USD, español neutro). Inter para los subtítulos (SemiBold blanco, 1–3 palabras, minúscula) con la palabra clave en Fraunces Soft SemiBold Italic crema, títulos-golpe en Fraunces Black crema con bajada chica en Inter celeste y un trazo dorado a mano alzada que se dibuja debajo de la palabra clave (el sello propio), placas navy con grano, precios en Fraunces Bold dorado con "USD" en Inter celeste, CTA en pastilla crema con texto navy, paleta navy / celeste / crema / dorado / blanco. Referencia de edición: el reel 15-11 "El depósito de tu inquilino". Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Beatriz Gascón / Beatriz / BGR (reels, pauta, portadas), o cuando el usuario diga "editá el video de Beatriz", "video de Beatriz Gascón", "video de BGR", "con la marca de Beatriz", aunque no mencione la skill.
---

# Beatriz Gascón (BGR) — Marca para video

Reglas obligatorias (márgenes, cara, audio, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 5. Acá va solo lo propio de la clienta.

> **Referencia de edición: 15-11 "El depósito de tu inquilino" (sección 6A).**
>
> **Estado: propuesta (2026-11-10).** No hay videos editados de Beatriz. El sistema se armó a partir de su paleta y sus fuentes, con la línea de los clientes de Elevate y una diferenciación sutil. El primer video lo edita el equipo (caso C de `crear-skill-cliente`). Las correcciones van a la sección 8, y la pieza aprobada pasa a la sección 6.

- Clienta: **Beatriz Gascón**, Realtor en **Tampa, Florida**, de **Home Prime Realty** (el mismo broker que David Carballo, así que **no** se usan su navy + dorado en degradé ni Open Sans). Siglas de archivos: **BGR**. Trabaja venta, compra, renta e inversión (también mobile homes en renta), y le habla a compradores, inquilinos y propietarios que rentan.
- Lugar: **Tampa y alrededores** (Tampa Bay). **El stock tiene que parecer de la zona**: casas de una planta con lanai y pileta, barrios residenciales con palmeras y robles, canales, el skyline de Tampa y el Riverwalk, el puente Sunshine Skyway o la bahía, gente latina. Nada de Miami (Brickell, South Beach) salvo que el tema lo pida. Nada de stock argentino ni europeo. Moneda: **USD**.
- Tono: **español neutro**, sin voseo ni regionalismos (ni "vos", ni modismos argentinos, cubanos o mexicanos). En subtítulos y textos, **tú** neutro: "Comenta", "Escríbeme", "Agenda tu llamada". Respetar lo que dice ella en los subtítulos.
- Carpeta: `{CARPETA_CLIENTE}/` (`BEATRIZ GASCON REALTOR`) → `00 IMAGEN DE MARCA/` (paleta, ícono REALTOR, portadas de redes, fotos de perfil), `01 REELS/<MES>/<DD-MM BGR Título>/` (ej. `NOVIEMBRE/15-11 BGR El depósito de tu inquilino`), `02 CARROUSEL/`, `03 YOUTUBE/`, `04 LOOP/`.
- Logo: no tiene logo propio. En los reels **no va logo** (el 15-11 no lleva), ni el de Home Prime. El ícono REALTOR en blanco (`00 IMAGEN DE MARCA/ICONOS BEATRIZ MARGON/REALTOR BLANCO.png`) queda para piezas gráficas. Placa final: no, salvo pedido.

## 1. El manual vs. los videos
Solo hay paleta y dos familias (no hay manual). Pasan las dos completas. **Ojo:** la paleta es casi la misma que la de Isledys Hernandez (azul, celeste, dorado y hueso), así que la diferencia tiene que estar en la tipografía y los acentos:
- **Fraunces Soft** (serif redondeada y cálida) frente a la Bodoni filosa de Isledys.
- El **crema** es el color de resaltado. El **dorado** queda solo para cifras y el trazo.
- **No usar** glow dorado, barras doradas ni montos en degradé: son el sello de Isledys.

## 2. Tipografía — Inter + Fraunces
Archivos en `assets/fonts/Inter/` y `assets/fonts/Fraunces/` (las dos con licencia **OFL**, libres para piezas publicadas). Fraunces siempre en el corte **Soft 72pt** (el corte normal es más filoso y se parece a otras marcas). Interletrado **−2 %** del cuerpo (−3 % en los títulos grandes). Interlineado de títulos **0,85–0,88**: las líneas casi se tocan.

| Uso | Fuente y peso |
|---|---|
| Subtítulo base | Inter **SemiBold** |
| Palabra clave del subtítulo (emoción, giro, promesa) | Fraunces Soft **SemiBold Italic**, crema, cuerpo +15 % |
| Palabra clave dura (cifra, nombre, dato) | Inter **ExtraBold**, blanco |
| Bajada del título / datos chicos | Inter **SemiBold** o **Medium** |
| Título-golpe | Fraunces Soft **Black**. La 2.ª línea en **Black Italic** |
| Precio | Fraunces Soft **Bold**. "USD" en Inter SemiBold |
| CTA | Inter **ExtraBold**, mayúsculas |

## 3. Color
| Nombre | HEX | Uso en video |
|---|---|---|
| Navy | `#062A3A` | Placas a pantalla completa (con grano al 5 %), degradés para leer títulos, texto de la pastilla CTA |
| Celeste | `#85D3ED` | Bajadas de los títulos, "USD", filetes finos. Nunca en textos largos |
| Crema | `#F1DBA3` | Palabra clave del subtítulo, títulos-golpe, fondo de la pastilla CTA |
| Dorado | `#D5A23C` | Precios y cifras grandes, trazo bajo la palabra clave. Poco y puntual |
| Blanco | `#FFFFFF` | Subtítulo base, datos sobre navy |

## 4. Sistema de texto y acabado
Referencia visual: `assets/prueba-sistema.jpg`. Para regenerarla: `scripts/prueba_sistema.py salida.jpg fondo.jpg`.
- **Subtítulos:** **1–3 palabras**, minúscula tipo oración, Inter SemiBold **64 px** blanco con sombra suave (negro 60 %, desenfoque 10 px, 4 px hacia abajo). La palabra clave en Fraunces Italic crema **74 px**, como mucho una por bloque y no en todos. **Entrada:** el bloque sube 12 px con un fundido de 3 frames, sin pop ni rebote. La posición la manda la base.
- **Títulos-golpe:** bajada en Inter SemiBold **50 px** celeste arriba, golpe en Fraunces Black **~150 px** crema en 1–2 líneas. Si el fondo compite, degradé navy de abajo hacia arriba (hasta ~65 %). Animación: la bajada entra con fundido y el golpe sube por línea, con 3 frames de diferencia. Título *o* subtítulo, nunca los dos juntos.
- **Trazo dorado (sello):** una línea a mano alzada, apenas curva, de **11 px** con puntas redondas, debajo de la palabra clave del título. Se dibuja de izquierda a derecha en **8 frames** cuando la palabra termina de entrar. Uno por título como máximo, y no en todos los títulos.
- **Precio y datos:** placa navy con grano. Dato en Inter Medium **52 px** blanco, debajo "USD" en Inter SemiBold **60 px** celeste más la cifra en Fraunces Bold **140 px** dorada, y un filete celeste de 3 px y 200 px de ancho abajo.
- **CTA:** pastilla crema (radio entero, 46 px de aire a los costados) con texto en Inter ExtraBold **46 px** navy. Entra con escala 0,9 → 1 en 4 frames.
- **Transición de la casa:** barrido lateral con desenfoque de movimiento (6–8 frames) y un destello crema suave al 25 %, solo en los cambios de bloque. Corte seco en el resto.
- **Zooms y ritmo:** los de la base. Punch-ins suaves (1,00 → 1,08) en las frases fuertes.
- **Música y SFX:** funk o corporate instrumental, cálida y sin vocales. Whoosh suave en el barrido y un "pop" sutil en el CTA. Niveles: los de la base.
- **Stock / B-roll:** de Tampa (ver arriba). Luz cálida, que combine con el navy y el crema. Nada frío ni saturado.

## 5. Portadas
No hay portadas publicadas. Mientras tanto: golpe en Fraunces Black crema (1–3 líneas, interlineado 0,85) debajo del mentón, la palabra clave en Black Italic con el trazo dorado debajo, bajada en Inter SemiBold celeste, y el degradé navy de `portadas-reels`. Cuando haya 4–5 publicadas, reescribir esta sección según `portadas-reels` §0.

## 6. Referencias aprobadas (REFERENCIA, no fórmula)
### A. Reel educativo a cámara con B-roll — "El depósito de tu inquilino" (15-11)
Carpeta: `01 REELS/NOVIEMBRE/15-11 BGR El depósito de tu inquilino/` (mp4 final de 30,7 s + portada png). 1080×1920, 30 fps, master −11 LUFS.
- **Gancho:** "si rentas en Florida…", con Beatriz caminando en una casa en obra y la palabra clave *Florida* en Fraunces Italic crema.
- **Estructura:** problema (el inquilino se va dejando daños, sobre B-roll de una pared rajada) → plazos legales en títulos-golpe ("15 días / para devolverlo", "15 días / para oponerse", "pierdes / el derecho") → cierre "y reclamar el daño, aparte" → CTA en la puerta de una casa.
- **Texto:** subtítulos de 1–3 palabras en Inter SemiBold blanco, a media altura; los títulos-golpe en Fraunces Black crema arriba, con la bajada en Inter celeste ("sin descuentos, tienes", "si se te pasa el plazo") y la 2.ª línea en Black Italic. El **trazo dorado** aparece una sola vez, debajo de "el derecho". Los títulos van solos, sin subtítulo.
- **B-roll:** pared rajada, sello y documento ("por correo certificado / por escrito"), billetes. Va con un velo navy encima para que el texto se lea.
- **CTA:** pastilla crema "ESCRÍBEME" en el último plano.
- **Portada (primer frame):** Beatriz en la puerta de la casa. Texto "El depósito / de tu inquilino" en sans blanca, con "tu inquilino" en degradé dorado, arriba de la cabeza y con degradé navy arriba. **Ojo:** no sigue la §5 (que pide Fraunces crema + trazo) y usa el degradé dorado que la §1 reserva a Isledys. A confirmar cuál queda como norma.
- **Cuidado:** el subtítulo en Fraunces crema sobre la pared clara del pasillo ("depósito", ~8 s) casi no se lee. Sobre fondos claros, sumar sombra o usar blanco.

## 7. Ideas que pueden sumar (opcionales, a criterio)
- Listas numeradas con el número en Fraunces Black Italic dorado y el texto en Inter.
- Comillas grandes en Fraunces crema para frases de clientes o testimonios.
- El trazo dorado como subrayado de un dato en la placa navy, en vez del filete.

## 8. Correcciones del cliente
(Sin correcciones todavía.)
