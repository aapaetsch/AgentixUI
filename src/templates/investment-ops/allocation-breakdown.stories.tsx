import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { AllocationBreakdown } from "./allocation-breakdown";
import type { BreakdownRow, AllocationView } from "./allocation-breakdown";
import { Sparkline } from "../../components/sparkline";

/**
 * # AllocationBreakdown
 *
 * Composed template showing allocation by Sector / Asset Class / Holding.
 * The chart is always a render slot — the template ships before the chart lib
 * lands. The breakdown table beside the chart uses `DataTable`.
 */
const meta: Meta<typeof AllocationBreakdown> = {
  title: "Templates/Investment-Ops/AllocationBreakdown",
  component: AllocationBreakdown,
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof AllocationBreakdown>;

// ============================================================================
// Sample Data
// ============================================================================

const sectorRows: BreakdownRow[] = [
  { label: "Technology", value: 83176.7, weightPercent: 63.16, pnl: 40329.3 },
  { label: "Communication Services", value: 19404.8, weightPercent: 14.72, pnl: 6908.8 },
  { label: "Consumer Discretionary", value: 16154.45, weightPercent: 12.25, pnl: 1293.5 },
  { label: "Automotive", value: 5461.25, weightPercent: 4.14, pnl: -680.5 },
  { label: "Cash & Equivalents", value: 7002.8, weightPercent: 5.31, pnl: 0 },
];

const assetClassRows: BreakdownRow[] = [
  { label: "US Equities", value: 124197.2, weightPercent: 94.27, pnl: 47851.1 },
  { label: "Cash", value: 7002.8, weightPercent: 5.31, pnl: 0 },
  { label: "Bonds", value: 500, weightPercent: 0.38, pnl: 12.5 },
];

const holdingRows: BreakdownRow[] = [
  { label: "AAPL", value: 37464, weightPercent: 28.4, pnl: 9028 },
  { label: "MSFT", value: 33012, weightPercent: 25.05, pnl: 8008 },
  { label: "NVDA", value: 30736.5, weightPercent: 23.32, pnl: 12384.5 },
  { label: "META", value: 19404.8, weightPercent: 14.72, pnl: 6908.8 },
  { label: "GOOGL", value: 25171.5, weightPercent: 19.1, pnl: 4363.5 },
  { label: "AMZN", value: 10693.2, weightPercent: 8.12, pnl: 1974 },
];

const data = {
  sector: sectorRows,
  assetClass: assetClassRows,
  holding: holdingRows,
};

// A trivial "chart slot" placeholder using a Sparkline just to illustrate the
// composition — the real chart lib will render into this slot.
function ChartStub({ view }: { view: AllocationView }) {
  const rows = data[view] ?? [];
  const series = rows.map((r) => r.weightPercent);
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 gap-2">
      <Sparkline
        data={series.length ? series : [0]}
        width={220}
        height={120}
        variant="bar"
      />
      <span className="text-xs text-muted-foreground">
        Chart slot placeholder ({view})
      </span>
    </div>
  );
}

// ============================================================================
// Basic Stories
// ============================================================================

export const Default: Story = {
  render: () => (
    <div className="w-[48rem]">
      <AllocationBreakdown data={data} />
    </div>
  ),
};

export const WithChartSlot: Story = {
  render: () => (
    <div className="w-[48rem]">
      <AllocationBreakdown
        data={data}
        chart={(view) => <ChartStub view={view} />}
      />
    </div>
  ),
};

export const SingleView: Story = {
  render: () => (
    <div className="w-[48rem]">
      <AllocationBreakdown data={{ sector: sectorRows }} />
    </div>
  ),
};

// ============================================================================
// States
// ============================================================================

export const Empty: Story = {
  render: () => (
    <div className="w-[48rem]">
      <AllocationBreakdown data={{}} />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="w-[48rem]">
      <AllocationBreakdown data={{}} loading />
    </div>
  ),
};