# PYE — Piezas de referencia aprobadas

Raíz: `{CARPETA_CLIENTE}/01 REELS/`. Todas 1080×1920, 25 fps. Sirven para entender el gusto del cliente, no como plantilla.

## A. Reel a cámara (Pamela sola) — `09 Septiembre/19-09 PYE Cambiaste de trabajo/` (37 s)
- Gancho caminando hacia cámara por un pasillo, después **cambia de locación por bloque de idea**: isla de cocina (de pie y sentada), sillón de cuero, dormitorio, frente a un cuadro, cocina oscura para el cierre.
- Cortes de salto + punch-ins cada 2–4 s.
- Subtítulos chicos 1–3 palabras a la altura del pecho; cifra-golpe "**2 AÑOS**" en Black grande; acento en itálica ("*descalificados*", "*distinto*").
- Cierre: "**ESCRÍBENOS**" Black sólido arriba + "y **podemos** revisar" debajo.

## B. Reel de pareja — `08 Agosto/17-08 PYE Ser pareja y socios/` (31 s)
- Los dos detrás de la isla de cocina blanca, plano medio fijo con punch-ins. Gancho en el primer frame: "Ser pareja y socios al / **MISMO TIEMPO**".
- Golpes: pasaje momentáneo a **blanco y negro**, **glitch RGB** sobre Pamela.
- B-roll real de su vida que ilustra lo dicho: escalera de la casa, cancha de fútbol de su hijo (dron), gimnasio, selfie en restaurante.

## C. Pauta recorriendo propiedad — `08 Agosto/01-09 PYE PAUTA Título pendiente/` (80 s) y `07 Julio/13-08 PYE PAUTA CASA EXTRA/` (61 s)
- Abre con Pamela frente a la casa (plano general, cielo azul) + dato/precio grande: "**2.5 BAÑOS**", "**$380.000**". Gancho alternativo: "Casa gigante / **CON ANEXO**".
- Recorrido en planos gimbal ambiente por ambiente con voz en off; Pamela entra y sale de cuadro (abre la puerta "Pero **espérate**").
- Datos en Black sobre el plano ("**2072sqft**", "4 habitaciones", "2 vehículos"); amenities de la comunidad (gimnasio, lago en dron con glitch).
- Flash blanco como transición de exterior a interior.
- Cierre con CTA a coordinar la visita ("tu **visita.**").

## D. Ping Pong (preguntas rápidas) — `09 Septiembre/12-09 PYE Ping Pong con Erick/` (72 s) y `20-08 PYE Ping Pong con Pamela/` (57 s)
- Los dos en la mesa del patio con pileta; uno lee preguntas del celular y el otro responde. Plano fijo con cortes entre ángulos.
- Título de apertura a la izquierda: "**Ping Pong**" Black + "con **Erick**" debajo, más chico.
- **Preguntas en caja blanca redondeada** (radio ~20 px, ~70 % del ancho) con texto **negro** centrado, 2–4 líneas, Light + Extrabold en las palabras clave ("¿Cuál es tu **consejo** *número uno* para que alguien pueda comprar su **primera casa**?"). Ubicada a media altura, sin tapar caras.
- Las respuestas llevan los subtítulos normales blancos.

## E. Reel a cámara con acabado completo (APROBADO, "me encantó") — `10 Octubre/20-09 PYE Fin de año puede ser el mejor/` (39 s)
Primer video editado con la vara alta de la skill (secciones 0–4); usarlo como referencia de acabado.
- Material: 6 tomas 4K (una frase por toma, 6 locaciones de una casa modelo). Montaje en 4K → Remotion con cámara virtual (zoom de 1,2× a 2,0× sobre el 4K sin pérdida). Proyecto reutilizable en `PROYECTO/claude/remotion/` (`camera.ts` con planos + match de ojos, `Titles.tsx`, `Captions.tsx`, `Main.tsx`) y mezcla en `PROYECTO/claude/mix.py`.
- Cortes solo en pausas largas dentro de cada toma, cada uno con punch-in de ratio ≥ 1,45 y ojos fijos en pantalla.
- Transiciones por locación: zoom con desenfoque radial (copias escaladas), barrido lateral en "Por otro lado", flash blanco, glitch RGB antes del CTA; B/N en "no se da en cualquier época".
- Títulos apilados desde la cabeza hacia arriba (cada línea nueva empuja a las anteriores), comparativo debajo del mentón en primer plano, subrayado dibujado una vez, rotoscopia en "El fin de año PREMIA" y "ESCRÍBENOS".
- 20 SFX con pico alineado; música "Modern Ideas" −12 LU bajo la voz; master −11,1 LUFS / −1,3 dBTP.
- Lecciones técnicas: la capa de rotoscopia va dentro del MISMO envoltorio de transición que la base (`<Trans><Cam>…`); si no, en el zoom-out de arranque la persona recortada queda a otra escala y se ve duplicada (detectado en 11-09, frame 0); armar cada segmento con `setpts=PTS-STARTPTS,fps=25,setpts=N/25/TB` y sin B-frames (si no, el video se corre hasta 3 cuadros por segmento y Vision lee tiempos corridos); medir la sonoridad del master sobre el estéreo final (mono duplicado mide +3 LU).

## F. Reel a cámara, 5 locaciones (11-09 PYE "Cuánto será el pago mensual", 28 s) — entregado 2026-10-06, pendiente de aprobación
- Reutiliza el proyecto de E (`PROYECTO/claude/remotion/`) con una mejora: la cámara ancla el zoom a los **ojos rastreados cuadro a cuadro** (`faces.swift` + `camera.ts`, T = e·(1−S)), sirve para tomas caminando.
- Rotoscopia en el gancho ("¿Cuánto es el / PAGO MENSUAL?") y el CTA; lista que se arma debajo del mentón (+ IMPUESTOS / + SEGURO / + HOA / + CDD) con un "check" por ítem; B/N en "no termina".
