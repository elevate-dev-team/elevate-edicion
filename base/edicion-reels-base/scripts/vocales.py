"""Detecta voz cantada en un tema de música antes de usarlo (la música va siempre instrumental, regla 3.1).

  <python del entorno align> vocales.py <tema> [desde_s=0] [dur_s=80]

Separa el tema con Hybrid Demucs (torchaudio HDEMUCS_HIGH_MUSDB_PLUS: drums / bass / other / vocals; el modelo, ~320 MB,
se baja solo la primera vez a ~/.cache/torch) y mide la pista "vocals" contra la mezcla en ventanas de 0,5 s.
Salida: mediana, p90 y % de ventanas > −12 dB, más la serie (1 valor por segundo) para ver dónde entra la voz.
- Instrumental: mediana ≈ −50 dB, nada arriba de ~−30 dB.
- Con voz: ventanas en −4/−12 dB donde canta.
Caso real: DC 04-10 (2026-10-27). *Keep the Funk ON* (Mixkit) canta desde ~11 s (−18 mediana, 38 % > −12 dB) → el usuario
lo rechazó por la voz; *Funkee Monkeee* (Mixkit) −50 dB → aprobado. Whisper no lo detectó ("guitar solo").
Corre en CPU (~1 min por 80 s de tema). Usar de a UN proceso.
"""
import sys, subprocess, numpy as np, torch
from torchaudio.pipelines import HDEMUCS_HIGH_MUSDB_PLUS as B

p = sys.argv[1]; ss = float(sys.argv[2]) if len(sys.argv) > 2 else 0; dur = float(sys.argv[3]) if len(sys.argv) > 3 else 80
sr = B.sample_rate
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(ss), '-t', str(dur), '-i', p, '-ac', '2', '-ar', str(sr), '-f', 'f32le', '-'],
                                 capture_output=True).stdout, np.float32).reshape(-1, 2).T.copy()
m = B.get_model().eval(); torch.set_num_threads(6)
wav = torch.from_numpy(x)[None]; ref = wav.mean(1, keepdim=True); mu, sd = ref.mean(), ref.std(); wav = (wav - mu) / sd
seg = sr * 10; outs = []
with torch.inference_mode():
    for i in range(0, wav.shape[-1], seg):
        outs.append(m(wav[..., i:i + seg])[0])
st = torch.cat(outs, -1) * sd + mu  # fuentes: drums, bass, other, vocals
voc = st[3].numpy(); mix = x[:, :voc.shape[1]]
w = sr // 2
rms = lambda a: np.array([np.sqrt((a[:, i:i + w] ** 2).mean() + 1e-12) for i in range(0, a.shape[1] - w, w)])
rel = 20 * np.log10(rms(voc) / rms(mix))
print(f'{p.split("/")[-1]}: voz vs mezcla mediana {np.median(rel):.1f} dB, p90 {np.percentile(rel, 90):.1f} dB, % ventanas > -12 dB: {100 * (rel > -12).mean():.0f}%')
print(' '.join(f'{v:.0f}' for v in rel[::2]))
