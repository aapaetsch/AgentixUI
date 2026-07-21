import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  SpreadTypeSelector,
  DEFAULT_SPREAD_OPTIONS,
  type SpreadType,
} from "./index";

const meta: Meta<typeof SpreadTypeSelector> = {
  title: "Components/SpreadTypeSelector",
  component: SpreadTypeSelector,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof SpreadTypeSelector>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState<SpreadType>("vertical");
    return <SpreadTypeSelector value={v} onChange={setV} />;
  },
};

/** All seven built-in templates are offered when `options` is omitted. */
export const AllDefaults: Story = {
  render: () => {
    const [v, setV] = useState<SpreadType>("iron-condor");
    return <SpreadTypeSelector value={v} onChange={setV} />;
  },
  parameters: {
    docs: {
      description: {
        story: `Renders all ${DEFAULT_SPREAD_OPTIONS.length} built-in templates.`,
      },
    },
  },
};

export const Restricted: Story = {
  render: () => {
    const [v, setV] = useState<SpreadType>("straddle");
    return (
      <SpreadTypeSelector
        value={v}
        onChange={setV}
        options={["single", "straddle", "strangle"]}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [v, setV] = useState<SpreadType>("vertical");
    return <SpreadTypeSelector value={v} onChange={setV} disabled />;
  },
};

export const Empty: Story = {
  render: () => {
    const [v, setV] = useState<SpreadType>("vertical");
    return <SpreadTypeSelector value={v} onChange={setV} options={[]} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `options` is an empty array, a muted `No spreads` placeholder is rendered instead of the toggle row.",
      },
    },
  },
};