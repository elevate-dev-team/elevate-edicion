// track.swift <video> <desde> <hasta> <paso> → t x0 x1 y0 y1 (px, origen arriba-izq) de la cara más grande
import AVFoundation; import Vision
let a = CommandLine.arguments; let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let g = AVAssetImageGenerator(asset: asset); g.appliesPreferredTrackTransform = true
g.requestedTimeToleranceBefore = .zero; g.requestedTimeToleranceAfter = .zero
var t = Double(a[2])!; let t1 = Double(a[3])!, st = Double(a[4])!
while t <= t1 + 1e-6 {
  if let cg = try? g.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil) {
    let rq = VNDetectFaceRectanglesRequest(); try? VNImageRequestHandler(cgImage: cg).perform([rq])
    let W = Double(cg.width), H = Double(cg.height)
    if let f = (rq.results ?? []).max(by: { $0.boundingBox.width < $1.boundingBox.width }) {
      let b = f.boundingBox
      print(String(format: "%.3f %.0f %.0f %.0f %.0f", t, b.minX*W, b.maxX*W, (1-b.maxY)*H, (1-b.minY)*H))
    } else { print(String(format: "%.3f nan", t)) }
  }
  t += st
}
