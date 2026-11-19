# portada_base_relleno.py <frame.png> <bajada_px> <salida.jpg> — BGR 16-11 (2026-11-19)
# Baja al sujeto N px para dejar lugar al texto de la portada arriba de la cabeza y rellena el hueco con las filas de arriba del
# mismo cuadro (pared/fondo), fundiendo 80 px. Con una franja estirada y desenfocada se veía la unión. Sirve con fondos de textura pareja.
# base 9:16 bajada D px; el hueco de arriba se rellena con la misma pared (filas 0..D del cuadro) y se funde la unión
import sys, numpy as np
from PIL import Image
src, D, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
im = np.asarray(Image.open(src).convert('RGB'), np.float32); H, W, _ = im.shape
F = 80
top = im[0:D + F]                      # pared original
low = im[0:H - D]                      # cuadro bajado
can = np.zeros_like(im); can[D:] = low; can[:D] = top[:D]
a = np.linspace(1, 0, F)[:, None, None]
can[D:D + F] = top[D:D + F] * a + low[0:F] * (1 - a)
Image.fromarray(can.astype(np.uint8)).save(out, quality=95)
