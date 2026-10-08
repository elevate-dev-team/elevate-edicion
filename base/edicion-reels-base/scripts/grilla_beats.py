"""Grilla de beats REAL de un tema (para cortar al ritmo). No confiar en el BPM del catálogo: puede estar mal.

  ~/venvs/align/bin/python grilla_beats.py <musica> <desde_s> <hasta_s> [bpm_min bpm_max]

- Mide el tempo y la fase sobre la envolvente de graves (bombo) entre desde/hasta (elegir un tramo con batería
  estable, ej. después del drop). Rango de BPM por defecto 80–160.
- Imprime: BPM, período, primer tiempo y el ERROR de la grilla contra cada golpe real (debe dar ±10 ms).
- Uso: corte k del cuerpo = t_inicio_video + k·período, redondeado a frame. Verificar después en el render con
  detección de escena (ffmpeg select='gt(scene,0.15)') que cada corte cae a < 1/2 frame del tiempo.
Caso real (03-10 LIU): "Drive Me Crazy" figuraba 120 BPM y era 118,0 → con 120 los cortes se corrían ½ tiempo en 19 s.
"""
import subprocess, sys, numpy as np

src, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
lo_bpm, hi_bpm = (float(sys.argv[4]), float(sys.argv[5])) if len(sys.argv) > 5 else (80, 160)
sr = 22050
raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(a), '-t', str(b - a), '-i', src, '-ac', '1', '-ar', str(sr),
                      '-f', 's16le', '-'], capture_output=True).stdout
x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
k = np.ones(70) / 70
low = np.convolve(np.convolve(x, k, 'same'), k, 'same')          # pasa-bajos ~150 Hz (bombo)
hop = 44; dt = hop / sr; n = len(low) // hop
env = np.sqrt((low[:n * hop].reshape(n, hop) ** 2).mean(1))
on = np.diff(np.log10(env + 1e-6), prepend=0); on[on < 0] = 0       # novedad de energía

def score(period):
    p = period / dt; best = (-1, 0)
    for ph in np.arange(0, p, 1.0):
        idx = (np.arange(ph, len(on) - 1, p)).astype(int)
        s = on[idx].sum()
        if s > best[0]: best = (s, ph * dt)
    return best

# 1) búsqueda gruesa y fina de tempo
cands = [(score(60 / bpm)[0], bpm) for bpm in np.arange(lo_bpm, hi_bpm, 0.25)]
bpm0 = max(cands)[1]
fine = [(score(60 / bpm)[0], bpm) for bpm in np.arange(bpm0 - 0.5, bpm0 + 0.5, 0.01)]
bpm = max(fine)[1]; P = 60 / bpm; t0 = a + score(P)[1]

# 2) afinado contra los arranques reales de cada golpe (50 % del máximo local)
def errors(P, t0):
    e = []
    for i in range(int((b - t0) / P)):
        t = t0 + i * P - a; j = int(t / dt); w = int(0.12 / dt)
        win = env[max(0, j - w):j + w]
        if len(win) < 2 * w: continue
        on_i = np.argmax(win > 0.5 * win.max()); e.append((j - w + on_i) * dt - t)
    e = np.array(e); good = e[np.abs(e - np.median(e)) < 0.05]   # descarta golpes que no son el bombo
    return e, good
for _ in range(3):
    e, good = errors(P, t0)
    t0 += np.median(good)
    i = np.arange(len(good)); P += np.polyfit(i, good - good.mean(), 1)[0] if len(good) > 4 else 0
e, good = errors(P, t0)
print(f'BPM {60 / P:.2f}  período {P:.4f} s  primer tiempo {t0:.3f} s')
print(f'error de la grilla: mediana {1000 * np.median(good):+.1f} ms, máx {1000 * np.abs(good).max():.1f} ms '
      f'({len(good)}/{len(e)} golpes de bombo)')
