"""Silencios recortables entre frases de una voz ya montada (para hacer más dinámico un tramo en off sobre B-roll).

  <python del entorno align> silencios.py <voz.wav> <palabras.json> <salida.json> [desde hasta] [fps=25]

- palabras.json: salida de alinear.py sobre esa misma voz (dice DÓNDE hay pausas entre palabras).
- El borde real de cada pausa sale de la ENERGÍA (MMS cierra la última palabra antes de tiempo): desde el fin alineado
  se avanza hasta que la voz cae bajo −42 dBFS, y desde el arranque alineado se retrocede igual.
- Se deja KEEP = 0,06 s a cada lado (≈0,12 s de pausa final) y se saca un número ENTERO de frames, así la imagen y la
  voz pierden lo mismo y todo lo armado sobre la línea vieja (cortes, subtítulos, títulos, SFX) se remapea con
  t_nuevo = t − Σ min(duración_recorte, max(0, t − inicio_recorte)).
- [desde hasta]: limitar a un tramo (ej. solo la voz en off); dentro de un plano a cámara cortar deja un salto.
- Salida: [[inicio_s, fin_s], ...] en tiempo de la voz vieja.
Caso real: ROC 21-12 (2026-10-23), "hay muchos silencios, cortalos": 14 pausas, 3,28 s de 52,5 s, quedó aprobado.
"""
import json, subprocess, sys
import numpy as np

voz, pal, out = sys.argv[1:4]
desde, hasta = (float(sys.argv[4]), float(sys.argv[5])) if len(sys.argv) > 5 else (0.0, 1e9)
fps = float(sys.argv[6]) if len(sys.argv) > 6 else 25.0
TH, KEEP, MIN_GAP = -42, 0.06, 0.25
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', voz, '-ac', '1', '-ar', '16000', '-af', 'highpass=f=150,lowpass=f=4000',
                                  '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
db = 20 * np.log10(np.sqrt(np.convolve(x ** 2, np.ones(160) / 160, 'same')[::160]) + 1e-9)  # cada 10 ms
a = json.load(open(pal))
cuts = []
for p, q in zip(a, a[1:]):
    if q['s'] - p['e'] <= MIN_GAP or p['e'] < desde or q['s'] > hasta:
        continue
    i = int(p['e'] * 100)
    while i < int(q['s'] * 100) and db[i] > TH: i += 1
    j = int(q['s'] * 100)
    while j > i and db[j - 1] > TH: j -= 1
    s0, s1 = i / 100 + KEEP, j / 100 - KEEP
    n = int((s1 - s0) * fps)
    if n >= 2:
        c = (s0 + s1) / 2
        cuts.append([round(c - n / fps / 2, 3), round(c + n / fps / 2, 3)])
        print(f"{p['w']:>14} | silencio {i / 100:.2f}-{j / 100:.2f} ({(j - i) / 100:.2f} s) → saco {n / fps:.2f} s")
print('total', round(sum(b - a for a, b in cuts), 2), 's')
json.dump(cuts, open(out, 'w'))
