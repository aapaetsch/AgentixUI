import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  LinearProgress,
  valueFormatters,
  useAnimatedProgress,
} from "./index";

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof LinearProgress> = {
  title: "Components/Progress/LinearProgress",
  component: LinearProgress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100 },
    },
    min: {
      control: "number",
    },
    max: {
      control: "number",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
    },
    rounded: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
    },
    showValue: {
      control: "boolean",
    },
    valuePosition: {
      control: "select",
      options: ["top", "bottom", "left", "right", "inside"],
    },
    labelPosition: {
      control: "select",
      options: ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"],
    },
    indeterminate: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LinearProgress>;

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  args: {
    value: 60,
    className: "w-64",
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    label: "Loading...",
    className: "w-64",
  },
};

export const WithValue: Story = {
  args: {
    value: 75,
    showValue: true,
    className: "w-64",
  },
};

export const WithLabelAndValue: Story = {
  args: {
    value: 75,
    label: "Progress",
    showValue: true,
    className: "w-64",
  },
};

// ============================================================================
// Size Variants
// ============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <LinearProgress value={60} size="xs" />
      <LinearProgress value={60} size="sm" />
      <LinearProgress value={60} size="md" />
      <LinearProgress value={60} size="lg" />
      <LinearProgress value={60} size="xl" />
    </div>
  ),
};

// ============================================================================
// Color Variants
// ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <LinearProgress value={60} variant="default" label="Default" showValue />
      <LinearProgress value={60} variant="success" label="Success" showValue />
      <LinearProgress value={60} variant="warning" label="Warning" showValue />
      <LinearProgress value={60} variant="error" label="Error" showValue />
      <LinearProgress value={60} variant="info" label="Info" showValue />
    </div>
  ),
};

// ============================================================================
// Rounded Variants
// ============================================================================

export const RoundedVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <LinearProgress value={60} rounded="none" label="None" />
      <LinearProgress value={60} rounded="sm" label="Small" />
      <LinearProgress value={60} rounded="md" label="Medium" />
      <LinearProgress value={60} rounded="lg" label="Large" />
      <LinearProgress value={60} rounded="full" label="Full" />
    </div>
  ),
};

// ============================================================================
// Value Positions
// ============================================================================

export const ValuePositions: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-64">
      <LinearProgress value={75} showValue valuePosition="left" label="Left" />
      <LinearProgress value={75} showValue valuePosition="right" label="Right" />
      <LinearProgress value={75} showValue valuePosition="top" label="Top" />
      <LinearProgress value={75} showValue valuePosition="bottom" label="Bottom" />
      <LinearProgress value={75} showValue valuePosition="inside" size="xl" label="Inside" />
    </div>
  ),
};

// ============================================================================
// Label Positions
// ============================================================================

export const LabelPositions: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-64">
      <LinearProgress value={75} label="Top" labelPosition="top" />
      <LinearProgress value={75} label="Top Left" labelPosition="top-left" showValue valuePosition="top" />
      <LinearProgress value={75} label="Top Right" labelPosition="top-right" />
      <LinearProgress value={75} label="Bottom" labelPosition="bottom" />
      <LinearProgress value={75} label="Left" labelPosition="left" />
      <LinearProgress value={75} label="Right" labelPosition="right" />
    </div>
  ),
};

// ============================================================================
// Value Formatters
// ============================================================================

export const CustomFormatters: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <LinearProgress
        value={75}
        showValue
        valueFormatter={valueFormatters.percentage}
        label="Percentage"
      />
      <LinearProgress
        value={75}
        showValue
        valueFormatter={valueFormatters.value}
        label="Raw Value"
      />
      <LinearProgress
        value={75}
        showValue
        valueFormatter={valueFormatters.fraction}
        label="Fraction"
      />
      <LinearProgress
        value={75}
        showValue
        valueFormatter={valueFormatters.decimal}
        label="Decimal"
      />
      <LinearProgress
        value={75}
        max={100}
        showValue
        valueFormatter={(v, min, max) => `${v}MB / ${max}MB`}
        label="Custom (MB)"
      />
    </div>
  ),
};

// ============================================================================
// Gradients
// ============================================================================

export const WithGradient: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <LinearProgress
        value={75}
        label="Blue to Purple"
        showValue
        gradient={{
          stops: [
            { offset: "0%", color: "#3b82f6" },
            { offset: "100%", color: "#8b5cf6" },
          ],
        }}
      />
      <LinearProgress
        value={75}
        label="Rainbow"
        showValue
        gradient={{
          stops: [
            { offset: "0%", color: "#ef4444" },
            { offset: "25%", color: "#f59e0b" },
            { offset: "50%", color: "#22c55e" },
            { offset: "75%", color: "#3b82f6" },
            { offset: "100%", color: "#8b5cf6" },
          ],
        }}
      />
      <LinearProgress
        value={75}
        label="Green Gradient"
        showValue
        gradient={{
          stops: [
            { offset: "0%", color: "#22c55e" },
            { offset: "100%", color: "#15803d" },
          ],
        }}
      />
    </div>
  ),
};

// ============================================================================
// Vertical Orientation
// ============================================================================

