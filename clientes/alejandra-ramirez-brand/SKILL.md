---
name: "alejandra-ramirez-brand"
description: "Marca y estilo de edición de Alejandra Ramírez (AR), Realtor en Tampa: paleta, fuentes, subtítulos, titulares, stock, reglas editoriales y cómo animar fotos de la propiedad con personas usando Kling. Usar al editar sus videos o al generar B-roll con IA para ella, junto con edicion-reels-base."
---

# Alejandra Ramírez (AR) — marca para video

Se aplica **junto con `edicion-reels-base`**. Las reglas de la base mandan (zonas seguras, subtítulos pegados a la cara, audio, stock sin audio, cierre). Esta skill suma lo propio de Alejandra. Si algo de acá contradice la base, gana la base, salvo que el usuario diga lo contrario para este cliente.

Fuentes: manual de marca en `{CARPETA_CLIENTE}/MARCA CLAUDE/` (paleta y PDF de fuentes) y los videos aprobados que se usaron de referencia (ver sección 11).

## 1. Quién es y a quién le habla
- **Alejandra Ramírez**, Realtor con LPT Realty. Sigla en carpetas y archivos: **AR** (ej. `26-09 AR PAUTA ...`).
- **Mercado: Tampa y alrededores** (Wesley Chapel, Lakeland, comunidades nuevas del área, ej. Two Rivers, Mirada). No Miami.
- **Público:** latinos de habla hispana que quieren comprar (muchos primeros compradores) o vender en el área de Tampa.
- Posicionamiento: asesora honesta, sin apuro, que educa. Nada de tono vendedor agresivo.

## 2. Idioma y textos en pantalla
- **Español neutro siempre.** Nunca voseo ni rioplatense ("tenés", "podés", "acá", "laburo", "re"). Tuteo neutro: "puedes", "tienes", "aquí".
- Términos del mercado de EE. UU. tal como los usa el público: HOA, CDD, sqft, closing, town house, "carros" (no "autos").
- Precios en **dólares con coma de miles**: `$304,400`, `$264,000` (decisión del usuario, 28-10-2026, 23-10 AR: "coma, como el 24-10"; reemplaza el punto de miles de las piezas viejas). En la portada, `USD 304,400`. Montos con centavos (ej. un HOA de `$175,70` en piezas viejas): confirmar el formato con el editor antes de usarlos.
- **Cero datos inventados.** Alejandra es muy estricta: no se muestran cifras, tasas, estadísticas ni proyecciones que no estén en el guion o en lo que ella dice. Si dice un monto sin cifra, se oculta (regla 6 de la base).
- Tasas o financiación promocional ("4.99% por 5 años") llevan disclaimer corto ("Sujeto a calificación", "Aplican condiciones") si el guion no lo trae.

## 3. Paleta
| Nombre | HEX | Uso en video |
|---|---|---|
| Onyx | `#121212` | Texto sobre fondos claros, sombras, cajas oscuras |
| Night Bordeaux | `#681920` | Fondos de caja/placa, acentos sobrios |
| Brown Red | `#AB3130` | **Acento principal**: cifras clave (HOA, sqft, "SIN CDD"), cajas de ubicación |
| Champagne Mist | `#EEDBBF` | Precios grandes y destacados cálidos, detalles sobre fondo oscuro |
| White | `#FFFFFF` | Subtítulos y texto general |

- Máximo **dos colores de marca a la vez** en pantalla además del blanco.
- Rojo (`#AB3130`) para el dato que tiene que saltar; champagne (`#EEDBBF`) para el precio protagonista.
- **No usar** colores fuera de paleta (el amarillo de las cajas de 05-08 Two Rivers era de una etapa anterior: no repetirlo salvo que el usuario lo pida).

## 4. Tipografías
Solo dos fuentes en los videos:
| Rol | Fuente |
|---|---|
| Subtítulos y texto general | **Open Sauce One** (font.download/font/open-sauce-one) |
| Resaltados / palabras clave / detalles decorativos | **Arapey** (serif, Google Fonts) o Open Sauce One en bold |

