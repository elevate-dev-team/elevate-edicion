// cara_selfie.swift <video> <t0> <t1> <fps> -> mismas columnas que track_cara.swift (t cx top bot ancho ojoX ojoY)
// Para selfies con la cara grande y torcida, donde track_cara (persona → recorte) falla: landmarks de Vision sobre el cuadro entero.
// Caso real: DC 10-10 (2026-10-29), selfies de techo / aire / plomería / electricidad.
import AVFoundation; import Vision
let a = CommandLine.arguments
let g = AVAssetImageGenerator(asset: AVURLAsset(url: URL(fileURLWithPath: a[1]))); g.appliesPreferredTrackTransform = true
g.requestedTimeToleranceBefore = .zero; g.requestedTimeToleranceAfter = .zero
let t0 = Double(a[2])!, t1 = Double(a[3])!, fps = Double(a[4])!
var t = t0
while t <= t1 + 1e-6 {
  defer { t += 1.0 / fps }
  guard let img = try? g.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 6000), actualTime: nil) else { print(String(format: "%.4f nan", t)); continue }
  let W = Double(img.width), H = Double(img.height)
  let r = VNDetectFaceLandmarksRequest(); try? VNImageRequestHandler(cgImage: img).perform([r])
  guard let f = (r.results ?? []).max(by: { $0.boundingBox.width < $1.boundingBox.width }), let le = f.landmarks?.leftPupil ?? f.landmarks?.leftEye, let re = f.landmarks?.rightPupil ?? f.landmarks?.rightEye else { print(String(format: "%.4f nan", t)); continue }
  let b = f.boundingBox
  let pts = (le.pointsInImage(imageSize: CGSize(width: W, height: H)) + re.pointsInImage(imageSize: CGSize(width: W, height: H)))
  let ex = pts.map{Double($0.x)}.reduce(0,+) / Double(pts.count), ey = H - pts.map{Double($0.y)}.reduce(0,+) / Double(pts.count)
  print(String(format: "%.4f %.1f %.1f %.1f %.1f %.1f %.1f", t, b.midX * W, (1 - b.maxY) * H, (1 - b.minY) * H, b.width * W, ex, ey))
}
