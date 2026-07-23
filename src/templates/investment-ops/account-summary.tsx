import * as React from "react";

import { cn } from "../../lib/utils";
import { Grid } from "../../components/grid";
import { Alert } from "../../components/alert";
import { StatTile, type StatTileProps } from "./stat-tile";

export interface AccountSummaryProps {
  tiles: StatTileProps[];
  /** Optional warning rendered as an `Alert` below the grid (margin/balance). */
  warning?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

/**
 * AccountSummary - KPI row of `StatTile`s for account-level financials.
 *
 * Renders a 4-tile (sm+ → 2 cols, lg+ → 4) or 6-tile (lg+ → 3 cols) grid. When a
 * `warning` node is provided it renders as a destructive `Alert` below the grid.
 *
 * @example
 * ```tsx
 * <AccountSummary tiles={[
 *   { label: "Cash", value: 12000, format: "currency" },
 *   { label: "Equity", value: 234000, format: "currency" },
 *   { label: "Day P&L", value: -1234, format: "currency", delta: -1.2 },
 *   { label: "Total P&L", value: 8000, format: "currency", delta: 4.3 },
 * ]} />
 * ```
 */
export function AccountSummary({
  tiles,
  warning,
  loading = false,
  className,
}: AccountSummaryProps) {
  const isSix = tiles.length >= 6;
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Grid
        cols={isSix ? 3 : 4}
        gap="md"
        className="w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-none"
      >
        {tiles.map((tile, i) => (
          <StatTile key={tile.label ?? i} {...tile} loading={loading} />
        ))}
      </Grid>

      {warning ? (
        <Alert variant="default" className="mt-2">
          {warning}
        </Alert>
      ) : null}
    </div>
  );
}
AccountSummary.displayName = "AccountSummary";