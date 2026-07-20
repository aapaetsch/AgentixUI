import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MiniBars } from "./index";

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof MiniBars> = {
  title: "Components/MiniBars",
  component: MiniBars,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    width: { control: { type: "number", min: 32, max: 320 } },
    height: { control: { type: "number", min: 8, max: 80 } },
    gap: { control: { type: "number", min: 0, max: 8 } },
    color: { control: "color" },
    positiveColor: { control: "color" },
    negativeColor: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof MiniBars>;

// ============================================================================
// Sample datasets
// ============================================================================

const positiveOnly = [2, 4, 3, 6, 5, 8, 7, 9, 6, 8];
const mixedSign = [3, -2, 4, -5, 2, -1, 5, -3, 4, -2, 6, -4];
const allZeros = [0, 0, 0, 0, 0, 0];
const manyBars = Array.from({ length: 50 }, (_, i) => Math.sin(i / 3) * 4 + Math.cos(i / 7) * 3);

// ============================================================================
// Positive-only
// ============================================================================

export const PositiveOnly: Story = {
  args: { data: positiveOnly, width: 160, height: 20 },
};

// ============================================================================
// Divergent bars
// ============================================================================

export const MixedSignDivergent: Story = {
  args: {
    data: mixedSign,
    width: 180,
    height: 24,
    positiveColor: "hsl(158 64% 52%)",
    negativeColor: "hsl(347 77% 50%)",
  },
};

// ============================================================================
// currentColor usage
// ============================================================================

export const CurrentColor: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <span className="text-positive">
        <MiniBars data={positiveOnly} width={160} height={18} />
      </span>
      <span className="text-negative">
        <MiniBars data={mixedSign} width={160} height={18} />
      </span>
    </div>
  ),
};

// ============================================================================
// Edge cases
// ============================================================================

export const AllZeros: Story = {
  args: { data: allZeros, width: 120, height: 16 },
};

export const SingleBar: Story = {
  args: { data: [7], width: 120, height: 16 },
};

export const EmptyData: Story = {
  args: { data: [], width: 120, height: 16 },
};

// ============================================================================
// Dense data
// ============================================================================

export const FiftyBars: Story = {
  args: { data: manyBars, width: 240, height: 24, positiveColor: "#22c55e", negativeColor: "#ef4444" },
};

// ============================================================================
// Explicit min / max
// ============================================================================

export const ExplicitDomain: Story = {
  args: {
    data: mixedSign,
    width: 180,
    height: 24,
    min: -10,
    max: 10,
    positiveColor: "#22c55e",
    negativeColor: "#ef4444",
  },
};