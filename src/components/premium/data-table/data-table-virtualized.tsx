"use client";

import * as React from "react";
import { flexRender, type Table } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import { cn } from "../../../lib/utils";
import { TableCell, TableHead, TableHeader, TableRow } from "../../free/table";
import type { DataTableSize, DataTableVariant } from "./types";

const rowHeightBySize: Record<DataTableSize, number> = {
  sm: 40,
  md: 48,
  lg: 56,
};

interface DataTableVirtualizedProps<TData> {
  table: Table<TData>;
  columnsLength: number;
  emptyMessage: string;
  height: number;
  overscan: number;
  size: DataTableSize;
  variant: DataTableVariant;
  stickyHeader?: boolean;
}

export function DataTableVirtualized<TData>({
  table,
  columnsLength,
  emptyMessage,
  height,
  overscan,
  size,
  variant,
  stickyHeader = true,
}: DataTableVirtualizedProps<TData>) {
  const rows = table.getRowModel().rows;
  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeightBySize[size],
    overscan,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className="overflow-auto" style={{ maxHeight: height }}>
      <table className="w-full table-fixed caption-bottom text-sm">
        <TableHeader className={cn(stickyHeader && "sticky top-0 z-10 bg-background") as string}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const align = header.column.columnDef.meta?.align ?? "left";
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      align === "center" && "text-center",
                      align === "right" && "text-right",
                      header.column.columnDef.meta?.headerClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        {rows.length ? (
          <tbody style={{ display: "grid", height: rowVirtualizer.getTotalSize(), position: "relative" }}>
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={cn(
                    "absolute left-0 top-0 table w-full table-fixed",
                    variant === "striped" && virtualRow.index % 2 === 1 && "bg-muted/20"
                  )}
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const align = cell.column.columnDef.meta?.align ?? "left";
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          size === "sm" && "py-2",
                          size === "lg" && "py-4",
                          align === "center" && "text-center",
                          align === "right" && "text-right",
                          cell.column.columnDef.meta?.cellClassName
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </tbody>
        ) : (
          <tbody>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columnsLength} className="h-28 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          </tbody>
        )}
      </table>
    </div>
  );
}
