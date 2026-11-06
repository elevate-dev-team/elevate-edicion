# Plantilla pauta de ROC (pieza K, 02-11 Grace Townhomes)
Pauta de propiedad: hook y CTA a cámara, voz en off sobre el recorrido, cifras sobre B-roll luminoso (sin velo), placa y lista con íconos sobre B-roll.
- `cortes.py`: segmentos de voz (tiempos de la fuente) en la grilla de 25 fps → `cortes.json` + voz cruda montada para el editor.
- `track.swift`: cara por cuadro (Vision) → `tr_<toma>.txt` (compilar con `swiftc -O track.swift -o track`).
- `gen.py`: palabras alineadas (MMS) → línea de tiempo, planos, eventos por palabra, títulos y subtítulos → `data.json`.
- `Video-pauta.tsx`: componentes Hook, Precio, Dato, Ubicacion, Cifra, Golpe, Placa (tasa + checks), Cerca (lista con íconos), Cta.
- `mezcla.py`: voz del editor + música con hueco de EQ + SFX con el pico alineado, master −11.
- `portada.py`: portada en PIL con el sistema J (velo verde arriba, texto suelto arriba de la cabeza).
Render con `--public-dir` chico (solo la carpeta del video) y `remotion bundle` una vez para los stills. Rutas absolutas de la máquina de Tomi: cambiarlas antes de usar.
