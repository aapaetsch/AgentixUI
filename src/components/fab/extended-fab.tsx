import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Extended FAB variants using CVA
 * Extended FABs include both an icon and a text label
 */
export const extendedFabVariants = cva(
  [
    // Base styles
    "inline-flex items-center justify-center gap-2",
    "font-medium select-none whitespace-nowrap",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    // M3 Motion - shape morph on press
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Active state
    "active:scale-[0.98]",
    // SVG icon sizing
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      /**
       * Visual style following M3 color system
       */
      colorStyle: {
        filled: [
          "bg-primary text-primary-foreground",
          "shadow-[var(--elevation-3)]",
          "hover:shadow-[var(--elevation-4)] hover:bg-primary/90",
          "active:shadow-[var(--elevation-2)]",
        ].join(" "),
        tonal: [
          "bg-secondary text-secondary-foreground",
          "shadow-[var(--elevation-2)]",
          "hover:shadow-[var(--elevation-3)] hover:bg-secondary/80",
          "active:shadow-[var(--elevation-1)]",
        ].join(" "),
        elevated: [
          "bg-[hsl(var(--surface-container-low))] text-primary",
          "shadow-[var(--elevation-3)]",
          "hover:shadow-[var(--elevation-4)] hover:bg-[hsl(var(--surface-container))]",
          "active:shadow-[var(--elevation-2)]",
        ].join(" "),
        outlined: [
          "border border-border bg-transparent text-foreground",
          "shadow-none",
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-accent/80",
        ].join(" "),
        tertiary: [
          "bg-[hsl(var(--tertiary))] text-[hsl(var(--tertiary-foreground))]",
          "shadow-[var(--elevation-3)]",
          "hover:shadow-[var(--elevation-4)] hover:bg-[hsl(var(--tertiary))]/90",
          "active:shadow-[var(--elevation-2)]",
        ].join(" "),
      },
      /**
       * Size variants following M3 Extended FAB specifications
       * sm: 48px height, md: 56px height (default), lg: 72px height
       */
      size: {
        sm: "h-12 px-4 text-sm [&_svg]:size-5",
        md: "h-14 px-5 text-base [&_svg]:size-6",
        lg: "h-[4.5rem] px-6 text-lg [&_svg]:size-7",
      },
      /**
       * Shape variants
       * round/pill: fully rounded ends
       * rect: rounded corners based on size
       */
      shape: {
        round: "rounded-full",
        pill: "rounded-full",
        rect: "", // Handled by compound variants
      },
      /**
       * Optional fixed positioning
       */
      position: {
        none: "",
        "bottom-right": "fixed bottom-4 right-4 z-50",
        "bottom-left": "fixed bottom-4 left-4 z-50",
        "top-right": "fixed top-4 right-4 z-50",
        "top-left": "fixed top-4 left-4 z-50",
      },
    },
    compoundVariants: [
      // Rect shape radius based on size
      { shape: "rect", size: "sm", className: "rounded-[var(--radius-md)]" },
      { shape: "rect", size: "md", className: "rounded-[var(--radius-lg)]" },
      { shape: "rect", size: "lg", className: "rounded-[var(--radius-xl)]" },
      // Active state shape morph
      {
        shape: "round",
        className: "active:rounded-[var(--radius-xl)]",
      },
      {
        shape: "pill",
        className: "active:rounded-[var(--radius-xl)]",
      },
    ],
    defaultVariants: {
      colorStyle: "filled",
      size: "md",
      shape: "pill",
      position: "none",
    },
  }
);

export interface ExtendedFABProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof extendedFabVariants> {
  /**
   * Icon element to display before the label
   */
  icon: React.ReactNode;
  /**
   * Text label for the FAB
   */
  label: string;
  /**
   * Custom positioning styles when position is set to a fixed value
   */
  positionStyle?: React.CSSProperties;
  /**
   * Whether to collapse to icon-only on smaller screens
   * When true, hides the label on screens smaller than sm breakpoint
   */
  collapseOnMobile?: boolean;
}

/**
 * ExtendedFAB - Extended Floating Action Button
 *
 * A FAB that includes both an icon and a text label for clearer actions.
 * Follows Material Design 3 specifications.
 *
 * @example
 * ```tsx
 * <ExtendedFAB icon={<PlusIcon />} label="Create new" />
 * <ExtendedFAB
 *   icon={<EditIcon />}
 *   label="Edit document"
 *   size="lg"
 *   position="bottom-right"
 *   collapseOnMobile
 * />
 * ```
 */
const ExtendedFAB = React.forwardRef<HTMLButtonElement, ExtendedFABProps>(
  (
    {
      className,
      colorStyle,
      size,
      shape,
      position,
      positionStyle,
      icon,
      label,
      collapseOnMobile = false,
      style,
      ...props
    },
    ref
  ) => {
    const combinedStyle =
      position !== "none" && positionStyle
        ? { ...style, ...positionStyle }
        : style;

    return (
      <button
        ref={ref}
        type="button"
        data-slot="extended-fab"
        aria-label={label}
        className={cn(
          extendedFabVariants({ colorStyle, size, shape, position }),
          className
        )}
        style={combinedStyle}
        {...props}
      >
        {icon}
        <span className={cn(collapseOnMobile && "hidden sm:inline")}>
          {label}
        </span>
      </button>
    );
  }
);
ExtendedFAB.displayName = "ExtendedFAB";

export { ExtendedFAB };
