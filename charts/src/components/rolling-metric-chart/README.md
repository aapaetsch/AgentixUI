# RollingMetricChart

Display a rolling statistic already computed by your application.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { RollingMetricChart } from "aapaetsch-charts";

export function Example() {
  return (
    <RollingMetricChart
      aria-label="Rolling Sharpe ratio"
      data={[{ date: "Jan", sharpe: 1.2 }, { date: "Feb", sharpe: 1.5 }]}
      xKey="date"
      metricKey="sharpe"
      label="Sharpe (30 days)"
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `data` | `ChartDatum[]` | Required ordered rows |
| `xKey` | `string` | Required time/category key |
| `metricKey` | `string` | Required numeric value key |
| `label` | `string` | Required series label |
| `height` | `number` | 288 CSS px |
| `color` | `string` | Optional; shared palette default |
| `valueFormatter` | `(value: number) => string` | Optional y-axis/tooltip formatter |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Compute windowing, warm-up rules, annualization, and missing-data policy upstream. Name the metric/window in the label. Null values connect as in LineChart; this component has no rolling-window calculation.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
