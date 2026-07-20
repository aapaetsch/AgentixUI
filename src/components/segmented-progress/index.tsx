"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { formatNumber } from "../../lib/number-utils";
import { resolveToken } from "../../lib/color-utils";

// ============================================================================
// Types
// ============================================================================

/**
 * A single segment of a {@link SegmentedProgress} bar.
 */
export interface Segment {
  /** Magnitude of this segment. Proportions are computed against the total. */
  value: number;
  /** Optional explicit CSS color for this segment. */
  color?: string;
  /** Optional label shown when `showValues` is enabled. */
  label?: string;
}

export interface SegmentedProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof segmentedProgressVariants> {
  /** The segments to render. */
  segments: Segment[];
  /** Bar orientation. @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Bar thickness. @default "sm" */
  size?: "xs" | "sm" | "md";
  /** Round the outer corners of the bar. @default true */
  rounded?: boolean;
  /** Show per-segment value labels stacked beside the bar. @default false */
  showValues?: boolean;
  /**
   * Optional total override. Defaults to the sum of segment values. When
   * greater than the sum, an empty muted remainder is rendered at the end.
   */
  max?: number;
  /** Gap (px) between segments. @default 0 */
  gap?: number;
}

// ============================================================================
// Variants
// ============================================================================

export const segmentedProgressVariants = cva(
  "relative flex overflow-hidden bg-secondary/40",
  {
    variants: {
      orientation: {
        horizontal: "w-full items-stretch",
        vertical: "h-full w-full justify-stretch flex-col",
      },
      size: {
        xs: "",
        sm: "",
        md: "",
      },
      rounded: {
        true: "rounded-full",
        false: "rounded-none",
      },
    },
    compoundVariants: [
      { orientation: "horizontal", size: "xs", className: "h-1" },
      { orientation: "horizontal", size: "sm", className: "h-2" },
      { orientation: "horizontal", size: "md", className: "h-3" },
      { orientation: "vertical", size: "xs", className: "w-1" },
      { orientation: "vertical", size: "sm", className: "w-2" },
      { orientation: "vertical", size: "md", className: "w-3" },
    ],
    defaultVariants: {
      orientation: "horizontal",
      size: "sm",
      rounded: true,
    },
  }
);

// ============================================================================
// Palette
// ============================================================================

/**
 * Resolve the default rotating chart palette from `globals.css`.
 *
 * `globals.css` defines `--chart-1` … `--chart-5` as raw `H S% L%` triples.
 * We resolve each one and wrap it in `hsl(...)`. If the token is missing
 * (e.g. SSR before paint, or a custom theme without the tokens), we fall back
 * to `currentColor` so consumers can still colorize via a parent text color.
 *
 * The resolution is memoized per session — `resolveToken` reads from
 * `getComputedStyle(document.documentElement)` and returns "" when unavailable.
 */
const CHART_TOKEN_COUNT = 5;

function buildChartPalette(): string[] {
  const palette: string[] = [];
  for (let i = 1; i <= CHART_TOKEN_COUNT; i++) {
    const token = resolveToken(`--chart-${i}`);
    if (token) {
      palette.push(`hsl(${token})`);
    } else {
      palette.push("");
    }
  }
  return palette;
}

const chartPalette = buildChartPalette();

function resolveSegmentColor(index: number, explicit?: string): string {
  if (explicit) return explicit;
  return chartPalette[index % chartPalette.length] || "currentColor";
}

// ============================================================================
// Component
// ============================================================================

/**
 * SegmentedProgress — a bar divided into proportional segments.
 *
 * Segments are laid out with flexbox (`flex-grow` proportional to `value`).
 * Pure CSS, no SVG and no new dependencies. When `max` exceeds the sum of
 * segment values, an empty muted remainder is appended so the bar fills the
 * entire `max`.
 *
 * Default segment colors come from the `--chart-1` … `--chart-5` tokens in
 * `globals.css`; segments without an explicit `color` cycle through that
 * palette. If those tokens are unavailable the segments fall back to
 * `currentColor`, so consumers can colorize via a parent text color.
 *
 * @example
 * ```tsx
 * <SegmentedProgress
 *   segments={[
 *     { value: 60, label: "Equities" },
 *     { value: 30, label: "Fixed Income" },
 *     { value: 10, label: "Cash" },
 *   ]}
 * />
 * ```
 */
