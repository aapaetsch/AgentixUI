import * as React from "react";

import { cn } from "../../lib/utils";
import { Card } from "../../components/card";
import { NumericText } from "../../components/typography";
import { Badge } from "../../components/badge";
import type { OptionPosition } from "../../lib/finance-types";

export interface AggregateGreeksStripProps {
  /** Open option positions to aggregate. */
  positions: OptionPosition[];
  /** Optional current spot of the underlying (for Δ$ conversion). */
  spot?: number;
  /** Currency code for Δ$/Θ$ formatting. @default "USD" */
  currency?: string;
  /** Loading state. */
  loading?: boolean;
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

interface StatProps {
  label: string;
  value: number;
  format: "currency" | "number";
  signed?: boolean;
  colorize?: boolean;
  currency?: string;
  precision?: number;
}

function Stat({ label, value, format, signed, colorize, currency, precision }: StatProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-col gap-0.5 px-3 py-2"
    >
      <Badge variant="secondary" size="medium" className="w-fit">
        {label}
      </Badge>
      <NumericText
        value={value}
        format={format}
        currency={currency}
        signed={signed}
        colorize={colorize}
        precision={precision}
        align="left"
        ariaLabel={`${label} ${value > 0 ? "+" : value < 0 ? "−" : ""}${value}`}
        className="text-base font-semibold"
      />
    </div>
  );
}

/**
 * AggregateGreeksStrip - composed template showing net portfolio Greeks.
 *
 * Sums per-position `contracts × 100 × greek` into Net Δ (Σ contracts × Δ),
 * Γ, Θ/day, ν per 1% IV and renders a tight strip of `Card` cells. Built on
 * `Card` + `NumericText` + `Badge` directly (per the "templates compose
 * primitives only" rule) — no template-on-template coupling with `StatTile`.
 *
 * @example
 * ```tsx
 * <AggregateGreeksStrip positions={positions} spot={400} />
 * ```
 */
export function AggregateGreeksStrip({
  positions,
  spot,
  currency = "USD",
  loading = false,
  className,
}: AggregateGreeksStripProps) {
  const greeks = React.useMemo(() => aggregate(positions), [positions]);
  const deltaDollars = spot != null ? greeks.netDelta * spot : null;

  return (
    <Card
      variant="outlined"
      aria-label="Aggregate portfolio Greeks"
      className={cn("flex flex-wrap items-stretch divide-x divide-border p-0", className)}
    >
      <Stat
        label={spot != null ? "Net Δ$" : "Net Δ"}
        value={deltaDollars ?? greeks.netDelta}
        format={deltaDollars != null ? "currency" : "number"}
        currency={currency}
        signed
        colorize
        precision={deltaDollars != null ? 0 : 2}
      />
      <Stat
        label="Γ"
        value={greeks.netGamma}
        format="number"
        signed
        colorize
        precision={2}
      />
      <Stat
        label="Θ/day"
        value={greeks.netTheta}
        format="currency"
        currency={currency}
        signed
        colorize
      />
      <Stat
        label="ν / 1% IV"
        value={greeks.netVega}
        format="currency"
        currency={currency}
        signed
        colorize
      />
      {loading && (
        <div className="flex items-center px-3 text-xs text-muted-foreground">
          computing…
        </div>
      )}
    </Card>
  );
}

AggregateGreeksStrip.displayName = "AggregateGreeksStrip";