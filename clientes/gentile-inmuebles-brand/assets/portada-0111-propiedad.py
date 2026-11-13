# Portada GIN 01-11 v2 (pedido de Tomi, 12-11): solo la propiedad — la cocina integrada de IMG_4779 a 1,0 s (zoom 1,06),
# degradé negro→rojo arriba, piso oscurecido abajo, lockup sobre el piso dentro del cuadrado. Modos: guias | solotexto
import os, sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
os.chdir(os.path.dirname(os.path.abspath(__file__)))
F = os.path.expanduser('~/.claude/skills/gentile-inmuebles-brand/assets/fonts/montserrat/')
W, H = 1080, 1920; ROJO = (225, 14, 28); WHITE = (255, 255, 255); NEG = (15, 15, 15)
MODE = sys.argv[1] if len(sys.argv) > 1 else ''
OUT = '../../PORTADA/01-11 GIN PAUTA Título pendiente.jpg'
TEXT_BOTTOM = 1385
A = lambda im: np.asarray(im, np.float32)
src = Image.open('coc_4779.jpg').convert('RGB'); sw, sh_ = src.size; Z = 1.06
cw, ch = sw / Z, sh_ / Z; x0 = (sw - cw) / 2 + 0.01 * sw; y0 = (sh_ - ch) * 0.45
img0 = src.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((W, H), Image.LANCZOS)
img0 = ImageEnhance.Color(ImageEnhance.Brightness(ImageEnhance.Contrast(img0).enhance(1.05)).enhance(1.1)).enhance(0.96)
bg = A(img0); yy, xx = np.mgrid[0:H, 0:W]
top_n = np.clip(1 - yy / 420, 0, 1) ** 1.3 * 0.85
red = np.exp(-((yy - 300) / 150) ** 2) * 0.5 * np.clip(1 - np.abs(xx - 540) / 900, 0.4, 1)
for gr, col in ((red, ROJO), (top_n, NEG)):
    bg = bg * (1 - gr[..., None]) + np.array(col, np.float32) * gr[..., None]
bot = np.clip((yy - 1120) / 600, 0, 1) ** 1.2 * 0.8                      # piso más oscuro bajo el texto
bg = bg * (1 - bot[..., None]) + np.array(NEG, np.float32) * bot[..., None]
redb = np.exp(-((yy - 1300) / 160) ** 2) * 0.14                          # tinte rojo suave detrás del lockup
bg = bg * (1 - redb[..., None]) + np.array(ROJO, np.float32) * redb[..., None]
img = Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).convert('RGBA')

def line(parts, tr=-0.03):
    fs = [(t, ImageFont.truetype(F + fn, sz), c, sz) for t, fn, sz, c, *_ in parts]; stk = [p[4] if len(p) > 4 else 0 for p in parts]
    tw = sum(sum(f.getlength(ch) for ch in t) + tr * sz * (len(t) - 1) for t, f, c, sz in fs)
    asc = max(f.getmetrics()[0] for _, f, _, _ in fs)
    im = Image.new('RGBA', (int(tw) + 80, 420), (0, 0, 0, 0)); d = ImageDraw.Draw(im); x = 40
    for (t, f, c, sz), k in zip(fs, stk):
        for ch in t: d.text((x, 60 + asc), ch, font=f, fill=c, anchor='ls', stroke_width=k, stroke_fill=WHITE); x += f.getlength(ch) + tr * sz
    bb = im.getbbox(); cap = min(f.getbbox('H', anchor='ls')[1] for _, f, _, _ in fs) + 60 + asc
    return im.crop(bb), 60 + asc - bb[1], cap - bb[1]
L1 = line([('Monoambiente a estrenar en', 'Montserrat-Medium.ttf', 56, WHITE)])
L2 = line([('MATADEROS', 'Montserrat-BlackItalic.ttf', 128, WHITE)])
L3 = line([('USD 58.000', 'Montserrat-Black.ttf', 74, WHITE), (' · apto crédito', 'Montserrat-Bold.ttf', 48, WHITE)], tr=-0.02)
pad = (26, 16); s3 = L3[0]; box = Image.new('RGBA', (s3.width + 2 * pad[0], s3.height + 2 * pad[1]), ROJO + (240,))
box.alpha_composite(s3, (pad[0], pad[1])); L3 = (box, L3[1] + pad[1], L3[2] + pad[1])
pos = {1: 0 - L2[1]}
pos[0] = (0 - (L2[1] - L2[2])) - 10 - L1[1]
pos[2] = 0 + 22
y1 = pos[2] + L3[0].height; shift = TEXT_BOTTOM - y1
block = Image.new('RGBA', (W, H), (0, 0, 0, 0))
for i, sp in enumerate((L1, L2, L3)):
    block.alpha_composite(sp[0], (int(540 - sp[0].width / 2), int(pos[i] + shift)))
a = block.split()[3].point(lambda v: int(v * 0.65)); shd = Image.new('RGBA', (W, H), (0, 0, 0, 0)); shd.putalpha(a)
shd = shd.filter(ImageFilter.GaussianBlur(12)); txt = Image.new('RGBA', (W, H), (0, 0, 0, 0)); txt.alpha_composite(shd, (0, 6)); txt.alpha_composite(block)
if MODE == 'solotexto':
    out = Image.new('RGBA', (W, H), (0, 0, 0, 255)); out.alpha_composite(txt); out.convert('RGB').save('solo_texto.png'); sys.exit()
img.alpha_composite(txt)
if MODE == 'guias':
    d = ImageDraw.Draw(img); d.rectangle((0, 420, 1079, 1500), outline=(0, 255, 0, 255), width=4); d.rectangle((100, 520, 980, 1400), outline=(255, 220, 0, 255), width=3)
    img.convert('RGB').save('guias.jpg', quality=92); sys.exit()
img.convert('RGB').save(OUT, quality=95); print('ok', OUT)
