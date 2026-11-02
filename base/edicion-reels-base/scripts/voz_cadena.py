"""Cadena de voz por toma (regla 3.2): ganancia previa, ruido con piso real, EQ, de-esser por banda, compresión suave,
control de picos sobremuestreado, −12 LUFS y limitador lento. Informa por toma LUFS, LRA, agudos y cuánto trabajó el limitador.

  <python del entorno align> voz_cadena.py <voz.wav> <cortes> <salida.wav>
    voz.wav  : voz del export (o de la toma), cualquier formato; se trabaja en float 48 kHz mono.
    cortes   : "0,8.84,11.64,...,41.04" — límites de cada toma en tiempo del video (cada toma tiene su nivel y su ruido).
    salida   : WAV float con la voz procesada, misma duración, ya compensado el retardo de la cadena (~27 ms).

Caso real: TA 05-10 (2026-10-19). La cadena anterior (presencia +3 dB, dos compresiones rápidas y alimiter de 2/50 ms sin
sobremuestreo) dejó la voz "algo saturada": los agudos (>3 kHz) quedaban 7 dB más fuertes respecto del total que en la voz
cruda (sibilantes y consonantes al frente) y el limitador recortaba ~2 dB todo el tiempo. Con esta cadena los agudos quedan
a 0–3 dB de la voz cruda y el usuario la aprobó. El `deesser` de ffmpeg no cambiaba nada medible: por eso el de-esser es
por banda (acrossover a 4 kHz + compresión rápida solo de la banda alta).
Requiere numpy (el entorno align lo tiene).
"""
import os, re, subprocess, sys, tempfile, wave
import numpy as np

src, cortes, salida = sys.argv[1], sys.argv[2], sys.argv[3]
B = [float(x) for x in cortes.split(',')]
T = tempfile.mkdtemp(prefix='voz_')
SR = 48000
EQ = 'equalizer=f=300:t=o:w=1:g=-3,equalizer=f=4800:t=o:w=1.2:g=1,highshelf=f=10000:g=1'  # saca "caja", sin realce de presencia
DEESS = 'acrossover=split=4000[lo][hi];[hi]acompressor=threshold=-36dB:ratio=5:attack=0.5:release=50:knee=3:makeup=1[h2];[lo][h2]amix=inputs=2:normalize=0'
COMP = 'acompressor=threshold=-26dB:ratio=2.2:attack=15:release=160:knee=6:makeup=1'
PICOS = 'aresample=192000,acompressor=threshold=-9dB:ratio=4:attack=2:release=120:knee=4:detection=peak:makeup=1,aresample=48000'
LIM = 'aresample=192000,alimiter=limit=0.89:attack=5:release=150:level=disabled,aresample=48000'
PAD, DLY = 0.1, 0.027  # la cadena retrasa la voz ~27 ms


def ff(*a):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *a], check=True)


def info(f, af, a=None, b=None):
    t = ['-ss', str(a), '-to', str(b)] if a is not None else []
    return subprocess.run(['ffmpeg', '-v', 'info', '-nostats', *t, '-i', f, '-af', af, '-f', 'null', '-'], capture_output=True, text=True).stderr


def lufs(f, a=None, b=None):
    s = info(f, 'ebur128=peak=sample', a, b)
    s = s[s.rfind('Summary'):]
    return float(re.search(r'I:\s+(-?[\d.]+)', s).group(1)), float(re.search(r'LRA:\s+(-?[\d.]+)', s).group(1))


def rms(f, hp=False, a=None, b=None):
    s = info(f, ('highpass=f=3000,' if hp else '') + 'astats=measure_perchannel=none:measure_overall=RMS_level+Peak_level', a, b)
    return float(re.search(r'RMS level dB: (-?[\d.]+)', s).group(1)), float(re.search(r'Peak level dB: (-?[\d.inf]+)', s).group(1))


raw = f'{T}/raw.wav'
ff('-i', src, '-vn', '-ac', '1', '-ar', str(SR), '-c:a', 'pcm_f32le', raw)
ff('-i', raw, '-af', 'highpass=f=90', '-c:a', 'pcm_s16le', f'{T}/hp.wav')
w = wave.open(f'{T}/hp.wav'); HP = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768


def piso(a, b):  # piso de ruido real: percentil 5 de ventanas de 50 ms (las pausas cortas engañan)
    x = HP[int(a * SR):int(b * SR)]; n = 2400
    r = np.sqrt((x[:len(x) // n * n].reshape(-1, n) ** 2).mean(1)) + 1e-9
    return float(20 * np.log10(np.percentile(r, 5)))


partes = []
for i, (a, b) in enumerate(zip(B, B[1:])):
    I, L = lufs(raw, a, b)
    g = -20 - I
    nf = max(-80, min(-25, piso(a, b) + g))
    a0 = max(0, a - PAD); off = (a - a0) + DLY
    t1 = f'{T}/{i}_1.wav'
    ff('-ss', str(a0), '-to', str(b + PAD), '-i', raw, '-filter_complex',
       f'[0:a]volume={g:.2f}dB,highpass=f=80,afftdn=nr=6:nf={nf:.1f},{EQ},{DEESS},{COMP}', '-c:a', 'pcm_f32le', t1)
    I1, _ = lufs(t1, off, off + b - a)
    t2 = f'{T}/{i}_2.wav'
    ff('-i', t1, '-af', f'apad,atrim=start={off}:duration={b - a},asetpts=N/SR/TB,volume={-12 - I1:.2f}dB,{PICOS}', '-c:a', 'pcm_f32le', t2)
    I2, _ = lufs(t2)
    t3 = f'{T}/{i}_3.wav'
    ff('-i', t2, '-af', f'volume={-12 - I2:.2f}dB', '-c:a', 'pcm_f32le', t3)
    out = f'{T}/{i}.wav'
    ff('-i', t3, '-af', LIM, '-c:a', 'pcm_f32le', out)
    I3, L3 = lufs(out)
    r0, _ = rms(raw, False, a, b); h0, _ = rms(raw, True, a, b)
    r1, pk = rms(out); h1, _ = rms(out, True)
    _, pre = rms(t3)
    print(f'toma {i} {a:6.2f}-{b:6.2f}: {I:.1f} → {I3:.1f} LUFS · LRA {L:.1f} → {L3:.1f} · agudos/total {h0 - r0:.1f} → {h1 - r1:.1f} dB'
          f' · pico {pk:.1f} · limitador {max(0, pre + 1):.1f} dB')
    partes.append(out)
open(f'{T}/lista.txt', 'w').writelines(f"file '{p}'\n" for p in partes)
ff('-f', 'concat', '-safe', '0', '-i', f'{T}/lista.txt', '-c:a', 'pcm_f32le', salida)
print('total:', lufs(salida), '→', salida)
print('Chequear: LRA baja en cada toma, agudos/total a ≤ ~3 dB de la voz cruda, pico ≤ −1 dB.')
