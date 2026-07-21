import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";

import { cn } from "../../lib/utils";
import { DataTable } from "../../components/data-table";
import { Badge } from "../../components/badge";
import { NumericText } from "../../components/typography";
import { Card } from "../../components/card";
import { Alert, AlertDescription } from "../../components/alert";
import { Button } from "../../components/button";
import { TickerImage } from "./ticker-image";
import type { WatchlistItem } from "../../lib/finance-types";

export type WatchlistColumn =
  | "symbol"
  | "last"
  | "change"
  | "changePercent"
  | "bid"
  | "ask"
  | "dayRange"
  | "previousClose"
  | "volume"
  | "marketCap"
  | "sparkline";

export const DEFAULT_WATCHLIST_COLUMNS: WatchlistColumn[] = [
  "symbol",
  "last",
  "change",
  "changePercent",
  "volume",
  "sparkline",
];

export interface WatchlistProps {
  items: WatchlistItem[];
  /** Ordered list of columns to render. */
  visibleColumns?: WatchlistColumn[];
  /** Show the optional instrument name beneath the ticker. @default false */
  showInstrumentName?: boolean;
  /** Show each item's optional asset classification badge. @default true */
  showAssetType?: boolean;
  /** Render optional accordion-style detail content beneath an expanded row. */
  renderExpandedRow?: (item: WatchlistItem) => React.ReactNode;
  /** Controlled list of expanded ticker symbols. */
  expandedSymbols?: string[];
  /** Initially expanded ticker symbols for uncontrolled usage. */
  defaultExpandedSymbols?: string[];
  /** Called whenever the expanded symbol list changes. */
  onExpandedSymbolsChange?: (symbols: string[]) => void;
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
  visibleColumns = DEFAULT_WATCHLIST_COLUMNS,
  showInstrumentName = false,
  showAssetType = true,
  renderExpandedRow,
  expandedSymbols,
  defaultExpandedSymbols = [],
  onExpandedSymbolsChange,
  sparkline,
  showTickerImage = false,
  loading = false,
  emptyAction,
  className,
}: WatchlistProps) {
  const [internalExpandedSymbols, setInternalExpandedSymbols] = React.useState(defaultExpandedSymbols);
  const resolvedExpandedSymbols = expandedSymbols ?? internalExpandedSymbols;
  const expandedSet = React.useMemo(() => new Set(resolvedExpandedSymbols), [resolvedExpandedSymbols]);
  const toggleExpanded = React.useCallback((symbol: string) => {
    const next = expandedSet.has(symbol)
      ? resolvedExpandedSymbols.filter((value) => value !== symbol)
      : [...resolvedExpandedSymbols, symbol];
    if (expandedSymbols === undefined) setInternalExpandedSymbols(next);
    onExpandedSymbolsChange?.(next);
  }, [expandedSet, expandedSymbols, onExpandedSymbolsChange, resolvedExpandedSymbols]);

  const columns = React.useMemo<ColumnDef<WatchlistItem>[]>(() => {
    const available: Record<WatchlistColumn, ColumnDef<WatchlistItem>> = {
      symbol: {
        id: "symbol",
        accessorKey: "symbol",
        header: "Symbol",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            {showTickerImage ? (
              <TickerImage symbol={row.original.symbol} src={row.original.logoUrl} />
            ) : null}
            <span className="flex min-w-0 flex-col">
              <span className="font-semibold tracking-tight">{row.original.symbol}</span>
              {showInstrumentName && row.original.name ? (
                <span className="max-w-40 truncate text-xs text-muted-foreground">{row.original.name}</span>
              ) : null}
            </span>
            {showAssetType && row.original.assetType ? (
              <Badge variant="secondary" size="medium">{row.original.assetType}</Badge>
            ) : null}
          </div>
        ),
      },
      last: {
        id: "last",
        accessorKey: "last",
        header: "Last",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText value={row.original.last} format="currency" align="right" />
        ),
      },
      change: {
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
      changePercent: {
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
      volume: {
        id: "volume",
        accessorKey: "volume",
        header: "Volume",
        meta: { align: "right" },
        cell: ({ row }) =>
          row.original.volume !== undefined ? (
            <NumericText value={row.original.volume} format="compact" align="right" />
          ) : null,
      },
      bid: {
        id: "bid", accessorKey: "bid", header: "Bid", meta: { align: "right" },
        cell: ({ row }) => row.original.bid != null ? <NumericText value={row.original.bid} format="currency" precision={2} align="right" /> : null,
      },
      ask: {
        id: "ask", accessorKey: "ask", header: "Ask", meta: { align: "right" },
        cell: ({ row }) => row.original.ask != null ? <NumericText value={row.original.ask} format="currency" precision={2} align="right" /> : null,
      },
      dayRange: {
        id: "dayRange", header: "Day Range", meta: { align: "right" },
        cell: ({ row }) => row.original.dayLow != null && row.original.dayHigh != null ? (
          <span className="whitespace-nowrap font-mono text-xs tabular-nums text-muted-foreground">
            {row.original.dayLow.toFixed(2)} – {row.original.dayHigh.toFixed(2)}
          </span>
        ) : null,
      },
      previousClose: {
        id: "previousClose", accessorKey: "previousClose", header: "Prev Close", meta: { align: "right" },
        cell: ({ row }) => row.original.previousClose != null ? <NumericText value={row.original.previousClose} format="currency" precision={2} align="right" /> : null,
      },
      marketCap: {
        id: "marketCap", accessorKey: "marketCap", header: "Market Cap", meta: { align: "right" },
        cell: ({ row }) => row.original.marketCap != null ? <NumericText value={row.original.marketCap} format="compact" align="right" /> : null,
      },
      sparkline: {
        id: "sparkline", header: "Trend", meta: { align: "center" },
        cell: ({ row }) => <div className="flex h-7 w-24 items-center justify-center">{sparkline?.(row.original)}</div>,
      },
    };

    const visible = visibleColumns
      .filter((column) => column !== "sparkline" || Boolean(sparkline))
      .map((column) => available[column]);

    if (renderExpandedRow) {
      visible.unshift({
        id: "__expand",
        header: "",
        meta: { align: "center", headerClassName: "w-9", cellClassName: "w-9" },
        cell: ({ row }) => {
          const expanded = expandedSet.has(row.original.symbol);
          return (
            <button
              type="button"
              aria-label={`${expanded ? "Collapse" : "Expand"} ${row.original.symbol} details`}
              aria-expanded={expanded}
              aria-controls={`watchlist-details-${row.original.symbol}`}
              onClick={() => toggleExpanded(row.original.symbol)}
              className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className={cn("size-4 transition-transform", expanded && "rotate-90")} />
            </button>
          );
        },
      });
    }

    return visible;
  }, [expandedSet, renderExpandedRow, sparkline, showAssetType, showInstrumentName, showTickerImage, toggleExpanded, visibleColumns]);

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
        renderSubRow={renderExpandedRow ? (item) => (
          <div id={`watchlist-details-${item.symbol}`} className="border-l-2 border-l-primary/40 px-4 py-3">
            {renderExpandedRow(item)}
          </div>
        ) : undefined}
        isRowExpanded={(item) => expandedSet.has(item.symbol)}
      />
    </div>
  );
}
Watchlist.displayName = "Watchlist";
