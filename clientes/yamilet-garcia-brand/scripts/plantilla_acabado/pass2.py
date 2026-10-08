# Pase 2: títulos (por partes, en el tiempo de la voz), tag de ubicación, subtítulos, transiciones y destellos
# cálidos sobre base.mov → video_final.mov (sin audio). `--guias` = render de revisión (zona segura + cajas de cara).
import json, math, subprocess, sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from timeline import *

GUIDES = '--guias' in sys.argv
OUTF = os.path.join(A, 'video_guias.mov' if GUIDES else 'video_final.mov')
SAFE = (70, 270, 900, 1440)
info = json.load(open(os.path.join(A, 'frames.json')))
SPR = os.path.join(A, 'sprites'); META = json.load(open(f'{SPR}/meta.json'))
BOUNDS = sorted({round(s[0] * FPS) for s in SCENES} | {round(END_V * FPS)})

def ease_out_cubic(u): return 1 - (1 - u) ** 3
def clamp(x, a, b): return max(a, min(b, x))
def frames_between(a, b): return [r for r in info if a * FPS - 1e-6 <= r['f'] < b * FPS - 1e-6]

def load(name):
    m = META[name]; return Image.open(f'{SPR}/{name}.png').convert('RGBA'), m

# ---- pin de ubicación (dorado) para el tag ----
def pin(h=44):
    S = 4; im = Image.new('RGBA', (h * S, h * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    r = h * S * 0.33; cx, cy = h * S / 2, r + 4
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(215, 186, 132, 255))
    d.polygon([(cx - r * 0.82, cy + r * 0.55), (cx + r * 0.82, cy + r * 0.55), (cx, h * S - 2)], fill=(215, 186, 132, 255))
    ri = r * 0.4; d.ellipse((cx - ri, cy - ri, cx + ri, cy + ri), fill=(0, 0, 0, 0))
    return im.resize((h, h), Image.LANCZOS)

# ---- posición FINAL de cada título (estado final de la animación, calculado sobre todo el tramo) ----
titles = []
for name, a, b, pos in TITLES:
    full, m = load(name); ix0, iy0, ix1, iy1 = m['ink']; ink_h = iy1 - iy0
    sc = 1.0
    if pos == 'head':
        fr = [r for r in frames_between(a, b) if r['kind'] == 'talk']
        bottom = min(r['hair'] for r in fr) - 28                     # pegado arriba del pelo (punto más alto del tramo)
        if bottom - ink_h < SAFE[1] + 6: sc = (bottom - SAFE[1] - 6) / ink_h
        ink_top = bottom - ink_h * sc
    elif pos == 'below':
        fr = frames_between(a, b); bb = fr[-1]['bbox']
        ink_top = bb[3] + 38                                         # pegado debajo del bloque de tarjetas
        if ink_top + ink_h > SAFE[3]: sc = (SAFE[3] - ink_top) / ink_h
    else:   # 'low' sobre foto: debajo de las caras más bajas, sin pasar y=1400
        fr = frames_between(a, b)
        low_face = max(f[3] for r in fr for f in r['faces'])
        ink_top = max(low_face + 120, 1400 - ink_h)
    # ancla: centro horizontal del bloque en x = 540 (render_text centra cada línea en 540)
    titles.append(dict(name=name, a=a, b=b, pos=pos, sc=sc, ink_top=ink_top, m=m,
                       parts=[Image.open(f'{SPR}/{name}_p{k}.png').convert('RGBA') for k in range(m['parts'])],
                       starts=[t for _, t in TITLE_PARTS.get(name, [(0, a)])]))
    print(f"{name:10s} {pos:5s} escala {sc:.2f} tinta y {ink_top:.0f}-{ink_top + ink_h * sc:.0f} x {m['ink_x'][0]}-{m['ink_x'][1]}")

tags = []
for name, a, b in TAGS:
    im, m = load(name); p = pin(46)
    ix0, iy0, ix1, iy1 = m['ink']
    comp = Image.new('RGBA', (im.width + 70, im.height), (0, 0, 0, 0)); comp.alpha_composite(im, (70, 0))
    sh = Image.new('RGBA', p.size, (20, 16, 12, 0)); sh.putalpha(p.getchannel('A').filter(ImageFilter.GaussianBlur(5)).point(lambda v: int(v * 0.6)))
    py = round((iy0 + iy1) / 2 - p.height / 2) - 2
    comp.alpha_composite(sh, (70 + ix0 - 62, py + 2)); comp.alpha_composite(p, (70 + ix0 - 62, py))
    tags.append(dict(a=a, b=b, im=comp, cx=540 - 35 + 35, top=SAFE[1] + 40 - iy0))

subs = []
for i, (a, b, runs) in enumerate(SUBS):
    im, m = load(f'sub{i:02d}'); ix0, iy0, ix1, iy1 = m['ink']; ink_h = iy1 - iy0
    fr = frames_between(a, b)
    talk = [r for r in fr if r['kind'] == 'talk']
    if len(talk) >= len(fr) / 2:
        head_bot = max(r['bot'] + 0.15 * r['fw'] for r in talk)      # caja de la cabeza (con margen bajo el mentón)
        ink_top = min(head_bot + 18, SAFE[3] - ink_h)
    else:   # sobre foto: lo más centrado posible sin tapar caras (busca desde el centro hacia afuera)
        faces = [f for r in fr if 'faces' in r for f in r['faces']]
        for d in [0, 40, -40, 80, -80, 120, -120, 160, 200, 240, 280]:
            t0 = 960 - ink_h / 2 + d
            if not any(t0 - 20 < f[3] and f[1] < t0 + ink_h + 20 for f in faces): break
        ink_top = t0
    subs.append(dict(a=a, b=b, im=im, top=ink_top - iy0, x=round(540 - im.width / 2) if False else round(m['cx'] - im.width / 2)))

# ---- transiciones (de la plantilla LIU 03-10): zoom-blur anclado a los ojos / whip con desenfoque de movimiento ----
TRF = {}
for tc, kind, ko, ki in TRANS:
    c = round(tc * FPS)
    for j in range(1, ko + 1): TRF[c - j] = (kind, (ko - j + 1) / ko, +1)
    for j in range(ki): TRF[c + j] = (kind, (ki - j) / ki, -1)
def transition(img, n):
    kind, p, side = TRF[n]
    a = np.asarray(img.convert('RGB'), np.float32)
    if kind == 'zoom':
        r = info[n]; ax, ay = (r['eye'] if r['kind'] == 'talk' else (540, 960))
        acc = np.zeros_like(a); scales = [1 + 0.26 * p * k / 10 for k in range(11)]
        for sc in scales:
            w, h = 1080 / sc, 1920 / sc; x0, y0 = ax - ax / sc, ay - ay / sc
            acc += np.asarray(img.convert('RGB').resize((1080, 1920), Image.BILINEAR, box=(x0, y0, x0 + w, y0 + h)), np.float32)
        a = acc / len(scales)
    else:
        d = -1 if kind == 'whipL' else 1; shift = d * side * 240 * p; acc = np.zeros_like(a); N = 16
        for k in range(N): acc += np.roll(a, int(round(shift + d * 130 * p * (k / (N - 1) - 0.5))), axis=1)
        a = acc / N
    return Image.fromarray(a.clip(0, 255).astype(np.uint8)).convert('RGBA')

# ---- destello cálido (champagne) — 3 frames antes y 6 después del corte, en "screen" ----
YY, XX = np.mgrid[0:1920, 0:1080].astype(np.float32)
def leak(img, k):
    curve = {-3: 0.15, -2: 0.35, -1: 0.65, 0: 0.85, 1: 0.65, 2: 0.45, 3: 0.3, 4: 0.18, 5: 0.08}[k]
    cx = 200 + 90 * (k + 3); cy = 520 - 20 * k
    g = np.exp(-(((XX - cx) / 620) ** 2 + ((YY - cy) / 900) ** 2)) * curve
    a = np.asarray(img.convert('RGB'), np.float32) / 255
    col = np.array([1.0, 0.90, 0.74], np.float32)
    lay = g[..., None] * col
    out = 1 - (1 - a) * (1 - lay)
    return Image.fromarray((out * 255).clip(0, 255).astype(np.uint8)).convert('RGBA')
LEAKF = {round(t * FPS) + k: k for t in LEAKS for k in range(-3, 6)}

# ---- brillo que recorre el dorado al entrar un título ----
def glint(im, u):
    if not (0.10 < u < 0.95): return im
    a = np.asarray(im, np.float32); al = a[..., 3] / 255
    h, w = al.shape; yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    pos = -0.3 * w + 1.6 * w * (u - 0.10) / 0.85
    band = np.exp(-((xx + 0.45 * yy - pos) / 46) ** 2) * 0.55 * al
    gold = (a[..., 0] > a[..., 2] + 25)                       # solo el dorado (no la bajada crema ni la sombra)
    band *= gold
    a[..., :3] = a[..., :3] + (255 - a[..., :3]) * band[..., None]
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))

