# Separa el logo de Site (fondo blanco) en piezas con alfa para animarlas en Remotion: baldosas del arco, letras, DESARROLLO.
#   ~/venvs/align/bin/python -I logo_piezas.py <logo.png> <carpeta_salida>
# Escribe pNN.png (RGBA, color pleno + alfa) y piezas.json (x, y, w, h, color) en coordenadas del PNG original.
# Caso real: REB 16-10 (loop), logo de Site Desarrollo 1280x1280 → 12 baldosas, s/i/t/e, acento de la i y 10 letras de DESARROLLO.
import sys, json, numpy as np, cv2
src, out = sys.argv[1], sys.argv[2]
im = cv2.imread(src)[:, :, ::-1].astype(np.float32)
# cada pieza = componente conexa que se separa del blanco; alfa = distancia al blanco / distancia del color pleno de la pieza
dist = (255 - im).max(2)
m = (dist > 8).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
piezas = []
for i in range(1, n):
    x, y, w, h, area = st[i]
    if area < 40: continue
    msk = lab[y:y + h, x:x + w] == i
    # dilatar 2 px para no perder el antialias
    msk = cv2.dilate(msk.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    crop = im[y:y + h, x:x + w]
    pleno = crop[(lab[y:y + h, x:x + w] == i) & (dist[y:y + h, x:x + w] > dist[y:y + h, x:x + w][lab[y:y + h, x:x + w] == i].max() * 0.9)].mean(0)
    alfa = np.clip((255 - crop).max(2) / max(1, (255 - pleno).max()), 0, 1) * msk
    rgba = np.dstack([np.broadcast_to(pleno, crop.shape), alfa * 255]).astype(np.uint8)
    name = f'p{len(piezas):02d}.png'
    cv2.imwrite(f'{out}/{name}', cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
    piezas.append({'f': name, 'x': int(x), 'y': int(y), 'w': int(w), 'h': int(h), 'c': [int(v) for v in pleno]})
json.dump(piezas, open(f'{out}/piezas.json', 'w'))
for p in piezas: print(p)
