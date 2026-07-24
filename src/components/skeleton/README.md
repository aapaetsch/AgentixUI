# Skeleton Components

Loading placeholder components that display animated placeholders while content is loading.

## Installation

```bash
npm install @agentix/ui
```

## Usage

```tsx
import { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard, 
  SkeletonAvatar, 
  SkeletonButton, 
  SkeletonInput 
} from '@agentix/ui';

// Basic skeleton
<Skeleton className="w-32 h-8" />

// Text placeholder
<SkeletonText lines={3} />

// Card placeholder
<SkeletonCard showAvatar showActions />

// Avatar placeholder
<SkeletonAvatar size="lg" />

// Button placeholder
<SkeletonButton size="md" />

// Input placeholder with label
<SkeletonInput showLabel />
```

## Components

### Skeleton

The base skeleton component with customizable shape, size, and animation.

### SkeletonText

Multi-line text placeholder for paragraph content.

### SkeletonCard

Pre-composed card skeleton with media, avatar, title, description, and action areas.

### SkeletonAvatar

Avatar placeholder with proper sizing.

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
  width?: string;   // CSS value or Tailwind class (e.g., "200px" or "w-32")
  height?: string;  // CSS value or Tailwind class (e.g., "100px" or "h-8")
}
```

### SkeletonText Props

```typescript
interface SkeletonTextProps {
  lines?: number;           // Number of lines (default: 3)
  gap?: 'xs' | 'sm' | 'md' | 'lg';  // Gap between lines (default: 'sm')
  lineHeight?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Line height (default: 'md')
  lastLineShort?: boolean;  // Make last line shorter (default: true)
  lastLineWidth?: string;   // Width of last line (default: '60%')
  animation?: 'pulse' | 'shimmer' | 'none';
}
```

### SkeletonCard Props

```typescript
interface SkeletonCardProps {
  showMedia?: boolean;           // Show media placeholder (default: true)
  mediaAspectRatio?: 'square' | 'video' | 'wide' | 'tall';  // Media aspect ratio (default: 'video')
  showAvatar?: boolean;          // Show avatar in header (default: false)
  avatarSize?: 'sm' | 'md' | 'lg';  // Avatar size (default: 'md')
  contentLines?: number;         // Number of content lines (default: 3)
  showActions?: boolean;         // Show action buttons (default: false)
  actionCount?: number;          // Number of action buttons (default: 2)
  animation?: 'pulse' | 'shimmer' | 'none';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Card padding size (default: 'md')
}
```

### SkeletonAvatar Props

```typescript
interface SkeletonAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Avatar size (default: 'md')
  shape?: 'circle' | 'square';              // Avatar shape (default: 'circle')
  animation?: 'pulse' | 'shimmer' | 'none';
}
```

### SkeletonButton Props

```typescript
interface SkeletonButtonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Button size (default: 'md')
  iconOnly?: boolean;                        // Square icon button (default: false)
  shape?: 'rect' | 'round';                  // Button shape (default: 'rect')
  animation?: 'pulse' | 'shimmer' | 'none';
}
```

### SkeletonInput Props

```typescript
interface SkeletonInputProps {
  size?: 'sm' | 'md' | 'lg';     // Input size (default: 'md')
  showLabel?: boolean;           // Show label placeholder (default: false)
  animation?: 'pulse' | 'shimmer' | 'none';
}
```

## Styling

### Animation Types

| Animation | Description |
|-----------|-------------|
| `pulse` | Gentle opacity pulsing (default) |
| `shimmer` | Gradient sliding effect |
| `none` | Static placeholder |

### Shape Types

| Shape | Description | Use Case |
|-------|-------------|----------|
| `rect` | Rounded rectangle | General content |
| `circle` | Circular | Avatars, icons |
| `pill` | Pill/capsule shape | Buttons, badges |
| `text` | Subtle rounded rectangle | Text lines |

### Size Scale

| Size | Height | Description |
|------|--------|-------------|
| `xs` | 12px | Small text |
| `sm` | 16px | Body text |
| `md` | 20px | Headings |
| `lg` | 24px | Large text |
| `xl` | 32px | Display text |
| `2xl` | 40px | Avatar/icon |
| `3xl` | 48px | Large avatar |
| `4xl` | 64px | Hero elements |
| `full` | 100% | Fill parent |
| `auto` | auto | No height constraint |

### Theming

Skeleton components use CSS variables for theming:

```css
/* Light mode (default) */
--muted: 210 40% 96.1%;

/* Dark mode */
--muted: 217.2 32.6% 17.5%;
```

The shimmer animation uses a white gradient with different opacities for light and dark modes:
- Light mode: `via-white/20`
- Dark mode: `via-white/10`

## Accessibility

All skeleton components include proper accessibility attributes:

- `role="status"` - Indicates loading state
- `aria-busy="true"` - Indicates content is loading
- `aria-label="Loading..."` - Provides context for screen readers

## Real-World Examples

### Profile Card Loading

```tsx
<Card>
  <CardHeader className="flex flex-row items-center gap-4">
    <SkeletonAvatar size="lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  </CardHeader>
  <CardContent>
    <SkeletonText lines={3} />
  </CardContent>
</Card>
```

### Article List Loading

```tsx
<div className="space-y-4">
  {Array.from({ length: 3 }).map((_, i) => (
    <div key={i} className="flex gap-4 p-4 border rounded-lg">
      <Skeleton className="w-24 h-24 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <SkeletonText lines={2} lineHeight="sm" />
        <div className="flex items-center gap-2 pt-2">
          <SkeletonAvatar size="xs" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  ))}
</div>
```

### Form Loading

```tsx
<div className="space-y-6">
  <SkeletonInput showLabel />
  <SkeletonInput showLabel />
  <SkeletonInput showLabel />
  <div className="flex justify-end gap-2 pt-4">
    <SkeletonButton />
    <SkeletonButton />
  </div>
</div>
```

## Dependencies

- `class-variance-authority` - Variant management
- `@agentix/ui/lib/utils` - `cn()` utility

## License

MIT © Aidan
