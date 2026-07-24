import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup, ToggleGroupItem } from "./index";

const meta: Meta<typeof ToggleGroup> = {
  title: "Components/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "radio", options: ["single", "multiple"] },
    variant: { control: "radio", options: ["default", "outline"] },
    size: { control: "radio", options: ["xs", "sm", "md", "lg"] },
    lines: { control: "radio", options: [1, 2] },
    disabled: { control: "boolean" },
    loop: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
  args: { lines: 1 },
  render: (args) => (
    <ToggleGroup type="single" defaultValue="1D" lines={1} {...args}>
      <ToggleGroupItem value="1D">1D</ToggleGroupItem>
      <ToggleGroupItem value="1W">1W</ToggleGroupItem>
      <ToggleGroupItem value="1M">1M</ToggleGroupItem>
      <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const SingleSelectTimeframe: Story = {
  name: "Single Select — Timeframe",
  render: () => (
    <ToggleGroup type="single" defaultValue="1W" size="sm">
      <ToggleGroupItem value="1D">1D</ToggleGroupItem>
      <ToggleGroupItem value="1W">1W</ToggleGroupItem>
      <ToggleGroupItem value="1M">1M</ToggleGroupItem>
      <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const MultiSelectIndicators: Story = {
  name: "Multi Select — Indicators",
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["sma", "volume"]}>
      <ToggleGroupItem value="sma">SMA</ToggleGroupItem>
      <ToggleGroupItem value="ema">EMA</ToggleGroupItem>
      <ToggleGroupItem value="volume">Vol</ToggleGroupItem>
      <ToggleGroupItem value="rsi">RSI</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Variants: Story = {
  name: "Variants — Default vs Outline",
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      <ToggleGroup type="single" defaultValue="a" variant="default">
        <ToggleGroupItem value="a">Default A</ToggleGroupItem>
        <ToggleGroupItem value="b">Default B</ToggleGroupItem>
        <ToggleGroupItem value="c">Default C</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" defaultValue="a" variant="outline">
        <ToggleGroupItem value="a" variant="outline">Outline A</ToggleGroupItem>
        <ToggleGroupItem value="b" variant="outline">Outline B</ToggleGroupItem>
        <ToggleGroupItem value="c" variant="outline">Outline C</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Sizes — xs / sm / md / lg",
  render: () => (
    <div className="flex flex-col gap-4 p-6 w-fit">
      <ToggleGroup type="single" size="xs">
        <ToggleGroupItem value="a" size="xs">XS</ToggleGroupItem>
        <ToggleGroupItem value="b" size="xs">XS</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" size="sm">
        <ToggleGroupItem value="a" size="sm">SM</ToggleGroupItem>
        <ToggleGroupItem value="b" size="sm">SM</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" size="md">
        <ToggleGroupItem value="a" size="md">MD</ToggleGroupItem>
        <ToggleGroupItem value="b" size="md">MD</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" size="lg">
        <ToggleGroupItem value="a" size="lg">LG</ToggleGroupItem>
        <ToggleGroupItem value="b" size="lg">LG</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

export const DisabledGroup: Story = {
  name: "Disabled Group",
  render: () => (
    <ToggleGroup type="single" defaultValue="a" disabled>
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const DisabledItem: Story = {
  name: "Disabled Individual Item",
  render: () => (
    <ToggleGroup type="single" defaultValue="a">
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b" disabled>B (disabled)</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Controlled: Story = {
  name: "Controlled Single Select",
  render: () => {
    const [value, setValue] = React.useState<string | undefined>("buy");
    return (
      <div className="flex flex-col gap-3 p-6">
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={(v) => setValue(v as string | undefined)}
        >
          <ToggleGroupItem value="buy">Buy</ToggleGroupItem>
          <ToggleGroupItem value="sell">Sell</ToggleGroupItem>
        </ToggleGroup>
        <div className="text-sm text-muted-foreground">
          Current: {value ?? "none"}
        </div>
      </div>
    );
  },
};

export const StackedText: Story = {
  name: "Two-Line Stacked Text (lines=2)",
  render: () => (
    <div className="flex flex-col gap-4 p-6 w-fit">
      <ToggleGroup type="single" defaultValue="iron-condor" lines={2} size="md">
        <ToggleGroupItem value="long-call">Long Call</ToggleGroupItem>
        <ToggleGroupItem value="iron-condor">iron
condor</ToggleGroupItem>
        <ToggleGroupItem value="butterfly">bull put
butterfly</ToggleGroupItem>
        <ToggleGroupItem value="calendar">Calendar</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        type="single"
        defaultValue="iron-condor"
        lines={2}
        size="md"
        variant="outline"
      >
        <ToggleGroupItem value="long-call" variant="outline">
          Long Call
        </ToggleGroupItem>
        <ToggleGroupItem value="iron-condor" variant="outline">
          {"iron\ncondor"}
        </ToggleGroupItem>
        <ToggleGroupItem value="butterfly" variant="outline">
          {"bull put\nbutterfly"}
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="text-xs text-muted-foreground">
        Compare the same group without <code>lines</code>:
      </div>
      <ToggleGroup type="single" defaultValue="iron-condor" size="md">
        <ToggleGroupItem value="long-call">Long Call</ToggleGroupItem>
        <ToggleGroupItem value="iron-condor">iron condor</ToggleGroupItem>
        <ToggleGroupItem value="butterfly">bull put butterfly</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Set `lines={2}` on the group to enable text wrapping per item (e.g. `iron\ncondor`). The group grows to fit the tallest item; single-line items stay tight with no extra whitespace.",
      },
    },
  },
};