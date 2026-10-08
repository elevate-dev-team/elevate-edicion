# Línea de tiempo del acabado — 06-09 YGM Antes de mostrarte casas (1080x1920, 30 fps)
# Fuente única: ../sdr.mov (HLG de iPhone pasado a SDR con avconvert, 720x1280). Tiempos de palabras: align.json
# (alineación forzada sobre la toma cruda) → se pasan a tiempo de VIDEO con out_t().
import os, json
FPS = 30
A = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(A, '..', 'sdr.mov')
FOT = os.path.join(A, 'fotos')

# ---- CORTES de la toma (src in, src out): solo se sacan pausas largas; cada corte cae entre frases ----
CUTS = [
    (0.000, 2.967),   # Antes de mostrarte casas, quiero que me conozcas. Soy Yamilet,
    (3.500, 4.267),   # soy cubana
    (4.700, 11.133),  # y vivo hace 13 años en Florida. Me encanta un buen capuchino, [levanta la taza] viajar y conocer lugares nuevos,
    (11.700, 15.300), # pero mi motor de todos los días es mi familia y por eso hago lo que hago.
    (16.733, 20.300), # Ayudo a familias en Tampa Bay a dejar de alquilar
    (20.800, 22.100), # y comprar su primera propiedad,
    (22.567, 26.833), # porque sé lo que significa no tener un lugar seguro para los tuyos.
    (27.233, 29.900), # Cuéntame en los comentarios de dónde eres.
]
OUTS = []; _t = 0.0
for a, b in CUTS:
    OUTS.append(round(_t * FPS) / FPS); _t += round((b - a) * FPS) / FPS
END_V = round(_t * FPS) / FPS

def out_t(src):
    for (a, b), o in zip(CUTS, OUTS):
        if a - 0.05 <= src <= b + 0.05: return o + (src - a)
    raise ValueError(src)
def src_t(v):
    for (a, b), o in zip(CUTS, OUTS):
        if v < o + (b - a) - 1e-6: return a + (v - o)
    return CUTS[-1][1]
CUT_V = OUTS[1:]   # cortes de audio en tiempo de video

W_ = json.load(open(os.path.join(A, 'align.json')))
def ws(i): return round((out_t(W_[i]['s']) - 0.04) * FPS) / FPS   # arranque de la palabra i (−0,04 s)
def fr(t): return round(t * FPS) / FPS

# ---- ESCENAS de imagen (v_in, v_out, tipo, datos) ----
#  talk  = Yamilet a cámara, zoom s0→s1 anclado a los ojos (fuente 720p: máx. ~1,6×)
#  album = fotos-tarjeta sobre papel crema de marca (ver pass1.album)
#  photo = foto vertical a pantalla completa con Ken Burns
T_COLLAGE = ws(24)                 # "viajar"
T_FAMILIA = ws(37)                 # "mi familia"
T_TAMPA = ws(49)                   # "en Tampa Bay"
T_PROP = ws(56)                    # "y comprar su primera propiedad"
T_PORQUE = OUTS[6]
T_CTA = OUTS[7]
SCENES = [
    (0.0, OUTS[1], 'talk', (1.42, 1.58)),                 # hook: push-in lento
    (OUTS[1], OUTS[2], 'talk', (1.86, 1.92)),             # "soy cubana" (punch)
    (OUTS[2], ws(19), 'talk', (1.48, 1.58)),              # "y vivo hace 13 años en Florida"
    (ws(19), T_COLLAGE, 'talk', (1.64, 1.50)),            # "Me encanta un buen capuchino" + taza (zoom out suave: entra la taza)
    (T_COLLAGE, OUTS[3], 'album', 'viajes'),              # "viajar y conocer lugares nuevos"
    (OUTS[3], T_FAMILIA, 'talk', (1.55, 1.70)),           # "pero mi motor de todos los días es"
    (T_FAMILIA, OUTS[4], 'album', 'familia'),             # "mi familia y por eso hago lo que hago"
    (OUTS[4], T_TAMPA, 'talk', (1.72, 1.82)),             # "Ayudo a familias"
    (T_TAMPA, T_PROP, 'photo', ('c3c6556b-99b0-409f-8ea1-e9bffbdf9c44.jpg', 1.00, 1.07)),   # "en Tampa Bay a dejar de alquilar"
    (T_PROP, T_PORQUE, 'photo', ('cedcda09-0b67-4e88-9c0e-400b6bc46410.jpg', 1.08, 1.00)),  # "y comprar su primera propiedad"
    (T_PORQUE, T_CTA, 'talk', (1.42, 1.78)),              # "porque sé lo que significa…" push-in emotivo continuo
    (T_CTA, END_V, 'talk', (1.82, 1.90)),                 # CTA
]

