# TimeAndSales

## Overview

`TimeAndSales` is a streaming recent-trades tape: time, price, size, side, and flags (block,
uptick/downtick, correction). It maintains a rolling window of trades and auto-scrolls to the
newest unless the user has scrolled up.

## Installation

```tsx
import { TimeAndSales } from "aapaetsch-ui-kit/finance";
```

## Usage

```tsx
<TimeAndSales trades={trades} maxRows={100} autoScroll onTradeClick={handleClick} />
```

## Components

### TimeAndSales

Root. Manages the rolling window, autoscroll, and throttled SR announcements.

**Props**

```ts
interface TimeAndSalesProps {
  trades: Trade[];            // see lib/finance-types.ts
  maxRows?: number;            // rolling window, default 100
  autoScroll?: boolean;        // default true
  precision?: number;          // default 2
  onTradeClick?: (trade: Trade) => void;
  loading?: boolean;
  className?: string;
}
```

### Sub-components

- `TimeAndSalesRow` — single trade row; `React.memo` keyed on stable trade fields.
- `TimeAndSalesHeader` — column labels.
- CVA: `timeAndSalesRowVariants` (side, flash).

## Dependencies

- `class-variance-authority`, `cn()`
- `NumericText`, `Badge`, `Skeleton` from the kit
- `lib/date-utils` `formatTime`
- `lib/finance-types` `Trade`, `TradeFlag`

## Styling Decisions

- Compact `text-xs`, right-aligned numerics via `NumericText`, monospace via `font-mono`.
- Side bar (2px) on the left edge of each row: buy `bg-positive`, sell `bg-negative`, unknown `bg-muted`.
- Buy price `text-positive`; sell price `text-negative`; unknown `text-foreground`.
- Block trades get a `Badge variant="secondary"` "BLK" marker on the right.
- Newest row flash: `bg-positive/20` / `bg-negative/20` overlay (consumer toggled via the `flash`
  row prop).

## Accessibility

- Throttled `aria-live="polite"` summary (~1s): "Last trade: $X, Y shares, buy". Never per-tick.
- Per-row `aria-label` includes side, size, price, and flags.
- Rows are click + Enter/Space activatable.

## Maintenance Notes

- The rolling window uses a memoized slice so stable inputs don't cause re-renders.
- Autoscroll tracks `isAtBottom` via `onScroll`; scroll up = stays put, scroll to bottom =
  re-engages autoscroll.
- `TimeAndSalesFilter` (min size / block-only / side) is deferred for v1; ship only if a
  straightforward need arises.
- Absolute time `HH:mm` is used for the tape; relative time (`"2s ago"`) is reserved for NewsFeed.