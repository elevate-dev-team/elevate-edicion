// track_cara.swift <video> <t0> <t1> <fps> -> por frame: t caraCx caraTop caraBottom caraAncho ojoX ojoY (px del video rotado)
// Robusto con caras chicas, a contraluz o con lentes (donde eyes.swift/ojos.py fallan): persona -> recorte de la cabeza ampliado a 1000 px -> rectángulo de cara + landmarks. Compilar: swiftc -O track_cara.swift -o track_cara
import AVFoundation
import Vision
import CoreImage
let a = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let t0 = Double(a[2])!, t1 = Double(a[3])!, fps = Double(a[4])!
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero; gen.requestedTimeToleranceAfter = .zero
let cictx = CIContext()
var t = t0
while t <= t1 + 1e-6 {
  defer { t += 1.0 / fps }
  guard let img = try? gen.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 6000), actualTime: nil) else { print(String(format: "%.4f nan", t)); continue }
  let W = Double(img.width), H = Double(img.height)
  let hr = VNDetectHumanRectanglesRequest(); hr.upperBodyOnly = false
  try? VNImageRequestHandler(cgImage: img, options: [:]).perform([hr])
  var cx0 = 0.0, cy0 = 0.0, side = W
  if let p = (hr.results ?? []).max(by: { $0.boundingBox.height < $1.boundingBox.height }) {
    let pb = p.boundingBox
    let pTop = (1 - pb.maxY) * H, pH = pb.height * H, pCx = pb.midX * W
    side = min(W, max(pH * 0.5, 300))
    cx0 = max(0, min(W - side, pCx - side / 2)); cy0 = max(0, min(H - side, pTop - side * 0.1))
  }
  guard let crop = img.cropping(to: CGRect(x: cx0, y: cy0, width: side, height: side)) else { print(String(format: "%.4f nan", t)); continue }
  let up = 1000.0 / side
  let ci = CIImage(cgImage: crop).transformed(by: CGAffineTransform(scaleX: up, y: up))
  guard let c2 = cictx.createCGImage(ci, from: ci.extent) else { print(String(format: "%.4f nan", t)); continue }
  let fr = VNDetectFaceRectanglesRequest()
  let lr = VNDetectFaceLandmarksRequest()
  try? VNImageRequestHandler(cgImage: c2, options: [:]).perform([fr, lr])
  guard let f = (fr.results ?? []).max(by: { $0.boundingBox.width < $1.boundingBox.width }) else { print(String(format: "%.4f nan", t)); continue }
  let bb = f.boundingBox
  var ex = Double.nan, ey = Double.nan
  if let l = (lr.results ?? []).max(by: { $0.boundingBox.width < $1.boundingBox.width }), let lm = l.landmarks, let le = lm.leftEye, let re = lm.rightEye {
    let cs = CGSize(width: side, height: side)
    let pts = le.pointsInImage(imageSize: cs) + re.pointsInImage(imageSize: cs)
    ex = cx0 + pts.map { Double($0.x) }.reduce(0, +) / Double(pts.count)
    ey = cy0 + side - pts.map { Double($0.y) }.reduce(0, +) / Double(pts.count)
  }
  print(String(format: "%.4f %.1f %.1f %.1f %.1f %.1f %.1f", t, cx0 + bb.midX * side, cy0 + (1 - bb.maxY) * side, cy0 + (1 - bb.minY) * side, bb.width * side, ex, ey))
}
