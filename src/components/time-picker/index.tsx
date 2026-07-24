"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../popover";
import {
  type TimeValue,
  type TimeFormat,
  formatTime,
  getHoursArray,
  getMinutesArray,
  to12HourFormat,
  to24HourFormat,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
} from "../../lib/date-utils";

// ============================================================================
// TimePicker Variants
// ============================================================================

/**
 * TimePicker trigger variants
 */
const timePickerTriggerVariants = cva(
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
        sm: "h-10 px-3 text-sm [&_svg]:size-4",
        md: "h-11 px-3 text-sm [&_svg]:size-4",
        lg: "h-12 px-4 text-base [&_svg]:size-5",
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

/**
 * Time column variants
 */
const timeColumnVariants = cva(
  [
    "flex flex-col items-center",
    "overflow-y-auto overscroll-contain touch-pan-y snap-y snap-mandatory [-webkit-overflow-scrolling:touch]",
    "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
    "px-1", // Padding to prevent active state clipping
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-[160px] w-14", // Increased width to accommodate padding
        md: "h-[200px] w-16",
        lg: "h-[240px] w-18",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * Time item variants
 */
const timeItemVariants = cva(
  [
    "flex items-center justify-center",
    "w-full min-h-11 snap-start rounded-[var(--radius)]",
    "cursor-pointer select-none",
    "transition-all duration-[var(--motion-duration-short)] ease-[var(--motion-easing-standard)]",
    "hover:bg-accent hover:text-accent-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-11 text-sm",
        md: "h-11 text-sm",
        lg: "h-12 text-base",
      },
      selected: {
        true: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      selected: false,
    },
  }
);

// ============================================================================
// Component Types
// ============================================================================

export interface TimePickerProps extends VariantProps<typeof timePickerTriggerVariants> {
  /**
   * Selected time value
   */
  value?: Date;
  /**
   * Callback when time changes
   */
  onChange?: (date: Date | undefined) => void;
  /**
   * Time format (12 or 24 hour)
   * @default "12"
   */
  timeFormat?: TimeFormat;
  /**
   * Step for minutes (e.g., 15 for quarter hours)
   * @default 1
   */
  minuteStep?: number;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Error message to display
   */
  errorMessage?: string;
  /**
   * Label for the time picker
   */
  label?: string;
  /**
   * Whether the popover is open (controlled)
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Additional class name for the trigger
   */
  className?: string;
  /**
   * Additional class name for the popover content
   */
  contentClassName?: string;
  /**
   * Minimum selectable time
   */
  minTime?: Date;
  /**
   * Maximum selectable time
   */
  maxTime?: Date;
}

// ============================================================================
// Components
// ============================================================================

/**
 * TimePicker - A time selection component with scrollable columns
 *
 * Supports 12-hour and 24-hour formats with configurable minute steps.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [time, setTime] = useState<Date>();
 * <TimePicker value={time} onChange={setTime} />
 *
 * // 24-hour format
 * <TimePicker value={time} onChange={setTime} timeFormat="24" />
 *
 * // 15-minute increments
 * <TimePicker value={time} onChange={setTime} minuteStep={15} />
 * ```
 */
function TimePicker({
  value,
  onChange,
  timeFormat = "12",
  minuteStep = 1,
  placeholder = "Select time",
  disabled,
  required,
  errorMessage,
  label,
  open: controlledOpen,
  onOpenChange,
  className,
  contentClassName,
  size = "md",
  error,
  minTime,
  maxTime,
}: TimePickerProps) {
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

  // Refs for scrolling
  const hoursRef = React.useRef<HTMLDivElement>(null);
  const minutesRef = React.useRef<HTMLDivElement>(null);
  const periodRef = React.useRef<HTMLDivElement>(null);

  // Get current time values
  const currentHours = value ? getHours(value) : undefined;
  const currentMinutes = value ? getMinutes(value) : undefined;
  const current12Hour = currentHours !== undefined ? to12HourFormat(currentHours) : undefined;

  // Generate arrays
  const hours = getHoursArray(timeFormat);
  const minutes = getMinutesArray(minuteStep);

  // Check if a time is within bounds
  const isTimeInBounds = (hours: number, mins: number): boolean => {
    if (!minTime && !maxTime) return true;

    const testDate = new Date();
    testDate.setHours(hours, mins, 0, 0);

    if (minTime) {
      const minDate = new Date(minTime);
      if (testDate < minDate) return false;
    }

    if (maxTime) {
      const maxDate = new Date(maxTime);
      if (testDate > maxDate) return false;
    }

    return true;
  };

  // Handle hour selection
  const handleHourSelect = (hour: number) => {
    let newHours = hour;

    // Convert to 24-hour if needed
    if (timeFormat === "12" && current12Hour) {
      newHours = to24HourFormat(hour, current12Hour.period);
    }

    const newDate = value ? new Date(value) : new Date();
    const newValue = setHours(newDate, newHours);

    if (isTimeInBounds(newHours, getMinutes(newValue))) {
      onChange?.(newValue);
    }
  };

  // Handle minute selection
  const handleMinuteSelect = (minute: number) => {
    const newDate = value ? new Date(value) : new Date();
    const hours = getHours(newDate);
    const newValue = setMinutes(newDate, minute);

    if (isTimeInBounds(hours, minute)) {
      onChange?.(newValue);
    }
  };

  // Handle period (AM/PM) selection
  const handlePeriodSelect = (period: "AM" | "PM") => {
    if (current12Hour && currentHours !== undefined) {
      const newHours = to24HourFormat(current12Hour.hours, period);
      const newDate = value ? new Date(value) : new Date();
      const newValue = setHours(newDate, newHours);

      if (isTimeInBounds(newHours, getMinutes(newValue))) {
        onChange?.(newValue);
      }
    }
  };

  // Scroll to selected values on open
  React.useEffect(() => {
    if (isOpen && value) {
      const scrollToSelected = (ref: React.RefObject<HTMLDivElement>, index: number, itemHeight: number) => {
        if (ref.current) {
          const scrollTop = index * itemHeight - ref.current.clientHeight / 2 + itemHeight / 2;
          ref.current.scrollTop = Math.max(0, scrollTop);
        }
      };

      const itemHeight = size === "sm" ? 28 : size === "lg" ? 40 : 32;

      if (hoursRef.current && currentHours !== undefined) {
        const hourIndex = timeFormat === "12"
          ? hours.indexOf(current12Hour?.hours ?? 12)
          : hours.indexOf(currentHours);
        scrollToSelected(hoursRef, hourIndex, itemHeight);
      }

      if (minutesRef.current && currentMinutes !== undefined) {
        const minuteIndex = minutes.indexOf(currentMinutes);
        scrollToSelected(minutesRef, minuteIndex, itemHeight);
      }
    }
  }, [isOpen, value, currentHours, currentMinutes, current12Hour, hours, minutes, size, timeFormat]);

  // Display value
  const displayValue = value ? formatTime(value, timeFormat) : "";

  // Has error
  const hasError = !!errorMessage || error;

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
              timePickerTriggerVariants({ size, error: hasError }),
              className
            )}
            aria-label={label || placeholder}
            aria-invalid={hasError ? "true" : undefined}
          >
            <span
              className={cn(
                "flex-1 text-left",
                !displayValue && "text-muted-foreground"
              )}
            >
              {displayValue || placeholder}
            </span>
            <Clock className="opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "w-auto max-w-[calc(100vw-1rem)] p-0 pb-[env(safe-area-inset-bottom)]",
            contentClassName
          )}
          align="start"
          sideOffset={4}
        >
          <div className="flex gap-0 p-3">
            {/* Hours column */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-muted-foreground mb-2">
                {timeFormat === "12" ? "Hour" : "Hr"}
              </span>
              <div
                ref={hoursRef}
                className={cn(timeColumnVariants({ size }))}
              >
                {hours.map((hour) => {
                  const isSelected =
                    timeFormat === "12"
                      ? current12Hour?.hours === hour
                      : currentHours === hour;

                  return (
                    <button
                      key={hour}
                      type="button"
                      className={cn(timeItemVariants({ size, selected: isSelected }))}
                      onClick={() => handleHourSelect(hour)}
                    >
                      {hour.toString().padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Separator */}
            <div className="flex items-center px-1 text-muted-foreground">
              <span className="text-lg font-bold mt-6">:</span>
            </div>

            {/* Minutes column */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-muted-foreground mb-2">
                Min
              </span>
              <div
                ref={minutesRef}
                className={cn(timeColumnVariants({ size }))}
              >
                {minutes.map((minute) => {
                  const isSelected = currentMinutes === minute;

                  return (
                    <button
                      key={minute}
                      type="button"
                      className={cn(timeItemVariants({ size, selected: isSelected }))}
                      onClick={() => handleMinuteSelect(minute)}
                    >
                      {minute.toString().padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AM/PM column (12-hour only) */}
            {timeFormat === "12" && (
              <div className="flex flex-col items-center ml-2">
                <span className="text-xs font-medium text-muted-foreground mb-2">
                  &nbsp;
                </span>
                <div
                  ref={periodRef}
                  className="flex flex-col gap-1"
                >
                  {(["AM", "PM"] as const).map((period) => {
                    const isSelected = current12Hour?.period === period;

                    return (
                      <button
                        key={period}
                        type="button"
                        className={cn(
                          timeItemVariants({ size, selected: isSelected }),
                          "px-2"
                        )}
                        onClick={() => handlePeriodSelect(period)}
                      >
                        {period}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex justify-between items-center p-2 border-t border-border">
            <Button
              colorStyle="ghost"
              size="sm"
              onClick={() => {
                const now = new Date();
                onChange?.(now);
              }}
            >
              Now
            </Button>
            <Button
              colorStyle="ghost"
              size="sm"
              onClick={() => {
                onChange?.(undefined);
              }}
            >
              Clear
            </Button>
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
TimePicker.displayName = "TimePicker";

// ============================================================================
// Inline Time Picker
// ============================================================================

export interface InlineTimePickerProps extends Omit<TimePickerProps, "open" | "onOpenChange" | "placeholder" | "className" | "contentClassName"> {
  /**
   * Additional class name
   */
  className?: string;
}

/**
 * InlineTimePicker - A time picker without the popover trigger
 *
 * Useful for embedding time selection directly in a form or dialog.
 */
function InlineTimePicker({
  value,
  onChange,
  timeFormat = "12",
  minuteStep = 1,
  disabled,
  size = "md",
  minTime,
  maxTime,
  className,
}: InlineTimePickerProps) {
  // Refs for scrolling
  const hoursRef = React.useRef<HTMLDivElement>(null);
  const minutesRef = React.useRef<HTMLDivElement>(null);

  // Get current time values
  const currentHours = value ? getHours(value) : undefined;
  const currentMinutes = value ? getMinutes(value) : undefined;
  const current12Hour = currentHours !== undefined ? to12HourFormat(currentHours) : undefined;

  // Generate arrays
  const hours = getHoursArray(timeFormat);
  const minutes = getMinutesArray(minuteStep);

  // Check if a time is within bounds
  const isTimeInBounds = (hours: number, mins: number): boolean => {
    if (!minTime && !maxTime) return true;

    const testDate = new Date();
    testDate.setHours(hours, mins, 0, 0);

    if (minTime) {
      const minDate = new Date(minTime);
      if (testDate < minDate) return false;
    }

    if (maxTime) {
      const maxDate = new Date(maxTime);
      if (testDate > maxDate) return false;
    }

    return true;
  };

  // Handle hour selection
  const handleHourSelect = (hour: number) => {
    if (disabled) return;

    let newHours = hour;

    if (timeFormat === "12" && current12Hour) {
      newHours = to24HourFormat(hour, current12Hour.period);
    }

    const newDate = value ? new Date(value) : new Date();
    const newValue = setHours(newDate, newHours);

    if (isTimeInBounds(newHours, getMinutes(newValue))) {
      onChange?.(newValue);
    }
  };

  // Handle minute selection
  const handleMinuteSelect = (minute: number) => {
    if (disabled) return;

    const newDate = value ? new Date(value) : new Date();
    const hours = getHours(newDate);
    const newValue = setMinutes(newDate, minute);

    if (isTimeInBounds(hours, minute)) {
      onChange?.(newValue);
    }
  };

  // Handle period selection
  const handlePeriodSelect = (period: "AM" | "PM") => {
    if (disabled) return;

    if (current12Hour && currentHours !== undefined) {
      const newHours = to24HourFormat(current12Hour.hours, period);
      const newDate = value ? new Date(value) : new Date();
      const newValue = setHours(newDate, newHours);

      if (isTimeInBounds(newHours, getMinutes(newValue))) {
        onChange?.(newValue);
      }
    }
  };

  return (
    <div className={cn("flex gap-0", disabled && "opacity-50 pointer-events-none", className)}>
      {/* Hours column */}
      <div className="flex flex-col items-center">
        <span className="text-xs font-medium text-muted-foreground mb-2">
          {timeFormat === "12" ? "Hour" : "Hr"}
        </span>
        <div
          ref={hoursRef}
          className={cn(timeColumnVariants({ size }))}
        >
          {hours.map((hour) => {
            const isSelected =
              timeFormat === "12"
                ? current12Hour?.hours === hour
                : currentHours === hour;

            return (
              <button
                key={hour}
                type="button"
                disabled={disabled}
                className={cn(timeItemVariants({ size, selected: isSelected }))}
                onClick={() => handleHourSelect(hour)}
              >
                {hour.toString().padStart(2, "0")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Separator */}
      <div className="flex items-center px-1 text-muted-foreground">
        <span className="text-lg font-bold mt-6">:</span>
      </div>

      {/* Minutes column */}
      <div className="flex flex-col items-center">
        <span className="text-xs font-medium text-muted-foreground mb-2">
          Min
        </span>
        <div
          ref={minutesRef}
          className={cn(timeColumnVariants({ size }))}
        >
          {minutes.map((minute) => {
            const isSelected = currentMinutes === minute;

            return (
              <button
                key={minute}
                type="button"
                disabled={disabled}
                className={cn(timeItemVariants({ size, selected: isSelected }))}
                onClick={() => handleMinuteSelect(minute)}
              >
                {minute.toString().padStart(2, "0")}
              </button>
            );
          })}
        </div>
      </div>

      {/* AM/PM column (12-hour only) */}
      {timeFormat === "12" && (
        <div className="flex flex-col items-center ml-2">
          <span className="text-xs font-medium text-muted-foreground mb-2">
            &nbsp;
          </span>
          <div className="flex flex-col gap-1">
            {(["AM", "PM"] as const).map((period) => {
              const isSelected = current12Hour?.period === period;

              return (
                <button
                  key={period}
                  type="button"
                  disabled={disabled}
                  className={cn(
                    timeItemVariants({ size, selected: isSelected }),
                    "px-2"
                  )}
                  onClick={() => handlePeriodSelect(period)}
                >
                  {period}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
InlineTimePicker.displayName = "InlineTimePicker";

// ============================================================================
// Exports
// ============================================================================

export {
  TimePicker,
  InlineTimePicker,
  timePickerTriggerVariants,
  timeColumnVariants,
  timeItemVariants,
};
