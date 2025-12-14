import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../../lib/utils";

/**
 * Separator variants using CVA
 * Implements orientation variants with default styling
 */
const separatorVariants = cva(
  [
    "shrink-0",
    "bg-border", // Default border color from design tokens
  ].join(" "),
  {
    variants: {
      /**
       * Orientation variants
       * Horizontal: full width, 1px height
       * Vertical: full height, 1px width
       */
      orientation: {
        horizontal: "h-px w-full",
        vertical: "h-full w-px",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

export interface SeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>, "orientation">,
    VariantProps<typeof separatorVariants> {
  /**
   * Custom color class (e.g., "bg-red-500")
   * Overrides the default border color
   */
  color?: string;
  /**
   * Custom opacity value (0-1)
   * Controls the transparency of the separator
   */
  opacity?: number;
}

/**
 * Separator - A visual divider that separates content
 *
 * Built on top of Radix UI Separator primitive with custom styling.
 * Can be oriented horizontally or vertically with custom color and opacity.
 *
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * <Separator color="bg-blue-500" opacity={0.5} />
 * ```
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    { className, orientation = "horizontal", color, opacity, decorative = true, ...props },
    ref
  ) => {
    // Apply custom color if provided
    const colorClass = color || "";
    
    // Apply custom opacity if provided
    const opacityStyle = opacity !== undefined ? { opacity } : {};
    
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation ?? undefined}
        className={cn(
          separatorVariants({ orientation }),
          colorClass,
          className
        )}
        style={opacityStyle}
        {...props}
      />
    );
  }
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator, separatorVariants };