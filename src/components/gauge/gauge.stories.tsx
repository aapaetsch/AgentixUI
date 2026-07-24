import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Gauge, type GaugeProps } from "./index";

const meta: Meta<typeof Gauge> = {
  title: "Components/Gauge",
  component: Gauge,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: { control: "select", options: ["full", "semicircle"] },
    valueFormat: { control: "select", options: ["number", "percent"] },
  },
};
export default meta;
type Story = StoryObj<typeof Gauge>;

const TIER_THRESHOLDS = [
  { value: 30, color: "#ef4444" },
  { value: 70, color: "#f59e0b" },
  { value: 100, color: "#22c55e" },
];

export const Default: Story = {
  args: { value: 50, size: "md", variant: "full" },
};

export const FullSet: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {[0, 25, 50, 75, 100].map((v) => (
        <Gauge key={v} value={v} />
      ))}
    </div>
  ),
};

export const Semicircle: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {[0, 25, 50, 75, 100].map((v) => (
        <Gauge key={v} value={v} variant="semicircle" />
      ))}
    </div>
  ),
};

export const FullVariant: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {[0, 25, 50, 75, 100].map((v) => (
        <Gauge key={v} value={v} variant="full" />
      ))}
    </div>
  ),
};

export const WithThresholds: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {[15, 45, 85].map((v) => (
        <Gauge key={v} value={v} thresholds={TIER_THRESHOLDS} label={`${v}`} />
      ))}
    </div>
  ),
};

export const WithoutLabel: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {/* With a custom label */}
      <Gauge value={72} label="Healthy" />
      {/* Auto-formatted label (label omitted) */}
      <Gauge value={72} variant="semicircle" />
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6 text-foreground">
      <Gauge value={70} color="hsl(var(--positive))" />
      <Gauge value={20} color="hsl(var(--negative))" />
      <Gauge value={45} color="hsl(var(--muted-foreground))" />
    </div>
  ),
};

export const Clamping: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      <Gauge value={-25} label="below min" />
      <Gauge value={150} label="above max" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      <Gauge value={60} size="sm" />
      <Gauge value={60} size="md" />
      <Gauge value={60} size="lg" />
    </div>
  ),
};

export const PercentFormat: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      <Gauge value={37} valueFormat="percent" />
      <Gauge value={37} valueFormat="percent" variant="semicircle" />
    </div>
  ),
};

export const NonZeroRange: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      <Gauge value={7} min={0} max={10} valueFormat="number" label="7 / 10" />
    </div>
  ),
};