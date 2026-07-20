# SegmentedProgress

A segmented bar for `@agentix/ui`. Sibling of `LinearProgress`.

Renders a horizontal or vertical bar divided into proportional labeled
segments, each with its own value and color. Useful for portfolio
composition, capacity meters, allocation breakdowns, etc.

## Installation / Import

```ts
import { SegmentedProgress, type Segment } from "@agentix/ui";
```

## Usage

```tsx
<SegmentedProgress
  segments={[
    { value: 60, label: "Equities" },
    { value: 30, label: "Fixed Income" },
    { value: 10, label: "Cash" },
  ]}
/>

{/* Vertical, with remainder, with values */}
<SegmentedProgress
  segments={segments}
  orientation="vertical"
  max={120}
  showValues
/>
```

## Props

| Prop           | Type                                   | Default | Description                                  |
| -------------- | -------------------------------------- | ------- | ------------------------------------------- |
| `segments`     | `Segment[]`                            | —       | Required. Each `{ value, color?, label? }`. |
| `orientation`  | `"horizontal" \| "vertical"`           | `"horizontal"` | Bar orientation.                    |
| `size`         | `"xs" \| "sm" \| "md"`                 | `"sm"`  | Bar thickness (h-1 / h-2 / h-3 etc.).       |
| `rounded`      | `boolean`                              | `true`  | Round the outer bar corners.                 |
| `showValues`   | `boolean`                              | `false` | Show colored value labels beside the bar.   |
| `max`          | `number`                              | sum     | Override total; adds muted remainder.       |
| `gap`          | `number`                               | `0`     | Pixel gap between segments.                  |

### Segment

| Field   | Type     | Notes                                            |
| ------- | -------- | ------------------------------------------------ |
| `value` | `number` | Magnitude. Proportions use `value / total`.       |
| `color` | `string` | Optional CSS color. Falls back to chart palette.  |
| `label` | `string` | Optional label shown with `showValues`.           |

See `agents.md` for full architectural notes.