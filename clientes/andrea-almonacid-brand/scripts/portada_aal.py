"""Portada AAL 06-11 (v2: Andrea frente a la casa, pedido del usuario) con el sistema de las portadas de propiedad de Andrea (02-10, 03-11): cielo azul profundo arriba,
pastilla roja con itálica blanca + precio grande en degradé plateado, la casa abajo con un poco más de luz.
  python portada_aal.py [guias|solotexto]
Caso real: AAL 06-11 (2026-11-02), aprobada. Las rutas P, F y Q son las de la máquina donde se hizo: cambiarlas
(P = PORTADA/ del video, F = fuentes Acumin, Q = carpeta con la máscara y el fondo limpio de portadas-reels).
Sin Andrea en la foto: saltear el recorte y aplicar el azul sobre toda la imagen."""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance, ImageChops
import numpy as np

MODO = sys.argv[1] if len(sys.argv) > 1 else ''
P = '/Users/tomisepul25/Desktop/ELEVATE/ANDREA ALMONACID/01 REELS/11 NOVIEMBRE/06-11 AAL Título pendiente/PORTADA'
F = '/Users/tomisepul25/remotion-local/public/fonts/'
W, H = 1080, 1920
ROJO, AZUL_OSC = (219, 27, 46), (22, 46, 110)

# Andrea frente a la casa (toma 150145, 12,25 s): sujeto aislado con más luz que el fondo (portadas-reels §4)
Q = '/private/tmp/claude-501/-Users-tomisepul25-Desktop-ELEVATE-PERSONAL-CLAUDE/1b870e3e-72b4-4c52-a5ec-4b798af53332/scratchpad/por/'
base = Image.open(f'{P}/ANDREA 1 - sonriendo frente a la casa.png').convert('RGB')
mask = Image.open(Q + 'and_mascara.png').convert('L').resize((W, H))
limpio = Image.open(Q + 'and_fondo.jpg').convert('RGB').resize((W, H))
def bajar(im):
    im = ImageEnhance.Brightness(im).enhance(0.86)
    return ImageEnhance.Color(im).enhance(0.94).filter(ImageFilter.GaussianBlur(3))
# pegado al borde del sujeto va el original bajado (sin el "fantasma" del relleno)
borde = mask.filter(ImageFilter.MaxFilter(41)).filter(ImageFilter.GaussianBlur(12))
fondo = Image.composite(bajar(base), bajar(limpio), borde)
y = np.arange(H)[:, None]
# luz cálida suave detrás de la cabeza
yy, xx = np.mgrid[0:H, 0:W]
gl = np.exp(-(((xx - 520) / 330.0) ** 2 + ((yy - 880) / 300.0) ** 2)) * 0.2
fondo = Image.composite(Image.new('RGB', (W, H), (255, 214, 160)), fondo, Image.fromarray((gl * 255).astype(np.uint8)))
# azul profundo arriba, solo sobre el fondo
a = np.repeat(np.clip(1 - (y - 160) / 760.0, 0, 1) ** 1.6 * 0.8, W, 1)  # la casa se tiene que ver: azul pleno solo arriba, ~0,35 detrás del texto
fondo = Image.composite(Image.new('RGB', (W, H), AZUL_OSC), fondo, Image.fromarray((a * 255).astype(np.uint8)))
# sujeto: sombras levantadas + más luz, un toque cálido
arr = np.asarray(base).astype(np.float32) / 255
arr = arr ** 0.85
suj = Image.fromarray((arr * 255).clip(0, 255).astype(np.uint8))
suj = ImageEnhance.Brightness(suj).enhance(1.10)
suj = ImageEnhance.Contrast(suj).enhance(1.08)
suj = ImageEnhance.Color(suj).enhance(1.06)
r, g, b = suj.split(); suj = Image.merge('RGB', (r.point(lambda v: min(255, v * 1.02)), g, b.point(lambda v: v * 0.98)))
# la exposición entra ~3 px hacia adentro de la máscara (sin halo en el borde)
m_in = mask.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(1.5))
img = Image.composite(base, fondo, mask)
img = Image.composite(suj, img, m_in)
# degradé oscuro abajo, fuera del cuadrado
ab = np.clip((y - 1500) / 420.0, 0, 1) * 0.55
img = Image.composite(Image.new('RGB', (W, H), (10, 18, 40)), img, Image.fromarray((np.repeat(ab, W, 1) * 255).astype(np.uint8)))

capa = Image.new('RGBA', (W, H), (0, 0, 0, 0))

