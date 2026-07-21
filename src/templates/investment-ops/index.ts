/**
 * Investment-ops composed templates.
 *
 * Templates compose existing primitives; they MUST NOT become a second
 * primitive system. No new primitives are invented in this folder — if
 * a blocker is discovered, add the primitive to the relevant earlier phase
 * instead.
 */

export { StatTile, type StatTileProps, type StatTileAlign } from "./stat-tile";
export {
  TickerImage,
  type TickerImageProps,
} from "./ticker-image";
export { AccountSummary, type AccountSummaryProps } from "./account-summary";
export { Watchlist, type WatchlistProps } from "./watchlist";
export { HoldingsTable, type HoldingsTableProps } from "./holdings-table";
export {
  OrderTicket,
  type OrderTicketProps,
  type OrderSide,
  type OrderType,
  type TimeInForce,
} from "./order-ticket";
export {
  AllocationBreakdown,
  type AllocationBreakdownProps,
  type BreakdownRow,
  type AllocationView,
} from "./allocation-breakdown";
export { NewsFeed, type NewsFeedProps, type NewsItem } from "./news-feed";
export {
  InvestmentOpsDashboard,
  type InvestmentOpsDashboardProps,
} from "./dashboard-shell";

// --- Options (Phase J-open) ------------------------------------------------
export {
  OptionsPositionsTable,
  type OptionsPositionsTableProps,
} from "./options-positions-table";
export {
  AggregateGreeksStrip,
  type AggregateGreeksStripProps,
} from "./aggregate-greeks-strip";
export {
  OptionPositionCard,
  type OptionPositionCardProps,
} from "./option-position-card";
export { OptionsChain, type OptionsChainProps } from "./options-chain";
export {
  PayoffBundleCard,
  type PayoffBundleCardProps,
} from "./payoff-bundle-card";
export {
  MultiLegOrderTicket,
  type MultiLegOrderTicketProps,
} from "./multi-leg-order-ticket";