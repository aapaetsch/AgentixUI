import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

// ============================================================================
// Radio Group Components
// ============================================================================

/**
 * RadioGroup variants using CVA
 * Container for radio items with orientation support
 */
const radioGroupVariants = cva(
  [
    "grid gap-2",
  ].join(" "),
  {
    variants: {
      orientation: {
        vertical: "grid-flow-row",
        horizontal: "grid-flow-col auto-cols-max",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
);

/**
 * State layer size variants - MD3 specifies 40dp state layer around 20dp radio button
 * MD3 State Layer Opacity: hover=8%, focus=10%, press=10%
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
 * RadioGroupItem container variants using CVA
 * Implements Material Design 3 patterns with proper states and styling
 */
const radioGroupItemContainerVariants = cva(
  [
    "inline-flex items-center",
    "outline-none",
    "disabled:pointer-events-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "gap-1",
        md: "gap-2",
        lg: "gap-3",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * RadioGroupItem variants using CVA
 * Implements Material Design 3 patterns with proper states and styling
 * MD3 Specs: 20dp icon size, circular shape, 2dp border
 */
const radioGroupItemVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-full", // Circular shape
    "outline-none",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Unselected state - MD3: on-surface-variant color for outline
    "border-2 border-muted-foreground/70",
    "bg-transparent",
    // Disabled state
    "disabled:opacity-[0.38]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-4", // 16px
        md: "size-5", // 20dp (MD3 spec)
        lg: "size-6", // 24px
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * Radio indicator (inner circle) variants
 * MD3: Filled circle when selected
 */
const radioIndicatorVariants = cva(
  [
    "rounded-full",
    "bg-primary",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-2", // 8px inner circle
        md: "size-2.5", // 10px inner circle (half of 20dp)
        lg: "size-3", // 12px inner circle
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// ============================================================================
// RadioGroup Component
// ============================================================================

export interface RadioGroupProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    "orientation"
  >,
    VariantProps<typeof radioGroupVariants> {
  /**
   * The orientation of the radio group.
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal";
  /**
   * Additional class names to apply to the root element.
   */
  className?: string;
}

/**
 * RadioGroup - A container for radio button items
 *
 * Built on top of Radix UI Radio Group primitive with full accessibility support.
 * Implements roving tabindex for keyboard navigation.
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="option1">
 *   <RadioGroupItem value="option1" label="Option 1" />
 *   <RadioGroupItem value="option2" label="Option 2" />
 *   <RadioGroupItem value="option3" label="Option 3" />
 * </RadioGroup>
 * ```
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn(radioGroupVariants({ orientation }), className)}
      orientation={orientation}
      {...props}
    />
  );
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

// ============================================================================
// RadioGroupItem Component
// ============================================================================

export interface RadioGroupItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    "children"
  >,
  VariantProps<typeof radioGroupItemVariants> {
  /**
   * The label text to display next to the radio button.
   */
  label?: string;
  /**
   * The position of the label relative to the radio button.
   * @default "right"
   */
  labelPosition?: "left" | "right";
  /**
   * Additional class names to apply to the container element.
   */
  className?: string;
}

/**
 * Internal radio element with state layer (ripple effect area)
 * MD3: 40dp state layer around 20dp radio button
 */
const RadioElement = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps & {
    rippleActive: boolean;
    onRippleEnd: () => void;
    onTriggerRipple: () => void;
  }
>(
  (
    {
      size = "md",
      value,
      disabled,
      rippleActive,
      onRippleEnd,
      onTriggerRipple,
      ...props
    },
    ref
  ) => {
    // Track checked state internally for state layer styling
    const [isChecked, setIsChecked] = React.useState(false);
    const itemRef = React.useRef<HTMLButtonElement | null>(null);

    // Sync checked state with data-state attribute changes
    React.useEffect(() => {
      const element = itemRef.current;
      if (!element) return;

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.attributeName === "data-state") {
            setIsChecked(element.getAttribute("data-state") === "checked");
          }
        }
      });

      // Initial check
      setIsChecked(element.getAttribute("data-state") === "checked");

      observer.observe(element, { attributes: true });
      return () => observer.disconnect();
    }, []);

    const radioClasses = cn(
      radioGroupItemVariants({ size }),
      // Selected state - MD3: primary color for border
      "data-[state=checked]:border-primary"
    );

    // Determine ripple color based on state
    const getRippleColor = () => {
      if (isChecked) return "bg-primary/20";
      return "bg-foreground/20";
    };

    // Determine hover state layer color based on state
    const getStateLayerHoverClass = () => {
      if (disabled) return "";
      if (isChecked) {
        return "hover:bg-primary/[0.08] focus-within:bg-primary/10 active:bg-primary/10";
      }
      return "hover:bg-foreground/[0.08] focus-within:bg-foreground/10 active:bg-foreground/10";
    };

    // Combine refs using callback ref pattern
    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        // Set local ref
        itemRef.current = node;
        // Forward to external ref
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }
      },
      [ref]
    );

    return (
      <span
        className={cn(
          stateLayerSizeVariants({ size }),
          // State layer colors - MD3 interaction states (8% hover, 10% focus/press)
          getStateLayerHoverClass(),
          // Disabled
          disabled && "opacity-[0.38] pointer-events-none"
        )}
      >
        {/* Ripple animation element - positioned absolutely to cover the entire state layer */}
        <span
          className={cn(
            "absolute inset-0 rounded-full pointer-events-none",
            // Apply animation classes
            rippleActive
              ? cn(getRippleColor(), "animate-checkbox-ripple")
              : "opacity-0 scale-0"
          )}
          onAnimationEnd={onRippleEnd}
        />
        <RadioGroupPrimitive.Item
          ref={setRefs}
          value={value}
          disabled={disabled}
          className={radioClasses}
          onPointerDown={onTriggerRipple}
          {...props}
        >
          <RadioGroupPrimitive.Indicator
            className={cn(
              "flex items-center justify-center",
              "data-[state=checked]:animate-checkbox-check"
            )}
          >
            <span className={radioIndicatorVariants({ size })} />
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
      </span>
    );
  }
);

