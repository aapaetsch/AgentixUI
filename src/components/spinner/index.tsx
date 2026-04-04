import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Spinner variants using CVA
 * Animated loading indicator following M3 patterns
 */
const spinnerVariants = cva(
  [
    "text-current",
  ].join(" "),
  {
    variants: {
      /**
       * Variant types for the spinner
       */
      variant: {
        default: "animate-spin",
        md3: "", // MD3 uses custom animation defined in component
      },
      /**
       * Size variants following MD3 specifications (24dp-240dp)
       * Default is 48dp (md)
       */
      size: {
        xs: "size-6", // 24px
        sm: "size-8", // 32px
        md: "size-12", // 48px (MD3 default)
        lg: "size-24", // 96px
        xl: "size-32", // 128px
        "2xl": "size-60", // 240px (MD3 max)
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {
  /**
   * Accessible label for screen readers
   * @default "Loading"
   */
  label?: string;
  /**
   * Whether to show an outer container background (only for default variant)
   * When true, displays with primary-container background
   * Note: MD3 variant always includes its own circular background
   * @default false
   */
  contained?: boolean;
}

/**
 * Spinner - An animated loading indicator
 *
 * Supports two variants:
 * - default: Classic circular spinner
 * - md3: Material Design 3 morphing shape animation with 7 unique M3 shapes
 *
 * Can be displayed with or without a container background.
 * Inherits color from parent via `currentColor`.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner variant="md3" />
 * <Spinner variant="md3" contained />
 * <Spinner size="lg" />
 * <Button loading>Saving...</Button>
 * ```
 */
const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, variant, label = "Loading", contained = false, ...props }, ref) => {
    // Wrapper for contained variant
    if (contained) {
      return (
        <div
          className={cn(
            "relative inline-flex items-center justify-center rounded-full",
            "bg-primary-container",
            // Container is always 1.25x the indicator size for proper spacing
            size === "xs" && "size-[30px]",
            size === "sm" && "size-10",
            size === "md" && "size-[60px]",
            size === "lg" && "size-[120px]",
            size === "xl" && "size-[160px]",
            size === "2xl" && "size-[300px]",
          )}
          role="status"
          aria-label={label}
        >
          {variant === "md3" ? (
            <MD3LoadingIndicator
              ref={ref}
              className={cn(
                spinnerVariants({ size, variant }),
                "text-on-primary-container",
                className
              )}
              {...props}
            />
          ) : (
            <svg
              ref={ref}
              className={cn(
                spinnerVariants({ size, variant }),
                "text-on-primary-container",
                className
              )}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              {...props}
            >
              <DefaultSpinner />
            </svg>
          )}
        </div>
      );
    }

    if (variant === "md3") {
      return (
        <MD3LoadingIndicator
          ref={ref}
          className={cn(spinnerVariants({ size, variant }), className)}
          role="status"
          aria-label={label}
          {...props}
        />
      );
    }

    return (
      <svg
        ref={ref}
        className={cn(spinnerVariants({ size, variant }), className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label={label}
        {...props}
      >
        <DefaultSpinner />
      </svg>
    );
  }
);

Spinner.displayName = "Spinner";

/**
 * Default circular spinner SVG
 */
const DefaultSpinner = () => (
  <>
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </>
);

/**
 * Material Design 3 Loading Indicator
 * 
 * Implements a morphing shape animation using 7 unique Material 3 shapes with
 * smooth transitions. Includes a circular background container per MD3 specs.
 * 
 * The 7 Material 3 shapes:
 * 1. Circle - Perfect circle
 * 2. Clover4Leaf - Four-leaf clover pattern (rounded, organic)
 * 3. Flower - Organic flower-like shape
 * 4. Cookie4Sided - Soft, puffy four-sided shape
 * 5. Puffy - Pillowed, organic blob
 * 6. PuffyDiamond - Soft diamond shape
 * 7. Clover8Leaf - Eight-leaf clover (back to circle-like)
 * 
 * Uses 14 keyframes with smooth cubic-bezier easing for fluid animations.
 * Additional slow rotation provides visual interest.
 */
const MD3LoadingIndicator = React.forwardRef<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>(
  ({ className, ...props }, ref) => {
    // Generate a unique ID for this instance to avoid clip-path conflicts
    const uniqueId = React.useId();
    const clipId = `md3-morph-${uniqueId}`;

    return (
      <svg
        ref={ref}
        className={className}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <clipPath id={clipId}>
            <path fill="currentColor">
              {/* 
                Animate through 7 Material 3 shapes with 14 keyframes for smoothness
                Standard Material easing: cubic-bezier(0.2, 0, 0, 1)
              */}
              <animate
                attributeName="d"
                dur="1.4s"
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes="0; 0.07; 0.143; 0.214; 0.286; 0.357; 0.429; 0.5; 0.571; 0.643; 0.714; 0.786; 0.857; 0.929; 1"
                keySplines="0.2 0 0 1; 0.2 0 0 1; 0.2 0 0 1; 0.2 0 0 1; 0.2 0 0 1; 0.2 0 0 1; 0.2 0 0 1; 0.2 0 0 1; 0.2 0 0 1; 0.2 0 0 1; 0.2 0 0 1; 0.2 0 0 1; 0.2 0 0 1; 0.2 0 0 1"
                values={md3ShapePathsSmooth.join("; ")}
              />
            </path>
          </clipPath>
        </defs>
        
        {/* Circular background container (MD3 spec: always visible) */}
        <circle
          cx="24"
          cy="24"
          r="24"
          fill="currentColor"
          opacity="0.15"
        />
        
        {/* Active indicator with shape morph */}
        <g clipPath={`url(#${clipId})`}>
          <rect
            x="0"
            y="0"
            width="48"
            height="48"
            fill="currentColor"
          >
            {/* Slow rotation animation for additional visual interest */}
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="2.8s"
              repeatCount="indefinite"
            />
          </rect>
        </g>
      </svg>
    );
  }
);

MD3LoadingIndicator.displayName = "MD3LoadingIndicator";

/**
 * Material Design 3 Shape Paths (Smooth)
 * 
 * These SVG paths represent the 7 unique Material 3 shapes used in the loading indicator.
 * Uses 14 keyframes (2 per shape transition) for smooth, fluid morphing.
 * 
 * Shapes (in order of keyframes):
 * 0-1: Circle
 * 2-3: Clover4Leaf
 * 4-5: Flower
 * 6-7: Cookie4Sided
 * 8-9: Puffy (organic blob)
 * 10-11: PuffyDiamond
 * 12-13: Clover8Leaf
 * 14: Circle (return)
 */
const md3ShapePathsSmooth = [
  // 0. Circle (start)
  "M24 5 C35 5 44 13.5 44 24 C44 34.5 35 43 24 43 C13.5 43 5 34.5 5 24 C5 13.5 13.5 5 24 5 Z",
  
  // 1. Circle to Clover4Leaf (transition)
  "M24 6 C34 6 42.5 14 42.5 24 C42.5 34 34 42 24 42 C14 42 5.5 34 5.5 24 C5.5 14 14 6 24 6 Z",
  
  // 2. Clover4Leaf (full shape - 4 lobes)
  "M24 8 C29 8 32 11 32 16 C32 19 34 20 37 20 C40 20 42 23 42 27 C42 31 39 33 36 33 C33 33 32 34 32 38 C32 42 29 44 24 44 C19 44 16 42 16 38 C16 34 15 33 12 33 C9 33 6 31 6 27 C6 23 8 20 11 20 C14 20 16 19 16 16 C16 11 19 8 24 8 Z",
  
  // 3. Clover4Leaf to Flower (transition)
  "M24 7 C28 7 31 10 32 14 C33 10 36 8 39 9 C42 10 43 14 41 17 C44 19 45 22 44 26 C43 29 40 31 37 30 C39 33 38 37 35 38 C32 39 29 37 28 34 C29 38 27 40 23 40 C20 39 18 37 17 33 C14 35 11 33 9 30 C8 26 9 22 12 20 C11 16 12 12 15 9 C17 6 21 7 24 7 Z",
  
  // 4. Flower (organic 4-petal shape)
  "M24 5 C28 5 31 8 32 13 C33 8 36 6 40 8 C44 10 45 13 43 17 C46 19 47 22 46 27 C45 31 41 33 38 32 C40 36 39 40 35 42 C31 44 28 42 26 38 C27 42 24 45 20 44 C16 43 14 40 15 36 C12 38 9 36 8 31 C6 27 7 23 10 21 C9 17 11 13 15 11 C19 9 23 11 24 5 Z",
  
  // 5. Flower to Cookie4Sided (transition)
  "M24 6 C28 6 32 8 35 11 C38 13 41 15 42 19 C43 23 42 28 40 31 C38 34 35 37 31 39 C28 41 25 42 22 42 C18 42 15 40 12 38 C8 35 6 31 5 27 C5 23 7 18 10 15 C13 11 17 8 21 7 C22 7 23 6 24 6 Z",
  
  // 6. Cookie4Sided (puffy 4-sided shape)
  "M24 7 C29 7 33 9 37 12 C40 15 42 19 42 24 C42 29 40 33 37 36 C33 39 29 41 24 41 C19 41 15 39 12 36 C9 33 6 29 6 24 C6 19 8 15 12 12 C15 9 19 7 24 7 Z",
  
  // 7. Cookie4Sided to Puffy (transition)
  "M24 8 C28 8 32 10 35 13 C37 15 39 18 40 22 C40 25 40 29 38 32 C36 35 33 37 30 38 C28 39 26 39 24 39 C22 39 20 38 18 38 C15 36 13 34 11 31 C9 28 8 24 8 21 C9 17 11 14 13 12 C16 10 19 9 22 8 C23 8 24 8 24 8 Z",
  
  // 8. Puffy (organic blob)
  "M24 9 C28 9 31 11 33 14 C35 16 36 19 36 22 C36 25 35 28 34 30 C33 32 31 34 29 35 C27 36 25 36 24 36 C23 36 21 36 19 35 C17 34 15 32 14 30 C13 28 12 25 12 22 C12 19 13 16 15 14 C17 11 19 10 22 9 C23 9 24 9 24 9 Z",
  
  // 9. Puffy to PuffyDiamond (transition)
  "M24 10 C27 10 30 11 33 14 C35 17 36 20 36 24 C36 28 35 31 33 34 C30 37 27 38 24 38 C21 38 18 37 15 34 C13 31 12 28 12 24 C12 20 13 17 15 14 C18 11 21 10 24 10 Z",
  
  // 10. PuffyDiamond (soft diamond shape)
  "M24 24 C28 20 32 16 24 12 C16 16 20 20 24 24 C20 28 16 32 24 36 C32 32 28 28 24 24",
  
  // 11. PuffyDiamond to Clover8Leaf (transition)
  "M24 14 C28 14 30 16 31 20 C32 18 35 17 37 18 C39 19 40 21 40 24 C40 27 39 29 37 30 C35 31 32 30 31 28 C30 32 28 34 24 34 C20 34 18 32 17 28 C16 30 13 31 11 30 C9 29 8 27 8 24 C8 21 9 19 11 18 C13 17 16 18 17 20 C18 16 20 14 24 14 Z",
  
  // 12. Clover8Leaf (8-leaf clover - circle-like)
  "M24 10 C27 10 29 12 29 15 C29 17 30.5 18 32 18 C34 18 35 20 35 22 C35 24 34 26 32 26 C30.5 26 29 27 29 29 C29 32 27 34 24 34 C21 34 19 32 19 29 C19 27 17.5 26 16 26 C14 26 13 24 13 22 C13 20 14 18 16 18 C17.5 18 19 17 19 15 C19 12 21 10 24 10 Z",
  
  // 13. Clover8Leaf to Circle (transition)
  "M24 8 C28 8 32 10 35 13 C38 16 40 20 40 24 C40 28 38 32 35 35 C32 38 28 40 24 40 C20 40 16 38 13 35 C10 32 8 28 8 24 C8 20 10 16 13 13 C16 10 20 8 24 8 Z",
  
  // 14. Circle (return for seamless loop)
  "M24 5 C35 5 44 13.5 44 24 C44 34.5 35 43 24 43 C13.5 43 5 34.5 5 24 C5 13.5 13.5 5 24 5 Z",
];

export { Spinner, spinnerVariants };
