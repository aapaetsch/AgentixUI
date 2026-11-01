# RiskChart

Portfolio factor values with optional limit profile.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { RiskChart } from "aapaetsch-charts";

export function Example() {
  return (
    <RiskChart
      aria-label="Portfolio risk against limits"
      data={[{ factor: "Market", portfolio: 60, limit: 80 }, { factor: "Credit", portfolio: 30, limit: 50 }, { factor: "Liquidity", portfolio: 40, limit: 60 }]}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `data` | `RiskFactor[]` | Required factor/portfolio rows; optional numeric limit |
| `height` | `number` | 320 CSS px |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Normalize factors to a common scale before rendering. A limit series appears when any row has a non-null limit; supply complete limits if all factors need comparison. Values are not exposures, VaR, or risk limits calculated by the component.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
