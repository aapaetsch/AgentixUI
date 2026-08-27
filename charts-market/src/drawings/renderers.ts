import type { DrawingPrimitive, DrawingRendererDefinition } from "../core";
import { clipLineToBounds, defaultDrawingHandles } from "./geometry";

function linePrimitive(id: string, points: Array<{ x: number; y: number } | null>, bounds: { width: number; height: number }, mode: "segment" | "ray" | "infinite" = "segment"): DrawingPrimitive[] {
  const first = points[0];
  const second = points[1];
  if (!first || !second) return [];
  const clipped = clipLineToBounds(first, second, bounds, mode);
  return clipped ? [{ id, kind: "line", from: clipped[0], to: clipped[1] }] : [];
}

const horizontalLineRenderer: DrawingRendererDefinition = {
  id: "horizontal-line",
  getPrimitives: ({ points, bounds }) => points[0] ? [{ id: "line", kind: "line", from: { x: 0, y: points[0].y }, to: { x: bounds.width, y: points[0].y } }] : [],
  getHandles: defaultDrawingHandles,
};

const verticalLineRenderer: DrawingRendererDefinition = {
  id: "vertical-line",
  getPrimitives: ({ points, bounds }) => points[0] ? [{ id: "line", kind: "line", from: { x: points[0].x, y: 0 }, to: { x: points[0].x, y: bounds.height } }] : [],
  getHandles: defaultDrawingHandles,
};

const trendLineRenderer: DrawingRendererDefinition = {
  id: "trend-line",
  getPrimitives: ({ points, bounds }) => linePrimitive("line", points, bounds),
  getHandles: defaultDrawingHandles,
};

const rayRenderer: DrawingRendererDefinition = {
  id: "ray",
  getPrimitives: ({ points, bounds }) => linePrimitive("ray", points, bounds, "ray"),
  getHandles: defaultDrawingHandles,
};

const extendedLineRenderer: DrawingRendererDefinition = {
  id: "extended-line",
  getPrimitives: ({ points, bounds }) => linePrimitive("extended-line", points, bounds, "infinite"),
  getHandles: defaultDrawingHandles,
};

const rectangleRenderer: DrawingRendererDefinition = {
  id: "rectangle",
  getPrimitives: ({ points }) => {
    const first = points[0]; const second = points[1];
    return first && second ? [{
      id: "rectangle", kind: "rect", x: Math.min(first.x, second.x), y: Math.min(first.y, second.y),
      width: Math.abs(second.x - first.x), height: Math.abs(second.y - first.y), closed: true,
    }] : [];
  },
  getHandles: defaultDrawingHandles,
};

const ellipseRenderer: DrawingRendererDefinition = {
  id: "ellipse",
  getPrimitives: ({ points }) => {
    const first = points[0]; const second = points[1];
    return first && second ? [{
      id: "ellipse", kind: "ellipse", cx: (first.x + second.x) / 2, cy: (first.y + second.y) / 2,
      rx: Math.abs(second.x - first.x) / 2, ry: Math.abs(second.y - first.y) / 2, closed: true,
    }] : [];
  },
  getHandles: defaultDrawingHandles,
};

const fibonacciRetracementRenderer: DrawingRendererDefinition = {
  id: "fibonacci-retracement",
  getPrimitives: ({ points }) => {
    const first = points[0]; const second = points[1];
    if (!first || !second) return [];
    return [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1].flatMap<DrawingPrimitive>((level) => {
      const y = first.y + (second.y - first.y) * level;
      return [
        { id: `level-${level}`, kind: "line", from: { x: first.x, y }, to: { x: second.x, y } },
        { id: `label-${level}`, kind: "text", at: { x: second.x + 5, y: y - 3 }, text: String(level) },
      ];
    });
  },
  getHandles: defaultDrawingHandles,
};

export const builtInDrawingRenderers: DrawingRendererDefinition[] = [
  horizontalLineRenderer,
  verticalLineRenderer,
  trendLineRenderer,
  rayRenderer,
  extendedLineRenderer,
  rectangleRenderer,
  ellipseRenderer,
  fibonacciRetracementRenderer,
];
