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
 * Props for {@link GreeksDisplay}.
 */
export interface GreeksDisplayProps {
  /** The Greeks to render. Any omitted field is hidden. */
  greeks: Greeks;
  /** Display density. `grid` = 2-col grid, `inline` = single row. @default "grid" */
  layout?: GreeksDisplayLayout;
  /** Force an explicit sign on delta/rho (handy for position Greeks). @default false */
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
  label: string;
  value: number | undefined;
  precision: number;
}

/**
 * Semantic names used for screen-reader-only labels. The visible label is a
 * Greek letter (e.g. "Δ"), which screen readers announce inconsistently, so
 * each cell also renders an `sr-only` "Delta" token before the letter. This
 * gives a stable accessible name like "Delta 0.42" regardless of SR behavior.
 */
const GREEK_NAMES: Record<keyof Greeks, string> = {
  delta: "Delta",
  gamma: "Gamma",
  theta: "Theta",
  vega: "Vega",
  rho: "Rho",
};

const GREEK_ORDER: { key: keyof Greeks; label: string; precision: number }[] = [
  { key: "delta", label: "Δ", precision: 3 },
  { key: "gamma", label: "Γ", precision: 4 },
  { key: "theta", label: "Θ", precision: 2 },
  { key: "vega", label: "ν", precision: 3 },
  { key: "rho", label: "ρ", precision: 3 },
];

/**
 * GreeksDisplay — compact readout of an option's Greeks.
 *
 * Renders Δ / Γ / Θ / ν / ρ in a 2-column grid (default) or a tight inline row
 * using `NumericText`. Each Greek is wrapped in a `Tooltip` with the standard
 * glossary unless `showTooltips={false}`. Omitted fields are dropped, so the
 * layout adapts to however many Greeks you actually have.
 *
 * @example
 * ```tsx
 * <GreeksDisplay greeks={{ delta: 0.42, theta: -3.2 }} colorize />
 * <GreeksDisplay greeks={pos.greeks} layout="inline" signed colorize />
 * ```
 */
export function GreeksDisplay({
  greeks,
  layout = "grid",
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

  return (
    <div
      className={cn(
        "text-xs",
        layout === "grid"
          ? "grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5"
          : "flex flex-wrap items-center gap-x-3 gap-y-0.5",
        className
      )}
    >
      {cells.map((c) => {
        const srLabel = <span className="sr-only">{GREEK_NAMES[c.key]} </span>;
        const labelNode = (
          <span className="font-mono text-muted-foreground">
            {srLabel}
            {c.label}
          </span>
        );
        const valueNode = (
          <NumericText
            value={c.value ?? 0}
            format="number"
            precision={c.precision}
            signed={signed}
            colorize={colorize}
            align="right"
            className="text-foreground"
          />
        );

        if (!showTooltips) {
          if (layout === "inline") {
            return (
              <span
                key={c.key}
                role="group"
                aria-label={GREEK_NAMES[c.key]}
                className="inline-flex items-baseline gap-x-1"
              >
                {labelNode}
                {valueNode}
              </span>
            );
          }
          return (
            <React.Fragment key={c.key}>
              {labelNode}
              {valueNode}
            </React.Fragment>
          );
        }

        const tooltipContent =
          glossary?.[c.key] ?? DEFAULT_GREEK_GLOSSARY[c.key];

        const tooltipLabel = (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help underline decoration-dotted underline-offset-2">
                {labelNode}
              </span>
            </TooltipTrigger>
            <TooltipContent size="sm">{tooltipContent}</TooltipContent>
          </Tooltip>
        );

        if (layout === "inline") {
          return (
            <span
              key={c.key}
              role="group"
              aria-label={GREEK_NAMES[c.key]}
              className="inline-flex items-baseline gap-x-1"
            >
              {tooltipLabel}
              {valueNode}
            </span>
          );
        }

        return (
          <React.Fragment key={c.key}>
            {tooltipLabel}
            {valueNode}
          </React.Fragment>
        );
      })}
    </div>
  );
}

GreeksDisplay.displayName = "GreeksDisplay";