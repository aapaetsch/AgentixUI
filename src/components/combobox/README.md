# ComboBox

A searchable select component using the **Catalyst/Headless UI pattern**. The input itself is the trigger - type directly in it to filter options, and the selected option's label appears in the input.

## Key Concept

Unlike traditional comboboxes with a separate search input inside the dropdown, this component follows the Catalyst UI pattern:
- **The input IS the trigger** - type directly to filter
- **Selected value displays in the input** - not a separate display area
- **Dropdown shows filtered options** - based on your typing

## Installation

This component is part of the `aapaetsch-ui-kit` library. No additional installation required beyond the main package.

### Dependencies

The following dependencies are used by this component:
- `@headlessui/react` - Combobox primitives
- `class-variance-authority` - Variant management
- `lucide-react` - Icons

## Usage

### Basic Usage

```tsx
import { ComboBox } from "aapaetsch-ui-kit";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

function MyComponent() {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <ComboBox
      options={fruits}
      value={selected}
      onChange={setSelected}
      placeholder="Type to search fruits..."
    />
  );
}
```

### MD3 Outlined Variant

```tsx
import { OutlinedComboBox } from "aapaetsch-ui-kit";

function MyComponent() {
  const [country, setCountry] = React.useState<string | null>(null);

  return (
    <OutlinedComboBox
      label="Country"
      options={countries}
      value={country}
      onChange={setCountry}
      required
    />
  );
}
```

### With Icons

```tsx
import { ComboBox, type ComboBoxOption } from "aapaetsch-ui-kit";
import { Apple, Banana, Cherry } from "lucide-react";

const fruits: ComboBoxOption[] = [
  { value: "apple", label: "Apple", icon: <Apple className="size-4" /> },
  { value: "banana", label: "Banana", icon: <Banana className="size-4" /> },
  { value: "cherry", label: "Cherry", icon: <Cherry className="size-4" /> },
];

function MyComponent() {
  return (
    <ComboBox
      options={fruits}
      placeholder="Select a fruit..."
    />
  );
}
```

### With Descriptions

```tsx
const users: ComboBoxOption[] = [
  { value: "1", label: "Alice", description: "alice@example.com" },
  { value: "2", label: "Bob", description: "bob@example.com" },
];

<ComboBox options={users} placeholder="Select a user..." />
```

### Typed Values (Generics)

The component supports generic types for values beyond strings:

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

const options: ComboBoxOption<User>[] = users.map(u => ({
  value: u,
  label: u.name,
  description: u.email,
}));

function MyComponent() {
  const [user, setUser] = React.useState<User | null>(null);

  return (
    <ComboBox<User>
      options={options}
      value={user}
      onChange={setUser}
      placeholder="Select a user..."
    />
  );
}
```

### Virtual Scrolling (Large Datasets)

For lists with 100+ items, enable virtualization:

```tsx
import { ComboBox } from "aapaetsch-ui-kit";

const items = Array.from({ length: 10000 }, (_, i) => ({
  value: `item-${i}`,
  label: `Item ${i + 1}`,
}));

function MyComponent() {
  return (
    <ComboBox
      options={items}
      virtual
      placeholder="Search 10,000 items..."
    />
  );
}
```

### Custom Filter Function

```tsx
// Only match from the start of the label
const startsWithFilter = (
  option: ComboBoxOption<string>,
  query: string
) => option.label.toLowerCase().startsWith(query.toLowerCase());

<ComboBox
  options={options}
  filter={startsWithFilter}
  placeholder="Type to search..."
/>
```

### With Field Label & Description

Use the compound components for form integration:

```tsx
import {
  ComboBoxField,
  ComboBoxLabel,
  ComboBoxDescription,
  ComboBox,
} from "aapaetsch-ui-kit";

<ComboBoxField>
  <ComboBoxLabel>Country</ComboBoxLabel>
  <ComboBox options={countries} placeholder="Select..." />
  <ComboBoxDescription>
    Choose your country of residence
  </ComboBoxDescription>
