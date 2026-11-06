"""ROC 02-11: palabras → línea de tiempo, planos, cara por frame, eventos y subtítulos → data.json (Remotion, 25 fps)."""
import json, os, math
W = os.path.dirname(os.path.abspath(__file__)) + '/'
OUT = os.path.expanduser('~/remotion-local/src/roc0211/'); os.makedirs(OUT, exist_ok=True)
FPS = 25
segs = json.load(open(W + 'cortes.json')); TOTAL = segs[-1]['start_frame'] + segs[-1]['frames']
AL = {'hook': 'a_hook', 'off': 'a_off', 'terraza': 'a_255', 'cta': 'a_256'}
# ---- palabras en la línea de tiempo (con números ya escritos) ----
REP = {('three', 'sixty', 'four', 'nine', 'hundred'): '$374,990', ('fourteen', 'eighteen'): '1,418', ('twenty', 'one', 'hundred'): '2,100',
       ('cuatro', 'coma', 'noventa', 'y', 'nueve', 'por', 'ciento'): '4.99%', ('cuatro', 'cuartos'): '4 cuartos', ('seis',): '6', ('tres', 'niveles'): '3 niveles',
       ('cuatro', 'habitaciones'): '4 habitaciones', ('tres', 'baños'): '3 baños', ('dos', 'años'): '2 años', ('dos', 'puestos'): '2 puestos',
       ('dos', 'primeros'): '2 primeros', ('miami', 'dade'): 'Miami-Dade', ('fha',): 'FHA', ('va',): 'VA', ('smart',): 'SMART'}
words = []
for src, fn in AL.items():
    ws = json.load(open(W + f'transcripciones/{fn}.json')); i = 0
    while i < len(ws):
        hit = None
        for seq, rep in sorted(REP.items(), key=lambda kv: -len(kv[0])):
            if tuple(w['w'].lower() for w in ws[i:i + len(seq)]) == seq: hit = (rep, len(seq)); break
        if hit: words.append(dict(src=src, w=hit[0], s=ws[i]['s'], e=ws[i + hit[1] - 1]['e'])); i += hit[1]
        else: words.append(dict(src=src, **{k: ws[i][k] for k in ('w', 's', 'e')})); i += 1
PUNT = {'Sabías': '¿Sabías', 'independiente': 'independiente', 'gratis': 'gratis.', 'Turnpike': 'Turnpike,', 'total': 'total.', 'barbecues': 'barbecues.',
        'mudarse': 'mudarse.', 'vivir': 'vivir,', 'años': 'años.', 'creciendo': 'creciendo.', 'Amazon': 'Amazon,', 'FedEx': 'FedEx,', 'sur': 'sur.', 'seguir': 'seguir.'}
def tl(src, t):
    for s in segs:
        if s['src'] == src and s['a'] - 0.06 <= t < s['b'] + 0.02:
            return s['start_frame'] + max(0, (t - s['a'])) * FPS
    return None
wt = []
for w in words:
    f = tl(w['src'], w['s']); e = tl(w['src'], min(w['e'], w['e'])) or (f + 5 if f is not None else None)
    if f is None: continue
    if w['w'] in PUNT and not (w['w'] == 'años' and w['src'] == 'hook' and False): pass
    wt.append(dict(w=w['w'], f=round(f), e=round(e), src=w['src']))
for i, w in enumerate(wt):
    nxt = wt[i + 1]['w'] if i + 1 < len(wt) else ''
    if w['w'] in PUNT: w['w'] = PUNT[w['w']]
    if w['w'] == '$374,990': w['w'] = '$374,990.'
    if w['w'] == 'Miami-Dade' and nxt in ('son', 'escríbeme', 'por'): w['w'] = 'Miami-Dade,' if nxt != 'por' else 'Miami-Dade'
def F(word, after=0):
    for w in wt:
        if w['f'] >= after and w['w'].strip('.¿?').rstrip(',').lower() == word.strip('.¿?').rstrip(',').lower(): return w['f']
    raise KeyError(word)
