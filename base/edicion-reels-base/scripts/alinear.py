"""Alineación forzada de subtítulos: texto conocido → inicio/fin de cada palabra en la voz final.

  ~/venvs/align/bin/python alinear.py <voz16k.wav> <tramos.json> <salida.json>

- voz16k.wav: voz FINAL del video (ya montada), mono 16 kHz (ffmpeg -i voz.wav -ac 1 -ar 16000 voz16k.wav).
- tramos.json: [[inicio_s, fin_s, ["texto exacto", "variante opcional", ...]], ...] en tiempo del video.
  Alinear por tramos (cada toma/respuesta) evita que un error se arrastre. Con varias variantes de texto
  (ej. "un abrazo y felicitaciones" / "un abrazo y un abrazo y felicitaciones") se queda con la de mejor puntaje.
- salida.json: [{"w": palabra, "s": inicio, "e": fin, "score": 0–1}, ...]
Puntaje por tramo < 0,5 = poco confiable (ruido fuerte, idioma mezclado, texto que no coincide): cruzar con onsets.py.

Instalación (una vez, entorno aislado): python3 -m venv ~/venvs/align && ~/venvs/align/bin/pip install torch torchaudio numpy
El modelo MMS_FA (~1,2 GB) se baja solo la primera vez a ~/.cache/torch. Corre en CPU; usar de a UN proceso.
"""
import json, re, sys, unicodedata, wave
import numpy as np, torch
from torchaudio.pipelines import MMS_FA as bundle

wav_path, tramos_path, out_path = sys.argv[1:4]
torch.set_num_threads(4)

def norm(w):
    w = unicodedata.normalize('NFD', w.lower()); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return re.sub(r"[^a-z']", '', w)

wv = wave.open(wav_path); sr = wv.getframerate()
assert sr == bundle.sample_rate and wv.getnchannels() == 1, 'pasar la voz a mono 16 kHz'
audio = np.frombuffer(wv.readframes(wv.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
model = bundle.get_model(with_star=False).eval(); dic = bundle.get_dict(star=None); aligner = bundle.get_aligner()

out = []
for a, b, textos in json.load(open(tramos_path)):
    seg = torch.from_numpy(audio[int(a * sr):int(b * sr)]).unsqueeze(0)
    with torch.inference_mode():
        em, _ = model(seg)
    ratio = seg.shape[1] / em.shape[1] / sr
    best = None
    for texto in textos:
        words = [w for w in texto.split() if norm(w)]
        with torch.inference_mode():
            spans = aligner(em[0], [[dic[c] for c in norm(w)] for w in words])
        score = float(np.mean([np.mean([s.score for s in sp]) for sp in spans]))
        if best is None or score > best[0]: best = (score, texto, words, spans)
    score, texto, words, spans = best
    for w, sp in zip(words, spans):
        out.append({'w': w, 's': round(a + sp[0].start * ratio, 3), 'e': round(a + sp[-1].end * ratio, 3),
                    'score': round(float(np.mean([s.score for s in sp])), 3)})
    print(f'[{a:6.2f}-{b:6.2f}] puntaje {score:.2f} · {texto}', flush=True)
json.dump(out, open(out_path, 'w'), ensure_ascii=False, indent=0)
