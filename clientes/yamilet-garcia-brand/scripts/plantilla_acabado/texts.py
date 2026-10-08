# Sprites de texto de Yamilet García (YGM): CoreText (render_text) para el texto + PIL para color, degradé dorado,
# filetes y sombra. Cada línea se renderiza aparte y el bloque se apila por LÍNEA DE BASE (tope de mayúscula de una
# línea a GAP px de la base de la anterior, sin que las colas toquen la línea de abajo).
#
# Sistema de marca para video:
#  - Golpe: Playfair Display (Regular o Italic) con degradé dorado champagne (como el logo de sus portadas).
#  - Bajada: Montserrat Medium MAYÚSCULAS con interletrado ancho (+6) y filetes dorados a los lados ("— REALTOR —").
#  - Subtítulos: Montserrat SemiBold blanco + la palabra clave en Playfair Display Italic champagne.
#  - Sobre el papel crema de los álbumes, los colores se invierten: espresso + dorado oscuro.
import json, os, subprocess
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
from timeline import A, SUBS

F = os.path.expanduser('~/.claude/skills/yamilet-garcia-brand/assets/fonts/')
FONTS = {
    'PF': F + 'playfair-display/PlayfairDisplay-400-normal.ttf', 'PFM': F + 'playfair-display/PlayfairDisplay-500-normal.ttf',
    'PFI': F + 'playfair-display/PlayfairDisplay-400-italic.ttf', 'PFIS': F + 'playfair-display/PlayfairDisplay-600-italic.ttf',
    'ML': F + 'montserrat/Montserrat-Light.ttf', 'MR': F + 'montserrat/Montserrat-Regular.ttf',
    'MM': F + 'montserrat/Montserrat-Medium.ttf', 'MS': F + 'montserrat/Montserrat-SemiBold.ttf',
}
OUT = os.path.join(A, 'sprites'); os.makedirs(OUT, exist_ok=True)

# paleta (00 IMAGEN DE MARCA/Paleta Yamilet García.png) + derivados para video
CREMA, ARENA, TAUPE, ORO, ESPRESSO = '#F8F6F1', '#D8C6AA', '#AA967B', '#B79A63', '#3E3933'
CHAMPAGNE = '#EBD9B6'                                  # acento de subtítulo (más claro que ARENA para leerse sobre beige)
GOLD = [(0.0, '#EFDDB6'), (0.45, '#D4B47E'), (1.0, '#A8854C')]       # degradé dorado sobre video
GOLD_D = [(0.0, '#C2A36B'), (0.5, '#A8844B'), (1.0, '#7E6036')]      # degradé dorado oscuro sobre papel crema

def R(t, f, s, color=None):
    d = dict(text=t, font=f, size=s)
    if color: d['color'] = color
    return d
def L(runs, tr=0, fill='white', rules=None, gap=None):
    return dict(runs=runs, tr=tr, fill=fill, rules=rules, gap=gap)

