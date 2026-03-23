"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Button } from "../../free/button";

// ============================================================================
// Types
// ============================================================================

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

/**
 * Transition animation types for carousel
 */
type CarouselTransition = "slide" | "fade" | "zoom" | "flip";

/**
 * Size variants for carousel
 */
type CarouselSize = "sm" | "md" | "lg";

/**
 * Gap variants for carousel content
 */
type CarouselGap = "none" | "sm" | "md" | "lg";

/**
 * Indicator variants
 */
type IndicatorVariant = "dots" | "lines" | "numbers";

// ============================================================================
// Context
// ============================================================================

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  scrollSnaps: number[];
  transition: CarouselTransition;
  transitionDuration: number;
  size: CarouselSize;
  gap: CarouselGap;
  opts?: CarouselOptions;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

/**
 * Hook to access carousel context
 * @throws Error if used outside of Carousel component
 */
function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

// ============================================================================
// Carousel Variants
// ============================================================================

const carouselVariants = cva(
  [
    "relative w-full",
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
    "cursor-pointer",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      variant: {
        dots: [
          "size-2 rounded-full bg-muted-foreground/30",
          "hover:bg-muted-foreground/50",
          "data-[active=true]:bg-primary data-[active=true]:scale-125",
        ].join(" "),
        lines: [
          "h-1 w-6 rounded-full bg-muted-foreground/30",
          "hover:bg-muted-foreground/50",
          "data-[active=true]:bg-primary data-[active=true]:w-8",
        ].join(" "),
        numbers: [
          "size-6 rounded-full text-xs font-medium",
          "flex items-center justify-center",
          "bg-muted text-muted-foreground",
          "hover:bg-muted/80",
          "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "dots",
    },
  }
);

// ============================================================================
// Carousel Component
// ============================================================================

export interface CarouselProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof carouselVariants> {
  /**
   * Embla carousel options
   * @see https://www.embla-carousel.com/api/options/
   */
  opts?: CarouselOptions;

  /**
   * Embla plugins (autoplay, etc.)
   */
  plugins?: CarouselPlugin;

  /**
   * Transition animation type
   * @default "slide"
   */
  transition?: CarouselTransition;

  /**
   * Transition duration in milliseconds
   * @default 450
   */
  transitionDuration?: number;

  /**
   * Callback to access the carousel API
   */
  setApi?: (api: CarouselApi) => void;

  /**
   * Callback when active slide changes
   */
  onSlideChange?: (index: number) => void;

  /**
   * Gap between carousel items
   * @default "md"
   */
  gap?: CarouselGap;

  /**
   * ARIA label for the carousel region
   */
  "aria-label"?: string;
}

/**
 * Carousel - A flexible carousel component with multiple transition effects
 *
 * Follows Material Design 3 patterns and shadcn/ui conventions.
 * Built on top of embla-carousel-react for robust carousel functionality.
 *
 * @example
 * ```tsx
 * <Carousel>
 *   <CarouselContent>
 *     <CarouselItem>Slide 1</CarouselItem>
 *     <CarouselItem>Slide 2</CarouselItem>
 *     <CarouselItem>Slide 3</CarouselItem>
 *   </CarouselContent>
 *   <CarouselPrevious />
 *   <CarouselNext />
 * </Carousel>
 * ```
 */
function Carousel({
  opts,
  plugins,
  transition = "slide",
  transitionDuration = 450,
  setApi,
  onSlideChange,
  size,
  gap = "md",
  className,
  children,
  "aria-label": ariaLabel = "Carousel",
  ...props
}: CarouselProps) {
  // Ensure non-null values for context
  const resolvedSize: CarouselSize = size ?? "md";
  const resolvedGap: CarouselGap = gap ?? "md";
  
  // For fade/flip transitions, disable embla's native scroll animation
  // so our CSS transitions can take over smoothly
  const isFadeOrFlip = transition === "fade" || transition === "flip";
  
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: "x",
      // Smoother drag experience
      dragFree: opts?.dragFree ?? false,
      // For fade/flip, use instant jumps so CSS handles animation
      duration: isFadeOrFlip ? 0 : (opts?.duration ?? 25),
    },
    plugins
  );

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const onSelect = React.useCallback(
    (emblaApi: CarouselApi) => {
      if (!emblaApi) return;

      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());

      onSlideChange?.(emblaApi.selectedScrollSnap());
    },
    [onSlideChange]
  );

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      } else if (event.key === "Home") {
        event.preventDefault();
        scrollTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        scrollTo(scrollSnaps.length - 1);
      }
    },
    [scrollPrev, scrollNext, scrollTo, scrollSnaps.length]
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;

    setScrollSnaps(api.scrollSnapList());
    onSelect(api);

    api.on("reInit", onSelect);
    api.on("select", onSelect);
    api.on("reInit", () => setScrollSnaps(api.scrollSnapList()));

    return () => {
      api?.off("select", onSelect);
      api?.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        scrollPrev,
        scrollNext,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
        transition,
        transitionDuration,
        size: resolvedSize,
        gap: resolvedGap,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn(carouselVariants({ size: resolvedSize }), className)}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        data-slot="carousel"
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

