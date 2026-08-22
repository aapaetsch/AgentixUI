import type { Meta, StoryObj } from "@storybook/react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartCard,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./index";

const data = [
  { month: "Jan", revenue: 42, cost: 30 },
  { month: "Feb", revenue: 58, cost: 34 },
  { month: "Mar", revenue: 51, cost: 38 },
  { month: "Apr", revenue: 72, cost: 41 },
];
const config = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  cost: { label: "Cost", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const meta: Meta<typeof ChartContainer> = {
  title: "Charts/Foundation/ChartContainer",
  component: ChartContainer,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ChartContainer>;

export const Composed: Story = {
  render: () => (
    <ChartCard title="Operating performance" description="Four-month overview" className="w-[42rem]">
      <ChartContainer config={config} className="h-72" aria-label="Revenue and cost by month">
        <LineChart accessibilityLayer data={data} margin={{ left: 8, right: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
          <Line dataKey="cost" stroke="var(--color-cost)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  ),
};