- No usar otras fuentes (tampoco script ni las de portada del manual) salvo que el usuario lo pida.
- Si alguna no está disponible en el editor, avisar antes de reemplazarla. No cambiarla en silencio.

## 5. Estilo de subtítulos (visto en los aprobados)
- Blanco, Open Sauce One, peso medio, sin caja de fondo, con sombra suave para leerse sobre interiores claros.
- **Una a tres palabras por bloque**, minúsculas como se habla; el bloque entra completo con un **fundido corto (~4 cuadros), sin movimiento ni escala** (corrección del usuario, 22-10-2026, 24-10 AR: "no utilices la animación de subtítulos que venías usando, cambiala por otra más simple").
- Palabra clave del bloque en **bold** o en Arapey (ej. "sin **vecinos**", "al **WhatsApp**").
- Posición: la de la base (pegado debajo de la cara del que habla; centrado sobre B-roll).

## 6. Titulares y datos en pantalla
- Los datos fuertes (precio, sqft, HOA, CDD, interés, ancho del lote) salen como **titular grande**, en bold, 1–2 líneas, con interlineado apretado.
- Precio protagonista en **champagne**, la cifra **entera** con un pop de entrada. **Nada de dígitos que ruedan o caen**: el usuario lo pidió quitar (22-10-2026, 24-10 AR) porque a mitad de la animación se leen números falsos ("$265,482").
- **Cada cifra de DINERO** (precio, pago, monto) lleva el SFX **CashMoney** (`{SFX}/CashMoney Sound Effect.mp3`) con el pico en la entrada de la cifra. Porcentajes y otros datos, pop normal.
- **"ESCRÍBEME" / CTA de contacto** lleva el SFX **wink**: usar `{SFX}/Eye Wink Sound Effect.mp3` (`wink.mp3` es un clic de 0,1 s que no se oye) y sin whoosh de transición encima.
- **Nivel de estos SFX** (corrección 22-10: "el CashMoney es casi imperceptible"): CashMoney y wink a **~6–8 dB bajo la voz** medido en LUFS sobre su duración (CashMoney con pico en −1 dBFS antes del master; su campanazo está 1,75 s dentro del archivo y es lo que se alinea con la cifra).
- Cifra de apoyo en **rojo `#AB3130`** con la unidad debajo más chica ("3381 / sq ft", "El HOA es de / $175,70").
- **Ubicación / comunidad:** caja roja `#AB3130` con pin blanco, nombre de la comunidad en mayúsculas bold y ciudad + "FL" debajo (ej. "MIRADA / San Antonio FL").
- Íconos lineales blancos simples junto al dato cuando ayudan (cama para dormitorios, plano para sqft, $ para precio).
- Cuando el titular dice lo mismo que la voz, se oculta el subtítulo (regla de la base).

