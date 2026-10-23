# Caso real: FM 24-10 VSL webinar 2 (2026-10-23), aprobada como cama a ~12 dB bajo la voz.
# Uso: <python con numpy> musica_corporativa.py <salida.wav> <duracion_s>   (después: hueco de EQ y nivel según edicion-reels-base regla 3.1)
"""Cama musical corporativa / chill generada (numpy). Uso: python musica.py <salida.wav> <duracion_s>
92 BPM, F mayor: Fmaj9 - Am7 - Dm9 - Bbmaj9. Rhodes + pad + sub + batería suave + pluck."""
import sys, wave, numpy as np

SR = 48000
out, DUR = sys.argv[1], float(sys.argv[2])
BPM = 92.0
BEAT = 60 / BPM
BAR = 4 * BEAT
N = int((DUR + 3) * SR)
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def env_adsr(n, a, d, s, r, sus_len):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    e = np.zeros(n)
    e[:a] = np.linspace(0, 1, a, endpoint=False)
    e[a:a + d] = np.linspace(1, s, d, endpoint=False)
    sl = max(0, int(sus_len * SR) - a - d)
    e[a + d:a + d + sl] = s
    tail = n - (a + d + sl)
    e[a + d + sl:] = s * np.exp(-np.arange(tail) / max(1, r / 4))
    return e

def lp(x, fc):  # one-pole lowpass, vectorized-ish via loop in chunks
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc; y[i] = acc
    return y

def add(buf, x, start, gain=1.0):
    s = int(start * SR)
    if s >= N: return
    e = min(N, s + len(x)); buf[s:e] += gain * x[:e - s]

def rhodes(f, dur):
    n = int((dur + 1.5) * SR); t = np.arange(n) / SR
    mod = np.sin(2 * np.pi * f * 1.0 * t) * 1.2 * np.exp(-t * 3)
    car = np.sin(2 * np.pi * f * t + mod)
    bell = 0.15 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 6)
    e = env_adsr(n, 0.005, 0.6, 0.45, 1.2, dur)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.5 * t)
    return (car + bell) * e * trem

def pad(f, dur):
    n = int((dur + 1.0) * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for det in (-0.12, 0.0, 0.11):
        ff = f * 2 ** (det / 12)
        for h in range(1, 7):
            x += np.sin(2 * np.pi * ff * h * t + rng.random() * 6.28) / h ** 1.6
    e = env_adsr(n, 0.9, 0.3, 0.8, 1.0, dur)
    return x * e

def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 48 + 90 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7.5) + 0.08 * rng.standard_normal(n) * np.exp(-t * 200)

def noise_hit(dur, decay, fc_lo, fc_hi):
    n = int(dur * SR); t = np.arange(n) / SR
    w = rng.standard_normal(n)
    hp = w - lp(w, fc_lo)
    y = lp(hp, fc_hi)
    return y * np.exp(-t * decay)

KICK = kick()
HAT = noise_hit(0.08, 60, 7000, 14000) * 1.4
SHK = noise_hit(0.06, 45, 5000, 11000)
SNAP = noise_hit(0.25, 22, 1200, 6000) * 1.8

# progresión (raíz, voicing)
PROG = [(53, [64, 67, 69, 72, 76]),   # Fmaj9: E G A C E sobre F
        (57, [64, 67, 69, 72]),       # Am7
        (50, [65, 69, 72, 76]),       # Dm9 (F A C E)
        (46, [62, 65, 69, 72])]       # Bbmaj9 (D F A C)
MEL = [76, 74, 72, 69, 72, 74, 77, 76]  # pluck suave

nbars = int(np.ceil((DUR + 2) / BAR))
for b in range(nbars):
    t0 = b * BAR
    root, chord = PROG[b % 4]
    sec_drums = b >= 2            # entra la batería en el compás 3
    sec_pluck = 6 <= b < nbars - 2 and (b // 8) % 2 == 1
    # pad
    for m in chord[:3]:
        x = pad(midi(m - 12), BAR)
        add(L, x, t0, 0.018); add(R, x, t0, 0.018)
    # rhodes: acorde en 1 y en el "y" del 3
    for (off, ln, g) in ((0, 1.5 * BEAT, 0.09), (2.5 * BEAT, 1.5 * BEAT, 0.06)):
        for j, m in enumerate(chord):
            x = rhodes(midi(m), ln)
            pan = 0.35 + 0.3 * (j / len(chord))
            add(L, x, t0 + off + j * 0.008, g * (1 - pan) * 1.4); add(R, x, t0 + off + j * 0.008, g * pan * 1.4)
    # sub bajo
    n = int(BAR * SR); tt = np.arange(n) / SR
    for off, ln in ((0, 1.75 * BEAT), (2 * BEAT, 0.5 * BEAT), (2.5 * BEAT, 1.5 * BEAT)):
        k = int(ln * SR); ts = np.arange(k) / SR
        x = np.sin(2 * np.pi * midi(root - 12) * ts) * np.minimum(1, ts * 80) * np.exp(-ts * 1.2) * np.minimum(1, (ln - ts) * 60)
        x += 0.25 * np.sin(2 * np.pi * midi(root) * ts) * np.exp(-ts * 3)
        add(L, x, t0 + off, 0.22 if sec_drums else 0.12); add(R, x, t0 + off, 0.22 if sec_drums else 0.12)
    if sec_drums:
        for k in (0, 2.5, ):
            add(L, KICK, t0 + k * BEAT, 0.42); add(R, KICK, t0 + k * BEAT, 0.42)
        for k in (1, 3):
            add(L, SNAP, t0 + k * BEAT, 0.10); add(R, SNAP, t0 + k * BEAT + 0.004, 0.10)
        for k in range(8):
            g = 0.06 if k % 2 else 0.035
            add(L, HAT, t0 + k * BEAT / 2 + 0.01, g * 0.7); add(R, HAT, t0 + k * BEAT / 2 + 0.01, g)
        for k in range(16):
            add(L, SHK, t0 + k * BEAT / 4, 0.02 * (1.4 if k % 2 else 0.7)); add(R, SHK, t0 + k * BEAT / 4, 0.016)
    if sec_pluck:
        for k, m in enumerate(MEL):
            x = rhodes(midi(m + 12), 0.25) * 0.6
            add(L, x, t0 + k * BEAT / 2, 0.035); add(R, x, t0 + k * BEAT / 2 + 0.012, 0.045)

# reverb: convolución con ruido de caída exponencial (FFT)
def reverb(x, secs=2.2, seed=1):
    r = np.random.default_rng(seed)
    n = int(secs * SR); t = np.arange(n) / SR
    ir = r.standard_normal(n) * np.exp(-t * 3.2); ir[:int(0.02 * SR)] = 0
    ir /= np.sqrt((ir ** 2).sum())
    m = len(x) + n
    nf = 1 << (m - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nf) * np.fft.rfft(ir, nf), nf)[:len(x)]
    return y
wl, wr = reverb(L, seed=1), reverb(R, seed=2)
L = L + 0.35 * wl; R = R + 0.35 * wr
# fade in/out y recorte
n = int(DUR * SR)
L, R = L[:n], R[:n]
fi = int(0.6 * SR); fo = int(2.5 * SR)
for ch in (L, R):
    ch[:fi] *= np.linspace(0, 1, fi); ch[-fo:] *= np.linspace(1, 0, fo) ** 1.5
peak = max(np.abs(L).max(), np.abs(R).max())
st = np.stack([L, R], 1) / peak * 0.7
w = wave.open(out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st * 32767).astype(np.int16).tobytes()); w.close()
print('ok', out, DUR)
