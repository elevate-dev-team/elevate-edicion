# sheet.py <video> <salida.png> t1 t2 ... → hoja de contacto (frames a 270 px de ancho)
import sys, subprocess
from PIL import Image
v, out, ts = sys.argv[1], sys.argv[2], sys.argv[3:]
ims = []
for t in ts:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', t, '-i', v, '-frames:v', '1', '-vf', 'scale=270:480', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    ims.append(Image.frombytes('RGB', (270, 480), raw))
sh = Image.new('RGB', (272 * len(ims), 480), 'black')
for i, im in enumerate(ims): sh.paste(im, (i * 272, 0))
sh.save(out)
