"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../button";
import {
  getYear,
  getMonth,
  setMonth,
  setYear,
  startOfYear,
  addYears,
  subYears,
} from "../../lib/date-utils";

// ============================================================================
// Year Selector Variants
// ============================================================================

/**
 * Year selector container variants
 */
const yearSelectorVariants = cva(["flex flex-col gap-3 p-3"].join(" "), {
  variants: {
    size: {
      compact: "min-w-[260px]",
      default: "min-w-[280px]",
      spacious: "min-w-[320px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/**
 * Month/Year button variants
 */
const yearSelectorButtonVariants = cva(
  [
    "flex items-center justify-center",
    "rounded-[var(--radius)]",
    "text-sm font-medium",
    "transition-all duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)]",
    "cursor-pointer select-none",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    "hover:bg-accent hover:text-accent-foreground",
    "active:scale-95",
  ].join(" "),
  {
    variants: {
      size: {
        compact: "h-8 px-2 text-xs",
        default: "h-9 px-3 text-sm",
        spacious: "h-11 px-4 text-base",
      },
      selected: {
        true: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        false: "",
      },
      current: {
        true: "font-semibold",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      selected: false,
      current: false,
    },
  }
);

// ============================================================================
// Component Types
// ============================================================================

export type YearSelectorView = "months" | "years" | "decades";

export interface YearSelectorProps extends VariantProps<typeof yearSelectorVariants> {
  /**
   * The currently selected date
   */
  selected?: Date;
  /**
   * Callback when a month/year is selected
   */
  onSelect?: (date: Date) => void;
  /**
   * The currently displayed date (for navigation)
   */
  displayMonth?: Date;
  /**
   * Callback when the display month changes
   */
  onDisplayMonthChange?: (date: Date) => void;
  /**
   * Initial view mode
   * @default "months"
   */
  defaultView?: YearSelectorView;
  /**
   * Controlled view mode
   */
  view?: YearSelectorView;
  /**
   * Callback when view changes
   */
  onViewChange?: (view: YearSelectorView) => void;
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  /**
   * Additional class name
   */
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ============================================================================
// Components
// ============================================================================

/**
 * YearSelector - A year and month selection component
 *
 * Provides a grid-based interface for selecting months within a year,
 * or navigating between years and decades.
 *
 * @example
 * ```tsx
 * const [date, setDate] = useState(new Date());
 *
 * <YearSelector
 *   selected={date}
 *   onSelect={setDate}
 *   defaultView="months"
 * />
 * ```
 */
function YearSelector({
  className,
  size = "default",
  selected,
  onSelect,
  displayMonth,
  onDisplayMonthChange,
  defaultView = "months",
  view: controlledView,
  onViewChange,
  minDate,
  maxDate,
}: YearSelectorProps) {
  // Internal state
  const [internalView, setInternalView] =
    React.useState<YearSelectorView>(defaultView);
  const [internalDisplayDate, setInternalDisplayDate] = React.useState(
    displayMonth ?? selected ?? new Date()
  );

  // Use controlled or uncontrolled values
  const view = controlledView ?? internalView;
  const currentDisplayDate = displayMonth ?? internalDisplayDate;
  const currentYear = getYear(currentDisplayDate);
  const today = new Date();
  const todayYear = getYear(today);
  const todayMonth = getMonth(today);

  // Calculate decade range
  const decadeStart = Math.floor(currentYear / 10) * 10;
  const decadeEnd = decadeStart + 9;

  // Update view
  const handleViewChange = (newView: YearSelectorView) => {
    if (controlledView === undefined) {
      setInternalView(newView);
    }
    onViewChange?.(newView);
  };

  // Update display date
  const handleDisplayDateChange = (date: Date) => {
    if (displayMonth === undefined) {
      setInternalDisplayDate(date);
    }
    onDisplayMonthChange?.(date);
  };

  // Navigate years/decades
  const navigatePrevious = () => {
    if (view === "months") {
      handleDisplayDateChange(subYears(currentDisplayDate, 1));
    } else if (view === "years") {
      handleDisplayDateChange(subYears(currentDisplayDate, 10));
    } else {
      handleDisplayDateChange(subYears(currentDisplayDate, 100));
    }
  };

  const navigateNext = () => {
    if (view === "months") {
      handleDisplayDateChange(addYears(currentDisplayDate, 1));
    } else if (view === "years") {
      handleDisplayDateChange(addYears(currentDisplayDate, 10));
    } else {
      handleDisplayDateChange(addYears(currentDisplayDate, 100));
    }
  };

  // Select month
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(currentDisplayDate, monthIndex);
    onSelect?.(newDate);
  };

  // Select year
  const handleYearSelect = (year: number) => {
    const newDate = setYear(currentDisplayDate, year);
    handleDisplayDateChange(newDate);
    handleViewChange("months");
  };

  // Check if a month is disabled
  const isMonthDisabled = (monthIndex: number) => {
    const monthDate = setMonth(setYear(new Date(), currentYear), monthIndex);
    if (minDate && monthDate < startOfYear(minDate) && currentYear <= getYear(minDate)) {
      return monthIndex < getMonth(minDate);
    }
    if (maxDate && currentYear >= getYear(maxDate)) {
      return monthIndex > getMonth(maxDate);
    }
    return false;
  };

  // Check if a year is disabled
  const isYearDisabled = (year: number) => {
    if (minDate && year < getYear(minDate)) return true;
    if (maxDate && year > getYear(maxDate)) return true;
    return false;
  };

  // Render header
  const renderHeader = () => {
    let headerText = "";
    if (view === "months") {
      headerText = currentYear.toString();
    } else if (view === "years") {
      headerText = `${decadeStart} – ${decadeEnd}`;
    } else {
      const centuryStart = Math.floor(currentYear / 100) * 100;
      headerText = `${centuryStart} – ${centuryStart + 99}`;
    }

    return (
      <div className="flex items-center justify-between">
        <Button
          colorStyle="ghost"
          size="sm"
          iconOnly
          onClick={navigatePrevious}
          aria-label="Previous"
        >
          <ChevronLeft />
        </Button>

        <button
          type="button"
          className={cn(
            "text-sm font-medium px-2 py-1 rounded-[var(--radius)]",
            "hover:bg-accent transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}
          onClick={() => {
            if (view === "months") handleViewChange("years");
            else if (view === "years") handleViewChange("decades");
          }}
          disabled={view === "decades"}
        >
          {headerText}
        </button>

        <Button
          colorStyle="ghost"
          size="sm"
          iconOnly
          onClick={navigateNext}
          aria-label="Next"
        >
          <ChevronRight />
        </Button>
      </div>
    );
  };

  // Render months grid
  const renderMonthsGrid = () => (
    <div className="grid grid-cols-3 gap-2">
      {MONTHS.map((month, index) => {
        const isSelected =
          selected &&
          getYear(selected) === currentYear &&
          getMonth(selected) === index;
        const isCurrent = todayYear === currentYear && todayMonth === index;
        const disabled = isMonthDisabled(index);

        return (
          <button
            key={month}
            type="button"
            disabled={disabled}
            className={cn(
              yearSelectorButtonVariants({
                size,
                selected: isSelected,
                current: isCurrent && !isSelected,
              }),
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => handleMonthSelect(index)}
          >
            {month}
          </button>
        );
      })}
    </div>
  );

  // Render years grid
  const renderYearsGrid = () => {
    const years = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);

    return (
      <div className="grid grid-cols-3 gap-2">
        {years.map((year) => {
          const isSelected = selected && getYear(selected) === year;
          const isCurrent = todayYear === year;
          const isOutOfRange = year < decadeStart || year > decadeEnd;
          const disabled = isYearDisabled(year);

          return (
            <button
              key={year}
              type="button"
              disabled={disabled}
              className={cn(
                yearSelectorButtonVariants({
                  size,
                  selected: isSelected,
                  current: isCurrent && !isSelected,
                }),
                isOutOfRange && "text-muted-foreground opacity-50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleYearSelect(year)}
            >
              {year}
            </button>
          );
        })}
      </div>
    );
  };

  // Render decades grid
  const renderDecadesGrid = () => {
    const centuryStart = Math.floor(currentYear / 100) * 100;
    const decades = Array.from({ length: 12 }, (_, i) => centuryStart - 10 + i * 10);

    return (
      <div className="grid grid-cols-3 gap-2">
        {decades.map((decade) => {
          const isCurrentDecade =
            todayYear >= decade && todayYear < decade + 10;
          const isOutOfRange = decade < centuryStart || decade >= centuryStart + 100;

          return (
            <button
              key={decade}
              type="button"
              className={cn(
                yearSelectorButtonVariants({
                  size,
                  current: isCurrentDecade,
                }),
                isOutOfRange && "text-muted-foreground opacity-50"
              )}
              onClick={() => {
                handleDisplayDateChange(setYear(currentDisplayDate, decade));
                handleViewChange("years");
              }}
            >
              {decade}s
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn(yearSelectorVariants({ size }), className)}>
      {renderHeader()}
      <div className="mt-2">
        {view === "months" && renderMonthsGrid()}
        {view === "years" && renderYearsGrid()}
        {view === "decades" && renderDecadesGrid()}
      </div>
    </div>
  );
}
YearSelector.displayName = "YearSelector";

// ============================================================================
// Exports
// ============================================================================

export {
  YearSelector,
  yearSelectorVariants,
  yearSelectorButtonVariants,
  MONTHS,
  MONTHS_FULL,
};
