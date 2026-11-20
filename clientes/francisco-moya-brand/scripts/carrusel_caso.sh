#!/usr/bin/env bash
# Carrusel FM "caso de éxito" (1080×1350). Ver SKILL.md §12.
#   carrusel_caso.sh nuevo  <carpeta>                  crea <carpeta>/proyecto con la plantilla (s1–s6 del 14 ventas como punto de partida)
#   carrusel_caso.sh render <carpeta>/proyecto <salida> renderiza cada sN.html a <salida>/N.png + vista-previa.jpg
#   carrusel_caso.sh video  <carpeta>/proyecto <salida> N <video> <y> <inicio> <dur>
#        placa N sobre video: escala a 1080 de ancho, recorta 1350 desde y, texto encima (overlay PNG transparente), sin audio
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
R=(--headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=3000 --window-size=1080,1350)
case "${1:-}" in
nuevo)
  P="$2/proyecto"; mkdir -p "$P/img"
  cp "$HERE/assets/carrusel-caso/base.css" "$HERE/assets/carrusel-caso/fit.js" "$P/"
  cp "$HERE/assets/carrusel-caso/elevate-blanco.svg" "$P/img/"
  cp -R "$HERE/assets/fonts" "$P/fonts"
  cp "$HERE/assets/carrusel-caso/ejemplo-14-ventas/"s*.html "$P/"
  echo "Proyecto en $P — poné las fotos en img/ (JPG, HEIC→ sips -s format jpeg -Z 2600) y editá s1–sN.html";;
render)
  P="$(cd "$2" && pwd)"; O="$3"; mkdir -p "$O"; files=()
  for f in "$P"/s*.html; do n="$(basename "$f" .html)"; n="${n#s}"
    "$CHROME" "${R[@]}" --screenshot="$O/$n.png" "file://$f" 2>/dev/null; files+=("$O/$n.png"); done
  in=(); for f in "${files[@]}"; do in+=(-i "$f"); done
  ffmpeg -v error -y "${in[@]}" -filter_complex "hstack=inputs=${#files[@]},scale=-1:450" "$O/vista-previa.jpg"
  echo "${#files[@]} placas en $O";;
video)
  P="$(cd "$2" && pwd)"; O="$3"; N="$4"; V="$5"; Y="$6"; SS="$7"; DUR="$8"; mkdir -p "$P/ov" "$O"
  "$CHROME" "${R[@]}" --default-background-color=00000000 --screenshot="$P/ov/ov$N.png" "file://$P/s$N.html?ov" 2>/dev/null
  ffmpeg -v error -y -ss "$SS" -t "$DUR" -i "$V" -i "$P/ov/ov$N.png" \
    -filter_complex "[0:v]scale=1080:-2,crop=1080:1350:0:$Y,fps=30[v];[v][1]overlay=0:0,format=yuv420p" \
    -an -c:v libx264 -crf 17 -preset slow -movflags +faststart "$O/$N.mp4"
  ffmpeg -v error -y -ss 1.5 -i "$O/$N.mp4" -frames:v 1 "$O/$N.png"
  echo "Placa $N en video: $O/$N.mp4 (+ $N.png)";;
*) sed -n '2,7p' "$0"; exit 1;;
esac
