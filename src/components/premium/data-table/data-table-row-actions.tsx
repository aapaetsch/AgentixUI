"use client";

import * as React from "react";
import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "../../free/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../free/dropdown-menu";
import type { DataTableRowAction } from "./types";

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions: DataTableRowAction<TData>[];
  label?: string;
}

export function DataTableRowActions<TData>({
  row,
  actions,
  label = "Open row actions",
}: DataTableRowActionsProps<TData>) {
  const visibleActions = actions.filter((action) =>
    typeof action.hidden === "function" ? !action.hidden(row.original) : !action.hidden
  );

  if (!visibleActions.length) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          colorStyle="ghost"
          size="sm"
          iconOnly
          className="h-8 w-8"
          aria-label={label}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Row actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {visibleActions.map((action) => {
          const disabled = typeof action.disabled === "function" ? action.disabled(row.original) : action.disabled;
          return (
            <DropdownMenuItem
              key={action.id}
              icon={action.icon}
              variant={action.destructive ? "destructive" : "default"}
              disabled={disabled}
              onSelect={() => action.onSelect(row.original)}
            >
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
