import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  DatePicker,
  Calendar,
  YearSelector,
  Presets,
} from "./index";
import {
  type DateRange,
  type DatePreset,
  subDays,
  addDays,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "../../../lib/date-utils";

const meta: Meta<typeof DatePicker> = {
  title: "Premium/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A date selection component with popover calendar. Supports single date, date range, and multiple date selection modes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "range", "multiple"],
      description: "Selection mode",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    format: {
      control: "text",
      description: "Date format pattern (date-fns)",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    label: {
      control: "text",
      description: "Label text",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    required: {
      control: "boolean",
      description: "Required field",
    },
    showDefaultPresets: {
      control: "boolean",
      description: "Show default quick presets",
    },
    showClearButton: {
      control: "boolean",
      description: "Show clear button",
    },
    numberOfMonths: {
      control: "number",
      description: "Number of months to display",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

// ============================================================================
// Basic Stories
// ============================================================================

/**
 * Default single date picker
 */
export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          placeholder="Select a date"
        />
      </div>
    );
  },
};

/**
 * With label
 */
export const WithLabel: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          label="Birth Date"
          placeholder="Select your birth date"
        />
      </div>
    );
  },
};

/**
 * Required field
 */
export const Required: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          label="Event Date"
          required
          placeholder="Select event date"
        />
      </div>
    );
  },
};

// ============================================================================
// Size Variants
// ============================================================================

/**
 * Small size
 */
export const SizeSmall: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          size="sm"
          label="Small"
          placeholder="Select date"
        />
      </div>
    );
  },
};

/**
 * Medium size (default)
 */
export const SizeMedium: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          size="md"
          label="Medium"
          placeholder="Select date"
        />
      </div>
    );
  },
};

/**
 * Large size
 */
export const SizeLarge: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          size="lg"
          label="Large"
          placeholder="Select date"
        />
      </div>
    );
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => {
    const [dates, setDates] = useState<{ sm?: Date; md?: Date; lg?: Date }>({});
    return (
      <div className="flex flex-col gap-4 w-[280px]">
        <DatePicker
          selected={dates.sm}
          onSelect={(d) => setDates((prev) => ({ ...prev, sm: d }))}
          size="sm"
          label="Small"
        />
        <DatePicker
          selected={dates.md}
          onSelect={(d) => setDates((prev) => ({ ...prev, md: d }))}
          size="md"
          label="Medium"
        />
        <DatePicker
          selected={dates.lg}
          onSelect={(d) => setDates((prev) => ({ ...prev, lg: d }))}
          size="lg"
          label="Large"
        />
      </div>
    );
  },
};

// ============================================================================
// Selection Modes
// ============================================================================

/**
 * Date range selection
 */
export const RangeSelection: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>();
    return (
      <div className="w-[320px]">
        <DatePicker
          mode="range"
          selectedRange={range}
          onSelectRange={setRange}
          label="Date Range"
          placeholder="Select date range"
          showDefaultPresets
        />
      </div>
    );
  },
};

/**
 * Multiple date selection
 */
export const MultipleSelection: Story = {
  render: () => {
    const [dates, setDates] = useState<Date[]>();
    return (
      <div className="w-[280px]">
        <DatePicker
          mode="multiple"
          selectedDates={dates}
          onSelectMultiple={setDates}
          label="Select Multiple Dates"
          placeholder="Click dates to select"
        />
      </div>
    );
  },
};

// ============================================================================
// Date Constraints
// ============================================================================

/**
 * With minimum date (today)
 */
export const WithMinDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          minDate={new Date()}
          label="Future Date Only"
          placeholder="Select a future date"
        />
      </div>
    );
  },
};

/**
 * With maximum date
 */
export const WithMaxDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          maxDate={new Date()}
          label="Past Date Only"
          placeholder="Select a past date"
        />
      </div>
    );
  },
};

/**
 * With date range constraint
 */
export const WithDateRangeConstraint: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    const minDate = subDays(new Date(), 7);
    const maxDate = addDays(new Date(), 30);
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          minDate={minDate}
          maxDate={maxDate}
          label="Within 7 days ago to 30 days from now"
          placeholder="Select date"
        />
      </div>
    );
  },
};

/**
 * Disabled weekends
 */
export const DisabledWeekends: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          disabledDaysOfWeek={[0, 6]} // Sunday = 0, Saturday = 6
          label="Weekdays Only"
          placeholder="Select a weekday"
        />
      </div>
    );
  },
};

/**
 * Disabled specific dates
 */
export const DisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    const disabledDates = [
      new Date(),
      addDays(new Date(), 2),
      addDays(new Date(), 5),
    ];
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          disabledDates={disabledDates}
          label="Some dates unavailable"
          placeholder="Select date"
        />
      </div>
    );
  },
};

// ============================================================================
// Presets
// ============================================================================

/**
 * With default presets
 */
export const WithDefaultPresets: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          showDefaultPresets
          label="With Quick Presets"
          placeholder="Select date"
        />
      </div>
    );
  },
};

/**
 * With custom presets
 */
