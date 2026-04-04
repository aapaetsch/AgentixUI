"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { Spinner } from "../spinner";
import { Button } from "../button";

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * ScrollArea root variants
 */
const scrollAreaVariants = cva(
  [
    "relative overflow-hidden",
  ].join(" "),
  {
    variants: {
      /**
       * Size variants - currently only affects documentation, 
       * actual scrollbar sizing is on ScrollBar component
       */
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * ScrollBar variants - controls scrollbar thickness
 */
const scrollBarVariants = cva(
  [
    "flex touch-none select-none",
    // M3 Motion transitions
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      /**
       * Scrollbar size (thickness)
       * sm: 4px, md: 6px (default), lg: 8px
       */
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      /**
       * Scrollbar orientation
       */
      orientation: {
        vertical: "h-full border-l border-l-transparent p-[1px]",
        horizontal: "flex-col border-t border-t-transparent p-[1px]",
      },
      /**
       * Scrollbar visibility behavior
       */
      visibility: {
        auto: "opacity-0 hover:opacity-100 data-[state=visible]:opacity-100",
        always: "opacity-100",
        scroll: "opacity-0 data-[state=visible]:opacity-100",
        hover: "opacity-0 group-hover:opacity-100",
      },
    },
    compoundVariants: [
      // Size + orientation combinations for width/height
      { size: "sm", orientation: "vertical", className: "w-1" },
      { size: "sm", orientation: "horizontal", className: "h-1" },
      { size: "md", orientation: "vertical", className: "w-1.5" },
      { size: "md", orientation: "horizontal", className: "h-1.5" },
      { size: "lg", orientation: "vertical", className: "w-2" },
      { size: "lg", orientation: "horizontal", className: "h-2" },
    ],
    defaultVariants: {
      size: "md",
      orientation: "vertical",
      visibility: "auto",
    },
  }
);

/**
 * ScrollBar thumb variants
 */
const scrollBarThumbVariants = cva(
  [
    "relative flex-1 rounded-full",
    "bg-border",
    // Hover state
    "hover:bg-muted-foreground/50",
    // M3 Motion
    "transition-colors",
    "duration-[var(--motion-duration-short)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * Loading indicator container variants
 */
const loadingContainerVariants = cva(
  [
    "flex items-center justify-center",
    "py-4",
    "text-muted-foreground",
  ].join(" "),
  {
    variants: {
      mode: {
        auto: "",
        manual: "",
      },
    },
    defaultVariants: {
      mode: "auto",
    },
  }
);

// ============================================================================
// Types
// ============================================================================

type ScrollBarOrientation = "vertical" | "horizontal";
type ScrollBarVisibility = "auto" | "always" | "scroll" | "hover";
type InfiniteScrollMode = "auto" | "manual";

interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>,
    VariantProps<typeof scrollAreaVariants> {
  /**
   * Enable RTL (right-to-left) direction
   * @default false
   */
  rtl?: boolean;
  /**
   * Infinite scroll mode
   * - "auto": Triggers onLoadMore when sentinel enters viewport
   * - "manual": Shows "Load more" button that triggers onLoadMore
   */
  infiniteScrollMode?: InfiniteScrollMode;
  /**
   * Callback when more content should be loaded (infinite scroll)
   */
  onLoadMore?: () => void | Promise<void>;
  /**
   * Whether content is currently loading
   * @default false
   */
  isLoading?: boolean;
  /**
   * Whether there are more items to load
   * @default false
   */
  hasMore?: boolean;
  /**
   * Distance from bottom (in pixels) to trigger load more in auto mode
   * @default 100
   */
  distanceFromBottom?: number;
  /**
   * Custom loading indicator renderer
   * If not provided, uses built-in Spinner
   */
  renderLoading?: () => React.ReactNode;
  /**
   * Text for the "Load more" button in manual mode
   * @default "Load more"
   */
  loadMoreText?: string;
  /**
   * Size variant for scrollbars (passed to children)
   */
  scrollbarSize?: "sm" | "md" | "lg";
}

interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    VariantProps<typeof scrollBarVariants> {
  /**
   * Scrollbar orientation
   */
  orientation?: ScrollBarOrientation;
  /**
   * Scrollbar visibility behavior
   * - "auto": Shows on scroll, hides after delay
   * - "always": Always visible
   * - "scroll": Only visible while scrolling
   * - "hover": Only visible on hover
   */
  visibility?: ScrollBarVisibility;
}

// ============================================================================
// Context
// ============================================================================

interface ScrollAreaContextValue {
  scrollbarSize: "sm" | "md" | "lg";
  viewportRef: React.RefObject<HTMLDivElement | null>;
}

const ScrollAreaContext = React.createContext<ScrollAreaContextValue | null>(null);

function useScrollAreaContext() {
  const context = React.useContext(ScrollAreaContext);
  if (!context) {
    throw new Error("ScrollArea compound components must be used within a ScrollArea");
  }
  return context;
}

// ============================================================================
// Components
// ============================================================================

/**
 * ScrollArea - A custom scrollbar container with optional infinite scroll
 *
 * @example
 * ```tsx
 * // Basic vertical scroll
 * <ScrollArea className="h-72 w-48 rounded-md border">
 *   <div className="p-4">
 *     {items.map((item) => (
 *       <div key={item}>{item}</div>
 *     ))}
 *   </div>
 *   <ScrollBar />
 * </ScrollArea>
 *
 * // Horizontal scroll
 * <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
 *   <div className="flex p-4">
 *     {items.map((item) => (
 *       <div key={item} className="shrink-0">{item}</div>
 *     ))}
 *   </div>
 *   <ScrollBar orientation="horizontal" />
 * </ScrollArea>
 *
 * // With infinite scroll (auto mode)
 * <ScrollArea
 *   className="h-96"
 *   infiniteScrollMode="auto"
 *   onLoadMore={loadMore}
 *   isLoading={isLoading}
 *   hasMore={hasMore}
 * >
 *   {content}
 *   <ScrollBar />
 * </ScrollArea>
 * ```
 */
const ScrollArea = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      className,
      children,
      size = "md",
      rtl = false,
      infiniteScrollMode,
      onLoadMore,
      isLoading = false,
      hasMore = false,
      distanceFromBottom = 100,
      renderLoading,
      loadMoreText = "Load more",
      scrollbarSize = "md",
      ...props
    },
    ref
  ) => {
    const viewportRef = React.useRef<HTMLDivElement>(null);
    const sentinelRef = React.useRef<HTMLDivElement>(null);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);

    // Handle load more
    const handleLoadMore = React.useCallback(async () => {
      if (isLoading || isLoadingMore || !hasMore || !onLoadMore) return;

      setIsLoadingMore(true);
      try {
        await onLoadMore();
      } finally {
        setIsLoadingMore(false);
      }
    }, [isLoading, isLoadingMore, hasMore, onLoadMore]);

    // Intersection Observer for auto mode
    React.useEffect(() => {
      if (infiniteScrollMode !== "auto" || !hasMore || isLoading || isLoadingMore) return;

      const sentinel = sentinelRef.current;
      const viewport = viewportRef.current;
      if (!sentinel || !viewport) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            handleLoadMore();
          }
        },
        {
          root: viewport,
          rootMargin: `${distanceFromBottom}px`,
          threshold: 0,
        }
      );

      observer.observe(sentinel);

      return () => observer.disconnect();
    }, [infiniteScrollMode, hasMore, isLoading, isLoadingMore, distanceFromBottom, handleLoadMore]);

    // Context value
    const contextValue = React.useMemo(
      () => ({
        scrollbarSize,
        viewportRef,
      }),
      [scrollbarSize]
    );

    // Default loading indicator
    const defaultLoadingIndicator = (
      <div className={cn(loadingContainerVariants({ mode: infiniteScrollMode }))}>
        <Spinner size="sm" className="mr-2" />
        <span className="text-sm">Loading...</span>
      </div>
    );

    // Manual mode "Load more" button
    const loadMoreButton = (
      <div className="flex justify-center py-4">
        <Button
          colorStyle="outlined"
          size="sm"
          onClick={handleLoadMore}
          disabled={isLoading || isLoadingMore}
          loading={isLoading || isLoadingMore}
        >
          {loadMoreText}
        </Button>
      </div>
    );

    return (
      <ScrollAreaContext.Provider value={contextValue}>
        <ScrollAreaPrimitive.Root
          ref={ref}
          dir={rtl ? "rtl" : "ltr"}
          className={cn(scrollAreaVariants({ size }), "group", className)}
          data-slot="scroll-area"
          {...props}
        >
          <ScrollAreaPrimitive.Viewport
            ref={viewportRef}
            className="h-full w-full rounded-[inherit]"
            data-slot="scroll-area-viewport"
          >
            {children}

            {/* Infinite scroll controls */}
            {infiniteScrollMode && hasMore && (
              <>
                {infiniteScrollMode === "auto" && (
                  <>
                    {/* Sentinel for intersection observer */}
                    <div
                      ref={sentinelRef}
                      className="h-px w-full"
                      aria-hidden="true"
                    />
                    {/* Loading indicator for auto mode */}
                    {(isLoading || isLoadingMore) && (
                      renderLoading ? renderLoading() : defaultLoadingIndicator
                    )}
                  </>
                )}

                {infiniteScrollMode === "manual" && (
                  <>
                    {(isLoading || isLoadingMore) ? (
                      renderLoading ? renderLoading() : defaultLoadingIndicator
                    ) : (
                      loadMoreButton
                    )}
                  </>
                )}
              </>
            )}
          </ScrollAreaPrimitive.Viewport>
          {/* ScrollBar children are rendered outside viewport */}
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === ScrollBar) {
              return null; // ScrollBar will be rendered via children in correct position
            }
            return null;
          })}
          <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
      </ScrollAreaContext.Provider>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

