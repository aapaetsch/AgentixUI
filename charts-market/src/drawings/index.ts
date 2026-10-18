import type { DrawingParameterSchema, DrawingState, DrawingToolDefinition, SerializableParameters } from "../core";

export type DrawingChangeType =
  | "create" | "move" | "resize" | "style" | "delete" | "visibility" | "lock"
  | "duplicate" | "rename" | "reorder" | "group" | "ungroup" | "clipboard" | "clear"
  | "undo" | "redo" | "selection" | "external";

export interface DrawingChangeMetadata {
  type: DrawingChangeType;
  drawingIds: string[];
  transactionId?: string;
}

/** Runtime command mailbox; IDs make retries/controlled rerenders idempotent. */
export interface MarketDrawingCommandRequest { id: string | number; command: MarketDrawingCommand }
export type MarketDrawingCommand =
  | {type:"undo"|"redo"|"delete"|"cancel"}
  | {type:"select";ids:string[]}
  | {type:"style";parameters:SerializableParameters};
export interface MarketDrawingHistorySnapshot {canUndo:boolean;canRedo:boolean;selectedIds:string[];drawingCount:number}

export type DrawingCommand =
  | { type: "add"; drawing: DrawingState }
  | { type: "update"; id: string; changes: Partial<Omit<DrawingState, "id" | "type">> }
  | { type: "remove"; id: string }
  | { type: "select"; id: string | null }
  | { type: "toggleVisibility"; id: string }
  | { type: "toggleLock"; id: string }
  | { type: "commit"; drawings: DrawingState[]; metadata: DrawingChangeMetadata }
  | { type: "rebase"; drawings: DrawingState[] }
  | { type: "undo" }
  | { type: "redo" };

export interface DrawingHistory {
  past: DrawingState[][];
  present: DrawingState[];
  future: DrawingState[][];
  /** Defaults to 100 for histories created by older consumers. */
  limit?: number;
  transactionId?: string;
}

export const DEFAULT_DRAWING_HISTORY_LIMIT = 100;
export const initialDrawingHistory: DrawingHistory = { past: [], present: [], future: [], limit: DEFAULT_DRAWING_HISTORY_LIMIT };

export function createDrawingHistory(drawings: DrawingState[] = [], limit = DEFAULT_DRAWING_HISTORY_LIMIT): DrawingHistory {
  return { past: [], present: stripTransientDrawingState(drawings), future: [], limit: Math.max(0, Math.floor(limit)) };
}

export function stripTransientDrawingState(drawings: readonly DrawingState[]): DrawingState[] {
  return drawings.map(({ selected: _selected, ...drawing }) => drawing);
}

export function drawingDocumentsEqual(first: readonly DrawingState[], second: readonly DrawingState[]): boolean {
  const canonical=(value:unknown):unknown=>Array.isArray(value)?value.map(canonical):value&&typeof value==="object"?Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>[key,canonical(item)])):value;
  return JSON.stringify(canonical(stripTransientDrawingState(first))) === JSON.stringify(canonical(stripTransientDrawingState(second)));
}

function commit(history: DrawingHistory, present: DrawingState[], transactionId?: string): DrawingHistory {
  const normalized = stripTransientDrawingState(present);
  if (drawingDocumentsEqual(history.present, normalized)) return history;
  if (transactionId && transactionId === history.transactionId) {
    return { ...history, present: normalized, future: [], transactionId };
  }
  const limit = history.limit ?? DEFAULT_DRAWING_HISTORY_LIMIT;
  const past = limit === 0 ? [] : [...history.past, stripTransientDrawingState(history.present)].slice(-limit);
  return { ...history, past, present: normalized, future: [], limit, transactionId };
}

