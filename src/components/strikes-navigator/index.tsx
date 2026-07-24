"use client";

import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { ScrollArea } from "../scroll-area";
import { Input } from "../input";
import type { OptionType } from "../../lib/finance-types";

/* -------------------------------------------------------------------------------------------------
 * StrikesNavigator
 * ------------------------------------------------------------------------------------------------*/

/**
 * Moneyness classification for a strike relative to the spot.
 */
export type StrikeMoneyness = "itm" | "atm" | "otm";

/**
 * Props for {@link StrikesNavigator}.
 */
export interface StrikesNavigatorProps
  extends VariantProps<typeof strikesNavigatorVariants> {
  /** Sorted list of strikes (ascending). */
  strikes: number[];
  /** Current spot/underlying price used to classify ITM/ATM/OTM. */
  atmStrike: number;
  /** Controlled selected strike. */
  selectedStrike?: number;
  /** Called when a strike is selected. */
  onSelectStrike?: (strike: number) => void;
  /**
   * Distance (in strike units) within which a strike is considered ATM.
   * @default 0.5
   */
  atmTolerance?: number;
  /** Max rows visible in the viewport before scrolling. @default 20 */
  viewportRows?: number;
  /** Row height in pixels. @default 28 */
  rowHeight?: number;
  /** Auto-scroll the selected strike into view when it changes. @default true */
  autoScrollToSelected?: boolean;
  /** Option side used for correct ITM/OTM classification. @default "call" */
  optionType?: OptionType;
  /** Hide the quick-jump input. @default false */
  hideJumpInput?: boolean;
  /** Disable selection and quick-jump interactions. @default false */
  disabled?: boolean;
  /** Format each strike value. */
  formatStrike?: (strike: number) => React.ReactNode;
  /** Customize the right-side moneyness content. */
  renderMoneyness?: (moneyness: StrikeMoneyness, strike: number) => React.ReactNode;
  /** Header label. @default "Strike" */
  label?: React.ReactNode;
  /** Jump-input placeholder and accessible label. @default "Jump to strike" */
  jumpPlaceholder?: string;
  /** Empty-list content. @default "No strikes" */
  emptyContent?: React.ReactNode;
  /** Accessible list name. @default "Strikes" */
  ariaLabel?: string;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

export const strikesNavigatorVariants = cva(
  ["flex", "flex-col", "rounded-md", "border", "border-border", "bg-background"].join(" "),
  { variants: {}, defaultVariants: {} }
);

const rowVariants = cva(
  [
    "flex items-center justify-between gap-2 px-2 text-xs cursor-pointer select-none",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      state: {
        itm: "bg-positive/5 text-foreground hover:bg-positive/10",
        atm: "bg-primary/10 text-primary font-semibold hover:bg-primary/15",
        otm: "text-muted-foreground hover:bg-accent/40",
      },
      selected: {
        true: "ring-1 ring-inset ring-primary/60",
        false: "",
      },
    },
    defaultVariants: { state: "otm", selected: false },
  }
);

function classify(
  strike: number,
  atm: number,
  tolerance: number,
  optionType: OptionType
): StrikeMoneyness {
  if (Math.abs(strike - atm) <= tolerance) return "atm";
  return optionType === "call"
    ? strike < atm ? "itm" : "otm"
    : strike > atm ? "itm" : "otm";
}

/**
 * StrikesNavigator — strike ladder with ITM/ATM/OTM striping.
 *
 * Renders a fixed-height `ScrollArea` with the full strike list, an ATM
 * anchor, and a quick-jump input. Clicking or activating a row calls
 * `onSelectStrike`. Pure presentational — no pricing logic.
 *
 * @example
 * ```tsx
 * <StrikesNavigator strikes={[380, 390, 400, 410, 420]} atmStrike={400} />
 * ```
 */
