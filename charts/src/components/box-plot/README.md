# BoxPlot

Distribution summaries from supplied quartiles; quartiles are not calculated by the chart.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { BoxPlot } from "aapaetsch-charts";

export function Example() {
  return (
    <BoxPlot
      aria-label="Latency distribution in milliseconds"
      data={[{ category: "API", min: 12, q1: 18, median: 25, q3: 40, max: 80 }]}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `data` | `BoxPlotDatum[]` | Required five-number summaries |
| `height` | `number` | 300 CSS px |
| `color` | `string` | hsl(var(--chart-1)) |
| `valueFormatter` | `(value: number) => string` | Optional median title formatter |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Each row contains category, min, q1, median, q3, max. Provide finite ordered values: min ≤ q1 ≤ median ≤ q3 ≤ max. The chart does not calculate outliers or quartiles. It renders SVG summary marks, not a keyboard-navigable Recharts series.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