# Fotos de los álbumes: (archivo, recorte relativo x0,y0,x1,y1 — saca marcas de agua del fotógrafo del crucero)
ALBUMS = {
    'viajes': [  # (foto, recorte, ancho tarjeta, centro dx, dy, rotación, t de aterrizaje)
        ('IMG_4631.jpg', (0, 0.06, 1, 0.94), 470, -150, -205, -6.0, ws(24)),       # París
        ('de13b575-6849-4514-9788-b8eda039d494.jpg', (0, 0.10, 1, 0.98), 470, 150, -175, 5.0, ws(25)),   # Roma
        ('IMG_6026.jpg', (0, 0.04, 1, 0.92), 470, -140, 95, 4.0, ws(26)),          # Granada
        ('IMG_5786.jpg', (0, 0.18, 1, 0.94), 470, 145, 120, -4.5, ws(27)),         # Sevilla
    ],
    'familia': [
        ('IMG_3605.jpg', (0.08, 0.05, 0.92, 0.90), 640, 50, -230, -5.0, T_FAMILIA),          # familia de azul (atrás)
        ('IMG_3771.jpg', (0.0, 0.03, 1.0, 0.90), 560, -20, -60, 3.5, T_FAMILIA + 0.30),       # familia de blanco (adelante)
    ],
}
ALBUM_CY = 760          # centro vertical del bloque de tarjetas (el título va pegado debajo)

# ---- TÍTULOS (sprite, t_in, t_out, posición) ----
#  'head' = arriba de la cabeza medida · 'below' = pegado debajo del bloque de tarjetas · 'low' = tercio inferior de la foto
TITLES = [
    ('t_hook',    0.00,       ws(8),     'head'),     # Antes de mostrarte casas, / quiero que me conozcas
    ('t_nombre',  ws(8),      OUTS[2],   'head'),     # Soy Yamilet, soy cubana
    ('t_13',      ws(15),     ws(19),    'head'),     # 13 años en Florida
    ('t_viajar',  T_COLLAGE,  OUTS[3],   'below'),    # viajar y conocer lugares nuevos
    ('t_familia', T_FAMILIA,  OUTS[4],   'below'),    # mi familia · por eso hago lo que hago
    ('t_prop',    T_PROP,     T_PORQUE,  'low'),      # comprar su primera propiedad
    ('t_seguro',  ws(68),     T_CTA,     'head'),     # un lugar seguro / para los tuyos
    ('t_cta',     T_CTA,      END_V,     'head'),     # Cuéntame en los comentarios / ¿de dónde eres?
]
# líneas que entran después del resto del título (sprite_parte, t): el título se arma en el tiempo de la voz
TITLE_PARTS = {
    't_hook':    [(0, 0.00), (1, ws(4))],
    't_nombre':  [(0, ws(8)), (1, ws(10))],
    't_familia': [(0, T_FAMILIA), (1, ws(39))],
    't_seguro':  [(0, ws(68)), (1, ws(71))],
    't_cta':     [(0, T_CTA), (1, ws(78))],
}
TAGS = [('tag_tampa', T_TAMPA, T_PROP)]   # tag de ubicación (convive con subtítulos)

