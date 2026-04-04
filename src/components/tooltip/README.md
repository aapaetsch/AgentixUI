# Tooltip Components

A tooltip component built on Radix UI primitives, featuring size variants and smooth CSS animations following shadcn/ui patterns.

## Installation

```bash
npm install @aidan/ui
```

## Usage

```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from '@aidan/ui';

// Basic usage
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Add to library</p>
  </TooltipContent>
</Tooltip>

// With arrow
<Tooltip>
  <TooltipTrigger asChild>
    <IconButton aria-label="Settings">
      <Settings />
    </IconButton>
  </TooltipTrigger>
  <TooltipContent showArrow>
    <p>Settings</p>
  </TooltipContent>
</Tooltip>

// Different sizes
<Tooltip>
  <TooltipTrigger>Small hint</TooltipTrigger>
  <TooltipContent size="xs">Tiny tooltip</TooltipContent>
</Tooltip>

<Tooltip>
  <TooltipTrigger>Large tooltip</TooltipTrigger>
  <TooltipContent size="lg">
    This is a larger tooltip with more content
  </TooltipContent>
</Tooltip>

// Positioning
<Tooltip>
  <TooltipTrigger>Right side</TooltipTrigger>
  <TooltipContent side="right" align="start">
    Appears on the right
  </TooltipContent>
</Tooltip>

// Global provider (App-wide configuration)
<TooltipProvider delayDuration={100} skipDelayDuration={300}>
  <App />
</TooltipProvider>
```

## Components

### TooltipProvider
Global configuration for tooltips (delay duration, skip delay duration).

### Tooltip
Root component that manages tooltip open/close state.

### TooltipTrigger
Element that triggers the tooltip on hover/focus.

### TooltipContent
The popup content that appears when triggered.

### TooltipArrow
Optional arrow pointing to the trigger element.

## Props

### TooltipProvider Props

```typescript
interface TooltipProviderProps {
  delayDuration?: number;      // Delay before showing (default: 200ms)
  skipDelayDuration?: number;  // Delay when moving between tooltips
  disableHoverableContent?: boolean; // Disable hovering over content
}
```

### Tooltip Props

```typescript
interface TooltipProps {
  open?: boolean;              // Controlled open state
  defaultOpen?: boolean;       // Uncontrolled default
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;      // Override provider delay (default: 200ms)
  disableHoverableContent?: boolean;
}
```

### TooltipTrigger Props

```typescript
interface TooltipTriggerProps {
  asChild?: boolean;           // Render as child element
  className?: string;
}
```

### TooltipContent Props

```typescript
interface TooltipContentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';  // Content size variant
  side?: 'top' | 'right' | 'bottom' | 'left';  // Preferred side
  sideOffset?: number;         // Distance from trigger (default: 4)
  align?: 'start' | 'center' | 'end';  // Alignment on side
  alignOffset?: number;        // Offset from alignment
  showArrow?: boolean;         // Show arrow (default: false)
  className?: string;
}
```

### TooltipArrow Props

```typescript
interface TooltipArrowProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';  // Arrow size variant
  className?: string;
}
```

## Styling

### Color Scheme

Following updated shadcn/ui recommendation (2025-09-22):
- Background: `bg-foreground` (inverted for contrast)
- Text: `text-background` (inverted for readability)
- Arrow: `fill-foreground` (matches content background)

### Size Variants

| Size | Padding | Font Size | Arrow | Use Case |
|------|---------|-----------|-------|----------|
| `xs` | px-2 py-1 | text-xs | 8x4px | Dense UI, icon hints |
| `sm` | px-2.5 py-1 | text-xs | 10x6px | Compact hints |
| `md` | px-3 py-1.5 | text-sm | 12x6px | Default |
| `lg` | px-4 py-2 | text-sm | 16x8px | Rich content |

### Animation

CSS-based animations using Tailwind:
- **Enter**: `fade-in-0 zoom-in-95` with directional slide
- **Exit**: `fade-out-0 zoom-out-95`
- **Direction-aware**: Slides from opposite side (e.g., `side=bottom` slides from top)

### Positioning

Handled by Radix UI with collision detection:
- `side`: Preferred placement (top, right, bottom, left)
- `align`: Alignment on the side axis (start, center, end)
- `sideOffset`: Gap between trigger and tooltip (default: 4px)
- Automatic flip when colliding with viewport

## Accessibility

- Built on Radix UI tooltip primitives (WAI-ARIA compliant)
- Keyboard accessible (shows on focus)
- Proper `role="tooltip"` on content
- `aria-describedby` linking trigger to content
- Dismissible with Escape key

## Dependencies

- `@radix-ui/react-tooltip` - Accessible tooltip primitives
- `class-variance-authority` - Variant management
- `@aidan/ui/lib/utils` - `cn()` utility

## License

MIT © Aidan