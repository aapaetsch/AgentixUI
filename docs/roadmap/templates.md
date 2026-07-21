# Templates

## Investment-Ops Template Set — ✅ Complete

Folder: `src/templates/investment-ops/` (secondary entrypoint `@agentix/ui/templates/investment-ops`)

| Block | Status | Description |
|------|--------|-------------|
| **StatTile** | ✅ Complete | KPI tile (`Card` + `Badge` + `AnimatedNumber` + sparkline render slot) |
| **AccountSummary** | ✅ Complete | Grid of `StatTile`s + optional warning `Alert` |
| **Watchlist** | ✅ Complete | Ordered `visibleColumns`, expanded detail subrows, ticker/name/type controls, colorized `NumericText`, and sparkline render slot. |
| **HoldingsTable** | ✅ Complete | `DataTable` + colorized P&L columns + row-action dropdown |
| **OrderTicket** | ✅ Complete | Right-docked `Sheet` form, simple equity flow only; multi-leg options deferred |
| **AllocationBreakdown** | ✅ Complete | `Card` + `Tabs` (Sector/Asset Class/Holding) + chart render slot + breakdown `DataTable` |
| **NewsFeed** | ✅ Complete | Filterable feed (`MultiSelect` + `ToggleGroup`) + `ScrollArea`, `Avatar`, `Badge`, `Chip` |
| **InvestmentOpsDashboard** | ✅ Complete | Composed dashboard shell: `Navbar` + `NavItem` rail + `Tabs` + `Resizable` + `OrderBook` + `TimeAndSales` + `OrderTicket` via `ExtendedFAB` |

### Investment-Ops Options Templates — ✅ Complete (Phase J-open, 2026-07-20)

| Block | Status | Description |
|------|--------|-------------|
| **OptionsPositionsTable** | ✅ Complete | `DataTable` of open `OptionPosition`s: `OptionSymbolBadge` + `ExpiryBadge` + signed Qty + Mark + Mkt Value + Net Δ$ + Θ/day + P&L. Row actions Roll/Close/Exercise. |
| **AggregateGreeksStrip** | ✅ Complete | Net portfolio Greeks strip (Net Δ [or Δ$ when `spot` given] / Γ / Θ-day / ν per 1% IV). Built on `Card` + `NumericText` + `Badge` (no `StatTile` coupling). |
| **OptionPositionCard** | ✅ Complete | Color-coded call/put accent, semantic P/L surface, mini interactive `PayoffDiagram`, `BreakevenBadges`, max P/L, and `GreeksDisplay`. |
| **OptionsChain** | ✅ Complete | Color-coded calls/puts chain by strike × expiry with actionable bid/ask cells, expiry `Tabs`, `DataTable`, and `StrikesNavigator`. |
| **PayoffBundleCard** | ✅ Complete | Multi-leg risk snapshot with optional hover details, semantic profit/loss chart colors, net debit/credit `Badge`, max P/L, and `BreakevenBadges`. |
| **MultiLegOrderTicket** | ✅ Complete | `Sheet` + `SpreadTypeSelector` + dynamic `LegBuilderRow` list + `PayoffBundleCard` preview + `AlertDialog` confirm + `toast.promise(onSubmit(legs))`. |

Note: The generic `Data Dashboard` placeholder is superseded by this concrete investment-ops set. Storybook stories exist for all 8 blocks under `Templates/Investment-Ops/*`, plus 6 options blocks under `Templates/Options/*` (added 2026-07-20).

## Generic Templates (Planned)

| Template/Component | Priority | Description |
|--------------------|----------|-------------|
| **Admin Dashboard Layout** | 🔴 High | Sidebar + header + content layout |
| **Auth Pages** | 🔴 High | Login, register, forgot password |
| **Settings Page** | 🟡 Medium | Multi-section settings layout |
| **E-commerce Product Grid** | 🟡 Medium | Product listing with filters |
| **Chat Interface** | 🟡 Medium | AI/messaging chat UI |
| **Kanban Board** | 🟢 Low | Drag & drop task board |
| **Calendar View** | 🟢 Low | Month/week/day calendar |
| **Email Client Layout** | 🟢 Low | Three-panel email interface |
| **Documentation Layout** | 🟢 Low | Docs site with sidebar nav |
