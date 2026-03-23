"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../../lib/utils";
import {
  sliderVariants as baseSliderVariants,
  sliderTrackVariants as baseSliderTrackVariants,
  sliderRangeVariants as baseSliderRangeVariants,
  sliderThumbVariants as baseSliderThumbVariants,
  getGapSize,
} from "../../free/slider";

// ============================================================================
// Premium CVA Variants (Extended from Free Tier)
// ============================================================================

/**
 * Premium slider root variants - extends free tier with lg and xl sizes
 */
const premiumSliderVariants = cva(
  [
    "relative flex touch-none select-none group",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "w-full items-center",
        vertical: "h-full flex-col items-center",
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "xs",
    },
  }
);

/**
 * Premium slider track variants - includes lg and xl sizes
 * MD3 Specs:
 * - Track heights: XS=16dp, S=24dp, M=40dp, L=56dp, XL=96dp
 * - Track shapes (border-radius): XS=8dp, S=8dp, M=12dp, L=16dp, XL=28dp
 */
const premiumSliderTrackVariants = cva(
  [
    "relative grow overflow-visible",
    "bg-secondary",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "w-full",
        vertical: "h-full",
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
      },
    },
    compoundVariants: [
      // Horizontal orientation
      { orientation: "horizontal", size: "xs", className: "h-4 rounded-lg" },
      { orientation: "horizontal", size: "sm", className: "h-6 rounded-lg" },
      { orientation: "horizontal", size: "md", className: "h-10 rounded-xl" },
      { orientation: "horizontal", size: "lg", className: "h-14 rounded-2xl" },
      { orientation: "horizontal", size: "xl", className: "h-24 rounded-[1.75rem]" },
      // Vertical orientation
      { orientation: "vertical", size: "xs", className: "w-4 rounded-lg" },
      { orientation: "vertical", size: "sm", className: "w-6 rounded-lg" },
      { orientation: "vertical", size: "md", className: "w-10 rounded-xl" },
      { orientation: "vertical", size: "lg", className: "w-14 rounded-2xl" },
      { orientation: "vertical", size: "xl", className: "w-24 rounded-[1.75rem]" },
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
/**
 * Premium slider range variants - includes lg and xl sizes
 */
const premiumSliderRangeVariants = cva(
  [
    "absolute",
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
        lg: "",
        xl: "",
      },
    },
    compoundVariants: [
      { orientation: "horizontal", size: "xs", className: "rounded-lg" },
      { orientation: "horizontal", size: "sm", className: "rounded-lg" },
      { orientation: "horizontal", size: "md", className: "rounded-xl" },
      { orientation: "horizontal", size: "lg", className: "rounded-2xl" },
      { orientation: "horizontal", size: "xl", className: "rounded-[1.75rem]" },
      { orientation: "vertical", size: "xs", className: "rounded-lg" },
      { orientation: "vertical", size: "sm", className: "rounded-lg" },
      { orientation: "vertical", size: "md", className: "rounded-xl" },
      { orientation: "vertical", size: "lg", className: "rounded-2xl" },
      { orientation: "vertical", size: "xl", className: "rounded-[1.75rem]" },
    ],
    defaultVariants: {
      orientation: "horizontal",
      size: "xs",
    },
  }
);

/**
 * Premium slider thumb variants - Bar style with lg and xl sizes
 * MD3 Specs:
 * - Handle width: 4dp (always)
 * - Handle heights: XS=44dp, S=44dp, M=52dp, L=68dp, XL=108dp
 */
const premiumSliderThumbVariants = cva(
  [
    "relative block",
    "bg-primary",
    "rounded-[0.125rem]",
    "ring-offset-background",
    "focus:outline-none focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "transition-[width,height]",
    "duration-100",
    "shadow-none",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "w-1 h-11",
        sm: "w-1 h-11",
        md: "w-1 h-[3.25rem]",
        lg: "w-1 h-[4.25rem]",
        xl: "w-1 h-[6.75rem]",
      },
      orientation: {
        horizontal: "",
        vertical: "",
      },
    },
    compoundVariants: [
      { orientation: "vertical", size: "xs", className: "h-1 w-11" },
      { orientation: "vertical", size: "sm", className: "h-1 w-11" },
      { orientation: "vertical", size: "md", className: "h-1 w-[3.25rem]" },
      { orientation: "vertical", size: "lg", className: "h-1 w-[4.25rem]" },
      { orientation: "vertical", size: "xl", className: "h-1 w-[6.75rem]" },
    ],
    defaultVariants: {
      size: "xs",
      orientation: "horizontal",
    },
  }
);

