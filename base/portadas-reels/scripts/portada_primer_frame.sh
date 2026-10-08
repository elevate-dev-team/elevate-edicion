#!/bin/bash
# Pone la portada como PRIMER FRAME del video final (frame 0 = portada; el resto, igual), sin cambiar duración,
# cantidad de frames ni audio. Así la portada queda como miniatura por defecto al subir el reel.
#   portada_primer_frame.sh <video_sin_audio_o_con.mov> <portada.jpg> <audio_master.wav> <salida.mp4> [fps=30]
# Caso real: PAO 10-09 "HOA y CDD no son lo mismo" (2026-10-05). Con -loop 1 + -shortest se perdía el último frame:
# por eso la portada se repite con el filtro loop y el overlay corta con el video (shortest=1).
set -e
V="$1"; P="$2"; A="$3"; O="$4"; FPS="${5:-30}"
ffmpeg -v error -y -i "$V" -i "$P" -i "$A" -filter_complex \
 "[1:v]scale=1080:1920,format=yuv420p,loop=loop=-1:size=1:start=0,setpts=N/${FPS}/TB[p];[0:v][p]overlay=0:0:enable='eq(n,0)':shortest=1:eof_action=pass[v]" \
 -map "[v]" -map 2:a -c:v libx264 -crf 17 -preset slow -pix_fmt yuv420p -c:a aac_at -b:a 256k -movflags +faststart "$O"
echo "frames: $(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 "$O") (comparar con el video de entrada)"
