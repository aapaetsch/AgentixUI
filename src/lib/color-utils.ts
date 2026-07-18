/**
 * Finance-oriented color helpers.
 *
 * These helpers map numeric signs / sentiment labels to tailwind utility
 * classes backed by the semantic `--positive` / `--negative` tokens defined
 * in `src/globals.css`.
 *
 * @module color-utils
 */

/**
 * Map a P&L value to a tailwind text color class based on its sign.
 *
 * - Positive → `text-positive`
 * - Negative → `text-negative`
 * - Zero / NaN → `text-foreground`
 *
 * @example
 * pnlColorClass(12.34) // "text-positive"
 * pnlColorClass(-1.2) // "text-negative"
 * pnlColorClass(0) // "text-foreground"
 */
export function pnlColorClass(value: number): string {
  if (!Number.isFinite(value) || value === 0) return "text-foreground";
  return value > 0 ? "text-positive" : "text-negative";
}

/**
 * Map a sentiment label to a tailwind text color class.
 *
 * @example
 * sentimentColor("positive") // "text-positive"
 * sentimentColor("negative") // "text-negative"
 * sentimentColor("neutral") // "text-muted-foreground"
 */
export function sentimentColor(
  sentiment: "positive" | "negative" | "neutral"
): string {
  switch (sentiment) {
    case "positive":
      return "text-positive";
    case "negative":
      return "text-negative";
    case "neutral":
    default:
      return "text-muted-foreground";
  }
}

/**
 * Resolve a CSS custom property value at runtime.
 *
 * Accepts the CSS variable name with or without the leading `--`.
 * Reads from `:root` via `getComputedStyle`. Returns an empty string when not
 * running in a browser (SSR / Electron main process) or when the variable is
 * not defined.
 *
 * @example
 * resolveToken("--positive") // "158 64% 52%"
 * resolveToken("positive") // "158 64% 52%"
 */
export function resolveToken(name: string): string {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "";
  }
  const varName = name.startsWith("--") ? name : `--${name}`;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return value;
}