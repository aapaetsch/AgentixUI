# Sparkline

A tiny inline SVG line/area/bar chart. No axes, no scales, no tooltip, no legend — just a
single `<path>` (or a row of `<rect>`s for the bar variant). Designed to be dropped inside a
tile, table cell, or inline next to a numeric label, and is drop-in compatible with the
`sparklineRenderSlot` prop of `StatTile`.

## Installation / Usage

```tsx
import { Sparkline } from "aapaetsch-ui-kit";

<Sparkline data={[1, 2, 3, 2, 4]} />

// Inherit a Tailwind text color:
<span className="text-positive">
  <Sparkline data={[1, 2, 3]} fill />
</span>

// Bars:
<Sparkline data={[3, 1, 4, 1, 5, 9, 2, 6]} variant="bar" />
```

## Props

| Prop         | Type                            | Default       | Description |
|--------------|---------------------------------|---------------|-------------|
| `data`       | `number[]`                      | — (required)  | Series to visualize (≥1 point). |
| `width`      | `number`                        | `100`         | SVG viewBox width. |
| `height`     | `number`                        | `30`          | SVG viewBox height. |
| `strokeWidth`| `number`                        | `1.5`         | Stroke width (viewBox units). |
| `color`      | `string`                        | `"currentColor"` | CSS color or `currentColor` to inherit a Tailwind text color. |
| `fill`       | `boolean`                       | `false`       | Render an area fill. Alias for `variant="area"`. |
| `variant`    | `"line" \| "bar" \| "area"`     | `"line"`      | Visual style. |
| `min`        | `number`                        | derived       | Explicit domain min. |
| `max`        | `number`                        | derived       | Explicit domain max. |
| `gap`        | `number`                        | `0`           | Sibling spacing hint for `StatTile` composition. |
| `className`  | `string`                        | —             | Merged last via `cn()`. |

Also accepts all `React.SVGAttributes<SVGSVGElement>` (e.g. `aria-label`) spread onto the `<svg>`.

## Examples

### Increasing line
```tsx
<Sparkline data={[1, 2, 3, 4, 5, 6, 7]} />
```

### Area with a positive color
```tsx
<span className="text-positive">
  <Sparkline data={[2, 3, 2, 4, 5, 4, 6]} fill />
</span>
```

### Bars
```tsx
<Sparkline data={[3, 1, 4, 1, 5, 9, 2, 6]} variant="bar" />
```