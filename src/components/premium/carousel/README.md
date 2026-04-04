# Carousel

A flexible, accessible carousel component with multiple transition effects. Built on top of [embla-carousel-react](https://www.embla-carousel.com/), following Material Design 3 patterns and shadcn/ui conventions.

## Features

- 🎬 **Multiple transition types**: slide, fade, zoom, flip
- 📱 **Responsive**: Show different items per view at different breakpoints
- 👆 **Touch support**: Swipe gestures with momentum scrolling
- ⌨️ **Keyboard navigation**: Arrow keys, Home, End
- ♿ **Accessible**: ARIA attributes, screen reader support
- 🔌 **Extensible**: Plugin support (autoplay, etc.)
- 🎨 **Customizable**: Multiple indicator styles, gap options

## Installation

The carousel requires `embla-carousel-react` and optionally `embla-carousel-autoplay`:

```bash
npm install embla-carousel-react embla-carousel-autoplay
```

## Basic Usage

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@agentix/ui";

function MyCarousel() {
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

## Transitions

### Slide (Default)

Standard horizontal sliding transition:

```tsx
<Carousel transition="slide">
  {/* ... */}
</Carousel>
```

### Fade

Cross-fade between slides. Best for single-item carousels:

```tsx
<Carousel transition="fade" transitionDuration={400}>
  <CarouselContent className="relative h-64">
    {items.map((item, index) => (
      <CarouselItem key={item.id} index={index} className="absolute inset-0">
        {item.content}
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>
```

> **Note**: Fade transition requires `index` prop on items and `relative h-*` on content.

### Zoom

Scale effect with fade for dynamic entrance:

```tsx
<Carousel transition="zoom" transitionDuration={400}>
  {/* ... */}
</Carousel>
```

### Flip

3D card flip animation:

```tsx
<div style={{ perspective: "1000px" }}>
  <Carousel transition="flip" transitionDuration={500}>
    {/* ... */}
  </Carousel>
</div>
```

## Responsive Layouts

### Using Tailwind Classes

```tsx
<CarouselItem className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
  Content
</CarouselItem>
```

### Using Basis Prop

```tsx
<CarouselItem basis="1/3">
  Content
</CarouselItem>
```

### Align Start for Multiple Items

```tsx
<Carousel opts={{ align: "start" }}>
  <CarouselContent>
    <CarouselItem className="basis-1/3">...</CarouselItem>
  </CarouselContent>
</Carousel>
```

## Indicators

### Dots (Default)

```tsx
<Carousel>
  {/* ... */}
  <CarouselIndicators variant="dots" />
</Carousel>
```

### Lines

```tsx
<CarouselIndicators variant="lines" />
```

### Numbers

```tsx
<CarouselIndicators variant="numbers" />
```

### Progress Bar

```tsx
<CarouselProgress />
```

### Counter

```tsx
<CarouselCounter format="{current} of {total}" />
```

## Autoplay

Use the `embla-carousel-autoplay` plugin:

```tsx
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

function AutoplayCarousel() {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      {/* ... */}
    </Carousel>
  );
}
```

## Infinite Loop

```tsx
<Carousel opts={{ loop: true }}>
  {/* ... */}
</Carousel>
```

## Gap Options

```tsx
<Carousel gap="sm">  {/* Small gap */}
<Carousel gap="md">  {/* Medium gap (default) */}
<Carousel gap="lg">  {/* Large gap */}
<Carousel gap="none"> {/* No gap */}
```

## Controlled Carousel

```tsx
import { useState, useEffect } from "react";
import { Carousel, CarouselApi } from "@agentix/ui";

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
        {/* ... */}
      </Carousel>
      <p>Current slide: {current + 1}</p>
      <button onClick={() => api?.scrollTo(0)}>Go to first</button>
    </div>
  );
}
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowLeft` | Previous slide |
| `ArrowRight` | Next slide |
| `Home` | First slide |
| `End` | Last slide |

## Accessibility

The carousel implements WCAG carousel patterns:

- Root has `role="region"` and `aria-roledescription="carousel"`
- Each slide has `role="group"` and `aria-roledescription="slide"`
- Slides announce their position (e.g., "1 of 5")
- Indicators use `role="tablist"` with `role="tab"` buttons
- Counter uses `aria-live="polite"` for screen reader announcements

## API Reference

### Carousel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `opts` | `EmblaOptionsType` | - | Embla carousel options |
| `plugins` | `EmblaPluginType[]` | - | Embla plugins |
| `transition` | `"slide" \| "fade" \| "zoom" \| "flip"` | `"slide"` | Transition animation |
| `transitionDuration` | `number` | `300` | Duration in ms |
| `setApi` | `(api) => void` | - | API callback |
| `onSlideChange` | `(index) => void` | - | Slide change callback |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `gap` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` | Item gap |
| `aria-label` | `string` | `"Carousel"` | ARIA label |

### CarouselItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `basis` | `"full" \| "1/2" \| "1/3" \| "1/4" \| "1/5" \| "auto"` | `"full"` | Item width |
| `index` | `number` | - | Index for transitions |

### CarouselIndicators Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"dots" \| "lines" \| "numbers"` | `"dots"` | Style variant |
| `position` | `"bottom" \| "top"` | `"bottom"` | Position |

### CarouselCounter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `format` | `string` | `"{current} / {total}"` | Display format |

## Examples

### Image Gallery

```tsx
<Carousel opts={{ loop: true }}>
  <CarouselContent>
    {images.map((image) => (
      <CarouselItem key={image.id}>
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-64 object-cover rounded-lg"
        />
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
  <CarouselIndicators />
</Carousel>
```

### Product Carousel

```tsx
<Carousel opts={{ align: "start" }}>
  <CarouselContent>
    {products.map((product) => (
      <CarouselItem
        key={product.id}
        className="basis-full sm:basis-1/2 lg:basis-1/3"
      >
        <Card>
          <CardContent>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </CardContent>
        </Card>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

### Hero Carousel with Autoplay

```tsx
import Autoplay from "embla-carousel-autoplay";

function HeroCarousel() {
  const plugin = useRef(Autoplay({ delay: 5000 }));

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{ loop: true }}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {heroSlides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative h-96">
              <img
                src={slide.image}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-8 left-8 text-white">
                <h2 className="text-3xl font-bold">{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselIndicators />
    </Carousel>
  );
}
```
