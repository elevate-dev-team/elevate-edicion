"""Busca una familia de Adobe Fonts activada en Creative Cloud y (opcional) copia sus pesos a una carpeta.

  <python con fonttools> fuentes_adobe.py "<familia>" [destino] [estilo,estilo,...]

- Sin destino: lista los archivos de esa familia (estilo, peso CSS y archivo oculto).
- Con destino: copia cada estilo como <PostScriptName>.otf (ej. AcuminPro-Black.otf). Con la lista de estilos
  ("Medium,Black,Ultra Black") copia solo esos; sin lista, todos los que no son itálica.
Creative Cloud guarda las fuentes activadas con nombres ocultos (.26060.otf) en
  Mac:     ~/Library/Application Support/Adobe/CoreSync/plugins/livetype/.r/
  Windows: %APPDATA%\\Adobe\\CoreSync\\plugins\\livetype\\r\\
No subir los archivos copiados al repo (licencia de Adobe Fonts): van al proyecto de Remotion del editor.
Necesita fonttools (pip install fonttools; en Mac sirve el venv de alinear.py: ~/venvs/align/bin/pip install fonttools).
Caso real: AAL 02-10 (2026-10-26), Acumin Pro Medium / Black / Ultra Black para Remotion; el kit web no actualizaba.
"""
import os, shutil, sys
from fontTools.ttLib import TTFont

fam = sys.argv[1].lower()
dest = sys.argv[2] if len(sys.argv) > 2 else None
want = [w.strip().lower() for w in sys.argv[3].split(',')] if len(sys.argv) > 3 else None

if sys.platform == 'win32':
    root = os.path.join(os.environ.get('APPDATA', ''), 'Adobe', 'CoreSync', 'plugins', 'livetype', 'r')
else:
    root = os.path.expanduser('~/Library/Application Support/Adobe/CoreSync/plugins/livetype/.r')
if not os.path.isdir(root):
    sys.exit(f'No existe {root}: Creative Cloud no está instalado o no sincroniza fuentes en esta máquina.')

found = []
for f in sorted(os.listdir(root)):
    try:
        t = TTFont(os.path.join(root, f), lazy=True, fontNumber=0)
    except Exception:
        continue
    n = t['name']
    family = n.getDebugName(16) or n.getDebugName(1) or ''
    if family.lower() != fam:
        continue
    found.append((n.getDebugName(17) or n.getDebugName(2) or '', t['OS/2'].usWeightClass, n.getDebugName(6) or f, f))

if not found:
    sys.exit(f'"{sys.argv[1]}" no está activada en Creative Cloud (activarla en fonts.adobe.com y esperar la sincronización).')
for style, weight, ps, f in sorted(found, key=lambda x: (x[1], x[0])):
    print(f'{style:22s} peso {weight:4d}  {ps:32s} {f}')
    if dest and ((want and style.lower() in want) or (not want and 'italic' not in style.lower())):
        os.makedirs(dest, exist_ok=True)
        ext = os.path.splitext(f)[1] or '.otf'
        shutil.copy(os.path.join(root, f), os.path.join(dest, ps + ext))
        print(f'  -> {os.path.join(dest, ps + ext)}')
