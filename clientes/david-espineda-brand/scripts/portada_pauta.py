"""Portadas DAE 01-12 PAUTA casa 800M — sistema de portada_dae.py (skill DAE §5): título arriba de la cabeza, Owners Text
itálica falsa 10°, Black en las palabras clave, blanco + celeste con degradé, degradé azul desde arriba, asesora aislada y más
luminosa que el fondo (fondo = el mismo cuadro desenfocado).
   ~/venvs/align/bin/python portada.py <1|2|3> [guias|solotexto]"""
import sys, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops
F = '/Users/tomisepul25/remotion-local/pub_dae0112/fonts/OwnersText-'
OPC = sys.argv[1]; MODO = sys.argv[2] if len(sys.argv) > 2 else ''
W, H = 1080, 1920
SESGO = math.tan(math.radians(10))
AZUL = np.array([18, 72, 170], np.float32); NAVY = np.array([10, 29, 56], np.float32)
A = lambda im: np.asarray(im, np.float32)
yy, xx = np.mgrid[0:H, 0:W]
B, M = 'Black', 'Medium'; WH = (255, 255, 255, 255)
# frame 4K (2160x3840), zoom, ancla de la cabeza (x centro, y tope) → cabeza en (540, 880)
OPCIONES = {
 '1': ('f3396_1.0', 1.6, 953, 1143, 'fachada',
       [[('Casa de ', M, 76, WH), ('3 niveles', B, 76, WH)], [('en Ciudad Nueva', M, 68, 'celeste')], [('800 MILLONES', B, 100, 'celeste')]]),
 '2': ('sala_12.1', 1.8, 1072, 1438, 'sala',
       [[('197 m²', B, 76, WH), (' a 2 cuadras', M, 76, WH)], [('de Galería', M, 68, 'celeste')], [('BONANZA', B, 124, 'celeste')]]),
 '3': ('IMG_3420_10.1b', 1.6, 1072, 1113, 'interior',
       [[('3 suites', B, 76, WH), (' + quincho', M, 76, WH)], [('en Ciudad Nueva', M, 68, 'celeste')], [('ASUNCIÓN', B, 118, 'celeste')]]),
}
name, Z, HX, HY, lugar, LINEAS = OPCIONES[OPC]
HEAD_Y = 880


def recortar(im):
    cw, ch = 2160 / Z, 3840 / Z; sc = W / cw
    x0 = min(max(0, HX - 540 / sc), 2160 - cw); y0 = min(max(0, HY - HEAD_Y / sc), 3840 - ch)
    return im.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((W, H), Image.LANCZOS)


def imagen():
    base = recortar(Image.open(f'cand/{name}.jpg').convert('RGB'))
    mk_img = recortar(Image.open(f'm_{name}.png').convert('L')).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
    mk = A(mk_img) / 255
    fondo = base.filter(ImageFilter.GaussianBlur(5))
    fondo = ImageEnhance.Color(ImageEnhance.Brightness(fondo).enhance(0.86)).enhance(0.95)
    near = A(Image.fromarray((mk * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(10))) / 255
    bg = A(fondo) * (1 - near[..., None]) + A(ImageEnhance.Brightness(base).enhance(0.86)) * near[..., None]
    glow = np.exp(-(((xx - 540) / 330) ** 2 + ((yy - 1050) / 380) ** 2))[..., None] * 0.18
    bg = bg * (1 - glow) + np.array([255, 236, 220], np.float32) * glow
    top = np.clip(1 - yy / 1000, 0, 1) ** 1.15 * 0.85
    bot = np.clip((yy - 1420) / 500, 0, 1) ** 1.5 * 0.75
    bg = bg * (1 - top[..., None]) + AZUL * top[..., None]
    bg = bg * (1 - bot[..., None]) + NAVY * bot[..., None]
    sub = Image.fromarray(np.clip(255 * (A(base) / 255) ** 0.88, 0, 255).astype(np.uint8))
    sub = ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(sub).enhance(1.06)).enhance(1.08)).enhance(1.05)
    sa = A(sub)
    bl = np.clip((yy - 1500) / 420, 0, 1)[..., None] * 0.5
    sa = sa * (1 - bl) + NAVY * bl
    mk_in = A(mk_img.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2.5))) / 255
    mid = A(ImageEnhance.Brightness(base).enhance(0.95))
    img = bg * (1 - mk[..., None]) + mid * (mk - mk_in)[..., None].clip(0, 1) + sa * mk_in[..., None]
    pelo = int(np.argmax((A(mk_img) > 128).any(1)))
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA'), pelo


