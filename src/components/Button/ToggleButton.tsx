import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * ToggleButton variants using CVA
 * Button with pressed/selected state and shape morphing
 */
const toggleButtonVariants = cva(
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
       * Visual style - changes based on pressed state
       */
      colorStyle: {
        filled: "",
        tonal: "",
        outlined: "",
      },
      /**
       * Size variants
       */
      size: {
        xs: "h-7 px-2.5 text-xs [&_svg]:size-3.5",
        sm: "h-8 px-3 text-sm [&_svg]:size-4",
        md: "h-9 px-4 text-sm [&_svg]:size-4",
        lg: "h-11 px-5 text-base [&_svg]:size-5",
        xl: "h-13 px-6 text-lg [&_svg]:size-6",
      },
      /**
       * Shape variants - morphs between states
       */
      shape: {
        round: "",
        rect: "",
      },
      /**
       * Pressed/selected state
       */
      pressed: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Filled - unpressed
      {
        colorStyle: "filled",
        pressed: false,
        className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      // Filled - pressed
      {
        colorStyle: "filled",
        pressed: true,
        className: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      // Tonal - unpressed
      {
        colorStyle: "tonal",
        pressed: false,
        className: "bg-muted text-muted-foreground hover:bg-muted/80",
      },
      // Tonal - pressed
      {
        colorStyle: "tonal",
        pressed: true,
        className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      // Outlined - unpressed
      {
        colorStyle: "outlined",
        pressed: false,
        className: "border border-border bg-transparent text-foreground hover:bg-accent",
      },
      // Outlined - pressed
      {
        colorStyle: "outlined",
        pressed: true,
        className: "border-2 border-primary bg-primary/10 text-primary hover:bg-primary/20",
      },
      // Shape - round unpressed
      {
        shape: "round",
        pressed: false,
        className: "rounded-full",
      },
      // Shape - round pressed (morphs to less round)
      {
        shape: "round",
        pressed: true,
        className: "rounded-[var(--radius-lg)]",
      },
      // Shape - rect unpressed
      {
        shape: "rect",
        pressed: false,
        className: "rounded-[var(--radius)]",
      },
      // Shape - rect pressed (morphs to more round)
      {
        shape: "rect",
        pressed: true,
        className: "rounded-[var(--radius-lg)]",
      },
    ],
    defaultVariants: {
      colorStyle: "filled",
      size: "md",
      shape: "rect",
      pressed: false,
    },
  }
);

export interface ToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    Omit<VariantProps<typeof toggleButtonVariants>, "pressed"> {
  /**
   * Controlled pressed state
   */
  pressed?: boolean;
  /**
   * Default pressed state (uncontrolled)
   */
  defaultPressed?: boolean;
  /**
   * Callback when pressed state changes
   */
  onPressedChange?: (pressed: boolean) => void;
}

/**
 * ToggleButton - A button with pressed/selected state and shape morphing
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <ToggleButton>Toggle me</ToggleButton>
 *
 * // Controlled
 * <ToggleButton pressed={isOn} onPressedChange={setIsOn}>
 *   {isOn ? 'On' : 'Off'}
 * </ToggleButton>
 * ```
 */
const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      className,
      colorStyle,
      size,
      shape,
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const [internalPressed, setInternalPressed] = React.useState(defaultPressed);
    const isControlled = controlledPressed !== undefined;
    const pressed = isControlled ? controlledPressed : internalPressed;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isControlled) {
        setInternalPressed(!pressed);
      }
      onPressedChange?.(!pressed);
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        type="button"
        data-slot="toggle-button"
        data-state={pressed ? "on" : "off"}
        aria-pressed={pressed}
        className={cn(
          toggleButtonVariants({ colorStyle, size, shape, pressed }),
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ToggleButton.displayName = "ToggleButton";

export { ToggleButton, toggleButtonVariants };
