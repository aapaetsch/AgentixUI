import type { JsonValue, MarketTime, OhlcBar, SerializableParameters } from "./types";

export interface IndicatorLineDefinition {
  id: string;
  label: string;
  color?: string;
  style?: "line" | "histogram";
}

export interface IndicatorPoint {
  time: OhlcBar["time"];
  values: Record<string, number | null>;
}

export interface IndicatorDefinition<TParameters extends SerializableParameters = SerializableParameters> {
  id: string;
  version: number;
  label: string;
  placement: "overlay" | "pane";
  defaultParameters: TParameters;
  lines: IndicatorLineDefinition[];
  /** Presentation eligibility only; custom supplied moving-average definitions can opt in. Never a calculation key. */
  axisLabelKind?: 'moving-average';
  /** Presentation only; never enters calculation requests or saved instance identity. */
  formatParameters?: (parameters: TParameters) => string;
  /** Pane autoscale policy. Ignored when fixedDomain is supplied. */
  automaticDomain?: IndicatorAutomaticDomain;
  fixedDomain?: readonly [number, number];
  referenceLines?: Array<{ value: number; label?: string; color?: string }>;
  formatValue?: (value: number) => string;
  createRuntime?: (parameters: TParameters) => IndicatorRuntime;
  calculate(data: readonly OhlcBar[], parameters: TParameters): IndicatorPoint[];
}

/** Raw supplied units; reference inclusion and padding never calculate indicator values. */
export interface IndicatorAutomaticDomain {
  /** Include all finite reference levels in the automatic domain. Default true. */
  includeReferences?: boolean;
  /** Fraction of the visible span added at each end. Default 0.08. */
  padding?: number;
  /** Minimum span before padding. Default 2% of magnitude; zero uses 1. */
  minimumSpan?: number;
  /** Domain used for an empty/warmup-only window, unioned with references. Default [0, 1]. */
  emptyDomain?: readonly [number, number];
}

export interface IndicatorRuntime {
  reset(data: readonly OhlcBar[]): IndicatorPoint[];
  appendOrUpdate(bar: OhlcBar): IndicatorPoint;
}

export interface IndicatorInstance<TParameters extends SerializableParameters = SerializableParameters> {
  id: string;
  definition: IndicatorDefinition<TParameters>;
  parameters: TParameters;
  visible: boolean;
  colors?: Record<string, string>;
}

export interface DrawingPoint {
  time: OhlcBar["time"];
  price: number;
  /** Optional persistent OHLC binding used by snapped points. */
  anchor?: { field: "open" | "high" | "low" | "close" };
}

export interface DrawingState<TParameters extends SerializableParameters = SerializableParameters> {
  id: string;
  type: string;
  version: number;
  points: DrawingPoint[];
  parameters: TParameters;
  visible: boolean;
  locked: boolean;
  name?: string;
  paneId?: string;
  zIndex?: number;
  groupId?: string;
  extensions?: Record<string, JsonValue>;
  /** @deprecated Use MarketChart.selectedDrawingIds for transient selection state. */
  selected?: boolean;
}

export interface DrawingCoordinate {
  x: number;
  y: number;
}

export interface DrawingBounds {
  width: number;
  height: number;
}

export interface DrawingPrimitiveStyle {
  stroke?: string;
  fill?: string;
  opacity?: number;
  lineWidth?: number;
  dashStyle?: "solid" | "dashed" | "dotted";
}

