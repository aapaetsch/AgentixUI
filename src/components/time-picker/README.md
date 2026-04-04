# TimePicker

A time selection component with scrollable hour, minute, and second selectors, supporting both 12-hour and 24-hour formats.

## Installation

The TimePicker is part of the `@agentix/ui` package. Ensure you have the required dependencies:

```bash
npm install date-fns
```

## Usage

### Basic Usage

```tsx
import { TimePicker, TimeValue } from "@agentix/ui";
import { useState } from "react";

function MyComponent() {
  const [time, setTime] = useState<TimeValue>();

  return (
    <TimePicker
      value={time}
      onChange={setTime}
      label="Select Time"
      placeholder="Pick a time"
    />
  );
}
```

### 12-Hour Format

```tsx
<TimePicker
  format="12h"
  value={time}
  onChange={setTime}
  label="Meeting Time"
/>
```

### With Seconds

```tsx
<TimePicker
  showSeconds
  value={time}
  onChange={setTime}
  label="Precise Time"
/>
```

### Inline Picker

Use `InlineTimePicker` when you want the time selector embedded without a popover:

```tsx
import { InlineTimePicker, TimeValue } from "@agentix/ui";
import { useState } from "react";

function InlineExample() {
  const [time, setTime] = useState<TimeValue>({ hours: 9, minutes: 0 });

  return (
    <InlineTimePicker
      value={time}
      onChange={setTime}
      format="24h"
    />
  );
}
```

## Props

### TimePicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `TimeValue` | - | Current time value |
| `onChange` | `(value: TimeValue \| undefined) => void` | - | Change handler |
| `format` | `"12h" \| "24h"` | `"12h"` | Time format |
| `showSeconds` | `boolean` | `false` | Show seconds selector |
| `minuteStep` | `1 \| 5 \| 10 \| 15 \| 30` | `1` | Minute increment |
| `placeholder` | `string` | `"Select time"` | Trigger placeholder |
| `label` | `string` | - | Label text |
| `minTime` | `TimeValue` | - | Minimum selectable time |
| `maxTime` | `TimeValue` | - | Maximum selectable time |
| `disabled` | `boolean` | `false` | Disable the picker |
| `required` | `boolean` | `false` | Mark as required |
| `error` | `boolean` | `false` | Show error state |
| `errorMessage` | `string` | - | Error message to display |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `className` | `string` | - | Additional CSS classes |

### InlineTimePicker Props

Same as TimePicker, except without `placeholder` and popover-related props.

### TimeValue Interface

```typescript
interface TimeValue {
  hours: number;    // 0-23 (always 24-hour internally)
  minutes: number;  // 0-59
  seconds?: number; // 0-59 (only when showSeconds is true)
}
```

## Features

### Minute Steps

Control the minute increment for coarser time selection:

```tsx
// Every 15 minutes
<TimePicker
  minuteStep={15}
  value={time}
  onChange={setTime}
/>
// Shows: 00, 15, 30, 45
```

### Time Constraints

Restrict selectable times:

```tsx
<TimePicker
  minTime={{ hours: 9, minutes: 0 }}  // 9:00 AM
  maxTime={{ hours: 17, minutes: 0 }} // 5:00 PM
  value={time}
  onChange={setTime}
/>
```

### Time Formatting

The component handles format conversion automatically:

```tsx
// Internal value is always 24-hour: { hours: 14, minutes: 30 }
// Display varies by format:
// - 24h: "14:30"
// - 12h: "2:30 PM"
```

## Size Variants

```tsx
<TimePicker size="sm" /> // Small - 28px trigger
<TimePicker size="md" /> // Medium (default) - 32px trigger
<TimePicker size="lg" /> // Large - 36px trigger
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move between columns |
| `Arrow Up/Down` | Change value in column |
| `Home/End` | First/last value |
| `Enter/Space` | Confirm selection |
| `Escape` | Close popover |

## Accessibility

- Full ARIA labels on trigger and selectors
- Keyboard navigation support
- Screen reader announcements
- Focus management within popover
- Visible focus indicators

## Examples

### Scheduling Use Case

```tsx
function MeetingScheduler() {
  const [startTime, setStartTime] = useState<TimeValue>();
  const [endTime, setEndTime] = useState<TimeValue>();

  return (
    <div className="flex gap-4">
      <TimePicker
        label="Start Time"
        value={startTime}
        onChange={setStartTime}
        minuteStep={15}
        format="12h"
      />
      <TimePicker
        label="End Time"
        value={endTime}
        onChange={setEndTime}
        minuteStep={15}
        format="12h"
        minTime={startTime}
      />
    </div>
  );
}
```

### Alarm Clock

```tsx
function AlarmSetting() {
  const [alarm, setAlarm] = useState<TimeValue>({ hours: 7, minutes: 0 });

  return (
    <InlineTimePicker
      value={alarm}
      onChange={(v) => v && setAlarm(v)}
      format="12h"
      size="lg"
    />
  );
}
```

## Related Components

- [DatePicker](../date-picker/README.md) - Date-only selection
- [DateTimePicker](../date-time-picker/README.md) - Combined date and time
