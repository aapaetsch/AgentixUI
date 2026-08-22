import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { MarketChart } from ".";
import { smaIndicator, rsiIndicator } from "../../indicators";

const data = Array.from({ length: 90 }, (_, index) => {
  const open = 186 + Math.sin(index / 7) * 5 + index * 0.08;
  const close = open + Math.sin(index * 1.7) * 1.8;
  return {
    time: Math.floor(Date.UTC(2026, 0, index + 1) / 1000), open, close,
    high: Math.max(open, close) + 1.2, low: Math.min(open, close) - 1.1, volume: 35_000_000 + index * 175_000,
  };
});

const meta = { title: "Charts Market/MarketChart", component: MarketChart, parameters: { layout: "fullscreen" }, args: {
  data, symbol: "AAPL", interval: "1D", chartType: "candlestick", scaleMode: "normal", height: 520,
  markers: [{ id: "earnings", time: data[45].time, position: "aboveBar", shape: "circle", text: "E", color: "#7c3aed" }],
} } satisfies Meta<typeof MarketChart>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Candlesticks: Story = {};
export const OhlcBars: Story = { args: { chartType: "bar" } };
export const Line: Story = { args: { chartType: "line", showVolume: false } };
export const Area: Story = { args: { chartType: "area", showVolume: false } };
export const Baseline: Story = { args: { chartType: "baseline", showVolume: false } };
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { data: [] } };
export const ErrorState: Story = { args: { error: "Price history could not be loaded." } };
export const WithAnalysis: Story = { args: {
  indicators: [
    { id: "sma-20", definition: smaIndicator, parameters: { period: 20 }, visible: true },
    { id: "rsi-14", definition: rsiIndicator, parameters: { period: 14 }, visible: true },
  ],
  overlays: [
    { id: "alert", type: "price-alert", version: 1, visible: true, parameters: { price: 198, color: "#7c3aed", label: "Alert" } },
  ],
} };
export const ExtendedSessions: Story = { args: {
  extendedSessions: [
    { id: "premarket", from: data[10].time, to: data[17].time, label: "Pre-market" },
    { id: "after-hours", from: data[55].time, to: data[62].time, label: "After hours" },
  ],
} };
export const Dark: Story = { globals: { backgrounds: { value: "dark" } }, decorators: [(Story) => <div className="dark bg-background p-4"><Story /></div>] };
export const TouchSizedControls: Story = { parameters: { viewport: { defaultViewport: "mobile2" } }, args: { height: 420, dataTable: "none" } };
export const CustomRenderLayer: Story = { args: { renderLayers: [{ id: "watermark", zIndex: 15, draw: ({ canvas, panes, theme }) => { const price = panes.find((pane) => pane.id === "price"); if (!price) return; canvas.save(); canvas.globalAlpha = 0.1; canvas.fillStyle = theme.text; canvas.font = "600 32px ui-sans-serif"; canvas.fillText("FIRST PARTY", 24, price.top + 48); canvas.restore(); } }] } };
export const ControlledIndicatorsAndPanes: Story = { render: (args) => {
  const [indicators, setIndicators] = React.useState(args.indicators ?? []); const [paneSizes, setPaneSizes] = React.useState<Record<string, number>>({ price: 0.65, volume: 0.15, "rsi-14": 0.2 });
  return <MarketChart {...args} indicators={indicators} onIndicatorsChange={setIndicators} paneSizes={paneSizes} onPaneSizesChange={setPaneSizes} />;
}, args: { indicators: [{ id: "rsi-14", definition: rsiIndicator, parameters: { period: 14 }, visible: true }] } };
