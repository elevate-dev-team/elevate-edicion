# fuentes.py — Enlaza Articulat CF desde la caché de Adobe Fonts para renderizar con PIL / Remotion.
# Articulat CF es de Adobe Fonts: su licencia no permite subir los .otf al repo. Cada editor la activa en
# Creative Cloud (fonts.adobe.com/fonts/articulat-cf, "Activar familia") y este script la busca en la caché
# oculta de Adobe y la deja con nombres legibles en ~/.claude/elevate/fonts/articulat-cf/ (solo en su máquina).
#
#   python scripts/fuentes.py            -> enlaza/copia y lista lo encontrado
#   from fuentes import ruta; ruta('Heavy')  -> ruta al .otf (ej. 'Light', 'LightOblique', 'BoldOblique', 'Heavy')
#
# Solo usa la biblioteca estándar (lee la tabla 'name' del .otf). Mac y Windows.
import os, sys, struct, shutil

FAMILIA = 'ArticulatCF'
DESTINO = os.path.expanduser('~/.claude/elevate/fonts/articulat-cf')
CACHES = [
    os.path.expanduser('~/Library/Application Support/Adobe/CoreSync/plugins/livetype'),  # Mac
    os.path.join(os.environ.get('APPDATA', ''), 'Adobe', 'CoreSync', 'plugins', 'livetype'),  # Windows
]


def postscript(path):
    """Nombre PostScript (nameID 6) de un .otf/.ttf, o None."""
    try:
        with open(path, 'rb') as f:
            d = f.read()
        n = struct.unpack('>H', d[4:6])[0]
        for i in range(n):
            tag, _, off, _ = struct.unpack('>4sIII', d[12 + 16 * i:28 + 16 * i])
            if tag != b'name':
                continue
            _, count, sto = struct.unpack('>HHH', d[off:off + 6])
            for j in range(count):
                pid, eid, lid, nid, ln, o = struct.unpack('>6H', d[off + 6 + 12 * j:off + 18 + 12 * j])
                if nid == 6:
                    s = d[off + sto + o:off + sto + o + ln]
                    return s.decode('utf-16-be' if pid in (0, 3) else 'latin-1', 'ignore')
    except Exception:
        return None


def enlazar():
    os.makedirs(DESTINO, exist_ok=True)
    hallados = {}
    for c in CACHES:
        if not c or not os.path.isdir(c):
            continue
        # las carpetas y archivos de la caché son ocultos (.w/.40093.otf): glob no los ve, os.walk sí
        for raiz, _, archivos in os.walk(c):
            for a in archivos:
                p = os.path.join(raiz, a)
                ps = postscript(p) if a.lower().endswith('.otf') else None
                if ps and ps.startswith(FAMILIA + '-'):
                    hallados[ps] = p
    for ps, p in hallados.items():
        dst = os.path.join(DESTINO, ps + '.otf')
        if os.path.lexists(dst):
            os.remove(dst)
        try:
            os.symlink(p, dst)
        except OSError:  # Windows sin permiso de symlink
            shutil.copy2(p, dst)
    return sorted(hallados)


def ruta(estilo):
    p = os.path.join(DESTINO, f'{FAMILIA}-{estilo}.otf')
    if not os.path.exists(p):
        enlazar()
    if not os.path.exists(p):
        sys.exit(f'Falta {FAMILIA}-{estilo}: activar Articulat CF en Adobe Fonts (Creative Cloud) y volver a correr.')
    return p


if __name__ == '__main__':
    h = enlazar()
    print(f'{len(h)} estilos en {DESTINO}:', ', '.join(x.split('-', 1)[1] for x in h) or
          'NINGUNO: activar Articulat CF en fonts.adobe.com/fonts/articulat-cf')
