# LUL 17-10 (aprobado 2026-11-03): mezcla voz + música (Gimme that Groove, Mixkit 872, hueco de EQ suave) + SFX con el pico alineado → master −11 LUFS. Correr desde PROYECTO/ con el python del entorno align; rutas relativas a la pieza.
import subprocess, numpy as np, sys
SR = 48000; DUR = 23.29
SFXD = '/Users/tomisepul25/Desktop/ELEVATE/PERSONAL/EFECTOS DE SONIDO/'
MUS = '../MUSICA/Gimme that Groove (Mixkit 872).mp3'; MUS_IN = 1.77  # primer tiempo medido en 1,791 s (112 BPM)
MUS_DB = float(sys.argv[1]) if len(sys.argv) > 1 else -16  # música bajo la voz (LUFS); banda de voz 11,7 dB bajo el total
def load(p, ss=None, t=None, af=None):
    a = ['ffmpeg', '-v', 'error'] + (['-ss', str(ss)] if ss is not None else []) + (['-t', str(t)] if t else []) + ['-i', p]
    a += (['-af', af] if af else []) + ['-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(a, capture_output=True).stdout, np.float32).copy()
def lufs_arr(x):
    x.astype(np.float32).tofile('/tmp/_l.f32')
    s = subprocess.run(['ffmpeg', '-nostats', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '/tmp/_l.f32', '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(s[s.rfind('Summary'):].split('I:')[1].split('LUFS')[0])
N = int(DUR * SR)
voz = load('../VOZ/voz_procesada.wav')[:N]; voz = np.pad(voz, (0, N - len(voz)))
# emparejar tomas: el limitador deja el hook en −14,0, el cuerpo en −13,1 y el CTA en −14,9 LUFS (cortes en silencio)
g = np.ones(N); g[int(2.68 * SR):int(20.79 * SR)] = 10 ** (-0.9 / 20); g[int(20.79 * SR):] = 10 ** (0.8 / 20)
voz *= np.convolve(g, np.ones(960) / 960, 'same')
mus = load(MUS, MUS_IN, DUR + 0.5, 'equalizer=f=2200:t=o:w=1.6:g=-4,equalizer=f=350:t=o:w=1:g=-2')[:N]
mus = np.pad(mus, (0, N - len(mus)))
mus *= 10 ** ((lufs_arr(voz) + MUS_DB - lufs_arr(mus)) / 20)
fo = int(0.4 * SR); mus[-fo:] *= np.linspace(1, 0, fo); fi = int(0.03 * SR); mus[:fi] *= np.linspace(0, 1, fi)
# SFX: (tiempo del evento, archivo, pico en dBFS)
W = [(2.68, 'Cinematic Whoosh 1.wav', -14), (5.25, 'Whoosh 3.wav', -16), (6.68, 'swipe swoosh.mp3', -16), (9.12, 'Whoosh 4.wav', -16),
     (10.85, 'whoosh slide.mp3', -16), (12.70, 'Whoosh 6.wav', -16), (14.28, 'Swipe Swoosh Transition Sound Effect(MP3_70K).mp3', -15),
     (15.25, 'Whoosh 3.wav', -16), (17.21, 'swipe swoosh.mp3', -16), (19.06, 'Whoosh 4.wav', -16), (20.79, 'Cinematic Whoosh 1.wav', -14)]
T = [(1.29, 'Eye Wink Sound Effect.mp3', -18), (2.16, 'pop.mp3', -15), (5.37, 'Mouse Click Sound Effect.mp3', -19), (5.90, 'pop.mp3', -16),
     (6.70, 'CLICK.mp3', -18), (8.42, 'pop.mp3', -16), (9.16, 'CLICK.mp3', -18), (10.21, 'pop.mp3', -16), (14.55, 'pop.mp3', -15),
     (15.77, 'Mouse Click Sound Effect.mp3', -19), (16.51, 'pop.mp3', -16), (17.22, 'Mouse Click Sound Effect.mp3', -19),
     (17.72, 'pop.mp3', -16), (18.32, 'pop.mp3', -17), (22.58, 'Eye Wink Sound Effect.mp3', -16), (22.58, 'pop.mp3', -16)]
K = [(t, 'Click 9 (wood).wav', -21) for t in (0.50, 3.56, 4.17, 11.66, 13.58, 19.40, 21.32)]
sfx = np.zeros(N)
for t, fn, pk in W + T + K:
    x = load(SFXD + fn)
    assert len(x), fn
    env = np.abs(x); i0 = int(np.argmax(env))
    x = x / (env.max() + 1e-9) * 10 ** (pk / 20)
    s = int(t * SR) - i0
    a, b = max(0, s), min(N, s + len(x))
    if b > a: sfx[a:b] += x[a - s:b - s]
mix = voz + mus + sfx
mix.astype(np.float32).tofile('/tmp/_mix.f32')
I = lufs_arr(mix)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '/tmp/_mix.f32', '-af',
                f'volume={-14 - I + 0.3:.2f}dB,aresample=192000,alimiter=limit=0.84:attack=5:release=150:level=disabled,aresample=48000,pan=stereo|c0=c0|c1=c0',  # mono duplicado: estéreo = mono + 3 LU
                '-c:a', 'pcm_f32le', 'work/master.wav'])
for nm, a, b in [('hook', 0, 2.68), ('cuerpo', 2.68, 20.79), ('cta', 20.79, 23.29)]:
    sl = slice(int(a * SR), int(b * SR))
    print(f'{nm}: voz {lufs_arr(voz[sl]):.1f} · música {lufs_arr(mus[sl]):.1f} LUFS')
print('SFX:', len(W + T + K))
