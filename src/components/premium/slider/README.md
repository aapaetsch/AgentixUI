# Slider

A premium slider component for selecting values from a range, following Material Design 3 specifications with smooth animations and comprehensive customization options.

## Installation

The Slider component is part of the Premium tier and requires `@radix-ui/react-slider`:

```bash
npm install @radix-ui/react-slider
```

## Usage

```tsx
import { Slider } from "@aidan/ui";

// Basic usage
<Slider defaultValue={[50]} />

// Range slider
<Slider defaultValue={[25, 75]} />
```

## Features

- **MD3 Compliant**: Follows Material Design 3 specifications exactly
- **Handle Shapes**: Bar (vertical pill, MD3 default), circular (xs only), or knobless
- **Handle Animation**: Bar narrows on click/touch/drag, circular scales down
- **Five Sizes**: XS (16dp), S (24dp), M (40dp), L (56dp), XL (96dp) track heights
- **Track Gap**: Visual gap between handle and track with rounded corners
- **Single or Range Selection**: Support for single value or range with multiple thumbs
- **Inset Icons**: Icon within track for M, L, XL sizes (MD3 feature)
- **Value Indicators**: Configurable sizes (sm, md, lg) showing current values
- **Stop Indicators**: 4dp dots for discrete step values
- **Orientations**: Horizontal (default) and vertical layouts
- **Full Accessibility**: Keyboard navigation and ARIA support

## MD3 Specifications

### Handle Shape & Animation
The handle can be a bar (vertical pill, MD3 default) or circular:

**Bar handle (default):**
- Width: 4dp (narrows to 2dp on press/drag)
- Heights: XS/S = 44dp, M = 52dp, L = 68dp, XL = 108dp
- Corner radius: 2px for tighter top/bottom corners
- No visible focus ring (handle maintains appearance when focused)

**Circular handle (xs only):**
- Diameter: 20dp
- Positioned left so end of bar is centered on knob
- Scales to 90% on press
- Only available with xs size

**Knobless variant:**
- No visible handle - track itself is interactive
- Available for all sizes
- Scales to 90% on press

### Track Gap
- Visual gap of 1.5x handle width (6px for 4px handle) between handle and track
- Creates a floating effect with the handle not touching the track edges

**Circular handle:**
- Diameters: XS = 20dp, S = 24dp, M = 32dp, L = 40dp, XL = 48dp
- Scales to 90% on press

```tsx
// Bar handle (default, MD3)
<Slider defaultValue={[50]} handleShape="bar" />

// Circular handle
<Slider defaultValue={[50]} handleShape="circular" />
```

### Track Sizes
| Size | Track Height | Track Radius | Inset Icon |
|------|-------------|--------------|------------|
| `xs` | 16dp | 8dp | ❌ |
| `sm` | 24dp | 8dp | ❌ |
| `md` | 40dp | 12dp | ✅ 24dp |
| `lg` | 56dp | 16dp | ✅ 24dp |
| `xl` | 96dp | 28dp | ✅ 32dp |

### Color Roles
- **Active track**: Primary
- **Inactive track**: Secondary container
- **Handle**: Primary (solid)
- **Value indicator**: Inverse surface
- **Stop indicators**: On-secondary-container (inactive), On-primary (active)

## Examples

### Basic Slider

```tsx
<Slider defaultValue={[50]} />
```

### Range Slider

Select a range with two thumbs:

```tsx
<Slider defaultValue={[25, 75]} />
```

### With Value Indicator

Show the current value above the thumb:

```tsx
<Slider
  defaultValue={[50]}
  showValueIndicator="always"
  formatValue={(v) => `${v}%`}
/>

// Different indicator sizes
<Slider defaultValue={[50]} showValueIndicator="always" valueIndicatorSize="sm" />
<Slider defaultValue={[50]} showValueIndicator="always" valueIndicatorSize="md" /> // default
<Slider defaultValue={[50]} showValueIndicator="always" valueIndicatorSize="lg" />
```

### Handle Shapes

```tsx
// Bar handle (default, MD3 style)
<Slider defaultValue={[50]} handleShape="bar" />

// Circular handle (traditional)
<Slider defaultValue={[50]} handleShape="circular" />
```

### Discrete Steps with Stops

Display stop indicators for discrete values:

```tsx
<Slider defaultValue={[50]} step={10} showStops />
```

### Vertical Orientation

```tsx
<Slider
  defaultValue={[50]}
  orientation="vertical"
  className="h-48"
/>
```

### Size Variants

```tsx
<Slider defaultValue={[50]} size="xs" /> {/* Default, 16dp track */}
<Slider defaultValue={[50]} size="sm" /> {/* 24dp track */}
<Slider defaultValue={[50]} size="md" /> {/* 40dp track, supports inset icon */}
<Slider defaultValue={[50]} size="lg" /> {/* 56dp track, supports inset icon */}
<Slider defaultValue={[50]} size="xl" /> {/* 96dp track, for hero moments */}
```

### With Inset Icon (MD3 Feature)

Icon appears in the track and moves based on handle position. Optionally show different icon at minimum:

```tsx
import { Volume2, VolumeX } from "lucide-react";

<Slider
  defaultValue={[50]}
  size="md"
  insetIcon={<Volume2 />}
  insetIconAtMin={<VolumeX />}
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

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `number[]` | `[0]` | Initial value(s) for uncontrolled mode |
| `value` | `number[]` | - | Controlled value(s) |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Slider orientation |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"xs"` | Size variant (M3 spec) |
| `handleShape` | `"bar" \| "circular"` | `"bar"` | Handle shape (bar = MD3, circular = traditional) |
| `showValueIndicator` | `"always" \| "hover" \| "never"` | `"never"` | When to show value tooltip |
| `valueIndicatorSize` | `"sm" \| "md" \| "lg"` | `"md"` | Size of value indicator |
| `formatValue` | `(value: number) => string` | `String` | Custom value formatter |
| `showStops` | `boolean` | `false` | Show stop indicators for steps |
| `insetIcon` | `ReactNode` | - | Icon in track (md, lg, xl only) |
| `insetIconAtMin` | `ReactNode` | - | Alternate icon at minimum value |
| `disabled` | `boolean` | `false` | Disable the slider |
| `onValueChange` | `(value: number[]) => void` | - | Callback on value change |
| `onValueCommit` | `(value: number[]) => void` | - | Callback on final value |
| `trackClassName` | `string` | - | Additional track styles |
| `rangeClassName` | `string` | - | Additional range styles |
| `thumbClassName` | `string` | - | Additional thumb styles |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Focus on slider handle |
| `ArrowRight` / `ArrowUp` | Increase value by step |
| `ArrowLeft` / `ArrowDown` | Decrease value by step |
| `Space` + `Arrows` | Increase/decrease by larger interval |
| `Home` | Set to minimum value |
| `End` | Set to maximum value |

## Accessibility

The Slider component is built on Radix UI primitives and follows the [WAI-ARIA Slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/):

- Proper `role="slider"` semantics
- Keyboard navigation support
- Focus management for multiple thumbs
- Value announcements for screen readers
- Touch-friendly hit targets via state layer (40dp)
