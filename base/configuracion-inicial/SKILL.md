---
name: configuracion-inicial
description: Deja la computadora de un editor de Elevate lista para editar con Claude — instala las skills del repo elevate-edicion (las base + las de SUS clientes), encuentra dónde guarda cada editor sus carpetas de clientes, música, SFX y stock (cada uno las tiene en lugares distintos y no tiene los mismos archivos), arma ~/.claude/elevate/config.json con esas rutas y lo que le falta, revisa las herramientas (ffmpeg, Whisper, Node/Remotion, Python) y le explica cómo trabajar. Funciona en Mac y Windows. Usar SIEMPRE que el editor diga "configurá mi compu", "instalá las skills", "primera vez", "estoy empezando", "sumá el cliente X a mis skills", "cambié de disco / moví mis carpetas", "actualizá las skills", o cuando otra skill necesite config.json y no exista.
---

# Configuración inicial del editor

El objetivo es que el editor **no tenga que saber nada técnico**: Claude hace todo, pregunta solo lo que no puede averiguar y explica en criollo lo que hizo. Hablarle como a un compañero, sin jerga ("enlace", "variable", "JSON" solo si pregunta).

Antes de cambiar algo en su máquina, decirle qué vas a hacer. No borrar nunca nada: lo que se reemplaza se mueve a un backup.

## Modos
- **Primera vez**: pasos 1 → 8.
- **Sumar o quitar un cliente**: pasos 3 y 4 para ese cliente, y actualizar `config.json`.
- **Cambió de disco o movió carpetas**: paso 4 y actualizar `config.json`.
- **Actualizar skills**: `git pull` en el repo (paso 1). Como las skills son enlaces, no hay que reinstalar. Si hay clientes nuevos en el repo, ofrecerle sumarlos.

## 1. Ubicar el repo
- El repo es la carpeta `elevate-edicion`, la que tiene `base/` y `clientes/`. Si Claude se abrió dentro de ella, es la carpeta actual. Si no, resolverla desde el enlace de esta skill (`~/.claude/skills/configuracion-inicial`) o preguntarle dónde la descargó.
- Si la descargó como .zip sin git, sugerirle clonarlo con git para poder actualizarlo (`git clone <url>`). La URL la tiene el coordinador.
- Detectar el sistema: Mac (`uname`) o Windows (`ver` / PowerShell).

## 2. Conocer al editor
Preguntar en un solo mensaje:
- Su nombre.
- **Con qué clientes trabaja.** Mostrarle la lista de `clientes/` con nombres legibles ("Dairon Rubio (DAI)", no `dairon-rubio-brand`). Puede elegir varios o "todos".

## 3. Instalar las skills
Siempre las de `base/` (edicion-reels-base, portadas-reels, configuracion-inicial, crear-skill-cliente) + los clientes elegidos. Si eligió `portadas-reels` sin `paola-jimenez-brand`, sumarla igual: el script de portadas usa su tipografía Poppins por defecto.

