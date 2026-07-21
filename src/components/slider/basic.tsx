"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * Slider root variants using CVA
 * Implements Material Design 3 slider patterns with proper states and styling
 */
const sliderVariants = cva(
  [
    "relative flex touch-none select-none group",
    // Focus states handled on thumb
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ].join(" "),
  {
    variants: {
      /**
       * Orientation of the slider
       * - horizontal: Left to right slider (default)
       * - vertical: Bottom to top slider
       */
      orientation: {
        horizontal: "w-full items-center",
        vertical: "h-full flex-col items-center",
      },
      /**
       * Size variants following MD3 specifications
        * Basic slider API supports: xs, sm, md
       */
      size: {
        xs: "",
        sm: "",
        md: "",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "xs",
    },
  }
);

/**
 * Slider track variants
 * The track shows the full range of values
 * MD3 Specs:
 * - Track heights: XS=16dp, S=24dp, M=40dp
 * - Track shapes (border-radius): XS=8dp, S=8dp, M=12dp
 * - Inactive track color: Secondary Container
 */
const sliderTrackVariants = cva(
  [
    "relative grow overflow-visible",
    // Inactive track color - MD3: secondary-container
    "bg-secondary",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "w-full",
        vertical: "h-full",
      },
      size: {
        xs: "", // 16dp
        sm: "", // 24dp
        md: "", // 40dp
      },
    },
    compoundVariants: [
      // Horizontal orientation - height and border-radius per M3 spec
      { orientation: "horizontal", size: "xs", className: "h-4 rounded-lg" }, // 16px, 8px radius
      { orientation: "horizontal", size: "sm", className: "h-6 rounded-lg" }, // 24px, 8px radius
      { orientation: "horizontal", size: "md", className: "h-10 rounded-xl" }, // 40px, 12px radius
      // Vertical orientation - width and border-radius per M3 spec
      { orientation: "vertical", size: "xs", className: "w-4 rounded-lg" },
      { orientation: "vertical", size: "sm", className: "w-6 rounded-lg" },
      { orientation: "vertical", size: "md", className: "w-10 rounded-xl" },
    ],
    defaultVariants: {
      orientation: "horizontal",
      size: "xs",
    },
  }
);

/**
 * Slider range variants
 * The active portion of the track
 * MD3: Active track color is Primary
 */
const sliderRangeVariants = cva(
  [
    "absolute",
    // Active track color - MD3: primary
    "bg-primary",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "h-full",
        vertical: "w-full",
      },
      size: {
        xs: "",
        sm: "",
        md: "",
      },
    },
    compoundVariants: [
      // Match track border radius per size
      { orientation: "horizontal", size: "xs", className: "rounded-lg" },
      { orientation: "horizontal", size: "sm", className: "rounded-lg" },
      { orientation: "horizontal", size: "md", className: "rounded-xl" },
      { orientation: "vertical", size: "xs", className: "rounded-lg" },
      { orientation: "vertical", size: "sm", className: "rounded-lg" },
      { orientation: "vertical", size: "md", className: "rounded-xl" },
    ],
    defaultVariants: {
      orientation: "horizontal",
      size: "xs",
    },
  }
);

/**
 * Slider thumb variants - Bar style (MD3 default)
 * The draggable handle - MD3: vertical pill/capsule shape
 * MD3 Specs:
 * - Handle width: 4dp (always)
 * - Handle heights: XS=44dp, S=44dp, M=52dp
 * - Handle color: Primary (filled)
 * - Handle changes shape when pressed (narrows to 2dp width)
 */
