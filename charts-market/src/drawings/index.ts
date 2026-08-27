import type { DrawingParameterSchema, DrawingState, DrawingToolDefinition, SerializableParameters } from "../core";

export type DrawingChangeType =
  | "create" | "move" | "resize" | "style" | "delete" | "visibility" | "lock"
  | "duplicate" | "undo" | "redo" | "selection" | "external";

export interface DrawingChangeMetadata {
  type: DrawingChangeType;
  drawingIds: string[];
  transactionId?: string;
}

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
  return JSON.stringify(stripTransientDrawingState(first)) === JSON.stringify(stripTransientDrawingState(second));
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

const defaults: DrawingParameters = { color: "hsl(var(--primary))", lineWidth: 1, dashStyle: "solid" };
const commonSchema: DrawingParameterSchema = {
  color: { type: "color", label: "Color" },
  lineWidth: { type: "number", label: "Width", minimum: 1, maximum: 5, step: 1 },
  dashStyle: { type: "select", label: "Dash", options: [
    { label: "Solid", value: "solid" }, { label: "Dashed", value: "dashed" }, { label: "Dotted", value: "dotted" },
  ] },
};

export const horizontalLineDrawing: DrawingToolDefinition<DrawingParameters> = {
  id: "horizontal-line", version: 1, label: "Horizontal line", rendererId: "horizontal-line", category: "lines", input: { mode: "point", points: 1 }, requiredPoints: 1, parameterSchema: commonSchema, defaultParameters: defaults,
};
export const verticalLineDrawing: DrawingToolDefinition<DrawingParameters> = {
  id: "vertical-line", version: 1, label: "Vertical line", rendererId: "vertical-line", category: "lines", input: { mode: "point", points: 1 }, requiredPoints: 1, parameterSchema: commonSchema, defaultParameters: defaults,
};
export const trendLineDrawing: DrawingToolDefinition<DrawingParameters> = {
  id: "trend-line", version: 1, label: "Trend line", rendererId: "trend-line", category: "lines", input: { mode: "drag", points: 2 }, requiredPoints: 2, parameterSchema: commonSchema, defaultParameters: defaults,
};
export const rectangleDrawing: DrawingToolDefinition<DrawingParameters> = {
  id: "rectangle", version: 1, label: "Rectangle", rendererId: "rectangle", category: "shapes", input: { mode: "drag", points: 2 }, requiredPoints: 2, parameterSchema: { ...commonSchema, fillOpacity: { type: "number", label: "Fill", minimum: 0, maximum: 0.5, step: 0.05 } }, defaultParameters: { ...defaults, fillOpacity: 0.12 },
};
export const rayDrawing: DrawingToolDefinition<DrawingParameters> = {
  id: "ray", version: 1, label: "Ray", rendererId: "ray", category: "lines", input: { mode: "drag", points: 2 }, requiredPoints: 2, parameterSchema: commonSchema, defaultParameters: defaults,
};
export const extendedLineDrawing: DrawingToolDefinition<DrawingParameters> = {
  id: "extended-line", version: 1, label: "Extended line", rendererId: "extended-line", category: "lines", input: { mode: "drag", points: 2 }, requiredPoints: 2, parameterSchema: commonSchema, defaultParameters: defaults,
};
export const ellipseDrawing: DrawingToolDefinition<DrawingParameters> = {
  id: "ellipse", version: 1, label: "Ellipse", rendererId: "ellipse", category: "shapes", input: { mode: "drag", points: 2 }, requiredPoints: 2, parameterSchema: { ...commonSchema, fillOpacity: { type: "number", label: "Fill", minimum: 0, maximum: 0.5, step: 0.05 } }, defaultParameters: { ...defaults, fillOpacity: 0.12 },
};
export const fibonacciRetracementDrawing: DrawingToolDefinition<DrawingParameters> = {
  id: "fibonacci-retracement", version: 1, label: "Fibonacci retracement", rendererId: "fibonacci-retracement", category: "fibonacci", input: { mode: "drag", points: 2 }, requiredPoints: 2, parameterSchema: commonSchema, defaultParameters: defaults,
};

export const builtInDrawingTools: DrawingToolDefinition[] = [
  horizontalLineDrawing, verticalLineDrawing, trendLineDrawing, rayDrawing,
  extendedLineDrawing, rectangleDrawing, ellipseDrawing, fibonacciRetracementDrawing,
] as DrawingToolDefinition[];

export type {
  DrawingBounds, DrawingCoordinate, DrawingHandle, DrawingHitResult, DrawingInputLifecycle,
  DrawingParameterSchema, DrawingParameterSchemaField, DrawingPoint, DrawingPrimitive,
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
