import type { Meta, StoryObj } from "@storybook/react";
import { LineChart } from "./index";

const data = [
  { month: "Jan", portfolio: 100, benchmark: 100 },
  { month: "Feb", portfolio: 106, benchmark: 103 },
  { month: "Mar", portfolio: 104, benchmark: 105 },
  { month: "Apr", portfolio: 113, benchmark: 108 },
  { month: "May", portfolio: 119, benchmark: 111 },
  { month: "Jun", portfolio: 126, benchmark: 115 },
];

const meta: Meta<typeof LineChart> = {
  title: "Charts/Primitives/LineChart",
  component: LineChart,
  tags: ["autodocs"],
  args: {
    "aria-label": "Portfolio and benchmark performance by month",
    data,
    xKey: "month",
    series: [
      { dataKey: "portfolio", label: "Portfolio" },
      { dataKey: "benchmark", label: "Benchmark" },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof LineChart>;

export const Default: Story = {};
export const WithDots: Story = { args: { showDots: true } };
export const Compact: Story = { args: { height: 208, showLegend: false } };
