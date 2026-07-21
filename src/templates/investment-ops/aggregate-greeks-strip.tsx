import * as React from "react";

import { cn } from "../../lib/utils";
import { Card } from "../../components/card";
import { Skeleton } from "../../components/skeleton";
import { NumericText } from "../../components/typography";
import { Badge } from "../../components/badge";
import type { OptionPosition } from "../../lib/finance-types";

/* -------------------------------------------------------------------------------------------------
 * AggregateGreeksStrip
 * ------------------------------------------------------------------------------------------------*/

/**
 * Strip orientation.
 *
 * - `horizontal` — cells flow left→right in a single row with vertical
 *   dividers (good for dashboard headers, table footer strips).
 * - `vertical` — cells stack top→bottom in a single column with horizontal
 *   dividers (good for side rails and narrow panels).
 * - `grid` — responsive grid that wraps cells; no dividers, uses gaps (good
 *   for dashboards where width is unpredictable).
 * - `compact` — tight inline strip with vertical dividers and smaller
 *   typography (good for table-row annotations and inline readouts).
 */
export type AggregateGreeksStripLayout =
  | "horizontal"
  | "vertical"
  | "grid"
  | "compact";

/**
 * Cell density / visual weight.
 *
 * - `comfortable` — generous padding, larger values (default).
 * - `compact` — reduced padding, smaller values. Combined with
 *   `layout="compact"` this yields the tightest form.
 */
export type AggregateGreeksStripSize = "comfortable" | "compact";

/**
 * What to render as the delta display.
 *
 * - `auto` — if `spot` provided, show Net Δ$ (currency); otherwise Net Δ.
 * - `delta` — always show raw Net Δ (Σ contracts × Δ).
 * - `deltaDollars` — always show Net Δ$ (= Δ × spot); requires `spot`.
 */
export type DeltaMode = "auto" | "delta" | "deltaDollars";

export interface AggregateGreeksStripProps {
  /** Open option positions to aggregate. */
  positions: OptionPosition[];
  /** Optional current spot of the underlying (for Δ$ conversion). */
  spot?: number;
  /** What the "Delta" cell should display. @default "auto" */
  deltaMode?: DeltaMode;
  /** Currency code for Δ$/Θ$/ν$ formatting. @default "USD" */
  currency?: string;
  /** Strip orientation. @default "horizontal" */
  layout?: AggregateGreeksStripLayout;
  /** Cell density / visual weight. @default "comfortable" */
  size?: AggregateGreeksStripSize;
  /** Show a small "NET GREEKS" header above the strip. @default false */
  showHeader?: boolean;
  /** Optional header content rendered on the right side (e.g. spot, ticker). */
  headerRight?: React.ReactNode;
  /** Loading state — renders skeleton cells instead of values. @default false */
  loading?: boolean;
  /** Colorize values by sign (positive/negative). @default true */
  colorize?: boolean;
  /** Number of cells to render when `loading`. @default 4 */
  loadingCount?: number;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

interface AggGreeks {
  netDelta: number;
  netGamma: number;
  netTheta: number;
  netVega: number;
}

function aggregate(positions: OptionPosition[]): AggGreeks {
  let netDelta = 0;
  let netGamma = 0;
  let netTheta = 0;
  let netVega = 0;
  for (const p of positions) {
    const d = p.delta ?? p.greeks?.delta;
    const g = p.greeks?.gamma;
    const t = p.greeks?.theta;
    const v = p.greeks?.vega;
    const c = p.contracts * 100;
    if (d != null) netDelta += c * d;
    if (g != null) netGamma += c * g;
    if (t != null) netTheta += c * t;
    if (v != null) netVega += c * v;
  }
  return { netDelta, netGamma, netTheta, netVega };
}

interface StatSpec {
  label: string;
  value: number;
  format: "currency" | "number";
  precision: number | undefined;
  /** Long-form aria description (e.g. "Net delta dollars"). */
  description: string;
}

interface StatProps extends StatSpec {
  layout: AggregateGreeksStripLayout;
  size: AggregateGreeksStripSize;
  currency?: string;
  signed: boolean;
  colorize: boolean;
}

function Stat({
  label,
  value,
  format,
  precision,
  description,
  currency,
  signed,
  colorize,
  layout,
  size,
}: StatProps) {
  const isCompact = size === "compact" || layout === "compact";

  return (
    <div
      role="group"
      aria-label={description}
      className={cn(
        "group flex min-w-0 flex-1 flex-col items-start justify-center",
        isCompact ? "gap-0.5 px-2.5 py-1.5" : "gap-1 px-3 py-2.5"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "font-mono font-medium uppercase tracking-wider text-muted-foreground",
          isCompact ? "text-[0.625rem]" : "text-[0.6875rem]"
        )}
      >
        {label}
      </span>
      <NumericText
        value={value}
        format={format}
        currency={currency}
        signed={signed}
        colorize={colorize}
        precision={precision}
        align="left"
        ariaLabel={`${description}: ${value > 0 ? "+" : value < 0 ? "−" : ""}${value}`}
        className={cn(
          "font-semibold tabular-nums",
          isCompact ? "text-sm" : "text-base"
        )}
      />
    </div>
  );
}

function StatSkeleton({
  layout,
  size,
}: {
  layout: AggregateGreeksStripLayout;
  size: AggregateGreeksStripSize;
}) {
  const isCompact = size === "compact" || layout === "compact";
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-1",
        isCompact ? "px-2.5 py-1.5" : "px-3 py-2.5"
      )}
    >
      <Skeleton className={cn("h-3 w-10", isCompact && "h-2.5 w-8")} />
      <Skeleton className={cn(isCompact ? "h-4 w-12" : "h-5 w-16")} />
    </div>
  );
}

