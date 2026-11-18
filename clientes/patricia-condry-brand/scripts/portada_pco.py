# portada_pco.py — portada PCO aprobada (05-11 "El centro de Dade City tiene 100 años", 18-11-2026). Base: portadas-reels/scripts/portada_pil.py.
# Insumos: base<K>.png (frame con zoom anclado arriba), mask<K>.png (recorte_personas.swift), fondo<K>.jpg (fondo_limpio.swift). Fuentes: Montserrat.
# portada.py <A|B> [guias|solotexto] — PCO 05-11 "El centro de Dade City tiene 100 años" (basado en portadas-reels/portada_pil.py)
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
K = sys.argv[1]; MODE = sys.argv[2] if len(sys.argv) > 2 else ''
import os
F = os.path.expanduser('~/.claude/skills/patricia-condry-brand/assets/fonts/montserrat/')
W, H = 1080, 1920; WHITE = (255, 255, 255); NAVY_N = (5, 0, 92); NAVY = (11, 2, 132)
A = lambda im: np.asarray(im, np.float32)
base = Image.open(f'base{K}.png').convert('RGB')
mk_img = Image.open(f'mask{K}.png').convert('L').resize((W, H)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
mk = A(mk_img) / 255
ys = np.where((mk > 0.5).any(1))[0]; HAIR = ys.min()
yy, xx = np.mgrid[0:H, 0:W]
# fondo: limpio, 4 px, 80 %
fondo = ImageEnhance.Color(ImageEnhance.Brightness(Image.open(f'fondo{K}.jpg').convert('RGB').filter(ImageFilter.GaussianBlur(4))).enhance(0.80)).enhance(0.92)
near = A(Image.fromarray((mk * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(10))) / 255
bg = A(fondo) * (1 - near[..., None]) + A(ImageEnhance.Brightness(base).enhance(0.80)) * near[..., None]
glow = np.exp(-(((xx - 545) / 330) ** 2 + ((yy - HAIR - 120) / 360) ** 2))[..., None] * 0.18
bg = bg * (1 - glow) + np.array([255, 236, 220], np.float32) * glow
# degradé navy de marca desde arriba: #05005C opaco -> #0B0284 -> transparente hacia la mitad del cuadro
t = np.clip(yy / 1000, 0, 1)
col = (np.array(NAVY_N, np.float32) * (1 - t[..., None]) + np.array(NAVY, np.float32) * t[..., None])
al = (np.clip(1 - yy / 1000, 0, 1) ** 1.25 * 0.92)[..., None]
bg = bg * (1 - al) + col * al
bot = np.clip((yy - 1500) / 420, 0, 1) ** 1.3 * 0.6
bg = bg * (1 - bot[..., None]) + np.array(NAVY_N, np.float32) * bot[..., None]
# sujeto más expuesto
sub = Image.fromarray(np.clip(255 * (A(base) / 255) ** 0.82, 0, 255).astype(np.uint8))
sub = ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(sub).enhance(1.12)).enhance(1.08)).enhance(1.06)
sa = A(sub); sa[..., 0] *= 1.02; sa[..., 2] *= 0.98
bl = np.clip((yy - 1500) / 420, 0, 1)[..., None] * 0.5
sa = sa * (1 - bl) + np.array(NAVY_N, np.float32) * bl
mk_in = A(mk_img.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2.5))) / 255
mid = A(ImageEnhance.Brightness(base).enhance(0.9))
img = bg * (1 - mk[..., None]) + mid * (mk - mk_in)[..., None].clip(0, 1) + sa * mk_in[..., None]
img = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA')
# lockup: "El centro de" / "Dade City" / "tiene 100 años"
def font(n, s): return ImageFont.truetype(F + n, s)
def render(parts, tr=-0.025):
    """parts: [(texto, fuente, tamaño, dy)] sobre una línea de base común -> (sprite, baseline, cap_top)."""
    fs = [(t, font(n, s), s, dy) for t, n, s, dy in parts]
    asc = max(f.getmetrics()[0] for _, f, _, _ in fs)
    im = Image.new('RGBA', (2000, 600), (0, 0, 0, 0)); d = ImageDraw.Draw(im); x = 20; B0 = 60 + asc
    for t, f, s, dy in fs:
        for c in t:
            d.text((x, B0 + dy), c, font=f, fill=WHITE, anchor='ls'); x += f.getlength(c) + tr * s
    bb = im.getbbox(); cap = min(f.getbbox('H', anchor='ls')[1] for _, f, _, _ in fs) + B0
    return im.crop(bb), B0 - bb[1], cap - bb[1]
L1 = render([('El ', 'Montserrat-Light.ttf', 74, 0), ('centro', 'Montserrat-Bold.ttf', 74, 0), (' de', 'Montserrat-Light.ttf', 74, 0)])
L2 = render([('Dade City', 'Montserrat-ExtraBold.ttf', 134, 0)], tr=-0.03)
L3 = render([('tiene ', 'Montserrat-BoldItalic.ttf', 70, 0), ('100', 'Montserrat-Black.ttf', 196, 0), (' años', 'Montserrat-BoldItalic.ttf', 70, 0)], tr=-0.03)
# por línea de base: cada línea apoya ~8 px sobre el tope de mayúsculas de la siguiente
b3 = 0
b2 = b3 - (L3[1] - L3[2]) - 10
b1 = b2 - (L2[1] - L2[2]) - 10
BOTTOM = HAIR - 30                     # base del "100" pegada arriba del pelo
shift = BOTTOM - b3
block = Image.new('RGBA', (W, H), (0, 0, 0, 0))
for (s, base_, cap), b in ((L1, b1), (L2, b2), (L3, b3)):
    block.alpha_composite(s, (int(540 - s.width / 2), int(b + shift - base_)))
a = block.split()[3].point(lambda v: int(v * 0.55)); sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sh.putalpha(a)
sh = sh.filter(ImageFilter.GaussianBlur(11)); txt = Image.new('RGBA', (W, H), (0, 0, 0, 0)); txt.alpha_composite(sh, (0, 5)); txt.alpha_composite(block)
if MODE == 'solotexto':
    o = Image.new('RGBA', (W, H), (0, 0, 0, 255)); o.alpha_composite(txt); o.convert('RGB').save(f'solo_texto{K}.png'); sys.exit()
img.alpha_composite(txt)
if MODE == 'guias':
    d = ImageDraw.Draw(img); d.rectangle((0, 420, 1079, 1500), outline=(0, 255, 0, 255), width=4); d.rectangle((100, 520, 980, 1400), outline=(255, 220, 0, 255), width=3)
    img.convert('RGB').save(f'guias{K}.jpg', quality=92); sys.exit()
img.convert('RGB').save(f'portada{K}.jpg', quality=95)
print(K, 'pelo', HAIR, 'base 100', BOTTOM)