export function StrikesNavigator({
  strikes,
  atmStrike,
  selectedStrike,
  onSelectStrike,
  atmTolerance = 0.5,
  viewportRows = 20,
  rowHeight = 28,
  autoScrollToSelected = true,
  optionType = "call",
  hideJumpInput = false,
  disabled = false,
  formatStrike,
  renderMoneyness,
  label = "Strike",
  jumpPlaceholder = "Jump to strike",
  emptyContent = "No strikes",
  ariaLabel = "Strikes",
  className,
}: StrikesNavigatorProps) {
  const [internalSelected, setInternalSelected] = React.useState<
    number | undefined
  >(selectedStrike);
  React.useEffect(() => {
    setInternalSelected(selectedStrike);
  }, [selectedStrike]);

  // Ref to the rows container; used for keyboard navigation and auto-scroll.
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const containerHeight = viewportRows * rowHeight;

  const selected = selectedStrike ?? internalSelected;

  // Auto-scroll the selected strike into view. We use the nearest scrollable
  // ancestor via `scrollIntoView` which works regardless of which wrapper
  // Radix makes scrollable.
  React.useEffect(() => {
    if (!autoScrollToSelected || selected == null) return;
    const idx = strikes.indexOf(selected);
    if (idx < 0) return;
    const node = listRef.current?.querySelector<HTMLElement>(
      `[data-strike-index="${idx}"]`
    );
    node?.scrollIntoView({ block: "center" });
  }, [selected, strikes, autoScrollToSelected]);

  const handleJump = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const v = parseFloat(e.target.value);
    if (!Number.isFinite(v)) return;
    // Snap to the nearest strike.
    let nearest = strikes[0];
    let bestDelta = Infinity;
    for (const k of strikes) {
      const d = Math.abs(k - v);
      if (d < bestDelta) {
        bestDelta = d;
        nearest = k;
      }
    }
    onSelectStrike?.(nearest);
    setInternalSelected(nearest);
  };

  const selectStrike = React.useCallback(
    (strike: number) => {
      if (disabled) return;
      setInternalSelected(strike);
      onSelectStrike?.(strike);
    },
    [disabled, onSelectStrike]
  );

  const focusRow = React.useCallback(
    (delta: number, currentIndex: number) => {
      let next = currentIndex + delta;
      if (next < 0) next = strikes.length - 1;
      else if (next >= strikes.length) next = 0;
      if (next < 0 || next >= strikes.length) return false;
      const node = listRef.current?.querySelector<HTMLElement>(
        `[data-strike-index="${next}"]`
      );
      node?.focus();
      selectStrike(strikes[next]);
      return true;
    },
    [strikes, selectStrike]
  );

  return (
    <div className={cn(strikesNavigatorVariants(), className)}>
      <div className="flex items-center justify-between border-b border-border px-2 py-1 text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        {!hideJumpInput && <div className="flex items-center gap-0.5">
          <Input
            type="number"
            placeholder={jumpPlaceholder}
            className="h-6 w-24 text-xs"
            onChange={handleJump}
            aria-label={jumpPlaceholder}
            disabled={disabled}
          />
        </div>}
      </div>
      <ScrollArea
        className="h-full"
        style={{ height: containerHeight }}
      >
        <div
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          className="relative"
        >
          {strikes.length === 0 ? (
            <div
              className="flex items-center justify-center px-2 py-4 text-xs text-muted-foreground"
              role="status"
            >
              {emptyContent}
            </div>
          ) : (
            strikes.map((strike, idx) => {
              const m = classify(strike, atmStrike, atmTolerance, optionType);
              const isSel = selected === strike;
              return (
                <div
                  key={strike}
                  role="option"
                  aria-selected={isSel}
                  aria-disabled={disabled || undefined}
                  tabIndex={isSel || (selected == null && idx === 0) ? 0 : -1}
                  data-strike-index={idx}
                  data-strike={strike}
                  style={{ height: rowHeight }}
                  className={cn(rowVariants({ state: m, selected: isSel }), disabled && "cursor-not-allowed opacity-60")}
                  onClick={() => selectStrike(strike)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectStrike(strike);
                    } else if (e.key === "ArrowDown") {
                      e.preventDefault();
                      focusRow(1, idx);
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      focusRow(-1, idx);
                    } else if (e.key === "Home") {
                      e.preventDefault();
                      focusRow(-idx, idx);
                    } else if (e.key === "End") {
                      e.preventDefault();
                      focusRow(strikes.length - 1 - idx, idx);
                    }
                  }}
                >
                  <span className="font-mono tabular-nums">
                    {formatStrike?.(strike) ?? strike.toLocaleString("en-US", {
                      minimumFractionDigits: Number.isInteger(strike) ? 0 : 1,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-[0.625rem] uppercase tracking-wider">
                    {renderMoneyness?.(m, strike) ?? (m === "atm" ? (
                      "ATM"
                    ) : m === "itm" ? (
                      <span className="inline-flex items-center gap-0.5">
                        <ChevronDown className="size-2.5" /> ITM
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5">
                        <ChevronUp className="size-2.5" /> OTM
                      </span>
                    ))}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

StrikesNavigator.displayName = "StrikesNavigator";
