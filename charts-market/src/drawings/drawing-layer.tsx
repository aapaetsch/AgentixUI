"use client";

import * as React from "react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Tooltip, TooltipContent, TooltipTrigger, cn } from "aapaetsch-ui-kit";
import { CircleDashed, Eye, EyeOff, Hash, Lock, MousePointer2, Palette, Redo2, Slash, Square, Trash2, Undo2, Unlock } from "lucide-react";

import type { DrawingCoordinate, DrawingPoint, DrawingPrimitive, DrawingRendererContext, DrawingRendererDefinition, DrawingState, DrawingToolDefinition, MarketChartEngine, OhlcBar, SerializableParameters } from "../core";
import { marketTimeKey } from "../core";
import type { DrawingChangeMetadata } from ".";
import { hitTestDrawings, resolveDrawingRenderer } from "./geometry";
import { builtInDrawingRenderers } from "./renderers";
import { normalizeDrawingToolDefinition } from "./tool-definition";

export type DrawingSnapMode = "off" | "weak" | "strong";

export interface DrawingInteractionConfig {
  snapMode: DrawingSnapMode;
  snapDistance: number;
  keyboardPriceStep: number;
  keepDrawingMode: boolean;
  historyLimit: number;
  hitTolerance: number;
}

export const defaultDrawingInteraction: DrawingInteractionConfig = {
  snapMode: "weak", snapDistance: 10, keyboardPriceStep: 0.01, keepDrawingMode: false, historyLimit: 100, hitTolerance: 6,
};

export interface DrawingLayerProps extends Omit<React.SVGAttributes<SVGSVGElement>, "onChange"> {
  engine: MarketChartEngine;
  data?: OhlcBar[];
  drawings: DrawingState[];
  tools?: DrawingToolDefinition[];
  renderers?: DrawingRendererDefinition[];
  activeTool?: DrawingToolDefinition;
  selectedDrawingIds?: string[];
  interaction?: Partial<DrawingInteractionConfig>;
  interactionTargetRef?: React.RefObject<HTMLElement | null>;
  /** @deprecated Use interaction.snapMode. */
  snapToOhlc?: boolean;
  /** @deprecated Use interaction.snapDistance. */
  snapDistance?: number;
  onDrawingsChange: (drawings: DrawingState[], metadata?: DrawingChangeMetadata) => void;
  onSelectedDrawingIdsChange?: (drawingIds: string[]) => void;
  onActiveToolComplete?: () => void;
}

type SnapResult = { point: DrawingPoint; marker: DrawingCoordinate | null };
type DrawingGesture =
  | { kind: "create"; pointerId: number; drawing: DrawingState; changed: boolean }
  | { kind: "resize"; pointerId: number; drawing: DrawingState; pointIndex: number; changed: boolean }
  | { kind: "move"; pointerId: number; drawingIds: string[]; start: DrawingCoordinate; originals: Map<string, DrawingState>; drawings: DrawingState[]; changed: boolean };

