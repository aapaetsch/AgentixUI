"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CalendarIcon, X } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../button";
import { Input } from "../input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../popover";
import { Calendar, type CalendarProps } from "./calendar";
import { YearSelector, type YearSelectorView } from "./year-selector";
import { Presets } from "./presets";
import {
  type DatePreset,
  type DateRange,
  type DateValidationError,
  formatDate,
  formatDateRange,
  parseDate,
  validateDate,
  getDatePresets,
  getDateRangePresets,
  DATE_FORMATS,
  isSameDay,
} from "../../lib/date-utils";

// ============================================================================
// DatePicker Variants
// ============================================================================

/**
 * DatePicker trigger variants
 */
const datePickerTriggerVariants = cva(
  [
    "flex items-center justify-between gap-2",
    "w-full whitespace-nowrap rounded-[var(--radius)]",
    "border-2 border-border bg-transparent",
    "text-foreground",
    "select-none cursor-pointer",
    "outline-none focus-visible:border-ring",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-all duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)]",
    "hover:bg-accent hover:border-accent-foreground/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      /**
       * Size variants
       */
      size: {
        sm: "h-[1.75rem] px-3 text-sm [&_svg]:size-4",
        md: "h-[2rem] px-3 text-sm [&_svg]:size-4",
        lg: "h-[2.25rem] px-4 text-base [&_svg]:size-5",
      },
      /**
       * Error state
       */
      error: {
        true: "border-destructive focus-visible:border-destructive",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      error: false,
    },
  }
);

/**
 * DatePicker content variants
 */
