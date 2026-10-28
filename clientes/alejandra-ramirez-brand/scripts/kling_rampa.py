"""Clips de Kling (o cualquier clip generado por IA) → 1080×1920, 30 fps, sin audio, acelerados con rampa.
Uso: <python del entorno align> kling_rampa.py <entrada.mp4> <salida.mp4> <duración_salida_s>
La rampa arranca más rápida y frena al final (regla 10 de edicion-reels-base) para que el remate se lea:
src = D·g(u), g(u) = A·u + (1−A)·(1−(1−u)²). Con A = 0,7 y 6,04 → 4,8 s: ~1,6× al arranque, ~0,9× al final.
Caso real: AR 23-10 (28-10-2026), muebles que se arman, 6,04 → 4,8 s = 8 tiempos a 100 BPM; aprobado.
Cada cuadro de salida mezcla los dos cuadros de la fuente más cercanos (la fuente es de 24 fps)."""
import subprocess, sys, json, numpy as np
src, dst, OUT = sys.argv[1], sys.argv[2], float(sys.argv[3])
FPS, W, H, A = 30, 1080, 1920, 0.7
info = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=r_frame_rate,nb_frames',
                                  '-of', 'json', src], capture_output=True, text=True).stdout)['streams'][0]
n, sfps = int(info['nb_frames']), eval(info['r_frame_rate'])
dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-vf', f'scale=-2:{H}:flags=lanczos,crop={W}:{H}',
                        '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-an', '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', dst], stdin=subprocess.PIPE)
SZ = W * H * 3
buf, k = {}, -1
def frame(i):
    global k
    while k < i:
        raw = dec.stdout.read(SZ)
        if len(raw) < SZ: break
        k += 1; buf[k] = np.frombuffer(raw, np.uint8).reshape(H, W, 3)
        for j in [j for j in buf if j < k - 2]: del buf[j]
    return buf[min(i, k)]
NO = int(round(OUT * FPS))
for i in range(NO):
    u = i / (NO - 1)
    p = ((A * u + (1 - A) * (1 - (1 - u) ** 2)) * (n - 1))
    a = int(np.floor(p)); w = p - a
    fa = frame(a).astype(np.float32); fb = frame(min(a + 1, n - 1)).astype(np.float32)
    enc.stdin.write(((1 - w) * fa + w * fb + 0.5).astype(np.uint8).tobytes())
enc.stdin.close(); enc.wait(); dec.terminate()
print(dst, NO, 'cuadros')
