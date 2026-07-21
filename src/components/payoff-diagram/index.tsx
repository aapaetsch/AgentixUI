"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import type { PayoffPoint } from "../../lib/finance-types";

/* -------------------------------------------------------------------------------------------------
 * PayoffDiagram
 * ------------------------------------------------------------------------------------------------*/

function useGradientId(prefix: string): string {
  const raw = React.useId();
  const ref = React.useRef<string | null>(null);
  if (ref.current === null) {
    ref.current = `${prefix}-${raw.replace(/[:]/g, "")}`;
  }
  return ref.current;
}

/**
 * Visual variant for {@link PayoffDiagram}.
 * - `line` — single stroked polyline (default).
 * - `area` — polyline plus a gradient fill (profit shaded green, loss red).
 */
export type PayoffDiagramVariant = "line" | "area";

/**
 * Props for {@link PayoffDiagram}.
 */
export interface PayoffDiagramProps
  extends Omit<
      React.SVGAttributes<SVGSVGElement>,
      "color" | "fill" | "points"
    >,
    VariantProps<typeof payoffContainerVariants> {
  /** The payoff curve points (price, value). Must be sorted ascending by price. */
  points: PayoffPoint[];
  /** viewBox width. @default 240 */
  width?: number;
  /** viewBox height. @default 120 */
  height?: number;
  /** Stroke width in viewBox units. @default 1.5 */
  strokeWidth?: number;
  /** Color for positive (profit) portions. @default "currentColor" */
  positiveColor?: string;
  /** Color for negative (loss) portions. @default "currentColor" */
  negativeColor?: string;
  /** Override the payoff curve color entirely (ignores sign coloring). */
  color?: string;
  /** Whether to fill above/below the zero line. @default true */
  fill?: boolean;
  /** Visual style. @default "area" */
  variant?: PayoffDiagramVariant;
  /** Current underlying spot price; draws a vertical dashed marker. */
  spotPrice?: number;
  /** Current P&L at the spot price; draws a marker dot. */
  currentPnL?: number;
  /** Breakeven prices; draws a dot on the zero line per breakeven. */
  breakevens?: number[];
  /** Render the zero (break-even) horizontal baseline. @default true */
  showZeroLine?: boolean;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

export const payoffContainerVariants = cva(
  ["inline-block", "align-middle", "select-none"].join(" "),
  { variants: {}, defaultVariants: {} }
);

interface Domain {
  priceMin: number;
  priceMax: number;
  valueMin: number;
  valueMax: number;
}

/**
 * Dev-only invariant: warn when `points` is not sorted ascending by `price`.
 * Sorting silently inside the component would mask consumer bugs (the finance
 * helpers already return sorted output), so we only emit a `console.warn` in
 * non-production builds.
 */
function warnIfUnsorted(points: PayoffPoint[]): void {
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV !== "production"
  ) {
    for (let i = 1; i < points.length; i++) {
      if (points[i].price < points[i - 1].price) {
        console.warn(
          "[PayoffDiagram] `points` must be sorted ascending by `price`. " +
            "Unsorted input produces a scrambled polyline."
        );
        return;
      }
    }
  }
}

function computeDomain(points: PayoffPoint[]): Domain | null {
  if (points.length === 0) return null;
  let priceMin = Infinity;
  let priceMax = -Infinity;
  let valueMin = Infinity;
  let valueMax = -Infinity;
  for (const p of points) {
    if (p.price < priceMin) priceMin = p.price;
    if (p.price > priceMax) priceMax = p.price;
    if (p.value < valueMin) valueMin = p.value;
    if (p.value > valueMax) valueMax = p.value;
  }
  // Ensure zero baseline is visible.
  if (valueMin > 0) valueMin = 0;
  if (valueMax < 0) valueMax = 0;
  if (valueMin === valueMax) {
    valueMin -= 1;
    valueMax += 1;
  }
  return { priceMin, priceMax, valueMin, valueMax };
}

