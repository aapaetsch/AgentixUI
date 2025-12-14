# Spinner

An animated loading indicator component following M3 design patterns.

## Installation

```bash
npm install @aidan/ui
```

## Usage

```tsx
import { Spinner } from '@aidan/ui';

// Basic spinner
<Spinner />

// Large spinner
<Spinner size="lg" />

// With text
<div className="flex items-center gap-2">
  <Spinner />
  <span>Loading...</span>
</div>

// Custom color
<Spinner className="text-destructive" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size of the spinner |
| `label` | `string` | `"Loading"` | Accessible label for screen readers |
| `className` | `string` | - | Additional CSS classes |

## Styling

The Spinner component uses an SVG-based design with a two-part circle:
- Faded track (25% opacity)
- Active arc (75% opacity)

It inherits its color from the parent via `currentColor`, making it easy to theme.

### Sizes

| Size | Dimensions |
|------|------------|
| xs | 14px |
| sm | 16px |
| md | 16px |
| lg | 20px |
| xl | 24px |

## Accessibility

- Uses `role="status"` for screen readers
- `aria-label` provides context (defaults to "Loading")

## Dependencies

- `class-variance-authority` - Variant management
- `@aidan/ui/lib/utils` - `cn()` utility

## License

MIT © Aidan