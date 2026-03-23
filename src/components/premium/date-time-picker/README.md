# DateTimePicker

A combined date and time selection component that integrates a calendar with time selectors in a unified interface.

## Installation

The DateTimePicker is part of the `@aidan/ui` package. Ensure you have the required dependencies:

```bash
npm install date-fns react-day-picker
```

## Usage

### Basic Usage

```tsx
import { DateTimePicker } from "@aidan/ui";
import { useState } from "react";

function MyComponent() {
  const [dateTime, setDateTime] = useState<Date>();

  return (
    <DateTimePicker
      value={dateTime}
      onChange={setDateTime}
      label="Select Date & Time"
      placeholder="Pick date and time"
    />
  );
}
```

### Tabs Layout (Default)

The tabs layout shows either the calendar or time picker, toggled via tabs:

```tsx
<DateTimePicker
  layout="tabs"
  value={dateTime}
  onChange={setDateTime}
/>
```

### Side-by-Side Layout

Shows calendar and time picker together:

```tsx
<DateTimePicker
  layout="side-by-side"
  value={dateTime}
  onChange={setDateTime}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date` | - | Current datetime value |
| `onChange` | `(value: Date \| undefined) => void` | - | Change handler |
| `layout` | `"tabs" \| "side-by-side"` | `"tabs"` | Layout mode |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `disabledDates` | `Date[]` | - | Specific dates to disable |
| `disabledDaysOfWeek` | `number[]` | - | Days of week to disable |
| `timeFormat` | `"12h" \| "24h"` | `"12h"` | Time display format |
| `minuteStep` | `1 \| 5 \| 10 \| 15 \| 30` | `1` | Minute increment |
| `showSeconds` | `boolean` | `false` | Show seconds selector |
| `minTime` | `TimeValue` | - | Minimum time (applied to all dates) |
| `maxTime` | `TimeValue` | - | Maximum time (applied to all dates) |
| `presets` | `DateTimePreset[]` | - | Quick selection presets |
| `showDefaultPresets` | `boolean` | `false` | Show built-in presets |
| `placeholder` | `string` | `"Select date and time"` | Trigger placeholder |
| `dateFormat` | `string` | `"PPP"` | Date format (date-fns) |
| `timeDisplayFormat` | `string` | - | Time format for display |
| `label` | `string` | - | Label text |
| `disabled` | `boolean` | `false` | Disable the picker |
| `required` | `boolean` | `false` | Mark as required |
| `error` | `boolean` | `false` | Show error state |
| `errorMessage` | `string` | - | Error message to display |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `className` | `string` | - | Additional CSS classes |

## Features

### Date and Time Constraints

Apply constraints to both date and time selection:

```tsx
import { addDays, startOfToday } from "date-fns";

<DateTimePicker
  minDate={startOfToday()}
  maxDate={addDays(startOfToday(), 30)}
  minTime={{ hours: 9, minutes: 0 }}
  maxTime={{ hours: 17, minutes: 0 }}
  disabledDaysOfWeek={[0, 6]} // No weekends
/>
```

### Presets

Add quick selection buttons for common datetime values:

```tsx
import { addDays, addHours, nextMonday, setHours, setMinutes } from "date-fns";

<DateTimePicker
  presets={[
    { label: "Now", value: () => new Date() },
    { 
      label: "Tomorrow 9 AM", 
      value: () => setMinutes(setHours(addDays(new Date(), 1), 9), 0)
    },
    { 
      label: "Next Monday 10 AM", 
      value: () => setMinutes(setHours(nextMonday(new Date()), 10), 0)
    },
  ]}
/>
```

### Time Configuration

Customize time selection behavior:

```tsx
// 24-hour format with 15-minute steps
<DateTimePicker
  timeFormat="24h"
  minuteStep={15}
  value={dateTime}
  onChange={setDateTime}
/>

// Include seconds
<DateTimePicker
  showSeconds
  value={dateTime}
  onChange={setDateTime}
/>
```

## Layout Comparison

### Tabs Layout

Best for:
- Mobile interfaces
- Limited horizontal space
- Step-by-step selection flow

```
┌──────────────────────────┐
│ [Date] [Time]            │
├──────────────────────────┤
│                          │
│    (Active tab content)  │
│                          │
└──────────────────────────┘
```

### Side-by-Side Layout

Best for:
- Desktop interfaces
- Power users who need quick access
- Frequent datetime selection

```
┌────────────────┬─────────┐
│                │  Time   │
│   Calendar     │  Picker │
│                │         │
└────────────────┴─────────┘
```

## Size Variants

```tsx
<DateTimePicker size="sm" /> // Compact
<DateTimePicker size="md" /> // Standard (default)
<DateTimePicker size="lg" /> // Large
```

## Keyboard Navigation

### Date Selection
| Key | Action |
|-----|--------|
| `Arrow Keys` | Navigate days |
| `Page Up/Down` | Previous/next month |
| `Enter/Space` | Select date |

### Time Selection
| Key | Action |
|-----|--------|
| `Tab` | Move between columns |
| `Arrow Up/Down` | Change value |
| `Enter` | Confirm |

### General
| Key | Action |
|-----|--------|
| `Escape` | Close popover |
| `Tab` | Switch between Date/Time tabs |

## Accessibility

- Full ARIA labels on all interactive elements
- Keyboard navigation for both date and time
- Screen reader announcements
- Focus management within popover
- Clear visual indicators

## Examples

### Appointment Scheduling

```tsx
function AppointmentScheduler() {
  const [appointment, setAppointment] = useState<Date>();

  return (
    <DateTimePicker
      label="Appointment Time"
      value={appointment}
      onChange={setAppointment}
      minDate={new Date()}
      minTime={{ hours: 9, minutes: 0 }}
      maxTime={{ hours: 17, minutes: 0 }}
      minuteStep={30}
      timeFormat="12h"
      disabledDaysOfWeek={[0, 6]}
      presets={[
        { label: "Tomorrow Morning", value: () => {
          const d = addDays(new Date(), 1);
          d.setHours(9, 0, 0, 0);
          return d;
        }},
        { label: "Next Available", value: () => {
          // Business logic to find next available slot
          return getNextAvailableSlot();
        }},
      ]}
    />
  );
}
```

### Event Creation

```tsx
function EventForm() {
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();

  return (
    <div className="space-y-4">
      <DateTimePicker
        label="Start"
        value={startTime}
        onChange={(date) => {
          setStartTime(date);
          // Auto-set end to 1 hour later
          if (date && !endTime) {
            setEndTime(addHours(date, 1));
          }
        }}
        layout="side-by-side"
      />
      <DateTimePicker
        label="End"
        value={endTime}
        onChange={setEndTime}
        minDate={startTime}
        layout="side-by-side"
      />
    </div>
  );
}
```

## Related Components

- [DatePicker](../date-picker/README.md) - Date-only selection
- [TimePicker](../time-picker/README.md) - Time-only selection
