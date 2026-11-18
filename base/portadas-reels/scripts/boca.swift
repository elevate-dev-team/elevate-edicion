// Caso real: PCO 05-11 (2026-11-18). Tomi pidió portadas con 2 frames de la clienta sonriendo o con la boca cerrada: medir la
// apertura cada 0,1 s en las tomas (y en los finales de toma, antes de hablar / después de la última palabra) y ordenar de menor a mayor.
// Uso: swiftc -O boca.swift -o boca && ./boca <video> <t0> <t1> <paso>  (apertura < ~0,02 = boca cerrada; revisar en una hoja de contacto).
// boca.swift <video> <t0> <t1> <paso> -> t apertura_boca(innerLips alto / alto cara) ancho_boca/ancho_cara ojos_abiertos
import AVFoundation
import Vision
let a = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let t0 = Double(a[2])!, t1 = Double(a[3])!, st = Double(a[4])!
let gen = AVAssetImageGenerator(asset: asset); gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero; gen.requestedTimeToleranceAfter = .zero
var t = t0
func span(_ r: VNFaceLandmarkRegion2D?) -> (Double, Double) {
  guard let p = r?.normalizedPoints, !p.isEmpty else { return (0, 0) }
  let xs = p.map { Double($0.x) }, ys = p.map { Double($0.y) }
  return (xs.max()! - xs.min()!, ys.max()! - ys.min()!)
}
while t <= t1 {
  defer { t += st }
  guard let img = try? gen.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil) else { continue }
  let req = VNDetectFaceLandmarksRequest()
  try? VNImageRequestHandler(cgImage: img, options: [:]).perform([req])
  guard let f = (req.results ?? []).max(by: { $0.boundingBox.width < $1.boundingBox.width }), let lm = f.landmarks else { print(String(format: "%.2f nan", t)); continue }
  let (_, ih) = span(lm.innerLips), (ow, _) = span(lm.outerLips)
  let (_, le) = span(lm.leftEye), (_, re) = span(lm.rightEye)
  print(String(format: "%.2f %.3f %.3f %.3f", t, ih, ow, (le + re) / 2))
}
