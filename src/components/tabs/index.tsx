"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------------------------------
 * Tabs Context for Indicator Animation
 * -----------------------------------------------------------------------------------------------*/

type TabsVariant = "primary" | "secondary" | "pills" | "underline";
type TabsOrientation = "horizontal" | "vertical";

interface TabsContextValue {
  variant: TabsVariant;
  orientation: TabsOrientation;
  listRef: React.RefObject<HTMLDivElement | null>;
  registerTrigger: (value: string, element: HTMLButtonElement | null) => void;
  activeValue: string | undefined;
  triggerUpdateCount: number;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  return context;
}

/* -------------------------------------------------------------------------------------------------
 * Tabs Root
 * -----------------------------------------------------------------------------------------------*/

/**
 * Get orientation class for Tabs root
 * Controls layout direction based on orientation
 */
const getOrientationClass = (orientation: "horizontal" | "vertical" | undefined) => {
  return orientation === "vertical" ? "flex flex-row" : "flex flex-col";
};

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {}

/**
 * Tabs - Root container for tab navigation
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 * ```
 */
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    data-slot="tabs"
    orientation={orientation}
    className={cn(getOrientationClass(orientation), "gap-2", className)}
    {...props}
  />
));
Tabs.displayName = "Tabs";

/* -------------------------------------------------------------------------------------------------
 * TabsList
 * -----------------------------------------------------------------------------------------------*/

/**
 * TabsList variants using CVA
 * Implements Material Design 3 and shadcn patterns
 */
const tabsListVariants = cva(
  [
    "inline-flex items-center relative",
    // Motion
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      /**
       * Visual variant following MD3 tab types
       * primary: MD3 primary tabs with bottom indicator (3dp height, rounded)
       * secondary: MD3 secondary tabs with bottom indicator (2dp height)
       * pills: shadcn-style pill/segment tabs with background
       * underline: Simple underline style (shadcn default)
       */
      variant: {
        primary: [
          "relative",
          "border-b border-border",
          "bg-transparent",
        ].join(" "),
        secondary: [
          "relative",
          "border-b border-border",
          "bg-transparent",
        ].join(" "),
        pills: [
          "bg-muted p-1 rounded-lg",
          "text-muted-foreground",
        ].join(" "),
        underline: [
          "relative",
          "border-b border-border",
          "bg-transparent",
        ].join(" "),
      },
      /**
       * Size variants
       */
      size: {
        sm: "h-9",
        md: "h-10",
        lg: "h-12",
      },
      /**
       * Orientation of the tab list
       */
      orientation: {
        horizontal: "flex-row w-full justify-start",
        vertical: "flex-col h-auto w-auto items-stretch",
      },
    },
    compoundVariants: [
      // MD3 Primary tabs: 48dp (text only) or 64dp (with icons)
      { variant: "primary", size: "sm", className: "h-10" },
      { variant: "primary", size: "md", className: "h-12" },
      { variant: "primary", size: "lg", className: "h-16" },
      // MD3 Secondary tabs: 48dp
      { variant: "secondary", size: "sm", className: "h-9" },
      { variant: "secondary", size: "md", className: "h-12" },
      { variant: "secondary", size: "lg", className: "h-14" },
      // Pills size adjustments
      { variant: "pills", size: "sm", className: "h-8" },
      { variant: "pills", size: "md", className: "h-9" },
      { variant: "pills", size: "lg", className: "h-10" },
      // Vertical orientation adjustments
      { orientation: "vertical", variant: "primary", className: "border-b-0 border-r h-auto min-h-[32px]" },
      { orientation: "vertical", variant: "secondary", className: "border-b-0 border-r h-auto min-h-[32px]" },
      { orientation: "vertical", variant: "underline", className: "border-b-0 border-r h-auto min-h-[32px]" },
      { orientation: "vertical", variant: "pills", className: "flex-col w-auto min-w-[120px] px-1 py-1" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      orientation: "horizontal",
    },
  }
);

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

/**
 * Sliding indicator component for tabs
 * Renders an animated indicator that slides between active tabs
 */