// ============================================================================
// CarouselContent Component
// ============================================================================

export interface CarouselContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CarouselContent - Scrollable container for carousel items
 *
 * @example
 * ```tsx
 * <CarouselContent>
 *   <CarouselItem>Item 1</CarouselItem>
 *   <CarouselItem>Item 2</CarouselItem>
 * </CarouselContent>
 * ```
 */
function CarouselContent({
  className,
  ...props
}: CarouselContentProps) {
  const { carouselRef, gap, transition } = useCarousel();

  // For fade/flip transitions, we need a different layout
  const isFadeOrFlip = transition === "fade" || transition === "flip";

  return (
    <div
      ref={carouselRef}
      className={cn(
        "overflow-hidden",
        isFadeOrFlip && "relative"
      )}
      data-slot="carousel-viewport"
    >
      <div
        className={cn(
          carouselContentVariants({ gap }),
          className
        )}
        data-slot="carousel-content"
        {...props}
      />
    </div>
  );
}

// ============================================================================
// CarouselItem Component
// ============================================================================

export interface CarouselItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof carouselItemVariants> {
  /**
   * Index of the item (auto-populated by React.Children.map if needed)
   */
  index?: number;
}

/**
 * CarouselItem - Individual slide within the carousel
 *
 * Supports responsive sizing via Tailwind classes or the basis prop.
 *
 * @example
 * ```tsx
 * // Using basis prop
 * <CarouselItem basis="1/3">Content</CarouselItem>
 *
 * // Using Tailwind responsive classes
 * <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
 *   Content
 * </CarouselItem>
 * ```
 */
function CarouselItem({
  className,
  basis,
  index,
  ...props
}: CarouselItemProps) {
  const { gap, transition, transitionDuration, selectedIndex, scrollSnaps } = useCarousel();

  // Determine if this item is active (for transition effects)
  const isActive = index !== undefined ? index === selectedIndex : false;

  // Transition-specific styles
  const transitionStyles = React.useMemo(() => {
    if (index === undefined) return {};

    // Use longer duration for smoother feel
    const duration = `${transitionDuration}ms`;
    // Smooth easing curve for natural motion
    const easing = "cubic-bezier(0.4, 0, 0.2, 1)";

    switch (transition) {
      case "fade":
        return {
          position: "absolute" as const,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: isActive ? 1 : 0,
          transition: `opacity ${duration} ${easing}`,
          pointerEvents: isActive ? ("auto" as const) : ("none" as const),
          zIndex: isActive ? 1 : 0,
        };
      case "zoom":
        return {
          opacity: isActive ? 1 : 0.6,
          transform: isActive ? "scale(1)" : "scale(0.92)",
          transition: `opacity ${duration} ${easing}, transform ${duration} ${easing}`,
        };
      case "flip":
        return {
          position: "absolute" as const,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: isActive ? 1 : 0,
          transform: isActive
            ? "perspective(1200px) rotateY(0deg)"
            : "perspective(1200px) rotateY(90deg)",
          transition: `opacity ${duration} ${easing}, transform ${duration} ${easing}`,
          transformStyle: "preserve-3d" as const,
          backfaceVisibility: "hidden" as const,
          zIndex: isActive ? 1 : 0,
        };
      default:
        return {};
    }
  }, [transition, transitionDuration, isActive, index]);

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={
        index !== undefined && scrollSnaps.length > 0
          ? `${index + 1} of ${scrollSnaps.length}`
          : undefined
      }
      data-slot="carousel-item"
      data-active={isActive || undefined}
      data-index={index}
      className={cn(
        carouselItemVariants({ basis, gap }),
        // Reduced motion support
        "motion-reduce:transition-none",
        className
      )}
      style={transitionStyles}
      {...props}
    />
  );
}

// ============================================================================
// CarouselPrevious Component
// ============================================================================

export interface CarouselPreviousProps
  extends React.ComponentProps<typeof Button> {
  /**
   * Custom icon to display
   */
  icon?: React.ReactNode;
}

/**
 * CarouselPrevious - Navigation button to go to previous slide
 *
 * @example
 * ```tsx
 * <CarouselPrevious />
 * <CarouselPrevious icon={<ArrowLeftIcon />} />
 * ```
 */
