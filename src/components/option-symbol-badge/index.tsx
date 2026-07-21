"use client";

import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { Badge, badgeVariants } from "../badge";
import { formatDate, DATE_FORMATS } from "../../lib/date-utils";
import type { OptionContract, OptionType } from "../../lib/finance-types";

/* -------------------------------------------------------------------------------------------------
 * OptionSymbolBadge
 *------------------------------------------------------------------------------------------------*/

/** How to render the call/put type badge. */
export type OptionTypeFormat = "short" | "long";

/** Order-action annotation shown next to the type badge. */
export type OptionAction = "BTO" | "BTC" | "STO" | "STC";

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
  /**
   * How to render the call/put type suffix.
   * - `"short"` → `C` / `P`
   * - `"long"` → `Call` / `Put`
   * @default "short"
   */
  typeFormat?: OptionTypeFormat;
  /**
   * Optional order-action indicator rendered as a small badge before the root
   * symbol:
   * - `BTO` — Buy to Open
   * - `BTC` — Buy to Close
   * - `STO` — Sell to Open
   * - `STC` — Sell to Close
   */
  action?: OptionAction;
  /**
   * Hide the call/put type badge entirely. Useful when the surrounding context
   * already conveys direction (e.g. a single-side chain view).
   * @default false
   */
  hideTypeBadge?: boolean;
  /**
   * Optional currency symbol rendered immediately before the strike (e.g. `"$"`).
   */
  currencySymbol?: string;
  /**
   * Optional currency string indicator appended after the strike (e.g. `"USD"`,
   * `"USDC"`). Useful in multi-currency blotters.
   */
  currencyString?: string;
  /**
   * Optional per-share premium / fill price rendered after the strike as
   * `@ currencySymbol value`. Useful when the badge summarizes a single
   * filled or scheduled leg.
   */
  premium?: number;
  /**
   * Override the badge variant used for the `action` badge. Defaults to a
   * sensible mapping: openers (`BTO`/`STO`) use `secondary`, closers
   * (`BTC`/`STC`) use `outline`.
   */
  actionVariant?: VariantProps<typeof badgeVariants>["variant"];
  /**
   * Show the `action` badge before (`"before"`) or after (`"after"`) the
   * contract body. @default "before"
   */
  actionPosition?: "before" | "after";
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

/**
 * Format an option's expiration as a short date (`M/d/yy`).
 */
function formatExpiry(expiry: number, pattern: string): string {
  return formatDate(new Date(expiry), pattern);
}

function formatPremium(premium: number, currencySymbol?: string): string {
  const value = premium.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currencySymbol ? `${currencySymbol}${value}` : value;
}

const ACTION_LABELS: Record<OptionAction, string> = {
  BTO: "BTO",
  BTC: "BTC",
  STO: "STO",
  STC: "STC",
};

const ACTION_DEFAULT_VARIANT: Record<
  OptionAction,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  BTO: "secondary",
  STO: "secondary",
  BTC: "outline",
  STC: "outline",
};

/**
 * OptionSymbolBadge — compact formatted token for an option contract.
 *
 * Renders `ROOT MM/DD/YY STRIKE{C|P}` using a colored `Badge` for the call/put
 * suffix (`success` → call, `destructive` → put) plus a monospace body for the
 * rest. Drop-in for table cells, ticket summaries, and blotter rows.
 *
 * Optionally annotates the token with an order-action badge (`BTO`/`BTC`/`STO`/`STC`),
 * a currency symbol prefix on the strike, a currency-code suffix, and a
 * per-share premium.
 *
 * @example
 * ```tsx
 * <OptionSymbolBadge contract={contract} />
 *
 * <OptionSymbolBadge root="SPY" expiry={Date.now()} strike={400} type="call" />
 *
 * <OptionSymbolBadge
 *   root="SPY"
 *   expiry={Date.now()}
 *   strike={400}
 *   type="call"
 *   action="BTO"
 *   typeFormat="long"
 *   currencySymbol="$"
 *   currencyString="USD"
 *   premium={3.25}
 * />
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
  typeFormat = "short",
  action,
  hideTypeBadge = false,
  currencySymbol,
  currencyString,
  premium,
  actionVariant,
  actionPosition = "before",
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
  const typeBadgeLabel =
    typeFormat === "long" ? typeLabel : t === "call" ? "C" : "P";

  const hasPremium = typeof premium === "number";

  const actionBadge = action ? (
    <Badge
      variant={actionVariant ?? ACTION_DEFAULT_VARIANT[action]}
      size="medium"
      className="px-1"
      aria-hidden="true"
    >
      {ACTION_LABELS[action]}
    </Badge>
  ) : null;

  // Screen-reader summary of the whole contract so the cluster is announced
  // as one unit (color is never the sole carrier of meaning — the C/P letter
  // and this label both convey type).
  const ariaParts = [
    action ? ACTION_LABELS[action] : "",
    rootStr,
    dateStr,
    currencySymbol ? `${currencySymbol}${strikeStr}` : strikeStr,
    currencyString ?? "",
    typeLabel,
    hasPremium ? `at ${formatPremium(premium!, currencySymbol)} premium` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      role="img"
      aria-label={ariaParts}
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        monospace && "font-mono tabular-nums",
        className
      )}
    >
      {actionPosition === "before" ? actionBadge : null}
      <span className="text-foreground">{rootStr}</span>
      <span className="text-muted-foreground">{dateStr}</span>
      <span className="text-foreground">
        {currencySymbol ? (
          <span aria-hidden="true">{currencySymbol}</span>
        ) : null}
        {strikeStr}
        {currencyString ? (
          <span className="text-muted-foreground" aria-hidden="true">
            {"\u00A0"}
            {currencyString}
          </span>
        ) : null}
      </span>
      {hasPremium && (
        <span className="text-muted-foreground">
          <span aria-hidden="true">@</span>
          {formatPremium(premium!, currencySymbol)}
        </span>
      )}
      {!hideTypeBadge && (
        <Badge
          variant={t === "call" ? "success" : "destructive"}
          size="medium"
          className="px-1"
          aria-hidden="true"
        >
          {typeBadgeLabel}
        </Badge>
      )}
      {actionPosition === "after" ? actionBadge : null}
    </span>
  );
}

OptionSymbolBadge.displayName = "OptionSymbolBadge";