"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

// ============================================================================
// Tooltip Provider
// ============================================================================

/**
 * TooltipProvider - Global configuration for tooltips
 *
 * Wrap your app (or a section) with this provider to configure tooltip behavior.
 * If not provided, each Tooltip will create its own provider context.
 *
 * @example
 * ```tsx
 * <TooltipProvider delayDuration={200}>
 *   <App />
 * </TooltipProvider>
 * ```
 */
const TooltipProvider = TooltipPrimitive.Provider;

// ============================================================================
// Tooltip Root
// ============================================================================

/**
 * Tooltip - Root component that manages tooltip state
 *
 * Wraps Radix UI Tooltip Root with default provider if none exists.
 */
const Tooltip = ({
  children,
  delayDuration = 200,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
  delayDuration?: number;
}) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration}>
    <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
);
Tooltip.displayName = "Tooltip";

// ============================================================================
// Tooltip Trigger
// ============================================================================

export interface TooltipTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger> {}

/**
 * TooltipTrigger - Element that triggers the tooltip on hover/focus
 *
 * @example
 * ```tsx
 * <TooltipTrigger asChild>
 *   <Button>Hover me</Button>
 * </TooltipTrigger>
 * ```
 */
const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  TooltipTriggerProps
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Trigger
    ref={ref}
    data-slot="tooltip-trigger"
    className={cn(className)}
    {...props}
  />
));
TooltipTrigger.displayName = "TooltipTrigger";

// ============================================================================
// Tooltip Content Variants
// ============================================================================

/**
 * TooltipContent variants using CVA
 * Size variants for different use cases
 */
const tooltipContentVariants = cva(
  [
    // Base styles - following updated shadcn colors
    "z-50 overflow-visible",
    "bg-foreground text-background",
    "rounded-[var(--radius)]",
    "shadow-md",
    // Use CSS transitions instead of tailwind animate classes
    // This ensures the arrow and content animate together
    "will-change-[transform,opacity]",
    // Origin point for transform
    "origin-[var(--radix-tooltip-content-transform-origin)]",
  ].join(" "),
  {
    variants: {
      /**
       * Size variants
       * xs: Compact tooltips for dense UIs
       * sm: Small tooltips for brief hints
       * md: Default tooltip size
       * lg: Larger tooltips for more content
       */
      size: {
        xs: "px-2 py-1 text-xs",
        sm: "px-2.5 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * TooltipArrow variants using CVA
 * Size variants to match content sizes
 */
const tooltipArrowVariants = cva(
  [
    // Base styles - match content background
    "fill-foreground",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "w-2 h-1 -mt-px",
        sm: "w-2.5 h-1.5 -mt-px",
        md: "w-3 h-1.5 -mt-px",
        lg: "w-4 h-2 -mt-px",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// For standalone use, we need to account for different positions
const standaloneTooltipArrowVariants = cva(
  [
    // Base styles - match content background
    "fill-foreground",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "w-2 h-1",
        sm: "w-2.5 h-1.5",
        md: "w-3 h-1.5",
        lg: "w-4 h-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// ============================================================================
// Tooltip Content
// ============================================================================

export interface TooltipContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
      "sideOffset"
    >,
    VariantProps<typeof tooltipContentVariants> {
  /**
   * Distance from the trigger element
   * @default 4
   */
  sideOffset?: number;
  /**
   * Whether to show the arrow
   * @default false
   */
  showArrow?: boolean;
}

/**
 * TooltipContent - The popup content that appears on hover/focus
 *
 * @example
 * ```tsx
 * <TooltipContent>
 *   <p>Add to library</p>
 * </TooltipContent>
 *
 * <TooltipContent size="lg" side="right">
 *   <p>This is a larger tooltip</p>
 * </TooltipContent>
 * ```
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    { className, size, sideOffset = 6, showArrow = false, children, ...props },
    ref
  ) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(tooltipContentVariants({ size }), className)}
        {...props}
      >
        {showArrow && (
          <TooltipPrimitive.Arrow
            className={cn(tooltipArrowVariants({ size }))}
          />
        )}
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
);
TooltipContent.displayName = "TooltipContent";

// ============================================================================
// Tooltip Arrow (Standalone)
// ============================================================================

export interface TooltipArrowProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>,
    VariantProps<typeof tooltipArrowVariants> {}

/**
 * TooltipArrow - Optional arrow pointing to the trigger
 *
 * Can be used standalone inside TooltipContent for more control,
 * or use the `showArrow` prop on TooltipContent for convenience.
 *
 * @example
 * ```tsx
 * <TooltipContent>
 *   <p>Content with arrow</p>
 *   <TooltipArrow />
 * </TooltipContent>
 * ```
 */
const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  TooltipArrowProps
>(({ className, size, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    data-slot="tooltip-arrow"
    className={cn(standaloneTooltipArrowVariants({ size }), className)}
    {...props}
  />
));
TooltipArrow.displayName = "TooltipArrow";

// ============================================================================
// Exports
// ============================================================================

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
  tooltipContentVariants,
  tooltipArrowVariants,
};
