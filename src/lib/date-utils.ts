/**
 * Date utility functions for date/time picker components
 * Provides timezone-aware helpers using date-fns
 */

import {
  format,
  parse,
  isValid,
  isDate,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  addHours,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  isBefore,
  isAfter,
  isSameDay,
  isSameMonth,
  isSameYear,
  getDaysInMonth,
  getDay,
  getMonth,
  getYear,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  setMonth,
  setYear,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  type Locale,
} from "date-fns";

// ============================================================================
// Types
// ============================================================================

/**
 * Date range type for range selection
 */
export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

/**
 * Time value type
 */
export interface TimeValue {
  hours: number;
  minutes: number;
}

/**
 * Date validation error types
 */
export type DateValidationErrorType =
  | "min"
  | "max"
  | "disabled"
  | "invalid"
  | "required"
  | "custom";

/**
 * Date validation error object
 */
export interface DateValidationError {
  type: DateValidationErrorType;
  message: string;
  value?: Date;
}

/**
 * Date preset configuration
 */
export interface DatePreset {
  /** Display label for the preset */
  label: string;
  /** Value - can be a Date, DateRange, or function returning either */
  value: Date | DateRange | (() => Date | DateRange);
  /** Whether the preset is disabled */
  disabled?: boolean;
}

/**
 * Time format type
 */
export type TimeFormat = "12" | "24";

/**
 * Date format options
 */
export interface DateFormatOptions {
  /** Date format pattern (date-fns format) */
  dateFormat?: string;
  /** Time format (12 or 24 hour) */
  timeFormat?: TimeFormat;
  /** Locale for formatting */
  locale?: Locale;
  /** Timezone (IANA timezone string) */
  timezone?: string;
}

// ============================================================================
// Format Functions
// ============================================================================

/**
 * Default date format patterns
 */
export const DATE_FORMATS = {
  /** Default date format: Jan 1, 2024 */
  date: "MMM d, yyyy",
  /** Short date format: 1/1/2024 */
  dateShort: "M/d/yyyy",
  /** ISO date format: 2024-01-01 */
  dateISO: "yyyy-MM-dd",
  /** Time 12-hour format: 2:30 PM */
  time12: "h:mm a",
  /** Time 24-hour format: 14:30 */
  time24: "HH:mm",
  /** DateTime 12-hour format: Jan 1, 2024 2:30 PM */
  dateTime12: "MMM d, yyyy h:mm a",
  /** DateTime 24-hour format: Jan 1, 2024 14:30 */
  dateTime24: "MMM d, yyyy HH:mm",
  /** Month and year: January 2024 */
  monthYear: "MMMM yyyy",
  /** Short month and year: Jan 2024 */
  monthYearShort: "MMM yyyy",
  /** Year only: 2024 */
  year: "yyyy",
} as const;

/**
 * Format a date with the given pattern
 */
export function formatDate(
  date: Date | undefined | null,
  formatStr: string = DATE_FORMATS.date,
  options?: { locale?: Locale }
): string {
  if (!date || !isValidDate(date)) {
    return "";
  }
  return format(date, formatStr, options);
}

/**
 * Format a time value
 */
export function formatTime(
  date: Date | undefined | null,
  timeFormat: TimeFormat = "12",
  options?: { locale?: Locale }
): string {
  if (!date || !isValidDate(date)) {
    return "";
  }
  const pattern = timeFormat === "12" ? DATE_FORMATS.time12 : DATE_FORMATS.time24;
  return format(date, pattern, options);
}

/**
 * Format a datetime value
 */
export function formatDateTime(
  date: Date | undefined | null,
  timeFormat: TimeFormat = "12",
  options?: { locale?: Locale }
): string {
  if (!date || !isValidDate(date)) {
    return "";
  }
  const pattern =
    timeFormat === "12" ? DATE_FORMATS.dateTime12 : DATE_FORMATS.dateTime24;
  return format(date, pattern, options);
}