## 7. Ritmo, look y acabado
- B-roll de la propiedad y la comunidad cambia cada **~2–4 s** sobre la voz de Alejandra; vuelve a ella a cámara en el hook, en datos personales y en el CTA.
- Transiciones: zoom/whip con desenfoque radial entre exterior e interior, usadas con medida (2–4 por video).
- Look natural y luminoso, interiores claros. Un plano en blanco y negro puede abrir un video personal/educativo (visto en 22-09), no es obligatorio.
- Formatos: pauta de propiedad 35–80 s; orgánico educativo ~30–40 s.
- **Música: FUNK con ritmo** para sus reels/pautas (corrección del usuario 22-10-2026, 24-10 AR: pidió corporativo emotivo, lo escuchó y lo cambió por "algo estilo FUNK, tiene que tener más ritmo"). Aprobado: *Let's All Dance This Christmas* (Mixkit 911, Michael Ramir C., 120,0 BPM, instrumental, banda de la voz 5,8 dB bajo el total → denso: −20 dB bajo la voz + hueco de EQ −6 dB). Arrancar el tema en su primer tiempo y pasar los cortes de B-roll a la grilla. Descartado para ella: *Discover* (Mixkit 587, orquestal). También aprobado: *Funkee Monkeee* (Mixkit, 100,0 BPM medido, 7,5 % de su energía en 1–4 kHz → −15 dB bajo la voz con hueco de EQ; el drop cae a los 4,81 s del tema), en el 23-10.
- **Tour house con Alejandra en recuadro** (pedido de Alejandra; aprobado 28-10-2026, 23-10 AR, Dade City): ella graba una sola toma a cámara (teleprompter) y aparte el recorrido de la casa sin audio.
  - Hook a pantalla completa. Al arrancar el recorrido se **achica con una animación a un recuadro ABAJO A LA DERECHA, pegado a la esquina del cuadro**: 280×498 px, borde a 40 px del lado derecho y a 60 px de abajo (termina en x 1040, y 1860), con esquinas redondeadas, borde blanco y sombra. Para el CTA vuelve a crecer a pantalla completa.
  - La posición se corrigió tres veces (la izquierda dentro de la zona segura y la esquina derecha de la zona segura fueron rechazadas): el usuario la quiere en la esquina real **aunque salga de la zona segura**. Avisarle que en Instagram los botones pueden tapar parte del recuadro.
  - Mientras está en el recuadro, títulos y subtítulos van centrados (x = 540) en la mitad alta: títulos con base en y ≈ 900, subtítulos en y ≈ 836, con un velo oscuro suave detrás porque los interiores son blancos. El primer subtítulo espera a que el recuadro termine de achicarse: si no, cruza la cara mientras se mueve.
  - En cada corte de la voz el recuadro alterna el encuadre (1,0 / 1,1×) para que el salto se lea como un punch.
  - Los datos de la casa salen uno por plano y al ritmo de la enumeración: ícono lineal + número rojo + etiqueta ("4 / habitaciones", "2 / baños", "garaje para / 2 / carros", "1,824 / pies cuadrados").
  - La ciudad entra como caja roja en el centro y sube a una etiqueta chica arriba mientras se dan los datos.
- Audio: master de la base (-11 LUFS). Los aprobados de referencia están más bajos (-19 a -24 LUFS): **no copiar ese volumen**, manda la base.

## 8. Stock y B-roll
- Primero el material del rodaje (la casa, la comunidad, el lago, las amenities).
- Stock creíble para **suburbios del área de Tampa**: casas de bloque de una o dos plantas, techos de tejas, lagos/retención, palmeras, cielos de Florida, autopistas tipo I-75, comunidades con amenities (piscina, pickleball, parques para perros). Carpeta local útil: `{STOCK}/MIAMI` (sirven los drones de Florida que no sean skyline de Miami) y `{STOCK}/NUEVOSSSS/amenities`.
- Personas: familias latinas o diversas de EE. UU. Nada que se lea europeo o argentino.
- Nunca skyline de Miami ni playas de Miami Beach para hablar de Tampa.
- Si el rodaje de una propiedad no tiene gente, se pueden animar capturas de los ambientes con personas usando Kling (sección 9).

## 9. Fotos de la propiedad animadas con personas (Kling)
Probado el 20-10-2026 en `10 OCTUBRE/Key West two rivers -09 AR` (7 ambientes: oficina, cocina, living, lanai, dormitorio, baño, piscina). Prompts y resultados de cada clip en la carpeta `KLING/` de ese reel.

**Material:** capturas de los videos de la propiedad, en 9:16, una por ambiente y numeradas en el orden del reel (`RECURSOS/1 OFICINA.png`, `2 COCINA.png`…). Los clips se guardan en `KLING/` con el mismo número (`02 COCINA kling v2.mp4`).

