import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { StrikesNavigator } from "./index";

const meta: Meta<typeof StrikesNavigator> = {
  title: "Components/StrikesNavigator",
  component: StrikesNavigator,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof StrikesNavigator>;

const strikes = Array.from({ length: 80 }, (_, i) => 360 + i * 2.5);

export const Default: Story = {
  render: () => {
    const [sel, setSel] = useState<number | undefined>(400);
    return (
      <StrikesNavigator
        strikes={strikes}
        atmStrike={400}
        selectedStrike={sel}
        onSelectStrike={setSel}
        className="w-48"
      />
    );
  },
};

export const Dense: Story = {
  render: () => (
    <StrikesNavigator
      strikes={strikes}
      atmStrike={420}
      viewportRows={10}
      className="w-56"
    />
  ),
};

export const UncontrolledSelection: Story = {
  render: () => {
    const [sel, setSel] = useState<number | undefined>(undefined);
    return (
      <StrikesNavigator
        strikes={[380, 390, 400, 410, 420]}
        atmStrike={400}
        selectedStrike={sel}
        onSelectStrike={setSel}
        className="w-48"
      />
    );
  },
};

export const ControlledSelection: Story = {
  render: () => {
    const [sel, setSel] = useState<number>(410);
    return (
      <StrikesNavigator
        strikes={[380, 390, 400, 410, 420]}
        atmStrike={400}
        selectedStrike={sel}
        onSelectStrike={setSel}
        className="w-48"
      />
    );
  },
};

export const EmptyStrikes: Story = {
  render: () => (
    <StrikesNavigator
      strikes={[]}
      atmStrike={400}
      className="w-48"
    />
  ),
};

export const SingleStrike: Story = {
  render: () => (
    <StrikesNavigator
      strikes={[400]}
      atmStrike={400}
      className="w-48"
    />
  ),
};

export const AtmBetweenStrikes: Story = {
  // Spot lands between two strikes; both should be ATM given the tolerance.
  render: () => (
    <StrikesNavigator
      strikes={[380, 390, 400, 410, 420]}
      atmStrike={405}
      atmTolerance={5}
      className="w-48"
    />
  ),
};

export const AtmBetweenStrikesTight: Story = {
  // Spot lands between strikes but tolerance is tight → none are ATM.
  render: () => (
    <StrikesNavigator
      strikes={[380, 390, 400, 410, 420]}
      atmStrike={405}
      atmTolerance={1}
      className="w-48"
    />
  ),
};

export const KeyboardNav: Story = {
  render: () => {
    const [sel, setSel] = useState<number>(400);
    return (
      <StrikesNavigator
        strikes={strikes}
        atmStrike={400}
        selectedStrike={sel}
        onSelectStrike={setSel}
        className="w-48"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Focus a row and use ArrowUp/ArrowDown to move selection (wraps at the ends). Home/End jump to first/last. Enter or Space selects.",
      },
    },
  },
};