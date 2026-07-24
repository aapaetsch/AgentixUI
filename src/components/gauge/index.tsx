"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { formatPercent, formatNumber } from "../../lib/number-utils";

// ============================================================================
// Types
// ============================================================================

/**
 * Gauge variant — determines the arc sweep used by the dial.
 *
 * - `"full"`: a 270° dial arc (classic automotive gauge).
 * - `"semicircle"`: a 180° arc laid out as a half circle.
 */
export type GaugeVariant = "full" | "semicircle";

/**
 * Gauge size — drives the SVG viewBox dimension (px).
 *
 * - `"sm"`: 80
 * - `"md"`: 120
 * - `"lg"`: 160
 */
export type GaugeSize = "sm" | "md" | "lg";

/**
 * A threshold zone rendered on the gauge track.
 *
 * `value` is the boundary where the zone ends (in the same units as `value`).
 * `color` is any valid CSS color string (e.g. `"#22c55e"`, `"hsl(var(--positive))"`).
 */
export interface GaugeThreshold {
  /** Boundary value (same units as `value`) at which this zone ends. */
  value: number;
  /** CSS color string used to render this zone on the track arc. */
  color: string;
}

// ============================================================================
// Props
// ============================================================================

export interface GaugeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof gaugeVariants> {
  /** Current value of the gauge. */
  value: number;
  /** Minimum value. @default 0 */
  min?: number;
  /** Maximum value. @default 100 */
  max?: number;
  /** Arc sweep type. @default "full" */
  variant?: GaugeVariant;
  /** Optional threshold zones rendered on the track. */
  thresholds?: GaugeThreshold[];
  /** CSS color used for the active arc and needle. @default "currentColor" */
  color?: string;
  /** Track (background arc) color. @default "hsl(var(--muted))" */
  trackColor?: string;
  /** Centered label. Omit to auto-format `value` based on `valueFormat`. */
  label?: React.ReactNode;
  /** How to format the auto-generated label. @default "number" */
  valueFormat?: "number" | "percent";
  /** Animate the needle to its new position on value change. @default true */
  animate?: boolean;
  /** Needle length as a fraction of the radius (0–1). @default 0.78 */
  needleLength?: number;
  /** Stroke width of the arc. @default 8 */
  strokeWidth?: number;
}

// ============================================================================
// Variants
// ============================================================================

