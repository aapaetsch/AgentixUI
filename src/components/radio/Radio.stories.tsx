import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "./index";

/**
 * A set of checkable buttons (radio buttons) where only one can be checked at a time.
 * Built on Radix UI Radio Group primitive with Material Design 3 styling.
 *
 * ## Features
 * - 3 sizes: `sm`, `md`, `lg`
 * - MD3 state layer with ripple effects (40dp target area)
 * - Full keyboard navigation (arrow keys, Tab, Space)
 * - Controlled and uncontrolled modes
 * - Label support with configurable position
 * - Horizontal and vertical orientation
 *
 * ## Usage
 * ```tsx
 * <RadioGroup defaultValue="option1">
 *   <RadioGroupItem value="option1" label="Option 1" />
 *   <RadioGroupItem value="option2" label="Option 2" />
 *   <RadioGroupItem value="option3" label="Option 3" />
 * </RadioGroup>
 * ```
 */
const meta: Meta<typeof RadioGroup> = {
  title: "Inputs/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["vertical", "horizontal"],
      description: "The orientation of the radio group",
      table: {
        defaultValue: { summary: "vertical" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the radio group is disabled",
    },
    defaultValue: {
      control: "text",
      description: "The default selected value",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

/**
 * Default radio group with three options.
 */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <RadioGroupItem value="option1" label="Option 1" />
      <RadioGroupItem value="option2" label="Option 2" />
      <RadioGroupItem value="option3" label="Option 3" />
    </RadioGroup>
  ),
};

/**
 * Radio group with no default selection.
 */
export const NoDefaultSelection: Story = {
  render: () => (
    <RadioGroup>
      <RadioGroupItem value="option1" label="Option 1" />
      <RadioGroupItem value="option2" label="Option 2" />
      <RadioGroupItem value="option3" label="Option 3" />
    </RadioGroup>
  ),
};

/**
 * Horizontal orientation for inline layouts.
 */
export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="option1" orientation="horizontal">
      <RadioGroupItem value="option1" label="Option 1" />
      <RadioGroupItem value="option2" label="Option 2" />
      <RadioGroupItem value="option3" label="Option 3" />
    </RadioGroup>
  ),
};

/**
 * All size variants comparison.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Small</p>
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" label="Small option 1" size="sm" />
          <RadioGroupItem value="option2" label="Small option 2" size="sm" />
        </RadioGroup>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Medium (default)</p>
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" label="Medium option 1" size="md" />
          <RadioGroupItem value="option2" label="Medium option 2" size="md" />
        </RadioGroup>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Large</p>
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" label="Large option 1" size="lg" />
          <RadioGroupItem value="option2" label="Large option 2" size="lg" />
        </RadioGroup>
      </div>
    </div>
  ),
};

/**
 * Labels can be positioned on either side of the radio button.
 */
export const LabelPosition: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Label on right (default)</p>
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" label="Right label" labelPosition="right" />
          <RadioGroupItem value="option2" label="Right label" labelPosition="right" />
        </RadioGroup>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Label on left</p>
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" label="Left label" labelPosition="left" />
          <RadioGroupItem value="option2" label="Left label" labelPosition="left" />
        </RadioGroup>
      </div>
    </div>
  ),
};

/**
 * Radio buttons without labels.
 */
export const WithoutLabels: Story = {
  render: () => (
    <RadioGroup defaultValue="option1" orientation="horizontal">
      <RadioGroupItem value="option1" />
      <RadioGroupItem value="option2" />
      <RadioGroupItem value="option3" />
    </RadioGroup>
  ),
};

/**
 * Disabled radio group prevents all interaction.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Disabled group</p>
        <RadioGroup defaultValue="option1" disabled>
          <RadioGroupItem value="option1" label="Disabled option 1" />
          <RadioGroupItem value="option2" label="Disabled option 2" />
          <RadioGroupItem value="option3" label="Disabled option 3" />
        </RadioGroup>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Individual disabled items</p>
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" label="Enabled option" />
          <RadioGroupItem value="option2" label="Disabled option" disabled />
          <RadioGroupItem value="option3" label="Enabled option" />
        </RadioGroup>
      </div>
    </div>
  ),
};

/**
 * Controlled component example with external state management.
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = React.useState("option1");

    return (
      <div className="flex flex-col items-center gap-4">
        <RadioGroup value={value} onValueChange={setValue}>
          <RadioGroupItem value="option1" label="Option 1" />
          <RadioGroupItem value="option2" label="Option 2" />
          <RadioGroupItem value="option3" label="Option 3" />
        </RadioGroup>
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-medium">{value}</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setValue("option1")}
            className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Select Option 1
          </button>
          <button
            onClick={() => setValue("option3")}
            className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Select Option 3
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Interactive demo showing the ripple effect on click.
 */
export const RippleDemo: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <p className="text-sm font-medium text-muted-foreground">
        Click to see ripple effects
      </p>
      <RadioGroup defaultValue="option1">
        <RadioGroupItem value="option1" label="Click me for ripple" />
        <RadioGroupItem value="option2" label="Click me for ripple" />
        <RadioGroupItem value="option3" label="Click me for ripple" />
      </RadioGroup>
    </div>
  ),
};

