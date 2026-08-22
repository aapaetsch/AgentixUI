import type { Meta, StoryObj } from "@storybook/react";
import { Treemap } from ".";
const meta = { title: "Charts/Primitives/Treemap", component: Treemap, tags: ["autodocs"], args: { "aria-label": "Market capitalization by sector", data: [{name:"Technology",value:42},{name:"Financials",value:25},{name:"Healthcare",value:18},{name:"Other",value:15}] } } satisfies Meta<typeof Treemap>;
export default meta; type Story = StoryObj<typeof meta>; export const Default: Story = {};
