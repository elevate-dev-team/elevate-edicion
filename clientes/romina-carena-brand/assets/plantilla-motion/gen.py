"""ROC 21-11: planos, ojos/mentón por frame y subtítulos → data.json / subs.json para Remotion (30 fps)."""
import json, os, statistics
W = os.path.dirname(os.path.abspath(__file__)) + '/'
OUT = os.path.expanduser('~/remotion-local/src/roc2111/'); os.makedirs(OUT, exist_ok=True)
FPS = 30; K = 1.5  # fuente 720×1280 → 1080×1920
segs = json.load(open(W + 'segs.json')); words = json.load(open(W + 'words_sp.json'))
TOTAL = segs[-1]['b']
# [nombre, a, b, entrada fuente (s) | None = de segs, tipo, escala inicial, escala final]
CLIPS = [
    ['DF36FB08', 0, 35, None, 'cam', 1.0, 1.03],
    ['drone', 35, 88, 0.0, 'broll', 1, 1],
    ['DF36FB08', 88, 172, None, 'cam', 1.12, 1.16],
    ['E776D6F3', 172, 192, None, 'cam', 1.0, 1.02],
    ['fondo', 192, 241, 0.0, 'placa', 1, 1],
    ['E776D6F3', 241, 259, None, 'cam', 1.08, 1.1],
    ['familia', 259, 325, 0.0, 'broll', 1, 1],
    ['impuestos', 325, 435, 0.2, 'broll', 1, 1],
    ['fondo', 435, 655, 0.3, 'placa', 1, 1],
    ['B1455E43', 655, 700, None, 'cam', 1.0, 1.03],
    ['B1455E43', 700, 812, None, 'cam', 1.12, 1.17],
    ['fondo', 812, 896, 1.0, 'placa', 1, 1],
    ['19970974', 896, 930, None, 'cam', 1.0, 1.02],
    ['19970974', 930, 1085, None, 'card', 1.05, 1.1],
    ['pileta', 1085, 1174, 0.0, 'broll', 1, 1],
    ['D06A3A5E', 1174, 1189, None, 'cam', 1.0, 1.01],
    ['D06A3A5E', 1189, 1228, None, 'cam', 1.12, 1.14],
    ['llaves', 1228, 1290, 0.0, 'broll', 1, 1],
    ['D06A3A5E', 1290, 1328, None, 'cam', 1.04, 1.07],
    ['C9150D14', 1328, 1445, None, 'cam', 1.0, 1.05],
    ['C9150D14', 1445, 1548, None, 'cam', 1.12, 1.16],
]
# ---- v2: tabla línea de tiempo v1 (1548 frames) → v2, por tiempo de la fuente ----
segs1 = json.load(open(W + 'segs_v1.json'))
def remap(f):
    if f >= segs1[-1]['b']: return TOTAL
    s1 = next(x for x in segs1 if x['a'] <= f < x['b']); t = s1['s'] + (f - s1['a']) / FPS
    same = [x for x in segs if x['take'] == s1['take']]
    for x in same:
        if x['s'] - 1e-6 <= t < x['s'] + (x['b'] - x['a']) / FPS: return min(x['b'] - 1, round(x['a'] + (t - x['s']) * FPS)) if f != s1['a'] else round(x['a'] + (t - x['s']) * FPS)
    nxt = [x for x in same if x['s'] > t]
    return nxt[0]['a'] if nxt else same[-1]['b']
R = [remap(f) for f in range(segs1[-1]['b'] + 1)]
def snap(f):
    near = [x['a'] for x in segs if abs(x['a'] - f) <= 2]
    return near[0] if near else f
for c in CLIPS: c[1], c[2] = snap(R[c[1]]), snap(R[c[2]])
CLIPS = [c for c in CLIPS if c[2] > c[1]]
# cortes nuevos dentro de un plano a cámara → se parte el plano y se alterna el punch (los ojos quedan en el mismo punto)
def seg_starts(a, b): return [x['a'] for x in segs if a < x['a'] < b]
nuevos = []
for c in CLIPS:
    if c[4] != 'cam' or not seg_starts(c[1], c[2]): nuevos.append(c); continue
    cuts = [c[1]] + seg_starts(c[1], c[2]) + [c[2]]
    for k in range(len(cuts) - 1):
        lo = c[5] if k % 2 == 0 else (c[5] + 0.11 if c[5] < 1.06 else c[5] - 0.11)
        nuevos.append([c[0], cuts[k], cuts[k + 1], None, 'cam', round(lo, 3), round(lo + (c[6] - c[5]) * (cuts[k + 1] - cuts[k]) / (c[2] - c[1]), 3)])
CLIPS = nuevos
PUNCH = [c[1] for c in CLIPS if c[4] == 'cam' and c[3] is None and any(d[2] == c[1] and d[0] == c[0] and d[4] == 'cam' for d in CLIPS)]
for c in CLIPS: c[3] = None if c[4] in ('cam', 'card') else c[3]
def src_t(fr):
    for s in segs:
        if s['a'] <= fr < s['b']: return s['take'], s['s'] + (fr - s['a']) / FPS
for c in CLIPS:
    if c[3] is None:
        tk, t = src_t(c[1]); assert tk == c[0], (c, tk); c[3] = round(t, 4)
tracks = {}
for tk in set(s['take'] for s in segs):
    tracks[tk] = [list(map(float, l.split())) for l in open(W + f'tr_{tk}.txt') if len(l.split()) >= 7]
def look(tk, t): return min(tracks[tk], key=lambda r: abs(r[0] - t))
raw = {}
for c in CLIPS:
    if c[4] != 'cam': continue
    for fr in range(c[1], c[2]):
        tk, t = src_t(fr); raw[fr] = (tk, [v * K if i else v for i, v in enumerate(look(tk, t))])
