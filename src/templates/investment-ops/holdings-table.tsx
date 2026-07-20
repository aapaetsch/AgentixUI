import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { cn } from "../../lib/utils";
import { DataTable, type DataTableRowAction } from "../../components/data-table";
import { NumericText } from "../../components/typography";
import { Card } from "../../components/card";
import { Alert, AlertDescription } from "../../components/alert";
import { Button } from "../../components/button";
import { TickerImage } from "./ticker-image";
import type { HoldingRow } from "../../lib/finance-types";

export interface HoldingsTableProps {
  holdings: HoldingRow[];
  onRowAction?: (action: string, holding: HoldingRow) => void;
  /** Optional P&L tooltip content per row (rendered by consumer's Tooltip). */
  pnlTooltip?: (holding: HoldingRow) => React.ReactNode;
  /**
   * When true, prepend a Ticker column showing the instrument's brand mark
   * (uses `logoUrl` from each holding when available; falls back to symbol
   * initials via `AvatarFallback`). @default false
   */
  showTickerImage?: boolean;
  loading?: boolean;
  virtualize?: boolean;
  className?: string;
}

/**
 * HoldingsTable - Composed template for a holdings/positions table.
 *
 * Columns: [Ticker image when `showTickerImage`] Symbol | Quantity | Avg Cost |
 * Last | Mkt Value | Unrealized P&L $ | Unrealized P&L % | Weight % | Day Change.
 * P&L columns are colorized via `NumericText colorize`. Row actions render via the
 * DropdownMenu exposed by `DataTable`'s `rowActions`.
 *
 * Pass `showTickerImage` to prepend a compact brand-mark avatar (sourced from
 * each holding's optional `logoUrl` field) beside the symbol — mirroring the
 * ticker image shown next to a holding in apps like Wealthsimple.
 *
 * @example
 * ```tsx
 * <HoldingsTable holdings={positions} onRowAction={handleAction} showTickerImage />
 * ```
 */
export function HoldingsTable({
  holdings,
  onRowAction,
  showTickerImage = false,
  loading = false,
  virtualize = false,
  className,
}: HoldingsTableProps) {
  const rowActions = React.useMemo<DataTableRowAction<HoldingRow>[]>(
    () =>
      [
        { id: "sell", label: "Sell", onSelect: (r) => onRowAction?.("sell", r) },
        { id: "buy-more", label: "Buy more", onSelect: (r) => onRowAction?.("buy-more", r) },
        { id: "history", label: "View history", onSelect: (r) => onRowAction?.("history", r) },
        { id: "tax-lots", label: "Tax lots", onSelect: (r) => onRowAction?.("tax-lots", r) },
      ] satisfies DataTableRowAction<HoldingRow>[],
    [onRowAction]
  );

  const columns = React.useMemo<ColumnDef<HoldingRow>[]>(
    () => [
      {
        id: "symbol",
        accessorKey: "symbol",
        header: "Symbol",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {showTickerImage ? (
              <TickerImage symbol={row.original.symbol} src={row.original.logoUrl} />
            ) : null}
            <span className="font-medium">{row.original.symbol}</span>
          </div>
        ),
      },
      {
        id: "quantity",
        accessorKey: "quantity",
        header: "Qty",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText value={row.original.quantity} format="number" align="right" />
        ),
      },
      {
        id: "averageCost",
        accessorKey: "averageCost",
        header: "Avg Cost",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText value={row.original.averageCost} format="currency" align="right" />
        ),
      },
      {
        id: "lastPrice",
        accessorKey: "lastPrice",
        header: "Last",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText value={row.original.lastPrice} format="currency" align="right" />
        ),
      },
      {
        id: "marketValue",
        accessorKey: "marketValue",
        header: "Mkt Value",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText value={row.original.marketValue} format="currency" align="right" />
        ),
      },
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
      },
      {
        id: "weightPercent",
        accessorKey: "weightPercent",
        header: "Weight %",
        meta: { align: "right" },
        cell: ({ row }) =>
          row.original.weightPercent !== undefined ? (
            <NumericText
              value={row.original.weightPercent}
              format="percent"
              align="right"
            />
          ) : null,
      },
      {
        id: "dayChange",
        accessorKey: "dayChange",
        header: "Day Chg",
        meta: { align: "right" },
        cell: ({ row }) =>
          row.original.dayChange !== undefined ? (
            <NumericText
              value={row.original.dayChange}
              format="currency"
              signed
              colorize
              align="right"
            />
          ) : null,
      },
    ],
    [showTickerImage]
  );

  if (!loading && holdings.length === 0) {
    return (
      <Card variant="outlined" className={cn("p-6", className)}>
        <Alert variant="default" showIcon={false}>
          <AlertDescription>
            <div className="flex flex-col items-center gap-3 text-center">
              <span>Your portfolio is empty.</span>
              <Button colorStyle="outlined">Add your first position</Button>
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
        data={holdings}
        rowActions={rowActions}
        rowActionsLabel="Actions"
        emptyMessage="No positions."
        size="sm"
        variant="bordered"
        stickyHeader
        virtualize={virtualize}
        virtualizationHeight={640}
      />
    </div>
  );
}
HoldingsTable.displayName = "HoldingsTable";