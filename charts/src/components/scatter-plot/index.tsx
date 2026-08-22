"use client";

import * as React from "react";
import { CartesianGrid, Legend, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

import { getSeriesColor } from "../../lib/chart-utils";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "../chart-container";

export interface ScatterDatum { x: number; y: number; size?: number; [key: string]: number | string | undefined }
export interface ScatterSeries { id: string; label?: string; color?: string; data: ScatterDatum[] }
export interface ScatterPlotProps {
  series: ScatterSeries[]; "aria-label": string; height?: number; xLabel?: string; yLabel?: string;
  showGrid?: boolean; showLegend?: boolean; className?: string;
}
export function ScatterPlot({ series, "aria-label": ariaLabel, height = 320, xLabel, yLabel, showGrid = true, showLegend = series.length > 1, className }: ScatterPlotProps) {
  const config = Object.fromEntries(series.map((item, index) => [item.id, { label: item.label ?? item.id, color: getSeriesColor({ dataKey: item.id, color: item.color }, index) }]));
  return (
    <ChartContainer config={config} className={className} style={{ height }} role="img" aria-label={ariaLabel}>
      <ScatterChart accessibilityLayer margin={{ top: 12, right: 20, bottom: 16, left: 8 }}>
        {showGrid ? <CartesianGrid /> : null}
        <XAxis type="number" dataKey="x" name={xLabel ?? "X"} tickLine={false} axisLine={false} label={xLabel ? { value: xLabel, position: "insideBottom", offset: -8 } : undefined} />
        <YAxis type="number" dataKey="y" name={yLabel ?? "Y"} tickLine={false} axisLine={false} width={52} />
        <ZAxis type="number" dataKey="size" range={[40, 360]} />
        <Tooltip cursor={{ strokeDasharray: "4 4" }} content={<ChartTooltipContent />} />
        {showLegend ? <Legend content={<ChartLegendContent />} /> : null}
        {series.map((item) => <Scatter key={item.id} name={item.label ?? item.id} data={item.data} fill={config[item.id].color} isAnimationActive={false} />)}
      </ScatterChart>
    </ChartContainer>
  );
}
