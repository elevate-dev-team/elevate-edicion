"""Arranques reales de voz (después de una pausa) medidos en la señal, para clavar subtítulos y cortes.

  python3 onsets.py <voz.wav> <salida.json> [inicio fin inicio fin ...]

Filtra la banda de la voz (250–3500 Hz), mide en ventanas de 10 ms y, por tramo, marca un arranque cuando hay
≥ 120 ms por debajo del piso+8 dB seguidos de voz > piso+12 dB. El piso se calcula por tramo (percentil 10),
así funciona también con ruido de fondo fuerte (lluvia, tráfico). Sin tramos, usa el archivo entero.
Salida: {"onsets": [s, ...], "db": [nivel por cada 10 ms]} (db sirve para ver bloques de voz a mano).
"""
import json, math, os, struct, subprocess, sys, tempfile, wave

src, out = sys.argv[1], sys.argv[2]
band = os.path.join(tempfile.gettempdir(), '_onsets_band.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', 'highpass=f=250,lowpass=f=3500', '-ac', '1', '-ar', '16000', band], check=True)
w = wave.open(band); sr = w.getframerate(); n = w.getnframes(); d = struct.unpack('<%dh' % n, w.readframes(n)); st = int(sr * 0.01)
db = [20 * math.log10(math.sqrt(sum(x * x for x in d[i:i + st]) / st) / 32768 + 1e-9) for i in range(0, n - st, st)]
args = [float(x) for x in sys.argv[3:]]
tramos = list(zip(args[::2], args[1::2])) or [(0, len(db) / 100)]
ons = []
for a, b in tramos:
    i0, i1 = int(a * 100), min(len(db), int(b * 100)); loc = db[i0:i1]
    if not loc: continue
    fl = sorted(loc)[len(loc) // 10]; quiet = 0
    for k, v in enumerate(loc):
        if v < fl + 8: quiet += 1
        else:
            if quiet >= 12 and v > fl + 12: ons.append(round((i0 + k) / 100, 2))
            if v > fl + 12: quiet = 0
json.dump({'onsets': ons, 'db': [round(x, 1) for x in db]}, open(out, 'w'))
print(' '.join(f'{x:.2f}' for x in ons))
