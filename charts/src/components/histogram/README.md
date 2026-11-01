# Histogram

Distribution of raw observations, binned into equal-width intervals.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { Histogram } from "aapaetsch-charts";

export function Example() {
  return (
    <Histogram
      aria-label="Daily returns distribution"
      values={[-2, -1, -0.5, 0, 0.5, 1, 1.5, 2]}
      bins={4}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `values` | `number[]` | Required finite observations |
| `bins` | `number` | 10; supply a positive integer |
| `height` | `number` | 288 CSS px |
| `color` | `string` | hsl(var(--chart-1)) |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Filter NaN and infinities before rendering. Empty input or bins below one produces no bins. Identical observations use unit-width bins. The maximum observation enters the final bin. The exported binHistogramValues(values, binCount) helper returns start, end, count, and label for each bin.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
