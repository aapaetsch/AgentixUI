/**
 * Investment-ops composed templates.
 *
 * Templates compose existing primitives; they MUST NOT become a second
 * primitive system. No new primitives are invented in this folder — if
 * a blocker is discovered, add the primitive to the relevant earlier phase
 * instead.
 */

export { StatTile, type StatTileProps } from "./stat-tile";
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