function TabsIndicator({
  variant,
  orientation,
  listRef,
  activeValue,
  triggersRef,
  triggerUpdateCount,
}: {
  variant: TabsVariant;
  orientation: TabsOrientation;
  listRef: React.RefObject<HTMLDivElement | null>;
  activeValue: string | undefined;
  triggersRef: React.RefObject<Map<string, HTMLButtonElement | null>>;
  triggerUpdateCount: number;
}) {
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({
    opacity: 0,
  });

  // Update indicator position when active value changes or triggers are registered
  React.useLayoutEffect(() => {
    const updatePosition = () => {
      if (!activeValue || !listRef.current) {
        setIndicatorStyle({ opacity: 0 });
        return;
      }

      const triggers = triggersRef.current;
      if (!triggers) return;

      const activeElement = triggers.get(activeValue);
      if (!activeElement) {
        setIndicatorStyle({ opacity: 0 });
        return;
      }

      const listRect = listRef.current.getBoundingClientRect();
      const triggerRect = activeElement.getBoundingClientRect();

      if (orientation === "horizontal") {
        const left = triggerRect.left - listRect.left;
        const width = triggerRect.width;

        setIndicatorStyle({
          opacity: 1,
          transform: `translateX(${left}px)`,
          width: `${width}px`,
        });
      } else {
        const top = triggerRect.top - listRect.top;
        const height = triggerRect.height;

        setIndicatorStyle({
          opacity: 1,
          transform: `translateY(${top}px)`,
          height: `${height}px`,
        });
      }
    };

    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(updatePosition);
  }, [activeValue, orientation, listRef, triggersRef, triggerUpdateCount]);

  // Observe for resize changes
  React.useEffect(() => {
    if (!listRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      // Re-trigger position calculation on resize
      if (activeValue) {
        const triggers = triggersRef.current;
        const activeElement = triggers?.get(activeValue);
        if (activeElement && listRef.current) {
          const listRect = listRef.current.getBoundingClientRect();
          const triggerRect = activeElement.getBoundingClientRect();

          if (orientation === "horizontal") {
            const left = triggerRect.left - listRect.left;
            const width = triggerRect.width;
            setIndicatorStyle({
              opacity: 1,
              transform: `translateX(${left}px)`,
              width: `${width}px`,
            });
          } else {
            const top = triggerRect.top - listRect.top;
            const height = triggerRect.height;
            setIndicatorStyle({
              opacity: 1,
              transform: `translateY(${top}px)`,
              height: `${height}px`,
            });
          }
        }
      }
    });

    resizeObserver.observe(listRef.current);
    return () => resizeObserver.disconnect();
  }, [listRef, activeValue, orientation, triggersRef]);

  // Get indicator styles based on variant
  const getIndicatorClasses = () => {
    const isVertical = orientation === "vertical";
    
    if (variant === "pills") {
      return cn(
        "absolute rounded-md bg-background shadow-sm",
        "transition-all duration-200 ease-[var(--motion-easing-standard)]",
        isVertical ? "left-1 right-1 top-0.5 bottom-0.5" : "top-0.5 bottom-0.5" // Add horizontal margins for vertical
      );
    }

    if (variant === "primary") {
      return cn(
        "absolute bg-primary",
        "transition-all duration-200 ease-[var(--motion-easing-standard)]",
        isVertical
          ? "right-0 w-[3px] rounded-l-full top-2 bottom-2"
          : "bottom-0 h-[3px] rounded-t-full"
      );
    }

    if (variant === "secondary" || variant === "underline") {
      return cn(
        "absolute bg-primary",
        "transition-all duration-200 ease-[var(--motion-easing-standard)]",
        isVertical
          ? "right-0 w-[2px] top-2 bottom-2"
          : "bottom-0 h-[2px]"
      );
    }

    return "";
  };

  // Don't render indicator if no variant needs it
  if (!variant) return null;

  return (
    <span
      className={getIndicatorClasses()}
      style={indicatorStyle}
      aria-hidden="true"
    />
  );
}

/**
 * TabsList - Container for tab triggers
 *
 * @example
 * ```tsx
 * <TabsList variant="primary" size="md">
 *   <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 * </TabsList>
 * ```
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = "primary", size, orientation = "horizontal", children, ...props }, ref) => {
  const listRef = React.useRef<HTMLDivElement>(null);
  const triggersRef = React.useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const [activeValue, setActiveValue] = React.useState<string | undefined>();
  const [triggerUpdateCount, setTriggerUpdateCount] = React.useState(0);

  // Register trigger elements
  const registerTrigger = React.useCallback((value: string, element: HTMLButtonElement | null) => {
    if (element) {
      triggersRef.current.set(value, element);
    } else {
      triggersRef.current.delete(value);
    }
    // Trigger re-render to update indicator position
    setTriggerUpdateCount((prev) => prev + 1);
  }, []);

  // Observe for active state changes using MutationObserver
  React.useEffect(() => {
    if (!listRef.current) return;

    const updateActiveValue = () => {
      const activeTab = listRef.current?.querySelector('[data-state="active"]') as HTMLButtonElement | null;
      if (activeTab) {
        const value = activeTab.getAttribute("data-value");
        if (value) {
          setActiveValue(value);
        }
      }
    };

    // Initial check with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateActiveValue, 0);

    // Watch for attribute changes on children
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-state") {
          updateActiveValue();
          break;
        }
      }
    });

    observer.observe(listRef.current, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-state"],
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const contextValue = React.useMemo<TabsContextValue>(
    () => ({
      variant: variant ?? "primary",
      orientation: orientation ?? "horizontal",
      listRef,
      registerTrigger,
      activeValue,
      triggerUpdateCount,
    }),
    [variant, orientation, registerTrigger, activeValue]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <TabsPrimitive.List
        ref={(node) => {
          // Handle both refs
          (listRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVariants({ variant, size, orientation }), className)}
        {...props}
      >
        <TabsIndicator
          variant={variant ?? "primary"}
          orientation={orientation ?? "horizontal"}
          listRef={listRef}
          activeValue={activeValue}
          triggersRef={triggersRef}
          triggerUpdateCount={triggerUpdateCount}
        />
        {children}
      </TabsPrimitive.List>
    </TabsContext.Provider>
  );
});
TabsList.displayName = "TabsList";

/* -------------------------------------------------------------------------------------------------
 * TabsTrigger
 * -----------------------------------------------------------------------------------------------*/

