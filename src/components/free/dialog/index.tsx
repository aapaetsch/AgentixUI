"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "../../../lib/utils";

// ============================================================================
// Variants
// ============================================================================

/**
 * DialogOverlay variants using CVA
 * Implements backdrop with blur and animations
 */
const dialogOverlayVariants = cva(
  [
    "fixed inset-0 z-50",
    "bg-black/50 backdrop-blur-sm",
    // M3 Motion for open/close
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  ].join(" ")
);

/**
 * DialogContent variants using CVA
 * Implements size variants, positioning, and animations
 */
const dialogContentVariants = cva(
  [
    // Base styles
    "fixed z-50",
    "grid gap-4 w-full",
    "border border-border bg-background",
    "shadow-[var(--elevation-5)]",
    "outline-none",
    // M3 Motion for open/close
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "duration-[var(--motion-duration-medium)]",
  ].join(" "),
  {
    variants: {
      /**
       * Size variants for dialog width
       * xs: 320px, sm: 400px, md: 500px (default), lg: 640px, xl: 800px, full: 100%
       */
      size: {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-none",
      },
      /**
       * Position variants
       * center: Centered on screen (default)
       * top: Near top of screen
       * fullscreen: Covers entire viewport (mobile-friendly)
       */
      position: {
        center: [
          "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "rounded-[var(--radius-lg)] p-6",
          // Scale animation for centered
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        ].join(" "),
        top: [
          "left-1/2 top-[10%] -translate-x-1/2",
          "rounded-[var(--radius-lg)] p-6",
          // Slide from top animation
          "data-[state=closed]:slide-out-to-top-[5%] data-[state=open]:slide-in-from-top-[5%]",
        ].join(" "),
        fullscreen: [
          "inset-0",
          "h-full max-h-none max-w-none",
          "rounded-none p-0",
          // Fade animation only for fullscreen
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        ].join(" "),
      },
    },
    defaultVariants: {
      size: "md",
      position: "center",
    },
  }
);

/**
 * DialogHeader variants
 */
const dialogHeaderVariants = cva(
  [
    "flex flex-col gap-1.5",
    "text-center sm:text-left",
  ].join(" ")
);

/**
 * DialogFooter variants
 */
const dialogFooterVariants = cva(
  [
    "flex flex-col-reverse gap-2",
    "sm:flex-row sm:justify-end",
  ].join(" ")
);

/**
 * DialogTitle variants
 */
const dialogTitleVariants = cva(
  [
    "text-lg font-semibold leading-none tracking-tight",
  ].join(" ")
);

/**
 * DialogDescription variants
 */
const dialogDescriptionVariants = cva(
  [
    "text-sm text-muted-foreground",
  ].join(" ")
);

/**
 * DialogClose button variants
 */
const dialogCloseVariants = cva(
  [
    "absolute right-4 top-4",
    "rounded-[var(--radius-sm)]",
    "opacity-70 ring-offset-background",
    "transition-opacity",
    "duration-[var(--motion-duration-short)]",
    "ease-[var(--motion-easing-standard)]",
    "hover:opacity-100",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    "disabled:pointer-events-none",
    "data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
  ].join(" ")
);

// ============================================================================
// Component Types
// ============================================================================

export interface DialogProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {}

export interface DialogTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> {}

export interface DialogPortalProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal> {}

export interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
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
   * Prevents closing the dialog by clicking the overlay or pressing Escape.
   * Useful for dialogs that require explicit user action to close.
   * @default false
   */
  preventBackgroundClose?: boolean;
}

export interface DialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface DialogFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

export interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

export interface DialogCloseProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {}

// ============================================================================
// Multi-Page Dialog Types
// ============================================================================

export type DialogTransition = "slide" | "fade" | "none";

export interface DialogPage {
  /** Unique identifier for the page */
  id: string;
  /** Page content render function */
  content: React.ReactNode;
  /** Optional page title */
  title?: string;
  /** Optional page description */
  description?: string;
}