/**
 * All states for visual testing.
 */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium mb-2">Unselected</h3>
      <RadioGroup>
        <RadioGroupItem value="option1" label="Unselected" />
      </RadioGroup>

      <h3 className="text-sm font-medium mt-4 mb-2">Selected</h3>
      <RadioGroup defaultValue="option1">
        <RadioGroupItem value="option1" label="Selected" />
      </RadioGroup>

      <h3 className="text-sm font-medium mt-4 mb-2">Disabled Unselected</h3>
      <RadioGroup>
        <RadioGroupItem value="option1" label="Disabled unselected" disabled />
      </RadioGroup>

      <h3 className="text-sm font-medium mt-4 mb-2">Disabled Selected</h3>
      <RadioGroup defaultValue="option1" disabled>
        <RadioGroupItem value="option1" label="Disabled selected" />
      </RadioGroup>
    </div>
  ),
};

/**
 * Example of radio buttons in a settings panel context.
 */
export const SettingsExample: Story = {
  render: function SettingsStory() {
    const [theme, setTheme] = React.useState("system");
    const [density, setDensity] = React.useState("comfortable");

    return (
      <div className="w-80 p-4 rounded-lg border border-border bg-card">
        <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Theme</h4>
            <RadioGroup value={theme} onValueChange={setTheme}>
              <RadioGroupItem value="light" label="Light" />
              <RadioGroupItem value="dark" label="Dark" />
              <RadioGroupItem value="system" label="System" />
            </RadioGroup>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3">Density</h4>
            <RadioGroup value={density} onValueChange={setDensity}>
              <RadioGroupItem value="compact" label="Compact" />
              <RadioGroupItem value="comfortable" label="Comfortable" />
              <RadioGroupItem value="spacious" label="Spacious" />
            </RadioGroup>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Form integration example.
 */
export const FormExample: Story = {
  render: function FormStory() {
    const [formData, setFormData] = React.useState({
      plan: "starter",
      billing: "monthly",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Selected plan: ${formData.plan}, Billing: ${formData.billing}`);
    };

    return (
      <form onSubmit={handleSubmit} className="w-96 p-6 rounded-lg border border-border bg-card">
        <h3 className="text-lg font-semibold mb-6">Choose Your Plan</h3>
        
        <div className="space-y-6">
          <fieldset>
            <legend className="text-sm font-medium mb-3">Plan</legend>
            <RadioGroup
              value={formData.plan}
              onValueChange={(value) => setFormData({ ...formData, plan: value })}
            >
              <RadioGroupItem value="starter" label="Starter - $9/mo" />
              <RadioGroupItem value="pro" label="Pro - $29/mo" />
              <RadioGroupItem value="enterprise" label="Enterprise - $99/mo" />
            </RadioGroup>
          </fieldset>
          
          <fieldset>
            <legend className="text-sm font-medium mb-3">Billing Cycle</legend>
            <RadioGroup
              value={formData.billing}
              onValueChange={(value) => setFormData({ ...formData, billing: value })}
              orientation="horizontal"
            >
              <RadioGroupItem value="monthly" label="Monthly" />
              <RadioGroupItem value="yearly" label="Yearly (save 20%)" />
            </RadioGroup>
          </fieldset>
        </div>
        
        <button
          type="submit"
          className="mt-6 w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Continue
        </button>
      </form>
    );
  },
};

/**
 * Keyboard navigation demo.
 * Use Tab to focus, Arrow keys to navigate, Space to select.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Use <kbd className="px-1 rounded bg-muted">Tab</kbd> to focus,{" "}
        <kbd className="px-1 rounded bg-muted">↑</kbd>{" "}
        <kbd className="px-1 rounded bg-muted">↓</kbd> to navigate,{" "}
        <kbd className="px-1 rounded bg-muted">Space</kbd> to select
      </p>
      <RadioGroup defaultValue="option2">
        <RadioGroupItem value="option1" label="First option" />
        <RadioGroupItem value="option2" label="Second option" />
        <RadioGroupItem value="option3" label="Third option" />
        <RadioGroupItem value="option4" label="Fourth option" />
      </RadioGroup>
    </div>
  ),
};

/**
 * Side-by-side comparison of sizes.
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="flex gap-12 items-start">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Small (sm)</p>
        <RadioGroup defaultValue="selected" orientation="horizontal">
          <RadioGroupItem value="unselected" size="sm" />
          <RadioGroupItem value="selected" size="sm" />
        </RadioGroup>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Medium (md)</p>
        <RadioGroup defaultValue="selected" orientation="horizontal">
          <RadioGroupItem value="unselected" size="md" />
          <RadioGroupItem value="selected" size="md" />
        </RadioGroup>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Large (lg)</p>
        <RadioGroup defaultValue="selected" orientation="horizontal">
          <RadioGroupItem value="unselected" size="lg" />
          <RadioGroupItem value="selected" size="lg" />
        </RadioGroup>
      </div>
    </div>
  ),
};