function makeId(prefix = "drawing") {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function makeDrawing(tool: DrawingToolDefinition, points: DrawingPoint[]): DrawingState {
  return { id: makeId(), type: tool.id, version: tool.version, points, parameters: { ...tool.defaultParameters }, visible: true, locked: false };
}

function pointsAreEqual(first: DrawingPoint, second: DrawingPoint): boolean {
  return marketTimeKey(first.time) === marketTimeKey(second.time) && first.price === second.price;
}

function documentsAreEqual(first: readonly DrawingState[], second: readonly DrawingState[]) {
  return JSON.stringify(first) === JSON.stringify(second);
}

function dashArray(parameters: SerializableParameters): string | undefined {
  if (parameters.dashStyle === "dashed") return "7 5";
  if (parameters.dashStyle === "dotted") return "2 4";
  return undefined;
}

function renderPrimitive(primitive: DrawingPrimitive, hitArea = false) {
  const common = hitArea ? { fill: "none", stroke: "transparent", strokeWidth: 12 } : {};
  if (primitive.kind === "line") return <line key={primitive.id} x1={primitive.from.x} y1={primitive.from.y} x2={primitive.to.x} y2={primitive.to.y} {...common} />;
  if (primitive.kind === "rect") return <rect key={primitive.id} x={primitive.x} y={primitive.y} width={primitive.width} height={primitive.height} {...common} />;
  if (primitive.kind === "ellipse") return <ellipse key={primitive.id} cx={primitive.cx} cy={primitive.cy} rx={primitive.rx} ry={primitive.ry} {...common} />;
  if (primitive.kind === "polyline") return <polyline key={primitive.id} points={primitive.points.map((point) => `${point.x},${point.y}`).join(" ")} {...common} />;
  if (hitArea) return null;
  return <text key={primitive.id} x={primitive.at.x} y={primitive.at.y} textAnchor={primitive.anchor} fill="currentColor" stroke="none" fontSize="10">{primitive.text}</text>;
}

export function DrawingLayer({ engine, data = [], drawings, tools = [], renderers = builtInDrawingRenderers, activeTool, selectedDrawingIds, interaction, interactionTargetRef, snapToOhlc, snapDistance, onDrawingsChange, onSelectedDrawingIdsChange, onActiveToolComplete, className, ...props }: DrawingLayerProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const gestureRef = React.useRef<DrawingGesture | null>(null);
  const [draftDrawings, setDraftDrawings] = React.useState<DrawingState[] | null>(null);
  const [bounds, setBounds] = React.useState({ width: 1, height: 1 });
  const [hoveredDrawingId, setHoveredDrawingId] = React.useState<string | null>(null);
  const [focusedDrawingId, setFocusedDrawingId] = React.useState<string | null>(null);
  const [snapMarker, setSnapMarker] = React.useState<DrawingCoordinate | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const legacySelectedIds = React.useMemo(() => drawings.filter((drawing) => drawing.selected).map((drawing) => drawing.id), [drawings]);
  const effectiveSelectedIds = selectedDrawingIds ?? legacySelectedIds;
  const selectedSet = React.useMemo(() => new Set(effectiveSelectedIds), [effectiveSelectedIds]);
  const normalizedTools = React.useMemo(() => tools.map(normalizeDrawingToolDefinition), [tools]);
  const normalizedActiveTool = React.useMemo(() => activeTool ? normalizeDrawingToolDefinition(activeTool) : undefined, [activeTool]);
  const settings = React.useMemo<DrawingInteractionConfig>(() => ({
    ...defaultDrawingInteraction,
    ...interaction,
    snapMode: snapToOhlc === false ? "off" : interaction?.snapMode ?? defaultDrawingInteraction.snapMode,
    snapDistance: snapDistance ?? interaction?.snapDistance ?? defaultDrawingInteraction.snapDistance,
  }), [interaction, snapDistance, snapToOhlc]);
  const displayedDrawings = draftDrawings ?? drawings;
  const barsByTime = React.useMemo(() => new Map(data.map((bar) => [marketTimeKey(bar.time), bar])), [data]);

  React.useLayoutEffect(() => {
    const element = svgRef.current; if (!element) return;
    const update = () => { const rect = element.getBoundingClientRect(); setBounds({ width: Math.max(1, rect.width), height: Math.max(1, rect.height) }); };
    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update); observer.observe(element); return () => observer.disconnect();
  }, []);

  const contexts = React.useMemo(() => new Map(displayedDrawings.map((drawing) => [drawing.id, {
    drawing, points: drawing.points.map((point) => engine.coordinateFor(point)), bounds,
  } satisfies DrawingRendererContext])), [bounds, displayedDrawings, engine]);

  const emitSelection = React.useCallback((ids: string[]) => {
    const unique = Array.from(new Set(ids)).filter((id) => displayedDrawings.some((drawing) => drawing.id === id && drawing.visible));
    if (unique.length === effectiveSelectedIds.length && unique.every((id) => selectedSet.has(id))) return;
    if (onSelectedDrawingIdsChange) onSelectedDrawingIdsChange(unique);
    else onDrawingsChange(drawings.map((drawing) => ({ ...drawing, selected: unique.includes(drawing.id) || undefined })), { type: "selection", drawingIds: unique });
    setFocusedDrawingId(unique.at(-1) ?? null);
    setAnnouncement(unique.length ? `${unique.length} drawing${unique.length === 1 ? "" : "s"} selected` : "Selection cleared");
  }, [displayedDrawings, drawings, effectiveSelectedIds.length, onDrawingsChange, onSelectedDrawingIdsChange, selectedSet]);

  const pointForEvent = React.useCallback((event: PointerEvent | KeyboardEvent, coordinate?: DrawingCoordinate): SnapResult | null => {
    const element = svgRef.current; if (!element) return null;
    const rect = element.getBoundingClientRect();
    const local = coordinate ?? ("clientX" in event ? { x: event.clientX - rect.left, y: event.clientY - rect.top } : { x: bounds.width / 2, y: bounds.height / 2 });
    const point = engine.pointForCoordinate(local);
    if (!point || settings.snapMode === "off" || event.altKey) return point ? { point, marker: null } : null;
    const bar = barsByTime.get(marketTimeKey(point.time)); if (!bar) return { point, marker: null };
    const nearest = [bar.open, bar.high, bar.low, bar.close]
      .map((price) => ({ price, coordinate: engine.coordinateFor({ time: bar.time, price }) }))
      .filter((candidate): candidate is { price: number; coordinate: DrawingCoordinate } => candidate.coordinate != null)
      .map((candidate) => ({ ...candidate, distance: Math.hypot(candidate.coordinate.x - local.x, candidate.coordinate.y - local.y) }))
      .sort((left, right) => left.distance - right.distance)[0];
    if (!nearest || (settings.snapMode === "weak" && nearest.distance > settings.snapDistance)) return { point, marker: null };
    return { point: { time: bar.time, price: nearest.price }, marker: nearest.coordinate };
  }, [barsByTime, bounds.height, bounds.width, engine, settings.snapDistance, settings.snapMode]);

  const cancelGesture = React.useCallback((announce = true) => {
    gestureRef.current = null; setDraftDrawings(null); setSnapMarker(null); if (announce) setAnnouncement("Drawing edit cancelled");
  }, []);
  React.useEffect(() => { if (gestureRef.current?.kind === "create" && gestureRef.current.drawing.type !== normalizedActiveTool?.id) cancelGesture(false); }, [cancelGesture, normalizedActiveTool?.id]);
  React.useEffect(() => () => { gestureRef.current = null; }, []);

  const updateGesture = React.useCallback((event: PointerEvent): DrawingState[] | null => {
    const gesture = gestureRef.current; if (!gesture || gesture.pointerId !== event.pointerId) return null;
    const element = svgRef.current; if (!element) return null;
    const rect = element.getBoundingClientRect(); const coordinate = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (gesture.kind === "create" || gesture.kind === "resize") {
      const result = pointForEvent(event, coordinate); if (!result) return null; setSnapMarker(result.marker);
      if (gesture.kind === "create") {
        const pointIndex = gesture.drawing.points.length > 1 ? gesture.drawing.points.length - 1 : 0;
        const drawing = { ...gesture.drawing, points: gesture.drawing.points.map((point, index) => index === pointIndex ? result.point : point) };
        const next = drawings.concat(drawing);
        gestureRef.current = { ...gesture, drawing, changed: !pointsAreEqual(drawing.points[0], drawing.points.at(-1)!) || drawing.points.length === 1 };
        setDraftDrawings(next); return next;
      }
      const drawing = { ...gesture.drawing, points: gesture.drawing.points.map((point, index) => index === gesture.pointIndex ? result.point : point) };
      const next = drawings.map((item) => item.id === drawing.id ? drawing : item);
      gestureRef.current = { ...gesture, drawing, changed: !documentsAreEqual(drawings, next) }; setDraftDrawings(next); return next;
    }
    const dx = coordinate.x - gesture.start.x; const dy = coordinate.y - gesture.start.y;
    const next = drawings.map((drawing) => {
      const original = gesture.originals.get(drawing.id); if (!original) return drawing;
      return { ...drawing, points: original.points.map((point) => { const origin = engine.coordinateFor(point); return origin ? engine.pointForCoordinate({ x: origin.x + dx, y: origin.y + dy }) ?? point : point; }) };
    });
    gestureRef.current = { ...gesture, drawings: next, changed: !documentsAreEqual(drawings, next) }; setDraftDrawings(next); return next;
  }, [drawings, engine, pointForEvent]);

  React.useEffect(() => {
    const svg = svgRef.current; const target = interactionTargetRef?.current ?? svg; if (!svg || !target) return;
    const previousCursor = target.style.cursor;
    if (gestureRef.current && gestureRef.current.kind !== "create") target.style.cursor = "grabbing";
    else if (normalizedActiveTool) target.style.cursor = "crosshair";
    const localCoordinate = (event: PointerEvent): DrawingCoordinate => { const rect = svg.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; };
    const hitAt = (point: DrawingCoordinate) => hitTestDrawings({ point, drawings: displayedDrawings, selectedDrawingIds: selectedSet, tools: normalizedTools, renderers, contexts, minimumTolerance: settings.hitTolerance });
    const finishTool = () => { if (!settings.keepDrawingMode) onActiveToolComplete?.(); };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || event.isPrimary === false) return;
      const coordinate = localCoordinate(event);
      if (normalizedActiveTool) {
        const result = pointForEvent(event, coordinate); if (!result) return;
        event.preventDefault(); event.stopPropagation(); target.focus({ preventScroll: true });
        const pointCount = normalizedActiveTool.input.points; const points = pointCount === 1 ? [result.point] : Array.from({ length: pointCount }, () => result.point);
        const drawing = makeDrawing(normalizedActiveTool, points);
        gestureRef.current = { kind: "create", pointerId: event.pointerId, drawing, changed: pointCount === 1 };
        setDraftDrawings([...drawings, drawing]); setSnapMarker(result.marker); target.style.cursor = "crosshair"; target.setPointerCapture?.(event.pointerId); return;
      }
      const hit = hitAt(coordinate);
      if (!hit) { emitSelection([]); setHoveredDrawingId(null); return; }
      const drawing = drawings.find((item) => item.id === hit.drawingId); if (!drawing) return;
      event.preventDefault(); event.stopPropagation(); target.focus({ preventScroll: true });
      const modified = event.ctrlKey || event.metaKey || event.shiftKey; let nextSelection = effectiveSelectedIds;
      if (modified) nextSelection = selectedSet.has(drawing.id) ? effectiveSelectedIds.filter((id) => id !== drawing.id) : [...effectiveSelectedIds, drawing.id];
      else if (!selectedSet.has(drawing.id)) nextSelection = [drawing.id];
      emitSelection(nextSelection);
      if (modified && selectedSet.has(drawing.id)) return;
      if (drawing.locked) { target.style.cursor = "pointer"; setAnnouncement(`${drawing.type} selected and locked`); return; }
      if (hit.kind === "handle" && hit.pointIndex != null) gestureRef.current = { kind: "resize", pointerId: event.pointerId, drawing: { ...drawing, points: drawing.points.slice() }, pointIndex: hit.pointIndex, changed: false };
      else {
        const ids = (nextSelection.includes(drawing.id) ? nextSelection : [drawing.id]).filter((id) => !drawings.find((item) => item.id === id)?.locked);
        gestureRef.current = { kind: "move", pointerId: event.pointerId, drawingIds: ids, start: coordinate, originals: new Map(drawings.filter((item) => ids.includes(item.id)).map((item) => [item.id, { ...item, points: item.points.slice() }])), drawings, changed: false };
      }
      target.style.cursor = "grabbing"; target.setPointerCapture?.(event.pointerId);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (!gestureRef.current) {
        const hit = hitAt(localCoordinate(event)); setHoveredDrawingId(hit?.drawingId ?? null);
        const drawing = hit ? drawings.find((item) => item.id === hit.drawingId) : undefined;
        target.style.cursor = normalizedActiveTool ? "crosshair" : !hit ? previousCursor : drawing?.locked ? "pointer" : hit.kind === "handle" ? "grab" : "move";
        return;
      }
      if (gestureRef.current.pointerId !== event.pointerId) return; event.preventDefault(); event.stopPropagation(); updateGesture(event);
    };
    const handlePointerUp = (event: PointerEvent) => {
      const gesture = gestureRef.current; if (!gesture || gesture.pointerId !== event.pointerId) return;
      event.preventDefault(); event.stopPropagation(); const next = updateGesture(event) ?? draftDrawings; const current = gestureRef.current;
      gestureRef.current = null; setDraftDrawings(null); setSnapMarker(null); target.style.cursor = normalizedActiveTool ? "crosshair" : previousCursor; target.releasePointerCapture?.(event.pointerId);
      if (!current || !next || !current.changed) return;
      if (current.kind === "create") {
        if (current.drawing.points.length > 1 && pointsAreEqual(current.drawing.points[0], current.drawing.points.at(-1)!) && !normalizedActiveTool?.input.allowDegenerate) return;
        onDrawingsChange(next, { type: "create", drawingIds: [current.drawing.id], transactionId: `create-${current.drawing.id}` }); emitSelection([current.drawing.id]); setAnnouncement(`${current.drawing.type} created`); finishTool();
      } else {
        const ids = current.kind === "resize" ? [current.drawing.id] : current.drawingIds;
        onDrawingsChange(next, { type: current.kind, drawingIds: ids, transactionId: `${current.kind}-${event.pointerId}` }); setAnnouncement(`${ids.length} drawing${ids.length === 1 ? "" : "s"} ${current.kind === "move" ? "moved" : "resized"}`);
      }
    };
    const handlePointerCancel = (event: PointerEvent) => { if (gestureRef.current?.pointerId !== event.pointerId) return; event.preventDefault(); event.stopPropagation(); target.style.cursor = normalizedActiveTool ? "crosshair" : previousCursor; cancelGesture(); };
    const handleLostPointerCapture = (event: PointerEvent) => { if (gestureRef.current?.pointerId === event.pointerId) { target.style.cursor = normalizedActiveTool ? "crosshair" : previousCursor; cancelGesture(); } };
    const shiftTime = (point: DrawingPoint, amount: number): DrawingPoint => {
      const index = data.findIndex((bar) => marketTimeKey(bar.time) === marketTimeKey(point.time));
      if (index >= 0 && data.length) return { ...point, time: data[Math.max(0, Math.min(data.length - 1, index + amount))].time };
      return typeof point.time === "number" ? { ...point, time: point.time + amount } : point;
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      const visible = drawings.filter((drawing) => drawing.visible);
      if (event.key === "Escape") { if (gestureRef.current) cancelGesture(); else emitSelection([]); onActiveToolComplete?.(); return; }
      if (event.key === "Tab" && visible.length) {
        event.preventDefault(); const currentIndex = visible.findIndex((drawing) => drawing.id === focusedDrawingId || selectedSet.has(drawing.id)); const nextIndex = (currentIndex + (event.shiftKey ? -1 : 1) + visible.length) % visible.length;
        emitSelection([visible[nextIndex].id]); setFocusedDrawingId(visible[nextIndex].id); return;
      }
      if ((event.key === "Enter" || event.key === " ") && normalizedActiveTool) {
        event.preventDefault(); const center = pointForEvent(event, { x: bounds.width / 2, y: bounds.height / 2 }); if (!center) return;
        const pointCount = normalizedActiveTool.input.points; const points = pointCount === 1 ? [center.point] : Array.from({ length: pointCount }, (_, index) => index === 0 ? center.point : engine.pointForCoordinate({ x: bounds.width / 2 + 40 * index, y: bounds.height / 2 - 40 * index }) ?? center.point);
        const drawing = makeDrawing(normalizedActiveTool, points); onDrawingsChange([...drawings, drawing], { type: "create", drawingIds: [drawing.id], transactionId: `keyboard-create-${drawing.id}` }); emitSelection([drawing.id]); setAnnouncement(`${drawing.type} created with keyboard`); finishTool(); return;
      }
      if ((event.key === "Delete" || event.key === "Backspace") && effectiveSelectedIds.length) {
        event.preventDefault(); onDrawingsChange(drawings.filter((drawing) => !selectedSet.has(drawing.id)), { type: "delete", drawingIds: effectiveSelectedIds }); emitSelection([]); setAnnouncement(`${effectiveSelectedIds.length} drawing${effectiveSelectedIds.length === 1 ? "" : "s"} deleted`); return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d" && effectiveSelectedIds.length) {
        event.preventDefault(); const duplicates = drawings.filter((drawing) => selectedSet.has(drawing.id)).map((drawing) => ({ ...drawing, id: makeId("duplicate"), points: drawing.points.map((point) => ({ ...shiftTime(point, 1), price: point.price + settings.keyboardPriceStep })) }));
        onDrawingsChange([...drawings, ...duplicates], { type: "duplicate", drawingIds: duplicates.map((drawing) => drawing.id) }); emitSelection(duplicates.map((drawing) => drawing.id)); setAnnouncement(`${duplicates.length} drawing${duplicates.length === 1 ? "" : "s"} duplicated`); return;
      }
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) || !effectiveSelectedIds.length) return;
      event.preventDefault(); const multiplier = event.shiftKey ? 10 : 1; const timeDelta = event.key === "ArrowLeft" ? -multiplier : event.key === "ArrowRight" ? multiplier : 0; const priceDelta = event.key === "ArrowUp" ? settings.keyboardPriceStep * multiplier : event.key === "ArrowDown" ? -settings.keyboardPriceStep * multiplier : 0;
      const movableIds = effectiveSelectedIds.filter((id) => !drawings.find((drawing) => drawing.id === id)?.locked); if (!movableIds.length) return;
      const next = drawings.map((drawing) => movableIds.includes(drawing.id) ? { ...drawing, points: drawing.points.map((point) => ({ ...shiftTime(point, timeDelta), price: point.price + priceDelta })) } : drawing);
      onDrawingsChange(next, { type: "move", drawingIds: movableIds, transactionId: `keyboard-${event.key}-${Date.now()}` }); setAnnouncement(`${movableIds.length} drawing${movableIds.length === 1 ? "" : "s"} nudged`);
    };
    const pointerDownListener = handlePointerDown as EventListener; const pointerMoveListener = handlePointerMove as EventListener; const pointerUpListener = handlePointerUp as EventListener; const pointerCancelListener = handlePointerCancel as EventListener; const lostCaptureListener = handleLostPointerCapture as EventListener; const keyDownListener = handleKeyDown as EventListener;
    target.addEventListener("pointerdown", pointerDownListener, true); target.addEventListener("pointermove", pointerMoveListener, true); target.addEventListener("pointerup", pointerUpListener, true); target.addEventListener("pointercancel", pointerCancelListener, true); target.addEventListener("lostpointercapture", lostCaptureListener, true); target.addEventListener("keydown", keyDownListener);
    return () => { target.style.cursor = previousCursor; target.removeEventListener("pointerdown", pointerDownListener, true); target.removeEventListener("pointermove", pointerMoveListener, true); target.removeEventListener("pointerup", pointerUpListener, true); target.removeEventListener("pointercancel", pointerCancelListener, true); target.removeEventListener("lostpointercapture", lostCaptureListener, true); target.removeEventListener("keydown", keyDownListener); };
  }, [bounds.height, bounds.width, cancelGesture, contexts, data, displayedDrawings, draftDrawings, drawings, effectiveSelectedIds, emitSelection, engine, focusedDrawingId, interactionTargetRef, normalizedActiveTool, normalizedTools, onActiveToolComplete, onDrawingsChange, pointForEvent, renderers, selectedSet, settings.hitTolerance, settings.keepDrawingMode, settings.keyboardPriceStep, updateGesture]);

  return <>
    <svg ref={svgRef} role="application" aria-roledescription="interactive drawing layer" aria-label={props["aria-label"] ?? "Chart drawings"} aria-activedescendant={focusedDrawingId ? `drawing-${focusedDrawingId}` : undefined} className={cn("pointer-events-none absolute inset-0 size-full overflow-visible outline-none", className)} tabIndex={interactionTargetRef ? undefined : 0} {...props}>
      {displayedDrawings.filter((drawing) => drawing.visible).map((drawing) => {
        const renderer = resolveDrawingRenderer(drawing, normalizedTools, renderers); const context = contexts.get(drawing.id); if (!renderer || !context) return null;
        const primitives = renderer.getPrimitives(context); const color = typeof drawing.parameters.color === "string" ? drawing.parameters.color : "hsl(var(--primary))"; const lineWidth = typeof drawing.parameters.lineWidth === "number" ? drawing.parameters.lineWidth : 1;
        const selected = selectedSet.has(drawing.id); const emphasized = selected || hoveredDrawingId === drawing.id; const focused = focusedDrawingId === drawing.id; const isShape = primitives.some((primitive) => primitive.kind === "rect" || primitive.kind === "ellipse" || primitive.kind === "polyline" && primitive.closed); const handles = selected && !drawing.locked ? renderer.getHandles?.(context) ?? [] : [];
        return <g id={`drawing-${drawing.id}`} key={drawing.id} data-drawing-id={drawing.id} aria-label={`${drawing.type}${drawing.locked ? ", locked" : ""}${selected ? ", selected" : ""}`} fill={isShape ? color : "none"} fillOpacity={isShape ? Number(drawing.parameters.fillOpacity ?? 0.12) : 0} stroke={color} strokeWidth={lineWidth + (emphasized ? 1 : 0)} strokeDasharray={draftDrawings && !drawings.includes(drawing) ? "6 4" : dashArray(drawing.parameters)} color={color}>
          {focused ? <g stroke="hsl(var(--ring))" strokeWidth={lineWidth + 5} opacity={0.35}>{primitives.map((primitive) => renderPrimitive(primitive))}</g> : null}
          <g data-hit-area="true" aria-hidden="true">{primitives.map((primitive) => renderPrimitive(primitive, true))}</g>{primitives.map((primitive) => renderPrimitive(primitive))}
          {handles.map((handle) => <g key={handle.id} data-drawing-handle={handle.id}><circle cx={handle.position.x} cy={handle.position.y} r={14} fill="transparent" stroke="none" /><circle cx={handle.position.x} cy={handle.position.y} r={6} fill="hsl(var(--background))" stroke={color} strokeWidth={2} /></g>)}
        </g>;
      })}
      {snapMarker ? <g data-snap-marker="true" pointerEvents="none" fill="none" stroke="hsl(var(--primary))" strokeWidth={1.5}><circle cx={snapMarker.x} cy={snapMarker.y} r={7} /><line x1={snapMarker.x - 11} x2={snapMarker.x + 11} y1={snapMarker.y} y2={snapMarker.y} /><line x1={snapMarker.x} x2={snapMarker.x} y1={snapMarker.y - 11} y2={snapMarker.y + 11} /></g> : null}
    </svg>
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
  </>;
}

