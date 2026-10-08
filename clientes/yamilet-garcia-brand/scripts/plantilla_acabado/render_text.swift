// render_text.swift <spec.json>
// Genera PNGs 1080x1920 transparentes con texto CoreText (runs con fuente/tamaño/outline, sombra suave, tracking).
// Creado para la pauta LIU 05-10 (el ffmpeg local no tiene drawtext ni libass): los textos se montan como overlays.
// spec: {"fonts":{"REG":"/path.otf",...},"pngs":[{"out":"...","background":"(opcional)","shadow":{"blur":6,"dy":3,"alpha":0.5},
//        "lines":[{"yCenter":1185,"tracking":-0.5,"runs":[{"text":"hola ","font":"REG","size":58,"outline":false}]}]}]}
// - yCenter en coords de video (origen arriba). Centrado horizontal en x=540 (centro real de pantalla; preferencia del usuario).
// - tracking en unidades relativas a cuerpo 58 (se escala por tamaño). "outline":true = solo contorno (strokeWidth 12).
// - "color":"#2D6191" = relleno de color; "stroke":3.5 = relleno + contorno blanco (azul de marca con borde, reel 03-10).
import AppKit
import Foundation

let spec = try! JSONSerialization.jsonObject(with: Data(contentsOf: URL(fileURLWithPath: CommandLine.arguments[1]))) as! [String: Any]
let fontPaths = spec["fonts"] as! [String: String]
var fontCache: [String: CTFontDescriptor] = [:]
for (k, p) in fontPaths {
    let descs = CTFontManagerCreateFontDescriptorsFromURL(URL(fileURLWithPath: p) as CFURL) as! [CTFontDescriptor]
    fontCache[k] = descs[0]
}
func font(_ key: String, _ size: Double) -> CTFont { CTFontCreateWithFontDescriptor(fontCache[key]!, CGFloat(size), nil) }

let W = 1080, H = 1920
for png in spec["pngs"] as! [[String: Any]] {
    let out = png["out"] as! String
    // bitmap 1:1 (lockFocus en pantallas retina duplica los píxeles)
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: W, pixelsHigh: H, bitsPerSample: 8, samplesPerPixel: 4,
                               hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    let gctx = NSGraphicsContext(bitmapImageRep: rep)!
    NSGraphicsContext.current = gctx
    let ctx = gctx.cgContext
    if let bg = png["background"] as? String, let bgi = NSImage(contentsOfFile: bg) {
        bgi.draw(in: NSRect(x: 0, y: 0, width: W, height: H))
    }
    let sh = png["shadow"] as? [String: Double]
    for line in png["lines"] as! [[String: Any]] {
        let yC = line["yCenter"] as! Double
        let tracking = (line["tracking"] as? Double) ?? 0
        let att = NSMutableAttributedString()
        for run in line["runs"] as! [[String: Any]] {
            let text = run["text"] as! String
            let size = run["size"] as! Double
            let f = font(run["font"] as! String, size)
            var a: [NSAttributedString.Key: Any] = [.font: f, .kern: tracking * size / 58.0]
            func hex(_ h: String) -> NSColor {
                let v = Int(h.dropFirst(), radix: 16)!
                return NSColor(srgbRed: CGFloat((v >> 16) & 255) / 255, green: CGFloat((v >> 8) & 255) / 255, blue: CGFloat(v & 255) / 255, alpha: 1)
            }
            if (run["outline"] as? Bool) == true {
                a[.strokeColor] = NSColor.white; a[.strokeWidth] = 12.0   // solo contorno
                a[.foregroundColor] = NSColor.clear
            } else {
                a[.foregroundColor] = (run["color"] as? String).map(hex) ?? NSColor.white
                if let sw = run["stroke"] as? Double {   // relleno + contorno blanco (ej. azul de marca con borde)
                    a[.strokeColor] = NSColor.white; a[.strokeWidth] = -sw
                }
            }
            att.append(NSAttributedString(string: text, attributes: a))
        }
        if let sh = sh {
            let s = NSShadow()
            s.shadowBlurRadius = CGFloat(sh["blur"] ?? 6)
            s.shadowOffset = NSSize(width: 0, height: -(sh["dy"] ?? 3))
            s.shadowColor = NSColor.black.withAlphaComponent(CGFloat(sh["alpha"] ?? 0.5))
            att.addAttribute(.shadow, value: s, range: NSRange(location: 0, length: att.length))
        }
        let lineCT = CTLineCreateWithAttributedString(att)
        let bounds = CTLineGetBoundsWithOptions(lineCT, .useGlyphPathBounds)
        let x = 540.0 - bounds.width / 2 - bounds.minX
        let yFlipped = Double(H) - yC
        ctx.textPosition = CGPoint(x: x, y: yFlipped - bounds.height / 2 - bounds.minY)
        CTLineDraw(lineCT, ctx)
    }
    NSGraphicsContext.current = nil
    try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: out))
    print("ok", out)
}
