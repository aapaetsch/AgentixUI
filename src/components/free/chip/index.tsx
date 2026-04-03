"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Check } from "lucide-react";

import { cn } from "../../../lib/utils";

type ChipVariant = "assist" | "filter" | "input" | "suggestion";
type ChipColor = "default" | "primary" | "secondary" | "success" | "warning" | "destructive";

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * Chip variants using CVA
 * Implements Material Design 3 chip patterns with proper states and styling
 *
 * MD3 Specs:
 * - Container height: 32dp
 * - Container shape: 8dp corner radius
 * - Icon size: 18dp
 * - Left/right padding: 16dp (without icon), 8dp (with icon)
 * - Padding between elements: 8dp
 */
const chipVariants = cva(
  [
    // Base layout
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap",
    // MD3: 32dp height, 8dp corner radius
    "h-8 rounded-lg",
    // Typography
    "text-sm font-medium",
    // Cursor
    "cursor-pointer",
    // Focus states
    "focus:outline-none focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    // Disabled state
    "disabled:pointer-events-none disabled:opacity-50",
    // Transition
    "transition-all",
    "duration-[var(--motion-duration-medium,200ms)]",
    "ease-[var(--motion-easing-standard,cubic-bezier(0.2,0,0,1))]",
    // Icon sizing
    "[&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg]:size-[18px]",
  ].join(" "),
  {
    variants: {
      /**
       * Chip type following MD3 specifications
       * - assist: Help users enter information or trigger actions
       * - filter: Help users filter content (toggleable)
       * - input: Represent discrete information (dismissible)
       * - suggestion: Suggest actions or options
       */
      variant: {
        assist: [
          // Outlined style by default
          "border border-outline-variant bg-transparent",
          "text-on-surface",
          // Hover state
          "hover:bg-on-surface/8",
          // Active/pressed state
          "active:bg-on-surface/12",
        ].join(" "),
        filter: [
          // Outlined when unselected
          "border border-outline-variant bg-transparent",
          "text-on-surface-variant",
          // Hover state
          "hover:bg-on-surface/8",
          // Active/pressed state
          "active:bg-on-surface/12",
          // Selected state handled via data attribute
          "data-[selected=true]:bg-secondary-container data-[selected=true]:border-transparent",
          "data-[selected=true]:text-on-secondary-container",
          "data-[selected=true]:hover:bg-secondary-container/90",
        ].join(" "),
        input: [
          // Outlined style
          "border border-outline-variant bg-transparent",
          "text-on-surface-variant",
          // Hover state
          "hover:bg-on-surface/8",
          // Active/pressed state
          "active:bg-on-surface/12",
          // Selected state
          "data-[selected=true]:bg-secondary-container data-[selected=true]:border-transparent",
          "data-[selected=true]:text-on-secondary-container",
        ].join(" "),
        suggestion: [
          // Outlined style
          "border border-outline-variant bg-transparent",
          "text-on-surface-variant",
          // Hover state
          "hover:bg-on-surface/8",
          // Active/pressed state
          "active:bg-on-surface/12",
        ].join(" "),
      },
      /**
       * Semantic color treatment for chips.
       * Colors use subtle surfaces by default and stronger fills when selected.
       */
      color: {
        default: "",
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        destructive: "",
      },
      /**
       * Whether the chip is elevated (has shadow)
       * Only applies to assist and suggestion chips per MD3
       */
      elevated: {
        true: [
          "border-transparent bg-surface-container-low",
          "shadow-md",
          "hover:shadow-lg",
        ].join(" "),
        false: "",
      },
      /**
       * Size variants
       * MD3 only defines one size (32dp) but we add flexibility
       */
      size: {
        sm: "h-7 text-xs gap-1.5 [&>svg]:size-4",
        md: "h-8 text-sm gap-2 [&>svg]:size-[18px]",
        lg: "h-9 text-base gap-2 [&>svg]:size-5",
      },
    },
    compoundVariants: [
      // Elevated only applies to assist and suggestion chips
      {
        variant: "filter",
        elevated: true,
        className: "border-outline-variant bg-transparent shadow-none hover:shadow-none",
      },
      {
        variant: "input",
        elevated: true,
        className: "border-outline-variant bg-transparent shadow-none hover:shadow-none",
      },
      {
        variant: ["assist", "suggestion"],
        color: "primary",
        className: "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 active:bg-primary/20",
      },
      {
        variant: ["assist", "suggestion"],
        color: "secondary",
        className: "border-secondary/40 bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 active:bg-secondary/80",
      },
      {
        variant: ["assist", "suggestion"],
        color: "success",
        className: "border-green-600/30 bg-green-600/10 text-green-700 hover:bg-green-600/15 active:bg-green-600/20 dark:text-green-400",
      },
      {
        variant: ["assist", "suggestion"],
        color: "warning",
        className: "border-amber-500/40 bg-amber-500/15 text-amber-800 hover:bg-amber-500/20 active:bg-amber-500/25 dark:text-amber-300",
      },
      {
        variant: ["assist", "suggestion"],
        color: "destructive",
        className: "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15 active:bg-destructive/20",
      },
      {
        variant: ["filter", "input"],
        color: "primary",
        className: [
          "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 active:bg-primary/15",
          "data-[selected=true]:border-primary/20 data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
          "data-[selected=true]:hover:bg-primary/90",
        ].join(" "),
      },
      {
        variant: ["filter", "input"],
        color: "secondary",
        className: [
          "border-secondary/40 bg-secondary/20 text-secondary-foreground hover:bg-secondary/35 active:bg-secondary/45",
          "data-[selected=true]:border-secondary/20 data-[selected=true]:bg-secondary data-[selected=true]:text-secondary-foreground",
          "data-[selected=true]:hover:bg-secondary/90",
        ].join(" "),
      },
      {
        variant: ["filter", "input"],
        color: "success",
        className: [
          "border-green-600/30 bg-green-600/5 text-green-700 hover:bg-green-600/10 active:bg-green-600/15 dark:text-green-400",
          "data-[selected=true]:border-green-600/20 data-[selected=true]:bg-green-600 data-[selected=true]:text-white",
          "data-[selected=true]:hover:bg-green-600/90",
        ].join(" "),
      },
      {
        variant: ["filter", "input"],
        color: "warning",
        className: [
          "border-amber-500/40 bg-amber-500/10 text-amber-800 hover:bg-amber-500/15 active:bg-amber-500/20 dark:text-amber-300",
          "data-[selected=true]:border-amber-500/20 data-[selected=true]:bg-amber-500 data-[selected=true]:text-black",
          "data-[selected=true]:hover:bg-amber-500/90",
        ].join(" "),
      },
      {
        variant: ["filter", "input"],
        color: "destructive",
        className: [
          "border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 active:bg-destructive/15",
          "data-[selected=true]:border-destructive/20 data-[selected=true]:bg-destructive data-[selected=true]:text-white",
          "data-[selected=true]:hover:bg-destructive/90",
        ].join(" "),
      },
    ],
    defaultVariants: {
      variant: "assist",
      color: "default",
      elevated: false,
      size: "md",
    },
  }
);

