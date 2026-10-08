// caras_foto.swift <foto.jpg>... -> por foto: nombre W H y cajas de cara (x0 y0 x1 y1 en px, origen arriba)
import Vision
import AppKit
for p in CommandLine.arguments.dropFirst() {
  guard let im = NSImage(contentsOfFile: p), let cg = im.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
  let W = Double(cg.width), H = Double(cg.height)
  let req = VNDetectFaceRectanglesRequest()
  try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
  var s = "\((p as NSString).lastPathComponent) \(Int(W)) \(Int(H))"
  for f in req.results ?? [] { let b = f.boundingBox
    s += String(format: " [%.0f %.0f %.0f %.0f]", b.minX * W, (1 - b.maxY) * H, b.maxX * W, (1 - b.minY) * H) }
  print(s)
}
