import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { NewsFeed } from "./news-feed";
import type { NewsItem } from "./news-feed";

/**
 * # NewsFeed
 *
 * Composed template for a filterable news feed. Renders a `Card` with a filter
 * bar (`MultiSelect` for tickers, `ToggleGroup` for sentiment), an
 * infinite-scroll `ScrollArea`, and per-item cards with `Avatar`, ticker
 * `Badge`s, sentiment `Chip`, and relative time.
 */
const meta: Meta<typeof NewsFeed> = {
  title: "Templates/Investment-Ops/NewsFeed",
  component: NewsFeed,
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof NewsFeed>;

// ============================================================================
// Sample Data
// ============================================================================

const now = Date.now();

const items: NewsItem[] = [
  {
    id: "1",
    headline: "Apple announces record Q3 revenue, beating expectations",
    snippet:
      "iPhone and Services revenue drove the strongest third quarter in company history.",
    source: "Bloomberg",
    tickers: ["AAPL"],
    sentiment: "positive",
    time: now - 1000 * 60 * 5,
  },
  {
    id: "2",
    headline: "Nvidia faces new export scrutiny on AI chips",
    snippet:
      "Regulators are weighing tighter controls on next-generation data-center GPUs.",
    source: "Reuters",
    tickers: ["NVDA"],
    sentiment: "negative",
    time: now - 1000 * 60 * 24,
    blockTrade: true,
  },
  {
    id: "3",
    headline: "Microsoft expands Copilot enterprise seat count",
    snippet: "New licensing tiers target mid-market adoption.",
    source: "CNBC",
    tickers: ["MSFT"],
    sentiment: "positive",
    time: now - 1000 * 60 * 60,
  },
  {
    id: "4",
    headline: "Tesla deliveries miss estimates, shares slide premarket",
    snippet: "Quarterly delivery numbers came in below the Street consensus.",
    source: "WSJ",
    tickers: ["TSLA"],
    sentiment: "negative",
    time: now - 1000 * 60 * 60 * 3,
  },
  {
    id: "5",
    headline: "Meta announces new Reality Labs investment",
    snippet: "CEO signaled renewed long-term bet on mixed-reality hardware.",
    source: "TechCrunch",
    tickers: ["META"],
    sentiment: "neutral",
    time: now - 1000 * 60 * 60 * 6,
  },
  {
    id: "6",
    headline: "Amazon AWS reports strong cloud backlog",
    snippet: "Annualized run-rate and contractual backlog both grew double digits.",
    source: "Bloomberg",
    tickers: ["AMZN"],
    sentiment: "positive",
    time: now - 1000 * 60 * 60 * 12,
  },
  {
    id: "7",
    headline: "Alphabet DOJ talks progress but remedies remain unresolved",
    snippet: "Search-engine remedies remain the sticking point in negotiations.",
    source: "Reuters",
    tickers: ["GOOGL"],
    sentiment: "neutral",
    time: now - 1000 * 60 * 60 * 18,
  },
  {
    id: "8",
    headline: "Block trade crosses 1.2M NVDA shares late session",
    snippet: "A large institutional print executed at a slight discount to VWAP.",
    source: "Bloomberg",
    tickers: ["NVDA"],
    sentiment: "neutral",
    time: now - 1000 * 60 * 60 * 24,
    blockTrade: true,
  },
];

const tickerOptions = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA"];

// ============================================================================
// Basic Stories
// ============================================================================

export const Default: Story = {
  render: () => <NewsFeed items={items} tickerOptions={tickerOptions} />,
};

export const WithoutTickerFilter: Story = {
  render: () => <NewsFeed items={items} />,
};

// ============================================================================
// Interaction
// ============================================================================

export const WithEvents: Story = {
  render: () => (
    <NewsFeed
      items={items}
      tickerOptions={tickerOptions}
      onFilterChange={(filters) =>
        // eslint-disable-next-line no-console
        console.log("Filters:", filters)
      }
      onItemOpen={(item) =>
        // eslint-disable-next-line no-alert
        alert(`Open: ${item.headline}`)
      }
    />
  ),
};

export const BlockTradesOnly: Story = {
  render: () => (
    <NewsFeed
      items={items.filter((i) => i.blockTrade)}
      tickerOptions={tickerOptions}
    />
  ),
};

// ============================================================================
// States
// ============================================================================

export const Empty: Story = {
  render: () => <NewsFeed items={[]} tickerOptions={tickerOptions} />,
};

export const Loading: Story = {
  render: () => <NewsFeed items={[]} tickerOptions={tickerOptions} loading />,
};

export const SingleItem: Story = {
  render: () => <NewsFeed items={items.slice(0, 1)} tickerOptions={tickerOptions} />,
};