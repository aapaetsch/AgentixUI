"use client";

import * as React from "react";

import { cn } from "../../lib/utils";
import { Badge } from "../badge";
import { formatDate, DATE_FORMATS } from "../../lib/date-utils";
import type { OptionContract, OptionType } from "../../lib/finance-types";

/* -------------------------------------------------------------------------------------------------
 * OptionSymbolBadge
 * ------------------------------------------------------------------------------------------------*/

/**
 * Props for {@link OptionSymbolBadge}.
 *
 * Either pass a full `contract` or the individual atoms (`root`, `expiry`,
 * `strike`, `type`).
 */
export interface OptionSymbolBadgeProps {
  /** Full contract quote; when supplied, atoms below are ignored. */
  contract?: OptionContract;
  /** Underlying root symbol, e.g. `"SPY"`. */
  root?: string;
  /** Expiration as epoch milliseconds. */
  expiry?: number;
  /** Strike price. */
  strike?: number;
  /** Call or put. */
  type?: OptionType;
  /**
   * Optional date format passed to `date-fns` `format`. Defaults to the short
   * repo format `M/d/yy`.
   */
  dateFormat?: string;
  /**
   * Render the strike + the date in a monospace font for tabular alignment in
   * chain tables.
   * @default true
   */
  monospace?: boolean;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

/**
 * Format an option's expiration as a short date (`M/d/yy`).
 */
function formatExpiry(expiry: number, pattern: string): string {
  return formatDate(new Date(expiry), pattern);
}

/**
 * OptionSymbolBadge — compact formatted token for an option contract.
 *
 * Renders `ROOT MM/DD/YY STRIKE{C|P}` using a colored `Badge` for the call/put
 * suffix (`success` → call, `destructive` → put) plus a monospace body for the
 * rest. Drop-in for table cells, ticket summaries, and blotter rows.
 *
 * @example
 * ```tsx
 * <OptionSymbolBadge contract={contract} />
 *
 * <OptionSymbolBadge root="SPY" expiry={Date.now()} strike={400} type="call" />
 * ```
 */
export function OptionSymbolBadge({
  contract,
  root,
  expiry,
  strike,
  type,
  dateFormat = "M/d/yy",
  monospace = true,
  className,
}: OptionSymbolBadgeProps) {
  const r = contract?.root ?? root;
  const e = contract?.expiry ?? expiry;
  const k = contract?.strike ?? strike;
  const t = contract?.type ?? type ?? "call";

  const rootStr = r ? r : "—";
  const dateStr = e ? formatExpiry(e, dateFormat) : "—";
  const strikeStr =
    typeof k === "number"
      ? k.toLocaleString("en-US", {
          minimumFractionDigits: Number.isInteger(k) ? 0 : 1,
          maximumFractionDigits: 2,
        })
      : "—";
  const typeLabel = t === "call" ? "Call" : "Put";

  // Screen-reader summary of the whole contract so the cluster is announced
  // as one unit (color is never the sole carrier of meaning — the C/P letter
  // and this label both convey type).
  const ariaLabel = `${rootStr} ${dateStr} ${strikeStr} ${typeLabel}`;

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        monospace && "font-mono tabular-nums",
        className
      )}
    >
      <span className="text-foreground">{rootStr}</span>
      <span className="text-muted-foreground">{dateStr}</span>
      <span className="text-foreground">{strikeStr}</span>
      <Badge
        variant={t === "call" ? "success" : "destructive"}
        size="medium"
        className="px-1"
        aria-hidden="true"
      >
        {t === "call" ? "C" : "P"}
      </Badge>
    </span>
  );
}

OptionSymbolBadge.displayName = "OptionSymbolBadge";