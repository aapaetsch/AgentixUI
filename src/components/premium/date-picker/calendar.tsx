"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../../../lib/utils";

const calendarVariants = cva(["p-3"].join(" "), {
  variants: {
    size: {
      compact: "",
      default: "",
      spacious: "",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const calendarNavButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-[var(--radius)] text-sm font-medium",
    "transition-all duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)]",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-95",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "hover:bg-accent hover:text-accent-foreground",
  ].join(" "),
  {
    variants: {
      size: {
        compact: "h-6 w-6 [&_svg]:size-3",
        default: "h-7 w-7 [&_svg]:size-4",
        spacious: "h-9 w-9 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const calendarDayCellVariants = cva(
  [
    "relative flex items-center justify-center",
    "text-sm font-normal",
    "rounded-full",
    "transition-all duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)]",
    "cursor-pointer select-none",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    "hover:bg-accent hover:text-accent-foreground",
    "active:scale-95",
  ].join(" "),
  {
    variants: {
      size: {
        compact: "h-7 w-7 text-xs",
        default: "h-9 w-9 text-sm",
        spacious: "h-11 w-11 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

type CalendarBaseProps = VariantProps<typeof calendarVariants> & {
  className?: string;
  showOutsideDays?: boolean;
  disabled?: any;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  numberOfMonths?: number;
};

export interface CalendarSingleProps extends CalendarBaseProps {
  mode: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  mode: "range";
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
}

export interface CalendarMultipleProps extends CalendarBaseProps {
  mode: "multiple";
  selected?: Date[];
  onSelect?: (dates: Date[] | undefined) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps | CalendarMultipleProps;

function Calendar(props: CalendarProps) {
  const {
    className,
    size = "default",
    showOutsideDays = true,
    mode,
    selected,
    onSelect,
    disabled,
    month,
    onMonthChange,
    numberOfMonths,
  } = props;

  const getCellSize = () => {
    switch (size) {
      case "compact": return "h-7 w-7";
      case "spacious": return "h-11 w-11";
      default: return "h-9 w-9";
    }
  };

  const getHeadCellSize = () => {
    switch (size) {
      case "compact": return "w-7";
      case "spacious": return "w-11";
      default: return "w-9";
    }
  };

  const classNames = {
    months: "flex flex-col sm:flex-row gap-4",
    month: "flex flex-col gap-4",
    month_caption: "flex justify-center pt-1 relative items-center w-full",
    caption_label: "text-sm font-medium",
    nav: "flex items-center gap-1",
    button_previous: cn(calendarNavButtonVariants({ size }), "absolute left-1"),
    button_next: cn(calendarNavButtonVariants({ size }), "absolute right-1"),
    month_grid: "w-full border-collapse",
    weekdays: "flex",
    weekday: cn("text-muted-foreground rounded-md font-medium text-xs", getHeadCellSize()),
    week: "flex w-full mt-1",
    day: cn(
      "relative p-0 text-center focus-within:relative focus-within:z-20",
      getCellSize(),
      "[&:has([aria-selected])]:bg-accent",
      "[&:has([aria-selected].day-outside)]:bg-accent/50",
      "[&:has([aria-selected].range-end)]:rounded-r-full",
      "[&:has([aria-selected].range-start)]:rounded-l-full",
      "first:[&:has([aria-selected])]:rounded-l-full",
      "last:[&:has([aria-selected])]:rounded-r-full"
    ),
    day_button: cn(calendarDayCellVariants({ size })),
    range_start: "range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
    range_end: "range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
    selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
    today: "bg-accent text-accent-foreground font-semibold",
    outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
    disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
    range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
    hidden: "invisible",
  };

  const components = {
    Chevron: ({ orientation }: { orientation?: string }) =>
      orientation === "left" ? <ChevronLeft /> : <ChevronRight />,
  };

  const handleSelect = React.useCallback(
    (value: any) => {
      if (onSelect) {
        onSelect(value);
      }
    },
    [onSelect]
  );

  const dayPickerProps: any = {
    mode,
    selected,
    onSelect: handleSelect,
    disabled,
    month,
    onMonthChange,
    numberOfMonths,
    showOutsideDays,
    className: cn(calendarVariants({ size }), className),
    classNames,
    components,
  };

  return <DayPicker {...dayPickerProps} />;
}
Calendar.displayName = "Calendar";

export {
  Calendar,
  calendarVariants,
  calendarNavButtonVariants,
  calendarDayCellVariants,
};
export type { DateRange };
