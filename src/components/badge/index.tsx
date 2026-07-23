"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/**
 * Badge variants using CVA
 * Implements Material Design 3 patterns with shadcn/ui styling foundation
 */
const badgeVariants = cva(
  [
    // Base styles
    "inline-flex items-center justify-center",
    "font-medium whitespace-nowrap shrink-0 w-fit overflow-hidden",
    // Focus states
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    // Transition for color and shadow
    "transition-[color,box-shadow,transform,opacity]",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // SVG icon sizing
    "[&>svg]:pointer-events-none [&>svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      /**
       * Visual style following M3 color system
       */
      variant: {
        default: [
          "border-transparent bg-primary text-primary-foreground",
          "[a&]:hover:bg-primary/90",
        ].join(" "),
        secondary: [
          "border-transparent bg-secondary text-secondary-foreground",
          "[a&]:hover:bg-secondary/90",
        ].join(" "),
        destructive: [
          "border-transparent bg-destructive text-white",
          "[a&]:hover:bg-destructive/90",
          "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
          "dark:bg-destructive/60",
        ].join(" "),
        outline: [
          "border text-foreground",
          "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ].join(" "),
        success: [
          "border-transparent bg-green-600 text-white",
          "[a&]:hover:bg-green-600/90",
          "dark:bg-green-500",
        ].join(" "),
        warning: [
          "border-transparent bg-amber-500 text-black",
          "[a&]:hover:bg-amber-500/90",
          "dark:bg-amber-400",
        ].join(" "),
      },
      /**
       * Size variants following MD3 badge types
       * small: Simple dot indicator (no text)
       * medium: Standard badge with text (default)
       * large: Larger badge for emphasis
       */
      size: {
        small: "size-2 p-0 rounded-full border-0", // MD3 small badge - just a dot
        medium: "h-4 min-w-4 px-1 text-[10px] rounded-full border [&>svg]:size-2.5",
        large: "h-5 min-w-5 px-1.5 text-xs rounded-full border [&>svg]:size-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * When true, the badge will render as its child element
   */
  asChild?: boolean;
  /**
   * When true, uses tabular numerals for consistent number width
   * Automatically enabled when children is a number or numeric string
   */
  tabularNums?: boolean;
  /**
   * Maximum character count for the badge (MD3 recommends 4)
   * When exceeded, truncates and adds "+" suffix (e.g., 999+)
   * @default 4
   */
  maxChars?: number;
}

/**
 * Formats a numeric value for badge display following MD3 guidelines
 * - Truncates numbers > max to show "max+"
 * - Uses tabular numerals for consistent width
 */
function formatBadgeValue(
  value: React.ReactNode,
  maxChars: number
): React.ReactNode {
  if (typeof value === "number") {
    const maxValue = Math.pow(10, maxChars - 1) - 1; // e.g., maxChars=4 -> max=999
    if (value > maxValue) {
      return `${maxValue}+`;
    }
    return value.toString();
  }

  if (typeof value === "string") {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      const maxValue = Math.pow(10, maxChars - 1) - 1;
      if (numValue > maxValue) {
        return `${maxValue}+`;
      }
    }
  }

  return value;
}

/**
 * Checks if value should use tabular numerals
 */
function isNumeric(value: React.ReactNode): boolean {
  if (typeof value === "number") return true;
  if (typeof value === "string") {
    return !isNaN(parseInt(value, 10));
  }
  return false;
}

/**
 * Badge - A notification badge component following Material Design 3 patterns
 *
 * Supports two MD3 badge types:
 * - Small: Simple dot indicator (size="small")
 * - Large: Container with label text (size="medium" or "large")
 *
 * @example
 * ```tsx
 * // Standard text badge
 * <Badge>New</Badge>
 *
 * // Numeric badge with auto-truncation
 * <Badge>{1234}</Badge> // Displays "999+"
 *
 * // Small dot indicator
 * <Badge size="small" />
 *
 * // Destructive variant
 * <Badge variant="destructive">{5}</Badge>
 * ```
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      tabularNums,
      maxChars = 4,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "span";

    // Format children if numeric and not a small badge
    const formattedChildren =
      size === "small" ? null : formatBadgeValue(children, maxChars);

    // Auto-enable tabular nums for numeric content
    const useTabularNums = tabularNums ?? isNumeric(children);

    return (
      <Comp
        ref={ref}
        data-slot="badge"
        className={cn(
          badgeVariants({ variant, size }),
          useTabularNums && size !== "small" && "font-mono tabular-nums",
          className
        )}
        {...props}
      >
        {formattedChildren}
      </Comp>
    );
  }
);

Badge.displayName = "Badge";

// ============================================================================
// BadgeAnchor - Wrapper for positioning badges on other elements
// ============================================================================

const badgeAnchorVariants = cva("relative inline-flex", {
  variants: {
    /**
     * Position of the badge relative to the anchor
     */
    position: {
      "top-right": "",
      "top-left": "",
      "bottom-right": "",
      "bottom-left": "",
    },
  },
  defaultVariants: {
    position: "top-right",
  },
});

