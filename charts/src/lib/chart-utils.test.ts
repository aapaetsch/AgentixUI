import { describe, expect, it } from "vitest";

import { createChartConfig, formatChartValue, getSeriesColor } from "./chart-utils";

describe("chart utilities", () => {
  it("maps series metadata into a chart config", () => {
    expect(
      createChartConfig([
        { dataKey: "revenue", label: "Revenue", color: "#123456" },
        { dataKey: "cost" },
      ]),
    ).toEqual({
      revenue: { label: "Revenue", color: "#123456" },
      cost: { label: "cost", color: "hsl(var(--chart-2))" },
    });
  });

  it("cycles through the shared five-color palette", () => {
    expect(getSeriesColor({ dataKey: "sixth" }, 5)).toBe("hsl(var(--chart-1))");
  });

  it("formats scalar, range, and missing values", () => {
    expect(formatChartValue(1200, (value) => `$${value}`)).toBe("$1200");
    expect(formatChartValue([10, 20])).toBe("10 – 20");
    expect(formatChartValue(undefined)).toBe("—");
  });
});
