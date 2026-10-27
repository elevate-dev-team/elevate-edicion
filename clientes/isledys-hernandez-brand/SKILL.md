---
name: isledys-hernandez-brand
description: Identidad visual para video de Isledys Hernandez (ISM), Mortgage Loan Originator de Pioneer Mortgage Funding en Brandon / Tampa, Florida (NMLS #1924019), cubana, que les habla a realtors y compradores hispanos. Bodoni URW (Bold MAYÚSCULA para el golpe, Italic para las frases) + Montserrat SemiBold, subtítulos blancos de 2–3 palabras con la palabra clave en Bodoni Bold Italic sobre marcador azul Pioneer con filete dorado, títulos con un solo golpe en dorado o blanco y rotoscopia en el hook, placas celestes con check dorado y pantalla celeste completa en las enumeraciones, CTA en pastilla azul con borde dorado, logos Equal Housing + Pioneer al 50 % en todos los videos, disclaimer "Sujeto a calificación…" en las promesas (sin placa de contacto/NMLS al final), zoom-blur y destello dorado como transición, música funk o corporate instrumental, paleta azul Pioneer / celeste / dorado / hueso, más la referencia de dos pautas aprobadas a cámara (sentada en la oficina; de pie con B-roll de stock) y la guía de portadas (las hace el editor). Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de Isledys Hernandez / ISM / Pioneer Mortgage (reels, pauta, portadas), o cuando el usuario diga "editá el video de Isledys", "video de ISM", "con la marca de Isledys", aunque no mencione la skill.
---

# Isledys Hernandez (ISM) — Marca para video

Reglas obligatorias (márgenes, cara, audio, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: las hace el editor (sección 5). Acá va solo lo propio de la clienta.

- Clienta: **Isledys Hernandez**, **Mortgage Loan Originator** (NO es realtor) en **Pioneer Mortgage Funding** (NMLS #1980), Brandon / Tampa, Florida. **NMLS #1924019**. Siglas de archivos: **ISM**.
- Vocera: ella sola, a cámara (sentada en su oficina o de pie contra la pared de listones de madera).
- Público y lugar: **realtors** a los que les ofrece revisar compradores ("Realtor, ¿un banco le dijo que no…?") y compradores hispanos en Florida. **El stock tiene que parecer de EE. UU. / Florida**: casas de garage al frente, estilo mediterráneo, cartel FOR SALE / SOLD, oficinas. Moneda: **USD**.
- Tono: cubana, cercana, **tutea** ("escríbeme", "mándame") y mezcla inglés del rubro (*lender*, Realtor, 1099). Respetar lo que dice; cambia palabras del guion y eso manda en los subtítulos. Whisper escribe "Reactor" por **Realtor** y "paso" por **caso**.
- CTA habitual: **escríbeme por WhatsApp** / **mándame a tu próximo comprador**.
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM ISM Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/ EXPORT/`. El final va en `EXPORT/` con el nombre de la carpeta `.mp4`. Marca en `00 IMAGEN DE MARCA/`.
- **Crudo:** llega **ya montado** (una sola toma con saltos) y **en 576×1024 a ~1,2 Mbps** (reenviado por WhatsApp). Se limpia y escala antes de editar (§4) y el zoom no pasa de ~1,2×. Si consigue el original del iPhone, pedirlo.
- Formato de las referencias: 1080×1920, **30 fps**, 24–26 s.
- **Logos en TODOS los videos** (§4). Placa final: no.

## 1. El manual vs. los videos
La identidad la armó Elevate (aprobada por la clienta el 2026-10-26; entregables en `Identidad visual/` de su carpeta de diseño: portadas FB/WA v7 y fotos de perfil). Pasan la **paleta completa** y las **dos familias**. El pizarra casi no se usa en video. Lo que no está en el manual y salió de los videos: el **marcador azul** de la palabra clave (el dorado suelto no se lee sobre su ropa amarilla) y la **pantalla celeste** de las enumeraciones.

## 2. Tipografía — Bodoni URW + Montserrat
- **Bodoni URW** es de **Adobe Fonts**: NO va al repo. Copiarla al proyecto de Remotion desde Creative Cloud con `edicion-reels-base/scripts/fuentes_adobe.py "bodoni urw" <destino> "Bold,Bold Oblique,Regular Oblique,Medium,Medium Oblique"`. Sin Creative Cloud: kit web `https://use.typekit.net/suk1dpw.css` (familia `bodoni-urw`) o, para PIL, Bodoni Moda (Google, OFL).
- **Montserrat** (OFL): `assets/fonts/montserrat/` (Medium, SemiBold, Bold).
- Interlineado de títulos **0,85** (las líneas casi se tocan, con 14–26 px de margen entre una línea chica y el golpe grande para que no se pisen); interletrado −1 % en Montserrat.

| Uso | Fuente y peso |
|---|---|
| Subtítulo base | Montserrat SemiBold 54 px, blanca |
| Palabra clave del subtítulo | Bodoni URW Bold Italic 66 px, blanca sobre marcador azul |
| Golpe del título (uno por título) | Bodoni URW Bold MAYÚSCULA 110–170 px |
| Frases y bajadas | Bodoni URW Regular/Bold Italic 56–74 px · Montserrat SemiBold 40–48 px |
| Etiquetas espaciadas (REALTOR, MORTGAGE LOAN ORIGINATOR) | Montserrat Bold/SemiBold 30–38 px, interletrado 0,16–0,28 em |
| Botón CTA, placas | Montserrat Bold 62 px / SemiBold 38–44 px |

## 3. Color
| Nombre | HEX | Uso en video |
|---|---|---|
| Azul Pioneer | `#073FA7` | Marcador de la palabra clave (88 %), pastilla CTA, texto sobre celeste, fondo del disclaimer |
| Celeste | `#CDE5F4` | Placas, tarjetas de lista, pantalla celeste completa |
| Dorado | `#E2A407` | Golpe de título (sobre la pared), filetes, checks, tachados, borde de CTA y placas. **Nunca texto chico** ni sobre su ropa amarilla |
| Hueso | `#F5F5F0` | Bajadas en itálica en lugar del blanco puro |
| Pizarra | `#8298AC` | Casi no se usa |

## 4. Sistema de texto y acabado
Ver `assets/sistema-texto.jpg`. Plantilla de Remotion: `references/plantilla-remotion-02-10.tsx` (+ `references/Logos.tsx`).
- **Subtítulos:** 2–3 palabras, entran subiendo 14 px con spring. La palabra clave lleva el marcador azul con **filete dorado de 4 px abajo**, que se abre de izquierda a derecha. Con ella a cámara van pegados a la cabeza: **debajo del mentón** si la ropa da contraste, **sobre la pared arriba del pelo** si viste amarillo claro o blanco (02-10). Sobre B-roll, centrados.
- **Títulos:** un solo golpe Bodoni Bold MAYÚSCULA por título; el resto chico (Montserrat o Bodoni Italic). Golpe **dorado o blanco**, con sombra suave. Animación según lo que dice: pop con rebote, *slam* (NO), **tachado dorado** que se dibuja (RENTAR, el cliente), tiembla (NÚMEROS), se inclina al caer (TODO), contador o filete que crece.
- **Rotoscopia en el hook** (pedido del editor, 02-10): el golpe grande DETRÁS de ella, con la base de las mayúsculas ~55 px bajo el tope del pelo (medido en la máscara). Máscara con `pamela-erick-brand/scripts/roto_video.swift` sobre el clip ya escalado → ProRes 4444 con alfa (`alphamerge`) → `<OffthreadVideo transparent startFrom={0}>` con el mismo zoom que el plano.
- **Placas celestes:** fondo `#CDE5F4`, radio 20–26 px, **borde inferior dorado de 6 px**, texto azul. Se arman desde abajo (cada fila crece cuando la dice; nunca una placa vacía esperando). Listas: tarjetas de 700×104 px con **check dorado** que entran desde la izquierda.
- **Pantalla celeste completa** (pedido del editor, 02-10) para enumeraciones ("ingresos, deudas, cuentas de ahorro"): entra como cortina desde abajo (7 frames), degradé radial celeste con rayas diagonales azules al 7 %, filetes dorados arriba y abajo, y el texto **entrando palabra por palabra** mientras lo dice (Montserrat + ítems en Bodoni Bold Italic azul con check). Bloque centrado en y = 960.
- **CTA:** pastilla azul Pioneer, borde dorado 4 px, ícono blanco (WhatsApp o casa) y un brillo que la recorre.
- **Logos (obligatorios, todo el video, por encima de todo, al 50 %):** **Equal Housing Opportunity** arriba a la derecha (x 735, y 90, 200 px de ancho; `assets/logos/equal-housing-negro.png`, **blanco sobre fondos oscuros**, se cambia solo en los cortes) y **Pioneer Mortgage Funding** color abajo al centro (y 1600, 460 px). Los títulos de arriba empiezan en y ≥ 300.
- **Compliance:** cada promesa (programas, "lo que te digo es lo que llega al cierre") lleva `*Sujeto a calificación y aprobación de crédito.` (Montserrat Medium 28 px sobre franja azul al 60 %, y ≈ 1200). **El cierre NO lleva su contacto** (`Isledys Hernandez · NMLS #1924019`): el editor lo sacó en el 03-10 porque recarga la imagen final; el CTA queda solo con el título y la pastilla. Una placa de nombre con NMLS solo si se presenta a mitad del video.
- **Transiciones:** zoom-blur (pulso de escala ×1,14 + desenfoque, anclado a los ojos) en cada corte y entrada de B-roll; **destello dorado/celeste** o la cortina celeste en los cambios de bloque.
- **Zooms:** empujes lentos de 1,0 a 1,05–1,06 por tramo y punch-ins hasta ~1,2 (el crudo es de 576 px). Si el crudo ya trae zooms (02-10), seguir la cara cuadro a cuadro con `track_cara.swift` para ubicar textos.
- **Crudo:** `hqdn3d=1.5:1.5:4:4,scale=1080:1920:flags=lanczos,unsharp=5:5:0.6:5:5:0,eq=contrast=1.04:saturation=1.03`, 30 fps, crf 14.
- **Música y SFX:** **funk o corporate**, siempre instrumental (medir con `vocales.py`), cortada para que termine con su final natural. Corporativa suave ("Talent in the Air", 01-10 y 02-10): ~15 dB debajo de la voz con hueco de −3 dB en 2,2 kHz. Funk ("Gimme that Groove!", 03-10, pedido del editor): ~16–17 dB debajo con hueco de −5 dB en 2,2 kHz y −2 dB en 350 Hz. **No usar `flip.mp3`** ("suena raro", 03-10): en su lugar wink o whoosh. SFX: whoosh/swipe en cortes, pop en golpes, stamp en el "NO", check en listas, glitch en números, hojas en la agenda, notificación en placas (~25 en 25 s). Ver `references/biblioteca.md`.
- **Stock / B-roll:** del banco de stock, con look de EE. UU. y sin caras de frente; en los conceptos concretos (oferta aceptada, documentos, la casa, semanas, firma). ~9 s en 26 s quedó como prueba (02-10).

## 5. Portadas
**Las hace el editor.** Lo que corresponde: pasarle **2 frames** del video en 1080×1920 y en la resolución original, donde ella **sonríe o tiene la boca cerrada**, mirando a cámara (pausas entre frases), guardados en `PORTADA/`. Cuando deja la portada (a veces en `PORTADA/PORTADA OK/`, con otro nombre: verificar la imagen), insertarla como frame 0 (`portadas-reels/scripts/portada_primer_frame.sh`).
Estilo de sus portadas (`assets/portadas.jpg`): degradé **azul Pioneer** desde arriba sobre el plano, ella recortada con más exposición, texto pegado arriba de la cabeza: golpe en **Bodoni Bold** (REALTOR / LOS NÚMEROS? en itálica con brillo blanco) + Montserrat Light/ExtraBold Italic, clave en degradé dorado. El texto puede pasar detrás de la cabeza.

## 6. Referencias (REFERENCIA, no fórmula)
Las dos **aprobadas por la clienta** (2026-10-27), con las correcciones de la §8.

### A. Pauta sentada en la oficina — `01 REELS/10 OCTUBRE/01-10 ISM PAUTA Título pendiente` (23,8 s)
- Hook "Realtor, ¿un banco le dijo que no a tu comprador?": REALTOR, espaciado en dorado + "¿un banco le dijo que" + **NO?** con slam dorado; después "No lo mandes a **RENTAR**" con tachado dorado.
- "no siempre es un no **DEFINITIVO**" con filete; placa celeste "el problema no es ~~el cliente~~ sino cómo se presentó **su caso**"; lista de 3 tarjetas (1099 / crédito / fondos de un familiar); **PROGRAMAS** + disclaimer; placa de nombre con NMLS; checklist "¿hay camino? ¿qué le falta?".
- CTA "Escríbeme por" + pastilla **WhatsApp** + "y revisamos **su caso**" + NMLS.

### B. Pauta de pie con B-roll — `01 REELS/10 OCTUBRE/02-10 ISM PAUTA Título pendiente` (26,0 s)
- Hook con **rotoscopia**: REALTOR dorado detrás de su cabeza, arriba "Si eres" → "y te pasó esto".
- B-roll: SOLD + apretón de manos ("oferta aceptada"), papeles ("sin revisar documentos"), pareja frente a una casa ("se enamoró de la casa"), agenda ("semanas"), firma ("carta de pre-aprobación").
- "los **NÚMEROS?**" que tiembla, **PEORES**, "y se cae **TODO** al final", **pantalla celeste** con la revisión, "Lo que te digo al principio es lo que llega **AL CIERRE**" + disclaimer, CTA "Mándame a tu próximo **COMPRADOR**" + pastilla "antes de que empiece a ver casas".

## 7. Ideas que pueden sumar (opcionales)
- Contadores o barras ocultas cuando hable de tasas o montos sin decir la cifra (nunca inventar números).
- Rotoscopia también en el CTA si el plano tiene aire arriba.
- Tarjeta "Isledys Hernandez · Pioneer Mortgage Funding · NMLS" estilo la de DC si se presenta más largo.

## 8. Correcciones del cliente
- 2026-10-27 (03-10, editor): títulos con número balanceados — el número grande alineado por la base con la palabra de al lado ("**3** preguntas") y con aire parejo arriba/abajo ("PREGUNTA **02**"; Bodoni con lineHeight 0,8 se monta sobre la línea de arriba); sin el contacto/NMLS al final; nada de `flip.mp3`; música funk o corporate.
- 2026-10-27: la clienta aprobó el 01-10 y el 02-10 tal como se entregaron (con logos y B-roll de stock): el sistema de §2–§4 queda confirmado, B-roll incluido.
- 2026-10-26 (02-10, editor): rotoscopia en el hook; pantalla celeste completa con el texto entrando en las enumeraciones; el subtítulo dice **"pre-aprobación"** aunque ella diga "aprobación" (lo que se ofrece es la carta de **pre-aprobación**).
- 2026-10-27 (01-10 y 02-10, editor): logos Equal Housing + Pioneer al 50 % en todos los videos (§4).
- 2026-10-26 (01-10): el dorado no se lee sobre su ropa amarilla → la palabra clave del subtítulo va en marcador azul; con saco claro, los textos van sobre la pared.
