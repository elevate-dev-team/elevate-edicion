---
name: paola-jimenez-brand
description: Identidad visual para video de Paola Jiménez (PAO), realtor en Central & South Florida (Kissimmee, Saint Cloud, Lake Hamilton, Orlando). Tipografía Poppins (SemiBold en subtítulos, ExtraBold/Black en títulos, Bold Italic en bajadas; Big Caslon solo en portadas), subtítulos SubMachine blancos de 1–2 palabras con la palabra activa en magenta #FF21BA, títulos en lockup de dos líneas apretadas (bajada itálica blanca + golpe magenta con contorno blanco, o golpe blanco en mayúsculas + bajada magenta), glitch RGB como transición firma, CTA "GUARDA este video", más la referencia de tres piezas aprobadas (reel conversado con clienta, reel educativo a cámara con stock de Kissimmee y reel de Closing day con montaje musical) y un script de títulos/subtítulos en PIL. Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Paola Jiménez / PAO (reels, closings, pauta de propiedades, YouTube, portadas), o cuando el usuario diga "editá el video de Paola", "video de PAO", "con la marca de Paola Jiménez", aunque no mencione la skill.
---

# Paola Jiménez (PAO) — Marca para video

Las reglas obligatorias (márgenes, cara, voz, niveles, hook, cortes, stock mudo, revisión) están en la skill **`edicion-reels-base`**, que se aplica siempre. Esta skill solo agrega lo propio de la clienta.

- Clienta: **Paola Jiménez**, *Realtor*, "Agente inmobiliario · Central & South Florida". Zonas que nombra: Kissimmee, Saint Cloud, Lake Hamilton y Orlando. Sigla de archivos: **PAO**.
- Tono: cercano, educativo y positivo. Tutea en español latino neutro ("tú piensas", "compártelo", "guarda este video"). Rompe mitos ("¿verdadero o falso?") y celebra los cierres de sus clientes. Mezcla términos en inglés del rubro (*Closing day*, *Down Payment*, *listing*, ITIN), que en pantalla van tal cual.
- **Montos siempre en dólares**, porque vende en EE. UU.
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/<NN. Mes>/<DD-MM PAO Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/` (plantilla vacía en `01 REELS/000`). El final va en la raíz de la carpeta del video con el mismo nombre + `.mp4`.
- **No se usa logo en los videos** (decisión del usuario, 2026-10-02): nada de watermark, placa de marca ni end card. El wordmark "PAOLA Jimenez REALTOR" y el monograma PJ viven solo en las portadas de Facebook y WhatsApp.

## 1. Paleta

| Color | HEX | Uso en video |
|---|---|---|
| **Magenta fucsia** | `#FF21BA` | **Protagonista**: palabra activa del subtítulo y golpe de los títulos. En los finales se mide ≈`#F820B4` |
| Blanco | `#FFFFFF` | Subtítulos, bajadas, golpes invertidos y contorno de los títulos magenta |
| Rosa claro | `#F8C0E6` | Acento secundario: palabras golpe en **portadas**. En video se usa solo de forma puntual (ej. un número o una fecha en una placa sobre fondo oscuro), nunca en subtítulos |
| Magenta ciruela | `#982072` | Color del logo. En video, como mucho, para teñir un fondo de placa o el oscurecido de un B-roll. No se usa en texto sobre video porque se pierde |
| Gris claro / carbón | `#D5D5D5` / `#393939` | Neutros de la paleta, no se usan en video |

Paleta original: `assets/PAO_Paleta.png`. El usuario dejó el uso de colores a criterio, así que la regla es simple: **magenta + blanco siempre**. El rosa y el ciruela son recursos de apoyo, no protagonistas.

## 2. Tipografía

Archivos en `assets/fonts/` (también instaladas: Poppins en `~/Library/Fonts`, Big Caslon en el sistema).

