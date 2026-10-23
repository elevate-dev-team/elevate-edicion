"""Temblor de cámara de un clip de stock / B-roll, para descartar los que "se ven muy movidos".

  <python del entorno align> temblor.py <clip> [<clip> ...]     (necesita opencv: está en el venv de align)

Mide el desplazamiento global cuadro a cuadro (phase correlation sobre 270×480 en gris) y separa:
- jitter: desvío del desplazamiento respecto de su media móvil de 9 cuadros, en px de un cuadro de 1080 de ancho
  (el temblor de mano). > ~1 px se nota en pantalla.
- deriva: movimiento medio (px/s); un travelling o dolly suave da deriva alta y jitter bajo, y está bien.
Caso real: DC 05-10 (2026-10-23), "no utilices este clip, se ve muy movido": CALCULADORA 3 = 1,37 px (rechazado);
TASADOR = 0,23 px en el original y 0,36 px ya pasado a 30 fps (aprobado como reemplazo); escribir = 0,53 px; DOLARES = 3,11 px.
"""
import sys
import cv2, numpy as np

for p in sys.argv[1:]:
    cap = cv2.VideoCapture(p); fps = cap.get(cv2.CAP_PROP_FPS) or 30; prev = None; d = []
    while True:
        ok, f = cap.read()
        if not ok: break
        g = np.float32(cv2.cvtColor(cv2.resize(f, (270, 480)), cv2.COLOR_BGR2GRAY))
        if prev is not None:
            (dx, dy), _ = cv2.phaseCorrelate(prev, g); d.append((dx, dy))
        prev = g
    if len(d) < 10:
        print(f'{p}: muy corto'); continue
    d = np.array(d); sm = np.array([np.convolve(d[:, i], np.ones(9) / 9, 'same') for i in (0, 1)]).T
    jitter = np.abs(d - sm)[4:-4].mean() * 4  # 270 → 1080
    deriva = np.abs(d.mean(0)).sum() * 4 * fps
    print('%-45s jitter %.2f px  deriva %.1f px/s%s' % (p.split('/')[-1], jitter, deriva, '  ← MOVIDO' if jitter > 1 else ''))
