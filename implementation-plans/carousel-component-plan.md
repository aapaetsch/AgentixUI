# Carousel Component Implementation Plan

> **Tier:** Premium  
> **Priority:** Low (as per roadmap)  
> **Dependencies:** `embla-carousel-react`, `embla-carousel-autoplay` (optional plugin)

---

## Overview

A flexible, accessible carousel component with multiple animated transition options following Material Design 3 principles and shadcn/ui patterns. The component supports responsive layouts, touch/swipe gestures, keyboard navigation, and optional autoplay functionality.

---

## Design Research Summary

### Material Design 3 Carousel Patterns

MD3 defines several carousel variants:

1. **Multi-browse Carousel** - Shows multiple items at once, with the focal item being largest
2. **Uncontained Carousel** - Items scroll freely without snapping, edge items fade/clip
3. **Hero Carousel** - Single large item with navigation indicators
4. **Full-screen Carousel** - Takes entire viewport, common for onboarding

**Key MD3 Principles:**
- Items should have consistent spacing (8dp recommended)
- Use masking/clipping on edge items to indicate more content
- Support swipe gestures with momentum-based scrolling
- Navigation controls should be clearly visible but not intrusive
- Indicators (dots/thumbnails) help users understand position

### shadcn/ui Carousel Implementation

shadcn/ui uses `embla-carousel-react` as the foundation, providing:
- Compound component pattern (`Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`)
- React Context for sharing carousel state
- Plugin system for extensibility (autoplay, fade, etc.)
- Keyboard navigation (arrow keys)
- ARIA attributes for accessibility

---

## Component Architecture

### File Structure

```
src/components/carousel/
├── index.tsx              # Main component exports
├── Carousel.stories.tsx   # Storybook stories
├── agents.md              # AI agent context
└── README.md              # Human documentation
```

### Component Hierarchy

```
<Carousel>                    # Root provider + container
  <CarouselContent>           # Scrollable track
    <CarouselItem />          # Individual slide
    <CarouselItem />
    ...
  </CarouselContent>
  <CarouselPrevious />        # Navigation button (optional)
  <CarouselNext />            # Navigation button (optional)
  <CarouselIndicators />      # Dot indicators (optional)
</Carousel>
```

---

## Props Interface Design

### Carousel (Root)

```typescript
interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Embla carousel options
   * @see https://www.embla-carousel.com/api/options/
   */
  opts?: EmblaOptionsType;
  
  /**
   * Embla plugins (autoplay, fade, etc.)
   */
  plugins?: EmblaPluginType[];
  
  /**
   * Transition animation type
   * @default "slide"
   */
  transition?: "slide" | "fade" | "zoom" | "flip";
  
  /**
   * Transition duration in milliseconds
   * @default 300
   */
  transitionDuration?: number;
  
  /**
   * Callback to access the carousel API
   */
  setApi?: (api: EmblaCarouselType) => void;
  
  /**
   * Callback when active slide changes
   */
  onSlideChange?: (index: number) => void;
  
  /**
   * Size variant affecting spacing and controls
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  
  /**
   * Whether to show navigation arrows
   * @default true
   */
  showArrows?: boolean;
  
  /**
   * Whether to show dot indicators
   * @default false
   */
  showIndicators?: boolean;
  
  /**
   * Position of navigation arrows
   * @default "sides"
   */
  arrowPosition?: "sides" | "bottom" | "bottom-right";
}
```

### CarouselContent

```typescript
interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Gap between carousel items
   * @default "md" (1rem)
   */
  gap?: "none" | "sm" | "md" | "lg";
}
```

### CarouselItem

```typescript
interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Basis width for responsive sizing
   * Controls how many items are visible at once
   * @default "full" (1 item per view)
   */
  basis?: "full" | "1/2" | "1/3" | "1/4" | "1/5" | "auto";
  
  /**
   * Responsive basis overrides
   * @example { sm: "full", md: "1/2", lg: "1/3" }
   */
  responsiveBasis?: {
    sm?: CarouselItemProps["basis"];
    md?: CarouselItemProps["basis"];
    lg?: CarouselItemProps["basis"];
    xl?: CarouselItemProps["basis"];
  };
}
```

### CarouselIndicators

