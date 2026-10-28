// boca.swift <video> <t0> <t1> <paso>: por frame → t, apertura de boca (labio interno / alto de cara), ojos (alto/ancho), ancho de boca (sonrisa)
// Para elegir los frames del speaker para la portada (sonriendo o boca cerrada). Caso real: DC 13-10 (2026-10-28). Compilar: swiftc -O boca.swift -o boca
import AVFoundation; import Vision
let a = CommandLine.arguments; let url = URL(fileURLWithPath: a[1])
let t0 = Double(a[2])!, t1 = Double(a[3])!, dt = Double(a[4])!
let g = AVAssetImageGenerator(asset: AVURLAsset(url: url)); g.appliesPreferredTrackTransform = true
g.requestedTimeToleranceBefore = .zero; g.requestedTimeToleranceAfter = .zero
func span(_ p: [CGPoint]) -> (CGFloat, CGFloat) { let xs = p.map{$0.x}, ys = p.map{$0.y}; return (xs.max()! - xs.min()!, ys.max()! - ys.min()!) }
var t = t0
while t <= t1 {
  if let img = try? g.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil) {
    let r = VNDetectFaceLandmarksRequest(); try? VNImageRequestHandler(cgImage: img).perform([r])
    if let f = r.results?.first, let l = f.landmarks, let il = l.innerLips, let ol = l.outerLips, let le = l.leftEye, let re = l.rightEye {
      let (_, ih) = span(il.normalizedPoints); let (ow, _) = span(ol.normalizedPoints)
      let (lw, lh) = span(le.normalizedPoints); let (rw, rh) = span(re.normalizedPoints)
      print(String(format: "%.2f %.3f %.3f %.3f", t, ih, (lh/lw + rh/rw)/2, ow))
    }
  }
  t += dt
}
