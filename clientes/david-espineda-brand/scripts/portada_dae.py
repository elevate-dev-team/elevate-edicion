"""Portada DAE 10-10 "Tu precio en dólares no se mueve con el guaraní" sobre el frame 1 (IMG_2428 0,6 s, sentada sonriendo),
recortado 1,33× del 4K. Sistema de las portadas publicadas de DAE (13-10, 15-10, 08-10): título ARRIBA de la cabeza,
Owners itálica (sesgada 10°) con las palabras clave en Black, blanco + celeste con degradé, degradé azul desde arriba,
sombra suave. Tratamiento de portadas-reels §4: sujeto aislado y más luminoso que el fondo.
   ~/venvs/align/bin/python portada.py [guias|solotexto]"""
import sys, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops
F = '/Users/tomisepul25/remotion-local/pub_dae1010/fonts/OwnersText-'
MODO = sys.argv[1] if len(sys.argv) > 1 else ''
W, H = 1080, 1920
SESGO = math.tan(math.radians(10))
AZUL = np.array([18, 72, 170], np.float32); NAVY = np.array([10, 29, 56], np.float32)
A = lambda im: np.asarray(im, np.float32)
yy, xx = np.mgrid[0:H, 0:W]


def imagen():
    base = Image.open('base.jpg').convert('RGB')
    mk_img = Image.open('mascara.png').convert('L').resize((W, H)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
    mk = A(mk_img) / 255
    fondo = Image.open('fondo.jpg').convert('RGB').filter(ImageFilter.GaussianBlur(4))
    fondo = ImageEnhance.Color(ImageEnhance.Brightness(fondo).enhance(0.80)).enhance(0.92)
    near = A(Image.fromarray((mk * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(10))) / 255
    bg = A(fondo) * (1 - near[..., None]) + A(ImageEnhance.Brightness(base).enhance(0.80)) * near[..., None]
    glow = np.exp(-(((xx - 535) / 330) ** 2 + ((yy - 1000) / 380) ** 2))[..., None] * 0.20
    bg = bg * (1 - glow) + np.array([255, 236, 220], np.float32) * glow
    # degradé azul de marca desde arriba (solo fondo) y navy abajo, fuera del cuadrado
    top = np.clip(1 - yy / 1000, 0, 1) ** 1.15 * 0.85
    bot = np.clip((yy - 1420) / 500, 0, 1) ** 1.5 * 0.75
    bg = bg * (1 - top[..., None]) + AZUL * top[..., None]
    bg = bg * (1 - bot[..., None]) + NAVY * bot[..., None]
    # sujeto con más exposición
    sub = Image.fromarray(np.clip(255 * (A(base) / 255) ** 0.85, 0, 255).astype(np.uint8))
    sub = ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(sub).enhance(1.10)).enhance(1.08)).enhance(1.06)
    sa = A(sub); sa[..., 0] *= 1.02; sa[..., 2] *= 0.98
    bl = np.clip((yy - 1500) / 420, 0, 1)[..., None] * 0.5
    sa = sa * (1 - bl) + NAVY * bl
    mk_in = A(mk_img.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(2.5))) / 255
    mid = A(ImageEnhance.Brightness(base).enhance(0.9))
    img = bg * (1 - mk[..., None]) + mid * (mk - mk_in)[..., None].clip(0, 1) + sa * mk_in[..., None]
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA')


def fuente(peso, size): return ImageFont.truetype(F + peso + '.ttf', size)


def degrade(size, c1=(122, 214, 255), c2=(36, 140, 222)):
    w, h = size; g = Image.new('RGBA', size); d = ImageDraw.Draw(g)
    for y in range(h):
        k = y / max(1, h - 1); d.line([(0, y), (w, y)], fill=tuple(int(a + (b - a) * k) for a, b in zip(c1, c2)) + (255,))
    return g


def linea(runs):
    fs = [fuente(p, s) for _, p, s, _ in runs]
    asc = max(f.getmetrics()[0] for f in fs); desc = max(f.getmetrics()[1] for f in fs)
    ws = [f.getlength(t) for (t, *_), f in zip(runs, fs)]
    tw = int(sum(ws)) + 40; th = asc + desc + 20
    capa = Image.new('RGBA', (tw + int(th * SESGO) + 20, th))
    x = 10
    for (t, p, s, col), f in zip(runs, fs):
        m = Image.new('L', capa.size); dm = ImageDraw.Draw(m); xx_ = x
        for ch in t:  # interletrado −2 %
            dm.text((xx_, 10 + asc), ch, font=f, fill=255, anchor='ls'); xx_ += f.getlength(ch) - 0.02 * s
        relleno = degrade(capa.size) if col == 'celeste' else Image.new('RGBA', capa.size, col)
        capa = Image.composite(relleno, capa, m); x = xx_
    capa = capa.transform(capa.size, Image.AFFINE, (1, SESGO, -SESGO * (10 + asc), 0, 1, 0), Image.BICUBIC)
    bb = capa.getbbox(); capa = capa.crop((bb[0], 0, bb[2], capa.size[1]))
    cap = max(f.getbbox('H')[3] - f.getbbox('H')[1] for f in fs)
    return capa, 10 + asc, cap


def portada(lineas, top, gaps):
    im = imagen() if MODO != 'solotexto' else Image.new('RGBA', (W, H), (0, 0, 0, 255))
    txt = Image.new('RGBA', (W, H)); base = None
    for i, runs in enumerate(lineas):
        capa, bl, cap = linea(runs)
        base = top + cap if base is None else base + gaps[i - 1] + cap
        assert capa.size[0] <= 860, (runs[0][0], capa.size[0])
        txt.alpha_composite(capa, (int(540 - capa.size[0] / 2), int(base - bl)))
        print(runs[0][0], 'base', base, 'ancho', capa.size[0])
    sombra = Image.new('RGBA', (W, H), (4, 14, 40, 0)); sombra.putalpha(txt.getchannel('A').point(lambda a: int(a * 0.55)))
    sombra = ImageChops.offset(sombra.filter(ImageFilter.GaussianBlur(10)), 0, 5)
    if MODO != 'solotexto': im.alpha_composite(sombra)
    im.alpha_composite(txt)
    if MODO == 'guias':
        d = ImageDraw.Draw(im); d.rectangle([0, 420, 1079, 1499], outline=(0, 255, 0), width=4); d.rectangle([100, 520, 980, 1400], outline=(255, 220, 0), width=3)
    out = '../../PORTADA/10-10 DAE Tu precio en dólares no se mue' + (f'_{MODO}.png' if MODO else '.jpg')
    im.convert('RGB').save(out, quality=95); print(out)


B, M = 'Black', 'Medium'; WH = (255, 255, 255, 255)
portada([
    [('Tu ', M, 74, WH), ('precio', B, 74, WH), (' en ', M, 74, WH), ('dólares', B, 74, WH)],
    [('no se mueve con el', M, 66, 'celeste')],
    [('GUARANÍ', B, 128, 'celeste')],
], top=622, gaps=[22, 18])
