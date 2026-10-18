import { describe, expect, it } from "vitest";
import {
  createTechnicalChartViewState,
  parseTechnicalChartViewState,
  serializeTechnicalChartViewState,
  technicalChartViewReducer,
  adaptLegacyPanes,
} from "../core";
import { IndexedOhlcStore } from "./data-store";
import { LogicalTimeScale } from "./time-scale";
import { PaneLayout } from "./pane-layout";
import { calculateVolumeProfile, selectProfileBars } from "./volume-profile";
import { layoutAxisBadges } from "./axis-badges";
import { technicalChartFixture } from "../components/technical-chart-view/fixtures";

describe("technical chart state and geometry", () => {
  it("round-trips opaque extension data and rejects unsupported versions", () => {
    const state = createTechnicalChartViewState();
    state.extensions = { plugin: { future: [1, "hello"] } };
    state.indicators[0].extensions = { opaque: true };
    expect(
      parseTechnicalChartViewState(serializeTechnicalChartViewState(state)),
    ).toEqual(state);
    expect(() => parseTechnicalChartViewState('{"version":2}')).toThrow();
  });
  it("moves panes without dropping grouped studies or extension state", () => {
    const state = createTechnicalChartViewState();
    const next = technicalChartViewReducer(state, {
      type: "move-pane",
      id: "price",
      direction: -1,
    });
    expect(next.panes[0].id).toBe("price");
    expect(next.panes.find((p) => p.id === "trend")?.showVolume).toBe(true);
    expect(state.panes[0].id).toBe("momentum");
  });
  it("preserves legacy independent pane order and weights", () => {
    expect(
      adaptLegacyPanes(["rsi", "macd"], true, { rsi: 2 }).map((p) => [
        p.id,
        p.size,
      ]),
    ).toEqual([
      ["price", 3],
      ["volume", 1],
      ["rsi", 2],
      ["macd", 1],
    ]);
  });
  it("keeps the latest candle separated and round-trips exact logical ranges", () => {
    const scale = new LogicalTimeScale(
      new IndexedOhlcStore(technicalChartFixture),
      1000,
      72,
    );
    scale.setRightOffset(30);
    scale.fitContent();
    const x = scale.timeToCoordinate(technicalChartFixture.at(-1)!.time)!;
    expect(x).toBeLessThan(scale.plotWidth);
    expect(scale.coordinateToIndex(x)).toBe(219);
    const before = scale.visible;
    scale.setLogicalRange(before);
    expect(scale.visible).toEqual(before);
    scale.fitContent();
    expect(scale.rightOffsetBars).toBe(30);
    scale.setRightOffset(1000, 0, 50);
    expect(scale.rightOffsetBars).toBe(50);
  });
  it("groups four panes, honors minima and collapses without hiding other panes", () => {
    const layout = new PaneLayout(800, 700);
    const state = createTechnicalChartViewState();
    layout.setDefinitions(state.panes);
    expect(layout.panes.map((p) => p.id)).toEqual([
      "momentum",
      "price",
      "trend",
      "oscillator",
    ]);
    expect(layout.panes[1].height).toBeGreaterThan(120);
    layout.setDefinitions(
      state.panes.map((p) =>
        p.id === "momentum" ? { ...p, collapsed: true } : p,
      ),
    );
    expect(layout.panes[0].height).toBe(28);
    expect(layout.panes.reduce((n, p) => n + p.height, 0)).toBeCloseTo(672);
  });
  it("lays out badges deterministically without overlap and keeps last-price priority", () => {
    const input = Array.from({ length: 12 }, (_, i) => ({
      id: String(i),
      y: 50,
      text: String(i),
      color: "red",
      priority: i === 0 ? 100 : 1,
    }));
    const result = layoutAxisBadges(input, 0, 100);
    expect(result.some((b) => b.id === "0")).toBe(true);
    expect(result.length).toBe(5);
    result
      .slice(1)
      .forEach((b, i) => expect(b.y - result[i].y).toBeGreaterThanOrEqual(19));
  });
});
describe("volume profile fixtures", () => {
  const settings = createTechnicalChartViewState().profiles[0];
  const levels = [
    { priceFrom: 10, priceTo: 11, upVolume: 10, downVolume: 0 },
    { priceFrom: 11, priceTo: 12, upVolume: 30, downVolume: 20 },
    { priceFrom: 12, priceTo: 13, upVolume: 15, downVolume: 5 },
    { priceFrom: 13, priceTo: 14, upVolume: 20, downVolume: 0 },
  ];
  it("defaults derived profiles to 24 readable price rows", () => {
    const result = calculateVolumeProfile(
      { kind: "derive-from-bars", bars: technicalChartFixture },
      settings,
    );
    expect(settings.rows).toBe(24);
    expect(result.rows).toHaveLength(24);
  });
  it("calculates independently known POC, contiguous VAH/VAL and total", () => {
    const r = calculateVolumeProfile({ kind: "levels", levels }, settings);
    expect(r).toMatchObject({
      poc: 11.5,
      val: 11,
      vah: 13,
      totalVolume: 100,
      provenance: "supplied-levels",
    });
  });
  it("preserves estimated volume and differentiates up/down from bid/ask", () => {
    const r = calculateVolumeProfile(
      {
        kind: "derive-from-bars",
        bars: [
          { time: 1, open: 10, close: 12, low: 10, high: 12, volume: 80 },
          { time: 2, open: 12, close: 10, low: 10, high: 12, volume: 20 },
        ],
      },
      { ...settings, rows: 2 },
    );
    expect(r.totalVolume).toBeCloseTo(100);
    expect(r.rows[0]).toMatchObject({ upVolume: 40, downVolume: 10 });
    expect(r.provenance).toBe("bar-derived-approximation");
  });
  it("limits visible/session/fixed ranges and reports missing volume explicitly", () => {
    const bars = technicalChartFixture;
    const range = { from: bars[10].time, to: bars[19].time };
    expect(selectProfileBars(bars, settings, range)).toHaveLength(10);
    expect(
      selectProfileBars(bars, {
        ...settings,
        range: "session",
        timeRange: range,
      }),
    ).toHaveLength(10);
    expect(
      selectProfileBars(bars, { ...settings, range: "fixed" }),
    ).toHaveLength(0);
    expect(
      calculateVolumeProfile(
        { kind: "derive-from-bars", bars: [{ ...bars[0], volume: undefined }] },
        settings,
      ).unavailable,
    ).toMatch(/unavailable/);
  });
  it("handles flat prices, zero volumes, ticks-per-row and invalid supplied levels", () => {
    const bar = { time: 1, open: 10, close: 10, high: 10, low: 10, volume: 50 };
    expect(
      calculateVolumeProfile(
        { kind: "derive-from-bars", bars: [bar] },
        { ...settings, rows: { ticksPerRow: 2 }, tickSize: 0.01 },
      ).totalVolume,
    ).toBe(50);
    expect(
      calculateVolumeProfile(
        { kind: "derive-from-bars", bars: [{ ...bar, volume: 0 }] },
        settings,
      ).poc,
    ).toBeNull();
    expect(
      calculateVolumeProfile(
        { kind: "levels", levels: [{ ...levels[0], downVolume: -1 }] },
        settings,
      ).unavailable,
    ).toBeTruthy();
  });
});
