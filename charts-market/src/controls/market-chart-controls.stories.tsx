import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { MarketChartControls } from ".";

const meta = { title: "Charts Market/Controls", component: MarketChartControls, args: {
  symbol: "AAPL", interval: "1D", chartType: "candlestick", scaleMode: "normal",
  onSymbolChange: fn(), onIntervalChange: fn(), onChartTypeChange: fn(), onScaleModeChange: fn(),
  onFitContent: fn(), onScrollToRealtime: fn(),
} } satisfies Meta<typeof MarketChartControls>;

export default meta;
export type Story = StoryObj<typeof meta>;
export const Default: Story = {};
