"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Minus, Plus } from "lucide-react";

import { cn } from "../../lib/utils";

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * Container variants for the input incrementor
 */
const inputIncrementorContainerVariants = cva(
  [
    "inline-flex items-center",
    "rounded-[var(--radius)]",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      /**
       * Visual variant
       * default: Buttons outside with borders
       * embedded: Buttons inside a shared container with border
       * minimal: Borderless buttons with subtle styling
       */
      variant: {
        default: "gap-1",
        embedded: [
          "border border-border",
          "bg-background",
          "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20",
        ].join(" "),
        minimal: "gap-0.5",
      },
      /**
       * Size variants matching Input component
       */
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      /**
       * Error state
       */
      error: {
        true: "",
        false: "",
      },
      /**
       * Disabled state
       */
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    compoundVariants: [
      // Embedded error state
      {
        variant: "embedded",
        error: true,
        className: "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      error: false,
      disabled: false,
    },
  }
);

/**
 * Input field variants
 */
const inputIncrementorInputVariants = cva(
  [
    "flex-1",
    "bg-transparent",
    "text-center",
    "text-foreground",
    "font-medium",
    "tabular-nums",
    // Hide spinner buttons in number input
    "[appearance:textfield]",
    "[&::-webkit-outer-spin-button]:appearance-none",
    "[&::-webkit-inner-spin-button]:appearance-none",
    // Focus
    "outline-none",
    // Disabled
    "disabled:cursor-not-allowed disabled:opacity-50",
    // Transition
    "transition-colors",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border border-border rounded-[var(--radius)]",
          "focus:border-ring focus:ring-2 focus:ring-ring/20",
        ].join(" "),
        embedded: "border-none",
        minimal: [
          "border-b border-border",
          "focus:border-ring",
          "rounded-none",
        ].join(" "),
      },
      size: {
        sm: "h-[1.75rem] min-w-[3rem] px-1 text-sm",
        md: "h-[2rem] min-w-[4rem] px-2 text-sm",
        lg: "h-[2.5rem] min-w-[5rem] px-2 text-base",
      },
      error: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Default error state
      {
        variant: "default",
        error: true,
        className: "border-destructive focus:border-destructive focus:ring-destructive/20",
      },
      // Minimal error state
      {
        variant: "minimal",
        error: true,
        className: "border-destructive focus:border-destructive",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      error: false,
    },
  }
);

/**
 * Button variants for increment/decrement buttons
 */
const inputIncrementorButtonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "shrink-0",
    "select-none",
    "outline-none",
    // Focus
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    // Disabled
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    // Transition
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Active press
    "active:scale-95",
    // SVG sizing
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border border-border",
          "bg-background",
          "text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-accent/80",
          "rounded-[var(--radius)]",
        ].join(" "),
        embedded: [
          "bg-transparent",
          "text-muted-foreground",
          "hover:text-foreground hover:bg-accent/50",
          "active:bg-accent/70",
        ].join(" "),
        minimal: [
          "bg-transparent",
          "text-muted-foreground",
          "hover:text-foreground hover:bg-accent/50",
          "active:bg-accent/70",
          "rounded-full",
        ].join(" "),
      },
      size: {
        sm: "size-[1.75rem] [&_svg]:size-3.5",
        md: "size-[2rem] [&_svg]:size-4",
        lg: "size-[2.5rem] [&_svg]:size-5",
      },
      /**
       * Position for embedded variant styling
       */
      position: {
        left: "",
        right: "",
      },
    },
    compoundVariants: [
      // Embedded left button rounded corners
      {
        variant: "embedded",
        position: "left",
        className: "rounded-l-[calc(var(--radius)-1px)] rounded-r-none",
      },
      // Embedded right button rounded corners
      {
        variant: "embedded",
        position: "right",
        className: "rounded-r-[calc(var(--radius)-1px)] rounded-l-none",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      position: "left",
    },
  }
);

// ============================================================================
// Component Types
// ============================================================================

