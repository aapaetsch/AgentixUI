import type { Meta, StoryObj } from "@storybook/react";
import { BoxPlot } from ".";
const meta = { title: "Charts/Primitives/BoxPlot", component: BoxPlot, tags: ["autodocs"], args: { "aria-label": "Return distributions", data: [{category:"A",min:-8,q1:-2,median:1,q3:4,max:9},{category:"B",min:-5,q1:-1,median:2,q3:6,max:12}] } } satisfies Meta<typeof BoxPlot>;
export default meta; type Story = StoryObj<typeof meta>; export const Default: Story = {};
