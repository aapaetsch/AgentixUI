"use client";

import * as React from "react";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltipContent } from "../chart-container";

export interface HistogramBin { start: number; end: number; count: number; label: string }
export function binHistogramValues(values: readonly number[], binCount = 10): HistogramBin[] {
  if (!values.length || binCount < 1) return [];
  const min = Math.min(...values); const max = Math.max(...values);
  const width = max === min ? 1 : (max - min) / binCount;
  const bins = Array.from({ length: binCount }, (_, index) => ({ start: min + index * width, end: min + (index + 1) * width, count: 0, label: "" }));
  values.forEach((value) => { bins[Math.min(Math.floor((value - min) / width), binCount - 1)].count += 1; });
  return bins.map((bin) => ({ ...bin, label: `${bin.start.toFixed(1)}–${bin.end.toFixed(1)}` }));
}

export interface HistogramProps { values: number[]; "aria-label": string; bins?: number; height?: number; color?: string; className?: string }
export function Histogram({ values, "aria-label": ariaLabel, bins = 10, height = 288, color = "hsl(var(--chart-1))", className }: HistogramProps) {
  const data = React.useMemo(() => binHistogramValues(values, bins), [values, bins]);
  return (
    <ChartContainer config={{ count: { label: "Count", color } }} className={className} style={{ height }} role="img" aria-label={ariaLabel}>
      <RechartsBarChart accessibilityLayer data={data} barCategoryGap={1} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
        <CartesianGrid vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={40} />
        <Tooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill={color} radius={[3, 3, 0, 0]} isAnimationActive={false} />
      </RechartsBarChart>
    </ChartContainer>
  );
}
