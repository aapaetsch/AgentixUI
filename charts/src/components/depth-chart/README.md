# DepthChart

Cumulative bid and ask sizes across supplied order-book levels.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { DepthChart } from "aapaetsch-charts";

export function Example() {
  return (
    <DepthChart
      aria-label="Order book depth"
      bids={[{ price: 99, size: 10 }, { price: 98, size: 20 }]}
      asks={[{ price: 101, size: 12 }, { price: 102, size: 18 }]}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `bids` | `DepthLevel[]` | Required bid price/size levels |
| `asks` | `DepthLevel[]` | Required ask price/size levels |
| `height` | `number` | 320 CSS px |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Provide raw per-level sizes, not already cumulative values. Bids accumulate from highest price downward; asks from lowest upward. The exported cumulativeDepth(levels, descending=false) returns a sorted copy with accumulated sizes. Consolidate duplicate prices and use nonnegative finite sizes upstream. The horizontal axis uses shared categorical area-chart geometry rather than a continuous numeric scale.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
