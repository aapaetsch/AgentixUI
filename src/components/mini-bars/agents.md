# MiniBars

A tiny one-row SVG histogram — same visual weight as a `Spinner`. Pure inline SVG, no deps.
Supports divergent bars around a proportional zero line when `positiveColor` and
`negativeColor` are both supplied.

## Props
- `data: number[]` (required, length 1..N) — the numeric series.
- `width?: number = 100` — SVG viewBox width.
- `height?: number = 16` — SVG viewBox height.
- `gap?: number = 2` — gap between bars in viewBox units.
- `color?: string = "currentColor"` — default bar color.
- `positiveColor?: string` — when both this and `negativeColor` are set, bars ≥0 use this.
- `negativeColor?: string` — bars <0 use this when `positiveColor` is also set.
- `min?: number` — explicit domain min (derived when omitted).
- `max?: number` — explicit domain max (derived when omitted).
- `className?: string` — merged last via `cn()`.
- `...React.SVGAttributes<SVGSVGElement>` — spread onto the `<svg>` element.

Exports: `MiniBars`, `MiniBarsProps`, `miniBarsContainerVariants`.

## Dependencies
- `class-variance-authority` — container cva (kept for consistency with siblings).
- `../../lib/utils` — `cn()`.

No runtime charting dependency.

## Styling Decisions
- `inline-block` + `align-middle`: matches the inline-readout usage pattern.
- `preserveAspectRatio="none"`: stretches to fill its container.
- Domain auto-anchors to zero on the relevant side (min→0 for all-positive data,
  max→0 for all-negative data) so bars always reference a real zero line.
- Zero line sits at the proportional position between `min` and `max`, enabling
  divergent bars (positive upward, negative downward) without extra config.
- When `positiveColor` and `negativeColor` are both supplied, bars are tinted
  per sign; otherwise `color` is used uniformly.
- Minimal corner rounding (`rx = min(1, width/4)`) keeps bars crisp without
  looking like pills.

## Maintenance Notes
- All-zero data falls back to a 1-unit-padded domain so the bars are still
  visible at a minimal height.
- Empty `data` (`[]`) renders a faint baseline so the element is non-zero sized.
- `gap` is clamped so very dense data (e.g. 50 bars) always produces bars at
  least 0.5 viewBox units wide.