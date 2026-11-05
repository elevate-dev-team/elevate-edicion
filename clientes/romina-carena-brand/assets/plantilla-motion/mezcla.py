"""Mezcla ROC 21-11: voz (cadena) + Funkee Monkeee con hueco de EQ + SFX con el pico alineado. Master −11 LUFS.
  python3 mezcla.py [dB música bajo la voz=-18] [ajuste master dB=0]"""
import os, re, subprocess, sys
W = os.path.dirname(os.path.abspath(__file__)) + '/'
MUS = '/Users/tomisepul25/Desktop/ELEVATE/ROMINA CARENA/01 REELS/11 NOVIEMBRE/21-11 ROC Florida baja los impuestos de/MUSICA/Mixkit - Funkee Monkeee.mp3'
import json
D = json.load(open(os.path.expanduser('~/remotion-local/src/roc2111/data.json')))
RM = D['remap']  # eventos escritos en la línea de tiempo v1 → v2
MUS_IN = 7.0; T = D['total'] / 30
REL = float(sys.argv[1]) if len(sys.argv) > 1 else -18.0
MASTER = float(sys.argv[2]) if len(sys.argv) > 2 else 0.0
EQ = 'equalizer=f=2200:t=o:w=1.6:g=-5,equalizer=f=350:t=o:w=1:g=-2'
PK = {'whoosh_slide': 0.34, 'swipe_swoosh': 0.70, 'Whoosh_3': 0.13, 'pop': 0.15, 'Eye_Wink_Sound_Effect': 0.14, 'Mouse_Click_Sound_Effect': 0.57,
      'CashMoney_Sound_Effect': 1.75, 'check_mark': 0.33, 'stamp': 0.71, 'flip': 0.94, 'Click_4__digital_': 0.08}
f = lambda fr: RM[fr] / 30
EV = []
for c in [35, 88, 192, 241, 259, 325, 435, 812, 896, 930, 1228, 1290]: EV.append(('whoosh_slide', f(c), -15))
for c in [172, 655, 1085, 1328]: EV.append(('swipe_swoosh', f(c), -13))
for c in [700, 1189, 1445]: EV.append(('Whoosh_3', f(c), -6))
EV += [('pop', f(104), -17), ('Mouse_Click_Sound_Effect', f(133), -16),
       ('pop', f(194), -18), ('stamp', f(223), -15), ('pop', f(229), -17),
       ('pop', f(437), -18), ('Click_4__digital_', f(442), -15), ('Click_4__digital_', f(491), -15), ('Click_4__digital_', f(571), -15),
       ('CashMoney_Sound_Effect', f(578), -21), ('pop', f(531), -20), ('pop', f(631), -20), ('pop', f(601), -21),
       ('flip', f(815), -17), ('pop', f(846), -19), ('stamp', f(873), -15),
       ('pop', f(932), -18), ('check_mark', f(961), -19),
       ('Click_4__digital_', f(999), -20), ('Click_4__digital_', f(1009), -20), ('Click_4__digital_', f(1019), -20), ('Click_4__digital_', f(1029), -20),
       ('Eye_Wink_Sound_Effect', f(1069), -15),
       ('Eye_Wink_Sound_Effect', f(1144), -15), ('Eye_Wink_Sound_Effect', f(1232), -15),
       ('pop', f(1448), -16), ('Mouse_Click_Sound_Effect', f(1477), -17), ('Mouse_Click_Sound_Effect', f(1520), -17)]

def I(p, af=None):
    cmd = ['ffmpeg', '-nostats', '-i', p] + (['-af', af + ',ebur128=peak=true'] if af else ['-af', 'ebur128=peak=true']) + ['-f', 'null', '-']
    o = subprocess.run(cmd, capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', o)[-1]), float(re.findall(r'Peak:\s+(-?[\d.]+)', o)[-1])
voz_I = I(W + 'voz.wav')[0]
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(MUS_IN), '-t', str(T), '-i', MUS, '-af', f'aresample=48000,{EQ}', '-c:a', 'pcm_f32le', W + 'mus_eq.wav'], check=True)
mus_I = I(W + 'mus_eq.wav')[0]
g = voz_I + REL - mus_I
inp = ['-i', W + 'voz.wav', '-i', W + 'mus_eq.wav']; fc = []; mix = []
for i, (n, t, gg) in enumerate(EV):
    st = max(0, t - PK[n]); inp += ['-i', W + f'sfx/{n}.wav']
    fc.append(f'[{i + 2}:a]volume={gg}dB,adelay={int(st * 1000)}|{int(st * 1000)},apad,atrim=0:{T}[s{i}]'); mix.append(f'[s{i}]')
n = len(EV) + 2; inp += ['-ss', '3', '-t', '1.2', '-i', W + 'sfx/clock_ticking_sound_effect.wav']
fc.append(f'[{n}:a]volume=-24dB,afade=t=in:d=0.08,afade=t=out:st=0.9:d=0.3,adelay={int(f(820) * 1000)}|{int(f(820) * 1000)},apad,atrim=0:{T}[tic]'); mix.append('[tic]')
fc.append(f'[1:a]volume={g:.2f}dB,afade=t=in:d=0.25,afade=t=out:st={T - 0.7}:d=0.7,atrim=0:{T}[mus]')
fc.append('[0:a]aformat=channel_layouts=stereo[v]')
fc.append('[v][mus]' + ''.join(mix) + f'amix=inputs={len(mix) + 2}:normalize=0:duration=first[m]')
fc.append(f'[m]volume={MASTER}dB,aresample=192000,alimiter=limit=0.84:attack=5:release=150:level=disabled,aresample=48000,atrim=0:{T}[o]')
open(W + 'fc_mix.txt', 'w').write(';'.join(fc))
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inp, '-/filter_complex', W + 'fc_mix.txt', '-map', '[o]', '-c:a', 'pcm_f32le', W + 'mix.wav'], check=True)
print(f'voz {voz_I} LUFS · música {mus_I + g:.1f} LUFS ({REL} dB bajo la voz) · mezcla', I(W + 'mix.wav'))
for a, b, nm in [(0, f(172), 'hook'), (f(172), f(1328), 'cuerpo'), (f(1328), T, 'cta')]:
    print(nm, 'voz', I(W + 'voz.wav', f'atrim={a}:{b}')[0], 'mix', I(W + 'mix.wav', f'atrim={a}:{b}')[0])
