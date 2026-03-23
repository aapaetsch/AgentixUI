# DateTimePicker Component - AI Agent Context
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Component Overview

**Purpose:** Combined date and time selection component that integrates DatePicker calendar with TimePicker in a unified interface.

**Tier:** Premium

**Dependencies:**
- `react-day-picker` - Calendar grid (via DatePicker)
- `date-fns` - Date/time manipulation
- `@radix-ui/react-popover` - Popover positioning
- `@radix-ui/react-tabs` - Tab navigation (tabs layout)
- `class-variance-authority` - CVA variants
- Internal: DatePicker Calendar, InlineTimePicker

## Component Architecture

### Main Component

**DateTimePicker** (`index.tsx`)
- Combines Calendar and InlineTimePicker
- Two layout modes: tabs or side-by-side
- Returns combined Date object with time

### Layout Modes

```
Tabs Layout (default):
┌──────────────────────────┐
│ [Date] [Time]            │
├──────────────────────────┤
│                          │
│    Calendar Grid         │
│    (or Time Picker)      │
│                          │
└──────────────────────────┘

Side-by-Side Layout:
┌────────────────┬─────────┐
│                │  Time   │
│   Calendar     │  Picker │
│   Grid         │         │
│                │         │
└────────────────┴─────────┘
```

### Props Interface Summary

```typescript
interface DateTimePickerProps {
  // Value
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  
  // Layout
  layout?: "tabs" | "side-by-side";
  
  // Date constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];
  
  // Time options
  timeFormat?: "12h" | "24h";
  minuteStep?: 1 | 5 | 10 | 15 | 30;
  showSeconds?: boolean;
  minTime?: TimeValue;
  maxTime?: TimeValue;
  
  // Presets
  presets?: DateTimePreset[];
  showDefaultPresets?: boolean;
  
  // Display
  placeholder?: string;
  dateFormat?: string;
  timeDisplayFormat?: string;
  label?: string;
  
  // State
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  
  // Size
  size?: "sm" | "md" | "lg";
}
```

## Styling Decisions

### Size Variants

Inherits sizing from DatePicker and TimePicker:

| Size | Trigger Height | Calendar | Time Columns |
|------|---------------|----------|--------------|
| sm   | 1.75rem       | Compact  | 40px wide    |
| md   | 2rem          | Default  | 48px wide    |
| lg   | 2.25rem       | Spacious | 56px wide    |

### Layout Styles

**Tabs Layout:**
- Clean tab interface switching between date and time
- Tab styling matches design system
- Active tab has primary color indicator
- Content area maintains consistent height

**Side-by-Side Layout:**
- Calendar on left, time picker on right
- Vertical divider between sections
- More compact for power users
- Better for frequent datetime selection

### Visual Design

- Unified container with rounded corners
- Consistent padding and spacing
- Tab transitions are smooth (M3 motion)
- Time picker visually integrated, not separate popover

## Date-Time Composition

### Value Handling

The component maintains a single `Date` object that combines:
- Date portion from calendar selection
- Time portion from time picker

```typescript
// When date changes, preserve time
const handleDateChange = (newDate: Date | undefined) => {
  if (newDate && value) {
    // Keep existing time
    newDate.setHours(value.getHours());
    newDate.setMinutes(value.getMinutes());
    newDate.setSeconds(value.getSeconds());
  }
  onChange?.(newDate);
};

// When time changes, preserve date
const handleTimeChange = (newTime: TimeValue | undefined) => {
  if (newTime && value) {
    const updated = new Date(value);
    updated.setHours(newTime.hours);
    updated.setMinutes(newTime.minutes);
    if (newTime.seconds !== undefined) {
      updated.setSeconds(newTime.seconds);
    }
    onChange?.(updated);
  }
};
```

### Default Time

When selecting a date without existing time:
- Default time is set to current time
- Or can be controlled via `defaultTime` prop

## Keyboard Navigation

Inherits from both components:

**Calendar (Date Tab):**
- Arrow keys: Navigate days
- Page Up/Down: Navigate months
- Enter/Space: Select date

**Time Picker (Time Tab):**
- Tab: Move between columns
- Arrow Up/Down: Change values
- Enter: Confirm

**Tab Navigation:**
- Tab/Shift+Tab: Switch between Date and Time tabs

## DateTime Presets

Supports combined date-time presets:

```typescript
interface DateTimePreset {
  label: string;
  value: Date | (() => Date);
}

// Example presets
const presets = [
  { label: "Now", value: () => new Date() },
  { label: "Tomorrow 9 AM", value: () => {
    const d = addDays(new Date(), 1);
    d.setHours(9, 0, 0, 0);
    return d;
  }},
  { label: "Next Monday 10 AM", value: () => {
    const d = nextMonday(new Date());
    d.setHours(10, 0, 0, 0);
    return d;
  }},
];
```

## Integration Points

### With DatePicker Calendar

Uses `Calendar` component from DatePicker:
- Single date selection mode only
- Receives `selected` and `onSelect` props
- Constraints passed through (min/max date)

### With InlineTimePicker

Uses `InlineTimePicker` (not popover version):
- Embedded directly in layout
- Receives time value extracted from Date
- Time constraints passed through

### With Date Utils

```typescript
import { formatDate, formatTime, formatDateTime } from "@/lib/date-utils";

// Display in trigger
const displayValue = value 
  ? formatDateTime(value, dateFormat, timeDisplayFormat)
  : placeholder;
```

## Maintenance Notes

### Known Edge Cases

1. **Timezone changes**: When date changes across DST boundary, time can shift
2. **No initial date**: Time selection creates date at "today"
3. **Min/max spanning days**: Complex when time constraints vary by date

### State Synchronization

The component must keep date and time in sync:
- Selecting new date preserves current time
- Selecting new time preserves current date
- Clearing resets both

### Future Improvements

- Date range with time support
- Recurring datetime patterns
- Duration-based selection ("2 hours from now")
- Calendar inline mode (without popover)
- Mobile-optimized layout switching


