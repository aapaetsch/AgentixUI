import type { DrawingState, DrawingToolDefinition, SerializableParameters } from "../core";

export type DrawingSynchronizationMode = "off" | "same-symbol" | "layout";

export interface DrawingTemplate {
  id: string;
  name: string;
  toolId: string;
  parameters: SerializableParameters;
}

export interface DrawingPreferences {
  favoriteToolIds: string[];
  recentToolIds: string[];
  keepDrawingMode: boolean;
  defaults: Record<string, SerializableParameters>;
  templates: DrawingTemplate[];
}

export interface SerializedDrawingClipboard {
  kind: "agentix-drawings";
  version: 1;
  drawings: DrawingState[];
}

export function serializeDrawingClipboard(drawings: readonly DrawingState[]): string {
  return JSON.stringify({ kind: "agentix-drawings", version: 1, drawings: drawings.slice() } satisfies SerializedDrawingClipboard);
}

export function parseDrawingClipboard(value: string): DrawingState[] {
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || (parsed as { kind?: unknown }).kind !== "agentix-drawings" || (parsed as { version?: unknown }).version !== 1 || !Array.isArray((parsed as { drawings?: unknown }).drawings)) throw new Error("Invalid drawing clipboard payload.");
  return (parsed as SerializedDrawingClipboard).drawings.map((drawing) => ({ ...drawing, points: drawing.points.map((point) => ({ ...point })), parameters: { ...drawing.parameters } }));
}

export function applyDrawingDefaults(tool: DrawingToolDefinition, defaults?: SerializableParameters): DrawingToolDefinition {
  return { ...tool, defaultParameters: { ...tool.defaultParameters, ...defaults } };
}

export function createDrawingTemplate(id: string, name: string, toolId: string, parameters: SerializableParameters): DrawingTemplate {
  return { id, name, toolId, parameters: { ...parameters } };
}

export function applyDrawingTemplate(tool: DrawingToolDefinition, template: DrawingTemplate): DrawingToolDefinition {
  if (template.toolId !== tool.id) throw new Error(`Template ${template.id} does not apply to ${tool.id}.`);
  return applyDrawingDefaults(tool, template.parameters);
}

export function duplicateDrawings(drawings: readonly DrawingState[], ids: readonly string[], makeId: () => string): DrawingState[] {
  const selected = new Set(ids);
  return [...drawings, ...drawings.filter((drawing) => selected.has(drawing.id)).map((drawing) => ({ ...drawing, id: makeId(), name: drawing.name ? `${drawing.name} copy` : undefined, points: drawing.points.map((point) => ({ ...point })), parameters: { ...drawing.parameters } }))];
}

export function reorderDrawing(drawings: readonly DrawingState[], id: string, direction: "forward" | "backward" | "front" | "back"): DrawingState[] {
  const next = drawings.slice(); const index = next.findIndex((drawing) => drawing.id === id); if (index < 0) return next;
  const [drawing] = next.splice(index, 1); const destination = direction === "front" ? next.length : direction === "back" ? 0 : direction === "forward" ? Math.min(next.length, index + 1) : Math.max(0, index - 1); next.splice(destination, 0, drawing);
  return next.map((item, zIndex) => ({ ...item, zIndex }));
}

export function groupDrawings(drawings: readonly DrawingState[], ids: readonly string[], groupId: string): DrawingState[] { const selected = new Set(ids); return drawings.map((drawing) => selected.has(drawing.id) ? { ...drawing, groupId } : drawing); }
export function ungroupDrawings(drawings: readonly DrawingState[], ids: readonly string[]): DrawingState[] { const selected = new Set(ids); return drawings.map((drawing) => selected.has(drawing.id) ? { ...drawing, groupId: undefined } : drawing); }
export function setAllDrawingVisibility(drawings: readonly DrawingState[], visible: boolean): DrawingState[] { return drawings.map((drawing) => ({ ...drawing, visible })); }
export function setAllDrawingLock(drawings: readonly DrawingState[], locked: boolean): DrawingState[] { return drawings.map((drawing) => ({ ...drawing, locked })); }

export function filterSynchronizedDrawings(drawings: readonly DrawingState[], mode: DrawingSynchronizationMode, sourceSymbol: string, targetSymbol: string): DrawingState[] {
  if (mode === "off" || mode === "same-symbol" && sourceSymbol !== targetSymbol) return [];
  return drawings.map((drawing) => ({ ...drawing, points: drawing.points.map((point) => ({ ...point })), parameters: { ...drawing.parameters } }));
}
