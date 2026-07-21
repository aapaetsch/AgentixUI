import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PayoffBundleCard } from "./payoff-bundle-card";
import type { OptionLeg } from "../../lib/finance-types";

const meta: Meta<typeof PayoffBundleCard> = {
  title: "Templates/Options/PayoffBundleCard",
  component: PayoffBundleCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { showHoverDetails: { control: "boolean" } },
};
export default meta;
type Story = StoryObj<typeof PayoffBundleCard>;

const ironCondor: OptionLeg[] = [
  { id: "1", side: "buy", type: "put", strike: 360, expiry: Date.now(), contracts: 1, limitPrice: 1 },
  { id: "2", side: "sell", type: "put", strike: 380, expiry: Date.now(), contracts: 1, limitPrice: 3 },
  { id: "3", side: "sell", type: "call", strike: 420, expiry: Date.now(), contracts: 1, limitPrice: 3 },
  { id: "4", side: "buy", type: "call", strike: 440, expiry: Date.now(), contracts: 1, limitPrice: 1 },
];

const longCall: OptionLeg[] = [
  { id: "1", side: "buy", type: "call", strike: 400, expiry: Date.now(), contracts: 1, limitPrice: 5.5 },
];

export const IronCondor: Story = {
  args: { legs: ironCondor, spotPrice: 400, currentPnL: 80, showHoverDetails: true },
  render: (args) => <div className="w-[28rem]"><PayoffBundleCard {...args} /></div>,
};

export const LongCall: Story = {
  args: { legs: longCall, spotPrice: 410, currentPnL: 55 },
  render: (args) => <div className="w-[28rem]"><PayoffBundleCard {...args} /></div>,
};

// Asymmetric iron condor: wider put wing (360/380) than call wing (425/435).
// Exercises max profit / max loss rendering when the upside and downside
// risk rails differ in magnitude.
const unbalancedIronCondor: OptionLeg[] = [
  { id: "1", side: "buy", type: "put", strike: 360, expiry: Date.now(), contracts: 1, limitPrice: 0.5 },
  { id: "2", side: "sell", type: "put", strike: 380, expiry: Date.now(), contracts: 1, limitPrice: 2.5 },
  { id: "3", side: "sell", type: "call", strike: 425, expiry: Date.now(), contracts: 1, limitPrice: 1.5 },
  { id: "4", side: "buy", type: "call", strike: 435, expiry: Date.now(), contracts: 1, limitPrice: 0.5 },
];

export const UnbalancedIronCondor: Story = {
  args: { legs: unbalancedIronCondor, spotPrice: 405, currentPnL: 40 },
  render: (args) => <div className="w-[28rem]"><PayoffBundleCard {...args} /></div>,
};

// Net-zero (no-premium) calendar-style position: long and short calls at the
// same strike with offsetting limitPrices. Exercises the "no debit/credit
// badge" path — `netDebitCredit` is omitted and `Math.abs(net) > 0` is false.
const netZeroCallSpread: OptionLeg[] = [
  { id: "1", side: "buy", type: "call", strike: 400, expiry: Date.now(), contracts: 1, limitPrice: 5 },
  { id: "2", side: "sell", type: "call", strike: 400, expiry: Date.now() + 86_400_000, contracts: 1, limitPrice: 5 },
];

export const NetZeroNoBadge: Story = {
  args: { legs: netZeroCallSpread, spotPrice: 400 },
  render: (args) => <div className="w-[28rem]"><PayoffBundleCard {...args} /></div>,
};

export const Empty: Story = {
  args: { legs: [], spotPrice: 400 },
  render: (args) => <div className="w-[28rem]"><PayoffBundleCard {...args} /></div>,
};

export const CustomizedRiskSnapshot: Story = {
  args: {
    legs: ironCondor,
    spotPrice: 400,
    netDebitCredit: 400,
    currency: "CAD",
    priceRange: 0.4,
    pointCount: 121,
    title: "Risk at expiration",
    headerRight: <button type="button">Expand</button>,
    labels: { credit: "Premium", maxProfit: "Best case", maxLoss: "Worst case" },
    payoffDiagramProps: { variant: "line", height: 190, strokeWidth: 2 },
    breakevenProps: { label: "Levels", precision: 1 },
  },
  render: (args) => <div className="w-[32rem]"><PayoffBundleCard {...args} /></div>,
};
