# Checkbox

A Material Design 3 compliant checkbox component with proper state layer ripple effects.

Built on top of Radix UI Checkbox primitive with full accessibility support.

## Installation

```bash
npm install aapaetsch-ui-kit
```

## Usage

```tsx
import { Checkbox } from 'aapaetsch-ui-kit';

// Basic usage
<Checkbox label="Accept terms and conditions" />

// Controlled component
const [checked, setChecked] = React.useState(false);

<Checkbox 
  label="Subscribe to newsletter" 
  checked={checked} 
  onCheckedChange={setChecked} 
/>

// Indeterminate state
<Checkbox 
  label="Select all" 
  checked="indeterminate" 
/>

// Error state
<Checkbox 
  label="This field is required" 
  error 
/>

// Size variants
<Checkbox label="Small" size="sm" />
<Checkbox label="Medium" size="md" />
<Checkbox label="Large" size="lg" />

// Disabled state
<Checkbox 
  label="Disabled checkbox" 
  disabled 
/>
```

## Features

- **Material Design 3 Compliant**: Follows MD3 specifications exactly
- **State Layer Ripple**: 40dp circular state layer around the 18dp checkbox for proper ripple effects
- **Controlled & Uncontrolled**: Supports both controlled and uncontrolled modes
- **Indeterminate State**: Can display indeterminate state with minus icon
- **Label Support**: Built-in label with configurable positioning (left/right)
- **Error State**: Visual error state with appropriate MD3 error colors
- **Disabled State**: Proper disabled state handling with 38% opacity
- **Size Variants**: Small (16px), Medium (18px, default), Large (24px)
- **Accessible**: Fully accessible with keyboard navigation and ARIA attributes
- **Animations**: Smooth check icon and ripple animations

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` \| `"indeterminate"` | - | The controlled checked state of the checkbox |
| `defaultChecked` | `boolean` \| `"indeterminate"` | - | The default checked state when initially rendered |
| `onCheckedChange` | `(checked: boolean \| "indeterminate") => void` | - | Event handler called when the checked state changes |
| `disabled` | `boolean` | - | When true, prevents user interaction with the checkbox |
| `error` | `boolean` | `false` | If true, displays the checkbox in an error state |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | The size of the checkbox |
| `label` | `string` | - | The label text to display next to the checkbox |
| `labelPosition` | `"left"` \| `"right"` | `"right"` | The position of the label relative to the checkbox |
| `className` | `string` | - | Additional class names to apply to the container element |

## Styling

### Material Design 3 Specifications

- **Container Size**: 18dp (default), with 16dp (sm) and 24dp (lg) variants
- **Container Corner Shape**: 2dp (rounded-sm)
- **State Layer Size**: 40dp circular area around checkbox for ripple
- **Border Width**: 2dp for unselected, 0dp for selected
- **Target Size**: 48dp minimum touch target

### Colors (MD3 Token Mapping)

- **Unselected Outline**: `on-surface-variant` → `muted-foreground/70`
- **Selected Container**: `primary`
- **Selected Icon**: `on-primary` → `primary-foreground`
- **Error Outline/Container**: `error` → `destructive`
- **Disabled Opacity**: 38%

### State Layer Opacity (MD3 Interaction States)

- **Hover**: 8% opacity
- **Focus**: 12% opacity  
- **Pressed**: 12% opacity with ripple animation

### Animations

- **Ripple**: 400ms cubic-bezier(0.4, 0, 0.2, 1) - expands from center
- **Check Icon**: 150ms scale animation on state change
- **State Transitions**: Uses MD3 motion tokens

## Accessibility

- Fully accessible with keyboard navigation and ARIA attributes
- Proper label association using `<label>` element
- Supports screen readers and focus management
- Meets WCAG 2.1 AA standards for contrast and interaction

## Dependencies

- `@radix-ui/react-checkbox` - Accessible checkbox primitive
- `class-variance-authority` - Variant management
- `lucide-react` - Check and Minus icons

## License

MIT © Aidan