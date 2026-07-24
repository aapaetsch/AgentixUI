// Server-safe finance entrypoint.
//
// Exposes only pure utility functions and types for server components.

export type {
  OrderBookLevel,
  TradeFlag,
  Trade,
  WatchlistItem,
  HoldingRow,
  OptionType,
  OptionPositionStatus,
  Greeks,
  OptionContract,
  OptionPosition,
  OptionChainRow,
  OptionLeg,
  PayoffPoint,
} from "./lib/finance-types";

export {
  computePayoffAtExpiry,
  breakevensAtExpiry,
  maxProfitAtExpiry,
  maxLossAtExpiry,
  netPremium,
  priceGrid,
} from "./lib/finance-utils";