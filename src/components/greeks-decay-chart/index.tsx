"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------------------------------
 * GreeksDecayChart
 * ------------------------------------------------------------------------------------------------*/

export type GreeksDecaySeriesKey = "delta" | "gamma" | "theta" | "vega";

/** Per-Greek display colors keyed by Tailwind text-color token. */
const GREEK_COLOR_TOKENS: Record<GreeksDecaySeriesKey, string> = {
  delta: "text-primary",
  gamma: "text-violet-500",
  theta: "text-amber-500",
  vega: "text-sky-500",
};

/**
 * Props for {@link GreeksDecayChart}.
 */
export interface GreeksDecayChartProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "color">,
    VariantProps<typeof greeksDecayContainerVariants> {
  /** Days remaining (DTE) axis, ascending. */
  days: number[];
  /** Delta series sampled at each `days`. */
  delta?: number[];
  /** Gamma series. */
  gamma?: number[];
  /** Theta series (per-day decay). */
  theta?: number[];
  /** Vega series. */
  vega?: number[];
  /** Restrict to a single Greek instead of showing all four. */
  greek?: "all" | GreeksDecaySeriesKey;
  /** viewBox width. @default 200 */
  width?: number;
  /** viewBox height. @default 80 */
  height?: number;
  /** Stroke width in viewBox units. @default 1.5 */
  strokeWidth?: number;
  /** Show the legend dots above the chart. @default true */
  showLegend?: boolean;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

export const greeksDecayContainerVariants = cva(
  ["inline-block", "align-middle", "select-none"].join(" "),
  { variants: {}, defaultVariants: {} }
);

interface Series {
  key: GreeksDecaySeriesKey;
  label: string;
  values: number[];
}

/**
 * GreeksDecayChart — inline-SVG mini line chart for Greek decay over DTE.
 *
 * Draws up to four overlapping lines (Δ, Γ, Θ, ν) against a `days` axis. No
 * axes, ticks, or crosshair — purely a compact "is this Greek decaying"
 * visual. Inherits Tailwind text-color tokens per series so light/dark modes
 * stay consistent.
 *
 * @example
 * ```tsx
 * <GreeksDecayChart days={[30, 20, 10, 5, 1]} delta={[0.5, 0.48, 0.42, 0.32, 0.18]} />
 * ```
 */
export const GreeksDecayChart = React.forwardRef<
  SVGSVGElement,
  GreeksDecayChartProps
>(function GreeksDecayChart(
  {
    days,
    delta,
    gamma,
    theta,
    vega,
    greek = "all",
    width = 200,
    height = 80,
    strokeWidth = 1.5,
    showLegend = true,
    className,
    style,
    ...svgProps
  },
  ref
) {
  const allSeries: Series[] = (
    [
      { key: "delta", label: "Δ", values: delta ?? [] },
      { key: "gamma", label: "Γ", values: gamma ?? [] },
      { key: "theta", label: "Θ", values: theta ?? [] },
      { key: "vega", label: "ν", values: vega ?? [] },
    ] as { key: GreeksDecaySeriesKey; label: string; values: number[] }[]
  ).filter(
    (s) =>
      (greek === "all" || s.key === greek) && s.values.length > 0
  );

  const dayCount = days.length;
  const visibleSeries = allSeries.filter(
    (s) => s.values.length === dayCount
  );

  // Dev-only warning: surface series silently dropped for length mismatch so
  // upstream data adapters get an obvious signal during development.
  if (process.env.NODE_ENV !== "production") {
    const dropped = allSeries.filter(
      (s) => s.values.length !== dayCount
    );
    if (dropped.length > 0) {
      console.warn(
        `GreeksDecayChart: dropped ${dropped.length} series whose length !== days.length (${dayCount}): ` +
          dropped
            .map((s) => `${s.label}(${s.values.length})`)
            .join(", ")
      );
    }
  }

  // Shared domain across visible series.
  let min = Infinity;
  let max = -Infinity;
  for (const s of visibleSeries) {
    for (const v of s.values) {
      if (Number.isFinite(v)) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
  }
  if (!Number.isFinite(min)) {
    min = 0;
    max = 1;
  }
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const span = max - min;

  const xFor = (i: number) =>
    dayCount <= 1 ? width / 2 : (i / (dayCount - 1)) * width;
  const yFor = (v: number) =>
    height - ((Number.isFinite(v) ? v : min) - min) / span * height;

  return (
    <div className={cn("inline-flex flex-col gap-1", className)} style={style}>
      {showLegend && visibleSeries.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.625rem] text-muted-foreground">
          {visibleSeries.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1">
              <span
                className={cn(
                  "inline-block size-1.5 rounded-full",
                  GREEK_COLOR_TOKENS[s.key]
                )}
              />
              <span className="font-mono">{s.label}</span>
            </span>
          ))}
        </div>
      )}
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        preserveAspectRatio="none"
        role="img"
        aria-label={
          svgProps["aria-label"] ??
          `greek decay chart: {${visibleSeries
            .map((s) => s.label)
            .join(", ")}} over ${dayCount} days`
        }
        className={greeksDecayContainerVariants()}
        {...svgProps}
      >
        {/* Zero baseline when domain crosses zero. */}
        {min < 0 && max > 0 && (
          <line
            x1={0}
            y1={yFor(0)}
            x2={width}
            y2={yFor(0)}
            stroke="currentColor"
            strokeWidth={0.5}
            strokeOpacity={0.3}
            strokeDasharray="2 3"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {visibleSeries.map((s) => {
          const segs: string[] = [];
          for (let i = 0; i < s.values.length; i++) {
            const x = xFor(i).toFixed(3);
            const y = yFor(s.values[i]!).toFixed(3);
            segs.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
          }
          return (
            <g key={s.key} className={GREEK_COLOR_TOKENS[s.key]}>
              <path
                d={segs.join(" ")}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {s.values.map((v, i) => (
                <circle
                  key={i}
                  cx={xFor(i)}
                  cy={yFor(v)}
                  r={1.5}
                  fill="currentColor"
                />
              ))}
            </g>
          );
        })}
        {visibleSeries.length === 0 && (
          <line
            x1={0}
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeOpacity={0.3}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </div>
  );
});

GreeksDecayChart.displayName = "GreeksDecayChart";