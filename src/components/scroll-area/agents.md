# ScrollArea Component

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely
- Component uses `@radix-ui/react-scroll-area` for accessible scrollbar primitives
- Implements compound component pattern requiring explicit `ScrollBar` components
- Infinite scroll uses `IntersectionObserver` for performance (not scroll event listeners)

A custom scrollbar container with Material Design 3 styling, infinite scroll support, and RTL layout capability.

## Components

### ScrollArea
Root container providing custom scrollbar functionality with optional infinite scroll.

### ScrollAreaViewport
The scrollable viewport container. Typically handled internally but exposed for advanced use cases.

### ScrollBar
Custom scrollbar for vertical or horizontal scrolling. Must be explicitly added for each orientation needed.

## Props

### ScrollArea Props
```typescript
interface ScrollAreaProps {
  // Base props
  size?: 'sm' | 'md' | 'lg';              // Documentation size (default: 'md')
  scrollbarSize?: 'sm' | 'md' | 'lg';     // Scrollbar thickness: sm=4px, md=6px, lg=8px
  rtl?: boolean;                           // Enable RTL direction (default: false)
  
  // Infinite scroll props
  infiniteScrollMode?: 'auto' | 'manual';  // Infinite scroll mode
  onLoadMore?: () => void | Promise<void>; // Callback to load more content
  isLoading?: boolean;                     // Whether content is loading (default: false)
  hasMore?: boolean;                       // Whether more items available (default: false)
  distanceFromBottom?: number;             // Pixels from bottom to trigger auto (default: 100)
  renderLoading?: () => React.ReactNode;   // Custom loading indicator
  loadMoreText?: string;                   // Manual mode button text (default: 'Load more')
  
  // Standard HTML/React props
  className?: string;
  children?: React.ReactNode;
}
```

### ScrollBar Props
```typescript
interface ScrollBarProps {
  orientation?: 'vertical' | 'horizontal'; // Scroll direction (default: 'vertical')
  visibility?: 'auto' | 'always' | 'scroll' | 'hover'; // When visible (default: 'auto')
  size?: 'sm' | 'md' | 'lg';              // Scrollbar thickness (default from context or 'md')
  className?: string;
}
```

## Dependencies
- `@radix-ui/react-scroll-area` - Accessible scroll area primitives
- `class-variance-authority` - Variant management
- `../spinner` - Loading indicator for infinite scroll
- `../button` - Load more button for manual mode
- `../../../lib/utils` - `cn()` utility

## Styling Decisions

### Scrollbar Sizes
| Size | Width/Height | Use Case |
|------|--------------|----------|
| `sm` | 4px | Compact UI, less intrusive |
| `md` | 6px | Default, balanced visibility |
| `lg` | 8px | Touch-friendly, high visibility |

### Visibility Modes
| Mode | Behavior |
|------|----------|
| `auto` | Shows on scroll, hides after delay (default) |
| `always` | Always visible |
| `scroll` | Only visible while actively scrolling |
| `hover` | Only visible on hover over scroll area |

### Infinite Scroll Modes
| Mode | Behavior |
|------|----------|
| `auto` | Triggers `onLoadMore` when sentinel element enters viewport |
| `manual` | Shows "Load more" button that triggers `onLoadMore` on click |

### Scrollbar Colors
- **Track**: Transparent background
- **Thumb**: `bg-border` with `hover:bg-muted-foreground/50`
- **Border**: `border-l-transparent` (vertical) or `border-t-transparent` (horizontal)

### M3 Motion
- **Duration**: 200ms standard (`--motion-duration-medium`)
- **Easing**: `cubic-bezier(0.2, 0, 0, 1)` (`--motion-easing-standard`)
- **Thumb hover**: 100ms color transition (`--motion-duration-short`)

## Maintenance Notes

### Accessibility
- Radix ScrollArea provides built-in keyboard navigation (arrow keys, Home/End)
- ARIA attributes (role="scrollbar", aria-valuenow/min/max) handled automatically
- RTL support respects native browser direction handling
- Focus management preserved during infinite scroll loading

### Compound Component Pattern
- Follows shadcn/ui pattern requiring explicit `ScrollBar` components
- Each orientation (vertical/horizontal) needs its own `ScrollBar` component
- Provides explicit control and avoids orientation detection ambiguity
- Context passes `scrollbarSize` from ScrollArea to ScrollBar children

### Infinite Scroll Implementation
- Uses `IntersectionObserver` for sentinel detection (not scroll events)
- Sentinel element placed at bottom of viewport for intersection detection
- `distanceFromBottom` prop controls how early to trigger in auto mode
- Both modes share same state props (`isLoading`, `hasMore`, `onLoadMore`)
- Custom loading UI via `renderLoading` callback prop

### RTL Support
- Enabled via `rtl` boolean prop (default `false`)
- Applies `dir="rtl"` to root element
- Horizontal scrollbar direction adjusts automatically
- Native browser RTL handling respected

### Edge Cases
- Nested scroll areas work independently
- Context throws error if ScrollBar used outside ScrollArea (gracefully handled)
- Empty content handled gracefully (no scrollbar visible)
- Loading state prevents duplicate `onLoadMore` calls

### CSS Variables Used
```css
--motion-duration-medium   /* 200ms standard */
--motion-duration-short    /* 100ms for quick feedback */
--motion-easing-standard   /* cubic-bezier(0.2, 0, 0, 1) */
```

