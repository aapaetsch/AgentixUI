# Investment-Ops Templates

## Options template customization

The six options templates expose composition boundaries instead of requiring forks: tables accept replaceable columns/actions/renderers, cards forward props to their payoff/breakeven/Greeks children, the chain supports controlled expiry and strike state, and the multi-leg ticket supports controlled spread/legs plus custom spread factories and preview rendering. Currency, labels, empty states, section visibility, and density remain configurable with backward-compatible defaults.

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
  OptionsPositionsTable,
  AggregateGreeksStrip,
  OptionPositionCard,
  OptionsChain,
  PayoffBundleCard,
  MultiLegOrderTicket,
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
  `InputIncrementor`, `Select`, `AlertDialog`, and `toast.promise`.
- **AllocationBreakdown** — `Card` + `Tabs` of Sector / Asset Class / Holding with a chart render
  slot and a breakdown `DataTable` beside the chart.
- **NewsFeed** — `Card` filterable feed using `MultiSelect`, `ToggleGroup` sentiments, `ScrollArea`,
  per-item `Avatar`, ticker `Badge`s, sentiment `Chip`s, and relative time.
- **InvestmentOpsDashboard** — Composed dashboard shell that composes ALL of the above.

### Options (Phase J-open)

- **OptionsPositionsTable** — Open option contracts blotter (`DataTable` of `OptionPosition`s with `OptionSymbolBadge`, `ExpiryBadge`, signed Qty, Net Δ$, Θ/day, P&L). Row actions: Roll / Close / Exercise.
- **AggregateGreeksStrip** — Net portfolio Greeks row (Net Δ [or Δ$ when `spot` is given], Γ, Θ/day, ν per 1% IV). Built directly on `Card` + `NumericText` + `Badge`.
- **OptionPositionCard** — Single open-position summary card with mini `PayoffDiagram`, breakevens, max P/L, and inline `GreeksDisplay`.
- **OptionsChain** — Calls/puts chain by strike × expiry with `Tabs` expiry cycle, strike-center `DataTable`, and a `StrikesNavigator`. Click a bid/ask → `onAddLeg(side, type, strike, expiry)`.
- **PayoffBundleCard** — Multi-leg risk snapshot card (`PayoffDiagram` + net debit/credit `Badge` + max P/L + `BreakevenBadges`). Companion to `MultiLegOrderTicket`.
- **MultiLegOrderTicket** — Multi-leg option order builder: `Sheet` with a `SpreadTypeSelector` that pre-fills a dynamic list of `LegBuilderRow`s, live `PayoffBundleCard` preview, net debit/credit display, and an `AlertDialog`-confirmed submit that fires `toast.promise(onSubmit(legs))`. Mirrors `OrderTicket`'s interaction pattern.

These templates compose the new `@agentix/ui` options primitives
(`OptionSymbolBadge`, `ExpiryBadge`, `GreeksDisplay`, `BreakevenBadges`,
`PayoffDiagram`, `GreeksDecayChart`, `IVChart`, `StrikesNavigator`,
`LegBuilderRow`, `SpreadTypeSelector`) and the pure helpers in
`@agentix/ui/finance` (`computePayoffAtExpiry`, `breakevensAtExpiry`,
`maxProfit/LossAtExpiry`, `netPremium`, `priceGrid`).

## Recent API Additions

- `Watchlist` accepts ordered `visibleColumns`, optional ticker/name/type metadata, richer quote fields, and controlled or uncontrolled accordion detail rows through `renderExpandedRow`.
- `PayoffBundleCard` and `OptionPositionCard` forward `showHoverDetails` for a tracked dot and price/P&L tooltip.
- Options chains, position cards, leg rows, and payoff surfaces use the shared semantic call/put, buy/sell, and profit/loss palette.

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
