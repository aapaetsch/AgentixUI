import type { Meta, StoryObj } from "@storybook/react";
import { DonutChart } from ".";
const meta = { title: "Charts/Primitives/DonutChart", component: DonutChart, tags: ["autodocs"], args: { "aria-label": "Portfolio allocation", centerLabel: "100%", data: [{name:"Equity",value:62},{name:"Bonds",value:24},{name:"Cash",value:14}] } } satisfies Meta<typeof DonutChart>;
export default meta; type Story = StoryObj<typeof meta>; export const Default: Story = {};
