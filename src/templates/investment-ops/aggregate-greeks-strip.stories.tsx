import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { AggregateGreeksStrip } from "./aggregate-greeks-strip";
import type { OptionPosition } from "../../lib/finance-types";

const meta: Meta<typeof AggregateGreeksStrip> = {
  title: "Templates/Options/AggregateGreeksStrip",
  component: AggregateGreeksStrip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      options: ["horizontal", "vertical", "grid", "compact"],
      control: { type: "radio" },
    },
    size: {
      options: ["comfortable", "compact"],
      control: { type: "radio" },
    },
    deltaMode: {
      options: ["auto", "delta", "deltaDollars"],
      control: { type: "radio" },
    },
  },
};
export default meta;
type Story = StoryObj<typeof AggregateGreeksStrip>;

const positions: OptionPosition[] = [
  {
    root: "SPY",
    type: "call",
    strike: 410,
    expiry: Date.now() + 21 * 86_400_000,
    contracts: 2,
    averageCost: 5.2,
    markPrice: 6.4,
    marketValue: 1280,
    unrealizedPnL: 240,
    unrealizedPnLPercent: 23,
    daysToExpiry: 21,
    status: "open",
    greeks: { delta: 0.55, gamma: 0.04, theta: -3.4, vega: 0.21 },
    delta: 0.55,
  },
  {
    root: "QQQ",
    type: "put",
    strike: 380,
    expiry: Date.now() + 3 * 86_400_000,
    contracts: -1,
    averageCost: 4.0,
    markPrice: 2.1,
    marketValue: -210,
    unrealizedPnL: 190,
    unrealizedPnLPercent: 47,
    daysToExpiry: 3,
    status: "open",
    greeks: { delta: -0.18, theta: -8.2, vega: 0.04 },
    delta: -0.18,
  },
];

export const Default: Story = {
  args: { positions, spot: 400 },
  render: (args) => <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>,
};

export const NoSpot: Story = {
  args: { positions },
  render: (args) => <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>,
};

export const Loading: Story = {
  args: { positions, spot: 400, loading: true },
  render: (args) => <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>,
};

export const EmptyPositions: Story = {
  args: { positions: [], spot: 400 },
  render: (args) => <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>,
};

export const AllMissingGreeks: Story = {
  name: "All missing greeks",
  args: {
    positions: [
      {
        root: "SPY",
        type: "call",
        strike: 410,
        expiry: Date.now() + 21 * 86_400_000,
        contracts: 3,
        averageCost: 5.0,
        markPrice: 6.0,
        marketValue: 1800,
        unrealizedPnL: 300,
        unrealizedPnLPercent: 20,
        daysToExpiry: 21,
        status: "open",
      },
    ],
    spot: 400,
  },
  render: (args) => <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>,
};

export const SingleShortOnly: Story = {
  name: "Single short-only position",
  args: {
    positions: [
      {
        root: "AAPL",
        type: "put",
        strike: 180,
        expiry: Date.now() + 7 * 86_400_000,
        contracts: -4,
        averageCost: 2.1,
        markPrice: 1.4,
        marketValue: -560,
        unrealizedPnL: 280,
        unrealizedPnLPercent: 33,
        daysToExpiry: 7,
        status: "open",
        greeks: { delta: -0.42, gamma: 0.05, theta: -6.1, vega: 0.12 },
      },
    ],
    spot: 182,
  },
  render: (args) => <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>,
};

export const CurrencyNonUSD: Story = {
  name: "Non-USD currency (EUR)",
  args: { positions, spot: 400, currency: "EUR" },
  render: (args) => <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>,
};

export const WrappedLayout: Story = {
  name: "Wrapped layout (narrow container)",
  args: { positions, spot: 400 },
  render: (args) => (
    <div className="w-[14rem]"><AggregateGreeksStrip {...args} /></div>
  ),
};

/* -------------------------------------------------------------------------- *
 * Layout variants
 * -------------------------------------------------------------------------- */

export const VerticalLayout: Story = {
  name: "Vertical layout (side rail)",
  args: { positions, spot: 400, layout: "vertical", showHeader: true },
  render: (args) => (
    <div className="w-[16rem]"><AggregateGreeksStrip {...args} /></div>
  ),
};

export const GridLayout: Story = {
  name: "Grid layout (responsive wrap)",
  args: { positions, spot: 400, layout: "grid" },
  render: (args) => (
    <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>
  ),
};

export const CompactLayout: Story = {
  name: "Compact strip (inline readout)",
  args: { positions, spot: 400, layout: "compact", size: "compact" },
  render: (args) => (
    <div className="w-[36rem]"><AggregateGreeksStrip {...args} /></div>
  ),
};

export const CompactComfortableSize: Story = {
  name: "Compact layout, comfortable size",
  args: { positions, spot: 400, layout: "compact", size: "comfortable" },
  render: (args) => (
    <div className="w-[40rem]"><AggregateGreeksStrip {...args} /></div>
  ),
};

/* -------------------------------------------------------------------------- *
 * Header + deltaMode variants
 * -------------------------------------------------------------------------- */

export const WithHeader: Story = {
  name: "With header + headerRight slot",
  args: {
    positions,
    spot: 400,
    layout: "horizontal",
    showHeader: true,
    headerRight: (
      <span className="font-mono text-[0.625rem] uppercase tracking-wider text-muted-foreground">
        SPY · 420.12
      </span>
    ),
  },
  render: (args) => (
    <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>
  ),
};

export const RawDeltaMode: Story = {
  name: "deltaMode='delta' (raw Net Δ even with spot)",
  args: { positions, spot: 400, deltaMode: "delta" },
  render: (args) => (
    <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>
  ),
};

export const DeltaDollarsOnly: Story = {
  name: "deltaMode='deltaDollars' (raw Net Δ missing)",
  args: { positions, deltaMode: "deltaDollars" },
  render: (args) => (
    <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>
  ),
};

/* -------------------------------------------------------------------------- *
 * Loading + polish
 * -------------------------------------------------------------------------- */

export const LoadingSkeleton: Story = {
  name: "Loading (skeleton cells)",
  args: { positions, spot: 400, loading: true, layout: "horizontal" },
  render: (args) => (
    <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>
  ),
};

export const LoadingSkeletonVertical: Story = {
  name: "Loading skeleton (vertical layout)",
  args: {
    positions,
    spot: 400,
    loading: true,
    layout: "vertical",
    showHeader: true,
  },
  render: (args) => (
    <div className="w-[16rem]"><AggregateGreeksStrip {...args} /></div>
  ),
};

export const LoadingSkeletonCompact: Story = {
  name: "Loading skeleton (compact layout)",
  args: {
    positions,
    spot: 400,
    loading: true,
    layout: "compact",
    size: "compact",
  },
  render: (args) => (
    <div className="w-[36rem]"><AggregateGreeksStrip {...args} /></div>
  ),
};

export const NoColorize: Story = {
  name: "No colorize (monochrome)",
  args: { positions, spot: 400, colorize: false },
  render: (args) => (
    <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>
  ),
};

export const EmptyWithHeader: Story = {
  name: "Empty (with header shown)",
  args: { positions: [], spot: 400, showHeader: true },
  render: (args) => (
    <div className="w-[44rem]"><AggregateGreeksStrip {...args} /></div>
  ),
};

export const DarkMode: Story = {
  name: "Dark mode (vertical + header)",
  args: {
    positions,
    spot: 400,
    layout: "vertical",
    showHeader: true,
  },
  render: (args) => (
    <div className="dark w-[16rem] rounded-lg bg-background p-4">
      <AggregateGreeksStrip {...args} />
    </div>
  ),
};