const sliderThumbVariants = cva(
  [
    "relative block before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
    // MD3: Primary filled handle
    "bg-primary",
    // Tightly rounded capsule shape - smaller radius for tighter corners
    "rounded-[0.125rem]", // 2px radius for tighter top/bottom corners
    "ring-offset-background",
    // Focus ring - no ring when focused, handle gets narrower on focus
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    // Remove all focus ring styles
    "disabled:pointer-events-none disabled:opacity-50",
    // MD3 Motion - handle narrows on press
    "transition-[width,height]",
    "duration-100",
    // Remove default shadows for clean M3 look
    "shadow-none",
  ].join(" "),
  {
    variants: {
      /**
       * Handle sizes following MD3 specifications
       * Width is always 4dp (1 = 0.25rem), height varies
       */
      size: {
        xs: "w-1 h-11", // 4px × 44px
        sm: "w-1 h-11", // 4px × 44px
        md: "w-1 h-[3.25rem]", // 4px × 52px
      },
      orientation: {
        horizontal: "",
        vertical: "",
      },
    },
    compoundVariants: [
      // Vertical orientation - swap width and height
      { orientation: "vertical", size: "xs", className: "h-1 w-11" },
      { orientation: "vertical", size: "sm", className: "h-1 w-11" },
      { orientation: "vertical", size: "md", className: "h-1 w-[3.25rem]" },
    ],
    defaultVariants: {
      size: "xs",
      orientation: "horizontal",
    },
  }
);

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get gap size between handle and track (1.5x handle width = 6px)
 */
function getGapSize(): string {
  return "6px";
}

/**
 * Get border radius based on size
 */
function getBorderRadius(size: SliderProps["size"]): string {
  switch (size) {
    case "xs":
    case "sm":
      return "8px"; // rounded-lg (0.5rem = 8px)
    case "md":
      return "12px"; // rounded-xl (0.75rem = 12px)
    default:
      return "8px";
  }
}

// ============================================================================
// Types
// ============================================================================

export interface SliderProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
      "orientation"
    >,
    VariantProps<typeof sliderVariants> {
  /**
   * Additional class names for the track
   */
  trackClassName?: string;
  /**
   * Additional class names for the range
   */
  rangeClassName?: string;
  /**
   * Additional class names for the thumb(s)
   */
  thumbClassName?: string;
}

// ============================================================================
// Internal Components
// ============================================================================

/**
 * Helper component for range sliders with proper gap styling
 */
function RangeComponent({
  orientation,
  size,
  currentValue,
  min,
  max,
}: {
  orientation: "horizontal" | "vertical";
  size: SliderProps["size"];
  currentValue: number[];
  min: number;
  max: number;
}) {
  const [start, end] = currentValue;
  const percentageStart = ((start - min) / (max - min)) * 100;
  const percentageEnd = ((end - min) / (max - min)) * 100;
  const borderRadius = getBorderRadius(size);

  if (orientation === "horizontal") {
    return (
      <>
        {/* Inactive track at start */}
        <div
          className={cn(
            sliderTrackVariants({ orientation: "horizontal", size }),
            "absolute top-0 left-0 bg-secondary"
          )}
          style={{
            width: `calc(${percentageStart}% + 6px)`,
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
          }}
        />
        
        {/* Active range */}
        <div
          className={cn(
            sliderRangeVariants({ orientation: "horizontal", size }),
            "absolute top-0 bg-primary"
          )}
          style={{
            left: `calc(${percentageStart}% + 6px)`,
            width: `calc(${percentageEnd - percentageStart}% - 12px)`,
            borderRadius: "4px",
          }}
        />
        
        {/* Inactive track at end */}
        <div
          className={cn(
            sliderTrackVariants({ orientation: "horizontal", size }),
            "absolute top-0 right-0 bg-secondary"
          )}
          style={{
            width: `calc(${100 - percentageEnd}% + 6px)`,
            borderTopRightRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
          }}
        />
      </>
    );
  } else {
    return (
      <>
        {/* Inactive track at bottom */}
        <div
          className={cn(
            sliderTrackVariants({ orientation: "vertical", size }),
            "absolute bottom-0 left-0 bg-secondary"
          )}
          style={{
            height: `calc(${percentageStart}% + 6px)`,
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
          }}
        />
        
        {/* Active range */}
        <div
          className={cn(
            sliderRangeVariants({ orientation: "vertical", size }),
            "absolute bottom-0 bg-primary"
          )}
          style={{
            bottom: `calc(${percentageStart}% + 6px)`,
            height: `calc(${percentageEnd - percentageStart}% - 12px)`,
            borderRadius: "4px",
          }}
        />
        
        {/* Inactive track at top */}
        <div
          className={cn(
            sliderTrackVariants({ orientation: "vertical", size }),
            "absolute top-0 left-0 bg-secondary"
          )}
          style={{
            height: `calc(${100 - percentageEnd}% + 6px)`,
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px",
          }}
        />
      </>
    );
  }
}

