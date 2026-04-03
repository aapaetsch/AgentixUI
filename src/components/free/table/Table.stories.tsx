import type { Meta, StoryObj } from "@storybook/react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from ".";

const meta: Meta<typeof Table> = {
  title: "Free/Table",
  component: Table,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A light table primitive for display use-cases and as the structural base for more advanced components like the premium data table.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <div className="w-[42rem]">
      <Table>
        <TableCaption>Recent invoices for the last 30 days.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["INV-001", "Paid", "Card", "$250.00"],
            ["INV-002", "Pending", "Bank transfer", "$150.00"],
            ["INV-003", "Overdue", "PayPal", "$350.00"],
          ].map(([invoice, status, method, amount]) => (
            <TableRow key={invoice}>
              <TableCell className="font-medium">{invoice}</TableCell>
              <TableCell>{status}</TableCell>
              <TableCell>{method}</TableCell>
              <TableCell className="text-right">{amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
