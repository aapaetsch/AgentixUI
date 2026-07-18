import * as React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "../../lib/utils";
import { Card, CardHeader, CardContent } from "../../components/card";
import { Badge } from "../../components/badge";
import { Typography } from "../../components/typography";
import { NumericText } from "../../components/typography";
import { AnimatedNumber } from "../../components/animated-number";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatCompact,
  type NumericFormat,
} from "../../lib/number-utils";

export interface StatTileProps {
  /** Label shown as the stat title (e.g. "Portfolio Value"). */
  label: string;
  /** The numeric value to render. */
  value: number;
  /** Format applied to the value. @default "currency" */
  format?: NumericFormat;
  /** Delta vs the previous period. When omitted, the delta row is hidden. */
  delta?: number;
  /** How to render the delta. @default "absolute" */
  deltaFormat?: "absolute" | "percent";
  /** Colorize the delta row based on sign. @default true */
  deltaColorize?: boolean;
  /** Period badge label (e.g. "1D"). @default "1D" */
  period?: string;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Optional sparkline (chart-lib renders into this slot). */
  sparkline?: React.ReactNode;
  /** Loading state: renders Skeletons for value and delta. */
  loading?: boolean;
  /** Click handler. When provided, the Card becomes interactive. */
  onClick?: () => void;
  className?: string;
  currency?: string;
  precision?: number;
}

/**
 * StatTile - KPI tile for the investment-ops dashboard.
 *
 * Composes `Card`, `Badge`, `NumericText`, `AnimatedNumber`, and an optional
 * sparkline render slot. The delta row uses `lucide` ArrowUp/ArrowDown colored
 * by sign, paired with a signed `NumericText` so sign is never color-only.
 *
 * @example
 * ```tsx
 * <StatTile label="Portfolio Value" value={1234.56} delta={12.34} period="1D" />
 * ```
 */
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
  onClick,
  className,
  currency = "USD",
  precision,
}: StatTileProps) {
  const formatValue = React.useCallback(
    (v: number) => formatByFormat(v, format, currency, precision),
    [format, currency, precision]
  );

  const deltaIsPositive = typeof delta === "number" && delta > 0;
  const deltaIsNegative = typeof delta === "number" && delta < 0;
  const arrowIcon = deltaIsPositive ? (
    <ArrowUp className="size-3.5 text-positive" aria-hidden />
  ) : deltaIsNegative ? (
    <ArrowDown className="size-3.5 text-negative" aria-hidden />
  ) : null;

  return (
    <Card
      variant="elevated"
      interactive={typeof onClick === "function"}
      className={cn("overflow-hidden", className)}
      onClick={onClick}
      tabIndex={typeof onClick === "function" ? 0 : undefined}
      onKeyDown={
        typeof onClick === "function"
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <CardHeader className="flex items-center justify-between gap-2 px-4 pt-4 pb-1">
        <Typography as="div" variant="overline" className="flex items-center gap-1.5">
          {icon ? <Slot>{icon}</Slot> : null}
          {label}
        </Typography>
        {period ? <Badge variant="secondary">{period}</Badge> : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-1 px-4 pb-4 pt-1">
        <div className="text-2xl font-semibold tabular-nums">
          {loading ? (
            <span className="inline-block h-7 w-28 animate-pulse rounded bg-muted" />
          ) : (
            <AnimatedNumber value={value} format={formatValue} duration={400} />
          )}
        </div>

        {!loading && typeof delta === "number" ? (
          <div className="flex items-center gap-1.5 text-sm">
            {arrowIcon}
            <NumericText
              value={delta}
              format={deltaFormat === "percent" ? "percent" : "currency"}
              currency={currency}
              precision={precision}
              signed
              colorize={deltaColorize}
              align="left"
            />
          </div>
        ) : null}
      </CardContent>

      {sparkline ? (
        <div className="px-4 pb-4">{sparkline}</div>
      ) : null}
    </Card>
  );
}
StatTile.displayName = "StatTile";

function formatByFormat(
  v: number,
  format: NumericFormat,
  currency: string,
  precision?: number
): string {
  switch (format) {
    case "currency":
      return formatCurrency(v, { currency, precision, signed: false });
    case "percent":
      return formatPercent(v, { precision });
    case "number":
      return formatNumber(v, { precision });
    case "compact":
      return formatCompact(v, { currency });
    case "basisPoints":
      // AnimatedNumber expects a plain format fn; map bps directly.
      return `${formatNumber(v, { precision })} bps`;
    default:
      return formatCurrency(v, { currency, precision });
  }
}