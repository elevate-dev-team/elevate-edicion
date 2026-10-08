"""Sprites de texto de Paola Jiménez (PAO) en PNG transparente 1080x1920.

Uso como módulo:
    from pao_text import lockup, subtitle
    lockup([("antes de enviar", "bajada"), ("la oferta", "golpe")]).save("t.png")
    subtitle(["Conozco", "familias"], active=1).save("s.png")

Uso por CLI (prueba rápida):
    ~/venvs/align/bin/python pao_text.py --demo out_dir/

Estilos de línea (ver SKILL.md, sección Títulos):
    bajada   Poppins BoldItalic blanca, chica
    golpe    Poppins ExtraBold magenta + contorno blanco
    golpe_bn Poppins Black MAYÚSCULA blanca (variante invertida)
    bajada_m Poppins ExtraBold magenta + contorno blanco, chica (bajada de la invertida)
    rotulo   Poppins Regular blanca (ubicación "Kissimmee, Florida")
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "..", "assets", "fonts", "poppins")
W, H = 1080, 1920

MAGENTA = (255, 33, 186)      # #FF21BA
ROSA = (248, 192, 230)        # #F8C0E6
CIRUELA = (152, 32, 114)      # #982072
WHITE = (255, 255, 255)

STYLES = {
    #            fuente                     cuerpo  color    contorno  tracking(px)
    "bajada":   ("Poppins-BoldItalic.ttf",      70, WHITE,   0,        -3),
    "golpe":    ("Poppins-ExtraBold.ttf",      170, MAGENTA, 6,        -6),
    "golpe_bn": ("Poppins-Black.ttf",          190, WHITE,   0,        -6),
    "bajada_m": ("Poppins-ExtraBold.ttf",       88, MAGENTA, 4,        -3),
    "rotulo":   ("Poppins-Regular.ttf",         52, WHITE,   0,         0),
}


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def _line(text, style, size=None):
    """Renderiza una línea con tracking y contorno; devuelve (RGBA recortada, ascent_offset)."""
    fname, base, color, stroke, track = STYLES[style]
    size = size or base
    track = track * size / base
    f = font(fname, size)
    widths = [f.getlength(c) for c in text]
    total = sum(widths) + track * (len(text) - 1) + stroke * 2 + 20
    im = Image.new("RGBA", (int(total) + 20, int(size * 1.6)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x = 10 + stroke
    for c, w in zip(text, widths):
        d.text((x, 10), c, font=f, fill=color, stroke_width=stroke, stroke_fill=WHITE)
        x += w + track
    bbox = im.getbbox()
    return im.crop(bbox)


def _shadow(sprite, opacity=0.55, blur=10, dy=6):
    a = sprite.split()[3].point(lambda v: int(v * opacity))
    sh = Image.new("RGBA", sprite.size, (0, 0, 0, 0))
    sh.putalpha(a)
    pad = blur * 3
    canvas = Image.new("RGBA", (sprite.width + pad * 2, sprite.height + pad * 2 + dy), (0, 0, 0, 0))
    canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(0)), (pad, pad + dy))
    canvas = canvas.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(sprite, (pad, pad))
    return canvas, pad


def lockup(lines, cx=540, top=None, gap=-8, max_w=900, sizes=None, shadow=True):
    """Bloque de varias líneas centradas, interlineado muy apretado (gap en px entre cajas de glifos).

    lines: [(texto, estilo), ...]. Las líneas que excedan max_w se achican solas.
    top: y del borde superior del bloque (default: centrado en y=560, tercio superior).
    """
    sprites = []
    for i, (txt, st) in enumerate(lines):
        size = (sizes or {}).get(i)
        sp = _line(txt, st, size)
        if sp.width > max_w:
            base = STYLES[st][1] if size is None else size
            sp = _line(txt, st, int(base * max_w / sp.width))
        sprites.append(sp)
    hblock = sum(s.height for s in sprites) + gap * (len(sprites) - 1)
    y = top if top is not None else 560 - hblock // 2
    block = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for sp in sprites:
        block.alpha_composite(sp, (int(cx - sp.width / 2), int(y)))
        y += sp.height + gap
    if not shadow:
        return block
    sh, pad = _shadow(block.crop(block.getbbox()))
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bx, by = block.getbbox()[:2]
    out.alpha_composite(sh, (bx - pad, by - pad))
    return out


def subtitle(words, active=None, y=1000, size=62, cx=540):
    """Subtítulo SubMachine PAO: Poppins SemiBold blanca, palabra activa magenta, sombra 89 %, sin contorno."""
    f = font("Poppins-SemiBold.ttf", size)
    space = f.getlength(" ")
    widths = [f.getlength(w) for w in words]
    total = sum(widths) + space * (len(words) - 1)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x = cx - total / 2
    for i, (w, wd) in enumerate(zip(words, widths)):
        d.text((x, y), w, font=f, fill=MAGENTA if i == active else WHITE, anchor="ls")
        x += wd + space
    a = im.split()[3].point(lambda v: int(v * 0.89))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sh.putalpha(a)
    sh = sh.filter(ImageFilter.GaussianBlur(5))
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.alpha_composite(sh, (3, 4))
    out.alpha_composite(im)
    return out


if __name__ == "__main__" and len(sys.argv) > 2 and sys.argv[1] == "--demo":
    od = sys.argv[2]
    os.makedirs(od, exist_ok=True)
    bg = Image.new("RGBA", (W, H), (120, 110, 100, 255))
    demos = {
        "lockup_bajada_golpe": lockup([("antes de enviar", "bajada"), ("la oferta", "golpe")]),
        "lockup_invertido": lockup([("LA LEY", "golpe_bn"), ("no lo exige", "bajada_m")]),
        "lockup_dato": lockup([("Zona especial de", "bajada_m"), ("RIESGO DE", "golpe_bn"), ("INUNDACIÓN", "golpe_bn")]),
        "cta_guarda": lockup([("GUARDA", "golpe"), ("este video", "bajada")], sizes={0: 230}),
        "subtitulo": subtitle(["Conozco", "familias"], active=1),
    }
    for k, im in demos.items():
        prev = bg.copy()
        prev.alpha_composite(im)
        im.save(os.path.join(od, k + ".png"))
        prev.convert("RGB").save(os.path.join(od, k + "_preview.jpg"), quality=85)
    print("ok", od)