export const SegmentedProgress = React.forwardRef<
  HTMLDivElement,
  SegmentedProgressProps
>(
  (
    {
      className,
      segments,
      orientation = "horizontal",
      size = "sm",
      rounded = true,
      showValues = false,
      max,
      gap = 0,
      ...rest
    },
    ref
  ) => {
    const safeSegments = segments ?? [];
    const sum = safeSegments.reduce((acc, s) => acc + Math.max(0, s.value), 0);
    const total = max != null && max > sum ? max : sum;
    const hasRemainder = max != null && max > sum;

    const withLabels = showValues && safeSegments.length > 0;
    const isVertical = orientation === "vertical";

    // For horizontal bars, labels stack above the bar (flex-col).
    // For vertical bars, labels sit to the left of the bar (flex-row).
    const containerFlex = withLabels
      ? isVertical
        ? "flex-row items-start gap-2"
        : "flex-col gap-1"
      : isVertical
        ? "flex-col"
        : "flex-row";

    return (
      <div
        ref={ref}
        className={cn("flex", containerFlex, className)}
        role="meter"
        aria-valuetext={safeSegments
          .map((s) => `${s.label ?? ""}: ${s.value}`)
          .join(", ")}
        {...rest}
      >
        {withLabels && (
          <SegmentLabels
            segments={safeSegments}
            total={total}
            isVertical={isVertical}
          />
        )}
        <div
          className={cn(
            segmentedProgressVariants({
              orientation,
              size,
              rounded: rounded ?? true,
            }),
            // Bar takes remaining cross space when paired with labels, but for
            // vertical orientation the bar width is fixed by `size`.
            isVertical ? "" : "w-full",
            isVertical ? "flex-col" : "flex-row"
          )}
          style={{
            gap: gap ? `${gap}px` : undefined,
          }}
        >
          {safeSegments.length === 0 && total > 0 ? (
            <div className="flex-1 bg-muted" />
          ) : (
            safeSegments.map((seg, i) => {
              const color = resolveSegmentColor(i, seg.color);
              const proportion = total > 0 ? Math.max(0, seg.value) / total : 0;
              return (
                <div
                  key={i}
                  className={cn(
                    "min-w-0 min-h-0",
                    rounded && "first:rounded-l-full last:rounded-r-full",
                    isVertical &&
                      rounded &&
                      "first:rounded-t-full last:rounded-b-full first:rounded-l-none last:rounded-r-none",
                    "shrink-0"
                  )}
                  style={{
                    backgroundColor: color,
                    flexGrow: proportion,
                    flexBasis: 0,
                  }}
                  title={seg.label ? `${seg.label}: ${seg.value}` : `${seg.value}`}
                />
              );
            })
          )}
          {hasRemainder && total > 0 && (
            <div
              className={cn(
                "shrink-0 bg-muted/60",
                rounded && !isVertical && "last:rounded-r-full",
                rounded && isVertical && "last:rounded-b-full"
              )}
              style={{
                flexGrow: (total - sum) / total,
                flexBasis: 0,
              }}
            />
          )}
        </div>
      </div>
    );
  }
);

SegmentedProgress.displayName = "SegmentedProgress";

// ============================================================================
// Segment labels
// ============================================================================

interface SegmentLabelsProps {
  segments: Segment[];
  total: number;
  isVertical: boolean;
}

function SegmentLabels({ segments, total, isVertical }: SegmentLabelsProps) {
  return (
    <div
      className={cn(
        "flex text-xs text-muted-foreground",
        isVertical ? "flex-col gap-1" : "flex-row"
      )}
      aria-hidden
    >
      {segments.map((seg, i) => {
        const proportion = total > 0 ? Math.max(0, seg.value) / total : 0;
        const color = resolveSegmentColor(i, seg.color);
        return (
          <div
            key={i}
            style={{
              flexGrow: proportion,
              flexBasis: 0,
              color,
            }}
            className={cn(
              "flex min-w-0 items-center gap-1",
              isVertical ? "flex-row" : "flex-col"
            )}
          >
            <span
              className="inline-block size-1.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="truncate">
              {seg.label ? `${seg.label} ` : ""}
              <span className="tabular-nums text-foreground">
                {formatNumber(seg.value, { precision: 2 })}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}