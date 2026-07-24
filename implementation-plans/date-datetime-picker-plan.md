# Date/Datetime Picker Component Implementation Plan

## Plan Overview

Implement a comprehensive date/datetime picker system with a base component architecture. Create three separate components (DatePicker, TimePicker, DateTimePicker) inheriting from a shared base, using react-day-picker for the calendar grid, date-fns for date manipulation, and optional timezone support via props. The components leverage existing in-house components (Input, Dialog, Popover, Button, Tabs) and follow established patterns (CVA variants, Radix UI accessibility, context-based state management, Material Design 3 motion tokens).

## Implementation Steps

1. **Install required dependencies** by adding `date-fns` and `react-day-picker` to package.json via terminal, then run `npm install` to make them available to the project.

2. **Create base utilities** at `src/lib/date-utils.ts` with timezone-aware helper functions using date-fns: `formatDate`, `parseDate`, `isValidDate`, `isDateInMonth`, `getDaysInMonth`, `adjustForTimezone`, `getDefaultTimezone`, and preset date calculators.

3. **Create date-picker directory structure** at `src/components/date-picker/` with files: `index.tsx`, `base.tsx`, `calendar.tsx`, `date-input.tsx`, `time-picker.tsx`, `presets.tsx`, `year-selector.tsx`, `DatePicker.stories.tsx`, `agents.md`, and `README.md`.

4. **Create TimePicker component** at `src/components/time-picker/` with `index.tsx`, `time-picker.tsx`, `agents.md`, and `TimePicker.stories.tsx`—inheriting base patterns but standalone as a time-only picker.

5. **Create DateTimePicker component** at `src/components/date-time-picker/` with `index.tsx`, `date-time-picker.tsx`, `agents.md`, and `DateTimePicker.stories.tsx`—combining DatePicker and TimePicker functionality.

6. **Build shared DatePicker context structure** in `base.tsx` with `DatePickerProvider` component to manage shared state across all components, including timezone configuration, display formats, validation rules, and error state.

7. **Implement base component logic** in `base.tsx` that handles common functionality: open/close state, popover/dialog rendering, error boundary, input field management, keyboard navigation foundation, and timezone conversion.

8. **Create Calendar grid component** in `calendar.tsx` using react-day-picker as the foundation, styled with Tailwind and CSS variables, incorporating in-house Button components for navigation and day cells with state management for selected/range/disabled states.

9. **Build Year selector component** in `year-selector.tsx` with month and decade views using in-house Select or custom Grid layout, supporting keyboard navigation and smooth transitions between month/year/decade levels.

10. **Implement Time picker sub-component** in `time-picker.tsx` using in-house Select, InputIncrementor, and Button components for hour/minute/AM-PM selection, with optional 12/24 hour format support and prop-controlled preferences.

11. **Create Quick presets component** in `presets.tsx` accepting custom preset objects via props (`presets: Array<{ label: string; value: Date | DateRange; dateRange?: dateRange }>`), rendering them using in-house ToggleButton or Button Group.

12. **Build Date input wrapper component** in `date-input.tsx` that combines an in-house Input component with Popover/Dialog wrapper, displaying timezone indicator when specified, showing error messages when validation fails.

13. **Assemble main DatePicker API** in `index.tsx` exposing compound components: `<DatePicker>`, `<DatePicker.Trigger>`, `<DatePicker.Popper>`, `<DatePicker.Calendar>`, `<DatePicker.YearSelector>`, `<DatePicker.Presets>`, and `<DatePicker.Input>` with mode set to `'date'` by default.

14. **Assemble TimePicker API** in its own `index.tsx` exposing `<TimePicker>`, `<TimePicker.Trigger>`, `<TimePicker.Popper>`, `<TimePicker.Hour>`, `<TimePicker.Minute>`, `<TimePicker.AmPm>`—inheriting base patterns but specialized for time selection.