/**
 * Chip icon container variants
 * Handles proper sizing and spacing for leading/trailing icons
 */
const chipIconVariants = cva(
  [
    "inline-flex items-center justify-center shrink-0",
    "[&>svg]:size-[18px]",
  ].join(" "),
  {
    variants: {
      position: {
        leading: "",
        trailing: "",
      },
      size: {
        sm: "[&>svg]:size-4",
        md: "[&>svg]:size-[18px]",
        lg: "[&>svg]:size-5",
      },
    },
    defaultVariants: {
      position: "leading",
      size: "md",
    },
  }
);

/**
 * Chip dismiss button variants
 * The X button for dismissible input chips
 */
const chipDismissVariants = cva(
  [
    "inline-flex items-center justify-center shrink-0",
    "rounded-full",
    // Subtle background on hover
    "hover:bg-on-surface/12",
    "active:bg-on-surface/16",
    // Focus ring
    "focus:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    // Transition
    "transition-colors duration-150",
    // Cursor
    "cursor-pointer",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-4 [&>svg]:size-3",
        md: "size-[18px] [&>svg]:size-3.5",
        lg: "size-5 [&>svg]:size-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// ============================================================================
// Types
// ============================================================================

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "color">,
    VariantProps<typeof chipVariants> {
  /**
   * When true, the chip will render as its child element (polymorphic)
   * @default false
   */
  asChild?: boolean;
  /**
   * Optional icon to display at the start of the chip
   */
  leadingIcon?: React.ReactNode;
  /**
   * Optional icon to display at the end of the chip
   * Note: For input chips, this is typically the dismiss button
   */
  trailingIcon?: React.ReactNode;
  /**
   * Whether the chip is selected (for filter and input chips)
   * When true, shows checkmark for filter chips
   * @default false
   */
  selected?: boolean;
  /**
   * Callback when selection state changes (for filter chips)
   */
  onSelectedChange?: (selected: boolean) => void;
  /**
   * Whether the chip can be dismissed (for input chips)
   * When true, shows a dismiss button
   * @default false
   */
  dismissible?: boolean;
  /**
   * Callback when the dismiss button is clicked
   */
  onDismiss?: () => void;
  /**
   * Custom aria-label for the dismiss button
   * @default "Remove"
   */
  dismissLabel?: string;
  /**
   * Whether to show the checkmark when selected (filter chips)
   * @default true
   */
  showCheckmark?: boolean;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Chip - A Material Design 3 chip component
 *
 * Chips help people enter information, make selections, filter content,
 * or trigger actions.
 *
 * Four types are available:
 * - **Assist**: Help users enter information or trigger actions
 * - **Filter**: Help users filter content (toggleable selection)
 * - **Input**: Represent discrete information (dismissible)
 * - **Suggestion**: Suggest actions or options
 *
 * @example
 * ```tsx
 * // Assist chip with icon
 * <Chip variant="assist" leadingIcon={<Calendar />}>
 *   Schedule
 * </Chip>
 *
 * // Filter chip (toggleable)
 * <Chip
 *   variant="filter"
 *   selected={isSelected}
 *   onSelectedChange={setIsSelected}
 * >
 *   Category
 * </Chip>
 *
 * // Input chip (dismissible)
 * <Chip
 *   variant="input"
 *   dismissible
 *   onDismiss={() => handleRemove()}
 *   leadingIcon={<Avatar />}
 * >
 *   John Doe
 * </Chip>
 *
 * // Suggestion chip
 * <Chip variant="suggestion">
 *   Try this
 * </Chip>
 * ```
 */
const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant = "assist",
      color = "default",
      elevated = false,
      size = "md",
      asChild = false,
      leadingIcon,
      trailingIcon,
      selected = false,
      onSelectedChange,
      dismissible = false,
      onDismiss,
      dismissLabel = "Remove",
      showCheckmark = true,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Handle click for filter chips (toggle selection)
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (variant === "filter" && onSelectedChange) {
          onSelectedChange(!selected);
        }
        onClick?.(event);
      },
      [variant, selected, onSelectedChange, onClick]
    );

    // Handle dismiss click (prevent propagation to chip click)
    const handleDismiss = React.useCallback(
      (event: React.MouseEvent<HTMLSpanElement>) => {
        event.stopPropagation();
        onDismiss?.();
      },
      [onDismiss]
    );

    // Determine if we should show the checkmark
    const shouldShowCheckmark =
      variant === "filter" && selected && showCheckmark;

    // Determine padding based on icons
    const hasLeadingIcon = leadingIcon || shouldShowCheckmark;
    const hasTrailingIcon = trailingIcon || (dismissible && variant === "input");

    // Build padding classes
    const paddingClasses = cn(
      // Base padding (no icons)
      "px-4",
      // Reduced padding when icons are present
      hasLeadingIcon && "pl-2",
      hasTrailingIcon && "pr-2"
    );

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        role={variant === "filter" ? "checkbox" : undefined}
        aria-checked={variant === "filter" ? selected : undefined}
        data-selected={selected}
        data-slot="chip"
        className={cn(
          chipVariants({ variant, color, elevated, size }),
          paddingClasses,
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {/* Leading icon or checkmark */}
        {shouldShowCheckmark && (
          <span
            data-slot="chip-checkmark"
            className={cn(chipIconVariants({ position: "leading", size }))}
          >
            <Check />
          </span>
        )}
        {leadingIcon && !shouldShowCheckmark && (
          <span
            data-slot="chip-leading-icon"
            className={cn(chipIconVariants({ position: "leading", size }))}
          >
            {leadingIcon}
          </span>
        )}
        {/* Show both checkmark and leading icon for filter chips when both are present */}
        {shouldShowCheckmark && leadingIcon && (
          <span
            data-slot="chip-leading-icon"
            className={cn(chipIconVariants({ position: "leading", size }))}
          >
            {leadingIcon}
          </span>
        )}

        {/* Label */}
        <span data-slot="chip-label">{children}</span>

        {/* Trailing icon */}
        {trailingIcon && !(dismissible && variant === "input") && (
          <span
            data-slot="chip-trailing-icon"
            className={cn(chipIconVariants({ position: "trailing", size }))}
          >
            {trailingIcon}
          </span>
        )}

        {/* Dismiss button for input chips */}
        {dismissible && variant === "input" && (
          <span
            role="button"
            tabIndex={0}
            aria-label={dismissLabel}
            data-slot="chip-dismiss"
            className={cn(chipDismissVariants({ size }))}
            onClick={handleDismiss}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onDismiss?.();
              }
            }}
          >
            <X />
          </span>
        )}
      </Comp>
    );
  }
);

