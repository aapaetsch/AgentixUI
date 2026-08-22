import type { ChartConfig, ChartSeries } from "./chart-types";

const palette = [1, 2, 3, 4, 5].map((index) => `hsl(var(--chart-${index}))`);

export function getSeriesColor(series: ChartSeries, index: number): string {
  return series.color ?? palette[index % palette.length];
}

export function createChartConfig(series: ChartSeries[]): ChartConfig {
  return Object.fromEntries(
    series.map((item, index) => [
      item.dataKey,
      {
        label: item.label ?? item.dataKey,
        color: getSeriesColor(item, index),
      },
    ]),
  );
}

export function formatChartValue(
  value: string | number | ReadonlyArray<string | number> | undefined,
  formatter?: (value: number) => string,
): string {
  if (Array.isArray(value)) return value.join(" – ");
  if (typeof value === "number") return formatter?.(value) ?? value.toLocaleString();
  return value == null ? "—" : String(value);
}
