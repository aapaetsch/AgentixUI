"use client";

import * as React from "react";
import {
  Combobox as HeadlessCombobox,
  ComboboxInput as HeadlessComboboxInput,
  ComboboxButton as HeadlessComboboxButton,
  ComboboxOptions as HeadlessComboboxOptions,
  ComboboxOption as HeadlessComboboxOption,
  Field,
  Label,
  Description,
  Portal,
} from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "../../lib/utils";
import { AnimatedChevron, type ChevronAnimationPreset } from "../animated-chevron";

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * ComboBox input variants using CVA
 * The input IS the trigger - you type directly in it to filter
 */
const comboboxInputVariants = cva(
  [
    // Base styles
    "flex w-full",
    "rounded-[var(--radius)]",
    "border-2 border-border bg-transparent",
    "text-foreground placeholder:text-muted-foreground",
    // Focus styles - only border color change, no ring
    "outline-none",
    "focus:border-ring",
    // Disabled state
    "disabled:cursor-not-allowed disabled:opacity-50",
    // Invalid state
    "data-[invalid]:border-destructive",
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
       * Size variants - reduced heights compared to MD3
       */
      size: {
        xs: "h-[1.5rem] px-2.5 py-1 text-xs",
        sm: "h-[1.75rem] px-3 py-1.5 text-sm",
        md: "h-[2rem] px-3 py-2 text-sm",
        lg: "h-[2.25rem] px-4 py-2.5 text-base",
        xl: "h-[2.75rem] px-5 py-3 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * ComboBox button variants (chevron toggle button)
 */
const comboboxButtonVariants = cva(
  [
    "absolute inset-y-0 right-0 flex items-center",
    "text-muted-foreground",
    "transition-colors",
    "duration-[var(--motion-duration-short)]",
    "ease-[var(--motion-easing-standard)]",
    "hover:text-foreground",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "pr-2 [&_svg]:size-3.5",
        sm: "pr-2.5 [&_svg]:size-4",
        md: "pr-3 [&_svg]:size-4",
        lg: "pr-3.5 [&_svg]:size-5",
        xl: "pr-4 [&_svg]:size-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * MD3 Outlined container variants for ComboBox
 */
const comboboxOutlinedContainerVariants = cva(
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
        xs: "min-h-[1.75rem]",
        sm: "min-h-[2rem]",
        md: "min-h-[2.5rem]",
        lg: "min-h-[3rem]",
        xl: "min-h-[3.5rem]",
      },
      error: {
        true: "border-destructive",
        false: "border-border",
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
      {
        error: true,
        focused: true,
        className: "border-destructive ring-destructive/20 dark:ring-destructive/40",
      },
    ],
    defaultVariants: {
      size: "md",
      error: false,
      focused: false,
      disabled: false,
    },
  }
);

/**
 * MD3 Floating label variants for ComboBox
 */
const comboboxFloatingLabelVariants = cva(
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
    "px-1",
    "-mx-1",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
        xl: "text-lg",
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
      disabled: {
        true: "opacity-50",
        false: "",
      },
    },
    compoundVariants: [
      {
        focused: true,
        floated: true,
        error: false,
        className: "text-ring",
      },
      {
        error: true,
        floated: true,
        className: "text-destructive",
      },
      {
        focused: true,
        floated: true,
        className: "font-bold scale-[0.85]",
      },
      {
        floated: true,
        className: "translate-y-[-0.859375rem]",
      },
    ],
    defaultVariants: {
      size: "md",
      floated: false,
      focused: false,
      error: false,
      disabled: false,
    },
  }
);

/**
 * ComboBox options/dropdown variants
 */
const comboboxOptionsVariants = cva(
  [
    "z-50 overflow-auto",
    "w-[var(--input-width)]",
    "max-h-60",
    "rounded-[var(--radius)]",
    "border border-border bg-popover text-popover-foreground",
    "shadow-[var(--elevation-2)]",
    "p-1",
    // Empty state
    "empty:invisible",
  ].join(" ")
);

/**
 * ComboBox option item variants
 */
const comboboxOptionVariants = cva(
  [
    "relative flex w-full cursor-pointer select-none items-center gap-2",
    "rounded-[var(--radius-sm)] py-1.5 pl-2 pr-8",
    "text-sm outline-none",
    // Focus/selected styles using Headless UI data attributes
    "data-[focus]:bg-accent data-[focus]:text-accent-foreground",
    "data-[selected]:font-medium",
    // Disabled state
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    // M3 Motion
    "transition-colors duration-[var(--motion-duration-short)] ease-[var(--motion-easing-standard)]",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" ")
);

// ============================================================================
// Component Types
// ============================================================================

export interface ComboBoxOption<T = string> {
  /** Unique value for the option */
  value: T;
  /** Display label for the option */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Optional icon to display */
  icon?: React.ReactNode;
  /** Optional description/secondary text */
  description?: string;
}

export interface ComboBoxProps<T = string>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    VariantProps<typeof comboboxInputVariants> {
  /** Array of options to display */
  options: ComboBoxOption<T>[];
  /** Currently selected value (controlled) */
  value?: T | null;
  /** Default value (uncontrolled) */
  defaultValue?: T | null;
  /** Callback when value changes */
  onChange?: (value: T | null) => void;
  /** Placeholder text when input is empty */
  placeholder?: string;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Whether to show error/invalid state */
  invalid?: boolean;
  /** Whether to allow clearing the selection */
  clearable?: boolean;
  /** Open dropdown immediately on focus */
  immediate?: boolean;
  /** Name for form submission */
  name?: string;
  /** Custom filter function */
  filter?: (option: ComboBoxOption<T>, query: string) => boolean;
  /** Use animated chevron instead of static icon */
  useAnimatedChevron?: boolean;
  /** Animation preset for animated chevron */
  chevronAnimation?: ChevronAnimationPreset;
  /** Additional class for the input */
  inputClassName?: string;
  /** Additional class for the options dropdown */
  optionsClassName?: string;
  /** Enable virtual scrolling for large lists */
  virtual?: boolean;
  /** Callback to check if an option is disabled (for virtual mode) */
  virtualDisabled?: (option: T) => boolean;
}

export interface OutlinedComboBoxProps<T = string>
  extends Omit<ComboBoxProps<T>, "inputClassName"> {
  /** Floating label text */
  label: string;
  /** Whether to show required indicator */
  required?: boolean;
  /** Additional class for the container */
  containerClassName?: string;
}

// ============================================================================
// Main Components
// ============================================================================

/**
 * ComboBox - A searchable select component (Catalyst/Headless UI style)
 *
 * The input IS the trigger - you type directly in it to filter options.
 * When you select an option, its display value shows in the input.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ComboBox
 *   options={[
 *     { value: "apple", label: "Apple" },
 *     { value: "banana", label: "Banana" },
 *   ]}
 *   placeholder="Select fruit..."
 *   onChange={(value) => console.log(value)}
 * />
 *
 * // With icons
 * <ComboBox
 *   options={[
 *     { value: "apple", label: "Apple", icon: <Apple /> },
 *   ]}
 *   placeholder="Search..."
 * />
 * ```
 */
function ComboBoxInner<T = string>(
  {
    className,
    options,
    value,
    defaultValue,
    onChange,
    placeholder = "Select...",
    disabled = false,
    invalid = false,
    clearable = true,
    immediate = false,
    name,
    size = "md",
    filter,
    useAnimatedChevron = false,
    chevronAnimation = "smooth",
    inputClassName,
    optionsClassName,
    virtual = false,
    virtualDisabled,
    ...props
  }: ComboBoxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  // Query state for filtering
  const [query, setQuery] = React.useState("");

  // Default filter function
  const defaultFilter = React.useCallback(
    (option: ComboBoxOption<T>, q: string) => {
      const searchLower = q.toLowerCase();
      return (
        option.label.toLowerCase().includes(searchLower) ||
        (typeof option.value === "string" &&
          option.value.toLowerCase().includes(searchLower)) ||
        (option.description?.toLowerCase().includes(searchLower) ?? false)
      );
    },
    []
  );

  // Filter options based on query
  const filteredOptions = React.useMemo(() => {
    if (!query) return options;
    const filterFn = filter || defaultFilter;
    return options.filter((option) => filterFn(option, query));
  }, [options, query, filter, defaultFilter]);

  // Get display value for selected option
  const displayValue = React.useCallback(
    (val: T | null): string => {
      if (val === null || val === undefined) return "";
      const option = options.find((o) => o.value === val);
      return option?.label ?? String(val);
    },
    [options]
  );

  // Handle clear
  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange?.(null);
      setQuery("");
    },
    [onChange]
  );

  // Get selected option for checking if we should show clear
  const selectedOption = React.useMemo(
    () => (value !== null && value !== undefined ? options.find((o) => o.value === value) : null),
    [options, value]
  );

  // Chevron size mapping
  const chevronSizeMap: Record<string, "xs" | "sm" | "md" | "lg" | "xl"> = {
    xs: "xs",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
  };

  // Build virtual options if enabled
  const virtualConfig = virtual
    ? {
        options: filteredOptions.map((o) => o.value),
        disabled: virtualDisabled
          ? (value: T | null) => (value !== null ? virtualDisabled(value) : false)
          : undefined,
      }
    : undefined;

  return (
    <HeadlessCombobox
      as="div"
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onClose={() => setQuery("")}
      disabled={disabled}
      immediate={immediate}
      name={name}
      virtual={virtualConfig}
      data-slot="combobox"
      className={cn("relative w-full", className)}
      {...props}
    >
      {({ open }) => (
        <>
          {/* Input wrapper for positioning */}
          <div className="relative">
            <HeadlessComboboxInput
              data-invalid={invalid || undefined}
              className={cn(
                comboboxInputVariants({ size }),
                // Add padding for the button/clear icon
                clearable && selectedOption ? "pr-14" : "pr-8",
                inputClassName
              )}
              displayValue={displayValue}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
            />

            {/* Clear button */}
            {clearable && selectedOption && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  "absolute inset-y-0 flex items-center",
                  "text-muted-foreground hover:text-foreground",
                  "transition-colors duration-150",
                  size === "xs" && "right-6",
                  size === "sm" && "right-7",
                  size === "md" && "right-8",
                  size === "lg" && "right-9",
                  size === "xl" && "right-10"
                )}
                aria-label="Clear selection"
              >
                <X className={cn(
                  size === "xs" && "size-3",
                  size === "sm" && "size-3.5",
                  size === "md" && "size-4",
                  size === "lg" && "size-4",
                  size === "xl" && "size-5"
                )} />
              </button>
            )}

            {/* Dropdown toggle button */}
            <HeadlessComboboxButton className={cn(comboboxButtonVariants({ size }))}>
              {useAnimatedChevron ? (
                <AnimatedChevron
                  open={open}
                  size={chevronSizeMap[size || "md"]}
                  animation={chevronAnimation}
                />
              ) : (
                <ChevronDown
                  className={cn(
                    "transition-transform duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)]",
                    open && "rotate-180"
                  )}
                />
              )}
            </HeadlessComboboxButton>
          </div>

          {/* Options dropdown */}
          <Portal>
            <HeadlessComboboxOptions
              transition
              anchor={{ to: "bottom start", gap: 2, padding: 8 }}
              className={cn(
                comboboxOptionsVariants(), 
                "transition duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)] data-[closed]:scale-95 data-[closed]:opacity-0 origin-top",
                optionsClassName
              )}
            >
            {virtual ? (
              // Virtual scrolling mode - render function receives option value
              ({ option: optionValue }: { option: T }) => {
                const option = options.find((o) => o.value === optionValue);
                if (!option) return <></>;

                return (
                  <HeadlessComboboxOption
                    value={option.value}
                    disabled={option.disabled}
                    className={cn(comboboxOptionVariants())}
                  >
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className="truncate">{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {option.description}
                        </span>
                      )}
                    </div>
                    <span className="absolute right-2 flex size-4 items-center justify-center opacity-0 data-[selected]:opacity-100">
                      <Check className="size-4" />
                    </span>
                  </HeadlessComboboxOption>
                );
              }
            ) : (
              // Standard mode - map over filtered options
              filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {query ? `No results for "${query}"` : "No options available"}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <HeadlessComboboxOption
                    key={String(option.value)}
                    value={option.value}
                    disabled={option.disabled}
                    className={cn(comboboxOptionVariants())}
                  >
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className="truncate">{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {option.description}
                        </span>
                      )}
                    </div>
                    <span className="absolute right-2 flex size-4 items-center justify-center opacity-0 data-[selected]:opacity-100">
                      <Check className="size-4" />
                    </span>
                  </HeadlessComboboxOption>
                ))
              )
            )}
          </HeadlessComboboxOptions>
          </Portal>
        </>
      )}
    </HeadlessCombobox>
  );
}