export function reduceDrawingHistory(history: DrawingHistory, command: DrawingCommand): DrawingHistory {
  if (command.type === "undo") {
    if (!history.past.length) return history;
    return {
      past: history.past.slice(0, -1),
      present: history.past[history.past.length - 1],
      future: [history.present, ...history.future],
      limit: history.limit ?? DEFAULT_DRAWING_HISTORY_LIMIT,
      transactionId: undefined,
    };
  }
  if (command.type === "redo") {
    if (!history.future.length) return history;
    return {
      past: [...history.past, history.present],
      present: history.future[0],
      future: history.future.slice(1),
      limit: history.limit ?? DEFAULT_DRAWING_HISTORY_LIMIT,
      transactionId: undefined,
    };
  }
  if (command.type === "rebase") {
    if (drawingDocumentsEqual(history.present, command.drawings)) return history;
    return createDrawingHistory(command.drawings, history.limit ?? DEFAULT_DRAWING_HISTORY_LIMIT);
  }
  if (command.type === "commit") return commit(history, command.drawings, command.metadata.transactionId);

  let next = history.present;
  switch (command.type) {
    case "add": next = [...next, command.drawing]; break;
    case "remove": next = next.filter((drawing) => drawing.id !== command.id); break;
    case "update": next = next.map((drawing) => drawing.id === command.id ? { ...drawing, ...command.changes } : drawing); break;
    case "select": return { ...history, present: next.map((drawing) => ({ ...drawing, selected: drawing.id === command.id })) };
    case "toggleVisibility": next = next.map((drawing) => drawing.id === command.id ? { ...drawing, visible: !drawing.visible } : drawing); break;
    case "toggleLock": next = next.map((drawing) => drawing.id === command.id ? { ...drawing, locked: !drawing.locked } : drawing); break;
  }
  return next === history.present ? history : commit(history, next);
}

type DrawingParameters = SerializableParameters & { color: string; lineWidth: number };

const defaults: DrawingParameters = { color: "#64748b", lineWidth: 1, dashStyle: "solid" };
const commonSchema: DrawingParameterSchema = {
  color: { type: "color", label: "Color" },
  lineWidth: { type: "number", label: "Width", minimum: 1, maximum: 5, step: 1 },
  dashStyle: { type: "select", label: "Dash", options: [
    { label: "Solid", value: "solid" }, { label: "Dashed", value: "dashed" }, { label: "Dotted", value: "dotted" },
  ] },
};

