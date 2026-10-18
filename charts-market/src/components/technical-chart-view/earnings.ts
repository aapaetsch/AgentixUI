import { marketTimeKey, type MarketTime, type OhlcBar } from "../../core";

export interface TechnicalEarningsEvent {
  id: string;
  /** Consumer-supplied announcement date; never fetched by the UI kit. */
  time: MarketTime;
  label?: string;
  session?: "before-open" | "after-close" | "during-session" | "unknown";
  estimated?: boolean;
  reportedEps?: number;
  estimatedEps?: number;
  /** Optional exact candle anchor, useful for intraday or custom sessions. */
  barTime?: MarketTime;
}

/** Date-only events align with the first candle on/after that UTC date.
 * Future events remain unanchored; no trading calendar is invented. */
export function earningsBarTime(
  event: TechnicalEarningsEvent,
  bars: readonly OhlcBar[],
): MarketTime | null {
  if (event.barTime != null) return event.barTime;
  const key = marketTimeKey(event.time);
  if (!Number.isFinite(key) || !bars.length) return null;
  const day = Math.floor(key / 86400) * 86400;
  if (day < Math.floor(marketTimeKey(bars[0].time) / 86400) * 86400)
    return null;
  let low = 0,
    high = bars.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (marketTimeKey(bars[middle].time) < day) low = middle + 1;
    else high = middle;
  }
  return bars[low]?.time ?? null;
}

export function earningsDescription(event: TechnicalEarningsEvent): string {
  const date = new Date(marketTimeKey(event.time) * 1000)
    .toISOString()
    .slice(0, 10);
  return `${event.label ?? "Earnings"} · ${date}${event.estimated ? " · Estimated date" : ""}${event.session && event.session !== "unknown" ? ` · ${event.session.replaceAll("-", " ")}` : ""}`;
}
