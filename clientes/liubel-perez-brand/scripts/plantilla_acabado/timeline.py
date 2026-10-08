# Línea de tiempo del acabado — 03-10 LIU $389k Tampa (1080x1920, 30 fps)
# Tiempos en segundos de VIDEO. Fuente de los tiempos de palabras: align.json (alineación forzada).
import os
FPS = 30
P = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
V = os.path.join(P, 'VIDEOS')
A = os.path.dirname(os.path.abspath(__file__))

BEAT = 0.5085            # 118,0 BPM medido (grilla con error ±5 ms)
DROP_V = 18.9            # drop de la música (65,104 s del tema) = primer corte del cuerpo
MUS_OFFSET = 65.104 - DROP_V
CTA_V = 37.2             # = DROP_V + 36 tiempos (redondeado a frame)
END_V = 57.05

def beat(k):  # frame-exacto del tiempo k del cuerpo
    return round((DROP_V + k * BEAT) * FPS) / FPS

# Segmentos: (v_in, v_out, clip, src_in, kind, zoom(s0, s1) )
#  kind 'talk' = plano de Liubel con zoom anclado a los ojos; 'broll' = toma de la casa (zoom suave al centro)
HOOK_OFF = 0.42   # src(2119) = v + 0.42
CTA_OFF = -37.2   # src(2127) = v - 37.2
SEGS = [
    # ---- HOOK ----
    (0.00, 3.03, 'IMG_2119', None, 'talk', (1.35, 1.80)),   # "Liubel, el banco me presta menos de 400 mil" (zoom in constante)
    (3.03, 5.62, 'IMG_2119', None, 'talk', (2.45, 2.75)),   # punch: "pero quiero quedarme en Tampa…"
    (5.62, 7.33, 'IMG_2119', None, 'talk', (2.00, 1.70)),   # "Bueno, hoy te traigo esta casita" (zoom out)
    (7.33, 9.03, 'IMG_2119', None, 'talk', (1.20, 1.38)),   # "en el 33614 de Tampa" (abierto, título detrás)
    (9.03, 11.34, 'IMG_2119', None, 'talk', (2.20, 2.45)),  # "por menos de 390 mil dólares" (punch + precio)
    (11.34, 12.28, 'IMG_2123', 24.00, 'broll', (1.00, 1.06)),  # "Tres habitaciones" → cuarto 2
    (12.28, 14.20, 'IMG_2123', 37.00, 'broll', (1.00, 1.08)),  # "dos baños, totalmente remodeladas" → baño 2 espejo LED
    (14.20, 15.30, 'IMG_2121', 0.20, 'broll', (1.00, 1.06)),   # "techo nuevo" → techo/frente
    (15.30, 17.36, 'IMG_2122', 12.00, 'broll', (1.00, 1.08)),  # "baños y cocinas remodelados" → cocina
    (17.36, DROP_V, 'IMG_2119', None, 'talk', (1.60, 2.50)),  # "Sígueme, ven que te la muestro" (push al drop)
]
# ---- CUERPO (cortes en la grilla de 118 BPM) ----
BODY = [  # (tiempos, clip, src_in)
    (4, 'IMG_2120', 8.50),   # frente
    (4, 'IMG_2121', 4.55),   # caminata a la puerta 7812
    (4, 'IMG_2122', 0.00),   # se abre la puerta → cocina
    (4, 'IMG_2122', 6.50),   # cocina
    (4, 'IMG_2122', 16.50),  # living pared azul
    (2, 'IMG_2122', 21.50),  # pasillo
    (4, 'IMG_2122', 30.50),  # baño 1
    (4, 'IMG_2123', 6.25),   # cuarto (puerta que se abre)
    (2, 'IMG_2123', 43.40),  # ventana al patio
    (4, 'IMG_2125', 12.50),  # patio
]
k = 0
for nb, clip, src in BODY:
    SEGS.append((beat(k), beat(k + nb), clip, src, 'body', (1.00, 1.05)))
    k += nb
assert abs(beat(k) - CTA_V) < 0.02, beat(k)
SEGS += [
    # ---- CTA ----
    (CTA_V, 38.56, 'IMG_2127', None, 'talk', (1.40, 1.55)),  # "Bueno, te estuve mostrando esta opción"
    (38.56, 40.60, 'IMG_2127', None, 'talk', (2.00, 2.20)),  # "por 389 mil dólares" (punch + precio)
    (40.60, 44.30, 'IMG_2127', None, 'talk', (1.65, 1.40)),  # "Déjame saber si te gustó…" (zoom out)
    (44.30, 46.10, 'IMG_2127', None, 'talk', (1.95, 2.10)),  # "por debajo de los 400" (punch)
    (46.10, 48.55, 'IMG_2127', None, 'talk', (1.35, 1.50)),  # "Mi nombre es Liubel Pérez…" (abierto + nombre)
    (48.55, 52.27, 'IMG_2127', None, 'talk', (1.60, 1.95)),  # "y si no sabes todavía a cuánto calificas…"
    (52.27, END_V, 'IMG_2127', None, 'talk', (2.15, 1.85)),  # "contáctame…" (CONTÁCTAME arriba de la cabeza)
]

def src_time(clip, v, seg):
    if clip == 'IMG_2119': return v + HOOK_OFF
    if clip == 'IMG_2127': return v + CTA_OFF
    return seg[3] + (v - seg[0])

