import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

/**
 * ToggleIconButton variants using CVA
 * Icon button with toggle state
 */
const toggleIconButtonVariants = cva(
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
       * Visual style - changes based on pressed state
       */
      colorStyle: {
        filled: "",
        tonal: "",
        outlined: "",
        standard: "",
      },
      /**
       * Size variants (using rem for scalability)
       * xs: 1.75rem (28px), sm: 2rem (32px), md: 2.5rem (40px), lg: 3rem (48px), xl: 3.5rem (56px)
       */
      size: {
        xs: "size-[1.75rem] [&_svg]:size-4",
        sm: "size-[2rem] [&_svg]:size-4",
        md: "size-[2.5rem] [&_svg]:size-5",
        lg: "size-[3rem] [&_svg]:size-6",
        xl: "size-[3.5rem] [&_svg]:size-7",
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
      // Standard - unpressed
      {
        colorStyle: "standard",
        pressed: false,
        className: "bg-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      },
      // Standard - pressed
      {
        colorStyle: "standard",
        pressed: true,
        className: "bg-transparent text-primary hover:bg-primary/10",
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
      colorStyle: "standard",
      size: "md",
      shape: "round",
      pressed: false,
    },
  }
);

export interface ToggleIconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    Omit<VariantProps<typeof toggleIconButtonVariants>, "pressed"> {
  /**
   * Icon to display when not pressed
   */
  icon: React.ReactNode;
  /**
   * Icon to display when pressed (optional, defaults to icon)
   */
  pressedIcon?: React.ReactNode;
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
  /**
   * Accessible label
   */
  "aria-label": string;
}

/**
 * ToggleIconButton - An icon button with toggle state
 *
 * @example
 * ```tsx
 * // Like button
 * <ToggleIconButton
 *   icon={<HeartOutlineIcon />}
 *   pressedIcon={<HeartFilledIcon />}
 *   aria-label="Like"
 * />
 *
 * // Bookmark button
 * <ToggleIconButton
 *   icon={<BookmarkIcon />}
 *   pressed={isBookmarked}
 *   onPressedChange={setIsBookmarked}
 *   aria-label="Bookmark"
 * />
 * ```
 */
const ToggleIconButton = React.forwardRef<HTMLButtonElement, ToggleIconButtonProps>(
  (
    {
      className,
      colorStyle,
      size,
      shape,
      icon,
      pressedIcon,
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      onClick,
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
        data-slot="toggle-icon-button"
        data-state={pressed ? "on" : "off"}
        aria-pressed={pressed}
        className={cn(
          toggleIconButtonVariants({ colorStyle, size, shape, pressed }),
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {pressed && pressedIcon ? pressedIcon : icon}
      </button>
    );
  }
);
ToggleIconButton.displayName = "ToggleIconButton";

export { ToggleIconButton, toggleIconButtonVariants };
