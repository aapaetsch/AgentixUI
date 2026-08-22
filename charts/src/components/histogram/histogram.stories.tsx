import type { Meta, StoryObj } from "@storybook/react";
import { Histogram } from ".";
const meta = { title: "Charts/Primitives/Histogram", component: Histogram, tags: ["autodocs"], args: { "aria-label": "Distribution of daily returns", values: [-2.1,-1.4,-1.2,-.8,-.5,-.3,-.1,.1,.2,.3,.5,.7,.9,1.1,1.4,2.2], bins: 8 } } satisfies Meta<typeof Histogram>;
export default meta; type Story = StoryObj<typeof meta>; export const Default: Story = {};
