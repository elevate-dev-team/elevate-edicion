# Pase 2: subtítulos, títulos animados, rotoscopia y flashes sobre base.mov → video_final.mov (sin audio)
import json, subprocess, sys, numpy as np
from PIL import Image
from timeline import *

GUIDES = '--guias' in sys.argv          # render de revisión con zona segura + caja de cara
OUTF = os.path.join(A, 'video_guias.mov' if GUIDES else 'video_final.mov')
SAFE = (70, 270, 900, 1440)             # reel orgánico (edicion-reels-base)
MAXW = SAFE[2] - SAFE[0] - 110          # ancho útil para bloques centrados en x=540 (540±360 → 180..900)
info = json.load(open(os.path.join(A, 'frames.json')))
SPR = os.path.join(A, 'sprites')
def sprite(name):
    im = Image.open(f'{SPR}/{name}.png').convert('RGBA')
    if im.width > MAXW + 20:
        im = im.resize((MAXW + 20, round(im.height * (MAXW + 20) / im.width)), Image.LANCZOS)
    return im

def ease_out_back(u, k=1.9):
    u -= 1; return 1 + (k + 1) * u ** 3 + k * u ** 2
def ease_out_cubic(u): return 1 - (1 - u) ** 3
def clamp(x, a, b): return max(a, min(b, x))

def frames_between(a, b): return [r for r in info if a * FPS <= r['f'] < b * FPS]

# ---- posiciones fijas por bloque (calculadas sobre todo el tramo, así nunca cruzan la cara) ----
titles = []
for name, a, b, anim, pos in TITLES:
    im = sprite(name); w, h = im.size
    fr = [r for r in frames_between(a, b) if r['kind'] == 'talk']
    if pos == 'head':
        hair = min(r['hair'] for r in fr)              # punto más alto del pelo en el tramo
        hx = np.median([r['cx'] for r in fr])
        bottom = hair - 30                             # pegado arriba de la cabeza
        if bottom - h < SAFE[1]:                       # no entra: se achica, nunca se sale de la zona segura
            sc = (bottom - SAFE[1]) / h; im = im.resize((round(w * sc), round(h * sc)), Image.LANCZOS); w, h = im.size
        cy = bottom - h / 2
        cx = clamp(hx, 540 - 60, 540 + 60)             # cerca de la cabeza pero sin salir del ancho seguro
        cx = clamp(cx, SAFE[0] + w / 2, SAFE[2] - w / 2) if w < SAFE[2] - SAFE[0] else 540
    elif pos == 'roto':
        # arriba, con solo el pie de "TAMPA" detrás de la cabeza → efecto de rotoscopia sin tapar la palabra
        cy = min(r['hair'] for r in fr) + 55 - h / 2; cx = 540
    else:
        cy, cx = 960, 540
    titles.append(dict(name=name, a=a, b=b, anim=anim, pos=pos, im=im, cx=cx, cy=cy))
    print(f'{name:11s} {pos:6s} centro ({cx:.0f},{cy:.0f}) caja y {cy-h/2:.0f}-{cy+h/2:.0f} x {cx-w/2:.0f}-{cx+w/2:.0f}')

subs = []
for i, (a, b, runs) in enumerate(SUBS):
    im = sprite(f'sub{i:02d}'); w, h = im.size
    fr = [r for r in frames_between(a, b) if r['kind'] == 'talk']
    chin = max(r['bot'] for r in fr)                   # mentón más bajo del bloque
    cy = clamp(chin + 70 + h / 2, 0, SAFE[3] - h / 2)  # a la altura del pecho, dentro de la zona segura
    subs.append(dict(a=a, b=b, im=im, cx=540, cy=cy))
    assert not any(t['a'] < b - 0.01 and a < t['b'] - 0.01 for t in titles), f'subtítulo {i} pisa un título'

masks = os.path.join(A, 'roto_mask')

# ---- transiciones: por frame → (tipo, intensidad 0..1, signo +1 salida / −1 entrada) ----
TRF = {}
for tc, kind, ko, ki in TRANS:
    c = round(tc * FPS)
    for j in range(1, ko + 1): TRF[c - j] = (kind, (ko - j + 1) / ko, +1)
    for j in range(ki): TRF[c + j] = (kind, (ki - j) / ki, -1)

