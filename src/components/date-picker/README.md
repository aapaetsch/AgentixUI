# DatePicker

A versatile date selection component with calendar popover, supporting single date, date range, and multiple date selection modes.

## Installation

The DatePicker is part of the `@aidan/ui` package. Ensure you have the required dependencies:

```bash
npm install date-fns react-day-picker
```

## Usage

### Single Date Selection

```tsx
import { DatePicker } from "@aidan/ui";
import { useState } from "react";

function MyComponent() {
  const [date, setDate] = useState<Date>();

  return (
    <DatePicker
      mode="single"
      selected={date}
      onSelect={setDate}
      label="Select Date"
      placeholder="Pick a date"
    />
  );
}
```

### Date Range Selection

```tsx
import { DatePicker, DateRange } from "@aidan/ui";
import { useState } from "react";

function DateRangeExample() {
  const [range, setRange] = useState<DateRange>();

  return (
    <DatePicker
      mode="range"
      selectedRange={range}
      onSelectRange={setRange}
      label="Date Range"
      placeholder="Select date range"
    />
  );
}
```

### Multiple Date Selection

```tsx
import { DatePicker } from "@aidan/ui";
import { useState } from "react";

function MultiSelectExample() {
  const [dates, setDates] = useState<Date[]>([]);

  return (
    <DatePicker
      mode="multiple"
      selectedDates={dates}
      onSelectMultiple={setDates}
      label="Select Multiple Dates"
      placeholder="Pick dates"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"single" \| "range" \| "multiple"` | `"single"` | Selection mode |
| `selected` | `Date` | - | Selected date (single mode) |
| `selectedRange` | `DateRange` | - | Selected range (range mode) |
| `selectedDates` | `Date[]` | - | Selected dates (multiple mode) |
| `onSelect` | `(date: Date \| undefined) => void` | - | Callback for single selection |
| `onSelectRange` | `(range: DateRange \| undefined) => void` | - | Callback for range selection |
| `onSelectMultiple` | `(dates: Date[] \| undefined) => void` | - | Callback for multiple selection |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `disabledDates` | `Date[]` | - | Specific dates to disable |
| `disabledDaysOfWeek` | `number[]` | - | Days of week to disable (0=Sun, 6=Sat) |
| `presets` | `DatePreset[]` | - | Quick selection presets |
| `showDefaultPresets` | `boolean` | `false` | Show built-in preset options |
| `placeholder` | `string` | `"Select date"` | Trigger placeholder text |
| `format` | `string` | `"PPP"` | Date format string (date-fns) |
| `label` | `string` | - | Label text |
| `disabled` | `boolean` | `false` | Disable the picker |
| `required` | `boolean` | `false` | Mark as required |
| `error` | `boolean` | `false` | Show error state |
| `errorMessage` | `string` | - | Error message to display |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `className` | `string` | - | Additional CSS classes |

## Features

### Date Constraints

Restrict selectable dates with min/max bounds or disable specific dates:

```tsx
<DatePicker
  minDate={new Date(2024, 0, 1)}
  maxDate={new Date(2024, 11, 31)}
  disabledDates={[new Date(2024, 6, 4)]} // Disable July 4th
  disabledDaysOfWeek={[0, 6]} // Disable weekends
/>
```

### Presets

Add quick selection buttons with built-in or custom presets:

```tsx
import { DatePicker, getDatePresets } from "@aidan/ui";

// Use built-in presets
<DatePicker showDefaultPresets />

// Or provide custom presets
<DatePicker
  presets={[
    { label: "Today", value: new Date() },
    { label: "Tomorrow", value: () => addDays(new Date(), 1) },
    { label: "Next Week", value: () => addWeeks(new Date(), 1) },
  ]}
/>
```

### Year/Month Navigation

The calendar includes a year selector that allows users to:
- Click month/year header to open selector
- Navigate through months grid
- Navigate through years grid
- Navigate through decades

### Validation

Handle validation with the `onError` callback:

```tsx
<DatePicker
  required
  minDate={new Date()}
  onError={(error) => {
    console.log(error.type, error.message);
  }}
/>
```

## Size Variants

```tsx
<DatePicker size="sm" /> // Small - 28px trigger
<DatePicker size="md" /> // Medium (default) - 32px trigger
<DatePicker size="lg" /> // Large - 36px trigger
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Arrow Keys` | Navigate between days |
| `Page Up/Down` | Previous/next month |
| `Ctrl + Page Up/Down` | Previous/next year |
| `Home/End` | First/last day of month |
| `Enter/Space` | Select focused date |
| `Escape` | Close popover |

## Accessibility

- Full ARIA labels on trigger and calendar
- Keyboard navigation support
- Screen reader announcements for date changes
- Focus management within popover
- Visible focus indicators

## Related Components

- [TimePicker](../time-picker/README.md) - Time-only selection
- [DateTimePicker](../date-time-picker/README.md) - Combined date and time
