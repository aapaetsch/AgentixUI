import type { ChartOverlayState, DrawingState } from "./extensions";
import type {
  JsonValue,
  MarketChartType,
  MarketScaleMode,
  SerializableParameters,
  VisibleRange,
} from "./types";

export interface MarketScaleOptions {
  mode: MarketScaleMode;
  autoScale: boolean;
  /** Transformed scale bounds, as returned by the engine snapshot. */
  manualRange?: { minimum: number; maximum: number; anchor?: number };
}
export interface MarketViewportOptions {
  /** Exact logical coordinates for lossless controlled pan/zoom round-trips. */
  logicalRange?: { from: number; to: number };
  rightOffsetBars?: number;
  minimumRightOffsetBars?: number;
  maximumRightOffsetBars?: number;
  visibleRange?: VisibleRange;
  inspection?: "follow" | "persistent";
}
export interface TechnicalPaneState {
  id: string;
  order: number;
  size: number;
  /** Minimum height in CSS pixels in the Canvas coordinate system. */
  minimumSize?: number;
  collapsed?: boolean;
  visible?: boolean;
  scaleSide?: "left" | "right";
  scaleMode?: MarketScaleMode;
  precision?: number;
  studyIds: string[];
  showVolume?: boolean;
  extensions?: Record<string, JsonValue>;
}
export interface TechnicalIndicatorInstanceState {
  id: string;
  definitionId: string;
  version: number;
  parameters: SerializableParameters;
  visible: boolean;
  colors?: Record<string, string>;
  extensions?: Record<string, JsonValue>;
}
export interface VolumeProfileLevel {
  priceFrom: number;
  priceTo: number;
  /** Optional authoritative unsplit row volume. Directional fields may both be zero. */
  volume?: number;
  upVolume: number;
  downVolume: number;
}
export type VolumeProfileSource =
  | { kind: "derive-from-bars"; bars: readonly import("./types").OhlcBar[] }
  | { kind: "levels"; levels: readonly VolumeProfileLevel[] };
export interface VolumeProfileState {
  id: string;
  visible: boolean;
  range: "visible" | "session" | "fixed";
  /** Required for fixed/session ranges; sessions are consumer-defined, never inferred. */
  timeRange?: VisibleRange;
  rows: number | { ticksPerRow: number };
  tickSize?: number;
  widthPercent: number;
  placement: "right" | "left";
  valueAreaPercent: number;
  showPoc: boolean;
  showValueArea: boolean;
  splitVolume: boolean;
  opacity?: number;
  /** CSS colors for up/down volume and the point of control. */
  upColor?: string;
  downColor?: string;
  pocColor?: string;
  extensions?: Record<string, JsonValue>;
}
export interface TechnicalChartChromeState {
  drawingRail: boolean;
  footer: boolean;
  maximized: boolean;
  favoriteTools: string[];
  favoriteIntervals: string[];
  recentIntervals: string[];
  magnet: "off" | "weak" | "strong";
  keepDrawingMode: boolean;
}
export interface TechnicalChartViewState {
  version: 1;
  chartType: MarketChartType;
  scale: MarketScaleOptions;
  viewport: MarketViewportOptions;
  panes: TechnicalPaneState[];
  indicators: TechnicalIndicatorInstanceState[];
  profiles: VolumeProfileState[];
  drawings: DrawingState[];
  overlays: ChartOverlayState[];
  selectedDrawingIds: string[];
  activeDrawingTool?: string;
  chrome: TechnicalChartChromeState;
  extensions?: Record<string, JsonValue>;
}
export interface TechnicalChartViewChangeMetadata {
  source?: import("./presentation").MarketChartChangeMetadata["source"];
  gesture?: import("./presentation").MarketChartChangeMetadata["gesture"];
  type:
    | "viewport"
    | "pane-resize"
    | "pane-reorder"
    | "pane"
    | "indicator-add"
    | "indicator-settings"
    | "indicator-remove"
    | "profile-settings"
    | "drawing"
    | "scale"
    | "chrome"
    | "layout";
  id?: string;
}
export type TechnicalChartViewAction =
  | { type: "replace"; state: TechnicalChartViewState }
  | {
      type: "patch";
      changes: Partial<Omit<TechnicalChartViewState, "version">>;
    }
  | { type: "move-pane"; id: string; direction: -1 | 1 }
  | { type: "resize-pane"; id: string; size: number };

