# Spinner

An animated loading indicator component with support for classic circular spinners and Material Design 3's expressive morphing shape animation.

## Installation

```bash
npm install aapaetsch-ui-kit
```

## Usage

```tsx
import { Spinner } from 'aapaetsch-ui-kit';

// Default circular spinner
<Spinner />

// MD3 morphing variant
<Spinner variant="md3" />

// MD3 with container background
<Spinner variant="md3" contained />

// Large spinner
<Spinner variant="md3" size="lg" />

// With text
<div className="flex items-center gap-2">
  <Spinner variant="md3" />
  <span>Loading...</span>
</div>

// Custom color
<Spinner variant="md3" className="text-destructive" />

// In a button
<button className="inline-flex items-center gap-2">
  <Spinner variant="md3" size="xs" />
  Processing...
</button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "md3"` | `"default"` | Spinner variant - default circular or MD3 morphing shape |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl"` | `"md"` | Size of the spinner |
| `contained` | `boolean` | `false` | Show container background (MD3 contained variant) |
| `label` | `string` | `"Loading"` | Accessible label for screen readers |
| `className` | `string` | - | Additional CSS classes |

## Variants

### Default
The classic circular spinner with a rotating arc. Uses a simple, clean design that works well in most contexts.

### MD3 (Material Design 3)
An expressive loading indicator implementing the official Material Design 3 specification. Features:
- Shape morphing animation through 7 unique Material 3 shapes
- Circular background container (15% opacity) always visible per MD3 spec
- Uses SVG path animation (SMIL) for smooth shape transitions
- The 7 shapes in sequence:
  1. **Circle** - Perfect circle
  2. **Clover4Leaf** - Four-leaf clover pattern
  3. **Flower** - Organic flower shape with 4 petals
  4. **Cookie4Sided** - Soft, puffy four-sided shape
  5. **Puffy** - Pillowed, organic blob
  6. **PuffyDiamond** - Soft diamond shape
  7. **Clover8Leaf** - Eight-leaf clover (circle-like)
- Uses 14 keyframes for smooth, fluid transitions
- Recommended for short processes (200ms - 5s)

### Contained Mode
When `contained={true}`, the spinner is wrapped in a circular container with:
- Background color: `primary-container`
- Indicator color: `on-primary-container`
- Container size: 1.25× indicator size (per MD3 spec)

Use contained mode when:
- Placing the spinner over other content
- Implementing pull-to-refresh behavior
- Additional contrast is needed

## Styling

### Default Variant
The default spinner uses an SVG-based design with:
- Faded track (25% opacity)
- Active arc (75% opacity)
- Spinning animation using CSS `animate-spin`

### MD3 Variant
The MD3 spinner features:
- Automatic circular background with 15% opacity (always present)
- SVG path morphing through 7 distinct Material 3 shapes
- Uses SMIL animation (`<animate>` element) with 14 keyframes for smooth interpolation
- 1.4s morph cycle with cubic-bezier(0.2, 0, 0, 1) easing (standard Material motion)
- Additional slow rotation animation (2.8s) for visual interest
- Each shape is carefully designed to morph smoothly into the next

Both variants inherit color from the parent via `currentColor`, making them easy to theme.

### Sizes

Sizes follow Material Design 3 specifications (24dp - 240dp):

| Size | Dimensions | Use Case |
|------|------------|----------|
| xs | 24px | Minimum size, inline contexts |
| sm | 32px | Compact UI elements |
| md | 48px | Default size (MD3 standard) |
| lg | 96px | Large windows, empty states |
| xl | 128px | Extra large windows |
| 2xl | 240px | Maximum size, full-screen loading |

## Accessibility

- Uses `role="status"` for screen readers
- `aria-label` provides context (defaults to "Loading")
- Maintains 3:1 contrast ratio when using theme colors
- Container provides additional contrast when enabled

## Best Practices

### When to Use Each Variant
- **Default**: Simple, unobtrusive loading states, inline contexts
- **MD3**: More attention-grabbing, short processes (200ms-5s), modern UI
- **MD3 Contained**: Over content, pull-to-refresh, needs extra contrast

### Timing Guidelines (per MD3 spec)
- **Instant** (< 200ms): Don't show indicator, display content immediately
- **Short** (200ms - 5s): Use loading indicator (MD3 recommended)
- **Long** (> 5s): Use progress indicator instead

### Color Customization
```tsx
// Use theme colors
<Spinner className="text-primary" />
<Spinner className="text-destructive" />

// Custom colors
<Spinner className="text-blue-500" />
<Spinner className="text-purple-600" />
```

## Examples

### Loading State in Card
```tsx
<Card>
  <CardContent className="flex items-center justify-center p-8">
    <Spinner variant="md3" contained />
  </CardContent>
</Card>
```

### Pull-to-Refresh
```tsx
<div className="pull-to-refresh">
  <Spinner variant="md3" contained size="md" />
  <span className="sr-only">Refreshing content...</span>
</div>
```

### Dark Mode
```tsx
<div className="bg-slate-900 p-4">
  <Spinner variant="md3" className="text-white" />
</div>
```

## Dependencies

- `class-variance-authority` - Variant management
- `aapaetsch-ui-kit/lib/utils` - `cn()` utility

## License

MIT © Aidan