| Uso | Fuente |
|---|---|
| Subtítulos | **Poppins SemiBold** |
| Golpe de título | **Poppins ExtraBold** (minúscula) o **Black** (MAYÚSCULA) |
| Bajada / línea de contexto | **Poppins Bold Italic** (blanca) o **ExtraBold** (magenta) |
| Rótulo de ubicación | Poppins Regular |
| Palabra resaltada en **portadas** | **Big Caslon** (`big-caslon/BigCaslon.ttf`, un solo peso). Ej: "sin **ser residente**" en magenta. **No va en video** |

Tracking levemente negativo en los títulos, y el **interlineado de los lockups muy apretado**: las líneas casi se tocan o se montan unos px.

## 3. Subtítulos (SubMachine, captura en `assets/PAO-Subt Submachine.png`)

- Poppins **SemiBold 62**, *word progression* **2**: 1–2 palabras por pantalla.
- Texto blanco, **palabra activa en magenta `#FF21BA`**. Este es el karaoke de la marca y no se omite.
- **Sin contorno**, sombra paralela negra al **89 %**, sin caja.
- Sentence case: arrancan en minúscula si la frase sigue. Los signos de pregunta se conservan ("¿Las condiciones / son distintas?").
- Posición: a media altura, sobre el pecho (debajo de la cara, según `edicion-reels-base`). Sobre stock, centrados.
- **Mientras hay un título en pantalla, el subtítulo de esas palabras se oculta** (el título las reemplaza). En las referencias el SRT no tiene esas palabras.
- Fuera de Premiere: `scripts/pao_text.py` → `subtitle(words, active=i, y=...)` reproduce el estilo.

## 4. Títulos — el sistema PAO

Ver `assets/PAO_Titulos_referencia.png` (recortes reales) y `scripts/pao_text.py` (`lockup(...)`, probado).

1. **Bajada + golpe (el default):** una línea chica en Poppins Bold *Italic* blanca y, pegado debajo, el **golpe grande en Poppins ExtraBold magenta, en minúscula, con contorno blanco fino (~6 px) y sombra suave**.
   - Ej.: "antes de enviar / **la oferta**", "el seguro de / **inundación**", "¡Hoy celebramos! / **Closing day**", "No es / **opcional**", "¿verdadero / **o falso?**".
2. **Invertido:** el **golpe blanco en MAYÚSCULAS** (Poppins Black) + la bajada en magenta ExtraBold con contorno blanco.
   - Ej.: "**LA LEY** / no lo exige", "Zona especial de / **RIESGO DE INUNDACIÓN**".
   - Se usa para afirmaciones fuertes o advertencias.
3. **Palabra única gigante** en magenta: siglas, nombres o lugares ("**ITIN**", "**Kissimmee**", "**Saint Cloud**" sobre el dron de la zona).
4. **Rótulo de ubicación**: Poppins Regular blanca chica, en el tercio inferior ("Kissimmee, Florida"), sobre stock de noticias o de lugar.
5. **CTA de cierre:** "**GUARDA** / *este video*" (golpe magenta gigante + bajada itálica blanca). Va mientras ella camina hacia cámara o habla parada, y después vuelven los subtítulos con "compártelo con…".

**Posición:** tercio superior o arriba de la cabeza, sin tapar la cara. El golpe ocupa buena parte del ancho seguro (≈650–850 px).
**Frecuencia:** 4–6 títulos en un reel de 40 s, en el gancho, en el dato o mito clave y en el CTA.
**Animación:** entrada corta (pop/escala), la bajada primero y el golpe después.

## 5. Edición — cómo se ven sus videos (REFERENCIA, no fórmula)

