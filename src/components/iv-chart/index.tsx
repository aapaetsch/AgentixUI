"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------------------------------
 * IVChart
 * ------------------------------------------------------------------------------------------------*/

export type IVChartVariant = "term" | "surface";

/**
 * Term-structure datapoint: IV for a single expiry.
 */
export interface IVTermPoint {
  /** Expiration in epoch milliseconds. */
  expiry: number;
  /** Implied volatility as a percentage (e.g. `23.4` = 23.4%). */
  iv: number;
}

/**
 * A single cell of the IV surface: strike × expiry → IV.
 */
export interface IVSurfaceCell {
  strike: number;
  /** Expiration in epoch milliseconds. */
  expiry: number;
  /** Implied volatility as a percentage. */
  iv: number;
}

/**
 * Props for {@link IVChart}.
 */
export interface IVChartProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "color">,
    VariantProps<typeof ivChartContainerVariants> {
  /** Visual variant. @default "term" */
  variant?: IVChartVariant;
  /** Required when `variant="term"`: per-expiry IV points (any sort order). */
  term?: IVTermPoint[];
  /** Required when `variant="surface"`: flat list of strike×expiry IV cells. */
  surface?: IVSurfaceCell[];
  /** viewBox width. @default 200 */
  width?: number;
  /** viewBox height. @default 80 */
  height?: number;
  /** Stroke width (term variant only). @default 1.5 */
  strokeWidth?: number;
  /** Divergent color thresholds (IV %). Default: symmetric around 30%. */
  colorStops?: { below: string; mid: string; above: string };
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

export const ivChartContainerVariants = cva(
  ["inline-block", "align-middle", "select-none"].join(" "),
  { variants: {}, defaultVariants: {} }
);

const DEFAULT_STOPS = {
  below: "text-negative",
  mid: "text-muted-foreground",
  above: "text-positive",
};

/**
 * IVChart — inline-SVG implied-volatility micro visualizations.
 *
 * - `variant="term"` — single polyline plotting IV per expiry (`Sparkline`-like).
 * - `variant="surface"` — small divergent-color cell grid (strike × expiry)
 *   sized to fit ≤ ~100 cells, staying within `aapaetsch-ui-kit` per the roadmap
 *   allowance for decorative heatmaps.
 *
 * No axes, ticks, crosshair, or legend — full versions remain planned for
 * `@agentix/charts`.
 *
 * @example
 * ```tsx
 * <IVChart variant="term" term={termPoints} />
 * <IVChart variant="surface" surface={cells} />
 * ```
 */
export const IVChart = React.forwardRef<SVGSVGElement, IVChartProps>(
  function IVChart(
    {
      variant = "term",
      term = [],
      surface = [],
      width = 200,
      height = 80,
      strokeWidth = 1.5,
      colorStops = DEFAULT_STOPS,
      className,
      style,
      ...svgProps
    },
    ref
  ) {
    if (variant === "term") {
      const pts = [...term].sort((a, b) => a.expiry - b.expiry);
      if (pts.length === 0) {
        return (
          <svg
            ref={ref}
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            preserveAspectRatio="none"
            role="img"
            aria-label={svgProps["aria-label"] ?? "empty IV term structure"}
            className={cn(ivChartContainerVariants(), className)}
            style={style}
            {...svgProps}
          >
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
          </svg>
        );
      }

      let ivMin = Infinity;
      let ivMax = -Infinity;
      for (const p of pts) {
        if (p.iv < ivMin) ivMin = p.iv;
        if (p.iv > ivMax) ivMax = p.iv;
      }
      if (ivMin === ivMax) {
        ivMin -= 1;
        ivMax += 1;
      }
      const span = ivMax - ivMin;
      const xFor = (i: number) =>
        pts.length <= 1 ? width / 2 : (i / (pts.length - 1)) * width;
      const yFor = (v: number) =>
        height - ((v - ivMin) / span) * height;

      const segs = pts.map((p, i) => {
        const x = xFor(i).toFixed(3);
        const y = yFor(p.iv).toFixed(3);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      });

      const termLabel = `IV term structure over ${pts.length} ${
        pts.length === 1 ? "expiry" : "expiries"
      }`;

      return (
        <svg
          ref={ref}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          preserveAspectRatio="none"
          role="img"
          aria-label={svgProps["aria-label"] ?? termLabel}
          className={cn(ivChartContainerVariants(), className)}
          style={style}
          {...svgProps}
        >
          <path
            d={segs.join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={xFor(i)}
              cy={yFor(p.iv)}
              r={1.5}
              fill="currentColor"
            />
          ))}
        </svg>
      );
    }

    // -------- Surface variant --------

    // Dev-only, one-time warning when the documented ≤ ~100-cell soft limit
    // is exceeded. `console.warn` only — never throw or truncate — so very
    // large surfaces still render (just slower) instead of crashing.
    if (
      typeof console !== "undefined" &&
      console.warn &&
      surface.length > 100
    ) {
      console.warn(
        `[IVChart] surface has ${surface.length} cells; the documented soft limit is ~100. ` +
          `Rendering will still work but may be slow. For full IV surfaces, use @agentix/charts.`
      );
    }

    if (surface.length === 0) {
      return (
        <svg
          ref={ref}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          preserveAspectRatio="none"
          role="img"
          aria-label={svgProps["aria-label"] ?? "empty IV surface"}
          className={cn(ivChartContainerVariants(), className)}
          style={style}
          {...svgProps}
        >
          <line
            x1={0}
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke="currentColor"
            strokeWidth={1}
            strokeOpacity={0.3}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );
    }

    const strikes = Array.from(
      new Set(surface.map((c) => c.strike))
    ).sort((a, b) => a - b);
    const expiries = Array.from(
      new Set(surface.map((c) => c.expiry))
    ).sort((a, b) => a - b);
    const cols = strikes.length;
    const rows = expiries.length;
    const cellW = width / cols;
    const cellH = height / rows;

    let ivMin = Infinity;
    let ivMax = -Infinity;
    for (const c of surface) {
      if (c.iv < ivMin) ivMin = c.iv;
      if (c.iv > ivMax) ivMax = c.iv;
    }
    if (ivMin === ivMax) {
      ivMin -= 1;
      ivMax += 1;
    }
    const mid = (ivMin + ivMax) / 2;
    // Per-side half-range: use the half-range the value actually falls into so
    // the divergent opacity is symmetric around `mid` (a value at ivMax is
    // fully saturated on the high side, a value at ivMin is fully saturated on
    // the low side) — instead of normalizing both sides by the *larger*
    // half-range, which mutes the shorter side.
    const halfRangeBelow = mid - ivMin;
    const halfRangeAbove = ivMax - mid;

    // Cells whose IV is within this fraction of the relevant half-range from
    // `mid` get the `colorStops.mid` tone. ~10% keeps it to the immediate
    // neighborhood of mid so the "neutral" band is thin and meaningful.
    const MID_TOLERANCE = 0.1;

    const strikeIdx = new Map(strikes.map((s, i) => [s, i]));
    const expiryIdx = new Map(expiries.map((e, i) => [e, i]));

    // Stable, descriptive per-instance label with real grid dimensions.
    const surfaceLabel = `IV surface, ${cols} ${
      cols === 1 ? "strike" : "strikes"
    } \u00D7 ${rows} ${rows === 1 ? "expiry" : "expiries"}`;

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        preserveAspectRatio="none"
        role="img"
        aria-label={svgProps["aria-label"] ?? surfaceLabel}
        className={cn(ivChartContainerVariants(), className)}
        style={style}
        {...svgProps}
      >
        {surface.map((c, i) => {
          const xi = strikeIdx.get(c.strike)!;
          const yi = expiryIdx.get(c.expiry)!;
          const above = c.iv >= mid;
          // Use the half-range on the side the value falls into. Guard with a
          // tiny epsilon to avoid divide-by-zero for perfectly symmetric data
          // after the ivMin===ivMax pad above (which guarantees non-zero, but
          // be defensive).
          const halfRange = above ? halfRangeAbove : halfRangeBelow;
          const norm = Math.abs(c.iv - mid) / Math.max(halfRange, 0.0001);
          const opacity = Math.max(0.15, Math.min(1, norm));
          // Cells very close to mid use the `mid` tone — this both removes the
          // "dead" `colorStops.mid` token and gives a small neutral band that
          // reads as "near the median IV".
          const nearMid = norm <= MID_TOLERANCE;
          const tone = nearMid
            ? colorStops.mid
            : above
              ? colorStops.above
              : colorStops.below;
          return (
            <rect
              key={i}
              x={xi * cellW}
              y={yi * cellH}
              width={cellW + 0.5}
              height={cellH + 0.5}
              className={cn(tone, "opacity-100")}
              style={{ opacity }}
              fill="currentColor"
            />
          );
        })}
        {/* Grid lines for legibility. */}
        {strikes.map((s, i) => (
          <line
            key={`v-${i}`}
            x1={i * cellW}
            y1={0}
            x2={i * cellW}
            y2={height}
            stroke="currentColor"
            strokeWidth={0.25}
            strokeOpacity={0.2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {expiries.map((e, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * cellH}
            x2={width}
            y2={i * cellH}
            stroke="currentColor"
            strokeWidth={0.25}
            strokeOpacity={0.2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    );
  }
);

IVChart.displayName = "IVChart";