# AnimatedChevron

A standalone animated chevron indicator with morphing SVG animation.

## Installation

```bash
npm install @agentix/ui
```

## Usage

```tsx
import { AnimatedChevron } from '@agentix/ui';

// Basic toggle
const [isOpen, setIsOpen] = useState(false);

<button onClick={() => setIsOpen(!isOpen)}>
  <AnimatedChevron open={isOpen} />
</button>

// Tree view node pointing right
<AnimatedChevron 
  open={isExpanded} 
  direction="right" 
  size="sm"
/>

// Dropdown with bounce animation
<AnimatedChevron 
  open={dropdownOpen} 
  animation="bounce"
/>

// Custom color
<AnimatedChevron 
  open={isOpen} 
  className="text-primary"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether the chevron is in the open state |
| `animation` | `"smooth" \| "bounce" \| "sharp"` | `"smooth"` | Animation preset for the morphing transition |
| `direction` | `"down" \| "up" \| "left" \| "right"` | `"down"` | Direction the chevron points when closed |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size of the chevron (matches button icon sizes) |
| `className` | `string` | - | Additional CSS classes for customization |

## Styling

### Morphing Animation (Not Rotation)
Unlike the rotating chevrons in Accordion triggers, this component features a **morphing animation** where the SVG path itself transforms. This creates a more sophisticated visual effect where:
- The left and right segments appear to pivot around their anchor points
- The tip of the chevron slides along the Y-axis
- The animation feels more organic than a simple 180° rotation

### Animation Presets
Three presets provide different feels:

1. **Smooth** (default) - MD3 standard deceleration curve
   - Duration: 200ms
   - Easing: `cubic-bezier(0, 0, 0, 1)`
   - Best for: General use, forms, accordions

2. **Bounce** - Playful overshoot effect
   - Duration: 300ms
   - Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`
   - Best for: Playful UIs, gaming, creative apps

3. **Sharp** - Quick and snappy
   - Duration: 150ms
   - Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
   - Best for: Data-heavy UIs, professional tools

### Size Variants
Sizes match the button icon size scale for consistency:
- `xs`: 14px (3.5 tailwind units)
- `sm`: 16px (4 tailwind units)
- `md`: 16px (4 tailwind units) - default
- `lg`: 20px (5 tailwind units)
- `xl`: 24px (6 tailwind units)

### Color Inheritance
The chevron uses `currentColor` for stroke, allowing it to inherit text color from parent. The default styling applies `text-muted-foreground`, which can be overridden via `className`.

## Accessibility

The chevron is purely decorative (`pointer-events-none`). Ensure the parent interactive element has appropriate ARIA attributes:
- `aria-expanded` for toggle buttons
- Appropriate labels for screen readers

## When to Use AnimatedChevron vs Rotating Icons
- **Use AnimatedChevron**: For dropdown indicators, tree nodes, collapsible sections where you want the morphing effect
- **Use rotating icons**: When transforming between two different icons (Plus → X, Hamburger → X) or when using the Accordion's built-in chevron rotation

## Dependencies

- `class-variance-authority` - For managing size variants
- `@agentix/ui/lib/utils` - For `cn()` utility function

No external icon libraries required - the chevron is a custom SVG.

## Browser Support

The `d` attribute transition works in:
- Chrome 58+
- Firefox 54+
- Safari 12+
- Edge 79+

For older browsers, the chevron will snap between states without animation.

## License

MIT © Aidan