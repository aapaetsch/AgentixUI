import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Kbd } from "./index";

const meta: Meta<typeof Kbd> = {
  title: "Components/Kbd",
  component: Kbd,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  render: (args) => <Kbd {...args} />,
  args: {
    children: "⌘",
  },
};

export const SingleKey: Story = {
  name: "Single key",
  render: () => (
    <div className="flex items-center gap-3 p-6">
      <Kbd>⌘</Kbd>
      <Kbd>A</Kbd>
      <Kbd>Esc</Kbd>
    </div>
  ),
};

export const Combo: Story = {
  name: "Key combo (two Kbd children)",
  render: () => (
    <div className="flex items-center gap-3 p-6">
      <span className="flex items-center gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
      <span className="text-muted-foreground text-sm">Command palette</span>
    </div>
  ),
};

export const ComboAsText: Story = {
  name: "Combo as text children",
  render: () => (
    <div className="flex items-center gap-3 p-6">
      <Kbd>Shift + Tab</Kbd>
    </div>
  ),
};

export const WithClassNameOverride: Story = {
  name: "className overrides",
  render: () => (
    <div className="flex items-center gap-3 p-6">
      <Kbd className="bg-transparent border-dashed text-foreground">⌘</Kbd>
      <Kbd className="px-2 py-1 text-sm">Enter</Kbd>
    </div>
  ),
};