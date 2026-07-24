import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Volume2, VolumeX, Moon, Sun } from "lucide-react";
import { Slider } from "./basic";

/**
 * # Slider Base
 *
 * A slider component for selecting values from a range following
 * Material Design 3 specifications.
 *
 * ## Base Features
 * - **Single or Range Selection**: Support for one or two thumbs
 * - **Three Sizes**: xs (16dp), sm (24dp), md (40dp) track heights
 * - **Bar Handle**: MD3 vertical pill shape with press animation
 * - **Orientations**: Horizontal and vertical
 * - **Accessibility**: Full keyboard navigation
 *
 * ## Expanded API
 * For the richer slider surface with circular or knobless handles,
 * value indicators, stop indicators, inset icons, and larger sizes,
 * see the companion advanced slider story in this folder.
 *
 * ## Usage
 * ```tsx
 * // Basic
 * <Slider defaultValue={[50]} />
 *
 * // Range
 * <Slider defaultValue={[25, 75]} />
 *
 * // Different sizes
 * <Slider defaultValue={[50]} size="md" />
 *
 * // Vertical
 * <Slider defaultValue={[50]} orientation="vertical" className="h-48" />
 * ```
 */
const meta: Meta<typeof Slider> = {
  title: "Inputs/Slider Base",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Orientation of the slider",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md"],
      description: "Size of the slider (M3: XS=16dp, S=24dp, M=40dp)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the slider is disabled",
    },
    min: {
      control: "number",
      description: "Minimum value",
    },
    max: {
      control: "number",
      description: "Maximum value",
    },
    step: {
      control: "number",
      description: "Step increment",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

// ============================================================================
// Basic Stories
// ============================================================================

/**
 * Default slider with a single value.
 * Uses XS size (16dp track) as the default per MD3.
 */
export const Default: Story = {
  args: {
    defaultValue: [50],
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
 * Range slider with two thumbs for selecting a range of values.
 */
export const Range: Story = {
  args: {
    defaultValue: [25, 75],
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
// Size Variants
// ============================================================================

/**
 * All available size variants following M3 specifications.
 * - XS: 16dp track height, 44dp handle height
 * - SM: 24dp track height, 44dp handle height
 * - MD: 40dp track height, 52dp handle height
 */
export const Sizes: Story = {
  render: () => (
    <div className="w-[300px] space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Extra Small (xs) - 16dp track</p>
        <Slider defaultValue={[50]} size="xs" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small (sm) - 24dp track</p>
        <Slider defaultValue={[50]} size="sm" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Medium (md) - 40dp track</p>
        <Slider defaultValue={[50]} size="md" />
      </div>
    </div>
  ),
};

// ============================================================================
// Handle Animation
// ============================================================================

/**
 * MD3 Handle Animation - The bar handle narrows when pressed or dragged.
 * Click/touch and drag to see the handle width change from 4dp to 2dp.
 */
export const HandlePressAnimation: Story = {
  render: () => (
    <div className="w-[300px] space-y-6">
      <p className="text-sm text-muted-foreground">
        Click/touch or drag the handle to see the MD3 press animation (bar narrows).
      </p>
      <Slider defaultValue={[50]} size="xs" />
      <Slider defaultValue={[50]} size="sm" />
      <Slider defaultValue={[50]} size="md" />
    </div>
  ),
};

// ============================================================================
// Discrete Steps
// ============================================================================

/**
 * Slider with discrete steps.
 */
export const DiscreteSteps: Story = {
  args: {
    defaultValue: [50],
    step: 10,
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
// Vertical Orientation
// ============================================================================

/**
 * Vertical slider orientation.
 */
export const Vertical: Story = {
  args: {
    defaultValue: [50],
    orientation: "vertical",
    className: "h-48",
  },
};

/**
 * Vertical sliders in different sizes.
 */
export const VerticalSizes: Story = {
  render: () => (
    <div className="flex gap-8 items-end">
      <div className="flex flex-col items-center gap-2">
        <Slider
          defaultValue={[50]}
          orientation="vertical"
          size="xs"
          className="h-32"
        />
        <span className="text-xs text-muted-foreground">xs</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Slider
          defaultValue={[50]}
          orientation="vertical"
          size="sm"
          className="h-32"
        />
        <span className="text-xs text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Slider
          defaultValue={[50]}
          orientation="vertical"
          size="md"
          className="h-32"
        />
        <span className="text-xs text-muted-foreground">md</span>
      </div>
    </div>
  ),
};

/**
 * Multiple vertical sliders side by side (e.g., for audio mixing).
 */
export const VerticalGroup: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <div className="flex flex-col items-center gap-2">
        <Slider
          defaultValue={[75]}
          orientation="vertical"
          className="h-48"
        />
        <span className="text-xs text-muted-foreground">Bass</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Slider
          defaultValue={[50]}
          orientation="vertical"
          className="h-48"
        />
        <span className="text-xs text-muted-foreground">Mid</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Slider
          defaultValue={[60]}
          orientation="vertical"
          className="h-48"
        />
        <span className="text-xs text-muted-foreground">Treble</span>
      </div>
    </div>
  ),
};

// ============================================================================
// States
// ============================================================================

/**
 * Disabled slider.
 */
export const Disabled: Story = {
  args: {
    defaultValue: [50],
    disabled: true,
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
 * Slider at minimum and maximum values.
 */
export const Extremes: Story = {
  render: () => (
    <div className="w-[300px] space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">At minimum</p>
        <Slider defaultValue={[0]} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">At maximum</p>
        <Slider defaultValue={[100]} />
      </div>
    </div>
  ),
};

// ============================================================================
// Controlled Component
// ============================================================================

/**
 * Controlled slider with external state management.
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState([50]);

    return (
      <div className="w-[300px] space-y-4">
        <Slider
          value={value}
          onValueChange={setValue}
        />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Value: <span className="font-medium text-foreground">{value[0]}</span>
          </p>
          <button
            onClick={() => setValue([50])}
            className="text-sm text-primary hover:underline"
          >
            Reset
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Controlled range slider.
 */
export const ControlledRange: Story = {
  render: function ControlledRangeStory() {
    const [value, setValue] = useState([25, 75]);

    return (
      <div className="w-[300px] space-y-4">
        <Slider
          value={value}
          onValueChange={setValue}
        />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Range: <span className="font-medium text-foreground">{value[0]} - {value[1]}</span>
          </p>
          <button
            onClick={() => setValue([25, 75])}
            className="text-sm text-primary hover:underline"
          >
            Reset
          </button>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Use Case Examples
// ============================================================================

/**
 * Volume control example with icons.
 */
export const VolumeControl: Story = {
  render: function VolumeControlStory() {
    const [volume, setVolume] = useState([50]);
    const isMuted = volume[0] === 0;

    return (
      <div className="flex items-center gap-4 w-[300px]">
        <button
          onClick={() => setVolume(isMuted ? [50] : [0])}
          className="p-2 rounded-full hover:bg-accent transition-colors"
        >
          {isMuted ? (
            <VolumeX className="size-5 text-muted-foreground" />
          ) : (
            <Volume2 className="size-5" />
          )}
        </button>
        <Slider
          value={volume}
          onValueChange={setVolume}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-8 text-right">
          {volume[0]}
        </span>
      </div>
    );
  },
};

/**
 * Brightness control example.
 */
export const BrightnessControl: Story = {
  render: function BrightnessControlStory() {
    const [brightness, setBrightness] = useState([75]);

    return (
      <div className="flex items-center gap-4 w-[300px]">
        <Moon className="size-4 text-muted-foreground" />
        <Slider
          value={brightness}
          onValueChange={setBrightness}
          className="flex-1"
        />
        <Sun className="size-5 text-yellow-500" />
      </div>
    );
  },
};

/**
 * Price range filter example.
 */
export const PriceRangeFilter: Story = {
  render: function PriceRangeFilterStory() {
    const [range, setRange] = useState([100, 500]);

    return (
      <div className="w-[300px] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Price Range</span>
          <span className="text-sm text-muted-foreground">
            ${range[0]} - ${range[1]}
          </span>
        </div>
        <Slider
          value={range}
          onValueChange={setRange}
          min={0}
          max={1000}
          step={50}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>$1000</span>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Comparison Stories
// ============================================================================

/**
 * All sizes comparison - horizontal.
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      {(["xs", "sm", "md"] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground w-6">{size}</span>
          <Slider defaultValue={[50]} size={size} className="flex-1" />
        </div>
      ))}
    </div>
  ),
};

/**
 * Demonstrating the gap styling between handle and track.
 */
export const GapStyling: Story = {
  render: () => (
    <div className="w-[300px] space-y-8">
      <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
        <p className="font-medium">MD3 Gap Styling</p>
        <p className="text-muted-foreground">
          The slider features a visual gap between the handle and the track edges,
          creating the characteristic MD3 "floating" handle effect.
        </p>
      </div>
      <Slider defaultValue={[30]} size="md" />
      <Slider defaultValue={[25, 75]} size="md" />
    </div>
  ),
};
