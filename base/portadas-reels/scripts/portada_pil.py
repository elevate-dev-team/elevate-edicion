# portada_pil.py — Portada 9:16 en PIL (sin Remotion), probada y aprobada en PAO 10-09 "HOA y CDD no son lo mismo" (2026-10-05).
# Copiarla al proyecto y ajustar rutas, recorte (zoom anclado a los ojos), LINES (texto/fuentes/colores de la marca) y TEXT_TOP.
# Resuelve lo que pidió el usuario en 3 rondas de corrección:
#   - sujeto aislado y con MÁS exposición (levanta sombras con gamma 0,82 + brillo 1,14, contraste y color leves), fondo
#     limpio bajado al 80 % y desenfocado 4 px, luz cálida suave detrás de la cabeza, degradés arriba y abajo que NO
#     pasan por encima del sujeto dentro del cuadrado (solo piernas fuera del cuadrado);
#   - borde sin halo: alrededor del sujeto va el original bajado (no el relleno) y la exposición entra 3 px hacia adentro;
#   - completa partes que Vision deja afuera (ej. una mano) con píxeles de piel dentro de una elipse;
#   - lockup con líneas de pesos mezclados posicionadas por LÍNEA DE BASE, interlineado muy apretado, y la línea de abajo
#     partida alrededor de la cola de la "y"/"g" del golpe (la cola cae en el espacio entre palabras);
#   - texto pegado debajo del mentón (TEXT_TOP = base de la cabeza medida + ~20 px).
# Insumos (desde scripts de esta skill): recorte_personas.swift -> personas3.png/mascara3.png; fondo_limpio.swift -> fondo3.jpg.
# Verificar: `portada_pil.py solotexto` + medir_texto.py; `portada_pil.py guias` para ver cuadrado y margen.
import os
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
F = os.path.expanduser('~/.claude/skills/paola-jimenez-brand/assets/fonts/poppins/')
W, H = 1080, 1920
ROSA = (248, 192, 230); WHITE = (255, 255, 255); CIR_D = (28, 6, 20)
MODE = sys.argv[1] if len(sys.argv) > 1 else ''
OUT = '../../../PORTADA/10-09 PAO HOA y CDD no son lo mismo.jpg'
TEXT_TOP = 792             # tope real del bloque: ~20 px bajo el mentón medido (cabeza hasta y≈772 en base3), sobre el pecho

base = Image.open('base3.jpg').convert('RGB')
A = lambda im: np.asarray(im, np.float32)

