"use client";

import * as React from "react";

import { cn } from "../../lib/utils";
import { NumericText } from "../typography";
import { Tooltip, TooltipTrigger, TooltipContent } from "../tooltip";
import type { Greeks } from "../../lib/finance-types";

/* -------------------------------------------------------------------------------------------------
 * GreeksDisplay
 * ------------------------------------------------------------------------------------------------*/

/** Default glossary text shown in tooltips when `glossary` is not provided. */
export const DEFAULT_GREEK_GLOSSARY: Record<keyof Greeks, string> = {
  delta: "Delta — sensitivity to a $1 change in the underlying.",
  gamma: "Gamma — rate of change of delta per $1 move in the underlying.",
  theta: "Theta — daily decay in option value (per contract).",
  vega: "Vega — change in option value per 1% change in implied volatility.",
  rho: "Rho — change in option value per 1% change in interest rates.",
};

/** Layout style. */
export type GreeksDisplayLayout = "grid" | "inline";

/**
 * What to render as the visible label for each Greek cell.
 *
 * - `symbol` — Greek letter only (Δ, Γ, Θ, ν, ρ). Compact, default.
 * - `text` — semantic name only (Delta, Gamma, …). Best when the symbol
 *   could be ambiguous to non-domain readers.
 * - `both` — symbol + name (e.g. "Δ Delta"). Maximizes clarity; the name
 *   renders in a smaller, muted weight next to the symbol.
 */
export type GreeksLabelStyle = "symbol" | "text" | "both";

/** Where the label sits relative to the value within a cell. */
export type GreeksLabelPosition = "leading" | "stacked";

/** Letter case applied to the `text` part of the label. */
export type GreeksLabelCase = "upper" | "lower" | "title";

/** Overall density / typography scale of the readout. */
export type GreeksDisplaySize = "sm" | "md" | "lg";

/**
 * Props for {@link GreeksDisplay}.
 */
export interface GreeksDisplayProps {
  /** The Greeks to render. Any omitted field is hidden. */
  greeks: Greeks;
  /** Display density. `grid` = 2-col grid (one row per Greek), `inline` = single wrapping row. @default "grid" */
  layout?: GreeksDisplayLayout;
  /** What to show as the per-cell label. @default "symbol" */
  labelStyle?: GreeksLabelStyle;
  /** Where the label sits relative to the value. `stacked` puts the label on its own line above the value (good for stat-tile style readouts). @default "leading" */
  labelPosition?: GreeksLabelPosition;
  /** Letter case applied to the `text` part of the label (no effect when `labelStyle="symbol"`). @default "title" */
  labelCase?: GreeksLabelCase;
  /** Mute the label color (`text-muted-foreground`) vs. foreground. Disable for high-contrast dashboards. @default true */
  labelMuted?: boolean;
  /** Overall size of the readout (scales label + value typography). @default "md" */
  size?: GreeksDisplaySize;
  /** Force an explicit sign on each value (handy for position Greeks). @default false */
  signed?: boolean;
  /** Apply positive/negative color based on each Greek's sign. @default false */
  colorize?: boolean;
  /** Show tooltips with the glossary on each Greek cell. @default true */
  showTooltips?: boolean;
  /** Override glossary strings. */
  glossary?: Partial<Record<keyof Greeks, React.ReactNode>>;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

interface GreekCell {
  key: keyof Greeks;
  symbol: string;
  value: number | undefined;
  precision: number;
}

/**
 * Semantic names used for screen-reader-only labels and for the `text` /
 * `both` label styles. The visible Greek symbol alone is announced
 * inconsistently by screen readers, so each cell always renders an `sr-only`
 * semantic-name token before the visible label, giving a stable accessible
 * name like "Delta 0.42" regardless of SR behavior or `labelStyle`.
 */
const GREEK_NAMES: Record<keyof Greeks, string> = {
  delta: "Delta",
  gamma: "Gamma",
  theta: "Theta",
  vega: "Vega",
  rho: "Rho",
};

const GREEK_ORDER: { key: keyof Greeks; symbol: string; precision: number }[] = [
  { key: "delta", symbol: "Δ", precision: 3 },
  { key: "gamma", symbol: "Γ", precision: 4 },
  { key: "theta", symbol: "Θ", precision: 2 },
  { key: "vega", symbol: "ν", precision: 3 },
  { key: "rho", symbol: "ρ", precision: 3 },
];

const SIZE_TOKENS: Record<
  GreeksDisplaySize,
  { label: string; textPart: string; value: string; gap: string }
> = {
  sm: {
    label: "text-[0.625rem]",
    textPart: "text-[0.5625rem]",
    value: "text-xs",
    gap: "gap-x-1",
  },
  md: {
    label: "text-[0.6875rem]",
    textPart: "text-[0.625rem]",
    value: "text-sm",
    gap: "gap-x-1.5",
  },
  lg: {
    label: "text-sm",
    textPart: "text-xs",
    value: "text-base",
    gap: "gap-x-2",
  },
};

function applyCase(s: string, c: GreeksLabelCase): string {
  switch (c) {
    case "upper":
      return s.toUpperCase();
    case "lower":
      return s.toLowerCase();
    case "title":
    default:
      return s;
  }
}

/**
 * Renders the visible label for a cell based on `labelStyle` / `labelCase`.
 * Always prefixed with an `sr-only` semantic name for stable SR output.
 */
function renderLabel(
  cell: GreekCell,
  labelStyle: GreeksLabelStyle,
  labelCase: GreeksLabelCase,
  size: GreeksDisplaySize,
  labelMuted: boolean
): React.ReactNode {
  const tokens = SIZE_TOKENS[size];
  const colorClass = labelMuted ? "text-muted-foreground" : "text-foreground";
  const sr = <span className="sr-only">{GREEK_NAMES[cell.key]} </span>;

  if (labelStyle === "text") {
    return (
      <span className={cn("font-medium", tokens.label, colorClass)}>
        {sr}
        {applyCase(GREEK_NAMES[cell.key], labelCase)}
      </span>
    );
  }

  if (labelStyle === "both") {
    return (
      <span
        className={cn(
          "inline-flex items-baseline gap-x-1 font-mono",
          tokens.label,
          colorClass
        )}
      >
        {sr}
        <span aria-hidden>{cell.symbol}</span>
        <span
          aria-hidden
          className={cn("font-sans font-normal", tokens.textPart, "opacity-70")}
        >
          {applyCase(GREEK_NAMES[cell.key], labelCase)}
        </span>
      </span>
    );
  }

  // symbol
  return (
    <span className={cn("font-mono font-medium", tokens.label, colorClass)}>
      {sr}
      {cell.symbol}
    </span>
  );
}

/**
 * GreeksDisplay — compact, highly customizable readout of an option's Greeks.
 *
 * Renders Δ / Γ / Θ / ν / ρ using `NumericText`, with several options for
 * label visibility and typography:
 * - `labelStyle` — `symbol` (default), `text`, or `both`.
 * - `labelPosition` — `leading` (label beside value) or `stacked` (label
 *   above value, stat-tile style).
 * - `labelCase` — letter case for the `text` part.
 * - `labelMuted` — toggle between `text-muted-foreground` and `text-foreground`.
 * - `size` — `sm` | `md` | `lg` typography scale.
 *
 * Each Greek is wrapped in a `Tooltip` with the standard glossary unless
 * `showTooltips={false}`. Omitted fields are dropped, so the layout adapts to
 * however many Greeks you actually have.
 *
 * @example
 * ```tsx
 * <GreeksDisplay greeks={{ delta: 0.42, theta: -3.2 }} colorize />
 * <GreeksDisplay greeks={pos.greeks} layout="inline" signed colorize />
 * <GreeksDisplay greeks={g} labelStyle="both" size="lg" labelPosition="stacked" />
 * ```
 */
export function GreeksDisplay({
  greeks,
  layout = "grid",
  labelStyle = "symbol",
  labelPosition = "leading",
  labelCase = "title",
  labelMuted = true,
  size = "md",
  signed = false,
  colorize = false,
  showTooltips = true,
  glossary,
  className,
}: GreeksDisplayProps) {
  const cells: GreekCell[] = GREEK_ORDER.filter(
    (g) => greeks[g.key] != null
  ).map((g) => ({ ...g, value: greeks[g.key] }));

  if (cells.length === 0) {
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>
        —
      </span>
    );
  }

