# DonutChart

Named proportions with optional center text.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { DonutChart } from "aapaetsch-charts";

export function Example() {
  return (
    <DonutChart
      aria-label="Portfolio allocation"
      data={[{ name: "Equities", value: 70 }, { name: "Bonds", value: 30 }]}
      centerLabel="Allocation"
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `data` | `DonutDatum[]` | Required; name, value, optional color |
| `height` | `number` | 288 CSS px |
| `innerRadius` | `number or string` | 58%; Recharts numeric/percentage radius |
| `centerLabel` | `ReactNode` | Optional SVG text content |
| `showLegend` | `boolean` | true |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Use unique names and finite nonnegative values with a positive total. Values are weights; they need not sum to 100. Aggregate very small categories upstream. Colors default to the shared palette. Center content is placed inside SVG text, so use text-compatible content.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
