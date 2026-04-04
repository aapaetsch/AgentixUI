"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CalendarIcon, Clock, X } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { Calendar } from "../date-picker/calendar";
import { YearSelector, type YearSelectorView } from "../date-picker/year-selector";
import { Presets } from "../date-picker/presets";
import { InlineTimePicker } from "../time-picker";
import {
  type DatePreset,
  type DateRange,
  type DateValidationError,
  type TimeFormat,
  formatDateTime,
  formatDate,
  validateDate,
  getDatePresets,
  DATE_FORMATS,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  combineDateAndTime,
} from "../../lib/date-utils";

// ============================================================================
// DateTimePicker Variants
// ============================================================================

/**
 * DateTimePicker trigger variants
 */
const dateTimePickerTriggerVariants = cva(
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
      size: {
        sm: "h-[1.75rem] px-3 text-sm [&_svg]:size-4",
        md: "h-[2rem] px-3 text-sm [&_svg]:size-4",
        lg: "h-[2.25rem] px-4 text-base [&_svg]:size-5",
      },
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

// ============================================================================
// Component Types
// ============================================================================

export interface DateTimePickerProps extends VariantProps<typeof dateTimePickerTriggerVariants> {
  /**
   * Selected datetime value
   */
  value?: Date;
  /**
   * Callback when datetime changes
   */
  onChange?: (date: Date | undefined) => void;
  /**
   * Placeholder text when no datetime is selected
   */
  placeholder?: string;
  /**
   * Date format for display
   * @default "MMM d, yyyy"
   */
  dateFormat?: string;
  /**
   * Time format (12 or 24 hour)
   * @default "12"
   */
  timeFormat?: TimeFormat;
  /**
   * Step for minutes
   * @default 1
   */
  minuteStep?: number;
  /**
   * Minimum selectable datetime
   */
  minDate?: Date;
  /**
   * Maximum selectable datetime
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
   * Quick preset options (for date selection)
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
   * Label for the datetime picker
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
   * Layout mode for date and time selection
   * - "tabs": Shows date and time in separate tabs
   * - "side-by-side": Shows date and time side by side (desktop)
   * @default "side-by-side"
   */
  layout?: "tabs" | "side-by-side";
  /**
   * Default tab when using tabs layout
   * @default "date"
   */
  defaultTab?: "date" | "time";
  /**
   * Shape variant for calendar day cells
   * @default "round"
   */
  shape?: "default" | "round" | "square";
}

// ============================================================================
// Components
// ============================================================================

/**
 * DateTimePicker - A combined date and time selection component
 *
 * Combines the DatePicker calendar with TimePicker controls for
 * selecting both date and time in a single interface.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [datetime, setDatetime] = useState<Date>();
 * <DateTimePicker
 *   value={datetime}
 *   onChange={setDatetime}
 * />
 *
 * // With 24-hour format
 * <DateTimePicker
 *   value={datetime}
 *   onChange={setDatetime}
 *   timeFormat="24"
 * />
 *
 * // Side-by-side layout
 * <DateTimePicker
 *   value={datetime}
 *   onChange={setDatetime}
 *   layout="side-by-side"
 * />
 * ```
 */
function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  dateFormat = DATE_FORMATS.date,
  timeFormat = "12",
  minuteStep = 1,
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
  layout = "side-by-side",
  defaultTab = "date",
  shape = "round",
}: DateTimePickerProps) {
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

  // Active tab state (for tabs layout)
  const [activeTab, setActiveTab] = React.useState<"date" | "time">(defaultTab);

  // Year selector view state
  const [yearSelectorView, setYearSelectorView] =
    React.useState<YearSelectorView | null>(null);
  const [displayMonth, setDisplayMonth] = React.useState(
    defaultMonth ?? value ?? new Date()
  );

  // Get display value
  const getDisplayValue = (): string => {
    if (!value) return "";
    return formatDateTime(value, timeFormat);
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange?.(undefined);
      return;
    }

    // Preserve existing time or use current time
    const currentHours = value ? getHours(value) : getHours(new Date());
    const currentMinutes = value ? getMinutes(value) : getMinutes(new Date());

    let newValue = setHours(date, currentHours);
    newValue = setMinutes(newValue, currentMinutes);

    // Validate
    const validationError = validateDate(newValue, {
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
    onChange?.(newValue);

    // Switch to time tab after date selection (if using tabs)
    if (layout === "tabs") {
      setActiveTab("time");
    }
  };

  // Handle time change
  const handleTimeChange = (time: Date | undefined) => {
    if (!time) return;

    // Use existing date or today
    const baseDate = value ?? new Date();
    const newValue = combineDateAndTime(baseDate, {
      hours: getHours(time),
      minutes: getMinutes(time),
    });

    onChange?.(newValue);
  };

  // Handle preset selection
  const handlePresetSelect = (presetValue: Date | DateRange) => {
    if (presetValue instanceof Date) {
      handleDateSelect(presetValue);
    }
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(undefined);
    onError?.(undefined);
  };

  // Get presets
  const displayPresets = React.useMemo(() => {
    if (presets) return presets;
    if (showDefaultPresets) return getDatePresets();
    return [];
  }, [presets, showDefaultPresets]);

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
  const hasValue = !!value;

  // Error state
  const hasError = !!errorMessage || error;

  // Render calendar content
  const renderCalendarContent = () => (
    <>
      {yearSelectorView ? (
        <YearSelector
          size={calendarSize}
          selected={value}
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

          <Calendar
            {...{
              mode: "single" as const,
              selected: value,
              onSelect: handleDateSelect,
              disabled: disabledMatcher,
              month: displayMonth,
              onMonthChange: setDisplayMonth,
              size: calendarSize,
              shape,
            } as any}
          />
        </>
      )}
    </>
  );

  // Render time content
  const renderTimeContent = () => (
    <div className="flex flex-col items-center gap-4">
      <InlineTimePicker
        value={value}
        onChange={handleTimeChange}
        timeFormat={timeFormat}
        minuteStep={minuteStep}
        size={size ?? "md"}
        disabled={disabled}
      />

      <div className="flex gap-2">
        <Button
          colorStyle="ghost"
          size="sm"
          onClick={() => {
            const now = new Date();
            if (value) {
              // Keep the date, update the time
              let newValue = setHours(value, getHours(now));
              newValue = setMinutes(newValue, getMinutes(now));
              onChange?.(newValue);
            } else {
              onChange?.(now);
            }
          }}
        >
          Now
        </Button>
      </div>
    </div>
  );

  return (
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
              dateTimePickerTriggerVariants({ size, error: hasError }),
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
                  aria-label="Clear datetime"
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
                  selected={value}
                  onSelect={handlePresetSelect}
                  size={calendarSize}
                />
              </div>
            )}

            {/* Tabs or side-by-side layout */}
            {layout === "tabs" ? (
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "date" | "time")}
              >
                <TabsList className="grid w-full grid-cols-2 mb-3">
                  <TabsTrigger value="date" className="gap-2">
                    <CalendarIcon className="size-4" />
                    Date
                  </TabsTrigger>
                  <TabsTrigger value="time" className="gap-2">
                    <Clock className="size-4" />
                    Time
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="date" className="mt-0">
                  {renderCalendarContent()}
                </TabsContent>

                <TabsContent value="time" className="mt-0">
                  {renderTimeContent()}
                </TabsContent>
              </Tabs>
            ) : (
              // Side-by-side layout
              <div className="flex gap-4">
                <div className="flex-1">{renderCalendarContent()}</div>
                <div className="border-l border-border pl-4">
                  {renderTimeContent()}
                </div>
              </div>
            )}

            {/* Current selection display */}
            {hasValue && (
              <div className="mt-3 pt-3 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{getDisplayValue()}</span>
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Error message */}
      {errorMessage && (
        <p className="text-sm text-destructive mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
DateTimePicker.displayName = "DateTimePicker";

// ============================================================================
// Exports
// ============================================================================

export {
  DateTimePicker,
  dateTimePickerTriggerVariants,
};
