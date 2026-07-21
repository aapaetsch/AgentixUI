"use client";

import * as React from "react";

import { cn } from "../../lib/utils";
import { Badge } from "../badge";
import { NumericText } from "../typography";

/* -------------------------------------------------------------------------------------------------
 * BreakevenBadges
 * ------------------------------------------------------------------------------------------------*/

/**
 * Props for {@link BreakevenBadges}.
 */
export interface BreakevenBadgesProps {
  /** Breakeven underlying prices. */
  values: number[];
  /** Display format passed to `NumericText`. @default "currency" */
  format?: "currency" | "number";
  /** Currency code when `format="currency"`. @default "USD" */
  currency?: string;
  /** Maximum number of badges to render; rest are summarized as `+N`. */
  max?: number;
  /** Label prefix shown before the list. @default "BE" */
  label?: React.ReactNode;
  /** Variant for the badges. @default "outline" */
  variant?: React.ComponentProps<typeof Badge>["variant"];
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

/**
 * BreakevenBadges — pill row of breakeven prices.
 *
 * Renders one `Badge variant="outline"` per breakeven price, formatted with
 * `NumericText`. Intended as a small companion to `PayoffDiagram` and the
 * option-position cards. When `values.length > max`, the overflow is shown as
 * a `+N` badge.
 *
 * @example
 * ```tsx
 * <BreakevenBadges values={[412.50, 387.50]} />
 * <BreakevenBadges values={breakevens} format="number" max={4} />
 * ```
 */
export function BreakevenBadges({
  values,
  format = "currency",
  currency = "USD",
  max = 6,
  label = "BE",
  variant = "outline",
  className,
}: BreakevenBadgesProps) {
  if (values.length === 0) {
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>
        No breakevens
      </span>
    );
  }

  const visible = values.slice(0, max);
  const overflow = values.length - visible.length;

  return (
    <span
      className={cn("inline-flex flex-wrap items-center gap-1", className)}
      role="list"
      aria-label="Breakeven prices"
    >
      {label != null && (
        <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
      {visible.map((v, i) => (
        <Badge
          key={`${i}-${v}`}
          variant={variant}
          size="medium"
          role="listitem"
        >
          <NumericText
            value={v}
            format={format}
            currency={currency}
            precision={2}
            align="left"
          />
        </Badge>
      ))}
      {overflow > 0 && (
        <Badge
          variant="secondary"
          size="medium"
          role="listitem"
          aria-label={`${overflow} more breakevens not shown`}
        >
          +{overflow}
        </Badge>
      )}
    </span>
  );
}

BreakevenBadges.displayName = "BreakevenBadges";