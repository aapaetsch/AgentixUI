import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { HoldingsTable } from "./holdings-table";
import type { HoldingRow } from "../../lib/finance-types";

/**
 * # HoldingsTable
 *
 * Composed template for a holdings/positions table. Columns: Symbol | Qty |
 * Avg Cost | Last | Mkt Value | P&L $ | P&L % | Weight % | Day Chg. P&L columns
 * are colorized via `NumericText colorize`. Row actions render via the
 * DropdownMenu exposed by `DataTable`'s `rowActions`.
 */
const meta: Meta<typeof HoldingsTable> = {
  title: "Templates/Investment-Ops/HoldingsTable",
  component: HoldingsTable,
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    virtualize: { control: "boolean" },
    showTickerImage: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof HoldingsTable>;

// ============================================================================
// Sample Data
// ============================================================================

const holdings: HoldingRow[] = [
  {
    symbol: "AAPL",
    quantity: 200,
    averageCost: 142.18,
    lastPrice: 187.32,
    marketValue: 37464,
    unrealizedPnL: 9028,
    unrealizedPnLPercent: 31.75,
    weightPercent: 28.4,
    dayChange: 428,
    logoUrl: "https://logo.clearbit.com/apple.com",
  },
  {
    symbol: "MSFT",
    quantity: 80,
    averageCost: 312.55,
    lastPrice: 412.65,
    marketValue: 33012,
    unrealizedPnL: 8008,
    unrealizedPnLPercent: 32.01,
    weightPercent: 25.05,
    dayChange: -98.4,
    logoUrl: "https://logo.clearbit.com/microsoft.com",
  },
  {
    symbol: "NVDA",
    quantity: 30,
    averageCost: 612.4,
    lastPrice: 1024.55,
    marketValue: 30736.5,
    unrealizedPnL: 12384.5,
    unrealizedPnLPercent: 67.32,
    weightPercent: 23.32,
    dayChange: 552.6,
    logoUrl: "https://logo.clearbit.com/nvidia.com",
  },
  {
    symbol: "GOOGL",
    quantity: 150,
    averageCost: 138.72,
    lastPrice: 167.81,
    marketValue: 25171.5,
    unrealizedPnL: 4363.5,
    unrealizedPnLPercent: 20.97,
    weightPercent: 19.1,
    dayChange: 67.5,
    logoUrl: "https://logo.clearbit.com/google.com",
  },
  {
    symbol: "AMZN",
    quantity: 60,
    averageCost: 145.32,
    lastPrice: 178.22,
    marketValue: 10693.2,
    unrealizedPnL: 1974,
    unrealizedPnLPercent: 22.64,
    weightPercent: 8.12,
    dayChange: -190.8,
    logoUrl: "https://logo.clearbit.com/amazon.com",
  },
  {
    symbol: "TSLA",
    quantity: 25,
    averageCost: 245.67,
    lastPrice: 218.45,
    marketValue: 5461.25,
    unrealizedPnL: -680.5,
    unrealizedPnLPercent: -11.06,
    weightPercent: 4.14,
    dayChange: -45.25,
  },
  {
    symbol: "META",
    quantity: 40,
    averageCost: 312.4,
    lastPrice: 485.12,
    marketValue: 19404.8,
    unrealizedPnL: 6908.8,
    unrealizedPnLPercent: 55.34,
    weightPercent: 14.72,
    dayChange: 222,
    logoUrl: "https://logo.clearbit.com/meta.com",
  },
];

// ============================================================================
// Basic Stories
// ============================================================================

export const Default: Story = {
  render: () => <HoldingsTable holdings={holdings} />,
};

export const WithRowActions: Story = {
  render: () => (
    <HoldingsTable
      holdings={holdings}
      onRowAction={(action, holding) =>
        // eslint-disable-next-line no-alert
        alert(`Action "${action}" on ${holding.symbol}`)
      }
    />
  ),
};

export const Virtualized: Story = {
  render: () => <HoldingsTable holdings={holdings} virtualize />,
};

export const WithTickerImage: Story = {
  render: () => <HoldingsTable holdings={holdings} showTickerImage />,
};

export const WithTickerImageAndRowActions: Story = {
  name: "Ticker Image + Row Actions",
  render: () => (
    <HoldingsTable
      holdings={holdings}
      showTickerImage
      onRowAction={(action, holding) =>
        // eslint-disable-next-line no-alert
        alert(`Action "${action}" on ${holding.symbol}`)
      }
    />
  ),
};

// ============================================================================
// States
// ============================================================================

export const Empty: Story = {
  render: () => <HoldingsTable holdings={[]} />,
};

export const Loading: Story = {
  render: () => <HoldingsTable holdings={[]} loading />,
};

export const SinglePosition: Story = {
  render: () => <HoldingsTable holdings={holdings.slice(0, 1)} />,
};

export const LossOnly: Story = {
  render: () => (
    <HoldingsTable holdings={holdings.filter((h) => h.unrealizedPnL < 0)} />
  ),
};