import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ComboBox,
  OutlinedComboBox,
  ComboBoxField,
  ComboBoxLabel,
  ComboBoxDescription,
  type ComboBoxOption,
} from "./index";
import { 
  Apple, 
  Banana, 
  Cherry, 
  Grape, 
  Citrus,
  User,
  Building2,
  Globe,
} from "lucide-react";

/**
 * ComboBox is a searchable select component using the Catalyst/Headless UI pattern.
 *
 * **Key difference from traditional selects:** The input IS the trigger - you type
 * directly in it to filter options. When you select an option, its display value
 * shows in the input.
 *
 * ## Features
 * - Type directly in the input to filter options
 * - MD3 outlined variant with floating label
 * - Virtual scrolling for large datasets
 * - Error and disabled states
 * - Clearable selection
 * - Animated chevron support
 *
 * ## Usage
 *
 * ```tsx
 * import { ComboBox, OutlinedComboBox } from "@agentix/ui";
 *
 * // Basic usage
 * <ComboBox
 *   options={[
 *     { value: "apple", label: "Apple" },
 *     { value: "banana", label: "Banana" },
 *   ]}
 *   placeholder="Select fruit..."
 *   onChange={(value) => console.log(value)}
 * />
 *
 * // MD3 Outlined variant
 * <OutlinedComboBox
 *   label="Country"
 *   options={countries}
 *   onChange={setCountry}
 * />
 * ```
 */
const meta: Meta<typeof ComboBox> = {
  title: "Premium/ComboBox",
  component: ComboBox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size variant of the combobox",
    },
    disabled: {
      control: "boolean",
      description: "Whether the combobox is disabled",
    },
    invalid: {
      control: "boolean",
      description: "Whether to show error state",
    },
    clearable: {
      control: "boolean",
      description: "Whether selection can be cleared",
    },
    immediate: {
      control: "boolean",
      description: "Open dropdown immediately on focus",
    },
    useAnimatedChevron: {
      control: "boolean",
      description: "Use animated chevron",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

// Sample data
const fruits: ComboBoxOption[] = [
  { value: "apple", label: "Apple", icon: <Apple className="size-4" /> },
  { value: "banana", label: "Banana", icon: <Banana className="size-4" /> },
  { value: "cherry", label: "Cherry", icon: <Cherry className="size-4" /> },
  { value: "grape", label: "Grape", icon: <Grape className="size-4" /> },
  { value: "orange", label: "Orange", icon: <Citrus className="size-4" /> },
  { value: "mango", label: "Mango" },
  { value: "pineapple", label: "Pineapple" },
  { value: "strawberry", label: "Strawberry" },
  { value: "blueberry", label: "Blueberry" },
  { value: "raspberry", label: "Raspberry" },
];

const countries: ComboBoxOption[] = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "cn", label: "China" },
  { value: "in", label: "India" },
  { value: "br", label: "Brazil" },
];

const users: ComboBoxOption[] = [
  { value: "1", label: "Tom Cook", description: "Engineering", icon: <User className="size-4" /> },
  { value: "2", label: "Wade Cooper", description: "Design", icon: <User className="size-4" /> },
  { value: "3", label: "Tanya Fox", description: "Marketing", icon: <User className="size-4" /> },
  { value: "4", label: "Devon Webb", description: "Sales", icon: <User className="size-4" /> },
  { value: "5", label: "Arlene Mccoy", description: "Engineering", icon: <User className="size-4" /> },
];

// Generate large dataset for virtualization demo
const generateLargeDataset = (count: number): ComboBoxOption[] => {
  return Array.from({ length: count }, (_, i) => ({
    value: `item-${i}`,
    label: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
  }));
};

const largeDataset = generateLargeDataset(1000);

// ============================================================================
// Basic Stories
// ============================================================================

/**
 * Default combobox with basic functionality.
 * Type in the input to filter the options.
 */
export const Default: Story = {
  args: {
    options: fruits,
    placeholder: "Select a fruit...",
  },
  render: function Render(args) {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="w-[280px]">
        <ComboBox
          {...args}
          value={value}
          onChange={setValue}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Selected: {value || "None"}
        </p>
      </div>
    );
  },
};

/**
 * Combobox with icons for each option
 */