const badgePositionStyles = {
  "top-right": "absolute -top-1.5 -right-1.5 rtl:-left-1.5 rtl:right-auto",
  "top-left": "absolute -top-1.5 -left-1.5 rtl:-right-1.5 rtl:left-auto",
  "bottom-right": "absolute -bottom-1.5 -right-1.5 rtl:-left-1.5 rtl:right-auto",
  "bottom-left": "absolute -bottom-1.5 -left-1.5 rtl:-right-1.5 rtl:left-auto",
};

// Small badge uses different positioning (closer to anchor)
const smallBadgePositionStyles = {
  "top-right": "absolute -top-0.5 -right-0.5 rtl:-left-0.5 rtl:right-auto",
  "top-left": "absolute -top-0.5 -left-0.5 rtl:-right-0.5 rtl:left-auto",
  "bottom-right": "absolute -bottom-0.5 -right-0.5 rtl:-left-0.5 rtl:right-auto",
  "bottom-left": "absolute -bottom-0.5 -left-0.5 rtl:-right-0.5 rtl:left-auto",
};

export interface BadgeAnchorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeAnchorVariants> {
  /**
   * The badge to position
   */
  badge: React.ReactElement<BadgeProps>;
  /**
   * Whether the badge should be visible
   * @default true
   */
  showBadge?: boolean;
  /**
   * Whether to animate badge entrance/exit
   * @default true
   */
  animate?: boolean;
}

/**
 * BadgeAnchor - Positions a badge relative to its children
 *
 * Provides MD3-compliant badge placement with RTL support and entrance/exit animations.
 *
 * @example
 * ```tsx
 * // Badge on an icon
 * <BadgeAnchor badge={<Badge>{3}</Badge>}>
 *   <BellIcon />
 * </BadgeAnchor>
 *
 * // Small dot indicator
 * <BadgeAnchor badge={<Badge size="small" />} position="top-right">
 *   <InboxIcon />
 * </BadgeAnchor>
 *
 * // Conditional badge
 * <BadgeAnchor badge={<Badge>{count}</Badge>} showBadge={count > 0}>
 *   <NotificationIcon />
 * </BadgeAnchor>
 * ```
 */
const BadgeAnchor = React.forwardRef<HTMLDivElement, BadgeAnchorProps>(
  (
    {
      className,
      position = "top-right",
      badge,
      showBadge = true,
      animate = true,
      children,
      ...props
    },
    ref
  ) => {
    // Check if the badge is a small variant
    const isSmallBadge = badge.props.size === "small";

    // Get position styles based on badge size
    const positionStyles = isSmallBadge
      ? smallBadgePositionStyles[position || "top-right"]
      : badgePositionStyles[position || "top-right"];

    // Animation classes
    const animationClasses = animate
      ? [
          "transition-[transform,opacity]",
          "duration-[var(--motion-duration-medium)]",
          "ease-[var(--motion-easing-standard)]",
          showBadge
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 pointer-events-none",
        ].join(" ")
      : showBadge
        ? ""
        : "hidden";

    return (
      <div
        ref={ref}
        className={cn(badgeAnchorVariants({ position }), className)}
        {...props}
      >
        {children}
        {React.cloneElement(badge, {
          className: cn(positionStyles, animationClasses, badge.props.className),
        })}
      </div>
    );
  }
);

BadgeAnchor.displayName = "BadgeAnchor";

// ============================================================================
// Animated Badge - Badge with entrance/exit animations
// ============================================================================

export interface AnimatedBadgeProps extends BadgeProps {
  /**
   * Whether the badge is visible
   * @default true
   */
  visible?: boolean;
  /**
   * Animation type for entrance/exit
   * @default "scale"
   */
  animation?: "scale" | "fade" | "slide";
}

/**
 * AnimatedBadge - Badge with built-in entrance/exit animations
 *
 * @example
 * ```tsx
 * <AnimatedBadge visible={hasNotifications}>{count}</AnimatedBadge>
 * <AnimatedBadge visible={isNew} animation="fade">New</AnimatedBadge>
 * ```
 */
const AnimatedBadge = React.forwardRef<HTMLSpanElement, AnimatedBadgeProps>(
  ({ className, visible = true, animation = "scale", ...props }, ref) => {
    const animationClasses = {
      scale: visible
        ? "scale-100 opacity-100"
        : "scale-0 opacity-0 pointer-events-none",
      fade: visible ? "opacity-100" : "opacity-0 pointer-events-none",
      slide: visible
        ? "translate-y-0 opacity-100"
        : "-translate-y-2 opacity-0 pointer-events-none",
    };

    return (
      <Badge
        ref={ref}
        className={cn(
          "transition-[transform,opacity]",
          "duration-[var(--motion-duration-medium)]",
          "ease-[var(--motion-easing-standard)]",
          animationClasses[animation],
          className
        )}
        {...props}
      />
    );
  }
);

AnimatedBadge.displayName = "AnimatedBadge";

export { Badge, BadgeAnchor, AnimatedBadge, badgeVariants };
