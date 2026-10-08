// Fondo sin las personas: rellena la zona de la máscara con los colores de alrededor (difusión normalizada),
// para que al desenfocarlo no quede el "fantasma" oscuro de la persona detrás del recorte.
//   swift fondo_limpio.swift <foto.jpg> <mascara.png (blanco = persona)> <salida.jpg>
import AppKit
import CoreImage

let a = CommandLine.arguments
func load(_ p: String) -> CIImage { CIImage(contentsOf: URL(fileURLWithPath: p))! }
let photo = load(a[1])
let ext = photo.extent
// máscara agrandada unos px para tapar también el borde de la silueta
var m = load(a[2]).applyingFilter("CIMorphologyMaximum", parameters: ["inputRadius": 18]).cropped(to: ext)
m = m.applyingGaussianBlur(sigma: 6).cropped(to: ext)
let inv = m.applyingFilter("CIColorInvert")
// promedio de lo que rodea: blur(foto·(1-m)) / blur(1-m)
let masked = photo.applyingFilter("CIMultiplyCompositing", parameters: [kCIInputBackgroundImageKey: inv])
var fill = masked
var weight = inv
for s in [30.0, 90.0] {   // dos pasadas para llegar al centro de zonas grandes
    let num = masked.clampedToExtent().applyingGaussianBlur(sigma: s).cropped(to: ext)
    let den = inv.clampedToExtent().applyingGaussianBlur(sigma: s).cropped(to: ext)
    let f = den.applyingFilter("CIDivideBlendMode", parameters: [kCIInputBackgroundImageKey: num])
    fill = s == 30.0 ? f : f.applyingFilter("CIBlendWithMask", parameters: [kCIInputBackgroundImageKey: f, kCIInputMaskImageKey: den])
    weight = den
}
let clean = fill.applyingFilter("CIBlendWithMask", parameters: [kCIInputBackgroundImageKey: photo, kCIInputMaskImageKey: m])
let ctx = CIContext()
try ctx.writeJPEGRepresentation(of: clean.cropped(to: ext), to: URL(fileURLWithPath: a[3]), colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!,
                                 options: [kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: 0.92])
print("fondo limpio listo")
