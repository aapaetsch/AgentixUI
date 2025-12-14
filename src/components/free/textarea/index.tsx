"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../../lib/utils";

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * Textarea variants using CVA
 * Implements consistent styling with focus, error, and warning states
 */
const textareaVariants = cva(
  [
    // Base styles
    "flex w-full rounded-[var(--radius)]",
    "border-2 border-border bg-transparent",
    "text-foreground placeholder:text-muted-foreground",
    // Hide native resize handle by default
    "resize-none",
    // Focus styles - only border color change, no ring
    "outline-none",
    "focus-visible:border-ring",
    // Disabled state
    "disabled:cursor-not-allowed disabled:opacity-50",
    // M3 Motion
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Hover
    "hover:border-accent-foreground/20",
  ].join(" "),
  {
    variants: {
      /**
       * Size variants
       * sm: compact, md: default, lg: larger touch targets
       */
      size: {
        sm: "min-h-[4rem] px-2.5 py-1.5 text-sm",
        md: "min-h-[5rem] px-3 py-2 text-sm",
        lg: "min-h-[6rem] px-4 py-2.5 text-base",
      },
      /**
       * Error state - destructive border color
       */
      error: {
        true: [
          "border-2 border-destructive",
          "focus-visible:border-destructive",
        ].join(" "),
        false: "border-2 border-border",
      },
      /**
       * Warning state - warning border color (amber)
       */
      warning: {
        true: [
          "border-2 border-warning",
          "focus-visible:border-warning",
        ].join(" "),
        false: "",
      },
    },
    compoundVariants: [
      // Error takes precedence over warning
      {
        error: true,
        warning: true,
        className: [
          "border-2 border-destructive",
          "focus-visible:border-destructive",
        ].join(" "),
      },
    ],
    defaultVariants: {
      size: "md",
      error: false,
      warning: false,
    },
  }
);

/**
 * Container variants for the textarea with label
 */
const textareaContainerVariants = cva(
  [
    "inline-flex flex-col",
    "w-full",
  ].join(" "),
  {
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
  }
);

// ============================================================================
// useAutoResize Hook
// ============================================================================

/**
 * Hook for auto-resizing textarea based on content
 * @param textareaRef - Ref to the textarea element
 * @param value - Current value of the textarea
 * @param autoResize - Whether auto-resize is enabled
 * @param minRows - Minimum number of rows
 * @param maxRows - Maximum number of rows
 */
function useAutoResize(
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  value: string | number | readonly string[] | undefined,
  autoResize: boolean,
  minRows?: number,
  maxRows?: number
) {
  React.useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoResize) return;

    // Store the original height
    const originalHeight = textarea.style.height;

    // Reset height to auto to get accurate scrollHeight
    textarea.style.height = "auto";

    // Calculate line height for row bounds
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
    const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;

    const verticalPadding = paddingTop + paddingBottom + borderTop + borderBottom;

    // Calculate min and max heights based on rows
    const minHeight = minRows
      ? minRows * lineHeight + verticalPadding
      : undefined;
    const maxHeight = maxRows
      ? maxRows * lineHeight + verticalPadding
      : undefined;

    // Calculate the new height
    let newHeight = textarea.scrollHeight;

    // Apply bounds
    if (minHeight && newHeight < minHeight) {
      newHeight = minHeight;
    }
    if (maxHeight && newHeight > maxHeight) {
      newHeight = maxHeight;
      // Enable scrolling when max height is reached
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.overflowY = "hidden";
    }

    // Set the new height
    textarea.style.height = `${newHeight}px`;

    // Cleanup function to restore original height on unmount
    return () => {
      if (textarea) {
        textarea.style.height = originalHeight;
      }
    };
  }, [textareaRef, value, autoResize, minRows, maxRows]);
}

// ============================================================================
// Component Types
// ============================================================================

export interface TextareaProps
  extends Omit<React.ComponentPropsWithoutRef<"textarea">, "size">,
    VariantProps<typeof textareaVariants> {
  /**
   * The label text to display above the textarea
   */
  label?: string;
  /**
   * The position of the label relative to the textarea
   * @default "top"
   */
  labelPosition?: "top" | "left";
  /**
   * Whether to show a required indicator (*) after the label
   * @default false
   */
  required?: boolean;
  /**
   * Whether the textarea should auto-resize based on content
   * @default false
   */
  autoResize?: boolean;
  /**
   * Minimum number of rows when autoResize is enabled
   */
  minRows?: number;
  /**
   * Maximum number of rows when autoResize is enabled
   */
  maxRows?: number;
  /**
   * Additional class names to apply to the container element
   */
  containerClassName?: string;
}

export interface TextareaWithCounterProps extends TextareaProps {
  /**
   * Maximum character length (required for counter functionality)
   */
  maxLength: number;
  /**
   * Whether to show the character count
   * @default true
   */
  showCount?: boolean;
  /**
   * Position of the character count
   * @default "bottom-right"
   */
  countPosition?: "bottom-left" | "bottom-right";
  /**
   * Character count threshold to trigger warning state
   * When current length >= warningAt, warning border is shown
   */
  warningAt?: number;
}

// ============================================================================
// Components
// ============================================================================

