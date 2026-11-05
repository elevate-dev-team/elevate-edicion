"""Temblor de un clip de stock / B-roll: cuánto "salta" la imagen de un cuadro al siguiente (cámara en mano).

  <python del entorno align> temblor.py <clip.mp4> [desde_s] [dur_s] [<clip2> desde dur ...]

Mide el desplazamiento global entre cuadros consecutivos con correlación de fase (OpenCV, a 270 px de ancho) y
reporta:
  - jitter: media del CAMBIO de desplazamiento entre cuadros (px a 270 de ancho). Es el temblor: un paneo suave
    tiene desplazamiento pero jitter bajo.
  - mov: media del desplazamiento (movimiento de cámara, temblor o paneo).
Referencias medidas: < 0,15 estable · 0,15–0,25 aceptable · > 0,35 se nota tembloroso en el reel.

Caso real: FRI 05-10 Captación alquiler (2026-11-05). El usuario marcó un B-roll "muy tembloroso" (CALCULADORA 3:
jitter 0,54). Se cambió por CALCULADORA desde 18 s (0,21), elegido midiendo 13 candidatos con este script.
Requiere opencv-python y numpy (el entorno align los tiene).
"""
import sys
import cv2
import numpy as np


def temblor(path, t0=0.0, dur=4.0):
    c = cv2.VideoCapture(path)
    fps = c.get(cv2.CAP_PROP_FPS) or 30
    c.set(cv2.CAP_PROP_POS_MSEC, t0 * 1000)
    prev, sh = None, []
    for _ in range(int(dur * fps)):
        ok, fr = c.read()
        if not ok:
            break
        h, w = fr.shape[:2]
        size = (270, int(270 * h / w))
        g = cv2.cvtColor(cv2.resize(fr, size), cv2.COLOR_BGR2GRAY).astype(np.float32)
        if prev is not None:
            sh.append(cv2.phaseCorrelate(prev, g)[0])
        prev = g
    s = np.array(sh)
    if len(s) < 3:
        return float('nan'), float('nan')
    return float(np.abs(np.diff(s, axis=0)).mean()), float(np.abs(s).mean())


args = sys.argv[1:]
i = 0
while i < len(args):
    p = args[i]; t0 = float(args[i + 1]) if i + 1 < len(args) and args[i + 1].replace('.', '').isdigit() else 0.0
    step = 1
    dur = 4.0
    if i + 1 < len(args) and args[i + 1].replace('.', '').isdigit():
        step = 2
        if i + 2 < len(args) and args[i + 2].replace('.', '').isdigit():
            dur = float(args[i + 2]); step = 3
    j, m = temblor(p, t0, dur)
    nota = 'estable' if j < 0.15 else 'aceptable' if j < 0.25 else 'se nota' if j < 0.35 else 'TEMBLOROSO'
    print(f'{p}  desde {t0:g} s  jitter {j:.3f}  mov {m:.3f}  → {nota}')
    i += step
