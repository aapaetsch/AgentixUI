/** A UTC Unix timestamp in seconds, an ISO business-day string, or a structured business day. */
export type MarketTime =
  | number
  | `${number}-${number}-${number}`
  | { year: number; month: number; day: number };

export interface OhlcBar {
  time: MarketTime;
  /** Producer-supplied exchange session date; independent of the UTC instant. */
  sessionDate?: string;
  /** Producer marks a still-forming bar. Rendered hollow/dashed and labeled in tables. */
  incomplete?: boolean;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export type MarketChartType = "candlestick" | "bar" | "line" | "area" | "baseline";
export type MarketScaleMode = "normal" | "logarithmic" | "percentage" | "indexedTo100";

export interface VisibleRange {
  from: MarketTime;
  to: MarketTime;
}

export interface MarketMarker {
  id: string;
  time: MarketTime;
  position: "aboveBar" | "belowBar" | "inBar";
  color?: string;
  shape?: "circle" | "square" | "arrowUp" | "arrowDown";
  text?: string;
}

export interface MarketSessionRange {
  id: string;
  from: MarketTime;
  to: MarketTime;
  label?: string;
  color?: string;
}

export interface MarketSeries {
  id: string;
  type: MarketChartType;
  data: OhlcBar[];
  visible?: boolean;
}

export interface CurrentBarSnapshot {
  bar: OhlcBar;
  change: number;
  changePercent: number;
}

export interface MarketCrosshairSnapshot {
  time: MarketTime;
  bar: OhlcBar;
  paneId: string;
  coordinates: { x: number; y: number };
  values: Record<string, number | null>;
}

export interface MarketPaneGeometry {
  left?: number;
  id: string;
  top: number;
  height: number;
  width: number;
}

export interface MarketScaleSnapshot {
  mode: MarketScaleMode;
  minimum: number;
  maximum: number;
  anchor?: number;
}

export interface MarketChartSnapshot {
  /** Exact runtime state for disposal/recreation; no serializer change. */
  viewport?: import("./technical-chart-state").MarketViewportOptions;
  scale?: import("./technical-chart-state").MarketScaleOptions;
  visibleRange: VisibleRange | null;
  panes: MarketPaneGeometry[];
  scales: Record<string, MarketScaleSnapshot>;
  crosshair: MarketCrosshairSnapshot | null;
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type SerializableParameters = Record<string, JsonValue>;
