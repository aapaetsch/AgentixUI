"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------------------------------
 * MiniBars
 * ------------------------------------------------------------------------------------------------*/

/**
 * Props for the {@link MiniBars} inline SVG histogram primitive.
 */
export interface MiniBarsProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "color">,
    VariantProps<typeof miniBarsContainerVariants> {
  /** The numeric series to visualize as vertical bars. Length 1..N. */
  data: number[];
  /** viewBox width. @default 100 */
  width?: number;
  /** viewBox height. @default 16 */
  height?: number;
  /** Gap between bars, in viewBox units. @default 2 */
  gap?: number;
  /**
   * Default bar color. Any CSS color is accepted. Use `currentColor` (the
   * default) to inherit a Tailwind text color class applied to an ancestor.
   * Ignored when both `positiveColor` and `negativeColor` are provided.
   * @default "currentColor"
   */
  color?: string;
  /**
   * Optional positive bar color. When both `positiveColor` and
   * `negativeColor` are provided, bars at or above 0 use `positiveColor` and
   * bars below 0 use `negativeColor`.
   */
  positiveColor?: string;
  /** Optional negative bar color. See {@link MiniBarsProps.positiveColor}. */
  negativeColor?: string;
  /**
   * Explicit domain minimum. When omitted it is derived from `data`.
   * Supports divergent bars (min<0, max>0) with the zero line drawn
   * proportionally between them.
   */
  min?: number;
  /** Explicit domain maximum. See {@link MiniBarsProps.min}. */
  max?: number;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

export const miniBarsContainerVariants = cva(
  ["inline-block", "align-middle", "select-none"].join(" "),
  {
    variants: {},
    defaultVariants: {},
  }
);

/** Compute the [min, max] domain, allowing a zero line in the middle. */
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
    hi = 0;
  }
  // If all values are non-negative, anchor min to 0 unless the user says otherwise.
  // If all values are non-positive, anchor max to 0 unless the user says otherwise.
  if (lo > 0) lo = 0;
  if (hi < 0) hi = 0;

  let min = explicitMin ?? lo;
  let max = explicitMax ?? hi;
  if (min === max) {
    // Pure-flat (all zeros) or coincident explicit bounds: give a hair of span.
    min = Math.min(min, 0) - 1;
    max = Math.max(max, 0) + 1;
  }
  if (min > max) {
    const t = min;
    min = max;
    max = t;
  }
  return { min, max };
}

/**
 * MiniBars - a tiny one-row SVG histogram.
 *
 * Renders a single `<svg>` containing vertical bars across the width with a
 * proportional zero line — useful for compact trade-flow / delta readouts.
 * Supports divergent bars (positive values extend up from the zero line,
 * negative values hang down) when `positiveColor` and `negativeColor` are
 * both supplied.
 *
 * @example
 * ```tsx
 * <MiniBars data={[1, -2, 3, -1, 2]} positiveColor="#22c55e" negativeColor="#ef4444" />
 * ```
 */
export const MiniBars = React.forwardRef<SVGSVGElement, MiniBarsProps>(
  function MiniBars(
    {
      data,
      width = 100,
      height = 16,
      gap = 2,
      color = "currentColor",
      positiveColor,
      negativeColor,
      min,
      max,
      className,
      style,
      ...svgProps
    },
    ref
  ) {
    const points = data ?? [];
    const total = points.length;

    const { min: domainMin, max: domainMax } = computeDomain(points, min, max);
    const span = domainMax - domainMin || 1;

    // Position of the zero line, as a fraction from the top (0..1).
    const zeroFrac = (0 - domainMin) / span;
    const zeroY = height * (1 - zeroFrac);

    // Pixels per unit-of-value.
    const scale = height / span;

    // Bar geometry.
    const slot = total > 0 ? width / total : width;
    const barWidth = Math.max(slot - gap, 0.5);

    const divergent =
      positiveColor !== undefined && negativeColor !== undefined;

    const bars: { x: number; y: number; h: number; fill: string }[] = [];
    for (let i = 0; i < total; i++) {
      const v = points[i]!;
      const x = i * slot + (slot - barWidth) / 2;
      const valueHeight = Math.abs(v) * scale;
      if (v >= 0) {
        bars.push({
          x,
          y: zeroY - valueHeight,
          h: Math.max(valueHeight, 0.5),
          fill: divergent ? (positiveColor as string) : color,
        });
      } else {
        bars.push({
          x,
          y: zeroY,
          h: Math.max(valueHeight, 0.5),
          fill: divergent ? (negativeColor as string) : color,
        });
      }
    }

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        preserveAspectRatio="none"
        role="img"
        aria-label={svgProps["aria-label"] ?? "histogram"}
        className={cn(miniBarsContainerVariants(), className)}
        style={{ width, height, ...style }}
        {...svgProps}
      >
        {bars.map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={bar.y}
            width={barWidth}
            height={bar.h}
            fill={bar.fill}
            rx={Math.min(1, barWidth / 4)}
          />
        ))}
        {total === 0 && (
          <line
            x1={0}
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke={color}
            strokeWidth={1}
            strokeOpacity={0.4}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    );
  }
);

MiniBars.displayName = "MiniBars";