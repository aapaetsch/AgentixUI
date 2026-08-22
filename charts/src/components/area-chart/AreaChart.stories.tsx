import type { Meta, StoryObj } from "@storybook/react";
import { AreaChart } from "./index";

const data = [
  { week: "W1", organic: 220, paid: 90 },
  { week: "W2", organic: 260, paid: 110 },
  { week: "W3", organic: 245, paid: 145 },
  { week: "W4", organic: 310, paid: 130 },
  { week: "W5", organic: 340, paid: 170 },
];

const meta: Meta<typeof AreaChart> = {
  title: "Charts/Primitives/AreaChart",
  component: AreaChart,
  tags: ["autodocs"],
  args: {
    "aria-label": "Organic and paid traffic by week",
    data,
    xKey: "week",
    series: [
      { dataKey: "organic", label: "Organic" },
      { dataKey: "paid", label: "Paid" },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof AreaChart>;
export const Default: Story = {};
export const Stacked: Story = { args: { stacked: true } };