export function createTechnicalChartViewState(
  preset: "daily-analysis" | "price-only" = "daily-analysis",
): TechnicalChartViewState {
  const study = (
    id: string,
    definitionId: string,
    parameters: SerializableParameters,
  ): TechnicalIndicatorInstanceState => ({
    id,
    definitionId,
    parameters,
    version: 1,
    visible: true,
    colors:
      id === "sma100"
        ? { sma: "hsl(var(--chart-4))" }
        : id === "sma150"
          ? { sma: "hsl(var(--chart-5))" }
          : id === "rsi"
            ? { rsi: "#9670ed" }
            : id === "stochastic"
              ? { k: "#0284c7", d: "#d97706" }
              : undefined,
  });
  return {
    version: 1,
    chartType: "candlestick",
    scale: { mode: "normal", autoScale: true },
    viewport: {
      rightOffsetBars: 28,
      minimumRightOffsetBars: 0,
      maximumRightOffsetBars: 150,
      inspection: "follow",
    },
    panes:
      preset === "price-only"
        ? [{ id: "price", order: 0, size: 1, studyIds: [] }]
        : [
            {
              id: "momentum",
              order: 0,
              size: 1.25,
              minimumSize: 96,
              studyIds: ["rsi"],
            },
            {
              id: "price",
              order: 1,
              size: 3.6,
              minimumSize: 120,
              studyIds: ["ema20", "sma50", "sma100", "sma150"],
            },
            {
              id: "trend",
              order: 2,
              size: 1.3,
              minimumSize: 72,
              studyIds: ["macd"],
              showVolume: true,
            },
            {
              id: "oscillator",
              order: 3,
              size: 1.25,
              minimumSize: 96,
              studyIds: ["stochastic"],
            },
          ],
    indicators:
      preset === "price-only"
        ? []
        : [
            study("rsi", "rsi", { period: 14 }),
            study("ema20", "ema", { period: 20 }),
            study("sma50", "sma", { period: 50 }),
            study("sma100", "sma", { period: 100 }),
            study("sma150", "sma", { period: 150 }),
            study("macd", "macd", {
              fastPeriod: 12,
              slowPeriod: 26,
              signalPeriod: 9,
            }),
            study("stochastic", "stochastic", { period: 14, smooth: 3 }),
          ],
    profiles:
      preset === "price-only"
        ? []
        : [
            {
              id: "visible-profile",
              visible: true,
              range: "visible",
              rows: 24,
              widthPercent: 22,
              placement: "right",
              valueAreaPercent: 70,
              showPoc: true,
              showValueArea: true,
              splitVolume: true,
              opacity: 0.85,
            },
          ],
    drawings: [],
    overlays: [],
    selectedDrawingIds: [],
    chrome: {
      drawingRail: true,
      footer: true,
      maximized: false,
      favoriteTools: [
        "trend-line",
        "horizontal-line",
        "rectangle",
        "fibonacci-retracement",
      ],
      favoriteIntervals: ["1D", "1W"],
      recentIntervals: [],
      magnet: "weak",
      keepDrawingMode: false,
    },
  };
}
export function technicalChartViewReducer(
  state: TechnicalChartViewState,
  action: TechnicalChartViewAction,
): TechnicalChartViewState {
  if (action.type === "replace") return action.state;
  if (action.type === "patch")
    return { ...state, ...action.changes, version: 1 };
  if (action.type === "resize-pane")
    return {
      ...state,
      panes: state.panes.map((p) =>
        p.id === action.id ? { ...p, size: Math.max(0.05, action.size) } : p,
      ),
    };
  const panes = [...state.panes].sort((a, b) => a.order - b.order);
  const index = panes.findIndex((p) => p.id === action.id);
  const next = index + action.direction;
  if (index < 0 || next < 0 || next >= panes.length) return state;
  [panes[index], panes[next]] = [panes[next], panes[index]];
  return { ...state, panes: panes.map((p, order) => ({ ...p, order })) };
}
export function serializeTechnicalChartViewState(
  state: TechnicalChartViewState,
): string {
  return JSON.stringify(state);
}
export function parseTechnicalChartViewState(
  serialized: string,
): TechnicalChartViewState {
  const state = JSON.parse(serialized) as TechnicalChartViewState;
  if (
    !state ||
    state.version !== 1 ||
    !Array.isArray(state.panes) ||
    !Array.isArray(state.indicators) ||
    !Array.isArray(state.profiles) ||
    !state.viewport ||
    !state.scale ||
    !state.chrome ||
    !Array.isArray(state.drawings) ||
    !Array.isArray(state.overlays) ||
    !Array.isArray(state.selectedDrawingIds)
  )
    throw new Error("Unsupported technical chart state. Expected version 1.");
  if (
    !["candlestick", "bar", "line", "area", "baseline"].includes(
      state.chartType,
    ) ||
    !["normal", "logarithmic", "percentage", "indexedTo100"].includes(
      state.scale.mode,
    ) ||
    !state.panes.some((p) => p?.id === "price") ||
    state.panes.some(
      (p) =>
        !p ||
        typeof p.id !== "string" ||
        !Number.isFinite(p.order) ||
        !Number.isFinite(p.size) ||
        p.size <= 0 ||
        !Array.isArray(p.studyIds),
    ) ||
    new Set(state.panes.map((p) => p.id)).size !== state.panes.length ||
    state.indicators.some(
      (i) =>
        !i ||
        typeof i.id !== "string" ||
        typeof i.definitionId !== "string" ||
        !i.parameters,
    ) ||
    !Array.isArray(state.chrome.favoriteTools) ||
    !Array.isArray(state.chrome.favoriteIntervals) ||
    !Array.isArray(state.chrome.recentIntervals)
  )
    throw new Error("Invalid technical chart state.");
  return state;
}
/** Adapt the legacy independent study/volume panes without changing their ordering. */
export function adaptLegacyPanes(
  studyIds: string[],
  showVolume: boolean,
  sizes: Record<string, number> = {},
): TechnicalPaneState[] {
  return ["price", ...(showVolume ? ["volume"] : []), ...new Set(studyIds)].map(
    (id, order) => ({
      id,
      order,
      size: sizes[id] ?? (id === "price" ? 3 : 1),
      studyIds: id === "price" || id === "volume" ? [] : [id],
      showVolume: id === "volume",
    }),
  );
}
