# Caso real: AR 08-10 (2026-11-10). Uso: ver SKILL.md sección 12.
# portada_ar.py <A|B> [guias|solotexto] — AR 08-10 "Señales de que tu casa se quedó chica"
# Guía AR: texto ARRIBA de la cabeza (caja roja + golpe en degradé champagne), degradé bordó arriba, sujeto más luminoso.
import os, sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
K = sys.argv[1]; MODE = sys.argv[2] if len(sys.argv) > 2 else ''
F = os.path.expanduser('~/remotion-local/public/fonts/')
W, H = 1080, 1920
RED = (171, 49, 48); BORD = (104, 25, 32); ONYX = (18, 18, 18); WHITE = (255, 255, 255)
HAIR = {'A': 917, 'B': 930}[K]
A = lambda im: np.asarray(im, np.float32)
base = Image.open(f'base{K}.jpg').convert('RGB')
mk_img = Image.open(f'mask{K}.png').convert('L').resize((W, H)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
mk = A(mk_img) / 255
yy, xx = np.mgrid[0:H, 0:W]
fondo = Image.open(f'fondo{K}.jpg').convert('RGB').filter(ImageFilter.GaussianBlur(4))
fondo = ImageEnhance.Color(ImageEnhance.Brightness(fondo).enhance(0.80)).enhance(0.92)
near = A(Image.fromarray((mk * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(10))) / 255
bg = A(fondo) * (1 - near[..., None]) + A(ImageEnhance.Brightness(base).enhance(0.80)) * near[..., None]
cx = 540
glow = np.exp(-(((xx - cx) / 330) ** 2 + ((yy - (HAIR + 160)) / 360) ** 2))[..., None] * 0.20
bg = bg * (1 - glow) + np.array([255, 236, 220], np.float32) * glow
# degradé bordó arriba que se funde con la foto (hasta un poco debajo del texto) + oscuro abajo fuera del cuadrado
top = np.clip(1 - yy / (HAIR + 120), 0, 1) ** 1.25 * 0.92
topc = np.where(yy[..., None] < 260, np.array(ONYX, np.float32), np.array(BORD, np.float32))
mixc = np.clip(yy / 520, 0, 1)[..., None]
col = np.array(ONYX, np.float32) * (1 - mixc) + np.array(BORD, np.float32) * mixc
bg = bg * (1 - top[..., None]) + col * top[..., None]
bot = np.clip((yy - 1560) / 360, 0, 1) ** 1.3 * 0.7
bg = bg * (1 - bot[..., None]) + np.array(ONYX, np.float32) * bot[..., None]
sub = Image.fromarray(np.clip(255 * (A(base) / 255) ** 0.82, 0, 255).astype(np.uint8))
sub = ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(sub).enhance(1.12)).enhance(1.08)).enhance(1.06)
sa = A(sub); sa[..., 0] *= 1.02; sa[..., 2] *= 0.98
sa = sa * (1 - bot[..., None] * 0.6) + np.array(ONYX, np.float32) * (bot[..., None] * 0.6)
mk_in = A(mk_img.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2.5))) / 255
mid = A(ImageEnhance.Brightness(base).enhance(0.9))
img = bg * (1 - mk[..., None]) + mid * (mk - mk_in)[..., None].clip(0, 1) + sa * mk_in[..., None]
img = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA')

# ---- lockup (por línea de base, interlineado apretado) ----
def line_sprite(txt, fn, sz, grad=False, color=WHITE, track=-0.035):
    f = ImageFont.truetype(F + fn, sz); tr = track * sz
    widths = [f.getlength(c) for c in txt]; tw = sum(widths) + tr * (len(txt) - 1)
    asc, desc = f.getmetrics()
    im = Image.new('L', (int(tw) + 40, asc + desc + 80), 0); d = ImageDraw.Draw(im); x = 20
    for c, wc in zip(txt, widths):
        d.text((x, 40 + asc), c, font=f, fill=255, anchor='ls'); x += wc + tr
    bb = im.getbbox(); m = im.crop(bb); base_y = 40 + asc - bb[1]
    cap = f.getbbox('H', anchor='ls')[1] + 40 + asc - bb[1]
    if grad:  # blanco cálido → champagne → dorado apagado
        g = np.linspace(0, 1, m.height)[:, None]
        c0, c1, c2 = np.array([255, 248, 236]), np.array([238, 219, 191]), np.array([201, 167, 122])
        rgb = np.where(g[..., None] < 0.5, c0 + (c1 - c0) * (g[..., None] / 0.5), c1 + (c2 - c1) * ((g[..., None] - 0.5) / 0.5))
        rgb = np.broadcast_to(rgb, (m.height, m.width, 3))
        sp = Image.fromarray(np.dstack([rgb, np.asarray(m)]).astype(np.uint8), 'RGBA')
    else:
        sp = Image.new('RGBA', m.size, color + (0,)); sp.putalpha(m)
    return sp, base_y, cap
l1, b1, c1 = line_sprite('Señales de que tu casa', 'OpenSauceOne-ExtraBoldItalic.ttf', 58)
l2, b2, c2 = line_sprite('se quedó', 'OpenSauceOne-ExtraBoldItalic.ttf', 96, grad=True)
l3, b3, c3 = line_sprite('CHICA', 'OpenSauceOne-ExtraBoldItalic.ttf', 200, grad=True, track=-0.03)
# caja roja de la línea 1
PADX, PADT, PADB = 30, 18, 24
box = Image.new('RGBA', (l1.width + 2 * PADX, l1.height + PADT + PADB), (0, 0, 0, 0))
ImageDraw.Draw(box).rounded_rectangle((0, 0, box.width - 1, box.height - 1), radius=18, fill=RED + (255,))
box.alpha_composite(l1, (PADX, PADT))
GAP_BOTTOM = 34                      # aire entre el pie de CHICA y el tope del pelo
y3 = HAIR - GAP_BOTTOM - l3.height   # CHICA (sin descendentes)
y2 = y3 + (c3) - 10 - b2             # base de "se quedó" 10 px sobre las mayúsculas de CHICA
ybox = y2 + (c2) - 18 - box.height   # caja 18 px sobre el tope de "se quedó"
block = Image.new('RGBA', (W, H), (0, 0, 0, 0))
block.alpha_composite(box, (int(540 - box.width / 2), int(ybox)))
block.alpha_composite(l2, (int(540 - l2.width / 2), int(y2)))
block.alpha_composite(l3, (int(540 - l3.width / 2), int(y3)))
a = block.split()[3].point(lambda v: int(v * 0.6)); sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sh.putalpha(a)
sh = sh.filter(ImageFilter.GaussianBlur(12)); txt = Image.new('RGBA', (W, H), (0, 0, 0, 0))
txt.alpha_composite(sh, (0, 6)); txt.alpha_composite(block)
print(K, 'bloque y', int(ybox), '→', int(y3 + l3.height), '| ancho máx', max(box.width, l2.width, l3.width))
if MODE == 'solotexto':
    out = Image.new('RGBA', (W, H), (0, 0, 0, 255)); out.alpha_composite(txt); out.convert('RGB').save(f'solo_texto{K}.png'); sys.exit()
img.alpha_composite(txt)
if MODE == 'guias':
    d = ImageDraw.Draw(img); d.rectangle((0, 420, 1079, 1500), outline=(0, 255, 0, 255), width=4); d.rectangle((100, 520, 980, 1400), outline=(255, 220, 0, 255), width=3)
    img.convert('RGB').save(f'guias{K}.jpg', quality=92); sys.exit()
img.convert('RGB').save(f'portada{K}.jpg', quality=95)
