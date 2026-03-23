# DatePicker Component - AI Agent Context
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Component Overview

**Purpose:** Date selection component with popover calendar, supporting single date, date range, and multiple date selection modes.

**Tier:** Premium

**Dependencies:**
- `react-day-picker` - Calendar grid implementation
- `date-fns` - Date manipulation and formatting
- `@radix-ui/react-popover` - Popover positioning (via Popover component)
- `class-variance-authority` - CVA variants

## Component Architecture

### Main Components

1. **DatePicker** (`index.tsx`)
   - Root component with popover trigger
   - Props: mode, selected, onSelect, presets, constraints
   - Three modes: single, range, multiple

2. **Calendar** (`calendar.tsx`)
   - Core calendar grid using react-day-picker
   - Supports all selection modes
   - Customized styling to match design system

3. **YearSelector** (`year-selector.tsx`)
   - Month/year/decade navigation
   - Grid-based selection interface
   - Supports drilling down from decades → years → months

4. **Presets** (`presets.tsx`)
   - Quick selection buttons for common dates
   - Supports custom presets via props
   - Handles both Date and DateRange values

### Props Interface Summary

```typescript
interface DatePickerProps {
  // Selection mode
  mode?: "single" | "range" | "multiple";
  
  // Selected values (based on mode)
  selected?: Date;
  selectedRange?: DateRange;
  selectedDates?: Date[];
  
  // Callbacks
  onSelect?: (date: Date | undefined) => void;
  onSelectRange?: (range: DateRange | undefined) => void;
  onSelectMultiple?: (dates: Date[] | undefined) => void;
  
  // Constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];
  
  // Presets
  presets?: DatePreset[];
  showDefaultPresets?: boolean;
  
  // Display
  placeholder?: string;
  format?: string;
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

| Size | Trigger Height | Calendar Day Size |
|------|---------------|-------------------|
| sm   | 1.75rem (28px)| 28px × 28px      |
| md   | 2rem (32px)   | 36px × 36px      |
| lg   | 2.25rem (36px)| 44px × 44px      |

### Visual Design

- Uses CSS variables from globals.css for theming
- Day cells are circular (`rounded-full`)
- Selected dates use `bg-primary text-primary-foreground`
- Range selection uses `bg-accent` for middle days
- Today is highlighted with `bg-accent font-semibold`
- Disabled dates have `opacity-50`

### Motion

- All transitions use M3 motion tokens
- Duration: `--motion-duration-medium` (200ms)
- Easing: `--motion-easing-standard`
- Hover effects include scale animation on day cells

## Keyboard Navigation

- **Arrow keys**: Navigate between days
- **PageUp/PageDown**: Navigate months
- **Ctrl+PageUp/PageDown**: Navigate years
- **Home/End**: First/last day of month
- **Enter/Space**: Select date
- **Escape**: Close popover

## Validation

The component validates against:
- Required field check
- Min/max date bounds
- Disabled specific dates
- Disabled days of week
- Custom validator function

Validation errors are surfaced via:
- `onError` callback with error object
- Visual error styling (destructive border)
- `errorMessage` prop display

## Integration with Date Utils

Uses utilities from `src/lib/date-utils.ts`:
- `formatDate` / `formatDateRange` for display
- `parseDate` for input parsing
- `validateDate` for constraint checking
- `getDatePresets` / `getDateRangePresets` for defaults
- Re-exported date-fns functions for manipulation

## Maintenance Notes

### Known Edge Cases

1. **February 29th**: date-fns handles leap years correctly
2. **Range spanning months**: Calendar handles multi-month navigation
3. **Timezone**: Currently uses browser local time (no explicit timezone)

### Performance Considerations

- `useMemo` for disabled date matcher array
- Calendar cells use React.memo internally (react-day-picker)
- Preset evaluation is lazy (functions called at selection time)

### Future Improvements

- Timezone prop support (needs date-fns-tz)
- RTL language support
- Multi-month display improvements
- Inline calendar mode (without popover)


