import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Apple, Banana, Cherry, Grape, Users, Building, MapPin, Star } from "lucide-react";

import { MultiSelect, type MultiSelectOption } from ".";

const meta: Meta<typeof MultiSelect> = {
  title: "Inputs/MultiSelect",
  component: MultiSelect,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A multi-selection component with tag display, search filtering, virtualization, infinite scroll, and nested grouping support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of the multi-select",
    },
    variant: {
      control: "select",
      options: ["default", "outlined", "filled"],
      description: "Visual variant of the trigger",
    },
    disabled: {
      control: "boolean",
      description: "Whether the multi-select is disabled",
    },
    invalid: {
      control: "boolean",
      description: "Whether to show error styling",
    },
    showSelectAll: {
      control: "boolean",
      description: "Whether to show 'Select All' option",
    },
    showSelectedIcon: {
      control: "boolean",
      description: "Whether to show checkmark icon for selected items",
    },
    maxVisibleTags: {
      control: "number",
      description: "Maximum number of visible tags before showing count",
    },
    chipVariant: {
      control: "select",
      options: ["assist", "filter", "input", "suggestion"],
      description: "Chip variant used for selected values in the trigger",
    },
    chipColor: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "destructive"],
      description: "Semantic chip color used for selected values in the trigger",
    },
  },
  decorators: [
    (Story) => (
      <div className="min-w-[400px] p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

// ============================================================================
// Sample Data
// ============================================================================

const fruitOptions: MultiSelectOption[] = [
  { value: "apple", label: "Apple", icon: <Apple className="size-4" /> },
  { value: "banana", label: "Banana", icon: <Banana className="size-4" /> },
  { value: "cherry", label: "Cherry", icon: <Cherry className="size-4" /> },
  { value: "grape", label: "Grape", icon: <Grape className="size-4" /> },
  { value: "lemon", label: "Lemon", icon: <Star className="size-4" /> },
  { value: "orange", label: "Orange" },
  { value: "peach", label: "Peach" },
  { value: "pear", label: "Pear" },
  { value: "plum", label: "Plum" },
  { value: "strawberry", label: "Strawberry" },
];

const countryOptions: MultiSelectOption[] = [
  { value: "us", label: "United States", description: "North America" },
  { value: "uk", label: "United Kingdom", description: "Europe" },
  { value: "de", label: "Germany", description: "Europe" },
  { value: "fr", label: "France", description: "Europe" },
  { value: "jp", label: "Japan", description: "Asia" },
  { value: "au", label: "Australia", description: "Oceania" },
  { value: "ca", label: "Canada", description: "North America" },
  { value: "br", label: "Brazil", description: "South America" },
  { value: "in", label: "India", description: "Asia" },
  { value: "cn", label: "China", description: "Asia" },
];

const groupedOptions: MultiSelectOption[] = [
  // Fruits
  { value: "apple", label: "Apple", group: "Fruits" },
  { value: "banana", label: "Banana", group: "Fruits" },
  { value: "cherry", label: "Cherry", group: "Fruits" },
  { value: "grape", label: "Grape", group: "Fruits" },
  // Vegetables
  { value: "carrot", label: "Carrot", group: "Vegetables" },
  { value: "broccoli", label: "Broccoli", group: "Vegetables" },
  { value: "spinach", label: "Spinach", group: "Vegetables" },
  // Dairy
  { value: "milk", label: "Milk", group: "Dairy" },
  { value: "cheese", label: "Cheese", group: "Dairy" },
  { value: "yogurt", label: "Yogurt", group: "Dairy" },
];

const nestedGroupOptions: MultiSelectOption[] = [
  // Americas > North America
  { value: "us", label: "United States", group: "Americas", subgroup: "North America" },
  { value: "ca", label: "Canada", group: "Americas", subgroup: "North America" },
  { value: "mx", label: "Mexico", group: "Americas", subgroup: "North America" },
  // Americas > South America
  { value: "br", label: "Brazil", group: "Americas", subgroup: "South America" },
  { value: "ar", label: "Argentina", group: "Americas", subgroup: "South America" },
  { value: "cl", label: "Chile", group: "Americas", subgroup: "South America" },
  // Europe > Western Europe
  { value: "uk", label: "United Kingdom", group: "Europe", subgroup: "Western Europe" },
  { value: "fr", label: "France", group: "Europe", subgroup: "Western Europe" },
  { value: "de", label: "Germany", group: "Europe", subgroup: "Western Europe" },
  // Europe > Eastern Europe
  { value: "pl", label: "Poland", group: "Europe", subgroup: "Eastern Europe" },
  { value: "cz", label: "Czech Republic", group: "Europe", subgroup: "Eastern Europe" },
  // Asia
  { value: "jp", label: "Japan", group: "Asia" },
  { value: "cn", label: "China", group: "Asia" },
  { value: "in", label: "India", group: "Asia" },
];

const disabledOptions: MultiSelectOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2", disabled: true },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4", disabled: true },
  { value: "option5", label: "Option 5" },
];