def texto_img(txt, font, fill):
    l, t, r, b = font.getbbox(txt)
    im = Image.new('RGBA', (r - l + 40, b - t + 40), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((20 - l, 20 - t), txt, font=font, fill=fill)
    return im

def italica(im, k=0.2):
    w, h = im.size
    nw = w + int(h * k)
    return im.transform((nw, h), Image.AFFINE, (1, k, -h * k, 0, 1, 0), Image.BICUBIC)

# precio grande: UltraBlack, degradé blanco → plateado, itálica
fb = ImageFont.truetype(F + 'AcuminPro-UltraBlack.otf', 150)
PRECIO = 'USD 185.000'
while True:
    t = italica(texto_img(PRECIO, fb, (255, 255, 255, 255)))
    if t.size[0] - 40 <= 840: break
    fb = ImageFont.truetype(F + 'AcuminPro-UltraBlack.otf', fb.size - 2)
alfa = t.split()[3]
bb = alfa.getbbox()
gy = np.linspace(0, 1, t.size[1])[:, None]
top_c, bot_c = np.array([255, 255, 255]), np.array([150, 160, 172])
k = np.clip((gy - bb[1] / t.size[1]) / ((bb[3] - bb[1]) / t.size[1]), 0, 1)
grad = (top_c * (1 - k) + bot_c * k)[:, None, :].repeat(t.size[0], 1).reshape(t.size[1], t.size[0], 3)
precio = Image.fromarray(grad.astype(np.uint8)).convert('RGBA'); precio.putalpha(alfa)

# pastilla roja con la línea chica
size = 62
while True:  # la pastilla queda más angosta que el precio (como en 02-10 y 03-11)
    fp = ImageFont.truetype(F + 'AcuminPro-Black.otf', size)
    linea = italica(texto_img('2 casas independientes por', fp, (255, 255, 255, 255)), 0.18)
    lb = linea.split()[3].getbbox()
    pw, ph = lb[2] - lb[0] + 48, lb[3] - lb[1] + 28
    if pw <= 0.86 * (bb[2] - bb[0]): break
    size -= 1
pill = Image.new('RGBA', (pw, ph), (0, 0, 0, 0))
ImageDraw.Draw(pill).rounded_rectangle((0, 0, pw - 1, ph - 1), radius=16, fill=ROJO + (255,))
pill.alpha_composite(linea.crop(lb), (24, 14))

# layout: bloque centrado en x = 540, arriba del cuadrado (zona útil y 520–1400)
TOP = 560
pbx = 540 - (bb[2] - bb[0]) // 2 - bb[0]
pill_x = 540 - (bb[2] - bb[0]) // 2 - 6
pill_y = TOP
precio_y = TOP + ph - 18 - bb[1]  # el precio monta apenas sobre el pie de la pastilla
for el, (x, yy) in ((pill, (pill_x, pill_y)), (precio, (pbx, precio_y))):
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    m = Image.new('RGBA', el.size, (0, 0, 0, 150)); m.putalpha(ImageChops.multiply(el.split()[3], Image.new('L', el.size, 150)))
    sh.alpha_composite(m, (x + 4, yy + 8))
    capa.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)))
capa.alpha_composite(pill, (pill_x, pill_y))
capa.alpha_composite(precio, (pbx, precio_y))

if MODO == 'solotexto':
    out = Image.new('RGB', (W, H), 'black'); out.paste(capa, (0, 0), capa)
    out.save(f'/private/tmp/claude-501/-Users-tomisepul25-Desktop-ELEVATE-PERSONAL-CLAUDE/1b870e3e-72b4-4c52-a5ec-4b798af53332/scratchpad/por/solotexto.png')
    sys.exit()
img = img.convert('RGBA'); img.alpha_composite(capa); img = img.convert('RGB')
if MODO == 'guias':
    d = ImageDraw.Draw(img)
    d.rectangle((0, 420, 1079, 1500), outline=(0, 255, 0), width=4)
    d.rectangle((100, 520, 980, 1400), outline=(255, 230, 0), width=3)
    img.save('/private/tmp/claude-501/-Users-tomisepul25-Desktop-ELEVATE-PERSONAL-CLAUDE/1b870e3e-72b4-4c52-a5ec-4b798af53332/scratchpad/por/guias.jpg', quality=92)
else:
    img.save(f'{P}/06-11 AAL Título pendiente.jpg', quality=95)
print('precio', fb.size, 'px; bbox precio x', pbx + bb[0], '-', pbx + bb[2], ' pastilla', pill_x, pill_x + pw)
