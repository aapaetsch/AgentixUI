import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicators,
  CarouselProgress,
  CarouselCounter,
  type CarouselApi,
} from "./index";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../card";

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A flexible, accessible carousel component with multiple transition effects.
Built on top of embla-carousel-react, following Material Design 3 patterns.

## Features
- Multiple transition types: slide, fade, zoom, flip
- Responsive item sizing
- Touch/swipe support
- Keyboard navigation (Arrow keys, Home, End)
- Optional autoplay via plugin
- Dot, line, and number indicators
- Progress bar and counter components
- Full accessibility support
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    transition: {
      control: "select",
      options: ["slide", "fade", "zoom", "flip"],
      description: "Transition animation type",
    },
    transitionDuration: {
      control: { type: "number", min: 100, max: 1000, step: 50 },
      description: "Transition duration in milliseconds",
    },
    gap: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
      description: "Gap between carousel items",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Sample Data
// ============================================================================

const sampleImages = [
  { id: 1, src: "https://picsum.photos/seed/1/800/400", alt: "Sample image 1" },
  { id: 2, src: "https://picsum.photos/seed/2/800/400", alt: "Sample image 2" },
  { id: 3, src: "https://picsum.photos/seed/3/800/400", alt: "Sample image 3" },
  { id: 4, src: "https://picsum.photos/seed/4/800/400", alt: "Sample image 4" },
  { id: 5, src: "https://picsum.photos/seed/5/800/400", alt: "Sample image 5" },
];

const sampleProducts = [
  { id: 1, name: "Wireless Headphones", price: 149.99, image: "https://picsum.photos/seed/prod1/300/300" },
  { id: 2, name: "Smart Watch", price: 299.99, image: "https://picsum.photos/seed/prod2/300/300" },
  { id: 3, name: "Laptop Stand", price: 79.99, image: "https://picsum.photos/seed/prod3/300/300" },
  { id: 4, name: "Mechanical Keyboard", price: 129.99, image: "https://picsum.photos/seed/prod4/300/300" },
  { id: 5, name: "USB-C Hub", price: 59.99, image: "https://picsum.photos/seed/prod5/300/300" },
  { id: 6, name: "Webcam HD", price: 89.99, image: "https://picsum.photos/seed/prod6/300/300" },
];

const testimonials = [
  { id: 1, name: "Sarah Johnson", role: "Product Manager", quote: "This component library has completely transformed our development workflow. The carousel is incredibly smooth!" },
  { id: 2, name: "Michael Chen", role: "Frontend Developer", quote: "The best carousel implementation I've used. Accessible, customizable, and easy to integrate." },
  { id: 3, name: "Emily Rodriguez", role: "UX Designer", quote: "Love the attention to detail in the animations. It feels native and polished." },
];

// ============================================================================
// Basic Stories
// ============================================================================

/**
 * Default carousel with navigation arrows
 */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Carousel>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

/**
 * Carousel with dot indicators
 */
