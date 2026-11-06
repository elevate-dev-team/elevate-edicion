"""ROC 02-11 — cortes de voz (tiempos de la fuente) → cortes.json + voz cruda montada.
Silencios ≥ 0,18 s cortados (silencios.py, cola/pre 0,03). Sin "y casas unifamiliares desde los 620,000".
Segmentos ajustados a la grilla de 25 fps."""
import json, subprocess, os, sys
V = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'VIDEOS', '02')
FPS = 25
SRC = {'hook': 'ROMINA HOOK .mp4', 'off': 'IMG_6258.MOV', 'terraza': 'IMG_6255.MOV', 'cta': 'IMG_6256.MOV'}
# (fuente, inicio, fin, tramo)
segs = [
  ('hook', 0.04, 4.12, 'hook'),            # ¿Sabías que existen en Miami-Dade townhouses de cuatro cuartos
  ('hook', 4.68, 10.24, 'hook'),           # un cuarto abajo totalmente independiente | desde $374,990 (off sobre negro desde 7,28)
  ('hook', 14.57, 19.97, 'hook'),          # Y el dato clave… dos años de asociación gratis
  ('off', 2.40, 4.59, 'ubicacion'), ('off', 4.90, 6.61, 'ubicacion'),
  ('off', 7.30, 9.87, 'datos'), ('off', 10.09, 11.49, 'datos'), ('off', 11.79, 13.11, 'datos'),
  ('off', 13.47, 17.06, 'datos'), ('off', 17.47, 19.70, 'datos'),
  ('terraza', 1.61, 8.76, 'terraza'),      # Cuenta con dos puestos… barbecues
  ('off', 20.29, 21.38, 'listos'), ('off', 21.51, 22.25, 'listos'),
  ('off', 23.70, 28.41, 'paquete'), ('off', 28.75, 32.80, 'paquete'), ('off', 34.04, 39.34, 'paquete'),
  ('off', 40.36, 46.43, 'zona'), ('off', 46.71, 51.87, 'zona'), ('off', 51.99, 52.98, 'zona'),
  ('cta', 0.95, 6.16, 'cta'),
]
out, t = [], 0.0
for src, a, b, tramo in segs:
    n = round((b - a) * FPS); b = a + n / FPS
    out.append({'src': src, 'file': SRC[src], 'a': round(a, 4), 'b': round(b, 4), 'frames': n,
                'start_frame': round(t * FPS), 'tramo': tramo}); t += n / FPS
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cortes.json'), 'w'), indent=1, ensure_ascii=False)
print(f'{len(out)} segmentos · {t:.2f} s · {round(t*FPS)} frames')
if len(sys.argv) > 1:   # montar voz cruda
    dst = sys.argv[1]; parts = []
    for i, s in enumerate(out):
        p = f'/tmp/roc0211_seg{i:02d}.wav'; d = s['frames'] / FPS
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(s['a']), '-t', f'{d:.4f}', '-i', os.path.join(V, s['file']),
                        '-map', '0:a:0', '-ac', '1', '-ar', '48000', '-af', f'afade=t=in:d=0.006,afade=t=out:st={d-0.006:.4f}:d=0.006',
                        '-c:a', 'pcm_s24le', p], check=True); parts.append(p)
    lst = '/tmp/roc0211_list.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c:a', 'pcm_s24le', dst], check=True)
    print('voz →', dst)
