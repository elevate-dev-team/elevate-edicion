---
name: tato-risiglione-brand
description: Identidad visual para video de Tato Risiglione / Risiglione Inmobiliaria (RIS), inmobiliaria en Rosario, Argentina. Tipografía Gotham (Medium para subtítulos, Black/Ultra en mayúsculas para énfasis), subtítulos blancos a media altura con palabras no dichas al 50% de opacidad, énfasis azul marino #001D3D con contorno blanco, paleta azul marino + dorado, transición glitch RGB, más la referencia de cuatro piezas aprobadas (dos pautas y dos reels comunes). Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Tato Risiglione / RIS / Risiglione Inmobiliaria (reels, pauta de propiedades, terrenos, YouTube, portadas), o cuando el usuario diga "editá el video de Tato", "video de RIS", "con la marca de Risiglione", aunque no mencione la skill.
---

# Marca — Tato Risiglione / Risiglione Inmobiliaria (RIS)

Inmobiliaria familiar en Rosario, Argentina. Voceros: **Tato Risiglione** (hombre mayor, tono sereno de experto, habla pausado) y una **mujer del equipo** (más enérgica, suele caminar hacia cámara en exteriores). Tono rioplatense, directo, cercano, sin gritar. CTA típico: **"Escribinos"**.

Esta skill se aplica **junto con `edicion-reels-base`** (márgenes, hook, cortes motivados, stock mudo, mezcla, etc.). Acá solo va lo específico de RIS.

## Paleta

| Color | HEX | Uso en video |
|---|---|---|
| Negro azulado | `#010813` | Fondos oscuros, variante de logo |
| **Azul marino oscuro** | `#001D3D` | **Protagonista: relleno de títulos de énfasis** |
| Azul marino medio | `#013567` | Secundario, variante de logo |
| Dorado | `#E1C157` | Está en la paleta pero **hoy NO se usa en los videos** — reservarlo para portadas/gráficas si se pide, no meterlo en subtítulos ni títulos sin OK |
| Blanco | `#FFFFFF` | Subtítulos, contornos de énfasis |

Paleta original: `assets/RIS_Paleta.png`.

## Tipografía — Gotham (única familia)

Archivos en `assets/fuentes/` (Thin → Ultra, más Narrow y Condensed).

- **Subtítulos:** Gotham **Medium**, sentence case.
- **Énfasis y títulos:** Gotham **Black** o **Ultra**, siempre MAYÚSCULAS.

## Sistema de subtítulos (parámetros exactos de SubMachine — captura en `assets/RIS-Subt Submachine.png`)

- Gotham Medium, tamaño **68**, tracking **-4**.
- Blanco `#FFFFFF`, **sin contorno**, sombra paralela negra al **65%**.
- **~4 palabras por pantalla** (word progression 4). **Las palabras aún no dichas se muestran al 50% de opacidad** — este "fantasma" de lo que viene es firma del estilo RIS; no omitirlo.
- Centrado horizontal. **A cámara: pegado debajo de la cara** (lo más cerca posible sin taparla, regla de `edicion-reels-base` — corrección del usuario 2026-10-02; ya no a ~62 % fijo). Sobre stock/B-roll: centrado (y ≈ 960). En animaciones: pegado debajo del gráfico, a altura fija.

### Énfasis (segunda línea, debajo del subtítulo)

La palabra o dato clave se repite/agranda en Gotham Black MAYÚSCULAS como línea aparte, en dos variantes según el fondo:

1. **Relleno azul marino `#001D3D` + contorno blanco grueso** — la variante por defecto (ej.: "VAS A PAGAR", "LA RESERVA", "ESCRITURACIÓN", "ABERTURAS", "ESCRIBINOS").
2. **Relleno blanco + sombra/contorno oscuro** — cuando el fondo es oscuro u ocupado (ej.: "ESTA CASA", "LOS PASOS 4", "USD70.000").

