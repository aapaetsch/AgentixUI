import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { cn } from "../../lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/card";
import { DataTable } from "../../components/data-table";
import { NumericText } from "../../components/typography";
import { Skeleton } from "../../components/skeleton";
import { cn as _cn } from "../../lib/utils";

export interface BreakdownRow {
  label: string;
  value: number;
  weightPercent: number;
  pnl?: number;
}

export type AllocationView = "sector" | "assetClass" | "holding";

export interface AllocationBreakdownProps {
  /** Chart render slot keyed by view. The chart lib renders into this slot. */
  chart?: (view: AllocationView) => React.ReactNode;
  data: Partial<{
    sector: BreakdownRow[];
    assetClass: BreakdownRow[];
    holding: BreakdownRow[];
  }>;
  loading?: boolean;
  className?: string;
}

/**
 * AllocationBreakdown - Composed template showing allocation by
 * Sector / Asset Class / Holding.
 *
 * The chart is always a render slot — the template ships before the chart lib
 * lands. The breakdown table beside the chart uses `DataTable`.
 *
 * @example
 * ```tsx
 * <AllocationBreakdown data={{ sector: rows }} chart={(view) => <Treemap data={data[view]} />} />
 * ```
 */
export function AllocationBreakdown({
  chart,
  data,
  loading = false,
  className,
}: AllocationBreakdownProps) {
  const columns = React.useMemo<ColumnDef<BreakdownRow>[]>(
    () => [
      { id: "label", accessorKey: "label", header: "Name" },
      {
        id: "value",
        accessorKey: "value",
        header: "Value",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText value={row.original.value} format="currency" align="right" />
        ),
      },
      {
        id: "weightPercent",
        accessorKey: "weightPercent",
        header: "Weight %",
        meta: { align: "right" },
        cell: ({ row }) => (
          <NumericText value={row.original.weightPercent} format="percent" align="right" />
        ),
      },
      {
        id: "pnl",
        accessorKey: "pnl",
        header: "P&L",
        meta: { align: "right" },
        cell: ({ row }) =>
          row.original.pnl !== undefined ? (
            <NumericText value={row.original.pnl} format="currency" signed colorize align="right" />
          ) : null,
      },
    ],
    []
  );

  const renderView = (view: AllocationView) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-64">
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      );
    }
    const rows = data[view] ?? [];
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="min-h-48 border rounded-md bg-[hsl(var(--surface-container-low))]">
          {chart ? chart(view) : <div className="text-sm text-muted-foreground p-4 text-center">Chart slot empty</div>}
        </div>
        {rows.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No holdings to allocate.</div>
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            size="sm"
            variant="bordered"
          />
        )}
      </div>
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Allocation Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sector">
          <TabsList variant="pills">
            <TabsTrigger value="sector">Sector</TabsTrigger>
            <TabsTrigger value="assetClass">Asset Class</TabsTrigger>
            <TabsTrigger value="holding">Holding</TabsTrigger>
          </TabsList>
          <TabsContent value="sector">{renderView("sector")}</TabsContent>
          <TabsContent value="assetClass">{renderView("assetClass")}</TabsContent>
          <TabsContent value="holding">{renderView("holding")}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
AllocationBreakdown.displayName = "AllocationBreakdown";