/**
 * TabsTrigger variants using CVA
 * Implements Material Design 3 tab patterns
 * Indicator is now handled by TabsIndicator component with sliding animation
 */
const tabsTriggerVariants = cva(
  [
    "inline-flex min-h-11 items-center justify-center gap-2 touch-manipulation",
    "whitespace-nowrap font-medium",
    "select-none cursor-pointer",
    "outline-none relative z-10",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
    // Disabled state
    "disabled:pointer-events-none disabled:opacity-50",
    // Motion
    "transition-colors",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Icon sizing
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      /**
       * Visual variant matching TabsList
       * Note: Indicator styling is handled by TabsIndicator component
       */
      variant: {
        primary: [
          "px-6",
          "text-muted-foreground",
          // Active state - MD3 primary color
          "data-[state=active]:text-primary",
          // Hover state with subtle background and smooth transition
          "hover:text-foreground hover:bg-accent/30 active:bg-accent/50 transition-colors",
        ].join(" "),
        secondary: [
          "px-6",
          "text-muted-foreground",
          // Active state - MD3 on-surface color
          "data-[state=active]:text-foreground",
          // Hover state with subtle background and smooth transition
          "hover:text-foreground hover:bg-accent/30 active:bg-accent/50 transition-colors",
        ].join(" "),
        pills: [
          "px-4 py-0.5 rounded-md",
          "text-muted-foreground",
          // Active state - text color only (background is handled by indicator)
          "data-[state=active]:text-foreground",
          // Hover state with better transition
          "hover:text-foreground transition-colors",
        ].join(" "),
        underline: [
          "px-6 pb-2",
          "text-muted-foreground",
          // Active state
          "data-[state=active]:text-foreground",
          // Hover state with smooth transition
          "hover:text-foreground transition-colors",
        ].join(" "),
      },
      /**
       * Size variants
       */
      size: {
        sm: "text-xs [&_svg]:size-4",
        md: "text-sm [&_svg]:size-5",
        lg: "text-base [&_svg]:size-6",
      },
      /**
       * Orientation
       */
      orientation: {
        horizontal: "",
        vertical: "w-full justify-start px-1",
      },
    },
    compoundVariants: [
      // Vertical orientation adjustments
      {
        variant: "underline",
        orientation: "vertical",
        className: "pb-0 pr-2",
      },
      // Pills vertical
      {
        variant: "pills",
        orientation: "vertical",
        className: "w-full",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      orientation: "horizontal",
    },
  }
);

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  /**
   * Optional icon to display before the label
   */
  icon?: React.ReactNode;
}

/**
 * TabsTrigger - Individual tab button
 *
 * @example
 * ```tsx
 * <TabsTrigger value="tab1" icon={<HomeIcon />}>
 *   Home
 * </TabsTrigger>
 * ```
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, orientation, icon, children, value, ...props }, ref) => {
  const context = useTabsContext();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Register this trigger with the TabsList for indicator positioning
  // Use a ref to avoid re-running when context object reference changes
  const registerTriggerRef = React.useRef(context?.registerTrigger);
  registerTriggerRef.current = context?.registerTrigger;

  React.useEffect(() => {
    const registerTrigger = registerTriggerRef.current;
    if (registerTrigger && value) {
      registerTrigger(value, triggerRef.current);
      return () => {
        registerTrigger(value, null);
      };
    }
  }, [value]);

  return (
    <TabsPrimitive.Trigger
      ref={(node) => {
        // Handle both refs
        (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      data-slot="tabs-trigger"
      data-value={value}
      value={value}
      className={cn(tabsTriggerVariants({ variant, size, orientation }), className)}
      {...props}
    >
      {icon}
      {children}
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = "TabsTrigger";

/* -------------------------------------------------------------------------------------------------
 * TabsContent
 * -----------------------------------------------------------------------------------------------*/

/**
 * TabsContent variants using CVA
 */
const tabsContentVariants = cva(
  [
    "flex-1 outline-none",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2",
    // Motion for content transition
    "transition-opacity",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Animation states
    "data-[state=inactive]:opacity-0 data-[state=inactive]:hidden",
    "data-[state=active]:opacity-100",
  ].join(" "),
  {
    variants: {
      /**
       * Size affects padding
       */
      size: {
        sm: "mt-2 p-2",
        md: "mt-3 p-3",
        lg: "mt-4 p-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    VariantProps<typeof tabsContentVariants> {}

/**
 * TabsContent - Container for tab panel content
 *
 * @example
 * ```tsx
 * <TabsContent value="tab1">
 *   Content for tab 1
 * </TabsContent>
 * ```
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, size, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    className={cn(tabsContentVariants({ size }), className)}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
};