CAPS = 6.0     # interletrado de las bajadas en mayúsculas (unidades render_text, relativas a cuerpo 58)
TITLES = {     # líneas; 'parts' = grupos de líneas que entran juntos (ver timeline.TITLE_PARTS)
    't_hook':    ([L([R('Antes de mostrarte casas,', 'MR', 42)], -0.5, CREMA),
                   L([R('quiero que me', 'PF', 82)], -0.5, GOLD, gap=16),
                   L([R('conozcas', 'PFI', 150)], -1.0, GOLD, gap=10)], [[0], [1, 2]]),
    't_nombre':  ([L([R('Yamilet', 'PF', 196)], -1.5, GOLD),
                   L([R('SOY CUBANA', 'MM', 32)], CAPS, CREMA, rules=ORO, gap=26)], [[0], [1]]),
    't_13':      ([L([R('13 ', 'PF', 236), R('años', 'PFI', 116)], -1.0, GOLD),
                   L([R('EN FLORIDA', 'MM', 32)], CAPS, CREMA, rules=ORO, gap=24)], [[0, 1]]),
    't_viajar':  ([L([R('viajar y conocer', 'MR', 42)], -0.5, ESPRESSO),
                   L([R('lugares nuevos', 'PFI', 100)], -1.0, GOLD_D, gap=14)], [[0, 1]]),
    't_familia': ([L([R('mi familia', 'PFI', 138)], -1.0, GOLD_D),
                   L([R('POR ESO HAGO LO QUE HAGO', 'MM', 27)], CAPS * 0.85, ESPRESSO, rules=ORO, gap=26)], [[0], [1]]),
    't_prop':    ([L([R('y comprar su', 'MR', 42)], -0.5, CREMA),
                   L([R('primera', 'PFI', 124)], -1.0, GOLD, gap=14),
                   L([R('propiedad', 'PF', 110)], -1.0, GOLD, gap=8)], [[0, 1, 2]]),
    't_seguro':  ([L([R('un lugar seguro', 'PFI', 104)], -1.0, GOLD),
                   L([R('PARA LOS TUYOS', 'MM', 32)], CAPS, CREMA, rules=ORO, gap=24)], [[0], [1]]),
    't_cta':     ([L([R('CUÉNTAME EN LOS COMENTARIOS', 'MM', 27)], CAPS * 0.8, CREMA),
                   L([R('¿de dónde eres?', 'PFI', 106)], -1.0, GOLD, gap=18)], [[0], [1]]),
    'c_portada': ([L([R('Antes de mostrarte casas,', 'MR', 50)], -0.5, CREMA),
                   L([R('quiero que me', 'PF', 94)], -0.5, GOLD, gap=14),
                   L([R('conozcas', 'PFI', 178)], -1.0, GOLD, gap=8)], [[0, 1, 2]]),
    'tag_tampa': ([L([R('TAMPA BAY, FLORIDA', 'MS', 30)], CAPS * 0.9, CREMA)], [[0]]),
}
SUB_SIZE, SUB_ACC = 56, 70
SUBL = {f'sub{i:02d}': ([L([R(t, 'PFIS', SUB_ACC, CHAMPAGNE) if acc else R(t, 'MS', SUB_SIZE) for t, acc in runs], -0.6)], [[0]])
        for i, (_, _, runs) in enumerate(SUBS)}
ALL = {**TITLES, **SUBL}
GAP_DEF = 14

# 1) render de cada línea + sonda "H" (línea de base y tope de mayúscula reales)
pngs = []
for name, (lines, _) in ALL.items():
    for k, ln in enumerate(lines):
        pngs.append({'out': f'{OUT}/_{name}_{k}.png', 'lines': [{'yCenter': 960, 'tracking': ln['tr'], 'runs': ln['runs']}]})
        probe = [dict(r, text='H') for r in ln['runs']]
        pngs.append({'out': f'{OUT}/_{name}_{k}_p.png', 'lines': [{'yCenter': 960, 'tracking': 0, 'runs': probe}]})
json.dump({'fonts': FONTS, 'pngs': pngs}, open(f'{OUT}/spec.json', 'w'), ensure_ascii=False)
subprocess.run([os.path.join(A, 'render_text'), f'{OUT}/spec.json'], check=True, stdout=subprocess.DEVNULL)

def hexrgb(h): v = int(h[1:], 16); return np.array([(v >> 16) & 255, (v >> 8) & 255, v & 255], np.float32)
def colorize(img, fill):
    """Pinta la línea: color liso, degradé vertical (sobre la caja de tinta) o 'white' = colores de render_text."""
    if fill == 'white': return img
    a = np.asarray(img, np.float32)
    al = a[..., 3]
    ys = np.where(al.max(1) > 8)[0]; y0, y1 = ys.min(), ys.max()
    if isinstance(fill, str):
        col = np.broadcast_to(hexrgb(fill), a[..., :3].shape)
    else:
        u = np.clip((np.arange(a.shape[0]) - y0) / max(1, y1 - y0), 0, 1)
        stops = [(p, hexrgb(c)) for p, c in fill]
        col = np.zeros((a.shape[0], 3), np.float32)
        for c in range(3):
            col[:, c] = np.interp(u, [p for p, _ in stops], [v[c] for _, v in stops])
        col = np.broadcast_to(col[:, None, :], a[..., :3].shape)
    rgb = col   # las líneas con relleno no llevan runs de color propio
    return Image.fromarray(np.dstack([rgb, al]).astype(np.uint8))

def shadow_for(fill, is_sub):
    dark_on_light = fill in (ESPRESSO,) or fill is GOLD_D
    if dark_on_light:   # sobre papel crema: sombra cálida muy leve
        return [(6, 2, 0.18, '#7E6036')]
    if is_sub:          # doble sombra: una amplia y suave (separa del vestido beige) + una corta (borde nítido)
        return [(16, 3, 0.68, '#1E1A16'), (3, 1, 0.5, '#1E1A16')]
    return [(22, 4, 0.62, '#1E1A16'), (4, 1, 0.4, '#1E1A16')]

