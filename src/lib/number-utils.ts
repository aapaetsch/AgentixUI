/**
 * Finance-grade numeric formatting utilities.
 *
 * All formatters are SSR-safe (no `window` access) and never hardcode colors.
 * Colorization is handled by `lib/color-utils.ts` and applied at the component layer.
 *
 * @module number-utils
 */

/** Supported NumericText display formats. */
export type NumericFormat =
  | "currency"
  | "percent"
  | "number"
  | "compact"
  | "basisPoints";

/** Options accepted by several number formatting helpers. */
export interface FormatNumberOptions {
  /** Number of decimal places to render. */
  precision?: number;
  /** Force an explicit sign (`+`) on positives. Negatives always render `-`. */
  signed?: boolean;
}

/** Options accepted by `formatCurrency`. */
export interface FormatCurrencyOptions extends FormatNumberOptions {
  /** ISO currency code, defaults to `"USD"`. */
  currency?: string;
}

/** Options accepted by `formatCompact`. */
export interface FormatCompactOptions {
  /** ISO currency code, when provided produces a compact currency string (e.g. `$1.2M`). */
  currency?: string;
}

/**
 * Prepend an explicit sign to an already-formatted string based on the sign
 * of `value`. Negatives already carry `-`, so this only adds `+` to positives.
 *
 * @param value - The original numeric value (used only for its sign).
 * @param formatted - The formatted string to annotate.
 * @returns The formatted string with a forced `+` prefix on positives.
 */
export function formatSigned(value: number, formatted: string): string {
  if (value > 0 && !formatted.trim().startsWith("+")) {
    return `+${formatted}`;
  }
  return formatted;
}

/**
 * Format a number as currency using `Intl.NumberFormat`.
 *
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(-1234.56, { signed: true }) // "-$1,234.56"
 * formatCurrency(1234.5, { currency: "EUR", precision: 2 }) // "€1,234.50"
 */
export function formatCurrency(
  value: number,
  opts: FormatCurrencyOptions = {}
): string {
  const { currency = "USD", precision, signed = false } = opts;
  const maximumFractionDigits =
    precision ?? (Number.isInteger(value) ? 0 : 2);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: precision ?? maximumFractionDigits,
    maximumFractionDigits,
  }).format(value);
  return signed ? formatSigned(value, formatted) : formatted;
}

/**
 * Format a value that is already expressed as a percent.
 *
 * The input is treated as the percent number itself, e.g. `1.84` → `"+1.84%"`.
 *
 * @example
 * formatPercent(1.84) // "1.84%"
 * formatPercent(-0.42, { signed: true }) // "-0.42%"
 * formatPercent(1.845, { precision: 1 }) // "1.8%"
 */
export function formatPercent(
  value: number,
  opts: FormatNumberOptions = {}
): string {
  const { precision = 2, signed = false } = opts;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
  const withPercent = `${formatted}%`;
  return signed ? formatSigned(value, withPercent) : withPercent;
}

/**
 * Format a number with thousands separators.
 *
 * @example
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234.5, { precision: 2 }) // "1,234.50"
 * formatNumber(1234.5, { signed: true }) // "+1,234.5"
 */
export function formatNumber(
  value: number,
  opts: FormatNumberOptions = {}
): string {
  const { precision, signed = false } = opts;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: precision ?? 0,
    maximumFractionDigits: precision ?? (Number.isInteger(value) ? 0 : 2),
  }).format(value);
  return signed ? formatSigned(value, formatted) : formatted;
}

/**
 * Format a number in compact notation (e.g. `1.2M`, `34.5K`).
 *
 * @example
 * formatCompact(1_200_000) // "1.2M"
 * formatCompact(34500) // "34.5K"
 * formatCompact(1_200_000, { currency: "USD" }) // "$1.2M"
 */
export function formatCompact(value: number, opts: FormatCompactOptions = {}): string {
  const { currency } = opts;
  const formatted = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
  return currency ? `${currencySymbol(currency)}${formatted}` : formatted;
}

/**
 * Format a value as basis points. The input is already in basis-point units;
 * the function appends the `" bps"` suffix.
 *
 * @example
 * formatBasisPoints(42) // "42 bps"
 * formatBasisPoints(12.5, { precision: 2 }) // "12.50 bps"
 */
export function formatBasisPoints(
  value: number,
  opts: FormatNumberOptions = {}
): string {
  const { precision = 0 } = opts;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
  return `${formatted} bps`;
}

/**
 * Round a numeric value to the nearest multiple of `tickSize`.
 *
 * @example
 * roundToTick(100.12, 0.05) // 100.1
 * roundToTick(100.14, 0.05) // 100.15
 */
export function roundToTick(value: number, tickSize: number): number {
  if (tickSize <= 0) return value;
  return Math.round(value / tickSize) * tickSize;
}

/**
 * Resolve the currency symbol for a given ISO currency code.
 * Falls back to the code itself if resolution fails.
 */
function currencySymbol(currency: string): string {
  try {
    const parts = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).formatToParts(0);
    const symbol = parts.find((p) => p.type === "currency")?.value;
    return symbol ?? currency;
  } catch {
    return currency;
  }
}