function CarouselPrevious({
  className,
  colorStyle = "outlined",
  size = "md",
  shape = "round",
  icon,
  ...props
}: CarouselPreviousProps) {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      colorStyle={colorStyle}
      size={size}
      shape={shape}
      iconOnly
      className={cn(
        "absolute top-1/2 -translate-y-1/2 left-2 z-10",
        "shadow-md",
        "disabled:opacity-30",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      {icon || <ChevronLeft />}
    </Button>
  );
}

// ============================================================================
// CarouselNext Component
// ============================================================================

export interface CarouselNextProps extends React.ComponentProps<typeof Button> {
  /**
   * Custom icon to display
   */
  icon?: React.ReactNode;
}

/**
 * CarouselNext - Navigation button to go to next slide
 *
 * @example
 * ```tsx
 * <CarouselNext />
 * <CarouselNext icon={<ArrowRightIcon />} />
 * ```
 */
function CarouselNext({
  className,
  colorStyle = "outlined",
  size = "md",
  shape = "round",
  icon,
  ...props
}: CarouselNextProps) {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      colorStyle={colorStyle}
      size={size}
      shape={shape}
      iconOnly
      className={cn(
        "absolute top-1/2 -translate-y-1/2 right-2 z-10",
        "shadow-md",
        "disabled:opacity-30",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      {icon || <ChevronRight />}
    </Button>
  );
}

// ============================================================================
// CarouselIndicators Component
// ============================================================================

export interface CarouselIndicatorsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof carouselIndicatorVariants> {
  /**
   * Position of the indicators
   * @default "bottom"
   */
  position?: "bottom" | "top";
}

/**
 * CarouselIndicators - Dot/line/number indicators for carousel navigation
 *
 * @example
 * ```tsx
 * <CarouselIndicators />
 * <CarouselIndicators variant="lines" />
 * <CarouselIndicators variant="numbers" position="top" />
 * ```
 */
function CarouselIndicators({
  className,
  variant = "dots",
  position = "bottom",
  ...props
}: CarouselIndicatorsProps) {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel();

  if (scrollSnaps.length <= 1) return null;

  return (
    <div
      role="tablist"
      aria-label="Slide indicators"
      data-slot="carousel-indicators"
      className={cn(
        "flex items-center justify-center gap-2",
        "absolute left-1/2 -translate-x-1/2 z-10",
        position === "bottom" ? "bottom-4" : "top-4",
        className
      )}
      {...props}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          role="tab"
          aria-selected={index === selectedIndex}
          aria-label={`Go to slide ${index + 1}`}
          data-active={index === selectedIndex || undefined}
          className={cn(carouselIndicatorVariants({ variant }))}
          onClick={() => scrollTo(index)}
        >
          {variant === "numbers" ? index + 1 : null}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// CarouselProgress Component
// ============================================================================

export interface CarouselProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Position of the progress bar
   * @default "bottom"
   */
  position?: "bottom" | "top";
}

/**
 * CarouselProgress - Progress bar showing carousel scroll position
 *
 * @example
 * ```tsx
 * <CarouselProgress />
 * ```
 */
function CarouselProgress({
  className,
  position = "bottom",
  ...props
}: CarouselProgressProps) {
  const { selectedIndex, scrollSnaps } = useCarousel();

  if (scrollSnaps.length <= 1) return null;

  const progress = ((selectedIndex + 1) / scrollSnaps.length) * 100;

  return (
    <div
      role="progressbar"
      aria-valuenow={selectedIndex + 1}
      aria-valuemin={1}
      aria-valuemax={scrollSnaps.length}
      aria-label={`Slide ${selectedIndex + 1} of ${scrollSnaps.length}`}
      data-slot="carousel-progress"
      className={cn(
        "absolute left-4 right-4 h-1 z-10",
        "bg-muted-foreground/20 rounded-full overflow-hidden",
        position === "bottom" ? "bottom-4" : "top-4",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full bg-primary rounded-full",
          "transition-[width] duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)]"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ============================================================================
// CarouselCounter Component
// ============================================================================

export interface CarouselCounterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Format for displaying the counter
   * @default "{current} / {total}"
   */
  format?: string;
}

/**
 * CarouselCounter - Numeric counter showing current slide position
 *
 * @example
 * ```tsx
 * <CarouselCounter />
 * <CarouselCounter format="{current} of {total}" />
 * ```
 */
function CarouselCounter({
  className,
  format = "{current} / {total}",
  ...props
}: CarouselCounterProps) {
  const { selectedIndex, scrollSnaps } = useCarousel();

  if (scrollSnaps.length <= 1) return null;

  const text = format
    .replace("{current}", String(selectedIndex + 1))
    .replace("{total}", String(scrollSnaps.length));

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      data-slot="carousel-counter"
      className={cn(
        "text-sm font-medium text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    >
      {text}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicators,
  CarouselProgress,
  CarouselCounter,
  useCarousel,
  carouselVariants,
  carouselContentVariants,
  carouselItemVariants,
  carouselIndicatorVariants,
};