```typescript
interface CarouselIndicatorsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Indicator style variant
   * @default "dots"
   */
  variant?: "dots" | "lines" | "numbers";
  
  /**
   * Position of indicators
   * @default "bottom"
   */
  position?: "bottom" | "top";
}
```

### Navigation Buttons

```typescript
interface CarouselNavigationProps extends React.ComponentProps<typeof Button> {
  /**
   * Icon to display (defaults to chevron)
   */
  icon?: React.ReactNode;
}
```

---

## Animation Transition Types

### 1. Slide (Default)

Standard horizontal sliding transition using CSS transforms.

```css
/* Handled by embla-carousel natively */
transition: transform var(--motion-duration-medium) var(--motion-easing-standard);
```

**Characteristics:**
- Smooth horizontal translation
- Items slide in/out of view
- Natural momentum from swipe gestures
- Best for multi-item carousels

### 2. Fade

Cross-fade between slides with opacity transitions.

```css
.carousel-item {
  opacity: 0;
  transition: opacity var(--motion-duration-long) ease-in-out;
}

.carousel-item[data-active="true"] {
  opacity: 1;
}
```

**Characteristics:**
- Elegant for hero/single-item carousels
- Works best with single item per view
- No horizontal movement
- Requires embla-carousel-fade plugin or custom implementation

### 3. Zoom

Scale effect combined with fade for a dynamic entrance.

```css
.carousel-item {
  opacity: 0;
  transform: scale(0.85);
  transition: 
    opacity var(--motion-duration-long) ease-out,
    transform var(--motion-duration-long) var(--motion-easing-emphasized);
}

.carousel-item[data-active="true"] {
  opacity: 1;
  transform: scale(1);
}
```

**Characteristics:**
- Impactful visual effect
- Items scale up as they become active
- Best for featured content/hero sections
- May need reduced motion alternative

### 4. Flip

3D rotation effect for card-like transitions.

```css
.carousel-item {
  transform: perspective(1000px) rotateY(90deg);
  opacity: 0;
  transition: 
    transform var(--motion-duration-long) var(--motion-easing-emphasized),
    opacity var(--motion-duration-medium) ease;
}

.carousel-item[data-active="true"] {
  transform: perspective(1000px) rotateY(0);
  opacity: 1;
}
```

**Characteristics:**
- Card flip animation
- 3D perspective effect
- Best for single-item carousels
- Requires transform-style: preserve-3d

---

## Responsive Behavior

### Breakpoint Strategy

| Breakpoint | Screen Width | Default Items Per View |
|------------|--------------|------------------------|
| Base       | < 640px      | 1 item                 |
| sm         | ≥ 640px      | 1-2 items              |
| md         | ≥ 768px      | 2-3 items              |
| lg         | ≥ 1024px     | 3-4 items              |
| xl         | ≥ 1280px     | 4-5 items              |

### Implementation Approach

Use Tailwind's responsive prefixes on `CarouselItem`:

```tsx
<CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
  {/* Content */}
</CarouselItem>
```

Or use the `responsiveBasis` prop:

```tsx
<CarouselItem 
  responsiveBasis={{ 
    sm: "full", 
    md: "1/2", 
    lg: "1/3" 
  }}
>
  {/* Content */}
</CarouselItem>
```

### Touch/Swipe Behavior

- **Mobile (< 768px):** Full swipe support with momentum
- **Tablet (768px - 1024px):** Touch + mouse drag support
- **Desktop (> 1024px):** Arrow navigation primary, drag secondary

---

## Accessibility Implementation

### ARIA Attributes

```tsx
<div
  role="region"
  aria-roledescription="carousel"
  aria-label="Product images"
>
  <div role="group" aria-roledescription="slide" aria-label="1 of 5">
    {/* Slide content */}
  </div>
</div>
```

### Keyboard Navigation

| Key        | Action                          |
|------------|---------------------------------|
| ArrowLeft  | Go to previous slide            |
| ArrowRight | Go to next slide                |
| Home       | Go to first slide               |
| End        | Go to last slide                |
| Tab        | Navigate through focusable items|
| Enter/Space| Activate focused control        |

### Screen Reader Announcements

