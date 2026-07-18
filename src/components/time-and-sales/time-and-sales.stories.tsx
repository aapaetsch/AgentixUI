import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TimeAndSales } from "./index";
import type { Trade } from "../../lib/finance-types";

const meta: Meta<typeof TimeAndSales> = {
  title: "Finance/TimeAndSales",
  component: TimeAndSales,
  tags: ["autodocs"],
  argTypes: {
    maxRows: { control: { type: "number", min: 1, max: 500, step: 1 } },
    autoScroll: { control: "boolean" },
    precision: { control: { type: "number", min: 0, max: 6, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof TimeAndSales>;

const baseTime = Date.now() - 60_000;
const staticTrades: Trade[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `t-${i}`,
  time: baseTime + i * 2000,
  price: 100 + (Math.random() - 0.5) * 2,
  size: Math.round(50 + Math.random() * 950),
  side: i % 3 === 0 ? "buy" : i % 3 === 1 ? "sell" : "unknown",
  flags: i % 7 === 0 ? ["block"] : i % 5 === 0 ? ["uptick"] : undefined,
}));

export const StaticList: Story = {
  render: (args) => (
    <div className="w-96 border rounded-md">
      <TimeAndSales trades={staticTrades} {...args} />
    </div>
  ),
};

export const AutoScrollOff: Story = {
  name: "AutoScroll Off",
  render: () => (
    <div className="w-96 border rounded-md">
      <TimeAndSales trades={staticTrades} autoScroll={false} />
    </div>
  ),
};

export const BlockTrades: Story = {
  name: "Block Trades Highlighted",
  render: () => (
    <div className="w-96 border rounded-md">
      <TimeAndSales
        trades={staticTrades.map((t, i) =>
          i % 4 === 0 ? { ...t, flags: ["block"] } : t
        )}
      />
    </div>
  ),
};

export const ClickHandler: Story = {
  name: "Click Handler",
  render: () => {
    const [last, setLast] = React.useState<string | null>(null);
    return (
      <div className="flex gap-4">
        <div className="w-96 border rounded-md">
          <TimeAndSales trades={staticTrades} onTradeClick={(t) => setLast(`${t.side} ${t.size} @ ${t.price}`)} />
        </div>
        <div className="text-sm text-muted-foreground self-start">
          Last: {last ?? "none"}
        </div>
      </div>
    );
  },
};

export const Empty: Story = {
  name: "Empty State",
  render: () => (
    <div className="w-96 border rounded-md">
      <TimeAndSales trades={[]} />
    </div>
  ),
};

export const Loading: Story = {
  name: "Loading State",
  render: () => (
    <div className="w-96 border rounded-md">
      <TimeAndSales trades={[]} loading />
    </div>
  ),
};

export const StreamSimulated: Story = {
  name: "Simulated Stream (autoscroll on)",
  render: () => {
    const [trades, setTrades] = React.useState<Trade[]>([]);
    const counter = React.useRef(0);
    React.useEffect(() => {
      const id = window.setInterval(() => {
        counter.current += 1;
        const next: Trade = {
          id: `t-${counter.current}`,
          time: Date.now(),
          price: 100 + (Math.random() - 0.5) * 2,
          size: Math.round(50 + Math.random() * 950),
          side: Math.random() > 0.5 ? "buy" : "sell",
          flags: counter.current % 10 === 0 ? ["block"] : undefined,
        };
        setTrades((prev) => [...prev.slice(-99), next]);
      }, 400);
      return () => window.clearInterval(id);
    }, []);
    return (
      <div className="w-96 border rounded-md">
        <TimeAndSales trades={trades} maxRows={100} autoScroll />
      </div>
    );
  },
};