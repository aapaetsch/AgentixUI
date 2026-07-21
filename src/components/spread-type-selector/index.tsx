"use client";

import * as React from "react";

import { cn } from "../../lib/utils";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";

/* -------------------------------------------------------------------------------------------------
 * SpreadTypeSelector
 * ------------------------------------------------------------------------------------------------*/

/** Built-in spread templates. */
export type SpreadType =
  | "single"
  | "vertical"
  | "calendar"
  | "straddle"
  | "strangle"
  | "iron-condor"
  | "butterfly";

/** The full ordered list used when `options` is not supplied. */
export const DEFAULT_SPREAD_OPTIONS: SpreadType[] = [
  "single",
  "vertical",
  "calendar",
  "straddle",
  "strangle",
  "iron-condor",
  "butterfly",
];

const SPREAD_LABELS: Record<SpreadType, string> = {
  single: "Single",
  vertical: "Vertical",
  calendar: "Calendar",
  straddle: "Straddle",
  strangle: "Strangle",
  "iron-condor": "Iron Condor",
  butterfly: "Butterfly",
};

/**
 * Props for {@link SpreadTypeSelector}.
 */
export interface SpreadTypeSelectorProps {
  /** Controlled selected spread type. */
  value: SpreadType;
  /** Called when the user picks a different spread. */
  onChange: (value: SpreadType) => void;
  /** Restrict the available spread templates. @default all built-ins. */
  options?: readonly SpreadType[];
  /** Disable the selector. */
  disabled?: boolean;
  /** Override any built-in option label. */
  labels?: Partial<Record<SpreadType, React.ReactNode>>;
  /** Custom option renderer. */
  renderOption?: (option: SpreadType, label: React.ReactNode) => React.ReactNode;
  /** Toggle-group size. @default "sm" */
  size?: React.ComponentProps<typeof ToggleGroup>["size"];
  /** Accessible selector name. @default "Spread type" */
  ariaLabel?: string;
  /** Content rendered when `options` is empty. */
  emptyContent?: React.ReactNode;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

/**
 * SpreadTypeSelector — pick a multi-leg spread template.
 *
 * Wraps the existing `ToggleGroup` (or renders as a chip row) so a
 * `MultiLegOrderTicket` parent can pre-fill legs from a strategy template. No
 * leg logic here — purely emits the chosen template.
 *
 * @example
 * ```tsx
 * <SpreadTypeSelector value="vertical" onChange={setSpread} />
 * ```
 */
export function SpreadTypeSelector({
  value,
  onChange,
  options = DEFAULT_SPREAD_OPTIONS,
  disabled,
  labels,
  renderOption,
  size = "sm",
  ariaLabel = "Spread type",
  emptyContent = "No spreads",
  className,
}: SpreadTypeSelectorProps) {
  if (options.length === 0) {
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>
        {emptyContent}
      </span>
    );
  }

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as SpreadType)}
      disabled={disabled}
      size={size}
      className={cn("flex-wrap", className)}
      aria-label={ariaLabel}
    >
      {options.map((opt) => (
        <ToggleGroupItem key={opt} value={opt} size={size}>
          {renderOption?.(opt, labels?.[opt] ?? SPREAD_LABELS[opt]) ?? labels?.[opt] ?? SPREAD_LABELS[opt]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

SpreadTypeSelector.displayName = "SpreadTypeSelector";
