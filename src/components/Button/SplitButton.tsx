import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * SplitButton container variants
 * M3 style: 2dp gap between leading and trailing buttons
 */
const splitButtonVariants = cva(
  [
    "inline-flex items-center",
    // M3 spec: 2dp gap between buttons
    "gap-0.5",
  ].join(" "),
  {
    variants: {
      colorStyle: {
        elevated: "",
        filled: "",
        tonal: "",
        outlined: "",
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
      },
    },
    defaultVariants: {
      colorStyle: "filled",
      size: "md",
    },
  }
);

/**
 * SplitButton leading (action) button variants
 * M3 style: pill outer corners, consistent subtle inner corners (6-8px)
 */
const splitButtonActionVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap font-medium select-none",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    // M3 Motion
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // M3 shape: use specific rem radius instead of rounded-full to avoid inner corner conflicts
    "rounded-l-[2rem] rounded-r-[0.5rem]",
  ].join(" "),
  {
    variants: {
      colorStyle: {
        elevated: [
          "bg-[hsl(var(--surface-container-low))] text-primary",
          "shadow-[var(--elevation-1)]",
          "hover:shadow-[var(--elevation-2)] hover:bg-[hsl(var(--surface-container))]",
          "active:shadow-[var(--elevation-1)]",
        ].join(" "),
        filled: [
          "bg-primary text-primary-foreground",
          "shadow-[var(--elevation-0)]",
          "hover:bg-primary/90",
          "active:bg-primary/80",
        ].join(" "),
        tonal: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
          "active:bg-secondary/70",
        ].join(" "),
        outlined: [
          "border border-border bg-transparent text-foreground",
          "hover:bg-accent/50",
          "active:bg-accent/70",
        ].join(" "),
      },
      size: {
        xs: "h-[2rem] pl-3 pr-2.5 text-xs [&_svg]:size-[18px] rounded-l-[1.5rem] rounded-r-[0.5rem]",
        sm: "h-[2.25rem] pl-4 pr-3 text-sm [&_svg]:size-5 rounded-l-[1.75rem] rounded-r-[0.5rem]",
        md: "h-[2.5rem] pl-4 pr-3 text-sm [&_svg]:size-5 rounded-l-[2rem] rounded-r-[0.5rem]",
        lg: "h-[3rem] pl-5 pr-4 text-base [&_svg]:size-6 rounded-l-[2.5rem] rounded-r-[0.5rem]",
        xl: "h-[3.5rem] pl-6 pr-5 text-lg [&_svg]:size-7 rounded-l-[3rem] rounded-r-[0.5rem]",
      },
    },
    defaultVariants: {
      colorStyle: "filled",
      size: "md",
    },
  }
);

/**
 * SplitButton trailing (menu) button variants
 * M3 style: full circle when open, subtle inner corners when closed
 */
const splitButtonTriggerVariants = cva(
  [
    "inline-flex items-center justify-center",
    "font-medium select-none",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    // M3 Motion
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // M3 shape: use specific rem radius instead of rounded-full to avoid inner corner conflicts (only when closed)
    "rounded-r-[2rem]",
  ].join(" "),
  {
    variants: {
      colorStyle: {
        elevated: [
          "bg-[hsl(var(--surface-container-low))] text-primary",
          "shadow-[var(--elevation-1)]",
          "hover:shadow-[var(--elevation-2)] hover:bg-[hsl(var(--surface-container))]",
          "active:shadow-[var(--elevation-1)]",
        ].join(" "),
        filled: [
          "bg-primary text-primary-foreground",
          "shadow-[var(--elevation-0)]",
          "hover:bg-primary/90",
          "active:bg-primary/80",
        ].join(" "),
        tonal: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
          "active:bg-secondary/70",
        ].join(" "),
        outlined: [
          "border border-border bg-transparent text-foreground",
          "hover:bg-accent/50",
          "active:bg-accent/70",
        ].join(" "),
      },
      size: {
        xs: "size-[2rem] [&_svg]:size-[22px] rounded-r-[1.5rem]",
        sm: "size-[2.25rem] [&_svg]:size-6 rounded-r-[1.75rem]",
        md: "size-[2.5rem] [&_svg]:size-6 rounded-r-[2rem]",
        lg: "size-[3rem] [&_svg]:size-7 rounded-r-[2.5rem]",
        xl: "size-[3.5rem] [&_svg]:size-8 rounded-r-[3rem]",
      },
      // Whether menu is open (controls left inner corner shape)
      // Open = circular (chevron up), Closed = inner corners (chevron down)
      open: {
        true: "rounded-l-full rounded-r-full", // Open: fully circular on both sides
        false: "rounded-l-[0.5rem]", // Closed: subtle inner corner (~8px) on left side
      },
    },
    defaultVariants: {
      colorStyle: "filled",
      size: "md",
      open: false,
    },
  }
);

