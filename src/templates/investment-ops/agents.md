# Investment-Ops Templates — Agent Notes

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely.
- Always create and maintain a **TODO LIST** while working on tasks.
- After code changes, verify with the build and Storybook before marking complete.
- Update `docs/ROADMAP.md` as components are implemented.

## Guiding rule (locked)
Templates COMPOSE. They MUST NOT become a second primitive system. No new
primitives are invented here. If a blocker is discovered, add the primitive
to the relevant earlier phase (Streams 1–4) instead.

## Blocks
- `StatTile` — KPI tile (`Card` + `Badge` + `AnimatedNumber` + sparkline slot).
- `AccountSummary` — grid of `StatTile`s + optional warning `Alert`.
- `Watchlist` — `DataTable` + `NumericText` + sparkline slot.
- `HoldingsTable` — `DataTable` + colorized `NumericText` P&L + row-action dropdown.
- `OrderTicket` — `Sheet` + `ToggleGroup` + `InputIncrementor` + `Select` + `AlertDialog` + `toast.promise` (single-leg equity flow).
- `AllocationBreakdown` — `Card` + `Tabs` + chart slot + `DataTable` breakdown.
- `NewsFeed` — `Card` + `Avatar` + `Badge` + `Chip` + filter bar (`MultiSelect` + `ToggleGroup`) + `ScrollArea`.
- `InvestmentOpsDashboard` — composed dashboard shell (`Navbar` + `Navrail` + `Tabs` + `Resizable` + `FAB` + `OrderTicket`).

### Options (Phase J-open) — composed templates
- `OptionsPositionsTable` — `DataTable` of open `OptionPosition`s; columns: `OptionSymbolBadge`, `ExpiryBadge`, status `Badge`, signed Qty, Mark, Mkt Value, Net Δ$, Θ/day, P&L. Row actions: Roll/Close/Exercise. Mirrors `HoldingsTable`.
- `AggregateGreeksStrip` — net portfolio Greeks as a tight `Card` strip. Built on `Card` + `NumericText` + `Badge` directly (no `StatTile` coupling, per the templates-compose-primitives-only rule).
- `OptionPositionCard` — single-position summary card (`Card` + `OptionSymbolBadge` + `ExpiryBadge` + `PayoffDiagram` + `BreakevenBadges` + `GreeksDisplay` + `NumericText` max P/L grid). The leg built from `OptionPosition` normalizes `averageCost` with `Math.abs` for `limitPrice` (direction carried by `side`), so short-credit semantics in `netPremium` are correct whether the consuming app records shorts as a positive or negative per-share cost.
- `OptionsChain` — calls/puts chain (`Tabs` expiry cycle + strike-center `DataTable` + `StrikesNavigator`). Header shows the underlying ticker as plain mono text + the active expiry cycle label (no `OptionSymbolBadge` — the C/P badge is misleading for a combined call+put chain header). Click a bid/ask cell → `onAddLeg(side, type, strike, expiry)`. Bid/ask buttons carry `aria-label`s like "Sell call at strike 400" for SR clarity.
- `PayoffBundleCard` — multi-leg risk snapshot (`Card` + `PayoffDiagram` + net debit/credit `Badge` + max P/L + `BreakevenBadges`). Companion to `MultiLegOrderTicket`.
- `MultiLegOrderTicket` — `Sheet` + `SpreadTypeSelector` + dynamic `LegBuilderRow` list + per-leg `GreeksDisplay` (via row) + `PayoffBundleCard` preview + `AlertDialog` confirm + `toast.promise(onSubmit(legs))`. Mirrors `OrderTicket`. The submit handler wraps `toast.promise` in try/catch and swallows rejections (the toast already surfaces the error), so the sheet stays open on rejection and no unhandled-promise-rejection warning fires. A `useEffect` clears any stale validation error whenever `legs` changes.

New primitives these templates compose (live in `src/components/`, not here):
`OptionSymbolBadge`, `ExpiryBadge`, `GreeksDisplay`, `BreakevenBadges`,
`PayoffDiagram`, `GreeksDecayChart`, `IVChart`, `StrikesNavigator`,
`LegBuilderRow`, `SpreadTypeSelector`. Helper: `lib/finance-utils`
(`computePayoffAtExpiry`, `breakevensAtExpiry`, `maxProfit/LossAtExpiry`,
`netPremium`, `priceGrid`). Types: `lib/finance-types` (`OptionContract`,
`OptionPosition`, `OptionChainRow`, `OptionLeg`, `Greeks`, `PayoffPoint`).

## v1 scope cuts (locked)
- OrderTicket ships simple equity flow only; multi-leg options now live in
  `MultiLegOrderTicket` (Phase J-open).
- Chart integrations use slot props; templates ship before the chart lib lands.
- Payoff/Greeks-decay/IV visuals are inline-SVG `@agentix/ui` primitives
  (`Sparkline` precedent) — heavy chart versions remain planned for
  `@agentix/charts`.

## Dependencies
- All Phase 1–4 primitives (Typography, NumericText, AnimatedNumber, ToggleGroup,
  Resizable, CommandPalette, Toolbar, OrderBook, TimeAndSales) and existing kit
  components (Card, Tabs, DataTable, Sheet, AlertDialog, Alert, Avatar, Badge, Chip,
  MultiSelect, ScrollArea, FAB, Navigation, Select, Input, InputIncrementor, toast).

## Export Wiring
Templates export from `./templates/investment-ops` (secondary entrypoint). The
`./finance` entrypoint exports `OrderBook` + `TimeAndSales`. Update `tsup.config.ts`
and `package.json` `exports` accordingly (Phase 6 packaging task).

## Maintenance Notes
- When a template needs a primitive that does not exist, do NOT add it inline. File a
  follow-up against the relevant earlier phase.
- Keep chart integrations slot-based so templates continue to ship independently of
  the chart library.
- Storybook coverage must include empty, loading, and dense-data states for each block.