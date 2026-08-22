import type { Meta, StoryObj } from "@storybook/react";
import { BarChart } from "./index";

const data = [
  { quarter: "Q1", product: 84, services: 48 },
  { quarter: "Q2", product: 96, services: 55 },
  { quarter: "Q3", product: 112, services: 62 },
  { quarter: "Q4", product: 128, services: 70 },
];

const meta: Meta<typeof BarChart> = {
  title: "Charts/Primitives/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  args: {
    "aria-label": "Revenue by quarter and business line",
    data,
    xKey: "quarter",
    series: [
      { dataKey: "product", label: "Product" },
      { dataKey: "services", label: "Services" },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof BarChart>;
export const Grouped: Story = {};
export const Stacked: Story = { args: { stacked: true } };
