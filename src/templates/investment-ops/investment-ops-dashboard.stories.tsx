import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Search, Bell, Settings, Sun } from "lucide-react";

import { InvestmentOpsDashboard } from "./dashboard-shell";
import { Navbar, NavbarContent, NavbarActions } from "../../components/navigation/layout";
import { Button } from "../../components/button";
import { PremiumToastProvider } from "../../components/toast/api";
import type { OrderBookLevel, Trade, WatchlistItem, HoldingRow } from "../../lib/finance-types";

/**
 * # InvestmentOpsDashboard
 *
 * Composed dashboard shell for investment-ops. Composes ONLY already-shipped
 * primitives — this is the integration showcase and regression surface.
 *
 * Layout: Top `Navbar` + horizontal `Resizable` wrapping left rail | center
 * tabs | right rail (vertical `Resizable` of `OrderBook` + `TimeAndSales`).
 * A floating `ExtendedFAB` opens the `OrderTicket` as a right-docked Sheet.
 */
const meta: Meta<typeof InvestmentOpsDashboard> = {
  title: "Templates/Investment-Ops/InvestmentOpsDashboard",
  component: InvestmentOpsDashboard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof InvestmentOpsDashboard>;

// ============================================================================
// Sample Data
// ============================================================================

const accountTiles = [
  { label: "Cash", value: 12000, format: "currency" as const },
  {
    label: "Equity",
    value: 234000,
    format: "currency" as const,
    delta: 2.1,
    deltaFormat: "percent" as const,
  },
  {
    label: "Day P&L",
    value: -1234,
    format: "currency" as const,
    delta: -1.2,
    deltaFormat: "percent" as const,
  },
  {
    label: "Total P&L",
    value: 8000,
    format: "currency" as const,
    delta: 4.3,
    deltaFormat: "percent" as const,
  },
];

const watchlistItems: WatchlistItem[] = [
  { symbol: "AAPL", last: 187.32, change: 2.14, changePercent: 1.16, volume: 52_300_000 },
  { symbol: "MSFT", last: 412.65, change: -1.23, changePercent: -0.3, volume: 21_400_000 },
  { symbol: "NVDA", last: 1024.55, change: 18.42, changePercent: 1.83, volume: 38_900_000 },
  { symbol: "GOOGL", last: 167.81, change: 0.45, changePercent: 0.27, volume: 18_700_000 },
];

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
];

function makeLevels(base: number, count: number, side: "bid" | "ask") {
  const levels: OrderBookLevel[] = [];
  let total = 0;
  for (let i = 0; i < count; i++) {
    const price = side === "bid" ? base - i * 0.05 : base + i * 0.05;
    const size = Math.floor(50 + Math.random() * 950);
    total += size;
    levels.push({ price, size, total });
  }
  return levels;
}

const orderBookData = {
  bids: makeLevels(187.3, 10, "bid"),
  asks: makeLevels(187.32, 10, "ask"),
};

const tape: Trade[] = Array.from({ length: 20 }, (_, i) => ({
  id: `t-${i}`,
  time: Date.now() - i * 4000,
  price: 187.32 + (Math.random() - 0.5) * 0.4,
  size: Math.floor(10 + Math.random() * 490),
  side: (["buy", "sell", "unknown"] as const)[i % 3],
  flags: i % 7 === 0 ? ["block"] : undefined,
}));

// ============================================================================
// Default — full composed dashboard
// ============================================================================

export const Default: Story = {
  render: () => (
    <PremiumToastProvider position="bottom-right">
      <InvestmentOpsDashboard
        navbar={
          <Navbar>
            <NavbarContent>
              <Button variant="ghost" size="icon">
                <Search className="size-4" />
              </Button>
            </NavbarContent>
            <NavbarActions>
              <Button variant="ghost" size="icon">
                <Bell className="size-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Sun className="size-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="size-4" />
              </Button>
            </NavbarActions>
          </Navbar>
        }
        accountTiles={accountTiles}
        watchlist={{ items: watchlistItems }}
        holdings={holdings}
        orderBookData={orderBookData}
        tape={tape}
        orderTicket={{
          symbol: "AAPL",
          onSubmit: async () => {
            await new Promise((r) => setTimeout(r, 500));
          },
          buyingPower: 25000,
        }}
      />
    </PremiumToastProvider>
  ),
};

// ============================================================================
// Minimal — uses the built-in placeholder navbar, no right-rail data
// ============================================================================

export const Minimal: Story = {
  render: () => (
    <PremiumToastProvider position="bottom-right">
      <InvestmentOpsDashboard
        accountTiles={accountTiles.slice(0, 2)}
        watchlist={{ items: watchlistItems.slice(0, 2) }}
      />
    </PremiumToastProvider>
  ),
};

// ============================================================================
// Bare — just the shell with placeholders
// ============================================================================

export const Bare: Story = {
  render: () => <InvestmentOpsDashboard />,
};