export const WithIndicators: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Carousel className="pb-12">
        <CarouselContent>
          {sampleImages.map((image) => (
            <CarouselItem key={image.id}>
              <div className="p-1">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselIndicators />
      </Carousel>
    </div>
  ),
};

// ============================================================================
// Transition Stories
// ============================================================================

/**
 * Default slide transition (embla native)
 */
export const SlideTransition: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Carousel transition="slide">
        <CarouselContent>
          {sampleImages.map((image) => (
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
    </div>
  ),
};

/**
 * Fade transition - elegant cross-fade between slides
 */
export const FadeTransition: Story = {
  render: () => {
    // For fade to work properly, we need to render items with indexes
    const items = sampleImages.map((image, index) => ({
      ...image,
      index,
    }));

    return (
      <div className="w-full max-w-xl">
        <Carousel transition="fade" transitionDuration={500} opts={{ loop: true }} className="pb-12">
          {/* Container needs explicit height since fade items are position absolute */}
          <CarouselContent className="h-64">
            {items.map((image) => (
              <CarouselItem key={image.id} index={image.index}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselIndicators />
        </Carousel>
      </div>
    );
  },
};

/**
 * Zoom transition - scale effect with fade
 */
export const ZoomTransition: Story = {
  render: () => {
    const items = sampleImages.map((image, index) => ({
      ...image,
      index,
    }));

    return (
      <div className="w-full max-w-xl">
        <Carousel transition="zoom" transitionDuration={500} className="pb-12">
          <CarouselContent>
            {items.map((image) => (
              <CarouselItem key={image.id} index={image.index}>
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
      </div>
    );
  },
};

/**
 * Flip transition - 3D card flip effect
 */
export const FlipTransition: Story = {
  render: () => {
    const items = sampleImages.map((image, index) => ({
      ...image,
      index,
    }));

    return (
      <div className="w-full max-w-xl">
        <Carousel transition="flip" transitionDuration={600} opts={{ loop: true }} className="pb-12">
          <CarouselContent className="h-64">
            {items.map((image) => (
              <CarouselItem key={image.id} index={image.index}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselIndicators />
        </Carousel>
      </div>
    );
  },
};

// ============================================================================
// Responsive Stories
// ============================================================================

/**
 * Multiple items per view using basis classes
 */
export const MultipleItems: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {sampleProducts.map((product) => (
            <CarouselItem key={product.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-md mb-3"
                    />
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-muted-foreground">${product.price}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </div>
  ),
};

/**
 * Responsive carousel with different items per breakpoint
 */
export const ResponsiveItems: Story = {
  render: () => (
    <div className="w-full max-w-5xl">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </div>
  ),
};

// ============================================================================
// Indicator Variants
// ============================================================================

/**
 * Line-style indicators
 */
export const LineIndicators: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Carousel className="pb-12">
        <CarouselContent>
          {sampleImages.map((image) => (
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
        <CarouselIndicators variant="lines" />
      </Carousel>
    </div>
  ),
};

/**
 * Number indicators
 */
export const NumberIndicators: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Carousel className="pb-12">
        <CarouselContent>
          {sampleImages.map((image) => (
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
        <CarouselIndicators variant="numbers" />
      </Carousel>
    </div>
  ),
};

/**
 * Progress bar indicator
 */
export const WithProgressBar: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Carousel className="pb-8">
        <CarouselContent>
          {sampleImages.map((image) => (
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
        <CarouselProgress />
      </Carousel>
    </div>
  ),
};

// ============================================================================
// Autoplay
// ============================================================================

/**
 * Carousel with autoplay functionality
 */
export const WithAutoplay: Story = {
  render: () => {
    const plugin = React.useRef(
      Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    return (
      <div className="w-full max-w-xl">
        <Carousel
          plugins={[plugin.current]}
          className="pb-12"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {sampleImages.map((image) => (
              <CarouselItem key={image.id}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselIndicators />
        </Carousel>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Hover to pause autoplay
        </p>
      </div>
    );
  },
};

// ============================================================================
// Infinite Loop
// ============================================================================

/**
 * Infinite loop carousel
 */
export const InfiniteLoop: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Carousel opts={{ loop: true }} className="pb-12">
        <CarouselContent>
          {sampleImages.map((image) => (
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
    </div>
  ),
};

// ============================================================================
// Gap Variants
// ============================================================================

/**
 * Small gap between items
 */
export const SmallGap: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Carousel gap="sm" opts={{ align: "start" }}>
        <CarouselContent>
          {sampleProducts.map((product) => (
            <CarouselItem key={product.id} basis="1/3">
              <Card>
                <CardContent className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-md mb-3"
                  />
                  <h3 className="font-medium">{product.name}</h3>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </div>
  ),
};

/**
 * Large gap between items
 */
export const LargeGap: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Carousel gap="lg" opts={{ align: "start" }}>
        <CarouselContent>
          {sampleProducts.map((product) => (
            <CarouselItem key={product.id} basis="1/3">
              <Card>
                <CardContent className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-md mb-3"
                  />
                  <h3 className="font-medium">{product.name}</h3>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </div>
  ),
};

// ============================================================================
// Content Examples
// ============================================================================

/**
 * Image carousel (hero style)
 */
export const ImageCarousel: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Carousel opts={{ loop: true }} className="pb-12">
        <CarouselContent>
          {sampleImages.map((image) => (
            <CarouselItem key={image.id}>
              <div className="relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-80 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Image {image.id}</h3>
                  <p className="text-white/80">Beautiful landscape photography</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" colorStyle="ghost" />
        <CarouselNext className="right-4" colorStyle="ghost" />
        <CarouselIndicators />
      </Carousel>
    </div>
  ),
};

/**
 * Card carousel for products
 */
export const CardCarousel: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {sampleProducts.map((product) => (
            <CarouselItem key={product.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card interactive>
                  <CardContent className="p-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-lg font-semibold text-primary">
                        ${product.price}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </div>
  ),
};

/**
 * Testimonial carousel
 */
export const TestimonialCarousel: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Carousel opts={{ loop: true }} className="pb-12">
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id}>
              <Card variant="filled" className="mx-4">
                <CardContent className="p-8 text-center">
                  <blockquote className="text-lg italic mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselIndicators variant="dots" />
      </Carousel>
    </div>
  ),
};

// ============================================================================
// Controlled Carousel
// ============================================================================

/**
 * Controlled carousel with external state
 */
export const ControlledCarousel: Story = {
  render: function ControlledCarouselStory() {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
      if (!api) return;

      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());

      const onSelect = () => {
        setCurrent(api.selectedScrollSnap());
      };

      api.on("select", onSelect);
      
      return () => {
        api.off("select", onSelect);
      };
    }, [api]);

    return (
      <div className="w-full max-w-xl">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        {/* External counter using API state */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="text-sm font-medium text-muted-foreground tabular-nums">
            Slide {current + 1} of {count}
          </span>
        </div>
        {/* External navigation buttons */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                index === current
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              onClick={() => api?.scrollTo(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

// ============================================================================
// Without Arrows
// ============================================================================

/**
 * Carousel without navigation arrows (indicators only)
 */
export const WithoutArrows: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Carousel opts={{ loop: true }} className="pb-12">
        <CarouselContent>
          {sampleImages.map((image) => (
            <CarouselItem key={image.id}>
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover rounded-lg"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselIndicators />
      </Carousel>
      <p className="text-center text-sm text-muted-foreground">
        Swipe or use keyboard arrows to navigate
      </p>
    </div>
  ),
};

// ============================================================================
// All Indicator Types
// ============================================================================

/**
 * Comparison of all indicator types
 */
export const IndicatorComparison: Story = {
  render: () => (
    <div className="space-y-12 w-full max-w-xl">
      <div>
        <h3 className="text-sm font-medium mb-2">Dots (default)</h3>
        <Carousel className="pb-12">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center">
                    <span className="text-2xl">{index + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselIndicators variant="dots" />
        </Carousel>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Lines</h3>
        <Carousel className="pb-12">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center">
                    <span className="text-2xl">{index + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselIndicators variant="lines" />
        </Carousel>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Numbers</h3>
        <Carousel className="pb-12">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center">
                    <span className="text-2xl">{index + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselIndicators variant="numbers" />
        </Carousel>
      </div>
    </div>
  ),
};
