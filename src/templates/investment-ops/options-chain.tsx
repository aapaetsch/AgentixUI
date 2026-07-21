import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { cn } from "../../lib/utils";
import { DataTable } from "../../components/data-table";
import { NumericText } from "../../components/typography";
import { Card } from "../../components/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/tabs";
import { StrikesNavigator } from "../../components/strikes-navigator";
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
  /** Called when the user changes the active expiry tab. */
  onExpiryChange?: (expiry: number) => void;
  /** Called when a chain side cell is clicked — usually opens / appends a leg. */
  onAddLeg?: (
    side: "buy" | "sell",
    type: OptionType,
    strike: number,
    expiry: number
  ) => void;
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
  onExpiryChange,
  onAddLeg,
  className,
}: OptionsChainProps) {
  const [activeExpiry, setActiveExpiry] = React.useState<number>(
    defaultExpiry ?? expiries[0] ?? 0
  );
  const [selectedStrike, setSelectedStrike] = React.useState<number | undefined>();

  React.useEffect(() => {
    if (defaultExpiry != null) setActiveExpiry(defaultExpiry);
  }, [defaultExpiry]);

  const visibleRows = React.useMemo(
    () => rows.filter((r) => r.call?.expiry === activeExpiry ||
                              r.put?.expiry === activeExpiry),
    [rows, activeExpiry]
  );

  const strikes = React.useMemo(
    () => visibleRows.map((r) => r.strike).sort((a, b) => a - b),
    [visibleRows]
  );

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
              className="hover:bg-accent/40 rounded px-1 tabular-nums"
              onClick={() => onAddLeg?.("sell", "call", row.original.strike, activeExpiry)}
              aria-label={`Sell call at strike ${row.original.strike}`}
            >
              <NumericText value={c.bid} format="currency" precision={2} align="right" />
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
              className="hover:bg-accent/40 rounded px-1 tabular-nums"
              onClick={() => onAddLeg?.("buy", "call", row.original.strike, activeExpiry)}
              aria-label={`Buy call at strike ${row.original.strike}`}
            >
              <NumericText value={c.ask} format="currency" precision={2} align="right" />
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
            <NumericText value={d} format="number" precision={2} align="right" />
          ) : null;
        },
      },
    ],
    [activeExpiry, onAddLeg]
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
            <NumericText value={d} format="number" precision={2} align="right" />
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
              className="hover:bg-accent/40 rounded px-1 tabular-nums"
              onClick={() => onAddLeg?.("sell", "put", row.original.strike, activeExpiry)}
              aria-label={`Sell put at strike ${row.original.strike}`}
            >
              <NumericText value={p.bid} format="currency" precision={2} align="right" />
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
              className="hover:bg-accent/40 rounded px-1 tabular-nums"
              onClick={() => onAddLeg?.("buy", "put", row.original.strike, activeExpiry)}
              aria-label={`Buy put at strike ${row.original.strike}`}
            >
              <NumericText value={p.ask} format="currency" precision={2} align="right" />
            </button>
          );
        },
      },
    ],
    [activeExpiry, onAddLeg]
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

  const cycleLabel = (e: number) => {
    const d = new Date(e);
    return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${d.getFullYear()}`;
  };

  return (
    <Card variant="outlined" className={cn("flex flex-col gap-3 p-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono font-medium">{underlying}</span>
        <span className="text-xs text-muted-foreground">{cycleLabel(activeExpiry)}</span>
        <span className="text-xs text-muted-foreground">Spot</span>
        <NumericText value={spot} format="currency" align="right" />
      </div>

      <Tabs
        value={String(activeExpiry)}
        onValueChange={(v) => {
          const e = Number(v);
          setActiveExpiry(e);
          onExpiryChange?.(e);
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

      <div className="grid grid-cols-[1fr_8rem_1fr] gap-2">
        <DataTable
          columns={callColumns}
          data={visibleRows}
          size="sm"
          variant="bordered"
          stickyHeader
          emptyMessage="No calls."
        />
        <div className="flex flex-col gap-2">
          <DataTable
            columns={strikeColumns}
            data={visibleRows}
            size="sm"
            variant="bordered"
            stickyHeader
          />
          <StrikesNavigator
            strikes={strikes}
            atmStrike={spot}
            selectedStrike={selectedStrike}
            onSelectStrike={setSelectedStrike}
            viewportRows={8}
            rowHeight={24}
            className="flex-1"
          />
        </div>
        <DataTable
          columns={putColumns}
          data={visibleRows}
          size="sm"
          variant="bordered"
          stickyHeader
          emptyMessage="No puts."
        />
      </div>
    </Card>
  );
}

OptionsChain.displayName = "OptionsChain";