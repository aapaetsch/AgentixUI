# GreeksDecayChart

Inline-SVG mini line chart for Greek decay over DTE.

## Props
- `days: number[]` — DTE axis, ascending.
- `delta?`, `gamma?`, `theta?`, `vega?` — series arrays aligned to `days`.
- `greek?: "all" | "delta" | "gamma" | "theta" | "vega"` — @default `"all"`.
- `width`, `height`, `strokeWidth`.
- `showLegend?: boolean` — @default `true`.
- `className?: string`.

## Dependencies
- No charting library — pure inline SVG.

## Styling Decisions
- Per-Greek Tailwind text-color tokens (`text-primary`, `text-violet-500`,
  `text-amber-500`, `text-sky-500`) so light/dark modes stay consistent via
  `currentColor` strokes.
- Legend dots are tiny `size-1.5` so the chart stays compact (~80px tall).
- A zero baseline is drawn when the shared domain crosses zero (common for
  theta).

## Maintenance Notes
- Series whose length ≠ `days.length` are silently dropped — protects against
  mismatched arrays from upstream data adapters. In non-production builds a
  `console.warn` lists the dropped series and their lengths.
- Empty visible series renders a placeholder mid-line, mirroring `Sparkline`.
- Single-sample series (`days.length === 1`) are rendered as a centered dot
  per series (per-series `<circle r={1.5}>` markers are drawn at every sample
  point regardless, so single-day charts remain visible).
- The `yFor` scale uses `((v - min) / span) * height` (NOT `v / span`) so the
  domain offset is respected — important for theta (negative) and vega
  values that do not start at zero. The zero baseline (drawn when domain
  crosses zero) uses the same scale.
- The default `aria-label` enumerates the visible Greek letters and the day
  count, e.g. `greek decay chart: {Δ, Θ} over 7 days`. Supply an explicit
  `aria-label` to override.