export interface DialogPagesProps {
  /** Array of pages to display */
  pages: DialogPage[];
  /** Currently active page index or id */
  activePage: number | string;
  /** Transition type between pages */
  transition?: DialogTransition;
  /** Direction of slide transition */
  direction?: "forward" | "backward";
  /** Custom transition duration in ms */
  transitionDuration?: number;
  /** Callback when page transition completes */
  onTransitionEnd?: () => void;
  /** Additional className */
  className?: string;
}

export interface UseDialogPagesOptions {
  /** Initial page index or id */
  initialPage?: number | string;
  /** Total number of pages (for validation) */
  totalPages?: number;
  /** Callback when page changes */
  onPageChange?: (page: number | string, direction: "forward" | "backward") => void;
}

export interface UseDialogPagesReturn {
  /** Current active page */
  activePage: number | string;
  /** Direction of navigation */
  direction: "forward" | "backward";
  /** Navigate to next page */
  nextPage: () => void;
  /** Navigate to previous page */
  previousPage: () => void;
  /** Navigate to specific page */
  goToPage: (page: number | string) => void;
  /** Check if on first page */
  isFirstPage: boolean;
  /** Check if on last page */
  isLastPage: boolean;
  /** Reset to initial page */
  reset: () => void;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook for managing multi-page dialog navigation
 */
export function useDialogPages(
  options: UseDialogPagesOptions = {}
): UseDialogPagesReturn {
  const { initialPage = 0, totalPages, onPageChange } = options;
  
  const [activePage, setActivePage] = React.useState<number | string>(initialPage);
  const [direction, setDirection] = React.useState<"forward" | "backward">("forward");

  const currentIndex = typeof activePage === "number" ? activePage : 0;
  const maxIndex = totalPages ? totalPages - 1 : Infinity;

  const nextPage = React.useCallback(() => {
    if (typeof activePage === "number" && activePage < maxIndex) {
      setDirection("forward");
      const newPage = activePage + 1;
      setActivePage(newPage);
      onPageChange?.(newPage, "forward");
    }
  }, [activePage, maxIndex, onPageChange]);

  const previousPage = React.useCallback(() => {
    if (typeof activePage === "number" && activePage > 0) {
      setDirection("backward");
      const newPage = activePage - 1;
      setActivePage(newPage);
      onPageChange?.(newPage, "backward");
    }
  }, [activePage, onPageChange]);

  const goToPage = React.useCallback(
    (page: number | string) => {
      const newDirection =
        typeof page === "number" && typeof activePage === "number"
          ? page > activePage
            ? "forward"
            : "backward"
          : "forward";
      setDirection(newDirection);
      setActivePage(page);
      onPageChange?.(page, newDirection);
    },
    [activePage, onPageChange]
  );

  const reset = React.useCallback(() => {
    setDirection("forward");
    setActivePage(initialPage);
  }, [initialPage]);

  return {
    activePage,
    direction,
    nextPage,
    previousPage,
    goToPage,
    isFirstPage: currentIndex === 0,
    isLastPage: totalPages ? currentIndex === maxIndex : false,
    reset,
  };
}

// ============================================================================
// Context for nested dialogs
// ============================================================================

interface DialogContextValue {
  level: number;
}

const DialogContext = React.createContext<DialogContextValue>({ level: 0 });

function useDialogContext() {
  return React.useContext(DialogContext);
}

// ============================================================================
// Components
// ============================================================================

/**
 * Dialog - Root component for modal dialogs
 * 
 * Supports nested dialogs with proper stacking context.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Dialog Title</DialogTitle>
 *       <DialogDescription>Dialog description text.</DialogDescription>
 *     </DialogHeader>
 *     <div>Content here</div>
 *     <DialogFooter>
 *       <DialogClose asChild>
 *         <Button variant="outline">Cancel</Button>
 *       </DialogClose>
 *       <Button>Save</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
function Dialog({ children, ...props }: DialogProps) {
  const parentContext = useDialogContext();
  const level = parentContext.level + 1;

  return (
    <DialogContext.Provider value={{ level }}>
      <DialogPrimitive.Root data-slot="dialog" {...props}>
        {children}
      </DialogPrimitive.Root>
    </DialogContext.Provider>
  );
}

/**
 * DialogTrigger - Element that opens the dialog
 */
const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  DialogTriggerProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    data-slot="dialog-trigger"
    className={cn(className)}
    {...props}
  />
));
DialogTrigger.displayName = "DialogTrigger";

