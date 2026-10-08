// person_mask.swift <frames_dir> <out_dir> → máscara de persona (Vision, calidad alta) por frame, PNG gris 1080x1920
import AppKit
import CoreImage
import Vision
let a = CommandLine.arguments
let ciCtx = CIContext()
let files = try! FileManager.default.contentsOfDirectory(atPath: a[1]).filter { $0.hasSuffix(".png") }.sorted()
for f in files {
  guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1] + "/" + f) as CFURL, nil),
        let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else { continue }
  let req = VNGeneratePersonSegmentationRequest()
  req.qualityLevel = .accurate
  req.outputPixelFormat = kCVPixelFormatType_OneComponent8
  try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
  guard let buf = req.results?.first?.pixelBuffer else { continue }
  var m = CIImage(cvPixelBuffer: buf)
  m = m.transformed(by: CGAffineTransform(scaleX: CGFloat(cg.width) / m.extent.width, y: CGFloat(cg.height) / m.extent.height))
  m = m.applyingGaussianBlur(sigma: 1.2).cropped(to: CGRect(x: 0, y: 0, width: cg.width, height: cg.height))
  try! ciCtx.writePNGRepresentation(of: m, to: URL(fileURLWithPath: a[2] + "/" + f), format: .L8, colorSpace: CGColorSpaceCreateDeviceGray())
}
print("mascaras", files.count)
