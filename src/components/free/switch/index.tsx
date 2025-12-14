import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../../lib/utils";

/**
 * State layer size variants - MD3 specifies 40dp state layer around switch handle
 * MD3 State Layer Opacity: hover=8%, focus=10%, press=10%
 */
const stateLayerVariants = cva(
  [
    "absolute rounded-full pointer-events-none",
    // Smooth transition for hover/focus state changes
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-9", // 36px state layer
        md: "size-10", // 40px state layer (MD3 spec)
        lg: "size-12", // 48px state layer
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * Switch track variants using CVA
 * Implements Material Design 3 patterns with proper states and styling
 * MD3 Specs: 32dp height, 52dp width track
 */
const switchTrackVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer items-center rounded-full",
    "border-2 border-transparent",
    "outline-none",
    // No ring on track - MD3 uses state layer on handle for focus
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Disabled state
    "disabled:cursor-not-allowed disabled:opacity-38",
    // Unchecked state - MD3: surface container highest with outline
    "bg-[hsl(var(--surface-container-high))]",
    "border-muted-foreground/50",
    // Checked state - MD3: primary color
    "data-[state=checked]:bg-primary",
    "data-[state=checked]:border-primary",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-6 w-10", // 24px x 40px
        md: "h-8 w-[52px]", // 32dp x 52dp (MD3 spec)
        lg: "h-10 w-16", // 40px x 64px
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * Switch thumb (handle) variants using CVA
 * Implements Material Design 3 patterns with proper states and sizing
 * 
 * MD3 Specs:
 * - Track: 52dp wide × 32dp tall, 2dp outline
 * - Handle (unselected, no icon): 16dp, centered vertically, 8dp from left edge of track
 * - Handle (selected, no icon): 24dp, centered vertically, 4dp from right edge of track
 * - Handle (with icon): 24dp always, 4dp from edges
 * - Handle (pressed): 28dp
 * 
 * Calculations for md size (52dp track, 2dp border):
 * - Unselected (16dp handle): translate-x = 8dp from left = 8px
 * - Selected (24dp handle): translate-x = 52dp - 24dp - 4dp = 24dp from left = 24px
 * - With icon (24dp handle): unselected = 4dp, selected = 24dp
 */
const switchThumbVariants = cva(
  [
    "pointer-events-none relative flex items-center justify-center rounded-full",
    "shadow-md",
    "ring-0",
    // MD3 Motion for handle movement
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Unchecked: muted foreground color (outline color)
    "bg-muted-foreground/70",
    // Checked: primary foreground (white on primary)
    "data-[state=checked]:bg-primary-foreground",
  ].join(" "),
  {
    variants: {
      size: {
        sm: [
          // Small: 14px unchecked, 18px checked (scaled proportionally)
          // Track: 40px wide, 24px tall
          "size-3.5 data-[state=checked]:size-[18px]",
          // Unselected: ~6px from left, Selected: 40 - 18 - 3 = 19px
          "translate-x-1.5 data-[state=checked]:translate-x-[19px]",
        ].join(" "),
        md: [
          // Medium (MD3 spec): 16dp unchecked, 24dp checked
          // Track: 52px wide, 32px tall
          "size-4 data-[state=checked]:size-6",
          // Unselected: 8px from left (centering 16px in left half)
          // Selected: 52 - 24 - 4 = 24px from left
          "translate-x-2 data-[state=checked]:translate-x-[24px]",
        ].join(" "),
        lg: [
          // Large: 20px unchecked, 28px checked (scaled proportionally)
          // Track: 64px wide, 40px tall
          "size-5 data-[state=checked]:size-7",
          // Unselected: ~10px from left, Selected: 64 - 28 - 5 = 31px
          "translate-x-2.5 data-[state=checked]:translate-x-[31px]",
        ].join(" "),
      },
      hasIcon: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // When has icon, thumb is always the larger size (24dp for md)
      // MD3: 4dp from edges when has icon
      {
        size: "sm",
        hasIcon: true,
        // 18px handle, track 40px: unselected=3px, selected=40-18-3=19px
        className: "size-[18px] translate-x-[3px] data-[state=checked]:translate-x-[19px]",
      },
      {
        size: "md",
        hasIcon: true,
        // 24px handle, track 52px: unselected=4px, selected=52-24-4=24px
        className: "size-6 translate-x-1 data-[state=checked]:translate-x-[24px]",
      },
      {
        size: "lg",
        hasIcon: true,
        // 28px handle, track 64px: unselected=5px, selected=64-28-5=31px
        className: "size-7 translate-x-[5px] data-[state=checked]:translate-x-[31px]",
      },
    ],
    defaultVariants: {
      size: "md",
      hasIcon: false,
    },
  }
);

/**
 * Switch icon variants - for icons inside the thumb
 * MD3 Specs: 16dp icons
 */
const switchIconVariants = cva(
  [
    "absolute inset-0 flex items-center justify-center",
    "transition-opacity",
    "duration-[var(--motion-duration-short)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "[&>svg]:size-3",
        md: "[&>svg]:size-4", // 16dp (MD3 spec)
        lg: "[&>svg]:size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchTrackVariants> {
  /**
   * Optional icon to display when switch is unchecked.
   * When provided, the thumb will always use the larger (checked) size.
   */
  uncheckedIcon?: React.ReactNode;
  /**
   * Optional icon to display when switch is checked.
   * When provided, the thumb will always use the larger (checked) size.
   */
  checkedIcon?: React.ReactNode;
  /**
   * Additional class names to apply to the track element.
   */
  className?: string;
  /**
   * Additional class names to apply to the thumb element.
   */
  thumbClassName?: string;
}

/**
 * Switch - A customizable switch component following Material Design 3 patterns
 *
 * Built on top of Radix UI Switch primitive with full accessibility support.
 * Features a proper 40dp state layer and optional icon support in the handle.
 * The thumb grows from 16dp to 24dp when checked (unless icons are provided,
 * then it stays at 24dp).
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Switch />
 *
 * // With icons
 * <Switch
 *   checkedIcon={<Check className="text-primary" />}
 *   uncheckedIcon={<X className="text-muted-foreground" />}
 * />
 *
 * // Controlled
 * const [checked, setChecked] = useState(false);
 * <Switch checked={checked} onCheckedChange={setChecked} />
 *
 * // Different sizes
 * <Switch size="sm" />
 * <Switch size="md" />
 * <Switch size="lg" />
 * ```
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(
  (
    {
      className,
      thumbClassName,
      size = "md",
      uncheckedIcon,
      checkedIcon,
      disabled,
      checked,
      defaultChecked,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    // Track internal state for uncontrolled component
    const [internalChecked, setInternalChecked] = React.useState(
      defaultChecked ?? false
    );

    // Use controlled value if provided, otherwise use internal state
    const isChecked = checked !== undefined ? checked : internalChecked;

    // Handle change for both controlled and uncontrolled
    const handleCheckedChange = React.useCallback(
      (newChecked: boolean) => {
        if (checked === undefined) {
          setInternalChecked(newChecked);
        }
        onCheckedChange?.(newChecked);
      },
      [checked, onCheckedChange]
    );

    // Determine if icons are provided
    const hasIcon = Boolean(uncheckedIcon || checkedIcon);

    // Ripple state
    const [rippleActive, setRippleActive] = React.useState(false);
    
    // Focus state for state layer visibility
    const [isFocused, setIsFocused] = React.useState(false);

    const handleTriggerRipple = () => {
      if (!disabled) {
        setRippleActive(true);
      }
    };

    const handleRippleEnd = () => {
      setRippleActive(false);
    };
    
    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    // Determine ripple/state layer color based on checked state
    const getRippleColor = () => {
      if (isChecked) return "bg-primary/20";
      return "bg-foreground/20";
    };

    // Get state layer hover classes
    const getStateLayerHoverClass = () => {
      if (disabled) return "";
      if (isChecked) {
        return "group-hover:bg-primary/[0.08] group-active:bg-primary/10";
      }
      return "group-hover:bg-foreground/[0.08] group-active:bg-foreground/10";
    };
    
    // Get focus state layer class (MD3: 10% opacity on focus)
    const getFocusStateLayerClass = () => {
      if (!isFocused || disabled) return "";
      if (isChecked) {
        return "bg-primary/10";
      }
      return "bg-foreground/10";
    };

    // Calculate state layer position based on thumb position
    // State layer is 40dp (md), centered on the thumb
    const getStateLayerPosition = () => {
      // Position the state layer centered on the thumb
      // For md: state layer is 40px, thumb positions are 8px (unselected) or 24px (selected)
      // State layer left = thumb center - state layer / 2
      if (isChecked) {
        switch (size) {
          case "sm":
            // Thumb at 19px + 9px (half of 18px) = 28px center, state layer 36px, left = 28 - 18 = 10px
            return hasIcon ? "left-[10px]" : "left-[10px]";
          case "lg":
            // Thumb at 31px + 14px (half of 28px) = 45px center, state layer 48px, left = 45 - 24 = 21px
            return hasIcon ? "left-[21px]" : "left-[21px]";
          default: // md
            // Thumb at 24px + 12px (half of 24px) = 36px center, state layer 40px, left = 36 - 20 = 16px
            return hasIcon ? "left-[16px]" : "left-[16px]";
        }
      } else {
        switch (size) {
          case "sm":
            // Thumb at 3px/6px + half size, state layer 36px
            return hasIcon ? "left-[-6px]" : "left-[-5px]";
          case "lg":
            // Thumb at 5px/10px + half size, state layer 48px
            return hasIcon ? "left-[-5px]" : "left-[-4px]";
          default: // md
            // Without icon: thumb at 8px + 8px (half of 16px) = 16px center, state layer 40px, left = 16 - 20 = -4px
            // With icon: thumb at 4px + 12px (half of 24px) = 16px center, state layer 40px, left = 16 - 20 = -4px
            return hasIcon ? "left-[-4px]" : "left-[-4px]";
        }
      }
    };

    return (
      <SwitchPrimitives.Root
        ref={ref}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        className={cn(
          switchTrackVariants({ size }),
          "group relative",
          className
        )}
        onMouseDown={handleTriggerRipple}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {/* State layer - follows the thumb */}
        <span
          className={cn(
            stateLayerVariants({ size }),
            getStateLayerPosition(),
            getStateLayerHoverClass(),
            getFocusStateLayerClass(),
            // Center vertically
            "top-1/2 -translate-y-1/2"
          )}
        >
          {/* Ripple animation element */}
          <span
            className={cn(
              "absolute inset-0 rounded-full pointer-events-none",
              rippleActive
                ? cn(getRippleColor(), "animate-checkbox-ripple")
                : "opacity-0 scale-0"
            )}
            onAnimationEnd={handleRippleEnd}
          />
        </span>

        {/* Thumb */}
        <SwitchPrimitives.Thumb
          className={cn(
            switchThumbVariants({ size, hasIcon }),
            thumbClassName
          )}
        >
          {/* Unchecked icon */}
          {uncheckedIcon && (
            <span
              className={cn(
                switchIconVariants({ size }),
                // Visible when unchecked, hidden when checked
                isChecked ? "opacity-0" : "opacity-100"
              )}
            >
              {uncheckedIcon}
            </span>
          )}
          {/* Checked icon */}
          {checkedIcon && (
            <span
              className={cn(
                switchIconVariants({ size }),
                // Visible when checked, hidden when unchecked
                isChecked ? "opacity-100" : "opacity-0"
              )}
            >
              {checkedIcon}
            </span>
          )}
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
    );
  }
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch, switchTrackVariants, switchThumbVariants };
