export type ComparisonOperator = "greaterThan" | "greaterThanOrEqual" | "lessThan" | "lessThanOrEqual" | "equal";

export interface AlertRule {
  id: string;
  symbol: string;
  field: string;
  operator: ComparisonOperator;
  threshold: number;
  enabled: boolean;
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  symbol: string;
  message: string;
  triggeredAt: string;
  value: number;
}

export interface ScreenerFieldDefinition {
  id: string;
  label: string;
  type: "number" | "text";
  operators?: ComparisonOperator[];
}

export interface ScreenerFilter {
  id: string;
  field: string;
  operator: ComparisonOperator;
  value: string | number;
}

export interface SavedScreen {
  id: string;
  name: string;
}

export interface ScreenerResult {
  symbol: string;
  name?: string;
  price: number;
  changePercent: number;
  marketCap?: number;
  [key: string]: string | number | undefined;
}

export type OrderSide = "buy" | "sell";
export type OrderStatus = "pending" | "working" | "partiallyFilled" | "filled" | "cancelled" | "rejected";

export interface WorkingOrder {
  id: string;
  symbol: string;
  side: OrderSide;
  type: "market" | "limit" | "stop" | "stopLimit";
  quantity: number;
  filledQuantity: number;
  limitPrice?: number;
  stopPrice?: number;
  status: OrderStatus;
  submittedAt?: string;
}

export interface TradeExecution {
  id: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  executedAt: string;
  venue?: string;
}

export interface BracketOrderValue {
  symbol: string;
  side: OrderSide;
  quantity: number;
  entryPrice: number;
  takeProfitPrice: number;
  stopLossPrice: number;
}

export interface StrategyMetric {
  id: string;
  label: string;
  value: string | number;
  description?: string;
}

export interface StrategyTrade {
  id: string;
  symbol: string;
  openedAt: string;
  closedAt?: string;
  side: "long" | "short";
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  profitLoss?: number;
}

export interface SymbolSearchResult {
  symbol: string;
  name: string;
  exchange?: string;
  assetType?: string;
}

export interface QuoteStatistic {
  id: string;
  label: string;
  value: string | number;
  emphasis?: "default" | "positive" | "negative";
}

export type MarketSessionState = "preMarket" | "open" | "afterHours" | "closed" | "halted";
