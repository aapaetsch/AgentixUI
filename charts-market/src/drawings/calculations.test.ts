import { describe, expect, it } from "vitest";
import { calculateDrawingVwap, calculateLinearRegression, calculatePosition, calculateRangeMeasurement, simplifyCoordinates, sourceValue } from ".";

const bars = [
  { time: 1, open: 9, high: 11, low: 8, close: 10, volume: 100 },
  { time: 2, open: 10, high: 12, low: 9, close: 11, volume: 0 },
  { time: 3, open: 11, high: 13, low: 10, close: 12, volume: 300 },
  { time: 4, open: 12, high: 14, low: 11, close: 13, volume: 200 },
];

describe("drawing calculations", () => {
  it("resolves price sources and inclusive reversed measurements", () => {
    expect(sourceValue(bars[0], "hlc3")).toBeCloseTo(29 / 3);
    expect(sourceValue(bars[0], "ohlc4")).toBe(9.5);
    expect(calculateRangeMeasurement(bars, { time: 4, price: 13 }, { time: 2, price: 10 })).toMatchObject({ absoluteChange: -3, bars: 3 });
  });

  it("calculates ordinary least-squares regression and deviation", () => {
    const regression = calculateLinearRegression(bars, "close");
    expect(regression).toMatchObject({ slope: 1, intercept: 10, deviation: 0 });
    expect(regression?.values).toEqual([10, 11, 12, 13]);
  });

  it("calculates VWAP inclusively, ignores zero weight, and supports every source", () => {
    for (const source of ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"] as const) expect(calculateDrawingVwap(bars, source).available).toBe(true);
    const result = calculateDrawingVwap(bars, "close");
    expect(result.points).toHaveLength(4);
    expect(result.points[1].value).toBe(result.points[0].value);
    expect(result.points.at(-1)?.value).toBeCloseTo((10 * 100 + 12 * 300 + 13 * 200) / 600);
  });

  it("marks VWAP unavailable when any included volume is missing", () => {
    const result = calculateDrawingVwap([{ ...bars[0], volume: undefined }, bars[1]]);
    expect(result).toMatchObject({ available: false, points: [] });
    expect(result.reason).toContain("volume is missing");
  });

  it("calculates long and short risk/reward without placing a trade", () => {
    expect(calculatePosition([{ time: 1, price: 100 }, { time: 2, price: 120 }, { time: 3, price: 90 }], "long", 10_000, 1)?.riskReward).toBe(2);
    expect(calculatePosition([{ time: 1, price: 100 }, { time: 2, price: 80 }, { time: 3, price: 110 }], "short")?.riskReward).toBe(2);
  });

  it("simplifies freehand points deterministically", () => {
    const input = [{ x: 0, y: 0 }, { x: 1, y: 0.05 }, { x: 2, y: -0.05 }, { x: 3, y: 0 }];
    expect(simplifyCoordinates(input, 0.1)).toEqual([{ x: 0, y: 0 }, { x: 3, y: 0 }]);
    expect(simplifyCoordinates(input, 0.1)).toEqual(simplifyCoordinates(input, 0.1));
  });
});
