/**
 * Shared finance domain types.
 *
 * These shapes prevent drift across stories, templates, and future data
 * adapters. They are intentionally minimal: fields that every consumer needs
 * live here, while optional/extensible fields are marked as optional.
 *
 * @module finance-types
 */

/**
 * One price level of an order book (bid or ask).
 *
 * Consumers must pre-sort bids descending by `price` and asks ascending by
 * `price` before passing to `OrderBook`.
 */
export interface OrderBookLevel {
  price: number;
  size: number;
  /** Cumulative depth up to and including this level. */
  total?: number;
}

/** Flags that annotate a single trade. */
export type TradeFlag = "block" | "uptick" | "downtick" | "correction";

/**
 * A single trade row in the time-and-sales tape.
 */
export interface Trade {
  id: string;
  /** Epoch milliseconds. */
  time: number;
  price: number;
  size: number;
  side: "buy" | "sell" | "unknown";
  flags?: TradeFlag[];
}

/**
 * A watchlist row describing a single instrument.
 */
export interface WatchlistItem {
  symbol: string;
  last: number;
  change: number;
  changePercent: number;
  volume?: number;
  /** Optional ticker/issuer logo URL (e.g. brand mark shown beside the symbol). */
  logoUrl?: string;
}

/**
 * A single holding (position) row in a holdings table.
 */
export interface HoldingRow {
  symbol: string;
  quantity: number;
  averageCost: number;
  lastPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  weightPercent?: number;
  dayChange?: number;
  /** Optional ticker/issuer logo URL (e.g. brand mark shown beside the symbol). */
  logoUrl?: string;
}