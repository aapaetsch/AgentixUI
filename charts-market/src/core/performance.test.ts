import { describe, expect, it } from "vitest";
import { MarketDataBuffer } from "./data-buffer";

describe("market-data performance gate", () => {
  it("retains 100,000 historical bars and 600 streaming updates without loss", () => {
    const historical = Array.from({ length: 100_000 }, (_, index) => ({ time: index + 1, open: 100, high: 102, low: 99, close: 101, volume: 1000 }));
    const buffer = new MarketDataBuffer(historical);
    for (let index = 0; index < 600; index += 1) {
      buffer.appendOrUpdate({ time: 100_001 + index, open: 101, high: 103, low: 100, close: 102, volume: 1100 });
    }
    buffer.appendOrUpdate({ time: 100_600, open: 102, high: 104, low: 101, close: 103, volume: 1200 });
    expect(buffer.length).toBe(100_600);
    expect(buffer.latest?.close).toBe(103);
  });
});