# ---- SUBTÍTULOS: (i_palabra_inicial, i_final, runs) — runs: (texto, acento) ; acento = Playfair Italic dorado ----
SUBS_W = [
    (12, 14, [('y vivo hace', 0)]),
    (19, 20, [('Me ', 0), ('encanta', 1)]),
    (21, 23, [('un buen ', 0), ('capuchino', 1)]),
    (29, 31, [('pero mi ', 0), ('motor', 1)]),
    (32, 36, [('de todos los ', 0), ('días', 1), (' es', 0)]),
    (46, 47, [('Ayudo', 1), (' a', 0)]),
    (48, 48, [('familias', 1)]),
    (49, 51, [('en ', 0), ('Tampa Bay', 1)]),
    (52, 54, [('a dejar de', 0)]),
    (55, 55, [('alquilar', 1)]),
    (61, 62, [('porque ', 0), ('sé', 1)]),
    (63, 65, [('lo que ', 0), ('significa', 1)]),
    (66, 67, [('no ', 0), ('tener', 1)]),
]
SUBS = []
for k, (i0, i1, runs) in enumerate(SUBS_W):
    a = ws(i0)
    a = next((c for c in [x[0] for x in SCENES] if 0 < c - a < 0.08), a)
    b = ws(SUBS_W[k + 1][0]) if k + 1 < len(SUBS_W) else None
    nxt = [t for t in [x[1] for x in TITLES] + [s[0] for s in SCENES] if t > a + 0.05]
    end_word = fr(out_t(W_[i1]['e']) + 0.25)
    cand = [end_word] + ([b] if b else []) + [min(nxt)] if nxt else [end_word]
    SUBS.append((a, min(c for c in cand if c > a), runs))

# ---- TRANSICIONES (t, tipo, frames salida, frames entrada) ----
TRANS = [
    (OUTS[1], 'zoom', 2, 2), (OUTS[2], 'zoom', 2, 2), (ws(19), 'zoom', 2, 2),
    (T_COLLAGE, 'whipL', 3, 3), (OUTS[3], 'whipR', 3, 3),
    (T_FAMILIA, 'zoom', 3, 3), (OUTS[4], 'whipL', 3, 3),
    (T_TAMPA, 'zoom', 3, 3), (T_PROP, 'whipR', 2, 2), (T_PORQUE, 'zoom', 3, 3), (T_CTA, 'zoom', 2, 2),
]
LEAKS = [T_COLLAGE, T_FAMILIA, T_TAMPA]    # destello cálido (champagne) en la entrada a cada bloque de fotos

# ---- SFX (archivo, t del PICO, ganancia dB) — referencia: voz a −12 LUFS ----
SFX = [
    ('whoosh_soft', 0.02, -16), ('shimmer', ws(4), -15),
    ('swipe', OUTS[1], -14), ('shimmer', ws(8), -14), ('whoosh_soft', OUTS[2], -15),
    ('pop', ws(15), -10), ('whoosh_soft', ws(19), -16), ('wink', out_t(8.55), -14),
    ('whoosh', T_COLLAGE, -10),
] + [('shutter', t, -13) for (_, _, _, _, _, _, t) in ALBUMS['viajes']] + [
    ('swipe', OUTS[3], -13),
    ('whoosh', T_FAMILIA, -11), ('shutter', T_FAMILIA + 0.30, -13), ('shimmer', ws(39), -16),
    ('whoosh_soft', OUTS[4], -13),
    ('whoosh', T_TAMPA, -11), ('pop', T_TAMPA + 0.12, -13),
    ('swipe', T_PROP, -13), ('shimmer', T_PROP + 0.05, -15),
    ('whoosh_soft', T_PORQUE, -14), ('shimmer', ws(68), -15),
    ('whoosh', T_CTA, -12), ('pop', ws(78), -11),
]

if __name__ == '__main__':
    print('fin', END_V, 'cortes', OUTS)
    for s in SCENES: print('escena %6.2f-%6.2f %s %s' % s)
    for t in TITLES: print('título %-10s %6.2f-%6.2f %s' % t)
    for a, b, r in SUBS: print('sub %6.2f-%6.2f %s' % (a, b, ''.join(x for x, _ in r)))
