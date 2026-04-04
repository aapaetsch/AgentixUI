"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type TableOptions,
  type Updater,
} from "@tanstack/react-table";

import { cn } from "../../lib/utils";
import { Checkbox } from "../checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableVirtualized } from "./data-table-virtualized";
import type { DataTableProps, DataTableRowAction, DataTableSize, DataTableVariant } from "./types";

const dataTableSurfaceVariants = cva("overflow-hidden rounded-[var(--radius)] bg-background", {
  variants: {
    variant: {
      default: "border border-border",
      bordered: "border-2 border-border",
      striped: "border border-border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === "function" ? (updater as (value: T) => T)(previous) : updater;
}

function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, OnChangeFn<T>] {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const setValue = React.useCallback<OnChangeFn<T>>(
    (updater) => {
      const nextValue = resolveUpdater(updater, value);
      if (controlledValue === undefined) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    },
    [controlledValue, onChange, value]
  );

  return [value, setValue];
}

function getSelectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: "__select",
    enableSorting: false,
    enableHiding: false,
    size: 40,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
        aria-label="Select row"
      />
    ),
    meta: {
      label: "Select",
      hideVisibilityToggle: true,
      align: "center",
      headerClassName: "w-12",
      cellClassName: "w-12",
    },
  };
}

function getActionsColumn<TData>(
  resolveActions: (row: TData) => DataTableRowAction<TData>[],
  label: string
): ColumnDef<TData> {
  return {
    id: "__actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => <DataTableRowActions row={row} actions={resolveActions(row.original)} label={label} />,
    meta: {
      label: "Actions",
      hideVisibilityToggle: true,
      align: "right",
      headerClassName: "w-14",
      cellClassName: "w-14",
    },
  };
}

function getCellPadding(size: DataTableSize) {
  if (size === "sm") return "px-2 py-2";
  if (size === "lg") return "px-4 py-4";
  return "px-3 py-3";
}

function getHeaderPadding(size: DataTableSize) {
  if (size === "sm") return "h-9 px-2";
  if (size === "lg") return "h-12 px-4";
  return "h-10 px-3";
}

function normalizeRowActions<TData>(
  rowActions: DataTableProps<TData>["rowActions"]
): ((row: TData) => DataTableRowAction<TData>[]) | null {
  if (!rowActions) return null;
  return typeof rowActions === "function" ? rowActions : () => rowActions;
}

function getToolbarSearchColumn<TData>(
  columns: ColumnDef<TData, unknown>[],
  searchColumn?: string
): string | undefined {
  if (searchColumn) return searchColumn;

  const searchableColumn = columns.find((column) => {
    const accessorKey = (column as { accessorKey?: unknown }).accessorKey;
    return Boolean(column.meta?.searchable && (column.id || typeof accessorKey === "string"));
  });

  if (!searchableColumn) return undefined;

  const accessorKey = (searchableColumn as { accessorKey?: unknown }).accessorKey;
  return searchableColumn.id ?? (typeof accessorKey === "string" ? accessorKey : undefined);
}

