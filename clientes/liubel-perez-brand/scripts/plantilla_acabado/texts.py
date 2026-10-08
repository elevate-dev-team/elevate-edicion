# Genera los sprites de texto (títulos y subtítulos) con render_text (CoreText) → recortados a su caja.
import json, os, subprocess, math
from PIL import Image, ImageDraw, ImageFilter
from timeline import A, SUBS

F = os.path.expanduser('~/.claude/skills/liubel-perez-brand/assets/fonts/')
FONTS = {
    'CM': F + 'capitana/Capitana Medium.otf', 'CB': F + 'capitana/Capitana Bold.otf',
    'CX': F + 'capitana/Capitana Extra Bold.otf', 'CK': F + 'capitana/Capitana Black.otf',
    'BH': F + 'blauer-nue/BlauerNue-Heavy.ttf', 'BX': F + 'blauer-nue/BlauerNue-ExtraBold.ttf',
}
AZUL = '#2D6191'
OUT = os.path.join(A, 'sprites'); os.makedirs(OUT, exist_ok=True)
SH = {'blur': 10, 'dy': 4, 'alpha': 0.55}

def L(y, runs, tr=-2.5):
    return {'yCenter': y, 'tracking': tr, 'runs': [dict(text=t, font=f, size=s, **kw) for t, f, s, *rest in runs for kw in [rest[0] if rest else {}]]}

TITLES = {
    't_400k':   [L(880, [('MENOS DE', 'CX', 62)], -1), L(1000, [('$400K', 'BH', 205)], -6)],
    't_tampa':  [L(860, [('33614', 'BH', 242)], -9), L(1060, [('TAMPA', 'BH', 242)], -9)],
    't_390k':   [L(850, [('MENOS DE', 'CX', 58)], -1), L(1000, [('$390K', 'BH', 205)], -6)],
    't_hab':    [L(890, [('3', 'BH', 330)], -6), L(1080, [('HABITACIONES', 'CK', 88)], -3)],
    't_banos':  [L(915, [('2 BAÑOS', 'BH', 165)], -6), L(1035, [('totalmente ', 'CM', 54), ('remodelados', 'CX', 54)], -1.5)],
    't_techo':  [L(900, [('TECHO', 'BH', 205)], -6), L(1065, [('NUEVO', 'BH', 205, {'color': AZUL, 'stroke': 3.5})], -6)],
    't_cocina': [L(905, [('baños y ', 'CM', 76), ('cocinas', 'CX', 76)], -3.2), L(1005, [('REMODELADOS', 'BH', 100, {'color': AZUL, 'stroke': 3.5})], -6.5)],
    't_389k':   [L(850, [('esta opción por', 'CM', 56)], -1), L(1000, [('$389K', 'BH', 205)], -6)],
    't_nombre': [L(915, [('LIUBEL PÉREZ', 'CK', 98)], -1), L(1000, [('agente de ', 'CM', 56), ('Real Estate', 'CX', 56)], -1)],
    't_contacto': [L(880, [('CONTÁCTAME', 'CK', 100)], -3), L(970, [('y te asesoramos para que', 'CB', 52)], -1),
                   L(1028, [('sepas a cuánto ', 'CB', 52), ('calificas', 'CK', 52)], -1)],
}
pngs = []
for name, lines in TITLES.items():
    pngs.append({'out': f'{OUT}/{name}_full.png', 'shadow': SH, 'lines': lines})
for i, (a, b, runs) in enumerate(SUBS):
    pngs.append({'out': f'{OUT}/sub{i:02d}_full.png', 'shadow': {'blur': 8, 'dy': 3, 'alpha': 0.6},
                 'lines': [L(960, [(t, 'CX' if bold else 'CM', 60) for t, bold in runs], -1.5)]})
json.dump({'fonts': FONTS, 'pngs': pngs}, open(f'{OUT}/spec.json', 'w'), ensure_ascii=False)
subprocess.run([os.path.join(A, 'render_text'), f'{OUT}/spec.json'], check=True, stdout=subprocess.DEVNULL)

def ellipse_behind(img, box):
    """Elipse verde garabateada (dos trazos desfasados, leve rotación) alrededor de la cifra."""
    x0, y0, x1, y1 = box; cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    rx, ry = (x1 - x0) / 2 + 50, (y1 - y0) / 2 + 26
    lay = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for k, (dr, rot, w) in enumerate([(0, -4, 9), (10, -1.5, 6)]):
        pts = []
        for j in range(0, 341, 2):   # trazo casi cerrado que se superpone al final
            th = math.radians(j + 200)
            ex, ey = (rx + dr) * math.cos(th), (ry + dr * 0.6) * math.sin(th)
            r = math.radians(rot + 0.008 * j)
            pts.append((cx + ex * math.cos(r) - ey * math.sin(r), cy + ex * math.sin(r) + ey * math.cos(r)))
        d.line(pts, fill=(52, 199, 89, 255), width=w, joint='curve')
    return Image.alpha_composite(lay, img)

meta = {}
for p in pngs:
    im = Image.open(p['out']).convert('RGBA')
    name = os.path.basename(p['out']).replace('_full.png', '')
    if name in ('t_390k', 't_389k'):
        # caja de la cifra = solo la línea grande: rerender aislado de la 2.ª línea para medirla
        tmp = {'out': f'{OUT}/_num.png', 'lines': [p['lines'][1]]}
        json.dump({'fonts': FONTS, 'pngs': [tmp]}, open(f'{OUT}/_num.json', 'w'), ensure_ascii=False)
        subprocess.run([os.path.join(A, 'render_text'), f'{OUT}/_num.json'], check=True, stdout=subprocess.DEVNULL)
        im = ellipse_behind(im, Image.open(f'{OUT}/_num.png').getbbox())
    bb = im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    pad = 6; bb = (max(0, bb[0] - pad), max(0, bb[1] - pad), min(1080, bb[2] + pad), min(1920, bb[3] + pad))
    im.crop(bb).save(f'{OUT}/{name}.png')
    meta[name] = {'w': bb[2] - bb[0], 'h': bb[3] - bb[1], 'x0': bb[0], 'x1': bb[2]}
    os.remove(p['out'])
json.dump(meta, open(f'{OUT}/meta.json', 'w'), indent=1)
for k, v in meta.items():
    if k.startswith('t_'): print(k, v)
print('subs', len(SUBS), 'max ancho', max(v['w'] for k, v in meta.items() if k.startswith('sub')))
