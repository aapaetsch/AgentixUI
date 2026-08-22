import { describe, expect, it } from "vitest";

import { IndexedOhlcStore, LogicalTimeScale, PaneLayout, PriceScale } from ".";

const data = Array.from({ length: 10 }, (_, index) => ({ time: (index + 1) * 100, open: 10 + index, high: 12 + index, low: 9 + index, close: 11 + index, volume: 100 + index }));

describe("first-party engine primitives", () => {
  it("indexes, searches, appends and updates sorted OHLC data", () => {
    const store = new IndexedOhlcStore(data);
    expect(store.nearestIndex(455)).toBe(4);
    store.appendOrUpdate({ ...data[9], close: 42 });
    store.appendOrUpdate({ time: 1_100, open: 20, high: 21, low: 19, close: 20 });
    expect(store.length).toBe(11);
    expect(store.latest?.time).toBe(1_100);
    expect(store.at(9)?.close).toBe(42);
  });

  it("compresses sessions into logical positions and round-trips coordinates", () => {
    const store = new IndexedOhlcStore(data);
    const scale = new LogicalTimeScale(store, 1_000, 100);
    scale.setVisibleTimes(300, 800);
    const x = scale.timeToCoordinate(500)!;
    expect(scale.coordinateToIndex(x)).toBe(4);
    const before = scale.visible.to - scale.visible.from;
    scale.zoomAt(x, 0.5);
    expect(scale.visible.to - scale.visible.from).toBeLessThan(before);
  });

  it("round-trips all price modes and rejects non-positive logarithmic values", () => {
    for (const mode of ["normal", "logarithmic", "percentage", "indexedTo100"] as const) {
      const scale = new PriceScale(mode, 0, 400);
      expect(scale.autoscale([80, 100, 120], 100)).toBeNull();
      const y = scale.toCoordinate(110)!;
      expect(scale.fromCoordinate(y)).toBeCloseTo(110, 8);
    }
    const logarithmic = new PriceScale("logarithmic");
    expect(logarithmic.autoscale([-1, 2], 2)).toMatch(/positive/i);
  });

  it("lays out and resizes synchronized panes", () => {
    const layout = new PaneLayout(800, 600);
    layout.setPanes(["price", "volume", "rsi"]);
    const before = layout.panes[0].height;
    const sizes = layout.resizeBoundary(0, 40);
    expect(layout.panes[0].height).toBeGreaterThan(before);
    expect(Object.values(sizes).reduce((sum, value) => sum + value, 0)).toBeCloseTo(1);
  });
});
