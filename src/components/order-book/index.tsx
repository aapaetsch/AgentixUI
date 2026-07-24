"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { formatCurrency, formatNumber } from "../../lib/number-utils";
import { NumericText } from "../typography";
import { Skeleton } from "../skeleton";
import type { OrderBookLevel } from "../../lib/finance-types";

/* -------------------------------------------------------------------------------------------------
 * Variants
 * ------------------------------------------------------------------------------------------------*/

export const orderBookSideVariants = cva(
  ["flex flex-col text-xs font-mono"].join(" "),
  {
    variants: {
      side: {
        bid: "",
        ask: "",
      },
    },
    defaultVariants: { side: "bid" },
  }
);

export const orderBookRowVariants = cva(
  [
    "relative grid min-h-11 grid-cols-3 items-center px-2 py-1",
    "cursor-pointer hover:bg-accent/30 active:bg-accent/50 touch-manipulation",
    "transition-colors duration-75",
  ].join(" "),
  {
    variants: {
      side: {
        bid: "",
        ask: "",
      },
      flash: {
        none: "",
        positive: "bg-positive/20",
        negative: "bg-negative/20",
      },
    },
    defaultVariants: { side: "bid", flash: "none" },
  }
);

/* -------------------------------------------------------------------------------------------------
 * Shared helpers
 * ------------------------------------------------------------------------------------------------*/

/** Compute the maximum cumulative size in the visible window for depth-bar scaling. */
function maxVisibleSize(levels: OrderBookLevel[], maxRows: number): number {
  const visible = levels.slice(0, maxRows);
  let max = 0;
  for (const lvl of visible) {
    const cumulative = lvl.total ?? lvl.size;
    if (cumulative > max) max = cumulative;
  }
  return max || 1;
}

/* -------------------------------------------------------------------------------------------------
 * OrderBookRow (memoized for streaming perf)
 * ------------------------------------------------------------------------------------------------*/

export interface OrderBookRowProps
  extends VariantProps<typeof orderBookRowVariants> {
  level: OrderBookLevel;
  side: "bid" | "ask";
  maxVisible: number;
  precision?: number;
  currency?: string;
  onClick?: (level: OrderBookLevel, side: "bid" | "ask") => void;
}

const OrderBookRowImpl = React.forwardRef<HTMLDivElement, OrderBookRowProps>(
  function OrderBookRow(
    { level, side, maxVisible, precision, currency = "USD", onClick, flash = "none" },
    ref
  ) {
    const cumulative = level.total ?? level.size;
    const pct = Math.min((cumulative / maxVisible) * 100, 100);
    const isBid = side === "bid";

    const ariaLabel = `${isBid ? "Bid" : "Ask"} ${formatCurrency(level.price, {
      currency,
      precision,
    })} for ${formatNumber(level.size)} shares`;

    return (
      <div
        ref={ref}
        role="row"
        aria-label={ariaLabel}
        data-side={side}
        className={cn(orderBookRowVariants({ side, flash }))}
        onClick={() => onClick?.(level, side)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(level, side);
          }
        }}
      >
        {/* Depth bar behind the row, anchored from the spread outward */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-y-0",
            isBid ? "right-0 bg-positive-muted" : "left-0 bg-negative-muted"
          )}
          style={{ width: `${pct}%` }}
        />
        {/* Price — colorized by side */}
        <span
          className={cn(
            "relative z-10 text-right tabular-nums",
            isBid ? "text-positive" : "text-negative"
          )}
        >
          <NumericText
            value={level.price}
            format="currency"
            currency={currency}
            precision={precision}
            align="right"
          />
        </span>
        {/* Size */}
        <span className="relative z-10 text-right tabular-nums text-foreground">
          <NumericText value={level.size} format="number" align="right" />
        </span>
        {/* Total (cumulative) */}
        <span className="relative z-10 text-right tabular-nums text-muted-foreground">
          <NumericText value={cumulative} format="number" align="right" />
        </span>
      </div>
    );
  }
);

export const OrderBookRow = React.memo(OrderBookRowImpl, (prev, next) => {
  return (
    prev.level.price === next.level.price &&
    prev.level.size === next.level.size &&
    prev.side === next.side &&
    prev.flash === next.flash &&
    prev.maxVisible === next.maxVisible
  );
});
OrderBookRow.displayName = "OrderBookRow";

/* -------------------------------------------------------------------------------------------------
 * OrderBookHeader
 * ------------------------------------------------------------------------------------------------*/

export function OrderBookHeader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 px-2 py-1 text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground",
        className
      )}
    >
      <span className="text-right">Price</span>
      <span className="text-right">Size</span>
      <span className="text-right">Total</span>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * OrderBookSpread
 * ------------------------------------------------------------------------------------------------*/

export interface OrderBookSpreadProps {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  precision?: number;
  currency?: string;
  className?: string;
}

