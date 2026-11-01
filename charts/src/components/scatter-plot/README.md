# ScatterPlot

Numeric x/y observations with optional bubble sizes.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { ScatterPlot } from "aapaetsch-charts";

export function Example() {
  return (
    <ScatterPlot
      aria-label="Risk versus return"
      xLabel="Volatility"
      yLabel="Return"
      series={[{ id: "funds", label: "Funds", data: [{ x: 12, y: 8, size: 40 }, { x: 18, y: 11, size: 70 }] }]}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `series` | `ScatterSeries[]` | Required; each has id, data, optional label/color |
| `height` | `number` | 320 CSS px |
| `xLabel` | `string` | Optional; axis defaults to X |
| `yLabel` | `string` | Optional; axis defaults to Y |
| `showGrid` | `boolean` | true |
| `showLegend` | `boolean` | series.length > 1 |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Each ScatterDatum requires finite x and y, with optional numeric size. Keep units consistent across series and IDs unique. Bubble size uses a 40–360 rendering range. Tooltip rendering is built in; there is no showTooltip prop.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
