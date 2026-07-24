"use client";

import * as React from "react";
import { Trash2, CopyPlus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";
import { ComboBox, type ComboBoxOption } from "../combobox";
import { InputIncrementor } from "../input-incrementor";
import { Button } from "../button";
import type { OptionLeg, OptionType } from "../../lib/finance-types";

/* -------------------------------------------------------------------------------------------------
 * LegBuilderRow
 * ------------------------------------------------------------------------------------------------*/

export interface LegBuilderRowProps
  extends VariantProps<typeof legBuilderRowVariants> {
  /** Controlled leg value. */
  value: OptionLeg;
  /** Called with the updated leg. */
  onChange: (leg: OptionLeg) => void;
  /** Available strikes for the selected expiry (filtered upstream). */
  strikes: number[];
  /** Available expiries (epoch ms). When omitted, the expiry select is hidden. */
  expiries?: number[];
  /** Called when the user clicks the delete button. */
  onDelete?: () => void;
  /** Called when the user clicks the duplicate button. */
  onDuplicate?: () => void;
  /** Disable the delete button (e.g. when only one leg remains). */
  disableDelete?: boolean;
  /** Compact mode for dense multi-leg tickets. @default false */
  compact?: boolean;
  /** Disable every editable control and action. @default false */
  disabled?: boolean;
  /** Hide the buy/sell control. @default false */
  hideSide?: boolean;
  /** Hide the call/put control. @default false */
  hideType?: boolean;
  /** Minimum absolute contract quantity. @default 1 */
  contractMin?: number;
  /** Maximum absolute contract quantity. */
  contractMax?: number;
  /** Contract quantity step. @default 1 */
  contractStep?: number;
  /** Format a strike option label. */
  formatStrike?: (strike: number) => string;
  /** Format an expiry option label. */
  formatExpiry?: (expiry: number) => string;
  /** Override user-facing labels without replacing the controls. */
  labels?: Partial<{
    buy: React.ReactNode;
    sell: React.ReactNode;
    call: React.ReactNode;
    put: React.ReactNode;
    expiry: string;
    strike: string;
    contracts: string;
    duplicate: string;
    delete: string;
  }>;
  /** Classes for key internal slots. */
  classNames?: Partial<{
    side: string;
    type: string;
    expiry: string;
    strike: string;
    contracts: string;
    actions: string;
  }>;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

export const legBuilderRowVariants = cva(
  [
    "flex items-center gap-2 rounded-md border border-border bg-background p-2 transition-[border-color,background-color,box-shadow] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20",
  ].join(" "),
  {
    variants: { compact: { true: "p-1.5", false: "" } },
    defaultVariants: { compact: false },
  }
);

/**
 * LegBuilderRow — single reversible buy/sell × call/put × strike × qty row.
 *
 * Composed for use inside a multi-leg order ticket. Each field is controlled
 * via `value`/`onChange`. Side (Buy/Sell) and type (Call/Put) use
 * `ToggleGroup`; the strike uses a filterable `ComboBox`; contract quantity
 * uses `InputIncrementor`. Optional delete + duplicate buttons appear when
 * callbacks are supplied.
 *
 * @example
 * ```tsx
 * <LegBuilderRow value={leg} onChange={setLeg} strikes={[380, 390, 400]} />
 * ```
 */
export function LegBuilderRow({
  value,
  onChange,
  strikes,
  expiries,
  onDelete,
  onDuplicate,
  disableDelete,
  compact = false,
  disabled = false,
  hideSide = false,
  hideType = false,
  contractMin = 1,
  contractMax,
  contractStep = 1,
  formatStrike,
  formatExpiry,
  labels,
  classNames,
  className,
}: LegBuilderRowProps) {
  const strikeOptions = React.useMemo<ComboBoxOption<number>[]>(
    () =>
      strikes
        .slice()
        .sort((a, b) => a - b)
        .map((s) => ({
          value: s,
          label: formatStrike?.(s) ?? s.toLocaleString("en-US", {
            minimumFractionDigits: Number.isInteger(s) ? 0 : 1,
            maximumFractionDigits: 2,
          }),
        })),
    [formatStrike, strikes]
  );

  const expiryOptions = React.useMemo(
    () =>
      expiries?.map((e) => ({
        value: String(e),
        label: formatExpiry?.(e) ?? new Date(e).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "2-digit",
        }),
      })) ?? [],
    [expiries, formatExpiry]
  );

  return (
    <div
      data-side={value.side}
      data-option-type={value.type}
      className={cn(
        legBuilderRowVariants({ compact }),
        value.type === "call" ? "border-l-4 border-l-positive/70" : "border-l-4 border-l-negative/70",
        className
      )}
    >
      {/* Buy / Sell */}
      {!hideSide && <ToggleGroup
        type="single"
        value={value.side}
        onValueChange={(v) => {
          if (!v) return;
          const nextSide = v as OptionLeg["side"];
          // Keep `contracts` sign in sync with `side` so downstream Greeks
          // math sees a consistent signed quantity (buy = +, sell = -).
          const nextContracts =
            value.contracts === 0
              ? value.contracts
              : nextSide === "buy"
                ? Math.abs(value.contracts)
                : -Math.abs(value.contracts);
          onChange({ ...value, side: nextSide, contracts: nextContracts });
        }}
        size="sm"
        disabled={disabled}
        className={cn("shrink-0", classNames?.side)}
      >
        <ToggleGroupItem
          value="buy"
          className="data-[state=on]:bg-positive data-[state=on]:text-white"
        >
          {labels?.buy ?? "Buy"}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="sell"
          className="data-[state=on]:bg-negative data-[state=on]:text-white"
        >
          {labels?.sell ?? "Sell"}
        </ToggleGroupItem>
      </ToggleGroup>}

      {/* Call / Put */}
      {!hideType && <ToggleGroup
        type="single"
        value={value.type}
        onValueChange={(v) =>
          v && onChange({ ...value, type: v as OptionType })
        }
        size="sm"
        disabled={disabled}
        className={cn("shrink-0", classNames?.type)}
      >
        <ToggleGroupItem
          value="call"
          className="data-[state=on]:bg-positive data-[state=on]:text-white"
        >
          {labels?.call ?? "Call"}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="put"
          className="data-[state=on]:bg-negative data-[state=on]:text-white"
        >
          {labels?.put ?? "Put"}
        </ToggleGroupItem>
      </ToggleGroup>}

      {/* Expiry (optional) */}
      {expiryOptions.length > 0 && (
        <select
          className={cn("h-8 rounded-md border border-border bg-background px-2 text-xs", classNames?.expiry)}
          value={String(value.expiry)}
          onChange={(e) =>
            onChange({ ...value, expiry: Number(e.target.value) })
          }
          aria-label={labels?.expiry ?? "Expiration"}
          disabled={disabled}
        >
          {expiryOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      {/* Strike */}
      <div className={cn("min-w-[6rem] flex-1", classNames?.strike)}>
        <ComboBox<number>
          options={strikeOptions}
          value={value.strike}
          onChange={(v) =>
            v != null && onChange({ ...value, strike: v })
          }
          placeholder={labels?.strike ?? "Strike"}
          clearable={false}
          disabled={disabled}
          inputClassName="h-8 text-xs"
        />
      </div>

      {/* Contracts */}
      <div className={cn("shrink-0", classNames?.contracts)}>
        <InputIncrementor
          value={Math.abs(value.contracts)}
          onValueChange={(n) =>
            onChange({
              ...value,
              contracts:
                value.side === "buy" ? Math.abs(n) : -Math.abs(n),
            })
          }
          min={contractMin}
          max={contractMax}
          step={contractStep}
          disabled={disabled}
          size="sm"
          aria-label={labels?.contracts ?? "Contracts"}
        />
      </div>

      {/* Actions */}
      {(onDuplicate || onDelete) && (
        <div className={cn("flex shrink-0 items-center gap-1", classNames?.actions)}>
          {onDuplicate && (
            <Button
              colorStyle="text"
              size="xs"
              iconOnly
              onClick={onDuplicate}
              disabled={disabled}
              aria-label={labels?.duplicate ?? "Duplicate leg"}
            >
              <CopyPlus className="size-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button
              colorStyle="text"
              size="xs"
              iconOnly
              className="text-destructive hover:text-destructive"
              onClick={onDelete}
              disabled={disabled || disableDelete}
              aria-label={labels?.delete ?? "Delete leg"}
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

LegBuilderRow.displayName = "LegBuilderRow";
