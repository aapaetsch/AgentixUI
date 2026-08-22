import { describe, expect, it } from "vitest";

import { builtInIndicators, calculateAtr, calculateEma, calculateRsi, calculateSma, calculateVwap } from ".";

const bars = [10, 11, 12, 13, 14].map((close, index) => ({
  time: index + 1,
  open: close - 0.5,
  high: close + 1,
  low: close - 1,
  close,
  volume: 100,
}));

describe("built-in indicator calculations", () => {
  it("calculates SMA and EMA without mutating source data", () => {
    expect(calculateSma(bars, 3)[2].values.sma).toBe(11);
    expect(calculateEma(bars, 3)[4].values.ema).toBe(13);
    expect(bars[0].close).toBe(10);
  });

  it("calculates cumulative VWAP", () => {
    expect(calculateVwap(bars)[0].values.vwap).toBe(10);
    expect(calculateVwap(bars)[4].values.vwap).toBe(12);
  });

  it("reports 100 RSI for a sequence with no losses", () => {
    expect(calculateRsi(bars, 3)[3].values.rsi).toBe(100);
  });

  it("seeds ATR after the selected period", () => {
    expect(calculateAtr(bars, 3)[1].values.atr).toBeNull();
    expect(calculateAtr(bars, 3)[2].values.atr).toBe(2);
  });

  it("matches batch output when built-ins stream incrementally", () => {
    const stream = Array.from({ length: 80 }, (_, index) => ({ time: index + 1, open: 100 + Math.sin(index), high: 102 + Math.sin(index), low: 98 + Math.sin(index), close: 100 + Math.sin(index / 3) * 8, volume: 1000 + index * 7 }));
    builtInIndicators.forEach((definition) => {
      const runtime = definition.createRuntime?.(definition.defaultParameters); expect(runtime).toBeDefined();
      const points = runtime!.reset(stream.slice(0, 20)); stream.slice(20).forEach((bar) => points.push(runtime!.appendOrUpdate(bar)));
      const batch = definition.calculate(stream, definition.defaultParameters);
      definition.lines.forEach((line) => points.forEach((point, index) => { const value = point.values[line.id]; const expected = batch[index].values[line.id]; if (value == null || expected == null) expect(value).toBe(expected); else expect(value).toBeCloseTo(expected, 8); }));
    });
  });
});