export interface DrawingToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  tools: DrawingToolDefinition[];
  activeToolId?: string;
  selectedDrawing?: DrawingState;
  selectedDrawings?: DrawingState[];
  canUndo?: boolean;
  canRedo?: boolean;
  onActiveToolChange?: (toolId: string | undefined) => void;
  /** @deprecated Use onStyleCommit. */
  onUpdateSelected?: (changes: Record<string, string | number>) => void;
  onStylePreview?: (changes: Record<string, string | number>) => void;
  onStyleCommit?: (changes: Record<string, string | number>) => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
  onToggleLock?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

function ToolIcon({ id }: { id: string }) {
  if (id === "rectangle") return <Square />; if (id === "ellipse") return <CircleDashed />; if (id === "fibonacci-retracement") return <Hash />;
  return <Slash className={cn(id === "horizontal-line" && "rotate-45", id === "vertical-line" && "-rotate-45")} />;
}

function IconAction({ label, shortcut, children, ...props }: React.ComponentProps<typeof Button> & { label: string; shortcut?: string }) {
  return <Tooltip><TooltipTrigger asChild><Button type="button" size="sm" iconOnly colorStyle="ghost" aria-label={label} {...props}>{children}</Button></TooltipTrigger><TooltipContent size="xs">{label}{shortcut ? ` · ${shortcut}` : ""}</TooltipContent></Tooltip>;
}

