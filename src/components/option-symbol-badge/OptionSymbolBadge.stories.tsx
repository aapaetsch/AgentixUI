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

export const TypeLongCall: Story = {
  args: {
    root: "SPY",
    expiry: baseExpiry,
    strike: 412.5,
    type: "call",
    typeFormat: "long",
  },
};

export const TypeLongPut: Story = {
  args: {
    root: "QQQ",
    expiry: baseExpiry,
    strike: 420,
    type: "put",
    typeFormat: "long",
  },
};

export const ActionBTO: Story = {
  args: {
    root: "SPY",
    expiry: baseExpiry,
    strike: 412.5,
    type: "call",
    action: "BTO",
  },
};

export const ActionBTC: Story = {
  args: {
    root: "AAPL",
    expiry: baseExpiry,
    strike: 190,
    type: "put",
    action: "BTC",
  },
};

export const ActionSTO: Story = {
  args: {
    root: "NVDA",
    expiry: baseExpiry + 7 * 86_400_000,
    strike: 900,
    type: "put",
    action: "STO",
  },
};

export const ActionSTC: Story = {
  args: {
    root: "TSLA",
    expiry: baseExpiry,
    strike: 250,
    type: "call",
    action: "STC",
  },
};

export const ActionAfter: Story = {
  args: {
    root: "SPY",
    expiry: baseExpiry,
    strike: 412.5,
    type: "call",
    action: "BTO",
    actionPosition: "after",
  },
};

export const ActionCustomVariant: Story = {
  args: {
    root: "SPY",
    expiry: baseExpiry,
    strike: 412.5,
    type: "call",
    action: "BTO",
    actionVariant: "default",
  },
};

export const HideTypeBadge: Story = {
  args: {
    root: "SPY",
    expiry: baseExpiry,
    strike: 412.5,
    type: "call",
    hideTypeBadge: true,
  },
};

export const CurrencySymbolPrefix: Story = {
  args: {
    root: "SPY",
    expiry: baseExpiry,
    strike: 412.5,
    type: "call",
    currencySymbol: "$",
  },
};

export const CurrencyStringSuffix: Story = {
  args: {
    root: "SPY",
    expiry: baseExpiry,
    strike: 412.5,
    type: "call",
    currencySymbol: "$",
    currencyString: "USD",
  },
};

export const CryptoCurrency: Story = {
  args: {
    root: "BTC",
    expiry: baseExpiry,
    strike: 65000,
    type: "call",
    currencyString: "USDC",
  },
};

export const WithPremium: Story = {
  args: {
    root: "SPY",
    expiry: baseExpiry,
    strike: 412.5,
    type: "call",
    currencySymbol: "$",
    premium: 3.25,
  },
};

export const FullBlotterToken: Story = {
  args: {
    root: "SPY",
    expiry: baseExpiry,
    strike: 412.5,
    type: "call",
    action: "BTO",
    typeFormat: "long",
    currencySymbol: "$",
    currencyString: "USD",
    premium: 3.25,
  },
};

export const ClosePositionToken: Story = {
  args: {
    root: "AAPL",
    expiry: baseExpiry,
    strike: 190,
    type: "put",
    action: "STC",
    typeFormat: "long",
    currencySymbol: "$",
    premium: 1.8,
  },
};