Se instalan como **enlaces** a la carpeta del repo, no como copias. Así, `git pull` las actualiza y lo que mejore el editor queda listo para compartir.
- Carpeta de skills: Mac `~/.claude/skills/` · Windows `%USERPROFILE%\.claude\skills\`.
- Si ya existe una carpeta real con ese nombre, moverla a `~/.claude/skills-backup-<AAAAMMDD-HHMM>/`. Si es un enlace viejo, reemplazarlo.
- Mac: `ln -s "<repo>/clientes/<skill>" ~/.claude/skills/<skill>`
- Windows (junction, no pide administrador): `cmd /c mklink /J "%USERPROFILE%\.claude\skills\<skill>" "<repo>\clientes\<skill>"`

## 4. Encontrar su material
Cada editor guarda las cosas en lugares distintos, y **no todos tienen los mismos archivos**. Buscar primero y preguntar después, mostrándole lo que encontraste para que confirme.

**Dónde buscar** (sin recorrer todo el disco, máximo 3–4 niveles):
- Mac: `/Volumes/*`, `~/Library/CloudStorage/GoogleDrive-*/`, `~/Google Drive*`, `~/Desktop`, `~/Documents`, `~/Movies`.
- Windows: las unidades `D:\`, `E:\`, etc., `G:\` (Google Drive), `%USERPROFILE%\Desktop`, `Documents`, `Videos`.

**Qué buscar**
| Marcador | Pistas | Si no lo encuentra |
|---|---|---|
| `CLIENTES` | carpeta con subcarpetas de clientes (`02 Elevate`, `Clientes`, nombres como "85 Dairon Rubio") | Obligatorio: preguntarle |
| `HERRAMIENTAS` | `Herramientas Edicion`, con `_INDICE/`, `Stock Musica/`, `SFX/` | `null` |
| `SFX` | `SFX/`, `Sonidos`, `Efectos` (whoosh, pop, riser) | `null` |
| `SFX_ENVATO` | carpetas con archivos `envato-*` | `null` |
| `MUSICA` | música fuera de `HERRAMIENTAS` | `null` |
| `STOCK` | video de stock fuera de `HERRAMIENTAS` | `null` |

**Carpeta de cada cliente**: buscarla dentro de `CLIENTES` por nombre, sin importar números, tildes ni mayúsculas ("85 Dairon Rubio", "Dairon", "DAI - Dairon Rubio"). Si hay dudas o no aparece, preguntarle. Puede no tenerla todavía: queda `null` y se le pide al editar.

**Inventario**: contar lo que hay en cada biblioteca (cantidad de temas, SFX y clips de stock) y ver si existen los catálogos `_INDICE/musica_catalogo.csv` y `stock_video_catalogo.csv`. Guardar en `faltantes` lo que mencionan las skills y él no tiene, para que Claude lo sepa al editar sin volver a buscar.

## 5. Escribir `~/.claude/elevate/config.json`
```json
{
  "editor": "Emi",
  "sistema": "mac",
  "repo": "/Users/emi/elevate-edicion",
  "actualizado": "2026-10-08",
  "rutas": {
    "CLIENTES": "/Volumes/Disco Emi/Elevate",
    "HERRAMIENTAS": "/Volumes/Disco Emi/Herramientas Edicion",
    "SFX": "/Volumes/Disco Emi/Herramientas Edicion/SFX",
    "SFX_ENVATO": null,
    "MUSICA": null,
    "STOCK": null
  },
  "clientes": {
    "dairon-rubio-brand": { "carpeta": "/Volumes/Disco Emi/Elevate/85 Dairon Rubio" },
    "paola-jimenez-brand": { "carpeta": null }
  },
  "inventario": { "musica": 412, "sfx": 230, "stock": 0, "catalogos_indice": false },
  "faltantes": ["SFX de Envato", "catálogos _INDICE (buscar a mano en la biblioteca)", "stock de video"]
}
```
- En Windows, rutas con `/` o `\\` (JSON válido). Leerlo de vuelta para confirmar que es JSON válido.
- Las skills usan estos marcadores (`{CARPETA_CLIENTE}`, `{HERRAMIENTAS}`, `{SFX}`…). La tabla está en la regla 0 de `edicion-reels-base`.

## 6. Herramientas
Correr el chequeo (Mac `python3`, Windows `py`):
```
python3 ~/.claude/skills/configuracion-inicial/scripts/verificar_entorno.py
```
Mostrarle lo que falta y **pedirle permiso antes de instalar**. Cómo instalarlo:

| Falta | Mac | Windows |
|---|---|---|
| ffmpeg / ffprobe | `brew install ffmpeg` | `winget install Gyan.FFmpeg` |
| git | viene con las Command Line Tools (`xcode-select --install`) | `winget install Git.Git` |
| Node (npx) | `brew install node` | `winget install OpenJS.NodeJS.LTS` |
| whisper-cli | `brew install whisper-cpp` | binario de los releases de whisper.cpp en GitHub, agregado al PATH |
| modelo Whisper | descargar `ggml-large-v3-turbo.bin` (Hugging Face, `ggerganov/whisper.cpp`) a `~/.cache/whisper/` | igual, en `%USERPROFILE%\.cache\whisper\` |
| `~/venvs/align` | `python3 -m venv ~/venvs/align && ~/venvs/align/bin/pip install torch torchaudio numpy pillow opencv-python` | `py -m venv %USERPROFILE%\venvs\align` y `...\Scripts\pip install ...` |
| Homebrew (Mac) | se instala desde brew.sh: pedirle que pegue el comando él, porque pide su contraseña | — |

Si algo pide su contraseña o permisos de administrador, darle el comando para que lo corra él. Volver a correr el chequeo al terminar.

## 7. Prueba
Con una de sus skills de cliente: generar un frame de prueba 1080×1920 con un subtítulo en la tipografía del cliente (PIL alcanza) y mostrárselo. Si tiene un video del cliente a mano, medirlo con `ffprobe`. Así se confirma que fuentes, rutas y herramientas responden.

## 8. Explicarle cómo sigue
Un resumen corto:
- Qué se instaló (skills base + sus clientes), qué rutas encontró y **qué no tiene** (y qué pasa entonces: por ejemplo, "no tenés la biblioteca de SFX de Envato, voy a usar la tuya de `SFX`").
- Cómo se usa: abrir Claude en la carpeta del video y pedir normal ("editá el reel de Paola que está en VIDEOS"). Las skills se cargan solas.
- Para cliente nuevo: "creá la skill del cliente X" (skill `crear-skill-cliente`).
- Para traer las mejoras del equipo: "actualizá las skills".
- Para compartir una corrección que vale para todos los videos de un cliente: pedirle a Claude que la guarde en la skill del cliente y que la suba al repo en una rama nueva (no directo a `main`). Los cambios a `base/` los revisa el coordinador.
- Si algo de su máquina cambia (disco nuevo, carpeta movida): "actualizá mi configuración".
