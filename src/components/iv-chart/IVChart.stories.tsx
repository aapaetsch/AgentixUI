import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { IVChart, type IVSurfaceCell, type IVTermPoint } from "./index";

const meta: Meta<typeof IVChart> = {
  title: "Components/IVChart",
  component: IVChart,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { options: ["term", "surface"], control: { type: "radio" } },
  },
};
export default meta;
type Story = StoryObj<typeof IVChart>;

const now = Date.now();
const day = 86_400_000;

const term: IVTermPoint[] = [
  { expiry: now + 7 * day, iv: 18 },
  { expiry: now + 14 * day, iv: 21 },
  { expiry: now + 30 * day, iv: 23 },
  { expiry: now + 60 * day, iv: 25 },
  { expiry: now + 90 * day, iv: 26 },
];

export const TermStructure: Story = {
  args: { variant: "term", term, width: 240, height: 80 },
  render: (args) => (
    <div className="w-60 text-primary">
      <IVChart {...args} />
    </div>
  ),
};

export const TermFlat: Story = {
  args: {
    variant: "term",
    term: term.map((t) => ({ ...t, iv: 22 })),
    width: 240,
    height: 80,
  },
};

// Single-expiry term: degenerate case — a single dot centered horizontally.
export const TermSingle: Story = {
  args: {
    variant: "term",
    term: [{ expiry: now + 7 * day, iv: 22 }],
    width: 240,
    height: 80,
  },
};

function buildSurface(): IVSurfaceCell[] {
  const strikes = [380, 390, 400, 410, 420, 430, 440];
  const expiries = [7, 30, 60, 90].map((d) => now + d * day);
  const cells: IVSurfaceCell[] = [];
  for (const k of strikes) {
    for (const e of expiries) {
      const moneyness = (k - 400) / 400;
      const dec = Math.exp(-Math.abs(moneyness) * 2);
      const iv = 18 + 12 * dec + (k > 400 ? -1 : 1) * 2;
      cells.push({ strike: k, expiry: e, iv });
    }
  }
  return cells;
}

export const Surface: Story = {
  args: { variant: "surface", surface: buildSurface(), width: 280, height: 160 },
  render: (args) => (
    <div className="w-72">
      <IVChart {...args} />
    </div>
  ),
};

// Degenerate 1×1 surface: a single cell at the full viewBox (mid tone, since
// ivMin===ivMax gets padded and the single cell sits at the new mid).
export const SurfaceSingleCell: Story = {
  args: {
    variant: "surface",
    surface: [{ strike: 100, expiry: now + 7 * day, iv: 20 }],
    width: 280,
    height: 160,
  },
};

// 60-cell surface: below the documented ~100 soft limit; renders cleanly.
export const Surface60Cells: Story = {
  args: (() => {
    const strikes = Array.from({ length: 10 }, (_, i) => 370 + i * 10);
    const expiries = [7, 30, 60, 90, 120, 180].map((d) => now + d * day);
    const cells: IVSurfaceCell[] = [];
    for (const k of strikes) {
      for (const e of expiries) {
        const moneyness = (k - 415) / 415;
        const dec = Math.exp(-Math.abs(moneyness) * 2);
        const iv = 18 + 12 * dec + (k > 415 ? -1 : 1) * 2;
        cells.push({ strike: k, expiry: e, iv });
      }
    }
    return { variant: "surface" as const, surface: cells, width: 280, height: 160 };
  })(),
  render: (args) => (
    <div className="w-72">
      <IVChart {...args} />
    </div>
  ),
};

// Over-limit surface (120 cells): triggers the dev `console.warn` but must not
// crash or truncate. Open the Storybook devtools console to see the warning.
export const SurfaceOverLimit: Story = {
  args: (() => {
    const strikes = Array.from({ length: 12 }, (_, i) => 360 + i * 10);
    const expiries = Array.from({ length: 10 }, (_, i) => now + (i + 1) * 7 * day);
    const cells: IVSurfaceCell[] = [];
    for (const k of strikes) {
      for (const e of expiries) {
        const moneyness = (k - 415) / 415;
        const dec = Math.exp(-Math.abs(moneyness) * 2);
        const iv = 18 + 12 * dec + (k > 415 ? -1 : 1) * 2;
        cells.push({ strike: k, expiry: e, iv });
      }
    }
    return { variant: "surface" as const, surface: cells, width: 280, height: 160 };
  })(),
  render: (args) => (
    <div className="w-72">
      <IVChart {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: { variant: "term", term: [] },
};