/**
 * State layer for circular knob - matches Switch component hover effect
 */
const sliderThumbCircularStateLayerVariants = cva(
  [
    "absolute rounded-full pointer-events-none",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Center the state layer on the knob
    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "bg-foreground/[0.08]",
    "group-hover:opacity-100",
    "opacity-0",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-8", // 32px - larger than 20px knob for hover effect
      },
    },
  }
);

/**
 * Slider thumb variants - Circular style (alternate)
 * Traditional circular handle option
 */
const SliderThumbCircularVariants = cva(
  [
    "relative block",
    // MD3: Primary filled handle
    "bg-primary",
    // Circular shape
    "rounded-full",
    "ring-offset-background",
    // Focus ring - no ring when focused, handle gets narrower on focus
    "focus:outline-none focus-visible:outline-none",
    // Remove all focus ring styles
    "disabled:pointer-events-none disabled:opacity-50",
    // Motion
    "transition-transform",
    "duration-100",
    // Subtle shadow for depth
    "shadow-md",
  ].join(" "),
  {
    variants: {
      /**
       * Circular handle only available for xs size
       */
      size: {
        xs: "size-5", // 20px
      },
    },
  }
);

/**
 * Slider thumb variants - Knobless style
 * No visible handle, the track itself is interactive
 */
const sliderThumbKnoblessVariants = cva(
  [
    // Invisible thumb but still interactive
    "opacity-0 pointer-events-none",
    // Remove all visual styling
    "bg-transparent",
    "border-none",
    "shadow-none",
    "outline-none",
    // No transitions needed as it's invisible
  ].join(" "),
  {
    variants: {
      size: {
        xs: "w-0 h-0",
        sm: "w-0 h-0", 
        md: "w-0 h-0",
        lg: "w-0 h-0",
        xl: "w-0 h-0",
      },
      }
  }
);

/**
 * Value indicator variants
 * Optional tooltip showing current value
 * MD3 Specs:
 * - Label container height: 44dp
 * - Label container width: 48dp
 * - Background: Inverse surface
 * - Text: Inverse on surface
 */
const valueIndicatorVariants = cva(
  [
    "absolute z-10",
    // MD3: Inverse surface with inverse on surface text
    "rounded-full bg-foreground",
    "font-medium text-background",
    "flex items-center justify-center",
    // Animation
    "transition-all",
    "duration-200",
    // Drop shadow
    "shadow-lg",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "-top-14 left-1/2 -translate-x-1/2",
        vertical: "left-full ml-4 top-1/2 -translate-y-1/2",
      },
      /**
       * Size variants for value indicator
       */
      indicatorSize: {
        sm: "min-w-8 h-8 px-2 text-xs",
        md: "min-w-12 h-11 px-4 text-sm",
        lg: "min-w-14 h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      indicatorSize: "md",
    },
  }
);

/**
 * Stop indicator variants
 * Optional dots showing discrete values
 * MD3 Specs:
 * - Stop indicator size: 4dp (consistent across all sizes)
 * - Stop indicator shape: full (circle)
 * - Inactive color: On Secondary Container
 * - Active (selected) color: On Primary
 * - Trailing space: 4dp
 */