// Generate large dataset for virtualization testing
const generateLargeDataset = (count: number): MultiSelectOption[] => {
  return Array.from({ length: count }, (_, i) => ({
    value: `item-${i + 1}`,
    label: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
  }));
};

// ============================================================================
// Stories
// ============================================================================

/**
 * Basic multi-select with simple options
 */
export const Default: Story = {
  args: {
    options: fruitOptions,
    placeholder: "Select fruits...",
  },
};

/**
 * With pre-selected values
 */
export const WithDefaultValues: Story = {
  args: {
    options: fruitOptions,
    defaultValue: ["apple", "banana", "cherry"],
    placeholder: "Select fruits...",
  },
};

/**
 * Controlled component
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>(["apple", "banana"]);
    return (
      <div className="space-y-4">
        <MultiSelect
          options={fruitOptions}
          value={value}
          onValueChange={setValue}
          placeholder="Select fruits..."
        />
        <p className="text-sm text-muted-foreground">
          Selected: {value.join(", ") || "None"}
        </p>
        <button
          onClick={() => setValue([])}
          className="text-sm text-primary hover:underline"
        >
          Clear all
        </button>
      </div>
    );
  },
};

/**
 * With descriptions on options
 */
export const WithDescriptions: Story = {
  args: {
    options: countryOptions,
    placeholder: "Select countries...",
  },
};

/**
 * Size variants
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <MultiSelect
          key={size}
          size={size}
          options={fruitOptions.slice(0, 5)}
          placeholder={`Size: ${size}`}
        />
      ))}
    </div>
  ),
};

/**
 * Visual variants
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      {(["default", "outlined", "filled"] as const).map((variant) => (
        <MultiSelect
          key={variant}
          variant={variant}
          options={fruitOptions.slice(0, 5)}
          placeholder={`Variant: ${variant}`}
          defaultValue={["apple"]}
        />
      ))}
    </div>
  ),
};

/**
 * Chip variant styles for selected values
 */
export const ChipVariants: Story = {
  render: () => (
    <div className="space-y-4">
      {(["assist", "filter", "input", "suggestion"] as const).map((chipVariant) => (
        <MultiSelect
          key={chipVariant}
          options={fruitOptions.slice(0, 5)}
          defaultValue={["apple", "banana"]}
          placeholder={`Chip variant: ${chipVariant}`}
          chipVariant={chipVariant}
        />
      ))}
    </div>
  ),
};

/**
 * Semantic chip colors for selected values
 */
export const ChipColors: Story = {
  render: () => (
    <div className="space-y-4">
      {(["default", "primary", "secondary", "success", "warning", "destructive"] as const).map((chipColor) => (
        <MultiSelect
          key={chipColor}
          options={fruitOptions.slice(0, 5)}
          defaultValue={["apple", "banana"]}
          placeholder={`Chip color: ${chipColor}`}
          chipColor={chipColor}
        />
      ))}
    </div>
  ),
};

/**
 * With Select All option
 */
export const WithSelectAll: Story = {
  args: {
    options: fruitOptions,
    placeholder: "Select fruits...",
    showSelectAll: true,
    selectAllLabel: "Select all fruits",
  },
};

/**
 * Grouped options
 */
export const GroupedOptions: Story = {
  args: {
    options: groupedOptions,
    placeholder: "Select items...",
    showSelectAll: true,
  },
};

/**
 * Nested groups (subgroups)
 */
export const NestedGroups: Story = {
  args: {
    options: nestedGroupOptions,
    placeholder: "Select countries...",
    showSelectAll: true,
  },
};

/**
 * Without selected icon (uses highlight only)
 */
export const WithoutSelectedIcon: Story = {
  args: {
    options: fruitOptions,
    placeholder: "Select fruits...",
    showSelectedIcon: false,
    defaultValue: ["apple", "banana"],
  },
};

/**
 * With disabled options
 */
export const WithDisabledOptions: Story = {
  args: {
    options: disabledOptions,
    placeholder: "Select options...",
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    options: fruitOptions,
    placeholder: "Select fruits...",
    defaultValue: ["apple", "banana"],
    disabled: true,
  },
};

/**
 * Error/Invalid state
 */
export const Invalid: Story = {
  args: {
    options: fruitOptions,
    placeholder: "Select fruits...",
    invalid: true,
    error: "Please select at least one fruit",
  },
};

/**
 * Max visible tags (overflow behavior)
 */
export const MaxVisibleTags: Story = {
  args: {
    options: fruitOptions,
    placeholder: "Select fruits...",
    defaultValue: fruitOptions.map((o) => o.value),
    maxVisibleTags: 3,
  },
};

/**
 * Virtualization for large lists (100+ items)
 */
export const Virtualization: Story = {
  args: {
    options: generateLargeDataset(500),
    placeholder: "Select from 500 items...",
    showSelectAll: true,
  },
};

/**
 * Async loading with infinite scroll
 */
