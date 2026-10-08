import PDFKit
import AppKit
let doc = PDFDocument(url: URL(fileURLWithPath: CommandLine.arguments[1]))!
let page = doc.page(at: 0)!
let b = page.bounds(for: .mediaBox)
let sc: CGFloat = 10
let W = Int(b.width*sc), H = Int(b.height*sc)
let cs = CGColorSpaceCreateDeviceRGB()
let ctx = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W*4, space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.setFillColor(CGColor(red:1,green:1,blue:1,alpha:1)); ctx.fill(CGRect(x:0,y:0,width:W,height:H))
ctx.scaleBy(x: sc, y: sc); page.draw(with: .mediaBox, to: ctx)
let full = ctx.makeImage()!
// crop (top-left origin) in pt
let crop = CGRect(x: 185*sc, y: 362*sc, width: 225*sc, height: 50*sc)
let img = full.cropping(to: crop)!
let w = img.width, h = img.height
var px = [UInt8](repeating: 0, count: w*h*4)
let c2 = CGContext(data: &px, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w*4, space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
c2.draw(img, in: CGRect(x:0,y:0,width:w,height:h))
func out(_ r: UInt8, _ g: UInt8, _ bl: UInt8, _ name: String) {
  var o = [UInt8](repeating: 0, count: w*h*4)
  var minx=w,miny=h,maxx=0,maxy=0
  for y in 0..<h { for x in 0..<w {
    let i=(y*w+x)*4
    let lum = (0.299*Double(px[i])+0.587*Double(px[i+1])+0.114*Double(px[i+2]))/255.0
    // gold lum ~0.44 ; white 1.0
    var a = (1.0-lum)/(1.0-0.44); a = max(0,min(1,a)); if a < 0.04 { a = 0 }
    if a > 0 { minx=min(minx,x);maxx=max(maxx,x);miny=min(miny,y);maxy=max(maxy,y) }
    o[i]=UInt8(Double(r)*a); o[i+1]=UInt8(Double(g)*a); o[i+2]=UInt8(Double(bl)*a); o[i+3]=UInt8(a*255)
  }}
  let c3 = CGContext(data: &o, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w*4, space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  let im = c3.makeImage()!.cropping(to: CGRect(x:minx-8,y:miny-8,width:maxx-minx+16,height:maxy-miny+16))!
  let rep = NSBitmapImageRep(cgImage: im)
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: CommandLine.arguments[2]+"/"+name))
  print(name, im.width, im.height)
}
out(0x86,0x6C,0x4A,"logo_dorado.png")
out(255,255,255,"logo_blanco.png")
out(0,0,0,"logo_negro.png")
out(0xD9,0xBF,0x94,"logo_oro_claro.png")
