import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { OptionsPositionsTable } from "./options-positions-table";
import type { OptionPosition } from "../../lib/finance-types";

const meta: Meta<typeof OptionsPositionsTable> = {
  title: "Templates/Options/OptionsPositionsTable",
  component: OptionsPositionsTable,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof OptionsPositionsTable>;

const now = Date.now();
const day = 86_400_000;

const positions: OptionPosition[] = [
  {
    root: "SPY",
    type: "call",
    strike: 410,
    expiry: now + 21 * day,
    contracts: 2,
    averageCost: 5.2,
    markPrice: 6.4,
    marketValue: 1280,
    unrealizedPnL: 240,
    unrealizedPnLPercent: 23.07,
    daysToExpiry: 21,
    status: "open",
    iv: 18.4,
    greeks: { delta: 0.55, gamma: 0.04, theta: -3.4, vega: 0.21 },
    delta: 0.55,
    bid: 6.3,
    ask: 6.5,
  },
  {
    root: "QQQ",
    type: "put",
    strike: 380,
    expiry: now + 3 * day,
    contracts: -1,
    averageCost: 4.0,
    markPrice: 2.1,
    marketValue: -210,
    unrealizedPnL: 190,
    unrealizedPnLPercent: 47.5,
    daysToExpiry: 3,
    status: "open",
    iv: 22.1,
    greeks: { delta: -0.18, gamma: 0.08, theta: -8.2, vega: 0.04 },
    delta: -0.18,
    bid: 2.0,
    ask: 2.2,
  },
  {
    root: "AAPL",
    type: "call",
    strike: 190,
    expiry: now + 0.4 * day,
    contracts: 1,
    averageCost: 1.6,
    markPrice: 0.4,
    marketValue: 40,
    unrealizedPnL: -120,
    unrealizedPnLPercent: -75,
    daysToExpiry: 0.4,
    status: "open",
    iv: 38.0,
    greeks: { delta: 0.97, gamma: 0.02, theta: -25.0, vega: 0.01 },
    delta: 0.97,
    bid: 0.35,
    ask: 0.45,
  },
];

export const Default: Story = {
  args: { positions },
};

export const ShowIv: Story = {
  args: { positions, showIv: true },
};

/**
 * Exercises the column-composition paths: net delta and theta/day hidden,
 * IV shown. Documents that the blotter remains readable when only the IV
 * optional column is enabled alongside the standing P&L columns.
 */
export const IvOnlyNoDeltaTheta: Story = {
  args: { positions, showDelta: false, showTheta: false, showIv: true },
};

/**
 * Loading state. With the current `DataTable` primitive (no built-in
 * skeleton slot), `loading=true` with an empty `positions` array falls
 * through to the table surface and renders the `emptyMessage` row
 * ("No open positions."). This story documents that current behavior; a
 * proper skeleton treatment would require a `DataTable` loading prop.
 */
export const Loading: Story = {
  args: { positions: [], loading: true },
};

export const Empty: Story = {
  args: { positions: [] },
};

export const CustomizedPresentation: Story = {
  args: {
    positions,
    currency: "CAD",
    showTheta: false,
    showIv: true,
    renderStatus: (position) => position.status ? `Status: ${position.status}` : null,
    tableProps: { variant: "striped", size: "md", stickyHeader: false },
  },
};

export const CustomEmptyState: Story = {
  args: {
    positions: [],
    emptyContent: "No strategies match this portfolio filter.",
    emptyAction: <button type="button">Clear filters</button>,
  },
};