  const tokens = SIZE_TOKENS[size];
  const stacked = labelPosition === "stacked";

  // Outer container class.
  // - leading grid → 2-col grid (auto label col + 1fr value col), one row per greek.
  // - stacked  grid → horizontal flow of equal-width stat-tile cells.
  // - inline (leading or stacked) → flex-wrap row of bound label+value pairs.
  const containerClass = cn(
    layout === "grid" && !stacked
      ? "grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 items-baseline"
      : layout === "grid" && stacked
        ? "grid grid-flow-col auto-cols-fr gap-2"
        : "flex flex-wrap items-baseline gap-x-3 gap-y-1",
    className
  );

  return (
    <div className={containerClass}>
      {cells.map((c) => {
        const labelNode = renderLabel(
          c,
          labelStyle,
          labelCase,
          size,
          labelMuted
        );
        const valueNode = (
          <NumericText
            value={c.value ?? 0}
            format="number"
            precision={c.precision}
            signed={signed}
            colorize={colorize}
            align="right"
            className={cn("font-medium", tokens.value, "text-foreground")}
          />
        );

        // Wrap label in tooltip if enabled.
        const labelOrTooltip = showTooltips ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  "cursor-help",
                  !labelMuted && "underline decoration-dotted underline-offset-2"
                )}
              >
                {labelNode}
              </span>
            </TooltipTrigger>
            <TooltipContent size="sm">
              {glossary?.[c.key] ?? DEFAULT_GREEK_GLOSSARY[c.key]}
            </TooltipContent>
          </Tooltip>
        ) : (
          labelNode
        );

        const accessibleName = GREEK_NAMES[c.key];

        // Stacked: each cell is a flex-col mini tile with label above value.
        if (stacked) {
          return (
            <div
              key={c.key}
              role="group"
              aria-label={accessibleName}
              className="flex min-w-0 flex-col items-start gap-0.5"
            >
              {labelOrTooltip}
              {valueNode}
            </div>
          );
        }

        // Leading + inline: bound label+value pair in an inline-flex span.
        if (layout === "inline") {
          return (
            <span
              key={c.key}
              role="group"
              aria-label={accessibleName}
              className={cn("inline-flex items-baseline", tokens.gap)}
            >
              {labelOrTooltip}
              {valueNode}
            </span>
          );
        }

        // Leading + grid: label and value as direct grid children to keep the
        // `auto_1fr` column template. Tooltips wrap the label only.
        return (
          <React.Fragment key={c.key}>
            {labelOrTooltip}
            {valueNode}
          </React.Fragment>
        );
      })}
    </div>
  );
}

GreeksDisplay.displayName = "GreeksDisplay";