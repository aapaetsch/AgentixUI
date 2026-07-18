# OrderBook — Agent Notes

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely.
- Always create and maintain a **TODO LIST** while working on tasks.
- After code changes, verify with the build and Storybook before marking complete.
- Update `docs/ROADMAP.md` as components are implemented.

## Overview

`OrderBook` is a specialized level-2 depth ladder. Bid/ask columns with depth bars, a spread band,
and memoized rows for high-frequency streaming. Specialized enough and reused across multiple
screens to warrant first-class ownership — not a `DataTable` row shape.

## Props Summary

### OrderBook (root)
- `bids: OrderBookLevel[]` (sorted desc), `asks: OrderBookLevel[]` (sorted asc)
- `maxRows?: number` (default 15) — visible levels per side
- `precision?: number` (default 2), `currency?: string` (default "USD")
- `highlightLast?: boolean` — flash last-updated rows
- `onLevelClick?: (level, side) => void`
- `className`

### Sub-components
- `OrderBookSide`, `OrderBookRow`, `OrderBookSpread`, `OrderBookHeader`, `OrderBookSkeleton`
- CVA: `orderBookRowVariants`, `orderBookSideVariants`

## Dependencies

- `class-variance-authority`, `cn()`
- `NumericText`, `Skeleton` (from kit)
- `lib/number-utils` formatters, `lib/finance-types` `OrderBookLevel`

## Styling Decisions

- Bid price `text-positive`, ask price `text-negative`; monospace throughout.
- Depth bars: absolutely-positioned divs behind the row, width = `level.size / maxVisible * 100%`,
  bid bars anchored right (`bg-positive-muted`), ask bars anchored left (`bg-negative-muted`).
- Spread band: `border-y py-1 text-xs bg-muted/50 text-center`.
- Row flash overlay via the `flash` variant (`bg-positive/20` / `bg-negative/20`), cleared next frame.

## Maintenance Notes

- `OrderBookRow` uses `React.memo` with a custom `arePropsEqual` keyed on `price + size + side +
  flash + maxVisible`. Do not weaken this comparator or streaming stories will regress.
- Upstream consumers MUST pre-sort bids descending and asks ascending before passing in.
- Row flash is opt-in via the `flash` prop on the row, not auto-detected at the root for v1.
  Wire flash from the streaming consumer if `highlightLast` is on.
- The `aria-live` summary is throttled to ~1s — never announce per tick.
- Add `@tanstack/react-virtual` only if profiling shows a clear need at the configured row counts.
- The component exports from `./finance` secondary entrypoint (Phase 6 packaging).