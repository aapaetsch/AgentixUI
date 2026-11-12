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

/** Host-supplied display level. No session selection, calculation, drawing or persistence ownership. */
export interface MarketPriceReference {
  id: string;
  /** Exact already-supplied price; references never expand the automatic domain. */
  price: number;
  /** Host-owned source/session description; full text remains accessible. */
  label: string;
  /** Dotted is the default and currently supported reference style. */
  lineStyle?: 'dotted';
  color?: string;
  /** Optional outlined R-prefixed value in the existing price-axis lane. Default false. */
  showAxisLabel?: boolean;
  /** Suppress only the in-plot caption. Default true; the full label stays accessible. */
  showPlotLabel?: boolean;
  /** Optional short axis caption (for example Open), above the price instead of the default R prefix.
   * Requires showAxisLabel; never replaces the complete host-owned label. */
  axisLabel?: string;
}

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
  /** Active inspection has no accepted observation; distinct from idle/cleared inspection. */
  inspectionUnavailable?:boolean;
  /** Actual time-ruler allocation in surface-local CSS pixels; presentation only. */
  timeAxis?: {left:number;top:number;width:number;height:number;futureFrom?:MarketTime};
  /** Future annotation ruler only; crosshair stays null and has no bar/study values. Never economic input. */
  futureInspection?: { time: MarketTime; coordinates: {x:number;y:number}; paneId: string } | null;
  /** Display-only line geometry. Never use as an OHLC/study observation or saved value. */
  lineInspection?: { x: number; y: number; source: 'exact' | 'interpolated'; fromTime: MarketTime; toTime: MarketTime } | null;
  /** Actual price-axis lane in surface-local CSS pixels, including its side; excludes endpoint badges. */
  priceAxis?: { left: number; width: number; surfaceWidth: number; side: 'left' | 'right' };
  /** Resolved collision-free display ticks. Empty in a blank window; absent for legacy/custom engines. */
  timeTicks?: readonly MarketTimeTick[];
  /** Exact runtime state for disposal/recreation; no serializer change. */
  viewport?: import("./technical-chart-state").MarketViewportOptions;
  scale?: import("./technical-chart-state").MarketScaleOptions;
  visibleRange: VisibleRange | null;
  panes: MarketPaneGeometry[];
  scales: Record<string, MarketScaleSnapshot>;
  crosshair: MarketCrosshairSnapshot | null;
}

export interface MarketTimeTick {
  time: MarketTime;
  x: number;
  label: string;
  left: number;
  width: number;
  kind: 'year' | 'month' | 'day' | 'clock';
  source: 'supplied-coordinate' | 'supplied-session' | 'first-observation' | 'wall-clock' | 'future-display';
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type SerializableParameters = Record<string, JsonValue>;
