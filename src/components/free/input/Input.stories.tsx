import type { Meta, StoryObj } from "@storybook/react";
import { Input, OutlinedInput } from "./index";

// ============================================================================
// Meta
// ============================================================================

const meta: Meta<typeof Input> = {
  title: "Free/Inputs/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["shadcn"],
      description: "Visual variant of the input",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the input",
    },
    error: {
      control: "boolean",
      description: "Whether the input is in an error state",
    },
    warning: {
      control: "boolean",
      description: "Whether the input is in a warning state",
    },
    label: {
      control: "text",
      description: "Label text for the input",
    },
    labelPosition: {
      control: "select",
      options: ["top", "left"],
      description: "Position of the label",
    },
    required: {
      control: "boolean",
      description: "Whether to show required indicator",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;
type OutlinedStory = StoryObj<typeof OutlinedInput>;

// ============================================================================
// Input (Shadcn Variant) Stories
// ============================================================================

/**
 * Default input with placeholder
 */
export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Input with label above
 */
export const WithLabel: Story = {
  args: {
    label: "Email",
    placeholder: "example@email.com",
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Input with label on the left
 */
export const WithLabelLeft: Story = {
  args: {
    label: "Username",
    labelPosition: "left",
    placeholder: "Enter username",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Required input with asterisk indicator
 */
export const Required: Story = {
  args: {
    label: "Password",
    required: true,
    type: "password",
    placeholder: "Enter password",
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Different input sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input (default)" />
      <Input size="lg" placeholder="Large input" />
    </div>
  ),
};

/**
 * Input in error state
 */
export const Error: Story = {
  args: {
    label: "Email",
    error: true,
    placeholder: "example@email.com",
    defaultValue: "invalid-email",
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Input in warning state
 */
export const Warning: Story = {
  args: {
    label: "API Key",
    warning: true,
    placeholder: "Enter API key",
    defaultValue: "sk-test-1234",
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Disabled input
 */
export const Disabled: Story = {
  args: {
    label: "Disabled Field",
    disabled: true,
    placeholder: "Cannot edit",
    defaultValue: "Disabled value",
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Different input types
 */
export const InputTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <Input label="Text" type="text" placeholder="Text input" />
      <Input label="Email" type="email" placeholder="email@example.com" />
      <Input label="Password" type="password" placeholder="Enter password" />
      <Input label="Number" type="number" placeholder="0" />
      <Input label="Search" type="search" placeholder="Search..." />
      <Input label="URL" type="url" placeholder="https://example.com" />
      <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
      <Input label="Date" type="date" />
    </div>
  ),
};

/**
 * File input
 */
export const FileInput: Story = {
  args: {
    label: "Upload File",
    type: "file",
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

// ============================================================================
// OutlinedInput (MD3 Variant) Stories
// ============================================================================

/**
 * MD3 Outlined input with floating label
 */
export const OutlinedDefault: OutlinedStory = {
  render: () => (
    <div className="w-[300px]">
      <OutlinedInput label="Email Address" />
    </div>
  ),
};

/**
 * MD3 Outlined input - label behavior demonstration
 * Shows how the label floats when focused or has value
 */
export const OutlinedLabelAnimation: OutlinedStory = {
  render: () => (
    <div className="flex flex-col gap-6 w-[300px]">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Empty - label inside input
        </p>
        <OutlinedInput label="Username" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          With value - label floats to outline
        </p>
        <OutlinedInput label="Username" defaultValue="johndoe" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Click to see animation
        </p>
        <OutlinedInput label="Click me to focus" />
      </div>
    </div>
  ),
};

/**
 * MD3 Outlined input sizes
 */
export const OutlinedSizes: OutlinedStory = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <OutlinedInput size="sm" label="Small" />
      <OutlinedInput size="md" label="Medium (default)" />
      <OutlinedInput size="lg" label="Large" />
    </div>
  ),
};

/**
 * MD3 Outlined input with required indicator
 */
export const OutlinedRequired: OutlinedStory = {
  render: () => (
    <div className="w-[300px]">
      <OutlinedInput label="Required Field" required />
    </div>
  ),
};

/**
 * MD3 Outlined input in error state
 */
export const OutlinedError: OutlinedStory = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <OutlinedInput label="Email" error />
      <OutlinedInput label="Email" error defaultValue="invalid-email" />
    </div>
  ),
};

/**
 * MD3 Outlined input in warning state
 */
export const OutlinedWarning: OutlinedStory = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <OutlinedInput label="API Key" warning />
      <OutlinedInput label="API Key" warning defaultValue="sk-test-expiring" />
    </div>
  ),
};

/**
 * MD3 Outlined input disabled
 */
export const OutlinedDisabled: OutlinedStory = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <OutlinedInput label="Disabled Empty" disabled />
      <OutlinedInput label="Disabled With Value" disabled defaultValue="Cannot edit" />
    </div>
  ),
};

/**
 * MD3 Outlined input types
 */
export const OutlinedInputTypes: OutlinedStory = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <OutlinedInput label="Text" type="text" />
      <OutlinedInput label="Email" type="email" />
      <OutlinedInput label="Password" type="password" />
      <OutlinedInput label="Number" type="number" />
      <OutlinedInput label="Search" type="search" />
    </div>
  ),
};

/**
 * Comparison of both variants side by side
 */
export const VariantComparison: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="flex flex-col gap-4 w-[280px]">
        <h3 className="font-semibold text-lg">Shadcn Variant</h3>
        <Input label="Email" placeholder="Enter email..." />
        <Input label="Password" type="password" placeholder="Enter password..." required />
        <Input label="Error State" error defaultValue="Invalid" />
      </div>
      <div className="flex flex-col gap-4 w-[280px]">
        <h3 className="font-semibold text-lg">MD3 Outlined Variant</h3>
        <OutlinedInput label="Email" />
        <OutlinedInput label="Password" type="password" required />
        <OutlinedInput label="Error State" error defaultValue="Invalid" />
      </div>
    </div>
  ),
};

/**
 * Form example with both variants
 */
export const FormExample: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[350px]">
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-lg">Sign Up Form (Shadcn)</h3>
        <Input label="Full Name" placeholder="John Doe" required />
        <Input label="Email" type="email" placeholder="john@example.com" required />
        <Input label="Password" type="password" placeholder="••••••••" required />
        <Input label="Confirm Password" type="password" placeholder="••••••••" required />
      </div>

      <hr className="border-border" />

      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-lg">Sign Up Form (MD3 Outlined)</h3>
        <OutlinedInput label="Full Name" required />
        <OutlinedInput label="Email" type="email" required />
        <OutlinedInput label="Password" type="password" required />
        <OutlinedInput label="Confirm Password" type="password" required />
      </div>
    </div>
  ),
};
