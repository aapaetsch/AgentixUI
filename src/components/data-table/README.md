# DataTable

A premium data table built on TanStack Table and the existing `@agentix/ui` primitives. It provides sorting, filtering, pagination, row selection, column visibility toggles, row actions, and optional virtualization for larger datasets.

## Features

- Sortable columns with reusable `DataTableColumnHeader`
- Text search and select-based toolbar filters
- Built-in pagination controls with page-size selection
- Optional row selection with checkbox column
- Optional row actions using the shared `DropdownMenu`
- Column visibility toggles
- Virtualized row rendering for large datasets
- Controlled or uncontrolled state for sorting, filters, visibility, selection, and pagination

## Basic Usage

```tsx
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@agentix/ui";

type User = {
  id: string;
  name: string;
  email: string;
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    meta: { label: "Name", searchable: true },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "email",
    meta: { label: "Email", searchable: true },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
];

<DataTable columns={columns} data={users} searchColumn="email" enableRowSelection />
```

## Row Actions

```tsx
<DataTable
  columns={columns}
  data={users}
  rowActions={[
    {
      id: "copy-id",
      label: "Copy ID",
      onSelect: (row) => navigator.clipboard.writeText(row.id),
    },
    {
      id: "delete",
      label: "Delete",
      destructive: true,
      onSelect: (row) => deleteUser(row.id),
    },
  ]}
/>
```

## Column Filters

```tsx
<DataTable
  columns={columns}
  data={users}
  searchColumn="email"
  toolbarFilters={[
    {
      columnId: "status",
      title: "status",
      options: [
        { label: "Active", value: "active" },
        { label: "Invited", value: "invited" },
      ],
    },
  ]}
/>
```

## Virtualization

```tsx
<DataTable
  columns={columns}
  data={largeDataset}
  virtualize
  virtualizationHeight={480}
/>
```

## Notes

- Use `meta.searchable` and `meta.label` in your column definitions to improve the built-in toolbar and visibility toggle labels.
- The component uses page-level selection for the header checkbox, which mirrors the common TanStack + shadcn data-table pattern.
- Virtualization automatically enables when `data.length > 100` unless `virtualize` is explicitly set.
- Consumers can fully control table state by passing the matching state objects and change callbacks.
