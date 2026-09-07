import { describe, expect, it } from "vitest";

import type { DrawingRendererContext, DrawingState } from "../core";
import {
  builtInDrawingRenderers,
  builtInDrawingTools,
  clipLineToBounds,
  distanceToSegment,
  hitTestDrawings,
  resolveInclusiveRange,
} from ".";

const bounds = { width: 100, height: 80 };
const toolCases: Array<[string, Array<{ x: number; y: number }>]> = [
  ["horizontal-line", [{ x: 25, y: 20 }]],
  ["vertical-line", [{ x: 25, y: 20 }]],
  ["trend-line", [{ x: 10, y: 10 }, { x: 70, y: 60 }]],
  ["ray", [{ x: 10, y: 10 }, { x: 70, y: 60 }]],
  ["extended-line", [{ x: 10, y: 10 }, { x: 70, y: 60 }]],
  ["rectangle", [{ x: 10, y: 10 }, { x: 70, y: 60 }]],
  ["ellipse", [{ x: 10, y: 10 }, { x: 70, y: 60 }]],
  ["fibonacci-retracement", [{ x: 10, y: 10 }, { x: 70, y: 60 }]],
];

function state(id: string, type: string): DrawingState {
  return { id, type, version: 1, points: [], parameters: { lineWidth: 1, fillOpacity: 0.12 }, visible: true, locked: false };
}

function context(drawing: DrawingState, points: Array<{ x: number; y: number }>): DrawingRendererContext {
  return { drawing, points, bounds, data: [], resolveRange: () => [], coordinateFor: () => null };
}

describe("drawing geometry registry", () => {
  it.each(toolCases)("renders and exposes handles for %s", (type, points) => {
    const renderer = builtInDrawingRenderers.find((item) => item.id === type)!;
    const rendererContext = context(state(type, type), points);
    expect(renderer.getPrimitives(rendererContext).length).toBeGreaterThan(0);
    expect(renderer.getHandles?.(rendererContext)).toHaveLength(points.length);
  });

  it("renders every built-in tool through the public registry", () => {
    const data = Array.from({ length: 10 }, (_, index) => ({ time: index + 1, open: 100 + index, high: 102 + index, low: 98 + index, close: 101 + index, volume: 100 + index }));
    for (const tool of builtInDrawingTools) {
      const pointCount = tool.input?.points ?? tool.input?.minimumPoints ?? tool.requiredPoints ?? 1;
      const drawing = { ...state(tool.id, tool.id), points: Array.from({ length: pointCount }, (_, index) => ({ time: index + 1, price: 100 + index * 3 })), parameters: { ...tool.defaultParameters } };
      const points = drawing.points.map((_, index) => ({ x: 10 + index * 25, y: 20 + index * 12 }));
      const renderer = builtInDrawingRenderers.find((item) => item.id === (tool.rendererId ?? tool.id));
      const rendererContext: DrawingRendererContext = { drawing, points, bounds, data, resolveRange: (first, second) => resolveInclusiveRange(data, first, second), coordinateFor: (point) => ({ x: Number(point.time) * 10, y: 120 - point.price }) };
      expect(renderer, tool.id).toBeDefined(); expect(renderer!.getPrimitives(rendererContext).length, tool.id).toBeGreaterThan(0);
    }
  });

  it("clips segments, rays, and infinite lines to chart bounds", () => {
    expect(clipLineToBounds({ x: -20, y: 40 }, { x: 120, y: 40 }, bounds)).toEqual([{ x: 0, y: 40 }, { x: 100, y: 40 }]);
    expect(clipLineToBounds({ x: 50, y: 40 }, { x: 60, y: 40 }, bounds, "ray")).toEqual([{ x: 50, y: 40 }, { x: 100, y: 40 }]);
    expect(clipLineToBounds({ x: 50, y: 40 }, { x: 60, y: 40 }, bounds, "infinite")).toEqual([{ x: 0, y: 40 }, { x: 100, y: 40 }]);
  });

  it("handles degenerate and fully off-screen lines", () => {
    expect(clipLineToBounds({ x: 1, y: 1 }, { x: 1, y: 1 }, bounds)).toBeNull();
    expect(clipLineToBounds({ x: -20, y: -20 }, { x: -10, y: -10 }, bounds)).toBeNull();
    expect(distanceToSegment({ x: 4, y: 5 }, { x: 1, y: 1 }, { x: 1, y: 1 })).toBe(5);
  });

  it("returns the deterministic topmost hit with minimum tolerance", () => {
    const bottom = state("bottom", "trend-line");
    const top = state("top", "trend-line");
    const contexts = new Map<string, DrawingRendererContext>([
      [bottom.id, context(bottom, [{ x: 0, y: 20 }, { x: 100, y: 20 }])],
      [top.id, context(top, [{ x: 0, y: 20 }, { x: 100, y: 20 }])],
    ]);
    expect(hitTestDrawings({ point: { x: 50, y: 25 }, drawings: [bottom, top], selectedDrawingIds: new Set(), tools: builtInDrawingTools, renderers: builtInDrawingRenderers, contexts })?.drawingId).toBe("top");
  });

  it("ignores hidden drawings and prioritizes selected handles", () => {
    const hidden = { ...state("hidden", "trend-line"), visible: false };
    const selected = state("selected", "trend-line");
    const contexts = new Map<string, DrawingRendererContext>([
      [hidden.id, context(hidden, [{ x: 10, y: 10 }, { x: 80, y: 70 }])],
      [selected.id, context(selected, [{ x: 10, y: 10 }, { x: 80, y: 70 }])],
    ]);
    const hit = hitTestDrawings({ point: { x: 11, y: 11 }, drawings: [selected, hidden], selectedDrawingIds: new Set([selected.id]), tools: builtInDrawingTools, renderers: builtInDrawingRenderers, contexts });
    expect(hit).toMatchObject({ drawingId: "selected", kind: "handle", pointIndex: 0 });
  });
});