**Cómo se genera (cuenta web de Kling, sin API):**
- Desde el Chrome del editor con la extensión Claude in Chrome, donde ya está la sesión de Kling. El navegador integrado de la app no mantiene la sesión ni sube archivos.
- La extensión solo sube archivos de las carpetas de la sesión: copiar antes las capturas a la carpeta temporal de la sesión.
- Configuración: Video Generation · Kling 4.0 · 1080p · 6 s · proporción **Adaptive** (sale vertical como la foto) · 1 salida. Cuesta **81 créditos por clip**; más de una salida por pedido requiere un plan superior. **Pedir el OK antes de cada Generate**, con el costo.
- Se pueden mandar varios pedidos seguidos; tardan ~5–7 min cada uno.
- Para bajar: el botón Download no siempre deja el archivo en Descargas. Sacar la URL `.mp4` del video en la página y bajarla directo; identificar qué clip es cada ambiente comparando el primer cuadro con la captura.

**Prompt (en inglés), lo que funcionó:**
- **Solo zoom in, recto y muy lento.** Con zoom out Kling inventa lo que queda fuera de la foto (en la cocina agregó una mesada en el pasillo).
- Decir explícitamente: *"The camera stays in the same position and does not rotate, pan or tilt; only a very slow, straight, smooth zoom in."* Sin esa frase la cámara giró (piscina).
- Cerrar con: *"Keep the room exactly as in the image… Do not add any new furniture, objects or structures."*
- **Ubicar a las personas en muebles concretos que ya están en la foto** ("on the front end of the existing sectional sofa", "on the existing striped armchair in the foreground"). Si solo se dice "at medium distance" o "in the background", quedan chicas al fondo (cocina v2, living v1, piscina).
- Personas: familias latinas o parejas de 30–40 años, ropa casual o de trabajo, haciendo algo simple (servir café, leer, sentarse, estirarse). 1–3 personas por ambiente.
- Baño: mujer en bata en la vanity funcionó sin fallas de espejo.
- Familias grandes funcionan si cada persona tiene su lugar y su acción: con 5 (abuela en el banco más cercano, dos chicos en los bancos de al lado, mamá en la isla del fondo, papá entre las islas) salieron todas con caras naturales. Kling suma utilería chica (bowls de fruta, un plato): se acepta si no cambia la casa.

**Antes de usar un clip:**
- Revisar 4 cuadros (inicio, 2 s, 4 s, final) contra la captura. Descartar o regenerar si cambió la casa: muebles, mesadas, ventanas o forma de la piscina. Alejandra no muestra nada que no sea real.
- Los clips traen audio generado: **silenciarlos**.
- Va como B-roll de "vida en la casa", 1,5–3 s por plano, nunca como dato de la propiedad.

## 10. Reglas editoriales de Alejandra
- **No** narrar casos de clientes ni testimonios armados con nombres, cifras y proceso (ella los descartó). Un testimonio grabado por el propio cliente sí se edita normal.
- **No** usar el titular "No necesitas X, necesitas Y" ni el gancho de "dos casas iguales".
- No cambiar el copy ni la estructura del guion sin que lo pidan.
- CTA final: WhatsApp / agendar visita, como lo diga ella. No pedir comentar palabras clave.

## 11. Referencias aprobadas
Videos que el usuario marcó como modelo del estilo (carpeta `LISTOS` de cada uno):
- `23-10 AR Título pendiente` (aprobado 28-10-2026, Remotion: `remotion-elevate/src/ar2310/`; scripts en `PROYECTO/`: voz.py, build_data.py, mezcla.py) — tour house en Dade City con Alejandra en recuadro (sección 7): hook a cámara ("¿Dejaste de buscar tu *primera casa* / porque los precios te parecían DEMASIADO ALTOS?"), ficha de datos plano a plano, HOA $14 en rojo con CashMoney, cajas de ciudad (Dade City, Wesley Chapel, Tampa), checklist de alrededores, CTA ESCRÍBEME con wink. Correcciones: recuadro abajo a la derecha en la esquina real (3 rondas), "?" al cierre de la pregunta del hook, precio con coma.
- `24-10 AR Título pendiente` (aprobado 22-10-2026, hecho en Remotion: `remotion-elevate/src/ar2410/`) — reel a cámara en casa modelo + B-roll navideño de Pexels: cajas rojas con pin por ciudad, cifras champagne enteras con CashMoney, checklist con checks rojos, CTA ESCRÍBEME con wink, música funk navideña en la grilla. Se pidió en 3 rondas: portada del usuario, cifras sin rodar, subtítulos con fundido simple, funk en vez de corporativo, CashMoney y wink más presentes.
- `26-09 AR PAUTA Título pendiente` (v2) — el más actual: precio champagne animado, caja de ubicación roja, cifras en rojo.
- `22-09 AR Título pendiente` — orgánico educativo, subtítulos limpios, apertura en B/N.
- `21-08 AR PAUTA CASA SIN CDD POR $328,990` — titulares de datos con íconos.
- `05-08 AR PAUTA Casa nueva en Two Rivers` (hook 1) — más B-roll de zona y amenities; el amarillo quedó fuera de marca.

