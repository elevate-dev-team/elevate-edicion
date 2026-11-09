"""Mapa real de barrios de Montevideo para Remotion (caso REB 08-10, aprobado 2026-11-04: "el mapa quedó espectacular").

  python3 -I mapa_barrios.py <ine_barrios_mvd_nbi85.shp> <.dbf> <av18.json> <salida mapa.json>

Fuentes:
- Límites oficiales de los 62 barrios de Montevideo del INE (mapas vectoriales 2011, `ine_barrios_mvd_nbi85`,
  UTM 21S en metros): https://www.gub.uy/instituto-nacional-estadistica/datos-y-estadisticas/estadisticas/mapas-vectoriales-ano-2011
  La costa sale del borde de los barrios (fuera de ellos es el río).
- Av. 18 de Julio (OpenStreetMap, Overpass) para separar "Cordón Sur" (no es barrio oficial: la parte de Cordón al sur de 18).
Salida: paths SVG en coordenadas de pantalla 1080×1920 (escala uniforme, norte arriba).
"""
import json, math, struct, sys

shp, dbf, av18, OUT = sys.argv[1:5]


def utm21s(lat, lon):  # WGS84 → UTM zona 21 sur
    a, f = 6378137.0, 1 / 298.257223563; k0 = 0.9996; e2 = f * (2 - f); ep2 = e2 / (1 - e2)
    lon0 = math.radians(-57); la, lo = math.radians(lat), math.radians(lon)
    N = a / math.sqrt(1 - e2 * math.sin(la) ** 2); T = math.tan(la) ** 2; C = ep2 * math.cos(la) ** 2; A = math.cos(la) * (lo - lon0)
    M = a * ((1 - e2 / 4 - 3 * e2 ** 2 / 64 - 5 * e2 ** 3 / 256) * la - (3 * e2 / 8 + 3 * e2 ** 2 / 32 + 45 * e2 ** 3 / 1024) * math.sin(2 * la)
             + (15 * e2 ** 2 / 256 + 45 * e2 ** 3 / 1024) * math.sin(4 * la) - (35 * e2 ** 3 / 3072) * math.sin(6 * la))
    x = k0 * N * (A + (1 - T + C) * A ** 3 / 6 + (5 - 18 * T + T * T + 72 * C - 58 * ep2) * A ** 5 / 120) + 500000
    y = k0 * (M + N * math.tan(la) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A ** 4 / 24 + (61 - 58 * T + T * T + 600 * C - 330 * ep2) * A ** 6 / 720)) + 10000000
    return x, y


# --- dbf (nombres) y shp (polígonos)
d = open(dbf, 'rb').read()
n, hl, rl = struct.unpack('<xxxxIHH', d[:12]); campos = []; i = 32
while d[i] != 0x0D:
    campos.append((d[i:i + 11].split(b'\0')[0].decode(), d[i + 16])); i += 32
nombres = []
for r in range(n):
    p = hl + r * rl + 1; reg = {}
    for nm, l in campos: reg[nm] = d[p:p + l].decode('latin1').strip(); p += l
    nombres.append(reg['NOMBBARR'])
s = open(shp, 'rb').read(); pos = 100; polys = []
while pos < len(s):
    _, clen = struct.unpack('>ii', s[pos:pos + 8]); rec = s[pos + 8:pos + 8 + clen * 2]; pos += 8 + clen * 2
    nparts, npts = struct.unpack('<ii', rec[36:44]); parts = list(struct.unpack(f'<{nparts}i', rec[44:44 + 4 * nparts]))
    pts = struct.unpack(f'<{2 * npts}d', rec[44 + 4 * nparts:44 + 4 * nparts + 16 * npts])
    pts = list(zip(pts[::2], pts[1::2])); parts.append(npts)
    polys.append([pts[parts[k]:parts[k + 1]] for k in range(nparts)])
B = dict(zip(nombres, polys))

CLAVE = {'Cordon': 'Cordón', 'Buceo': 'Buceo', 'La Blanqueada': 'La Blanqueada', 'Parque Rodo': 'Parque Rodó'}
# encuadre: los 4 barrios clave entran en x 120–860 (zona segura 70–900) con escala uniforme
xs = [x for k in CLAVE for ring in B[k] for x, _ in ring]; ys = [y for k in CLAVE for ring in B[k] for _, y in ring]
X0, X1, Y0, Y1 = min(xs), max(xs), min(ys), max(ys)
ESC = 700 / (X1 - X0)
CX, CY, SCY = (X0 + X1) / 2, (Y0 + Y1) / 2, 1010
tr = lambda x, y: (530 + (x - CX) * ESC, SCY - (y - CY) * ESC)


def path(rings):
    out = []
    for ring in rings:
        q = [tr(x, y) for x, y in ring]
        out.append('M' + ' L'.join(f'{a:.1f},{b:.1f}' for a, b in q) + ' Z')
    return ' '.join(out)


def bbox_scr(rings):
    q = [tr(x, y) for ring in rings for x, y in ring]
    return min(a for a, _ in q), min(b for _, b in q), max(a for a, _ in q), max(b for _, b in q)


def centro(rings):  # centroide del anillo principal
    ring = max(rings, key=len); A = cx = cy = 0
    for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
        c = x1 * y2 - x2 * y1; A += c; cx += (x1 + x2) * c; cy += (y1 + y2) * c
    return tr(cx / (3 * A), cy / (3 * A))


# contexto: todos los barrios que caen (aunque sea en parte) en el cuadro
contexto = []
for k, rings in B.items():
    a, b, c, e = bbox_scr(rings)
    if c > -150 and a < 1230 and e > -150 and b < 2070:
        contexto.append({'n': k, 'd': path(rings)})
# 18 de Julio en pantalla + semiplano sur (para recortar Cordón en Cordón / Cordón Sur)
g = json.load(open(av18))
pts = sorted({(p['lon'], p['lat']) for e in g['elements'] for p in e['geometry']})
av = [tr(*utm21s(lat, lon)) for lon, lat in pts]
ext = [(av[0][0] - 400, av[0][1]), *av, (av[-1][0] + 400, av[-1][1])]
sur = 'M' + ' L'.join(f'{a:.1f},{b:.1f}' for a, b in ext) + f' L{ext[-1][0]:.1f},2400 L{ext[0][0]:.1f},2400 Z'
norte = 'M' + ' L'.join(f'{a:.1f},{b:.1f}' for a, b in ext) + f' L{ext[-1][0]:.1f},-600 L{ext[0][0]:.1f},-600 Z'
clave = {CLAVE[k]: {'d': path(B[k]), 'c': [round(v, 1) for v in centro(B[k])], 'bb': [round(v) for v in bbox_scr(B[k])]} for k in CLAVE}
json.dump({'contexto': contexto, 'clave': clave, 'av18': 'M' + ' L'.join(f'{a:.1f},{b:.1f}' for a, b in av), 'sur': sur, 'norte': norte,
           'escala_px_km': round(ESC * 1000, 1)}, open(OUT, 'w'))
print('px por km', round(ESC * 1000, 1), 'barrios de contexto', len(contexto))
for k, v in clave.items(): print(k, v['c'], v['bb'])
print('18 de Julio', [tuple(round(x) for x in p) for p in av[::20]])
