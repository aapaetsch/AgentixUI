# AreaChart

Overlapping or stacked areas for comparable numeric series.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { AreaChart } from "aapaetsch-charts";

export function Example() {
  return (
    <AreaChart
      aria-label="Revenue by channel"
      data={[{ month: "Jan", online: 42, retail: 20 }, { month: "Feb", online: 58, retail: 24 }]}
      xKey="month"
      series={[{ dataKey: "online" }, { dataKey: "retail" }]}
      stacked
    />
  );
}
```

## Props

All [shared Cartesian props](../../../README.md#shared-cartesian-api) apply, including required data, xKey, series, and aria-label; height defaults to 288 CSS px. Additional props:

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `stacked` | `boolean` | false; true stacks all series |

## Data and behavior

Stack only compatible units that form a meaningful whole. Input order is preserved and null observations are connected.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