RadioElement.displayName = "RadioElement";

/**
 * RadioGroupItem - A single radio button within a RadioGroup
 *
 * Built on top of Radix UI Radio Group Item primitive with full accessibility support.
 * Features a proper 40dp state layer around the 20dp radio button for ripple effects.
 *
 * @example
 * ```tsx
 * <RadioGroupItem value="option1" label="Option 1" />
 * <RadioGroupItem value="option2" label="Option 2" labelPosition="left" />
 * <RadioGroupItem value="option3" disabled />
 * ```
 */
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(
  (
    {
      className,
      size = "md",
      label,
      labelPosition = "right",
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const [rippleActive, setRippleActive] = React.useState(false);

    const handleTriggerRipple = () => {
      if (!disabled) {
        setRippleActive(true);
      }
    };

    const handleRippleEnd = () => {
      setRippleActive(false);
    };

    const containerClasses = cn(
      radioGroupItemContainerVariants({ size }),
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

    const radioElement = (
      <RadioElement
        ref={ref}
        value={value}
        disabled={disabled}
        size={size}
        rippleActive={rippleActive}
        onRippleEnd={handleRippleEnd}
        onTriggerRipple={handleTriggerRipple}
        {...props}
      />
    );

    // If no label, just return the radio element
    if (!label) {
      return radioElement;
    }

    // If there's a label, wrap in a container with proper positioning
    return (
      <label className={containerClasses}>
        {labelPosition === "left" && (
          <span className={labelClasses}>{label}</span>
        )}
        {radioElement}
        {labelPosition === "right" && (
          <span className={labelClasses}>{label}</span>
        )}
      </label>
    );
  }
);

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// ============================================================================
// Exports
// ============================================================================

export {
  RadioGroup,
  RadioGroupItem,
  radioGroupVariants,
  radioGroupItemVariants,
  radioIndicatorVariants,
};
