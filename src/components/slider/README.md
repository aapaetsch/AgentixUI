# Basic Slider

A slider component for selecting values from a range following Material Design 3 specifications.

## Installation

The basic slider API is available from the unified package as `BasicSlider`.

## Features

- **Single or Range Selection**: Support for one or two thumbs
- **Three Sizes**: xs (16dp), sm (24dp), md (40dp) track heights
- **Bar Handle**: MD3 vertical pill shape with press animation
- **Orientations**: Horizontal and vertical
- **Gap Styling**: MD3-compliant gap between handle and track
- **Accessibility**: Full keyboard navigation and ARIA support

## Usage

### Basic Usage

```tsx
import { Slider } from "@agentix/ui";

// Single value slider
<Slider defaultValue={[50]} />

// Range slider
<Slider defaultValue={[25, 75]} />
```

### Size Variants

```tsx
// Extra small (16dp track)
<Slider defaultValue={[50]} size="xs" />

// Small (24dp track)
<Slider defaultValue={[50]} size="sm" />

// Medium (40dp track)
<Slider defaultValue={[50]} size="md" />
```

### Vertical Orientation

```tsx
<Slider
  defaultValue={[50]}
  orientation="vertical"
  className="h-48"
/>
```

### Controlled Component

```tsx
const [value, setValue] = useState([50]);

<Slider
  value={value}
  onValueChange={setValue}
  onValueCommit={(v) => console.log('Final value:', v)}
/>
```

### Discrete Steps

```tsx
<Slider
  defaultValue={[50]}
  step={10}
  min={0}
  max={100}
/>
```

### With Custom Styling

```tsx
<Slider
  defaultValue={[50]}
  trackClassName="bg-gray-200"
  rangeClassName="bg-blue-500"
  thumbClassName="bg-blue-600"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `number[]` | `[0]` | Initial value(s) for uncontrolled mode |
| `value` | `number[]` | - | Controlled value(s) |
| `onValueChange` | `(value: number[]) => void` | - | Callback when value changes |
| `onValueCommit` | `(value: number[]) => void` | - | Callback when interaction ends |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `disabled` | `boolean` | `false` | Disabled state |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Slider orientation |
| `size` | `"xs" \| "sm" \| "md"` | `"xs"` | Size variant |
| `trackClassName` | `string` | - | Additional track styles |
| `rangeClassName` | `string` | - | Additional range styles |
| `thumbClassName` | `string` | - | Additional thumb styles |

## Accessibility

- Full keyboard support (Arrow keys, Home, End, Page Up/Down)
- ARIA slider role with proper value announcements
- Focus indicators
- Touch-friendly hit targets

## Full Slider API

The unified package also exports `Slider` for the full feature set:

- **Handle Shapes**: Circular and knobless options
- **Larger Sizes**: lg (56dp) and xl (96dp) tracks
- **Value Indicators**: Customizable tooltips showing current value
- **Stop Indicators**: Visual dots for discrete step values
- **Inset Icons**: Icons within the track (md, lg, xl sizes)
- **State Layer**: Hover effect for circular handles

## Related Components

- `Slider` - Extended slider with lg/xl sizes, indicators, and richer handle options
- [Input Incrementor](../input-incrementor/README.md) - Numeric input with increment/decrement buttons

