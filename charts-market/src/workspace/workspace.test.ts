import { describe, expect, it } from "vitest";

import { migrateWorkspaceState, parseWorkspaceState, serializeWorkspaceState, type TechnicalWorkspaceState } from ".";

const chart = {
  id: "chart-1", symbol: "AAPL", interval: "1D", chartType: "candlestick" as const, scaleMode: "normal" as const,
  indicators: [], drawings: [], overlays: [], paneSizes: { price: 0.7, volume: 0.3 }, extensions: { "future-plugin": { setting: true } },
};

describe("technical workspace persistence", () => {
  it("migrates v1 sequentially and preserves unknown extension state", () => {
    const migrated = migrateWorkspaceState({ version: 1, layout: "quad", charts: [chart], extensions: { custom: [1, 2] } });
    expect(migrated.version).toBe(2);
    expect(migrated.layout).toBe(4);
    expect(migrated.extensions).toEqual({ custom: [1, 2] });
    expect(migrated.charts[0].extensions).toEqual({ "future-plugin": { setting: true } });
    expect(migrated.charts[0].paneSizes).toEqual({ price: 0.7, volume: 0.3 });
  });

  it("round-trips current state", () => {
    const state: TechnicalWorkspaceState = {
      version: 2, name: "Swing setup", layout: 1, charts: [chart], activeChartId: "chart-1",
      synchronized: { symbol: false, interval: false, visibleRange: true, crosshair: true },
    };
    expect(parseWorkspaceState(serializeWorkspaceState(state))).toEqual(state);
  });

  it("rejects malformed input", () => {
    expect(() => parseWorkspaceState('{"version":2}')).toThrow("Invalid technical workspace state");
  });
});
