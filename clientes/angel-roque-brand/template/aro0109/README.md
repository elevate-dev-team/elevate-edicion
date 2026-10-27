# ARO 01-09 en Remotion (referencia)

Es el código del tour house con voz en off aprobado el 27-10-2026. Sirve como punto de partida, no como plantilla cerrada.

- `Video.tsx` tiene las fuentes (Montserrat + The Seasons), los planos, el **mapa** de Tampa Bay (lat/lon reales → píxeles, I-75, pines, ruta y "15 MIN") y el gráfico de lavadora y secadora. La comp `ARO0109E` muestra solo la estructura, con los cortes.
- `Acabado.tsx` tiene los zooms anclados a los ojos (tracking de `track_cara.swift`), zoom-blur, whip (agranda la imagen mientras se corre), light leaks, títulos con el sistema de la marca (azul con borde, degradés dorado, blanco→azul y blanco→beige, número calado y The Seasons) y subtítulos bajo el mentón o centrados sobre el B-roll. Las líneas se limitan a 720 px con `Fit`.
- Datos que espera (los generan los scripts del `PROYECTO/` del reel): `timeline.json` (`frames`, `segs`, `planos`), `track.json` (cara por toma) y los mp4 en `public/aro0109/`.
- En la carpeta de Remotion compartida, renderizar con `--public-dir` apuntando a una carpeta con solo los archivos del reel y las fuentes (por ejemplo, con hardlinks). Si no, Remotion copia el `public/` entero en cada render.
