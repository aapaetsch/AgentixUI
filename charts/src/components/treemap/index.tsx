"use client";

import * as React from "react";
import { Tooltip, Treemap as RechartsTreemap } from "recharts";

import { ChartContainer, ChartTooltipContent } from "../chart-container";

export interface TreemapDatum { name: string; value?: number; color?: string; children?: TreemapDatum[]; [key: string]: unknown }
export interface TreemapProps { data: TreemapDatum[]; "aria-label": string; height?: number; className?: string }
export function Treemap({ data, "aria-label": ariaLabel, height = 320, className }: TreemapProps) {
  return <ChartContainer config={{ value: { label: "Value", color: "hsl(var(--chart-1))" } }} className={className} style={{ height }} role="img" aria-label={ariaLabel}>
    <RechartsTreemap data={data} dataKey="value" nameKey="name" stroke="hsl(var(--background))" fill="hsl(var(--chart-1))" isAnimationActive={false}>
      <Tooltip content={<ChartTooltipContent />} />
    </RechartsTreemap>
  </ChartContainer>;
}
