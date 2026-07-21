import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { OptionsChain } from "./options-chain";
import type { OptionChainRow } from "../../lib/finance-types";

const meta: Meta<typeof OptionsChain> = {
  title: "Templates/Options/OptionsChain",
  component: OptionsChain,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof OptionsChain>;

const expiries = [
  Date.now() + 7 * 86_400_000,
  Date.now() + 30 * 86_400_000,
  Date.now() + 60 * 86_400_000,
];

function buildRows(): OptionChainRow[] {
  const strikes = [380, 390, 400, 410, 420];
  const rows: OptionChainRow[] = [];
  for (const k of strikes) {
    for (const e of expiries) {
      const moneyness = (k - 400) / 400;
      const callIv = 18 + 8 * Math.exp(-Math.abs(moneyness) * 2);
      const putIv = 18 + 8 * Math.exp(-Math.abs(moneyness) * 2);
      rows.push({
        strike: k,
        call: {
          root: "SPY",
          type: "call",
          strike: k,
          expiry: e,
          bid: Math.max(0.5, 20 - Math.abs(k - 400) * 0.8),
          ask: Math.max(0.55, 20.4 - Math.abs(k - 400) * 0.8),
          iv: callIv,
          volume: 1000 - Math.abs(k - 400) * 50,
          openInterest: 5000 - Math.abs(k - 400) * 200,
          delta: Math.max(0.05, 0.5 - (k - 400) * 0.05),
          greeks: {
            delta: Math.max(0.05, 0.5 - (k - 400) * 0.05),
            gamma: 0.04,
            theta: -2 - Math.abs(k - 400) * 0.1,
            vega: 0.18,
          },
        },
        put: {
          root: "SPY",
          type: "put",
          strike: k,
          expiry: e,
          bid: Math.max(0.5, 20 - Math.abs(k - 400) * 0.8),
          ask: Math.max(0.55, 20.4 - Math.abs(k - 400) * 0.8),
          iv: putIv,
          volume: 800 - Math.abs(k - 400) * 40,
          openInterest: 4000 - Math.abs(k - 400) * 150,
          delta: Math.min(-0.05, -0.5 + (k - 400) * 0.05),
          greeks: {
            delta: Math.min(-0.05, -0.5 + (k - 400) * 0.05),
            gamma: 0.04,
            theta: -2 - Math.abs(k - 400) * 0.1,
            vega: 0.18,
          },
        },
      });
    }
  }
  return rows;
}

export const Default: Story = {
  args: {
    rows: buildRows(),
    underlying: "SPY",
    spot: 400,
    expiries,
    onAddLeg: (side, type, strike, expiry) =>
      // eslint-disable-next-line no-alert
      alert(`add leg: ${side} ${type} ${strike} ${new Date(expiry).toDateString()}`),
  },
  render: (args) => <div className="w-[60rem]"><OptionsChain {...args} /></div>,
};

export const Empty: Story = {
  args: { rows: [], underlying: "SPY", spot: 400, expiries },
  render: (args) => <div className="w-[60rem]"><OptionsChain {...args} /></div>,
};

// Wide chain: many strikes × many expiries, with `defaultExpiry` set to a
// non-first expiry to verify the controlled-default → internal-state sync.
// `onAddLeg` logs to the console (visible in the Storybook dev console) so
// no alert dialog blocks interaction.
const wideStrikes = Array.from({ length: 40 }, (_, i) => 300 + i * 5);
const wideExpiries = Array.from({ length: 6 }, (_, i) => Date.now() + (7 + i * 14) * 86_400_000);

function buildWideRows(): OptionChainRow[] {
  const rows: OptionChainRow[] = [];
  for (const k of wideStrikes) {
    for (const e of wideExpiries) {
      const moneyness = (k - 400) / 400;
      const iv = 18 + 8 * Math.exp(-Math.abs(moneyness) * 2);
      const callMid = Math.max(0.5, 20 - Math.abs(k - 400) * 0.8);
      const putMid = Math.max(0.5, 20 - Math.abs(k - 400) * 0.8);
      rows.push({
        strike: k,
        call: {
          root: "SPY",
          type: "call",
          strike: k,
          expiry: e,
          bid: callMid - 0.05,
          ask: callMid + 0.05,
          iv,
          volume: Math.max(0, 1000 - Math.abs(k - 400) * 50),
          openInterest: Math.max(0, 5000 - Math.abs(k - 400) * 200),
          delta: Math.max(0.02, Math.min(0.98, 0.5 - (k - 400) * 0.05)),
          greeks: {
            delta: Math.max(0.02, Math.min(0.98, 0.5 - (k - 400) * 0.05)),
            gamma: 0.04,
            theta: -2 - Math.abs(k - 400) * 0.1,
            vega: 0.18,
          },
        },
        put: {
          root: "SPY",
          type: "put",
          strike: k,
          expiry: e,
          bid: putMid - 0.05,
          ask: putMid + 0.05,
          iv,
          volume: Math.max(0, 800 - Math.abs(k - 400) * 40),
          openInterest: Math.max(0, 4000 - Math.abs(k - 400) * 150),
          delta: Math.min(-0.02, Math.max(-0.98, -0.5 + (k - 400) * 0.05)),
          greeks: {
            delta: Math.min(-0.02, Math.max(-0.98, -0.5 + (k - 400) * 0.05)),
            gamma: 0.04,
            theta: -2 - Math.abs(k - 400) * 0.1,
            vega: 0.18,
          },
        },
      });
    }
  }
  return rows;
}

export const WideDenseSynced: Story = {
  args: {
    rows: buildWideRows(),
    underlying: "SPY",
    spot: 400,
    expiries: wideExpiries,
    defaultExpiry: wideExpiries[2],
    onAddLeg: (side, type, strike, expiry) =>
      // eslint-disable-next-line no-console
      console.log(`add leg: ${side} ${type} @ ${strike} ${new Date(expiry).toDateString()}`),
  },
  render: (args) => <div className="w-[80rem]"><OptionsChain {...args} /></div>,
};