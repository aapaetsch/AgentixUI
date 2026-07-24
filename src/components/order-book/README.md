# OrderBook

## Overview

`OrderBook` is a level-2 depth ladder with bid/ask depth bars and spread display. It renders a
stable display surface optimized for high-frequency streaming updates in the right rail of a
trading dashboard.

## Installation

```tsx
import { OrderBook } from "@agentix/ui/finance";
```

## Usage

```tsx
<OrderBook bids={bids} asks={asks} maxRows={15} precision={2} onLevelClick={handleClick} />
```

## Components

### OrderBook

Root container. Renders bids (descending), spread band, then asks (ascending).

**Props**

```ts
interface OrderBookProps {
  bids: OrderBookLevel[];        // sorted desc by price
  asks: OrderBookLevel[];        // sorted asc by price
  maxRows?: number;               // visible levels per side, default 15
  precision?: number;             // price decimals, default 2
  currency?: string;              // default "USD"
  highlightLast?: boolean;        // flash last-updated rows
  onLevelClick?: (level: OrderBookLevel, side: "bid" | "ask") => void;
  className?: string;
}
```

### Sub-components

- `OrderBookSide` — bid/ask column with depth visualization bars behind rows.
- `OrderBookRow` — memoized row (`React.memo` keyed on price+size for streaming perf).
- `OrderBookSpread` — center band showing spread $ and %.
- `OrderBookHeader` — `Price | Size | Total` labels.
- `OrderBookSkeleton` — loading placeholder.

## Dependencies

- `class-variance-authority`, `cn()`
- `NumericText` (phase 1), `Skeleton` from the kit
- `lib/number-utils` formatters
- `lib/finance-types` `OrderBookLevel`

## Styling Decisions

- Bid price `text-positive`, ask price `text-negative`; monospace throughout.
- Depth bars: absolutely-positioned `div` with `width: %` relative to max visible depth; bid bars
  anchored right, ask bars anchored left. No re-layout on update.
- Spread band: `border-y text-xs bg-muted/50 text-center`.

## Accessibility

- Throttled (~1s) `aria-live="polite"` summary of top-of-book — never per tick.
- Per-row `aria-label`: "Bid $X for Y shares" / "Ask $A for B shares".
- Rows are click + Enter/Space activatable.

## Performance

- `OrderBookRow` is wrapped in `React.memo` with a custom `arePropsEqual` keyed on
  `price + size + side + flash + maxVisible`. Add `@tanstack/react-virtual` only if profiling
  shows a clear need at the configured row counts.
- Depth bar width is set via inline `style` to avoid Tailwind class thrash on every update.
- Stories keep props stable to expose real rerender behavior — do NOT allocate fresh arrays
  inside consumer render.

## Maintenance Notes

- Upstream must pre-sort bids descending and asks ascending.
- Row flash on `highlightLast` is handled by the consumer toggling the `flash` prop; the root
  component does not auto-detect changes for v1.
- Treat thousands-of-updates-per-second as a stretch target, not an entry requirement.