import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { LegBuilderRow } from "./index";
import type { OptionLeg } from "../../lib/finance-types";

const meta: Meta<typeof LegBuilderRow> = {
  title: "Components/LegBuilderRow",
  component: LegBuilderRow,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LegBuilderRow>;

const strikes = [380, 390, 400, 410, 420, 430, 440];
const expiries = [
  Date.now() + 7 * 86_400_000,
  Date.now() + 30 * 86_400_000,
  Date.now() + 60 * 86_400_000,
];

export const Controlled: Story = {
  render: () => {
    const [leg, setLeg] = useState<OptionLeg>({
      id: "1",
      side: "buy",
      type: "call",
      strike: 400,
      expiry: expiries[1]!,
      contracts: 1,
    });
    return (
      <div className="w-[40rem]">
        <LegBuilderRow
          value={leg}
          onChange={setLeg}
          strikes={strikes}
          expiries={expiries}
          onDelete={() => alert("delete")}
          onDuplicate={() => alert("duplicate")}
        />
        <pre className="mt-4 text-xs">{JSON.stringify(leg, null, 2)}</pre>
      </div>
    );
  },
};

export const Put: Story = {
  render: () => {
    const [leg, setLeg] = useState<OptionLeg>({
      id: "2",
      side: "sell",
      type: "put",
      strike: 380,
      expiry: expiries[1]!,
      contracts: 2,
    });
    return (
      <div className="w-[40rem]">
        <LegBuilderRow value={leg} onChange={setLeg} strikes={strikes} />
      </div>
    );
  },
};

export const Compact: Story = {
  render: () => {
    const [leg, setLeg] = useState<OptionLeg>({
      id: "3",
      side: "buy",
      type: "call",
      strike: 410,
      expiry: expiries[1]!,
      contracts: 1,
    });
    return (
      <div className="w-[36rem]">
        <LegBuilderRow
          value={leg}
          onChange={setLeg}
          strikes={strikes}
          compact
        />
      </div>
    );
  },
};

export const SideFlipKeepsContractsConsistent: Story = {
  name: "Side flip flips contracts sign",
  render: () => {
    const [leg, setLeg] = useState<OptionLeg>({
      id: "flip",
      side: "sell",
      type: "put",
      strike: 400,
      expiry: expiries[1]!,
      contracts: -2,
    });
    return (
      <div className="w-[40rem]">
        <p className="mb-2 text-xs text-muted-foreground">
          Start as SELL × 2 (contracts = -2). Click <strong>Buy</strong> —
          contracts should flip to +2. Click <strong>Sell</strong> again —
          back to -2.
        </p>
        <LegBuilderRow value={leg} onChange={setLeg} strikes={strikes} />
        <pre className="mt-4 text-xs">{JSON.stringify(leg, null, 2)}</pre>
      </div>
    );
  },
};

export const EmptyStrikes: Story = {
  name: "Empty strikes list",
  render: () => {
    const [leg, setLeg] = useState<OptionLeg>({
      id: "empty",
      side: "buy",
      type: "call",
      strike: 0,
      expiry: expiries[1]!,
      contracts: 1,
    });
    return (
      <div className="w-[40rem]">
        <LegBuilderRow value={leg} onChange={setLeg} strikes={[]} />
      </div>
    );
  },
};

export const DisableDelete: Story = {
  name: "Disabled delete (last leg)",
  render: () => {
    const [leg, setLeg] = useState<OptionLeg>({
      id: "last",
      side: "buy",
      type: "call",
      strike: 400,
      expiry: expiries[1]!,
      contracts: 1,
    });
    return (
      <div className="w-[40rem]">
        <LegBuilderRow
          value={leg}
          onChange={setLeg}
          strikes={strikes}
          onDelete={() => alert("delete")}
          disableDelete
        />
      </div>
    );
  },
};

export const LongStrikesList: Story = {
  name: "Very long strikes list",
  render: () => {
    const [leg, setLeg] = useState<OptionLeg>({
      id: "long",
      side: "buy",
      type: "call",
      strike: 500,
      expiry: expiries[1]!,
      contracts: 1,
    });
    const longStrikes = Array.from(
      { length: 200 },
      (_, i) => 100 + i * 5
    );
    return (
      <div className="w-[40rem]">
        <LegBuilderRow value={leg} onChange={setLeg} strikes={longStrikes} />
      </div>
    );
  },
};