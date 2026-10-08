import {camera, captionRowTop} from './src/layout';
// zonas de gráficos en modo completo (y superior, y inferior) por ventana de tiempo
const zones: [string, number, number, number, number][] = [
  ['kw INCENTIVOS', 43.35, 46.95, 1090, 1390],
  ['kw OPORTUNIDAD', 47.15, 48.33, 1170, 1380],
  ['kw COMPRAR TU CASA', 53.25, 55.45, 1090, 1410],
  ['logo bug', 55.8, 58.12, 276, 368],
];
const fullCovered = [[5.02,6.92],[18.1,20.4],[33.08,35.98],[37.25,40.45],[58.12,59.55],[66.28,99]];
let worst: Record<string, number> = {};
for (let fr = 0; fr < 2058; fr++) {
  const t = fr / 30;
  if (fullCovered.some(([a,b]) => t >= a && t < b)) continue;
  const c = camera(t);
  // subtítulos
  const capTop = c.s > 0.5 ? captionRowTop(c.edge) : 1296;
  const capBot = capTop + 95;
  const k = (name: string, over: number) => { if (over > (worst[name] ?? -9999)) worst[name] = over; };
  if (c.s < 0.5) k('captions (full) vs cabeza', c.head.bottom - capTop);
  if (c.s > 0.98) k('panel edge vs cabeza (necesita <0)', c.edge + 30 - c.head.top);
  if (c.s > 0.001 && c.s <= 0.98) { const cur = c.edge + 60 - (c.edge + 100) * (1 - c.s); k('panel en transición vs cabeza', Math.min(cur, c.head.bottom) - c.head.top > 0 && cur > c.head.top ? cur - c.head.top : -1); }
  k('cabeza fuera del margen superior (270)', 270 - c.head.top);
  for (const [n,a,b,top,bot] of zones) if (t>=a && t<b) k(n, Math.min(c.head.bottom, bot) - Math.max(c.head.top, top));
  k('video no cubre abajo', 0);
}
console.log('solapamiento máximo en px (<=0 = OK):');
for (const [n,v] of Object.entries(worst)) console.log(' ', n.padEnd(42), Math.round(v));
