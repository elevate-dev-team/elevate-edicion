# Repo elevate-edicion

Repositorio de skills de edición de video de Elevate, compartido entre los editores. Estructura y convenciones en `README.md`.

## Si un editor abre Claude en esta carpeta
- Si no existe `~/.claude/elevate/config.json` (Windows: `%USERPROFILE%\.claude\elevate\config.json`) o el editor pide configurar o instalar: leer `base/configuracion-inicial/SKILL.md` y seguirlo. Puede ser que esa skill todavía no esté instalada: leerla directo desde el repo.
- Si pide crear la skill de un cliente: `base/crear-skill-cliente/SKILL.md`.
- Si pide "actualizá las skills": `git pull` en esta carpeta, y ofrecerle los clientes nuevos que haya en `clientes/` y que todavía no tenga instalados.

## Al modificar skills en este repo
- Rutas solo con marcadores (`{CARPETA_CLIENTE}`, `{CLIENTES}`, `{HERRAMIENTAS}`, `{SFX}`, `{SFX_ENVATO}`, `{MUSICA}`, `{STOCK}`), nunca rutas absolutas de una máquina. Los scripts leen `~/.claude/elevate/config.json`.
- Nada de `SKILL.md.bak-*`: el historial lo guarda git.
- Cada cambio en una rama propia + Pull Request, nunca push directo a `main`. Los cambios en `base/` afectan a todos los clientes y los revisa el coordinador.
- No subir videos, audios, proyectos ni renders.