15. **Assemble DateTimePicker API** in its own `index.tsx` exposing `<DateTimePicker>`, `<DateTimePicker.DateTrigger>`, `<DateTimePicker.TimeTrigger>`, `<DateTimePicker.Popper>`, `<DateTimePicker.Calendar>`, `<DateTimePicker.YearSelector>`, `<DateTimePicker.Time>`, and `<DateTimePicker.Presets>`.

16. **Define CVA variants** in each main component's `index.tsx` for visual styles: size (compact, default, spacious), variant (filled, outlined, tonal), hourFormat (12, 24) for TimePicker/DateTimePicker.

17. **Add comprehensive error support** with validation state, error message prop (`errorMessage: string`), callback (`onError?: (error: DateValidationError) => void`), visual error styling (`ring-error` color token, error icon), and error boundary for graceful degradation.

18. **Add Accessibility features** including ARIA labels, roles, keyboard navigation (arrow keys for day selection, PageUp/PageDown for month navigation, Home/End for boundaries, Ctrl+PageUp for year navigation), screen reader announcements using Radix UI patterns, and focus management for range selection.

19. **Create comprehensive Storybook stories** in each component's stories file covering: single date selection, date range selection, datetime selection, presets, min/max dates with error states, disabled dates, timezone examples, 12/24 hour formats, year/decade navigation, internationalization, dark mode, all size/variant combinations.

20. **Write agents.md documentation** following template with title, props interfaces, dependencies (react-day-picker, date-fns, Radix UI), styling decisions, validation edge cases, keyboard shortcuts, timezone handling, error management patterns, and maintenance notes.

21. **Author README.md** for each component with human-friendly documentation: component preview, props table, usage examples, accessibility notes, timezone configuration, customizing formats, validation patterns, preset customization API, error handling examples, and integration examples.

22. **Export components from src/index.ts** by adding `export * from './components/premium/date-picker'`, `export * from './components/premium/time-picker'`, and `export * from './components/premium/date-time-picker'`.

23. **Update ROADMAP.md** by changing Date Picker, Time Picker, and Date Range Picker statuses from "Planned" 📋 to "In Progress" 🔄, then to "Complete" ✅ after validation passes.

24. **Run build and Storybook verification** by calling the Dev Runner to execute `npm run build` and `npm run storybook`, and fix any errors before marking the task complete.

## Component Spacing, Sizing, Effects & Animation Guidelines

### Spacing & Layout

**Spacing scale:**
- Use Tailwind spacing scale (1-8): `space-xs: 4px` (0.25rem), `space-sm: 8px` (0.5rem), `space-md: 12px` (0.75rem), `space-lg: 16px` (1rem), `space-xl: 24px` (1.5rem), `space-2xl: 32px` (2rem)

**Internal padding:**
- Calendar day cells: `p-2` (8px padding) minimum touch target, compact mode `p-1` (4px)
- Calendar grid: `p-3` (12px padding) around month grid
- Year selector rows: `p-1` (4px) with `gap-2` (8px) between month cells
- Time picker sections: `space-2` (8px gap) between hour/minute controls, `space-3` (12px) between AM/PM selector
- Presets section: `space-2` (8px gap) between preset buttons
- Popover padding: `p-4` (16px) default, `p-6` (24px) spacious mode
- Timezone indicator: `py-1` (4px) `px-2` (8px) inline display

**External spacing:**
- Margin between label and input: `space-y-1` (4px vertical gap)
- Margin between calendar and time controls: `space-y-4` (16px vertical gap)
- Margin between presets and calendar: `space-y-3` (12px vertical gap)
- Error message margin: `mt-2` (8px) below input field

**Layout rules:**
- Day cells: Fixed `w-9` (36px) × `h-9` (36px) in default mode, `w-7` (28px) × `h-7` (28px) in compact, `w-11` (44px) × `h-11` (44px) in spacious
- Calendar grid: 7-column layout with responsive max-width `max-w-xs` (320px) for compact, `max-w-sm` (384px) default
- Year selector: Grid of 3 months per row, 4 rows for year view, 12 cells for decade view
- Minimum popover width: `min-w-[280px]` for date picker, `min-w-[320px]` for datetime picker, `min-w-[200px]` for time picker
- Time picker: Two-column layout for hour/minute in default mode, three-column (hour/minute/AM-PM) for 12-hour format

