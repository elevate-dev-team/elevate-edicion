# Pase 1: imagen base 1080x1920 (sin textos).
#  talk  → recorte de sdr.mov (720x1280) con zoom anclado a los ojos (x0 = ojo·(1−1/s)) + grade cálido + nitidez
#  album → fotos-tarjeta (borde crema, sombra) que "aterrizan" sobre papel crema con el monograma Y de la marca
#  photo → foto vertical a pantalla completa con Ken Burns anclado a las caras
import os
import json, math, subprocess, numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageFont
from timeline import *

SW, SH = 720, 1280
CREMA, ARENA, ESPRESSO = (248, 246, 241), (216, 198, 170), (62, 57, 51)

def ease_out_back(u, k=1.4):
    u -= 1; return 1 + (k + 1) * u ** 3 + k * u ** 2
def ease_out_cubic(u): return 1 - (1 - u) ** 3
def ease_io(u): return u * u * (3 - 2 * u)

# ---- tracking de cara (track_cara.swift sobre sdr.mov): t cx top bottom w ex ey ----
rows = [l.split() for l in open(os.path.join(A, 'f3_yg.txt')) if 'nan' not in l]
TT = np.array([float(r[0]) for r in rows]); COLS = np.array([[float(x) for x in r[1:7]] for r in rows])
SM = COLS.copy()
for c in range(COLS.shape[1]):
    v = COLS[:, c]; med = np.array([np.median(v[max(0, i - 1):i + 2]) for i in range(len(v))])
    SM[:, c] = np.convolve(np.pad(med, 2, mode='edge'), np.ones(5) / 5, 'valid')
def face_at(ts): return [float(np.interp(ts, TT, SM[:, c])) for c in range(6)]

# ---- grade de las tomas a cámara: un toque más de contraste y calidez, negro apenas más profundo ----
LUT = []
for ch, warm in ((0, 1.03), (1, 1.0), (2, 0.95)):
    x = np.arange(256) / 255
    y = np.clip((x - 0.025) / 0.975, 0, 1)
    y = y + 0.12 * np.sin(np.pi * y) * (y - 0.5)                      # curva en S suave
    y = np.clip(y * warm, 0, 1)
    LUT += list((y * 255).astype(int))
yy = np.arange(1920)[:, None]
VIG = np.clip(1 - yy / 700, 0, 1) ** 1.7 * 0.30          # viñeta arriba (espresso): ayuda a leer los títulos
VIG = np.broadcast_to(VIG, (1920, 1080))[..., None]
def grade_talk(im):
    im = im.point(LUT).filter(ImageFilter.UnsharpMask(2, 70, 2))
    im = ImageEnhance.Color(im).enhance(1.04)
    a = np.asarray(im, np.float32)
    a = a * (1 - VIG) + np.array(ESPRESSO, np.float32) * VIG
    return Image.fromarray(a.astype(np.uint8))