# ---- TÍTULOS (sprite, t_in, t_out, anim, posición) ----
#  pos: 'head' = arriba de la cabeza (medida); 'center' = centro del plano; 'roto' = detrás de Liubel
TITLES = [
    ('t_400k',      1.51,  3.03, 'pop',  'head'),
    ('t_tampa',     7.33,  9.03, 'rise', 'roto'),
    ('t_390k',      9.03, 11.34, 'slam', 'head'),
    ('t_hab',      11.34, 12.28, 'pop',  'center'),
    ('t_banos',    12.28, 14.20, 'pop',  'center'),
    ('t_techo',    14.20, 15.30, 'pop',  'center'),
    ('t_cocina',   15.30, 17.36, 'pop',  'center'),
    ('t_389k',     38.56, 40.60, 'slam', 'head'),
    ('t_nombre',   46.14, 48.55, 'rise', 'head'),
    ('t_contacto', 52.27, END_V, 'pop',  'head'),
]

# ---- SUBTÍTULOS (t_in = arranque alineado − 0,04; se ocultan bajo títulos) ----
# runs: (texto, bold)
SUBS = [
    (0.08, 1.04, [('Liubel, el ', 0), ('banco', 1)]),
    (1.04, 1.51, [('me ', 0), ('presta', 1)]),
    (3.03, 3.95, [('pero quiero ', 0), ('quedarme', 1)]),
    (3.95, 4.44, [('en ', 0), ('Tampa', 1), (',', 0)]),
    (4.44, 5.55, [('¿qué me puedes ', 0), ('conseguir', 1), ('?', 0)]),
    (5.62, 6.71, [('Bueno, hoy te ', 0), ('traigo', 1)]),
    (6.71, 7.33, [('esta ', 0), ('casita', 1)]),
    (17.36, 18.08, [('Sígueme', 1), (',', 0)]),
    (18.08, 18.90, [('ven que te la ', 0), ('muestro', 1)]),
    (37.20, 37.72, [('Bueno, te ', 0), ('estuve', 0)]),
    (37.72, 38.56, [('mostrando esta ', 0), ('opción', 1)]),
    (40.65, 41.59, [('Déjame ', 0), ('saber', 1)]),
    (41.59, 42.41, [('si te ', 0), ('gustó', 1)]),
    (42.41, 43.05, [('o si quieres ver', 0)]),
    (43.05, 43.63, [('más ', 0), ('opciones', 1)]),
    (43.63, 44.30, [('como estas', 0)]),
    (44.30, 44.78, [('por ', 0), ('debajo', 1)]),
    (44.78, 45.95, [('de los ', 0), ('$400K', 1)]),
    (48.62, 49.26, [('y si no ', 0), ('sabes', 1)]),
    (49.26, 49.84, [('todavía', 0)]),
    (49.84, 50.84, [('a cuánto ', 0), ('calificas', 1)]),
    (50.84, 51.48, [('para la ', 0), ('compra', 1)]),
    (51.48, 52.27, [('de tu ', 0), ('propiedad', 1), (',', 0)]),
]

FLASHES = [DROP_V, CTA_V]   # flash blanco de 4 frames en cada cambio de sección

# ---- TRANSICIONES (en el corte; frames de salida/entrada) ----
#  'zoom' = zoom-blur anclado a los ojos (planos de Liubel) o al centro; 'whipL'/'whipR' = barrido con desenfoque de movimiento
TRANS = [
    (3.03, 'zoom', 2, 2), (5.62, 'zoom', 2, 2), (7.33, 'whipL', 3, 3), (9.03, 'zoom', 2, 2),
    (11.34, 'zoom', 3, 3), (12.28, 'whipL', 2, 2), (14.20, 'whipR', 2, 2), (15.30, 'whipL', 2, 2), (17.36, 'zoom', 3, 3),
    (DROP_V, 'zoom', 3, 3),
] + [(beat(k), ('whipL', 'whipR', 'zoom')[j % 3], 2, 2) for j, k in enumerate([4, 8, 12, 16, 20, 22, 26, 30, 32])] + [
    (CTA_V, 'zoom', 3, 3), (38.56, 'zoom', 2, 2), (40.60, 'zoom', 2, 2), (44.30, 'zoom', 2, 2),
    (46.10, 'whipR', 3, 3), (48.55, 'zoom', 2, 2), (52.27, 'zoom', 3, 3),
]

# ---- SFX (archivo, t del PICO, ganancia dB) — referencia: voz a −12 LUFS ----
_RUTAS = __import__('json').load(open(os.path.expanduser('~/.claude/elevate/config.json')))['rutas']  # ver configuracion-inicial
SFX_DIR = os.path.join(_RUTAS['SFX'], 'SONIDOS')
SFX = [
    ('pop', 1.51, -7), ('whoosh', 3.03, -11), ('swipe', 5.62, -12),
    ('whoosh', 7.33, -8), ('pop', 7.40, -11), ('pop', 9.03, -6), ('whoosh', 9.03, -12),
    ('whoosh', 11.34, -9), ('check', 11.42, -10), ('swipe', 12.28, -12), ('check', 12.36, -10),
    ('swipe', 14.20, -12), ('check', 14.28, -10), ('swipe', 15.30, -12), ('check', 15.38, -10),
    ('whoosh', 17.36, -10), ('riser', DROP_V, -17),
    ('whoosh', DROP_V, -6),
] + [(('swipe', 'whoosh')[j % 2], beat(k), -13) for j, k in enumerate([4, 8, 12, 16, 20, 22, 26, 30, 32])] + [
    ('whoosh', CTA_V, -7), ('pop', 38.56, -6), ('whoosh', 38.56, -12), ('swipe', 40.60, -13), ('swipe', 44.30, -12),
    ('whoosh', 46.10, -9), ('pop', 46.20, -11), ('swipe', 48.55, -13), ('whoosh', 52.27, -7), ('pop', 52.27, -8),
]
