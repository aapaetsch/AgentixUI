/**
 * Relative-time and duration formatting helpers.
 *
 * All helpers are SSR-safe: they do not access `window` and never call
 * `Date.now()` at module scope. Any `Date` references happen inside function
 * bodies only.
 *
 * @module time-utils
 */

/** Options accepted by `formatRelativeTime`. */
export interface FormatRelativeTimeOptions {
  /** When true, renders the short form (`"2h"`) instead of the long form (`"2h ago"`). */
  short?: boolean;
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * Convert a `Date | number` (epoch ms) to a numeric timestamp.
 */
function toTimestamp(date: Date | number): number {
  return typeof date === "number" ? date : date.getTime();
}

/**
 * Compute the absolute difference in ms between the given timestamp and "now".
 * Uses `Date.now()` lazily so this is safe under SSR.
 */
function diffFromNow(date: Date | number): number {
  return Math.abs(Date.now() - toTimestamp(date));
}

/**
 * Format a date or epoch ms as a relative time string.
 *
 * Long form thresholds: `<60s` → `"just now"`, `<60m` → `"Xm ago"`,
 * `<24h` → `"Xh ago"`, `<7d` → `"Xd ago"`, else absolute `"YYYY-MM-DD"`.
 *
 * @example
 * formatRelativeTime(Date.now() - 2 * HOUR) // "2h ago"
 * formatRelativeTime(Date.now() - 2 * HOUR, { short: true }) // "2h"
 */
export function formatRelativeTime(
  date: Date | number,
  opts: FormatRelativeTimeOptions = {}
): string {
  const { short = false } = opts;
  const diff = diffFromNow(date);

  if (diff < MINUTE) return short ? "now" : "just now";
  if (diff < HOUR) {
    const m = Math.floor(diff / MINUTE);
    return short ? `${m}m` : `${m}m ago`;
  }
  if (diff < DAY) {
    const h = Math.floor(diff / HOUR);
    return short ? `${h}h` : `${h}h ago`;
  }
  if (diff < WEEK) {
    const d = Math.floor(diff / DAY);
    return short ? `${d}d` : `${d}d ago`;
  }

  return absoluteDate(toTimestamp(date));
}

/**
 * Format a date or epoch ms as a short relative time string.
 *
 * Identical to `formatRelativeTime(date, { short: true })`.
 *
 * @example
 * formatRelativeTimeShort(Date.now() - 3 * DAY) // "3d"
 */
export function formatRelativeTimeShort(date: Date | number): string {
  return formatRelativeTime(date, { short: true });
}

/**
 * Format a duration in milliseconds as a human-readable string.
 *
 * @example
 * formatDuration(83_000) // "1m 23s"
 * formatDuration(3_661_000) // "1h 1m 1s"
 */
export function formatDuration(ms: number): string {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(" ");
}

/**
 * Render a timestamp as an ISO-style absolute date `YYYY-MM-DD`.
 * Uses `en-CA` locale which emits ISO-style numeric dates.
 */
function absoluteDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}