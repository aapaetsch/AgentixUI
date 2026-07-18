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
- `OrderTicket` — `Sheet` + `ToggleGroup` + `InputIncrementor` + `Select` + `AlertDialog` + `toast.promise`.
- `AllocationBreakdown` — `Card` + `Tabs` + chart slot + `DataTable` breakdown.
- `NewsFeed` — `Card` + `Avatar` + `Badge` + `Chip` + filter bar (`MultiSelect` + `ToggleGroup`) + `ScrollArea`.
- `InvestmentOpsDashboard` — composed dashboard shell (`Navbar` + `Navrail` + `Tabs` + `Resizable` + `FAB` + `OrderTicket`).

## v1 scope cuts (locked)
- OrderTicket ships simple equity flow only; multi-leg options DEFERRED.
- Chart integrations use slot props; templates ship before the chart lib lands.
- Watchlist / HoldingsTable use existing `DataTable` capabilities (virtualization where needed).
- No new table abstractions unless the generic `DataTable` clearly blocks a use case.

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