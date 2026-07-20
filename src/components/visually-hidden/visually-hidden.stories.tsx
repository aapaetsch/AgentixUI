import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { VisuallyHidden } from "./index";

const meta: Meta<typeof VisuallyHidden> = {
  title: "Components/VisuallyHidden",
  component: VisuallyHidden,
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: ["span", "label", "a", "div"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

export const Default: Story = {
  render: (args) => (
    <p className="p-6 text-sm">
      Visible label:
      <label className="ml-2 font-medium">Search</label>
      <VisuallyHidden as="label" htmlFor="hidden-search" {...args}>
        Screen-reader-only label
      </VisuallyHidden>
      <input
        id="hidden-search"
        type="search"
        className="ml-2 rounded border border-border px-2 py-1 text-sm"
        placeholder="type…"
      />
    </p>
  ),
};

export const HiddenLabel: Story = {
  name: "Hidden label",
  render: () => (
    <div className="p-6 text-sm">
      <VisuallyHidden as="label" htmlFor="email">
        Email address
      </VisuallyHidden>
      <input
        id="email"
        type="email"
        className="rounded border border-border px-2 py-1 text-sm"
        placeholder="you@example.com (no visible label)"
      />
    </div>
  ),
};

export const SkipToContent: Story = {
  name: "Skip to content (focus reveal)",
  render: () => (
    <div className="relative p-6">
      {/* Tab into this area to see it reveal */}
      <VisuallyHidden
        as="a"
        href="#main-content"
        className="left-4 top-4 z-50 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-md"
      >
        Skip to content
      </VisuallyHidden>
      <div
        id="main-content"
        className="mt-8 rounded-md border border-border p-4 text-sm"
      >
        Main content. Press <kbd>Tab</kbd> from the top of the page to focus the
        skip link.
      </div>
    </div>
  ),
};