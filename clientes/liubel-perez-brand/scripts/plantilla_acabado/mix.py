# Mezcla: voz (2 compresores, −16 LUFS por tramo) + música (−20 dB bajo la voz con hueco en la banda de la voz;
# protagonista en el cuerpo) + SFX con el PICO clavado en cada evento → master −11 LUFS / ≤ −1 dBTP.
import os
import json, re, subprocess
from timeline import *

_RUTAS = __import__('json').load(open(os.path.expanduser('~/.claude/elevate/config.json')))['rutas']  # ver configuracion-inicial
MUS = os.path.join(_RUTAS['HERRAMIENTAS'], 'Stock Musica/Pop alegre/Pop-alegre_Drive-Me-Crazy_Onaldin_3m00s.wav')  # tema elegido para ese video: cambiar por el de cada pieza
PEAK = {'pop': 0.15, 'whoosh': 0.34, 'swipe': 0.68, 'check': 0.38, 'riser': 2.75}   # dónde cae el pico de cada archivo (medido)
J = lambda *p: os.path.join(A, *p)

def lufs(path, a=None, d=None):
    cmd = ['ffmpeg', '-hide_banner'] + (['-ss', str(a), '-t', str(d)] if a is not None else []) + ['-i', path, '-af', 'ebur128', '-f', 'null', '-']
    out = subprocess.run(cmd, capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', out)[-1])

# 1) voz procesada, por tramo. La voz cruda llega MUY baja (−43/−40 LUFS): primero ganancia a −20 LUFS para que
#    el compresor trabaje (umbral −24 dB), y el reductor de ruido con el piso REAL de cada toma (no −25: se comía la voz).
#    ruido medido en pausas: hook −75 dB, CTA −62,5 dB (crudo).
V_TARGET = -12
def voice_chain(a, d, noise_raw, out):
    pre = -20 - lufs(J('voz_raw.wav'), a, d)
    nf = round(noise_raw + pre)
    ch = (f'volume={pre:.2f}dB,highpass=f=90,afftdn=nr=10:nf={nf}:tn=1,'
          'equalizer=f=250:t=o:w=1.2:g=-2.5,equalizer=f=3200:t=o:w=1.4:g=3,highshelf=f=9000:g=1.5,'
          'acompressor=threshold=-24dB:ratio=3.5:attack=5:release=90:makeup=4,'
          'acompressor=threshold=-14dB:ratio=2.5:attack=3:release=60:makeup=1,'
          'alimiter=limit=0.5:attack=2:release=50:level=disabled')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(a), '-t', str(d), '-i', J('voz_raw.wav'), '-af', ch, '-c:a', 'pcm_s24le', out], check=True)
    g = V_TARGET - lufs(out)
    print(f'voz {a:5.1f}s: pre {pre:+.1f} dB, piso de ruido {nf} dB, ganancia final {g:+.1f} dB')
    return g
gh = voice_chain(0, DROP_V, -75, J('voz_h.wav'))
gc = voice_chain(CTA_V, END_V - CTA_V, -62.5, J('voz_c.wav'))
cd = round(CTA_V * 1000)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', J('voz_h.wav'), '-i', J('voz_c.wav'), '-filter_complex',
                f'[0:a]volume={gh:.2f}dB[a];[1:a]volume={gc:.2f}dB,adelay={cd}[b];[a][b]amix=inputs=2:normalize=0,apad=whole_dur={END_V}',
                '-c:a', 'pcm_s24le', J('voz_proc.wav')], check=True)
gh = gc = 0.0

# 2) música: niveles medidos del tema en cada tramo
mh = lufs(MUS, MUS_OFFSET, DROP_V); mb = lufs(MUS, MUS_OFFSET + DROP_V, CTA_V - DROP_V); mc = lufs(MUS, MUS_OFFSET + CTA_V, END_V - CTA_V)
G_TALK_H, G_BODY, G_TALK_C = V_TARGET - 20 - mh, V_TARGET - mb, V_TARGET - 20 - mc   # habla: música 20 dB abajo; cuerpo: al nivel de la voz
print(f'música: hook {G_TALK_H:+.1f} dB, cuerpo {G_BODY:+.1f} dB, CTA {G_TALK_C:+.1f} dB')
# dos copias: "talk" (con hueco de EQ en 1–4 kHz) y "body" (limpia); se cruzan en el drop y antes del CTA
talk_vol = (f"volume='if(lt(t,{DROP_V}),{10**(G_TALK_H/20)},if(lt(t,{CTA_V}-0.2),0,"
            f"if(lt(t,{CTA_V}),{10**(G_TALK_C/20)}*(t-({CTA_V}-0.2))/0.2,{10**(G_TALK_C/20)})))':eval=frame")
body_vol = (f"volume='if(lt(t,{DROP_V}),0,if(lt(t,{CTA_V}-0.2),{10**(G_BODY/20)},"
            f"if(lt(t,{CTA_V}),{10**(G_BODY/20)}*({CTA_V}-t)/0.2,0)))':eval=frame")

ins = ['-i', J('voz_proc.wav'), '-ss', f'{MUS_OFFSET:.3f}', '-t', f'{END_V:.3f}', '-i', MUS]
fc = [f"[0:a]volume='if(lt(t,20),{10**(gh/20)},{10**(gc/20)})':eval=frame,aformat=channel_layouts=stereo[v]",
      "[1:a]asplit=2[m1][m2]",
      f"[m1]equalizer=f=2200:t=o:w=1.6:g=-6,equalizer=f=350:t=o:w=1:g=-2,{talk_vol}[mt]",
      f"[m2]{body_vol}[mb]"]
mixes = ['[v]', '[mt]', '[mb]']
for i, (name, t, g) in enumerate(SFX):
    ins += ['-i', J('sfx', f'{name}.wav')]
    d = max(0, round((t - PEAK[name]) * 1000))
    fc.append(f'[{i + 2}:a]volume={g}dB,adelay={d}|{d}[s{i}]'); mixes.append(f'[s{i}]')
fc.append(f"{''.join(mixes)}amix=inputs={len(mixes)}:normalize=0:duration=first,afade=t=out:st={END_V - 0.25}:d=0.25,atrim=0:{END_V}[mix]")
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + ins + ['-filter_complex', ';'.join(fc), '-map', '[mix]', '-c:a', 'pcm_s24le', J('mix_pre.wav')], check=True)

# 3) master: ganancia LINEAL hasta −11 LUFS + limitador suave a −1,5 dBTP
#    (antes: loudnorm, que con los picos de la voz sin comprimir aplastaba la voz contra la música)
g = -11 - lufs(J('mix_pre.wav'))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', J('mix_pre.wav'), '-af',
                f'volume={g:.2f}dB,alimiter=limit=0.84:attack=1:release=80:level=disabled,aresample=48000', '-c:a', 'pcm_s24le', J('mix.wav')], check=True)
print(f'master: ganancia {g:+.1f} dB')
# control: voz vs música en cada tramo
for nm, a, d in [('hook', 0, DROP_V), ('cuerpo', DROP_V, CTA_V - DROP_V), ('CTA', CTA_V, END_V - CTA_V)]:
    print(f'{nm}: mezcla {lufs(J("mix.wav"), a, d):.1f} LUFS')
print('master', lufs(J('mix.wav')))