/**
 * Chevron icon variants for rotation animation
 * Open = chevron pointing up, Closed = chevron pointing down
 */
const chevronVariants = cva(
  [
    "transition-transform",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-emphasized)]",
  ].join(" "),
  {
    variants: {
      open: {
        true: "rotate-180", // Open: chevron points up
        false: "rotate-0", // Closed: chevron points down (default ChevronDown)
      },
    },
    defaultVariants: {
      open: false,
    },
  }
);

export interface SplitButtonProps
  extends VariantProps<typeof splitButtonVariants> {
  /**
   * Content for the main action button
   */
  children: React.ReactNode;
  /**
   * Click handler for the main action
   */
  onAction?: () => void;
  /**
   * Click handler for the dropdown trigger
   */
  onDropdownClick?: () => void;
  /**
   * Whether the dropdown is open (controls chevron rotation and trigger shape)
   */
  dropdownOpen?: boolean;
  /**
   * Custom dropdown icon (disables rotation animation)
   */
  dropdownIcon?: React.ReactNode;
  /**
   * Whether the main action is disabled
   */
  actionDisabled?: boolean;
  /**
   * Whether the dropdown trigger is disabled
   */
  dropdownDisabled?: boolean;
  /**
   * Accessible label for the dropdown trigger
   */
  dropdownLabel?: string;
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * SplitButton - A button with a primary action and a dropdown trigger
 *
 * Material Design 3 styling features:
 * - 2dp gap between leading and trailing buttons
 * - Leading button: pill outer corners, small inner corners
 * - Trailing button: full circle when closed, pill-inner when open
 * - Chevron rotates 180° when open
 * - Inner corners morph on hover/focus/press states
 *
 * @example
 * ```tsx
 * <SplitButton
 *   onAction={() => console.log('Primary action')}
 *   onDropdownClick={() => setMenuOpen(!menuOpen)}
 *   dropdownOpen={menuOpen}
 * >
 *   Edit
 * </SplitButton>
 * ```
 */
const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      className,
      colorStyle,
      size,
      children,
      onAction,
      onDropdownClick,
      dropdownOpen = false,
      dropdownIcon,
      actionDisabled = false,
      dropdownDisabled = false,
      dropdownLabel = "Open menu",
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-slot="split-button"
        data-open={dropdownOpen}
        className={cn(splitButtonVariants({ colorStyle, size }), className)}
      >
        {/* Leading (action) button */}
        <button
          type="button"
          data-slot="split-button-action"
          disabled={actionDisabled}
          onClick={onAction}
          className={splitButtonActionVariants({
            colorStyle,
            size,
          })}
        >
          {children}
        </button>

        {/* Trailing (menu) button */}
        <button
          type="button"
          data-slot="split-button-trigger"
          disabled={dropdownDisabled}
          onClick={onDropdownClick}
          aria-label={dropdownLabel}
          aria-expanded={dropdownOpen}
          aria-haspopup="menu"
          className={splitButtonTriggerVariants({
            colorStyle,
            size,
            open: dropdownOpen,
          })}
        >
          {dropdownIcon ?? (
            <ChevronDown className={chevronVariants({ open: dropdownOpen })} />
          )}
        </button>
      </div>
    );
  }
);
SplitButton.displayName = "SplitButton";

export {
  SplitButton,
  splitButtonVariants,
  splitButtonActionVariants,
  splitButtonTriggerVariants,
  chevronVariants,
};