**Datos duros como título gigante:** precio y metraje se muestran enormes ("830M²" ocupa el tercio superior del cuadro) y se sostienen varios segundos a través de varios planos, en la variante azul + contorno blanco.

## Logo

`assets/logos/` — 8 PNG **ya con fondo transparente**, no hace falta extraer nada:

- **Horizontal** (2942×945) y **cuadrado** (1548×1654), cada uno en 4 variantes: (1) blanco, (2) azul oscurísimo `#010813`, (3) azul marino `#001D3D`, (4) bicolor (marino + azul medio).
- En los 4 videos de referencia **no hay watermark de logo**. No agregarlo por defecto; usarlo solo en portadas, placas o cierres si se pide.

## Edición — cómo se ven sus videos (REFERENCIA, no fórmula)

- **Transición firma: glitch RGB** (aberración cromática / RGB split) para entrar a un bloque nuevo o a B-roll. Base: corte directo. Whip/blur ocasional en pauta de propiedad.
- **Talking head con punch-ins** (zoom in/out entre frases) en reels comunes.
- **Pauta de propiedad:** hook a cámara frente a la casa → tour por ambientes con la voz encadenada del mismo vocero (planos de 1–2 s en el hook, 3–7 s recorriendo) → cierre a cámara en el jardín con CTA.
- **Pauta de terreno/barrio:** vocera caminando hacia cámara + **drone** del barrio + lifestyle (deporte, familia).
- **B-roll stock** solo en reels comunes: temático y sobrio (llaves, dólares, planos, instalaciones), mudo.
- **El stock tiene que parecer de Rosario / Argentina** (corrección del usuario, 2026-10-02): nada de footage que se note de EE. UU. u otro país (casas de madera con jardín americano, suburbios, nieve, calles o edificios típicos de otro lado). Usar tomas de Rosario o de ciudades que se le parezcan (edificios de departamentos rioplatenses, casas de ladrillo/revoque, veredas, bulevares). **Personas** con aspecto de público argentino/rosarino; descartar clips donde la gente o su vestimenta se lean claramente de otro país o cultura (ej. estética caribeña, asiática, afroamericana). **Dinero**: dólares o pesos sí, euros no. Ante la duda: planos de detalle (manos, llaves, papeles, billetes de dólar) o animación en vez de stock.
- **Música:** de fondo continua bajo la voz durante todo el video. Referencias medidas: **-9.3 LUFS** (pauta propiedad) y **-11.6 LUFS** (reel común); apuntar al estándar de la base (-11) salvo pedido.
- **CTA final:** siempre a cámara, "Escribinos…", con "ESCRIBINOS" en énfasis.

## Videos de referencia aprobados (mirar antes de editar)

| Pieza | Ruta |
|---|---|
| Pauta mostrando propiedad (41 s) | `{CARPETA_CLIENTE}/01 REELS/09 Septiembre/19-09 RIS PAUTA POSICIONAMIENTO/19-09 RIS PAUTA POSICIONAMIENTO.mp4` |
| Pauta terreno/barrio con drone (29 s) | `{CARPETA_CLIENTE}/01 REELS/09 Septiembre/17-09 RIS PAUTA Los Pasos Hook 1/17-09 RIS PAUTA Los Pasos Hook 1.mp4` |
| Reel común talking head + stock (31 s) | `{CARPETA_CLIENTE}/01 REELS/09 Septiembre/02-09 RIS El precio de la propiedad/02-09 RIS El precio de la propiedad.mp4` |
| Reel común Tato en escritorio + stock (28 s) | `{CARPETA_CLIENTE}/01 REELS/08 Agosto/08-08 RIS Lo primero que miro al entrar/08-08 RIS Lo primero que miro al entrar.mp4` |

Carpeta del cliente (más material e imagen de marca): `{CARPETA_CLIENTE}/`

## Interlineado de títulos (corrección del usuario, 2026-09-30)

