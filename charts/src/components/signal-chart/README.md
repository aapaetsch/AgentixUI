# SignalChart

Price line with host-supplied buy/sell annotations.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { SignalChart } from "aapaetsch-charts";

export function Example() {
  return (
    <SignalChart
      aria-label="Price with strategy signals"
      data={[{ time: "Jan", price: 100, signal: "buy" }, { time: "Feb", price: 110, signal: "sell" }]}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `data` | `SignalPoint[]` | Required time/price with optional buy or sell signal |
| `height` | `number` | 320 CSS px |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Sort records by time and use finite prices. Signals render at each marked row's exact time/price, using semantic colors. The component neither generates signals nor executes trades. Provide textual signal details when the markers carry essential meaning.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
