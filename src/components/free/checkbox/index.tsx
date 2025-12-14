import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Minus } from "lucide-react";

import { cn } from "../../../lib/utils";

/**
 * State layer size variants - MD3 specifies 40dp state layer around 18dp checkbox
 * MD3 State Layer Opacity: hover=8%, focus=10%, press=10%, drag=16%
 */
const stateLayerSizeVariants = cva(
  [
    "relative inline-flex items-center justify-center",
    "rounded-full",
    // Smooth transition for hover/focus state changes
    "transition-[background-color]",
    "duration-200",
    "ease-out",
    // Enable GPU acceleration for smoother animation
    "transform-gpu",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-9", // 36px state layer for sm
        md: "size-10", // 40px state layer (MD3 spec)
        lg: "size-12", // 48px state layer for lg
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * Checkbox container variants using CVA
 * Implements Material Design 3 patterns with proper states and styling
 */
const checkboxContainerVariants = cva(
  [
    "inline-flex items-center",
    "outline-none",
    "disabled:pointer-events-none",
  ].join(" "),
  {
    variants: {
      error: {
        true: "",
        false: "",
      },
      size: {
        sm: "gap-1",
        md: "gap-2",
        lg: "gap-3",
      },
    },
    defaultVariants: {
      error: false,
      size: "md",
    },
  }
);

/**
 * Checkbox variants using CVA
 * Implements Material Design 3 patterns with proper states and styling
 * MD3 Specs: 18dp container, 2dp corner radius, 2dp outline width
 */
const checkboxVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-sm", // 2dp corner radius
    "outline-none",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Unselected state - MD3: on-surface-variant color for outline
    "border-2 border-muted-foreground/70",
    "bg-transparent",
    // Checked state - MD3: primary container, no border
    "data-[state=checked]:border-0 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    // Indeterminate state - same as checked
    "data-[state=indeterminate]:border-0 data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
    // Disabled state
    "disabled:opacity-38",
  ].join(" "),
  {
    variants: {
      error: {
        true: [
          // Error unselected - MD3: error color for outline
          "border-destructive",
          // Error selected - MD3: error color for container
          "data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground",
          "data-[state=indeterminate]:bg-destructive data-[state=indeterminate]:text-destructive-foreground",
        ].join(" "),
        false: "",
      },
      size: {
        sm: "size-4", // 16px
        md: "size-[18px]", // 18dp (MD3 spec)
        lg: "size-6", // 24px
      },
    },
    defaultVariants: {
      error: false,
      size: "md",
    },
  }
);

export interface CheckboxProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
      "checked" | "defaultChecked"
    >,
    VariantProps<typeof checkboxVariants> {
  /**
   * The controlled checked state of the checkbox.
   * Must be used in conjunction with `onCheckedChange`.
   */
  checked?: boolean | "indeterminate";
  /**
   * The default checked state of the checkbox when it is initially rendered.
   */
  defaultChecked?: boolean | "indeterminate";
  /**
   * Event handler called when the checked state of the checkbox changes.
   */
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  /**
   * If true, the checkbox will be in an error state with appropriate styling.
   */
  error?: boolean;
  /**
   * The label text to display next to the checkbox.
   */
  label?: string;
  /**
   * The position of the label relative to the checkbox.
   * @default "right"
   */
  labelPosition?: "left" | "right";
  /**
   * Additional class names to apply to the container element.
   */
  className?: string;
}

/**
 * Internal checkbox element with state layer (ripple effect area)
 * MD3: 40dp state layer around 18dp checkbox container
 */
