# MultiSelect Component
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Overview

A premium multi-selection component that enables users to select multiple items from a dropdown with tag-based display, search filtering, virtualization for large datasets, infinite scroll for async loading, and nested grouping support.

## Props Interface Summary

### MultiSelectOption&lt;T&gt;

| Prop          | Type             | Default     | Description                              |
| ------------- | ---------------- | ----------- | ---------------------------------------- |
| `value`       | `T`              | -           | Unique value for the option              |
| `label`       | `string`         | -           | Display label for the option             |
| `disabled`    | `boolean`        | `false`     | Whether the option is disabled           |
| `icon`        | `React.ReactNode`| `undefined` | Optional icon to display                 |
| `description` | `string`         | `undefined` | Optional description/secondary text      |
| `group`       | `string`         | `undefined` | Group name this option belongs to        |
| `subgroup`    | `string`         | `undefined` | Subgroup name within the group           |

### MultiSelectProps&lt;T&gt;

| Prop                | Type                                                | Default        | Description                                      |
| ------------------- | --------------------------------------------------- | -------------- | ------------------------------------------------ |
| `options`           | `MultiSelectOption<T>[]`                            | -              | Array of options to display                      |
| `value`             | `T[]`                                               | `undefined`    | Currently selected values (controlled)           |
| `defaultValue`      | `T[]`                                               | `[]`           | Default selected values (uncontrolled)           |
| `onValueChange`     | `(values: T[]) => void`                             | `undefined`    | Callback when values change                      |
| `onOpenChange`      | `(open: boolean) => void`                           | `undefined`    | Callback when open state changes                 |
| `placeholder`       | `string`                                            | `"Select..."`  | Placeholder text when no items selected          |
| `searchPlaceholder` | `string`                                            | `"Search..."`  | Placeholder text for search input                |
| `disabled`          | `boolean`                                           | `false`        | Whether the multi-select is disabled             |
| `invalid`           | `boolean`                                           | `false`        | Whether to show error/invalid state              |
| `error`             | `string`                                            | `undefined`    | Error message to display                         |
| `showSelectAll`     | `boolean`                                           | `false`        | Whether to show "Select All" option              |
| `selectAllLabel`    | `string`                                            | `"Select all"` | Label for select all checkbox                    |
| `showSelectedIcon`  | `boolean`                                           | `true`         | Whether to show checkmark icon for selected items|
| `maxVisibleTags`    | `number`                                            | `10`           | Maximum number of visible tags before count      |
| `filterOption`      | `(option: MultiSelectOption<T>, search: string) => boolean` | Default filter | Custom filter function                  |
| `isLoading`         | `boolean`                                           | `false`        | Whether data is loading                          |
| `loadMore`          | `() => Promise<void>`                               | `undefined`    | Callback to load more items (infinite scroll)    |
| `hasMore`           | `boolean`                                           | `false`        | Whether there are more items to load             |
| `customRenderer`    | `(option: MultiSelectOption<T>, isSelected: boolean) => React.ReactNode` | `undefined` | Custom renderer for option items |
| `name`              | `string`                                            | `undefined`    | Name for form submission                         |
| `size`              | `"xs" \| "sm" \| "md" \| "lg" \| "xl"`              | `"md"`         | Size of the multi-select                         |
| `variant`           | `"default" \| "outlined" \| "filled"`               | `"default"`    | Visual variant of the trigger                    |
| `virtualize`        | `boolean`                                           | Auto (>50)     | Whether to enable virtualization                 |
| `dropdownWidth`     | `string \| number`                                  | Trigger width  | Width of the dropdown                            |
| `triggerClassName`  | `string`                                            | `undefined`    | Additional class for the trigger                 |
| `contentClassName`  | `string`                                            | `undefined`    | Additional class for the content/dropdown        |

## Dependencies

- `@radix-ui/react-popover` - For dropdown positioning and focus trap
- `@tanstack/react-virtual` - For virtualization of large lists
- `lucide-react` - For icons (Check, ChevronDown, X, Search)
- `class-variance-authority` - For CVA variant management
- Internal: `Chip` component for tag display
- Internal: `Checkbox` component for select all
- Internal: `Spinner` component for loading states

## Styling Decisions

### CVA Variants

- **Size variants**: xs (24px), sm (32px), md (40px), lg (48px), xl (56px) - aligned with form inputs
- **Visual variants**: default (transparent background), outlined (primary border), filled (muted background)
- Material Design 3 motion tokens for animations (150ms open, 100ms close)

### Key Styling Patterns

1. **Trigger**: Uses border-2 for emphasis, rounded-[var(--radius)] for consistency
2. **Tags**: Uses existing Chip component with `variant="input"` for dismissible tags
3. **Dropdown**: Shadow-lg elevation, backdrop-blur-sm for glassmorphism effect
4. **Items**: Hover state uses bg-accent/50, selected uses bg-primary/10

### Animation Tokens

- Dropdown open: 150ms, cubic-bezier(0.4, 0, 0.2, 1)
- Dropdown close: 100ms, same easing
- Item hover: 150ms ease-in
- Focus ring: 200ms ease-out

## Maintenance Notes

### Performance Thresholds

- **Virtualization**: Auto-enabled when options > 50 items
- **Debounce**: Search input debounced internally (onChange fires immediately but filter is memoized)
- **Infinite scroll**: IntersectionObserver with 100px rootMargin for pre-loading
- **Tag limit**: Default 10 tags before switching to summary display

### Group Nesting

- Maximum 3 levels of nesting supported (group -> subgroup)
- Progressive indentation: pl-4 per depth level
- Each level has aria-labelledby for accessibility

### Accessibility Features

- Full keyboard navigation (Arrow keys, Enter, Space, Escape, Ctrl+A, Backspace)
- ARIA attributes: role="combobox", aria-expanded, aria-haspopup="listbox", aria-multiselectable
- Screen reader announcements via aria-live regions
- Focus management on open/close

### Known Edge Cases

1. **Generic types**: Component supports generic T for option values. When using non-primitive types, ensure proper serialization for comparison (uses JSON.stringify internally)
2. **Virtual scroll + groups**: When virtualization is enabled, grouped options are flattened for virtual rendering
3. **Infinite scroll**: Must handle race conditions - loadMore should be debounced/throttled by consumer if needed
4. **Form submission**: Hidden input stores JSON.stringify(value) - parse on server side

### Future Improvements

- [ ] Add drag-and-drop tag reordering
- [ ] Add fuzzy search option
- [ ] Add collapsible groups
- [ ] Add keyboard shortcuts for group navigation


