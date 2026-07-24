import type * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  RowData,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

export type DataTableSize = "sm" | "md" | "lg";
export type DataTableVariant = "default" | "bordered" | "striped";

export interface DataTableRowAction<TData> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  destructive?: boolean;
  disabled?: boolean | ((row: TData) => boolean);
  hidden?: boolean | ((row: TData) => boolean);
  onSelect: (row: TData) => void;
}

export interface DataTableToolbarFilterOption {
  label: string;
  value: string;
}

export interface DataTableToolbarFilter {
  columnId: string;
  title: string;
  options: DataTableToolbarFilterOption[];
}

export interface DataTableColumnMeta<TData> {
  label?: string;
  align?: "left" | "center" | "right";
  searchable?: boolean;
  hideVisibilityToggle?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  filterOptions?: DataTableToolbarFilterOption[];
  formatValue?: (row: Row<TData>) => React.ReactNode;
}

export interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  tableClassName?: string;
  emptyMessage?: string;
  caption?: string;
  searchColumn?: string;
  searchPlaceholder?: string;
  toolbarContent?: React.ReactNode;
  toolbarFilters?: DataTableToolbarFilter[];
  enableRowSelection?: boolean;
  rowActions?: DataTableRowAction<TData>[] | ((row: TData) => DataTableRowAction<TData>[]);
  rowActionsLabel?: string;
  /** Optional detail row rendered directly below matching data rows. */
  renderSubRow?: (row: TData) => React.ReactNode;
  /** Returns whether the optional detail row is expanded. */
  isRowExpanded?: (row: TData) => boolean;
  showColumnVisibility?: boolean;
  showPagination?: boolean;
  virtualize?: boolean;
  virtualizationHeight?: number;
  virtualizationOverscan?: number;
  size?: DataTableSize;
  variant?: DataTableVariant;
  stickyHeader?: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  sorting?: SortingState;
  defaultSorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  columnFilters?: ColumnFiltersState;
  defaultColumnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  columnVisibility?: VisibilityState;
  defaultColumnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  rowSelection?: RowSelectionState;
  defaultRowSelection?: RowSelectionState;
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void;
  pagination?: PaginationState;
  defaultPagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
}

declare module "@tanstack/react-table" {
  // The generic params must match @tanstack/table-core's ColumnMeta exactly
  // (TData extends RowData, TValue). TValue is unused by our meta shape but is
  // required by the augmentation signature; we disable the unused-var rule
  // for this declaration.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> extends DataTableColumnMeta<TData> {}
}