export const Vertical: Story = {
  render: () => (
    <div className="flex gap-8 h-48">
      <LinearProgress value={25} orientation="vertical" height="100%" />
      <LinearProgress value={50} orientation="vertical" variant="success" height="100%" />
      <LinearProgress value={75} orientation="vertical" variant="warning" height="100%" />
      <LinearProgress value={100} orientation="vertical" variant="error" height="100%" />
    </div>
  ),
};

export const VerticalSizes: Story = {
  render: () => (
    <div className="flex gap-4 h-48">
      <LinearProgress value={60} orientation="vertical" size="xs" height="100%" />
      <LinearProgress value={60} orientation="vertical" size="sm" height="100%" />
      <LinearProgress value={60} orientation="vertical" size="md" height="100%" />
      <LinearProgress value={60} orientation="vertical" size="lg" height="100%" />
      <LinearProgress value={60} orientation="vertical" size="xl" height="100%" />
    </div>
  ),
};

export const VerticalWithLabels: Story = {
  render: () => (
    <div className="flex gap-8 h-48">
      <LinearProgress value={75} orientation="vertical" height="100%" label="CPU" labelPosition="bottom" showValue valuePosition="top" />
      <LinearProgress value={60} orientation="vertical" height="100%" label="Memory" labelPosition="bottom" showValue valuePosition="top" />
      <LinearProgress value={45} orientation="vertical" height="100%" label="Disk" labelPosition="bottom" showValue valuePosition="top" />
      <LinearProgress value={90} orientation="vertical" height="100%" label="Network" labelPosition="bottom" showValue valuePosition="top" />
    </div>
  ),
};

// ============================================================================
// Indeterminate State
// ============================================================================

export const Indeterminate: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <LinearProgress indeterminate label="Loading..." />
      <LinearProgress indeterminate variant="success" />
      <LinearProgress indeterminate variant="info" />
    </div>
  ),
};

// ============================================================================
// Animated Progress
// ============================================================================

const AnimatedLoadingDemo = () => {
  const { value } = useAnimatedProgress({
    from: 0,
    to: 100,
    duration: 2000,
    loop: true,
  });

  return (
    <div className="flex flex-col gap-4 w-64">
      <LinearProgress value={value} showValue label="Auto-looping" />
      <LinearProgress value={value} variant="success" />
      <LinearProgress value={value} variant="info" />
    </div>
  );
};

export const AnimatedLoading: Story = {
  render: () => <AnimatedLoadingDemo />,
};

const AnimatedPingPongDemo = () => {
  const { value } = useAnimatedProgress({
    from: 0,
    to: 100,
    duration: 1500,
    loop: true,
    reverse: true,
    easing: "easeInOut",
  });

  return (
    <div className="flex flex-col gap-4 w-64">
      <LinearProgress value={value} showValue label="Ping-Pong Effect" />
      <LinearProgress
        value={value}
        gradient={{
          stops: [
            { offset: "0%", color: "#3b82f6" },
            { offset: "100%", color: "#8b5cf6" },
          ],
        }}
      />
    </div>
  );
};

export const AnimatedPingPong: Story = {
  render: () => <AnimatedPingPongDemo />,
};

const AnimatedControlledDemo = () => {
  const { value, start, pause, reset, isAnimating } = useAnimatedProgress({
    from: 0,
    to: 100,
    duration: 3000,
    autoStart: false,
    easing: "easeOut",
  });

  return (
    <div className="flex flex-col gap-4 w-64">
      <LinearProgress value={value} showValue label="Controlled Animation" />
      <div className="flex gap-2">
        <button
          onClick={isAnimating ? pause : start}
          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          {isAnimating ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export const AnimatedControlled: Story = {
  render: () => <AnimatedControlledDemo />,
};

const FileUploadSimulationDemo = () => {
  const [uploadState, setUploadState] = React.useState<"idle" | "uploading" | "complete">("idle");
  const { value, start, reset } = useAnimatedProgress({
    from: 0,
    to: 100,
    duration: 4000,
    autoStart: false,
    easing: "linear",
    onComplete: () => setUploadState("complete"),
  });

  const handleUpload = () => {
    setUploadState("uploading");
    reset();
    start();
  };

  const handleReset = () => {
    setUploadState("idle");
    reset();
  };

  return (
    <div className="flex flex-col gap-4 w-80 p-4 border rounded-lg">
      <div className="text-sm font-medium">File: document.pdf (2.4 MB)</div>
      <LinearProgress
        value={value}
        showValue
        variant={uploadState === "complete" ? "success" : "default"}
        valueFormatter={(v) => uploadState === "complete" ? "Complete!" : `${Math.round(v)}%`}
      />
      <div className="flex gap-2">
        <button
          onClick={handleUpload}
          disabled={uploadState === "uploading"}
          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {uploadState === "uploading" ? "Uploading..." : "Upload"}
        </button>
        {uploadState !== "idle" && (
          <button
            onClick={handleReset}
            className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export const FileUploadSimulation: Story = {
  render: () => <FileUploadSimulationDemo />,
};

// ============================================================================
// Custom Dimensions
// ============================================================================

export const CustomDimensions: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <LinearProgress value={75} width="300px" height="20px" label="Custom width & height" showValue />
      <LinearProgress value={75} width="100%" height="8px" label="Full width" />
    </div>
  ),
};
