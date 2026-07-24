# IVChart

Inline-SVG implied-volatility micro visualizations (term structure + surface).

## Props
- `variant?: "term" | "surface"` — @default `"term"`.
- `term?: IVTermPoint[]` — per-expiry IV (term variant).
- `surface?: IVSurfaceCell[]` — strike × expiry → IV cells (surface variant).
- `width`, `height`, `strokeWidth` (term variant).
- `colorStops?: { below, mid, above }` — Tailwind `text-*` tokens for the
  surface divergent scale. @default `{ below: "text-negative", mid:
  "text-muted-foreground", above: "text-positive" }`.
- `className?: string`.

## Dependencies
- No charting library.

## Styling Decisions
- Term variant mirrors `Sparkline` — polyline + dots, `currentColor` stroke.
- Surface variant uses divergent cell opacity (the further from the mid IV,
  the more saturated) so a volatility smile is visible without axes.
- Surface opacity normalization uses the **per-side half-range** —
  `c.iv >= mid ? (ivMax - mid) : (mid - ivMin)` — so the high and low sides
  are symmetric around `mid` (a value at `ivMax` and a value at `ivMin` both
  render at full saturation). Previously both sides were normalized by the
  *larger* of the two half-ranges, which muted extremes on the shorter side.
- `colorStops.mid` is honored: cells whose normalized distance from `mid` is
  within `MID_TOLERANCE = 0.1` of the relevant half-range receive the `mid`
  tone, giving a thin neutral band around the median IV. The default
  `text-muted-foreground` therefore is no longer dead weight.
- Surface is capped at ≤ ~100 cells per the roadmap allowance for an in-UI
  decorative heatmap. For full surfaced IV grids with axes/crosshair, use
  `@agentix/charts` (planned). Exceeding the limit triggers a one-time
  `console.warn` in dev; rendering continues unchanged.

## Maintenance Notes
- Both variants gracefully handle empty data with a placeholder mid-line.
- The surface variant deduplicates strikes + expiries via `Set` so consumers
  can pass an unsorted flat list.
- Both variants return the same outer `<svg role="img">` wrapper with an
  `aria-label` (overridable via the `aria-label` prop). Default labels:
  - term: `"IV term structure over N expiries"` (singular/plural-aware).
  - surface: `"IV surface, N strikes × M expiries"` (singular/plural-aware).
  - empty term / surface: `"empty IV term structure"` / `"empty IV surface"`.
- Surface `rect` width/height use `cellW + 0.5` / `cellH + 0.5` user units to
  avoid hairline gaps between adjacent cells under
  `preserveAspectRatio="none"`. The +0.5 is in viewBox units, not px, so it
  scales with the chart; at typical viewBox sizes (200×80 / 280×160) it is
  sub-pixel and does not visibly distort cells.
- The >100-cell `console.warn` is guarded by `typeof console !== "undefined"`
  and `console.warn` truthiness so it is SSR-safe.