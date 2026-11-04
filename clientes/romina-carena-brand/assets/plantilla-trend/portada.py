# Portada ROC 04-11 (adaptada de portadas-reels/scripts/portada_pil.py). Cuadro: IMG_6046 97,967 s (elegido por Tomi: con la máscara, mirando de costado con el celular). La versión vieja (85,0 s) quedó en portada_85.py.
# Insumos en el cwd: f98.jpg, mask98.png (recorte_personas.swift), fondo98.jpg (fondo_limpio.swift). Modos: guias | solotexto
import os, sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
F = os.path.expanduser('~/remotion-local/public/fonts/')
W, H = 1080, 1920; WHITE = (255, 255, 255); SALVIA = (60, 123, 101); OSC = (10, 34, 26)
MODE = sys.argv[1] if len(sys.argv) > 1 else ''; OUT = sys.argv[2] if len(sys.argv) > 2 else 'portada.jpg'
S, X0, Y0 = 1.04, 17, 21            # mismo encuadre que la captura que mandó Tomi
def tr(im, resample=Image.LANCZOS):
    im = im.resize((round(W * S), round(H * S)), resample); return im.crop((X0, Y0, X0 + W, Y0 + H))
A = lambda im: np.asarray(im, np.float32)
base = tr(Image.open('f98.jpg').convert('RGB'))
mk_img = tr(Image.open('mask98.png').convert('L').resize((W, H))).filter(ImageFilter.GaussianBlur(1.5)); mk = A(mk_img) / 255
fondo = tr(Image.open('fondo98.jpg').convert('RGB')).filter(ImageFilter.GaussianBlur(4))
fondo = ImageEnhance.Color(ImageEnhance.Brightness(fondo).enhance(0.80)).enhance(0.92)
near = A(mk_img.filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(10))) / 255
bg = A(fondo) * (1 - near[..., None]) + A(ImageEnhance.Brightness(base).enhance(0.80)) * near[..., None]
yy, xx = np.mgrid[0:H, 0:W]
glow = np.exp(-(((xx - 470) / 330) ** 2 + ((yy - 760) / 380) ** 2))[..., None] * 0.20
bg = bg * (1 - glow) + np.array([255, 236, 220], np.float32) * glow
top = np.clip(1 - yy / 560, 0, 1) ** 1.6 * 0.55          # velo salvia oscuro solo arriba (guía G)
bot = np.clip((yy - 1150) / 770, 0, 1) ** 1.3 * 0.75
for gr in (top, bot): bg = bg * (1 - gr[..., None]) + np.array(OSC, np.float32) * gr[..., None]
sub = Image.fromarray(np.clip(255 * (A(base) / 255) ** 0.82, 0, 255).astype(np.uint8))
sub = ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(sub).enhance(1.12)).enhance(1.08)).enhance(1.06)
sa = A(sub); sa[..., 0] *= 1.02; sa[..., 2] *= 0.98
bl = np.clip((yy - 1500) / 420, 0, 1)[..., None] * 0.5; sa = sa * (1 - bl) + np.array(OSC, np.float32) * bl
mk_in = A(mk_img.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2.5))) / 255
img = bg * (1 - mk[..., None]) + A(ImageEnhance.Brightness(base).enhance(0.9)) * (mk - mk_in)[..., None].clip(0, 1) + sa * mk_in[..., None]
img = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA')
# ---- lockup: "Yo cuando mi cliente" (Medium) / "ME NECESITA" (Black Italic, glow) sobre caja salvia ----
SZ1 = int(os.environ.get('SZ1', 52)); SZ2 = int(os.environ.get('SZ2', 98))
def render(txt, fn, sz, col, track=-0.02):
    f = ImageFont.truetype(F + fn, sz); t = track * sz
    w = sum(f.getlength(c) for c in txt) + t * (len(txt) - 1); asc = f.getmetrics()[0]
    im = Image.new('RGBA', (int(w) + 80, 400), (0, 0, 0, 0)); d = ImageDraw.Draw(im); x = 40
    for c in txt: d.text((x, 60 + asc), c, font=f, fill=col, anchor='ls'); x += f.getlength(c) + t
    bb = im.getbbox(); cap = f.getbbox('H', anchor='ls')[1] + 60 + asc
    return im.crop(bb), 60 + asc - bb[1], cap - bb[1]
l1 = render('Yo cuando mi cliente', 'OpenSauceOne-Medium.ttf', SZ1, WHITE)
l2 = render('ME NECESITA', 'OpenSauceOne-BlackItalic.ttf', SZ2, WHITE, -0.025)
CHIN = int(os.environ.get('CHIN', 1000)); CX = int(os.environ.get('CX', 450)); BOX_T = CHIN + 20; PAD = 30
y1 = BOX_T + PAD                                  # tope de la línea 1
b1 = y1 + l1[1]                                   # base línea 1
y2 = b1 + 10 - l2[2]                              # tope de mayúsculas del golpe 10 px bajo la base de la línea 1
bw = max(l1[0].width, l2[0].width) + 2 * 44; bx0 = CX - bw // 2
box_b = y2 + l2[0].height + PAD + 6
txt = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(txt)
if MODE != 'solotexto':
    d.rounded_rectangle((bx0, BOX_T, bx0 + bw, box_b), radius=28, fill=SALVIA + (196,))
blk = Image.new('RGBA', (W, H), (0, 0, 0, 0))
blk.alpha_composite(l1[0], (CX - l1[0].width // 2, y1)); g = Image.new('RGBA', (W, H), (0, 0, 0, 0))
g.alpha_composite(l2[0], (CX - l2[0].width // 2, y2))
glo = g.filter(ImageFilter.GaussianBlur(14)); ga = glo.split()[3].point(lambda v: min(255, int(v * 1.3)))
glw = Image.new('RGBA', (W, H), (255, 255, 255, 0)); glw.putalpha(ga)
sh = blk.split()[3].point(lambda v: int(v * .5)); shd = Image.new('RGBA', (W, H), (0, 0, 0, 0)); shd.putalpha(sh)
txt.alpha_composite(shd.filter(ImageFilter.GaussianBlur(8)), (0, 4)); txt.alpha_composite(glw); txt.alpha_composite(blk); txt.alpha_composite(g)
if MODE == 'solotexto':
    o = Image.new('RGBA', (W, H), (0, 0, 0, 255)); o.alpha_composite(txt); o.convert('RGB').save('solo_texto.png'); sys.exit()
img.alpha_composite(txt)
print('caja', bx0, BOX_T, bx0 + bw, box_b)
if MODE == 'guias':
    d = ImageDraw.Draw(img); d.rectangle((0, 420, 1079, 1500), outline=(0, 255, 0, 255), width=4); d.rectangle((100, 520, 980, 1400), outline=(255, 220, 0, 255), width=3)
    img.convert('RGB').save('guias.jpg', quality=92); sys.exit()
img.convert('RGB').save(OUT, quality=95)
