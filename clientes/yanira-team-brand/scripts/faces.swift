import AVFoundation
import Vision
import Foundation
let url = URL(fileURLWithPath: CommandLine.arguments[1])
let step = Double(CommandLine.arguments[2]) ?? 0.25
let asset = AVURLAsset(url: url)
let dur = CMTimeGetSeconds(asset.duration)
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = CMTime(value: 1, timescale: 30)
gen.requestedTimeToleranceAfter = CMTime(value: 1, timescale: 30)
gen.maximumSize = CGSize(width: 720, height: 1280)
var out: [[Double]] = []
var t = 0.0
while t < dur {
  if let img = try? gen.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil) {
    let req = VNDetectFaceRectanglesRequest()
    try? VNImageRequestHandler(cgImage: img, options: [:]).perform([req])
    var row: [Double] = [t]
    for f in req.results ?? [] { let b = f.boundingBox; row += [Double(b.midX), Double(1 - b.midY), Double(b.width), Double(b.height)] }
    out.append(row)
  }
  t += step
}
let data = try! JSONSerialization.data(withJSONObject: out)
try! data.write(to: URL(fileURLWithPath: CommandLine.arguments[3]))
print("frames:", out.count)