export const WithIcons: Story = {
  args: {
    options: fruits,
    placeholder: "Select a fruit...",
  },
  render: function Render(args) {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="w-[280px]">
        <ComboBox
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

/**
 * Combobox with description text for each option
 */
export const WithDescriptions: Story = {
  args: {
    options: users,
    placeholder: "Assign to...",
  },
  render: function Render(args) {
    const [value, setValue] = React.useState<string | null>("1");
    return (
      <div className="w-[280px]">
        <ComboBox
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

/**
 * Combobox with animated chevron indicator
 */
export const WithAnimatedChevron: Story = {
  args: {
    options: fruits,
    placeholder: "Select a fruit...",
    useAnimatedChevron: true,
    chevronAnimation: "smooth",
  },
  render: function Render(args) {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="w-[280px]">
        <ComboBox
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

/**
 * Opens dropdown immediately when focused
 */
export const ImmediateOpen: Story = {
  args: {
    options: fruits,
    placeholder: "Click to see options immediately...",
    immediate: true,
  },
  render: function Render(args) {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="w-[280px]">
        <ComboBox
          {...args}
          value={value}
          onChange={setValue}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Focus the input to see options immediately
        </p>
      </div>
    );
  },
};

// ============================================================================
// Size Variants
// ============================================================================

/**
 * All size variants displayed together
 */
export const Sizes: Story = {
  render: function Render() {
    const [values, setValues] = React.useState<Record<string, string | null>>({});
    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

    return (
      <div className="flex flex-col gap-4 w-[320px]">
        {sizes.map((size) => (
          <div key={size} className="flex items-center gap-4">
            <span className="w-8 text-sm font-medium text-muted-foreground">
              {size}
            </span>
            <ComboBox
              options={fruits}
              placeholder={`Size ${size}...`}
              size={size}
              value={values[size] ?? null}
              onChange={(v) => setValues((prev) => ({ ...prev, [size]: v }))}
              className="flex-1"
            />
          </div>
        ))}
      </div>
    );
  },
};

// ============================================================================
// States
// ============================================================================

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    options: fruits,
    placeholder: "Select a fruit...",
    disabled: true,
  },
  render: function Render(args) {
    return (
      <div className="w-[280px]">
        <ComboBox {...args} value="apple" />
      </div>
    );
  },
};

/**
 * Error/invalid state
 */
export const Invalid: Story = {
  args: {
    options: fruits,
    placeholder: "Select a fruit...",
    invalid: true,
  },
  render: function Render(args) {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="w-[280px]">
        <ComboBox
          {...args}
          value={value}
          onChange={setValue}
        />
        <p className="mt-2 text-sm text-destructive">
          Please select a valid option
        </p>
      </div>
    );
  },
};

/**
 * Non-clearable selection
 */
export const NotClearable: Story = {
  args: {
    options: fruits,
    placeholder: "Select a fruit...",
    clearable: false,
  },
  render: function Render(args) {
    const [value, setValue] = React.useState<string | null>("apple");
    return (
      <div className="w-[280px]">
        <ComboBox
          {...args}
          value={value}
          onChange={setValue}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          No clear button shown
        </p>
      </div>
    );
  },
};

// ============================================================================
// MD3 Outlined Variant
// ============================================================================

/**
 * MD3 Outlined variant with floating label
 */
export const Outlined: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="w-[280px]">
        <OutlinedComboBox
          label="Country"
          options={countries}
          value={value}
          onChange={setValue}
          placeholder="Type to search..."
        />
      </div>
    );
  },
};

/**
 * MD3 Outlined variant - all sizes
 */
export const OutlinedSizes: Story = {
  render: function Render() {
    const [values, setValues] = React.useState<Record<string, string | null>>({});
    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

    return (
      <div className="flex flex-col gap-6 w-[320px]">
        {sizes.map((size) => (
          <OutlinedComboBox
            key={size}
            label={`Size ${size.toUpperCase()}`}
            options={countries}
            size={size}
            value={values[size] ?? null}
            onChange={(v) => setValues((prev) => ({ ...prev, [size]: v }))}
          />
        ))}
      </div>
    );
  },
};

/**
 * MD3 Outlined with required indicator
 */
export const OutlinedRequired: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="w-[280px]">
        <OutlinedComboBox
          label="Country"
          options={countries}
          value={value}
          onChange={setValue}
          required
        />
      </div>
    );
  },
};

/**
 * MD3 Outlined with error state
 */
export const OutlinedInvalid: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="w-[280px]">
        <OutlinedComboBox
          label="Country"
          options={countries}
          value={value}
          onChange={setValue}
          invalid
          required
        />
        <p className="mt-2 text-sm text-destructive">
          This field is required
        </p>
      </div>
    );
  },
};

// ============================================================================
// With Field Component (Headless UI Pattern)
// ============================================================================

/**
 * Using Field component for proper label association
 */
export const WithFieldLabel: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="w-[280px]">
        <ComboBoxField>
          <ComboBoxLabel>Assigned to</ComboBoxLabel>
          <ComboBox
            options={users}
            value={value}
            onChange={setValue}
            placeholder="Select user..."
          />
        </ComboBoxField>
      </div>
    );
  },
};

