# Frame de prueba del sistema de Beatriz: subtítulo, título-golpe y placa de datos.
# Uso: python3 prueba_sistema.py salida.jpg fondo_1080x1920.jpg  (requiere Pillow)
import os, sys, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

S = os.path.dirname(os.path.abspath(__file__))
M = os.path.expanduser('~/.claude/skills/beatriz-gascon-brand/assets/fonts')
F = lambda p, s: ImageFont.truetype(os.path.join(M, p), s)
INTER = lambda w, s: F(f'Inter/Inter_24pt-{w}.ttf', s)
FRAU = lambda w, s: F(f'Fraunces/Fraunces_72pt_Soft-{w}.ttf', s)

NAVY, CELESTE, CREMA, DORADO, BLANCO = '#062A3A', '#85D3ED', '#F1DBA3', '#D5A23C', '#FFFFFF'
W, H = 1080, 1920


def run_width(font, text, track):
    return font.getlength(text) + track * font.size * max(len(text) - 1, 0)


def draw_run(d, x, y, font, text, fill, track):
    # tracking proporcional al cuerpo, conservando kerning
    for i, ch in enumerate(text):
        adv = font.getlength(text[:i])
        d.text((x + adv + track * font.size * i, y), ch, font=font, fill=fill, anchor='ls')


def line(img, y, runs, shadow=True, cx=W / 2):
    """runs: [(font, text, color, track)] sobre una baseline y, centrado."""
    total = sum(run_width(f, t, tr) for f, t, _, tr in runs)
    x0 = cx - total / 2
    if shadow:
        sh = Image.new('RGBA', img.size, (0, 0, 0, 0))
        ds = ImageDraw.Draw(sh)
        x = x0
        for f, t, _, tr in runs:
            draw_run(ds, x, y + 4, f, t, (0, 0, 0, 150), tr)
            x += run_width(f, t, tr)
        img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)))
    d = ImageDraw.Draw(img)
    x = x0
    spans = []
    for f, t, c, tr in runs:
        wdt = run_width(f, t, tr)
        draw_run(d, x, y, f, t, c, tr)
        spans.append((x, x + wdt))
        x += wdt
    return spans


def bg():
    b = Image.open(sys.argv[2]).convert('RGBA')
    return ImageEnhance.Brightness(b).enhance(0.85)


# 1. Subtítulo
a = bg()
line(a, 1290, [(INTER('SemiBold', 64), 'nadie te ', BLANCO, -0.02),
               (FRAU('SemiBoldItalic', 74), 'cuenta', CREMA, -0.02)])

# 2. Título-golpe con trazo dorado
b = bg()
grad = Image.new('RGBA', (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(grad)
for yy in range(H):
    t = max(0, (yy - 500) / 1000)
    gd.line([(0, yy), (W, yy)], fill=(6, 42, 58, int(170 * min(t, 1))))
b.alpha_composite(grad)
line(b, 1020, [(INTER('SemiBold', 50), 'Antes de comprar', CELESTE, -0.02)], shadow=False)
line(b, 1170, [(FRAU('Black', 150), '3 errores', CREMA, -0.03)])
sp = line(b, 1300, [(FRAU('BlackItalic', 150), 'que cuestan', CREMA, -0.03)])
d = ImageDraw.Draw(b)
x1, x2 = sp[0]
y = 1335
pts = [(x1 + 10, y + 6), ((x1 + x2) / 2, y - 4), (x2 - 10, y + 2)]
d.line(pts, fill=DORADO, width=11, joint='curve')
for p in (pts[0], pts[-1]):
    d.ellipse([p[0] - 5, p[1] - 5, p[0] + 5, p[1] + 5], fill=DORADO)

# 3. Placa navy de datos + CTA
c = Image.new('RGBA', (W, H), NAVY)
random.seed(1)
noise = Image.effect_noise((W, H), 18).convert('L')
c = Image.blend(c, Image.merge('RGBA', (noise, noise, noise, Image.new('L', (W, H), 255))), 0.05)
line(c, 760, [(INTER('Medium', 52), 'Casa de 3 dormitorios', BLANCO, -0.02)], shadow=False)
line(c, 920, [(INTER('SemiBold', 60), 'USD ', CELESTE, -0.02),
              (FRAU('Bold', 140), '285.000', DORADO, -0.03)], shadow=False)
d = ImageDraw.Draw(c)
d.line([(440, 990), (640, 990)], fill=CELESTE, width=3)
f = INTER('ExtraBold', 46)
txt = 'COMENTA “CASA”'
tw = run_width(f, txt, -0.01)
px, py = 46, 30
x0, y0 = (W - tw) / 2 - px, 1160
d.rounded_rectangle([x0, y0, x0 + tw + 2 * px, y0 + 46 + 2 * py], radius=60, fill=CREMA)
line(c, y0 + py + 40, [(f, txt, NAVY, -0.01)], shadow=False)

sheet = Image.new('RGB', (W * 3 + 80, H + 40), '#111111')
for i, im in enumerate((a, b, c)):
    sheet.paste(im.convert('RGB'), (20 + i * (W + 20), 20))
sheet = sheet.resize((sheet.width // 2, sheet.height // 2), Image.LANCZOS)
sheet.save(sys.argv[1], quality=90)
print('ok')
