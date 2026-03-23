# Card Components
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

A comprehensive card system following Material Design 3 patterns with elevated, filled, and outlined variants.

## Components

### Card
Main container component with three variants (elevated, filled, outlined) and responsive size options.

### CardHeader
Header area with optional leading (avatar/icon) and trailing (actions) elements.

### CardTitle
Headline text component with size variants matching card sizes.

### CardDescription
Subhead or supporting text with muted styling.

### CardContent
Main content area with configurable padding.

### CardMedia
Image/video container with aspect ratio presets.

### CardActions
Container for action buttons with alignment options.

### CardFooter
Footer area separated by a divider for secondary content.

### SwipeableCard
Card with swipe-to-dismiss gesture support for touch/mouse.

### ExpandableCard
Card that expands to fullscreen with container transform animation.

## Props

### Card Props
```typescript
interface CardProps {
  variant?: 'elevated' | 'filled' | 'outlined';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;  // Makes card clickable with focus states
  dragged?: boolean;      // Elevated state for drag gesture
  disabled?: boolean;
  asChild?: boolean;
}
```

### CardHeader Props
```typescript
interface CardHeaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  leading?: React.ReactNode;   // Avatar, icon, thumbnail
  trailing?: React.ReactNode;  // Icon button, overflow menu
}
```

### CardTitle Props
```typescript
interface CardTitleProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  asChild?: boolean;
}
```

### CardDescription Props
```typescript
interface CardDescriptionProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  asChild?: boolean;
}
```

### CardContent Props
```typescript
interface CardContentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  standalone?: boolean;  // Full padding when no header present
}
```

### CardMedia Props
```typescript
interface CardMediaProps {
  src?: string;
  alt?: string;
  position?: 'top' | 'bottom' | 'fill';
  aspectRatio?: 'auto' | 'square' | 'video' | 'wide' | 'tall';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}
```

### CardActions Props
```typescript
interface CardActionsProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'end' | 'center' | 'between';
}
```

### CardFooter Props
```typescript
interface CardFooterProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
```

### SwipeableCard Props
```typescript
interface SwipeableCardProps extends CardProps {
  onDismiss?: (direction: 'left' | 'right') => void;
  swipeThreshold?: number;      // Pixels to trigger dismiss (default: 100)
  swipeEnabled?: boolean;       // Enable/disable swipe (default: true)
  swipeDirection?: 'left' | 'right' | 'both';  // Allowed directions
}
```

### ExpandableCard Props
```typescript
interface ExpandableCardProps extends CardProps {
  expanded?: boolean;           // Controlled state
  defaultExpanded?: boolean;    // Uncontrolled default
  onExpandedChange?: (expanded: boolean) => void;
  expandedContent?: React.ReactNode;  // Content shown when expanded
}
```

## Dependencies
- `@radix-ui/react-slot` - Polymorphic component support
- `class-variance-authority` - Variant management
- `../../lib/utils` - `cn()` utility

## Styling Decisions

### Variants (MD3 Card Types)
| Variant | Background | Border | Shadow | State Layer |
|---------|------------|--------|--------|-------------|
| `elevated` | surface-container-low | None | Level 1 (1dp) | on-surface |
| `filled` | surface-container-highest | None | None | on-surface |
| `outlined` | surface | outline-variant | None | on-surface |

### MD3 State Layer Opacities
| State | Opacity | Description |
|-------|---------|-------------|
| Hover | 8% | `before:opacity-[0.08]` |
| Focus | 10% | `before:opacity-[0.1]` |
| Press | 10% | `before:opacity-[0.1]` |
| Drag | 16% | `before:opacity-[0.16]` |
| Disabled | 38% container opacity | `opacity-[0.38]` |

### Size Variants
| Size | Padding | Border Radius | Title Size | Description Size |
|------|---------|---------------|------------|------------------|
| `xs` | 12px | var(--radius) | text-sm | text-xs |
| `sm` | 12px | var(--radius-md) | text-base | text-xs |
| `md` | 16px | var(--radius-md) | text-lg | text-sm |
| `lg` | 20px | var(--radius-lg) | text-xl | text-sm |
| `xl` | 24px | var(--radius-xl) | text-2xl | text-base |

