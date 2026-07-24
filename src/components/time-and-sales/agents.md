# TimeAndSales — Agent Notes

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely.
- Always create and maintain a **TODO LIST** while working on tasks.
- After code changes, verify with the build and Storybook before marking complete.
- Update `docs/ROADMAP.md` as components are implemented.

## Overview

`TimeAndSales` is a streaming recent-trades tape. Renders the last N trades with side coloring
and block-trade flags. Maintains a rolling window, autoscrolls unless the user has scrolled up,
and provides a throttled screen-reader summary.

## Props Summary

### TimeAndSales (root)
- `trades: Trade[]`, `maxRows?: number` (default 100), `autoScroll?: boolean` (default true)
- `precision?: number` (default 2), `onTradeClick?: (trade) => void`
- `loading?: boolean`, `className`

### Sub-components
- `TimeAndSalesRow` (memoized), `TimeAndSalesHeader`
- CVA: `timeAndSalesRowVariants` (side buy/sell/unknown, flash none/positive/negative)

## Dependencies

- `class-variance-authority`, `cn()`
- `NumericText`, `Badge`, `Skeleton` from the kit
- `lib/date-utils` `formatTime` (absolute `HH:mm` — relative time is for NewsFeed)
- `lib/finance-types` `Trade`, `TradeFlag`

## Styling Decisions

- Side bar 2px on left edge of each row; colored by side via the semantic tokens.
- Buy price `text-positive`, sell `text-negative`, unknown `text-foreground`.
- Block trades get a `Badge variant="secondary"` "BLK" marker.
- Newest-row flash via the `flash` row variant (`bg-positive/20` / `bg-negative/20`),
  consumer-toggled.

## Maintenance Notes

- Rolling window is memoized to avoid re-allocs on stable input.
- `isAtBottom` is tracked via `onScroll`; autoscroll only fires when the user is at the bottom.
- SR announcements are throttled (~1s) — never announce per-tick.
- `TimeAndSalesFilter` is deferred for v1; add only if a straightforward need arises.
- The component exports from `./finance` secondary entrypoint (Phase 6 packaging).