export interface InputIncrementorProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "value" | "defaultValue"> {
  /**
   * The controlled value of the input
   */
  value?: number;
  /**
   * The default value for uncontrolled mode
   */
  defaultValue?: number;
  /**
   * Callback when the value changes
   */
  onValueChange?: (value: number) => void;
  /**
   * Minimum allowed value
   * @default -Infinity
   */
  min?: number;
  /**
   * Maximum allowed value
   * @default Infinity
   */
  max?: number;
  /**
   * Step value for increment/decrement
   * @default 1
   */
  step?: number;
  /**
   * Visual variant of the component
   * @default "default"
   */
  variant?: "default" | "embedded" | "minimal";
  /**
   * Size of the component
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Error state styling
   * @default false
   */
  error?: boolean;
  /**
   * Label for the input (for accessibility)
   */
  label?: string;
  /**
   * Additional class names for the container
   */
  containerClassName?: string;
  /**
   * Additional class names for the input
   */
  inputClassName?: string;
  /**
   * Additional class names for the buttons
   */
  buttonClassName?: string;
  /**
   * Whether to allow values outside min/max range when typing
   * @default false
   */
  allowOutOfRange?: boolean;
  /**
   * Number of decimal places to display
   * @default 0
   */
  precision?: number;
  /**
   * Format function for displaying the value
   */
  formatValue?: (value: number) => string;
  /**
   * Parse function for converting input string to number
   */
  parseValue?: (value: string) => number;
  /**
   * Custom icon for the decrement button
   * @default <Minus />
   */
  decrementIcon?: React.ReactNode;
  /**
   * Custom icon for the increment button
   * @default <Plus />
   */
  incrementIcon?: React.ReactNode;
  /**
   * Enable click-and-hold to continuously increment/decrement
   * @default false
   */
  enableHold?: boolean;
  /**
   * Enable step acceleration when holding (steps get larger the longer you hold)
   * Requires enableHold to be true
   * @default false
   */
  holdAcceleration?: boolean;
  /**
   * Initial delay before hold starts repeating (in ms)
   * @default 500
   */
  holdDelay?: number;
  /**
   * Interval between increments while holding (in ms)
   * @default 100
   */
  holdInterval?: number;
}

// ============================================================================
// Component
// ============================================================================

/**
 * InputIncrementor - A numeric input with increment/decrement buttons
 *
 * Allows users to adjust numeric values through buttons or keyboard input.
 * Supports controlled and uncontrolled modes with min/max validation.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <InputIncrementor defaultValue={0} />
 *
 * // With min/max constraints
 * <InputIncrementor min={0} max={100} step={5} />
 *
 * // Controlled mode
 * const [value, setValue] = useState(50);
 * <InputIncrementor value={value} onValueChange={setValue} />
 *
 * // Embedded variant
 * <InputIncrementor variant="embedded" />
 *
 * // With decimal precision
 * <InputIncrementor precision={2} step={0.1} />
 * ```
 */
