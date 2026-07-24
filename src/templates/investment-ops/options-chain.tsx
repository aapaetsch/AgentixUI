import * as React from "react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";

import { cn } from "../../lib/utils";
import { DataTable } from "../../components/data-table";
import { NumericText } from "../../components/typography";
import { Card } from "../../components/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/tabs";
import { StrikesNavigator } from "../../components/strikes-navigator";
import {
  ResponsivePagination,
  PaginationPageSizeSelector,
} from "../../components/pagination";
import type { OptionChainRow, OptionType } from "../../lib/finance-types";

export interface OptionsChainProps {
  /** Chain rows, one per strike (call + put per row). */
  rows: OptionChainRow[];
  /** Underlying root symbol. */
  underlying: string;
  /** Current spot/underlying price (ATM anchor). */
  spot: number;
  /** Distinct expiries present in `rows`, sorted ascending. The chain renders one tab per expiry. */
  expiries: number[];
  /** Initially selected expiry (epoch ms). */
  defaultExpiry?: number;
  /** Controlled active expiry. */
  expiry?: number;
  /** Called when the user changes the active expiry tab. */
  onExpiryChange?: (expiry: number) => void;
  /** Controlled selected strike. */
  selectedStrike?: number;
  /** Initially selected strike for uncontrolled usage. */
  defaultSelectedStrike?: number;
  /** Called when the strike selection changes. */
  onSelectedStrikeChange?: (strike: number) => void;
  /** Called when a chain side cell is clicked — usually opens / appends a leg. */
  onAddLeg?: (
    side: "buy" | "sell",
    type: OptionType,
    strike: number,
    expiry: number
  ) => void;
  /**
   * Number of strike rows shown per page across all three columns.
   * Set to 0 to disable pagination entirely (render every strike).
   * @default 20
   */
  pageSize?: number;
  /**
   * Page size options offered in the chain footer's page-size selector.
   * @default [20, 50, 100]
   */
  pageSizeOptions?: number[];
  /** Currency code for prices. @default "USD" */
  currency?: string;
  /** Format expiry-cycle labels. */
  formatExpiry?: (expiry: number) => React.ReactNode;
  /** Replace the standard summary header. */
  renderHeader?: (context: { underlying: string; spot: number; expiry: number }) => React.ReactNode;
  /** Replace any generated table column group. */
  columns?: Partial<{ calls: ColumnDef<OptionChainRow>[]; strikes: ColumnDef<OptionChainRow>[]; puts: ColumnDef<OptionChainRow>[] }>;
  /** Show the strike navigator below the strike table. @default true */
  showStrikeNavigator?: boolean;
  /** Props forwarded to `StrikesNavigator`. */
  strikeNavigatorProps?: Omit<React.ComponentProps<typeof StrikesNavigator>, "strikes" | "atmStrike" | "selectedStrike" | "onSelectStrike">;
  /** Override section labels. */
  labels?: Partial<Record<"calls" | "puts" | "strike" | "spot", React.ReactNode>> & { rows?: string };
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

/**
 * OptionsChain - composed template for a calls/puts chain by strike × expiry.
 *
 * Layout: expiry-cycle `Tabs` at the top, then a strike-center column layout
 * with calls `DataTable` (left) and puts `DataTable` (right) sharing the
 * strike axis. Each side renders Bid / Ask / Last / IV / Vol / OI / Δ cells
 * in `NumericText`; clicking a side cell invokes `onAddLeg`. A
 * `StrikesNavigator` sits between the two tables for quick strike jumping.
 *
 * @example
 * ```tsx
 * <OptionsChain rows={chainRows} underlying="SPY" spot={400} expiries={expiries}
 *   onAddLeg={(side, type, strike) => addLeg(...)} />
 * ```
 */
export function OptionsChain({
  rows,
  underlying,
  spot,
  expiries,
  defaultExpiry,
  expiry,
  onExpiryChange,
  selectedStrike: selectedStrikeProp,
  defaultSelectedStrike,
  onSelectedStrikeChange,
  onAddLeg,
  pageSize = 20,
  pageSizeOptions = [20, 50, 100],
  currency = "USD",
  formatExpiry,
  renderHeader,
  columns: columnsProp,
  showStrikeNavigator = true,
  strikeNavigatorProps,
  labels,
  className,
}: OptionsChainProps) {
  const [internalExpiry, setInternalExpiry] = React.useState<number>(
    defaultExpiry ?? expiries[0] ?? 0
  );
  const [internalSelectedStrike, setInternalSelectedStrike] = React.useState<number | undefined>(defaultSelectedStrike);
  const activeExpiry = expiry ?? internalExpiry;
  const selectedStrike = selectedStrikeProp ?? internalSelectedStrike;

  // Shared, synchronized pagination across all three DataTables so the Calls,
  // Strike, and Puts columns page in lockstep and stay row-for-row aligned.
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  React.useEffect(() => {
    if (expiry == null && defaultExpiry != null) setInternalExpiry(defaultExpiry);
  }, [defaultExpiry, expiry]);

  const selectExpiry = React.useCallback((next: number) => {
    if (expiry == null) setInternalExpiry(next);
    onExpiryChange?.(next);
  }, [expiry, onExpiryChange]);

  const selectStrike = React.useCallback((next: number) => {
    if (selectedStrikeProp == null) setInternalSelectedStrike(next);
    onSelectedStrikeChange?.(next);
  }, [onSelectedStrikeChange, selectedStrikeProp]);

  // Reset to the first page whenever the active expiry changes so the chain
  // never strands the user on a stale, possibly out-of-range page index.
  React.useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [activeExpiry]);

