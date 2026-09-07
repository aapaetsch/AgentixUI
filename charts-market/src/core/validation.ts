import type { MarketTime, OhlcBar } from "./types";

export interface MarketDataIssue {
  code: "DUPLICATE_TIME" | "NON_ASCENDING_TIME" | "INVALID_OHLC" | "INVALID_NUMBER";
  index: number;
  message: string;
}

export function marketTimeKey(time: MarketTime): number {
  if (typeof time === "number") return time;
  if (typeof time === "string") return Date.parse(`${time}T00:00:00Z`) / 1000;
  return Date.UTC(time.year, time.month - 1, time.day) / 1000;
}

export function validateOhlcData(data: readonly OhlcBar[]): MarketDataIssue[] {
  const issues: MarketDataIssue[] = [];
  let previous = Number.NEGATIVE_INFINITY;

  data.forEach((bar, index) => {
    const time = marketTimeKey(bar.time);
    const values = [bar.open, bar.high, bar.low, bar.close];
    if (!Number.isFinite(time) || values.some((value) => !Number.isFinite(value))) {
      issues.push({ code: "INVALID_NUMBER", index, message: `Bar ${index} contains a non-finite value.` });
    }
    if (time === previous) {
      issues.push({ code: "DUPLICATE_TIME", index, message: `Bar ${index} duplicates the previous timestamp.` });
    } else if (time < previous) {
      issues.push({ code: "NON_ASCENDING_TIME", index, message: `Bar ${index} is not in ascending time order.` });
    }
    if (bar.high < Math.max(bar.open, bar.close) || bar.low > Math.min(bar.open, bar.close) || bar.high < bar.low) {
      issues.push({ code: "INVALID_OHLC", index, message: `Bar ${index} has inconsistent OHLC values.` });
    }
    previous = time;
  });

  return issues;
}

export function assertValidOhlcData(data: readonly OhlcBar[]): void {
  const issues = validateOhlcData(data);
  if (issues.length) throw new Error(issues.map((issue) => issue.message).join(" "));
}

export function reportMarketDataIssues(data: readonly OhlcBar[]): MarketDataIssue[] {
  const issues = validateOhlcData(data);
  if (issues.length && typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    console.warn("[aapaetsch-charts-market] Invalid market data", issues);
  }
  return issues;
}
