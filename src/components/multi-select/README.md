# MultiSelect

A premium multi-selection component that enables users to select multiple items from a dropdown list. Features include tag-based display of selections, search filtering, virtualization for large datasets, infinite scroll for async loading, and nested grouping/subgrouping support.

## Features

- ✅ **Multi-selection** with tag-based display
- ✅ **Search filtering** with customizable filter function
- ✅ **Virtualization** for large datasets (500+ items)
- ✅ **Infinite scroll** for async data loading
- ✅ **Grouped options** with nested subgroups (up to 3 levels)
- ✅ **Select All** functionality
- ✅ **Keyboard navigation** (Arrow keys, Enter, Escape, Ctrl+A, Backspace)
- ✅ **Full accessibility** compliance (ARIA, screen readers)
- ✅ **Size variants** (xs, sm, md, lg, xl)
- ✅ **Visual variants** (default, outlined, filled)
- ✅ **Custom chip styling** with configurable variants and semantic colors
- ✅ **Custom renderers** for complex option layouts
- ✅ **Form integration** with hidden input for submission

## Installation

The component is part of the `@aidan/ui` package:

```tsx
import { MultiSelect, type MultiSelectOption } from "@aidan/ui";
```

## Basic Usage

```tsx
const options: MultiSelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

function MyComponent() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <MultiSelect
      options={options}
      value={selected}
      onValueChange={setSelected}
      placeholder="Select fruits..."
    />
  );
}
```

## Examples

### With Icons and Descriptions

```tsx
const options: MultiSelectOption[] = [
  { 
    value: "us", 
    label: "United States", 
    description: "North America",
    icon: <Flag className="size-4" />
  },
  { 
    value: "uk", 
    label: "United Kingdom", 
    description: "Europe",
    icon: <Flag className="size-4" />
  },
];

<MultiSelect
  options={options}
  placeholder="Select countries..."
/>
```

### Grouped Options

```tsx
const options: MultiSelectOption[] = [
  { value: "apple", label: "Apple", group: "Fruits" },
  { value: "banana", label: "Banana", group: "Fruits" },
  { value: "carrot", label: "Carrot", group: "Vegetables" },
  { value: "broccoli", label: "Broccoli", group: "Vegetables" },
];

<MultiSelect
  options={options}
  placeholder="Select items..."
  showSelectAll
/>
```

### Nested Groups (Subgroups)

```tsx
const options: MultiSelectOption[] = [
  { value: "us", label: "United States", group: "Americas", subgroup: "North America" },
  { value: "ca", label: "Canada", group: "Americas", subgroup: "North America" },
  { value: "br", label: "Brazil", group: "Americas", subgroup: "South America" },
  { value: "uk", label: "United Kingdom", group: "Europe", subgroup: "Western Europe" },
  { value: "de", label: "Germany", group: "Europe", subgroup: "Western Europe" },
];

<MultiSelect
  options={options}
  placeholder="Select countries..."
/>
```

### Async Loading with Infinite Scroll

```tsx
function AsyncMultiSelect() {
  const [options, setOptions] = useState<MultiSelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    setIsLoading(true);
    const response = await fetchOptions(page);
    setOptions(prev => [...prev, ...response.data]);
    setHasMore(response.hasMore);
    setPage(prev => prev + 1);
    setIsLoading(false);
  };

  return (
    <MultiSelect
      options={options}
      placeholder="Select items..."
      isLoading={isLoading}
      loadMore={loadMore}
      hasMore={hasMore}
    />
  );
}
```

### Custom Filter

```tsx
// Only match options that start with the search term
const customFilter = (option: MultiSelectOption, search: string) => {
  return option.label.toLowerCase().startsWith(search.toLowerCase());
};

<MultiSelect
  options={options}
  placeholder="Type to filter..."
  filterOption={customFilter}
/>
```

### Custom Renderer

```tsx
const customRenderer = (option: MultiSelectOption, isSelected: boolean) => (
  <div className="flex items-center gap-3">
    <Avatar src={option.avatar} size="sm" />
    <div className="flex-1">
      <div className="font-medium">{option.label}</div>
      <div className="text-xs text-muted-foreground">{option.description}</div>
    </div>
    {isSelected && <CheckCircle className="size-4 text-primary" />}
  </div>
);

<MultiSelect
  options={teamMembers}
  placeholder="Select team members..."
  customRenderer={customRenderer}
  showSelectedIcon={false}
/>
```

### Custom Chip Styling

```tsx
<MultiSelect
  options={fruitOptions}
  defaultValue={["apple", "banana"]}
  chipVariant="suggestion"
  chipColor="success"
/>
```

### Form Integration

```tsx
<form onSubmit={handleSubmit}>
  <MultiSelect
    name="fruits"
    options={fruitOptions}
    value={formData.fruits}
    onValueChange={(values) => setFormData({ ...formData, fruits: values })}
    invalid={errors.fruits}
    error={errors.fruits?.message}
  />
  <button type="submit">Submit</button>
</form>
```

### Validation States

```tsx
// Error state
<MultiSelect
  options={options}
  invalid
  error="Please select at least one option"
/>

// Disabled state
<MultiSelect
  options={options}
  disabled
/>
```

## API Reference

### MultiSelectOption&lt;T&gt;

