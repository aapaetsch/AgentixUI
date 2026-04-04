"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "../../lib/utils";
import { IconButton } from "../button/icon-button";

// ============================================================================
// HoverCard Context
// ============================================================================

interface HoverCardContextValue {
  size: "xs" | "sm" | "md" | "lg" | "xl";
  triggerMode: "hover" | "click";
  isTouch: boolean;
  showCloseButton: boolean;
  onClose: () => void;
}

const HoverCardContext = React.createContext<HoverCardContextValue | null>(
  null
);

function useHoverCardContext() {
  const context = React.useContext(HoverCardContext);
  if (!context) {
    throw new Error(
      "HoverCard compound components must be used within a HoverCard"
    );
  }
  return context;
}

// ============================================================================
// HoverCard Content Variants
// ============================================================================

/**
 * HoverCardContent variants using CVA
 * Size variants aligned with Card component sizing
 */
const hoverCardContentVariants = cva(
  [
    // Base styles
    "z-50",
    "border border-border bg-popover text-popover-foreground",
    "shadow-lg",
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
    "origin-[var(--radix-hover-card-content-transform-origin)]",
  ].join(" "),
  {
    variants: {
      /**
       * Size variants aligned with Card component
       * xs: p-3, sm: p-3, md: p-4, lg: p-5, xl: p-6
       */
      size: {
        xs: "p-3 w-52 rounded-[var(--radius)]",
        sm: "p-3 w-56 rounded-[var(--radius-md)]",
        md: "p-4 w-64 rounded-[var(--radius-md)]",
        lg: "p-5 w-72 rounded-[var(--radius-lg)]",
        xl: "p-6 w-80 rounded-[var(--radius-xl)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * HoverCardArrow variants using CVA
 * Size variants to match content sizes
 */
const hoverCardArrowVariants = cva(["fill-popover"].join(" "), {
  variants: {
    size: {
      xs: "w-2 h-1",
      sm: "w-2.5 h-1.5",
      md: "w-3 h-1.5",
      lg: "w-4 h-2",
      xl: "w-4 h-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/**
 * Close button size mapping based on card size
 */
const closeButtonSizeMap: Record<
  "xs" | "sm" | "md" | "lg" | "xl",
  "xs" | "sm" | "md"
> = {
  xs: "xs",
  sm: "xs",
  md: "sm",
  lg: "sm",
  xl: "md",
};

// ============================================================================
// Component Types
// ============================================================================

export interface HoverCardProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root> {
  /**
   * Trigger interaction mode
   * - "hover": Opens on hover (default)
   * - "click": Opens on click with close button
   * @default "hover"
   */
  triggerMode?: "hover" | "click";
  /**
   * Force a specific trigger mode regardless of device type
   * By default, touch devices will use "click" mode
   */
  forceTriggerMode?: boolean;
  /**
   * Size variant aligned with Card component sizing
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Whether to show a close button in the content
   * Auto-enabled in click mode and on touch devices
   */
  showCloseButton?: boolean;
}

export interface HoverCardTriggerProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger> {}

export interface HoverCardContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>,
      "sideOffset"
    >,
    VariantProps<typeof hoverCardContentVariants> {
  /**
   * Distance from the trigger element
   * @default 4
   */
  sideOffset?: number;
  /**
   * Whether to show the arrow pointing to the trigger
   * @default false
   */
  showArrow?: boolean;
  /**
   * Maximum height with scroll support
   * - "none": No max height (default)
   * - "auto": Sensible default (60vh)
   * - string: Custom value (e.g., "300px", "20rem")
   * @default "none"
   */
  maxHeight?: "none" | "auto" | string;
  /**
   * Custom arrow element to render
   */
  arrow?: React.ReactNode;
}

export interface HoverCardArrowProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Arrow>,
    VariantProps<typeof hoverCardArrowVariants> {}

export interface HoverCardCloseProps
  extends Omit<React.ComponentPropsWithoutRef<typeof IconButton>, "children" | "aria-label"> {
  /**
   * Accessible label for the close button
   * @default "Close"
   */
  "aria-label"?: string;
}

// ============================================================================
// Custom Hook for Touch Detection
// ============================================================================

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState(false);

  React.useEffect(() => {
    // Check for touch support using media query
    const mediaQuery = window.matchMedia("(hover: none)");
    setIsTouch(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isTouch;
}

// ============================================================================
// Components
// ============================================================================

/**
 * HoverCard - Root component for hover cards
 *
 * A popup that displays rich content when hovering over a trigger element.
 * Supports both hover and click trigger modes, with automatic touch device
 * detection.
 *
 * @example
 * ```tsx
 * // Basic hover card
 * <HoverCard>
 *   <HoverCardTrigger asChild>
 *     <Button variant="link">@nextjs</Button>
 *   </HoverCardTrigger>
 *   <HoverCardContent>
 *     <div className="flex gap-4">
 *       <Avatar>...</Avatar>
 *       <div>
 *         <h4>@nextjs</h4>
 *         <p>The React Framework</p>
 *       </div>
 *     </div>
 *   </HoverCardContent>
 * </HoverCard>
 *
 * // Click mode with close button
 * <HoverCard triggerMode="click">
 *   <HoverCardTrigger asChild>
 *     <Button>Click me</Button>
 *   </HoverCardTrigger>
 *   <HoverCardContent>
 *     <p>Click outside or press the X to close</p>
 *   </HoverCardContent>
 * </HoverCard>
 * ```
 */
function HoverCard({
  children,
  triggerMode = "hover",
  forceTriggerMode = false,
  size = "md",
  showCloseButton,
  open,
  onOpenChange,
  openDelay = 700,
  closeDelay = 300,
  ...props
}: HoverCardProps) {
  const isTouch = useIsTouchDevice();
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Determine effective trigger mode
  const effectiveTriggerMode =
    !forceTriggerMode && isTouch ? "click" : triggerMode;

  // Determine if close button should be shown
  const shouldShowCloseButton =
    showCloseButton ?? (effectiveTriggerMode === "click" || isTouch);

  // Handle controlled vs uncontrolled state
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const handleClose = React.useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  // Context value
  const contextValue = React.useMemo<HoverCardContextValue>(
    () => ({
      size,
      triggerMode: effectiveTriggerMode,
      isTouch,
      showCloseButton: shouldShowCloseButton,
      onClose: handleClose,
    }),
    [size, effectiveTriggerMode, isTouch, shouldShowCloseButton, handleClose]
  );

  return (
    <HoverCardContext.Provider value={contextValue}>
      <HoverCardPrimitive.Root
        data-slot="hover-card"
        open={isOpen}
        onOpenChange={handleOpenChange}
        openDelay={effectiveTriggerMode === "click" ? 0 : openDelay}
        closeDelay={effectiveTriggerMode === "click" ? 0 : closeDelay}
        {...props}
      >
        {children}
      </HoverCardPrimitive.Root>
    </HoverCardContext.Provider>
  );
}
HoverCard.displayName = "HoverCard";

/**
 * HoverCardTrigger - Element that triggers the hover card
 *
 * @example
 * ```tsx
 * <HoverCardTrigger asChild>
 *   <Button variant="link">Hover me</Button>
 * </HoverCardTrigger>
 * ```
 */
const HoverCardTrigger = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Trigger>,
  HoverCardTriggerProps
>(({ className, ...props }, ref) => {
  const { triggerMode } = useHoverCardContext();

  return (
    <HoverCardPrimitive.Trigger
      ref={ref}
      data-slot="hover-card-trigger"
      data-trigger-mode={triggerMode}
      className={cn(className)}
      {...props}
    />
  );
});
HoverCardTrigger.displayName = "HoverCardTrigger";

/**
 * HoverCardContent - The main hover card container
 *
 * @example
 * ```tsx
 * // Default content
 * <HoverCardContent>
 *   <p>Hover card content</p>
 * </HoverCardContent>
 *
 * // With arrow
 * <HoverCardContent showArrow>
 *   <p>Content with arrow</p>
 * </HoverCardContent>
 *
 * // With scrolling
 * <HoverCardContent maxHeight="200px">
 *   <p>Long scrollable content...</p>
 * </HoverCardContent>
 * ```
 */
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(
  (
    {
      className,
      children,
      size: sizeProp,
      showArrow = false,
      maxHeight = "none",
      arrow,
      sideOffset = 4,
      align = "center",
      ...props
    },
    ref
  ) => {
    const { size: contextSize, showCloseButton, onClose } = useHoverCardContext();
    const size = sizeProp ?? contextSize;

    // Calculate max height style
    const maxHeightStyle = React.useMemo(() => {
      if (maxHeight === "none") return undefined;
      if (maxHeight === "auto") return "60vh";
      return maxHeight;
    }, [maxHeight]);

    return (
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          ref={ref}
          data-slot="hover-card-content"
          sideOffset={sideOffset}
          align={align}
          className={cn(hoverCardContentVariants({ size }), className)}
          style={
            maxHeightStyle
              ? { maxHeight: maxHeightStyle, overflowY: "auto" }
              : undefined
          }
          {...props}
        >
          {/* Close button positioned at top right */}
          {showCloseButton && (
            <HoverCardClose
              aria-label="Close"
              className="absolute top-2 right-2 z-10"
            />
          )}

          {/* Content wrapper with padding adjustment for close button */}
          <div className={showCloseButton ? "pr-6" : undefined}>{children}</div>

          {/* Arrow */}
          {showArrow &&
            (arrow || (
              <HoverCardPrimitive.Arrow
                className={cn(hoverCardArrowVariants({ size }))}
              />
            ))}
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    );
  }
);
HoverCardContent.displayName = "HoverCardContent";

/**
 * HoverCardArrow - Arrow pointing to the trigger element
 *
 * Can be used standalone inside HoverCardContent for more control,
 * or use the `showArrow` prop on HoverCardContent for convenience.
 *
 * @example
 * ```tsx
 * <HoverCardContent>
 *   <p>Content with custom arrow</p>
 *   <HoverCardArrow size="lg" />
 * </HoverCardContent>
 * ```
 */
const HoverCardArrow = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Arrow>,
  HoverCardArrowProps
>(({ className, size: sizeProp, ...props }, ref) => {
  const { size: contextSize } = useHoverCardContext();
  const size = sizeProp ?? contextSize;

  return (
    <HoverCardPrimitive.Arrow
      ref={ref}
      data-slot="hover-card-arrow"
      className={cn(hoverCardArrowVariants({ size }), className)}
      {...props}
    />
  );
});
HoverCardArrow.displayName = "HoverCardArrow";

/**
 * HoverCardClose - Close button for the hover card
 *
 * Automatically shown in click mode or on touch devices.
 * Can be manually added to content when needed.
 *
 * @example
 * ```tsx
 * <HoverCardContent>
 *   <HoverCardClose />
 *   <p>Content with close button</p>
 * </HoverCardContent>
 * ```
 */
const HoverCardClose = React.forwardRef<
  React.ElementRef<typeof IconButton>,
  HoverCardCloseProps
>(({ className, onClick, "aria-label": ariaLabel = "Close", ...props }, ref) => {
  const { size, onClose } = useHoverCardContext();
  const buttonSize = closeButtonSizeMap[size];

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      onClose();
    },
    [onClick, onClose]
  );

  return (
    <IconButton
      ref={ref}
      data-slot="hover-card-close"
      size={buttonSize}
      colorStyle="standard"
      aria-label={ariaLabel}
      className={cn("opacity-70 hover:opacity-100", className)}
      onClick={handleClick}
      {...props}
    >
      <X />
    </IconButton>
  );
});
HoverCardClose.displayName = "HoverCardClose";

// ============================================================================
// Exports
// ============================================================================

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardClose,
  useHoverCardContext,
  hoverCardContentVariants,
  hoverCardArrowVariants,
};