// Forward ref with generic support
const ComboBox = React.forwardRef(ComboBoxInner) as <T = string>(
  props: ComboBoxProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

/**
 * OutlinedComboBox - MD3 styled combobox with floating label
 *
 * Features all ComboBox functionality with MD3 outlined styling
 * and floating label animation.
 *
 * @example
 * ```tsx
 * <OutlinedComboBox
 *   label="Country"
 *   options={countries}
 *   onChange={setCountry}
 * />
 * ```
 */
function OutlinedComboBoxInner<T = string>(
  {
    className,
    containerClassName,
    label,
    required = false,
    options,
    value,
    defaultValue,
    onChange,
    placeholder,
    disabled = false,
    invalid = false,
    size = "md",
    ...props
  }: OutlinedComboBoxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  // Track focus and value state for floating label
  const [isFocused, setIsFocused] = React.useState(false);
  const [query, setQuery] = React.useState("");

  // Get selected option for determining if label should float
  const selectedOption = React.useMemo(
    () => (value !== null && value !== undefined ? options.find((o) => o.value === value) : null),
    [options, value]
  );

  // Determine if label should be floated
  const isFloated = isFocused || !!selectedOption || !!query;

  // Input padding based on size (to make room for floated label)
  const getInputClasses = () => {
    const base = "border-none shadow-none ring-0 focus:ring-0 hover:border-transparent bg-transparent";
    const paddingTop: Record<string, string> = {
      xs: isFloated ? "pt-4" : "pt-1",
      sm: isFloated ? "pt-5" : "pt-1.5",
      md: isFloated ? "pt-5" : "pt-2",
      lg: isFloated ? "pt-6" : "pt-2.5",
      xl: isFloated ? "pt-7" : "pt-3",
    };
    return cn(base, paddingTop[size || "md"]);
  };

  return (
    <div
      className={cn(
        comboboxOutlinedContainerVariants({
          size,
          error: invalid,
          focused: isFocused,
          disabled,
        }),
        containerClassName
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Floating Label */}
      <label
        className={cn(
          comboboxFloatingLabelVariants({
            size,
            floated: isFloated,
            focused: isFocused,
            error: invalid,
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

      {/* ComboBox */}
      <ComboBox
        ref={ref}
        options={options}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={isFloated ? placeholder : ""}
        disabled={disabled}
        invalid={invalid}
        size={size}
        inputClassName={getInputClasses()}
        className={className}
        {...props}
      />
    </div>
  );
}

// Forward ref with generic support
const OutlinedComboBox = React.forwardRef(OutlinedComboBoxInner) as <T = string>(
  props: OutlinedComboBoxProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

// ============================================================================
// Compound Components for Advanced Usage
// ============================================================================

/**
 * ComboBoxLabel - Use with Field component for proper labeling
 */
const ComboBoxLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
  <Label ref={ref} className={cn("text-sm font-medium", className)} {...props} />
));
ComboBoxLabel.displayName = "ComboBoxLabel";

/**
 * ComboBoxDescription - Use with Field component for description text
 */
const ComboBoxDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof Description>
>(({ className, ...props }, ref) => (
  <Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ComboBoxDescription.displayName = "ComboBoxDescription";

/**
 * ComboBoxField - Wrapper for label + combobox association
 */
const ComboBoxField = Field;

// ============================================================================
// Exports
// ============================================================================

export {
  ComboBox,
  OutlinedComboBox,
  ComboBoxLabel,
  ComboBoxDescription,
  ComboBoxField,
  comboboxInputVariants,
  comboboxButtonVariants,
  comboboxOutlinedContainerVariants,
  comboboxFloatingLabelVariants,
  comboboxOptionsVariants,
  comboboxOptionVariants,
};
