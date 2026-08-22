"use client";

import * as React from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
} from "recharts";

import type { CartesianChartProps } from "../lib/chart-types";
import { createChartConfig, getSeriesColor } from "../lib/chart-utils";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart-container";

export type CartesianChartKind = "line" | "area" | "bar";

export interface InternalCartesianChartProps extends CartesianChartProps {
  kind: CartesianChartKind;
  stacked?: boolean;
  showDots?: boolean;
}

export function CartesianChart({
  kind,
  data,
  xKey,
  series,
  "aria-label": ariaLabel,
  height = 288,
  showGrid = true,
  showTooltip = true,
  showLegend = series.filter((item) => !item.hide).length > 1,
  xTickFormatter,
  valueFormatter,
  className,
  stacked = false,
  showDots = false,
}: InternalCartesianChartProps) {
  const config = React.useMemo(() => createChartConfig(series), [series]);
  const commonChildren = (
    <>
      {showGrid ? <CartesianGrid vertical={false} /> : null}
      <XAxis
        dataKey={xKey}
        tickLine={false}
        axisLine={false}
        tickMargin={10}
        tickFormatter={xTickFormatter}
        minTickGap={24}
      />
      <YAxis
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        width={48}
        tickFormatter={valueFormatter}
      />
      {showTooltip ? (
        <ChartTooltip
          cursor={{ stroke: "hsl(var(--border))", strokeDasharray: "4 4" }}
          content={<ChartTooltipContent valueFormatter={valueFormatter} />}
        />
      ) : null}
      {showLegend ? <ChartLegend content={<ChartLegendContent />} /> : null}
    </>
  );

  const margin = { top: 8, right: 12, bottom: showLegend ? 8 : 0, left: 0 };

  return (
    <ChartContainer
      config={config}
      className={className}
      style={{ height }}
      role="img"
      aria-label={ariaLabel}
    >
      {kind === "line" ? (
        <RechartsLineChart accessibilityLayer data={data} margin={margin}>
          {commonChildren}
          {series.map((item, index) => (
            <Line
              key={item.dataKey}
              dataKey={item.dataKey}
              name={item.label ?? item.dataKey}
              stroke={getSeriesColor(item, index)}
              strokeWidth={2}
              dot={showDots ? { r: 3, strokeWidth: 0 } : false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
              hide={item.hide}
              type="monotone"
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </RechartsLineChart>
      ) : kind === "area" ? (
        <RechartsAreaChart accessibilityLayer data={data} margin={margin}>
          {commonChildren}
          {series.map((item, index) => {
            const color = getSeriesColor(item, index);
            return (
              <Area
                key={item.dataKey}
                dataKey={item.dataKey}
                name={item.label ?? item.dataKey}
                stroke={color}
                fill={color}
                fillOpacity={stacked ? 0.45 : 0.16}
                strokeWidth={2}
                stackId={stacked ? "stack" : undefined}
                hide={item.hide}
                type="monotone"
                connectNulls
                isAnimationActive={false}
              />
            );
          })}
        </RechartsAreaChart>
      ) : (
        <RechartsBarChart accessibilityLayer data={data} margin={margin}>
          {commonChildren}
          {series.map((item, index) => (
            <Bar
              key={item.dataKey}
              dataKey={item.dataKey}
              name={item.label ?? item.dataKey}
              fill={getSeriesColor(item, index)}
              radius={[4, 4, 0, 0]}
              stackId={stacked ? "stack" : undefined}
              hide={item.hide}
              isAnimationActive={false}
            />
          ))}
        </RechartsBarChart>
      )}
    </ChartContainer>
  );
}
