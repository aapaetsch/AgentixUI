"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { useSpring, animated, config as springConfig } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { X } from "lucide-react";

import { cn } from "../../lib/utils";

// ============================================================================
// Animated Components
// ============================================================================

const AnimatedOverlay = animated(DialogPrimitive.Overlay);
const AnimatedContent = animated(DialogPrimitive.Content);

// ============================================================================
// Types
// ============================================================================

export type SheetPosition = "top" | "right" | "bottom" | "left";
export type SheetSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";
export type AnimationType = "smooth" | "stiff" | "bounce" | "elastic" | "slow" | "fast";

export interface SpringConfigOptions {
  tension?: number;
  friction?: number;
  mass?: number;
}

export interface GestureSensitivity {
  /** Minimum velocity to trigger close (pixels/ms) */
  velocityThreshold?: number;
  /** Distance threshold to trigger close (percentage of sheet dimension) */
  distanceThreshold?: number;
  /** Enable/disable swipe gesture */
  enableSwipe?: boolean;
}

// ============================================================================
// Animation Presets
// ============================================================================

const animationPresets: Record<AnimationType, SpringConfigOptions> = {
  smooth: { tension: 200, friction: 26, mass: 1 },
  stiff: { tension: 400, friction: 30, mass: 1 },
  bounce: { tension: 300, friction: 10, mass: 1 },
  elastic: { tension: 200, friction: 12, mass: 1 },
  slow: { tension: 100, friction: 30, mass: 1 },
  fast: { tension: 400, friction: 40, mass: 1 },
};

// ============================================================================
// Variants
// ============================================================================

/**
 * PremiumSheetOverlay variants using CVA
 */
const premiumSheetOverlayVariants = cva(
  [
    "fixed inset-0 z-50 overscroll-contain touch-none",
    "bg-black/50 backdrop-blur-sm",
    "overflow-hidden", // Prevent content from showing outside viewport during bounce
  ].join(" ")
);

/**
 * PremiumSheetContent variants using CVA
 */
const premiumSheetContentVariants = cva(
  [
    "fixed z-50",
    "flex flex-col",
    "gap-4",
    "border border-border bg-background",
    "shadow-[var(--elevation-5)]",
    "outline-none",
    "touch-none overscroll-contain", // Prevent default touch behaviors for gesture handling
    "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
    // Add pseudo-element for overshoot coverage
    "before:content-[''] before:absolute before:bg-background",
  ].join(" "),
  {
    variants: {
      position: {
        top: [
          "inset-x-0 top-0",
          "border-t-0 border-x-0 rounded-b-[var(--radius-lg)]",
          // Extend upward to cover overshoot
          "before:inset-x-0 before:-top-[200px] before:h-[200px]",
        ].join(" "),
        right: [
          "inset-y-0 right-0",
          "border-r-0 border-y-0 rounded-l-[var(--radius-lg)]",
          // Extend rightward to cover overshoot
          "before:inset-y-0 before:-right-[200px] before:w-[200px]",
        ].join(" "),
        bottom: [
          "inset-x-0 bottom-0",
          "border-b-0 border-x-0 rounded-t-[var(--radius-lg)]",
          // Extend downward to cover overshoot
          "before:inset-x-0 before:-bottom-[200px] before:h-[200px]",
        ].join(" "),
        left: [
          "inset-y-0 left-0",
          "border-l-0 border-y-0 rounded-r-[var(--radius-lg)]",
          // Extend leftward to cover overshoot
          "before:inset-y-0 before:-left-[200px] before:w-[200px]",
        ].join(" "),
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
        full: "",
      },
    },
    compoundVariants: [
      // Right/Left positions - control width
      { position: "right", size: "xs", className: "w-[280px]" },
      { position: "right", size: "sm", className: "w-[320px] sm:w-[360px]" },
      { position: "right", size: "md", className: "w-[360px] sm:w-[400px]" },
      { position: "right", size: "lg", className: "w-[400px] sm:w-[480px]" },
      { position: "right", size: "xl", className: "w-[480px] sm:w-[600px]" },
      { position: "right", size: "full", className: "w-dvw" },
      { position: "left", size: "xs", className: "w-[280px]" },
      { position: "left", size: "sm", className: "w-[320px] sm:w-[360px]" },
      { position: "left", size: "md", className: "w-[360px] sm:w-[400px]" },
      { position: "left", size: "lg", className: "w-[400px] sm:w-[480px]" },
      { position: "left", size: "xl", className: "w-[480px] sm:w-[600px]" },
      { position: "left", size: "full", className: "w-dvw" },
      // Top/Bottom positions - control height
      { position: "top", size: "xs", className: "h-[200px]" },
      { position: "top", size: "sm", className: "h-[280px]" },
      { position: "top", size: "md", className: "h-[360px]" },
      { position: "top", size: "lg", className: "h-[480px]" },
      { position: "top", size: "xl", className: "h-[600px]" },
      { position: "top", size: "full", className: "h-dvh" },
      { position: "bottom", size: "xs", className: "h-[200px]" },
      { position: "bottom", size: "sm", className: "h-[280px]" },
      { position: "bottom", size: "md", className: "h-[360px]" },
      { position: "bottom", size: "lg", className: "h-[480px]" },
      { position: "bottom", size: "xl", className: "h-[600px]" },
      { position: "bottom", size: "full", className: "h-dvh" },
    ],
    defaultVariants: {
      position: "right",
      size: "md",
    },
  }
);

