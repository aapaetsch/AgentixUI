"use client";

import * as React from "react";
import { Button, cn } from "aapaetsch-ui-kit";

import { marketTimeKey } from "../core";
import type { DrawingPoint, DrawingState, DrawingToolDefinition, MarketChartEngine, OhlcBar } from "../core";

export interface DrawingLayerProps extends React.SVGAttributes<SVGSVGElement> {
  engine: MarketChartEngine;
  data?: readonly OhlcBar[];
  drawings: DrawingState[];
  activeTool?: DrawingToolDefinition;
  snapToOhlc?: boolean;
  snapDistance?: number;
  onDrawingsChange: (drawings: DrawingState[]) => void;
  onActiveToolComplete?: () => void;
}

function drawingPath(type: string, points: Array<{ x: number; y: number }>): React.ReactNode {
  const first = points[0]; const second = points[1];
  if (!first) return null;
  if (type === "horizontal-line") return <line x1={0} x2="100%" y1={first.y} y2={first.y} />;
  if (type === "vertical-line") return <line x1={first.x} x2={first.x} y1={0} y2="100%" />;
  if (type === "rectangle" && second) return <rect x={Math.min(first.x, second.x)} y={Math.min(first.y, second.y)} width={Math.abs(second.x-first.x)} height={Math.abs(second.y-first.y)} />;
  if (second) return <line x1={first.x} y1={first.y} x2={second.x} y2={second.y} />;
  return null;
}

export function DrawingLayer({
  engine,
  data = [],
  drawings,
  activeTool,
  snapToOhlc = true,
  snapDistance = 12,
  onDrawingsChange,
  onActiveToolComplete,
  className,
  ...props
}: DrawingLayerProps) {
  const draft = React.useRef<DrawingPoint[]>([]);
  const drag = React.useRef<{ id: string; pointIndex: number } | null>(null);
  const barsByTime = React.useMemo(() => new Map(data.map((bar) => [marketTimeKey(bar.time), bar])), [data]);
  const localPoint = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const coordinate = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const point = engine.pointForCoordinate(coordinate);
    if (!point || !snapToOhlc) return point;
    const bar = barsByTime.get(marketTimeKey(point.time));
    if (!bar) return point;
    const snapped = [bar.open, bar.high, bar.low, bar.close]
      .map((price) => ({ price, coordinate: engine.coordinateFor({ time: bar.time, price }) }))
      .filter((candidate): candidate is { price: number; coordinate: { x: number; y: number } } => candidate.coordinate != null)
      .map((candidate) => ({
        price: candidate.price,
        distance: Math.hypot(candidate.coordinate.x - coordinate.x, candidate.coordinate.y - coordinate.y),
      }))
      .sort((left, right) => left.distance - right.distance)[0];
    return snapped && snapped.distance <= snapDistance ? { time: bar.time, price: snapped.price } : point;
  };
  const select = (id: string) => onDrawingsChange(drawings.map((drawing) => ({ ...drawing, selected: drawing.id === id })));
  const updatePoint = (id: string, pointIndex: number, point: DrawingPoint) => onDrawingsChange(drawings.map((drawing) => drawing.id === id ? { ...drawing, points: drawing.points.map((value, index) => index === pointIndex ? point : value) } : drawing));

  return <svg
    className={cn("absolute inset-0 size-full touch-none", activeTool ? "cursor-crosshair" : "pointer-events-none", className)}
    onPointerDown={(event) => {
      if (!activeTool) return;
      const point = localPoint(event); if (!point) return;
      draft.current = [...draft.current, point];
      if (draft.current.length >= activeTool.requiredPoints) {
        const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `drawing-${Date.now()}`;
        onDrawingsChange([...drawings, { id, type: activeTool.id, version: activeTool.version, points: draft.current, parameters: activeTool.defaultParameters, visible: true, locked: false, selected: true }]);
        draft.current = [];
        onActiveToolComplete?.();
      }
    }}
    onPointerMove={(event) => { const state = drag.current; if (!state) return; const point = localPoint(event); if (point) updatePoint(state.id, state.pointIndex, point); }}
    onPointerUp={() => { drag.current = null; }}
    onPointerCancel={() => { drag.current = null; }}
    {...props}
  >
    {drawings.filter((drawing) => drawing.visible).map((drawing) => {
      const coordinates = drawing.points.map((point) => engine.coordinateFor(point)).filter((point): point is {x:number;y:number} => point != null);
      const color = typeof drawing.parameters.color === "string" ? drawing.parameters.color : "hsl(var(--primary))";
      const lineWidth = typeof drawing.parameters.lineWidth === "number" ? drawing.parameters.lineWidth : 1;
      return <g key={drawing.id} className="pointer-events-auto" onPointerDown={(event) => { event.stopPropagation(); select(drawing.id); }} fill={drawing.type === "rectangle" ? color : "none"} fillOpacity={drawing.type === "rectangle" ? Number(drawing.parameters.fillOpacity ?? 0.12) : 0} stroke={color} strokeWidth={drawing.selected ? lineWidth + 1 : lineWidth}>
        {drawingPath(drawing.type, coordinates)}
        {drawing.selected && !drawing.locked ? coordinates.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r={5} fill="hsl(var(--background))" stroke={color} onPointerDown={(event) => { event.stopPropagation(); drag.current = { id: drawing.id, pointIndex: index }; event.currentTarget.setPointerCapture(event.pointerId); }} />) : null}
      </g>;
    })}
  </svg>;
}

export interface DrawingToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  tools: DrawingToolDefinition[];
  activeToolId?: string;
  selectedDrawing?: DrawingState;
  canUndo?: boolean;
  canRedo?: boolean;
  onActiveToolChange?: (toolId: string | undefined) => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
  onToggleLock?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function DrawingToolbar({ tools, activeToolId, selectedDrawing, canUndo, canRedo, onActiveToolChange, onDelete, onToggleVisibility, onToggleLock, onUndo, onRedo, className, ...props }: DrawingToolbarProps) {
  return <div className={cn("flex flex-wrap items-center gap-1 border-b border-border bg-background p-2", className)} {...props}>
    <select aria-label="Drawing tool" className="h-10 rounded-[var(--radius)] border-2 border-border bg-background px-3 text-sm" value={activeToolId ?? ""} onChange={(event) => onActiveToolChange?.(event.target.value || undefined)}>
      <option value="">Pointer</option>{tools.map((tool) => <option key={tool.id} value={tool.id}>{tool.label}</option>)}
    </select>
    <Button size="sm" colorStyle="ghost" disabled={!canUndo} onClick={onUndo}>Undo</Button><Button size="sm" colorStyle="ghost" disabled={!canRedo} onClick={onRedo}>Redo</Button>
    {selectedDrawing ? <div className="ml-auto flex gap-1"><Button size="sm" colorStyle="ghost" onClick={onToggleVisibility}>{selectedDrawing.visible ? "Hide" : "Show"}</Button><Button size="sm" colorStyle="ghost" onClick={onToggleLock}>{selectedDrawing.locked ? "Unlock" : "Lock"}</Button><Button size="sm" colorStyle="text" onClick={onDelete}>Delete</Button></div> : null}
  </div>;
}