const datePickerContentVariants = cva(["flex flex-col gap-3"].join(" "), {
  variants: {
    /**
     * Calendar size mapping
     */
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ============================================================================
// Component Types
// ============================================================================

export type DatePickerMode = "single" | "range" | "multiple";

export interface DatePickerProps extends VariantProps<typeof datePickerTriggerVariants> {
  /**
   * Selection mode
   * @default "single"
   */
  mode?: DatePickerMode;
  /**
   * Selected date (for single mode)
   */
  selected?: Date;
  /**
   * Selected date range (for range mode)
   */
  selectedRange?: DateRange;
  /**
   * Selected dates (for multiple mode)
   */
  selectedDates?: Date[];
  /**
   * Callback when date changes (single mode)
   */
  onSelect?: (date: Date | undefined) => void;
  /**
   * Callback when date range changes (range mode)
   */
  onSelectRange?: (range: DateRange | undefined) => void;
  /**
   * Callback when dates change (multiple mode)
   */
  onSelectMultiple?: (dates: Date[] | undefined) => void;
  /**
   * Placeholder text when no date is selected
   */
  placeholder?: string;
  /**
   * Date format for display
   * @default "MMM d, yyyy"
   */
  format?: string;
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  /**
   * Dates that cannot be selected
   */
  disabledDates?: Date[];
  /**
   * Days of week that cannot be selected (0 = Sunday, 6 = Saturday)
   */
  disabledDaysOfWeek?: number[];
  /**
   * Quick preset options
   */
  presets?: DatePreset[];
  /**
   * Whether to show default presets
   * @default false
   */
  showDefaultPresets?: boolean;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  /**
   * Error message to display
   */
  errorMessage?: string;
  /**
   * Callback when validation error occurs
   */
  onError?: (error: DateValidationError | undefined) => void;
  /**
   * Whether the popover is open (controlled)
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Label for the date picker
   */
  label?: string;
  /**
   * Whether to show the clear button
   * @default true
   */
  showClearButton?: boolean;
  /**
   * Additional class name for the trigger
   */
  className?: string;
  /**
   * Additional class name for the popover content
   */
  contentClassName?: string;
  /**
   * Initial month to display
   */
  defaultMonth?: Date;
  /**
   * Number of months to display
   * @default 1
   */
  numberOfMonths?: number;
  /**
   * Shape variant for calendar day cells
   * @default "round"
   */
  shape?: "default" | "round" | "square";
}

// ============================================================================
// Context
// ============================================================================

interface DatePickerContextValue {
  mode: DatePickerMode;
  size: "sm" | "md" | "lg";
  selected?: Date;
  selectedRange?: DateRange;
  selectedDates?: Date[];
  onSelect?: (date: Date | undefined) => void;
  onSelectRange?: (range: DateRange | undefined) => void;
  onSelectMultiple?: (dates: Date[] | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];
  close: () => void;
}

const DatePickerContext = React.createContext<DatePickerContextValue | null>(null);

function useDatePickerContext() {
  const context = React.useContext(DatePickerContext);
  if (!context) {
    throw new Error("DatePicker compound components must be used within DatePicker");
  }
  return context;
}

// ============================================================================
// Components
// ============================================================================

/**
 * DatePicker - A date selection component with popover calendar
 *
 * Supports single date, date range, and multiple date selection modes.
 * Features include min/max date constraints, disabled dates, quick presets,
 * and full keyboard navigation.
 *
 * @example
 * ```tsx
 * // Single date selection
 * const [date, setDate] = useState<Date>();
 * <DatePicker
 *   selected={date}
 *   onSelect={setDate}
 *   placeholder="Select date"
 * />
 *
 * // Date range selection
 * const [range, setRange] = useState<DateRange>();
 * <DatePicker
 *   mode="range"
 *   selectedRange={range}
 *   onSelectRange={setRange}
 *   showDefaultPresets
 * />
 *
 * // With constraints
 * <DatePicker
 *   selected={date}
 *   onSelect={setDate}
 *   minDate={new Date()}
 *   disabledDaysOfWeek={[0, 6]} // Disable weekends
 * />
 * ```
 */
function DatePicker({
  mode = "single",
  selected,
  selectedRange,
  selectedDates,
  onSelect,
  onSelectRange,
  onSelectMultiple,
  placeholder = "Select date",
  format: formatStr = DATE_FORMATS.date,
  minDate,
  maxDate,
  disabledDates,
  disabledDaysOfWeek,
  presets,
  showDefaultPresets = false,
  required,
  disabled,
  errorMessage,
  onError,
  open: controlledOpen,
  onOpenChange,
  label,
  showClearButton = true,
  className,
  contentClassName,
  size = "md",
  error,
  defaultMonth,
  numberOfMonths = 1,
  shape = "round",
}: DatePickerProps) {
  // Internal open state
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (open: boolean) => {
    if (!isControlled) {
      setInternalOpen(open);
    }
    onOpenChange?.(open);
  };

  const close = () => handleOpenChange(false);

  // Year selector view state
  const [yearSelectorView, setYearSelectorView] =
    React.useState<YearSelectorView | null>(null);
  const [displayMonth, setDisplayMonth] = React.useState(
    defaultMonth ?? selected ?? selectedRange?.from ?? new Date()
  );

  // Get display value
  const getDisplayValue = (): string => {
    if (mode === "single" && selected) {
      return formatDate(selected, formatStr);
    }
    if (mode === "range" && selectedRange?.from) {
      return formatDateRange(selectedRange, formatStr);
    }
    if (mode === "multiple" && selectedDates?.length) {
      if (selectedDates.length === 1) {
        return formatDate(selectedDates[0], formatStr);
      }
      return `${selectedDates.length} dates selected`;
    }
    return "";
  };

  // Handle single date selection
  const handleSingleSelect = (date: Date | undefined) => {
    // Validate
    const validationError = validateDate(date, {
      required,
      minDate,
      maxDate,
      disabledDates,
      disabledDaysOfWeek,
    });

    if (validationError) {
      onError?.(validationError);
      return;
    }

    onError?.(undefined);
    onSelect?.(date);
    close();
  };

  // Handle range selection
  const handleRangeSelect = (range: DateRange | undefined) => {
    onSelectRange?.(range);
    // Close only when range is complete
    if (range?.from && range?.to) {
      close();
    }
  };

  // Handle multiple selection
  const handleMultipleSelect = (dates: Date[] | undefined) => {
    onSelectMultiple?.(dates);
  };

  // Handle preset selection
  const handlePresetSelect = (value: Date | DateRange) => {
    if (value instanceof Date) {
      if (mode === "single") {
        handleSingleSelect(value);
      }
    } else {
      if (mode === "range") {
        handleRangeSelect(value);
      }
    }
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === "single") {
      onSelect?.(undefined);
    } else if (mode === "range") {
      onSelectRange?.(undefined);
    } else {
      onSelectMultiple?.(undefined);
    }
    onError?.(undefined);
  };

  // Get presets
  const displayPresets = React.useMemo(() => {
    if (presets) return presets;
    if (showDefaultPresets) {
      return mode === "range" ? getDateRangePresets() : getDatePresets();
    }
    return [];
  }, [presets, showDefaultPresets, mode]);

  // Get disabled dates matcher for react-day-picker
  const disabledMatcher = React.useMemo(() => {
    const matchers: (Date | { dayOfWeek: number[] } | { before: Date } | { after: Date })[] = [];

    if (minDate) {
      matchers.push({ before: minDate });
    }
    if (maxDate) {
      matchers.push({ after: maxDate });
    }
    if (disabledDates?.length) {
      matchers.push(...disabledDates);
    }
    if (disabledDaysOfWeek?.length) {
      matchers.push({ dayOfWeek: disabledDaysOfWeek });
    }

    return matchers.length > 0 ? matchers : undefined;
  }, [minDate, maxDate, disabledDates, disabledDaysOfWeek]);

  // Map size to calendar size
  const calendarSize =
    size === "sm" ? "compact" : size === "lg" ? "spacious" : "default";

  // Has value
  const hasValue =
    (mode === "single" && selected) ||
    (mode === "range" && selectedRange?.from) ||
    (mode === "multiple" && selectedDates?.length);

  // Error state
  const hasError = !!errorMessage || error;

  const contextValue: DatePickerContextValue = {
    mode,
    size: size ?? "md",
    selected,
    selectedRange,
    selectedDates,
    onSelect: handleSingleSelect,
    onSelectRange: handleRangeSelect,
    onSelectMultiple: handleMultipleSelect,
    minDate,
    maxDate,
    disabledDates,
    disabledDaysOfWeek,
    close,
  };

  return (
    <DatePickerContext.Provider value={contextValue}>
      <div className="inline-flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && (
              <span className="text-destructive ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className={cn(
                datePickerTriggerVariants({ size, error: hasError }),
                className
              )}
              aria-label={label || placeholder}
              aria-invalid={hasError ? "true" : undefined}
            >
              <span
                className={cn(
                  "flex-1 text-left truncate",
                  !hasValue && "text-muted-foreground"
                )}
              >
                {getDisplayValue() || placeholder}
              </span>

              <div className="flex items-center gap-1">
                {showClearButton && hasValue && !disabled && (
                  <span
                    role="button"
                    tabIndex={0}
                    className="rounded-full p-0.5 hover:bg-accent transition-colors"
                    onClick={handleClear}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleClear(e as unknown as React.MouseEvent);
                      }
                    }}
                    aria-label="Clear date"
                  >
                    <X className="size-3.5 opacity-50" />
                  </span>
                )}
                <CalendarIcon className="opacity-50" />
              </div>
            </button>
          </PopoverTrigger>

          <PopoverContent
            className={cn(
              "w-auto p-0",
              datePickerContentVariants({ size }),
              contentClassName
            )}
            align="start"
            sideOffset={4}
          >
            <div className="p-3">
              {/* Presets */}
              {displayPresets.length > 0 && (
                <div className="mb-3 pb-3 border-b border-border">
                  <Presets
                    presets={displayPresets}
                    selected={
                      mode === "single"
                        ? selected
                        : mode === "range"
                        ? selectedRange
                        : undefined
                    }
                    onSelect={handlePresetSelect}
                    size={calendarSize}
                  />
                </div>
              )}

              {/* Year selector or calendar */}
              {yearSelectorView ? (
                <YearSelector
                  size={calendarSize}
                  selected={selected ?? selectedRange?.from}
                  displayMonth={displayMonth}
                  onDisplayMonthChange={setDisplayMonth}
                  view={yearSelectorView}
                  onViewChange={setYearSelectorView}
                  minDate={minDate}
                  maxDate={maxDate}
                  onSelect={(date) => {
                    setDisplayMonth(date);
                    setYearSelectorView(null);
                  }}
                />
              ) : (
                <>
                  {/* Month/Year header button */}
                  <div className="flex justify-center mb-2">
                    <button
                      type="button"
                      className={cn(
                        "text-sm font-medium px-2 py-1 rounded-[var(--radius)]",
                        "hover:bg-accent transition-colors",
                        "focus:outline-none focus:ring-2 focus:ring-ring"
                      )}
                      onClick={() => setYearSelectorView("months")}
                    >
                      {formatDate(displayMonth, DATE_FORMATS.monthYear)}
                    </button>
                  </div>

                  {/* Calendar */}
                  {mode === "single" && (
                    <Calendar
                      {...{
                        mode: "single" as const,
                        selected,
                        onSelect: handleSingleSelect,
                        disabled: disabledMatcher,
                        month: displayMonth,
                        onMonthChange: setDisplayMonth,
                        numberOfMonths,
                        size: calendarSize,
                        shape,
                      } as any}
                    />
                  )}

                  {mode === "range" && (
                    <Calendar
                      {...{
                        mode: "range" as const,
                        selected: selectedRange,
                        onSelect: handleRangeSelect,
                        disabled: disabledMatcher,
                        month: displayMonth,
                        onMonthChange: setDisplayMonth,
                        numberOfMonths,
                        size: calendarSize,
                        shape,
                      } as any}
                    />
                  )}

                  {mode === "multiple" && (
                    <Calendar
                      {...{
                        mode: "multiple" as const,
                        selected: selectedDates,
                        onSelect: handleMultipleSelect,
                        disabled: disabledMatcher,
                        month: displayMonth,
                        onMonthChange: setDisplayMonth,
                        numberOfMonths,
                        size: calendarSize,
                        shape,
                      } as any}
                    />
                  )}
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Error message */}
        {errorMessage && (
          <p className="text-sm text-destructive mt-1">{errorMessage}</p>
        )}
      </div>
    </DatePickerContext.Provider>
  );
}
DatePicker.displayName = "DatePicker";

// ============================================================================
// Exports
// ============================================================================

export {
  DatePicker,
  datePickerTriggerVariants,
  datePickerContentVariants,
  useDatePickerContext,
};

// Re-export sub-components
export { Calendar } from "./calendar";
export { YearSelector } from "./year-selector";
export { Presets } from "./presets";
