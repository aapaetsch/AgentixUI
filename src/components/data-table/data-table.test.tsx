import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, DataTableColumnHeader } from "./index";

interface Row {
  id: number;
  name: string;
}

const data: Row[] = [
  { id: 1, name: "Alpha" },
  { id: 2, name: "Bravo" },
  { id: 3, name: "Charlie" },
];

const columns: ColumnDef<Row>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    enableSorting: true,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableSorting: true,
  },
];

describe("DataTable", () => {
  it("renders column headers", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        showPagination={false}
        showColumnVisibility={false}
      />,
    );
    expect(screen.getByText("ID")).toBeDefined();
    expect(screen.getByText("Name")).toBeDefined();
  });

  it("renders a row for each datum", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        showPagination={false}
        showColumnVisibility={false}
      />,
    );
    expect(screen.getByText("Alpha")).toBeDefined();
    expect(screen.getByText("Bravo")).toBeDefined();
    expect(screen.getByText("Charlie")).toBeDefined();
  });

  it("sorts rows ascending then descending when the header is clicked twice", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        showPagination={false}
        showColumnVisibility={false}
      />,
    );

    const rows = () => screen.getAllByText(/Alpha|Bravo|Charlie/);
    // Default order is insertion order.
    expect(rows().map((n) => n.textContent)).toEqual(["Alpha", "Bravo", "Charlie"]);

    // Click "Name" header button to sort ascending.
    fireEvent.click(screen.getByRole("button", { name: /Name/i }));
    expect(rows().map((n) => n.textContent)).toEqual(["Alpha", "Bravo", "Charlie"]);

    // Click again to sort descending.
    fireEvent.click(screen.getByRole("button", { name: /Name/i }));
    expect(rows().map((n) => n.textContent)).toEqual(["Charlie", "Bravo", "Alpha"]);
  });

  it("renders a select-all checkbox and a per-row checkbox when row selection is enabled", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        enableRowSelection
        showPagination={false}
        showColumnVisibility={false}
      />,
    );
    // Header checkbox + 3 row checkboxes.
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBe(4);
    expect(screen.getByRole("checkbox", { name: /select all rows/i })).toBeDefined();
    // Each data row gets its own "Select row" checkbox.
    const rowCheckboxes = screen.getAllByRole("checkbox", { name: /select row/i });
    expect(rowCheckboxes.length).toBe(3);
  });

  it("toggles a row's selection when its checkbox is clicked", () => {
    const onRowSelectionChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        enableRowSelection
        onRowSelectionChange={onRowSelectionChange}
        showPagination={false}
        showColumnVisibility={false}
      />,
    );
    const rowCheckbox = screen.getAllByRole("checkbox", { name: /select row/i })[0];
    fireEvent.click(rowCheckbox as HTMLElement);
    // onRowSelectionChange fires with a RowSelectionState mapping the row id -> true.
    expect(onRowSelectionChange).toHaveBeenCalled();
    const lastCall = onRowSelectionChange.mock.calls[onRowSelectionChange.mock.calls.length - 1][0];
    expect(Object.values(lastCall).some((v) => v === true)).toBe(true);
  });
});