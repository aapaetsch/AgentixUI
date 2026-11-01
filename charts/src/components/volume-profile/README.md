# VolumeProfile

Horizontal stacked buy/sell volume at supplied price levels.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { VolumeProfile } from "aapaetsch-charts";

export function Example() {
  return (
    <VolumeProfile
      aria-label="Volume by price"
      data={[{ price: 100, buyVolume: 120, sellVolume: 80 }, { price: 101, buyVolume: 90, sellVolume: 110 }]}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `data` | `VolumeProfileLevel[]` | Required price/buyVolume/sellVolume rows |
| `height` | `number` | 360 CSS px |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Price is a string or number. Supply consistently ordered price bins and nonnegative finite volumes. This component does not infer aggressor direction, bin trades, or estimate volume from OHLCV. Positive/negative theme colors distinguish the two supplied measures.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
