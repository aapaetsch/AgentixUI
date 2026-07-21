import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { cn } from "../../lib/utils";
import { DataTable, type DataTableRowAction } from "../../components/data-table";
import { NumericText } from "../../components/typography";
import { Card } from "../../components/card";
import { Alert, AlertDescription } from "../../components/alert";
import { Button } from "../../components/button";
import { Badge } from "../../components/badge";
import { OptionSymbolBadge } from "../../components/option-symbol-badge";
import { ExpiryBadge } from "../../components/expiry-badge";
import type { OptionPosition } from "../../lib/finance-types";

export interface OptionsPositionsTableProps {
  /** Open option positions. */
  positions: OptionPosition[];
  /** Row action callback (e.g. roll/close/exercise). */
  onRowAction?: (action: string, position: OptionPosition) => void;
  /** Show the per-row net delta column. @default true */
  showDelta?: boolean;
  /** Show the per-row theta/day column. @default true */
  showTheta?: boolean;
  /** Show the per-row IV column. @default false */
  showIv?: boolean;
  /** Virtualize the table for large blotter lists. @default false */
  virtualize?: boolean;
  /** Loading state. */
  loading?: boolean;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

/**
 * OptionsPositionsTable - composed template for an open-option-positions blotter.
 *
 * Columns: Contract (`OptionSymbolBadge`) | DTE (`ExpiryBadge`) | Status |
 * Qty (signed) | Mark | Mkt Value | Net Δ (×100) | Θ/day | P&L $ | P&L %.
 * Row actions render via `DataTable`'s `rowActions` (Roll / Close / Exercise).
 *
 * Mirrors `HoldingsTable` exactly: `ColumnDef<OptionPosition>[]`, `NumericText`
 * cells, `meta: { align }` for right-aligned numerics, `variant="bordered"
 * size="sm" stickyHeader`. Empty positions render a friendly CTA `Alert`.
 *
 * @example
 * ```tsx
 * <OptionsPositionsTable positions={positions} onRowAction={handle} />
 * ```
 */
export function OptionsPositionsTable({
  positions,
  onRowAction,
  showDelta = true,
  showTheta = true,
  showIv = false,
  virtualize = false,
  loading = false,
  className,
}: OptionsPositionsTableProps) {
  const rowActions = React.useMemo<DataTableRowAction<OptionPosition>[]>(
    () =>
      [
        { id: "roll", label: "Roll", onSelect: (r) => onRowAction?.("roll", r) },
        { id: "close", label: "Close", onSelect: (r) => onRowAction?.("close", r) },
        { id: "exercise", label: "Exercise", onSelect: (r) => onRowAction?.("exercise", r) },
      ] satisfies DataTableRowAction<OptionPosition>[],
    [onRowAction]
  );

  const columns = React.useMemo<ColumnDef<OptionPosition>[]>(() => {
    const cols: ColumnDef<OptionPosition>[] = [
      {
        id: "contract",
        accessorKey: "root",
        header: "Contract",
        cell: ({ row }) => <OptionSymbolBadge contract={row.original} />,
      },
      {
        id: "dte",
        accessorKey: "daysToExpiry",
        header: "DTE",
        cell: ({ row }) => (
          <ExpiryBadge
            expiry={row.original.expiry}
            daysToExpiry={row.original.daysToExpiry}
            showDate
          />
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) =>
          row.original.status ? (
            <Badge
              variant={row.original.status === "open" ? "success" : row.original.status === "assigned" || row.original.status === "exercised" ? "warning" : "secondary"}
              size="medium"
              className="capitalize"
            >
              {row.original.status}
            </Badge>
          ) : null,
      },
      {
        id: "contracts",
        accessorKey: "contracts",
        header: "Qty",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText
            value={row.original.contracts}
            format="number"
            signed
            colorize
            align="right"
          />
        ),
      },
      {
        id: "markPrice",
        accessorKey: "markPrice",
        header: "Mark",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText
            value={row.original.markPrice}
            format="currency"
            align="right"
            precision={2}
          />
        ),
      },
      {
        id: "marketValue",
        accessorKey: "marketValue",
        header: "Mkt Value",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText
            value={row.original.marketValue}
            format="currency"
            align="right"
          />
        ),
      },
    ];

    if (showDelta) {
      cols.push({
        id: "delta",
        header: "Net Δ",
        meta: { align: "right" },
        cell: ({ row }) => {
          const d = row.original.delta ?? row.original.greeks?.delta;
          if (d == null) return null;
          // Net delta dollars = contracts × 100 × per-contract delta.
          const netDelta = row.original.contracts * 100 * d;
          return (
            <NumericText
              value={netDelta}
              format="number"
              signed
              colorize
              align="right"
              precision={0}
            />
          );
        },
      });
    }

    if (showTheta) {
      cols.push({
        id: "theta",
        header: "Θ/day",
        meta: { align: "right" },
        cell: ({ row }) => {
          const t = row.original.greeks?.theta;
          if (t == null) return null;
          const netTheta = row.original.contracts * 100 * t;
          return (
            <NumericText
              value={netTheta}
              format="currency"
              signed
              colorize
              align="right"
            />
          );
        },
      });
    }

    if (showIv) {
      cols.push({
        id: "iv",
        accessorKey: "iv",
        header: "IV",
        meta: { align: "right" },
        cell: ({ row }) =>
          row.original.iv != null ? (
            <NumericText
              value={row.original.iv}
              format="percent"
              align="right"
            />
          ) : null,
      });
    }

    cols.push(
      {
        id: "unrealizedPnL",
        accessorKey: "unrealizedPnL",
        header: "P&L $",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText
            value={row.original.unrealizedPnL}
            format="currency"
            signed
            colorize
            align="right"
          />
        ),
      },
      {
        id: "unrealizedPnLPercent",
        accessorKey: "unrealizedPnLPercent",
        header: "P&L %",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText
            value={row.original.unrealizedPnLPercent}
            format="percent"
            signed
            colorize
            align="right"
          />
        ),
      }
    );

    return cols;
  }, [showDelta, showTheta, showIv]);

  if (!loading && positions.length === 0) {
    return (
      <Card variant="outlined" className={cn("p-6", className)}>
        <Alert variant="default" showIcon={false}>
          <AlertDescription>
            <div className="flex flex-col items-center gap-3 text-center">
              <span>No open option positions.</span>
              <Button colorStyle="outlined">Open a position</Button>
            </div>
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <DataTable
        columns={columns}
        data={positions}
        rowActions={rowActions}
        rowActionsLabel="Actions"
        emptyMessage="No open positions."
        size="sm"
        variant="bordered"
        stickyHeader
        virtualize={virtualize}
        virtualizationHeight={640}
      />
    </div>
  );
}

OptionsPositionsTable.displayName = "OptionsPositionsTable";