export function OrderBookSpread({
  bids,
  asks,
  precision = 2,
  currency = "USD",
  className,
}: OrderBookSpreadProps) {
  const bestBid = bids[0]?.price;
  const bestAsk = asks[0]?.price;
  const spread =
    bestBid !== undefined && bestAsk !== undefined ? bestAsk - bestBid : undefined;
  const spreadPercent =
    bestBid !== undefined && bestAsk !== undefined && bestAsk !== 0
      ? (spread! / bestAsk) * 100
      : undefined;

  return (
    <div
      className={cn(
        "border-y py-1 text-center text-xs text-muted-foreground bg-muted/50",
        className
      )}
    >
      {spread !== undefined ? (
        <span className="tabular-nums">
          Spread {formatCurrency(spread, { currency, precision })}{" "}
          {spreadPercent !== undefined ? (
            <span className="text-muted-foreground">
              ({formatNumber(spreadPercent, { precision: 2 })}%)
            </span>
          ) : null}
        </span>
      ) : (
        <span>—</span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * OrderBookSkeleton
 * ------------------------------------------------------------------------------------------------*/

export function OrderBookSkeleton({ rows = 15 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-1 p-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * OrderBookSide
 * ------------------------------------------------------------------------------------------------*/

export interface OrderBookSideProps
  extends VariantProps<typeof orderBookSideVariants> {
  side: "bid" | "ask";
  levels: OrderBookLevel[];
  maxRows: number;
  precision?: number;
  currency?: string;
  onLevelClick?: (level: OrderBookLevel, side: "bid" | "ask") => void;
}

export function OrderBookSide({
  side,
  levels,
  maxRows,
  precision,
  currency,
  onLevelClick,
}: OrderBookSideProps) {
  const visible = levels.slice(0, maxRows);
  const maxVisible = maxVisibleSize(visible, maxRows);

  return (
    <div className={cn(orderBookSideVariants({ side }))}>
      {visible.map((level, idx) => (
        <OrderBookRow
          key={`${side}-${idx}-${level.price}`}
          level={level}
          side={side}
          maxVisible={maxVisible}
          precision={precision}
          currency={currency}
          onClick={onLevelClick}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * OrderBook (root)
 * ------------------------------------------------------------------------------------------------*/

export interface OrderBookProps {
  /** Bids, pre-sorted descending by price. */
  bids: OrderBookLevel[];
  /** Asks, pre-sorted ascending by price. */
  asks: OrderBookLevel[];
  /** Visible levels per side. @default 15 */
  maxRows?: number;
  /** Price decimal places. @default 2 */
  precision?: number;
  /** ISO currency code. @default "USD" */
  currency?: string;
  /** Flash last-updated rows. @default false */
  highlightLast?: boolean;
  onLevelClick?: (level: OrderBookLevel, side: "bid" | "ask") => void;
  className?: string;
}

/**
 * OrderBook - Level-2 depth ladder with bid/ask depth bars and spread display.
 *
 * v1 contract: bids render descending, asks ascending; depth bars scale relative
 * to the visible window; spread band renders from top-of-book. Ship a stable
 * display surface before chasing max update-rate optimization.
 *
 * @example
 * ```tsx
 * <OrderBook bids={bids} asks={asks} maxRows={15} precision={2} />
 * ```
 */
export function OrderBook({
  bids,
  asks,
  maxRows = 15,
  precision = 2,
  currency = "USD",
  onLevelClick,
  className,
}: OrderBookProps) {
  const liveRef = React.useRef<HTMLDivElement | null>(null);
  const announceRef = React.useRef<number | null>(null);
  const [announcement, setAnnouncement] = React.useState("");

  // Throttled (~1s) screen-reader summary of top-of-book (per accessibility requirements).
  React.useEffect(() => {
    if (announceRef.current !== null) window.clearTimeout(announceRef.current);
    announceRef.current = window.setTimeout(() => {
      const bestBid = bids[0];
      const bestAsk = asks[0];
      if (!bestBid || !bestAsk) return;
      setAnnouncement(
        `Top bid ${formatCurrency(bestBid.price, { currency, precision })} size ${bestBid.size}, top ask ${formatCurrency(bestAsk.price, { currency, precision })} size ${bestAsk.size}`
      );
    }, 1000);
    return () => {
      if (announceRef.current !== null) window.clearTimeout(announceRef.current);
    };
  }, [bids, asks, currency, precision]);

  return (
    <div ref={liveRef} className={cn("flex flex-col bg-background", className)}>
      <OrderBookHeader />
      <OrderBookSide
        side="bid"
        levels={bids}
        maxRows={maxRows}
        precision={precision}
        currency={currency}
        onLevelClick={onLevelClick}
      />
      <OrderBookSpread bids={bids} asks={asks} precision={precision} currency={currency} />
      <OrderBookSide
        side="ask"
        levels={asks}
        maxRows={maxRows}
        precision={precision}
        currency={currency}
        onLevelClick={onLevelClick}
      />
      {/* Visually-hidden throttled SR summary */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
OrderBook.displayName = "OrderBook";