### Sizing

**Component height/width:**
- Compact mode: Day cells 28px, spacing 4px, total calendar height ~260px
- Default mode: Day cells 36px, spacing 8px, total calendar height ~320px
- Spacious mode: Day cells 44px, spacing 12px, total calendar height ~380px
- Time picker height: ~120px (hour/minute rows + AM-PM selector), ~160px in spacious mode
- Year selector height: ~320px (12 months in grid), ~380px with decade view

**Min/max constraints:**
- Popover min-width: `min-w-[280px]` (date), `min-w-[340px]` (datetime), `min-w-[200px]` (time)
- Popover max-width: `max-w-xs` (date/time), `max-w-sm` (datetime), `max-w-md` (year selector)
- Calendar day cells: Minimum 28px for touch targets, maximum 48px for accessibility
- Timezone badge: Min-width `px-2` (8px), max-content based on timezone code

**Breakpoint behavior:**
- Mobile (`< 640px`): Popover renders as full-screen Dialog with bottom sheet behavior, calendar adjusts to viewport height
- Tablet (`≥ 640px`): Popover anchors to input with responsive positioning, side-by-side date/time layout for datetime
- Desktop (`≥ 1024px`): Popover supports multi-view calendars (month + year navigation), datetime picker uses horizontal split between calendar and time

### Effects

**Shadows:**
- Default elevation: `shadow-md` (for popover/dialog)
- Hover elevation: `shadow-lg` on day cells that are interactable
- Focus elevation: `shadow-[0_0_0_2px_var(--ring),0_0_0_4px_var(--background)]` for focus rings
- Active elevation: `shadow-md inset` on pressed day cells
- Error elevation: `shadow-[0_0_0_2px_var(--destructive),0_0_0_4px_var(--background)]` for error state

**Borders:**
- Border width: `border` (1px) default, `border-2` on focused elements or error states
- Border color: `border-border` default, `border-primary` on selected dates, `border-muted-foreground` on disabled dates, `border-destructive` on error state
- Default radius: `rounded-md` (6px) for calendar grid, `rounded-full` (9999px) for day cells, `rounded-sm` (4px) for error messages
- Hover border: `border-border hover:border-primary/50` transition
- Active border: Selected dates use `bg-primary text-primary-foreground` instead of border

**Blurs / overlays:**
- Popover backdrop: Dialog overlay uses `bg-black/50 backdrop-blur-sm` for consistent pattern
- Focus trap: Not applicable to calendar (keyboard navigation built-in)
- Loading state: `opacity-50 pointer-events-none` with optional `animate-pulse` on skeleton
- Error overlay: Semi-transparent error indicator on invalid selections

### Animation & Transitions

**Motion guidelines:**
- Follow Material Design 3: Use `--motion-duration-medium` (200ms) and `--motion-easing-standard` `cubic-bezier(0.2, 0, 0, 1)` for all transitions
- Popover open/close: `duration-200 ease-[cubic-bezier(0.2,0,0,1)]` with `opacity` and `transform` transitions
- Month navigation: `duration-200 ease-[cubic-bezier(0.2,0,0,1)]` with slide animation
- Year/decade transitions: `duration-200 ease-[cubic-bezier(0.2,0,0,1)]` with scale and fade
- Error state transition: `duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]` for faster feedback

**Transition properties:**
- Opacity: All fade effects use `transition-opacity`
- Transform: Calendar months and year views use `transition-transform` with `translate-x` and `scale` animations
- Background color: Day cells use `transition-colors`, `transition-border-color`
- Box shadow: Elevation changes use `transition-shadow`
- Error state: Uses faster `ease-[cubic-bezier(0.4,0,0.2,1)]` for snappier feedback

**Interactive feedback:**
- Hover on day cell: `hover:scale-105 active:scale-95`, subtle lift effect on hover
- Hover on month cell (year selector): `hover:scale-105 hover:bg-accent`
- Active on day cell: Compress by 5% (`active:scale-95`) with `transition-transform`
- Focus ring: `focus:ring-2 focus:ring-ring focus:ring-offset-2` with smooth fade-in, `focus:ring-error focus:ring-offset-error` for error state
- Selected date: No scale change, just color transition `transition-colors`
- Error trigger: Shake animation (`animate-shake`) when validation fails

