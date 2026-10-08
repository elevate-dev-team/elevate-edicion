# Uso: copiar a PROYECTO/portada/, armar base.jpg (cuadro del video recortado), mascara.png (recorte_personas.swift) y fondo.jpg (fondo_limpio.swift); ajustar TEXT_TOP (mentón o mano), LINES y OUT. Modos: solotexto / guias.
# Portada 20-09 LIU — adaptación de portadas-reels/scripts/portada_pil.py a la guía de portadas de LIU:
# plano medio de Liubel sentado señalando a cámara (IMG_1999 11,6 s, s=1,25; elegido por el usuario), sujeto con más exposición que el fondo, degradés oscuros arriba/abajo
# que no pasan sobre el sujeto dentro del cuadrado, lockup TODO BLANCO en Capitana (Regular + Black) con sombra suave,
# pegado ~20 px bajo el mentón, interlineado por línea de base.
import os
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
F = os.path.expanduser('~/.claude/skills/liubel-perez-brand/assets/fonts/capitana/')
W, H = 1080, 1920
WHITE = (255, 255, 255); DARK = (9, 9, 10)          # negro de marca LIU #09090A
MODE = sys.argv[1] if len(sys.argv) > 1 else ''
OUT = '../../../PORTADA/20-09 LIU Deja de perder el tiempo repit.jpg'
# mentón medido en y=693, pero la mano que señala ocupa x 540–690, y 710–940 (justo bajo el mentón):
# el bloque no entra entre los dos → va pegado DEBAJO de la mano, sin tapar el gesto
HAND_BOTTOM = 940
TEXT_TOP = HAND_BOTTOM + 22

base = Image.open('base.jpg').convert('RGB')
A = lambda im: np.asarray(im, np.float32)
mk_img = Image.open('mascara.png').convert('L').resize((W, H)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
mk = A(mk_img) / 255
yy, xx = np.mgrid[0:H, 0:W]

# ---- fondo: relleno limpio, desenfoque leve, exposición abajo; junto al borde, el original bajado (sin halo) ----
fondo = Image.open('fondo.jpg').convert('RGB').filter(ImageFilter.GaussianBlur(4))
fondo = ImageEnhance.Color(ImageEnhance.Brightness(fondo).enhance(0.80)).enhance(0.92)
near = A(mk_img.filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(10))) / 255
base_dark = ImageEnhance.Brightness(base).enhance(0.80)
bg = A(fondo) * (1 - near[..., None]) + A(base_dark) * near[..., None]
glow = np.exp(-(((xx - 535) / 330) ** 2 + ((yy - 560) / 360) ** 2))[..., None] * 0.20      # luz cálida tras la cabeza
bg = bg * (1 - glow) + np.array([255, 236, 220], np.float32) * glow
top = np.clip(1 - yy / 560, 0, 1) ** 1.6 * 0.60
bot = np.clip((yy - 1150) / 770, 0, 1) ** 1.3 * 0.80
for gr in (top, bot):
    bg = bg * (1 - gr[..., None]) + np.array(DARK, np.float32) * gr[..., None]

# ---- sujeto con más exposición ----
sub = Image.fromarray(np.clip(255 * (A(base) / 255) ** 0.82, 0, 255).astype(np.uint8))
sub = ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(sub).enhance(1.14)).enhance(1.08)).enhance(1.06)
sa = A(sub); sa[..., 0] *= 1.02; sa[..., 2] *= 0.98
bl = np.clip((yy - 1500) / 420, 0, 1)[..., None] * 0.5               # solo piernas, fuera del cuadrado
sa = sa * (1 - bl) + np.array(DARK, np.float32) * bl
mk_in = A(mk_img.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2.5))) / 255
mid = A(ImageEnhance.Brightness(base).enhance(0.9))
img = bg * (1 - mk[..., None]) + mid * (mk - mk_in)[..., None].clip(0, 1) + sa * mk_in[..., None]
img = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA')

# ---- lockup (sistema LIU: línea chica Regular + golpe Black, todo blanco, sombra suave) ----
LINES = [
    [('¿Necesitas', 'Capitana Regular.otf', 66, WHITE)],
    [('un ', 'Capitana Regular.otf', 66, WHITE), ('20%', 'Capitana Black.otf', 222, WHITE)],
    [('para comprar ', 'Capitana Regular.otf', 52, WHITE), ('tu propiedad?', 'Capitana Black.otf', 52, WHITE)],
]
def render(line):
    """(sprite, y de la línea de base en el sprite, y del tope de las mayúsculas/cifras en el sprite)."""
    parts = []
    for txt, fn, sz, col in line:
        f = ImageFont.truetype(F + fn, sz); tr = -0.045 * sz
        parts.append((txt, f, col, sum(f.getlength(c) for c in txt) + tr * (len(txt) - 1), tr))
    tw = sum(p[3] for p in parts); asc = max(p[1].getmetrics()[0] for p in parts)
    im = Image.new('RGBA', (int(tw) + 80, asc + 200), (0, 0, 0, 0)); d = ImageDraw.Draw(im); x = 20
    for txt, f, col, w, tr in parts:
        for c in txt:
            d.text((x, 40 + asc), c, font=f, fill=col, anchor='ls'); x += f.getlength(c) + tr
    bb = im.getbbox(); cap = min(p[1].getbbox('H', anchor='ls')[1] for p in parts) + 40 + asc
    return im.crop(bb), 40 + asc - bb[1], cap - bb[1]
sp = [render(l) for l in LINES]
G = 0                                                     # línea de base del golpe ("un 20%")
pos = {1: G - sp[1][1]}
pos[0] = (G - (sp[1][1] - sp[1][2])) - 8 - sp[0][1]       # base de "¿Necesitas" 8 px sobre el tope del "20%"
pos[2] = G + 6 + (sp[2][1] - sp[2][2]) - sp[2][1]         # tope de la línea de abajo 6 px bajo la base del golpe
shift = TEXT_TOP - min(pos.values())
block = Image.new('RGBA', (W, H), (0, 0, 0, 0))
for i in pos:
    s = sp[i][0]; block.alpha_composite(s, (int(540 - s.width / 2), int(pos[i] + shift)))
a = block.split()[3].point(lambda v: int(v * 0.65)); sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sh.putalpha(a)
sh = sh.filter(ImageFilter.GaussianBlur(12)); txt = Image.new('RGBA', (W, H), (0, 0, 0, 0))
txt.alpha_composite(sh, (0, 6)); txt.alpha_composite(block)
if MODE == 'solotexto':
    out = Image.new('RGBA', (W, H), (0, 0, 0, 255)); out.alpha_composite(txt); out.convert('RGB').save('solo_texto.png'); sys.exit()
img.alpha_composite(txt)
if MODE == 'guias':
    d = ImageDraw.Draw(img); d.rectangle((0, 420, 1079, 1500), outline=(0, 255, 0, 255), width=4); d.rectangle((100, 520, 980, 1400), outline=(255, 220, 0, 255), width=3)
    img.convert('RGB').save('guias.jpg', quality=92); sys.exit()
img.convert('RGB').save(OUT, quality=95); print('ok', OUT, 'TEXT_TOP', TEXT_TOP)
