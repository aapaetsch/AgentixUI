import { describe, expect, it } from "vitest";
import type { DrawingState } from "../core";
import { applyDrawingTemplate, builtInDrawingTools, createDrawingTemplate, filterSynchronizedDrawings, groupDrawings, parseDrawingClipboard, reorderDrawing, serializeDrawingClipboard, trendLineDrawing, ungroupDrawings } from ".";

const drawings: DrawingState[] = ["a", "b", "c"].map((id, index) => ({ id, type: "trend-line", version: 1, points: [{ time: index, price: index }], parameters: {}, visible: true, locked: false }));

describe("drawing management", () => {
  it("round-trips the versioned clipboard format", () => expect(parseDrawingClipboard(serializeDrawingClipboard(drawings))).toEqual(drawings));
  it("round-trips every built-in tool without losing opaque state", () => { const catalog = builtInDrawingTools.map((tool, index) => ({ id: tool.id, type: tool.id, version: tool.version, points: [{ time: index + 1, price: 100, anchor: { field: "close" as const } }], parameters: { ...tool.defaultParameters }, visible: true, locked: false, name: tool.label, paneId: "price", zIndex: index, groupId: "catalog", extensions: { opaque: { kept: true } } })); expect(parseDrawingClipboard(serializeDrawingClipboard(catalog))).toEqual(catalog); });
  it("reorders deterministically and assigns explicit z-index", () => expect(reorderDrawing(drawings, "a", "front").map((drawing) => [drawing.id, drawing.zIndex])).toEqual([["b", 0], ["c", 1], ["a", 2]]));
  it("groups and ungroups selected drawings", () => expect(ungroupDrawings(groupDrawings(drawings, ["a", "b"], "g1"), ["a"]).map((drawing) => drawing.groupId)).toEqual([undefined, "g1", undefined]));
  it("keeps migrated off/same-symbol synchronization scoped", () => { expect(filterSynchronizedDrawings(drawings, "off", "AAPL", "AAPL")).toEqual([]); expect(filterSynchronizedDrawings(drawings, "same-symbol", "AAPL", "MSFT")).toEqual([]); expect(filterSynchronizedDrawings(drawings, "layout", "AAPL", "MSFT")).toHaveLength(3); });
  it("creates and applies controlled per-tool templates", () => { const template = createDrawingTemplate("bold", "Bold trend", "trend-line", { lineWidth: 5 }); expect(applyDrawingTemplate(trendLineDrawing, template).defaultParameters.lineWidth).toBe(5); expect(() => applyDrawingTemplate(trendLineDrawing, { ...template, toolId: "ray" })).toThrow("does not apply"); });
});
