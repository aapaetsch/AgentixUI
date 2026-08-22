import type { DrawingState, DrawingToolDefinition, SerializableParameters } from "../core";

export type DrawingCommand =
  | { type: "add"; drawing: DrawingState }
  | { type: "update"; id: string; changes: Partial<Omit<DrawingState, "id" | "type">> }
  | { type: "remove"; id: string }
  | { type: "select"; id: string | null }
  | { type: "toggleVisibility"; id: string }
  | { type: "toggleLock"; id: string }
  | { type: "undo" }
  | { type: "redo" };

export interface DrawingHistory {
  past: DrawingState[][];
  present: DrawingState[];
  future: DrawingState[][];
}

export const initialDrawingHistory: DrawingHistory = { past: [], present: [], future: [] };

function commit(history: DrawingHistory, present: DrawingState[]): DrawingHistory {
  return { past: [...history.past, history.present], present, future: [] };
}

export function reduceDrawingHistory(history: DrawingHistory, command: DrawingCommand): DrawingHistory {
  if (command.type === "undo") {
    if (!history.past.length) return history;
    return {
      past: history.past.slice(0, -1),
      present: history.past[history.past.length - 1],
      future: [history.present, ...history.future],
    };
  }
  if (command.type === "redo") {
    if (!history.future.length) return history;
    return {
      past: [...history.past, history.present],
      present: history.future[0],
      future: history.future.slice(1),
    };
  }

  let next = history.present;
  switch (command.type) {
    case "add": next = [...next, command.drawing]; break;
    case "remove": next = next.filter((drawing) => drawing.id !== command.id); break;
    case "update": next = next.map((drawing) => drawing.id === command.id ? { ...drawing, ...command.changes } : drawing); break;
    case "select": next = next.map((drawing) => ({ ...drawing, selected: drawing.id === command.id })); break;
    case "toggleVisibility": next = next.map((drawing) => drawing.id === command.id ? { ...drawing, visible: !drawing.visible } : drawing); break;
    case "toggleLock": next = next.map((drawing) => drawing.id === command.id ? { ...drawing, locked: !drawing.locked } : drawing); break;
  }
  return next === history.present ? history : commit(history, next);
}

type DrawingParameters = SerializableParameters & { color: string; lineWidth: number };

const defaults: DrawingParameters = { color: "hsl(var(--primary))", lineWidth: 1 };

export const horizontalLineDrawing: DrawingToolDefinition<DrawingParameters> = {
  id: "horizontal-line", version: 1, label: "Horizontal line", requiredPoints: 1, defaultParameters: defaults,
};
export const verticalLineDrawing: DrawingToolDefinition<DrawingParameters> = {
  id: "vertical-line", version: 1, label: "Vertical line", requiredPoints: 1, defaultParameters: defaults,
};
export const trendLineDrawing: DrawingToolDefinition<DrawingParameters> = {
  id: "trend-line", version: 1, label: "Trend line", requiredPoints: 2, defaultParameters: defaults,
};
export const rectangleDrawing: DrawingToolDefinition<DrawingParameters> = {
  id: "rectangle", version: 1, label: "Rectangle", requiredPoints: 2, defaultParameters: { ...defaults, fillOpacity: 0.12 },
};

export const builtInDrawingTools: DrawingToolDefinition[] = [
  horizontalLineDrawing, verticalLineDrawing, trendLineDrawing, rectangleDrawing,
] as DrawingToolDefinition[];

export type { DrawingPoint, DrawingState, DrawingToolDefinition } from "../core";
export { DrawingLayer, DrawingToolbar } from "./drawing-layer";
export type { DrawingLayerProps, DrawingToolbarProps } from "./drawing-layer";