meta = {}
for name, (lines, parts) in ALL.items():
    is_sub = name.startswith('sub')
    H2 = 1920 * 2
    canvas = np.zeros((H2, 1080), np.uint8)
    layers = []           # (k, imagen coloreada en coordenadas del bloque)
    base_prev = None
    for k, ln in enumerate(lines):
        img = colorize(Image.open(f'{OUT}/_{name}_{k}.png').convert('RGBA'), ln['fill'])
        a = np.asarray(img.getchannel('A'))
        pb = Image.open(f'{OUT}/_{name}_{k}_p.png').getchannel('A').getbbox()
        cap, base = pb[1], pb[3]
        if base_prev is None: dy = 0
        else:
            dy = base_prev + (ln['gap'] if ln['gap'] is not None else GAP_DEF) - cap
            while True:
                sh = np.zeros_like(canvas); sh[dy:dy + 1920] = a
                hit = (np.asarray(Image.fromarray(canvas).filter(ImageFilter.MaxFilter(7))) > 40) & (sh > 40)
                if not hit.any(): break
                dy += 1
        sh = np.zeros_like(canvas); sh[dy:dy + 1920] = a; canvas = np.maximum(canvas, sh)
        lay = Image.new('RGBA', (1080, H2), (0, 0, 0, 0)); lay.alpha_composite(img, (0, dy))
        if ln['rules']:   # filetes a los lados, a media altura de las mayúsculas
            bb = img.getchannel('A').getbbox(); ym = dy + (cap + base) / 2
            d = ImageDraw.Draw(lay); c = tuple(int(v) for v in hexrgb(ln['rules'])) + (255,)
            for x0, x1 in ((bb[0] - 26 - 64, bb[0] - 26), (bb[2] + 26, bb[2] + 26 + 64)):
                d.rectangle((x0, ym - 1, x1, ym + 1), fill=c)
        layers.append((k, lay, ln['fill']))
        base_prev = base + dy
    full = Image.new('RGBA', (1080, H2), (0, 0, 0, 0))
    for _, lay, _ in layers: full.alpha_composite(lay)
    bb = full.getchannel('A').getbbox()
    pad = 44
    box = (max(0, bb[0] - pad), bb[1] - pad, min(1080, bb[2] + pad), bb[3] + pad)

    def with_shadow(lay, fill):
        blk = lay.crop(box)
        out = Image.new('RGBA', blk.size, (0, 0, 0, 0))
        for blur, dyy, al, col in shadow_for(fill, is_sub):
            m = Image.new('L', blk.size, 0); m.paste(blk.getchannel('A'), (0, dyy))
            s = Image.new('RGBA', blk.size, tuple(int(v) for v in hexrgb(col)) + (0,))
            s.putalpha(m.point(lambda v: int(v * al)).filter(ImageFilter.GaussianBlur(blur)))
            out.alpha_composite(s)
        out.alpha_composite(blk)
        return out
    # sprite completo + uno por parte (mismo tamaño y origen: se superponen exacto)
    full_s = Image.new('RGBA', (box[2] - box[0], box[3] - box[1]), (0, 0, 0, 0))
    for pi, grp in enumerate(parts):
        part = Image.new('RGBA', full_s.size, (0, 0, 0, 0))
        for k, lay, fill in layers:
            if k in grp: part.alpha_composite(with_shadow(lay, fill))
        part.save(f'{OUT}/{name}_p{pi}.png'); full_s.alpha_composite(part)
    full_s.save(f'{OUT}/{name}.png')
    ink = full.crop(box).getchannel('A').getbbox()
    meta[name] = {'w': full_s.width, 'h': full_s.height, 'parts': len(parts), 'cx': (box[0] + box[2]) / 2,
                  'ink': ink, 'ink_x': (box[0] + ink[0], box[0] + ink[2])}
for p in os.listdir(OUT):
    if p.startswith('_'): os.remove(os.path.join(OUT, p))
json.dump(meta, open(f'{OUT}/meta.json', 'w'), indent=1)
for k, v in meta.items():
    if not k.startswith('sub'): print(k, v['w'], 'x', v['h'], 'tinta x', v['ink_x'])
print('subs', len(SUBL), 'máx. ancho de tinta', max(v['ink_x'][1] - v['ink_x'][0] for k, v in meta.items() if k.startswith('sub')))
