"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../../lib/utils";

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * Input variants using CVA
 * Implements consistent styling with shadcn and MD3 outlined variants
 */
const inputVariants = cva(
  [
    // Base styles
    "flex w-full",
    "bg-transparent",
    "text-foreground placeholder:text-muted-foreground",
    // Disabled state
    "disabled:cursor-not-allowed disabled:opacity-50",
    // M3 Motion
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // File input styling
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
  ].join(" "),
  {
    variants: {
      /**
       * Visual variant
       * shadcn: Standard shadcn styling
       * outlined: MD3 outlined style (used with floating label)
       */
      variant: {
        shadcn: [
          "rounded-[var(--radius)]",
          "border-2 border-border",
          "outline-none",
          "focus-visible:border-ring",
        ].join(" "),
        outlined: [
          // Outlined variant has no border - the wrapper handles it
          "outline-none",
          "border-none",
          "bg-transparent",
        ].join(" "),
      },
      /**
       * Size variants
       * sm: compact, md: default, lg: larger touch targets
       */
      size: {
        sm: "h-[1.75rem] px-2.5 text-sm",
        md: "h-[2rem] px-3 text-sm",
        lg: "h-[2.5rem] px-4 text-base",
      },
      /**
       * Error state - destructive border color
       */
      error: {
        true: "",
        false: "",
      },
      /**
       * Warning state - warning border color (amber)
       */
      warning: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Shadcn error state
      {
        variant: "shadcn",
        error: true,
        className: [
          "border-destructive",
          "focus-visible:border-destructive",
        ].join(" "),
      },
      // Shadcn warning state
      {
        variant: "shadcn",
        warning: true,
        error: false,
        className: [
          "border-warning",
          "focus-visible:border-warning",
        ].join(" "),
      },
    ],
    defaultVariants: {
      variant: "shadcn",
      size: "md",
      error: false,
      warning: false,
    },
  }
);

/**
 * Container variants for the input with label (shadcn variant)
 */