def transition(img, n):
    kind, p, side = TRF[n]
    a = np.asarray(img.convert('RGB'), np.float32)
    if kind == 'zoom':      # zoom-blur: varias escalas promediadas, anclado a los ojos en los planos de Liubel
        r = info[n]
        ax, ay = (r['eye'] if r['kind'] == 'talk' else (540, 960))
        acc = np.zeros_like(a)
        scales = [1 + 0.30 * p * k / 10 for k in range(0, 11)]
        for sc in scales:
            w, h = 1080 / sc, 1920 / sc; x0, y0 = ax - ax / sc, ay - ay / sc
            acc += np.asarray(img.convert('RGB').resize((1080, 1920), Image.BILINEAR, box=(x0, y0, x0 + w, y0 + h)), np.float32)
        a = acc / len(scales)
    else:                   # whip: desplazamiento + desenfoque de movimiento horizontal
        d = -1 if kind == 'whipL' else 1
        shift = d * side * 260 * p          # sale hacia un lado, entra desde el otro
        acc = np.zeros_like(a); N = 16
        for k in range(N):
            acc += np.roll(a, int(round(shift + d * 140 * p * (k / (N - 1) - 0.5))), axis=1)
        a = acc / N
    return Image.fromarray(a.clip(0, 255).astype(np.uint8)).convert('RGBA')

def place(canvas, im, cx, cy, scale=1.0, alpha=1.0, mask=None):
    if scale != 1.0:
        im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.BICUBIC)
    if alpha < 1.0:
        im = im.copy(); im.putalpha(im.getchannel('A').point(lambda v: round(v * alpha)))
    x, y = round(cx - im.width / 2), round(cy - im.height / 2)
    if mask is not None:   # rotoscopia: el título solo donde NO hay persona
        lay = Image.new('RGBA', canvas.size, (0, 0, 0, 0)); lay.paste(im, (x, y))
        inv = mask.point(lambda v: 255 - v)
        a = Image.fromarray((np.asarray(lay.getchannel('A'), np.uint16) * np.asarray(inv, np.uint16) // 255).astype(np.uint8))
        lay.putalpha(a); canvas.alpha_composite(lay)
    else:
        canvas.alpha_composite(im, (x, y))

dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', os.path.join(A, 'base.mov'), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1080x1920', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', '-pix_fmt', 'yuv420p', OUTF], stdin=subprocess.PIPE)
N = round(END_V * FPS)
for n in range(N):
    t = n / FPS
    fr = Image.frombuffer('RGB', (1080, 1920), dec.stdout.read(1080 * 1920 * 3), 'raw', 'RGB', 0, 1).convert('RGBA')
    if n in TRF: fr = transition(fr, n)
    for T in titles:
        if not (T['a'] <= t < T['b']): continue
        u = (t - T['a']); rem = T['b'] - t
        sc, al, dy = 1.0, 1.0, 0
        if T['anim'] == 'pop':
            sc = 0.6 + 0.4 * ease_out_back(min(1, u / 0.26)); al = min(1, u / 0.08)
        elif T['anim'] == 'slam':
            sc = 1.45 - 0.45 * ease_out_back(min(1, u / 0.2), 1.2); al = min(1, u / 0.06)
        elif T['anim'] == 'rise':
            dy = 70 * (1 - ease_out_cubic(min(1, u / 0.3))); al = min(1, u / 0.18)
        if T['pos'] != 'center' and rem < 0.12:          # salida (en B-roll se va con el corte)
            al *= rem / 0.12; sc *= 0.94 + 0.06 * rem / 0.12
        mk = None
        if T['pos'] == 'roto':
            p = f'{masks}/{n:04d}.png'
            mk = Image.open(p).convert('L') if os.path.exists(p) else None
        place(fr, T['im'], T['cx'], T['cy'] + dy, sc, al, mk)
    for S in subs:
        if S['a'] <= t < S['b']:
            u = t - S['a']
            place(fr, S['im'], S['cx'], S['cy'], 0.88 + 0.12 * ease_out_cubic(min(1, u / 0.1)), min(1, u / 0.06))
    for ft in FLASHES:
        k = n - round(ft * FPS)
        if 0 <= k < 4:
            fr = Image.blend(fr, Image.new('RGBA', fr.size, (255, 255, 255, 255)), [0.85, 0.6, 0.35, 0.12][k])
    if GUIDES:
        from PIL import ImageDraw
        d = ImageDraw.Draw(fr); d.rectangle(SAFE, outline=(0, 255, 0, 255), width=3)
        r = info[n]
        if r['kind'] == 'talk':
            fw = r['fw']; d.rectangle((r['cx'] - fw * 0.75, r['hair'], r['cx'] + fw * 0.75, r['bot'] + 0.15 * fw), outline=(255, 0, 0, 255), width=3)
    enc.stdin.write(fr.convert('RGB').tobytes())
enc.stdin.close(); enc.wait()
print('ok', OUTF)
