# FRI — Biblioteca (música, SFX, stock)

Sacado de los `.prproj` de las piezas aprobadas. Si un archivo no está en tu máquina, buscar uno equivalente con el mismo carácter.

## Música (Motion Array)
Se descargan desde la extensión de Motion Array y quedan en `PROYECTO/Motion Array Library/Music/<id>/` de cada pieza.

| Tema | Carácter | Pieza |
|---|---|---|
| *Summer Waves* | funk / house soleado | A. Vistalba |
| *Neon Sparkles* | funk / disco liviano | B. Carrodilla |
| *Upbeat Fashion Lounge House* | house upbeat | C. Palmares |
| *Models* | funk / house con groove | D. La seña |
| *Evening Cocktail Groove* (Adobe Stock) | groove lounge | 10-06 Ponele cara al equipo |
| *This Is Your Story* | corporate inspirador | E. Luján 85 / 07-02 |
| *Opening Up New Possibilities* | corporate | 14-01 Por qué todos quieren vivir en Chacras |
| *Inspire The World* | corporate inspirador, 115 BPM, sin voz en todo el tema | 03-10 Chacras / I. Captación alquiler (desde 10,446 s) |

**Voz cantada (medida con `vocales.py`, 2026-11-05):** *Models* tiene chops de voz entre 9 y 27 s (ventanas a −9/−18 dB) → no usar sin recortar; *Neon Sparkles* limpio de 0 a 36 s, dudoso en 37–48 y 81–87 s; *Summer Waves* limpio de 2 a 49 s; *Upbeat Fashion Lounge House* con voz en 17–19 s.

Regla: **tour house → funk / house upbeat**; piezas institucionales o más sobrias → corporate.

## SFX
| Sonido | Dónde | Uso |
|---|---|---|
| *CashMoney Sound Effect.mp3* | `{SFX}/` | Entrada del precio |
| *Eye Wink Sound Effect.mp3* | `{SFX}/` | Palabra clave / dato |
| *Mouse Click Sound Effect.mp3*, *CLICK.mp3* | `{SFX}/` | Subtítulo-golpe, enumeraciones |
| *envato-DB6WKRP-Woosh 03.mp3* | `{SFX}/` | Whip |
| *1-camera-click.mp3*, *photo-click.mp3* | carpeta `PERSONAL/NUEVOS` del editor | Al mostrar ambientes |
| *Swoosh 04 - 02*, *Swoosh Transition 03 / 28*, *Transition Complex 14* | Animation Composer (`PROYECTO/Animation Composer/Packs/Assets/`) | Cada transición whip/zoom |

## Transiciones y overlays
- Presets de **Animation Composer** (whip / zoom con Mirror + Lens Distortion + Motion Blur).
- MOGRT **Generated Light Leak 1** y **9** (1080×1920), en `PROYECTO/Motion Graphics Template Media/`.

## Stock
- Propio del cliente primero: **drone del barrio** y recorrido (vienen en `VIDEOS/` o `RECURSOS/`, ej. `RECURSOS/BARRIO PALMARES.mp4`).
- Banco del editor (`BANCO DE VIDEOS REAL STATE`): *CALCULADORA 3* tiembla mucho (no usar; *CALCULADORA* desde 18 s es la alternativa estable), *DOLARES*, *DINERO 6*, *FIRMA*, *FIRMA 3*, *FIRMA CONTRATOS*, *CONTRACT*, *PLANOS*, *LLAVES 2 / 8*, *escribir*, *REALTOR*, *Agente Bienes Raices*.
- Evitar *CIUDAD BS AS* para Mendoza: buscar drone de Mendoza / cordillera.