/**
 * PremiumSheetHeader variants
 */
const premiumSheetHeaderVariants = cva(
  [
    "flex flex-col gap-1.5",
    "px-6 pt-6",
    "text-left",
  ].join(" ")
);

/**
 * PremiumSheetFooter variants
 */
const premiumSheetFooterVariants = cva(
  [
    "flex flex-col-reverse gap-2",
    "px-6 pb-6",
    "sm:flex-row sm:justify-end",
    "mt-auto",
  ].join(" ")
);

/**
 * PremiumSheetTitle variants
 */
const premiumSheetTitleVariants = cva(
  [
    "text-lg font-semibold leading-none tracking-tight",
    "text-foreground",
  ].join(" ")
);

/**
 * PremiumSheetDescription variants
 */
const premiumSheetDescriptionVariants = cva(
  [
    "text-sm text-muted-foreground",
  ].join(" ")
);

/**
 * PremiumSheetClose button variants
 */
const premiumSheetCloseVariants = cva(
  [
    "absolute right-2 top-2 flex size-11 items-center justify-center",
    "rounded-[var(--radius-sm)]",
    "opacity-70 ring-offset-background",
    "transition-opacity",
    "duration-[var(--motion-duration-short)]",
    "ease-[var(--motion-easing-standard)]",
    "hover:opacity-100 active:opacity-100",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    "disabled:pointer-events-none",
    "data-[state=open]:bg-secondary",
    "z-10", // Ensure close button is above gesture area
  ].join(" ")
);

/**
 * PremiumSheetHandle variants
 */
const premiumSheetHandleVariants = cva(
  [
    "mx-auto",
    "relative h-11 w-20 before:absolute before:left-1/2 before:top-1/2 before:h-1.5 before:w-12 before:-translate-x-1/2 before:-translate-y-1/2",
    "shrink-0 rounded-full",
    "before:rounded-full before:bg-muted-foreground/30",
    "cursor-grab active:cursor-grabbing",
  ].join(" "),
  {
    variants: {
      position: {
        top: "mb-4 mt-2",
        bottom: "mb-2 mt-4",
        left: "hidden",
        right: "hidden",
      },
    },
    defaultVariants: {
      position: "bottom",
    },
  }
);

// ============================================================================
// Component Types
// ============================================================================

export interface PremiumSheetProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {}

export interface PremiumSheetTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> {}

export interface PremiumSheetPortalProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal> {}

