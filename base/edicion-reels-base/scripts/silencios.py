"""Silencios reales dentro de una toma y cortes "al final del habla" (regla 4, cortes precisos).

  <python del entorno align> silencios.py <toma.(mov|wav)> <inicio_habla_s> <fin_habla_s> [min_s=0.18] [cola_s=0.03] [pre_s=0.03]

- inicio/fin_habla: primera y última palabra de la toma (de alinear.py, o a mano si antes hay ruido de manos/celular).
- Mide la energía en la banda de la voz (200–4000 Hz, ventanas de 10 ms). El umbral es piso + 35 % del rango
  piso→percentil 90 de la toma, así funciona con el ruido del auto o de la calle.
- Todo silencio de ≥ min_s se corta: el tramo anterior termina cola_s después de la última sílaba y el siguiente
  arranca pre_s antes de la próxima. La toma sale 0,04 s después de la última voz.
- Imprime los silencios y los tramos [inicio, fin] para montar (tiempos de la toma).

Caso real: ROC 21-11 (2026-11-05). Con pausas recortadas solo si pasaban 0,35 s y colas de ~0,15 s (energía + MMS),
el editor dijo "encuentro demasiados silencios, cortá siempre cuando ella termine de hablar". Con min 0,18 s, cola y
pre de 0,03 s, el reel bajó de 51,6 a 49,2 s, quedaron solo pausas de 0,10–0,18 s y se aprobó. Cada corte nuevo
dentro de un plano a cámara va tapado con un punch-in alternado (ojos en el mismo punto) o con B-roll.
"""
import subprocess, sys
import numpy as np

src, a0, a1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
MIN = float(sys.argv[4]) if len(sys.argv) > 4 else 0.18
COLA = float(sys.argv[5]) if len(sys.argv) > 5 else 0.03
PRE = float(sys.argv[6]) if len(sys.argv) > 6 else 0.03
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-af', 'highpass=f=200,lowpass=f=4000', '-ac', '1', '-ar', '16000',
                      '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32); st = 160; n = len(x) // st
db = 20 * np.log10(np.sqrt((x[:n * st].reshape(n, st) ** 2).mean(1)) + 1e-9)
i0, i1 = max(0, int((a0 - 0.3) * 100)), min(n, int((a1 + 0.5) * 100))
loc = np.sort(db[i0:i1]); fl, pk = loc[len(loc) // 10], loc[int(len(loc) * 0.9)]
v = db > fl + 0.35 * (pk - fl)
s = max(i0, int(a0 * 100) - 5); s = next(i for i in range(s, i1) if v[i]); e = max(i for i in range(i0, i1) if v[i])
sil, k = [], s
while k <= e:
    if not v[k]:
        j = k
        while j <= e and not v[j]: j += 1
        if (j - k) / 100 >= MIN: sil.append((k / 100, j / 100))
        k = j
    else: k += 1
print(f'piso {fl:.0f} dB · voz {s / 100:.2f}–{(e + 1) / 100:.2f} s · silencios ≥ {MIN} s:', [(p, q, round(q - p, 2)) for p, q in sil])
tr, t = [], s / 100 - PRE
for p, q in sil:
    tr.append([round(t, 3), round(p + COLA, 3)]); t = q - PRE
tr.append([round(t, 3), round((e + 1) / 100 + 0.04, 3)])
print('tramos', tr)
