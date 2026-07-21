# IVChart

Inline-SVG implied-volatility micro visualizations. Two variants in one
component:

- `variant="term"` — polyline of IV per expiry (the term structure).
- `variant="surface"` — divergent-color strike × expiry heatmap (≤ ~100 cells).

No axes, ticks, crosshair, or legend — full versions remain planned for
`@agentix/charts`.

## Behavior notes

- Both variants render an `<svg role="img">` with a descriptive default
  `aria-label` (overridable via the `aria-label` prop):
  - term: `"IV term structure over N expiries"`.
  - surface: `"IV surface, N strikes × M expiries"`.
- Surface opacity is normalized per-side around `mid` so high and low extremes
  are symmetric (a value at `ivMax` and a value at `ivMin` both saturate fully).
- `colorStops.mid` is used for cells whose IV is within ~10% of the relevant
  half-range from `mid`, giving a thin neutral band around the median.
- Empty `term` / `surface` render a placeholder mid-line (no crash).
- Passing `surface.length > 100` triggers a one-time dev `console.warn`;
  rendering continues unchanged.

## Usage

```tsx
<IVChart variant="term" term={termPoints} />
<IVChart variant="surface" surface={cells} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"term" \| "surface"` | `"term"` | Visual variant. |
| `term` | `IVTermPoint[]` | — | Per-expiry IV points. |
| `surface` | `IVSurfaceCell[]` | — | Strike × expiry IV cells. |
| `width` | `number` | `200` | viewBox width. |
| `height` | `number` | `80` | viewBox height. |
| `strokeWidth` | `number` | `1.5` | Stroke width (term only). |
| `colorStops` | `{ below, mid, above }` | semantic | Tailwind `text-*` tokens for divergent surface coloring (`mid` is used for cells near the median). |
| `className` | `string` | — | Merged last via `cn()`. |

## Exported types

- `IVChartVariant`, `IVTermPoint`, `IVSurfaceCell`.