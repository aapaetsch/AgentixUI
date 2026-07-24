# Gauge

A radial dial / gauge primitive for `@agentix/ui`. Sibling of `Progress`.

Renders a pure inline SVG dial with:
- a background (track) arc,
- optional colored threshold zones on the track,
- an animated needle that tweens from the previous value to the new target,
- an auto-formatted or custom centered label.

## Installation / Import

```ts
import { Gauge } from "@agentix/ui";
```

## Usage

```tsx
<Gauge value={72} />

<Gauge value={72} variant="semicircle" color="hsl(var(--positive))" />

<Gauge
  value={45}
  variant="full"
  thresholds={[
    { value: 30, color: "#ef4444" },
    { value: 70, color: "#f59e0b" },
    { value: 100, color: "#22c55e" },
  ]}
/>
```

## Props

| Prop           | Type                                              | Default         | Description                                         |
| -------------- | ------------------------------------------------- | --------------- | -------------------------------------------------- |
| `value`        | `number`                                          | —               | Current value (required).                          |
| `min`          | `number`                                          | `0`             | Minimum value.                                     |
| `max`          | `number`                                          | `100`           | Maximum value.                                     |
| `variant`      | `"full" \| "semicircle"`                          | `"full"`        | Arc sweep.                                         |
| `size`         | `"sm" \| "md" \| "lg"`                            | `"md"`          | viewBox 80 / 120 / 160.                            |
| `thresholds`   | `{ value: number; color: string }[]`             | —               | Optional colored zones on the track.              |
| `color`        | `string`                                          | `"currentColor"`| Active arc + needle color (CSS color).            |
| `trackColor`   | `string`                                          | `"hsl(var(--muted))"` | Track arc color.                              |
| `label`        | `React.ReactNode`                                | auto-formatted  | Centered label.                                    |
| `valueFormat`  | `"number" \| "percent"`                          | `"number"`      | Auto-label format when `label` omitted.          |
| `animate`      | `boolean`                                         | `true`          | Tween needle to new value.                         |
| `needleLength` | `number`                                          | `0.78`          | Needle length as fraction of radius.              |
| `strokeWidth`  | `number`                                          | `8`             | Arc stroke width.                                  |

See `agents.md` for full architectural notes.