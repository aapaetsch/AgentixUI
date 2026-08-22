import type * as React from "react";

export type ChartDatum = Record<string, string | number | null | undefined>;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
    icon?: React.ComponentType;
  }
>;

export interface ChartSeries {
  /** Property containing this series' numeric values. */
  dataKey: string;
  /** Human-readable label used by tooltips and legends. */
  label?: string;
  /** Any valid CSS color. Defaults to the shared chart palette. */
  color?: string;
  /** Hide this series from the rendered chart. */
  hide?: boolean;
}

export interface CartesianChartProps {
  /** Records rendered by the chart. */
  data: ChartDatum[];
  /** Property used for the horizontal category or time axis. */
  xKey: string;
  /** One or more numeric series to render. */
  series: ChartSeries[];
  /** Accessible name for the chart. */
  "aria-label": string;
  /** Responsive chart height in CSS pixels. */
  height?: number;
  /** Show horizontal reference grid lines. */
  showGrid?: boolean;
  /** Show the shared tooltip. */
  showTooltip?: boolean;
  /** Show the shared legend. */
  showLegend?: boolean;
  /** Format x-axis labels. */
  xTickFormatter?: (value: string | number) => string;
  /** Format y-axis labels and tooltip numeric values. */
  valueFormatter?: (value: number) => string;
  /** Additional classes for the chart container. */
  className?: string;
}
