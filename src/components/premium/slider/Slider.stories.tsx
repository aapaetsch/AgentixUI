import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Volume2, VolumeX, Sun, Moon, Thermometer, SunMedium } from "lucide-react";
import { Slider } from "./index";

/**
 * # Slider
 *
 * A premium slider component for selecting values from a range following
 * Material Design 3 specifications.
 *
 * ## MD3 Features
 * - **Handle Shapes**: Bar (vertical pill, MD3 default) or circular (traditional)
 * - **Handle Animation**: Bar narrows on click/touch/drag, circular scales down
 * - **Track Sizes**: XS (16dp), S (24dp), M (40dp), L (56dp), XL (96dp)
 * - **Handle Heights**: XS/S (44dp), M (52dp), L (68dp), XL (108dp)
 * - **Track Gap**: Visual gap between handle and track with rounded corners
 * - **Inset Icons**: For M, L, XL sizes - icon in track that moves based on value
 * - **Stop Indicators**: 4dp dots showing discrete step values
 * - **Value Indicators**: Configurable size (sm, md, lg) with inverse colors
 *
 * ## Types
 * - **Standard**: Single value from zero/start
 * - **Range**: Two values defining min/max
 * - **Centered**: (Planned) Value from center point
 *
 * ## Usage
 * ```tsx
 * // Basic
 * <Slider defaultValue={[50]} />
 *
 * // Range
 * <Slider defaultValue={[25, 75]} />
 *
 * // Circular handle
 * <Slider defaultValue={[50]} handleShape="circular" />
 *
 * // With value indicator
 * <Slider defaultValue={[50]} showValueIndicator="always" />
 *
 * // Large value indicator
 * <Slider defaultValue={[50]} showValueIndicator="always" valueIndicatorSize="lg" />
 *
 * // Discrete with stops
 * <Slider defaultValue={[50]} step={10} showStops />
 *
 * // With inset icon (MD3 feature)
 * <Slider defaultValue={[50]} size="md" insetIcon={<Volume2 />} />
 * ```
 */
