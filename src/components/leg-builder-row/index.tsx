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
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

export const legBuilderRowVariants = cva(
  [
    "flex items-center gap-2 rounded-md border border-border bg-background p-2",
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
  className,
}: LegBuilderRowProps) {
  const strikeOptions = React.useMemo<ComboBoxOption<number>[]>(
    () =>
      strikes
        .slice()
        .sort((a, b) => a - b)
        .map((s) => ({
          value: s,
          label: s.toLocaleString("en-US", {
            minimumFractionDigits: Number.isInteger(s) ? 0 : 1,
            maximumFractionDigits: 2,
          }),
        })),
    [strikes]
  );

  const expiryOptions = React.useMemo(
    () =>
      expiries?.map((e) => ({
        value: String(e),
        label: new Date(e).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "2-digit",
        }),
      })) ?? [],
    [expiries]
  );

  return (
    <div className={cn(legBuilderRowVariants({ compact }), className)}>
      {/* Buy / Sell */}
      <ToggleGroup
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
        className="shrink-0"
      >
        <ToggleGroupItem
          value="buy"
          className="data-[state=on]:bg-positive data-[state=on]:text-white"
        >
          Buy
        </ToggleGroupItem>
        <ToggleGroupItem
          value="sell"
          className="data-[state=on]:bg-negative data-[state=on]:text-white"
        >
          Sell
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Call / Put */}
      <ToggleGroup
        type="single"
        value={value.type}
        onValueChange={(v) =>
          v && onChange({ ...value, type: v as OptionType })
        }
        size="sm"
        className="shrink-0"
      >
        <ToggleGroupItem
          value="call"
          className="data-[state=on]:bg-positive data-[state=on]:text-white"
        >
          Call
        </ToggleGroupItem>
        <ToggleGroupItem
          value="put"
          className="data-[state=on]:bg-negative data-[state=on]:text-white"
        >
          Put
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Expiry (optional) */}
      {expiryOptions.length > 0 && (
        <select
          className="h-8 rounded-md border border-border bg-background px-2 text-xs"
          value={String(value.expiry)}
          onChange={(e) =>
            onChange({ ...value, expiry: Number(e.target.value) })
          }
          aria-label="Expiration"
        >
          {expiryOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      {/* Strike */}
      <div className="min-w-[6rem] flex-1">
        <ComboBox<number>
          options={strikeOptions}
          value={value.strike}
          onChange={(v) =>
            v != null && onChange({ ...value, strike: v })
          }
          placeholder="Strike"
          clearable={false}
          inputClassName="h-8 text-xs"
        />
      </div>

      {/* Contracts */}
      <div className="shrink-0">
        <InputIncrementor
          value={Math.abs(value.contracts)}
          onValueChange={(n) =>
            onChange({
              ...value,
              contracts:
                value.side === "buy" ? Math.abs(n) : -Math.abs(n),
            })
          }
          min={1}
          step={1}
          size="sm"
          aria-label="Contracts"
        />
      </div>

      {/* Actions */}
      {(onDuplicate || onDelete) && (
        <div className="flex shrink-0 items-center gap-1">
          {onDuplicate && (
            <Button
              colorStyle="text"
              size="xs"
              iconOnly
              onClick={onDuplicate}
              aria-label="Duplicate leg"
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
              disabled={disableDelete}
              aria-label="Delete leg"
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