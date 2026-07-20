import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

import { cn } from "../../lib/utils";
import { pnlColorClass } from "../../lib/color-utils";

/* -------------------------------------------------------------------------------------------------
 * TrendIndicator
 * ------------------------------------------------------------------------------------------------*/

/**
 * CVA size variants for `TrendIndicator`.
 *
 * Keeps text + icon sizing in lockstep so the primitive composes cleanly inside
 * table cells, stat tiles, and tooltips.
 */
export const trendIndicatorVariants = cva(
  ["inline-flex items-center gap-1 font-medium tabular-nums leading-none"].join(
    " "
  ),
  {
    variants: {
      size: {
        xs: "text-[0.6875rem] [&>svg]:size-3",
        sm: "text-xs [&>svg]:size-3.5",
        md: "text-sm [&>svg]:size-4",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

/** Direction the indicator should render. `"auto"` derives from the sign of `value`. */
export type TrendDirection = "up" | "down" | "auto";

export interface TrendIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color" | "translate">,
    VariantProps<typeof trendIndicatorVariants> {
  /** Numeric value used to derive direction (and, unless overridden, the visible text). */
  value: number;
  /** Optional pre-formatted display string. When omitted, `value` is formatted via `Intl.NumberFormat`. */
  displayValue?: string;
  /** Direction override. `"auto"` derives from `Math.sign(value)`. @default "auto" */
  direction?: TrendDirection;
  /** When false, hides the arrow icon. @default true */
  showArrow?: boolean;
  /** When true, prefix `+` on positive values (only when `displayValue` is not supplied). @default false */
  signed?: boolean;
}

/**
 * Resolve the effective direction for a value.
 *
 * - `auto` → `"up"` for positive, `"down"` for negative, `"neutral"` for zero / NaN.
 * - explicit `"up"` / `"down"` is returned unchanged.
 */
function resolveDirection(
  value: number,
  direction: TrendDirection
): "up" | "down" | "neutral" {
  if (direction === "up") return "up";
  if (direction === "down") return "down";
  if (!Number.isFinite(value) || value === 0) return "neutral";
  return value > 0 ? "up" : "down";
}

/** Format a number using the default `Intl.NumberFormat` for the current environment. */
function defaultFormat(value: number, signed: boolean): string {
  if (!Number.isFinite(value)) return "NaN";
  const formatted = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
  const sign = value < 0 ? "-" : signed ? "+" : "";
  return `${sign}${formatted}`;
}

/**
 * `TrendIndicator` — a tiny signed-value text primitive.
 *
 * Renders a directional arrow icon next to a colorized numeric/text label.
 * Color is derived from the sign of `value` via `pnlColorClass`, so the
 * primitive stays in sync with the rest of the finance surfaces. Color is
 * never the only signal of direction: the arrow icon and (optionally) the
 * signed prefix carry the same information.
 *
 * @example
 * ```tsx
 * <TrendIndicator value={1.24} signed />
 * <TrendIndicator value={-0.42} displayValue="-0.42%" />
 * <TrendIndicator value={0} showArrow={false} />
 * <TrendIndicator value={Number.NaN} />
 * ```
 */
export const TrendIndicator = React.forwardRef<
  HTMLSpanElement,
  TrendIndicatorProps
>(
  (
    {
      value,
      displayValue,
      direction = "auto",
      size = "sm",
      showArrow = true,
      signed = false,
      className,
      ...rest
    },
    ref
  ) => {
    const resolved = resolveDirection(value, direction);

    const text =
      displayValue ??
      defaultFormat(value, signed && resolved === "up");

    // Color: reuse the semantic P&L palette so trends stay visually consistent
    // with `NumericText`. Zero / NaN falls back to muted foreground.
    const colorClass =
      resolved === "neutral" ? "text-muted-foreground" : pnlColorClass(value);

    const Icon =
      resolved === "up" ? ArrowUp : resolved === "down" ? ArrowDown : Minus;

    return (
      <span
        ref={ref}
        className={cn(trendIndicatorVariants({ size }), colorClass, className)}
        {...rest}
      >
        {showArrow ? <Icon aria-hidden="true" /> : null}
        <span>{text}</span>
      </span>
    );
  }
);

TrendIndicator.displayName = "TrendIndicator";