# the_seasons.py [peso] → imprime la ruta del .otf de The Seasons sincronizado por Adobe Fonts (CoreSync)
# Pesos: Bold (default), Regular, Light, BoldItalic, RegularItalic, LightItalic.
# Uso en PIL: ImageFont.truetype(subprocess.check_output(['python3', '.../the_seasons.py']).decode().strip(), 80)
# Si no imprime nada: activar "The Seasons" en fonts.adobe.com con Creative Cloud abierto.
import sys, os, glob
peso = sys.argv[1] if len(sys.argv) > 1 else 'Bold'
objetivo = ('TheSeasons-' + peso).encode()
bases = [os.path.expanduser('~/Library/Application Support/Adobe/CoreSync/plugins/livetype/.r'),
         os.path.expandvars(r'%APPDATA%\Adobe\CoreSync\plugins\livetype\r')]
for base in bases:
    for f in glob.glob(os.path.join(base, '.*.otf')) + glob.glob(os.path.join(base, '*.otf')):
        datos = open(f, 'rb').read()
        # el nombre PostScript aparece en ASCII o en UTF-16BE dentro de la tabla 'name'
        for n in (objetivo, objetivo.decode().encode('utf-16-be')):
            i = datos.find(n)
            if i >= 0 and not datos[i + len(n):i + len(n) + 2].strip(b'\x00').startswith(b'I'):
                print(f); sys.exit(0)
sys.exit(1)
