import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { OptionSymbolBadge } from "./index";

const meta: Meta<typeof OptionSymbolBadge> = {
  title: "Components/OptionSymbolBadge",
  component: OptionSymbolBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof OptionSymbolBadge>;

const baseExpiry = Date.now() + 21 * 86_400_000;

export const FromContract: Story = {
  args: {
    contract: {
      root: "SPY",
      type: "call",
      strike: 412.5,
      expiry: baseExpiry,
      bid: 3.1,
      ask: 3.25,
    },
  },
};

export const FromAtoms: Story = {
  args: {
    root: "AAPL",
    expiry: baseExpiry,
    strike: 190,
    type: "put",
  },
};

export const PutVariant: Story = {
  args: {
    root: "QQQ",
    expiry: baseExpiry + 14 * 86_400_000,
    strike: 420,
    type: "put",
  },
};

export const NonMonospace: Story = {
  args: {
    root: "SPY",
    expiry: baseExpiry,
    strike: 412.5,
    type: "call",
    monospace: false,
  },
};

export const FractionalStrike: Story = {
  args: {
    root: "SPY",
    expiry: baseExpiry,
    strike: 412.5,
    type: "call",
  },
};

export const MissingRoot: Story = {
  args: {
    root: "",
    expiry: baseExpiry,
    strike: 400,
    type: "call",
  },
};

export const MissingExpiry: Story = {
  args: {
    root: "SPY",
    strike: 400,
    type: "put",
  },
};

export const MissingStrike: Story = {
  args: {
    root: "SPY",
    expiry: baseExpiry,
    type: "call",
  },
};

export const AllAtomsMissing: Story = {
  args: {},
};