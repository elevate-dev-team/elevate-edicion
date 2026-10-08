---
name: nombre-cliente-brand
description: Identidad visual para video de [NOMBRE] ([SIGLA]), [rubro] en [ciudad, país]. Tipografía [familia] ([pesos que se usan]), subtítulos [color / posición / estilo], títulos y precios en [tipografía y color], paleta [colores principales], transición de la casa [cuál], más la referencia de [N] piezas aprobadas ([tipos: pauta de propiedad, reel a cámara, etc.]) y la guía de portadas. Se usa junto con la skill edicion-reels-base (reglas obligatorias). Usar SIEMPRE que se edite, subtitule, anime o diseñe cualquier pieza de [NOMBRE] / [SIGLA] (reels, pauta de propiedades, portadas), o cuando el usuario diga "editá el video de [nombre]", "video de [SIGLA]", "con la marca de [NOMBRE]", aunque no mencione la skill.
---

# [NOMBRE] ([SIGLA]) — Marca para video

Reglas obligatorias (márgenes, cara, audio, fin al terminar de hablar, revisión): skill **`edicion-reels-base`**, siempre. Portadas: **`portadas-reels`** + la sección 5 de esta skill. Acá va solo lo propio del cliente.

- Cliente: **[Nombre]**, [rubro] en **[zona]**. Siglas de archivos: **[SIGLA]**.
- Voceros: [quién habla a cámara; uno o varios].
- Público y lugar: [ciudad/país y a quién le habla]. **El stock tiene que parecer de ahí**: arquitectura, calles, personas y moneda ([USD / ARS / ...]).
- Tono: [formal / cercano; voseo, tuteo, spanglish, regionalismos]. Respetar lo que dice en los subtítulos. Errores típicos de Whisper con este cliente: [...].
- CTA habitual: [...].
- Carpeta: `{CARPETA_CLIENTE}/` → `01 REELS/<NN Mes>/<DD-MM SIGLA Título>/` con `VIDEOS/ VOZ/ MUSICA/ PORTADA/ PROYECTO/ RECURSOS/`. El final va en la raíz con el nombre de la carpeta `.mp4`.
- Formato de las referencias: 1080×1920, **[fps] fps**, [duración típica] s.
- Logo: [se usa / no se usa; dónde]. Placa final: [no, salvo pedido].

## 1. El manual vs. los videos
[Qué del manual se traslada a los videos y qué no. Lo normal es que pase la paleta y poco más: la identidad para video se reinterpreta a partir de las piezas aprobadas.]

## 2. Tipografía — [Familia]
Archivos en `assets/fonts/<familia>/` (licencia: [OFL / comercial / **TRIAL: no usar en piezas publicadas**]). Interletrado [ej. −2 % del cuerpo], interlineado de títulos [ej. 0,85: las líneas casi se tocan].

| Uso | Peso |
|---|---|
| Subtítulo base | [...] |
| Palabra clave del subtítulo, cifras, nombres | [...] |
| Acento | [...] |
| Títulos-golpe / CTA | [...] |
| Precio | [...] |

## 3. Color
| Nombre | HEX | Uso en video |
|---|---|---|
| [Principal] | `#000000` | [...] |

## 4. Sistema de texto y acabado
- **Subtítulos:** [palabras por pantalla, tamaño px, peso, color, sombra/caja, animación de entrada]. La posición la manda la base.
- **Títulos:** [estructura, animación, contorno, sombra]. Título *o* subtítulo, no los dos.
- **Precio y datos:** [...].
- **Transición de la casa:** [...] y en qué cortes va.
- **Zooms y ritmo:** [...].
- **Música y SFX:** [estilo; dónde buscar en `{HERRAMIENTAS}`]. Niveles: los de la base.
- **Stock / B-roll:** [material propio primero; qué evitar].

## 5. Portadas
[Guía hecha analizando 4–5 portadas publicadas del cliente, según `portadas-reels` §0: lockup, tipografías, colores, posición respecto del sujeto, fondo. Con ruta de cada portada analizada.]

## 6. Referencias aprobadas (REFERENCIA, no fórmula)
Mirar antes de editar. Sirven para entender el criterio, no para copiarlas.

### A. [Tipo] — `[carpeta relativa a {CARPETA_CLIENTE}]` ([duración] s)
- [Gancho: qué se ve y qué dice]
- [Cómo se muestran datos y precio]
- [Subtítulos / títulos / transiciones]
- [CTA]

## 7. Ideas que pueden sumar (opcionales, a criterio)
- [...]

## 8. Correcciones del cliente
[Cada corrección que vale solo para este cliente, con fecha y pieza de origen. Si contradice algo de arriba, se reescribe la regla en vez de sumar una línea.]