# ---- planos [nombre, a, b, entrada s, tipo, escala0, escala1] ----
CLIPS = [
    ['hook', 0, 102, 0.04, 'cam', 1.0, 1.05], ['hook', 102, 167, 4.68, 'cam', 1.2, 1.24],
    ['r47', 167, 241, 2.0, 'broll', 1, 1],
    ['hook', 241, 283, 14.57, 'cam', 1.0, 1.02], ['hook', 283, 376, 16.25, 'cam', 1.18, 1.24],
    ['r47', 376, 425, 0.0, 'broll', 1, 1], ['r50', 425, 474, 5.0, 'broll', 1, 1],
    ['r48', 474, 538, 0.0, 'broll', 1, 1], ['r48', 538, 573, 10.0, 'broll', 1, 1], ['r48', 573, 606, 26.2, 'broll', 1, 1],
    ['r47', 606, 696, 16.0, 'broll', 1, 1], ['r48', 696, 752, 55.0, 'broll', 1, 1],
    ['terraza', 752, 790, 1.61, 'cam', 1.45, 1.5], ['r50', 790, 858, 23.8, 'broll', 1, 1], ['r50', 858, 931, 20.0, 'broll', 1, 1],
    ['r47', 931, 976, 24.3, 'broll', 1, 1], ['r47', 976, 1094, 19.6, 'broll', 1, 1],
    ['r47', 1094, 1150, 46.0, 'broll', 1, 1], ['r48', 1150, 1210, 31.0, 'broll', 1, 1],
    ['r47', 1210, 1270, 50.0, 'broll', 1, 1], ['r48', 1270, 1328, 29.0, 'broll', 1, 1],
    ['r48', 1328, 1400, 42.0, 'broll', 1, 1], ['r50', 1400, 1458, 5.5, 'broll', 1, 1], ['r48', 1458, 1516, 6.5, 'broll', 1, 1],
    ['r50', 1516, 1576, 7.9, 'broll', 1, 1], ['r48', 1576, 1634, 56.0, 'broll', 1, 1],
    ['cta', 1634, 1764, 0.95, 'cam', 1.0, 1.06],
]
assert CLIPS[-1][2] == TOTAL, TOTAL
LEAKS = [376, 931, 1328, 1634]
CORTES = [c[1] for c in CLIPS[1:] if c[1] not in LEAKS]
# ---- cara por frame (planos a cámara) ----
def track(name):
    rows = []
    for l in open(W + f'tr_{name}.txt'):
        p = l.split()
        if len(p) == 5: rows.append(list(map(float, p)))
    return rows
TR = {n: track(n) for n in ('hook', 'terraza', 'cta')}
def face(name, t):
    r = TR[name]; j = min(range(len(r)), key=lambda k: abs(r[k][0] - t))
    nb = [x for x in r if abs(x[0] - t) <= 0.25] or [r[j]]
    x0, x1, y0, y1 = (sum(x[k] for x in nb) / len(nb) for k in range(1, 5))
    return (x0 + x1) / 2, y0 + 0.42 * (y1 - y0), y1, y0
EYES, CHIN = {}, {}
for c in CLIPS:
    if c[4] != 'cam': continue
    for fr in range(c[1], c[2]):
        t = c[3] + (fr - c[1]) / FPS; ex, ey, cb, ct = face(c[0], t)
        s = c[5] + (c[6] - c[5]) * (fr - c[1]) / max(1, c[2] - c[1] - 1)
        EYES[str(fr)] = [round(ex, 1), round(ey, 1)]; CHIN[fr] = ey + (cb - ey) * s; CHIN[-fr - 1] = ey + (ct - ey) * s
