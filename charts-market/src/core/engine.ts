import type { MarketScaleOptions, MarketViewportOptions, TechnicalPaneState } from "./technical-chart-state";
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
import type { MarketTimeAxis, MarketTimeGap } from "./time-axis";

export interface IndicatorRenderSeries {
  id: string;
  paneId: string;
  placement: "overlay" | "pane";
  style: "line" | "histogram";
  color: string;
  /** Host/definition display metadata. Does not calculate or identify financial results. */
  axisLabel?: {kind: 'moving-average' | 'study'; label: string; shortLabel?: string; status?: string};
  fixedDomain?: readonly [number, number];
  automaticDomain?: import('./extensions').IndicatorAutomaticDomain;
  referenceLines?: Array<{ value: number; label?: string; color?: string }>;
  formatValue?: (value: number) => string;
  points: Array<{ time: MarketTime; value: number | null }>;
}

export interface MarketRenderBounds { x: number; y: number; width: number; height: number }
export interface MarketRenderLayerContext {
  readonly plotBounds?: MarketRenderBounds;
  readonly paneBounds?: Record<string, MarketRenderBounds>;
  readonly axisBounds?: Record<string, MarketRenderBounds>;
  readonly reservedBounds?: MarketRenderBounds;
  readonly visibleData: readonly OhlcBar[];
  readonly panes: readonly MarketPaneGeometry[];
  readonly theme: MarketChartTheme;
  /** Resolve scoped theme CSS variables for Canvas layers; SVG/DOM can use the original CSS color. */
  readonly resolveColor?: (color: string) => string;
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

import type { MarketChartPresentation, MarketChartChangeMetadata } from "./presentation";

export interface MarketChartTheme {
  background: string;
  text: string;
  border: string;
  grid: string;
  positive: string;
  negative: string;
  primary: string;
}

export interface MarketSeriesRendererContext {
  context: CanvasRenderingContext2D;
  scale: { toCoordinate(value: number): number | null };
  pane: MarketPaneGeometry;
  visible: readonly OhlcBar[];
  startIndex: number;
  barSpacing: number;
  /** Canvas backing-store ratio for matching adaptive candle/volume boundaries. Defaults to 1 for external renderer calls. */
  pixelRatio?: number;
  logicalToCoordinate(index: number): number;
  /** Observation-time coordinates for custom renderers on common calendars. */
  timeToCoordinate?: (time: MarketTime) => number | null;
  /** Whether adjacent observations belong to the same host-declared segment. */
  isTimeSegmentContinuous?: (from: MarketTime, to: MarketTime) => boolean;
  theme: MarketChartTheme;
  presentation?: MarketChartPresentation;
}
export interface MarketSeriesRendererDefinition { id: MarketChartType; draw(context: MarketSeriesRendererContext): void }
export interface MarketChartEngineOptions {
  presentation?: MarketChartPresentation;
  timeAxis?: MarketTimeAxis;
  discontinuities?: readonly MarketTimeGap[];
  seriesRenderers?: MarketSeriesRendererDefinition[];
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
  panes?: TechnicalPaneState[];
  viewport?: MarketViewportOptions;
  scale?: MarketScaleOptions;
  onViewportChange?: (viewport: MarketViewportOptions, metadata?: MarketChartChangeMetadata) => void;
  onScaleChange?: (scale: MarketScaleOptions, metadata?: MarketChartChangeMetadata) => void;
  onSnapshotChange?: (snapshot: MarketChartSnapshot) => void;
  onKeyboardInspect?: (snapshot: MarketCrosshairSnapshot) => void;
  paneSizes?: Record<string, number>;
  renderLayers?: MarketRenderLayer[];
  onVisibleRangeChange?: (range: VisibleRange | null, metadata?: MarketChartChangeMetadata) => void;
  onCrosshairMove?: (time: MarketTime | null) => void;
  onCrosshairChange?: (snapshot: MarketCrosshairSnapshot | null) => void;
  onPaneSizesChange?: (sizes: Record<string, number>, metadata?: MarketChartChangeMetadata) => void;
  onError?: (message: string | null) => void;
}

export interface MarketChartEngine {
  resetScale?():void;
  setTheme?(theme: MarketChartTheme): void;
  setPresentation?(presentation: MarketChartPresentation): void;
  setTimeAxis?(axis?: MarketTimeAxis): void;
  setDiscontinuities?(gaps: readonly MarketTimeGap[]): void;
  /** Geometry-only calendar/grid nudge; no synthetic observation is created. */
  shiftTime?(time: MarketTime, steps: number): MarketTime | null;
  setData(data: OhlcBar[]): void;
  appendOrUpdate(bar: OhlcBar): void;
  setChartType(type: MarketChartType): void;
  setScaleMode(mode: MarketScaleMode): void;
  setMarkers(markers: MarketMarker[]): void;
  setExtendedSessions(sessions: MarketSessionRange[]): void;
  setIndicatorSeries(series: IndicatorRenderSeries[]): void;
  setOverlays(overlays: ChartOverlayState[]): void;
  setRenderLayers(layers: MarketRenderLayer[]): void;
  setPanes?(panes: TechnicalPaneState[]): void;
  setViewport?(viewport: MarketViewportOptions): void;
  setScale?(scale: MarketScaleOptions): void;
  setPaneSizes(sizes: Record<string, number>): void;
  setVolumeVisible(visible: boolean): void;
  resize(width: number, height: number): void;
  fitContent(metadata?:MarketChartChangeMetadata): void;
  scrollToRealtime(metadata?:MarketChartChangeMetadata): void;
  setVisibleRange(range: VisibleRange,metadata?:MarketChartChangeMetadata): void;
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