Chip.displayName = "Chip";

// ============================================================================
// ChipGroup Component
// ============================================================================

export interface ChipGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Spacing between chips
   * @default "md"
   */
  spacing?: "sm" | "md" | "lg";
  /**
   * Whether chips should wrap to next line
   * @default true
   */
  wrap?: boolean;
}

/**
 * ChipGroup variants using CVA
 */
const chipGroupVariants = cva(
  [
    "inline-flex items-center",
  ].join(" "),
  {
    variants: {
      spacing: {
        sm: "gap-1",
        md: "gap-2",
        lg: "gap-3",
      },
      wrap: {
        true: "flex-wrap",
        false: "flex-nowrap overflow-x-auto",
      },
    },
    defaultVariants: {
      spacing: "md",
      wrap: true,
    },
  }
);

/**
 * ChipGroup - A container for organizing multiple chips
 *
 * Provides proper spacing and optional wrapping behavior.
 *
 * @example
 * ```tsx
 * <ChipGroup>
 *   <Chip variant="filter" selected>Option 1</Chip>
 *   <Chip variant="filter">Option 2</Chip>
 *   <Chip variant="filter">Option 3</Chip>
 * </ChipGroup>
 * ```
 */
const ChipGroup = React.forwardRef<HTMLDivElement, ChipGroupProps>(
  ({ className, spacing = "md", wrap = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        data-slot="chip-group"
        className={cn(chipGroupVariants({ spacing, wrap }), className)}
        {...props}
      />
    );
  }
);

ChipGroup.displayName = "ChipGroup";

// ============================================================================
// Exports
// ============================================================================

export {
  Chip,
  ChipGroup,
  chipVariants,
  chipIconVariants,
  chipDismissVariants,
  chipGroupVariants,
};

export type { ChipColor, ChipVariant };