/**
 * DialogPortal - Renders dialog in a React portal
 */
function DialogPortal({ ...props }: DialogPortalProps) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/**
 * DialogOverlay - Backdrop overlay behind the dialog
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, ...props }, ref) => {
  const { level } = useDialogContext();
  
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="dialog-overlay"
      data-dialog-level={level}
      className={cn(dialogOverlayVariants(), className)}
      style={{
        // Increase z-index for nested dialogs
        zIndex: 50 + (level - 1) * 10,
      }}
      {...props}
    />
  );
});
DialogOverlay.displayName = "DialogOverlay";

/**
 * DialogContent - The main dialog container
 *
 * @example
 * ```tsx
 * // Default centered dialog
 * <DialogContent size="md">
 *   <DialogHeader>...</DialogHeader>
 *   <div>Content</div>
 * </DialogContent>
 *
 * // Fullscreen dialog (mobile-friendly)
 * <DialogContent position="fullscreen">
 *   <div className="p-6">Content</div>
 * </DialogContent>
 *
 * // Without close button
 * <DialogContent showCloseButton={false}>
 *   ...
 * </DialogContent>
 * ```
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      size,
      position,
      showCloseButton = true,
      closeButton,
      onCloseClick,
      preventBackgroundClose = false,
      onInteractOutside,
      onEscapeKeyDown,
      ...props
    },
    ref
  ) => {
    const { level } = useDialogContext();
    const isFullscreen = position === "fullscreen";

    // Handle overlay click prevention
    const handleInteractOutside = React.useCallback(
      (event: React.ComponentProps<typeof DialogPrimitive.Content>["onInteractOutside"] extends ((e: infer E) => void) | undefined ? E : never) => {
        if (preventBackgroundClose) {
          event.preventDefault();
        }
        onInteractOutside?.(event);
      },
      [preventBackgroundClose, onInteractOutside]
    );

    // Handle escape key prevention
    const handleEscapeKeyDown = React.useCallback(
      (event: React.ComponentProps<typeof DialogPrimitive.Content>["onEscapeKeyDown"] extends ((e: infer E) => void) | undefined ? E : never) => {
        if (preventBackgroundClose) {
          event.preventDefault();
        }
        onEscapeKeyDown?.(event);
      },
      [preventBackgroundClose, onEscapeKeyDown]
    );

    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          data-slot="dialog-content"
          data-dialog-level={level}
          className={cn(
            dialogContentVariants({ size: isFullscreen ? "full" : size, position }),
            className
          )}
          style={{
            // Increase z-index for nested dialogs
            zIndex: 50 + (level - 1) * 10 + 1,
          }}
          onInteractOutside={handleInteractOutside}
          onEscapeKeyDown={handleEscapeKeyDown}
          {...props}
        >
          {children}
          {showCloseButton && (
            closeButton || (
              <DialogPrimitive.Close
                data-slot="dialog-close-button"
                className={cn(
                  dialogCloseVariants(),
                  isFullscreen && "right-4 top-4"
                )}
                onClick={onCloseClick}
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = "DialogContent";

/**
 * DialogHeader - Container for dialog title and description
 */
function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(dialogHeaderVariants(), className)}
      {...props}
    />
  );
}

/**
 * DialogFooter - Container for dialog actions
 */
function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(dialogFooterVariants(), className)}
      {...props}
    />
  );
}

/**
 * DialogTitle - The dialog heading
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn(dialogTitleVariants(), className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

/**
 * DialogDescription - Descriptive text below the title
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn(dialogDescriptionVariants(), className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

/**
 * DialogClose - Element that closes the dialog
 */
