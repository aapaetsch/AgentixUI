# CorrelationMatrix

Supplied pairwise values displayed through Heatmap.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { CorrelationMatrix } from "aapaetsch-charts";

export function Example() {
  return (
    <CorrelationMatrix
      aria-label="Asset correlations"
      labels={["Equities", "Bonds"]}
      values={[[1, -0.2], [-0.2, 1]]}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `labels` | `string[]` | Required shared row/column order |
| `values` | `number[][]` | Required matrix in label order |
| `height` | `number` | 320 CSS px |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Provide a square finite matrix, typically symmetric with ones on the diagonal and values between −1 and 1. Missing entries default to zero rather than appearing unavailable; validate completeness upstream. correlationCells(labels, values) exports the conversion helper. Opacity uses one hue scaled to the supplied range, not a diverging negative/positive palette; tooltips show two decimals.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
