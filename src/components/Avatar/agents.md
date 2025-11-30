# Avatar Components

A comprehensive avatar system with size and shape variants, group stacking, status badges, and animations following Material Design 3 patterns with shadcn/ui styling foundation.

## Components

### Avatar
Base avatar component built on Radix UI Avatar primitive with size and shape variants.

### AvatarImage
Image displayed within the avatar, with automatic fallback handling.

### AvatarFallback
Fallback content displayed when the image fails to load or is not provided.

### AvatarGroup
Container for stacking multiple avatars with overlap styling and overflow indication.

### AvatarBadge
Status indicator badge positioned on avatars (online, offline, busy, away).

### AnimatedAvatar
Avatar with built-in entrance/exit animations following MD3 motion guidelines.

## Props

### Avatar Props
```typescript
interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Avatar size (default: 'md')
  shape?: 'circle' | 'square';               // Avatar shape (default: 'circle')
}
```

### AvatarImage Props
```typescript
interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
  // Inherits src, alt, and other img attributes
}
```

### AvatarFallback Props
```typescript
interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  // Typically contains initials or an icon
}
```

### AvatarGroup Props
```typescript
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';  // Stack direction (default: 'horizontal')
  spacing?: 'none' | 'tight' | 'normal' | 'loose';  // Overlap amount (default: 'normal')
  max?: number;              // Maximum avatars to display before showing overflow
  ringWidth?: 1 | 2 | 3 | 4; // Ring width around each avatar (default: 2)
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Size for overflow indicator
  shape?: 'circle' | 'square';  // Shape for overflow indicator
}
```

### AvatarBadge Props
```typescript
interface AvatarBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';  // Badge position (default: 'bottom-right')
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Badge size to match avatar
  status?: 'online' | 'offline' | 'busy' | 'away' | 'default';  // Status color
  visible?: boolean;         // Control visibility (default: true)
  animation?: 'scale' | 'fade' | 'none';  // Animation type (default: 'scale')
  pulse?: boolean;           // Enable pulsing animation (default: false)
}
```

### AnimatedAvatar Props
```typescript
interface AnimatedAvatarProps extends AvatarProps {
  visible?: boolean;           // Control visibility (default: true)
  animation?: 'scale' | 'fade' | 'slide';  // Animation type (default: 'scale')
}
```

## Dependencies
- `@radix-ui/react-avatar` - Avatar primitive for image loading states
- `class-variance-authority` - Variant management
- `../../lib/utils` - `cn()` utility

## Styling Decisions

### Size Scale
| Size | Dimensions | Font Size | Use Case |
|------|------------|-----------|----------|
| `xs` | 24px (size-6) | 10px | Compact lists, inline mentions |
| `sm` | 32px (size-8) | 12px (text-xs) | Comments, small cards |
| `md` | 40px (size-10) | 14px (text-sm) | Default, navigation, cards |
| `lg` | 56px (size-14) | 16px (text-base) | Profile headers, detailed views |
| `xl` | 64px (size-16) | 18px (text-lg) | Profile pages, hero sections |

### Shape Variants
| Shape | Description | Radius by Size |
|-------|-------------|----------------|
| `circle` | Fully rounded | rounded-full |
| `square` | Rounded corners | xs: sm, sm-md: default, lg: md, xl: lg |

**Square radius rationale:** Smaller avatars need smaller radius to maintain visible shape. Larger avatars can have more pronounced rounding.

### AvatarGroup Spacing
| Spacing | Overlap | Use Case |
|---------|---------|----------|
| `none` | gap-1 (no overlap) | When separation is needed |
| `tight` | -space-x-3 | Compact displays |
| `normal` | -space-x-2 | Default overlap |
| `loose` | -space-x-1 | Minimal overlap |

### AvatarBadge Status Colors
| Status | Color | Use Case |
|--------|-------|----------|
| `online` | Green (bg-green-500) | User is active |
| `offline` | Gray (bg-gray-400) | User is inactive |
| `busy` | Red (bg-red-500) | Do not disturb |
| `away` | Amber (bg-amber-500) | User is away |
| `default` | Primary | Custom status |

### MD3 Features Implemented

1. **Image Loading States**
   - Built on Radix UI Avatar for proper loading/error handling
   - Fallback displayed during load or on error
   - Smooth transitions between states

2. **Shape Differentiation**
   - Circle for users/people
   - Square for organizations, teams, bots
   - Consistent visual language across the UI

3. **Group Stacking**
   - Negative spacing for overlap
   - Ring separator for visual distinction
   - Overflow indicator with count
   - Accessible with role="group" and aria-label

4. **Status Indicators**
   - Positioned badges with border separation
   - Pulsing animation for active states
   - Entrance/exit animations

5. **Motion/Animation**
   - Scale animation (default): Grows/shrinks from center
   - Fade animation: Opacity transition
   - Slide animation: Slides up/down with fade
   - Duration: 200ms (--motion-duration-medium)
   - Easing: cubic-bezier(0.2, 0, 0, 1) (--motion-easing-standard)

### CSS Variables Used
```css
--motion-duration-medium
--motion-easing-standard
--radius-sm, --radius, --radius-md, --radius-lg
--muted, --muted-foreground
--background
--primary
```

## Maintenance Notes

### Accessibility
- AvatarImage requires `alt` attribute for screen readers
- AvatarGroup includes `role="group"` and `aria-label`
- AvatarBadge includes `role="status"` and `aria-label` for status
- Color alone doesn't convey status (combine with tooltip/text)

### Image Handling
- Radix Avatar handles loading states automatically
- Fallback shown immediately if no src provided
- Fallback shown on image error
- Use `delayMs` prop on AvatarFallback to prevent flash

### Group Overflow
- Pass matching `size` and `shape` props to AvatarGroup
- Overflow count avatar inherits these for consistency
- `max` prop limits visible avatars, shows "+N" for remainder

### Badge Positioning
- Badge positioned absolutely within Avatar
- Border matches `--background` for separation
- Position adjusts for different avatar shapes
- Size should match avatar size for proper proportions

### Edge Cases
- Empty fallback renders empty centered container
- AvatarGroup with single child still applies ring styling
- Animated components remain in DOM when hidden (pointer-events-none)
- Very small avatars (xs) may clip badge; consider hiding badge at xs size

### Usage Examples

```tsx
// Basic avatar
<Avatar>
  <AvatarImage src="/user.png" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Avatar with status
<Avatar size="lg">
  <AvatarImage src="/user.png" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
  <AvatarBadge status="online" size="lg" />
</Avatar>

// Avatar group with max
<AvatarGroup max={3} size="md">
  {users.map(user => (
    <Avatar key={user.id} size="md">
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  ))}
</AvatarGroup>

// Square avatar for organizations
<Avatar shape="square" size="lg">
  <AvatarImage src="/company-logo.png" alt="Acme Corp" />
  <AvatarFallback>AC</AvatarFallback>
</Avatar>
```