const fillSchema: DrawingParameterSchema = { ...commonSchema, fillOpacity: { type: "number", label: "Fill", minimum: 0, maximum: 0.5, step: 0.05 } };
const channelSchema: DrawingParameterSchema = { ...fillSchema, showBoundaries: { type: "boolean", label: "Boundaries" }, showMidline: { type: "boolean", label: "Midline" }, extendLeft: { type: "boolean", label: "Extend left" }, extendRight: { type: "boolean", label: "Extend right" } };
const vwapSchema: DrawingParameterSchema = { ...commonSchema, source: { type: "select", label: "Source", options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"].map((value) => ({ label: value.toUpperCase(), value })) }, band1: { type: "boolean", label: "1σ band" }, band2: { type: "boolean", label: "2σ band" }, band3: { type: "boolean", label: "3σ band" } };
const fibonacciSchema: DrawingParameterSchema = { ...commonSchema, reverse: { type: "boolean", label: "Reverse" }, showPrices: { type: "boolean", label: "Show prices" }, fillBands: { type: "boolean", label: "Fill bands" }, extendLeft: { type: "boolean", label: "Extend left" }, extendRight: { type: "boolean", label: "Extend right" } };

function tool(id: string, label: string, category: DrawingToolDefinition["category"], points: number, parameters: SerializableParameters = {}, rendererId = id, mode: "point" | "drag" | "multi-click" = points === 1 ? "point" : points > 2 ? "multi-click" : "drag", schema: DrawingParameterSchema = commonSchema): DrawingToolDefinition<DrawingParameters> {
  return { id, version: 1, label, rendererId, category, input: { mode, points }, requiredPoints: points, parameterSchema: schema, defaultParameters: { ...defaults, ...parameters } as DrawingParameters };
}

export const trendLineDrawing = tool("trend-line", "Trend line", "lines", 2);
export const arrowDrawing = tool("arrow", "Arrow", "lines", 2);
export const rayDrawing = tool("ray", "Ray", "lines", 2);
export const infoLineDrawing = tool("info-line", "Info line", "lines", 2, { showAngle: false }, "info-line");
export const extendedLineDrawing = tool("extended-line", "Extended line", "lines", 2);
export const trendAngleDrawing = tool("trend-angle", "Trend angle", "lines", 2);
export const horizontalLineDrawing = tool("horizontal-line", "Horizontal line", "lines", 1);
export const horizontalRayDrawing = tool("horizontal-ray", "Horizontal ray", "lines", 1);
export const verticalLineDrawing = tool("vertical-line", "Vertical line", "lines", 1);
export const crossLineDrawing = tool("cross-line", "Cross line", "lines", 1);
export const parallelChannelDrawing = tool("parallel-channel", "Parallel channel", "channels", 3, { fill: true, fillOpacity: 0.1, showBoundaries: true, showMidline: true, extendLeft: false, extendRight: false }, "parallel-channel", "multi-click", channelSchema);
export const regressionTrendDrawing = tool("regression-trend", "Regression trend", "channels", 2, { source: "close", deviation: 2, fill: true, fillOpacity: 0.1, showBoundaries: true, showMidline: true }, "regression-trend", "drag", { ...channelSchema, deviation: { type: "number", label: "Deviation", minimum: 0, maximum: 10, step: 0.25 } });
export const flatTopBottomDrawing = tool("flat-top-bottom", "Flat top/bottom", "channels", 3, { fill: true, fillOpacity: 0.1, showBoundaries: true, showMidline: true }, "flat-top-bottom", "multi-click", channelSchema);
export const disjointChannelDrawing = tool("disjoint-channel", "Disjoint channel", "channels", 4, { fill: true, fillOpacity: 0.1, showBoundaries: true, showMidline: true }, "disjoint-channel", "multi-click", channelSchema);
export const priceRangeDrawing = tool("price-range", "Price range", "measurements", 2, { fillOpacity: 0.12 }, "price-range", "drag", fillSchema);
export const dateRangeDrawing = tool("date-range", "Date range", "measurements", 2, { fillOpacity: 0.12 }, "date-range", "drag", fillSchema);
export const datePriceRangeDrawing = tool("date-price-range", "Date and price range", "measurements", 2, { fillOpacity: 0.12 }, "date-price-range", "drag", fillSchema);
export const longPositionDrawing = tool("long-position", "Long position", "positions", 3, {}, "long-position", "multi-click");
export const shortPositionDrawing = tool("short-position", "Short position", "positions", 3, {}, "short-position", "multi-click");
export const fibonacciRetracementDrawing = tool("fibonacci-retracement", "Fibonacci retracement", "fibonacci", 2, { levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1], levelColors: ["#64748b", "#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b"], reverse: false, showPrices: true, fillBands: true, extendLeft: false, extendRight: false }, "fibonacci-retracement", "drag", fibonacciSchema);
export const fibonacciExtensionDrawing = tool("fibonacci-extension", "Trend-based Fibonacci extension", "fibonacci", 3, { extendRight: true }, "fibonacci-extension", "multi-click");
export const fibonacciTimeZoneDrawing = tool("fibonacci-time-zone", "Fibonacci time zone", "fibonacci", 2);
export const anchoredVwapDrawing = tool("anchored-vwap", "Anchored VWAP", "volume", 1, { source: "hlc3", band1: false, band2: false, band3: false }, "anchored-vwap", "point", vwapSchema);
export const fixedRangeVwapDrawing = tool("fixed-range-vwap", "Fixed range VWAP", "volume", 2, { source: "hlc3", band1: false, band2: false, band3: false }, "fixed-range-vwap", "drag", vwapSchema);
export const rectangleDrawing = tool("rectangle", "Rectangle", "shapes", 2, { fillOpacity: 0.12 }, "rectangle", "drag", fillSchema);
export const ellipseDrawing = tool("ellipse", "Ellipse", "shapes", 2, { fillOpacity: 0.12 }, "ellipse", "drag", fillSchema);
export const circleDrawing = tool("circle", "Circle", "shapes", 2, { fillOpacity: 0.12 }, "circle", "drag", fillSchema);
export const triangleDrawing = tool("triangle", "Triangle", "shapes", 3, { fillOpacity: 0.12 }, "triangle", "multi-click", fillSchema);
export const polylineDrawing: DrawingToolDefinition<DrawingParameters> = { ...tool("polyline", "Polyline", "shapes", 2), input: { mode: "variable", minimumPoints: 2 } };
export const brushDrawing: DrawingToolDefinition<DrawingParameters> = { ...tool("brush", "Brush", "shapes", 2), input: { mode: "freehand", minimumPoints: 2 } };
export const highlighterDrawing: DrawingToolDefinition<DrawingParameters> = { ...tool("highlighter", "Highlighter", "shapes", 2, { lineWidth: 12, opacity: 0.25 }), input: { mode: "freehand", minimumPoints: 2 } };
const annotationSchema: DrawingParameterSchema = { ...commonSchema, text: { type: "text", label: "Text" } };
export const textDrawing = tool("text", "Text", "annotations", 1, { text: "Text" }, "text", "point", annotationSchema);
export const noteDrawing = tool("note", "Note", "annotations", 1, { text: "Note" }, "note", "point", annotationSchema);
export const calloutDrawing = tool("callout", "Callout", "annotations", 2, { text: "Callout" }, "callout", "drag", annotationSchema);
export const priceLabelDrawing = tool("price-label", "Price label", "annotations", 1, { text: "Price" }, "price-label", "point", annotationSchema);
export const priceNoteDrawing = tool("price-note", "Price note", "annotations", 2, { text: "Price note" }, "price-note", "drag", annotationSchema);
export const arrowMarkerDrawing = tool("arrow-marker", "Arrow marker", "annotations", 2, { text: "" }, "arrow-marker", "drag", annotationSchema);

export const builtInDrawingTools: DrawingToolDefinition[] = [trendLineDrawing, arrowDrawing, rayDrawing, infoLineDrawing, extendedLineDrawing, trendAngleDrawing, horizontalLineDrawing, horizontalRayDrawing, verticalLineDrawing, crossLineDrawing, parallelChannelDrawing, regressionTrendDrawing, flatTopBottomDrawing, disjointChannelDrawing, priceRangeDrawing, dateRangeDrawing, datePriceRangeDrawing, longPositionDrawing, shortPositionDrawing, fibonacciRetracementDrawing, fibonacciExtensionDrawing, fibonacciTimeZoneDrawing, anchoredVwapDrawing, fixedRangeVwapDrawing, rectangleDrawing, ellipseDrawing, circleDrawing, triangleDrawing, polylineDrawing, brushDrawing, highlighterDrawing, textDrawing, noteDrawing, calloutDrawing, priceLabelDrawing, priceNoteDrawing, arrowMarkerDrawing];

export type {
  DrawingBounds, DrawingCoordinate, DrawingHandle, DrawingHitResult, DrawingInputLifecycle,
  DrawingParameterSchema, DrawingParameterSchemaField, DrawingPoint, DrawingPrimitive,
  DrawingPrimitiveStyle,
  DrawingRendererContext, DrawingRendererDefinition, DrawingState, DrawingToolCategory, DrawingToolDefinition,
} from "../core";
export { builtInDrawingRenderers } from "./renderers";
export { normalizeDrawingToolDefinition } from "./tool-definition";
export {
  clipLineToBounds, defaultDrawingHandles, distanceBetween, distanceToEllipse, distanceToSegment,
  hitTestDrawings, hitTestPrimitives, pointInRect, resolveDrawingRenderer,
} from "./geometry";
export { DrawingLayer, DrawingToolbar } from "./drawing-layer";
export { defaultDrawingInteraction } from "./drawing-layer";
export type { DrawingInteractionConfig, DrawingLayerProps, DrawingSnapMode, DrawingToolbarProps } from "./drawing-layer";
export { DrawingObjectTree } from "./object-tree";
export type { DrawingObjectTreeProps } from "./object-tree";
export { DrawingInlineTextEditor } from "./inline-text-editor";
export type { DrawingInlineTextEditorProps } from "./inline-text-editor";
export {
  applyDrawingDefaults, applyDrawingTemplate, createDrawingTemplate, duplicateDrawings, filterSynchronizedDrawings, groupDrawings,
  parseDrawingClipboard, reorderDrawing, serializeDrawingClipboard, setAllDrawingLock,
  setAllDrawingVisibility, ungroupDrawings,
} from "./management";
export type { DrawingPreferences, DrawingSynchronizationMode, DrawingTemplate, SerializedDrawingClipboard } from "./management";
export {
  calculateDrawingVwap, calculateLinearRegression, calculatePosition, calculateRangeMeasurement,
  elapsedMilliseconds, formatDuration, resolveInclusiveRange, simplifyCoordinates, sourceValue,
} from "./calculations";
export type { DrawingPriceSource, RangeMeasurement, RegressionResult, VwapPoint, VwapResult } from "./calculations";
