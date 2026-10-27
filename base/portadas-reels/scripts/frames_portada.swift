// frames_portada.swift — candidatos de frame para la portada cuando la arma el editor: mirando a cámara, boca cerrada o sonriendo, ojos abiertos.
//   swiftc -O frames_portada.swift -o frames_portada
//   ./frames_portada <toma.mov> [fps=10] [n=6]   (una toma por vez; usar el video ya pasado a SDR)
// Mide con Vision (landmarks) por frame: apertura de los labios internos, ancho de la boca, giro de la cara (yaw) y apertura de ojos.
// Filtra boca cerrada (apertura < 0,02 de la cara), ojos abiertos (≥ 85 % de la mediana de la toma) y de frente (|yaw| < 0,2), y ordena
// por boca más cerrada y más ancha (sonrisa leve). Imprime los n mejores separados ≥ 0,6 s. Revisar a ojo: no mide manos delante ni desenfoque.
// Caso real: AP 09-09 (2026-10-27). Los dos frames aprobados estaban en los últimos 0,4 s de las tomas del hook y del CTA: al terminar
// de hablar suele sonreír, así que revisar también los finales de cada toma aunque no entren en el montaje.
import AVFoundation
import Vision

let a = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let fps = a.count > 2 ? Double(a[2])! : 10
let topN = a.count > 3 ? Int(a[3])! : 6
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero; gen.requestedTimeToleranceAfter = .zero
gen.maximumSize = CGSize(width: 1080, height: 1920)
let dur = CMTimeGetSeconds(asset.duration)
func span(_ p: [CGPoint], _ x: Bool) -> Double { let v = p.map { Double(x ? $0.x : $0.y) }; return (v.max() ?? 0) - (v.min() ?? 0) }
struct Row { let t, abre, ancho, yaw, ojo: Double }
var rows: [Row] = []
var t = 0.0
while t < dur {
  defer { t += 1 / fps }
  guard let img = try? gen.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 6000), actualTime: nil) else { continue }
  let r = VNDetectFaceLandmarksRequest()
  try? VNImageRequestHandler(cgImage: img, options: [:]).perform([r])
  guard let f = r.results?.first, let lm = f.landmarks, let il = lm.innerLips, let ol = lm.outerLips,
        let le = lm.leftEye, let re = lm.rightEye else { continue }
  rows.append(Row(t: t, abre: span(il.normalizedPoints, false), ancho: span(ol.normalizedPoints, true),
                  yaw: abs(f.yaw?.doubleValue ?? 0), ojo: (span(le.normalizedPoints, false) + span(re.normalizedPoints, false)) / 2))
}
guard !rows.isEmpty else { print("sin caras"); exit(0) }
let ojoMed = rows.map { $0.ojo }.sorted()[rows.count / 2]
let cands = rows.filter { $0.abre < 0.02 && $0.ojo > 0.85 * ojoMed && $0.yaw < 0.2 }.sorted { ($0.abre - 0.5 * $0.ancho) < ($1.abre - 0.5 * $1.ancho) }
var pick: [Row] = []
for c in cands where pick.allSatisfy({ abs($0.t - c.t) >= 0.6 }) { pick.append(c); if pick.count == topN { break } }
for p in pick { print(String(format: "t %.2f  boca %.4f  ancho %.3f  yaw %.2f  ojo %.3f", p.t, p.abre, p.ancho, p.yaw, p.ojo)) }
