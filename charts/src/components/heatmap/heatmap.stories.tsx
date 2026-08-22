import type { Meta, StoryObj } from "@storybook/react";
import { Heatmap } from ".";
const meta = { title: "Charts/Primitives/Heatmap", component: Heatmap, tags: ["autodocs"], args: { "aria-label": "Hourly activity by weekday", data: ["Mon", "Tue", "Wed", "Thu", "Fri"].flatMap((y, yi) => ["9", "12", "15", "18"].map((x, xi) => ({ x, y, value: (yi + 1) * (xi + 2) }))) } } satisfies Meta<typeof Heatmap>;
export default meta; type Story = StoryObj<typeof meta>; export const Default: Story = {};
