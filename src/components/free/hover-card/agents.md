# HoverCard Component - Agent Context

## Component Overview
A popup component that displays rich content when hovering over a trigger element. Built on top of `@radix-ui/react-hover-card` with additional features like click mode, size variants aligned with Card component, and automatic touch device detection.

## Props Summary

### HoverCard (Root)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `triggerMode` | `"hover" \| "click"` | `"hover"` | Interaction mode for opening the card |
| `forceTriggerMode` | `boolean` | `false` | Force trigger mode regardless of device type |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size variant aligned with Card component |
| `showCloseButton` | `boolean` | Auto | Show close button (auto-enabled in click mode) |
| `openDelay` | `number` | `700` | Delay in ms before opening (hover mode) |
| `closeDelay` | `number` | `300` | Delay in ms before closing (hover mode) |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |

### HoverCardContent
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | Inherits | Override size from root |
| `showArrow` | `boolean` | `false` | Show arrow pointing to trigger |
| `maxHeight` | `"none" \| "auto" \| string` | `"none"` | Max height with scroll support |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side positioning |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment along the side |
| `sideOffset` | `number` | `4` | Distance from trigger |

### HoverCardTrigger
Passes through all props to Radix `HoverCardPrimitive.Trigger`. Use `asChild` to merge with your own element.

### HoverCardArrow
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | Inherits | Arrow size variant |

### HoverCardClose
Extends `IconButton` props. Used for close button in click mode.

## Dependencies
- `@radix-ui/react-hover-card` - Core primitive
- `class-variance-authority` - Variant system
- `lucide-react` - X icon for close button
- Internal: `cn` utility, `IconButton` component

## Styling Decisions

### Size Variants (Aligned with Card)
Padding and border radius are aligned with the Card component's sizing system:

| Size | Padding | Width | Border Radius |
|------|---------|-------|---------------|
| xs | p-3 | w-52 | var(--radius) |
| sm | p-3 | w-56 | var(--radius-md) |
| md | p-4 | w-64 | var(--radius-md) |
| lg | p-5 | w-72 | var(--radius-lg) |
| xl | p-6 | w-80 | var(--radius-xl) |

### Animation
- Uses Tailwind CSS animate utilities via Radix's data-state attributes
- Open: fade-in + zoom-in-95 + slide-in based on side
- Close: fade-out + zoom-out-95
- Transform origin set to content origin for natural scaling

### Colors
- Background: `bg-popover`
- Text: `text-popover-foreground`
- Border: `border-border`
- Shadow: `shadow-lg`
- Arrow: `fill-popover` to match background

### Touch Device Behavior
- Automatically detects touch devices using `@media (hover: none)`
- Switches to click mode on touch devices unless `forceTriggerMode` is true
- Shows close button automatically in click mode

## Context System
Uses React context (`HoverCardContext`) to share:
- `size` - Current size variant
- `triggerMode` - Effective trigger mode
- `isTouch` - Whether device is touch-enabled
- `showCloseButton` - Whether close button should show
- `onClose` - Function to close the card

## Maintenance Notes

### Known Limitations
1. **Nested Hover Cards**: Avoid nesting hover cards within hover cards
2. **Focus Management**: In click mode, focus is not trapped inside content
3. **Mobile Safari**: Touch detection may have edge cases on hybrid devices

### Future Enhancements
- Consider adding focus trap option for click mode with interactive content
- Add keyboard shortcuts documentation
- Consider adding portal configuration option

### Testing Considerations
- Test on both touch and non-touch devices
- Verify animation timing feels natural
- Test with screen readers for accessibility
- Test controlled vs uncontrolled state management

## Usage Patterns

### When to Use HoverCard vs Others
- **HoverCard**: Rich content previews (user profiles, product info)
- **Tooltip**: Brief hints, icon labels
- **Popover**: Interactive content, forms, settings
- **Dialog**: Modal interactions requiring focus trap

### Common Use Cases
1. User profile previews (social media)
2. Product information cards (e-commerce)
3. Definition tooltips (documentation)
4. Preview cards for links
5. Information icons with rich explanations
