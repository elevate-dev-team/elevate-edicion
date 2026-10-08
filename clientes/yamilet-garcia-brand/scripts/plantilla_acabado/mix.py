# Mezcla: voz (cadena de edicion-reels-base 3.2 sobre la toma entera, después cortada con los CUTS + 27 ms de
# latencia de la cadena) + música "Smooth Cuban" (guiño a su origen; tema liviano en la banda de la voz → −12 dB
# bajo la voz con hueco de EQ) + SFX con el PICO clavado en cada evento → master −11 LUFS / ≤ −1 dBTP.
import os
import re, subprocess, sys, numpy as np
from timeline import *

_RUTAS = __import__('json').load(open(os.path.expanduser('~/.claude/elevate/config.json')))['rutas']  # ver configuracion-inicial
MUS = os.path.join(_RUTAS['SFX_ENVATO'], 'envato-2PCSXJ7-01 Smooth Cuban.mp3')  # tema elegido para ese video: cambiar por el de cada pieza
MUS_OFF = 2.0                      # arranca ya con el groove (el primer segundo del tema es más bajo)
PEAK = {'pop': 0.150, 'shimmer': 0.467, 'shutter': 0.084, 'swipe': 0.684, 'whoosh': 0.339, 'whoosh_soft': 0.450, 'wink': 0.395}
J = lambda *p: os.path.join(A, *p)
SR = 48000

def lufs(path, a=None, d=None):
    cmd = ['ffmpeg', '-hide_banner'] + (['-ss', str(a), '-t', str(d)] if a is not None else []) + ['-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-']
    out = subprocess.run(cmd, capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', out)[-1])
def stats(path, a=None, d=None):
    cmd = ['ffmpeg', '-hide_banner'] + (['-ss', str(a), '-t', str(d)] if a is not None else []) + ['-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-']
    o = subprocess.run(cmd, capture_output=True, text=True).stderr
    return (float(re.findall(r'I:\s+(-?[\d.]+) LUFS', o)[-1]), float(re.findall(r'LRA:\s+(-?[\d.]+) LU', o)[-1]),
            float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', o)[-1]))
def rd(path):
    return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)

# 1) voz: una sola toma → una sola cadena. Ruido medido en pausas: −50 dB estable con tonos en 157–372 Hz
#    (aire acondicionado/heladera). afftdn casi no lo bajaba (≤ 5 dB) y la compresión lo levantaba en las pausas
#    (SNR 13 → 5 dB): reducción espectral con PERFIL de las pausas (denoise_perfil.py, −15 dB) ANTES de comprimir.
raw_l = lufs(J('voz_raw.wav'))
pre = -20 - raw_l
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', J('voz_raw.wav'), '-af', f'volume={pre:.2f}dB,highpass=f=110:p=2,highpass=f=110:p=2',
                '-c:a', 'pcm_f32le', J('voz_hp.wav')], check=True)
PAUSAS = ['11.15-11.68', '15.32-16.70', '26.86-27.22', '29.98-30.80']
subprocess.run([sys.executable, J('denoise_perfil.py'), J('voz_hp.wav'), J('voz_dn.wav')] + PAUSAS + ['--red', '18'], check=True)
chain = ('agate=threshold=0.014:ratio=2.5:range=0.2:attack=8:release=160:knee=4,'   # expansor suave: baja el resto del ruido entre frases
         'equalizer=f=250:t=o:w=1.2:g=-2.5,equalizer=f=3200:t=o:w=1.4:g=3,highshelf=f=9000:g=1.5,'
         'acompressor=threshold=-24dB:ratio=3.5:attack=5:release=90:makeup=4,'
         'acompressor=threshold=-14dB:ratio=2.5:attack=3:release=60:makeup=1')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', J('voz_dn.wav'), '-af', chain, '-c:a', 'pcm_f32le', J('voz_chain.wav')], check=True)
g_fin = -12 - lufs(J('voz_chain.wav'))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', J('voz_chain.wav'), '-af', f'volume={g_fin:.2f}dB,aresample=192000,alimiter=limit=0.89:attack=2:release=50:level=disabled,aresample=48000',
                '-c:a', 'pcm_f32le', J('voz_full.wav')], check=True)
