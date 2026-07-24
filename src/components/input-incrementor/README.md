# InputIncrementor

A numeric input component with increment/decrement buttons for precise value control.

## Installation

```bash
npm install @agentix/ui
```

## Usage

```tsx
import { InputIncrementor } from '@agentix/ui';

// Basic usage
<InputIncrementor defaultValue={0} />

// With constraints
<InputIncrementor min={0} max={100} step={5} />

// Controlled mode
const [value, setValue] = useState(50);
<InputIncrementor value={value} onValueChange={setValue} />

// Embedded variant
<InputIncrementor variant="embedded" />

// With decimal precision
<InputIncrementor precision={2} step={0.1} />
```

## Variants

### Default
Buttons positioned outside with individual borders. Best for standard forms.

```tsx
<InputIncrementor variant="default" defaultValue={10} />
```

### Embedded
Buttons inside a shared bordered container. Compact, unified appearance.

```tsx
<InputIncrementor variant="embedded" defaultValue={10} />
```

### Minimal
Subtle borderless buttons with underlined input. Clean, minimal design.

```tsx
<InputIncrementor variant="minimal" defaultValue={10} />
```

## Sizes

```tsx
<InputIncrementor size="sm" />  // Small - 28px height
<InputIncrementor size="md" />  // Medium (default) - 32px height
<InputIncrementor size="lg" />  // Large - 40px height
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Controlled value |
| `defaultValue` | `number` | `0` | Initial value for uncontrolled mode |
| `onValueChange` | `(value: number) => void` | - | Callback when value changes |
| `min` | `number` | `-Infinity` | Minimum allowed value |
| `max` | `number` | `Infinity` | Maximum allowed value |
| `step` | `number` | `1` | Step value for increment/decrement |
| `variant` | `"default" \| "embedded" \| "minimal"` | `"default"` | Visual variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size of the component |
| `error` | `boolean` | `false` | Error state styling |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | - | Accessible label for screen readers |
| `precision` | `number` | `0` | Number of decimal places |
| `formatValue` | `(value: number) => string` | - | Custom value display formatter |
| `parseValue` | `(value: string) => number` | - | Custom input string parser |
| `decrementIcon` | `React.ReactNode` | `<Minus />` | Custom decrement button icon |
| `incrementIcon` | `React.ReactNode` | `<Plus />` | Custom increment button icon |
| `enableHold` | `boolean` | `false` | Enable click-and-hold to continuously increment/decrement |
| `holdAcceleration` | `boolean` | `false` | Enable step acceleration when holding (requires `enableHold`) |
| `holdDelay` | `number` | `500` | Initial delay before hold starts repeating (ms) |
| `holdInterval` | `number` | `100` | Interval between increments while holding (ms) |
| `allowOutOfRange` | `boolean` | `false` | Allow values outside min/max when typing |
| `containerClassName` | `string` | - | Additional classes for container |
| `inputClassName` | `string` | - | Additional classes for input |
| `buttonClassName` | `string` | - | Additional classes for buttons |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `↑` Arrow Up | Increment value by step |
| `↓` Arrow Down | Decrement value by step |
| `Enter` | Commit the typed value |
| `Escape` | Revert to previous value and blur |

## Examples

### Quantity Selector

```tsx
function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);
  
  return (
    <InputIncrementor
      variant="embedded"
      value={quantity}
      onValueChange={setQuantity}
      min={1}
      max={99}
      label="Quantity"
    />
  );
}
```

### Currency Input

```tsx
function CurrencyInput() {
  const [amount, setAmount] = useState(19.99);
  
  return (
    <InputIncrementor
      value={amount}
      onValueChange={setAmount}
      min={0}
      step={0.01}
      precision={2}
      formatValue={(v) => `$${v.toFixed(2)}`}
      parseValue={(s) => parseFloat(s.replace(/[^0-9.-]/g, ""))}
    />
  );
}
```

### Custom Icons

```tsx
import { ChevronUp, ChevronDown } from "lucide-react";

function VolumeControl() {
  const [volume, setVolume] = useState(50);
  
  return (
    <InputIncrementor
      value={volume}
      onValueChange={setVolume}
      min={0}
      max={100}
      decrementIcon={<ChevronDown />}
      incrementIcon={<ChevronUp />}
    />
  );
}
```

### Temperature Control

```tsx
function TemperatureControl() {
  const [temp, setTemp] = useState(72);
  
  return (
    <InputIncrementor
      variant="embedded"
      size="lg"
      value={temp}
      onValueChange={setTemp}
      min={60}
      max={85}
      formatValue={(v) => `${v}°F`}
      parseValue={(s) => parseInt(s.replace(/[^0-9]/g, ""), 10)}
    />
  );
}
```

### Form Integration

```tsx
function BookingForm() {
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(1);
  
  return (
    <form>
      <div>
        <label htmlFor="guests">Number of Guests</label>
        <InputIncrementor
          id="guests"
          variant="embedded"
          value={guests}
          onValueChange={setGuests}
          min={1}
          max={10}
          label="Number of guests"
        />
      </div>
      
      <div>
        <label htmlFor="nights">Number of Nights</label>
        <InputIncrementor
          id="nights"
          variant="embedded"
          value={nights}
          onValueChange={setNights}
          min={1}
          max={30}
          label="Number of nights"
        />
      </div>
    </form>
  );
}
```

### Click and Hold

Enable click-and-hold to continuously increment/decrement while the button is pressed:

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <InputIncrementor
      value={count}
      onValueChange={setCount}
      min={0}
      max={1000}
      enableHold
      label="Counter"
    />
  );
}
```

### Hold with Acceleration

Add step acceleration for faster changes the longer the button is held:

```tsx
function FastCounter() {
  const [value, setValue] = useState(0);
  
  return (
    <InputIncrementor
      value={value}
      onValueChange={setValue}
      min={0}
      max={10000}
      step={1}
      enableHold
      holdAcceleration
      label="Fast counter"
    />
  );
}
```

**Acceleration levels:**
- 0-1s: normal step (1x)
- 1-2s: 2x step
- 2-3s: 5x step
- 3s+: 10x step

### Custom Hold Timing

Customize the hold behavior timing:

```tsx
function CustomTiming() {
  const [value, setValue] = useState(0);
  
  return (
    <InputIncrementor
      value={value}
      onValueChange={setValue}
      enableHold
      holdDelay={200}      // Start repeating after 200ms
      holdInterval={50}    // Repeat every 50ms (fast)
      label="Custom timing"
    />
  );
}
```

## Accessibility

The component implements the spinbutton pattern with proper ARIA attributes:

- Uses `role="spinbutton"` on the input
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for current value and bounds
- `aria-label` for screen reader description
- `aria-controls` on buttons to associate them with the input
- `aria-invalid` when in error state
- Buttons have descriptive `aria-label` ("Increment", "Decrement")

## Styling

The component uses Tailwind CSS with CSS custom properties for theming:

- `--radius` - Border radius
- `--motion-duration-medium` - Transition duration
- `--motion-easing-standard` - Transition easing
- `--border` - Border color
- `--ring` - Focus ring color
- `--destructive` - Error state color

Override styles using the `containerClassName`, `inputClassName`, and `buttonClassName` props.

## Dependencies

- `lucide-react` - Icon set
- `class-variance-authority` - Variant management
- `@agentix/ui/lib/utils` - `cn()` utility

## License

MIT © Aidan
