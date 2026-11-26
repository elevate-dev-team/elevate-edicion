#!/usr/bin/env bash
# Carrusel FM de tendencia "dos fotos + flecha" (1122×1402). Ver SKILL.md §13.
#   carrusel_dos_fotos.sh nuevo  <carpeta>                    crea <carpeta>/proyecto (plantilla = carrusel aprobado "No tenés que… / Empezá…")
#   carrusel_dos_fotos.sh render <carpeta>/proyecto <salida>  saca "placa N.png" de cada placa del objeto S + vista-previa.jpg
# Las placas se editan en proyecto/index.html (objeto S: foto, tamaño, encuadre y texto de cada mitad).
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
case "${1:-}" in
nuevo)
  P="$2/proyecto"; mkdir -p "$P/fotos"
  cp "$HERE/assets/carrusel-dos-fotos/index.html" "$P/"
  cp -R "$HERE/assets/carrusel-dos-fotos/fonts" "$P/fonts"   # misma versión de Montserrat que el carrusel aprobado
  echo "Proyecto en $P — fotos en fotos/ (HEIC → sips -s format jpeg -s formatOptions 92 -Z 2400) y editá el objeto S de index.html";;
render)
  P="$(cd "$2" && pwd)"; O="$3"; mkdir -p "$O"; files=()
  for n in $(grep -oE '^ *[0-9]+:\{' "$P/index.html" | tr -dc '0-9\n'); do
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
      --force-device-scale-factor=1 --window-size=1122,1402 --virtual-time-budget=4000 \
      --screenshot="$O/placa $n.png" "file://$P/index.html?s=$n" >/dev/null 2>&1
    files+=("$O/placa $n.png"); done
  in=(); for f in "${files[@]}"; do in+=(-i "$f"); done
  ffmpeg -v error -y "${in[@]}" -filter_complex "hstack=inputs=${#files[@]},scale=-1:450" "$O/vista-previa.jpg"
  echo "${#files[@]} placas en $O";;
*) sed -n '2,6p' "$0"; exit 1;;
esac
