"""Portada DAE 01-12 sobre el living vacío (IMG_3406 10,3 s, cuadro elegido por Tomi), título 1. Sin persona: la casa es
el sujeto (nítida, luminosa, sin velo); degradé azul de marca arriba (detrás del título) y navy abajo fuera del cuadrado.
   ~/venvs/align/bin/python portada_living.py [guias|solotexto]"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops
sys.argv = [sys.argv[0], '1'] + sys.argv[1:]
src = open('portada_pauta.py').read().split('im, pelo = imagen()')[0]
exec(src)
MODO = sys.argv[2] if len(sys.argv) > 2 else ''
base = Image.open('cand/living_4k.jpg').convert('RGB').resize((W, H), Image.LANCZOS)
base = ImageEnhance.Brightness(base).enhance(1.04)
base = ImageEnhance.Contrast(base).enhance(1.06)
base = ImageEnhance.Color(base).enhance(1.06).filter(ImageFilter.UnsharpMask(2, 60, 2))
bg = A(base)
top = np.clip(1 - yy / 1080, 0, 1) ** 1.1 * 0.88
bot = np.clip((yy - 1480) / 440, 0, 1) ** 1.5 * 0.7
bg = bg * (1 - top[..., None]) + AZUL * top[..., None]
bg = bg * (1 - bot[..., None]) + NAVY * bot[..., None]
im = Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).convert('RGBA')
if MODO == 'solotexto': im = Image.new('RGBA', (W, H), (0, 0, 0, 255))
capas = [linea(r) for r in LINEAS]; gaps = [24, 28]
alto = sum(c[2] for c in capas) + sum(gaps)
base_y = 640 - alto + capas[0][2] + 110   # bloque arriba del cuadrado, sobre el techo, antes de la pared del fondo
txt = Image.new('RGBA', (W, H))
for i, (capa, bl, cap) in enumerate(capas):
    if i: base_y += gaps[i - 1] + cap
    txt.alpha_composite(capa, (int(540 - capa.size[0] / 2), int(base_y - bl)))
    print(LINEAS[i][0][0], 'base', base_y, 'ancho', capa.size[0])
sombra = Image.new('RGBA', (W, H), (4, 14, 40, 0)); sombra.putalpha(txt.getchannel('A').point(lambda a: int(a * 0.75)))
sombra = ImageChops.offset(sombra.filter(ImageFilter.GaussianBlur(10)), 0, 5)
if MODO != 'solotexto': im.alpha_composite(sombra)
im.alpha_composite(txt)
out = 'portada_living' + (f'_{MODO}.png' if MODO else '.png')
im.convert('RGB').save(out); print(out)
