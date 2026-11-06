"""Mezcla ROC 02-11: voz de Tomi (voz_final.wav, −13 LUFS) + Gimme that Groove! con hueco de EQ + SFX con el pico alineado. Master −11 LUFS.
  python3 mezcla.py [dB música bajo la voz=-16] [ajuste master dB=0]"""
import json, os, re, subprocess, sys
W = os.path.dirname(os.path.abspath(__file__)) + '/'
SFX = '/Users/tomisepul25/Desktop/ELEVATE/PERSONAL/EFECTOS DE SONIDO/'
MUS = W + '../MUSICA/Gimme that Groove! - Michael Ramir C. (Mixkit).mp3'; MUS_IN = 8.042
D = json.load(open(os.path.expanduser('~/remotion-local/src/roc0211/data.json'))); EV = D['ev']; FPS = 25; T = D['total'] / FPS
REL = float(sys.argv[1]) if len(sys.argv) > 1 else -16.0
MASTER = float(sys.argv[2]) if len(sys.argv) > 2 else 0.0
EQ = 'equalizer=f=2200:t=o:w=1.6:g=-5,equalizer=f=350:t=o:w=1:g=-2'
S = {'whoosh': ('Whoosh 1.wav', 0.16), 'swipe': ('Swipe Swoosh Transition Sound Effect(MP3_70K).mp3', 0.32), 'click': ('Mouse Click Sound Effect.mp3', 0.56),
     'wink': ('Eye Wink Sound Effect.mp3', 0.14), 'cash': ('CashMoney Sound Effect.mp3', 1.37), 'dig': ('Click 4 (digital).wav', 0.08),
     'notif': ('Notifications and Buttons - 04.wav', 0.01)}
f = lambda fr: fr / FPS
EV_ = []
for c in D['cortes']: EV_.append(('whoosh', f(c), -20 if (1094 < c < 1328 or 1400 < c < 1634) else -16))
for c in D['leaks']: EV_.append(('swipe', f(c), -13))
for a, b, k in D['tit']:
    if k in ('Terraza', 'Listos', 'Paquete', 'Zona'): EV_.append(('wink', f(a + 1), -15))
    elif k not in ('Placa', 'Cerca', 'Cta'): EV_.append(('click', f(a + 1), -17))
EV_ += [('cash', f(EV['precio']), -20), ('click', f(EV['anios1']), -18), ('click', f(EV['pct'] - 2), -17), ('dig', f(1094 + 14), -16), ('dig', f(EV['va']), -16),
        ('dig', f(EV['gastos2'] - 2), -15), ('dig', f(EV['asoc2'] - 2), -15), ('click', f(1401), -18)]
for k in ('amazon', 'fedex', 'escuelas', 'extension'): EV_.append(('dig', f(EV[k] - 3), -16))
EV_ += [('notif', f(EV['escribeme']), -14)]
def I(p, af=None):
    o = subprocess.run(['ffmpeg', '-nostats', '-i', p, '-af', (af + ',' if af else '') + 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', o)[-1]), float(re.findall(r'Peak:\s+(-?[\d.]+)', o)[-1])
voz = W + 'voz_final.wav'; voz_I = I(voz)[0]
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(MUS_IN), '-t', str(T), '-i', MUS, '-af', f'aresample=48000,{EQ}', '-c:a', 'pcm_f32le', W + 'mus_eq.wav'], check=True)
mus_I = I(W + 'mus_eq.wav')[0]; g = voz_I + REL - mus_I
inp = ['-i', voz, '-i', W + 'mus_eq.wav']; fc = []; mix = []
for i, (n, t, gg) in enumerate(EV_):
    fn, pk = S[n]; st = max(0, t - pk); inp += ['-i', SFX + fn]
    fc.append(f'[{i + 2}:a]aresample=48000,aformat=channel_layouts=stereo,volume={gg}dB,adelay={int(st * 1000)}|{int(st * 1000)},apad,atrim=0:{T}[s{i}]'); mix.append(f'[s{i}]')
fc.append(f'[1:a]aformat=channel_layouts=stereo,volume={g:.2f}dB,afade=t=in:d=0.2,afade=t=out:st={T - 0.8}:d=0.8,atrim=0:{T}[mus]')
fc.append('[0:a]aformat=channel_layouts=stereo[v]')
fc.append('[v][mus]' + ''.join(mix) + f'amix=inputs={len(mix) + 2}:normalize=0:duration=first[m]')
fc.append(f'[m]volume={MASTER}dB,aresample=192000,alimiter=limit=0.84:attack=5:release=150:level=disabled,aresample=48000,atrim=0:{T}[o]')
open(W + 'fc_mix.txt', 'w').write(';'.join(fc))
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inp, '-/filter_complex', W + 'fc_mix.txt', '-map', '[o]', '-c:a', 'pcm_f32le', W + 'mix.wav'], check=True)
print(f'voz {voz_I} · música {mus_I + g:.1f} LUFS ({REL} dB bajo la voz) · {len(EV_)} SFX · mezcla', I(W + 'mix.wav'))
