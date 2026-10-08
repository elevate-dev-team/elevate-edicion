// roto_batch.swift <frames_dir> <titulo.png> <out_dir>
// Rotoscopia de VIDEO para el "título gigante detrás del speaker" de LIU: para cada frame del plano
// (extraídos del render base, ej. `ffmpeg -i base.mp4 -vf "select='between(n,74,118)'" -fps_mode passthrough fr/%03d.png`)
// genera la máscara de persona (Vision) y compone el título SOLO donde NO hay persona → PNG RGBA.
// Después: `ffmpeg -framerate 30 -i out/%03d.png -c:v png roto.mov` y se superpone con overlay+setpts+enable.
// Probado en la pauta 05-10 (45 frames, "33610 TAMPA" detrás de Liubel caminando).
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
let framesDir = args[1], titlePath = args[2], outDir = args[3]
let ciCtx = CIContext()
guard let titleImg = CIImage(contentsOf: URL(fileURLWithPath: titlePath)) else { fatalError("sin titulo") }

let files = try! FileManager.default.contentsOfDirectory(atPath: framesDir).filter { $0.hasSuffix(".png") || $0.hasSuffix(".jpg") }.sorted()
for f in files {
    let url = URL(fileURLWithPath: framesDir + "/" + f)
    guard let src = CGImageSourceCreateWithURL(url as CFURL, nil), let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else { continue }
    let W = cg.width, H = cg.height
    let req = VNGeneratePersonSegmentationRequest()
    req.qualityLevel = .balanced
    req.outputPixelFormat = kCVPixelFormatType_OneComponent8
    try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
    guard let maskBuf = req.results?.first?.pixelBuffer else { continue }
    var mask = CIImage(cvPixelBuffer: maskBuf)
    mask = mask.transformed(by: CGAffineTransform(scaleX: CGFloat(W) / mask.extent.width, y: CGFloat(H) / mask.extent.height))
    mask = mask.applyingGaussianBlur(sigma: 1.5).cropped(to: CGRect(x: 0, y: 0, width: W, height: H))
    let inv = mask.applyingFilter("CIColorInvert")
    let empty = CIImage(color: .clear).cropped(to: CGRect(x: 0, y: 0, width: W, height: H))
    let outImg = titleImg.applyingFilter("CIBlendWithMask", parameters: [kCIInputBackgroundImageKey: empty, kCIInputMaskImageKey: inv])
    let dest = URL(fileURLWithPath: outDir + "/" + f.replacingOccurrences(of: ".jpg", with: ".png"))
    try! ciCtx.writePNGRepresentation(of: outImg, to: dest, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
}
print("roto ok \(files.count) frames")
