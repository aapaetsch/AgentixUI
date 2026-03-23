# InputIncrementor Component
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Purpose
A numeric input component with increment/decrement buttons for precise value control.
Supports controlled and uncontrolled modes with min/max validation, step increments,
and decimal precision.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Controlled value |
| `defaultValue` | `number` | `0` | Default value for uncontrolled mode |
| `onValueChange` | `(value: number) => void` | - | Callback when value changes |
| `min` | `number` | `-Infinity` | Minimum allowed value |
| `max` | `number` | `Infinity` | Maximum allowed value |
| `step` | `number` | `1` | Step increment/decrement |
| `variant` | `"default" \| "embedded" \| "minimal"` | `"default"` | Visual variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `error` | `boolean` | `false` | Error state |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | - | Accessible label |
| `precision` | `number` | `0` | Decimal places |
| `formatValue` | `(value: number) => string` | - | Custom display formatter |
| `parseValue` | `(value: string) => number` | - | Custom input parser |
| `decrementIcon` | `React.ReactNode` | `<Minus />` | Custom decrement button icon |
| `incrementIcon` | `React.ReactNode` | `<Plus />` | Custom increment button icon |
| `enableHold` | `boolean` | `false` | Enable click-and-hold to continuously increment/decrement |
| `holdAcceleration` | `boolean` | `false` | Enable step acceleration when holding (requires `enableHold`) |
| `holdDelay` | `number` | `500` | Initial delay before hold starts repeating (ms) |
| `holdInterval` | `number` | `100` | Interval between increments while holding (ms) |
| `allowOutOfRange` | `boolean` | `false` | Allow values outside min/max |
| `containerClassName` | `string` | - | Container class override |
| `inputClassName` | `string` | - | Input class override |
| `buttonClassName` | `string` | - | Button class override |

## Dependencies

- `lucide-react` - Plus/Minus icons
- `class-variance-authority` - Variant management
- `../../lib/utils` - `cn()` utility

## Styling Decisions

### Variants
- **default**: Buttons outside with individual borders - most common use case
- **embedded**: Buttons inside a shared bordered container - compact, unified look
- **minimal**: Subtle borderless buttons with underlined input - clean design

### Sizes
- **sm**: 1.75rem height - compact spaces, tables
- **md**: 2rem height - standard forms
- **lg**: 2.5rem height - touch-friendly, prominent controls

### Focus & Error States
- Input and buttons have distinct focus rings
- Error state applies destructive border color
- Disabled state reduces opacity and prevents interaction
- Buttons show cursor:not-allowed when disabled or at min/max limits

### Button Positioning
- Decrement (-) on left, Increment (+) on right (LTR convention)
- Buttons disabled at min/max limits
- Buttons have negative tabIndex to keep focus on input

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `↑` | Increment by step |
| `↓` | Decrement by step |
| `Enter` | Commit typed value |
| `Escape` | Revert to previous value |

## Accessibility

- Uses `role="spinbutton"` for input
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` attributes
- `aria-label` for screen reader context
- `aria-controls` on buttons links them to input
- Buttons use `aria-label` for clear actions
- `aria-invalid` for error state

## Usage Examples

```tsx
// Basic
<InputIncrementor defaultValue={0} />

// With constraints
<InputIncrementor min={0} max={100} step={5} />

// Controlled
const [value, setValue] = useState(50);
<InputIncrementor value={value} onValueChange={setValue} />

// Embedded variant
<InputIncrementor variant="embedded" defaultValue={1} />

// With decimal precision
<InputIncrementor precision={2} step={0.01} />

// Custom formatting (currency)
<InputIncrementor
  formatValue={(v) => `$${v.toFixed(2)}`}
  parseValue={(s) => parseFloat(s.replace(/[^0-9.-]/g, ""))}
/>

// Custom icons
<InputIncrementor
  decrementIcon={<ChevronDown />}
  incrementIcon={<ChevronUp />}
/>

// Click and hold to increment
<InputIncrementor
  enableHold
  min={0}
  max={1000}
/>

// Hold with step acceleration
<InputIncrementor
  enableHold
  holdAcceleration
  min={0}
  max={10000}
  step={1}
/>

// Custom hold timing
<InputIncrementor
  enableHold
  holdDelay={200}  // Faster initial delay
  holdInterval={50}  // Faster repeat rate
/>

// Quantity selector
<InputIncrementor variant="embedded" min={1} max={99} />
```

## Maintenance Notes

- Button icons from lucide-react should match IconButton sizing
- Keyboard handling in input prevents default browser spinbutton behavior
- Format/parse functions should be inverses of each other
- Step validation happens on blur, not on every keystroke
- Display value is stored separately during editing to allow invalid intermediate states
- Hold timers are properly cleaned up on unmount and mouse up/leave events
- Touch events (onTouchStart/onTouchEnd) mirror mouse events for mobile support
- Acceleration levels: normal (0-1s), 2x (1-2s), 5x (2-3s), 10x (3s+)
- Hold functionality uses separate onClick vs onMouseDown handlers based on enableHold prop