**Open/close motion:**
- Popover: Fade in + slide up with `translate-y-2 opacity-0` to `translate-y-0 opacity-100`
- Dialog: Full-screen on mobile with `translate-y-full` to `translate-y-0` (bottom sheet style)
- Presets section: Stagger entrance animation with `delay-50` and `delay-100` between buttons
- Year selector: Scale up from month view to year view, fade in month grid on selection

## Further Considerations

### Dependencies and Integration
- `react-day-picker` provides the calendar grid but will need extensive customization with `DayContent` and `Navigation` components to match our design system
- `date-fns` locale support must be plumbed through the context for different languages (en-US, en-GB, es, fr, de, etc.) via a `locale` prop
- Timezone handling: Use `date-fns-tz` if needed for explicit timezone conversion, otherwise use native `Intl.DateTimeFormat` with `timeZone` option
- Base component architecture: Create a `BaseDatePicker` component in `base.tsx` that all three components extend, with shared logic for popover/dialog, validation, error handling, keyboard navigation

### Architecture Tradeoffs
- Three separate components (DatePicker, TimePicker, DateTimePicker) inherit from a shared base to maximize reusability while maintaining clear separation of concerns
- Compound component pattern increases complexity but provides maximum flexibility for consumers to customize layouts
- Context-based state management allows any sub-component to access shared state (timezone, format, validation rules) but requires careful memoization for performance
- Timezone prop is optional: defaults to `undefined` (browser local time), accepts IANA timezone strings (e.g., `'America/New_York'`, `'Europe/London'`)
- Custom presets API: `presets: Array<{ label: string; value: () => Date | DateRange; disabled?: boolean }>`—function values are evaluated at render time for relative date calculations

### Component Inheritance Structure

```
BaseDatePicker (base.tsx)
├── DatePicker (index.tsx) - mode: 'date'
│   ├── Calendar
│   ├── YearSelector
│   ├── Presets
│   └── DateInput
├── TimePicker (separate component) - standalone
│   ├── TimeControls
│   └── TimeInput
└── DateTimePicker (separate component) - mode: 'datetime'
    ├── Calendar
    ├── YearSelector
    ├── TimeControls
    ├── Presets
    └── CombinedInput
```

### Error Handling Strategy
- Validation errors prop: `onError?: (error: DateValidationError) => void` where `DateValidationError` type includes `{ type: 'min' | 'max' | 'custom'; message: string; value: Date }`
- Visual error state: Input field receives ring color `ring-destructive`, error icon displays, error message renders below input
- Silent vs. loud validation: Component silently constrains selection (users cannot pick out-of-range dates) but triggers `onError` callback and visual feedback if value is set programmatically to an invalid date
- Error props: `errorMessage?: string` for custom error messages, `hasError?: boolean` for external error control, `onError` callback for programmatic handling

### Performance Implications
- Large date ranges or calendars with many disabled dates may need virtualization for year/decade views (not in scope for initial release)
- Excessive date comparisons in re-renders could be optimized with `useMemo` for date arrays and `React.memo` for day cells
- react-day-picker is well-optimized, but custom `renderDay` and `renderMonth` functions need memoization to prevent unnecessary re-renders
- Timezone conversions can be expensive; memoize timezone-adjusted dates to avoid repeated calculations

### Accessibility Considerations
- Keyboard navigation must support: Arrow keys (day selection), PageUp/PageDown (month navigation), Home/End (first/last day of month), Ctrl+PageUp (year navigation), Enter (select date), Escape (close), Tab (between form fields)
- Screen reader announcements for month navigation, year view changes, and date selection changes using `aria-live` regions
- Focus management when opening/closing picker, especially for range selection (focus on first input, then second after date selected)
- ARIA live regions for dynamic updates (selected date display, error messages, timezone indicator)
- Custom preset buttons must have accessible labels and keyboard support

