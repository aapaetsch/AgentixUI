"use client";

import * as React from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "../chart-container";

export interface DonutDatum { name: string; value: number; color?: string }
export interface DonutChartProps { data: DonutDatum[]; "aria-label": string; height?: number; innerRadius?: number | string; centerLabel?: React.ReactNode; showLegend?: boolean; className?: string }
export function DonutChart({ data, "aria-label": ariaLabel, height = 288, innerRadius = "58%", centerLabel, showLegend = true, className }: DonutChartProps) {
  const config = Object.fromEntries(data.map((item, index) => [item.name, { label: item.name, color: item.color ?? `hsl(var(--chart-${index % 5 + 1}))` }]));
  return (
    <ChartContainer config={config} className={className} style={{ height }} role="img" aria-label={ariaLabel}>
      <PieChart accessibilityLayer>
        <Tooltip content={<ChartTooltipContent hideLabel />} />
        {showLegend ? <Legend content={<ChartLegendContent nameKey="name" />} /> : null}
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={innerRadius} outerRadius="82%" paddingAngle={1} strokeWidth={0} isAnimationActive={false}>
          {data.map((item) => <Cell key={item.name} fill={config[item.name].color} />)}
        </Pie>
        {centerLabel ? <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-sm font-semibold">{centerLabel}</text> : null}
      </PieChart>
    </ChartContainer>
  );
}
