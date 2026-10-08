# Sprites de texto con render_text (CoreText). Cada línea se renderiza aparte y el bloque se apila por LÍNEA DE BASE:
# el tope de las mayúsculas de una línea queda GAP px bajo la base de la anterior (las líneas casi se tocan); si una
# cola (g, p, ¿, ?) choca con la línea de abajo, se baja de a 1 px hasta que no se toquen. Sombra suave en PIL.
import json, os, subprocess
import numpy as np
from PIL import Image, ImageFilter
from timeline import A, SUBS

F = os.path.expanduser('~/.claude/skills/liubel-perez-brand/assets/fonts/')
FONTS = {
    'CM': F + 'capitana/Capitana Medium.otf', 'CB': F + 'capitana/Capitana Bold.otf',
    'CX': F + 'capitana/Capitana Extra Bold.otf', 'CK': F + 'capitana/Capitana Black.otf',
    'BH': F + 'blauer-nue/BlauerNue-Heavy.ttf',
}
OUT = os.path.join(A, 'sprites'); os.makedirs(OUT, exist_ok=True)
GAP = 5
# tracking (unidades render_text, relativas a cuerpo 58): bajo en todo el trabajo (pedido 2026-10-08)
TR_MIN, TR_CAPS, TR_BH, TR_SUB = -4.2, -5.0, -8.0, -3.2

def R(t, f, s): return dict(text=t, font=f, size=s)
TITLES = {
    't_buen':     [([R('¿realmente es un buen', 'CM', 60)], TR_MIN), ([R('TIEMPO', 'CK', 168)], TR_CAPS),
                   ([R('para comprar?', 'CX', 66)], TR_MIN)],
    't_interes':  [([R('los intereses', 'CM', 70)], TR_MIN), ([R('ALTOS', 'BH', 215)], TR_BH)],
    't_calif':    [([R('menos', 'CM', 74)], TR_MIN), ([R('PERSONAS', 'BH', 160)], TR_BH), ([R('calificando', 'CX', 76)], TR_MIN)],
    't_negociar': [([R('NEGOCIAR', 'BH', 172)], TR_BH), ([R('a tu ', 'CM', 72), R('favor', 'CX', 72)], TR_MIN)],
    't_precio':   [([R('disminuyendo el', 'CM', 70)], TR_MIN), ([R('PRECIO', 'BH', 200)], TR_BH)],
    't_cierre':   [([R('negociando', 'CM', 68)], TR_MIN), ([R('gastos de', 'CX', 86)], TR_MIN), ([R('CIERRE', 'BH', 205)], TR_BH)],
    't_parati':   [([R('puede ser el', 'CM', 66)], TR_MIN), ([R('MOMENTO', 'BH', 165)], TR_BH), ([R('para ', 'CM', 74), R('ti', 'CX', 74)], TR_MIN)],
    't_contacto': [([R('CONTÁCTAME  YA', 'CK', 100)], TR_CAPS), ([R('y lo descubrimos ', 'CB', 58), R('juntos', 'CK', 58)], TR_MIN)],
}
SUBL = {f'sub{i:02d}': [([R(t, 'CX' if b else 'CM', 60) for t, b in runs], TR_SUB)] for i, (_, _, runs) in enumerate(SUBS)}
ALL = {**TITLES, **SUBL}

# 1) render: cada línea + una "sonda" con H en las mismas fuentes/tamaños (da la línea de base y el tope de mayúsculas)
pngs = []
for name, lines in ALL.items():
    for k, (runs, tr) in enumerate(lines):
        pngs.append({'out': f'{OUT}/_{name}_{k}.png', 'lines': [{'yCenter': 960, 'tracking': tr, 'runs': runs}]})
        probe = [dict(r, text='H') for r in runs]
        pngs.append({'out': f'{OUT}/_{name}_{k}_p.png', 'lines': [{'yCenter': 960, 'tracking': 0, 'runs': probe}]})
json.dump({'fonts': FONTS, 'pngs': pngs}, open(f'{OUT}/spec.json', 'w'), ensure_ascii=False)
subprocess.run([os.path.join(A, 'render_text'), f'{OUT}/spec.json'], check=True, stdout=subprocess.DEVNULL)

def alpha(p): return np.asarray(Image.open(p).convert('RGBA').getchannel('A'))
meta = {}
for name, lines in ALL.items():
    canvas = np.zeros((1920 * 2, 1080), np.uint8); col = Image.new('RGBA', (1080, 1920 * 2), (0, 0, 0, 0))
    base_prev = None
    for k in range(len(lines)):
        img = Image.open(f'{OUT}/_{name}_{k}.png').convert('RGBA'); a = np.asarray(img.getchannel('A'))
        pb = Image.open(f'{OUT}/_{name}_{k}_p.png').getchannel('A').getbbox()   # caja de la H: tope de mayúscula y base
        cap, base = pb[1], pb[3]
        if base_prev is None: dy = 0
        else:
            dy = base_prev + GAP - cap
            while True:   # sin choques: la tinta de esta línea no puede tocar (±2 px) la ya puesta
                sh = np.zeros_like(canvas); sh[dy:dy + 1920] = a
                hit = (np.asarray(Image.fromarray(canvas).filter(ImageFilter.MaxFilter(5))) > 40) & (sh > 40)
                if not hit.any(): break
                dy += 1
        sh = np.zeros_like(canvas); sh[dy:dy + 1920] = a; canvas = np.maximum(canvas, sh)
        col.alpha_composite(img, (0, dy))
        base_prev = base + dy
    bb = col.getchannel('A').getbbox(); blk = col.crop(bb)
    is_sub = name.startswith('sub')
    blur, dyy, al = (8, 3, 0.65) if is_sub else (12, 4, 0.6)
    pad = 30; W, H = blk.width + 2 * pad, blk.height + 2 * pad
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0)); m = Image.new('L', (W, H), 0); m.paste(blk.getchannel('A'), (pad, pad + dyy))
    shadow.putalpha(m.point(lambda v: int(v * al)).filter(ImageFilter.GaussianBlur(blur)))
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0)); out.alpha_composite(shadow); out.alpha_composite(blk, (pad, pad))
    ob = out.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox(); out = out.crop(ob)
    # mantener la posición horizontal real (render_text centra en x=540)
    out.save(f'{OUT}/{name}.png')
    meta[name] = {'w': out.width, 'h': out.height, 'x0': bb[0] - pad + ob[0], 'x1': bb[0] - pad + ob[2]}
for p in os.listdir(OUT):
    if p.startswith('_'): os.remove(os.path.join(OUT, p))
json.dump(meta, open(f'{OUT}/meta.json', 'w'), indent=1)
for k, v in meta.items():
    if k.startswith('t_'): print(k, v)
print('subs', len(SUBL), 'max ancho', max(v['w'] for k, v in meta.items() if k.startswith('sub')))
