# Uso: python portada_0711.py [guias|solotexto|final] [salida.jpg] — en la carpeta con base2.jpg, mascara.png y fondo.jpg (portadas-reels)
# Portada REB 07-11 — basada en portadas-reels/scripts/portada_pil.py (sujeto aislado y más luminoso, degradés verde oscuro)
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
F = os.path.expanduser(os.environ.get('FUENTES', '~/remotion-local/public/fonts/'))  # carpeta con las Montserrat .ttf
W, H = 1080, 1920
WHITE = (255, 255, 255); VERDE = (93, 135, 118); OSC = (30, 45, 40)
MODE = sys.argv[1] if len(sys.argv) > 1 else ''
OUT = sys.argv[2] if len(sys.argv) > 2 else 'portada.jpg'  # {CARPETA_CLIENTE}/01 REELS/<video>/PORTADA/<video>.jpg
TEXT_TOP = 792   # cabeza hasta y≈766 (medida 726 + 40 de corrimiento)
A = lambda im: np.asarray(im, np.float32)
base = Image.open('base2.jpg').convert('RGB')
mk_img = Image.open('mascara.png').convert('L').resize((W, H)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
mk = A(mk_img) / 255
yy, xx = np.mgrid[0:H, 0:W]
fondo = ImageEnhance.Color(ImageEnhance.Brightness(Image.open('fondo.jpg').convert('RGB').filter(ImageFilter.GaussianBlur(4))).enhance(0.80)).enhance(0.92)
near = A(Image.fromarray((mk * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(10))) / 255
bg = A(fondo) * (1 - near[..., None]) + A(ImageEnhance.Brightness(base).enhance(0.80)) * near[..., None]
glow = np.exp(-(((xx - 590) / 330) ** 2 + ((yy - 600) / 380) ** 2))[..., None] * 0.2
bg = bg * (1 - glow) + np.array([255, 236, 210], np.float32) * glow
top = np.clip(1 - yy / 560, 0, 1) ** 1.6 * 0.62
bot = np.clip((yy - 1150) / 770, 0, 1) ** 1.3 * 0.8
for gr in (top, bot):
    bg = bg * (1 - gr[..., None]) + np.array(OSC, np.float32) * gr[..., None]
sub = Image.fromarray(np.clip(255 * (A(base) / 255) ** 0.88, 0, 255).astype(np.uint8))
sub = ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(sub).enhance(1.10)).enhance(1.08)).enhance(1.05)
sa = A(sub); sa[..., 0] *= 1.02; sa[..., 2] *= 0.98
bl = np.clip((yy - 1500) / 420, 0, 1)[..., None] * 0.5
sa = sa * (1 - bl) + np.array(OSC, np.float32) * bl
mk_in = A(mk_img.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2.5))) / 255
mid = A(ImageEnhance.Brightness(base).enhance(0.9))
img = bg * (1 - mk[..., None]) + mid * (mk - mk_in)[..., None].clip(0, 1) + sa * mk_in[..., None]
img = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA')

def render(parts, stroke=0):
    ps = []
    for txt, fn, sz, col in parts:
        f = ImageFont.truetype(F + fn, sz); tr = -0.04 * sz
        ps.append((txt, f, col, sum(f.getlength(c) for c in txt) + tr * (len(txt) - 1), tr))
    tw = sum(p[3] for p in ps); asc = max(p[1].getmetrics()[0] for p in ps)
    im = Image.new('RGBA', (int(tw) + 80, 420), (0, 0, 0, 0)); d = ImageDraw.Draw(im); x = 40
    for txt, f, col, w, tr in ps:
        for c in txt:
            d.text((x, 60 + asc), c, font=f, fill=col, anchor='ls', stroke_width=stroke, stroke_fill=WHITE); x += f.getlength(c) + tr
    bb = im.getbbox(); cap = min(p[1].getbbox('H', anchor='ls')[1] for p in ps) + 60 + asc
    return im.crop(bb), 60 + asc - bb[1], cap - bb[1]
SZ = 78
l1 = render([('En la visita,', 'Montserrat-Medium.ttf', SZ, WHITE)])
l2 = render([('no mires ', 'Montserrat-Medium.ttf', SZ, WHITE), ('solo', 'Montserrat-Black.ttf', SZ, WHITE), (' el', 'Montserrat-Medium.ttf', SZ, WHITE)])
gs = 140
while True:
    l3 = render([('APARTAMENTO', 'Montserrat-Black.ttf', gs, VERDE)], stroke=9)
    if l3[0].width <= 850: break
    gs -= 2
# por línea de base: interlineado apretado
b1 = 0
b2 = b1 + int(SZ * 0.98)
b3 = b2 + 42 + (l3[1] - l3[2])            # tope de las mayúsculas del golpe 42 px bajo la base de la línea 2: con 10 el contorno blanco tocaba "solo el" (corrección de Tomi, 05-11)
pos = [b1 - l1[1], b2 - l2[1], b3 - l3[1]]
shift = TEXT_TOP - min(pos)
block = Image.new('RGBA', (W, H), (0, 0, 0, 0))
for s, p in zip((l1, l2, l3), pos):
    block.alpha_composite(s[0], (int(540 - s[0].width / 2), int(p + shift)))
a = block.split()[3].point(lambda v: int(v * 0.85)); sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sh.putalpha(a)
sh = sh.filter(ImageFilter.GaussianBlur(12)); txt = Image.new('RGBA', (W, H), (0, 0, 0, 0))
txt.alpha_composite(sh, (0, 6)); txt.alpha_composite(block)
print('golpe', gs, 'px; bloque', block.getbbox())
if MODE == 'solotexto':
    out = Image.new('RGBA', (W, H), (0, 0, 0, 255)); out.alpha_composite(txt); out.convert('RGB').save('solo_texto.png'); sys.exit()
bb = block.getbbox(); cy = (bb[1] + bb[3]) / 2
halo = np.exp(-(((xx - 540) / 520) ** 2 + ((yy - cy) / 190) ** 4)) * 0.55
hl = Image.fromarray(np.zeros((H, W, 4), np.uint8)); ha = np.zeros((H, W, 4), np.float32); ha[..., :3] = OSC; ha[..., 3] = halo * 255
img.alpha_composite(Image.fromarray(ha.astype(np.uint8)))
img.alpha_composite(txt)
if MODE == 'guias':
    d = ImageDraw.Draw(img); d.rectangle((0, 420, 1079, 1500), outline=(0, 255, 0, 255), width=4); d.rectangle((100, 520, 980, 1400), outline=(255, 220, 0, 255), width=3)
    img.convert('RGB').save('guias.jpg', quality=92); sys.exit()
img.convert('RGB').save(OUT, quality=95)
