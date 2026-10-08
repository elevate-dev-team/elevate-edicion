#!/usr/bin/env python3
"""Chequea la máquina de un editor de Elevate: herramientas, skills instaladas y rutas de config.json.

Uso:  python3 verificar_entorno.py            (Mac)
      py verificar_entorno.py                 (Windows)
Imprime un informe y un JSON final con lo que falta. No instala ni modifica nada.
"""
import json, os, platform, shutil, subprocess, sys
from pathlib import Path

HOME = Path.home()
SKILLS = HOME / '.claude' / 'skills'
CONFIG = HOME / '.claude' / 'elevate' / 'config.json'
WIN = platform.system() == 'Windows'
VENV_PY = HOME / 'venvs' / 'align' / ('Scripts/python.exe' if WIN else 'bin/python')
WHISPER_MODEL = HOME / '.cache' / 'whisper' / 'ggml-large-v3-turbo.bin'

faltan = []

def ok(cond, nombre, detalle='', obligatorio=True):
    marca = 'OK ' if cond else ('FALTA' if obligatorio else 'opcional, no está')
    print(f'  [{marca}] {nombre}' + (f' — {detalle}' if detalle else ''))
    if not cond:
        faltan.append({'item': nombre, 'obligatorio': obligatorio, 'detalle': detalle})

def version(cmd):
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
        return (out.stdout or out.stderr).strip().splitlines()[0]
    except Exception:
        return ''

print(f'Sistema: {platform.system()} {platform.release()} · Python {sys.version.split()[0]}')

print('\nHerramientas')
for b, oblig, para in [('ffmpeg', True, 'cortes, mezcla y render'),
                       ('ffprobe', True, 'medir videos y audio'),
                       ('git', True, 'traer y compartir skills'),
                       ('node', True, 'Remotion (títulos y motion)'),
                       ('npx', True, 'Remotion'),
                       ('whisper-cli', True, 'transcripción')]:
    p = shutil.which(b)
    ok(bool(p), b, version([b, '-version' if b.startswith('ff') else '--version']) if p else para, oblig)
if not WIN:
    ok(bool(shutil.which('swift')), 'swift', 'detección de cara de Apple Vision (solo Mac)', False)
ok(WHISPER_MODEL.exists(), 'modelo de Whisper', str(WHISPER_MODEL))
ok(VENV_PY.exists(), 'entorno ~/venvs/align', 'alineación de subtítulos (torch, torchaudio, numpy)')

print('\nLibrerías de Python')
py = str(VENV_PY) if VENV_PY.exists() else sys.executable
for mod, pip in [('numpy', 'numpy'), ('PIL', 'pillow'), ('cv2', 'opencv-python'), ('torchaudio', 'torchaudio')]:
    r = subprocess.run([py, '-c', f'import {mod}'], capture_output=True)
    ok(r.returncode == 0, pip, f'en {py}')

print('\nSkills instaladas')
base = ['edicion-reels-base', 'portadas-reels', 'configuracion-inicial', 'crear-skill-cliente']
for s in base:
    ok((SKILLS / s / 'SKILL.md').exists(), s)
clientes = sorted(p.name for p in SKILLS.glob('*-brand') if (p / 'SKILL.md').exists())
print(f'  clientes: {", ".join(clientes) or "ninguno"}')

print('\nConfiguración')
if not CONFIG.exists():
    ok(False, 'config.json', str(CONFIG))
else:
    cfg = json.loads(CONFIG.read_text(encoding='utf-8'))
    for k, v in (cfg.get('rutas') or {}).items():
        if v is None:
            print(f'  [no tiene] {k}')
        else:
            ok(Path(v).exists(), k, v, obligatorio=(k == 'CLIENTES'))
    for skill, datos in (cfg.get('clientes') or {}).items():
        c = datos.get('carpeta')
        ok(bool(c) and Path(c).exists(), f'carpeta de {skill}', c or 'sin asignar')
        ok((SKILLS / skill / 'SKILL.md').exists(), f'skill {skill} instalada')

print('\nRESUMEN_JSON ' + json.dumps({'faltan': faltan}, ensure_ascii=False))
