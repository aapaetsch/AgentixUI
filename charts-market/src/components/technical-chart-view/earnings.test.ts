import { describe, expect, it } from "vitest";
import { earningsBarTime, earningsDescription } from "./earnings";
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
