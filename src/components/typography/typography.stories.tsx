import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Typography,
  NumericText,
  typographyVariants,
  numericTextVariants,
} from "./index";

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "subtitle",
        "body",
        "caption",
        "overline",
      ],
    },
    align: {
      control: "radio",
      options: ["left", "center", "right"],
    },
    truncate: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Default: Story = {
  render: (args) => <Typography {...args}>The quick brown fox</Typography>,
};

export const AllVariants: Story = {
  name: "All Typography Variants",
  render: () => (
    <div className="flex flex-col gap-3 p-6">
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
      <Typography variant="subtitle">Subtitle text</Typography>
      <Typography variant="body">Body text</Typography>
      <Typography variant="caption">Caption text</Typography>
      <Typography variant="overline">Overline text</Typography>
    </div>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="flex flex-col gap-2 p-6 w-80 border rounded-md">
      <Typography variant="body" align="left">Left aligned</Typography>
      <Typography variant="body" align="center">Center aligned</Typography>
      <Typography variant="body" align="right">Right aligned</Typography>
    </div>
  ),
};

export const Truncation: Story = {
  render: () => (
    <div className="w-48 p-4 border rounded-md">
      <Typography variant="body" truncate>
        A very long line of body text that should be truncated with an ellipsis when it overflows the container
      </Typography>
    </div>
  ),
};

export const Polymorphic: Story = {
  render: () => (
    <div className="flex flex-col gap-2 p-6">
      <Typography as="h2" variant="h2">Rendered as h2</Typography>
      <Typography as="span" variant="caption">Rendered as span</Typography>
      <Typography as="div" variant="overline">Rendered as div</Typography>
    </div>
  ),
};

/* ------------------------------------------------------------------------- *
 * NumericText stories
 * ------------------------------------------------------------------------- */

const NumericTextExample = (props: React.ComponentProps<typeof NumericText>) => (
  <div className="flex items-center justify-end gap-2 w-64">
    <NumericText {...props} />
  </div>
);

export const NumericCurrency: Story = {
  name: "NumericText — Currency",
  render: () => (
    <div className="flex flex-col gap-2 p-6">
      <NumericTextExample value={1234.56} format="currency" />
      <NumericTextExample value={0} format="currency" />
      <NumericTextExample value={-1234.56} format="currency" />
      <NumericTextExample value={1234.56} format="currency" signed />
      <NumericTextExample value={1234000} format="currency" precision={0} />
    </div>
  ),
};

export const NumericPercent: Story = {
  name: "NumericText — Percent",
  render: () => (
    <div className="flex flex-col gap-2 p-6">
      <NumericTextExample value={1.84} format="percent" />
      <NumericTextExample value={-0.42} format="percent" />
      <NumericTextExample value={1.84} format="percent" signed colorize />
      <NumericTextExample value={-0.42} format="percent" signed colorize />
      <NumericTextExample value={0} format="percent" signed colorize />
    </div>
  ),
};

export const NumericCompact: Story = {
  name: "NumericText — Compact",
  render: () => (
    <div className="flex flex-col gap-2 p-6">
      <NumericTextExample value={1_200_000} format="compact" />
      <NumericTextExample value={34_500} format="compact" />
      <NumericTextExample value={1_200_000} format="compact" currency="USD" />
    </div>
  ),
};

export const NumericBasisPoints: Story = {
  name: "NumericText — Basis Points",
  render: () => (
    <div className="flex flex-col gap-2 p-6">
      <NumericTextExample value={42} format="basisPoints" />
      <NumericTextExample value={12.5} format="basisPoints" precision={2} />
    </div>
  ),
};

export const NumericColorizedColumn: Story = {
  name: "NumericText — Colorized P&L Column",
  render: () => (
    <div className="flex flex-col gap-2 p-6 w-64 border rounded-md">
      <NumericTextExample value={1234.56} format="currency" signed colorize />
      <NumericTextExample value={-567.89} format="currency" signed colorize />
      <NumericTextExample value={0} format="currency" signed colorize />
      <NumericTextExample value={1.84} format="percent" signed colorize />
      <NumericTextExample value={-0.42} format="percent" signed colorize />
    </div>
  ),
};

export const NumericMonospace: Story = {
  name: "NumericText — Monospace",
  render: () => (
    <div className="flex flex-col gap-2 p-6">
      <NumericTextExample value={1234.5678} format="number" monospace precision={4} />
      <NumericTextExample value={1234.5678} format="number" precision={4} />
    </div>
  ),
};