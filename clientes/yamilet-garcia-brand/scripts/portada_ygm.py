# portada_ygm.py — Portada 9:16 de Yamilet García (YGM), adaptación de portadas-reels/scripts/portada_pil.py.
# Cuadro: arranque del video (zoom 1,5× anclado a los ojos, t=0,75 s: sonrisa). Lockup = sprite 'c_portada' de
# ../texts.py (mismo sistema que los títulos del video: Montserrat crema + Playfair Display con degradé dorado).
#   python portada_ygm.py [guias|solotexto]
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
W, H = 1080, 1920
ESP_D = (34, 29, 25)                       # espresso casi negro (degradés)
MODE = sys.argv[1] if len(sys.argv) > 1 else ''
OUT = '../../../PORTADA/06-09 YGM Antes de mostrarte casas.jpg'
CHIN, FW = 932, 259                        # medidos con track_cara en base3 (mentón y ancho de cara en px)
TEXT_TOP = CHIN + 0.15 * FW + 20           # ~20 px debajo de la caja de la cabeza

base = Image.open('base3.jpg').convert('RGB')
A = lambda im: np.asarray(im, np.float32)
yy, xx = np.mgrid[0:H, 0:W]

mk_img = Image.open('mascara3.png').convert('L').resize((W, H)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
mk = A(mk_img) / 255

fondo = Image.open('fondo3.jpg').convert('RGB').filter(ImageFilter.GaussianBlur(4))
fondo = ImageEnhance.Color(ImageEnhance.Brightness(fondo).enhance(0.80)).enhance(0.92)
near = A(mk_img.filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(10))) / 255
bg = A(fondo) * (1 - near[..., None]) + A(ImageEnhance.Brightness(base).enhance(0.80)) * near[..., None]
glow = np.exp(-(((xx - 430) / 330) ** 2 + ((yy - 650) / 380) ** 2))[..., None] * 0.20
bg = bg * (1 - glow) + np.array([255, 238, 214], np.float32) * glow
top = np.clip(1 - yy / 560, 0, 1) ** 1.6 * 0.60
bot = np.clip((yy - 1150) / 770, 0, 1) ** 1.3 * 0.80
for gr in (top, bot):
    bg = bg * (1 - gr[..., None]) + np.array(ESP_D, np.float32) * gr[..., None]

sub = Image.fromarray(np.clip(255 * (A(base) / 255) ** 0.90, 0, 255).astype(np.uint8))   # ropa clara: gamma suave
sub = ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(sub).enhance(1.10)).enhance(1.08)).enhance(1.05)
sa = A(sub); sa[..., 0] *= 1.02; sa[..., 2] *= 0.98
bl = np.clip((yy - 1500) / 420, 0, 1)[..., None] * 0.5
sa = sa * (1 - bl) + np.array(ESP_D, np.float32) * bl
mk_in = A(mk_img.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2.5))) / 255
mid = A(ImageEnhance.Brightness(base).enhance(0.9))
img = bg * (1 - mk[..., None]) + mid * (mk - mk_in)[..., None].clip(0, 1) + sa * mk_in[..., None]
img = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA')

# ---- lockup: sprite del sistema de títulos (ya trae su sombra), anclado por la caja de tinta ----
import json
meta = json.load(open('../sprites/meta.json'))['c_portada']
sp = Image.open('../sprites/c_portada.png').convert('RGBA')
ix0, iy0, ix1, iy1 = meta['ink']
x = round(meta['cx'] - sp.width / 2); y = round(TEXT_TOP - iy0)
txt = Image.new('RGBA', (W, H), (0, 0, 0, 0)); txt.alpha_composite(sp, (x, y))
# velo espresso muy suave detrás del bloque (el vestido es beige: el dorado necesita un fondo un poco más oscuro)
veil = Image.new('L', (W, H), 0); ImageDraw.Draw(veil).rounded_rectangle((x + ix0 - 60, y + iy0 - 40, x + ix1 + 60, y + iy1 + 40), 80, fill=255)
veil = veil.filter(ImageFilter.GaussianBlur(55)).point(lambda v: int(v * 0.42))
vl = Image.new('RGBA', (W, H), ESP_D + (0,)); vl.putalpha(veil)
print('texto: tinta y', y + iy0, '-', y + iy1, ' x', x + ix0, '-', x + ix1)
if MODE == 'solotexto':
    out = Image.new('RGBA', (W, H), (0, 0, 0, 255)); out.alpha_composite(txt); out.convert('RGB').save('solo_texto.png'); sys.exit()
img.alpha_composite(vl); img.alpha_composite(txt)
if MODE == 'guias':
    d = ImageDraw.Draw(img); d.rectangle((0, 420, 1079, 1500), outline=(0, 255, 0, 255), width=4); d.rectangle((100, 520, 980, 1400), outline=(255, 220, 0, 255), width=3)
    img.convert('RGB').save('guias.jpg', quality=92); sys.exit()
img.convert('RGB').save(OUT, quality=95)
print('ok', OUT)
