# Caso real: AR 08-10 (2026-11-10). Uso: ver SKILL.md sección 12.
# base 9:16 corrida hacia abajo para dejar lugar al texto ARRIBA de la cabeza (guía de portadas AR)
import sys
from PIL import Image, ImageFilter
src, D, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
im = Image.open(src).convert('RGB'); W, H = im.size
can = Image.new('RGB', (W, H))
strip = im.crop((0, 0, W, 60)).resize((W, D + 60)).filter(ImageFilter.GaussianBlur(25))
can.paste(strip, (0, 0)); can.paste(im.crop((0, 0, W, H - D)), (0, D))
can.save(out, quality=95)