export type DrawingPrimitive = DrawingPrimitiveStyle & (
  | { id: string; kind: "line"; from: DrawingCoordinate; to: DrawingCoordinate; role?: "boundary" | "midline" | "level" }
  | { id: string; kind: "rect"; x: number; y: number; width: number; height: number; closed?: boolean }
  | { id: string; kind: "ellipse"; cx: number; cy: number; rx: number; ry: number; closed?: boolean }
  | { id: string; kind: "polyline"; points: DrawingCoordinate[]; closed?: boolean }
  | { id: string; kind: "polygon"; points: DrawingCoordinate[]; closed: true }
  | { id: string; kind: "band"; upper: DrawingCoordinate[]; lower: DrawingCoordinate[] }
  | { id: string; kind: "path"; points: DrawingCoordinate[]; curve?: "linear" | "smooth" }
  | { id: string; kind: "arrowhead"; at: DrawingCoordinate; from: DrawingCoordinate; size?: number }
  | { id: string; kind: "text"; at: DrawingCoordinate; text: string; anchor?: "start" | "middle" | "end" }
  | { id: string; kind: "multiline-text"; at: DrawingCoordinate; lines: string[]; anchor?: "start" | "middle" | "end"; background?: boolean }
);

export interface DrawingHandle {
  id: string;
  pointIndex: number;
  position: DrawingCoordinate;
  cursor?: string;
  label?: string;
}

export interface DrawingHitResult {
  drawingId: string;
  rendererId: string;
  kind: "body" | "handle";
  distance: number;
  zIndex: number;
  handleId?: string;
  pointIndex?: number;
}

export interface DrawingRendererContext {
  /** Runtime visible bounds permit bounded supplied-path rendering and hit tests. */
  visibleRange?: import("./types").VisibleRange | null;
  drawing: DrawingState;
  points: Array<DrawingCoordinate | null>;
  bounds: DrawingBounds;
  /** Ordered, read-only source data. */
  data: readonly OhlcBar[];
  resolveRange(first: DrawingPoint, second: DrawingPoint): readonly OhlcBar[];
  coordinateFor(point: DrawingPoint): DrawingCoordinate | null;
  /** Host-supplied discontinuities, independent of source observation density. */
  isTimeSegmentContinuous?: (from: MarketTime, to: MarketTime) => boolean;
}

export interface DrawingRendererDefinition {
  id: string;
  getPrimitives(context: DrawingRendererContext): DrawingPrimitive[];
  getHandles?(context: DrawingRendererContext): DrawingHandle[];
  hitTest?(
    point: DrawingCoordinate,
    context: DrawingRendererContext,
    tolerance: number,
  ): Omit<DrawingHitResult, "drawingId" | "rendererId" | "zIndex"> | null;
  derivedValues?(context: DrawingRendererContext): Record<string, string | number | boolean | null>;
  describe?(context: DrawingRendererContext): string;
}

export type DrawingToolCategory = "lines" | "channels" | "measurements" | "positions" | "shapes" | "annotations" | "fibonacci" | "volume" | (string & {});

export interface DrawingInputLifecycle {
  mode: "point" | "drag" | "multi-click" | "variable" | "freehand";
  points?: number;
  minimumPoints?: number;
  maximumPoints?: number;
  allowDegenerate?: boolean;
}

export interface DrawingParameterSchemaField {
  type: "color" | "number" | "select" | "boolean" | "text";
  label: string;
  minimum?: number;
  maximum?: number;
  step?: number;
  options?: Array<{ label: string; value: string | number }>;
}

export type DrawingParameterSchema = Record<string, DrawingParameterSchemaField>;

export interface DrawingToolDefinition<TParameters extends SerializableParameters = SerializableParameters> {
  id: string;
  version: number;
  label: string;
  /** Defaults to the tool id. */
  rendererId?: string;
  category?: DrawingToolCategory;
  input?: DrawingInputLifecycle;
  parameterSchema?: DrawingParameterSchema;
  /** @deprecated Prefer input.points. Legacy definitions are adapted automatically. */
  requiredPoints?: number;
  defaultParameters: TParameters;
}

export interface ChartOverlayState<TParameters extends SerializableParameters = SerializableParameters> {
  id: string;
  type: string;
  version: number;
  parameters: TParameters;
  visible: boolean;
}

export interface ChartOverlayDefinition<TParameters extends SerializableParameters = SerializableParameters> {
  id: string;
  version: number;
  label: string;
  defaultParameters: TParameters;
}