/**
 * Format a date range
 */
export function formatDateRange(
  range: DateRange | undefined,
  formatStr: string = DATE_FORMATS.date,
  options?: { locale?: Locale; separator?: string }
): string {
  if (!range?.from) {
    return "";
  }
  const separator = options?.separator ?? " – ";
  const fromStr = formatDate(range.from, formatStr, options);
  if (!range.to) {
    return fromStr;
  }
  const toStr = formatDate(range.to, formatStr, options);
  return `${fromStr}${separator}${toStr}`;
}

// ============================================================================
// Parse Functions
// ============================================================================

/**
 * Parse a date string with the given format
 */
export function parseDate(
  dateString: string,
  formatStr: string = DATE_FORMATS.date,
  referenceDate: Date = new Date()
): Date | undefined {
  if (!dateString) {
    return undefined;
  }
  const parsed = parse(dateString, formatStr, referenceDate);
  return isValidDate(parsed) ? parsed : undefined;
}

/**
 * Parse a time string
 */
export function parseTime(
  timeString: string,
  timeFormat: TimeFormat = "12",
  referenceDate: Date = new Date()
): Date | undefined {
  if (!timeString) {
    return undefined;
  }
  const pattern = timeFormat === "12" ? DATE_FORMATS.time12 : DATE_FORMATS.time24;
  const parsed = parse(timeString, pattern, referenceDate);
  return isValidDate(parsed) ? parsed : undefined;
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Check if a value is a valid Date object
 */
export function isValidDate(date: unknown): date is Date {
  return isDate(date) && isValid(date);
}

/**
 * Check if a date is within a range
 */
export function isDateInRange(
  date: Date,
  minDate?: Date,
  maxDate?: Date
): boolean {
  if (minDate && isBefore(date, startOfDay(minDate))) {
    return false;
  }
  if (maxDate && isAfter(date, endOfDay(maxDate))) {
    return false;
  }
  return true;
}

/**
 * Validate a date against constraints
 */
export function validateDate(
  date: Date | undefined,
  options?: {
    required?: boolean;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
    disabledDaysOfWeek?: number[];
    customValidator?: (date: Date) => string | undefined;
  }
): DateValidationError | undefined {
  const {
    required,
    minDate,
    maxDate,
    disabledDates,
    disabledDaysOfWeek,
    customValidator,
  } = options ?? {};

  // Required check
  if (required && !date) {
    return { type: "required", message: "Date is required" };
  }

  if (!date) {
    return undefined;
  }

  // Invalid date check
  if (!isValidDate(date)) {
    return { type: "invalid", message: "Invalid date", value: date };
  }

  // Min date check
  if (minDate && isBefore(date, startOfDay(minDate))) {
    return {
      type: "min",
      message: `Date must be on or after ${formatDate(minDate)}`,
      value: date,
    };
  }

  // Max date check
  if (maxDate && isAfter(date, endOfDay(maxDate))) {
    return {
      type: "max",
      message: `Date must be on or before ${formatDate(maxDate)}`,
      value: date,
    };
  }

  // Disabled dates check
  if (disabledDates?.some((d) => isSameDay(date, d))) {
    return {
      type: "disabled",
      message: "This date is not available",
      value: date,
    };
  }

  // Disabled days of week check
  if (disabledDaysOfWeek?.includes(getDay(date))) {
    return {
      type: "disabled",
      message: "This day of the week is not available",
      value: date,
    };
  }

  // Custom validation
  if (customValidator) {
    const customError = customValidator(date);
    if (customError) {
      return { type: "custom", message: customError, value: date };
    }
  }

  return undefined;
}

// ============================================================================
// Date Manipulation Functions
// ============================================================================

/**
 * Combine a date with a time value
 */
export function combineDateAndTime(date: Date, time: TimeValue): Date {
  let result = new Date(date);
  result = setHours(result, time.hours);
  result = setMinutes(result, time.minutes);
  return result;
}

/**
 * Extract time value from a date
 */
export function extractTime(date: Date): TimeValue {
  return {
    hours: getHours(date),
    minutes: getMinutes(date),
  };
}

/**
 * Convert 24-hour time to 12-hour format
 */
export function to12HourFormat(hours: number): {
  hours: number;
  period: "AM" | "PM";
} {
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return { hours: hours12, period };
}

/**
 * Convert 12-hour time to 24-hour format
 */
export function to24HourFormat(hours: number, period: "AM" | "PM"): number {
  if (period === "AM") {
    return hours === 12 ? 0 : hours;
  }
  return hours === 12 ? 12 : hours + 12;
}

/**
 * Get an array of hours (0-23 or 1-12)
 */
export function getHoursArray(format: TimeFormat = "24"): number[] {
  if (format === "12") {
    return [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  }
  return Array.from({ length: 24 }, (_, i) => i);
}

/**
 * Get an array of minutes (0-59, optionally with step)
 */
export function getMinutesArray(step: number = 1): number[] {
  return Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);
}

// ============================================================================
// Preset Date Calculators
// ============================================================================

/**
 * Get common date presets
 */
export function getDatePresets(): DatePreset[] {
  return [
    { label: "Today", value: () => new Date() },
    { label: "Yesterday", value: () => subDays(new Date(), 1) },
    { label: "Tomorrow", value: () => addDays(new Date(), 1) },
    { label: "In 1 week", value: () => addWeeks(new Date(), 1) },
    { label: "In 1 month", value: () => addMonths(new Date(), 1) },
  ];
}

/**
 * Get common date range presets
 */
export function getDateRangePresets(): DatePreset[] {
  return [
    {
      label: "Today",
      value: () => ({
        from: startOfDay(new Date()),
        to: endOfDay(new Date()),
      }),
    },
    {
      label: "Yesterday",
      value: () => {
        const yesterday = subDays(new Date(), 1);
        return { from: startOfDay(yesterday), to: endOfDay(yesterday) };
      },
    },
    {
      label: "Last 7 days",
      value: () => ({
        from: startOfDay(subDays(new Date(), 6)),
        to: endOfDay(new Date()),
      }),
    },
    {
      label: "Last 30 days",
      value: () => ({
        from: startOfDay(subDays(new Date(), 29)),
        to: endOfDay(new Date()),
      }),
    },
    {
      label: "This week",
      value: () => ({
        from: startOfWeek(new Date()),
        to: endOfWeek(new Date()),
      }),
    },
    {
      label: "Last week",
      value: () => {
        const lastWeek = subWeeks(new Date(), 1);
        return { from: startOfWeek(lastWeek), to: endOfWeek(lastWeek) };
      },
    },
    {
      label: "This month",
      value: () => ({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      }),
    },
    {
      label: "Last month",
      value: () => {
        const lastMonth = subMonths(new Date(), 1);
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
      },
    },
    {
      label: "This year",
      value: () => ({
        from: startOfYear(new Date()),
        to: endOfYear(new Date()),
      }),
    },
  ];
}

/**
 * Evaluate a preset value (handles function values)
 */
export function evaluatePreset(
  preset: DatePreset
): Date | DateRange {
  return typeof preset.value === "function" ? preset.value() : preset.value;
}

// ============================================================================
// Re-exports from date-fns
// ============================================================================

export {
  // Date manipulation
  addDays,
  addWeeks,
  addMonths,
  addYears,
  addHours,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  setHours,
  setMinutes,
  setMonth,
  setYear,
  // Date comparisons
  isBefore,
  isAfter,
  isSameDay,
  isSameMonth,
  isSameYear,
  // Date getters
  getDay,
  getMonth,
  getYear,
  getHours,
  getMinutes,
  getDaysInMonth,
  // Date differences
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  // Core functions
  format,
  parse,
  isValid,
};
