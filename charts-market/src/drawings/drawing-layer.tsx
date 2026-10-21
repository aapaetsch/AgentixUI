"use client";
import { DropdownMenuContent, TooltipContent } from "../components/technical-chart-view/scoped-theme";

import * as React from "react";
import type { CalculationMode, SuppliedCalculationResults } from "../core";
import { createSuppliedDrawingRenderers } from "./supplied-renderers";
import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Tooltip, TooltipTrigger, cn } from "aapaetsch-ui-kit";
import {
  BellIcon as Bell,
  CircleDashedIcon as CircleDashed,
  EyeIcon as Eye,
  EyeOffIcon as EyeOff,
  HashIcon as Hash,
  LockIcon as Lock,
  CursorIcon as MousePointer2,
  PaletteIcon as Palette,
  RedoIcon as Redo2,
  KeepDrawingIcon as Repeat2,
  SearchIcon as Search,
  SlashIcon as Slash,
  SquareIcon as Square,
  StarIcon as Star,
  TrashIcon as Trash2,
  UndoIcon as Undo2,
  UnlockIcon as Unlock,
} from "aapaetsch-icons";

import type { DrawingCoordinate, DrawingPoint, DrawingPrimitive, DrawingRendererContext, DrawingRendererDefinition, DrawingState, DrawingToolDefinition, MarketChartEngine, OhlcBar } from "../core";
import { marketTimeKey, crossesMarketTimeGap, type MarketTimeGap } from "../core";
import { resolveInclusiveRange, simplifyCoordinates } from "./calculations";
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
  cancelRevision?:number;
  calculationMode?: CalculationMode;
  suppliedResults?: SuppliedCalculationResults;
  suppliedEvidenceLabels?: boolean;
  engine: MarketChartEngine;
  data?: OhlcBar[];
  drawings: DrawingState[];
  discontinuities?: readonly MarketTimeGap[];
  coordinateRevision?: string | number;
  clipToPricePane?: boolean;
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
  | { kind: "quick-measure"; pointerId: number; drawing: DrawingState; changed: boolean }
  | { kind: "resize"; pointerId: number; drawing: DrawingState; pointIndex: number; changed: boolean }
  | { kind: "move"; pointerId: number; drawingIds: string[]; start: DrawingCoordinate; originals: Map<string, DrawingState>; drawings: DrawingState[]; changed: boolean };
type MultiClickDraft = { drawing: DrawingState; minimumPoints: number; maximumPoints?: number };

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

function dashArray(parameters: { dashStyle?: unknown }): string | undefined {
  if (parameters.dashStyle === "dashed") return "7 5";
  if (parameters.dashStyle === "dotted") return "2 4";
  return undefined;
}

function renderPrimitive(primitive: DrawingPrimitive, hitArea = false) {
  const common = hitArea ? { fill: "none", stroke: "transparent", strokeWidth: 12 } : { stroke: primitive.stroke, fill: primitive.fill, opacity: primitive.opacity, strokeWidth: primitive.lineWidth, strokeDasharray: dashArray(primitive) };
  if (primitive.kind === "line") return <line key={primitive.id} x1={primitive.from.x} y1={primitive.from.y} x2={primitive.to.x} y2={primitive.to.y} {...common} />;
  if (primitive.kind === "rect") return <rect key={primitive.id} x={primitive.x} y={primitive.y} width={primitive.width} height={primitive.height} {...common} />;
  if (primitive.kind === "ellipse") return <ellipse key={primitive.id} cx={primitive.cx} cy={primitive.cy} rx={primitive.rx} ry={primitive.ry} {...common} />;
  if (primitive.kind === "polyline") return <polyline key={primitive.id} points={primitive.points.map((point) => `${point.x},${point.y}`).join(" ")} {...common} />;
  if (primitive.kind === "polygon") return <polygon key={primitive.id} points={primitive.points.map((point) => `${point.x},${point.y}`).join(" ")} {...common} />;
  if (primitive.kind === "path") return <polyline key={primitive.id} points={primitive.points.map((point) => `${point.x},${point.y}`).join(" ")} {...common} fill="none" />;
  if (primitive.kind === "band") return <polygon key={primitive.id} points={[...primitive.upper, ...primitive.lower.slice().reverse()].map((point) => `${point.x},${point.y}`).join(" ")} {...common} />;
  if (primitive.kind === "arrowhead") {
    const angle = Math.atan2(primitive.at.y - primitive.from.y, primitive.at.x - primitive.from.x); const size = primitive.size ?? 9;
    const points = [primitive.at, { x: primitive.at.x - Math.cos(angle - 0.55) * size, y: primitive.at.y - Math.sin(angle - 0.55) * size }, { x: primitive.at.x - Math.cos(angle + 0.55) * size, y: primitive.at.y - Math.sin(angle + 0.55) * size }];
    return <polygon key={primitive.id} points={points.map((point) => `${point.x},${point.y}`).join(" ")} {...common} />;
  }
  if (hitArea) return null;
  if (primitive.kind === "text") return <text key={primitive.id} x={primitive.at.x} y={primitive.at.y} textAnchor={primitive.anchor} fill={primitive.stroke ?? "currentColor"} fillOpacity={1} stroke="none" fontSize="10">{primitive.text}</text>;
  const width = Math.max(...primitive.lines.map((line) => line.length), 1) * 6 + 10; const height = primitive.lines.length * 14 + 6; const offset = primitive.anchor === "middle" ? -width / 2 : primitive.anchor === "end" ? -width : 0;
  return <g key={primitive.id}>{primitive.background ? <rect x={primitive.at.x + offset} y={primitive.at.y - 12} width={width} height={height} rx={4} fill="hsl(var(--background))" fillOpacity={0.9} stroke="hsl(var(--border))" /> : null}<text x={primitive.at.x} y={primitive.at.y} textAnchor={primitive.anchor} fill="hsl(var(--foreground))" fillOpacity={1} stroke="none" fontSize="10">{primitive.lines.map((line, index) => <tspan key={index} x={primitive.at.x} dy={index === 0 ? 0 : 14}>{line}</tspan>)}</text></g>;
}

