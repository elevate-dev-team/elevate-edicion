#!/usr/bin/env python3
"""
Seguimiento de la cara del speaker (Vision de macOS) sobre el video YA cortado.
  python3 track_face.py <cut.mp4> <salida faces.json>
Descarta caras de pósters/cuadros del fondo (quedarse con la trayectoria continua,
más cercana a la anterior) y suaviza con media móvil de 1 s.
Salida: [[t, cx, cy, w, h], ...] normalizados (origen arriba-izquierda), para src/data/faces.json.
"""
import json, os, subprocess, sys, tempfile
src, out = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))
raw = tempfile.mktemp(suffix='.json')
subprocess.run(['swift', os.path.join(here, 'faces.swift'), src, '0.2', raw], check=True, stderr=subprocess.DEVNULL)
rows = json.load(open(raw))
prev, trk = None, []
for r in rows:
    cands = [r[i:i + 4] for i in range(1, len(r), 4)]
    # filtro de pósters: ajustar si el speaker no está centrado
    cands = [c for c in cands if 0.25 < c[0] < 0.8 and c[1] > 0.2]
    if not cands:
        continue
    c = min(cands, key=lambda c: ((c[0] - prev[0]) ** 2 + (c[1] - prev[1]) ** 2) if prev else -c[2])
    prev = c
    trk.append([round(r[0], 2)] + [round(x, 4) for x in c])
sm = []
for i, x in enumerate(trk):
    win = trk[max(0, i - 2):i + 3]
    sm.append([x[0]] + [round(sum(w[k] for w in win) / len(win), 4) for k in range(1, 5)])
json.dump(sm, open(out, 'w'))
print('muestras:', len(sm), '(sin cara en', len(rows) - len(trk), ')')
