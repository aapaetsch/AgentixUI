import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Spinner variants using CVA
 * Animated loading indicator following M3 patterns
 */
const spinnerVariants = cva(
  [
    "animate-spin",
    "text-current",
  ].join(" "),
  {
    variants: {
      /**
       * Size variants matching button icon sizes
       */
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

export interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {
  /**
   * Accessible label for screen readers
   * @default "Loading"
   */
  label?: string;
}

/**
 * Spinner - An animated loading indicator
 *
 * Uses an SVG circle with a spinning animation.
 * Inherits color from parent via `currentColor`.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner size="lg" />
 * <Button loading>Saving...</Button>
 * ```
 */
const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, label = "Loading", ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn(spinnerVariants({ size }), className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label={label}
        {...props}
      >
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
      </svg>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
