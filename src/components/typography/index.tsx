import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatCompact,
  formatBasisPoints,
  type NumericFormat,
} from "../../lib/number-utils";
import { pnlColorClass } from "../../lib/color-utils";

/* -------------------------------------------------------------------------------------------------
 * Typography
 * ------------------------------------------------------------------------------------------------*/

/**
 * Typography variants using CVA.
 *
 * Maps the `variant` prop to the MD3 type scale using Tailwind utilities.
 */
export const typographyVariants = cva(
  ["transition-colors"].join(" "),
  {
    variants: {
      variant: {
        h1: "text-3xl font-semibold tracking-tight",
        h2: "text-2xl font-semibold tracking-tight",
        h3: "text-xl font-medium",
        h4: "text-lg font-medium",
        h5: "text-base font-medium",
        h6: "text-sm font-medium",
        subtitle: "text-sm font-normal text-muted-foreground",
        body: "text-sm font-normal text-foreground",
        caption: "text-xs font-normal text-muted-foreground",
        overline:
          "text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      truncate: {
        true: "truncate",
        false: "",
      },
    },
    defaultVariants: {
      variant: "body",
      align: "left",
      truncate: false,
    },
  }
);

export type TypographyProps<T extends React.ElementType = "p"> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    variant?: VariantProps<typeof typographyVariants>["variant"];
    align?: VariantProps<typeof typographyVariants>["align"];
    truncate?: boolean;
    className?: string;
    children?: React.ReactNode;
  };

/**
 * Typography - Polymorphic text primitive for the standardized type scale.
 *
 * Defaults to a `<p>` element; pass `as` to render as `h1`–`h6`, `span`, `div`,
 * etc. The `variant` controls the visual type scale independently of the
 * rendered tag for semantic flexibility.
 *
 * @example
 * ```tsx
 * <Typography variant="h2">Portfolio</Typography>
 * <Typography as="span" variant="caption">Updated 2m ago</Typography>
 * <Typography variant="overline" align="right">PORTFOLIO VALUE</Typography>
 * ```
 */
export function Typography<T extends React.ElementType = "p">({
  as,
  variant,
  align,
  truncate,
  className,
  children,
  ...props
}: TypographyProps<T>) {
  const Comp = (as ?? "p") as React.ElementType;
  return (
    <Comp
      className={cn(typographyVariants({ variant, align, truncate }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
Typography.displayName = "Typography";

/* -------------------------------------------------------------------------------------------------
 * NumericText
 * ------------------------------------------------------------------------------------------------*/

/**
 * NumericText variants using CVA.
 *
 * The `sign` variant is only applied when `colorize` is on and derives from
 * the numeric value's sign.
 */
export const numericTextVariants = cva(
  [
    "tabular-nums", // tabular numerics on by default per plan
    "whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      align: {
        left: "text-left",
        right: "text-right",
      },
      monospace: {
        true: "font-mono",
        false: "",
      },
    },
    defaultVariants: {
      align: "right",
      monospace: false,
    },
  }
);

/** Options accepted by `NumericText`. */
export interface NumericTextOptions {
  /** Display format. @default "number" */
  format?: NumericFormat;
  /** ISO currency code used by `currency` and `compact` formats. @default "USD" */
  currency?: string;
  /** Force an explicit sign (`+`) on positives. */
  signed?: boolean;
  /** Number of decimal places. */
  precision?: number;
  /** Apply semantic positive/negative coloring based on the value's sign. */
  colorize?: boolean;
  /** Horizontal alignment. @default "right" */
  align?: "left" | "right";
  /** When true, render tabular numerics. @default true */
  tabular?: boolean;
  /** When true, render in monospace via `font-mono`. @default false */
  monospace?: boolean;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

export interface NumericTextProps
  extends Omit<NumericTextOptions, "align" | "colorize" | "monospace" | "tabular">,
    VariantProps<typeof numericTextVariants> {
  /** The numeric value to render. */
  value: number;
  /** Apply semantic positive/negative coloring based on the value's sign. */
  colorize?: boolean;
  /** Accessible label override; defaults to the formatted string. */
  ariaLabel?: string;
}

/**
 * Format the value according to the NumericText options.
 */
function formatValue(
  value: number,
  opts: {
    format?: NumericFormat;
    currency?: string;
    signed?: boolean;
    precision?: number;
  }
): string {
  switch (opts.format ?? "number") {
    case "currency":
      return formatCurrency(value, {
        currency: opts.currency ?? "USD",
        precision: opts.precision,
        signed: opts.signed,
      });
    case "percent":
      return formatPercent(value, {
        precision: opts.precision,
        signed: opts.signed,
      });
    case "number":
      return formatNumber(value, {
        precision: opts.precision,
        signed: opts.signed,
      });
    case "compact":
      return formatCompact(value, { currency: opts.currency ?? "USD" });
    case "basisPoints":
      return formatBasisPoints(value, { precision: opts.precision });
    default:
      return formatNumber(value, { precision: opts.precision });
  }
}

/**
 * NumericText - Finance-grade numeric renderer.
 *
 * Standardizes right-aligned, tabular-figure rendering across the dashboard.
 * When `colorize` is on, positive values use `text-positive`, negative
 * `text-negative`, and zero `text-foreground`. Color is never the only signal
 * of sign: the accessible label and, when `signed`, the visible `+` prefix
 * carry the sign information too.
 *
 * @example
 * ```tsx
 * <NumericText value={1234.56} format="currency" />
 * <NumericText value={1.84} format="percent" signed colorize />
 * <NumericText value={-0.42} format="percent" signed colorize />
 * ```
 */
export const NumericText = React.forwardRef<
  HTMLSpanElement,
  NumericTextProps
>(
  (
    {
      value,
      format = "number",
      currency = "USD",
      signed = false,
      precision,
      colorize = false,
      align = "right",
      monospace = false,
      ariaLabel,
      className,
      ...rest
    },
    ref
  ) => {
    const formatted = formatValue(value, { format, currency, signed, precision });
    const colorClass = colorize ? pnlColorClass(value) : undefined;
    const resolvedAriaLabel =
      ariaLabel ??
      (colorize
        ? `${value > 0 ? "positive " : value < 0 ? "negative " : ""}${formatted}`
        : formatted);

    return (
      <span
        ref={ref}
        role="presentation"
        aria-label={resolvedAriaLabel}
        className={cn(
          numericTextVariants({ align, monospace }),
          colorClass,
          className
        )}
        {...rest}
      >
        {formatted}
      </span>
    );
  }
);

NumericText.displayName = "NumericText";