## 12. Portadas
Analizadas el 22-10-2026 (para el 24-10): `21-10 AR Pauta`, `Azure-09 AR PAUTA`, `25-09 AR PAUTA`, `09-10 El día del cierre de tu casa` y `Key West two rivers` (carpeta `PORTADA/` de cada uno, PNG con el nombre del video).
- **Texto ARRIBA de la cabeza**, centrado en x = 540, dentro del cuadrado 1080×1080 (≈ y 520–870). La persona va abajo, de cuerpo medio o entero.
- **Lockup de 2–3 líneas:** caja roja `#AB3130` redondeada con texto blanco Open Sauce ExtraBold Italic (~54 px: "Casas nuevas en", "El día del", "POR", "PRECIO BASE") + **golpe** grande (150–170 px) en Open Sauce ExtraBold Italic con **degradé champagne** (blanco cálido → `#EEDBBF` → dorado apagado), MAYÚSCULAS o precio ("USD 420,000", "CIERRE DE TU CASA"). A veces una línea extra en blanco liviano o una palabra en rojo.
- Tracking muy apretado (≈ −3,5 %), interlineado casi pegado, sombra suave; sin contorno.
- Foto: degradé oscuro arriba (donde va el texto) y abajo; sujeto más luminoso que el fondo.
- **Aprobada 24-10 (la hizo el usuario, `24-10 AR Título pendiente/PORTADA/24-10 AR Título pendiente.png`)**: plano abierto del living con Alejandra de cuerpo entero (más chica que en la propuesta con zoom), caja roja "Estrena tu propia **CASA**" (palabra clave en MAYÚSCULA) y debajo "esta **NAVIDAD**" en una sola línea, todo en degradé champagne (también "esta"), Black/ExtraBold Italic, y **emojis** al final (🎄🏠). El texto queda pegado arriba de la cabeza (y ≈ 680–910). Mi propuesta (zoom 1,5× con la cara más abajo y "esta" en blanco liviano) no se usó.
- **Aprobada 23-10 (la hizo el usuario con un frame que le pasé, `23-10 AR Título pendiente/PORTADA/23-10 AR Título pendiente.png`)**: tour sin Alejandra en la portada, plano abierto de la cocina con isla, degradé rojo arriba, caja roja "**4 habitaciones** por" y golpe "USD 304,400" en degradé champagne (y ≈ 495–750). Para tours se le pasan frames de la **propiedad** (fachada, cocina, living, entrada, dormitorio), los más nítidos (varianza del Laplaciano), sin casas de vecinos.
- **Antes de insertar la portada, comparar sus cifras con lo que dice Alejandra** (28-10, 23-10: la primera versión decía USD 304,900 y en el audio es $304,400; el usuario la corrigió).
- Si el usuario deja su portada en `PORTADA/`, se usa esa como frame 0 y no se genera otra.

## 13. Al cerrar cada video
Seguir la regla 11 de la base: las correcciones que sean gusto de Alejandra se agregan acá (con fecha y video de origen); las que valen para todos van al coordinador.