export const InfiniteScroll: Story = {
  render: () => {
    const [options, setOptions] = React.useState<MultiSelectOption[]>(
      generateLargeDataset(20)
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);

    const loadMore = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newItems = generateLargeDataset(20).map((item) => ({
        ...item,
        value: `${item.value}-${options.length}`,
        label: `Item ${options.length + parseInt(item.value.split("-")[1])}`,
      }));
      setOptions((prev) => [...prev, ...newItems]);
      setIsLoading(false);
      // Stop after 100 items
      if (options.length >= 80) {
        setHasMore(false);
      }
    };

    return (
      <div className="space-y-4">
        <MultiSelect
          options={options}
          placeholder="Scroll to load more..."
          isLoading={isLoading}
          loadMore={loadMore}
          hasMore={hasMore}
        />
        <p className="text-sm text-muted-foreground">
          Loaded {options.length} items. {hasMore ? "Scroll for more." : "All loaded."}
        </p>
      </div>
    );
  },
};

/**
 * Custom filter function
 */
export const CustomFilter: Story = {
  render: () => {
    // Custom filter that only searches by label start
    const customFilter = (option: MultiSelectOption, search: string) => {
      return option.label.toLowerCase().startsWith(search.toLowerCase());
    };

    return (
      <div className="space-y-2">
        <MultiSelect
          options={fruitOptions}
          placeholder="Type to filter (starts with)..."
          filterOption={customFilter}
        />
        <p className="text-xs text-muted-foreground">
          This filter only matches options that start with your search term
        </p>
      </div>
    );
  },
};

/**
 * Custom item renderer
 */
export const CustomRenderer: Story = {
  render: () => {
    const teamOptions: MultiSelectOption[] = [
      { value: "john", label: "John Doe", description: "Engineering" },
      { value: "jane", label: "Jane Smith", description: "Design" },
      { value: "bob", label: "Bob Wilson", description: "Product" },
      { value: "alice", label: "Alice Johnson", description: "Marketing" },
    ];

    const customRenderer = (option: MultiSelectOption, isSelected: boolean) => (
      <div className="flex items-center gap-3 w-full">
        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Users className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{option.label}</div>
          <div className="text-xs text-muted-foreground">{option.description}</div>
        </div>
        {isSelected && (
          <Star className="size-4 text-yellow-500 fill-yellow-500" />
        )}
      </div>
    );

    return (
      <MultiSelect
        options={teamOptions}
        placeholder="Select team members..."
        customRenderer={customRenderer}
        showSelectedIcon={false}
      />
    );
  },
};

/**
 * Form integration example
 */
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      fruits: [] as string[],
      countries: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(JSON.stringify(formData, null, 2));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
        <div className="space-y-2">
          <label className="text-sm font-medium">Favorite Fruits</label>
          <MultiSelect
            name="fruits"
            options={fruitOptions}
            value={formData.fruits}
            onValueChange={(values) =>
              setFormData((prev) => ({ ...prev, fruits: values }))
            }
            placeholder="Select fruits..."
            showSelectAll
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Countries Visited</label>
          <MultiSelect
            name="countries"
            options={countryOptions}
            value={formData.countries}
            onValueChange={(values) =>
              setFormData((prev) => ({ ...prev, countries: values }))
            }
            placeholder="Select countries..."
            invalid={formData.countries.length === 0}
            error={formData.countries.length === 0 ? "Please select at least one country" : undefined}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Submit
        </button>
      </form>
    );
  },
};

/**
 * Keyboard navigation demo
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4">
      <MultiSelect
        options={fruitOptions}
        placeholder="Focus and use keyboard..."
        defaultValue={["apple"]}
      />
      <div className="text-sm text-muted-foreground space-y-1">
        <p><kbd className="px-1 py-0.5 bg-muted rounded text-xs">↑↓</kbd> Navigate options</p>
        <p><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> or <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Space</kbd> Select/deselect</p>
        <p><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Escape</kbd> Close dropdown</p>
        <p><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Backspace</kbd> Remove last tag</p>
        <p><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+A</kbd> Select all</p>
      </div>
    </div>
  ),
};

/**
 * With icons
 */
export const WithIcons: Story = {
  args: {
    options: [
      { value: "users", label: "Team Members", icon: <Users className="size-4" /> },
      { value: "building", label: "Departments", icon: <Building className="size-4" /> },
      { value: "location", label: "Locations", icon: <MapPin className="size-4" /> },
    ],
    placeholder: "Select categories...",
  },
};

/**
 * Accessibility compliance
 */
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4" role="region" aria-label="Multi-select accessibility demo">
      <label id="multi-select-label" className="text-sm font-medium">
        Select your favorite fruits (required)
      </label>
      <MultiSelect
        options={fruitOptions}
        placeholder="Select fruits..."
        aria-labelledby="multi-select-label"
        showSelectAll
      />
      <p id="multi-select-help" className="text-xs text-muted-foreground">
        Use arrow keys to navigate, Enter to select, Escape to close
      </p>
    </div>
  ),
};
