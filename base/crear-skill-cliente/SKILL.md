---
name: crear-skill-cliente
description: Crea la skill de marca de un cliente de Elevate (<nombre>-brand) para editar sus videos — analiza el manual de marca (paleta, tipografías, logo), mide las piezas aprobadas del cliente (subtítulos, títulos, colores, transiciones, música, niveles) y sus portadas, muestra el análisis y espera el OK, y recién ahí arma la skill en el repo elevate-edicion con la plantilla del equipo, la instala y la deja lista para compartir. También cubre clientes sin manual vigente (identidad sacada de los videos) y clientes sin videos editados (se propone la identidad editando el primer video). Usar SIEMPRE que el editor diga "creá la skill de [cliente]", "armá la skill de marca de...", "cliente nuevo", "hacé la brand de...", "tenemos un cliente nuevo para editar", aunque no mencione la skill.
---

# Crear la skill de marca de un cliente

Una skill de marca le dice a Claude **cómo se ve ese cliente en video**. Las reglas de cómo se edita bien ya están en `edicion-reels-base` y no se repiten acá. En este chat **no se edita nada**: solo se analiza y se crea la skill (salvo el caso C).

Antes de empezar, leer `~/.claude/elevate/config.json`. Si no existe, cargar `configuracion-inicial`.

## Principios (aprendidos con los clientes anteriores)
1. **El manual de marca no se traslada literal a los videos.** Casi siempre pasa la paleta y poco más; a veces ni la tipografía (Iniesta usa Gotham en el manual y Montserrat en los reels). Copiar el PDF al pie de la letra quedó "vacío y feo" con Yanira: hay que reinterpretarlo, con la misma línea (bold, espaciados chicos) y con criterio propio.
2. **Lo que manda son las piezas aprobadas.** Si el manual es viejo o no representa lo que se publica (caso Francisco Moya), la identidad se saca de los videos.
3. **Las referencias son REFERENCIA, no fórmula.** Describirlas para entender el criterio; la skill no debe empujar a repetir siempre el mismo video.
4. **Medir, no adivinar.** Tamaños y posiciones en px, HEX muestreados del frame, fps, duración, LUFS. Identificar las fuentes comparándolas con las del manual.
5. **Espaciado bajo por defecto**: interletrado e interlineado apretados (las líneas casi se tocan). Es el gusto de la agencia salvo que las referencias muestren otra cosa.
6. **El lugar importa**: el stock tiene que parecer de la ciudad del cliente (arquitectura, calles, personas), y la moneda es la que usa (en EE. UU. siempre USD). Anotar el regionalismo con el que habla.
7. **Subtítulos replicables**: el sistema de subtítulos tiene que poder repetirse exacto en cada video (fuente, tamaño, pesos, color, cantidad de palabras).
8. **Tipografías con licencia.** Si son TRIAL o "personal use", anotarlo en la skill y avisarle al editor (y que lo sepa el coordinador).

## 1. Juntar el material
Pedirle al editor en un solo mensaje lo que no encuentres en `{CARPETA_CLIENTE}/` (normalmente `00 IMAGEN DE MARCA/` y `01 REELS/`):
- Nombre del cliente, **SIGLA** de archivos, rubro, ciudad.
- Manual de marca / paleta / tipografías / logo, y si sigue vigente.
- **2 a 4 piezas aprobadas** (finales publicados), idealmente de tipos distintos: pauta mostrando propiedad, reel común a cámara, etc. Si no las nombra: las más recientes que estén terminadas. Descartar las que no están editadas y las que dicen **"clip"** (salen de Opus y son muy simples).
- Lo que se decidió con el cliente y no figura en el manual: si va logo, cosas que no le gustan, preferencias.
- Si tiene material propio para usar de B-roll (viajes, propiedades, drone).

Elegir el caso:
- **A. Hay manual y piezas aprobadas** → pasos 2–7.
- **B. Manual viejo o inexistente, pero hay piezas** → igual que A, con la identidad sacada solo de los videos.
- **C. No hay videos editados todavía** (cliente recién llegado) → ver "Caso C" abajo.

## 2. Analizar la marca
Del manual: paleta (HEX), tipografías y pesos, logo y variantes, tono y aplicaciones. Marcar desde ya qué parece trasladable a video y qué no.

