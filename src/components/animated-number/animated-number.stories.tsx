import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedNumber } from "./index";
import { formatCurrency, formatPercent, formatCompact } from "../../lib/number-utils";

const meta: Meta<typeof AnimatedNumber> = {
  title: "Components/AnimatedNumber",
  component: AnimatedNumber,
  tags: ["autodocs"],
  argTypes: {
    duration: { control: { type: "number", min: 0, max: 3000, step: 50 } },
    flashOnChange: { control: "boolean" },
    flashColor: { control: "radio", options: ["positive", "negative", "auto"] },
    align: { control: "radio", options: ["left", "right"] },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedNumber>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState(0);
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <AnimatedNumber
          value={value}
          format={(v) => formatCurrency(v, { precision: 2 })}
          duration={600}
          flashOnChange
        />
        <div className="flex gap-2">
          <button
            className="rounded-md border px-3 py-1 text-sm hover:bg-accent"
            onClick={() => setValue((v) => v + 123.45)}
          >
            +123.45
          </button>
          <button
            className="rounded-md border px-3 py-1 text-sm hover:bg-accent"
            onClick={() => setValue((v) => v - 123.45)}
          >
            -123.45
          </button>
        </div>
      </div>
    );
  },
};

export const CountUpCurrency: Story = {
  name: "Count Up — Currency",
  render: () => {
    const [value, setValue] = React.useState(0);
    React.useEffect(() => {
      const id = window.setInterval(
        () => setValue((v) => v + 1234.56),
        1500
      );
      return () => window.clearInterval(id);
    }, []);
    return (
      <div className="p-8">
        <AnimatedNumber
          value={value}
          format={(v) => formatCurrency(v, { precision: 2 })}
          duration={700}
        />
      </div>
    );
  },
};

export const CountDownPercent: Story = {
  name: "Count Down — Percent",
  render: () => {
    const [value, setValue] = React.useState(10);
    React.useEffect(() => {
      const id = window.setInterval(
        () => setValue((v) => (v <= -10 ? 10 : v - 0.5)),
        200
      );
      return () => window.clearInterval(id);
    }, []);
    return (
      <div className="p-8">
        <AnimatedNumber
          value={value}
          format={(v) => formatPercent(v, { precision: 2, signed: true })}
          duration={200}
        />
      </div>
    );
  },
};

export const CompactKPI: Story = {
  name: "Compact KPI",
  render: () => {
    const [value, setValue] = React.useState(1_200_000);
    React.useEffect(() => {
      const id = window.setInterval(
        () => setValue((v) => v + Math.round(Math.random() * 1_000_000 - 500_000)),
        2500
      );
      return () => window.clearInterval(id);
    }, []);
    return (
      <div className="p-8">
        <AnimatedNumber
          value={value}
          format={(v) => formatCompact(v, { currency: "USD" })}
          duration={500}
          flashOnChange
        />
      </div>
    );
  },
};

export const ReducedMotion: Story = {
  name: "Reduced Motion",
  render: () => {
    const [value, setValue] = React.useState(0);
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <AnimatedNumber
          value={value}
          format={(v) => formatCurrency(v, { precision: 2 })}
          reducedMotion
        />
        <button
          className="rounded-md border px-3 py-1 text-sm hover:bg-accent"
          onClick={() => setValue((v) => v + 999.99)}
        >
          +999.99
        </button>
      </div>
    );
  },
};

export const HighFrequency: Story = {
  name: "High-Frequency Updates",
  render: () => {
    const [value, setValue] = React.useState(100);
    React.useEffect(() => {
      const id = window.setInterval(
        () => setValue((v) => v + (Math.random() - 0.5) * 5),
        60
      );
      return () => window.clearInterval(id);
    }, []);
    return (
      <div className="p-8">
        <AnimatedNumber
          value={value}
          format={(v) => formatCurrency(v, { precision: 2 })}
          duration={120}
        />
      </div>
    );
  },
};