print(f'voz cruda {raw_l:.1f} LUFS → ganancia previa {pre:+.1f} dB, ganancia final {g_fin:+.1f} dB')
# latencia real de la cadena (correlación de envolventes cruda vs. procesada)
def env(p):
    z = rd(p); z = np.abs(z[:len(z) // 48 * 48]).reshape(-1, 48).mean(1); return (z - z.mean()) / (z.std() + 1e-9)   # 1 ms
e0, e1 = env(J('voz_raw.wav')), env(J('voz_full.wav')); n = min(len(e0), len(e1))
cc = [np.dot(e0[:n - 80], e1[k:n - 80 + k]) for k in range(0, 80)]
LAT = int(np.argmax(cc)) / 1000
print(f'latencia de la cadena: {LAT * 1000:.0f} ms')
for f in ('voz_hp.wav', 'voz_dn.wav'): os.remove(J(f))

# 2) montaje de la voz con los cortes (fundidos de 6 ms en cada unión)
v = rd(J('voz_full.wav')); N = round(END_V * SR); out = np.zeros(N, np.float32); fd = int(0.006 * SR)
for (a, b), o in zip(CUTS, OUTS):
    s0 = int(round((a + LAT) * SR)); n = int(round((b - a) * SR)); seg = v[s0:s0 + n].copy()
    seg[:fd] *= np.linspace(0, 1, fd); seg[-fd:] *= np.linspace(1, 0, fd)
    i0 = int(round(o * SR)); out[i0:i0 + len(seg)] += seg[:N - i0]
out.tofile(J('voz_cut.f32'))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', J('voz_cut.f32'), '-c:a', 'pcm_f32le', J('voz_proc.wav')], check=True)
os.remove(J('voz_cut.f32'))

# 3) música: −12 dB bajo la voz (tema liviano: 1 % de su energía en 1–4 kHz), hueco de EQ, fundido de salida
m_l = lufs(MUS, MUS_OFF, END_V)
G_M = -12 - 12 - m_l
print(f'música {m_l:.1f} LUFS → ganancia {G_M:+.1f} dB')
ins = ['-i', J('voz_proc.wav'), '-ss', f'{MUS_OFF:.3f}', '-t', f'{END_V + 0.5:.3f}', '-i', MUS]
fc = ['[0:a]aformat=channel_layouts=stereo[v]',
      f'[1:a]aresample={SR},equalizer=f=2200:t=o:w=1.6:g=-4,equalizer=f=350:t=o:w=1:g=-2,volume={G_M:.2f}dB,'
      f'afade=t=in:st=0:d=0.25,afade=t=out:st={END_V - 0.9:.3f}:d=0.9[m]']
mixes = ['[v]', '[m]']
for i, (name, t, g) in enumerate(SFX):
    ins += ['-i', J('sfx', f'{name}.wav')]
    d = max(0, round((t - PEAK[name]) * 1000))
    trim = f'atrim=start={PEAK[name] - t:.3f},asetpts=PTS-STARTPTS,' if t < PEAK[name] else ''
    fc.append(f'[{i + 2}:a]{trim}aresample={SR},volume={g}dB,adelay={d}|{d}[s{i}]'); mixes.append(f'[s{i}]')
fc.append(f"{''.join(mixes)}amix=inputs={len(mixes)}:normalize=0:duration=first,atrim=0:{END_V}[mix]")
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + ins + ['-filter_complex', ';'.join(fc), '-map', '[mix]', '-c:a', 'pcm_f32le', J('mix_pre.wav')], check=True)

# 4) master: ganancia lineal a −11 LUFS + limitador sobremuestreado
g = -11 - lufs(J('mix_pre.wav'))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', J('mix_pre.wav'), '-af',
                f'volume={g:.2f}dB,aresample=192000,alimiter=limit=0.84:attack=1:release=80:level=disabled,aresample=48000',
                '-c:a', 'pcm_f32le', J('mix.wav')], check=True)
print(f'master: ganancia {g:+.1f} dB')

# control
r = stats(J('voz_raw.wav')); p = stats(J('voz_proc.wav'))
print(f'voz cruda: {r[0]:.1f} LUFS, LRA {r[1]:.1f} LU  →  procesada: {p[0]:.1f} LUFS, LRA {p[1]:.1f} LU, pico {p[2]:.1f} dBFS')
for nm, a, d in [('hook', 0, OUTS[2]), ('cuerpo', OUTS[2], T_CTA - OUTS[2]), ('CTA', T_CTA, END_V - T_CTA)]:
    print(f'{nm:7s} voz {lufs(J("voz_proc.wav"), a, d):6.1f} LUFS · mezcla {lufs(J("mix.wav"), a, d):6.1f} LUFS')
mus_only = ['ffmpeg', '-v', 'error', '-y', '-ss', f'{MUS_OFF:.3f}', '-t', f'{END_V:.3f}', '-i', MUS, '-af',
            f'equalizer=f=2200:t=o:w=1.6:g=-4,equalizer=f=350:t=o:w=1:g=-2,volume={G_M:.2f}dB', '-c:a', 'pcm_f32le', J('_mus.wav')]
subprocess.run(mus_only, check=True)
print(f'música en la mezcla: {lufs(J("_mus.wav")):.1f} LUFS (voz −12) · master {lufs(J("mix.wav")):.1f} LUFS')
os.remove(J('_mus.wav'))
