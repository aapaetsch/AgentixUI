import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Wallet, TrendingUp } from "lucide-react";

import { StatTile } from "./stat-tile";
import { Sparkline } from "../../components/sparkline";

/**
 * # StatTile
 *
 * KPI tile for the investment-ops dashboard. Composes `Card`, `Badge`,
 * `NumericText`, `AnimatedNumber`, and an optional sparkline render slot.
 *
 * ## Features
 * - Currency / percent / number / compact / basis-points value formats
 * - Signed delta row with sign-up / sign-down arrow + colorized `NumericText`
 * - Optional leading icon slot
 * - Optional sparkline slot (chart lib renders into this slot)
 * - Loading state renders skeletons for value and delta
 * - Becomes interactive when `onClick` is provided (keyboard + click)
 */
const meta: Meta<typeof StatTile> = {
  title: "Templates/Investment-Ops/StatTile",
  component: StatTile,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    format: {
      control: "select",
      options: ["currency", "percent", "number", "compact", "basisPoints"],
    },
    deltaFormat: {
      control: "select",
      options: ["absolute", "percent"],
    },
    period: { control: "text" },
    loading: { control: "boolean" },
    deltaColorize: { control: "boolean" },
    align: {
      control: "select",
      options: ["left", "center", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatTile>;

// ============================================================================
// Basic Stories
// ============================================================================

export const Default: Story = {
  args: {
    label: "Portfolio Value",
    value: 234567.89,
    format: "currency",
    delta: 1234.56,
    period: "1D",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Buying Power",
    value: 50000,
    format: "currency",
    icon: <Wallet className="size-4 text-muted-foreground" />,
    period: "1D",
  },
};

export const NegativeDelta: Story = {
  args: {
    label: "Day P&L",
    value: -1234.56,
    format: "currency",
    delta: -1.23,
    deltaFormat: "percent",
    period: "1D",
  },
};

export const NoDelta: Story = {
  args: {
    label: "Cash",
    value: 12000,
    format: "currency",
    period: undefined,
  },
};

// ============================================================================
// Value formats
// ============================================================================

export const PercentFormat: Story = {
  args: {
    label: "YTD Return",
    value: 8.42,
    format: "percent",
    delta: 0.31,
    deltaFormat: "percent",
    period: "1M",
    icon: <TrendingUp className="size-4 text-muted-foreground" />,
  },
};

export const CompactFormat: Story = {
  args: {
    label: "Volume",
    value: 12345678,
    format: "compact",
    period: "1D",
  },
};

export const BasisPointsFormat: Story = {
  args: {
    label: "Spread",
    value: 1.25,
    format: "basisPoints",
    period: "1D",
  },
};

// ============================================================================
// Slots
// ============================================================================

export const WithSparkline: Story = {
  render: () => (
    <div className="w-[18rem]">
      <StatTile
        label="AAPL"
        value={187.32}
        format="currency"
        delta={2.14}
        period="1D"
        sparkline={
          <Sparkline
            data={[180, 181, 183, 182, 185, 184, 186, 187.32]}
            width={256}
            height={36}
            variant="area"
            fill
          />
        }
      />
    </div>
  ),
};

// ============================================================================
// States
// ============================================================================

export const Loading: Story = {
  args: {
    label: "Portfolio Value",
    value: 0,
    format: "currency",
    delta: 0,
    loading: true,
  },
};

export const Interactive: Story = {
  args: {
    label: "Total P&L",
    value: 8456.21,
    format: "currency",
    delta: 4.32,
    deltaFormat: "percent",
    period: "YTD",
    onClick: () => {},
  },
};

// ============================================================================
// Layout
// ============================================================================

export const InlineGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <StatTile label="Equity" value={234000} format="currency" delta={2.1} deltaFormat="percent" />
      <StatTile label="Cash" value={12000} format="currency" />
      <StatTile label="Day P&L" value={-1234} format="currency" delta={-1.2} deltaFormat="percent" />
      <StatTile label="Total P&L" value={8000} format="currency" delta={4.3} deltaFormat="percent" />
    </div>
  ),
};

// ============================================================================
// Alignment
// ============================================================================

export const Alignments: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[44rem]">
      <StatTile label="Portfolio Value" value={234567.89} delta={1234.56} period="1D" align="left" />
      <StatTile label="Portfolio Value" value={234567.89} delta={1234.56} period="1D" align="center" />
      <StatTile label="Portfolio Value" value={234567.89} delta={1234.56} period="1D" align="right" />
    </div>
  ),
};