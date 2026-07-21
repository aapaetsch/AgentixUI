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

// ---------------------------------------------------------------------------
// Options domain types
// ---------------------------------------------------------------------------

/** Whether an option is a call or a put. */
export type OptionType = "call" | "put";

/** Lifecycle status of an open option position. */
export type OptionPositionStatus =
  | "open"
  | "closed"
  | "exercised"
  | "assigned"
  | "expired"
  | "rolled";

/**
 * Greeks for a single option. All optional fields default to `undefined` so
 * consumers that only have a subset (e.g. just `delta`) can still render.
 * `delta` is the per-contract delta in [-1, 1]; `theta`, `vega`, `rho` are
 * per-contract, per-day / per-1%-IV quantities as commonly quoted.
 */
export interface Greeks {
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
  rho?: number;
}

/**
 * A tradable option contract quote row, as found in an options chain or as a
 * leg of a multi-leg order. Prices are per-share (one contract = 100 shares).
 */
export interface OptionContract {
  /** Underlying ticker root, e.g. `"SPY"`. */
  root: string;
  type: OptionType;
  /** Strike price. */
  strike: number;
  /** Expiration as epoch milliseconds. */
  expiry: number;
  bid?: number;
  ask?: number;
  last?: number;
  /** Implied volatility as a percentage (e.g. `23.4` = 23.4%). */
  iv?: number;
  volume?: number;
  openInterest?: number;
  greeks?: Greeks;
  /** Convenience: per-contract delta, mirrored from `greeks.delta`. */
  delta?: number;
}

/**
 * An open option position row in the blotter / positions table. `contracts`
 * is signed: positive for long, negative for short.
 */
export interface OptionPosition extends OptionContract {
  /** Signed contract count: positive = long, negative = short. */
  contracts: number;
  /** Average cost per share (negative for shorts recorded as credit). */
  averageCost: number;
  /** Current mark price per share. */
  markPrice: number;
  /** Current market value of the position (`contracts × 100 × markPrice`). */
  marketValue: number;
  /** Unrealized P&L in currency units. */
  unrealizedPnL: number;
  /** Unrealized P&L as a percentage of cost basis. */
  unrealizedPnLPercent: number;
  /** Whole days until expiry (can be fractional). */
  daysToExpiry: number;
  status?: OptionPositionStatus;
}

/**
 * One strike row of an options chain: the call and put contracts sharing a
 * strike. Either side may be `null` when the chain is filtered to one side.
 */
export interface OptionChainRow {
  strike: number;
  call: OptionContract | null;
  put: OptionContract | null;
}

/**
 * A single leg of a multi-leg option order. `id` is consumer-assigned and used
 * as a React key by `LegBuilderRow`. `side` is the trader's side (buy/sell).
 */
export interface OptionLeg {
  id: string;
  side: "buy" | "sell";
  type: OptionType;
  strike: number;
  /** Expiration as epoch milliseconds. */
  expiry: number;
  /** Signed contract count: positive = buy, negative = sell (matches `side`). */
  contracts: number;
  greeks?: Greeks;
  /** Optional per-share limit price for the leg. */
  limitPrice?: number;
}

/** A single point of an at-expiry payoff curve. */
export interface PayoffPoint {
  /** Underlying price. */
  price: number;
  /** Position value at that price (including net premium). */
  value: number;
}