export const WithCustomPresets: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    const customPresets: DatePreset[] = [
      { label: "Today", value: () => new Date() },
      { label: "Start of Week", value: () => startOfWeek(new Date()) },
      { label: "End of Week", value: () => endOfWeek(new Date()) },
      { label: "Next Month", value: () => addMonths(new Date(), 1) },
    ];
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          presets={customPresets}
          label="Custom Presets"
          placeholder="Select date"
        />
      </div>
    );
  },
};

/**
 * Range picker with presets
 */
export const RangeWithPresets: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>();
    return (
      <div className="w-[320px]">
        <DatePicker
          mode="range"
          selectedRange={range}
          onSelectRange={setRange}
          showDefaultPresets
          label="Date Range with Presets"
          placeholder="Select range"
        />
      </div>
    );
  },
};

// ============================================================================
// States
// ============================================================================

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-[280px]">
      <DatePicker
        selected={new Date()}
        disabled
        label="Disabled"
        placeholder="Cannot select"
      />
    </div>
  ),
};

/**
 * Error state
 */
export const WithError: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[280px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          error
          errorMessage="Please select a valid date"
          label="With Error"
          placeholder="Select date"
        />
      </div>
    );
  },
};

// ============================================================================
// Multiple Months
// ============================================================================

/**
 * Two months display
 */
export const TwoMonths: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>();
    return (
      <div className="w-[400px]">
        <DatePicker
          mode="range"
          selectedRange={range}
          onSelectRange={setRange}
          numberOfMonths={2}
          label="Two Month View"
          placeholder="Select date range"
        />
      </div>
    );
  },
};

// ============================================================================
// Standalone Components
// ============================================================================

/**
 * Standalone Calendar
 */
export const StandaloneCalendar: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="border rounded-lg p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
        />
      </div>
    );
  },
};

/**
 * Standalone Year Selector
 */
export const StandaloneYearSelector: Story = {
  render: () => {
    const [date, setDate] = useState<Date>(new Date());
    return (
      <div className="border rounded-lg p-4">
        <YearSelector
          selected={date}
          onSelect={setDate}
        />
      </div>
    );
  },
};

/**
 * Standalone Presets
 */
export const StandalonePresets: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    const presets: DatePreset[] = [
      { label: "Today", value: () => new Date() },
      { label: "Tomorrow", value: () => addDays(new Date(), 1) },
      { label: "Next Week", value: () => addDays(new Date(), 7) },
    ];
    return (
      <div className="border rounded-lg p-4">
        <Presets
          presets={presets}
          selected={date}
          onSelect={(v) => setDate(v as Date)}
        />
        {date && (
          <p className="mt-4 text-sm text-muted-foreground">
            Selected: {date.toDateString()}
          </p>
        )}
      </div>
    );
  },
};

// ============================================================================
// Real-World Examples
// ============================================================================

/**
 * Booking date picker
 */
export const BookingExample: Story = {
  render: () => {
    const [checkIn, setCheckIn] = useState<Date>();
    const [checkOut, setCheckOut] = useState<Date>();

    return (
      <div className="flex gap-4 w-[600px]">
        <div className="flex-1">
          <DatePicker
            selected={checkIn}
            onSelect={(date) => {
              setCheckIn(date);
              // If check-out is before check-in, clear it
              if (date && checkOut && checkOut <= date) {
                setCheckOut(undefined);
              }
            }}
            minDate={new Date()}
            maxDate={checkOut}
            label="Check-in"
            placeholder="Select check-in date"
          />
        </div>
        <div className="flex-1">
          <DatePicker
            selected={checkOut}
            onSelect={setCheckOut}
            minDate={checkIn ? addDays(checkIn, 1) : addDays(new Date(), 1)}
            label="Check-out"
            placeholder="Select check-out date"
          />
        </div>
      </div>
    );
  },
};

/**
 * Event scheduling
 */
export const EventScheduling: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();

    const eventPresets: DatePreset[] = [
      { label: "Today", value: () => new Date() },
      { label: "Tomorrow", value: () => addDays(new Date(), 1) },
      { label: "This Weekend", value: () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
        return addDays(today, daysUntilSaturday);
      }},
      { label: "Next Week", value: () => addDays(new Date(), 7) },
    ];

    return (
      <div className="w-[300px]">
        <DatePicker
          selected={date}
          onSelect={setDate}
          presets={eventPresets}
          minDate={new Date()}
          disabledDaysOfWeek={[0]} // No events on Sundays
          label="Event Date"
          placeholder="When is your event?"
        />
      </div>
    );
  },
};

/**
 * Report date range
 */
export const ReportDateRange: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>();

    const reportPresets: DatePreset[] = [
      {
        label: "Last 7 Days",
        value: () => ({ from: subDays(new Date(), 6), to: new Date() }),
      },
      {
        label: "Last 30 Days",
        value: () => ({ from: subDays(new Date(), 29), to: new Date() }),
      },
      {
        label: "This Month",
        value: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }),
      },
      {
        label: "Last Month",
        value: () => {
          const lastMonth = subDays(startOfMonth(new Date()), 1);
          return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
        },
      },
    ];

    return (
      <div className="w-[350px]">
        <DatePicker
          mode="range"
          selectedRange={range}
          onSelectRange={setRange}
          presets={reportPresets}
          maxDate={new Date()}
          numberOfMonths={2}
          label="Report Period"
          placeholder="Select date range"
        />
      </div>
    );
  },
};
