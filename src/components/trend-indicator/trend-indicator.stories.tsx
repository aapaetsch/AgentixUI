import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { TrendIndicator, trendIndicatorVariants } from "./index";

const meta: Meta<typeof TrendIndicator> = {
  title: "Components/TrendIndicator",
  component: TrendIndicator,
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["auto", "up", "down"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md"],
    },
    showArrow: { control: "boolean" },
    signed: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof TrendIndicator>;

export const Default: Story = {
  render: (args) => <TrendIndicator {...args} />,
  args: {
    value: 1.24,
    signed: true,
  },
};

export const Values: Story = {
  name: "Value variations",
  render: () => (
    <div className="flex flex-col gap-3 p-6">
      <TrendIndicator value={1.24} signed />
      <TrendIndicator value={-0.42} />
      <TrendIndicator value={0} />
      <TrendIndicator value={Number.NaN} />
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes (xs / sm / md)",
  render: () => (
    <div className="flex flex-col gap-3 p-6">
      <TrendIndicator value={1.24} signed size="xs" />
      <TrendIndicator value={1.24} signed size="sm" />
      <TrendIndicator value={1.24} signed size="md" />
    </div>
  ),
};

export const NoArrow: Story = {
  name: "showArrow=false",
  render: () => (
    <div className="flex flex-col gap-3 p-6">
      <TrendIndicator value={1.24} signed showArrow={false} />
      <TrendIndicator value={-0.42} showArrow={false} />
      <TrendIndicator value={0} showArrow={false} />
    </div>
  ),
};

export const Signed: Story = {
  name: "signed=true",
  render: () => (
    <div className="flex flex-col gap-3 p-6">
      <TrendIndicator value={1.24} signed />
      <TrendIndicator value={0.42} signed />
      <TrendIndicator value={-0.42} signed />
    </div>
  ),
};

export const CustomDisplayValue: Story = {
  name: "With displayValue override",
  render: () => (
    <div className="flex flex-col gap-3 p-6">
      <TrendIndicator value={1.24} displayValue="+1.24%" />
      <TrendIndicator value={-0.42} displayValue="−0.42%" />
      <TrendIndicator value={0} displayValue="flat" />
    </div>
  ),
};

export const DirectionOverride: Story = {
  name: "Direction override",
  render: () => (
    <div className="flex flex-col gap-3 p-6">
      <TrendIndicator value={1.24} direction="down" displayValue="+1.24 ▼" />
      <TrendIndicator value={-0.42} direction="up" displayValue="-0.42 ▲" />
    </div>
  ),
};

export const VariantsReference: Story = {
  name: "trendIndicatorVariants reference",
  render: () => (
    <div className="flex flex-col gap-2 p-6 text-sm">
      <span className={trendIndicatorVariants({ size: "xs" })}>xs</span>
      <span className={trendIndicatorVariants({ size: "sm" })}>sm</span>
      <span className={trendIndicatorVariants({ size: "md" })}>md</span>
    </div>
  ),
};