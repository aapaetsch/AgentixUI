import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Label } from "./index";
import { Input } from "../input";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    children: "Email",
  },
  argTypes: {
    htmlFor: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Label>;

/**
 * A basic standalone label.
 */
export const Basic: Story = {
  render: (args) => <Label {...args} />,
};

/**
 * A label associated with a disabled input via `htmlFor`. Demonstrates the
 * `peer-disabled:cursor-not-allowed peer-disabled:opacity-70` styling.
 */
export const WithDisabledInput: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="disabled-email" {...args}>
        Email
      </Label>
      <Input id="disabled-email" type="email" disabled placeholder="you@example.com" />
    </div>
  ),
};

/**
 * A label for a required field with a custom asterisk marker.
 */
export const WithRequiredAsterisk: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label {...args}>
        Email
        <span className="text-destructive" aria-hidden="true">
          {" "}
          *
        </span>
        <span className="sr-only">required</span>
      </Label>
      <Input type="email" placeholder="you@example.com" />
    </div>
  ),
};

/**
 * A label wired to an input via `htmlFor` and `id`.
 */
export const WithHtmlFor: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="username" {...args}>
        Username
      </Label>
      <Input id="username" type="text" placeholder="Ada Lovelace" />
    </div>
  ),
};