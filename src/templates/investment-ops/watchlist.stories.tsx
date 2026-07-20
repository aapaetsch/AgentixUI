import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Watchlist } from "./watchlist";
import { Sparkline } from "../../components/sparkline";
import type { WatchlistItem } from "../../lib/finance-types";

/**
 * # Watchlist
 *
 * Composed template for a watchlist table. Renders a `DataTable` with columns
 * Symbol | Last | Change | Change % | Volume | Sparkline. The sparkline
 * column delegates to a chart lib via the `sparkline(item)` render slot —
 * the template does not own the chart.
 */
const meta: Meta<typeof Watchlist> = {
  title: "Templates/Investment-Ops/Watchlist",
  component: Watchlist,
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    showTickerImage: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Watchlist>;

// ============================================================================
// Sample Data
// ============================================================================

const items: WatchlistItem[] = [
  { symbol: "AAPL", last: 187.32, change: 2.14, changePercent: 1.16, volume: 52_300_000, logoUrl: "https://logo.clearbit.com/apple.com" },
  { symbol: "MSFT", last: 412.65, change: -1.23, changePercent: -0.3, volume: 21_400_000, logoUrl: "https://logo.clearbit.com/microsoft.com" },
  { symbol: "NVDA", last: 1024.55, change: 18.42, changePercent: 1.83, volume: 38_900_000, logoUrl: "https://logo.clearbit.com/nvidia.com" },
  { symbol: "GOOGL", last: 167.81, change: 0.45, changePercent: 0.27, volume: 18_700_000, logoUrl: "https://logo.clearbit.com/google.com" },
  { symbol: "AMZN", last: 178.22, change: -3.18, changePercent: -1.75, volume: 27_100_000, logoUrl: "https://logo.clearbit.com/amazon.com" },
  { symbol: "META", last: 485.12, change: 5.55, changePercent: 1.16, volume: 14_500_000, logoUrl: "https://logo.clearbit.com/meta.com" },
];

const historyBySymbol: Record<string, number[]> = {
  AAPL: [180, 182, 181, 184, 183, 186, 185, 187.32],
  MSFT: [415, 414, 416, 413, 412, 413, 411, 412.65],
  NVDA: [990, 1000, 1010, 1005, 1018, 1012, 1020, 1024.55],
  GOOGL: [167, 168, 167.5, 167.8, 168.1, 167.9, 167.7, 167.81],
  AMZN: [182, 181, 180, 179, 178.5, 179.2, 178.4, 178.22],
  META: [480, 482, 481, 484, 483, 485, 484, 485.12],
};

// ============================================================================
// Basic Stories
// ============================================================================

export const Default: Story = {
  render: () => <Watchlist items={items} />,
};

export const WithSparkline: Story = {
  render: () => (
    <Watchlist
      items={items}
      sparkline={(item) => (
        <Sparkline
          data={historyBySymbol[item.symbol] ?? []}
          width={88}
          height={28}
          variant="line"
          color={item.change >= 0 ? undefined : "var(--color-negative)"}
        />
      )}
    />
  ),
};

export const WithAreaSparkline: Story = {
  render: () => (
    <Watchlist
      items={items}
      sparkline={(item) => (
        <Sparkline
          data={historyBySymbol[item.symbol] ?? []}
          width={88}
          height={28}
          variant="area"
          fill
          color={item.change >= 0 ? undefined : "var(--color-negative)"}
        />
      )}
    />
  ),
};

export const WithTickerImage: Story = {
  render: () => <Watchlist items={items} showTickerImage />,
};

export const WithTickerImageAndSparkline: Story = {
  name: "Ticker Image + Sparkline",
  render: () => (
    <Watchlist
      items={items}
      showTickerImage
      sparkline={(item) => (
        <Sparkline
          data={historyBySymbol[item.symbol] ?? []}
          width={88}
          height={28}
          variant="line"
          color={item.change >= 0 ? undefined : "var(--color-negative)"}
        />
      )}
    />
  ),
};

// ============================================================================
// States
// ============================================================================

export const Empty: Story = {
  render: () => <Watchlist items={[]} />,
};

export const Loading: Story = {
  render: () => <Watchlist items={[]} loading />,
};

export const SingleRow: Story = {
  render: () => <Watchlist items={items.slice(0, 1)} />,
};