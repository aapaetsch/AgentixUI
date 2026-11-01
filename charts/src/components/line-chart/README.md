# LineChart

Multi-series lines for ordered time or category observations.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { LineChart } from "aapaetsch-charts";

export function Example() {
  return (
    <LineChart
      aria-label="Monthly revenue"
      data={[{ month: "Jan", revenue: 42 }, { month: "Feb", revenue: 58 }]}
      xKey="month"
      series={[{ dataKey: "revenue", label: "Revenue" }]}
      showDots
    />
  );
}
```

## Props

All [shared Cartesian props](../../../README.md#shared-cartesian-api) apply, including required data, xKey, series, and aria-label; height defaults to 288 CSS px. Additional props:

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `showDots` | `boolean` | false; mark each observation |

## Data and behavior

Rows retain input order. Numeric series values may be null; lines connect across nulls. Sort time series upstream and provide a table when exact values matter.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
