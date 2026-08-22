import { describe, expect, it } from "vitest";
import { correlationCells } from "./correlation-matrix";
import { cumulativeDepth } from "./depth-chart";
import { calculateDrawdown } from "./drawdown-chart";

describe("quantitative chart calculations", () => {
  it("creates cumulative order-book depth", () => {
    expect(cumulativeDepth([{ price: 101, size: 2 }, { price: 100, size: 3 }])).toEqual([
      { price: 100, size: 3 }, { price: 101, size: 5 },
    ]);
  });

  it("calculates drawdown from the running peak", () => {
    const values = calculateDrawdown([{ time: 1, equity: 100 }, { time: 2, equity: 80 }, { time: 3, equity: 120 }]);
    expect(values.map((point) => point.drawdown)).toEqual([0, -20, 0]);
  });

  it("flattens a correlation matrix with stable labels", () => {
    expect(correlationCells(["A", "B"], [[1, 0.5], [0.5, 1]])).toEqual([
      { x: "A", y: "A", value: 1 }, { x: "B", y: "A", value: 0.5 },
      { x: "A", y: "B", value: 0.5 }, { x: "B", y: "B", value: 1 },
    ]);
  });
});
