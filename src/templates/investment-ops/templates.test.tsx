import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { AccountSummary } from "./account-summary";
import { Watchlist } from "./watchlist";
import type { WatchlistItem } from "../../lib/finance-types";

describe("AccountSummary", () => {
  it("renders a stat tile for each provided tile", () => {
    render(
      <AccountSummary
        tiles={[
          { label: "Cash", value: 12000, format: "currency" },
          { label: "Equity", value: 234000, format: "currency" },
        ]}
      />,
    );
    expect(screen.getByText("Cash")).toBeDefined();
    expect(screen.getByText("Equity")).toBeDefined();
  });

  it("renders a warning node when provided", () => {
    render(
      <AccountSummary
        tiles={[{ label: "Cash", value: 12000, format: "currency" }]}
        warning={<span>Margin call warning</span>}
      />,
    );
    expect(screen.getByText("Margin call warning")).toBeDefined();
  });
});

describe("Watchlist", () => {
  const items: WatchlistItem[] = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      assetType: "Equity",
      last: 190.5,
      change: 1.2,
      changePercent: 0.63,
      volume: 1_000_000,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      assetType: "Equity",
      last: 420.1,
      change: -0.8,
      changePercent: -0.19,
      volume: 2_000_000,
    },
  ];

  it("renders the symbol for each row", () => {
    render(<Watchlist items={items} />);
    expect(screen.getByText("AAPL")).toBeDefined();
    expect(screen.getByText("MSFT")).toBeDefined();
  });

  it("renders the asset type badge when showAssetType is true (default)", () => {
    render(<Watchlist items={items} />);
    // Two Equity rows -> two badges both labelled "Equity".
    const badges = screen.getAllByText("Equity");
    expect(badges.length).toBe(2);
  });

  it("renders an empty-state message when items is empty", () => {
    render(<Watchlist items={[]} />);
    expect(screen.getByText(/watchlist is empty/i)).toBeDefined();
  });
});