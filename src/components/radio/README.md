# RadioGroup & RadioGroupItem

Material Design 3 compliant radio button components with proper state layer ripple effects.

Built on top of Radix UI Radio Group primitive with full accessibility support.

## Installation

```bash
npm install @agentix/ui
```

## Usage

```tsx
import { RadioGroup, RadioGroupItem } from '@agentix/ui';

// Basic usage
<RadioGroup defaultValue="option1">
  <RadioGroupItem value="option1" label="Option 1" />
  <RadioGroupItem value="option2" label="Option 2" />
  <RadioGroupItem value="option3" label="Option 3" />
</RadioGroup>

// Controlled component
const [value, setValue] = React.useState("option1");

<RadioGroup value={value} onValueChange={setValue}>
  <RadioGroupItem value="option1" label="Option 1" />
  <RadioGroupItem value="option2" label="Option 2" />
</RadioGroup>

// Horizontal orientation
<RadioGroup defaultValue="option1" orientation="horizontal">
  <RadioGroupItem value="option1" label="Option 1" />
  <RadioGroupItem value="option2" label="Option 2" />
</RadioGroup>

// Size variants
<RadioGroupItem value="option1" label="Small" size="sm" />
<RadioGroupItem value="option2" label="Medium" size="md" />
<RadioGroupItem value="option3" label="Large" size="lg" />

// Disabled state
<RadioGroup defaultValue="option1" disabled>
  <RadioGroupItem value="option1" label="Disabled" />
</RadioGroup>
```

## Features

- **Material Design 3 Compliant**: Follows MD3 specifications exactly
- **State Layer Ripple**: 40dp circular state layer around the 20dp radio button for proper ripple effects
- **Controlled & Uncontrolled**: Supports both controlled and uncontrolled modes
- **Label Support**: Built-in label with configurable positioning (left/right)
- **Orientation Support**: Vertical (default) and horizontal layouts
- **Disabled State**: Proper disabled state handling with 38% opacity
- **Size Variants**: Small (16px), Medium (20px, default), Large (24px)
- **Accessible**: Full keyboard navigation with roving tabindex and ARIA attributes
- **Animations**: Smooth indicator and ripple animations using existing animation utilities

## Props

### RadioGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The controlled value of the selected radio item |
| `defaultValue` | `string` | - | The default value when initially rendered (uncontrolled) |
| `onValueChange` | `(value: string) => void` | - | Event handler called when the value changes |
| `disabled` | `boolean` | `false` | When true, prevents user interaction with all items |
| `orientation` | `"vertical"` \| `"horizontal"` | `"vertical"` | The orientation of the radio group |
| `name` | `string` | - | The name of the group for form submission |
| `required` | `boolean` | `false` | Whether a selection is required |
| `loop` | `boolean` | `true` | Whether keyboard navigation should loop |

### RadioGroupItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | The unique value of the radio item |
| `disabled` | `boolean` | `false` | When true, prevents interaction with this item |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | The size of the radio button |
| `label` | `string` | - | The label text to display next to the radio button |
| `labelPosition` | `"left"` \| `"right"` | `"right"` | The position of the label relative to the radio |

## Styling

### Material Design 3 Specifications

- **Icon Size**: 20dp (default), with 16dp (sm) and 24dp (lg) variants
- **State Layer Size**: 40dp circular area around radio button for ripple
- **Border Width**: 2dp for outline
- **Target Size**: 48dp minimum touch target (achieved via state layer)

### Colors (MD3 Token Mapping)

- **Unselected Outline**: `on-surface-variant` → `muted-foreground/70`
- **Selected Outline & Indicator**: `primary`
- **Disabled Opacity**: 38%
- **Text Label**: `on-surface` → `foreground`

### State Layer Opacity (MD3 Interaction States)

- **Hover**: 8% opacity
- **Focus**: 10% opacity
- **Pressed**: 10% opacity with ripple animation

### Animations

- **Ripple**: 400ms cubic-bezier(0.4, 0, 0.2, 1) - reuses `animate-checkbox-ripple`
- **Indicator**: 150ms scale animation on state change - reuses `animate-checkbox-check`
- **State Transitions**: Uses MD3 motion tokens (`--motion-duration-medium`, `--motion-easing-standard`)

## Accessibility

- Full keyboard navigation support:
  - Tab: Moves focus into/out of radio group (focuses selected or first item)
  - Arrow Up/Down: Moves focus and selects previous/next item
  - Arrow Left/Right: Same as Up/Down
  - Space: Selects focused item (if not already selected)
- Proper ARIA roles and states via Radix UI primitives
- Screen reader announces selection changes automatically
- 40dp minimum touch target for mobile accessibility

## Dependencies

- `@radix-ui/react-radio-group` - Accessible radio group primitive
- `class-variance-authority` - Variant management

## License

MIT © Aidan