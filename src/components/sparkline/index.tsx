"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------------------------------
 * Sparkline
 * ------------------------------------------------------------------------------------------------*/

/**
 * Visual variant for the {@link Sparkline} component.
 *
 * - `line` renders a single stroked polyline.
 * - `area` renders the line plus a translucent gradient fill beneath it.
 * - `bar` renders vertical bars spaced across the width.
 */
export type SparklineVariant = "line" | "bar" | "area";

/**
 * Props for the {@link Sparkline} inline SVG primitive.
 */
export interface SparklineProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "color" | "fill">,
    VariantProps<typeof sparklineContainerVariants> {
  /** The numeric series to visualize. Must contain at least one value. */
  data: number[];
  /** viewBox width. Rendered element is sized via the `width`/`height` attributes. @default 100 */
  width?: number;
  /** viewBox height. @default 30 */
  height?: number;
  /** Stroke width (in viewBox units) for the line/area variants. @default 1.5 */
  strokeWidth?: number;
  /**
   * Stroke / bar color. Any CSS color is accepted. Use `currentColor` (the
   * default) to inherit a Tailwind text color class applied to an ancestor.
   * @default "currentColor"
   */
  color?: string;
  /**
   * When true, render an area fill beneath the line. Equivalent to setting
   * `variant="area"`. Ignored when `variant="bar"`.
   * @default false
   */
  fill?: boolean;
  /** Sparkline visual style. @default "line" */
  variant?: SparklineVariant;
  /**
   * Explicit domain minimum. When omitted it is derived from `data` (slightly
   * padded when the data is flat to avoid a zero-height chart).
   */
  min?: number;
  /** Explicit domain maximum. See {@link SparklineProps.min}. */
  max?: number;
  /**
   * Optional sibling spacing (in px) used when the sparkline is composed
   * inside a parent like `StatTile`. Does not affect the SVG path.
   * @default 0
   */
  gap?: number;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

export const sparklineContainerVariants = cva(
  ["inline-block", "align-middle", "select-none"].join(" "),
  {
    variants: {},
    defaultVariants: {},
  }
);

/** Generate a stable gradient id per component instance. */
function useGradientId(prefix: string): string {
  const idRef = React.useRef<string | null>(null);
  if (idRef.current === null) {
    idRef.current = `${prefix}-${React.useId().replace(/[:]/g, "")}`;
  }
  return idRef.current;
}

/**
 * Compute the [min, max] domain for a series, applying a small symmetric pad
 * when the data is flat so the rendered line is not a zero-height slice.
 */
function computeDomain(
  data: number[],
  explicitMin: number | undefined,
  explicitMax: number | undefined
): { min: number; max: number } {
  let lo = Infinity;
  let hi = -Infinity;
  for (const v of data) {
    if (Number.isFinite(v)) {
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
  }
  if (!Number.isFinite(lo)) {
    lo = 0;
    hi = 1;
  }
  if (lo === hi) {
    const pad = Math.abs(lo) * 0.1 || 1;
    lo -= pad;
    hi += pad;
  }
  let min = explicitMin ?? lo;
  let max = explicitMax ?? hi;
  if (min === max) {
    min -= 1;
    max += 1;
  }
  if (min > max) {
    return { min: max, max: min };
  }
  return { min, max };
}

/**
 * Sparkline - a tiny inline SVG line/area/bar chart.
 *
 * Renders a single `<svg>` (no axes, scales, tooltips or legend) suitable for
 * embedding inside tiles, table cells or inline next to a numeric label.
 * Designed to be drop-in compatible with the `sparklineRenderSlot` prop of
 * `StatTile`.
 *
 * The element is `inline-block` and sized via the `width`/`height` props on
 * the `<svg>` element so it can be controlled with Tailwind `w-*`/`h-*`
 * classes when desired. The viewBox uses the provided `width`/`height` and
 * `preserveAspectRatio="none"` so the chart stretches to fill its box.
 *
 * @example
 * ```tsx
 * <Sparkline data={[1, 2, 3, 2, 4]} />
 *
 * // Inherit color from a Tailwind text utility:
 * <span className="text-positive">
 *   <Sparkline data={[1, 2, 3]} fill />
 * </span>
 * ```
 */
export const Sparkline = React.forwardRef<SVGSVGElement, SparklineProps>(
  function Sparkline(
    {
      data,
      width = 100,
      height = 30,
      strokeWidth = 1.5,
      color = "currentColor",
      fill = false,
      variant = "line",
      min,
      max,
      gap = 0,
      className,
      style,
      ...svgProps
    },
    ref
  ) {
    const gradientId = useGradientId("sparkline-grad");
    const resolvedVariant: SparklineVariant =
      variant === "bar" ? "bar" : variant === "area" ? "area" : fill ? "area" : "line";

    const points = data ?? [];

    const { min: domainMin, max: domainMax } = computeDomain(points, min, max);
    const span = domainMax - domainMin || 1;

    const normalize = (v: number) => {
      if (!Number.isFinite(v)) return 0.5;
      const t = (v - domainMin) / span;
      return Math.min(1, Math.max(0, t));
    };

    const renderEmpty = points.length === 0;
    const renderSingle = points.length === 1;

    // Evenly spaced x positions across [0, width]. Single point is centered.
    const xFor = (i: number, total: number) =>
      total <= 1 ? width / 2 : (i / (total - 1)) * width;

    // ---- Line path ----
    let linePath = "";
    if (!renderEmpty) {
      if (renderSingle) {
        const y = height - normalize(points[0]!) * height;
        linePath = `M 0 ${y.toFixed(3)} L ${width} ${y.toFixed(3)}`;
      } else {
        const segs: string[] = [];
        for (let i = 0; i < points.length; i++) {
          const x = xFor(i, points.length);
          const y = height - normalize(points[i]!) * height;
          segs.push(`${i === 0 ? "M" : "L"} ${x.toFixed(3)} ${y.toFixed(3)}`);
        }
        linePath = segs.join(" ");
      }
    }

    // ---- Area path ----
    let areaPath = "";
    if (!renderEmpty && resolvedVariant === "area") {
      if (renderSingle) {
        const y = height - normalize(points[0]!) * height;
        areaPath = `M 0 ${height} L 0 ${y.toFixed(3)} L ${width} ${y.toFixed(3)} L ${width} ${height} Z`;
      } else {
        const top: string[] = [];
        for (let i = 0; i < points.length; i++) {
          const x = xFor(i, points.length);
          const y = height - normalize(points[i]!) * height;
          top.push(`${i === 0 ? "M" : "L"} ${x.toFixed(3)} ${y.toFixed(3)}`);
        }
        const lastX = xFor(points.length - 1, points.length);
        areaPath = `${top.join(" ")} L ${lastX.toFixed(3)} ${height} L 0 ${height} Z`;
      }
    }

    // ---- Bars ----
    const bars: { x: number; y: number; w: number; h: number }[] = [];
    if (resolvedVariant === "bar" && !renderEmpty) {
      const total = points.length;
      const slot = width / total;
      const barWidth = slot * 0.9; // 10% gap between bars.
      const inset = slot * 0.1;
      for (let i = 0; i < total; i++) {
        const v = points[i]!;
        const x = i * slot + inset / 2;
        const h = Math.max(normalize(v) * height, 0.5);
        const y = height - h;
        bars.push({ x, y, w: barWidth, h });
      }
    }

    const containerStyle: React.CSSProperties = {
      width,
      height,
      marginRight: gap > 0 ? gap : undefined,
      ...style,
    };

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        preserveAspectRatio="none"
        role="img"
        aria-label={svgProps["aria-label"] ?? "sparkline"}
        className={cn(sparklineContainerVariants(), className)}
        style={containerStyle}
        {...svgProps}
      >
        {resolvedVariant !== "bar" && !renderEmpty && (
          <>
            {resolvedVariant === "area" && areaPath && (
              <>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
              </>
            )}
            <path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}

        {resolvedVariant === "bar" &&
          bars.map((bar, i) => (
            <rect
              key={i}
              x={bar.x}
              y={bar.y}
              width={bar.w}
              height={bar.h}
              fill={color}
              rx={Math.min(1.5, bar.w / 4)}
            />
          ))}

        {renderEmpty && (
          <line
            x1={0}
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeOpacity={0.4}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    );
  }
);

Sparkline.displayName = "Sparkline";