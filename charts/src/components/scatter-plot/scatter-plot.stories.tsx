import type { Meta, StoryObj } from "@storybook/react";
import { ScatterPlot } from ".";
const meta = { title: "Charts/Primitives/ScatterPlot", component: ScatterPlot, tags: ["autodocs"], args: { "aria-label": "Risk versus return", xLabel: "Volatility", yLabel: "Return", series: [{ id: "funds", label: "Funds", data: [{x:8,y:6,size:80},{x:12,y:9,size:160},{x:18,y:11,size:240}] }] } } satisfies Meta<typeof ScatterPlot>;
export default meta; type Story = StoryObj<typeof meta>; export const SizeEncoded: Story = {};
