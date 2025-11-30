# Select Component

A dropdown select component following Material Design 3 patterns, built on Radix UI Select primitive.

## Props

### Select
Wraps `@radix-ui/react-select` Root - accepts all Radix Select props:
- `value?: string` - Controlled value
- `defaultValue?: string` - Default value for uncontrolled usage
- `onValueChange?: (value: string) => void` - Change handler
- `open?: boolean` - Controlled open state
- `onOpenChange?: (open: boolean) => void` - Open state change handler
- `disabled?: boolean` - Disable the select
- `name?: string` - Form field name
- `required?: boolean` - Form required field

### SelectTrigger
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant matching Button component |
| `icon` | `LucideIcon` | `ChevronDown` | Custom icon for the dropdown indicator (ignored when useAnimatedChevron is true) |
| `hideIcon` | `boolean` | `false` | Hide the dropdown icon entirely |
| `useAnimatedChevron` | `boolean` | `false` | Use the AnimatedChevron component with morphing animation instead of rotation |
| `chevronAnimation` | `'smooth' \| 'bounce' \| 'sharp'` | `'smooth'` | Animation preset for AnimatedChevron (only used when useAnimatedChevron is true) |
| `className` | `string` | - | Additional CSS classes |

### SelectContent
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'popper' \| 'item-aligned'` | `'popper'` | Positioning mode |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Side to render on |
| `sideOffset` | `number` | `4` | Distance from trigger |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment with trigger |

### SelectItem
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | *required* | The value for the item |
| `disabled` | `boolean` | `false` | Disable the item |

### Other Components
- `SelectValue` - Displays selected value or placeholder
- `SelectGroup` - Groups related items together
- `SelectLabel` - Label for a group
- `SelectSeparator` - Visual separator between items/groups
- `SelectScrollUpButton` - Scroll indicator at top
- `SelectScrollDownButton` - Scroll indicator at bottom

## Dependencies
- `@radix-ui/react-select` - Core primitive
- `class-variance-authority` - Variant management
- `lucide-react` - Icon library (ChevronDown, ChevronUp, Check)
- `../AnimatedChevron` - Optional morphing chevron animation (internal component)

## Styling Decisions

### Size Variants
Sizes match the Button component using rem units for scalability:
- **xs**: 1.75rem (28px) - Compact inline uses
- **sm**: 2rem (32px) - Smaller forms
- **md**: 2.25rem (36px) - Default, balanced
- **lg**: 2.75rem (44px) - Touch-friendly
- **xl**: 3.25rem (52px) - Hero/prominent selects

### Custom Icon Support
The `icon` prop accepts any Lucide icon component, allowing customization of the dropdown indicator. Common alternatives:
- `ChevronsUpDown` - For combobox-style appearance
- `ArrowDown` - Simple arrow indicator
- Custom icons for branded designs

The icon rotates 180° on open state using CSS transforms.

### Content Positioning
Uses Radix UI's popper positioning with sensible defaults:
- `position="popper"` - Floating dropdown that avoids viewport edges
- `side="bottom"` - Opens below trigger by default
- `align="start"` - Aligns to start of trigger
- `sideOffset={4}` - 4px gap between trigger and dropdown

Viewport detection in Radix automatically flips to `top` if insufficient space below.

### Animation
M3 motion tokens for smooth transitions:
- Open/close: fade + zoom + slide animations
- Duration: `--motion-duration-medium` (200ms)
- Easing: `--motion-easing-standard`

#### Chevron Animation Options
Two chevron animation styles are available:

1. **Default (Rotation)**: The icon rotates 180° on open using CSS transforms. Works with any custom icon.

2. **AnimatedChevron (Morphing)**: Uses the AnimatedChevron component for a smooth SVG path morphing animation. Enable with `useAnimatedChevron` prop. Supports three presets:
   - `smooth` - Subtle easing (default)
   - `bounce` - Playful spring effect
   - `sharp` - Quick, snappy transition

The Select component uses React Context internally to track open state and pass it to the AnimatedChevron component.

### Focus & Hover States
- Trigger: Ring focus indicator, accent background on hover
- Items: Accent background on focus/hover
- Consistent with other form components in the design system

## Usage Examples

### Basic
```tsx
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
    <SelectItem value="b">Option B</SelectItem>
  </SelectContent>
</Select>
```

### With Groups
```tsx
<Select>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Category A</SelectLabel>
      <SelectItem value="a1">Item A1</SelectItem>
      <SelectItem value="a2">Item A2</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Category B</SelectLabel>
      <SelectItem value="b1">Item B1</SelectItem>
      <SelectItem value="b2">Item B2</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### Custom Icon
```tsx
import { ChevronsUpDown } from "lucide-react";

<Select>
  <SelectTrigger icon={ChevronsUpDown} className="w-[180px]">
    <SelectValue placeholder="Search..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
  </SelectContent>
</Select>
```

### With AnimatedChevron
```tsx
<Select>
  <SelectTrigger useAnimatedChevron chevronAnimation="bounce" className="w-[180px]">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
    <SelectItem value="b">Option B</SelectItem>
  </SelectContent>
</Select>
```

### Controlled
```tsx
const [value, setValue] = React.useState("light");

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
  </SelectContent>
</Select>
```

## Maintenance Notes

### Known Limitations
1. **No search/typeahead**: This component is a simple select. For searchable dropdowns, use a separate Combobox component.
2. **Single selection only**: Radix Select doesn't support multi-select. Use Checkbox group or custom component for that.
3. **No scroll indicators as arrows**: Per design spec, scroll is native browser scroll within the content area.

### Accessibility
- Full keyboard navigation (Arrow keys, Enter, Escape)
- Screen reader announcements via Radix
- Focus management and focus trap in dropdown
- `aria-disabled` support for disabled items

### Browser Support
- Modern browsers with CSS `:has()` support (fallback graceful)
- Animations may not work on older Safari versions

### Future Enhancements
- Consider adding `variant` prop (filled, outlined) for different visual styles
- Add support for item descriptions (secondary text)
- Consider virtualization for very long lists (100+ items)
