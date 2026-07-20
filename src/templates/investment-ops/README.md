# Investment-Ops Templates

Composed template blocks for an investment-ops dashboard. Templates compose existing
primitives — they are NOT a second primitive system.

## Usage

```tsx
import {
  StatTile,
  AccountSummary,
  Watchlist,
  HoldingsTable,
  OrderTicket,
  AllocationBreakdown,
  NewsFeed,
  InvestmentOpsDashboard,
} from "@agentix/ui/templates/investment-ops";
```

## Blocks

- **StatTile** — KPI tile composing `Card` + `Badge` + `AnimatedNumber` + a sparkline render slot. Supports an `align` prop (`left` | `center` | `right`) for content alignment.
- **AccountSummary** — Grid of `StatTile`s + optional warning `Alert`.
- **Watchlist** — `DataTable` of watchlist symbols with colorized P&L via `NumericText` and an
  optional sparkline render slot. Pass `showTickerImage` to prepend a brand-mark avatar beside each
  symbol (sourced from each item's optional `logoUrl`).
- **HoldingsTable** — `DataTable` of holdings with colorized P&L columns and row actions. Pass
  `showTickerImage` to prepend a brand-mark avatar beside each symbol (sourced from each holding's
  optional `logoUrl`).
- **OrderTicket** — Right-docked `Sheet` form for simple equity order entry. Uses `ToggleGroup`,
  `InputIncrementor`, `Select`, `AlertDialog`, and `toast.promise`. Multi-leg options deferred.
- **AllocationBreakdown** — `Card` + `Tabs` of Sector / Asset Class / Holding with a chart render
  slot and a breakdown `DataTable` beside the chart.
- **NewsFeed** — `Card` filterable feed using `MultiSelect`, `ToggleGroup` sentiments, `ScrollArea`,
  per-item `Avatar`, ticker `Badge`s, sentiment `Chip`s, and relative time.
- **InvestmentOpsDashboard** — Composed dashboard shell that composes ALL of the above.

## Design Philosophy

- Templates compose — do NOT invent new primitives here.
- Chart integrations stay slot-based so templates ship before the chart lib lands.
- All numeric displays route through `NumericText`; P&L is colorized via the semantic
  `text-positive` / `text-negative` tokens only.

## Accessibility

- Sign never by color alone — always paired with `+`/`−`, `ArrowUp`/`ArrowDown`, or `aria-label`.
- OrderTicket warnings render as `Alert` with appropriate variants.
- `NewsFeed` rows are click + keyboard activatable.

## Maintenance

- Add new blocks per the plan; keep them presentational and interaction-focused only.
- When a blocker requires a new primitive, add it to the relevant earlier phase (Streams 1–4).