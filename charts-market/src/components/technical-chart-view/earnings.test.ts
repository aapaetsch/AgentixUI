import { describe, expect, it } from "vitest";
import { earningsBarTime, earningsDescription, earningsPinLeft } from "./earnings";
import { PriceScale } from "../../engine/price-scale";
import type { OhlcBar, MarketTime } from "../../core";
import type { TechnicalEarningsEvent } from "./earnings";

const bars: OhlcBar[] = (["2026-09-04", "2026-09-08", "2026-09-09"] as MarketTime[]).map((time) => ({
  time,
  open: 100,
  high: 102,
  low: 99,
  close: 101,
}));
describe("earnings date placement", () => {
  it("aligns a non-session announcement to the next available candle", () => {
    expect(earningsBarTime({ id: "weekend", time: "2026-09-06" }, bars)).toBe(
      "2026-09-08",
    );
  });
  it("never pins future or pre-history events to an unrelated edge candle", () => {
    expect(
      earningsBarTime({ id: "future", time: "2026-10-01" }, bars),
    ).toBeNull();
    expect(earningsBarTime({ id: "old", time: "2026-08-01" }, bars)).toBeNull();
    expect(earningsBarTime({ id: "empty", time: "2026-09-08" }, [])).toBeNull();
  });
  it("honors an explicit session anchor and retains the actual announcement date", () => {
    const event: TechnicalEarningsEvent = {
      id: "session",
      time: "2026-09-06",
      barTime: "2026-09-09",
      estimated: true,
    };
    expect(earningsBarTime(event, bars)).toBe("2026-09-09");
    expect(earningsDescription(event)).toContain("2026-09-06 · Estimated date");
  });
});
describe("earnings timeline hit targets", () => {
  it("keeps both fitted endpoints and bounds their 24px buttons and focus rings", () => {
    const pane = { left: 54, width: 358.21875 };
    expect(earningsPinLeft(54, pane)).toBe(56);
    expect(earningsPinLeft(412.21875, pane)).toBe(386.21875);
    expect(earningsPinLeft(200, pane)).toBe(188);
    expect(earningsPinLeft(358.21875, { width: 358.21875 })).toBe(332.21875);
  });
  it("never pulls an off-screen, missing or invalid anchor onto a visible edge", () => {
    const pane = { left: 54, width: 358.21875 };
    for (const x of [53.999, 412.219, null, undefined, NaN, Infinity, -Infinity]) {
      expect(earningsPinLeft(x, pane)).toBeNull();
    }
    expect(earningsPinLeft(0, { width: NaN })).toBeNull();
    expect(earningsPinLeft(0, { width: 27 })).toBeNull();
    expect(earningsPinLeft(0, { left: Infinity, width: 100 })).toBeNull();
  });
  it("retains an exact future calendar anchor without inventing a price row", () => {
    const source = JSON.stringify(bars);
    const event: TechnicalEarningsEvent = {
      id: "future-calendar", time: "2026-10-01", barTime: "2026-10-01",
    };
    expect(earningsBarTime(event, bars)).toBe("2026-10-01");
    expect(JSON.stringify(bars)).toBe(source);
  });
});
describe("readable scale ticks", () => {
  it("tightens explicit margins without losing visible extrema", () => {
    const scale = new PriceScale();
    scale.autoscale([90, 110], undefined, undefined, 0.025);
    expect(scale.snapshot.minimum).toBe(89.5);
    expect(scale.snapshot.maximum).toBe(110.5);
    expect(scale.ticks(5)).toEqual([90, 95, 100, 105, 110]);
  });
  it("places percentage ticks through the original price coordinates", () => {
    const scale = new PriceScale("percentage");
    scale.autoscale([90, 110], 100);
    expect(scale.ticks(5).map((value) => scale.formatPrice(value, 0))).toEqual([
      "-10%",
      "-5%",
      "0%",
      "5%",
      "10%",
    ]);
  });
});
