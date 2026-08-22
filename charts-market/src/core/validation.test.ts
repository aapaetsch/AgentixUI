import { describe, expect, it, vi } from "vitest";

import { reportMarketDataIssues, validateOhlcData } from "./validation";

describe("validateOhlcData", () => {
  it("accepts unique ascending bars", () => {
    expect(validateOhlcData([
      { time: 1, open: 10, high: 12, low: 9, close: 11 },
      { time: 2, open: 11, high: 13, low: 10, close: 12 },
    ])).toEqual([]);
  });

  it("reports duplicate timestamps and inconsistent ranges", () => {
    const issues = validateOhlcData([
      { time: 1, open: 10, high: 12, low: 9, close: 11 },
      { time: 1, open: 14, high: 13, low: 15, close: 12 },
    ]);
    expect(issues.map((issue) => issue.code)).toEqual(["DUPLICATE_TIME", "INVALID_OHLC"]);
  });

  it("emits development diagnostics", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    reportMarketDataIssues([{ time: 1, open: 2, high: 1, low: 3, close: 2 }]);
    expect(warning).toHaveBeenCalledOnce();
    warning.mockRestore();
  });
});
