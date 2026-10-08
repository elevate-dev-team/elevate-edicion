#!/bin/zsh
# Normaliza el render de Remotion a -13 LUFS / -1 dBTP (estándar Reels/TikTok/Shorts)
# sin recomprimir el video.
#   finalize.sh <render_remotion.mp4> <salida_final.mp4>
set -e
IN="$1"; OUT="$2"
J=$(ffmpeg -hide_banner -i "$IN" -af loudnorm=I=-13:TP=-1.0:LRA=9:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
MI=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
# ojo: en zsh "$MI:l..." aplica un modificador; por eso ${MI}
ffmpeg -v error -y -i "$IN" -c:v copy -af "loudnorm=I=-13:TP=-1.0:LRA=9:${MI}:linear=true,aresample=48000" \
  -c:a aac -b:a 320k -movflags +faststart "$OUT"
ffmpeg -hide_banner -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
