import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

// ============================================================================
// Animated Chevron Component - Standalone reusable component with morphing animation
// ============================================================================

/**
 * Animation presets for the chevron morphing
 * - smooth: Default, gentle deceleration (MD3 standard)
 * - bounce: Slight overshoot for playful feel
 * - sharp: Quick and snappy for responsive UI
 */
export type ChevronAnimationPreset = "smooth" | "bounce" | "sharp";

/**
 * Direction the chevron points when closed
 */
export type ChevronDirection = "down" | "up" | "left" | "right";

/**
 * Chevron size variants matching button icon sizes
 */
const animatedChevronVariants = cva(
  ["shrink-0 pointer-events-none", "text-muted-foreground"].join(" "),
  {
    variants: {
      size: {
        xs: "size-3.5",
        sm: "size-4",
        md: "size-4",
        lg: "size-5",
        xl: "size-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AnimatedChevronProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof animatedChevronVariants> {
  /**
   * Whether the chevron is in the "open" state
   * When open, the chevron morphs to point in the opposite direction
   * @default false
   */
  open?: boolean;
  /**
   * Animation preset for the chevron morphing
   * @default "smooth"
   */
  animation?: ChevronAnimationPreset;
  /**
   * Direction the chevron points when closed
   * @default "down"
   */
  direction?: ChevronDirection;
}

/**
 * Get stroke dasharray/dashoffset for morphing animation
 * The chevron morphs by animating the stroke along the path
 */
const getAnimationStyle = (animation: ChevronAnimationPreset) => {
  const styles = {
    smooth: {
      transitionDuration: "300ms",
      transitionTimingFunction: "cubic-bezier(0, 0, 0, 1)",
    },
    bounce: {
      transitionDuration: "400ms",
      transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
    sharp: {
      transitionDuration: "200ms",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  };
  return styles[animation];
};

/**
 * Get base rotation based on direction
 */
const getRotation = (direction: ChevronDirection): number => {
  const rotations = {
    down: 0,
    up: 180,
    left: 90,
    right: -90,
  };
  return rotations[direction];
};

/**
 * AnimatedChevron - A standalone animated chevron indicator with morphing animation
 *
 * Features a unique animation where the chevron shape morphs by pivoting
 * the left and right segments around their anchor points, creating a smooth
 * flip effect rather than a simple rotation.
 *
 * Can be used independently in dropdowns, accordions, expandable sections, etc.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AnimatedChevron open={isOpen} />
 *
 * // With animation preset
 * <AnimatedChevron open={isOpen} animation="bounce" />
 *
 * // With size variant
 * <AnimatedChevron open={isOpen} size="lg" />
 *
 * // Different direction
 * <AnimatedChevron open={isOpen} direction="right" />
 * ```
 */
const AnimatedChevron = React.forwardRef<SVGSVGElement, AnimatedChevronProps>(
  (
    {
      className,
      open = false,
      animation = "smooth",
      direction = "down",
      size,
      ...props
    },
    ref
  ) => {
    const animationStyle = getAnimationStyle(animation);
    const baseRotation = getRotation(direction);

    // The chevron morphs by transitioning the path points
    // When closed (down): M6 9 L12 15 L18 9 (pointing down)
    // When open (up): M6 15 L12 9 L18 15 (pointing up)
    // The animation interpolates the Y values of the path points

    return (
      <svg
        ref={ref}
        data-slot="animated-chevron"
        data-state={open ? "open" : "closed"}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(animatedChevronVariants({ size }), className)}
        style={{
          transform: `rotate(${baseRotation}deg)`,
        }}
        {...props}
      >
        {/* Left segment - pivots around top-left point (6, 9) */}
        <path
          d={open ? "M6 15 L12 9" : "M6 9 L12 15"}
          style={{
            transformOrigin: "6px 12px",
            transitionProperty: "d",
            ...animationStyle,
          }}
        />
        {/* Right segment - pivots around top-right point (18, 9) */}
        <path
          d={open ? "M12 9 L18 15" : "M12 15 L18 9"}
          style={{
            transformOrigin: "18px 12px",
            transitionProperty: "d",
            ...animationStyle,
          }}
        />
      </svg>
    );
  }
);
AnimatedChevron.displayName = "AnimatedChevron";

// ============================================================================
// Exports
// ============================================================================

export { AnimatedChevron, animatedChevronVariants };