### MD3 State Transitions
- **Hover**: 8% on-surface state layer overlay
- **Focus**: 10% on-surface state layer + focus ring
- **Active/Press**: 10% on-surface state layer + slight scale (99%)
- **Dragged**: Level 4 elevation (8dp) + 16% state layer + scale (102%)
- **Disabled**: 38% opacity on entire container

### Media Aspect Ratios
| Preset | Ratio | Use Case |
|--------|-------|----------|
| `auto` | Content-based | Variable content |
| `square` | 1:1 | Thumbnails, avatars |
| `video` | 16:9 | Video thumbnails |
| `wide` | 2:1 | Banners, headers |
| `tall` | 3:4 | Portrait images |

### CSS Variables Used
```css
/* MD3 Surface Colors */
--surface                     /* Outlined card background */
--surface-container-low       /* Elevated card background */
--surface-container-highest   /* Filled card background */
--on-surface                  /* State layer color */

/* MD3 Outline Colors */
--outline-variant             /* Outlined card border */

/* MD3 Elevation */
--elevation-1                 /* Elevated card resting (1dp) */
--elevation-4                 /* Dragged state (8dp) */

/* MD3 Motion */
--motion-duration-medium      /* Transition duration (200ms) */
--motion-duration-long        /* Expand transition (300ms) */
--motion-easing-standard      /* Standard easing curve */

/* Border Radius */
--radius, --radius-md, --radius-lg, --radius-xl
```

## MD3 Guidelines Implemented

### Container
- Only required element of a card
- Size determined by content
- Elevation expressed through shadow
- 12dp corner radius (default md size)

### States
- **Hovered**: Elevation lift for elevated cards
- **Focused**: Ring outline for keyboard navigation
- **Pressed**: Scale feedback for interactive cards
- **Dragged**: Elevated state for pick-up gesture
- **Disabled**: Reduced opacity

### Gestures
- **Swipe**: SwipeableCard for dismiss/state change
- **Pick up & move**: `dragged` prop for elevated state
- **Tap**: Interactive cards with onClick

### Content Blocks
- Header with avatar and overflow menu support
- Media for images, thumbnails, video
- Actions for buttons and controls
- Footer for secondary information

## Maintenance Notes

### Accessibility
- Interactive cards have focus-visible ring
- Cards support keyboard navigation (Tab/Enter)
- CardMedia images require alt text
- ExpandableCard uses role="dialog" and aria-modal

### Controlled vs Uncontrolled
- ExpandableCard supports both modes
- Use `expanded` for controlled state
- Use `defaultExpanded` for uncontrolled

### Edge Cases
- CardContent `standalone` prop for cards without headers
- CardHeader auto-switches to row layout when leading/trailing provided
- SwipeableCard handles both touch and mouse events
- ExpandableCard maintains layout placeholder when expanded

### Future Enhancements (TODO)
- CardGrid component for grid layouts
- CardList component for vertical lists
- CardCarousel component for horizontal scrolling
- Better container transform animation with FLIP technique
- Drag-and-drop reordering support
- Card skeleton loading state

### Integration Examples

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Card with avatar and actions
<Card variant="outlined">
  <CardHeader
    leading={<Avatar><AvatarFallback>JD</AvatarFallback></Avatar>}
    trailing={<IconButton><MoreVertical /></IconButton>}
  >
    <CardTitle>User Name</CardTitle>
    <CardDescription>Posted 2h ago</CardDescription>
  </CardHeader>
  <CardMedia src="/image.jpg" alt="Post" />
  <CardActions align="between">
    <IconButton><Heart /></IconButton>
    <IconButton><Bookmark /></IconButton>
  </CardActions>
</Card>

// Swipeable notification card
<SwipeableCard onDismiss={(dir) => handleDismiss(id, dir)}>
  <CardContent>Notification content</CardContent>
</SwipeableCard>
```


