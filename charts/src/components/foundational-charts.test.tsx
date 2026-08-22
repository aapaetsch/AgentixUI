import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("recharts", () => {
  const passthrough = (name: string) => {
    const Component = ({ children }: React.PropsWithChildren<Record<string, unknown>>) => <div data-recharts={name}>{children}</div>;
    Component.displayName = name;
    return Component;
  };
  return {
    ResponsiveContainer: ({ children }: React.PropsWithChildren) => <>{children}</>,
    BarChart: passthrough("bar-chart"), Bar: passthrough("bar"), CartesianGrid: passthrough("grid"),
    XAxis: passthrough("x-axis"), YAxis: passthrough("y-axis"), Tooltip: passthrough("tooltip"),
    ScatterChart: passthrough("scatter-chart"), Scatter: passthrough("scatter"), ZAxis: passthrough("z-axis"),
    Legend: passthrough("legend"), PieChart: passthrough("pie-chart"), Pie: passthrough("pie"), Cell: passthrough("cell"),
    Treemap: passthrough("treemap"), RadarChart: passthrough("radar-chart"), Radar: passthrough("radar"),
    PolarGrid: passthrough("polar-grid"), PolarAngleAxis: passthrough("polar-angle"), PolarRadiusAxis: passthrough("polar-radius"),
  };
});

import { BoxPlot } from "./box-plot";
import { DonutChart } from "./donut-chart";
import { Heatmap } from "./heatmap";
import { Histogram, binHistogramValues } from "./histogram";
import { RadarChart } from "./radar-chart";
import { ScatterPlot } from "./scatter-plot";
import { Treemap } from "./treemap";

describe("foundational charts", () => {
  it("bins values without dropping the maximum boundary", () => {
    const bins = binHistogramValues([0, 1, 2, 3], 3);
    expect(bins.map((bin) => bin.count)).toEqual([1, 1, 2]);
  });

  it.each([
    ["heatmap", <Heatmap aria-label="heatmap" data={[{ x: "A", y: "B", value: 1 }]} />],
    ["histogram", <Histogram aria-label="histogram" values={[1, 2, 3]} />],
    ["scatter", <ScatterPlot aria-label="scatter" series={[{ id: "s", data: [{ x: 1, y: 2 }] }]} />],
    ["donut", <DonutChart aria-label="donut" data={[{ name: "A", value: 1 }]} />],
    ["box", <BoxPlot aria-label="box" data={[{ category: "A", min: 0, q1: 1, median: 2, q3: 3, max: 4 }]} />],
    ["treemap", <Treemap aria-label="treemap" data={[{ name: "A", value: 1 }]} />],
    ["radar", <RadarChart aria-label="radar" categoryKey="name" data={[{ name: "A", value: 1 }]} series={[{ dataKey: "value" }]} />],
  ])("renders an accessible %s", (label, component) => {
    render(component);
    expect(screen.getByRole("img", { name: label })).toBeInTheDocument();
  });
});
