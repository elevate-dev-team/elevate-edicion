# ROC 02-11 — portada "Townhouse de 4 HABITACIONES en Miami-Dade por menos de $375K"
# Sistema de Tomi (J 21-11): velo verde desde arriba, texto suelto arriba de la cabeza, Birthstone + Black con glow + menta.
#   ~/venvs/align/bin/python portada.py [guias|solotexto]
import sys, os, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
MODE = sys.argv[1] if len(sys.argv) > 1 else ''
F = os.path.expanduser('~/elevate-edicion-roc/clientes/romina-carena-brand/assets/fonts/')
OSO = lambda w, s: ImageFont.truetype(F + f'open-sauce-one/OpenSauceOne-{w}.ttf', s)
BIRTH = lambda s: ImageFont.truetype(F + 'birthstone/Birthstone-Regular.ttf', s)
WHITE, MENTA, PIEDRA, VERDE = (255, 255, 255), (148, 208, 192), (210, 207, 200), (12, 52, 40)
OUT = '../../PORTADA/02-11 ROC PAUTA Título pendiente.jpg'
DY = int(os.environ.get('DY', 110))            # imagen bajada: la cabeza deja lugar al texto dentro del cuadrado
A = lambda im: np.asarray(im, np.float32)

def bajar(im):                                  # baja la imagen DY px; arriba, espejo del cielo (queda bajo el velo)
    W, H = im.size; out = Image.new(im.mode, (W, H)); out.paste(im, (0, DY))
    out.paste(im.crop((0, 0, W, DY)).transpose(Image.FLIP_TOP_BOTTOM), (0, 0)); return out

base = bajar(Image.open('base.jpg').convert('RGB'))
fondo = bajar(Image.open('fondo.jpg').convert('RGB'))
m = np.asarray(Image.open('mascara.png').convert('L').resize((1080, 1920)), np.float32) / 255
m[:800] = 0                                     # resto suelto en la baranda
m = A(bajar(Image.fromarray((m * 255).astype(np.uint8)))) / 255
H, W = m.shape

# fondo: original bajado de luz (cerca del borde) sobre fondo limpio desenfocado
f1 = ImageEnhance.Color(ImageEnhance.Brightness(fondo.filter(ImageFilter.GaussianBlur(4))).enhance(0.84)).enhance(0.94)
f0 = ImageEnhance.Color(ImageEnhance.Brightness(base.filter(ImageFilter.GaussianBlur(2))).enhance(0.84)).enhance(0.94)
near = A(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(6)))[..., None] / 255
bg = A(f0) * near + A(f1) * (1 - near)
# sujeto: más luz y un toque cálido (ya está al sol: suave)
s = A(ImageEnhance.Contrast(ImageEnhance.Brightness(base).enhance(1.07)).enhance(1.05)); s[..., 0] *= 1.02; s[..., 2] *= 0.98
mi = A(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.5)))[..., None] / 255
img = s * mi + bg * (1 - mi)
# velo verde arriba (hasta el pelo) y abajo suave (piernas, fuera del cuadrado)
y = np.arange(H, dtype=np.float32)[:, None, None]
top = np.clip(1 - y / 1010, 0, 1) ** 1.25 * 0.86
bot = np.clip((y - 1560) / 360, 0, 1) * 0.55
for a in (top, bot): img = img * (1 - a) + np.array(VERDE, np.float32) * a
img = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))

# ---- texto
def capa(txt, font, fill, track=0):
    l, t, r, b = font.getbbox(txt); im = Image.new('RGBA', (r - l + 80, b - t + 80), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((40 - l, 40 - t), txt, font=font, fill=fill); return im
def degrade(im, c1, c2):
    a = np.asarray(im)[..., 3]; ys, _ = np.where(a > 0); y0, y1 = ys.min(), ys.max()
    t = np.clip((np.arange(im.size[1]) - y0) / max(1, y1 - y0), 0, 1)[:, None, None]
    rgb = np.array(c1, np.float32) * (1 - t) + np.array(c2, np.float32) * t
    out = np.zeros((im.size[1], im.size[0], 4), np.uint8); out[..., :3] = np.broadcast_to(rgb, out[..., :3].shape); out[..., 3] = a
    return Image.fromarray(out)
def fit(txt, mk, size, maxw):
    while capa(txt, mk(size), WHITE).size[0] - 80 > maxw: size -= 2
    return mk(size)
LINES = [  # (texto, fuente, color/degradé, glow, espacio sobre la línea)
    ('Townhouse de', BIRTH(104), WHITE, 0.0, 0),
    ('4 HABITACIONES', fit('4 HABITACIONES', lambda s: OSO('BlackItalic', s), 112, 820), WHITE, 0.55, 2),
    ('EN MIAMI-DADE POR MENOS DE', OSO('Black', 40), MENTA, 0.0, 16),
    ('$375K', OSO('Black', 200), 'grad', 0.45, 14),
]
TEXT_BOTTOM = int(os.environ.get('TB', 1000 + DY - 150))   # ~20 px sobre el tope del pelo (pelo ≈ 860 + DY)
layers = []
for txt, font, col, glow, gap in LINES:
    im = capa(txt, font, WHITE if col == 'grad' else col)
    if col == 'grad': im = degrade(im, WHITE, PIEDRA)
    bb = im.getbbox(); layers.append((im, bb, glow, gap))
total = sum(bb[3] - bb[1] + gap for _, bb, _, gap in layers)
yy = TEXT_BOTTOM - total
canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0)); glowc = Image.new('L', (W, H), 0); shad = Image.new('L', (W, H), 0)
for im, bb, glow, gap in layers:
    yy += gap; x = (W - (bb[2] - bb[0])) // 2 - bb[0]; pos = (x, yy - bb[1])
    canvas.alpha_composite(im, pos); al = im.split()[3]
    shad.paste(al, pos, al)
    if glow: g = Image.new('L', (W, H), 0); g.paste(al, pos, al); glowc = Image.fromarray(np.maximum(A(glowc), A(g) * glow).astype(np.uint8))
    yy += bb[3] - bb[1]
print('bloque de texto y', TEXT_BOTTOM - total, '→', TEXT_BOTTOM)
out = img.convert('RGBA') if MODE != 'solotexto' else Image.new('RGBA', (W, H), (0, 0, 0, 255))
sh = shad.filter(ImageFilter.GaussianBlur(14)); out.alpha_composite(Image.merge('RGBA', [Image.new('L', (W, H), 0)] * 3 + [sh.point(lambda v: v * 0.55)]))
gl = glowc.filter(ImageFilter.GaussianBlur(20)); out.alpha_composite(Image.merge('RGBA', [Image.new('L', (W, H), 255)] * 3 + [gl]))
out.alpha_composite(canvas)
if MODE == 'guias':
    d = ImageDraw.Draw(out); d.rectangle((0, 420, 1079, 1500), outline=(0, 255, 0), width=3); d.rectangle((100, 520, 980, 1400), outline=(255, 255, 0), width=2)
o = {'guias': 'guias.png', 'solotexto': 'solotexto.png'}.get(MODE, OUT)
out.convert('RGB').save(o, quality=95) if o.endswith('jpg') else out.convert('RGB').save(o); print('→', o)
