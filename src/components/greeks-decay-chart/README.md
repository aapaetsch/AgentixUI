# GreeksDecayChart

Mini inline-SVG chart showing how an option's Greeks evolve over remaining
days-to-expiry (DTE). Compact, no axes/legend chrome — the `Sparkline` of the
Greeks world.

## Usage

```tsx
<GreeksDecayChart
  days={[30, 20, 10, 5, 1]}
  delta={[0.5, 0.48, 0.42, 0.32, 0.18]}
  theta={[-1.2, -1.6, -2.4, -4, -8]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `days` | `number[]` | — | DTE axis, ascending. |
| `delta`/`gamma`/`theta`/`vega` | `number[]` | — | Per-Greek series aligned to `days`. |
| `greek` | `"all" \| "delta" \| ...` | `"all"` | Restrict to one Greek. |
| `width` | `number` | `200` | viewBox width. |
| `height` | `number` | `80` | viewBox height. |
| `strokeWidth` | `number` | `1.5` | Line stroke width. |
| `showLegend` | `boolean` | `true` | Show legend dots. |
| `className` | `string` | — | Merged last via `cn()`; applied to the outer `<div>`. |

## Notes

- **Length validation:** series whose `length !== days.length` are silently
  dropped (with a `console.warn` in non-production builds listing the dropped
  series).
- **Empty state:** when no visible series remain, a placeholder mid-line is
  drawn, mirroring `Sparkline`.
- **Single sample:** when `days.length === 1`, each visible series renders a
  centered dot. Per-series marker dots (`<circle r={1.5}>`) are drawn at every
  sample point for scannability.
- **Axis scale:** y is scaled as `((v - min) / span) * height`, so domain
  offsets are respected (important for theta/vega). A dashed zero baseline is
  drawn when the domain crosses zero.
- **Accessibility:** the `<svg>` uses `role="img"` with an `aria-label`
  enumerating the visible Greek letters and day count. Provide an explicit
  `aria-label` to override.