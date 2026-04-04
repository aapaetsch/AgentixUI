# Chip

A Material Design 3 chip component for entering information, making selections, filtering content, or triggering actions.

## Overview

Chips are compact elements that represent an input, attribute, or action. They allow users to enter information, make selections, filter content, or trigger actions.

## Features

- **Four Variants**: Assist, Filter, Input, and Suggestion chips
- **Three Sizes**: Small, Medium (default), and Large
- **Icon Support**: Leading and trailing icons on all chip types
- **Selection State**: Toggleable selection for filter chips with checkmark
- **Dismissible**: Input chips can be dismissed with X button
- **Elevated Option**: Shadow elevation for assist and suggestion chips
- **Accessible**: Full keyboard navigation and ARIA support

## Installation

The Chip component is part of the `@aidan/ui` package:

```tsx
import { Chip, ChipGroup } from "@aidan/ui";
```

## Usage

### Basic Chips

```tsx
// Assist chip - for actions
<Chip variant="assist">Schedule</Chip>

// Filter chip - for toggleable filters
<Chip variant="filter" selected>Active</Chip>

// Input chip - for tags/recipients
<Chip variant="input" dismissible>Tag</Chip>

// Suggestion chip - for prompts
<Chip variant="suggestion">Try this</Chip>
```

### With Icons

```tsx
// Leading icon
<Chip variant="assist" leadingIcon={<Calendar />}>
  Schedule
</Chip>

// Trailing icon
<Chip variant="assist" trailingIcon={<ChevronDown />}>
  Dropdown
</Chip>

// Both icons
<Chip variant="assist" leadingIcon={<User />} trailingIcon={<ChevronDown />}>
  Select User
</Chip>
```

### Filter Chips (Toggleable)

```tsx
function FilterExample() {
  const [selected, setSelected] = useState(false);

  return (
    <Chip
      variant="filter"
      selected={selected}
      onSelectedChange={setSelected}
    >
      Category
    </Chip>
  );
}
```

### Input Chips (Dismissible)

```tsx
function InputChipExample() {
  const [tags, setTags] = useState(["React", "TypeScript", "Tailwind"]);

  return (
    <ChipGroup>
      {tags.map((tag) => (
        <Chip
          key={tag}
          variant="input"
          dismissible
          onDismiss={() => setTags((t) => t.filter((x) => x !== tag))}
        >
          {tag}
        </Chip>
      ))}
    </ChipGroup>
  );
}
```

### Elevated Chips

```tsx
<Chip variant="assist" elevated>
  Elevated Assist
</Chip>

<Chip variant="suggestion" elevated>
  Elevated Suggestion
</Chip>
```

### Chip Group

```tsx
<ChipGroup spacing="md" wrap>
  <Chip variant="filter" selected>Option 1</Chip>
  <Chip variant="filter">Option 2</Chip>
  <Chip variant="filter">Option 3</Chip>
</ChipGroup>
```

## Props

### Chip

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'assist' \| 'filter' \| 'input' \| 'suggestion'` | `'assist'` | The type of chip |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the chip |
| `elevated` | `boolean` | `false` | Add shadow (assist/suggestion only) |
| `leadingIcon` | `ReactNode` | - | Icon before the label |
| `trailingIcon` | `ReactNode` | - | Icon after the label |
| `selected` | `boolean` | `false` | Selection state (filter/input) |
| `onSelectedChange` | `(selected: boolean) => void` | - | Selection change callback |
| `dismissible` | `boolean` | `false` | Show dismiss button (input only) |
| `onDismiss` | `() => void` | - | Dismiss callback |
| `dismissLabel` | `string` | `'Remove'` | Aria label for dismiss button |
| `showCheckmark` | `boolean` | `true` | Show checkmark when selected |
| `asChild` | `boolean` | `false` | Render as child element |
| `disabled` | `boolean` | `false` | Disable the chip |

### ChipGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spacing` | `'sm' \| 'md' \| 'lg'` | `'md'` | Gap between chips |
| `wrap` | `boolean` | `true` | Allow wrapping to next line |

## Examples

### Email Recipients

```tsx
function EmailRecipients() {
  const [recipients, setRecipients] = useState([
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
  ]);

  return (
    <div>
      <label>To:</label>
      <ChipGroup>
        {recipients.map((r) => (
          <Chip
            key={r.id}
            variant="input"
            dismissible
            onDismiss={() => setRecipients((prev) => prev.filter((x) => x.id !== r.id))}
            leadingIcon={<Mail />}
          >
            {r.name}
          </Chip>
        ))}
      </ChipGroup>
    </div>
  );
}
```

### Product Filters

```tsx
function ProductFilters() {
  const [filters, setFilters] = useState({
    inStock: true,
    onSale: false,
  });

  return (
    <ChipGroup>
      <Chip
        variant="filter"
        selected={filters.inStock}
        onSelectedChange={(v) => setFilters((f) => ({ ...f, inStock: v }))}
      >
        In Stock
      </Chip>
      <Chip
        variant="filter"
        selected={filters.onSale}
        onSelectedChange={(v) => setFilters((f) => ({ ...f, onSale: v }))}
      >
        On Sale
      </Chip>
    </ChipGroup>
  );
}
```

### AI Suggestions

```tsx
<ChipGroup>
  <Chip variant="suggestion" leadingIcon={<Sparkles />}>
    Summarize
  </Chip>
  <Chip variant="suggestion" leadingIcon={<Edit />}>
    Improve
  </Chip>
  <Chip variant="suggestion" leadingIcon={<Zap />}>
    Shorten
  </Chip>
</ChipGroup>
```

## Accessibility

- Uses semantic button element
- Filter chips use `role="checkbox"` with `aria-checked`
- Dismiss buttons have `aria-label`
- Full keyboard navigation:
  - **Tab**: Navigate between chips
  - **Enter/Space**: Activate chip
  - **Enter/Space** on dismiss button: Remove chip
- Visible focus indicators

## Dependencies

- `@radix-ui/react-slot` - Polymorphic component support
- `lucide-react` - X and Check icons
