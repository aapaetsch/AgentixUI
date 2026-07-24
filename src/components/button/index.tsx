"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { Spinner } from "../spinner";

/**
 * Button variants using CVA
 * Implements Material Design 3 patterns with colorStyle, size, and shape options
 */
const buttonVariants = cva(
  [
    // Base styles
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap font-medium select-none",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    // M3 Motion
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Active state
    "active:scale-[0.98]",
    // SVG icon sizing
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "shrink-0",
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
          "shadow-[var(--elevation-1)]",
          // Hover: state layer + elevation lift
          "hover:shadow-[var(--elevation-2)] hover:bg-primary/85 hover:brightness-110",
          // Active: press effect
          "active:shadow-none active:brightness-95",
        ].join(" "),
        tonal: [
          "bg-secondary text-secondary-foreground",
          // Hover: visible state layer
          "hover:bg-secondary/70 hover:brightness-105",
          // Active: press effect
          "active:bg-secondary/60 active:brightness-95",
        ].join(" "),
        elevated: [
          "bg-[hsl(var(--surface-container-low))] text-primary",
          "shadow-[var(--elevation-2)]",
          // Hover: elevation lift + state layer
          "hover:shadow-[var(--elevation-3)] hover:bg-[hsl(var(--surface-container))] hover:brightness-105",
          // Active: press effect
          "active:shadow-[var(--elevation-1)] active:brightness-95",
        ].join(" "),
        outlined: [
          "border-2 border-border bg-transparent text-foreground",
          // Hover: visible background fill
          "hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/30",
          // Active: darker state
          "active:bg-accent/80",
        ].join(" "),
        text: [
          "bg-transparent text-primary",
          // Hover: visible state layer
          "hover:bg-primary/15",
          // Active: darker state
          "active:bg-primary/25",
        ].join(" "),
        destructive: [
          "bg-destructive text-destructive-foreground",
          "shadow-[var(--elevation-1)]",
          // Hover: state layer + elevation
          "hover:shadow-[var(--elevation-2)] hover:bg-destructive/85 hover:brightness-110",
          // Active: press effect
          "active:shadow-none active:brightness-90",
          "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        ].join(" "),
        ghost: [
          "bg-transparent text-foreground",
          // Hover: visible state layer
          "hover:bg-accent hover:text-accent-foreground",
          // Active: darker state
          "active:bg-accent/80",
        ].join(" "),
        link: [
          "bg-transparent text-primary underline-offset-4",
          "hover:underline hover:text-primary/80",
          "active:scale-100 active:text-primary/60", // No scale on link
        ].join(" "),
      },
      /**
       * Size variants following M3 specifications
       * xs: 1.75rem (28px), sm: 2rem (32px), md: 2.25rem (36px), lg: 2.75rem (44px), xl: 3.25rem (52px)
       */
      size: {
        xs: "h-[1.75rem] px-2.5 text-xs [&_svg]:size-3.5",
        sm: "h-[2rem] px-3 text-sm [&_svg]:size-4",
        md: "h-11 px-4 text-sm [&_svg]:size-4",
        lg: "h-[2.75rem] px-5 text-base [&_svg]:size-5",
        xl: "h-[3.25rem] px-6 text-lg [&_svg]:size-6",
      },
      /**
       * Shape variants
       * round: fully rounded (pill shape)
       * rect: standard rounded corners
       * square: less rounded, more angular
       */
      shape: {
        round: "rounded-full",
        rect: "", // Handled by compound variants based on size
        square: "", // Handled by compound variants based on size
      },
      /**
       * Icon-only mode - makes button square
       */
      iconOnly: {
        true: "px-0",
        false: "",
      },
    },
    compoundVariants: [
      // Rect shape radius based on size
      { shape: "rect", size: "xs", className: "rounded-[var(--radius-sm)]" },
      { shape: "rect", size: "sm", className: "rounded-[var(--radius)]" },
      { shape: "rect", size: "md", className: "rounded-[var(--radius)]" },
      { shape: "rect", size: "lg", className: "rounded-[var(--radius-md)]" },
      { shape: "rect", size: "xl", className: "rounded-[var(--radius-lg)]" },
      // Square shape - less rounded
      { shape: "square", size: "xs", className: "rounded-[var(--radius-sm)]" },
      { shape: "square", size: "sm", className: "rounded-[var(--radius-sm)]" },
      { shape: "square", size: "md", className: "rounded-[var(--radius-sm)]" },
      { shape: "square", size: "lg", className: "rounded-[var(--radius)]" },
      { shape: "square", size: "xl", className: "rounded-[var(--radius)]" },
      // Icon-only sizing - make square
      { iconOnly: true, size: "xs", className: "size-[1.75rem]" },
      { iconOnly: true, size: "sm", className: "size-[2rem]" },
      { iconOnly: true, size: "md", className: "size-[2.25rem]" },
      { iconOnly: true, size: "lg", className: "size-[2.75rem]" },
      { iconOnly: true, size: "xl", className: "size-[3.25rem]" },
      // Shape morph on active (MD3: round→square, square→round)
      { shape: "round", className: "active:rounded-[var(--radius)]" },
      { shape: "square", className: "active:rounded-full" },
    ],
    defaultVariants: {
      colorStyle: "filled",
      size: "md",
      shape: "rect",
      iconOnly: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, the button will render as its child element (useful for links)
   */
  asChild?: boolean;
  /**
   * When true, the button is disabled and shows a loading spinner
   */
  loading?: boolean;
  /**
   * Text to show when loading (replaces children)
   * @default undefined - keeps original children visible
   */
  loadingText?: string;
}

/**
 * Button - A customizable button component following Material Design 3 patterns
 *
 * @example
 * ```tsx
 * <Button colorStyle="filled">Click me</Button>
 * <Button colorStyle="outlined" size="sm" shape="round">Pill button</Button>
 * <Button colorStyle="tonal" iconOnly><PlusIcon /></Button>
 * <Button loading>Saving...</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      colorStyle,
      size,
      shape,
      iconOnly,
      asChild = false,
      loading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    // Determine spinner size based on button size
    const spinnerSize = size || "md";

    return (
      <Comp
        data-slot="button"
        data-loading={loading ? "" : undefined}
        className={cn(
          buttonVariants({ colorStyle, size, shape, iconOnly }),
          className
        )}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {asChild ? (
          // When asChild is true, we must render exactly one child
          // If loading, we display the loading text or nothing (as the parent controls the loading UI)
          children
        ) : (
          // When asChild is false, we can render multiple children
          <>
            {loading && (
              <Spinner
                size={spinnerSize}
                label="Loading"
                className="shrink-0"
              />
            )}
            {loading && loadingText ? loadingText : children}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
