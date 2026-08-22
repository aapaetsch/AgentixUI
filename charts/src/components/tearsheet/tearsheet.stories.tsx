import type { Meta, StoryObj } from "@storybook/react";

import { ChartCard } from "../chart-container";
import { DrawdownChart } from "../drawdown-chart";
import { EquityCurve } from "../equity-curve";
import { ReturnsChart } from "../returns-chart";
import { RiskChart } from "../risk-chart";
import { Tearsheet } from ".";

const equityData = Array.from({ length: 24 }, (_, index) => {
  const month = new Date(Date.UTC(2024, index, 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });
  const trend = index * 1.15;
  const cycle = Math.sin(index / 2.2) * 3.1;

  return {
    time: month,
    equity: 100 + trend + cycle,
    benchmark: 100 + index * 0.72 + Math.sin(index / 3.1) * 1.8,
  };
});

const monthlyReturns = [
  2.4, -1.1, 3.8, 1.6, -2.2, 4.5, 1.9, 0.8, -0.6, 3.2, 2.1, 1.4,
].map((value, index) => ({
  period: new Date(Date.UTC(2026, index, 1)).toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  }),
  value,
}));

const riskData = [
  { factor: "Market", portfolio: 72, limit: 85 },
  { factor: "Momentum", portfolio: 64, limit: 80 },
  { factor: "Concentration", portfolio: 41, limit: 70 },
  { factor: "Volatility", portfolio: 58, limit: 75 },
  { factor: "Liquidity", portfolio: 35, limit: 65 },
];

const meta = {
  title: "Charts/Reports/Tearsheet",
  component: Tearsheet,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <main className="min-h-screen bg-background p-6 text-foreground lg:p-10">
        <Story />
      </main>
    ),
  ],
  args: {
    title: "Momentum strategy",
    description: "Illustrative backtest through July 2026",
    metrics: [
      { label: "Total return", value: "+28.7%", description: "Net of modeled costs" },
      { label: "Sharpe ratio", value: "1.48", description: "Annualized" },
      { label: "Max drawdown", value: "−6.2%", description: "Peak to trough" },
      { label: "Win rate", value: "57.4%", description: "Across 94 trades" },
    ],
    equity: (
      <ChartCard title="Growth of $100" description="Strategy compared with benchmark">
        <EquityCurve
          aria-label="Strategy and benchmark equity curves"
          data={equityData}
          xKey="time"
          benchmarkKey="benchmark"
          height={280}
          valueFormatter={(value) => `$${value.toFixed(0)}`}
        />
      </ChartCard>
    ),
    drawdown: (
      <ChartCard title="Drawdown" description="Decline from the running equity peak">
        <DrawdownChart
          aria-label="Strategy drawdown over time"
          data={equityData}
          height={280}
        />
      </ChartCard>
    ),
    returns: (
      <ChartCard title="Monthly returns" description="Calendar returns for 2026">
        <ReturnsChart
          aria-label="Monthly strategy returns"
          data={monthlyReturns}
          height={280}
        />
      </ChartCard>
    ),
    risk: (
      <ChartCard title="Risk profile" description="Current exposure relative to limits">
        <RiskChart aria-label="Portfolio risk factor profile" data={riskData} height={280} />
      </ChartCard>
    ),
  },
} satisfies Meta<typeof Tearsheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  decorators: [
    (Story) => (
      <div className="dark min-h-screen bg-background p-6 text-foreground lg:p-10">
        <Story />
      </div>
    ),
  ],
};
