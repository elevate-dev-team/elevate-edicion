# Elevate · Skills de edición de video

Skills de Claude Code que usan los editores de Elevate para editar reels, pautas y portadas. Funcionan en **Mac y Windows**.

> Uso interno del equipo de Elevate.

## Empezar (una vez por computadora)

Pegá en Claude (pestaña **Code**, cualquier carpeta) el prompt de instalación que te pasa el coordinador. No hace falta tener git: Claude descarga el repo, instala lo que falte y te guía.

A mano, si preferís: descargá el [.zip](https://github.com/elevate-dev-team/elevate-edicion/archive/refs/heads/main.zip), descomprimilo como `elevate-edicion` en tu carpeta de usuario, abrí Claude en esa carpeta y escribile "Configurá mi computadora para editar con Claude".

Claude instala las skills base y las de **tus** clientes, encuentra dónde tenés tus carpetas de clientes, música, SFX y stock (aunque no tengas lo mismo que los demás), revisa las herramientas (ffmpeg, Whisper, Node, Python) y te explica qué hizo. Antes de instalar algo te pide permiso.

## Qué hay

```
base/                     se instalan siempre
  edicion-reels-base/     reglas obligatorias para cualquier video vertical
  portadas-reels/         portadas 9:16
  configuracion-inicial/  instala y configura la máquina de cada editor
  crear-skill-cliente/    arma la skill de marca de un cliente nuevo (+ plantilla)
clientes/
  <nombre>-brand/         una skill por cliente: SKILL.md, assets/ (fuentes, paleta,
                          logos), references/, scripts/, template/ (Remotion)
CLAUDE.md                 instrucciones para Claude cuando se abre en este repo
```

El repo guarda **solo las skills**. Los videos, proyectos y renders quedan en el disco de cada editor o en Drive.

### Rutas: cada editor tiene su material en otro lado
Las skills no tienen rutas fijas. Usan marcadores como `{CARPETA_CLIENTE}`, `{HERRAMIENTAS}` o `{SFX}`, que Claude resuelve con `~/.claude/elevate/config.json`, el archivo que arma la configuración inicial en cada máquina. Si un editor no tiene un recurso (por ejemplo, la biblioteca de SFX de Envato), Claude lo sabe y usa una alternativa.

## Uso diario

| Querés… | Decile a Claude |
|---|---|
| Editar un video | "Editá el reel de Paola que está en VIDEOS" (abriendo Claude en la carpeta del video) |
| Traer las mejoras del equipo | "Actualizá las skills" |
| Sumar un cliente que ya está en el repo | "Sumá a Dairon Rubio a mis skills" |
| Crear la skill de un cliente nuevo | "Creá la skill del cliente X" |
| Moviste carpetas o cambiaste de disco | "Actualizá mi configuración" |

## Compartir mejoras

Las skills están instaladas como **enlaces** a este repo, así que cuando Claude guarda una corrección en la skill de un cliente, el cambio ya está en el repo. Para compartirlo:

> Subí al repo los cambios de la skill de Dairon en una rama nueva y abrí el Pull Request.

- Un tema por cambio, con el motivo (qué se pidió y en qué pieza).
- Nunca directo a `main`: el coordinador revisa y aprueba.
- Los cambios en `base/` afectan a todos los clientes: proponerlos aparte.