const InputIncrementor = React.forwardRef<HTMLInputElement, InputIncrementorProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onValueChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      variant = "default",
      size = "md",
      error = false,
      disabled = false,
      label,
      containerClassName,
      inputClassName,
      buttonClassName,
      allowOutOfRange = false,
      precision = 0,
      formatValue,
      parseValue,
      decrementIcon,
      incrementIcon,
      enableHold = false,
      holdAcceleration = false,
      holdDelay = 500,
      holdInterval = 100,
      className,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID for accessibility
    const generatedId = React.useId();
    const inputId = id || generatedId;

    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    
    // Determine if controlled
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    // Input display value (allows typing before validation)
    const [inputDisplayValue, setInputDisplayValue] = React.useState<string>(() => 
      formatDisplayValue(currentValue)
    );
    const [isEditing, setIsEditing] = React.useState(false);

    // Hold and acceleration state
    const holdTimerRef = React.useRef<NodeJS.Timeout | null>(null);
    const intervalTimerRef = React.useRef<NodeJS.Timeout | null>(null);
    const holdStartTimeRef = React.useRef<number>(0);
    const accelerationLevelRef = React.useRef<number>(0);

    // Format value for display
    function formatDisplayValue(val: number): string {
      if (formatValue) {
        return formatValue(val);
      }
      return precision > 0 ? val.toFixed(precision) : String(val);
    }

    // Parse string to number
    function parseInputValue(str: string): number {
      if (parseValue) {
        return parseValue(str);
      }
      const parsed = parseFloat(str);
      return isNaN(parsed) ? 0 : parsed;
    }

    // Clamp value to min/max
    const clampValue = React.useCallback(
      (val: number): number => {
        if (allowOutOfRange) return val;
        return Math.min(Math.max(val, min), max);
      },
      [min, max, allowOutOfRange]
    );

    // Round to precision
    const roundToPrecision = React.useCallback(
      (val: number): number => {
        if (precision === 0) return Math.round(val);
        const factor = Math.pow(10, precision);
        return Math.round(val * factor) / factor;
      },
      [precision]
    );

    // Update value
    const updateValue = React.useCallback(
      (newValue: number) => {
        const clampedValue = clampValue(roundToPrecision(newValue));
        
        if (!isControlled) {
          setInternalValue(clampedValue);
        }
        onValueChange?.(clampedValue);
        
        if (!isEditing) {
          setInputDisplayValue(formatDisplayValue(clampedValue));
        }
      },
      [isControlled, onValueChange, clampValue, roundToPrecision, isEditing]
    );

    // Sync display value when controlled value changes
    React.useEffect(() => {
      if (!isEditing) {
        setInputDisplayValue(formatDisplayValue(currentValue));
      }
    }, [currentValue, isEditing]);

    // Clear hold timers
    const clearHoldTimers = React.useCallback(() => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
        intervalTimerRef.current = null;
      }
      holdStartTimeRef.current = 0;
      accelerationLevelRef.current = 0;
    }, []);

    // Cleanup timers on unmount
    React.useEffect(() => {
      return () => {
        clearHoldTimers();
      };
    }, [clearHoldTimers]);

    // Calculate step based on acceleration
    const getAcceleratedStep = React.useCallback(() => {
      if (!holdAcceleration || !enableHold) return step;
      
      const holdDuration = Date.now() - holdStartTimeRef.current;
      
      // Acceleration levels based on hold duration
      if (holdDuration < 1000) return step; // 0-1s: normal step
      if (holdDuration < 2000) return step * 2; // 1-2s: 2x step
      if (holdDuration < 3000) return step * 5; // 2-3s: 5x step
      return step * 10; // 3s+: 10x step
    }, [step, holdAcceleration, enableHold]);

    // Increment handler
    const handleIncrement = React.useCallback(() => {
      if (disabled) return;
      const currentStep = getAcceleratedStep();
      const newValue = currentValue + currentStep;
      if (newValue <= max || allowOutOfRange) {
        updateValue(newValue);
      }
    }, [currentValue, getAcceleratedStep, max, allowOutOfRange, disabled, updateValue]);

    // Decrement handler
    const handleDecrement = React.useCallback(() => {
      if (disabled) return;
      const currentStep = getAcceleratedStep();
      const newValue = currentValue - currentStep;
      if (newValue >= min || allowOutOfRange) {
        updateValue(newValue);
      }
    }, [currentValue, getAcceleratedStep, min, allowOutOfRange, disabled, updateValue]);

    // Input change handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputDisplayValue(e.target.value);
    };

    // Input focus handler
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsEditing(true);
      // Select all text on focus for easy replacement
      e.target.select();
    };

    // Input blur handler - validate and commit value
    const handleBlur = () => {
      setIsEditing(false);
      const parsedValue = parseInputValue(inputDisplayValue);
      updateValue(parsedValue);
    };

    // Keyboard handler
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          handleIncrement();
          break;
        case "ArrowDown":
          e.preventDefault();
          handleDecrement();
          break;
        case "Enter":
          e.preventDefault();
          const parsedValue = parseInputValue(inputDisplayValue);
          updateValue(parsedValue);
          setIsEditing(false);
          break;
        case "Escape":
          e.preventDefault();
          setInputDisplayValue(formatDisplayValue(currentValue));
          setIsEditing(false);
          (e.target as HTMLInputElement).blur();
          break;
      }
    };

    // Hold handlers for increment button
    const handleIncrementMouseDown = React.useCallback(() => {
      if (!enableHold || disabled) return;
      
      holdStartTimeRef.current = Date.now();
      handleIncrement(); // Immediate first increment
      
      // Set up initial delay before continuous increment
      holdTimerRef.current = setTimeout(() => {
        // Set up continuous increment
        intervalTimerRef.current = setInterval(() => {
          handleIncrement();
        }, holdInterval);
      }, holdDelay);
    }, [enableHold, disabled, handleIncrement, holdDelay, holdInterval]);

    // Hold handlers for decrement button
    const handleDecrementMouseDown = React.useCallback(() => {
      if (!enableHold || disabled) return;
      
      holdStartTimeRef.current = Date.now();
      handleDecrement(); // Immediate first decrement
      
      // Set up initial delay before continuous decrement
      holdTimerRef.current = setTimeout(() => {
        // Set up continuous decrement
        intervalTimerRef.current = setInterval(() => {
          handleDecrement();
        }, holdInterval);
      }, holdDelay);
    }, [enableHold, disabled, handleDecrement, holdDelay, holdInterval]);

    // Mouse up handler to stop holding
    const handleMouseUp = React.useCallback(() => {
      clearHoldTimers();
    }, [clearHoldTimers]);

    // Check if at limits
    const isAtMin = currentValue <= min;
    const isAtMax = currentValue >= max;

    return (
      <div
        className={cn(
          inputIncrementorContainerVariants({
            variant,
            size,
            error,
            disabled,
          }),
          containerClassName
        )}
        data-slot="input-incrementor"
      >
        {/* Decrement Button */}
        <button
          type="button"
          aria-label="Decrement"
          aria-controls={inputId}
          tabIndex={-1}
          disabled={disabled || (isAtMin && !allowOutOfRange)}
          className={cn(
            inputIncrementorButtonVariants({
              variant,
              size,
              position: "left",
            }),
            buttonClassName
          )}
          onClick={!enableHold ? handleDecrement : undefined}
          onMouseDown={enableHold ? handleDecrementMouseDown : undefined}
          onMouseUp={enableHold ? handleMouseUp : undefined}
          onMouseLeave={enableHold ? handleMouseUp : undefined}
          onTouchStart={enableHold ? handleDecrementMouseDown : undefined}
          onTouchEnd={enableHold ? handleMouseUp : undefined}
        >
          {decrementIcon || <Minus />}
        </button>

        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-label={label}
          aria-valuenow={currentValue}
          aria-valuemin={min !== -Infinity ? min : undefined}
          aria-valuemax={max !== Infinity ? max : undefined}
          aria-invalid={error ? true : undefined}
          value={inputDisplayValue}
          disabled={disabled}
          className={cn(
            inputIncrementorInputVariants({
              variant,
              size,
              error,
            }),
            inputClassName,
            className
          )}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          {...props}
        />

        {/* Increment Button */}
        <button
          type="button"
          aria-label="Increment"
          aria-controls={inputId}
          tabIndex={-1}
          disabled={disabled || (isAtMax && !allowOutOfRange)}
          className={cn(
            inputIncrementorButtonVariants({
              variant,
              size,
              position: "right",
            }),
            buttonClassName
          )}
          onClick={!enableHold ? handleIncrement : undefined}
          onMouseDown={enableHold ? handleIncrementMouseDown : undefined}
          onMouseUp={enableHold ? handleMouseUp : undefined}
          onMouseLeave={enableHold ? handleMouseUp : undefined}
          onTouchStart={enableHold ? handleIncrementMouseDown : undefined}
          onTouchEnd={enableHold ? handleMouseUp : undefined}
        >
          {incrementIcon || <Plus />}
        </button>
      </div>
    );
  }
);

InputIncrementor.displayName = "InputIncrementor";

// ============================================================================
// Exports
// ============================================================================

export {
  InputIncrementor,
  inputIncrementorContainerVariants,
  inputIncrementorInputVariants,
  inputIncrementorButtonVariants,
};
