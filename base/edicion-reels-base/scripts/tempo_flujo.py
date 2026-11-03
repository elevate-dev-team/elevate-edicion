"""Tempo y fase de un tema por FLUJO ESPECTRAL (todas las bandas), para cuando grilla_beats.py no engancha.

  <python del entorno align> tempo_flujo.py <musica> <desde_s> <hasta_s>

- grilla_beats.py mide sobre el bombo: en funk sincopado (bombo fuera del tiempo) da tempos distintos por tramo y
  errores de ±120 ms. Acá se usa el flujo espectral (golpes de bombo, caja y hi-hat juntos): autocorrelación para el
  período y un peine para la fase.
- Imprime los 6 mejores períodos de la autocorrelación, el BPM del peine y la fase (primer tiempo), y la fase medida
  cada 8 s en todo el tema: si se repite (± la mitad o ¼ del período = contratiempo/corcheas), la grilla es estable.
Caso real (GIN 03-11 loop, 2026-11-03): *Funkee Monkeee* (Mixkit) daba 122–150 BPM con grilla_beats.py; con este
script, 100,0 BPM exactos, fase 0,264 s en todo el tema (1 tiempo = 15 cuadros a 25 fps). Cortes verificados en el beat.
"""
import subprocess, sys, numpy as np

src, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]); sr = 22050
def flujo(x, hop):
    win = 1024; n = (len(x) - win) // hop
    F = np.abs(np.fft.rfft(np.stack([x[i * hop:i * hop + win] * np.hanning(win) for i in range(n)]), axis=1))
    f = np.maximum(0, np.diff(np.log1p(100 * F), axis=0)).sum(1)
    f -= np.convolve(f, np.ones(32) / 32, 'same'); f[f < 0] = 0
    return f, hop / sr
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'],
                                 capture_output=True).stdout, np.int16).astype(np.float32) / 32768
seg = x[int(a * sr):int(b * sr)]
fl, dt = flujo(seg, 256)
ac = np.correlate(fl, fl, 'full')[len(fl) - 1:]; lags = np.arange(len(ac)) * dt
m = (lags > 0.3) & (lags < 0.75)
for i in np.argsort(ac[m])[::-1][:6]: print('período %.4f s  →  %.2f BPM' % (lags[m][i], 60 / lags[m][i]))
best = (0, 0, 0)
for bpm in np.arange(80, 160, 0.02):
    p = 60 / bpm / dt
    for ph in np.arange(0, p, 1):
        s = fl[(np.arange(ph, len(fl) - 1, p)).astype(int)].mean()
        if s > best[0]: best = (s, bpm, a + ph * dt)
bpm, t0 = best[1], best[2]; P = 60 / bpm
print('peine: %.2f BPM, período %.4f s, primer tiempo %.3f s' % (bpm, P, t0))
fl2, dt2 = flujo(x, 128)
for s0 in range(0, int(len(x) / sr) - 8, 8):
    w = fl2[int(s0 / dt2):int((s0 + 8) / dt2)]
    r = max((w[(np.arange(ph, len(w) - 1, P / dt2)).astype(int)].mean(), ph * dt2) for ph in np.arange(0, P / dt2, 1))
    print('  %3d s: fase %.3f' % (s0, (s0 + r[1]) % P))
