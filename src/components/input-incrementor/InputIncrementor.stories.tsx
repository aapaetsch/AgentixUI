import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ChevronUp, ChevronDown, Volume2, VolumeX } from "lucide-react";
import { InputIncrementor } from "./index";

// ============================================================================
// Meta
// ============================================================================

/**
 * # InputIncrementor
 *
 * A numeric input component with increment/decrement buttons for precise value control.
 *
 * ## Features
 * - Three variants: default (buttons outside), embedded (buttons inside), minimal (subtle)
 * - Three sizes: sm, md, lg
 * - Controlled and uncontrolled modes
 * - Min/max value constraints
 * - Step value support
 * - Decimal precision support
 * - Click-and-hold to continuously increment/decrement
 * - Optional step acceleration when holding
 * - Keyboard navigation (Arrow Up/Down, Enter, Escape)
 * - Full accessibility with ARIA attributes
 *
 * ## Keyboard Navigation
 * - `↑` / `↓` - Increment/decrement value
 * - `Enter` - Commit typed value
 * - `Escape` - Revert to previous value
 *
 * ## Usage
 * ```tsx
 * // Basic
 * <InputIncrementor defaultValue={0} />
 *
 * // With constraints
 * <InputIncrementor min={0} max={100} step={5} />
 *
 * // Controlled
 * const [value, setValue] = useState(50);
 * <InputIncrementor value={value} onValueChange={setValue} />
 *
 * // With hold and acceleration
 * <InputIncrementor enableHold holdAcceleration />
 * ```
 */