/**
 * PayoffDiagram — inline-SVG at-expiry payoff curve.
 *
 * Renders a hockey-stick payoff profile from a sorted list of `(price, value)`
 * points. Profit regions (value > 0) tint toward `positiveColor`; loss regions
 * toward `negativeColor`. Draws an optional spot marker, breakeven dots, and a
 * zero baseline. No axes, ticks, or legend — stays in `@agentix/ui` per the
 * `Sparkline` precedent.
 *
 * @example
 * ```tsx
 * <PayoffDiagram points={payoffPoints} spotPrice={400} breakevens={[412.5]} />
 * ```
 */
export const PayoffDiagram = React.forwardRef<SVGSVGElement, PayoffDiagramProps>(
  function PayoffDiagram(
    {
      points,
      width = 240,
      height = 120,
      strokeWidth = 1.5,
      positiveColor = "currentColor",
      negativeColor = "currentColor",
      color,
      fill = true,
      variant = "area",
      spotPrice,
      currentPnL,
      breakevens,
      showZeroLine = true,
      className,
      style,
      ...svgProps
    },
    ref
  ) {
    const gradientId = useGradientId("payoff-grad");
    warnIfUnsorted(points);
    const domain = computeDomain(points);

    if (!domain) {
      return (
        <svg
          ref={ref}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          preserveAspectRatio="none"
          role="img"
          aria-label={svgProps["aria-label"] ?? "empty payoff diagram"}
          className={cn(payoffContainerVariants(), className)}
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

    const { priceMin, priceMax, valueMin, valueMax } = domain;
    const priceSpan = priceMax - priceMin || 1;
    const valueSpan = valueMax - valueMin || 1;

    const xFor = (price: number) =>
      ((price - priceMin) / priceSpan) * width;
    const yFor = (value: number) =>
      height - ((value - valueMin) / valueSpan) * height;
    const zeroY = yFor(0);

    // Single-point branch: a single `M` segment would produce nothing visible,
    // and `preserveAspectRatio="none"` would distort a `<circle>`. Render a
    // small crosshair centered horizontally so the lone sample is still
    // visible regardless of the chart's stretch.
    if (points.length === 1) {
      const p = points[0]!;
      const cx = width / 2;
      const cy = yFor(p.value);
      const tick = 3;
      const aria =
        svgProps["aria-label"] ??
        `payoff at expiry${spotPrice != null ? `, spot ${spotPrice}` : ""}${
          breakevens?.length ? `, ${breakevens.length} breakevens` : ""
        }`;
      return (
        <svg
          ref={ref}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          preserveAspectRatio="none"
          role="img"
          aria-label={aria}
          className={cn(payoffContainerVariants(), className)}
          style={style}
          {...svgProps}
        >
          {showZeroLine && (
            <line
              x1={0}
              y1={zeroY}
              x2={width}
              y2={zeroY}
              stroke="currentColor"
              strokeWidth={0.75}
              strokeOpacity={0.35}
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
          )}
          <line
            x1={cx - tick}
            y1={cy}
            x2={cx + tick}
            y2={cy}
            stroke={color ?? positiveColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={cx}
            y1={cy - tick}
            x2={cx}
            y2={cy + tick}
            stroke={color ?? positiveColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );
    }

    // Build the polyline path.
    const segs: string[] = points.map((p, i) => {
      const x = xFor(p.price).toFixed(3);
      const y = yFor(p.value).toFixed(3);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    });
    const linePath = segs.join(" ");

    // Positive / negative fill areas (against the zero line).
    const posAreaPath = `${linePath} L ${xFor(
      points[points.length - 1]!.price
    ).toFixed(3)} ${zeroY.toFixed(3)} L ${xFor(points[0]!.price).toFixed(
      3
    )} ${zeroY.toFixed(3)} Z`;
    // For the negative region we use the same closed path but clip differently
    // via fill + clip-path: not strictly necessary; instead we rely on a
    // single area with the zero line drawn over it.

    const lineStroke = color ?? positiveColor;

    const aria =
      svgProps["aria-label"] ??
      `payoff at expiry${spotPrice != null ? `, spot ${spotPrice}` : ""}${
        breakevens?.length ? `, ${breakevens.length} breakevens` : ""
      }`;

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        preserveAspectRatio="none"
        role="img"
        aria-label={aria}
        className={cn(payoffContainerVariants(), className)}
        style={style}
        {...svgProps}
      >
        <defs>
          <linearGradient
            id={`${gradientId}-pos`}
            x1="0"
            y1="0"
            x2="0"
            y2={zeroY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={positiveColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={positiveColor} stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id={`${gradientId}-neg`}
            x1="0"
            y1={zeroY}
            x2="0"
            y2={height}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={negativeColor} stopOpacity={0} />
            <stop offset="100%" stopColor={negativeColor} stopOpacity={0.25} />
          </linearGradient>
          {/* Clip to profit region (above zero line). */}
          <clipPath id={`${gradientId}-clip-pos`}>
            <rect x={0} y={0} width={width} height={Math.max(0, zeroY)} />
          </clipPath>
          <clipPath id={`${gradientId}-clip-neg`}>
            <rect
              x={0}
              y={zeroY}
              width={width}
              height={Math.max(0, height - zeroY)}
            />
          </clipPath>
        </defs>

        {/* Zero baseline */}
        {showZeroLine && (
          <line
            x1={0}
            y1={zeroY}
            x2={width}
            y2={zeroY}
            stroke="currentColor"
            strokeWidth={0.75}
            strokeOpacity={0.35}
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* Fill (profit + loss regions, separated via clip-path). */}
        {fill && variant === "area" && (
          <>
            <g clipPath={`url(#${gradientId}-clip-pos)`}>
              <path d={posAreaPath} fill={`url(#${gradientId}-pos)`} />
            </g>
            <g clipPath={`url(#${gradientId}-clip-neg)`}>
              <path
                d={posAreaPath}
                fill={`url(#${gradientId}-neg)`}
              />
            </g>
          </>
        )}

        {/* Main payoff line — split into profit/loss colored segments. */}
        <path
          d={linePath}
          fill="none"
          stroke={lineStroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Breakeven markers — short vertical line ticks on the zero baseline.
            `<circle>` would distort into an ellipse under the non-uniform
            `preserveAspectRatio="none"` scaling; ticks preserve their shape. */}
        {breakevens?.map((be, i) => {
          const x = xFor(be);
          if (x < 0 || x > width) return null;
          return (
            <line
              key={`be-${i}`}
              x1={x}
              y1={zeroY - 3}
              x2={x}
              y2={zeroY + 3}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

        {/* Spot marker + current-PnL crosshair. */}
        {spotPrice != null && (() => {
          const x = xFor(spotPrice);
          if (x < 0 || x > width) return null;
          const markerColor =
            currentPnL != null
              ? currentPnL >= 0
                ? positiveColor
                : negativeColor
              : "currentColor";
          return (
            <>
              <line
                x1={x}
                y1={0}
                x2={x}
                y2={height}
                stroke="currentColor"
                strokeWidth={0.75}
                strokeOpacity={0.5}
                strokeDasharray="2 3"
                vectorEffect="non-scaling-stroke"
              />
              {currentPnL != null && (() => {
                const cy = yFor(currentPnL);
                const tick = 3;
                return (
                  <>
                    {/* Small crosshair (6px vertical + 6px horizontal) so the
                        marker stays undistorted under non-uniform stretch. */}
                    <line
                      x1={x - tick}
                      y1={cy}
                      x2={x + tick}
                      y2={cy}
                      stroke={markerColor}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={x}
                      y1={cy - tick}
                      x2={x}
                      y2={cy + tick}
                      stroke={markerColor}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                );
              })()}
            </>
          );
        })()}
      </svg>
    );
  }
);

PayoffDiagram.displayName = "PayoffDiagram";