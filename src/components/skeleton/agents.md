# Skeleton Components
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

Loading placeholder components that display animated placeholders while content is loading.

## Components

### Skeleton
Base skeleton component with customizable shape, size, and animation.

### SkeletonText
Multi-line text placeholder for paragraph content.

### SkeletonCard
Pre-composed card skeleton with media, avatar, title, description, and action areas.

### SkeletonAvatar
Avatar placeholder with proper sizing matching the Avatar component.

### SkeletonButton
Button placeholder matching the Button component sizing.

### SkeletonInput
Input field placeholder with optional label.

## Props

### Skeleton Props
```typescript
interface SkeletonProps {
  shape?: 'rect' | 'circle' | 'pill' | 'text';
  animation?: 'pulse' | 'shimmer' | 'none';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full' | 'auto';
  width?: string;   // CSS value or Tailwind class
  height?: string;  // CSS value or Tailwind class
}
```

### SkeletonText Props
```typescript
interface SkeletonTextProps {
  lines?: number;           // Default: 3
  gap?: 'xs' | 'sm' | 'md' | 'lg';  // Default: 'sm'
  lineHeight?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Default: 'md'
  lastLineShort?: boolean;  // Default: true
  lastLineWidth?: string;   // Default: '60%'
  animation?: 'pulse' | 'shimmer' | 'none';
}
```

### SkeletonCard Props
```typescript
interface SkeletonCardProps {
  showMedia?: boolean;           // Default: true
  mediaAspectRatio?: 'square' | 'video' | 'wide' | 'tall';  // Default: 'video'
  showAvatar?: boolean;          // Default: false
  avatarSize?: 'sm' | 'md' | 'lg';  // Default: 'md'
  contentLines?: number;         // Default: 3
  showActions?: boolean;         // Default: false
  actionCount?: number;          // Default: 2
  animation?: 'pulse' | 'shimmer' | 'none';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Default: 'md'
}
```

### SkeletonAvatar Props
```typescript
interface SkeletonAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Default: 'md'
  shape?: 'circle' | 'square';              // Default: 'circle'
  animation?: 'pulse' | 'shimmer' | 'none';
}
```

### SkeletonButton Props
```typescript
interface SkeletonButtonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Default: 'md'
  iconOnly?: boolean;                        // Default: false
  shape?: 'rect' | 'round';                  // Default: 'rect'
  animation?: 'pulse' | 'shimmer' | 'none';
}
```

### SkeletonInput Props
```typescript
interface SkeletonInputProps {
  size?: 'sm' | 'md' | 'lg';     // Default: 'md'
  showLabel?: boolean;           // Default: false
  animation?: 'pulse' | 'shimmer' | 'none';
}
```

## Dependencies

- `class-variance-authority` - Variant management
- `../../../lib/utils` - `cn()` utility

## Styling Decisions

### Animation Types
| Animation | Description | Use Case |
|-----------|-------------|----------|
| `pulse` | Gentle opacity pulsing | Default, subtle loading state |
| `shimmer` | Gradient sliding effect | More attention-grabbing loading |
| `none` | Static placeholder | When animation is distracting |

### Shape Types
| Shape | Border Radius | Use Case |
|-------|---------------|----------|
| `rect` | `var(--radius)` | General content blocks |
| `circle` | `rounded-full` + aspect-square | Avatars, icons |
| `pill` | `rounded-full` | Buttons, badges |
| `text` | `var(--radius-sm)` | Text lines |

### Size Scale
| Size | Height | Description |
|------|--------|-------------|
| `xs` | 12px (h-3) | Small text |
| `sm` | 16px (h-4) | Body text |
| `md` | 20px (h-5) | Headings |
| `lg` | 24px (h-6) | Large text |
| `xl` | 32px (h-8) | Display text |
| `2xl` | 40px (h-10) | Avatar/icon |
| `3xl` | 48px (h-12) | Large avatar |
| `4xl` | 64px (h-16) | Hero elements |

### CSS Variables Used
```css
/* Base skeleton color */
--muted: 210 40% 96.1%;           /* Light mode */
--muted: 217.2 32.6% 17.5%;       /* Dark mode */

/* Card background */
--card: 0 0% 100%;
--border: 214.3 31.8% 91.4%;

/* Border radius */
--radius: 0.5rem;
--radius-sm: 0.25rem;
--radius-md: 0.75rem;
```

### Shimmer Animation
The shimmer animation uses CSS keyframes defined in `globals.css`:
```css
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

Gradient overlay:
- Light mode: `via-white/20` (20% opacity)
- Dark mode: `via-white/10` (10% opacity)

## Accessibility

All skeleton components include:
- `role="status"` - Indicates loading state
- `aria-busy="true"` - Indicates content is loading
- `aria-label="Loading..."` - Provides context for screen readers

## Maintenance Notes

### Width/Height Handling
The component intelligently handles both CSS values and Tailwind classes:
- CSS values (e.g., "200px") are applied via inline styles
- Tailwind classes (e.g., "w-32") are applied via className

### Compound Variants
Circle shape uses compound variants to ensure width matches height for each size preset.

### Animation Performance
- Animations use CSS-only approach (no JavaScript)
- `animate-pulse` uses Tailwind's built-in animation
- Shimmer uses custom keyframes with `translate-x` for GPU acceleration

### Dark Mode
Different colors are used in dark mode:
- Background is darker (`--muted` dark mode value)
- Shimmer gradient is less visible (`via-white/10` vs `via-white/20`)

### Integration with Existing Components
Pre-composed variants match existing component sizing:
- SkeletonAvatar matches Avatar sizes
- SkeletonButton matches Button sizes
- SkeletonInput matches Input sizes
- SkeletonCard matches Card padding

### Future Enhancements (TODO)
- SkeletonImage with responsive sizing
- SkeletonTable for data table loading
- SkeletonList for list items
- Wave animation variant
- Customizable shimmer speed


