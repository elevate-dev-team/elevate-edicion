"""Mapea cada cuadro de un export (corte del usuario) al tiempo de la grabación original de donde salió.
Sirve para rearmar en alta un tramo que el usuario montó con una grabación de pantalla (o cualquier clip) escalada,
recortada o con bandas negras: dice qué pedazo de la fuente va en cada tramo del export.

  <python del entorno align> mapear_grabacion.py <export.mp4> <fuente.mp4> <desde_s> <hasta_s> [crop]
    desde/hasta : tramo del export donde aparece la fuente.
    crop        : región de la fuente dentro del export, formato ffmpeg "w:h:x:y" (ej. "884:1920:98:0" si la
                  grabación quedó escalada al alto con bandas negras). Medirla en un cuadro del export.
Salida: un renglón por tramo continuo → "export a–b  <=  fuente c–d  (desfase, error)", a velocidad real.
Error medio > ~20 (sobre 255²) = el cuadro no está en la fuente (transición, título encima): revisarlo a ojo.

Caso real: DC 06-10 (2026-10-20). El export usaba la grabación de iPhone 1320×2868 escalada a 884×1920 en tres
tramos (URL → "Verify a License" → número y resultado). Con el mapa se cortaron los mismos pedazos de la grabación
original en alta (s1/s2/s3) y se pusieron en una ventana sobre el fondo de marca con cámara virtual.
Requiere numpy (el entorno align lo tiene).
"""
import subprocess, sys
import numpy as np

exp, src, t0, t1 = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
crop = sys.argv[5] if len(sys.argv) > 5 else None
GW, GH, FPS = 48, 104, 30

def frames(path, vf, ss=None, to=None):
    cmd = ['ffmpeg', '-v', 'error']
    if ss is not None: cmd += ['-ss', str(ss), '-to', str(to)]
    cmd += ['-i', path, '-vf', vf, '-f', 'rawvideo', '-']
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, GH, GW).astype(np.float32)

efps = float(eval(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=r_frame_rate',
                                  '-of', 'csv=p=0', exp], capture_output=True, text=True).stdout.strip()))
pre = f'crop={crop},' if crop else ''
E = frames(exp, f'{pre}scale={GW}:{GH},format=gray', t0, t1)
R = frames(src, f'fps={FPS},scale={GW}:{GH},format=gray')

match = []
for i, f in enumerate(E):
    d = ((R - f) ** 2).mean((1, 2))
    j = int(d.argmin())
    match.append((t0 + i / efps, j / FPS, float(d[j])))

# tramos continuos: desfase (fuente − export) suavizado con mediana; un salto > 0,8 s es un corte del usuario.
# (Las pantallas quietas dan coincidencias ruidosas cuadro a cuadro: por eso se suaviza antes de cortar.)
off = np.array([m[1] - m[0] for m in match])
k = 7
sm = np.array([np.median(off[max(0, i - k):i + k + 1]) for i in range(len(off))])
cuts = [0] + [i for i in range(1, len(sm)) if abs(sm[i] - sm[i - 1]) > 0.8] + [len(sm)]
for a_, b_ in zip(cuts[:-1], cuts[1:]):
    s = match[a_:b_]
    a, b = s[0][0], s[-1][0] + 1 / efps
    o = float(np.median(off[a_:b_]))
    err = np.mean([x[2] for x in s])
    print(f'export {a:6.2f}–{b:6.2f}  <=  fuente {a + o:6.2f}–{b + o:6.2f}  (desfase {o:+.2f} s, error {err:.0f})')