- **Ritmo:** un corte cada ~2.5 s. Se alternan tamaños de plano (entero ↔ medio ↔ primer plano, por punch-in o por otra cámara) para que el talking head no se estanque. En conversación con clientes, se alterna plano a dos con single de quien habla.
- **Transición firma: glitch digital RGB** (VR Digital Glitch) para entrar a un B-roll, a un bloque nuevo o al CTA, siempre con su SFX de glitch. Base: corte directo. Hay un **flash blanco** corto antes del CTA.
- **Look:** cálido, luminoso y soleado (Florida). Leve contraste y saturación arriba. Sus locaciones son claras (living beige, jardín, frente de casa nueva), así que hay que cuidar que el blanco no se queme.
- **B-roll:** el material propio manda (clientes, firma, llaves, casa). Si falta, va **stock de la zona que nombra** (drones de Kissimmee y Saint Cloud, lagos, barrios nuevos de Florida) y stock temático (dólares, seguro, inundación). Todo tiene que **parecer Florida / EE. UU.**: casas de una planta con garage, lagos, palmeras, dólares. Nada que se lea latinoamericano o europeo.
- **Closing day:** es un formato propio de celebración. Se arranca con el anuncio a cámara frente a la casa, con el título "¡Hoy celebramos! / **Closing day**" fijo y subtítulos. Después viene el **montaje al ritmo de la música, sin voz**: llegada, firma, llaves, puerta, primer paso adentro, champagne, brindis. Los cortes van al beat y el glitch entre bloques. Termina con el brindis, sin CTA hablado.
- **Música:** de fondo continua.
  - Educativos: temas suaves o elegantes (lounge, emotivo).
  - Closings: una canción conocida y alegre. Si tiene copyright, **solo en orgánico, nunca en pauta**.
  - Los finales de referencia están en −9.6 / −10.3 / −10.4 LUFS. Para la entrega vale el estándar de `edicion-reels-base`.

## 6. Pauta mostrando propiedad — PENDIENTE

Todavía no hay referencia aprobada. Hasta tenerla, se aplica el mismo sistema de títulos (precio y datos como golpe magenta, con la bajada de contexto: "desde / **$350K**", "**3** habitaciones") y el glitch entre ambientes. Cuando se apruebe la primera, documentarla acá y en `references/piezas.md`.

## 7. Referencias aprobadas (mirar antes de editar)

| Pieza | Ruta (en `…/106 Paola Jiménez/01 REELS/09. Septiembre/`) |
|---|---|
| A. Reel conversado con clienta, mito "sin residencia" (42 s) | `07-09 PAO Comprar tu casa/07-09 PAO Comprar tu casa.mp4` |
| B. Reel educativo a cámara + stock de la zona (45 s) | `13-09 PAO Antes de comprar en Kissimmee/13-09 PAO Antes de comprar en Kissimmee.mp4` |
| C. Closing day: anuncio + montaje musical (31 s) | `18-09 PAO Hoy celebramos Closing day/18-09 PAO Hoy celebramos Closing day.mp4` |

Detalle de cada pieza (bloques, títulos, música, tiempos): `references/piezas.md`. Recursos del disco: `references/biblioteca.md`.

## 8. Portadas

Para la mecánica se usa la skill `portadas-reels`. Lo propio de PAO:
- Las portadas son el **primer frame** del video con el título encima, y se **insertan como frame 0 del video final** (`portadas-reels/scripts/portada_primer_frame.sh`).
- Lockup Poppins: bajada blanca + golpe en **rosa claro `#F8C0E6`** (en portadas el golpe va en rosa, no en magenta), a veces con una palabra en **Big Caslon magenta** y una tercera línea chica de contexto.
- Ejemplos aprobados: "Antes de comprar / **en Kissimmee** / revisa las zonas de *inundación*", "¡Hoy celebramos! / **Closing day**", "Comprar tu casa / sin *ser residente* / **ES POSIBLE**".
- **Título pegado debajo del mentón**, sobre el pecho (no abajo del cuadrado), con el interlineado muy apretado: la tercera línea sube a la altura de la cola de la "y" del golpe y se parte alrededor de la cola.
- Paola suele vestir de negro: **levantar sombras y darle más exposición que al fondo**, y que los degradés no le pasen por encima (corrección 2026-10-05: "queda muy oscura").
- Ejemplo aprobado con todo esto: `10. Octubre/10-09 PAO HOA y CDD no son lo mismo/PORTADA/` — "Antes de comprar *casa nueva* / **HOA y CDD** / no son **lo mismo**" (Poppins Light Italic + Bold Italic blancas, golpe Poppins ExtraBold rosa). Script: `PROYECTO/_trabajo/portada.py` (= `portadas-reels/scripts/portada_pil.py`).
- Archivos en `PORTADA/` del video (`Frame_00.jpg` es el cuadro base).
