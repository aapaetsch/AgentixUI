import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Spinner } from "../Spinner";

/**
 * IconButton variants using CVA
 * Dedicated icon-only button with width variants
 */
const iconButtonVariants = cva(
  [
    // Base styles
    "inline-flex items-center justify-center",
    "font-medium select-none",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    // M3 Motion
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Active state
    "active:scale-95",
    // SVG icon sizing
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      /**
       * Visual style following M3 color system
       * Enhanced with pronounced hover state layers and active press effects
       */
      colorStyle: {
        filled: [
          "bg-primary text-primary-foreground",
          // Hover: state layer
          "hover:bg-primary/85 hover:brightness-110",
          // Active: press effect
          "active:bg-primary/75 active:brightness-95",
        ].join(" "),
        tonal: [
          "bg-secondary text-secondary-foreground",
          // Hover: visible state layer
          "hover:bg-secondary/70 hover:brightness-105",
          // Active: press effect
          "active:bg-secondary/60 active:brightness-95",
        ].join(" "),
        outlined: [
          "border border-border bg-transparent text-foreground",
          // Hover: visible background fill
          "hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20",
          // Active: darker state
          "active:bg-accent/80",
        ].join(" "),
        standard: [
          "bg-transparent text-foreground",
          // Hover: visible state layer
          "hover:bg-accent/60",
          // Active: darker state
          "active:bg-accent/80",
        ].join(" "),
      },
      /**
       * Size variants
       */
      size: {
        xs: "size-7 [&_svg]:size-4",
        sm: "size-8 [&_svg]:size-4",
        md: "size-10 [&_svg]:size-5",
        lg: "size-12 [&_svg]:size-6",
        xl: "size-14 [&_svg]:size-7",
      },
      /**
       * Width variants for non-square icon buttons
       */
      width: {
        narrow: "", // Handled by compound variants
        default: "",
        wide: "", // Handled by compound variants
      },
      /**
       * Shape variants
       */
      shape: {
        round: "rounded-full",
        rect: "", // Handled by compound variants
        square: "", // Handled by compound variants
      },
    },
    compoundVariants: [
      // Rect shape radius
      { shape: "rect", size: "xs", className: "rounded-[var(--radius-sm)]" },
      { shape: "rect", size: "sm", className: "rounded-[var(--radius)]" },
      { shape: "rect", size: "md", className: "rounded-[var(--radius)]" },
      { shape: "rect", size: "lg", className: "rounded-[var(--radius-md)]" },
      { shape: "rect", size: "xl", className: "rounded-[var(--radius-lg)]" },
      // Square shape
      { shape: "square", size: "xs", className: "rounded-[var(--radius-sm)]" },
      { shape: "square", size: "sm", className: "rounded-[var(--radius-sm)]" },
      { shape: "square", size: "md", className: "rounded-[var(--radius-sm)]" },
      { shape: "square", size: "lg", className: "rounded-[var(--radius)]" },
      { shape: "square", size: "xl", className: "rounded-[var(--radius)]" },
      // Narrow width
      { width: "narrow", size: "xs", className: "w-6" },
      { width: "narrow", size: "sm", className: "w-7" },
      { width: "narrow", size: "md", className: "w-8" },
      { width: "narrow", size: "lg", className: "w-10" },
      { width: "narrow", size: "xl", className: "w-12" },
      // Wide width
      { width: "wide", size: "xs", className: "w-9" },
      { width: "wide", size: "sm", className: "w-10" },
      { width: "wide", size: "md", className: "w-12" },
      { width: "wide", size: "lg", className: "w-14" },
      { width: "wide", size: "xl", className: "w-16" },
      // Shape morph on active
      { shape: "round", className: "active:rounded-[var(--radius-xl)]" },
    ],
    defaultVariants: {
      colorStyle: "standard",
      size: "md",
      width: "default",
      shape: "round",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /**
   * Icon element to display
   */
  children: React.ReactNode;
  /**
   * Accessible label (required for icon-only buttons)
   */
  "aria-label": string;
  /**
   * When true, the button is disabled and shows a loading spinner
   */
  loading?: boolean;
}

/**
 * IconButton - A dedicated icon-only button component
 *
 * @example
 * ```tsx
 * <IconButton aria-label="Add item"><PlusIcon /></IconButton>
 * <IconButton colorStyle="filled" size="lg" aria-label="Settings"><SettingsIcon /></IconButton>
 * <IconButton loading aria-label="Loading"><PlusIcon /></IconButton>
 * ```
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      colorStyle,
      size,
      width,
      shape,
      children,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Determine spinner size based on icon button size
    const spinnerSizeMap: Record<string, "xs" | "sm" | "md" | "lg" | "xl"> = {
      xs: "xs",
      sm: "sm",
      md: "md",
      lg: "lg",
      xl: "xl",
    };
    const spinnerSize = spinnerSizeMap[size || "md"];

    return (
      <button
        ref={ref}
        type="button"
        data-slot="icon-button"
        data-loading={loading ? "" : undefined}
        className={cn(
          iconButtonVariants({ colorStyle, size, width, shape }),
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? <Spinner size={spinnerSize} label="Loading" /> : children}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
