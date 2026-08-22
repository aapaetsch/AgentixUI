/**
 * Finance secondary entrypoint.
 *
 * Exports finance-specific widgets and types that are still broadly reusable
 * in investment apps but kept out of the root export surface to avoid
 * overloading the generic primitive index.
 */

export {
  OrderBook,
  OrderBookSide,
  OrderBookRow,
  OrderBookSpread,
  OrderBookHeader,
  OrderBookSkeleton,
  orderBookRowVariants,
  orderBookSideVariants,
} from "./components/order-book";
export type {
  OrderBookProps,
  OrderBookRowProps,
  OrderBookSideProps,
  OrderBookSpreadProps,
} from "./components/order-book";

export {
  TimeAndSales,
  TimeAndSalesRow,
  TimeAndSalesHeader,
  timeAndSalesRowVariants,
} from "./components/time-and-sales";
export type {
  TimeAndSalesProps,
  TimeAndSalesRowProps,
} from "./components/time-and-sales";

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

export { AlertRuleEditor } from "./components/alert-rule-editor";
export type { AlertRuleEditorProps } from "./components/alert-rule-editor";
export { AlertManager } from "./components/alert-manager";
export type { AlertManagerProps } from "./components/alert-manager";
export { AlertLog } from "./components/alert-log";
export type { AlertLogProps } from "./components/alert-log";
export { ScreenerFilterBuilder } from "./components/screener-filter-builder";
export type { ScreenerFilterBuilderProps } from "./components/screener-filter-builder";
export { SavedScreenPicker } from "./components/saved-screen-picker";
export type { SavedScreenPickerProps } from "./components/saved-screen-picker";
export { ScreenerResults } from "./components/screener-results";
export type { ScreenerResultsProps } from "./components/screener-results";
export { OrderStatusBadge, orderStatusBadgeVariants } from "./components/order-status-badge";
export type { OrderStatusBadgeProps } from "./components/order-status-badge";
export { WorkingOrders } from "./components/working-orders";
export type { WorkingOrdersProps } from "./components/working-orders";
export { TradeBlotter } from "./components/trade-blotter";
export type { TradeBlotterProps } from "./components/trade-blotter";
export { BracketOrderEditor } from "./components/bracket-order-editor";
export type { BracketOrderEditorProps } from "./components/bracket-order-editor";
export { ReplayControls } from "./components/replay-controls";
export type { ReplayControlsProps } from "./components/replay-controls";
export { StrategyReport } from "./components/strategy-report";
export type { StrategyReportProps } from "./components/strategy-report";
export { SymbolSearch } from "./components/symbol-search";
export type { SymbolSearchProps } from "./components/symbol-search";
export { QuoteStatistics } from "./components/quote-statistics";
export type { QuoteStatisticsProps } from "./components/quote-statistics";
export { MarketSessionStatus } from "./components/market-session-status";
export type { MarketSessionStatusProps } from "./components/market-session-status";
export type {
  AlertEvent,
  AlertRule,
  BracketOrderValue,
  ComparisonOperator,
  MarketSessionState,
  OrderSide,
  OrderStatus,
  QuoteStatistic,
  SavedScreen,
  ScreenerFieldDefinition,
  ScreenerFilter,
  ScreenerResult,
  StrategyMetric,
  StrategyTrade,
  SymbolSearchResult,
  TradeExecution,
  WorkingOrder,
} from "./lib/trading-workflow-types";