// ============================================================================
// Component
// ============================================================================

/**
 * Slider - A slider component for selecting values from a range
 * following Material Design 3 specifications.
 *
 * Basic slider API features:
 * - Single value or range selection (multiple thumbs)
 * - Three sizes: xs, sm, md
 * - Horizontal and vertical orientations
 * - Bar handle shape (MD3 default)
 * - Handle that narrows on press/click
 * - Gap styling between handle and track
 * - Full keyboard navigation and accessibility
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Slider defaultValue={[50]} />
 *
 * // Range slider
 * <Slider defaultValue={[25, 75]} />
 *
 * // Different sizes
 * <Slider defaultValue={[50]} size="md" />
 *
 * // Vertical orientation
 * <Slider defaultValue={[50]} orientation="vertical" className="h-48" />
 * ```
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      orientation = "horizontal",
      size = "xs",
      trackClassName,
      rangeClassName,
      thumbClassName,
      defaultValue,
      value,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      onValueChange,
      onValueCommit,
      ...props
    },
    ref
  ) => {
    // Track internal state for uncontrolled component
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? [min]
    );

    // Use controlled value if provided, otherwise use internal state
    const currentValue = value ?? internalValue;

    // Handle value change
    const handleValueChange = React.useCallback(
      (newValue: number[]) => {
        if (value === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [value, onValueChange]
    );

    // Track pressed thumb for animation
    const [pressedThumb, setPressedThumb] = React.useState<number | null>(null);

    return (
      <SliderPrimitive.Root
        ref={ref}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        orientation={orientation === "vertical" ? "vertical" : "horizontal"}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        onValueCommit={onValueCommit}
        className={cn(sliderVariants({ orientation, size }), className)}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            sliderTrackVariants({ orientation, size }),
            trackClassName
          )}
        >
          {/* Active range with inner corner radius for gap effect */}
          {currentValue.length > 1 ? (
            <RangeComponent
              orientation={orientation as "horizontal" | "vertical"}
              size={size}
              currentValue={currentValue}
              min={min}
              max={max}
            />
          ) : (
            /* Single value slider - use original Range primitive */
            <SliderPrimitive.Range
              data-slot="slider-range"
              className={cn(
                sliderRangeVariants({ orientation, size }),
                rangeClassName
              )}
              style={{
                // Add margin to create visual gap from handle
                [orientation === "horizontal" ? "marginRight" : "marginTop"]: getGapSize(),
                // MD3 border radius specifications
                ...(orientation === "horizontal" ? {
                  borderTopLeftRadius: getBorderRadius(size),
                  borderBottomLeftRadius: getBorderRadius(size),
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                } : {
                  borderBottomLeftRadius: getBorderRadius(size),
                  borderBottomRightRadius: getBorderRadius(size),
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                }),
              }}
            />
          )}
        </SliderPrimitive.Track>

        {/* Thumbs */}
        {currentValue.map((_, index: number) => {
          const isPressed = pressedThumb === index;
          
          return (
            <SliderPrimitive.Thumb
              key={index}
              data-slot="slider-thumb"
              className={cn(
                sliderThumbVariants({ size, orientation }),
                // Bar handle: narrows when pressed
                isPressed && (orientation === "horizontal" ? "!w-0.5" : "!h-0.5"),
                thumbClassName
              )}
              onPointerDown={() => setPressedThumb(index)}
              onPointerUp={() => setPressedThumb(null)}
              onPointerCancel={() => setPressedThumb(null)}
            />
          );
        })}
      </SliderPrimitive.Root>
    );
  }
);

Slider.displayName = "Slider";

// ============================================================================
// Exports
// ============================================================================

export {
  Slider,
  sliderVariants,
  sliderTrackVariants,
  sliderRangeVariants,
  sliderThumbVariants,
  // Export helpers used by the advanced slider implementation.
  getBorderRadius,
  getGapSize,
  RangeComponent,
};
