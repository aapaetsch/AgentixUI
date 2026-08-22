import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("recharts", () => {
  const passthrough = (name: string) => {
    const Component = ({ children, accessibilityLayer }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div data-recharts={name} data-accessibility-layer={String(Boolean(accessibilityLayer))}>
        {children}
      </div>
    );
    Component.displayName = name;
    return Component;
  };

  return {
    ResponsiveContainer: ({ children }: React.PropsWithChildren) => <>{children}</>,
    LineChart: passthrough("line-chart"),
    AreaChart: passthrough("area-chart"),
    BarChart: passthrough("bar-chart"),
    CartesianGrid: passthrough("grid"),
    XAxis: passthrough("x-axis"),
    YAxis: passthrough("y-axis"),
    Line: passthrough("line"),
    Area: passthrough("area"),
    Bar: passthrough("bar"),
    Tooltip: passthrough("tooltip"),
    Legend: passthrough("legend"),
  };
});

import { AreaChart } from "./area-chart";
import { BarChart } from "./bar-chart";
import { ChartContainer } from "./chart-container";
import { LineChart } from "./line-chart";

const data = [
  { month: "Jan", first: 10, second: 5 },
  { month: "Feb", first: 14, second: 8 },
];
const series = [
  { dataKey: "first", label: "First" },
  { dataKey: "second", label: "Second" },
];

describe("chart package components", () => {
  it("scopes chart config colors and forwards accessible DOM props", () => {
    render(
      <ChartContainer
        config={{ first: { label: "First", color: "#123456" } }}
        className="h-64"
        role="img"
        aria-label="Configured chart"
      >
        <svg />
      </ChartContainer>,
    );

    const chart = screen.getByRole("img", { name: "Configured chart" });
    expect(chart).toHaveClass("h-64");
    expect(chart.style.getPropertyValue("--color-first")).toBe("#123456");
    expect(chart).toHaveAttribute("data-chart");
  });

  it.each([
    ["line", LineChart],
    ["area", AreaChart],
    ["bar", BarChart],
  ] as const)("renders an accessible %s chart with the Recharts accessibility layer", (kind, Component) => {
    render(
      <Component
        aria-label={`${kind} performance`}
        data={data}
        xKey="month"
        series={series}
      />,
    );

    expect(screen.getByRole("img", { name: `${kind} performance` })).toBeInTheDocument();
    expect(document.querySelector(`[data-recharts="${kind}-chart"]`)).toHaveAttribute(
      "data-accessibility-layer",
      "true",
    );
    expect(document.querySelectorAll(`[data-recharts="${kind}"]`)).toHaveLength(2);
    expect(document.querySelector('[data-recharts="tooltip"]')).toBeInTheDocument();
    expect(document.querySelector('[data-recharts="legend"]')).toBeInTheDocument();
  });

  it("allows chart chrome to be disabled", () => {
    render(
      <LineChart
        aria-label="Minimal chart"
        data={data}
        xKey="month"
        series={series}
        showGrid={false}
        showTooltip={false}
        showLegend={false}
      />,
    );

    expect(document.querySelector('[data-recharts="grid"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-recharts="tooltip"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-recharts="legend"]')).not.toBeInTheDocument();
  });
});
