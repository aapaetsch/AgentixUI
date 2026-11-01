# EquityCurve

Strategy equity with an optional benchmark, using shared line-chart chrome.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { EquityCurve } from "aapaetsch-charts";

export function Example() {
  return (
    <EquityCurve
      aria-label="Strategy and benchmark equity"
      data={[{ date: "Jan", equity: 10000, benchmark: 10000 }, { date: "Feb", equity: 10500, benchmark: 10200 }]}
      xKey="date"
      benchmarkKey="benchmark"
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `data` | `ChartDatum[]` | Required ordered records |
| `xKey` | `string` | Required time/category property |
| `equityKey` | `string` | equity |
| `benchmarkKey` | `string` | Optional; omission hides benchmark |
| `height` | `number` | 288 CSS px |
| `valueFormatter` | `(value: number) => string` | Optional y-axis/tooltip formatter |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Both series must share a currency or normalized basis. The component does not normalize values, align benchmark dates, or compute returns. Sort rows upstream. Null values connect as in LineChart.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
