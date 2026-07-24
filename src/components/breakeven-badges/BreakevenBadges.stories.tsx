import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { BreakevenBadges } from "./index";

const meta: Meta<typeof BreakevenBadges> = {
  title: "Components/BreakevenBadges",
  component: BreakevenBadges,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    format: { options: ["currency", "number"], control: { type: "radio" } },
  },
};
export default meta;
type Story = StoryObj<typeof BreakevenBadges>;

export const Single: Story = {
  args: { values: [412.5] },
};

export const TwoBreakevens: Story = {
  args: { values: [387.5, 412.5] },
};

export const NumberFormat: Story = {
  args: { values: [387.5, 412.5, 460], format: "number" },
};

export const Overflow: Story = {
  args: {
    values: [380, 390, 400, 410, 420, 430, 440, 450],
    max: 4,
  },
};

export const Empty: Story = {
  args: { values: [] },
};

export const MaxZero: Story = {
  args: {
    values: [387.5, 412.5],
    max: 0,
  },
};

export const DuplicateValues: Story = {
  args: { values: [400, 400] },
};

export const LabelHidden: Story = {
  args: {
    values: [387.5, 412.5],
    label: null,
  },
};

export const LargeOverflow: Story = {
  args: {
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    max: 4,
  },
};

export const CustomRendering: Story = {
  args: {
    values: [387.5, 412.5, 425.25],
    label: "Break-even",
    precision: 1,
    size: "large",
    variant: "secondary",
    overflowVariant: "outline",
    max: 2,
    ariaLabel: "Strategy break-even levels",
    renderValue: (value) => `${value.toFixed(1)} pts`,
  },
};
