# ComboBox Component - Agent Context
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Component Overview
ComboBox is a searchable select component using the **Catalyst/Headless UI pattern**. The key difference from traditional comboboxes: the input IS the trigger - you type directly in it to filter options. When you select an option, its display value shows in the input.

## Pattern: Catalyst-style ComboBox
- User types directly in the input to filter
- Dropdown shows filtered results
- Selected option's label appears in the input
- NO separate search input inside the dropdown

## Props Interface

### ComboBox Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `ComboBoxOption<T>[]` | required | Array of options to display |
| `value` | `T \| null` | - | Currently selected value (controlled) |
| `defaultValue` | `T \| null` | - | Default value (uncontrolled) |
| `onChange` | `(value: T \| null) => void` | - | Callback when value changes |
| `placeholder` | `string` | "Select..." | Placeholder text when input is empty |
| `disabled` | `boolean` | false | Whether the combobox is disabled |
| `invalid` | `boolean` | false | Whether to show error/invalid state |
| `clearable` | `boolean` | true | Whether to allow clearing the selection |
| `immediate` | `boolean` | false | Open dropdown immediately on focus |
| `name` | `string` | - | Name for form submission |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | "md" | Size variant |
| `filter` | `(option, query) => boolean` | - | Custom filter function |
| `useAnimatedChevron` | `boolean` | false | Use animated chevron indicator |
| `chevronAnimation` | `ChevronAnimationPreset` | "smooth" | Animation preset for chevron |
| `inputClassName` | `string` | - | Additional class for the input |
| `optionsClassName` | `string` | - | Additional class for the options dropdown |
| `virtual` | `boolean` | false | Enable virtual scrolling for large lists |
| `virtualDisabled` | `(option: T) => boolean` | - | Check if option is disabled (virtual mode) |

### OutlinedComboBox Props
Extends ComboBox props with:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Floating label text |
| `required` | `boolean` | false | Whether to show required indicator |
| `containerClassName` | `string` | - | Additional class for container |

### ComboBoxOption Interface
```typescript
interface ComboBoxOption<T = string> {
  value: T;           // Unique value
  label: string;      // Display label
  disabled?: boolean; // Whether option is disabled
  icon?: ReactNode;   // Optional icon
  description?: string; // Optional secondary text
}
```

## Dependencies
- `@headlessui/react`: Core Combobox component (Headless UI v2)
- `class-variance-authority`: CVA for variant management
- `lucide-react`: Icons (Check, ChevronDown, X)
- `AnimatedChevron`: Internal component for animated indicator

## Styling Decisions

### CVA Variants
- **comboboxInputVariants**: Input/trigger styling with size variants
- **comboboxButtonVariants**: Chevron button positioning and sizing
- **comboboxOutlinedContainerVariants**: MD3 outlined container with focus/error states
- **comboboxFloatingLabelVariants**: MD3 floating label animation
- **comboboxOptionsVariants**: Dropdown panel styling with animations
- **comboboxOptionVariants**: Option item styling with focus/selected states

### Size Scale
Matches other form components (xs, sm, md, lg, xl):
- xs: h-[1.75rem], text-xs
- sm: h-[2rem], text-sm
- md: h-[2.25rem], text-sm
- lg: h-[2.75rem], text-base
- xl: h-[3.25rem], text-lg

### Headless UI Data Attributes
Uses Headless UI v2 data attributes for styling:
- `data-[focus]`: Option is keyboard/mouse focused
- `data-[selected]`: Option matches current value
- `data-[disabled]`: Option is disabled
- `data-[closed]`: Dropdown is closing (for animation)
- `data-[invalid]`: Input is in error state

## Architecture Decisions

### Why Headless UI instead of Radix?
- Native Combobox pattern support (input IS the trigger)
- Built-in filtering integration
- Virtual scrolling support
- Consistent with Catalyst UI library
- Better TypeScript generics for typed values

### Compound Components
- **ComboBoxField**: Headless UI Field wrapper for label association
- **ComboBoxLabel**: Styled label component
- **ComboBoxDescription**: Styled description component

### Generic Value Support
Component supports generic types for values:
```tsx
<ComboBox<User>
  options={users}
  value={selectedUser}
  onChange={setSelectedUser}
/>
```

## Maintenance Notes

### Known Edge Cases
1. **Empty state**: Show helpful message when no options match
2. **Controlled vs Uncontrolled**: Support both patterns via value/defaultValue
3. **Clear on close**: Reset query when dropdown closes (via onClose)
4. **Virtual mode**: Different rendering path for large datasets

### Performance Considerations
- Virtualization recommended for 100+ items
- Memoize filter function if complex
- Use `immediate={false}` (default) to delay dropdown render

### Accessibility
- Uses Headless UI Combobox ARIA pattern
- Full keyboard navigation
- Screen reader announcements
- Proper focus management

## Related Components
- `Select`: Non-searchable select (Radix-based)
- `Input`: Text input with MD3 variants
- `AnimatedChevron`: Chevron animation


