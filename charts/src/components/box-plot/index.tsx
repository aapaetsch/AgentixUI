"use client";

import * as React from "react";

import { ChartContainer } from "../chart-container";

export interface BoxPlotDatum { category: string; min: number; q1: number; median: number; q3: number; max: number }
export interface BoxPlotProps { data: BoxPlotDatum[]; "aria-label": string; height?: number; color?: string; valueFormatter?: (value: number) => string; className?: string }
interface CanvasProps { width?: number; height?: number; data: BoxPlotDatum[]; color: string; valueFormatter?: (value: number) => string }
function BoxPlotCanvas({ width = 640, height = 300, data, color, valueFormatter }: CanvasProps) {
  const left = 56; const right = 16; const top = 16; const bottom = 40;
  const minimum = data.length ? Math.min(...data.map((item) => item.min)) : 0;
  const maximum = data.length ? Math.max(...data.map((item) => item.max)) : 1;
  const scale = (value: number) => top + (maximum - value) / Math.max(maximum - minimum, 1) * (height - top - bottom);
  const slot = (width - left - right) / Math.max(data.length, 1);
  return <svg width={width} height={height} role="presentation">
    {data.map((item, index) => { const x = left + slot * (index + 0.5); const boxWidth = Math.min(slot * 0.55, 54); return <g key={item.category}>
      <line x1={x} x2={x} y1={scale(item.max)} y2={scale(item.min)} stroke="hsl(var(--muted-foreground))" />
      <line x1={x - boxWidth / 3} x2={x + boxWidth / 3} y1={scale(item.max)} y2={scale(item.max)} stroke="hsl(var(--muted-foreground))" />
      <line x1={x - boxWidth / 3} x2={x + boxWidth / 3} y1={scale(item.min)} y2={scale(item.min)} stroke="hsl(var(--muted-foreground))" />
      <rect x={x - boxWidth / 2} y={scale(item.q3)} width={boxWidth} height={Math.max(scale(item.q1) - scale(item.q3), 1)} rx={3} fill={color} fillOpacity={0.2} stroke={color} />
      <line x1={x - boxWidth / 2} x2={x + boxWidth / 2} y1={scale(item.median)} y2={scale(item.median)} stroke={color} strokeWidth={2} />
      <text x={x} y={height - 14} textAnchor="middle" className="fill-muted-foreground text-[0.7rem]">{item.category}</text>
      <title>{`${item.category}: ${valueFormatter?.(item.median) ?? item.median}`}</title>
    </g>; })}
  </svg>;
}
export function BoxPlot({ data, "aria-label": ariaLabel, height = 300, color = "hsl(var(--chart-1))", valueFormatter, className }: BoxPlotProps) {
  return <ChartContainer config={{ distribution: { label: "Distribution", color } }} className={className} style={{ height }} role="img" aria-label={ariaLabel}>
    <BoxPlotCanvas data={data} color={color} valueFormatter={valueFormatter} />
  </ChartContainer>;
}
