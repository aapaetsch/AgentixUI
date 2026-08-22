"use client";

import type { CartesianChartProps } from "../../lib/chart-types";
import { CartesianChart } from "../cartesian-chart";

export interface BarChartProps extends CartesianChartProps {
  /** Stack series instead of grouping bars. */
  stacked?: boolean;
}

/** Accessible responsive grouped or stacked bar chart. */
export function BarChart(props: BarChartProps) {
  return <CartesianChart kind="bar" {...props} />;
}
