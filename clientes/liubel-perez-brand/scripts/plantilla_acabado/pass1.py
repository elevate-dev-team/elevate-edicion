# Pase 1: base 1080x1920 con zooms. En los planos de Liubel el zoom se ancla a los ojos (x0 = ojo·(1−1/s)),
# así los ojos quedan en el mismo punto de pantalla en cualquier escala → cortes y zooms continuos limpios en x e y.
import json, subprocess, numpy as np
from PIL import Image
from timeline import *

SW, SH = 2160, 3840
GRADE = ('colorlevels=rimin=0.030:gimin=0.030:bimin=0.030,eq=contrast=1.05:saturation=1.15,'
         'unsharp=lx=13:ly=13:la=0.35,format=yuv420p')

def load_track(path, off):
    rows = [l.split() for l in open(path)]
    t = np.array([float(r[0]) for r in rows])
    cols = np.array([[float(x) for x in r[1:7]] for r in rows])  # cx top bottom w ex ey
    # suavizado: mediana 3 + media móvil 5 (saca el temblor de la detección sin retrasar)
    sm = cols.copy()
    for c in range(cols.shape[1]):
        v = cols[:, c]; med = np.array([np.median(v[max(0, i - 1):i + 2]) for i in range(len(v))])
        k = 5; pad = np.pad(med, k // 2, mode='edge'); sm[:, c] = np.convolve(pad, np.ones(k) / k, 'valid')
    return t, sm

TR = {'IMG_2119': load_track(os.path.join(A, 'f3_2119.txt'), 0), 'IMG_2127': load_track(os.path.join(A, 'f3_2127.txt'), 0)}

def face_at(clip, ts):
    t, sm = TR[clip]
    return [np.interp(ts, t, sm[:, c]) for c in range(sm.shape[1])]  # cx top bottom w ex ey

enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1080x1920', '-r', str(FPS),
                        '-i', '-', '-vf', GRADE, '-c:v', 'libx264', '-crf', '12', '-preset', 'medium', os.path.join(A, 'base.mov')],
                       stdin=subprocess.PIPE)
info = []   # por frame: datos de cara en pantalla para el pase 2
nframe = 0
for seg in SEGS:
    v0, v1, clip, _, kind, (s0, s1) = seg
    f0, f1 = round(v0 * FPS), round(v1 * FPS)
    n = f1 - f0
    st0 = src_time(clip, f0 / FPS, seg)
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', f'{st0:.4f}', '-i', os.path.join(V, clip + '.MOV'), '-frames:v', str(n),
                            '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    for i in range(n):
        buf = dec.stdout.read(SW * SH * 3)
        if len(buf) < SW * SH * 3:   # fin del clip: repetir el último frame
            buf = last
        last = buf
        u = i / max(1, n - 1)
        s = s0 + (s1 - s0) * u
        rec = {'f': f0 + i, 'kind': kind}
        if kind == 'talk':
            cx, top, bot, fw, ex, ey = face_at(clip, src_time(clip, (f0 + i) / FPS, seg))
            x0, y0 = ex * (1 - 1 / s), ey * (1 - 1 / s)
            k = s * 1080 / SW
            rec.update(s=s, eye=[(ex - x0) * k, (ey - y0) * k], top=(top - y0) * k, bot=(bot - y0) * k,
                       hair=(top - 0.30 * (bot - top) - y0) * k, cx=(cx - x0) * k, fw=fw * k)
        else:
            x0, y0 = SW / 2 * (1 - 1 / s), SH / 2 * (1 - 1 / s)
        im = Image.frombuffer('RGB', (SW, SH), buf, 'raw', 'RGB', 0, 1)
        out = im.resize((1080, 1920), Image.LANCZOS, box=(x0, y0, x0 + SW / s, y0 + SH / s))
        enc.stdin.write(out.tobytes())
        info.append(rec); nframe += 1
    dec.stdout.close(); dec.wait()
    print(f'{v0:6.2f}-{v1:6.2f} {clip} {kind} s {s0}->{s1} frames {n}', flush=True)
enc.stdin.close(); enc.wait()
json.dump(info, open(os.path.join(A, 'frames.json'), 'w'))
print('total frames', nframe, 'esperado', round(END_V * FPS))
