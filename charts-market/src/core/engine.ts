import type {
  MarketChartType,
  MarketMarker,
  MarketScaleMode,
  MarketSessionRange,
  MarketChartSnapshot,
  MarketCrosshairSnapshot,
  MarketPaneGeometry,
  MarketTime,
  OhlcBar,
  VisibleRange,
} from "./types";
import type { ChartOverlayState, DrawingPoint } from "./extensions";

export interface IndicatorRenderSeries {
  id: string;
  paneId: string;
  placement: "overlay" | "pane";
  style: "line" | "histogram";
  color: string;
  fixedDomain?: readonly [number, number];
  referenceLines?: Array<{ value: number; label?: string; color?: string }>;
  formatValue?: (value: number) => string;
  points: Array<{ time: MarketTime; value: number | null }>;
}

export interface MarketRenderLayerContext {
  readonly visibleData: readonly OhlcBar[];
  readonly panes: readonly MarketPaneGeometry[];
  readonly theme: MarketChartTheme;
  readonly canvas: CanvasRenderingContext2D;
  readonly timeToCoordinate: (time: MarketTime) => number | null;
  readonly priceToCoordinate: (price: number, paneId?: string) => number | null;
}

export interface MarketRenderLayerPointerEvent {
  type: "pointerdown" | "pointermove" | "pointerup";
  x: number;
  y: number;
  sourceEvent: PointerEvent;
}

export interface MarketRenderLayer {
  id: string;
  paneId?: string;
  zIndex?: number;
  draw(context: MarketRenderLayerContext): void;
  hitTest?: (point: { x: number; y: number }, context: MarketRenderLayerContext) => boolean;
  onPointerEvent?: (event: MarketRenderLayerPointerEvent, context: MarketRenderLayerContext) => void;
}

export interface MarketChartTheme {
  background: string;
  text: string;
  border: string;
  grid: string;
  positive: string;
  negative: string;
  primary: string;
}

export interface MarketChartEngineOptions {
  chartType: MarketChartType;
  data: OhlcBar[];
  height: number;
  showVolume: boolean;
  scaleMode: MarketScaleMode;
  markers: MarketMarker[];
  extendedSessions?: MarketSessionRange[];
  locale?: string;
  timeZone?: string;
  theme: MarketChartTheme;
  paneSizes?: Record<string, number>;
  renderLayers?: MarketRenderLayer[];
  onVisibleRangeChange?: (range: VisibleRange | null) => void;
  onCrosshairMove?: (time: MarketTime | null) => void;
  onCrosshairChange?: (snapshot: MarketCrosshairSnapshot | null) => void;
  onPaneSizesChange?: (sizes: Record<string, number>) => void;
  onError?: (message: string | null) => void;
}

export interface MarketChartEngine {
  setData(data: OhlcBar[]): void;
  appendOrUpdate(bar: OhlcBar): void;
  setChartType(type: MarketChartType): void;
  setScaleMode(mode: MarketScaleMode): void;
  setMarkers(markers: MarketMarker[]): void;
  setExtendedSessions(sessions: MarketSessionRange[]): void;
  setIndicatorSeries(series: IndicatorRenderSeries[]): void;
  setOverlays(overlays: ChartOverlayState[]): void;
  setRenderLayers(layers: MarketRenderLayer[]): void;
  setPaneSizes(sizes: Record<string, number>): void;
  setVolumeVisible(visible: boolean): void;
  resize(width: number, height: number): void;
  fitContent(): void;
  scrollToRealtime(): void;
  setVisibleRange(range: VisibleRange): void;
  setCrosshairPosition(time: MarketTime, price: number): void;
  clearCrosshairPosition(): void;
  coordinateForTime(time: MarketTime): number | null;
  coordinateFor(point: DrawingPoint): { x: number; y: number } | null;
  pointForCoordinate(coordinate: { x: number; y: number }): DrawingPoint | null;
  getSnapshot(): MarketChartSnapshot;
  destroy(): void;
}

export type MarketChartEngineFactory = (
  container: HTMLElement,
  options: MarketChartEngineOptions,
) => MarketChartEngine | Promise<MarketChartEngine>;
