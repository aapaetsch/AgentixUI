# Carousel Component - AI Agent Context
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Title
Carousel - Advanced image/content carousel with multiple transition effects

## Props Summary

### Carousel (Root)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `opts` | `EmblaOptionsType` | - | Embla carousel options (loop, align, etc.) |
| `plugins` | `EmblaPluginType[]` | - | Embla plugins (autoplay, etc.) |
| `transition` | `"slide" \| "fade" \| "zoom" \| "flip"` | `"slide"` | Transition animation type |
| `transitionDuration` | `number` | `300` | Transition duration in ms |
| `setApi` | `(api: CarouselApi) => void` | - | Callback to access carousel API |
| `onSlideChange` | `(index: number) => void` | - | Callback when slide changes |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `gap` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` | Gap between items |

### CarouselItem
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `basis` | `"full" \| "1/2" \| "1/3" \| "1/4" \| "1/5" \| "auto"` | `"full"` | Item width basis |
| `index` | `number` | - | Item index (for transition effects) |

### CarouselIndicators
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"dots" \| "lines" \| "numbers"` | `"dots"` | Indicator style |
| `position` | `"bottom" \| "top"` | `"bottom"` | Indicator position |

## Dependencies
- `embla-carousel-react` - Core carousel functionality
- `embla-carousel-autoplay` - Optional autoplay plugin
- `lucide-react` - ChevronLeft, ChevronRight icons
- `class-variance-authority` - CVA for variants
- Internal: `Button`, `cn` utility

## Styling Decisions

### Why embla-carousel?
- Lightweight (~10KB gzipped)
- No CSS dependencies - full control over styling
- Excellent touch/drag support
- Plugin system for extensibility
- Used by shadcn/ui (consistent with project patterns)

### Transition Implementation
- **Slide**: Native embla behavior, no additional CSS needed
- **Fade**: Absolute positioning with opacity transitions
- **Zoom**: Scale transform + opacity for dynamic effect
- **Flip**: 3D perspective rotation for card-like animation

### Gap System
Uses negative margin on container + padding on items pattern:
- Container: `-ml-{gap}` creates offset
- Items: `pl-{gap}` adds spacing back
This allows first item to align with container edge.

### Responsive Design
Items use Tailwind's `basis-*` utilities:
- `basis-full` = 1 item per view
- `basis-1/2` = 2 items
- `basis-1/3` = 3 items
- Use responsive prefixes: `basis-full md:basis-1/2 lg:basis-1/3`

## Component Hierarchy
```
Carousel (Provider + container)
├── CarouselContent (Viewport + track)
│   └── CarouselItem[] (Individual slides)
├── CarouselPrevious (Left navigation)
├── CarouselNext (Right navigation)
├── CarouselIndicators (Dots/lines/numbers)
├── CarouselProgress (Progress bar)
└── CarouselCounter (Numeric counter)
```

## Maintenance Notes

### Known Edge Cases
1. **Fade transition**: Requires items to have `index` prop and container to have `relative h-*` class
2. **Flip transition**: Parent may need `perspective: 1000px` for proper 3D effect
3. **Multiple items**: Use `opts={{ align: "start" }}` for proper alignment
4. **Autoplay**: Import plugin separately, pass to `plugins` prop

### Accessibility
- Root has `role="region"` and `aria-roledescription="carousel"`
- Items have `role="group"` and `aria-roledescription="slide"`
- Keyboard: ArrowLeft/Right, Home, End keys
- Indicators use `role="tablist"` and `role="tab"`
- Counter uses `aria-live="polite"` for announcements

### Performance
- Embla handles virtualization internally
- Use `motion-reduce:transition-none` for reduced motion
- Avoid heavy content in many items

### Extending
To add new transitions:
1. Add type to `CarouselTransition`
2. Add styles in `CarouselItem` `transitionStyles` memo
3. May need wrapper styles (e.g., perspective for 3D)

## Usage Examples

### Basic
```tsx
<Carousel>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

### With Autoplay
```tsx
import Autoplay from "embla-carousel-autoplay";

<Carousel plugins={[Autoplay({ delay: 4000 })]}>
  {/* ... */}
</Carousel>
```

### Responsive
```tsx
<CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3">
  Content
</CarouselItem>
```

## Related Components
- `Card` - Often used as carousel item content
- `Button` - Used for navigation arrows
- `Skeleton` - For loading states

## Version History
- v1.0.0 - Initial implementation with slide/fade/zoom/flip transitions



