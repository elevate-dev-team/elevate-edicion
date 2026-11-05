# Portada GIN 23-10 (adaptada de portadas-reels/scripts/portada_pil.py): Martín con el visor mirando a cámara (IMG_1850 a 6,6 s, recorte 831x1477 en 238,61 = zoom 1,3),
# sujeto aislado y más expuesto, degradé negro→rojo arriba, lockup Montserrat sobre la cabeza. Modos: guias | solotexto
import os, sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
os.chdir(os.path.dirname(os.path.abspath(__file__)))
F = os.path.expanduser('~/.claude/skills/gentile-inmuebles-brand/assets/fonts/montserrat/')
W, H = 1080, 1920; ROJO = (225, 14, 28); WHITE = (255, 255, 255); NEG = (15, 15, 15)
MODE = sys.argv[1] if len(sys.argv) > 1 else ''
OUT = '../../PORTADA/23-10 GIN Este departamento todavía no e.jpg'
TEXT_BOTTOM = 905          # base del bloque: ~30 px sobre el pelo (pelo en y≈940 en base.jpg)
A = lambda im: np.asarray(im, np.float32)
base = Image.open('base.jpg').convert('RGB')
mk_img = Image.open('mascara.png').convert('L').resize((W, H)).filter(ImageFilter.GaussianBlur(1.2)); mk = A(mk_img) / 255
yy, xx = np.mgrid[0:H, 0:W]
fondo = Image.open('fondo.jpg').convert('RGB').filter(ImageFilter.GaussianBlur(4))
fondo = ImageEnhance.Color(ImageEnhance.Brightness(fondo).enhance(0.74)).enhance(0.9)
near = A(Image.fromarray((mk * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(10))) / 255
bg = A(fondo) * (1 - near[..., None]) + A(ImageEnhance.Brightness(base).enhance(0.74)) * near[..., None]
# degradé arriba negro → rojo Gentile difuminado, hasta un poco debajo del texto
top_n = np.clip(1 - yy / 520, 0, 1) ** 1.2 * 0.85
red = np.exp(-((yy - 720) / 260) ** 2) * 0.55 * np.clip(1 - np.abs(xx - 540) / 900, 0.4, 1)
for gr, col in ((red, ROJO), (top_n, NEG)):
    bg = bg * (1 - gr[..., None]) + np.array(col, np.float32) * gr[..., None]
bot = np.clip((yy - 1450) / 470, 0, 1) ** 1.2 * 0.8
bg = bg * (1 - bot[..., None]) + np.array(NEG, np.float32) * bot[..., None]
# sujeto más expuesto
sub = Image.fromarray(np.clip(255 * (A(base) / 255) ** 0.82, 0, 255).astype(np.uint8))
sub = ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(sub).enhance(1.12)).enhance(1.08)).enhance(1.05)
sa = A(sub); bl = np.clip((yy - 1520) / 400, 0, 1)[..., None] * 0.5; sa = sa * (1 - bl) + np.array(NEG, np.float32) * bl
mk_in = A(mk_img.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2.5))) / 255
mid = A(ImageEnhance.Brightness(base).enhance(0.86))
img = bg * (1 - mk[..., None]) + mid * (mk - mk_in)[..., None].clip(0, 1) + sa * mk_in[..., None]
img = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA')

def line(parts, tr=-0.03):
    fs = [(t, ImageFont.truetype(F + fn, sz), c, sz) for t, fn, sz, c, *_ in parts]; stk = [p[4] if len(p) > 4 else 0 for p in parts]
    tw = sum(sum(f.getlength(ch) for ch in t) + tr * sz * (len(t) - 1) for t, f, c, sz in fs)
    asc = max(f.getmetrics()[0] for _, f, _, _ in fs)
    im = Image.new('RGBA', (int(tw) + 80, 420), (0, 0, 0, 0)); d = ImageDraw.Draw(im); x = 40
    for (t, f, c, sz), k in zip(fs, stk):
        for ch in t: d.text((x, 60 + asc), ch, font=f, fill=c, anchor='ls', stroke_width=k, stroke_fill=WHITE); x += f.getlength(ch) + tr * sz
    bb = im.getbbox(); cap = min(f.getbbox('H', anchor='ls')[1] for _, f, _, _ in fs) + 60 + asc
    return im.crop(bb), 60 + asc - bb[1], cap - bb[1]      # sprite, base, tope de mayúsculas
L1 = line([('Este departamento ', 'Montserrat-Medium.ttf', 58, WHITE), ('todavía', 'Montserrat-Bold.ttf', 58, WHITE)])
L2 = line([('NO ', 'Montserrat-BlackItalic.ttf', 156, ROJO, 7), ('EXISTE', 'Montserrat-BlackItalic.ttf', 156, WHITE)])
L3 = line([('Y ya lo podés ', 'Montserrat-Medium.ttf', 60, WHITE), ('recorrer', 'Montserrat-Black.ttf', 60, WHITE)], tr=-0.02)
# caja roja de la línea 3
pad = (26, 16); s3 = L3[0]; box = Image.new('RGBA', (s3.width + 2 * pad[0], s3.height + 2 * pad[1]), ROJO + (240,))
ImageDraw.Draw(box)  # rectángulo pleno
box.alpha_composite(s3, (pad[0], pad[1])); L3 = (box, L3[1] + pad[1], L3[2] + pad[1])
# posiciones por línea de base, interlineado apretado
pos = {1: 0 - L2[1]}
pos[0] = (0 - (L2[1] - L2[2])) - 10 - L1[1]                 # base de L1 10 px sobre las mayúsculas del golpe
pos[2] = 0 + 22                                             # tope de la caja 22 px bajo la base del golpe (v1 se montaba sobre NO EXISTE)
y1 = pos[2] + L3[0].height; shift = TEXT_BOTTOM - y1
block = Image.new('RGBA', (W, H), (0, 0, 0, 0))
for i, sp in enumerate((L1, L2, L3)):
    block.alpha_composite(sp[0], (int(540 - sp[0].width / 2), int(pos[i] + shift)))
a = block.split()[3].point(lambda v: int(v * 0.6)); sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sh.putalpha(a)
sh = sh.filter(ImageFilter.GaussianBlur(12)); txt = Image.new('RGBA', (W, H), (0, 0, 0, 0)); txt.alpha_composite(sh, (0, 6)); txt.alpha_composite(block)
# contorno blanco del NO rojo (como el rojo de la marca: Black rojo con borde blanco)
if MODE == 'solotexto':
    out = Image.new('RGBA', (W, H), (0, 0, 0, 255)); out.alpha_composite(txt); out.convert('RGB').save('solo_texto.png'); sys.exit()
img.alpha_composite(txt)
if MODE == 'guias':
    d = ImageDraw.Draw(img); d.rectangle((0, 420, 1079, 1500), outline=(0, 255, 0, 255), width=4); d.rectangle((100, 520, 980, 1400), outline=(255, 220, 0, 255), width=3)
    img.convert('RGB').save('guias.jpg', quality=92); sys.exit()
img.convert('RGB').save(OUT, quality=95); print('ok', OUT)
