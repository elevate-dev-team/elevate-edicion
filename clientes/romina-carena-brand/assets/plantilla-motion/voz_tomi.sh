# Voz mejorada por Tomi → ganancia a −20, compresión suave, control de picos sobremuestreado, ganancia a TARGET, limitador lento.
IN="$1"; OUT="$2"; TARGET="${3:--12}"
I=$(ffmpeg -nostats -i "$IN" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
G1=$(python3 -c "print(-20-($I))")
ffmpeg -v error -y -i "$IN" -af "aresample=48000,volume=${G1}dB,acompressor=threshold=-26dB:ratio=2.2:attack=15:release=160:knee=6:makeup=1,aresample=192000,acompressor=threshold=-9dB:ratio=4:attack=2:release=120:knee=4:detection=peak:makeup=1,aresample=48000" -c:a pcm_f32le _v1.wav
I2=$(ffmpeg -nostats -i _v1.wav -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
G2=$(python3 -c "print($TARGET-($I2))")
ffmpeg -v error -y -i _v1.wav -af "volume=${G2}dB" -c:a pcm_f32le _v2.wav
ffmpeg -v error -y -i _v2.wav -af "aresample=192000,alimiter=limit=0.89:attack=5:release=150:level=disabled,aresample=48000" -c:a pcm_f32le "$OUT"
echo "entrada $I LUFS · ganancia1 $G1 · tras comp $I2 · ganancia2 $G2"
