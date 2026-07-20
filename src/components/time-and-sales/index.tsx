import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { formatTime } from "../../lib/date-utils";
import { NumericText } from "../typography";
import { Badge } from "../badge";
import { Skeleton } from "../skeleton";
import type { Trade, TradeFlag } from "../../lib/finance-types";

const timeAndSalesColumnLayout =
  "grid-cols-[4.5rem_minmax(0,1fr)_minmax(4.5rem,5.5rem)_4rem]";

/* -------------------------------------------------------------------------------------------------
 * Variants
 * ------------------------------------------------------------------------------------------------*/

export const timeAndSalesRowVariants = cva(
  [
    "relative grid items-center gap-2 text-xs font-mono px-2 py-0.5",
    timeAndSalesColumnLayout,
    "cursor-pointer hover:bg-accent/30",
    "transition-colors duration-75",
  ].join(" "),
  {
    variants: {
      side: {
        buy: "",
        sell: "",
        unknown: "",
      },
      flash: {
        none: "",
        positive: "bg-positive/20",
        negative: "bg-negative/20",
      },
    },
    defaultVariants: { side: "unknown", flash: "none" },
  }
);

/* -------------------------------------------------------------------------------------------------
 * TimeAndSalesRow
 * ------------------------------------------------------------------------------------------------*/

export interface TimeAndSalesRowProps
  extends VariantProps<typeof timeAndSalesRowVariants> {
  trade: Trade;
  precision?: number;
  onClick?: (trade: Trade) => void;
}

export const TimeAndSalesRow = React.memo(function TimeAndSalesRow({
  trade,
  precision = 2,
  side = "unknown",
  flash = "none",
  onClick,
}: TimeAndSalesRowProps) {
  const sideClass =
    side === "buy"
      ? "bg-positive"
      : side === "sell"
      ? "bg-negative"
      : "bg-muted";

  const priceClass =
    side === "buy" ? "text-positive" : side === "sell" ? "text-negative" : "text-foreground";

  const ariaLabel = `${side} trade ${formatNumber(trade.size)} shares at ${formatCurrencyLabel(
    trade.price,
    precision
  )}${trade.flags?.length ? `, flags: ${trade.flags.join(", ")}` : ""}`;

  return (
    <div
      role="row"
      aria-label={ariaLabel}
      className={cn(timeAndSalesRowVariants({ side, flash }))}
      onClick={() => onClick?.(trade)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(trade);
        }
      }}
    >
      {/* Side color bar on left edge */}
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-0.5", sideClass)} />

      {/* Time */}
      <span className="relative z-10 min-w-0 text-left text-muted-foreground tabular-nums">
        {formatTime(new Date(trade.time), "24")}
      </span>

      {/* Price */}
      <span className={cn("relative z-10 min-w-0 text-right tabular-nums", priceClass)}>
        <NumericText value={trade.price} format="currency" precision={precision} align="right" />
      </span>

      {/* Size */}
      <span className="relative z-10 min-w-0 text-right tabular-nums text-foreground">
        <NumericText value={trade.size} format="number" align="right" />
      </span>

      {/* Flags */}
      <span className="relative z-10 flex min-w-0 items-center justify-end gap-1">
        {trade.flags?.map((flag) => (
          <FlagBadge key={flag} flag={flag} />
        ))}
      </span>
    </div>
  );
});
(TimeAndSalesRow as unknown as { displayName: string }).displayName = "TimeAndSalesRow";

function FlagBadge({ flag }: { flag: TradeFlag }) {
  if (flag === "block") return <Badge variant="secondary">BLK</Badge>;
  if (flag === "uptick") return <Badge variant="outline">↑</Badge>;
  if (flag === "downtick") return <Badge variant="outline">↓</Badge>;
  return <Badge variant="outline">corr</Badge>;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCurrencyLabel(value: number, precision: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
}

/* -------------------------------------------------------------------------------------------------
 * TimeAndSalesHeader
 * ------------------------------------------------------------------------------------------------*/

export function TimeAndSalesHeader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-2 px-2 py-1 text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground",
        timeAndSalesColumnLayout,
        className
      )}
    >
      <span className="text-left">Time</span>
      <span className="text-right">Price</span>
      <span className="text-right">Size</span>
      <span className="text-right">Flags</span>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * TimeAndSales (root)
 * ------------------------------------------------------------------------------------------------*/

export interface TimeAndSalesProps {
  trades: Trade[];
  /** Rolling window row cap. @default 100 */
  maxRows?: number;
  /** Stick to bottom on new trade unless the user has scrolled up. @default true */
  autoScroll?: boolean;
  precision?: number;
  onTradeClick?: (trade: Trade) => void;
  loading?: boolean;
  className?: string;
}

/**
 * TimeAndSales - Streaming recent-trades tape (last trades).
 *
 * Renders time, price, size, side, and flags for a rolling window of trades. Auto-scrolls to
 * the newest unless the user has scrolled up. Throttled (~1s) SR announcements per accessibility
 * requirements — never per-tick.
 *
 * @example
 * ```tsx
 * <TimeAndSales trades={trades} maxRows={100} autoScroll />
 * ```
 */
export function TimeAndSales({
  trades,
  maxRows = 100,
  autoScroll = true,
  precision = 2,
  onTradeClick,
  loading = false,
  className,
}: TimeAndSalesProps) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const isAtBottomRef = React.useRef(true);
  const announceRef = React.useRef<number | null>(null);
  const [announcement, setAnnouncement] = React.useState("");

  // Rolling window: drop oldest beyond maxRows (avoid re-allocating on stable inputs).
  const visible = React.useMemo(() => {
    if (trades.length <= maxRows) return trades;
    return trades.slice(trades.length - maxRows);
  }, [trades, maxRows]);

  // Track whether the user is at the bottom so autoscroll only fires when appropriate.
  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 16;
    isAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  // Autoscroll to bottom when new trades arrive, unless the user scrolled up.
  React.useEffect(() => {
    if (!autoScroll || !isAtBottomRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [visible, autoScroll]);

  // Throttled (~1s) SR summary of the latest trade.
  React.useEffect(() => {
    if (announceRef.current !== null) window.clearTimeout(announceRef.current);
    announceRef.current = window.setTimeout(() => {
      const last = visible[visible.length - 1];
      if (!last) return;
      setAnnouncement(
        `Last trade: ${formatCurrencyLabel(last.price, precision)}, ${formatNumber(last.size)} shares, ${last.side}`
      );
    }, 1000);
    return () => {
      if (announceRef.current !== null) window.clearTimeout(announceRef.current);
    };
  }, [visible, precision]);

  if (loading) {
    return (
      <div className={cn("flex flex-col gap-1 p-2", className)}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className={cn("p-4 text-center text-xs text-muted-foreground", className)}>
        No trades yet
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col bg-background", className)}>
      <TimeAndSalesHeader />
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto max-h-96"
      >
        {visible.map((trade) => (
          <TimeAndSalesRow
            key={trade.id}
            trade={trade}
            precision={precision}
            side={trade.side}
            onClick={onTradeClick}
          />
        ))}
      </div>
      {/* Visually-hidden throttled SR summary */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
TimeAndSales.displayName = "TimeAndSales";