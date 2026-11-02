// Copia general (antes solo en pamela-erick-brand). Uso con títulos detrás del speaker: ver regla 10 y limpiar_mascara.py. Probado también en DC 07-10 (2026-10-19): 621 cuadros 1080×1920 en ~5 min.
// Rotoscopia de personas en VIDEO (Vision, macOS 12+): genera un video de máscara (blanco = personas)
// del mismo tamaño y fps que el clip, para poner títulos DETRÁS del speaker con ffmpeg/Remotion.
//   swift roto_video.swift <clip.mp4> <mascara.mov> [inicio_s] [duracion_s] [suavizado 0–0.9]
// - Usar sobre el clip ya recortado/escalado a 1080×1920 (el mismo que va a la composición).
// - suavizado: mezcla temporal con el cuadro anterior para que el borde no tiemble (default 0.35; 0 = sin mezcla).
// - Salida: ProRes 422 en escala de grises. Componer con:
//   ffmpeg -i clip.mp4 -i mascara.mov -filter_complex "[0][1]alphamerge[fg]; [0][titulo]overlay[bg]; [bg][fg]overlay" ...
import AVFoundation
import CoreImage
import Vision

let a = CommandLine.arguments
guard a.count >= 3 else { print("uso: swift roto_video.swift <clip> <mascara.mov> [inicio] [dur] [suavizado]"); exit(1) }
let inURL = URL(fileURLWithPath: a[1]), outURL = URL(fileURLWithPath: a[2])
let start = a.count > 3 ? Double(a[3])! : 0
let asset = AVURLAsset(url: inURL)
let track = asset.tracks(withMediaType: .video).first!
let total = CMTimeGetSeconds(asset.duration)
let dur = a.count > 4 ? Double(a[4])! : total - start
let smooth = a.count > 5 ? CGFloat(Double(a[5])!) : 0.35
let size = track.naturalSize.applying(track.preferredTransform)
let W = Int(abs(size.width)), H = Int(abs(size.height))
let fps = track.nominalFrameRate

let reader = try AVAssetReader(asset: asset)
reader.timeRange = CMTimeRange(start: CMTime(seconds: start, preferredTimescale: 600), duration: CMTime(seconds: dur, preferredTimescale: 600))
let out = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
reader.add(out); reader.startReading()

try? FileManager.default.removeItem(at: outURL)
let writer = try AVAssetWriter(outputURL: outURL, fileType: .mov)
let wIn = AVAssetWriterInput(mediaType: .video, outputSettings: [AVVideoCodecKey: AVVideoCodecType.proRes422, AVVideoWidthKey: W, AVVideoHeightKey: H])
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: wIn, sourcePixelBufferAttributes: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA, kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H])
writer.add(wIn); writer.startWriting(); writer.startSession(atSourceTime: CMTime(seconds: start, preferredTimescale: 600))

let ctx = CIContext()
let req = VNGeneratePersonSegmentationRequest()
req.qualityLevel = .accurate
req.outputPixelFormat = kCVPixelFormatType_OneComponent8
var prev: CIImage? = nil
var n = 0
let rect = CGRect(x: 0, y: 0, width: W, height: H)

while let sb = out.copyNextSampleBuffer(), let px = CMSampleBufferGetImageBuffer(sb) {
    let t = CMSampleBufferGetPresentationTimeStamp(sb)
    try VNImageRequestHandler(cvPixelBuffer: px, orientation: .up, options: [:]).perform([req])
    var m = CIImage(cvPixelBuffer: req.results!.first!.pixelBuffer)
    m = m.transformed(by: CGAffineTransform(scaleX: CGFloat(W) / m.extent.width, y: CGFloat(H) / m.extent.height))
    m = m.applyingGaussianBlur(sigma: 1.5).cropped(to: rect)
    if let p = prev, smooth > 0 {
        m = m.applyingFilter("CIDissolveTransition", parameters: ["inputTargetImage": p, "inputTime": smooth]).cropped(to: rect)
    }
    prev = m
    while !wIn.isReadyForMoreMediaData { usleep(2000) }
    var ob: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &ob)
    ctx.render(m.applyingFilter("CIMaximumComponent"), to: ob!)
    adaptor.append(ob!, withPresentationTime: t)
    n += 1
    if n % 25 == 0 { print("cuadros: \(n)") }
}
wIn.markAsFinished()
let sem = DispatchSemaphore(value: 0)
writer.finishWriting { sem.signal() }
sem.wait()
print("listo: \(n) cuadros, \(W)x\(H) @ \(fps) fps → \(outURL.path)")