- Announce current slide position: "Slide 2 of 5"
- Announce when autoplay is active
- Provide pause/play controls for autoplay

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .carousel-item {
    transition: none !important;
  }
}
```

---

## Autoplay Feature (Optional)

### Configuration

```typescript
interface AutoplayOptions {
  /**
   * Delay between slides in milliseconds
   * @default 4000
   */
  delay?: number;
  
  /**
   * Stop autoplay on user interaction
   * @default true
   */
  stopOnInteraction?: boolean;
  
  /**
   * Stop autoplay on mouse enter
   * @default true
   */
  stopOnMouseEnter?: boolean;
  
  /**
   * Resume autoplay on mouse leave
   * @default true
   */
  playOnInit?: boolean;
}
```

### Usage

```tsx
import Autoplay from "embla-carousel-autoplay";

<Carousel
  plugins={[
    Autoplay({ delay: 4000, stopOnInteraction: true })
  ]}
>
  {/* ... */}
</Carousel>
```

---

## CVA Variants Definition

```typescript
const carouselVariants = cva(
  [
    "relative w-full",
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const carouselContentVariants = cva(
  [
    "flex",
    "transition-transform",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      gap: {
        none: "",
        sm: "-ml-2",
        md: "-ml-4",
        lg: "-ml-6",
      },
    },
    defaultVariants: {
      gap: "md",
    },
  }
);

const carouselItemVariants = cva(
  [
    "min-w-0 shrink-0 grow-0",
    "transition-[opacity,transform]",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      basis: {
        full: "basis-full",
        "1/2": "basis-1/2",
        "1/3": "basis-1/3",
        "1/4": "basis-1/4",
        "1/5": "basis-1/5",
        auto: "basis-auto",
      },
      gap: {
        none: "",
        sm: "pl-2",
        md: "pl-4",
        lg: "pl-6",
      },
    },
    defaultVariants: {
      basis: "full",
      gap: "md",
    },
  }
);

