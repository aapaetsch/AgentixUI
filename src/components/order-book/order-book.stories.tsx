import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OrderBook, OrderBookSkeleton } from "./index";
import type { OrderBookLevel } from "../../lib/finance-types";

const meta: Meta<typeof OrderBook> = {
  title: "Finance/OrderBook",
  component: OrderBook,
  tags: ["autodocs"],
  argTypes: {
    maxRows: { control: { type: "number", min: 1, max: 50, step: 1 } },
    precision: { control: { type: "number", min: 0, max: 6, step: 1 } },
    currency: { control: "text" },
    highlightLast: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof OrderBook>;

function makeLevels(base: number, count: number, tick: number, ascending: boolean): OrderBookLevel[] {
  const levels: OrderBookLevel[] = [];
  let cumulative = 0;
  for (let i = 0; i < count; i++) {
    const price = ascending ? base + i * tick : base - i * tick;
    const size = Math.round(100 + Math.random() * 900);
    cumulative += size;
    levels.push({ price, size, total: cumulative });
  }
  return levels;
}

const bids = makeLevels(100, 15, 0.01, false);
const asks = makeLevels(100.05, 15, 0.01, true);

export const StaticSnapshot: Story = {
  render: (args) => (
    <div className="w-72 border rounded-md">
      <OrderBook bids={bids} asks={asks} {...args} />
    </div>
  ),
};

export const MaxRows5: Story = {
  name: "Custom maxRows (5)",
  render: () => (
    <div className="w-72 border rounded-md">
      <OrderBook bids={bids} asks={asks} maxRows={5} />
    </div>
  ),
};

export const MaxRows30: Story = {
  name: "Custom maxRows (30)",
  render: () => (
    <div className="w-72 border rounded-md">
      <OrderBook bids={makeLevels(100, 30, 0.01, false)} asks={makeLevels(100.05, 30, 0.01, true)} maxRows={30} />
    </div>
  ),
};

export const Loading: Story = {
  name: "Loading Skeleton",
  render: () => (
    <div className="w-72 border rounded-md">
      <OrderBookSkeleton rows={15} />
    </div>
  ),
};

export const Empty: Story = {
  name: "Empty State",
  render: () => (
    <div className="w-72 border rounded-md">
      <OrderBook bids={[]} asks={[]} />
    </div>
  ),
};

export const ClickHandler: Story = {
  name: "Click Handler",
  render: () => {
    const [clicked, setClicked] = React.useState<string | null>(null);
    return (
      <div className="flex gap-4">
        <div className="w-72 border rounded-md">
          <OrderBook
            bids={bids}
            asks={asks}
            onLevelClick={(lvl, side) => setClicked(`${side} @ ${lvl.price} size ${lvl.size}`)}
          />
        </div>
        <div className="text-sm text-muted-foreground self-start">
          Last click: {clicked ?? "none"}
        </div>
      </div>
    );
  },
};

export const StressHighFrequency: Story = {
  name: "Stress — High-Frequency Stream",
  render: () => {
    const [liveBids, setLiveBids] = React.useState<OrderBookLevel[]>(bids);
    const [liveAsks, setLiveAsks] = React.useState<OrderBookLevel[]>(asks);

    React.useEffect(() => {
      const id = window.setInterval(() => {
        setLiveBids((prev) =>
          prev.map((lvl) => ({
            ...lvl,
            size: Math.max(50, Math.round(lvl.size + (Math.random() - 0.5) * 200)),
          }))
        );
        setLiveAsks((prev) =>
          prev.map((lvl) => ({
            ...lvl,
            size: Math.max(50, Math.round(lvl.size + (Math.random() - 0.5) * 200)),
          }))
        );
      }, 100);
      return () => window.clearInterval(id);
    }, []);

    return (
      <div className="w-72 border rounded-md">
        <OrderBook bids={liveBids} asks={liveAsks} maxRows={15} highlightLast />
      </div>
    );
  },
};