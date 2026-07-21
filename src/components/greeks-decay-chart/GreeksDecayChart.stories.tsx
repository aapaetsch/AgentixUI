import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GreeksDecayChart } from "./index";

const meta: Meta<typeof GreeksDecayChart> = {
  title: "Components/GreeksDecayChart",
  component: GreeksDecayChart,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    greek: {
      options: ["all", "delta", "gamma", "theta", "vega"],
      control: { type: "select" },
    },
  },
};
export default meta;
type Story = StoryObj<typeof GreeksDecayChart>;

const days = [30, 21, 14, 7, 3, 1, 0];
const delta = [0.5, 0.49, 0.47, 0.42, 0.32, 0.18, 0];
const gamma = [0.04, 0.045, 0.05, 0.058, 0.07, 0.08, 0];
const theta = [-1.2, -1.6, -2.0, -2.8, -4.0, -8.0, 0];
const vega = [0.22, 0.2, 0.17, 0.13, 0.09, 0.04, 0];

export const AllGreeks: Story = {
  args: { days, delta, gamma, theta, vega, width: 240, height: 96 },
};

export const DeltaOnly: Story = {
  args: {
    days,
    delta,
    greek: "delta",
    width: 200,
    height: 80,
  },
  render: (args) => (
    <div className="w-52">
      <GreeksDecayChart {...args} />
    </div>
  ),
};

export const ThetaOnly: Story = {
  args: { days, theta, greek: "theta", width: 200, height: 80 },
};

export const Empty: Story = {
  args: { days: [] },
};

export const SingleDay: Story = {
  args: { days: [30], delta: [0.5], theta: [-1.2], width: 200, height: 80 },
  render: (args) => (
    <div className="w-52">
      <GreeksDecayChart {...args} />
    </div>
  ),
};

export const MismatchedSeriesLengths: Story = {
  args: {
    days,
    delta,
    // Intentionally wrong length — should be dropped in dev (console.warn).
    gamma: [0.04, 0.045, 0.05],
    theta,
    vega,
    width: 240,
    height: 96,
  },
};

export const AllZeroSeries: Story = {
  args: {
    days,
    delta: days.map(() => 0),
    theta: days.map(() => 0),
    width: 200,
    height: 80,
  },
};