/**
 * ScrollAreaViewport - The scrollable viewport container
 * Note: This is typically handled internally by ScrollArea, but exposed for advanced use cases
 */
const ScrollAreaViewport = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Viewport
    ref={ref}
    className={cn("h-full w-full rounded-[inherit]", className)}
    data-slot="scroll-area-viewport"
    {...props}
  >
    {children}
  </ScrollAreaPrimitive.Viewport>
));

ScrollAreaViewport.displayName = "ScrollAreaViewport";

/**
 * ScrollBar - Custom scrollbar for vertical or horizontal scrolling
 *
 * @example
 * ```tsx
 * // Vertical scrollbar (default)
 * <ScrollBar />
 *
 * // Horizontal scrollbar
 * <ScrollBar orientation="horizontal" />
 *
 * // Always visible scrollbar
 * <ScrollBar visibility="always" />
 *
 * // Small scrollbar
 * <ScrollBar size="sm" />
 * ```
 */
const ScrollBar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(
  (
    {
      className,
      orientation = "vertical",
      visibility = "auto",
      size,
      ...props
    },
    ref
  ) => {
    // Try to get size from context, fallback to prop or default
    let scrollbarSize: "sm" | "md" | "lg" = size ?? "md";
    try {
      const context = useScrollAreaContext();
      scrollbarSize = size ?? context.scrollbarSize;
    } catch {
      // Not in context, use prop or default
    }

    return (
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={ref}
        orientation={orientation}
        className={cn(
          scrollBarVariants({ size: scrollbarSize, orientation, visibility }),
          className
        )}
        data-slot="scroll-bar"
        {...props}
      >
        <ScrollAreaPrimitive.ScrollAreaThumb
          className={cn(scrollBarThumbVariants({ size: scrollbarSize }))}
          data-slot="scroll-bar-thumb"
        />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
    );
  }
);

ScrollBar.displayName = "ScrollBar";

// ============================================================================
// Exports
// ============================================================================

export {
  ScrollArea,
  ScrollAreaViewport,
  ScrollBar,
  scrollAreaVariants,
  scrollBarVariants,
  scrollBarThumbVariants,
  loadingContainerVariants,
  useScrollAreaContext,
};

export type {
  ScrollAreaProps,
  ScrollBarProps,
  ScrollBarOrientation,
  ScrollBarVisibility,
  InfiniteScrollMode,
};
