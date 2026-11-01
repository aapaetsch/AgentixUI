# BarChart

Grouped or stacked bars for category comparisons.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { BarChart } from "aapaetsch-charts";

export function Example() {
  return (
    <BarChart
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
| `stacked` | `boolean` | false; true shares a stack across series |

## Data and behavior

Supply finite numeric values and sort categories upstream. Stacking assumes compatible units.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