# ---- máscara del sujeto: Vision + la mano derecha que Vision dejó a medias (píxeles de piel en esa zona) ----
mk = A(Image.open('mascara3.png').convert('L').resize((W, H))) / 255
b = A(base); r, g, bl = b[..., 0], b[..., 1], b[..., 2]
skin = (r > 95) & (r > g + 12) & (r > bl + 25) & (r - bl < 140)
yy, xx = np.mgrid[0:H, 0:W]
ell = ((xx - 700) / 95) ** 2 + ((yy - 1100) / 80) ** 2 < 1
mk = np.maximum(mk, (skin & ell).astype(np.float32))
mk_img = Image.fromarray((mk * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
mk = A(mk_img) / 255

# ---- fondo: relleno limpio, desenfoque leve, exposición abajo ----
fondo = Image.open('fondo3.jpg').convert('RGB').filter(ImageFilter.GaussianBlur(4))
fondo = ImageEnhance.Brightness(fondo).enhance(0.80)
fondo = ImageEnhance.Color(fondo).enhance(0.92)
# alrededor del borde del sujeto se usa el original bajado (sin relleno, evita halo)
near = A(Image.fromarray((mk * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(10))) / 255
base_dark = ImageEnhance.Brightness(base).enhance(0.80)
bg = A(fondo) * (1 - near[..., None]) + A(base_dark) * near[..., None]

# luz cálida suave detrás de la cabeza (solo fondo)
glow = np.exp(-(((xx - 545) / 330) ** 2 + ((yy - 640) / 380) ** 2))[..., None] * 0.22
bg = bg * (1 - glow) + np.array([255, 236, 220], np.float32) * glow

# degradés: arriba (ciruela muy oscuro) y abajo (para el texto)
top = np.clip(1 - yy / 560, 0, 1) ** 1.6 * 0.60
bot = np.clip((yy - 1150) / 770, 0, 1) ** 1.3 * 0.80
for gr in (top, bot):
    bg = bg * (1 - gr[..., None]) + np.array(CIR_D, np.float32) * gr[..., None]

# ---- sujeto con más exposición ----
sub = Image.fromarray(np.clip(255 * (A(base) / 255) ** 0.82, 0, 255).astype(np.uint8))   # levanta sombras (ropa negra)
sub = ImageEnhance.Brightness(sub).enhance(1.14)
sub = ImageEnhance.Contrast(sub).enhance(1.08)
sub = ImageEnhance.Color(sub).enhance(1.06)
sa = A(sub); sa[..., 0] *= 1.02; sa[..., 2] *= 0.98                    # un toque cálido
# el degradé inferior también cae, más suave, sobre las piernas (que el texto se lea)
bl = np.clip((yy - 1500) / 420, 0, 1)[..., None] * 0.5                  # solo las piernas, fuera del cuadrado
sa = sa * (1 - bl) + np.array(CIR_D, np.float32) * bl
# borde: la exposición del sujeto entra 3 px hacia adentro (sin borde claro de la pared que quedó en la máscara)
mk_in = A(mk_img.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2.5))) / 255
mid = A(ImageEnhance.Brightness(base).enhance(0.9))
img = bg * (1 - mk[..., None]) + mid * (mk - mk_in)[..., None].clip(0, 1) + sa * mk_in[..., None]
img = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA')

# ---- lockup ----
LINES = [
    [('Antes de comprar ', 'Poppins-LightItalic.ttf', 56, WHITE), ('casa nueva', 'Poppins-BoldItalic.ttf', 56, WHITE)],
    [('HOA y CDD', 'Poppins-ExtraBold.ttf', 166, ROSA)],
]
L3A = [('no son', 'Poppins-LightItalic.ttf', 66, WHITE)]
L3B = [('lo mismo', 'Poppins-BoldItalic.ttf', 66, WHITE)]
def render(line):
    """Devuelve (sprite, y_baseline dentro del sprite, cap_top dentro del sprite)."""
    parts = []
    for txt, fn, sz, col in line:
        f = ImageFont.truetype(F + fn, sz); tr = -0.035 * sz
        parts.append((txt, f, col, sum(f.getlength(c) for c in txt) + tr * (len(txt) - 1), tr))
    tw = sum(p[3] for p in parts); asc = max(p[1].getmetrics()[0] for p in parts)
    im = Image.new('RGBA', (int(tw) + 60, 400), (0, 0, 0, 0)); d = ImageDraw.Draw(im); x = 20
    for txt, f, col, w, tr in parts:
        for c in txt:
            d.text((x, 40 + asc), c, font=f, fill=col, anchor='ls'); x += f.getlength(c) + tr
    bb = im.getbbox(); cap = min(p[1].getbbox('H', anchor='ls')[1] for p in parts) + 40 + asc
    return im.crop(bb), 40 + asc - bb[1], cap - bb[1]
sp = [render(l) for l in LINES]
sp.append(render(L3A)); sp3b = render(L3B)
# posiciones por línea de base: la bajada pegada sobre las mayúsculas del golpe, y "no son lo mismo"
# subida a la altura de la cola de la "y" (las mayúsculas de abajo tocan casi la línea de base del golpe)
G_BASE = 0
pos = {1: G_BASE - sp[1][1]}
pos[0] = (G_BASE - (sp[1][1] - sp[1][2])) - 8 - sp[0][1]           # base de la bajada 8 px sobre el tope de las mayúsculas
pos[2] = G_BASE + 6 + (sp[2][1] - sp[2][2]) - sp[2][1]            # tope de la línea 3 a 6 px bajo la base del golpe
y0 = min(pos.values()); y1 = max(pos[i] + sp[i][0].height for i in pos)
shift = TEXT_TOP - y0
block = Image.new('RGBA', (W, H), (0, 0, 0, 0))
# línea 3 partida: "no son" | cola de la "y" | "lo mismo" (la cola cae en el espacio entre palabras)
gs = sp[1][0]; ga = np.asarray(gs.split()[3]); desc = ga[sp[1][1] + 4:]
cols = np.where(desc.max(0) > 40)[0]; gx0 = 540 - gs.width / 2
tail_l, tail_r = gx0 + cols.min(), gx0 + cols.max()
GAP = 16
for i in (0, 1):
    s = sp[i][0]; block.alpha_composite(s, (int(540 - s.width / 2), int(pos[i] + shift)))
y3 = int(pos[2] + shift)
block.alpha_composite(sp[2][0], (int(tail_l - GAP - sp[2][0].width), y3 + sp[2][1] - sp[2][1]))
block.alpha_composite(sp3b[0], (int(tail_r + GAP), y3 + sp[2][1] - sp3b[1]))
a = block.split()[3].point(lambda v: int(v * 0.65)); sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sh.putalpha(a)
sh = sh.filter(ImageFilter.GaussianBlur(12)); txt = Image.new('RGBA', (W, H), (0, 0, 0, 0))
txt.alpha_composite(sh, (0, 6)); txt.alpha_composite(block)
if MODE == 'solotexto':
    out = Image.new('RGBA', (W, H), (0, 0, 0, 255)); out.alpha_composite(txt); out.convert('RGB').save('solo_texto.png'); sys.exit()
img.alpha_composite(txt)
if MODE == 'guias':
    d = ImageDraw.Draw(img); d.rectangle((0, 420, 1079, 1500), outline=(0, 255, 0, 255), width=4); d.rectangle((100, 520, 980, 1400), outline=(255, 220, 0, 255), width=3)
    img.convert('RGB').save('guias.jpg', quality=92); sys.exit()
img.convert('RGB').save(OUT, quality=95)