  // Keep the controlled pageSize in sync if the prop changes externally.
  React.useEffect(() => {
    setPagination((p) => ({ ...p, pageSize }));
  }, [pageSize]);

  const visibleRows = React.useMemo(
    () => rows.filter((r) => r.call?.expiry === activeExpiry ||
                              r.put?.expiry === activeExpiry),
    [rows, activeExpiry]
  );

  const strikes = React.useMemo(
    () => visibleRows.map((r) => r.strike).sort((a, b) => a - b),
    [visibleRows]
  );

  // Page-window metadata shared between the three DataTables and the footer.
  const totalRows = visibleRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pagination.pageSize));
  const startRow = totalRows === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows);

  const callColumns = React.useMemo<ColumnDef<OptionChainRow>[]>(
    () => [
      {
        id: "callBid",
        header: "Bid",
        meta: { align: "right" },
        cell: ({ row }) => {
          const c = row.original.call;
          if (!c || c.bid == null) return null;
          return (
            <button
              className="rounded border border-transparent bg-negative/5 px-1.5 py-0.5 tabular-nums transition-colors hover:border-negative/20 hover:bg-negative/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onAddLeg?.("sell", "call", row.original.strike, activeExpiry)}
              aria-label={`Sell call at strike ${row.original.strike}`}
            >
              <NumericText value={c.bid} format="currency" currency={currency} precision={2} align="right" />
            </button>
          );
        },
      },
      {
        id: "callAsk",
        header: "Ask",
        meta: { align: "right" },
        cell: ({ row }) => {
          const c = row.original.call;
          if (!c || c.ask == null) return null;
          return (
            <button
              className="rounded border border-transparent bg-positive/5 px-1.5 py-0.5 tabular-nums transition-colors hover:border-positive/20 hover:bg-positive/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onAddLeg?.("buy", "call", row.original.strike, activeExpiry)}
              aria-label={`Buy call at strike ${row.original.strike}`}
            >
              <NumericText value={c.ask} format="currency" currency={currency} precision={2} align="right" />
            </button>
          );
        },
      },
      {
        id: "callIv",
        header: "IV",
        meta: { align: "right" },
        cell: ({ row }) =>
          row.original.call?.iv != null ? (
            <NumericText value={row.original.call.iv} format="percent" align="right" />
          ) : null,
      },
      {
        id: "callDelta",
        header: "Δ",
        meta: { align: "right" },
        cell: ({ row }) => {
          const d = row.original.call?.delta ?? row.original.call?.greeks?.delta;
          return d != null ? (
            <NumericText value={d} format="number" precision={2} colorize align="right" />
          ) : null;
        },
      },
    ],
    [activeExpiry, currency, onAddLeg]
  );

  const putColumns = React.useMemo<ColumnDef<OptionChainRow>[]>(
    () => [
      {
        id: "putDelta",
        header: "Δ",
        meta: { align: "right" },
        cell: ({ row }) => {
          const d = row.original.put?.delta ?? row.original.put?.greeks?.delta;
          return d != null ? (
            <NumericText value={d} format="number" precision={2} colorize align="right" />
          ) : null;
        },
      },
      {
        id: "putIv",
        header: "IV",
        meta: { align: "right" },
        cell: ({ row }) =>
          row.original.put?.iv != null ? (
            <NumericText value={row.original.put.iv} format="percent" align="right" />
          ) : null,
      },
      {
        id: "putBid",
        header: "Bid",
        meta: { align: "right" },
        cell: ({ row }) => {
          const p = row.original.put;
          if (!p || p.bid == null) return null;
          return (
            <button
              className="rounded border border-transparent bg-negative/5 px-1.5 py-0.5 tabular-nums transition-colors hover:border-negative/20 hover:bg-negative/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onAddLeg?.("sell", "put", row.original.strike, activeExpiry)}
              aria-label={`Sell put at strike ${row.original.strike}`}
            >
              <NumericText value={p.bid} format="currency" currency={currency} precision={2} align="right" />
            </button>
          );
        },
      },
      {
        id: "putAsk",
        header: "Ask",
        meta: { align: "right" },
        cell: ({ row }) => {
          const p = row.original.put;
          if (!p || p.ask == null) return null;
          return (
            <button
              className="rounded border border-transparent bg-positive/5 px-1.5 py-0.5 tabular-nums transition-colors hover:border-positive/20 hover:bg-positive/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onAddLeg?.("buy", "put", row.original.strike, activeExpiry)}
              aria-label={`Buy put at strike ${row.original.strike}`}
            >
              <NumericText value={p.ask} format="currency" currency={currency} precision={2} align="right" />
            </button>
          );
        },
      },
    ],
    [activeExpiry, currency, onAddLeg]
  );

  const strikeColumns = React.useMemo<ColumnDef<OptionChainRow>[]>(
    () => [
      {
        id: "strike",
        accessorKey: "strike",
        header: "Strike",
        meta: { align: "center" },
        cell: ({ row }) => (
          <span className="font-mono tabular-nums font-semibold">
            {row.original.strike.toLocaleString("en-US", {
              minimumFractionDigits: Number.isInteger(row.original.strike) ? 0 : 1,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      },
    ],
    []
  );

  const cycleLabel = (e: number): React.ReactNode => {
    if (formatExpiry) return formatExpiry(e);
    const d = new Date(e);
    return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${d.getFullYear()}`;
  };

  return (
    <Card variant="outlined" className={cn("flex flex-col gap-3 p-3", className)}>
      {renderHeader?.({ underlying, spot, expiry: activeExpiry }) ?? <div className="flex items-center justify-between gap-3 rounded-md bg-muted/30 px-3 py-2">
        <span className="font-mono text-base font-semibold tracking-tight">{underlying}</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{cycleLabel(activeExpiry)}</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{labels?.spot ?? "Spot"}</span>
            <NumericText value={spot} format="currency" currency={currency} align="right" />
          </div>
        </div>
      </div>}

      <Tabs
        value={String(activeExpiry)}
        onValueChange={(v) => {
          const e = Number(v);
          selectExpiry(e);
        }}
      >
        <TabsList className="flex-wrap">
          {expiries.map((e) => (
            <TabsTrigger key={e} value={String(e)}>
              {cycleLabel(e)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-[1fr_8rem_1fr] gap-2 text-center text-xs font-semibold uppercase tracking-wider">
        <span className="rounded-sm bg-positive/10 py-1 text-positive">{labels?.calls ?? "Calls"}</span>
        <span className="py-1 text-muted-foreground">{labels?.strike ?? "Strike"}</span>
        <span className="rounded-sm bg-negative/10 py-1 text-negative">{labels?.puts ?? "Puts"}</span>
      </div>

      <div className="grid min-w-[44rem] grid-cols-[1fr_8rem_1fr] gap-2 overflow-x-auto">
        <DataTable
          columns={columnsProp?.calls ?? callColumns}
          data={visibleRows}
          size="sm"
          variant="bordered"
          stickyHeader
          showPagination={false}
          pagination={pagination}
          onPaginationChange={setPagination}
          initialPageSize={pageSize}
          emptyMessage="No calls."
        />
        <div className="flex flex-col gap-1">
          <DataTable
            columns={columnsProp?.strikes ?? strikeColumns}
            data={visibleRows}
            size="sm"
            variant="bordered"
            stickyHeader
            showPagination={false}
            pagination={pagination}
            onPaginationChange={setPagination}
            initialPageSize={pageSize}
          />
          {showStrikeNavigator && <StrikesNavigator
            {...strikeNavigatorProps}
            strikes={strikes}
            atmStrike={spot}
            selectedStrike={selectedStrike}
            onSelectStrike={selectStrike}
            viewportRows={strikeNavigatorProps?.viewportRows ?? 14}
            rowHeight={strikeNavigatorProps?.rowHeight ?? 24}
            className={cn("flex-1", strikeNavigatorProps?.className)}
          />}
        </div>
        <DataTable
          columns={columnsProp?.puts ?? putColumns}
          data={visibleRows}
          size="sm"
          variant="bordered"
          stickyHeader
          showPagination={false}
          pagination={pagination}
          onPaginationChange={setPagination}
          initialPageSize={pageSize}
          emptyMessage="No puts."
        />
      </div>

      {pagination.pageSize > 0 && totalPages > 1 && (
        <div className="flex flex-col gap-2 rounded-md border border-border px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            Strikes {startRow}&ndash;{endRow} of {totalRows}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <PaginationPageSizeSelector
              pageSize={pagination.pageSize}
              onPageSizeChange={(ps) =>
                setPagination({ pageIndex: 0, pageSize: ps })
              }
              pageSizeOptions={pageSizeOptions}
              size="sm"
              label={labels?.rows ?? "Rows"}
            />
            <ResponsivePagination
              currentPage={pagination.pageIndex + 1}
              totalPages={totalPages}
              onPageChange={(p) =>
                setPagination((s) => ({ ...s, pageIndex: Math.max(0, p - 1) }))
              }
              siblingCount={1}
              showFirstLast
              size="sm"
            />
          </div>
        </div>
      )}
    </Card>
  );
}

OptionsChain.displayName = "OptionsChain";
