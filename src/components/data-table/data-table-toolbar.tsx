"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "../button";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { DataTableColumnVisibility } from "./data-table-column-visibility";
import type { DataTableToolbarFilter } from "./types";

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumn?: string;
  searchPlaceholder?: string;
  filters?: DataTableToolbarFilter[];
  content?: React.ReactNode;
  showColumnVisibility?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  searchColumn,
  searchPlaceholder = "Search...",
  filters = [],
  content,
  showColumnVisibility = true,
}: DataTableToolbarProps<TData>) {
  const searchValue = searchColumn
    ? ((table.getColumn(searchColumn)?.getFilterValue() as string | undefined) ?? "")
    : "";

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {searchColumn ? (
          <Input
            size="md"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value)}
            className="w-full sm:max-w-xs"
          />
        ) : null}
        {filters.map((filter) => {
          const column = table.getColumn(filter.columnId);
          if (!column) {
            return null;
          }

          const currentValue = (column.getFilterValue() as string | undefined) ?? "all";

          return (
            <Select
              key={filter.columnId}
              value={currentValue}
              onValueChange={(value) => column.setFilterValue(value === "all" ? undefined : value)}
            >
              <SelectTrigger size="sm" className="w-full sm:w-[12rem]">
                <SelectValue placeholder={filter.title} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.title}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        })}
        {isFiltered ? (
          <Button
            type="button"
            colorStyle="text"
            size="sm"
            className="h-11 self-start"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {content}
        {showColumnVisibility ? <DataTableColumnVisibility table={table} /> : null}
      </div>
    </div>
  );
}