export function DrawingToolbar({ tools, activeToolId, selectedDrawing, selectedDrawings, canUndo, canRedo, onActiveToolChange, onUpdateSelected, onStylePreview, onStyleCommit, onDelete, onToggleVisibility, onToggleLock, onUndo, onRedo, className, ...props }: DrawingToolbarProps) {
  const selections = selectedDrawings ?? (selectedDrawing ? [selectedDrawing] : []); const primary = selections[0]; const [styleDraft, setStyleDraft] = React.useState<Record<string, string | number>>({}); const committedStyle = React.useRef<Record<string, string | number>>({});
  React.useEffect(() => {
    const next: Record<string, string | number> = primary ? { color: typeof primary.parameters.color === "string" && primary.parameters.color.startsWith("#") ? primary.parameters.color : "#64748b", lineWidth: typeof primary.parameters.lineWidth === "number" ? primary.parameters.lineWidth : 1, dashStyle: typeof primary.parameters.dashStyle === "string" ? primary.parameters.dashStyle : "solid", fillOpacity: typeof primary.parameters.fillOpacity === "number" ? primary.parameters.fillOpacity : 0.12 } : {};
    committedStyle.current = next; setStyleDraft(next);
  }, [primary?.id, primary?.parameters]);
  const preview = (changes: Record<string, string | number>) => { const next = { ...styleDraft, ...changes }; setStyleDraft(next); onStylePreview?.(next); };
  const commitStyle = (changes: Record<string, string | number>) => { const next = { ...styleDraft, ...changes }; if (JSON.stringify(next) === JSON.stringify(committedStyle.current)) return; committedStyle.current = next; setStyleDraft(next); (onStyleCommit ?? onUpdateSelected)?.(next); };
  const groupedTools = tools.reduce<Record<string, DrawingToolDefinition[]>>((groups, tool) => { const category = normalizeDrawingToolDefinition(tool).category; groups[category] = [...(groups[category] ?? []), tool]; return groups; }, {});
  const activeTool = tools.find((tool) => tool.id === activeToolId); const allHidden = selections.length > 0 && selections.every((drawing) => !drawing.visible); const allLocked = selections.length > 0 && selections.every((drawing) => drawing.locked);
  return <div className={cn("flex min-h-11 flex-wrap items-center gap-1 border-b border-border bg-background px-2 py-1.5", className)} {...props}>
    <IconAction label="Pointer" shortcut="Esc" aria-pressed={!activeToolId} colorStyle={!activeToolId ? "tonal" : "ghost"} onClick={() => onActiveToolChange?.(undefined)}><MousePointer2 /></IconAction>
    <DropdownMenu><Tooltip><TooltipTrigger asChild><DropdownMenuTrigger asChild><Button type="button" size="sm" colorStyle={activeToolId ? "tonal" : "ghost"} aria-label={activeTool ? `Active drawing tool: ${activeTool.label}` : "Choose drawing tool"}>{activeTool ? <ToolIcon id={activeTool.id} /> : <Slash />}<span className="hidden sm:inline">{activeTool?.label ?? "Draw"}</span></Button></DropdownMenuTrigger></TooltipTrigger><TooltipContent size="xs">Drawing tools · press and drag</TooltipContent></Tooltip>
      <DropdownMenuContent align="start">{Object.entries(groupedTools).map(([category, categoryTools], categoryIndex) => <React.Fragment key={category}>{categoryIndex ? <DropdownMenuSeparator /> : null}<DropdownMenuLabel>{category}</DropdownMenuLabel>{categoryTools.map((tool) => <DropdownMenuItem key={tool.id} icon={<ToolIcon id={tool.id} />} onSelect={() => onActiveToolChange?.(tool.id)}>{tool.label}</DropdownMenuItem>)}</React.Fragment>)}</DropdownMenuContent>
    </DropdownMenu>
    <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" /><IconAction label="Undo" shortcut="Ctrl/Cmd+Z" disabled={!canUndo} onClick={onUndo}><Undo2 /></IconAction><IconAction label="Redo" shortcut="Ctrl/Cmd+Shift+Z" disabled={!canRedo} onClick={onRedo}><Redo2 /></IconAction>
    {activeToolId ? <span className="ml-1 hidden text-[0.6875rem] text-muted-foreground lg:inline">Drag to draw · Alt bypasses magnet · Esc cancels</span> : null}
    {primary ? <div className="ml-auto flex flex-wrap items-center gap-1" aria-label={`Style ${selections.length} selected drawing${selections.length === 1 ? "" : "s"}`}><Palette className="mx-1 size-3.5 text-muted-foreground" aria-hidden="true" />
      <input aria-label="Drawing color" type="color" className="size-8 cursor-pointer rounded-[var(--radius-sm)] border border-border bg-background p-1" value={String(styleDraft.color ?? "#64748b")} onInput={(event) => preview({ color: event.currentTarget.value })} onChange={(event) => commitStyle({ color: event.currentTarget.value })} />
      <select aria-label="Drawing line width" className="h-8 rounded-[var(--radius-sm)] border border-border bg-background px-2 text-xs" value={Number(styleDraft.lineWidth ?? 1)} onChange={(event) => { const changes = { lineWidth: Number(event.target.value) }; preview(changes); commitStyle(changes); }}><option value={1}>1 px</option><option value={2}>2 px</option><option value={3}>3 px</option><option value={5}>5 px</option></select>
      <select aria-label="Drawing dash style" className="h-8 rounded-[var(--radius-sm)] border border-border bg-background px-2 text-xs" value={String(styleDraft.dashStyle ?? "solid")} onChange={(event) => { const changes = { dashStyle: event.target.value }; preview(changes); commitStyle(changes); }}><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option></select>
      {(primary.type === "rectangle" || primary.type === "ellipse") ? <label className="flex h-8 items-center gap-1 px-1 text-[0.6875rem] text-muted-foreground">Fill<input aria-label="Drawing fill opacity" type="range" min={0} max={0.5} step={0.05} value={Number(styleDraft.fillOpacity ?? 0.12)} onInput={(event) => preview({ fillOpacity: Number(event.currentTarget.value) })} onPointerUp={(event) => commitStyle({ fillOpacity: Number(event.currentTarget.value) })} onKeyUp={(event) => commitStyle({ fillOpacity: Number(event.currentTarget.value) })} /></label> : null}
      <IconAction label={allHidden ? "Show selected" : "Hide selected"} onClick={onToggleVisibility}>{allHidden ? <Eye /> : <EyeOff />}</IconAction><IconAction label={allLocked ? "Unlock selected" : "Lock selected"} onClick={onToggleLock}>{allLocked ? <Unlock /> : <Lock />}</IconAction><IconAction label="Delete selected" shortcut="Delete" onClick={onDelete}><Trash2 /></IconAction>
    </div> : null}
  </div>;
}
