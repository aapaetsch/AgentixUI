"use client";

import type { CartesianChartProps } from "../../lib/chart-types";
import { CartesianChart } from "../cartesian-chart";

export interface LineChartProps extends CartesianChartProps {
  /** Show a marker at every data point. */
  showDots?: boolean;
}

/** Accessible responsive multi-series line chart. */
export function LineChart(props: LineChartProps) {
  return <CartesianChart kind="line" {...props} />;
}

export type { ChartDatum, ChartSeries } from "../../lib/chart-types";
