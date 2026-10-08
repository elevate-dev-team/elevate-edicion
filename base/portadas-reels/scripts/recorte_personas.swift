// Rotoscopia de personas en una foto (Vision, macOS 12+): genera un PNG con las personas y fondo transparente.
//   swift recorte_personas.swift <foto.jpg> <salida_recorte.png> <salida_mascara.png>
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
let url = URL(fileURLWithPath: args[1])
guard let src = CGImageSourceCreateWithURL(url as CFURL, nil), let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else { fatalError("no pude abrir la foto") }
let W = cg.width, H = cg.height

let req = VNGeneratePersonSegmentationRequest()
req.qualityLevel = .accurate
req.outputPixelFormat = kCVPixelFormatType_OneComponent8
try VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
guard let maskBuf = req.results?.first?.pixelBuffer else { fatalError("sin máscara") }

// máscara a la resolución de la foto, con el borde apenas suavizado
var mask = CIImage(cvPixelBuffer: maskBuf)
mask = mask.transformed(by: CGAffineTransform(scaleX: CGFloat(W) / mask.extent.width, y: CGFloat(H) / mask.extent.height))
mask = mask.applyingGaussianBlur(sigma: 2.0).cropped(to: CGRect(x: 0, y: 0, width: W, height: H))

// corte opcional por debajo (ej. reflejos en una mesa de vidrio): 4º argumento = fracción de la altura (desde arriba)
if args.count > 4, let frac = Double(args[4]) {
    let feather = CGFloat(H) * 0.012
    let yCut = CGFloat(H) * CGFloat(1 - frac)          // Core Image mide desde abajo
    let ramp = CIFilter(name: "CILinearGradient", parameters: [
        "inputPoint0": CIVector(x: 0, y: yCut - feather), "inputColor0": CIColor.black,
        "inputPoint1": CIVector(x: 0, y: yCut + feather), "inputColor1": CIColor.white])!.outputImage!
        .cropped(to: CGRect(x: 0, y: 0, width: W, height: H))
    mask = mask.applyingFilter("CIMultiplyCompositing", parameters: [kCIInputBackgroundImageKey: ramp])
}

let photo = CIImage(cgImage: cg)
let clear = CIImage(color: .clear).cropped(to: photo.extent)
let cut = photo.applyingFilter("CIBlendWithMask", parameters: [kCIInputBackgroundImageKey: clear, kCIInputMaskImageKey: mask])

let ctx = CIContext()
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
try ctx.writePNGRepresentation(of: cut, to: URL(fileURLWithPath: args[2]), format: .RGBA8, colorSpace: cs)
try ctx.writePNGRepresentation(of: mask, to: URL(fileURLWithPath: args[3]), format: .L8, colorSpace: CGColorSpace(name: CGColorSpace.linearGray)!)
print("recorte \(W)x\(H) listo; máscara original \(CVPixelBufferGetWidth(maskBuf))x\(CVPixelBufferGetHeight(maskBuf))")