</ComboBoxField>
```

### Immediate Open on Focus

```tsx
<ComboBox
  options={options}
  immediate
  placeholder="Opens on focus..."
/>
```

## Props

### ComboBox

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `ComboBoxOption<T>[]` | required | Array of options to display |
| `value` | `T \| null` | - | Currently selected value (controlled) |
| `defaultValue` | `T \| null` | - | Default value (uncontrolled) |
| `onChange` | `(value: T \| null) => void` | - | Callback when value changes |
| `placeholder` | `string` | "Select..." | Placeholder text when input is empty |
| `disabled` | `boolean` | `false` | Disable the combobox |
| `invalid` | `boolean` | `false` | Show error/invalid state |
| `clearable` | `boolean` | `true` | Allow clearing selection |
| `immediate` | `boolean` | `false` | Open dropdown on focus |
| `name` | `string` | - | Name for form submission |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size variant |
| `filter` | `(option: ComboBoxOption<T>, query: string) => boolean` | - | Custom filter function |
| `useAnimatedChevron` | `boolean` | `false` | Use animated chevron indicator |
| `chevronAnimation` | `ChevronAnimationPreset` | `"smooth"` | Chevron animation style |
| `inputClassName` | `string` | - | Additional input class |
| `optionsClassName` | `string` | - | Additional options dropdown class |
| `virtual` | `boolean` | `false` | Enable virtual scrolling |
| `virtualDisabled` | `(value: T) => boolean` | - | Check if option is disabled (virtual mode) |
| `className` | `string` | - | Additional container class |

### OutlinedComboBox

Extends all ComboBox props plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Floating label text |
| `required` | `boolean` | `false` | Show required indicator |
| `containerClassName` | `string` | - | Container class override |

### ComboBoxOption Interface

```typescript
interface ComboBoxOption<T = string> {
  value: T;             // Unique value
  label: string;        // Display text
  disabled?: boolean;   // Disable selection
  icon?: ReactNode;     // Optional icon
  description?: string; // Optional secondary text
}
```

## Compound Components

| Component | Description |
|-----------|-------------|
| `ComboBoxField` | Wrapper for label association (uses Headless UI Field) |
| `ComboBoxLabel` | Styled label component |
| `ComboBoxDescription` | Styled description text |

## Size Variants

| Size | Height | Font Size |
|------|--------|-----------|
| `xs` | 1.75rem (28px) | text-xs |
| `sm` | 2rem (32px) | text-sm |
| `md` | 2.25rem (36px) | text-sm |
| `lg` | 2.75rem (44px) | text-base |
| `xl` | 3.25rem (52px) | text-lg |

## Accessibility

- Implements ARIA combobox pattern via Headless UI
- Full keyboard navigation (Arrow keys, Enter, Escape)
- Screen reader announcements
- Proper focus management
- Label association via ComboBoxField

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↓` | Open dropdown / Move to next option |
| `↑` | Move to previous option |
| `Enter` | Select focused option |
| `Escape` | Close dropdown |
| `Tab` | Close dropdown and move focus |

## Related Components

- [Select](../select) - Non-searchable select
- [Input](../input) - Text input with MD3 variants
- [AnimatedChevron](../animated-chevron) - Chevron animation

## Changelog

### 2.0.0
- **Breaking:** Rewrote using Headless UI Combobox (Catalyst pattern)
- **Breaking:** Changed `onValueChange` to `onChange`
- **Breaking:** Changed `error` to `invalid`
- **Breaking:** Value type changed from `string` to generic `T | null`
- Added generic type support for typed values
- Added `immediate` prop for open-on-focus behavior
- Added `virtual` prop for built-in virtual scrolling
- Added compound components (ComboBoxField, ComboBoxLabel, ComboBoxDescription)
- Removed `searchPlaceholder` (input is now the trigger)
- Removed `loading`/`onSearch` (implement externally if needed)
- Removed `modal` prop

### 1.0.0
- Initial release (Radix + cmdk based)

