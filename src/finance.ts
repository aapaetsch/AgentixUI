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
} from "./lib/finance-types";