function renderStandardRows<TData>(
  rows: Row<TData>[],
  columnsLength: number,
  emptyMessage: string,
  size: DataTableSize,
  variant: DataTableVariant
) {
  if (!rows.length) {
    return (
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={columnsLength} className="h-28 text-center text-muted-foreground">
            {emptyMessage}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {rows.map((row, index) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() ? "selected" : undefined}
          className={cn(variant === "striped" && index % 2 === 1 && "bg-muted/20")}
        >
          {row.getVisibleCells().map((cell) => {
            const align = cell.column.columnDef.meta?.align ?? "left";
            return (
              <TableCell
                key={cell.id}
                className={cn(
                  getCellPadding(size),
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
      ))}
    </TableBody>
  );
}

function DataTableInner<TData, TValue = unknown>({
  columns,
  data,
  className,
  tableClassName,
  emptyMessage = "No results found.",
  caption,
  searchColumn,
  searchPlaceholder = "Search...",
  toolbarContent,
  toolbarFilters = [],
  enableRowSelection = false,
  rowActions,
  rowActionsLabel = "Open row actions",
  showColumnVisibility = true,
  showPagination = true,
  virtualize,
  virtualizationHeight = 420,
  virtualizationOverscan = 8,
  size = "md",
  variant = "default",
  stickyHeader = true,
  pageSizeOptions = [10, 20, 50, 100],
  initialPageSize = 10,
  getRowId,
  sorting,
  defaultSorting = [],
  onSortingChange,
  columnFilters,
  defaultColumnFilters = [],
  onColumnFiltersChange,
  columnVisibility,
  defaultColumnVisibility = {},
  onColumnVisibilityChange,
  rowSelection,
  defaultRowSelection = {},
  onRowSelectionChange,
  pagination,
  defaultPagination,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [sortingState, setSortingState] = useControllableState(sorting, defaultSorting, onSortingChange);
  const [columnFiltersState, setColumnFiltersState] = useControllableState(
    columnFilters,
    defaultColumnFilters,
    onColumnFiltersChange
  );
  const [columnVisibilityState, setColumnVisibilityState] = useControllableState(
    columnVisibility,
    defaultColumnVisibility,
    onColumnVisibilityChange
  );
  const [rowSelectionState, setRowSelectionState] = useControllableState(
    rowSelection,
    defaultRowSelection,
    onRowSelectionChange
  );
  const [paginationState, setPaginationState] = useControllableState<PaginationState>(
    pagination,
    defaultPagination ?? { pageIndex: 0, pageSize: initialPageSize },
    onPaginationChange
  );

  const resolveActions = React.useMemo(() => normalizeRowActions(rowActions), [rowActions]);

  const resolvedColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    const finalColumns: ColumnDef<TData, TValue>[] = [...columns];

    if (enableRowSelection) {
      finalColumns.unshift(getSelectionColumn<TData>() as ColumnDef<TData, TValue>);
    }

    if (resolveActions) {
      finalColumns.push(getActionsColumn<TData>(resolveActions, rowActionsLabel) as ColumnDef<TData, TValue>);
    }

    return finalColumns;
  }, [columns, enableRowSelection, resolveActions, rowActionsLabel]);

  const resolvedSearchColumn = React.useMemo(
    () => getToolbarSearchColumn(columns as ColumnDef<TData, unknown>[], searchColumn),
    [columns, searchColumn]
  );

  const table = useReactTable({
    data,
    columns: resolvedColumns,
    getRowId,
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSortingState,
    onColumnFiltersChange: setColumnFiltersState,
    onColumnVisibilityChange: setColumnVisibilityState,
    onRowSelectionChange: setRowSelectionState,
    onPaginationChange: setPaginationState,
    state: {
      sorting: sortingState,
      columnFilters: columnFiltersState,
      columnVisibility: columnVisibilityState,
      rowSelection: rowSelectionState,
      pagination: paginationState,
    },
  } as TableOptions<TData>);

  const shouldVirtualize = virtualize ?? data.length > 100;
  const showToolbar = Boolean(resolvedSearchColumn || toolbarFilters.length || toolbarContent || showColumnVisibility);
  const visibleColumnCount = table.getVisibleLeafColumns().length;

  return (
    <div className={cn(dataTableSurfaceVariants({ variant }), className)}>
      {showToolbar ? (
        <DataTableToolbar
          table={table}
          searchColumn={resolvedSearchColumn}
          searchPlaceholder={searchPlaceholder}
          filters={toolbarFilters}
          content={toolbarContent}
          showColumnVisibility={showColumnVisibility}
        />
      ) : null}

      {shouldVirtualize ? (
        <DataTableVirtualized
          table={table}
          columnsLength={visibleColumnCount}
          emptyMessage={emptyMessage}
          height={virtualizationHeight}
          overscan={virtualizationOverscan}
          size={size}
          variant={variant}
          stickyHeader={stickyHeader}
        />
      ) : (
        <Table className={cn("w-full", tableClassName)}>
          {caption ? <TableCaption>{caption}</TableCaption> : null}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const align = header.column.columnDef.meta?.align ?? "left";
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        getHeaderPadding(size),
                        stickyHeader && "sticky top-0 z-[1] bg-background",
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
          {renderStandardRows(table.getRowModel().rows, visibleColumnCount, emptyMessage, size, variant)}
        </Table>
      )}

      {showPagination ? <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} /> : null}
    </div>
  );
}

const DataTable = React.memo(DataTableInner) as typeof DataTableInner;

export { DataTable, dataTableSurfaceVariants, DataTableColumnHeader, DataTableToolbar, DataTablePagination, DataTableRowActions };
export type { DataTableProps, DataTableRowAction, DataTableSize, DataTableVariant } from "./types";
