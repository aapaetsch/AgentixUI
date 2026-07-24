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
  /** Decimal precision passed to `NumericText`. @default 2 */
  precision?: number;
  /** Label prefix shown before the list. @default "BE" */
  label?: React.ReactNode;
  /** Variant for the badges. @default "outline" */
  variant?: React.ComponentProps<typeof Badge>["variant"];
  /** Badge size for values and the overflow indicator. @default "medium" */
  size?: React.ComponentProps<typeof Badge>["size"];
  /** Variant used by the overflow indicator. @default "secondary" */
  overflowVariant?: React.ComponentProps<typeof Badge>["variant"];
  /** Content rendered when `values` is empty. Pass `null` to render nothing. */
  emptyContent?: React.ReactNode;
  /** Accessible name for the badge list. @default "Breakeven prices" */
  ariaLabel?: string;
  /** Override value rendering while retaining the badge/list semantics. */
  renderValue?: (value: number, index: number) => React.ReactNode;
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
  precision = 2,
  label = "BE",
  variant = "outline",
  size = "medium",
  overflowVariant = "secondary",
  emptyContent = "No breakevens",
  ariaLabel = "Breakeven prices",
  renderValue,
  className,
}: BreakevenBadgesProps) {
  if (values.length === 0) {
    if (emptyContent == null) return null;
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>
        {emptyContent}
      </span>
    );
  }

  const visible = values.slice(0, max);
  const overflow = values.length - visible.length;

  return (
    <span
      className={cn("inline-flex flex-wrap items-center gap-1", className)}
      role="list"
      aria-label={ariaLabel}
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
          size={size}
          role="listitem"
        >
          {renderValue ? renderValue(v, i) : (
            <NumericText
              value={v}
              format={format}
              currency={currency}
              precision={precision}
              align="left"
            />
          )}
        </Badge>
      ))}
      {overflow > 0 && (
        <Badge
          variant={overflowVariant}
          size={size}
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
