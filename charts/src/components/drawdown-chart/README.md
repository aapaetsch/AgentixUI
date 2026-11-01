# DrawdownChart

Percentage decline from a running equity peak.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { DrawdownChart } from "aapaetsch-charts";

export function Example() {
  return (
    <DrawdownChart
      aria-label="Strategy drawdown"
      data={[{ time: "Jan", equity: 10000 }, { time: "Feb", equity: 9000 }, { time: "Mar", equity: 10500 }]}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `data` | `EquityPoint[]` | Required time/equity records |
| `height` | `number` | 288 CSS px |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

calculateDrawdown(data) returns rows with drawdown = (equity − running peak) / running peak × 100. The example's second row is −10%. A zero running peak yields zero; use a reviewed domain policy for zero/negative equity. Input order determines peaks: sort chronologically. The formatter already adds a percent sign.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