const meta: Meta<typeof InputIncrementor> = {
  title: "Inputs/InputIncrementor",
  component: InputIncrementor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "embedded", "minimal"],
      description: "Visual variant of the component",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the component",
    },
    error: {
      control: "boolean",
      description: "Whether the component is in error state",
    },
    disabled: {
      control: "boolean",
      description: "Whether the component is disabled",
    },
    min: {
      control: "number",
      description: "Minimum allowed value",
    },
    max: {
      control: "number",
      description: "Maximum allowed value",
    },
    step: {
      control: "number",
      description: "Step value for increment/decrement",
    },
    precision: {
      control: "number",
      description: "Number of decimal places",
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputIncrementor>;

// ============================================================================
// Basic Stories
// ============================================================================

/**
 * Default input incrementor with standard styling.
 */
export const Default: Story = {
  args: {
    defaultValue: 0,
  },
  decorators: [
    (Story) => (
      <div className="w-[180px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * With min and max constraints.
 */
export const WithConstraints: Story = {
  args: {
    defaultValue: 50,
    min: 49,
    max: 100,
  },
  decorators: [
    (Story) => (
      <div className="w-[180px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * With a custom step value.
 */
export const WithStep: Story = {
  args: {
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 5,
  },
  decorators: [
    (Story) => (
      <div className="w-[180px]">
        <Story />
      </div>
    ),
  ],
};

// ============================================================================
// Variant Stories
// ============================================================================

/**
 * All three variants side by side.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[200px]">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <InputIncrementor variant="default" defaultValue={10} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Embedded</p>
        <InputIncrementor variant="embedded" defaultValue={10} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Minimal</p>
        <InputIncrementor variant="minimal" defaultValue={10} />
      </div>
    </div>
  ),
};

/**
 * Embedded variant - buttons inside a shared bordered container.
 */
export const Embedded: Story = {
  args: {
    variant: "embedded",
    defaultValue: 25,
  },
  decorators: [
    (Story) => (
      <div className="w-[180px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Minimal variant - subtle styling with underline input.
 */
export const Minimal: Story = {
  args: {
    variant: "minimal",
    defaultValue: 42,
  },
  decorators: [
    (Story) => (
      <div className="w-[180px]">
        <Story />
      </div>
    ),
  ],
};

// ============================================================================
// Size Stories
// ============================================================================

/**
 * All three sizes demonstrated.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[200px]">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small</p>
        <InputIncrementor size="sm" defaultValue={10} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Medium (default)</p>
        <InputIncrementor size="md" defaultValue={10} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Large</p>
        <InputIncrementor size="lg" defaultValue={10} />
      </div>
    </div>
  ),
};

/**
 * Sizes with embedded variant.
 */
export const SizesEmbedded: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[200px]">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small</p>
        <InputIncrementor variant="embedded" size="sm" defaultValue={10} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Medium</p>
        <InputIncrementor variant="embedded" size="md" defaultValue={10} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Large</p>
        <InputIncrementor variant="embedded" size="lg" defaultValue={10} />
      </div>
    </div>
  ),
};

// ============================================================================
// State Stories
// ============================================================================

/**
 * Error state styling.
 */
export const ErrorState: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[200px]">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default - Error</p>
        <InputIncrementor variant="default" error defaultValue={-5} min={0} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Embedded - Error</p>
        <InputIncrementor variant="embedded" error defaultValue={-5} min={0} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Minimal - Error</p>
        <InputIncrementor variant="minimal" error defaultValue={-5} min={0} />
      </div>
    </div>
  ),
};

/**
 * Disabled state.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[200px]">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default - Disabled</p>
        <InputIncrementor variant="default" disabled defaultValue={50} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Embedded - Disabled</p>
        <InputIncrementor variant="embedded" disabled defaultValue={50} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Minimal - Disabled</p>
        <InputIncrementor variant="minimal" disabled defaultValue={50} />
      </div>
    </div>
  ),
};

/**
 * At minimum value - decrement button disabled.
 */
export const AtMinimum: Story = {
  args: {
    defaultValue: 0,
    min: 0,
    max: 10,
  },
  decorators: [
    (Story) => (
      <div className="w-[180px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * At maximum value - increment button disabled.
 */
export const AtMaximum: Story = {
  args: {
    defaultValue: 10,
    min: 0,
    max: 10,
  },
  decorators: [
    (Story) => (
      <div className="w-[180px]">
        <Story />
      </div>
    ),
  ],
};

// ============================================================================
// Controlled Stories
// ============================================================================

/**
 * Controlled mode demonstration.
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState(50);

    return (
      <div className="flex flex-col gap-4 w-[250px]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current value:</span>
          <span className="text-lg font-semibold">{value}</span>
        </div>
        <InputIncrementor
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
          step={5}
        />
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm border rounded hover:bg-accent"
            onClick={() => setValue(0)}
          >
            Reset
          </button>
          <button
            className="px-3 py-1 text-sm border rounded hover:bg-accent"
            onClick={() => setValue(50)}
          >
            Set 50
          </button>
          <button
            className="px-3 py-1 text-sm border rounded hover:bg-accent"
            onClick={() => setValue(100)}
          >
            Set 100
          </button>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Decimal / Precision Stories
// ============================================================================

/**
 * With decimal precision.
 */
export const DecimalPrecision: Story = {
  args: {
    defaultValue: 0.5,
    min: 0,
    max: 1,
    step: 0.1,
    precision: 1,
  },
  decorators: [
    (Story) => (
      <div className="w-[180px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Currency-like input with 2 decimal places.
 */
export const CurrencyLike: Story = {
  render: function CurrencyStory() {
    const [value, setValue] = useState(19.99);

    return (
      <div className="w-[200px]">
        <p className="text-sm text-muted-foreground mb-2">Price</p>
        <InputIncrementor
          value={value}
          onValueChange={setValue}
          min={0}
          max={999.99}
          step={0.01}
          precision={2}
          formatValue={(v) => `$${v.toFixed(2)}`}
          parseValue={(s) => parseFloat(s.replace(/[^0-9.-]/g, ""))}
        />
      </div>
    );
  },
};

/**
 * Percentage input.
 */
export const Percentage: Story = {
  render: function PercentageStory() {
    const [value, setValue] = useState(75);

    return (
      <div className="w-[200px]">
        <p className="text-sm text-muted-foreground mb-2">Completion</p>
        <InputIncrementor
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
          step={5}
          formatValue={(v) => `${v}%`}
          parseValue={(s) => parseInt(s.replace(/[^0-9]/g, ""), 10)}
        />
      </div>
    );
  },
};


// ============================================================================
// Custom Icons Stories
// ============================================================================

/**
 * With custom increment/decrement icons.
 */
export const CustomIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[200px]">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Chevrons</p>
        <InputIncrementor
          defaultValue={5}
          decrementIcon={<ChevronDown />}
          incrementIcon={<ChevronUp />}
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Volume</p>
        <InputIncrementor
          variant="embedded"
          defaultValue={50}
          min={0}
          max={100}
          decrementIcon={<VolumeX />}
          incrementIcon={<Volume2 />}
        />
      </div>
    </div>
  ),
};

// ============================================================================
// Accessibility Stories
// ============================================================================

/**
 * With accessible label.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="w-[200px]">
      <label htmlFor="quantity-input" className="block text-sm font-medium mb-2">
        Quantity
      </label>
      <InputIncrementor
        id="quantity-input"
        label="Quantity"
        defaultValue={1}
        min={1}
        max={99}
      />
    </div>
  ),
};

/**
 * Keyboard navigation demonstration.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="w-[250px] space-y-4">
      <p className="text-sm text-muted-foreground">
        Focus the input and use:
      </p>
      <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
        <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">↑</kbd> to increment</li>
        <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">↓</kbd> to decrement</li>
        <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to commit value</li>
        <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> to cancel</li>
      </ul>
      <InputIncrementor
        defaultValue={50}
        min={0}
        max={100}
        step={10}
        label="Keyboard navigation demo"
      />
    </div>
  ),
};

// ============================================================================
// Hold and Acceleration Stories
// ============================================================================

/**
 * Click and hold to continuously increment/decrement.
 */
export const HoldToIncrement: Story = {
  render: () => (
    <div className="w-[250px] space-y-4">
      <p className="text-sm text-muted-foreground">
        Click and hold the +/- buttons to continuously change the value.
      </p>
      <InputIncrementor
        defaultValue={0}
        min={0}
        max={1000}
        step={1}
        enableHold
        label="Click and hold"
      />
    </div>
  ),
};

/**
 * Hold with step acceleration - steps get larger the longer you hold.
 */
export const HoldWithAcceleration: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <p className="text-sm text-muted-foreground">
        Hold the buttons to see acceleration:
      </p>
      <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
        <li>0-1s: +1 per step</li>
        <li>1-2s: +2 per step</li>
        <li>2-3s: +5 per step</li>
        <li>3s+: +10 per step</li>
      </ul>
      <InputIncrementor
        defaultValue={0}
        min={0}
        max={10000}
        step={1}
        enableHold
        holdAcceleration
        label="With acceleration"
      />
    </div>
  ),
};

/**
 * Customizing hold timing behavior.
 */
export const CustomHoldTiming: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 w-[300px]">
      <div>
        <p className="text-sm text-muted-foreground mb-3">
          Default timing (500ms delay, 100ms interval):
        </p>
        <InputIncrementor
          defaultValue={0}
          min={0}
          max={100}
          enableHold
          label="Default"
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">
          Fast (200ms delay, 50ms interval):
        </p>
        <InputIncrementor
          defaultValue={0}
          min={0}
          max={100}
          enableHold
          holdDelay={200}
          holdInterval={50}
          label="Fast"
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">
          Slow (1000ms delay, 200ms interval):
        </p>
        <InputIncrementor
          defaultValue={0}
          min={0}
          max={100}
          enableHold
          holdDelay={1000}
          holdInterval={200}
          label="Slow"
        />
      </div>
    </div>
  ),
};

/**
 * Volume control with hold and acceleration.
 */
export const VolumeControlWithHold: Story = {
  render: () => {
    const [volume, setVolume] = useState(50);
    
    return (
      <div className="w-[250px] space-y-4">
        <p className="text-sm text-muted-foreground">
          Volume: {volume}% {volume === 0 ? "🔇" : volume < 50 ? "🔉" : "🔊"}
        </p>
        <InputIncrementor
          value={volume}
          onValueChange={setVolume}
          min={0}
          max={100}
          step={1}
          enableHold
          holdAcceleration
          variant="embedded"
          decrementIcon={<VolumeX className="h-4 w-4" />}
          incrementIcon={<Volume2 className="h-4 w-4" />}
          formatValue={(v) => `${v}%`}
          parseValue={(s) => parseInt(s.replace("%", ""), 10)}
          label="Volume"
        />
      </div>
    );
  },
};
