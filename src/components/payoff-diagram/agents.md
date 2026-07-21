# PayoffDiagram

Inline-SVG at-expiry payoff curve.

## Props
- `points: PayoffPoint[]` — sorted ascending by price.
- `width`, `height`, `strokeWidth`, `color?` — SVG geometry.
- `positiveColor?`, `negativeColor?` — @default `currentColor`.
- `variant?: "line" | "area"` — @default `"area"`.
- `fill?: boolean` — gradient fill above/below zero line. @default `true`.
- `spotPrice?`, `currentPnL?` — spot marker + P&L dot.
- `breakevens?: number[]` — dots on the zero line.
- `showZeroLine?: boolean` — @default `true`.
- `showHoverDetails?: boolean` — opt-in tracked point and tooltip. @default `false`.
- `formatHoverPrice?`, `formatHoverValue?`, `onHoverPointChange?` — hover customization.
- `className?: string`.

## Dependencies
- `lib/finance-types` `PayoffPoint`. No charting library.

## Styling Decisions
- Mirrors `Sparkline`: forwardRef SVG, `React.useId()` gradient ids,
  `preserveAspectRatio="none"`, `cn(containerVariants(), className)` last arg.
- Profit/loss regions separated via clip-paths against the zero baseline so a
  single path can be reused — keeps the implementation small.
- `vectorEffect="non-scaling-stroke"` is applied to **every** stroked element
  (main polyline, zero baseline, spot vertical marker, breakeven ticks, and
  the current-PnL crosshair) so strokes stay crisp under Tailwind-driven
  non-uniform stretch.
- Markers (breakevens, single point, current P&L) are rendered as short line
  ticks / crosshairs rather than `<circle>` elements. With
  `preserveAspectRatio="none"` a `<circle>` distorts into an ellipse; line
  ticks preserve their geometry regardless of stretch.

## Maintenance Notes
- `computeDomain` forces the zero baseline into the value domain so the P/L
  zero crossing is always visible.
- `points` must be sorted ascending by `price`; mismatched order yields a
  scrambled polyline. In non-production builds `warnIfUnsorted` emits a
  `console.warn` — the component does **not** silently sort (that would mask
  consumer bugs). The helpers in `lib/finance-utils` already return sorted
  output.
- **Single point**: rendered as a small crosshair at `(width/2, yFor(value))`
  because a lone `M` segment is a zero-length path with no visible output.
- **Empty points**: renders a mid-height dashed placeholder line.
- Spot/breakeven markers outside the price domain are silently dropped.
- Hover tracking selects the closest supplied point; it does not interpolate payoff values.
- The `aria-label` defaults to
  `"payoff at expiry, spot {spotPrice}, {n} breakevens"` (segments omitted
  when the corresponding prop is unset); consumers can override via the
  `aria-label` prop.
