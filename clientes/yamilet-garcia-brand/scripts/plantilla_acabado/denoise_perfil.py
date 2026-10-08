"""Reducción de ruido espectral con PERFIL medido en las pausas de la propia toma (spectral gating).

  ~/venvs/align/bin/python denoise_perfil.py <entrada.wav> <salida.wav> <ini-fin> [<ini-fin> ...] [--red 16] [--k 1.5]

Para ruido de ambiente ESTABLE (aire acondicionado, heladera, zumbido con tonos) donde afftdn de ffmpeg casi no actúa.
Caso real: YGM 06-09 (2026-10-08), toma con ruido −50 dB y tonos en 157–372 Hz; afftdn (nr 12–97) bajaba ≤ 5 dB.
- Perfil: media + k·desvío del nivel (dB) de cada banda en las pausas indicadas (segundos de la entrada).
- Máscara: 1 donde la señal supera el umbral; si no, se atenúa `--red` dB. Suavizada en tiempo y frecuencia (sin "agua").
- Mono, float. Va ANTES de la compresión (la compresión levanta el ruido en las pausas).
"""
import sys, subprocess, numpy as np

import argparse
ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('dst'); ap.add_argument('ranges', nargs='+')
ap.add_argument('--red', type=float, default=16.0); ap.add_argument('--k', type=float, default=1.5)
o = ap.parse_args()
src, dst, RED, K = o.src, o.dst, o.red, o.k
ranges = [tuple(map(float, r.split('-'))) for r in o.ranges]
SR = 48000
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32).astype(np.float64)

N, HOP = 2048, 512
win = np.hanning(N)
pad = np.pad(x, (N, N + N))
frames = np.lib.stride_tricks.sliding_window_view(pad, N)[::HOP] * win
S = np.fft.rfft(frames, axis=1)
mag = np.abs(S); db = 20 * np.log10(mag + 1e-10)
t = (np.arange(len(S)) * HOP - N) / SR
sel = np.zeros(len(S), bool)
for a, b in ranges: sel |= (t >= a) & (t + N / SR <= b)
thr = db[sel].mean(0) + K * db[sel].std(0)
mask = (db > thr).astype(np.float64)
# suavizado: 3 frames en el tiempo, 5 bandas en frecuencia
from numpy.lib.stride_tricks import sliding_window_view as swv
m = np.pad(mask, ((1, 1), (2, 2)), mode='edge'); mask = swv(m, (3, 5)).mean((-1, -2))
floor = 10 ** (-RED / 20)
g = floor + (1 - floor) * mask
Y = S * g
y = np.fft.irfft(Y, n=N, axis=1) * win
out = np.zeros(len(pad))
norm = np.zeros(len(pad))
for i in range(len(y)):
    out[i * HOP:i * HOP + N] += y[i]; norm[i * HOP:i * HOP + N] += win ** 2
out = (out / np.maximum(norm, 1e-6))[N:N + len(x)].astype(np.float32)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_f32le', dst], input=out.tobytes(), check=True)
print(f'ok {dst}: perfil de {sel.sum()} frames, reducción {RED} dB, k {K}')
