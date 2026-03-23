import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  CircularProgress,
  valueFormatters,
  useAnimatedProgress,
} from "./index";

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof CircularProgress> = {
  title: "Free/Components/Progress/CircularProgress",
  component: CircularProgress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100 },
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
    },
    arcType: {
      control: "select",
      options: ["full", "three-quarter", "half", "quarter"],
    },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
    },
    lineCap: {
      control: "select",
      options: ["round", "butt", "square"],
    },
    strokeWidth: {
      control: { type: "range", min: 1, max: 20 },
    },
    startAngle: {
      control: { type: "range", min: 0, max: 360 },
    },
    showValue: {
      control: "boolean",
    },
    indeterminate: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CircularProgress>;

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => <CircularProgress value={75} />,
};

export const WithValue: Story = {
  render: () => <CircularProgress value={75} showValue />,
};

export const WithLabel: Story = {
  render: () => <CircularProgress value={75} showValue label="Complete" />,
};

// ============================================================================
// Size Variants
// ============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CircularProgress value={75} size="xs" />
      <CircularProgress value={75} size="sm" />
      <CircularProgress value={75} size="md" showValue />
      <CircularProgress value={75} size="lg" showValue />
      <CircularProgress value={75} size="xl" showValue label="XL" />
      <CircularProgress value={75} size="2xl" showValue label="2XL" />
    </div>
  ),
};

// ============================================================================
// Color Variants
// ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CircularProgress value={75} variant="default" showValue />
      <CircularProgress value={75} variant="success" showValue />
      <CircularProgress value={75} variant="warning" showValue />
      <CircularProgress value={75} variant="error" showValue />
      <CircularProgress value={75} variant="info" showValue />
    </div>
  ),
};

// ============================================================================
// Arc Types
// ============================================================================

export const ArcTypes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={75} arcType="full" showValue size="lg" />
        <span className="text-sm text-muted-foreground">Full</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={75} arcType="three-quarter" showValue size="lg" />
        <span className="text-sm text-muted-foreground">Three Quarter</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={75} arcType="half" showValue size="lg" />
        <span className="text-sm text-muted-foreground">Half</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={75} arcType="quarter" showValue size="lg" />
        <span className="text-sm text-muted-foreground">Quarter</span>
      </div>
    </div>
  ),
};

// ============================================================================
// Line Caps
// ============================================================================

export const LineCaps: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={75} lineCap="round" showValue size="lg" strokeWidth={8} />
        <span className="text-sm text-muted-foreground">Round</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={75} lineCap="butt" showValue size="lg" strokeWidth={8} />
        <span className="text-sm text-muted-foreground">Butt</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={75} lineCap="square" showValue size="lg" strokeWidth={8} />
        <span className="text-sm text-muted-foreground">Square</span>
      </div>
    </div>
  ),
};

// ============================================================================
// Stroke Widths
// ============================================================================

export const StrokeWidths: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CircularProgress value={75} strokeWidth={2} showValue />
      <CircularProgress value={75} strokeWidth={4} showValue />
      <CircularProgress value={75} strokeWidth={6} showValue />
      <CircularProgress value={75} strokeWidth={8} showValue />
      <CircularProgress value={75} strokeWidth={12} showValue />
    </div>
  ),
};

// ============================================================================
// Start Angles
// ============================================================================

export const StartAngles: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={75} startAngle={0} arcType="half" showValue size="lg" />
        <span className="text-sm text-muted-foreground">0° (Top)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={75} startAngle={90} arcType="half" showValue size="lg" />
        <span className="text-sm text-muted-foreground">90° (Right)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={75} startAngle={180} arcType="half" showValue size="lg" />
        <span className="text-sm text-muted-foreground">180° (Bottom)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress value={75} startAngle={270} arcType="half" showValue size="lg" />
        <span className="text-sm text-muted-foreground">270° (Left)</span>
      </div>
    </div>
  ),
};

// ============================================================================
// Gradients
// ============================================================================

export const WithGradient: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CircularProgress
        value={75}
        showValue
        size="xl"
        gradient={{
          stops: [
            { offset: "0%", color: "#3b82f6" },
            { offset: "100%", color: "#8b5cf6" },
          ],
        }}
      />
      <CircularProgress
        value={75}
        showValue
        size="xl"
        gradient={{
          stops: [
            { offset: "0%", color: "#22c55e" },
            { offset: "100%", color: "#15803d" },
          ],
        }}
      />
      <CircularProgress
        value={75}
        showValue
        size="xl"
        gradient={{
          stops: [
            { offset: "0%", color: "#ef4444" },
            { offset: "50%", color: "#f59e0b" },
            { offset: "100%", color: "#22c55e" },
          ],
        }}
      />
    </div>
  ),
};

// ============================================================================
// Indeterminate State
// ============================================================================

export const Indeterminate: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CircularProgress indeterminate size="sm" />
      <CircularProgress indeterminate />
      <CircularProgress indeterminate size="lg" variant="success" />
      <CircularProgress indeterminate size="xl" variant="info" />
    </div>
  ),
};

// ============================================================================
// Custom Children
// ============================================================================

export const WithChildren: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CircularProgress value={75} size="xl">
        <div className="text-center">
          <div className="text-2xl font-bold">75</div>
          <div className="text-xs text-muted-foreground">Points</div>
        </div>
      </CircularProgress>
      <CircularProgress value={42} size="xl" variant="success">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">42</div>
          <div className="text-xs text-muted-foreground">Days</div>
        </div>
      </CircularProgress>
    </div>
  ),
};

// ============================================================================
// Value Formatters
// ============================================================================

export const CustomFormatters: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CircularProgress
        value={75}
        showValue
        size="lg"
        valueFormatter={valueFormatters.percentage}
        label="Percentage"
      />
      <CircularProgress
        value={75}
        showValue
        size="lg"
        valueFormatter={valueFormatters.fraction}
        label="Fraction"
      />
      <CircularProgress
        value={2.5}
        min={0}
        max={5}
        showValue
        size="lg"
        valueFormatter={(v) => `${v}/5⭐`}
        label="Rating"
      />
    </div>
  ),
};

// ============================================================================
// Animated Progress
// ============================================================================

const AnimatedCircularDemo = () => {
  const { value } = useAnimatedProgress({
    from: 0,
    to: 100,
    duration: 2000,
    loop: true,
    easing: "linear",
  });

  return (
    <div className="flex items-center gap-4">
      <CircularProgress value={value} showValue size="lg" />
      <CircularProgress value={value} showValue size="lg" variant="success" arcType="three-quarter" />
      <CircularProgress value={value} showValue size="lg" variant="info" arcType="half" />
    </div>
  );
};

export const AnimatedCircular: Story = {
  render: () => <AnimatedCircularDemo />,
};
