# Spinner

An animated loading indicator component following M3 design patterns.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size of the spinner |
| `label` | `string` | `"Loading"` | Accessible label for screen readers |
| `className` | `string` | - | Additional CSS classes |

## Dependencies

- `class-variance-authority` - Variant management
- `../../lib/utils` - `cn()` utility

## Styling Decisions

- Uses SVG-based spinner for crisp rendering at all sizes
- Inherits color from parent via `currentColor` for easy theming
- Two-part design with faded track (25% opacity) and active arc (75% opacity)
- Uses CSS `animate-spin` for smooth rotation animation
- Sizes match button icon sizes for consistent use in loading states

## Usage

```tsx
// Standalone
<Spinner />
<Spinner size="lg" />

// With text
<div className="flex items-center gap-2">
  <Spinner />
  <span>Loading...</span>
</div>

// Custom color
<Spinner className="text-destructive" />
```

## Accessibility

- Uses `role="status"` for screen readers
- `aria-label` provides context (defaults to "Loading")

## Maintenance Notes

- Size variants should stay in sync with button icon sizes
- Animation uses Tailwind's built-in `animate-spin` class
