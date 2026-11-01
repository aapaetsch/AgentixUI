# ReturnsChart

Signed period returns with semantic positive/negative bars.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { ReturnsChart } from "aapaetsch-charts";

export function Example() {
  return (
    <ReturnsChart
      aria-label="Monthly returns in percent"
      data={[{ period: "Jan", value: 2.5 }, { period: "Feb", value: -1.2 }]}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `data` | `ReturnPoint[]` | Required period/value rows |
| `height` | `number` | 288 CSS px |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Values use percentage units: 2.5 means 2.5%, not 250%. Sort periods upstream. The chart formats axis/tooltip values as percentages and does not compute returns from prices.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
