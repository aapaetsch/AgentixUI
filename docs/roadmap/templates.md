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
| **OptionsPositionsTable** | ✅ Complete | Extensible positions blotter with replaceable/appendable columns, custom row actions/cell renderers, currency, empty state, and forwarded `DataTable` props. |
| **AggregateGreeksStrip** | ✅ Complete | Net Greeks strip with selectable/ordered metrics, custom labels/header/empty content, currency, layout, density, and loading controls. |
| **OptionPositionCard** | ✅ Complete | Composable position card with section visibility, currency/labels/header slot, and forwarded payoff, breakeven, and Greeks props. |
| **OptionsChain** | ✅ Complete | Controlled/uncontrolled expiry and strike chain with replaceable columns/header, currency/expiry formatting, labels, and configurable strike navigator. |
| **PayoffBundleCard** | ✅ Complete | Risk snapshot with configurable price sampling, currency/labels/header slot, section visibility, and forwarded diagram/breakeven props. |
| **MultiLegOrderTicket** | ✅ Complete | Controlled/uncontrolled spread and legs, custom spread factory/preview, labels/currency, and forwarded selector, leg-row, and payoff props. |

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
