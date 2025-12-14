# Separator Component - Agent Notes

## Overview

The Separator component provides a visual divider that separates content into logical sections. It's built on Radix UI's Separator primitives with custom styling and customization options.

## Props Summary

### Separator
- `orientation`: `"horizontal" | "vertical"` - The orientation of the separator (default: "horizontal")
- `color`: `string` - Custom color class (e.g., "bg-red-500") that overrides the default border color
- `opacity`: `number` - Custom opacity value (0-1) that controls the transparency of the separator
- `decorative`: `boolean` - Whether the separator is purely decorative (default: true)

## Dependencies

- `@radix-ui/react-separator` - Core separator functionality
- `class-variance-authority` - Variant management
- `clsx` + `tailwind-merge` via `cn()` utility

## Styling Decisions

### Orientation Variants
- **horizontal**: Full width, 1px height (`h-px w-full`)
- **vertical**: Full height, 1px width (`h-full w-px`)

### Default Styling
- Uses `bg-border` for default color, which comes from the design tokens
- `shrink-0` to prevent the separator from shrinking in flex layouts

### Customization Approach
- Color customization is done through className overrides rather than props to maintain flexibility
- Opacity customization is done through inline styles to allow precise numeric values

## Maintenance Notes

### Edge Cases
1. **Styling conflicts**: Custom colors should override the default `bg-border` class
2. **Flex behavior**: The `shrink-0` class prevents unexpected shrinking in flex containers
3. **Accessibility**: The component is decorative by default, but can be made semantic by setting `decorative={false}`

### Common Integration Patterns

```tsx
// Basic usage
<Separator />

// Vertical separator in a horizontal layout
<div className="flex items-center">
  <span>Left</span>
  <Separator orientation="vertical" />
  <span>Right</span>
</div>

// Section divider with custom styling
<Separator className="my-4 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

// Custom color and opacity
<Separator color="bg-primary" opacity={0.5} />
```

### Accessibility Compliance
- By default, separators are marked as decorative (`decorative={true}`)
- When used semantically, set `decorative={false}` to indicate a programmatic separator
- Proper ARIA roles are handled by Radix UI

## Related Components
- **SelectSeparator**: Used specifically within Select components
- **Divider**: Conceptually similar but may have different styling
- **Spacer**: Creates space but doesn't provide visual separation

## Design Tokens Used
- `--border`: Default color (via `bg-border` class)
- The component can use any Tailwind color classes for custom colorization

## File Structure
```
src/components/free/separator/
├── index.tsx           # Component source
├── Separator.stories.tsx # Storybook stories
├── README.md           # Developer documentation
└── agents.md           # This file
```