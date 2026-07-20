# MiniBars

A tiny one-row SVG histogram. Pure inline SVG, no dependencies. Supports divergent bars
around a proportional zero line.

## Usage

```tsx
import { MiniBars } from "@agentix/ui";

<MiniBars data={[1, -2, 3, -1, 2]} positiveColor="#22c55e" negativeColor="#ef4444" />
```

## Props

| Prop            | Type       | Default       | Description |
|-----------------|------------|---------------|-------------|
| `data`          | `number[]` | — (required)  | Series to visualize (1..N values). |
| `width`         | `number`   | `100`         | SVG viewBox width. |
| `height`        | `number`   | `16`          | SVG viewBox height. |
| `gap`           | `number`   | `2`           | Gap between bars (viewBox units). |
| `color`         | `string`   | `"currentColor"` | Default bar color. |
| `positiveColor` | `string`   | —             | Bars ≥0 color (used when both pos/neg set). |
| `negativeColor` | `string`   | —             | Bars <0 color (used when both pos/neg set). |
| `min`           | `number`   | derived       | Explicit domain min. |
| `max`           | `number`   | derived       | Explicit domain max. |
| `className`     | `string`   | —             | Merged last via `cn()`. |

Also accepts all `React.SVGAttributes<SVGSVGElement>` spread onto the `<svg>`.

## Examples

```tsx
<MiniBars data={[2, 4, 3, 6, 5, 8, 7]} />

<div className="text-positive">
  <MiniBars data={[1, -2, 3, -1, 2, 4, -3]} positiveColor="currentColor" negativeColor="#ef4444" />
</div>
```