export const gaugeVariants = cva(
  "inline-flex flex-col items-center justify-center text-foreground",
  {
    variants: {
      size: {
        sm: "text-[0.625rem] gap-0.5",
        md: "text-sm gap-1",
        lg: "text-base gap-1.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const GAUGE_VIEWBOX: Record<NonNullable<GaugeSize>, number> = {
  sm: 80,
  md: 120,
  lg: 160,
};

const LABEL_SIZE_CLASS: Record<NonNullable<GaugeSize>, string> = {
  sm: "text-[0.625rem]",
  md: "text-sm",
  lg: "text-base",
};

const VALUE_SIZE_CLASS: Record<NonNullable<GaugeSize>, string> = {
  sm: "text-base font-semibold",
  md: "text-2xl font-semibold",
  lg: "text-3xl font-semibold",
};

// ============================================================================
// Geometry helpers
// ============================================================================

/**
 * Convert polar coordinates (angle in degrees from 12 o'clock, clockwise) to
 * cartesian coordinates on a circle of radius `r` centered at `(cx, cy)`.
 */
function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/**
 * Describe an SVG arc path between two angles.
 *
 * @param cx - center x
 * @param cy - center y
 * @param r - radius
 * @param startAngle - start angle in degrees (0 = top, clockwise)
 * @param endAngle - end angle in degrees
 */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  // NOTE: variable names are inverted relative to the angle parameters — this
  // is intentional. The arc is drawn from `endAngle` back to `startAngle`
  // (sweep-flag = 0 in our coordinate system), so the SVG `M` (move-to) point
  // is the endpoint located at `endAngle`, and the `A` (arc-to) point is the
  // start located at `startAngle`. Don't "fix" the names without updating the
  // sweep flag.
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  // sweep-flag = 0 draws clockwise in SVG's coordinate system where y grows down,
  // which matches our polar mapping.
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

interface ArcConfig {
  /** Angle (degrees, 0 = top, clockwise) at which the arc starts. */
  startAngle: number;
  /** Angle (degrees) at which the arc ends. */
  endAngle: number;
  /** SVG viewBox string. */
  viewBox: string;
  /** Center x. */
  cx: number;
  /** Center y. */
  cy: number;
  /** Arc radius. */
  r: number;
}

function getArcConfig(variant: GaugeVariant, size: number): ArcConfig {
  const padding = 12;
  const cx = size / 2;
  const r = size / 2 - padding;
  if (variant === "semicircle") {
    // 180° arc starting at the left (9 o'clock = 270° in our clockwise-from-top
    // convention) sweeping clockwise to the right (3 o'clock = 90°).
    return {
      startAngle: 270,
      endAngle: 90 + 360, // sweep through 360° from 270° → 450°
      viewBox: `0 0 ${size} ${size / 2 + padding}`,
      cx,
      cy: size / 2,
      r,
    };
  }
  // full → 270° dial. Start at 225° (bottom-left), sweep clockwise to 135°
  // (bottom-right), passing through 0° (top). In our convention this is the
  // range 225° → 135° going clockwise = 225° → 495°.
  return {
    startAngle: 225,
    endAngle: 135 + 360,
    viewBox: `0 0 ${size} ${size}`,
    cx,
    cy: size / 2,
    r,
  };
}

/**
 * Map a value within [min, max] to an angle within the arc's sweep range.
 */
function valueToAngle(
  value: number,
  min: number,
  max: number,
  arc: ArcConfig
): number {
  const clamped = Math.min(max, Math.max(min, value));
  const t = (clamped - min) / (max - min || 1);
  return arc.startAngle + t * (arc.endAngle - arc.startAngle);
}

/**
 * Clamp angles to the arc's valid range. SVG arc rendering breaks when start
 * and end angles coincide exactly, so we nudge the floor by a tiny epsilon.
 */
function clampAngle(angle: number, arc: ArcConfig): number {
  const eps = 0.01;
  return Math.min(arc.endAngle - eps, Math.max(arc.startAngle + eps, angle));
}

// ============================================================================
// Component
// ============================================================================

interface ArcSegment {
  color: string;
  startAngle: number;
  endAngle: number;
}

function buildThresholdSegments(
  thresholds: GaugeThreshold[] | undefined,
  min: number,
  max: number,
  arc: ArcConfig,
  trackColor: string
): ArcSegment[] {
  if (!thresholds || thresholds.length === 0) return [];
  // Sort thresholds by value ascending, then build segments between min and each
  // boundary, ending at max.
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);
  const segments: ArcSegment[] = [];
  let lo = min;
  for (const t of sorted) {
    const hi = Math.min(max, Math.max(min, t.value));
    segments.push({
      color: t.color,
      startAngle: clampAngle(valueToAngle(lo, min, max, arc), arc),
      endAngle: clampAngle(valueToAngle(hi, min, max, arc), arc),
    });
    lo = hi;
  }
  // If the last boundary didn't reach max, append a final segment using
  // `trackColor` rather than the last threshold's color. Previously this used
  // the last threshold's color, which was counter-intuitive — users expecting
  // "below 50 green, above 50 default" got the upper region in green instead
  // of the track color.
  if (lo < max) {
    segments.push({
      color: trackColor,
      startAngle: clampAngle(valueToAngle(lo, min, max, arc), arc),
      endAngle: clampAngle(valueToAngle(max, min, max, arc), arc),
    });
  }
  return segments;
}

/**
 * Gauge — a radial dial indicator with an arc track, optional threshold zones,
 * and an animated needle.
 *
 * The component renders pure inline SVG (no charting dependencies) inside a
 * responsive `<div>` wrapper so a centered label works alongside the dial.
 *
 * @example
 * ```tsx
 * <Gauge value={72} />
 * <Gauge value={72} variant="semicircle" color="hsl(var(--positive))" />
 * <Gauge
 *   value={45}
 *   variant="full"
 *   thresholds={[
 *     { value: 30, color: "#ef4444" },
 *     { value: 70, color: "#f59e0b" },
 *     { value: 100, color: "#22c55e" },
 *   ]}
 * />
 * ```
 */
export const Gauge = React.forwardRef<HTMLDivElement, GaugeProps>(
  (
    {
      className,
      size = "md",
      value,
      min = 0,
      max = 100,
      variant = "full",
      thresholds,
      color = "currentColor",
      trackColor = "hsl(var(--muted))",
      label,
      valueFormat = "number",
      animate = true,
      needleLength = 0.78,
      strokeWidth = 8,
      ...rest
    },
    ref
  ) => {
    const viewSize = GAUGE_VIEWBOX[size ?? "md"];

    // Clamp the incoming value so we never render outside the dial.
    const clampedValue = Math.min(max, Math.max(min, value));

    // Animate the displayed value using a CSS-free rAF tween. We avoid the
    // shared `useAnimatedProgress` hook here because it loops by default and
    // we only want a one-shot tween to the new target.
    const [displayValue, setDisplayValue] = React.useState(clampedValue);
    const fromRef = React.useRef(clampedValue);
    const rafRef = React.useRef<number | null>(null);

    React.useEffect(() => {
      if (!animate) {
        setDisplayValue(clampedValue);
        fromRef.current = clampedValue;
        return;
      }
      const from = fromRef.current;
      const to = clampedValue;
      if (from === to) return;
      const duration = 400;
      const start = performance.now();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplayValue(from + (to - from) * eased);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          fromRef.current = to;
        }
      };
      rafRef.current = requestAnimationFrame(tick);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [clampedValue, animate]);

    const arc = React.useMemo(
      () => getArcConfig(variant, viewSize),
      [variant, viewSize]
    );

    const activeAngle = valueToAngle(displayValue, min, max, arc);
    const needleAngle = activeAngle;

    const zoneSegments = React.useMemo(
      () => buildThresholdSegments(thresholds, min, max, arc, trackColor),
      [thresholds, min, max, arc, trackColor]
    );

    const defaultLabel = React.useMemo(() => {
      if (label) return label;
      if (valueFormat === "percent") {
        const pct = ((displayValue - min) / (max - min || 1)) * 100;
        return formatPercent(pct, { precision: 0 });
      }
      return formatNumber(displayValue, { precision: 2 });
    }, [label, valueFormat, displayValue, min, max]);

    const needleLen = arc.r * needleLength;
    const needleTip = polarToCartesian(arc.cx, arc.cy, needleLen, needleAngle);

    // Strokes are drawn visually; we round-cap active arc to match the dial
    // aesthetic used elsewhere in the kit.
    const sharedArcProps = {
      fill: "none",
      strokeWidth,
      strokeLinecap: "round" as const,
      vectorEffect: "non-scaling-stroke" as const,
    };

    return (
      <div
        ref={ref}
        className={cn(gaugeVariants({ size }), className)}
        role="meter"
        aria-valuenow={clampedValue}
        aria-valuemin={min}
        aria-valuemax={max}
        {...rest}
      >
        <svg
          viewBox={arc.viewBox}
          className={cn("w-full", LABEL_SIZE_CLASS[size ?? "md"])}
          style={{ maxWidth: viewSize, height: "auto", color }}
        >
          {/* Track */}
          <path
            d={describeArc(arc.cx, arc.cy, arc.r, arc.startAngle, arc.endAngle)}
            stroke={trackColor}
            {...sharedArcProps}
          />
          {/* Threshold zones */}
          {zoneSegments.map((seg, i) => (
            <path
              key={i}
              d={describeArc(arc.cx, arc.cy, arc.r, seg.startAngle, seg.endAngle)}
              stroke={seg.color}
              {...sharedArcProps}
            />
          ))}
          {/* Active value arc */}
          <path
            d={describeArc(arc.cx, arc.cy, arc.r, arc.startAngle, clampAngle(activeAngle, arc))}
            stroke={color}
            {...sharedArcProps}
          />
          {/* Needle */}
          <line
            x1={arc.cx}
            y1={arc.cy}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke={color}
            strokeWidth={strokeWidth / 3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx={arc.cx} cy={arc.cy} r={strokeWidth / 2} fill={color} />
        </svg>
        <div className={cn("flex flex-col items-center leading-none", LABEL_SIZE_CLASS[size ?? "md"])}>
          <span className={VALUE_SIZE_CLASS[size ?? "md"]}>{defaultLabel}</span>
        </div>
      </div>
    );
  }
);

Gauge.displayName = "Gauge";