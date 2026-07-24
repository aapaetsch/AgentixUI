import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedProgress } from "./index";

const meta: Meta<typeof SegmentedProgress> = {
  title: "Components/SegmentedProgress",
  component: SegmentedProgress,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    rounded: { control: "boolean" },
    showValues: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof SegmentedProgress>;

const TYPICAL = [
  { value: 60, label: "Equities" },
  { value: 30, label: "Fixed Income" },
  { value: 10, label: "Cash" },
];

const FIVE_EQUAL = [
  { value: 20, label: "A" },
  { value: 20, label: "B" },
  { value: 20, label: "C" },
  { value: 20, label: "D" },
  { value: 20, label: "E" },
];

export const Default: Story = {
  args: { segments: TYPICAL },
};

export const Typical: Story = {
  render: () => (
    <div className="w-80">
      <SegmentedProgress segments={TYPICAL} />
    </div>
  ),
};

export const FiveEqual: Story = {
  render: () => (
    <div className="w-80">
      <SegmentedProgress segments={FIVE_EQUAL} />
    </div>
  ),
};

export const WithMaxRemainder: Story = {
  render: () => (
    <div className="w-80">
      <SegmentedProgress segments={TYPICAL} max={120} />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="h-48">
        <SegmentedProgress segments={TYPICAL} orientation="vertical" />
      </div>
      <div className="h-48">
        <SegmentedProgress
          segments={FIVE_EQUAL}
          orientation="vertical"
          showValues
        />
      </div>
    </div>
  ),
};

export const WithValues: Story = {
  render: () => (
    <div className="w-80">
      <SegmentedProgress segments={TYPICAL} showValues />
    </div>
  ),
};

export const ExplicitColors: Story = {
  render: () => (
    <div className="w-80">
      <SegmentedProgress
        segments={[
          { value: 60, label: "Equities", color: "hsl(var(--positive))" },
          { value: 30, label: "Fixed Income", color: "hsl(var(--warning))" },
          { value: 10, label: "Cash", color: "hsl(var(--muted-foreground))" },
        ]}
        showValues
      />
    </div>
  ),
};

export const EmptyArray: Story = {
  render: () => (
    <div className="w-80">
      <SegmentedProgress segments={[]} max={100} />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <SegmentedProgress segments={TYPICAL} size="xs" />
      <SegmentedProgress segments={TYPICAL} size="sm" />
      <SegmentedProgress segments={TYPICAL} size="md" />
    </div>
  ),
};

export const WithGap: Story = {
  render: () => (
    <div className="w-80">
      <SegmentedProgress segments={TYPICAL} gap={2} />
    </div>
  ),
};

export const NotRounded: Story = {
  render: () => (
    <div className="w-80">
      <SegmentedProgress segments={TYPICAL} rounded={false} />
    </div>
  ),
};