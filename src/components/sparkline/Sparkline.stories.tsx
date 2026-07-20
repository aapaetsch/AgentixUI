import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Sparkline } from "./index";

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof Sparkline> = {
  title: "Components/Sparkline",
  component: Sparkline,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    width: { control: { type: "number", min: 32, max: 320 } },
    height: { control: { type: "number", min: 12, max: 120 } },
    strokeWidth: { control: { type: "number", min: 0.5, max: 6, step: 0.5 } },
    variant: { control: { select: ["line", "area", "bar"] } },
    fill: { control: "boolean" },
    color: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof Sparkline>;

// ============================================================================
// Sample datasets
// ============================================================================

const increasing = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const decreasing = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const volatile = [4, 8, 2, 9, 3, 7, 1, 10, 5, 6, 2, 8];
const sparse = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
const dense = Array.from({ length: 40 }, (_, i) => Math.sin(i / 2) + Math.cos(i / 3) + 2);

// ============================================================================
// Line variants
// ============================================================================

export const IncreasingLine: Story = {
  args: { data: increasing, width: 120, height: 32 },
};

export const DecreasingLine: Story = {
  args: { data: decreasing, width: 120, height: 32 },
};

export const VolatileLine: Story = {
  args: { data: volatile, width: 140, height: 36 },
};

// ============================================================================
// Area / fill
// ============================================================================

export const AreaFill: Story = {
  args: { data: volatile, width: 140, height: 40, fill: true },
};

export const AreaVariant: Story = {
  args: { data: increasing, width: 140, height: 40, variant: "area" },
};

// ============================================================================
// Bars
// ============================================================================

export const BarSparse: Story = {
  args: { data: sparse, width: 140, height: 32, variant: "bar" },
};

export const BarDense: Story = {
  args: { data: dense, width: 200, height: 32, variant: "bar" },
};

// ============================================================================
// currentColor usage (inherit Tailwind text color)
// ============================================================================

export const CurrentColor: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <span className="text-positive">
        <Sparkline data={increasing} width={140} height={32} fill />
      </span>
      <span className="text-negative">
        <Sparkline data={decreasing} width={140} height={32} fill />
      </span>
      <span className="text-primary">
        <Sparkline data={volatile} width={140} height={32} />
      </span>
    </div>
  ),
};

// ============================================================================
// Edge cases
// ============================================================================

export const EmptyData: Story = {
  args: { data: [], width: 120, height: 32 },
};

export const SinglePoint: Story = {
  args: { data: [42], width: 120, height: 32 },
};

export const TwoPoints: Story = {
  args: { data: [1, 9], width: 120, height: 32 },
};

export const FlatData: Story = {
  args: { data: [5, 5, 5, 5, 5], width: 120, height: 32, fill: true },
};

export const ExplicitDomain: Story = {
  args: { data: [1, 2, 3, 4, 5], width: 140, height: 32, min: 0, max: 100 },
};

// ============================================================================
// StatTile-like container (slot compatibility)
// ============================================================================

function MockStatTile({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 w-48">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="h-8">{children}</div>
    </div>
  );
}

export const InsideStatTile: Story = {
  render: () => (
    <div className="flex gap-4">
      <MockStatTile label="NVDA" value="$144.32">
        <span className="text-positive block h-full">
          <Sparkline data={increasing} width={160} height={32} fill className="w-full h-full" />
        </span>
      </MockStatTile>
      <MockStatTile label="TSLA" value="−$12.40">
        <span className="text-negative block h-full">
          <Sparkline data={decreasing} width={160} height={32} fill className="w-full h-full" />
        </span>
      </MockStatTile>
      <MockStatTile label="Volume" value="1.2M">
        <Sparkline data={sparse} width={160} height={32} variant="bar" className="w-full h-full" />
      </MockStatTile>
    </div>
  ),
};

// ============================================================================
// Responsive (preserveAspectRatio="none") — fills container width
// ============================================================================

export const ResponsiveWidth: Story = {
  render: () => (
    <div className="w-80">
      <Sparkline
        data={volatile}
        height={40}
        fill
        className="w-full text-primary"
      />
    </div>
  ),
};