const meta: Meta<typeof Slider> = {
  title: "Premium/Slider",
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
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of the slider (M3: XS=16dp, S=24dp, M=40dp, L=56dp, XL=96dp)",
    },
    handleShape: {
      control: "select",
      options: ["bar", "circular", "knobless"],
      description: "Handle shape variant - bar (MD3), circular (xs only), or knobless",
    },
    showValueIndicator: {
      control: "select",
      options: ["always", "hover", "never"],
      description: "When to show value indicator",
    },
    valueIndicatorSize: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the value indicator",
    },
    showStops: {
      control: "boolean",
      description: "Show stop indicators for discrete steps",
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
 * MD3 Handle Animation - The bar handle narrows when pressed or dragged.
 * The handle uses 2px corner radius and a thin focus ring for subtlety.
 * Click/touch and drag to see the handle width change from 4dp to 2dp.
 */
export const HandlePressAnimation: Story = {
  render: () => (
    <div className="w-[300px] space-y-6">
      <p className="text-sm text-muted-foreground">
        Click/touch or drag the handle to see the MD3 press animation (bar narrows, circular scales).
      </p>
      <Slider defaultValue={[50]} size="xs" />
      <Slider defaultValue={[50]} size="md" />
      <Slider defaultValue={[50]} size="xl" />
      <div className="pt-2">
        <p className="text-sm text-muted-foreground mb-2">With circular handles (no focus ring):</p>
        <Slider defaultValue={[50]} size="md" handleShape="circular" />
      </div>
    </div>
  ),
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

/**
 * Slider with value indicator always visible.
 */
export const WithValueIndicator: Story = {
  args: {
    defaultValue: [50],
    showValueIndicator: "always",
  },
  decorators: [
    (Story) => (
      <div className="w-[300px] pt-10">
        <Story />
      </div>
    ),
  ],
};

/**
 * Slider with value indicator visible on hover.
 */
export const ValueIndicatorOnHover: Story = {
  args: {
    defaultValue: [50],
    showValueIndicator: "hover",
  },
  decorators: [
    (Story) => (
      <div className="w-[300px] pt-10">
        <Story />
      </div>
    ),
  ],
};

/**
 * Custom value formatting for the indicator.
 */
export const CustomValueFormat: Story = {
  render: () => (
    <div className="w-[300px] pt-10 space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-4">Percentage</p>
        <Slider
          defaultValue={[50]}
          showValueIndicator="always"
          formatValue={(v) => `${v}%`}
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Temperature</p>
        <Slider
          defaultValue={[22]}
          min={10}
          max={35}
          showValueIndicator="always"
          formatValue={(v) => `${v}°C`}
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Currency</p>
        <Slider
          defaultValue={[500]}
          min={0}
          max={1000}
          step={50}
          showValueIndicator="always"
          formatValue={(v) => `$${v}`}
        />
      </div>
    </div>
  ),
};

// ============================================================================
// Size Variants
// ============================================================================

/**
 * All available size variants following M3 specifications.
 * - XS: 16dp track height, 44dp handle height
 * - S: 24dp track height, 44dp handle height
 * - M: 40dp track height, 52dp handle height (supports inset icon)
 * - L: 56dp track height, 68dp handle height (supports inset icon)
 * - XL: 96dp track height, 108dp handle height (supports inset icon, for hero moments)
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
      <div>
        <p className="text-sm text-muted-foreground mb-2">Large (lg) - 56dp track</p>
        <Slider defaultValue={[50]} size="lg" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Extra Large (xl) - 96dp track, for hero moments</p>
        <Slider defaultValue={[50]} size="xl" />
      </div>
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

/**
 * Slider with stop indicators visible.
 */
export const WithStopIndicators: Story = {
  args: {
    defaultValue: [50],
    step: 10,
    showStops: true,
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
 * Range slider with stop indicators.
 */
export const RangeWithStops: Story = {
  args: {
    defaultValue: [20, 80],
    step: 10,
    showStops: true,
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
 * Vertical slider with value indicator.
 */
export const VerticalWithIndicator: Story = {
  args: {
    defaultValue: [50],
    orientation: "vertical",
    className: "h-48",
    showValueIndicator: "always",
  },
  decorators: [
    (Story) => (
      <div className="pl-16">
        <Story />
      </div>
    ),
  ],
};

/**
 * Multiple vertical sliders side by side.
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
// Inset Icon (MD3 Feature)
// ============================================================================

/**
 * Slider with inset icon - MD3 feature for M, L, XL sizes.
 * The icon appears in the track and moves between active/inactive
 * based on the handle position. Supports three different icons for
 * min, partial, and max states.
 */
export const WithInsetIcon: Story = {
  render: () => (
    <div className="w-[300px] space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Volume with inset icon (md)</p>
        <Slider 
          defaultValue={[50]} 
          size="md" 
          insetIcon={<Volume2 />}
          insetIconAtMin={<VolumeX />}
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Brightness with three inset icons (lg)</p>
        <Slider 
          defaultValue={[75]} 
          size="lg" 
          insetIcon={<SunMedium />}
          insetIconAtMin={<Moon />}
          insetIconAtMax={<Sun />}
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Hero slider with three inset icons (xl)</p>
        <Slider 
          defaultValue={[30]} 
          size="xl" 
          insetIcon={<Volume2 />}
          insetIconAtMin={<VolumeX />}
          insetIconAtMax={<Volume2 />}
        />
      </div>
    </div>
  ),
};

/**
 * Volume slider at zero showing the alternate icon.
 */
export const InsetIconAtMinimum: Story = {
  render: function InsetIconAtMinStory() {
    const [volume, setVolume] = useState([0]);
    
    return (
      <div className="w-[300px] space-y-4">
        <p className="text-sm text-muted-foreground">
          Drag to see icon swap at min/max
        </p>
        <Slider 
          value={volume}
          onValueChange={setVolume}
          size="md" 
          insetIcon={<Volume2 />}
          insetIconAtMin={<VolumeX />}
        />
        <p className="text-xs text-muted-foreground">
          Value: {volume[0]} - Icon shows {volume[0] === 0 ? "muted" : "volume"}
        </p>
      </div>
    );
  },
};

/**
 * Slider showcasing three different icons for min, partial, and max states.
 */
export const ThreeStateIcons: Story = {
  render: function ThreeStateIconsStory() {
    const [value, setValue] = useState([50]);
    
    return (
      <div className="w-[300px] space-y-4">
        <p className="text-sm text-muted-foreground">
          Drag to see icons change at min/partial/max states
        </p>
        <Slider 
          value={value}
          onValueChange={setValue}
          size="lg" 
          insetIcon={<SunMedium />}
          insetIconAtMin={<Moon />}
          insetIconAtMax={<Sun />}
        />
        <p className="text-xs text-muted-foreground">
          Value: {value[0]} - Icon shows {value[0] === 0 ? "moon (min)" : value[0] === 100 ? "sun (max)" : "sun-medium (partial)"}
        </p>
      </div>
    );
  },
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
          showValueIndicator="always"
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
      <div className="w-[300px] space-y-4 pt-10">
        <Slider
          value={value}
          onValueChange={setValue}
          showValueIndicator="always"
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
 * Temperature range selector.
 */
export const TemperatureRange: Story = {
  render: function TemperatureRangeStory() {
    const [range, setRange] = useState([18, 24]);

    return (
      <div className="w-[300px] space-y-4 pt-12">
        <div className="flex items-center gap-2">
          <Thermometer className="size-5 text-orange-500" />
          <span className="text-sm font-medium">Temperature Range</span>
        </div>
        <Slider
          value={range}
          onValueChange={setRange}
          min={10}
          max={35}
          showValueIndicator="always"
          formatValue={(v) => `${v}°C`}
        />
        <p className="text-sm text-muted-foreground">
          Keep room between {range[0]}°C and {range[1]}°C
        </p>
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
          showStops
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>$1000</span>
        </div>
      </div>
    );
  },
};

/**
 * Rating slider with custom labels.
 */
export const RatingSlider: Story = {
  render: function RatingSliderStory() {
    const [rating, setRating] = useState([3]);
    const labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

    return (
      <div className="w-[300px] space-y-4 pt-10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Rating</span>
          <span className="text-sm text-primary font-medium">
            {labels[rating[0] - 1]}
          </span>
        </div>
        <Slider
          value={rating}
          onValueChange={setRating}
          min={1}
          max={5}
          step={1}
          showStops
          showValueIndicator="always"
          formatValue={(v) => labels[v - 1]}
        />
      </div>
    );
  },
};

// ============================================================================
// Comparison Stories
// ============================================================================

/**
 * All sizes comparison.
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-12">
      <div className="flex items-end gap-8">
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Slider
              defaultValue={[50]}
              orientation="vertical"
              size={size}
              className="h-32"
            />
            <span className="text-xs text-muted-foreground">{size}</span>
          </div>
        ))}
      </div>
      <div className="space-y-4 w-[400px]">
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
          <div key={size} className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground w-6">{size}</span>
            <Slider defaultValue={[50]} size={size} className="flex-1" />
          </div>
        ))}
      </div>
    </div>
  ),
};

/**
 * Multiple features combined.
 */
export const FullFeatured: Story = {
  render: () => (
    <div className="w-[400px] space-y-4 pt-12">
      <div className="flex items-center justify-between">
        <span className="font-medium">Audio Equalizer</span>
        <button className="text-sm text-primary hover:underline">Reset</button>
      </div>
      <Slider
        defaultValue={[30, 70]}
        step={5}
        showStops
        showValueIndicator="hover"
        size="lg"
        formatValue={(v) => `${v}Hz`}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  ),
};

// ============================================================================
// Handle Shape Variants
// ============================================================================

/**
 * Handle shape variants showing the available options.
 * - Bar handle (default): MD3 vertical pill shape, works with all sizes
 * - Circular handle: Traditional circular knob, only available with xs size
 * - Knobless: No visible handle, the track itself is interactive
 */
export const HandleShapes: Story = {
  render: () => (
    <div className="w-[300px] space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Bar handle (default)</p>
        <Slider defaultValue={[50]} size="md" handleShape="bar" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Circular handle (xs only)</p>
        <Slider defaultValue={[50]} size="xs" handleShape="circular" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Knobless (all sizes)</p>
        <Slider defaultValue={[50]} size="md" handleShape="knobless" />
      </div>
    </div>
  ),
};

/**
 * Circular handles are only available with xs size.
 * The circular knob is positioned left so the end of the bar is centered on the knob.
 */
export const CircularHandleXsOnly: Story = {
  render: () => (
    <div className="w-[300px] space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Circular handle - xs size</p>
        <Slider defaultValue={[50]} size="xs" handleShape="circular" />
      </div>
      <div className="bg-muted/50 p-4 rounded-lg text-sm">
        <p className="font-medium text-orange-600">Note:</p>
        <p className="text-muted-foreground">
          Circular handles are only available with xs size. The knob is positioned left so the end of the bar is centered on the knob.
        </p>
      </div>
    </div>
  ),
};

/**
 * Knobless variant in all sizes.
 * No visible handle, the track itself is interactive.
 */
export const KnoblessSizes: Story = {
  render: () => (
    <div className="w-[300px] space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Extra Small (xs)</p>
        <Slider defaultValue={[50]} size="xs" handleShape="knobless" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small (sm)</p>
        <Slider defaultValue={[50]} size="sm" handleShape="knobless" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Medium (md)</p>
        <Slider defaultValue={[50]} size="md" handleShape="knobless" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Large (lg)</p>
        <Slider defaultValue={[50]} size="lg" handleShape="knobless" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Extra Large (xl)</p>
        <Slider defaultValue={[50]} size="xl" handleShape="knobless" />
      </div>
    </div>
  ),
};

// ============================================================================
// Value Indicator Sizes
// ============================================================================

/**
 * Value indicator size variants.
 * The indicator can be small, medium (default), or large.
 */
export const ValueIndicatorSizes: Story = {
  render: () => (
    <div className="w-[300px] space-y-12 pt-16">
      <div>
        <p className="text-sm text-muted-foreground mb-4">Small indicator (sm)</p>
        <Slider 
          defaultValue={[50]} 
          showValueIndicator="always" 
          valueIndicatorSize="sm" 
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Medium indicator (md) - default</p>
        <Slider 
          defaultValue={[50]} 
          showValueIndicator="always" 
          valueIndicatorSize="md" 
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Large indicator (lg)</p>
        <Slider 
          defaultValue={[50]} 
          showValueIndicator="always" 
          valueIndicatorSize="lg" 
        />
      </div>
    </div>
  ),
};

/**
 * Range slider with different indicator sizes.
 */
export const RangeIndicatorSizes: Story = {
  render: () => (
    <div className="w-[300px] space-y-12 pt-16">
      <div>
        <p className="text-sm text-muted-foreground mb-4">Range with small indicators</p>
        <Slider 
          defaultValue={[25, 75]} 
          showValueIndicator="always" 
          valueIndicatorSize="sm" 
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Range with large indicators</p>
        <Slider 
          defaultValue={[25, 75]} 
          showValueIndicator="always" 
          valueIndicatorSize="lg" 
        />
      </div>
    </div>
  ),
};

// ============================================================================
// Handle Press/Drag Animation
// ============================================================================

/**
 * Handle press and drag animation demo.
 * The bar handle has 2px corner radius and uses a thin focus ring.
 * It narrows when clicked/touched AND while dragging.
 * The circular handle scales down slightly when pressed.
 * The knobless variant has no visible handle.
 */
export const HandlePressAndDrag: Story = {
  render: () => (
      <div className="w-[300px] space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Bar handle:</strong> Click, hold, or drag to see it narrow from 4dp to 2dp with 6px gap from track.
        </p>
        <Slider defaultValue={[50]} size="md" handleShape="bar" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Circular handle (xs only):</strong> Click or drag to see the scale-down effect - positioned left so bar end is centered on knob.
        </p>
        <Slider defaultValue={[50]} size="xs" handleShape="circular" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Knobless:</strong> No visible handle - track itself is interactive.
        </p>
        <Slider defaultValue={[50]} size="md" handleShape="knobless" />
      </div>
      <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
        <p className="font-medium">Animation behaviors:</p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Bar handle narrows on pointer down (with 2px corners)</li>
          <li>Bar handle stays narrow during drag</li>
          <li>Bar handle returns to normal on pointer up</li>
          <li>Focus ring is removed - handle maintains appearance when focused</li>
          <li>Circular handle scales to 90% on press</li>
          <li>Circular handle only available with xs size</li>
          <li>Knobless has no visible handle to animate</li>
        </ul>
      </div>
    </div>
  ),
};
