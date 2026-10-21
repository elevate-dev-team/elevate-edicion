# fuentes_adobe.py → imprime la ruta local de cada peso de Gibson y Amandine activado en Adobe Fonts.
# Uso: python fuentes_adobe.py            (lista todo)
#      python fuentes_adobe.py "Gibson Heavy"   (imprime solo esa ruta, para usar en otros scripts)
# Las fuentes son de Adobe Fonts: se usan desde acá, no se copian al repo. Requiere fontTools.
import os, sys, platform
from fontTools.ttLib import TTFont

FAMILIAS = ('Gibson', 'Amandine')

def carpeta_livetype():
    if platform.system() == 'Windows':
        return os.path.join(os.environ.get('APPDATA', ''), 'Adobe', 'CoreSync', 'plugins', 'livetype')
    return os.path.expanduser('~/Library/Application Support/Adobe/CoreSync/plugins/livetype')

def fuentes():
    out = {}
    # Adobe guarda las fuentes como archivos ocultos (.w/.43313.otf): glob no los ve, os.walk sí
    archivos = [os.path.join(r, n) for r, _, ns in os.walk(carpeta_livetype()) for n in ns if n.lower().endswith(('.otf', '.ttf'))]
    for f in archivos:
        try:
            n = TTFont(f, lazy=True)['name'].getDebugName(4)
        except Exception:
            continue
        if n and n.startswith(FAMILIAS):
            out[n] = f
    return out

if __name__ == '__main__':
    fs = fuentes()
    if not fs:
        sys.exit('No hay Gibson/Amandine activadas: activarlas en Creative Cloud → Fuentes.')
    if len(sys.argv) > 1:
        print(fs.get(sys.argv[1]) or sys.exit(f'No está activado: {sys.argv[1]}'))
    else:
        for n in sorted(fs):
            print(f'{n}\t{fs[n]}')
