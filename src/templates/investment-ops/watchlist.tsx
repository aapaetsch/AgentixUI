import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { cn } from "../../lib/utils";
import { DataTable } from "../../components/data-table";
import { Badge } from "../../components/badge";
import { NumericText } from "../../components/typography";
import { Card } from "../../components/card";
import { Alert, AlertDescription } from "../../components/alert";
import { Button } from "../../components/button";
import { TickerImage } from "./ticker-image";
import type { WatchlistItem } from "../../lib/finance-types";

export interface WatchlistProps {
  items: WatchlistItem[];
  /** Chart-lib sparkline render slot per row. */
  sparkline?: (item: WatchlistItem) => React.ReactNode;
  /**
   * When true, prepend a brand-mark avatar to the symbol column (sourced from
   * each item's optional `logoUrl` field; falls back to symbol initials).
 * Mirrors the ticker image shown next to a watchlist entry in apps like
   * Wealthsimple. @default false
   */
  showTickerImage?: boolean;
  onRowSelect?: (item: WatchlistItem) => void;
  /** Optional context menu node per row (rendered by the consumer's ContextMenu). */
  contextMenu?: (item: WatchlistItem) => React.ReactNode;
  loading?: boolean;
  emptyAction?: React.ReactNode;
  className?: string;
}

/**
 * Watchlist - Composed template for a watchlist table.
 *
 * Renders a `DataTable` with columns: Symbol | Last | Change | Change % | Volume | Sparkline.
 * The sparkline column delegates to a chart lib via the `sparkline(item)` render slot — the
 * template does not own the chart. Pass `showTickerImage` to prepend a brand-mark avatar
 * (from each item's optional `logoUrl`) beside the symbol.
 *
 * @example
 * ```tsx
 * <Watchlist items={items} showTickerImage sparkline={(item) => <Sparkline data={item.history} />} />
 * ```
 */
export function Watchlist({
  items,
  sparkline,
  showTickerImage = false,
  loading = false,
  emptyAction,
  className,
}: WatchlistProps) {
  const columns = React.useMemo<ColumnDef<WatchlistItem>[]>(
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
            <Badge variant="secondary">EQ</Badge>
          </div>
        ),
      },
      {
        id: "last",
        accessorKey: "last",
        header: "Last",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText value={row.original.last} format="currency" align="right" />
        ),
      },
      {
        id: "change",
        accessorKey: "change",
        header: "Change",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText
            value={row.original.change}
            format="currency"
            signed
            colorize
            align="right"
          />
        ),
      },
      {
        id: "changePercent",
        accessorKey: "changePercent",
        header: "Change %",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText
            value={row.original.changePercent}
            format="percent"
            signed
            colorize
            align="right"
          />
        ),
      },
      {
        id: "volume",
        accessorKey: "volume",
        header: "Volume",
        meta: { align: "right" },
        cell: ({ row }) =>
          row.original.volume !== undefined ? (
            <NumericText value={row.original.volume} format="compact" align="right" />
          ) : null,
      },
      ...(sparkline
        ? [
            {
              id: "sparkline" as const,
              header: "Trend",
              meta: { align: "center" as const },
              cell: ({ row }: { row: { original: WatchlistItem } }) => (
                <div className="h-7 w-24 flex items-center justify-center">
                  {sparkline(row.original)}
                </div>
              ),
            },
          ]
        : []),
    ],
    [sparkline, showTickerImage]
  );

  if (!loading && items.length === 0) {
    return (
      <Card variant="outlined" className={cn("p-6", className)}>
        <Alert variant="default" showIcon={false}>
          <AlertDescription>
            <div className="flex flex-col items-center gap-3 text-center">
              <span>Your watchlist is empty.</span>
              {emptyAction ?? <Button colorStyle="outlined">Add a symbol</Button>}
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
        data={items}
        emptyMessage="No symbols in your watchlist."
        size="sm"
        variant="bordered"
        stickyHeader
      />
    </div>
  );
}
Watchlist.displayName = "Watchlist";