const noTimeGaps: readonly MarketTimeGap[] = [];

export function DrawingLayer({ cancelRevision, discontinuities = noTimeGaps, calculationMode = "internal", suppliedResults = {}, suppliedEvidenceLabels = true, coordinateRevision, clipToPricePane = false, engine, data = [], drawings, tools = [], renderers: requestedRenderers = builtInDrawingRenderers, activeTool, selectedDrawingIds, interaction, interactionTargetRef, snapToOhlc, snapDistance, onDrawingsChange, onSelectedDrawingIdsChange, onActiveToolComplete, className, ...props }: DrawingLayerProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const gestureRef = React.useRef<DrawingGesture | null>(null);
  const multiClickDraftRef = React.useRef<MultiClickDraft | null>(null);
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
  const renderers = React.useMemo(() => calculationMode === "internal" ? requestedRenderers : createSuppliedDrawingRenderers(
    [...tools.map(tool => tool.rendererId ?? tool.id), ...displayedDrawings.map(drawing => drawing.type)],
    Object.fromEntries(Object.entries(suppliedResults).filter(([id]) => {
      const original = drawings.find(d => d.id === id), draft = displayedDrawings.find(d => d.id === id);
      return original && draft && JSON.stringify([original.points, original.parameters]) === JSON.stringify([draft.points, draft.parameters]);
    })), suppliedEvidenceLabels,
  ), [calculationMode, requestedRenderers, tools, displayedDrawings, drawings, suppliedResults, suppliedEvidenceLabels]);
  const barsByTime = React.useMemo(() => new Map(data.map((bar) => [marketTimeKey(bar.time), bar])), [data]);

  React.useLayoutEffect(() => {
    const element = svgRef.current; if (!element) return;
    const update = () => { const rect = element.getBoundingClientRect(); setBounds({ width: Math.max(1, rect.width), height: Math.max(1, rect.height) }); };
    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update); observer.observe(element); return () => observer.disconnect();
  }, []);

  const contexts = React.useMemo(() => {
    void coordinateRevision;
    return new Map(displayedDrawings.map((drawing) => {
    const anchoredPoints = drawing.points.map((point) => { const bar = calculationMode === "internal" && point.anchor ? barsByTime.get(marketTimeKey(point.time)) : undefined; return bar && point.anchor ? { ...point, price: bar[point.anchor.field] } : point; });
    return [drawing.id, { visibleRange:engine.getSnapshot?.().visibleRange, drawing: { ...drawing, points: anchoredPoints }, points: anchoredPoints.map((point) => engine.coordinateFor(point)), bounds, data, resolveRange: (first: DrawingPoint, second: DrawingPoint) => resolveInclusiveRange(data, first, second), coordinateFor: (point: DrawingPoint) => engine.coordinateFor(point), isTimeSegmentContinuous: (a,b) => !crossesMarketTimeGap(a,b,discontinuities) } satisfies DrawingRendererContext];
  }));
  }, [barsByTime, bounds, data, displayedDrawings, engine, coordinateRevision, calculationMode, discontinuities]);

  const gapRange = discontinuities.length ? engine.getSnapshot().visibleRange : null;
  const gapBoundary = (time: DrawingPoint["time"]) => engine.coordinateForTime(time) ?? (gapRange ? marketTimeKey(time) <= marketTimeKey(gapRange.from) ? 0 : marketTimeKey(time) >= marketTimeKey(gapRange.to) ? bounds.width : null : null);
  const gapCoordinates = discontinuities.map(gap => [gapBoundary(gap.from), gapBoundary(gap.to)] as const).filter((gap): gap is readonly [number,number] => gap[0] != null && gap[1] != null);
  const isGapCoordinate = (x: number) => gapCoordinates.some(([from,to]) => x > from && x < to);
  const emitSelection = React.useCallback((ids: string[], candidates: readonly DrawingState[] = displayedDrawings) => {
    const unique = Array.from(new Set(ids)).filter((id) => candidates.some((drawing) => drawing.id === id && drawing.visible));
    if (unique.length === effectiveSelectedIds.length && unique.every((id) => selectedSet.has(id))) return;
    if (onSelectedDrawingIdsChange) onSelectedDrawingIdsChange(unique);
    else onDrawingsChange(candidates.map((drawing) => ({ ...drawing, selected: unique.includes(drawing.id) || undefined })), { type: "selection", drawingIds: unique });
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
    const nearest = (["open", "high", "low", "close"] as const)
      .map((field) => ({ field, price: bar[field], coordinate: engine.coordinateFor({ time: bar.time, price: bar[field] }) }))
      .filter((candidate): candidate is { field: "open" | "high" | "low" | "close"; price: number; coordinate: DrawingCoordinate } => candidate.coordinate != null)
      .map((candidate) => ({ ...candidate, distance: Math.hypot(candidate.coordinate.x - local.x, candidate.coordinate.y - local.y) }))
      .sort((left, right) => left.distance - right.distance)[0];
    if (!nearest || (settings.snapMode === "weak" && nearest.distance > settings.snapDistance)) return { point, marker: null };
    return { point: { time: bar.time, price: nearest.price, anchor: { field: nearest.field } }, marker: nearest.coordinate };
  }, [barsByTime, bounds.height, bounds.width, engine, settings.snapDistance, settings.snapMode]);

  const cancelGesture = React.useCallback((announce = true) => {
    const previous=gestureRef.current;gestureRef.current=null;const target=interactionTargetRef?.current??svgRef.current;if(previous&&target?.hasPointerCapture?.(previous.pointerId))target.releasePointerCapture(previous.pointerId);
    multiClickDraftRef.current = null; setDraftDrawings(null); setSnapMarker(null); if (announce) setAnnouncement("Drawing edit cancelled");
  }, [interactionTargetRef]);
  React.useEffect(()=>{if(cancelRevision!=null)cancelGesture(false);},[cancelRevision,cancelGesture]);
  React.useEffect(() => { if (gestureRef.current?.kind === "create" && gestureRef.current.drawing.type !== normalizedActiveTool?.id) cancelGesture(false); }, [cancelGesture, normalizedActiveTool?.id]);
  React.useEffect(() => () => { gestureRef.current = null; }, []);

  const updateGesture = React.useCallback((event: PointerEvent): DrawingState[] | null => {
    const gesture = gestureRef.current; if (!gesture || gesture.pointerId !== event.pointerId) return null;
    const element = svgRef.current; if (!element) return null;
    const rect = element.getBoundingClientRect(); let coordinate = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (gesture.kind === "create" || gesture.kind === "quick-measure" || gesture.kind === "resize") {
      if (gesture.kind === "create" && gesture.drawing.type === "ellipse" && event.shiftKey) { const origin = engine.coordinateFor(gesture.drawing.points[0]); if (origin) { const size = Math.max(Math.abs(coordinate.x - origin.x), Math.abs(coordinate.y - origin.y)); coordinate = { x: origin.x + Math.sign(coordinate.x - origin.x || 1) * size, y: origin.y + Math.sign(coordinate.y - origin.y || 1) * size }; } }
      const result = pointForEvent(event, coordinate); if (!result) return null; setSnapMarker(result.marker);
      if (gesture.kind === "create" || gesture.kind === "quick-measure") {
        const freehand = gesture.kind === "create" && normalizedActiveTool?.input.mode === "freehand";
        const pointIndex = gesture.drawing.points.length > 1 ? gesture.drawing.points.length - 1 : 0;
        const points = freehand ? [...gesture.drawing.points, result.point] : gesture.drawing.points.map((point, index) => index === pointIndex ? result.point : point);
        const drawing = { ...gesture.drawing, points };
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
  }, [drawings, engine, normalizedActiveTool?.input.mode, pointForEvent]);

  React.useEffect(() => {
    const svg = svgRef.current; const target = interactionTargetRef?.current ?? svg; if (!svg || !target) return;
    const previousCursor = target.style.cursor;
    if (gestureRef.current && gestureRef.current.kind !== "create") target.style.cursor = "grabbing";
    else if (normalizedActiveTool) target.style.cursor = "crosshair";
    const localCoordinate = (event: PointerEvent): DrawingCoordinate => { const rect = svg.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; };
    const hitAt = (point: DrawingCoordinate) => isGapCoordinate(point.x) ? null : hitTestDrawings({ point, drawings: displayedDrawings, selectedDrawingIds: selectedSet, tools: normalizedTools, renderers, contexts, minimumTolerance: settings.hitTolerance });
    const finishTool = () => { if (!settings.keepDrawingMode) onActiveToolComplete?.(); };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || event.isPrimary === false) return;
      if (event.target instanceof Element && event.target.closest('button,input,select,textarea,[role="separator"],[role="menuitem"]')) return;
      if (clipToPricePane) { const pane=engine.getSnapshot().panes.find(p=>p.id==='price'); const point=localCoordinate(event); if(!pane || point.y<pane.top || point.y>pane.top+pane.height || point.x<(pane.left??0) || point.x>(pane.left??0)+pane.width) return; }
      const coordinate = localCoordinate(event);
      if (isGapCoordinate(coordinate.x)) return;
      if (normalizedActiveTool) {
        const result = pointForEvent(event, coordinate); if (!result) return;
        event.preventDefault(); event.stopPropagation(); target.focus({ preventScroll: true });
        if (normalizedActiveTool.input.mode === "multi-click" || normalizedActiveTool.input.mode === "variable") {
          const maximumPoints = normalizedActiveTool.input.points ?? normalizedActiveTool.input.maximumPoints;
          const minimumPoints = normalizedActiveTool.input.minimumPoints ?? maximumPoints ?? 1;
          const existing = multiClickDraftRef.current;
          const drawing = existing?.drawing.type === normalizedActiveTool.id ? { ...existing.drawing, points: [...existing.drawing.points, result.point] } : makeDrawing(normalizedActiveTool, [result.point]);
          if (maximumPoints && drawing.points.length >= maximumPoints) {
            multiClickDraftRef.current = null; setDraftDrawings(null); setSnapMarker(null); onDrawingsChange([...drawings, drawing], { type: "create", drawingIds: [drawing.id], transactionId: `create-${drawing.id}` }); emitSelection([drawing.id], [...drawings, drawing]); setAnnouncement(`${drawing.type} created`); finishTool();
          } else {
            multiClickDraftRef.current = { drawing, minimumPoints, maximumPoints }; setDraftDrawings([...drawings, drawing]); setSnapMarker(result.marker); setAnnouncement(`${drawing.points.length} point${drawing.points.length === 1 ? "" : "s"} placed`);
          }
          return;
        }
        const pointCount = normalizedActiveTool.input.points ?? normalizedActiveTool.input.minimumPoints ?? 1; const points = pointCount === 1 ? [result.point] : Array.from({ length: pointCount }, () => result.point);
        const drawing = makeDrawing(normalizedActiveTool, points);
        gestureRef.current = { kind: "create", pointerId: event.pointerId, drawing, changed: pointCount === 1 };
        setDraftDrawings([...drawings, drawing]); setSnapMarker(result.marker); target.style.cursor = "crosshair"; target.setPointerCapture?.(event.pointerId); return;
      }
      const hit = hitAt(coordinate);
      if (!hit && event.shiftKey) {
        const result = pointForEvent(event, coordinate); if (!result) return;
        event.preventDefault(); event.stopPropagation(); target.focus({ preventScroll: true });
        const drawing: DrawingState = { id: "quick-measure", type: "date-price-range", version: 1, points: [result.point, result.point], parameters: { color: "#64748b", lineWidth: 1, fillOpacity: 0.12 }, visible: true, locked: true };
        gestureRef.current = { kind: "quick-measure", pointerId: event.pointerId, drawing, changed: false }; setDraftDrawings([...drawings, drawing]); target.setPointerCapture?.(event.pointerId); return;
      }
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
        const groupIds = drawing.groupId ? drawings.filter((item) => item.groupId === drawing.groupId).map((item) => item.id) : []; const ids = Array.from(new Set([...(nextSelection.includes(drawing.id) ? nextSelection : [drawing.id]), ...groupIds])).filter((id) => !drawings.find((item) => item.id === id)?.locked);
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
      if (current.kind === "quick-measure") { setAnnouncement("Quick measurement complete"); return; }
      if (current.kind === "create") {
        if (current.drawing.points.length > 1 && pointsAreEqual(current.drawing.points[0], current.drawing.points.at(-1)!) && !normalizedActiveTool?.input.allowDegenerate) return;
        const tolerance = typeof current.drawing.parameters.simplificationTolerance === "number" ? current.drawing.parameters.simplificationTolerance : 1.5; const committedDrawing = normalizedActiveTool?.input.mode === "freehand" ? { ...current.drawing, points: simplifyCoordinates(current.drawing.points.map((point) => engine.coordinateFor(point)).filter((point): point is DrawingCoordinate => point != null), tolerance).map((coordinate) => engine.pointForCoordinate(coordinate)).filter((point): point is DrawingPoint => point != null) } : current.drawing;
        const committed = next.map((drawing) => drawing.id === current.drawing.id ? committedDrawing : drawing); onDrawingsChange(committed, { type: "create", drawingIds: [current.drawing.id], transactionId: `create-${current.drawing.id}` }); emitSelection([current.drawing.id], committed); setAnnouncement(`${current.drawing.type} created`); finishTool();
      } else {
        const ids = current.kind === "resize" ? [current.drawing.id] : current.drawingIds;
        onDrawingsChange(next, { type: current.kind, drawingIds: ids, transactionId: `${current.kind}-${event.pointerId}` }); setAnnouncement(`${ids.length} drawing${ids.length === 1 ? "" : "s"} ${current.kind === "move" ? "moved" : "resized"}`);
      }
    };
    const handlePointerCancel = (event: PointerEvent) => { if (gestureRef.current?.pointerId !== event.pointerId) return; event.preventDefault(); event.stopPropagation(); target.style.cursor = normalizedActiveTool ? "crosshair" : previousCursor; cancelGesture(); };
    const handleLostPointerCapture = (event: PointerEvent) => { if (gestureRef.current?.pointerId === event.pointerId) { target.style.cursor = normalizedActiveTool ? "crosshair" : previousCursor; cancelGesture(); } };
    const shiftTime = (point: DrawingPoint, amount: number): DrawingPoint => {
      const time = engine.shiftTime?.(point.time, amount);
      if (time != null) return { ...point, time };
      const index = data.findIndex((bar) => marketTimeKey(bar.time) === marketTimeKey(point.time));
      if (index >= 0 && data.length) return { ...point, time: data[Math.max(0, Math.min(data.length - 1, index + amount))].time };
      return typeof point.time === "number" ? { ...point, time: point.time + amount } : point;
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('button,input,select,textarea,[role="separator"],[role="menuitem"]')) return;
      const visible = drawings.filter((drawing) => drawing.visible);
      if (event.key === "Escape") { if (gestureRef.current || multiClickDraftRef.current) cancelGesture(); else emitSelection([]); onActiveToolComplete?.(); return; }
      if (multiClickDraftRef.current && event.key === "Backspace") {
        event.preventDefault(); const draft = multiClickDraftRef.current; const points = draft.drawing.points.slice(0, -1); if (!points.length) cancelGesture(); else { const drawing = { ...draft.drawing, points }; multiClickDraftRef.current = { ...draft, drawing }; setDraftDrawings([...drawings, drawing]); setAnnouncement("Last draft point removed"); } return;
      }
      if (multiClickDraftRef.current && event.key === "Enter") {
        event.preventDefault(); const draft = multiClickDraftRef.current; if (draft.drawing.points.length < draft.minimumPoints) return; multiClickDraftRef.current = null; setDraftDrawings(null); onDrawingsChange([...drawings, draft.drawing], { type: "create", drawingIds: [draft.drawing.id], transactionId: `create-${draft.drawing.id}` }); emitSelection([draft.drawing.id], [...drawings, draft.drawing]); setAnnouncement(`${draft.drawing.type} created`); finishTool(); return;
      }
      if (event.key === "Tab" && visible.length) {
        const currentIndex = visible.findIndex((drawing) => drawing.id === focusedDrawingId || selectedSet.has(drawing.id));
        if ((!event.shiftKey && currentIndex === visible.length - 1) || (event.shiftKey && currentIndex <= 0)) return;
        event.preventDefault(); const nextIndex = (currentIndex + (event.shiftKey ? -1 : 1) + visible.length) % visible.length;
        emitSelection([visible[nextIndex].id]); setFocusedDrawingId(visible[nextIndex].id); return;
      }
      if ((event.key === "Enter" || event.key === " ") && normalizedActiveTool) {
        event.preventDefault(); const center = pointForEvent(event, { x: bounds.width / 2, y: bounds.height / 2 }); if (!center) return;
        const pointCount = normalizedActiveTool.input.points ?? normalizedActiveTool.input.minimumPoints ?? 1; const points = pointCount === 1 ? [center.point] : Array.from({ length: pointCount }, (_, index) => index === 0 ? center.point : engine.pointForCoordinate({ x: bounds.width / 2 + 40 * index, y: bounds.height / 2 - 40 * index }) ?? center.point);
        const drawing = makeDrawing(normalizedActiveTool, points); onDrawingsChange([...drawings, drawing], { type: "create", drawingIds: [drawing.id], transactionId: `keyboard-create-${drawing.id}` }); emitSelection([drawing.id], [...drawings, drawing]); setAnnouncement(`${drawing.type} created with keyboard`); finishTool(); return;
      }
      if ((event.key === "Delete" || event.key === "Backspace") && effectiveSelectedIds.length) {
        event.preventDefault(); const next = drawings.filter((drawing) => !selectedSet.has(drawing.id)); onDrawingsChange(next, { type: "delete", drawingIds: effectiveSelectedIds }); emitSelection([], next); setAnnouncement(`${effectiveSelectedIds.length} drawing${effectiveSelectedIds.length === 1 ? "" : "s"} deleted`); return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d" && effectiveSelectedIds.length) {
        event.preventDefault(); const duplicates = drawings.filter((drawing) => selectedSet.has(drawing.id)).map((drawing) => ({ ...drawing, id: makeId("duplicate"), points: drawing.points.map((point) => ({ ...shiftTime(point, 1), price: point.price + settings.keyboardPriceStep })) }));
        onDrawingsChange([...drawings, ...duplicates], { type: "duplicate", drawingIds: duplicates.map((drawing) => drawing.id) }); emitSelection(duplicates.map((drawing) => drawing.id), [...drawings, ...duplicates]); setAnnouncement(`${duplicates.length} drawing${duplicates.length === 1 ? "" : "s"} duplicated`); return;
      }
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) || !effectiveSelectedIds.length) return;
      event.preventDefault(); const multiplier = event.shiftKey ? 10 : 1; const timeDelta = event.key === "ArrowLeft" ? -multiplier : event.key === "ArrowRight" ? multiplier : 0; const priceDelta = event.key === "ArrowUp" ? settings.keyboardPriceStep * multiplier : event.key === "ArrowDown" ? -settings.keyboardPriceStep * multiplier : 0;
      const movableIds = effectiveSelectedIds.filter((id) => !drawings.find((drawing) => drawing.id === id)?.locked); if (!movableIds.length) return;
      const next = drawings.map((drawing) => movableIds.includes(drawing.id) ? { ...drawing, points: drawing.points.map((point) => ({ ...shiftTime(point, timeDelta), price: point.price + priceDelta })) } : drawing);
      onDrawingsChange(next, { type: "move", drawingIds: movableIds, transactionId: `keyboard-${event.key}-${Date.now()}` }); setAnnouncement(`${movableIds.length} drawing${movableIds.length === 1 ? "" : "s"} nudged`);
    };
    const handleDoubleClick = (event: MouseEvent) => { const draft = multiClickDraftRef.current; if (!draft || draft.drawing.points.length < draft.minimumPoints) return; event.preventDefault(); event.stopPropagation(); multiClickDraftRef.current = null; setDraftDrawings(null); onDrawingsChange([...drawings, draft.drawing], { type: "create", drawingIds: [draft.drawing.id], transactionId: `create-${draft.drawing.id}` }); emitSelection([draft.drawing.id], [...drawings, draft.drawing]); setAnnouncement(`${draft.drawing.type} created`); finishTool(); };
    type TargetListener = Parameters<typeof target.addEventListener>[1];
    const pointerDownListener = handlePointerDown as TargetListener; const pointerMoveListener = handlePointerMove as TargetListener; const pointerUpListener = handlePointerUp as TargetListener; const pointerCancelListener = handlePointerCancel as TargetListener; const lostCaptureListener = handleLostPointerCapture as TargetListener; const keyDownListener = handleKeyDown as TargetListener; const doubleClickListener = handleDoubleClick as TargetListener;
    target.addEventListener("pointerdown", pointerDownListener, true); target.addEventListener("pointermove", pointerMoveListener, true); target.addEventListener("pointerup", pointerUpListener, true); target.addEventListener("pointercancel", pointerCancelListener, true); target.addEventListener("lostpointercapture", lostCaptureListener, true); target.addEventListener("keydown", keyDownListener); target.addEventListener("dblclick", doubleClickListener, true);
    return () => { target.style.cursor = previousCursor; target.removeEventListener("pointerdown", pointerDownListener, true); target.removeEventListener("pointermove", pointerMoveListener, true); target.removeEventListener("pointerup", pointerUpListener, true); target.removeEventListener("pointercancel", pointerCancelListener, true); target.removeEventListener("lostpointercapture", lostCaptureListener, true); target.removeEventListener("keydown", keyDownListener); target.removeEventListener("dblclick", doubleClickListener, true); };
  }, [clipToPricePane, bounds.height, bounds.width, cancelGesture, contexts, data, displayedDrawings, draftDrawings, drawings, effectiveSelectedIds, emitSelection, engine, focusedDrawingId, interactionTargetRef, normalizedActiveTool, normalizedTools, onActiveToolComplete, onDrawingsChange, pointForEvent, renderers, selectedSet, settings.hitTolerance, settings.keepDrawingMode, settings.keyboardPriceStep, updateGesture]);

  const clipId = React.useId();
  const pricePane = clipToPricePane ? engine.getSnapshot().panes.find(p=>p.id==='price') : undefined;
  const clipBounds = pricePane ?? { left: 0, top: 0, width: bounds.width, height: bounds.height };
  let allowed = [[clipBounds.left ?? 0, (clipBounds.left ?? 0) + clipBounds.width]];
  // Keep a small raster footprint for endpoint samples, including singleton paths.
  gapCoordinates.forEach(([a,b]) => { const from=a+3,to=b-3; if(to<=from)return; allowed = allowed.flatMap(([left,right]) => to <= left || from >= right ? [[left,right]] : [...(from > left ? [[left,from]] : []), ...(to < right ? [[to,right]] : [])]); });
  const shouldClip = Boolean(pricePane) || gapCoordinates.length > 0;
  const floatingDrawing = effectiveSelectedIds.length === 1 ? displayedDrawings.find((drawing) => drawing.id === effectiveSelectedIds[0]) : undefined;
  const floatingPoint = floatingDrawing ? contexts.get(floatingDrawing.id)?.points.find((point) => point != null) : undefined;
  return <>
    <svg ref={svgRef} role="application" aria-roledescription="interactive drawing layer" aria-label={props["aria-label"] ?? "Chart drawings"} aria-activedescendant={focusedDrawingId ? `drawing-${clipId}-${focusedDrawingId}` : undefined} className={cn("pointer-events-none absolute inset-0 size-full overflow-visible outline-none", className)} tabIndex={interactionTargetRef ? undefined : 0} {...props}>
      {shouldClip ? <defs><clipPath id={clipId}>{allowed.map(([left,right],index) => <rect key={index} x={left} y={clipBounds.top} width={Math.max(0,right-left)} height={clipBounds.height}/>)}</clipPath></defs> : null}
      <g clipPath={shouldClip ? `url(#${clipId})` : undefined}>
      {displayedDrawings.filter((drawing) => drawing.visible).map((drawing) => {
        const renderer = resolveDrawingRenderer(drawing, normalizedTools, renderers); const context = contexts.get(drawing.id); if (!renderer || !context) return null;
        const primitives = renderer.getPrimitives(context); const color = typeof drawing.parameters.color === "string" ? drawing.parameters.color : "hsl(var(--primary))"; const lineWidth = typeof drawing.parameters.lineWidth === "number" ? drawing.parameters.lineWidth : 1;
        const selected = selectedSet.has(drawing.id); const emphasized = selected || hoveredDrawingId === drawing.id; const focused = focusedDrawingId === drawing.id; const isShape = primitives.some((primitive) => primitive.kind === "rect" || primitive.kind === "ellipse" || primitive.kind === "polygon" || primitive.kind === "band" || primitive.kind === "polyline" && primitive.closed); const handles = selected && !drawing.locked ? renderer.getHandles?.(context) ?? [] : []; const derived = renderer.describe?.(context) ?? Object.entries(renderer.derivedValues?.(context) ?? {}).map(([key, value]) => `${key} ${value}`).join(", ");
        return <g role="group" id={`drawing-${clipId}-${drawing.id}`} key={drawing.id} data-drawing-id={drawing.id} aria-label={`${drawing.name ?? drawing.type}${derived ? `, ${derived}` : ""}${drawing.locked ? ", locked" : ""}${selected ? ", selected" : ""}`} fill={isShape ? color : "none"} fillOpacity={isShape ? Number(drawing.parameters.fillOpacity ?? 0.12) : 0} stroke={color} strokeWidth={lineWidth + (emphasized ? 1 : 0)} strokeDasharray={draftDrawings && !drawings.includes(drawing) ? "6 4" : dashArray(drawing.parameters)} color={color} opacity={typeof drawing.parameters.opacity === "number" ? drawing.parameters.opacity : 1}>
          {focused ? <g stroke="hsl(var(--ring))" strokeWidth={lineWidth + 5} opacity={0.35}>{primitives.map((primitive) => renderPrimitive(primitive))}</g> : null}
          <g data-hit-area="true" aria-hidden="true">{primitives.map((primitive) => renderPrimitive(primitive, true))}</g>{primitives.map((primitive) => renderPrimitive(primitive))}
          {handles.map((handle) => <g key={handle.id} data-drawing-handle={handle.id}><circle cx={handle.position.x} cy={handle.position.y} r={14} fill="transparent" stroke="none" /><circle cx={handle.position.x} cy={handle.position.y} r={6} fill="hsl(var(--background))" stroke={color} strokeWidth={2} /></g>)}
        </g>;
      })}
      {snapMarker ? <g data-snap-marker="true" pointerEvents="none" fill="none" stroke="hsl(var(--primary))" strokeWidth={1.5}><circle cx={snapMarker.x} cy={snapMarker.y} r={7} /><line x1={snapMarker.x - 11} x2={snapMarker.x + 11} y1={snapMarker.y} y2={snapMarker.y} /><line x1={snapMarker.x} x2={snapMarker.x} y1={snapMarker.y - 11} y2={snapMarker.y + 11} /></g> : null}
      </g>
    </svg>
    {floatingDrawing && floatingPoint ? <div role="toolbar" aria-label={`Actions for ${floatingDrawing.name ?? floatingDrawing.type}`} className="absolute z-20 flex -translate-y-full items-center gap-0.5 rounded-[var(--radius)] border border-border bg-background/95 p-1 shadow-md backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95" style={{ left: Math.max(4, Math.min(bounds.width - 124, floatingPoint.x)), top: Math.max(4, floatingPoint.y - 10) }}><IconAction label={floatingDrawing.locked ? "Unlock drawing" : "Lock drawing"} onClick={() => onDrawingsChange(drawings.map((drawing) => drawing.id === floatingDrawing.id ? { ...drawing, locked: !drawing.locked } : drawing), { type: "lock", drawingIds: [floatingDrawing.id] })}>{floatingDrawing.locked ? <Unlock /> : <Lock />}</IconAction><IconAction label="Hide drawing" onClick={() => { const next = drawings.map((drawing) => drawing.id === floatingDrawing.id ? { ...drawing, visible: false } : drawing); onDrawingsChange(next, { type: "visibility", drawingIds: [floatingDrawing.id] }); emitSelection([], next); }}><EyeOff /></IconAction><IconAction label="Delete drawing" onClick={() => { const next = drawings.filter((drawing) => drawing.id !== floatingDrawing.id); onDrawingsChange(next, { type: "delete", drawingIds: [floatingDrawing.id] }); emitSelection([], next); }}><Trash2 /></IconAction></div> : null}
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
  </>;
}