function resolveDeltaSpec(
  greeks: AggGreeks,
  spot: number | undefined,
  mode: DeltaMode
): StatSpec {
  const useDollars =
    mode === "deltaDollars" || (mode === "auto" && spot != null);

  if (useDollars) {
    if (spot == null) {
      // deltaDollars requested without spot — fall back to raw delta.
      return {
        label: "Net Δ",
        value: greeks.netDelta,
        format: "number",
        precision: 2,
        description: "Net delta",
      };
    }
    return {
      label: "Net Δ$",
      value: greeks.netDelta * spot,
      format: "currency",
      precision: 0,
      description: "Net delta dollars",
    };
  }
  return {
    label: "Net Δ",
    value: greeks.netDelta,
    format: "number",
    precision: 2,
    description: "Net delta",
  };
}

/**
 * AggregateGreeksStrip - composed template showing net portfolio Greeks.
 *
 * Sums per-position `contracts × 100 × greek` into Net Δ (Σ contracts × Δ),
 * Γ, Θ/day, ν per 1% IV and renders them as a strip of stat cells inside a
 * `Card`. Supports four orientations via `layout` (`horizontal` | `vertical`
 * | `grid` | `compact`) and two densities via `size` (`comfortable` |
 * `compact`), plus an optional header and a real skeleton loading state.
 * Built on `Card` + `NumericText` + `Badge` + `Skeleton` directly (per the
 * "templates compose primitives only" rule) — no template-on-template
 * coupling.
 *
 * @example
 * ```tsx
 * <AggregateGreeksStrip positions={positions} spot={400} />
 * <AggregateGreeksStrip positions={positions} layout="vertical" showHeader />
 * <AggregateGreeksStrip positions={positions} layout="compact" size="compact" />
 * ```
 */
export function AggregateGreeksStrip({
  positions,
  spot,
  deltaMode = "auto",
  currency = "USD",
  layout = "horizontal",
  size = "comfortable",
  showHeader = false,
  headerRight,
  loading = false,
  colorize = true,
  loadingCount = 4,
  className,
}: AggregateGreeksStripProps) {
  const greeks = React.useMemo(() => aggregate(positions), [positions]);

  const specs: StatSpec[] = [
    resolveDeltaSpec(greeks, spot, deltaMode),
    {
      label: "Γ",
      value: greeks.netGamma,
      format: "number",
      precision: 2,
      description: "Net gamma",
    },
    {
      label: "Θ/day",
      value: greeks.netTheta,
      format: "currency",
      precision: undefined,
      description: "Net theta per day",
    },
    {
      label: "ν / 1% IV",
      value: greeks.netVega,
      format: "currency",
      precision: undefined,
      description: "Net vega per 1% IV",
    },
  ];

  const isCompact = layout === "compact";
  const isVertical = layout === "vertical";
  const isGrid = layout === "grid";

  const containerClass = cn(
    "flex w-full",
    isVertical
      ? "flex-col divide-y divide-border"
      : isGrid
        ? "flex-row flex-wrap gap-2 [&>*]:rounded-md"
        : "flex-row flex-wrap divide-x divide-border",
    isCompact && "divide-border/60"
  );

  return (
    <Card
      variant="outlined"
      aria-label="Aggregate portfolio Greeks"
      className={cn("flex flex-col p-0", className)}
    >
      {showHeader && (
        <div
          className={cn(
            "flex items-center justify-between border-b border-border/60",
            isCompact ? "px-2.5 py-1.5" : "px-3 py-2"
          )}
        >
          <div className="flex items-center gap-2">
            <Badge variant="secondary" size="medium">
              NET GREEKS
            </Badge>
            <span className="font-mono text-[0.625rem] uppercase tracking-wider text-muted-foreground">
              {positions.length} {positions.length === 1 ? "position" : "positions"}
              {spot != null ? ` · spot ${spot}` : ""}
            </span>
          </div>
          {headerRight != null && <div className="ml-2">{headerRight}</div>}
        </div>
      )}
      {loading ? (
        <div className={containerClass} aria-busy="true" role="status">
          {Array.from({ length: Math.max(0, loadingCount) }).map((_, i) => (
            <StatSkeleton key={i} layout={layout} size={size} />
          ))}
        </div>
      ) : positions.length === 0 ? (
        <div
          className={cn(
            "flex items-center justify-center text-xs text-muted-foreground",
            isCompact ? "px-2.5 py-1.5" : "px-3 py-3"
          )}
        >
          No open positions
        </div>
      ) : (
        <div className={containerClass}>
          {specs.map((spec) => (
            <Stat
              key={spec.label}
              {...spec}
              layout={layout}
              size={size}
              currency={currency}
              signed
              colorize={colorize}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

AggregateGreeksStrip.displayName = "AggregateGreeksStrip";