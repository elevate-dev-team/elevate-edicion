#!/usr/bin/env python3
"""
Prepara un video crudo de Yanira Team para editar en Remotion.

  python3 prep_video.py <video_crudo.mov> <carpeta_trabajo> [--th -41] [--start 0] [--end 0]

Pasos:
  1. HDR (HLG de iPhone) -> SDR con avconvert (macOS). Si ya es SDR, se usa tal cual.
  2. Envolvente RMS (50 ms) -> segmentos con voz -> corte de silencios
     (colchón de 0.06 s antes / 0.10 s después; huecos < 0.12 s se fusionan para evitar tartamudeos).
  3. Render del intermedio vertical 2160x3840 30 fps + voz procesada
     (HPF 80 Hz, afftdn, compresor 3:1, presencia +2 dB @3.5 kHz, loudnorm -16).
  4. Transcripción por palabra con whisper-cli (large-v3-turbo) sobre el audio YA cortado.
  5. Escribe cut.mp4 y edit.json ({cuts, words}) listos para template/public y template/src/data.

Requiere: ffmpeg, whisper-cli (brew install whisper-cpp), modelo en ~/.cache/whisper/ggml-large-v3-turbo.bin
"""
import json, math, os, struct, subprocess, sys, wave, argparse

p = argparse.ArgumentParser()
p.add_argument('src'); p.add_argument('work')
p.add_argument('--th', type=float, default=-41, help='umbral de voz en dBFS (subir si hay mucho ruido)')
p.add_argument('--start', type=float, default=0); p.add_argument('--end', type=float, default=0)
p.add_argument('--prompt', default='Yanira Team, mortgage, down payment, WhatsApp, plusvalía, closing, realtor.')
a = p.parse_args()
os.makedirs(a.work, exist_ok=True)
W = lambda n: os.path.join(a.work, n)
run = lambda cmd: subprocess.run(cmd, check=True)

# 1. HDR -> SDR
trc = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=color_transfer',
                      '-of', 'csv=p=0', a.src], capture_output=True, text=True).stdout.strip()
sdr = a.src
if trc in ('arib-std-b67', 'smpte2084'):
    print('> HDR detectado (%s): tonemap con avconvert' % trc)
    sdr = W('sdr.mov')
    run(['avconvert', '-s', a.src, '-p', 'PresetHighestQuality', '-o', sdr, '--replace'])

# 2. RMS + segmentos
run(['ffmpeg', '-v', 'error', '-y', '-i', sdr, '-map', '0:a:0', '-ac', '1', '-ar', '16000', W('audio16k.wav')])
wv = wave.open(W('audio16k.wav')); n = wv.getnframes(); sr = wv.getframerate()
data = struct.unpack('<%dh' % n, wv.readframes(n)); STEP = 0.05; win = int(sr * STEP)
rms = []
for i in range(0, n, win):
    seg = data[i:i + win]
    r = math.sqrt(sum(x * x for x in seg) / max(1, len(seg)))
    rms.append(20 * math.log10(r / 32768 + 1e-9))
end = a.end or len(rms) * STEP
regs = []
for i, v in enumerate(rms):
    t = i * STEP
    if v <= a.th or t < a.start or t > end: continue
    if regs and t - regs[-1][1] <= 0.20: regs[-1][1] = t + STEP
    else: regs.append([t, t + STEP])
regs = [r for r in regs if r[1] - r[0] >= 0.12]
keep = []
for s0, e0 in regs:
    s0 = max(0, s0 - 0.06); e0 = e0 + 0.10
    if keep and s0 - keep[-1][1] < 0.12: keep[-1][1] = e0
    else: keep.append([s0, e0])
keep = [k for k in keep if k[1] - k[0] > 0.3]
json.dump(keep, open(W('keep.json'), 'w'))
print('> %d segmentos, %.2fs de %.2fs' % (len(keep), sum(e - s for s, e in keep), len(rms) * STEP))

# 3. Intermedio
parts, cat = [], ''
for i, (s0, e0) in enumerate(keep):
    d = e0 - s0
    parts.append(f"[0:v]trim={s0}:{e0},setpts=PTS-STARTPTS[v{i}];[0:a]atrim={s0}:{e0},asetpts=PTS-STARTPTS,"
                 f"afade=t=in:d=0.012,afade=t=out:st={d - 0.015:.3f}:d=0.015[a{i}]")
    cat += f'[v{i}][a{i}]'
fc = ';'.join(parts) + (f';{cat}concat=n={len(keep)}:v=1:a=1[vc][ac];'
      '[vc]fps=30,scale=2160:3840:flags=lanczos,format=yuv420p[vo];'
      '[ac]highpass=f=80,afftdn=nf=-45,acompressor=threshold=-22dB:ratio=3:attack=8:release=120:makeup=4,'
      'equalizer=f=3500:t=q:w=1.2:g=2,loudnorm=I=-16:TP=-1.5:LRA=9[ao]')
open(W('fc.txt'), 'w').write(fc)
run(['ffmpeg', '-v', 'error', '-y', '-i', sdr, '-filter_complex_script', W('fc.txt'), '-map', '[vo]', '-map', '[ao]',
     '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', W('cut.mp4')])

# 4. Transcripción
run(['ffmpeg', '-v', 'error', '-y', '-i', W('cut.mp4'), '-ac', '1', '-ar', '16000', W('cut16k.wav')])
model = os.path.expanduser('~/.cache/whisper/ggml-large-v3-turbo.bin')
subprocess.run(['whisper-cli', '-m', model, '-f', W('cut16k.wav'), '-l', 'es', '-ojf', '-of', W('cutwords'),
                '-ml', '1', '-sow', '-np', '--prompt', a.prompt], check=True, capture_output=True)
raw = json.load(open(W('cutwords.json')))
FIX = {'YaNira': 'Yanira', 'Jeanira': 'Yanira', 'Llanira': 'Yanira'}
words = []
for s in raw['transcription']:
    t = s['text'].strip()
    if not t: continue
    for k, v in FIX.items(): t = t.replace(k, v)
    words.append({'t': t, 's': round(s['offsets']['from'] / 1000, 2), 'e': round(s['offsets']['to'] / 1000, 2)})

# 5. edit.json
acc, cuts = 0, []
for s0, e0 in keep:
    acc += e0 - s0; cuts.append(round(acc, 3))
json.dump({'cuts': cuts[:-1], 'words': words}, open(W('edit.json'), 'w'), ensure_ascii=False)
print('> listo: %s y %s' % (W('cut.mp4'), W('edit.json')))
print(' '.join(f"{w['s']:.2f}:{w['t']}" for w in words))
