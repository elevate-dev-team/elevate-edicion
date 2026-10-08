"""Detecta y corrige el "efecto niebla" de lente sucia (Liubel graba con la cámara del iPhone sucia: negros lavados,
contraste bajo y destellos que se estiran alrededor de las luces). Caso real: reel 21-09 LIU (2026-10-08).

  Detectar:  ~/venvs/align/bin/python niebla.py medir <video> [<video> …]
     → por toma: velo (percentil 0,5 del canal mínimo, 0–255), p99 de luminancia y veredicto.
       Velo ≤ 8 limpio · 9–14 leve · ≥ 15 niebla (corregir). Medido en 21-09: IMG_2003 17, 2007 11, 2008 21, 2009 25, 2018 40.
  Corregir (desde Python, por frame, ya escalado a 1080x1920):
       from niebla import deniebla; out = deniebla(pil_img, velo)
     Resta el velo como luz difusa (modelo de neblina: J = (I − v)/(1 − v/255)) con el velo limitado al canal mínimo
     local (no aplasta lo que ya es oscuro), y devuelve contraste local; después va el grade de marca (eq + unsharp).
"""
import subprocess, sys
import numpy as np
from PIL import Image, ImageFilter

def medir(path, n=6):
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
                               capture_output=True, text=True).stdout)
    vs, hs = [], []
    for k in range(n):
        t = dur * (k + 0.5) / n
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', path, '-frames:v', '1', '-vf', 'scale=540:960',
                              '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
        a = np.frombuffer(raw, np.uint8).reshape(960, 540, 3).astype(np.float32)
        vs.append(np.percentile(a.min(axis=2), 0.5)); hs.append(np.percentile(a.mean(axis=2), 99))
    v = float(np.median(vs)); h = float(np.median(hs))
    ver = 'limpio' if v <= 8 else 'leve' if v < 15 else 'NIEBLA'
    return v, h, ver

def deniebla(img, velo, fuerza=0.9):
    a = np.asarray(img.convert('RGB'), np.float32)
    h, w = a.shape[:2]
    mn = Image.fromarray(a.min(axis=2).astype(np.uint8)).resize((w // 8, h // 8), Image.BILINEAR)
    mn = mn.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(4)).resize((w, h), Image.BILINEAR)
    v = np.minimum(np.asarray(mn, np.float32), velo * fuerza)[..., None]     # velo local, nunca más que el medido
    j = (a - v) / np.maximum(1 - v / 255.0, 0.05)
    return Image.fromarray(np.clip(j, 0, 255).astype(np.uint8))

if __name__ == '__main__' and sys.argv[1] == 'medir':
    for p in sys.argv[2:]:
        v, h, ver = medir(p); print(f'{p.split("/")[-1]}: velo {v:.0f} · p99 {h:.0f} → {ver}')
