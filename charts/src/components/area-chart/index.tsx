"use client";

import type { CartesianChartProps } from "../../lib/chart-types";
import { CartesianChart } from "../cartesian-chart";

export interface AreaChartProps extends CartesianChartProps {
  /** Stack series instead of drawing overlapping areas. */
  stacked?: boolean;
}

/** Accessible responsive multi-series area chart. */
export function AreaChart(props: AreaChartProps) {
  return <CartesianChart kind="area" {...props} />;
}
