// eyes.swift <video> <t1,t2,...>  -> imprime t, ojoX, ojoY (px del video, origen arriba-izq) promedio de ambos ojos
import AVFoundation
import Vision
let url = URL(fileURLWithPath: CommandLine.arguments[1])
let ts = CommandLine.arguments[2].split(separator: ",").map { Double($0)! }
let asset = AVURLAsset(url: url)
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero; gen.requestedTimeToleranceAfter = .zero
for t in ts {
  guard let img = try? gen.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil) else { continue }
  let W = Double(img.width), H = Double(img.height)
  let req = VNDetectFaceLandmarksRequest()
  try? VNImageRequestHandler(cgImage: img, options: [:]).perform([req])
  guard let f = (req.results ?? []).max(by: { $0.boundingBox.width < $1.boundingBox.width }), let lm = f.landmarks,
        let le = lm.leftEye, let re = lm.rightEye else { print(t, "sin cara"); continue }
  let pts = le.pointsInImage(imageSize: CGSize(width: W, height: H)) + re.pointsInImage(imageSize: CGSize(width: W, height: H))
  let x = pts.map { Double($0.x) }.reduce(0, +) / Double(pts.count)
  let y = H - pts.map { Double($0.y) }.reduce(0, +) / Double(pts.count)
  print(String(format: "%.3f %.1f %.1f %.0fx%.0f", t, x, y, W, H))
}
