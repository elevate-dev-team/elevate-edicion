// Caso real: AR 08-10 (2026-11-10): elige frames para la portada (labios cerrados + nitidez). Compilar: swiftc -O boca.swift -o boca
// boca.swift <video> <t0> <t1> <paso> -> t apertura(labios int / alto cara) sonrisa(ancho boca / ancho cara) nitidez
import AVFoundation; import Vision; import CoreImage
let a = CommandLine.arguments; let url = URL(fileURLWithPath: a[1])
let t0 = Double(a[2])!, t1 = Double(a[3])!, st = Double(a[4])!
let asset = AVURLAsset(url: url); let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true; gen.requestedTimeToleranceBefore = .zero; gen.requestedTimeToleranceAfter = .zero
var t = t0
while t <= t1 {
  if let img = try? gen.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil) {
    let r = VNDetectFaceLandmarksRequest(); try? VNImageRequestHandler(cgImage: img).perform([r])
    if let f = r.results?.first, let il = f.landmarks?.innerLips, let ol = f.landmarks?.outerLips {
      let ip = il.normalizedPoints, op = ol.normalizedPoints
      let ih = (ip.map{$0.y}.max()! - ip.map{$0.y}.min()!)
      let ow = (op.map{$0.x}.max()! - op.map{$0.x}.min()!)
      // nitidez: varianza de un laplaciano aproximado sobre la cara
      let W = img.width, H = img.height
      let bb = f.boundingBox
      let rect = CGRect(x: bb.minX*Double(W), y: (1-bb.maxY)*Double(H), width: bb.width*Double(W), height: bb.height*Double(H))
      var sharp = 0.0
      if let crop = img.cropping(to: rect) {
        let w = crop.width, h = crop.height; var px = [UInt8](repeating: 0, count: w*h)
        let ctx = CGContext(data: &px, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w, space: CGColorSpaceCreateDeviceGray(), bitmapInfo: 0)!
        ctx.draw(crop, in: CGRect(x: 0, y: 0, width: w, height: h))
        var s = 0.0, s2 = 0.0, n = 0.0
        for y in 1..<(h-1) { for x in 1..<(w-1) { let i = y*w+x
          let l = Double(px[i-1]) + Double(px[i+1]) + Double(px[i-w]) + Double(px[i+w]) - 4*Double(px[i]); s += l; s2 += l*l; n += 1 } }
        sharp = s2/n - (s/n)*(s/n)
      }
      print(String(format: "%.2f %.3f %.3f %.0f", t, ih, ow, sharp))
    } else { print(String(format: "%.2f -", t)) }
  }
  t += st
}