export interface DrawingToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  tools: DrawingToolDefinition[];
  activeToolId?: string;
  selectedDrawing?: DrawingState;
  selectedDrawings?: DrawingState[];
  canUndo?: boolean;
  canRedo?: boolean;
  favoriteToolIds?: string[];
  recentToolIds?: string[];
  keepDrawingMode?: boolean;
  onActiveToolChange?: (toolId: string | undefined) => void;
  onToggleFavorite?: (toolId: string) => void;
  onKeepDrawingModeChange?: (enabled: boolean) => void;
  onLockAll?: () => void;
  onHideAll?: () => void;
  onRemoveAll?: () => void;
  onCreateAlert?: () => void;
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

export function DrawingToolbar({ orientation = "horizontal", tools, activeToolId, selectedDrawing, selectedDrawings, canUndo, canRedo, favoriteToolIds = [], recentToolIds = [], keepDrawingMode = false, onActiveToolChange, onToggleFavorite, onKeepDrawingModeChange, onLockAll, onHideAll, onRemoveAll, onCreateAlert, onUpdateSelected, onStylePreview, onStyleCommit, onDelete, onToggleVisibility, onToggleLock, onUndo, onRedo, className, ...props }: DrawingToolbarProps) {
  const selections = selectedDrawings ?? (selectedDrawing ? [selectedDrawing] : []); const primary = selections[0]; const [styleDraft, setStyleDraft] = React.useState<Record<string, string | number>>({}); const committedStyle = React.useRef<Record<string, string | number>>({});
  const [search, setSearch] = React.useState("");
  React.useEffect(() => {
    const next: Record<string, string | number> = primary ? { color: typeof primary.parameters.color === "string" && primary.parameters.color.startsWith("#") ? primary.parameters.color : "#64748b", lineWidth: typeof primary.parameters.lineWidth === "number" ? primary.parameters.lineWidth : 1, dashStyle: typeof primary.parameters.dashStyle === "string" ? primary.parameters.dashStyle : "solid", fillOpacity: typeof primary.parameters.fillOpacity === "number" ? primary.parameters.fillOpacity : 0.12 } : {};
    committedStyle.current = next; setStyleDraft(next);
  }, [primary]);
  const preview = (changes: Record<string, string | number>) => { const next = { ...styleDraft, ...changes }; setStyleDraft(next); onStylePreview?.(next); };
  const commitStyle = (changes: Record<string, string | number>) => { const next = { ...styleDraft, ...changes }; if (JSON.stringify(next) === JSON.stringify(committedStyle.current)) return; committedStyle.current = next; setStyleDraft(next); (onStyleCommit ?? onUpdateSelected)?.(next); };
  const matchingTools = tools.filter((tool) => `${tool.label} ${tool.category ?? ""}`.toLowerCase().includes(search.toLowerCase()));
  const groupedTools = matchingTools.reduce<Record<string, DrawingToolDefinition[]>>((groups, tool) => { const category = normalizeDrawingToolDefinition(tool).category; groups[category] = [...(groups[category] ?? []), tool]; return groups; }, {});
  const activeTool = tools.find((tool) => tool.id === activeToolId); const allHidden = selections.length > 0 && selections.every((drawing) => !drawing.visible); const allLocked = selections.length > 0 && selections.every((drawing) => drawing.locked);
  return <div role="toolbar" aria-label="Drawing tools" aria-orientation={orientation} className={cn("flex min-h-11 flex-wrap items-center gap-1 border-b border-border bg-background px-2 py-1.5", orientation === "vertical" && "w-12 flex-col flex-nowrap border-b-0 border-r px-1 [&>div]:max-w-full", className)} {...props}>
    <IconAction label="Pointer" shortcut="Esc" aria-pressed={!activeToolId} colorStyle={!activeToolId ? "tonal" : "ghost"} onClick={() => onActiveToolChange?.(undefined)}><MousePointer2 /></IconAction>
    <DropdownMenu><Tooltip><TooltipTrigger asChild><DropdownMenuTrigger asChild><Button type="button" size="sm" colorStyle={activeToolId ? "tonal" : "ghost"} aria-label={activeTool ? `Active drawing tool: ${activeTool.label}` : "Choose drawing tool"}>{activeTool ? <ToolIcon id={activeTool.id} /> : <Slash />}{orientation === "horizontal" ? <span className="hidden sm:inline">{activeTool?.label ?? "Draw"}</span> : null}</Button></DropdownMenuTrigger></TooltipTrigger><TooltipContent size="xs">Drawing tools · press and drag</TooltipContent></Tooltip>
      <DropdownMenuContent role="dialog" aria-label="Choose drawing tool" aria-orientation={undefined} align="start" className="max-h-[28rem] w-72 overflow-auto"><div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-popover p-2"><Search className="size-3.5 text-muted-foreground" aria-hidden="true" /><input aria-label="Search drawing tools" value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.stopPropagation()} className="h-7 min-w-0 flex-1 bg-transparent text-xs outline-none" placeholder="Search tools" /></div><div role="menu" aria-label="Drawing tool choices">{!search && favoriteToolIds.length ? <><DropdownMenuLabel>Favorites</DropdownMenuLabel>{favoriteToolIds.map((id) => tools.find((tool) => tool.id === id)).filter((tool): tool is DrawingToolDefinition => Boolean(tool)).map((tool) => <DropdownMenuItem key={`favorite-${tool.id}`} icon={<Star className="fill-current" />} onSelect={() => onActiveToolChange?.(tool.id)}>{tool.label}</DropdownMenuItem>)}<DropdownMenuSeparator /></> : null}{!search && recentToolIds.length ? <><DropdownMenuLabel>Recent</DropdownMenuLabel>{recentToolIds.slice(0, 5).map((id) => tools.find((tool) => tool.id === id)).filter((tool): tool is DrawingToolDefinition => Boolean(tool)).map((tool) => <DropdownMenuItem key={`recent-${tool.id}`} icon={<ToolIcon id={tool.id} />} onSelect={() => onActiveToolChange?.(tool.id)}>{tool.label}</DropdownMenuItem>)}<DropdownMenuSeparator /></> : null}{Object.entries(groupedTools).map(([category, categoryTools], categoryIndex) => <React.Fragment key={category}>{categoryIndex ? <DropdownMenuSeparator /> : null}<DropdownMenuLabel>{category}</DropdownMenuLabel>{categoryTools.map((tool) => <div key={tool.id} className="flex"><DropdownMenuItem className="min-w-0 flex-1" icon={<ToolIcon id={tool.id} />} onSelect={() => onActiveToolChange?.(tool.id)}>{tool.label}</DropdownMenuItem>{onToggleFavorite ? <DropdownMenuItem role="menuitemcheckbox" aria-checked={favoriteToolIds.includes(tool.id)} aria-label={`${favoriteToolIds.includes(tool.id) ? "Remove" : "Add"} ${tool.label} ${favoriteToolIds.includes(tool.id) ? "from" : "to"} favorites`} onSelect={(event) => { event.preventDefault(); onToggleFavorite(tool.id); }}><Star className={cn("size-3.5", favoriteToolIds.includes(tool.id) && "fill-current")} /></DropdownMenuItem> : null}</div>)}</React.Fragment>)}</div></DropdownMenuContent>
    </DropdownMenu>
    {orientation === 'vertical' ? favoriteToolIds.map(id => tools.find(t=>t.id===id)).filter((tool): tool is DrawingToolDefinition => Boolean(tool)).map(tool=><IconAction key={tool.id} label={tool.label} aria-pressed={activeToolId===tool.id} onClick={()=>onActiveToolChange?.(tool.id)}><ToolIcon id={tool.id}/></IconAction>) : null}
    {onKeepDrawingModeChange?<IconAction label={keepDrawingMode ? "Disable keep drawing mode" : "Enable keep drawing mode"} aria-pressed={keepDrawingMode} colorStyle={keepDrawingMode ? "tonal" : "ghost"} onClick={() => onKeepDrawingModeChange?.(!keepDrawingMode)}><Repeat2 /></IconAction>:null}{onUndo||onRedo?<><div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />{onUndo?<IconAction label="Undo" shortcut="Ctrl/Cmd+Z" disabled={!canUndo} onClick={onUndo}><Undo2 /></IconAction>:null}{onRedo?<IconAction label="Redo" shortcut="Ctrl/Cmd+Shift+Z" disabled={!canRedo} onClick={onRedo}><Redo2 /></IconAction>:null}</>:null}
    {(onLockAll || onHideAll || onRemoveAll) ? <DropdownMenu><DropdownMenuTrigger asChild><Button size="sm" colorStyle="ghost">All</Button></DropdownMenuTrigger><DropdownMenuContent align="start">{onLockAll ? <DropdownMenuItem icon={<Lock />} onSelect={onLockAll}>Lock all</DropdownMenuItem> : null}{onHideAll ? <DropdownMenuItem icon={<EyeOff />} onSelect={onHideAll}>Hide all</DropdownMenuItem> : null}{onRemoveAll ? <><DropdownMenuSeparator /><DropdownMenuItem icon={<Trash2 />} onSelect={onRemoveAll}>Remove all</DropdownMenuItem></> : null}</DropdownMenuContent></DropdownMenu> : null}
    {activeToolId && orientation === "horizontal" ? <span className="ml-1 hidden text-[0.6875rem] text-muted-foreground lg:inline">Drag to draw · Alt bypasses magnet · Esc cancels</span> : null}
    {primary ? <div className="ml-auto flex flex-wrap items-center gap-1" aria-label={`Style ${selections.length} selected drawing${selections.length === 1 ? "" : "s"}`}><Palette className="mx-1 size-3.5 text-muted-foreground" aria-hidden="true" />
      <input aria-label="Drawing color" type="color" className="size-8 cursor-pointer rounded-[var(--radius-sm)] border border-border bg-background p-1" value={String(styleDraft.color ?? "#64748b")} onInput={(event) => preview({ color: event.currentTarget.value })} onChange={(event) => commitStyle({ color: event.currentTarget.value })} />
      <select aria-label="Drawing line width" className="h-8 rounded-[var(--radius-sm)] border border-border bg-background px-2 text-xs" value={Number(styleDraft.lineWidth ?? 1)} onChange={(event) => { const changes = { lineWidth: Number(event.target.value) }; preview(changes); commitStyle(changes); }}><option value={1}>1 px</option><option value={2}>2 px</option><option value={3}>3 px</option><option value={5}>5 px</option></select>
      <select aria-label="Drawing dash style" className="h-8 rounded-[var(--radius-sm)] border border-border bg-background px-2 text-xs" value={String(styleDraft.dashStyle ?? "solid")} onChange={(event) => { const changes = { dashStyle: event.target.value }; preview(changes); commitStyle(changes); }}><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option></select>
      {(primary.type === "rectangle" || primary.type === "ellipse") ? <label className="flex h-8 items-center gap-1 px-1 text-[0.6875rem] text-muted-foreground">Fill<input aria-label="Drawing fill opacity" type="range" min={0} max={0.5} step={0.05} value={Number(styleDraft.fillOpacity ?? 0.12)} onInput={(event) => preview({ fillOpacity: Number(event.currentTarget.value) })} onPointerUp={(event) => commitStyle({ fillOpacity: Number(event.currentTarget.value) })} onKeyUp={(event) => commitStyle({ fillOpacity: Number(event.currentTarget.value) })} /></label> : null}
      {onCreateAlert ? <IconAction label="Create drawing alert" onClick={onCreateAlert}><Bell /></IconAction> : null}<IconAction label={allHidden ? "Show selected" : "Hide selected"} onClick={onToggleVisibility}>{allHidden ? <Eye /> : <EyeOff />}</IconAction><IconAction label={allLocked ? "Unlock selected" : "Lock selected"} onClick={onToggleLock}>{allLocked ? <Unlock /> : <Lock />}</IconAction><IconAction label="Delete selected" shortcut="Delete" onClick={onDelete}><Trash2 /></IconAction>
    </div> : null}
  </div>;
}
