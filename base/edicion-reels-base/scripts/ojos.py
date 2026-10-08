"""Posición de los ojos del speaker en momentos puntuales del video (Windows y Mac). Equivale a eyes.swift.

  python ojos.py <video> <t1,t2,...>
  → por línea: t ojoX ojoY WxH  (px del video ya rotado, origen arriba-izquierda, promedio de los dos ojos)
     o "t sin cara". Con varias caras, toma la más grande.

Usa el detector de caras YuNet de OpenCV (5 puntos: ojos, nariz, comisuras). Los cuadros los saca ffmpeg,
así respeta la rotación del celular. Requiere: ffmpeg en el PATH y `pip install opencv-python numpy`
(sirve el mismo entorno de alinear.py). El modelo (~230 KB) se baja solo la primera vez, del repo oficial
de OpenCV, a la carpeta models/ junto a este script.
"""
import os, subprocess, sys, urllib.request
os.environ.setdefault('OPENCV_LOG_LEVEL', 'ERROR')
import cv2, numpy as np

MODELO = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'face_detection_yunet_2023mar.onnx')
URL = 'https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx'

video, ts = sys.argv[1], [float(t) for t in sys.argv[2].split(',')]
if not os.path.exists(MODELO):
    os.makedirs(os.path.dirname(MODELO), exist_ok=True)
    urllib.request.urlretrieve(URL, MODELO)

det = None
for t in ts:
    png = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t), '-i', video, '-frames:v', '1',
                          '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
    img = cv2.imdecode(np.frombuffer(png, np.uint8), cv2.IMREAD_COLOR) if png else None
    if img is None:
        print(f'{t:.3f} sin cuadro'); continue
    H, W = img.shape[:2]
    if det is None:
        det = cv2.FaceDetectorYN.create(MODELO, '', (W, H), 0.7)
    det.setInputSize((W, H))
    _, caras = det.detect(img)
    if caras is None or len(caras) == 0:
        print(f'{t:.3f} sin cara'); continue
    f = max(caras, key=lambda c: c[2] * c[3])
    x, y = (f[4] + f[6]) / 2, (f[5] + f[7]) / 2
    print(f'{t:.3f} {x:.1f} {y:.1f} {W}x{H}')
