# Treemap

Hierarchical proportions represented by area.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { Treemap } from "aapaetsch-charts";

export function Example() {
  return (
    <Treemap
      aria-label="Sector allocation"
      data={[{ name: "Technology", children: [{ name: "Software", value: 40 }, { name: "Hardware", value: 20 }] }, { name: "Healthcare", value: 40 }]}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `data` | `TreemapDatum[]` | Required named nodes with optional value/children |
| `height` | `number` | 320 CSS px |
| `aria-label` | `string` | Required accessible chart name |
| `className` | `string` | Optional root classes merged last |

## Data and behavior

Supply finite nonnegative leaf values in consistent units. Nodes accept recursive children. Although TreemapDatum allows color metadata, this component currently renders the shared chart-1 fill; per-node color is not applied.

## Accessibility and examples

Provide a meaningful aria-label and a nearby table or summary for exact-value access. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
