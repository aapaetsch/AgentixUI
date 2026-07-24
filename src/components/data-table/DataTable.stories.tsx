import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";

import { Badge } from "../badge";
import { DataTable, DataTableColumnHeader } from ".";

interface PaymentRow {
  id: string;
  customer: string;
  email: string;
  status: "pending" | "processing" | "success" | "failed";
  amount: number;
  location: string;
}

const baseData: PaymentRow[] = [
  { id: "INV-1001", customer: "Ken Foster", email: "ken99@example.com", status: "success", amount: 316, location: "New York" },
  { id: "INV-1002", customer: "Abe Stone", email: "abe45@example.com", status: "success", amount: 242, location: "London" },
  { id: "INV-1003", customer: "Monserrat Silva", email: "monserrat44@example.com", status: "processing", amount: 837, location: "Sao Paulo" },
  { id: "INV-1004", customer: "Silas Knight", email: "silas22@example.com", status: "success", amount: 874, location: "Berlin" },
  { id: "INV-1005", customer: "Carmella Reed", email: "carmella@example.com", status: "failed", amount: 721, location: "Toronto" },
  { id: "INV-1006", customer: "June Keller", email: "junek@example.com", status: "pending", amount: 128, location: "Tokyo" },
  { id: "INV-1007", customer: "Harper Day", email: "harperd@example.com", status: "processing", amount: 462, location: "Austin" },
  { id: "INV-1008", customer: "Mina Scott", email: "mina@example.com", status: "success", amount: 583, location: "Paris" },
  { id: "INV-1009", customer: "Noah Vale", email: "noah@example.com", status: "pending", amount: 219, location: "Chicago" },
  { id: "INV-1010", customer: "Rhea Collins", email: "rhea@example.com", status: "failed", amount: 945, location: "Sydney" },
  { id: "INV-1011", customer: "Luca Ford", email: "luca@example.com", status: "success", amount: 388, location: "Madrid" },
  { id: "INV-1012", customer: "Tess Howard", email: "tess@example.com", status: "processing", amount: 671, location: "Seattle" },
];

const largeDataset: PaymentRow[] = Array.from({ length: 250 }, (_, index) => ({
  id: `INV-${2000 + index}`,
  customer: `Customer ${index + 1}`,
  email: `customer${index + 1}@example.com`,
  status: (["pending", "processing", "success", "failed"] as const)[index % 4],
  amount: 100 + index * 7,
  location: ["New York", "Berlin", "Toronto", "Tokyo", "Paris"][index % 5],
}));

function StatusBadge({ status }: { status: PaymentRow["status"] }) {
  const variant =
    status === "success"
      ? "success"
      : status === "failed"
        ? "destructive"
        : status === "processing"
          ? "secondary"
          : "warning";

  return (
    <Badge variant={variant} size="large" className="capitalize">
      {status}
    </Badge>
  );
}

const columns: ColumnDef<PaymentRow>[] = [
  {
    accessorKey: "customer",
    meta: { label: "Customer", searchable: true },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => <div className="font-medium">{row.original.customer}</div>,
  },
  {
    accessorKey: "email",
    meta: { label: "Email", searchable: true },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.original.email}</div>,
  },
  {
    accessorKey: "status",
    meta: {
      label: "Status",
      filterOptions: [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Success", value: "success" },
        { label: "Failed", value: "failed" },
      ],
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "amount",
    meta: { label: "Amount", align: "right" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.original.amount),
  },
  {
    accessorKey: "location",
    meta: { label: "Location" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
  },
];

const meta: Meta<typeof DataTable<PaymentRow>> = {
  title: "Data/DataTable",
  component: DataTable,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A premium, TanStack-powered data table with library-native controls for sorting, filtering, pagination, selection, column visibility, row actions, and virtualization.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DataTable<PaymentRow>>;

export const Default: Story = {
  args: {
    columns,
    data: baseData,
    searchColumn: "email",
    searchPlaceholder: "Filter email addresses...",
    toolbarFilters: [
      {
        columnId: "status",
        title: "status",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Processing", value: "processing" },
          { label: "Success", value: "success" },
          { label: "Failed", value: "failed" },
        ],
      },
    ],
    enableRowSelection: true,
    rowActions: [
      {
        id: "copy-id",
        label: "Copy invoice ID",
        icon: <Copy className="size-4" />,
        onSelect: (row) => navigator.clipboard?.writeText(row.id),
      },
      {
        id: "view-details",
        label: "View details",
        icon: <Eye className="size-4" />,
        onSelect: (row) => console.info("View", row.id),
      },
    ],
    variant: "bordered",
  },
};

export const Compact: Story = {
  args: {
    columns,
    data: baseData,
    searchColumn: "customer",
    enableRowSelection: true,
    size: "sm",
    variant: "striped",
  },
};

export const Virtualized: Story = {
  args: {
    columns,
    data: largeDataset,
    searchColumn: "customer",
    virtualize: true,
    virtualizationHeight: 480,
    toolbarFilters: [
      {
        columnId: "status",
        title: "status",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Processing", value: "processing" },
          { label: "Success", value: "success" },
          { label: "Failed", value: "failed" },
        ],
      },
    ],
    enableRowSelection: true,
  },
};

export const ControlledSelection: Story = {
  render: () => {
    const [rowSelection, setRowSelection] = React.useState({});

    return (
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={baseData}
          searchColumn="customer"
          enableRowSelection
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
        <p className="text-sm text-muted-foreground">
          Selected row ids: {Object.keys(rowSelection).filter((key) => (rowSelection as Record<string, boolean>)[key]).join(", ") || "none"}
        </p>
      </div>
    );
  },
};
