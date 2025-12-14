import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Check, X, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { Switch } from "./index";

/**
 * A customizable switch component following Material Design 3 patterns.
 *
 * ## Features
 * - 3 sizes: `sm`, `md`, `lg`
 * - Optional icon support for both checked and unchecked states
 * - MD3 motion: smooth transitions and ripple effects
 * - Proper state layer implementation (40dp target area)
 * - Thumb grows from 16dp to 24dp when checked (MD3 spec)
 * - When icons are provided, thumb stays at larger size
 *
 * ## Usage
 * ```tsx
 * // Basic
 * <Switch />
 *
 * // With icons
 * <Switch
 *   checkedIcon={<Check />}
 *   uncheckedIcon={<X />}
 * />
 *
 * // Controlled
 * const [checked, setChecked] = useState(false);
 * <Switch checked={checked} onCheckedChange={setChecked} />
 * ```
 */
const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "Size variant of the switch",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the switch is disabled",
    },
    checked: {
      control: "boolean",
      description: "Whether the switch is checked (controlled)",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Switch>;

/**
 * The default switch without any icons, showing the MD3 thumb size change behavior.
 */
export const Default: Story = {
  args: {
    defaultChecked: false,
  },
};

/**
 * A switch in the checked state.
 */
export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

/**
 * All available size variants.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Switch size="sm" />
        <span className="text-sm text-muted-foreground">Small</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch size="md" />
        <span className="text-sm text-muted-foreground">Medium (default)</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch size="lg" />
        <span className="text-sm text-muted-foreground">Large</span>
      </div>
    </div>
  ),
};

/**
 * Switch with icons in the thumb. Note how the thumb maintains the larger size
 * in both states when icons are provided.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Switch
          checkedIcon={<Check className="text-primary" />}
          uncheckedIcon={<X className="text-background" />}
          defaultChecked
        />
        <span className="text-sm text-muted-foreground">Check / X icons</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch
          checkedIcon={<Sun className="text-primary" />}
          uncheckedIcon={<Moon className="text-background" />}
        />
        <span className="text-sm text-muted-foreground">Theme toggle</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch
          checkedIcon={<Volume2 className="text-primary" />}
          uncheckedIcon={<VolumeX className="text-background" />}
          defaultChecked
        />
        <span className="text-sm text-muted-foreground">Sound toggle</span>
      </div>
    </div>
  ),
};

/**
 * Switch with only a checked icon. The thumb still uses the larger size
 * in both states for consistency.
 */
export const WithCheckedIconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch
        checkedIcon={<Check className="text-primary" />}
        defaultChecked
      />
      <span className="text-sm text-muted-foreground">Only checked icon</span>
    </div>
  ),
};

/**
 * All sizes with icons showing consistent behavior.
 */
export const AllSizesWithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Switch
          size="sm"
          checkedIcon={<Check className="text-primary" />}
          uncheckedIcon={<X className="text-background" />}
          defaultChecked
        />
        <span className="text-sm text-muted-foreground">Small with icons</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch
          size="md"
          checkedIcon={<Check className="text-primary" />}
          uncheckedIcon={<X className="text-background" />}
          defaultChecked
        />
        <span className="text-sm text-muted-foreground">Medium with icons</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch
          size="lg"
          checkedIcon={<Check className="text-primary" />}
          uncheckedIcon={<X className="text-background" />}
          defaultChecked
        />
        <span className="text-sm text-muted-foreground">Large with icons</span>
      </div>
    </div>
  ),
};

/**
 * Disabled switches in both checked and unchecked states.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Switch disabled />
        <span className="text-sm text-muted-foreground">Disabled unchecked</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch disabled defaultChecked />
        <span className="text-sm text-muted-foreground">Disabled checked</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch
          disabled
          checkedIcon={<Check className="text-primary" />}
          uncheckedIcon={<X className="text-background" />}
        />
        <span className="text-sm text-muted-foreground">Disabled with icons</span>
      </div>
    </div>
  ),
};

/**
 * A controlled switch example showing how to manage state externally.
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <Switch
          checked={checked}
          onCheckedChange={setChecked}
          checkedIcon={<Check className="text-primary" />}
          uncheckedIcon={<X className="text-background" />}
        />
        <p className="text-sm text-muted-foreground">
          State: <span className="font-medium">{checked ? "ON" : "OFF"}</span>
        </p>
        <button
          onClick={() => setChecked(!checked)}
          className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Toggle externally
        </button>
      </div>
    );
  },
};

/**
 * Interactive demo showing the ripple effect on click.
 * Click the switches to see the ripple animation.
 */
export const RippleDemo: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <p className="text-sm font-medium text-muted-foreground">
        Click to see ripple effects
      </p>
      <div className="flex gap-8 items-center">
        <Switch />
        <Switch defaultChecked />
        <Switch
          checkedIcon={<Check className="text-primary" />}
          uncheckedIcon={<X className="text-background" />}
        />
      </div>
    </div>
  ),
};

/**
 * Example of switches in a settings panel context.
 */
export const SettingsExample: Story = {
  render: function SettingsStory() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [sound, setSound] = useState(true);
    const [autoSave, setAutoSave] = useState(false);

    return (
      <div className="w-80 p-4 rounded-lg border border-border bg-card">
        <h3 className="text-lg font-semibold mb-4">Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Notifications</label>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Dark Mode</label>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              checkedIcon={<Moon className="text-primary" />}
              uncheckedIcon={<Sun className="text-background" />}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Sound Effects</label>
            <Switch
              checked={sound}
              onCheckedChange={setSound}
              checkedIcon={<Volume2 className="text-primary" />}
              uncheckedIcon={<VolumeX className="text-background" />}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Auto-save</label>
            <Switch
              checked={autoSave}
              onCheckedChange={setAutoSave}
              checkedIcon={<Check className="text-primary" />}
            />
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Comparison between switches with and without icons to show the
 * thumb size behavior difference per MD3 spec.
 */
export const ThumbSizeComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">
          Without icons: Thumb grows when checked
        </p>
        <div className="flex gap-4">
          <Switch />
          <Switch defaultChecked />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">
          With icons: Thumb stays large in both states
        </p>
        <div className="flex gap-4">
          <Switch
            checkedIcon={<Check className="text-primary" />}
            uncheckedIcon={<X className="text-background" />}
          />
          <Switch
            checkedIcon={<Check className="text-primary" />}
            uncheckedIcon={<X className="text-background" />}
            defaultChecked
          />
        </div>
      </div>
    </div>
  ),
};
