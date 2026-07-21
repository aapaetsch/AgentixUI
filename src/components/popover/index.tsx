"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

// ============================================================================
// Popover Variants
// ============================================================================

/**
 * PopoverContent variants using CVA
 * Implements size variants and animations
 */
const popoverContentVariants = cva(
  [
    // Base styles
    "z-50 max-h-[85dvh] max-w-[calc(100vw-1rem)] overflow-auto overscroll-contain [-webkit-overflow-scrolling:touch]",
    "rounded-[var(--radius)]",
    "border border-border bg-popover text-popover-foreground",
    "shadow-md",
    "outline-none",
    // Animation states
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    // Position-based slide animations
    "data-[side=bottom]:slide-in-from-top-2",
    "data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2",
    "data-[side=top]:slide-in-from-bottom-2",
    // Transform origin for scaling animations
    "origin-[var(--radix-popover-content-transform-origin)]",
  ].join(" "),
  {
    variants: {
      /**
       * Size variants for popover width
       * xs: 160px, sm: 208px, md: 288px (default), lg: 320px, xl: 384px, auto: auto width
       */
      size: {
        xs: "w-40 p-2",
        sm: "w-52 p-3",
        md: "w-72 p-4",
        lg: "w-80 p-4",
        xl: "w-96 max-w-[calc(100vw-1rem)] p-5",
        auto: "w-auto p-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * PopoverArrow variants using CVA
 */
const popoverArrowVariants = cva(
  [
    // Base styles - match content background and border
    "fill-popover",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "w-2 h-1",
        sm: "w-2.5 h-1.5",
        md: "w-3 h-1.5",
        lg: "w-4 h-2",
        xl: "w-4 h-2",
        auto: "w-3 h-1.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// ============================================================================
// Component Types
// ============================================================================

export interface PopoverProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> {}

export interface PopoverTriggerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> {}

export interface PopoverPortalProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal> {}

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    VariantProps<typeof popoverContentVariants> {
  /**
   * Whether to show the arrow pointing to the trigger
   * @default false
   */
  showArrow?: boolean;
  /**
   * Custom arrow element to render
   */
  arrow?: React.ReactNode;
}

export interface PopoverArrowProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>,
    VariantProps<typeof popoverArrowVariants> {}

export interface PopoverCloseProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close> {}

export interface PopoverAnchorProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor> {}

// ============================================================================
// Components
// ============================================================================

/**
 * Popover - Root component for popovers
 *
 * A non-modal dialog that floats around a trigger element. Commonly used
 * for displaying additional information or actions.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button>Open popover</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <p>Popover content</p>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
function Popover({ children, ...props }: PopoverProps) {
  return (
    <PopoverPrimitive.Root data-slot="popover" {...props}>
      {children}
    </PopoverPrimitive.Root>
  );
}
Popover.displayName = "Popover";

/**
 * PopoverTrigger - Element that opens the popover when clicked
 *
 * @example
 * ```tsx
 * <PopoverTrigger asChild>
 *   <Button variant="outline">Click me</Button>
 * </PopoverTrigger>
 * ```
 */
const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  PopoverTriggerProps
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    data-slot="popover-trigger"
    className={cn(className)}
    {...props}
  />
));
PopoverTrigger.displayName = "PopoverTrigger";

/**
 * PopoverPortal - Renders popover content in a React portal
 */
function PopoverPortal({ ...props }: PopoverPortalProps) {
  return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />;
}
PopoverPortal.displayName = "PopoverPortal";

/**
 * PopoverContent - The main popover container
 *
 * @example
 * ```tsx
 * // Default popover
 * <PopoverContent>
 *   <p>Popover content</p>
 * </PopoverContent>
 *
 * // With arrow
 * <PopoverContent showArrow>
 *   <p>Popover content with arrow</p>
 * </PopoverContent>
 *
 * // Custom size
 * <PopoverContent size="lg">
 *   <p>Large popover content</p>
 * </PopoverContent>
 * ```
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      children,
      size,
      showArrow = false,
      arrow,
      sideOffset = 4,
      align = "center",
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        data-slot="popover-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(popoverContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {showArrow &&
          (arrow || (
            <PopoverPrimitive.Arrow
              className={cn(popoverArrowVariants({ size }))}
            />
          ))}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
);
PopoverContent.displayName = "PopoverContent";

/**
 * PopoverArrow - Arrow pointing to the trigger element
 *
 * Can be used standalone inside PopoverContent for more control,
 * or use the `showArrow` prop on PopoverContent for convenience.
 *
 * @example
 * ```tsx
 * <PopoverContent>
 *   <p>Content with custom arrow</p>
 *   <PopoverArrow size="lg" />
 * </PopoverContent>
 * ```
 */
const PopoverArrow = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Arrow>,
  PopoverArrowProps
>(({ className, size, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    data-slot="popover-arrow"
    className={cn(popoverArrowVariants({ size }), className)}
    {...props}
  />
));
PopoverArrow.displayName = "PopoverArrow";

/**
 * PopoverClose - Element that closes the popover when clicked
 *
 * @example
 * ```tsx
 * <PopoverContent>
 *   <p>Content</p>
 *   <PopoverClose asChild>
 *     <Button variant="outline">Close</Button>
 *   </PopoverClose>
 * </PopoverContent>
 * ```
 */
const PopoverClose = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Close>,
  PopoverCloseProps
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Close
    ref={ref}
    data-slot="popover-close"
    className={cn(className)}
    {...props}
  />
));
PopoverClose.displayName = "PopoverClose";

/**
 * PopoverAnchor - Optional element to position the popover against
 *
 * Use this when you want to anchor the popover to a different element
 * than the trigger.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverAnchor asChild>
 *     <div className="anchor-point" />
 *   </PopoverAnchor>
 *   <PopoverTrigger asChild>
 *     <Button>Open</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <p>Anchored to the div, not the button</p>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
const PopoverAnchor = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Anchor>,
  PopoverAnchorProps
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Anchor
    ref={ref}
    data-slot="popover-anchor"
    className={cn(className)}
    {...props}
  />
));
PopoverAnchor.displayName = "PopoverAnchor";

// ============================================================================
// Exports
// ============================================================================

export {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverArrow,
  PopoverClose,
  PopoverAnchor,
  popoverContentVariants,
  popoverArrowVariants,
};