/**
 * Using Field component with description
 */
export const WithFieldDescription: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="w-[280px]">
        <ComboBoxField>
          <ComboBoxLabel>Assigned to</ComboBoxLabel>
          <ComboBoxDescription>
            This user will have full access to the project.
          </ComboBoxDescription>
          <ComboBox
            options={users}
            value={value}
            onChange={setValue}
            placeholder="Select user..."
            className="mt-2"
          />
        </ComboBoxField>
      </div>
    );
  },
};

// ============================================================================
// Virtual Scrolling
// ============================================================================

/**
 * Virtual scrolling for large datasets (1,000 items)
 */
export const VirtualScrolling: Story = {
  args: {
    options: largeDataset,
    placeholder: "Search 1,000 items...",
    virtual: true,
  },
  render: function Render(args) {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="w-[280px]">
        <ComboBox
          {...args}
          value={value}
          onChange={setValue}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          {largeDataset.length.toLocaleString()} items in list (virtualized)
        </p>
      </div>
    );
  },
};

/**
 * Outlined variant with virtual scrolling
 */
export const OutlinedVirtualized: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div className="w-[280px]">
        <OutlinedComboBox
          label="Large Dataset"
          options={largeDataset}
          value={value}
          onChange={setValue}
          virtual
        />
        <p className="mt-4 text-sm text-muted-foreground">
          {largeDataset.length.toLocaleString()} items (virtualized)
        </p>
      </div>
    );
  },
};

// ============================================================================
// Custom Filtering
// ============================================================================

/**
 * Custom filter function
 */
export const CustomFilter: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string | null>(null);

    // Custom filter that only matches from the start
    const startsWithFilter = (option: ComboBoxOption, query: string) => {
      return option.label.toLowerCase().startsWith(query.toLowerCase());
    };

    return (
      <div className="w-[280px]">
        <ComboBox
          options={countries}
          value={value}
          onChange={setValue}
          placeholder="Search countries..."
          filter={startsWithFilter}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Only matches from the start of the label
        </p>
      </div>
    );
  },
};

// ============================================================================
// Form Integration
// ============================================================================

/**
 * Example form with multiple comboboxes
 */
export const FormExample: Story = {
  render: function Render() {
    const [formData, setFormData] = React.useState({
      name: "",
      country: null as string | null,
      fruit: null as string | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted:", formData);
      alert(JSON.stringify(formData, null, 2));
    };

    return (
      <form onSubmit={handleSubmit} className="w-[320px] space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            className="w-full h-10 px-3 border rounded-md"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <OutlinedComboBox
          label="Country"
          options={countries}
          value={formData.country}
          onChange={(v) =>
            setFormData((prev) => ({ ...prev, country: v }))
          }
          required
        />

        <OutlinedComboBox
          label="Favorite Fruit"
          options={fruits}
          value={formData.fruit}
          onChange={(v) =>
            setFormData((prev) => ({ ...prev, fruit: v }))
          }
        />

        <button
          type="submit"
          className="w-full h-10 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Submit
        </button>
      </form>
    );
  },
};

// ============================================================================
// Comparison
// ============================================================================

/**
 * Side-by-side comparison of standard vs outlined
 */
export const Comparison: Story = {
  render: function Render() {
    const [standard, setStandard] = React.useState<string | null>(null);
    const [outlined, setOutlined] = React.useState<string | null>(null);

    return (
      <div className="flex gap-8">
        <div className="w-[240px]">
          <h3 className="text-sm font-medium mb-3">Standard</h3>
          <ComboBox
            options={countries}
            value={standard}
            onChange={setStandard}
            placeholder="Select country..."
          />
        </div>
        <div className="w-[240px]">
          <h3 className="text-sm font-medium mb-3">Outlined (MD3)</h3>
          <OutlinedComboBox
            label="Country"
            options={countries}
            value={outlined}
            onChange={setOutlined}
          />
        </div>
      </div>
    );
  },
};

/**
 * Demonstrates the key difference: type directly in the input to filter
 */
export const TypeToFilter: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div className="w-[320px] space-y-4">
        <div className="p-4 bg-muted rounded-lg text-sm">
          <p className="font-medium mb-2">Catalyst-style ComboBox</p>
          <p className="text-muted-foreground">
            The input IS the trigger. Type directly in it to filter options.
            When you select an option, its label appears in the input.
          </p>
        </div>
        <ComboBox
          options={users}
          value={value}
          onChange={setValue}
          placeholder="Start typing to filter..."
        />
        <p className="text-sm text-muted-foreground">
          Try typing "Tom" or "Engineering" to filter
        </p>
      </div>
    );
  },
};
