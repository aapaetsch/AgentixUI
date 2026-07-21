import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PayoffDiagram } from "./index";
import {
  computePayoffAtExpiry,
  priceGrid,
} from "../../lib/finance-utils";
import type { OptionLeg } from "../../lib/finance-types";

const meta: Meta<typeof PayoffDiagram> = {
  title: "Components/PayoffDiagram",
  component: PayoffDiagram,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { options: ["line", "area"], control: { type: "radio" } },
    width: { control: { type: "number", min: 120, max: 480 } },
    height: { control: { type: "number", min: 80, max: 240 } },
  },
};
export default meta;
type Story = StoryObj<typeof PayoffDiagram>;

const longCall: OptionLeg[] = [
  {
    id: "1",
    side: "buy",
    type: "call",
    strike: 400,
    expiry: Date.now() + 30 * 86_400_000,
    contracts: 1,
    limitPrice: 5.5,
  },
];
const prices = priceGrid(longCall, 400, 0.25, 81);
const longCallPoints = computePayoffAtExpiry(longCall, prices);

export const LongCall: Story = {
  args: {
    points: longCallPoints,
    spotPrice: 400,
    breakevens: [405.5],
    width: 320,
    height: 160,
  },
  render: (args) => (
    <div className="w-80 text-primary">
      <PayoffDiagram {...args} />
    </div>
  ),
};

const shortPut: OptionLeg[] = [
  {
    id: "1",
    side: "sell",
    type: "put",
    strike: 380,
    expiry: Date.now() + 30 * 86_400_000,
    contracts: 1,
    limitPrice: 4.0,
  },
];
const shortPutPoints = computePayoffAtExpiry(shortPut, priceGrid(shortPut, 400, 0.3, 81));

export const ShortPut: Story = {
  args: {
    points: shortPutPoints,
    spotPrice: 400,
    breakevens: [376.0],
    width: 320,
    height: 160,
  },
  render: (args) => (
    <div className="w-80 text-negative">
      <PayoffDiagram {...args} />
    </div>
  ),
};

const ironCondor: OptionLeg[] = [
  { id: "1", side: "buy", type: "put", strike: 360, expiry: Date.now(), contracts: 1, limitPrice: 1 },
  { id: "2", side: "sell", type: "put", strike: 380, expiry: Date.now(), contracts: 1, limitPrice: 3 },
  { id: "3", side: "sell", type: "call", strike: 420, expiry: Date.now(), contracts: 1, limitPrice: 3 },
  { id: "4", side: "buy", type: "call", strike: 440, expiry: Date.now(), contracts: 1, limitPrice: 1 },
];
const icPoints = computePayoffAtExpiry(ironCondor, priceGrid(ironCondor, 400, 0.3, 81));

export const IronCondor: Story = {
  args: {
    points: icPoints,
    spotPrice: 400,
    breakevens: [378, 422],
    width: 360,
    height: 180,
  },
  render: (args) => (
    <div className="w-96 text-positive">
      <PayoffDiagram {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: { points: [] },
};

// Single point — verifies the crosshair fallback (a lone `M` segment would
// otherwise render nothing visible).
export const SinglePoint: Story = {
  args: {
    points: [{ price: 400, value: 12.5 }],
    spotPrice: 400,
    currentPnL: 12.5,
    width: 320,
    height: 160,
  },
  render: (args) => (
    <div className="w-80 text-primary">
      <PayoffDiagram {...args} />
    </div>
  ),
};

// Unsorted points — verifies the dev-only `console.warn` invariant. The
// polyline is intentionally scrambled here to demonstrate the contract.
export const UnsortedPoints: Story = {
  args: {
    points: [...longCallPoints].reverse(),
    spotPrice: 400,
    breakevens: [405.5],
    width: 320,
    height: 160,
  },
  render: (args) => (
    <div className="w-80 text-primary">
      <PayoffDiagram {...args} />
    </div>
  ),
};

// Deep ITM long call — all-positive payoff (zero baseline forced to bottom).
const longCallDeepITM: OptionLeg[] = [
  {
    id: "1",
    side: "buy",
    type: "call",
    strike: 300,
    expiry: Date.now() + 30 * 86_400_000,
    contracts: 1,
    limitPrice: 5,
  },
];
const deepITMPPrices = priceGrid(longCallDeepITM, 420, 0.1, 61).filter(
  (p) => p >= 400
);
const deepITMPoints = computePayoffAtExpiry(longCallDeepITM, deepITMPPrices);

export const AllPositive: Story = {
  args: {
    points: deepITMPoints,
    spotPrice: 420,
    width: 320,
    height: 160,
  },
  render: (args) => (
    <div className="w-80 text-positive">
      <PayoffDiagram {...args} />
    </div>
  ),
};

// Short call OTM but still losing on the sampled grid — all-negative payoff
// (zero baseline forced to top).
const shortCallOTM: OptionLeg[] = [
  {
    id: "1",
    side: "sell",
    type: "call",
    strike: 420,
    expiry: Date.now() + 30 * 86_400_000,
    contracts: 1,
    limitPrice: 2,
  },
];
// Sample only the in-the-money region for the short call (price <= strike),
// where the position is always losing.
const shortCallPrices = priceGrid(shortCallOTM, 410, 0.05, 41).filter(
  (p) => p <= 420
);
const shortCallPoints = computePayoffAtExpiry(shortCallOTM, shortCallPrices);

export const AllNegative: Story = {
  args: {
    points: shortCallPoints,
    spotPrice: 410,
    width: 320,
    height: 160,
  },
  render: (args) => (
    <div className="w-80 text-negative">
      <PayoffDiagram {...args} />
    </div>
  ),
};

// Line variant (no fill).
export const LineVariant: Story = {
  args: {
    points: longCallPoints,
    spotPrice: 400,
    breakevens: [405.5],
    variant: "line",
    width: 320,
    height: 160,
  },
  render: (args) => (
    <div className="w-80 text-primary">
      <PayoffDiagram {...args} />
    </div>
  ),
};

// Area variant with fill disabled (line only, but using the area variant).
export const FillDisabled: Story = {
  args: {
    points: longCallPoints,
    spotPrice: 400,
    breakevens: [405.5],
    variant: "area",
    fill: false,
    width: 320,
    height: 160,
  },
  render: (args) => (
    <div className="w-80 text-primary">
      <PayoffDiagram {...args} />
    </div>
  ),
};