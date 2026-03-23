import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

/**
 * FAB (Floating Action Button) variants using CVA
 * Implements Material Design 3 FAB patterns with shape, size, and color options
 */
export const fabVariants = cva(
  [
    // Base styles
    "inline-flex items-center justify-center",
    "font-medium select-none",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    // M3 Motion - shape morph on press
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Active state shape morph (more square when pressed)
    "active:scale-95",
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
          "border-2 border-border bg-transparent text-foreground",
          "shadow-none",
          "hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/30",
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
       * Size variants following M3 FAB specifications
       * sm: 40px, md: 56px (default), lg: 96px
       */
      size: {
        sm: "size-10 [&_svg]:size-5",
        md: "size-14 [&_svg]:size-6",
        lg: "size-24 [&_svg]:size-9",
      },
      /**
       * Shape variants
       * round: fully rounded (circle for square FABs)
       * pill: fully rounded (same as round for icon-only)
       * rect: rounded corners based on size
       */
      shape: {
        round: "rounded-full",
        pill: "rounded-full",
        rect: "", // Handled by compound variants based on size
      },
      /**
       * Optional fixed positioning for FABs
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
      // Rect shape radius based on size (M3 corner radius)
      { shape: "rect", size: "sm", className: "rounded-[var(--radius-md)]" },
      { shape: "rect", size: "md", className: "rounded-[var(--radius-lg)]" },
      { shape: "rect", size: "lg", className: "rounded-[var(--radius-xl)]" },
      // Active state shape morph - rect gets more rounded, round gets more square
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
      shape: "round",
      position: "none",
    },
  }
);

export interface FABProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  /**
   * Icon element to display in the FAB
   */
  icon: React.ReactNode;
  /**
   * Custom positioning styles when position is set to a fixed value
   * Useful for custom offsets or responsive positioning
   */
  positionStyle?: React.CSSProperties;
  /**
   * Optional label for accessibility (used as aria-label)
   */
  label?: string;
}

/**
 * FAB - Floating Action Button
 *
 * A prominent button for the primary action on a screen.
 * Follows Material Design 3 specifications with shape morphing animations.
 *
 * @example
 * ```tsx
 * <FAB icon={<PlusIcon />} label="Add item" />
 * <FAB icon={<EditIcon />} size="lg" colorStyle="tertiary" position="bottom-right" />
 * ```
 */
const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
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
        data-slot="fab"
        aria-label={label}
        className={cn(
          fabVariants({ colorStyle, size, shape, position }),
          className
        )}
        style={combinedStyle}
        {...props}
      >
        {icon}
      </button>
    );
  }
);
FAB.displayName = "FAB";

export { FAB };