const inputContainerVariants = cva(["inline-flex flex-col", "w-full"].join(" "), {
  variants: {
    size: {
      sm: "gap-1",
      md: "gap-1.5",
      lg: "gap-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/**
 * MD3 Outlined container variants
 * Handles the border and floating label
 */
const outlinedContainerVariants = cva(
  [
    "relative",
    "w-full",
    "rounded-[var(--radius)]",
    "border",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "min-h-[2.5rem]",
        md: "min-h-[3rem]",
        lg: "min-h-[3.5rem]",
      },
      error: {
        true: "border-destructive",
        false: "border-border",
      },
      warning: {
        true: "",
        false: "",
      },
      focused: {
        true: "border-2 border-ring focus:ring-0",
        false: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    compoundVariants: [
      // Error takes precedence
      {
        error: true,
        focused: true,
        className:
          "border-destructive ring-destructive/20 dark:ring-destructive/40",
      },
      // Warning state (only when no error)
      {
        warning: true,
        error: false,
        className: "border-warning",
      },
      {
        warning: true,
        error: false,
        focused: true,
        className: "border-warning ring-warning/20 dark:ring-warning/40",
      },
    ],
    defaultVariants: {
      size: "md",
      error: false,
      warning: false,
      focused: false,
      disabled: false,
    },
  }
);

/**
 * MD3 Floating label variants
 */
const floatingLabelVariants = cva(
  [
    "absolute",
    "left-3",
    "pointer-events-none",
    "select-none",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    "origin-left",
    "text-muted-foreground",
    // Background for label when floated (to cut through border)
    "px-1",
    "-mx-1",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
      },
      floated: {
        true: [
          "top-0",
          "-translate-y-1/2",
          "scale-75",
          "bg-background",
          "text-foreground",
        ].join(" "),
        false: "top-1/2 -translate-y-1/2 scale-100 bg-transparent",
      },
      focused: {
        true: "",
        false: "",
      },
      error: {
        true: "",
        false: "",
      },
      warning: {
        true: "",
        false: "",
      },
      disabled: {
        true: "opacity-50",
        false: "",
      },
    },
    compoundVariants: [
      // Focused label color
      {
        focused: true,
        floated: true,
        error: false,
        warning: false,
        className: "text-ring",
      },
      // Error label color
      {
        error: true,
        floated: true,
        className: "text-destructive",
      },
      // Warning label color
      {
        warning: true,
        error: false,
        floated: true,
        className: "text-warning",
      },
      // Focused and floated label enhancement
      {
        focused: true,
        floated: true,
        className: "font-bold scale-[0.85]", // Bolder and 85% scale when focused
      },
      // Adjust floated label position to be closer to the border (moved 1px lower)
      {
        floated: true,
        className: "translate-y-[-0.859375rem]", // Move label 1px lower (approx)
      },
    ],
    defaultVariants: {
      size: "md",
      floated: false,
      focused: false,
      error: false,
      warning: false,
      disabled: false,
    },
  }
);

// ============================================================================
// Component Types
// ============================================================================

export interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "size">,
    VariantProps<typeof inputVariants> {
  /**
   * The label text to display above or inside the input
   */
  label?: string;
  /**
   * The position of the label relative to the input
   * Only applicable for shadcn variant
   * @default "top"
   */
  labelPosition?: "top" | "left";
  /**
   * Whether to show a required indicator (*) after the label
   * @default false
   */
  required?: boolean;
  /**
   * Additional class names to apply to the container element
   */
  containerClassName?: string;
}

export interface OutlinedInputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "size" | "placeholder">,
    Omit<VariantProps<typeof inputVariants>, "variant"> {
  /**
   * The floating label text
   */
  label: string;
  /**
   * Whether to show a required indicator (*) after the label
   * @default false
   */
  required?: boolean;
  /**
   * Additional class names to apply to the container element
   */
  containerClassName?: string;
}

// ============================================================================
// Components
// ============================================================================

/**
 * Input - A styled input component with shadcn styling
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input placeholder="Enter your email..." />
 *
 * // With label
 * <Input label="Email" placeholder="example@email.com" />
 *
 * // With required indicator
 * <Input label="Username" required placeholder="Enter username" />
 *
 * // Error state
 * <Input error label="Password" type="password" />
 *
 * // Warning state
 * <Input warning label="API Key" />
 *
 * // Different sizes
 * <Input size="sm" placeholder="Small" />
 * <Input size="lg" placeholder="Large" />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      variant = "shadcn",
      size = "md",
      error = false,
      warning = false,
      label,
      labelPosition = "top",
      required = false,
      disabled,
      type = "text",
      ...props
    },
    ref
  ) => {
    // Label text styling based on size
    const labelClasses = cn(
      "font-medium leading-none select-none",
      "text-foreground",
      size === "sm" && "text-sm",
      size === "md" && "text-sm",
      size === "lg" && "text-base",
      disabled && "opacity-50"
    );

    const inputElement = (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(inputVariants({ variant, size, error, warning }), className)}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    );

    // If no label, just return the input element
    if (!label) {
      return inputElement;
    }

    // Horizontal layout (label on left)
    if (labelPosition === "left") {
      return (
        <div
          className={cn(
            "inline-flex items-center gap-3 w-full",
            containerClassName
          )}
        >
          <label className={cn(labelClasses, "shrink-0")}>
            {label}
            {required && (
              <span className="text-destructive ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {inputElement}
        </div>
      );
    }

    // Default: Vertical layout (label on top)
    return (
      <div className={cn(inputContainerVariants({ size }), containerClassName)}>
        <label className={labelClasses}>
          {label}
          {required && (
            <span className="text-destructive ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {inputElement}
      </div>
    );
  }
);

Input.displayName = "Input";

/**
 * OutlinedInput - MD3 styled input with floating label animation
 *
 * The label starts inside the input when empty and unfocused,
 * then animates to become part of the outline border when focused or has value.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <OutlinedInput label="Email" />
 *
 * // With required indicator
 * <OutlinedInput label="Username" required />
 *
 * // Error state
 * <OutlinedInput error label="Password" type="password" />
 *
 * // Warning state
 * <OutlinedInput warning label="API Key" />
 *
 * // Different sizes
 * <OutlinedInput size="sm" label="Small" />
 * <OutlinedInput size="lg" label="Large" />
 * ```
 */
const OutlinedInput = React.forwardRef<HTMLInputElement, OutlinedInputProps>(
  (
    {
      className,
      containerClassName,
      size = "md",
      error = false,
      warning = false,
      label,
      required = false,
      disabled,
      type = "text",
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    // Track focus state
    const [isFocused, setIsFocused] = React.useState(false);

    // Track internal value for uncontrolled component
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const currentValue = value !== undefined ? value : internalValue;

    // Determine if label should be floated
    const isFloated = isFocused || String(currentValue).length > 0;

    // Handle focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    // Handle blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Handle change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    // Input padding based on size
    const inputPadding = cn(
      size === "sm" && "px-3 py-1.5",
      size === "md" && "px-3 py-2",
      size === "lg" && "px-4 py-2.5"
    );

    return (
      <div
        className={cn(
          outlinedContainerVariants({
            size,
            error,
            warning,
            focused: isFocused,
            disabled,
          }),
          containerClassName
        )}
      >
        {/* Floating Label */}
        <label
          className={cn(
            floatingLabelVariants({
              size,
              floated: isFloated,
              focused: isFocused,
              error,
              warning,
              disabled,
            })
          )}
        >
          {label}
          {required && (
            <span className="text-destructive ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {/* Input */}
        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            inputVariants({ variant: "outlined", size, error, warning }),
            inputPadding,
            "w-full h-full",
            // Adjust top padding when label is floated to account for label space
            isFloated && size === "sm" && "pt-3",
            isFloated && size === "md" && "pt-4",
            isFloated && size === "lg" && "pt-5",
            className
          )}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          {...props}
        />
      </div>
    );
  }
);

OutlinedInput.displayName = "OutlinedInput";

export {
  Input,
  OutlinedInput,
  inputVariants,
  inputContainerVariants,
  outlinedContainerVariants,
  floatingLabelVariants,
};