## 3. Analizar las piezas aprobadas
Para cada pieza: `ffprobe` (resolución, fps, duración), frames cada 1–2 s en hoja de contacto (script `hoja_contacto.py` de `edicion-reels-base`), transcripción si hace falta, y medir:
- **Ritmo y estructura**: gancho, duración de planos, cortes, zooms/punch-ins, cómo termina.
- **Subtítulos**: fuente, tamaño en px, pesos y qué palabras van en bold, palabras por pantalla, color, sombra/caja, posición, animación.
- **Títulos, precios y CTA**: tipografía, color, contorno, mayúsculas, interlineado medido, animación.
- **Placas, B-roll, stock** y de dónde sale.
- **Transiciones** (la "de la casa") y SFX.
- **Música** (estilo) y **niveles** (LUFS de la pieza).
- **Portadas**: 4–5 portadas publicadas, según `portadas-reels` §0.

## 4. Mostrar el análisis y esperar el OK
Resumen claro, con imágenes si suma (frames y paleta): qué se usa de la marca, el sistema de subtítulos y títulos, las referencias y la guía de portadas. **No crear la skill hasta que el editor diga OK.** Incorporar sus correcciones.

## 5. Crear la skill
En el repo: `<repo>/clientes/<nombre-apellido>-brand/` (ruta del repo en `config.json` → `repo`). Nombre en minúsculas, con guiones, sin tildes, terminado en `-brand`; `name:` igual a la carpeta.
- `SKILL.md` a partir de `plantilla/plantilla-skill-marca.md` de esta skill (copiarlo como `SKILL.md`). Borrar las secciones que no apliquen.
- **La `description` es lo más importante**: Claude decide con ella cuándo cargar la skill. Tiene que nombrar al cliente, la SIGLA, lo distintivo de la marca y las frases con las que lo van a pedir.
- `assets/fonts/<familia>/`: las fuentes que se usan (solo esas). `assets/`: paleta, logo con fondo transparente en sus variantes (si se usa), capturas del sistema de subtítulos.
- `references/piezas.md`: análisis largo de cada pieza si no entra en el SKILL.md. `references/biblioteca.md`: música, SFX y stock que le quedan bien, con rutas relativas a `{HERRAMIENTAS}`. Si hay material propio (viajes, propiedades), un catálogo de qué hay en cada clip y foto.
- **Rutas siempre con marcadores** (`{CARPETA_CLIENTE}`, `{HERRAMIENTAS}`, `{SFX}`; ver regla 0 de `edicion-reels-base`). En scripts: `os.path.expanduser('~/.claude/skills/<skill>/...')` y las rutas de `config.json`. Nunca rutas absolutas de tu máquina.
- **No copiar reglas que ya están en `edicion-reels-base`** (márgenes, cara, audio, niveles, revisión). Solo lo propio del cliente.
- Mantenerla corta y concreta: tablas, valores medidos, ejemplos. Un SKILL.md de 70–150 líneas.

## 6. Instalar y probar
- Enlazar en `~/.claude/skills/` como en `configuracion-inicial` §3, y sumar el cliente a `config.json` → `clientes` con su carpeta.
- Prueba: un frame 1080×1920 con un subtítulo y un título en el sistema del cliente, usando sus fuentes de `assets/`. Mostrárselo al editor.

## 7. Compartirla con el equipo
Desde el repo:
```
git pull
git checkout -b cliente/<nombre-apellido>
git add clientes/<nombre-apellido>-brand
git commit -m "Nueva skill: <Nombre Apellido> (<SIGLA>)"
git push -u origin HEAD
```
Si está `gh`, abrir el Pull Request (`gh pr create`); si no, pasarle al editor el link que imprime `git push`. Explicarle que, cuando el coordinador lo apruebe, el resto del equipo la recibe con "actualizá las skills".

## Caso C: cliente sin videos editados
(Así se hizo con Yamilet García.) Se propone la identidad editando su primer video:
1. Analizar lo que haya de marca (manual, portadas, logo) y el material del primer video.
2. Editar el video con `edicion-reels-base`, proponiendo un sistema para video que reinterprete la marca. Los **subtítulos tienen que ser replicables**: si conviene, basarse en el sistema de otro cliente que funcione y adaptarlo a esta marca.
3. Con las correcciones del editor, crear la skill como en el paso 5, dejando la pieza como "referencia aprobada en curso" y su pipeline en `scripts/` si sirve para los próximos.

## Después: la skill crece con cada video
Al cerrar cada edición, las correcciones que valen solo para ese cliente se guardan en su sección 8 ("Correcciones del cliente"), reescribiendo la regla si contradice algo anterior. Lo que vale para todos los clientes va a `edicion-reels-base`, pero en un PR aparte que revisa el coordinador.
