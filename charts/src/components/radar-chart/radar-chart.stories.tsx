import type { Meta, StoryObj } from "@storybook/react";
import { RadarChart } from ".";
const meta = { title: "Charts/Primitives/RadarChart", component: RadarChart, tags: ["autodocs"], args: { "aria-label": "Factor comparison", categoryKey: "factor", data: [{factor:"Value",a:80,b:55},{factor:"Quality",a:62,b:78},{factor:"Momentum",a:70,b:68},{factor:"Low volatility",a:45,b:72}], series: [{dataKey:"a",label:"Fund A"},{dataKey:"b",label:"Fund B"}] } } satisfies Meta<typeof RadarChart>;
export default meta; type Story = StoryObj<typeof meta>; export const MultiSeries: Story = {};
