import * as React from "react";

import { cn } from "../../lib/utils";
import {
  Typography,
  NumericText,
} from "../../components/typography";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatCompact,
  type NumericFormat,
} from "../../lib/number-utils";

import type { StatTileAlign, StatTileProps } from "./stat-tile";
import type { AccountSummaryProps } from "./account-summary";

export type { StatTileAlign, StatTileProps, AccountSummaryProps };

export function StatTile({
  label,
  value,
  format = "currency",
  delta,
  deltaFormat = "absolute",
  deltaColorize = true,
  period = "1D",
  icon,
  sparkline,
  loading = false,
  align = "left",
  onClick,
  className,
  currency = "USD",
  precision,
}: StatTileProps) {
  const alignClass =
    align === "center"
      ? "items-center text-center"
      : align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  const formattedValue = formatByFormat(value, format, currency, precision);
  const deltaClass =
    deltaColorize && typeof delta === "number"
      ? delta > 0
        ? "text-positive"
        : delta < 0
        ? "text-negative"
        : "text-muted-foreground"
      : "text-muted-foreground";

  const deltaPrefix = typeof delta === "number" && delta > 0 ? "+" : "";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card px-4 py-4 shadow-[var(--elevation-1)]",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className={cn("flex items-center justify-between gap-2", alignClass)}>
        <Typography as="div" variant="overline" className="flex items-center gap-1.5">
          {icon}
          {label}
        </Typography>
        {period ? (
          <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-wider text-secondary-foreground">
            {period}
          </span>
        ) : null}
      </div>

      <div className={cn("flex flex-col gap-1", alignClass)}>
        {loading ? (
          <span className="inline-block h-7 w-28 rounded bg-muted" />
        ) : (
          <Typography as="div" variant="h3" className="tabular-nums text-foreground">
            {formattedValue}
          </Typography>
        )}

        {!loading && typeof delta === "number" ? (
          <div className={cn("flex items-center gap-1.5 text-sm", deltaClass)}>
            <span aria-hidden>{delta > 0 ? "up" : delta < 0 ? "down" : "flat"}</span>
            <NumericText
              value={delta}
              format={deltaFormat === "percent" ? "percent" : "currency"}
              currency={currency}
              precision={precision}
              signed
              colorize={deltaColorize}
              align={align === "left" ? "left" : "right"}
              ariaLabel={`${deltaPrefix}${delta}`}
            />
          </div>
        ) : null}
      </div>

      {sparkline ? <div className={cn("flex", alignClass)}>{sparkline}</div> : null}
    </div>
  );
}
StatTile.displayName = "StatTile";

export function AccountSummary({
  tiles,
  warning,
  loading = false,
  className,
}: AccountSummaryProps) {
  const columns = tiles.length >= 6 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", columns)}>
        {tiles.map((tile, index) => (
          <StatTile key={tile.label ?? index} {...tile} loading={loading} />
        ))}
      </div>

      {warning ? (
        <div className="rounded-[var(--radius)] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {warning}
        </div>
      ) : null}
    </div>
  );
}
AccountSummary.displayName = "AccountSummary";

function formatByFormat(
  value: number,
  format: NumericFormat,
  currency: string,
  precision?: number
): string {
  switch (format) {
    case "currency":
      return formatCurrency(value, { currency, precision, signed: false });
    case "percent":
      return formatPercent(value, { precision });
    case "number":
      return formatNumber(value, { precision });
    case "compact":
      return formatCompact(value, { currency });
    case "basisPoints":
      return `${formatNumber(value, { precision })} bps`;
    default:
      return formatCurrency(value, { currency, precision });
  }
}