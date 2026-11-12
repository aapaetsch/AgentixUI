import type { MarketTime, VisibleRange } from "./types";
import type { MarketViewportOptions } from "./technical-chart-state";
import { marketTimeKey } from "./validation";

/** Host-owned display coordinates. Never inserts observations or infers trading sessions. */
export type MarketTimeAxis = (
  | { mode: "compressed" }
  | { mode: "utc"; domain: VisibleRange; intervalSeconds: number }
  | { mode: "calendar"; times: readonly MarketTime[] }
) & { futureDisplay?: MarketFutureDisplayPolicy };

/** Authored annotation ruler only. UTC elapsed time, never a future session/bar calendar. */
export interface MarketFutureDisplayPolicy {
  convention: "utc-calendar";
  /** Seconds per logical display slot after the last known coordinate; explicit, never inferred. */
  intervalSeconds: number;
  /** UTC calendar months after that coordinate, 1..60 (integer), default 12. Month-end clamps. */
  horizonMonths?: number;
  /** Required to draw on an empty compressed axis. Ignored when known coordinates exist. */
  emptyOrigin?: MarketTime;
}

/** Add UTC calendar months while retaining time of day and clamping the day of month. */
export function marketFutureDisplayEnd(time: MarketTime, months = 12): number {
  const date = new Date(marketTimeKey(time) * 1000), day = date.getUTCDate();
  date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() + (months ?? 12));
  const end = new Date(date.getTime()); end.setUTCMonth(end.getUTCMonth() + 1); end.setUTCDate(0);
  date.setUTCDate(Math.min(day, end.getUTCDate()));
  return date.getTime() / 1000;
}

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
  const future = axis?.futureDisplay;
  if (future && (future.convention !== "utc-calendar" || !Number.isFinite(future.intervalSeconds) || future.intervalSeconds < 1 || future.intervalSeconds > 366 * 86400
    || future.horizonMonths != null && (!Number.isInteger(future.horizonMonths) || future.horizonMonths < 1 || future.horizonMonths > 60)
    || future.emptyOrigin != null && !Number.isFinite(marketTimeKey(future.emptyOrigin)))) errors.push("Future display requires utc-calendar, intervalSeconds 1..31622400, horizonMonths 1..60 and a finite optional emptyOrigin.");
  if (future) {
    const seam = axis?.mode === 'calendar' ? axis.times.at(-1) : axis?.mode === 'utc' ? axis.domain.to : future.emptyOrigin;
    if (seam != null && !Number.isFinite(marketFutureDisplayEnd(seam, future.horizonMonths))) errors.push('Future display requires a representable UTC date and horizon.');
  }
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