| Prop          | Type              | Required | Description                         |
| ------------- | ----------------- | -------- | ----------------------------------- |
| `value`       | `T`               | Yes      | Unique value for the option         |
| `label`       | `string`          | Yes      | Display label                       |
| `disabled`    | `boolean`         | No       | Disable this option                 |
| `icon`        | `React.ReactNode` | No       | Icon to display                     |
| `description` | `string`          | No       | Secondary text                      |
| `group`       | `string`          | No       | Group name                          |
| `subgroup`    | `string`          | No       | Subgroup within group               |

### MultiSelectProps&lt;T&gt;

| Prop                | Type                                                    | Default       | Description                          |
| ------------------- | ------------------------------------------------------- | ------------- | ------------------------------------ |
| `options`           | `MultiSelectOption<T>[]`                                | Required      | Options to display                   |
| `value`             | `T[]`                                                   | -             | Controlled selected values           |
| `defaultValue`      | `T[]`                                                   | `[]`          | Default selected values              |
| `onValueChange`     | `(values: T[]) => void`                                 | -             | Selection change callback            |
| `onOpenChange`      | `(open: boolean) => void`                               | -             | Open state change callback           |
| `placeholder`       | `string`                                                | `"Select..."` | Placeholder text                     |
| `searchPlaceholder` | `string`                                                | `"Search..."` | Search input placeholder             |
| `disabled`          | `boolean`                                               | `false`       | Disable the component                |
| `invalid`           | `boolean`                                               | `false`       | Show error state                     |
| `error`             | `string`                                                | -             | Error message                        |
| `showSelectAll`     | `boolean`                                               | `false`       | Show select all checkbox             |
| `selectAllLabel`    | `string`                                                | `"Select all"`| Label for select all                 |
| `showSelectedIcon`  | `boolean`                                               | `true`        | Show checkmark for selected items    |
| `maxVisibleTags`    | `number`                                                | `10`          | Max tags before showing count        |
| `chipVariant`       | `"assist" \| "filter" \| "input" \| "suggestion"` | `"input"` | Variant used for selected chips in the trigger |
| `chipColor`         | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "destructive"` | `"default"` | Semantic color for selected chips in the trigger |
| `filterOption`      | `(option, search) => boolean`                           | Default       | Custom filter function               |
| `isLoading`         | `boolean`                                               | `false`       | Loading state                        |
| `loadMore`          | `() => Promise<void>`                                   | -             | Infinite scroll callback             |
| `hasMore`           | `boolean`                                               | `false`       | Has more items to load               |
| `customRenderer`    | `(option, isSelected) => ReactNode`                     | -             | Custom item renderer                 |
| `name`              | `string`                                                | -             | Form field name                      |
| `size`              | `"xs" \| "sm" \| "md" \| "lg" \| "xl"`                  | `"md"`        | Component size                       |
| `variant`           | `"default" \| "outlined" \| "filled"`                   | `"default"`   | Visual variant                       |
| `virtualize`        | `boolean`                                               | Auto          | Enable virtualization                |
| `dropdownWidth`     | `string \| number`                                      | Trigger width | Dropdown width                       |
| `triggerClassName`  | `string`                                                | -             | Trigger additional classes           |
| `contentClassName`  | `string`                                                | -             | Dropdown additional classes          |

## Keyboard Shortcuts

| Key           | Action                              |
| ------------- | ----------------------------------- |
| `↑` `↓`       | Navigate options                    |
| `Enter`       | Open dropdown / Select option       |
| `Space`       | Select option                       |
| `Escape`      | Close dropdown                      |
| `Backspace`   | Remove last selected tag            |
| `Ctrl+A`      | Select all visible options          |

## Accessibility

The MultiSelect component follows WAI-ARIA guidelines:

- `role="combobox"` on trigger
- `aria-expanded` indicates open state
- `aria-haspopup="listbox"` indicates dropdown type
- `aria-multiselectable="true"` indicates multi-selection
- `role="option"` on each item
- `aria-selected` indicates selection state
- `aria-invalid` for error states
- `aria-errormessage` links to error message
- Focus management on open/close
- Screen reader announcements for selections

## Performance

### Virtualization

Virtualization is automatically enabled when the options list exceeds 50 items. For large datasets (500+ items), the component renders only visible items using `@tanstack/react-virtual`.

```tsx
// Virtualization is automatic, but can be forced
<MultiSelect
  options={largeDataset}
  virtualize={true}
/>
```

### Memoization

The component uses `useMemo` and `useCallback` for:
- Filtered options computation
- Selection state checks
- Event handlers

### Tips for Optimal Performance

1. **Avoid creating new option arrays on each render**:
   ```tsx
   // ❌ Bad - creates new array on each render
   <MultiSelect options={data.map(item => ({ value: item.id, label: item.name }))} />
   
   // ✅ Good - memoize the options
   const options = useMemo(() => data.map(item => ({ value: item.id, label: item.name })), [data]);
   <MultiSelect options={options} />
   ```

2. **Memoize custom renderers**:
   ```tsx
   const customRenderer = useCallback((option, isSelected) => (
     <CustomOption option={option} selected={isSelected} />
   ), []);
   ```

3. **Debounce loadMore if needed**:
   ```tsx
   const loadMore = useDebouncedCallback(fetchMoreOptions, 300);
   ```

## Related Components

- [Select](../select) - Single selection dropdown
- [ComboBox](../combobox) - Searchable single selection
- [Chip](../chip) - Tag/chip display component
- [Checkbox](../checkbox) - Used for select all