export interface PremiumSheetOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

export interface PremiumSheetContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, "onAnimationEnd">,
    VariantProps<typeof premiumSheetContentVariants> {
  /**
   * Whether to show the close button
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Custom close button content
   */
  closeButton?: React.ReactNode;
  /**
   * Callback when close button is clicked
   */
  onCloseClick?: () => void;
  /**
   * Prevents closing the sheet by clicking the overlay or pressing Escape.
   * @default false
   */
  preventBackgroundClose?: boolean;
  /**
   * Whether to show the drag handle for touch devices
   * @default false
   */
  showHandle?: boolean;
  /**
   * Custom className for the overlay
   */
  overlayClassName?: string;
  /**
   * Animation type preset
   * @default "smooth"
   */
  animationType?: AnimationType;
  /**
   * Custom spring configuration (overrides animationType)
   */
  springConfig?: SpringConfigOptions;
  /**
   * Gesture sensitivity configuration
   */
  gestureSensitivity?: GestureSensitivity;
  /**
   * Snap points as percentages (0-1) of sheet dimension
   * @example [0.25, 0.5, 0.75] for 25%, 50%, 75% snap points
   */
  snapPoints?: number[];
  /**
   * Initial snap point index (for controlled snap behavior)
   */
  defaultSnapPoint?: number;
  /**
   * Callback when snap point changes
   */
  onSnapPointChange?: (index: number) => void;
  /**
   * Enable scroll locking for nested scrollable content
   * @default true
   */
  scrollLock?: boolean;
  /**
   * Custom handle component
   */
  handleComponent?: React.ReactNode;
}

export interface PremiumSheetHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface PremiumSheetFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface PremiumSheetTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

export interface PremiumSheetDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

export interface PremiumSheetCloseProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get the dimension (width or height) based on position
 */
function getSheetDimension(position: SheetPosition): "width" | "height" {
  return position === "left" || position === "right" ? "width" : "height";
}

/**
 * Get the transform axis based on position
 */
function getTransformAxis(position: SheetPosition): "x" | "y" {
  return position === "left" || position === "right" ? "x" : "y";
}

/**
 * Get the direction multiplier for transforms
 * - Right/Bottom: positive direction (slide out to right/bottom)
 * - Left/Top: negative direction (slide out to left/top)
 */
function getDirectionMultiplier(position: SheetPosition): number {
  return position === "right" || position === "bottom" ? 1 : -1;
}

/**
 * Calculate the closest snap point
 */
function getClosestSnapPoint(
  currentPosition: number,
  snapPoints: number[],
  sheetDimension: number
): number {
  const currentPercentage = Math.abs(currentPosition) / sheetDimension;
  const closestIndex = snapPoints.reduce((closest, point, index) => {
    const distance = Math.abs(point - currentPercentage);
    const closestDistance = Math.abs(snapPoints[closest] - currentPercentage);
    return distance < closestDistance ? index : closest;
  }, 0);
  return closestIndex;
}

// ============================================================================
// Context
// ============================================================================