const stopIndicatorVariants = cva(
  [
    "absolute rounded-full",
    "pointer-events-none",
    // Transition
    "transition-colors",
    "duration-150",
    // MD3: 4dp size
    "size-1",
  ].join(" "),
  {
    variants: {
      /**
       * Active state changes color per MD3 spec
       */
      active: {
        true: "bg-primary-foreground", // MD3: on-primary
        false: "bg-muted-foreground", // MD3: on-secondary-container
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

/**
 * Inset icon container variants
 * MD3: Icon inside the track that moves based on handle position
 * Only available for M, L, XL sizes (not XS or S)
 */
const insetIconVariants = cva(
  [
    "absolute flex items-center justify-center",
    "pointer-events-none",
    "transition-all",
    "duration-200",
    "text-primary-foreground",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "hidden", // Not supported for XS
        sm: "hidden", // Not supported for S
        md: "[&>svg]:size-6", // 24dp
        lg: "[&>svg]:size-6", // 24dp
        xl: "[&>svg]:size-8", // 32dp
      },
      /**
       * Position based on whether icon is in active or inactive track
       */
      position: {
        active: "", // In the active (primary) track
        inactive: "", // In the inactive (secondary) track
      },
    },
    defaultVariants: {
      size: "md",
      position: "active",
    },
  }
);

// ============================================================================
// Types
// ============================================================================

export interface PremiumSliderProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
      "orientation"
    >,
    VariantProps<typeof premiumSliderVariants> {
  /**
   * Whether to show value indicator(s) above/beside the thumb(s)
   * - "always": Always visible
   * - "hover": Visible on hover/focus
   * - "never": Never shown (default)
   * @default "never"
   */
  showValueIndicator?: "always" | "hover" | "never";
  /**
   * Custom format function for value indicator
   * @param value - Current value
   * @returns Formatted string to display
   */
  formatValue?: (value: number) => string;
  /**
   * Size of the value indicator
   * @default "md"
   */
  valueIndicatorSize?: "sm" | "md" | "lg";
  /**
   * Whether to show stop indicators for discrete steps
   * Only applies when `step` is defined
   * @default false
   */
  showStops?: boolean;
  /**
   * Handle shape variant
   * - "bar": Vertical pill/bar shape (default, MD3 style)
   * - "circular": Traditional circular handle (only available with xs size)
   * - "knobless": No visible handle (track fills as value changes)
   * @default "bar"
   */
  handleShape?: "bar" | "circular" | "knobless";
  /**
   * Inset icon to display within the track (MD3 feature)
   * Only available for md, lg, xl sizes (not xs or sm)
   * Icon moves between active/inactive track based on value
   * Note: Not recommended for centered or range sliders
   */
  insetIcon?: React.ReactNode;
  /**
   * Icon to display when slider value is at minimum (e.g., mute icon for volume)
   * Only used when insetIcon is also provided
   */
  insetIconAtMin?: React.ReactNode;
  /**
   * Icon to display when slider value is at maximum
   * Only used when insetIcon is also provided
   */
  insetIconAtMax?: React.ReactNode;
  /**
   * Additional class names for the track
   */
  trackClassName?: string;
  /**
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
// Helper Functions
// ============================================================================

/**
 * Get border radius based on size (extended for premium sizes)
 */
function getPremiumBorderRadius(size: PremiumSliderProps["size"]): string {
  switch (size) {
    case "xs":
    case "sm":
      return "8px";
    case "md":
      return "12px";
    case "lg":
      return "16px";
    case "xl":
      return "28px";
    default:
      return "8px";
  }
}

/**
 * Helper component for range sliders with premium sizes
 */
function PremiumRangeComponent({
  orientation,
  size,
  currentValue,
  min,
  max,
}: {
  orientation: "horizontal" | "vertical";
  size: PremiumSliderProps["size"];
  currentValue: number[];
  min: number;
  max: number;
}) {
  const [start, end] = currentValue;
  const percentageStart = ((start - min) / (max - min)) * 100;
  const percentageEnd = ((end - min) / (max - min)) * 100;
  const borderRadius = getPremiumBorderRadius(size);

  if (orientation === "horizontal") {
    return (
      <>
        {/* Inactive track at start */}
        <div
          className={cn(
            premiumSliderTrackVariants({ orientation: "horizontal", size }),
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
            premiumSliderRangeVariants({ orientation: "horizontal", size }),
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
            premiumSliderTrackVariants({ orientation: "horizontal", size }),
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
            premiumSliderTrackVariants({ orientation: "vertical", size }),
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
            premiumSliderRangeVariants({ orientation: "vertical", size }),
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
            premiumSliderTrackVariants({ orientation: "vertical", size }),
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
 * PremiumSlider - A premium slider component following Material Design 3 patterns
 *
 * Premium Features (in addition to free tier):
 * - Five sizes: xs, sm, md, lg, xl (matching M3 specs)
 * - Handle shapes: bar (default), circular (xs only), knobless
 * - Value indicators with custom formatting and sizing
 * - Stop indicators for discrete steps
 * - Inset icons for larger sizes (md, lg, xl)
 * - Handle that narrows on press/click
 * - Gap styling between handle and track
 * - Full keyboard navigation and accessibility
 *
 * @example
 * ```tsx
 * // Basic usage
 * <PremiumSlider defaultValue={[50]} />
 *
 * // Range slider
 * <PremiumSlider defaultValue={[25, 75]} />
 *
 * // With value indicator
 * <PremiumSlider defaultValue={[50]} showValueIndicator="always" />
 *
 * // Circular handle
 * <PremiumSlider defaultValue={[50]} handleShape="circular" />
 *
 * // With inset icon (volume control)
 * <PremiumSlider defaultValue={[50]} size="md" insetIcon={<Volume2 />} />
 * ```
 */
const PremiumSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  PremiumSliderProps
>(
  (
    {
      className,
      orientation = "horizontal",
      size = "xs",
      showValueIndicator = "never",
      formatValue = (v: number) => String(v),
      valueIndicatorSize = "md",
      showStops = false,
      handleShape = "bar",
      insetIcon,
      insetIconAtMin,
      insetIconAtMax,
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
    // Validate handle shape and size combinations
    const validateHandleShape = React.useCallback(() => {
      if (handleShape === "circular" && size !== "xs") {
        console.warn("Circular handle shape is only available with xs size. Defaulting to bar handle.");
        return "bar";
      }
      return handleShape;
    }, [handleShape, size]);
    
    const actualHandleShape = validateHandleShape();
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

    // Track hover/focus state for value indicator
    const [isHovering, setIsHovering] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [activeThumb, setActiveThumb] = React.useState<number | null>(null);
    const [pressedThumb, setPressedThumb] = React.useState<number | null>(null);
    
    // Combined interaction state for hover behavior
    const isInteracting = isHovering || isFocused;

    // Calculate stop positions for discrete sliders
    const stopPositions = React.useMemo(() => {
      if (!showStops || step <= 0) return [];
      const positions: number[] = [];
      for (let i = min; i <= max; i += step) {
        positions.push(((i - min) / (max - min)) * 100);
      }
      return positions;
    }, [showStops, min, max, step]);

    // Check if a stop is within the active range
    const isStopActive = React.useCallback(
      (position: number) => {
        if (currentValue.length === 1) {
          return position <= ((currentValue[0] - min) / (max - min)) * 100;
        }
        if (currentValue.length === 2) {
          const startPos = ((currentValue[0] - min) / (max - min)) * 100;
          const endPos = ((currentValue[1] - min) / (max - min)) * 100;
          return position >= startPos && position <= endPos;
        }
        return false;
      },
      [currentValue, min, max]
    );

    // Determine if value indicator should be visible
    const shouldShowIndicator = React.useMemo(() => {
      if (showValueIndicator === "always") return true;
      if (showValueIndicator === "hover") return isInteracting;
      return false;
    }, [showValueIndicator, isInteracting]);

    // Check if inset icon should be supported
    const supportsInsetIcon = size === "md" || size === "lg" || size === "xl";
    const showInsetIcon = insetIcon && supportsInsetIcon && currentValue.length === 1;
    
    // Calculate if icon should be in active or inactive track
    // Icon moves to inactive track when there's not enough space on active track
    const activeTrackPercentage = currentValue.length === 1 
      ? ((currentValue[0] - min) / (max - min)) * 100 
      : 0;
    const iconInActiveTrack = activeTrackPercentage >= 15; // Need at least 15% for icon space
    
    // Determine which icon to show based on slider value
    let currentInsetIcon = insetIcon;
    if (currentValue[0] === min && insetIconAtMin) {
      currentInsetIcon = insetIconAtMin;
    } else if (currentValue[0] === max && insetIconAtMax) {
      currentInsetIcon = insetIconAtMax;
    }

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
        className={cn(premiumSliderVariants({ orientation, size }), className)}
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => {
          setIsHovering(false);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setActiveThumb(null);
        }}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            // For circular handle with xs size, use shorter track with proper styling
            ((actualHandleShape === "circular" && size === "xs") 
              ? (orientation === "horizontal" 
                  ? "relative grow overflow-visible bg-secondary w-full h-2 rounded-full" 
                  : "relative grow overflow-visible bg-secondary h-full w-2 rounded-full")
              : premiumSliderTrackVariants({ orientation, size })),
            trackClassName
          )}
        >
          {/* Stop indicators */}
          {showStops &&
            stopPositions.map((position, index) => (
              <span
                key={index}
                data-slot="slider-stop"
                className={cn(
                  stopIndicatorVariants({
                    active: isStopActive(position),
                  }),
                  orientation === "horizontal"
                    ? "top-1/2 -translate-y-1/2"
                    : "left-1/2 -translate-x-1/2",
                )}
                style={{
                  [orientation === "horizontal" ? "left" : "bottom"]:
                    `${position}%`,
                }}
              />
            ))}
          {/* Active range with inner corner radius for gap effect */}
          {currentValue.length > 1 ? (
            <PremiumRangeComponent
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
                ((actualHandleShape === "circular" && size === "xs")
                  ? (orientation === "horizontal" 
                      ? "absolute h-full bg-primary rounded-full" 
                      : "absolute w-full bg-primary rounded-full")
                  : premiumSliderRangeVariants({ orientation, size })),
                rangeClassName
              )}
              style={{
                [orientation === "horizontal" ? "marginRight" : "marginTop"]: getGapSize(),
                ...(orientation === "horizontal" ? {
                  borderTopLeftRadius: getPremiumBorderRadius(size),
                  borderBottomLeftRadius: getPremiumBorderRadius(size),
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                } : {
                  borderBottomLeftRadius: getPremiumBorderRadius(size),
                  borderBottomRightRadius: getPremiumBorderRadius(size),
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                }),
              }}
            />
          )}

          {showInsetIcon && (
            <span
              data-slot="slider-inset-icon"
              className={cn(
                insetIconVariants({ size, position: iconInActiveTrack ? "active" : "inactive" }),
                orientation === "horizontal" 
                  ? "top-1/2 -translate-y-1/2" 
                  : "left-1/2 -translate-x-1/2",
                iconInActiveTrack ? "text-primary-foreground" : "text-muted-foreground",
              )}
              style={{
                [orientation === "horizontal" ? "left" : "bottom"]: "0.5rem",
                transform: orientation === "horizontal" 
                  ? `translateY(-50%) ${iconInActiveTrack ? "" : `translateX(calc(${activeTrackPercentage}%))`}`
                  : `translateX(-50%) ${iconInActiveTrack ? "" : `translateY(calc(${activeTrackPercentage}%))`}`,
                transition: "transform 0.2s ease-out",
              }}
            >
              {currentInsetIcon}
            </span>
          )}
        </SliderPrimitive.Track>

        {/* Thumbs */}
        {currentValue.map((val: number, index: number) => {
          const isPressed = pressedThumb === index;
          const isActive = activeThumb === index;
          
          return (
            <SliderPrimitive.Thumb
              key={index}
              data-slot="slider-thumb"
              className={cn(
                actualHandleShape === "circular" 
                  ? SliderThumbCircularVariants({ size: "xs" })
                  : actualHandleShape === "knobless"
                  ? sliderThumbKnoblessVariants({ size })
                  : premiumSliderThumbVariants({ size, orientation }),
                actualHandleShape === "bar" && isPressed && (orientation === "horizontal" ? "!w-0.5" : "!h-0.5"),
                actualHandleShape === "circular" && isPressed && "scale-90",
                thumbClassName
              )}
              onPointerEnter={() => setActiveThumb(index)}
              onPointerLeave={() => setActiveThumb(null)}
              onPointerDown={() => {
                setActiveThumb(index);
                setPressedThumb(index);
              }}
              onPointerUp={() => setPressedThumb(null)}
              onPointerCancel={() => setPressedThumb(null)}
              onFocus={() => setActiveThumb(index)}
              onBlur={() => setActiveThumb(null)}
            >
              {/* State layer for circular handle */}
              {actualHandleShape === "circular" && (
                <span
                  className={cn(
                    sliderThumbCircularStateLayerVariants({ size: "xs" })
                  )}
                />
              )}
              {/* Value indicator */}
              {shouldShowIndicator && (
                <span
                  data-slot="slider-value-indicator"
                  className={cn(
                    valueIndicatorVariants({ orientation, indicatorSize: valueIndicatorSize }),
                    isActive || showValueIndicator === "always"
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95"
                  )}
                >
                  {formatValue(val)}
                </span>
              )}
            </SliderPrimitive.Thumb>
          );
        })}
      </SliderPrimitive.Root>
    );
  }
);

PremiumSlider.displayName = "PremiumSlider";

// ============================================================================
// Exports
// ============================================================================

// Re-export free tier for backward compatibility
export {
  baseSliderVariants as sliderVariants,
  baseSliderTrackVariants as sliderTrackVariants,
  baseSliderRangeVariants as sliderRangeVariants,
  baseSliderThumbVariants as sliderThumbVariants,
};

// Export premium component and variants
export {
  PremiumSlider,
  premiumSliderVariants,
  premiumSliderTrackVariants,
  premiumSliderRangeVariants,
  premiumSliderThumbVariants,
  SliderThumbCircularVariants,
  sliderThumbCircularStateLayerVariants,
  sliderThumbKnoblessVariants,
  valueIndicatorVariants,
  stopIndicatorVariants,
  insetIconVariants,
};

// Export types

// For backward compatibility, also export PremiumSlider as Slider
export { PremiumSlider as Slider };
export type { PremiumSliderProps as SliderProps };
