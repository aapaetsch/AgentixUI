"use client";

import * as React from "react";

import { cn } from "../../lib/utils";
import { Badge, type BadgeProps } from "../badge";
import { formatDate } from "../../lib/date-utils";

/* -------------------------------------------------------------------------------------------------
 * ExpiryBadge
 * ------------------------------------------------------------------------------------------------*/

/** DTE band → Badge variant. */
export type ExpiryBadgeBand = "far" | "near" | "imminent" | "expiring";

/** Default DTE thresholds (in calendar days) → bands. */
export const DEFAULT_EXPIRY_THRESHOLDS = [30, 7, 1] as const;

function bandForDte(dte: number, thresholds: readonly number[]): ExpiryBadgeBand {
  const [far, near, imminent] = thresholds;
  if (dte > far) return "far";
  if (dte > near) return "near";
  if (dte > imminent) return "imminent";
  return "expiring";
}

const BAND_VARIANT: Record<
  ExpiryBadgeBand,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  far: "outline",
  near: "warning",
  imminent: "destructive",
  expiring: "destructive",
};

/**
 * Props for {@link ExpiryBadge}.
 */
export interface ExpiryBadgeProps {
  /** Expiration as epoch milliseconds. */
  expiry: number;
  /** Days to expiry. When omitted, derived from `expiry` vs `now`. */
  daysToExpiry?: number;
  /**
   * DTE band thresholds in days `[far, near, imminent]`, descending. The
   * bands are `(far, ∞] → far`, `(near, far] → near`, `(imminent, near] →
   * imminent`, `[0, imminent] → expiring`.
   * @default [30, 7, 1]
   */
  thresholds?: readonly number[];
  /** Override the auto-computed band. */
  band?: ExpiryBadgeBand;
  /** Render the formatted date alongside / instead of the days pill. @default false */
  showDate?: boolean;
  /** Render a trailing `Dd` pill (or `Dh` when < 1 day). @default true */
  showDays?: boolean;
  /** Date format passed to `date-fns` `format`. @default "M/d/yy" */
  dateFormat?: string;
  /** Add a pulse animation when in the `expiring` band. @default true */
  pulseOnExpiring?: boolean;
  /**
   * Badge size forwarded to the underlying `Badge`. The `small` dot size is
   * excluded since the badge must render visible text.
   * @default "medium"
   */
  size?: "medium" | "large";
  /** Per-band badge variant overrides. */
  variants?: Partial<Record<ExpiryBadgeBand, BadgeProps["variant"]>>;
  /** Override the compact DTE label (`7d`, `12h`, etc.). */
  formatDays?: (daysToExpiry: number, band: ExpiryBadgeBand) => React.ReactNode;
  /** Override the generated accessible label. */
  ariaLabel?: string;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

/**
 * ExpiryBadge — color-graded expiration pill.
 *
 * Auto-colors from green/outline (far) → amber (near) → red (imminent) → red +
 * pulse (expiring) so an open-positions table can show time-decay risk at a
 * glance. Composes the existing `Badge` variants — no new primitive variants.
 *
 * @example
 * ```tsx
 * <ExpiryBadge expiry={Date.now() + 5 * 86400_000} />
 * <ExpiryBadge expiry={exp} daysToExpiry={0.4} thresholds={[60, 14, 2]} />
 * ```
 */
export function ExpiryBadge({
  expiry,
  daysToExpiry,
  thresholds = DEFAULT_EXPIRY_THRESHOLDS,
  band,
  showDate = false,
  showDays = true,
  dateFormat = "M/d/yy",
  pulseOnExpiring = true,
  size = "medium",
  variants,
  formatDays,
  ariaLabel: ariaLabelProp,
  className,
}: ExpiryBadgeProps) {
  const dte =
    daysToExpiry ??
    Math.max(0, (expiry - Date.now()) / 86_400_000);
  const resolvedBand = band ?? bandForDte(dte, thresholds);
  const variant = variants?.[resolvedBand] ?? BAND_VARIANT[resolvedBand];
  const dateStr = formatDate(new Date(expiry), dateFormat);

  const defaultDaysLabel =
    dte >= 1
      ? `${Math.floor(dte)}d`
      : dte > 0
        ? `${Math.round(dte * 24)}h`
        : "0d";
  const daysLabel = formatDays?.(dte, resolvedBand) ?? defaultDaysLabel;

  // Accessible label: only announce what is actually visible.
  const ariaLabel = ariaLabelProp ?? (showDate && showDays
    ? `Expires ${dateStr} in ${defaultDaysLabel}`
    : showDays || !showDate
      ? `Expires in ${defaultDaysLabel}`
      : `Expires ${dateStr}`);

  return (
    <Badge
      variant={variant}
      size={size}
      className={cn(
        resolvedBand === "expiring" && pulseOnExpiring && "animate-pulse",
        className
      )}
      aria-label={ariaLabel}
    >
      {showDate && showDays ? (
        <>
          <span>{dateStr}</span>
          <span className="ml-1 text-current/80">{daysLabel}</span>
        </>
      ) : showDate ? (
        dateStr
      ) : (
        daysLabel
      )}
    </Badge>
  );
}

ExpiryBadge.displayName = "ExpiryBadge";
