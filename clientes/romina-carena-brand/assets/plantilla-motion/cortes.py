"""Cortes v2 (corrección de Tomi: "demasiados silencios"): cada silencio real ≥ 0,18 s se corta dejando 0,03 s de cola
y 0,03 s antes de la próxima palabra; entrada de toma 0,03 s antes de la voz y salida 0,04 s después."""
import json, os
S = os.path.dirname(os.path.abspath(__file__))
ORDEN = ['DF36FB08', 'E776D6F3', 'B1455E43', '19970974', 'D06A3A5E', 'C9150D14']
sj = json.load(open(f'{S}/silencios.json'))
INICIO = {'DF36FB08': 1.31, 'C9150D14': 0.44}   # lo de antes es ruido de manos / celular (medido)
MIN = 0.18; COLA = 0.03; PRE = 0.03
cortes = []
for n in ORDEN:
    d = sj[n]; s0 = INICIO.get(n, d['start']) - PRE
    for a, b in d['sil']:
        if b - a < MIN or a < s0 + 0.1: continue
        cortes.append([n, round(s0, 3), round(a + COLA, 3)]); s0 = b - PRE
    cortes.append([n, round(s0, 3), round(d['end'] + 0.04, 3)])
json.dump(cortes, open(f'{S}/cortes.json', 'w'), indent=0)
tot = sum(e - s for _, s, e in cortes); print(len(cortes), 'tramos', round(tot, 2), 's')
for c in cortes: print(c)
