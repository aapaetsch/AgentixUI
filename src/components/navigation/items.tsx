/**
 * Premium Navigation Components
 * 
 * Enhanced navigation components with:
 * - Advanced selection animations and indicators
 * - Horizontal and vertical orientation support
 * - Animated indicator transitions between items
 * - Submenu support with animated chevrons
 * - Customizable expand/collapse icons
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { AnimatedChevron } from "../animated-chevron";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion";
import {
  useNavigation,
  useNavigationOptional,
  NavBadge,
} from "./layout";

// ============================================================================
// Ref Utilities
// ============================================================================

/**
 * Merges multiple refs into a single callback ref
 */
function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}
// ============================================================================
// Navigation Context for Animated Indicators
// ============================================================================

interface PremiumNavGroupContextValue {
  /** Active item ID */
  activeItem: string | null;
  /** Set active item */
  setActiveItem: (id: string) => void;
  /** Orientation of the navigation */
  orientation: "horizontal" | "vertical";
  /** Register an item for indicator tracking */
  registerItem: (id: string, element: HTMLElement | null) => void;
}

const PremiumNavGroupContext = React.createContext<PremiumNavGroupContextValue | null>(null);

function usePremiumNavGroup() {
  return React.useContext(PremiumNavGroupContext);
}

// ============================================================================
// Premium Nav Group (Container with Animated Indicator)
// ============================================================================