### Design System Cohesion
- Color tokens from `globals.css` must be used for all states: selected (`bg-primary text-primary-foreground`), hover (`bg-accent`), disabled (`text-muted-foreground opacity-50`), range start/end (`bg-primary`), range middle (`bg-accent/50`), error (`bg-destructive/10 text-destructive`)
- Motion tokens must be applied consistently across all animations
- Radius values must match other components: `rounded-md` (calendar grid), `rounded-full` (day cells)
- Typography should use existing text styles for labels and dates
- Year selector should use consistent spacing and sizing with the calendar grid

### Custom Presets API Example

```typescript
interface DatePreset {
  label: string;
  value: Date | DateRange | (() => Date | DateRange);
  disabled?: boolean;
}

// Usage
const presets: DatePreset[] = [
  { label: 'Today', value: new Date() },
  { label: 'Yesterday', value: subDays(new Date(), 1) },
  { label: 'Last 7 Days', value: { from: subDays(new Date(), 7), to: new Date() } },
  { label: 'This Week (Start)', value: () => startOfWeek(new Date()) },
];
```

### Timezone Support Implementation

```typescript
interface DatePickerProps {
  timezone?: string; // Optional IANA timezone, defaults to browser local
  // ... other props
}

// When timezone is set, convert all display values to that timezone
// When undefined, use native browser local time
// Timezone indicator can be displayed in the input when specified
```

### Known Edge Cases
- February 29th on non-leap years (date-fns handles this, but validation needed)
- Month boundaries when selecting ranges that span multiple months
- Min/max date validation when typing dates manually in input
- Time zone differences between local and display formats when timezone prop is set
- RTL language support for Arabic/Hebrew (may require separate implementation)
- Daylight saving time transitions causing ambiguous or invalid local times
- Year rollover when selecting December → January in range selection
- Preset evaluation when using function values (must update on render, not initialization)

### Testing Requirements
- Manual testing for keyboard navigation across all views (month, year, decade)
- Accessibility testing with screen readers (NVDA, JAWS, VoiceOver)
- Cross-browser testing for popper positioning (Chrome, Firefox, Safari, Edge)
- Mobile touch gesture testing (swipe to navigate months)
- Timezone conversion testing across different regions
- Error state testing with invalid date entry
- Preset custom rendering with function-based values
- 12-hour vs 24-hour format toggling
- Range selection crossing month boundaries
- Year/decade navigation transitions

### File Structure Summary

```
src/
├── components/premium/
│   ├── date-picker/
│   │   ├── index.tsx              # Main DatePicker component (mode: 'date')
│   │   ├── base.tsx               # Base component shared by all three
│   │   ├── calendar.tsx           # Calendar grid (reused by all)
│   │   ├── date-input.tsx         # Date input wrapper (reused by date/datetime)
│   │   ├── time-picker.tsx        # Time controls (reused by datetime)
│   │   ├── presets.tsx            # Quick presets (shared)
│   │   ├── year-selector.tsx      # Year/decade navigation (shared)
│   │   ├── agents.md
│   │   ├── README.md
│   │   └── DatePicker.stories.tsx
│   ├── time-picker/
│   │   ├── index.tsx              # Main TimePicker component (standalone)
│   │   ├── agents.md
│   │   ├── README.md
│   │   └── TimePicker.stories.tsx
│   └── date-time-picker/
│       ├── index.tsx              # Main DateTimePicker component (mode: 'datetime')
│       ├── agents.md
│       ├── README.md
│       └── DateTimePicker.stories.tsx
└── lib/
    └── date-utils.ts              # Shared date/time utilities with timezone support
```

## Dependencies to Install

```json
{
  "date-fns": "^2.30.0",
  "react-day-picker": "^8.8.0"
}
```

## Component Classification

**Advanced Component** - Features:
- Complex state management (calendar navigation, date ranges, time selection)
- Third-party dependencies (date-fns, react-day-picker)
- Advanced interactions (keyboard navigation, date validation, localization)
- High development effort (multiple sub-components and variants)