frs = sorted(raw)
def sm(key):
    o1 = {}
    for fr in frs:
        tk = raw[fr][0]; o1[fr] = statistics.median([raw[f][1][key] for f in range(fr - 1, fr + 2) if f in raw and raw[f][0] == tk])
    o2 = {}
    for fr in frs:
        tk = raw[fr][0]; nb = [o1[f] for f in range(fr - 2, fr + 3) if f in o1 and raw[f][0] == tk]; o2[fr] = sum(nb) / len(nb)
    return o2
ex, ey, cb, ct = sm(5), sm(6), sm(3), sm(2)
EYES = {str(fr): [round(ex[fr], 1), round(ey[fr], 1)] for fr in frs}
def clip_at(fr):
    for c in CLIPS:
        if c[1] <= fr < c[2]: return c
def scale_at(fr):
    c = clip_at(fr)
    if c[4] != 'cam': return None
    p = (fr - c[1]) / max(1, c[2] - c[1] - 1); return c[5] + (c[6] - c[5]) * p
def chin_screen(fr):
    s = scale_at(fr)
    return None if s is None else ey[fr] + (cb[fr] - ey[fr]) * s + 12  # margen bajo el mentón
def top_screen(fr):
    s = scale_at(fr)
    return None if s is None else ey[fr] + (ct[fr] - ey[fr]) * s
# ---- subtítulos ----
NUM = {('dos', 'mil', 'veintiséis'): '2026', ('dos', 'mil', 'veintisiete'): '2027', ('dos', 'mil', 'veintiocho'): '2028',
       ('treinta', 'y', 'uno'): '31', ('ciento', 'cincuenta', 'mil', 'dólares'): '$150,000', ('cincuenta', 'mil', 'dólares'): '$50,000',
       ('doscientos', 'cincuenta', 'mil', 'dólares'): '$250,000', ('tres',): '3'}
ws = []; i = 0
while i < len(words):
    hit = None
    for seq, rep in sorted(NUM.items(), key=lambda kv: -len(kv[0])):
        if tuple(w['w'].strip(',.').lower() for w in words[i:i + len(seq)]) == seq:
            hit = (rep + (words[i + len(seq) - 1]['w'][-1] if words[i + len(seq) - 1]['w'][-1] in ',.' else ''), len(seq)); break
    if hit:
        ws.append(dict(w=hit[0], s=words[i]['s'], e=words[i + hit[1] - 1]['e'])); i += hit[1]
    else:
        ws.append(words[i]); i += 1
EST = {'interesa': 'b', 'enmienda': 'b', 'residencia': 't', 'principal': 't', 'property': 's', 'taxes': 's', 'completo': 'b',
       'residentes': 't', 'permanentes': 't', 'actual': 'b', 'quinto': 'b', 'grande': 't', 'menos': 'b', 'dueño': 'b', 'ahora': 'b',
       'propiedad': 'b', 'escribime': 's', '2026': 't', 'noticia': 'b', 'casa': 'b', 'mudarte': 'b', 'después': 'b', 'año': 'b'}
fw = [(w['w'], max(0, round((w['s'] - 0.04) * FPS)), round(w['e'] * FPS)) for w in ws]
fw = [(w, max(f, clip_at(min(f + 2, TOTAL - 1))[1]), e) for (w, f, e) in fw]  # palabra que arranca justo antes de un corte → al corte
def kind(f): return clip_at(f)[4]
def segof(f):
    for k, s in enumerate(segs):
        if s['a'] <= f < s['b']: return k
groups = []; cur = []
for (w, f, e) in fw:
    if cur and (len(cur) >= 3 or sum(len(x[0]) for x in cur) + len(w) > 17 or cur[-1][0][-1] in ',.?' or kind(f) != kind(cur[0][1])
                or clip_at(f + 2) is not clip_at(cur[0][1] + 2)):
        groups.append(cur); cur = []
    cur.append((w, f, e))
groups.append(cur)
subs = []
for gi, g in enumerate(groups):
    a = g[0][1]; b = groups[gi + 1][0][1] if gi + 1 < len(groups) else TOTAL
    b = min(b, g[-1][2] + 12)
    out = []
    for w, _, _ in g:
        k = w.strip(',.?¿').lower(); st = EST.get(k, 'm'); w = w.rstrip(',.')
        out.append([w.upper() if st in 'bst' else w, st])
    cc = [chin_screen(f) for f in range(a, b) if chin_screen(f) is not None]
    cam = len(cc) > (b - a) / 2
    y = min(1350, round(max(cc) + 20)) if cam else 960
    subs.append(dict(a=a, b=b, ws=out, y=y, cam=cam))
def chin_max(a, b): return round(max(x for x in (chin_screen(f) for f in range(a, b)) if x is not None))
def top_min(a, b): return round(min(x for x in (top_screen(f) for f in range(a, b)) if x is not None))
CHIN = {'hook': chin_max(R[100], R[172]), 'cta': chin_max(R[1445], R[1548])}
json.dump(dict(total=TOTAL, clips=CLIPS, eyes=EYES, chin=CHIN, remap=R, punch=PUNCH), open(OUT + 'data.json', 'w'))
json.dump(subs, open(OUT + 'subs.json', 'w'), ensure_ascii=False)
json.dump(ws, open(W + 'words_out.json', 'w'), ensure_ascii=False)
for s in subs: print(s['a'], s['b'], s['y'], s['cam'], ' '.join(w for w, _ in s['ws']))
print(CHIN, 'top cara hook', top_min(R[100], R[172]), 'cta', top_min(R[1445], R[1548]))
