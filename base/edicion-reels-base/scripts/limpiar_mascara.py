"""Limpia la máscara de rotoscopia (roto_video.swift) y mide el tope del pelo cuadro a cuadro.

  <python del entorno align> limpiar_mascara.py <mascara.mov> <track_cara.txt> <salida_mascara.raw> <pelo.json>

- mascara.mov: salida de roto_video.swift sobre el plano base SIN zoom (1080×1920).
- track_cara.txt: salida de track_cara.swift sobre el mismo video, a los mismos fps (una línea por cuadro).
- Deja solo la silueta más grande (dilatada 25 px para no comer bordes) y borra lo que asoma por encima de la
  cabeza (más de 0,6 alturas de cara sobre la frente, o fuera de ±1 ancho de cara a los costados).
- salida_mascara.raw: gris 8 bits crudo. Recorte con alfa:
    ffmpeg -i base.mp4 -f rawvideo -pix_fmt gray -s 1080x1920 -r <fps> -i salida_mascara.raw \
      -filter_complex "[0][1]alphamerge,format=yuva444p10le" -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le fg.mov
- pelo.json: y del tope del pelo por cuadro (px del video, mediana de 5), para ubicar títulos detrás de la cabeza.
Caso real: DC 07-10 (2026-10-19). Una baranda de escalera pegada a la cabeza entraba en la máscara y habría partido
el título "2024"; la caja de la cara de Vision quedaba 45–80 px por debajo del pelo real.
"""
import json, subprocess, sys
import numpy as np, cv2

mask_path, track_path, out_path, hair_path = sys.argv[1:5]
W, H = 1080, 1920
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', mask_path, '-vf', 'format=gray', '-f', 'rawvideo', '-'],
                     capture_output=True, check=True).stdout
m = np.frombuffer(raw, np.uint8).reshape(-1, H, W).copy()

# track_cara: t caraCx caraTop caraBottom caraAncho ojoX ojoY (nan si no detectó) → interpolar huecos
rows = [l.split() for l in open(track_path)]
cols = np.full((len(rows), 4), np.nan)
for i, r in enumerate(rows):
    if len(r) == 7: cols[i] = [float(x) for x in r[1:5]]
x = np.arange(len(cols))
for c in range(4):
    ok = ~np.isnan(cols[:, c])
    cols[:, c] = np.interp(x, x[ok], cols[ok, c]) if ok.any() else (W / 2, H / 3, H / 2, 200)[c]

hair = []
for i in range(len(m)):
    cx, top, bot, fw = cols[min(i, len(cols) - 1)]
    b = (m[i] > 128).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(b, 8)
    if n > 1:
        k = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
        keep = cv2.dilate((lab == k).astype(np.uint8), np.ones((25, 25), np.uint8))
        m[i] = (m[i] * keep).astype(np.uint8)
    g = m[i]
    g[:max(0, int(top - 0.6 * (bot - top)))] = 0
    x0, x1 = max(0, int(cx - fw)), int(cx + fw)
    g[:int(top), :x0] = 0
    g[:int(top), x1:] = 0
    r = np.flatnonzero((g[:, x0:x1] > 128).any(1))
    hair.append(int(r[0]) if len(r) else int(top - 0.4 * (bot - top)))

h = np.array(hair, float)
hair = [round(float(np.median(h[max(0, k - 2):k + 3]))) for k in range(len(h))]
m.tofile(out_path)
json.dump(hair, open(hair_path, 'w'))
print(f'{len(m)} cuadros · pelo min {min(hair)} max {max(hair)} → {out_path}, {hair_path}')
