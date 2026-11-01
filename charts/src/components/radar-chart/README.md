# RadarChart

Multiple comparable factor profiles on radial axes.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { RadarChart } from "aapaetsch-charts";

export function Example() {
  return (
    <RadarChart
      aria-label="Portfolio factor scores"
      data={[{ factor: "Value", strategy: 70, benchmark: 50 }, { factor: "Quality", strategy: 60, benchmark: 55 }, { factor: "Growth", strategy: 40, benchmark: 65 }]}
      categoryKey="factor"
      series={[{ dataKey: "strategy" }, { dataKey: "benchmark" }]}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `data` | `ChartDatum[]` | Required category/factor rows |
| `categoryKey` | `string` | Required category property |
| `series` | `ChartSeries[]` | Required dataKey, optional label/color |
| `height` | `number` | 320 CSS px |
| `showLegend` | `boolean` | series.length > 1 |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Normalize axes to comparable units upstream. Use a small category count. ChartSeries.hide is not applied by this renderer: filter out hidden series before passing them. Tooltips are built in.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
