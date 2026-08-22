"use client";

import * as React from "react";
import { CartesianGrid, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltipContent } from "../chart-container";

export interface HeatmapDatum { x: string | number; y: string | number; value: number }
export interface HeatmapProps {
  data: HeatmapDatum[];
  "aria-label": string;
  height?: number;
  color?: string;
  valueFormatter?: (value: number) => string;
  className?: string;
}

interface HeatmapCellProps { cx?: number; cy?: number; payload?: HeatmapDatum; min: number; max: number; color: string }
function HeatmapCell({ cx = 0, cy = 0, payload, min, max, color }: HeatmapCellProps) {
  const ratio = payload && max !== min ? (payload.value - min) / (max - min) : 1;
  return <rect x={cx - 15} y={cy - 15} width={30} height={30} rx={3} fill={color} fillOpacity={0.16 + ratio * 0.84} />;
}

/** Categorical matrix heatmap with a continuous opacity legend. */
export function Heatmap({ data, "aria-label": ariaLabel, height = 320, color = "hsl(var(--chart-1))", valueFormatter, className }: HeatmapProps) {
  const values = data.map((item) => item.value);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 0;
  return (
    <ChartContainer config={{ value: { label: "Value", color } }} className={className} style={{ height }} role="img" aria-label={ariaLabel}>
      <ScatterChart accessibilityLayer margin={{ top: 12, right: 20, bottom: 8, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" type="category" tickLine={false} axisLine={false} />
        <YAxis dataKey="y" type="category" tickLine={false} axisLine={false} width={56} />
        <Tooltip cursor={false} content={<ChartTooltipContent valueFormatter={valueFormatter} />} />
        <Scatter name="Value" data={data} dataKey="value" shape={(props) => <HeatmapCell {...(props as unknown as HeatmapCellProps)} min={min} max={max} color={color} />} isAnimationActive={false} />
      </ScatterChart>
    </ChartContainer>
  );
}
