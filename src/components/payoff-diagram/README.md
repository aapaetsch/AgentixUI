# PayoffDiagram

Inline-SVG hockey-stick payoff curve at option expiry. Drop-in wherever you
need to visualize the P&L profile of a multi-leg position. Composes cleanly
with `BreakevenBadges` and the `PayoffBundleCard` template.

## Usage

```tsx
const points = computePayoffAtExpiry(legs, priceGrid(legs, 400));
<PayoffDiagram points={points} spotPrice={400} breakevens={[412.5]} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `points` | `PayoffPoint[]` | — | Sorted ascending by price. |
| `width` | `number` | `240` | viewBox width. |
| `height` | `number` | `120` | viewBox height. |
| `strokeWidth` | `number` | `1.5` | Line stroke width. |
| `positiveColor` | `string` | `currentColor` | Profit color. |
| `negativeColor` | `string` | `currentColor` | Loss color. |
| `color` | `string` | — | Override (ignores sign coloring). |
| `fill` | `boolean` | `true` | Gradient fill above/below zero. |
| `variant` | `"line" \| "area"` | `"area"` | Visual style. |
| `spotPrice` | `number` | — | Vertical dashed marker. |
| `currentPnL` | `number` | — | P&L dot at the spot. |
| `breakevens` | `number[]` | — | Dots on the zero line. |
| `showZeroLine` | `boolean` | `true` | Draw the zero baseline. |
| `className` | `string` | — | Merged last via `cn()`. |

## Behavior notes

- **`points` must be sorted ascending by `price`.** Unsorted input produces a
  scrambled polyline; in non-production builds the component emits a
  `console.warn` (it does not silently sort, so consumer bugs stay visible).
  The helpers in `lib/finance-utils` (`priceGrid`, `computePayoffAtExpiry`)
  already return sorted output.
- **Single point** renders as a small crosshair (a lone `M` path segment would
  otherwise be invisible).
- **Empty `points`** renders a mid-height dashed placeholder line.
- **`preserveAspectRatio="none"`** means the chart stretches to fill its box.
  All stroked elements use `vectorEffect="non-scaling-stroke"`, and all markers
  (breakevens, current P&L, single point) are drawn as short line ticks /
  crosshairs rather than `<circle>` elements, so they keep their shape under
  non-uniform stretch.
- The default `aria-label` summarizes the curve (`spot`, breakeven count);
  override it via the `aria-label` prop.

## Stories

`LongCall`, `ShortPut`, `Iron Condor`, `Empty`, `SinglePoint`,
`UnsortedPoints` (dev warning), `AllPositive`, `AllNegative`, `LineVariant`,
`FillDisabled`.