"""Mide la caja REAL del texto de una portada (letras + sombra) y la compara con el cuadrado central.

  python3 medir_texto.py <portada_solo_texto.png> [margen_minimo=100]

La imagen tiene que ser la portada renderizada SOLO con el texto sobre negro (prop soloTexto en la plantilla).
Cuadrado central del feed: x 0–1080, y 420–1500 (en 1080x1920). Imprime los márgenes a cada borde y OK/NO.
"""
import subprocess, sys

png = sys.argv[1]; MIN = int(sys.argv[2]) if len(sys.argv) > 2 else 100
W, H, SQ_TOP, SQ_BOT = 1080, 1920, 420, 1500
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', png, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True, check=True).stdout
xs, ys = [], []
for y in range(H):
    row = raw[y * W:(y + 1) * W]
    hit = [x for x in range(W) if row[x] > 8]   # > 8 incluye la sombra suave
    if hit: xs += [hit[0], hit[-1]]; ys.append(y)
if not ys: sys.exit('no encontré texto (¿render con soloTexto?)')
x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
m = {'izq': x0, 'der': W - 1 - x1, 'arriba': y0 - SQ_TOP, 'abajo': SQ_BOT - y1}
ok = min(m.values()) >= MIN
print(f'texto x {x0}–{x1}, y {y0}–{y1} · márgenes al cuadrado: ' + ', '.join(f'{k} {v}' for k, v in m.items()) + f' → {"OK" if ok else "NO"} (mínimo {MIN} px)')
sys.exit(0 if ok else 1)