# ---- papel crema de los álbumes (fondo + monograma Y en arena muy suave) ----
def make_paper():
    g = np.zeros((1920, 1080, 3), np.float32)
    Y, X = np.mgrid[0:1920, 0:1080]
    r = np.sqrt(((X - 540) / 900) ** 2 + ((Y - 700) / 1300) ** 2)
    t = np.clip(r, 0, 1)[..., None]
    g[:] = np.array(CREMA) * (1 - t * 0.55) + np.array(ARENA) * t * 0.55
    paper = Image.fromarray(g.astype(np.uint8)).convert('RGBA')
    f = ImageFont.truetype(os.path.expanduser('~/.claude/skills/yamilet-garcia-brand/assets/fonts/playfair-display/PlayfairDisplay-400-normal.ttf'), 1500)
    lay = Image.new('RGBA', (1080, 1920), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    d.text((540, 930), 'Y', font=f, fill=(183, 154, 99, 34), anchor='mm')
    paper.alpha_composite(lay)
    rng = np.random.default_rng(3)   # grano de papel
    n = rng.normal(0, 3.2, (1920, 1080, 1)).astype(np.float32)
    return Image.fromarray(np.clip(np.asarray(paper.convert('RGB'), np.float32) + n, 0, 255).astype(np.uint8))
PAPER = make_paper()

def card(fname, crop, width):
    im = Image.open(os.path.join(FOT, fname)).convert('RGB')
    w, h = im.size
    im = im.crop((crop[0] * w, crop[1] * h, crop[2] * w, crop[3] * h))
    ih = round(width * im.height / im.width)
    return im, (width, ih)

def draw_card(canvas, src, size, cx, cy, rot, scale, alpha, kb):
    """Tarjeta: foto (con zoom interno kb) + borde crema 14 px + sombra suave, rotada y escalada."""
    w, h = size; B = 14
    zw, zh = src.width / kb, src.height / kb
    ph = src.resize((w, h), Image.LANCZOS, box=((src.width - zw) / 2, (src.height - zh) / 2, (src.width + zw) / 2, (src.height + zh) / 2))
    c = Image.new('RGBA', (w + 2 * B, h + 2 * B), CREMA + (255,)); c.paste(ph, (B, B))
    if scale != 1.0:
        c = c.resize((max(1, round(c.width * scale)), max(1, round(c.height * scale))), Image.BICUBIC)
    c = c.rotate(rot, resample=Image.BICUBIC, expand=True)
    sh_a = c.getchannel('A').filter(ImageFilter.GaussianBlur(16)).point(lambda v: int(v * 0.38 * alpha))
    sh = Image.new('RGBA', c.size, (62, 48, 30, 0)); sh.putalpha(sh_a)
    if alpha < 1: c.putalpha(c.getchannel('A').point(lambda v: int(v * alpha)))
    x, y = round(cx - c.width / 2), round(cy - c.height / 2)
    canvas.alpha_composite(sh, (x + 6, y + 14)); canvas.alpha_composite(c, (x, y))

def album_layout(key):
    """Estado FINAL de todas las tarjetas → bbox → desplazamiento para centrar el bloque en x=540, y=ALBUM_CY."""
    boxes = []
    for fname, crop, width, dx, dy, rot, _ in ALBUMS[key]:
        _, (w, h) = card(fname, crop, width)
        th = math.radians(rot); W2 = (w + 28) * abs(math.cos(th)) + (h + 28) * abs(math.sin(th)); H2 = (w + 28) * abs(math.sin(th)) + (h + 28) * abs(math.cos(th))
        boxes.append((dx - W2 / 2, dy - H2 / 2, dx + W2 / 2, dy + H2 / 2))
    x0 = min(b[0] for b in boxes); x1 = max(b[2] for b in boxes); y0 = min(b[1] for b in boxes); y1 = max(b[3] for b in boxes)
    ox, oy = 540 - (x0 + x1) / 2, ALBUM_CY - (y0 + y1) / 2
    return ox, oy, (x0 + ox, y0 + oy, x1 + ox, y1 + oy)
LAY = {k: album_layout(k) for k in ALBUMS}
CARDS = {k: [card(f, c, w) for f, c, w, *_ in v] for k, v in ALBUMS.items()}
for k, (ox, oy, bb) in LAY.items(): print('álbum', k, 'bbox final', [round(v) for v in bb])

def render_album(key, t, t0, t1):
    ox, oy, _ = LAY[key]
    u_bg = (t - t0) / max(0.01, t1 - t0)
    s = 1.0 + 0.03 * u_bg                                   # el papel respira apenas
    canvas = PAPER.resize((1080, 1920), Image.BILINEAR, box=(540 * (1 - 1 / s), 960 * (1 - 1 / s), 540 * (1 - 1 / s) + 1080 / s, 960 * (1 - 1 / s) + 1920 / s)).convert('RGBA')
    for (fname, crop, width, dx, dy, rot, tl), (src, size) in zip(ALBUMS[key], CARDS[key]):
        if t < tl - 1e-6: continue
        u = min(1, (t - tl) / 0.38)
        e = ease_out_back(u, 1.1)
        sc = 1.22 - 0.22 * e
        al = min(1, (t - tl) / 0.10)
        r = rot + 7 * (1 - ease_out_cubic(u))
        yoff = -60 * (1 - ease_out_cubic(u))
        kb = 1.0 + 0.07 * min(1, (t - tl) / max(0.5, t1 - tl))   # zoom interno lento
        draw_card(canvas, src, size, dx + ox, dy + oy + yoff, r, sc, al, kb)
    return canvas.convert('RGB')

# ---- fotos a pantalla completa ----
CARAS = {}
for l in open(os.path.join(A, 'caras_fotos.txt')):
    p = l.split(' ', 3); boxes = [list(map(float, b.strip('[] \n').split())) for b in (p[3].split('] [') if len(p) > 3 else []) if b.strip('[] \n')]
    CARAS[p[0]] = boxes
def photo_frame(fname, s, u):
    im = PHOTOS[fname]; w, h = im.size
    fc = CARAS.get(fname, [])
    ax = np.mean([(b[0] + b[2]) / 2 for b in fc]) if fc else w / 2
    ay = np.mean([(b[1] + b[3]) / 2 for b in fc]) if fc else h / 2
    cw = w; ch = cw * 16 / 9
    if ch > h: ch = h; cw = ch * 9 / 16
    y0 = np.clip(ay - ch * 0.40, 0, h - ch); x0 = np.clip(ax - cw / 2, 0, w - cw)   # caras en el 40 % superior
    zw, zh = cw / s, ch / s                                                       # Ken Burns anclado a las caras
    fx, fy = (ax - x0) / cw, (ay - y0) / ch
    bx = x0 + (cw - zw) * fx; by = y0 + (ch - zh) * fy
    out = im.resize((1080, 1920), Image.LANCZOS, box=(bx, by, bx + zw, by + zh))
    k = 1080 / zw
    faces = [((b[0] - bx) * k, (b[1] - by) * k, (b[2] - bx) * k, (b[3] - by) * k) for b in fc]
    out = ImageEnhance.Contrast(out.filter(ImageFilter.UnsharpMask(2, 50, 2))).enhance(1.04)
    a = np.asarray(out, np.float32)
    g = (np.clip((yy - 880) / 800, 0, 1) ** 1.2 * 0.70)[:, :, None] + VIG / 0.30 * 0.32   # degradé abajo (título) + arriba (tag)
    a = a * (1 - g) + np.array((30, 26, 22), np.float32) * g
    return Image.fromarray(a.astype(np.uint8)), faces
PHOTOS = {d[0]: Image.open(os.path.join(FOT, d[0])).convert('RGB') for (_, _, kind, d) in SCENES if kind == 'photo'}

# ---- render ----
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1080x1920', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-crf', '12', '-preset', 'medium', '-pix_fmt', 'yuv420p', os.path.join(A, 'base.mov')], stdin=subprocess.PIPE)
# toda la toma decodificada una vez (30 s de 720x1280 entran en memoria)
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
NSRC = len(raw) // (SW * SH * 3)
def src_frame(t):
    i = min(NSRC - 1, max(0, round(t * FPS)))
    return Image.frombuffer('RGB', (SW, SH), raw[i * SW * SH * 3:(i + 1) * SW * SH * 3], 'raw', 'RGB', 0, 1)