En todos los títulos y composiciones de varias líneas de RIS, el **interlineado va MUY apretado: las líneas casi se tocan** (separación de ~5 px entre las cajas de glifos, como en las referencias). Nunca dejar aire entre la línea grande y su línea de contexto. Vale para títulos gigantes (dato + contexto), énfasis apilados y cualquier lockup de más de una línea.

## Sistema de títulos v2 — UN solo golpe por título (corrección del usuario, 2026-10-07, reel 03-09)

"Por muchos momentos ponés textos principales muy pesados juntos, queda horrible": apilar 2–3 líneas en Gotham Ultra gigante con contorno grueso (ej. "TIEMPO" / "FIJO" + contexto en mayúsculas espaciadas) está PROHIBIDO. Lo aprobado:
- **Un solo golpe** por lockup: Gotham **Ultra MAYÚSCULA**, relleno marino `#001D3D` + **contorno blanco fino (~9 % del cuerpo, mín. 7 px)**, 80–120 px (no más; ~170 se ve pesado).
- **Bajada liviana** arriba: Gotham **Bold 52 px, sentence case**, blanca con sombra suave (no mayúsculas espaciadas). Línea opcional abajo en Gotham **Book 44 px** ("para la escritura", "y demás organismos").
- **Números como badge**: círculo blanco con el número en Ultra marino + la palabra en Bold al lado ("② Segundo"), no un "2" gigante.
- Aire entre bajada y golpe: ~9 px entre cajas (que descendentes y tildes no toquen el contorno). Entradas: slide para la bajada, pop suave para el golpe (slam con escala 1,5 máx. solo para el remate).
- Listas/checklists en animación: filas en Gotham Bold sentence case, no en Ultra.
- Código: `10 Octubre/03-09 RIS Cuánto tarda la escritura/PROYECTO/remotion/src/Titles.tsx`.

## Sistema de títulos que funcionó (pauta Terreno Laprida 883, 2026-10)
> ⚠️ Lo de abajo es el sistema viejo de pauta: el lockup "dato + contexto" vale, pero con el peso y tamaños de la v2 de arriba.

- **Lockup dato + contexto**: el dato en grande (Gotham **Ultra**, relleno azul marino `#001D3D` + contorno blanco grueso) y una línea de contexto chica en Gotham **Medium** blanca, en mayúsculas y con letras espaciadas, pegada arriba o abajo (interlineado apretado, ver arriba). Ej.: "225 M² / DE TERRENO", "TODO POR / USD 165.000", "7 HABITACIONES / + TERRAZA".
- Sobre fondos cargados u oscuros (o imágenes de IA), variante **relleno blanco + contorno oscuro `#010813`**.
- Animación de entrada según el peso del dato: **pop** con rebote para datos, **slam** (entra grande y se asienta) para el precio, **slide** corto hacia arriba para la línea de contexto. Cada aparición con su SFX (pop).

## Recreaciones con IA en pautas de propiedad

El cliente pide mostrar "cómo podría quedar" (ej. un súper en el local de planta baja, mobiliario de living/comedor en planta alta). Circuito que funcionó:
1. Yo elijo la **base**: el cuadro más nítido del ambiente vacío (medir nitidez en varios cuadros del video, en 4K) y lo dejo en una carpeta `IA …/` del proyecto junto con un **prompt en inglés** que pide conservar la arquitectura exacta (aberturas, pisos, techos, molduras) y agregar el mobiliario, sin gente ni textos.
2. El usuario genera el video en **Kling** (5–7 s, vertical) y lo deja en esa carpeta.
3. Yo lo acelero con **curva rápido → lento** (la parte vacía muy rápida, el remate casi a velocidad real), ~2–2.6 s en pantalla, y lo paso a 30 fps re-encodeando todos los segmentos juntos (los clips de Kling vienen a 24 fps y descuadran una unión por concat de archivos).
4. Siempre con el cartel **"Recreación ilustrativa con IA"** (Gotham Book chico) debajo del título "ASÍ PODRÍA QUEDAR / EL LOCAL" (o el ambiente), **centrado sobre la imagen**.