/**
 * Textarea - A styled textarea component with optional label and auto-resize
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Textarea placeholder="Enter your message..." />
 *
 * // With label
 * <Textarea label="Description" placeholder="Enter description..." />
 *
 * // With required indicator
 * <Textarea label="Bio" required placeholder="Tell us about yourself..." />
 *
 * // With auto-resize
 * <Textarea autoResize minRows={3} maxRows={10} />
 *
 * // Error state
 * <Textarea error label="Message" />
 *
 * // Warning state
 * <Textarea warning label="Note" />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      size = "md",
      error = false,
      warning = false,
      label,
      labelPosition = "top",
      required = false,
      autoResize = false,
      minRows,
      maxRows,
      value,
      defaultValue,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    // Internal ref for auto-resize functionality
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    // Track internal value for auto-resize when uncontrolled
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const currentValue = value !== undefined ? value : internalValue;

    // Handle change for uncontrolled component
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    // Apply auto-resize hook
    useAutoResize(textareaRef, currentValue, autoResize, minRows, maxRows);

    // Label text styling based on size
    const labelClasses = cn(
      "font-medium leading-none select-none",
      "text-foreground",
      size === "sm" && "text-sm",
      size === "md" && "text-sm",
      size === "lg" && "text-base",
      disabled && "opacity-50"
    );

    const textareaElement = (
      <textarea
        ref={textareaRef}
        data-slot="textarea"
        className={cn(textareaVariants({ size, error, warning }), className)}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    );

    // If no label, just return the textarea element
    if (!label) {
      return textareaElement;
    }

    // Horizontal layout (label on left)
    if (labelPosition === "left") {
      return (
        <div
          className={cn(
            "inline-flex items-start gap-3 w-full",
            containerClassName
          )}
        >
          <label className={cn(labelClasses, "pt-2 shrink-0")}>
            {label}
            {required && (
              <span className="text-destructive ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {textareaElement}
        </div>
      );
    }

    // Default: Vertical layout (label on top)
    return (
      <div
        className={cn(
          textareaContainerVariants({ size }),
          containerClassName
        )}
      >
        <label className={labelClasses}>
          {label}
          {required && (
            <span className="text-destructive ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {textareaElement}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

/**
 * TextareaWithCounter - A textarea with character count display
 *
 * Provides visual feedback on character count with optional warning and error states.
 * Warning border appears when character count reaches `warningAt` threshold.
 * Error border appears when character count exceeds `maxLength`.
 *
 * @example
 * ```tsx
 * // Basic with counter
 * <TextareaWithCounter maxLength={200} placeholder="Enter message..." />
 *
 * // With warning threshold
 * <TextareaWithCounter
 *   maxLength={200}
 *   warningAt={180}
 *   label="Bio"
 *   placeholder="Tell us about yourself..."
 * />
 *
 * // Counter on left
 * <TextareaWithCounter
 *   maxLength={500}
 *   countPosition="bottom-left"
 * />
 * ```
 */
const TextareaWithCounter = React.forwardRef<
  HTMLTextAreaElement,
  TextareaWithCounterProps
>(
  (
    {
      className,
      containerClassName,
      maxLength,
      showCount = true,
      countPosition = "bottom-right",
      warningAt,
      error: errorProp = false,
      warning: warningProp = false,
      value,
      defaultValue,
      onChange,
      label,
      labelPosition = "top",
      required = false,
      size = "md",
      disabled,
      ...props
    },
    ref
  ) => {
    // Track internal value for character count
    const [internalValue, setInternalValue] = React.useState(
      (defaultValue as string) || ""
    );
    const currentValue = value !== undefined ? String(value) : internalValue;
    const currentLength = currentValue.length;

    // Handle change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    // Determine warning and error states based on character count
    const isOverLimit = currentLength > maxLength;
    const isAtWarning = warningAt !== undefined && currentLength >= warningAt && !isOverLimit;

    // Combine prop states with computed states
    const showError = errorProp || isOverLimit;
    const showWarning = warningProp || isAtWarning;

    // Label text styling based on size
    const labelClasses = cn(
      "font-medium leading-none select-none",
      "text-foreground",
      size === "sm" && "text-sm",
      size === "md" && "text-sm",
      size === "lg" && "text-base",
      disabled && "opacity-50"
    );

    // Counter text styling
    const counterClasses = cn(
      "text-xs text-muted-foreground tabular-nums",
      disabled && "opacity-50"
    );

    const textareaElement = (
      <Textarea
        ref={ref}
        className={className}
        size={size}
        error={showError}
        warning={showWarning}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
    );

    const counterElement = showCount && (
      <div
        className={cn(
          "flex",
          countPosition === "bottom-left" ? "justify-start" : "justify-end"
        )}
      >
        <span className={counterClasses}>
          {currentLength}/{maxLength}
        </span>
      </div>
    );

    // Horizontal layout (label on left)
    if (label && labelPosition === "left") {
      return (
        <div
          className={cn(
            "inline-flex items-start gap-3 w-full",
            containerClassName
          )}
        >
          <label className={cn(labelClasses, "pt-2 shrink-0")}>
            {label}
            {required && (
              <span className="text-destructive ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
          <div className="flex flex-col gap-1 flex-1">
            {textareaElement}
            {counterElement}
          </div>
        </div>
      );
    }

    // With label (vertical layout)
    if (label) {
      return (
        <div
          className={cn(
            textareaContainerVariants({ size }),
            containerClassName
          )}
        >
          <label className={labelClasses}>
            {label}
            {required && (
              <span className="text-destructive ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {textareaElement}
          {counterElement}
        </div>
      );
    }

    // No label - just textarea and counter
    return (
      <div
        className={cn(
          "flex flex-col gap-1 w-full",
          containerClassName
        )}
      >
        {textareaElement}
        {counterElement}
      </div>
    );
  }
);

TextareaWithCounter.displayName = "TextareaWithCounter";

export {
  Textarea,
  TextareaWithCounter,
  textareaVariants,
  textareaContainerVariants,
};
