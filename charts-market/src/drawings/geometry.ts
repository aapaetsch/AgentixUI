import type {
  DrawingBounds,
  DrawingCoordinate,
  DrawingHitResult,
  DrawingPrimitive,
  DrawingRendererContext,
  DrawingRendererDefinition,
  DrawingState,
  DrawingToolDefinition,
} from "../core";

const EPSILON = 0.000_001;

export function distanceBetween(first: DrawingCoordinate, second: DrawingCoordinate): number {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

export function distanceToSegment(
  point: DrawingCoordinate,
  first: DrawingCoordinate,
  second: DrawingCoordinate,
): number {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared <= EPSILON) return distanceBetween(point, first);
  const t = Math.max(0, Math.min(1, ((point.x - first.x) * dx + (point.y - first.y) * dy) / lengthSquared));
  return distanceBetween(point, { x: first.x + t * dx, y: first.y + t * dy });
}

export function pointInRect(point: DrawingCoordinate, primitive: Extract<DrawingPrimitive, { kind: "rect" }>): boolean {
  return point.x >= primitive.x && point.x <= primitive.x + primitive.width
    && point.y >= primitive.y && point.y <= primitive.y + primitive.height;
}

export function distanceToEllipse(
  point: DrawingCoordinate,
  primitive: Extract<DrawingPrimitive, { kind: "ellipse" }>,
): number {
  if (primitive.rx <= EPSILON || primitive.ry <= EPSILON) {
    return distanceBetween(point, { x: primitive.cx, y: primitive.cy });
  }
  const normalized = Math.hypot((point.x - primitive.cx) / primitive.rx, (point.y - primitive.cy) / primitive.ry);
  return Math.abs(normalized - 1) * Math.min(primitive.rx, primitive.ry);
}

export function hitTestPrimitives(
  point: DrawingCoordinate,
  primitives: readonly DrawingPrimitive[],
  tolerance: number,
): number | null {
  let closest = Number.POSITIVE_INFINITY;
  for (const primitive of primitives) {
    if (primitive.kind === "text" || primitive.kind === "multiline-text") continue;
    if (primitive.kind === "line") {
      closest = Math.min(closest, distanceToSegment(point, primitive.from, primitive.to));
      continue;
    }
    if (primitive.kind === "rect") {
      if (primitive.closed && pointInRect(point, primitive)) return 0;
      const corners = [
        { x: primitive.x, y: primitive.y },
        { x: primitive.x + primitive.width, y: primitive.y },
        { x: primitive.x + primitive.width, y: primitive.y + primitive.height },
        { x: primitive.x, y: primitive.y + primitive.height },
      ];
      for (let index = 0; index < corners.length; index += 1) {
        closest = Math.min(closest, distanceToSegment(point, corners[index], corners[(index + 1) % corners.length]));
      }
      continue;
    }
    if (primitive.kind === "ellipse") {
      const normalized = primitive.rx > EPSILON && primitive.ry > EPSILON
        ? Math.hypot((point.x - primitive.cx) / primitive.rx, (point.y - primitive.cy) / primitive.ry)
        : Number.POSITIVE_INFINITY;
      if (primitive.closed && normalized <= 1) return 0;
      closest = Math.min(closest, distanceToEllipse(point, primitive));
      continue;
    }
    if (primitive.kind === "arrowhead") {
      closest = Math.min(closest, distanceBetween(point, primitive.at));
      continue;
    }
    const paths = primitive.kind === "band" ? [primitive.upper, primitive.lower] : [primitive.points];
    if ((primitive.kind === "polygon" || primitive.kind === "polyline") && primitive.closed && primitive.points.length >= 3 && pointInPolygon(point, primitive.points)) return 0;
    if (primitive.kind === "band" && primitive.upper.length > 1 && primitive.lower.length > 1 && pointInPolygon(point, [...primitive.upper, ...primitive.lower.slice().reverse()])) return 0;
    for (const path of paths) for (let index = 1; index < path.length; index += 1) {
      closest = Math.min(closest, distanceToSegment(point, path[index - 1], path[index]));
    }
    if ((primitive.kind === "polygon" || primitive.kind === "polyline") && primitive.closed && primitive.points.length > 2) {
      closest = Math.min(closest, distanceToSegment(point, primitive.points.at(-1)!, primitive.points[0]));
    }
  }
  return closest <= tolerance ? closest : null;
}

