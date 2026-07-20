# Sparkline

A tiny inline SVG line/area/bar chart — single `<path>`, no axes, no scales, no tooltip, no legend.
Designed to be drop-in compatible with the `sparklineRenderSlot` prop of `StatTile`.

## Props
- `data: number[]` (required, ≥1 point) — the numeric series to visualize.
- `width?: number = 100` — SVG viewBox width (rendered element sized via `width`/`height` attrs).
- `height?: number = 30` — SVG viewBox height.
- `strokeWidth?: number = 1.5` — stroke width in viewBox units.
- `color?: string = "currentColor"` — CSS color (or `currentColor` to inherit Tailwind text color).
- `fill?: boolean = false` — render an area fill under the line (alias for `variant="area"`).
- `variant?: "line" | "bar" | "area"` — visual style. `area` = `line + fill`.
- `min?: number` — explicit domain min (derived from data when omitted).
- `max?: number` — explicit domain max (derived from data when omitted).
- `gap?: number = 0` — sibling spacing hint for composition inside `StatTile`.
- `className?: string` — merged last via `cn()`.
- `...React.SVGAttributes<SVGSVGElement>` — spread onto the `<svg>` element.

Exports: `Sparkline`, `SparklineProps`, `SparklineVariant`, `sparklineContainerVariants`.

## Dependencies
- `class-variance-authority` (for the container cva — kept for consistency with siblings).
- `../../lib/utils` — `cn()` (clsx + tailwind-merge).

No runtime charting dependency. Pure inline SVG.

## Styling Decisions
- `inline-block` + `align-middle`: matches the lightweight, inline usage pattern
  and is a drop-in for `StatTile`'s `sparklineRenderSlot`.
- `preserveAspectRatio="none"` + `vector-effect="non-scaling-stroke"`: the chart
  stretches to fill its container while the stroke stays crisp.
- `currentColor` default: lets the consumer drive the color via Tailwind text
  utilities like `text-positive` / `text-negative` without a prop change.
- Area fill uses a per-instance linear gradient (`useId()`) from `color` @ 0.2 → 0
  alpha so multiple sparklines on a page don't share gradient ids.
- Flat data (single value, or all-equal) is padded symmetrically so the line
  doesn't collapse to a zero-height slice.
- `variant="bar"` leaves a 10% slot gap between bars.

## Maintenance Notes
- Empty `data` (`[]`) renders a faint baseline marker so the element is still
  non-zero sized — useful for skeletons/placeholder layouts.
- Single-point `data` renders a horizontal segment at the normalized midpoint.
- The gradient id is derived from `React.useId()` so it is stable across SSR/CSR
  and unique across instances; do not rename the prefix without regenerating ids.