# ---- eventos (frames en que entra cada título / SFX) ----
EV = {
    'townhouses': F('townhouses'), 'cuarto': F('cuarto'), 'desde': F('desde'), 'precio': F('$374,990.'), 'dato': F('dato'),
    'gastos1': F('gastos'), 'anios1': F('2 años'), 'en_salida': F('en'), 'turnpike': F('Turnpike,'), 'sur': F('sur', 380),
    'son': F('son'), 'niveles': F('3 niveles'), 'habit': F('4 habitaciones'), 'banos': F('3 baños'), 'sqft1': F('1,418'), 'sqft2': F('2,100'),
    'cuenta': F('cuenta'), 'puestos': F('2 puestos'), 'terraza': F('terraza'), 'listos': F('listos'), 'constructor': F('constructor'),
    'paquete': F('paquete'), 'vivir': F('vivir,'), 'tasa': F('tasa'), 'pct': F('4.99%'), 'va': F('VA'), 'gastos2': F('gastos', 1150),
    'asoc2': F('asociación', 1150), 'primeros': F('2 primeros'), 'zona': F('zona'), 'creciendo': F('creciendo.'), 'pocos': F('pocos'),
    'amazon': F('Amazon,'), 'fedex': F('FedEx,'), 'escuelas': F('escuelas'), 'extension': F('extensión'), 'smart': F('SMART'),
    'si': F('si'), 'escribeme': F('escríbeme'), 'coordinamos': F('coordinamos'),
}
# títulos: [a, b, componente]; mientras hay título no hay subtítulo
TIT = [
    [EV['townhouses'], 102, 'Hook'], [167, 241, 'Precio'], [EV['gastos1'], 376, 'Dato'], [376, 474, 'Ubicacion'],
    [EV['niveles'], 538, 'D_niveles'], [538, 573, 'D_habit'], [573, 606, 'D_banos'], [EV['sqft1'], 696, 'D_sqft1'], [696, 752, 'D_sqft2'],
    [EV['puestos'], EV['terraza'], 'D_puestos'], [EV['terraza'], 931, 'Terraza'], [931, 976, 'Listos'], [EV['paquete'], EV['vivir'] + 4, 'Paquete'],
    [1094, 1328, 'Placa'], [1328, 1400, 'Zona'], [1400, 1634, 'Cerca'], [EV['escribeme'], TOTAL, 'Cta'],
]
# ---- subtítulos ----
EST = {'independiente': 't', 'totalmente': 'b', 'clave': 's', 'dato': 'b', 'constructor': 'b', 'vivir,': 't', 'cuarto': 'b', 'abajo': 'b',
       'miami-dade': 'b', 'miami-dade,': 'b', 'vivienda': 'b', 'barbecues.': 'b', 'para': 'm'}
def clip_at(f):
    for c in CLIPS:
        if c[1] <= f < c[2]: return c
groups, cur = [], []
for w in wt:
    f = w['f']
    if cur and (len(cur) >= 3 or sum(len(x['w']) for x in cur) + len(w['w']) > 17 or cur[-1]['w'][-1] in ',.?' or clip_at(f + 1) is not clip_at(cur[0]['f'] + 1)):
        groups.append(cur); cur = []
    cur.append(w)
groups.append(cur)
subs = []
for gi, g in enumerate(groups):
    a = max(0, g[0]['f'] - 1); b = groups[gi + 1][0]['f'] - 1 if gi + 1 < len(groups) else TOTAL
    b = min(b, g[-1]['e'] + 10)
    for ta, tb, _ in TIT:
        if ta > a and ta < b: b = ta
    for ta, tb, _ in TIT:
        if ta <= a < tb and tb - a <= 3: a = tb
    if any(ta - 2 <= a < tb for ta, tb, _ in TIT) or b - a < 4: continue
    c = clip_at(a + 1); cam = c[4] == 'cam'
    y = round(min(1240, max(CHIN[f] for f in range(a, b) if f in CHIN) + 26)) if cam else 960
    out = []
    for x in g:
        st = EST.get(x['w'].lower(), 'm'); out.append([x['w'].upper() if st in 'bst' else x['w'], st])
    subs.append(dict(a=a, b=b, ws=out, y=y, cam=cam))
top = lambda a, b: round(min(CHIN[-f - 1] for f in range(a, b) if -f - 1 in CHIN))
chin = lambda a, b: round(max(CHIN[f] for f in range(a, b) if f in CHIN))
HEAD = {'hook': top(0, 102), 'dato': top(EV['gastos1'], 376), 'cta_chin': chin(EV['escribeme'], TOTAL), 'cta_top': top(EV['escribeme'], TOTAL)}
json.dump(dict(total=TOTAL, clips=CLIPS, eyes=EYES, ev=EV, tit=TIT, leaks=LEAKS, cortes=CORTES, head=HEAD, subs=subs), open(OUT + 'data.json', 'w'), ensure_ascii=False)
json.dump(wt, open(W + 'palabras_tl.json', 'w'), ensure_ascii=False)
for s in subs: print(s['a'], s['b'], s['y'], ' '.join(w for w, _ in s['ws']))
print(EV); print(HEAD)
