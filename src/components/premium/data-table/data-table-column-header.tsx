"use client";

import * as React from "react";
import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Button } from "../../free/button";

export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn("truncate", className)} {...props}>
        {title}
      </div>
    );
  }

  const sorted = column.getIsSorted();
  const icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  const Icon = icon;

  return (
    <div className={cn("flex items-center gap-1", className)} {...props}>
      <Button
        type="button"
        colorStyle="ghost"
        size="sm"
        className="-ml-2 h-8 px-2 text-sm"
        onClick={() => column.toggleSorting(sorted === "asc")}
      >
        <span className="truncate">{title}</span>
        <Icon className="size-4" />
      </Button>
    </div>
  );
}