info = []
N = round(END_V * FPS)
for n in range(N):
    t = n / FPS
    seg = next(s for s in SCENES if s[0] - 1e-6 <= t < s[1] - 1e-6) if t < SCENES[-1][1] - 1e-6 else SCENES[-1]
    v0, v1, kind, d = seg
    u = (t - v0) / max(1e-6, v1 - v0)
    rec = {'f': n, 'kind': kind}
    if kind == 'talk':
        s = d[0] + (d[1] - d[0]) * ease_io(u)
        st = src_t(t)
        cx, top, bot, fw, ex, ey = face_at(st)
        x0, y0 = ex * (1 - 1 / s), ey * (1 - 1 / s)
        k = s * 1080 / SW
        out = grade_talk(src_frame(st).resize((1080, 1920), Image.LANCZOS, box=(x0, y0, x0 + SW / s, y0 + SH / s)))
        rec.update(s=s, eye=[(ex - x0) * k, (ey - y0) * k], top=(top - y0) * k, bot=(bot - y0) * k,
                   hair=(top - 0.30 * (bot - top) - y0) * k, cx=(cx - x0) * k, fw=fw * k)
    elif kind == 'album':
        out = render_album(d, t, v0, v1)
        rec['album'] = d; rec['bbox'] = LAY[d][2]
    else:
        fname, s0, s1 = d
        out, faces = photo_frame(fname, s0 + (s1 - s0) * ease_io(u), u)
        rec['faces'] = faces
    enc.stdin.write(out.tobytes()); info.append(rec)
    if n % 60 == 0: print(f'{t:6.2f} {kind}', flush=True)
enc.stdin.close(); enc.wait()
json.dump(info, open(os.path.join(A, 'frames.json'), 'w'))
print('frames', N)