interface PremiumSheetContextValue {
  level: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const PremiumSheetContext = React.createContext<PremiumSheetContextValue>({
  level: 0,
  isOpen: false,
  setIsOpen: () => {},
});

function usePremiumSheetContext() {
  return React.useContext(PremiumSheetContext);
}

// ============================================================================
// Components
// ============================================================================

/**
 * PremiumSheet - Root component for premium slide-out panels
 *
 * Enhanced Sheet with gesture support, spring animations, and snap points.
 *
 * @example
 * ```tsx
 * <PremiumSheet>
 *   <PremiumSheetTrigger asChild>
 *     <Button>Open Sheet</Button>
 *   </PremiumSheetTrigger>
 *   <PremiumSheetContent
 *     position="bottom"
 *     animationType="bounce"
 *     snapPoints={[0.25, 0.5, 1]}
 *     showHandle
 *   >
 *     <PremiumSheetHeader>
 *       <PremiumSheetTitle>Swipeable Sheet</PremiumSheetTitle>
 *     </PremiumSheetHeader>
 *     <div className="flex-1 overflow-auto px-6">Content</div>
 *   </PremiumSheetContent>
 * </PremiumSheet>
 * ```
 */
function PremiumSheet({ children, open, onOpenChange, defaultOpen, ...props }: PremiumSheetProps) {
  const parentContext = usePremiumSheetContext();
  const level = parentContext.level + 1;
  
  // Internal state for uncontrolled mode
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  
  // Determine if controlled or uncontrolled
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  
  const setIsOpen = React.useCallback((newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [isControlled, onOpenChange]);

  return (
    <PremiumSheetContext.Provider value={{ level, isOpen, setIsOpen }}>
      <DialogPrimitive.Root
        data-slot="premium-sheet"
        open={isOpen}
        onOpenChange={setIsOpen}
        {...props}
      >
        {children}
      </DialogPrimitive.Root>
    </PremiumSheetContext.Provider>
  );
}

/**
 * PremiumSheetTrigger - Element that opens the sheet
 */
const PremiumSheetTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  PremiumSheetTriggerProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    data-slot="premium-sheet-trigger"
    className={cn(className)}
    {...props}
  />
));
PremiumSheetTrigger.displayName = "PremiumSheetTrigger";

/**
 * PremiumSheetPortal - Renders sheet in a React portal
 */
function PremiumSheetPortal({ ...props }: PremiumSheetPortalProps) {
  return <DialogPrimitive.Portal data-slot="premium-sheet-portal" {...props} />;
}

/**
 * PremiumSheetContent - Enhanced sheet container with gestures
 */
const PremiumSheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  PremiumSheetContentProps
>(
  (
    {
      className,
      children,
      position = "right",
      size,
      showCloseButton = true,
      closeButton,
      onCloseClick,
      preventBackgroundClose = false,
      showHandle = false,
      overlayClassName,
      animationType = "smooth",
      springConfig: customSpringConfig,
      gestureSensitivity = {},
      snapPoints,
      defaultSnapPoint = snapPoints ? snapPoints.length - 1 : undefined,
      onSnapPointChange,
      scrollLock = true,
      handleComponent,
      onInteractOutside,
      onEscapeKeyDown,
      ...props
    },
    ref
  ) => {
    const { level, setIsOpen, isOpen } = usePremiumSheetContext();
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [sheetDimension, setSheetDimension] = React.useState(0);
    const [currentSnapIndex, setCurrentSnapIndex] = React.useState(defaultSnapPoint ?? 0);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const closeTimeoutRef = React.useRef<NodeJS.Timeout>();

    // Ensure position has a default value
    const resolvedPosition = position ?? "right";

    // Default gesture sensitivity values
    const {
      velocityThreshold = 0.5,
      distanceThreshold = 0.3,
      enableSwipe = true,
    } = gestureSensitivity;

    // Get spring config
    const springConfigValue = customSpringConfig || animationPresets[animationType];

    // Calculate transform axis and direction
    const axis = getTransformAxis(resolvedPosition);
    const directionMultiplier = getDirectionMultiplier(resolvedPosition);

    // Calculate target position for open state
    const openPosition = snapPoints && snapPoints.length > 0 && defaultSnapPoint !== undefined
      ? (1 - snapPoints[defaultSnapPoint]) * directionMultiplier * 100
      : 0;

    // Spring animation for overlay
    const [overlaySpring, overlayApi] = useSpring(() => ({
      opacity: 0,
      config: springConfig.default,
    }));

    // Spring animation for content
    const [contentSpring, contentApi] = useSpring(() => ({
      [axis]: directionMultiplier * 100, // Start off-screen
      config: springConfigValue,
    }));

    // Animate based on isOpen state
    React.useEffect(() => {
      if (isOpen) {
        // Clear any pending close timeout
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = undefined;
        }
        // Animate in
        setIsAnimating(true);
        overlayApi.start({ opacity: 1 });
        contentApi.start({
          [axis]: openPosition,
          onRest: () => setIsAnimating(false),
        });
      } else if (!isOpen && isAnimating) {
        // Already animating closed, do nothing
      }
    }, [isOpen, overlayApi, contentApi, axis, openPosition, directionMultiplier, isAnimating]);

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
      };
    }, []);

    // Measure sheet dimension on mount
    React.useEffect(() => {
      if (contentRef.current) {
        const dimension = getSheetDimension(resolvedPosition);
        const measuredSize = dimension === "width"
          ? contentRef.current.offsetWidth
          : contentRef.current.offsetHeight;
        setSheetDimension(measuredSize);
      }
    }, [resolvedPosition]);

    // Drag gesture handler
    const bind = useDrag(
      ({
        movement: [mx, my],
        velocity: [vx, vy],
        direction: [dx, dy],
        canceled,
        last,
        active,
      }) => {
        if (!enableSwipe || canceled) return;

        const movement = axis === "x" ? mx : my;
        const velocity = axis === "x" ? vx : vy;
        const direction = axis === "x" ? dx : dy;

        // Only allow movement in the close direction
        const isClosingDirection = direction * directionMultiplier > 0;
        const normalizedMovement = movement * directionMultiplier;

        if (active && !last) {
          // During drag - follow finger with resistance at edges
          const clampedMovement = Math.max(0, normalizedMovement);
          const percentMovement = sheetDimension > 0
            ? (clampedMovement / sheetDimension) * 100
            : 0;
          
          // Add resistance when pulling past the open position
          const resistedMovement = normalizedMovement < 0
            ? normalizedMovement * 0.3
            : percentMovement;

          contentApi.start({
            [axis]: (openPosition + resistedMovement * directionMultiplier),
            immediate: true,
          });
        }

        if (last) {
          const absMovement = Math.abs(normalizedMovement);
          const absVelocity = Math.abs(velocity);
          const percentMoved = sheetDimension > 0 ? absMovement / sheetDimension : 0;

          // Check if we should close based on velocity or distance
          const shouldCloseByVelocity = isClosingDirection && absVelocity > velocityThreshold;
          const shouldCloseByDistance = isClosingDirection && percentMoved > distanceThreshold;

          if (snapPoints && snapPoints.length > 0) {
            if (shouldCloseByVelocity || shouldCloseByDistance) {
              // Find next lower snap point or close
              const targetSnapIndex = currentSnapIndex - 1;
              if (targetSnapIndex < 0) {
                // Animate out before closing
                setIsAnimating(true);
                overlayApi.start({ opacity: 0 });
                contentApi.start({
                  [axis]: directionMultiplier * 100,
                  onRest: () => {
                    setIsAnimating(false);
                    setIsOpen(false);
                  },
                });
                return;
              }
              const targetPosition = (1 - snapPoints[targetSnapIndex]) * directionMultiplier * 100;
              contentApi.start({ [axis]: targetPosition });
              setCurrentSnapIndex(targetSnapIndex);
              onSnapPointChange?.(targetSnapIndex);
            } else {
              // Snap to closest point
              const targetSnapIndex = getClosestSnapPoint(normalizedMovement, snapPoints, sheetDimension);
              const targetPosition = (1 - snapPoints[targetSnapIndex]) * directionMultiplier * 100;
              contentApi.start({ [axis]: targetPosition });
              setCurrentSnapIndex(targetSnapIndex);
              onSnapPointChange?.(targetSnapIndex);
            }
          } else {
            // No snap points - either close or return to open
            if (shouldCloseByVelocity || shouldCloseByDistance) {
              // Animate out before closing
              setIsAnimating(true);
              overlayApi.start({ opacity: 0 });
              contentApi.start({
                [axis]: directionMultiplier * 100,
                onRest: () => {
                  setIsAnimating(false);
                  setIsOpen(false);
                },
              });
            } else {
              // Return to open position
              contentApi.start({ [axis]: openPosition });
            }
          }
        }
      },
      {
        axis,
        bounds: {
          top: resolvedPosition === "top" ? -Infinity : 0,
          bottom: resolvedPosition === "bottom" ? Infinity : 0,
          left: resolvedPosition === "left" ? -Infinity : 0,
          right: resolvedPosition === "right" ? Infinity : 0,
        },
        rubberband: true,
        filterTaps: true,
        pointer: { touch: true },
      }
    );

    // Handle overlay click prevention
    const handleInteractOutside = React.useCallback(
      (event: React.ComponentProps<typeof DialogPrimitive.Content>["onInteractOutside"] extends ((e: infer E) => void) | undefined ? E : never) => {
        if (preventBackgroundClose) {
          event.preventDefault();
        } else {
          // Prevent default close and animate out first
          event.preventDefault();
          setIsAnimating(true);
          overlayApi.start({ opacity: 0 });
          contentApi.start({
            [axis]: directionMultiplier * 100,
            onRest: () => {
              setIsAnimating(false);
              setIsOpen(false);
            },
          });
        }
        onInteractOutside?.(event);
      },
      [preventBackgroundClose, onInteractOutside, overlayApi, contentApi, axis, directionMultiplier, setIsOpen]
    );

    // Handle escape key prevention
    const handleEscapeKeyDown = React.useCallback(
      (event: React.ComponentProps<typeof DialogPrimitive.Content>["onEscapeKeyDown"] extends ((e: infer E) => void) | undefined ? E : never) => {
        if (preventBackgroundClose) {
          event.preventDefault();
        } else {
          // Prevent default close and animate out first
          event.preventDefault();
          setIsAnimating(true);
          overlayApi.start({ opacity: 0 });
          contentApi.start({
            [axis]: directionMultiplier * 100,
            onRest: () => {
              setIsAnimating(false);
              setIsOpen(false);
            },
          });
        }
        onEscapeKeyDown?.(event);
      },
      [preventBackgroundClose, onEscapeKeyDown, overlayApi, contentApi, axis, directionMultiplier, setIsOpen]
    );

    // Handle close button click
    const handleCloseClick = React.useCallback((e: React.MouseEvent) => {
      // Prevent the default DialogPrimitive.Close behavior
      e.preventDefault();
      setIsAnimating(true);
      overlayApi.start({ opacity: 0 });
      contentApi.start({
        [axis]: directionMultiplier * 100,
        onRest: () => {
          setIsAnimating(false);
          setIsOpen(false);
          onCloseClick?.();
        },
      });
    }, [onCloseClick, overlayApi, contentApi, axis, directionMultiplier, setIsOpen]);

    // Create transform interpolation
    const transformStyle = (contentSpring as any)[axis].to(
      (v: number) => axis === "x" ? `translateX(${v}%)` : `translateY(${v}%)`
    );

    // Only render when open or animating to prevent blocking interactions
    const shouldRender = isOpen || isAnimating;

    return (
      <PremiumSheetPortal>
        {shouldRender && (
          <>
            <AnimatedOverlay
              forceMount
              data-slot="premium-sheet-overlay"
              data-sheet-level={level}
              className={cn(premiumSheetOverlayVariants(), overlayClassName)}
              style={{
                opacity: overlaySpring.opacity,
                zIndex: 50 + (level - 1) * 10,
              }}
            />
            <AnimatedContent
              forceMount
              ref={(node) => {
                (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                if (typeof ref === "function") {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
              }}
              data-slot="premium-sheet-content"
              data-sheet-level={level}
              data-position={resolvedPosition}
              className={cn(
                premiumSheetContentVariants({ position: resolvedPosition, size }),
                scrollLock && "overscroll-contain",
                className
              )}
              style={{
                transform: transformStyle,
                zIndex: 50 + (level - 1) * 10 + 1,
              }}
              onInteractOutside={handleInteractOutside}
              onEscapeKeyDown={handleEscapeKeyDown}
              {...bind()}
              {...props}
        >
          {/* Handle for touch devices */}
          {showHandle && (resolvedPosition === "top" || resolvedPosition === "bottom") && (
            handleComponent || (
              <div
                data-slot="premium-sheet-handle"
                className={cn(premiumSheetHandleVariants({ position: resolvedPosition }))}
              />
            )
          )}

          {children}

          {showCloseButton && (
            closeButton || (
              <button
                type="button"
                data-slot="premium-sheet-close-button"
                className={cn(premiumSheetCloseVariants())}
                onClick={handleCloseClick}
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </button>
            )
          )}
            </AnimatedContent>
          </>
        )}
      </PremiumSheetPortal>
    );
  }
);
PremiumSheetContent.displayName = "PremiumSheetContent";

