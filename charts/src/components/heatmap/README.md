# Heatmap

Categorical x/y cells whose opacity represents the supplied value.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { Heatmap } from "aapaetsch-charts";

export function Example() {
  return (
    <Heatmap
      aria-label="Activity by day and hour"
      data={[{ x: "Mon", y: "09:00", value: 12 }, { x: "Tue", y: "09:00", value: 20 }]}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `data` | `HeatmapDatum[]` | Required x/y/value cells |
| `height` | `number` | 320 CSS px |
| `color` | `string` | hsl(var(--chart-1)) |
| `valueFormatter` | `(value: number) => string` | Optional tooltip formatting |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Each cell has x and y (string or number) and a finite numeric value. Supply every pair for a complete matrix. A single hue varies opacity relative to the data minimum/maximum; equal values use full opacity. Cells use fixed 30 CSS-pixel squares, so dense matrices need a suitable chart size.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
