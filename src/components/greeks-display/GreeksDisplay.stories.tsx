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
    labelStyle: {
      options: ["symbol", "text", "both"],
      control: { type: "radio" },
    },
    labelPosition: {
      options: ["leading", "stacked"],
      control: { type: "radio" },
    },
    labelCase: {
      options: ["upper", "lower", "title"],
      control: { type: "radio" },
    },
    size: { options: ["sm", "md", "lg"], control: { type: "radio" } },
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

/* -------------------------------------------------------------------------- *
 * Label style variants
 * -------------------------------------------------------------------------- */

export const LabelSymbol: Story = {
  name: "Label style: symbol",
  args: { greeks: fullGreeks, labelStyle: "symbol" },
};

export const LabelText: Story = {
  name: "Label style: text",
  args: { greeks: fullGreeks, labelStyle: "text", labelCase: "title" },
};

export const LabelTextUpper: Story = {
  name: "Label style: text (UPPER)",
  args: { greeks: fullGreeks, labelStyle: "text", labelCase: "upper" },
};

export const LabelBoth: Story = {
  name: "Label style: both (symbol + name)",
  args: { greeks: fullGreeks, labelStyle: "both" },
};

/* -------------------------------------------------------------------------- *
 * Label position variants
 * -------------------------------------------------------------------------- */

export const StackedGrid: Story = {
  name: "Stacked grid (stat-tile row)",
  args: {
    greeks: fullGreeks,
    labelPosition: "stacked",
    showTooltips: false,
  },
  render: (args) => <div className="w-[24rem]"><GreeksDisplay {...args} /></div>,
};

export const StackedInline: Story = {
  name: "Stacked inline (compact tiles)",
  args: {
    greeks: fullGreeks,
    layout: "inline",
    labelPosition: "stacked",
    colorize: true,
    signed: true,
  },
  render: (args) => <div className="w-[28rem]"><GreeksDisplay {...args} /></div>,
};

export const StackedBoth: Story = {
  name: "Stacked + labelStyle=both",
  args: {
    greeks: fullGreeks,
    labelStyle: "both",
    labelPosition: "stacked",
    size: "lg",
  },
  render: (args) => <div className="w-[32rem]"><GreeksDisplay {...args} /></div>,
};

/* -------------------------------------------------------------------------- *
 * Size scale + contrast
 * -------------------------------------------------------------------------- */

export const SizeSm: Story = {
  name: "Size sm (dense row)",
  args: { greeks: fullGreeks, size: "sm" },
};

export const SizeLg: Story = {
  name: "Size lg (headline readout)",
  args: { greeks: fullGreeks, size: "lg", labelStyle: "both" },
};

export const LabelNotMuted: Story = {
  name: "Label not muted (full foreground contrast)",
  args: { greeks: fullGreeks, labelMuted: false, labelStyle: "both" },
};

/* -------------------------------------------------------------------------- *
 * Combination: high-readout mode
 * -------------------------------------------------------------------------- */

export const HighReadability: Story = {
  name: "High-readability preset",
  args: {
    greeks: fullGreeks,
    layout: "inline",
    labelStyle: "both",
    labelPosition: "stacked",
    size: "md",
    colorize: true,
    signed: true,
    labelCase: "upper",
  },
  render: (args) => <div className="w-[32rem]"><GreeksDisplay {...args} /></div>,
};