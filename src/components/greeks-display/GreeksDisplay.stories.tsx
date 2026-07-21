import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GreeksDisplay } from "./index";

const meta: Meta<typeof GreeksDisplay> = {
  title: "Components/GreeksDisplay",
  component: GreeksDisplay,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    layout: { options: ["grid", "inline"], control: { type: "radio" } },
  },
};
export default meta;
type Story = StoryObj<typeof GreeksDisplay>;

const fullGreeks = {
  delta: 0.42,
  gamma: 0.0312,
  theta: -3.27,
  vega: 0.18,
  rho: 0.011,
};

export const GridDefault: Story = {
  args: { greeks: fullGreeks },
};

export const InlineColorized: Story = {
  args: {
    greeks: fullGreeks,
    layout: "inline",
    signed: true,
    colorize: true,
  },
};

export const Partial: Story = {
  args: { greeks: { delta: 0.66, theta: -1.2 }, colorize: true, signed: true },
};

export const NoTooltips: Story = {
  args: { greeks: fullGreeks, showTooltips: false },
};

export const Empty: Story = {
  args: { greeks: {} },
};

/**
 * A delta-neutral position: every Greek is exactly `0`. Confirms `0` values
 * are included (`0 != null`) and render as `+0.000` when `signed`.
 */
export const AllZero: Story = {
  args: {
    greeks: { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 },
    signed: true,
    colorize: true,
  },
};

/**
 * Partial glossary override — `delta` and `vega` are replaced; the rest fall
 * back to `DEFAULT_GREEK_GLOSSARY`.
 */
export const GlossaryOverride: Story = {
  args: {
    greeks: fullGreeks,
    glossary: {
      delta: "Δ — directional exposure (custom).",
      vega: "ν — vol sensitivity (custom).",
    },
  },
};

/**
 * Inline layout with tooltips disabled — exercises the inline cell grouping
 * (label + value bound together, cells separated by the outer gap).
 */
export const InlineNoTooltips: Story = {
  args: {
    greeks: fullGreeks,
    layout: "inline",
    signed: true,
    colorize: true,
    showTooltips: false,
  },
};