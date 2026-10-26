# portada_horizontal.py — miniatura 1920×1080 de Fran, aprobada en FM 24-10 VSL webinar 2 (2026-10-26).
# Insumos (portadas-reels/scripts): frame.jpg (frame del original, color igualado a la captura del editor),
# recorte_personas.swift -> mascara.png, fondo_limpio.swift -> fondo.jpg. Ajustar LINES, TEXT_X, BLOCK_W, TEXT_MID y OUT.
# Modos: `guias` (zona de títulos + sello de duración de YouTube) y `solotexto` (para medir la caja del texto).
# Portada HORIZONTAL 1920×1080 de FM 24-10 VSL webinar 2 (adaptada de portadas-reels/scripts/portada_pil.py).
# Marca: francisco-moya-brand §9 (MAYÚSCULAS, blanco Montserrat ExtraBold + golpe amarillo #FFC324 Montserrat Black, interlineado muy apretado).
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
F = os.path.expanduser('~/.claude/skills/francisco-moya-brand/assets/fonts/')
W, H = 1920, 1080
AMARILLO = (255, 195, 36); WHITE = (255, 255, 255); OSC = (16, 16, 18)
MODE = sys.argv[1] if len(sys.argv) > 1 else ''
OUT = 'proj/PORTADA/24-10 FM VSL webinar 2.jpg'
TEXT_X = 120          # borde izquierdo del bloque (alineado a la izquierda)
BLOCK_W = 770         # ancho del golpe: termina ~70 px antes de la oreja de Fran (x ≈ 945)
TEXT_MID = 500        # centro vertical del bloque: a la altura de la cara

base = Image.open('frame.jpg').convert('RGB')
A = lambda im: np.asarray(im, np.float32)
yy, xx = np.mgrid[0:H, 0:W]
mk_img = Image.open('mascara.png').convert('L').resize((W, H)).filter(ImageFilter.GaussianBlur(1.2))
mk = A(mk_img) / 255

# ---- fondo: relleno limpio, desenfoque leve, más bajo que el sujeto ----
fondo = Image.open('fondo.jpg').convert('RGB').resize((W, H)).filter(ImageFilter.GaussianBlur(4))
fondo = ImageEnhance.Color(ImageEnhance.Brightness(fondo).enhance(0.80)).enhance(0.92)
near = A(Image.fromarray((mk * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(10))) / 255
bg = A(fondo) * (1 - near[..., None]) + A(ImageEnhance.Brightness(base).enhance(0.80)) * near[..., None]
glow = np.exp(-(((xx - 1100) / 420) ** 2 + ((yy - 470) / 360) ** 2))[..., None] * 0.20
bg = bg * (1 - glow) + np.array([255, 236, 220], np.float32) * glow
# degradés oscuros: desde la izquierda (detrás del texto), arriba y abajo; no pasan por la cara
left = np.clip(1 - xx / 1150, 0, 1) ** 1.3 * 0.72
top = np.clip(1 - yy / 300, 0, 1) ** 1.6 * 0.45
bot = np.clip((yy - 760) / 320, 0, 1) ** 1.3 * 0.55
for gr in (left, top, bot):
    bg = bg * (1 - gr[..., None]) + np.array(OSC, np.float32) * gr[..., None]

# ---- sujeto con más exposición ----
sub = Image.fromarray(np.clip(255 * (A(base) / 255) ** 0.82, 0, 255).astype(np.uint8))
sub = ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(sub).enhance(1.12)).enhance(1.08)).enhance(1.06)
sa = A(sub); sa[..., 0] *= 1.02; sa[..., 2] *= 0.98
bl = np.clip((yy - 880) / 200, 0, 1)[..., None] * 0.35          # solo el torso bajo, para asentar el cuadro
sa = sa * (1 - bl) + np.array(OSC, np.float32) * bl
mk_in = A(mk_img.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2.5))) / 255
mid = A(ImageEnhance.Brightness(base).enhance(0.9))
img = bg * (1 - mk[..., None]) + mid * (mk - mk_in)[..., None].clip(0, 1) + sa * mk_in[..., None]
img = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA')

# ---- lockup: ESTÁS A PUNTO DE / RESERVAR / TU LUGAR ----
def font_for(txt, fn, width):
    sz = 200
    while True:
        f = ImageFont.truetype(F + fn, sz)
        w = sum(f.getlength(c) for c in txt) - 0.035 * sz * (len(txt) - 1)
        if w <= width: return f, sz
        sz -= 1
LINES = [('ESTÁS A PUNTO DE', 'Montserrat-ExtraBold.ttf', WHITE, BLOCK_W),
         ('RESERVAR', 'Montserrat-Black.ttf', AMARILLO, BLOCK_W),
         ('TU LUGAR', 'Montserrat-ExtraBold.ttf', WHITE, BLOCK_W * 0.62)]
def render(txt, fn, col, width):
    f, sz = font_for(txt, fn, width); tr = -0.035 * sz
    asc = f.getmetrics()[0]
    im = Image.new('RGBA', (int(width) + 80, sz * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im); x = 20
    for c in txt:
        d.text((x, 40 + asc), c, font=f, fill=col, anchor='ls'); x += f.getlength(c) + tr
    bb = im.getbbox(); cap = f.getbbox('H', anchor='ls')[1] + 40 + asc
    return im.crop(bb), 40 + asc - bb[1], cap - bb[1]   # sprite, línea de base, tope de mayúsculas
sp = [render(*l) for l in LINES]
# por línea de base: cada línea apoya ~10 px sobre el tope de las mayúsculas de la de abajo (acentos aparte)
G = 0
pos = {1: G - sp[1][1]}
pos[0] = (G - (sp[1][1] - sp[1][2])) - 12 - sp[0][1]
pos[2] = G + 14 + (sp[2][1] - sp[2][2]) - sp[2][1]
y0 = min(pos.values()); y1 = max(pos[i] + sp[i][0].height for i in pos)
shift = TEXT_MID - (y0 + y1) / 2
block = Image.new('RGBA', (W, H), (0, 0, 0, 0))
for i in range(3):
    s = sp[i][0]; block.alpha_composite(s, (int(TEXT_X), int(pos[i] + shift)))
a = block.split()[3].point(lambda v: int(v * 0.6)); sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sh.putalpha(a)
sh = sh.filter(ImageFilter.GaussianBlur(14)); txt = Image.new('RGBA', (W, H), (0, 0, 0, 0))
txt.alpha_composite(sh, (0, 6)); txt.alpha_composite(block)
if MODE == 'solotexto':
    out = Image.new('RGBA', (W, H), (0, 0, 0, 255)); out.alpha_composite(txt); out.convert('RGB').save('solo_texto.png'); sys.exit()
img.alpha_composite(txt)
if MODE == 'guias':
    d = ImageDraw.Draw(img)
    d.rectangle((96, 54, W - 97, H - 55), outline=(0, 255, 0, 255), width=3)
    d.rectangle((W - 300, H - 140, W - 1, H - 1), outline=(255, 0, 0, 255), width=3)   # sello de duración de YouTube
    img.convert('RGB').save('guias.jpg', quality=92); sys.exit()
os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.convert('RGB').save(OUT, quality=95)
print('ok', OUT)