const CheckboxElement = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps & { rippleActive: boolean; onRippleEnd: () => void; onTriggerRipple: () => void }
>(
  (
    {
      error = false,
      size = "md",
      checked,
      defaultChecked,
      onCheckedChange,
      disabled,
      rippleActive,
      onRippleEnd,
      onTriggerRipple,
      ...props
    },
    ref
  ) => {
    const checkboxClasses = cn(checkboxVariants({ error, size }));

    // Get icon size based on checkbox size
    const iconSize = size === "sm" ? "size-2.5" : size === "lg" ? "size-4" : "size-3";
    const strokeWidth = size === "sm" ? 3 : size === "lg" ? 2.5 : 3;

    // Determine ripple color based on state for better type safety
    const getRippleColor = () => {
      if (error) return "bg-destructive/20";
      if (checked === true || checked === "indeterminate") return "bg-primary/20";
      return "bg-foreground/20";
    };

    // Determine hover state layer color based on state
    const getStateLayerHoverClass = () => {
      if (disabled) return "";
      if (error) return "hover:bg-destructive/[0.08] focus-within:bg-destructive/10 active:bg-destructive/10";
      if (checked === true || checked === "indeterminate") {
        return "hover:bg-primary/[0.08] focus-within:bg-primary/10 active:bg-primary/10";
      }
      return "hover:bg-foreground/[0.08] focus-within:bg-foreground/10 active:bg-foreground/10";
    };

    return (
      <span
        className={cn(
          stateLayerSizeVariants({ size }),
          // State layer colors - MD3 interaction states (8% hover, 10% focus/press)
          getStateLayerHoverClass(),
          // Disabled
          disabled && "opacity-38 pointer-events-none"
        )}
      >
        {/* Ripple animation element - positioned absolutely to cover the entire state layer */}
        <span
          className={cn(
            "absolute inset-0 rounded-full pointer-events-none",
            // Apply animation classes
            rippleActive ? cn(getRippleColor(), "animate-checkbox-ripple") : "opacity-0 scale-0"
          )}
          onAnimationEnd={onRippleEnd}
        />
        <CheckboxPrimitive.Root
          ref={ref}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={cn(checkboxClasses, "group")}
          data-error={error ? true : undefined}
          {...props}
          onMouseDown={onTriggerRipple}
        >
          <CheckboxPrimitive.Indicator
            className={cn(
              "flex items-center justify-center text-current",
              "data-[state=checked]:animate-checkbox-check",
              "data-[state=indeterminate]:animate-checkbox-check"
            )}
          >
            {checked === "indeterminate" ? (
              <Minus className={iconSize} strokeWidth={strokeWidth} />
            ) : (
              <Check className={iconSize} strokeWidth={strokeWidth} />
            )}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      </span>
    );
  }
);

CheckboxElement.displayName = "CheckboxElement";

/**
 * Checkbox - A customizable checkbox component following Material Design 3 patterns
 *
 * Built on top of Radix UI Checkbox primitive with full accessibility support.
 * Features a proper 40dp state layer around the 18dp checkbox for ripple effects.
 *
 * @example
 * ```tsx
 * <Checkbox label="Accept terms and conditions" />
 * <Checkbox label="Left label" labelPosition="left" />
 * <Checkbox error label="Error state" />
 * <Checkbox checked disabled label="Disabled checked" />
 * ```
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      error = false,
      size = "md",
      label,
      labelPosition = "right",
      checked,
      defaultChecked,
      onCheckedChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const [rippleActive, setRippleActive] = React.useState(false);

    const handleTriggerRipple = () => {
      if (!disabled) {
        // Prevent ripple from triggering when disabled
        setRippleActive(true);
      }
    };

    const handleRippleEnd = () => {
      setRippleActive(false);
    };

    const containerClasses = cn(
      checkboxContainerVariants({ error, size }),
      className,
      disabled && "opacity-50 pointer-events-none"
    );

    // Label text styling based on size - MD3: on-surface color
    const labelClasses = cn(
      "font-normal leading-none select-none cursor-pointer",
      "text-foreground",
      size === "sm" && "text-sm",
      size === "md" && "text-sm",
      size === "lg" && "text-base",
      disabled && "opacity-70 cursor-not-allowed"
    );

    const checkboxElement = (
      <CheckboxElement
        ref={ref}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        error={error}
        size={size}
        rippleActive={rippleActive}
        onRippleEnd={handleRippleEnd}
        onTriggerRipple={handleTriggerRipple}
        {...props}
      />
    );

    // If no label, just return the checkbox element
    if (!label) {
      return checkboxElement;
    }

    // If there's a label, wrap in a container with proper positioning
    return (
      <label className={containerClasses}>
        {labelPosition === "left" && (
          <span className={labelClasses}>{label}</span>
        )}
        {checkboxElement}
        {labelPosition === "right" && (
          <span className={labelClasses}>{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, checkboxVariants };