## Audio del CTA de la vocera

Graba el CTA en la vereda con mucho ruido de calle; el denoise de ffmpeg no alcanza. Lo que funcionó: dejarle al usuario el audio crudo en `VOZ/` para que lo limpie él; vuelve limpio pero bajo (~-25 LUFS) y hay que subirle ~+8.5 dB y comprimirlo (2.5:1) antes de la cadena general de voz.

## Material de propiedad del cliente

Suelen mandar muchas fotos viejas (WhatsApp, ~960×1280) donde aparece gente, a veces solo al fondo de una puerta. Revisarlas a tamaño grande antes de usarlas y descartar las que tengan personas. Al ser de baja resolución, usarlas poco tiempo y siempre con zoom suave.

## Portadas

Guía armada el 2026-10-07 analizando 6 portadas publicadas (reel 03-09 "Cuánto tarda la escritura"). Formato, cuadrado 1080×1080, sujeto aislado y portada como primer frame: skill `portadas-reels`.

**Sistema (el mismo en todas):**
- Lockup de 2–3 líneas **centrado** (x = 540) sobre el **pecho del sujeto, debajo del mentón** (o sobre el cielo/drone cuando no hay persona). Nunca arriba de la cabeza salvo que no haya otra opción.
- **Bajada** en Gotham **Bold** blanca, sentence case, ~80–85 px (ej. "¿Cuánto tarda la", "Si reaparece el", "La mejor zona de"), tracking levemente negativo.
- **Golpe**: 1 palabra/dato en Gotham **Ultra MAYÚSCULAS**, lo más ancho que entre en el margen (~870 px), **contorno blanco grueso (~9 px) + relleno blanco translúcido (~25–30 %)** que deja ver la foto. Variante: relleno azul marino `#001D3D` + contorno blanco ("LLEVA MESES").
- Línea 3 opcional abajo, Bold blanca minúscula ("¿suben los precios?", "para comprar hoy", "con Gina").
- **Interlineado pegado**: las líneas casi se tocan (base de la bajada ~8 px sobre el tope de las mayúsculas del golpe).
- Sombra suave solo del contorno y de la bajada (si cae sobre el relleno translúcido lo agrisa). Sin cajas.
- Foto: degradé oscuro arriba (negro azulado `#010813`), sujeto con un poco más de luz que el fondo. Fotos de Gina en el sillón o a cámara; Tato en terraza/exterior.

**Analizadas (en `01 REELS/`):**
| Portada | Lockup |
|---|---|
| `10 Octubre/05-09 RIS Si reaparece el crédito/PORTADA/…jpg` | Si reaparece el / **CREDITO** / ¿suben los precios? |
| `09 Septiembre/02-09 RIS El precio de la propiedad/PORTADA/…jpg` | NO solo pagas la / **PROPIEDAD** |
| `09 Septiembre/02-13 RIS Checklist para tu próxima visi/PORTADA/…jpg` | **CHECKLIST** / para tu próxima visita (sobre drone de Rosario) |
| `08 Agosto/12-08 RIS La mejor zona de Rosario/PORTADA/…jpg` | La mejor zona de / **ROSARIO** / para comprar hoy |
| `08 Agosto/04-08 RIS De 9 a 17hs con Gina/PORTADA/…jpg` | **DE 9 A 17HS** / con Gina |
| `08 Agosto/11-08 RIS Tu propiedad lleva meses/PORTADA/…jpg` | ¿Tu propiedad / **LLEVA MESES** (marino) / publicada? |

**Hecha con esta guía:** `10 Octubre/03-09 RIS Cuánto tarda la escritura/PORTADA/…jpg` ("¿Cuánto tarda la / **ESCRITURA?**"), script `PROYECTO/portada/portada.py` (PIL, reutilizable: cambiar textos, `TEXT_TOP` y la base).
