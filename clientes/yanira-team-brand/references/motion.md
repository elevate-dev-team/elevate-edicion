# Motion graphics — plantilla (`template/src`)

Tiempos en **segundos del timeline ya cortado**, convertidos con `f(seg)`.

## `brand.ts`
Paleta `C` (+ `oroClaro`, `tinta`, `humo`), `GOLD_GRAD` / `goldText`, `SAFE` (70/270/900/1440), `SAFE_CX` 485, tracking bajo, easings (`EASE_OUT`, `EASE_INOUT`…), `pop()` spring sedoso, `prog()`.

## `layout.ts` (el corazón)
- `faceAt(t)`: cara interpolada desde `faces.json`.
- `SPLITS`: ventanas de pantalla dividida `{a, b, edge}` (edge = y del borde del panel, 830–900). `splitAt(t)` → `{s, edge}` con rampa de 0.5 s.
- `panelBox(edge)`: caja segura del gráfico dentro del panel; `captionRowTop(edge)`: fila de subtítulos del panel.
- `HARD_CUTS` (silencios) / `SOFT_CUTS` (reencuadres animados), `TARGET_W` (tamaño de cara por plano), `PUNCHES`.
- `camera(t)` → `{S, T, s, edge, head}`: escala/traslación del speaker y **caja de la cabeza** en pantalla (para verificar y para las guías).

## `Speaker.tsx` / `Captions.tsx`
Speaker con la cámara virtual. Subtítulos karaoke (Bold 74 → 62 en panel, caja dorada degradada en la palabra activa, máx. 3 palabras / 15 caracteres para no salirse del ancho seguro) que se deslizan entre y≈1296 y la fila del panel según `s`.

## `mg/primitives.tsx`
`DrawIcon` + `ICON` · `Reveal` (máscara) · `Words` (palabra por palabra) · `Eyebrow` (píldora) · `Counter` · `DarkBg` · `TopPanel` (panel con borde "\" y filete con brillo; acepta hijos de fondo) · `Page` (página del panel con entrada/salida lateral + blur) · `SlashReveal` · `FullPlate` (placa oscura, contenido en zona segura) · `KeywordTitle` (píldora + palabra letra por letra + subrayado; autoajuste al ancho seguro; `swapTo`) · `Topo` · `SafeGuides` (guías cian/rojo).

## `mg/scenes.tsx` (video "Alquilar vs comprar")
| Escena | Qué cuenta |
|---|---|
| `HookPage` → `FloridaPage` + `PanelVideo` | ALQUILAR / vs / COMPRAR (oro) → dron de Orlando dentro del panel, pin, "Centro de la FLORIDA", coordenadas |
| `RentPage` | Ejemplo $2,000/mes: contador a $120,000 en 5 años, 60 barritas de meses, sello "Para ti: $0" |
| `BuyPage` | "Tu dinero se queda contigo": curva de patrimonio con punto que viaja, años, chips VALOR/LEGADO/PLUSVALÍA |
| `BetterPlate` | Placa: ✓ COMPRAR es mucho mejor que ~~RENTAR~~ + tabla Patrimonio/Plusvalía/Legado ✓/✕ |
| `MortgagePage` | Barras RENTA = MORTGAGE $2,000 → tachado → INVERSIÓN (oro con brillo, "patrimonio ↑") vs "0 % tuyo" |
| `LogoPage` → `ProgramsPage` | Logo oro claro con barrido de luz → "+100 PROGRAMAS" + carrusel continuo de programas |
| `ZeroPlate` | Tragamonedas que desacelera hasta $0 DOWN PAYMENT / $0 GASTOS DE CIERRE + disclaimer |
| `TrashPage` | Billetes que caen a la papelera + contador "$24,000 al año" + "a la basura" con golpe |
| `LogoBug`, `YesWeCanPlate` | Píldora con logo; ¡SÍ / SE / PUEDE! sobre dorado con anillos |
| `WhatsAppPage` → `PowerPage` | Chat (mensaje, escribiendo…, respuesta) → medidor de poder de compra + checklist |
| `PanelDeco` | Ícono gigante tenue que gira detrás del panel según la escena |

## Reglas de animador
- Cada gráfico entra en la palabra exacta (±2 frames); una idea por página; los títulos salen **antes** de que se mueva la cámara.
- Textos mínimos: 30 px datos, 36 px cuerpo, 54–64 px titulares.
- Cifras ilustrativas siempre con eyebrow "EJEMPLO"; promesas financieras con disclaimer.
- 2–3 placas a pantalla completa por minuto como máximo; el resto en panel o sobre el speaker.