def fuente(peso, size): return ImageFont.truetype(F + peso + '.ttf', size)


def degrade(size, c1=(122, 214, 255), c2=(36, 140, 222)):
    w, h = size; g = Image.new('RGBA', size); d = ImageDraw.Draw(g)
    for y in range(h):
        k = y / max(1, h - 1); d.line([(0, y), (w, y)], fill=tuple(int(a + (b - a) * k) for a, b in zip(c1, c2)) + (255,))
    return g


def linea(runs):
    fs = [fuente(p, s) for _, p, s, _ in runs]
    asc = max(f.getmetrics()[0] for f in fs); desc = max(f.getmetrics()[1] for f in fs)
    tw = int(sum(f.getlength(t) for (t, *_), f in zip(runs, fs))) + 40; th = asc + desc + 30
    capa = Image.new('RGBA', (tw + int(th * SESGO) + 20, th))
    x = 10
    for (t, p, s, col), f in zip(runs, fs):
        m = Image.new('L', capa.size); dm = ImageDraw.Draw(m); xx_ = x
        for ch in t:
            dm.text((xx_, 20 + asc), ch, font=f, fill=255, anchor='ls'); xx_ += f.getlength(ch) - 0.02 * s
        relleno = degrade(capa.size) if col == 'celeste' else Image.new('RGBA', capa.size, col)
        capa = Image.composite(relleno, capa, m); x = xx_
    capa = capa.transform(capa.size, Image.AFFINE, (1, SESGO, -SESGO * (20 + asc), 0, 1, 0), Image.BICUBIC)
    bb = capa.getbbox(); capa = capa.crop((bb[0], 0, bb[2], capa.size[1]))
    cap = max(f.getbbox('H')[3] - f.getbbox('H')[1] for f in fs)
    return capa, 20 + asc, cap


im, pelo = imagen()
if MODO == 'solotexto': im = Image.new('RGBA', (W, H), (0, 0, 0, 255))
capas = [linea(r) for r in LINEAS]; gaps = [24, 28]
alto = sum(c[2] for c in capas) + sum(gaps)
ultima = pelo - 42                       # base de la última línea ~40 px sobre el pelo
base = ultima - alto + capas[0][2]
txt = Image.new('RGBA', (W, H))
for i, (capa, bl, cap) in enumerate(capas):
    if i: base += gaps[i - 1] + cap
    assert capa.size[0] <= 860, (LINEAS[i][0][0], capa.size[0])
    txt.alpha_composite(capa, (int(540 - capa.size[0] / 2), int(base - bl)))
    print(LINEAS[i][0][0], 'base', base, 'ancho', capa.size[0])
print('pelo', pelo)
sombra = Image.new('RGBA', (W, H), (4, 14, 40, 0)); sombra.putalpha(txt.getchannel('A').point(lambda a: int(a * 0.55)))
sombra = ImageChops.offset(sombra.filter(ImageFilter.GaussianBlur(10)), 0, 5)
if MODO != 'solotexto': im.alpha_composite(sombra)
im.alpha_composite(txt)
if MODO == 'guias':
    d = ImageDraw.Draw(im); d.rectangle([0, 420, 1079, 1499], outline=(0, 255, 0), width=4); d.rectangle([100, 520, 980, 1400], outline=(255, 220, 0), width=3)
out = f'portada_{OPC}' + (f'_{MODO}.png' if MODO else '.png')
im.convert('RGB').save(out); print(out)