function pointInPolygon(point: DrawingCoordinate, polygon: DrawingCoordinate[]): boolean {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const a = polygon[index];
    const b = polygon[previous];
    if ((a.y > point.y) !== (b.y > point.y)
      && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

export function clipLineToBounds(
  first: DrawingCoordinate,
  second: DrawingCoordinate,
  bounds: DrawingBounds,
  mode: "segment" | "ray" | "infinite" = "segment",
): [DrawingCoordinate, DrawingCoordinate] | null {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  if (Math.abs(dx) <= EPSILON && Math.abs(dy) <= EPSILON) return null;
  let minimum = mode === "segment" ? 0 : mode === "ray" ? 0 : Number.NEGATIVE_INFINITY;
  let maximum = mode === "segment" ? 1 : Number.POSITIVE_INFINITY;
  const checks: Array<[number, number]> = [
    [-dx, first.x],
    [dx, bounds.width - first.x],
    [-dy, first.y],
    [dy, bounds.height - first.y],
  ];
  for (const [p, q] of checks) {
    if (Math.abs(p) <= EPSILON) {
      if (q < 0) return null;
      continue;
    }
    const ratio = q / p;
    if (p < 0) minimum = Math.max(minimum, ratio);
    else maximum = Math.min(maximum, ratio);
    if (minimum > maximum) return null;
  }
  return [
    { x: first.x + minimum * dx, y: first.y + minimum * dy },
    { x: first.x + maximum * dx, y: first.y + maximum * dy },
  ];
}

export function defaultDrawingHandles(context: DrawingRendererContext) {
  return context.points.flatMap((point, pointIndex) => point ? [{
    id: `point-${pointIndex}`,
    pointIndex,
    position: point,
    cursor: "grab",
    label: `Point ${pointIndex + 1}`,
  }] : []);
}

export function resolveDrawingRenderer(
  drawing: DrawingState,
  tools: readonly DrawingToolDefinition[],
  renderers: readonly DrawingRendererDefinition[],
): DrawingRendererDefinition | undefined {
  const rendererId = tools.find((tool) => tool.id === drawing.type)?.rendererId ?? drawing.type;
  return renderers.find((renderer) => renderer.id === rendererId);
}

export function hitTestDrawings({
  point,
  drawings,
  selectedDrawingIds,
  tools,
  renderers,
  contexts,
  minimumTolerance = 6,
}: {
  point: DrawingCoordinate;
  drawings: readonly DrawingState[];
  selectedDrawingIds: ReadonlySet<string>;
  tools: readonly DrawingToolDefinition[];
  renderers: readonly DrawingRendererDefinition[];
  contexts: ReadonlyMap<string, DrawingRendererContext>;
  minimumTolerance?: number;
}): DrawingHitResult | null {
  const ordered = drawings.map((drawing, index) => ({ drawing, index })).sort((left, right) => (left.drawing.zIndex ?? left.index) - (right.drawing.zIndex ?? right.index));
  for (let orderedIndex = ordered.length - 1; orderedIndex >= 0; orderedIndex -= 1) {
    const { drawing, index } = ordered[orderedIndex];
    if (!drawing.visible) continue;
    const renderer = resolveDrawingRenderer(drawing, tools, renderers);
    const context = contexts.get(drawing.id);
    if (!renderer || !context) continue;
    const lineWidth = typeof drawing.parameters.lineWidth === "number" ? drawing.parameters.lineWidth : 1;
    const tolerance = Math.max(minimumTolerance, lineWidth / 2 + 4);
    if (selectedDrawingIds.has(drawing.id) && !drawing.locked) {
      const handles = renderer.getHandles?.(context) ?? defaultDrawingHandles(context);
      for (let handleIndex = handles.length - 1; handleIndex >= 0; handleIndex -= 1) {
        const handle = handles[handleIndex];
        const distance = distanceBetween(point, handle.position);
        if (distance <= Math.max(tolerance, 8)) return {
          drawingId: drawing.id,
          rendererId: renderer.id,
          kind: "handle",
          handleId: handle.id,
          pointIndex: handle.pointIndex,
          distance,
          zIndex: index,
        };
      }
    }
    const customHit = renderer.hitTest?.(point, context, tolerance);
    const distance = customHit?.distance ?? hitTestPrimitives(point, renderer.getPrimitives(context), tolerance);
    if (distance != null) return {
      drawingId: drawing.id,
      rendererId: renderer.id,
      kind: customHit?.kind ?? "body",
      handleId: customHit?.handleId,
      pointIndex: customHit?.pointIndex,
      distance,
      zIndex: index,
    };
  }
  return null;
}
