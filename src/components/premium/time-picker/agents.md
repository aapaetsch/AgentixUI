# TimePicker Component - AI Agent Context
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Component Overview

**Purpose:** Time selection component with scrollable hour/minute/second selectors and optional AM/PM toggle.

**Tier:** Premium

**Dependencies:**
- `date-fns` - Time formatting
- `@radix-ui/react-popover` - Popover positioning (via Popover component)
- `class-variance-authority` - CVA variants
- `src/lib/date-utils.ts` - Time utilities

## Component Architecture

### Main Components

1. **TimePicker** (`index.tsx`)
   - Popover-based time picker
   - Shows formatted time in trigger button
   - Opens scrollable time selection interface

2. **InlineTimePicker** (`index.tsx`)
   - Embedded time picker without popover
   - Used standalone or within DateTimePicker
   - Same selection interface as TimePicker

### Internal Structure

```
TimePicker
├── Trigger Button (shows formatted time)
└── Popover Content
    └── TimePickerContent
        ├── Hour Column (scrollable)
        ├── Minute Column (scrollable)
        ├── Second Column (optional, scrollable)
        └── AM/PM Toggle (12-hour mode only)
```

### Props Interface Summary

```typescript
interface TimePickerProps {
  // Value
  value?: TimeValue;
  onChange?: (value: TimeValue | undefined) => void;
  
  // Format
  format?: "12h" | "24h";
  showSeconds?: boolean;
  minuteStep?: 1 | 5 | 10 | 15 | 30;
  
  // Display
  placeholder?: string;
  label?: string;
  
  // Constraints
  minTime?: TimeValue;
  maxTime?: TimeValue;
  
  // State
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  
  // Size
  size?: "sm" | "md" | "lg";
}

interface TimeValue {
  hours: number;   // 0-23
  minutes: number; // 0-59
  seconds?: number; // 0-59
}
```

## Styling Decisions

### Size Variants

| Size | Trigger Height | Column Width |
|------|---------------|--------------|
| sm   | 1.75rem (28px)| 40px        |
| md   | 2rem (32px)   | 48px        |
| lg   | 2.25rem (36px)| 56px        |

### Visual Design

- Time columns are scrollable with hidden scrollbars
- Selected item highlighted with `bg-primary text-primary-foreground`
- Hover state: `bg-accent`
- AM/PM toggle uses segmented button style
- Columns separated by subtle dividers

### Motion

- Smooth scroll behavior on columns
- Transitions use M3 motion tokens
- Duration: `--motion-duration-medium` (200ms)
- Easing: `--motion-easing-standard`

## Time Representation

### Internal State

Time is stored as a `TimeValue` object with hours in 24-hour format (0-23) for consistency. When displaying in 12-hour format, the conversion happens at render time.

```typescript
// Internal: { hours: 14, minutes: 30 }
// Display (24h): "14:30"
// Display (12h): "2:30 PM"
```

### Minute Steps

When `minuteStep` is set, only minutes divisible by the step are shown:
- `minuteStep={1}`: 00, 01, 02, ... 59 (all minutes)
- `minuteStep={5}`: 00, 05, 10, ... 55
- `minuteStep={15}`: 00, 15, 30, 45
- `minuteStep={30}`: 00, 30

### Seconds Support

When `showSeconds={true}`:
- Adds third column for seconds (0-59)
- TimeValue includes `seconds` property
- Display format includes seconds

## Keyboard Navigation

- **Tab**: Move between columns
- **Arrow Up/Down**: Change value in focused column
- **Home/End**: Jump to first/last value
- **Enter/Space**: Confirm and close (popover mode)
- **Escape**: Close without selecting (popover mode)

## Integration with Date Utils

Uses utilities from `src/lib/date-utils.ts`:
- `formatTime` - Format TimeValue to string
- `parseTime` - Parse string to TimeValue
- `to12HourFormat` - Convert 24h to 12h display
- `to24HourFormat` - Convert 12h input to 24h storage
- `formatHour` - Format hour with padding

## Scroll Behavior

Each time column implements:
1. **Auto-scroll on open**: Scrolls to selected value
2. **Scroll snapping**: Snaps to nearest item
3. **Touch-friendly**: Momentum scrolling on mobile
4. **Keyboard override**: Arrow keys scroll and select

```typescript
// Scroll selected item into view
useEffect(() => {
  if (isOpen && selectedRef.current) {
    selectedRef.current.scrollIntoView({
      block: "center",
      behavior: "smooth"
    });
  }
}, [isOpen]);
```

## Maintenance Notes

### Known Edge Cases

1. **Midnight**: Hours can be 0 (midnight) - displays as "12:00 AM" in 12h
2. **Noon**: Hours value 12 - displays as "12:00 PM" in 12h
3. **Min/Max spanning midnight**: Complex validation needed

### Performance Considerations

- Time columns use virtual scrolling for large lists (all 60 minutes)
- Items are memoized to prevent re-renders
- Scroll handlers are debounced

### Future Improvements

- Timezone display option
- Relative time presets ("In 1 hour")
- Duration picker variant
- Time range picker


