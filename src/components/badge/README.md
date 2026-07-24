# Badge Components

A comprehensive badge system following Material Design 3 patterns with shadcn/ui styling foundation.

## Installation

```bash
npm install aapaetsch-ui-kit
```

## Usage

```tsx
import { Badge, BadgeAnchor, AnimatedBadge } from 'aapaetsch-ui-kit';

// Standard badge
<Badge>Default</Badge>

// Badge with count
<Badge>42</Badge>

// Positioned badge
<BadgeAnchor badge={<Badge>5</Badge>}>
  <InboxIcon />
</BadgeAnchor>

// Animated badge
<AnimatedBadge visible={isVisible} animation="scale">
  New
</AnimatedBadge>
```

## Components

### Badge
Standard badge with multiple variants and sizes, supporting text and numeric content.

### BadgeAnchor
Wrapper component for positioning badges on other elements (icons, navigation items).

### AnimatedBadge
Badge with built-in entrance/exit animations following MD3 motion guidelines.

## Props

### Badge Props

```typescript
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';  // small=dot, medium=20px, large=24px
  asChild?: boolean;           // Render as child element
  tabularNums?: boolean;       // Force tabular numerals (auto-enabled for numbers)
  maxChars?: number;           // Max characters before truncation (default: 4)
}
```

### BadgeAnchor Props

```typescript
interface BadgeAnchorProps {
  badge: React.ReactElement<BadgeProps>;  // The badge to position
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showBadge?: boolean;         // Control badge visibility (default: true)
  animate?: boolean;           // Enable entrance/exit animations (default: true)
}
```

### AnimatedBadge Props

```typescript
interface AnimatedBadgeProps extends BadgeProps {
  visible?: boolean;           // Control visibility (default: true)
  animation?: 'scale' | 'fade' | 'slide';  // Animation type (default: 'scale')
}
```

## Styling

### Variants

| Variant | Container | Text | Use Case |
|---------|-----------|------|----------|
| `default` | Primary | Primary Foreground | Standard notifications |
| `secondary` | Secondary | Secondary Foreground | Low-emphasis |
| `destructive` | Destructive | White | Errors, critical counts |
| `outline` | Transparent + border | Foreground | Subtle indicators |
| `success` | Green | White | Success states |
| `warning` | Amber | Black | Warning states |

### Sizes (MD3 Badge Types)

| Size | Type | Dimensions | Use Case |
|------|------|------------|----------|
| `small` | Dot | 8x8px | Unread indicator, no text |
| `medium` | Standard | h-20px, min-w-20px | Default badge with text |
| `large` | Emphasis | h-24px, min-w-24px | Larger text badges |

### MD3 Features Implemented

1. **Two Badge Types**
   - Small: Simple dot indicator (no text content)
   - Large: Container with label text (medium/large sizes)

2. **Character Limiting**
   - Maximum 4 characters by default (configurable)
   - Numbers over 999 display as "999+"
   - Prevents badge overflow and collision

3. **Tabular Numerals**
   - Automatically enabled for numeric content
   - Uses `font-variant-numeric: tabular-nums`
   - Ensures consistent width for changing numbers

4. **RTL Support**
   - BadgeAnchor positions automatically mirror for RTL layouts
   - Uses Tailwind's `rtl:` modifier for positioning

5. **Placement Guidelines**
   - Top-right default (standard for notifications)
   - Small badges positioned closer to anchor element
   - Large badges offset slightly for visibility

6. **Motion/Animation**
   - Scale animation (default): Grows/shrinks from center
   - Fade animation: Opacity transition
   - Slide animation: Slides up/down with fade
   - Duration: 200ms (--motion-duration-medium)
   - Easing: cubic-bezier(0.2, 0, 0, 1) (--motion-easing-standard)

## Accessibility

- Badge content is read by screen readers
- Small badges (dots) should have parent element with appropriate aria-label
- Color contrast meets WCAG 2.1 AA standards (3:1 minimum)
- Focus states with visible ring for interactive badges (asChild as link)

## Integration with Navigation

Hide badge when destination selected (MD3 guideline):

```tsx
<BadgeAnchor 
  badge={<Badge>{count}</Badge>} 
  showBadge={!isSelected && count > 0}
>
  <NavIcon />
</BadgeAnchor>
```

## Dependencies

- `@radix-ui/react-slot` - Polymorphic component (asChild prop)
- `class-variance-authority` - Variant management
- `aapaetsch-ui-kit/lib/utils` - `cn()` utility

## License

MIT © Aidan