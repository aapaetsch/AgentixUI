import type { MarketTime, VisibleRange } from "./types";
import type { MarketViewportOptions } from "./technical-chart-state";
import { marketTimeKey } from "./validation";

/** Host-owned display coordinates. Never inserts observations or infers trading sessions. */
export type MarketTimeAxis =
  | { mode: "compressed" }
  | { mode: "utc"; domain: VisibleRange; intervalSeconds: number }
  | { mode: "calendar"; times: readonly MarketTime[] };

/** Open UTC interval whose interior must remain blank. Boundary observations are retained. */
export interface MarketTimeGap { from: MarketTime; to: MarketTime }

/** Gap boundaries are valid samples; only the open interior is whitespace. */
export function isMarketTimeInGap(time: MarketTime, gaps: readonly MarketTimeGap[] = []): boolean {
  const key = marketTimeKey(time);
  return gaps.some(gap => key > marketTimeKey(gap.from) && key < marketTimeKey(gap.to));
}

/** Validate runtime geometry before creating or updating an engine. */
export function validateMarketTimeGeometry(axis?: MarketTimeAxis, gaps: readonly MarketTimeGap[] = []): string[] {
  const errors: string[] = [];
  if (axis?.mode === "utc") {
    const from = marketTimeKey(axis.domain.from), to = marketTimeKey(axis.domain.to);
    if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from || !Number.isFinite(axis.intervalSeconds) || axis.intervalSeconds <= 0) errors.push("UTC axis requires ascending finite domain bounds and a positive intervalSeconds.");
  } else if (axis?.mode === "calendar") {
    const keys = axis.times.map(marketTimeKey);
    if (!keys.length || keys.some((key, index) => !Number.isFinite(key) || index > 0 && key <= keys[index - 1])) errors.push("Calendar times must be finite, unique and ascending.");
  } else if (axis && axis.mode !== "compressed") errors.push("Unknown market time axis mode.");
  if (gaps.some(gap => !Number.isFinite(marketTimeKey(gap.from)) || !Number.isFinite(marketTimeKey(gap.to)) || marketTimeKey(gap.to) <= marketTimeKey(gap.from))) errors.push("Time gaps require ascending finite UTC bounds.");
  return errors;
}

/** True when a stroke would cross a host-declared open interval. No cadence/session guesses. */
export function crossesMarketTimeGap(from: MarketTime, to: MarketTime, gaps: readonly MarketTimeGap[] = []): boolean {
  const a = Math.min(marketTimeKey(from), marketTimeKey(to)), b = Math.max(marketTimeKey(from), marketTimeKey(to));
  return gaps.some(gap => a < marketTimeKey(gap.to) && b > marketTimeKey(gap.from));
}

/** Applying external inclusive bounds discards local index coordinates, preserving other viewport options. */
export function withMarketVisibleRange(viewport: MarketViewportOptions, visibleRange: VisibleRange): MarketViewportOptions {
  const { logicalRange: _logicalRange, ...rest } = viewport;
  void _logicalRange;
  return { ...rest, visibleRange };
}