const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  DialogCloseProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    data-slot="dialog-close"
    className={cn(className)}
    {...props}
  />
));
DialogClose.displayName = "DialogClose";

/**
 * DialogPages - Multi-page dialog content with transitions
 *
 * @example
 * ```tsx
 * const pages = [
 *   { id: "page1", content: <Page1 />, title: "Step 1" },
 *   { id: "page2", content: <Page2 />, title: "Step 2" },
 * ];
 *
 * const { activePage, direction, nextPage, previousPage } = useDialogPages({
 *   totalPages: pages.length,
 * });
 *
 * <DialogPages
 *   pages={pages}
 *   activePage={activePage}
 *   direction={direction}
 *   transition="slide"
 * />
 * ```
 */
function DialogPages({
  pages,
  activePage,
  transition = "slide",
  direction = "forward",
  transitionDuration = 200,
  onTransitionEnd,
  className,
}: DialogPagesProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = React.useState<number | undefined>(undefined);

  // Determine active page index
  const activeIndex =
    typeof activePage === "number"
      ? activePage
      : pages.findIndex((p) => p.id === activePage);

  const currentPage = pages[activeIndex];

  // Measure and lock container height to prevent layout shifts
  React.useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.scrollHeight;
      if (containerHeight === undefined) {
        setContainerHeight(height);
      }
    }
  }, []);

  // Trigger transition end callback
  React.useEffect(() => {
    if (transitionDuration > 0 && transition !== "none") {
      const timer = setTimeout(() => {
        onTransitionEnd?.();
      }, transitionDuration);
      return () => clearTimeout(timer);
    }
  }, [activePage, transitionDuration, transition, onTransitionEnd]);

  if (!currentPage) return null;

  // For slide transition, use a horizontal sliding container
  if (transition === "slide") {
    return (
      <div
        data-slot="dialog-pages"
        ref={containerRef}
        className={cn("relative overflow-hidden", className)}
        style={{
          minHeight: containerHeight ? `${containerHeight}px` : undefined,
        }}
      >
        <div
          className="flex transition-transform"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transitionDuration: `${transitionDuration}ms`,
            transitionTimingFunction: "var(--motion-easing-standard)",
          }}
        >
          {pages.map((page, index) => (
            <div
              key={page.id}
              className="w-full flex-shrink-0"
              aria-hidden={index !== activeIndex}
            >
              {page.content}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // For fade transition
  if (transition === "fade") {
    return (
      <div
        data-slot="dialog-pages"
        ref={containerRef}
        className={cn("relative overflow-hidden", className)}
        style={{
          minHeight: containerHeight ? `${containerHeight}px` : undefined,
        }}
      >
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={cn(
              "transition-opacity",
              index === activeIndex
                ? "opacity-100"
                : "opacity-0 absolute inset-0 pointer-events-none"
            )}
            style={{
              transitionDuration: `${transitionDuration}ms`,
              transitionTimingFunction: "var(--motion-easing-standard)",
            }}
            aria-hidden={index !== activeIndex}
          >
            {page.content}
          </div>
        ))}
      </div>
    );
  }

  // No transition
  return (
    <div
      data-slot="dialog-pages"
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        minHeight: containerHeight ? `${containerHeight}px` : undefined,
      }}
    >
      {currentPage.content}
    </div>
  );
}

// ============================================================================
// Responsive Dialog Hook
// ============================================================================

/**
 * Hook to determine if dialog should be fullscreen based on viewport
 */
export function useResponsiveDialog(breakpoint: number = 640) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return { isMobile, position: isMobile ? "fullscreen" : "center" } as const;
}

// ============================================================================
// Exports
// ============================================================================

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogPages,
  dialogOverlayVariants,
  dialogContentVariants,
  dialogHeaderVariants,
  dialogFooterVariants,
  dialogTitleVariants,
  dialogDescriptionVariants,
  dialogCloseVariants,
};