const premiumNavGroupVariants = cva(
  "relative",
  {
    variants: {
      orientation: {
        horizontal: "flex flex-row items-center gap-1",
        vertical: "flex flex-col gap-0.5",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
);

const indicatorAnimationVariants = cva(
  "absolute bg-primary transition-all pointer-events-none z-0",
  {
    variants: {
      animation: {
        slide: "duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        spring: "duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        morph: "duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
        snap: "duration-150 ease-[cubic-bezier(0.4,0,0.6,1)]",
        fade: "duration-200 ease-in-out",
      },
      indicatorType: {
        bar: "rounded-full",
        pill: "rounded-full",
        line: "",
        underline: "rounded-full",
        topline: "rounded-full",
        highlight: "rounded-[var(--radius)]",
        dot: "rounded-full",
      },
    },
    defaultVariants: {
      animation: "slide",
      indicatorType: "bar",
    },
  }
);

export interface PremiumNavGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof premiumNavGroupVariants> {
  /** Default active item ID */
  defaultActiveItem?: string;
  /** Controlled active item */
  activeItem?: string;
  /** Callback when active item changes */
  onActiveItemChange?: (id: string) => void;
  /** Indicator animation style */
  indicatorAnimation?: "slide" | "spring" | "morph" | "snap" | "fade";
  /** Indicator type */
  indicatorType?: "bar" | "pill" | "line" | "underline" | "topline" | "highlight" | "dot";
  /** Indicator position (defaults based on orientation) */
  indicatorPosition?: "left" | "right" | "top" | "bottom";
  /** Show animated indicator */
  showIndicator?: boolean;
}

export const PremiumNavGroup = React.forwardRef<HTMLDivElement, PremiumNavGroupProps>(
  (
    {
      children,
      className,
      orientation = "vertical",
      defaultActiveItem,
      activeItem: controlledActiveItem,
      onActiveItemChange,
      indicatorAnimation = "slide",
      indicatorType = orientation === "horizontal" ? "underline" : "bar",
      indicatorPosition = orientation === "horizontal" ? "bottom" : "left",
      showIndicator = true,
      ...props
    },
    ref
  ) => {
    const [internalActiveItem, setInternalActiveItem] = React.useState(defaultActiveItem ?? "");
    const activeItem = controlledActiveItem ?? internalActiveItem;
    
    const itemsRef = React.useRef<Map<string, HTMLElement>>(new Map());
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({ opacity: 0 });

    const setActiveItem = React.useCallback((id: string) => {
      setInternalActiveItem(id);
      onActiveItemChange?.(id);
    }, [onActiveItemChange]);

    const registerItem = React.useCallback((id: string, element: HTMLElement | null) => {
      if (element) {
        itemsRef.current.set(id, element);
      } else {
        itemsRef.current.delete(id);
      }
    }, []);

    // Calculate indicator position
    React.useEffect(() => {
      if (!showIndicator || !activeItem || !containerRef.current) {
        setIndicatorStyle({ opacity: 0 });
        return;
      }

      const activeElement = itemsRef.current.get(activeItem);
      if (!activeElement) {
        setIndicatorStyle({ opacity: 0 });
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = activeElement.getBoundingClientRect();

      let style: React.CSSProperties = { opacity: 1 };

      if (orientation === "horizontal") {
        // Horizontal navigation - indicator moves horizontally
        const left = itemRect.left - containerRect.left;
        const width = itemRect.width;

        if (indicatorType === "underline") {
          style = { ...style, left, width, height: 2, bottom: 0 };
        } else if (indicatorType === "topline") {
          style = { ...style, left, width, height: 2, top: 0 };
        } else if (indicatorType === "pill") {
          const top = itemRect.top - containerRect.top;
          style = { ...style, left, width, top, height: itemRect.height };
          style.backgroundColor = "hsl(var(--accent))";
        } else if (indicatorType === "highlight") {
          const top = itemRect.top - containerRect.top;
          style = { ...style, left, width, top, height: itemRect.height };
          style.backgroundColor = "hsl(var(--accent))";
        } else if (indicatorType === "dot") {
          style = { ...style, left: left + width / 2 - 3, width: 6, height: 6, bottom: -10 };
        } else if (indicatorType === "bar") {
          if (indicatorPosition === "bottom") {
            style = { ...style, left: left + width * 0.15, width: width * 0.7, height: 3, bottom: 0 };
          } else {
            style = { ...style, left: left + width * 0.15, width: width * 0.7, height: 3, top: 0 };
          }
        }
      } else {
        // Vertical navigation - indicator moves vertically
        const top = itemRect.top - containerRect.top;
        const height = itemRect.height;

        if (indicatorType === "bar") {
          if (indicatorPosition === "right") {
            style = { ...style, top: top + height * 0.2, height: height * 0.6, width: 3, right: 0 };
          } else {
            style = { ...style, top: top + height * 0.2, height: height * 0.6, width: 3, left: 0 };
          }
        } else if (indicatorType === "line") {
          if (indicatorPosition === "right") {
            style = { ...style, top, height, width: 2, right: 0 };
          } else {
            style = { ...style, top, height, width: 2, left: 0 };
          }
        } else if (indicatorType === "pill") {
          style = { ...style, left: 4, right: 4, top, height };
          style.backgroundColor = "hsl(var(--accent))";
        } else if (indicatorType === "highlight") {
          style = { ...style, left: 4, right: 4, top, height };
          style.backgroundColor = "hsl(var(--accent))";
        } else if (indicatorType === "dot") {
          if (indicatorPosition === "right") {
            style = { ...style, top: top + height / 2 - 3, width: 6, height: 6, right: -10 };
          } else {
            style = { ...style, top: top + height / 2 - 3, width: 6, height: 6, left: -10 };
          }
        } else if (indicatorType === "underline") {
          style = { ...style, left: 12, right: 12, height: 2, top: top + height - 2 };
        }
      }

      setIndicatorStyle(style);
    }, [activeItem, orientation, indicatorType, indicatorPosition, showIndicator]);

    const contextValue = React.useMemo(() => ({
      activeItem,
      setActiveItem,
      orientation: orientation ?? "vertical",
      registerItem,
    }), [activeItem, setActiveItem, orientation, registerItem]);

    return (
      <PremiumNavGroupContext.Provider value={contextValue}>
        <div
          ref={mergeRefs(containerRef, ref)}
          data-slot="premium-nav-group"
          className={cn(premiumNavGroupVariants({ orientation }), className)}
          {...props}
        >
          {showIndicator && (
            <div
              data-slot="premium-nav-indicator"
              className={cn(
                indicatorAnimationVariants({
                  animation: indicatorAnimation,
                  indicatorType,
                })
              )}
              style={indicatorStyle}
              aria-hidden="true"
            />
          )}
          {children}
        </div>
      </PremiumNavGroupContext.Provider>
    );
  }
);
PremiumNavGroup.displayName = "PremiumNavGroup";

// ============================================================================
// Premium Nav Item with Selection Animations
// ============================================================================

const premiumNavItemVariants = cva(
  [
    "relative flex items-center gap-3",
    "px-3 py-2.5",
    "text-sm font-medium",
    "transition-all duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)]",
    "outline-none z-10",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "justify-center whitespace-nowrap",
        vertical: "w-full",
      },
      shape: {
        rectangular: "rounded-[var(--radius)]",
        pill: "rounded-full",
      },
      variant: {
        default: [
          "text-foreground/70",
          "hover:bg-accent hover:text-accent-foreground",
          "data-[active=true]:bg-accent data-[active=true]:text-foreground data-[active=true]:font-semibold",
        ].join(" "),
        subtle: [
          "text-foreground/70",
          "hover:bg-muted/60 hover:text-foreground",
          "data-[active=true]:bg-muted data-[active=true]:text-foreground data-[active=true]:font-semibold",
        ].join(" "),
        filled: [
          "text-foreground/70",
          "hover:bg-accent hover:text-accent-foreground",
          "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
          "data-[active=true]:shadow-md",
        ].join(" "),
        bordered: [
          "text-foreground/70 border border-transparent",
          "hover:bg-accent/50 hover:text-accent-foreground hover:border-border",
          "data-[active=true]:border-primary data-[active=true]:text-primary",
          "data-[active=true]:font-semibold",
        ].join(" "),
        ghost: [
          "text-foreground/60",
          "hover:text-foreground hover:bg-accent/30",
          "data-[active=true]:text-primary data-[active=true]:font-semibold",
        ].join(" "),
      },
      indicator: {
        none: "",
        left: "data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1/2 data-[active=true]:before:-translate-y-1/2 data-[active=true]:before:h-[60%] data-[active=true]:before:w-1 data-[active=true]:before:bg-primary data-[active=true]:before:rounded-r-full",
        right: "data-[active=true]:after:absolute data-[active=true]:after:right-0 data-[active=true]:after:top-1/2 data-[active=true]:after:-translate-y-1/2 data-[active=true]:after:h-[60%] data-[active=true]:after:w-1 data-[active=true]:after:bg-primary data-[active=true]:after:rounded-l-full",
        bottom: "data-[active=true]:after:absolute data-[active=true]:after:bottom-0 data-[active=true]:after:left-1/2 data-[active=true]:after:-translate-x-1/2 data-[active=true]:after:w-[60%] data-[active=true]:after:h-0.5 data-[active=true]:after:bg-primary data-[active=true]:after:rounded-t-full",
        top: "data-[active=true]:before:absolute data-[active=true]:before:top-0 data-[active=true]:before:left-1/2 data-[active=true]:before:-translate-x-1/2 data-[active=true]:before:w-[60%] data-[active=true]:before:h-0.5 data-[active=true]:before:bg-primary data-[active=true]:before:rounded-b-full",
        dot: "data-[active=true]:before:absolute data-[active=true]:before:-left-2 data-[active=true]:before:top-1/2 data-[active=true]:before:-translate-y-1/2 data-[active=true]:before:size-1.5 data-[active=true]:before:bg-primary data-[active=true]:before:rounded-full",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      shape: "rectangular",
      variant: "default",
      indicator: "none",
      disabled: false,
    },
  }
);

export interface PremiumNavItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    VariantProps<typeof premiumNavItemVariants> {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display label */
  label: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Link href */
  href?: string;
  /** Badge content */
  badge?: React.ReactNode;
  /** Whether item is currently active */
  active?: boolean;
  /** Custom click handler */
  onNavigate?: (id: string) => void;
}

export const PremiumNavItem = React.forwardRef<HTMLButtonElement, PremiumNavItemProps>(
  (
    {
      id,
      label,
      icon,
      href,
      badge,
      active: activeProp,
      orientation: orientationProp,
      shape = "rectangular",
      variant = "default",
      indicator = "none",
      disabled = false,
      onNavigate,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const groupContext = usePremiumNavGroup();
    const navigationContext = useNavigationOptional();
    
    const orientation = orientationProp ?? groupContext?.orientation ?? "vertical";
    const isActive = activeProp ?? (groupContext?.activeItem === id || navigationContext?.activeItem === id);

    // Register this item with the group for indicator tracking
    const itemRef = React.useRef<HTMLButtonElement | null>(null);
    React.useEffect(() => {
      groupContext?.registerItem(id, itemRef.current);
      return () => groupContext?.registerItem(id, null);
    }, [id, groupContext]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      
      onClick?.(e);
      onNavigate?.(id);
      groupContext?.setActiveItem(id);
      navigationContext?.setActiveItem(id);

      if (href) {
        window.location.href = href;
      }
    };

    return (
      <button
        ref={(node) => {
          itemRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        data-slot="premium-nav-item"
        data-active={isActive}
        className={cn(
          premiumNavItemVariants({ orientation, shape, variant, indicator, disabled: disabled || undefined }),
          className
        )}
        onClick={handleClick}
        disabled={disabled || undefined}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span className={cn("truncate", orientation === "vertical" && "flex-1 text-left")}>{label}</span>
        {badge && <span className="shrink-0">{badge}</span>}
      </button>
    );
  }
);
PremiumNavItem.displayName = "PremiumNavItem";

// ============================================================================
// Premium Nav Item with Submenu
// ============================================================================

export interface PremiumNavItemWithSubmenuProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "disabled">,
    Omit<VariantProps<typeof premiumNavItemVariants>, "orientation"> {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display label */
  label: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Badge content */
  badge?: React.ReactNode;
  /** Submenu items */
  children?: React.ReactNode;
  /** Whether submenu is open by default (alias: defaultExpanded) */
  defaultOpen?: boolean;
  /** @deprecated Use defaultOpen instead */
  defaultExpanded?: boolean;
  /** Controlled open state (alias: expanded) */
  open?: boolean;
  /** @deprecated Use open instead */
  expanded?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Custom expand icon */
  expandIcon?: React.ReactNode;
  /** Custom collapse icon */
  collapseIcon?: React.ReactNode;
  /** Use animated chevron */
  animated?: boolean;
  /** Indentation level (used for nested submenus) */
  level?: number;
}

export const PremiumNavItemWithSubmenu = React.forwardRef<
  HTMLDivElement,
  PremiumNavItemWithSubmenuProps
>(
  (
    {
      id,
      label,
      icon,
      badge,
      children,
      defaultOpen,
      defaultExpanded,
      open: openProp,
      expanded,
      onOpenChange,
      expandIcon,
      collapseIcon,
      animated = true,
      shape = "rectangular",
      variant = "default",
      indicator = "none",
      disabled = false,
      level = 0,
      className,
      ...props
    },
    ref
  ) => {
    // Support both defaultOpen and defaultExpanded (defaultOpen takes precedence)
    const defaultOpenState = defaultOpen ?? defaultExpanded ?? false;
    // Support both open and expanded (open takes precedence)
    const controlledOpen = openProp ?? expanded;
    
    const [internalOpen, setInternalOpen] = React.useState(defaultOpenState);
    const isOpen = controlledOpen ?? internalOpen;

    // Handle accordion value change - this is called by Radix when accordion state changes
    const handleAccordionValueChange = (value: string) => {
      if (disabled) return;
      const newOpen = value === id;
      setInternalOpen(newOpen);
      onOpenChange?.(newOpen);
    };

    const navigationContext = useNavigationOptional();
    const isActive = navigationContext?.activeItem === id;

    // Determine which chevron icon to use:
    // 1. If custom expandIcon AND collapseIcon provided -> use custom icons (not animated)
    // 2. If animated=true (and no custom icons) -> use AnimatedChevron
    // 3. Default fallback -> use static ChevronRight with rotation
    const hasCustomIcons = expandIcon !== undefined && collapseIcon !== undefined;
    const chevronIcon = React.useMemo(() => {
      if (hasCustomIcons) {
        // Custom icons take priority - show expand or collapse icon based on state
        return isOpen ? collapseIcon : expandIcon;
      }
      if (animated) {
        // Use animated chevron
        return <AnimatedChevron open={isOpen} size="sm" />;
      }
      // Fallback to static chevron with rotation
      return <ChevronRight className={cn("size-4 transition-transform", isOpen && "rotate-90")} />;
    }, [hasCustomIcons, animated, expandIcon, collapseIcon, isOpen]);

    // Calculate indentation padding based on level
    const indentationPadding = level > 0 ? `pl-${4 + level * 4}` : "pl-4";

    return (
      <div ref={ref} data-slot="premium-nav-item-submenu" data-level={level} className={className}>
        <Accordion
          type="single"
          collapsible
          value={isOpen ? id : ""}
          onValueChange={handleAccordionValueChange}
        >
          <AccordionItem value={id} className="border-none">
            <AccordionTrigger
              className={cn(
                premiumNavItemVariants({ orientation: "vertical", shape, variant, indicator, disabled: disabled || undefined }),
                "hover:no-underline data-[state=open]:no-underline"
              )}
              data-active={isActive}
              aria-expanded={isOpen}
              hideChevron
              {...props}
            >
              <div className="flex items-center gap-3 flex-1">
                {icon && <span className="shrink-0">{icon}</span>}
                <span className="flex-1 text-left truncate">{label}</span>
                {badge && <span className="shrink-0">{badge}</span>}
                <span className="ml-auto shrink-0">{chevronIcon}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className={cn(indentationPadding, "pt-1 pb-0")}>
              <div 
                className="space-y-0.5 border-l border-border/50 pl-2"
                role="group"
                aria-label={`${label} submenu`}
              >
                {children}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);
PremiumNavItemWithSubmenu.displayName = "PremiumNavItemWithSubmenu";

// ============================================================================
// Premium Submenu Item (Smaller styling for nested items)
// ============================================================================

const premiumSubmenuItemVariants = cva(
  [
    "relative flex items-center gap-2",
    // Smaller padding for submenu items (8px horizontal, 6px vertical per plan)
    "px-2 py-1.5",
    // Smaller height (36px per plan)
    "min-h-[2.25rem]",
    "text-sm font-normal",
    "transition-all duration-[var(--motion-duration-short)] ease-[var(--motion-easing-standard)]",
    "outline-none z-10",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    // Icon sizing for submenu items
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      shape: {
        rectangular: "rounded-[var(--radius)]",
        pill: "rounded-full",
      },
      variant: {
        default: [
          "text-foreground/70",
          "hover:bg-accent/80 hover:text-accent-foreground",
          "data-[active=true]:bg-accent data-[active=true]:text-foreground data-[active=true]:font-medium",
        ].join(" "),
        subtle: [
          "text-foreground/60",
          "hover:bg-muted/50 hover:text-foreground",
          "data-[active=true]:bg-muted/80 data-[active=true]:text-foreground data-[active=true]:font-medium",
        ].join(" "),
        ghost: [
          "text-foreground/60",
          "hover:text-foreground hover:bg-accent/30",
          "data-[active=true]:text-primary data-[active=true]:font-medium",
        ].join(" "),
      },
      indicator: {
        none: "",
        left: "data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1/2 data-[active=true]:before:-translate-y-1/2 data-[active=true]:before:h-[50%] data-[active=true]:before:w-0.5 data-[active=true]:before:bg-primary data-[active=true]:before:rounded-r-full",
        dot: "data-[active=true]:before:absolute data-[active=true]:before:-left-3 data-[active=true]:before:top-1/2 data-[active=true]:before:-translate-y-1/2 data-[active=true]:before:size-1 data-[active=true]:before:bg-primary data-[active=true]:before:rounded-full",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      shape: "rectangular",
      variant: "default",
      indicator: "none",
      disabled: false,
    },
  }
);

export interface PremiumSubmenuItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    VariantProps<typeof premiumSubmenuItemVariants> {
  /** Unique identifier for the submenu item */
  id: string;
  /** Display label */
  label: string;
  /** Icon element (smaller than main nav items) */
  icon?: React.ReactNode;
  /** Link href */
  href?: string;
  /** Badge content */
  badge?: React.ReactNode;
  /** Whether item is currently active */
  active?: boolean;
  /** Custom click handler */
  onNavigate?: (id: string) => void;
}

export const PremiumSubmenuItem = React.forwardRef<HTMLButtonElement, PremiumSubmenuItemProps>(
  (
    {
      id,
      label,
      icon,
      href,
      badge,
      active: activeProp,
      shape = "rectangular",
      variant = "default",
      indicator = "none",
      disabled = false,
      onNavigate,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const navigationContext = useNavigationOptional();
    const isActive = activeProp ?? navigationContext?.activeItem === id;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      
      onClick?.(e);
      onNavigate?.(id);
      navigationContext?.setActiveItem(id);

      if (href) {
        window.location.href = href;
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        data-slot="premium-submenu-item"
        data-active={isActive}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          premiumSubmenuItemVariants({ shape, variant, indicator, disabled: disabled || undefined }),
          className
        )}
        onClick={handleClick}
        disabled={disabled || undefined}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate flex-1 text-left">{label}</span>
        {badge && <span className="shrink-0">{badge}</span>}
      </button>
    );
  }
);
PremiumSubmenuItem.displayName = "PremiumSubmenuItem";

// ============================================================================
// Premium Nav Section with Submenu Support
// ============================================================================

export interface PremiumNavSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section title */
  title?: string;
  /** Whether section is collapsible */
  collapsible?: boolean;
  /** Whether collapsed by default */
  defaultCollapsed?: boolean;
}

export const PremiumNavSection = React.forwardRef<HTMLDivElement, PremiumNavSectionProps>(
  ({ title, collapsible = false, defaultCollapsed = false, children, className, ...props }, ref) => {
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

    if (!title) {
      return (
        <div
          ref={ref}
          data-slot="premium-nav-section"
          className={cn("space-y-0.5", className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (collapsible) {
      return (
        <div ref={ref} data-slot="premium-nav-section" className={className} {...props}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex items-center justify-between w-full",
              "px-3 py-2 text-xs font-semibold",
              "text-muted-foreground uppercase tracking-wider",
              "hover:text-foreground transition-colors"
            )}
          >
            {title}
            <AnimatedChevron open={!collapsed} size="sm" />
          </button>
          {!collapsed && <div className="space-y-0.5 mt-1">{children}</div>}
        </div>
      );
    }

    return (
      <div ref={ref} data-slot="premium-nav-section" className={className} {...props}>
        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </div>
        <div className="space-y-0.5">{children}</div>
      </div>
    );
  }
);
PremiumNavSection.displayName = "PremiumNavSection";

// ============================================================================
// Exports
// ============================================================================

export {
  premiumNavGroupVariants,
  indicatorAnimationVariants,
  premiumNavItemVariants,
  premiumSubmenuItemVariants,
};