const carouselIndicatorVariants = cva(
  [
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      variant: {
        dots: [
          "size-2 rounded-full bg-muted-foreground/30",
          "data-[active=true]:bg-primary data-[active=true]:scale-125",
        ].join(" "),
        lines: [
          "h-1 w-6 rounded-full bg-muted-foreground/30",
          "data-[active=true]:bg-primary data-[active=true]:w-8",
        ].join(" "),
        numbers: [
          "size-6 rounded-full text-xs font-medium",
          "bg-muted text-muted-foreground",
          "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "dots",
    },
  }
);
```

---

## Implementation Steps

### Phase 1: Core Foundation
1. Install `embla-carousel-react` dependency
2. Create base `Carousel` component with Context provider
3. Implement `CarouselContent` scrollable container
4. Implement `CarouselItem` with basis variants
5. Add `CarouselPrevious` and `CarouselNext` navigation buttons

### Phase 2: Animation Transitions
1. Implement default slide transition (embla native)
2. Add fade transition effect with custom hooks
3. Add zoom transition effect
4. Add flip transition effect (3D)
5. Add reduced motion fallbacks

### Phase 3: Indicators & Controls
1. Implement `CarouselIndicators` component
2. Add dots, lines, and numbers variants
3. Wire up indicator clicks to navigation
4. Add keyboard navigation handlers

### Phase 4: Responsive & Touch
1. Implement responsive basis with breakpoint props
2. Verify touch/swipe behavior
3. Add drag cursor states
4. Test across devices

### Phase 5: Autoplay & Polish
1. Document autoplay plugin usage
2. Add pause-on-hover behavior
3. Add screen reader announcements
4. Final accessibility audit

### Phase 6: Documentation
1. Create comprehensive Storybook stories
2. Write agents.md with component context
3. Write README.md with usage examples
4. Update ROADMAP.md status

---

## Storybook Stories Outline

```typescript
// Carousel.stories.tsx

export default {
  title: "Premium/Carousel",
  component: Carousel,
} satisfies Meta<typeof Carousel>;

// Basic usage
export const Default: Story = {};

// Transition types
export const SlideTransition: Story = {};
export const FadeTransition: Story = {};
export const ZoomTransition: Story = {};
export const FlipTransition: Story = {};

// Responsive layouts
export const SingleItem: Story = {};
export const MultipleItems: Story = {};
export const ResponsiveItems: Story = {};

// Navigation variants
export const WithArrows: Story = {};
export const WithDotIndicators: Story = {};
export const WithLineIndicators: Story = {};
export const WithNumberIndicators: Story = {};
export const ArrowPositions: Story = {};

// Features
export const WithAutoplay: Story = {};
export const InfiniteLoop: Story = {};
export const CustomGap: Story = {};

// Content examples
export const ImageCarousel: Story = {};
export const CardCarousel: Story = {};
export const TestimonialCarousel: Story = {};
export const ProductCarousel: Story = {};

// Sizes
export const SmallSize: Story = {};
export const MediumSize: Story = {};
export const LargeSize: Story = {};

// States
export const DisabledNavigation: Story = {};
export const Loading: Story = {};

// Accessibility
export const KeyboardNavigation: Story = {};
export const ReducedMotion: Story = {};
```

---

## Dependencies to Add

```json
{
  "dependencies": {
    "embla-carousel-react": "^8.x.x"
  },
  "devDependencies": {
    "embla-carousel-autoplay": "^8.x.x"
  }
}
```

---

## Usage Examples

### Basic Carousel

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@agentix/ui";

function BasicCarousel() {
  return (
    <Carousel>
      <CarouselContent>
        <CarouselItem>Slide 1</CarouselItem>
        <CarouselItem>Slide 2</CarouselItem>
        <CarouselItem>Slide 3</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
```

### Responsive Card Carousel

```tsx
function ResponsiveCardCarousel() {
  return (
    <Carousel showIndicators>
      <CarouselContent gap="md">
        {products.map((product) => (
          <CarouselItem 
            key={product.id}
            className="basis-full sm:basis-1/2 lg:basis-1/3"
          >
            <Card>
              <CardMedia src={product.image} alt={product.name} />
              <CardContent>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>${product.price}</CardDescription>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
```

### Fade Transition with Autoplay

```tsx
import Autoplay from "embla-carousel-autoplay";

function HeroCarousel() {
  return (
    <Carousel
      transition="fade"
      plugins={[Autoplay({ delay: 5000 })]}
      showIndicators
      showArrows={false}
    >
      <CarouselContent>
        {heroImages.map((image, index) => (
          <CarouselItem key={index}>
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-[400px] object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
```

### Controlled Carousel

```tsx
function ControlledCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index}>{item}</CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <p>Current slide: {current + 1}</p>
    </div>
  );
}
```

---

## Testing Checklist

### Functionality
- [ ] Slides navigate correctly with arrows
- [ ] Slides navigate correctly with indicators
- [ ] Touch/swipe works on mobile
- [ ] Mouse drag works on desktop
- [ ] Infinite loop works when enabled
- [ ] Autoplay starts/stops correctly
- [ ] Autoplay pauses on hover

### Responsive
- [ ] Single item view on mobile
- [ ] Multiple items on tablet/desktop
- [ ] Breakpoint transitions are smooth
- [ ] Touch targets are accessible (44x44px min)

### Transitions
- [ ] Slide transition works smoothly
- [ ] Fade transition works smoothly
- [ ] Zoom transition works smoothly
- [ ] Flip transition works smoothly
- [ ] Reduced motion disables animations

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces slides
- [ ] Focus management is correct
- [ ] ARIA attributes are present
- [ ] Color contrast meets WCAG AA

### Performance
- [ ] No layout shifts during transitions
- [ ] Smooth 60fps animations
- [ ] Lazy loading works for images
- [ ] No memory leaks on unmount

---

## Estimated Effort

| Phase | Estimated Time |
|-------|----------------|
| Phase 1: Core Foundation | 3-4 hours |
| Phase 2: Animation Transitions | 2-3 hours |
| Phase 3: Indicators & Controls | 2 hours |
| Phase 4: Responsive & Touch | 1-2 hours |
| Phase 5: Autoplay & Polish | 1-2 hours |
| Phase 6: Documentation | 2-3 hours |
| **Total** | **11-16 hours** |

---

## References

- [Material Design 3 Carousel](https://m3.material.io/components/carousel/overview)
- [Embla Carousel Documentation](https://www.embla-carousel.com/)
- [shadcn/ui Carousel](https://ui.shadcn.com/docs/components/carousel)
- [WCAG Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