/**
 * PremiumSheetHeader - Container for sheet title and description
 */
function PremiumSheetHeader({ className, ...props }: PremiumSheetHeaderProps) {
  return (
    <div
      data-slot="premium-sheet-header"
      className={cn(premiumSheetHeaderVariants(), className)}
      {...props}
    />
  );
}

/**
 * PremiumSheetFooter - Container for sheet actions
 */
function PremiumSheetFooter({ className, ...props }: PremiumSheetFooterProps) {
  return (
    <div
      data-slot="premium-sheet-footer"
      className={cn(premiumSheetFooterVariants(), className)}
      {...props}
    />
  );
}

/**
 * PremiumSheetTitle - The sheet heading
 */
const PremiumSheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  PremiumSheetTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="premium-sheet-title"
    className={cn(premiumSheetTitleVariants(), className)}
    {...props}
  />
));
PremiumSheetTitle.displayName = "PremiumSheetTitle";

/**
 * PremiumSheetDescription - Descriptive text below the title
 */
const PremiumSheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  PremiumSheetDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="premium-sheet-description"
    className={cn(premiumSheetDescriptionVariants(), className)}
    {...props}
  />
));
PremiumSheetDescription.displayName = "PremiumSheetDescription";

/**
 * PremiumSheetClose - Element that closes the sheet
 */
const PremiumSheetClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  PremiumSheetCloseProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    data-slot="premium-sheet-close"
    className={cn(className)}
    {...props}
  />
));
PremiumSheetClose.displayName = "PremiumSheetClose";

// ============================================================================
// Exports
// ============================================================================

export {
  PremiumSheet as Sheet,
  PremiumSheet,
  PremiumSheetTrigger as SheetTrigger,
  PremiumSheetTrigger,
  PremiumSheetPortal as SheetPortal,
  PremiumSheetPortal,
  PremiumSheetContent as SheetContent,
  PremiumSheetContent,
  PremiumSheetHeader as SheetHeader,
  PremiumSheetHeader,
  PremiumSheetFooter as SheetFooter,
  PremiumSheetFooter,
  PremiumSheetTitle as SheetTitle,
  PremiumSheetTitle,
  PremiumSheetDescription as SheetDescription,
  PremiumSheetDescription,
  PremiumSheetClose as SheetClose,
  PremiumSheetClose,
  premiumSheetOverlayVariants as sheetOverlayVariants,
  premiumSheetOverlayVariants,
  premiumSheetContentVariants as sheetContentVariants,
  premiumSheetContentVariants,
  premiumSheetHeaderVariants as sheetHeaderVariants,
  premiumSheetHeaderVariants,
  premiumSheetFooterVariants as sheetFooterVariants,
  premiumSheetFooterVariants,
  premiumSheetTitleVariants as sheetTitleVariants,
  premiumSheetTitleVariants,
  premiumSheetDescriptionVariants as sheetDescriptionVariants,
  premiumSheetDescriptionVariants,
  premiumSheetCloseVariants as sheetCloseVariants,
  premiumSheetCloseVariants,
  premiumSheetHandleVariants as sheetHandleVariants,
  premiumSheetHandleVariants,
  animationPresets,
};