def place(canvas, im, x, y, scale=1.0, alpha=1.0, anchor=None):
    if scale != 1.0:
        nw, nh = max(1, round(im.width * scale)), max(1, round(im.height * scale))
        ax, ay = anchor if anchor else (im.width / 2, im.height / 2)
        x += ax - ax * scale; y += ay - ay * scale
        im = im.resize((nw, nh), Image.BICUBIC)
    if alpha < 1.0:
        im = im.copy(); im.putalpha(im.getchannel('A').point(lambda v: round(v * alpha)))
    canvas.alpha_composite(im, (round(x), round(y)))

dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', os.path.join(A, 'base.mov'), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1080x1920', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', '-pix_fmt', 'yuv420p', OUTF], stdin=subprocess.PIPE)
N = round(END_V * FPS)
for n in range(N):
    t = n / FPS
    fr = Image.frombuffer('RGB', (1080, 1920), dec.stdout.read(1080 * 1920 * 3), 'raw', 'RGB', 0, 1).convert('RGBA')
    if n in TRF: fr = transition(fr, n)
    if n in LEAKF: fr = leak(fr, LEAKF[n])
    for T in titles:
        if not (T['a'] - 1e-6 <= t < T['b'] - 1e-6): continue
        m = T['m']; sc = T['sc']
        x0 = m['cx'] - T['parts'][0].width / 2
        y0 = T['ink_top'] - m['ink'][1] * sc
        rem = T['b'] - t
        exit_fade = round(T['b'] * FPS) not in BOUNDS
        for part, ts in zip(T['parts'], T['starts']):
            if t < ts - 1e-6: continue
            u = t - ts
            e = ease_out_cubic(min(1, u / 0.34))
            al = min(1, u / 0.22)
            if exit_fade and rem < 0.16: al *= rem / 0.16
            im = glint(part, u / 0.9) if u < 0.9 else part
            anchor = ((m['ink'][0] + m['ink'][2]) / 2, m['ink'][3])
            place(fr, im, x0, y0 + 34 * (1 - e), sc * (0.965 + 0.035 * e), al, anchor)
    for G in tags:
        if G['a'] <= t < G['b']:
            u = t - G['a']; e = ease_out_cubic(min(1, u / 0.3))
            place(fr, G['im'], 540 - G['im'].width / 2 - 30 * (1 - e), G['top'], 1.0, min(1, u / 0.2))
    for S in subs:
        if S['a'] - 1e-6 <= t < S['b'] - 1e-6:
            u = t - S['a']; e = ease_out_cubic(min(1, u / 0.14))
            place(fr, S['im'], S['x'], S['top'] + 12 * (1 - e), 1.0, min(1, u / 0.1))
    if GUIDES:
        d = ImageDraw.Draw(fr); d.rectangle(SAFE, outline=(0, 255, 0, 255), width=3)
        d.line((540, 0, 540, 1920), fill=(0, 255, 255, 160), width=1)
        r = info[n]
        if r['kind'] == 'talk':
            fw = r['fw']; d.rectangle((r['cx'] - fw * 0.75, r['hair'], r['cx'] + fw * 0.75, r['bot'] + 0.15 * fw), outline=(255, 0, 0, 255), width=3)
        for f in r.get('faces', []): d.rectangle(f, outline=(255, 0, 0, 255), width=3)
    enc.stdin.write(fr.convert('RGB').tobytes())
enc.stdin.close(); enc.wait()
print('ok', OUTF)
