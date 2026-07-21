import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { OptionPositionCard } from "./option-position-card";
import type { OptionPosition } from "../../lib/finance-types";

const meta: Meta<typeof OptionPositionCard> = {
  title: "Templates/Options/OptionPositionCard",
  component: OptionPositionCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { showHoverDetails: { control: "boolean" } },
};
export default meta;
type Story = StoryObj<typeof OptionPositionCard>;

const longCall: OptionPosition = {
  root: "SPY",
  type: "call",
  strike: 400,
  expiry: Date.now() + 30 * 86_400_000,
  contracts: 1,
  averageCost: 5.5,
  markPrice: 7.8,
  marketValue: 780,
  unrealizedPnL: 230,
  unrealizedPnLPercent: 41.8,
  daysToExpiry: 30,
  status: "open",
  greeks: { delta: 0.55, gamma: 0.05, theta: -3.1, vega: 0.22 },
  delta: 0.55,
};

export const LongCall: Story = {
  args: { position: longCall, spotPrice: 410, showHoverDetails: true },
  render: (args) => <div className="w-[28rem]"><OptionPositionCard {...args} /></div>,
};

const shortPut: OptionPosition = {
  ...longCall,
  root: "QQQ",
  type: "put",
  strike: 380,
  contracts: -1,
  averageCost: 4.0,
  markPrice: 2.5,
  unrealizedPnL: 150,
  unrealizedPnLPercent: 37.5,
  greeks: { delta: -0.32, gamma: 0.06, theta: -2.4, vega: 0.18 },
  delta: -0.32,
};

export const ShortPut: Story = {
  args: { position: shortPut, spotPrice: 400 },
  render: (args) => <div className="w-[28rem]"><OptionPositionCard {...args} /></div>,
};

export const NoPayoff: Story = {
  args: { position: longCall, spotPrice: 410, showPayoff: false },
  render: (args) => <div className="w-[28rem]"><OptionPositionCard {...args} /></div>,
};

// Short put recorded with a NEGATIVE averageCost (credit recorded as a negative
// number, per `OptionPosition.averageCost` JSDoc). Verifies the `Math.abs`
// normalization in the leg builder: max profit should equal the credit
// received (finite) and max loss should be large and negative (strikes down
// to ~0 on the grid).
const shortPutNegativeCredit: OptionPosition = {
  ...shortPut,
  root: "IWM",
  averageCost: -4.0,
};

export const ShortPutNegativeCredit: Story = {
  args: { position: shortPutNegativeCredit, spotPrice: 400 },
  render: (args) => <div className="w-[28rem]"><OptionPositionCard {...args} /></div>,
};

// Position missing greeks entirely (no `greeks` object and no `delta` field).
// `GreeksDisplay` should render its em-dash fallback for every greek.
const longCallNoGreeks: OptionPosition = {
  ...longCall,
  root: "DIA",
  greeks: undefined,
  delta: undefined,
};

export const NoGreeks: Story = {
  args: { position: longCallNoGreeks, spotPrice: 410 },
  render: (args) => <div className="w-[28rem]"><OptionPositionCard {...args} /></div>,
};

export const CustomizedComposition: Story = {
  args: {
    position: longCall,
    spotPrice: 410,
    currency: "CAD",
    title: "Covered call",
    headerRight: <button type="button">Manage</button>,
    showStatus: false,
    labels: { maxProfit: "Upside", maxLoss: "Downside", quantity: "Contracts" },
    payoffDiagramProps: { variant: "line", height: 150, strokeWidth: 2 },
    breakevenProps: { label: "Break-even", precision: 1 },
    greeksProps: { labelStyle: "both", size: "sm" },
  },
  render: (args) => <div className="w-[32rem]"><OptionPositionCard {...args} /></div>,
};
