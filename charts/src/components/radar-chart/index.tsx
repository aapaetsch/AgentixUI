"use client";

import * as React from "react";
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart as RechartsRadarChart, Tooltip } from "recharts";

import type { ChartDatum, ChartSeries } from "../../lib/chart-types";
import { createChartConfig, getSeriesColor } from "../../lib/chart-utils";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "../chart-container";

export interface RadarChartProps { data: ChartDatum[]; categoryKey: string; series: ChartSeries[]; "aria-label": string; height?: number; showLegend?: boolean; className?: string }
export function RadarChart({ data, categoryKey, series, "aria-label": ariaLabel, height = 320, showLegend = series.length > 1, className }: RadarChartProps) {
  const config = createChartConfig(series);
  return <ChartContainer config={config} className={className} style={{ height }} role="img" aria-label={ariaLabel}>
    <RechartsRadarChart accessibilityLayer data={data} outerRadius="72%">
      <PolarGrid /><PolarAngleAxis dataKey={categoryKey} /><PolarRadiusAxis tick={false} axisLine={false} />
      <Tooltip content={<ChartTooltipContent />} />{showLegend ? <Legend content={<ChartLegendContent />} /> : null}
      {series.map((item, index) => <Radar key={item.dataKey} dataKey={item.dataKey} name={item.label ?? item.dataKey} stroke={getSeriesColor(item, index)} fill={getSeriesColor(item, index)} fillOpacity={0.12} isAnimationActive={false} />)}
    </RechartsRadarChart>
  </ChartContainer>;
}
