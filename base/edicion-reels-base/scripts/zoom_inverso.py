"""Compensa un zoom del celular dentro de la toma (el que filma pellizca la pantalla o cambia de lente a mitad de frase).
Mide el ancho de la cara por frame (salida de track_cara.swift o cara_selfie.swift a los fps del proyecto) y devuelve,
por frame del plano, la escala k = ancho_referencia / ancho_actual para aplicar ALREDEDOR DEL CENTRO DEL CUADRO
(540, 960): un zoom óptico/digital del celular escala respecto del centro, así que el inverso también.

  <python del entorno align> zoom_inverso.py <cara.txt> <ref_desde> <ref_hasta> <src_in> <frames> <fps> <salida.ts> [NOMBRE]
    cara.txt        : track_cara.swift <proxy> <t0> <t1> <fps>  (columnas: t cx top bottom ancho ojoX ojoY)
    ref_desde/hasta : tramo de la fuente con el encuadre que se quiere mantener (antes del zoom)
    src_in, frames  : entrada del plano en la fuente (s) y cantidad de frames del plano
    salida.ts       : export const NOMBRE = [k0, k1, ...];  → en Remotion: transform scale(k), transformOrigin '540px 960px'

Caso real: DAE 10-10 (2026-11-04, aprobado). Las tres tomas del CTA tenían un zoom-out a mitad (IMG_2441: la cara pasaba
de 282 a 156 px entre 2,75 y 3,3 s). Con k hasta 1,78× sobre el clip 4K (pasado a 30 fps, sin reescalar) el encuadre
quedó fijo y nítido. Antes del zoom k = 1; mediana 5 + media 7 frames para que no tiemble.
"""
import json, sys
import numpy as np
cara, r0, r1, src_in, n, fps, out = sys.argv[1:8]
nombre = sys.argv[8] if len(sys.argv) > 8 else 'K'
r0, r1, src_in, n, fps = float(r0), float(r1), float(src_in), int(n), float(fps)
d = np.array([[float(v) for v in l.split()] for l in open(cara) if 'nan' not in l])
t, w = d[:, 0], d[:, 4]
wm = np.array([np.median(w[max(0, i - 2):i + 3]) for i in range(len(w))])
w0 = np.median(wm[(t >= r0) & (t <= r1)])
k = np.where(t <= r1, 1.0, np.maximum(1.0, w0 / wm))
k = np.convolve(np.pad(k, 3, mode='edge'), np.ones(7) / 7, 'valid')
K = np.interp(src_in + np.arange(n) / fps, t, k)
open(out, 'w').write(f'export const {nombre} = ' + json.dumps([round(float(x), 4) for x in K]) + ';\n')
print(f'ancho de referencia {w0:.1f} px · k máx {K.max():.3f} → {out}')
